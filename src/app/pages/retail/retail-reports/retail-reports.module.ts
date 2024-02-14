import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailReportsRoutingModule } from './retail-reports.routing';
import { RetailReportsComponent } from './retail-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PosDailyClosingSummaryComponent } from './pos-daily-closing-summary/pos-daily-closing-summary.component';
import { RetailAdvanceReceiptRegisterComponent } from './retail-advance-receipt-register/retail-advance-receipt-register.component';
import { PosSalesmanDetailsComponent } from './pos-daily-closing-summary/pos-salesman-details/pos-salesman-details.component';
import { PosCustomerFeedbackFollowupComponent } from '../retail-reports/pos-customer-feedback-followup/pos-customer-feedback-followup.component';
import { PosCustomerFeedbackActionComponent } from '../retail-reports/pos-customer-feedback-action/pos-customer-feedback-action.component';
import { RetailSalesKaratWiseProfitComponent } from './retail-sales-karat-wise-profit/retail-sales-karat-wise-profit.component';


@NgModule({
  declarations: [
    RetailReportsComponent,
    PosDailyClosingSummaryComponent,
    RetailAdvanceReceiptRegisterComponent,
    PosSalesmanDetailsComponent,
    PosCustomerFeedbackFollowupComponent,
    PosCustomerFeedbackActionComponent,
    RetailSalesKaratWiseProfitComponent
  ],
  imports: [
    CommonModule,
    RetailReportsRoutingModule,
    SharedModule
  ]
})
export class RetailReportsModule { }
