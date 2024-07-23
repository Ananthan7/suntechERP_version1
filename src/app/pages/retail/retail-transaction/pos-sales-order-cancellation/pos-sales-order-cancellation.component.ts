import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-pos-sales-order-cancellation",
  templateUrl: "./pos-sales-order-cancellation.component.html",
  styleUrls: ["./pos-sales-order-cancellation.component.scss"],
})
export class PosSalesOrderCancellationComponent implements OnInit {
  @Input() content!: any;
  currentDate = new Date();
  companyName = this.comService.allbranchMaster["BRANCH_NAME"];
  yearMonth?: any =
    localStorage.getItem("YEAR") || this.comService.yearSelected;
  branchCode?: any =
    localStorage.getItem("userbranch") || this.comService.branchCode;

  selectedMode: any;
  cashMode: boolean = false;
  chequeMode: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  salesOrderCancellationForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [""],
    vocDate: [new Date()],
    enteredBy: [""],
    customerCode: [""],
    customerName: [""],
    order: [""],
    orderDate: [new Date()],
    orderAmount: [""],
    advReceived: [""],
    ac: [""],
    acCode: [""],
    currency: [""],
    currencyRate: [""],
    orderAge: [""],
    noItem: [""],
    cheqNo: [""],
    cheqDate: [new Date()],
    cheqBank: [""],
    depBank: [""],
    cancellationCharge: [""],
    refundAmount: [""],
    orderCancel: [""],
    modeOfRefundSelect: [""],
  });

  ngOnInit(): void {
    this.content?.FLAG === "EDIT" || this.content?.FLAG === "VIEW"
      ? this.getDataToEdit(this.content)
      : console.log("ADD");

    this.salesOrderCancellationForm.controls["vocType"].setValue(
      this.comService.getqueryParamVocType()
    );
    this.generateVocNo();
    this.salesOrderCancellationForm.controls.currency.setValue(
      this.comService.compCurrency
    );
    this.salesOrderCancellationForm.controls.currencyRate.setValue(
      this.comService.getCurrRate(this.comService.compCurrency)
    );
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${
      this.branchCode
    }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.salesOrderCancellationForm.controls.vocNo.setValue(res.newvocno);
        }
      });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  changeitem(event: any) {
    this.selectedMode = event.value;

    if (this.selectedMode === "Cash") {
      this.cashMode = true;
      this.chequeMode = false;
    } else {
      this.cashMode = false;
      this.chequeMode = true;
    }
  }

  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  enteredBySelected(e: any) {
    this.salesOrderCancellationForm.controls["enteredBy"].setValue(
      e.SALESPERSON_CODE
    );
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "POS customerCode Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  customerCodeSelected(e: any) {
    this.salesOrderCancellationForm.controls["customerCode"].setValue(e.CODE);
    this.salesOrderCancellationForm.controls["customerName"].setValue(e.NAME);
  }

  orderCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 60,
    SEARCH_FIELD: "OrderCancellation",
    SEARCH_HEADING: "Order #",
    SEARCH_VALUE: "",
    WHERECONDITION: "OrderCancellation<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  orderCodeSelected(e: any) {
    this.salesOrderCancellationForm.controls["order"].setValue(e.NAME);
  }

  orderCancelCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Order Cancel A/c",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  orderCancelSelected(e: any) {
    this.salesOrderCancellationForm.controls["orderCancel"].setValue(e.ACCODE);
  }
  acCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "A/c",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  acCodeSelected(e: any) {
    this.salesOrderCancellationForm.controls["ac"].setValue(e.ACCOUNT_MODE);
    this.salesOrderCancellationForm.controls["acCode"].setValue(
      e["ACCOUNT HEAD"]
    );
  }

  getDataToEdit(data: any) {
    this.salesOrderCancellationForm.controls["vocType"].setValue(data.VOCTYPE);
    this.salesOrderCancellationForm.controls["vocNo"].setValue(data.VOCNO);
    this.salesOrderCancellationForm.controls["vocDate"].setValue(data.VOCDATE);
    this.salesOrderCancellationForm.controls["enteredBy"].setValue(
      data.SALESPERSON_CODE
    ),
      this.salesOrderCancellationForm.controls["customerCode"].setValue(
        data.POSCUSTCODE
      );
    // this.salesOrderCancellationForm.controls['customerName'].setvalue(data.)
    this.salesOrderCancellationForm.controls["order"].setValue(data.ORDER_REF);
    // this.salesOrderCancellationForm.controls['orderDate'].setValue(data.),
    this.salesOrderCancellationForm.controls["orderAmount"].setValue(
      data.ORDER_AMOUNTFC
    );
    this.salesOrderCancellationForm.controls["advReceived"].setValue(
      data.ADV_AMOUNTFC
    );
    this.salesOrderCancellationForm.controls["ac"].setValue(data.ACCODE);
    this.salesOrderCancellationForm.controls["acCode"].setValue(
      data.HDACCOUNT_HEAD
    );
    this.salesOrderCancellationForm.controls["currency"].setValue(
      data.CURRENCY_CODE
    );
    this.salesOrderCancellationForm.controls["currencyRate"].setValue(
      data.CURRENCY_RATE
    );
    // this.salesOrderCancellationForm.controls['orderAge']: [""],
    this.salesOrderCancellationForm.controls["noItem"].setValue(
      data.ITEM_COUNT
    );
    this.salesOrderCancellationForm.controls["cheqNo"].setValue(data.CHEQUE_NO);
    this.salesOrderCancellationForm.controls["cheqDate"].setValue(
      data.CHEQUE_DATE
    );
    this.salesOrderCancellationForm.controls["cheqBank"].setValue(
      data.CHEQUE_BANK
    );
    this.salesOrderCancellationForm.controls["depBank"].setValue(data.BANKCODE);
    this.salesOrderCancellationForm.controls["cancellationCharge"].setValue(
      data.CANCEL_CHARGECC
    );
    this.salesOrderCancellationForm.controls["refundAmount"].setValue(
      data.REFUND_AMOUNTCC
    );
    // this.salesOrderCancellationForm.controls['orderCancel'].setValue(data.CHEQUE_NO)
    this.salesOrderCancellationForm.controls["modeOfRefundSelect"].setValue(
      data.REFUND_MODE
    );
  }

  validateForm() {
    if (this.salesOrderCancellationForm.invalid) {
      this.toastr.error("Select all required fields");
      return false;
    }
    return true;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (!this.validateForm()) {
      return;
    }

    let API = "POSOrderCancel";
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.salesOrderCancellationForm.value.vocType,
      VOCNO: this.salesOrderCancellationForm.value.vocNo,
      YEARMONTH: this.yearMonth,
      VOCDATE: this.salesOrderCancellationForm.value.vocDate,
      POSCUSTCODE: this.salesOrderCancellationForm.value.customerCode,
      ADV_BRANCH_CODE: "",
      ADV_VOCTYPE: "",
      ADV_VOCNO: 0,
      ADV_YEARMONTH: "",
      ADV_VOCDATE: new Date(),
      ORDER_AMOUNTFC: this.salesOrderCancellationForm.value.orderAmount,
      ADV_AMOUNTFC: this.salesOrderCancellationForm.value.advReceived,
      REFUND_AMOUNTFC: 0,
      CANCEL_CHARGEFC: 0,
      REFUND_MODE: this.salesOrderCancellationForm.value.modeOfRefundSelect,
      CURRENCY_CODE: this.salesOrderCancellationForm.value.currency,
      CURRENCY_RATE: this.salesOrderCancellationForm.value.currencyRate,
      ORDER_AMOUNTCC: 0,
      ADV_AMOUNTCC: 0,
      REFUND_AMOUNTCC: this.salesOrderCancellationForm.value.refundAmount,
      CANCEL_CHARGECC: this.salesOrderCancellationForm.value.cancellationCharge,
      SYSTEM_DATE: new Date(),
      PAY_BRANCH_CODE: "",
      PAY_VOCTYPE: "",
      PAY_VOCNO: 0,
      PAY_YEARMONTH: "",
      SALESPERSON_CODE: this.salesOrderCancellationForm.value.enteredBy,
      REMARKS: "",
      NAVSEQNO: 0,
      ORDER_REF: this.salesOrderCancellationForm.value.order,
      ORDERDAYS: 0,
      ITEM_COUNT: this.salesOrderCancellationForm.value.noItem,
      ACCODE_CODE: "",
      CHEQUE_DATE: this.salesOrderCancellationForm.value.cheqDate,
      CHEQUE_NO: this.salesOrderCancellationForm.value.cheqNo,
      CHEQUE_BANK: this.salesOrderCancellationForm.value.cheqBank,
      BANKCODE: this.salesOrderCancellationForm.value.depBank,
      HDACCOUNT_HEAD: this.salesOrderCancellationForm.value.acCode,
      ACCODE: this.salesOrderCancellationForm.value.ac,
      PDCYN: "",
      GJVMID: 0,
      GJVREFERENCE: "",
    };

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.salesOrderCancellationForm.reset();
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
    if (this.salesOrderCancellationForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = `POSOrderCancel/${
      this.branchCode
    }/${this.comService.getqueryParamVocType()}/${
      this.salesOrderCancellationForm.value.vocNo
    }/${this.yearMonth}`;
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.salesOrderCancellationForm.value.vocType,
      VOCNO: this.salesOrderCancellationForm.value.vocNo,
      YEARMONTH: this.yearMonth,
      VOCDATE: this.salesOrderCancellationForm.value.vocDate,
      POSCUSTCODE: this.salesOrderCancellationForm.value.customerCode,
      ADV_BRANCH_CODE: "",
      ADV_VOCTYPE: "",
      ADV_VOCNO: 0,
      ADV_YEARMONTH: "",
      ADV_VOCDATE: new Date(),
      ORDER_AMOUNTFC: this.salesOrderCancellationForm.value.orderAmount,
      ADV_AMOUNTFC: this.salesOrderCancellationForm.value.advReceived,
      REFUND_AMOUNTFC: 0,
      CANCEL_CHARGEFC: 0,
      REFUND_MODE: this.salesOrderCancellationForm.value.modeOfRefundSelect,
      CURRENCY_CODE: this.salesOrderCancellationForm.value.currency,
      CURRENCY_RATE: this.salesOrderCancellationForm.value.currencyRate,
      ORDER_AMOUNTCC: 0,
      ADV_AMOUNTCC: 0,
      REFUND_AMOUNTCC: this.salesOrderCancellationForm.value.refundAmount,
      CANCEL_CHARGECC: this.salesOrderCancellationForm.value.cancellationCharge,
      SYSTEM_DATE: new Date(),
      PAY_BRANCH_CODE: "",
      PAY_VOCTYPE: "",
      PAY_VOCNO: 0,
      PAY_YEARMONTH: "",
      SALESPERSON_CODE: this.salesOrderCancellationForm.value.enteredBy,
      REMARKS: "",
      NAVSEQNO: 0,
      ORDER_REF: this.salesOrderCancellationForm.value.order,
      ORDERDAYS: 0,
      ITEM_COUNT: this.salesOrderCancellationForm.value.noItem,
      ACCODE_CODE: "",
      CHEQUE_DATE: this.salesOrderCancellationForm.value.cheqDate,
      CHEQUE_NO: this.salesOrderCancellationForm.value.cheqNo,
      CHEQUE_BANK: this.salesOrderCancellationForm.value.cheqBank,
      BANKCODE: this.salesOrderCancellationForm.value.depBank,
      HDACCOUNT_HEAD: this.salesOrderCancellationForm.value.ac,
      ACCODE: this.salesOrderCancellationForm.value.acCode,
      PDCYN: "",
      GJVMID: 0,
      GJVREFERENCE: "",
    };

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.salesOrderCancellationForm.reset();
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

  close(data?: any) {
    this.activeModal.close(data);
  }
}
