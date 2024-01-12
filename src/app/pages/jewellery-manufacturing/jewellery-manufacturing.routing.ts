import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JewelleryManufacturingComponent } from './jewellery-manufacturing.component';

const routes: Routes = [
  {
    path: '',
    component: JewelleryManufacturingComponent
  },
  {
    path: 'jewellery-manufacturing-master-grid',
    loadChildren: () => import('../jewellery-manufacturing/master/master.module').then(m => m.MasterModule)
  },
  {
    path: 'jewellery-manufacturing-transaction-grid',
    loadChildren: () => import('../jewellery-manufacturing/transaction/transaction.module').then(m => m.TransactionModule)
  },
  {
    path: 'jewellery-manufacturing-utilities-grid',
    loadChildren: () => import('../jewellery-manufacturing/utilities/utilities.module').then(m => m.UtilitiesModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JewelleryManufacturingRoutingModule { }
