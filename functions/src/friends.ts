import * as cor from "cors";
import * as functions from "firebase-functions";

const cors = cor({origin: true});

export const sendFriendRequest = functions.https.onRequest( (req, res) =>{
    
})