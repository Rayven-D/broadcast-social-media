import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Posts } from 'src/app/models/posts';
import { CreatePostComponent } from './create-post/create-post.component';
import { PostsService } from 'src/app/services/posts.service';
import { AccountService } from 'src/app/services/account.service';
import { UserAccounts } from 'src/app/models/user';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @ViewChild('addPost') addPost: TemplateRef<any>;
  public posts: Posts[];
  public postsLoaded: boolean = false;
  public imageFile: File;
  public currentUser: UserAccounts
  constructor(
    private _dialog: MatDialog,
    private _posts: PostsService,
    private _account: AccountService
  ) { }

  async ngOnInit() {
    let interval = setInterval( async () =>{
      this.currentUser = this._account.loggedInAccount;
      console.log("hitting interval")
      if(this.currentUser){
        this.posts = await this._posts.getFeedPostsForUserId(this.currentUser.userId);
        clearInterval(interval);
      }
    }, 100)
  }
  

  openAddPostDialog(){
    this._dialog.open(CreatePostComponent, {
      panelClass: 'dialogStyles'
    })
  }

}
