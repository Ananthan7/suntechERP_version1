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
    loadChildren: () => import('../wholesale/master/master.module').then(m => m.MasterModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WholesaleRoutingModule { }
