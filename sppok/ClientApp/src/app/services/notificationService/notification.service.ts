import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Injectable, NgZone } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { SignalRService } from "../signalrService/signalr.service";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(public toastr: ToastrService,
    private ngZone: NgZone  ) {
  }

  public permamentError(message: string) {
    this.toastr.error(message, "Error", { timeOut: 0 });
  }

  public notify(message: string, title: string, type: InfoMessageType) {
    if (!NgZone.isInAngularZone()) {
      console.log("Not angular zone");
    }
    switch (type) {
      case InfoMessageType.Error: {
        this.toastr.error(message, title, { timeOut: 5000 });
        break;
      }
      case InfoMessageType.Info: {
        this.toastr.info(message, title, { timeOut: 2000 });
        break;
      }
      case InfoMessageType.Success: {
        this.toastr.success(message, title, { timeOut: 2000 });
        break;
      }
      case InfoMessageType.Warning: {
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

export enum InfoMessageType {
  Info,
  Success,
  Warning,
  Error
}
