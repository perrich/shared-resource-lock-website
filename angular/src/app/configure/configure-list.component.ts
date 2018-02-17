import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Resource } from './../resource';

import { ResourceService } from './../resource.service';

@Component({
  selector: 'app-configure-list',
  templateUrl: './configure-list.component.html',
  styleUrls: ['./configure-list.component.css']
})
export class ConfigureListComponent implements OnInit {
  resources: Resource[] = [];

  isEmpty = true;

  selectedResource: Resource = null;

  constructor(private resourceService: ResourceService, private location: Location) { }

  ngOnInit() {
    this.resourceService.lock().subscribe(result => {
      if (result === true) {
        this.resourceService.getResources().subscribe(data => {
          this.resources = data;
          this.isEmpty = this.resources.length === 0;
        });
      }
    });
  }

  onSelect(resource: Resource | null): void {
    if (resource === null) {
      resource = new Resource();
      resource.id = this.getMaxId() + 1;
      this.resources.push(resource);
    }

    if (this.selectedResource === resource) {
      resource = null; // close if the same resource is selected
    }
    this.selectedResource = resource;
  }

  save(): void {
    this.resourceService.saveAll(this.resources).subscribe(result => {
      if (result === true) {
        this.resourceService.unlock().subscribe(result2 => {
          if (result2 === true) {
            this.location.go('dashboard');
          }
        });
      }
    });
  }

  Closed(resource: Resource) {
    this.selectedResource = null;
  }

  Deleted(resource: Resource) {
    this.resources.splice(this.resources.indexOf(resource), 1);
    this.selectedResource = null;
  }

  getMaxId(): number {
    let res = 0;

    for (const resource of this.resources) {
      if (resource.id > res) {
        res = resource.id;
      }
    }

    return res;
  }
}
