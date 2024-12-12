import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AnalyticsComponent } from './analytics';
import { FinanceComponent } from './finance';
import { CryptoComponent } from './crypto';

import { WidgetsComponent } from './widgets';
import { TablesComponent } from './tables';
import { FontIconsComponent } from './font-icons';
import { ChartsComponent } from './charts';
import { DragndropComponent } from './dragndrop';
import { AppLayout } from './shared/layouts/app-layout';
import { AuthLayout } from './shared/layouts/auth-layout';
import { KnowledgeBaseComponent } from './pages/knowledge-base';
import { FaqComponent } from './pages/faq';
import { AuthGuardService } from './service/authGuard.service';
import { Error404Component } from './pages/error404';

export const routes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuardService],
        children: [
            // dashboard
            { path: '', component: IndexComponent, title: 'Sales Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'analytics', component: AnalyticsComponent, title: 'Analytics Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'finance', component: FinanceComponent, title: 'Finance Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'crypto', component: CryptoComponent, title: 'Crypto Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },

            //apps
            { path: '', loadChildren: () => import('./apps/apps.module').then((d) => d.AppsModule) },

            // widgets
            { path: 'widgets', component: WidgetsComponent, title: 'Widgets | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // components
            { path: '', loadChildren: () => import('./shared/components/components.module').then((d) => d.ComponentsModule) },

            // elements
            { path: '', loadChildren: () => import('./shared/elements/elements.module').then((d) => d.ElementsModule) },

            // forms
            { path: '', loadChildren: () => import('./shared/forms/form.module').then((d) => d.FormModule) },

            // users
            { path: '', loadChildren: () => import('./pages/users/user.module').then((d) => d.UsersModule) },

            // tables
            { path: 'tables', component: TablesComponent, title: 'Tables | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: '', loadChildren: () => import('./shared/datatables/datatables.module').then((d) => d.DatatablesModule) },

            // font-icons
            { path: 'font-icons', component: FontIconsComponent, title: 'Font Icons | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // charts
            { path: 'charts', component: ChartsComponent, title: 'Charts | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // dragndrop
            { path: 'dragndrop', component: DragndropComponent, title: 'Dragndrop | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // pages
            { path: 'pages/knowledge-base', component: KnowledgeBaseComponent, title: 'Knowledge Base | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'pages/faq', component: FaqComponent, title: 'FAQ | VRISTO - Multipurpose Tailwind Dashboard Template' },
        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },

            // auth
            { path: '', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },
        ],
    },
    {
        path: '**',
        redirectTo: '',
        component: Error404Component,
    },
];
