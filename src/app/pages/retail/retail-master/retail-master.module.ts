import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailMasterRoutingModule } from './retail-master.routing';
import { RetailMasterComponent } from './retail-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PosCustomerMasterMainComponent } from './pos-customer-master-main/pos-customer-master-main.component';
import { SchemeMasterComponent } from './scheme-master/scheme-master.component';
import { CommonRetailModule } from '../common-retail/common-retail.module';
import { PosWalkinCustomerComponent } from './pos-walkin-customer/pos-walkin-customer.component';
import { ShowTransDetailsComponent } from './pos-customer-master-main/show-trans-details/show-trans-details.component';
import { PrintCustomerLogComponent } from './pos-customer-master-main/print-customer-log/print-customer-log.component';
import { PrintPrivilegeCardComponent } from './pos-customer-master-main/print-privilege-card/print-privilege-card.component';
import { EmployeeMasterComponent } from '../../jewellery-manufacturing/master/employee-master/employee-master.component';
import { FestivalMasterComponent } from './festival-master/festival-master.component';
import { StoneWeightMasterComponent } from './stone-weight-master/stone-weight-master.component';
import { PosBranchTargetComponent } from './pos-branch-target/pos-branch-target.component';
import { BuyBackPolicyComponent } from './buy-back-policy/buy-back-policy.component';
import { ReversePriceRatioComponent } from './reverse-price-ratio/reverse-price-ratio.component';
import { AllowanceMasterComponent } from './allowance-master/allowance-master.component';
import { DeductionMasterComponent } from './deduction-master/deduction-master.component';
import { FixingCommodityMasterComponent } from './fixing-commodity-master/fixing-commodity-master.component';
import { JewelleryBrandingComponent } from './jewellery-branding/jewellery-branding.component';
import { CertificateMasterComponent } from './certificate-master/certificate-master.component';
import { ZirconMasterComponent } from './zircon-master/zircon-master.component';
import { ManufacturedItemsComponent } from './manufactured-items/manufactured-items.component';
import { SubLedgerMasterComponent } from './sub-ledger-master/sub-ledger-master.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { LoanSalaryAdvanceMasterComponent } from './loan-salary-advance-master/loan-salary-advance-master.component';
import { YearlyBudgetPlannerComponent } from './yearly-budget-planner/yearly-budget-planner.component';
import { TdsMasterComponent } from './tds-master/tds-master.component';
import { SubledgerPrefixMasterComponent } from './subledger-prefix-master/subledger-prefix-master.component';
import { KycMasterComponent } from './kyc-master/kyc-master.component';
import { CurrencyComponent } from './currency/currency.component';
import { BoxMasterComponent } from './box-master/box-master.component';
import { YearlyBudgetPlannerDetailsComponent } from './yearly-budget-planner/yearly-budget-planner-details/yearly-budget-planner-details.component';
import { CostAndPriceTypesComponent } from './cost-and-price-types/cost-and-price-types.component';
import { PriceListMasterComponent } from './price-list-master/price-list-master.component';
import { AdditionalAmountComponent } from './additional-amount/additional-amount.component';
import { CustomerWiseStonePricingAndLabourChargesComponent } from './customer-wise-stone-pricing-and-labour-charges/customer-wise-stone-pricing-and-labour-charges.component';
import { ReceiptModesComponent } from './receipt-modes/receipt-modes.component';
import { DesignMasterComponent } from './design-master/design-master.component';
import { JewelleryMasterComponent } from './jewellery-master/jewellery-master.component';
import { SetRefMasterComponent } from './set-ref-master/set-ref-master.component';
import { ModelMasterComponent } from './model-master/model-master.component';
import { RefiningChargePostingComponent } from './refining-charge-posting/refining-charge-posting.component';
import { PosSalespersonTargetComponent } from './pos-salesperson-target/pos-salesperson-target.component';
import { LoyaltyCardMasterComponent } from './loyalty-card-master/loyalty-card-master.component';
import { LoyaltyProgramSettingsMasterComponent } from './loyalty-program-settings-master/loyalty-program-settings-master.component';
import { GeneralDocumentMasterComponent } from './general-document-master/general-document-master.component';
import { GstMasterComponent } from './gst-master/gst-master.component';
import { VatMasterComponent } from './vat-master/vat-master.component';
import { ReorderLevelSetupComponent } from './reorder-level-setup/reorder-level-setup.component';
import { SalesPersonMasterComponent } from './sales-person-master/sales-person-master.component';
import { GiftVoucherMasterComponent } from './gift-voucher-master/gift-voucher-master.component';
import { ServiceMasterComponent } from './service-master/service-master.component';
import { SetRefMasterRealComponent } from './set-ref-master-real/set-ref-master-real.component';
import { SupplierQuotaAllocationComponent } from './supplier-quota-allocation/supplier-quota-allocation.component';
import { SalesCommissionSetupComponent } from './sales-commission-setup/sales-commission-setup.component';
import { TransactionReferenceMasterComponent } from './transaction-reference-master/transaction-reference-master.component';
import { SequanceMasterComponent } from './sequance-master/sequance-master.component';
import { WpsAgentMasterComponent } from './wps-agent-master/wps-agent-master.component';
import { GratuityMasterComponent } from './gratuity-master/gratuity-master.component';
import { LeaveSalaryMasterComponent } from './leave-salary-master/leave-salary-master.component';
import { AirTicketMasterComponent } from './air-ticket-master/air-ticket-master.component';
import { JobCardComponent } from './job-card/job-card.component';
import { OvertimeMasterComponent } from './overtime-master/overtime-master.component';
import { HolidayMasterComponent } from './holiday-master/holiday-master.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { ClientAuthorizationComponent } from './client-authorization/client-authorization.component';
import { MobileAppUserComponent } from './mobile-app-user/mobile-app-user.component';
import { MobileAppSettingComponent } from './mobile-app-setting/mobile-app-setting.component';
import { FixedAssetsCategoryMasterComponent } from './fixed-assets-category-master/fixed-assets-category-master.component';
import { DocumentPrintSetupComponent } from './document-print-setup/document-print-setup.component';
import { EmailTemplateComponent } from './email-template/email-template.component';


@NgModule({
  declarations: [
    RetailMasterComponent,
    PosCustomerMasterMainComponent,
    SchemeMasterComponent,
    PosWalkinCustomerComponent,
    ShowTransDetailsComponent,
    PrintCustomerLogComponent,
    PrintPrivilegeCardComponent,
    EmployeeMasterComponent,
    BuyBackPolicyComponent,
    FestivalMasterComponent,
    StoneWeightMasterComponent,
    PosBranchTargetComponent,
    ReversePriceRatioComponent,
    AllowanceMasterComponent,
    DeductionMasterComponent,
    FixingCommodityMasterComponent,
    JewelleryBrandingComponent,
    CertificateMasterComponent,
    ZirconMasterComponent,
    ManufacturedItemsComponent,
    JewelleryBrandingComponent,
    CertificateMasterComponent,
    ZirconMasterComponent,
    ManufacturedItemsComponent,
    FixingCommodityMasterComponent,
    SubLedgerMasterComponent,
    DepartmentMasterComponent,
    LoanSalaryAdvanceMasterComponent,
    YearlyBudgetPlannerComponent,
    TdsMasterComponent,
    SubledgerPrefixMasterComponent,
    KycMasterComponent,
    CurrencyComponent,
    BoxMasterComponent,
    YearlyBudgetPlannerDetailsComponent,
    CostAndPriceTypesComponent,
    PriceListMasterComponent,
    AdditionalAmountComponent,
    CustomerWiseStonePricingAndLabourChargesComponent,
    ReceiptModesComponent,
    DesignMasterComponent,
    JewelleryMasterComponent,
    SetRefMasterComponent,
    ModelMasterComponent,
    RefiningChargePostingComponent,
    PosSalespersonTargetComponent,
    LoyaltyCardMasterComponent,
    LoyaltyProgramSettingsMasterComponent,
    GeneralDocumentMasterComponent,
    GstMasterComponent,
    VatMasterComponent,
    ReorderLevelSetupComponent,
    SalesPersonMasterComponent,
    GiftVoucherMasterComponent,
    ServiceMasterComponent,
    SetRefMasterRealComponent,
    SupplierQuotaAllocationComponent,
    SalesCommissionSetupComponent,
    TransactionReferenceMasterComponent,
    SequanceMasterComponent,
    WpsAgentMasterComponent,
    GratuityMasterComponent,
    LeaveSalaryMasterComponent,
    AirTicketMasterComponent,
    JobCardComponent,
    OvertimeMasterComponent,
    HolidayMasterComponent,
    SalesInvoiceComponent,
    ClientAuthorizationComponent,
<<<<<<<<< Temporary merge branch 1
    
=========
    MobileAppUserComponent,
    MobileAppSettingComponent,
    ClientAuthorizationComponent,
    FixedAssetsCategoryMasterComponent,
    DocumentPrintSetupComponent
>>>>>>>>> Temporary merge branch 2
  ],
  imports: [
    CommonModule,
    RetailMasterRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailMasterModule { }
