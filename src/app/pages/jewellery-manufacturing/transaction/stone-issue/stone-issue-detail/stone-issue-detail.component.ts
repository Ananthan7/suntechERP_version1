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

  columnhead1: any[] = ['Div', 'Stock Code', 'Shape', 'Color', 'Clarity', 'Size', 'Sieve Set', 'Pcs'];
  metalDetailData: any[] = [];
  designType: string = 'DIAMOND';
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
    LOOKUPID: 20,
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

    /**USE: jobnumber validate API call */
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
              // this.stoneIssueData = data
              this.stoneissuedetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
              this.stoneissuedetailsFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
              this.stoneissuedetailsFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)
              this.stoneissuedetailsFrom.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
              this.stoneissuedetailsFrom.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
              this.stoneissuedetailsFrom.controls.PROCESSDESC.setValue(data[0].PROCESSDESC)
              this.stoneissuedetailsFrom.controls.WORKERDESC.setValue(data[0].WORKERDESC)
              this.stoneissuedetailsFrom.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
              if(data[0].DESIGN_TYPE != '' && (data[0].DESIGN_TYPE).toUpperCase() == 'METAL') this.designType = 'METAL';
  
              this.stoneissuedetailsFrom.controls.DESIGN_TYPE.setValue(this.designType)
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
  
    /**USE: subjobnumber validate API call subjobvalidate  '156516/4/01'*/
    subJobNumberValidate(event?: any) {
      let postData = {
        "SPID": "040",
        "parameter": {
          'strUNQ_JOB_ID': this.stoneissuedetailsFrom.value.subjobno,
          'strBranchCode': this.comService.nullToString(this.branchCode),
          'strCurrenctUser': ''
        }
      }
      this.comService.showSnackBarMsg('MSG81447')
      let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
        .subscribe((result) => {
          this.comService.closeSnackBarMsg()
          if (result.dynamicData && result.dynamicData[0].length > 0) {
            let data = result.dynamicData[0]
            this.stoneissuedetailsFrom.controls.processFrom.setValue(data[0].PROCESS)
            this.stoneissuedetailsFrom.controls.workerFrom.setValue(data[0].WORKER)
            this.stoneissuedetailsFrom.controls.MetalWeightFrom.setValue(
            this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
            this.stoneissuedetailsFrom.controls.MetalPcsFrom.setValue(data[0].PCS)
            this.stoneissuedetailsFrom.controls.GrossWeightFrom.setValue(data[0].NETWT)
            this.stoneissuedetailsFrom.controls.StoneWeightFrom.setValue(data[0].STONE)
            this.stoneissuedetailsFrom.controls.PUREWT.setValue(data[0].PUREWT)
            this.stoneissuedetailsFrom.controls.PURITY.setValue(data[0].PURITY)
            this.stoneissuedetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
            this.stoneissuedetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
            this.stockCodeScrapValidate()
            this.stoneissuedetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
            this.stoneissuedetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
            this.stoneissuedetailsFrom.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
            this.stoneissuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
            this.stoneissuedetailsFrom.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
            this.fillStoneDetails()
          } else {
            this.comService.toastErrorByMsgId('MSG1747')
          }
        }, err => {
          this.comService.closeSnackBarMsg()
          this.comService.toastErrorByMsgId('MSG1531')
        })
      this.subscriptions.push(Sub)
    }
    //stockCode Scrap Validate
    stockCodeScrapValidate(){
      if(this.comService.nullToString(this.stoneissuedetailsFrom.value.stockCode == '')) return
      let postData = {
        "SPID": "044",
        "parameter": {
          'STRSTOCKCODE': this.comService.nullToString(this.stoneissuedetailsFrom.value.stockCode)
        }
      }
      let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
        .subscribe((result) => {
          this.comService.closeSnackBarMsg()
          if (result.dynamicData && result.dynamicData[0].length > 0) {
            let data = result.dynamicData[0]
            this.stoneissuedetailsFrom.controls.MAIN_STOCK_CODE.setValue(data[0].MAIN_STOCK_CODE)
            this.stoneissuedetailsFrom.controls.SCRAP_PURITY.setValue(data[0].PURITY)
            
          } else {
            this.comService.toastErrorByMsgId('MSG1747')
          }
        }, err => {
          this.comService.closeSnackBarMsg()
          this.comService.toastErrorByMsgId('MSG1531')
        })
      this.subscriptions.push(Sub)
    }
    /**USE: fillStoneDetails grid data */
    private fillStoneDetails():void {
      let postData = {
        "SPID": "042",
        "parameter": {
          strJobNumber: this.stoneissuedetailsFrom.value.jobno,
          strUnq_Job_Id: this.stoneissuedetailsFrom.value.subjobno,             
          strProcess_Code: this.stoneissuedetailsFrom.value.processFrom,
          strWorker_Code: this.stoneissuedetailsFrom.value.workerFrom,
          strBranch_Code: this.branchCode
        }
      }
      this.comService.showSnackBarMsg('MSG81447')
      let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
        .subscribe((result) => {
          this.comService.closeSnackBarMsg()
          if (result.status == "Success" && result.dynamicData[0]) {
            let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
            if (data) {
              this.metalDetailData = data
              this.formatMetalDetailDataGrid()
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
    formatMetalDetailDataGrid(){
      this.metalDetailData.forEach((element:any) => {
        element.SETTED_FLAG = false
        element.GROSS_WT = this.comService.decimalQuantityFormat(element.GROSS_WT,'METAL')
        element.STONE_WT = this.comService.decimalQuantityFormat(element.STONE_WT,'STONE')
        element.PURITY = this.comService.decimalQuantityFormat(element.PURITY,'PURITY')
      });
    }

  locationCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stoneissuedetailsFrom.controls.jobDes.setValue(e.job_description);
    this.stoneissuedetailsFrom.controls.subjobnumber.setValue(e.job_number);
    this.stoneissuedetailsFrom.controls.subjobDes.setValue(e.job_description);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.process.setValue(e.Process_Code);
    this.stoneissuedetailsFrom.controls.processname.setValue(e.Description);
  }

  workerCodeSelected(e: any) {
    console.log(e);
    this.stoneissuedetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneissuedetailsFrom.controls.workername.setValue(e.WORKER_CODE);
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




  stoneissuedetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: [''],
    jobDes: [''],
    subjobnumber: [''],
    subjobDes: [''],
    designcode: [''],
    partcode: [''],
    salesorderno: [''],
    process: [''],
    processname: [''],
    worker: [''],
    workername: [''],
    stock: [''],
    stockCode: [''],
    stockDes: [''],
    batchid: [''],
    location: [''],
    pieces: [''],
    shape: [''],
    clarity: [''],
    karat: [''],
    size: [''],
    sieveset: [''],
    unitrate: [''],
    sieve: [''],
    amount: [''],
    color: [''],
    stockbal: [''],
    pointerwt: [''],
    otheratt: [''],
    remarks: [''],
  });


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
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "JWA",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobnumber || "",
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber || "",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobdes || "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stock || "",
      "SIEVE": this.stoneissuedetailsFrom.value.sieve || "",
      "SHAPE": this.stoneissuedetailsFrom.value.shape || "",
      "COLOR": this.stoneissuedetailsFrom.value.color || "",
      "CLARITY": this.stoneissuedetailsFrom.value.clarity || "",
      "SIZE": this.stoneissuedetailsFrom.value.size || "",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process || "",
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname || "",
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker || "",
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location || "",
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode || "",
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "Str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": 0,
      "SIEVE_SET": "0",
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": "Str",
      "SIEVE_DESC": "0",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt || "",
    }

    this.close(postData);
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

    this.stoneissuedetailsFrom.controls.jobnumber.setValue(this.content.JOB_NUMBER)
    this.stoneissuedetailsFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneissuedetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneissuedetailsFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.stoneissuedetailsFrom.controls.partcode.setValue(this.content.PART_CODE)
    this.stoneissuedetailsFrom.controls.salesorderno.setValue(this.content.WORKER_CODE)
    this.stoneissuedetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneissuedetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneissuedetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissuedetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissuedetailsFrom.controls.stock.setValue(this.content.STOCK_CODE)
    this.stoneissuedetailsFrom.controls.batchid.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.stoneissuedetailsFrom.controls.pieces.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneissuedetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneissuedetailsFrom.controls.karat.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneissuedetailsFrom.controls.sieveset.setValue(this.content.SIEVE_SET)
    this.stoneissuedetailsFrom.controls.unitrate.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneissuedetailsFrom.controls.amount.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneissuedetailsFrom.controls.stockbal.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.pointerwt.setValue(this.content.REMARKS)
    this.stoneissuedetailsFrom.controls.otheratt.setValue(this.content.OTHER_ATTR)
    this.stoneissuedetailsFrom.controls.remarks.setValue(this.content.REMARKS)
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
      "VOCTYPE": "str",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": this.stoneissuedetailsFrom.value.jobnumber || "",
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": this.stoneissuedetailsFrom.value.subjobnumber || "",
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": this.stoneissuedetailsFrom.value.jobdes || "",
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": this.stoneissuedetailsFrom.value.designcode || "",
      "DIVCODE": "",
      "STOCK_CODE": this.stoneissuedetailsFrom.value.stock || "",
      "STOCK_DESCRIPTION": this.stoneissuedetailsFrom.value.stock || "",
      "SIEVE": this.stoneissuedetailsFrom.value.sieve || "",
      "SHAPE": this.stoneissuedetailsFrom.value.shape || "",
      "COLOR": this.stoneissuedetailsFrom.value.color || "",
      "CLARITY": this.stoneissuedetailsFrom.value.clarity || "",
      "SIZE": this.stoneissuedetailsFrom.value.size || "",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.stoneissuedetailsFrom.value.process || "",
      "PROCESS_NAME": this.stoneissuedetailsFrom.value.processname || "",
      "WORKER_CODE": this.stoneissuedetailsFrom.value.worker || "",
      "WORKER_NAME": this.stoneissuedetailsFrom.value.workername || "",
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.stoneissuedetailsFrom.value.location || "",
      "PICTURE_NAME": "",
      "PART_CODE": this.stoneissuedetailsFrom.value.partcode || "",
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "QWA",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": 0,
      "SIEVE_SET": "0",
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": "Str",
      "SIEVE_DESC": "0",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissuedetailsFrom.value.otheratt || "",
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
