import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StoneReturnDetailsComponent } from './stone-return-details/stone-return-details.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
@Component({
  selector: 'app-stone-return',
  templateUrl: './stone-return.component.html',
  styleUrls: ['./stone-return.component.scss']
})
export class StoneReturnComponent implements OnInit {
  @ViewChild('stoneReturnDetailScreen') public stoneReturnDetailComponent!: NgbModal;
  @ViewChild('overlayenterdBySearch') overlayenterdBySearch! : MasterSearchComponent;
  columnhead: any[] = ['SRNO', 'VOCNO', 'VOCTYPE', 'VOCDATE', 'JOB_NO', 'JOB_DATE', 'JOB_SO', 'UNQ_JOB', 'JOB_DE', 'BRANCH'];
  @Input() content!: any;
  tableData: any[] = [];
  stoneReturnData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  isloading: boolean = false;
  dataToDetailScreen: any;
  modalReference!: NgbModalRef;

  private subscriptions: Subscription[] = [];
  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  baseCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'BaseCurrency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stonereturnFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    basecurrency: [''],
    basecurrencyrate: [''],
    currency: ['', [Validators.required]],
    currencyrate: ['', [Validators.required]],
    worker: [''],
    workername: [''],
    remark: [''],
    enterdBy: [''],
    enteredByName: [''],
    process: [''],
    jobDesc: [''],
    FLAG: [null],
    MAIN_VOCTYPE:['']
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.userName = this.commonService.userName;

    if (this.content?.FLAG) {
      this.setAllInitialValues()
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content?.FLAG) {
        this.stonereturnFrom.controls.FLAG.setValue(this.content.FLAG)
      }
    } else {
      this.generateVocNo()
      this.setFormValues()
      this.setvoucherTypeMaster()
    }
  }
  setFormValues() {
    if (this.content?.FLAG) return
    this.stonereturnFrom.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.stonereturnFrom.controls.VOCDATE.setValue(this.commonService.currentDate)
    this.stonereturnFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.stonereturnFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.stonereturnFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()

    this.setCompanyCurrency()
    this.basesetCompanyCurrency()
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.stonereturnFrom.value
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.stonereturnFrom.value.VOCNO}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.stonereturnFrom.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }

  setAllInitialValues() {
    if (!this.content?.MID) return
    let API = `JobStoneReturnMasterDJ/GetJobStoneReturnMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.detailData = data.Details
          if (this.detailData.length > 0) {
            this.detailData.forEach((element: any) => {
              element.FLAG = this.content ? this.content.FLAG : null
              this.stoneReturnData.push({
                SRNO: element.SRNO,
                VOCNO: element.VOCNO,
                VOCTYPE: element.VOCTYPE,
                VOCDATE: element.VOCDATE,
                JOB_NO: element.JOB_SO_NUMBER,
                JOB_DATE: element.JOB_DATE,
                UNQ_JOB: element.UNQ_JOB_ID,
                JOB_DE: element.JOB_DESCRIPTION,
                BRANCH: element.BRANCH_CODE,

              })
            });
          } else {
            this.commonService.toastErrorByMsgId('MSG1200')//	Detail record not found
          }
          this.stonereturnFrom.controls.basecurrency.setValue(data.BASE_CURRENCY)
          this.stonereturnFrom.controls.basecurrencyrate.setValue(data.BASE_CURR_RATE)
          this.stonereturnFrom.controls.currency.setValue(data.CURRENCY_CODE)
          this.stonereturnFrom.controls.currencyrate.setValue(data.CURRENCY_RATE)
          this.stonereturnFrom.controls.worker.setValue(data.WORKER)
          this.stonereturnFrom.controls.workername.setValue(data.WORKER_NAME)
          this.stonereturnFrom.controls.enterdBy.setValue(data.HTUSERNAME)
          this.stonereturnFrom.controls.enteredByName.setValue(data.REMARKS)
          this.stonereturnFrom.controls.enteredByName.setValue(data.REMARKS)

          this.stonereturnFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.stonereturnFrom.controls.VOCNO.setValue(data.VOCNO)
          this.stonereturnFrom.controls.VOCDATE.setValue(data.VOCDATE)
          this.stonereturnFrom.controls.remark.setValue(data.REMARKS)
          this.stonereturnFrom.controls.enterdBy.setValue(data.SMAN)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  userDataSelected(value: any) {
    console.log(value);
    this.stonereturnFrom.controls.enterdBy.setValue(value.SALESPERSON_CODE);
  }
  WorkerCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  currencyCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.currency.setValue(e.CURRENCY_CODE);
    this.stonereturnFrom.controls.currencyrate.setValue(e.CONV_RATE);
  }

  baseCurrencyCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.basecurrency.setValue(e.CURRENCY_CODE);
    this.stonereturnFrom.controls.basecurrencyrate.setValue(e.CONV_RATE);
  }

  openStoneReturnDetails(data?: any) {
    if (data) {
      data.HEADERDETAILS = this.stonereturnFrom.value;
    } else {
      data = { HEADERDETAILS: this.stonereturnFrom.value }
    }
    this.dataToDetailScreen = data;
    this.modalReference = this.modalService.open(this.stoneReturnDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  onRowClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    this.openStoneReturnDetails(selectedData)
  }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.stoneReturnData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.stoneReturnData.length + 1
      this.stoneReturnData.push(detailDataToParent);
      // this.recalculateSRNO()
    }
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  deleteTableData(): void {
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.stoneReturnData.splice(element.SRNO - 1, 1)
    })
  }
  onSelectionChanged(event: any) {
    this.selectedKey = event.selectedRowKeys;
    console.log(this.selectedKey, 'srno')
    let indexes: Number[] = [];
    this.stoneReturnData.reduce((acc, value, index) => {
      if (this.selectedKey.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonereturnFrom.controls.currency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonereturnFrom.controls.currency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonereturnFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonereturnFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.stonereturnFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonereturnFrom.controls.currency.setValue('')
      this.stonereturnFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  /**USE: to set currency on selected change*/
  basecurrencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonereturnFrom.controls.basecurrency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonereturnFrom.controls.basecurrency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  basesetCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonereturnFrom.controls.basecurrency.setValue(CURRENCY_CODE);
    this.basesetCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  basesetCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonereturnFrom.value.basecurrency);
    if (CURRENCY_RATE.length > 0) {
      this.stonereturnFrom.controls.basecurrencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonereturnFrom.controls.basecurrency.setValue('')
      this.stonereturnFrom.controls.basecurrencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }
  lookupKeyPress(event: any, form?: any) {
    if(event.key == 'Tab' && event.target.value == ''){
      this.showOverleyPanel(event,form)
    }
  }


  removedata() {
    this.tableData.pop();
  }
  setPostData(form: any) {
    return {
      "MID": this.content?.MID || 0,
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(new Date(form.VOCDATE)),
      "YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "DOCTIME": "",
      "CURRENCY_CODE": this.commonService.nullToString(form.currency),
      "CURRENCY_RATE": this.commonService.nullToString(form.currencyrate),
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": this.commonService.nullToString(form.enterdBy),
      "REMARKS": this.commonService.nullToString(form.remark),
      "NAVSEQNO": 0,
      "BASE_CURRENCY": this.commonService.nullToString(form.basecurrency),
      "BASE_CURR_RATE": this.commonService.emptyToZero(form.basecurrencyrate),
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": this.commonService.formatDateTime(this.currentDate),
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": this.commonService.userName,
      "Details": this.stoneReturnData,
    }
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1173')// currency code CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.currencyrate) == '') {
      this.commonService.toastErrorByMsgId('MSG1177')//"currencyrate cannot be empty"
      return true
    }
    return false;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.stonereturnFrom.value)) return;
    // if (this.stonereturnFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = this.setPostData(this.stonereturnFrom.value);

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonereturnFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }



  update() {
    // if (this.stonereturnFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.stonereturnFrom.value)) return;
    let FG = this.stonereturnFrom.value
    let API = `JobStoneReturnMasterDJ/UpdateJobStoneReturnMasterDJ/${FG.BRANCH_CODE}/${FG.VOCTYPE}/${FG.VOCNO}/${FG.YEARMONTH}`
    let postData = this.setPostData(this.stonereturnFrom.value)

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
          if (result && result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonereturnFrom.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.VOCTYPE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
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
        let API = 'JobStoneReturnMasterDJ/DeleteJobStoneReturnMasterDJ/' + this.stonereturnFrom.value.branchCode + this.stonereturnFrom.value.VOCTYPE + this.stonereturnFrom.value.VOCNO + this.stonereturnFrom.value.YEARMONTH
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.stonereturnFrom.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.stonereturnFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.stonereturnFrom.value[formControlName] != '') return;
  
    switch (formControlName) {
      case 'enteredBy':
        this.overlayenterdBySearch.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unexpected form control name: ${formControlName}`);
    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.stonereturnFrom.controls[FORMNAME].setValue('')
         
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'enterdBy') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}

