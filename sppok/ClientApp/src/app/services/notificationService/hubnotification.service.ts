import { Injectable, NgZone } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { SignalRService } from "../signalrService/signalr.service";

import { InfoMessageType, NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class HubNotificationService {

  constructor(
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private signlalRService: SignalRService) {
    this.init();
  }

  private init() {
    this.signlalRService.syserrors$.subscribe(value => {
      this.notificationService.notify(value, 'Error', InfoMessageType.Error);
    });

    this.signlalRService.criticalErrors$.subscribe(value => {
      this.notificationService.permamentError(value);
    });

    this.signlalRService.topicChanged$.subscribe((value) => {
      if (!value || !value.topic) {
        console.log("topic not defined");
        return;
      }

      let message = 'New topic: ' + value.topic.substr(0, 30);
      if (value.topic.length > 30) {
        message = message + '...';
      } 
      this.notificationService.notify(message, value.userName, InfoMessageType.Info);
    });

    this.signlalRService.userJoined$.subscribe((value) => {
      this.notificationService.notify('Connected', value.userName, InfoMessageType.Info);
    });

    this.signlalRService.userLeft$.subscribe((value) => {
      this.notificationService.notify('Disconnected', value.userName, InfoMessageType.Info);
    });
    this.signlalRService.voteStarted$.subscribe(value => {
      this.notificationService.notify('Started Vote', value.userName, InfoMessageType.Warning);
    });
    this.signlalRService.voteFinished$.subscribe(value => {
      this.notificationService.notify('Finished Vote', value.userName, InfoMessageType.Warning);
    });
  }
}
