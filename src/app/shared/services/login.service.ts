import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  loginUser( u: string, p: string ): Promise<boolean>{
    const login = this.http.post<boolean>(GlobalVars.LOGIN_URL_BASE + "loginUser", {username: u, password: p});
    return login.toPromise();
  }
}
