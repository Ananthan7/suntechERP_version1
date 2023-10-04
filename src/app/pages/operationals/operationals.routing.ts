import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationalsComponent } from './operationals.component';

const routes: Routes = [
  {
    path: '',
    component: OperationalsComponent
  },
  {
    path: 'validation-splist',
    loadChildren: () => import('../operationals/validation-splist/validation-splist.module').then(m => m.ValidationSplistModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationalsRoutingModule { }
