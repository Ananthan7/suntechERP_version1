import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

let user = localStorage.getItem('username');
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'modules'
    // redirectTo: user == 'ADMIN' ? 'AdminDashboard' : 'overview'
  },
  {
    path: 'modules',
    loadChildren: () => import('../pages/modulelist/modulelist.module').then(m => m.ModulelistModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
