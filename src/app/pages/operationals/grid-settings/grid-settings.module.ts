import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridSettingsRoutingModule } from './grid-settings.routing';
import { GridSettingsComponent } from './grid-settings.component';


@NgModule({
  declarations: [
    GridSettingsComponent
  ],
  imports: [
    CommonModule,
    GridSettingsRoutingModule
  ]
})
export class GridSettingsModule { }
