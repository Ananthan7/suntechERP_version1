import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleTransactionRoutingModule } from './wholesale-transaction.routing';
import { WholesaleTransactionComponent } from './wholesale-transaction.component';
import { JewelleryAssemblingComponent } from './jewellery-assembling/jewellery-assembling.component';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling/jewellery-assembling-details/jewellery-assembling-details.component'
import { SharedModule } from 'src/app/shared/shared.module';
import { JewelleryAssemblingMetalsDetailsComponent } from './jewellery-assembling/jewellery-assembling-metals-details/jewellery-assembling-metals-details.component';
import { JewelleryAssemblingStonesDetailsComponent } from './jewellery-assembling/jewellery-assembling-stones-details/jewellery-assembling-stones-details.component';
import { JewelleryAssemblingMetalDetailsComponent } from './jewellery-assembling/jewellery-assembling-metal-details/jewellery-assembling-metal-details.component';


@NgModule({
  declarations: [
    WholesaleTransactionComponent,
    JewelleryAssemblingComponent,
    JewelleryAssemblingDetailsComponent,
    JewelleryAssemblingMetalsDetailsComponent,
    JewelleryAssemblingStonesDetailsComponent,
    JewelleryAssemblingMetalDetailsComponent
  ],
  imports: [
    CommonModule,
    WholesaleTransactionRoutingModule,
    SharedModule
  ]
})
export class WholesaleTransactionModule { }
