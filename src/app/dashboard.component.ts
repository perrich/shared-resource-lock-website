import { Component, OnInit, OnDestroy } from '@angular/core';

import { Type } from './type';
import { Subtype } from './subtype';
import { DashboardData } from './dashboard-data';
import { Subscription } from 'rxjs/Subscription';
import { Resource } from './resource';
import { ResourceService } from './resource.service';
import { SessionStorage } from 'ng2-webstorage';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard.component.html',
  styleUrls: ['app/dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  dashboardData: DashboardData = new DashboardData([], null);
  private subscription: Subscription;

  @SessionStorage("DashboardSelectedTypeName")
  selectedTypeName: string | null;

  constructor(private resourceService: ResourceService) { }

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
    let classes: string[] = ["type"];

    if (this.hasTypeSelection() && type.name == this.selectedTypeName) {
      classes.push("type-selected");
    }

    if (!type.isFree) {
      classes.push("type-hold");
    } else if (type.hasSubType) {
      classes.push("type-with-subtype");
    }

    return classes;
  }

  private refresh(): void {
    this.resourceService.getResources().subscribe(data => this.dashboardData = new DashboardData(data, this.selectedTypeName));
  }
}