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
import {MatIconModule} from '@angular/material/icon';

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

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';
import { DatePipe, DecimalPipe } from '@angular/common';


const dbConfig: DBConfig = {
  name: 'suntechPos',
  version: 1,
  objectStoresMeta: [
    {
      store: 'compparams',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'PARAMETER', keypath: 'PARAMETER', options: { unique: false } },
        { name: 'PARAM_VALUE', keypath: 'PARAM_VALUE', options: { unique: false } },
        { name: 'DISPLAY_NAME', keypath: 'DISPLAY_NAME', options: { unique: false } },
        { name: 'DESCRIPTION', keypath: 'DESCRIPTION', options: { unique: false } },
        { name: 'CONTROLTYPE', keypath: 'CONTROLTYPE', options: { unique: false } },
        { name: 'FUNCTIONS', keypath: 'FUNCTIONS', options: { unique: false } },
        { name: 'PARAMGROUP', keypath: 'PARAMGROUP', options: { unique: false } },
        { name: 'SUBGROUP', keypath: 'SUBGROUP', options: { unique: false } },
        { name: 'DIVISION', keypath: 'DIVISION', options: { unique: false } },
        { name: 'DIVISION_CODE', keypath: 'DIVISION_CODE', options: { unique: false } },
      ]
    },

    {
      store: 'branchCurrencyMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'REFMID', keypath: 'REFMID', options: { unique: false } },
        { name: 'CURRENCY_CODE', keypath: 'CURRENCY_CODE', options: { unique: false } },
        { name: 'DESCRIPTION', keypath: 'DESCRIPTION', options: { unique: false } },
        { name: 'CURRENCY_FRACTION', keypath: 'CURRENCY_FRACTION', options: { unique: false } },
        { name: 'CONV_RATE', keypath: 'CONV_RATE', options: { unique: false } },
        { name: 'MUL_DIV', keypath: 'MUL_DIV', options: { unique: false } },
        { name: 'MIN_CONV_RATE', keypath: 'MIN_CONV_RATE', options: { unique: false } },
        { name: 'MAX_CONV_RATE', keypath: 'MAX_CONV_RATE', options: { unique: false } },
        { name: 'SYMBOL', keypath: 'SYMBOL', options: { unique: false } },
        { name: 'SYSTEM_DATE', keypath: 'SYSTEM_DATE', options: { unique: false } },
        { name: 'CMBRANCH_CODE', keypath: 'CMBRANCH_CODE', options: { unique: false } },
      ]
    },
    {
      store: 'messageBox',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'comboFilter',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'countryMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'nationalityMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'idMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'divisionMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'customerTypeMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'RateTypeMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'LocationMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'karatMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'CreditCardMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'SalespersonMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'VocTypeMaster',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },
    {
      store: 'companyParameter',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: []
    },

  ]
};

@NgModule({
  declarations: [
    AppComponent,
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
    MatIconModule,
    ToastrModule.forRoot(),
    DxDataGridModule,
    NgChartsModule.forRoot(),
    FeatherModule.pick(allIcons),
    NgxIndexedDBModule.forRoot(dbConfig),
    
    ],
  providers: [ConfigService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    { provide: NgChartsConfiguration, useValue: { generateColors: false }},
    DecimalPipe,
    DatePipe,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
