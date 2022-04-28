import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { UserAccounts } from 'functions/src/models/user';
import { Observable, Subscription } from 'rxjs';
import { Chat, Message } from 'src/app/models/chats';
import { Friend } from 'src/app/models/friend';
import { AccountService } from 'src/app/services/account.service';
import { ChatsService } from 'src/app/services/chats.service';
import { FriendsService } from 'src/app/services/friends.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  providers: [
    MatDialog
  ],
  encapsulation: ViewEncapsulation.None
})
export class ChatsComponent implements OnInit {

  public chats: Chat[] = [];
  private currentUser: UserAccounts;
  private chatUsers: UserAccounts[] = [];
  public friendsList: Friend[] = [];


  public messages$: Observable<DocumentChangeAction<Message>[]>[] = [];
  public messages: Message[][] = [];
  public activeChatIndex: number = -1;
  public loaded = false;

  public edittingName: number = -1;
  public sendingMessage: boolean = false;

  constructor(
    private _auth: AngularFireAuth,
    private _account: AccountService,
    private _chats: ChatsService,
    private _firestore: AngularFirestore,
    private _friends: FriendsService,
    private _dialog: MatDialog
  ) { 

    this._auth.onAuthStateChanged( async (user) =>{
      if(user?.uid){
        this.currentUser = await this._account.getAccount(user.uid)
        this.init()
      }
    })
  }
  
  ngOnInit(): void {
    
  }

  async init() {
    this.chats = await this._chats.getChats(this.currentUser.userId);
    this.chats.forEach((chat, index) =>{
      this._firestore.collection(`Chats/${chat.chatId as string}/Messages`).snapshotChanges().subscribe( (val) =>{
        this.messages[index] = [];
        
        val.forEach( doc =>{
            if(!doc.payload.doc.metadata.hasPendingWrites)
              this.messages[index].push( doc.payload.doc.data() as Message)
        });

        this.reorderMessages(index);

      });
    });

    
    this.chats.forEach( chat => {
      chat.users.forEach( async userId =>{
        if(!this.chatUsers.some( (user) => user.userId === userId))
          this.chatUsers.push(await this._account.getOtherAccount(userId) as UserAccounts)
      })
    });

   (this._firestore.doc(`Account/${this.currentUser.userId}`).valueChanges() as Observable<UserAccounts>).subscribe( async account =>{
      this.chats = await this._chats.getChats(account.userId)
   })

    this.friendsList = await this._friends.getFriendsList();

    this.loaded = true;
  
  }

  private reorderMessages(index: number){
    this.messages[index].sort( (a,b) =>{
      let da = a.timestamp as Date;
      let db = b.timestamp as Date;
      return da < db ? -1 : 1;
    })
  }

  toggleChat(index: number){
    if(this.activeChatIndex === index){
      this.activeChatIndex = -1;
    }else{
      this.activeChatIndex = index;
    }
    this.edittingName = -1;
  }

  async sendMessage(chat: Chat, index: number){
    this.sendingMessage = true;
    let elem = document.getElementsByClassName('message-to-send')[index] as HTMLInputElement;
    if(elem.value.length > 0)
    {
      let newMessage: Message = {
        content: elem.value,
        userId: this.currentUser.userId,
      }
      let sendSucc = await this._chats.sendMessage(newMessage, chat.chatId as string);
      if(sendSucc){
        elem.value = '';
      }
    }
    this.sendingMessage = false;
  }

  getSender(userId: string){
    if(userId === this.currentUser.userId)
      return 'You';
    return this.chatUsers.find( (user) => user.userId === userId)?.accountName ?? "";
  }

  getIsSender(userId: string){
    return userId === this.currentUser.userId ? "this-user-sent" : ''
  }

  toggleChatNameEditing(chat: Chat, index: number){
    console.log(index)
    let elem = document.getElementsByClassName('title-editing')[index] as HTMLInputElement
    if(this.edittingName >= 0){
      if(chat && elem.value.length){
        if(elem.value !== chat.chatName){
          this._firestore.doc(`Chats/${chat.chatId}`).update({
            chatName: elem.value
          })
        }
      }
      this.edittingName = -1;
    }else{
      this.edittingName = index;
      elem.focus();
      elem.setSelectionRange(0, elem.value.length);
    }
  }
  createChat(friend: Friend){
    console.log(friend)
    let newChat: Chat = {
      chatName: `${this.currentUser.accountName}, ${friend.accountName}`,
      users: [friend.userId, this.currentUser.userId]
    }
    this._chats.createChat(newChat)
  }

  async deleteChat(chat: Chat){
    await this._chats.deleteChat(chat);
    this.edittingName === -1;
    this.activeChatIndex = -1;
  }

  async drop(event: CdkDragDrop<Chat[]>){
      moveItemInArray(this.chats, event.previousIndex, event.currentIndex);
      moveItemInArray(this.messages, event.previousIndex, event.currentIndex);
      moveItemInArray(this.messages$, event.previousIndex, event.currentIndex)

      let chatIds: string[] = [];

      this.chats.forEach( chat =>{
        chatIds.push(chat.chatId as string)
      })

      await this._firestore.doc(`Account/${this.currentUser.userId}`).update({
        chats: chatIds
      })
      this.activeChatIndex = -1;
  }
}