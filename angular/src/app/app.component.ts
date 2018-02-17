import { Component } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-component',
    providers: [NotificationsService],
    templateUrl: 'app.component.html'
})
export class AppComponent {
    public options = {
        position: ['bottom', 'right'],
        timeOut: 5000,
        lastOnBottom: true,
        showProgressBar: false
    };
}
