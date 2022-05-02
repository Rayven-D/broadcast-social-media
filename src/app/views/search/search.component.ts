import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SpotifyGrant } from 'functions/src/models/spotify';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SpotifyWebApi } from 'spotify-web-api-ts'
import { Track } from 'src/app/models/spotify';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STATUS_CODES } from 'http';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    MatSnackBar
  ]
})
export class SearchComponent implements OnInit {
  @ViewChild('queueTemplate') queueTemplate: TemplateRef<any>;

  private currentUser: UserAccounts;
  private spotify: SpotifyWebApi;

  public linkSpotifyControlGroup: FormGroup = new FormGroup( {
    spotifyEmail: new FormControl("",[
      Validators.email,
      Validators.required
    ]),
    spotifyUsername: new FormControl("",[
      Validators.required,
    ])
  })


  public tracks: Track[] = [];
  public canSearch: boolean = true;
  public isLoaded: boolean = false;

  constructor(
    private _spotify: SpotifyService,
    private _account: AccountService,
    private _snackbar: MatSnackBar
  ) { }

  async ngOnInit() {
    
    let interval = setInterval( async () =>{
      this.currentUser = this._account.loggedInAccount;
      if(this.currentUser){
        if(! (await this._spotify.getAccessToken(this.currentUser.userId)))
            this.canSearch = false;
        if(this.canSearch){
          this.spotify = this._spotify.getSpotifyWebApi;
          this.isLoaded = true;
        }
        clearInterval(interval)
      }
    }, 500)
    
  }

  getDurationInMinAndSec(ms: number){
  
    let min = Math.floor((ms/1000/60) << 0);
    let sec = Math.floor((ms/1000) % 60).toString().padStart(2,'0');

    return `${min}:${sec}`
  }

  playTrack(uri: string){
    this.spotify.player.play({uris: [uri], device_id: this._spotify.getDeviceId}).catch( async (reason) =>{
      let statusCode = reason.message.split(' ').pop();
      if(statusCode === '429'){
        console.error('Too many request, currently. Please give some time.')
      }else if(statusCode === '401'){
        await this._spotify.linkSpotifyAccount(this.currentUser.userId);
      }
    })
  }

  async searchSong(event:any){
    let text = (event.target as HTMLInputElement).value
    if(text.length > 0){
      let searchResults = await this.spotify.search.search(text, ['track']);
      this.tracks = []
      searchResults.tracks?.items.forEach( (track) =>{
        this.tracks.push(track as Track);
      })
    }else{
      this.tracks = [];
    }
  }

  async addToQueue(uri: string, name: string){
    try{
      await this.spotify.player.addToQueue(uri);
      this._snackbar.openFromTemplate(this.queueTemplate, {data: {name: name}, duration:5000})
    }catch{
      this.playTrack(uri);
    }
  }

  async requestSpotify(form: FormGroupDirective){
    if(this.linkSpotifyControlGroup.invalid)
      return;
    
    
  }

}
