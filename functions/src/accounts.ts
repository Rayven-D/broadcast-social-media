import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { UserAccounts } from "./models/user";
import { getStorage, getDownloadURL, ref } from 'firebase/storage'

const cors = cor({origin: true});

export const createNewAccount = functions.https.onRequest( (req, res) => {
    cors( req, res, async () =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app)
        const user:UserAccounts =  req.body.account;
        user.imageURL = await getDownloadURL(ref(storage, "default.jpeg"))
        try{
            await setDoc(doc(db, "Account", user.userId), user)
            res.send(true)
        }catch(error){
            console.log(error)
            res.send(error)
        }
    })
})

export const getAccount = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);

        const userId = req.body.userId;
        
        const docSnap = await getDoc( doc(db, "Account", userId ));
        if(docSnap.exists()){
            console.log("docSnap exists!");
            const user:UserAccounts = docSnap.data() as UserAccounts;
            if(user.imageURL === undefined){
                user.imageURL = await getDownloadURL(ref(storage, "default.jpeg"))
            }
            res.send(user);
        }
        else{
            console.log("Document does not exists")
            res.sendStatus(500);
        }
    })
})

export const getAllAccounts = functions.https.onRequest( (req, res) =>{
    cors( req, res, async () => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);

        const userId = req.body.userId;
        let accounts: UserAccounts[] = [];
        try{
            const q = query(collection(db, "Account"), where("userId", "!=", userId));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach( (doc) =>{
                accounts.push(doc.data() as UserAccounts)
            })
            res.send(accounts);
        }
        catch(error){
            res.send(error)
        }

    })
})