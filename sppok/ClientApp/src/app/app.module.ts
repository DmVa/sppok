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
import { RoomComponent } from './room/room.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { AppService } from './services/appService/app.service';
import { SignalRService } from './services/signalrService/signalr.service';
import { NotificationService } from './services/notificationService/notification.service';
import { HubNotificationService } from './services/notificationService/hubnotification.service';
import { TopicComponent } from './topic/topic.component';
import { ApiService } from './services/apiService/api.service';
import { VotingComponent } from './voting/voting.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './http-interceptors/auth-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RoomComponent, 
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
      { path: 'room/:name', component: RoomComponent, pathMatch: 'prefix' },
      { path: 'room', component: HomeComponent, pathMatch: 'full' },
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '**', redirectTo: '/' }
    ], { relativeLinkResolution: 'legacy' }),
    NgbModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AppService,
    httpInterceptorProviders,
    SignalRService,
    NotificationService,
    HubNotificationService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
