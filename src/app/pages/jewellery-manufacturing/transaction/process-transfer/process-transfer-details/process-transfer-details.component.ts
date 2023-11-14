import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @Input() content!: any;

  divisionMS: any = 'ID';
  tableData: any[] = [];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Metal';
  private subscriptions: Subscription[] = [];

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

  processTransferdetailsForm: FormGroup = this.formBuilder.group({
    jobno: [''],
    jobdes: [''],
    subjobno: [''],
    subJobDescription: [''],
    approvedby: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    stdtime: [''],
    timetaken: [''],
    consumed: [''],
    variance: [''],
    treeno: [''],
    remarks: [''],
    toggleSwitchtIssue: [false],
    processFrom: [''],
    processTo: [''],
    workerFrom: [''],
    workerTo: [''],
    MetalPcsFrom: [''],
    MetalPcsTo: [''],
    MetalWeightFrom: [''],
    MetalWeightTo: [''],
    FromJobPcs: [''],
    FromJobPcsTo: [''],
    GrossWeightFrom: [''],
    GrossWeightTo: [''],
    Balance_WT: [''],
    stockCode: [''],
    quantity: [''],
    location: [''],
    stdLoss: [''],
    stdLossper: [''],
    StonePcsFrom: [''],
    StonePcsTo: [''],
    StoneWeighFrom: [''],
    StoneWeightTo: [''],
    designCode: [''],
    partCode: [''],
  });
  columnheader: any[] = ['Div', 'Stock Code', 'Color', 'Clarity', 'Size', 'Shape', 'Pcs', 'Setted', 'Weight', 'Loss', 'Gain Wt', 'Type', 'Rate ', 'Amount']

  constructor(
    private activeModal: NgbActiveModal,
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
            this.processTransferdetailsForm.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.processTransferdetailsForm.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
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
  /**USE: subjobnumber validate API call  this.processTransferdetailsForm.value.subjobno*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': '156516/4/01',
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
          console.log(data[0]);
          this.processTransferdetailsForm.controls.processFrom.setValue(data[0].PROCESS)
          this.processTransferdetailsForm.controls.workerFrom.setValue(data[0].WORKER)
          this.processTransferdetailsForm.controls.MetalPcsFrom.setValue(data[0].METAL)
          this.processTransferdetailsForm.controls.GrossWeightFrom.setValue(data[0].NETWT)
          this.processTransferdetailsForm.controls.StonePcsFrom.setValue(data[0].STONE)
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  toggleSwitchChange(event: any) {
    if(this.processTransferdetailsForm.value.toggleSwitchtIssue){
      this.MetalorProcessFlag = 'Process'
    }else{
      this.MetalorProcessFlag = 'Metal'
    }
  }
  /**USE: Process Master Validate */
  processMasterValidate(event:any,flag:string):void {
    if(event.target.value == '') return
    event.target.value = (event.target.value).toUpperCase()
    let API: string = `ProcessMasterDj/GetProcessMasterDjWithProcessCode/${event.target.value}`
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.response) {
          let data = result.response
          this.setProcessCodeData(data.PROCESS_CODE,flag)
        } else {
          this.setProcessCodeData('',flag)
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE set processcode to form */
  setProcessCodeData(Code:string,flag:any){
    if(flag == 'FROM'){
      this.processTransferdetailsForm.controls.processFrom.setValue(Code)
    }else{
      this.processTransferdetailsForm.controls.processTo.setValue(Code)
    }
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.processFrom.setValue(event.Process_Code)
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.processTo.setValue(event.Process_Code)
  }
  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.workerFrom.setValue(event.WORKER_CODE)
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.workerTo.setValue(event.WORKER_CODE)
  }
  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.jobno.setValue(event.job_number)
    this.processTransferdetailsForm.controls.jobdes.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  removedata() {
    this.tableData.pop();
  }
  formSubmit() {
    let detailDataToParent = {
      PROCESS_FORMDETAILS: []
    }

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    this.close(detailDataToParent)//USE: passing Detail data to header screen on close

    // let API = 'JobProcessTrnMasterDJ/InsertJobProcessTrnMasterDJ'
    // let postData = {
    //   'JOB_PROCESS_TRN_DETAIL_DJ': [
    //     {
    //       "SRNO": 0,
    //       "UNIQUEID": 0,
    //       "VOCNO": "string",
    //       "VOCDATE": "2023-10-21T07:24:35.989Z",
    //       "VOCTYPE": "",
    //       "BRANCH_CODE": this.branchCode,
    //       "JOB_NUMBER": this.processTransferdetailsForm.value.jobno || "",
    //       "JOB_DATE": "2023-10-21T07:24:35.989Z",
    //       "UNQ_JOB_ID": "",
    //       "UNQ_DESIGN_ID": "",
    //       "DESIGN_CODE": "",
    //       "SEQ_CODE": "",
    //       "JOB_DESCRIPTION": this.processTransferdetailsForm.value.jobdes || "",
    //       "CURRENCY_CODE": "",
    //       "CURRENCY_RATE": 0,
    //       "FRM_PROCESS_CODE": "",
    //       "FRM_PROCESSNAME": "",
    //       "FRM_WORKER_CODE": "",
    //       "FRM_WORKERNAME": "",
    //       "FRM_PCS": 0,
    //       "FRM_STONE_WT": 0,
    //       "FRM_STONE_PCS": 0,
    //       "FRM_METAL_WT": 0,
    //       "FRM_METAL_PCS": 0,
    //       "FRM_PURE_WT": 0,
    //       "FRM_NET_WT": 0,
    //       "TO_PROCESS_CODE": "",
    //       "TO_PROCESSNAME": "",
    //       "TO_WORKER_CODE": "",
    //       "TO_WORKERNAME": "",
    //       "TO_PCS": 0,
    //       "TO_METAL_PCS": 0,
    //       "TO_STONE_WT": 0,
    //       "TO_STONE_PCS": 0,
    //       "TO_METAL_WT": 0,
    //       "TO_PURE_WT": 0,
    //       "TO_NET_WT": 0,
    //       "LOSS_QTY": 0,
    //       "LOSS_PURE_QTY": 0,
    //       "STONE_AMOUNTFC": 0,
    //       "STONE_AMOUNTLC": 0,
    //       "METAL_AMOUNTFC": 0,
    //       "METAL_AMOUNTLC": 0,
    //       "MAKING_RATEFC": 0,
    //       "MAKING_RATELC": 0,
    //       "MAKING_AMOUNTFC": 0,
    //       "MAKING_AMOUNTLC": 0,
    //       "LAB_AMOUNTFC": 0,
    //       "LAB_AMOUNTLC": 0,
    //       "TOTAL_AMOUNTFC": 0,
    //       "TOTAL_AMOUNTLC": 0,
    //       "COSTFC_PER_PCS": 0,
    //       "COSTLC_PER_PCS": 0,
    //       "LAB_CODE": "",
    //       "LAB_UNIT": "",
    //       "LAB_RATEFC": 0,
    //       "LAB_RATELC": 0,
    //       "LAB_ACCODE": "",
    //       "LOSS_ACCODE": "",
    //       "FRM_WIP_ACCODE": "",
    //       "TO_WIP_ACCODE": "",
    //       "RET_METAL_DIVCODE": "",
    //       "RET_METAL_STOCK_CODE": "",
    //       "RET_STONE_DIVCODE": "",
    //       "RET_STONE_STOCK_CODE": "",
    //       "RET_METAL_WT": 0,
    //       "RET_PURITY": 0,
    //       "RET_PURE_WT": 0,
    //       "RET_STONE_WT": 0,
    //       "RET_METAL_RATEFC": 0,
    //       "RET_METAL_RATELC": 0,
    //       "RET_METAL_AMOUNTFC": 0,
    //       "RET_METAL_AMOUNTLC": 0,
    //       "RET_STONE_RATEFC": 0,
    //       "RET_STONE_RATELC": 0,
    //       "RET_STONE_AMOUNTFC": 0,
    //       "RET_STONE_AMOUNTLC": 0,
    //       "IN_DATE": this.processTransferdetailsForm.value.startdate || "",
    //       "OUT_DATE": this.processTransferdetailsForm.value.enddate || "",
    //       "TIME_TAKEN_HRS": this.processTransferdetailsForm.value.timetaken || "",
    //       "METAL_DIVISION": "",
    //       "LOCTYPE_CODE": "",
    //       "PICTURE_PATH": "",
    //       "AMOUNTLC": 0,
    //       "AMOUNTFC": 0,
    //       "JOB_PCS": 0,
    //       "STONE_WT": 0,
    //       "STONE_PCS": 0,
    //       "METAL_WT": 0,
    //       "METAL_PCS": 0,
    //       "PURE_WT": 0,
    //       "GROSS_WT": 0,
    //       "RET_METAL_PCS": 0,
    //       "RET_STONE_PCS": 0,
    //       "RET_LOC_MET": "",
    //       "RET_LOC_STN": "",
    //       "MAIN_WORKER": "",
    //       "MKG_LABACCODE": "",
    //       "REMARKS": this.processTransferdetailsForm.value.remarks || "",
    //       "TREE_NO": this.processTransferdetailsForm.value.treeno || "",
    //       "STD_TIME": this.processTransferdetailsForm.value.stdtime || "",
    //       "WORKER_ACCODE": "",
    //       "PRODLAB_ACCODE": "",
    //       "DT_BRANCH_CODE": "",
    //       "DT_VOCTYPE": "",
    //       "DT_VOCNO": 0,
    //       "DT_YEARMONTH": this.yearMonth,
    //       "ISSUE_REF": "",
    //       "IS_AUTHORISE": true,
    //       "TIME_CONSUMED": 0,
    //       "SCRAP_STOCK_CODE": "",
    //       "SCRAP_SUB_STOCK_CODE": "",
    //       "SCRAP_PURITY": 0,
    //       "SCRAP_WT": 0,
    //       "SCRAP_PURE_WT": 0,
    //       "SCRAP_PUDIFF": 0,
    //       "SCRAP_ACCODE": "",
    //       "APPROVED_DATE": this.processTransferdetailsForm.value.approveddate || "",
    //       "APPROVED_USER": this.processTransferdetailsForm.value.approvedby || "",
    //       "SCRAP_PCS": 0,
    //       "SCRAP_STONEWT": 0,
    //       "SCRAP_NETWT": 0,
    //       "FROM_IRONWT": 0,
    //       "FROM_MSTOCKCODE": "",
    //       "TO_MSTOCKCODE": "",
    //       "DESIGN_TYPE": "",
    //       "TO_IRONWT": 0,
    //       "FRM_DIAGROSS_WT": 0,
    //       "EXCLUDE_TRANSFER_WT": true,
    //       "SCRAP_DIVCODE": "",
    //       "IRON_SCRAP_WT": 0,
    //       "GAIN_WT": 0,
    //       "GAIN_PURE_WT": 0,
    //       "GAIN_ACCODE": "",
    //       "IS_REJECT": true,
    //       "REASON": "",
    //       "REJ_REMARKS": "",
    //       "ATTACHMENT_FILE": "",
    //       "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
    //     }
    //   ],
    //   "JOB_PROCESS_TRN_STNMTL_DJ": [
    //     {
    //       "VOCNO": 0,
    //       "VOCTYPE": "",
    //       "VOCDATE": "2023-10-21T07:24:35.989Z",
    //       "JOB_NUMBER": "",
    //       "JOB_SO_NUMBER": this.processTransferdetailsForm.value.subjobno || "",
    //       "UNQ_JOB_ID": "",
    //       "JOB_DESCRIPTION": "",
    //       "BRANCH_CODE": "",
    //       "DESIGN_CODE": "",
    //       "METALSTONE": "",
    //       "DIVCODE": "",
    //       "STOCK_CODE": "",
    //       "STOCK_DESCRIPTION": "",
    //       "COLOR": "",
    //       "CLARITY": "",
    //       "SHAPE": "",
    //       "SIZE": "",
    //       "PCS": 0,
    //       "GROSS_WT": 0,
    //       "STONE_WT": 0,
    //       "NET_WT": 0,
    //       "RATE": 0,
    //       "AMOUNT": 0,
    //       "PROCESS_CODE": "",
    //       "WORKER_CODE": "",
    //       "UNQ_DESIGN_ID": "",
    //       "REFMID": 0,
    //       "AMOUNTLC": 0,
    //       "AMOUNTFC": 0,
    //       "WASTAGE_QTY": 0,
    //       "WASTAGE_PER": 0,
    //       "WASTAGE_AMT": 0,
    //       "CURRENCY_CODE": "",
    //       "CURRENCY_RATE": 0,
    //       "YEARMONTH": "",
    //       "LOSS_QTY": 0,
    //       "LABOUR_CODE": "",
    //       "LAB_RATE": 0,
    //       "LAB_AMT": 0,
    //       "BRKSTN_STOCK_CODE": "",
    //       "BRKSTN_DIVISION_CODE": "",
    //       "BRKSTN_WEIGHT": 0,
    //       "BRKSTN_RATEFC": 0,
    //       "BRKSTN_RATELC": 0,
    //       "BRKSTN_AMTFC": 0,
    //       "BRKSTN_AMTLC": 0,
    //       "MAIN_WORKER": "",
    //       "FRM_WORKER": "",
    //       "FRM_PROCESS": "",
    //       "CRACCODE": "",
    //       "LAB_ACCODE": "",
    //       "LAB_AMTFC": 0,
    //       "TO_PROCESS": "",
    //       "TO_WORKER": "",
    //       "LAB_RATEFC": 0,
    //       "RATEFC": 0,
    //       "PRINTED": true,
    //       "PUREWT": 0,
    //       "PURITY": 0,
    //       "SQLID": "",
    //       "ISBROCKEN": 0,
    //       "TREE_NO": "",
    //       "SETTED": true,
    //       "SETTED_PCS": 0,
    //       "SIEVE": "",
    //       "FULL_RECOVERY": 0,
    //       "RECOVERY_DATE": "2023-10-21T07:24:35.989Z",
    //       "RECOV_LOSS": 0,
    //       "RECOV_LOSS_PURE": 0,
    //       "BROKENSTONE_PCS": 0,
    //       "BROKENSTONE_WT": 0,
    //       "ISMISSING": 0,
    //       "PROCESS_TYPE": "",
    //       "IS_AUTHORISE": true,
    //       "SUB_STOCK_CODE": "",
    //       "KARAT_CODE": "",
    //       "SIEVE_SET": "",
    //       "SCRAP_STOCK_CODE": "",
    //       "SCRAP_SUB_STOCK_CODE": "",
    //       "SCRAP_PURITY": 0,
    //       "SCRAP_WT": 0,
    //       "SCRAP_PURE_WT": 0,
    //       "SCRAP_PUDIFF": 0,
    //       "SCRAP_ACCODE": "",
    //       "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
    //       "ISSUE_GROSS_WT": 0,
    //       "ISSUE_STONE_WT": 0,
    //       "ISSUE_NET_WT": 0,
    //       "JOB_PCS": 0,
    //       "DESIGN_TYPE": "",
    //       "TO_STOCK_CODE": "",
    //       "FROM_STOCK_CODE": "",
    //       "FROM_SUB_STOCK_CODE": "",
    //       "LOSS_PURE_WT": 0,
    //       "EXCLUDE_TRANSFER_WT": true,
    //       "IRON_WT": 0,
    //       "IRON_SCRAP_WT": 0,
    //       "GAIN_WT": 0,
    //       "GAIN_PURE_WT": 0,
    //       "IS_REJECT": true,
    //       "REASON": "",
    //       "REJ_REMARKS": "",
    //       "ATTACHMENT_FILE": "",
    //       "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
    //       "PUREWTTEMP": 0
    //     }
    //   ],
    //   "JOB_PROCESS_TRN_LABCHRG_DJ": [
    //     {
    //       "REFMID": 0,
    //       "BRANCH_CODE": "",
    //       "YEARMONTH": "",
    //       "VOCTYPE": "",
    //       "VOCNO": 0,
    //       "SRNO": 0,
    //       "JOB_NUMBER": "",
    //       "STOCK_CODE": "",
    //       "UNQ_JOB_ID": "",
    //       "METALSTONE": "",
    //       "DIVCODE": "",
    //       "PCS": 0,
    //       "GROSS_WT": 0,
    //       "LABOUR_CODE": "",
    //       "LAB_RATE": 0,
    //       "LAB_ACCODE": "",
    //       "LAB_AMTFC": 0,
    //       "UNITCODE": ""
    //     }
    //   ]
    // }

    // let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
    //   .subscribe((result) => {
    //     if (result.response) {
    //       if (result.status == "Success") {
    //         Swal.fire({
    //           title: result.message || 'Success',
    //           text: '',
    //           icon: 'success',
    //           confirmButtonColor: '#336699',
    //           confirmButtonText: 'Ok'
    //         }).then((result: any) => {
    //           if (result.value) {
    //             this.processTransferdetailsForm.reset()
    //             this.tableData = []
    //             this.close('reloadMainGrid')
    //           }
    //         });
    //       }
    //     } else {
    //       this.toastr.error('Not saved')
    //     }
    //   }, err => alert(err))
    // this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
    this.processTransferdetailsForm.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.processTransferdetailsForm.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.processTransferdetailsForm.controls.subjobno.setValue(this.content.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.approvedby.setValue(this.content.APPROVED_USER)
    this.processTransferdetailsForm.controls.approveddate.setValue(this.content.APPROVED_DATE)
    this.processTransferdetailsForm.controls.startdate.setValue(this.content.IN_DATE)
    this.processTransferdetailsForm.controls.enddate.setValue(this.content.OUT_DATE)
    this.processTransferdetailsForm.controls.stdtime.setValue(this.content.STD_TIME)
    this.processTransferdetailsForm.controls.timetaken.setValue(this.content.TIME_TAKEN_HRS)
    this.processTransferdetailsForm.controls.treeno.setValue(this.content.TREE_NO)
    this.processTransferdetailsForm.controls.remarks.setValue(this.content.REMARKS)
  }


  update() {
    if (this.processTransferdetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/' + this.processTransferdetailsForm.value.branchCode + this.processTransferdetailsForm.value.voctype + this.processTransferdetailsForm.value.vocno + this.processTransferdetailsForm.value.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": "string",
      "BRANCH_CODE": "string",
      "VOCNO": "string",
      "VOCDATE": "2023-10-17T06:07:55.781Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-17T06:07:55.781Z",
      "SMAN": "string",
      "REMARKS": this.processTransferdetailsForm.value.remarks || "",
      "CURRENCY_CODE": "string",
      "CURRENCY_RATE": 0,
      "NAVSEQNO": 0,
      "LAB_TYPE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-17T06:07:55.781Z",
      "SRNO": 0,
      "UNIQUEID": 0,
      "JOB_NUMBER": this.processTransferdetailsForm.value.jobno || "",
      "JOB_DATE": "2023-10-17T06:07:55.781Z",
      "UNQ_JOB_ID": "string",
      "UNQ_DESIGN_ID": "string",
      "DESIGN_CODE": "string",
      "SEQ_CODE": "string",
      "JOB_DESCRIPTION": this.processTransferdetailsForm.value.jobdes || "",
      "FRM_PROCESS_CODE": "string",
      "FRM_PROCESSNAME": "string",
      "FRM_WORKER_CODE": "string",
      "FRM_WORKERNAME": "string",
      "FRM_PCS": 0,
      "FRM_STONE_WT": 0,
      "FRM_STONE_PCS": 0,
      "FRM_METAL_WT": 0,
      "FRM_METAL_PCS": 0,
      "FRM_PURE_WT": 0,
      "FRM_NET_WT": 0,
      "TO_PROCESS_CODE": "string",
      "TO_PROCESSNAME": "string",
      "TO_WORKER_CODE": "string",
      "TO_WORKERNAME": "string",
      "TO_PCS": 0,
      "TO_METAL_PCS": 0,
      "TO_STONE_WT": 0,
      "TO_STONE_PCS": 0,
      "TO_METAL_WT": 0,
      "TO_PURE_WT": 0,
      "TO_NET_WT": 0,
      "LOSS_QTY": 0,
      "LOSS_PURE_QTY": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "COSTFC_PER_PCS": 0,
      "COSTLC_PER_PCS": 0,
      "LAB_CODE": "string",
      "LAB_UNIT": "string",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": "string",
      "LOSS_ACCODE": "string",
      "FRM_WIP_ACCODE": "string",
      "TO_WIP_ACCODE": "string",
      "RET_METAL_DIVCODE": "string",
      "RET_METAL_STOCK_CODE": "string",
      "RET_STONE_DIVCODE": "string",
      "RET_STONE_STOCK_CODE": "string",
      "RET_METAL_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_STONE_WT": 0,
      "RET_METAL_RATEFC": 0,
      "RET_METAL_RATELC": 0,
      "RET_METAL_AMOUNTFC": 0,
      "RET_METAL_AMOUNTLC": 0,
      "RET_STONE_RATEFC": 0,
      "RET_STONE_RATELC": 0,
      "RET_STONE_AMOUNTFC": 0,
      "RET_STONE_AMOUNTLC": 0,
      "IN_DATE": this.processTransferdetailsForm.value.startdate || "",
      "OUT_DATE": this.processTransferdetailsForm.value.enddate || "",
      "TIME_TAKEN_HRS": this.processTransferdetailsForm.value.timetaken || "",
      "METAL_DIVISION": "string",
      "LOCTYPE_CODE": "string",
      "PICTURE_PATH": "string",
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "JOB_PCS": 0,
      "STONE_WT": 0,
      "STONE_PCS": 0,
      "METAL_WT": 0,
      "METAL_PCS": 0,
      "PURE_WT": 0,
      "GROSS_WT": 0,
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "string",
      "RET_LOC_STN": "string",
      "MAIN_WORKER": "string",
      "MKG_LABACCODE": "string",
      "TREE_NO": this.processTransferdetailsForm.value.treeno || "",
      "STD_TIME": this.processTransferdetailsForm.value.stdtime || "",
      "WORKER_ACCODE": "string",
      "PRODLAB_ACCODE": "string",
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "string",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "ISSUE_REF": "string",
      "IS_AUTHORISE": true,
      "TIME_CONSUMED": 0,
      "SCRAP_STOCK_CODE": "string",
      "SCRAP_SUB_STOCK_CODE": "string",
      "SCRAP_PURITY": 0,
      "SCRAP_WT": 0,
      "SCRAP_PURE_WT": 0,
      "SCRAP_PUDIFF": 0,
      "SCRAP_ACCODE": "string",
      "APPROVED_DATE": this.processTransferdetailsForm.value.approveddate || "",
      "APPROVED_USER": this.processTransferdetailsForm.value.approvedby || "",
      "SCRAP_PCS": 0,
      "SCRAP_STONEWT": 0,
      "SCRAP_NETWT": 0,
      "FROM_IRONWT": 0,
      "FROM_MSTOCKCODE": "string",
      "TO_MSTOCKCODE": "string",
      "DESIGN_TYPE": "string",
      "TO_IRONWT": 0,
      "FRM_DIAGROSS_WT": 0,
      "EXCLUDE_TRANSFER_WT": true,
      "SCRAP_DIVCODE": "string",
      "IRON_SCRAP_WT": 0,
      "GAIN_WT": 0,
      "GAIN_PURE_WT": 0,
      "GAIN_ACCODE": "string",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
      "AUTHORIZE_TIME": "2023-10-17T06:07:55.781Z",
      "JOB_SO_NUMBER": this.processTransferdetailsForm.value.subjobno || "",
      "METALSTONE": "string",
      "DIVCODE": "string",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SHAPE": "string",
      "SIZE": "string",
      "PCS": 0,
      "NET_WT": 0,
      "RATE": 0,
      "AMOUNT": 0,
      "PROCESS_CODE": "string",
      "WORKER_CODE": "string",
      "REFMID": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "LABOUR_CODE": "string",
      "LAB_RATE": 0,
      "LAB_AMT": 0,
      "BRKSTN_STOCK_CODE": "string",
      "BRKSTN_DIVISION_CODE": "string",
      "BRKSTN_WEIGHT": 0,
      "BRKSTN_RATEFC": 0,
      "BRKSTN_RATELC": 0,
      "BRKSTN_AMTFC": 0,
      "BRKSTN_AMTLC": 0,
      "FRM_WORKER": "string",
      "FRM_PROCESS": "string",
      "CRACCODE": "string",
      "LAB_AMTFC": 0,
      "TO_PROCESS": "string",
      "TO_WORKER": "string",
      "RATEFC": 0,
      "PRINTED": true,
      "PUREWT": 0,
      "PURITY": 0,
      "SQLID": "string",
      "ISBROCKEN": 0,
      "SETTED": true,
      "SETTED_PCS": 0,
      "SIEVE": "string",
      "FULL_RECOVERY": 0,
      "RECOVERY_DATE": "2023-10-17T06:07:55.781Z",
      "RECOV_LOSS": 0,
      "RECOV_LOSS_PURE": 0,
      "BROKENSTONE_PCS": 0,
      "BROKENSTONE_WT": 0,
      "ISMISSING": 0,
      "PROCESS_TYPE": "string",
      "SUB_STOCK_CODE": "string",
      "KARAT_CODE": "string",
      "SIEVE_SET": "string",
      "ISSUE_GROSS_WT": 0,
      "ISSUE_STONE_WT": 0,
      "ISSUE_NET_WT": 0,
      "TO_STOCK_CODE": "string",
      "FROM_STOCK_CODE": "string",
      "FROM_SUB_STOCK_CODE": "string",
      "LOSS_PURE_WT": 0,
      "IRON_WT": 0,
      "PUREWTTEMP": 0,
      "UNITCODE": "string",
      "approvalDetails": this.tableData,
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
                this.processTransferdetailsForm.reset()
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
        let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' + this.processTransferdetailsForm.value.branchCode + this.processTransferdetailsForm.value.voctype + this.processTransferdetailsForm.value.vocno + this.processTransferdetailsForm.value.yearMonth
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
                    this.processTransferdetailsForm.reset()
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
                    this.processTransferdetailsForm.reset()
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
  close(data?: any) {
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
