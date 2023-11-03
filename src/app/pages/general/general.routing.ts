import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'general-master-grid',
    loadChildren: () => import('../general/master/master.module').then(m => m.MasterModule)
  },
  // {
  //   path: 'general-transaction-grid',
  //   loadChildren: () => import('../general/transaction/transaction.module').then(m => m.TransactionModule)
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
