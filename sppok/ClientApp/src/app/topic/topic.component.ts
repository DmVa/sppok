import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/apiService/api.service';

import { AppService } from '../services/appService/app.service';
import { HubNotificationService } from '../services/notificationService/hubnotification.service';
import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'topic-home',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.css']
})
export class TopicComponent  {
  text: string = '';
  constructor(
    public appService: AppService,
    public apiService: ApiService,
    private signlalRService: SignalRService,
  ) {
    this.signlalRService.topicChanged$.subscribe(value => { this.text = value.topic; });

    this.apiService.roomState$.subscribe(value => {
      this.text = value.topic;
    });
  }

  public changetopic() {
    this.signlalRService.raiseTopicChanged(this.text);
  }
}
