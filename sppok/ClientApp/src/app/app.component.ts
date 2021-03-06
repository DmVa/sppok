import { Component } from '@angular/core';
import { AppService } from './services/appService/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  constructor(
    private appService: AppService,
  ) {
    this.appService.init();
  }
}
