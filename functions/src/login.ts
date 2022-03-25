import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, setPersistence, browserLocalPersistence,  } from "firebase/auth";
import * as functions from "firebase-functions";
import * as cor from "cors";
import * as initalize from './initApp';
import { User } from "./models/user";

const cors = cor()

let user: User;

export const loginUser = functions.https.onRequest( (req, res) => {
    const app = initalize.initApp();
    const auth = getAuth(app);

    
    cors( req, res, () =>{ 
        let username:string = req.body.username;
        let password:string = req.body.password;

        setPersistence( auth, browserLocalPersistence).then( () =>{
            signInWithEmailAndPassword( auth, username, password)
                .then((userCredential) => {
                    user = {
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                        createdAt: userCredential.user.metadata.creationTime
                    };
                    res.send(user);
                }).catch( (reason) => {
                    res.send(reason);
                })
        })
    })
})

export const createNewUser = functions.https.onRequest( (req, res) => {
    const app = initalize.initApp();
    const auth = getAuth(app);

    cors( req, res, () => {
        let username:string = req.body.username;
        let password:string = req.body.password;

        setPersistence( auth, browserLocalPersistence).then( () =>{
            createUserWithEmailAndPassword( auth, username, password)
                .then((userCredential) => {
                    user = {
                        uid: userCredential.user.uid,
                        email: userCredential.user.email,
                        createdAt: userCredential.user.metadata.creationTime
                    };
                    res.send(user);
                }).catch( (reason) => {
                    res.send(reason);
                })
        })
    })
})

export const isLoggedIn = functions.https.onRequest( (req, res) => {
    const app = initalize.initApp();
    const auth = getAuth(app);

    cors( req, res, () => {
        onAuthStateChanged( auth, (user) => {
            console.log(user, "lol")
            if(user){
                res.send(true)
            }else{
                res.send(false);
            }
        })
    })
})