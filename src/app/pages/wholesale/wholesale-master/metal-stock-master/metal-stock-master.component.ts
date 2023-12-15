import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  isDisplayed: boolean = false;
  disabled: boolean = true;
  isdisabled: boolean = false;
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
    this.metalstockForm.controls.PcGms = new FormControl({value: '', disabled: this.disabled})
  }

  showHideText() {
    this.isDisplayed = !this.isDisplayed;
  }

  HideText() {
    this.metalstockForm.controls.PcGms =  new FormControl({value: '', disabled: this.isdisabled})
  }


  
  metalstockForm: FormGroup = this.formBuilder.group({
    metalType:[''],
    code:[''],
    branch:[''],
    description:[''],
    karat: [''],
    makingcharge: [''],
    parent:[''],
    otherdesc:[''],
    costCenter: [''],
    category: [''],
    type: [''],
    design:[''],
    vendor:[''],
    hsncode: [''],
    hsmaster:[''],
    stdpurity:[''],
    unit:[''],
    modelcode:[''],
    metal: [''],
    subCategory: [''],
    brand: [''],
    country:[''],
    size:[''],
    color: [''],
    vendorref: [''],
    PcGms: [''],
    prefix: [''],
    price1: [''],
    price2: [''],
    price3: [''],
    price4: [''],
    price5: [''],      
    details: [''],      
    standardcostMC: [''],      
    salesdiscount: [''],      
    maximumstock: [''],      
    reorderlevel: [''],      
    reorderquantity: [''],      
    firsttransaction: [''],      
    OZconvfactor: [''],      
    Stdpackingsize: [''],      
    purcostGms: [''],      
    salespriceGms: [''],      
    seqcode:[''],
    location:[''],      
    createon: [''],      
    by: [''],   
    lasttransaction: [''],   
    MTratetype: [''],   
    fineoz: [''],   
    defsalepurity: [''],
    abcMaster:[''],   
    kundanrate:[''],   
    linksub:[''],
    stamprate:[''],
    MTinclusive:[''],
    Inpieces:[''],
    createbarcodes:[''],
    passpuritydifference:[''],
    includestoneweight:[''],
    askpercentage:[''],
    excludetaxonmetal:[''],
    avoidalloy:[''],
    asksupplier:[''],
    alloyitem:[''],
    dustitem:[''],
    excludetax:[''],
    blockinallreports:[''],
    askwastage:[''],
    makingnetWt:[''],
    dyestrip:[''],
    kundan:[''],
    blockinalltransaction:[''],
    allownegativestock:[''],
    blockWtinsales:[''],
    allowlessthancost:[''],
    finisheditem:[''],
    excludefromtransfer:[''],
    POPstockfilter:[''],
    Qtyroundoff:[''],
 
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

  metalTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Metal Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  unitCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Metal Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  
  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  abcMasterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 189,
    SEARCH_FIELD: 'workerToDescription',
    SEARCH_HEADING: 'ABC Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "workerToDescription<> ''",
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

  unitCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.unit.setValue(e.CODE);
  }

  abcMasterCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.abcMaster.setValue(e.workerToDescription);
  }

  metalTypeCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.metalType.setValue(e.DIVISION_CODE);
  }
 
  prefixCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.prefix.setValue(e.PREFIX_CODE);
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

  HSmasterCodeSelected(e:any){
    console.log(e);
    this.metalstockForm.controls.hsmaster.setValue(e.CODE);
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
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.metalstockForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalStockMaster/InsertMetalStockMaster'
    let postData = {
      "MID": 0,
      "DIVISION_CODE": "s",
      "STOCK_CODE": "md7",
      "DESCRIPTION": this.metalstockForm.value.description || "",
      "UNIT_CODE": this.metalstockForm.value.unit || "",
      "CC_MAKING":  "md1",
      "CC_METAL": this.metalstockForm.value.metalType || "",
      "KARAT_CODE": this.metalstockForm.value.karat || "",
      "PURITY": this.metalstockForm.value.stdpurity || "",
      "VENDOR_CODE": this.metalstockForm.value.vendor || "",
      "VENDOR_REF": this.metalstockForm.value.vendorref || "",
      "TYPE_CODE": this.metalstockForm.value.type || "",
      "BRAND_CODE": this.metalstockForm.value.brand || "",
      "CATEGORY_CODE": this.metalstockForm.value.category || "",
      "COUNTRY_CODE": this.metalstockForm.value.country || "",
      "PRICE_CODE1":this.metalstockForm.value.price1 || "",
      "PRICE_CODE2": this.metalstockForm.value.price2 || "",
      "PRICE_CODE3": this.metalstockForm.value.price3 || "",
      "PRICE_CODE4": this.metalstockForm.value.price4 || "",
      "PRICE_CODE5": this.metalstockForm.value.price5 || "",
      "STONE": true,
      "CONV_FACTOR_OZ": this.metalstockForm.value.OZconvfactor || "",
      "AUTO_PL": true,
      "INPIECES": this.metalstockForm.value.Inpieces || "",
      "SUBCODE": true,
      "PCS2GMS": this.metalstockForm.value.PcGms || "",
      "STD_COST":this.metalstockForm.value.standardcostMC || "",
      "MIN_QTY": 0,
      "MAX_QTY": 0,
      "DISCOUNT": this.metalstockForm.value.salesdiscount || "",
      "RO_LEVEL":this.metalstockForm.value.reorderlevel || "",
      "RO_QTY": this.metalstockForm.value.reorderquantity || "",
      "AVG_COST": 0,
      "DETAILS": this.metalstockForm.value.details || "",
      "OPENED_ON": "2023-11-24T10:59:37.316Z",
      "OPENED_BY": "",
      "FIRST_TRN": this.metalstockForm.value.firsttransaction || "",
      "LAST_TRN": this.metalstockForm.value.lasttransaction || "",
      "PRINTED": true,
      "ASK_SUPPLIER": this.metalstockForm.value.asksupplier || "",
      "PREFIX_CODE": this.metalstockForm.value.prefix || "",
      "BLOCK_GRWT": this.metalstockForm.value.blockWtinsales || "",
      "PICTURE_PATH": "",
      "ASK_WASTAGE": this.metalstockForm.value.askwastage || "",
      "DUST_ITEM": this.metalstockForm.value.dustitem || "",
      "LESSTHANCOST": this.metalstockForm.value.allowlessthancost || "",
      "BLNPERCENTAGE": true,
      "PICTURE_NAME": "",
      "ALLOW_NEGATIVE": this.metalstockForm.value.allownegativestock || "",
      "SEQ_CODE": this.metalstockForm.value.seqcode || "",
      "LOC_CODE": this.metalstockForm.value.location || "",
      "BLNSTUDDEDJEW": true,
      "SUBCATEGORY_CODE": this.metalstockForm.value.subCategory || "",
      "MKGPURCOST":this.metalstockForm.value.purcostGms || "",
      "MKGSALEPRICE": this.metalstockForm.value.salespriceGms || "",
      "EXCLUDEGSTVAT": true,
      "DESCRIPTION_OTHERS": "",
      "LOYALTY_ITEM": true,
      "EXCLUDE_PROMOTION": 0,
      "UNIT_CODESAL": 0,
      "ASK_PERCENTAGE": this.metalstockForm.value.askpercentage || "",
      "ASK_NEGETIVESTOCK": true,
      "STRGROUPFILTER": "",
      "STRFILTER1": "",
      "STRFILTER2": "",
      "SUB_CATEGORY_CODE": "",
      "DESIGN": this.metalstockForm.value.design || "",
      "HS_CODE": this.metalstockForm.value.hsmaster || "",
      "ABC_CODE": this.metalstockForm.value.abcMaster || "",
      "PCS2OZ": 0,
      "BLOCKFORTRANSACTION": this.metalstockForm.value.blockinalltransaction || "",
      "ALLOY_ITEM": this.metalstockForm.value.alloyitem || "",
      "PRINT_COUNT": 0,
      "MKGCALC_NETWT": true,
      "HSN_CODE": this.metalstockForm.value.hsncode || "",
      "BRANCH_CODE": this.metalstockForm.value.branch || "",
      "UNIT_CONVERSION": "",
      "PARENT_STOCK_CODE": this.metalstockForm.value.parent || "",
      "DYE_STRIP": this.metalstockForm.value.dyestrip || "",
      "GSTVATONMAKING": true,
      "D_SIZE": this.metalstockForm.value.size || "",
      "COLOR_CODE": this.metalstockForm.value.color || "",
      "MT5_RATE_TYPE": this.metalstockForm.value.MTratetype || "",
      "MT5_INCLUSIVE": this.metalstockForm.value.MTinclusive || "",
      "KUNDAN_UNIT_CODE":  "str",
      "KUNDAN": this.metalstockForm.value.kundan || "",
      "UDF1": "",
      "UDF2": "",
      "UDF3": "",
      "UDF4": "",
      "UDF5": "",
      "UDF6": "",
      "UDF7": "",
      "UDF8": "",
      "UDF9": "",
      "UDF10": "",
      "UDF11": "",
      "UDF12": "",
      "UDF13": "",
      "UDF14": "",
      "UDF15": "",
      "FINISHED_ITEM": this.metalstockForm.value.finisheditem || "",
      "MODEL_CODE": this.metalstockForm.value.modelcode || "",
      "AVOID_ALLOY": this.metalstockForm.value.avoidalloy || "",
      "STAMPCHARGES": this.metalstockForm.value.stamprate || "",
      "SALPURITY": this.metalstockForm.value.defsalepurity || "",
      "POPSTOCKFILTER": this.metalstockForm.value.POPstockfilter || "",
      "STD_PACKINGSIZE": this.metalstockForm.value.Stdpackingsize || "",
      "QTY_ROUNDOFF": this.metalstockForm.value.Qtyroundoff || "",
      "LINKSUBCODE": this.metalstockForm.value.linksub || "",
      "EXCLUDE_TRANSFER_WT": this.metalstockForm.value.excludefromtransfer || "",
      "BRANCH_DESC": "",
      "KARAT_DESC": "",
      "PARENT_STOCK_DESC": "",
      "MODEL_DESCRIPTION": "",
      "CC_MAKING_DESC": "",
      "CC_METAL_DESC": this.metalstockForm.value.metal || "",
      "CATEGORY_DESC": "",
      "SUB_CATEGORY_DESC": "",
      "TYPE_DESC": "",
      "BRAND_DESC": "",
      "COUNTRY_DESC": "",
      "D_SIZE_DESC": "",
      "COLOR_DESC": "",
      "HSN_DESC": "",
      "HS_DESC": "",
      "ABC_DESC": "",
      "UDF1_DESC": "",
      "UDF2_DESC": "",
      "UDF3_DESC": "",
      "UDF4_DESC": "",
      "UDF5_DESC": "",
      "UDF6_DESC": "",
      "UDF7_DESC": "",
      "UDF8_DESC": "",
      "UDF9_DESC": "",
      "UDF10_DESC": "",
      "UDF11_DESC": "",
      "UDF12_DESC": "",
      "UDF13_DESC": "",
      "UDF14_DESC": "",
      "UDF15_DESC": "",
      "LINKSUBCODE_DESC": "",
      "DESIGN_DESC": "",
      "VENDOR_DESC": "",
      "LOC_DESC": "",
      "metalStockDetails": [
        {
          "SRNO": 0,
          "UNIQUEID": 0,
          "TRANSVOCNO": 0,
          "TRANSMID": 0,
          "TRANSVOCTYPE": "",
          "BATCH_SRNO": 0,
          "SUB_STOCK_CODE": "string",
          "STOCK_DESC": "",
          "GROSSWT": 0,
          "STONEWT": 0,
          "NETWT": 0,
          "SUPPLIER_REF": "",
          "SUPPLIER": "",
          "PUREWT": 0,
          "PURITYDIFF": 0,
          "OZWT": 0,
          "TRANSPURITY": 0,
          "METAL_RATEFC": 0,
          "METAL_RATECC": 0,
          "STONE_RATEFC": 0,
          "STONE_RATECC": 0,
          "MKG_RATEFC": 0,
          "MKG_RATECC": 0,
          "STONEAMTFC": 0,
          "STONEAMTCC": 0,
          "MKGAMTFC": 0,
          "MKGAMTCC": 0,
          "METALAMTFC": 0,
          "METALAMTCC": 0,
          "PRICE1FC": 0,
          "PRICE1CC": 0,
          "PRICE2FC": 0,
          "PRICE2CC": 0,
          "PRINTED": "",
          "FIELD2": "",
          "FIELD3": "",
          "FIELD4": "",
          "FIELD5": "",
          "FIELD6": "",
          "FIELD7": "",
          "FIELD8": "",
          "FIELD9": "",
          "FIELD10": "",
          "FIELD11": "",
          "TRANSVOCDATE": "2023-11-24T10:59:37.316Z",
          "TAGLINE1": "",
          "TAGLINE2": "",
          "MAIN_STOCK_CODE": "",
          "SAMPLEWT": 0,
          "PAYMENTISSUED": true,
          "DIVISION_CODE": "",
          "PRICE1PERCENT": 0,
          "PRICE2PERCENT": 0,
          "PRICE1PERVALUELC": 0,
          "PRICE2PERVALUELC": 0,
          "MBCPURCHASEREF": "",
          "STONE_SALES_PRICE": 0,
          "RUBY_WT": 0,
          "RUBY_RATE": 0,
          "EMERALD_WT": 0,
          "EMERALD_RATE": 0,
          "SAPPHIRE_WT": 0,
          "SAPPHIRE_RATE": 0,
          "ZIRCON_WT": 0,
          "ZIRCON_RATE": 0,
          "COLOR_STONE_WT": 0,
          "COLOR_STONE_RATE": 0,
          "RUBY_SALES_VALUE": 0,
          "EMERALD_SALES_VALUE": 0,
          "SAPPHIRE_SALES_VALUE": 0,
          "ZIRCON_SALES_VALUE": 0,
          "COLORSTONE_SALES_VALUE": 0,
          "MBCPURCHASEREFNEW": "",
          "COLOR": "",
          "D_SIZE": "",
          "CONS_SALNO": "",
          "CONS_SALDATE": "2023-11-24T10:59:37.316Z",
          "CONS_BRANCH_CODE": "",
          "CUST_BARCODE": "",
          "POSFIXED": true,
          "STOCK_DESC_OTHERS": "",
          "DET_DESIGN_CODE": "",
          "COUNTRY": "",
          "DETAILWEIGHT": "",
          "COLORWEIGHT": 0,
          "TYPE": "",
          "BRAND": "",
          "CATEGORY": "",
          "VENDOR": "",
          "VENDORREF": "",
          "DESIGN": "",
          "PREFIX": "",
          "SUB_CATEGORY_CODE": "",
          "SET_REF": "",
          "PRICE3FC": 0,
          "PRICE3CC": 0,
          "PRICE4FC": 0,
          "PRICE4CC": 0,
          "PRICE5FC": 0,
          "PRICE5CC": 0,
          "PRICE1": "",
          "PRICE2": "",
          "UNQ_ORDER_ID": "",
          "ITEM_ONHOLD": true,
          "POS_CUST_CODE": "",
          "PICTURE_NAME": "",
          "PCS": 0,
          "KUNDANWT": 0,
          "KUNDANPCS": 0,
          "KUNDANRATETYPE": "",
          "KUNDANRATE": 0,
          "WASTAGE_PER": 0,
          "WASTAGE_WT": 0,
          "WASTAGE_AMTFC": 0,
          "WASTAGE_AMTCC": 0,
          "KUNDAN_UNIT_CODE": "",
          "KUNDAN": true,
          "DET_REMARK": "",
          "TAG_WT": 0,
          "LANDING_RATECC": 0,
          "LANDING_RATEFC": 0,
          "LANDING_AMOUNTCC": 0,
          "LANDING_AMOUNTFC": 0,
          "MODEL_CODE": "",
          "UDF1": "",
          "UDF2": "",
          "UDF3": "",
          "UDF4": "",
          "UDF5": "",
          "UDF6": "",
          "UDF7": "",
          "UDF8": "",
          "UDF9": "",
          "UDF10": "",
          "UDF11": "",
          "UDF12": "",
          "UDF13": "",
          "UDF14": "",
          "UDF15": "",
          "WASTAGEPRICE1PER": 0,
          "WASTAGEPRICE2PER": 0,
          "STONE_SALES_PRICE2": 0,
          "STONE_SALES_PRICE3": 0,
          "STONE_SALES_PRICE4": 0,
          "STONE_SALES_PRICE5": 0,
          "WASTAGEPRICE3PER": 0,
          "WASTAGEPRICE4PER": 0,
          "WASTAGEPRICE5PER": 0,
          "STOCK_MTLRATE": 0,
          "KUNDANAMOUNTCC": 0,
          "KUNDANAMOUNTFC": 0,
          "KUNDANWTGMS": 0,
          "KUNDAN_SALES_PRICE": 0,
          "KUNDAN_SALES_PRICE2": 0,
          "KUNDAN_SALES_PRICE3": 0,
          "KUNDAN_SALES_PRICE4": 0,
          "KUNDAN_SALES_PRICE5": 0,
          "TJS_RFID_CODE": "",
          "STAMPCHARGES": 0,
          "SET_PICTURE_NAME": "",
          "DTKUNDANWTGMS": 0,
          "DTKUNDANAMOUNTCC": 0,
          "DTKUNDANAMOUNTFC": 0,
          "DIAMOND_CODE": "",
          "DIA_PRICE": 0,
          "DIA_WEIGHT": 0,
          "PRICE1CODE": "",
          "PRICE2CODE": "",
          "PRICE3CODE": "",
          "PRICE4CODE": "",
          "PRICE5CODE": "",
          "STYLEMASTER": "",
          "HALLMARKING": "",
          "TRANSBRANCH_CODE": "",
          "TRANSYEARMONTH": ""
        }
      ]
    }
  
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalstockForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  update(){
    if (this.metalstockForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalStockMaster/UpdateMetalStockMaster/'+this.content.STOCK_CODE
    let postData = 
    {
      "MID": 0,
      "DIVISION_CODE": "s",
      "STOCK_CODE": "string",
      "DESCRIPTION": "string",
      "UNIT_CODE": "string",
      "CC_MAKING": "string",
      "CC_METAL": "string",
      "KARAT_CODE": "stri",
      "PURITY": 0,
      "VENDOR_CODE": "string",
      "VENDOR_REF": "string",
      "TYPE_CODE": "string",
      "BRAND_CODE": "string",
      "CATEGORY_CODE": "string",
      "COUNTRY_CODE": "string",
      "PRICE_CODE1": "string",
      "PRICE_CODE2": "string",
      "PRICE_CODE3": "string",
      "PRICE_CODE4": "string",
      "PRICE_CODE5": "string",
      "STONE": true,
      "CONV_FACTOR_OZ": 0,
      "AUTO_PL": true,
      "INPIECES": true,
      "SUBCODE": true,
      "PCS2GMS": 0,
      "STD_COST": 0,
      "MIN_QTY": 0,
      "MAX_QTY": 0,
      "DISCOUNT": 0,
      "RO_LEVEL": 0,
      "RO_QTY": 0,
      "AVG_COST": 0,
      "DETAILS": "string",
      "OPENED_ON": "2023-11-24T11:02:06.312Z",
      "OPENED_BY": "string",
      "FIRST_TRN": "string",
      "LAST_TRN": "string",
      "PRINTED": true,
      "ASK_SUPPLIER": true,
      "PREFIX_CODE": "string",
      "BLOCK_GRWT": true,
      "PICTURE_PATH": "string",
      "ASK_WASTAGE": true,
      "DUST_ITEM": true,
      "LESSTHANCOST": true,
      "BLNPERCENTAGE": true,
      "PICTURE_NAME": "string",
      "ALLOW_NEGATIVE": true,
      "SEQ_CODE": "string",
      "LOC_CODE": "string",
      "BLNSTUDDEDJEW": true,
      "SUBCATEGORY_CODE": "string",
      "MKGPURCOST": 0,
      "MKGSALEPRICE": 0,
      "EXCLUDEGSTVAT": true,
      "DESCRIPTION_OTHERS": "string",
      "LOYALTY_ITEM": true,
      "EXCLUDE_PROMOTION": 0,
      "UNIT_CODESAL": 0,
      "ASK_PERCENTAGE": true,
      "ASK_NEGETIVESTOCK": true,
      "STRGROUPFILTER": "string",
      "STRFILTER1": "string",
      "STRFILTER2": "string",
      "SUB_CATEGORY_CODE": "string",
      "DESIGN": "string",
      "HS_CODE": "string",
      "ABC_CODE": "string",
      "PCS2OZ": 0,
      "BLOCKFORTRANSACTION": true,
      "ALLOY_ITEM": true,
      "PRINT_COUNT": 0,
      "MKGCALC_NETWT": true,
      "HSN_CODE": "string",
      "BRANCH_CODE": "string",
      "UNIT_CONVERSION": "string",
      "PARENT_STOCK_CODE": "string",
      "DYE_STRIP": true,
      "GSTVATONMAKING": true,
      "D_SIZE": "string",
      "COLOR_CODE": "string",
      "MT5_RATE_TYPE": "string",
      "MT5_INCLUSIVE": true,
      "KUNDAN_UNIT_CODE": "string",
      "KUNDAN": true,
      "UDF1": "string",
      "UDF2": "string",
      "UDF3": "string",
      "UDF4": "string",
      "UDF5": "string",
      "UDF6": "string",
      "UDF7": "string",
      "UDF8": "string",
      "UDF9": "string",
      "UDF10": "string",
      "UDF11": "string",
      "UDF12": "string",
      "UDF13": "string",
      "UDF14": "string",
      "UDF15": "string",
      "FINISHED_ITEM": true,
      "MODEL_CODE": "string",
      "AVOID_ALLOY": true,
      "STAMPCHARGES": 0,
      "SALPURITY": 0,
      "POPSTOCKFILTER": true,
      "STD_PACKINGSIZE": 0,
      "QTY_ROUNDOFF": 0,
      "LINKSUBCODE": "string",
      "EXCLUDE_TRANSFER_WT": true,
      "BRANCH_DESC": "string",
      "KARAT_DESC": "string",
      "PARENT_STOCK_DESC": "string",
      "MODEL_DESCRIPTION": "string",
      "CC_MAKING_DESC": "string",
      "CC_METAL_DESC": "string",
      "CATEGORY_DESC": "string",
      "SUB_CATEGORY_DESC": "string",
      "TYPE_DESC": "string",
      "BRAND_DESC": "string",
      "COUNTRY_DESC": "string",
      "D_SIZE_DESC": "string",
      "COLOR_DESC": "string",
      "HSN_DESC": "string",
      "HS_DESC": "string",
      "ABC_DESC": "string",
      "UDF1_DESC": "string",
      "UDF2_DESC": "string",
      "UDF3_DESC": "string",
      "UDF4_DESC": "string",
      "UDF5_DESC": "string",
      "UDF6_DESC": "string",
      "UDF7_DESC": "string",
      "UDF8_DESC": "string",
      "UDF9_DESC": "string",
      "UDF10_DESC": "string",
      "UDF11_DESC": "string",
      "UDF12_DESC": "string",
      "UDF13_DESC": "string",
      "UDF14_DESC": "string",
      "UDF15_DESC": "string",
      "LINKSUBCODE_DESC": "string",
      "DESIGN_DESC": "string",
      "VENDOR_DESC": "string",
      "LOC_DESC": "string",
      "metalStockDetails": [
        {
          "SRNO": 0,
          "UNIQUEID": 0,
          "TRANSVOCNO": 0,
          "TRANSMID": 0,
          "TRANSVOCTYPE": "str",
          "BATCH_SRNO": 0,
          "SUB_STOCK_CODE": "string",
          "STOCK_DESC": "string",
          "GROSSWT": 0,
          "STONEWT": 0,
          "NETWT": 0,
          "SUPPLIER_REF": "string",
          "SUPPLIER": "string",
          "PUREWT": 0,
          "PURITYDIFF": 0,
          "OZWT": 0,
          "TRANSPURITY": 0,
          "METAL_RATEFC": 0,
          "METAL_RATECC": 0,
          "STONE_RATEFC": 0,
          "STONE_RATECC": 0,
          "MKG_RATEFC": 0,
          "MKG_RATECC": 0,
          "STONEAMTFC": 0,
          "STONEAMTCC": 0,
          "MKGAMTFC": 0,
          "MKGAMTCC": 0,
          "METALAMTFC": 0,
          "METALAMTCC": 0,
          "PRICE1FC": 0,
          "PRICE1CC": 0,
          "PRICE2FC": 0,
          "PRICE2CC": 0,
          "PRINTED": "s",
          "FIELD2": "string",
          "FIELD3": "string",
          "FIELD4": "string",
          "FIELD5": "string",
          "FIELD6": "string",
          "FIELD7": "string",
          "FIELD8": "string",
          "FIELD9": "string",
          "FIELD10": "string",
          "FIELD11": "string",
          "TRANSVOCDATE": "2023-11-24T11:02:06.312Z",
          "TAGLINE1": "string",
          "TAGLINE2": "string",
          "MAIN_STOCK_CODE": "string",
          "SAMPLEWT": 0,
          "PAYMENTISSUED": true,
          "DIVISION_CODE": "s",
          "PRICE1PERCENT": 0,
          "PRICE2PERCENT": 0,
          "PRICE1PERVALUELC": 0,
          "PRICE2PERVALUELC": 0,
          "MBCPURCHASEREF": "string",
          "STONE_SALES_PRICE": 0,
          "RUBY_WT": 0,
          "RUBY_RATE": 0,
          "EMERALD_WT": 0,
          "EMERALD_RATE": 0,
          "SAPPHIRE_WT": 0,
          "SAPPHIRE_RATE": 0,
          "ZIRCON_WT": 0,
          "ZIRCON_RATE": 0,
          "COLOR_STONE_WT": 0,
          "COLOR_STONE_RATE": 0,
          "RUBY_SALES_VALUE": 0,
          "EMERALD_SALES_VALUE": 0,
          "SAPPHIRE_SALES_VALUE": 0,
          "ZIRCON_SALES_VALUE": 0,
          "COLORSTONE_SALES_VALUE": 0,
          "MBCPURCHASEREFNEW": "string",
          "COLOR": "string",
          "D_SIZE": "string",
          "CONS_SALNO": "string",
          "CONS_SALDATE": "2023-11-24T11:02:06.312Z",
          "CONS_BRANCH_CODE": "string",
          "CUST_BARCODE": "string",
          "POSFIXED": true,
          "STOCK_DESC_OTHERS": "string",
          "DET_DESIGN_CODE": "string",
          "COUNTRY": "string",
          "DETAILWEIGHT": "string",
          "COLORWEIGHT": 0,
          "TYPE": "string",
          "BRAND": "string",
          "CATEGORY": "string",
          "VENDOR": "string",
          "VENDORREF": "string",
          "DESIGN": "string",
          "PREFIX": "string",
          "SUB_CATEGORY_CODE": "string",
          "SET_REF": "string",
          "PRICE3FC": 0,
          "PRICE3CC": 0,
          "PRICE4FC": 0,
          "PRICE4CC": 0,
          "PRICE5FC": 0,
          "PRICE5CC": 0,
          "PRICE1": "string",
          "PRICE2": "string",
          "UNQ_ORDER_ID": "string",
          "ITEM_ONHOLD": true,
          "POS_CUST_CODE": "string",
          "PICTURE_NAME": "string",
          "PCS": 0,
          "KUNDANWT": 0,
          "KUNDANPCS": 0,
          "KUNDANRATETYPE": "string",
          "KUNDANRATE": 0,
          "WASTAGE_PER": 0,
          "WASTAGE_WT": 0,
          "WASTAGE_AMTFC": 0,
          "WASTAGE_AMTCC": 0,
          "KUNDAN_UNIT_CODE": "string",
          "KUNDAN": true,
          "DET_REMARK": "string",
          "TAG_WT": 0,
          "LANDING_RATECC": 0,
          "LANDING_RATEFC": 0,
          "LANDING_AMOUNTCC": 0,
          "LANDING_AMOUNTFC": 0,
          "MODEL_CODE": "string",
          "UDF1": "string",
          "UDF2": "string",
          "UDF3": "string",
          "UDF4": "string",
          "UDF5": "string",
          "UDF6": "string",
          "UDF7": "string",
          "UDF8": "string",
          "UDF9": "string",
          "UDF10": "string",
          "UDF11": "string",
          "UDF12": "string",
          "UDF13": "string",
          "UDF14": "string",
          "UDF15": "string",
          "WASTAGEPRICE1PER": 0,
          "WASTAGEPRICE2PER": 0,
          "STONE_SALES_PRICE2": 0,
          "STONE_SALES_PRICE3": 0,
          "STONE_SALES_PRICE4": 0,
          "STONE_SALES_PRICE5": 0,
          "WASTAGEPRICE3PER": 0,
          "WASTAGEPRICE4PER": 0,
          "WASTAGEPRICE5PER": 0,
          "STOCK_MTLRATE": 0,
          "KUNDANAMOUNTCC": 0,
          "KUNDANAMOUNTFC": 0,
          "KUNDANWTGMS": 0,
          "KUNDAN_SALES_PRICE": 0,
          "KUNDAN_SALES_PRICE2": 0,
          "KUNDAN_SALES_PRICE3": 0,
          "KUNDAN_SALES_PRICE4": 0,
          "KUNDAN_SALES_PRICE5": 0,
          "TJS_RFID_CODE": "string",
          "STAMPCHARGES": 0,
          "SET_PICTURE_NAME": "string",
          "DTKUNDANWTGMS": 0,
          "DTKUNDANAMOUNTCC": 0,
          "DTKUNDANAMOUNTFC": 0,
          "DIAMOND_CODE": "string",
          "DIA_PRICE": 0,
          "DIA_WEIGHT": 0,
          "PRICE1CODE": "string",
          "PRICE2CODE": "string",
          "PRICE3CODE": "string",
          "PRICE4CODE": "string",
          "PRICE5CODE": "string",
          "STYLEMASTER": "string",
          "HALLMARKING": "string",
          "TRANSBRANCH_CODE": "string",
          "TRANSYEARMONTH": "string"
        }
      ]
    }
    
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalstockForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  deleteRecord() {
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'MetalStockMaster/DeleteMetalStockMaster/' + this.content.STOCK_CODE
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.metalstockForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.metalstockForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
