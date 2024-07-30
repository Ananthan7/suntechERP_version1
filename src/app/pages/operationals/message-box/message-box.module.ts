import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageBoxRoutingModule } from './message-box.routing';
import { MessageBoxComponent } from './message-box.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    MessageBoxComponent
  ],
  imports: [
    CommonModule,
    MessageBoxRoutingModule,
    SharedModule
  ]
})
export class MessageBoxModule { }
