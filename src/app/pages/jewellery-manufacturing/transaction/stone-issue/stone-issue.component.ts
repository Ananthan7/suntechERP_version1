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
  userName = localStorage.getItem('username');
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
  currentDate = new FormControl(new Date());
  vocMaxDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  dataToDetailScreen:any;
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
    voctype: ['', [Validators.required]],
    vocno: ['1', [Validators.required]],
    vocDate: [],
    enteredBy: [''],
    currency: [''],
    currencyrate: [''],
    worker: ['',],
    workername: [''],
    narration: [''],
    caratTotal: [''],
    amountTotal: [''],
    total: [''],
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
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
      }
      // this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.stoneissueFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setInitialValues()
    } else {
      this.setvalues()
      this.setCompanyCurrency()
    }


  }
  setvalues() {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.stoneissueFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.stoneissueFrom.controls.vocDate.setValue(this.comService.currentDate)
  }
  setInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobStoneIssueMasterDJ/GetJobStoneIssueMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
                
          this.stoneissueFrom.controls.currency.setValue(data.CURRENCY_CODE)
          this.stoneissueFrom.controls.currencyrate.setValue(data.CURRENCY_RATE)
          this.stoneissueFrom.controls.worker.setValue(data.WORKER)
          this.stoneissueFrom.controls.workername.setValue(data.WORKER_NAME)
          this.stoneissueFrom.controls.enteredBy.setValue(data.SMAN)
          this.stoneissueFrom.controls.narration.setValue(data.REMARKS)
          this.stoneissueFrom.controls.caratTotal.setValue(data.REMARKS)

          let detailData = data.Details
          if (detailData.length > 0) {
            detailData.forEach((element: any) => {
              element.FLAG = this.content ? this.content.FLAG : null
              this.stoneIssueData.push({
                SRNO: element.SRNO,
                JOB_NUMBER: element.JOB_NUMBER,
                UNQ_JOB_ID: element.UNQ_JOB_ID,
                DESIGN_CODE: element.DESIGN_CODE,
                STOCK_CODE: element.STOCK_CODE,
                DIVCODE: element.DIVCODE,
                STOCK_DESCRIPTION: element.STOCK_DESCRIPTION,
                Carat: element.JOB_DESCRIPTION,
                Rate: element.RATEFC,
                PROCESS_CODE: element.PROCESS_CODE,
                AMOUNTLC: element.AMOUNTFC,
                WORKER_CODE: element.WORKER_CODE,
                SIEVE_SET: element.SIEVE_SET,
              })
            });
          }
    


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
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.stoneIssueData.splice(element.SRNO - 1, 1)
    })
  }
  onSelectionChanged(event: any) {
    this.selectedKey = event.selectedRowKeys;
    console.log(this.selectedKey, 'srno')
    let indexes: Number[] = [];
    this.stoneIssueData.reduce((acc, value, index) => {
      if (this.selectedKey.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
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
      this.stoneIssueData.push(detailDataToParent);
      // this.recalculateSRNO()
    }
    if(DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if(DATA.FLAG == 'CONTINUE'){
      this.commonService.showSnackBarMsg('Details added successfully')
    };
  }
  closeDetailScreen(){
    // this.modalReference.close()
  }
  // addRow(): void {
  //   const newRow = this.formBuilder.group({
  //     serialNo: this.tableData.length + 1,
  //     carat: 0,
  //     amount: 0,
  //     total: 0
  //   });

  //   this.tableData.push(newRow);
  //   this.updateTotal();
  // }

  // updateTotal(): void {
  //   let caratTotal = 0;
  //   let amountTotal = 0;
  //   let total = 0;

  //   // this.tableData.controls.forEach((control: FormGroup) => {
  //   //   caratTotal += control.get('carat').value;
  //   //   amountTotal += control.get('amount').value;
  //   // });

  //   this.stoneissueFrom.patchValue({
  //     caratTotal,
  //     amountTotal
  //   });
  // }

  removedata() {
    this.tableData.pop();
  }
  setPostData(){
    return {
      "MID": 0,
      "VOCTYPE": this.stoneissueFrom.value.voctype,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.stoneissueFrom.value.vocno,
      "VOCDATE": this.stoneissueFrom.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-19T06:55:16.030Z",
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
      "SYSTEM_DATE": "2023-10-19T06:55:16.030Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.stoneIssueData,
    }

  }
  submitValidations(form: any) {
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
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.stoneissueFrom.value)) {
      return
    }

    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                this.stoneissueFrom.reset()
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

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
    this.stoneissueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.stoneissueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.stoneissueFrom.controls.vocDate.setValue(this.content.VOCDATE)
    this.stoneissueFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.stoneissueFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    this.stoneissueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissueFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissueFrom.controls.narration.setValue(this.content.REMARKS)
  }


  update() {
    if (this.stoneissueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = `JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/${this.branchCode}/${this.stoneissueFrom.value.voctype}/${this.stoneissueFrom.value.vocno}/${this.commonService.yearSelected}`
    let postData = this.setPostData()
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
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
                this.stoneissueFrom.reset()
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.stoneissueFrom.value.branchCode + this.stoneissueFrom.value.voctype + this.stoneissueFrom.value.vocno + this.stoneissueFrom.value.yearMonth
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
                    this.stoneissueFrom.reset()
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
                    this.stoneissueFrom.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
