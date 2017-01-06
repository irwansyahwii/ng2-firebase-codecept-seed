import * as firebase from "firebase";
import {AngularFire, AngularFireModule, AngularFireAuth, AngularFireDatabase} from 'angularfire2';
import { ModuleWithProviders } from '@angular/core';

/**
 * Contains all the functionalities or utilities to Firebase
 */
export class FirebaseService{
    public static instance:ExtendedAngularFire = null;

    public static config = {
        apiKey: "AIzaSyDgi2uC6EylDyAao0ULvrA8YoBFjDrSja4",
        authDomain: "wanderful-bae91.firebaseapp.com",
        databaseURL: "https://wanderful-bae91.firebaseio.com",
        storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>",   
    }

    /**
     * Not used because the using version of Angular (or probably angular-cli) in this project rejects calling
     * a method in AppModule
     */
    public static initialize():ModuleWithProviders{
        return AngularFireModule.initializeApp(FirebaseService.config);
    }

    public static initInstance(af:{auth:any, database:any}){
        FirebaseService.instance = new ExtendedAngularFire(af);        
    }
}

export class ExtendedAngularFire{
    constructor(protected fire:{auth:any, database:any}){
    }

    public get auth():AngularFireAuth{
        return this.fire.auth;
    }

    public set auth(val:AngularFireAuth){{
        this.fire.auth = val;
    }}

    public get database():AngularFireDatabase{
        return this.fire.database;
    }


    public get app():firebase.app.App{
        let obj:any = this.database;

        return (obj.fbApp);
    }
}