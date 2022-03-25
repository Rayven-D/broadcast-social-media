import * as application from "firebase/app"
import * as functions from "firebase-functions";

const firebaseConfig = {
    apiKey: functions.config().fb_config.api_key,
    authDomain: functions.config().fb_config.auth_domain,
    projectId: functions.config().fb_config.project_id,
    storageBucket: functions.config().fb_config.storage_bucket,
    messagingSenderId: functions.config().fb_config.messaging_sender_id,
    appId: functions.config().fb_config.app_id,
    measurementId: functions.config().fb_config.measurement_id
};
let app = application.initializeApp(firebaseConfig);
export const initApp = () => {
    return app;
}