import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { LoaderComponent } from './loader/loader.component';
import { MasterFilterComponent } from './master-filter/master-filter.component';
import { TimeframeComponent } from './timeframe/timeframe.component';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import { MenubarComponent } from './component/menubar/menubar.component';
import { ModalHeaderComponent } from './component/modal-header/modal-header.component';

import { WidgetModule } from './widget/widget.module';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbAccordionModule, NgbActiveModal, NgbCollapseModule, NgbProgressbarModule  } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {SliderModule} from 'primeng/slider';
import {TableModule} from 'primeng/table';
import { NgApexchartsModule } from "ng-apexcharts";
import { DxDataGridModule,  DxButtonModule,DxCheckBoxModule,DxRadioGroupModule, DevExtremeModule  } from 'devextreme-angular';
import { NgChartsModule } from 'ng2-charts';
import {KnobModule} from 'primeng/knob';
import {SidebarModule} from 'primeng/sidebar';
import {TooltipModule} from 'primeng/tooltip';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import {DividerModule} from 'primeng/divider';
import { CamelCasePipe } from './pipes/camel-case.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FontPickerModule } from 'ngx-font-picker';
//Material imports
import { MatTabsModule } from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';




@NgModule({
  declarations: [
    //pipes declarations
    NumberFormatterPipe,
    CamelCasePipe,
    CamelCasePipe,
    //components declarations
    PagetitleComponent,
    LoaderComponent,
    MasterFilterComponent,
    TimeframeComponent,
    HeaderPanelComponent,
    MenubarComponent,
    ModalHeaderComponent,
  ],
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    NgSelectModule,
    FlatpickrModule,
    NgbDropdownModule,
    SliderModule,
    TableModule,
    NgApexchartsModule,
    DxDataGridModule,  
    DxButtonModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
    NgbProgressbarModule,
    NgbAccordionModule,
    KnobModule,
    SidebarModule,
    TooltipModule,
    NgbTooltipModule,
    DividerModule,
    NgxPaginationModule,
    NgChartsModule,
    DevExtremeModule,
    NgbCollapseModule,
    FeatherModule.pick(allIcons),
    MatSnackBarModule,
    InputSwitchModule,
    MatTabsModule,
    FontPickerModule,
   
  ],
  exports: [
    //component exports
    PagetitleComponent,
    LoaderComponent,
    MasterFilterComponent,
    TimeframeComponent,
    MenubarComponent,
    ModalHeaderComponent,
    HeaderPanelComponent,
    //pipes exports
    NumberFormatterPipe,
    CamelCasePipe,
    //Modules exports
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    NgSelectModule,
    FlatpickrModule,
    NgbDropdownModule,
    SliderModule,
    TableModule,
    NgApexchartsModule,
    DxDataGridModule,  
    DxButtonModule,
    DxCheckBoxModule,
    DxRadioGroupModule,
    NgChartsModule,
    NgbProgressbarModule,
    NgbAccordionModule,
    KnobModule,
    SidebarModule,
    TooltipModule,
    NgbTooltipModule,
    DividerModule,
    NgxPaginationModule,
    DevExtremeModule,
    NgbCollapseModule,
    MatSnackBarModule,
    InputSwitchModule,
    MatTabsModule,
    FontPickerModule,
  ],
  providers:[NgbActiveModal]
})
export class SharedModule { }
