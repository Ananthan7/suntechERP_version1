import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidationSplistRoutingModule } from './validation-splist.routing';
import { ValidationSplistComponent } from './validation-splist.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ValidationSplistComponent
  ],
  imports: [
    CommonModule,
    ValidationSplistRoutingModule,
    SharedModule
  ]
})
export class ValidationSplistModule { }
