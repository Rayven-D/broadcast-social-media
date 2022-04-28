import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  addDoc, collection, getFirestore, updateDoc } from "firebase/firestore"
import * as functions from "firebase-functions"
import { firebaseConfig } from './config'
import { Chat, Message } from "./models/chats";

const cors = cor();

export const sendMessage = functions.https.onRequest( (req, res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const chatId: string = req.body.chatId;
        const message: Message = req.body.message; 

        try{
            const chatMessagesCollection = await collection(db, 'Chats', chatId, 'Messages');
            message.timestamp = new Date();

            await addDoc(chatMessagesCollection, message);
            res.send(true);
        }catch(error){
            console.log(error);
            res.send(false)
        }
    })
})

export const createChat = functions.https.onRequest( (req, res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const chat: Chat = req.body.chat;

        try{
            const chatMessagesCollection = await collection(db, 'Chats');

            const docRef = await addDoc(chatMessagesCollection, chat);
            await updateDoc( docRef, {
                chatId: docRef.id
            })
            res.send(true);
        }catch(error){
            console.log(error);
            res.send(false)
        }
    })
})

