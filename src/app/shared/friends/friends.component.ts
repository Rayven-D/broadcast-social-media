import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {collection, query, where, getFirestore } from '@angular/fire/firestore/'
import { MatDialog } from '@angular/material/dialog';
import { Friend } from 'src/app/models/friend';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { FriendsService } from 'src/app/services/friends.service';
import { AddFriendComponent } from './add-friend/add-friend.component';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  @ViewChild('addFriend') addFriendTemplate: TemplateRef<any>;

  public friendsList: Friend[] = [];
  public autoList: UserAccounts[] = [];
  public friendsLoaded: boolean = false;
  public currentUser : UserAccounts;
  constructor(
    private _auth: AngularFireAuth,
    private _account: AccountService,
    private _friends: FriendsService,
    private _dialog: MatDialog
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
      this.friendsList = await this._friends.getFriendRequestList();
      this.friendsLoaded = true;
    }
    
  }

  openAddFriendDialog(){
    this._dialog.open(AddFriendComponent, {
      panelClass: 'dialogStyles',
      data: {autoList: this.autoList}
    })

  }

}
