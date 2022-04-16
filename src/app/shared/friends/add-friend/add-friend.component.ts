import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAccounts } from 'functions/src/models/user';
import { AccountService } from 'src/app/services/account.service';
import { FriendsService } from 'src/app/services/friends.service';


@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  styleUrls: ['./add-friend.component.scss'],
  providers: [
    MatSnackBar
  ]
})
export class AddFriendComponent implements OnInit {
  @ViewChild('sendRequestSuccess') public succToast: TemplateRef<any>;
  @ViewChild('sendRequestFail') public failToast: TemplateRef<any>;
  public filteredList: UserAccounts[] = [];
  public autoList: UserAccounts[] = [];
  private curUser:string;

  constructor(
    public _auth: AngularFireAuth,
    public _account: AccountService,
    public _friendsService: FriendsService,
    public _snackbar: MatSnackBar,
    public _firestore: AngularFirestore
  ) {
  }

  async ngOnInit() {
    this.curUser = (await this._auth.currentUser)!.uid
    this._firestore.collection(`Account/${this.curUser}/FriendRequests`).stateChanges(['added', 'removed']).subscribe( async (data) => {
      this.getList();
    })

  }

  searchList(){
    if(this.autoList){
      const elem = document.getElementById("add-friends-search-input") as HTMLInputElement;
      if(elem.value.length === 0){
        this.filteredList = []
      }else{
        this.filteredList = this.autoList.filter( x => x.accountName.includes(elem.value))
      }
    }
  }

  async addFriend(user: UserAccounts){
    const succ = await this._friendsService.sendFriendRequest(user.userId, this.curUser);
    this._snackbar.openFromTemplate(succ ? this.succToast : this.failToast , {duration: 5000})
  }

  async getList(){
    let outgoing = await this._friendsService.getOutgoingFriendRequestList();
    let friends = await this._friendsService.getFriendsList();
    this._account.getAllAccounts(this.curUser).then( (accounts) => {
      accounts.forEach( (acc) => {
        if(!outgoing.find( (req) => req.toID === acc.userId) && !friends.find( (frnd) => frnd.userId === acc.userId)){
            this.autoList.push(acc)
        }
      })
    })
  }


}
