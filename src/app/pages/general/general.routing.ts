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
    path: 'general-transaction',
    loadChildren: () => import('../general/general-transaction/general-transaction.module').then(m => m.GeneralTransactionModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralRoutingModule { }
