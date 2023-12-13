import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralMasterRoutingModule } from './general-master.routing';
import { GeneralMasterComponent } from './general-master.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { LocationMasterComponent } from './location-master/location-master.component';
import { JewelleryMasterComponent } from './jewellery-master/jewellery-master.component';
import { EnterMetalDetailsComponent } from './jewellery-master/enter-metal-details/enter-metal-details.component';
import { StoneDetailsComponent } from './jewellery-master/stone-details/stone-details.component';


@NgModule({
  declarations: [
    GeneralMasterComponent,
    ChartOfAccountsComponent,
    LocationMasterComponent,
    JewelleryMasterComponent,
    EnterMetalDetailsComponent,
    StoneDetailsComponent
  ],
  imports: [
    CommonModule,
    GeneralMasterRoutingModule,
    SharedModule
  ]
})
export class GeneralMasterModule { }
