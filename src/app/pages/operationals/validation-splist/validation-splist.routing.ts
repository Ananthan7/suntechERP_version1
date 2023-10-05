import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationSplistComponent } from './validation-splist.component';

const routes: Routes = [
  {
    path: '',
    component: ValidationSplistComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationSplistRoutingModule { }
