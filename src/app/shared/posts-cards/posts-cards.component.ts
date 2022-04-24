import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Posts } from 'src/app/models/posts';

@Component({
  selector: 'app-posts-cards',
  templateUrl: './posts-cards.component.html',
  styleUrls: ['./posts-cards.component.scss']
})
export class PostsCardsComponent implements OnInit {
  @Input() post: Posts;
  public date: string;
  constructor() { }

  ngOnInit(): void {
    
    this.date = formatDate(this.post.dateCreated as Date, 'mediumDate', 'en-US');
  }


}
