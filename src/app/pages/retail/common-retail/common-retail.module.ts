import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { RetailGridComponent } from './retail-grid/retail-grid.component';



@NgModule({
  declarations: [
    RetailGridComponent
  ],
  imports: [
    CommonModule,
    FeatherModule.pick(allIcons),
    SharedModule
  ],
  exports: [
    RetailGridComponent
  ]
})
export class CommonRetailModule { }
