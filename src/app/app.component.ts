import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    public options = {
        position: ["bottom", "right"],
        timeOut: 5000,
        lastOnBottom: true
    }
 }
