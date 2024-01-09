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
    SEARCH_HEADING: 'Shape Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    LOOKUPID: 35,
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
    WHERECONDITION: "CODE<> ''",
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
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Clarity Code',
    SEARCH_VALUE: '',
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
    WHERECONDITION: "CODE<> ''",
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
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
