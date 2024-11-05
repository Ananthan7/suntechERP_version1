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
    FixingCommodityMasterComponent
  ],
  imports: [
    CommonModule,
    RetailMasterRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailMasterModule { }
