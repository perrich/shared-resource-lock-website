import { Component, OnInit, OnDestroy } from '@angular/core';

import { Config } from './config';
import { Type } from './type';
import { Subtype } from './subtype';
import { DashboardData } from './dashboard-data';
import { Subscription } from 'rxjs/Subscription';
import { NotificationsService } from 'angular2-notifications';
import { Resource } from './resource';
import { ResourceService } from './resource.service';
import { SessionStorage } from 'ngx-webstorage';
import { UserService } from './user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: DashboardData = new DashboardData([], null);
  private subscription: Subscription;

  private lastMyOldResourcesCheck: Date | null;

  @SessionStorage('DashboardSelectedTypeName')
  selectedTypeName: string | null;

  constructor(
    private resourceService: ResourceService,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private config: Config
  ) { }

  ngOnInit(): void {
    this.subscription = this.resourceService.dataChange.subscribe(a => this.refresh());
    this.refresh();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSelect(type: Type): void {
    this.selectedTypeName = type.name;
    this.refresh();
  }

  isHold(resource: Resource): boolean {
    return resource.user != null;
  }

  hasTypeSelection(): boolean {
    return this.selectedTypeName != null;
  }

  getTypeClass(type: Type): string[] {
    const classes: string[] = ['type'];

    if (this.hasTypeSelection() && type.name === this.selectedTypeName) {
      classes.push('type-selected');
    }

    if (!type.isFree) {
      classes.push('type-hold');
    } else if (type.hasSubTypes) {
      classes.push('type-with-subtype');
    }

    return classes;
  }

  private refresh(): void {
    this.resourceService.getResources().subscribe(data => {
      this.dashboardData = new DashboardData(data, this.selectedTypeName);
      this.checkMyOldResourcesIfNeeded();
    });
  }

  private checkMyOldResourcesIfNeeded(): void {
    const minDate = new Date();
    minDate.setMinutes(minDate.getMinutes() - this.config.get('myOldResourcesCheckDelayInMinutes'));

    if (this.lastMyOldResourcesCheck == null || this.lastMyOldResourcesCheck < minDate) {
      this.checkMyOldResources();
      this.lastMyOldResourcesCheck = new Date();
    }
  }

  private checkMyOldResources(): void {
    const olds = this.resourceService.getOldResources(this.userService.get() != null ? this.userService.get().name : '');
    if (olds.length === 1) {
      const current = olds[0];
      const type = current.type + (current.subtype !== null ? '/' + current.subtype : '');
      this.notificationsService.alert('Very old lock', 'Seems that you have a very old lock (' + type + '/' + current.name + '), please free or renew it.');
    } else if (olds.length > 1) {
      this.notificationsService.alert('Very old lock', 'Seems that you have ' + olds.length + ' very old locks, please free or renew them.');
    }
  }
}
