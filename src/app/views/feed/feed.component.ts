import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Posts } from 'src/app/models/posts';

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

  async uploadImage(event: any){
    console.log(event);
    console.log(event.target.value)
    this.imageFile = event.target.files[0] as File;
  }

  openAddPostDialog(){
    this._dialog.open(this.addPost)
  }

}
