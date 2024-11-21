import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { GoldExchangeDetailsComponent } from './gold-exchange-details/gold-exchange-details.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PosCustomerMasterComponent } from '../common/pos-customer-master/pos-customer-master.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { MatDialog } from '@angular/material/dialog';
import { timeStamp } from 'console';

@Component({
  selector: 'app-gold-exchange',
  templateUrl: './gold-exchange.component.html',
  styleUrls: ['./gold-exchange.component.scss']
})
export class GoldExchangeComponent implements OnInit {

  @Input() content!: any;

  branchCode: string = "";
  yearMonth?: string;
  companyCurrency?: String;
  isCurrencyUpdate: boolean = false;
  private subscriptions: Subscription[] = [];
  baseYear: any = localStorage.getItem('YEAR') || '';
  amlNameValidation?: boolean;
  voucherDetails: any;
  customerData: any;

  LOCKVOUCHERNO: boolean = true;

  columnsList: any[] = [
    { title: 'Sr #', field: 'SRNO' },
    { title: 'Stock Code', field: 'STOCK_CODE' },
    { title: 'Pcs', field: 'PCS' },
    { title: 'Gr.Wt', field: 'GROSSWT', format: { type: 'fixedPoint', precision: 3 } },
    { title: 'Purity', field: 'PURITY', format: { type: 'fixedPoint', precision: 2 } },
    { title: 'Pure Wt', field: 'PUREWT', format: { type: 'fixedPoint', precision: 3 } },
    { title: 'Mkg.RATE', field: 'MKG_RATECC', format: { type: 'fixedPoint', precision: 2 } },
    { title: 'Mkg.Amount', field: 'MKGVALUECC', format: { type: 'fixedPoint', precision: 2 } },
    { title: 'Metal Amt', field: 'METALVALUECC', format: { type: 'fixedPoint', precision: 2 } },
    { title: 'St.Amt', field: 'STONEVALUECC', format: { type: 'fixedPoint', precision: 2 } },
    { title: 'Total', field: 'NETVALUECC', format: { type: 'fixedPoint', precision: 2 } },
  ];


  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode: any = '';
  goldExchangeDetailsData: any[] = [];
  mainVocType: any = '';
  netTotalSum: string = "";

  selectedIndexes: any = [];
  columnhead: any[] = ['Karat', 'Sale Rate', 'Purchase Rate'];
  zeroAmtVal: any;
  viewOnly: boolean = false;
  editOnly: boolean = false;

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true

  }

  itemCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true

  }

  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SALES MAN ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  goldExchangeForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocTypeNo: [''],
    vocDate: [new Date()],
    partyCode: [''],
    partyCodeName: [''],
    partyCurrCode: [''],
    partyCurrCodeDesc: [''],
    customer: [''],
    moblie: [''],
    itemCurr: [''],
    itemCurrCode: [''],
    creditDaysCode: ['0'],
    creditDays: [new Date()],
    salesMan: [''],
    supInvNo: [''],
    supInvDate: [new Date()],
    custName: [''],
    email: ['', [Validators.required, Validators.email]],
    custId: [''],
    narration: [''],
    partyCurrency: [''],
    partyCurrencyCode: [''],
    amount: [''],
    amountDes: [''],
    rndOfAmt: [''],
    rndOfAmtDes: [''],
    rndNetAmt: [''],
    rndNetAmtDes: [''],
    otherAmt: [''],
    otherAmtDes: [''],
    grossAmt: [''],
    grossAmtDes: [''],
    partyCode1: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],

  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public comService: CommonServiceService,
    private suntechApi: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private renderer: Renderer2,

  ) {
    this.strBranchcode = localStorage.getItem('userbranch');
    this.companyCurrency = this.comService.compCurrency;
    this.zeroAmtVal = this.comService.transformDecimalVB(
      this.comService.allbranchMaster?.BAMTDECIMALS,
      0
    );
  }

  amountDecimalFormat: any;

  weightDecimalFormat: any;

  ngOnInit(): void {
    this.amountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
    };
    this.weightDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BMQTYDECIMALS,
    };
    this.initializeFormValues();
    this.setupCreditDaysListeners();

    this.getKaratDetails();
    this.setCompanyCurrencies();

    if (this.content?.FLAG) {
      this.handleFlagConditions();
    } else {
      this.handleNewVoucher();
    }

    this.setVoucherFormValues();
  }

  private initializeFormValues(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.amlNameValidation = this.comService.allbranchMaster.AMLNAMEVALIDATION;
    this.mainVocType = this.comService.getqueryParamMainVocType();
  }

  private setupCreditDaysListeners(): void {
    this.goldExchangeForm.get('creditDaysCode')?.valueChanges.subscribe(days => {
      if (days) {
        const currentDate = new Date();
        const newDate = new Date(currentDate.setDate(currentDate.getDate() + +days));
        this.goldExchangeForm.get('creditDays')?.setValue(newDate);
      }
    });

    this.goldExchangeForm.get('creditDays')?.valueChanges.subscribe(date => {
      if (date) {
        const currentDate = new Date();
        const selectedDate = new Date(date);
        currentDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        const diffTime = selectedDate.getTime() - currentDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        this.goldExchangeForm.get('creditDaysCode')?.setValue(diffDays, { emitEvent: false });
      }
    });
  }

  private handleFlagConditions(): void {
    if (this.content.FLAG == 'EDIT' || this.content.FLAG == 'VIEW') {
      this.LOCKVOUCHERNO = true;
      this.getRetailSalesMaster(this.content);
    }

    if (this.content.FLAG == 'EDIT') {
      this.LOCKVOUCHERNO = true;
      this.voucherDetails = this.comService.getVoctypeMasterByVocTypeMain(this.branchCode, this.goldExchangeForm.value.vocType, this.mainVocType);
    }
  }

  private handleNewVoucher(): void {
    this.generateVocNo();
    this.goldExchangeForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }


  setCompanyCurrencies() {
    this.goldExchangeForm.controls.amount.setValue(this.comService.compCurrency);
    this.goldExchangeForm.controls.rndOfAmt.setValue(this.comService.compCurrency);
    this.goldExchangeForm.controls.rndNetAmt.setValue(this.comService.compCurrency);
    this.goldExchangeForm.controls.otherAmt.setValue(this.comService.compCurrency);
    this.goldExchangeForm.controls.grossAmt.setValue(this.comService.compCurrency);
  }

  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.goldExchangeForm.value.vocTypeNo}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    let Sub: Subscription = this.suntechApi.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2007')
          this.generateVocNo()
          return
        }
      }, err => {
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  setVoucherFormValues() {
    this.goldExchangeForm.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    this.goldExchangeForm.controls.YEARMONTH.setValue(this.comService.yearSelected)
    this.goldExchangeForm.controls.vocdate.setValue(this.currentDate)
    this.goldExchangeForm.controls.vocType.setValue(
      this.comService.getqueryParamVocType()
    )
    this.goldExchangeForm.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setVocTypeMaster()
  }
  minDate: any;
  maxDate: any;

  setVocTypeMaster() {
    let frm = this.goldExchangeForm.value;
    const vocTypeMaster: any = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }


  partyCodeChange(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    let postData = {
      "SPID": "001",
      "parameter": {
        "ACCODE": event.target.value || "",
        "BRANCH_CODE": this.branchCode
      }
    }
    let Sub: Subscription = this.suntechApi.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.status == "Success") { //
          if (result.dynamicData.length > 0) {

            let data = result.dynamicData[0]
            console.log('data', data);

            if (data && data[0].CURRENCY_CODE) {
              if (this.companyCurrency == data[0].CURRENCY_CODE)
                this.isCurrencyUpdate = true;
              else
                this.isCurrencyUpdate = false;

              this.goldExchangeForm.controls.partyCurrCode.setValue(data[0].CURRENCY_CODE);
              this.goldExchangeForm.controls.itemCurr.setValue(data[0].CURRENCY_CODE);

              this.goldExchangeForm.controls.partyCurrency.setValue(data[0].CURRENCY_CODE);

              this.goldExchangeForm.controls.partyCurrCodeDesc.setValue(this.comService.decimalQuantityFormat(
                this.comService.emptyToZero(data[0].CONV_RATE), 'RATE'));


              this.goldExchangeForm.controls.itemCurrCode.setValue(this.comService.decimalQuantityFormat(
                this.comService.emptyToZero(data[0].CONV_RATE), 'RATE'));

              this.partyCurrencyCodeData.WHERECONDITION = `@strBranch='${this.comService.branchCode}',@strPartyCode='${event.target.value}'`;


            }
          }

        } else {
          this.toastr.error('PartyCode not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
  }

  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.strBranchcode}/${this.baseYear}/${this.convertDateToYMD(this.currentDate)}`;
    this.suntechApi.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.goldExchangeForm.controls.vocTypeNo.setValue(resp.newvocno);
        }
      });
  }

  async getFinancialYear() {
    const API = `BaseFinanceYear/GetBaseFinancialYear?VOCDATE=${this.comService.cDateFormat(this.goldExchangeForm.value.vocDate)}`;
    const res = await this.suntechApi.getDynamicAPI(API).toPromise()
    console.log(res);
    if (res.status == "Success") {
      this.yearMonth = res.BaseFinancialyear;
    }
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    let indexes: Number[] = [];
    this.goldExchangeDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  onRowDoubleClicked(e: any) {
    e.cancel = true;
    this.openAddPosARdetails(e.data);
  }

  openAddPosARdetails(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(GoldExchangeDetailsComponent, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
      // keyboard: false,
      // windowClass: 'modal-full-width',
    });

    // Pass the current max SRNO to the child
    const maxSrno = this.goldExchangeDetailsData.length > 0
      ? Math.max(...this.goldExchangeDetailsData.map(item => item.SRNO))
      : 0;
    modalRef.componentInstance.exchangeDetails = { ...data, maxSrno };
    modalRef.componentInstance.queryParams = { isViewOnly: this.viewOnly, isEditOnly: this.editOnly, partyCurrency: this.goldExchangeForm.value.partyCurrCode };

    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from modal:', postData);
        this.handlePostData(postData);
      }
    });
  }


  // openAddPosARdetails(data: any = null) {
  //   const modalRef: NgbModalRef = this.modalService.open(GoldExchangeDetailsComponent, {
  //     size: 'xl',
  //     backdrop: true,
  //     keyboard: false,
  //     windowClass: 'modal-full-width',
  //   });
  //   modalRef.componentInstance.exchangeDetails = { ...data };
  //   modalRef.componentInstance.queryParams = { isViewOnly: this.viewOnly, isEditOnly: this.editOnly, partyCurrency: this.goldExchangeForm.value.partyCurrCode };


  //   modalRef.result.then((postData) => {
  //     if (postData) {
  //       console.log('Data from modal:', postData);
  //       this.handlePostData(postData);
  //     }
  //   });
  // }

  handlePostData(postData: any) {
    // Find the index of the existing item with the same SRNO
    const preItemIndex = this.goldExchangeDetailsData.findIndex((data: any) =>
      data.SRNO.toString() === postData.SRNO.toString()
    );

    if (postData?.isUpdate && preItemIndex !== -1) {
      // Update the existing entry based on SRNO, without changing its SRNO
      this.goldExchangeDetailsData[preItemIndex] = postData;
    } else {
      // If SRNO is 0, or if it's a new entry, assign the correct SRNO
      if (postData.SRNO === 0 || preItemIndex === -1) {
        postData.SRNO = this.goldExchangeDetailsData.length + 1;
      }
      this.goldExchangeDetailsData.push(postData);
    }

    console.log('Updated goldExchangeDetailsData', this.goldExchangeDetailsData);
    this.updateFormValuesAndSRNO();
    this.updateTotalValues();
  }

  updateFormValuesAndSRNO() {
    // This ensures that all items maintain a sequential SRNO
    this.goldExchangeDetailsData.forEach((data, index) => {
      data.SRNO = index + 1;
    });
  }



  removeLineItemsGrid(e: any) {
    console.log(e.data)
    const values: any = []
    values.push(e.data.SRNO);
    let indexes: Number[] = [];
    this.goldExchangeDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;

    this.updateTotalValues();
    this.updateFormValuesAndSRNO();

  }

  getRetailSalesMaster(data: any) {

    if (this.content.FLAG == 'VIEW')
      this.viewOnly = true;
    if (this.content.FLAG == "EDIT") {
      this.editOnly = true
    }

    this.snackBar.open('Loading...');
    let API = `OldGoldPurchase/GetMetalPurchaseHeaderAndDetail/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.YEARMONTH}/${data.VOCNO}`
    this.suntechApi.getDynamicAPI(API).subscribe((res) => {


      if (res.status == 'Success') {
        this.snackBar.dismiss();
        console.log('res', res);
        const data = res.response;

        this.goldExchangeDetailsData = data.metalPurchaseDetails;
        this.updateFormValuesAndSRNO();

        this.customerData = {
          "MOBILE": data.CUSTOMER_MOBILE,
          "CODE": data.POSCUSTOMERCODE,
        }
        this.goldExchangeForm.controls.vocType.setValue(data.VOCTYPE);
        this.goldExchangeForm.controls.vocTypeNo.setValue(data.VOCNO);

        this.goldExchangeForm.controls.partyCode.setValue(data.PARTYCODE);
        this.goldExchangeForm.controls.partyCurrCode.setValue(data.PARTY_CURRENCY);
        this.goldExchangeForm.controls.partyCurrCodeDesc.setValue(data.PARTY_CURR_RATE);

        this.goldExchangeForm.controls.customer.setValue(data.MHCUSTIDNO);
        this.goldExchangeForm.controls.moblie.setValue(data.CUSTOMER_MOBILE);
        this.goldExchangeForm.controls.itemCurr.setValue(data.ITEM_CURRENCY);
        this.goldExchangeForm.controls.itemCurrCode.setValue(data.ITEM_CURR_RATE);

        this.goldExchangeForm.controls.creditDaysCode.setValue(data.CREDITDAY);
        this.goldExchangeForm.controls.salesMan.setValue(data.SALESPERSON_CODE);
        this.goldExchangeForm.controls.email.setValue(data.CUSTOMER_EMAIL);

        this.goldExchangeForm.controls.supInvNo.setValue(data.SUPINVNO);
        this.goldExchangeForm.controls.custName.setValue(data.HTUSERNAME);
        this.goldExchangeForm.controls.narration.setValue(data.REMARKS);
        this.goldExchangeForm.controls.custId.setValue(data.HLOCTYPE_CODE);


        this.goldExchangeForm.controls.amount.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.TOTSTAMP_AMTFC), 'AMOUNT'));
        this.goldExchangeForm.controls.amountDes.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.TOTSTAMP_AMTCC), 'AMOUNT'));
        this.goldExchangeForm.controls.rndOfAmt.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.ITEM_VALUE_FC), 'AMOUNT'));
        this.goldExchangeForm.controls.rndOfAmtDes.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.ITEM_VALUE_CC), 'AMOUNT'));


        this.goldExchangeForm.controls.rndNetAmt.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.NET_VALUE_FC), 'AMOUNT'));
        this.goldExchangeForm.controls.rndNetAmtDes.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.NET_VALUE_CC), 'AMOUNT'));
        this.goldExchangeForm.controls.otherAmt.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.ADDL_VALUE_FC), 'AMOUNT'));
        this.goldExchangeForm.controls.otherAmtDes.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.ADDL_VALUE_CC), 'AMOUNT'));
        this.goldExchangeForm.controls.grossAmt.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.GROSS_VALUE_FC), 'AMOUNT'));
        this.goldExchangeForm.controls.grossAmtDes.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(data.GROSS_VALUE_CC), 'AMOUNT'));

        this.goldExchangeForm.controls.partyCode1.setValue(data.PARTYADDRESS);



      }
    })
  }



  getKaratDetails() {
    this.suntechApi.getDynamicAPI('BranchKaratRate/' + this.strBranchcode).subscribe((result) => {
      if (result.response) {
        this.tableData = result.response.map((item: any) => {
          item.KARAT_RATE = this.comService.decimalQuantityFormat(item.KARAT_RATE, 'AMOUNT');
          item.POPKARAT_RATE = this.comService.decimalQuantityFormat(item.POPKARAT_RATE, 'AMOUNT');
          return item;
        });;
        console.log(this.tableData);
      }
    });
  }

  partyCodeSelected(e: any) {
    console.log(e);
    this.goldExchangeForm.controls.partyCode.setValue(e.ACCODE);
    this.goldExchangeForm.controls.partyCode1.setValue(e.ACCOUNT_HEAD);
    this.partyCodeChange({ target: { value: e.ACCODE } })
  }

  partyCurrencyCodeSelected(e: any) {
    console.log(e);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(e.CURRENCY_CODE);
    this.goldExchangeForm.controls.partyCurrency.setValue(e.CURRENCY_CODE);
  }

  itemCurrencyCodeSelected(e: any) {
    this.goldExchangeForm.controls.itemCurr.setValue(e["Currency"]);
    this.goldExchangeForm.controls.itemCurrCode.setValue(this.comService.decimalQuantityFormat(e["Conv Rate"], 'RATE'));
  }


  salesManCodeSelected(e: any) {
    console.log(e);
    this.goldExchangeForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
  }

  customerCodeSelected(e: any) {

    this.customerData = e;
    this.goldExchangeForm.controls.customer.setValue(e.CODE);
    this.goldExchangeForm.controls.custId.setValue(e.CODE);
    this.goldExchangeForm.controls.custName.setValue(e.NAME);
    this.goldExchangeForm.controls.email.setValue(e.EMAIL);
    this.goldExchangeForm.controls.moblie.setValue(e.MOBILE);
  }

  opengoldposdirectdetail() {
    const modalRef: NgbModalRef = this.modalService.open(GoldExchangeDetailsComponent, {
      size: 'xl',
      backdrop: true,
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    // Calculate the next available SRNO
    const nextSrno = this.goldExchangeDetailsData.length > 0
      ? Math.max(...this.goldExchangeDetailsData.map(item => item.SRNO)) + 1
      : 1;

    modalRef.componentInstance.partyCurrencyParam = {
      partyCurrency: this.goldExchangeForm.value.partyCurrCode,
      nextSrno: nextSrno // Pass the next available SRNO to the child
    };

    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from modal:', postData);
        this.goldExchangeDetailsData.push(postData);
        this.updateFormValuesAndSRNO();
        this.updateTotalValues();
      }
    });
  }

  updateTotalValues() {
    let sumOfnetWt = this.goldExchangeDetailsData.reduce((sum, item) => {
      return sum + parseFloat(item.NETVALUECC);
    }, 0);

    this.goldExchangeForm.controls['rndOfAmtDes'].reset();

    this.netTotalSum = this.comService.decimalQuantityFormat(sumOfnetWt, 'AMOUNT');

    this.goldExchangeForm.controls.partyCurrencyCode.setValue(this.netTotalSum);
    this.goldExchangeForm.controls.amountDes.setValue(this.netTotalSum);
    this.goldExchangeForm.controls.rndNetAmtDes.setValue(this.netTotalSum);
    this.goldExchangeForm.controls.grossAmtDes.setValue(this.netTotalSum);


  }

  changeRoundOffAmount(event: any) {
    let roundOffValue = event.target.value;
    let branchParams: any = localStorage.getItem('BRANCH_PARAMETER');
    const roundOffRange = JSON.parse(branchParams).POSROUNDOFFRANGE;

    const roundOffValueNum = parseFloat(roundOffValue);

    if (isNaN(roundOffValueNum) || this.comService.emptyToZero(roundOffRange) == 0) {

      this.showErrorMessage('There is no Limit Settings in branch master');
      return;
    }

    if (roundOffValueNum < -roundOffRange || roundOffValueNum > roundOffRange) {

      this.showErrorMessage(`Value must be between -${roundOffRange} and ${roundOffRange}.`);
    } else {

      this.roundOffCalculation(roundOffValue);
    }
  }

  showErrorMessage(message: string) {

    this.openDialog('Warning', message, true);




    this.dialogBox.afterClosed().subscribe((data: any) => {
      if (data == 'OK') {

        this.goldExchangeForm.controls['rndOfAmtDes'].reset();
        // this.renderer.selectRootElement('#rndOfAmtDes').focus();

      }

    });
    console.error(message);
  }

  roundOffCalculation(roundOffValue: any) {

    const roundOffSum = this.comService.decimalQuantityFormat((this.comService.emptyToZero(this.netTotalSum) + this.comService.emptyToZero(roundOffValue)), 'AMOUNT');

    this.goldExchangeForm.controls.partyCurrencyCode.setValue(roundOffSum);
    this.goldExchangeForm.controls.rndNetAmtDes.setValue(roundOffSum);
    this.goldExchangeForm.controls.grossAmtDes.setValue(roundOffSum);

  }

  dialogBox: any;

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(
      DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }


  // opengoldposdirectdetail() {
  //   const modalRef: NgbModalRef = this.modalService.open(GoldExchangeDetailsComponent, {
  //     size: 'xl',
  //     backdrop: true,
  //     keyboard: false,
  //     windowClass: 'modal-full-width',
  //   });

  //   modalRef.componentInstance.partyCurrencyParam = { partyCurrency: this.goldExchangeForm.value.partyCurrCode };

  //   modalRef.result.then((postData) => {
  //     if (postData) {
  //       console.log('Data from modal:', postData);
  //       this.goldExchangeDetailsData.push(postData);
  //     }
  //   });
  // }


  close(data?: any) {
    this.activeModal.close(data);
  }

  setFormValues() {
    console.log('this.content', this.content);
    if (!this.content) return
    this.goldExchangeForm.controls.vocType.setValue(this.content.VOCTYPE);
    this.goldExchangeForm.controls.vocTypeNo.setValue(this.content.VOCNO);
    this.goldExchangeForm.controls.vocDate.setValue(this.content.VOCDATE);
    this.goldExchangeForm.controls.partyCode.setValue(this.content.PARTYCODE);
    this.goldExchangeForm.controls.partyCurrCode.setValue(this.content.PARTY_CURRENCY);
    this.goldExchangeForm.controls.partyCurrCodeDesc.setValue(this.content.PARTY_CURR_RATE);
    this.goldExchangeForm.controls.itemCurr.setValue(this.content.ITEM_CURRENCY);
    this.goldExchangeForm.controls.itemCurrCode.setValue(this.content.ITEM_CURR_RATE);
    this.goldExchangeForm.controls.salesMan.setValue(this.content.SALESPERSON_CODE);
    this.goldExchangeForm.controls.partyCurrency.setValue(this.content.PARTY_VALUE_FC);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(this.content.PARTY_VALUE_CC);
    this.goldExchangeForm.controls.partyCurrencyCode.setValue(this.content.PARTY_VALUE_CC);
    this.goldExchangeForm.controls.rndNetAmt.setValue(this.content.NET_VALUE_FC);

    this.goldExchangeForm.controls['rndNetAmt'].setValue(
      this.comService.decimalQuantityFormat(this.zeroAmtVal, 'AMOUNT')

    );
    this.goldExchangeForm.controls.rndNetAmtDes.setValue(this.content.NET_VALUE_CC);
    this.goldExchangeForm.controls.otherAmt.setValue(this.content.ADDL_VALUE_FC);
    this.goldExchangeForm.controls.otherAmtDes.setValue(this.content.ADDL_VALUE_CC);
    this.goldExchangeForm.controls.grossAmt.setValue(this.content.GROSS_VALUE_FC);
    this.goldExchangeForm.controls.grossAmtDes.setValue(this.content.GROSS_VALUE_CC);
    this.goldExchangeForm.controls.narration.setValue(this.content.REMARKS);

    this.goldExchangeForm.controls.supInvNo.setValue(this.content.SUPINVNO);
    this.goldExchangeForm.controls.supInvDate.setValue(this.content.supInvDate);

    this.goldExchangeForm.controls.creditDaysCode.setValue(this.content.CREDITDAY);

    this.goldExchangeForm.controls.customer.setValue(this.content.HLOCTYPE_CODE);
    this.goldExchangeForm.controls.custName.setValue(this.content.HTUSERNAME);

    this.goldExchangeForm.controls.custId.setValue(this.content.MHCUSTIDNO);

    this.goldExchangeForm.controls.moblie.setValue(this.content.CUSTOMER_MOBILE);
    this.goldExchangeForm.controls.email.setValue(this.content.CUSTOMER_EMAIL);
    this.goldExchangeForm.controls.amount.setValue(this.content.TOTSTAMP_AMTFC);
    this.goldExchangeForm.controls.amountDes.setValue(this.content.TOTSTAMP_AMTCC);
    this.goldExchangeForm.controls.rndOfAmt.setValue(this.content.VATAMOUNTFCROUND);
    this.goldExchangeForm.controls.rndOfAmtDes.setValue(this.content.VATAMOUNTFCROUNDCC);

  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return
    }
    if (this.goldExchangeForm.invalid) {
      this.toastr.error('select all required fields');
      return
    }

    const saveApi = 'OldGoldPurchase/InsertMetalPurchase';
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.goldExchangeForm.value.vocType,
      "VOCNO": this.goldExchangeForm.value.vocTypeNo,
      "VOCDATE": this.goldExchangeForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.goldExchangeForm.value.partyCode,
      "PARTY_CURRENCY": this.goldExchangeForm.value.partyCurrCode,
      "PARTY_CURR_RATE": this.goldExchangeForm.value.partyCurrCodeDesc,
      "ITEM_CURRENCY": this.goldExchangeForm.value.itemCurr,
      "ITEM_CURR_RATE": this.goldExchangeForm.value.itemCurrCode,
      "VALUE_DATE": "2024-02-08T12:18:43.101Z",
      "SALESPERSON_CODE": this.goldExchangeForm.value.salesMan,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "FIXED": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "ITEM_VALUE_FC": this.goldExchangeForm.value.rndOfAmtDes ?? "0.00",
      "ITEM_VALUE_CC": this.goldExchangeForm.value.rndOfAmtDes ?? "0.00",
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": this.goldExchangeForm.value.rndNetAmtDes ?? "0.00",
      "NET_VALUE_CC": this.goldExchangeForm.value.rndNetAmtDes ?? "0.00",
      "ADDL_VALUE_FC": this.goldExchangeForm.value.otherAmtDes === "" ? "0.00" : (this.goldExchangeForm.value.otherAmtDes ?? "0.00"),
      "ADDL_VALUE_CC": this.goldExchangeForm.value.otherAmtDes === "" ? "0.00" : (this.goldExchangeForm.value.otherAmtDes ?? "0.00"),

      "GROSS_VALUE_FC": this.goldExchangeForm.value.grossAmtDes ?? "0.00",
      "GROSS_VALUE_CC": this.goldExchangeForm.value.grossAmtDes ?? "0.00",
      "REMARKS": this.goldExchangeForm.value.narration,
      "SYSTEM_DATE": "2024-02-08T12:18:43.101Z",
      "FLAG_EDIT_ALLOW": "",
      "TOTAL_OZWT": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": this.goldExchangeForm.value.supInvNo,
      "supInvDate": this.goldExchangeForm.value.supInvDate,
      "FLAG_UPDATED": "",
      "FLAG_INPROCESS": "",
      "HHACCOUNT_HEAD": "",
      "PURCHASEFIXINGAMTLC": 0,
      "PURCHASEFIXINGAMTFC": 0,
      "PURCHASEFIXINGMID": 0,
      "PURCHASEFIXINGREF": "",
      "PURCHASEFIXINGPUREWT": 0,
      "PURCHASEFIXINGRATE": "",
      "D2DTRANSFER": "s",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "CURRRECMID": 0,
      "CURRRECVOCTYPE": "",
      "CURRRECREF": "",
      "CURRRECAMOUNTFC": 0,
      "CURRRECAMOUNTCC": 0,
      "TOTAL_DISCOUNTWT": 0,
      "CUSTOMER_NAME": "",
      "MACHINEID": "",
      "SALESPERSON_NAME": "",
      "TOTAL_WASTQTY": 0,
      "TOTAL_AMT_FC": 0,
      "PARTYADDRESS": this.goldExchangeForm.value.partyCode1,
      "CREDITDAY": parseInt(this.goldExchangeForm.value.creditDaysCode),
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "PURITYQUALITYCHECK": true,
      "TESTINGPARTY": "",
      "TESTINGPARTYWT": 0,
      "TESTINGPARTYREMARKS": "",
      "TESTINGPARTYWTRECEIVED": 0,
      "DOC_DISCMTLRATE": 0,
      "REP_REF": "",
      "REPAIR_REF": "",
      "HLOCTYPE_CODE":"",
      "HTUSERNAME": this.goldExchangeForm.value.custName,
      "MHIDCATEGORY": "",
      "MHCUSTIDNO": this.goldExchangeForm.value.custId,
      "GENSEQNO": 0,
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "INCLUSIVE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "FIXED_QTY": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "st",
      "GST_NUMBER": "",
      "GST_TYPE": "",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "CUSTOMER_MOBILE": this.goldExchangeForm.value.moblie,
      "CUSTOMER_EMAIL": this.goldExchangeForm.value.email,
      "POSCUSTIDNO": "",
      "POPCUSTCODE": "",
      "GST_GROUP": "s",
      "FIXING_PROCESS": true,
      "TOTAL_ADDL_TAXFC": 0,
      "TOTAL_ADDL_TAXCC": 0,
      "DIRECTFIXINGREF": "",
      "INTERNALUNFIX": true,
      "REF_JOBCREATED": true,
      "EXCLUDEVAT": true,
      "TEST_BRANCH_CODE": "",
      "TEST_VOCTYPE": "",
      "TEST_VOCNO": 0,
      "TEST_YEARMONTH": "",
      "TDS_CODE": "",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "H_DECLARATIONNO": "",
      "H_ORIGINCOUNTRY": "",
      "H_DECLARATIONDATE": "2024-02-08T12:18:43.101Z",
      "H_PACKETNO": 0,
      "SHIPPER_CODE": "",
      "SHIPPER_NAME": "",
      "ORIGIN_COUNTRY": "",
      "DESTINATION_STATE": "",
      "DESTINATION_COUNTRY": "",
      "MINING_COMP_CODE": "",
      "MINING_COMP_NAME": "",
      "AIRWAY_BILLNO": "",
      "AIRWAY_BILLDATE": "2024-02-08T12:18:43.101Z",
      "AIRWAY_WEIGHT": 0,
      "ARIVAL_DATE": "2024-02-08T12:18:43.101Z",
      "CLEARENCE_DATE": "2024-02-08T12:18:43.101Z",
      "BOE_FILLINGDATE": "2024-02-08T12:18:43.101Z",
      "BOE_NO": "",
      "PO_IMP": 0,
      "SILVER_RATE_TYPE": "",
      "SILVER_RATE": 0,
      "TOTAL_SILVERWT": 0,
      "TOTAL_SILVERVALUE_FC": 0,
      "TOTAL_SILVERVALUE_CC": 0,
      "PO_REFNO": "",
      "MINING_COMP_REFNO": "",
      "PARTY_ROUNDOFF": 0,
      "TRANSPORTER_CODE": "",
      "VEHICLE_NO": "",
      "LR_NO": "",
      "AIR_BILL_NO": "",
      "SHIPCODE": "",
      "SHIPDESC": "",
      "STAMPCHARGE": true,
      "TOTSTAMP_AMTFC": this.goldExchangeForm.value.amountDes ?? "0.00",
      "TOTSTAMP_AMTCC": this.goldExchangeForm.value.amountDes ?? "0.00",
      "TOTSTAMP_PARTYAMTFC": 0,
      "REFPURIMPORT": "",
      "BOE_EXPIRY_DATE": "2024-02-08T12:18:43.101Z",
      "H_BILLOFENTRYREF": "",
      "SUB_LED_ACCODE": "",
      "ACTIVITY_CODE": "",
      "TCS_ACCODE": "",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "DISCOUNTPERCENTAGE": 0,
      "CUSTOMER_ADDRESS": "",
      "FROM_TOUCH": true,
      "CUSTOMER_CODE": "",
      "IMPORTINPURCHASE": true,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "CNT_ORIGIN": "",
      "OT_TRANSFER_TIME": "",
      "FREIGHT_RATE": 0,
      "TDS_PER": 0,
      "TDS_TOPARTY": true,
      "LONDONFIXING_TYPE": 0,
      "LONDONFIXING_RATE": 0,
      "PARTYROUNDOFF": 0,
      "NOTIONAL_PARTY": true,
      "METAL_CONV_CURR": "",
      "METAL_CONV_RATE": 0,
      "CHECK_HEDGINGBAL": true,
      "IMPORTINSALES": true,
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "AUTOGENREF": "",
      "VATAMOUNTMakingONLYCC": 0,
      "CALCULATEPARTYVATONMAKINGONLY": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_WASTAGE_AMOUNTCC": 0,
      "PARTYTRANSWISE_DESIGNATEDZONE": true,
      "PARTY_STATE_CODE": "",
      "SHIP_ACCODE": "",
      "SHIP_STATE_CODE": "",
      "DISPATCH_NAME": "",
      "DISPATCH_ADDRESS": "",
      "DISPATCH_STATE_CODE": "",
      "TRANSPORTER_ID": "",
      "TRANSPORTER_MODE": "",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-02-08T12:18:43.101Z",
      "VEHICLE_TYPE": "",
      "DISPATCH_CITY": "",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "",
      "CREDIT_DAYSMTL": 0,
      "VALUE_DATEMTL": "2024-02-08T12:18:43.101Z",
      "PURITYQUALITYREMARKS": "",
      "DISCOUNT_PERGRM": 0,
      "EXCLUDE_VAT": true,
      "H_AIRWAYBILL": "",
      "H_BASIS": "",
      "H_DESTINATION": "",
      "H_MINER": "",
      "H_SHIPMENTMODE": "",
      "H_SHIPPER": "",
      "HTOTALAMOUNTWITHVAT_CC": 0,
      "HTOTALAMOUNTWITHVAT_FC": 0,
      "HVAT_AMOUNT_CC": 0,
      "HVAT_AMOUNT_FC": 0,
      "INTERNALFIXEDQTY": 0,
      "ITEMROUNDVALUEFC": 0,
      "NEWMID": 0,
      "PARTYROUNDVALUEFC": 0,
      "PARTYTRANSWISE_METALVATONMAKING": true,
      "PLACEOFSUPPLY": "",
      "POSPRICESFIXED": true,
      "QRCODEIMAGE": "",
      "QRCODEVALUE": "",
      "SHIPMENTCOMPANY": "",
      "SHIPMENTPORT": "",
      "TAX_APPLICABLE": true,
      "TOTAL_WASTAGE_AMOUNTFC": 0,
      "TRANSFER_BRANCH": "",
      "VATAMOUNTFCROUND": this.goldExchangeForm.value.rndOfAmtDes ?? "0.00",
      "VATAMOUNTFCROUNDCC": this.goldExchangeForm.value.rndOfAmtDes ?? "0.00",
      "metalPurchaseDetails": this.goldExchangeDetailsData,
    }

    let Sub: Subscription = this.suntechApi.postDynamicAPI(saveApi, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.goldExchangeForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.goldExchangeForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    const updateApi = 'OldGoldPurchase/UpdateMetalPurchase/' + this.branchCode + '/' + this.content.VOCTYPE + '/' + this.goldExchangeForm.value.vocTypeNo + '/' + this.yearMonth

    let updateData = {
      "MID": this.content.MID,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.goldExchangeForm.value.vocType,
      "VOCNO": this.goldExchangeForm.value.vocTypeNo,
      "VOCDATE": this.goldExchangeForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "PARTYCODE": this.goldExchangeForm.value.partyCode,
      "PARTY_CURRENCY": this.goldExchangeForm.value.partyCurrCode,
      "PARTY_CURR_RATE": this.goldExchangeForm.value.partyCurrCodeDesc,
      "ITEM_CURRENCY": this.goldExchangeForm.value.itemCurr,
      "ITEM_CURR_RATE": this.goldExchangeForm.value.itemCurrCode,
      "VALUE_DATE": "2024-02-08T12:18:43.101Z",
      "SALESPERSON_CODE": this.goldExchangeForm.value.salesMan,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "FIXED": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "ITEM_VALUE_FC": this.goldExchangeForm.value.rndOfAmtDes ?? "0.00",
      "ITEM_VALUE_CC": this.goldExchangeForm.value.rndOfAmtDes?? "0.00",
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": this.goldExchangeForm.value.rndNetAmtDes ?? "0.00",
      "NET_VALUE_CC": this.goldExchangeForm.value.rndNetAmtDes,
      "ADDL_VALUE_FC": this.goldExchangeForm.value.otherAmtDes === "" ? "0.00" : (this.goldExchangeForm.value.otherAmtDes ?? "0.00"),
      "ADDL_VALUE_CC": this.goldExchangeForm.value.otherAmtDes === "" ? "0.00" : (this.goldExchangeForm.value.otherAmtDes ?? "0.00"),

      "GROSS_VALUE_FC": this.goldExchangeForm.value.grossAmt ?? "0.00",
      "GROSS_VALUE_CC": this.goldExchangeForm.value.grossAmtDes,
      "REMARKS": this.goldExchangeForm.value.narration,
      "SYSTEM_DATE": "2024-02-08T12:18:43.101Z",
      "FLAG_EDIT_ALLOW": "",
      "TOTAL_OZWT": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": this.goldExchangeForm.value.supInvNo,
      "supInvDate": this.goldExchangeForm.value.supInvDate,
      "FLAG_UPDATED": "",
      "FLAG_INPROCESS": "",
      "HHACCOUNT_HEAD": "",
      "PURCHASEFIXINGAMTLC": 0,
      "PURCHASEFIXINGAMTFC": 0,
      "PURCHASEFIXINGMID": 0,
      "PURCHASEFIXINGREF": "",
      "PURCHASEFIXINGPUREWT": 0,
      "PURCHASEFIXINGRATE": "",
      "D2DTRANSFER": "s",
      "OUSTATUS": true,
      "OUSTATUSNEW": 0,
      "CURRRECMID": 0,
      "CURRRECVOCTYPE": "",
      "CURRRECREF": "",
      "CURRRECAMOUNTFC": 0,
      "CURRRECAMOUNTCC": 0,
      "TOTAL_DISCOUNTWT": 0,
      "CUSTOMER_NAME": "",
      "MACHINEID": "",
      "SALESPERSON_NAME": "",
      "TOTAL_WASTQTY": 0,
      "TOTAL_AMT_FC": 0,
      "PARTYADDRESS": this.goldExchangeForm.value.partyCode1,
      "CREDITDAY": this.goldExchangeForm.value.creditDaysCode,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "AUTHORIZEDPOSTING": true,
      "CANCELLEDPOSTING": true,
      "PURITYQUALITYCHECK": true,
      "TESTINGPARTY": "",
      "TESTINGPARTYWT": 0,
      "TESTINGPARTYREMARKS": "",
      "TESTINGPARTYWTRECEIVED": 0,
      "DOC_DISCMTLRATE": 0,
      "REP_REF": "",
      "REPAIR_REF": "",
      "HLOCTYPE_CODE":"",
      "HTUSERNAME": this.goldExchangeForm.value.custName,
      "MHIDCATEGORY": "",
      "MHCUSTIDNO": this.goldExchangeForm.value.custId,
      "GENSEQNO": 0,
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "INCLUSIVE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "FIXED_QTY": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": "st",
      "GST_NUMBER": "",
      "GST_TYPE": "",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "CUSTOMER_MOBILE": this.goldExchangeForm.value.moblie,
      "CUSTOMER_EMAIL": this.goldExchangeForm.value.email,
      "POSCUSTIDNO": "",
      "POPCUSTCODE": "",
      "GST_GROUP": "s",
      "FIXING_PROCESS": true,
      "TOTAL_ADDL_TAXFC": 0,
      "TOTAL_ADDL_TAXCC": 0,
      "DIRECTFIXINGREF": "",
      "INTERNALUNFIX": true,
      "REF_JOBCREATED": true,
      "EXCLUDEVAT": true,
      "TEST_BRANCH_CODE": "",
      "TEST_VOCTYPE": "",
      "TEST_VOCNO": 0,
      "TEST_YEARMONTH": "",
      "TDS_CODE": "",
      "TDS_APPLICABLE": true,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "H_DECLARATIONNO": "",
      "H_ORIGINCOUNTRY": "",
      "H_DECLARATIONDATE": "2024-02-08T12:18:43.101Z",
      "H_PACKETNO": 0,
      "SHIPPER_CODE": "",
      "SHIPPER_NAME": "",
      "ORIGIN_COUNTRY": "",
      "DESTINATION_STATE": "",
      "DESTINATION_COUNTRY": "",
      "MINING_COMP_CODE": "",
      "MINING_COMP_NAME": "",
      "AIRWAY_BILLNO": "",
      "AIRWAY_BILLDATE": "2024-02-08T12:18:43.101Z",
      "AIRWAY_WEIGHT": 0,
      "ARIVAL_DATE": "2024-02-08T12:18:43.101Z",
      "CLEARENCE_DATE": "2024-02-08T12:18:43.101Z",
      "BOE_FILLINGDATE": "2024-02-08T12:18:43.101Z",
      "BOE_NO": "",
      "PO_IMP": 0,
      "SILVER_RATE_TYPE": "",
      "SILVER_RATE": 0,
      "TOTAL_SILVERWT": 0,
      "TOTAL_SILVERVALUE_FC": 0,
      "TOTAL_SILVERVALUE_CC": 0,
      "PO_REFNO": "",
      "MINING_COMP_REFNO": "",
      "PARTY_ROUNDOFF": 0,
      "TRANSPORTER_CODE": "",
      "VEHICLE_NO": "",
      "LR_NO": "",
      "AIR_BILL_NO": "",
      "SHIPCODE": "",
      "SHIPDESC": "",
      "STAMPCHARGE": true,
      "TOTSTAMP_AMTFC": this.goldExchangeForm.value.amount ?? "0.00",
      "TOTSTAMP_AMTCC": this.goldExchangeForm.value.amountDes,
      "TOTSTAMP_PARTYAMTFC": 0,
      "REFPURIMPORT": "",
      "BOE_EXPIRY_DATE": "2024-02-08T12:18:43.101Z",
      "H_BILLOFENTRYREF": "",
      "SUB_LED_ACCODE": "",
      "ACTIVITY_CODE": "",
      "TCS_ACCODE": "",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "DISCOUNTPERCENTAGE": 0,
      "CUSTOMER_ADDRESS": "",
      "FROM_TOUCH": true,
      "CUSTOMER_CODE": "",
      "IMPORTINPURCHASE": true,
      "SL_CODE": "",
      "SL_DESCRIPTION": "",
      "CNT_ORIGIN": "",
      "OT_TRANSFER_TIME": "",
      "FREIGHT_RATE": 0,
      "TDS_PER": 0,
      "TDS_TOPARTY": true,
      "LONDONFIXING_TYPE": 0,
      "LONDONFIXING_RATE": 0,
      "PARTYROUNDOFF": 0,
      "NOTIONAL_PARTY": true,
      "METAL_CONV_CURR": "",
      "METAL_CONV_RATE": 0,
      "CHECK_HEDGINGBAL": true,
      "IMPORTINSALES": true,
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "AUTOGENREF": "",
      "VATAMOUNTMakingONLYCC": 0,
      "CALCULATEPARTYVATONMAKINGONLY": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "IMPEXPDOC_TYPE": 0,
      "TOTAL_WASTAGE_AMOUNTCC": 0,
      "PARTYTRANSWISE_DESIGNATEDZONE": true,
      "PARTY_STATE_CODE": "",
      "SHIP_ACCODE": "",
      "SHIP_STATE_CODE": "",
      "DISPATCH_NAME": "",
      "DISPATCH_ADDRESS": "",
      "DISPATCH_STATE_CODE": "",
      "TRANSPORTER_ID": "",
      "TRANSPORTER_MODE": "",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-02-08T12:18:43.101Z",
      "VEHICLE_TYPE": "",
      "DISPATCH_CITY": "",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "",
      "CREDIT_DAYSMTL": 0,
      "VALUE_DATEMTL": "2024-02-08T12:18:43.101Z",
      "PURITYQUALITYREMARKS": "",
      "DISCOUNT_PERGRM": 0,
      "EXCLUDE_VAT": true,
      "H_AIRWAYBILL": "",
      "H_BASIS": "",
      "H_DESTINATION": "",
      "H_MINER": "",
      "H_SHIPMENTMODE": "",
      "H_SHIPPER": "",
      "HTOTALAMOUNTWITHVAT_CC": 0,
      "HTOTALAMOUNTWITHVAT_FC": 0,
      "HVAT_AMOUNT_CC": 0,
      "HVAT_AMOUNT_FC": 0,
      "INTERNALFIXEDQTY": 0,
      "ITEMROUNDVALUEFC": 0,
      "NEWMID": 0,
      "PARTYROUNDVALUEFC": 0,
      "PARTYTRANSWISE_METALVATONMAKING": true,
      "PLACEOFSUPPLY": "",
      "POSPRICESFIXED": true,
      "QRCODEIMAGE": "",
      "QRCODEVALUE": "",
      "SHIPMENTCOMPANY": "",
      "SHIPMENTPORT": "",
      "TAX_APPLICABLE": true,
      "TOTAL_WASTAGE_AMOUNTFC": 0,
      "TRANSFER_BRANCH": "",
      "VATAMOUNTFCROUND": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndOfAmt, 'AMOUNT') ?? "0.00",
      "VATAMOUNTFCROUNDCC": this.comService.decimalQuantityFormat(this.goldExchangeForm.value.rndOfAmtDes, 'AMOUNT'),
      "metalPurchaseDetails": this.goldExchangeDetailsData,
    }

    let Sub: Subscription = this.suntechApi.putDynamicAPI(updateApi, updateData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.goldExchangeForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)

  }


  openCustMaster() {
    const modalRef: NgbModalRef = this.modalService.open(PosCustomerMasterComponent, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: true,
      // size: 'lg',
      // backdrop: true,
      // keyboard: false,
      // windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.customerData = this.customerData;
    modalRef.componentInstance.amlNameValidation = this.amlNameValidation;
    modalRef.componentInstance.vocDetails = {
      VOCTYPE: this.comService.getqueryParamVocType(),
      VOCDATE: this.goldExchangeForm.value.vocDate,
      VOCNO: this.goldExchangeForm.value.vocTypeNo,
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


}

// export function customEmailValidator(): ValidatorFn {
//   return (control: AbstractControl): ValidationErrors | null => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|net|org|gov|edu|mil)$/;
//     const valid = emailRegex.test(control.value);
//     return valid ? null : { invalidEmail: true };
//   };
// }