import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Friend, FriendRequest } from '../models/friend';
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

  async getIncomingFriendRequestList(){
    const user = await this._auth.currentUser;
    const userId = user!.uid
    let resposne = await this._http.post<FriendRequest[]>(GlobalVars.FRIENDS_BASE_URL + "getFriendRequestsList", {userId: userId}).toPromise();
    let incomingRequests: FriendRequest[] = [];
    resposne.forEach( (request) => {
      if(request.fromID !== userId){
        incomingRequests.push(request)
      }
    })
    return incomingRequests;
  }

  async getOutgoingFriendRequestList(){
    const user = await this._auth.currentUser;
    const userId = user!.uid
    let resposne = await this._http.post<FriendRequest[]>(GlobalVars.FRIENDS_BASE_URL + "getFriendRequestsList", {userId: userId}).toPromise();
    let outgoingRequests: FriendRequest[] = [];
    resposne.forEach( (request) => {
      if(request.fromID === userId){
        outgoingRequests.push(request)
      }
    })
    return outgoingRequests;
  }

  async getFriendsList(){
    const user = await this._auth.currentUser;
    const userId = user!.uid
    let resposne = this._http.post<Friend[]>(GlobalVars.FRIENDS_BASE_URL + "getFriendsList", {userId: userId}).toPromise();
    return resposne;
  }

  async acceptFriendRequest( request: FriendRequest){
    await this._http.post(GlobalVars.FRIENDS_BASE_URL + "addFriend", {friendRequest: request}).toPromise();
    return;
  }

  async deleteFriend( user: string, other: string){
    await this._http.post(GlobalVars.FRIENDS_BASE_URL + "deleteFriend", {userID: user, otherID: other}).toPromise();
    return;
  }

  async denyFriendRequest( request: FriendRequest){
    await this._http.post(GlobalVars.FRIENDS_BASE_URL + "denyFriendRequest", {friendRequest: request}).toPromise();
    return;
  }
}
