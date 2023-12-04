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
  producationEntryDetailsData: any[] = [];
  producationSubItemsData: any[] = [];
  STRNMTLdataSetToSave: any[] = [];
  labourChargeDetailToSave: any[] = [];
  productionMetalRateToSave: any[] = [];

  userName = this.commonService.userName;
  branchCode?: string;
  yearMonth?: string;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  private subscriptions: Subscription[] = [];

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
  }
  // main form
  productionFrom: FormGroup = this.formBuilder.group({
    voctype: ["", [Validators.required]],
    vocDate: ["", [Validators.required]],
    vocno: [""],
    enteredby: [""],
    currency: [""],
    currencyrate: [""],
    basecurrency: [""],
    basecurrencyrate: [""],
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

    modalRef.result.then((res) => {
      if (res) {
        console.log('Data from modal:', res);
        this.producationEntryDetailsData.push(res.postData);
        this.producationSubItemsData.push(res.jobProducationSubDetails);
      }
    });
  }


  deleteTableData() {

  }

  removedata() {
    this.tableData.pop();
  }
  
  /**USE: production metal rate data setup */
  productionMetalRate(){
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
  setLabourChargeDetailToSave(){
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
  /**STRNMTL data set to save */
  setSTRNMTLdataSet() {
    this.STRNMTLdataSetToSave.push({
      "VOCNO": 0,
      "VOCTYPE": this.commonService.nullToString(this.productionFrom.value.voctype),
      "VOCDATE": this.commonService.formatDateTime(this.productionFrom.value.vocDate),
      "JOB_NUMBER": "",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": "",
      "BRANCH_CODE": "",
      "DESIGN_CODE": "",
      "METALSTONE": "",
      "DIVCODE": "",
      "STOCK_CODE": "",
      "STOCK_DESCRIPTION": "",
      "COLOR": "",
      "CLARITY": "",
      "SHAPE": "",
      "SIZE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "RATELC": 0,
      "RATEFC": 0,
      "AMOUNT": 0,
      "PROCESS_CODE": "",
      "WORKER_CODE": "",
      "UNQ_DESIGN_ID": "",
      "REFMID": 0,
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "YEARMONTH": "",
      "LOSS_QTY": 0,
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_AMTLC": 0,
      "LAB_AMTFC": 0,
      "LAB_ACCODE": "",
      "SELLINGRATE": 0,
      "SELLINGVALUE": 0,
      "CUSTOMER_CODE": "",
      "PUREWT": 0,
      "PURITY": 0,
      "SQLID": "",
      "SIEVE": "",
      "SRNO": 0,
      "MAIN_STOCK_CODE": "",
      "STONE_WT": 0,
      "NET_WT": 0,
      "CONSIGNMENT": 0,
      "LOCTYPE_CODE": "",
      "HANDLING_CHARGEFC": 0,
      "HANDLING_CHARGELC": 0,
      "HANDLING_RATEFC": 0,
      "HANDLING_RATELC": 0,
      "PRICECODE": "",
      "SUB_STOCK_CODE": "",
      "SIEVE_SET": "",
      "KARAT_CODE": "",
      "PROCESS_TYPE": "",
      "SOH_ACCODE": "",
      "STK_ACCODE": "",
      "OTHER_ATTR": "",
      "PUREWTTEMP": 0
    })
  }
  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.productionFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }
    let currentDateTime = this.commonService.formatDateTime(this.currentDate)
    let API = "JobProductionMaster/InsertJobProductionMaster";
    let postData = {
      "MID": 0,
      "VOCTYPE": this.productionFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.productionFrom.value.vocno,
      "VOCDATE": this.productionFrom.value.vocDate,
      "YEARMONTH": this.commonService.nullToString(this.yearMonth),
      "DOCTIME": this.commonService.nullToString(currentDateTime),
      "CURRENCY_CODE": this.commonService.nullToString(this.productionFrom.value.currency),
      "CURRENCY_RATE": this.productionFrom.value.currencyrate,
      "METAL_RATE_TYPE": this.productionFrom.value.metalratetype,
      "METAL_RATE": this.productionFrom.value.metalrate,
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
      "SMAN": this.productionFrom.value.enteredby,
      "REMARKS": this.productionFrom.value.narration,
      "NAVSEQNO": this.commonService.emptyToZero(this.yearMonth),
      "FIX_UNFIX": this.productionFrom.value.UnfixTransaction ? true : false,
      "STONE_INCLUDE": this.productionFrom.value.STONE_INCLUDE ? 1 : 0,
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "BASE_CURRENCY": this.commonService.nullToString(this.productionFrom.value.basecurrency),
      "BASE_CURR_RATE": this.commonService.emptyToZero(this.productionFrom.value.basecurrencyrate),
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.nullToString(this.currentDate),
      "JOB_PRODUCTION_SUB_DJ": this.producationSubItemsData,
      "JOB_PRODUCTION_DETAIL_DJ": this.producationEntryDetailsData,
      "JOB_PRODUCTION_STNMTL_DJ": this.STRNMTLdataSetToSave,
      "JOB_PRODUCTION_LABCHRG_DJ": this.labourChargeDetailToSave,
      "JOB_PRODUCTION_METALRATE_DJ": this.productionMetalRateToSave
    }
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
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
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }


  update() {
    if (this.productionFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "JobProductionMaster/UpdateJobProductionMaster/" + this.productionFrom.value.branchCode + this.productionFrom.value.voctype + this.productionFrom.value.vocno + this.productionFrom.value.vocdate;
    let postData = {}

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
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
            }
          } else {
            this.toastr.error("Not saved");
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
