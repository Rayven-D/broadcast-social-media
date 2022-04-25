import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyGrant } from '../models/spotify';
import { GlobalVars } from './global-vars';
import { SpotifyWebApi } from 'spotify-web-api-ts'

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private token: SpotifyGrant
  private spotifyWebApi: SpotifyWebApi;
  private deviceId: string;
  private playerInit: boolean = false;


  constructor(
    private _http: HttpClient
  ) { }

  get getSpotifyWebApi(){
    return this.spotifyWebApi
  }

  set setDeviceId(deviceId: string){
    this.deviceId = deviceId
  }

  get getDeviceId(){
    return this.deviceId;
  }

  get getSpotifyToken(){
    return this.token;
  }

  set setSpotifyToken(token: SpotifyGrant){
    this.token = token;
  }

  async linkSpotifyAccount(userId: string){
    let request = await this._http.post<string>(GlobalVars.SPOTIFY_BASE_URL + "linkSpotifyAccount", {userId: userId}, {responseType: 'text' as 'json'}).toPromise();
    window.open(request)
  }

  async requestAccessToken(code: string, state: string){
    let request = this._http.post<SpotifyGrant>(GlobalVars.SPOTIFY_BASE_URL + "requestAccessToken", {code: code, state: state} ).toPromise();
    this.token = await request;
    this.spotifyWebApi = new SpotifyWebApi({accessToken: this.token.access_token});
  }

  async getAccessToken(userId?: string): Promise<SpotifyGrant>{
    if(this.token)
      return this.token
    let request = this._http.post<SpotifyGrant>(GlobalVars.SPOTIFY_BASE_URL + "getAccessToken", {userId: userId} ).toPromise();
    this.token = await request;
    if(this.spotifyWebApi){
      this.spotifyWebApi.setAccessToken(this.token.access_token);
    }
    else{
      this.spotifyWebApi = new SpotifyWebApi({accessToken: this.token.access_token})
    }
    return this.token;
  }

  
}
