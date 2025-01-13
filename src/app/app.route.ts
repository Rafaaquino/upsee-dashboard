import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './pages/dashboard/index';
import { AppLayout } from './shared/layouts/app-layout';
import { AuthLayout } from './shared/layouts/auth-layout';
import { AuthGuardService } from './service/authGuard.service';
import { Error404Component } from './shared/erros/error404';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuardService],
        children: [
            // dashboard
            { path: '', component: IndexComponent, title: 'Sales Admin | UPSEE - Dashboard' },

            //apps
            { path: '', loadChildren: () => import('./apps/apps.module').then((d) => d.AppsModule) },

            // components
            { path: '', loadChildren: () => import('./shared/components/components.module').then((d) => d.ComponentsModule) },

            // elements
            { path: '', loadChildren: () => import('./shared/elements/elements.module').then((d) => d.ElementsModule) },

            // forms
            { path: '', loadChildren: () => import('./shared/forms/form.module').then((d) => d.FormModule) },

            // users
            { path: '', loadChildren: () => import('./pages/users/user.module').then((d) => d.UsersModule) },
        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },

            // auth
            { path: '', loadChildren: () => import('./pages/auth/auth.module').then((d) => d.AuthModule) },
        ],
    },
    {
        path: '**',
        redirectTo: '',
        component: Error404Component,
    },
];
