import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ErrorHandlerComponent } from './error-hanlder-component/error-handler.component';
import { ErrorHandlerService } from './error-handler.service';
import { ModalModule } from 'angular-custom-modal';

@NgModule({
    declarations: [ErrorHandlerComponent],
    imports: [CommonModule, DialogModule, ButtonModule, ModalModule],
    exports: [ErrorHandlerComponent],
    providers: [ErrorHandlerService],
})
export class ErrorHandlerModule {}
