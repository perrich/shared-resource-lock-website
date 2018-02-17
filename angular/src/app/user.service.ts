import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';

import { User } from './user';

@Injectable()
export class UserService {
    @LocalStorage('CurrentUser')
    private user: User;

    get(): User {
        if (this.user == null) {
            this.user = new User();
        }
        return this.user;
    }

    save(user: User): void {
        this.user = user;
    }
}
