import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {collection, query, where, getFirestore } from '@angular/fire/firestore/'
import { Friend } from 'src/app/models/friend';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friendsList: Friend[] = [];
  public friendsLoaded: boolean = false;
  public currentUser : UserAccounts
  constructor(
    private _auth: AngularFireAuth,
    private _account: AccountService,
    private _friends: FriendsService
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
      let accounts = await this._account.getAllAccounts(this.currentUser.userId)
      this.friendsList = await this._friends.getFriendRequestList();
      console.log(this.friendsList)
      console.log(accounts)
      this.friendsLoaded = true;
    }
    
  }

}
