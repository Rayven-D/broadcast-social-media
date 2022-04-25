import { NgModule,} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedComponent } from './views/feed/feed.component';
import { SearchComponent } from './views/search/search.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FriendsComponent } from './shared/friends/friends.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { LoginComponent } from './views/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { NewUserComponent } from './views/login/new-user/new-user.component';
import { DatePipe } from '@angular/common';
import { PERSISTENCE } from '@angular/fire/compat/auth';
import { ProfileComponent } from './views/profile/profile.component';
import { AddFriendComponent } from './shared/friends/add-friend/add-friend.component';
import { FriendRequestsComponent } from './shared/friends/friend-requests/friend-requests.component';
import { CreatePostComponent } from './views/feed/create-post/create-post.component';
import { PostsCardsComponent } from './shared/posts-cards/posts-cards.component';
import { SpotifyRedirectComponent } from './views/spotify-redirect/spotify-redirect.component';
import { MusicPlayerComponent } from './shared/music-player/music-player.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    SearchComponent,
    NavbarComponent,
    FriendsComponent,
    SpinnerComponent,
    LoginComponent,
    NewUserComponent,
    ProfileComponent,
    AddFriendComponent,
    FriendRequestsComponent,
    CreatePostComponent,
    PostsCardsComponent,
    SpotifyRedirectComponent,
    MusicPlayerComponent
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
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideAuth(() => getAuth()),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressBarModule
  ],
  providers: [
    DatePipe,
    {provide: PERSISTENCE, useValue: 'local'}
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 

}
