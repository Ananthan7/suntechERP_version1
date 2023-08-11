import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulelistRoutingModule } from './modulelist.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModulelistComponent } from './modulelist.component';


@NgModule({
  declarations: [
    ModulelistComponent
  ],
  imports: [
    CommonModule,
    ModulelistRoutingModule,
    SharedModule
  ]
})
export class ModulelistModule { }
