import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './guards/authguard.service';
import { FeedComponent } from './views/feed/feed.component';
import { LoginComponent } from './views/login/login.component';
import { SearchComponent } from './views/search/search.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { ProfileComponent } from './views/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login'])

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'feed', component: FeedComponent, canActivate: [AngularFireAuthGuard], canLoad: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
  {path: 'search', component: SearchComponent, canActivate: [AngularFireAuthGuard], canLoad: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
  {path: 'profile/:accountName', component: ProfileComponent, canActivate: [AngularFireAuthGuard], canLoad: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin},
    children:[
      { path: ':accountName', component: ProfileComponent}
  ]},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 }
