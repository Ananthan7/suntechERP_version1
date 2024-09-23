import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-tourist-vat-refund-verification",
  templateUrl: "./tourist-vat-refund-verification.component.html",
  styleUrls: ["./tourist-vat-refund-verification.component.scss"],
})
export class TouristVatRefundVerificationComponent implements OnInit {
  @Input() content!: any;
  amountDecimalFormat: any;
  yearMonth?: any =
    localStorage.getItem("YEAR") || this.comService.yearSelected;
  branchCode?: any =
    localStorage.getItem("userbranch") || this.comService.branchCode;
  private subscriptions: Subscription[] = [];
  viewOnly: boolean = false;
  editOnly: boolean = false;
  vocMaxDate = new Date();
  currentDate = new Date();
  pulledInvoice: any;
  salesPersonOptions: any[] = [];
  columnhead: any[] = [
    "Sr.No",
    "VOCDATE",
    "TRS No",
    "VOC TYPE",
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
    partyCodeHead: [""],
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
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.content?.FLAG === "VIEW" || this.content?.FLAG === "EDIT"
      ? this.getRetailSalesMaster(this.content)
      : this.generateVocNoAndDefaultSet();

    this.amountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
    };
  }

  onSelectionChanged(selectionInfo: any) {
    console.log(selectionInfo);
    const selectedData = selectionInfo.selectedRowsData;
    selectedData.forEach((rowData: any) => {
      console.log(rowData);
    });
  }

  pullInvoices() {
    let postData = {
      FromDate: this.touristVatRefundVerificationForm.value.fromDate,
      ToDate: this.touristVatRefundVerificationForm.value.toDate,
      BranchCode: this.branchCode,
      DefBranchCode: this.branchCode,
    };
    let API = `VATRefund/GetUspPullInvoicesWeb`;
    let sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res);
          this.pulledInvoice = res.dynamicData[0].map((invoice: any) => ({
            ...invoice,
            SRNO: invoice.srno,
          }));


          let vatAmountSum = this.pulledInvoice.reduce((acc: any, obj: any) => acc + (obj.VATAMOUNT ?? 0), 0);
          let salesAmountSum = this.pulledInvoice.reduce((acc: any, obj: any) => acc + (obj.SALESAMOUNT ?? 0), 0);


          this.touristVatRefundVerificationForm.controls["totalSale"].setValue(
            this.comService.transformDecimalVB(
              this.comService.allbranchMaster?.BAMTDECIMALS,
              this.comService.emptyToZero(salesAmountSum)
            )

          );

          this.touristVatRefundVerificationForm.controls["totalVat"].setValue(
            this.comService.transformDecimalVB(
              this.comService.allbranchMaster?.BAMTDECIMALS,
              this.comService.emptyToZero(vatAmountSum)
            )

          );


        }
      });
  }

  generateVocNoAndDefaultSet() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.branchCode
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
    this.touristVatRefundVerificationForm.controls.partyCodeHead.setValue(
      e.ACCOUNT_HEAD
    );
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
      this.comService.decimalQuantityFormat(e["Conv Rate"], "RATE")
    );
  }

  getRetailSalesMaster(data: any) {
    this.getSalesPersonMaster()

    if (this.content.FLAG == 'VIEW')
      this.viewOnly = true;
    if (this.content.FLAG == "EDIT") {
      this.editOnly = true
    }

    this.snackBar.open('Loading...');
    let API = `VATRefund/GetVATRefundDetailwithAllParam/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.VOCNO}/${data.YEARMONTH}/${data.MID}`
    this.dataService.getDynamicAPI(API).subscribe((res) => {


      if (res.status == 'Success') {
        this.snackBar.dismiss();
        console.log('res', res);
        const data = res.response;
        this.getDataToSet(data);
        this.pulledInvoice = data.Details;



      }
    })
  }

  getSalesPersonMaster() {
    let sub: Subscription = this.dataService.getDynamicAPI('SalesPersonMaster/GetSalespersonMasterList')

      .subscribe((resp: any) => {
        var data = resp.response;
        this.salesPersonOptions = data;

      });
  }

  getDataToSet(data: any) {
    this.touristVatRefundVerificationForm.controls["vocType"].setValue(
      data.VOCTYPE
    );
    this.touristVatRefundVerificationForm.controls["vocNo"].setValue(
      data.VOCNO
    );
    this.touristVatRefundVerificationForm.controls["vocDate"].setValue(
      data.VOCDATE
    );
    this.touristVatRefundVerificationForm.controls["partyCode"].setValue(
      data.PARTYCODE
    );
    this.touristVatRefundVerificationForm.controls["partyCurrency"].setValue(
      data.PARTY_CURRENCY
    );
    this.touristVatRefundVerificationForm.controls["partyCodeHead"].setValue(
      data.HHACCOUNT_HEAD
    );
    this.touristVatRefundVerificationForm.controls[
      "partyCurrencyRate"
    ].setValue(data.PARTY_CURR_RATE);

    this.touristVatRefundVerificationForm.controls["enteredBy"].setValue(
      data.SALESPERSON_CODE
    );

    let salesPersonDetails = this.salesPersonOptions.find(item => item.SALESPERSON_CODE === data.SALESPERSON_CODE);

    this.touristVatRefundVerificationForm.controls["enteredByCode"].setValue(
      salesPersonDetails.DESCRIPTION
    );
    this.touristVatRefundVerificationForm.controls["narration"].setValue(
      data.REMARKS
    );
    this.touristVatRefundVerificationForm.controls["fromDate"].setValue(
      data.DATEFROM
    );
    this.touristVatRefundVerificationForm.controls["toDate"].setValue(
      data.DATETO
    );
    this.touristVatRefundVerificationForm.controls["totalSale"].setValue(
      data.TOTALSALESAMOUNTCC
    );
    this.touristVatRefundVerificationForm.controls["totalVat"].setValue(
      data.TOTALSALESVATAMOUNTCC
    );

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
      HHACCOUNT_HEAD: this.touristVatRefundVerificationForm.value.partyCodeHead ?? "",
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
      TOTALSALESAMOUNTCC: this.touristVatRefundVerificationForm.value.totalSale ?? 0,
      TOTALSALESVATAMOUNTCC: this.touristVatRefundVerificationForm.value.totalVat ?? 0,
      GJVREFERENCE: "",
      GJVMID: 0,
      VAT_REFUND_REMARKS: "",
      Details: this.pulledInvoice.map((invoice: any) => ({
        ...invoice,
        INVOICE_DATE: new Date(invoice.INVOICE_DATE),
      })),
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

    let API = `VATRefund/UpdateVATRefund/${this.branchCode
      }/${this.comService.getqueryParamVocType()}/${this.touristVatRefundVerificationForm.value.vocNo
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
      HHACCOUNT_HEAD: this.touristVatRefundVerificationForm.value.partyCodeHead ?? "",
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
      TOTALSALESAMOUNTCC: this.touristVatRefundVerificationForm.value.totalSale ?? 0,
      TOTALSALESVATAMOUNTCC: this.touristVatRefundVerificationForm.value.totalVat ?? 0,
      GJVREFERENCE: "",
      GJVMID: 0,
      VAT_REFUND_REMARKS: "",
      Details: this.pulledInvoice.map((invoice: any) => ({
        ...invoice,
        INVOICE_DATE: new Date(invoice.INVOICE_DATE),
      })),
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
