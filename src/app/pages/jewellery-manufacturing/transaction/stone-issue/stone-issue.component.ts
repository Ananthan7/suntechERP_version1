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



@Component({
  selector: 'app-stone-issue',
  templateUrl: './stone-issue.component.html',
  styleUrls: ['./stone-issue.component.scss']
})
export class StoneIssueComponent implements OnInit {
  @ViewChild('stoneIssueDetailScreen') public stoneIssueDetailComponent!: NgbModal;
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
  currentDate = new FormControl(new Date());
  vocMaxDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  editMode: boolean = false;
  dataToDetailScreen: any;
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
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneissueFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    VOCNO: ['', [Validators.required]],
    VOCDATE: [],
    YEARMONTH: [],
    BRANCH_CODE: [],
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
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    // this.gridAmountDecimalFormat = {
    //   type: 'fixedPoint',
    //   precision: this.comService.allbranchMaster?.BAMTDECIMALS,
    //   currency: this.comService.compCurrency
    // };

    //this.content provide the data and flag from main grid to the form
    if (this.content?.FLAG) {
      this.setInitialValues()
      this.stoneissueFrom.controls.FLAG.setValue(this.content.FLAG)

      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
      }
      // this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.editMode = true
      }
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      return
    }
    this.setvalues()
    this.setCompanyCurrency()
  }
  setvalues() {
    this.branchCode = this.comService.branchCode;
    this.stoneissueFrom.controls.VOCTYPE.setValue(this.comService.getqueryParamVocType())
    this.stoneissueFrom.controls.VOCDATE.setValue(this.comService.currentDate)
    this.stoneissueFrom.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    this.stoneissueFrom.controls.YEARMONTH.setValue(this.comService.yearSelected)

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
          this.stoneissueFrom.controls.worker.setValue(data.WORKER)
          this.stoneissueFrom.controls.workername.setValue(data.WORKER_NAME)
          this.stoneissueFrom.controls.enteredBy.setValue(data.SMAN)
          this.stoneissueFrom.controls.narration.setValue(data.REMARKS)
          this.stoneissueFrom.controls.caratTotal.setValue(data.REMARKS)

          this.stoneIssueData = data.Details
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
    this.stoneissueFrom.controls.enteredBy.setValue(value.UsersName);
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

  deleteTableData(): void {
    if (!this.selectRowIndex) {
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
    console.log(data, 'data')
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
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  removedata() {
    this.tableData.pop();
  }
  setPostData() {
    return {
      "MID": 0,
      "VOCTYPE": this.stoneissueFrom.value.VOCTYPE,
      "BRANCH_CODE": this.stoneissueFrom.value.BRANCH_CODE,
      "VOCNO": this.stoneissueFrom.value.VOCNO,
      "VOCDATE": this.stoneissueFrom.value.VOCDATE,
      "YEARMONTH": this.stoneissueFrom.value.YEARMONTH,
      "DOCTIME": (this.stoneissueFrom.value.VOCDATE),
      "CURRENCY_CODE": this.stoneissueFrom.value.currency || "",
      "CURRENCY_RATE": this.stoneissueFrom.value.currencyrate || 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": this.comService.nullToString(this.stoneissueFrom.value.SMAN),
      "REMARKS": this.stoneissueFrom.value.narration || "",
      "NAVSEQNO": 0,
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": (this.stoneissueFrom.value.VOCDATE),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.stoneIssueData,
    }

  }
  submitValidations(form: any) {
    if (this.stoneIssueData.length == 0) {
      this.comService.toastErrorByMsgId('details not added')
      return true
    }
    if (form.VOCTYPE == '') {
      this.comService.toastErrorByMsgId('VOCTYPE is required')
      return true
    }
    if (form.vocdate == '') {
      this.comService.toastErrorByMsgId('vocdate is required')
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
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.showSuccessDialog(this.comService.getMsgByID('MSG2443') || 'Saved successfully');
        } else {
          this.showErrorDialog(result.message || 'Error please try again');
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
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            this.showSuccessDialog(this.comService.getMsgByID('MSG2443') || 'Saved successfully');
          } else {
            this.showErrorDialog(result.message || 'Error please try again');
          }
        } else {
          this.toastr.error('Not saved')
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
    if (!this.content?.VOCTYPE) {
      this.showDeleteErrorDialog('Please Select data to delete!');
      return;
    }

    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let FRM = this.stoneissueFrom.value;
        let API = `JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/${FRM.BRANCH_CODE}/${FRM.VOCTYPE}/${FRM.VOCNO}/${FRM.YEARMONTH}`
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                this.showSuccessDialog(this.content?.VOCNO + ' Deleted successfully');
              } else {
                this.showErrorDialog(result.message || 'Error please try again');
              }
            } else {
              this.toastr.error('Not deleted');
            }
          }, err => {
            this.commonService.toastErrorByMsgId('network error')
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
