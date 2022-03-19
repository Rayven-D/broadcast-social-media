import { Component, OnInit } from '@angular/core';
import { Posts } from 'src/app/models/posts';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  public posts: Posts[] = [];
  public postsLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
