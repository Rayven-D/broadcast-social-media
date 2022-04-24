import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Posts } from '../models/posts';
import { GlobalVars } from './global-vars';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private _http: HttpClient
  ) { }

  async createNewPost( newPost: Posts){
    let request = this._http.post(GlobalVars.POSTS_BASE_URL + "createNewPost", {newPost: newPost}).toPromise();
    return await request;
  }

  getPostsByUserId( userId: string){
    let request = this._http.post<Posts[]>(GlobalVars.POSTS_BASE_URL + "getPostsByUserId", {userID: userId}).toPromise();
    return request;
  }

  getFeedPostsForUserId( userId: string){
    let request = this._http.post<Posts[]>(GlobalVars.POSTS_BASE_URL + "getFeedPostsForUserId", {userID: userId}).toPromise();
    return request;
  }
}
