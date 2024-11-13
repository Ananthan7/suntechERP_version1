import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralComponent } from './general.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent
  },
  {
    path: 'general-master-grid',
    loadChildren: () => import('../general/general-master/general-master.module').then(m => m.GeneralMasterModule)
  },
  {
    path: 'general-reports',
    loadChildren: () => import('../general/general-reports/general-reports.module').then(m => m.GeneralReportsModule)
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
