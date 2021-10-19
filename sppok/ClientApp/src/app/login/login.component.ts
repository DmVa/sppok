import { Component, Input } from '@angular/core';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../services/appService/app.service';
import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'pok-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Input() login: string;
  constructor(
    public modal: NgbActiveModal,
  ) {
    
  }

  public save() {
    this.modal.close(this.login);
  }
}
