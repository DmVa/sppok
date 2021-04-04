import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { AppState } from "./appState";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  private _appStateSubject = new BehaviorSubject({ userName: '', connectionId: '' });
  public current(): AppState {
    return this._appStateSubject.value;
  }

  public appState$: Observable<AppState> = this._appStateSubject.asObservable();
  constructor() {
    let userName = localStorage.getItem('username');
    if (userName) {
      this._appStateSubject.value.userName = userName;
      this.raiseAppStateChanged();
    }
  }

  setUserName(userName: string) {
    this._appStateSubject.value.userName = userName;
    localStorage.setItem('username', userName);
    this.raiseAppStateChanged()
  }

  setConnectionId(connectionId: string) {
    this._appStateSubject.value.connectionId = connectionId;
  }

  private raiseAppStateChanged() {
    this._appStateSubject.next(this._appStateSubject.value);
  }
}
