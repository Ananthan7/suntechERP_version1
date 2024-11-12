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
import { PosCrmDashboardComponent } from './pos-crm-dashboard/pos-crm-dashboard.component';
import { FestivalSalesComparisonComponent } from './festival-sales-comparison/festival-sales-comparison.component';
import { PosTargetDashboardComponent } from './pos-target-dashboard/pos-target-dashboard.component';
import { PosDailyClosingBranchComponent } from './pos-daily-closing-summary/pos-daily-closing-branch/pos-daily-closing-branch.component';
import { RepairEnquiryComponent } from './repair-enquiry/repair-enquiry.component';
import { RepairRegisterComponent } from './repair-register/repair-register.component';
import { LoyaltyRegisterComponent } from './loyalty-register/loyalty-register.component';
import { PosSalesmanCommissionComponent } from './pos-salesman-commission/pos-salesman-commission.component';
import { RetailSalesCollectionComponent } from './retail-sales-collection/retail-sales-collection.component';
import { RetailGridComponent } from '../common-retail/retail-grid/retail-grid.component';
import { CommonRetailModule } from '../common-retail/common-retail.module';
import { SalesOrderRegisterComponent } from './sales-order-register/sales-order-register.component';
import { PosDailyClosingReportComponent } from './pos-daily-closing-report/pos-daily-closing-report.component';
import { POSDaybookComponent } from './posdaybook/posdaybook.component';
import { CustomerEnquiryComponent } from './customer-enquiry/customer-enquiry.component';
import { CreditSaleReportComponent } from './credit-sale-report/credit-sale-report.component';
import { DailyClosingSummaryWatchComponent } from './daily-closing-summary-watch/daily-closing-summary-watch.component';
import { PointSalesSMJComponent } from './point-sales-smj/point-sales-smj.component';
import { POSSales_Stock_ComparisonComponent } from './pos-sales-stock-comparison/pos-sales-stock-comparison.component';
import { TimeWiseSalesAnalysisComponent } from './time-wise-sales-analysis/time-wise-sales-analysis.component';
import { SalesmanWiseProfitAnalysisComponent } from './salesman-wise-profit-analysis/salesman-wise-profit-analysis.component';
import { POSSummaryComponent } from './possummary/possummary.component';
import { DailyRetailSalesHistoryComponent } from './daily-retail-sales-history/daily-retail-sales-history.component';


@NgModule({
  declarations: [
    RetailReportsComponent,
    PosDailyClosingSummaryComponent,
    RetailAdvanceReceiptRegisterComponent,
    PosSalesmanDetailsComponent,
    PosCustomerFeedbackFollowupComponent,
    PosCustomerFeedbackActionComponent,
    RetailSalesKaratWiseProfitComponent,
    PosCrmDashboardComponent,
    FestivalSalesComparisonComponent,
    PosTargetDashboardComponent,
    PosDailyClosingBranchComponent,
    RepairEnquiryComponent,
    RepairRegisterComponent,
    LoyaltyRegisterComponent,
    PosSalesmanCommissionComponent,
    RetailSalesCollectionComponent,
    SalesOrderRegisterComponent,
    PosDailyClosingReportComponent,
    POSDaybookComponent,
    CustomerEnquiryComponent,
    CreditSaleReportComponent,
    DailyClosingSummaryWatchComponent,
    PointSalesSMJComponent,
    POSSales_Stock_ComparisonComponent,
    TimeWiseSalesAnalysisComponent,
    SalesmanWiseProfitAnalysisComponent,
    POSSummaryComponent,
    DailyRetailSalesHistoryComponent
  ],
  imports: [
    CommonModule,
    RetailReportsRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailReportsModule { }
