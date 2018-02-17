import { TestBed, ComponentFixture, inject } from '@angular/core/testing';

import { User } from './user';
import { UserService } from './user.service';

////////  SPECS  /////////////
describe('UserService', function () {
    const myName = 'MY_NAME';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserService]
        });
    });

    it('should return the previously setted ',
        inject([UserService], (userService: UserService) => {
            userService.save(createUser(myName));

            const user = userService.get();
            expect(user).toBeDefined();
            expect(user.name).toEqual(myName);
        }));

    function createUser(name: string): User {
      const user = new User();
        user.name = name;
        return user;
    }
});
