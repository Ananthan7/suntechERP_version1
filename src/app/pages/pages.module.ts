// import { SettingsModule } from './settings/settings.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { WidgetModule } from '../shared/widget/widget.module';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DxDataGridModule,  DxButtonModule,DxCheckBoxModule,DxRadioGroupModule  } from 'devextreme-angular';
import { NgbAccordionModule, NgbActiveModal, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgChartsModule } from 'ng2-charts';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {DropdownModule} from 'primeng/dropdown';
import { NgxPaginationModule } from 'ngx-pagination';


FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);
@NgModule({
  declarations: [],
  imports: [ 
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    WidgetModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    NgbAccordionModule,
    NgbProgressbarModule,
    DxDataGridModule,DxButtonModule,DxCheckBoxModule,DxRadioGroupModule ,
    NgChartsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    NgxPaginationModule
  ],providers:[NgbActiveModal]
})
export class PagesModule { }
