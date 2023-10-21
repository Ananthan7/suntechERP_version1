import { Component, Input, OnInit } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ProductionEntryDetailsComponent } from "./production-entry-details/production-entry-details.component";

@Component({
  selector: "app-production-mfg",
  templateUrl: "./production-mfg.component.html",
  styleUrls: ["./production-mfg.component.scss"],
})
export class ProductionMfgComponent implements OnInit {
  columnhead: any[] = [    "No",    "Job#",    "Sub Job",    "Design",    "Pcs",    "Metal",    "Stone",    "Gross Wt",    "St Pcs",    "Process", ];
  columnheads: any[] = [""];
  @Input() content!: any;
  tableData: any[] = [];
  producationEntryDetailsData: any[] = [];
  producationSubItemsData: any[] = [];

  userName = localStorage.getItem("username");
  branchCode?: string;
  yearMonth?: string;
  vocMaxDate = new Date();
  currentDate = new Date();

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

  
  productionFrom: FormGroup = this.formBuilder.group({
    voctype: [""],
    vocDate: [""],
    vocno: [""],
    enteredby: [""], // No
    currency: [""],
    currencyrate: [""],
    basecurrency: [""],
    basecurrencyrate: [""],
    time: [""],
    metalrate: [""],
    metalratetype: [""],
    branchto: [""], // No
    narration: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openproductionentrydetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      ProductionEntryDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.result.then((res) => {
      console.log(res);      
      if (res) {
        console.log('Data from modal:', res);       
        this.producationEntryDetailsData.push(res.postData);
        this.producationSubItemsData.push(res.jobProducationSubDetails);
      }
    });
  }



  removedata() {
    this.tableData.pop();
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

    let API = "JobProductionMaster/InsertJobProductionMaster";
    let postData = {
      "MID": 0,
      "VOCTYPE": this.productionFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.productionFrom.value.vocno,
      "VOCDATE": this.productionFrom.value.vocDate,
      "YEARMONTH":  this.yearMonth,
      "DOCTIME": "2023-10-17T12:41:20.126Z",
      "CURRENCY_CODE": this.productionFrom.value.currency,
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
      "SMAN":  this.productionFrom.value.enteredby,
      "REMARKS": this.productionFrom.value.narration,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "STONE_INCLUDE": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": this.productionFrom.value.basecurrencyrate,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-17T12:41:20.126Z",
      "JOB_PRODUCTION_SUB_DJ": this.producationSubItemsData,
      "JOB_PRODUCTION_DETAIL_DJ": this.producationEntryDetailsData,
      "JOB_PRODUCTION_STNMTL_DJ": [
        {
          "VOCNO": 0,
          "VOCTYPE": "",
          "VOCDATE": "2023-10-17T12:41:20.127Z",
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
        }
      ],
      "JOB_PRODUCTION_LABCHRG_DJ": [
        {
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
        }
      ],
      "JOB_PRODUCTION_METALRATE_DJ": [
        {
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
        }
      ]
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

    let API ="JobProductionMaster/UpdateJobProductionMaster/" + this.productionFrom.value.branchCode + this.productionFrom.value.voctype + this.productionFrom.value.vocno + this.productionFrom.value.vocdate;
      let postData = {
        "MID": 0,
        "VOCTYPE": this.productionFrom.value.voctype,
        "BRANCH_CODE": this.branchCode,
        "VOCNO": this.productionFrom.value.vocno,
        "VOCDATE": this.productionFrom.value.vocDate,
        "YEARMONTH":  this.yearMonth,
        "DOCTIME": "2023-10-17T12:41:20.126Z",
        "CURRENCY_CODE": this.productionFrom.value.currency,
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
        "SMAN":  this.productionFrom.value.enteredby,
        "REMARKS": this.productionFrom.value.narration,
        "NAVSEQNO": 0,
        "FIX_UNFIX": true,
        "STONE_INCLUDE": true,
        "AUTOPOSTING": true,
        "POSTDATE": "",
        "BASE_CURRENCY": "stri",
        "BASE_CURR_RATE": this.productionFrom.value.basecurrency,
        "BASE_CONV_RATE": this.productionFrom.value.basecurrencyrate,
        "PRINT_COUNT": 0,
        "INTER_BRANCH":"",
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "SYSTEM_DATE": "2023-10-17T12:41:20.126Z",
        "JOB_PRODUCTION_SUB_DJ": this.producationSubItemsData,
        "JOB_PRODUCTION_DETAIL_DJ": this.producationEntryDetailsData,
        "JOB_PRODUCTION_STNMTL_DJ": [
          {
            "VOCNO": 0,
            "VOCTYPE": "",
            "VOCDATE": "2023-10-17T12:41:20.127Z",
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
          }
        ],
        "JOB_PRODUCTION_LABCHRG_DJ": [
          {
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
          }
        ],
        "JOB_PRODUCTION_METALRATE_DJ": [
          {
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
          }
        ]
      }

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
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
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
        let API =
          "JobProductionMaster/DeleteJobProductionMaster/" +
          this.productionFrom.value.branchCode +
          this.productionFrom.value.voctype +
          this.productionFrom.value.vocno +
          this.productionFrom.value.vocdate;
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
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.productionFrom.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
