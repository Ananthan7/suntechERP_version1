import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailComponent } from './retail.component';

const routes: Routes = [
  {
    path: '',
    component: RetailComponent
  },
  {
    path: 'retail-master',
    loadChildren: () => import('../retail/retail-master/retail-master.module').then(m => m.RetailMasterModule)
  },
  {
    path: 'retail-transaction',
    loadChildren: () => import('../retail/retail-transaction/retail-transaction.module').then(m => m.RetailTransactionModule)
  },
  {
    path: 'retail-reports',
    loadChildren: () => import('../retail/retail-reports/retail-reports.module').then(m => m.RetailReportsModule)
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailRoutingModule { }
