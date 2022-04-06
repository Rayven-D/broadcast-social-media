import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'
import { getAuth } from '@angular/fire/auth';
import { getApp } from '@angular/fire/app';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

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

  loginFormControlGroup: FormGroup = new FormGroup( {
    emailControl: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    passwordControl: new FormControl("",[
      Validators.required,
      Validators.minLength(6)
    ])
  })



  public newUser: boolean = false;
  constructor(
    private _login: LoginService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _auth: AngularFireAuth
    ) { }

  ngOnInit(): void {
    
  }


  public async checkLogin(form: FormGroupDirective){

    if(this.loginFormControlGroup.invalid){
      this.showToast();
      return;
    }

    let username = form.value.emailControl;
    let password = form.value.passwordControl;

    let userCreds = await this._login.loginUser(username, password);
    if(userCreds){
      this._router.navigate(['/feed'])
    }
    else
      this.showToast();
  }

  public async toggleNewUser(creating: boolean){
    this.newUser = creating;
  }

  public showToast(){
    this._snackBar.openFromTemplate( this.invalid, { duration: 10000 } )
  }

}
