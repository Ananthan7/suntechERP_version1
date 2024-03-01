import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailUtilitiesComponent } from './retail-utilities.component';

const routes: Routes = [
  {
    path: '',
    component: RetailUtilitiesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailUtilitiesRoutingModule { }
