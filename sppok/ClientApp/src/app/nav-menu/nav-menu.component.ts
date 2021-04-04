import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../login/login.component';
import { AppService } from '../services/appService/app.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit  {
  isExpanded = false;
  constructor(
    private modalService: NgbModal,
    private appService: AppService) {
  }
  collapse() {
    this.isExpanded = false;
  }

  public ngOnInit() {
    if (!this.appService.current().userName) {
      this.openLogin();
    }
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openLogin() {
    const modalRef = this.modalService.open(LoginComponent);
    modalRef.result
      .then()
      .catch();
  }
}