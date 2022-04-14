import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Friend } from 'src/app/models/friend';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

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
    private _account: AccountService
  ) { 
    this._auth.onAuthStateChanged( async (user) =>{
      if(user){
        await this._account.getAccount(user.uid)
        this.currentUser = this._account.loggedInAccount
      }
    })
  }

  ngOnInit(): void {
  }

}
