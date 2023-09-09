import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JewelleryManufacturingRoutingModule } from './jewellery-manufacturing.routing';
import { JewelleryManufacturingComponent } from './jewellery-manufacturing.component';
import { SharedModule } from 'src/app/shared/shared.module';





@NgModule({
  declarations: [
    JewelleryManufacturingComponent
  ],
  imports: [
    CommonModule,
    JewelleryManufacturingRoutingModule,
    SharedModule,
    
  ]
})
export class JewelleryManufacturingModule { }
