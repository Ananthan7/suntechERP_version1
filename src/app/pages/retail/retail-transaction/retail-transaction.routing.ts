import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailTransactionComponent } from './retail-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: RetailTransactionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailTransactionRoutingModule { }
