import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyGrant } from '../models/spotify';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private token: SpotifyGrant

  constructor(
    private _http: HttpClient
  ) { }

  async linkSpotifyAccount(userId: string){
    let request = await this._http.post<string>(GlobalVars.SPOTIFY_BASE_URL + "linkSpotifyAccount", {userId: userId}, {responseType: 'text' as 'json'}).toPromise();
    window.open(request)
  }

  async requestAccessToken(code: string, state: string){
    let request = this._http.post<SpotifyGrant>(GlobalVars.SPOTIFY_BASE_URL + "requestAccessToken", {code: code, state: state} ).toPromise();
    this.token = await request;
  }

  async getAccessToken(userId?: string): Promise<SpotifyGrant>{
    if(this.token)
      return this.token
    let request = this._http.post<SpotifyGrant>(GlobalVars.SPOTIFY_BASE_URL + "getAccessToken", {userId: userId} ).toPromise();
    this.token = await request;
    return this.token;
  }

  
}
