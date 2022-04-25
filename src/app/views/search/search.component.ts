import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SpotifyGrant } from 'functions/src/models/spotify';
import { UserAccounts } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SpotifyWebApi } from 'spotify-web-api-ts'
import { Track } from 'src/app/models/spotify';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {

  private currentUser: UserAccounts;
  private spotify: SpotifyWebApi;

  private playerInitialized: boolean = false;
  private browserDeviceId: string;


  public tracks: Track[] = [];

  constructor(
    private _spotify: SpotifyService,
    private _account: AccountService,
  ) { }

  async ngOnInit() {
    
    let interval = setInterval( async () =>{
      this.currentUser = this._account.loggedInAccount;
      if(this.currentUser){
        await this._spotify.getAccessToken(this.currentUser.userId);
        this.spotify = this._spotify.getSpotifyWebApi
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
    this.spotify.player.play({uris: [uri], device_id: this._spotify.getDeviceId})
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

}
