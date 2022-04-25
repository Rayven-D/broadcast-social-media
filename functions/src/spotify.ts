import * as cor from "cors";
import { initializeApp } from "firebase/app";
import * as functions from "firebase-functions";
import { firebaseConfig } from './config';
import {SpotifyWebApi} from 'spotify-web-api-ts'
import { SpotifyGrant } from "./models/spotify";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

var spotifyApi = new SpotifyWebApi({
    clientId: functions.config().spotify.client_id,
    clientSecret: functions.config().spotify.client_secret,
    redirectUri: 'http://localhost:4200/spotify-redirect'
})


const cors = cor();


export const linkSpotifyAccount = functions.https.onRequest( (req, res) =>{
    cors( req,res, async () =>{
        let state = req.body.userId;

        res.send(spotifyApi.getRefreshableAuthorizationUrl({scope: ['user-read-currently-playing','user-modify-playback-state','streaming', 'user-read-playback-state'], state: state}));
    })
})

export const requestAccessToken = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () =>{
        let code = req.body.code || null;
        let state = req.body.state || null;

        if(state){
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            let response: SpotifyGrant = await spotifyApi.getRefreshableUserTokens(code);

            await setDoc( doc(db, 'Account', state, 'Spotify', "token"), response);

            res.send(response)
        }
        else{
            res.send(false)
        }
    });
})

export const getAccessToken = functions.https.onRequest( (req,res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const userId = req.body.userId;
        try{
            let docSnapshot = await getDoc(doc(db, 'Account', userId, 'Spotify', 'token'))
            if(docSnapshot.exists()){
                const spotifyToken: SpotifyGrant = docSnapshot.data() as SpotifyGrant;
                res.send(spotifyToken)
            }else{
                res.send(false);
            }
        }catch(error){
            functions.logger.error(error);
            res.send(error)
        }
    })
})

export const refreshAccessToken = functions.https.onRequest( (req,res) =>{
    cors(req, res, async() =>{
        let userId = req.body.userId ?? null;

        if(userId){
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            let docSnapshot = await getDoc(doc(db, 'Account', userId, 'Spotify', 'token'))
            if(docSnapshot.exists()){
                const spotifyToken: SpotifyGrant = docSnapshot.data() as SpotifyGrant;
                try{
                    let resp: SpotifyGrant = await spotifyApi.getRefreshedAccessToken(spotifyToken.refresh_token as string);
                    await setDoc( doc(db, 'Account', userId, 'Spotify', "token"), resp);
                    res.send(resp)
                }catch(error){
                    console.error(error);
                    res.send(error)
                }
            }else{
                console.log("Token document does not exist");
                res.send(false)
            }
        }
        else{
            console.log("No UserId provided")
            res.send(false)
        }

    })
})