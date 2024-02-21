import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductAnalysisSalesOrderComponent } from './product-analysis-sales-order.component';

const routes: Routes = [
  {
    path: '',
    component: ProductAnalysisSalesOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAnalysisSalesOrderRoutingModule { }
