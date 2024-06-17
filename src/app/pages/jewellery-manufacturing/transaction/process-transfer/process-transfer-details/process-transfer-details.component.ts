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
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{ type: 'GEN' }];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Process';
  designType: string = 'DIAMOND';
  gridAmountDecimalFormat:any;
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
    SEARCH_FIELD: 'PROCESS_CODE',
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
    JOB_DESCRIPTION: [''],
    SUB_JOB_DESCRIPTION: [''],
    UNQ_JOB_ID: [''],
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
    private comService: CommonServiceService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency
    };

    this.setInitialValues() //set all values from parent to child
    this.processTransferdetailsForm.controls['enddate'].disable();
    this.processTransferdetailsForm.controls['startdate'].setValue(this.comService.currentDate);
    this.processTransferdetailsForm.controls['enddate'].setValue(this.comService.currentDate);
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
    console.log(this.content, 'this.content');
    let parentDetail = this.content[0].PROCESS_FORMDETAILS
    let gridDetail = this.content[0].JOB_PROCESS_TRN_STNMTL_DJ
    if(gridDetail && gridDetail.length>0){
      this.metalDetailData = gridDetail
    }
    this.nullToStringSetValue('SRNO', parentDetail.SRNO)
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
    
    this.setValueWithDecimal('FRM_METAL_WT',  parentDetail.FRM_METAL_WT, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT',  parentDetail.TO_METAL_WT, 'METAL')
    this.setValueWithDecimal('FRM_PCS',  parentDetail.FRM_PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_PCS',  parentDetail.TO_PCS, 'AMOUNT')
    this.setValueWithDecimal('GrossWeightFrom',  parentDetail.GrossWeightFrom, 'METAL')
    this.setValueWithDecimal('GrossWeightTo',  parentDetail.GrossWeightTo, 'METAL')
    this.setValueWithDecimal('StoneWeightFrom',  parentDetail.StoneWeightFrom, 'STONE')
    this.setValueWithDecimal('StoneWeightTo',  parentDetail.StoneWeightTo, 'STONE')
    this.setValueWithDecimal('StonePcsFrom',  parentDetail.StonePcsFrom, 'STONE')
    this.setValueWithDecimal('StonePcsTo',  parentDetail.StonePcsTo, 'STONE')
    this.setValueWithDecimal('PUREWT',  parentDetail.PUREWT, 'AMOUNT')
    this.setValueWithDecimal('PURITY',  parentDetail.PURITY, 'PURITY')
    
    this.processTransferdetailsForm.controls.startdate.setValue(this.content.startdate)
    this.processTransferdetailsForm.controls.enddate.setValue(this.content.enddate)
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(this.content.JOB_DATE)
    this.processTransferdetailsForm.controls.toggleSwitchtIssue.setValue(this.content.toggleSwitchtIssue)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  setFromProcessWhereCondition() {
    //${this.comService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}
    this.fromProcessMasterSearch.WHERECONDITION = `@StrCurrentUser='${this.comService.userName}',
    @StrProcessCode='',
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
  nullToStringSetValue(formcontrol: string, value: any) {
    this.processTransferdetailsForm.controls[formcontrol].setValue(
      this.comService.nullToString(value)
    )
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
        'strJobNumber': this.comService.nullToString(event.target.value.trim()),
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
            this.nullToStringSetValue('UNQ_JOB_ID', data[0].UNQ_JOB_ID)
            this.nullToStringSetValue('JOB_DESCRIPTION', data[0].JOB_DESCRIPTION)
            this.nullToStringSetValue('SUB_JOB_DESCRIPTION', data[0].DESCRIPTION)
            this.nullToStringSetValue('JOB_DATE', data[0].JOB_DATE)
            this.nullToStringSetValue('DESIGN_CODE', data[0].DESIGN_CODE)
            this.nullToStringSetValue('SEQ_CODE', data[0].SEQ_CODE)
            this.nullToStringSetValue('METALLAB_TYPE', data[0].METALLAB_TYPE)
            this.nullToStringSetValue('DESIGN_TYPE', data[0].DESIGN_TYPE)
            this.designType = this.comService.nullToString(data[0].DESIGN_TYPE).toUpperCase();
            this.subJobNumberValidate()
          } else {
            this.nullToStringSetValue('JOB_NUMBER', '')
            this.comService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.nullToStringSetValue('JOB_NUMBER', '')
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  subJobDetailDataSRNO() {
    this.subJobDetailData.forEach((item:any,index:any)=> item.SRNO = index+1)
  }
  subJobDetailData: any[] = []
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
          this.subJobDetailData = result.dynamicData[0]
          this.subJobDetailDataSRNO()
          if (this.subJobDetailData.length > 1) {
            this.openJobTransferDetails()
            return
          }
          this.setSubJobTransferDetails(this.subJobDetailData)
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  //use: on row click on multiple sub job details
  onRowClickHandler(event: any) {
    if (!event.data.PROCESS) return;
    let data = this.subJobDetailData.filter((item: any) => event.data.SRNO == item.SRNO)
    if(data && data.length>0){
      this.setSubJobTransferDetails(data)
    }else{
      this.comService.toastErrorByMsgId('no data found')
    }
    this.modalReference.close()
  }
  setSubJobTransferDetails(data: any) {
    this.processTransferdetailsForm.controls.FRM_PROCESS_CODE.setValue(data[0].PROCESS)
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(data[0].WORKER)
    this.processTransferdetailsForm.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
    this.processTransferdetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
    this.processTransferdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
    this.processTransferdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
    this.processTransferdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
    this.processTransferdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
    this.processTransferdetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
    this.processTransferdetailsForm.controls.FRM_PROCESSNAME.setValue(data[0].PROCESSDESC)
    this.processTransferdetailsForm.controls.FRM_WORKERNAME.setValue(data[0].WORKERDESC)
    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.fillStoneDetails()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    // set numeric values with decimals
    this.setValueWithDecimal('FRM_METAL_PCS', data[0].PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_METAL_PCS', data[0].PCS, 'AMOUNT')
    this.setValueWithDecimal('FRM_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('TO_METAL_WT', data[0].METAL, 'METAL')
    this.setValueWithDecimal('FRM_PCS', data[0].PCS, 'AMOUNT')
    this.setValueWithDecimal('TO_PCS', data[0].PCS, 'AMOUNT')
    this.setValueWithDecimal('GrossWeightFrom', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('GrossWeightTo', data[0].NETWT, 'METAL')
    this.setValueWithDecimal('StoneWeightFrom', data[0].STONE, 'STONE')
    this.setValueWithDecimal('StoneWeightTo', data[0].STONE, 'STONE')
    this.setValueWithDecimal('StonePcsFrom', data[0].PCS1, 'STONE')
    this.setValueWithDecimal('StonePcsTo', data[0].PCS1, 'STONE')
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
      element.GEN = 'GEN'
      element.GROSS_WT = this.comService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
      element.STONE_WT = this.comService.setCommaSerperatedNumber(element.STONE_WT, 'STONE')
      element.PURITY = this.comService.setCommaSerperatedNumber(element.PURITY, 'PURITY')
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
    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        let data = result.dynamicData[0]
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let result =  this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE)
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
  selectAllBtnChange(event:any){
    console.log(event);
    if(event.target.checked){
      this.metalDetailData.forEach((item:any)=>{
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
    if(data && data.length>0){
      this.setSubJobTransferDetails(data)
    }else{
      this.comService.toastErrorByMsgId('no data found')
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
      JOB_PROCESS_TRN_STNMTL_DJ: [],
      JOB_VALIDATE_DATA: []
    }
    this.processTransferdetailsForm.controls.FLAG.setValue(flag)
    this.calculateGain()

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    detailDataToParent.JOB_PROCESS_TRN_STNMTL_DJ = this.metalDetailData; //grid data
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
