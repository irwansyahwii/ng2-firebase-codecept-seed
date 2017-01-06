import * as admin from 'firebase-admin';
import {FirebaseService} from '../src/services';
const serviceAccount = require('./firebase-admin-key.json');
import {AngularFireDatabase, FirebaseAppConfig} from 'angularfire2';


export class ServerSideFirebase{
    private static _instance:{auth:any, database:any} = null;


    public static initFirebaseService(){
        FirebaseService.initInstance(ServerSideFirebase.getInstance());
    }

    public static getInstance(): {auth:any, database:any}{
        if(ServerSideFirebase._instance === null){
            const databaseURL = 'https://wanderful-bae91.firebaseio.com/';

            let app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: databaseURL
            });

            let config:FirebaseAppConfig = {
                apiKey: serviceAccount.private_key,
                authDomain: databaseURL,
                databaseURL: databaseURL,
                storageBucket: databaseURL                
            }

            let db:AngularFireDatabase = new AngularFireDatabase(config, app)

            ServerSideFirebase._instance = {
                auth: app.auth(),
                database: app.database()
            }
        }

        return ServerSideFirebase._instance;
    }

    public static clearBucket(bucketName:string){
        return ServerSideFirebase._instance.database.ref(bucketName).set({});
                // .then(()=>{
                //     console.log('bucket cleared')
                // })
                // .catch(err => {
                //     console.log('ERROR:', err);
                // })
    }
}