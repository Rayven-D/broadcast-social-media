import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Navigation, NavigationEnd, Router, RouterEvent, Event } from '@angular/router';
import { filter } from "rxjs/operators"
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private routes = ['/feed', '/search', '/profile']
  public activeIndex: number = -1;
  public currentUser: UserAccounts;
  constructor(
    private _router: Router,
    private _account: AccountService,
    private _auth: AngularFireAuth,
  ) {
    this._router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e: RouterEvent) => {
        this.activeIndex = this.routes.indexOf(e.url)
    });
    this._auth.onAuthStateChanged( async (user) =>{
      if(user){
        await this._account.getAccount(user.uid)
        this.currentUser = this._account.loggedInAccount
      }
    })
   }

  async ngOnInit() {
  }

  navigateToProfile(){
    this._router.navigate(['/profile', this.currentUser.accountName], {state: this.currentUser})
  }

  public setActiveTab(tabNum: number){
    this.activeIndex = tabNum;
  }

}
