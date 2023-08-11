import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { WidgetModule } from './widget/widget.module';
import { LoaderComponent } from './loader/loader.component';
import { MasterFilterComponent } from './master-filter/master-filter.component';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbAccordionModule, NgbActiveModal, NgbProgressbarModule  } from '@ng-bootstrap/ng-bootstrap';
import { TimeframeComponent } from './timeframe/timeframe.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {SliderModule} from 'primeng/slider';
import {TableModule} from 'primeng/table';
import { NgApexchartsModule } from "ng-apexcharts";
import { DxDataGridModule,  DxButtonModule,DxCheckBoxModule,DxRadioGroupModule  } from 'devextreme-angular';
import { NgChartsModule } from 'ng2-charts';
import {KnobModule} from 'primeng/knob';
import {SidebarModule} from 'primeng/sidebar';
import {TooltipModule} from 'primeng/tooltip';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import { HeaderPanelComponent } from './header-panel/header-panel.component';
import {DividerModule} from 'primeng/divider';
import { CamelCasePipe } from './pipes/camel-case.pipe';

@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    MasterFilterComponent,
    TimeframeComponent,
    NumberFormatterPipe,
    CamelCasePipe,
    HeaderPanelComponent,
    CamelCasePipe,
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
    DividerModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    NgSelectModule,
    FlatpickrModule,
    NgbDropdownModule,
    PagetitleComponent,
    LoaderComponent,
    MasterFilterComponent,
    TimeframeComponent,
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
    NumberFormatterPipe,
    CamelCasePipe,
    HeaderPanelComponent,
    NgbTooltipModule,
    DividerModule
  ],
  providers:[NgbActiveModal]
})
export class SharedModule { }
