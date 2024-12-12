import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { ForgotPasswordService } from '../../services/forgotPassword.service';

@Component({
    moduleId: module.id,
    selector: 'app-forgotPassword',
    templateUrl: './forgotPassword.component.html',
    styleUrls: ['./forgotPassword.component.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class ForgotPasswordComponent implements OnInit {
    store: any;
    forgotPassForm: FormGroup;

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private _forgotPassService: ForgotPasswordService,
        private fb: FormBuilder
    ) {
        this.initStore();
        this.forgotPassForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
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
        return this.forgotPassForm.controls;
    }

    submit() {
        if (this.forgotPassForm.valid) {
            this._forgotPassService.forgotPassword(this.forgotPassForm.value).subscribe({
                next: this.onSubmitSuccess.bind(this),
                error: this.onSubmitError.bind(this),
            });
        }
    }

    onSubmitSuccess(res: any) {
        console.log(res);
        localStorage.setItem('email', res.email);
        this.router.navigateByUrl('auth/code-authenticate');
    }

    onSubmitError(error: any) {
        console.log(error.error.message);
        this.f['email'].setErrors({ customError: error.error.message });
    }
}
