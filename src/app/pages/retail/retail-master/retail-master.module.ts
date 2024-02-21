import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailMasterRoutingModule } from './retail-master.routing';
import { RetailMasterComponent } from './retail-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PosCustomerMasterMainComponent } from './pos-customer-master-main/pos-customer-master-main.component';
import { SchemeMasterComponent } from './scheme-master/scheme-master.component';
import { CommonRetailModule } from '../common-retail/common-retail.module';
import { PosWalkinCustomerComponent } from './pos-walkin-customer/pos-walkin-customer.component';


@NgModule({
  declarations: [
    RetailMasterComponent,
    PosCustomerMasterMainComponent,
    SchemeMasterComponent,
    PosWalkinCustomerComponent
  ],
  imports: [
    CommonModule,
    RetailMasterRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailMasterModule { }
