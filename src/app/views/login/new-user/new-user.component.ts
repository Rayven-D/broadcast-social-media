import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccounts } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  createAccountFormGroup: FormGroup = new FormGroup( {
    firstNameControl: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ]),
    lastNameControl: new FormControl("", [
      Validators.required,
      Validators.pattern(/^[A-Za-z ]+$/)
    ]),
    emailControl: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    usernameControl: new FormControl("",[
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern(/^[A-Za-z 0-9._]+$/)
    ]),
    passwordControl: new FormControl("",[
      Validators.required,
      Validators.minLength(6)
    ]),
    dateControl: new FormControl("",[
      Validators.required,
    ])
  });

  loading = false;

  constructor(
    private _login: LoginService,
    private _datePipe: DatePipe,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  closeCreateAccount(){
    this.close.emit(false);
  }

  async createAccount(form: FormGroupDirective){
    if(this.createAccountFormGroup.invalid)
      return;
    this.loading = true;
    const newUser: UserAccounts = {
      firstName: form.value.firstNameControl,
      lastName: form.value.lastNameControl,
      accountName: form.value.usernameControl,
      dob:  this._datePipe.transform(form.value.dateControl, 'MM-dd-yyyy') as string,
      userId: "",
      email: form.value.emailControl
      
    }
    await this._login.createNewUser(newUser, form.value.passwordControl)
    this.loading = false;
    this._router.navigate(['/feed'])

  }

}
