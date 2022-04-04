import * as cor from "cors";
import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { UserAccounts } from "./models/user";

const cors = cor();

export const createNewAccount = functions.https.onRequest( (req, res) => {
    cors( req, res, async () =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const user = req.body as UserAccounts;
        console.log(user)
        try{
            await addDoc(collection(db, "Accounts", user.userId), user);
        }catch(error){
            console.log(error)
        }
    })
})