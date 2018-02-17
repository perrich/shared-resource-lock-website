import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ConfigureComponent } from './configure/configure.component';
import { ResourceDetailComponent } from './resource-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'detail/:id', component: ResourceDetailComponent },
  { path: 'dashboard',  component: DashboardComponent },
  { path: 'configure',  component: ConfigureComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
