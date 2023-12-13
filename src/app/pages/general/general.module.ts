import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralRoutingModule } from './general.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralComponent } from './general.component';

@NgModule({
  declarations: [
    GeneralComponent,
  ],
  imports: [
    CommonModule,
    GeneralRoutingModule,
    SharedModule,
  ]
})
export class GeneralModule { }
