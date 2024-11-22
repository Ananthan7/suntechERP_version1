import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';

@Component({
  selector: 'app-stone-details',
  templateUrl: './stone-details.component.html',
  styleUrls: ['./stone-details.component.scss']
})
export class StoneDetailsComponent implements OnInit {
  subscriptions: any;
  @Input() content!: any;
  @Input() tablecount :any;
  tableData: any[] = [];


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    console.log(this.tableData)
  }

  enterStoneDetailsForm: FormGroup = this.formBuilder.group({
    Stockcode: [''],
    StockcodeDes: [''],
    sieveSet: [''],
    sieve: [''],
    Shapecode: [''],
    priceCode: [''],
    stoneTypeCode: [''],
    ColorCode: [''],
    ClarityCode: [''],
    SizeCode: [''],
    labourCode: [''],
    stockRefCode: [''],
    karat:[''],
    karatRate:[''],
    labourRate:[''],
    labourAmt:[''],
    currency:[''],
    currencyRate:[''],
    amountLC:[''],
    amountFC:[''],
    percentage:[''],
    sellingPriceLC:[''],
    sellingPriceFC:[''],
    certRef:[''],
    pieces:[''],
  });


  StockcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  StockcodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.Stockcode.setValue(value.STOCK_CODE);
    this.enterStoneDetailsForm.controls.StockcodeDes.setValue(value.DESCRIPTION);
  }

  ShapecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "types='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ShapecodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.Shapecode.setValue(value.CODE);
  }

  sieveSetcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Set Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sieveSetcodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.sieveSet.setValue(value.CODE);
  }

  sievecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sievecodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.sieve.setValue(value.CODE);
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
  priceCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.priceCode.setValue(value.PRICE_CODE);
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stoneTypeCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.stoneTypeCode.setValue(value.CODE);
  }

  stockRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'StockRef Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockRefCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.stockRefCode.setValue(value.CODE);
  }

  ColorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color Code',
    SEARCH_VALUE: '',
    WHERECONDITION:  "TYPES = 'color master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ColorCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.ColorCode.setValue(value.CODE);
  }

  ClarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 37,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Clarity Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ClarityCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.ClarityCode.setValue(value.CODE);
  }

  SizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SizeCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.SizeCode.setValue(value.CODE);
  }

  labourCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 99,
    SEARCH_FIELD: 'Code',
    SEARCH_HEADING: 'labour Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  labourCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.labourCode.setValue(value.Code);
  }

  close(data?: any) {
    //TODO reset forms and data before
    console.log(data);
    
    this.activeModal.close(data);
  }



  formSubmit(){
    this.tablecount += 1;
 
    const postData = {
      UNIQUEID: 0,
          SRNO: this.tablecount,
          METALSTONE: "",
          DIVCODE: "",
          KARAT:   this.commonService.nullToString(this.enterStoneDetailsForm.value.karat),
          CARAT:   this.commonService.emptyToZero(this.enterStoneDetailsForm.value.karatRate),
          GROSS_WT: 0,
          PCS: this.commonService.emptyToZero(this.enterStoneDetailsForm.value.pieces),
          RATE_TYPE: this.commonService.nullToString(this.enterStoneDetailsForm.value.currencyRate),
          CURRENCY_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.currency),
          RATE: 0,
          AMOUNTFC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.amountFC),
          AMOUNTLC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.amountLC),
          MAKINGRATE: 0,
          MAKINGAMOUNT: 0,
          COLOR:  this.commonService.nullToString(this.enterStoneDetailsForm.value.ColorCode),
          CLARITY:  this.commonService.nullToString(this.enterStoneDetailsForm.value.ClarityCode),
          SIEVE: this.commonService.nullToString(this.enterStoneDetailsForm.value.sieve),
          SHAPE: this.commonService.nullToString(this.enterStoneDetailsForm.value.Shapecode),
          TMPDETSTOCK_CODE: "",
          DSIZE:  this.commonService.nullToString(this.enterStoneDetailsForm.value.SizeCode),
          LABCHGCODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.labourAmt),
          PRICECODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.priceCode),
          DESIGN_CODE: "",
          DETLINEREMARKS: "",
          MFTSTOCK_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.Stockcode),
          STOCK_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.StockcodeDes),
          METALRATE: 0,
          LABOURCODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.labourCode),
          STONE_TYPE:  this.commonService.nullToString(this.enterStoneDetailsForm.value.stoneTypeCode),
          STONE_WT: 0,
          NET_WT: 0,
          LOT_REFERENCE: "",
          INCLUDEMETALVALUE: true,
          FINALVALUE: 0,
          PERCENTAGE: this.commonService.emptyToZero(this.enterStoneDetailsForm.value.percentage),
          HANDLING_CHARGEFC: 0,
          HANDLING_CHARGELC: 0,
          PROCESS_TYPE: "",
          SELLING_RATE:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.sellingPriceLC),
          LAB_RATE:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.labourRate),
          LAB_AMTFC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.sellingPriceFC),
          LAB_AMTLC: 0,
          SIEVE_SET:  this.commonService.nullToString(this.enterStoneDetailsForm.value.sieveSet),
          PURITY: 0,
          PUREWT: 0,
          RRR_STOCK_REF: this.commonService.nullToString(this.enterStoneDetailsForm.value.stockRefCode),
          FINALVALUELC: 0,
          LABCHGCODE1: "",
          LABCHGCODE2: "",
          LABRATE1: 0,
          LABRATE2: 0,
          CERT_REF: this.commonService.nullToString(this.enterStoneDetailsForm.value.certRef),
          FROMEXISTINGSTOCK: 0,
          INSERTEDSTOCKCODE: "",
          INSERTEDSTOCKCOST: 0,
          POLISHED: "",
          RAPPRICE: 0,
          PIQUE: "",
          GRAINING: "",
          FLUORESCENCE: "",
          WEIGHT: 0,
    }

    this.close(postData);

  }
}
