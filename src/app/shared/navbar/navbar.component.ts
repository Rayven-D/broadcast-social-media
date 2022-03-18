import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public activeIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  public setActiveTab(tabNum: number){
    this.activeIndex = tabNum;
  }

}
