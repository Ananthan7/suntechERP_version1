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
    { title: 'Carat', field: 'GROSS_WT' },
    { title: 'Process', field: 'PROCESS_CODE' },
    { title: 'Worker', field: 'WORKER_CODE' },
    { title: 'Amount.', field: 'AMOUNTFC' },];
  metalIssueDetailsData: any[] = [];
  @Input() content!: any;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  srNo: any = 0;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  viewOnly: boolean = false;
  selectedIndexes: any = [];
  getdata!: any[];
  private subscriptions: Subscription[] = [];
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = []
  viewMode: boolean = false;

  metalIssueForm: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    time: [new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()],
    vocdate: ['', [Validators.required]],
    enteredBy: [''],
    vocno: [1],
    worker: [''],
    workerDes: [''],
    remarks: [''],
    FLAG: [null]
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
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

    this.setvalues()
    this.setAllInitialValues()
    if(this.content?.FLAG){
      this.metalIssueForm.controls.FLAG.setValue(this.content.FLAG)
    }
       if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      }
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  deleteClicked(): void {
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.metalIssueDetailsData.splice(element - 1, 1)
    })
  }
  openaddmetalissue(data?: any) {
    console.log(data)
    if (data) {
      data[0] = this.metalIssueForm.value;
    } else {
      data = [{ HEADERDETAILS: this.metalIssueForm.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    console.log(data,'data')
    modalRef.componentInstance.content = data
    modalRef.result.then((postData) => {
     
      if (postData) {
     
        console.log('Data from modal:', postData);
        this.metalIssueDetailsData.push(postData);
        console.log(this.metalIssueDetailsData);
        this.setValuesToHeaderGrid(postData);

      }
    });
  }
  onRowClickHandler(event: any) {

    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    this.openaddmetalissue(selectedData)
    console.log(selectedData)
    console.log("fired.")
    console.log(this.selectRowIndex, event);

  }



  setValuesToHeaderGrid(detailDataToParent: any) {


    if (detailDataToParent.SRNO) {
      this.swapObjects(this.metalIssueDetailsData, [detailDataToParent], (detailDataToParent.SRNO - 1))
    } else {
      this.tableRowCount += 1
      detailDataToParent.SRNO = this.tableRowCount
    }

    this.tableData.push(detailDataToParent)

    if (detailDataToParent) {
      this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
    }
    //  this.getSequenceDetailData(PROCESS_FORMDETAILS);

  }
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }

  // openaddmetalissue() {
  //   this.srNo= this.srNo+1;
  //   const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
  //     size: 'xl',
  //     backdrop: true,//'static'
  //     keyboard: false,
  //     windowClass: 'modal-full-width',
  //   });
  //   modalRef.result.then((postData) => {
  //     console.log(postData);      
  //     if (postData) {
  //       console.log('Data from modal:', postData);    
  //       if (postData.reopen= true) {
  //         this.openaddmetalissue();    
  //       }   
  //       this.metalIssueDetailsData.push(postData);
  //     }
  //   });
  //   modalRef.componentInstance.data = this.metalIssueDetailsData;
  // }



  stock_codetemp(data: any, value: any) {
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.postData.stockCode;
  }

  // deleteTableData(): void{
  //   this.tableRowCount = 0;
  //   console.log(this.selectRowIndex)
  //   this.tableData.splice(this.selectRowIndex, 1) 
  // }

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


  enteredByCodeData: MasterSearchModel = {
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

  enteredByCodeSelected(e: any) {
    console.log(e);
    this.metalIssueForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
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


  onSelectionChanged(event: any) {


    this.selectedKey = event.selectedRowKeys;
    console.log(this.selectedKey, 'srno')
    let indexes: Number[] = [];
    this.metalIssueDetailsData.reduce((acc, value, index) => {
      if (this.selectedKey.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMetalIssueMasterDJ/GetJobMetalIssueMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.metalIssueDetailsData = data.Details
          data.Details.forEach((element: any) => {
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
          this.metalIssueForm.controls.voctype.setValue(data.VOCTYPE)
          this.metalIssueForm.controls.vocno.setValue(data.VOCNO)
          this.metalIssueForm.controls.vocdate.setValue(data.VOCDATE)
          this.metalIssueForm.controls.worker.setValue(data.Details[0].WORKER_CODE)
          this.metalIssueForm.controls.workerDes.setValue(data.Details[0].WORKER_NAME)
          


        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }



  setvalues() {
    this.metalIssueForm.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.metalIssueForm.controls.vocdate.setValue(this.comService.currentDate)
  }

  removedata() {
    this.tableData.pop();
  }


  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.metalIssueForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalIssueMasterDJ/InsertJobMetalIssueMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.metalIssueForm.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.metalIssueForm.value.VOCNO,
      "VOCDATE": this.metalIssueForm.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-02-23T14:21:27.753Z",
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
      "SMAN": "string",
      "REMARKS": this.metalIssueForm.value.remarks || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": "2023-10-20T11:14:53.662Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalIssueDetailsData
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
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
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content, 'qqq');

    this.metalIssueForm.controls.voctype.setValue(this.content.VOCTYPE)
    this.metalIssueForm.controls.vocno.setValue(this.content.VOCNO)
    this.metalIssueForm.controls.vocdate.setValue(this.content.VOCDATE)
    this.metalIssueForm.controls.time.setValue(this.content.DOCTIME)
    this.metalIssueForm.controls.remarks.setValue(this.content.REMARKS)
  }


  update() {
    if (this.metalIssueForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = `JobMetalIssueMasterDJ/UpdateJobMetalIssueMasterDJ/${this.branchCode}/${this.metalIssueForm.value.voctype}/${this.metalIssueForm.value.vocno}/${this.commonService.yearSelected}`
    let postData = {
      "MID": 0,
      "VOCTYPE": this.metalIssueForm.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.metalIssueForm.value.vocno || "",
      "VOCDATE": this.metalIssueForm.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2024-02-27T05:14:20.276Z",
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
      "SMAN": "",
      "REMARKS": this.metalIssueForm.value.remarks || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": "2023-10-20T11:14:53.662Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.metalIssueDetailsData
    }

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
                this.metalIssueForm.reset()
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
        let API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' + this.metalIssueForm.value.branchCode + this.metalIssueForm.value.voctype + this.metalIssueForm.value.vocno + this.metalIssueForm.value.yearMonth
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
