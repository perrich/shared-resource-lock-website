import { Component, OnInit }      from '@angular/core';

import { User }        from './user';
import { UserService } from './user.service';

@Component({
  selector: 'my-user-form',
  templateUrl: 'app/user-form.component.html',
  styleUrls: [ 'app/user-form.component.css' ]
})
export class UserFormComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void { this.user = this.userService.get(); }

  onSubmit() { this.userService.save(this.user); }
}