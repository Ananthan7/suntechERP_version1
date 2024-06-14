import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GoldExchangeDetailsComponent } from './gold-exchange-details/gold-exchange-details.component';

@Component({
  selector: 'app-gold-exchange',
  templateUrl: './gold-exchange.component.html',
  styleUrls: ['./gold-exchange.component.scss']
})
export class GoldExchangeComponent implements OnInit {

  @Input() content!: any; 

  branchCode?: String;
  yearMonth?: String;

  private subscriptions: Subscription[] = [];

  columnsList: any[] = [
    { title: 'Sr #', field: 'SRNO' },
    { title: 'Stock Code', field: 'STOCK_CODE' },
    { title: 'Pcs', field: 'PCS' },
    { title: 'Gr.Wt', field: 'GROSSWT' },
    { title: 'Purity', field: 'PURITY' },
    { title: 'Pure Wt', field: 'PUREWT' },
    { title: 'Mkg.RATE', field: 'MKG_RATECC' },
    { title: 'Mkg.Amount', field: 'MKGVALUECC' },
    { title: 'Metal Amt', field: 'METALVALUECC' },
    { title: 'St.Amt', field: 'STONEVALUECC' },
    { title: 'Wastage', field: 'WASTAGEAMOUNTCC' },
    { title: 'Total', field: 'TOTAL_AMOUNTCC' },
  ];

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode:any= '';
  goldExchangeDetailsData : any[] = [];
  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  
  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };



  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Party Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  
  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SALES MAN ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  goldExchangeForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocTypeNo:[1],
    vocDate:[new Date()],
    partyCode:[''],
    partyCodeName:[''],
    partyCurrCode:[''],
    partyCurrCodeDesc:[''],
    customer:[''],
    moblie:[''],
    itemCurr:[''],
    itemCurrCode:[''],
    creditDaysCode:[''],
    creditDays:[new Date()],
    salesMan:[''],
    supInvNo:[''],
    supInvDate:[new Date()],
    custName:[''],
    email:[''],
    custId:[''],
    narration:[''],
    partyCurrency:[''],
    partyCurrencyCode:[''],
    amount:[''],
    amountDes:[''],
    rndOfAmt:[''],
    rndOfAmtDes:[''],
    rndNetAmt:[''],
    rndNetAmtDes:[''],
    otherAmt:[''],
    otherAmtDes:[''],
    grossAmt:[''],
    grossAmtDes:[''],
    partyCode1:[''],

  });
  zeroAmtVal: any;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private comService: CommonServiceService,
    private suntechApi: SuntechAPIService,
    private toastr: ToastrService,
  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
    this.zeroAmtVal = this.comService.transformDecimalVB(
      this.comService.allbranchMaster?.BAMTDECIMALS,
      0
    );
   }

  ngOnInit(): void {
    console.log(this.content);

    if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') {

  
      this.getRetailSalesMaster(this.content);
      if (this.content.FLAG == "EDIT") {
        // this.editOnly = true
      }
      if (this.content.FLAG == 'VIEW') {
        // this.viewOnly = true;
      }




    } else {
      this.branchCode = this.comService.branchCode;
      this.yearMonth = this.comService.yearSelected;
      this.goldExchangeForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
      this.goldExchangeForm.controls.partyCurrCode.setValue(this.comService.compCurrency);
      this.goldExchangeForm.controls.partyCurrCodeDesc.setValue(this.comService.getCurrRate(this.comService.compCurrency));
      this.goldExchangeForm.controls.itemCurr.setValue(this.comService.compCurrency);
      this.goldExchangeForm.controls.itemCurrCode.setValue(this.comService.getCurrRate(this.comService.compCurrency));
      this.getKaratDetails();

    }
  
  }


  getRetailSalesMaster(data: any) {

    // this.snackBar.open('Loading...');
    let API = `OldGoldPurchase/GetMetalPurchaseHeaderAndDetail/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.YEARMONTH}/${data.VOCNO}`
    this.suntechApi.getDynamicAPI(API).subscribe((res) => {


      // const values = res.response;
      if (res.status == 'Success') {}})}

  getKaratDetails() {
    this.suntechApi.getDynamicAPI('BranchKaratRate/' + this.strBranchcode).subscribe((result) => {
      if (result.response) {
        this.tableData = result.response;
        console.log(this.tableData);
      }
    });
  }

  partyCodeSelected(e:any){
    console.log(e);
    this.goldExchangeForm.controls.partyCode.setValue(e.ACCODE);
    this.goldExchangeForm.controls.partyCodeName.setValue(e['ACCOUNT HEAD'])
    this.goldExchangeForm.controls.partyCode1.setValue(e['ACCOUNT HEAD'])  
  }

  partyCurrencyCodeSelected(e:any){
    console.log(e);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(e.CURRENCY_CODE);
  }


 salesManCodeSelected(e:any){
    console.log(e);
    this.goldExchangeForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
  }

  customerCodeSelected(e:any){
    console.log(e);
    this.goldExchangeForm.controls.customer.setValue(e.CODE);
    this.goldExchangeForm.controls.custId.setValue(e.CODE);
    this.goldExchangeForm.controls.custName.setValue(e.NAME);
    this.goldExchangeForm.controls.email.setValue(e.EMAIL);
    this.goldExchangeForm.controls.moblie.setValue(e.MOBILE);
  }

  opengoldposdirectdetail() {
    const modalRef: NgbModalRef = this.modalService.open(GoldExchangeDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      // console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);    
        this.goldExchangeDetailsData.push(postData);
      }
    });
  }

  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setFormValues(){
    console.log('this.content', this.content);
    if (!this.content) return
    this.goldExchangeForm.controls.vocType.setValue(this.content.VOCTYPE);
    this.goldExchangeForm.controls.vocTypeNo.setValue(this.content.VOCNO);
    this.goldExchangeForm.controls.vocDate.setValue(this.content.VOCDATE);
    this.goldExchangeForm.controls.partyCode.setValue(this.content.PARTYCODE);
    this.goldExchangeForm.controls.partyCurrCode.setValue(this.content.PARTY_CURRENCY);
    this.goldExchangeForm.controls.partyCurrCodeDesc.setValue(this.content.PARTY_CURR_RATE);
    this.goldExchangeForm.controls.itemCurr.setValue(this.content.ITEM_CURRENCY);
    this.goldExchangeForm.controls.itemCurrCode.setValue(this.content.ITEM_CURR_RATE);
    this.goldExchangeForm.controls.salesMan.setValue(this.content.SALESPERSON_CODE);
    this.goldExchangeForm.controls.partyCurrency.setValue(this.content.PARTY_VALUE_FC);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(this.content.PARTY_VALUE_CC);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(this.content.PARTY_VALUE_CC);
    this.goldExchangeForm.controls.rndNetAmt.setValue(this.content.NET_VALUE_FC);

    this.goldExchangeForm.controls['rndNetAmt'].setValue(
      this.comService.decimalQuantityFormat(this.zeroAmtVal, 'AMOUNT')

    );
    this.goldExchangeForm.controls.rndNetAmtDes.setValue(this.content.NET_VALUE_CC);
    this.goldExchangeForm.controls.otherAmt.setValue(this.content.ADDL_VALUE_FC);
    this.goldExchangeForm.controls.otherAmtDes.setValue(this.content.ADDL_VALUE_CC);
    this.goldExchangeForm.controls.grossAmt.setValue(this.content.GROSS_VALUE_FC);
    this.goldExchangeForm.controls.grossAmtDes.setValue(this.content.GROSS_VALUE_CC);
    this.goldExchangeForm.controls.narration.setValue(this.content.REMARKS);
    
    this.goldExchangeForm.controls.supInvNo.setValue(this.content.SUPINVNO);
    this.goldExchangeForm.controls.supInvDate.setValue(this.content.supInvDate);
    
    this.goldExchangeForm.controls.creditDaysCode.setValue(this.content.CREDITDAY);
 
    this.goldExchangeForm.controls.customer.setValue(this.content.HLOCTYPE_CODE);
    this.goldExchangeForm.controls.custName.setValue(this.content.HTUSERNAME);
 
    this.goldExchangeForm.controls.custId.setValue(this.content.MHCUSTIDNO);
    
    this.goldExchangeForm.controls.moblie.setValue(this.content.CUSTOMER_MOBILE);
    this.goldExchangeForm.controls.email.setValue(this.content.CUSTOMER_EMAIL);
   
  
   
    this.goldExchangeForm.controls.amount.setValue(this.content.TOTSTAMP_AMTFC);
    this.goldExchangeForm.controls.amountDes.setValue(this.content.TOTSTAMP_AMTCC);
    
    
  
    this.goldExchangeForm.controls.rndOfAmt.setValue(this.content.VATAMOUNTFCROUND);
    this.goldExchangeForm.controls.rndOfAmtDes.setValue(this.content.VATAMOUNTFCROUNDCC);

  }

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update();
      return
    }
    if (this.goldExchangeForm.invalid) {
      this.toastr.error('select all required fields');
      return
    }

    const saveApi = 'OldGoldPurchase/InsertMetalPurchase';
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.goldExchangeForm.value.vocType,
      "VOCNO": this.goldExchangeForm.value.vocTypeNo,
      "VOCDATE": this.goldExchangeForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.goldExchangeForm.value.partyCode,
      "PARTY_CURRENCY": this.goldExchangeForm.value.partyCurrCode,
      "PARTY_CURR_RATE": this.goldExchangeForm.value.partyCurrCodeDesc,
      "ITEM_CURRENCY": this.goldExchangeForm.value.itemCurr,
      "ITEM_CURR_RATE": this.goldExchangeForm.value.itemCurrCode,
      "VALUE_DATE": "2024-02-08T12:18:43.101Z",
      "SALESPERSON_CODE": this.goldExchangeForm.value.salesMan,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "FIXED": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndNetAmt, 'AMOUNT'),
      "NET_VALUE_CC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndNetAmtDes, 'AMOUNT'),
      "ADDL_VALUE_FC":this.comService.decimalQuantityFormat(this.goldExchangeForm.value.otherAmt, 'AMOUNT'),
      "ADDL_VALUE_CC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.otherAmtDes, 'AMOUNT'),
      "GROSS_VALUE_FC":this.comService.decimalQuantityFormat(this.goldExchangeForm.value.grossAmt, 'AMOUNT'),
      "GROSS_VALUE_CC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.grossAmtDes, 'AMOUNT'),
      "REMARKS": this.goldExchangeForm.value.narration,
      "SYSTEM_DATE": "2024-02-08T12:18:43.101Z",
      "FLAG_EDIT_ALLOW": "",
      "TOTAL_OZWT": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": this.goldExchangeForm.value.supInvNo,
      "supInvDate": this.goldExchangeForm.value.supInvDate,
      "FLAG_UPDATED": "",
      "FLAG_INPROCESS": "",
      "HHACCOUNT_HEAD": "",
      "PURCHASEFIXINGAMTLC": 0,
      "PURCHASEFIXINGAMTFC": 0,
      "PURCHASEFIXINGMID": 0,
      "PURCHASEFIXINGREF": "",
      "PURCHASEFIXINGPUREWT": 0,
      "PURCHASEFIXINGRATE": "",
      "D2DTRANSFER": "s",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "CURRRECMID": 0,
      "CURRRECVOCTYPE": "",
      "CURRRECREF": "",
      "CURRRECAMOUNTFC": 0,
      "CURRRECAMOUNTCC": 0,
      "TOTAL_DISCOUNTWT": 0,
      "CUSTOMER_NAME": "",
      "MACHINEID": "",
      "SALESPERSON_NAME": "",
      "TOTAL_WASTQTY": 0,
      "TOTAL_AMT_FC": 0,
      "PARTYADDRESS": this.goldExchangeForm.value.partyCode1,
      "CREDITDAY":parseInt(this.goldExchangeForm.value.creditDaysCode) ,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "PURITYQUALITYCHECK": true,
      "TESTINGPARTY": "",
      "TESTINGPARTYWT": 0,
      "TESTINGPARTYREMARKS": "",
      "TESTINGPARTYWTRECEIVED": 0,
      "DOC_DISCMTLRATE": 0,
      "REP_REF": "",
      "REPAIR_REF": "",
      "HLOCTYPE_CODE": this.goldExchangeForm.value.customer,
      "HTUSERNAME": this.goldExchangeForm.value.custName,
      "MHIDCATEGORY": "",
      "MHCUSTIDNO": this.goldExchangeForm.value.custId,
      "GENSEQNO": 0,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "INCLUSIVE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "FIXED_QTY": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "st",
      "GST_NUMBER": "",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "CUSTOMER_MOBILE": this.goldExchangeForm.value.moblie,
      "CUSTOMER_EMAIL": this.goldExchangeForm.value.email,
      "POSCUSTIDNO": "",
      "POPCUSTCODE": "",
      "GST_GROUP": "s",
      "FIXING_PROCESS": true,
      "TOTAL_ADDL_TAXFC": 0,
      "TOTAL_ADDL_TAXCC": 0,
      "DIRECTFIXINGREF": "",
      "INTERNALUNFIX": true,
      "REF_JOBCREATED": true,
      "EXCLUDEVAT": true,
      "TEST_BRANCH_CODE": "",
      "TEST_VOCTYPE": "str",
      "TEST_VOCNO": 0,
      "TEST_YEARMONTH": "",
      "TDS_CODE": "",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "H_DECLARATIONNO": "",
      "H_ORIGINCOUNTRY": "",
      "H_DECLARATIONDATE": "2024-02-08T12:18:43.101Z",
      "H_PACKETNO": 0,
      "SHIPPER_CODE": "",
      "SHIPPER_NAME": "",
      "ORIGIN_COUNTRY": "",
      "DESTINATION_STATE": "",
      "DESTINATION_COUNTRY": "",
      "MINING_COMP_CODE": "",
      "MINING_COMP_NAME": "",
      "AIRWAY_BILLNO": "",
      "AIRWAY_BILLDATE": "2024-02-08T12:18:43.101Z",
      "AIRWAY_WEIGHT": 0,
      "ARIVAL_DATE": "2024-02-08T12:18:43.101Z",
      "CLEARENCE_DATE": "2024-02-08T12:18:43.101Z",
      "BOE_FILLINGDATE": "2024-02-08T12:18:43.101Z",
      "BOE_NO": "",
      "PO_IMP": 0,
      "SILVER_RATE_TYPE": "",
      "SILVER_RATE": 0,
      "TOTAL_SILVERWT": 0,
      "TOTAL_SILVERVALUE_FC": 0,
      "TOTAL_SILVERVALUE_CC": 0,
      "PO_REFNO": "",
      "MINING_COMP_REFNO": "",
      "PARTY_ROUNDOFF": 0,
      "TRANSPORTER_CODE": "",
      "VEHICLE_NO": "",
      "LR_NO": "",
      "AIR_BILL_NO": "",
      "SHIPCODE": "",
      "SHIPDESC": "",
      "STAMPCHARGE": true,
      "TOTSTAMP_AMTFC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.amount, 'AMOUNT'),
      "TOTSTAMP_AMTCC":this.comService.decimalQuantityFormat(this.goldExchangeForm.value.amountDes, 'AMOUNT'),
      "TOTSTAMP_PARTYAMTFC": 0,
      "REFPURIMPORT": "",
      "BOE_EXPIRY_DATE": "2024-02-08T12:18:43.101Z",
      "H_BILLOFENTRYREF": "",
      "SUB_LED_ACCODE": "",
      "ACTIVITY_CODE": "",
      "TCS_ACCODE": "",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "DISCOUNTPERCENTAGE": 0,
      "CUSTOMER_ADDRESS": "",
      "FROM_TOUCH": true,
      "CUSTOMER_CODE": "",
      "IMPORTINPURCHASE": true,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "CNT_ORIGIN": "",
      "OT_TRANSFER_TIME": "",
      "FREIGHT_RATE": 0,
      "TDS_PER": 0,
      "TDS_TOPARTY": true,
      "LONDONFIXING_TYPE": 0,
      "LONDONFIXING_RATE": 0,
      "PARTYROUNDOFF": 0,
      "NOTIONAL_PARTY": true,
      "METAL_CONV_CURR": "stri",
      "METAL_CONV_RATE": 0,
      "CHECK_HEDGINGBAL": true,
      "IMPORTINSALES": true,
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "str",
      "AUTOGENREF": "",
      "VATAMOUNTMakingONLYCC": 0,
      "CALCULATEPARTYVATONMAKINGONLY": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_WASTAGE_AMOUNTCC": 0,
      "PARTYTRANSWISE_DESIGNATEDZONE": true,
      "PARTY_STATE_CODE": "",
      "SHIP_ACCODE": "",
      "SHIP_STATE_CODE": "",
      "DISPATCH_NAME": "",
      "DISPATCH_ADDRESS": "",
      "DISPATCH_STATE_CODE": "",
      "TRANSPORTER_ID": "",
      "TRANSPORTER_MODE": "",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-02-08T12:18:43.101Z",
      "VEHICLE_TYPE": "",
      "DISPATCH_CITY": "",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "",
      "CREDIT_DAYSMTL": 0,
      "VALUE_DATEMTL": "2024-02-08T12:18:43.101Z",
      "PURITYQUALITYREMARKS": "",
      "DISCOUNT_PERGRM": 0,
      "EXCLUDE_VAT": true,
      "H_AIRWAYBILL": "",
      "H_BASIS": "",
      "H_DESTINATION": "",
      "H_MINER": "",
      "H_SHIPMENTMODE": "",
      "H_SHIPPER": "",
      "HTOTALAMOUNTWITHVAT_CC": 0,
      "HTOTALAMOUNTWITHVAT_FC": 0,
      "HVAT_AMOUNT_CC": 0,
      "HVAT_AMOUNT_FC": 0,
      "INTERNALFIXEDQTY": 0,
      "ITEMROUNDVALUEFC": 0,
      "NEWMID": 0,
      "PARTYROUNDVALUEFC": 0,
      "PARTYTRANSWISE_METALVATONMAKING": true,
      "PLACEOFSUPPLY": "",
      "POSPRICESFIXED": true,
      "QRCODEIMAGE": "",
      "QRCODEVALUE": "",
      "SHIPMENTCOMPANY": "",
      "SHIPMENTPORT": "",
      "TAX_APPLICABLE": true,
      "TOTAL_WASTAGE_AMOUNTFC": 0,
      "TRANSFER_BRANCH": "",
      "VATAMOUNTFCROUND": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndOfAmt, 'AMOUNT'),
      "VATAMOUNTFCROUNDCC":this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndOfAmtDes, 'AMOUNT'),
      "metalPurchaseDetails": this.goldExchangeDetailsData,
    }
    

    let Sub: Subscription = this.suntechApi.postDynamicAPI(saveApi, postData)
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
                this.goldExchangeForm.reset()
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

    if (this.goldExchangeForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    const updateApi = 'OldGoldPurchase/UpdateMetalPurchase/'+this.branchCode+'/'+this.content.VOCTYPE+'/'+this.yearMonth

    let updateData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.goldExchangeForm.value.vocType,
      "VOCNO": this.goldExchangeForm.value.vocTypeNo,
      "VOCDATE": this.goldExchangeForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.goldExchangeForm.value.partyCode,
      "PARTY_CURRENCY": this.goldExchangeForm.value.partyCurrCode,
      "PARTY_CURR_RATE": this.goldExchangeForm.value.partyCurrCodeDesc,
      "ITEM_CURRENCY": this.goldExchangeForm.value.itemCurr,
      "ITEM_CURR_RATE": this.goldExchangeForm.value.itemCurrCode,
      "VALUE_DATE": "2024-02-08T12:18:43.101Z",
      "SALESPERSON_CODE": this.goldExchangeForm.value.salesMan,
      "RATE_TYPE": "string",
      "METAL_RATE": 0,
      "FIXED": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": this.goldExchangeForm.value.partyCurrency,
      "PARTY_VALUE_CC": this.goldExchangeForm.value.partyCurrencyCode,
      "NET_VALUE_FC": this.goldExchangeForm.value.rndNetAmt,
      "NET_VALUE_CC": this.goldExchangeForm.value.rndNetAmtDes,
      "ADDL_VALUE_FC": this.goldExchangeForm.value.otherAmt,
      "ADDL_VALUE_CC": this.goldExchangeForm.value.otherAmtDes,
      "GROSS_VALUE_FC": this.goldExchangeForm.value.grossAmt,
      "GROSS_VALUE_CC": this.goldExchangeForm.value.grossAmtDes,
      "REMARKS": this.goldExchangeForm.value.narration,
      "SYSTEM_DATE": "2024-02-08T12:18:43.101Z",
      "FLAG_EDIT_ALLOW": "string",
      "TOTAL_OZWT": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": this.goldExchangeForm.value.supInvNo,
      "supInvDate": this.goldExchangeForm.value.supInvDate,
      "FLAG_UPDATED": "string",
      "FLAG_INPROCESS": "string",
      "HHACCOUNT_HEAD": "string",
      "PURCHASEFIXINGAMTLC": 0,
      "PURCHASEFIXINGAMTFC": 0,
      "PURCHASEFIXINGMID": 0,
      "PURCHASEFIXINGREF": "string",
      "PURCHASEFIXINGPUREWT": 0,
      "PURCHASEFIXINGRATE": "string",
      "D2DTRANSFER": "s",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "CURRRECMID": 0,
      "CURRRECVOCTYPE": "str",
      "CURRRECREF": "string",
      "CURRRECAMOUNTFC": 0,
      "CURRRECAMOUNTCC": 0,
      "TOTAL_DISCOUNTWT": 0,
      "CUSTOMER_NAME": "string",
      "MACHINEID": "string",
      "SALESPERSON_NAME": "string",
      "TOTAL_WASTQTY": 0,
      "TOTAL_AMT_FC": 0,
      "PARTYADDRESS": this.goldExchangeForm.value.partyCode1,
      "CREDITDAY": this.goldExchangeForm.value.creditDaysCode,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "PURITYQUALITYCHECK": true,
      "TESTINGPARTY": "string",
      "TESTINGPARTYWT": 0,
      "TESTINGPARTYREMARKS": "string",
      "TESTINGPARTYWTRECEIVED": 0,
      "DOC_DISCMTLRATE": 0,
      "REP_REF": "string",
      "REPAIR_REF": "string",
      "HLOCTYPE_CODE": this.goldExchangeForm.value.customer,
      "HTUSERNAME": this.goldExchangeForm.value.custName,
      "MHIDCATEGORY": "string",
      "MHCUSTIDNO": this.goldExchangeForm.value.custId,
      "GENSEQNO": 0,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "INCLUSIVE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF": "string",
      "FIXED_QTY": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "st",
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "CUSTOMER_MOBILE": this.goldExchangeForm.value.moblie,
      "CUSTOMER_EMAIL": this.goldExchangeForm.value.email,
      "POSCUSTIDNO": "string",
      "POPCUSTCODE": "string",
      "GST_GROUP": "s",
      "FIXING_PROCESS": true,
      "TOTAL_ADDL_TAXFC": 0,
      "TOTAL_ADDL_TAXCC": 0,
      "DIRECTFIXINGREF": "string",
      "INTERNALUNFIX": true,
      "REF_JOBCREATED": true,
      "EXCLUDEVAT": true,
      "TEST_BRANCH_CODE": "string",
      "TEST_VOCTYPE": "str",
      "TEST_VOCNO": 0,
      "TEST_YEARMONTH": "string",
      "TDS_CODE": "string",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "H_DECLARATIONNO": "string",
      "H_ORIGINCOUNTRY": "string",
      "H_DECLARATIONDATE": "2024-02-08T12:18:43.101Z",
      "H_PACKETNO": 0,
      "SHIPPER_CODE": "string",
      "SHIPPER_NAME": "string",
      "ORIGIN_COUNTRY": "string",
      "DESTINATION_STATE": "string",
      "DESTINATION_COUNTRY": "string",
      "MINING_COMP_CODE": "string",
      "MINING_COMP_NAME": "string",
      "AIRWAY_BILLNO": "string",
      "AIRWAY_BILLDATE": "2024-02-08T12:18:43.101Z",
      "AIRWAY_WEIGHT": 0,
      "ARIVAL_DATE": "2024-02-08T12:18:43.101Z",
      "CLEARENCE_DATE": "2024-02-08T12:18:43.101Z",
      "BOE_FILLINGDATE": "2024-02-08T12:18:43.101Z",
      "BOE_NO": "string",
      "PO_IMP": 0,
      "SILVER_RATE_TYPE": "string",
      "SILVER_RATE": 0,
      "TOTAL_SILVERWT": 0,
      "TOTAL_SILVERVALUE_FC": 0,
      "TOTAL_SILVERVALUE_CC": 0,
      "PO_REFNO": "string",
      "MINING_COMP_REFNO": "string",
      "PARTY_ROUNDOFF": 0,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO": "string",
      "LR_NO": "string",
      "AIR_BILL_NO": "string",
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "STAMPCHARGE": true,
      "TOTSTAMP_AMTFC": this.goldExchangeForm.value.amount,
      "TOTSTAMP_AMTCC": this.goldExchangeForm.value.amountDes,
      "TOTSTAMP_PARTYAMTFC": 0,
      "REFPURIMPORT": "string",
      "BOE_EXPIRY_DATE": "2024-02-08T12:18:43.101Z",
      "H_BILLOFENTRYREF": "string",
      "SUB_LED_ACCODE": "string",
      "ACTIVITY_CODE": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "DISCOUNTPERCENTAGE": 0,
      "CUSTOMER_ADDRESS": "string",
      "FROM_TOUCH": true,
      "CUSTOMER_CODE": "string",
      "IMPORTINPURCHASE": true,
      "SL_CODE": "string",
      "SL_DESCRIPTION": "string",
      "CNT_ORIGIN": "string",
      "OT_TRANSFER_TIME": "string",
      "FREIGHT_RATE": 0,
      "TDS_PER": 0,
      "TDS_TOPARTY": true,
      "LONDONFIXING_TYPE": 0,
      "LONDONFIXING_RATE": 0,
      "PARTYROUNDOFF": 0,
      "NOTIONAL_PARTY": true,
      "METAL_CONV_CURR": "stri",
      "METAL_CONV_RATE": 0,
      "CHECK_HEDGINGBAL": true,
      "IMPORTINSALES": true,
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "str",
      "AUTOGENREF": "string",
      "VATAMOUNTMakingONLYCC": 0,
      "CALCULATEPARTYVATONMAKINGONLY": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_WASTAGE_AMOUNTCC": 0,
      "PARTYTRANSWISE_DESIGNATEDZONE": true,
      "PARTY_STATE_CODE": "string",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "string",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "string",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "string",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-02-08T12:18:43.101Z",
      "VEHICLE_TYPE": "string",
      "DISPATCH_CITY": "string",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "string",
      "CREDIT_DAYSMTL": 0,
      "VALUE_DATEMTL": "2024-02-08T12:18:43.101Z",
      "PURITYQUALITYREMARKS": "string",
      "DISCOUNT_PERGRM": 0,
      "EXCLUDE_VAT": true,
      "H_AIRWAYBILL": "string",
      "H_BASIS": "string",
      "H_DESTINATION": "string",
      "H_MINER": "string",
      "H_SHIPMENTMODE": "string",
      "H_SHIPPER": "string",
      "HTOTALAMOUNTWITHVAT_CC": 0,
      "HTOTALAMOUNTWITHVAT_FC": 0,
      "HVAT_AMOUNT_CC": 0,
      "HVAT_AMOUNT_FC": 0,
      "INTERNALFIXEDQTY": 0,
      "ITEMROUNDVALUEFC": 0,
      "NEWMID": 0,
      "PARTYROUNDVALUEFC": 0,
      "PARTYTRANSWISE_METALVATONMAKING": true,
      "PLACEOFSUPPLY": "string",
      "POSPRICESFIXED": true,
      "QRCODEIMAGE": "",
      "QRCODEVALUE": "string",
      "SHIPMENTCOMPANY": "string",
      "SHIPMENTPORT": "string",
      "TAX_APPLICABLE": true,
      "TOTAL_WASTAGE_AMOUNTFC": 0,
      "TRANSFER_BRANCH": "string",
      "VATAMOUNTFCROUND": this.goldExchangeForm.value.rndOfAmt,
      "VATAMOUNTFCROUNDCC": this.goldExchangeForm.value.rndOfAmtDes,
      "metalPurchaseDetails": this.goldExchangeDetailsData,
    }

    let Sub: Subscription = this.suntechApi.putDynamicAPI(updateApi, updateData)
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
              this.goldExchangeForm.reset()
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


  

}

