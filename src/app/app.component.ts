import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'my-app',
    providers: [NotificationsService],
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    public options = {
        position: ["bottom", "right"],
        timeOut: 5000,
        lastOnBottom: true,
        showProgressBar: false
    }
}
