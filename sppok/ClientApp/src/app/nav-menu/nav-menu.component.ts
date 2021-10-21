import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';
import { LoginComponent } from '../login/login.component';
import { AppService } from '../services/appService/app.service';
import { SignalRService } from '../services/signalrService/signalr.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit  {
  isExpanded = false;
  isProduction = false;
  constructor(
    private modalService: NgbModal,
    private appService: AppService,
    private signalR: SignalRService,
    private router: Router,
  ) {
    this.isProduction = environment.production;

  }
  collapse() {
    this.isExpanded = false;
  }

  public ngOnInit() {
   
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openLogin() {
    this.appService.openLogin();
  }

  disconnect() {
    this.signalR.stop();
    this.appService.disconnect();
    this.router.navigate(['/']);
  }

  leaveRoom() {
    this.signalR.stop();
    this.router.navigate(['/']);
  }
}
