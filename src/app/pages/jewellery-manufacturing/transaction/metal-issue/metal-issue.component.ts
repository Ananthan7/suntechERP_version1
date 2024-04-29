import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetalIssueDetailsComponent } from './metal-issue-details/metal-issue-details.component';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './metal-issue.component.html',
  styleUrls: ['./metal-issue.component.scss']
})
export class MetalIssueComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [
    { title: 'SRNO', field: 'SRNO' },
    { title: 'Job Id', field: 'JOB_NUMBER' },
    { title: 'Uniq job Id', field: 'JOB_SO_NUMBER' },
    { title: 'Design', field: 'DESIGN_CODE' },
    { title: 'Stock Code', field: 'STOCK_CODE' },
    { title: 'Division', field: 'DIVCODE' },
    { title: 'Description', field: 'STOCK_DESCRIPTION' },
    { title: 'Gross wt', field: 'GROSS_WT' },
    { title: 'Process', field: 'PROCESS_CODE' },
    { title: 'Worker', field: 'WORKER_CODE' },
    { title: 'Amount.', field: 'AMOUNTFC' },
  ];
  metalIssueDetailsData: any[] = [];
  userName = localStorage.getItem('username');
  srNo: any = 0;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  viewOnly: boolean = false;
  selectedIndexes: any = [];
  getdata!: any[];
  tableRowCount: number = 0;
  selectRowIndex: any;
  viewMode: boolean = false;
  isloading: boolean = false;

  metalIssueForm: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    time: [new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()],
    vocdate: ['', [Validators.required]],
    SALESPERSON_CODE: [''],
    VOCNO: [''],
    MID: [0],
    worker: ['', [Validators.required]],
    workerDes: [''],
    REMARKS: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
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
    //this.content provide the data and flag from main grid to the form
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
      }
      this.metalIssueForm.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.setNewFormValues()
    }
  }
  setNewFormValues() {
    this.metalIssueForm.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.metalIssueForm.controls.vocdate.setValue(this.comService.currentDate)
    this.metalIssueForm.controls.YEARMONTH.setValue(this.comService.yearSelected)
    this.metalIssueForm.controls.BRANCH_CODE.setValue(this.comService.branchCode)
  }

  setAllInitialValues() {
    if (!this.content?.FLAG) return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `JobMetalIssueMasterDJ/GetJobMetalIssueMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalIssueForm.controls.voctype.setValue(data.VOCTYPE)
          this.metalIssueForm.controls.VOCNO.setValue(data.VOCNO)
          this.metalIssueForm.controls.MID.setValue(data.MID)
          this.metalIssueForm.controls.vocdate.setValue(data.VOCDATE)
          this.metalIssueForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalIssueForm.controls.workerDes.setValue(data.Details[0].WORKER_NAME)
          this.metalIssueForm.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.metalIssueForm.controls.BRANCH_CODE.setValue(data.BRANCH_CODE)
          this.metalIssueForm.controls.SALESPERSON_CODE.setValue(data.SMAN)
          this.metalIssueForm.controls.REMARKS.setValue(data.REMARKS)
          let part = data.DOCTIME.split('T')
          this.metalIssueForm.controls.time.setValue(part[1])

          this.metalIssueDetailsData = data.Details
          this.reCalculateSRNO() //set to main grid

          this.metalIssueDetailsData.forEach((element: any) => {
            this.tableData.push({
              jobNumber: element.JOB_NUMBER,
              jobNumDes: element.JOB_DESCRIPTION,
              processCode: element.PROCESS_CODE,
              processCodeDesc: element.PROCESS_NAME,
              workerCode: element.WORKER_CODE,
              workerCodeDes: element.WORKER_NAME,
              pcs: element.PCS,
              purity: element.PURITY,
              grossWeight: element.GROSS_WT,
              netWeight: element.NET_WT,
            })
          });

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  // use : to recalculate index number
  reCalculateSRNO() {
    this.metalIssueDetailsData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
      item.GROSS_WT = this.comService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
    })
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  deleteRowClicked(): void {
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
          this.metalIssueDetailsData = this.metalIssueDetailsData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
          this.reCalculateSRNO()
        }
      }
    )
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
    console.log(this.selectRowIndex);
  }
  onRowDblClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    this.openAddMetalIssue(selectedData)
  }
  openAddMetalIssue(dataToParent?: any) {
    if (this.submitValidations(this.metalIssueForm.value)) {
      return
    }
    if (dataToParent) {
      dataToParent.HEADERDETAILS = this.metalIssueForm.value;
    } else {
      dataToParent = [{ HEADERDETAILS: this.metalIssueForm.value }]
    }
    console.log(dataToParent, 'dataToParent to parent');

    const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = dataToParent
    modalRef.result.then((postData) => {
      if (postData) {
        this.setValuesToHeaderGrid(postData);
      }
    });
  }
  setValuesToHeaderGrid(detailDataToParent: any) {
    console.log(detailDataToParent, 'detailDataToParent');
    if (detailDataToParent.SRNO != 0) {
      this.metalIssueDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.metalIssueDetailsData.length + 1
      this.metalIssueDetailsData.push(detailDataToParent);
    }
    this.tableData.push(detailDataToParent)
  }


  stock_codetemp(data: any, value: any) {
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.postData.stockCode;
  }

  removeLineItemsGrid(event: any) {
  }
  editTable(event: any) {
  }

  customizeWeight(data: any) {
    return 'Wt: ' + data['value'];
  }

  customizeQty(data: any) {
  }
  customizeDate(data: any) {
    // return "First: " + new DatePipe("en-US").transform(data.value, 'MMM dd, yyyy');
  }


  SALESPERSON_CODEData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Entered by',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  SALESPERSON_CODESelected(e: any) {
    this.metalIssueForm.controls.SALESPERSON_CODE.setValue(e.SALESPERSON_CODE);
  }

  workerCodeData: MasterSearchModel = {
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

  workerCodeSelected(e: any) {
    console.log(e);
    this.metalIssueForm.controls.worker.setValue(e.WORKER_CODE);
    this.metalIssueForm.controls.workerDes.setValue(e.DESCRIPTION);
  }

  removedata() {
    this.tableData.pop();
  }

  setPostData() {
    let form = this.metalIssueForm.value
    return {
      "MID": this.comService.emptyToZero(form.MID),
      "VOCTYPE": this.comService.nullToString(form.voctype),
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCDATE": this.comService.nullToString(form.vocdate),
      "YEARMONTH": this.comService.nullToString(form.YEARMONTH),
      "DOCTIME": this.comService.nullToString(form.vocdate),
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": this.comService.nullToString(this.metalIssueForm.value.SALESPERSON_CODE),
      "REMARKS": this.metalIssueForm.value.REMARKS || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": this.comService.nullToString(form.vocdate),
      "SYSTEM_DATE": this.comService.nullToString(form.vocdate),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalIssueDetailsData
    }
  }
  submitValidations(form: any) {
    if (form.worker == '') {
      this.comService.toastErrorByMsgId('Worker is required')
      return true
    }
    if (form.vocdate == '') {
      this.comService.toastErrorByMsgId('Worker is required')
      return true
    }
    return false
  }
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.metalIssueForm.value)) {
      return
    }

    let API = 'JobMetalIssueMasterDJ/InsertJobMetalIssueMasterDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalIssueForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('Not saved')
        console.log(err);
      })
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.metalIssueForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let form = this.metalIssueForm.value
    let API = `JobMetalIssueMasterDJ/UpdateJobMetalIssueMasterDJ/${form.BRANCH_CODE}/${form.voctype}/${form.VOCNO}/${form.YEARMONTH}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
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
                this.metalIssueForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.comService.toastErrorByMsgId('Not saved')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('Not saved')
      })
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
        let form = this.metalIssueForm.value
        let API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' + form.BRANCH_CODE + form.voctype + form.VOCNO + form.YEARMONTH
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
                    this.metalIssueForm.reset()
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
                    this.metalIssueForm.reset()
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
