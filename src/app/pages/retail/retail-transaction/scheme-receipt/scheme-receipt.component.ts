import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild, } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal, NgbModal, NgbModalRef, } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import Swal from "sweetalert2";
import * as convert from "xml-js";
import { AddReceiptComponent } from "./add-receipt/add-receipt.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { AuditTrailComponent } from "src/app/shared/common/audit-trail/audit-trail.component";

@Component({
  selector: "app-scheme-receipt",
  templateUrl: "./scheme-receipt.component.html",
  styleUrls: ["./scheme-receipt.component.scss"],
})
export class SchemeReceiptComponent implements OnInit {
  @Input() content!: any;
  @ViewChild(AuditTrailComponent) auditTrailComponent?: AuditTrailComponent;

  // @ViewChild("content") contentTemplate: any;
  @ViewChild("inputElement") inputElement!: ElementRef;
  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  orderedItems: any[] = [];
  branchArray: any[] = [];
  newReceiptData: any = {};
  currentDate = this.commonService.currentDate;
  dataToEditrow: any;
  disableAddBtn: boolean = true;
  disablePostBtn: boolean = true;
  // filteredOptions!: Observable<any[]>;
  salesmanArray: any[] = [];
  rightSideHeader: string = "";
  isViewSchemeMasterGrid: boolean = true;
  disableDelete: boolean = true;
  isSaved: boolean = false;
  editFlag: boolean = false;
  isViewAddbtn: boolean = true;
  viewMode: boolean = false;
  gridAmountDecimalFormat: any;

  totalValue: number = 0;
  totalValue_FC: number = 0;
  totalAmount_LC: number = 0;
  VATAmount: number = 0;
  totalAmount_FC: number = 0;
  VATAmount_FC: number = 0;
  TOTAL_AMOUNTLC: number = 0;
  TOTAL_AMOUNTFC: number = 0;
  totalPartyValue: number = 0;
  editDataMID: number = 0;
  totalValueInText: string = "";
  CustomerNameSearch: string = "";
  CustomerCodeSearch: string = "";
  currencySelected: string = "";
  VocNumberMain: string = "";
  schemeIdEdit: string = "";
  branchName: any = localStorage.getItem("BRANCH_PARAMETER");
  schemeDataFlag: boolean = false;
  disableAddBtnGrid: boolean = true;
  VIEWEDITFLAG: string = '';
  dataIndex: any;

  customerMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "code",
    SEARCH_HEADING: "Pos Customer Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  SchemeMasterFindData: MasterSearchModel = {
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    API_VALUE: `SchemeRegistration/GetSchemeWithCustomerCode`
  };
  partyCodeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 81,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Account Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  salesPersonMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  receiptDetailsForm: FormGroup = this.formBuilder.group({
    Branch: [""],
    YEARMONTH: [""],
    Salesman: [""],
    SalesmanName: [""],
    PartyCode: [""],
    PartyDescription: [""],
    VocType: [""],
    VocDate: [""],
    VocNo: [""],
    CurrCode: [""],
    CurrRate: [""],
    RefNo: [""],
    DueDays: [""],
    DueDate: [""],
    RefDate: [""],
    PostedDate: [""],
    SchemeCode: ["", [Validators.required]],
    SchemeID: ["", [Validators.required]],
    SchemeUniqueID: [""],
    SchemeUnits: [""],
    POSCustomerDate: [""],
    POSCustomerCode: ["", [Validators.required]],
    POSCustomerName: ["", [Validators.required]],
    POSCustomerMobile: [""],
    POSCustomerEmail: [""],
    Narration: [""],
    MID: [""],
    SCHEME_AMOUNT: [0],
    SCH_CUSTOMER_CODE: [0],
    SCH_INST_AMOUNT_FC: [0],
    PartyAmount: [''],
    PartyAmtCode: [''],
    PartyAddress: [''],
    IGST_ACCODE: [''],
    SGST_ACCODE: [''],
    CGST_ACCODE: [''],
    POS_TAX_CRACCODE: [''],
    TotalAmount: [0],
    TotalTax: [0],
    TotalTax_FC: [0],
    SchemeBalance: [0],
  });
  private subscriptions: Subscription[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private activeModal: NgbActiveModal,
  ) {
    this.deleteRow = this.deleteRow.bind(this);
  }

  ngOnInit(): void {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
      currency: 'AED'
    };
    this.setInitialValues()
    if (!this.content) {
      this.fetchPartyCode();
      this.setCompanyCurrency();
    } else {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'EDIT') {
        this.viewMode = true;
      }
    }
    if (this.inputElement) {
      this.renderer.selectRootElement(this.inputElement.nativeElement).focus();
    }
  }
  /**USE: set values for view and edit */
  setInitialValues() {
    if (!this.content) {
      this.branchName = this.branchName?.BRANCH_NAME;
      this.receiptDetailsForm.controls.Branch.setValue(this.commonService.branchCode);
      this.receiptDetailsForm.controls.VocType.setValue(this.commonService.getqueryParamVocType());
      this.receiptDetailsForm.controls.VocDate.setValue(this.currentDate);
      this.receiptDetailsForm.controls.YEARMONTH.setValue(this.commonService.yearSelected);
      this.receiptDetailsForm.controls.PostedDate.setValue(this.currentDate);
      this.receiptDetailsForm.controls.RefDate.setValue(this.currentDate);
      return
    }
    this.receiptDetailsForm.controls.Branch.setValue(this.content.BRANCH_CODE);
    this.receiptDetailsForm.controls.VocType.setValue(this.content.VOCTYPE);

    this.receiptDetailsForm.controls.PostedDate.setValue(this.content.POSTDATE);
    this.receiptDetailsForm.controls.RefDate.setValue(this.content.POSTDATE);
    this.receiptDetailsForm.controls.Salesman.setValue(this.content.SALESPERSON_CODE);

    this.receiptDetailsForm.controls.VocNo.setValue(this.content.VOCNO);
    this.receiptDetailsForm.controls.CurrCode.setValue(this.content.PARTY_CURRENCY);
    this.receiptDetailsForm.controls.CurrRate.setValue(
      this.commonService.decimalQuantityFormat(this.content.PARTY_CURR_RATE, 'RATE')
    );
    this.receiptDetailsForm.controls.POSCustomerMobile.setValue(this.content.CUSTOMER_MOBILE);
    this.receiptDetailsForm.controls.POSCustomerEmail.setValue(this.content.CUSTOMER_EMAIL);
    this.receiptDetailsForm.controls.POSCustomerCode.setValue(this.content.POSCUSTOMERCODE);
    this.receiptDetailsForm.controls.POSCustomerName.setValue(this.content.CUSTOMER_NAME);
    this.receiptDetailsForm.controls.SchemeCode.setValue(this.content.SCH_SCHEME_CODE);
    this.receiptDetailsForm.controls.SchemeID.setValue(this.content.SCH_CUSTOMER_ID);
    this.receiptDetailsForm.controls.Narration.setValue(this.content.REMARKS);
    this.receiptDetailsForm.controls.PartyCode.setValue(this.content.PARTYCODE);
    this.receiptDetailsForm.controls.PartyDescription.setValue(this.content.HHACCOUNT_HEAD);
    this.receiptDetailsForm.controls.PartyAddress.setValue(this.content.PARTY_ADDRESS);
    this.receiptDetailsForm.controls.PartyAmtCode.setValue(this.content.PARTY_CURRENCY);
    this.receiptDetailsForm.controls.IGST_ACCODE.setValue(this.content.IGST_ACCODE);
    this.receiptDetailsForm.controls.YEARMONTH.setValue(this.content.YEARMONTH);
    this.receiptDetailsForm.controls.MID.setValue(this.content.MID);
    this.receiptDetailsForm.controls.POS_TAX_CRACCODE.setValue(this.content.POS_TAX_CRACCODE);

    this.setFormControlAmount('PartyAmount',this.content.TOTAL_AMOUNTCC)
    this.setFormControlAmount('TotalAmount',this.content.TOTAL_AMOUNTCC)
    this.setFormControlAmount('TotalTax',this.content.GST_TOTALFC)
    this.setFormControlAmount('TotalTax_FC',this.content.GST_TOTALFC)
    this.getDetailsForEdit(this.content.MID)
    this.getSalesmanList();
  }
  //USE: account posting click fn 
  AccountPosting() {
    if (!this.content) return
    let params = {
      BRANCH_CODE: this.receiptDetailsForm.value.Branch,
      VOCTYPE: this.receiptDetailsForm.value.VocType,
      VOCNO: this.receiptDetailsForm.value.VocNo,
      YEARMONTH: this.receiptDetailsForm.value.YEARMONTH,
      MID: this.commonService.nullToString(this.content.MID),
      ACCUPDATEYN: 'Y',
      USERNAME: this.commonService.userName,
      MAINVOCTYPE: this.commonService.getqueryParamMainVocType(),
      HEADER_TABLE: this.commonService.getqueryParamTable(),
    }
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams('AccountPosting', params)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.disablePostBtn = true
          this.commonService.toastSuccessByText('Posting Done')
        } else {
          this.commonService.toastErrorByMsgId(result.message)
        }
      },
        (err) => this.commonService.toastErrorByMsgId("Server Error")
      );
    this.subscriptions.push(Sub);
  }
  auditTrailClick() {
    let params = {
      BRANCH_CODE: this.receiptDetailsForm.value.Branch,
      VOCTYPE: this.receiptDetailsForm.value.VocType,
      VOCNO: this.receiptDetailsForm.value.VocNo,
      MID: this.receiptDetailsForm.value.MID,
      YEARMONTH: this.receiptDetailsForm.value.YEARMONTH,
    }
    this.auditTrailComponent?.showDialog(params)
  }
  onRowClickHandler(event: any) {
    this.VIEWEDITFLAG = 'EDIT'
    this.dataIndex = event.dataIndex
    this.openNewReceiptDetails(this.content)
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE =
      this.commonService.getCompanyParamValue("COMPANYCURRENCY");
    this.receiptDetailsForm.controls.CurrCode.setValue(CURRENCY_CODE);
    this.setCurrencyRate();
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter(
      (item: any) =>
        item.CURRENCY_CODE == this.receiptDetailsForm.value.CurrCode
    );
    if (CURRENCY_RATE.length > 0) {
      let currency = this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, "RATE")
      this.receiptDetailsForm.controls.CurrRate.setValue(currency);
    } else {
      this.receiptDetailsForm.controls.currency.setValue("");
      this.receiptDetailsForm.controls.currencyrate.setValue("");
      this.commonService.toastErrorByMsgId("MSG1531");
    }
  }
  /**USE: get details from API for EDIT and VIEW */
  getDetailsForEdit(MID: any) {
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(`SchemeCurrencyReceipt/${MID}`)
      .subscribe((resp: any) => {
        this.commonService.closeSnackBarMsg();
        if (resp.response) {
          if (resp.response) {
            let result = resp.response;
            this.disablePostBtn = result.AUTOPOSTING == true ? true : false;
            this.receiptDetailsForm.controls.VocDate.setValue(result.VOCDATE);
            this.orderedItems = result.Details;
            this.orderedItems.forEach((item: any, i: any) => {
              item.SRNO = i + 1;
              item.Branch = item.BRANCH_CODE
              item.Type = item.RECPAY_TYPE
              item.AC_Code = item.ACCODE
              item.CurrCode = item.CURRENCY_CODE
              item.AC_Description = item.HDACCOUNT_HEAD
              item.CurrRate = this.commonService.decimalQuantityFormat(item.CURRENCY_RATE,'RATE')
              item.AMOUNT_VAT = item.AMOUNTCC
              item.AMOUNT_VATFC = item.AMOUNTFC
            });
          }
          this.calculateTotalonView();

          // this.ChangeDetector.detectChanges()
        } else {
          this.toastr.error(
            "No Response Found",
            resp.Message ? resp.Message : "",
            {
              timeOut: 2000,
            }
          );
        }
      }, (err) => {
        this.commonService.closeSnackBarMsg();
      }
      );
    this.subscriptions.push(Sub);
  }
  calculateDueDays() {
    let date = this.commonService.addDaysToDate(this.receiptDetailsForm.value.RefDate, this.receiptDetailsForm.value.DueDays)
    this.receiptDetailsForm.controls.RefDate.setValue(date)
  }
  //date validation
  dateChange(event: any, flag?: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.VocDate.setValue(new Date(date));
    }
  }
  datePostedChange(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.PostedDate.setValue(new Date(date));
    }
  }
  dateRefChange(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.RefDate.setValue(new Date(date));
    }
  }

  /** Add new Receipt */
  addPOSreceipt() {
    this.snackBar.dismiss();
    let branch = localStorage.getItem("userbranch");
    if (branch) {
      this.receiptDetailsForm.controls.Branch.setValue(branch);
    }
    this.receiptDetailsForm.controls.VocDate.setValue(this.currentDate);
    this.receiptDetailsForm.controls.PostedDate.setValue(this.currentDate);
    this.receiptDetailsForm.controls.RefDate.setValue(this.currentDate);
    this.fetchPartyCode();
    this.editFlag = false;
    this.isViewSchemeMasterGrid = false;
  }
  //USE: delete row
  deleteRow(e: any) {
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
        let str = e.row.data;
        if (this.orderedItems) {
          let item = this.orderedItems.filter((item: any) => item.Id != str.Id);
          this.orderedItems = item;
          this.orderedItems.forEach((item: any, i: any) => {
            item.SRNO = i + 1;
          });
          // this.ChangeDetector.detectChanges()
        }
      }
    });
  }

  selectedSalesman(data: any) {
    this.receiptDetailsForm.controls.Salesman.setValue(data.SALESPERSON_CODE);
    this.receiptDetailsForm.controls.SalesmanName.setValue(data.DESCRIPTION);
    console.log(this.receiptDetailsForm.value.Salesman);

  }
  salesmanChange(event: any) {
    if (event.target.value == "" || this.content?.FLAG == 'VIEW') return;
    let inputValue = event.target.value;
    inputValue = inputValue.toUpperCase();
    let data = this.commonService.SalespersonMasterData.filter((item: any) => item.SALESPERSON_CODE == inputValue);
    if (data.length > 0) {
      this.receiptDetailsForm.controls.Salesman.setValue(
        data[0].SALESPERSON_CODE
      );
      this.receiptDetailsForm.controls.SalesmanName.setValue(
        data[0].DESCRIPTION
      );
    } else {
      this.toastr.error("Invalid Salesperson Code, try search!");
      this.receiptDetailsForm.controls.Salesman.setValue("");
    }
  }

  exportToExcel() {
    this.commonService.exportExcel(this.schemeReceiptList, "Receipt Details");
  }

  //fetch scheme with custcode
  fetchSchemeWithCustCode(customerCode: string) {
    let custCode = "";
    custCode = customerCode;
    this.schemeDataFlag = true
    this.SchemeMasterFindData = {
      SEARCH_FIELD: 'SCH_CUSTOMER_ID,SCH_SCHEME_CODE',
      VIEW_INPUT: false,
      VIEW_TABLE: true,
      LOAD_ONCLICK: true,
      API_VALUE: `SchemeRegistration/GetSchemeWithCustomerCode/${custCode}`
    };
  }
  fetchSchemeId(customerId: any) {
    let API = `SchemeRegistration/GetSchemeRegistrationDetail/${customerId}`;
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        this.commonService.closeSnackBarMsg();
        if (result.response) {
          let data = result.response;
          this.receiptDetailsForm.controls.SchemeID.setValue(data.SCH_CUSTOMER_ID)
          if (data.SCH_CANCEL) {
            this.disableAddBtnGrid = true;
          } else {
            this.disableAddBtnGrid = false;
          }
          this.receiptDetailsForm.controls.SchemeCode.setValue(data.SCH_SCHEME_CODE)
          this.receiptDetailsForm.controls.SCH_CUSTOMER_CODE.setValue(data.SCH_CUSTOMER_CODE)
          this.receiptDetailsForm.controls.SchemeUniqueID.setValue(data.SCH_CUSTOMER_ID)
          this.receiptDetailsForm.controls.SCH_INST_AMOUNT_FC.setValue(data.SCH_INST_AMOUNT_FC)
          this.receiptDetailsForm.controls.POSCustomerEmail.setValue(data.SCH_ALERT_EMAIL)
          this.receiptDetailsForm.controls.SCHEME_AMOUNT.setValue(
            this.commonService.emptyToZero(data.PAY_AMOUNTFC)
          )
        } else {
          this.receiptDetailsForm.controls.SchemeID.setValue("");
          this.receiptDetailsForm.controls.SchemeUniqueID.setValue("");
          this.commonService.toastErrorByMsgId(result.Message ? result.Message : "Scheme Not found");
        }
      },
      (err) => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId("Server Error")
      }
    );
    this.subscriptions.push(Sub);
  }
  //fetch PartyCode fronewReceiptDatam VoctypeMasterOnlineScheme
  fetchPartyCode() {
    let API = `VoctypeMasterOnlineScheme/${this.commonService.branchCode}/${this.receiptDetailsForm.value.VocType}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.response) {
          let data = result.response;
          if (data[0].DEFACCODE != "") {
            this.receiptDetailsForm.controls.PartyCode.setValue(data[0].DEFACCODE);
            this.receiptDetailsForm.controls.PartyDescription.setValue(data[0].ACCOUNT_HEAD);
            this.newReceiptData.PARTY_CODE = data[0].DEFACCODE;
          } else {
            this.fetchCreditCardMaster();
          }
        }
      },
      (err) => this.commonService.toastErrorByMsgId("Server Error")
    );
    this.subscriptions.push(Sub);
  }
  //fetch from CreditCardMaster
  fetchCreditCardMaster() {
    let API = `CreditCardMaster/GetCreditCardMaster`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        console.log(result);

        if (result.response) {
          let res = result.response.filter((item: any) => item.MODE == 3);
          if (res[0].ACCODE) {
            this.receiptDetailsForm.controls.PartyCode.setValue(res[0].ACCODE);
            this.receiptDetailsForm.controls.PartyDescription.setValue(res[0].DESCRIPTION);
            this.newReceiptData.PARTY_CODE = res[0].ACCODE;
            this.rightSideHeader = res[0].DESCRIPTION;
          } else {
            this.commonService.toastErrorByMsgId("PartyCode not found in credit master");
          }
          if (res[0].CURRENCY_CODE != "") {
            this.receiptDetailsForm.controls.CurrCode.setValue(
              res[0].CURRENCY_CODE
            );
            this.newReceiptData.CURRENCY_CODE = res[0].CURRENCY_CODE;
            this.currencyCodeChange(res[0].CURRENCY_CODE);
          }
        } else {
          this.toastr.error(
            "PartyCode not found in credit master",
            result.Message ? result.Message : "",
            {
              timeOut: 3000,
            }
          );
        }
      },
      (err) =>
        this.toastr.error("Server Error", "", {
          timeOut: 3000,
        })
    );
    this.subscriptions.push(Sub);
  }
  selectedParty(data: any) {
    this.receiptDetailsForm.controls.PartyCode.setValue(data.ACCODE);
    this.receiptDetailsForm.controls.PartyDescription.setValue(data.ACCOUNT_HEAD || data['ACCOUNT HEAD']);
    this.newReceiptData.PARTY_CODE = data.ACCODE;
    if (data.CURRENCY_CODE) {
      this.receiptDetailsForm.controls.CurrCode.setValue(data.CURRENCY_CODE);
      this.newReceiptData.CURRENCY_CODE = data.CURRENCY_CODE;
      this.currencyCodeChange(data.CURRENCY_CODE);
    }
  }
  schemeCodeClick() {
    if (this.receiptDetailsForm.value.POSCustomerCode == '') {
      this.commonService.toastErrorByMsgId('please select customer')
      return
    }
  }
  selectedScheme(data: any) {
    if (this.receiptDetailsForm.value.POSCustomerCode == '') {
      this.commonService.toastErrorByMsgId('please select customer')
      return
    }
    if (this.orderedItems.length > 0) {
      this.disableAddBtnGrid = true;
      this.commonService.toastErrorByMsgId('please delete selected receipt')
      return
    }
    this.receiptDetailsForm.controls.SchemeCode.setValue(data.SCH_SCHEME_CODE);
    this.fetchSchemeId(data.SCH_CUSTOMER_ID)
  }
  //customer selection from search
  selectedCustomer(data: any) {
    this.receiptDetailsForm.controls.POSCustomerName.setValue(data.NAME);
    this.receiptDetailsForm.controls.POSCustomerCode.setValue(data.CODE);
    this.receiptDetailsForm.controls.POSCustomerMobile.setValue(data.MOBILE);
    this.resetSchemeDetails()
    this.fetchSchemeWithCustCode(this.receiptDetailsForm.value.POSCustomerCode);
  }
  
  resetSchemeDetails() {
    this.receiptDetailsForm.controls.SchemeCode.setValue('');
    this.receiptDetailsForm.controls.SchemeID.setValue('');
    this.receiptDetailsForm.controls.PartyAmtCode.setValue('');
    this.receiptDetailsForm.controls.PartyAmount.setValue('');
    this.orderedItems = []
  }
  //party Code Change
  customerChange(event: any, searchFlag: string) {
    if (event.target.value == "") return;
    if (this.content?.FLAG == 'VIEW' || this.content?.FLAG == 'EDIT') return;
    this.VocNumberMain = "";
    this.resetSchemeDetails()
    this.commonService.showSnackBarMsg('Loading ...')
    let API = `${searchFlag}=${event.target.value}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        this.commonService.closeSnackBarMsg();
        if (result.response) {
          let data = result.response;
          if (data) {
            this.receiptDetailsForm.controls.POSCustomerName.setValue(data.NAME);
            this.receiptDetailsForm.controls.POSCustomerMobile.setValue(data.MOBILE);
            this.receiptDetailsForm.controls.POSCustomerCode.setValue(data.CODE);
            this.receiptDetailsForm.controls.POSCustomerEmail.setValue(data.EMAIL);
            this.fetchSchemeWithCustCode(data.CODE);
          }
        } else {
          this.commonService.toastErrorByMsgId("Customer not found");
        }
      },
      (err) =>
        this.commonService.toastErrorByMsgId("Server Error")
    );
    this.subscriptions.push(Sub);
  }

  //party Code Change
  partyCodeChange(event: any, searchFlag: string) {
    if (event.target.value == "") return;
    let API = `Scheme/AccountMaster?${searchFlag}=${event.target.value}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.response) {
          let data = result.response;
          if (data.CURRENCY_CODE) {
            this.receiptDetailsForm.controls.CurrCode.setValue(
              data.CURRENCY_CODE
            );
            this.newReceiptData.CURRENCY_CODE = data.CURRENCY_CODE;
            this.currencyCodeChange(data.CURRENCY_CODE);
          }
          if (data.ACCOUNT_HEAD) {
            this.rightSideHeader = data.ACCOUNT_HEAD;
          }
        } else {
          this.commonService.toastErrorByMsgId("PartyCode not found in credit master");
        }
      },
      (err) =>
        this.toastr.error("Server Error", "", {
          timeOut: 3000,
        })
    );
    this.subscriptions.push(Sub);
  }
  //currency Code Change
  currencyCodeChange(value: string) {
    if (value == "") return;
    let API = `CurrencyMaster/GetCurrencyMasterDetail/${value}`;
    let Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.response) {
          let data = result.response;
          if (data.CONV_RATE) {
            this.receiptDetailsForm.controls.CurrRate.setValue(
              this.commonService.decimalQuantityFormat(data.CONV_RATE, 'RATE')
            );
            this.newReceiptData.CONV_RATE = data.CONV_RATE;
          }
        } else {
          this.commonService.toastErrorByMsgId("Customer not found");
        }
      },
      (err) =>
        this.commonService.toastErrorByMsgId("Server Error")
    );
    this.subscriptions.push(Sub);
  }
  /**USE: salesman autocomplete starts*/
  getSalesmanList() {
    let Sub: Subscription = this.dataService
      .getDynamicAPI("SalesPersonMaster/GetSalespersonMasterList")
      .subscribe(
        (result) => {
          if (result.response) {
            this.salesmanArray = result.response;

            let data = this.salesmanArray.filter((item: any) => item.SALESPERSON_CODE == this.content.SALESPERSON_CODE);
            if (data?.length > 0) {
              this.receiptDetailsForm.controls.SalesmanName.setValue(
                data[0].DESCRIPTION
              );
            }
          } else {
            this.commonService.toastErrorByMsgId("Salesman not found");
          }
        },
        (err) =>
          this.commonService.toastErrorByMsgId("Server Error")
      );
    this.subscriptions.push(Sub);
  }

  /**use: open new scheme details */
  openNewReceiptDetails(data?: any) {
    if (this.receiptDetailsForm.value.SchemeID == '') {
      this.commonService.toastErrorByMsgId('select a scheme')
      return
    }
    if (data) {
      data.FLAG = 'VIEW'
      this.dataToEditrow = data;
    } else {
      this.dataToEditrow = this.receiptDetailsForm.value;
    }
    const modalRef: NgbModalRef = this.modalService.open(AddReceiptComponent, {
      size: "xl",
      backdrop: true, //'static'
      keyboard: false,
      windowClass: "modal-full-width",
    });
    modalRef.componentInstance.content = this.dataToEditrow;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.addNewRow(result); //USE: set Values To Detail table
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
      }
    );
  }

  setDetailData() {
    let detailsArray: any = [];
    let datas: any = {};
    let branchData = this.commonService.allbranchMaster

    this.orderedItems.forEach((item: any) => {
      datas = {
        "UNIQUEID": 0,
        "SRNO": item.SRNO,
        "BRANCH_CODE": item.Branch || "",
        "RECPAY_TYPE": item.Type || "",
        "MODE": item.TypeCode || "",
        "ACCODE": item.AC_Code || "",
        "CURRENCY_CODE": item.CurrCode || "",
        "CURRENCY_RATE": this.commonService.emptyToZero(item.CurrRate) || 0,
        "AMOUNTFC": this.commonService.emptyToZero(item.AMOUNT_VAT),
        "AMOUNTCC": this.commonService.emptyToZero(item.AMOUNT_VATFC),
        "HEADER_AMOUNT": this.commonService.emptyToZero(this.receiptDetailsForm.value.TotalTax),
        "CHEQUE_NO": "",
        "CHEQUE_DATE": this.commonService.formatDateTime(this.currentDate),
        "CHEQUE_BANK": "",
        "REMARKS": this.commonService.nullToString(item.Narration),
        "BANKCODE": "",
        "PDCYN": "N",
        "HDACCOUNT_HEAD": this.commonService.nullToString(item.AC_Description),
        "MODEDESC": this.commonService.nullToString(item.TypeCodeDESC),
        "D_POSSCHEMEID": this.commonService.nullToString(this.receiptDetailsForm.value.SchemeUniqueID),
        "D_POSSCHEMEUNITS": this.commonService.emptyToZero(this.receiptDetailsForm.value.SchemeUnits),
        "DT_BRANCH_CODE": this.commonService.branchCode,
        "DT_VOCTYPE": this.receiptDetailsForm.value.VocType,
        "DT_VOCNO": 0,
        "DT_YEARMONTH": this.receiptDetailsForm.value.YEARMONTH,
        "CARD_NO": "",
        "CARD_HOLDER": "",
        "CARD_EXPIRY": this.commonService.formatDateTime(this.currentDate),
        "BASE_CONV_RATE": this.commonService.emptyToZero(this.receiptDetailsForm.value.CurrRate),
        "SUBLEDJER_CODE": "",
        "TOTAL_AMOUNTFC": this.commonService.emptyToZero(this.TOTAL_AMOUNTFC),
        "TOTAL_AMOUNTCC": this.commonService.emptyToZero(this.TOTAL_AMOUNTLC),
        "CGST_PER": 0,
        "CGST_AMOUNTFC": 0,
        "CGST_AMOUNTCC": 0,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": 0,
        "SGST_AMOUNTCC": 0,
        "IGST_PER": item.TRN_Per,
        "IGST_AMOUNTFC": this.commonService.emptyToZero(this.receiptDetailsForm.value.TotalTax_FC),
        "IGST_AMOUNTCC": this.commonService.emptyToZero(this.receiptDetailsForm.value.TotalTax),
        "CGST_ACCODE": this.commonService.nullToString(item.CGST_ACCODE),
        "SGST_ACCODE": this.commonService.nullToString(item.SGST_ACCODE),
        "IGST_ACCODE": this.commonService.nullToString(item.POS_TAX_CRACCODE),
        "GST_HEADER_AMOUNT": this.commonService.emptyToZero(this.TOTAL_AMOUNTLC),
        "GST_NUMBER": "",
        "INVOICE_NUMBER": item.TRN_No,
        "INVOICE_DATE": this.commonService.formatDate(this.receiptDetailsForm.value.VocDate),
        "MIDPCR": 0,
        "CGST_CTRLACCODE": "",
        "SGST_CTRLACCODE": "",
        "IGST_CTRLACCODE": "",
        "HSN_CODE": this.commonService.nullToString(item.HSN_AC),
        "DT_GST_TYPE": "IGST",
        "DT_GST_CODE": this.commonService.nullToString(branchData.BRANCH_TAXTYPE),
        "DT_GST_GROUP": this.commonService.nullToString(item.GST_GROUP),
        "DT_GST_STATE_CODE": "",
        "INCLUSIVE": true,
        "COMM_PER": 0,
        "COMM_AMOUNTCC": 0,
        "COMM_AMOUNTFC": 0,
        "COMM_TAXPER": 0,
        "COMM_TAXAMOUNTCC": 0,
        "COMM_TAXAMOUNTFC": 0,
        "DT_TDS_CODE": "",
        "TDS_PER": 0,
        "TDS_AMOUNTFC": 0,
        "TDS_AMOUNTCC": 0,
        "PDC_WALLETAC": "",
        "WALLET_YN": "",
        "SL_CODE": "",
        "SL_DESCRIPTION": "",
        "OT_TRANSFER_TIME": "",
        "VAT_EXPENSE_CODE": "",
        "VAT_EXPENSE_CODE_DESC": "",
        "AMLVALIDID": "",
        "AMLSOURCEOFFUNDS": "",
        "AMLTRANSACTION_TYPE": ""
      }
      detailsArray.push(datas);
    });
    return detailsArray
  }
  setPostDateToSave() {
    return {
      "MID": 1,
      "BRANCH_CODE": this.receiptDetailsForm.value.Branch || "",
      "VOCTYPE": this.receiptDetailsForm.value.VocType || "PCR",
      "VOCNO": this.receiptDetailsForm.value.VocNo || 0,
      "VOCDATE": this.commonService.formatDate(this.receiptDetailsForm.value.VocDate),
      "VALUE_DATE": this.commonService.formatDateTime(this.currentDate),
      "YEARMONTH": this.receiptDetailsForm.value.YEARMONTH,
      "PARTYCODE": this.receiptDetailsForm.value.PartyCode || "",
      "PARTY_CURRENCY": this.receiptDetailsForm.value.CurrCode || "",
      "PARTY_CURR_RATE": this.commonService.emptyToZero(this.receiptDetailsForm.value.CurrRate),
      "TOTAL_AMOUNTFC": this.commonService.emptyToZero(this.TOTAL_AMOUNTFC),
      "TOTAL_AMOUNTCC": this.commonService.emptyToZero(this.TOTAL_AMOUNTLC),
      "REMARKS": this.receiptDetailsForm.value.Narration || "",
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "NAVSEQNO": 0,
      "HAWALACOMMCODE": "",
      "HAWALACOMMPER": 0,
      "FLAG_UPDATED": "N",
      "FLAG_INPROCESS": "N",
      "SUPINVNO": "",
      "SUPINVDATE": this.commonService.formatDateTime(this.currentDate),
      "HHACCOUNT_HEAD": this.rightSideHeader || "Advance From Retail Customers By Scheme",
      "SALESPERSON_CODE": this.receiptDetailsForm.value.Salesman || "",
      "BALANCE_FC": this.commonService.emptyToZero(this.receiptDetailsForm.value.SchemeBalance),
      "BALANCE_CC": this.commonService.emptyToZero(this.receiptDetailsForm.value.SchemeBalance),
      "AUTHORIZEDPOSTING": false,
      "AUTOGENREF": "",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "OUSTATUSNEW": 1,
      "POSCUSTOMERCODE": this.commonService.nullToString(this.receiptDetailsForm.value.POSCustomerCode),
      "D2DTRANSFER": "F",
      "DRAFT_FLAG": "",
      "POSSCHEMEID": this.commonService.nullToString(this.receiptDetailsForm.value.SchemeUniqueID),
      "PARTY_ADDRESS": "",
      "AUTOPOSTING": false,
      "POSTDATE": this.commonService.formatDateTime(this.receiptDetailsForm.value.PostedDate),
      "FLAG_EDIT_ALLOW": "",
      "BASE_CURRENCY": this.commonService.nullToString(this.receiptDetailsForm.value.CurrCode),
      "BASE_CURR_RATE": this.commonService.emptyToZero(this.receiptDetailsForm.value.CurrRate),
      "BASE_CONV_RATE": 0, //Todo
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "",
      "GST_NUMBER": "",
      "GST_TYPE": "",
      "GST_TOTALFC": this.commonService.emptyToZero(this.receiptDetailsForm.value.TotalTax_FC),
      "GST_TOTALCC": this.commonService.emptyToZero(this.receiptDetailsForm.value.TotalTax),
      "REC_STATUS": "",
      "CUSTOMER_NAME": this.commonService.nullToString(this.receiptDetailsForm.value.POSCustomerName),
      "CUSTOMER_MOBILE": this.commonService.nullToString(this.receiptDetailsForm.value.POSCustomerMobile),
      "CUSTOMER_EMAIL": this.commonService.nullToString(this.receiptDetailsForm.value.POSCustomerEmail),
      "TDS_CODE": "",
      "TDS_APPLICABLE": false,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "ADRRETURNREF": "",
      "ADVRETURN": false,
      "SCH_SCHEME_CODE": this.receiptDetailsForm.value.SchemeCode,
      "SCH_CUSTOMER_ID": this.receiptDetailsForm.value.SchemeID,
      "REFDOCNO": "",
      "FROM_TOUCH": false,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "GIFT_CARDNO": "",
      "OT_TRANSFER_TIME": "",
      "HTUSERNAME": "",
      "DUEDAYS": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "WOOCOMCARDID": "",
      "POSORDER_REF": "",
      "Details": this.setDetailData(),
    };
  }
  formSubmit() {
    console.log(this.receiptDetailsForm.value.Salesman);
    if (this.orderedItems.length == 0) {
      this.commonService.toastErrorByMsgId("Add new receipt to save");
      return;
    }
    if (this.isSaved) {
      this.commonService.toastErrorByMsgId("Saved Receipt! please cancel to add new receipt");
      return;
    }
    if (this.receiptDetailsForm.invalid) {
      this.commonService.toastErrorByMsgId("Select all required fields");
      return;
    }

    let postData = this.setPostDateToSave()
    if (this.editFlag) {
      this.submitEditedForm(postData);
      return;
    }

    this.commonService.showSnackBarMsg('MSG81447');
    this.dataService.postDynamicAPI("SchemeCurrencyReceipt", postData)
      .subscribe((result: any) => {
        this.commonService.closeSnackBarMsg;
        if (result["status"] == "Success" || result.response) {
          this.isSaved = true;
          let respData = result.response;
          this.receiptDetailsForm.controls.VocNo.setValue(respData?.VOCNO);
          Swal.fire({
            title: result["status"] ? result["status"] : result.status,
            text: result["message"] ? result["message"] : result.Message,
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
              this.disableDelete = true;
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.toastr.error(
            "Not saved try again", "", {
            timeOut: 3000,
          }
          );
        }
      }, (err) => {
        this.commonService.closeSnackBarMsg;
      });
  }
  submitEditedForm(postData: any) {
    this.snackBar.open("Loading ...");
    this.dataService
      .putDynamicAPI(`Scheme/CurrencyReceipt?MID=${this.editDataMID}`, postData)
      .subscribe((result: any) => {
        this.snackBar.dismiss();
        if (result["status"] == "Success" || result.response) {
          this.isSaved = true;
          let respData = result.response;
          this.receiptDetailsForm.controls.VocNo.setValue(respData?.VOCNO);
          Swal.fire({
            title: result["status"] ? result["status"] : result.status,
            text: result["message"] ? result["message"] : result.Message,
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ok",
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        } else {
          this.toastr.error(
            "Not saved try again",
            result.message ? result.message : "",
            {
              timeOut: 3000,
            }
          );
        }
      });
  }

  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**use: add new row to grid */
  addNewRow(data: any) {
    this.disableAddBtnGrid = true;
    if (data.SRNO) {
      this.orderedItems = this.orderedItems.filter(
        (item: any) => item.SRNO != data.SRNO
      );
    }
    this.orderedItems.push(data);
    this.orderedItems.map((s: any, i: any) => (s.id = i + 1));
    this.orderedItems.forEach((item: any, i: any) => {
      this.currencySelected = item.CurrCode
      item.VAT_AMT = parseInt(item.TRN_Per)
      item.Id = i + 1;
      item.SRNO = i + 1;
      if (item.TRN_Inv_Date != "")
        item.TRN_Inv_Date = item.TRN_Inv_Date.toISOString();
    });

    this.calculateTotalValues();
  }
  /**use: caluculate the total values for printing */
  private calculateTotalValues(): void {
    if (this.orderedItems.length > 0) {
      this.totalAmount_LC = 0;
      this.VATAmount = 0;
      this.totalAmount_FC = 0;
      this.VATAmount_FC = 0;
      this.TOTAL_AMOUNTFC = 0;
      this.TOTAL_AMOUNTLC = 0;
      this.totalPartyValue = 0;
      this.totalValue = 0;
      this.totalValue_FC = 0;
      this.totalValueInText = "";
      let vatTotal = 0
      let vatTotalFC = 0
      let SchemeBalance = 0
      this.orderedItems.forEach((item: any) => {
        item.SchemeBalance = this.commonService.emptyToZero(item.SchemeBalance)
        item.Amount_FC = this.commonService.emptyToZero(item.Amount_FC)
        item.Amount_LC = this.commonService.emptyToZero(item.Amount_LC)
        item.AMOUNT_VAT = ((parseInt(item.Amount_LC) / (100 + parseInt(item.VAT_AMT))) * 100).toFixed(2)
        item.AMOUNT_VATFC = ((parseInt(item.Amount_FC) / (100 + parseInt(item.VAT_AMT))) * 100).toFixed(2)
        item.VAT_AMT = parseInt(item.Amount_LC) - item.AMOUNT_VAT
        item.VAT_AMTFC = parseInt(item.Amount_FC) - item.AMOUNT_VATFC
        vatTotal += item.VAT_AMT;
        vatTotalFC += item.VAT_AMTFC;
        this.totalAmount_LC += parseInt(item.Amount_LC);
        this.totalAmount_FC += parseInt(item.Amount_FC);
        this.VATAmount += parseInt(item.VAT_AMT);
        this.VATAmount_FC += parseInt(item.VAT_AMT);
        this.TOTAL_AMOUNTFC += parseInt(item.Amount_FC);
        this.TOTAL_AMOUNTLC += parseInt(item.Amount_LC);
      });
      this.receiptDetailsForm.controls.SchemeBalance.setValue(SchemeBalance)
      // this.receiptDetailsForm.controls.TotalTax.setValue(vatTotal.toFixed(2))
      // this.receiptDetailsForm.controls.TotalAmount.setValue(
      //   this.commonService.commaSeperation(this.totalAmount_LC.toFixed(2))
      // )
      this.setFormControlAmount('TotalTax',vatTotal)
      this.setFormControlAmount('TotalTax_FC',vatTotalFC)
      this.setFormControlAmount('TotalAmount',this.totalAmount_LC)
      let PartyAmount = (Number(this.receiptDetailsForm.value.CurrRate) * this.totalAmount_LC).toFixed(2)
      // this.receiptDetailsForm.controls.PartyAmount.setValue(
      //   this.commonService.commaSeperation(PartyAmount))

      this.setFormControlAmount('PartyAmount',PartyAmount)

      this.receiptDetailsForm.controls.PartyAmtCode.setValue(
        this.receiptDetailsForm.value.CurrCode
      )
      this.totalValue = this.totalAmount_LC + this.VATAmount;
      this.totalValue_FC = this.totalAmount_FC + this.VATAmount_FC;
      this.totalPartyValue = this.totalAmount_LC + this.VATAmount;
      this.totalValueInText = this.commonService
        .priceToTextWithCurrency(this.totalValue, "UNITED ARAB EMIRATES DIRHAM")
        ?.toUpperCase();
    }
  }
  setFormControlAmount(controlName: string, amount: any) {
    amount = this.commonService.emptyToZero(amount)
    amount = this.commonService.decimalQuantityFormat(amount, 'AMOUNT')
    this.receiptDetailsForm.controls[controlName].setValue(
      this.commonService.commaSeperation(amount)
    )
  }
  private calculateVAT(VAT: number, AMOUNT: number): number {
    return (AMOUNT / (100 + VAT)) * 100
  }
  /**use: caluculate the total values for printing */
  private calculateTotalonView(): void {
    if (this.orderedItems.length > 0) {
      this.totalAmount_LC = 0;
      this.VATAmount = 0;
      this.totalAmount_FC = 0;
      this.VATAmount_FC = 0;
      this.TOTAL_AMOUNTFC = 0;
      this.TOTAL_AMOUNTLC = 0;
      this.totalPartyValue = 0;
      this.totalValue = 0;
      this.totalValue_FC = 0;
      this.totalValueInText = "";

      this.orderedItems.forEach((item: any) => {
        this.totalAmount_LC += this.commonService.emptyToZero(item.AMOUNTCC);
        this.totalAmount_FC += this.commonService.emptyToZero(item.AMOUNTFC);

        this.VATAmount += this.commonService.emptyToZero(item.VAT_AMOUNTCC);
        this.VATAmount_FC += this.commonService.emptyToZero(item.VAT_AMOUNTFC);

        this.TOTAL_AMOUNTFC += this.commonService.emptyToZero(item.AMOUNTFC);
        this.TOTAL_AMOUNTLC += this.commonService.emptyToZero(item.AMOUNTLC);
      });
      this.totalValue = this.totalAmount_LC + this.VATAmount;
      this.totalValue_FC = this.totalAmount_FC + this.VATAmount_FC;
      this.totalPartyValue = this.totalAmount_LC + this.VATAmount;
      this.totalValueInText = this.commonService
        .priceToTextWithCurrency(this.totalValue, "UNITED ARAB EMIRATES DIRHAM")
        ?.toUpperCase();
    }
  }
  // print button click
  printClicked() {
    //this.validateBeforePrint()
    if (!this.isSaved) {
      this.toastr.error("Receipt Not Saved", "", {
        timeOut: 3000,
      });
      return;
    }
    let _validate: any[] = ["val"];
    if (_validate) {
      const printContent: any = document.getElementById("print_invoice");
      var WindowPrt: any = window.open(
        "",
        "_blank",
        `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
      );
      /* WindowPrt.document.write(
        '<html><title>SunTech</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"><style>.anim-rotate {animation: anim-rotate 1s linear infinite;}@keyframes anim-rotate {100% {transform: rotate(360deg);}}.anim-close-card {animation: anim-close-card 1.4s linear;}@keyframes anim-close-card {100% {opacity: 0.3;transform: scale3d(.3, .3, .3);}}.card {box-shadow: $card-shadow;margin-bottom: 30px;transition: all 0.3s ease-in-out;&:hover {box-shadow: 0 0 25px -5px #9e9c9e;}.card-header {border-bottom: $card-header-border;position: relative;+.card-body {padding-top: 0;}h5 {margin-bottom: 0;color: $theme-heading-color;font-size: 14px;font-weight: 700;display: inline-block;margin-right: 10px;line-height: 1.1;position: relative;}.card-header-right {right: 10px;top: 10px;display: inline-block;float: right;padding: 0;position: absolute;@media only screen and (max-width: 575px) {display: none;}.dropdown-menu {margin-top: 0;li {cursor: pointer;a {font-size: 14px;text-transform: capitalize;}}}.btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;color: #888;i {margin-right: 0;}&:after {display: none;}&:focus {box-shadow: none;outline: none;}}// custom toggler .btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;padding: 0;width: 20px;height: 20px;right: 8px;top: 8px;&.mobile-menu span {background-color: #888;height: 2px;border-radius: 5px;&:after, &:before {border-radius: 5px;height: 2px;background-color: #888;}}}.nav-pills {padding: 0;box-shadow: none;background: transparent;}}}.card-footer {padding: 0px !important;background-color: none !important ;border-top: 0px !important}}.card-block, .card-body {padding: 20px 25px;}&.card-load {position: relative;overflow: hidden;.card-loader {position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;background-color: rgba(256, 256, 256,0.7);z-index: 999;i {margin: 0 auto;color: $primary-color;font-size: 24px;align-items: center;display: flex;}}}&.full-card {z-index: 99999;border-radius: 0;}}h4 {margin-bottom: 5px;}.btn-sm, .btn-group-sm>.btn {font-size: 12px;}.view-group {display: -ms-flexbox;display: flex;-ms-flex-direction: row;flex-direction: row;padding-left: 0;margin-bottom: 0;}.thumbnail {height: 180px;margin-bottom: 30px;padding: 0px;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;}.item.list-group-item {float: none;width: 100%;background-color: #fff;margin-bottom: 30px;-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding: 0 1rem;border: 0;}.item.list-group-item .img-event {float: left;width: 30%;}.item.list-group-item .list-group-image {margin-right: 10px;}.item.list-group-item .thumbnail {margin-bottom: 0px;width: 100%;display: inline-block;}.item.list-group-item .caption {float: left;width: 70%;margin: 0;}.item.list-group-item:before, .item.list-group-item:after {display: table;content: " ";}.item.list-group-item:after {clear: both;}.card-title {margin-bottom: 5px;}h4 {font-size: 18px;}.card .card-block, .card .card-body {padding: 10px;}.caption p {margin-bottom: 5px;}.price {font-weight: 500;font-size: 1.25rem;color: #826d22;}.list-group-item .img-fluid {max-width: 75% !important;height: auto;}.list-group-item .img-event {text-align: center;}@media (min-width: 400px) {.list-group-item .table_comp_w {width: 50%;margin-top: -20%;margin-left: 35%;}}:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-infix {padding: .5em 0 .5em 0 !important;}:host ::ng-deep .mat-form-field-wrapper {padding-bottom: 0.34375em;}.prod_weight td, .prod_weight th {padding: 5px 0px;font-size: 12px;}.prod_weight th {background-color: #ededf1;}.prod_weight td {color: #b3852d;}    table, th, td {border: 1px solid black; border-collapse: collapse;  }    th, td {    padding: 5px;    text-align: left;    }</style><body><div>'
      );*/

      // SunTech - POS
      WindowPrt.document.write(
        "<html><head><title> &nbsp;" +
        // new Date().toISOString() +
        "</title></head><style> table, th, td { border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;text-align: left;}</style><body><div>"
      );
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.write("</div></body></html>");
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
      }, 800);
      //WindowPrt.close();
    } else {
      this.snackBar.open(_validate[1], "OK");
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }
  //destroy API calls
  ngOnDestroy() {
    this.snackBar.dismiss();
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }
  deleteTableData() {
    if (this.orderedItems.length == 0) return
    if (!this.content && this.receiptDetailsForm.value.SchemeID != '') {
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
          this.orderedItems = [];
          this.disableAddBtnGrid = false;
          this.receiptDetailsForm.controls.PartyAmtCode.setValue('')
          this.receiptDetailsForm.controls.PartyAmount.setValue('')
          this.receiptDetailsForm.controls.TotalTax.setValue('')
          this.receiptDetailsForm.controls.TotalAmount.setValue('')
        }
      })
    }
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
