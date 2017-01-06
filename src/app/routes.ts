import { Routes, RouterModule } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';

import {VouchersComponent} from './vouchers/vouchers.component';

import {AlreadyLoggedInChecker, LoggedOutChecker} from '../services';

export const routes:Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'home'},
    {path: 'login', component: LoginComponent, canActivate: [LoggedOutChecker]},
    {path: 'home', component: HomeComponent, canActivate: [AlreadyLoggedInChecker], children: [
        {path: 'vouchers', component: VouchersComponent},
    ]}    
];

