import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterComponent } from './master.component';
import { JobcardComponent } from './jobcard/jobcard.component';
import { WorkerMasterComponent } from './worker-master/worker-master.component';
import { DepartmentMasterComponent } from './department-master/department-master.component';
import { ProcessMasterComponent } from './process-master/process-master.component';
import { SequenceMasterComponent } from './sequence-master/sequence-master.component';
import { LabourChargeMasterComponent } from './labour-charge-master/labour-charge-master.component';
import { StonePricingMasterComponent } from './stone-pricing-master/stone-pricing-master.component';

@NgModule({
  declarations: [
    MasterComponent,
    JobcardComponent,
    WorkerMasterComponent,
    DepartmentMasterComponent,
    ProcessMasterComponent,
    SequenceMasterComponent,
    LabourChargeMasterComponent,
    StonePricingMasterComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA
  // ],
})
export class MasterModule { }
