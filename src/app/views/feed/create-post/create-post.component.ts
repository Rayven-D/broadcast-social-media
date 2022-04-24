import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Posts } from 'src/app/models/posts';
import { AccountService } from 'src/app/services/account.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  providers:[
    MatSnackBar,
    MatDialog
  ]
})
export class CreatePostComponent implements OnInit {
  @ViewChild('uploadMoreThan1') multipleUploadTemplate: TemplateRef<any>;
  @ViewChild('uploadIncorrectFileType') incorectTypeUploadTemplate: TemplateRef<any>;
  public imageFile: File | null;
  public textOnly: boolean = false;
  public imageURL: SafeUrl | null;
  public postType: 'img' | 'txt' = 'img';
  public isPublic: boolean = true;
  constructor(
    private _sanitizer: DomSanitizer,
    private _snackbar: MatSnackBar,
    private _account: AccountService,
    private _storage: AngularFireStorage,
    private _posts: PostsService,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  async uploadImage(event: any){
    if(event.target.files.length > 1){
      this._snackbar.openFromTemplate(this.multipleUploadTemplate, {duration: 5000});
    }
    const tempImageFile = event.target.files[0] as File;
    if(!tempImageFile){
      return;
    }
    if(!tempImageFile.type.includes('image')){
      this._snackbar.openFromTemplate(this.incorectTypeUploadTemplate, {duration: 5000});
      return;
    }
    this.imageFile = tempImageFile;
    this.imageURL = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imageFile));
  }

  removeImage(){
    this.imageURL = null;
    this.imageFile = null;
  }

  async createPost(){
    let newPost: Posts;
    let textElem = document.getElementById('caption-textarea') as HTMLTextAreaElement;
    if(this.postType === 'img'){
      if(!this.imageFile){
        return;
      }
      let date = new Date();
      let upload = await this._storage.upload(`/posts/${date.toISOString()}${this.imageFile.name}`, this.imageFile);
      let url = await upload.ref.getDownloadURL();
     newPost = {
        imageURL: url,
        userAccountName: this._account.loggedInAccount.accountName,
        userID: this._account.loggedInAccount.userId,
        caption: textElem.value,
        public: this.isPublic,
        userAccountPic: this._account.loggedInAccount.imageURL
     }
    }else{
      newPost = {
        userAccountName: this._account.loggedInAccount.accountName,
        userID: this._account.loggedInAccount.userId,
        caption: textElem.value,
        public: this.isPublic,
        userAccountPic: this._account.loggedInAccount.imageURL
     }
    }
    await this._posts.createNewPost(newPost);
    this._dialog.closeAll();
  }

}
