import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperationalsComponent } from './operationals.component';
import { ProductAnalysisSalesOrderModule } from '../operationals/product-analysis-sales-order/product-analysis-sales-order.module';
import { MessageBoxModule } from '../operationals/message-box/message-box.module';

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
    path: 'grid-settings',
    loadChildren: () => import('../operationals/grid-settings/grid-settings.module').then(m => m.GridSettingsModule)
  },
  {
    path: 'product-analysis-sales-order',
    loadChildren: ()=> import('../operationals/product-analysis-sales-order/product-analysis-sales-order.module').then(m => ProductAnalysisSalesOrderModule )
  },
  {
    path: 'messagebox',
    loadChildren: ()=> import('../operationals/message-box/message-box.module').then(m => MessageBoxModule )
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationalsRoutingModule { }
