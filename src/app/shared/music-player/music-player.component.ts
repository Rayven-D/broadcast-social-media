import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { SpotifyWebApi } from 'spotify-web-api-ts'
import { Track } from 'src/app/models/spotify';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  private spotifyWebApi: SpotifyWebApi;
  private playingUpdates: NodeJS.Timeout;
  private deviceId: string;
  private $trackSub: BehaviorSubject<Track | null> = new BehaviorSubject<Track | null>(null);

  public isPlaying: boolean;
  public track: Track;
  public progress: number;
  public repeatState: 'off' | 'track' | 'context';
  public shuffleState: boolean;
  public hidden: boolean = true;
  public canPlay: boolean = true;

  get progression(){
    return (this.progress / this.track?.duration_ms) * 100 ?? 0
  }

  get repeatType(){
    return this.repeatState === 'track';
  }

  constructor(
    private _spotify: SpotifyService,
    private _account:AccountService,
    
  ) { }

  ngOnInit(): void {
    let interval = setInterval( async() =>{
      let user = this._account.loggedInAccount;
      if(user){
          if(! (await this._spotify.getAccessToken(user.userId)))
            this.canPlay = false;
          this.spotifyWebApi = this._spotify.getSpotifyWebApi
          this.init();
        clearInterval(interval);
      }
    },500)


  }

  init(){
    this.canPlay = false;
    return;
    if(!this.canPlay)
      return;
    
    this.startWebPlayer();
    this.playingUpdates = setInterval( async() =>{
      let currentPlaying = await this.spotifyWebApi.player.getPlaybackInfo();
      this.$trackSub.next(currentPlaying?.item as Track)
      this.isPlaying = currentPlaying.is_playing;
      this.shuffleState = currentPlaying.shuffle_state;
      this.repeatState = currentPlaying.repeat_state;
      this.progress = currentPlaying.progress_ms as number;
    },750);

    this.$trackSub.subscribe( (track) =>{
      if(!track)
        return;
      if(this.track && this.track.id !== track!.id && this.hidden)
        this.tempHidden();
      else if(!this.track){
        this.tempHidden();
      }
      this.track = track as Track;
    })
  
  }

  private startWebPlayer(){
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
          this.deviceId = device_id;
          this._spotify.setDeviceId = device_id;
      });
      player.addListener('not_ready', ({ device_id}: any) => {
          console.log('Device ID has gone offline', device_id);
      });

      player.addListener('initialization_error', async ({ message }:any) => {
          console.error(message);
          console.log("Initialization Error",message)
      });

      player.addListener('authentication_error', ({ message }:any) => {
        console.error(message);
        console.log("Authentication Error",message)
    });
  
    player.addListener('account_error', ({ message }:any) => {
        console.error(message);
        console.log("Account Error",message)
    });


      player.connect();
    }

  }

  async pauseMusic(){
    await this.spotifyWebApi.player.pause();
    clearInterval(this.playingUpdates)
    this.isPlaying = false;
  }

  async playMusic(){
    await this.spotifyWebApi.player.play({uris: [this.track.uri], device_id: this._spotify.getDeviceId});
    await this.spotifyWebApi.player.seek(this.progress)
    this.playingUpdates = setInterval( async() =>{
      let currentPlaying = await this.spotifyWebApi.player.getPlaybackInfo();
      this.track = currentPlaying.item as Track;
      this.isPlaying = currentPlaying.is_playing;
      this.shuffleState = currentPlaying.shuffle_state;
      this.repeatState = currentPlaying.repeat_state;
      this.progress = currentPlaying.progress_ms as number;
    },750);
  }

  async startStopPlayback(){
    if(this.isPlaying){
      await this.pauseMusic();
    }else{
      await this.playMusic();
    }
    this.tempHidden();
  }

  async changeShuffle(){
    await this.spotifyWebApi.player.setShuffle(!this.shuffleState);
  }

  async changeRepeat(){
    let tempRepeatState = this.repeatState;
    if(this.repeatState === "off")
      tempRepeatState = 'context'
    else if(this.repeatState === 'track')
      tempRepeatState = 'off'
    else
      tempRepeatState = 'track'
    await this.spotifyWebApi.player.setRepeat(tempRepeatState);
  }

  async playPrev(){
    await this.spotifyWebApi.player.skipToPrevious();
  }

  async playNext(){
    await this.spotifyWebApi.player.skipToNext();
  }

  toggleHidden(){
    this.hidden = !this.hidden;
  }

  tempHidden(){
    this.hidden = false;
    setTimeout( () =>{
      this.hidden = true
    }, 2500)
  }

}
