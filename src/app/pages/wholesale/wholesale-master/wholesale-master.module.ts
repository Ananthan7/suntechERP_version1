import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WholesaleMasterRoutingModule } from './wholesale-master.routing';
import { WholesaleMasterComponent } from './wholesale-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CostCentreMetalComponent } from './cost-centre-metal/cost-centre-metal.component';
import { CostcentreMagkingchargesComponent } from './costcentre-magkingcharges/costcentre-magkingcharges.component';


@NgModule({
  declarations: [
    WholesaleMasterComponent,
    CostCentreMetalComponent,
    CostcentreMagkingchargesComponent
  ],
  imports: [
    CommonModule,
    WholesaleMasterRoutingModule,
    SharedModule
  ]
})
export class WholesaleMasterModule { }
