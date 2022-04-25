import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    private router: Router,
    public _account:AccountService
  ){}
  
  get currRoute(): string{
    return this.router.url;
  }
  title = 'Broadcast';
}
