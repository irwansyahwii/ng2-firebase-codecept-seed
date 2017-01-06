import * as Rx from 'rxjs/Rx';

declare let require:any;
let localStorage = require('local-storage');

const LOGIN_TOKEN_NAME = "id_token";


export function getToken(tokenName):Rx.Observable<any>{

    return Rx.Observable.create(s => {
        let token = null
        
        try {
            token = localStorage.get(tokenName) || null;

            s.next(token);
            s.complete();        
        } catch (error) {
            s.error(error);
        }


    })
}

export function setToken(tokenName:string, token:any):Rx.Observable<void>{
    return Rx.Observable.create(s => {
        try {
            localStorage.set(tokenName, token);

            s.next();
            s.complete();                    
        } catch (error) {
            s.error(error);
        }
    })
}