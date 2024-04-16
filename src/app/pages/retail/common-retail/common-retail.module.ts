import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { RetailGridComponent } from './retail-grid/retail-grid.component';
import { ReceiptDetailComponent } from './receipt-detail/receipt-detail.component';



@NgModule({
  declarations: [
    RetailGridComponent,
    ReceiptDetailComponent
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    SharedModule
  ],
  exports: [
    RetailGridComponent,
    ReceiptDetailComponent
  ]
})
export class CommonRetailModule { }
