import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class ProfileComponent implements OnInit {
    user: IUser;
    disabledForm = true;
    formUser: FormGroup;

    constructor(private _userService: UserService, private _fb: FormBuilder) {
        this.formUser = this._fb.group({
            profile: this._fb.group({
                firstName: [{ value: '', disabled: true }, Validators.required],
                lastName: [{ value: '', disabled: true }, Validators.required],
                email: [{ value: '', disabled: true }, Validators.required],
                dateOfBirth: [{ value: '', disabled: true }],
                address: this._fb.group({
                    street: [{ value: '', disabled: true }, Validators.required],
                    complement: [{ value: '', disabled: true }],
                    city: [{ value: '', disabled: true }, Validators.required],
                    state: [{ value: '', disabled: true }, Validators.required],
                    country: [{ value: '', disabled: true }, Validators.required],
                    zip: [{ value: '', disabled: true }, Validators.required],
                }),
                contacts: this._fb.group({
                    phone: [{ value: '', disabled: true }],
                    mobile: [{ value: '', disabled: true }],
                }),
            }),
        });

        this.user = this._userService.getUser();
        console.log(this.user);
    }

    ngOnInit() {}

    onSubmit() {
        debugger;
        if (this.formUser.valid) {
            this._userService.updateUser(this.formUser.value, this.user.id).subscribe(
                (user) => {
                    this._userService.setUser(user);
                    this.formUser.disable();
                },
                (error) => {
                    console.error(error);
                }
            );
        }
    }

    editProfile() {
        this.disabledForm ? this.formUser.enable() : this.formUser.disable();
    }
}
