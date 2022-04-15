import { AfterViewInit, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
  private autoList: UserAccounts[];
  private curUser:string;

  constructor(
    public _auth: AngularFireAuth,
    public _account: AccountService,
    public _friendsService: FriendsService,
    public _snackbar: MatSnackBar
  ) {
  }

  async ngOnInit() {
    this.curUser = (await this._auth.currentUser)!.uid
    this._account.getAllAccounts(this.curUser).then( (accounts) => {
      this.autoList = accounts;
    })

  }

  searchList(){
      const elem = document.getElementById("add-friends-search-input") as HTMLInputElement;
      if(elem.value.length === 0){
        this.filteredList = []
      }else{
        this.filteredList = this.autoList.filter( x => x.accountName.includes(elem.value))
      }
  }

  async addFriend(user: UserAccounts){
    const succ = await this._friendsService.sendFriendRequest(user.userId, this.curUser);
    this._snackbar.openFromTemplate(succ ? this.succToast : this.failToast , {duration: 5000})

  }


}
