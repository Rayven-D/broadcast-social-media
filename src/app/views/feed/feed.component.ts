import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Posts } from 'src/app/models/posts';
import { CreatePostComponent } from './create-post/create-post.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @ViewChild('addPost') addPost: TemplateRef<any>;
  public posts: Posts[] = [];
  public postsLoaded: boolean = false;
  public imageFile: File;
  constructor(
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }
  

  openAddPostDialog(){
    this._dialog.open(CreatePostComponent, {
      panelClass: 'dialogStyles'
    })
  }

}
