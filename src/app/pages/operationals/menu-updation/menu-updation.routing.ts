import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuUpdationComponent } from './menu-updation.component';

const routes: Routes = [
  {
    path: '',
    component: MenuUpdationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuUpdationRoutingModule { }
