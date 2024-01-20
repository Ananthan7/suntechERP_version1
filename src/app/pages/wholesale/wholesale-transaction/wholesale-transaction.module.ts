import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleTransactionRoutingModule } from './wholesale-transaction.routing';
import { WholesaleTransactionComponent } from './wholesale-transaction.component';
import { JewelleryAssemblingComponent } from './jewellery-assembling/jewellery-assembling.component';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling/jewellery-assembling-details/jewellery-assembling-details.component'
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WholesaleTransactionComponent,
    JewelleryAssemblingComponent,
    JewelleryAssemblingDetailsComponent,
  ],
  imports: [
    CommonModule,
    WholesaleTransactionRoutingModule,
    SharedModule
  ]
})
export class WholesaleTransactionModule { }
