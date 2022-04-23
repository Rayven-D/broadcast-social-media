import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Posts } from 'src/app/models/posts';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  providers:[
    MatSnackBar
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
    private _account: AccountService
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

  createPost(){
    let newPost: Posts;
    let textElem = document.getElementById('caption-textarea') as HTMLTextAreaElement
    if(this.postType === 'img'){
     newPost = {
        imageFile: this.imageFile as File,
        userAccountName: this._account.loggedInAccount.accountName,
        userID: this._account.loggedInAccount.userId,
        caption: textElem.value,
        public: this.isPublic
     }
    }else{
      newPost = {
        userAccountName: this._account.loggedInAccount.accountName,
        userID: this._account.loggedInAccount.userId,
        caption: textElem.value,
        public: this.isPublic
     }
    }

    console.log(newPost)
  }

}
