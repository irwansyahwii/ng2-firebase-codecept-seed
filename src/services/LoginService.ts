import * as Rx from 'rxjs/Rx';

import validate from 'validate.js';

import {FirebaseAuthState, AuthProviders, AuthMethods} from 'angularfire2';
import {OpaqueToken, ReflectiveInjector} from '@angular/core';
import {FirebaseService} from './FirebaseService';

import {LoginModel, ApiResponse} from '../models';

const loginConstraints = {
    email:{
        presence: true,
        email:true
    },
    password:{
        presence:true
    }
}


/**
 * Check if the current user already logged in or not.
 */
export function isAlreadyLoggedIn():Rx.Observable<boolean>{
    return FirebaseService.instance.auth 
            .map((value:FirebaseAuthState) => {
                value = value || null;

                return (value !== null);
            })
                
}

/**
 * Validate the login model.
 * 
 * Return an array of error messages.
 */
export function validateLogin(model:LoginModel):Rx.Observable<string[]>{
    return Rx.Observable.create(s => {

        try {
            let errors:string[] = validate(model, loginConstraints, {format:"flat"}) || [];

            s.next(errors);
            s.complete();
            
        } catch (err) {
            s.error(err);            
        }
    })
}

function _doLogin(model:LoginModel):Rx.Observable<ApiResponse>{
    return Rx.Observable.create(s => {        
        let response:ApiResponse = new ApiResponse();        

        FirebaseService.instance.auth.login(model, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            })
            .then((auth:FirebaseAuthState) => {
                response.success = true;
                response.data.auth = auth;

                s.next(response);
                s.complete();                                
            })
            .catch((err:Error) => {
                console.log('error:', err);
                response.errors.push(err + '');                

                s.next(response);
                s.complete();                
            })
            
    })    
}

/**
 * Logging in the user with the passed credentials.
 * 
 * When success the auth info will be in response.data.auth.
 * 
 * When faield the errors will be in response.errors;
 */
export function login(model:LoginModel):Rx.Observable<ApiResponse>{

    return validateLogin(model)
        .flatMap((errors:string[]) => {
            if(errors.length <= 0){
                return _doLogin(model);
            }
            else{
                let response:ApiResponse = new ApiResponse();
                response.success = false;
                response.errors = errors; 
                return Rx.Observable.from([response]);
            }
        })


}