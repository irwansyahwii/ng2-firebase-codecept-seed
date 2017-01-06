import {Injectable, Inject} from '@angular/core';
import {CanActivate, Router,
        ActivatedRouteSnapshot,
        RouterStateSnapshot} from '@angular/router';
import * as Rx from 'rxjs/Rx';
import {isAlreadyLoggedIn} from './LoginService';

@Injectable()
export class AlreadyLoggedInChecker implements CanActivate{
    constructor(private router: Router){
    }


    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Rx.Observable<boolean>{
        return isAlreadyLoggedIn()
                    .map((loggedIn:boolean) => {
                        if(!loggedIn){
                            this.router.navigate(['/login']);
                        }
                        
                        return loggedIn;
                    });
    }
}