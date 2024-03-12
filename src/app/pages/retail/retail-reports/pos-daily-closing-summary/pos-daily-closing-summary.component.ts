import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { PosSalesmanDetailsComponent } from "./pos-salesman-details/pos-salesman-details.component";
import { PosDailyClosingBranchComponent } from "./pos-daily-closing-branch/pos-daily-closing-branch.component";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-pos-daily-closing-summary",
  templateUrl: "./pos-daily-closing-summary.component.html",
  styleUrls: ["./pos-daily-closing-summary.component.scss"],
})
export class PosDailyClosingSummaryComponent implements OnInit {
  @Input() content!: any;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  columnhead: any[] = ["No.Inv", "Amt.Rcvd", "Gold", "Dia & Other"];
  columnheadTransaction: any[] = ["Voucher", "No.Inv", "Amount"];
  columnheadMetal: any[] = [
    "Division",
    "Type",
    "Pcs",
    "Gms",
    "Pure Wt",
    "St.Qty",
    "St.Amt",
    "Mkg.Rate",
    "Mkg.Value",
    "Metal Value",
    "Total Amount",
  ];
  columnheadDiamond: any[] = ["Division", "Type", "Pcs", "Weight", " Amount"];
  columnheadReceipt: any[] = ["Rcvd.In", " Amount"];
  columnheadScrap: any[] = ["Item Code", "Gross Wt", " Amount"];
  columnheadSales: any[] = [
    "Salesman",
    "#Docs",
    "Tot Amount",
    "Gold",
    "Dia & Others",
    "Mkg.Value",
  ];
  columnheadSalesManDetails: any[] = ["Sales Man", "#Dos"];
  userbranch = localStorage.getItem("userbranch");
  branchCode?: String;
  yearMonth?: String;
  divisionMS: any = "ID";
  metalOptions = [
    { value: "TYPE", label: "TYPE" },
    { value: "KARAT", label: "KARAT" },
    { value: "BRAND", label: "BRAND" },
    { value: "COUNTRY", label: "COUNTRY" },
    { value: "STOCK CODE", label: "STOCK CODE" },
    { value: "CATEGORY", label: "CATEGORY" },
    { value: "COST CODE", label: "COST CODE" },
    { value: "TYPE", label: "TYPE" },
    { value: "KARAT", label: "KARAT" },
    { value: "BRAND", label: "BRAND" },
    { value: "COUNTRY", label: "COUNTRY" },
    { value: "STOCK CODE", label: "STOCK CODE" },
    { value: "CATEGORY", label: "CATEGORY" },
    { value: "COST CODE", label: "COST CODE" },
  ];

  transactionOptions = [
    { value: "Sales", label: "Sales" },
    { value: "Sales Returns", label: "Sales Returns" },
    { value: "Net Sales", label: "Net Sales" },
  ];

  posDailyClosingSummaryForm: FormGroup = this.formBuilder.group({
    transactionType: [""],
    metalType: [""],
    diamondType: [""],
    fromDate: [new Date()],
    toDate: [new Date()],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private dataService: SuntechAPIService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.metalInsert();
    this.diamondInsert();
    this.salesManclosingInsert();
    this.vocherInsert();
    this.closingPurchaseNetInsert();
    this.posClsngSmanSummaryNet();
  }

  metalInsert() {
    let API = "UspPosClosingMetalSalesNet";

    let postData = {
      "strSalType": 0,
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.metalType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  diamondInsert() {
    let API = "UspPosClsngDiamondSalesNet";
    let postData = {
      "strSalType": 0,      
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
      "str_MGroupBy": this.posDailyClosingSummaryForm.value.diamondType,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  salesManclosingInsert() {
    let API = "UspOpsClsngSmanSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  vocherInsert() {
    let API = "UspPosClosingVoucherSummaryNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  closingPurchaseNetInsert() {
    let API = "UspPosClosingPosPurchaseNet";
    let postData = {    
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              console.log(result.response);                      
              this.tableData = [];
            }
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  posClsngSmanSummaryNet(){
    let API = "UspPosClsngSmanSummaryNet";
    let postData = { 
      "SalType": 0,   
      "strBranch": this.branchCode,
      "strFmDate": this.posDailyClosingSummaryForm.value.fromDate,
      "strToDate": this.posDailyClosingSummaryForm.value.toDate,
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            console.log(result.response);                      
              this.tableData = [];
          } 
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  formSubmit() {}

  update() {}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openPosDailyClosingBranch() {
    const modalRef: NgbModalRef = this.modalService.open(
      PosDailyClosingBranchComponent,
      {
        size: "lg",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
  }

  openaddstonereturndetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      PosSalesmanDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
  }
}
