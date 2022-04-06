import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  doc, getFirestore, setDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { UserAccounts } from "./models/user";

const cors = cor({origin: true});

export const createNewAccount = functions.https.onRequest( (req, res) => {
    cors( req, res, async () =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const user:UserAccounts =  req.body.account;
        try{
            await setDoc(doc(db, "Account", user.userId), user)
            res.send(true)
        }catch(error){
            console.log(error)
            res.send(error)
        }
    })
})