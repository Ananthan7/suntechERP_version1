import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-watch-master',
  templateUrl: './watch-master.component.html',
  styleUrls: ['./watch-master.component.scss']
})
export class WatchMasterComponent implements OnInit {
  columnhead:any[] = ['Division','Karat','Gross Wt','Rate Type','Metal Rate','',''];
  columnheader:any[] = ['Div','Shape','Color','Size','PCs','Carat']
  divisionMS: any = 'ID';

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
    by: ['']
  
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
    SEARCH_HEADING: 'Status',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  HSNCodeSelected(e:any){
    console.log(e);
    this.watchForm.controls.hsn.setValue(e.CODE);
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
