import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVars } from './global-vars';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser( u: string, p: string ): Promise<User>{
    const login = this.http.post<User>(GlobalVars.LOGIN_URL_BASE + "loginUser", {username: u, password: p});
    return login.toPromise();
  }

  createNewUser( u: string, p: string): Promise<User>{
    const login = this.http.post<User>(GlobalVars.LOGIN_URL_BASE + "createNewUser", {username: u, password: p});
    return login.toPromise();
  }

  isLoggedIn(): Promise<boolean>{
    const login = this.http.post<boolean>(GlobalVars.LOGIN_URL_BASE + "isLoggedIn", {});
    console.log(login)
    return login.toPromise();
  }
  
}
