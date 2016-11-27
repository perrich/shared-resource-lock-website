import { Component, OnInit, OnDestroy } from '@angular/core';

import { Type }            from './type';
import { Subscription }    from 'rxjs/Subscription';
import { Resource }        from './resource';
import { ResourceService } from './resource.service';
import { SessionStorage }  from 'ng2-webstorage';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard.component.html',
  styleUrls: ['app/dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy {
  types: Type[] = [];
  private subscription: Subscription;

  @SessionStorage("DashboardSelectedTypeName")
  selectedTypeName: string | null;
  
  private resources: Resource[] = [];

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

  hasSelection(): boolean {
    return this.selectedTypeName != null;
  }

  getTypeClass(type: Type): string[] {
    let classes: string[] = ["type"];

    if (this.hasSelection() && type.name == this.selectedTypeName) {
      classes.push("type-selected");
    }

    if (!type.isFree) {
      classes.push("type-hold");
    }

    return classes;
  }

  private refresh(): void {
    this.resourceService.getResources().subscribe(data => this.prepare(data));
  }

  private prepare(data: Resource[]): void {
    let resources: Resource[] = [];
    let typeNames: string[] = [];
    let types: { [id: string]: Type; } = {};

    for (let resource of data) {
      if (types[resource.type] == null) {
        let type = new Type();
        type.name = resource.type;
        type.isFree = false;

        types[resource.type] = type;
      }

      if (resource.user == null || resource.user == '') {
        types[resource.type].isFree = true;
      }

      if (this.hasSelection() && resource.type == this.selectedTypeName) {
        resources.push(resource);
      }
    }

    this.resources = resources;
    this.types = Object.values(types);
  }
}