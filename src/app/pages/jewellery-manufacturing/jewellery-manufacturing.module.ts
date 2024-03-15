import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JewelleryManufacturingRoutingModule } from './jewellery-manufacturing.routing';
import { JewelleryManufacturingComponent } from './jewellery-manufacturing.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UtilitiesComponent } from './utilities/utilities.component';
import { JobVerificationComponent } from './favorites/job-verification/job-verification.component';
import { JobWorkAllocationComponent } from './favorites/job-work-allocation/job-work-allocation.component';
import { SalesOrderAmendmentComponent } from './favorites/sales-order-amendment/sales-order-amendment.component';

@NgModule({
  declarations: [
    JewelleryManufacturingComponent,
    UtilitiesComponent,
    JobVerificationComponent,
    JobWorkAllocationComponent,
    SalesOrderAmendmentComponent
  ],
  imports: [
    CommonModule,
    JewelleryManufacturingRoutingModule,
    SharedModule,
    
  ]
})
export class JewelleryManufacturingModule { }
