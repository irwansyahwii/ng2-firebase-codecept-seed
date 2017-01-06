import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

import * as Rx from 'rxjs/Rx';

declare let $:any;

/**
 * Contains all functionalities to block the UI and show/close toast messages
 */
export class ToastService{
    private static toastyService:ToastyService;
    private static toastyConfig: ToastyConfig;

    private static defaultOptions:ToastOptions = {
        title: "Wanderful Web",
        msg: "",
        showClose: true,
        timeout: 5000,
        theme: 'default'

    };    

    /**
     * Close all toasts when the parameter is true
     */
    private static isCloseAllToasts(closeAllToasts:boolean):Rx.Observable<void>{
        return Rx.Observable.from([closeAllToasts])
                .flatMap((isCloseAllToasts:boolean) => {
                    if(isCloseAllToasts){
                        return ToastService.closeAll();
                    }
                    else{
                        return Rx.Observable.from([null]);
                    }
                });        
    }


    /**
     * Show an error message
     */
    public static showError(err:Error, closeAllToasts:boolean = true):Rx.Observable<number>{
        return ToastService.showErrors([err + '']);
    }

    /**
     * Show a list of error messages
     */
    public static showErrors(errors:string[], closeAllToasts:boolean = true):Rx.Observable<number>{

        let showErrorsObservable:Rx.Observable<number> = Rx.Observable.from(errors)
                                                            .flatMap((error:string) =>  {
                                                                return Rx.Observable.create(s => {
                                                                    let option:ToastOptions = ToastService.copyDefaultOptions();
                                                                    option.msg = error;

                                                                    option.onAdd = (toast:ToastData) =>{
                                                                        s.next(toast.id);
                                                                        s.complete();
                                                                    }

                                                                    option.timeout = 5000;
                                                                    this.toastyService.error(option);
                                                                })

                                                            })
                                                            .map((toastId:number) => toastId);
        
        return ToastService.isCloseAllToasts(closeAllToasts)
                    .flatMap(() => showErrorsObservable)

    }

    /**
     * Close all toasts
     */
    public static closeAll():Rx.Observable<void>{
        return Rx.Observable.create(s => {
            try {
                ToastService.toastyService.clearAll();

                s.next();
                s.complete();
                
            } catch (error) {
                s.error(error);                
            }
        })
    }

    /**
     * Close all toasts and unblock the UI
     */
    public static closeAllAndUnblockUI():Rx.Observable<void>{
        return ToastService.closeAll()
                    .flatMap(() => ToastService.unblockUI());
    }

    /**
     * Initialize the service. Should be called in AppModule
     */
    public static init(toastyService:ToastyService, toastyConfig: ToastyConfig){
        ToastService.toastyService = toastyService;
        ToastService.toastyConfig = toastyConfig;
        
        this.toastyConfig.theme = 'material';        

    }

    /**
     * Copy the default toast options
     */
    private static copyDefaultOptions():ToastOptions{
        let result:any = {};

        Object.assign(result, ToastService.defaultOptions);

        return result;
    }

    /**
     * Show a wait toast with default message and default options
     */
    public static showDefaultWaitToast():Rx.Observable<number>{
        return ToastService.showWaitToast("Please wait...");
    }

    /**
     * Show the default wait toast message and block the UI
     */
    public static showDefaultWaitToastAndBlockUI():Rx.Observable<number>{
        return ToastService.blockUI()
                    .flatMap(() => ToastService.showDefaultWaitToast());
    }

    /**
     * Show a waiting toast.
     * Return the id of the toast that can be used to close the toast.
     */
    public static showWaitToast(message:string, timeout:number = null, title:string = "Wanderful Web"):Rx.Observable<number>{

        return Rx.Observable.create(s => {
            let option:ToastOptions = ToastService.copyDefaultOptions();
            option.msg = message;

            title = title || null;
            if(title !== null){
                option.title = title;
            }

            option.onAdd = (toast:ToastData) =>{
                s.next(toast.id);
                s.complete();
            }

            option.timeout = timeout;
            this.toastyService.wait(option);
        })
    }

    /**
     * Close a toast by passing its id.
     */
    public static closeToast(id:number):Rx.Observable<void>{
        return Rx.Observable.create(s =>{
            this.toastyService.clear(id);
            s.next();
            s.complete();
        })
    }

    /**
     * Block the entire user interface.
     * Call unblockUI() to unblock
     */
    public static blockUI():Rx.Observable<void>{
        $.blockUI({message:""});

        return Rx.Observable.from([null]);
    }

    /**
     * Unblock the user interfaces
     */
    public static unblockUI():Rx.Observable<void>{
        $.unblockUI({message:""});

        return Rx.Observable.from([null]);
    }
}