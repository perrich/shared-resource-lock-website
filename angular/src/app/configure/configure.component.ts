import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from 'angular2-notifications';
import { SessionStorage } from 'ngx-webstorage';

@Component({
  selector: 'app-my-configure',
  templateUrl: 'configure.component.html',
  styleUrls: ['configure.component.css']
})

export class ConfigureComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
  }
}
