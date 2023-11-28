import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailReportsComponent } from './retail-reports.component';

const routes: Routes = [
  {
    path: '',
    component: RetailReportsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailReportsRoutingModule { }
