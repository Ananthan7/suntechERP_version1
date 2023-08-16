import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailMasterComponent } from './retail-master.component';

const routes: Routes = [
  {
    path: '',
    component: RetailMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailMasterRoutingModule { }
