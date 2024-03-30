import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetailTransactionComponent } from './retail-transaction.component';
import { PreciousStonePurchaseComponent } from './precious-stone-purchase/precious-stone-purchase.component';
import { RepairPurchaseComponent } from './repair-purchase/repair-purchase.component';
import { PosReturnComponent } from './pos-return/pos-return.component';
import { RetailRepairMenuComponent } from './retail-repair-menu/retail-repair-menu.component';
import { RepairSaleComponent } from './repair-sale/repair-sale.component';

const routes: Routes = [
  {
    path: '',
    component: RetailTransactionComponent
  },
  {
    path: 'Precious-stone-purchaseComponent',
     component: PreciousStonePurchaseComponent,
   
  },
  {
    path: 'Repair-Purchase-Component',
     component: RepairPurchaseComponent,
   
  },
  {
    path: 'Pos-Return-Component',
     component: PosReturnComponent,
   
  },
  {
    path: 'retail-repair-menu',
     component: RetailRepairMenuComponent,
   
  },
  {
    path: 'Repair-sale',
     component: RepairSaleComponent,
   
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RetailTransactionRoutingModule { }
