import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// let user:string = JSON.parse(localStorage.getItem('currentUser')) ;
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
  {
    path: 'operationals',
    loadChildren: () => import('../pages/operationals/operationals.module').then(m => m.OperationalsModule)
  },
  {
    path: 'jewellery-manufacturing',
    loadChildren: () => import('../pages/jewellery-manufacturing/jewellery-manufacturing.module').then(m => m.JewelleryManufacturingModule)
  },
  {
    path: 'general',
    loadChildren: () => import('../pages/general/general.module').then(m => m.GeneralModule)
  },
  {
    path: 'retail',
    loadChildren: () => import('../pages/retail/retail.module').then(m => m.RetailModule)
  },
  
  /**Add here new modules from modulelist */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
