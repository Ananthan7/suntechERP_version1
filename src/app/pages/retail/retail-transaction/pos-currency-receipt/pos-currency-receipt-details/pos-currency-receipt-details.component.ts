import {
  Component,
  Directive,
  Injectable,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from "@angular/material/datepicker";
import * as _moment from "moment";
import { IndexedDbService } from "src/app/services/indexed-db.service";
import * as moment from "moment";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";

@Component({
  selector: "app-pos-currency-receipt-details",
  templateUrl: "./pos-currency-receipt-details.component.html",
  styleUrls: ["./pos-currency-receipt-details.component.scss"],
})
export class PosCurrencyReceiptDetailsComponent implements OnInit {
  @ViewChild("overlayDebitCode") overlayDebitCode!: MasterSearchComponent;
  @ViewChild("overlayCurrencyCode") overlayCurrencyCode!: MasterSearchComponent;

  @Input() content!: any; //use: To get clicked row details from master grid
  @Input() receiptData!: any;
  @Input() queryParams!: any;
  viewOnly: boolean = false;
  igstAccode: string = "";
  hideMasterSearch: boolean = true;
  hideDebitLookup: boolean = true;
  hideCurrecnySearch: boolean = false;

  isCreditcardMode: boolean = false;
  commisionForCreditCardPayments: any = 0;
  tableData: any[] = [];
  dummyDateArr = [
    "1900-01-01T00:00:00",
    "1900-01-01T00:00:00Z",
    "1754-01-01T00:00:00Z",
    "1754-01-01T00:00:00",
  ];

  today = _moment();

  private subscriptions: Subscription[] = [];
  branchCode?: String;
  paymentModeList: any[] = [];
  dummyDate = "1900-01-01T00:00:00";  
  compCurrency: any;
  typeCodeArray: any[] = [];
  selectedTabIndex = 0;
  vatAmountCC = 0;
  isCurrencyUpdate: boolean = false;
  hsnCodeList: any[] = [];
  commisionDetailsWithPayments: any[] = [];
  commisionRate: number = 0;
  commissionPercentage: number = 0;
  commissionAmount: number = 0;
  currentDate = new Date(new Date());
  debitAmountData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "CASH accounts",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''AND IS_CASH_ACCOUNT=1 AND ACCOUNT_MODE='G'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  modeOfData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 100,
    LOOKUPID: 25,
    SEARCH_FIELD: "Credit_Code",
    // SEARCH_HEADING: 'Mode Of',
    SEARCH_HEADING: "Credit Card lookup",
    SEARCH_VALUE: "",
    WHERECONDITION: "MODE = 1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

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
  // `CMBRANCH_CODE = '${this.comService.branchCode}'`

  posCurrencyReceiptDetailsForm: FormGroup = this.formBuilder.group({
    branch: [""],
    modeOfSelect: ["Cash"],
    modeCODE: [""], // Not Declaration
    modeDesc: [""],
    debitAmount: [""],
    debitAmountDesc: [""],
    // debitAmountDate : [new Date()],
    currencyCode: [""],
    currencyRate: [""],
    amountFc: [""],
    amountCc: ["",Validators.required],
    creditCardNumber: [""],
    creditCardName: ["", [Validators.pattern(/^[a-zA-Z ]*$/)]],
    creditCardDate: [""],
    ttNumber: [""],
    ttDate: [""],
    ttDrawnBank: [""],
    ttDepositBank: [""],
    chequeNumber: [""],
    chequeDate: [new Date()],
    chequeDrawnBank: [""],
    chequeDepositBank: [""],
    remarks: [""],
    vatNo: [""],
    hsnCode: ["GEN"],
    invoiceNo: [""],
    invoiceDate: [new Date()],
    vat: [""],
    vatcc: [""],
    totalFc: [""],
    totalLc: [""],
    headerVatAmt: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    public comService: CommonServiceService,
    private indexedDb: IndexedDbService
  ) {
    this.indexedDb.getAllData("compparams").subscribe((data) => {
      if (data.length > 0) {
        console.log("==============compparams======================");
        console.log(data);
        console.log("====================================");
        this.comService.allCompanyParams = data;
      }
    });
    this.compCurrency = this.comService.compCurrency;
  }

  ngOnInit(): void {
    this.getQueryParams(this.queryParams);
    this.generateHsnCodeList(this.queryParams);
    this.getCreditCardMaster();
    this.branchCode = this.comService.branchCode;

    this.paymentModeList = this.getUniqueValues(this.comService.getComboFilterByID("Payment Mode"), "ENGLISH")
    console.log(this.paymentModeList);

    console.log("paymentModeList :", this.paymentModeList);



    this.posCurrencyReceiptDetailsForm.controls.branch.setValue(
      this.branchCode
    );

    this.vatDetails();
    this.getCreditCardList();

    if (this.receiptData && Object.keys(this.receiptData).length > 0)
      this.setReceiptData();
    else this.getAccountHead();
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  getCreditCardList() {
    this.dataService
      .getDynamicAPI("CreditCardMaster/getPaymentButtons")
      .subscribe((resp: any) => {
        // let _resp = resp.Result;
        // this.receiptModesList = resp.paymentButtons;
        // this.receiptModesTypes = resp.creditCardMaster;
        let _resp = resp.creditCardMaster;

        console.log(_resp);

        this.commisionDetailsWithPayments = _resp.map((item: any) => ({
          CREDIT_CODE: item.CREDIT_CODE,
          COMMISION: item.COMMISION,
        }));

        console.log(this.commisionDetailsWithPayments);
      });
  }

  generateHsnCodeList(queryParams: any) {
    this.hsnCodeList = [];

    if (queryParams && queryParams.hsnCode) {
      const codes = queryParams.hsnCode.split(",");

      codes.forEach((code: any) => {
        this.hsnCodeList.push({ code: code.trim(), value: code.trim() });
      });
    }

    console.log("hsnCodeList", this.hsnCodeList);
  }

  getQueryParams(gstDetails?: any) {

    this.igstAccode = gstDetails?.igstAccode || "";
    this.posCurrencyReceiptDetailsForm.controls.hsnCode.setValue(
      gstDetails?.hsnCode || ""
    );

    this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(
      gstDetails?.currecyCode || ""
    );

    const currencyConvRate = gstDetails?.currencyConvRate;
    this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(
      this.comService.decimalQuantityFormat(
        currencyConvRate && !isNaN(currencyConvRate) ? currencyConvRate : 0,
        "RATE"
      )
    );

    this.posCurrencyReceiptDetailsForm.controls.vat.setValue(
      this.comService.decimalQuantityFormat(
        gstDetails.vatPercentage && !isNaN(gstDetails.vatPercentage) ? gstDetails.vatPercentage : 0,
        "AMOUNT"
      )
    );
    // this.igstAccode = gstDetails.igstAccode;
    // this.posCurrencyReceiptDetailsForm.controls.hsnCode.setValue(
    //   gstDetails.hsnCode
    // );
    // this.posCurrencyReceiptDetailsForm.controls.hsnCode.setValue(
    //   gstDetails.hsnCode
    // );
    // this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(
    //   gstDetails.currecyCode
    // );
    // this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(
    //   this.comService.decimalQuantityFormat(gstDetails.currencyConvRate, "RATE")
    // );

    // this.posCurrencyReceiptDetailsForm.controls.vat.setValue(
    //   this.comService.decimalQuantityFormat(
    //     this.comService.emptyToZero(gstDetails.vatPercentage),
    //     "AMOUNT"
    //   )
    // );

    this.viewOnly = gstDetails.isViewOnly;
    if (gstDetails.currecyCode == this.compCurrency)
      this.isCurrencyUpdate = true;
    else this.isCurrencyUpdate = false;
  }

  getAccountHead(e?: any) {
    const API = `GetPOSDefaultAccode/${this.branchCode}`;
    this.dataService.getDynamicAPI(API).subscribe((res: any) => {
      if (res.status == "Success") {
        console.log("res", res);
        // console.log('res', res.response.ACCODE); ACCOUNT_HEAD
        this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(
          res.response.ACCODE
        );
        this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
          res.response.ACCOUNT_HEAD
        );
        this.currencyData.WHERECONDITION = `@strBranch='${this.comService.branchCode}',@strPartyCode='${res.response.ACCODE}'`;
      }
    });
  }

 

  // getGSTDetails(acCode: any) {

  //   // this.PartyCodeData.SEARCH_VALUE = event.target.value
  //   let vatData = {

  //     'BranchCode': this.branchCode,
  //     'AcCode': acCode,
  //     'VocType': this.comService.getqueryParamVocType(),
  //     'Date': new Date().toISOString(),

  //   };
  //   let Sub: Subscription = this.dataService.postDynamicAPI('GetGSTCodeExpenseVoc', vatData)
  //     .subscribe((result) => {

  //       if (result.status == 'Success') {
  //         let data = result.response;
  //         console.log('vatData', data.GST_PER);
  //         this.posCurrencyReceiptDetailsForm.controls.vat.setValue(this.comService.decimalQuantityFormat(
  //           this.comService.emptyToZero(data.GST_PER),
  //           'AMOUNT'));
  //           this.posCurrencyReceiptDetailsForm.controls.hsnCode.setValue(data.HSN_SAC_CODE);
  //       }
  //     }
  //     )
  // }

  setCreditCardValidty() {
    let validity = _moment(
      this.receiptData.CARD_EXPIRY,
      "MM/DD/YYYY h:mm:ss A"
    );
    let formattedExpiryDate = validity.format("MM/YYYY");
    let ccValidity = _moment(formattedExpiryDate, "MM/YYYY");
    this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(
      ccValidity
    );
  }

  setDateFormFields(
    dateString: string,
    inputFormat: string,
    outputFormat: string
  ) {
    let date = _moment(dateString, inputFormat);
    let formattedDate = date.format(outputFormat);
    let finalDate = _moment(formattedDate, outputFormat);
    return finalDate;
    // this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(finalDate);
  }

  setReceiptData() {
    if (
      this.receiptData != null &&
      this.receiptData != undefined &&
      Object.keys(this.receiptData).length > 0
    ) {
      this.posCurrencyReceiptDetailsForm.controls.modeOfSelect.setValue(
        this.receiptData.RECPAY_TYPE
      );

      this.posCurrencyReceiptDetailsForm.controls.modeCODE.setValue(
        this.receiptData.MODE
      );

      this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(
        this.receiptData.CURRENCY_CODE
      );

      this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(
        this.comService.decimalQuantityFormat(
          this.receiptData.CURRENCY_RATE,
          "RATE"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
        this.receiptData.HDACCOUNT_HEAD
      );
      this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(
        this.receiptData.ACCODE
      );

      this.posCurrencyReceiptDetailsForm.controls.amountFc.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.AMOUNTFC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.amountCc.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.AMOUNTCC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.totalLc.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTFC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.headerVatAmt.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.vatcc.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.IGST_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.vat.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.IGST_PER),
          "AMOUNT"
        )
      );

      this.posCurrencyReceiptDetailsForm.controls.remarks.setValue(
        this.receiptData.REMARKS
      );
   

      this.hsnCodeList = [
        { code: this.receiptData.HSN_CODE, value: this.receiptData },
      ];
      this.posCurrencyReceiptDetailsForm.controls.hsnCode.setValue(
        this.receiptData.HSN_CODE
      );
      this.posCurrencyReceiptDetailsForm.controls.modeDesc.setValue(
        this.receiptData.MODEDESC
      );
      this.posCurrencyReceiptDetailsForm.controls.creditCardNumber.setValue(
        this.receiptData.CARD_NO
      );
      this.posCurrencyReceiptDetailsForm.controls.creditCardName.setValue(
        this.receiptData.CARD_HOLDER
      );
      // this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(this.receiptData.CARD_EXPIRY);

      this.posCurrencyReceiptDetailsForm.controls.invoiceNo.setValue(
        this.receiptData.INVOICE_NUMBER
      );

      this.posCurrencyReceiptDetailsForm.controls.vatNo.setValue(
        this.receiptData.GST_NUMBER
      );
      this.vatAmountCC = this.receiptData.IGST_AMOUNTCC;

      this.posCurrencyReceiptDetailsForm.controls.chequeDrawnBank.setValue(
        this.receiptData.CHEQUE_BANK
      );
      this.posCurrencyReceiptDetailsForm.controls.chequeNumber.setValue(
        this.receiptData.CHEQUE_NO
      );
      this.posCurrencyReceiptDetailsForm.controls.chequeDepositBank.setValue(
        this.receiptData.BANKCODE
      );
      // this.posCurrencyReceiptDetailsForm.controls.chequeDate.setValue(this.receiptData.CHEQUE_DATE);

      this.posCurrencyReceiptDetailsForm.controls.ttNumber.setValue(
        this.receiptData.CHEQUE_NO
      );
      this.posCurrencyReceiptDetailsForm.controls.ttDate.setValue(
        this.receiptData.CHEQUE_DATE
      );
      this.posCurrencyReceiptDetailsForm.controls.ttDrawnBank.setValue(
        this.receiptData.CHEQUE_BANK
      );
      this.posCurrencyReceiptDetailsForm.controls.ttDepositBank.setValue(
        this.receiptData.BANKCODE
      );

      this.debitAmountData.WHERECONDITION = `ACCODE='${this.receiptData.ACCODE}'`;

      if (this.receiptData.CARD_EXPIRY) {
        let date = this.setDateFormFields(
          this.receiptData.CARD_EXPIRY,
          "MM/DD/YYYY h:mm:ss A",
          "MM/YYYY"
        );
        this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(
          date
        );
        // this.setDateFormFields(this.receiptData.CARD_EXPIRY, 'MM/DD/YYYY h:mm:ss A', 'MM/YYYY');
      }

      if (this.receiptData.INVOICE_DATE) {
        let date = this.setDateFormFields(
          this.receiptData.INVOICE_DATE,
          "DD/MM/YYYY h:mm:ss A",
          "DD/MM/YYYY"
        );

        this.posCurrencyReceiptDetailsForm.controls.invoiceDate.setValue(date);
      }

      if (this.receiptData.INVOICE_DATE) {
        let date = this.setDateFormFields(
          this.receiptData.CHEQUE_DATE,
          "DD/MM/YYYY h:mm:ss A",
          "DD/MM/YYYY"
        );

        this.posCurrencyReceiptDetailsForm.controls.chequeDate.setValue(date);
      }
    }

    // receiptData
  }

  vatDetails() {
    // if (event.target.value == '') return
    this.snackBar.open("Loading...");
    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let vatData = {
      SPID: "013",
      parameter: {
        // "BRANCH_CODE": this.branchCode,
        // 'strBranchCode': this.branchCode,
        strBranchCode: "",
        strAccode: "",
        strVocType: "",
        strDate: "",
      },
    };
    let Sub: Subscription = this.dataService
      .postDynamicAPI("ExecueteSPInterface", vatData)
      .subscribe((result) => {
        this.snackBar.dismiss();
        if (result.dynamicData.length > 0) {
          let data = result.dynamicData[0];
          console.log("vatData", data);
        }
      });
  }

  debitAmountSelected(e: any) {
    console.log(e);
    this.resetVatFields();
    this.hideCurrecnySearch = false;
    this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(e.ACCODE);
    this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
      e["ACCOUNT_HEAD"]
    );

    if (this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Cheque") {
      localStorage.setItem("CH_ACCODE", e.ACCODE);
      localStorage.setItem("CH_ACHEAD", e["ACCOUNT_HEAD"]);
      // this.posCurrencyReceiptDetailsForm.controls.chequeDepositBank.setValue(
      //   e["BANK_CODE"]
      // );
    }

    this.DebitamountChange({ target: { value: e.ACCODE } }, e.ACCODE);
    // this.getGSTDetails(e.ACCODE);
  }

  CurrencySelected(e: any) {
    console.log(e);
    this.resetVatFields();
    this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(
      e.Currency
    );

    this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(
      this.comService.decimalQuantityFormat(e["Conv Rate"], "RATE")
    );
  }

  getCreditCardMaster() {
    let Sub: Subscription = this.dataService
      .getDynamicAPI("CreditCardMaster/GetCreditCardMaster")
      .subscribe(
        (result) => {
          if (result.response) {
            let data = result.response;
            this.typeCodeArray = data.filter((value: any) => value.MODE == 1);
          } else {
            this.comService.toastErrorByMsgId("Currency rate not Found");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  receiptModeSelected(e: any) {
    console.log(e);
    this.hideCurrecnySearch = false;
    this.hideDebitLookup = false;
    this.resetVatFields();
    const matchedEntry = this.typeCodeArray.find(
      (entry) => entry.CREDIT_CODE === e.Credit_Code
    );

    console.log(this.commisionDetailsWithPayments);

    this.commisionRate = matchedEntry.COMMISION;

    this.posCurrencyReceiptDetailsForm.controls.modeCODE.setValue(
      e.Credit_Code
    );
    this.posCurrencyReceiptDetailsForm.controls.modeDesc.setValue(
      e.Description
    );

    this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(
      matchedEntry.ACCODE
    );
    this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
      matchedEntry.ACCOUNT_HEAD
    );

    this.currencyData.WHERECONDITION = `@strBranch='${this.comService.branchCode}',@strPartyCode='${matchedEntry.ACCODE}'`;
  }

  onModeChange(event: any) {
    console.log(event);
    this.hideMasterSearch = false;
    this.hideCurrecnySearch = true;
    this.isCreditcardMode = false;
    this.hideDebitLookup = true;
    this.resetVatFields();

    switch (event.value) {
      case "Cash":
        this.getAccountHead();
        this.debitAmountData.WHERECONDITION =
          "ACCODE<> ''AND IS_CASH_ACCOUNT=1 AND ACCOUNT_MODE='G'";
        this.hideCurrecnySearch = false;
        break;
      case "Others":
      case "TT":
        this.debitAmountData.WHERECONDITION = "ACCODE<> ''";
        this.resetOnModeChange();
        break;

      case "Credit Card":
        this.hideMasterSearch = true;
        this.isCreditcardMode = true;
        this.hideDebitLookup = false;
        this.resetOnModeChange();

        break;

      case "Cheque":
        this.debitAmountData.WHERECONDITION = `ACCODE<> ''AND ACCOUNT_MODE='B' AND DEFA_BRANCH='${this.comService.branchCode}'`;
        this.resetOnModeChange();
        break;

      default:
        this.resetOnModeChange();
        break;
    }
  }

  resetOnModeChange() {
    this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.modeCODE.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.modeDesc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(
      this.queryParams.currecyCode
    );

    this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(
      this.comService.decimalQuantityFormat(
        this.queryParams.currencyConvRate ? this.queryParams.currencyConvRate : 0,
        "RATE"
      )
    );

  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.checkPdcValidation(event.value);
  }

  checkPdcValidation(date: any) {
    if (!this.posCurrencyReceiptDetailsForm.value.debitAmount) {
      this.snackBar.open("Please select debit account", "OK", {
        duration: 2000,
      });
    } else {
      const API = `AccountMaster/GetPDCAccount/${this.posCurrencyReceiptDetailsForm.value.debitAmount}`;
      this.dataService.getDynamicAPI(API).subscribe((resp) => {
        if (resp.status == "Success") {
          const pdcDays = resp.response.PDC_DAYS;
          const currentDate = new Date();
          const maxAllowedDate = new Date(currentDate);
          maxAllowedDate.setDate(currentDate.getDate() + pdcDays);

          if (date > maxAllowedDate) {
            this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(
              resp.response.PDC_RCPTAC
            );
            this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
              resp.response.ACCOUNT_HEAD
            );
            console.log(date, maxAllowedDate);
          } else {
            this.posCurrencyReceiptDetailsForm.controls.debitAmount.setValue(
              localStorage.getItem("CH_ACCODE")
            );
            this.posCurrencyReceiptDetailsForm.controls.debitAmountDesc.setValue(
              localStorage.getItem("CH_ACHEAD")
            );
          }
        }
      });
    }
  }
  //party Code Change
  DebitamountChange(event: any, accoutCode?: any) {
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
              let data = result.dynamicData[0];
              console.log("data", data);
              this.currencyData.WHERECONDITION = `@strBranch='${this.comService.branchCode}',@strPartyCode='${event.target.value}'`;

              if (
                this.posCurrencyReceiptDetailsForm.value.modeOfSelect ==
                "Cheque"
              ) {
                const account = data.find(
                  (account: any) => account.ACCODE === accoutCode
                );
                const bankCode = account.BANK_CODE;
                this.posCurrencyReceiptDetailsForm.controls.chequeDepositBank.setValue(
                  bankCode
                );
              }

              if (data && data[0].CURRENCY_CODE) {
                if (data[0].CURRENCY_CODE == this.compCurrency)
                  this.isCurrencyUpdate = true;
                else this.isCurrencyUpdate = false;
                // this.posCurrencyReceiptDetailsForm.controls.currencyCode.setValue(data[0].CURRENCY_CODE)
                // console.log(data[0].CURRENCY_CODE);
                // this.posCurrencyReceiptDetailsForm.controls.currencyRate.setValue(data[0].CONV_RATE);
                // this.getGSTDetails(data[0].ACCODE)
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

  validateReceipt() {
    if ('this.selectedTabIndex == "TT"') {
      return this.posCurrencyReceiptDetailsForm.invalid;
    } else if ('this.selectedTabIndex == "Cheque"') {
      return this.posCurrencyReceiptDetailsForm.invalid;
    } else {
      return this.posCurrencyReceiptDetailsForm.invalid;
    }
  }

  formatDateToISO(date: string | Date | any): string {
    let parsedDate: Date | any;

    if (date._isAMomentObject) {
      if (!date.isValid()) {
        throw new Error("Invalid date (moment object)");
      }
      parsedDate = date;
    } else if (typeof date === "string") {
      parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format (string)");
      }
    } else {
      parsedDate = date;
    }

    if (parsedDate instanceof Date && isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date (JS Date object)");
    }

    if (parsedDate.toISOString && parsedDate.toISOString() === "1900-01-01T00:00:00.000Z") {
      return "";
    }

    return date._isAMomentObject ? date.toISOString() : parsedDate.toISOString();
  }

  validateModeOfSelect(): boolean {
    const modeOfSelect = this.posCurrencyReceiptDetailsForm.value.modeOfSelect;

    switch (modeOfSelect) {
      case 'Credit Card': {
        const { creditCardNumber, creditCardName, creditCardDate } = this.posCurrencyReceiptDetailsForm.value;
        if (!creditCardNumber || !creditCardName || !creditCardDate) {
          this.toastr.error("Credit Card details are incomplete. Please fill all required fields.");
          return false;
        }
        break;
      }
      case 'Cheque': {
        const { chequeNumber, chequeDate, chequeDrawnBank, chequeDepositBank } = this.posCurrencyReceiptDetailsForm.value;
        if (!chequeNumber || !chequeDate || !chequeDrawnBank || !chequeDepositBank) {
          this.toastr.error("Cheque details are incomplete. Please fill all required fields.");
          return false;
        }
        break;
      }
      case 'TT': {
        const { ttNumber, ttDate, ttDrawnBank, ttDepositBank } = this.posCurrencyReceiptDetailsForm.value;
        if (!ttNumber || !ttDate || !ttDrawnBank || !ttDepositBank) {
          this.toastr.error("TT details are incomplete. Please fill all required fields.");
          return false;
        }
        break;
      }
      default: {
        return true;
      }
    }

    return true;
  }


  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      // this.update()
      return;
    }

    Object.keys(this.posCurrencyReceiptDetailsForm.controls).forEach(key => {
      const controlErrors = this.posCurrencyReceiptDetailsForm.get(key)?.errors;
      if (controlErrors != null) {
        console.log('Key control: ' + key + ', error: ' + JSON.stringify(controlErrors));

        this.posCurrencyReceiptDetailsForm.get(key)?.setValue("");

        console.log(key + ' is invalid, setting to an empty string.');
      }
    });

    this.posCurrencyReceiptDetailsForm.updateValueAndValidity();


    if (this.posCurrencyReceiptDetailsForm.invalid) {
      this.posCurrencyReceiptDetailsForm.markAllAsTouched();
      this.toastr.error("select all required fields");
      return;
    }

    const isModeValid = this.validateModeOfSelect();
    if (!isModeValid) {
      // Stop further execution if mode validation fails
      return;
    }

    console.log(this.posCurrencyReceiptDetailsForm.value.vocDate);
    const res = this.validateReceipt();
    if (!res) {
      var CHEQUE_NO, CHEQUE_DATE, CHEQUE_BANK, CHEQUE_DEPOSIT_BANK;
      if (this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "TT") {
        CHEQUE_NO = this.posCurrencyReceiptDetailsForm.value.ttNumber;
        CHEQUE_DATE = this.posCurrencyReceiptDetailsForm.value.ttDate;
        CHEQUE_BANK = this.posCurrencyReceiptDetailsForm.value.ttDrawnBank;
        CHEQUE_DEPOSIT_BANK =
          this.posCurrencyReceiptDetailsForm.value.ttDepositBank;
      } else if (
        this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Cheque"
      ) {
        CHEQUE_NO = this.posCurrencyReceiptDetailsForm.value.chequeNumber;
        CHEQUE_DATE = this.posCurrencyReceiptDetailsForm.value.chequeDate;
        CHEQUE_BANK = this.posCurrencyReceiptDetailsForm.value.chequeDrawnBank;
        CHEQUE_DEPOSIT_BANK =
          this.posCurrencyReceiptDetailsForm.value.chequeDepositBank;
      }

      let postData = {
        UNIQUEID: this.receiptData?.UNIQUEID || 0,
        SRNO: this.receiptData?.SRNO || 0,
        BRANCH_CODE: this.branchCode,
        RECPAY_TYPE: this.posCurrencyReceiptDetailsForm.value.modeOfSelect,
        MODE: this.isCreditcardMode
          ? this.posCurrencyReceiptDetailsForm.value.modeCODE
          : "",
        ACCODE: this.posCurrencyReceiptDetailsForm.value.debitAmount,
        CURRENCY_CODE: this.posCurrencyReceiptDetailsForm.value.currencyCode,
        CURRENCY_RATE: this.posCurrencyReceiptDetailsForm.value.currencyRate,
        AMOUNTFC: this.posCurrencyReceiptDetailsForm.value.amountFc,
        // "AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.amountFc,
        AMOUNTCC: this.posCurrencyReceiptDetailsForm.value.amountCc,
        HEADER_AMOUNT: this.posCurrencyReceiptDetailsForm.value.amountCc,
        CHEQUE_NO: CHEQUE_NO || "",
        CHEQUE_DATE: CHEQUE_DATE
          ? this.formatDateToISO(CHEQUE_DATE)
          : this.dummyDate,
        CHEQUE_BANK: CHEQUE_BANK || "",
        CHEQUE_DEPOSIT_BANK: CHEQUE_DEPOSIT_BANK || "",
        REMARKS: this.posCurrencyReceiptDetailsForm.value.remarks,
        BANKCODE:
          this.posCurrencyReceiptDetailsForm.value.chequeDepositBank || "",
        PDCYN: "N",
        HDACCOUNT_HEAD:
          this.posCurrencyReceiptDetailsForm.value.debitAmountDesc,
        MODEDESC: this.posCurrencyReceiptDetailsForm.value.modeDesc,
        D_POSSCHEMEID: "",
        D_POSSCHEMEUNITS: 1,
        CARD_NO: this.posCurrencyReceiptDetailsForm.value.creditCardNumber,
        CARD_HOLDER: this.posCurrencyReceiptDetailsForm.value.creditCardName,
        CARD_EXPIRY: moment(this.posCurrencyReceiptDetailsForm.value.creditCardDate, 'MM/YYYY', true).isValid()
          ? this.formatDateToISO(this.posCurrencyReceiptDetailsForm.value.creditCardDate)
          : this.dummyDate,
        //  this.posCurrencyReceiptDetailsForm.value.creditCardDate
        //   ? this.formatDateToISO(
        //     this.posCurrencyReceiptDetailsForm.value.creditCardDate
        //   )
        //   : this.formatDateToISO(this.dummyDate),
        PCRMID: 0,
        BASE_CONV_RATE: 0,
        SUBLEDJER_CODE: "",
        DT_BRANCH_CODE: "",
        DT_VOCTYPE: "",
        DT_VOCNO: 0,
        DT_YEARMONTH: "",
        TOTAL_AMOUNTFC: this.posCurrencyReceiptDetailsForm.value.totalFc || 0,
        // "TOTAL_AMOUNTFC": this.posCurrencyReceiptDetailsForm.value.totalFc || 0,
        TOTAL_AMOUNTCC: this.posCurrencyReceiptDetailsForm.value.totalLc || 0,
        CGST_PER: 0,
        CGST_AMOUNTFC: 0,
        CGST_AMOUNTCC: 0,
        SGST_PER: 0,
        SGST_AMOUNTFC: 0,
        SGST_AMOUNTCC: 0,
        IGST_PER: this.posCurrencyReceiptDetailsForm.value.vat || 0,
        IGST_AMOUNTFC: this.posCurrencyReceiptDetailsForm.value.vatcc || 0,
        IGST_AMOUNTCC: this.posCurrencyReceiptDetailsForm.value.vatcc || 0,
        CGST_ACCODE: "",
        SGST_ACCODE: "",
        IGST_ACCODE: this.igstAccode,
        GST_HEADER_AMOUNT: 0,
        GST_NUMBER: this.posCurrencyReceiptDetailsForm.value.vatNo,
        INVOICE_NUMBER: this.posCurrencyReceiptDetailsForm.value.invoiceNo,
        INVOICE_DATE: this.posCurrencyReceiptDetailsForm.value.invoiceDate ? this.formatDateToISO(
          this.posCurrencyReceiptDetailsForm.value.invoiceDate
        ) :this.dummyDate,
        DT_GST_STATE_CODE: "",
        DT_GST_TYPE: "",
        DT_GST_CODE: "VAT",
        DT_GST_GROUP: "R",
        CGST_CTRLACCODE: "",
        SGST_CTRLACCODE: "",
        IGST_CTRLACCODE: "",
        HSN_CODE: this.posCurrencyReceiptDetailsForm.value.hsnCode || "",
        MIDPCR: 0,
        INCLUSIVE: false,
        COMM_PER: this.commisionRate ? this.commisionRate : 0,
        COMM_AMOUNTCC: this.commissionAmount ? this.commissionAmount : 0,
        COMM_AMOUNTFC: this.commissionAmount ? this.commissionAmount : 0,
        COMM_TAXPER:
          this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Credit Card"
            ? this.posCurrencyReceiptDetailsForm.value.vat
            : 0,
        COMM_TAXAMOUNTCC:
          this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Credit Card"
            ? this.posCurrencyReceiptDetailsForm.value.vatcc
            : 0,
        COMM_TAXAMOUNTFC:
          this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Credit Card"
            ? this.posCurrencyReceiptDetailsForm.value.vatcc
            : 0,
        DT_TDS_CODE: "",
        TDS_PER: 0,
        TDS_AMOUNTFC: 0,
        TDS_AMOUNTCC: 0,
        PDC_WALLETAC: "",
        WALLET_YN: "",
        SL_CODE: "",
        SL_DESCRIPTION: "",
        OT_TRANSFER_TIME: "",
        VAT_EXPENSE_CODE: "",
        VAT_EXPENSE_CODE_DESC: "",
        AMLVALIDID: "",
        AMLSOURCEOFFUNDS: "",
        AMLTRANSACTION_TYPE: "",
      };

      this.close(postData);
    }
  }

  deleteWorkerMaster() {
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
        let API =
          "AdvanceReceipt/DeleteAdvanceReceipt/" + this.content.WORKER_CODE;
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
                      // this.workerMasterForm.reset()
                      this.tableData = [];
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
                      // this.workerMasterForm.reset()
                      this.tableData = [];
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

  changeAmountLc(event: any) {
    console.log(event);
    this.commissionAmount = 0;
    let amountLc = event.target.value;
    let amountFc = this.comService.CCToFC(
      this.posCurrencyReceiptDetailsForm.value.currencyCode,
      this.comService.emptyToZero(event.target.value)
    );
    let vatPrc = this.posCurrencyReceiptDetailsForm.controls.vat.value;
    let vatCc = (amountFc * vatPrc) / 100;
    this.vatAmountCC = (amountLc * vatPrc) / 100;
    let amountWithVat = amountFc + vatCc;
    let amountWithVatLC = this.vatAmountCC + parseFloat(amountLc);
    console.log(vatCc);
    this.posCurrencyReceiptDetailsForm.controls.amountCc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(event.target.value),
        "AMOUNT"
      )
    );
    if (
      this.posCurrencyReceiptDetailsForm.value.modeOfSelect == "Credit Card" &&
      this.posCurrencyReceiptDetailsForm.value.modeDesc
    ) {
      this.commissionAmount = this.comService.emptyToZero(
        amountLc * (this.commisionRate / 100)
      );
      console.log(this.commissionAmount);
    }
    //   this.comService.CCToFC(
    //     this.comService.compCurrency,
    //     this.comService.emptyToZero(this.order_items_total_amount)
    // )
    this.posCurrencyReceiptDetailsForm.controls.amountFc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.CCToFC(
          this.posCurrencyReceiptDetailsForm.value.currencyCode,
          this.comService.emptyToZero(event.target.value)
        ),
        "AMOUNT"
      )
    );
    this.posCurrencyReceiptDetailsForm.controls.vatcc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(vatCc),
        "AMOUNT"
      )
    );

    this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(amountWithVat),
        "AMOUNT"
      )
    );

    // this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue(this.comService.decimalQuantityFormat(
    //   this.comService.emptyToZero(amountWithVat),
    //   'AMOUNT'));
    this.posCurrencyReceiptDetailsForm.controls.totalLc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(amountWithVatLC),
        "AMOUNT"
      )
    );
    this.posCurrencyReceiptDetailsForm.controls.headerVatAmt.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(amountWithVatLC),
        "AMOUNT"
      )
    );
  }

  changeTotalLc(event: any) {
    console.log(event.target.value);

    this.posCurrencyReceiptDetailsForm.controls.totalLc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(event.target.value),
        "AMOUNT"
      )
    );
    this.posCurrencyReceiptDetailsForm.controls.headerVatAmt.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(event.target.value),
        "AMOUNT"
      )
    );

    this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.CCToFC(
          this.posCurrencyReceiptDetailsForm.value.currencyCode,
          this.comService.emptyToZero(event.target.value)
        ),
        "AMOUNT"
      )
    );

    // this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue(this.comService.decimalQuantityFormat(
    //   this.comService.emptyToZero(event.target.value),
    //   'AMOUNT'));
    let sum =
      (this.posCurrencyReceiptDetailsForm.controls.totalLc.value * 100) /
      (100 + parseFloat(this.posCurrencyReceiptDetailsForm.controls.vat.value));
    console.log(sum);

    this.posCurrencyReceiptDetailsForm.controls.amountCc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(sum),
        "AMOUNT"
      )
    );

    this.posCurrencyReceiptDetailsForm.controls.amountFc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.CCToFC(
          this.posCurrencyReceiptDetailsForm.value.currencyCode,
          this.comService.emptyToZero(sum)
        ),
        "AMOUNT"
      )
    );

    // this.posCurrencyReceiptDetailsForm.controls.amountFc.setValue(this.comService.decimalQuantityFormat(
    //   this.comService.emptyToZero(sum),
    //   'AMOUNT'));
    let vatcc = this.posCurrencyReceiptDetailsForm.controls.totalFc.value - sum;
    this.posCurrencyReceiptDetailsForm.controls.vatcc.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(vatcc),
        "AMOUNT"
      )
    );
  }

  resetVatFields() {
    this.posCurrencyReceiptDetailsForm.controls.amountCc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.amountFc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.vatcc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.totalFc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.totalLc.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.headerVatAmt.setValue("");

    this.posCurrencyReceiptDetailsForm.controls.creditCardNumber.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.creditCardName.setValue("");

    this.posCurrencyReceiptDetailsForm.controls.ttNumber.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.ttDrawnBank.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.ttDepositBank.setValue("");

    this.posCurrencyReceiptDetailsForm.controls.chequeNumber.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.chequeDrawnBank.setValue("");
    this.posCurrencyReceiptDetailsForm.controls.chequeDepositBank.setValue("");
  }

  setMonthAndYear(
    normalizedMonthAndYear: _moment.Moment,
    datepicker: MatDatepicker<_moment.Moment>
  ) {
    const ctrlValue = normalizedMonthAndYear;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    ctrlValue.endOf("month");
    this.posCurrencyReceiptDetailsForm.controls.creditCardDate.setValue(
      ctrlValue
    );
    datepicker.close();
  }

  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    return date ? date >= today : true;
  };

  /**USE: close modal window */
  close(data?: any) {
    console.log(data);

    // this.activeModal.close();
    if (
      this.receiptData != null &&
      this.receiptData != undefined &&
      data != null
    ) {
      data!.isUpdate = true;
    }

    this.activeModal.close(data);
  }

  openTab(event: any, formControlName: string) {
    console.log(event);

    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "debitAmount":
        this.overlayDebitCode.showOverlayPanel(event);
        break;
      case "currencyCode":
        this.overlayCurrencyCode.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }


  limitDigits(event: any): void {
    const input = event.target;
    if (input.value.length > 16) {
      input.value = input.value.slice(0, 16);  
    }
  }
  
}
