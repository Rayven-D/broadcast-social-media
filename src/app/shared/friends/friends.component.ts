import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {collection, query, where, getFirestore, Firestore, collectionData } from '@angular/fire/firestore/'
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Friend, FriendRequest } from 'src/app/models/friend';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { FriendsService } from 'src/app/services/friends.service';
import { AddFriendComponent } from './add-friend/add-friend.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  public friendsList: Friend[] = [];
  public friendsListFiltered: Friend[] = [];
  public incomingFriendRequests: FriendRequest[] = [];
  private outgoingFriendRequests: FriendRequest[] = [];
  public requestsSent: UserAccounts[] = [];
  public autoList: UserAccounts[] = [];
  public friendsLoaded: boolean = false;
  public currentUser : UserAccounts;
  constructor(
    private _auth: AngularFireAuth,
    private _account: AccountService,
    private _friends: FriendsService,
    private _dialog: MatDialog,
    private _firestore: AngularFirestore
  ) { 
    this._auth.onAuthStateChanged( async (user) =>{
      if(user){
        await this._account.getAccount(user.uid)
        this.currentUser = this._account.loggedInAccount
        this.ngOnInit()
      }
    })
  }

  async ngOnInit() {
    if(this.currentUser){
      this._firestore.collection(`Account/${this.currentUser.userId}/FriendRequests`).stateChanges(['added', 'removed']).subscribe( async (data) => {
        this.incomingFriendRequests = await this._friends.getIncomingFriendRequestList();
        let tempOutgoing = await this._friends.getOutgoingFriendRequestList();
        if(tempOutgoing.length === 0){
          this.outgoingFriendRequests = [];
          this.requestsSent = [];
        }
        else if(!tempOutgoing.every( (elem) => this.outgoingFriendRequests.includes(elem))){
          this.outgoingFriendRequests = tempOutgoing
          this.getOutgoingRequestUser();
        }
      })
      this._firestore.collection(`Account/${this.currentUser.userId}/Friends`).stateChanges(['added', 'removed']).subscribe( async (data) => {
        data.forEach( _ => console.log(_.payload.doc.data()));
        this.friendsList = await this._friends.getFriendsList();
        this.friendsLoaded = true;
      })
    } 
  }

  openAddFriendDialog(){
    this._dialog.open(AddFriendComponent, {
      panelClass: 'dialogStyles',
    })

  }

  openFriendRequestsDialog(){
    this._dialog.open(FriendRequestsComponent, {
      panelClass: 'dialogStyles',
      data:{
        requests: this.incomingFriendRequests,
        currentUserID: this.currentUser.userId
      }
    })
  }

  private getOutgoingRequestUser(){
    this.outgoingFriendRequests.forEach( async (_) => {
      if(!this.requestsSent.some( (user) => user.userId === _.toID))
        this.requestsSent.push(await this._account.getOtherAccount(_.toID) as UserAccounts);
    })
  }

  searchFriends(){
    let elem = document.getElementById('friends-search-bar') as HTMLInputElement
    if(elem.value.length > 0){
      console.log(elem.value)
      this.friendsList.forEach( (friend) => {
        if(friend.accountName.includes(elem.value) && this.friendsListFiltered.indexOf(friend) < 0){
          this.friendsListFiltered.push(friend)
        }
        else if(this.friendsListFiltered.indexOf(friend) >= 0 && !friend.accountName.includes(elem.value)){
          this.friendsListFiltered.splice(this.friendsListFiltered.indexOf(friend),1)
        }
      })
    }else{
      this.friendsListFiltered = []
    }
  }

}
