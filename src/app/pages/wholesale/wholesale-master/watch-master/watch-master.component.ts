import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnterMetalDetailsComponent } from './enter-metal-details/enter-metal-details.component';
import { EnterStoneDetailsComponent } from './enter-stone-details/enter-stone-details.component';


@Component({
  selector: 'app-watch-master',
  templateUrl: './watch-master.component.html',
  styleUrls: ['./watch-master.component.scss']
})
export class WatchMasterComponent implements OnInit {
  columnhead:any[] = ['Division','Karat','Gross Wt','Rate Type','Metal Rate','Rate/Gms','Amount FC','Amount LC'];
  columnheader:any[] = ['Div','Shape','Color','Clarity','Sieve','Size','Pcs','Carat','Crcy','Pc Code','Lb Code','Crt Rt']
  divisionMS: any = 'ID';
  currentDate = new FormControl(new Date());

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  watchForm: FormGroup = this.formBuilder.group({
    costcenter :[''],
    vendor : [''],
    straptype: [''],
    dialshape: [''],
    brand: [''],
    material: [''],
    category: [''],
    size: [''],
    status: [''],
    hsn: [''],
    strapcolor: [''],
    dialcolor: [''],
    bezel: [''],
    movment: [''],
    sub: [''],
    stonetype: [''],
    by: [''],
    price1: [''],
    price2: [''],
    price3: [''],
    price4: [''],
    price5: [''],
    weight: [''],
    vendorRef: ['']

  
  })

  costcenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Center',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costcenterCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.costcenter.setValue(e.COST_CODE);
  }
 
  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Vendor',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  vendorCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.vendor.setValue(e.CODE);
  }

  straptypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Strap Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  straptypeCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.straptype.setValue(e.CODE);
  }

  dialshapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Dial Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  dialshapeCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.dialshape.setValue(e.CODE);
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  brandCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.brand.setValue(e.CODE);
  }

  materialCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Material',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  materialCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.material.setValue(e.CODE);
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.category.setValue(e.CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.size.setValue(e.CODE);
  }

  statusCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Status',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  statusCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.status.setValue(e.CODE);
  }

  HSNCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  HSNCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.hsn.setValue(e.CODE);
  }

  weightCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Weight',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  weightCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.weight.setValue(e.CODE);
  }

  vendorRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Vendor Ref',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  vendorRefCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.vendorRef.setValue(e.CODE);
  }

  price1CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price 1',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price1CodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.price1.setValue(e.PRICE_CODE);
  }

  price2CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price 2',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price2CodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.price2.setValue(e.PRICE_CODE);
  }

  price3CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price 3',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price3CodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.price3.setValue(e.PRICE_CODE);
  }

  price4CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price 4',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price4CodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.price4.setValue(e.PRICE_CODE);
  }

  price5CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price 5',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price5CodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.price5.setValue(e.PRICE_CODE);
  }



  strapcolorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Strap Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  strapcolorCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.strapcolor.setValue(e.CODE);
  }

  dialcolorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Dial Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  dialcolorCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.dialcolor.setValue(e.CODE);
  }

  bezelCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Bezel',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  bezelCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.bezel.setValue(e.CODE);
  }

  movmentCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Movement',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  movmentCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.movment.setValue(e.CODE);
  }

  subCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sub',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.sub.setValue(e.CODE);
  }

  stonetypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stonetypeCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.stonetype.setValue(e.CODE);
  }

  byCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'By',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  byCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.by.setValue(e.CODE);
  }

  formSubmit() {

  }

  openAddmetaldetails() {
    const modalRef: NgbModalRef = this.modalService.open(EnterMetalDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  openAddstonedetails() {
    const modalRef: NgbModalRef = this.modalService.open(EnterStoneDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
