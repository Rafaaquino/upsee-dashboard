import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from 'src/app/pages/users/services/user.service';

@Injectable({
    providedIn: 'root',
})
export class VerifyTokenService {
    constructor(private router: Router, private user: UserService) {}

    isUserLoggedin() {
        const token = this.getAuthorizationToken();
        if (!token) return false;
        if (this.isTokenExpired(token)) return false;
        return true;
    }

    getAuthorizationToken() {
        return localStorage.getItem('token');
    }

    tokenExpiration(token: string): any {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        this.user.setUser(decoded);
        if (decoded.exp === undefined) return null;
        return decoded;
    }

    isTokenExpired(token: string): boolean {
        if (!token) return true;

        const decoded = this.tokenExpiration(token);
        const currentTime = Date.now() / 1000;

        if (decoded === undefined) return false;

        return !(decoded.exp > currentTime);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        this.router.navigateByUrl('auth/singnin');
    }
}
