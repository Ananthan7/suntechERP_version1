import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailReportsRoutingModule } from './retail-reports.routing';
import { RetailReportsComponent } from './retail-reports.component';
import { PosDailyclosingSummaryComponent } from './pos-dailyclosing-summary/pos-dailyclosing-summary.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RetailReportsComponent,
    PosDailyclosingSummaryComponent
  ],
  imports: [
    CommonModule,
    RetailReportsRoutingModule,
    SharedModule
  ]
})
export class RetailReportsModule { }
