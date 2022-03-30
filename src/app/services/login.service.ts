import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVars } from './global-vars';
import { User } from 'src/app/models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private _auth: AngularFireAuth
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

  createNewUser( u: string, p: string): Promise<User>{
    const login = this.http.post<User>(GlobalVars.LOGIN_URL_BASE + "createNewUser", {username: u, password: p});
    return login.toPromise();
  }

  async isLoggedIn(){
    return (await this._auth.currentUser) !== null;
  }
  
}
