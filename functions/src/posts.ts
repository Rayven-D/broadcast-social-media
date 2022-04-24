import * as cor from "cors";
import { initializeApp } from "firebase/app";
import {  collection,addDoc, getFirestore, updateDoc, doc, setDoc, query, orderBy, getDocs, Timestamp} from "firebase/firestore"
import * as functions from "firebase-functions";
import { firebaseConfig } from './config'
import { Posts } from "./models/posts";
import { Friend } from "./models/friends";

const cors = cor();

export const createNewPost = functions.https.onRequest( (req, res) => {
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const newPost: Posts = req.body.newPost;
        try{
            if(!newPost.dateCreated){
                newPost.dateCreated = new Date();
            }
            
            const docRef = await addDoc( collection(db, "Account", newPost.userID, "Posts"), newPost);
            await updateDoc( docRef, {
                postID: docRef.id
            })
            newPost.postID = docRef.id;
            if(newPost.public){
                await setDoc( doc(db, 'Posts', newPost.postID), newPost);
            }
            res.send(true);
        }catch(error){
            console.log("Failed to create post")
            console.error(error);
            res.send(error)
        }
    })
})

export const getPostsByUserId = functions.https.onRequest( (req, res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const userID = req.body.userID;
        try{
            const postCollection = await collection(db, 'Account', userID, 'Posts');
            let q = await query(postCollection, orderBy("dateCreated", 'desc'));
            let querySnapshot = await getDocs(q);
            let userPosts: Posts[] = [];
            querySnapshot.forEach( (doc) =>{
                let temp = doc.data();
                let date = (temp.dateCreated as Timestamp).toDate();
                let newPost = doc.data() as Posts;
                newPost.dateCreated = date;
                userPosts.push(newPost)
            })
            res.send(userPosts)
        }catch(error){
            console.log("Error fetching posts by user id");
            console.error(error);
            res.send(error);
        }

    })
})

export const getFeedPostsForUserId = functions.https.onRequest( (req, res) =>{
    cors( req, res, async() =>{
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        const userID = req.body.userID;
        try{
            const friendCollection = await collection(db, 'Account', userID, 'Friends');
            let friendQuery = await query(friendCollection);
            let friendQuerySnapshot = await getDocs(friendQuery);
            let friendsIDs: string[] = [];
            friendQuerySnapshot.forEach( (doc) =>{
                friendsIDs.push( (doc.data() as Friend).userId )
            })
            let posts: Posts[] = [];
            friendsIDs.forEach( async (friendID) =>{
                const postCollection = await collection(db, 'Account', friendID, 'Posts');
                let q = await query(postCollection, orderBy("dateCreated", 'desc'));
                let querySnapshot = await getDocs(q);
                if(!querySnapshot.empty){
                    querySnapshot.forEach( (doc) => {
                        let temp = doc.data();
                        let date = (temp.dateCreated as Timestamp).toDate();
                        let newPost = doc.data() as Posts;
                        newPost.dateCreated = date;
                        posts.push(newPost)
                    })
                }
            })
            
            const postPublicCollection = await collection(db, 'Posts');
            let publicQueue = await query(postPublicCollection, orderBy('dateCreated', 'desc'));
            let publicQuerySnapshot = await getDocs(publicQueue);
            publicQuerySnapshot.forEach( (doc) =>{
                let tempPost: Posts = doc.data() as Posts;
                let found = posts.some( _ => _.postID === tempPost.postID);
                if(!found){
                    let temp = doc.data();
                    let date = (temp.dateCreated as Timestamp).toDate();
                    let newPost = doc.data() as Posts;
                    newPost.dateCreated = date;
                    posts.push(newPost)
                }
            })

            posts.sort( (a,b) => {
                let da = a.dateCreated as Date;
                let db = b.dateCreated as Date;
                return da < db ? 1 : -1;
            });
            res.send(posts)
        }catch(error){
            console.log("Error fetching posts by user id");
            console.error(error);
            res.send(error);
        }

    })
})
