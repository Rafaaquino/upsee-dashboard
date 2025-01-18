import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// icon
import { IconModule } from 'src/app/shared/icon/icon.module';

import { Error404Component } from '../shared/errors/error404';
import { Error500Component } from '../shared/errors/error500';
import { Error503Component } from '../shared/errors/error503';
import { MaintenenceComponent } from '../shared/errors/maintenence';

// headlessui
import { MenuModule } from 'headlessui-angular';

const routes: Routes = [
    { path: 'pages/error404', component: Error404Component, title: 'Error 404 | VRISTO - Multipurpose Tailwind Dashboard Template' },
    { path: 'pages/error500', component: Error500Component, title: 'Error 500 | VRISTO - Multipurpose Tailwind Dashboard Template' },
    { path: 'pages/error503', component: Error503Component, title: 'Error 503 | VRISTO - Multipurpose Tailwind Dashboard Template' },
    { path: 'pages/maintenence', component: MaintenenceComponent, title: 'Maintenence | VRISTO - Multipurpose Tailwind Dashboard Template' },
];
@NgModule({
    imports: [RouterModule.forChild(routes), CommonModule, MenuModule, IconModule],
    declarations: [Error404Component, Error500Component, Error503Component, MaintenenceComponent],
})
export class PagesModule {}
