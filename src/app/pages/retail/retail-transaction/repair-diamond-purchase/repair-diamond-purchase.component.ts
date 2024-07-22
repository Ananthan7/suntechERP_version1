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
import { RepairDiamondPurchaseDetailComponent } from './repair-diamond-purchase-detail/repair-diamond-purchase-detail.component';


@Component({
  selector: 'app-repair-diamond-purchase',
  templateUrl: './repair-diamond-purchase.component.html',
  styleUrls: ['./repair-diamond-purchase.component.scss']
})
export class RepairDiamondPurchaseComponent implements OnInit {
  selectedTabIndex = 0;
  selectedTabIndexLineItem = 0;
  currentDate = new Date();
  tableData: any[] = [];
  viewMode: boolean = false;
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  columnheadItemDetails: any[] = ['Sr#', 'Stock Code', 'Description', 'Pcs', 'Purity', 'Gross Wt', 'Stone Wt', 'Net Wt', 'Pure Wt', 'Making Value', 'Metal Value', 'Net Value'];
  // setAllInitialValues: any;
  branchCode?: String;
  yearMonth?: String;
  repairDiaPurchaseDetailsData: any[] = [];

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
    this.generateVocNo();
    this.repairdiapurchaseForm.controls.Voc_date.setValue(this.currentDate)
    this.repairdiapurchaseForm.controls.voc_type.setValue(this.comService.getqueryParamVocType())
    if (this.content.FLAG == "EDIT" || this.content.FLAG == "VIEW") {
      this.getrepairpurchasedetails(this.content);
    }
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.branchCode
      }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.repairdiapurchaseForm.controls.voc_no.setValue(res.newvocno);
        }
      });
  }

  getrepairpurchasedetails(e: any) {
    console.log(e);

    const dateParts = this.content.VOCDATE.split('-');
    const formattedDate = new Date(
      parseInt(dateParts[2]),
      parseInt(dateParts[1]) - 1,
      parseInt(dateParts[0])
    );
    console.log(formattedDate);

    const DECLARATION_DATE = this.content.H_DECLARATIONDATE.split('-');
    const formatted_declaration_date = new Date(
      parseInt(DECLARATION_DATE[2]),
      parseInt(DECLARATION_DATE[1]) - 1,
      parseInt(DECLARATION_DATE[0])
    );
    console.log(formatted_declaration_date);

    const value_date = this.content.VALUE_DATE.split('-');
    const formatted_value_date = new Date(
      parseInt(value_date[2]),
      parseInt(value_date[1]) - 1,
      parseInt(value_date[0])
    );
    console.log(formatted_value_date);

    this.repairdiapurchaseForm.controls.voc_no.setValue(e.VOCNO);
    this.repairdiapurchaseForm.controls.voc_type.setValue(e.VOCTYPE);
    this.repairdiapurchaseForm.controls.Voc_date.setValue(formattedDate);
    this.repairdiapurchaseForm.controls.partyCode.setValue(e.PARTYCODE);
    this.repairdiapurchaseForm.controls.partycur.setValue(e.PARTY_CURRENCY);
    this.repairdiapurchaseForm.controls.partycurrate.setValue(e.PARTY_CURR_RATE);
    this.repairdiapurchaseForm.controls.name.setValue(e.SALESPERSON_CODE);
    this.repairdiapurchaseForm.controls.remarks.setValue(e.REMARKS);
    this.repairdiapurchaseForm.controls.party_amount_FC.setValue(e.PARTY_VALUE_FC);
    this.repairdiapurchaseForm.controls.party_amount_LC.setValue(e.PARTY_VALUE_CC);
    this.repairdiapurchaseForm.controls.net_amount_fc.setValue(e.NET_VALUE_FC);
    this.repairdiapurchaseForm.controls.net_amount_cc.setValue(e.NET_VALUE_CC);
    this.repairdiapurchaseForm.controls.gross_total_fc.setValue(e.GROSS_VALUE_FC);
    this.repairdiapurchaseForm.controls.gross_total_cc.setValue(e.GROSS_VALUE_C);
    this.repairdiapurchaseForm.controls.Address.setValue(e.PARTY_ADDRESS);
    this.repairdiapurchaseForm.controls.namedes.setValue(e.SALESPERSON_NAME);
    this.repairdiapurchaseForm.controls.credit_days_LC.setValue(e.CR_DAYS);
    this.repairdiapurchaseForm.controls.net_amount_fc.setValue(e.FIXED);
    this.repairdiapurchaseForm.controls.state_code.setValue(e.GST_STATE_CODE);
    this.repairdiapurchaseForm.controls.no.setValue(e.GST_NUMBER);
    this.repairdiapurchaseForm.controls.total_tax_fc.setValue(e.TOTAL_ADDL_TAXFC);
    this.repairdiapurchaseForm.controls.total_tax_cc.setValue(e.TOTAL_ADDL_TAXCC);
    this.repairdiapurchaseForm.controls.input_VAT.setValue(e.VAT_ADJUSTVALUEC);
    this.repairdiapurchaseForm.controls.rcm_VAT.setValue(e.VAT_ADJUSTVALUEFC);
    this.repairdiapurchaseForm.controls.declaration_no.setValue(e.H_DECLARATIONNO);
    this.repairdiapurchaseForm.controls.country_origin.setValue(e.H_ORIGINCOUNTRY);
    this.repairdiapurchaseForm.controls.packet_no.setValue(e.H_PACKETNO);
    this.repairdiapurchaseForm.controls.declaration_date.setValue(formatted_declaration_date);
    this.repairdiapurchaseForm.controls.expiry_date.setValue(formatted_value_date);
    this.repairdiapurchaseForm.controls.metal_rate.setValue(e.METAL_RATE);
    this.repairdiapurchaseForm.controls.year.setValue(e.YEARMONTH);
    this.repairdiapurchaseForm.controls.total_TDS.setValue(e.TDS_CODE);
    this.repairdiapurchaseForm.controls.Customer.setValue(e.CUSTOMER_NAME);
    this.repairdiapurchaseForm.controls.Navigation.setValue(e.CUSTOMER_ADDRESS);
    this.repairdiapurchaseForm.controls.sub_ledger.setValue(e.SUB_LED_ACCODE);









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
    this.repairdiapurchaseForm.controls.partyCode.setValue(e['ACCODE']);
    // this.repairdiapurchaseForm.controls.partyCode.setValue(e['ACCOUNT HEAD']);
  }

  partycurCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    WHERECONDITION: "CURRENCY_CODE <>''",
    SEARCH_FIELD: "Currency",
    SEARCH_VALUE: "",
    SEARCH_HEADING: "'Party Currency Code'"
  }
  partycurCodeSelected(e: any) {
    console.log(e);
    this.repairdiapurchaseForm.controls.partycur.setValue(e['CURRENCY_CODE']);
    this.repairdiapurchaseForm.controls.partycurrate.setValue(e['CONV_RATE']);

  }

  subledgerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 180,
    WHERECONDITION: "@SLACCODE = '' ",
    SEARCH_FIELD: "SUBLEDGER_CODE",
    SEARCH_VALUE: "",
    SEARCH_HEADING: "Sub Ledger Code"
  }
  subledgerCodeSelected(e: any) {
    console.log(e);
    this.repairdiapurchaseForm.controls.sub_ledger.setValue(e.SUBLEDGER_CODE);
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
    this.repairdiapurchaseForm.controls.allocate_fixing.setValue(e['SalesFixingVoucher']);
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
    this.repairdiapurchaseForm.controls.name.setValue(e.SALESPERSON_CODE);
    this.repairdiapurchaseForm.controls.namedes.setValue(e.DESCRIPTION);
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
    this.repairdiapurchaseForm.controls.country_origin.setValue(e.CODE);
    this.repairdiapurchaseForm.controls.country_origin_des.setValue(e.DESCRIPTION);

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
    this.repairdiapurchaseForm.controls.state_code.setValue(e.STATE_CODE);

  }



  repairdiapurchaseForm: FormGroup = this.formBuilder.group({
    voc_type: [''],
    voc_no: [''],
    Voc_date: [''],
    partyCode: [''],
    partycur: [''],
    partycurrate: [''],
    sub_ledger: [''],
    metal_rate: [''],
    credit_days_LC: [''],
    credit_days_Mtl: [''],
    dis: [''],
    name: [''],
    namedes: [''],
    Address: [''],
    allocate_fixing: [''],
    fixed_pure: [''],
    vat_mode: [''],
    declaration_no: [''],
    declaration_date: [''],
    remarks: [''],
    country_origin: [''],
    country_origin_des: [''],
    packet_no: [''],
    expiry_date: [''],
    no: [''],
    state_code: [''],
    hedging_bal: [''],
    trans_type: [''],
    document: [''],
    DRG_VOC_NO: [''],
    Customer: [''],
    Navigation: [''],
    stamp_Amt_FC: [''],
    stamp_party_Amt: [''],
    stamp_Amt_CC: [''],
    input_VAT: [''],
    rcm_VAT: [''],
    net_amount_fc: [''],
    net_amount_cc: [''],
    total_tax_fc: [''],
    total_tax_cc: [''],
    round_Off_with: [''],
    round_to: [''],
    other_amount_tax: [''],
    other_amount: [''],
    party_round_Off: [''],
    party_amount_FC: [''],
    party_amount_LC: [''],
    total_TDS: [''],
    total_TCS: [''],
    gross_total_fc: [''],
    gross_total_cc: [''],

  });




  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  adddata() {



  }



  adddatas() {


  }

  removedata() {
    this.tableData.pop();
  }


  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(RepairDiamondPurchaseDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      if (postData) {

        console.log('Data from modal:', postData);
        if (postData?.isUpdate) {
          const preItemIndex = this.repairDiaPurchaseDetailsData.findIndex((data: any) =>
            data.SRNO.toString() == postData.SRNO.toString()
          );
          this.repairDiaPurchaseDetailsData[preItemIndex] = postData;

        } else {
          this.repairDiaPurchaseDetailsData.push(postData);
        }
        this.repairDiaPurchaseDetailsData.forEach((data, index) => data.SRNO = index + 1);
      }
    });
  }


  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      return
    }
    if (this.repairdiapurchaseForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'DiamondPurchase/InsertDiamondPurchase'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.repairdiapurchaseForm.value.voc_type,
      "VOCNO": this.repairdiapurchaseForm.value.voc_no || 0,
      "VOCDATE": this.repairdiapurchaseForm.value.Voc_date,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.repairdiapurchaseForm.value.partyCode,
      "PARTY_CURRENCY": this.repairdiapurchaseForm.value.partycur,
      "PARTY_CURR_RATE": this.repairdiapurchaseForm.value.partycurrate,
      "ITEM_CURRENCY": "stri",
      "ITEM_CURR_RATE": 0,
      "VALUE_DATE": this.repairdiapurchaseForm.value.expiry_date,
      "SALESPERSON_CODE": this.repairdiapurchaseForm.value.name,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": this.repairdiapurchaseForm.value.party_amount_FC,
      "PARTY_VALUE_CC": this.repairdiapurchaseForm.value.party_amount_LC,
      "NET_VALUE_FC": this.repairdiapurchaseForm.value.net_amount_fc,
      "NET_VALUE_CC": this.repairdiapurchaseForm.value.net_amount_cc,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": this.repairdiapurchaseForm.value.gross_total_fc,
      "GROSS_VALUE_CC": this.repairdiapurchaseForm.value.gross_total_cc,
      "REMARKS": this.repairdiapurchaseForm.value.remarks,
      "SYSTEM_DATE": new Date(),
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": new Date(),
      "SALESORDERREF": "string",
      "HHACCOUNT_HEAD": "string",
      "OUSTATUSNEW": 0,
      "D2DTRANSFER": "s",
      "TRANS_CODES": "string",
      "PARTY_ADDRESS": this.repairdiapurchaseForm.value.Address,
      "TOTAMOUNT": 0,
      "RNDNETAMOUNT": 0,
      "CR_DAYS": this.repairdiapurchaseForm.value.credit_days_LC,
      "AUTOPOSTING": true,
      "BRANCH_NAME": "string",
      "SALESPERSON_NAME": this.repairdiapurchaseForm.value.namedes,
      "POSTDATE": "string",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "MINE_REF": "string",
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "PARTNER_CODE": "string",
      "FIXED": this.repairdiapurchaseForm.value.net_amount_fc,
      "RATE_TYPE": "string",
      "METAL_RATE": this.repairdiapurchaseForm.value.metal_rate,
      "PRINT_COUNT": 0,
      "DOC_REF": "string",
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.repairdiapurchaseForm.value.state_code,
      "GST_NUMBER": this.repairdiapurchaseForm.value.no,
      "GST_TYPE": "IGST",//stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "AUTOENTRYFLAG": true,
      "GST_GROUP": "s",
      "TOTAL_ADDL_TAXFC": this.repairdiapurchaseForm.value.total_tax_fc,
      "TOTAL_ADDL_TAXCC": this.repairdiapurchaseForm.value.total_tax_cc,
      "REGION": "string",
      "DELIVERY_DATE": new Date(), //"2024-03-21T10:29:43.637Z",
      "VAT_ADJUSTVALUECC": this.repairdiapurchaseForm.value.input_VAT,
      "VAT_ADJUSTVALUEFC": this.repairdiapurchaseForm.value.rcm_VAT,
      "IMPORTINPURCHASE": true,
      "EXCLUDE_VAT": true,
      "MASTERMETALRATEWISE": true,
      "TAX_APPLICABLE": true,
      "H_DECLARATIONNO": this.repairdiapurchaseForm.value.declaration_no,
      "H_DECLARATIONDATE": this.repairdiapurchaseForm.value.declaration_date,
      "H_ORIGINCOUNTRY": this.repairdiapurchaseForm.value.country_origin,
      "H_PACKETNO": this.repairdiapurchaseForm.value.packet_no,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "COMP_WISE_INVOICE": true,
      "REFERENCE_VOC_DTL": "string",
      "TDS_CODE": this.repairdiapurchaseForm.value.total_TDS,
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "TCS_ACCODE": this.repairdiapurchaseForm.value.total_TCS,
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "PROD_REFF": "string",
      "CUSTOMER_CODE": "string",
      "CUSTOMER_NAME": this.repairdiapurchaseForm.value.Customer,
      "CUSTOMER_ADDRESS": this.repairdiapurchaseForm.value.Navigation,
      "SUB_LED_ACCODE": this.repairdiapurchaseForm.value.sub_ledger,
      "SL_CODE": "string",
      "SL_DESCRIPTION": "string",
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_AMOUNTWITHOUTMAKINGCC": 0,
      "TOTAL_MAKINGVATAMOUNTCC": 0,
      "PARTYTRANSWISE_DIAMONDVATONMAKING": true,
      "OUSTATUS": true,
      "REP_REF": "string",
      "REPAIR_REF": "string",
      "GENSEQNO": 0,
      "Detail": 
      [
      {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": "s",
        "STOCK_CODE": "string",
        "PCS": 0,
        "GRWT": 0,
        "RATEFC": 0,
        "RATECC": 0,
        "VALUEFC": 0,
        "VALUECC": 0,
        "DISCPER": 0,
        "DISCAMTFC": 0,
        "DISCAMTCC": 0,
        "NETVALUEFC": 0,
        "NETVALUECC": 0,
        "LOCTYPE_CODE": "string",
        "SUPPLIER": "string",
        "STOCK_DOCDESC": "string",
        "DETLINEREMARKS": "string",
        "ORDER_REF": "string",
        "REPITEMCODE": "string",
        "DCONSALLOCATIONREF": "string",
        "DCONSMKGCOST": 0,
        "DCONSLANDEDCOST": 0,
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "str",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "LOCTYPE_CODE_DESCRIPTION": "string",
        "PICTURE_PATH": "string",
        "BASE_CONV_RATE": 0,
        "AVG_WEIGHT": 0,
        "KPNUMBER": "string",
        "PARTNER_CODE": "string",
        "QUALITY_CODE": "string",
        "QUALITY_PREFIX": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "SHAPE": "string",
        "SIEVE": "string",
        "COST_CODE": "string",
        "PRICE1PER": "string",
        "PRICE2PER": "string",
        "PRICE3PER": "string",
        "PRICE4PER": "string",
        "PRICE5PER": "string",
        "PRICE1FC": "string",
        "PRICE1LC": "string",
        "PRICE2FC": "string",
        "PRICE2LC": "string",
        "PRICE3FC": "string",
        "PRICE3LC": "string",
        "PRICE4FC": "string",
        "PRICE4LC": "string",
        "PRICE5FC": "string",
        "PRICE5LC": "string",
        "PURITY": 0,
        "METALGROSSWT": 0,
        "DIAPCS": 0,
        "DIACARAT": 0,
        "STONEPCS": 0,
        "STONECARAT": 0,
        "NETAMOUNT": 0,
        "WASTAGE": 0,
        "FINEGOLD": 0,
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
        "MARGIN_PER": 0,
        "MARGIN_AMTFC": 0,
        "DT_STOCKCODE": "string",
        "DIARATE": 0,
        "DIAAMOUNT": 0,
        "CUST_STOCKCODE": "string",
        "CUST_PCS": 0,
        "CUST_CARAT": 0,
        "METALNETWT": 0,
        "WASTAGEAMOUNT": 0,
        "METALAMOUNT": 0,
        "WASTAGEAMOUNTLC": 0,
        "METALAMOUNTLC": 0,
        "CGST_CTRACCODE": "string",
        "SGST_CTRACCODE": "string",
        "IGST_CTRACCODE": "string",
        "HSN_CODE": "string",
        "TAXCODE": "string",
        "SERVICE_ACCODE": "string",
        "GST_CODE": "string",
        "MASTERFINEGOLD": 0,
        "METAL_WT": 0,
        "DECLARATIONNO": "string",
        "ORIGINAL_COUNTRY": "string",
        "DET_KPNO": "string",
        "REEXPORTYN": 0,
        "BATCHID": 0,
        "STONEAMOUNT": 0,
        "STONEAMOUNTCC": 0,
        "MARGIN_AMTCC": 0,
        "TDS_CODE": "string",
        "TDS_PER": 0,
        "TDS_TOTALFC": 0,
        "TDS_TOTALCC": 0,
        "STONE_RATE": 0,
        "PEARL_PCS": 0,
        "PEARL_WT": 0,
        "PEARL_RATE": 0,
        "PEARL_AMTCC": 0,
        "PEARL_AMTFC": 0,
        "LABOUR_AMOUNTFC": 0,
        "LABOUR_AMOUNTCC": 0,
        "DIAAMOUNTCC": 0,
        "CUSTOM_AMTFC": 0,
        "CUSTOM_AMTCC": 0,
        "UNQ_DESIGN_ID": "string",
        "TRANSFER_PCS": 0,
        "TRANSFER_QTY": 0,
        "DLABUNIT": 0,
        "DLABRATEFC": 0,
        "DLABRATECC": 0,
        "HALLMARKING": "string",
        "AMOUNTWITHOUTMAKING": 0,
        "AMOUNTWITHOUTMAKINGCC": 0,
        "MAKINGVATAMOUNT": 0,
        "MAKINGVATAMOUNTCC": 0,
        "ORDER_STATUS": 0
      }
      ]
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.repairdiapurchaseForm.reset()
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

  updateMeltingType() {
    if (this.repairdiapurchaseForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = `DiamondPurchase/UpdateDiamondPurchase/${this.branchCode}/${this.repairdiapurchaseForm.value.voc_type}/${this.repairdiapurchaseForm.value.voc_no}/${this.yearMonth}`

    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.repairdiapurchaseForm.value.voc_type,
      "VOCNO": this.repairdiapurchaseForm.value.voc_no || 0,
      "VOCDATE": this.repairdiapurchaseForm.value.Voc_date,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.repairdiapurchaseForm.value.partyCode,
      "PARTY_CURRENCY": this.repairdiapurchaseForm.value.partycur,
      "PARTY_CURR_RATE": this.repairdiapurchaseForm.value.partycurrate,
      "ITEM_CURRENCY": "stri",
      "ITEM_CURR_RATE": 0,
      "VALUE_DATE": this.repairdiapurchaseForm.value.expiry_date,
      "SALESPERSON_CODE": this.repairdiapurchaseForm.value.name,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": this.repairdiapurchaseForm.value.party_amount_FC,
      "PARTY_VALUE_CC": this.repairdiapurchaseForm.value.party_amount_LC,
      "NET_VALUE_FC": this.repairdiapurchaseForm.value.net_amount_fc,
      "NET_VALUE_CC": this.repairdiapurchaseForm.value.net_amount_cc,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": this.repairdiapurchaseForm.value.gross_total_fc,
      "GROSS_VALUE_CC": this.repairdiapurchaseForm.value.gross_total_cc,
      "REMARKS": this.repairdiapurchaseForm.value.remarks,
      "SYSTEM_DATE": new Date(),
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": new Date(),
      "SALESORDERREF": "string",
      "HHACCOUNT_HEAD": "string",
      "OUSTATUSNEW": 0,
      "D2DTRANSFER": "s",
      "TRANS_CODES": "string",
      "PARTY_ADDRESS": this.repairdiapurchaseForm.value.Address,
      "TOTAMOUNT": 0,
      "RNDNETAMOUNT": 0,
      "CR_DAYS": this.repairdiapurchaseForm.value.credit_days_LC,
      "AUTOPOSTING": true,
      "BRANCH_NAME": "string",
      "SALESPERSON_NAME": this.repairdiapurchaseForm.value.namedes,
      "POSTDATE": "string",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "MINE_REF": "string",
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "PARTNER_CODE": "string",
      "FIXED": this.repairdiapurchaseForm.value.net_amount_fc,
      "RATE_TYPE": "string",
      "METAL_RATE": this.repairdiapurchaseForm.value.metal_rate,
      "PRINT_COUNT": 0,
      "DOC_REF": "string",
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.repairdiapurchaseForm.value.state_code,
      "GST_NUMBER": this.repairdiapurchaseForm.value.no,
      "GST_TYPE": "IGST",//stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "AUTOENTRYFLAG": true,
      "GST_GROUP": "s",
      "TOTAL_ADDL_TAXFC": this.repairdiapurchaseForm.value.total_tax_fc,
      "TOTAL_ADDL_TAXCC": this.repairdiapurchaseForm.value.total_tax_cc,
      "REGION": "string",
      "DELIVERY_DATE": new Date(), //"2024-03-21T10:29:43.637Z",
      "VAT_ADJUSTVALUECC": this.repairdiapurchaseForm.value.input_VAT,
      "VAT_ADJUSTVALUEFC": this.repairdiapurchaseForm.value.rcm_VAT,
      "IMPORTINPURCHASE": true,
      "EXCLUDE_VAT": true,
      "MASTERMETALRATEWISE": true,
      "TAX_APPLICABLE": true,
      "H_DECLARATIONNO": this.repairdiapurchaseForm.value.declaration_no,
      "H_DECLARATIONDATE": this.repairdiapurchaseForm.value.declaration_date,
      "H_ORIGINCOUNTRY": this.repairdiapurchaseForm.value.country_origin,
      "H_PACKETNO": this.repairdiapurchaseForm.value.packet_no,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "COMP_WISE_INVOICE": true,
      "REFERENCE_VOC_DTL": "string",
      "TDS_CODE": this.repairdiapurchaseForm.value.total_TDS,
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "TCS_ACCODE": this.repairdiapurchaseForm.value.total_TCS,
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "PROD_REFF": "string",
      "CUSTOMER_CODE": "string",
      "CUSTOMER_NAME": this.repairdiapurchaseForm.value.Customer,
      "CUSTOMER_ADDRESS": this.repairdiapurchaseForm.value.Navigation,
      "SUB_LED_ACCODE": this.repairdiapurchaseForm.value.sub_ledger,
      "SL_CODE": "string",
      "SL_DESCRIPTION": "string",
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_AMOUNTWITHOUTMAKINGCC": 0,
      "TOTAL_MAKINGVATAMOUNTCC": 0,
      "PARTYTRANSWISE_DIAMONDVATONMAKING": true,
      "OUSTATUS": true,
      "REP_REF": "string",
      "REPAIR_REF": "string",
      "GENSEQNO": 0,
      "Detail": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DIVISION_CODE": "s",
          "STOCK_CODE": "string",
          "PCS": 0,
          "GRWT": 0,
          "RATEFC": 0,
          "RATECC": 0,
          "VALUEFC": 0,
          "VALUECC": 0,
          "DISCPER": 0,
          "DISCAMTFC": 0,
          "DISCAMTCC": 0,
          "NETVALUEFC": 0,
          "NETVALUECC": 0,
          "LOCTYPE_CODE": "string",
          "SUPPLIER": "string",
          "STOCK_DOCDESC": "string",
          "DETLINEREMARKS": "string",
          "ORDER_REF": "string",
          "REPITEMCODE": "string",
          "DCONSALLOCATIONREF": "string",
          "DCONSMKGCOST": 0,
          "DCONSLANDEDCOST": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "LOCTYPE_CODE_DESCRIPTION": "string",
          "PICTURE_PATH": "string",
          "BASE_CONV_RATE": 0,
          "AVG_WEIGHT": 0,
          "KPNUMBER": "string",
          "PARTNER_CODE": "string",
          "QUALITY_CODE": "string",
          "QUALITY_PREFIX": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SIZE": "string",
          "SHAPE": "string",
          "SIEVE": "string",
          "COST_CODE": "string",
          "PRICE1PER": "string",
          "PRICE2PER": "string",
          "PRICE3PER": "string",
          "PRICE4PER": "string",
          "PRICE5PER": "string",
          "PRICE1FC": "string",
          "PRICE1LC": "string",
          "PRICE2FC": "string",
          "PRICE2LC": "string",
          "PRICE3FC": "string",
          "PRICE3LC": "string",
          "PRICE4FC": "string",
          "PRICE4LC": "string",
          "PRICE5FC": "string",
          "PRICE5LC": "string",
          "PURITY": 0,
          "METALGROSSWT": 0,
          "DIAPCS": 0,
          "DIACARAT": 0,
          "STONEPCS": 0,
          "STONECARAT": 0,
          "NETAMOUNT": 0,
          "WASTAGE": 0,
          "FINEGOLD": 0,
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
          "MARGIN_PER": 0,
          "MARGIN_AMTFC": 0,
          "DT_STOCKCODE": "string",
          "DIARATE": 0,
          "DIAAMOUNT": 0,
          "CUST_STOCKCODE": "string",
          "CUST_PCS": 0,
          "CUST_CARAT": 0,
          "METALNETWT": 0,
          "WASTAGEAMOUNT": 0,
          "METALAMOUNT": 0,
          "WASTAGEAMOUNTLC": 0,
          "METALAMOUNTLC": 0,
          "CGST_CTRACCODE": "string",
          "SGST_CTRACCODE": "string",
          "IGST_CTRACCODE": "string",
          "HSN_CODE": "string",
          "TAXCODE": "string",
          "SERVICE_ACCODE": "string",
          "GST_CODE": "string",
          "MASTERFINEGOLD": 0,
          "METAL_WT": 0,
          "DECLARATIONNO": "string",
          "ORIGINAL_COUNTRY": "string",
          "DET_KPNO": "string",
          "REEXPORTYN": 0,
          "BATCHID": 0,
          "STONEAMOUNT": 0,
          "STONEAMOUNTCC": 0,
          "MARGIN_AMTCC": 0,
          "TDS_CODE": "string",
          "TDS_PER": 0,
          "TDS_TOTALFC": 0,
          "TDS_TOTALCC": 0,
          "STONE_RATE": 0,
          "PEARL_PCS": 0,
          "PEARL_WT": 0,
          "PEARL_RATE": 0,
          "PEARL_AMTCC": 0,
          "PEARL_AMTFC": 0,
          "LABOUR_AMOUNTFC": 0,
          "LABOUR_AMOUNTCC": 0,
          "DIAAMOUNTCC": 0,
          "CUSTOM_AMTFC": 0,
          "CUSTOM_AMTCC": 0,
          "UNQ_DESIGN_ID": "string",
          "TRANSFER_PCS": 0,
          "TRANSFER_QTY": 0,
          "DLABUNIT": 0,
          "DLABRATEFC": 0,
          "DLABRATECC": 0,
          "HALLMARKING": "string",
          "AMOUNTWITHOUTMAKING": 0,
          "AMOUNTWITHOUTMAKINGCC": 0,
          "MAKINGVATAMOUNT": 0,
          "MAKINGVATAMOUNTCC": 0,
          "ORDER_STATUS": 0
        }
      ]
    }

    // let postData = {
    //   "MID": 0,
    //   "BRANCH_CODE": this.branchCode,
    //   "VOCTYPE": this.repairdiapurchaseForm.value.voc_type,
    //   "VOCNO":this.repairdiapurchaseForm.value.voc_no,
    //   "VOCDATE": this.repairdiapurchaseForm.value.Voc_date,
    //   "YEARMONTH": this.yearMonth,
    //   "PARTYCODE": this.repairdiapurchaseForm.value.partyCode,
    //   "PARTY_CURRENCY": this.repairdiapurchaseForm.value.partycur,
    //   "PARTY_CURR_RATE": this.repairdiapurchaseForm.value.partycurrate,
    //   "ITEM_CURRENCY": "stri",
    //   "ITEM_CURR_RATE": 0,
    //   "VALUE_DATE": this.repairdiapurchaseForm.value.expiry_date,
    //   "SALESPERSON_CODE": this.repairdiapurchaseForm.value.name,
    //   "TOTAL_PCS": 0,
    //   "TOTAL_GRWT": 0,
    //   "TOTAL_DISCAMTFC": 0,
    //   "TOTAL_DISCAMTCC": 0,
    //   "ITEM_VALUE_FC": 0,
    //   "ITEM_VALUE_CC": 0,
    //   "PARTY_VALUE_FC": this.repairdiapurchaseForm.value.party_amount_FC,
    //   "PARTY_VALUE_CC": this.repairdiapurchaseForm.value.party_amount_LC,
    //   "NET_VALUE_FC": this.repairdiapurchaseForm.value.net_amount_fc,
    //   "NET_VALUE_CC":this.repairdiapurchaseForm.value.net_amount_cc,
    //   "ADDL_VALUE_FC": 0,
    //   "ADDL_VALUE_CC": 0,
    //   "GROSS_VALUE_FC": this.repairdiapurchaseForm.value.gross_total_fc,
    //   "GROSS_VALUE_CC": this.repairdiapurchaseForm.value.gross_total_cc,
    //   "REMARKS": this.repairdiapurchaseForm.value.remarks,
    //   "SYSTEM_DATE": new Date(),//"2024-03-21T10:29:43.637Z",
    //   "CONSIGNMENTID": 0,
    //   "ROUND_VALUE_CC": 0,
    //   "NAVSEQNO": 0,
    //   "SUPINVNO": "string",
    //   "SUPINVDATE": "2024-03-21T10:29:43.637Z",
    //   "SALESORDERREF": "string",
    //   "HHACCOUNT_HEAD": "string",
    //   "OUSTATUSNEW": 0,
    //   "D2DTRANSFER": "s",
    //   "TRANS_CODES": "string",
    //   "PARTY_ADDRESS": this.repairdiapurchaseForm.value.Address,
    //   "TOTAMOUNT": 0,
    //   "RNDNETAMOUNT": 0,
    //   "CR_DAYS": this.repairdiapurchaseForm.value.credit_days_LC,
    //   "AUTOPOSTING": true,
    //   "BRANCH_NAME": "string",
    //   "SALESPERSON_NAME": this.repairdiapurchaseForm.value.namedes,
    //   "POSTDATE": "string",
    //   "AUTHORIZEDPOSTING": true,
    //   "CANCELLEDPOSTING": true,
    //   "BASE_CURRENCY": "stri",
    //   "BASE_CURR_RATE": 0,
    //   "BASE_CONV_RATE": 0,
    //   "MINE_REF": "string",
    //   "SHIPCODE": "string",
    //   "SHIPDESC": "string",
    //   "PARTNER_CODE": "string",
    //   "FIXED": this.repairdiapurchaseForm.value.net_amount_fc,
    //   "RATE_TYPE": "string",
    //   "METAL_RATE": 0,
    //   "PRINT_COUNT": 0,
    //   "DOC_REF": "string",
    //   "GST_REGISTERED": true,
    //   "GST_STATE_CODE": this.repairdiapurchaseForm.value.state_code,
    //   "GST_NUMBER": "string",
    //   "GST_TYPE": "stri",
    //   "GST_TOTALFC": 0,
    //   "GST_TOTALCC": 0,
    //   "AUTOENTRYFLAG": true,
    //   "GST_GROUP": "s",
    //   "TOTAL_ADDL_TAXFC": this.repairdiapurchaseForm.value.total_tax_fc,
    //   "TOTAL_ADDL_TAXCC": this.repairdiapurchaseForm.value.total_tax_cc,
    //   "REGION": "string",
    //   "DELIVERY_DATE": "2024-03-21T10:29:43.637Z",
    //   "VAT_ADJUSTVALUECC": this.repairdiapurchaseForm.value.input_VAT,
    //   "VAT_ADJUSTVALUEFC": this.repairdiapurchaseForm.value.rcm_VAT,
    //   "IMPORTINPURCHASE": true,
    //   "EXCLUDE_VAT": true,
    //   "MASTERMETALRATEWISE": true,
    //   "TAX_APPLICABLE": true,
    //   "H_DECLARATIONNO": this.repairdiapurchaseForm.value.declaration_no,
    //   "H_DECLARATIONDATE":this.repairdiapurchaseForm.value.declaration_date,
    //   "H_ORIGINCOUNTRY": "string",
    //   "H_PACKETNO": this.repairdiapurchaseForm.value.packet_no,
    //   "METAL_RATE_GMSFC": 0,
    //   "METAL_RATE_GMSCC": 0,
    //   "COMP_WISE_INVOICE": true,
    //   "REFERENCE_VOC_DTL": "string",
    //   "TDS_CODE": this.repairdiapurchaseForm.value.total_TDS,
    //   "TDS_APPLICABLE": true,
    //   "TDS_TOTALFC": 0,
    //   "TDS_TOTALCC": 0,
    //   "TCS_ACCODE": this.repairdiapurchaseForm.value.total_TCS,
    //   "TCS_AMOUNT": 0,
    //   "TCS_AMOUNTCC": 0,
    //   "TCS_APPLICABLE": true,
    //   "PROD_REFF": "string",
    //   "CUSTOMER_CODE": "string",
    //   "CUSTOMER_NAME": this.repairdiapurchaseForm.value.Customer,
    //   "CUSTOMER_ADDRESS": this.repairdiapurchaseForm.value.Navigation,
    //   "SUB_LED_ACCODE": this.repairdiapurchaseForm.value.sub_ledger,
    //   "SL_CODE": "string",
    //   "SL_DESCRIPTION": "string",
    //   "HTUSERNAME": "string",
    //   "PRINT_COUNT_ACCOPY": 0,
    //   "PRINT_COUNT_CNTLCOPY": 0,
    //   "IMPEXPDOC_TYPE": 0,
    //   "TOTAL_AMOUNTWITHOUTMAKINGCC": 0,
    //   "TOTAL_MAKINGVATAMOUNTCC": 0,
    //   "PARTYTRANSWISE_DIAMONDVATONMAKING": true,
    //   "OUSTATUS": true,
    //   "REP_REF": "string",
    //   "REPAIR_REF": "string",
    //   "GENSEQNO": 0,
    //   "Detail": [
    //     {
    //       "UNIQUEID": 0,
    //       "SRNO": 0,
    //       "DIVISION_CODE": "s",
    //       "STOCK_CODE": "string",
    //       "PCS": 0,
    //       "GRWT": 0,
    //       "RATEFC": 0,
    //       "RATECC": 0,
    //       "VALUEFC": 0,
    //       "VALUECC": 0,
    //       "DISCPER": 0,
    //       "DISCAMTFC": 0,
    //       "DISCAMTCC": 0,
    //       "NETVALUEFC": 0,
    //       "NETVALUECC": 0,
    //       "LOCTYPE_CODE": "string",
    //       "SUPPLIER": "string",
    //       "STOCK_DOCDESC": "string",
    //       "DETLINEREMARKS": "string",
    //       "ORDER_REF": "string",
    //       "REPITEMCODE": "string",
    //       "DCONSALLOCATIONREF": "string",
    //       "DCONSMKGCOST": 0,
    //       "DCONSLANDEDCOST": 0,
    //       "DT_BRANCH_CODE": "string",
    //       "DT_VOCTYPE": "str",
    //       "DT_VOCNO": 0,
    //       "DT_YEARMONTH": "string",
    //       "LOCTYPE_CODE_DESCRIPTION": "string",
    //       "PICTURE_PATH": "string",
    //       "BASE_CONV_RATE": 0,
    //       "AVG_WEIGHT": 0,
    //       "KPNUMBER": "string",
    //       "PARTNER_CODE": "string",
    //       "QUALITY_CODE": "string",
    //       "QUALITY_PREFIX": "string",
    //       "COLOR": "string",
    //       "CLARITY": "string",
    //       "SIZE": "string",
    //       "SHAPE": "string",
    //       "SIEVE": "string",
    //       "COST_CODE": "string",
    //       "PRICE1PER": "string",
    //       "PRICE2PER": "string",
    //       "PRICE3PER": "string",
    //       "PRICE4PER": "string",
    //       "PRICE5PER": "string",
    //       "PRICE1FC": "string",
    //       "PRICE1LC": "string",
    //       "PRICE2FC": "string",
    //       "PRICE2LC": "string",
    //       "PRICE3FC": "string",
    //       "PRICE3LC": "string",
    //       "PRICE4FC": "string",
    //       "PRICE4LC": "string",
    //       "PRICE5FC": "string",
    //       "PRICE5LC": "string",
    //       "PURITY": 0,
    //       "METALGROSSWT": 0,
    //       "DIAPCS": 0,
    //       "DIACARAT": 0,
    //       "STONEPCS": 0,
    //       "STONECARAT": 0,
    //       "NETAMOUNT": 0,
    //       "WASTAGE": 0,
    //       "FINEGOLD": 0,
    //       "TOTAL_AMOUNTFC": 0,
    //       "TOTAL_AMOUNTCC": 0,
    //       "CGST_PER": 0,
    //       "CGST_AMOUNTFC": 0,
    //       "CGST_AMOUNTCC": 0,
    //       "SGST_PER": 0,
    //       "SGST_AMOUNTFC": 0,
    //       "SGST_AMOUNTCC": 0,
    //       "IGST_PER": 0,
    //       "IGST_AMOUNTFC": 0,
    //       "IGST_AMOUNTCC": 0,
    //       "CGST_ACCODE": "string",
    //       "SGST_ACCODE": "string",
    //       "IGST_ACCODE": "string",
    //       "MARGIN_PER": 0,
    //       "MARGIN_AMTFC": 0,
    //       "DT_STOCKCODE": "string",
    //       "DIARATE": 0,
    //       "DIAAMOUNT": 0,
    //       "CUST_STOCKCODE": "string",
    //       "CUST_PCS": 0,
    //       "CUST_CARAT": 0,
    //       "METALNETWT": 0,
    //       "WASTAGEAMOUNT": 0,
    //       "METALAMOUNT": 0,
    //       "WASTAGEAMOUNTLC": 0,
    //       "METALAMOUNTLC": 0,
    //       "CGST_CTRACCODE": "string",
    //       "SGST_CTRACCODE": "string",
    //       "IGST_CTRACCODE": "string",
    //       "HSN_CODE": "string",
    //       "TAXCODE": "string",
    //       "SERVICE_ACCODE": "string",
    //       "GST_CODE": "string",
    //       "MASTERFINEGOLD": 0,
    //       "METAL_WT": 0,
    //       "DECLARATIONNO": "string",
    //       "ORIGINAL_COUNTRY": "string",
    //       "DET_KPNO": "string",
    //       "REEXPORTYN": 0,
    //       "BATCHID": 0,
    //       "STONEAMOUNT": 0,
    //       "STONEAMOUNTCC": 0,
    //       "MARGIN_AMTCC": 0,
    //       "TDS_CODE": "string",
    //       "TDS_PER": 0,
    //       "TDS_TOTALFC": 0,
    //       "TDS_TOTALCC": 0,
    //       "STONE_RATE": 0,
    //       "PEARL_PCS": 0,
    //       "PEARL_WT": 0,
    //       "PEARL_RATE": 0,
    //       "PEARL_AMTCC": 0,
    //       "PEARL_AMTFC": 0,
    //       "LABOUR_AMOUNTFC": 0,
    //       "LABOUR_AMOUNTCC": 0,
    //       "DIAAMOUNTCC": 0,
    //       "CUSTOM_AMTFC": 0,
    //       "CUSTOM_AMTCC": 0,
    //       "UNQ_DESIGN_ID": "string",
    //       "TRANSFER_PCS": 0,
    //       "TRANSFER_QTY": 0,
    //       "DLABUNIT": 0,
    //       "DLABRATEFC": 0,
    //       "DLABRATECC": 0,
    //       "HALLMARKING": "string",
    //       "AMOUNTWITHOUTMAKING": 0,
    //       "AMOUNTWITHOUTMAKINGCC": 0,
    //       "MAKINGVATAMOUNT": 0,
    //       "MAKINGVATAMOUNTCC": 0,
    //       "ORDER_STATUS": 0
    //     }
    //   ]
    // }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.repairdiapurchaseForm.reset()
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
        let API = 'DiamondPurchase/DeleteDiamondPurchase/' + this.branchCode + this.repairdiapurchaseForm.value.voc_type + this.repairdiapurchaseForm.value.voc_no + this.yearMonth
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
                    this.repairdiapurchaseForm.reset()
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
                    this.repairdiapurchaseForm.reset()
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
