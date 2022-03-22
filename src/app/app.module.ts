import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './views/feed/feed.component';
import { SearchComponent } from './views/search/search.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FriendsComponent } from './shared/friends/friends.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoginComponent } from './views/login/login.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    SearchComponent,
    NavbarComponent,
    FriendsComponent,
    SpinnerComponent,
    LoginComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
