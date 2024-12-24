import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPasswordService } from '../../services/forgotPassword.service';

@Component({
    moduleId: module.id,
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class PasswordResetComponent implements OnInit {
    store: any;
    isPasswordVisible = false;
    resetPassForm: FormGroup;

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private _forgotPassService: ForgotPasswordService,
        private fb: FormBuilder
    ) {
        this.initStore();
        this.resetPassForm = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            mathPassword: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    ngOnInit(): void {}

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    get f() {
        return this.resetPassForm.controls;
    }

    submit() {
        if (this.resetPassForm.invalid) {
            return alert('Invalid Form');
        }

        if (this.f['newPassword'].value !== this.f['mathPassword'].value) {
            this.f['mathPassword'].setErrors({ customError: 'As Senhas não são iguais' });
        }

        if (this.resetPassForm.valid) {
            const email = localStorage.getItem('email') as string;
            this._forgotPassService.resetPassword(this.resetPassForm.value, email).subscribe({
                next: this.onSubmitSuccess.bind(this),
                error: this.onSubmitError.bind(this),
            });
        }
    }

    onSubmitSuccess(res: any) {
        console.log(res);
        localStorage.removeItem('email');
        this.router.navigateByUrl('/');
    }

    onSubmitError(error: any) {
        console.log(error);
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }
}
