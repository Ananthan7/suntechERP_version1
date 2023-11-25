import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @Input() content!: any;

  divisionMS: any = 'ID';
  tableData: any[] = [];
  metalDetailData: any[] = [];
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{type: 'GEN'}];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Process';
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
    barCodeNumber: [''],
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
    toggleSwitchtIssue: [true],
    processFrom: [''],
    processTo: [''],
    processToDescription: [''],
    workerFrom: [''],
    workerTo: [''],
    workerToDescription: [''],
    MetalPcsFrom: [''],
    MetalPcsTo: [''],
    MetalWeightFrom: [''],
    MetalWeightTo: [''],
    FromJobPcs: [''],
    ToJobPcs: [''],
    GrossWeightFrom: [''],
    GrossWeightTo: [''],
    Balance_WT: [''],
    stockCode: [''],
    scrapQuantity: [''],
    location: [''],
    stdLoss: [''],
    stdLossper: [''],
    StonePcsFrom: [''],
    StonePcsTo: [''],
    StoneWeightFrom: [''],
    StoneWeightTo: [''],
    partCode: [''],
    DESIGN_CODE: [''],
    JOB_DATE: [''],
    SEQ_CODE: [''],
    PROCESSDESC: [''],
    WORKERDESC: [''],
    PUREWT: [''],
    PURITY: [''],
    METALLAB_TYPE: [''],
    ISSUE_REF: [''],
    JOB_SO_NUMBER: [''],
    DIVCODE: [''],
    METALSTONE: [''],
    UNQ_DESIGN_ID: [''],
    JOB_DESCRIPTION: [''],
    PICTURE_PATH: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setAllInitialValues() //set all values from parent to child
  }
  setAllInitialValues() {
    let dataFromParent = this.content[0].PROCESS_FORMDETAILS
    if (!dataFromParent) return
    this.processTransferdetailsForm.controls.jobno.setValue(dataFromParent.jobno)
    this.processTransferdetailsForm.controls.jobdes.setValue(dataFromParent.jobdes)
    this.processTransferdetailsForm.controls.subjobno.setValue(dataFromParent.subjobno)
    this.processTransferdetailsForm.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.processTransferdetailsForm.controls.workerFrom.setValue(dataFromParent.workerFrom)
    this.processTransferdetailsForm.controls.workerTo.setValue(dataFromParent.workerTo)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.processTransferdetailsForm.controls.processFrom.setValue(dataFromParent.processFrom)
    this.processTransferdetailsForm.controls.processTo.setValue(dataFromParent.processTo)
    this.processTransferdetailsForm.controls.MetalPcsFrom.setValue(dataFromParent.MetalPcsFrom)
    this.processTransferdetailsForm.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)
    this.processTransferdetailsForm.controls.GrossWeightTo.setValue(dataFromParent.GrossWeightTo)
    this.processTransferdetailsForm.controls.approvedby.setValue(dataFromParent.approvedby)
    this.processTransferdetailsForm.controls.startdate.setValue(dataFromParent.startdate)
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(dataFromParent.JOB_DATE)
    this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(dataFromParent.DESIGN_CODE)
    this.processTransferdetailsForm.controls.SEQ_CODE.setValue(dataFromParent.SEQ_CODE)
    this.processTransferdetailsForm.controls.PROCESSDESC.setValue(dataFromParent.PROCESSDESC)
    this.processTransferdetailsForm.controls.WORKERDESC.setValue(dataFromParent.WORKERDESC)
    this.processTransferdetailsForm.controls.PUREWT.setValue(dataFromParent.PUREWT)
    this.processTransferdetailsForm.controls.MetalWeightFrom.setValue(dataFromParent.MetalWeightFrom)
    this.processTransferdetailsForm.controls.processToDescription.setValue(dataFromParent.processToDescription)
    this.processTransferdetailsForm.controls.workerToDescription.setValue(dataFromParent.workerToDescription)
    this.processTransferdetailsForm.controls.PURITY.setValue(dataFromParent.PURITY)
    this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(dataFromParent.METALLAB_TYPE)
    this.processTransferdetailsForm.controls.remarks.setValue(dataFromParent.remarks)
    this.processTransferdetailsForm.controls.treeno.setValue(dataFromParent.treeno)
    this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(dataFromParent.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.stockCode.setValue(dataFromParent.stockCode)
    this.processTransferdetailsForm.controls.DIVCODE.setValue(dataFromParent.DIVCODE)
    this.processTransferdetailsForm.controls.METALSTONE.setValue(dataFromParent.METALSTONE)
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
            this.jobNumberDetailData = data
            this.processTransferdetailsForm.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.processTransferdetailsForm.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
            this.processTransferdetailsForm.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.processTransferdetailsForm.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            this.processTransferdetailsForm.controls.PROCESSDESC.setValue(data[0].PROCESSDESC)
            this.processTransferdetailsForm.controls.WORKERDESC.setValue(data[0].WORKERDESC)
            this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
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

  /**USE: subjobnumber validate API call   || '156516/4/01'*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.processTransferdetailsForm.value.subjobno,
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
          this.processTransferdetailsForm.controls.processFrom.setValue(data[0].PROCESS)
          this.processTransferdetailsForm.controls.workerFrom.setValue(data[0].WORKER)
          this.processTransferdetailsForm.controls.MetalWeightFrom.setValue(
          this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          this.processTransferdetailsForm.controls.MetalPcsFrom.setValue(data[0].PCS)
          this.processTransferdetailsForm.controls.GrossWeightFrom.setValue(data[0].NETWT)
          this.processTransferdetailsForm.controls.StoneWeightFrom.setValue(data[0].STONE)
          this.processTransferdetailsForm.controls.PUREWT.setValue(data[0].PUREWT)
          this.processTransferdetailsForm.controls.PURITY.setValue(data[0].PURITY)
          this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.processTransferdetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.processTransferdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.processTransferdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.processTransferdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          this.processTransferdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
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
 
  private fillStoneDetails():void {
    let postData = {
      "SPID": "042",
      "parameter": {
        strJobNumber: this.processTransferdetailsForm.value.jobno,
        strUnq_Job_Id: this.processTransferdetailsForm.value.subjobno,             
        strProcess_Code: this.processTransferdetailsForm.value.processFrom,
        strWorker_Code: this.processTransferdetailsForm.value.workerFrom,
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
      element.GROSS_WT = this.comService.decimalQuantityFormat(element.GROSS_WT,'METAL')
      element.STONE_WT = this.comService.decimalQuantityFormat(element.STONE_WT,'STONE')
      element.PURITY = this.comService.decimalQuantityFormat(element.PURITY,'PURITY')
    });
  }
  /**USE: barcode Number Validate API call */
  barcodeNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "041",
      "parameter": {
        'BLNPROCESS': this.comService.nullToString(this.processTransferdetailsForm.value.toggleSwitchtIssue ? 1 : 0),
        'STRBRANCH': this.comService.nullToString(this.branchCode),
        'STRYEARMONTH': this.comService.nullToString('2008'),
        'TXTISSUEREF': this.comService.nullToString(event.target.value)
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          console.log(data, 'data');

          if (data[0]) {

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
  toggleSwitchChange(event: any) {
    if (this.processTransferdetailsForm.value.toggleSwitchtIssue) {
      this.MetalorProcessFlag = 'Process'
    } else {
      this.MetalorProcessFlag = 'Metal'
    }
  }
  /**USE: Process Master Validate */
  processMasterValidate(event: any, flag: string): void {
    if (event.target.value == '') return
    event.target.value = (event.target.value).toUpperCase()
    let API: string = `ProcessMasterDj/GetProcessMasterDjWithProcessCode/${event.target.value}`
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.response) {
          let data = result.response
          this.setProcessCodeData(data.PROCESS_CODE, flag)
        } else {
          this.setProcessCodeData('', flag)
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE set processcode to form */
  setProcessCodeData(Code: string, flag: any) {
    if (flag == 'FROM') {
      this.processTransferdetailsForm.controls.processFrom.setValue(Code)
    } else {
      this.processTransferdetailsForm.controls.processTo.setValue(Code)
    }
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.processFrom.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.PROCESSDESC.setValue(event.Description)
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.processTo.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.processToDescription.setValue(event.Description)
  }
  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.workerFrom.setValue(event.WORKER_CODE)
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.workerTo.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.workerToDescription.setValue(event.DESCRIPTION)
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
    let detailDataToParent:any = {
      PROCESS_FORMDETAILS: [],
      METAL_DETAIL_DATA: [],
      JOB_VALIDATE_DATA: []
    }

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    detailDataToParent.METAL_DETAIL_DATA = this.metalDetailData;
    detailDataToParent.JOB_VALIDATE_DATA = this.jobNumberDetailData;
    this.close(detailDataToParent)//USE: passing Detail data to header screen on close
  }

  setFormValues() {
    if (!this.content) return
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
