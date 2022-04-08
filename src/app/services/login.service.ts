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

  async createNewUser(newUser: UserAccounts, password:string){
    try{
      let user = await this._auth.createUserWithEmailAndPassword(newUser.email,password)
      newUser.userId = user.user!.uid
      await this.http.post(GlobalVars.ACCOUNTS_BASE_URL + "createNewAccount",{account: newUser}).toPromise()
      return true;
    }
    catch(e){
      console.log(e);
      return false;
    }
  }

  async isLoggedIn(){
    return (await this._auth.currentUser) !== null;
  }
  
}
