import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-tourist-vat-refund-verification",
  templateUrl: "./tourist-vat-refund-verification.component.html",
  styleUrls: ["./tourist-vat-refund-verification.component.scss"],
})
export class TouristVatRefundVerificationComponent implements OnInit {
  @Input() content!: any;
  yearMonth?: any =
    localStorage.getItem("YEAR") || this.comService.yearSelected;
  branchCode?: any =
    localStorage.getItem("userbranch") || this.comService.branchCode;
  private subscriptions: Subscription[] = [];

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead: any[] = [
    "Sr.No",
    "VOCDATE",
    " TRS No",
    " VOC TYPE",
    "VOC NO",
    "Sales Amt",
    "Planet Amt",
    "VAT Amt",
    "Planet Vat Amt",
  ];

  touristVatRefundVerificationForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [""],
    vocDate: [this.currentDate],
    partyCode: [""],
    partycodeName: [""],
    partyCurrency: [""],
    partyCurrencyRate: [""],
    enteredBy: [""],
    enteredByCode: [""],
    fromDate: [this.currentDate],
    toDate: [this.currentDate],
    partyAddress: [""],
    narration: [""],
    totalSale: [""],
    totalVat: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.content?.FLAG === "VIEW" || this.content?.FLAG === "EDIT"
      ? this.getDataToSet(this.content)
      : this.generateVocNoAndDefaultSet();
  }

  generateVocNoAndDefaultSet() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${
      this.branchCode
    }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res);

          this.touristVatRefundVerificationForm.controls.vocNo.setValue(
            res.newvocno
          );
          this.touristVatRefundVerificationForm.controls.vocDate.setValue(
            this.currentDate
          );
          this.touristVatRefundVerificationForm.controls.fromDate.setValue(
            this.currentDate
          );
          this.touristVatRefundVerificationForm.controls.toDate.setValue(
            this.currentDate
          );
          this.touristVatRefundVerificationForm.controls.vocType.setValue(
            this.comService.getqueryParamVocType()
          );
        }
      });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
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
    console.log(e);
    this.touristVatRefundVerificationForm.controls.enteredBy.setValue(
      e.SALESPERSON_CODE
    );
    this.touristVatRefundVerificationForm.controls.enteredByCode.setValue(
      e.DESCRIPTION
    );
  }

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

  partyCodeSelected(e: any) {
    console.log(e);
    this.touristVatRefundVerificationForm.controls.partyCode.setValue(e.ACCODE);
  }

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Currency Code",
    SEARCH_VALUE: "",
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  partyCurrencyCodeSelected(e: any) {
    console.log(e);
    this.touristVatRefundVerificationForm.controls.partyCurrency.setValue(
      e.Currency
    );
    this.touristVatRefundVerificationForm.controls.partyCurrencyRate.setValue(
      e["Conv Rate"]
    );
  }

  getDataToSet(data: any) {
    console.log(data);
  }

  validateForm() {
    if (this.touristVatRefundVerificationForm.invalid) {
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

    let API = "VATRefund/InsertVATRefund";
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.touristVatRefundVerificationForm.value.vocType,
      VOCNO: this.touristVatRefundVerificationForm.value.vocNo,
      VOCDATE: this.touristVatRefundVerificationForm.value.vocDate,
      YEARMONTH: this.yearMonth,
      PARTYCODE: this.touristVatRefundVerificationForm.value.partyCode,
      PARTY_CURRENCY: this.touristVatRefundVerificationForm.value.partyCurrency,
      PARTY_CURR_RATE:
        this.touristVatRefundVerificationForm.value.partyCurrencyRate,
      SALESPERSON_CODE: this.touristVatRefundVerificationForm.value.enteredBy,
      REMARKS: this.touristVatRefundVerificationForm.value.narration,
      SYSTEM_DATE: new Date(),
      NAVSEQNO: 0,
      HHACCOUNT_HEAD: "",
      HTUSERNAME: "",
      SUPINVNO: "",
      SUPINVDATE: new Date(),
      DATEFROM: this.touristVatRefundVerificationForm.value.fromDate,
      DATETO: this.touristVatRefundVerificationForm.value.toDate,
      INVOICE_DATESETTING: "",
      TAGNOSETTING: "",
      VOCTYPESETTING: "",
      VOCNOSETTING: "",
      SALESAMOUNTSETTING: "",
      PLANETAMOUNTSETTING: "",
      VATAMOUNTSETTING: "",
      PLANETVATAMOUNTSETTING: "",
      AUTOPOSTING: true,
      POSTDATE: "",
      TOTALPLANETSALESAMOUNTCC: 0,
      TOTALPLANETVATAMOUNTCC: 0,
      TOTALSALESAMOUNTCC: this.touristVatRefundVerificationForm.value.totalSale,
      TOTALSALESVATAMOUNTCC:
        this.touristVatRefundVerificationForm.value.totalVat,
      GJVREFERENCE: "",
      GJVMID: 0,
      VAT_REFUND_REMARKS: "",
      Details: [
        {
          UNIQUEID: 0,
          SRNO: 0,
          INVOICE_DATE: new Date(),
          TAGNO: "",
          VOCTYPE: "",
          VOCNO: 0,
          SALESAMOUNT: 0,
          PLANETAMOUNT: 0,
          VATAMOUNT: 0,
          PLANETVATAMOUNT: 0,
          INVMID: 0,
          TRABRANCHCODE: "",
          DT_BRANCH_CODE: "",
          DT_VOCNO: 0,
          DT_VOCTYPE: "",
          DT_YEARMONTH: "",
        },
      ],
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
                  this.touristVatRefundVerificationForm.reset();
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
    if (this.touristVatRefundVerificationForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = `VATRefund/UpdateVATRefund/${
      this.branchCode
    }/${this.comService.getqueryParamVocType()}/${
      this.touristVatRefundVerificationForm.value.vocNo
    }/${this.yearMonth}`;
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.touristVatRefundVerificationForm.value.vocType,
      VOCNO: this.touristVatRefundVerificationForm.value.vocNo,
      VOCDATE: this.touristVatRefundVerificationForm.value.vocDate,
      YEARMONTH: this.yearMonth,
      PARTYCODE: this.touristVatRefundVerificationForm.value.partyCode,
      PARTY_CURRENCY: this.touristVatRefundVerificationForm.value.partyCurrency,
      PARTY_CURR_RATE:
        this.touristVatRefundVerificationForm.value.partyCurrencyRate,
      SALESPERSON_CODE: this.touristVatRefundVerificationForm.value.enteredBy,
      REMARKS: this.touristVatRefundVerificationForm.value.narration,
      SYSTEM_DATE: new Date(),
      NAVSEQNO: 0,
      HHACCOUNT_HEAD: "",
      HTUSERNAME: "",
      SUPINVNO: "",
      SUPINVDATE: new Date(),
      DATEFROM: this.touristVatRefundVerificationForm.value.fromDate,
      DATETO: this.touristVatRefundVerificationForm.value.toDate,
      INVOICE_DATESETTING: "",
      TAGNOSETTING: "",
      VOCTYPESETTING: "",
      VOCNOSETTING: "",
      SALESAMOUNTSETTING: "",
      PLANETAMOUNTSETTING: "",
      VATAMOUNTSETTING: "",
      PLANETVATAMOUNTSETTING: "",
      AUTOPOSTING: true,
      POSTDATE: "",
      TOTALPLANETSALESAMOUNTCC: 0,
      TOTALPLANETVATAMOUNTCC: 0,
      TOTALSALESAMOUNTCC: this.touristVatRefundVerificationForm.value.totalSale,
      TOTALSALESVATAMOUNTCC:
        this.touristVatRefundVerificationForm.value.totalVat,
      GJVREFERENCE: "",
      GJVMID: 0,
      VAT_REFUND_REMARKS: "",
      Details: [
        {
          UNIQUEID: 0,
          SRNO: 0,
          INVOICE_DATE: new Date(),
          TAGNO: "",
          VOCTYPE: "",
          VOCNO: 0,
          SALESAMOUNT: 0,
          PLANETAMOUNT: 0,
          VATAMOUNT: 0,
          PLANETVATAMOUNT: 0,
          INVMID: 0,
          TRABRANCHCODE: "",
          DT_BRANCH_CODE: "",
          DT_VOCNO: 0,
          DT_VOCTYPE: "",
          DT_YEARMONTH: "",
        },
      ],
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
                  this.touristVatRefundVerificationForm.reset();
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
