import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { LoginComponent } from "../../login/login.component";
import { ApiService } from "../apiService/api.service";
import { AppState } from "./appState";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public token: string  = '';
  private _appStateSubject = new BehaviorSubject({ userName: '', connectionId: '' });
  public current(): AppState {
    return this._appStateSubject.value;
  }

  public appState$: Observable<AppState> = this._appStateSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal) {
  }

  public init() {
    let userName = localStorage.getItem('username');
    if (userName) {
      this._appStateSubject.value.userName = userName;
      this.raiseAppStateChanged();
    }
  }

  public connect(): Promise<any> {
    let that = this;
    return new Promise((resolve, reject) => {
      this.apiService.getToken(this._appStateSubject.value.userName)
        .subscribe(
          token => {
            that.token = token;
            resolve(true);
          },
          error => reject(error));
    });
  }

  public disconnect() {
    this.setUserName('');
  }

  public openLogin(): Promise<boolean> {
    let that = this;
    let result = new Promise<boolean>(function (resolve, reject) {
      const modalRef = that.modalService.open(LoginComponent);
      modalRef.componentInstance.login = that._appStateSubject.value.userName;
      modalRef.result
        .then((result) => {
          if (result) {
            that.setUserName(result)
            resolve(true)
          }
          resolve(false)
        })
        .catch(reject);
    });

    return result;
  }

  public setUserName(userName: string) {
    this._appStateSubject.value.userName = userName;
    localStorage.setItem('username', userName);
    this.raiseAppStateChanged()
  }

  public setConnectionId(connectionId: string) {
    this._appStateSubject.value.connectionId = connectionId;
  }

  private raiseAppStateChanged() {
    this._appStateSubject.next(this._appStateSubject.value);
  }
}
