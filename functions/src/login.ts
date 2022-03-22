import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import * as functions from "firebase-functions";
import * as cors from "cors";

const cor = cors()


export const loginUser = functions.https.onRequest( (req, res) => {
    
    const auth = getAuth();
    
    cor( req, res, () =>{
        let username:string = req.body.username;
        let password:string = req.body.password;

        let user = null;

        signInWithEmailAndPassword( auth, username, password)
            .then((userCredential) => {
                user  = userCredential.user;
            })
            .catch( (error) => {
                createUserWithEmailAndPassword(auth, username, password)
                    .then( (userCredentials) => {
                        user = userCredentials.user;
                    })
            })
        if(user)
            res.send(user);
        else
            res.sendStatus(500)

    })
})