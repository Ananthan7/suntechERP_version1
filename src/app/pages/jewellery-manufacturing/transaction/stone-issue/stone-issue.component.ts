/*
MODULE : JEWELLERY MANUFACTURING
MENU_SCREEN_NAME : <ADD MENU NAME>
DEVELOPER : ANANTHA
*/

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { StoneIssueDetailComponent } from './stone-issue-detail/stone-issue-detail.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';


@Component({
  selector: 'app-stone-issue',
  templateUrl: './stone-issue.component.html',
  styleUrls: ['./stone-issue.component.scss']
})
export class StoneIssueComponent implements OnInit {
  @ViewChild('stoneIssueDetailScreen') public stoneIssueDetailComponent!: NgbModal;
  @ViewChild('overlayenteredBySearch') overlayenteredBySearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlayCurrencyCode') overlayCurrencyCode!: MasterSearchComponent;
  modalReference!: NgbModalRef;

  currentFilter: any;
  srNo: any = 0;
  divisionMS: any = 'ID';
  orders: any = [];
  // columnhead:any[] = ['SR No.','JOB NO','UNQ JOD ID', 'Design','Stock Code','Division','Description ','Carat','Rate','Process','Amount','Worker','Sieve Set'];
  @Input() content!: any;
  tableData: any[] = [];
  stoneIssueData: any[] = [];
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  private subscriptions: Subscription[] = [];
  currentDate: any = this.comService.currentDate;
  vocMaxDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  gridAmountDecimalFormat: any;
  isDisableSaveBtn: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  isloading: boolean = false;
  dataToDetailScreen: any;
  SALESPERSON_CODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Entered by',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACTIVE=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'currency',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneissueFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    VOCNO: ['', [Validators.required]],
    VOCDATE: [''],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    enteredBy: [''],
    currency: [''],
    currencyrate: [''],
    worker: ['',],
    workername: [''],
    narration: [''],
    caratTotal: [''],
    amountTotal: [''],
    total: [''],
    FLAG: [''],
    MAIN_VOCTYPE: ['']
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    //this.content provide the data and flag from main grid to the form
    if (this.content?.FLAG) {
      this.setInitialValues()
      this.stoneissueFrom.controls.FLAG.setValue(this.content.FLAG)
      switch (this.content.FLAG) {
        case 'VIEW':
          this.viewMode = true;
          this.LOCKVOUCHERNO = true;
          break;
        case 'EDIT':
          this.editMode = true;
          this.LOCKVOUCHERNO = true;
          break;
        case 'DELETE':
          this.viewMode = true;
          this.deleteRecord();
          break;
        // Add other cases if needed
        default:
          // Handle unexpected FLAG values if necessary
          break;
      }
      return
    }
    this.generateVocNo()
    this.setvalues()
    this.setvoucherTypeMaster()
    this.setCompanyCurrency()
    // this.gridAmountDecimalFormat = {
    //   type: 'fixedPoint',
    //   precision: this.comService.allbranchMaster?.BAMTDECIMALS,
    //   currency: this.comService.compCurrency
    // };

  }
  setvalues() {
    this.branchCode = this.comService.branchCode;
    this.stoneissueFrom.controls.VOCTYPE.setValue(this.comService.getqueryParamVocType())
    this.stoneissueFrom.controls.VOCDATE.setValue(this.comService.currentDate)
    this.stoneissueFrom.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    this.stoneissueFrom.controls.YEARMONTH.setValue(this.comService.yearSelected)
    this.stoneissueFrom.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
  }


  setInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobStoneIssueMasterDJ/GetJobStoneIssueMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response

          this.stoneissueFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.stoneissueFrom.controls.VOCNO.setValue(data.VOCNO)
          this.stoneissueFrom.controls.VOCDATE.setValue(data.VOCDATE)
          this.stoneissueFrom.controls.BRANCH_CODE.setValue(data.BRANCH_CODE)
          this.stoneissueFrom.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.stoneissueFrom.controls.currency.setValue(data.CURRENCY_CODE)
          this.stoneissueFrom.controls.currencyrate.setValue(
            this.comService.decimalQuantityFormat(data.CURRENCY_RATE, 'RATE')
          )
          // this.stoneissueFrom.controls.worker.setValue(data.WORKER)
          // this.stoneissueFrom.controls.workername.setValue(data.WORKER_NAME)
          this.stoneissueFrom.controls.enteredBy.setValue(data.SMAN)
          this.stoneissueFrom.controls.narration.setValue(data.REMARKS)
          this.stoneissueFrom.controls.caratTotal.setValue(data.REMARKS)
          this.stoneIssueData = data.Details
          this.stoneissueFrom.controls.worker.setValue(this.stoneIssueData[0].WORKER_CODE)
          this.stoneissueFrom.controls.workername.setValue(this.stoneIssueData[0].WORKER_NAME)

          let detailData = data.Details
          // if (detailData.length > 0) {
          //   detailData.forEach((element: any) => {
          //     element.FLAG = this.content ? this.content.FLAG : null
          //     this.stoneIssueData.push({
          //       SRNO: element.SRNO,
          //       JOB_NUMBER: element.JOB_NUMBER,
          //       UNQ_JOB_ID: element.UNQ_JOB_ID,
          //       DESIGN_CODE: element.DESIGN_CODE,
          //       STOCK_CODE: element.STOCK_CODE,
          //       DIVCODE: element.DIVCODE,
          //       STOCK_DESCRIPTION: element.STOCK_DESCRIPTION,
          //       Carat: element.JOB_DESCRIPTION,
          //       Rate: element.RATEFC,
          //       PROCESS_CODE: element.PROCESS_CODE,
          //       AMOUNTLC: element.AMOUNTFC,
          //       WORKER_CODE: element.WORKER_CODE,
          //       SIEVE_SET: element.SIEVE_SET,
          //     })
          //   });
          // }



        } else {
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.stoneissueFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.stoneissueFrom.value.VOCNO}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists

          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.stoneissueFrom.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  userDataSelected(value: any) {
    this.stoneissueFrom.controls.enteredBy.setValue(value.SALESPERSON_CODE);
  }

  CurrencyCodeSelected(e: any) {
    console.log(e);
    // this.stoneissueFrom.controls.currency.setValue(e.CURRENCY_CODE);
    // this.stoneissueFrom.controls.currencyrate.setValue(e.CONV_RATE);
    if (e.CURRENCY_CODE) {
      this.stoneissueFrom.controls.currency.setValue(e.CURRENCY_CODE)
      this.stoneissueFrom.controls.currencyrate.setValue(e.CONV_RATE)
    }
    if (e.Currency) {
      this.stoneissueFrom.controls.currency.setValue(e.Currency)
      this.stoneissueFrom.controls.currencyrate.setValue(
        this.comService.decimalQuantityFormat(e['Conv Rate'], 'RATE')
      )
    }
  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.stoneissueFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneissueFrom.controls.workername.setValue(e.DESCRIPTION);
  }
  selectedRows: any[] = [];

  onSelectionChanged(event: any): void {
    // Get all the selected row keys (SRNOs)
    this.selectedRows = event.selectedRowKeys;
    console.log('Selected Rows:', this.selectedRows);
  }

  deleteTableData(): void {
    if (!this.selectRowIndex) {
      console.log(this.selectRowIndex, 'delete')
      Swal.fire({
        title: '',
        text: 'Please select row to remove from grid!',
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
        this.stoneIssueData = this.stoneIssueData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }
  reCalculateSRNO() {
    this.stoneIssueData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
      item.GROSS_WT = this.comService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
    })
  }
  setCompanyCurrency() {
    let CURRENCY_CODE = this.comService.getCompanyParamValue('COMPANYCURRENCY')
    this.stoneissueFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.comService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stoneissueFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.stoneissueFrom.controls.currencyrate.setValue(
        this.comService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stoneissueFrom.controls.currency.setValue('')
      this.stoneissueFrom.controls.currencyrate.setValue('')
      this.comService.toastErrorByMsgId('MSG1531')
    }
  }
  openaddstoneissuedetail(data?: any) {
    // console.log(data,'data to child')
    if (data) {
      data.FLAG = this.content?.FLAG || 'EDIT'
      data.HEADERDETAILS = this.stoneissueFrom.value;
    } else {
      data = { HEADERDETAILS: this.stoneissueFrom.value }
    }
    this.dataToDetailScreen = data;
    this.modalReference = this.modalService.open(this.stoneIssueDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    // modalRef.componentInstance.content = data
    // modalRef.result.then((postData) => {
    //   if (postData) {
    //     console.log('Data from child:', postData);
    //     this.stoneIssueData.push(postData);
    //     this.setValuesToHeaderGrid(postData);
    //   }
    // });
  }

  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDblClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    // let detailRow = this.detailData.filter((item: any) => item.SRNO == selectedData.SRNO)
    this.openaddstoneissuedetail(selectedData)
  }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.stoneIssueData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.stoneIssueData.length + 1
      this.stoneIssueData.push(detailDataToParent);
      // this.recalculateSRNO()
    }
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.comService.showSnackBarMsg('Details added successfully')//CHINNU -  MESSAGE HARD CODED
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  removedata() {
    this.tableData.pop();
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  setPostData(form: any) {
    return {
      "MID": 0,
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCDATE": (form.VOCDATE),
      "YEARMONTH": this.comService.nullToString(form.YEARMONTH),
      "DOCTIME": (form.VOCDATE),
      "CURRENCY_CODE": this.comService.nullToString(form.currency),
      "CURRENCY_RATE": form.currencyrate || 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": this.comService.nullToString(form.enteredBy),
      "REMARKS": this.comService.nullToString(form.narration),
      "NAVSEQNO": 0,
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": (form.VOCDATE),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.stoneIssueData,
    }

  }
  submitValidations(form: any) {
    if (this.stoneIssueData.length == 0) {
      this.comService.toastErrorByMsgId('MSG1453')//No details found!!
      return true
    }
    if (form.VOCTYPE == '') {
      this.comService.toastErrorByMsgId('MSG1939')// voctype  CANNOT BE EMPTY
      return true
    }
    return false
  }
  /**use: final save */
  formSubmit() {
    if (this.submitValidations(this.stoneissueFrom.value)) {
      return
    }
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = this.setPostData(this.stoneissueFrom.value)
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          this.showSuccessDialog(this.comService.getMsgByID('MSG2443') || 'Saved successfully');
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
    this.stoneissueFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE)
    this.stoneissueFrom.controls.VOCNO.setValue(this.content.VOCNO)
    this.stoneissueFrom.controls.VOCDATE.setValue(this.content.VOCDATE)
    this.stoneissueFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.stoneissueFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    this.stoneissueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissueFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissueFrom.controls.narration.setValue(this.content.REMARKS)
  }


  update() {
    let FRM = this.stoneissueFrom.value
    let API = `JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/${FRM.BRANCH_CODE}/${FRM.VOCTYPE}/${FRM.VOCNO}/${FRM.YEARMONTH}`
    let postData = this.setPostData(this.stoneissueFrom.value)
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          this.showSuccessDialog(this.comService.getMsgByID('MSG2443') || 'Saved successfully');
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }

      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  afterSave(value: any) {
    if (value) {
      this.stoneissueFrom.reset()
      this.tableData = []
      this.close('reloadMainGrid')
    }
  }
  /**USE: delete worker master from row */
  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
    // if (!this.content?.VOCTYPE) {
    //   this.showDeleteErrorDialog('Please Select data to delete!');
    //   return;
    // }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let FRM = this.stoneissueFrom.value;
        let API = `JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/${FRM.BRANCH_CODE}/${FRM.VOCTYPE}/${FRM.VOCNO}/${FRM.YEARMONTH}`
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog(' Deleted successfully');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.comService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => {
            this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          });
        this.subscriptions.push(Sub);
      }
    });
  }

  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  showDeleteErrorDialog(message: string): void {
    Swal.fire({
      title: '',
      text: message,
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      // this.afterSave(result.value)
    });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.stoneissueFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'worker':
        this.overlayworkerSearch.showOverlayPanel(event);
        break;
      case 'enteredBy':
        this.overlayenteredBySearch.showOverlayPanel(event);
        break;
      case 'currencyrate':
        this.overlayCurrencyCode.showOverlayPanel(event);
        break;
      default:

    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.stoneissueFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'worker' || FORMNAME === 'enteredBy' || FORMNAME === 'currencyrate') {
            this.showOverleyPanel(event, FORMNAME);
          } {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
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
