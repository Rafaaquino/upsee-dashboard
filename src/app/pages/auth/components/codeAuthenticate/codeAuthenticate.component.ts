import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ForgotPasswordService } from '../../services/forgotPassword.service';

@Component({
    moduleId: module.id,
    selector: 'app-codeAuthenticate',
    templateUrl: './codeAuthenticate.component.html',
    styleUrls: ['./codeAuthenticate.component.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class CodeAuthenticateComponent {
    store: any;
    codeAuthForm: FormGroup;

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private fb: FormBuilder,
        private _forgotPassService: ForgotPasswordService
    ) {
        this.initStore();
        this.codeAuthForm = this.fb.group({
            code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        });
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    ngOnInit(): void {}

    get f() {
        return this.codeAuthForm.controls;
    }

    submit() {
        if (this.codeAuthForm.valid) {
            const email = localStorage.getItem('email') as string;
            const code = this.codeAuthForm.get('code')?.value;
            this._forgotPassService.codeAuthPass(code, email).subscribe({
                next: this.onSubmitSuccess.bind(this),
                error: this.onSubmitError.bind(this),
            });
        }
    }

    onSubmitSuccess(response: any) {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.router.navigateByUrl('auth/reset-password');
    }

    onSubmitError(error: any) {
        console.log(error);
    }
}
