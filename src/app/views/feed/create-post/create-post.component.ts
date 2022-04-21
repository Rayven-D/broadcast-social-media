import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  public imageFile: File;
  public textOnly: boolean = false;
  public imageURL: SafeUrl;

  constructor(
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  async uploadImage(event: any){
    this.imageFile = event.target.files[0] as File;
    this.imageURL = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.imageFile));
    console.log(this.imageURL)
  }

}
