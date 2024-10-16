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
import { DesignMasterComponent } from './design-master/design-master.component';
import { OtpMasterComponent } from './otp-master/otp-master.component';
import { CustomerPriceMasterComponent } from './customer-price-master/customer-price-master.component';
import { ComponentsComponent } from './jobcard/components/components.component';
import { TransactionDetailsComponent } from './jobcard/transaction-details/transaction-details.component';
import { JobStickerPrintComponent } from './jobcard/job-sticker-print/job-sticker-print.component';
import { ComponentMasterComponent } from './component-master/component-master.component';
import { StoneCostUpdationComponent } from './stone-cost-updation/stone-cost-updation.component';
import { DesignSequenceComponent } from './design-master/design-sequence/design-sequence.component';
import { LabourChargesDetailsComponent } from './design-master/labour-charges-details/labour-charges-details.component';
import { DesignTransactionComponent } from './design-master/design-transaction/design-transaction.component';
import { CommonMfgModule } from '../common-mfg/common-mfg.module';
import { MetalLabourchargeMasterComponent } from './metal-labourcharge-master/metal-labourcharge-master.component';

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
    PictureTypeMasterComponent,
    DesignMasterComponent,
    OtpMasterComponent,
    CustomerPriceMasterComponent,
    ComponentsComponent,
    TransactionDetailsComponent,
    JobStickerPrintComponent,
    ComponentMasterComponent,
    StoneCostUpdationComponent,
    DesignSequenceComponent,
    LabourChargesDetailsComponent,
    DesignTransactionComponent,
    MetalLabourchargeMasterComponent,
    
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule,
    CommonMfgModule
  ],
  // schemas: [
  //   CUSTOM_ELEMENTS_SCHEMA
  // ],
})
export class MasterModule { }
