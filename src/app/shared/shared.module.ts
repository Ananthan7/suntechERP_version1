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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MasterFindIconComponent } from './common/master-find-icon/master-find-icon.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MasterSearchComponent } from './common/master-search/master-search.component';
import { NumericInputDirective } from './directives/number-only.directive';

import { DecimalInputDirective } from './directives/number-with-decimal.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { DateValidationDirective } from './directives/date-validation.directive';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';

import { MatCardModule } from '@angular/material/card';
import { FocusOnLoadDirective } from './directives/focus-on-load.directive';
import { NoEmptySpaceDirective } from './directives/no-empty-space.directive';
import { MasterGridComponent } from './common/master-grid/master-grid.component';
import { MenuButtonsComponent } from './common/menu-buttons/menu-buttons.component';
import { AllowLeadingZeroDirective } from './directives/allow-leading-zero.directive';
import { AmountDecimalDirective } from './directives/format-amount-decimal.directive';
import { MetalDecimalDirective } from './directives/format-metal-decimal.directive';
import { FourDecimalDirective } from './directives/format-four-decimal.directive';
import { StoneDecimalDirective } from './directives/format-stone-decimal.directive';
import { FormatSixDecimalDirective } from './directives/format-six-decimal.directive';
import { CalendarModule } from 'primeng/calendar';
import { UppercaseDirective } from './directives/uppercase.directive';
import { DurationPickerComponent } from './common/duration-picker/duration-picker.component';
import { FormatThreeDecimalDirective } from './directives/format-three-decimal.directive';
import {  NumericWithoutCommaDirective } from './directives/comma-separated-number.directive';
import { AuditTrailComponent } from './common/audit-trail/audit-trail.component';
import { DecimalFormatPipe } from './pipes/decimal-format.pipe';
import { AttachmentUploadComponent } from './common/attachment-upload/attachment-upload.component';
import { AuthCheckerComponent } from './common/auth-checker/auth-checker.component';
import { NumericFilterDirective } from './directives/single-digit-numeric';
import { GridSearchComponent } from './common/grid-search/grid-search.component';
import { ImageSliderComponent } from './common/image-slider/image-slider.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { FavoriteMenusComponent } from './common/favorite-menus/favorite-menus.component';
import { DatetimePickerComponent } from './common/datetime-picker/datetime-picker.component';
// import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxBarcodeScannerModule } from '@eisberg-labs/ngx-barcode-scanner';
import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { PurityDecimalDirective } from './directives/format-purity-decimal.directive ';
import { FormatRateDecimalDirective } from './directives/format-rate-decimal.directive';
import { AlphabetsOnlyDirective } from './directives/alphabets-only.directive';
import { NextInputDirective } from './directives/next-input.directive';
import { BranchDivisionComponent } from './common/branch-division/branch-division.component';
import { NegativeAmountDecimalDirective } from './directives/format-negative-amount-decimal.directive';
import { ReportToControlComponent } from './common/report-to-control/report-to-control.component';
import { DateComponent } from './common/date/date.component';
import { AsOnDateComponent } from './common/as-on-date/as-on-date.component';
import { CommonButtonsComponent } from './common/common-buttons/common-buttons.component';
import { AlphabetOnlyDirective } from './directives/appAlphabetOnly.directive';
import { AlphaNumericOnlyDirective } from './directives/appAlphaNumericOnly';
import { ApplyOnlyNumbersDirective } from './directives/apply-only-numbers.directive';
import { ReportScreenButtonsComponent } from './common/report-screen-buttons/report-screen-buttons.component';



@NgModule({
  declarations: [
    //pipes declarations
    NumberFormatterPipe,
    DecimalFormatPipe,
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
    AuditTrailComponent,
    AlphabetOnlyDirective,
    AlphaNumericOnlyDirective,
    NumericWithoutCommaDirective,
    NumericInputDirective,
    DecimalInputDirective,
    DateValidationDirective,
    FocusOnLoadDirective,
    NoEmptySpaceDirective,
    MasterGridComponent,
    MenuButtonsComponent,
    AllowLeadingZeroDirective,
    AmountDecimalDirective,
    NegativeAmountDecimalDirective,
    NextInputDirective,
    MetalDecimalDirective,
    FourDecimalDirective,
    StoneDecimalDirective,
    FormatRateDecimalDirective,
    PurityDecimalDirective,
    NumericFilterDirective,
    FormatSixDecimalDirective,
    UppercaseDirective,
    AlphabetsOnlyDirective,
    DurationPickerComponent,
    FormatThreeDecimalDirective,
    ApplyOnlyNumbersDirective,
    AttachmentUploadComponent,
    AuthCheckerComponent,
    GridSearchComponent,
    ImageSliderComponent,
    FavoriteMenusComponent,
    DatetimePickerComponent,
    BranchDivisionComponent,
    ReportToControlComponent,
    DateComponent,
    AsOnDateComponent,
    CommonButtonsComponent,
    ReportScreenButtonsComponent
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
    SkeletonModule, CalendarModule,
    MatFormFieldModule, MatInputModule,
    MatAutocompleteModule,
    MatExpansionModule, MatButtonModule,
    MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatRippleModule,
    MatTooltipModule, MatProgressBarModule,
    MatDialogModule,
    MatCheckboxModule, MatProgressSpinnerModule,
    OverlayPanelModule, DragDropModule,
    MatTableModule, NgbCarouselModule,
    MatRadioModule, MatCardModule, ZXingScannerModule, NgxBarcodeScannerModule,BarcodeScannerLivestreamModule,
  ],
  exports: [
    //component exports
    LoaderComponent,
    BarcodeScannerLivestreamModule,
    MenubarComponent,
    ZXingScannerModule,
    NgxBarcodeScannerModule,
    ModalHeaderComponent,
    DialogboxComponent,
    CardboxComponent,
    MasterFindIconComponent,
    MasterSearchComponent,
    MasterGridComponent,
    MenuButtonsComponent,
    DurationPickerComponent,
    AuditTrailComponent,
    AuthCheckerComponent,
    AttachmentUploadComponent,
    GridSearchComponent,
    ImageSliderComponent,
    FavoriteMenusComponent,
    DatetimePickerComponent,
    //pipes && Directives exports
    NumberFormatterPipe,
    DecimalFormatPipe,
    CamelCasePipe,
    NumericWithoutCommaDirective,
    NumericInputDirective,
    DateValidationDirective,
    FocusOnLoadDirective,
    NoEmptySpaceDirective,
    AllowLeadingZeroDirective,
    AmountDecimalDirective,
    NegativeAmountDecimalDirective,
    NextInputDirective,
    MetalDecimalDirective,
    FourDecimalDirective,
    StoneDecimalDirective,
    FormatRateDecimalDirective,
    PurityDecimalDirective,
    NumericFilterDirective,
    FormatSixDecimalDirective,
    FormatThreeDecimalDirective,
    UppercaseDirective,
    AlphabetsOnlyDirective,
    DecimalInputDirective,
    AlphabetOnlyDirective,
    AlphaNumericOnlyDirective,
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
    MatExpansionModule, MatButtonModule,
    MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatRippleModule,
    MatTooltipModule, MatProgressBarModule,
    MatDialogModule,NgbCarouselModule,
    MatCheckboxModule, MatProgressSpinnerModule,
    MatRadioModule, MatCardModule,
    OverlayPanelModule, DragDropModule,
    MatTableModule, CalendarModule,
    BranchDivisionComponent, ReportToControlComponent,DateComponent, AsOnDateComponent, CommonButtonsComponent, ReportScreenButtonsComponent
  ],
  providers: [NgbActiveModal, { provide: DateAdapter, useClass: DateFormat }]
})
export class SharedModule {
  constructor(private dateAdapter: DateAdapter<any>) {
    dateAdapter.setLocale('en-in'); // DD/MM/YYYY
  }
}
