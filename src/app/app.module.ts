// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule }             from '@angular/platform-browser';
import { FormsModule }               from '@angular/forms';
import { HttpModule }                from '@angular/http';
import { Ng2Webstorage }             from 'ng2-webstorage';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';

import { Config } from './config'
import { ResourceService }  from './resource.service';
import { UserService }  from './user.service';

import { AppComponent }  from './app.component';
import { DashboardComponent }   from './dashboard.component';
import { ResourceDetailComponent }   from './resource-detail.component';
import { UserFormComponent }   from './user-form.component';

@NgModule({
  imports: [     
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    SimpleNotificationsModule,
    Ng2Webstorage
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    ResourceDetailComponent,
    UserFormComponent
  ],
  providers: [ 
    ResourceService,
    UserService,
    Config,
    { provide: APP_INITIALIZER,
      useFactory: (config: Config) => () => config.load(),
      deps: [Config],
      multi: true }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
