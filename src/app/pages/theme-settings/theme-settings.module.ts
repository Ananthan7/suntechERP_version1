import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeSettingsRoutingModule } from './theme-settings.routing';
import { ThemeSettingsComponent } from './theme-settings.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {ColorPickerModule} from 'primeng/colorpicker';

@NgModule({
  declarations: [
    ThemeSettingsComponent
  ],
  imports: [
    CommonModule,
    ThemeSettingsRoutingModule,
    SharedModule,
    ColorPickerModule
  ]
})
export class ThemeSettingsModule { }
