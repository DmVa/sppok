import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationKind } from 'rxjs';
import { ApiService } from '../services/apiService/api.service';

import { AppService } from '../services/appService/app.service';
import { HubNotificationService } from '../services/notificationService/hubnotification.service';
import { InfoMessageType, NotificationService } from '../services/notificationService/notification.service';

import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  userName: string = '';
  roomName: string = '';
  private that = this;
  constructor(private modalService: NgbModal,
    public appService: AppService,
    private apiService: ApiService,
    private signlalRService: SignalRService,
    private hubnotificationService: HubNotificationService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) {
    this.appService.appState$.subscribe(state => { this.userName = state.userName });
  }

  private startConnection() {
    let that = this;
    this.appService.connect()
      .then(result => {
        that.signlalRService.startConnection(this.roomName);
        
      })
      .catch(err => that.notificationService.notify("cannot start connection", "Error", InfoMessageType.Error));
  }

  public ngOnInit() {
    this.roomName = this.route.snapshot.params["name"];
    this.startConnection();
  }
}
