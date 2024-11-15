import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from './general.component';
import { GeneralReportsComponent } from './general-reports/general-reports.component';

@NgModule({
  declarations: [
    GeneralComponent,
    GeneralReportsComponent,
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    SharedModule,
  ]
})
export class GeneralModule { }
