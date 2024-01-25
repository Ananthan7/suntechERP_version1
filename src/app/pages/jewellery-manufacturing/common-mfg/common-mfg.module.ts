import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfgGridComponent } from './mfg-grid/mfg-grid.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';



@NgModule({
  declarations: [
    MfgGridComponent
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    SharedModule
  ],
  exports: [
    MfgGridComponent
  ]
})
export class CommonMfgModule { }
