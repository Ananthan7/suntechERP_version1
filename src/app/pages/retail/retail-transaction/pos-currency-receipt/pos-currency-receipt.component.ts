import { Component, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { PosCurrencyReceiptDetailsComponent } from "./pos-currency-receipt-details/pos-currency-receipt-details.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PosCustomerMasterComponent } from "../common/pos-customer-master/pos-customer-master.component";
import { DxDataGridComponent } from "devextreme-angular";
import { startOfDay } from "@fullcalendar/angular";
import { IndexedDbService } from "src/app/services/indexed-db.service";
import { AuditTrailComponent } from "src/app/shared/common/audit-trail/audit-trail.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { ItemDetailService } from "src/app/services/modal-service.service";

@Component({
  selector: "app-pos-currency-receipt",
  templateUrl: "./pos-currency-receipt.component.html",
  styleUrls: ["./pos-currency-receipt.component.scss"],
})
export class PosCurrencyReceiptComponent implements OnInit {
  // @ViewChild(DxDataGridComponent, { static: false }) dataGrid?: DxDataGridComponent;
  @ViewChild("overlayPartyCode") overlayPartyCode!: MasterSearchComponent;
  @ViewChild("overlayEnteredCode") overlayEnteredCode!: MasterSearchComponent;
  @ViewChild("overlayCustomerCode") overlayCustomerCode!: MasterSearchComponent;

  @ViewChild(AuditTrailComponent) auditTrailComponent?: AuditTrailComponent;

  @Input() content!: any; //use: To get clicked row details from master grid
  // columnhead: any[] = ['Sr#', 'Branch', 'Mode', 'A/c Code', 'Account Head', '', 'Curr.Rate', 'VAT_E_', 'VAT_E_'];
  columnsList: any[] = [
    { title: "Sr #", field: "SRNO" },
    { title: "Branch", field: "BRANCH_CODE" },
    { title: "Mode", field: "MODE" },
    { title: "A/c Code", field: "ACCODE" },
    { title: "Account Head", field: "HDACCOUNT_HEAD" },
    { title: "Currency", field: "CURRENCY_CODE" },
    { title: "Curr.Rate", field: "CURRENCY_RATE" },
    { title: "Amount", field: "AMOUNTFC" },
    { title: "VAT_E_", field: "IGST_AMOUNTCC" },
    { title: "Total", field: "NET_TOTAL" },
  ];

  currencyData: MasterSearchModel = {
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

  viewOnly: boolean = false;
  editOnly: boolean = false;
  midForInvoce: any = 0;
  posCurrencyDetailsData: any[] = [];
  private subscriptions: Subscription[] = [];
  amlNameValidation?: boolean;
  customerData: any;
  baseYear: any = localStorage.getItem("YEAR") || "";
  strBranchcode: any = localStorage.getItem("userbranch");
  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  yearMonth?: String;
  userName?: String;
  companyCurrency?: String;
  gridAmountDecimalFormat: any;
  isCurrencyUpdate: boolean = false;
  vatPercentage: string = "";
  hsnCode: string = "";
  igst_accode: string = "";
  currencyCode: any;
  currencyConvRate: any;

  isCustomerRequired = false;
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

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "CURRENCY_CODE",
    SEARCH_HEADING: "Party Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: `ACCODE<> ''AND BRANCH_CODE = '${this.strBranchcode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING:
      "POS Customer Master (Type any details about the customer to search the master list) ",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    FRONTENDFILTER: true,

  };
  selectedIndexes: any = [];
  maxDate!: Date;
  posCurrencyReceiptForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [""],
    vocDate: [""],
    partyCode: [""],
    partyCodeDesc: [""], // No
    partyCurrency: [""],
    partyCurrencyRate: [""],
    enteredby: ["", Validators.required], // No
    enteredbyuser: ["", Validators.required], // No
    dueDaysdesc: [""],
    dueDays: [new Date()], // no
    customerCode: [""],
    customerName: [""],
    mobile: [""],
    email: [""],
    partyAddress: [""],
    schemaCode: [""],
    schemaId: [""],
    partyCurr: [], // need to remove the value
    partyAmountFC: [0.0], // need to remove the value
    narration: [""],
    totalTax: [""],
    total: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    public comService: CommonServiceService,
    private indexedDb: IndexedDbService,
    private renderer: Renderer2,
    private dialogService: ItemDetailService,


  ) {
    this.gridAmountDecimalFormat = {
      type: "fixedPoint",
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency,
    };

    this.companyCurrency = this.comService.compCurrency;

    console.log(this.isCustomerRequired);
  }

  async ngOnInit(): Promise<void> {
    await this.loadCompanyParams();
    this.maxDate = new Date(this.currentDate);
    this.maxDate.setDate(this.maxDate.getDate() + 365);
    console.log(this.isCustomerRequired);
    // this.posCurrencyReceiptForm.controls['vocType'].disable();
    // this.posCurrencyReceiptForm.controls['vocNo'].disable();

    this.branchCode = this.comService.branchCode;
    // this.yearMonth = this.comService.yearSelected;
    this.userName = this.comService.userName;

    let branchParams: any = localStorage.getItem("BRANCH_PARAMETER");
    this.comService.allbranchMaster = JSON.parse(branchParams);

    this.amlNameValidation = this.comService.allbranchMaster.AMLNAMEVALIDATION;

    this.posCurrencyReceiptForm.controls.vocDate.setValue(this.currentDate);
    this.posCurrencyReceiptForm.controls.vocType.setValue(
      this.comService.getqueryParamVocType()
    );

    this.getFinancialYear();

    if (this.content?.MID != null) this.getArgsData();
    else {
      this.changeDueDate(null);
      this.generateVocNo();
      this.getPartyCode();
      console.log("Working+++++");
    }
    this.renderer.selectRootElement('#vocDateInput').focus();
  }



  private loadCompanyParams(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.indexedDb.getAllData("compparams").subscribe(
        (data) => {
          if (data.length > 0) {
            console.log("==============compparams======================");
            console.log(data);
            console.log("====================================");
            this.comService.allCompanyParams = data;
            this.comService.allCompanyParams.forEach((param: any) => {
              if (param.PARAMETER === "PCRPOSCUSTCOMPULSORY") {
                this.isCustomerRequired = param.PARAM_VALUE === "1";
              }
            });
          }
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.strBranchcode
      }/${this.baseYear}/${this.convertDateToYMD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API).subscribe((resp) => {
      if (resp.status == "Success") {
        this.posCurrencyReceiptForm.controls.vocNo.setValue(resp.newvocno);
      }
    });
  }

  getPartyCode() {
    const API = `AdvanceReceiptParty/${this.strBranchcode}`;
    this.dataService.getDynamicAPI(API).subscribe((resp) => {
      if (resp.status == "Success") {
        console.log("resp", resp.Accode);
        this.posCurrencyReceiptForm.controls.partyCode.setValue(resp.Accode);
        this.getGSTDetails(resp.Accode);
        this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(
          resp.AccountHead
        );
        this.partyCodeChange({ target: { value: resp.Accode } });
      }
    });
  }

  updateDueDays(event: any) {
    let value = event.target.value;
    if (value != "") {
      const vocDate = new Date(this.posCurrencyReceiptForm.value.vocDate);
      const updatedDate = vocDate.getDate() + parseInt(value);
      vocDate.setDate(updatedDate);
      this.posCurrencyReceiptForm.controls.dueDays.setValue(vocDate);
    } else {
      this.posCurrencyReceiptForm.controls.dueDays.setValue(this.currentDate);
    }
  }

  changeDueDate(event: any, isDateChanged: boolean = false) {
    const inputValue = this.posCurrencyReceiptForm.value.dueDays;
    const vocDate = new Date(this.posCurrencyReceiptForm.value.vocDate);

    if (event && !isDateChanged) {
      vocDate.setDate(vocDate.getDate() + event);
      this.posCurrencyReceiptForm
        .get("dueDays")
        ?.setValue(this.formatDate(vocDate));
    } else if (inputValue !== "" || isDateChanged) {
      const selectedDate = new Date(inputValue);
      selectedDate.setHours(0, 0, 0, 0);

      if (!isNaN(selectedDate.getTime())) {
        vocDate.setHours(0, 0, 0, 0);
        const difference = this.calculateDateDifference(selectedDate, vocDate);
        this.posCurrencyReceiptForm
          .get("dueDaysdesc")
          ?.setValue(difference.toString());
      } else {
        console.error("Invalid date input. Please enter a valid date.");
      }
    }
  }

  formatDate(date: Date): string {
    return date.toISOString();
  }


  calculateDateDifference(dateA: Date, dateB: Date): number {
    const timeDifference = dateA.getTime() - dateB.getTime();
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    return Math.floor(dayDifference);
  }

  getArgsData() {
    console.log("this.content", this.content);
    if (this.content.FLAG == "VIEW") this.viewOnly = true;
    if (this.content.FLAG == "EDIT") {
      this.editOnly = true;
    }

    this.snackBar.open("Loading...");
    let Sub: Subscription = this.dataService
      .getDynamicAPI(
        `AdvanceReceipt/GetAdvanceReceiptWithMID/${this.content.MID}`
      )
      .subscribe((result) => {
        this.snackBar.dismiss();
        console.log("====================================");
        console.log(result);
        console.log("====================================");
        if (result.status == "Success") {
          const data = result.response;

          this.posCurrencyDetailsData = data.currencyReceiptDetails;
          console.log(
            "this.posCurrencyDetailsData",
            this.posCurrencyDetailsData
          );

          this.posCurrencyDetailsData.forEach((item) => {
            item.NET_TOTAL = (
              parseFloat(item.AMOUNTCC) + parseFloat(item.IGST_AMOUNTCC)
            ).toFixed(2);
            item.CURRENCY_RATE = this.comService.decimalQuantityFormat(
              this.comService.emptyToZero(item.CURRENCY_RATE),
              "RATE"
            );
            item.AMOUNTFC = this.comService.decimalQuantityFormat(
              this.comService.emptyToZero(item.AMOUNTFC),
              "AMOUNT"
            );
            item.IGST_AMOUNTCC = this.comService.decimalQuantityFormat(
              this.comService.emptyToZero(item.IGST_AMOUNTCC),
              "AMOUNT"
            );
          });

          this.updateFormValuesAndSRNO();

          // set form values
          this.posCurrencyReceiptForm.controls.vocType.setValue(data.VOCTYPE);
          this.posCurrencyReceiptForm.controls.vocNo.setValue(data.VOCNO);
          this.posCurrencyReceiptForm.controls.vocDate.setValue(data.VOCDATE);
          this.posCurrencyReceiptForm.controls.partyCode.setValue(
            data.PARTYCODE
          );
          this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(
            data.HHACCOUNT_HEAD
          );
          this.posCurrencyReceiptForm.controls.partyCurrency.setValue(
            data.PARTY_CURRENCY
          );
          this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(
            data.PARTY_CURR_RATE
          );

          this.posCurrencyReceiptForm.controls.enteredby.setValue(
            data.SALESPERSON_CODE
          );
          this.posCurrencyReceiptForm.controls.enteredbyuser.setValue(
            data.SALESPERSON_NAME
          );
          this.posCurrencyReceiptForm.controls.dueDaysdesc.setValue(
            data.DUEDAYS
          );

          this.posCurrencyReceiptForm.controls.customerCode.setValue(
            data.POSCUSTOMERCODE
          );
          this.posCurrencyReceiptForm.controls.customerName.setValue(
            data.CUSTOMER_NAME
          );
          this.posCurrencyReceiptForm.controls.mobile.setValue(
            data.CUSTOMER_MOBILE
          );
          this.posCurrencyReceiptForm.controls.email.setValue(
            data.CUSTOMER_EMAIL
          );
          this.customerData = {
            MOBILE: data.CUSTOMER_MOBILE,
            CODE: data.POSCUSTOMERCODE,
          };

          this.posCurrencyReceiptForm.controls.partyAddress.setValue(
            data.PARTY_ADDRESS
          );

          this.posCurrencyReceiptForm.controls.partyCurr.setValue(
            data.PARTY_CURRENCY
          );

          this.posCurrencyReceiptForm.controls.schemaCode.setValue(
            data.SCH_SCHEME_CODE
          );
          this.posCurrencyReceiptForm.controls.schemaId.setValue(
            data.SCH_CUSTOMER_ID
          );
          this.posCurrencyReceiptForm.controls.narration.setValue(data.REMARKS);

          this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(
            this.comService.decimalQuantityFormat(
              this.comService.emptyToZero(data.TOTAL_AMOUNTFC),
              "AMOUNT"
            )
          );
          this.changeDueDate(data.DUEDAYS);
        }
      });
  }

  enteredBySelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.enteredby.setValue(e.SALESPERSON_CODE);
    this.posCurrencyReceiptForm.controls.enteredbyuser.setValue(e.DESCRIPTION);
  }

  auditTrailClick() {
    let params = {
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.posCurrencyReceiptForm.value.vocType,
      VOCNO: this.posCurrencyReceiptForm.value.vocNo.toString() || "",
      MID: this.content
        ? this.comService.emptyToZero(this.content?.MID)
        : this.midForInvoce,
      YEARMONTH: this.yearMonth,
    };
    this.auditTrailComponent?.showDialog(params);
  }

  // PartyCodeChange(event: any) {
  //   this.PartyCodeData.SEARCH_VALUE = event.target.value
  // }

  partyCodeSelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.partyCode.setValue(e.ACCODE);

    this.getGSTDetails(e.ACCODE);
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(e.ACCOUNT_HEAD);
    this.partyCodeChange({ target: { value: e.ACCODE } });
  }

  //party Code Change
  partyCodeChange(event: any) {
    if (event.target.value == "") return;
    this.snackBar.open("Loading...");
    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let postData = {
      SPID: "001",
      parameter: {
        ACCODE: event.target.value || "",
        BRANCH_CODE: this.branchCode,
      },
    };
    let Sub: Subscription = this.dataService
      .postDynamicAPI("ExecueteSPInterface", postData)
      .subscribe(
        (result) => {
          this.snackBar.dismiss();
          if (result.status == "Success") {
            //
            if (result.dynamicData.length > 0) {
              let data = result.dynamicData[0].find((entry: any) => entry.DEFAULT_CURRENCY === 1);

              // let data = result.dynamicData[0];
              console.log("data", data);

              if (data && data.CURRENCY_CODE
              ) {
                this.currencyData.WHERECONDITION = `@strBranch='${this.comService.branchCode}',@strPartyCode='${event.target.value}'`;

                if (this.companyCurrency == data.CURRENCY_CODE)
                  this.isCurrencyUpdate = true;
                else this.isCurrencyUpdate = false;

                this.posCurrencyReceiptForm.controls.partyCurrency.setValue(
                  data.CURRENCY_CODE
                );

                this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(
                  this.comService.decimalQuantityFormat(data.CONV_RATE, 'RATE')
                );

                this.posCurrencyReceiptForm.controls.partyCurr.setValue(
                  data.CURRENCY_CODE
                );
                this.currencyCode = data.CURRENCY_CODE;
                this.currencyConvRate = data.CONV_RATE;

                // this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(data[0].CURRENCY_CODE)
                // this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(data[0].CURRENCY_CODE)
                // this.PartyDetailsOrderForm.controls.BillToAccountHead.setValue(data[0].ACCOUNT_HEAD)
                // this.PartyDetailsOrderForm.controls.BillToAddress.setValue(data[0].ADDRESS)

                // let currencyArr = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE = data[0].CURRENCY_CODE)
                // this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(currencyArr[0].CONV_RATE)
                // this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(currencyArr[0].CONV_RATE)
              }
            }
          } else {
            this.toastr.error(
              "PartyCode not found",
              result.Message ? result.Message : "",
              {
                timeOut: 3000,
              }
            );
          }
        },
        (err) => {
          this.snackBar.dismiss();
          this.toastr.error("Server Error", "", {
            timeOut: 3000,
          });
        }
      );
    this.subscriptions.push(Sub);
  }

  currencySelected(e: any) {
    console.log(e);
    this.posCurrencyReceiptForm.controls.partyCurrency.setValue(
      e.Currency
    );

    this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(
      this.comService.decimalQuantityFormat(e["Conv Rate"], "RATE")
    );
  }

  partyCurrencyCodeSelected(e: any) {
    // console.log(e);
    this.posCurrencyReceiptForm.controls.partyCurrency.setValue(
      e.CURRENCY_CODE
    );
    this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(
      e.CURRENCY_CODE
    );
  }

  isCustomerDataAvailable(): boolean {
    return this.customerData != null && Object.keys(this.customerData).length > 0;
  }

  customerCodeSelected(e: any) {
    console.log(e);
    this.customerData = e;
    this.posCurrencyReceiptForm.controls.customerCode.setValue(e.CODE);
    this.posCurrencyReceiptForm.controls.customerName.setValue(e.NAME);
    this.posCurrencyReceiptForm.controls.mobile.setValue(e.MOBILE);
    this.posCurrencyReceiptForm.controls.email.setValue(e.EMAIL);
    this.posCurrencyReceiptForm.controls.partyAddress.setValue(e.ADDRESS);
  }

  deleteDetailRecord() {
    // this.selec
    if (this.selectedIndexes.length > 0) {
      this.posCurrencyDetailsData = this.posCurrencyDetailsData.filter(
        (data, index) => !this.selectedIndexes.includes(index)
      );
      this.updateFormValuesAndSRNO();
    } else {
      this.snackBar.open("Please select record", "OK", { duration: 2000 }); // need proper err msg.
    }
  }

  validateForm() {
    if (this.posCurrencyReceiptForm.invalid) {
      this.toastr.error("Select all required fields");
      return false;
    }

    if (
      this.isCustomerRequired &&
      !this.posCurrencyReceiptForm.controls.customerCode.value
    ) {
      this.toastr.error("Please fill customer details");
      return false;
    }

    return true;
  }

  formSubmit() {
    if (!this.validateForm()) {
      return;
    }

    let postData = {
      MID: this.content?.MID || 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.posCurrencyReceiptForm.value.vocType,
      VOCNO: this.posCurrencyReceiptForm.value.vocNo || 0,
      VOCDATE: this.posCurrencyReceiptForm.value.vocDate,
      VALUE_DATE: this.posCurrencyReceiptForm.value.vocDate,
      YEARMONTH: this.yearMonth,
      PARTYCODE: this.posCurrencyReceiptForm.value.partyCode || "",
      PARTY_CURRENCY: this.posCurrencyReceiptForm.value.partyCurrency || "",
      PARTY_CURR_RATE:
        this.posCurrencyReceiptForm.value.partyCurrencyRate || "0",
      TOTAL_AMOUNTFC: this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      TOTAL_AMOUNTCC: this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      REMARKS: this.posCurrencyReceiptForm.value.narration || "",
      SYSTEM_DATE: "2023-10-10T11:05:50.756Z",
      NAVSEQNO: 0,
      HAWALACOMMCODE: "",
      HAWALACOMMPER: 0,
      FLAG_UPDATED: "N",
      FLAG_INPROCESS: "N",
      SUPINVNO: "",
      SUPINVDATE: this.posCurrencyReceiptForm.value.vocDate,
      HHACCOUNT_HEAD: this.posCurrencyReceiptForm.value.partyCodeDesc || "",
      SALESPERSON_CODE: this.posCurrencyReceiptForm.value.enteredby,
      SALESPERSON_NAME: this.posCurrencyReceiptForm.value.enteredbyuser,
      BALANCE_FC: this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      BALANCE_CC: this.posCurrencyReceiptForm.value.partyAmountFC || 0,
      AUTHORIZEDPOSTING: false,
      AUTOGENREF: "",
      AUTOGENMID: 0,
      AUTOGENVOCTYPE: "",
      OUSTATUS: true,
      OUSTATUSNEW: 1,
      POSCUSTOMERCODE: this.posCurrencyReceiptForm.value.customerCode || "",
      D2DTRANSFER: "F",
      DRAFT_FLAG: "",
      POSSCHEMEID: "",
      FLAG_EDIT_ALLOW: "",
      PARTY_ADDRESS: this.posCurrencyReceiptForm.value.partyAddress,
      AUTOPOSTING: true,
      POSTDATE: this.posCurrencyReceiptForm.value.vocDate,
      ADVRETURN: false,
      HTUSERNAME: this.userName,
      GENSEQNO: 0,
      BASE_CURRENCY: this.posCurrencyReceiptForm.value.partyCurrency || "",
      BASE_CURR_RATE: this.posCurrencyReceiptForm.value.partyCurrencyRate || "",
      BASE_CONV_RATE: this.posCurrencyReceiptForm.value.partyCurrencyRate || "",
      PRINT_COUNT: 0,
      GST_REGISTERED: true,
      GST_STATE_CODE: "",
      GST_NUMBER: "",
      GST_TYPE: "",
      GST_TOTALFC: this.posCurrencyReceiptForm.value.totalTax || "",
      GST_TOTALCC: this.posCurrencyReceiptForm.value.totalTax || "",
      DOC_REF: "",
      REC_STATUS: "",
      CUSTOMER_NAME: this.posCurrencyReceiptForm.value.customerName || "",
      CUSTOMER_MOBILE: this.posCurrencyReceiptForm.value.mobile || "",
      CUSTOMER_EMAIL: this.posCurrencyReceiptForm.value.email || "",
      TDS_CODE: "",
      TDS_APPLICABLE: false,
      TDS_TOTALFC: 0,
      TDS_TOTALCC: 0,
      ADRRETURNREF: "",
      //  `${this.branchCode}-${this.posCurrencyReceiptForm.value.vocType}-${this.posCurrencyReceiptForm.value.vocNo}`,
      SCH_SCHEME_CODE: this.posCurrencyReceiptForm.value.schemaCode || "",
      SCH_CUSTOMER_ID: this.posCurrencyReceiptForm.value.schemaId || "",
      REFDOCNO: "",
      GIFT_CARDNO: "",
      FROM_TOUCH: false,
      SL_CODE: "",
      SL_DESCRIPTION: "",
      OT_TRANSFER_TIME: "",
      DUEDAYS: this.posCurrencyReceiptForm.value.dueDaysdesc || "",
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      WOOCOMCARDID: "",
      pospcrSelection: "",

      userName: this.comService.userName,
      editReason:
        this.content?.FLAG == "EDIT" ? this.comService.EditDetail.REASON : "",
      editDesc:
        this.content?.FLAG == "EDIT"
          ? this.comService.EditDetail.DESCRIPTION
          : "",
      currencyReceiptDetails: this.posCurrencyDetailsData,
    };

    // let API = 'AdvanceReceipt/InsertAdvanceReceipt'

    if (this.content?.FLAG == "VIEW") return;

    let apiCtrl;
    let apiResponse;
    if (this.content && this.content.FLAG == "EDIT") {
      apiCtrl = `AdvanceReceipt/UpdateAdvanceReceipt/${postData.BRANCH_CODE}/${postData.VOCTYPE}/${postData.VOCNO}/${postData.YEARMONTH}`;
      apiResponse = this.dataService.putDynamicAPI(apiCtrl, postData);
    } else {
      apiCtrl = "AdvanceReceipt/InsertAdvanceReceipt";
      apiResponse = this.dataService.postDynamicAPI(apiCtrl, postData);
    }

    let Sub: Subscription = apiResponse.subscribe(
      (result) => {
        if (result.response) {
          if (result.status == "Success") {
            this.midForInvoce = result.response.MID;
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.posCurrencyReceiptForm.reset();
                // this.tableData = []
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

  deleteCurrencyReceipt() {
    if (this.content.MID == null) {
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
        let API = `AdvanceReceipt/DeleteAdvanceReceipt/${this.content.BRANCH_CODE}/${this.content.VOCTYPE}/${this.content.VOCNO}/${this.content.YEARMONTH}`;
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
                      this.close("reloadMainGrid"); //reloads data in MainGrid
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
                      this.close("reloadMainGrid");
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

  AccountPosting() {
    if (!this.content) return;
    let params = {
      BRANCH_CODE: this.comService.nullToString(this.strBranchcode),
      VOCTYPE: this.comService.getqueryParamVocType(),
      VOCNO: this.posCurrencyReceiptForm.value.vocNo,
      YEARMONTH: this.comService.nullToString(this.baseYear),
      MID: this.content
        ? this.comService.emptyToZero(this.content?.MID)
        : this.midForInvoce,
      ACCUPDATEYN: "Y",
      USERNAME: this.comService.userName,
      MAINVOCTYPE: this.comService.getqueryParamMainVocType(),
      HEADER_TABLE: this.comService.getqueryParamTable(),
    };
    let Sub: Subscription = this.dataService
      .getDynamicAPIwithParams("AccountPosting", params)
      .subscribe(
        (result) => {
          if (result.status == "Success") {
            this.comService.toastSuccessByMsgId(
              result.message || "Posting Done"
            );
          } else {
            this.comService.toastErrorByMsgId(result.message);
          }
        },
        (err) => this.comService.toastErrorByMsgId("Server Error")
      );
    this.subscriptions.push(Sub);
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    let indexes: Number[] = [];
    this.posCurrencyDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  close(data?: any) {
    if (this.viewOnly || data) {
      this.activeModal.close();
    } else {
      const dialogRef = this.dialogService.openDialog('Warning', this.comService.getMsgByID('MSG1212'), false);

      dialogRef.afterClosed().subscribe((action: any) => {
        if (action == 'Yes') {
          this.activeModal.close();
        }
      });
    }
  }


  // customer master add, view
  openCustMaster() {
    this.posCurrencyReceiptForm.controls.partyCode.value;
    const modalRef: NgbModalRef = this.modalService.open(
      PosCustomerMasterComponent,
      {
        size: 'xl',
        ariaLabelledBy: 'modal-basic-title',
        backdrop: true,
      }
    );
    modalRef.componentInstance.customerData = this.customerData;
    modalRef.componentInstance.amlNameValidation = this.amlNameValidation;
    modalRef.componentInstance.vocDetails = {
      VOCTYPE: this.comService.getqueryParamVocType(),
      VOCDATE: this.posCurrencyReceiptForm.value.vocDate,
      VOCNO: this.posCurrencyReceiptForm.value.vocNo,
      YEARMONTH: this.yearMonth,
    };
    modalRef.componentInstance.queryParams = { isViewOnly: this.viewOnly };

    modalRef.result.then(
      (result) => {
        console.log(`Closed with: ${result}`);
        console.log(result);
        if (result != null && result?.customerDetails != null)
          this.customerCodeSelected(result.customerDetails);
      },
      (reason) => {
        console.log(`Dismissed ${reason}`);
      }
    );
  }

  onRowDoubleClicked(e: any) {
    console.log(e);

    e.cancel = true;
    this.openAddPosARdetails(e.data);
  }
  removeLineItemsGrid(e: any) {
    console.log(e.data);
    const values: any = [];
    values.push(e.data.SRNO);
    let indexes: Number[] = [];
    this.posCurrencyDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    this.updateFormValuesAndSRNO();
  }

  printReceiptDetailsWeb() {
    let postData = {
      MID: this.content
        ? this.comService.emptyToZero(this.content?.MID)
        : this.midForInvoce,
      BRANCH_CODE: this.comService.nullToString(this.strBranchcode),
      VOCNO: this.comService.emptyToZero(
        this.posCurrencyReceiptForm.value.vocNo
      ),
      VOCTYPE: this.comService.nullToString(
        this.comService.getqueryParamVocType()
      ),
      YEARMONTH: this.comService.nullToString(this.baseYear),
    };
    this.dataService
      .postDynamicAPI("GetAdvanceReceiptDetailsWeb", postData)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.dynamicData;
        var WindowPrt = window.open(" ", " ", "width=900px, height=800px");
        if (WindowPrt === null) {
          console.error(
            "Failed to open the print window. Possibly blocked by a popup blocker."
          );
          return;
        }
        let printContent = `
                <html>
                <head>
                    <style>
                        @media print {
                            @page {
                                size: A4 portrait;
                                margin: 1cm;
                            }
                            body {
                                margin: 1cm;
                                box-sizing: border-box;
                            }
                            * {
                                box-sizing: border-box;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${data[0][0].HTMLOUT}
                </body>
                </html>
            `;
        WindowPrt.document.write(printContent);

        WindowPrt.document.close();
        WindowPrt.focus();

        setTimeout(() => {
          if (WindowPrt) {
            WindowPrt.print();
            WindowPrt.close();
          } else {
            console.error(
              "Print window was closed before printing could occur."
            );
          }
        }, 800);
      });
  }

  openAddPosARdetails(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(
      PosCurrencyReceiptDetailsComponent,
      {
        size: "xl",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.componentInstance.receiptData = { ...data };
    modalRef.componentInstance.queryParams = {
      vatPercentage: this.vatPercentage,
      hsnCode: this.hsnCode,
      igstAccode: this.igst_accode,
      currecyCode: this.currencyCode,
      currencyConvRate: this.currencyConvRate,
      isViewOnly: this.viewOnly,
    };

    modalRef.componentInstance.continueData.subscribe((postData: any) => {
      console.log("Continue data from modal:", postData);
      this.handlePostData(postData);  // Handle the postData as needed
    });

    // Handle modal close when finish is clicked
    modalRef.result.then((postData) => {
      if (postData) {
        console.log("Data from modal:", postData);
        this.handlePostData(postData);
      }
    });

    // modalRef.result.then((postData) => {
    //   if (postData) {
    //     console.log("Data from modal:", postData);
    //     this.handlePostData(postData);
    //   }
    // });
  }


  getGSTDetails(acCode: any) {
    // let vatData = {

    //   Accode: acCode,
    //   strdate: this.comService.formatDate(new Date()),
    //   branch_code: this.comService.branchCode,
    //   mainvoctype: this.comService.getqueryParamMainVocType()

    // };

    const API = `TaxDetails/${acCode}/${this.comService.formatDate(
      new Date()
    )}/${this.comService.branchCode
      }/${this.comService.getqueryParamMainVocType()}/${this.comService.getqueryParamVocType()}`;

    let Sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((result) => {
        if (result.status == "Success") {
          let data = result.response;
          this.vatPercentage = data.VAT_PER ? data.VAT_PER : "0";
          this.hsnCode = data.HSN_SAC_CODE ? data.HSN_SAC_CODE : "";
          this.igst_accode = data.IGST_ACCODE ? data.POS_TAX_CRACCODE : "";
        }
      });
  }

  handlePostData(postData: any) {
    const preItemIndex = this.posCurrencyDetailsData.findIndex(
      (data: any) => data.SRNO.toString() == postData.SRNO.toString()
    );
    postData.NET_TOTAL = (
      parseFloat(postData.AMOUNTFC) + parseFloat(postData.IGST_AMOUNTFC)
    ).toFixed(2);

    if (postData?.isUpdate && preItemIndex !== -1) {
      this.posCurrencyDetailsData[preItemIndex] = postData;
    } else {
      this.posCurrencyDetailsData.push(postData);
    }

    console.log("Updated posCurrencyDetailsData", this.posCurrencyDetailsData);
    this.updateFormValuesAndSRNO();
  }

  updateFormValuesAndSRNO() {
    let sumCGST_AMOUNTCC = 0;
    let sumAMOUNTCC = 0;

    this.posCurrencyDetailsData.forEach((data, index) => {
      data.SRNO = index + 1;
      sumCGST_AMOUNTCC += parseFloat(data.IGST_AMOUNTCC);
      sumAMOUNTCC += parseFloat(data.TOTAL_AMOUNTCC);
    });

    let totalSum = sumCGST_AMOUNTCC + sumAMOUNTCC;

    this.posCurrencyReceiptForm.controls.totalTax.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(sumCGST_AMOUNTCC),
        "AMOUNT"
      )
    );
    this.posCurrencyReceiptForm.controls.total.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(sumAMOUNTCC),
        "AMOUNT"
      )
    );
    this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(sumAMOUNTCC),
        "AMOUNT"
      )
    );
  }

  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear/${this.comService.cDateFormat(
      this.posCurrencyReceiptForm.value.vocDate
    )}`;
    const res = await this.dataService.getDynamicAPI(API).toPromise();
    console.log(res);
    if (res.status == "Success") {
      this.yearMonth = res.BaseFinancialyear;
      console.log("BaseFinancialyear", res.BaseFinancialyear);
    }
  }

  openTab(event: any, formControlName: string) {
    console.log(event);

    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "partyCode":
        this.overlayPartyCode.showOverlayPanel(event);
        break;
      case "enteredby":
        this.overlayEnteredCode.showOverlayPanel(event);
        break;
      case "customerCode":
        this.overlayCustomerCode.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }



  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;

    if (event.target.value === '' || this.viewOnly === true) {
      this.customerData = null;

      const controlsToReset = ['customerName', 'mobile', 'email', 'partyAddress'];

      controlsToReset.forEach(control => {
        this.posCurrencyReceiptForm.controls[control].setValue('');
      });

      return;
    }

    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    this.comService.showSnackBarMsg('MSG81447');

    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();

        let data = result.dynamicData[0];

        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE !== '') {
            let searchResult = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);

            if (searchResult && searchResult.length > 0) {
              let matchedItem = searchResult[0];
              this.customerData = matchedItem;
              this.posCurrencyReceiptForm.controls.customerName.setValue(
                matchedItem.NAME
              );
              this.posCurrencyReceiptForm.controls.mobile.setValue(
                matchedItem.MOBILE
              );

              this.posCurrencyReceiptForm.controls.email.setValue(
                matchedItem.EMAIL
              );

              this.posCurrencyReceiptForm.controls.partyAddress.setValue(
                matchedItem.ADDRESS
              );



            } else {
              this.comService.toastErrorByMsgId('No data found');
              LOOKUPDATA.SEARCH_VALUE = '';
            }
          }
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272');
      });

    this.subscriptions.push(Sub);
  }

}
