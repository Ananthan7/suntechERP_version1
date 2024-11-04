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
import { FestivalMasterComponent } from './festival-master/festival-master.component';
import { StoneWeightMasterComponent } from './stone-weight-master/stone-weight-master.component';
import { PosBranchTargetComponent } from './pos-branch-target/pos-branch-target.component';
import { BuyBackPolicyComponent } from './buy-back-policy/buy-back-policy.component';


@NgModule({
  declarations: [
    RetailMasterComponent,
    PosCustomerMasterMainComponent,
    SchemeMasterComponent,
    PosWalkinCustomerComponent,
    ShowTransDetailsComponent,
    PrintCustomerLogComponent,
    PrintPrivilegeCardComponent,
    BuyBackPolicyComponent,
    FestivalMasterComponent,
    StoneWeightMasterComponent,
    PosBranchTargetComponent
  ],
  imports: [
    CommonModule,
    RetailMasterRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailMasterModule { }
