import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationKind, Subscription } from 'rxjs';
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
  private subscriptions = new Subscription();
  constructor(private modalService: NgbModal,
    public appService: AppService,
    private apiService: ApiService,
    private signlalRService: SignalRService,
    private hubnotificationService: HubNotificationService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
   this.subscriptions.add(this.appService.appState$.subscribe(state => { this.userName = state.userName }));
  }

  private startConnection() {
    let that = this;
    this.appService.connect()
      .then(result => {
        that.signlalRService.startConnection(this.roomName);
        
      })
      .catch(err => that.notificationService.notify("cannot start connection", "Error", InfoMessageType.Error));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  public ngOnInit() {
    this.roomName = this.route.snapshot.params["name"];
    if (!this.appService.current().userName) {
      this.appService.openLogin().then(result => {
        if (result)
          this.startConnection();
        else {
          this.notificationService.notify("you should be registered to join room", "Need to register", InfoMessageType.Warning);
          this.router.navigate(['/']);
        }
      }).catch(reason => console.log("error in open login" + reason));
      return;
    }

    this.startConnection();
  }
}
