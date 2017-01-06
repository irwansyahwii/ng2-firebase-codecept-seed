import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import {ToastComponent} from 'ng2-toasty/src/toast.component';
import {ToastyComponent} from 'ng2-toasty/src/toasty.component';
import {ToastyConfig, ToastyService} from 'ng2-toasty/src/toasty.service';
import {ToastOptions, ToastData} from 'ng2-toasty';

import {AngularFire} from 'angularfire2';
import {AngularFireModule} from 'angularfire2';
import {routes} from './routes';
import {ToastService, FirebaseService, AlreadyLoggedInChecker, LoggedOutChecker,
        ExtendedAngularFire} from '../services';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { VouchersComponent } from './vouchers/vouchers.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent, 
    ToastComponent,
    ToastyComponent,
    VouchersComponent,       
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(FirebaseService.config),
    
  ],
  providers: [
    AlreadyLoggedInChecker,
    LoggedOutChecker,
    ToastyConfig,
    ToastyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(af:AngularFire, private toastyService:ToastyService, private toastyConfig: ToastyConfig){
    FirebaseService.instance = new ExtendedAngularFire(af);
    ToastService.init(toastyService, toastyConfig);

  }
  
}
