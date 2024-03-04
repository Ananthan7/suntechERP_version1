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
import { CustomDateFormat1, CustomDateFormat2, CustomDateFormat3 } from './pos-currency-receipt/pos-currency-receipt-details/cust-dateformats.component';
import { SchemeRegisterComponent } from './scheme-register/scheme-register.component';
import { TouristVatRefundVerificationComponent } from './tourist-vat-refund-verification/tourist-vat-refund-verification.component';
import { AdvanceReturnComponent } from './advance-return/advance-return.component';
import { PosSalesOrderCancellationComponent } from './pos-sales-order-cancellation/pos-sales-order-cancellation.component';
import { PcrSelectionComponent } from './advance-return/pcr-selection/pcr-selection.component';
import { DxDataGridModule } from 'devextreme-angular';
import { SalesEstimationComponent } from './sales-estimation/sales-estimation.component';
import { PointOfSalesOrderComponent } from './point-of-sales-order/point-of-sales-order.component';
import { PointOfSalesOrderDetailsComponent } from './point-of-sales-order/point-of-sales-order-details/point-of-sales-order-details.component';
import { PosPurchaseDirectComponent } from './pos-purchase-direct/pos-purchase-direct.component';
import { PosPurchaseDirectDetailComponent } from './pos-purchase-direct/pos-purchase-direct-detail/pos-purchase-direct-detail.component';
import { SchemeReceiptComponent } from './scheme-receipt/scheme-receipt.component';
import { AddReceiptComponent } from './scheme-receipt/add-receipt/add-receipt.component';
import { AddSchemeComponent } from './scheme-register/add-scheme/add-scheme.component';
import { CommonRetailModule } from '../common-retail/common-retail.module';
import { OrderLockUnlockComponent } from './order-lock-unlock/order-lock-unlock.component';

import { PosSalesmanTargetAnalysisComponent } from './pos-salesman-target-analysis/pos-salesman-target-analysis.component';
import { GoldExchangeComponent } from './gold-exchange/gold-exchange.component';
import { PosReturnComponent } from './pos-return/pos-return.component';
import { RepairMetalPurchaseComponent } from './repair-metal-purchase/repair-metal-purchase.component';
import { RepairDiamondPurchaseComponent } from './repair-diamond-purchase/repair-diamond-purchase.component';
import { LoyaltyRegisterComponent } from './loyalty-register/loyalty-register.component';
import { PosSalesmanCommissionComponent } from './pos-salesman-commission/pos-salesman-commission.component';
import { PosCreditSaleReciptComponent } from './pos-credit-sale-recipt/pos-credit-sale-recipt.component';
import { RepairJewelleryReceiptComponent } from './repair-jewellery-receipt/repair-jewellery-receipt.component';
import { BranchTransferRepairOutComponent } from './branch-transfer-repair-out/branch-transfer-repair-out.component';
import { RepairIssueToWorkshopComponent } from './repair-issue-to-workshop/repair-issue-to-workshop.component';
import { RepairIssueFromWorkshopComponent } from './repair-issue-from-workshop/repair-issue-from-workshop.component';
import { BranchTransferRepairRtnComponent } from './branch-transfer-repair-rtn/branch-transfer-repair-rtn.component';
import { RepairCustomerDeliveryComponent } from './repair-customer-delivery/repair-customer-delivery.component';
import { PosSalesPaymentComponent } from './point-of-sales-order/pos-sales-payment/pos-sales-payment.component';
import { GoldExchangeDetailsComponent } from './gold-exchange/gold-exchange-details/gold-exchange-details.component';
import { RepairDetailsComponent } from './repair-jewellery-receipt/repair-details/repair-details.component';
import { MetalBranchTransferOutRepairComponent } from './metal-branch-transfer-out-repair/metal-branch-transfer-out-repair.component';
import { MetalBranchTransferInAutoRepairComponent } from './metal-branch-transfer-in-auto-repair/metal-branch-transfer-in-auto-repair.component';
import { DiamondBranchTransferOutRepairComponent } from './diamond-branch-transfer-out-repair/diamond-branch-transfer-out-repair.component';
import { DiamondBranchTransferInAutoRepairComponent } from './diamond-branch-transfer-in-auto-repair/diamond-branch-transfer-in-auto-repair.component';
import { RepairSaleComponent } from './repair-sale/repair-sale.component';
import { DiamondBranchTransferInAutoRepairDetailsComponent } from './diamond-branch-transfer-in-auto-repair/diamond-branch-transfer-in-auto-repair-details/diamond-branch-transfer-in-auto-repair-details.component';
import { MetalBranchTransferOutRepairDetailComponent } from './metal-branch-transfer-out-repair/metal-branch-transfer-out-repair-detail/metal-branch-transfer-out-repair-detail.component';
import { DiamonBranchTransferOutDetailsComponent } from './diamond-branch-transfer-out-repair/diamon-branch-transfer-out-details/diamon-branch-transfer-out-details.component';
import { PosSalesDiaDetailsIGSTComponent } from './pos-credit-sale-recipt/pos-sales-dia-details-i-gst/pos-sales-dia-details-i-gst.component';
import { RepairMetalPurchaseDetailsComponent } from './repair-metal-purchase/repair-metal-purchase-details/repair-metal-purchase-details.component';
import { RepairDiamondPurchaseDetailComponent } from './repair-diamond-purchase/repair-diamond-purchase-detail/repair-diamond-purchase-detail.component';
import { PosSalesDiaDetailsIGSTIndComponent } from './pos-credit-sale-recipt/pos-sales-dia-details-i-gst-ind/pos-sales-dia-details-i-gst-ind.component';
import { PosSalesDiaUnfixDetailsGSTComponent } from './pos-credit-sale-recipt/pos-sales-dia-unfix-details-gst/pos-sales-dia-unfix-details-gst.component';
import { PosReturnSalesDiaDetailsIGSTComponent } from './pos-return/pos-return-sales-dia-details-i-gst/pos-return-sales-dia-details-i-gst.component';
import { PosReturnSalesDiaDetailsIGSTIndComponent } from './pos-return/pos-return-sales-dia-details-i-gst-ind/pos-return-sales-dia-details-i-gst-ind.component';
import { PosReturnSalesDiaUnfixDetailsGSTComponent } from './pos-return/pos-return-sales-dia-unfix-details-gst/pos-return-sales-dia-unfix-details-gst.component';


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
    CustomDateFormat3,
    SalesEstimationComponent,
    PointOfSalesOrderComponent,
    PointOfSalesOrderDetailsComponent,
    PosPurchaseDirectComponent,
    PosPurchaseDirectDetailComponent,
    SchemeReceiptComponent,
    AddReceiptComponent,
    AddSchemeComponent,
    OrderLockUnlockComponent,
    PosSalesmanTargetAnalysisComponent,
    BranchTransferRepairOutComponent,
    BranchTransferRepairRtnComponent,

    LoyaltyRegisterComponent,
    PosSalesmanCommissionComponent,
    GoldExchangeComponent,


    PosReturnComponent,
    RepairMetalPurchaseComponent,
    RepairDiamondPurchaseComponent,
    PosCreditSaleReciptComponent,


    RepairJewelleryReceiptComponent,
    RepairIssueToWorkshopComponent,
    RepairIssueFromWorkshopComponent,
    BranchTransferRepairRtnComponent,
    RepairCustomerDeliveryComponent,
    PosSalesPaymentComponent,
    RepairIssueFromWorkshopComponent,
    RepairCustomerDeliveryComponent, GoldExchangeDetailsComponent,
    RepairIssueFromWorkshopComponent,
    RepairCustomerDeliveryComponent,     
    RepairDetailsComponent, 
    
    MetalBranchTransferOutRepairComponent, 
    MetalBranchTransferInAutoRepairComponent, 
    DiamondBranchTransferOutRepairComponent, 
    DiamondBranchTransferInAutoRepairComponent, 
    RepairSaleComponent, 
    DiamondBranchTransferInAutoRepairDetailsComponent, 
    MetalBranchTransferOutRepairDetailComponent, 
    DiamonBranchTransferOutDetailsComponent, 
    PosSalesDiaDetailsIGSTComponent, 
    PosSalesDiaDetailsIGSTIndComponent, 
    PosSalesDiaUnfixDetailsGSTComponent, 
    PosReturnSalesDiaDetailsIGSTComponent, 
    PosReturnSalesDiaDetailsIGSTIndComponent, 
    PosReturnSalesDiaUnfixDetailsGSTComponent 
    
  ],
  imports: [
    CommonModule,
    RetailTransactionRoutingModule,
    SharedModule,
    CommonRetailModule
  ],


})
export class RetailTransactionModule { }
