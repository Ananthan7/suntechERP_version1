import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { MenubarComponent } from './common/menubar/menubar.component';
import { ModalHeaderComponent } from './common/modal-header/modal-header.component';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgbAccordionModule, NgbActiveModal, NgbCollapseModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SliderModule } from 'primeng/slider';
import { TableModule } from 'primeng/table';
import { NgApexchartsModule } from "ng-apexcharts";
import { DxDataGridModule, DxButtonModule, DxCheckBoxModule, DxRadioGroupModule, DevExtremeModule } from 'devextreme-angular';
import { NgChartsModule } from 'ng2-charts';
import { KnobModule } from 'primeng/knob';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NumberFormatterPipe } from './pipes/number-formatter.pipe';
import { DividerModule } from 'primeng/divider';
import { CamelCasePipe } from './pipes/camel-case.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FontPickerModule } from 'ngx-font-picker';
//Material imports
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule, DateAdapter } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { DateFormat } from './data/date-format';
import { MatButtonModule } from '@angular/material/button';
import { DialogboxComponent } from './common/dialogbox/dialogbox.component';
import { SkeletonModule } from 'primeng/skeleton';
import { CardboxComponent } from './common/cardbox/cardbox.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MasterFindIconComponent } from './common/master-find-icon/master-find-icon.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MasterSearchComponent } from './common/master-search/master-search.component';
import { AppDecimalInputDirective } from './directives/app-decimal-input.directive';
import { NumericInputDirective } from './directives/numeric-input.directive';
import { DecimalInputDirective } from './directives/decimal-input.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';
import { DateValidationDirective } from './directives/date-validation.directive';
import {MatRadioButton, MatRadioModule} from '@angular/material/radio';

import { MatCardModule } from '@angular/material/card';
import { FocusOnLoadDirective } from './directives/focus-on-load.directive';
import { NoEmptySpaceDirective } from './directives/no-empty-space.directive';
@NgModule({
  declarations: [
    //pipes declarations
    NumberFormatterPipe,
    CamelCasePipe,
    CamelCasePipe,
    //components declarations
    LoaderComponent,
    MenubarComponent,
    ModalHeaderComponent,
    DialogboxComponent,
    CardboxComponent,
    MasterFindIconComponent,
    MasterSearchComponent,
    AppDecimalInputDirective,
    NumericInputDirective,
    DecimalInputDirective,
    DateValidationDirective,
    FocusOnLoadDirective,
    NoEmptySpaceDirective
  ],
  imports: [
    CommonModule,
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
    SkeletonModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule,
    MatExpansionModule, MatButtonModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatRippleModule,
    MatTooltipModule, MatProgressBarModule, MatDialogModule,
    MatCheckboxModule, MatProgressSpinnerModule,
    OverlayPanelModule,DragDropModule,MatTableModule,
    MatRadioModule,MatCardModule,
  ],
  exports: [
    //component exports
    LoaderComponent,
    MenubarComponent,
    ModalHeaderComponent,
    DialogboxComponent,
    CardboxComponent,
    MasterFindIconComponent,
    MasterSearchComponent,
    //pipes && Directives exports
    NumberFormatterPipe,
    CamelCasePipe,
    AppDecimalInputDirective,
    NumericInputDirective,
    DateValidationDirective,
    FocusOnLoadDirective,
    NoEmptySpaceDirective,
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
    SkeletonModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule, 
    MatExpansionModule, MatButtonModule, MatSelectModule, 
    MatDatepickerModule, MatNativeDateModule, MatRippleModule, 
    MatTooltipModule, MatProgressBarModule, MatDialogModule, 
    MatCheckboxModule, MatProgressSpinnerModule,MatRadioModule,MatCardModule,
    OverlayPanelModule,DragDropModule,MatTableModule
  ],
  providers: [NgbActiveModal, { provide: DateAdapter, useClass: DateFormat }]
})
export class SharedModule {
  constructor(private dateAdapter: DateAdapter<any>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
​