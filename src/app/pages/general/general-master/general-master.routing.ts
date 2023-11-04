import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralMasterComponent } from './general-master.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralMasterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralMasterRoutingModule { }
