import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailRoutingModule } from './retail.routing';
import { RetailComponent } from './retail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonRetailModule } from './common-retail/common-retail.module';


@NgModule({
  declarations: [
    RetailComponent,
  ],
  imports: [
    CommonModule,
    RetailRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailModule { }
