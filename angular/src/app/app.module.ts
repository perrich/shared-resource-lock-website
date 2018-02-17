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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2Webstorage } from 'ngx-webstorage';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { AppRoutingModule } from './app-routing.module';

import { Config } from './config';
import { ResourceService } from './resource.service';
import { UserService } from './user.service';


import { ResourcesPipe } from './resource.pipe';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard.component';
import { ConfigureComponent } from './configure/configure.component';
import { ResourceDetailComponent } from './resource-detail.component';
import { UserFormComponent } from './user-form.component';
import { ConfigureFormComponent } from './configure/configure-form.component';
import { ConfigureListComponent } from './configure/configure-list.component';
import { SortedResourcePipe } from './sorted-resource.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule,
    Ng2Webstorage
  ],
  declarations: [
    ResourcesPipe,
    AppComponent,
    DashboardComponent,
    ConfigureComponent,
    ResourceDetailComponent,
    UserFormComponent,
    ConfigureFormComponent,
    ConfigureListComponent,
    SortedResourcePipe
  ],
  providers: [
    ResourceService,
    UserService,
    Config,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: Config) => () => config.load(),
      deps: [Config],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
