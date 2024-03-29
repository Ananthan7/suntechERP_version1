import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SalesDiaDetailGstComponent } from './sales-dia-detail-gst/sales-dia-detail-gst.component';
import { SalesDiaDetailGstIndComponent } from './sales-dia-detail-gst-ind/sales-dia-detail-gst-ind.component';
import { SalesDiaUnfixDetailGstComponent } from './sales-dia-unfix-detail-gst/sales-dia-unfix-detail-gst.component';
import { PosCreditSaleReciptDetailsComponent } from '../pos-credit-sale-recipt/pos-credit-sale-recipt-details/pos-credit-sale-recipt-details.component';
import { PullPOSComponent } from '../pos-credit-sale-recipt/pull-pos/pull-pos.component';
import { VoucherRedeemComponent } from '../pos-credit-sale-recipt/voucher-redeem/voucher-redeem.component';


@Component({
  selector: 'app-repair-sale',
  templateUrl: './repair-sale.component.html',
  styleUrls: ['./repair-sale.component.scss']
})
export class RepairSaleComponent implements OnInit {

  @Input() content!: any;
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  tableData: any[] = [];
  viewMode:boolean = false;
  private subscriptions: Subscription[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;


  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  columnheadSummary:any[] = ['Division','Code','Description','Pcs','Gross Weight','Mkg Rate','Making Value','Metal Value','Net Value','Discount Value'];
  columnheadSummaryLabour:any[] = ['Mode','Curr','Amt FC','Amt LC']
  columnheadJobDetails:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','Broken Stone','Broken Stock']
  columnheadSummaryLabourCharges:any[] = ['Select','SINo','Labour Code','Lab Accode','Division','Unit','Gross Wt','Pcs','Rate','GST Code','CGST %','CGST Amt','SGST %','SGST Amt','Total %','Total GST','Amount','Currency ']

 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'Code',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.type.setValue(e.CODE);
  } 

  typeidCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'Code',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeidCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.IDType.setValue(e.CODE);
  } 

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'State Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stateCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.state.setValue(e.STATE_DESCRIPTION);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.country.setValue(e.CODE);
  }

  nationalityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Nationality Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='NATIONALITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  nationalityCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.nationality.setValue(e.CODE);
  }

  cityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'City Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  cityCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.city.setValue(e.CODE);
  }

 languageCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 45,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Language Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "where types = 'LANGUAGE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  languageCodeSelected(e: any) {
    console.log(e);
    this.repairSaleForm.controls.language.setValue(e.CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  repairSaleForm: FormGroup = this.formBuilder.group({
    voucherType: [''],
    voucherNo: [''],
    gstNo: [''],
    date: [''],
    stateCode: [''],
    currency: [''],
    currencyType: [''],
    salesMan: [''],
    salesManType: [''],
    text1: [''],
    text2: [''],
    text3: [''],
    text4: [''],
    text5: [''],
    text6: [''],
    text7: [''],
    text8: [''],
    text9: [''],
    text10: [''],
    Mobile: [''],
    MobileDesc: [''],
    phone: [''],
    LoyaltyID: [''],
    customer: [''],
    customerDesc: [''],
    consgParty: [''],
    email: [''],
    type: [''],
    language: [''],
    POBox: [''],
    nationality: [''],
    country: [''],
    IDType: [''],
    RefBy: [''],
    state: [''],
    gstTotal: [''],
    city: [''],
    IDNo: [''],
    touristRefundRef: [''],
    PANNo: [''],
    itemTotal: [''],
    cessTotal: [''],
    grossTotal: [''],
    returns: [''],
    returnsDesc: [''],
    Exchange: [''],
    ExchangeDesc: [''],
    Redeem: [''],
    RedeemDesc: [''],
    RedeemDetail: [''],
    advanceReceived: [''],
    roundOfAmount: [''],
    netTotal: [''],
    receiptTotal: [''],
    refundDue: [''],
    loyaltyPoints: [''],
    vatRoundOff: [''],

  });

  opensalesdiadetail() {
    const modalRef: NgbModalRef = this.modalService.open(SalesDiaDetailGstComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  opensalesdiadetailind() {
    const modalRef: NgbModalRef = this.modalService.open(SalesDiaDetailGstIndComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  opensalesdiaunfixdetailgst() {
    const modalRef: NgbModalRef = this.modalService.open(SalesDiaUnfixDetailGstComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  
  opensalesdetails() {
    const modalRef: NgbModalRef = this.modalService.open(PosCreditSaleReciptDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openpullpos() {
    const modalRef: NgbModalRef = this.modalService.open(PullPOSComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  
  openvoucherredeem() {
    const modalRef: NgbModalRef = this.modalService.open(VoucherRedeemComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }


  formSubmit(){

   
    }


  update(){
    
    }
}
