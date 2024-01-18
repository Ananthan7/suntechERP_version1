import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WholesaleComponent } from './wholesale.component';

const routes: Routes = [
  {
    path: '',
    component: WholesaleComponent
  },
  {
    path: 'wholesale-master-grid',
    loadChildren: () => import('../wholesale/wholesale-master/wholesale-master.module').then(m => m.WholesaleMasterModule)
  },
  {
    path: 'wholesale-transaction-grid',
    loadChildren: () => import('../wholesale/wholesale-transaction/wholesale-transaction.module').then(m => m.WholesaleTransactionModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WholesaleRoutingModule { }
