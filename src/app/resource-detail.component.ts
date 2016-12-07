import 'rxjs/add/operator/switchMap';
import { ViewChild, ElementRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params }       from '@angular/router';
import { Location }                     from '@angular/common';
import { Subscription }                 from 'rxjs/Subscription';
import { NotificationsService }         from 'angular2-notifications';

import { Resource }        from './resource';
import { ResourceService } from './resource.service';
import { UserService }     from './user.service';

@Component({
  selector: 'my-resource-detail',
  templateUrl: 'app/resource-detail.component.html',
  styleUrls: [ 'app/resource-detail.component.css' ]
})
export class ResourceDetailComponent implements OnInit, OnDestroy {
  resource: Resource;
  id: number | null;
  @ViewChild('myComment') input: ElementRef; 

  private subscription: Subscription;

  constructor(
    private resourceService: ResourceService, 
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];            
      this.subscription = this.resourceService.dataChange.subscribe(a => this.refresh());
      this.refresh();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hold(): void {
    let user = this.userService.get();

    if (user != null) {
      let resource = { ...this.resource };
      resource.comment = this.input.nativeElement.value;
      resource.user = user.name;
      resource.date = new Date();

      this.resourceService.update(resource).subscribe((isSuccessful: boolean) => isSuccessful ? this.goBack() : this.showError());
    }
  }

  free(): void {
    let resource = { ...this.resource };
    resource.description = this.resource.description;
    resource.user = null;
    resource.date = null;
    resource.comment = null;
    this.resourceService.update(resource).subscribe((isSuccessful: boolean) => isSuccessful ? this.goBack() : this.showError());
  }

  goBack(): void {
    this.location.back();
  }

  showError(): void {
    this.notificationsService.error("Update Error", "Cannot update the resource, seems to already have changed to another state.");
  }

  private refresh(): void {
    this.resourceService.getResource(this.id).subscribe(resource => {
      this.resource = resource
    });
  }
}