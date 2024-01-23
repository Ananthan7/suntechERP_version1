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
  {
    path: 'menu-updation',
    loadChildren: () => import('../operationals/menu-updation/menu-updation.module').then(m => m.MenuUpdationModule)
  },
  {
    path: 'menu-updation',
    loadChildren: () => import('../operationals/grid-settings/grid-settings.module').then(m => m.GridSettingsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationalsRoutingModule { }
