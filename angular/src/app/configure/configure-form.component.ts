import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Resource } from './../resource';
import { ConfigureData } from './../configure-data';

import { ResourceService } from './../resource.service';

@Component({
  selector: 'app-configure-form',
  templateUrl: './configure-form.component.html',
  styleUrls: ['./configure-form.component.css']
})
export class ConfigureFormComponent implements OnInit {
  @Input() resource: Resource;

  @Output() Closed = new EventEmitter<Resource>();
  @Output() Deleted = new EventEmitter<Resource>();

  typeList: string[] = [];
  subtypeList: string[] = [];

  constructor(
    private resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.resourceService.getResources().subscribe(data => {
      const lists = new ConfigureData(data);
      this.typeList = lists.types;
      this.subtypeList = lists.subtypes;
    });
  }

  close(): void {
    this.Closed.emit(this.resource);
  }

  delete(): void {
    this.Deleted.emit(this.resource);
  }
}
