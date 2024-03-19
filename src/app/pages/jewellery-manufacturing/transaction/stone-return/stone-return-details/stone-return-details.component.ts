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
  @Input() data!: any;
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  jobDate = new Date();
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  
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
    console.log(this.content,'content')
    console.log(this.content.FLAG, 'viewMode is true');


    this.setFormValues()
    if (this.content) {
      this.stonereturndetailsFrom.controls.FLAG.setValue(this.content[0].FLAG)
    }
    if (this.content[0].FLAG == 'VIEW') {
      this.viewMode = true;
    }
  }
  

  subJobNoCodeSelected(e:any){
    console.log(e);
    this.stonereturndetailsFrom.controls.subjobno.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(e.job_description);
    this.stonereturndetailsFrom.controls.jobno.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.jobDesc.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
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
    location: [''],
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
    vocType: [''],
    FLAG: [null]
  });
  setFormValues() {
    console.log(this.content,'formfunction')
    if (!this.content) return
    this.stonereturndetailsFrom.controls.jobno.setValue(this.content[0].JOB_NUMBER)
    this.stonereturndetailsFrom.controls.jobDesc.setValue(this.content[0].JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.subjobno.setValue(this.content[0].UNQ_JOB_ID)
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(this.content[0].JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.designcode.setValue(this.content[0].DESIGN_CODE)
    this.stonereturndetailsFrom.controls.salesorderno.setValue(this.content[0].PROCESS_NAME)
    this.stonereturndetailsFrom.controls.process.setValue(this.content[0].PROCESS_CODE)
    this.stonereturndetailsFrom.controls.processname.setValue(this.content[0].PROCESS_NAME)
    this.stonereturndetailsFrom.controls.worker.setValue(this.content[0].WORKER_CODE)
    this.stonereturndetailsFrom.controls.workername.setValue(this.content[0].WORKER_NAME)
    this.stonereturndetailsFrom.controls.stock.setValue(this.content[0].STOCK_CODE)
    this.stonereturndetailsFrom.controls.stockdes.setValue(this.content[0].STOCK_DESCRIPTION)
    this.stonereturndetailsFrom.controls.sieveset.setValue(this.content[0].SIEVE_SET)
    this.stonereturndetailsFrom.controls.broken.setValue(this.content.JOB_SO_NUMBER)
    this.stonereturndetailsFrom.controls.pieces.setValue(this.content[0].PCS)
    this.stonereturndetailsFrom.controls.size.setValue(this.content[0].SIZE)
    this.stonereturndetailsFrom.controls.sieve.setValue(this.content[0].SIEVE)
    this.stonereturndetailsFrom.controls.color.setValue(this.content[0].COLOR)
    this.stonereturndetailsFrom.controls.clarity.setValue(this.content[0].CLARITY)
   
  };


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
console.log()
    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "STR",
      "VOCDATE": "2023-10-19T06:15:23.037Z",
      "JOB_NUMBER": this.stonereturndetailsFrom.value.jobno || "",
      "JOB_DATE": "2024-03-13T11:33:38.290Z",
      "JOB_SO_NUMBER": this.comService.emptyToZero(this.stonereturndetailsFrom.value.subjobno) || "",
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": this.stonereturndetailsFrom.value.jobDesc,
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
      "DT_VOCTYPE": "STR",
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
  //   let postData = {
  //     "SRNO": 0,
  //     "VOCNO": 0,
  //     "VOCTYPE": "",
  //     "VOCDATE": "2023-10-19T06:15:23.037Z",
  //     "JOB_NUMBER": this.stonereturndetailsFrom.value.jobno || "",
  //     "JOB_DATE": this.stonereturndetailsFrom.value.jobDate || "",
  //     "JOB_SO_NUMBER": this.stonereturndetailsFrom.value.subjobno || "0",
  //     "UNQ_JOB_ID": "",
  //     "JOB_DESCRIPTION": "",
  //     "BRANCH_CODE": this.branchCode,
  //     "DESIGN_CODE": this.stonereturndetailsFrom.value.designcode || "",
  //     "DIVCODE": "",
  //     "STOCK_CODE": this.stonereturndetailsFrom.value.stock || "",
  //     "STOCK_DESCRIPTION": this.stonereturndetailsFrom.value.stockdes || "",
  //     "SIEVE": this.stonereturndetailsFrom.value.sieve || "",
  //     "SHAPE": this.stonereturndetailsFrom.value.shape || "",
  //     "COLOR": this.stonereturndetailsFrom.value.color || "",
  //     "CLARITY": this.stonereturndetailsFrom.value.clarity || "",
  //     "SIZE": this.stonereturndetailsFrom.value.size || "",
  //     "PCS": 0,
  //     "GROSS_WT": 0,
  //     "CURRENCY_CODE": "",
  //     "CURRENCY_RATE": 0,
  //     "RATEFC": 0,
  //     "RATELC": 0,
  //     "AMOUNTFC": 0,
  //     "AMOUNTLC": 0,
  //     "PROCESS_CODE": this.stonereturndetailsFrom.value.process || "",
  //     "PROCESS_NAME": this.stonereturndetailsFrom.value.processname || "",
  //     "WORKER_CODE": this.stonereturndetailsFrom.value.worker || "",
  //     "WORKER_NAME": this.stonereturndetailsFrom.value.workername || "",
  //     "UNQ_DESIGN_ID": "",
  //     "WIP_ACCODE": "",
  //     "UNIQUEID": 0,
  //     "LOCTYPE_CODE":this.stonereturndetailsFrom.value.location || "",
  //     "STOCK_CODE_BRK": "",
  //     "WASTAGE_QTY": 0,
  //     "WASTAGE_PER": 0,
  //     "WASTAGE_AMT": 0,
  //     "NAVSEQNO": 0,
  //     "YEARMONTH": "",
  //     "DOCTIME": "2023-10-19T06:15:23.037Z",
  //     "SMAN": "",
  //     "REMARKS": "",
  //     "TOTAL_PCS": 0,
  //     "TOTAL_GROSS_WT": 0,
  //     "TOTAL_AMOUNTFC": 0,
  //     "TOTAL_AMOUNTLC": 0,
  //     "ISBROCKEN": 0,
  //     "BASE_CONV_RATE": 0,
  //     "DT_BRANCH_CODE": "",
  //     "DT_VOCTYPE": "",
  //     "DT_VOCNO": 0,
  //     "DT_YEARMONTH": this.yearMonth,
  //     "RET_TO_DESC": "",
  //     "PICTURE_NAME": "",
  //     "RET_TO": "",
  //     "ISMISSING": 0,
  //     "SIEVE_SET":  this.stonereturndetailsFrom.value.sieveset || "",
  //     "SUB_STOCK_CODE": ""
  //   }

  //   let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
  //     .subscribe((result) => {
  //       if (result.response) {
  //         if (result.status == "Success") {
  //           Swal.fire({
  //             title: result.message || 'Success',
  //             text: '',
  //             icon: 'success',
  //             confirmButtonColor: '#336699',
  //             confirmButtonText: 'Ok'
  //           }).then((result: any) => {
  //             if (result.value) {
  //               this.stonereturndetailsFrom.reset()
  //               this.tableData = []
  //               this.close('reloadMainGrid')
  //             }
  //           });
  //         }
  //       } else {
  //         this.toastr.error('Not saved')
  //       }
  //     }, err => alert(err))
  //   this.subscriptions.push(Sub)
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

subJobNumberValidate(event?: any) {
  let postData = {
    "SPID": "040",
    "parameter": {
      'strUNQ_JOB_ID': this.stonereturndetailsFrom.value.subjobno,
      'strBranchCode': this.comService.nullToString(this.branchCode),
      'strCurrenctUser': ''
    }
  }

  this.comService.showSnackBarMsg('MSG81447')
  let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result) => {
      console.log(postData, 'uuu')
      this.comService.closeSnackBarMsg()
      if (result.dynamicData && result.dynamicData[0].length > 0) {
        let data = result.dynamicData[0]
        this.stonereturndetailsFrom.controls.process.setValue(data[0].PROCESS)
        this.stonereturndetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
        this.stonereturndetailsFrom.controls.worker.setValue(data[0].WORKER)
        this.stonereturndetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
        this.stonereturndetailsFrom.controls.stock.setValue(data[0].STOCK_CODE)
        this.stonereturndetailsFrom.controls.stockdes.setValue(data[0].STOCK_DESCRIPTION)
        this.stonereturndetailsFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
        this.stonereturndetailsFrom.controls.batchid.setValue(data[0].WORKERDESC)
        this.stonereturndetailsFrom.controls.broken.setValue(data[0].PROCESSDESC)
        this.stonereturndetailsFrom.controls.location.setValue(data[0].LOCTYPE_CODE)
        this.stonereturndetailsFrom.controls.pieces.setValue(data[0].pieces)
        this.stonereturndetailsFrom.controls.size.setValue(data[0].SIZE)
        this.stonereturndetailsFrom.controls.sieve.setValue(data[0].SIEVE)
        this.stonereturndetailsFrom.controls.carat.setValue(data[0].KARAT_CODE)
        this.stonereturndetailsFrom.controls.color.setValue(data[0].COLOR)
        this.stonereturndetailsFrom.controls.unitrate.setValue(data[0].unitrate)
        this.stonereturndetailsFrom.controls.shape.setValue(data[0].SHAPE)
        this.stonereturndetailsFrom.controls.sieveset.setValue(data[0].SIEVE_SET)
        this.stonereturndetailsFrom.controls.amount.setValue(data[0].AMOUNTFC)
        this.stonereturndetailsFrom.controls.pointerwt.setValue(data[0].pointerwt)

      } else {
        this.comService.toastErrorByMsgId('MSG1747')
      }
    }, err => {
      this.comService.closeSnackBarMsg()
      this.comService.toastErrorByMsgId('MSG1531')
    })
  this.subscriptions.push(Sub)
}
jobNumberValidate(event: any) {
  if (event.target.value == '') return
  let postData = {
    "SPID": "028",
    "parameter": {
      'strBranchCode': this.comService.nullToString(this.branchCode),
      'strJobNumber': this.comService.nullToString(event.target.value),
      'strCurrenctUser': this.comService.nullToString(this.userName)
    }
  }

  this.comService.showSnackBarMsg('MSG81447')
  let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result) => {
      this.comService.closeSnackBarMsg()
      if (result.status == "Success" && result.dynamicData[0]) {
        let data = result.dynamicData[0]
        if (data[0] && data[0].UNQ_JOB_ID != '') {
          console.log(data, 'pppp')
          this.jobNumberDetailData = data
          this.stonereturndetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
          this.stonereturndetailsFrom.controls.subjobDesc.setValue(data[0].JOB_DESCRIPTION)


          this.subJobNumberValidate()
        } else {
          this.comService.toastErrorByMsgId('MSG1531')
          return
        }
      } else {
        this.comService.toastErrorByMsgId('MSG1747')
      }
    }, err => {
      this.comService.closeSnackBarMsg()
      this.comService.toastErrorByMsgId('MSG1531')
    })
  this.subscriptions.push(Sub)
}

}
