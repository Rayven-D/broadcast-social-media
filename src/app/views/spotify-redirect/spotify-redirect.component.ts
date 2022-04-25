import { Component, OnInit } from '@angular/core';
import { SpotifyService } from 'src/app/services/spotify.service';

@Component({
  selector: 'app-spotify-redirect',
  templateUrl: './spotify-redirect.component.html',
  styleUrls: ['./spotify-redirect.component.scss']
})
export class SpotifyRedirectComponent implements OnInit {

  constructor(
    private _spotify: SpotifyService
  ) { }

  async ngOnInit() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    await this._spotify.requestAccessToken(code as string, state as string);
    window.close();
  }

}
