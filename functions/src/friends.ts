import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { Friend, FriendRequest } from "./models/friends";
import { UserAccounts } from "./models/user";

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

export const addFriend = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);        
        const friendRequest: FriendRequest = req.body.friendRequest
        try{
            await deleteDoc( doc(db, "Account", friendRequest.fromID, "FriendRequests", friendRequest.toID));
            await deleteDoc( doc(db, "Account", friendRequest.toID, "FriendRequests", friendRequest.fromID));
            const toDocSnap = await getDoc(doc(db, "Account", friendRequest.toID));
            const fromDocSnap = await getDoc(doc(db, "Account", friendRequest.fromID));
            const toDocData: UserAccounts = toDocSnap.data() as UserAccounts;
            const fromDocData: UserAccounts = fromDocSnap.data() as UserAccounts;
            const todaysDate: Date = new Date();
            const toNewFriend: Friend = {
                firstName: toDocData.firstName,
                lastName: toDocData.firstName,
                dob: toDocData.dob,
                userId: toDocData.userId,
                accountName: toDocData.accountName,
                imageURL: toDocData.imageURL,
                email: toDocData.email,
                since: todaysDate.toDateString()
            }
            const fromNewFriend: Friend = {
                firstName: fromDocData.firstName,
                lastName: fromDocData.firstName,
                dob: fromDocData.dob,
                userId: fromDocData.userId,
                accountName: fromDocData.accountName,
                imageURL: fromDocData.imageURL,
                email: fromDocData.email,
                since: todaysDate.toDateString()
            }
            await setDoc( doc(db, "Account", toNewFriend.userId, "Friends", fromNewFriend.userId), fromNewFriend)
            await setDoc( doc(db, "Account", fromNewFriend.userId, "Friends", toNewFriend.userId), toNewFriend);
            res.send(true)
        }
        catch(error){
            console.log("Failed to accept request")
            console.error(error);
            res.send(error);
        }
    })
})

export const denyFriendRequest = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);        
        const friendRequest: FriendRequest = req.body.friendRequest
        try{
            await deleteDoc( doc(db, "Account", friendRequest.fromID, "FriendRequests", friendRequest.toID));
            await deleteDoc( doc(db, "Account", friendRequest.toID, "FriendRequests", friendRequest.fromID));
            res.send(true)
        }
        catch(error){
            console.log("Failed to deny friend request")
            console.error(error);
            res.send(error);
        }
    })
})