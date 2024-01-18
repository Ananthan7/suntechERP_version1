import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {

  columnhead1: any[] = ['Div', 'Stock Code','Shape', 'Color', 'Clarity', 'Size', 'Sieve Set', 'Pcs'];
  serialNo : any;
  subJobNo: any;
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
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

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "Process_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneissuedetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subjobnumber: ['', [Validators.required]],
    subjobDes: [''],
    designcode: [''],
    partcode: [''],
    salesorderno: [0],
    process: ['', [Validators.required]],
    processname: [''],
    worker: ['', [Validators.required]],
    workername: [''],
    stock: ['', [Validators.required]],
    stockCode: [''],
    stockDes: [''],
    batchid: [''],
    location: ['', [Validators.required]],
    pieces: [],
    shape: [''],
    clarity: [''],
    carat: [''],
    size: [],
    sieveset: [''],
    unitrate: [],
    sieve: [''],
    sieveDesc: [''],
    amount: [],
    color: [''],
    stockbal: [],
    pointerwt: [],
    otheratt: [],
    remarks: [''],
    consignment:[false],
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
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    // this.srNo= srNo;
    console.log(this.content);
    this.serialNo = this.content;
    
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stoneissuedetailsFrom.controls.jobDes.setValue(e.job_description);
    this.subJobNo=`${e.job_number}/${this.serialNo}`;
    this.stoneissuedetailsFrom.controls.subjobnumber.setValue(this.subJobNo);
    this.stoneissuedetailsFrom.controls.subjobDes.setValue(e.job_description);
    // this.stoneissuedetailsFrom.controls.designcode.setValue(e.job_number);
    // this.stoneissuedetailsFrom.controls.partcode.setValue(e.job_description);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.process.setValue(e.Process_Code);
    this.stoneissuedetailsFrom.controls.processname.setValue(e.Description);
  }

  workerCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneissuedetailsFrom.controls.workername.setValue(e.DESCRIPTION);
  }
  
  stockCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.stock.setValue(e.DIVISION_CODE);
    this.stoneissuedetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stoneissuedetailsFrom.controls.stockDes.setValue(e.DESCRIPTION);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  closed(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen=true;
  }

  jobchange(){  
    this.formSubmit();
  }

  continueClick(){
    this.formSubmit();
    this.stoneissuedetailsFrom.controls.stock.setValue('')
    this.stoneissuedetailsFrom.controls.stockDes.setValue('')
    this.stoneissuedetailsFrom.controls.sieve.setValue('')
    this.stoneissuedetailsFrom.controls.shape.setValue('')
    this.stoneissuedetailsFrom.controls.color.setValue('')
    this.stoneissuedetailsFrom.controls.clarity.setValue('')
    this.stoneissuedetailsFrom.controls.size.setValue('')
    this.stoneissuedetailsFrom.controls.pieces.setValue('')
    this.stoneissuedetailsFrom.controls.process.setValue('')
    this.stoneissuedetailsFrom.controls.processname.setValue('')
    this.stoneissuedetailsFrom.controls.worker.setValue('')
    this.stoneissuedetailsFrom.controls.workername.setValue('')
    this.stoneissuedetailsFrom.controls.location.setValue('')
    this.stoneissuedetailsFrom.controls.consignment.setValue('')
    this.stoneissuedetailsFrom.controls.sieveset.setValue('')
    this.stoneissuedetailsFrom.controls.remarks.setValue('')
    this.stoneissuedetailsFrom.controls.sieveset.setValue('')
    this.stoneissuedetailsFrom.controls.otheratt.setValue('')
    this.stoneissuedetailsFrom.controls.unitrate.setValue('')
    this.stoneissuedetailsFrom.controls.amount.setValue('')
    this.stoneissuedetailsFrom.controls.stockCode.setValue('')
    this.stoneissuedetailsFrom.controls.carat.setValue('')
    this.stoneissuedetailsFrom.controls.batchid.setValue('')
  }

  onchangeCheckBox(e: any){
    if(e == true){    
    return 1;
    }else{ 
    return 0;
    }     
  }


  removedata() {
    this.tableData.pop();
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.stoneissuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = {
      "SRNO": this.serialNo,
      "VOCNO": 0,
      "VOCTYPE": "STI",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobNumber,
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber,
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobDes,
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode,
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock,
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stockDes ,
      "SIEVE": this.stoneissuedetailsFrom.value.sieve,
      "SHAPE": this.stoneissuedetailsFrom.value.shape,
      "COLOR": this.stoneissuedetailsFrom.value.color,
      "CLARITY": this.stoneissuedetailsFrom.value.clarity,
      "SIZE": this.stoneissuedetailsFrom.value.size,
      "JOB_PCS": 0,
      "PCS": this.stoneissuedetailsFrom.value.pieces,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": this.stoneissuedetailsFrom.value.unitrate,
      "AMOUNTLC": this.stoneissuedetailsFrom.value.amount,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process,
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname,
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker,
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername,
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location,
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode,
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "STI",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": this.onchangeCheckBox(this.stoneissuedetailsFrom.value.consignment),
      "SIEVE_SET": this.stoneissuedetailsFrom.value.sieveset,
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": this.stoneissuedetailsFrom.value.remarks,
      "SIEVE_DESC": this.stoneissuedetailsFrom.value.sieveset,
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt,
    }
    // if (postData.reopen=true) {
    //   this.closed(postData);
    // }else{
    //   this.close(postData);
    // }
  //  this.postdata;
    this.closed(postData);
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

    this.stoneissuedetailsFrom.controls.jobnumber.setValue(this.content.JOB_NUMBER)
    this.stoneissuedetailsFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneissuedetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneissuedetailsFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.stoneissuedetailsFrom.controls.stock.setValue(this.content.STOCK_CODE)
    this.stoneissuedetailsFrom.controls.stockDes.setValue(this.content.STOCK_DESCRIPTION)
    this.stoneissuedetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneissuedetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneissuedetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneissuedetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneissuedetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneissuedetailsFrom.controls.pieces.setValue(this.content.PCS)
    this.stoneissuedetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneissuedetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneissuedetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissuedetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissuedetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.stoneissuedetailsFrom.controls.consignment.setValue(this.content.CONSIGNMENT)
    this.stoneissuedetailsFrom.controls.sieveset.setValue(this.content.SIEVE_SET)
    this.stoneissuedetailsFrom.controls.remarks.setValue(this.content.D_REMARKS)
    this.stoneissuedetailsFrom.controls.sieveset.setValue(this.content.SIEVE_DESC)
    this.stoneissuedetailsFrom.controls.otheratt.setValue(this.content.OTHER_ATTR)
    this.stoneissuedetailsFrom.controls.unitrate.setValue(this.content.AMOUNTFC)
    this.stoneissuedetailsFrom.controls.amount.setValue(this.content.AMOUNTLC)
  }


  update() {
    if (this.stoneissuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/' + this.stoneissuedetailsFrom.value.branchCode + this.stoneissuedetailsFrom.value.yearMonth
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "STI",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobnumber,
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber ,
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobdes,
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode,
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock,
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stockDes ,
      "SIEVE": this.stoneissuedetailsFrom.value.sieve,
      "SHAPE": this.stoneissuedetailsFrom.value.shape,
      "COLOR": this.stoneissuedetailsFrom.value.color,
      "CLARITY": this.stoneissuedetailsFrom.value.clarity,
      "SIZE": this.stoneissuedetailsFrom.value.size,
      "JOB_PCS": 0,
      "PCS": this.stoneissuedetailsFrom.value.pieces,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": this.stoneissuedetailsFrom.value.unitrate,
      "AMOUNTLC": this.stoneissuedetailsFrom.value.amount,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process,
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname,
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker,
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername,
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location,
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode,
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "STI",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": this.stoneissuedetailsFrom.value.consignment,
      "SIEVE_SET": this.stoneissuedetailsFrom.value.sieveset,
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": this.stoneissuedetailsFrom.value.remarks,
      "SIEVE_DESC": this.stoneissuedetailsFrom.value.sieveset,
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt,
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
                this.stoneissuedetailsFrom.reset()
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.stoneissuedetailsFrom.value.branchCode + this.stoneissuedetailsFrom.value.yearMonth
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
                    this.stoneissuedetailsFrom.reset()
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
                    this.stoneissuedetailsFrom.reset()
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
