import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  collection,addDoc, getFirestore, updateDoc } from "firebase/firestore"
import * as functions from "firebase-functions";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from './config'
import { Posts } from "./models/posts";

const cors = cor();

export const createNewPost = functions.https.onRequest( (req, res) => {
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);
        const newPost: Posts = req.body.newPost;
        try{
            if(newPost.imageFile){
                const storageRef = ref(storage);
        
                await uploadBytes(storageRef, newPost.imageFile as File)
                
                newPost.imageURL = await getDownloadURL(ref(storage, newPost.imageFile!.name));
                newPost.imageFile = undefined;
            }

            if(!newPost.dateCreated){
                newPost.dateCreated = new Date();
            }
            
            const docRef = await addDoc( collection(db, "Account", newPost.userID, "Posts"), newPost);
            await updateDoc( docRef, {
                postID: docRef.id
            })
            newPost.postID = docRef.id;
            if(newPost.public){
                await addDoc( collection(db, "Posts"), newPost);
            }
            res.send(true);
        }catch(error){
            console.log("Failed to create post")
            console.error(error);
            res.send(error)
        }
    })
})