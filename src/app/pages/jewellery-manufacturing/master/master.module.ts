import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MasterComponent } from './master.component';
import { JobcardComponent } from './jobcard/jobcard.component';

@NgModule({
  declarations: [
    MasterComponent,
    JobcardComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    SharedModule
  ]
})
export class MasterModule { }
