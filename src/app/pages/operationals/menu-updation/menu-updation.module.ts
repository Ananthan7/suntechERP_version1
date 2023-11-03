import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuUpdationRoutingModule } from './menu-updation.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuUpdationComponent } from './menu-updation.component';


@NgModule({
  declarations: [
    MenuUpdationComponent
  ],
  imports: [
    CommonModule,
    MenuUpdationRoutingModule,
    SharedModule
  ]
})
export class MenuUpdationModule { }
