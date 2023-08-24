import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailTransactionRoutingModule } from './retail-transaction.routing';
import { RetailTransactionComponent } from './retail-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddCustomerComponent } from './common/add-customer/add-customer.component';
import { AddItemsComponent } from './common/add-items/add-items.component';
import { AddSalesReturnComponent } from './common/add-sales-return/add-sales-return.component';
import { AddExchangeComponent } from './common/add-exchange/add-exchange.component';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';
import { AddPaymentComponent } from './common/add-payment/add-payment.component';



@NgModule({
  declarations: [
    RetailTransactionComponent,
    AddCustomerComponent,
    AddItemsComponent,
    AddSalesReturnComponent,
    AddExchangeComponent,
    NewPosEntryComponent,
    AddPaymentComponent,
  ],
  imports: [
    CommonModule,
    RetailTransactionRoutingModule,
    SharedModule,
  ]
  
})
export class RetailTransactionModule { }
