import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { AppService } from './services/appService/app.service';
import { SignalRService } from './services/signalrService/signalr.service';
import { NotificationService } from './services/notificationService/notification.service';
import { HubNotificationService } from './services/notificationService/hubnotification.service';
import { TopicComponent } from './topic/topic.component';
import { ApiService } from './services/apiService/api.service';
import { VotingComponent } from './voting/voting.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    TopicComponent,
    VotingComponent
  ],
  entryComponents: [LoginComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'vote', component: HomeComponent, pathMatch: 'full' },
    ], { relativeLinkResolution: 'legacy' }),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AppService,
    SignalRService,
    NotificationService,
    HubNotificationService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
