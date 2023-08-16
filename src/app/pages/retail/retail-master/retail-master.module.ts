import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RetailMasterRoutingModule } from './retail-master.routing';
import { RetailMasterComponent } from './retail-master.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RetailMasterComponent
  ],
  imports: [
    CommonModule,
    RetailMasterRoutingModule,
    SharedModule
  ]
})
export class RetailMasterModule { }
