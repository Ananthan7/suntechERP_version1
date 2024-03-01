import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralTransactionComponent } from './general-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralTransactionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralTransactionRoutingModule { }
