import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  constructor(
    private _auth: AngularFireAuth,
    private _accounts: AccountService
  ) { }

  async ngOnInit() {
    const cu =  await this._auth.currentUser
    console.log(cu?.uid)
    console.log(await this._accounts.getAccount(cu!.uid))
  }

}
