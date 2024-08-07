import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ProductionEntryDetailsComponent } from "./production-entry-details/production-entry-details.component";
import { SavedataModel } from "./savedata-model";

@Component({
  selector: "app-production-mfg",
  templateUrl: "./production-mfg.component.html",
  styleUrls: ["./production-mfg.component.scss"],
})
export class ProductionMfgComponent implements OnInit {
  columnheads: any[] = [
    "JOB_NUMBER", "UNQ_JOB_ID", "DESIGN_CODE",
    "DIVCODE", 'PREFIX', 'STOCK_CODE', 'STOCK_DESCRIPTION', 'SET_REF',
    'KARAT_CODE', 'JOB_PCS', 'GROSS_WT', 'METAL_PCS', 'METAL_WT', 'STONE_PCS',
    'STONE_WT', 'LOSS_WT', 'NET_WT', 'PURITY', 'PURE_WT', 'RATE_TYPE', 'METAL_RATE',
    'CURRENCY_CODE', 'CURRENCY_RATE', 'METAL_GRAM_RATEFC', 'METAL_AMOUNTFC',
    'METAL_AMOUNTLC', 'MAKING_RATEFC', 'MAKING_RATELC', 'MAKING_AMOUNTFC',
    'MAKING_AMOUNTLC', 'STONE_RATEFC', 'STONE_RATELC', 'STONE_AMOUNTFC', 'STONE_AMOUNTLC',
    'LAB_AMOUNTFC', 'LAB_AMOUNTLC', 'RATEFC',
    'RATELC', 'AMOUNTFC', 'AMOUNTLC', 'PROCESS_CODE',
    'PROCESS_NAME', 'WORKER_CODE', 'WORKER_NAME', 'IN_DATE', 'OUT_DATE', 'TIME_TAKEN_HRS', 'COST_CODE',
    'WIP_ACCODE', 'STK_ACCODE', 'SOH_ACCODE', 'PROD_PROC', 'METAL_DIVISION', 'PRICE1PER',
    'PRICE2PER', 'PRICE3PER', 'PRICE4PER', 'PRICE5PER', 'LOCTYPE_CODE', 'WASTAGE_WT', 'WASTAGE_AMTFC',
    'WASTAGE_AMTLC', 'PICTURE_NAME', 'SELLINGRATE', 'LAB_ACCODE', 'CUSTOMER_CODE', 'OUTSIDEJOB',
    'METAL_LABAMTFC', 'METAL_LABAMTLC', 'METAL_LABACCODE', 'SUPPLIER_REF', 'TAGLINES', 'SETTING_CHRG',
    'POLISH_CHRG', 'RHODIUM_CHRG', 'LABOUR_CHRG', 'MISC_CHRG', 'SETTING_ACCODE', 'POLISH_ACCODE',
    'RHODIUM_ACCODE', 'LABOUR_ACCODE', 'MISC_ACCODE', 'WAST_ACCODE', 'REPAIRJOB', 'PRICE1FC',
    'PRICE2FC', 'PRICE3FC', 'PRICE4FC', 'PRICE5FC', 'BASE_CONV_RATE', 'DT_BRANCH_CODE', 'DT_VOCTYPE',
    'DT_VOCNO', 'DT_YEARMONTH', 'YEARMONTH', 'OTH_STONE_WT', 'OTH_STONE_AMT', 'HANDLING_ACCODE',
    'FROM_STOCK_CODE', 'TO_STOCK_CODE', 'JOB_PURITY', 'LOSS_PUREWT', 'PUDIFF', 'STONEDIFF', 'CHARGABLEWT',
    'BARNO', 'LOTNUMBER', 'TICKETNO', 'PROD_PER', 'DESIGN_TYPE', 'D_REMARKS',
    'BARCODEDQTY', 'BARCODEDPCS', 'LASTNO'
  ];
  @Input() content!: any;
  tableData: any[] = [];
  DetailScreenDataToSave: any[] = [];
  STOCK_FORM_DETAILS: any[] = [];
  STOCK_COMPONENT_GRID: any[] = [];
  labourChargeDetailToSave: any[] = [];
  productionMetalRateToSave: any[] = [];
  formDetailCount: number = 0;
  viewMode: boolean = false;
  userName = this.commonService.userName;
  branchCode: string = '';
  yearMonth?: string;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'RATE TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  branchCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
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
  userDataSelected(value: any) {
    console.log(value);
    this.productionFrom.controls.enteredby.setValue(value.UsersName);
  }
  branchSelected(e:any){
    console.log(e); 
    this.productionFrom.controls.branchto.setValue(e.BRANCH_CODE);
  }
  baseCurrencyCodeSelected(e: any) {
    console.log(e);
    this.productionFrom.controls.basecurrency.setValue(e.CURRENCY_CODE);
    this.productionFrom.controls.basecurrencyrate.setValue(e.CONV_RATE);
  }
  // main form
  productionFrom: FormGroup = this.formBuilder.group({
    voctype: ["", [Validators.required]],
    vocDate: ["", [Validators.required]],
    vocno: [1],
    enteredby: [""],
    currency: ["", [Validators.required]],
    currencyrate: ["", [Validators.required]],
    basecurrency: [""],
    basecurrencyrate: [""],
    baseConvRate: [""],
    time: [""],
    metalrate: [""],
    metalratetype: [""],
    branchto: [""],
    narration: [""],
    STONE_INCLUDE: [false],
    UnfixTransaction: [false],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.setInitialDatas()
    this.setCompanyCurrency()
    this.getRateType()
  }
  setInitialDatas() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.productionFrom.controls.vocDate.setValue(this.commonService.currentDate)
    this.productionFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.productionFrom.controls.time.setValue(this.commonService.getTime())
  }
  /**USE: get rate type on load */
  getRateType() {
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.DIVISION_CODE == 'G' && item.DEFAULT_RTYPE == 1)

    if (data[0].WHOLESALE_RATE) {
      let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
      this.productionFrom.controls.metalrate.setValue(WHOLESALE_RATE)
    }
    this.productionFrom.controls.metalratetype.setValue(data[0].RATE_TYPE)
  }
  /**USE: Rate type selection */
  rateTypeSelected(event: any) {
    this.productionFrom.controls.metalratetype.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.productionFrom.controls.metalrate.setValue(WHOLESALE_RATE)
      }
    });
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.productionFrom.controls.currency.setValue((event.target.value).toUpperCase())
    } else {
      this.productionFrom.controls.currency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.productionFrom.controls.currency.setValue(CURRENCY_CODE);
    this.productionFrom.controls.basecurrency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.currency);
    this.productionFrom.controls.basecurrencyrate.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.productionFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.productionFrom.controls.currency.setValue('')
      this.productionFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
    this.BaseCurrencyRateVisibility(this.productionFrom.value.currency, this.productionFrom.value.currencyrate)
  }
  BaseCurrencyRateVisibility(txtPCurr: any, txtPCurrRate: any) {
    let ConvRateArr: any = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.currency && item.CMBRANCH_CODE == this.branchCode)
    let baseConvRate = 1 / ConvRateArr[0].CONV_RATE
    this.productionFrom.controls.baseConvRate.setValue(baseConvRate)
  }

  openProductionEntryDetails(data?: any) {
    if (data) {
      data[0].HEADERDETAILS = this.productionFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.productionFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(
      ProductionEntryDetailsComponent, {
      size: "xl",
      backdrop: true, //'static'
      keyboard: false,
      windowClass: "modal-full-width",
    });
    modalRef.componentInstance.content = data;

    modalRef.result.then((responseDetail: SavedataModel) => {
      if (responseDetail) {
        console.log(responseDetail, 'data From Detail Screen');
        //detail screen form data set to save
        this.setDetailFormDataToSave(responseDetail.DETAIL_FORM_DATA); //headerscreen
        this.STOCK_FORM_DETAILS = responseDetail.STOCK_FORM_DETAILS; //stockscreen
        this.STOCK_COMPONENT_GRID = responseDetail.STOCK_COMPONENT_GRID; //stockscreen
      }
    });
  }
  setStockScreenData() {
    let data = {
      /**data from stock details starts*/
      // "UNIQUEID": 0,
      // "SRNO": 0,
      // "VOCNO": 0,
      // "VOCTYPE": "",
      // "VOCDATE": this.commonService.formatDateTime(this.currentDate),
      // "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      // "JOB_NUMBER": this.commonService.nullToString(element.jobno),
      // "JOB_DATE": this.commonService.nullToString(element.jobDate),
      // "JOB_SO_NUMBER": this.commonService.emptyToZero(element.subjobno),
      // "UNQ_JOB_ID": this.commonService.nullToString(element.subjobno),
      // "JOB_DESCRIPTION": this.commonService.nullToString(element.subjobnoDesc),
      // "UNQ_DESIGN_ID": "",
      // "DESIGN_CODE": this.commonService.nullToString(element.design),
      // "DIVCODE": "",
      // "PREFIX": this.commonService.nullToString(element.prefix),
      // "STOCK_CODE": "",
      // "STOCK_DESCRIPTION": "",
      // "SET_REF": this.commonService.nullToString(element.setref),
      // "KARAT_CODE": this.commonService.nullToString(element.karat),
      // "MULTI_STOCK_CODE": true,
      // "JOB_PCS": 0,
      // "GROSS_WT": this.commonService.emptyToZero(element.grosswt),
      // "METAL_PCS": this.commonService.emptyToZero(element.metalpcs),
      // "METAL_WT": this.commonService.emptyToZero(element.metalwt),
      // "STONE_PCS": this.commonService.emptyToZero(element.stonepcs),
      // "STONE_WT": this.commonService.emptyToZero(element.stonewt),
      // "LOSS_WT": this.commonService.emptyToZero(element.lossone),
      // "NET_WT": 0,
      // "PURITY": this.commonService.emptyToZero(element.purity),
      // "PURE_WT": this.commonService.emptyToZero(element.pureWt),
      // "RATE_TYPE": this.commonService.nullToString(element.mkgRate),
      // "METAL_RATE": 0,
      // "CURRENCY_CODE": "",
      // "CURRENCY_RATE": 0,
      // "METAL_GRM_RATEFC": 0,
      // "METAL_GRM_RATELC": 0,
      // "METAL_AMOUNTFC": 0,
      // "METAL_AMOUNTLC": 0,
      // "MAKING_RATEFC": 0,
      // "MAKING_RATELC": 0,
      // "MAKING_AMOUNTFC": 0,
      // "MAKING_AMOUNTLC": 0,
      // "STONE_RATEFC": 0,
      // "STONE_RATELC": 0,
      // "STONE_AMOUNTFC": 0,
      // "STONE_AMOUNTLC": 0,
      // "LAB_AMOUNTFC": 0,
      // "LAB_AMOUNTLC": 0,
      // "RATEFC": 0,
      // "RATELC": 0,
      // "AMOUNTFC": 0,
      // "AMOUNTLC": 0,
      // "PROCESS_CODE": this.commonService.nullToString(element.process),
      // "PROCESS_NAME": this.commonService.nullToString(element.processname),
      // "WORKER_CODE": this.commonService.nullToString(element.worker),
      // "WORKER_NAME": this.commonService.nullToString(element.workername),
      // "IN_DATE": this.commonService.nullToString(element.startdate),
      // "OUT_DATE": this.commonService.nullToString(element.endDate),
      // "TIME_TAKEN_HRS": this.commonService.emptyToZero(element.timetaken),
      // "COST_CODE": this.commonService.nullToString(element.costcode),
      // "WIP_ACCODE": "",
      // "STK_ACCODE": "",
      // "SOH_ACCODE": "",
      // "PROD_PROC": this.commonService.nullToString(element.prodpcs),
      // "METAL_DIVISION": "",
      // "PRICE1PER": this.commonService.nullToString(element.price1),
      // "PRICE2PER": this.commonService.nullToString(element.price2),
      // "PRICE3PER": this.commonService.nullToString(element.price3),
      // "PRICE4PER": this.commonService.nullToString(element.price4),
      // "PRICE5PER": this.commonService.nullToString(element.price5),
      // "LOCTYPE_CODE": this.commonService.nullToString(element.location),
      // "WASTAGE_WT": 0,
      // "WASTAGE_AMTFC": 0,
      // "WASTAGE_AMTLC": 0,
      // "PICTURE_NAME": "",
      // "SELLINGRATE": 0,
      // "CUSTOMER_CODE": this.commonService.nullToString(element.customer),
      // "OUTSIDEJOB": true,
      // "LAB_ACCODE": "",
      // "METAL_LABAMTFC": 0,
      // "METAL_LABAMTLC": 0,
      // "METAL_LABACCODE": "",
      // "SUPPLIER_REF": "",
      // "TAGLINES": "",
      // "SETTING_CHRG": 0,
      // "POLISH_CHRG": 0,
      // "RHODIUM_CHRG": 0,
      // "LABOUR_CHRG": 0,
      // "MISC_CHRG": 0,
      // "SETTING_ACCODE": "",
      // "POLISH_ACCODE": "",
      // "RHODIUM_ACCODE": "",
      // "LABOUR_ACCODE": "",
      // "MISC_ACCODE": "",
      // "WAST_ACCODE": "",
      // "REPAIRJOB": 0,
      // "PRICE1FC": 0,
      // "PRICE2FC": 0,
      // "PRICE3FC": 0,
      // "PRICE4FC": 0,
      // "PRICE5FC": 0,
      // "DT_BRANCH_CODE": "",
      // "DT_VOCTYPE": "",
      // "DT_VOCNO": 0,
      // "DT_YEARMONTH": "",
      // "YEARMONTH": "",
      // "BASE_CONV_RATE": 0,
      // "OTH_STONE_WT": this.commonService.emptyToZero(element.otherstone),
      // "OTH_STONE_AMT": 0,
      // "HANDLING_ACCODE": "",
      // "FROM_STOCK_CODE": this.commonService.nullToString(element.fromStockCode),
      // "TO_STOCK_CODE": this.commonService.nullToString(element.toStockCode),
      // "JOB_PURITY": this.commonService.emptyToZero(element.jobPurity),
      // "LOSS_PUREWT": this.commonService.emptyToZero(element.loss),
      // "PUDIFF": this.commonService.emptyToZero(element.purityDiff),
      // "STONEDIFF": this.commonService.emptyToZero(element.stoneDiff),
      // "CHARGABLEWT": this.commonService.emptyToZero(element.chargableWt),
      // "BARNO": this.commonService.nullToString(element.barNo),
      // "LOTNUMBER": this.commonService.nullToString(element.lotNo),
      // "TICKETNO": this.commonService.nullToString(element.ticketNo),
      // "PROD_PER": this.commonService.emptyToZero(element.prod),
      // "PURITY_PER": this.commonService.emptyToZero(element.purityPer),
      // "DESIGN_TYPE": this.commonService.nullToString(element.designCode),
      // "D_REMARKS": this.commonService.nullToString(element.remarks),
      // "BARCODEDQTY": 0,
      // "BARCODEDPCS": 0
    }
  }

  /*USE: detail screen form data set to save */
  setDetailFormDataToSave(DETAIL_FORM_DATA: any) {
    console.log(DETAIL_FORM_DATA, 'DETAIL_FORM_DATA');

    this.DetailScreenDataToSave.push({
      "UNIQUEID": 0,
      "SRNO": this.formDetailCount,
      "DT_VOCNO": this.commonService.emptyToZero(this.productionFrom.value.VOCNO),
      "DT_VOCTYPE": this.commonService.nullToString(this.productionFrom.value.voctype),
      "DT_VOCDATE": this.commonService.formatDateTime(this.productionFrom.value.vocDate),
      "DT_BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "DT_NAVSEQNO": "",
      "DT_YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "JOB_NUMBER": this.commonService.nullToString(DETAIL_FORM_DATA.jobno),
      "JOB_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.JOB_DATE),
      "JOB_SO_NUMBER": this.commonService.emptyToZero(DETAIL_FORM_DATA.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.commonService.nullToString(DETAIL_FORM_DATA.subjobno),
      "JOB_DESCRIPTION": this.commonService.emptyToZero(DETAIL_FORM_DATA.jobnoDesc),
      "UNQ_DESIGN_ID": this.commonService.emptyToZero(DETAIL_FORM_DATA.DESIGN_CODE),
      "DESIGN_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.DESIGN_CODE),
      "PART_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.PART_CODE),
      "DIVCODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.DIVCODE),
      "PREFIX": this.commonService.nullToString(DETAIL_FORM_DATA.PREFIX),
      "STOCK_CODE": this.commonService.nullToString(DETAIL_FORM_DATA.STOCK_CODE),
      "STOCK_DESCRIPTION": this.commonService.nullToString(DETAIL_FORM_DATA.STOCK_DESCRIPTION),
      "SET_REF": this.commonService.nullToString(DETAIL_FORM_DATA.SETREF),
      "KARAT_CODE": this.commonService.nullToString(DETAIL_FORM_DATA.KARAT),
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": this.commonService.emptyToZero(DETAIL_FORM_DATA.JOB_PCS),
      "GROSS_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.GROSS_WT),
      "METAL_PCS": 0,
      "METAL_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.METAL_WT),
      "STONE_PCS": this.commonService.emptyToZero(DETAIL_FORM_DATA.STONE_PCS),
      "STONE_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.STONE_WT),
      "LOSS_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.LOSS_WT),
      "NET_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.GROSS_WT),
      "PURITY": this.commonService.emptyToZero(DETAIL_FORM_DATA.PURITY),
      "PURE_WT": this.commonService.emptyToZero(DETAIL_FORM_DATA.PURE_WT),
      "RATE_TYPE": this.commonService.nullToString(this.productionFrom.value.metalratetype),
      "METAL_RATE": this.commonService.emptyToZero(this.productionFrom.value.metalrate),
      "CURRENCY_CODE": this.commonService.nullToString(this.productionFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.productionFrom.value.currencyrate),
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.process),
      "PROCESS_NAME": this.commonService.emptyToZero(DETAIL_FORM_DATA.processname),
      "WORKER_CODE": this.commonService.emptyToZero(DETAIL_FORM_DATA.worker),
      "WORKER_NAME": this.commonService.emptyToZero(DETAIL_FORM_DATA.workername),
      "IN_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.START_DATE),
      "OUT_DATE": this.commonService.formatDateTime(DETAIL_FORM_DATA.END_DATE),
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": "",
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": "",
      "METAL_DIVISION": DETAIL_FORM_DATA.metalValue,
      "PRICE1PER": DETAIL_FORM_DATA.price1per,
      "PRICE2PER": DETAIL_FORM_DATA.price2per,
      "PRICE3PER": DETAIL_FORM_DATA.price3per,
      "PRICE4PER": DETAIL_FORM_DATA.price4per,
      "PRICE5PER": DETAIL_FORM_DATA.price5per,
      "LOCTYPE_CODE": "",
      "WASTAGE_WT": DETAIL_FORM_DATA.wastage,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "",
      "CUSTOMER_CODE": "",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": DETAIL_FORM_DATA.totalLabour,
      "TAGLINES": "",
      "SETTING_CHRG": DETAIL_FORM_DATA.settingChrg,
      "POLISH_CHRG": DETAIL_FORM_DATA.polishChrg,
      "RHODIUM_CHRG": DETAIL_FORM_DATA.rhodiumChrg,
      "LABOUR_CHRG": DETAIL_FORM_DATA.labourChrg,
      "MISC_CHRG": DETAIL_FORM_DATA.miscChrg,
      "SETTING_ACCODE": DETAIL_FORM_DATA.settingChrgDesc,
      "POLISH_ACCODE": DETAIL_FORM_DATA.polishChrgDesc,
      "RHODIUM_ACCODE": DETAIL_FORM_DATA.rhodiumChrgDesc,
      "LABOUR_ACCODE": DETAIL_FORM_DATA.labourChrgDesc,
      "MISC_ACCODE": DETAIL_FORM_DATA.miscChrgDesc,
      "WAST_ACCODE": DETAIL_FORM_DATA.wastage,
      "REPAIRJOB": 0,
      "PRICE1FC": DETAIL_FORM_DATA.price1fc,
      "PRICE2FC": DETAIL_FORM_DATA.price2fc,
      "PRICE3FC": DETAIL_FORM_DATA.price3fc,
      "PRICE4FC": DETAIL_FORM_DATA.price4fc,
      "PRICE5FC": DETAIL_FORM_DATA.price5fc,
      "BASE_CONV_RATE": 0,
      "FROM_STOCK_CODE": "",
      "TO_STOCK_CODE": "",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "",
      "LOTNUMBER": "",
      "TICKETNO": "",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "",
      "BASE_CURR_RATE": 0
    })
    console.log(this.DetailScreenDataToSave, '111111111111111111111111111');
  }

  deleteTableData() {

  }

  removedata() {
    this.tableData.pop();
  }

  /**USE: production metal rate data setup */
  productionMetalRate() {
    this.productionMetalRateToSave.push({
      "REFMID": 0,
      "SRNO": 0,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "DIVISION_CODE": "",
      "SYSTEM_DATE": "2023-10-17T12:41:20.127Z",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "CONV_FACTOR": 0
    })
  }
  /**Labour charge detail data to save */
  setLabourChargeDetailToSave() {
    this.labourChargeDetailToSave.push({
      "REFMID": 0,
      "BRANCH_CODE": "",
      "YEARMONTH": "",
      "VOCTYPE": "",
      "VOCNO": 0,
      "SRNO": 0,
      "JOB_NUMBER": "",
      "STOCK_CODE": "",
      "UNQ_JOB_ID": "",
      "METALSTONE": "",
      "DIVCODE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_ACCODE": "",
      "LAB_AMTFC": 0,
      "UNITCODE": "",
      "DIVISION": "",
      "WASTAGE_PER": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,
      "KARAT_CODE": ""
    })
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.voctype) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// voctype code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.vocDate) == '') {
      this.commonService.toastErrorByMsgId('MSG1331')// vocDate code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.vocno) == '') {
      this.commonService.toastErrorByMsgId('MSG3661')// vocno code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1172')// currency code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.currencyrate) == '') {
      this.commonService.toastErrorByMsgId('MSG1178')// currencyrate code CANNOT BE EMPTY
      return true
    }
    return false;
  }


  formSubmit() {
    console.log(this.DetailScreenDataToSave)
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.submitValidations(this.productionFrom.value)) return;


    // if (this.productionFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }

    // if(this.DetailScreenDataToSave.length == 0){
    //   this.toastr.error("Enter the Production Entry Details");
    //   return;
    // }

    let postData = {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(this.productionFrom.value.voctype),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "VOCNO": this.commonService.nullToString(this.productionFrom.value.vocno),
      "VOCDATE": this.commonService.formatDateTime(this.productionFrom.value.vocDate),
      "YEARMONTH": this.commonService.nullToString(this.yearMonth),
      "DOCTIME": this.commonService.formatDateTime(this.currentDate),
      "CURRENCY_CODE": this.commonService.nullToString(this.productionFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.productionFrom.value.currencyrate),
      "METAL_RATE_TYPE": this.commonService.nullToString(this.productionFrom.value.metalratetype),
      "METAL_RATE": this.commonService.emptyToZero(this.productionFrom.value.metalrate),
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": this.commonService.nullToString(this.productionFrom.value.enteredby),
      "REMARKS": this.commonService.nullToString(this.productionFrom.value.narration),
      "NAVSEQNO": this.commonService.emptyToZero(this.yearMonth),
      "FIX_UNFIX": this.productionFrom.value.UnfixTransaction,
      "STONE_INCLUDE": this.productionFrom.value.STONE_INCLUDE,
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "BASE_CURRENCY": this.commonService.nullToString(this.productionFrom.value.basecurrency),
      "BASE_CURR_RATE": this.commonService.emptyToZero(this.productionFrom.value.basecurrencyrate),
      "BASE_CONV_RATE": this.commonService.emptyToZero(this.productionFrom.value.baseConvRate),
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_PRODUCTION_SUB_DJ": this.STOCK_FORM_DETAILS,
      "JOB_PRODUCTION_DETAIL_DJ": this.DetailScreenDataToSave,
      "JOB_PRODUCTION_STNMTL_DJ": this.STOCK_COMPONENT_GRID, //component grid from stockscreen
      "JOB_PRODUCTION_LABCHRG_DJ": this.labourChargeDetailToSave,
      "JOB_PRODUCTION_METALRATE_DJ": this.productionMetalRateToSave
    }

    let Sub: Subscription = this.dataService
      .postDynamicAPI("JobProductionMaster/InsertJobProductionMaster", postData)
      .subscribe(
        (result) => {
            if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }else {
              this.commonService.toastErrorByMsgId('MSG3577')
            }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  update() {
    // if (this.productionFrom.invalid) {
    //   this.toastr.error("select all required fields");
    //   return;
    // }

    if (this.submitValidations(this.productionFrom.value)) return;


    let API = "JobProductionMaster/UpdateJobProductionMaster/" + this.productionFrom.value.branchCode + this.productionFrom.value.voctype + this.productionFrom.value.vocno + this.productionFrom.value.vocdate;
    let postData = {}

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
            if (result && result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }else {
              this.commonService.toastErrorByMsgId('MSG3577')
            }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      this.commonService.toastErrorByMsgId('MSG1531')
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteConfirmAPi()
      }
    });
  }
  deleteConfirmAPi() {
    let API = "JobProductionMaster/DeleteJobProductionMaster/" +
      this.productionFrom.value.branchCode + this.productionFrom.value.voctype +
      this.productionFrom.value.vocno + this.productionFrom.value.vocdate;
    let Sub: Subscription = this.dataService
      .deleteDynamicAPI(API)
      .subscribe(
        (result) => {
          if (result) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.productionFrom.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            } else {
              this.commonService.toastErrorByMsgId('MSG1531')
            }
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

      /**use: validate all lookups to check data exists in db */
      validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
        LOOKUPDATA.SEARCH_VALUE = event.target.value
        if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
        let param = {
          LOOKUPID: LOOKUPDATA.LOOKUPID,
          WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
        }
        this.commonService.toastInfoByMsgId('MSG81447');
        let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
        let Sub: Subscription = this.dataService.postDynamicAPI(API,param)
          .subscribe((result) => {
            let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
            if (data.length == 0) {
              this.commonService.toastErrorByMsgId('MSG1531')
              this.productionFrom.controls[FORMNAME].setValue('')
              LOOKUPDATA.SEARCH_VALUE = ''
              return
            }
           
          }, err => {
            this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          })
        this.subscriptions.push(Sub)
      }

      

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
