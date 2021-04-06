import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { SignalRService } from "../signalrService/signalr.service";

import { InfoMessageType, NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root'
})
export class HubNotificationService {
  constructor(
    private notificationService: NotificationService,
    private signlalRService: SignalRService) {
  }

  public init() {
    this.signlalRService.syserrors$.subscribe(value => {
      this.notificationService.notify(value, 'Error', InfoMessageType.Error);
    });

    this.signlalRService.topicChanged$.subscribe((value) => {
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
