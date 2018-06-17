import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {PageComponent} from './components/shared/page/page.component';
import {NavbarComponent} from './components/shared/page/navbar/navbar.component';
import {SidebarComponent} from './components/shared/page/sidebar/sidebar.component';
import {FormsModule} from '@angular/forms';
import {LoadingComponent} from './components/shared/page/loading/loading.component';
import {HttpClientModule} from '@angular/common/http';
import {PrettyJsonModule, SafeJsonPipe} from 'angular2-prettyjson';
import {JsonPipe} from '@angular/common';
import {Ng2Webstorage} from 'ngx-webstorage';
import {ScatterService} from './services/scatter.service';
import {TweetsComponent} from './components/tweets/tweets.component';

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: ':id', component: TweetsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageComponent,
    NavbarComponent,
    SidebarComponent,
    LoadingComponent,
    TweetsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    PrettyJsonModule,
    Ng2Webstorage,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    ScatterService,
    {provide: JsonPipe, useClass: SafeJsonPipe}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
