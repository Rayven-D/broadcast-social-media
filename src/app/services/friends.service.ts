import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Friend } from '../models/friend';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(
    private _http: HttpClient,
    private _auth: AngularFireAuth
  ) { }

  async sendFriendRequest(toId: string, fromId: string): Promise<boolean>{
    let resposne = this._http.post<boolean>(GlobalVars.FRIENDS_BASE_URL + "sendFriendRequest", {toId: toId, fromId: fromId}).toPromise();
    return resposne;
  }

  async getFriendRequestList(){
    const user = await this._auth.currentUser;
    const userId = user!.uid
    let resposne = this._http.post<Friend[]>(GlobalVars.FRIENDS_BASE_URL + "getFriendsList", {userId: userId}).toPromise();
    return resposne;
  }
}
