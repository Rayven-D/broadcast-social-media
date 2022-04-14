import { DatePipe, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentUser: UserAccounts;

  public infoForms: FormGroup;
  public accountFormControl: FormControl;
  public editting: boolean = false;
  private birthday: string = "";

  constructor(
    private _auth: AngularFireAuth,
    private _accounts: AccountService,
    private _datePipe: DatePipe
  ) { }

  async ngOnInit() {
    const cu =  await this._auth.currentUser
    this.currentUser = await this._accounts.getAccount(cu!.uid);

    const dob = this.currentUser.dob.split('-')
    this.birthday = `${dob[2]}-${dob[0]}-${dob[1]}`
    this.infoForms = new FormGroup({
      firstName: new FormControl({value: this.currentUser.firstName, disabled: !this.editting}),
      lastName: new FormControl({value: this.currentUser.lastName, disabled: !this.editting}),
      dob: new FormControl({value: this.birthday, disabled: !this.editting}),
      email: new FormControl({value: this.currentUser.email, disabled: !this.editting})
    })
    this.accountFormControl = new FormControl({value:this.currentUser.accountName, disabled: !this.editting})

  }

  startEditing(){
    this.editting = !this.editting
    this.infoForms = new FormGroup({
      firstName: new FormControl({value: this.currentUser.firstName, disabled: !this.editting},[
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/)
      ]),
      lastName: new FormControl({value: this.currentUser.lastName, disabled: !this.editting},[
        Validators.required,
        Validators.pattern(/^[A-Za-z ]+$/)
      ]),
      dob: new FormControl({value: this.birthday, disabled: !this.editting}, ),
      email: new FormControl({value: this.currentUser.email, disabled: !this.editting},[
        Validators.email,
        Validators.required
      ])
    })
    this.accountFormControl = new FormControl({value:this.currentUser.accountName, disabled: !this.editting},[
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern(/^[A-Za-z 0-9._]+$/)
    ])

  }

}
