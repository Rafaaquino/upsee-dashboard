import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor() {}

    private showModalSubject$ = new BehaviorSubject<boolean>(false);
    public showModal$ = this.showModalSubject$.asObservable();

    private errorMessageSubject$ = new BehaviorSubject<{ status: number; message: string }>({ status: 0, message: '' });
    public errorMessage$ = this.errorMessageSubject$.asObservable();

    showErrorModal(error: { status: number; message: string }) {
        this.errorMessageSubject$.next(error);
        this.showModalSubject$.next(true);
    }
}
