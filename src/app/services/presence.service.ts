import { HostListener, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { UserAccounts } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  private user: any;

  constructor(
    private _auth: AngularFireAuth,
    private _firestore: AngularFirestore
  ) { 

    window.addEventListener('beforeunload', async () =>{
      await this.setPresence('offline')
    } )

    document.addEventListener('visibilitychange', () =>{
      this.visibilityChange()
    })
  }

  getUser(){
    return this._auth.authState.pipe(first()).toPromise();
  }

  async visibilityChange(){
    if(document.visibilityState === 'hidden'){
      await this.setPresence('away');
    }else{
      await this.setPresence('online')
    }
  }

  async setPresence( status: string){
    if(this.user){
      return this._firestore.doc(`Account/${this.user.uid}`).update({
        status: status
      })
    }else{
      this.user = await this.getUser();
      this.setPresence(status);
    }
  }

  getPresence(uid: string){
    return this._firestore.doc(`Account/${uid}`).valueChanges() as Observable<UserAccounts>
  }
}
