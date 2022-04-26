import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './services/account.service';
import { GlobalVars } from './services/global-vars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(
    private router: Router,
    public _account:AccountService
  ){

    
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // true for mobile device
      document.addEventListener("DOMContentLoaded", function() {
        document.getElementsByTagName("body")[0].classList.add('mobile');
      })
      GlobalVars.IS_MOBILE = true;
    }

  }
  
  get currRoute(): string{
    return this.router.url;
  }
  title = 'Broadcast';
}
