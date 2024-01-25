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
  selector: 'app-stone-return-details',
  templateUrl: './stone-return-details.component.html',
  styleUrls: ['./stone-return-details.component.scss']
})
export class StoneReturnDetailsComponent implements OnInit {

  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  jobDate = new Date();
  
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
  }
  subJobNoCodeData: MasterSearchModel = {
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
  subJobNoCodeSelected(e:any){
    console.log(e);
    this.stonereturndetailsFrom.controls.subJobNo.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.subJobNoDes.setValue(e.job_description);
    this.stonereturndetailsFrom.controls.jobno.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.jobDesc.setValue(e.job_description);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }




  stonereturndetailsFrom: FormGroup = this.formBuilder.group({
    jobno: ['',[Validators.required]],
    jobDesc: ['',[Validators.required]],
    subjobno: [''],
    subjobDesc : [''],
    designcode: [''],
    salesorderno: [''],
    process: ['',[Validators.required]],
    processname: [''],
    worker: ['',[Validators.required]],
    workername: [''],
    stock: ['',[Validators.required]],
    stockdes: [''],
    batchid: [''],
    broken: [''],
    location: ['',[Validators.required]],
    pieces: [''],
    size: [''],
    sieve: [''],
    carat: [''],
    color: [''],
    clarity: [''],
    unitrate: [''],
    shape: [''],
    sieveset: ['',[Validators.required]],
    amount: [''],
    pointerwt: [''],
  });



  removedata() {
    this.tableData.pop();
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.stonereturndetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "DM3",
      "VOCDATE": "2023-10-19T06:15:23.037Z",
      "JOB_NUMBER": this.stonereturndetailsFrom.value.jobno || "",
      "JOB_DATE": this.stonereturndetailsFrom.value.jobDate || "",
      "JOB_SO_NUMBER": this.stonereturndetailsFrom.value.subjobno || "",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stonereturndetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stonereturndetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stonereturndetailsFrom.value.stockdes || "",
      "SIEVE": this.stonereturndetailsFrom.value.sieve || "",
      "SHAPE": this.stonereturndetailsFrom.value.shape || "",
      "COLOR": this.stonereturndetailsFrom.value.color || "",
      "CLARITY": this.stonereturndetailsFrom.value.clarity || "",
      "SIZE": this.stonereturndetailsFrom.value.size || "",
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stonereturndetailsFrom.value.process || "",
      "PROCESS_NAME": this.stonereturndetailsFrom.value.processname || "",
      "WORKER_CODE": this.stonereturndetailsFrom.value.worker || "",
      "WORKER_NAME": this.stonereturndetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE":this.stonereturndetailsFrom.value.location || "",
      "STOCK_CODE_BRK": "",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "NAVSEQNO": 0,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "06:15:23",
      "SMAN": "",
      "REMARKS": "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "ISBROCKEN": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "QWA",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "RET_TO_DESC": "",
      "PICTURE_NAME": "",
      "RET_TO": "",
      "ISMISSING": 0,
      "SIEVE_SET":  this.stonereturndetailsFrom.value.sieveset || "0",
      "SUB_STOCK_CODE": "0"
    }
    this.close(postData);
  }

  


  update() {
    if (this.stonereturndetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobStoneReturnMasterDJ/UpdateJobStoneReturnMasterDJ/' + this.stonereturndetailsFrom.value.branchCode + this.stonereturndetailsFrom.value.voctype + this.stonereturndetailsFrom.value.vocno + this.stonereturndetailsFrom.value.yearMonth
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "",
      "VOCDATE": "2023-10-19T06:15:23.037Z",
      "JOB_NUMBER": this.stonereturndetailsFrom.value.jobno || "",
      "JOB_DATE": this.stonereturndetailsFrom.value.jobDate || "",
      "JOB_SO_NUMBER": this.stonereturndetailsFrom.value.subjobno || "0",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stonereturndetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stonereturndetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stonereturndetailsFrom.value.stockdes || "",
      "SIEVE": this.stonereturndetailsFrom.value.sieve || "",
      "SHAPE": this.stonereturndetailsFrom.value.shape || "",
      "COLOR": this.stonereturndetailsFrom.value.color || "",
      "CLARITY": this.stonereturndetailsFrom.value.clarity || "",
      "SIZE": this.stonereturndetailsFrom.value.size || "",
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stonereturndetailsFrom.value.process || "",
      "PROCESS_NAME": this.stonereturndetailsFrom.value.processname || "",
      "WORKER_CODE": this.stonereturndetailsFrom.value.worker || "",
      "WORKER_NAME": this.stonereturndetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE":this.stonereturndetailsFrom.value.location || "",
      "STOCK_CODE_BRK": "",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "NAVSEQNO": 0,
      "YEARMONTH": "",
      "DOCTIME": "2023-10-19T06:15:23.037Z",
      "SMAN": "",
      "REMARKS": "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "ISBROCKEN": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "RET_TO_DESC": "",
      "PICTURE_NAME": "",
      "RET_TO": "",
      "ISMISSING": 0,
      "SIEVE_SET":  this.stonereturndetailsFrom.value.sieveset || "",
      "SUB_STOCK_CODE": ""
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
                this.stonereturndetailsFrom.reset()
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
        let API = 'JobStoneReturnMasterDJ/DeleteJobStoneReturnMasterDJ/' + this.stonereturndetailsFrom.value.branchCode + this.stonereturndetailsFrom.value.voctype + this.stonereturndetailsFrom.value.vocno + this.stonereturndetailsFrom.value.yearMonth
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
                    this.stonereturndetailsFrom.reset()
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
                    this.stonereturndetailsFrom.reset()
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
