import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app.route';
import { AppComponent } from './app.component';
import { AppService } from './service/app.service';
import { StoreModule } from '@ngrx/store';
import { indexReducer } from './store/index.reducer';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { MenuModule } from 'headlessui-angular';
import { ModalModule } from 'angular-custom-modal';
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';
import { QuillModule } from 'ngx-quill';
import { IndexComponent } from './index';
import { AnalyticsComponent } from './analytics';
import { FinanceComponent } from './finance';
import { CryptoComponent } from './crypto';
import { WidgetsComponent } from './widgets';
import { TablesComponent } from './tables';
import { FontIconsComponent } from './font-icons';
import { ChartsComponent } from './charts';
import { DragndropComponent } from './dragndrop';
import { KnowledgeBaseComponent } from './pages/knowledge-base';
import { FaqComponent } from './pages/faq';
import { AppLayout } from './shared/layouts/app-layout';
import { AuthLayout } from './shared/layouts/auth-layout';

import { HeaderComponent } from './shared/layouts/header';
import { FooterComponent } from './shared/layouts/footer';
import { SidebarComponent } from './shared/layouts/sidebar';
import { ThemeCustomizerComponent } from './shared/layouts/theme-customizer';
import { IconModule } from './shared/icon/icon.module';
import { AuthModule } from './auth/auth.module';
import { SigninComponent } from './auth/components/singnin/signin.component';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
        BrowserModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient],
            },
        }),
        MenuModule,
        StoreModule.forRoot({ index: indexReducer }),
        NgxTippyModule,
        NgApexchartsModule,
        NgScrollbarModule.withConfig({
            visibility: 'hover',
            appearance: 'standard',
        }),
        HighlightModule,
        SortablejsModule,
        ModalModule,
        QuillModule.forRoot(),
        IconModule,
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        SigninComponent,
        ThemeCustomizerComponent,
        TablesComponent,
        FontIconsComponent,
        ChartsComponent,
        IndexComponent,
        AnalyticsComponent,
        FinanceComponent,
        CryptoComponent,
        WidgetsComponent,
        DragndropComponent,
        AppLayout,
        AuthLayout,
        KnowledgeBaseComponent,
        FaqComponent,
    ],

    providers: [
        AppService,
        Title,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    json: () => import('highlight.js/lib/languages/json'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
