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
  selector: 'app-melting-process-details',
  templateUrl: './melting-process-details.component.html',
  styleUrls: ['./melting-process-details.component.scss']
})
export class MeltingProcessDetailsComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];
  designType: string = 'DIAMOND';
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  metalDetailData: any[] = [];
  vocMaxDate = new Date();
  jobNumberDetailData: any[] = [];
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobNoSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e: any) {
    console.log(e);
    this.meltingprocessdetailsForm.controls.jobno.setValue(e.job_number);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e: any) {
    console.log(e);
    this.meltingprocessdetailsForm.controls.location.setValue(e.LOCATION_CODE);
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
  setAllInitialValues() {
    let dataFromParent = this.content[0].PROCESS_FORMDETAILS
    if (!dataFromParent) return
    this.meltingprocessdetailsForm.controls.jobno.setValue(dataFromParent.jobno)
    this.meltingprocessdetailsForm.controls.jobdes.setValue(dataFromParent.jobdes)
    this.meltingprocessdetailsForm.controls.subjobno.setValue(dataFromParent.subjobno)
    this.meltingprocessdetailsForm.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.meltingprocessdetailsForm.controls.workerFrom.setValue(dataFromParent.workerFrom)
    this.meltingprocessdetailsForm.controls.workerTo.setValue(dataFromParent.workerTo)
    this.meltingprocessdetailsForm.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.meltingprocessdetailsForm.controls.processFrom.setValue(dataFromParent.processFrom)
    this.meltingprocessdetailsForm.controls.processTo.setValue(dataFromParent.processTo)
    this.meltingprocessdetailsForm.controls.MetalPcsFrom.setValue(dataFromParent.MetalPcsFrom)
    this.meltingprocessdetailsForm.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)
    this.meltingprocessdetailsForm.controls.GrossWeightTo.setValue(dataFromParent.GrossWeightTo)
    this.meltingprocessdetailsForm.controls.approvedby.setValue(dataFromParent.approvedby)
    this.meltingprocessdetailsForm.controls.startdate.setValue(dataFromParent.startdate)
    this.meltingprocessdetailsForm.controls.enddate.setValue(dataFromParent.enddate)
    this.meltingprocessdetailsForm.controls.JOB_DATE.setValue(dataFromParent.JOB_DATE)
    this.meltingprocessdetailsForm.controls.DESIGN_CODE.setValue(dataFromParent.DESIGN_CODE)
    this.meltingprocessdetailsForm.controls.SEQ_CODE.setValue(dataFromParent.SEQ_CODE)
    this.meltingprocessdetailsForm.controls.PROCESSDESC.setValue(dataFromParent.PROCESSDESC)
    this.meltingprocessdetailsForm.controls.WORKERDESC.setValue(dataFromParent.WORKERDESC)
    this.meltingprocessdetailsForm.controls.PUREWT.setValue(dataFromParent.PUREWT)
    this.meltingprocessdetailsForm.controls.MetalWeightFrom.setValue(dataFromParent.MetalWeightFrom)
    this.meltingprocessdetailsForm.controls.processToDescription.setValue(dataFromParent.processToDescription)
    this.meltingprocessdetailsForm.controls.workerToDescription.setValue(dataFromParent.workerToDescription)
    this.meltingprocessdetailsForm.controls.PURITY.setValue(dataFromParent.PURITY)
    this.meltingprocessdetailsForm.controls.METALLAB_TYPE.setValue(dataFromParent.METALLAB_TYPE)
    this.meltingprocessdetailsForm.controls.remarks.setValue(dataFromParent.remarks)
    this.meltingprocessdetailsForm.controls.treeno.setValue(dataFromParent.treeno)
    this.meltingprocessdetailsForm.controls.JOB_SO_NUMBER.setValue(dataFromParent.JOB_SO_NUMBER)
    this.meltingprocessdetailsForm.controls.stockCode.setValue(dataFromParent.stockCode)
    this.meltingprocessdetailsForm.controls.DIVCODE.setValue(dataFromParent.DIVCODE)
    this.meltingprocessdetailsForm.controls.METALSTONE.setValue(dataFromParent.METALSTONE)
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingprocessdetailsForm: FormGroup = this.formBuilder.group({
    jobno: [''],
    subjobno: [''],
    subJobDescription: [''],
    jobdes: [''],
    jobpurity: [''],
    process: [''],
    processdes: [''],
    worker: [''],
    workerdes: [''],
    treeno: [''],
    waxweight: [''],
    location: [''],
    stockcode: [''],
    stockcodedes: [''],
    tostockcode: [''],
    grossweight: [''],
    stoneweight: [''],
    pcs: [''],
    netweight: [''],
    purity: [''],
    purityper: [''],
    pureweight: [''],
    purediff: [''],
    remark: [''],
    lossweight: [''],
    lotno: [''],
    barno: [''],
    ticketno: [''],
    tgold: [''],
    sliver: [''],

  });

  formSubmit() {
let dataTOparent = {
  formDetails :this.meltingprocessdetailsForm.value 
  
}
this.close(dataTOparent)

    let API = 'JobMeltingProcessDJ/InsertJobMeltingProcessDJ'
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-11-25T05:04:56.703Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingprocessdetailsForm.value.jobno,
      "JOB_DESCRIPTION": this.meltingprocessdetailsForm.value.jobdes,
      "PROCESS_CODE": this.meltingprocessdetailsForm.value.process,
      "PROCESS_DESC": this.meltingprocessdetailsForm.value.processdes,
      "WORKER_CODE": this.meltingprocessdetailsForm.value.worker,
      "WORKER_DESC": this.meltingprocessdetailsForm.value.workerdes,
      "STOCK_CODE": this.meltingprocessdetailsForm.value.stockcode,
      "STOCK_DESCRIPTION": this.meltingprocessdetailsForm.value.stockcodedes,
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": this.meltingprocessdetailsForm.value.pcs,
      "GROSS_WT": this.meltingprocessdetailsForm.value.grossweight,
      "STONE_WT": this.meltingprocessdetailsForm.value.STONE_WT,
      "PURITY": this.meltingprocessdetailsForm.value.purity,
      "PUREWT": this.meltingprocessdetailsForm.value.pureweight,
      "PUDIFF": this.meltingprocessdetailsForm.value.PUDIFF,
      "IRON_WT": 0,
      "NET_WT": this.meltingprocessdetailsForm.value.netweight,
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingprocessdetailsForm.value.WAX_WT,
      "TREE_NO": this.meltingprocessdetailsForm.value.treeno,
      "WIP_ACCODE": "string",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "REMARKS": this.meltingprocessdetailsForm.value.remark,
      "LOCTYPE_CODE": this.meltingprocessdetailsForm.value.location,
      "TOSTOCKCODE": this.meltingprocessdetailsForm.value.tostockcode,
      "LOSSWT": this.meltingprocessdetailsForm.value.LOSSWT,
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingprocessdetailsForm.value.lotno,
      "BAR_NO": this.meltingprocessdetailsForm.value.barno,
      "TICKET_NO": this.meltingprocessdetailsForm.value.ticketno,
      "SILVER_PURITY": this.meltingprocessdetailsForm.value.SILVER_PURITY,
      "SILVER_PUREWT": 0,
      "TOPURITY": 0,
      "PUR_PER": this.meltingprocessdetailsForm.value.PUR_PER,
      "MELTING_TYPE": "string",
      "ISALLOY": "s",
      "BALANCE_WT": 0,
      "BALANCE_PURE_WT": 0,
      "LOSS_PURE_WT": 0,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string"
    }
    this.close(postData);
   }

  setFormValues() {
  }

  update() {
    if (this.meltingprocessdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondDismantle/UpdateDiamondDismantle' + this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth;
    let postData = {


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
                this.meltingprocessdetailsForm.reset()
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
        let API = 'DiamondDismantle/DeleteDiamondDismantle/' + this.meltingprocessdetailsForm.value.branchCode + this.meltingprocessdetailsForm.value.voctype + this.meltingprocessdetailsForm.value.vocno + this.meltingprocessdetailsForm.value.yearMonth
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
                    this.meltingprocessdetailsForm.reset()
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
                    this.meltingprocessdetailsForm.reset()
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


  formatMetalDetailDataGrid() {
    this.metalDetailData.forEach((element: any) => {
      element.SETTED_FLAG = false
      element.GROSS_WT = this.comService.decimalQuantityFormat(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.comService.decimalQuantityFormat(element.STONE_WT, 'STONE')
      element.PURITY = this.comService.decimalQuantityFormat(element.PURITY, 'PURITY')
    });
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.meltingprocessdetailsForm.value.subjobno,
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
          this.meltingprocessdetailsForm.controls.process.setValue(data[0].PROCESS)
          this.meltingprocessdetailsForm.controls.worker.setValue(data[0].WORKER)
          this.meltingprocessdetailsForm.controls.stockcode.setValue(data[0].STOCK_CODE)
          this.meltingprocessdetailsForm.controls.pureweight.setValue(data[0].PUREWT)
          this.meltingprocessdetailsForm.controls.pcs.setValue(data[0].PCS)
          this.meltingprocessdetailsForm.controls.workerdes.setValue(data[0].WORKERDESC)
          this.meltingprocessdetailsForm.controls.processdes.setValue(data[0].PROCESSDESC)
          this.meltingprocessdetailsForm.controls.grossweight.setValue(data[0].NETWT)
          this.meltingprocessdetailsForm.controls.purity.setValue(data[0].PURITY)
          this.meltingprocessdetailsForm.controls.netweight.setValue(data[0].NETWT)
          this.meltingprocessdetailsForm.controls.MetalWeightFrom.setValue(
            this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
            
          this.meltingprocessdetailsForm.controls.StoneWeight.setValue(data[0].STONE)

          this.meltingprocessdetailsForm.controls.PURITY.setValue(data[0].PURITY)
          this.meltingprocessdetailsForm.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.meltingprocessdetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.stockCodeScrapValidate()
          // this.meltingprocessdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.meltingprocessdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
          // this.meltingprocessdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          // this.meltingprocessdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.meltingprocessdetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.fillStoneDetails()
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
            this.jobNumberDetailData = data
            this.meltingprocessdetailsForm.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.meltingprocessdetailsForm.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)

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

