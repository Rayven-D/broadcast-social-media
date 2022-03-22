import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './views/feed/feed.component';
import { LoginComponent } from './views/login/login.component';
import { SearchComponent } from './views/search/search.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'feed', component: FeedComponent},
  {path: 'search', component: SearchComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
 }
