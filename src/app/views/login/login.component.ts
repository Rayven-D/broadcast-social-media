import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[
    LoginService
  ]
})
export class LoginComponent implements AfterViewInit {

  constructor(
    private _login: LoginService
    ) { }

  ngAfterViewInit(): void {
  
  }

  public checkLogin(){

    let username = document.getElementById("username-input") as HTMLInputElement;
    let password = document.getElementById("password-input") as HTMLInputElement;
    this._login.loginUser(username.value, password.value)
    username.value = "";
    password.value = "";
  }

}
