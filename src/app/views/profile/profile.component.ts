import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserAccounts } from 'functions/src/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public currentUser: UserAccounts;
  public loading: boolean = true;

  constructor(
    private _auth: AngularFireAuth,
    private _accounts: AccountService
  ) { }

  async ngOnInit() {
    const cu =  await this._auth.currentUser
    this.currentUser = await this._accounts.getAccount(cu!.uid);
    this.loading = false;
  }

}
