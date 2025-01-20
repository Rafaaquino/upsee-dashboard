import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../models/login-response.interface';
import { Ilogin } from '../models/login.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IResetPassword } from '../models/reset-password.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient) {}

    login(login: Ilogin): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(environment.host_api + environment.api_verions + environment.host_auth + `/login`, login);
    }

    forgotPassword(email: string): Observable<string> {
        return this.http.post<string>(environment.host_api + environment.api_verions + environment.host_auth + `/forgot-password`, email);
    }

    codeAuthPass(code: string, email: string): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(environment.host_api + environment.api_verions + environment.host_auth + `/code-auth-recovery-password`, {
            code,
            email,
        });
    }

    resetPassword(newPass: IResetPassword, email: string): Observable<any> {
        return this.http.post<any>(environment.host_api + environment.api_verions + environment.host_auth + `/reset-password`, {
            newPass,
            email,
        });
    }
}
