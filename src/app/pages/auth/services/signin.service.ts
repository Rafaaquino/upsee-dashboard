import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ilogin } from '../models/login.interface';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../models/login-response.interface';
import { environment } from 'src/environments/environment.dev';

@Injectable({
    providedIn: 'root',
})
export class SigninService {
    constructor(private _http: HttpClient) {}

    login(login: Ilogin): Observable<ILoginResponse> {
        return this._http.post<ILoginResponse>(environment.host_api + `/users/login`, login);
    }
}
