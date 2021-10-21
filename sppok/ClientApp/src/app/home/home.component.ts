import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, SubscriptionLike } from 'rxjs';
import { ApiService } from '../services/apiService/api.service';

import { AppService } from '../services/appService/app.service';
import { HubNotificationService } from '../services/notificationService/hubnotification.service';
import { InfoMessageType, NotificationService } from '../services/notificationService/notification.service';

import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  userName: string = '';
  roomName: string = '';
  private subscriptions = new Subscription();
  constructor(private modalService: NgbModal,
    public appService: AppService,
    private apiService: ApiService,
    private signlalRService: SignalRService,
  
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptions.add(this.appService.appState$.subscribe(state => { this.userName = state.userName }));
  }

  public ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  joinroom() {
    if (!this.roomName) {
      this.notificationService.notify("Room name is required", "Required", InfoMessageType.Warning);
      return;
    }

    if (this.roomName == "app") {
      this.notificationService.notify("This room name is not allowed", "Not possible", InfoMessageType.Warning);
      return;
    }

    if (!this.userName) {
      this.appService.openLogin().then(result => {
        if (result) {
          this.navigateRoom();
        }
      })
      return;
    }
    this.navigateRoom();
  }

  private navigateRoom() {
    this.router.navigate(['room/' + this.roomName], { relativeTo: this.route });
  }
}
