import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
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
            let chatId = docRef.id;
            await updateDoc( docRef, {
                chatId: docRef.id
            })

            chat.users.forEach( async (user) =>{
                await updateDoc( doc(db, 'Account', user),{
                    chats: arrayUnion(chatId)
                })
            })

            res.send(true);
        }catch(error){
            console.log(error);
            res.send(false)
        }
    })
})

export const deleteChat = functions.https.onRequest( (req, res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const chat: Chat = req.body.chat;

        try{
            await deleteDoc(doc(db, 'Chats', chat.chatId as string))
            
            chat.users.forEach( async userId =>{
                await updateDoc(doc(db, 'Account', userId),{
                    chats: arrayRemove(chat.chatId as string)
                })
            })

            res.send(true);
        }catch(error){
            console.log(error);
            res.send(false)
        }
    })
})

export const getChats = functions.https.onRequest( (req,res) =>{
    cors(req,res, async () =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const userId: string = req.body.userId;

        try{
            const chatIds: string[] = (await getDoc(doc(db, 'Account', userId))).data()?.chats as string[] ?? [];
            let chats: Chat[] = []
            chatIds.forEach( async (id, index) =>{
                let chat =  (await getDoc(doc(db, 'Chats', id))).data() as Chat
                chats.push(chat);
                if(index + 1 >= chatIds.length)
                    res.send(chats);
            })
        }catch(error){
            console.log(error);
            res.send(false)
        }
    })
})

