import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAnalysisSalesOrderRoutingModule } from './product-analysis-sales-order-routing.module';
import { ProductAnalysisSalesOrderComponent } from './product-analysis-sales-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ProductAnalysisSalesOrderComponent],
  imports: [
    ProductAnalysisSalesOrderRoutingModule,
    CommonModule,
    SharedModule,
    MatIconModule
  ]
 
})
export class ProductAnalysisSalesOrderModule { }
