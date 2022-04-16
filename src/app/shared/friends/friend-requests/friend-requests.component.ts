import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserAccounts } from 'functions/src/models/user';
import { FriendRequest } from 'src/app/models/friend';
import { AccountService } from 'src/app/services/account.service';
import { FriendsService } from 'src/app/services/friends.service';

interface RequestData{
  requests: FriendRequest[],
  currentUserID: string
}

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent implements OnInit {

  public requestsAccount: UserAccounts[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: RequestData,
    private _account: AccountService,
    private _friend: FriendsService,
    private _firestore: AngularFirestore
  ) {
    
   }

  ngOnInit(): void {
    this._firestore.collection(`Account/${this.data.currentUserID}/FriendRequests`).stateChanges(['added', 'removed']).subscribe( async (data) => { 
      this.updateRequestsAccounts();
    })
  }

  async acceptFriendRequest(user: UserAccounts) {
    let request: FriendRequest = this.data.requests.find( (_) => _.fromID === user.userId) as FriendRequest;
    await this._friend.acceptFriendRequest(request);
  }

  async denyFriendRequest(user: UserAccounts){
    let request: FriendRequest = this.data.requests.find( (_) => _.fromID === user.userId) as FriendRequest;
    await this._friend.denyFriendRequest(request)
  }

  private async updateRequestsAccounts(){
    this.requestsAccount = [];
    let requests = await this._friend.getIncomingFriendRequestList();
    requests.forEach( async (req) => {
      this.requestsAccount.push(await this._account.getOtherAccount(req.fromID) as UserAccounts)
    })
  }

}
