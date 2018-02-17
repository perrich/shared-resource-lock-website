import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';

import { AppModule } from './app.module';

import 'angular2-notifications';
import 'ngx-webstorage';

// enableProdMode();
platformBrowserDynamic().bootstrapModule(AppModule);
