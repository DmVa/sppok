import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RoomState } from '../../sharedModels/roomState';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiURL = '';
  public roomState$: Subject<RoomState>;
  private contentJsonOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(@Inject('BASE_URL') baseUrl: string,
    private http: HttpClient,
  ) {
    this.apiURL = baseUrl + "api";
    this.roomState$ = new Subject<RoomState>()
}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  // HttpClient API get() method => Fetch employees list
  getState(roomName: string) {
    let that = this;
    this.http.get<RoomState>(this.apiURL + '/state/getstate?roomName='+roomName)
      .subscribe(response => {
        that.roomState$.next(response),
          er => that.handleError(er)
      })
  }

  getToken(username): Observable<string> {
    return this.http.post(this.apiURL + '/auth/login', { login: username, password: '' }, {responseType: 'text'})
  }

  // Error handling 
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
