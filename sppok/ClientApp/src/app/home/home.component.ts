import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/apiService/api.service';

import { AppService } from '../services/appService/app.service';
import { HubNotificationService } from '../services/notificationService/hubnotification.service';
import { NotificationService } from '../services/notificationService/notification.service';
import { NotificationType } from '../services/notificationService/notificationType';
import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userName: string = '';
  private that = this;
  constructor(private modalService: NgbModal,
    public appService: AppService,
    private apiService: ApiService,
    private signlalRService: SignalRService,
    private hubnotificationService: HubNotificationService,
    private notificationService: NotificationService
  ) {
    this.appService.appState$.subscribe(state => { this.userName = state.userName });

    this.hubnotificationService.init();
  }

  public ngOnInit() {
    let state = this.appService.current();
    if (state.userName && !state.connectionId) {
      this.signlalRService.startConnection();
    }
  }

 
}
