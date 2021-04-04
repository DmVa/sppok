import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../services/apiService/api.service';

import { AppService } from '../services/appService/app.service';
import { HubNotificationService } from '../services/notificationService/hubnotification.service';
import { InfoMessageType, NotificationService } from '../services/notificationService/notification.service';

import { SignalRService } from '../services/signalrService/signalr.service';
import { RoomState } from '../sharedModels/roomState';
import { UserModel } from '../sharedModels/userModel';

@Component({
  selector: 'voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
  animations: [
    trigger('itemAddRemove', [
      transition(':enter', [
        style({ opacity: 0.2 }),
        animate('2s ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class VotingComponent  {
  explation: string = 'Loading...';
  private self = this;
  public state: RoomState = { isvoting: false, topic: '', users:[] }
  public yourVote: string = '';

  constructor(
    public appService: AppService,
    private apiService: ApiService,
    private signlalRService: SignalRService,
    private hubnotificationService: HubNotificationService,
    private notificationService: NotificationService,
    private changeDetector: ChangeDetectorRef
  ) {
    let that = this;
    this.signlalRService.connectionRegistered$.subscribe((connectionId) => that.onConnectionRegistered(connectionId));
    this.signlalRService.voteStarted$.subscribe(value => {
      that.state.isvoting = true;
      that.state.users.forEach(x => { x.vote = '' });
      that.yourVote = '';
      that.updateExplanation();
    });

    this.signlalRService.voteFinished$.subscribe(value => {
      that.state.isvoting = false;
      that.updateExplanation();
    });

    this.signlalRService.userJoined$.subscribe(value => { that.onUserJoined(value.userName, value.connectionId) })
    this.signlalRService.userLeft$.subscribe(value => { that.onUserLeft(value.userName, value.connectionId) })
    this.signlalRService.userVoted$.subscribe(value => { that.onUserVoted(value.vote, value.userName, value.connectionId) })
  }

  private onUserLeft(userName: string, connectionId: string) {
    let user = this.state.users.filter(x => x.connectionId == connectionId);
    if (user) {
      this.state.users = this.state.users.filter(x => x.connectionId != connectionId);
    }
  }

  private onUserJoined(userName: string, connectionId: string) {
    var users = this.state.users.filter(x => x.connectionId == connectionId);
    if (!users || users.length == 0) {
      let newUser: UserModel = { name: userName, connectionId : connectionId, vote : '' }; 
      this.state.users.push(newUser);
    }
  }

  private onUserVoted(vote: string, userName: string, connectionId: string) {
    let user = this.state.users.find(x => x.connectionId == connectionId)
    if (user) {
      user.vote = vote;
      if (connectionId == this.appService.current().connectionId) {
        this.yourVote = vote;
        this.updateExplanation();
      }
    }
  }

  private onConnectionRegistered(connectionId: string) {
    this.apiService.getState().subscribe(room => {
      this.state = room;

      let user = this.state.users.find(x => x.connectionId == this.appService.current().connectionId)
      if (user) {
        this.yourVote = user.vote;

      }

      this.updateExplanation();
    });
  }

  public sendVote() {
    if (this.yourVote && this.yourVote.length > 9) {
      this.notificationService.notify("It's a serious vote. Choose value better.", "Vote", InfoMessageType.Error);
      return;
    }

    this.signlalRService.voted(this.yourVote ?? '');
  }

  public startVote() {
    this.signlalRService.startVote();
  }

  public endVote() {
    this.signlalRService.endVote();
  }

  public updateExplanation() {
    if (!this.state.isvoting) {
      this.explation = 'Voting is not started.'
    } else {
      if (this.yourVote && this.yourVote.length > 0) {
        this.explation = 'Voting in progress. You voted.'
      } else {
        this.explation = 'Voting in progress. Please vote.'
      }
    }
  }
}
