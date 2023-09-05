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
import { AlloyMasterComponent } from './alloy-master/alloy-master.component';
import { MeltingTypeComponent } from './melting-type/melting-type.component';
import { ApprovalMasterComponent } from './approval-master/approval-master.component';
import { PictureTypeMasterComponent } from './picture-type-master/picture-type-master.component';

@NgModule({
  declarations: [
    MasterComponent,
    JobcardComponent,
    WorkerMasterComponent,
    DepartmentMasterComponent,
    ProcessMasterComponent,
    SequenceMasterComponent,
    LabourChargeMasterComponent,
    StonePricingMasterComponent,
    AlloyMasterComponent,
    MeltingTypeComponent,
    ApprovalMasterComponent,
    PictureTypeMasterComponent
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
