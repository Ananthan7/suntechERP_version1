import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from 'src/app/shared/data/datetime-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @ViewChild(MasterSearchComponent) MasterSearchComponent?: MasterSearchComponent;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  minEndDate: string = '';
  divisionMS: any = 'ID';
  tableData: any[] = [];
  imagepath: any[] = []
  metalDetailData: any[] = [];
  sequenceDetails: any[] = [];
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{ type: 'GEN' }];
  userName = this.commonService.userName;
  branchCode: String = this.commonService.branchCode;
  yearMonth: String = this.commonService.yearSelected;
  MetalorProcessFlag: string = 'Process';
  designType: string = 'DIAMOND';
  gridAmountDecimalFormat: any;
  viewMode: boolean = false;
  editMode: boolean = false;
  approvalReqFlag: any = false
  locationSearchFlag: any = false
  DIAMANFBARCODE: any = false

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
  userDetailNet: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  fromProcessMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 259,
    SEARCH_FIELD: 'PROCESS',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@StrCurrentUser='',
    @StrProcessCode='',
    @StrSubJobNo='',
    @StrBranchCode=${this.commonService.branchCode}`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  toProcessMasterSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 261,
    SEARCH_FIELD: 'PROCESS_CODE',
    SEARCH_HEADING: 'Process Master',
    SEARCH_VALUE: '',
    WHERECONDITION: `@JobNumber='',
    @BranchCode='${this.commonService.branchCode}',
    @CurrentUser='${this.commonService.userName}',
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
    @StrBranchCode=${this.commonService.branchCode},
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
  locationSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'Location',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch =${this.commonService.branchCode},
    @strUserCode=${this.commonService.userName},
    @strAvoidFORSALES='',
	  @strFrom=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  processTransferdetailsForm: FormGroup = this.formBuilder.group({
    SRNO: [0],
    FLAG: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    barCodeNumber: [''],
    JOB_NUMBER: [''],
    JOB_DESCRIPTION: [''],
    SUB_JOB_DESCRIPTION: [''],
    UNQ_JOB_ID: [''],
    REPAIR_PROCESS: [''],
    APPROVED_USER: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    STD_TIME: [''],
    TIME_TAKEN_HRS: [''],
    consumed: [''],
    variance: [''],
    variancePercentage: [''],
    TREE_NO: [''],
    remarks: [''],
    StdTimeInMinutes: [''],
    timeTakenInMinutes: [''],
    consumedInMinutes: [''],
    PRODLAB_ACCODE: [''],
    toggleSwitchtIssue: [true],
    //DIAMOND DETAIL STARTS
    FRM_PROCESS_CODE: [''],
    TO_PROCESS_CODE: [''],
    FRM_PROCESSNAME: [''],
    TO_PROCESSNAME: [''],
    FRM_WORKER_CODE: [''],
    FRM_WORKERNAME: [''],
    TO_WORKER_CODE: [''],
    TO_WORKERNAME: [''],
    FRM_METAL_PCS: [''],
    TO_METAL_PCS: [''],
    FRM_METAL_WT: [''],
    TO_METAL_WT: [''],
    FRM_PCS: [''],
    TO_PCS: [''],
    JOB_PCS: [''],
    GrossWeightFrom: [''],
    GrossWeightTo: [''],
    Balance_WT: [''],
    stockCode: [''],
    scrapWeight: [''],
    location: [''],
    lossQty: [''],
    STD_LOSS: [''],
    lossQtyper: [''],
    FRM_STONE_PCS: [''],
    TO_STONE_PCS: [''],
    FRM_STONE_WT: [''],
    TO_STONE_WT: [''],
    partCode: [''],
    DESIGN_CODE: [''],
    JOB_DATE: [''],
    SEQ_CODE: [''],
    PUREWT: [''],
    PURITY: [''],
    METALLAB_TYPE: [''],
    ISSUE_REF: [''],
    JOB_SO_NUMBER: [''],
    DIVCODE: [''],
    METALSTONE: [''],
    UNQ_DESIGN_ID: [''],
    PICTURE_PATH: [''],
    MAIN_STOCK_CODE: [''],
    SCRAP_PURITY: [''],
    SCRAP_PUDIFF: [''],
    SCRAP_DIVCODE: [''],
    SCRAP_PURE_WT: [''],
    DESIGN_TYPE: [''],
    ZIRCON: [''],
    GAIN_WT: [''],
    GAIN_PURE_WT: [''],
    METAL_STOCK_CODE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    //METAL DETAILS STARTS
    METAL_quantity: [''],
    METAL_FRM_PROCESS_CODE: [''],
    METAL_TO_PROCESS_CODE: [''],
    METAL_TO_PROCESSNAME: [''],
    METAL_FRM_WORKER_CODE: [''],
    METAL_TO_WORKER_CODE: [''],
    METAL_TO_WORKERNAME: [''],
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
    METAL_FRM_STONE_WT: [''],
    METAL_TO_STONE_WT: [''],
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
    private commonService: CommonServiceService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
      currency: this.commonService.compCurrency
    };
    this.setHearderDetails()
    this.setInitialValues() //set all values from parent to child
    // this.processTransferdetailsForm.controls['enddate'].disable();
    // this.processTransferdetailsForm.controls['startdate'].disable();
    this.processTransferdetailsForm.controls['startdate'].setValue(this.commonService.currentDate);
    this.processTransferdetailsForm.controls['enddate'].setValue(this.commonService.currentDate);
  }

  setHearderDetails() {
    this.DIAMANFBARCODE = this.commonService.getCompanyParamValue('DIAMANFBARCODE')
    console.log(this.content, 'this.content');
    let HEADERDETAILS = this.content[0]?.HEADERDETAILS || {}
    if (HEADERDETAILS) {
      this.nullToStringSetValue('BRANCH_CODE', HEADERDETAILS.BRANCH_CODE)
      this.nullToStringSetValue('VOCTYPE', HEADERDETAILS.VOCTYPE)
      this.nullToStringSetValue('YEARMONTH', HEADERDETAILS.YEARMONTH)
      this.nullToStringSetValue('CURRENCY_CODE', HEADERDETAILS.CURRENCY_CODE)
      this.nullToStringSetValue('CURRENCY_RATE', HEADERDETAILS.CURRENCY_RATE)
      this.nullToStringSetValue('FLAG', HEADERDETAILS.FLAG)
      this.processTransferdetailsForm.controls.SRNO.setValue(HEADERDETAILS.SRNO)
      this.processTransferdetailsForm.controls.VOCNO.setValue(HEADERDETAILS.VOCNO)
      this.processTransferdetailsForm.controls.VOCDATE.setValue(HEADERDETAILS.VOCDATE)
    }
    let branchParam = this.commonService.allbranchMaster
    this.processTransferdetailsForm.controls.location.setValue(branchParam.DMFGMLOC)
  }
  setFlagMode(FLAG: any) {
    switch (FLAG) {
      case 'VIEW':
        this.viewMode = true;
        this.locationSearchFlag = false;
        break;
      case 'EDIT':
        this.editMode = true;
        break;
      default:
        this.viewMode = false;
        this.editMode = false;
        break;
    }
  }
  setInitialValues() {
    if (!this.content) return
    let parentDetail: any;
    if (this.content[0]?.FLAG) {
      this.setFlagMode(this.content[0]?.FLAG)
      this.processTransferdetailsForm.controls.FLAG.setValue(this.content[0]?.FLAG)
      parentDetail = this.content[0]?.JOB_PROCESS_TRN_DETAIL_DJ
      let compData = this.content[0]?.JOB_PROCESS_TRN_COMP_DJ
      this.metalDetailData = []
      compData.forEach((item: any, index: any) => {
        item.FRM_PCS = item.SETTED_PCS
        if (item.GROSS_WT < 0) {
          item.SRNO = index + 1
          item.GROSS_WT = Math.abs(item.GROSS_WT)
          item.PCS = Math.abs(item.PCS)
          item.AMOUNTFC = Math.abs(item.AMOUNTFC)
          this.metalDetailData.push(item)
        }
      })
      this.formatMetalDetailDataGrid()
    } else {// condition to load without saving
      parentDetail = this.content[0]?.JOB_PROCESS_TRN_DETAIL_DJ
      this.metalDetailData = this.content[0]?.TRN_STNMTL_GRID
    }
    if (!parentDetail) return;
    this.processTransferdetailsForm.controls.SRNO.setValue(this.content[0]?.SRNO)

    this.nullToStringSetValue('JOB_NUMBER', parentDetail.JOB_NUMBER)
    this.nullToStringSetValue('JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.nullToStringSetValue('UNQ_JOB_ID', parentDetail.UNQ_JOB_ID)
    this.nullToStringSetValue('SUB_JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.nullToStringSetValue('FRM_WORKER_CODE', parentDetail.FRM_WORKER_CODE)
    this.nullToStringSetValue('FRM_WORKERNAME', parentDetail.FRM_WORKERNAME)
    this.nullToStringSetValue('TO_WORKER_CODE', parentDetail.TO_WORKER_CODE)
    this.nullToStringSetValue('TO_WORKERNAME', parentDetail.TO_WORKERNAME)
    this.nullToStringSetValue('FRM_PROCESS_CODE', parentDetail.FRM_PROCESS_CODE)
    this.nullToStringSetValue('FRM_PROCESSNAME', parentDetail.FRM_PROCESSNAME)
    this.nullToStringSetValue('TO_PROCESS_CODE', parentDetail.TO_PROCESS_CODE)
    this.nullToStringSetValue('TO_PROCESSNAME', parentDetail.TO_PROCESSNAME)
    this.nullToStringSetValue('DESIGN_CODE', parentDetail.DESIGN_CODE)
    this.nullToStringSetValue('SEQ_CODE', parentDetail.SEQ_CODE)
    this.nullToStringSetValue('METALLAB_TYPE', parentDetail.METALLAB_TYPE)
    this.nullToStringSetValue('remarks', parentDetail.remarks)
    this.nullToStringSetValue('TREE_NO', parentDetail.TREE_NO)
    this.nullToStringSetValue('JOB_SO_NUMBER', parentDetail.JOB_SO_NUMBER)
    this.nullToStringSetValue('stockCode', parentDetail.SCRAP_STOCK_CODE)
    this.nullToStringSetValue('DIVCODE', parentDetail.DIVCODE)
    this.nullToStringSetValue('METALSTONE', parentDetail.METALSTONE)
    this.nullToStringSetValue('FRM_METAL_PCS', parentDetail.FRM_METAL_PCS)
    this.nullToStringSetValue('TO_METAL_PCS', parentDetail.TO_METAL_PCS)
    this.nullToStringSetValue('FRM_PCS', parentDetail.FRM_PCS)
    this.nullToStringSetValue('TO_PCS', parentDetail.TO_PCS)
    this.nullToStringSetValue('FRM_STONE_PCS', parentDetail.FRM_STONE_PCS)
    this.nullToStringSetValue('TO_STONE_PCS', parentDetail.TO_STONE_PCS)
    this.nullToStringSetValue('PRODLAB_ACCODE', parentDetail.PRODLAB_ACCODE)
    this.nullToStringSetValue('SCRAP_DIVCODE', parentDetail.SCRAP_DIVCODE)

    this.setValueWithDecimal('FRM_METAL_WT', parentDetail.FRM_METAL_WT, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', parentDetail.TO_METAL_WT, 'METAL')
    this.setValueWithDecimal('GrossWeightFrom', parentDetail.FRM_DIAGROSS_WT, 'METAL') //dbt
    this.setValueWithDecimal('GrossWeightTo', parentDetail.TO_NET_WT, 'METAL')//dbt
    this.setValueWithDecimal('FRM_STONE_WT', parentDetail.FRM_STONE_WT, 'STONE')
    this.setValueWithDecimal('TO_STONE_WT', parentDetail.TO_STONE_WT, 'STONE')
    this.setValueWithDecimal('PUREWT', parentDetail.PUREWT, 'AMOUNT')
    this.setValueWithDecimal('PURITY', parentDetail.PURITY, 'PURITY')
    if (parentDetail.APPROVED_USER != '') {
      this.nullToStringSetValue('APPROVED_USER', parentDetail.APPROVED_USER)
      this.approvalReqFlag = true
      this.processTransferdetailsForm.controls.approveddate.setValue(
        new Date(parentDetail.APPROVED_DATE)
      )
    }
    if (parentDetail.SCRAP_STOCK_CODE && this.processTransferdetailsForm.value.FLAG == 'EDIT') {
      this.locationSearchFlag = true;
    }

    this.TimeTakenData.TIMEINMINUTES = parentDetail.TIME_TAKEN_HRS
    this.consumedTimeData.TIMEINMINUTES = parentDetail.TIME_CONSUMED
    this.STDDateTimeData.TIMEINMINUTES = parentDetail.TIME_CONSUMED
    this.processTransferdetailsForm.controls.STD_TIME.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.STD_TIME)
    )
    this.processTransferdetailsForm.controls.TIME_TAKEN_HRS.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.TIME_TAKEN_HRS)
    )
    this.processTransferdetailsForm.controls.consumed.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.TIME_CONSUMED)
    )
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(parentDetail.JOB_DATE)
    this.processTransferdetailsForm.controls.startdate.setValue(
      this.commonService.formatDateTime(parentDetail.IN_DATE)
    )
    this.processTransferdetailsForm.controls.enddate.setValue(
      this.commonService.formatDateTime(parentDetail.OUT_DATE)
    )

    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.getSequenceDetailData()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()

    // this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(this.content.toggleSwitchtIssue)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }


  getImageData() {
    let API = `Image/${this.processTransferdetailsForm.value.JOB_NUMBER}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.imagepath = data.map((item: any) => item.imagepath)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  getSequenceDetailData() {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${this.processTransferdetailsForm.value.SEQ_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.sequenceDetails = data.sequenceDetails
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
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

  setFromProcessWhereCondition() {
    //${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}
    this.fromProcessMasterSearch.WHERECONDITION = `@StrCurrentUser='${this.commonService.userName}',`
    this.fromProcessMasterSearch.WHERECONDITION += `@StrProcessCode='',`
    this.fromProcessMasterSearch.WHERECONDITION += `@StrSubJobNo='${this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',`
    this.fromProcessMasterSearch.WHERECONDITION += `@StrBranchCode='${this.commonService.branchCode}'`
  }
  setToProcessWhereCondition() {
    this.toProcessMasterSearch.WHERECONDITION = `@JobNumber='${this.commonService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER)}',`
    this.toProcessMasterSearch.WHERECONDITION += `@BranchCode='${this.commonService.branchCode}',`
    this.toProcessMasterSearch.WHERECONDITION += `@CurrentUser='${this.commonService.userName}',`
    this.toProcessMasterSearch.WHERECONDITION += `@ToWorker='${this.commonService.nullToString(this.processTransferdetailsForm.value.TO_WORKER_CODE)}',`
    this.toProcessMasterSearch.WHERECONDITION += `@EntStr='',`
    this.toProcessMasterSearch.WHERECONDITION += `@ToWorkerFocus=1`
  }
  setFromWorkerWhereCondition() {
    this.fromWorkerMasterSearch.WHERECONDITION = `@StrSubJobNo='${this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrFromProcess='${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrFromWorker='${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_WORKER_CODE)}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrBranchCode='${this.commonService.branchCode}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@blnProcessAuthroize=1`
  }
  setToWorkerWhereCondition() {
    this.toWorkerMasterSearch.WHERECONDITION = `@StrToProcess='stk pp',`
    this.toWorkerMasterSearch.WHERECONDITION += `@StrToWorker='',`
    this.toWorkerMasterSearch.WHERECONDITION += `@blntoWorkerFocus=1`
  }
  stdTimeChange(event: any) {
    this.processTransferdetailsForm.controls.STD_TIME.setValue(event)
  }
  timeTakenChange(event: any) {
    this.processTransferdetailsForm.controls.TIME_TAKEN_HRS.setValue(event)
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
  nullToStringSetValue(formcontrol: string, value: any) {
    this.processTransferdetailsForm.controls[formcontrol].setValue(
      this.commonService.nullToString(value)
    )
  }
  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (this.viewMode) return
    if (event.target.value == '') return
    // let postData = {
    //   "SPID": "086",
    //   "parameter": {
    //     'strBranchCode': this.commonService.nullToString(this.branchCode),
    //     'strJobNumber': this.commonService.nullToString(event.target.value),
    //     'strCurrenctUser': this.commonService.nullToString(this.userName)
    //   }
    // }
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(event.target.value.trim()),
        'strCurrenctUser': this.commonService.nullToString(this.userName)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.jobNumberDetailData = data
            this.nullToStringSetValue('UNQ_JOB_ID', data[0].UNQ_JOB_ID)
            this.nullToStringSetValue('JOB_DESCRIPTION', data[0].JOB_DESCRIPTION)
            this.nullToStringSetValue('SUB_JOB_DESCRIPTION', data[0].DESCRIPTION)
            this.nullToStringSetValue('JOB_DATE', data[0].JOB_DATE)
            this.nullToStringSetValue('DESIGN_CODE', data[0].DESIGN_CODE)
            this.nullToStringSetValue('SEQ_CODE', data[0].SEQ_CODE)
            this.nullToStringSetValue('METALLAB_TYPE', data[0].METALLAB_TYPE)
            this.nullToStringSetValue('DESIGN_TYPE', data[0].DESIGN_TYPE)
            this.nullToStringSetValue('METAL_STOCK_CODE', data[0].METAL_STOCK_CODE)
            this.designType = this.commonService.nullToString(data[0].DESIGN_TYPE?.toUpperCase());

            this.subJobNumberValidate()
            this.getSequenceDetailData()
          } else {
            this.nullToStringSetValue('JOB_NUMBER', '')
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.nullToStringSetValue('JOB_NUMBER', '')
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setSubJobSpPostData() {
    if (this.designType.toUpperCase() == 'DIAMOND') {
      return {
        "SPID": "088",
        "parameter": {
          'StrSubJobNo': this.processTransferdetailsForm.value.UNQ_JOB_ID,
          'StrBranchCode': this.commonService.nullToString(this.branchCode),
        }
      }
    } else {
      return {
        "SPID": "040",
        "parameter": {
          'strUNQ_JOB_ID': this.processTransferdetailsForm.value.UNQ_JOB_ID,
          'strBranchCode': this.commonService.nullToString(this.branchCode),
          'strCurrenctUser': ''
        }
      }
    }
  }

  subJobDetailData: any[] = []
  /**USE: subjobnumber validate API call subjobvalidate */
  subJobNumberValidate(event?: any) {
    let postData = this.setSubJobSpPostData() //set post data with designtype checking
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        try {
          this.subJobDetailData = result.dynamicData[0] || []
          let job_salesorder = result.dynamicData[1] || []
          if (job_salesorder.length > 0) {
            this.setDataFromSalesOrderDj(job_salesorder)
          }
          if (this.subJobDetailData.length > 0) {
            this.subJobDetailData.forEach((item: any, index: any) => {
              item.SRNO = index + 1
              item.METAL = this.commonService.decimalQuantityFormat(item.METAL, 'METAL')
              item.STONE = this.commonService.decimalQuantityFormat(item.STONE, 'STONE')
            })
            if (this.subJobDetailData.length > 1) {
              this.openJobTransferDetails() //opens modal for multiple details
              return
            }
            this.getImageData()
            this.setSubJobAPIDetails(this.subJobDetailData)
          }

        } catch (error) {
          this.commonService.toastErrorByMsgId('MSG1531')
        }

      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setDataFromSalesOrderDj(job_salesorder: any) {
    this.nullToStringSetValue('JOB_PCS', this.commonService.emptyToZero(job_salesorder[0].PCS))
    this.nullToStringSetValue('DESIGN_CODE', job_salesorder[0].DESIGN_CODE)
    this.nullToStringSetValue('UNQ_DESIGN_ID', job_salesorder[0].UNQ_DESIGN_ID)
    this.nullToStringSetValue('PICTURE_PATH', job_salesorder[0].PICTURE_PATH)
    this.nullToStringSetValue('TREE_NO', job_salesorder[0].TREE_NO)
    this.nullToStringSetValue('JOB_SO_NUMBER', job_salesorder[0].JOB_SO_NUMBER)
  }
  //use: on row click on multiple sub job details
  onRowClickHandler(event: any) {
    if (!event.data.PROCESS) return;
    let data = this.subJobDetailData.filter((item: any) => event.data.SRNO == item.SRNO)
    if (data && data.length > 0) {
      this.setSubJobAPIDetails(data)
    } else {
      this.commonService.toastErrorByMsgId('no data found')
    }
    this.modalReference.close()
  }
  onRowUpdateGrid(event: any) {
    let data = event.data
    this.recalculateSrno()
    this.Calc_Totals(0)
    this.checkSettedValue(data)
    this.formatMetalDetailDataGrid()
    if (this.rowUpdationValidate(data)) return
    this.CalculateLoss(this.processTransferdetailsForm.value);
  }
  recalculateSrno() {
    this.metalDetailData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
    })
  }
  rowUpdationValidate(data: any) {
    let form = this.processTransferdetailsForm.value
    if (data.GROSS_WT > this.commonService.emptyToZero(form.FRM_METAL_WT)) {
      this.metalDetailData[data.SRNO - 1].GROSS_WT = form.FRM_METAL_WT
      this.commonService.toastErrorByMsgId(this.commonService.getMsgByID('MSG2037') + `${form.FRM_METAL_WT}`)
      return true
    }
    return false;
  }
  //use: to check if multiple metals are included in component grid
  Multi_Metal() {
    let strDivision = "";
    for (let i = 0; i < this.metalDetailData.length; i++) {
      if (this.metalDetailData[i].METALSTONE.toString().trim() == "M") {
        if (strDivision == "") { strDivision = this.metalDetailData[i].DIVCODE.toString().trim(); }
        else {
          if (this.metalDetailData[i].DIVCODE.toString().trim() != strDivision) return true;
        }
      }
    }
    return false;
  }
  // use: change of loss qty
  lossQtyChange(event: any) {
    let form = this.processTransferdetailsForm.value;
    let msg = this.commonService.getMsgByID('MSG1397')
    if (this.commonService.emptyToZero(form.lossQty) > this.commonService.emptyToZero(form.FRM_METAL_WT)) {
      this.commonService.toastErrorByMsgId(msg + " " + form.FRM_METAL_WT)
      this.setValueWithDecimal('lossQty', 0, 'METAL')
      return
    }
    if (this.commonService.emptyToZero(form.lossQty) > 0) {
      if (this.sequenceDetails.length > 0) {
        let processData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE)
        if (processData[0]?.STD_LOSS > 0) {
          let nMax_Loss = (this.commonService.emptyToZero(form.FRM_METAL_WT) * this.commonService.emptyToZero(processData[0]["MAX_LOSS"])) / 100;
          if (this.commonService.emptyToZero(form.lossQty) > nMax_Loss) {
            this.commonService.toastErrorByMsgId(msg + " " + nMax_Loss)
            this.setValueWithDecimal('lossQty', nMax_Loss, 'METAL')
            return;
          }
          let nMin_Loss = (this.commonService.emptyToZero(form.FRM_METAL_WT) * this.commonService.emptyToZero(processData[0]["MIN_LOSS"])) / 100;
          if (this.commonService.emptyToZero(form.lossQty) < nMin_Loss) {
            this.commonService.toastErrorByMsgId("Loss cannot be less than " + nMin_Loss)
            this.setValueWithDecimal('lossQty', nMin_Loss, 'METAL')
            return;
          }

        } else {
          this.commonService.toastErrorByMsgId(msg + " " + form.FRM_METAL_WT)
        }
      }
      let txtBalDiaGrWt = 0;
      if (this.commonService.emptyToZero(form.lossQty) == 0 && this.commonService.emptyToZero(form.FRM_METAL_WT) > this.commonService.emptyToZero(form.TO_METAL_WT)) {
        if ((this.commonService.emptyToZero(form.TO_METAL_WT) + this.commonService.emptyToZero(form.lossQty)) > this.commonService.emptyToZero(form.FRM_METAL_WT)) {
          let TO_METAL_WT = (this.commonService.emptyToZero(form.FRM_METAL_WT) - this.commonService.emptyToZero(form.lossQty));
          this.setValueWithDecimal('TO_METAL_WT', TO_METAL_WT, 'METAL')
          let GrossWeightTo = (this.commonService.emptyToZero(form.TO_METAL_WT) - this.commonService.emptyToZero(form.TO_STONE_WT) / 5);
          this.setValueWithDecimal('GrossWeightTo', GrossWeightTo, 'METAL')
        }
        else {
          txtBalDiaGrWt = (this.commonService.emptyToZero(form.FRM_METAL_WT) - this.commonService.emptyToZero(form.GrossWeightTo));
        }
      }
      else {
        txtBalDiaGrWt = (this.commonService.emptyToZero(form.GrossWeightFrom) - (this.commonService.emptyToZero(form.GrossWeightTo) + this.commonService.emptyToZero(form.scrapWeight) + this.commonService.emptyToZero(form.lossQty)));
      }
      this.setValueWithDecimal('Balance_WT', txtBalDiaGrWt, 'METAL')
    } else {
      let txtBalDiaGrWt = this.commonService.emptyToZero(form.FRM_METAL_WT) - this.commonService.emptyToZero(form.TO_METAL_WT)
      this.setValueWithDecimal('Balance_WT', txtBalDiaGrWt, 'METAL')
    }
    this.Split_Loss(this.processTransferdetailsForm.value)
  }

  checkSettedValue(data: any) {
    if (data.FRM_PCS > data.PCS) {
      data.FRM_PCS = data.PCS
      this.commonService.toastErrorByMsgId('Setted cannot be greater than pcs')
    }
  }
  checkFromToValues(fromValue: string, ToValue: string) {
    let form = this.processTransferdetailsForm.value
    if (this.commonService.emptyToZero(form[fromValue]) < this.commonService.emptyToZero(form[ToValue])) {
      this.processTransferdetailsForm.controls[ToValue].setValue(form[fromValue])
      this.commonService.toastErrorByMsgId(`Value cannot be greater than ${form[fromValue]}`)
    }
  }
  toStoneWtChange() {

  }
  toMetalWeightChange(fromValue: string, ToValue: string) {
    let form = this.processTransferdetailsForm.value
    if (this.commonService.emptyToZero(form[fromValue]) < this.commonService.emptyToZero(form[ToValue])) {
      this.processTransferdetailsForm.controls[ToValue].setValue(form[fromValue])
      this.commonService.toastErrorByMsgId(this.commonService.getMsgByID('MSG2037') + `${form[fromValue]}`)
      return
    }
    let ToGrossWt = (this.commonService.emptyToZero(form.TO_METAL_WT) + (this.commonService.emptyToZero(form.TO_STONE_WT) / 5));
    this.setValueWithDecimal('GrossWeightTo', ToGrossWt, 'METAL')
    if (this.commonService.emptyToZero(form[fromValue]) == this.commonService.emptyToZero(form[ToValue])) {
      this.setValueWithDecimal('GrossWeightTo', ToGrossWt, 'METAL')
    }
    this.CalculateLoss(this.processTransferdetailsForm.value)
  }
  // use: calculate total values from grid
  // for flag 0 to values only assigned
  Calc_Totals(flag: any) {
    let nPcs = 0;
    let nStWeight = 0;
    let nMPcs = 0;
    let nMWeight = 0;
    try {
      if (this.metalDetailData.length > 0) {
        this.metalDetailData.forEach((item: any, index: any) => {
          item.SRNO = index + 1
          if (item.METALSTONE.toUpperCase() == 'S') {
            nPcs += this.commonService.emptyToZero(item.PCS)
            nStWeight += this.commonService.emptyToZero(item["GROSS_WT"]);

          } else {
            nMPcs += this.commonService.emptyToZero(item["PCS"]);
            nMWeight += this.commonService.emptyToZero(item["GROSS_WT"]);

          }
        })
      }
      if (flag == 0) { // for flag 0 to values only assigned
        this.setValueWithDecimal('TO_STONE_WT', nStWeight, 'STONE')
        this.nullToStringSetValue('TO_STONE_PCS', nPcs)
        this.nullToStringSetValue('TO_METAL_PCS', nMPcs)
        this.setValueWithDecimal('TO_METAL_WT', nMWeight, 'METAL')
        this.setValueWithDecimal('GrossWeightTo', nMWeight + (nStWeight / 5), 'METAL')
        return
      }
      this.setValueWithDecimal('FRM_STONE_WT', nStWeight, 'STONE')
      this.setValueWithDecimal('TO_STONE_WT', nStWeight, 'STONE')
      this.nullToStringSetValue('FRM_STONE_PCS', nPcs)
      this.nullToStringSetValue('TO_STONE_PCS', nPcs)
      if (nMPcs == 0) {
        this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(0)
        this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(0)
      } else {
        this.nullToStringSetValue('FRM_METAL_PCS', nMPcs)
        this.nullToStringSetValue('TO_METAL_PCS', nMPcs)
      }
      this.setValueWithDecimal('FRM_METAL_WT', nMWeight, 'METAL')
      this.setValueWithDecimal('TO_METAL_WT', nMWeight, 'METAL')
      this.setValueWithDecimal('GrossWeightTo', nMWeight + (nStWeight / 5), 'METAL')
    }
    catch (ex: any) {
      this.commonService.toastErrorByMsgId("MSG2100")
    }
  }
  setSubJobAPIDetails(data: any) {
    if (this.designType == 'METAL') {
      this.setMetalFormDetails(data)
      return
    }
    this.nullToStringSetValue('FRM_PROCESS_CODE', data[0].PROCESS)
    this.nullToStringSetValue('FRM_WORKER_CODE', data[0].WORKER)
    this.nullToStringSetValue('FRM_PROCESSNAME', data[0].PROCESSDESC)
    this.nullToStringSetValue('FRM_WORKERNAME', data[0].WORKERDESC)
    this.nullToStringSetValue('REPAIR_PROCESS', data[0].REPAIR_PROCESS)

    let blnAddZirconasGross = this.commonService.getCompanyParamValue('MAKEZIRCONEGROSSWT')
    let dblZircon, txtFromStoneWt, txtFromGrossWeight
    if (blnAddZirconasGross) {
      dblZircon = this.commonService.emptyToZero(data[0].ZIRCON)
      txtFromStoneWt = this.commonService.emptyToZero(data[0].STONE) - dblZircon + (dblZircon * 5);
      txtFromGrossWeight = this.commonService.emptyToZero(data[0].METAL) + (this.commonService.emptyToZero(data[0].STONE) / 5);
    } else {
      dblZircon = this.commonService.emptyToZero(data[0].ZIRCON)
      if (dblZircon > 0) {
        txtFromGrossWeight = (this.commonService.emptyToZero(data[0].METAL) + (this.commonService.emptyToZero(data[0].STONE)));
      }
      else {
        txtFromGrossWeight = (this.commonService.emptyToZero(data[0].METAL) + (this.commonService.emptyToZero(data[0].STONE) / 5));
      }
    }
    this.setValueWithDecimal('GrossWeightFrom', txtFromGrossWeight, 'METAL')

    this.approvalReqFlag = data[0].APPROVAL_REQUIRED ? true : false
    this.nullToStringSetValue('ZIRCON', data[0].ZIRCON)
    this.nullToStringSetValue('DIVCODE', data[0].DIVCODE)
    this.nullToStringSetValue('METALSTONE', data[0].METALSTONE)
    this.nullToStringSetValue('stockCode', '')
    this.nullToStringSetValue('scrapWeight', '')
    // this.nullToStringSetValue('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)
    this.getImageData()
    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.fillStoneDetails()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    // set numeric values with decimals

    this.setValueWithDecimal('PUREWT', data[0].PUREWT, 'AMOUNT')
    this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
  }
  setMetalFormDetails(data: any) {
    this.nullToStringSetValue('METAL_FRM_PROCESS_CODE', data[0].PROCESS)
    this.nullToStringSetValue('METAL_FRM_WORKER_CODE', data[0].WORKER)
    this.nullToStringSetValue('FRM_PROCESSNAME', data[0].FRM_PROCESSNAME)
    this.nullToStringSetValue('FRM_WORKERNAME', data[0].FRM_WORKERNAME)
    this.nullToStringSetValue('JOB_SO_NUMBER', data[0].JOB_SO_NUMBER)
    this.nullToStringSetValue('DIVCODE', data[0].DIVCODE)
    this.nullToStringSetValue('METALSTONE', data[0].METALSTONE)
    // this.nullToStringSetValue('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)
    this.nullToStringSetValue('PICTURE_PATH', data[0].PICTURE_PATH)
    this.nullToStringSetValue('EXCLUDE_TRANSFER_WT', data[0].EXCLUDE_TRANSFER_WT)
    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.fillStoneDetails()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    this.nullToStringSetValue('FRM_METAL_PCS', data[0].JOB_PCS)
    this.nullToStringSetValue('TO_METAL_PCS', data[0].JOB_PCS)
    this.setValueWithDecimal('FRM_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('GrossWeightFrom', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('GrossWeightTo', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('FRM_STONE_WT', data[0].STONE, 'STONE')
    this.setValueWithDecimal('TO_STONE_WT', data[0].STONE, 'STONE')
    this.setValueWithDecimal('PUREWT', data[0].PUREWT, 'AMOUNT')
    this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
  }
  modalReference!: NgbModalRef;
  @ViewChild('transferDetails') public transferDetails!: NgbModal;
  openJobTransferDetails() {
    this.modalReference = this.modalService.open(this.transferDetails, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
    });
  }
  //stockCode Scrap Validate
  stockCodeScrapValidate() {
    if (this.commonService.nullToString(this.processTransferdetailsForm.value.stockCode == '')) return
    let postData = {
      "SPID": "044",
      "parameter": {
        'STRSTOCKCODE': this.commonService.nullToString(this.processTransferdetailsForm.value.stockCode)
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0]?.length > 0) {
          this.locationSearchFlag = true
          let data = result.dynamicData[0]
          this.nullToStringSetValue('MAIN_STOCK_CODE', data[0].MAIN_STOCK_CODE)
          this.nullToStringSetValue('SCRAP_PURITY', data[0].PURITY)
          this.nullToStringSetValue('SCRAP_DIVCODE', data[0].DIVISION)
        } else {
          this.locationSearchFlag = false;
          this.processTransferdetailsForm.controls.scrapWeight.setValue('')
          this.processTransferdetailsForm.controls.stockCode.setValue('')
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  getTimeAndLossDetails() {
    if (this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID == '')) return
    let form = this.processTransferdetailsForm.value;
    let postData = {
      "SPID": "087",
      "parameter": {
        'StrDesignCode': this.commonService.nullToString(form.DESIGN_CODE),
        'strProcess_Code': this.commonService.nullToString(form.FRM_PROCESS_CODE),
        'StrSeq_Code': this.commonService.nullToString(form.SEQ_CODE),
        'strWorker_Code': this.commonService.nullToString(form.FRM_WORKER_CODE),
        'strUNQ_JOB_ID': this.commonService.nullToString(form.UNQ_JOB_ID),
        'strBranchCode': this.commonService.nullToString(this.commonService.branchCode)
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.nullToStringSetValue('TO_PROCESS_CODE', data[0].TO_PROCESS_CODE)
          this.nullToStringSetValue('TO_PROCESSNAME', data[0].TO_PROCESSNAME)
          this.nullToStringSetValue('PRODLAB_ACCODE', data[0].LAB_ACCODE)
          this.nullToStringSetValue('FRM_PCS', this.commonService.emptyToZero(data[0].FRM_PCS))
          this.nullToStringSetValue('TO_PCS', this.commonService.emptyToZero(data[0].FRM_PCS))
          this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
          this.setValueWithDecimal('STD_LOSS', data[0].STD_LOSS, 'AMOUNT')

          // setTimeDetails
          this.processTransferdetailsForm.controls.STD_TIME.setValue(
            this.commonService.convertTimeMinutesToDHM(data[0].STD_TIME)
          )
          this.STDDateTimeData.TIMEINMINUTES = data[0].STD_TIME
          const differenceInMinutes = this.getDifferenceInMinutes(data[0].IN_DATE);
          this.TimeTakenData.TIMEINMINUTES = differenceInMinutes
          this.consumedTimeData.TIMEINMINUTES = differenceInMinutes

          this.processTransferdetailsForm.controls.TIME_TAKEN_HRS.setValue(
            this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
          )
          this.processTransferdetailsForm.controls.consumed.setValue(
            this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
          )
          if (data[0].IN_DATE && data[0].IN_DATE != '') {
            this.processTransferdetailsForm.controls.startdate.setValue(data[0].IN_DATE)
          }
          let date = this.commonService.getCompanyParamValue('PROCESSTIMEVALIDATE')
          this.Calc_TimeDiff()
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  Calc_TimeDiff(): void {
    try {
      let stdTime = this.commonService.emptyToZero(this.STDDateTimeData.TIMEINMINUTES)
      let consumedTime = this.commonService.emptyToZero(this.consumedTimeData.TIMEINMINUTES)
      let variance = consumedTime - stdTime > 0 ? (consumedTime - stdTime) : 0;
      this.processTransferdetailsForm.controls.variance.setValue(variance)
      if (variance > 0 && stdTime > 0) {
        let variancePercentage = ((variance / stdTime) * 100).toFixed(2)
        this.processTransferdetailsForm.controls.variancePercentage.setValue(variancePercentage)
      } else {
        this.processTransferdetailsForm.controls.variancePercentage.setValue(0)
      }

    } catch (error: any) {
      this.commonService.toastErrorByMsgId("MSG2100");
    }
  }
  getDifferenceInMinutes(indate: string): number {
    // Parse the given date-time string into a Date object
    const inDate = new Date(indate);
    // Get the current date-time as a Date object
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const differenceInMillis = currentDate.getTime() - inDate.getTime();
    // Convert the difference from milliseconds to minutes
    const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));
    return differenceInMinutes;
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
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
          if (data) {
            this.metalDetailData = data
            this.Calc_Totals(1)
            this.formatMetalDetailDataGrid()
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  formatMetalDetailDataGrid() {
    this.metalDetailData.forEach((element: any) => {
      element.SETTED_FLAG = false
      element.GEN = 'GEN'
      element.FROM_STOCK_CODE = element.STOCK_CODE,
        element.FROM_SUB_STOCK_CODE = element.SUB_STOCK_CODE,
        element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.commonService.setCommaSerperatedNumber(element.STONE_WT, 'STONE')
      element.PURITY = this.commonService.setCommaSerperatedNumber(element.PURITY, 'PURITY')
      element.LOSS_QTY = this.commonService.setCommaSerperatedNumber(element.LOSS_QTY, 'THREE')
      element.CURRENCY_RATE = this.commonService.setCommaSerperatedNumber(element.CURRENCY_RATE, 'RATE')
      element.AMOUNTLC = this.commonService.setCommaSerperatedNumber(element.AMOUNTLC, 'AMOUNT')
      element.AMOUNTFC = this.commonService.setCommaSerperatedNumber(element.AMOUNTFC, 'AMOUNT')
    });
  }
  /**USE: barcode Number Validate API call */
  barcodeNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "041",
      "parameter": {
        'BLNPROCESS': this.commonService.nullToString(this.processTransferdetailsForm.value.toggleSwitchtIssue ? 1 : 0),
        'STRBRANCH': this.commonService.nullToString(this.branchCode),
        'STRYEARMONTH': this.commonService.nullToString('2008'),
        'TXTISSUEREF': this.commonService.nullToString(event.target.value)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          console.log(data, 'data');

          if (data[0]) {

          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
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
    if (FORMNAME == 'FRM_PROCESS_CODE') {
      this.setFromProcessWhereCondition()
    }
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
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = result.dynamicData[0]
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let result = this.commonService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
            if (result && result.length == 0) {
              this.commonService.toastErrorByMsgId('No data found')
              this.processTransferdetailsForm.controls[FORMNAME].setValue('')
              LOOKUPDATA.SEARCH_VALUE = ''
            }
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('No data found')
          this.processTransferdetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
  selectAllBtnChange(event: any) {
    console.log(event);
    this.metalDetailData.forEach((item: any) => {
      if (event.target.checked) {
        item.SETTED_FLAG = true;
      } else {
        item.SETTED_FLAG = false;
      }
    })
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(event.PROCESS)
    this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(event.Description)
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    let data = this.subJobDetailData.filter((item: any) => event.PROCESS == item.PROCESS && event.WORKER == item.WORKER)
    if (data && data.length > 0) {
      this.setSubJobAPIDetails(data)
    } else {
      this.commonService.toastErrorByMsgId('no data found')
    }
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
    this.processTransferdetailsForm.controls.TO_WORKERNAME.setValue(event.DESCRIPTION)
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
  }

  metalworkerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_WORKER_CODE.setValue(event.WORKER_CODE)
  }

  metalworkerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_WORKERNAME.setValue(event.DESCRIPTION)
  }
  stockCodeSelected(event: any) {
    this.processTransferdetailsForm.controls.stockCode.setValue(event.STOCK_CODE)
    if (event.STOCK_CODE) {
      this.locationSearchFlag = true;
    }
    this.stockCodeScrapValidate()
  }
  locationSelected(event: any) {
    this.processTransferdetailsForm.controls.location.setValue(event.Location)
  }
  userDetailNetSelected(event: any) {
    this.processTransferdetailsForm.controls.APPROVED_USER.setValue(event.UsersName)
  }

  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(event.job_number)
    this.processTransferdetailsForm.controls.JOB_DESCRIPTION.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  submitValidations(form: any): boolean {
    if (this.commonService.nullToString(form.JOB_NUMBER) == '') {
      this.commonService.toastErrorByMsgId('Job number cannot be empty')
      return true;
    }
    if (this.commonService.nullToString(form.TO_WORKER_CODE) == '') {
      this.commonService.toastErrorByMsgId('To worker code cannot be empty')
      return true;
    }
    if (this.commonService.nullToString(form.TO_PROCESS_CODE) == '') {
      this.commonService.toastErrorByMsgId('To process code cannot be empty')
      return true;
    }
    return false;
  }
  /**USE: SUBMIT detail */
  formSubmit(flag: any) {
    if (this.submitValidations(this.processTransferdetailsForm.value)) return;
    this.calculateGain()
    this.processTransferdetailsForm.controls.FLAG.setValue(flag)

    let detailDataToParent: any = {
      PROCESS_FORMDETAILS: this.processTransferdetailsForm.value,
      TRN_STNMTL_GRID: this.metalDetailData,
      JOB_PROCESS_TRN_DETAIL_DJ: this.setJOB_PROCESS_TRN_DETAIL_DJ(),
      JOB_PROCESS_TRN_COMP_DJ: this.setJOB_PROCESS_TRN_COMP_DJ(),
      JOB_PROCESS_TRN_LABCHRG_DJ: this.setLabourChargeDetails()
    }
    this.saveDetail.emit(detailDataToParent);
    if (flag == 'CONTINUE') {
      this.resetPTFDetails()
    }
  }
  resetPTFDetails() {
    this.processTransferdetailsForm.reset()
    this.metalDetailData = []
  }
  multiplyWithAmtDecimal(a: any, b: any) {
    let val = this.commonService.emptyToZero(a) * this.commonService.emptyToZero(b)
    return this.commonService.emptyToZero(val.toFixed(3))
  }
  gridSRNO: number = 0
  setJOB_PROCESS_TRN_DETAIL_DJ() {
    let form = this.processTransferdetailsForm.value;
    let LOSS_PURE_QTY = this.calculateLossPureQty(this.processTransferdetailsForm.value);
    let metalGridDataSum = this.calculateMetalStoneGridAmount();
    let seqDataFrom = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE);
    let seqDataTo = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.TO_PROCESS_CODE);
    let scrapPureWt = this.commonService.emptyToZero(Number(form.scrapWeight) * Number(form.SCRAP_PURITY))
    // let amountFC = this.commonService.FCToCC(form.CURRENCY_CODE, stoneAmount)
    // console.log(this.commonService.timeToMinutes(form.consumed), 'time consumed');
    this.gridSRNO += 1
    return {
      "SRNO": this.commonService.emptyToZero(form.SRNO),
      "UNIQUEID": 0,
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "JOB_NUMBER": this.commonService.nullToString(form.JOB_NUMBER),
      "JOB_DATE": this.commonService.nullToString(form.JOB_DATE),
      "UNQ_JOB_ID": this.commonService.nullToString(form.UNQ_JOB_ID),
      "UNQ_DESIGN_ID": this.commonService.nullToString(form.UNQ_DESIGN_ID),
      "DESIGN_CODE": this.commonService.nullToString(form.DESIGN_CODE),
      "SEQ_CODE": this.commonService.nullToString(form.SEQ_CODE),
      "JOB_DESCRIPTION": this.commonService.nullToString(form.JOB_DESCRIPTION),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "FRM_PROCESS_CODE": this.commonService.nullToString(form.FRM_PROCESS_CODE),
      "FRM_PROCESSNAME": this.commonService.nullToString(form.FRM_PROCESSNAME),
      "FRM_WORKER_CODE": this.commonService.nullToString(form.FRM_WORKER_CODE),
      "FRM_WORKERNAME": this.commonService.nullToString(form.FRM_WORKERNAME),
      "FRM_PCS": this.commonService.emptyToZero(form.FRM_PCS),
      "FRM_STONE_WT": this.commonService.emptyToZero(form.FRM_STONE_WT),
      "FRM_STONE_PCS": this.commonService.emptyToZero(form.FRM_STONE_PCS),
      "FRM_METAL_WT": this.commonService.emptyToZero(form.FRM_METAL_WT),
      "FRM_METAL_PCS": this.commonService.emptyToZero(form.FRM_METAL_PCS),
      "FRM_PURE_WT": this.multiplyWithAmtDecimal(form.FRM_METAL_WT, form.PURITY),
      "FRM_NET_WT": this.commonService.emptyToZero(form.FRM_METAL_WT),
      "TO_PROCESS_CODE": this.commonService.nullToString(form.TO_PROCESS_CODE),
      "TO_PROCESSNAME": this.commonService.nullToString(form.TO_PROCESSNAME),
      "TO_WORKER_CODE": this.commonService.nullToString(form.TO_WORKER_CODE),
      "TO_WORKERNAME": this.commonService.nullToString(form.TO_WORKERNAME),
      "TO_PCS": this.commonService.emptyToZero(form.TO_PCS),
      "TO_METAL_PCS": this.commonService.emptyToZero(form.TO_METAL_PCS),
      "TO_STONE_WT": this.commonService.emptyToZero(form.TO_STONE_WT),
      "TO_STONE_PCS": this.commonService.emptyToZero(form.TO_STONE_PCS),
      "TO_METAL_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "TO_PURE_WT": this.multiplyWithAmtDecimal(form.TO_METAL_WT, form.PURITY),
      "TO_NET_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "LOSS_QTY": this.commonService.emptyToZero(form.lossQty),
      "LOSS_PURE_QTY": this.commonService.emptyToZero(LOSS_PURE_QTY),
      "STONE_AMOUNTFC": this.commonService.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "STONE_AMOUNTLC": this.commonService.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "METAL_AMOUNTFC": this.commonService.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "METAL_AMOUNTLC": this.commonService.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "TOTAL_AMOUNTFC": this.commonService.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "TOTAL_AMOUNTLC": this.commonService.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "COSTFC_PER_PCS": 0,
      "COSTLC_PER_PCS": 0,
      "LAB_CODE": "",
      "LAB_UNIT": "",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0]?.LAB_ACCODE) : '',
      "LOSS_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].LOSS_ACCODE) : '',
      "FRM_WIP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].WIP_ACCODE) : '',
      "TO_WIP_ACCODE": seqDataTo.length > 0 ? this.commonService.nullToString(seqDataTo[0].WIP_ACCODE) : '',
      "RET_METAL_DIVCODE": "",
      "RET_METAL_STOCK_CODE": "",
      "RET_STONE_DIVCODE": "",
      "RET_STONE_STOCK_CODE": "",
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
      "IN_DATE": this.commonService.formatDateTime(form.startdate),
      "OUT_DATE": this.commonService.formatDateTime(form.enddate),
      "TIME_TAKEN_HRS": this.commonService.emptyToZero(this.TimeTakenData.TIMEINMINUTES),
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": this.commonService.nullToString(form.location),
      "PICTURE_PATH": this.commonService.nullToString(form.PICTURE_PATH),
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "JOB_PCS": this.commonService.emptyToZero(form.JOB_PCS),
      "STONE_WT": this.commonService.emptyToZero(form.TO_STONE_WT),
      "STONE_PCS": this.commonService.emptyToZero(form.TO_STONE_PCS),
      "METAL_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "METAL_PCS": this.commonService.emptyToZero(form.TO_METAL_PCS),
      "PURE_WT": this.multiplyWithAmtDecimal(form.TO_METAL_WT, form.PURITY),
      "GROSS_WT": this.commonService.emptyToZero(form.GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE),
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(form.remarks),
      "TREE_NO": this.commonService.nullToString(form.TREE_NO),
      "STD_TIME": this.commonService.emptyToZero(this.STDDateTimeData.TIMEINMINUTES),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": this.commonService.nullToString(form.PRODLAB_ACCODE),
      "DT_BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "ISSUE_REF": this.commonService.nullToString(form.barCodeNumber),
      "IS_AUTHORISE": false,
      "TIME_CONSUMED": this.commonService.emptyToZero(this.consumedTimeData.TIMEINMINUTES),
      "SCRAP_STOCK_CODE": this.commonService.nullToString(form.stockCode),
      "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
      "SCRAP_PURITY": this.commonService.emptyToZero(form.SCRAP_PURITY),
      "SCRAP_WT": this.commonService.emptyToZero(form.scrapWeight),
      "SCRAP_PURE_WT": scrapPureWt,
      "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(form.scrapWeight) - Number(form.PURITY)) * scrapPureWt),
      "SCRAP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "APPROVED_DATE": this.commonService.formatDateTime(form.approveddate),
      "APPROVED_USER": this.commonService.nullToString(form.APPROVED_USER),
      "SCRAP_PCS": this.commonService.emptyToZero(form.METAL_ScrapPCS),
      "SCRAP_STONEWT": this.commonService.emptyToZero(form.METAL_ScrapStoneWt),
      "SCRAP_NETWT": this.commonService.emptyToZero(form.METAL_ScrapNetWt),
      "FROM_IRONWT": this.commonService.emptyToZero(form.METAL_FromIronWeight),
      "FROM_MSTOCKCODE": this.commonService.nullToString(form.METAL_FromStockCode),
      "TO_MSTOCKCODE": this.commonService.nullToString(form.METAL_ToStockCode),
      "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
      "TO_IRONWT": this.commonService.emptyToZero(form.METAL_ToIronWt),
      "FRM_DIAGROSS_WT": this.commonService.emptyToZero(form.GrossWeightFrom),
      "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
      "SCRAP_DIVCODE": this.commonService.nullToString(form.SCRAP_DIVCODE),
      "IRON_SCRAP_WT": this.calculateIronScrapWeight(form),
      "GAIN_WT": this.commonService.emptyToZero(form.METAL_GainGrWt),
      "GAIN_PURE_WT": this.commonService.emptyToZero(form.METAL_GainPureWt),
      "GAIN_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "IS_REJECT": false,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": ""
    }
  }
  /**USE:  calculate Metal Grid Sum of data*/
  calculateMetalStoneGridAmount() {
    let stoneAmount: number = 0
    let metalAmount: number = 0
    let totalAmount: number = 0
    this.metalDetailData.forEach((item: any) => {
      totalAmount += this.commonService.emptyToZero(item.AMOUNTFC);
      if (item.METALSTONE == 'S') {
        stoneAmount += this.commonService.emptyToZero(item.AMOUNTFC);
      }
      if (item.METALSTONE == 'M') {
        metalAmount += this.commonService.emptyToZero(item.AMOUNTFC);
      }
    })
    return {
      STONE_AMOUNTLC: this.commonService.emptyToZero(stoneAmount.toFixed(2)),
      METAL_AMOUNTLC: this.commonService.emptyToZero(metalAmount.toFixed(2)),
      TOTAL_AMOUNTLC: this.commonService.emptyToZero(totalAmount.toFixed(2))
    }
  }

  private calculateIronScrapWeight(data: any): number {
    let toIronScrapWt = (this.commonService.emptyToZero(data.METAL_FromIronWeight) + this.commonService.emptyToZero(data.METAL_FromNetWeight))
    toIronScrapWt = toIronScrapWt * (this.commonService.emptyToZero(data.METAL_ScrapGrWt) - this.commonService.emptyToZero(data.METAL_ScrapStoneWt));
    toIronScrapWt = this.commonService.emptyToZero(data.METAL_FromIronWeight) / this.commonService.emptyToZero(data.METAL_ToIronScrapWt)
    return this.commonService.emptyToZero(toIronScrapWt)
  }
  //calculate Loss Pure Qty
  private calculateLossPureQty(detailScreenData: any): number {
    detailScreenData.lossQty = this.commonService.emptyToZero(detailScreenData.lossQty);
    detailScreenData.PURITY = this.commonService.emptyToZero(detailScreenData.PURITY);
    let value = detailScreenData.lossQty * detailScreenData.PURITY
    return this.commonService.emptyToZero(value)
  }
  /**USE: set details from detail screen */
  setJOB_PROCESS_TRN_COMP_DJ() {
    let data: any[] = []
    data.push(...this.InsertStoneDetail(1)) // for positive Grosswt
    data.push(...this.InsertStoneDetail(2)) // for negative grosswt
    return data
  }

  InsertStoneDetail(flag: any): any[] {
    let form = this.processTransferdetailsForm.value;
    let scrapPureWt = this.commonService.emptyToZero(Number(form.scrapWeight) * Number(form.SCRAP_PURITY))
    let seqData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE);
    let LOSS_QTY = flag == 2 ? this.commonService.emptyToZero(form.lossQty) * -1 : 0;
    let SCRAP_WT = flag == 2 ? this.commonService.emptyToZero(form.scrapWeight) * -1 : 0;
    let SCRAP_PURE_WT = flag == 2 ? this.commonService.emptyToZero(scrapPureWt) * -1 : 0;
    let GAIN_WT = flag == 2 ? this.commonService.emptyToZero(form.METAL_GainGrWt) * -1 : 0;
    let GAIN_PURE_WT = flag == 2 ? this.commonService.emptyToZero(form.METAL_GainPureWt) * -1 : 0;
    let LOSS_PURE_WT = flag == 2 ? this.commonService.emptyToZero(form.LOSS_QTY * form.PURITY) * -1 : 0;
    let ADJUST_PUREWT = 0

    let data: any[] = []
    this.metalDetailData.forEach((element: any) => {
      data.push({
        "VOCNO": this.commonService.emptyToZero(form.VOCNO),
        "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
        "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
        "JOB_NUMBER": this.commonService.nullToString(form.JOB_NUMBER),
        "JOB_SO_NUMBER": this.commonService.emptyToZero(form.JOB_SO_NUMBER),
        "UNQ_JOB_ID": this.commonService.nullToString(form.UNQ_JOB_ID),
        "JOB_DESCRIPTION": this.commonService.nullToString(form.JOB_DESCRIPTION),
        "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
        "DESIGN_CODE": this.commonService.nullToString(form.DESIGN_CODE),
        "METALSTONE": this.commonService.nullToString(element.METALSTONE),
        "DIVCODE": this.commonService.nullToString(element.DIVCODE),
        "STOCK_CODE": this.commonService.nullToString(element.STOCK_CODE),
        "STOCK_DESCRIPTION": this.commonService.nullToString(element.STOCK_DESCRIPTION),
        "COLOR": this.commonService.nullToString(element.COLOR),
        "CLARITY": this.commonService.nullToString(element.CLARITY),
        "SHAPE": this.commonService.nullToString(element.SHAPE),
        "SIZE": this.commonService.nullToString(element.SIZE),
        "PCS": flag == 2 ? this.commonService.emptyToZero(element.PCS) * -1 : this.commonService.emptyToZero(element.PCS),
        "GROSS_WT": flag == 2 ? this.commonService.emptyToZero(element.GROSS_WT) * -1 : this.commonService.emptyToZero(element.GROSS_WT),
        "STONE_WT": flag == 2 ? this.commonService.emptyToZero(element.STONE_WT) * -1 : this.commonService.emptyToZero(element.STONE_WT),
        "NET_WT": flag == 2 ? this.commonService.emptyToZero(element.NET_WT) * -1 : this.commonService.emptyToZero(element.NET_WT),
        "RATE": this.commonService.emptyToZero(element.AMOUNTFC) / this.commonService.emptyToZero(element.GROSS_WT),
        "AMOUNT": 0,
        "PROCESS_CODE": flag == 2 ? this.commonService.nullToString(form.FRM_PROCESS_CODE) : form.TO_PROCESS_CODE,
        "WORKER_CODE": flag == 2 ? this.commonService.nullToString(form.FRM_WORKER_CODE) : form.TO_WORKER_CODE,
        "UNQ_DESIGN_ID": this.commonService.nullToString(form.UNQ_DESIGN_ID),
        "REFMID": 0,
        "AMOUNTLC": flag == 2 ? this.commonService.emptyToZero(element.AMOUNTLC) * -1 : this.commonService.emptyToZero(element.AMOUNTLC),
        "AMOUNTFC": flag == 2 ? this.commonService.emptyToZero(element.AMOUNTFC) * -1 : this.commonService.emptyToZero(element.AMOUNTFC),
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "CURRENCY_CODE": this.commonService.nullToString(element.CURRENCY_CODE),
        "CURRENCY_RATE": this.commonService.getCurrRate(element.CURRENCY_CODE),
        "YEARMONTH": this.commonService.yearSelected,
        "LOSS_QTY": LOSS_QTY,
        "LABOUR_CODE": this.commonService.nullToString(element.lab_accode),
        "LAB_RATE": this.commonService.emptyToZero(element.LAB_RATE),
        "LAB_AMT": this.commonService.emptyToZero(element.LAB_AMT),
        "BRKSTN_STOCK_CODE": "",
        "BRKSTN_DIVISION_CODE": "",
        "BRKSTN_WEIGHT": 0,
        "BRKSTN_RATEFC": 0,
        "BRKSTN_RATELC": 0,
        "BRKSTN_AMTFC": 0,
        "BRKSTN_AMTLC": 0,
        "MAIN_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE),
        "FRM_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE),
        "FRM_PROCESS": this.commonService.nullToString(form.FRM_PROCESS_CODE),
        "CRACCODE": "",
        "LAB_ACCODE": this.commonService.nullToString(element.lab_accode),
        "LAB_AMTFC": this.commonService.emptyToZero(element.LAB_AMT),
        "TO_PROCESS": this.commonService.nullToString(form.TO_PROCESS_CODE),
        "TO_WORKER": this.commonService.nullToString(form.TO_WORKER_CODE),
        "LAB_RATEFC": this.commonService.emptyToZero(element.LAB_RATE),
        "RATEFC": this.commonService.emptyToZero(element.RATEFC),
        "PRINTED": false,
        "PUREWT": flag == 2 ? (this.commonService.emptyToZero(element.NET_WT) * this.commonService.emptyToZero(element.PURITY)) * -1 : (this.commonService.emptyToZero(element.NET_WT) * this.commonService.emptyToZero(element.PURITY)),
        "PURITY": this.commonService.emptyToZero(element.PURITY),
        "SQLID": "",
        "ISBROCKEN": 0,
        "TREE_NO": '',
        "SETTED": element.SETTED_FLAG,
        "SETTED_PCS": flag == 2 ? this.commonService.emptyToZero(element.FRM_PCS) * -1 : 0,
        "SIEVE": this.commonService.nullToString(element.SIEVE),
        "FULL_RECOVERY": 0,
        "RECOVERY_DATE": "",
        "RECOV_LOSS": 0,
        "RECOV_LOSS_PURE": 0,
        "BROKENSTONE_PCS": 0,
        "BROKENSTONE_WT": 0,
        "ISMISSING": 0,
        "PROCESS_TYPE": "GEN",
        "IS_AUTHORISE": form.FRM_PROCESS_CODE == form.TO_PROCESS && form.FRM_WORKER_CODE != form.TO_WORKER_CODE ? true : false,
        "SUB_STOCK_CODE": this.commonService.nullToString(element.SUB_STOCK_CODE),
        "KARAT_CODE": this.commonService.nullToString(element.KARAT_CODE),
        "SIEVE_SET": this.commonService.nullToString(element.SIEVE_SET),
        "SCRAP_STOCK_CODE": this.checkScrapStockCode(form.stockCode, element.STOCK_CODE, element.METALSTONE),
        "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
        "SCRAP_PURITY": this.commonService.emptyToZero(form.SCRAP_PURITY),
        "SCRAP_WT": SCRAP_WT,
        "SCRAP_PURE_WT": SCRAP_PURE_WT,
        "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(form.scrapWeight) - Number(form.PURITY)) * scrapPureWt),
        "SCRAP_ACCODE": seqData.length > 0 ? this.commonService.nullToString(seqData[0].GAIN_AC) : '',
        "SYSTEM_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
        "ISSUE_GROSS_WT": flag == 2 ? this.commonService.emptyToZero(element.GROSS_WT) * -1 : this.commonService.emptyToZero(element.GROSS_WT),
        "ISSUE_STONE_WT": flag == 2 ? this.commonService.emptyToZero(element.STONE_WT) * -1 : this.commonService.emptyToZero(element.STONE_WT),
        "ISSUE_NET_WT": flag == 2 ? this.commonService.emptyToZero(element.NET_WT) * -1 : this.commonService.emptyToZero(element.NET_WT),
        "JOB_PCS": 0,
        "DESIGN_TYPE": form.DESIGN_TYPE?.toUpperCase() == 'METAL' ? this.commonService.nullToString(form.DESIGN_TYPE) : '',
        "TO_STOCK_CODE": this.commonService.nullToString(form.METAL_ToStockCode),
        "FROM_STOCK_CODE": this.commonService.nullToString(element.FROM_STOCK_CODE),
        "FROM_SUB_STOCK_CODE": this.commonService.nullToString(element.FROM_SUB_STOCK_CODE),
        "LOSS_PURE_WT": LOSS_PURE_WT,
        "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
        "IRON_WT": flag == 2 ? this.commonService.emptyToZero(element.IRON_WT) * -1 : 0,
        "IRON_SCRAP_WT": flag == 2 ? this.commonService.emptyToZero(form.METAL_ToIronScrapWt) * -1 : 0,
        "GAIN_WT": GAIN_WT,
        "GAIN_PURE_WT": GAIN_PURE_WT,
        "IS_REJECT": false,
        "REASON": "",
        "REJ_REMARKS": "",
        "ATTACHMENT_FILE": "",
        "AUTHORIZE_TIME": "",
        "REPAIR_PROCESS": false
      })
    });
    console.log(data, 'data');

    return data
  }
  setIssueGrossWt(element: any, flag: any) {
    if (element.METALSTONE == 'M') {
      return flag == 2 ? this.commonService.emptyToZero(element.GROSS_WT) * -1 : this.commonService.emptyToZero(element.GROSS_WT)
    }
    return 0
  }
  setIssueStoneWt(element: any, flag: any) {
    if (element.METALSTONE == 'M') {
      return flag == 2 ? this.commonService.emptyToZero(element.STONE_WT) * -1 : this.commonService.emptyToZero(element.STONE_WT)
    }
    return 0
  }
  setIssueNetWt(element: any, flag: any) {
    if (element.METALSTONE == 'M') {
      return flag == 2 ? this.commonService.emptyToZero(element.NET_WT) * -1 : this.commonService.emptyToZero(element.NET_WT)
    }
    return 0
  }
  checkScrapStockCode(stockCode: any, GridstockCode: any, METALSTONE: any) {
    try {
      if (stockCode == GridstockCode && METALSTONE.toUpperCase() == 'M') return stockCode;
      return ''
    } catch (error) {
      return ''
    }
  }
  setLabourChargeDetails() {
    let form = this.processTransferdetailsForm.value
    return {
      "REFMID": 0,
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "SRNO": this.commonService.emptyToZero(form.SRNO),
      "JOB_NUMBER": this.commonService.nullToString(form.JOB_NUMBER),
      "STOCK_CODE": this.commonService.nullToString(form.stockCode),
      "UNQ_JOB_ID": this.commonService.nullToString(form.UNQ_JOB_ID),
      "METALSTONE": this.commonService.nullToString(form.METALSTONE),
      "DIVCODE": this.commonService.nullToString(form.DIVCODE),
      "PCS": 0,
      "GROSS_WT": 0,
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_ACCODE": "",
      "LAB_AMTFC": 0,
      "UNITCODE": ""
    }
  }
  showConfirmationDialog(msg: string): Promise<any> {
    return Swal.fire({
      title: msg,
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes'
    });
  }
  scrapWeightChange(event: any) {
    let form = this.processTransferdetailsForm.value;
    if (this.commonService.emptyToZero(form.scrapWeight) > this.commonService.emptyToZero(form.lossQty)) {
      let msg = this.commonService.getMsgByID('MSG7921')
      this.showConfirmationDialog(msg).then((result) => {
        if (result.isConfirmed) {
          this.checkfromMetalScrapWeight(this.processTransferdetailsForm.value)
        } else {
          this.setValueWithDecimal('scrapWeight', 0, 'METAL')
          this.CalculateLoss(this.processTransferdetailsForm.value)
        }
      })
    } else {
      this.checkfromMetalScrapWeight(this.processTransferdetailsForm.value)
    }
  }
  checkfromMetalScrapWeight(form: any) {
    if (this.commonService.emptyToZero(form.scrapWeight) > this.commonService.emptyToZero(form.FRM_METAL_WT)) {
      let msg = this.commonService.getMsgByID('MSG7922')
      this.showConfirmationDialog(msg).then((result) => {
        if (result.isConfirmed) {
          this.setScrapPureWt(this.processTransferdetailsForm.value)
        } else {
          this.setValueWithDecimal('scrapWeight', 0, 'METAL')
          this.CalculateLoss(this.processTransferdetailsForm.value)
        }
      })
    } else {
      this.setScrapPureWt(this.processTransferdetailsForm.value)
    }
  }
  setScrapPureWt(form: any) {
    let SCRAP_PURE_WT = this.commonService.emptyToZero(form.scrapWeight) * this.commonService.emptyToZero(form.SCRAP_PURITY);
    this.setValueWithDecimal('SCRAP_PURE_WT', SCRAP_PURE_WT, 'METAL')
    this.CalculateLoss(this.processTransferdetailsForm.value)
  }
  GrossWeightToChange(event: any) {
    // this.checkFromToValues('GrossWeightFrom', 'GrossWeightTo')
    let form = this.processTransferdetailsForm.value;
    let scrapTot = (this.commonService.emptyToZero(form.GrossWeightTo) + this.commonService.emptyToZero(form.scrapWeight))
    if (this.commonService.emptyToZero(form.GrossWeightTo) > this.commonService.emptyToZero(form.GrossWeightFrom)) {
      let msg = this.commonService.getMsgByID('MSG1312')
      this.commonService.toastErrorByMsgId(msg + ' ' + form.GrossWeightFrom)
      this.setValueWithDecimal('GrossWeightTo', form.GrossWeightFrom, 'METAL')
      return
    } else if (this.commonService.emptyToZero(form.scrapWeight) != 0 && scrapTot > this.commonService.emptyToZero(form.GrossWeightFrom)) {
      let msg = this.commonService.getMsgByID('MSG7921')
      this.commonService.toastErrorByMsgId(msg + ' ' + form.GrossWeightTo)
      this.setValueWithDecimal('scrapWeight', 0, 'METAL')
      this.CalculateLoss(this.processTransferdetailsForm.value)
      return
    }
    this.CalculateLoss(this.processTransferdetailsForm.value)
  }
  CalculateLoss(form: any) {
    let processData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE)
    let blnLoss = this.commonService.emptyToZero(processData[0].STD_LOSS) != 0 ? true : false;
    if (blnLoss) {
      let lossQty = this.commonService.emptyToZero(form.GrossWeightFrom) - (this.commonService.emptyToZero(form.GrossWeightTo) + this.commonService.emptyToZero(form.scrapWeight));
      let toMetalWt = (this.commonService.emptyToZero(form.FRM_METAL_WT) - (this.commonService.emptyToZero(lossQty) + this.commonService.emptyToZero(form.scrapWeight)));
      this.setValueWithDecimal('lossQty', lossQty, 'METAL')
      this.setValueWithDecimal('TO_METAL_WT', toMetalWt, 'METAL')
      this.setValueWithDecimal('GAIN_WT', 0, 'METAL')
      this.setValueWithDecimal('GAIN_PURE_WT', 0, 'METAL')
    } else {
      let dblStoneWt = 0
      this.metalDetailData.forEach((item: any) => {
        if (item.DIVCODE == 'Z' && item.METALSTONE == 'S') {
          dblStoneWt += this.commonService.emptyToZero(item.GROSS_WT) * 5
        } else if (item.DIVCODE != 'Z' && item.METALSTONE == 'S') {
          dblStoneWt += this.commonService.emptyToZero(item.GROSS_WT)
        }
      })
      let txtToMetalWt = (this.commonService.emptyToZero(form.GrossWeightTo) - (dblStoneWt / 5));
      this.setValueWithDecimal('TO_METAL_WT', txtToMetalWt, 'METAL')
    }
    form = this.processTransferdetailsForm.value;
    let Balance_WT = (this.commonService.emptyToZero(form.GrossWeightFrom) - (this.commonService.emptyToZero(form.GrossWeightTo) + this.commonService.emptyToZero(form.scrapWeight) + this.commonService.emptyToZero(form.lossQty)));
    this.setValueWithDecimal('Balance_WT', Balance_WT, 'METAL')
    if (this.Multi_Metal()) {
      this.Split_Loss_New
    } else {
      this.Split_Loss(this.processTransferdetailsForm.value)
    }
  }
  Split_Loss(form: any) {
    if (form.METAL_STOCK_CODE != '') {
      let bFlag = false;
      let k = 0;
      let dblMaster_Metal = 0;
      let dblSub_Metal = 0;

      for (let i = 0; i < this.metalDetailData.length; i++) {
        console.log('fired');

        if (this.metalDetailData[i].METALSTONE == "M") {
          if (this.commonService.emptyToZero(form.lossQty) == 0) { this.metalDetailData[i].LOSS_QTY = 0; }
          if (form.METAL_STOCK_CODE?.toUpperCase().trim() == this.metalDetailData[i].STOCK_CODE?.toUpperCase().trim()) {
            dblMaster_Metal = this.commonService.emptyToZero(this.metalDetailData[i].GROSS_WT) + this.commonService.emptyToZero(this.metalDetailData[i].LOSS_QTY);
            k = i;
            bFlag = true;
          } else {
            dblSub_Metal = dblSub_Metal + this.commonService.emptyToZero(this.metalDetailData[i].GROSS_WT);
          }
        }
      }
      if (this.commonService.emptyToZero(form.lossQty) >= dblMaster_Metal) {
        let msg = this.commonService.getMsgByID("MSG1397")
        this.commonService.toastErrorByMsgId(msg + " " + dblMaster_Metal);
        this.setValueWithDecimal('TO_METAL_WT', form.FRM_METAL_WT, 'AMOUNT')
        this.setValueWithDecimal('GrossWeightTo', form.GrossWeightFrom, 'AMOUNT')
        this.setValueWithDecimal('lossQty', 0, 'AMOUNT')
      }
      if (bFlag) {
        this.metalDetailData[k].GROSS_WT = (this.commonService.emptyToZero(form.TO_METAL_WT) - dblSub_Metal);
        this.metalDetailData[k].NET_WT = this.commonService.emptyToZero(this.metalDetailData[k].GROSS_WT) - this.commonService.emptyToZero(this.metalDetailData[k].STONE_WT);
        this.metalDetailData[k].LOSS_QTY = this.commonService.decimalQuantityFormat(form.lossQty, 'METAL');
      } else {
        let msg = this.commonService.getMsgByID("MSG7611")
        this.commonService.toastErrorByMsgId(msg);
        this.setValueWithDecimal('TO_METAL_WT', form.FRM_METAL_WT, 'AMOUNT')
        this.setValueWithDecimal('GrossWeightTo', form.GrossWeightFrom, 'AMOUNT')
        this.setValueWithDecimal('lossQty', 0, 'AMOUNT')
      }

      let lossQtyper = 0
      if (this.commonService.emptyToZero(form.lossQty) > 0) {
        lossQtyper = ((this.commonService.emptyToZero(form.lossQty) / this.commonService.emptyToZero(form.FRM_METAL_WT)) * 100);
        this.setValueWithDecimal('lossQtyper', lossQtyper, 'AMOUNT')
      } else {
        this.setValueWithDecimal('lossQtyper', 0, 'AMOUNT')
      }
      //set loss qty to grid
      // if (this.metalDetailData.length > 0) {
      //   this.metalDetailData.forEach((item: any) => {
      //     if (item.METALSTONE == 'M' && lossQtyper > 0) {
      //       item.LOSS_QTY = form.lossQty
      //       item.GROSS_WT = form.TO_METAL_WT
      //     }
      //   })
      // }
    } else {
      let msg = this.commonService.getMsgByID("MSG7611")
      this.commonService.toastErrorByMsgId(msg);
      this.setValueWithDecimal('TO_METAL_WT', form.FRM_METAL_WT, 'AMOUNT')
      this.setValueWithDecimal('GrossWeightTo', form.GrossWeightFrom, 'AMOUNT')
      this.setValueWithDecimal('lossQty', 0, 'AMOUNT')
    }
  }

  Split_Loss_New() {
    let form = this.processTransferdetailsForm.value;
    try {
      let dblTotalMetal_Wt: number = this.commonService.emptyToZero(form.FRM_METAL_WT);
      let dblLoss_Wt: number = this.commonService.emptyToZero(form.lossQty);
      let dblScrap_Wt: number = this.commonService.emptyToZero(form.scrapWeight);
      let dblToMetal_Wt: number = this.commonService.emptyToZero(form.TO_METAL_WT);
      let strDivision = form.SCRAP_DIVCODE;
      let dblTotLoss_Wt: number = 0; let dblTotScap_Wt: number = 0;
      let dblTotGross: number = 0; let blnMultidiv = false;
      let dblPer: number = 0
      let dblLoss: number = 0;
      let dblScrap: number = 0;
      let dblGross: number = 0;
      // FIRST FORLOOP 
      for (let i = 0; i < this.metalDetailData.length; i++) {
        if (this.metalDetailData[i].METALSTONE.toString().trim() == "M") {
          dblPer = (this.commonService.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT.toString()) / dblTotalMetal_Wt) * 100;
          dblLoss = 0;
          dblScrap = 0;
          dblGross = 0;

          dblGross = this.commonService.decimalQuantityFormat((dblToMetal_Wt * dblPer) / 100, 'METAL');
          if (dblLoss_Wt > 0) dblLoss = this.commonService.decimalQuantityFormat((dblLoss_Wt * dblPer) / 100, 'METAL');
          if (dblScrap_Wt > 0) dblScrap = this.commonService.decimalQuantityFormat((dblScrap_Wt * dblPer) / 100, 'METAL');
          if (strDivision == "") {
            strDivision = this.metalDetailData[i].DIVCODE.toString().trim();
          }
        } else {
          if (this.metalDetailData[i].DIVCODE.toString().trim() != strDivision) blnMultidiv = true;
        }
        dblTotLoss_Wt += this.commonService.emptyToZero(dblLoss);
        dblTotScap_Wt += this.commonService.emptyToZero(dblScrap);
        dblTotGross += this.commonService.emptyToZero(dblGross);

        this.metalDetailData[i].GROSS_WT = (dblGross)
        this.metalDetailData[i].NET_WT = this.commonService.emptyToZero(this.metalDetailData[i].GROSS_WT) - this.commonService.emptyToZero(this.metalDetailData[i].STONE_WT)
        this.metalDetailData[i].LOSS_QTY = dblLoss
        this.metalDetailData[i].SCRAP_WT = dblScrap
        this.metalDetailData[i].SCRAP_STOCK_CODE = form.stockCode
        this.metalDetailData[i].SCRAP_SUB_STOCK_CODE = form.MAIN_STOCK_CODE
        this.metalDetailData[i].SCRAP_PURITY = this.commonService.emptyToZero(form.SCRAP_PURITY)
        this.metalDetailData[i].SCRAP_PURE_WT = this.commonService.emptyToZero(form.SCRAP_PURITY) * dblScrap
        this.metalDetailData[i].SCRAP_PUDIFF = this.commonService.emptyToZero(form.SCRAP_PUDIFF) //doubt
      }
      //for allocate scrap wt to single metal 
      if (blnMultidiv && dblScrap_Wt > 0) {
        dblTotalMetal_Wt = 0; dblTotScap_Wt = 0;
        //Second for loop
        for (let i = 0; i < this.metalDetailData.length; i++) {
          if (this.metalDetailData[i].METALSTONE.toString().trim() == "M") {
            this.metalDetailData[i].SCRAP_WT = 0
            this.metalDetailData[i].SCRAP_STOCK_CODE = ""
            this.metalDetailData[i].SCRAP_SUB_STOCK_CODE = ""
            this.metalDetailData[i].SCRAP_PURITY = 0
            this.metalDetailData[i].SCRAP_PURE_WT = 0
            this.metalDetailData[i].SCRAP_PUDIFF = 0

            if (this.metalDetailData[i].DIVCODE?.toUpperCase().trim() == form.SCRAP_DIVCODE.toUpperCase().trim()) {
              dblTotalMetal_Wt += this.commonService.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT);
            }
          }
        }
        // third for loop
        for (let i = 0; i < this.metalDetailData.length; i++) {
          if (this.metalDetailData[i].METALSTONE.toUpperCase().trim() == "M") {
            if (this.metalDetailData[i].DIVCODE.trim().toUpperCase() == form.SCRAP_DIVCODE.toUpperCase().trim()) {
              let dblPer = (this.commonService.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT) / dblTotalMetal_Wt) * 100;
              let dblScrap = 0; let dblGross = 0;

              dblGross = this.commonService.decimalQuantityFormat((dblTotalMetal_Wt * dblPer) / 100, 'METAL');
              if (dblScrap_Wt > 0) dblScrap = this.commonService.decimalQuantityFormat((dblScrap_Wt * dblPer) / 100, 'METAL');
              dblTotScap_Wt += dblScrap;

              this.metalDetailData[i].SCRAP_WT = dblScrap;
              this.metalDetailData[i].SCRAP_STOCK_CODE = form.stockCode;
              this.metalDetailData[i].SCRAP_SUB_STOCK_CODE = form.MAIN_STOCK_CODE;
              this.metalDetailData[i].SCRAP_PURITY = this.commonService.emptyToZero(form.SCRAP_PURITY);
              this.metalDetailData[i].SCRAP_PURE_WT = this.commonService.emptyToZero(form.SCRAP_PURITY * dblScrap);
              this.metalDetailData[i].SCRAP_PUDIFF = this.commonService.emptyToZero(form.SCRAP_PUDIFF);
            }
          }
        }
      }
      if ((dblToMetal_Wt - dblTotGross != 0) || (dblTotLoss_Wt - dblLoss_Wt != 0) || (dblTotScap_Wt - dblScrap_Wt != 0)) {
        //fourth four loop
        for (let i = 0; i < this.metalDetailData.length; i++) {
          if (this.metalDetailData[i].METALSTONE?.trim() == "M") {
            this.metalDetailData[i].GROSS_WT = (this.commonService.emptyToZero(this.metalDetailData[i].GROSS_WT) + (dblTotalMetal_Wt - dblTotGross) - (dblTotLoss_Wt - dblLoss_Wt));
            this.metalDetailData[i].NET_WT = this.commonService.emptyToZero(this.metalDetailData[i].GROSS_WT) - this.commonService.emptyToZero(this.metalDetailData[i].STONE_WT);
            this.metalDetailData[i].LOSS_QTY = (this.commonService.emptyToZero(this.metalDetailData[i].LOSS_QTY) + (dblTotLoss_Wt - dblLoss_Wt));
            this.metalDetailData[i].SCRAP_WT = (this.commonService.emptyToZero(this.metalDetailData[i].SCRAP_WT) + (dblTotScap_Wt - dblScrap_Wt));
            break;
          }
        }
      }
      // set loss %
      let txtLossPer = 0
      if (this.commonService.emptyToZero(form.lossQty) > 0) {
        txtLossPer = ((this.commonService.emptyToZero(form.lossQty) / this.commonService.emptyToZero(form.FRM_METAL_WT)) * 100);
      } else {
        txtLossPer = 0;
      }
      this.setValueWithDecimal('lossQtyper',txtLossPer,'AMOUNT')
    } catch (err: any) {
      this.commonService.toastErrorByMsgId('error in spliting loss')
    }
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
    return (this.commonService.emptyToZero(a) - (this.commonService.decimalQuantityFormat((Number(b) + Number(c)), 'METAL')))
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    this.locationSearchFlag = false;//loaction flag
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.processTransferdetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
        if (FORMNAME == 'stockCode') {
          this.locationSearchFlag = true; //loaction flag
          this.stockCodeScrapValidate()
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
  /**use: print Checkbox  change */
  settedCheckbox(event: any) {
    this.tableData[event.data.SRNO - 1].SETTED_FLAG = !event.data.SETTED_FLAG;
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
