import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralReportsRoutingModule } from './general-report.routing';
import { RetailKaratRateLogComponent } from './retail-karat-rate-log/retail-karat-rate-log.component';



@NgModule({
  declarations: [
    RetailKaratRateLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GeneralReportsRoutingModule
  ]
})
export class GeneralReportsModule { }
