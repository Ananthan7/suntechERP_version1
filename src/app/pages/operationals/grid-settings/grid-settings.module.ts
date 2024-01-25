import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridSettingsRoutingModule } from './grid-settings.routing';
import { GridSettingsComponent } from './grid-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    GridSettingsComponent
  ],
  imports: [
    CommonModule,
    GridSettingsRoutingModule,
    SharedModule
  ]
})
export class GridSettingsModule { }
