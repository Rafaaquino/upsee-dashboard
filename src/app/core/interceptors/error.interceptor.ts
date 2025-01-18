import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VerifyTokenService } from 'src/app/core/services/verifyToken.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private _authService: VerifyTokenService, private _errorHandlerService: ErrorHandlerService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error) => {
                if (error instanceof HttpErrorResponse) {
                    console.log('error interceptor :', error);
                    if (error.status === 401) {
                        this._authService.logout();
                    }
                    if ([500, 501, 502, 503].includes(error.status)) {
                        this._errorHandlerService.showErrorModal(error.error);
                    }
                }
                return throwError(error);
            })
        );
    }
}
