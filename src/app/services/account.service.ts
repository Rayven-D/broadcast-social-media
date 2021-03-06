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
    if(this.loggedInAccount){
      return this.loggedInAccount;
    }
    let account = this._http.post<UserAccounts>(GlobalVars.ACCOUNTS_BASE_URL + "getAccount", {userId: uid}).toPromise();
    this.loggedInAccount = await account
    return account
  }

  async getAllAccounts(uid: string): Promise<UserAccounts[]>{
    let account = this._http.post<UserAccounts[]>(GlobalVars.ACCOUNTS_BASE_URL + "getAllAccounts", {userId: uid}).toPromise();
    return account;
  }

  async getOtherAccount(uid: string): Promise<UserAccounts | boolean>{
    if(uid !== this.loggedInAccount.userId)
    {
      let account = this._http.post<UserAccounts>(GlobalVars.ACCOUNTS_BASE_URL + "getAccount", {userId: uid}).toPromise();
      return account
    }
    return false;
  }
}
