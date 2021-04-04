import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { SignalRService } from "../signalrService/signalr.service";
import { NotificationType } from "./notificationtype";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {
  }

  public notify(message: string, title: string, type: NotificationType) {
    switch (type) {
      case NotificationType.Error: {
        this.toastr.error(message, title, { timeOut: 5000 });
        break;
      }
      case NotificationType.Info: {
        this.toastr.info(message, title, { timeOut: 2000 });
        break;
      }
      case NotificationType.Success: {
        this.toastr.success(message, title, { timeOut: 2000 });
        break;
      }
      case NotificationType.Warning: {
        this.toastr.warning(message, title, { timeOut: 4000 });
        break;
      }
      default: {
        this.toastr.info(message, title);
        break;
      }
    }

    console.log(title + ':' + message);
  }
}
