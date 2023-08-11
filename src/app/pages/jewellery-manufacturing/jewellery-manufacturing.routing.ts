import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JewelleryManufacturingComponent } from './jewellery-manufacturing.component';

const routes: Routes = [
  {
    path: '',
    component: JewelleryManufacturingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JewelleryManufacturingRoutingModule { }
