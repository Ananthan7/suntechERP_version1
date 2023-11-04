import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WholesaleMasterComponent } from './wholesale-master.component';

const routes: Routes = [
  {
    path: '',
    component: WholesaleMasterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WholesaleMasterRoutingModule { }
