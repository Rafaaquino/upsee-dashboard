import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/user.interface';

@Component({
    moduleId: module.id,
    templateUrl: './profile.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class ProfileComponent {
    user: IUser;

    constructor(private _userService: UserService) {
        this.user = this._userService.getUser();
        console.log(this.user);
    }
}
