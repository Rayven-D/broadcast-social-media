import { Component, OnInit } from '@angular/core';
import { Navigation, NavigationEnd, Router, RouterEvent, Event } from '@angular/router';
import { filter } from "rxjs/operators"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private routes = ['/feed', '/search', '/profile']
  public activeIndex: number = -1;
  constructor(
    private _router: Router
  ) {
    this._router.events.pipe(
      filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
   ).subscribe((e: RouterEvent) => {
      this.activeIndex = this.routes.indexOf(e.url)
   });
   }

  ngOnInit(): void {

  }

  public setActiveTab(tabNum: number){
    this.activeIndex = tabNum;
  }

}
