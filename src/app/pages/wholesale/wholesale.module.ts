import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleRoutingModule } from './wholesale.routing';
import { WholesaleComponent } from './wholesale.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { WholesaleMasterModule } from './wholesale-master/wholesale-master.module';



@NgModule({
  declarations: [
    WholesaleComponent,
    
  ],
  imports: [
    CommonModule,
    WholesaleRoutingModule,
    WholesaleMasterModule,    
    SharedModule
  ]
})
export class WholesaleModule { }
