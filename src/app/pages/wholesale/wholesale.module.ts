import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleRoutingModule } from './wholesale.routing';
import { WholesaleComponent } from './wholesale.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WholesaleComponent,
  ],
  imports: [
    CommonModule,
    WholesaleRoutingModule,
    SharedModule
  ]
})
export class WholesaleModule { }
