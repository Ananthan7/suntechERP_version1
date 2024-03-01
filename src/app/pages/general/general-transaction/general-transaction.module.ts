import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralTransactionRoutingModule } from './general-transaction.routing';
import { GeneralTransactionComponent } from './general-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';


@NgModule({
  declarations: [
    GeneralTransactionComponent,
    JournalVoucherComponent
  ],
  imports: [
    CommonModule,
    GeneralTransactionRoutingModule,
    SharedModule
  ]
})
export class GeneralTransactionModule { }
