import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import * as functions from "firebase-functions";
import * as cor from "cors";
import * as initalize from './initApp';
import { User } from "./models/user";

const cors = cor()


export const loginUser = functions.https.onRequest( (req, res) => {
    const app = initalize.initApp();
    const auth = getAuth(app);

    
    cors( req, res, () =>{ 
        let username:string = req.body.username;
        let password:string = req.body.password;

        let user: User;

        signInWithEmailAndPassword( auth, username, password)
            .then((userCredential) => {
                user = {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    createdAt: userCredential.user.metadata.creationTime
                };
                res.send(user);
            }).catch( (reason) => {
                res.send(reason);
            })
    })
})

export const createNewUser = functions.https.onRequest( (req, res) => {
    const app = initalize.initApp();
    const auth = getAuth(app);

    cors( req, res, () => {
        let username:string = req.body.username;
        let password:string = req.body.password;

        let user = null;
        createUserWithEmailAndPassword( auth, username, password)
            .then( (userCredential) => { 
                user = {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    createdAt: userCredential.user.metadata.creationTime
                };
                res.send(user);
            })
            .catch( (reason) => {
                res.send(reason);
            })
    })
})