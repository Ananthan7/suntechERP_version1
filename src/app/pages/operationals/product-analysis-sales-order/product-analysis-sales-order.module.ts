import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAnalysisSalesOrderRoutingModule } from './product-analysis-sales-order-routing.module';
import { ProductAnalysisSalesOrderComponent } from './product-analysis-sales-order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { ProductAnalysisAdvanceFilterComponent } from './product-analysis-advance-filter/product-analysis-advance-filter.component';

@NgModule({
  declarations: [ProductAnalysisSalesOrderComponent,  ProductAnalysisAdvanceFilterComponent],
  imports: [
    ProductAnalysisSalesOrderRoutingModule,
    CommonModule,
    SharedModule,
    MatIconModule
  ]
 
})
export class ProductAnalysisSalesOrderModule { }
