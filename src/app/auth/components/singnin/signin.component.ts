import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { SigninService } from '../../services/signin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILoginResponse } from '../../models/login-response.interface';

@Component({
    moduleId: module.id,
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class SigninComponent implements OnInit {
    store: any;
    loginForm: FormGroup;

    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
        private fb: FormBuilder,
        private _signinService: SigninService
    ) {
        this.initStore();
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    ngOnInit(): void {}

    get f() {
        return this.loginForm.controls;
    }

    submit() {
        if (this.loginForm.valid) {
            this._signinService.login(this.loginForm.value).subscribe({
                next: this.onSubmitSuccess.bind(this),
                error: this.onSubmitError.bind(this),
            });
        }
    }

    onSubmitSuccess(response: ILoginResponse) {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId);
        this.router.navigateByUrl('/');
    }

    onSubmitError(error: any) {
        const erro = error.error.message;
        console.log(error.error.message);
        this.f['password'].setErrors({ customError: erro });
        //this.show(erro);
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }
}
