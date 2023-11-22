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
  selector: 'app-metal-stock-master',
  templateUrl: './metal-stock-master.component.html',
  styleUrls: ['./metal-stock-master.component.scss']
})
export class MetalStockMasterComponent implements OnInit {


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

  metalstockForm: FormGroup = this.formBuilder.group({
    branch:[''],
    costCenter: [''],
    type: [''],
    vendor:[''],
    category: [''],
    subCategory: [''],
    brand: [''],
    price1: [''],
    price2: [''],
    price3: [''],
    price4: [''],
    price5: [''],
    metal: [''],
    color: [''],
    karat: [''],
    hsncode: [''],
    country:[''],
    size:[''],
    location:[''],
    parent:[''],
    modelcode:[''],
    hsmaster:[''],
    seqcode:[''],
    linksub:[''],
    design:['']
  });

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 
  masterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Master Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  BrandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR SET'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 81,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Vendor',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  priceSchemeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Scheme',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESIGN_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  BranchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ParentCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Parent',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ModelCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 157,
    SEARCH_FIELD: 'processToDescription',
    SEARCH_HEADING: 'Model Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "processToDescription<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  HSmasterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 188,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HS Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  metalrCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Metal',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  seqCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Seq Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

 linksubCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 198,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Link Sub',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  branchCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.branch.setValue(e.BRANCH_CODE);
  }


  designCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.design.setValue(e.DESIGN_CODE);
  }

  karatCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.karat.setValue(e['Karat Code']);
  }

  subcategoryCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.subCategory.setValue(e.CODE);
  }

  brandCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.brand.setValue(e.CODE);
  }

  colorDataSelected(data: any) {
    this.metalstockForm.controls.color.setValue(data.CODE)
  }

  vendorCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.vendor.setValue(e.ACCODE);
  }

  typeCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.type.setValue(e.CODE);
  }

  categoryCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.category.setValue(e.CODE);
  }

  costCenterSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.costCenter.setValue(e.COST_CODE);
  }

  priceOneCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.price1.setValue(e.PRICE_CODE);
  }

  priceTwoCodeSelected(e:any){
    this.metalstockForm.controls.price2.setValue(e.PRICE_CODE);
  }

  priceThreeCodeSelected(e:any){
    this.metalstockForm.controls.price3.setValue(e.PRICE_CODE);
  }

  priceFourCodeSelected(e:any){
       this.metalstockForm.controls.price4.setValue(e.PRICE_CODE);
  }

  priceFiveCodeSelected(e:any){
    this.metalstockForm.controls.price5.setValue(e.PRICE_CODE);
  }

  HSNCenterSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.hsncode.setValue(e.CODE);
  }

  countryCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.country.setValue(e.CODE);
  }

  sizeCenterSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.size.setValue(e.CODE);
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.location.setValue(e.LOCATION_CODE);
  }

  parentCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.parent.setValue(e.STOCK_CODE);
  }

  modelCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.modelcode.setValue(e.processToDescription);
  }

 HSmasterCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.hsmaster.setValue(e.CODE);
  }

  metalCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.metal.setValue(e.COST_CODE);
  }

  seqCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.seqcode.setValue(e.SEQ_CODE);
  }

  linksubCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.linksub.setValue(e.STOCK_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
