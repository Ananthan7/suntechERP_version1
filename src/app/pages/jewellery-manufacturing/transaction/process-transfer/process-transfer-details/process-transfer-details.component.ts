import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from 'src/app/shared/data/datetime-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
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
    approvedby: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    stdtime: [''],
    timetaken: [''],
    consumed: [''],
    variance: [''],
    variancePercentage: [''],
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
    FRM_WORKERNAME: [''],
    TO_WORKER_CODE: [''],
    TO_WORKERNAME: [''],
    FRM_METAL_PCS: [''],
    TO_METAL_PCS: [''],
    FRM_METAL_WT: [''],
    TO_METAL_WT: [''],
    FRM_PCS: [''],
    TO_PCS: [''],
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
    DESIGN_TYPE: [''],
    ZIRCON: [''],
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
    this.processTransferdetailsForm.controls['enddate'].disable();
    this.processTransferdetailsForm.controls['startdate'].setValue(this.commonService.currentDate);
    this.processTransferdetailsForm.controls['enddate'].setValue(this.commonService.currentDate);
  }

  setHearderDetails() {
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

  setInitialValues() {
    if (!this.content) return
    let parentDetail = this.content[0]?.PROCESS_FORMDETAILS
    let gridDetail = this.content[0]?.TRN_STNMTL_GRID
    if (gridDetail && gridDetail.length > 0) {
      this.metalDetailData = gridDetail
    }
    if (!parentDetail) return;
    this.processTransferdetailsForm.controls.SRNO.setValue(this.content[0]?.SRNO)

    this.nullToStringSetValue('JOB_NUMBER', parentDetail.JOB_NUMBER)
    this.nullToStringSetValue('JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.nullToStringSetValue('UNQ_JOB_ID', parentDetail.UNQ_JOB_ID)
    this.nullToStringSetValue('SUB_JOB_DESCRIPTION', parentDetail.SUB_JOB_DESCRIPTION)
    this.nullToStringSetValue('FRM_WORKER_CODE', parentDetail.FRM_WORKER_CODE)
    this.nullToStringSetValue('FRM_WORKERNAME', parentDetail.FRM_WORKERNAME)
    this.nullToStringSetValue('TO_WORKER_CODE', parentDetail.TO_WORKER_CODE)
    this.nullToStringSetValue('TO_WORKERNAME', parentDetail.TO_WORKERNAME)
    this.nullToStringSetValue('FRM_PROCESS_CODE', parentDetail.FRM_PROCESS_CODE)
    this.nullToStringSetValue('FRM_PROCESSNAME', parentDetail.FRM_PROCESSNAME)
    this.nullToStringSetValue('TO_PROCESS_CODE', parentDetail.TO_PROCESS_CODE)
    this.nullToStringSetValue('TO_PROCESSNAME', parentDetail.TO_PROCESSNAME)
    this.nullToStringSetValue('approvedby', parentDetail.approvedby)
    this.nullToStringSetValue('DESIGN_CODE', parentDetail.DESIGN_CODE)
    this.nullToStringSetValue('SEQ_CODE', parentDetail.SEQ_CODE)
    this.nullToStringSetValue('METALLAB_TYPE', parentDetail.METALLAB_TYPE)
    this.nullToStringSetValue('remarks', parentDetail.remarks)
    this.nullToStringSetValue('treeno', parentDetail.treeno)
    this.nullToStringSetValue('JOB_SO_NUMBER', parentDetail.JOB_SO_NUMBER)
    this.nullToStringSetValue('stockCode', parentDetail.stockCode)
    this.nullToStringSetValue('DIVCODE', parentDetail.DIVCODE)
    this.nullToStringSetValue('METALSTONE', parentDetail.METALSTONE)
    this.nullToStringSetValue('FRM_METAL_PCS', parentDetail.FRM_METAL_PCS)
    this.nullToStringSetValue('TO_METAL_PCS', parentDetail.TO_METAL_PCS)

    this.setValueWithDecimal('FRM_METAL_WT', parentDetail.FRM_METAL_WT, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', parentDetail.TO_METAL_WT, 'METAL')
    this.setValueWithDecimal('FRM_PCS', parentDetail.FRM_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_PCS', parentDetail.TO_PCS, 'AMOUNT')
    this.setValueWithDecimal('GrossWeightFrom', parentDetail.GrossWeightFrom, 'METAL')
    this.setValueWithDecimal('GrossWeightTo', parentDetail.GrossWeightTo, 'METAL')
    this.setValueWithDecimal('StoneWeightFrom', parentDetail.StoneWeightFrom, 'STONE')
    this.setValueWithDecimal('StoneWeightTo', parentDetail.StoneWeightTo, 'STONE')
    this.setValueWithDecimal('StonePcsFrom', parentDetail.StonePcsFrom, 'STONE')
    this.setValueWithDecimal('StonePcsTo', parentDetail.StonePcsTo, 'STONE')
    this.setValueWithDecimal('PUREWT', parentDetail.PUREWT, 'AMOUNT')
    this.setValueWithDecimal('PURITY', parentDetail.PURITY, 'PURITY')

    this.processTransferdetailsForm.controls.startdate.setValue(this.content.startdate)
    this.processTransferdetailsForm.controls.enddate.setValue(this.content.enddate)
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(this.content.JOB_DATE)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(this.content.toggleSwitchtIssue)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
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
    this.fromProcessMasterSearch.WHERECONDITION = `@StrCurrentUser='${this.commonService.userName}',
    @StrProcessCode='',
    @StrSubJobNo='${this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',
    @StrBranchCode='${this.commonService.branchCode}'`
  }
  setToProcessWhereCondition() {
    this.toProcessMasterSearch.WHERECONDITION = `@JobNumber='${this.commonService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER)}',
    @BranchCode='${this.commonService.branchCode}',
    @CurrentUser='${this.commonService.userName}',
    @ToWorker='${this.commonService.nullToString(this.processTransferdetailsForm.value.TO_WORKER_CODE)}',
    @EntStr='',
    @ToWorkerFocus=1`
  }
  setFromWorkerWhereCondition() {
    this.fromWorkerMasterSearch.WHERECONDITION = `@StrSubJobNo='${this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',
    @StrFromProcess='${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}',
    @StrFromWorker='${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_WORKER_CODE)}',
    @StrBranchCode='${this.commonService.branchCode}',
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
  nullToStringSetValue(formcontrol: string, value: any) {
    this.processTransferdetailsForm.controls[formcontrol].setValue(
      this.commonService.nullToString(value)
    )
  }
  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
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
            this.designType = this.commonService.nullToString(data[0].DESIGN_TYPE).toUpperCase();
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
    if (this.designType != 'METAL') {
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
  /**USE: subjobnumber validate API call subjobvalidate  '156516/4/01'*/
  subJobNumberValidate(event?: any) {
    let postData = this.setSubJobSpPostData() //set post data with designtype checking
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          this.subJobDetailData = result.dynamicData[0]
          this.subJobDetailData.forEach((item: any, index: any) => {
            item.SRNO = index + 1
            item.METAL = this.commonService.decimalQuantityFormat(item.METAL, 'METAL')
            item.STONE = this.commonService.decimalQuantityFormat(item.STONE, 'STONE')
          })

          if (this.subJobDetailData.length > 1) {
            this.openJobTransferDetails() //opens modal for multiple details
            return
          }
          this.setSubJobTransferDetails(this.subJobDetailData)
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  //use: on row click on multiple sub job details
  onRowClickHandler(event: any) {
    if (!event.data.PROCESS) return;
    let data = this.subJobDetailData.filter((item: any) => event.data.SRNO == item.SRNO)
    if (data && data.length > 0) {
      this.setSubJobTransferDetails(data)
    } else {
      this.commonService.toastErrorByMsgId('no data found')
    }
    this.modalReference.close()
  }
  onRowUpdateGrid(event: any) {
    let data = event.data
    this.checkSettedValue(data)
  }
  checkSettedValue(data: any) {
    if (data.FRM_PCS > data.PCS) {
      data.FRM_PCS = data.PCS
      this.commonService.toastErrorByMsgId('Setted cannot be greater than pcs')
    }
  }
  checkFromToValues(fromValue:string,ToValue:string){
    let form = this.processTransferdetailsForm.value
    if(this.commonService.emptyToZero(form[fromValue]) > this.commonService.emptyToZero(form[ToValue])){
      this.processTransferdetailsForm.controls[ToValue].setValue(form[fromValue])
      this.commonService.toastErrorByMsgId(`To value cannot be less than from value`)
    }
  }
  setSubJobTransferDetails(data: any) {
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
    this.nullToStringSetValue('ZIRCON', data[0].ZIRCON)
    this.nullToStringSetValue('JOB_SO_NUMBER', data[0].JOB_SO_NUMBER)
    this.nullToStringSetValue('DIVCODE', data[0].DIVCODE)
    this.nullToStringSetValue('METALSTONE', data[0].METALSTONE)
    this.nullToStringSetValue('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)

    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.fillStoneDetails()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    // set numeric values with decimals
    this.setValueWithDecimal('FRM_METAL_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_METAL_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('FRM_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('FRM_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('GrossWeightFrom', txtFromGrossWeight, 'METAL')
    this.setValueWithDecimal('GrossWeightTo', txtFromGrossWeight, 'METAL')
    this.setValueWithDecimal('StoneWeightFrom', txtFromStoneWt, 'STONE')
    this.setValueWithDecimal('StoneWeightTo', txtFromStoneWt, 'STONE')
    this.setValueWithDecimal('StonePcsFrom', data[0].JOB_PCS, 'STONE')
    this.setValueWithDecimal('StonePcsTo', data[0].JOB_PCS, 'STONE')
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
    this.nullToStringSetValue('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)
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
    this.setValueWithDecimal('FRM_METAL_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_METAL_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('FRM_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('FRM_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_PCS', data[0].JOB_PCS, 'AMOUNT')
    this.setValueWithDecimal('GrossWeightFrom', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('GrossWeightTo', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('StoneWeightFrom', data[0].STONE, 'STONE')
    this.setValueWithDecimal('StoneWeightTo', data[0].STONE, 'STONE')
    this.setValueWithDecimal('StonePcsFrom', data[0].JOB_PCS, 'STONE')
    this.setValueWithDecimal('StonePcsTo', data[0].JOB_PCS, 'STONE')
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
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.processTransferdetailsForm.controls.MAIN_STOCK_CODE.setValue(data[0].MAIN_STOCK_CODE)
          this.processTransferdetailsForm.controls.SCRAP_PURITY.setValue(data[0].PURITY)
        } else {
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
          this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(data[0].TO_PROCESS_CODE)
          this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(data[0].TO_PROCESSNAME)
          this.processTransferdetailsForm.controls.stdtime.setValue(
            this.commonService.convertTimeMinutesToDHM(data[0].STD_TIME)
          )
          this.STDDateTimeData.TIMEINMINUTES = data[0].STD_TIME
          const differenceInMinutes = this.getDifferenceInMinutes(data[0].IN_DATE);
          this.TimeTakenData.TIMEINMINUTES = differenceInMinutes
          this.consumedTimeData.TIMEINMINUTES = differenceInMinutes

          this.processTransferdetailsForm.controls.timetaken.setValue(
            this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
          )
          this.processTransferdetailsForm.controls.consumed.setValue(
            this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
          )
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
      element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.commonService.setCommaSerperatedNumber(element.STONE_WT, 'STONE')
      element.PURITY = this.commonService.setCommaSerperatedNumber(element.PURITY, 'PURITY')
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
    if (event.target.checked) {
      this.metalDetailData.forEach((item: any) => {
        item.SETTED_FLAG = true;
      })
    }
  }
  /**USE bind selected values*/
  processCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(event.PROCESS)
    this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(event.Description)
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    let data = this.subJobDetailData.filter((item: any) => event.PROCESS == item.PROCESS && event.WORKER == item.WORKER)
    if (data && data.length > 0) {
      this.setSubJobTransferDetails(data)
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
  }

  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.JOB_NUMBER.setValue(event.job_number)
    this.processTransferdetailsForm.controls.JOB_DESCRIPTION.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  submitValidations(form: any): boolean {
    if (this.commonService.nullToString(form.JOB_NUMBER) == '') {
      this.commonService.toastErrorByMsgId('To Job Number cannot be empty')
      return true;
    }
    if (this.commonService.nullToString(form.TO_WORKER_CODE) == '') {
      this.commonService.toastErrorByMsgId('To worker code cannot be empty')
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
      JOB_PROCESS_TRN_STNMTL_DJ: this.setJOB_PROCESS_TRN_STNMTL_DJ(),
      JOB_PROCESS_TRN_LABCHRG_DJ: this.setLabourChargeDetails()
    }
    console.log(detailDataToParent, 'formSubmit clicked');
    this.saveDetail.emit(detailDataToParent);
    if (flag == 'CONTINUE') {
      this.resetPTFDetails()
    }
  }
  resetPTFDetails() {
    this.processTransferdetailsForm.reset()
    this.metalDetailData = []
  }
  gridSRNO: number = 0
  setJOB_PROCESS_TRN_DETAIL_DJ() {
    let form = this.processTransferdetailsForm.value;
    let LOSS_PURE_QTY = this.calculateLossPureQty(form);
    let stoneAmount = this.calculateMetalGridSum(this.metalDetailData, 'STONEAMOUNT');
    let metalAmount = this.calculateMetalGridSum(this.metalDetailData, 'METALAMOUNT');
    let seqDataFrom = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE);
    let seqDataTo = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.TO_PROCESS_CODE);
    let scrapPureWt = this.commonService.emptyToZero(Number(form.scrapQuantity) * Number(form.SCRAP_PURITY))
    let amountFC = this.commonService.FCToCC(form.CURRENCY_CODE, stoneAmount)

    console.log(this.commonService.timeToMinutes(form.consumed), 'time consumed');
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
      "FRM_STONE_WT": this.commonService.emptyToZero(form.StoneWeighFrom),
      "FRM_STONE_PCS": this.commonService.emptyToZero(form.StonePcsFrom),
      "FRM_METAL_WT": this.commonService.emptyToZero(form.FRM_METAL_WT),
      "FRM_METAL_PCS": this.commonService.emptyToZero(form.FRM_METAL_PCS),
      "FRM_PURE_WT": this.commonService.emptyToZero(form.PUREWT),
      "FRM_NET_WT": this.commonService.emptyToZero(form.FRM_METAL_WT),
      "TO_PROCESS_CODE": this.commonService.nullToString(form.TO_PROCESS_CODE),
      "TO_PROCESSNAME": this.commonService.nullToString(form.TO_PROCESSNAME),
      "TO_WORKER_CODE": this.commonService.nullToString(form.TO_WORKER_CODE),
      "TO_WORKERNAME": this.commonService.nullToString(form.TO_WORKERNAME),
      "TO_PCS": this.commonService.emptyToZero(form.TO_PCS),
      "TO_METAL_PCS": this.commonService.emptyToZero(form.TO_METAL_PCS),
      "TO_STONE_WT": this.commonService.emptyToZero(form.StoneWeightTo),
      "TO_STONE_PCS": this.commonService.emptyToZero(form.StonePcsTo),
      "TO_METAL_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "TO_PURE_WT": this.commonService.emptyToZero(Number(form.FRM_METAL_WT) * Number(form.PURITY)),
      "TO_NET_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "LOSS_QTY": this.commonService.emptyToZero(form.stdLoss),
      "LOSS_PURE_QTY": this.commonService.emptyToZero(LOSS_PURE_QTY),
      "STONE_AMOUNTFC": this.commonService.emptyToZero(stoneAmount),
      "STONE_AMOUNTLC": this.commonService.FCToCC(form.CURRENCY_CODE, stoneAmount),
      "METAL_AMOUNTFC": this.commonService.emptyToZero(metalAmount),
      "METAL_AMOUNTLC": this.commonService.FCToCC(form.CURRENCY_CODE, metalAmount),
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
      "LAB_CODE": "",
      "LAB_UNIT": "",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": "",
      "LOSS_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].LOSS_ACCODE) : '',
      "FRM_WIP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].wip_accode) : '',
      "TO_WIP_ACCODE": seqDataTo.length > 0 ? this.commonService.nullToString(seqDataTo[0].wip_accode) : '',
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
      "IN_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "OUT_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "TIME_TAKEN_HRS": 0,
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": "",
      "PICTURE_PATH": this.commonService.nullToString(form.PICTURE_PATH),
      "AMOUNTLC": this.commonService.emptyToZero(stoneAmount),
      "AMOUNTFC": 0,
      "JOB_PCS": 0,
      "STONE_WT": this.commonService.emptyToZero(form.StoneWeightTo),
      "STONE_PCS": this.commonService.emptyToZero(form.StonePcsTo),
      "METAL_WT": this.commonService.emptyToZero(form.TO_METAL_WT),
      "METAL_PCS": this.commonService.emptyToZero(form.TO_METAL_PCS),
      "PURE_WT": this.commonService.emptyToZero(Number(form.TO_METAL_WT) * Number(form.PURITY)),
      "GROSS_WT": this.commonService.emptyToZero(form.GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE),
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(form.remarks),
      "TREE_NO": this.commonService.nullToString(form.treeno),
      "STD_TIME": this.commonService.emptyToZero(form.stdtime),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": "",
      "DT_BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "ISSUE_REF": this.commonService.nullToString(form.barCodeNumber),
      "IS_AUTHORISE": false,
      "TIME_CONSUMED": this.commonService.emptyToZero(form.consumed),
      "SCRAP_STOCK_CODE": this.commonService.nullToString(form.stockCode),
      "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
      "SCRAP_PURITY": this.commonService.emptyToZero(form.SCRAP_PURITY),
      "SCRAP_WT": this.commonService.emptyToZero(form.scrapQuantity),
      "SCRAP_PURE_WT": scrapPureWt,
      "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(form.scrapQuantity) - Number(form.PURITY)) * scrapPureWt),
      "SCRAP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "APPROVED_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "APPROVED_USER": this.commonService.nullToString(form.approvedby),
      "SCRAP_PCS": this.commonService.emptyToZero(form.METAL_ScrapPCS),
      "SCRAP_STONEWT": this.commonService.emptyToZero(form.METAL_ScrapStoneWt),
      "SCRAP_NETWT": this.commonService.emptyToZero(form.METAL_ScrapNetWt),
      "FROM_IRONWT": this.commonService.emptyToZero(form.METAL_FromIronWeight),
      "FROM_MSTOCKCODE": this.commonService.nullToString(form.METAL_FromStockCode),
      "TO_MSTOCKCODE": this.commonService.nullToString(form.METAL_ToStockCode),
      "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
      "TO_IRONWT": this.commonService.emptyToZero(form.METAL_ToIronWt),
      "FRM_DIAGROSS_WT": this.commonService.emptyToZero(form.METAL_GrossWeightFrom),
      "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
      "SCRAP_DIVCODE": this.commonService.nullToString(form.DIVCODE),
      "IRON_SCRAP_WT": this.calculateIronScrapWeight(form),
      "GAIN_WT": this.commonService.emptyToZero(form.METAL_GainGrWt),
      "GAIN_PURE_WT": this.commonService.emptyToZero(form.METAL_GainPureWt),
      "GAIN_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
    }
  }
  /**USE:  calculate Metal Grid Sum of data*/
  calculateMetalGridSum(data: any, flag: string) {
    let stoneAmount: number = 0
    let metalAmount: number = 0
    data.forEach((item: any) => {
      switch (item.METALSTONE) {
        case 'S':
          stoneAmount += item.AMOUNTFC;
          break;
        case 'M':
          metalAmount += item.AMOUNTFC;
          break;
        // Add more cases as needed
      }
    })
    switch (flag) {
      case 'STONEAMOUNT':
        return stoneAmount;
      case 'METALAMOUNT':
        return metalAmount;
      default:
        return 0;
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
    detailScreenData.stdLoss = this.commonService.emptyToZero(detailScreenData.stdLoss);
    detailScreenData.PURITY = this.commonService.emptyToZero(detailScreenData.PURITY);
    let value = detailScreenData.stdLoss * detailScreenData.PURITY
    return this.commonService.emptyToZero(value)
  }
  /**USE: set details from detail screen */
  setJOB_PROCESS_TRN_STNMTL_DJ() {
    let form = this.processTransferdetailsForm.value;
    let scrapPureWt = this.commonService.emptyToZero(Number(form.scrapQuantity) * Number(form.SCRAP_PURITY))
    let seqData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == form.FRM_PROCESS_CODE);
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
        "PCS": this.commonService.emptyToZero(element.PCS),
        "GROSS_WT": this.commonService.emptyToZero(element.GROSS_WT),
        "STONE_WT": this.commonService.emptyToZero(element.STONE_WT),
        "NET_WT": this.commonService.emptyToZero(element.NET_WT),
        "RATE": this.commonService.emptyToZero(element.RATE),
        "AMOUNT": this.commonService.emptyToZero(element.AMOUNTFC),
        "PROCESS_CODE": this.commonService.nullToString(form.TO_PROCESS_CODE),
        "WORKER_CODE": this.commonService.nullToString(form.TO_WORKER_CODE),
        "UNQ_DESIGN_ID": this.commonService.nullToString(form.UNQ_DESIGN_ID),
        "REFMID": 0,
        "AMOUNTLC": this.commonService.emptyToZero(element.AMOUNTLC),
        "AMOUNTFC": this.commonService.emptyToZero(element.AMOUNTFC),
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "CURRENCY_CODE": this.commonService.nullToString(element.CURRENCY_CODE),
        "CURRENCY_RATE": this.commonService.getCurrRate(element.CURRENCY_CODE),
        "YEARMONTH": this.commonService.yearSelected,
        "LOSS_QTY": this.commonService.emptyToZero(form.stdLoss),
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
        "PRINTED": true,
        "PUREWT": this.commonService.emptyToZero((element.NET_WT) * (element.PURITY)),
        "PURITY": this.commonService.emptyToZero(element.PURITY),
        "SQLID": "",
        "ISBROCKEN": 0,
        "TREE_NO": '',
        "SETTED": element.SETTED_FLAG,
        "SETTED_PCS": this.commonService.emptyToZero(element.Setted),
        "SIEVE": this.commonService.nullToString(element.SIEVE),
        "FULL_RECOVERY": 0,
        "RECOVERY_DATE": "2023-10-21T07:24:35.989Z",
        "RECOV_LOSS": 0,
        "RECOV_LOSS_PURE": 0,
        "BROKENSTONE_PCS": 0,
        "BROKENSTONE_WT": 0,
        "ISMISSING": 0,
        "PROCESS_TYPE": "",
        "IS_AUTHORISE": false,
        "SUB_STOCK_CODE": this.commonService.nullToString(element.SUB_STOCK_CODE),
        "KARAT_CODE": this.commonService.nullToString(element.KARAT_CODE),
        "SIEVE_SET": this.commonService.nullToString(element.SIEVE_SET),
        "SCRAP_STOCK_CODE": this.checkScrapStockCode(form.stockCode, element.STOCK_CODE, element.METALSTONE),
        "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
        "SCRAP_PURITY": this.commonService.emptyToZero(form.SCRAP_PURITY),
        "SCRAP_WT": this.commonService.emptyToZero(form.scrapQuantity),
        "SCRAP_PURE_WT": this.commonService.emptyToZero(scrapPureWt),
        "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(form.scrapQuantity) - Number(form.PURITY)) * scrapPureWt),
        "SCRAP_ACCODE": seqData.length > 0 ? this.commonService.nullToString(seqData[0].GAIN_AC) : '',
        "SYSTEM_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
        "ISSUE_GROSS_WT": this.commonService.emptyToZero(element.GROSS_WT),
        "ISSUE_STONE_WT": this.commonService.emptyToZero(element.STONE_WT),
        "ISSUE_NET_WT": this.commonService.emptyToZero(element.NET_WT),
        "JOB_PCS": 1,
        "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
        "TO_STOCK_CODE": this.commonService.nullToString(form.METAL_ToStockCode),
        "FROM_STOCK_CODE": this.commonService.nullToString(form.METAL_FromStockCode),
        "FROM_SUB_STOCK_CODE": this.commonService.nullToString(form.SUB_STOCK_CODE),
        "LOSS_PURE_WT": this.commonService.emptyToZero(form.LOSS_QTY * form.PURITY),
        "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
        "IRON_WT": this.commonService.emptyToZero(element.IRON_WT),
        "IRON_SCRAP_WT": this.commonService.emptyToZero(form.METAL_ToIronScrapWt),
        "GAIN_WT": this.commonService.emptyToZero(form.METAL_GainGrWt),
        "GAIN_PURE_WT": this.commonService.emptyToZero(form.METAL_GainPureWt),
        "IS_REJECT": true,
        "REASON": "",
        "REJ_REMARKS": "",
        "ATTACHMENT_FILE": "",
        "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
        "PUREWTTEMP": 0
      })
    });
    return data
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
