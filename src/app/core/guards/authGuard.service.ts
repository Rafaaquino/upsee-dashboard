import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth.service';
import { VerifyTokenService } from '../services/verifyToken.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(private router: Router, private _verifyTokenService: VerifyTokenService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (this._verifyTokenService.isUserLoggedin()) return true;
        this.router.navigateByUrl('/auth/signin');
        return false;
    }
}
