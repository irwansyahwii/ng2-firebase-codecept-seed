import {Injectable, Inject} from '@angular/core';
import {CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot} from '@angular/router';
import {isAlreadyLoggedIn} from './LoginService';


import * as Rx from 'rxjs/Rx';

@Injectable()
export class LoggedOutChecker implements CanActivate{
    constructor(private router: Router){
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Rx.Observable<boolean>{
        return isAlreadyLoggedIn()
                    .map((loggedIn:boolean) => {                        
                        if(loggedIn){
                            this.router.navigate(['/home']);
                        }

                        return !loggedIn;
                        
                    })

    }
}