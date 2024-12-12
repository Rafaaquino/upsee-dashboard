import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userSubject = new BehaviorSubject<IUser | null>(null);
    user$ = this.userSubject.asObservable();

    constructor() {}

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
}
