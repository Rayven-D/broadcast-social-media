import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVars } from './global-vars';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from'@angular/fire/compat/storage'
import { UserAccounts } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private _auth: AngularFireAuth,
    private _firestore: AngularFireStorage
    ) { }

  async loginUser( u: string, p: string ){
    try{
      await this._auth.signInWithEmailAndPassword(u,p)
      return true;
    }
    catch(e){
      return false;
    }
  }

  async createNewUser( u: string, p: string){
    try{
      let user = await this._auth.createUserWithEmailAndPassword(u,p)
      const newAccount: UserAccounts = {
        userId: user.user?.uid ?? "aaaa",
        firstName: "testing",
        lastName: "storage",
        accountName: "hehe",
        dob: "100000"
      }
      this.http.post(GlobalVars.ACCOUNTS_BASE_URL + "createNewAccount",{newAccount})
      return true;
    }
    catch(e){
      return false;
    }
  }

  async isLoggedIn(){
    return (await this._auth.currentUser) !== null;
  }
  
}
