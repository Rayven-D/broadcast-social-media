import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SpotifyWebApi } from 'spotify-web-api-ts'
import { Track } from 'src/app/models/spotify';
import { BehaviorSubject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { UserAccounts } from 'src/app/models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  providers:[
    MatSnackBar
  ]
})
export class MusicPlayerComponent implements OnInit {

  private spotifyWebApi: SpotifyWebApi;
  private playingUpdates: NodeJS.Timeout;
  private progressUpdates: NodeJS.Timeout;
  public playerInit: boolean = false;
  private $trackSub: BehaviorSubject<Track | null> = new BehaviorSubject<Track | null>(null);
  private isLocal: boolean;
  private currentUser: UserAccounts

  public isPlaying: boolean;
  public track: Track;
  public progress: number = 0;
  public repeatState: 'off' | 'track' | 'context';
  public shuffleState: boolean;
  public hidden: boolean = true;
  public canPlay: boolean = true;

  get progression(){
    return (this.progress / (this.track?.duration_ms)) * 100 ?? 0
  }

  constructor(
    private _spotify: SpotifyService,
    private _account:AccountService,
    private _ref: ChangeDetectorRef,
    private _snackbar: MatSnackBar
    
  ) { }

  ngOnInit(): void {
    let interval = setInterval( async() =>{
      let user = this._account.loggedInAccount;
      if(user){
        this.currentUser = user;
        if(! (await this._spotify.getAccessToken(user.userId)))
          this.canPlay = false;
        this.init();
        clearInterval(interval);
      }
    },500)


  }

  async init(){
    if(!this.canPlay)
      return;
    
    this.spotifyWebApi = this._spotify.getSpotifyWebApi
    try{  
  
      this.startWebPlayer();
      this.periodicallyUpdateExternal();
      this.$trackSub.subscribe( (track) =>{
        if(!track)
          return;
        if(this.track && this.track.id !== track!.id){
          this.track = track
          if(this.hidden)
            this.tempHidden();
        }
        else if(!this.track){
          this.track = track
          if(this.hidden)
            this.tempHidden();
        }
      })
    }catch(error){
      console.log('error')
    }
  
  }

  private startWebPlayer(){
    if(this.playerInit)
      return;
    const script = document.createElement('script')
    script.src="https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script)
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = this.spotifyWebApi.getAccessToken();
      const player = new Spotify.Player({
          name: 'Broadcast Social Media',
          getOAuthToken: cb => { cb(token); },
          volume: 1,
      });

      // Ready
      player.addListener('ready', ({ device_id}:any) => {
          this._spotify.setDeviceId = device_id;
      });
      player.addListener('not_ready', ({ device_id}: any) => {
          console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', async ({ message }:any) => {
          console.error(message);
          console.log("Initialization Error",message)
      });

      player.addListener('authentication_error', async ({ message }:any) => {
        console.error(message);
        console.log("Authentication Error",message)
      });
    
      player.addListener('account_error', ({ message }:any) => {
          console.error(message);
          console.log("Account Error",message)
      });

      player.addListener('player_state_changed', async(state) =>{
        if(!state){
          this.isLocal = false;
          this.periodicallyUpdateExternal();
          return;
        } 
        this.isLocal = true;
        if(this.playingUpdates)
          clearInterval(this.playingUpdates);
        this.shuffleState = state.shuffle ?? false;
        this.repeatState = state.repeat_mode === 0 ? 'off' : state.repeat_mode === 2 ? "track" : 'context';
        this.isPlaying = !state.paused;
        this.progress = state.position;
        this.progressionUpdates();
        let temp = state.track_window.current_track;
        let tempTrack: Track = {
          id: temp.id as string,
          name: temp.name,
          uri: temp.uri,
          duration_ms: state.duration,
          artists: [],
          album:{
            uri: temp.album.uri,
            name: temp.album.name,
            id: '',
            images: [{url: temp.album.images[0].url}],
            release_date: "",
            artists: []
          }
        };

        temp.artists.forEach( (artist) =>{
          tempTrack.artists.push({
            uri: artist.uri,
            name: artist.name,
            id: ''
          })
        })
        this.$trackSub.next(tempTrack);
        this._ref.detectChanges();
      });
      player.connect();

      this.playerInit = true;
    }

  }

  progressionUpdates(){
    if(this.progressUpdates)
      clearInterval(this.progressUpdates)
    this.progressUpdates = setInterval( () =>{
      if(this.isPlaying){
        this.progress +=500;
        this._ref.detectChanges()
      }
    },500)
  }

  async pauseMusic(){
    await this.spotifyWebApi.player.pause();
    clearInterval(this.playingUpdates)
    this.periodicallyUpdateExternal()
    this.isPlaying = false;
  }

  async playMusic(){
    this.spotifyWebApi.player.play();
    this.periodicallyUpdateExternal()
  }

  async startStopPlayback(){
    if(this.isPlaying){
      await this.pauseMusic();
    }else{
      await this.playMusic();
    }
    this.tempHidden();
  }

  async playPrev(){
    await this.spotifyWebApi.player.skipToPrevious();
    this.periodicallyUpdateExternal()
  }

  async playNext(){
    await this.spotifyWebApi.player.skipToNext();
    this.periodicallyUpdateExternal()
  }

  async changeShuffle(){
    await this.spotifyWebApi.player.setShuffle(!this.shuffleState);
    this.periodicallyUpdateExternal()

  }

  async changeRepeat(){
    let tempRepeatState = this.repeatState;
    if(this.repeatState === "off")
      tempRepeatState = 'context'
    else if(this.repeatState === 'context')
      tempRepeatState = 'track'
    else
      tempRepeatState = 'off'
    this.repeatState = tempRepeatState
    await this.spotifyWebApi.player.setRepeat(tempRepeatState);
    this.periodicallyUpdateExternal()
  }


  toggleHidden(){
    this.hidden = !this.hidden;
  }

  tempHidden(){
        this.hidden = false;
    this._ref.detectChanges()

    setTimeout( () =>{
      this.hidden = true;
      this._ref.detectChanges()
    }, 2500)
  }

  async periodicallyUpdateExternal(){
    if(this.isLocal) return;
    if(this.playingUpdates)
      clearInterval(this.playingUpdates)
    this.updateExternal().then(() =>{
      this.playingUpdates = setInterval( async () => await this.updateExternal(),5000)
    })
    .catch(() =>{
      this._spotify.linkSpotifyAccount(this.currentUser.userId);
      this._snackbar.open('Refresh Browser', 'Refresh',{verticalPosition: 'top'}).onAction().toPromise().then( () =>{
        location.reload();
      })
    });
  }
  
  async updateExternal(){
      let testing = this.spotifyWebApi.player.getPlaybackInfo()
      if(testing.){
        let currentlyPlaying = await testing;
      }
      this.$trackSub.next(currentPlaying?.item as Track)
      this.isPlaying = currentPlaying.is_playing;
      this.shuffleState = currentPlaying.shuffle_state;
      this.repeatState = currentPlaying.repeat_state;
      this.progress = currentPlaying.progress_ms as number;

      this.progressionUpdates();
      this._ref.detectChanges();
      return Promise.resolve();
  }

}
