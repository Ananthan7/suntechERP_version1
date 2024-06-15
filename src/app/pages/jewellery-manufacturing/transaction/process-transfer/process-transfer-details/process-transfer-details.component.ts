import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from 'src/app/shared/data/datetime-model';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  minEndDate: string = '';
  divisionMS: any = 'ID';
  tableData: any[] = [];
  metalDetailData: any[] = [];
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{ type: 'GEN' }];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Process';
  designType: string = 'DIAMOND';
  viewMode: boolean = false;
  private subscriptions: Subscription[] = [];
  STDDateTimeData: DateTimeModel = {
    TIMEINMINUTES: 0,
    SEARCH_HEADING: 'Standard Time'
  }
  TimeTakenData: DateTimeModel = {
    TIMEINMINUTES: 0,
    SEARCH_HEADING: 'Time Taken'
  }
  consumedTimeData: DateTimeModel = {
    TIMEINMINUTES: 0,
    SEARCH_HEADING: 'Consumed Time'
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
  stockCodeSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock code search',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  fromProcessMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 259,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@StrCurrentUser='',
    @StrProcessCode='',
    @StrSubJobNo='',
    @StrBranchCode=${this.comService.branchCode}`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  toProcessMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 261,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@JobNumber='',
    @BranchCode='${this.comService.branchCode}',
    @CurrentUser='${this.comService.userName}',
    @ToWorker='',
    @EntStr='',
    @ToWorkerFocus=1`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  fromWorkerMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 260,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@StrSubJobNo='',
    @StrFromProcess='',
    @StrFromWorker='',
    @StrBranchCode=${this.comService.branchCode},
	  @blnProcessAuthroize=1`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  toWorkerMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 262,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@StrToProcess ='',
    @StrToWorker='',
	  @blntoWorkerFocus =1`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  processTransferdetailsForm: FormGroup = this.formBuilder.group({
    SRNO: [0],
    FLAG: [''],
    barCodeNumber: [''],
    JOB_NUMBER: [''],
    jobdes: [''],
    UNQ_JOB_ID: [''],
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
    StdTimeInMinutes: [''],
    timeTakenInMinutes: [''],
    consumedInMinutes: [''],
    toggleSwitchtIssue: [true],
    //DIAMOND DETAIL STARTS
    FRM_PROCESS_CODE: [''],
    TO_PROCESS_CODE: [''],
    FRM_PROCESSNAME: [''],
    TO_PROCESSNAME: [''],
    FRM_WORKER_CODE: [''],
    TO_WORKER_CODE: [''],
    TO_WORKER_CODEDescription: [''],
    FRM_METAL_PCS: [''],
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
    MAIN_STOCK_CODE: [''],
    SCRAP_PURITY: [''],
    DESIGN_TYPE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    //METAL DETAILS STARTS
    METAL_quantity: [''],
    METAL_FRM_PROCESS_CODE: [''],
    METAL_TO_PROCESS_CODE: [''],
    METAL_TO_PROCESSNAME: [''],
    METAL_FRM_WORKER_CODE: [''],
    METAL_TO_WORKER_CODE: [''],
    METAL_TO_WORKER_CODEDescription: [''],
    METAL_LossBooked: [''],
    METAL_ScrapLocCode: [''],
    METAL_GainGrWt: [''],
    METAL_GainPureWt: [''],
    METAL_FromStockCode: [''],
    METAL_ToStockCode: [''],
    METAL_ScrapStockCode: [''],
    METAL_FromPCS: [''],
    METAL_ToPCS: [''],
    METAL_ScrapPCS: [''],
    METAL_BalPCS: [''],
    METAL_GrossWeightFrom: [''],
    METAL_GrossWeightTo: [''],
    METAL_ScrapGrWt: [''],
    METAL_BalGrWt: [''],
    METAL_StoneWeightFrom: [''],
    METAL_StoneWeightTo: [''],
    METAL_ScrapStoneWt: [''],
    METAL_BalStoneWt: [''],
    METAL_FromIronWeight: [''],
    METAL_ToIronWt: [''],
    METAL_ToIronScrapWt: [''],
    METAL_BalIronWt: [''],
    METAL_FromNetWeight: [''],
    METAL_ToNetWt: [''],
    METAL_ScrapNetWt: [''],
    METAL_BalNetWt: [''],
    METAL_FromPureWt: [''],
    METAL_ToPureWt: [''],
    METAL_ScrapPureWt: [''],
    METAL_BalPureWt: [''],

  });


  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) {
  }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setInitialValues() //set all values from parent to child
    this.processTransferdetailsForm.controls['enddate'].disable();
  }
  onStartDateChange() {
    this.processTransferdetailsForm.controls['enddate'].enable();

    const startDateValue = this.processTransferdetailsForm.get('startdate')?.value;

    if (startDateValue) {
      // Enable the end date control
      this.processTransferdetailsForm.controls['enddate'].enable();

      // Set the minimum end date to the selected start date
      this.minEndDate = startDateValue;
    }

  }

  setInitialValues() {
    if (!this.content) return
    let dataFromParent = this.content
    this.processTransferdetailsForm.controls.SRNO.setValue(this.comService.nullToString(this.content.SRNO))
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(dataFromParent.JOB_NUMBER)
    console.log(this.content, 'this.content');
    // return
    this.processTransferdetailsForm.controls.jobdes.setValue(dataFromParent.jobdes)
    this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(dataFromParent.UNQ_JOB_ID)
    this.processTransferdetailsForm.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(dataFromParent.FRM_WORKER_CODE)
    this.processTransferdetailsForm.controls.TO_WORKER_CODE.setValue(dataFromParent.TO_WORKER_CODE)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(dataFromParent.FRM_PROCESS_CODE)
    this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(dataFromParent.TO_PROCESS_CODE)
    this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(dataFromParent.FRM_METAL_PCS)
    this.processTransferdetailsForm.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)
    this.processTransferdetailsForm.controls.GrossWeightTo.setValue(dataFromParent.GrossWeightTo)
    this.processTransferdetailsForm.controls.approvedby.setValue(dataFromParent.approvedby)
    this.processTransferdetailsForm.controls.startdate.setValue(dataFromParent.startdate)
    this.processTransferdetailsForm.controls.enddate.setValue(dataFromParent.enddate)
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(dataFromParent.JOB_DATE)
    this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(dataFromParent.DESIGN_CODE)
    this.processTransferdetailsForm.controls.SEQ_CODE.setValue(dataFromParent.SEQ_CODE)
    this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(dataFromParent.FRM_PROCESSNAME)
    this.processTransferdetailsForm.controls.WORKERDESC.setValue(dataFromParent.WORKERDESC)
    this.processTransferdetailsForm.controls.PUREWT.setValue(dataFromParent.PUREWT)
    this.processTransferdetailsForm.controls.MetalWeightFrom.setValue(dataFromParent.MetalWeightFrom)
    this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(dataFromParent.TO_PROCESSNAME)
    this.processTransferdetailsForm.controls.TO_WORKER_CODEDescription.setValue(dataFromParent.TO_WORKER_CODEDescription)
    this.processTransferdetailsForm.controls.PURITY.setValue(dataFromParent.PURITY)
    this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(dataFromParent.METALLAB_TYPE)
    this.processTransferdetailsForm.controls.remarks.setValue(dataFromParent.remarks)
    this.processTransferdetailsForm.controls.treeno.setValue(dataFromParent.treeno)
    this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(dataFromParent.JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.stockCode.setValue(dataFromParent.stockCode)
    this.processTransferdetailsForm.controls.DIVCODE.setValue(dataFromParent.DIVCODE)
    this.processTransferdetailsForm.controls.METALSTONE.setValue(dataFromParent.METALSTONE)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }

  setFromProcessWhereCondition() {
    this.fromProcessMasterSearch.WHERECONDITION = `@StrCurrentUser='${this.comService.userName}',
    @StrProcessCode='${this.comService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}',
    @StrSubJobNo='${this.comService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',
    @StrBranchCode='${this.comService.branchCode}'`
  }
  setToProcessWhereCondition() {
    this.toProcessMasterSearch.WHERECONDITION = `@JobNumber='${this.comService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER)}',
    @BranchCode='${this.comService.branchCode}',
    @CurrentUser='${this.comService.userName}',
    @ToWorker='${this.comService.nullToString(this.processTransferdetailsForm.value.TO_WORKER_CODE)}',
    @EntStr='',
    @ToWorkerFocus=1`
  }
  setFromWorkerWhereCondition() {
    this.fromWorkerMasterSearch.WHERECONDITION = `@StrSubJobNo='${this.comService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',
    @StrFromProcess='${this.comService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}',
    @StrFromWorker='${this.comService.nullToString(this.processTransferdetailsForm.value.FRM_WORKER_CODE)}',
    @StrBranchCode='${this.comService.branchCode}',
	  @blnProcessAuthroize=1`
  }
  setToWorkerWhereCondition() {
    this.toWorkerMasterSearch.WHERECONDITION = `@StrToProcess='stk pp',
    @StrToWorker='',
	  @blntoWorkerFocus=1`
  }
  stdTimeChange(event: any) {
    this.processTransferdetailsForm.controls.stdtime.setValue(event)
  }
  timeTakenChange(event: any) {
    this.processTransferdetailsForm.controls.timetaken.setValue(event)
  }
  consumedChange(event: any) {
    this.processTransferdetailsForm.controls.consumed.setValue(event)
  }
  StdTimeInMinutes(event: any) {
    this.processTransferdetailsForm.controls.StdTimeInMinutes.setValue(event)
  }
  timeTakenInMinutes(event: any) {
    this.processTransferdetailsForm.controls.timeTakenInMinutes.setValue(event)
  }
  consumedInMinutes(event: any) {
    this.processTransferdetailsForm.controls.consumedInMinutes.setValue(event)
  }
  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    // let postData = {
    //   "SPID": "086",
    //   "parameter": {
    //     'strBranchCode': this.comService.nullToString(this.branchCode),
    //     'strJobNumber': this.comService.nullToString(event.target.value),
    //     'strCurrenctUser': this.comService.nullToString(this.userName)
    //   }
    // }
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
            this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(data[0].UNQ_JOB_ID)
            this.processTransferdetailsForm.controls.jobdes.setValue(data[0].JOB_DESCRIPTION)
            this.processTransferdetailsForm.controls.subJobDescription.setValue(data[0].DESCRIPTION)
            this.processTransferdetailsForm.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.processTransferdetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.processTransferdetailsForm.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(data[0].PROCESSDESC)
            this.processTransferdetailsForm.controls.WORKERDESC.setValue(data[0].WORKERDESC)
            this.processTransferdetailsForm.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
            if (data[0].DESIGN_TYPE != '' && (data[0].DESIGN_TYPE).toUpperCase() == 'METAL') this.designType = 'METAL';

            this.processTransferdetailsForm.controls.DESIGN_TYPE.setValue(this.designType)
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
        'strUNQ_JOB_ID': this.processTransferdetailsForm.value.UNQ_JOB_ID,
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
          this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(data[0].PROCESS)
          this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(data[0].WORKER)
          this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.processTransferdetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.processTransferdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.processTransferdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.processTransferdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          this.processTransferdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          this.processTransferdetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)

          this.stockCodeScrapValidate()
          this.getTimeAndLossDetails()
          this.fillStoneDetails()
          //set where conditions
          this.setFromProcessWhereCondition()
          this.setToProcessWhereCondition()
          this.setFromWorkerWhereCondition()
          this.setToWorkerWhereCondition()
          // set numeric values with decimals
          this.setValueWithDecimal('MetalWeightFrom', data[0].METAL, 'METAL')
          this.setValueWithDecimal('FromJobPcs', data[0].PCS, 'AMOUNT')
          this.setValueWithDecimal('ToJobPcs', data[0].PCS, 'AMOUNT')
          this.setValueWithDecimal('FRM_METAL_PCS', data[0].PCS, 'AMOUNT')
          this.setValueWithDecimal('GrossWeightFrom', data[0].NETWT, 'METAL')
          this.setValueWithDecimal('StoneWeightFrom', data[0].STONE, 'STONE')
          this.setValueWithDecimal('PUREWT', data[0].PUREWT, 'AMOUNT')
          this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')

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
  stockCodeScrapValidate() {
    if (this.comService.nullToString(this.processTransferdetailsForm.value.stockCode == '')) return
    let postData = {
      "SPID": "044",
      "parameter": {
        'STRSTOCKCODE': this.comService.nullToString(this.processTransferdetailsForm.value.stockCode)
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.processTransferdetailsForm.controls.MAIN_STOCK_CODE.setValue(data[0].MAIN_STOCK_CODE)
          this.processTransferdetailsForm.controls.SCRAP_PURITY.setValue(data[0].PURITY)
        } else {
          this.processTransferdetailsForm.controls.stockCode.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  getTimeAndLossDetails() {
    if (this.comService.nullToString(this.processTransferdetailsForm.value.stockCode == '')) return
    let form = this.processTransferdetailsForm.value;
    let postData = {
      "SPID": "087",
      "parameter": {
        'StrDesignCode': this.comService.nullToString(form.DESIGN_CODE),
        'strProcess_Code': this.comService.nullToString(form.FRM_PROCESS_CODE),
        'StrSeq_Code': this.comService.nullToString(form.SEQ_CODE),
        'strWorker_Code': this.comService.nullToString(form.FRM_WORKER_CODE),
        'strUNQ_JOB_ID': this.comService.nullToString(form.UNQ_JOB_ID),
        'strBranchCode': this.comService.nullToString(this.comService.branchCode)
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.STDDateTimeData.TIMEINMINUTES = data[0].STD_TIME
          let time = this.comService.convertTimeMinutesToDHM(data[0].STD_TIME)
          this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(data[0].TO_PROCESS_CODE)
          this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(data[0].TO_PROCESSNAME)
          this.processTransferdetailsForm.controls.stdtime.setValue(
            time
          )
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
  private fillStoneDetails(): void {
    let postData = {
      "SPID": "042",
      "parameter": {
        strJobNumber: this.processTransferdetailsForm.value.JOB_NUMBER,
        strUnq_Job_Id: this.processTransferdetailsForm.value.UNQ_JOB_ID,
        strProcess_Code: this.processTransferdetailsForm.value.FRM_PROCESS_CODE,
        strWorker_Code: this.processTransferdetailsForm.value.FRM_WORKER_CODE,
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
  formatMetalDetailDataGrid() {
    this.metalDetailData.forEach((element: any) => {
      element.SETTED_FLAG = false
      element.GROSS_WT = this.comService.decimalQuantityFormat(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.comService.decimalQuantityFormat(element.STONE_WT, 'STONE')
      element.PURITY = this.comService.decimalQuantityFormat(element.PURITY, 'PURITY')
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
  /**USE clear processcode to and form */
  clearProcessCodeData(flag: string) {
    if (flag == 'FROM') {
      this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue('')
      this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue('')
    } else {
      this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue('')
      this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue('')
    }
    return
  }
  /**USE set processcode to and form */
  setProcessCodeData(response: any, flag: string) {
    if (flag == 'FROM') {
      this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(response.PROCESS_CODE)
      this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(response.DESCRIPTION)
    } else {
      this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(response.PROCESS_CODE)
      this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(response.DESCRIPTION)
    }
  }
  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    }
    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0] > 0) {
          let data = result.dynamicData[0]
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let result = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
            if (result && result.length == 0) {
              this.comService.toastErrorByMsgId('No data found')
              this.processTransferdetailsForm.controls[FORMNAME].setValue('')
              LOOKUPDATA.SEARCH_VALUE = ''
            }
            return
          }
        } else {
          this.comService.toastErrorByMsgId('No data found')
          this.processTransferdetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
        }
      }, err => {
        this.comService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(event.PROCESS)
    this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(event.Description)
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(event.PROCESS_CODE)
    this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(event.DESCRIPTION)
    this.setToWorkerWhereCondition()
  }

  metalprocessCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_PROCESS_CODE.setValue(event.PROCESS)
  }
  metalprocessCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_PROCESS_CODE.setValue(event.PROCESS_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_PROCESSNAME.setValue(event.DESCRIPTION)

  }

  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(event.WORKER_CODE)
    this.setFromWorkerWhereCondition()
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.TO_WORKER_CODEDescription.setValue(event.DESCRIPTION)
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
  }

  metalworkerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_WORKER_CODE.setValue(event.WORKER_CODE)
  }

  metalworkerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODEDescription.setValue(event.DESCRIPTION)
  }
  stockCodeSelected(event: any) {
    this.processTransferdetailsForm.controls.stockCode.setValue(event.STOCK_CODE)
  }

  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(event.job_number)
    this.processTransferdetailsForm.controls.jobdes.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  submitValidations(form: any): boolean {
    if (this.comService.nullToString(form.JOB_NUMBER) == '') {
      this.comService.toastErrorByMsgId('To Job Number cannot be empty')
      return true;
    }
    if (this.comService.nullToString(form.TO_WORKER_CODE) == '') {
      this.comService.toastErrorByMsgId('To worker code cannot be empty')
      return true;
    }
    return false;
  }
  /**USE: SUBMIT detail */
  formSubmit(flag: any) {
    if (this.submitValidations(this.processTransferdetailsForm.value)) return;
    let detailDataToParent: any = {
      PROCESS_FORMDETAILS: [],
      METAL_DETAIL_GRID: [],
      JOB_VALIDATE_DATA: []
    }
    this.processTransferdetailsForm.controls.FLAG.setValue(flag)
    this.calculateGain()

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    detailDataToParent.METAL_DETAIL_GRID = this.metalDetailData; //grid data
    detailDataToParent.JOB_VALIDATE_DATA = this.jobNumberDetailData;
    // this.close(detailDataToParent)
    console.log(detailDataToParent, 'child invoked');
    this.saveDetail.emit(detailDataToParent);
  }
  /**USE: to calculate gain detail */
  private calculateGain() {
    let formValues = this.processTransferdetailsForm.value;
    let gainGrWt = this.calculateGainGrWt(formValues.METAL_GrossWeightTo, formValues.METAL_GrossWeightFrom, formValues.METAL_ScrapGrWt)
    this.processTransferdetailsForm.controls.METAL_GainGrWt.setValue(gainGrWt)
    let gainPureWt = this.calculateGainGrWt(formValues.METAL_ToPureWt, formValues.METAL_FromPureWt, formValues.METAL_ScrapPureWt);
    this.processTransferdetailsForm.controls.METAL_GainPureWt.setValue(gainPureWt)
  }
  calculateGainGrWt(a: any, b: any, c: any) {
    if (!Number(a) && !Number(a) && !Number(a)) return 0
    return (this.comService.emptyToZero(a) - (this.comService.decimalQuantityFormat((Number(b) + Number(c)), 'METAL')))
  }


  close(data?: any) {
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
