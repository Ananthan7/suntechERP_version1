import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterFindIconComponent } from 'src/app/shared/common/master-find-icon/master-find-icon.component';
import Swal from 'sweetalert2';
import * as convert from 'xml-js';

@Component({
  selector: 'app-scheme-receipt',
  templateUrl: './scheme-receipt.component.html',
  styleUrls: ['./scheme-receipt.component.scss']
})
export class SchemeReceiptComponent implements OnInit {
  @ViewChild(MasterFindIconComponent, { static: false }) MasterFindIcon!: MasterFindIconComponent;
  @ViewChild('content') contentTemplate: any;
  @ViewChild('inputElement') inputElement!: ElementRef;
  schemeReceiptList: any[] = [];
  schemeReceiptListHead: any[] = [];
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  branchArray: any[] = [];
  newReceiptData: any = {};
  currentDate: any = new Date();
  dataToEditrow: any[] = [];

  // filteredOptions!: Observable<any[]>;
  salesmanArray: any[] = [];
  rightSideHeader: string = '';
  isViewSchemeMasterGrid: boolean = true;
  disableDelete: boolean = true;
  isSaved: boolean = false;
  editFlag: boolean = false;
  isViewAddbtn: boolean = true;
  postedDateString: string = '';

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
  totalValueInText: string = '';
  CustomerNameSearch: string = '';
  CustomerCodeSearch: string = '';
  VocNumberMain: string = ''
  schemeIdEdit: string = '';
  branchName: any = localStorage.getItem('BRANCH_PARAMETER');

  partyCodeMasterData: any = {
    TABLE_NAME: 'ACCOUNT_MASTER',
    FILTER_FEILD_NAMES: {
    },
    API_FILTER_VALUE: 'ACCODE',
    DB_FIELD_VALUE: 'ACCODE',
    NAME_FIELD_VALUE: 'NAME_1',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerMasterData: any = {
    TABLE_NAME: 'POS_CUSTOMER_MASTER',
    FILTER_FEILD_NAMES: {
    },
    API_FILTER_VALUE: 'NAME',
    DB_FIELD_VALUE: 'NAME',
    NAME_FIELD_VALUE: 'CODE',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SchemeMasterFindData: any = {
    API_VALUE: '',
    API_FILTER_VALUE: 'SCHEME_CODE',
    DB_FIELD_VALUE: 'SCHEME_CODE',
    NAME_FIELD_VALUE: 'SCHEME_NAME',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: false,
    VIEW_TABLE: true,
  }
  salesPersonMasterData: any = {
    TABLE_NAME: 'SALESPERSON_MASTER',
    FILTER_FEILD_NAMES: {
    },
    API_FILTER_VALUE: 'SALESPERSON_CODE',
    DB_FIELD_VALUE: 'SALESPERSON_CODE',
    NAME_FIELD_VALUE: 'DESCRIPTION',
    USER_TYPED_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  // dateRegPattern = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  receiptDetailsForm: FormGroup = this.formBuilder.group({
    Branch: ['', [Validators.required]],
    Salesman: ['', [Validators.required]],
    SalesmanName: [''],
    PartyCode: ['', [Validators.required]],
    VocType: ['PCR'],
    VocDate: [''],
    VocNo: [''],
    CurrCode: ['', [Validators.required]],
    CurrRate: ['', [Validators.required]],
    RefNo: [''],
    RefDate: [''],
    PostedDate: [''],
    SchemeID: ['', [Validators.required]],
    SchemeUniqueID: [''],
    SchemeUnits: [''],
    POSCustomerDate: [''],
    POSCustomerCode: ['', [Validators.required]],
    POSCustomerName: ['', [Validators.required]],
    POSCustomerMobile: [''],
    Narration: [''],
    MID: [''],
  })
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
    let branch = localStorage.getItem('userbranch');
    this.branchName = this.branchName?.BRANCH_NAME;
    if (branch) {
      this.receiptDetailsForm.controls.Branch.setValue(branch)
    };
    this.receiptDetailsForm.controls.VocType.setValue('PCR')
    this.receiptDetailsForm.controls.VocDate.setValue(this.currentDate)
    this.receiptDetailsForm.controls.PostedDate.setValue(this.currentDate)
    this.receiptDetailsForm.controls.RefDate.setValue(this.currentDate)
    if (this.receiptDetailsForm.value.PostedDate) {
      this.postedDateString = this.commonService.formatDate(this.receiptDetailsForm.value.PostedDate)
    }
    this.getCommonLookUps(); //main data grid API
    this.deleteRow = this.deleteRow.bind(this);
    this.editMainRowDetails = this.editMainRowDetails.bind(this);
    this.editRowDetails = this.editRowDetails.bind(this);
  }

  ngOnInit(): void {
    this.fetchPartyCode();
    this.getSalesmanList();

    if (this.inputElement) {
      this.renderer.selectRootElement(this.inputElement.nativeElement).focus();
    }
  }

  editRowDetails(event: any) {
    let data = event.row.data;
    this.openMadalView(data)
  }
  editMainRowDetails(event: any) {
    this.editFlag = true;
    this.isSaved = true;
    this.isViewSchemeMasterGrid = false;
    let data = event.row.data;
    if(data){
      this.isViewAddbtn = false;
      if(data.MID){
        this.getDetailsForEdit(data.MID)
        this.editDataMID = data.MID
      }
      this.receiptDetailsForm.controls.POSCustomerName.setValue(data.CUSTOMER_NAME)
      this.receiptDetailsForm.controls.POSCustomerCode.setValue(data.POSCustomerCode)
      this.receiptDetailsForm.controls.POSCustomerMobile.setValue(data.CUSTOMER_MOBILE)
      this.receiptDetailsForm.controls.Salesman.setValue(data.SALESPERSON_CODE)
      this.receiptDetailsForm.controls.SalesmanName.setValue(data.SALESPERSON_CODE)
      this.receiptDetailsForm.controls.VocNo.setValue(data.VOCNO)
      this.receiptDetailsForm.controls.VocType.setValue(data.VOCTYPE)
      this.receiptDetailsForm.controls.PartyCode.setValue(data.PARTYCODE)
      this.receiptDetailsForm.controls.CurrCode.setValue(data.PARTY_CURRENCY)
      this.receiptDetailsForm.controls.CurrRate.setValue(data.PARTY_CURR_RATE)
      this.receiptDetailsForm.controls.Narration.setValue(data.REMARKS)
      this.schemeIdEdit = data.POSSCHEMEID
  
      this.receiptDetailsForm.controls.PostedDate.setValue(data.POSTDATE)
      this.receiptDetailsForm.controls.VocDate.setValue(data.VOCDATE)
      this.receiptDetailsForm.controls.MID.setValue(data.MID)
      this.receiptDetailsForm.controls.Branch.setValue(data.BRANCH_CODE)
    }else{
      this.isViewAddbtn = true;
    }
    
  }

  getDetailsForEdit(MID: any) {
    let API: string = `Scheme/CurrencyReceipt?MID=${MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((resp: any) => {
        if (resp.response) {
          if (resp.response) {
            let result = resp.response  
            this.receiptDetailsForm.controls.SchemeID.setValue(result.POSSCHEMEID)
            this.orderedItems = result.Details
            this.orderedItems.forEach((item: any, i: any) => {
              item.SRNO = i + 1;
            });
          }
          this.orderedItemsHead = Object.keys(this.orderedItems[0]);
          this.calculateTotalonView()

          // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
          // this.ChangeDetector.detectChanges()
        } else {
          this.toastr.error('No Response Found', resp.Message ? resp.Message : '', {
            timeOut: 2000,
          })
        }
      }, err => {
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      });
    this.subscriptions.push(Sub)
  }
  //date validation
  dateChange(event: any, flag?: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.VocDate.setValue(new Date(date))
    }
  }
  datePostedChange(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.PostedDate.setValue(new Date(date))
    }
  }
  dateRefChange(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.receiptDetailsForm.controls.RefDate.setValue(new Date(date))
    }
  }

  /** Add new Receipt */
  addPOSreceipt() {
    this.snackBar.dismiss()
    let branch = localStorage.getItem('userbranch')
    if (branch) {
      this.receiptDetailsForm.controls.Branch.setValue(branch)
    }
    this.receiptDetailsForm.controls.VocDate.setValue(this.currentDate)
    this.receiptDetailsForm.controls.PostedDate.setValue(this.currentDate)
    this.receiptDetailsForm.controls.RefDate.setValue(this.currentDate)
    this.fetchPartyCode();
    this.getSalesmanList();
    this.editFlag = false;
    this.isViewSchemeMasterGrid = false;
  }
  //USE: delete row
  deleteRow(e: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let str = e.row.data;
        if (this.orderedItems) {
          let item = this.orderedItems.filter((item: any) => item.Id != str.Id)
          this.orderedItems = item
          this.orderedItems.forEach((item: any, i: any) => {
            item.SRNO = i + 1;
          });
          // this.ChangeDetector.detectChanges()
        }
      }
    })
  }

  selectedSalesman(data: any) {
    this.receiptDetailsForm.controls.Salesman.setValue(data.SALESPERSON_CODE)
    this.receiptDetailsForm.controls.SalesmanName.setValue(data.DESCRIPTION)
  }
  salesmanChange(event: any) {
    if (event.target.value == '') return
    let inputValue = event.target.value
    inputValue = inputValue.toUpperCase()
    let data = this.salesmanArray.filter((item: any) => item.SALESPERSON_CODE == inputValue)
    if (data.length > 0) {
      this.receiptDetailsForm.controls.Salesman.setValue(data[0].SALESPERSON_CODE)
    } else {
      this.toastr.error('Invalid Salesperson Code, try search!');
      this.receiptDetailsForm.controls.Salesman.setValue('')
    }
  }
  /** PAGINATION */
  totalItems: number = 10000; // Total number of items
  pageSize: number = 10; // Number of items per page
  pageIndex: number = 1; // Current page index
  previousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex = this.pageIndex - 1;
      if (this.schemeReceiptList.length > 10) {
        this.schemeReceiptList.splice(this.schemeReceiptList.length - this.pageSize, this.pageSize);
      }
    }
  }
  nextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.totalItems) {
      this.pageIndex = this.pageIndex + 1;
      this.getCommonLookUps(this.pageIndex);
    }
  }
  exportToExcel(){
    this.commonService.exportExcel(this.schemeReceiptList,'Receipt Details')
  }
  /**Pagination API */
  getCommonLookUps(pageIndex?: number, VOCNO?: any, CODE?: any) {
    let data = {
      FILTER: {
        YEARMONTH: this.commonService.yearSelected,
        BRANCH_CODE: this.commonService.branchCode,
        VOCTYPE: "PCR",
        VOCNO: VOCNO || '',
        CODE: CODE || ''
      },
      TRANSACTION: {
        VOCTYPE: "PCR",
        MAINVOCTYPE: ""
      }
    }
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    let xmlData = convert.js2xml({ root: data }, options);

    let param = {
      "PAGENO": pageIndex || 1,
      "RECORDS": this.pageSize || 10,
      "TABLE_NAME": "CURRENCY_RECEIPT",
      "CUSTOM_PARAM": xmlData || ''
    }
    this.snackBar.open('Loading ...');
    let API = `Scheme/CommonLookUps`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((resp: any) => {
        this.snackBar.dismiss()
        if (resp.dynamicData) {
          if (this.schemeReceiptList.length > 0 && this.pageIndex != 1) {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = [...this.schemeReceiptList, ...resp.dynamicData[0]];
          } else {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = resp.dynamicData[0];
            // this.nextPage()
          }
          this.schemeReceiptListHead = Object.keys(this.schemeReceiptList[0]);
          this.schemeReceiptListHead.unshift(this.schemeReceiptListHead.pop())
          //change detector code
          // this.ChangeDetector.detectChanges()
        } else {
          this.toastr.error('No Response Found', resp.Message ? resp.Message : '', {
            timeOut: 2000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      });
    this.subscriptions.push(Sub)
  }


  //fetch scheme with custcode
  fetchSchemeWithCustCode(customerCode: string) {
    let custCode = ''
    custCode = customerCode
    this.SchemeMasterFindData = {
      TABLE_NAME: 'SCHEME_MASTER',
      API_VALUE: `Scheme/SchemeMaster?SCHEME_CUSTCODE=${custCode}`,
      API_FILTER_VALUE: 'SCHEME_UNIQUEID',
      DB_FIELD_VALUE: 'SCHEME_UNIQUEID',
      NAME_FIELD_VALUE: 'SCHEME_UNITVALUE',
      USER_TYPED_VALUE: '',
      VIEW_INPUT: true,
      VIEW_TABLE: true,
    }
    let API = `Scheme/SchemeMaster?SCHEME_CUSTCODE=${custCode}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          if (result.response.length > 0) {
            if (data[0].SCHEME_ID != "") {
              // this.receiptDetailsForm.controls.SchemeID.setValue(data[0].SCHEME_ID)
              // this.receiptDetailsForm.controls.SchemeUniqueID.setValue(data[0].SCHEME_UNIQUEID)
              // this.newReceiptData.SCHEME_AMOUNT = data[0]?.SCHEME_TOTAL_VALUE
              // this.MasterFindIcon.openMasterSearch(API)
            } else {
              this.receiptDetailsForm.controls.SchemeID.setValue('')
              this.receiptDetailsForm.controls.SchemeUniqueID.setValue('')
              this.toastr.error('Scheme Not found', result.Message ? result.Message : '', {
                timeOut: 2000,
              })
            }
          }

        } else {
          this.receiptDetailsForm.controls.SchemeID.setValue('')
          this.receiptDetailsForm.controls.SchemeUniqueID.setValue('')
          this.toastr.error('', result.Message ? result.Message : 'Scheme Not found', {
            timeOut: 2000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  //fetch PartyCode fronewReceiptDatam VoctypeMasterOnlineScheme
  fetchPartyCode() {
    let API = `Scheme/VoctypeMasterOnlineScheme?BRANCH_CODE=BJA&VOCTYPE=PCR`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          if (data[0].DEFACCODE != "") {
            this.receiptDetailsForm.controls.PartyCode.setValue(data[0].DEFACCODE)
            this.newReceiptData.PARTY_CODE = data[0].DEFACCODE
          } else {
            this.fetchCreditCardMaster()
          }
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  //fetch from CreditCardMaster
  fetchCreditCardMaster() {
    let API = `Scheme/CreditCardMaster`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let res = result.response.filter((item: any) => item.MODE == 3)
          if (res[0].ACCODE) {
            this.receiptDetailsForm.controls.PartyCode.setValue(res[0].ACCODE)
            this.newReceiptData.PARTY_CODE = res[0].ACCODE
            this.rightSideHeader = res[0].DESCRIPTION
          } else {
            this.toastr.error('PartyCode not found in credit master', result.Message ? result.Message : '', {
              timeOut: 3000,
            })
          }
          if (res[0].CURRENCY_CODE != "") {
            this.receiptDetailsForm.controls.CurrCode.setValue(res[0].CURRENCY_CODE)
            this.newReceiptData.CURRENCY_CODE = res[0].CURRENCY_CODE
            this.currencyCodeChange(res[0].CURRENCY_CODE)
          }
        } else {
          this.toastr.error('PartyCode not found in credit master', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  selectedParty(data: any) {
    this.receiptDetailsForm.controls.PartyCode.setValue(data.ACCODE)
    this.newReceiptData.PARTY_CODE = data.ACCODE
    if (data.CURRENCY_CODE) {
      this.receiptDetailsForm.controls.CurrCode.setValue(data.CURRENCY_CODE)
      this.newReceiptData.CURRENCY_CODE = data.CURRENCY_CODE
      this.currencyCodeChange(data.CURRENCY_CODE)
    }
  }
  selectedScheme(data: any) {
    this.receiptDetailsForm.controls.SchemeID.setValue(data.SCHEME_ID)
    this.receiptDetailsForm.controls.SchemeUniqueID.setValue(data.SCHEME_UNIQUEID)
    this.receiptDetailsForm.controls.SchemeUnits.setValue(data.SCHEME_UNITS)
    this.newReceiptData.SCHEME_AMOUNT = data.SCHEME_TOTAL_VALUE
    // this.newReceiptData.SCHEME_AMOUNT = data.SCHEME_AMOUNT
  }
  //customer selection from search
  selectedCustomer(data: any) {
    this.receiptDetailsForm.controls.POSCustomerName.setValue(data.NAME)
    this.receiptDetailsForm.controls.POSCustomerCode.setValue(data.CODE)
    this.receiptDetailsForm.controls.POSCustomerMobile.setValue(data.MOBILE)

    this.fetchSchemeWithCustCode(this.receiptDetailsForm.value.POSCustomerCode)
  }
  //customer selection from selectedCustomer MainGrid
  selectedCustomerMainGrid(data: any) {
    this.VocNumberMain = ''
    this.CustomerNameSearch = data.NAME
    this.CustomerCodeSearch = data.CODE
    this.mainGridCodeChange(data.CODE)
  }
  //party Code Change
  customerChange(event: any, searchFlag: string) {
    if (event.target.value == '') return
    this.VocNumberMain = ''
    // this.MasterFindIcon.openMasterSearch()
    this.snackBar.open('Loading ...');
    let API = `Scheme/CustomerMaster?${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.snackBar.dismiss();
        if (result.response) {
          let data = result.response
          if (data.NAME) {
            this.receiptDetailsForm.controls.POSCustomerName.setValue(data.NAME)
            this.receiptDetailsForm.controls.POSCustomerMobile.setValue(data.MOBILE)
            this.fetchSchemeWithCustCode(data.CODE)
          }
        } else {
          this.toastr.error('Customer not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  //party Code Change
  mainGridCustomerChange(event: any, searchFlag: string) {
    if (event.target.value == '') return
    // this.MasterFindIcon.openMasterSearch()
    this.snackBar.open('Loading ...');
    let API = `Scheme/CustomerMaster?${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.snackBar.dismiss();
        if (result.response) {
          let data = result.response
          if (data.CODE) {
            this.mainGridCodeChange(data.CODE)
          }
        } else {
          this.toastr.error('Customer not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  mainGridVocChange(event: any) {
    if (event.target.value == '') return
    this.CustomerCodeSearch = ''
    this.CustomerNameSearch = ''
    let data = {
      FILTER: {
        YEARMONTH: this.commonService.yearSelected,
        BRANCH_CODE: this.commonService.branchCode,
        VOCTYPE: "PCR",
        VOCNO: event.target.value || '',
      },
      TRANSACTION: {
        VOCTYPE: "PCR",
        MAINVOCTYPE: ""
      }
    }
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    let xmlData = convert.js2xml({ root: data }, options);

    let param = {
      "PAGENO": 1,
      "RECORDS": 10000,
      "TABLE_NAME": "CURRENCY_RECEIPT",
      "CUSTOM_PARAM": xmlData || ''
    }
    this.schemeReceiptList = []
    let API = `Scheme/CommonLookUps`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((resp: any) => {
        if (resp.dynamicData) {
          if (this.schemeReceiptList.length > 0) {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = [...this.schemeReceiptList, ...resp.dynamicData[0]];
          } else {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = resp.dynamicData[0];
            // this.nextPage()
          }
          this.schemeReceiptListHead = Object.keys(this.schemeReceiptList[0]);
          this.schemeReceiptListHead.unshift(this.schemeReceiptListHead.pop())
          //change detector code
          // this.ChangeDetector.detectChanges()
        } else {
          this.toastr.error('No Response Found', resp.Message ? resp.Message : '', {
            timeOut: 2000,
          })
        }
      }, err => {
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      });
    this.subscriptions.push(Sub)
  }
  mainGridCodeChange(CODE: any) {
    let data = {
      FILTER: {
        YEARMONTH: this.commonService.yearSelected,
        BRANCH_CODE: this.commonService.branchCode,
        VOCTYPE: "PCR",
        POSCustomerCode: CODE || '',
      },
      TRANSACTION: {
        VOCTYPE: "PCR",
        MAINVOCTYPE: ""
      }
    }
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    let xmlData = convert.js2xml({ root: data }, options);

    let param = {
      "PAGENO": 1,
      "RECORDS": 10000,
      "TABLE_NAME": "CURRENCY_RECEIPT",
      "CUSTOM_PARAM": xmlData || ''
    }
    this.schemeReceiptList = []
    let API = `Scheme/CommonLookUps`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((resp: any) => {
        if (resp.dynamicData) {
          if (this.schemeReceiptList.length > 0) {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = [...this.schemeReceiptList, ...resp.dynamicData[0]];
          } else {
            resp.dynamicData[0].forEach((item: any, i: any) => {
              item.Id = i + 1;
            });
            this.schemeReceiptList = resp.dynamicData[0];
            // this.nextPage()
          }
          this.schemeReceiptListHead = Object.keys(this.schemeReceiptList[0]);
          this.schemeReceiptListHead.unshift(this.schemeReceiptListHead.pop())
          //change detector code
          // this.ChangeDetector.detectChanges()
        } else {
          this.toastr.error('No Response Found', resp.Message ? resp.Message : '', {
            timeOut: 2000,
          })
        }
      }, err => {
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      });
    this.subscriptions.push(Sub)
  }
  //party Code Change
  partyCodeChange(event: any, searchFlag: string) {
    if (event.target.value == '') return
    let API = `Scheme/AccountMaster?${searchFlag}=${event.target.value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          if (data.CURRENCY_CODE) {
            this.receiptDetailsForm.controls.CurrCode.setValue(data.CURRENCY_CODE)
            this.newReceiptData.CURRENCY_CODE = data.CURRENCY_CODE
            this.currencyCodeChange(data.CURRENCY_CODE)
          }
          if (data.ACCOUNT_HEAD) {
            this.rightSideHeader = data.ACCOUNT_HEAD
          }
        } else {
          this.toastr.error('PartyCode not found in credit master', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  //currency Code Change
  currencyCodeChange(value: string) {
    if (value == '') return
    let API = `Scheme/CurrencyMaster/${value}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          if (data.CONV_RATE) {
            this.receiptDetailsForm.controls.CurrRate.setValue(data.CONV_RATE)
            this.newReceiptData.CONV_RATE = data.CONV_RATE
          }
        } else {
          this.toastr.error('Customer not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  /**USE: salesman autocomplete starts*/
  getSalesmanList() {
    let Sub: Subscription = this.dataService.getDynamicAPI('Scheme/SalesPersonMaster')
      .subscribe((result) => {
        if (result.response) {
          this.salesmanArray = result.response

          // this.filteredOptions = this.receiptDetailsForm.controls.Salesman.valueChanges.pipe(
          //   startWith(''),
          //   map(value => this._filterSalesman(value || '')),
          // );
        } else {
          this.toastr.error('Salesman not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => this.toastr.error('Server Error', '', {
        timeOut: 3000,
      }))
    this.subscriptions.push(Sub)
  }
  // private _filterSalesman(value: string): any[] {
  //   const filterValue = value.toLowerCase();
  //   return this.salesmanArray.filter((option: any) =>
  //     option.SALESPERSON_CODE.toLowerCase().includes(filterValue) ||
  //     option.DESCRIPTION.toLowerCase().includes(filterValue));
  // }
 
  /**USE: salesman autocomplete ends*/
  openMadalView(data?:any) {
    if(data){
      this.dataToEditrow = []
      this.dataToEditrow.push(data)
    }else{
      this.dataToEditrow = []
    }
    this.newReceiptData.details = this.dataToEditrow;

    if (!this.receiptDetailsForm.value.POSCustomerCode || this.receiptDetailsForm.value.POSCustomerCode == "") {
      this.toastr.error('Customer Code Required', '', {
        timeOut: 3000,
      });
      return
    }
    if (!this.receiptDetailsForm.value.SchemeID || this.receiptDetailsForm.value.SchemeID == "") {
      this.toastr.error('Scheme not available', '', {
        timeOut: 3000,
      });
      return
    }
    this.modalService.open(this.contentTemplate, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });
  }

  formSubmit() {
    if (this.orderedItems.length == 0) {
      this.toastr.warning('Add new receipt to save', '', {
        timeOut: 3000,
      });
      return
    }
    if (this.isSaved) {
      this.toastr.warning('Saved Receipt! please cancel to add new receipt', '', {
        timeOut: 3000,
      });
      return
    }
    if (this.receiptDetailsForm.invalid) {
      this.toastr.warning('Select all required fields', '', {
        timeOut: 3000,
      });
      return
    }
    
    let detailsArray: any = []
    let datas: any = {}
    
    this.orderedItems.forEach((item: any) => {
      datas = {
        "UNIQUEID": 0,
        "SRNO": item.SRNO,
        "BRANCH_CODE": item.Branch || '',
        "RECPAY_TYPE": item.Type || '',
        "MODE": item.TypeCode || "",
        "ACCODE": item.AC_Code || '',
        "CURRENCY_CODE": item.CurrCode || '',
        "CURRENCY_RATE": item.CurrRate || 0,
        "AMOUNTFC": item.Amount_FC || 0,
        "AMOUNTCC": item.Amount_LC || 0,
        "HEADER_AMOUNT": item.Header_Amount || 0,
        "CHEQUE_NO": "",
        "CHEQUE_DATE": this.commonService.formatDate(new Date(this.currentDate)),
        "CHEQUE_BANK": "",
        "REMARKS": item.Narration || "",
        "BANKCODE": "",
        "PDCYN": "N",
        "HDACCOUNT_HEAD": item.AC_Description || "",
        "modedesc": item.TypeCodeDESC || "",
        "D_POSSCHEMEID": this.receiptDetailsForm.value.SchemeUniqueID || "",
        "D_POSSCHEMEUNITS": this.receiptDetailsForm.value.SchemeUnits || 1,
        "pcrmid": 0,
        "SUB_LEDGER_CODE": "",
        "DT_PDCReturn": false,
        "VATCODE": item.HSN_AC || "",
        "HSNCODE": item.HSN_AC || "",
        "VATNUMBER": item.TRN_No || "",
        "VAT_INVOICENO": item.TRN_Inv || "",
        "VAT_INVOICEDATE": item.TRN_Inv_Date && item.TRN_Inv_Date != '' ? this.commonService.formatDate(new Date(item.TRN_Inv_Date)) : this.commonService.formatDate(new Date(this.currentDate)),
        "VAT_PER": item.TRN_Per || 0,
        "VAT_AMOUNTCC": item.TRN_Amount_LC || 0,
        "VAT_AMOUNTFC": item.TRN_Amount_FC || 0,
        "TOTALAMOUNTWITHVATCC": item.Amount_LC + item.TRN_Amount_LC || 0,
        "TOTALAMOUNTWITHVATFC": item.Amount_FC + item.TRN_Amount_FC || 0,
        "HEADER_AMOUNTWITHVAT": item.HeaderAmountWithTRN || 0,
        "VATREFRemarks": "",
        "VAT_EXPENSE_CODE": "",
        "AMLSOURCEOFFUNDS": "",
        "AMLValidId": "",
        "AMLTRANSACTION_TYPE": ""
      }
      detailsArray.push(datas)
    })
    let postData = {
      "MID": 1,
      "BRANCH_CODE": this.receiptDetailsForm.value.Branch || '',
      "VOCTYPE": this.receiptDetailsForm.value.VocType || 'PCR',
      "VOCNO": this.receiptDetailsForm.value.VocNo || 0,
      "VOCDATE": this.commonService.formatDate(new Date(this.receiptDetailsForm.value.VocDate)) || '',
      "VALUE_DATE": this.commonService.formatDate(new Date(this.currentDate)),
      "YEARMONTH": this.commonService.yearSelected || "",
      "PARTYCODE": this.receiptDetailsForm.value.PartyCode || '',
      "PARTY_CURRENCY": this.receiptDetailsForm.value.CurrCode || '',
      "PARTY_CURR_RATE": this.receiptDetailsForm.value.CurrRate || 0,
      "TOTAL_AMOUNTFC": this.TOTAL_AMOUNTFC || 0,
      "TOTAL_AMOUNTCC": this.TOTAL_AMOUNTLC || 0,
      "REMARKS": this.receiptDetailsForm.value.Narration || "",
      "SYSTEM_DATE": this.commonService.formatDate(new Date(this.currentDate)),
      "NavSeqNo": 0,
      "HawalaCommCode": "",
      "HawalaCommPer": 0,
      "FLAG_UPDATED": "N",
      "FLAG_INPROCESS": "N",
      "SUPINVNO": "",
      "SUPINVDATE": this.commonService.formatDate(new Date(this.currentDate)),
      "SALESPERSON_CODE": this.receiptDetailsForm.value.Salesman || "",
      "BALANCE_FC": this.totalValue_FC || 0,
      "BALANCE_CC": this.totalValue || 0,
      "AuthorizedPosting": true,
      "AUTOGENREF": "",
      "AUTOGENMID": 0,
      "AUTOGENVOCTYPE": "",
      "OUSTATUSNEW": 1,
      "hhaccount_head": this.rightSideHeader || "Advance From Retail Customers",
      "D2DTRANSFER": "F",
      "POSCustomerCode": this.receiptDetailsForm.value.POSCustomerCode || '',
      "DRAFT_FLAG": "",
      "POSSCHEMEID": this.receiptDetailsForm.value.SchemeUniqueID || 0,
      "FLAG_EDIT_ALLOW": "Y",
      "AdvReturn": false,
      "POSTDATE":  this.commonService.formatDate(new Date(this.receiptDetailsForm.value.PostedDate)) || this.commonService.formatDate(new Date(this.currentDate)),
      "HTUSERNAME": this.commonService.userName || "",
      "GENSEQNO": 0,
      "HVAT_AMOUNT_CC": this.VATAmount || 0,
      "HVAT_AMOUNT_FC": this.VATAmount_FC || 0,
      "HTOTALAMOUNTWITHVAT_CC": this.totalValue || 0,
      "HTOTALAMOUNTWITHVAT_FC": this.totalValue_FC || 0,
      "POSORDER_REF": "",
      "FROM_TOUCH": false,
      "ADRRETURNREF": "",
      "CancelledPosting": false,
      "REPAIR_REF": "",
      "CUSTOMER_NAME": this.receiptDetailsForm.value.POSCustomerName || "",
      "CUSTOMER_ADDRESS": "",
      "GIFT_CARDNO": "",
      "CUSTOMER_MOBILE": this.receiptDetailsForm.value.POSCustomerMobile || "",
      "Details": detailsArray
    }
    if(this.editFlag){
      this.submitEditedForm(postData)
      return
    }
    
    this.snackBar.open('Loading ...');
    this.dataService.postDynamicAPI('Scheme/CurrencyReceipt', postData)
      .subscribe((result: any) => {
        this.snackBar.dismiss()
        if (result['status'] == "Success" || result.response) {
          this.isSaved = true;
          let respData = result.response;
          this.receiptDetailsForm.controls.VocNo.setValue(respData?.VOCNO)
          // this.getCommonLookUps();
          Swal.fire({
            title: result['status'] ? result['status'] : result.status,
            text: result['message'] ? result['message'] : result.Message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
              this.disableDelete = true
            }
          })

        } else {
          this.toastr.error('Not saved try again', result.Message ? result.Message : '', {
            timeOut: 3000,
          });

        }
      })

  }
  submitEditedForm(postData: any){
    this.snackBar.open('Loading ...');
    this.dataService.putDynamicAPI(`Scheme/CurrencyReceipt?MID=${this.editDataMID}`, postData)
      .subscribe((result: any) => {
        this.snackBar.dismiss()
        if (result['status'] == "Success" || result.response) {
          this.isSaved = true;
          let respData = result.response;
          this.receiptDetailsForm.controls.VocNo.setValue(respData?.VOCNO)
          this.getCommonLookUps();
          Swal.fire({
            title: result['status'] ? result['status'] : result.status,
            text: result['message'] ? result['message'] : result.Message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok'
          }).then((result) => {
            if (result.isConfirmed) {
            }
          })

        } else {
          this.toastr.error('Not saved try again', result.message ? result.message : '', {
            timeOut: 3000,
          });

        }
      })
  }
  cancel() {
    // location.reload()
    this.VocNumberMain = ''
    this.CustomerCodeSearch = ''
    this.CustomerNameSearch = ''
    this.receiptDetailsForm.reset();
    this.orderedItems = [];
    this.orderedItemsHead = [];
    this.receiptDetailsForm.controls.VocType.setValue('PCR')
    this.SchemeMasterFindData = {
      TABLE_NAME: 'SCHEME_MASTER',
      API_VALUE: ``,
      API_FILTER_VALUE: 'SCHEME_UNIQUEID',
      DB_FIELD_VALUE: 'SCHEME_UNIQUEID',
      NAME_FIELD_VALUE: 'SCHEME_UNITVALUE',
      USER_TYPED_VALUE: '',
      VIEW_INPUT: true,
      VIEW_TABLE: true,
    }
    this.pageIndex = 1
    this.getCommonLookUps();
    this.isViewSchemeMasterGrid = true;
    this.isSaved = false;
  }
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  /**use: add new row to grid */
  addNewRow(data: any) {
    if(data.SRNO){
      this.orderedItems = this.orderedItems.filter((item:any) => item.SRNO != data.SRNO)
    }
    this.orderedItems.push(data)
    this.orderedItems.map((s: any, i: any) => s.id = i + 1);
    this.orderedItems.forEach((item: any, i: any) => {
      item.Id = i + 1;
      item.SRNO = i + 1;
      if(item.TRN_Inv_Date != '') item.TRN_Inv_Date = item.TRN_Inv_Date.toISOString();
    });
    this.orderedItemsHead = Object.keys(this.orderedItems[0]);
    // this.orderedItemsHead.unshift(this.orderedItemsHead.pop())
    this.calculateTotalValues()
    this.closeModal()
  }
  /**use: caluculate the total values for printing */
  private calculateTotalValues(): void {
    if (this.orderedItems.length > 0) {
      this.totalAmount_LC = 0
      this.VATAmount = 0
      this.totalAmount_FC = 0;
      this.VATAmount_FC = 0;
      this.TOTAL_AMOUNTFC = 0;
      this.TOTAL_AMOUNTLC = 0;
      this.totalPartyValue = 0
      this.totalValue = 0
      this.totalValue_FC = 0
      this.totalValueInText = ''

      this.orderedItems.forEach((item: any) => {
        this.totalAmount_LC += item.Amount_LC
        this.VATAmount += item.TRN_Amount_LC
        this.totalAmount_FC += item.Amount_FC
        this.VATAmount_FC += item.TRN_Amount_FC
        this.TOTAL_AMOUNTFC += item.Amount_FC
        this.TOTAL_AMOUNTLC += item.Amount_LC
        
      });
      this.totalValue = this.totalAmount_LC + this.VATAmount
      this.totalValue_FC = this.totalAmount_FC + this.VATAmount_FC
      this.totalPartyValue = this.totalAmount_LC + this.VATAmount
      this.totalValueInText = this.commonService.priceToTextWithCurrency(this.totalValue, 'UNITED ARAB EMIRATES DIRHAM')?.toUpperCase()
    }
  }
  /**use: caluculate the total values for printing */
  private calculateTotalonView(): void {
    if (this.orderedItems.length > 0) {
      this.totalAmount_LC = 0
      this.VATAmount = 0
      this.totalAmount_FC = 0;
      this.VATAmount_FC = 0;
      this.TOTAL_AMOUNTFC = 0;
      this.TOTAL_AMOUNTLC = 0;
      this.totalPartyValue = 0
      this.totalValue = 0
      this.totalValue_FC = 0
      this.totalValueInText = ''

      this.orderedItems.forEach((item: any) => {
        this.totalAmount_LC += item.AMOUNTCC
        this.totalAmount_FC += item.AMOUNTFC

        this.VATAmount += item.VAT_AMOUNTCC
        this.VATAmount_FC += item.VAT_AMOUNTFC

        this.TOTAL_AMOUNTFC += item.AMOUNTFC
        this.TOTAL_AMOUNTLC += item.AMOUNTLC
        
      });
      this.totalValue = this.totalAmount_LC + this.VATAmount
      this.totalValue_FC = this.totalAmount_FC + this.VATAmount_FC
      this.totalPartyValue = this.totalAmount_LC + this.VATAmount
      this.totalValueInText = this.commonService.priceToTextWithCurrency(this.totalValue, 'UNITED ARAB EMIRATES DIRHAM')?.toUpperCase()
    }
  }
  // print button click
  printClicked() {
    //this.validateBeforePrint() 
    if (!this.isSaved) {
      this.toastr.error('Receipt Not Saved', '', {
        timeOut: 3000,
      });
      return
    }
    let _validate: any[] = ['val']
    if (_validate) {
      const printContent: any = document.getElementById('print_invoice');
      var WindowPrt: any = window.open(
        '',
        '_blank',
        `height=${window.innerHeight / 1.5}, width=${window.innerWidth / 1.5}`
      );
      /* WindowPrt.document.write(
        '<html><title>SunTech</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"><style>.anim-rotate {animation: anim-rotate 1s linear infinite;}@keyframes anim-rotate {100% {transform: rotate(360deg);}}.anim-close-card {animation: anim-close-card 1.4s linear;}@keyframes anim-close-card {100% {opacity: 0.3;transform: scale3d(.3, .3, .3);}}.card {box-shadow: $card-shadow;margin-bottom: 30px;transition: all 0.3s ease-in-out;&:hover {box-shadow: 0 0 25px -5px #9e9c9e;}.card-header {border-bottom: $card-header-border;position: relative;+.card-body {padding-top: 0;}h5 {margin-bottom: 0;color: $theme-heading-color;font-size: 14px;font-weight: 700;display: inline-block;margin-right: 10px;line-height: 1.1;position: relative;}.card-header-right {right: 10px;top: 10px;display: inline-block;float: right;padding: 0;position: absolute;@media only screen and (max-width: 575px) {display: none;}.dropdown-menu {margin-top: 0;li {cursor: pointer;a {font-size: 14px;text-transform: capitalize;}}}.btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;color: #888;i {margin-right: 0;}&:after {display: none;}&:focus {box-shadow: none;outline: none;}}// custom toggler .btn.dropdown-toggle {border: none;background: transparent;box-shadow: none;padding: 0;width: 20px;height: 20px;right: 8px;top: 8px;&.mobile-menu span {background-color: #888;height: 2px;border-radius: 5px;&:after, &:before {border-radius: 5px;height: 2px;background-color: #888;}}}.nav-pills {padding: 0;box-shadow: none;background: transparent;}}}.card-footer {padding: 0px !important;background-color: none !important ;border-top: 0px !important}}.card-block, .card-body {padding: 20px 25px;}&.card-load {position: relative;overflow: hidden;.card-loader {position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: flex;align-items: center;background-color: rgba(256, 256, 256,0.7);z-index: 999;i {margin: 0 auto;color: $primary-color;font-size: 24px;align-items: center;display: flex;}}}&.full-card {z-index: 99999;border-radius: 0;}}h4 {margin-bottom: 5px;}.btn-sm, .btn-group-sm>.btn {font-size: 12px;}.view-group {display: -ms-flexbox;display: flex;-ms-flex-direction: row;flex-direction: row;padding-left: 0;margin-bottom: 0;}.thumbnail {height: 180px;margin-bottom: 30px;padding: 0px;-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;}.item.list-group-item {float: none;width: 100%;background-color: #fff;margin-bottom: 30px;-ms-flex: 0 0 100%;flex: 0 0 100%;max-width: 100%;padding: 0 1rem;border: 0;}.item.list-group-item .img-event {float: left;width: 30%;}.item.list-group-item .list-group-image {margin-right: 10px;}.item.list-group-item .thumbnail {margin-bottom: 0px;width: 100%;display: inline-block;}.item.list-group-item .caption {float: left;width: 70%;margin: 0;}.item.list-group-item:before, .item.list-group-item:after {display: table;content: " ";}.item.list-group-item:after {clear: both;}.card-title {margin-bottom: 5px;}h4 {font-size: 18px;}.card .card-block, .card .card-body {padding: 10px;}.caption p {margin-bottom: 5px;}.price {font-weight: 500;font-size: 1.25rem;color: #826d22;}.list-group-item .img-fluid {max-width: 75% !important;height: auto;}.list-group-item .img-event {text-align: center;}@media (min-width: 400px) {.list-group-item .table_comp_w {width: 50%;margin-top: -20%;margin-left: 35%;}}:host ::ng-deep .mat-form-field-appearance-outline .mat-form-field-infix {padding: .5em 0 .5em 0 !important;}:host ::ng-deep .mat-form-field-wrapper {padding-bottom: 0.34375em;}.prod_weight td, .prod_weight th {padding: 5px 0px;font-size: 12px;}.prod_weight th {background-color: #ededf1;}.prod_weight td {color: #b3852d;}    table, th, td {border: 1px solid black; border-collapse: collapse;  }    th, td {    padding: 5px;    text-align: left;    }</style><body><div>'
      );*/

      // SunTech - POS
      WindowPrt.document.write(
        '<html><head><title> &nbsp;' +
        // new Date().toISOString() +
        '</title></head><style> table, th, td { border: 1px solid black;border-collapse: collapse;}th, td {padding: 5px;text-align: left;}</style><body><div>'
      );
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.write('</div></body></html>');
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
      }, 800);
      //WindowPrt.close();
    } else {
      this.snackBar.open(_validate[1], 'OK');
    }
  }

  closeModal() {
    this.modalService.dismissAll()
  }
  //destroy API calls
  ngOnDestroy() {
    this.snackBar.dismiss()
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());
      this.subscriptions = []; // Clear the array
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}