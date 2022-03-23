import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from 'src/app/models/user';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'

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
  private user:User | null = null;

  constructor(
    private _login: LoginService,
    private _router: Router,
    private _snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    
  }


  public async checkLogin(){

    let username = document.getElementById("username-input") as HTMLInputElement;
    let password = document.getElementById("password-input") as HTMLInputElement;
    if( username.value.length > 0 && password.value.length > 0){
      this.user = await this._login.loginUser(username.value, password.value) as User
      if(this.user.uid)
        this._router.navigate(['/feed'])
      else
        this.showToast();
    }
    username.value = "";
    password.value = "";
  }

  public async createNewUser(){
    let username = document.getElementById("username-input") as HTMLInputElement;
    let password = document.getElementById("password-input") as HTMLInputElement;
    if( username.value.length > 0 && password.value.length > 0){
      this.user = await this._login.createNewUser(username.value, password.value)
      console.log(this.user);
      if(this.user.uid)
        this._router.navigate(['/feed'])
      else
        this.showToast();
    }
    username.value = "";
    password.value = "";
  }

  public showToast(){
    this._snackBar.openFromTemplate( this.invalid, { duration: 10000 } )
  }

}
