import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilitiesRoutingModule } from './utilities.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProcessTransferAuthorisationComponent } from './process-transfer-authorisation/process-transfer-authorisation.component';


@NgModule({
  declarations: [
    ProcessTransferAuthorisationComponent
  ],
  imports: [
    CommonModule,
    UtilitiesRoutingModule,
    SharedModule,
  ]
})
export class UtilitiesModule { }
