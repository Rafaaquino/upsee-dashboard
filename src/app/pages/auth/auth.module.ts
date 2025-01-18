import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { PasswordResetComponent } from './components/resetPassword/reset-password.component';
import { SigninComponent } from './components/singnin/signin.component';
import { SignupComponent } from './components/singup/boxed-signup';
import { MenuModule } from 'headlessui-angular';
import { CodeAuthenticateComponent } from './components/codeAuthenticate/codeAuthenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './components/forgotPassword/forgotPassword.component';
import { AuthGuardService } from 'src/app/core/guards/authGuard.service';

const routes: Routes = [
    { path: 'auth/code-authenticate', component: CodeAuthenticateComponent, title: 'Codigo de Autenticação | UPSEE - Dashboard' },
    { path: 'auth/forgot-password', component: ForgotPasswordComponent, title: 'Recuperar Senha | UPSEE - Dashboard' },
    { path: 'auth/reset-password', canActivate: [AuthGuardService], component: PasswordResetComponent, title: 'Nova Senha | UPSEE - Dashboard' },
    { path: 'auth/signin', component: SigninComponent, title: 'Login | UPSEE - Dashboard' },
    { path: 'auth/signup', component: SignupComponent, title: 'Criar conta | UPSEE - Dashboard' },
];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, MenuModule, IconModule, FormsModule, ReactiveFormsModule],
    declarations: [ForgotPasswordComponent, PasswordResetComponent, CodeAuthenticateComponent, SignupComponent],
})
export class AuthModule {}
