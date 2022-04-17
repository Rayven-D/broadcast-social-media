import { Component, OnInit } from '@angular/core';
import { Friend } from 'src/app/models/friend';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  public friendsList: Friend[] = [];
  public friendsLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
