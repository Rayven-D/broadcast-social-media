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

  private token: SpotifyGrant;
  private currentUser: UserAccounts;
  private spotify: SpotifyWebApi;

  private playerInitialized: boolean = false;
  private browserDeviceId: string;


  public tracks: Track[] = [];

  constructor(
    private _spotify: SpotifyService,
    private _account: AccountService,
    private _firestore: AngularFirestore
  ) { }

  get spotifyToken(){
    return this.token.access_token;
  }

  async ngOnInit() {
    
    let interval = setInterval( async () =>{
      this.currentUser = this._account.loggedInAccount;
      if(this.currentUser){
        await this._spotify.linkSpotifyAccount(this._account.loggedInAccount.userId);
        this.init();
        clearInterval(interval)
      }
    }, 500)
    
  }

  async init(){
    let doc = await this._spotify.getAccessToken(this.currentUser.userId)
    this.token = doc;
    this.spotify = new SpotifyWebApi({accessToken: this.token.access_token});

    if(!this.playerInitialized)
      this.startWebPlayer();    

    let searchResults = await this.spotify.search.search('AJR', ['track'])
    console.log(searchResults)
    searchResults.tracks?.items.forEach( (track) =>{
      this.tracks.push(track as Track);
    })

    console.log(this.tracks)
  }

  getDurationInMinAndSec(ms: number){
  
    let min = Math.floor((ms/1000/60) << 0);
    let sec = Math.floor((ms/1000) % 60).toString().padStart(2,'0');

    return `${min}:${sec}`
  }

  playTrack(uri: string){
    this.spotify.player.play({uris: [uri], device_id: this.browserDeviceId})
  
  }

  startWebPlayer(){
    const script = document.createElement('script')
    script.src="https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script)
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.token.access_token;
      const player = new Spotify.Player({
          name: 'Broadcast Social Media',
          getOAuthToken: cb => { cb(token); },
          volume: 0.5
      });

      // Ready
      player.addListener('ready', ({ device_id}:any) => {
          this.browserDeviceId = device_id;

      });
      player.addListener('not_ready', ({ device_id}: any) => {
          console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', ({ message }:any) => {
          console.error(message);
      });


      player.connect();
      this.playerInitialized = true;
  }

  }
}
