import { Inject, Injectable } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject, Observable, Observer, Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserModel } from "../../sharedModels/userModel";
import { AppService } from "../appService/app.service";


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private _hubConnection: signalR.HubConnection;
  private _syserrorsSubject: Subject<string>;
  private _criticalErrorsSubject: Subject<string>;

  private _connectionRegisteredSubject: Subject<string>;
  private _connected: Boolean = false;
  private apiURL = '';
  private _roomName = '';
  private _expectedStop = false;
  public connectionRegistered$: Observable<string>;
  public syserrors$: Observable<string>;
  public criticalErrors$: Observable<string>;

  public topicChanged$: Observable<{ topic: string, userName: string }>;
  public userVoted$: Observable<{ vote: string, userName: string, connectionId: string }>;
  public voteStarted$: Observable<{ userName: string }>;
  public voteFinished$: Observable<{ userName: string }>;
  public userJoined$: Observable<{ userName: string, connectionId: string }>;
  public userLeft$: Observable<{ userName: string, connectionId: string }>;
  

  constructor(
    @Inject('BASE_URL') baseUrl: string,
    private appSerice: AppService) {
    this._syserrorsSubject = new Subject<string>();
    this.syserrors$ = this._syserrorsSubject.asObservable();
    this._criticalErrorsSubject = new Subject<string>();
    this.criticalErrors$ = this._criticalErrorsSubject.asObservable();
    this.apiURL = baseUrl + "app";
    this._connectionRegisteredSubject = new Subject<string>();
    this.connectionRegistered$ = this._connectionRegisteredSubject.asObservable();
    this.buildConnection();
  }

  private buildConnection() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.apiURL, { accessTokenFactory: () => this.appSerice.token})
      .build();
    
      this._hubConnection.onclose((error) => {
        this._connected = false;
        
        console.log("hub connection closed");
        if (!this._expectedStop) {
          this._criticalErrorsSubject.next("Conection Lost. Please refresh the page to restore connection.");
        }
      });

      this.addListeners();
  }

  public startConnection = (roomName) => {
    this._roomName = roomName;
    this._expectedStop = false;
    if (!this._connected) {
      this._hubConnection
        .start()
        .then(() => {
          this.registerConnectionId();
          this._connected = true;
        })
        .catch(err => {
          this._syserrorsSubject.next('Error while starting connection: ' + err)
        });
    }

    if (this._connected) {
      this.registerConnectionId()
    }
  }

  private addListeners(): void {
    this.addUserJoinedListener();
    this.addUserLeftListener();
    this.addTopicChangedListener();
    this.addVoteStartedListener();
    this.addVoteFinishedListener();
    this.addUserVotedListener();
  }

  public stop(): void {
    this._hubConnection
    this._expectedStop = true;
    this._hubConnection.stop()
      .then(value => {
        console.log('Connection stopped ')
      })
      .catch(err => this._syserrorsSubject.next('Error while stopping connection: ' + err))
  }

  // listeners
  private addUserJoinedListener = () => {
    let that = this;
    this.userJoined$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('userjoined', (userName, connectionId) => {
        subscriber.next({ userName: userName, connectionId: connectionId })
      });
    })
  }

  private addUserLeftListener = () => {
    let that = this;
    this.userLeft$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('userleft', (userName, connectionId) => {
        subscriber.next({ userName: userName, connectionId: connectionId })
      });
    })
  }

  private addTopicChangedListener = () => {
    let that = this;
    this.topicChanged$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('topicchanged', (topic, userName) => {
        subscriber.next({ topic: topic, userName: userName})
      });
    })
  }

  private addVoteStartedListener = () => {
    let that = this;
    this.voteStarted$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('votestarted', (userName) => {
        subscriber.next({userName: userName })
      });
    })
  }

  private addVoteFinishedListener = () => {
    let that = this;
    this.voteFinished$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('votefinished', (userName) => {
        subscriber.next({ userName: userName })
      });
    })
  }

  private addUserVotedListener = () => {
    let that = this;
    this.userVoted$ = new Observable(function subscribe(subscriber) {
      that._hubConnection.on('voted', (vote, userName, connectionId) => {
        subscriber.next({ vote: vote, userName: userName, connectionId: connectionId })
      });
    })
  }

  // push methods
  public raiseTopicChanged = (topic: string) => {
    this._hubConnection.invoke('topicchanged', this._roomName, topic)
      .catch(err => this._syserrorsSubject.next(err));;
  }

  public voted = (vote: string) => {
    this._hubConnection.invoke('voted', this._roomName, vote)
      .catch(err => this._syserrorsSubject.next(err));
  }

  public startVote = () => {
    this._hubConnection.invoke('votestrated', this._roomName)
      .catch(err => this._syserrorsSubject.next(err));
  }

  public endVote = () => {
    this._hubConnection.invoke('votefinished', this._roomName)
      .catch(err => this._syserrorsSubject.next(err));
  }

  private registerConnectionId = () => {
    this._hubConnection.invoke('registerconnectionid', this._roomName).then(
      (data) => {
        this.appSerice.setConnectionId(data);
        this._connected = true;
        this._connectionRegisteredSubject.next(data);
      }
    )
    .catch(err => this._syserrorsSubject.next(err));;
  }
}
