import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationalsRoutingModule } from './operationals.routing';
import { OperationalsComponent } from './operationals.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    OperationalsComponent
  ],
  imports: [
    CommonModule,
    OperationalsRoutingModule,
    SharedModule
  ]
})
export class OperationalsModule { }
