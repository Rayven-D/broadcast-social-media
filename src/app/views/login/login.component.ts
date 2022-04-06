import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'
import { getAuth } from '@angular/fire/auth';
import { getApp } from '@angular/fire/app';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers:[
    LoginService,
    MatSnackBar
  ]
})
export class LoginComponent implements OnInit {
  @ViewChild('invalid') public invalid!: TemplateRef<any>;
  public newUser: boolean = false;
  constructor(
    private _login: LoginService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _auth: AngularFireAuth
    ) { }

  ngOnInit(): void {
    
  }


  public async checkLogin(){

    let username = document.getElementById("username-input") as HTMLInputElement;
    let password = document.getElementById("password-input") as HTMLInputElement;
    if( username.value.length > 0 && password.value.length > 0){
  
      let userCreds = await this._login.loginUser(username.value, password.value);
      if(userCreds){
        this._router.navigate(['/feed'])
      }
      else
        this.showToast();
    }
    username.value = "";
    password.value = "";
  }

  public async toggleNewUser(creating: boolean){
    console.log(creating)
    this.newUser = creating;
  }

  public showToast(){
    this._snackBar.openFromTemplate( this.invalid, { duration: 10000 } )
  }

}
