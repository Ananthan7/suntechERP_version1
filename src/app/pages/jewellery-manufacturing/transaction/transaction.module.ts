import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction.routing';
import { TransactionComponent } from './transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiamondSalesorderComponent } from './diamond-salesorder/diamond-salesorder.component';


@NgModule({
  declarations: [
    TransactionComponent,
    DiamondSalesorderComponent
  ],
  imports: [
    CommonModule,
    TransactionRoutingModule,
    SharedModule
  ]
})
export class TransactionModule { }
