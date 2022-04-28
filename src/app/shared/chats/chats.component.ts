import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { UserAccounts } from 'functions/src/models/user';
import { Observable, Subscription } from 'rxjs';
import { Chat, Message } from 'src/app/models/chats';
import { AccountService } from 'src/app/services/account.service';
import { ChatsService } from 'src/app/services/chats.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  public chats: Chat[] = [];
  private currentUser: UserAccounts;
  public messages$: Observable<DocumentChangeAction<Message>[]>[] = [];
  public messages: Message[][] = [];

  constructor(
    private _auth: AngularFireAuth,
    private _account: AccountService,
    private _chats: ChatsService,
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

  ngOnInit(): void {
    this.chats = [{
      chatId: "test",
      chatName: 'testing chat',
      users: []
    }];
    this.chats.forEach((chat, index) =>{
      this._firestore.collection(`Chats/${chat.chatId as string}/messages`).snapshotChanges().subscribe( (val) =>{
        this.messages[index] = [];
        
        val.forEach( doc =>{
            if(!doc.payload.doc.metadata.hasPendingWrites)
              this.messages[index].push( doc.payload.doc.data() as Message)
        });

        this.reorderMessages(index);

      });
    })
  
  }

  private reorderMessages(index: number){
    this.messages[index].sort( (a,b) =>{
      let da = a.timestamp as Date;
      let db = b.timestamp as Date;
      return da < db ? -1 : 1;
    })
  }
}
