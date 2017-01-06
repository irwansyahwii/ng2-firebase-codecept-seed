import * as Rx from 'rxjs/Rx';
import validate from 'validate.js';

import * as firebase from "firebase";
import {FirebaseAuthState, AuthProviders, AuthMethods,FirebaseListFactory, FirebaseListObservable} from 'angularfire2';
import {OpaqueToken, ReflectiveInjector} from '@angular/core';
import {FirebaseService} from './FirebaseService';
import {ApiResponse} from '../models';

declare let require:any;

export interface IDataId{
    id:string;
}

export interface IUniqueIndex{
    getUniqueIndex():Rx.Observable<string>
}

export enum orderByEnum{
    orderByValue = 1,
    orderByChild = 2,
    orderByKey = 3,
    orderByPriority = 4
}

export enum SequentialPageDirectionEnum{
    backward = 1,
    forward = 2
}

/**
 * The response.data will contains the paged data
 */
export function getSequentialPageData<T extends IDataId>(bucketName:string, pageSize:number, 
    orderBy:orderByEnum, orderByChildKey:any, startValue:any, direction:SequentialPageDirectionEnum):Rx.Observable<ApiResponse>{

    return Rx.Observable.create(s => {
        let query:firebase.database.Query = FirebaseService.instance.database.list(bucketName).$ref;

        if(orderBy === orderByEnum.orderByKey){
            query = query.orderByKey();
        }
        else if(orderBy === orderByEnum.orderByChild){
            query = query.orderByChild(orderByChildKey);
        }
        else if(orderBy === orderByEnum.orderByPriority){
            query = query.orderByPriority();
        }
        else{
            query = query.orderByValue();
        }

        startValue = startValue || null;

        console.log('startValue:', startValue);

        if(direction === SequentialPageDirectionEnum.forward){
            if(startValue === null){
                query = query.limitToFirst(pageSize);
            }
            else{
                query = query.startAt(startValue).limitToFirst(pageSize);                
            }
        }
        else{
            if(startValue === null){
                query = query.limitToLast(pageSize);
            }
            else{
                query = query.endAt(startValue).limitToLast(pageSize);                
            }            
        }


        let response:ApiResponse = new ApiResponse();
        query
            .once("value")
            .then((snapshot:firebase.database.DataSnapshot) => {
                response.success = true;
                response.data = [];

                let objectRows = snapshot.val();

                if(objectRows !== null){
                    let keys:string[] = Object.keys(objectRows);

                    Rx.Observable.from(keys)
                        .defaultIfEmpty(null)
                        .map((key:string) => {
                            if(key !== null){
                                let val:any = objectRows[key] || null;

                                return val;
                            }
                            else{
                                return null;
                            }
                        })
                        .toArray()
                        .defaultIfEmpty([])
                        .subscribe((result:any[]) => {

                            if(result.length === 1){
                                if(startValue !== null){
                                    if(result[0].id === startValue){
                                        result = [];
                                    }
                                }
                            }

                            response.data = result;

                            s.next(response);
                            s.complete();
                            
                        })
                }
                else{
                    s.next(response);
                    s.complete();
                }

            })
            .catch(err =>{
                response.success = false;
                response.errors.push(err + '');

                s.next(response);
                s.complete();
            })
        
    })
}

export function removeExistingWhenKeyNotEmpty(bucketName:string, key:string):Rx.Observable<void>{
    if(key.length > 0){
        return Rx.Observable.create(s => {
            try {
                FirebaseService.instance.database.object(`${bucketName}/${key}`)
                    .remove()
                    .then(()=>{
                        s.next();
                        s.complete();
                    })
                    .catch(err => {
                        s.error(err);
                    })
                
            } catch (error) {
                s.error(error);                
            }
        })
    }
    else{
        return Rx.Observable.from([null]);
    }

}

export function emptyBucket(bucketName:string):Rx.Observable<void>{
    return Rx.Observable.create(s => {
        FirebaseService.instance.database.object(bucketName)
            .set({})
            .then(()=>{
                s.next();
                s.complete();
            })
            .catch(err => {
                s.error(err);
            })
    })
}

export function updateOrInsertData<T extends IDataId & IUniqueIndex>(model:T, bucketName:string):Rx.Observable<T>{


    let assignNewKeyWithData = (model:T, key:string) => {
        return Rx.Observable.create(s => {

            try {
                model.id = key;
                FirebaseService.instance.database.object(`${bucketName}/${key}`)
                    .set(model)
                    .then(()=>{
                        s.next();
                        s.complete();
                    })
                    .catch(err => {
                        s.error(err);
                    })
                
            } catch (error) {
                s.error(error);                
            }

        })
    }


    return removeExistingWhenKeyNotEmpty(bucketName, model.id)
            .flatMap(() => model.getUniqueIndex())
            .flatMap((encodedUniqueIndex:string) => assignNewKeyWithData(model, encodedUniqueIndex))
            .map(()=> model);
        
}

export function validateFields<T>(model:T, constraints:Object):Rx.Observable<string[]>{
    return Rx.Observable.create(s => {
            try {
                let errors:string[] = validate(model, constraints, {format:"flat"}) || [];

                s.next(errors);
                s.complete();

            } catch (error) {
                s.error(error);
            }
        });
}

export function isDataAlreadyExists(bucketName:string, key:string, currentId:string):Rx.Observable<boolean>{
    return Rx.Observable.create(s => {
        try {
            FirebaseService.instance.database.object(`${bucketName}/${key}`)
                .subscribe((r:any) => {
                    
                    if(r.$exists()){
                        if(r.id !== currentId){
                            s.next(true);
                        }
                        else{
                            s.next(false);
                        }
                        
                    }
                    else{
                        s.next(false);
                    }

                    s.complete();
                })
        } catch (error) {
            s.error(error);
        }
    })
    
}

export function validateSave<T extends IDataId & IUniqueIndex>(model:T, saveConstraints:Object, bucketName:string):Rx.Observable<string[]>{    

    return validateFields<T>(model, saveConstraints)
            .flatMap((errors:string[]) => {
                if(errors.length <= 0){
                    return model.getUniqueIndex()
                            .flatMap((encodedUniqueIndex:string) => isDataAlreadyExists(bucketName, encodedUniqueIndex, model.id))
                            .map((isDataAlreadyExists:boolean) => {
                                if(isDataAlreadyExists){
                                    errors.push("Data already exists");
                                }

                                return errors;
                            })
                }
                else{
                    return Rx.Observable.from([errors]);
                }
            })
                
}


export function saveData<T extends IDataId & IUniqueIndex>(bucketName:string, model:T, saveConstraints:Object):Rx.Observable<ApiResponse>{
    let response:ApiResponse = new ApiResponse();

    return validateSave<T>(model, saveConstraints, bucketName)
                .flatMap((errors:string[]) => {
                    if(errors.length <= 0){
                        return updateOrInsertData<T>(model, bucketName)
                                .map(()=>{
                                    response.success = true;
                                    response.errors = [];

                                    return response;
                                    
                                })
                    }
                    else{
                        response.success = false;
                        response.errors = errors;

                        return Rx.Observable.from([response]);
                    }
                })
}

export function validateDelete<T extends IDataId & IUniqueIndex>(model:T, deleteConstraints:Object, bucketName:string):Rx.Observable<string[]>{    

    return validateFields<T>(model, deleteConstraints)
            .flatMap((errors:string[]) => {
                if(errors.length <= 0){
                    return model.getUniqueIndex()
                            .flatMap((encodedUniqueIndex:string) => isDataAlreadyExists(bucketName, encodedUniqueIndex, model.id))
                            .map((isDataAlreadyExists:boolean) => {
                                if(!isDataAlreadyExists){
                                    errors.push("Data not found or already deleted");
                                }

                                return errors;
                            })
                }
                else{
                    return Rx.Observable.from([errors]);
                }
            })
                
}

export function deleteData<T extends IDataId & IUniqueIndex>(bucketName:string, model:T, deleteConstraints:Object):Rx.Observable<ApiResponse>{
    let response:ApiResponse = new ApiResponse();

    return validateDelete<T>(model, deleteConstraints, bucketName)
                .flatMap((errors:string[]) => {
                    if(errors.length <= 0){
                        return model.getUniqueIndex()
                                .flatMap((uniqueIndex:string) => removeExistingWhenKeyNotEmpty(bucketName, uniqueIndex)) 
                                .map(()=>{
                                    response.success = true;
                                    return response;
                                })
                    }
                    else{
                        response.success = false;
                        response.errors = errors;

                        return Rx.Observable.from([response]);
                    }
                })

}

export function getObjectByKey(bucketName:string, key:string):Rx.Observable<any>{
    return Rx.Observable.create(s => {
        try {
            FirebaseService.instance.database.object(`${bucketName}/${key}`)
                .$ref
                .once("value")
                .then((value:firebase.database.DataSnapshot) => {
                    s.next(value.val());
                    s.complete();
                })
                .catch(err => {
                    s.error(err);
                })
        } catch (err) {
            s.error(err);
        }        
    })
}

export function getObject<T extends IDataId & IUniqueIndex>(bucketName:string, model: T):Rx.Observable<ApiResponse>{

    return model.getUniqueIndex()
            .flatMap((uniqueIndex:string) => getObjectByKey(bucketName, uniqueIndex))
            .map((object:any)=>{
                let response:ApiResponse = new ApiResponse();
                response.success = true;
                response.data = object;

                return response;                
            })
}

