import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterComponent } from './master.component';
import { JobcardComponent } from './jobcard/jobcard.component';
import { WorkerMasterComponent } from './worker-master/worker-master.component';

@NgModule({
  declarations: [
    MasterComponent,
    JobcardComponent,
    WorkerMasterComponent
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
