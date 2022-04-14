import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserAccounts } from '../models/user';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public loggedInAccount: UserAccounts

  constructor(
    private _http: HttpClient
  ) { }

  async getAccount(uid: string): Promise<UserAccounts>{
    let account = this._http.post<UserAccounts>(GlobalVars.ACCOUNTS_BASE_URL + "getAccount", {userId: uid}).toPromise();
    if(!this.loggedInAccount)
      this.loggedInAccount = await account;
    return account
  }
}
