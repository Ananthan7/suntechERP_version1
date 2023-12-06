import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailTransactionRoutingModule } from './retail-transaction.routing';
import { RetailTransactionComponent } from './retail-transaction.component';
import { SharedModule } from 'src/app/shared/shared.module';
// import { AddCustomerComponent } from './common/add-customer/add-customer.component';
import { AddItemsComponent } from './common/add-items/add-items.component';
import { AddSalesReturnComponent } from './common/add-sales-return/add-sales-return.component';
import { AddExchangeComponent } from './common/add-exchange/add-exchange.component';
import { NewPosEntryComponent } from './new-pos-entry/new-pos-entry.component';
import { AddPaymentComponent } from './common/add-payment/add-payment.component';
import { PrintInvoiceComponent } from './common/print-invoice/print-invoice.component';
import { AddPosComponent } from './add-pos/add-pos.component';
import { PosCurrencyReceiptComponent } from './pos-currency-receipt/pos-currency-receipt.component';
import { PosCurrencyReceiptDetailsComponent, } from './pos-currency-receipt/pos-currency-receipt-details/pos-currency-receipt-details.component';
import { PosCustomerMasterComponent } from './common/pos-customer-master/pos-customer-master.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { CustomDateFormat1, CustomDateFormat2 } from './pos-currency-receipt/pos-currency-receipt-details/cust-dateformats.component';
import { SchemeRegisterComponent } from './scheme-register/scheme-register.component';
import { TouristVatRefundVerificationComponent } from './tourist-vat-refund-verification/tourist-vat-refund-verification.component';
import { AdvanceReturnComponent } from './advance-return/advance-return.component';
  import { PosSalesOrderCancellationComponent } from './pos-sales-order-cancellation/pos-sales-order-cancellation.component';
import { PcrSelectionComponent } from './advance-return/pcr-selection/pcr-selection.component';
import { DxDataGridModule } from 'devextreme-angular';
import { SalesEstimationComponent } from './sales-estimation/sales-estimation.component';
import { PointOfSalesOrderComponent } from './point-of-sales-order/point-of-sales-order.component';



@NgModule({
  declarations: [
    RetailTransactionComponent,
    // AddCustomerComponent,
    PosCustomerMasterComponent,
    AddItemsComponent,
    AddSalesReturnComponent,
    AddExchangeComponent,
    NewPosEntryComponent,
    AddPaymentComponent,
    PrintInvoiceComponent,
    AddPosComponent,
    PosCurrencyReceiptComponent,
    PosCurrencyReceiptDetailsComponent,
    SchemeRegisterComponent,
    TouristVatRefundVerificationComponent,
    AdvanceReturnComponent,
    PosSalesOrderCancellationComponent,
    PcrSelectionComponent,
    CustomDateFormat1,
    CustomDateFormat2,
    SalesEstimationComponent,
    PointOfSalesOrderComponent
  ],
  imports: [
    CommonModule,
    RetailTransactionRoutingModule,
    SharedModule,
  ],


})
export class RetailTransactionModule { }
