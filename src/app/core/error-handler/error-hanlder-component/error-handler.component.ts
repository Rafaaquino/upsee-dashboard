import { Component } from '@angular/core';
import { ErrorHandlerService } from '../error-handler.service';

@Component({
    selector: 'app-error-handler',
    templateUrl: './error-handler.component.html',
    styleUrls: ['./error-handler.component.scss'],
})
export class ErrorHandlerComponent {
    displayErrorModal: boolean = false;
    message: string = '';
    messageDefault: string = 'Ocorreu um erro inesperado. Por Favor, tente novamente mais tarde.';

    constructor(private _errorHandlerService: ErrorHandlerService) {
        this._errorHandlerService.showModal$.subscribe((show) => {
            this.displayErrorModal = show;
        });

        this._errorHandlerService.errorMessage$.subscribe((error) => {
            this.message = error.message;
        });
    }

    closeModal() {
        this.displayErrorModal = false;
    }
}
