import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailRoutingModule } from './retail.routing';
import { RetailComponent } from './retail.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RetailComponent,
  ],
  imports: [
    CommonModule,
    RetailRoutingModule,
    SharedModule
  ]
})
export class RetailModule { }
