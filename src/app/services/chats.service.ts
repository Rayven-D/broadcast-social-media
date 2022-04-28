import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable, pipe } from 'rxjs';
import { first } from 'rxjs/operators';
import { Chat, Message } from '../models/chats';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(
    private _firestore: AngularFirestore,
    private _http: HttpClient
  ) { }

  getChats(userId: string){
    return [] as Chat[];
  }

  async sendMessage(message: Message, chatId: string){
    let response = await this._http.post<boolean>(GlobalVars.CHATS_BASE_URL + "sendMessage", {chatId: chatId, message: message}).toPromise();
    return response;
  }

  async createChat(chat: Chat){
    let response = await this._http.post<boolean>(GlobalVars.CHATS_BASE_URL + "createChat", {chat: chat}).toPromise();
    return response;
  }
}
