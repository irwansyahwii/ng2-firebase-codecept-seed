import * as Rx from 'rxjs/Rx';

declare let require:any;

const CSV = require('csv-string');

/**
 * Convert any object or array to a csv string
 */
export function ObjectOrArrayToCsv(source:Object | Array<any>, separator:string = ","):Rx.Observable<string>{
    return Rx.Observable.create(s =>{
        try {
            let result:string = CSV.stringify(source, separator);

            s.next(result);
            s.complete();
        } catch (error) {
            s.error(error);
        }        
    })
}

/**
 * Convert a csv string into an array of array of string columns
 */
export function CsvToStringArray(sourceCsv:string, separator:string = ","):Rx.Observable<string[][]>{
    return Rx.Observable.create(s => {
        try {
            let result:string[] = CSV.parser(sourceCsv, separator);

            s.next(result);
            s.complete();
        } catch (error) {
            s.error(error);            
        }
    })
}