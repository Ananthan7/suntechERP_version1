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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    FlatpickrModule.forRoot(),
  ],providers:[NgbActiveModal]
})
export class PagesModule { }
