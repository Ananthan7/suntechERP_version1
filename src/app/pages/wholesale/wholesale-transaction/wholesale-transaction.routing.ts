import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WholesaleTransactionComponent } from './wholesale-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: WholesaleTransactionComponent
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WholesaleTransactionRoutingModule { }
