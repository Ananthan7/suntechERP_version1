import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import { RepairMetalPurchaseDetailsComponent } from './repair-metal-purchase-details/repair-metal-purchase-details.component';




@Component({
  selector: 'app-repair-metal-purchase',
  templateUrl: './repair-metal-purchase.component.html',
  styleUrls: ['./repair-metal-purchase.component.scss']
})
export class RepairMetalPurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  selectedTabIndexLineItem=0;
  currentDate = new Date();
  tableData: any[] = []; 
  viewMode: boolean = false;
  @Input() content!: any; 
  branchCode?: String;
  yearMonth?: String; 
  repairmetalpurchasedetail : any[] = [];
  private subscriptions: Subscription[] = [];
  columnheadItemDetails:any[] = ['Sr#','Stock Code','Description','Pcs','Purity','Gross Wt','Stone Wt','Net Wt','Pure Wt','Making Value','Metal Value','Net Value'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.partyCode.setValue(e['ACCOUNT HEAD']);
  }

  partycurCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Party Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Currency<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partycurCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.partycur.setValue(e['Currency']);
  }

  subledgerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 180,
    SEARCH_FIELD: 'SUBLEDGER_CODE',
    SEARCH_HEADING: 'Sub Ledger Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SUBLEDGER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subledgerCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.sub_ledger.setValue(e.SUBLEDGER_CODE);
  }

  allocatefixingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 57,
    SEARCH_FIELD: 'SalesFixingVoucher',
    SEARCH_HEADING: 'Allocate Fixing Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SalesFixingVoucher<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  allocatefixingCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.allocate_fixing.setValue(e['SalesFixingVoucher']);
  }

  nameCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Name Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  nameCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.name.setValue(e.SALESPERSON_CODE);
    this.repairmetalpurchaseForm.controls.namedes.setValue(e.	DESCRIPTION);
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
    this.repairmetalpurchaseForm.controls.country_origin.setValue(e.CODE);
    this.repairmetalpurchaseForm.controls.country_origin_des.setValue(e.DESCRIPTION);

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
    this.repairmetalpurchaseForm.controls.state_code.setValue(e.STATE_CODE);

  }



  repairmetalpurchaseForm: FormGroup = this.formBuilder.group({
    voc_type: [''],
    voc_no: [''],
    Voc_date: [''],
    partyCode: [''],
    partycur: [''],
    partycurrate: [''],
    sub_ledger:[''],
    metal_rate:[''],
    credit_days_LC:[''],
    credit_date_LC:[''],
    credit_days_Mtl:[''],
    credit_date_Mtl:[''],
    dis:[''],
    name:[''],
    namedes:[''],
    Address:[''],
    allocate_fixing:[''],
    fixed_pure:[''],
    vat_mode :[''],
    declaration_no :[''],
    declaration_date :[''],
    remarks :[''],
    country_origin :[''],
    country_origin_des :[''],
    packet_no :[''],
    expiry_date :[''],
    no :[''],
    state_code :[''],
    hedging_bal :[''],
    trans_type :[''],
    document :[''],
    DRG_VOC_NO :[''],
    Customer :[''],
    Navigation  :[''],
    stamp_Amt_FC :[''],
    stamp_party_Amt :[''],
    stamp_Amt_CC :[''],
    input_VAT :[''],
    rcm_VAT:[''],
    net_amount_fc :[''],
    net_amount_cc :[''],
    total_tax_fc :[''],
    total_tax_cc :[''],
    round_Off_with :[''],
    round_to :[''],
    other_amount_tax :[''],
    other_amount :[''],
    party_round_Off :[''],
    party_amount_FC :[''],
    party_amount_LC :[''],
    total_TDS :[''],
    total_TCS :[''],
    gross_total_fc :[''],
    gross_total_cc :[''],
  });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  adddata(data?: any) {
    console.log(data,'data to child')
    const modalRef: NgbModalRef = this.modalService.open(RepairMetalPurchaseDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    console.log(data, 'data')
    modalRef.componentInstance.content = data
    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from child:', postData);
        this.repairmetalpurchasedetail.push(postData);
      }
    });

   
   
}

formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.repairmetalpurchaseForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'MetalPurchase/InsertMetalPurchase'
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "VOCTYPE": this.repairmetalpurchaseForm.value.voc_type,
    "VOCNO": this.repairmetalpurchaseForm.value.voc_no,
    "VOCDATE": this.repairmetalpurchaseForm.value.Voc_date,
    "YEARMONTH": this.yearMonth,
    "PARTYCODE": this.repairmetalpurchaseForm.value.partyCode,
    "PARTY_CURRENCY": this.repairmetalpurchaseForm.value.partycur,
    "PARTY_CURR_RATE": this.repairmetalpurchaseForm.value.partycurrate,
    "ITEM_CURRENCY": "stri",
    "ITEM_CURR_RATE": 0,
    "VALUE_DATE": "2024-03-23T04:51:34.662Z",
    "SALESPERSON_CODE": this.repairmetalpurchaseForm.value.name,
    "RATE_TYPE": "string",
    "METAL_RATE": this.repairmetalpurchaseForm.value.metal_rate,
    "FIXED": this.repairmetalpurchaseForm.value.fixed_pure,
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
    "NET_VALUE_FC": 0,
    "NET_VALUE_CC": 0,
    "ADDL_VALUE_FC": 0,
    "ADDL_VALUE_CC": 0,
    "GROSS_VALUE_FC":this.repairmetalpurchaseForm.value.gross_total_fc,
    "GROSS_VALUE_CC": this.repairmetalpurchaseForm.value.gross_total_cc,
    "REMARKS": this.repairmetalpurchaseForm.value.remarks,
    "SYSTEM_DATE": "2024-03-23T04:51:34.662Z",
    "FLAG_EDIT_ALLOW": "s",
    "TOTAL_OZWT": 0,
    "ROUND_VALUE_CC": 0,
    "NAVSEQNO": 0,
    "SUPINVNO": "string",
    "SUPINVDATE": "2024-03-23T04:51:34.662Z",
    "FLAG_UPDATED": "s",
    "FLAG_INPROCESS": "s",
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
    "SALESPERSON_NAME": this.repairmetalpurchaseForm.value.namedes,
    "TOTAL_WASTQTY": 0,
    "TOTAL_AMT_FC": 0,
    "PARTYADDRESS": this.repairmetalpurchaseForm.value.Address,
    "CREDITDAY": this.repairmetalpurchaseForm.value.credit_days_LC,
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
    "HLOCTYPE_CODE": "string",
    "HTUSERNAME": "string",
    "MHIDCATEGORY": "string",
    "MHCUSTIDNO": "string",
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
    "CUSTOMER_MOBILE": "string",
    "CUSTOMER_EMAIL": "string",
    "POSCUSTIDNO": "string",
    "POPCUSTCODE": "string",
    "GST_GROUP": "s",
    "FIXING_PROCESS": true,
    "TOTAL_ADDL_TAXFC": this.repairmetalpurchaseForm.value.total_tax_fc,
    "TOTAL_ADDL_TAXCC": this.repairmetalpurchaseForm.value.total_tax_cc,
    "DIRECTFIXINGREF": "string",
    "INTERNALUNFIX": true,
    "REF_JOBCREATED": true,
    "EXCLUDEVAT": true,
    "TEST_BRANCH_CODE": "string",
    "TEST_VOCTYPE": "str",
    "TEST_VOCNO": 0,
    "TEST_YEARMONTH": "string",
    "TDS_CODE": this.repairmetalpurchaseForm.value.total_TDS,
    "TDS_APPLICABLE": true,
    "TDS_TOTALFC": 0,
    "TDS_TOTALCC": 0,
    "H_DECLARATIONNO": this.repairmetalpurchaseForm.value.declaration_no,
    "H_ORIGINCOUNTRY": this.repairmetalpurchaseForm.value.country_origin_des,
    "H_DECLARATIONDATE": this.repairmetalpurchaseForm.value.declaration_date,
    "H_PACKETNO": this.repairmetalpurchaseForm.value.packet_no,
    "SHIPPER_CODE": "string",
    "SHIPPER_NAME": "string",
    "ORIGIN_COUNTRY": this.repairmetalpurchaseForm.value.country_origin,
    "DESTINATION_STATE": "string",
    "DESTINATION_COUNTRY": "string",
    "MINING_COMP_CODE": "string",
    "MINING_COMP_NAME": "string",
    "AIRWAY_BILLNO": "string",
    "AIRWAY_BILLDATE": "2024-03-23T04:51:34.662Z",
    "AIRWAY_WEIGHT": 0,
    "ARIVAL_DATE": "2024-03-23T04:51:34.662Z",
    "CLEARENCE_DATE": "2024-03-23T04:51:34.662Z",
    "BOE_FILLINGDATE": "2024-03-23T04:51:34.662Z",
    "BOE_NO": "string",
    "PO_IMP": 0,
    "SILVER_RATE_TYPE": "string",
    "SILVER_RATE": 0,
    "TOTAL_SILVERWT": 0,
    "TOTAL_SILVERVALUE_FC": 0,
    "TOTAL_SILVERVALUE_CC": 0,
    "PO_REFNO": "string",
    "MINING_COMP_REFNO": "string",
    "PARTY_ROUNDOFF": this.repairmetalpurchaseForm.value.party_round_Off,
    "TRANSPORTER_CODE": "string",
    "VEHICLE_NO": "string",
    "LR_NO": "string",
    "AIR_BILL_NO": "string",
    "SHIPCODE": "string",
    "SHIPDESC": "string",
    "STAMPCHARGE": true,
    "TOTSTAMP_AMTFC": this.repairmetalpurchaseForm.value.stamp_Amt_FC,
    "TOTSTAMP_AMTCC":this.repairmetalpurchaseForm.value.stamp_Amt_CC,
    "TOTSTAMP_PARTYAMTFC": this.repairmetalpurchaseForm.value.stamp_party_Amt,
    "REFPURIMPORT": "string",
    "BOE_EXPIRY_DATE": this.repairmetalpurchaseForm.value.expiry_date,
    "H_BILLOFENTRYREF": "string",
    "SUB_LED_ACCODE": this.repairmetalpurchaseForm.value.sub_ledger,
    "ACTIVITY_CODE": "string",
    "TCS_ACCODE": this.repairmetalpurchaseForm.value.total_TCS,
    "TCS_AMOUNT": 0,
    "TCS_AMOUNTCC": 0,
    "TCS_APPLICABLE": true,
    "DISCOUNTPERCENTAGE": 0,
    "CUSTOMER_ADDRESS": this.repairmetalpurchaseForm.value.Navigation,
    "FROM_TOUCH": true,
    "CUSTOMER_CODE": this.repairmetalpurchaseForm.value.Customer,
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
    "PARTY_STATE_CODE": "st",
    "SHIP_ACCODE": "string",
    "SHIP_STATE_CODE": "st",
    "DISPATCH_NAME": "string",
    "DISPATCH_ADDRESS": "string",
    "DISPATCH_STATE_CODE": "st",
    "TRANSPORTER_ID": "string",
    "TRANSPORTER_MODE": "s",
    "TRANSPORT_DISTANCE": 0,
    "TRANSPORT_DATE": "2024-03-23T04:51:34.662Z",
    "VEHICLE_TYPE": "s",
    "DISPATCH_CITY": "string",
    "DISPATCH_ZIPCODE": 0,
    "EWAY_TRANS_TYPE": "s",
    "CREDIT_DAYSMTL": this.repairmetalpurchaseForm.value.credit_days_Mtl,
    "VALUE_DATEMTL": this.repairmetalpurchaseForm.value.credit_date_Mtl,
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
    "PARTYROUNDVALUEFC": this.repairmetalpurchaseForm.value.round_to,
    "PARTYTRANSWISE_METALVATONMAKING": true,
    "PLACEOFSUPPLY": "string",
    "POSPRICESFIXED": true,
    "QRCODEIMAGE": "string",
    "QRCODEVALUE": "string",
    "SHIPMENTCOMPANY": "string",
    "SHIPMENTPORT": "string",
    "TAX_APPLICABLE": true,
    "TOTAL_WASTAGE_AMOUNTFC": 0,
    "TRANSFER_BRANCH": "string",
    "VATAMOUNTFCROUND": 0,
    "VATAMOUNTFCROUNDCC": 0,
    "REF_CODE": "string",
    "MetalPurchaseDetails": this.repairmetalpurchasedetail,
    "MetalPurchaseGst": [
      {
        "UNIQUEID": 0,
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "stri",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "STOCK_CODE": "string",
        "GST_CODE": "string",
        "GST_TYPE": "string",
        "SRNO": 0,
        "CGST_ACCODE": "string",
        "SGST_ACCODE": "string",
        "IGST_ACCODE": "string",
        "CGST_CTL_ACCODE": "string",
        "SGST_CTL_ACCODE": "string",
        "IGST_CTL_ACCODE": "string",
        "CGST_PER": 0,
        "SGST_PER": 0,
        "IGST_PER": 0,
        "CGST_AMOUNTFC": 0,
        "CGST_AMOUNTLC": 0,
        "SGST_AMOUNTFC": 0,
        "SGST_AMOUNTLC": 0,
        "IGST_AMOUNTFC": 0,
        "IGST_AMOUNTLC": 0,
        "TOTAL_GST_AMOUNTFC": 0,
        "TOTAL_GST_AMOUNTLC": 0,
        "TOTAL_GST_PER": 0,
        "BATCHID": 0
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
              this.repairmetalpurchaseForm.reset()
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
  if (this.repairmetalpurchaseForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'Repair/UpdateRepair/'+ this.branchCode + this.repairmetalpurchaseForm.value.voctype + this.repairmetalpurchaseForm.value.vocno + this.yearMonth
  let postData = {
    "MID": 0,
    "BRANCH_CODE": "string",
    "VOCTYPE": "str",
    "VOCNO": 0,
    "VOCDATE": "2024-03-23T04:51:34.662Z",
    "YEARMONTH": "string",
    "PARTYCODE": "string",
    "PARTY_CURRENCY": "stri",
    "PARTY_CURR_RATE": 0,
    "ITEM_CURRENCY": "stri",
    "ITEM_CURR_RATE": 0,
    "VALUE_DATE": "2024-03-23T04:51:34.662Z",
    "SALESPERSON_CODE": "string",
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
    "PARTY_VALUE_FC": 0,
    "PARTY_VALUE_CC": 0,
    "NET_VALUE_FC": 0,
    "NET_VALUE_CC": 0,
    "ADDL_VALUE_FC": 0,
    "ADDL_VALUE_CC": 0,
    "GROSS_VALUE_FC": 0,
    "GROSS_VALUE_CC": 0,
    "REMARKS": "string",
    "SYSTEM_DATE": "2024-03-23T04:51:34.662Z",
    "FLAG_EDIT_ALLOW": "s",
    "TOTAL_OZWT": 0,
    "ROUND_VALUE_CC": 0,
    "NAVSEQNO": 0,
    "SUPINVNO": "string",
    "SUPINVDATE": "2024-03-23T04:51:34.662Z",
    "FLAG_UPDATED": "s",
    "FLAG_INPROCESS": "s",
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
    "PARTYADDRESS": "string",
    "CREDITDAY": 0,
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
    "HLOCTYPE_CODE": "string",
    "HTUSERNAME": "string",
    "MHIDCATEGORY": "string",
    "MHCUSTIDNO": "string",
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
    "CUSTOMER_MOBILE": "string",
    "CUSTOMER_EMAIL": "string",
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
    "H_DECLARATIONDATE": "2024-03-23T04:51:34.662Z",
    "H_PACKETNO": 0,
    "SHIPPER_CODE": "string",
    "SHIPPER_NAME": "string",
    "ORIGIN_COUNTRY": "string",
    "DESTINATION_STATE": "string",
    "DESTINATION_COUNTRY": "string",
    "MINING_COMP_CODE": "string",
    "MINING_COMP_NAME": "string",
    "AIRWAY_BILLNO": "string",
    "AIRWAY_BILLDATE": "2024-03-23T04:51:34.662Z",
    "AIRWAY_WEIGHT": 0,
    "ARIVAL_DATE": "2024-03-23T04:51:34.662Z",
    "CLEARENCE_DATE": "2024-03-23T04:51:34.662Z",
    "BOE_FILLINGDATE": "2024-03-23T04:51:34.662Z",
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
    "TOTSTAMP_AMTFC": 0,
    "TOTSTAMP_AMTCC": 0,
    "TOTSTAMP_PARTYAMTFC": 0,
    "REFPURIMPORT": "string",
    "BOE_EXPIRY_DATE": "2024-03-23T04:51:34.662Z",
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
    "PARTY_STATE_CODE": "st",
    "SHIP_ACCODE": "string",
    "SHIP_STATE_CODE": "st",
    "DISPATCH_NAME": "string",
    "DISPATCH_ADDRESS": "string",
    "DISPATCH_STATE_CODE": "st",
    "TRANSPORTER_ID": "string",
    "TRANSPORTER_MODE": "s",
    "TRANSPORT_DISTANCE": 0,
    "TRANSPORT_DATE": "2024-03-23T04:51:34.662Z",
    "VEHICLE_TYPE": "s",
    "DISPATCH_CITY": "string",
    "DISPATCH_ZIPCODE": 0,
    "EWAY_TRANS_TYPE": "s",
    "CREDIT_DAYSMTL": 0,
    "VALUE_DATEMTL": "2024-03-23T04:51:34.662Z",
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
    "VATAMOUNTFCROUND": 0,
    "VATAMOUNTFCROUNDCC": 0,
    "REF_CODE": "string",
    "MetalPurchaseDetails": [
      {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": "s",
        "STOCK_CODE": "string",
        "PCS": 0,
        "GROSSWT": 0,
        "STONEWT": 0,
        "NETWT": 0,
        "PURITY": 0,
        "PUREWT": 0,
        "CHARGABLEWT": 0,
        "MKG_RATEFC": 0,
        "MKG_RATECC": 0,
        "MKGVALUEFC": 0,
        "MKGVALUECC": 0,
        "RATE_TYPE": "string",
        "METAL_RATE": 0,
        "METAL_RATE_GMSFC": 0,
        "METAL_RATE_GMSCC": 0,
        "METALVALUEFC": 0,
        "METALVALUECC": 0,
        "STONE_RATEFC": 0,
        "STONE_RATECC": 0,
        "STONEVALUEFC": 0,
        "STONEVALUECC": 0,
        "NETVALUEFC": 0,
        "NETVALUECC": 0,
        "PUDIFF": 0,
        "STONEDIFF": 0,
        "PONO": 0,
        "LOCTYPE_CODE": "string",
        "OZWT": 0,
        "SUPPLIER": "string",
        "BATCHSRNO": 0,
        "STOCK_DOCDESC": "string",
        "BAGNO": "string",
        "BAGREMARKS": "string",
        "WASTAGEPER": 0,
        "WASTAGEQTY": 0,
        "WASTAGEAMOUNTFC": 0,
        "WASTAGEAMOUNTCC": 0,
        "MKGMTLNETRATE": 0,
        "MCLENGTH": 0,
        "MCUNIT": 0,
        "SORDER_REF": "string",
        "BARCODEDQTY": 0,
        "RUBY_WT": 0,
        "RUBY_RATE": 0,
        "RUBY_AMOUNTFC": 0,
        "RUBY_AMOUNTCC": 0,
        "EMERALD_WT": 0,
        "EMERALD_RATE": 0,
        "EMERALD_AMOUNTFC": 0,
        "EMERALD_AMOUNTCC": 0,
        "SAPPHIRE_WT": 0,
        "SAPPHIRE_RATE": 0,
        "SAPPHIRE_AMOUNTFC": 0,
        "SAPPHIRE_AMOUNTCC": 0,
        "ZIRCON_WT": 0,
        "ZIRCON_RATE": 0,
        "ZIRCON_AMOUNTFC": 0,
        "ZIRCON_AMOUNTCC": 0,
        "COLOR_STONE_WT": 0,
        "COLOR_STONE_RATE": 0,
        "COLOR_STONE_AMOUNTFC": 0,
        "COLOR_STONE_AMOUNTCC": 0,
        "DISCOUNTWT": 0,
        "DISCOUNTPUWT": 0,
        "REPITEMCODE": "string",
        "MTL_SIZE": "string",
        "MTL_COLOR": "string",
        "MTL_DESIGN": "string",
        "BARCODE": "string",
        "ORDER_STATUS": true,
        "PORDER_REF": "string",
        "BARCODEDPCS": 0,
        "SUPPLIERDISC": "string",
        "DT_BRANCH_CODE": "string",
        "DT_VOCNO": 0,
        "DT_VOCTYPE": "str",
        "DT_YEARMONTH": "string",
        "BASE_CONV_RATE": 0,
        "WASTAGE_PURITY": 0,
        "PUDIFF_AMTLC": 0,
        "PUDIFF_AMTFC": 0,
        "TAX_AMOUNTFC": 0,
        "TAX_AMOUNTCC": 0,
        "TAX_P": 0,
        "LOT_NO": "string",
        "BAR_NO": "string",
        "TICKET_NO": "string",
        "PENALTY": 0,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTCC": 0,
        "CGST_PER": 0,
        "CGST_AMOUNTFC": 0,
        "CGST_AMOUNTCC": 0,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": 0,
        "SGST_AMOUNTCC": 0,
        "IGST_PER": 0,
        "IGST_AMOUNTFC": 0,
        "IGST_AMOUNTCC": 0,
        "CGST_ACCODE": "string",
        "SGST_ACCODE": "string",
        "IGST_ACCODE": "string",
        "UNITWT": 0,
        "CGST_CTRLACCODE": "string",
        "SGST_CTRLACCODE": "string",
        "IGST_CTRLACCODE": "string",
        "HSN_CODE": "string",
        "GST_ROUNDOFFFC": 0,
        "GST_ROUNDOFFCC": 0,
        "ROUNDOFF_ACCODE": "string",
        "OLD_GOLD_TYPE": "string",
        "OUTSIDEGOLD": true,
        "KUNDAN_PCS": 0,
        "KUNDAN_CARAT": 0,
        "KUNDAN_RATEFC": 0,
        "KUNDAN_RATECC": 0,
        "KUNDAN_WEIGHT": 0,
        "KUNDANVALUEFC": 0,
        "KUNDANVALUECC": 0,
        "KUNDAN_UNIT": 0,
        "PREMIUM_CURRENCY": "string",
        "PREMIUM_CURR_RATE": 0,
        "PREMIUM_RATE_TYPE": "string",
        "PREMIUM_METAL_RATEFC": 0,
        "PREMIUM_METAL_RATECC": 0,
        "PREMIUM_TOTALAMOUNTCC": 0,
        "PREMIUM_TOTALAMOUNTFC": 0,
        "TDS_CODE": "string",
        "TDS_PER": 0,
        "TDS_TOTALFC": 0,
        "TDS_TOTALCC": 0,
        "DECLARATIONNO": "string",
        "REEXPORTYN": 0,
        "SILVER_PURITY": 0,
        "SILVER_PUREWT": 0,
        "SILVER_RATE_TYPE": "string",
        "SILVER_RATE": 0,
        "SILVER_RATEFC": 0,
        "SILVER_RATECC": 0,
        "SILVER_VALUEFC": 0,
        "SILVER_VALUECC": 0,
        "OZGOLD_PUREWT": 0,
        "OZSILVER_PUREWT": 0,
        "CONV_FACTOR_OZ": 0,
        "PUR_REF": "string",
        "BATCHID": 0,
        "STAMPCHARGE_RATEFC": 0,
        "STAMPCHARGE_RATECC": 0,
        "STAMPCHARGE_AMTFC": 0,
        "STAMPCHARGE_AMTCC": 0,
        "STAMPCHARGE": true,
        "ACTUALGROSSWT": 0,
        "ACTUALPURITY": 0,
        "MELTINGLOSS": 0,
        "DRAFTIMPORTFLG": true,
        "FIXMID": 0,
        "FIXVOCTYPE": "str",
        "FIXVOCNO": 0,
        "FIXBRANCH": "string",
        "FIXYEARMONTH": "string",
        "FIXSRNO": 0,
        "FIX_STOCKCODE": "string",
        "IMPORT_REF": "string",
        "OT_TRANSFER_TIME": "string",
        "PRICE1CODE": "string",
        "PRICE2CODE": "string",
        "PRICE3CODE": "string",
        "PRICE4CODE": "string",
        "PRICE5CODE": "string",
        "PRICE1_VALUECC": 0,
        "PRICE1_VALUEFC": 0,
        "PRICE2_VALUECC": 0,
        "PRICE2_VALUEFC": 0,
        "PRICE3_VALUECC": 0,
        "PRICE3_VALUEFC": 0,
        "PRICE4_VALUECC": 0,
        "PRICE4_VALUEFC": 0,
        "PRICE5_VALUECC": 0,
        "PRICE5_VALUEFC": 0,
        "MKGPREMIUMACCODE": "string",
        "DETLINEREMARKS": "string",
        "MUD_WT": 0,
        "JAWAHARAYN": 0,
        "RESALERECYCLE": 0,
        "CASHEXCHANGE": 0,
        "VATAMOUNTMETALONLYCC": 0,
        "VATAMOUNTMETALONLY": 0,
        "GST_CODE": "string",
        "HALLMARKING": "string",
        "DISCAMTFC": 0,
        "DISCAMTCC": 0,
        "DISCPER": 0,
        "MARGIN_PER": 0,
        "MARGIN_AMTFC": 0,
        "MARGIN_AMTCC": 0,
        "Picture_Path": "string",
        "ORIGINAL_COUNTRY": "string",
        "DET_KPNO": "string",
        "SERVICE_ACCODE": "string",
        "taxcode": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "SHAPE": "string",
        "SIEVE": "string",
        "KPNUMBER": "string",
        "PURITYMAIN": 0,
        "C1_CATEGORY": "string",
        "C2_CATEGORY": "string",
        "C3_CATEGORY": "string",
        "C4_CATEGORY": "string",
        "C5_CATEGORY": "string",
        "C6_CATEGORY": "string",
        "NEWUNIQUEID": 0,
        "VATCODE": "string",
        "HSNCODE": "string",
        "VAT_PER": 0,
        "VAT_AMOUNTCC": 0,
        "VAT_AMOUNTFC": 0,
        "TOTALAMOUNTWITHVATCC": 0,
        "TOTALAMOUNTWITHVATFC": 0,
        "DETAILPCS": 0,
        "D_REMARKS": "string",
        "DONE_REEXPORTYN": true,
        "DUSTWT": 0,
        "MDESIGN_CODE": "string",
        "SALES_REF": "string",
        "SAMEBARCODEPURCHASE": 0,
        "SLIVERPURITYPER": 0,
        "TRANSACTIONATTRIBUTE": "string"
      }
    ],
    "MetalPurchaseGst": [
      {
        "UNIQUEID": 0,
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "stri",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "STOCK_CODE": "string",
        "GST_CODE": "string",
        "GST_TYPE": "string",
        "SRNO": 0,
        "CGST_ACCODE": "string",
        "SGST_ACCODE": "string",
        "IGST_ACCODE": "string",
        "CGST_CTL_ACCODE": "string",
        "SGST_CTL_ACCODE": "string",
        "IGST_CTL_ACCODE": "string",
        "CGST_PER": 0,
        "SGST_PER": 0,
        "IGST_PER": 0,
        "CGST_AMOUNTFC": 0,
        "CGST_AMOUNTLC": 0,
        "SGST_AMOUNTFC": 0,
        "SGST_AMOUNTLC": 0,
        "IGST_AMOUNTFC": 0,
        "IGST_AMOUNTLC": 0,
        "TOTAL_GST_AMOUNTFC": 0,
        "TOTAL_GST_AMOUNTLC": 0,
        "TOTAL_GST_PER": 0,
        "BATCHID": 0
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
              this.repairmetalpurchaseForm.reset()
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
  if (!this.content.VOCTYPE) {
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
      let API = 'Repair/DeleteRepair/' + this.branchCode + this.repairmetalpurchaseForm.value.voctype + this.repairmetalpurchaseForm.value.vocno + this.yearMonth
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
                  this.repairmetalpurchaseForm.reset()
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
                  this.repairmetalpurchaseForm.reset()
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

ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}

}
