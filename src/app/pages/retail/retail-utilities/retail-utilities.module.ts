import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailUtilitiesRoutingModule } from './retail-utilities.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { RetailUtilitiesComponent } from './retail-utilities.component';
import { CommonRetailModule } from '../common-retail/common-retail.module';
import { PosCreditcardPostingComponent } from './pos-creditcard-posting/pos-creditcard-posting.component';


@NgModule({
  declarations: [
    RetailUtilitiesComponent,
    PosCreditcardPostingComponent
  ],
  imports: [
    CommonModule,
    RetailUtilitiesRoutingModule,
    SharedModule,
    CommonRetailModule
  ]
})
export class RetailUtilitiesModule { }
