import { Component } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../services/appService/app.service';
import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'pok-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  closeResult: string;
  public login: string;
  constructor(
    private signalrService: SignalRService,
    private appService: AppService,
    public modal: NgbActiveModal,
  ) {
    this.login = appService.current().userName;
  }
  public save() {
    this.appService.setUserName(this.login);
    this.signalrService.startConnection();
    this.modal.close();
  }
}
