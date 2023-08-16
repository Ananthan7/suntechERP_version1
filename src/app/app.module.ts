import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { initFirebaseBackend } from './authUtils';
import { environment } from 'src/environments/environment';

import { PagesModule } from './pages/pages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { ExtrapagesModule } from './extrapages/extrapages.module';

import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

// if (environment.defaultauth === 'firebase') {
//   initFirebaseBackend(environment.firebaseConfig);
// } else {
//   FakeBackendInterceptor;
// }

import { EmailEditorModule } from 'angular-email-editor';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DxDataGridModule } from 'devextreme-angular';

import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ConfigService } from './services/config.service';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    LayoutsModule,
    NgbModule,
    HttpClientModule,
    ExtrapagesModule,
    EmailEditorModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    DxDataGridModule,
    NgChartsModule.forRoot(),
    FeatherModule.pick(allIcons),
    
    ],
  providers: [ConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
