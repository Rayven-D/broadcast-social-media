import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  collection, doc, getDocs, getFirestore, query, setDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { Friend, FriendRequest } from "./models/friends";

const cors = cor();

export const sendFriendRequest = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);        
        const fromId: string = req.body.fromId;
        const toId: string = req.body.toId;
        const date: Date = new Date() 
        let newFriendRequest: FriendRequest = {
            fromID: fromId,
            toID: toId,
            created: date.toDateString()
        }

        try{
            await setDoc( doc(db, "Account", fromId, "FriendRequests", toId),  newFriendRequest);
            await setDoc( doc(db, "Account", toId, "FriendRequests", fromId),  newFriendRequest);
            res.send(true)
        }
        catch(error){
            console.log("Send Friend Request Error")
            console.error(error);
            res.send(false);
        }
    })
})

export const getFriendsList = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);        
        const userId = req.body.userId
        try{
            const friendCollection = await collection(db, "Account", userId, "Friends")
            let q = await query(friendCollection);
            let querySnapshot = await getDocs(q);
            let friendsList: Friend[] = [];
            querySnapshot.forEach( (doc) =>{
                friendsList.push(doc.data() as Friend)
            })
            res.send(friendsList)
        }
        catch(error){
            console.log("No Friends")
            console.error(error);
            res.send([]);
        }
    })
})

export const getFriendRequestsList = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);        
        const userId = req.body.userId
        try{
            const friendCollection = await collection(db, "Account", userId, "FriendRequests")
            let q = await query(friendCollection);
            let querySnapshot = await getDocs(q);
            let friendsList: FriendRequest[] = [];
            querySnapshot.forEach( (doc) =>{
                friendsList.push(doc.data() as FriendRequest)
            })
            res.send(friendsList)
        }
        catch(error){
            console.log("No Friends")
            console.error(error);
            res.send([]);
        }
    })
})