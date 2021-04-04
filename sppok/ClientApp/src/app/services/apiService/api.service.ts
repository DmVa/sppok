import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RoomState } from '../../sharedModels/roomState';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  private apiURL = '';

  constructor(@Inject('BASE_URL') baseUrl: string,
    private http: HttpClient,
  ) {
  this.apiURL = baseUrl + "api";
}

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  // HttpClient API get() method => Fetch employees list
  getState(): Observable<RoomState> {
    return this.http.get<RoomState>(this.apiURL + '/state/getstate')
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
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