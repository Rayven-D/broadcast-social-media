import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  doc, getDoc, getFirestore, collection, query, where, setDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { UserAccounts } from "./models/user";
import { getStorage, getDownloadURL, ref } from 'firebase/storage'
import { FriendRequest } from "./models/friends";

const cors = cor({origin: true});

export const sendFriendRequest = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);
        
        const fromId: string = req.body.fromId;
        const toId: string = req.body.toId;
        const date: Date = new Date() 
        let newFriendRequest: FriendRequest = {
            fromID: fromId,
            toID: toId,
            created: `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
        }

        try{
            await setDoc( doc(db, "Account", fromId, "Friends", toId),  newFriendRequest);
            res.sendStatus(200);
        }
        catch(error){
            console.log("Send Friend Request Error")
            console.error(error);
            res.send(error);
        }
    })
})