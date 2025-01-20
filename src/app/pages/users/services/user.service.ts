import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userSubject = new BehaviorSubject<IUser | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) {}

    setUser(user: IUser) {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): IUser {
        const user = this.userSubject.value;
        if (user) return user;

        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    }

    updateUser(user: IUser, userID: string): Observable<IUser> {
        return this.http.patch<IUser>(environment.host_api + environment.api_verions + environment.host_user + `/edit/${userID}`, user).pipe();
    }
}
