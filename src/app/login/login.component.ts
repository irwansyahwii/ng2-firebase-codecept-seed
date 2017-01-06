import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import {LoginModel, ApiResponse} from '../../models';
import {login, ToastService} from "../../services";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  protected model:LoginModel = new LoginModel();

  constructor(protected router:Router) { 
        
  }

  ngOnInit() {
  }

  doLogin(){
    return ToastService.showDefaultWaitToastAndBlockUI()
      .concatMap((r:number) => login(this.model))
      .concatMap((response:ApiResponse) => {
        
        if(response.success){
          return ToastService.closeAll().flatMap(() => this.router.navigate(["/home"]));
        }
        else{
          return ToastService.closeAll().flatMap(() => ToastService.showErrors(response.errors))
              .map(() => false);
        }
      })
      .catch((err:any) => ToastService.showError(err))
      .finally(() => ToastService.unblockUI().toPromise())   
      .toPromise();
 
  }
}
