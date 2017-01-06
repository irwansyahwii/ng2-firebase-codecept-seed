import * as Rx from 'rxjs/Rx';

declare let require:any;

const base64 = require("base-64");

/**
 * Encode the unique index to be able to be stored in Firebase as a key
 */
export function encodeUniqueIndex(uniqueIndex:string):Rx.Observable<string>{
    return Rx.Observable.create(s => {
        try {
            let result:string = base64.encode(uniqueIndex);

            s.next(result);
            s.complete();
        } catch (error) {
            s.error(error);            
        }
    })
}

/**
 * Decode an encoded unique index to its original format
 */
export function decodeUniqueIndex(encodedUniqueIndex:string):Rx.Observable<string>{
    return Rx.Observable.create(s => {
        try {
            let result:string = base64.decode(encodedUniqueIndex);

            s.next(result);
            s.complete();
        } catch (error) {
            s.error(error);            
        }
    })
}