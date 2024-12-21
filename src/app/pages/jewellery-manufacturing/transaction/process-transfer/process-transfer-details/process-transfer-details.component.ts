import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DateTimeModel } from 'src/app/shared/data/datetime-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {
  @ViewChild('METAL_ToStockCodeOverley') METAL_ToStockCodeOverley!: MasterSearchComponent;
  @ViewChild('METAL_ScrapStockCodeoverlay') METAL_ScrapStockCodeoverlay!: MasterSearchComponent;
  @ViewChild('MetaltoWorkerMasterOverley') MetaltoWorkerMasterOverley!: MasterSearchComponent;
  @ViewChild('MetaloverlayjobNoSearch') MetaloverlayjobNoSearch!: MasterSearchComponent;
  @ViewChild('MetalfromProcessMasterOverlay') MetalfromProcessMasterOverlay!: MasterSearchComponent;
  @ViewChild('MetaltoProcessMasterOverlay') MetaltoProcessMasterOverlay!: MasterSearchComponent;
  @ViewChild('MetalfromWorkerMasterOverley') MetalfromWorkerMasterOverley!: MasterSearchComponent;
  @ViewChild('MetalstockCodeOverlay') MetalstockCodeOverlay!: MasterSearchComponent;
  @ViewChild('MetaloverleyLocation') MetaloverleyLocation!: MasterSearchComponent;
  @ViewChild('toWorkerMasterOverley') toWorkerMasterOverley!: MasterSearchComponent;
  @ViewChild('overlayjobNoSearch') overlayjobNoSearch!: MasterSearchComponent;
  @ViewChild('overlaySubjobNoSearch') overlaySubjobNoSearch!: MasterSearchComponent;
  @ViewChild('fromProcessMasterOverlay') fromProcessMasterOverlay!: MasterSearchComponent;
  @ViewChild('toProcessMasterOverlay') toProcessMasterOverlay!: MasterSearchComponent;
  @ViewChild('fromWorkerMasterOverley') fromWorkerMasterOverley!: MasterSearchComponent;
  @ViewChild('stockCodeOverlay') stockCodeOverlay!: MasterSearchComponent;
  @ViewChild('overleyLocation') overleyLocation!: MasterSearchComponent;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  minEndDate: string = '';
  divisionMS: any = 'ID';
  tableData: any[] = [];
  subJobDetailData: any[] = [{SRNO: 1}]
  imagepath: any[] = []
  metalDetailData: any[] = [];
  metalDetailData_2: any[] = [];
  sequenceDetails: any[] = [];
  processMasterDetails: any[] = [];
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
  blnScrapIronItem: any = false
  compSelectFlag: boolean = false;
  FORM_VALIDATER: any
  fromProcessCodeEmpty: boolean = false;
  fromWorkerCodeEmpty: boolean = false;

  private subscriptions: Subscription[] = [];
  subJobDetailDataHead: any[] = [
    {dataField: 'PROCESS',caption: 'PROCESS', alignment: 'center'},
    {dataField: 'WORKER',caption: 'WORKER', alignment: 'center'},
    {dataField: 'METAL',caption: 'METAL', alignment: 'right'},
    {dataField: 'STONE',caption: 'STONE', alignment: 'right'},
  ]
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
    WHERECONDITION: `JOB_CLOSED_ON is null and  Branch_code = '${this.commonService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  subJobNoSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 258,
    SEARCH_FIELD: 'UNQ_JOB_ID',
    SEARCH_HEADING: 'Sub Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `ISNULL(PROD_REF,0)=0 and Branch_code = '${this.commonService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  stockCodeSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 269,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'Stock code search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@JobNumber='',@BranchCode='${this.commonService.branchCode}',@StockCodeScrap=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  metalScrapStockCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock code search',
    SEARCH_VALUE: '',
    WHERECONDITION: "SUBCODE = 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  userDetailNet: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'USERSNAME',
    SEARCH_HEADING: 'Users Search',
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
    @ToProcesscode='',
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
	  @blntoWorkerFocus=0`,
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
	  @strFrom='',@strLoc=''`,
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
    JOB_NUMBER: ['', Validators.required],
    JOB_DESCRIPTION: [''],
    SUB_JOB_DESCRIPTION: [''],
    UNQ_JOB_ID: [''],
    REPAIR_PROCESS: [''],
    APPROVED_USER: [''],
    approveddate: [''],
    startdate: [''],
    enddate: [''],
    STD_TIME: [''],
    SETTED_FLAG: [false],
    TIME_TAKEN_HRS: [''],
    TIME_CONSUMED: [''],
    variance: [''],
    variancePercentage: [''],
    TREE_NO: [''],
    remarks: [''],
    StdTimeInMinutes: [''],
    timeTakenInMinutes: [''],
    consumedInMinutes: [''],
    consumed: [''],
    PRODLAB_ACCODE: [''],
    WIP_ACCODE: [''],
    toggleSwitchtIssue: [true],
    //DIAMOND DETAIL STARTS
    FRM_PROCESS_CODE: ['', Validators.required],
    TO_PROCESS_CODE: ['', Validators.required],
    FRM_PROCESSNAME: [''],
    TO_PROCESSNAME: [''],
    FRM_WORKER_CODE: ['', Validators.required],
    FRM_WORKERNAME: [''],
    TO_WORKER_CODE: ['', Validators.required],
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
    STOCK_DESCRIPTION: [''],
    scrapWeight: [''],
    location: [''],
    lossQty: [''],
    STD_LOSS: [''],
    lossQtyper: [''],
    FRM_STONE_PCS: [''],
    TO_STONE_PCS: [''],
    FRM_STONE_WT: [''],
    TO_STONE_WT: [''],
    PART_CODE: [''],
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
    METAL_STOCK_DESCRIPTION: [''],
    EXCLUDE_TRANSFER_WT: [false],
    blnAllowGain: [false],
    //METAL DETAILS STARTS
    METAL_STD_LOSS: [''],
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
    METAL_LossPureWt: [''],
  });
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
    private renderer: Renderer2,
  ) {
  }

  ngOnInit(): void {
    this.FORM_VALIDATER = this.processTransferdetailsForm.value;
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
      currency: this.commonService.compCurrency
    };
    // set data from header screen
    this.setOnLoadDetails()
  }
  ngAfterViewInit() {
    this.subJobNoSearch.VIEW_ICON = false;
    this.setInitialValues() //set all values from parent to child
  }
  ngAfterContentChecked() {
    if (this.commonService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER) == '') {
      this.renderer.selectRootElement('#jobNoSearch')?.focus();
    }
  }
  processWorkerOrder() {
    let flg = this.commonService.getCompanyParamValue('DIAMANFWORKERFOCUS')
    if (flg) return true
    return false;
  }
  processWorkerOrderFlag: boolean = false;
  setOnLoadDetails() {
    this.processWorkerOrderFlag = this.processWorkerOrder()
    this.DIAMANFBARCODE = this.commonService.getCompanyParamValue('DIAMANFBARCODE')
    let HEADERDETAILS = this.content[0]?.HEADERDETAILS || {}
    if (HEADERDETAILS) {
      this.setFormNullToString('BRANCH_CODE', HEADERDETAILS.BRANCH_CODE)
      this.setFormNullToString('VOCTYPE', HEADERDETAILS.VOCTYPE)
      this.setFormNullToString('YEARMONTH', HEADERDETAILS.YEARMONTH)
      this.setFormNullToString('CURRENCY_CODE', HEADERDETAILS.CURRENCY_CODE)
      this.setFormNullToString('CURRENCY_RATE', HEADERDETAILS.CURRENCY_RATE)
      this.setFormNullToString('FLAG', HEADERDETAILS.FLAG)
      this.processTransferdetailsForm.controls.SRNO.setValue(HEADERDETAILS.SRNO)
      this.processTransferdetailsForm.controls.VOCNO.setValue(HEADERDETAILS.VOCNO)
      this.processTransferdetailsForm.controls.VOCDATE.setValue(HEADERDETAILS.VOCDATE)
    }
    let branchParam = this.commonService.allbranchMaster
    this.processTransferdetailsForm.controls.location.setValue(branchParam.DMFGMLOC)
    this.processTransferdetailsForm.controls.METAL_ScrapLocCode.setValue(branchParam.DMFGMLOC)
    this.processTransferdetailsForm.controls['startdate'].setValue(this.commonService.currentDate);
    this.processTransferdetailsForm.controls['enddate'].setValue(this.commonService.currentDate);
  }
  // USE: SET ALL VIEW ADD AND EDIT MODE
  setFlagMode(FLAG: any) {
    switch (FLAG) {
      case 'VIEW':
        this.viewMode = true;
        this.locationSearchFlag = false;
        break;
      case 'EDIT':
        this.editMode = true;
        break;
      case 'DELETE':
        this.viewMode = true;
        break;
      default:
        this.viewMode = false;
        this.editMode = false;
        break;
    }
  }
  setInitialValues() {
    if (!this.content) return
    //parentDetail sets all value of detail
    let parentDetail: any;
    let PROCESS_FORMDETAILS: any;
    //if flag is present
    // let flag = this.content[0]?.FLAG || this.content[0]?.HEADERDETAILS.FLAG
    if (this.content[0]?.FLAG) {
      //setting conditions related to flag
      this.setFlagMode(this.content[0]?.FLAG)
      this.processTransferdetailsForm.controls.FLAG.setValue(this.content[0]?.FLAG)
      parentDetail = this.content[0]?.JOB_PROCESS_TRN_DETAIL_DJ || [] // setting detail data
      let compData = this.content[0]?.JOB_PROCESS_TRN_COMP_DJ || [] // setting component data
      // setting component grid data
      this.metalDetailData = []
      this.processTransferdetailsForm.controls.SETTED_FLAG.setValue(true)
      compData.forEach((item: any, index: any) => {
        item.FRM_PCS = item.SETTED_PCS
        item.SETTED_FLAG = item.SETTED
        if (item.GROSS_WT > 0) {
          item.SRNO = index + 1
          if (this.commonService.Null2BitValue(item.SETTED) == false) {
            this.processTransferdetailsForm.controls.SETTED_FLAG.setValue(false)
          }
          // item.GROSS_WT = Math.abs(item.GROSS_WT)
          // item.PCS = Math.abs(item.PCS)
          // item.AMOUNTFC = Math.abs(item.AMOUNTFC)
          this.metalDetailData.push(item)
        }
      })
      this.formatMetalDetailDataGrid() //number formatting component grid in detail screen
    } else {
      // condition to load without saving flag not present
      this.renderer.selectRootElement('#jobNoSearch')?.focus();
      parentDetail = this.content[0]?.JOB_PROCESS_TRN_DETAIL_DJ// setting detail data
      PROCESS_FORMDETAILS = this.content[0]?.PROCESS_FORMDETAILS
      this.metalDetailData = this.content[0]?.TRN_STNMTL_GRID || [] // setting component grid data
      if (PROCESS_FORMDETAILS) {
        this.processTransferdetailsForm.controls.SETTED_FLAG.setValue(PROCESS_FORMDETAILS.SETTED_FLAG)
      }
      this.setFormDecimal('METAL_ScrapPCS', 0, 'METAL')
      this.setFormDecimal('METAL_ScrapGrWt', 0, 'METAL')
      this.setFormDecimal('METAL_ScrapStoneWt', 0, 'METAL')
      this.setFormDecimal('METAL_ToIronScrapWt', 0, 'METAL')
      this.setFormDecimal('METAL_ScrapNetWt', 0, 'METAL')
      this.setFormDecimal('METAL_ScrapPureWt', 0, 'METAL')
    }
    if (!parentDetail) return;
    // setting values required for both diamond and metal tab
    this.processTransferdetailsForm.controls.SRNO.setValue(this.content[0]?.SRNO)
    this.designType = this.commonService.nullToString(parentDetail.DESIGN_TYPE?.toUpperCase())
    this.setFormNullToString('DESIGN_TYPE', parentDetail.DESIGN_TYPE?.toUpperCase())
    this.setFormNullToString('JOB_NUMBER', parentDetail.JOB_NUMBER)
    this.setFormNullToString('JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.setFormNullToString('UNQ_JOB_ID', parentDetail.UNQ_JOB_ID)
    this.setFormNullToString('SUB_JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.setFormNullToString('SEQ_CODE', parentDetail.SEQ_CODE)
    this.setFormNullToString('remarks', parentDetail.REMARKS)
    this.setFormNullToString('DIVCODE', parentDetail.DIVCODE)
    this.setFormNullToString('METALSTONE', parentDetail.METALSTONE)
    this.setFormNullToString('PRODLAB_ACCODE', parentDetail.PRODLAB_ACCODE)
    this.setFormNullToString('SCRAP_DIVCODE', parentDetail.SCRAP_DIVCODE)
    this.setFormNullToString('DESIGN_CODE', parentDetail.DESIGN_CODE)
    this.setFormNullToString('METALLAB_TYPE', parentDetail.METALLAB_TYPE)
    this.setFormNullToString('TREE_NO', parentDetail.TREE_NO)
    this.setFormNullToString('JOB_SO_NUMBER', parentDetail.JOB_SO_NUMBER)
    this.setFormDecimal('PUREWT', parentDetail.PUREWT, 'AMOUNT')
    this.setFormDecimal('PURITY', parentDetail.PURITY, 'PURITY')
    if (this.designType == 'METAL') {
      this.setMetalDetailFormData(parentDetail)// setting values for metal tab
    } else {
      this.setDiamondDetailFormData(parentDetail)// setting values for diamond tab
    }
    // setting values required for both diamond and metal tab
    if (this.commonService.nullToString(parentDetail.APPROVED_USER) != '') {
      this.setFormNullToString('APPROVED_USER', parentDetail.APPROVED_USER)
      this.approvalReqFlag = true
      this.processTransferdetailsForm.controls.approveddate.setValue(parentDetail.APPROVED_DATE)
    }
    if (parentDetail.SCRAP_STOCK_CODE && this.content[0]?.FLAG == 'EDIT') {
      this.locationSearchFlag = true;
    }

    this.TimeTakenData.TIMEINMINUTES = parentDetail.TIME_TAKEN_HRS
    this.consumedTimeData.TIMEINMINUTES = parentDetail.TIME_CONSUMED
    this.STDDateTimeData.TIMEINMINUTES = parentDetail.STD_TIME
    this.processTransferdetailsForm.controls.STD_TIME.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.STD_TIME)
    )
    this.processTransferdetailsForm.controls.TIME_TAKEN_HRS.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.TIME_TAKEN_HRS)
    )
    this.processTransferdetailsForm.controls.TIME_CONSUMED.setValue(
      this.commonService.convertTimeMinutesToDHM(parentDetail.TIME_CONSUMED)
    )
    this.processTransferdetailsForm.controls.JOB_DATE.setValue(parentDetail.JOB_DATE)
    this.processTransferdetailsForm.controls.startdate.setValue(
      this.commonService.formatDateTime(parentDetail.IN_DATE)
    )
    this.processTransferdetailsForm.controls.enddate.setValue(
      this.commonService.formatDateTime(parentDetail.OUT_DATE)
    )
    //loading datasets and calculations
    this.getMetalLabStockCode()
    this.Calc_TimeDiff()
    this.stockCodeScrapValidate()
    this.onloadCalculations()// for calculating loss details
    this.getImageData()
    this.getSequenceDetailData()
    this.getProcessMasterDetails()
    //set where conditions
    this.stockCodeSearchWhereCondition()
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    // set fomvalidater for checking previous value
    this.FORM_VALIDATER = this.processTransferdetailsForm.value;
  }

  locationCodeValidate(event: any) {
    let postData = {
      "SPID": "057",
      "parameter": {
        'strBranch': this.commonService.branchCode,
        'strUserCode': this.commonService.userName,
        'strAvoidFORSALES': '',
        'strFrom': '',
        'strLoc': this.commonService.nullToString(event.target.value)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0] || []
          if (data && data.length == 0) {
            this.overlayjobNoSearch.closeOverlayPanel()
            this.setFormNullToString(this.designType == 'METAL' ? 'METAL_ScrapLocCode' : 'location', '')
          }
        }
      })
    this.subscriptions.push(Sub)
  }
  getMetalLabStockCode() {
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER),
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
            this.overlayjobNoSearch.closeOverlayPanel()
            this.jobNumberDetailData = data
            this.setFormNullToString('JOB_DATE', data[0].JOB_DATE)
            this.setFormNullToString('DESIGN_CODE', data[0].DESIGN_CODE)
            this.setFormNullToString('SEQ_CODE', data[0].SEQ_CODE)
            this.setFormNullToString('METALLAB_TYPE', data[0].METALLAB_TYPE)
            this.setFormNullToString('METAL_STOCK_CODE', data[0].METAL_STOCK_CODE)
          }
        }
      })
    this.subscriptions.push(Sub)
  }
  onloadCalculations() {
    let lossQtyper = 0
    let form = this.processTransferdetailsForm.value;
    if (this.emptyToZero(form.lossQty) > 0) {
      lossQtyper = ((this.emptyToZero(form.lossQty) / this.emptyToZero(form.FRM_METAL_WT)) * 100);
      this.setFormDecimal('lossQtyper', lossQtyper, 'AMOUNT')
      let Balance_WT = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight) + this.emptyToZero(form.lossQty)));
      this.setFormDecimal('Balance_WT', Balance_WT, 'AMOUNT')
    } else {
      this.setFormDecimal('lossQtyper', 0, 'AMOUNT')
      let Balance_WT = (this.emptyToZero(form.FRM_METAL_WT) - this.emptyToZero(form.TO_METAL_WT) - this.emptyToZero(form.scrapWeight));
      this.setFormDecimal('Balance_WT', Balance_WT, 'AMOUNT')
    }
  }
  setMetalDetailFormData(parentDetail: any) {
    this.setFormNullToString('METAL_FRM_WORKER_CODE', parentDetail.FRM_WORKER_CODE)
    this.setFormNullToString('FRM_WORKERNAME', parentDetail.FRM_WORKERNAME)
    this.setFormNullToString('METAL_TO_WORKER_CODE', parentDetail.TO_WORKER_CODE)
    this.setFormNullToString('TO_WORKERNAME', parentDetail.TO_WORKERNAME)
    this.setFormNullToString('METAL_FRM_PROCESS_CODE', parentDetail.FRM_PROCESS_CODE)
    this.setFormNullToString('FRM_PROCESSNAME', parentDetail.FRM_PROCESSNAME)
    this.setFormNullToString('METAL_TO_PROCESS_CODE', parentDetail.TO_PROCESS_CODE)
    this.setFormNullToString('TO_PROCESSNAME', parentDetail.TO_PROCESSNAME)
    this.setFormNullToString('METAL_FromStockCode', parentDetail.FROM_MSTOCKCODE)
    this.setFormNullToString('METAL_ToStockCode', parentDetail.TO_MSTOCKCODE)
    this.setFormNullToString('METAL_ScrapStockCode', parentDetail.SCRAP_STOCK_CODE)
    this.setFormNullToString('METAL_ScrapLocCode', parentDetail.LOCTYPE_CODE)

    this.setFormDecimal('METAL_GrossWeightFrom', parentDetail.FRM_METAL_WT, 'METAL')
    this.setFormDecimal('METAL_GrossWeightTo', parentDetail.TO_METAL_WT, 'METAL')
    this.setFormDecimal('METAL_ScrapGrWt', parentDetail.SCRAP_WT, 'METAL')
    this.setFormDecimal('METAL_FRM_STONE_WT', parentDetail.FRM_STONE_WT, 'STONE')
    this.setFormDecimal('METAL_TO_STONE_WT', parentDetail.TO_STONE_WT, 'STONE')
    this.setFormDecimal('METAL_ScrapStoneWt', parentDetail.SCRAP_STONEWT, 'STONE')
    this.setFormDecimal('PURITY', this.metalDetailData[0].PURITY, 'PURITY')
    this.setFormDecimal('METAL_ScrapGrWt', parentDetail.SCRAP_WT, 'METAL')
    this.setFormDecimal('METAL_LossBooked', parentDetail.LOSS_QTY, 'METAL')
    this.setFormDecimal('METAL_FromIronWeight', parentDetail.FROM_IRONWT, 'METAL')
    this.setFormDecimal('METAL_ToIronWt', parentDetail.TO_IRONWT, 'METAL')
    this.setFormDecimal('METAL_ToIronScrapWt', parentDetail.IRON_SCRAP_WT, 'METAL')
    this.setFormDecimal('METAL_FromNetWeight', parentDetail.FRM_NET_WT, 'METAL')//dbt
    this.setFormDecimal('METAL_ToNetWt', parentDetail.TO_NET_WT, 'METAL')//dbt
    this.setFormDecimal('METAL_ScrapNetWt', parentDetail.SCRAP_NETWT, 'METAL')//dbt
    this.setFormDecimal('METAL_FromPureWt', parentDetail.FRM_PURE_WT, 'METAL')
    this.setFormDecimal('METAL_ToPureWt', parentDetail.TO_PURE_WT, 'METAL')
    this.setFormDecimal('METAL_ScrapPureWt', parentDetail.SCRAP_PURE_WT, 'METAL')
    let stdLoss = (this.emptyToZero(parentDetail.LOSS_QTY) / this.emptyToZero(parentDetail.FRM_METAL_WT)) * 100
    this.setFormDecimal('METAL_STD_LOSS', stdLoss, 'METAL')
    this.processTransferdetailsForm.controls.METAL_FromPCS.setValue(parentDetail.FRM_PCS)
    this.processTransferdetailsForm.controls.METAL_ToPCS.setValue(parentDetail.TO_PCS)
    this.processTransferdetailsForm.controls.METAL_ScrapPCS.setValue(parentDetail.SCRAP_PCS)
    // let METAL_BalPCS = this.balanceCalculate(parentDetail.FRM_PCS, parentDetail.TO_PCS, parentDetail.SCRAP_PCS)
    // this.processTransferdetailsForm.controls.METAL_BalPCS.setValue(METAL_BalPCS)
    // this.calculateAllBalanceForMetalTab()
    this.CalculateNetAndPureWt()
    this.CalculateMetalBalance()
    // this.calculateAllBalanceForMetalTab()
  }
  setDiamondDetailFormData(parentDetail: any) {
    this.setFormNullToString('FRM_WORKER_CODE', parentDetail.FRM_WORKER_CODE)
    this.setFormNullToString('FRM_WORKERNAME', parentDetail.FRM_WORKERNAME)
    this.setFormNullToString('TO_WORKER_CODE', parentDetail.TO_WORKER_CODE)
    this.setFormNullToString('TO_WORKERNAME', parentDetail.TO_WORKERNAME)
    this.setFormNullToString('FRM_PROCESS_CODE', parentDetail.FRM_PROCESS_CODE)
    this.setFormNullToString('FRM_PROCESSNAME', parentDetail.FRM_PROCESSNAME)
    this.setFormNullToString('TO_PROCESS_CODE', parentDetail.TO_PROCESS_CODE)
    this.setFormNullToString('TO_PROCESSNAME', parentDetail.TO_PROCESSNAME)
    this.setFormNullToString('stockCode', parentDetail.SCRAP_STOCK_CODE)
    this.setFormNullToString('location', parentDetail.LOCTYPE_CODE)

    this.setFormDecimal('FRM_METAL_WT', parentDetail.FRM_METAL_WT, 'METAL')
    this.setFormDecimal('TO_METAL_WT', parentDetail.TO_METAL_WT, 'METAL')
    this.setFormDecimal('GrossWeightFrom', parentDetail.FRM_DIAGROSS_WT, 'METAL') //dbt
    this.setFormDecimal('GrossWeightTo', parentDetail.TO_NET_WT, 'METAL')//dbt
    this.setFormDecimal('FRM_STONE_WT', parentDetail.FRM_STONE_WT, 'STONE')
    this.setFormDecimal('TO_STONE_WT', parentDetail.TO_STONE_WT, 'STONE')
    this.setFormDecimal('scrapWeight', parentDetail.SCRAP_WT, 'METAL')
    this.setFormDecimal('lossQty', parentDetail.LOSS_QTY, 'METAL')

    this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(parentDetail.FRM_METAL_PCS)
    this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(parentDetail.TO_METAL_PCS)
    this.processTransferdetailsForm.controls.FRM_PCS.setValue(parentDetail.FRM_PCS)
    this.processTransferdetailsForm.controls.TO_PCS.setValue(parentDetail.TO_PCS)
    this.processTransferdetailsForm.controls.FRM_STONE_PCS.setValue(parentDetail.FRM_STONE_PCS)
    this.processTransferdetailsForm.controls.TO_STONE_PCS.setValue(parentDetail.TO_STONE_PCS)
  }
  calculateAllBalanceForMetalTab() {
    // Perform calculations
    this.calculateAndSetBalance('METAL_GrossWeightFrom', 'METAL_GrossWeightTo', 'METAL_ScrapGrWt', 'METAL_BalGrWt');
    this.calculateAndSetBalance('METAL_FRM_STONE_WT', 'METAL_TO_STONE_WT', 'METAL_ScrapStoneWt', 'METAL_BalStoneWt');
    this.calculateAndSetBalance('METAL_FromIronWeight', 'METAL_ToIronWt', 'METAL_ToIronScrapWt', 'METAL_BalIronWt');
    this.calculateAndSetBalance('METAL_FromNetWeight', 'METAL_ToNetWt', 'METAL_ScrapNetWt', 'METAL_BalNetWt');
    this.calculateAndSetBalance('METAL_FromPureWt', 'METAL_ToPureWt', 'METAL_ScrapPureWt', 'METAL_BalPureWt');
  }
  // Generic function to calculate balance and set form value
  calculateAndSetBalance = (fromKey: any, toKey: any, scrapKey: any, resultKey: any) => {
    let form = this.processTransferdetailsForm.value;
    let balance = this.balanceCalculate(form[fromKey], form[toKey], form[scrapKey])
    this.setFormDecimal(resultKey, balance, 'METAL');
  };
  // calculate balance formula
  balanceCalculate(from: any, to: any, scrap: any) {
    return this.emptyToZero(from) - (this.emptyToZero(to) + this.emptyToZero(scrap));
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
  getProcessMasterDetails() {
    let processcode = this.designType == 'METAL' ? this.processTransferdetailsForm.value.METAL_FRM_PROCESS_CODE : this.processTransferdetailsForm.value.FRM_PROCESS_CODE
    let API = `ProcessMasterDj/GetProcessMasterDjWithProcessCode/${processcode}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          this.processMasterDetails = result.response ? [result.response] : []
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
    this.toProcessMasterSearch.WHERECONDITION += `@ToProcesscode='',`
    this.toProcessMasterSearch.WHERECONDITION += `@ToWorkerFocus=1`
  }
  setFromWorkerWhereCondition() {
    this.fromWorkerMasterSearch.WHERECONDITION = `@StrSubJobNo='${this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID)}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrFromProcess='${this.commonService.nullToString(this.processTransferdetailsForm.value.FRM_PROCESS_CODE)}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrFromWorker='',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@StrBranchCode='${this.commonService.branchCode}',`
    this.fromWorkerMasterSearch.WHERECONDITION += `@blnProcessAuthroize=1`
  }
  setToWorkerWhereCondition() {
    let form = this.processTransferdetailsForm.value
    if (this.designType == 'METAL') {
      this.toWorkerMasterSearch.WHERECONDITION = `@StrToProcess='${this.commonService.nullToString(form.METAL_TO_PROCESS_CODE)}',`
    } else {
      this.toWorkerMasterSearch.WHERECONDITION = `@StrToProcess='${this.commonService.nullToString(form.TO_PROCESS_CODE)}',`
    }
    this.toWorkerMasterSearch.WHERECONDITION += `@StrToWorker='',`
    if (this.commonService.nullToString(form.TO_PROCESS_CODE) == '') {
      this.toWorkerMasterSearch.WHERECONDITION += `@blntoWorkerFocus=1`
    } else {
      this.toWorkerMasterSearch.WHERECONDITION += `@blntoWorkerFocus=0`
    }
  }
  frmMetalStockWhereCondition() {
    this.metalScrapStockCode.WHERECONDITION = `SUBCODE = 0 AND `
    this.metalScrapStockCode.WHERECONDITION += `PURITY = '${this.processTransferdetailsForm.value.PURITY}'`
  }
  stockCodeSearchWhereCondition() {
    this.stockCodeSearch.WHERECONDITION = `@JobNumber='${this.processTransferdetailsForm.value.JOB_NUMBER}',`
    this.stockCodeSearch.WHERECONDITION += `@BranchCode='${this.commonService.branchCode}',@StockCodeScrap='${this.processTransferdetailsForm.value.stockCode}'`
  }
  metalScrapStockWhereCondition() {
    let strCondition = ''
    let form = this.processTransferdetailsForm.value;
    if (this.emptyToZero(form.METAL_FromIronWeight) != 0) {
      strCondition = " SUBCODE = 0 AND (PURITY = " + this.emptyToZero(form.PURITY) + " OR EXCLUDE_TRANSFER_WT = 1)";
    } else {
      strCondition = `SUBCODE = 0 AND PURITY = ${this.emptyToZero(form.PURITY)}`;
    }
    this.metalScrapStockCode.WHERECONDITION = strCondition
  }
  stdTimeChange(event: any) {
    this.processTransferdetailsForm.controls.STD_TIME.setValue(event)
  }
  timeTakenChange(event: any) {
    this.processTransferdetailsForm.controls.TIME_TAKEN_HRS.setValue(event)
  }
  consumedChange(event: any) {
    this.processTransferdetailsForm.controls.TIME_CONSUMED.setValue(event)
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
  setFormNullToString(formControlName: string, value: any) {
    this.processTransferdetailsForm.controls[formControlName].setValue(
      this.commonService.nullToString(value)
    )
    this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }
  setFormDecimal(formControlName: string, value: any, Decimal: string) {
    let val = this.commonService.setCommaSerperatedNumber(value, Decimal)
    this.processTransferdetailsForm.controls[formControlName].setValue(val)
    this.FORM_VALIDATER[formControlName] = val
  }
  jobNumberFormData(data: any) {
    if (data[0] && data[0].UNQ_JOB_ID != '') {
      this.jobNumberDetailData = data
      this.setFormNullToString('JOB_NUMBER', data[0].JOB_NUMBER)
      this.setFormNullToString('UNQ_JOB_ID', data[0].UNQ_JOB_ID)
      this.setFormNullToString('JOB_DESCRIPTION', data[0].JOB_DESCRIPTION)
      this.setFormNullToString('SUB_JOB_DESCRIPTION', data[0].DESCRIPTION)
      this.setFormNullToString('JOB_DATE', data[0].JOB_DATE)
      // this.setFormNullToString('PART_CODE', data[0].PART_CODE)
      this.setFormNullToString('DESIGN_CODE', data[0].DESIGN_CODE)
      this.setFormNullToString('SEQ_CODE', data[0].SEQ_CODE)
      this.setFormNullToString('METALLAB_TYPE', data[0].METALLAB_TYPE)
      this.setFormNullToString('DESIGN_TYPE', data[0].DESIGN_TYPE?.toUpperCase())
      this.setFormNullToString('METAL_STOCK_CODE', data[0].METAL_STOCK_CODE)
      this.designType = this.commonService.nullToString(data[0].DESIGN_TYPE?.toUpperCase());
      this.setFromProcessWhereCondition()
      this.getSequenceDetailData()
    }
  }
  /**USE: jobnumber validate API call */
  jobNumberValidate(event?: any) {
    if ((event && event.target.value == '') || this.viewMode) {
      return
    }
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(this.processTransferdetailsForm.value.JOB_NUMBER),
        'strCurrenctUser': this.commonService.nullToString(this.userName)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          this.overlayjobNoSearch.closeOverlayPanel()
          let data = result.dynamicData[0] || []
          if (data.length > 0) {
            this.subJobNoSearch.VIEW_ICON = true;
            this.subJobNoSearch.WHERECONDITION += `AND job_number='${this.processTransferdetailsForm.value.JOB_NUMBER?.toString()}'`
            this.jobNumberFormData(data) // assign values to form
            if (data.length == 1) { // condition for 1 subjob
              this.subJobNumberValidate() // sub job number API call
              return
            }
            if (data.length > 1) { // condition for multiple subjob
              this.overlaySubjobNoSearch.showOverlayPanel(event) // opening lookup with subjobs
            }
          } else { // condition for no response
            this.commonService.formControlSetReadOnly('UNQ_JOB_ID', true)
            this.jobNoSearch.SEARCH_VALUE = event.target.value;
            this.overlayjobNoSearch.showOverlayPanel(event);
            this.setFormNullToString('JOB_NUMBER', '')
            // this.renderer.selectRootElement('#jobNoSearch')?.focus();
          }
        } else {
          this.setFormNullToString('JOB_NUMBER', '')
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setSubJobSpPostData(form: any) {
    if (this.designType.toUpperCase() == 'METAL') {
      let metalSubjobData = {
        "SPID": "040",
        "parameter": {
          'strUNQ_JOB_ID': this.processTransferdetailsForm.value.UNQ_JOB_ID,
          'strBranchCode': this.commonService.nullToString(this.branchCode),
          'strCurrenctUser': this.commonService.userName || ''
        }
      }
      return metalSubjobData
    } else {
      let diamondPostData = {
        "SPID": "088",
        "parameter": {
          'StrSubJobNo': this.commonService.nullToString(form.UNQ_JOB_ID),
          'StrBranchCode': this.commonService.nullToString(this.branchCode),
          'CurrentUser': this.commonService.userName
        }
      }
      return diamondPostData
    }
  }
  /**USE: subjobnumber validate API call subjobvalidate */
  subJobNumberValidate(event?: any) {
    let postData = this.setSubJobSpPostData(this.processTransferdetailsForm.value) //set post data with designtype checking
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        try {
          let response = result.dynamicData
          let userflag: any[] = []
          // set second result from job sales order dj table
          if (response.length > 1) {
            userflag = response[1]
            this.setDataFromSalesOrderDj(response[2]);
          }
          // SET frist result of subjob details
          this.subJobDetailData = response[0] || []
          if (this.subJobDetailData.length > 0) {
            //subjob data format changing
            this.subJobDetailData.forEach((item: any, index: any) => {
              item.SRNO = index + 1
              item.METAL = this.commonService.decimalQuantityFormat(item.METAL, 'METAL')
              item.STONE = this.commonService.decimalQuantityFormat(item.STONE, 'STONE')
            })
            //opens modal for multiple details
            if (this.subJobDetailData.length > 1) {
              this.openJobTransferDetails()
              return
            }
            //if only 1 detail then metal and diamond tab data assigning
            if (this.designType == 'METAL') {
              this.setMetalSubJob_Details(this.subJobDetailData)
            } else {
              this.setSubJob_Details(this.subJobDetailData)
            }
          } else {
            if (this.commonService.Null2BitValue(userflag[0].USERALLOCATIONFLAG)) {
              let msg = this.commonService.getMsgByID('MSG7958') //	Access to Process not Authorised
              this.showOkDialog(msg)
              return
            }
            this.resetPTFDetails()
            let msg = this.commonService.getMsgByID('MSG7957') //	No Worker is having balance
            this.showOkDialog(msg)
          }
          if (this.commonService.Null2BitValue(userflag[0].USERALLOCATIONFLAG)) {
            let msg = this.commonService.getMsgByID('MSG7958') //	Access to Process not Authorised
            this.showOkDialog(msg)
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
  setSubJob_Details(data: any) {
    // assigning values from API of subjob
    this.setFormNullToString('FRM_PROCESS_CODE', data[0].PROCESS)
    this.setFormNullToString('FRM_WORKER_CODE', data[0].WORKER)
    this.setFormNullToString('FRM_PROCESSNAME', data[0].PROCESSDESC)
    this.setFormNullToString('FRM_WORKERNAME', data[0].WORKERDESC)
    this.setFormNullToString('REPAIR_PROCESS', data[0].REPAIR_PROCESS)
    this.setFormNullToString('ZIRCON', data[0].ZIRCON)
    this.setFormNullToString('DIVCODE', data[0].DIVCODE)
    this.setFormNullToString('METALSTONE', data[0].METALSTONE)
    this.setFormNullToString('stockCode', '')
    this.setFormNullToString('scrapWeight', '')
    this.setFormDecimal('PUREWT', data[0].PUREWT, 'AMOUNT')
    this.setFormDecimal('PURITY', data[0].PURITY, 'PURITY')
    this.approvalReqFlag = data[0].APPROVAL_REQUIRED ? true : false
    this.processTransferdetailsForm.controls.approveddate.setValue(this.commonService.currentDate)

    // first gross wt calculation with MAKEZIRCONEGROSSWT checking
    let blnAddZirconasGross = this.commonService.getCompanyParamValue('MAKEZIRCONEGROSSWT')
    let dblZircon, txtFromStoneWt, txtFromGrossWeight
    if (blnAddZirconasGross) {
      dblZircon = this.emptyToZero(data[0].ZIRCON)
      txtFromStoneWt = this.emptyToZero(data[0].STONE) - dblZircon + (dblZircon * 5);
      txtFromGrossWeight = this.emptyToZero(data[0].METAL) + (this.emptyToZero(data[0].STONE) / 5);
    } else {
      dblZircon = this.emptyToZero(data[0].ZIRCON)
      if (dblZircon > 0) {
        txtFromGrossWeight = (this.emptyToZero(data[0].METAL) + (this.emptyToZero(data[0].STONE)));
      }
      else {
        txtFromGrossWeight = (this.emptyToZero(data[0].METAL) + (this.emptyToZero(data[0].STONE) / 5));
      }
    }
    this.setFormDecimal('GrossWeightFrom', txtFromGrossWeight, 'METAL')

    // APIs need to be called if subjob details is present
    this.getImageData()
    // this.stockCodeScrapValidate()
    this.getProcessMasterDetails()
    this.fillStoneDetails()
    this.getTimeAndLossDetails()
    // set where conditions
    this.stockCodeSearchWhereCondition()
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
  }
  setMetalSubJob_Details(data: any) {
    // assigning values from API of metal subjob
    this.setFormNullToString('METAL_FRM_PROCESS_CODE', data[0].PROCESS)
    this.setFormNullToString('METAL_FRM_WORKER_CODE', data[0].WORKER)
    this.setFormNullToString('FRM_PROCESSNAME', data[0].PROCESSDESC)
    this.setFormNullToString('FRM_WORKERNAME', data[0].WORKERDESC)
    this.setFormNullToString('JOB_SO_NUMBER', data[0].JOB_SO_NUMBER)
    this.setFormNullToString('DIVCODE', data[0].DIVCODE)
    this.setFormNullToString('METALSTONE', data[0].METAL_STONE ? data[0].METAL_STONE : data[0].METALTONE)
    this.setFormNullToString('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)
    this.setFormNullToString('PICTURE_PATH', data[0].PICTURE_PATH)
    this.setFormNullToString('EXCLUDE_TRANSFER_WT', data[0].EXCLUDE_TRANSFER_WT)
    if (this.commonService.Null2BitValue(data[0].EXCLUDE_TRANSFER_WT)) {
      this.blnScrapIronItem = true
    }
    this.setFormNullToString('METAL_FromStockCode', data[0].STOCK_CODE)
    this.setFormNullToString('METAL_ToStockCode', data[0].STOCK_CODE)
    this.setFormNullToString('SEQ_CODE', data[0].SEQ_CODE)
    this.processTransferdetailsForm.controls.blnAllowGain.setValue(
      this.commonService.Null2BitValue(data[0].ALLOW_GAIN)
    )


    this.setFormNullToString('METAL_FromPCS', data[0].PCS)
    this.setFormDecimal('METAL_FromNetWeight', data[0].METAL, 'METAL')
    this.setFormDecimal('METAL_FromPureWt', data[0].PUREWT, 'METAL')
    this.setFormDecimal('PURITY', data[0].PURITY, 'PURITY')
    this.approvalReqFlag = data[0].APPROVAL_REQUIRED ? true : false
    this.processTransferdetailsForm.controls.approveddate.setValue(this.commonService.currentDate)

    let txtMFromStoneWt = data[0].STONE
    let dblZircon = 0;
    let blnAddZirconasGross = this.commonService.getCompanyParamValue('MAKEZIRCONEGROSSWT')
    if (blnAddZirconasGross) {
      dblZircon = this.emptyToZero(data[0].ZIRCON);
      txtMFromStoneWt = (this.emptyToZero(data[0].STONE) - dblZircon + (dblZircon * 5));
    }
    this.setFormDecimal('METAL_FRM_STONE_WT', txtMFromStoneWt, 'STONE')
    this.setFormDecimal('METAL_FromIronWeight', data[0].IRON_WT, 'METAL')
    let txtMFromGrossWeight = (this.emptyToZero(data[0].METAL) + (this.emptyToZero(txtMFromStoneWt)));
    this.setFormDecimal('METAL_GrossWeightFrom', txtMFromGrossWeight, 'METAL')

    this.workerWiseMetalBalance()
    this.stockCodeScrapValidate()
    this.getTimeAndLossDetails()
    this.fillStoneDetails()
    //set where conditions
    this.setFromProcessWhereCondition()
    this.setToProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    this.setToWorkerWhereCondition()
    this.frmMetalStockWhereCondition()
    this.metalScrapStockWhereCondition()
  }
  setDataFromSalesOrderDj(job_salesorder: any) {
    this.setFormNullToString('JOB_PCS', this.emptyToZero(job_salesorder[0].PCS))
    this.setFormNullToString('DESIGN_CODE', job_salesorder[0].DESIGN_CODE)
    // this.setFormNullToString('PART_CODE', job_salesorder[0].DESIGN_CODE)

    this.setFormNullToString('UNQ_DESIGN_ID', job_salesorder[0].UNQ_DESIGN_ID)
    this.setFormNullToString('PICTURE_PATH', job_salesorder[0].PICTURE_PATH)
    this.setFormNullToString('TREE_NO', job_salesorder[0].TREE_NO)
    this.setFormNullToString('JOB_SO_NUMBER', job_salesorder[0].JOB_SO_NUMBER)
  }
  resetSubjobDetails() {
    this.setFormNullToString('FRM_PROCESS_CODE', '')
    this.setFormNullToString('FRM_WORKER_CODE', '')
    this.setFormNullToString('FRM_PROCESSNAME', '')
    this.setFormNullToString('FRM_WORKERNAME', '')
    this.setFormNullToString('REPAIR_PROCESS', '')
    this.setFormNullToString('ZIRCON', '')
    this.setFormNullToString('DIVCODE', '')
    this.setFormNullToString('METALSTONE', '')
    this.setFormNullToString('stockCode', '')
    this.setFormNullToString('scrapWeight', '')
    this.setFormDecimal('PUREWT', 0, 'AMOUNT')
    this.setFormDecimal('PURITY', 0, 'PURITY')
    this.metalDetailData = []
    this.imagepath = []
  }
  //use: on row click on multiple sub job details
  onRowClickHandler(event: any) {
    if (!event.PROCESS) return;
    let data = this.subJobDetailData.filter((item: any) => event.SRNO == item.SRNO)
    if (data && data.length > 0) {
      if (this.designType == 'METAL') { //metal data assigning
        this.setMetalSubJob_Details(data)
      } else {
        this.setSubJob_Details(data)
      }
    } else {
      this.commonService.toastErrorByMsgId('MSG1453') //No details found!!
    }
    this.modalReference.close()
  }
  onEditingStart(e: any) {
    if (e.data.METALSTONE == 'M' && e.column.dataField === 'GROSS_WT') {
      e.cancel = true; // Prevent editing for this cell
    }
  }
  onRowUpdateGrid(event: any) {
    let data = event.data
    this.recalculateSrno()
    this.checkSettedValue(data)
    this.formatMetalDetailDataGrid()
    // if (this.rowUpdationValidate(data)) return
    this.Calc_Totals(0)
    // this.calculateStoneDetail();
    this.CalculateLoss();
  }
  calculateStoneDetail() {
    if (this.metalDetailData.length > 0) {
      let nPcs = 0
      let nStWeight = 0
      let nMPcs = 0
      this.metalDetailData.forEach((item: any, index: any) => {
        item.SRNO = index + 1
        if (item.METALSTONE.toUpperCase() == 'S') {
          nPcs += this.emptyToZero(item.PCS)
          nStWeight += this.emptyToZero(item["GROSS_WT"]);
        } else {
          nMPcs += this.emptyToZero(item["PCS"]);
        }
      })
      this.setFormDecimal('TO_STONE_WT', nStWeight, 'STONE')
      this.setFormNullToString('FRM_STONE_PCS', nPcs)
      this.setFormNullToString('TO_STONE_PCS', nPcs)
      if (nMPcs == 0) {
        this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(0)
        this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(0)
      } else {
        this.setFormNullToString('FRM_METAL_PCS', nMPcs)
        this.setFormNullToString('TO_METAL_PCS', nMPcs)
      }
      let form = this.processTransferdetailsForm.value
      this.setFormDecimal('GrossWeightTo', this.commonService.grossWtCalculate(form.TO_METAL_WT, nStWeight), 'METAL')

    }
  }
  recalculateSrno() {
    this.metalDetailData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
    })
  }
  rowUpdationValidate(data: any) {
    let form = this.processTransferdetailsForm.value
    if (data.GROSS_WT > this.emptyToZero(form.FRM_METAL_WT)) {
      this.metalDetailData[data.SRNO - 1].GROSS_WT = form.FRM_METAL_WT
      this.commonService.toastErrorByMsgId(this.commonService.getMsgByID('MSG2037') + ` ${form.FRM_METAL_WT}`)
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
    // if (this.emptyToZero(form.lossQty) == this.emptyToZero(this.FORM_VALIDATER.lossQty)) return;
    if (this.emptyToZero(form.lossQty) > this.emptyToZero(form.FRM_METAL_WT)) {
      this.commonService.toastErrorByMsgId(msg + " " + form.FRM_METAL_WT)
      this.setFormDecimal('lossQty', 0, 'METAL')
      return
    }
    if (this.emptyToZero(form.lossQty) > 0) {
      if (this.sequenceDetails.length > 0) {
        let processData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.FRM_PROCESS_CODE?.toUpperCase())
        if (processData?.length == 0) {
          processData = this.processMasterDetails;
        }
        if (this.emptyToZero(processData[0]?.MAX_LOSS) == 0 && this.emptyToZero(processData[0]?.STD_LOSS) == 0
          && this.emptyToZero(processData[0]?.MIN_LOSS) == 0) {
          let msg = this.commonService.getMsgByID("MSG1397") + " 0.00"
          this.commonService.toastErrorByMsgId(msg)
          this.setFormDecimal('lossQty', 0, 'METAL')
          return;
        }
        if (processData[0]?.STD_LOSS > 0) {
          let nMax_Loss = (this.emptyToZero(form.FRM_METAL_WT) * this.emptyToZero(processData[0]["MAX_LOSS"])) / 100;
          if (this.emptyToZero(form.lossQty) > nMax_Loss) {
            this.commonService.toastErrorByMsgId(msg + " " + nMax_Loss)
            this.setFormDecimal('lossQty', nMax_Loss, 'METAL')
            // return;
          }
          let nMin_Loss = (this.emptyToZero(form.FRM_METAL_WT) * this.emptyToZero(processData[0]["MIN_LOSS"])) / 100;
          if (this.emptyToZero(form.lossQty) < nMin_Loss) {
            let msg = this.commonService.getMsgByID('MSG1396')
            this.commonService.toastErrorByMsgId(msg + nMin_Loss)
            this.setFormDecimal('lossQty', nMin_Loss, 'METAL')
            // return;
          }

        } else {
          this.commonService.toastErrorByMsgId(msg + " " + form.FRM_METAL_WT)
        }
      }
    }
    let txtBalDiaGrWt = 0;
    form = this.processTransferdetailsForm.value;
    if (this.emptyToZero(form.lossQty) == 0 && this.emptyToZero(form.FRM_METAL_WT) > this.emptyToZero(form.TO_METAL_WT)) {
      if ((this.emptyToZero(form.TO_METAL_WT) + this.emptyToZero(form.lossQty)) > this.emptyToZero(form.FRM_METAL_WT)) {
        let TO_METAL_WT = (this.emptyToZero(form.FRM_METAL_WT) - this.emptyToZero(form.lossQty));
        this.setFormDecimal('TO_METAL_WT', TO_METAL_WT, 'METAL')
        let GrossWeightTo = (this.emptyToZero(form.TO_METAL_WT) - this.emptyToZero(form.TO_STONE_WT) / 5);
        this.setFormDecimal('GrossWeightTo', GrossWeightTo, 'METAL')
        form = this.processTransferdetailsForm.value;
      } else {
        txtBalDiaGrWt = (this.emptyToZero(form.FRM_METAL_WT) - this.emptyToZero(form.TO_METAL_WT) - this.emptyToZero(form.scrapWeight));
      }
    } else {
      txtBalDiaGrWt = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight) + this.emptyToZero(form.lossQty)));
      if (this.emptyToZero(form.scrapWeight) == 0 && this.emptyToZero(form.lossQty) == 0) {
        if (this.emptyToZero(form.GrossWeightFrom) == this.emptyToZero(form.GrossWeightTo)) {
          txtBalDiaGrWt = 0
        }
      }
    }
    this.setFormDecimal('Balance_WT', txtBalDiaGrWt, 'METAL')

    if (this.Multi_Metal()) {
      this.Split_Loss_New()
    } else {
      this.Split_Loss(this.processTransferdetailsForm.value)
    }
  }

  checkSettedValue(data: any) {
    if (data.FRM_PCS > data.PCS) {
      data.FRM_PCS = data.PCS
      this.commonService.toastErrorByMsgId('Setted cannot be greater than pcs')
    }
  }
  checkFromToValues(fromValue: string, ToValue: string) {
    let form = this.processTransferdetailsForm.value
    if (this.emptyToZero(form[fromValue]) < this.emptyToZero(form[ToValue])) {
      this.processTransferdetailsForm.controls[ToValue].setValue(form[fromValue])
      this.commonService.toastErrorByMsgId(`Value cannot be greater than ${form[fromValue]}`)
    }
  }
  toStoneWtChange() {

  }
  toMetalWeightChange(fromValue: string, ToValue: string) {
    let form = this.processTransferdetailsForm.value
    if (this.emptyToZero(form.TO_METAL_WT) > this.emptyToZero(form.FRM_METAL_WT)) {
      this.processTransferdetailsForm.controls[ToValue].setValue(this.FORM_VALIDATER.TO_METAL_WT)
      this.commonService.toastErrorByMsgId(this.commonService.getMsgByID('MSG2037') + `${form[fromValue]}`)
      return
    }
    let ToGrossWt = (this.emptyToZero(form.TO_METAL_WT) + (this.emptyToZero(form.TO_STONE_WT) / 5));
    this.setFormDecimal('GrossWeightTo', ToGrossWt, 'METAL')
    if (this.emptyToZero(form[fromValue]) == this.emptyToZero(form[ToValue])) {
      this.setFormDecimal('GrossWeightTo', ToGrossWt, 'METAL')
    }
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
  //worker Wise Metal Balance Scrap Validate
  workerWiseMetalBalance(event?: any) {
    let form = this.processTransferdetailsForm.value;
    let postData = {
      "SPID": "101",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(form.BRANCH_CODE),
        'strProcessCode': this.commonService.nullToString(form.METAL_FRM_PROCESS_CODE),
        'strUNQ_JOB_ID': this.commonService.nullToString(form.UNQ_JOB_ID),
        'strFromStockCode': this.commonService.nullToString(form.METAL_FromStockCode),
        'intIsAuthorize': '0',
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0]?.length > 0) {
          let data = result.dynamicData[0]
          this.setFormNullToString('MAIN_STOCK_CODE', data[0].MAIN_STOCK_CODE)
          this.setFormNullToString('SCRAP_PURITY', data[0].PURITY)
          this.setFormNullToString('SCRAP_DIVCODE', data[0].DIVISION)
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  //stockCode Scrap Validate
  stockCodeScrapValidate(event?: any) {
    if (this.viewMode) return
    if (event && event.target.value == '') {
      return
    }
    let form = this.processTransferdetailsForm.value
    let postData = {
      "SPID": "110",
      "parameter": {
        'JobNumber': this.commonService.nullToString(form.JOB_NUMBER),
        'BranchCode': this.commonService.nullToString(form.BRANCH_CODE),
        'StockCodeScrap': this.commonService.nullToString(form.stockCode)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = result.dynamicData[0]
        if (data && data?.length > 0) {
          this.locationSearchFlag = this.processTransferdetailsForm.value.FLAG != 'VIEW' ? true : false
          let data = result.dynamicData[0]
          this.setFormNullToString('MAIN_STOCK_CODE', data[0].MAIN_STOCK_CODE)
          this.setFormNullToString('SCRAP_PURITY', data[0].PURITY)
          this.setFormNullToString('SCRAP_DIVCODE', data[0].DIVISION)
        } else {
          this.locationSearchFlag = false;
          this.processTransferdetailsForm.controls.scrapWeight.setValue('')
          this.stockCodeSearch.SEARCH_VALUE = event.target.value;
          this.stockCodeOverlay.showOverlayPanel(event)
          this.processTransferdetailsForm.controls.stockCode.setValue('')
          // this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setMetalTimeLossDetail(result: any) {
    let data = result.dynamicData[0]
    // if(data[0].TO_PROCESS_CODE == ''){
    //   this.commonService.toastErrorByMsgId('MSG7961')
    // }
    this.setFormNullToString('METAL_TO_PROCESS_CODE', data[0].TO_PROCESS_CODE)
    this.setFormNullToString('METAL_TO_PROCESSNAME', data[0].TO_PROCESSNAME)
    this.setFormNullToString('PRODLAB_ACCODE', data[0].LAB_ACCODE)
    this.setFormNullToString('FRM_PCS', this.emptyToZero(data[0].FRM_PCS))
    this.setFormNullToString('TO_PCS', this.emptyToZero(data[0].FRM_PCS))
    this.setFormNullToString('METAL_STD_LOSS', this.emptyToZero(data[0].STD_LOSS))
    this.setFormDecimal('METAL_LossBooked', data[0].STD_LOSS, 'AMOUNT')
    if (this.emptyToZero(data[0].PURITY) != 0) this.setFormDecimal('PURITY', data[0].PURITY, 'PURITY') // already taking from subjobsp
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
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
    this.processTransferdetailsForm.controls.TIME_CONSUMED.setValue(
      this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
    )
    if (data[0].IN_DATE && data[0].IN_DATE != '') {
      this.processTransferdetailsForm.controls.startdate.setValue(data[0].IN_DATE)
    }
    let date = this.commonService.getCompanyParamValue('PROCESSTIMEVALIDATE')
    this.Calc_TimeDiff()

    this.calculateSTNMTLdata_Metal(result) // calculations
  }
  /**use: to get time and loss details also already saved data from stnmtl table */
  getTimeAndLossDetails() {
    if (this.commonService.nullToString(this.processTransferdetailsForm.value.UNQ_JOB_ID == '')) return
    let form = this.processTransferdetailsForm.value;
    let postData = {
      "SPID": "087",
      "parameter": {
        'StrDesignCode': this.commonService.nullToString(form.DESIGN_CODE),
        'strProcess_Code': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_FRM_PROCESS_CODE : form.FRM_PROCESS_CODE),
        'StrSeq_Code': this.commonService.nullToString(form.SEQ_CODE),
        'strWorker_Code': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_FRM_WORKER_CODE : form.FRM_WORKER_CODE),
        'strUNQ_JOB_ID': this.commonService.nullToString(form.UNQ_JOB_ID),
        'strBranchCode': this.commonService.nullToString(this.commonService.branchCode),
        'StrStockCode': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_FromStockCode : ''),
        'CurrentUser': this.commonService.userName
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          if (this.designType == 'METAL') {
            this.setMetalTimeLossDetail(result)
          } else {
            this.setDiamondTimeLossDetail(result)
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
  setDiamondTimeLossDetail(result: any) {
    let data = result.dynamicData[0]
    this.setFormNullToString('TO_PROCESS_CODE', data[0].TO_PROCESS_CODE)
    this.setFormNullToString('TO_PROCESSNAME', data[0].TO_PROCESSNAME)
    this.setFormNullToString('PRODLAB_ACCODE', data[0].LAB_ACCODE)
    this.setFormDecimal('STD_LOSS', data[0].STD_LOSS, 'AMOUNT')
    if (this.emptyToZero(data[0].PURITY) != 0) this.setFormDecimal('PURITY', data[0].PURITY, 'PURITY')
    this.processTransferdetailsForm.controls.FRM_PCS.setValue(this.emptyToZero(data[0].FRM_PCS))
    this.processTransferdetailsForm.controls.TO_PCS.setValue(this.emptyToZero(data[0].FRM_PCS))
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()

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
    this.processTransferdetailsForm.controls.TIME_CONSUMED.setValue(
      this.commonService.convertTimeMinutesToDHM(differenceInMinutes)
    )
    if (data[0].IN_DATE && data[0].IN_DATE != '') {
      this.processTransferdetailsForm.controls.startdate.setValue(data[0].IN_DATE)
    }
    let date = this.commonService.getCompanyParamValue('PROCESSTIMEVALIDATE')
    this.Calc_TimeDiff()

    //to calculate saved data in stnmtl table
    let metalstone_M = result.dynamicData[1] || []
    let metalstone_S = result.dynamicData[2] || []
    let form = this.processTransferdetailsForm.value;
    if (metalstone_M.length > 0) {
      let txtFromMetalPcs = this.emptyToZero(metalstone_M[0]["PCS"]);
      let txtFromMetalWeight = this.emptyToZero(metalstone_M[0]["GROSS_WT"]);
      let txtLossQty: number = 0
      if ((form.STD_LOSS != 0) && (this.emptyToZero(metalstone_M[0]["GROSS_WT"]) != 0)) {
        txtLossQty = this.commonService.lossQtyCalculate(metalstone_M[0]["GROSS_WT"], form.STD_LOSS);
      }
      let txtToMetalPcs = this.emptyToZero(metalstone_M[0]["PCS"]);
      let txtToMetalWt = (this.emptyToZero(metalstone_M[0]["GROSS_WT"]) - this.emptyToZero(txtLossQty));
      this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(this.emptyToZero(txtToMetalPcs))
      this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(this.emptyToZero(txtFromMetalPcs))
      this.setFormDecimal('lossQty', txtLossQty, 'METAL')
      this.setFormDecimal('TO_METAL_WT', txtToMetalWt, 'METAL')
      this.setFormDecimal('FRM_METAL_WT', txtFromMetalWeight, 'METAL')
    }

    form = this.processTransferdetailsForm.value;
    let nTotalWt = 0;
    let nTotalPcs = 0;
    let nWeightInGram = 0;
    let dblZircon = this.commonService.getCompanyParamValue('MAKEZIRCONEGROSSWT');
    if (metalstone_S.length > 0) {
      metalstone_S.forEach((item: any) => {
        nTotalPcs += this.emptyToZero(item["PCS"]);
        if (dblZircon && item["DIVCODE"]?.trim().toUpperCase() == "Z") {
          nWeightInGram += this.emptyToZero(item["GROSS_WT"]);
          nTotalWt += this.emptyToZero(item["GROSS_WT"]) * 5;
        }
        else {
          if (item["DIVCODE"]?.trim().toUpperCase() == "Z") {
            nWeightInGram += this.emptyToZero(item["GROSS_WT"]);
            nTotalWt += this.emptyToZero(item["GROSS_WT"]);
          }
          else {
            nWeightInGram += this.emptyToZero(item["GROSS_WT"]) / 5;
            nTotalWt += this.emptyToZero(item["GROSS_WT"]);
          }
        }
      })
    }
    this.processTransferdetailsForm.controls.FRM_STONE_PCS.setValue(this.emptyToZero(nTotalPcs))
    this.processTransferdetailsForm.controls.TO_STONE_PCS.setValue(this.emptyToZero(nTotalPcs))
    this.setFormDecimal('FRM_STONE_WT', nTotalWt, 'STONE')
    this.setFormDecimal('TO_STONE_WT', nTotalWt, 'STONE')

    let txtFromGrossWeight = (this.emptyToZero(form.FRM_METAL_WT) + nWeightInGram);
    let TxtToGrossWt = (this.emptyToZero(txtFromGrossWeight) - this.emptyToZero(form.lossQty));

    this.setFormDecimal('GrossWeightFrom', txtFromGrossWeight, 'METAL')
    this.setFormDecimal('GrossWeightTo', TxtToGrossWt, 'METAL')
    let nGrossWt = this.emptyToZero(txtFromGrossWeight) - this.emptyToZero(form.lossQty);
    this.FORM_VALIDATER = this.processTransferdetailsForm.value
    if (this.Multi_Metal()) {
      this.Split_Loss_New()
    } else {
      this.Split_Loss(this.processTransferdetailsForm.value)
    }

  }
  /**USE: calculate STNMTLdata  call */
  calculateSTNMTLdata_Metal(result: any) {
    let metalstone_M = result.dynamicData[1] || []
    let metalstone_S = result.dynamicData[2] || []
    let form = this.processTransferdetailsForm.value;
    if (metalstone_M.length > 0) {
      let txtFromMetalPcs = this.emptyToZero(metalstone_M[0]["PCS"]);
      let txtMFromNetWeight = this.emptyToZero(metalstone_M[0]["GROSS_WT"]);
      let METAL_LossBooked: number = 0
      let METAL_LossPureWt: number = 0
      if ((this.emptyToZero(form.METAL_LossBooked) != 0) && (this.emptyToZero(metalstone_M[0]["GROSS_WT"]) != 0)) {
        METAL_LossBooked = this.commonService.lossQtyCalculate(metalstone_M[0]["GROSS_WT"], form.METAL_LossBooked);
        METAL_LossPureWt = this.commonService.lossPureWtCalculate(METAL_LossBooked, form.PURITY)
      }
      let txtToMetalPcs = this.emptyToZero(metalstone_M[0]["PCS"]);
      let METAL_ToNetWt = this.commonService.netWeightCalculate(metalstone_M[0]["GROSS_WT"], METAL_LossBooked);
      let txtMToPureWt = this.commonService.pureWeightCalculate(METAL_ToNetWt, form.PURITY);
      let txtToIronWt = form.METAL_FromIronWeight;

      this.setFormDecimal('METAL_LossPureWt', METAL_LossPureWt, 'METAL')
      this.setFormDecimal('METAL_LossBooked', METAL_LossBooked, 'METAL')
      this.processTransferdetailsForm.controls.METAL_ToPCS.setValue(this.emptyToZero(txtToMetalPcs))
      this.processTransferdetailsForm.controls.METAL_FromPCS.setValue(this.emptyToZero(txtFromMetalPcs))
      this.setFormDecimal('METAL_ToNetWt', METAL_ToNetWt, 'METAL')
      this.setFormDecimal('METAL_FromNetWeight', txtMFromNetWeight, 'METAL')
      this.setFormDecimal('METAL_ToPureWt', txtMToPureWt, 'METAL')
      this.setFormDecimal('METAL_ToIronWt', txtToIronWt, 'METAL')
    }

    form = this.processTransferdetailsForm.value;
    let nTotalWt = 0;
    let nTotalPcs = 0;
    let nWeightInGram = 0;
    let dblZircon = this.commonService.getCompanyParamValue('MAKEZIRCONEGROSSWT');
    if (metalstone_S.length > 0) {
      metalstone_S.forEach((item: any) => {
        nTotalPcs += this.emptyToZero(item["PCS"]);
        if (dblZircon && item["DIVCODE"]?.trim().toUpperCase() == "Z") {
          nWeightInGram += this.emptyToZero(item["GROSS_WT"]);
          nTotalWt += this.emptyToZero(item["GROSS_WT"]);
        } else {
          nWeightInGram += this.emptyToZero(item["GROSS_WT"]);
          nTotalWt += this.emptyToZero(item["GROSS_WT"]);
        }
      })
    }
    this.processTransferdetailsForm.controls.METAL_FromPCS.setValue(this.emptyToZero(nTotalPcs))
    this.processTransferdetailsForm.controls.METAL_ToPCS.setValue(this.emptyToZero(nTotalPcs))
    this.setFormDecimal('METAL_FRM_STONE_WT', nTotalWt, 'STONE')
    this.setFormDecimal('METAL_TO_STONE_WT', nTotalWt, 'STONE')

    let txtFromGrossWeight = (this.emptyToZero(form.METAL_FromNetWeight) + this.emptyToZero(form.METAL_FromIronWeight) + nWeightInGram);
    let TxtToGrossWt = (this.emptyToZero(txtFromGrossWeight) - this.emptyToZero(form.METAL_LossBooked));

    this.setFormDecimal('METAL_GrossWeightFrom', txtFromGrossWeight, 'METAL')
    this.setFormDecimal('METAL_GrossWeightTo', TxtToGrossWt, 'METAL')
    let nGrossWt = this.emptyToZero(txtFromGrossWeight) - this.emptyToZero(form.METAL_LossBooked);
    this.FORM_VALIDATER = this.processTransferdetailsForm.value;

    // this.CalculateNetAndPureWt();
    this.CalculateMetalBalance()
    this.Split_Loss_Metal()
  }
  // for diamond tab
  calculateSTNMTLdata(result: any) {

  }

  Calc_TimeDiff(): void {
    try {
      let stdTime = this.emptyToZero(this.STDDateTimeData.TIMEINMINUTES)
      let consumedTime = this.emptyToZero(this.consumedTimeData.TIMEINMINUTES)
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
  private setFillStoneDetailsPostData(form: any) {
    return {
      "SPID": "042",
      "parameter": {
        strJobNumber: form.JOB_NUMBER,
        strUnq_Job_Id: form.UNQ_JOB_ID,
        strProcess_Code: this.designType == 'METAL' ? form.METAL_FRM_PROCESS_CODE : form.FRM_PROCESS_CODE,
        strWorker_Code: this.designType == 'METAL' ? form.METAL_FRM_WORKER_CODE : form.FRM_WORKER_CODE,
        strBranch_Code: this.branchCode
      }
    }
  }

  /**USE: fillStoneDetails grid data */
  private fillStoneDetails(): void {
    let form = this.processTransferdetailsForm.value;
    let postData = {
      "SPID": "042",
      "parameter": {
        strJobNumber: form.JOB_NUMBER,
        strUnq_Job_Id: form.UNQ_JOB_ID,
        strProcess_Code: this.designType == 'METAL' ? form.METAL_FRM_PROCESS_CODE : form.FRM_PROCESS_CODE,
        strWorker_Code: this.designType == 'METAL' ? form.METAL_FRM_WORKER_CODE : form.FRM_WORKER_CODE,
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
            this.metalDetailData = data || []
            this.recalculateSrno()
            if (this.processTransferdetailsForm.value.METALSTONE == 'M') {
              this.metal_Calc_Totals(1)
            } else {
              this.Calc_Totals(1)
            }
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

  changeSelectCheckbox(event: any) {
    this.metalDetailData[event.data.SRNO - 1].SELECTED = !event.data.SELECTED;
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
            nPcs += this.emptyToZero(item.PCS)
            nStWeight += this.emptyToZero(item["GROSS_WT"]);

          } else {
            nMPcs += this.emptyToZero(item["PCS"]);
            nMWeight += this.emptyToZero(item["GROSS_WT"]);
          }
        })
      }
      if (flag == 0) { // for flag 0 to values only assigned
        this.setFormDecimal('TO_STONE_WT', nStWeight, 'STONE')
        this.setFormNullToString('TO_STONE_PCS', nPcs)
        this.setFormNullToString('TO_METAL_PCS', nMPcs)
        this.setFormDecimal('TO_METAL_WT', nMWeight, 'METAL')
        this.setFormDecimal('GrossWeightTo', this.commonService.grossWtCalculate(nMWeight, nStWeight), 'METAL')
        return
      }
      this.setFormDecimal('FRM_STONE_WT', nStWeight, 'STONE')
      this.setFormDecimal('TO_STONE_WT', nStWeight, 'STONE')
      this.setFormNullToString('FRM_STONE_PCS', nPcs)
      this.setFormNullToString('TO_STONE_PCS', nPcs)
      if (nMPcs == 0) {
        this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(0)
        this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(0)
      } else {
        this.setFormNullToString('FRM_METAL_PCS', nMPcs)
        this.setFormNullToString('TO_METAL_PCS', nMPcs)
      }
      this.setFormDecimal('FRM_METAL_WT', nMWeight, 'METAL')
      this.setFormDecimal('TO_METAL_WT', nMWeight, 'METAL')
      this.setFormDecimal('GrossWeightTo', this.commonService.grossWtCalculate(nMWeight, nStWeight), 'METAL')
    }
    catch (ex: any) {
      this.commonService.toastErrorByMsgId("MSG2100")
    }
  }
  metal_Calc_Totals(flag: any) {
    let nPcs = 0;
    let nStWeight = 0;
    let nMPcs = 0;
    let nMWeight = 0;
    try {
      if (this.metalDetailData.length > 0) {
        let form = this.processTransferdetailsForm.value;
        this.metalDetailData = this.metalDetailData.filter((item: any) => {
          if (item.METALSTONE.toUpperCase() == 'M' && item.STOCK_CODE != form.METAL_FromStockCode.toString()) {
            return false
          }
          return true
        })
        this.metalDetailData.forEach((item: any, index: any) => {
          item.SRNO = index + 1
          if (item.METALSTONE.toUpperCase() == 'S') {
            nPcs += this.emptyToZero(item.PCS)
            nStWeight += this.emptyToZero(item["GROSS_WT"]);

          } else {
            nMPcs += this.emptyToZero(item["PCS"]);
            nMWeight += this.emptyToZero(item["GROSS_WT"]);

          }
        })
      }
      if (flag == 0) { // for flag 0 to values only assigned
        // this.setFormDecimal('TO_STONE_WT', nStWeight, 'STONE')
        // this.setFormNullToString('TO_STONE_PCS', nPcs)
        this.setFormNullToString('METAL_ToPCS', nMPcs)
        this.setFormDecimal('TO_METAL_WT', nMWeight, 'METAL')
        // this.setFormDecimal('METAL_GrossWeightTo', this.commonService.grossWtCalculate(nMWeight, nStWeight), 'METAL')
        return
      }
      this.setFormDecimal('FRM_STONE_WT', nStWeight, 'STONE')
      this.setFormDecimal('TO_STONE_WT', nStWeight, 'STONE')
      this.setFormNullToString('FRM_STONE_PCS', nPcs)
      this.setFormNullToString('TO_STONE_PCS', nPcs)
      if (nMPcs == 0) {
        this.processTransferdetailsForm.controls.FRM_METAL_PCS.setValue(0)
        this.processTransferdetailsForm.controls.TO_METAL_PCS.setValue(0)
      } else {
        this.setFormNullToString('METAL_FromPCS', nMPcs)
        this.setFormNullToString('METAL_ToPCS', nMPcs)
      }
      this.setFormDecimal('FRM_METAL_WT', nMWeight, 'METAL')
      this.setFormDecimal('TO_METAL_WT', nMWeight, 'METAL')
      // this.setFormDecimal('METAL_GrossWeightTo', this.commonService.grossWtCalculate(nMWeight, nStWeight), 'METAL')
    }
    catch (ex: any) {
      this.commonService.toastErrorByMsgId("MSG2100")
    }
  }
  formatMetalDetailDataGrid() {
    let compSelectFlag = this.commonService.getCompanyParamValue('PROCESSTRANSFERSELECTION')
    this.compSelectFlag = !this.commonService.Null2BitValue(compSelectFlag) ? true : false
    this.metalDetailData.forEach((element: any) => {
      element.SELECTED = true
      element.GEN = 'GEN'
      element.FROM_STOCK_CODE = element.STOCK_CODE,
        element.FROM_SUB_STOCK_CODE = element.SUB_STOCK_CODE,
        element.GROSS_WT = this.commonService.setCommaSerperatedNumber(element.GROSS_WT, 'METAL')
      element.NET_WT = this.commonService.setCommaSerperatedNumber(element.NET_WT, 'METAL')
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

  isFromProcessCodeEmpty(flag: boolean) {
    if (flag) {
      this.fromProcessCodeEmpty = true;
      this.commonService.formControlSetReadOnly('TO_PROCESS_CODE', true)
      this.commonService.formControlSetReadOnly('FRM_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('TO_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('TO_PCS', true)
      this.commonService.formControlSetReadOnly('GrossWeightTo', true)
      this.commonService.formControlSetReadOnly('stockCode', true)
      this.commonService.formControlSetReadOnly('txtLossQty', true)
      // for metal tab
      this.commonService.formControlSetReadOnly('METAL_TO_PROCESS_CODE', true)
      this.commonService.formControlSetReadOnly('METAL_FRM_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('METAL_TO_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('METAL_ScrapLocCode', true)
      this.commonService.formControlSetReadOnly('METAL_ToStockCode', true)
      this.commonService.formControlSetReadOnly('METAL_ScrapStockCode', true)

      this.toProcessMasterSearch.VIEW_ICON = false;
      this.fromWorkerMasterSearch.VIEW_ICON = false;
      this.toWorkerMasterSearch.VIEW_ICON = false;
      this.stockCodeSearch.VIEW_ICON = false;
      this.locationSearch.VIEW_ICON = false;
      this.metalScrapStockCode.VIEW_ICON = false;
    } else {
      if (this.fromWorkerCodeEmpty) return
      this.fromProcessCodeEmpty = false;
      this.commonService.formControlSetReadOnly('TO_PROCESS_CODE', false)
      this.commonService.formControlSetReadOnly('FRM_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('TO_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('TO_PCS', false)
      this.commonService.formControlSetReadOnly('GrossWeightTo', false)
      this.commonService.formControlSetReadOnly('stockCode', false)
      this.commonService.formControlSetReadOnly('txtLossQty', false)
      // for metal tab
      this.commonService.formControlSetReadOnly('METAL_TO_PROCESS_CODE', false)
      this.commonService.formControlSetReadOnly('METAL_FRM_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('METAL_TO_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('METAL_ScrapLocCode', false)
      this.commonService.formControlSetReadOnly('METAL_ToStockCode', false)
      this.commonService.formControlSetReadOnly('METAL_ScrapStockCode', false)
      this.toProcessMasterSearch.VIEW_ICON = true;
      this.fromWorkerMasterSearch.VIEW_ICON = true;
      this.toWorkerMasterSearch.VIEW_ICON = true;
      this.stockCodeSearch.VIEW_ICON = true;
      this.locationSearch.VIEW_ICON = true;
      this.metalScrapStockCode.VIEW_ICON = true;
    }
  }
  isFromWorkerCodeEmpty(flag: boolean) {
    if (flag) {
      this.fromWorkerCodeEmpty = true;
      this.commonService.formControlSetReadOnly('TO_PROCESS_CODE', true)
      this.commonService.formControlSetReadOnly('TO_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('TO_PCS', true)
      this.commonService.formControlSetReadOnly('GrossWeightTo', true)
      this.commonService.formControlSetReadOnly('stockCode', true)
      this.commonService.formControlSetReadOnly('txtLossQty', true)
      // for metal tab
      this.commonService.formControlSetReadOnly('METAL_TO_PROCESS_CODE', true)
      this.commonService.formControlSetReadOnly('METAL_TO_WORKER_CODE', true)
      this.commonService.formControlSetReadOnly('METAL_ScrapLocCode', true)
      this.commonService.formControlSetReadOnly('METAL_ToStockCode', true)
      this.commonService.formControlSetReadOnly('METAL_ScrapStockCode', true)
      this.toProcessMasterSearch.VIEW_ICON = false;
      this.toWorkerMasterSearch.VIEW_ICON = false;
      this.stockCodeSearch.VIEW_ICON = false;
      this.locationSearch.VIEW_ICON = false;
      this.metalScrapStockCode.VIEW_ICON = false;
    } else {
      if (this.fromProcessCodeEmpty) return
      this.fromWorkerCodeEmpty = false;
      this.commonService.formControlSetReadOnly('TO_PROCESS_CODE', false)
      this.commonService.formControlSetReadOnly('TO_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('TO_PCS', false)
      this.commonService.formControlSetReadOnly('GrossWeightTo', false)
      this.commonService.formControlSetReadOnly('stockCode', false)
      this.commonService.formControlSetReadOnly('txtLossQty', false)
      // for metal tab
      this.commonService.formControlSetReadOnly('METAL_TO_PROCESS_CODE', false)
      this.commonService.formControlSetReadOnly('METAL_TO_WORKER_CODE', false)
      this.commonService.formControlSetReadOnly('METAL_ScrapLocCode', false)
      this.commonService.formControlSetReadOnly('METAL_ToStockCode', false)
      this.commonService.formControlSetReadOnly('METAL_ScrapStockCode', false)
      this.toProcessMasterSearch.VIEW_ICON = true;
      this.toWorkerMasterSearch.VIEW_ICON = true;
      this.stockCodeSearch.VIEW_ICON = true;
      this.locationSearch.VIEW_ICON = true;
      this.metalScrapStockCode.VIEW_ICON = true;
    }
  }
  /**USE:from porcesscode Validate API call */
  fromProcesscodeValidate(event: any) {
    this.setFromWorkerWhereCondition()
    this.setFromProcessWhereCondition()
    if (this.viewMode) return
    if (event.target.value == '') {
      this.isFromProcessCodeEmpty(true)
      return
    }
    this.isFromProcessCodeEmpty(false)
    let form = this.processTransferdetailsForm.value
    let postData = {
      "SPID": "083",
      "parameter": {
        'StrCurrentUser': this.commonService.nullToString(this.commonService.userName),
        'StrProcessCode': this.commonService.nullToString(event.target.value),
        'StrSubJobNo': this.commonService.nullToString(form.UNQ_JOB_ID),
        'StrBranchCode': this.commonService.branchCode
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data.length == 0) {
            this.fromProcessMasterSearch.SEARCH_VALUE = event.target.value;
            if (this.designType == 'METAL') {
              this.MetalfromProcessMasterOverlay.showOverlayPanel(event);
              this.setFormNullToString('METAL_FRM_PROCESS_CODE', '')
            } else {
              this.fromProcessMasterOverlay.showOverlayPanel(event)
              this.setFormNullToString('FRM_PROCESS_CODE', '')
            }
            this.fromProcesscodeInputChange()
            this.setFromWorkerWhereCondition()
            this.setFromProcessWhereCondition()
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
  // to processcode validate
  toProcesscodeValidate(event: any) {
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
    if (this.fromWorkerCodeEmpty || this.fromProcessCodeEmpty) return
    if (event.target.value == '' || this.viewMode) {
      return
    }
    let form = this.processTransferdetailsForm.value
    let postData = {
      "SPID": "098",
      "parameter": {
        'JobNumber': this.commonService.nullToString(form.JOB_NUMBER),
        'BranchCode': this.commonService.nullToString(form.BRANCH_CODE),
        'CurrentUser': this.commonService.nullToString(this.commonService.userName),
        'ToWorker': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_TO_WORKER_CODE : form.TO_WORKER_CODE),
        'ToProcesscode': this.commonService.nullToString(event.target.value),
        'ToWorkerFocus': '1'
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data.length == 0) {
            this.toProcessMasterSearch.SEARCH_VALUE = event.target.value;
            if (this.designType == 'METAL') {
              this.MetaltoProcessMasterOverlay.showOverlayPanel(event);
              this.setFormNullToString('METAL_TO_PROCESS_CODE', '')
            } else {
              this.toProcessMasterOverlay.showOverlayPanel(event);
              this.setFormNullToString('TO_PROCESS_CODE', '')
            }
            this.setToProcessWhereCondition();
            this.setToWorkerWhereCondition();
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
  fromProcesscodeInputChange() {
    const code = this.designType == 'METAL'
      ? this.processTransferdetailsForm.value.METAL_FRM_PROCESS_CODE
      : this.processTransferdetailsForm.value.FRM_PROCESS_CODE
    this.isFromProcessCodeEmpty(code.toString() === '');//input boolean
  }
  fromWorkercodeInputChange() {
    const code = this.designType == 'METAL'
      ? this.processTransferdetailsForm.value.METAL_FRM_WORKER_CODE
      : this.processTransferdetailsForm.value.FRM_WORKER_CODE
    this.isFromWorkerCodeEmpty(code.toString() === '')//input boolean
  }
  // from Workercode Validate
  fromWorkercodeValidate(event: any) {
    this.setFromWorkerWhereCondition()
    this.setFromProcessWhereCondition()
    if (this.viewMode || this.fromProcessCodeEmpty) return
    if (this.commonService.nullToString(event.target.value) == '') {
      this.isFromWorkerCodeEmpty(true)
      return
    }
    this.isFromWorkerCodeEmpty(false)
    let form = this.processTransferdetailsForm.value
    let postData = {
      "SPID": "084",
      "parameter": {
        'StrSubJobNo': this.commonService.nullToString(form.UNQ_JOB_ID),
        'StrFromProcess': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_FRM_PROCESS_CODE : form.FRM_PROCESS_CODE),
        'StrFromWorker': this.commonService.nullToString(event.target.value),
        'StrBranchCode': this.commonService.nullToString(form.BRANCH_CODE),
        'blnProcessAuthroize': '',
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = result?.dynamicData[0] || []
        if (data.length == 0) {
          this.fromWorkerMasterSearch.SEARCH_VALUE = event.target.value;
          if (this.designType == 'METAL') {
            this.MetalfromWorkerMasterOverley.showOverlayPanel(event);
            this.setFormNullToString('METAL_FRM_WORKER_CODE', '')
          } else {
            this.fromWorkerMasterOverley.showOverlayPanel(event);
            this.setFormNullToString('FRM_WORKER_CODE', '')
          }
          this.fromWorkercodeInputChange()
          this.setFromWorkerWhereCondition()
          this.setFromProcessWhereCondition()
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  // to Workercode Validate
  toWorkercodeValidate(event: any) {
    this.setToWorkerWhereCondition()
    this.setToProcessWhereCondition()
    if (this.fromWorkerCodeEmpty || this.fromProcessCodeEmpty) return
    if (event.target.value == '' || this.viewMode) {
      return
    }
    let form = this.processTransferdetailsForm.value
    let postData = {
      "SPID": "085",
      "parameter": {
        'StrToProcess': this.commonService.nullToString(this.designType == 'METAL' ? form.METAL_TO_PROCESS_CODE : form.TO_PROCESS_CODE),
        'StrToWorker': this.commonService.nullToString(event.target.value),
        'blntoWorkerFocus': '1',
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {

          let data = result.dynamicData[0]
          if (data.length == 0) {
            this.toWorkerMasterSearch.SEARCH_VALUE = event.target.value;
            if (this.designType == 'METAL') {
              this.MetaltoWorkerMasterOverley.showOverlayPanel(event)
              this.setFormNullToString('METAL_TO_WORKER_CODE', '')
            } else {
              this.toWorkerMasterOverley.showOverlayPanel(event)
              this.setFormNullToString('TO_WORKER_CODE', '')
            }
            this.setToWorkerWhereCondition()
            this.setToProcessWhereCondition()
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
  selectAllBtnChange(event: any) {
    this.processTransferdetailsForm.controls.SETTED_FLAG.setValue(event.checked)
    console.log(this.processTransferdetailsForm.value.SETTED_FLAG);
    this.metalDetailData.forEach((item: any) => {
      if (event.checked) {
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
    this.fromProcesscodeInputChange()
    this.fromWorkercodeInputChange()
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    let data = this.subJobDetailData.filter((item: any) => event.PROCESS?.toUpperCase() == item.PROCESS?.toUpperCase() && event.WORKER?.toUpperCase() == item.WORKER?.toUpperCase())
    if (data && data.length > 0) {
      if (this.designType == 'METAL') { //metal data assigning
        this.setMetalSubJob_Details(data)
      } else {
        this.setSubJob_Details(data)
      }
    }
  }
  processCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_PROCESS_CODE.setValue(event.PROCESS_CODE)
    this.processTransferdetailsForm.controls.TO_PROCESSNAME.setValue(event.DESCRIPTION)
    this.setToWorkerWhereCondition()
    this.fromProcesscodeInputChange()
    this.fromWorkercodeInputChange()
  }

  metalprocessCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_PROCESS_CODE.setValue(event.PROCESS)
    this.fromProcesscodeInputChange()
    this.fromWorkercodeInputChange()
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
    let data = this.subJobDetailData.filter((item: any) => event.PROCESS?.toUpperCase() == item.PROCESS?.toUpperCase() && event.WORKER?.toUpperCase() == item.WORKER?.toUpperCase())
    if (data && data.length > 0) {
      if (this.designType == 'METAL') { //metal data assigning
        this.setMetalSubJob_Details(data)
      } else {
        this.setSubJob_Details(data)
      }
    }
  }
  metalprocessCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_PROCESS_CODE.setValue(event.PROCESS_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_PROCESSNAME.setValue(event.DESCRIPTION)
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
  }

  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.FRM_WORKER_CODE.setValue(event.WORKER_CODE)
    this.isFromWorkerCodeEmpty(false)
    this.setFromWorkerWhereCondition()
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.TO_WORKERNAME.setValue(event.DESCRIPTION)
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
    this.fromProcesscodeInputChange()
    this.fromWorkercodeInputChange()
  }

  metalworkerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_FRM_WORKER_CODE.setValue(event.WORKER_CODE)
    this.setFromProcessWhereCondition()
    this.setFromWorkerWhereCondition()
  }

  metalworkerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_TO_WORKER_CODE.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.METAL_TO_WORKERNAME.setValue(event.DESCRIPTION)
    this.setToProcessWhereCondition()
    this.setToWorkerWhereCondition()
  }
  metalScrapStockCodeSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_ScrapStockCode.setValue(event.STOCK_CODE)
    this.processTransferdetailsForm.controls.METAL_STOCK_DESCRIPTION.setValue(event.DESCRIPTION)
    if (event.STOCK_CODE) {
      this.locationSearchFlag = true;
    }
    this.txtMScrapStockCode_Validating()
  }
  metalToStockCodeSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_ToStockCode.setValue(event.STOCK_CODE)
    this.processTransferdetailsForm.controls.METAL_STOCK_DESCRIPTION.setValue(event.DESCRIPTION)
    if (event.STOCK_CODE) {
      this.locationSearchFlag = true;
    }
    // this.stockCodeScrapValidate()
  }
  stockCodeSelected(event: any) {
    this.processTransferdetailsForm.controls.stockCode.setValue(event.STOCK_CODE)
    this.processTransferdetailsForm.controls.STOCK_DESCRIPTION.setValue(event.DESCRIPTION)
    if (event.STOCK_CODE) {
      this.locationSearchFlag = true;
    }
    this.stockCodeScrapValidate()
  }
  metallocationSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_ScrapLocCode.setValue(event.Location)
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
    this.jobNumberValidate()
  }

  subJobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.UNQ_JOB_ID.setValue(event.UNQ_JOB_ID)
    this.processTransferdetailsForm.controls.SUB_JOB_DESCRIPTION.setValue(event.DESCRIPTION)
    this.subJobNumberValidate()
  }
  submitValidations(form: any): boolean {
    try {
      if (this.commonService.nullToString(form.JOB_NUMBER) == '') {
        this.commonService.toastErrorByMsgId('MSG1358')
        this.renderer.selectRootElement('#jobNoSearch')?.focus();
        return true;
      }
      if (this.commonService.nullToString(form.FRM_PROCESS_CODE) == '') {
        this.commonService.toastErrorByMsgId('MSG1295')
        return true;
      }
      if (this.commonService.nullToString(form.FRM_WORKER_CODE) == '') {
        this.commonService.toastErrorByMsgId('MSG1296')
        return true;
      }
      if (this.commonService.nullToString(form.TO_WORKER_CODE) == '') {
        this.commonService.toastErrorByMsgId('MSG1912')
        return true;
      }
      if (this.commonService.nullToString(form.TO_PROCESS_CODE) == '') {
        this.commonService.toastErrorByMsgId('MSG1680')
        return true;
      }
      if (this.emptyToZero(form.Balance_WT) < 0) {
        this.commonService.toastErrorByMsgId('MSG8126')
        return true;
      }
      if (this.emptyToZero(form.GrossWeightTo) < 0) {
        this.commonService.toastErrorByMsgId('MSG1302')
        return true;
      }

      if (this.emptyToZero(form.scrapWeight) != 0) {
        if (this.commonService.nullToString(form.location) == '') { //&& blnLoc == true dbt
          this.commonService.toastErrorByMsgId("MSG1381");//"Location can not be empty"
          return true;
        }
        if (this.commonService.nullToString(form.stockCode) == "") {
          this.commonService.toastErrorByMsgId("MSG3739"); // stock code scrap
          return true;
        }
      }
      if (this.metalDetailData.length <= 0) {
        this.commonService.toastErrorByMsgId("MSG3574"); //"No components details !..."
        return true;
      }
      if (this.approvalReqFlag && this.commonService.nullToString(form.APPROVED_USER) == '') {
        this.commonService.toastErrorByMsgId("MSG7741");
        return true;
      }
      let SettedData = this.metalDetailData.filter((item: any) => item.SETTED_FLAG == true)

      if (form.FRM_PROCESS_CODE?.toUpperCase() == 'SETTIN' && SettedData.length == 0) {
        this.commonService.toastErrorByMsgId("MSG1463");
        return true;
      }
      return false;
    }
    catch (err) {
      this.commonService.toastErrorByMsgId("MSG2100");
      return true;
    }
  }
  submitValidateMetal(form: any): boolean {
    try {
      if (this.commonService.nullToString(form.JOB_NUMBER) == '') {
        this.commonService.toastErrorByMsgId('MSG1358')
        this.renderer.selectRootElement('#jobNoSearch')?.focus();
        return true;
      }
      if (this.commonService.nullToString(form.METAL_TO_WORKER_CODE) == '') {
        this.commonService.toastErrorByMsgId('MSG1912')
        return true;
      }

      if (this.commonService.nullToString(form.METAL_TO_PROCESS_CODE) == '') {
        this.commonService.toastErrorByMsgId("MSG1680");
        return true;
      }
      if (this.emptyToZero(form.METAL_LossBooked) != 0 && this.designType == "METAL") {
        let processData = this.sequenceDetails.filter((item: any) => item.seq_code?.toUpperCase() == form.SEQ_CODE?.toUpperCase() && item.PROCESS_CODE?.toUpperCase() == form.METAL_FRM_PROCESS_CODE?.toUpperCase())
        if (processData.length != 0 && processData[0]["loss_accode"].toString() == "") {
          let msg = this.commonService.getMsgByID("MSG3770") + " " + form.METAL_FRM_PROCESS_CODE
          this.commonService.toastErrorByMsgId(msg)
          return true;
        }
      }
      if (this.emptyToZero(form.METAL_LossBooked) > 0 && this.emptyToZero(form.gainGrWt) > 0) {
        this.commonService.toastErrorByMsgId("MSG1695");
        return true;
      }
      let totalWt = ((this.emptyToZero(form.METAL_ToNetWt) +
        this.emptyToZero(form.METAL_ScrapNetWt) + this.emptyToZero(form.METAL_LossBooked) +
        this.emptyToZero(form.METAL_BalNetWt)) - this.emptyToZero(form.METAL_GainGrWt))
      if (this.emptyToZero(form.METAL_FromNetWeight) != this.emptyToZero(this.commonService.decimalQuantityFormat(totalWt, 'THREE'))) {
        this.commonService.toastErrorByMsgId("MSG1695");
        return true;
      }
      if (this.emptyToZero(form.METAL_BalIronWt) < 0) {
        this.commonService.toastErrorByMsgId("MSG8126");
        return true;
      }
      if (this.emptyToZero(form.METAL_BalNetWt) < 0) {
        this.commonService.toastErrorByMsgId("MSG8126");
        return true;
      }
      if (this.emptyToZero(form.METAL_BalNetWt) == 0 && this.emptyToZero(form.METAL_BalPureWt) >= 1) {
        this.commonService.toastErrorByMsgId("MSG8126");
        return true;
      }
      if (this.emptyToZero(form.METAL_GrossWeightTo) < 0) {
        this.commonService.toastErrorByMsgId("MSG1302");
        return true;
      }
      if (this.emptyToZero(form.METAL_GainGrWt) > 0) {
        let processData = this.sequenceDetails.filter((item: any) => item.seq_code == form.SEQ_CODE && item.PROCESS_CODE == form.METAL_FRM_PROCESS_CODE)
        if (processData.length != 0 && this.commonService.Null2BitValue(processData[0]["GAIN_ACCODE"]) == false) {
          let msg = this.commonService.getMsgByID("MSG3865")
          this.commonService.toastErrorByMsgId(msg)
          return true;
        }
      }
      if (this.emptyToZero(form.METAL_ScrapGrWt) != 0) {
        if (this.commonService.nullToString(form.METAL_ScrapLocCode) == '' && this.locationSearchFlag == true) {
          this.commonService.toastErrorByMsgId("MSG1381");//"Location can not be empty"
          return true;
        }
        if (this.commonService.nullToString(form.METAL_ScrapStockCode) == "") {
          this.commonService.toastErrorByMsgId("MSG1817"); //"Stock Code Cannot be Empty"
          return true;
        }
      }
      if (this.metalDetailData.length <= 0) {
        this.commonService.toastErrorByMsgId("MSG3574"); //"No components details !..."
        return true;
      }
      if (this.approvalReqFlag && this.commonService.nullToString(form.APPROVED_USER) == '') {
        this.commonService.toastErrorByMsgId("MSG7741");
        return true;
      }
      let dblGrsWt = 0;
      for (let i = 0; i < this.metalDetailData.length; i++) {
        dblGrsWt += this.emptyToZero(this.metalDetailData[i]["GROSS_WT"]);

        if (this.metalDetailData[i]["METALSTONE"].trim() == "M") {
          if (this.emptyToZero(this.metalDetailData[i]["PURITY"]) <= 0) {
            this.commonService.toastErrorByMsgId("MSG1693");
            return true;
          }
          if (this.emptyToZero(this.metalDetailData[i]["LOSS_QTY"]) < 0) {
            this.commonService.toastErrorByMsgId("MSG3772");
            return true;
          }
        }
      }
      if (dblGrsWt <= 0 && this.metalDetailData.length > 0 && this.emptyToZero(form.METAL_LossBooked) == 0) {
        this.commonService.toastErrorByMsgId("MSG1302");
        return true;
      }
      return false;
    }
    catch (err) {
      this.commonService.toastErrorByMsgId("MSG2100");
      return true;
    }
  }
  /**USE: SUBMIT detail */
  formSubmit(flag: any) {
    if (this.designType == 'METAL') {
      if (this.submitValidateMetal(this.processTransferdetailsForm.value)) return;
    } else {
      if (this.submitValidations(this.processTransferdetailsForm.value)) return;
    }
    this.calculateGain()
    this.processTransferdetailsForm.controls.FLAG.setValue(flag)

    let detailDataToParent: any = {
      PROCESS_FORMDETAILS: this.processTransferdetailsForm.value,
      TRN_STNMTL_GRID: this.metalDetailData,
      JOB_PROCESS_TRN_DETAIL_DJ: this.designType == 'METAL' ? this.setMetal_JOB_PROCESS_TRN_DETAIL_DJ() : this.setJOB_PROCESS_TRN_DETAIL_DJ(),
      JOB_PROCESS_TRN_COMP_DJ: this.setJOB_PROCESS_TRN_COMP_DJ(),
      JOB_PROCESS_TRN_LABCHRG_DJ: this.setLabourChargeDetails()
    }
    console.log(detailDataToParent, 'detailDataToParent');
    this.saveDetail.emit(detailDataToParent);
    if (flag == 'CONTINUE') {
      this.resetPTFDetails()
    }
  }
  resetPTFDetails() {
    this.processTransferdetailsForm.reset()
    this.metalDetailData = []
    this.imagepath = []
  }
  multiplyWithAmtDecimal(netwt: any, purity: any) {
    let val = this.commonService.pureWeightCalculate(netwt, purity)
    return this.emptyToZero(val.toFixed(this.commonService.mQtyDecimals))
  }
  getWipAccode(processCode: string, CODE: string) {
    let seqData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == processCode?.toUpperCase());
    if (seqData.length > 0 && seqData[0][CODE] != '') {
      return this.commonService.nullToString(seqData[0][CODE])
    }
    let processData = this.processMasterDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == processCode?.toUpperCase());
    if (processData.length > 0) return this.commonService.nullToString(processData[0][CODE])
    return ''
  }
  gridSRNO: number = 0
  setJOB_PROCESS_TRN_DETAIL_DJ() {
    let form = this.processTransferdetailsForm.value;

    let LOSS_PURE_QTY = this.calculateLossPureQty(this.processTransferdetailsForm.value);
    let metalGridDataSum = this.calculateMetalStoneGridAmount();
    let seqDataFrom = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.FRM_PROCESS_CODE?.toUpperCase());
    let scrapPureWt = this.multiplyWithAmtDecimal(form.scrapWeight, form.SCRAP_PURITY)
    let FRM_WIP_ACCODE = this.getWipAccode(form.FRM_PROCESS_CODE, 'WIP_ACCODE')
    let TO_WIP_ACCODE = this.getWipAccode(form.TO_PROCESS_CODE, 'WIP_ACCODE')
    let LAB_ACCODE = this.getWipAccode(form.TO_PROCESS_CODE, 'LAB_ACCODE')
    let LOSS_ACCODE = this.getWipAccode(form.TO_PROCESS_CODE, 'LOSS_ACCODE')
    // let amountFC = this.commonService.FCToCC(form.CURRENCY_CODE, stoneAmount)
    this.gridSRNO += 1
    return {
      "SRNO": this.emptyToZero(form.SRNO),
      "UNIQUEID": 0,
      "VOCNO": this.emptyToZero(form.VOCNO),
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
      "CURRENCY_RATE": this.emptyToZero(form.CURRENCY_RATE),
      "FRM_PROCESS_CODE": this.commonService.nullToString(form.FRM_PROCESS_CODE?.toUpperCase()),
      "FRM_PROCESSNAME": this.commonService.nullToString(form.FRM_PROCESSNAME?.toUpperCase()),
      "FRM_WORKER_CODE": this.commonService.nullToString(form.FRM_WORKER_CODE?.toUpperCase()),
      "FRM_WORKERNAME": this.commonService.nullToString(form.FRM_WORKERNAME?.toUpperCase()),
      "FRM_PCS": this.emptyToZero(form.FRM_PCS),
      "FRM_STONE_WT": this.emptyToZero(form.FRM_STONE_WT),
      "FRM_STONE_PCS": this.emptyToZero(form.FRM_STONE_PCS),
      "FRM_METAL_WT": this.emptyToZero(form.FRM_METAL_WT),
      "FRM_METAL_PCS": this.emptyToZero(form.FRM_METAL_PCS),
      "FRM_PURE_WT": this.multiplyWithAmtDecimal(form.FRM_METAL_WT, form.PURITY),
      "FRM_NET_WT": this.emptyToZero(form.FRM_METAL_WT),
      "TO_PROCESS_CODE": this.commonService.nullToString(form.TO_PROCESS_CODE?.toUpperCase()),
      "TO_PROCESSNAME": this.commonService.nullToString(form.TO_PROCESSNAME?.toUpperCase()),
      "TO_WORKER_CODE": this.commonService.nullToString(form.TO_WORKER_CODE?.toUpperCase()),
      "TO_WORKERNAME": this.commonService.nullToString(form.TO_WORKERNAME?.toUpperCase()),
      "TO_PCS": this.emptyToZero(form.TO_PCS),
      "TO_METAL_PCS": this.emptyToZero(form.TO_METAL_PCS),
      "TO_STONE_WT": this.emptyToZero(form.TO_STONE_WT),
      "TO_STONE_PCS": this.emptyToZero(form.TO_STONE_PCS),
      "TO_METAL_WT": this.emptyToZero(form.TO_METAL_WT),
      "TO_PURE_WT": this.multiplyWithAmtDecimal(form.TO_METAL_WT, form.PURITY),
      "TO_NET_WT": this.emptyToZero(form.TO_METAL_WT),
      "LOSS_QTY": this.emptyToZero(form.lossQty),
      "LOSS_PURE_QTY": this.emptyToZero(LOSS_PURE_QTY),
      "STONE_AMOUNTFC": this.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "STONE_AMOUNTLC": this.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "METAL_AMOUNTFC": this.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "METAL_AMOUNTLC": this.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "TOTAL_AMOUNTFC": this.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "TOTAL_AMOUNTLC": this.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "COSTFC_PER_PCS": 0,
      "COSTLC_PER_PCS": 0,
      "LAB_CODE": "",
      "LAB_UNIT": "",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": this.commonService.nullToString(LAB_ACCODE),
      "LOSS_ACCODE": this.commonService.nullToString(LOSS_ACCODE),
      "FRM_WIP_ACCODE": this.commonService.nullToString(FRM_WIP_ACCODE),
      "TO_WIP_ACCODE": this.commonService.nullToString(TO_WIP_ACCODE),
      "RET_METAL_DIVCODE": "",
      "RET_METAL_STOCK_CODE": "",
      "RET_STONE_DIVCODE": "",
      "RET_STONE_STOCK_CODE": "",
      "RET_METAL_WT": this.commonService.decimalQuantityFormat(0, 'METAL'),
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_STONE_WT": this.commonService.decimalQuantityFormat(0, 'STONE'),
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
      "TIME_TAKEN_HRS": this.emptyToZero(this.TimeTakenData.TIMEINMINUTES),
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": this.commonService.nullToString(form.location),
      "PICTURE_PATH": this.commonService.nullToString(form.PICTURE_PATH),
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "JOB_PCS": this.emptyToZero(form.JOB_PCS),
      "STONE_WT": this.emptyToZero(form.TO_STONE_WT),
      "STONE_PCS": this.emptyToZero(form.TO_STONE_PCS),
      "METAL_WT": this.emptyToZero(form.TO_METAL_WT),
      "METAL_PCS": this.emptyToZero(form.TO_METAL_PCS),
      "PURE_WT": this.multiplyWithAmtDecimal(form.TO_METAL_WT, form.PURITY),
      "GROSS_WT": this.emptyToZero(form.GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE),
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(form.remarks),
      "TREE_NO": this.commonService.nullToString(form.TREE_NO),
      "STD_TIME": this.emptyToZero(this.STDDateTimeData.TIMEINMINUTES),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": this.commonService.nullToString(form.PRODLAB_ACCODE),
      "DT_BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "ISSUE_REF": this.commonService.nullToString(form.barCodeNumber),
      "IS_AUTHORISE": false,
      "TIME_CONSUMED": this.emptyToZero(this.consumedTimeData.TIMEINMINUTES),
      "SCRAP_STOCK_CODE": this.commonService.nullToString(form.stockCode),
      "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
      "SCRAP_PURITY": this.emptyToZero(form.SCRAP_PURITY),
      "SCRAP_WT": this.emptyToZero(form.scrapWeight),
      "SCRAP_PURE_WT": scrapPureWt,
      "SCRAP_PUDIFF": this.emptyToZero((Number(form.scrapWeight) - Number(form.PURITY)) * scrapPureWt),
      "SCRAP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "APPROVED_DATE": this.commonService.formatDateTime(form.approveddate),
      "APPROVED_USER": this.commonService.nullToString(form.APPROVED_USER),
      "SCRAP_PCS": this.emptyToZero(form.METAL_ScrapPCS),
      "SCRAP_STONEWT": this.emptyToZero(form.METAL_ScrapStoneWt),
      "SCRAP_NETWT": this.emptyToZero(form.METAL_ScrapNetWt),
      "FROM_IRONWT": this.emptyToZero(form.METAL_FromIronWeight),
      "FROM_MSTOCKCODE": this.commonService.nullToString(form.METAL_FromStockCode),
      "TO_MSTOCKCODE": this.commonService.nullToString(form.METAL_ToStockCode),
      "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
      "TO_IRONWT": this.emptyToZero(form.METAL_ToIronWt),
      "FRM_DIAGROSS_WT": this.emptyToZero(form.GrossWeightFrom),
      "EXCLUDE_TRANSFER_WT": this.commonService.Null2BitValue(form.EXCLUDE_TRANSFER_WT),
      "SCRAP_DIVCODE": this.commonService.nullToString(form.SCRAP_DIVCODE),
      "IRON_SCRAP_WT": this.calculateIronScrapWeight(form),
      "GAIN_WT": this.commonService.decimalQuantityFormat(this.emptyToZero(form.METAL_GainGrWt), 'METAL'),
      "GAIN_PURE_WT": this.emptyToZero(form.METAL_GainPureWt),
      "GAIN_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "IS_REJECT": false,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": ""
    }
  }
  setMetal_JOB_PROCESS_TRN_DETAIL_DJ() { //for metal
    let form = this.processTransferdetailsForm.value;
    let LOSS_PURE_QTY = this.calculateLossPureQty(this.processTransferdetailsForm.value);
    let metalGridDataSum = this.calculateMetalStoneGridAmount();
    let seqDataFrom = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.FRM_PROCESS_CODE?.toUpperCase());
    let seqDataTo = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.TO_PROCESS_CODE?.toUpperCase());
    let FRM_WIP_ACCODE = this.getWipAccode(form.METAL_FRM_PROCESS_CODE, 'WIP_ACCODE')
    let TO_WIP_ACCODE = this.getWipAccode(form.METAL_TO_PROCESS_CODE, 'WIP_ACCODE')
    let LAB_ACCODE = this.getWipAccode(form.METAL_TO_PROCESS_CODE, 'LAB_ACCODE')
    let LOSS_ACCODE = this.getWipAccode(form.METAL_TO_PROCESS_CODE, 'LOSS_ACCODE')
    this.gridSRNO += 1
    return {
      "SRNO": this.emptyToZero(form.SRNO),
      "UNIQUEID": 0,
      "VOCNO": this.emptyToZero(form.VOCNO),
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
      "CURRENCY_RATE": this.emptyToZero(form.CURRENCY_RATE),
      "FRM_PROCESS_CODE": this.commonService.nullToString(form.METAL_FRM_PROCESS_CODE?.toUpperCase()),
      "FRM_PROCESSNAME": this.commonService.nullToString(form.FRM_PROCESSNAME?.toUpperCase()),
      "FRM_WORKER_CODE": this.commonService.nullToString(form.METAL_FRM_WORKER_CODE?.toUpperCase()),
      "FRM_WORKERNAME": this.commonService.nullToString(form.FRM_WORKERNAME?.toUpperCase()),
      "FRM_PCS": this.emptyToZero(form.METAL_FromPCS),
      "FRM_STONE_WT": this.emptyToZero(form.METAL_FRM_STONE_WT),
      "FRM_STONE_PCS": this.emptyToZero(0),
      "FRM_METAL_WT": this.emptyToZero(form.METAL_GrossWeightFrom),
      "FRM_METAL_PCS": this.emptyToZero(form.METAL_FromPCS),
      "FRM_PURE_WT": this.emptyToZero(form.METAL_FromPureWt),
      "FRM_NET_WT": this.emptyToZero(form.METAL_FromNetWeight),
      "TO_PROCESS_CODE": this.commonService.nullToString(form.METAL_TO_PROCESS_CODE?.toUpperCase()),
      "TO_PROCESSNAME": this.commonService.nullToString(form.METAL_TO_PROCESSNAME?.toUpperCase()),
      "TO_WORKER_CODE": this.commonService.nullToString(form.METAL_TO_WORKER_CODE?.toUpperCase()),
      "TO_WORKERNAME": this.commonService.nullToString(form.METAL_TO_WORKERNAME?.toUpperCase()),
      "TO_PCS": this.emptyToZero(form.METAL_ToPCS),
      "TO_METAL_PCS": this.emptyToZero(form.METAL_ToPCS),
      "TO_STONE_WT": this.emptyToZero(form.METAL_TO_STONE_WT),
      "TO_STONE_PCS": this.emptyToZero(0),
      "TO_METAL_WT": this.emptyToZero(form.METAL_GrossWeightTo),
      "TO_PURE_WT": this.emptyToZero(form.METAL_ToPureWt),
      "TO_NET_WT": this.emptyToZero(form.METAL_ToNetWt),
      "LOSS_QTY": this.emptyToZero(form.METAL_LossBooked),
      "LOSS_PURE_QTY": this.emptyToZero(LOSS_PURE_QTY),
      "STONE_AMOUNTFC": this.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "STONE_AMOUNTLC": this.emptyToZero(metalGridDataSum.STONE_AMOUNTLC),
      "METAL_AMOUNTFC": this.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "METAL_AMOUNTLC": this.emptyToZero(metalGridDataSum.METAL_AMOUNTLC),
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "TOTAL_AMOUNTFC": this.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "TOTAL_AMOUNTLC": this.emptyToZero(metalGridDataSum.TOTAL_AMOUNTLC),
      "COSTFC_PER_PCS": 0,
      "COSTLC_PER_PCS": 0,
      "LAB_CODE": "",
      "LAB_UNIT": "",
      "LAB_RATEFC": 0,
      "LAB_RATELC": 0,
      "LAB_ACCODE": this.commonService.nullToString(LAB_ACCODE),
      "LOSS_ACCODE": this.commonService.nullToString(LOSS_ACCODE),
      "FRM_WIP_ACCODE": this.commonService.nullToString(FRM_WIP_ACCODE),
      "TO_WIP_ACCODE": this.commonService.nullToString(TO_WIP_ACCODE),
      "RET_METAL_DIVCODE": "",
      "RET_METAL_STOCK_CODE": "",
      "RET_STONE_DIVCODE": "",
      "RET_STONE_STOCK_CODE": "",
      "RET_METAL_WT": this.commonService.decimalQuantityFormat(0, 'METAL'),
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_STONE_WT": this.commonService.decimalQuantityFormat(0, 'STONE'),
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
      "TIME_TAKEN_HRS": this.emptyToZero(this.TimeTakenData.TIMEINMINUTES),
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": this.commonService.nullToString(form.METAL_ScrapLocCode),
      "PICTURE_PATH": this.commonService.nullToString(form.PICTURE_PATH),
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "JOB_PCS": this.emptyToZero(form.JOB_PCS),
      "STONE_WT": this.emptyToZero(form.METAL_TO_STONE_WT),
      "STONE_PCS": this.emptyToZero(form.TO_STONE_PCS),
      "METAL_WT": this.emptyToZero(form.METAL_GrossWeightTo),
      "METAL_PCS": this.emptyToZero(form.TO_METAL_PCS),
      "PURE_WT": this.emptyToZero(form.METAL_ToPureWt),
      "GROSS_WT": this.emptyToZero(form.METAL_GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": this.commonService.nullToString(form.FRM_WORKER_CODE?.toUpperCase()),
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(form.remarks),
      "TREE_NO": this.commonService.nullToString(form.TREE_NO),
      "STD_TIME": this.emptyToZero(this.STDDateTimeData.TIMEINMINUTES),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": this.commonService.nullToString(form.PRODLAB_ACCODE),
      "DT_BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "ISSUE_REF": this.commonService.nullToString(form.barCodeNumber),
      "IS_AUTHORISE": false,
      "TIME_CONSUMED": this.emptyToZero(this.consumedTimeData.TIMEINMINUTES),
      "SCRAP_STOCK_CODE": this.commonService.nullToString(form.METAL_ScrapStockCode),
      "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(form.MAIN_STOCK_CODE),
      "SCRAP_PURITY": this.emptyToZero(form.SCRAP_PURITY),
      "SCRAP_WT": this.emptyToZero(form.METAL_ScrapGrWt),
      "SCRAP_PURE_WT": this.emptyToZero(form.METAL_ScrapPureWt),
      "SCRAP_PUDIFF": this.emptyToZero((Number(form.METAL_ScrapGrWt) - Number(form.PURITY)) * form.METAL_ScrapPureWt),
      "SCRAP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "APPROVED_DATE": this.commonService.formatDateTime(form.approveddate),
      "APPROVED_USER": this.commonService.nullToString(form.APPROVED_USER),
      "SCRAP_PCS": this.emptyToZero(form.METAL_ScrapPCS),
      "SCRAP_STONEWT": this.emptyToZero(form.METAL_ScrapStoneWt),
      "SCRAP_NETWT": this.emptyToZero(form.METAL_ScrapNetWt),
      "FROM_IRONWT": this.emptyToZero(form.METAL_FromIronWeight),
      "FROM_MSTOCKCODE": this.commonService.nullToString(form.METAL_FromStockCode),
      "TO_MSTOCKCODE": this.commonService.nullToString(form.METAL_ToStockCode),
      "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
      "TO_IRONWT": this.emptyToZero(form.METAL_ToIronWt),
      "FRM_DIAGROSS_WT": this.emptyToZero(form.GrossWeightFrom),
      "EXCLUDE_TRANSFER_WT": this.commonService.Null2BitValue(form.EXCLUDE_TRANSFER_WT),
      "SCRAP_DIVCODE": this.commonService.nullToString(form.SCRAP_DIVCODE),
      "IRON_SCRAP_WT": this.emptyToZero(form.METAL_ToIronScrapWt),
      "GAIN_WT": this.commonService.decimalQuantityFormat(this.emptyToZero(form.METAL_GainGrWt), 'METAL'),
      "GAIN_PURE_WT": this.emptyToZero(form.METAL_GainPureWt),
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
      totalAmount += this.emptyToZero(item.AMOUNTFC);
      if (item.METALSTONE == 'S') {
        stoneAmount += this.emptyToZero(item.AMOUNTFC);
      }
      if (item.METALSTONE == 'M') {
        metalAmount += this.emptyToZero(item.AMOUNTFC);
      }
    })
    return {
      STONE_AMOUNTLC: this.emptyToZero(stoneAmount.toFixed(2)),
      METAL_AMOUNTLC: this.emptyToZero(metalAmount.toFixed(2)),
      TOTAL_AMOUNTLC: this.emptyToZero(totalAmount.toFixed(2))
    }
  }

  private calculateIronScrapWeight(data: any): number {
    let toIronScrapWt = (this.emptyToZero(data.METAL_FromIronWeight) + this.emptyToZero(data.METAL_FromNetWeight))
    toIronScrapWt = toIronScrapWt * (this.emptyToZero(data.METAL_ScrapGrWt) - this.emptyToZero(data.METAL_ScrapStoneWt));
    toIronScrapWt = this.emptyToZero(data.METAL_FromIronWeight) / this.emptyToZero(data.METAL_ToIronScrapWt)
    return this.emptyToZero(toIronScrapWt)
  }
  //calculate Loss Pure Qty
  private calculateLossPureQty(detailScreenData: any): number {
    detailScreenData.lossQty = this.emptyToZero(detailScreenData.lossQty);
    detailScreenData.PURITY = this.emptyToZero(detailScreenData.PURITY);
    let value = detailScreenData.lossQty * detailScreenData.PURITY
    return this.emptyToZero(value)
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
    let scrapPureWt = this.emptyToZero(Number(form.scrapWeight) * Number(form.SCRAP_PURITY))
    let seqData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.FRM_PROCESS_CODE?.toUpperCase());
    let LOSS_QTY = flag == 2 ? this.emptyToZero(form.lossQty) * -1 : 0;
    let SCRAP_WT = flag == 2 ? this.emptyToZero(form.scrapWeight) * -1 : 0;
    let SCRAP_PURE_WT = flag == 2 ? this.emptyToZero(scrapPureWt) * -1 : 0;
    let GAIN_WT = flag == 2 ? this.emptyToZero(form.METAL_GainGrWt) * -1 : 0;
    let GAIN_PURE_WT = flag == 2 ? this.emptyToZero(form.METAL_GainPureWt) * -1 : 0;
    let LOSS_PURE_WT = flag == 2 ? this.emptyToZero(form.LOSS_QTY * form.PURITY) * -1 : 0;
    let ADJUST_PUREWT = 0

    let data: any[] = []
    let componentDetails = this.metalDetailData.filter((item: any) => item.SELECTED == true)
    componentDetails.forEach((element: any) => {
      data.push({
        "VOCNO": this.emptyToZero(form.VOCNO),
        "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
        "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
        "JOB_NUMBER": this.commonService.nullToString(form.JOB_NUMBER),
        "JOB_SO_NUMBER": this.emptyToZero(form.JOB_SO_NUMBER),
        "UNQ_JOB_ID": this.commonService.nullToString(form.UNQ_JOB_ID),
        "JOB_DESCRIPTION": this.commonService.nullToString(form.JOB_DESCRIPTION),
        "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
        "DESIGN_CODE": this.commonService.nullToString(form.DESIGN_CODE),
        "METALSTONE": this.commonService.nullToString(element.METALSTONE),
        "DIVCODE": this.commonService.nullToString(element.DIVCODE),
        "STOCK_CODE": this.commonService.nullToString(element.STOCK_CODE),
        "STOCK_DESCRIPTION": this.commonService.nullToString(this.designType == 'METAL' ? element.METAL_STOCK_DESCRIPTION : element.STOCK_DESCRIPTION),
        "COLOR": this.commonService.nullToString(element.COLOR),
        "CLARITY": this.commonService.nullToString(element.CLARITY),
        "SHAPE": this.commonService.nullToString(element.SHAPE),
        "SIZE": this.commonService.nullToString(element.SIZE),
        "PCS": flag == 2 ? this.emptyToZero(element.PCS) * -1 : this.emptyToZero(element.PCS),
        "GROSS_WT": flag == 2 ? this.emptyToZero(element.GROSS_WT) * -1 : this.emptyToZero(element.GROSS_WT),
        "STONE_WT": flag == 2 ? this.emptyToZero(element.STONE_WT) * -1 : this.emptyToZero(element.STONE_WT),
        "NET_WT": flag == 2 ? this.emptyToZero(element.NET_WT) * -1 : this.emptyToZero(element.NET_WT),
        "RATE": this.emptyToZero(element.AMOUNTFC) / this.emptyToZero(element.GROSS_WT),
        "AMOUNT": 0,
        "PROCESS_CODE": flag == 2 ? this.commonService.nullToString(form.FRM_PROCESS_CODE) : form.TO_PROCESS_CODE,
        "WORKER_CODE": flag == 2 ? this.commonService.nullToString(form.FRM_WORKER_CODE) : form.TO_WORKER_CODE,
        "UNQ_DESIGN_ID": this.commonService.nullToString(form.UNQ_DESIGN_ID),
        "REFMID": 0,
        "AMOUNTLC": flag == 2 ? this.emptyToZero(element.AMOUNTLC) * -1 : this.emptyToZero(element.AMOUNTLC),
        "AMOUNTFC": flag == 2 ? this.emptyToZero(element.AMOUNTFC) * -1 : this.emptyToZero(element.AMOUNTFC),
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "CURRENCY_CODE": this.commonService.nullToString(element.CURRENCY_CODE),
        "CURRENCY_RATE": this.commonService.getCurrRate(element.CURRENCY_CODE),
        "YEARMONTH": this.commonService.yearSelected,
        "LOSS_QTY": flag == 2 ? this.emptyToZero(element.LOSS_QTY) * -1 : 0,
        "LABOUR_CODE": this.commonService.nullToString(element.lab_accode),
        "LAB_RATE": this.emptyToZero(element.LAB_RATE),
        "LAB_AMT": this.emptyToZero(element.LAB_AMT),
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
        "LAB_AMTFC": this.emptyToZero(element.LAB_AMT),
        "TO_PROCESS": this.commonService.nullToString(form.TO_PROCESS_CODE),
        "TO_WORKER": this.commonService.nullToString(form.TO_WORKER_CODE),
        "LAB_RATEFC": this.emptyToZero(element.LAB_RATE),
        "RATEFC": this.emptyToZero(element.RATEFC),
        "PRINTED": false,
        "PUREWT": flag == 2 ? (this.emptyToZero(element.NET_WT) * this.emptyToZero(element.PURITY)) * -1 : (this.emptyToZero(element.NET_WT) * this.emptyToZero(element.PURITY)),
        "PURITY": this.emptyToZero(element.PURITY),
        "SQLID": "",
        "ISBROCKEN": 0,
        "TREE_NO": '',
        "SETTED": element.SETTED_FLAG,
        "SETTED_PCS": flag == 2 ? this.emptyToZero(element.FRM_PCS) * -1 : 0,
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
        "SCRAP_PURITY": this.emptyToZero(form.SCRAP_PURITY),
        "SCRAP_WT": element.METALSTONE == 'M' ? SCRAP_WT : this.emptyToZero(element.SCRAP_WT),
        "SCRAP_PURE_WT": element.METALSTONE == 'M' ? SCRAP_PURE_WT : this.emptyToZero(element.SCRAP_PURE_WT),
        "SCRAP_PUDIFF": element.METALSTONE == 'M' ? this.emptyToZero((Number(form.scrapWeight) - Number(form.PURITY)) * scrapPureWt) : element.SCRAP_PURE_WT,
        "SCRAP_ACCODE": element.METALSTONE == 'M' && seqData.length > 0 ? this.commonService.nullToString(seqData[0].GAIN_AC) : '',
        "SYSTEM_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
        "ISSUE_GROSS_WT": flag == 2 ? this.emptyToZero(element.GROSS_WT) * -1 : this.emptyToZero(element.GROSS_WT),
        "ISSUE_STONE_WT": flag == 2 ? this.emptyToZero(element.STONE_WT) * -1 : this.emptyToZero(element.STONE_WT),
        "ISSUE_NET_WT": flag == 2 ? this.emptyToZero(element.NET_WT) * -1 : this.emptyToZero(element.NET_WT),
        "JOB_PCS": 0,
        "DESIGN_TYPE": form.DESIGN_TYPE?.toUpperCase() == 'METAL' ? this.commonService.nullToString(form.DESIGN_TYPE) : '',
        "TO_STOCK_CODE": this.commonService.nullToString(form.METAL_ToStockCode),
        "FROM_STOCK_CODE": this.commonService.nullToString(element.FROM_STOCK_CODE),
        "FROM_SUB_STOCK_CODE": this.commonService.nullToString(element.FROM_SUB_STOCK_CODE),
        "LOSS_PURE_WT": element.METALSTONE == 'M' ? LOSS_PURE_WT : 0,
        "EXCLUDE_TRANSFER_WT": this.commonService.Null2BitValue(form.EXCLUDE_TRANSFER_WT),
        "IRON_WT": flag == 2 ? this.emptyToZero(element.IRON_WT) * -1 : 0,
        "IRON_SCRAP_WT": flag == 2 ? this.emptyToZero(form.METAL_ToIronScrapWt) * -1 : 0,
        "GAIN_WT": element.METALSTONE == 'M' ? GAIN_WT : 0,
        "GAIN_PURE_WT": element.METALSTONE == 'M' ? GAIN_PURE_WT : 0,
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
      return flag == 2 ? this.emptyToZero(element.GROSS_WT) * -1 : this.emptyToZero(element.GROSS_WT)
    }
    return 0
  }
  setIssueStoneWt(element: any, flag: any) {
    if (element.METALSTONE == 'M') {
      return flag == 2 ? this.emptyToZero(element.STONE_WT) * -1 : this.emptyToZero(element.STONE_WT)
    }
    return 0
  }
  setIssueNetWt(element: any, flag: any) {
    if (element.METALSTONE == 'M') {
      return flag == 2 ? this.emptyToZero(element.NET_WT) * -1 : this.emptyToZero(element.NET_WT)
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
      "VOCNO": this.emptyToZero(form.VOCNO),
      "SRNO": this.emptyToZero(form.SRNO),
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
  showOkDialog(msg: string): Promise<any> {
    return Swal.fire({
      title: '',
      text: msg || "",
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Ok'
    });
  }
  scrapWeightChange(event: any) {
    if (this.viewMode) return
    let form = this.processTransferdetailsForm.value;
    if (this.emptyToZero(form.scrapWeight) > this.emptyToZero(form.lossQty)) {
      let msg = this.commonService.getMsgByID('MSG7921') //Scrap wt greater than Loss weight. Do you want to proceed ?
      this.showConfirmationDialog(msg).then((result) => {
        if (result.isConfirmed) {
          this.checkfromMetalScrapWeight(this.processTransferdetailsForm.value)
        } else {
          this.setFormDecimal('scrapWeight', 0, 'METAL')
          this.CalculateLoss()
        }
      })
    } else {
      this.checkfromMetalScrapWeight(this.processTransferdetailsForm.value)
    }
  }
  checkfromMetalScrapWeight(form: any) {
    if (this.emptyToZero(form.scrapWeight) > this.emptyToZero(form.FRM_METAL_WT)) {
      let msg = this.commonService.getMsgByID('MSG7922')
      this.showConfirmationDialog(msg).then((result) => {
        if (result.isConfirmed) {
          this.setScrapPureWt(this.processTransferdetailsForm.value)
        } else {
          this.setFormDecimal('scrapWeight', 0, 'METAL')
          this.CalculateLoss()
        }
      })
    } else {
      this.setScrapPureWt(this.processTransferdetailsForm.value)
    }
  }
  setScrapPureWt(form: any) {
    let SCRAP_PURE_WT = this.emptyToZero(form.scrapWeight) * this.emptyToZero(form.SCRAP_PURITY);
    this.setFormDecimal('SCRAP_PURE_WT', SCRAP_PURE_WT, 'METAL')
    this.CalculateLoss()
  }
  GrossWeightToChange(event: any) {
    let form = this.processTransferdetailsForm.value;

    let scrapTot = (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight))
    if (this.emptyToZero(form.GrossWeightTo) > this.emptyToZero(form.GrossWeightFrom)) {
      let msg = this.commonService.getMsgByID('MSG1312') // Gross wt. cannot be greater than fromvalue
      this.commonService.toastErrorByMsgId(msg + ' ' + form.GrossWeightFrom)
      this.setFormDecimal('GrossWeightTo', this.FORM_VALIDATER.GrossWeightTo, 'METAL')
      return
    } else if (this.emptyToZero(form.scrapWeight) != 0 && scrapTot > this.emptyToZero(form.GrossWeightFrom)) {
      let msg = this.commonService.getMsgByID('MSG7921') //Scrap wt greater than Loss weight. Do you want to proceed ?
      this.showConfirmationDialog(msg).then((result) => {
        if (!result.isConfirmed) {
          this.setFormDecimal('scrapWeight', 0, 'METAL')
        }
        this.CalculateLoss()
        //  else {
        //   this.CalculateLoss()
        // }
      })
      return
    }
    this.CalculateLoss()
    // this.renderer.selectRootElement('#txtLossQty')?.focus();
  }

  CalculateLoss() {
    let form = this.processTransferdetailsForm.value
    let processData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE?.toUpperCase() == form.FRM_PROCESS_CODE?.toUpperCase())
    let blnLoss = false;
    if (processData.length > 0) blnLoss = this.emptyToZero(processData[0]?.STD_LOSS) != 0 ? true : false;
    if (blnLoss) {
      let lossQty = this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight));
      let toMetalWt = (this.emptyToZero(form.FRM_METAL_WT) - (this.emptyToZero(lossQty) + this.emptyToZero(form.scrapWeight)));
      let actualLoss = this.commonService.lossQtyCalculate(form.FRM_METAL_WT, form.STD_LOSS);
      if (lossQty > actualLoss) {
        lossQty = actualLoss
        // msg - Loss qty cannot be exceed > actualLoss
        let msg = this.commonService.getMsgByID('MSG1397') + actualLoss
        this.commonService.toastErrorByMsgId(msg)
      }
      this.setFormDecimal('lossQty', lossQty, 'METAL')
      this.setFormDecimal('TO_METAL_WT', toMetalWt, 'METAL')
      this.setFormDecimal('GAIN_WT', 0, 'METAL')
      this.setFormDecimal('GAIN_PURE_WT', 0, 'METAL')
    } else {
      let dblStoneWt = 0
      this.metalDetailData.forEach((item: any) => {
        if (item.DIVCODE == 'Z' && item.METALSTONE == 'S') {
          dblStoneWt += this.emptyToZero(item.GROSS_WT) * 5
        } else if (item.DIVCODE != 'Z' && item.METALSTONE == 'S') {
          dblStoneWt += this.emptyToZero(item.GROSS_WT)
        }
      })
      let txtToMetalWt = (this.emptyToZero(form.GrossWeightTo) - (dblStoneWt / 5));
      this.setFormDecimal('TO_METAL_WT', txtToMetalWt, 'METAL')
    }
    form = this.processTransferdetailsForm.value;
    this.FORM_VALIDATER = this.processTransferdetailsForm.value;
    // let Balance_WT = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight) + this.emptyToZero(form.lossQty)));
    // this.setFormDecimal('Balance_WT', Balance_WT, 'METAL')
    if (this.Multi_Metal()) {
      this.Split_Loss_New
    } else {
      this.Split_Loss(this.processTransferdetailsForm.value)
    }
    this.calculateBalanceWt()
    // if (blnLoss) {
    //   this.renderer.selectRootElement('#txtLossQty')?.focus();
    // }
  }
  calculateBalanceWt() {
    let form = this.processTransferdetailsForm.value
    let Balance_WT = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.scrapWeight) + this.emptyToZero(form.lossQty)));
    this.setFormDecimal('Balance_WT', Balance_WT, 'METAL')
  }
  Split_Loss(form: any) {
    if (form.METAL_STOCK_CODE != '') {
      let bFlag = false;
      let k = 0;
      let dblMaster_Metal = 0;
      let dblSub_Metal = 0;
      let intMetalcount = 0;
      let intMetalRow = 0;

      for (let i = 0; i < this.metalDetailData.length; i++) {
        if (this.metalDetailData[i].METALSTONE == "M") {
          if (this.emptyToZero(form.lossQty) == 0) { this.metalDetailData[i].LOSS_QTY = 0; }
          intMetalcount += 1;
          intMetalRow = i;
          if (form.METAL_STOCK_CODE?.toUpperCase().trim() == this.metalDetailData[i].STOCK_CODE?.toUpperCase().trim()) {
            dblMaster_Metal = this.emptyToZero(this.metalDetailData[i].GROSS_WT) + this.emptyToZero(this.metalDetailData[i].LOSS_QTY);
            dblMaster_Metal = this.commonService.decimalQuantityFormat(dblMaster_Metal, 'METAL')
            k = i;
            bFlag = true;
          } else {
            dblSub_Metal = dblSub_Metal + this.emptyToZero(this.metalDetailData[i].GROSS_WT);
          }
        }
      }
      if (this.emptyToZero(form.lossQty) >= this.emptyToZero(dblMaster_Metal) && bFlag) {
        let msg = this.commonService.getMsgByID("MSG1397")//Loss qty cannot be exceed >dblMaster_Metal
        this.commonService.toastErrorByMsgId(msg + " " + dblMaster_Metal);
        this.resetOnLoadWeights('MSG7611') //Master metal stock code not defined
      }
      form = this.processTransferdetailsForm.value;

      if (bFlag) {
        let GROSS_WT = (this.emptyToZero(form.TO_METAL_WT) - dblSub_Metal);
        let NET_WT = this.emptyToZero(this.metalDetailData[k].GROSS_WT) - this.emptyToZero(this.metalDetailData[k].STONE_WT);
        this.metalDetailData[k].GROSS_WT = this.commonService.decimalQuantityFormat(GROSS_WT, 'METAL');
        this.metalDetailData[k].NET_WT = this.commonService.decimalQuantityFormat(NET_WT, 'METAL');
        this.metalDetailData[k].LOSS_QTY = this.commonService.decimalQuantityFormat(form.lossQty, 'METAL');
      } else if (intMetalcount == 1) { // by alsmon on 16-08-2024 for single metal or barcode item
        if (this.commonService.emptyToZero(form.lossQty) >= dblSub_Metal + this.emptyToZero(this.metalDetailData[intMetalRow].LOSS_QTY)) {
          //	msg - Loss qty cannot be exceed >
          let msg = this.commonService.getMsgByID("MSG1397") + " " + (dblSub_Metal + this.emptyToZero(this.metalDetailData[intMetalRow].LOSS_QTY))
          this.commonService.toastErrorByMsgId(msg);
          this.setFormDecimal('TO_METAL_WT', form.FRM_METAL_WT, 'METAL')
          this.setFormDecimal('GrossWeightTo', form.GrossWeightFrom, 'METAL')
          this.setFormDecimal('lossQty', 0, 'METAL')
        } else {
          this.metalDetailData[intMetalRow].GROSS_WT = this.commonService.decimalQuantityFormat(form.FRM_METAL_WT, 'METAL');
          this.metalDetailData[intMetalRow].NET_WT = this.commonService.netWeightCalculate(this.metalDetailData[intMetalRow].GROSS_WT, this.metalDetailData[intMetalRow].STONE_WT);
          this.metalDetailData[intMetalRow].LOSS_QTY = form.lossQty;
        }
      } else {
        this.resetOnLoadWeights('MSG7611') //Master metal stock code not defined
      }
      //set lossQtyper
      let lossQtyper = 0
      form = this.processTransferdetailsForm.value;
      this.FORM_VALIDATER = this.processTransferdetailsForm.value;
      if (this.emptyToZero(form.lossQty) > 0) {
        lossQtyper = ((this.emptyToZero(form.lossQty) / this.emptyToZero(form.FRM_METAL_WT)) * 100);
        this.setFormDecimal('lossQtyper', lossQtyper, 'AMOUNT')
      } else {
        this.setFormDecimal('lossQtyper', 0, 'AMOUNT')
      }

    } else {
      this.resetOnLoadWeights('MSG7611') //Master metal stock code not defined
    }
  }
  Split_Loss_Metal() {
    let form = this.processTransferdetailsForm.value;
    if (form.METALLAB_TYPE != '') {
      let k = 0;
      let dblMaster_Metal = 0;

      for (let i = 0; i < this.metalDetailData_2.length; i++) {
        if (this.metalDetailData_2[i].METALSTONE == "M") {
          if (this.emptyToZero(form.METAL_LossBooked) == 0) { this.metalDetailData_2[i].LOSS_QTY = 0; }
          if (this.emptyToZero(form.METAL_GainGrWt) == 0) { this.metalDetailData_2[i].GAIN_WT = 0; }
          dblMaster_Metal = (this.emptyToZero(this.metalDetailData_2[i].GROSS_WT) + this.emptyToZero(this.metalDetailData[i].LOSS_QTY)) - this.emptyToZero(form.METAL_TO_STONE_WT);
          dblMaster_Metal = this.commonService.decimalQuantityFormat(dblMaster_Metal, 'METAL')
          k = i;
        }
      }
      if (dblMaster_Metal == 0 && this.emptyToZero(form.METAL_LossBooked) != 0) {
        dblMaster_Metal = this.emptyToZero(form.METAL_LossBooked);
      }
      if (this.emptyToZero(form.METAL_LossBooked) > this.emptyToZero(dblMaster_Metal) && this.emptyToZero(form.METAL_LossBooked) != 0) {
        let msg = this.commonService.getMsgByID("MSG1397")
        this.commonService.toastErrorByMsgId(msg)
        this.setFormDecimal('METAL_LossBooked', 0, 'METAL')
      }
      form = this.processTransferdetailsForm.value;

      if (this.metalDetailData.length > 0) {
        this.metalDetailData[k].GROSS_WT = this.commonService.decimalQuantityFormat(form.METAL_ToNetWt, 'METAL');
        this.metalDetailData[k].NET_WT = this.commonService.decimalQuantityFormat(form.METAL_ToNetWt, 'METAL');
        this.metalDetailData[k].LOSS_QTY = this.commonService.decimalQuantityFormat(form.METAL_LossBooked, 'METAL');
        this.metalDetailData[k].GAIN_WT = this.commonService.decimalQuantityFormat(form.METAL_GainGrWt, 'METAL');
        this.metalDetailData[k].GAIN_PURE_WT = this.commonService.decimalQuantityFormat(form.METAL_GainPureWt, 'METAL');
        this.metalDetailData[k].LOSS_PURE_WT = this.commonService.decimalQuantityFormat(form.METAL_LossPureWt, 'METAL');
      }
      let lossQtyper = 0
      form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(form.METAL_LossBooked) > 0) {
        lossQtyper = ((this.emptyToZero(form.METAL_LossBooked) / this.emptyToZero(form.METAL_GrossWeightFrom)) * 100);
        this.setFormDecimal('lossQtyper', lossQtyper, 'AMOUNT')
      } else {
        this.setFormDecimal('lossQtyper', 0, 'AMOUNT')
      }
    } else {
      this.commonService.toastErrorByMsgId('MSG7611')
      this.setFormDecimal('METAL_GrossWeightTo', 0, 'AMOUNT')
      this.setFormDecimal('METAL_LossBooked', 0, 'AMOUNT')
    }
  }
  resetOnLoadWeights(msg: any) {
    let form = this.processTransferdetailsForm.value;
    this.commonService.toastErrorByMsgId(msg);
    this.setFormDecimal('TO_METAL_WT', form.FRM_METAL_WT, 'METAL')
    this.setFormDecimal('GrossWeightTo', form.GrossWeightFrom, 'METAL')
    this.setFormDecimal('lossQty', 0, 'METAL')
  }
  Split_Loss_New() {
    let form = this.processTransferdetailsForm.value;
    try {
      let dblTotalMetal_Wt: number = this.emptyToZero(form.FRM_METAL_WT);
      let dblLoss_Wt: number = this.emptyToZero(form.lossQty);
      let dblScrap_Wt: number = this.emptyToZero(form.scrapWeight);
      let dblToMetal_Wt: number = this.emptyToZero(form.TO_METAL_WT);
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
          dblPer = (this.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT.toString()) / dblTotalMetal_Wt) * 100;
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
        dblTotLoss_Wt += this.emptyToZero(dblLoss);
        dblTotScap_Wt += this.emptyToZero(dblScrap);
        dblTotGross += this.emptyToZero(dblGross);

        this.metalDetailData[i].GROSS_WT = (dblGross)
        this.metalDetailData[i].NET_WT = this.emptyToZero(this.metalDetailData[i].GROSS_WT) - this.emptyToZero(this.metalDetailData[i].STONE_WT)
        this.metalDetailData[i].LOSS_QTY = dblLoss
        this.metalDetailData[i].SCRAP_WT = dblScrap
        this.metalDetailData[i].SCRAP_STOCK_CODE = form.stockCode
        this.metalDetailData[i].SCRAP_SUB_STOCK_CODE = form.MAIN_STOCK_CODE
        this.metalDetailData[i].SCRAP_PURITY = this.emptyToZero(form.SCRAP_PURITY)
        this.metalDetailData[i].SCRAP_PURE_WT = this.emptyToZero(form.SCRAP_PURITY) * dblScrap
        this.metalDetailData[i].SCRAP_PUDIFF = this.emptyToZero(form.SCRAP_PUDIFF) //doubt
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
              dblTotalMetal_Wt += this.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT);
            }
          }
        }
        // third for loop
        for (let i = 0; i < this.metalDetailData.length; i++) {
          if (this.metalDetailData[i].METALSTONE.toUpperCase().trim() == "M") {
            if (this.metalDetailData[i].DIVCODE.trim().toUpperCase() == form.SCRAP_DIVCODE.toUpperCase().trim()) {
              let dblPer = (this.emptyToZero(this.metalDetailData[i].ISSUE_GROSS_WT) / dblTotalMetal_Wt) * 100;
              let dblScrap = 0; let dblGross = 0;

              dblGross = this.commonService.decimalQuantityFormat((dblTotalMetal_Wt * dblPer) / 100, 'METAL');
              if (dblScrap_Wt > 0) dblScrap = this.commonService.decimalQuantityFormat((dblScrap_Wt * dblPer) / 100, 'METAL');
              dblTotScap_Wt += dblScrap;

              this.metalDetailData[i].SCRAP_WT = dblScrap;
              this.metalDetailData[i].SCRAP_STOCK_CODE = form.stockCode;
              this.metalDetailData[i].SCRAP_SUB_STOCK_CODE = form.MAIN_STOCK_CODE;
              this.metalDetailData[i].SCRAP_PURITY = this.emptyToZero(form.SCRAP_PURITY);
              this.metalDetailData[i].SCRAP_PURE_WT = this.emptyToZero(form.SCRAP_PURITY * dblScrap);
              this.metalDetailData[i].SCRAP_PUDIFF = this.emptyToZero(form.SCRAP_PUDIFF);
            }
          }
        }
      }
      if ((dblToMetal_Wt - dblTotGross != 0) || (dblTotLoss_Wt - dblLoss_Wt != 0) || (dblTotScap_Wt - dblScrap_Wt != 0)) {
        //fourth four loop
        for (let i = 0; i < this.metalDetailData.length; i++) {
          if (this.metalDetailData[i].METALSTONE?.trim() == "M") {
            this.metalDetailData[i].GROSS_WT = (this.emptyToZero(this.metalDetailData[i].GROSS_WT) + (dblTotalMetal_Wt - dblTotGross) - (dblTotLoss_Wt - dblLoss_Wt));
            this.metalDetailData[i].NET_WT = this.emptyToZero(this.metalDetailData[i].GROSS_WT) - this.emptyToZero(this.metalDetailData[i].STONE_WT);
            this.metalDetailData[i].LOSS_QTY = (this.emptyToZero(this.metalDetailData[i].LOSS_QTY) + (dblTotLoss_Wt - dblLoss_Wt));
            this.metalDetailData[i].SCRAP_WT = (this.emptyToZero(this.metalDetailData[i].SCRAP_WT) + (dblTotScap_Wt - dblScrap_Wt));
            break;
          }
        }
      }
      // set loss %
      let txtLossPer = 0
      if (this.emptyToZero(form.lossQty) > 0) {
        txtLossPer = ((this.emptyToZero(form.lossQty) / this.emptyToZero(form.FRM_METAL_WT)) * 100);
      } else {
        txtLossPer = 0;
      }
      this.setFormDecimal('lossQtyper', txtLossPer, 'AMOUNT')
    } catch (err: any) {
      console.log('Loss Split Error') //for developers only
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
    return (this.emptyToZero(a) - (this.commonService.decimalQuantityFormat((Number(b) + Number(c)), 'METAL')))
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
    // let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
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
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**use: print Checkbox  change */
  settedCheckbox(event: any) {
    console.log(event.data);
    console.log(this.metalDetailData);
    this.metalDetailData[event.data.SRNO - 1].SETTED_FLAG = !event.data.SETTED_FLAG;
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (event.target.value != '') return
    switch (formControlName) {
      case 'JOB_NUMBER':
        this.overlayjobNoSearch.showOverlayPanel(event);
        break;
      case 'UNQ_JOB_ID':
        this.overlaySubjobNoSearch.showOverlayPanel(event);
        break;
      case 'FRM_PROCESS_CODE':
        this.fromProcessMasterOverlay.showOverlayPanel(event);
        break;
      case 'TO_PROCESS_CODE':
        this.toProcessMasterOverlay.showOverlayPanel(event);
        break;
      case 'FRM_WORKER_CODE':
        this.fromWorkerMasterOverley.showOverlayPanel(event);
        break;
      case 'TO_WORKER_CODE':
        if (this.fromProcessCodeEmpty || this.fromWorkerCodeEmpty) return
        this.toWorkerMasterOverley.showOverlayPanel(event);
        break;
      case 'stockCode':
        if (this.fromProcessCodeEmpty || this.fromWorkerCodeEmpty) return
        this.stockCodeOverlay.showOverlayPanel(event);
        break;
      case 'location':
        if (this.fromProcessCodeEmpty || this.fromWorkerCodeEmpty) return
        this.overleyLocation.showOverlayPanel(event);
        break;
      case 'METAL_ScrapLocCode':
        if (this.fromProcessCodeEmpty || this.fromWorkerCodeEmpty) return
        this.overleyLocation.showOverlayPanel(event);
        break;
      case 'METAL_FRM_PROCESS_CODE':
        this.MetalfromProcessMasterOverlay.showOverlayPanel(event);
        break;
      case 'METAL_TO_PROCESS_CODE':
        this.MetaltoProcessMasterOverlay.showOverlayPanel(event);
        break;
      case 'METAL_FRM_WORKER_CODE':
        this.MetalfromWorkerMasterOverley.showOverlayPanel(event);
        break;
      case 'METAL_TO_WORKER_CODE':
        this.MetaltoWorkerMasterOverley.showOverlayPanel(event);
        break;
      case 'METAL_ScrapStockCode':
        this.METAL_ScrapStockCodeoverlay.showOverlayPanel(event);
        break;
      case 'METAL_ToStockCode':
        this.METAL_ToStockCodeOverley.showOverlayPanel(event);
        break;
      default:
      // Optionally handle the default case if needed
      // break;
    }
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }
  formArrays() {
    if (this.metalDetailData?.length > 0) {
      this.metalDetailData.forEach((item: any, index: any) => {
        item.GROSS_WT = this.emptyToZero(item.GROSS_WT)
        item.PCS = this.emptyToZero(item.PCS)
        item.AMOUNTFC = this.emptyToZero(item.AMOUNTFC)
      })
    }
  }
  close(data?: any) {
    this.formArrays()
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  /** METAL SECTION VALIDATIONS STARTS*/
  MToStockCode_Validating(event: any) {
    try {
      this.metalScrapStockCode.SEARCH_VALUE = event.target.value;
      let code = this.processTransferdetailsForm.value.METAL_ScrapStockCode
      code = this.commonService.nullToString(code)
      this.commonService.showSnackBarMsg('MSG81447');
      let API = `MetalStockMaster/GetMetalStockMasterHeaderAndDetail/${code?.toUpperCase()}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          this.commonService.closeSnackBarMsg()
          let data: any = result.status == 'Success' ? [result.response] : []
          data = data?.filter((item: any) => (this.emptyToZero(item.PURITY) == this.emptyToZero(this.processTransferdetailsForm.value.PURITY)) && item.SUBCODE == false)
          if (data.length == 0) {
            this.METAL_ToStockCodeOverley.showOverlayPanel(event)
            this.processTransferdetailsForm.controls.METAL_ScrapStockCode.setValue('')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG1531')
        })
      this.subscriptions.push(Sub)

    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: SCRAP STOCK CODE CHANGE VALIDATION */
  txtMScrapStockCode_Validating(event?: any) {
    this.metalScrapStockCode.SEARCH_VALUE = event.target.value;
    if (event && this.commonService.nullToString(event.target.value) == "") return
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.commonService.nullToString(form.METAL_ScrapStockCode) == "") {
        // ClearScrapDetails();
        this.CalculateNetAndPureWt();
        this.CalculateMetalBalance();
      }
      this.commonService.showSnackBarMsg('MSG81447');
      let API = `MetalStockMaster/GetMetalStockMasterHeaderAndDetail/${form.METAL_ScrapStockCode?.toUpperCase()}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          this.commonService.closeSnackBarMsg()
          let data: any = result.status == 'Success' ? [result.response] : []
          data = data?.filter((item: any) => (item.EXCLUDE_TRANSFER_WT == true || this.emptyToZero(item.PURITY) == this.emptyToZero(form.PURITY)) && item.SUBCODE == false)
          if (data.length > 0) {
            let txtMScrapPurity = data[0]["PURITY"];
            this.setFormDecimal('METAL_ScrapPurity', txtMScrapPurity, 'PURITY')
            if (this.commonService.Null2BitValue(data[0]["EXCLUDE_TRANSFER_WT"]) == true) {
              this.blnScrapIronItem = true;

              let txtMScrapGrWt = (this.emptyToZero(form.METAL_FromIronWeight) - this.emptyToZero(form.METAL_ToIronWt));
              let txtToIronScrapWt = (this.emptyToZero(form.METAL_FromIronWeight) - this.emptyToZero(form.METAL_ToIronWt));

              let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(form.METAL_ToIronWt) + this.emptyToZero(txtToIronScrapWt)));
              let txtMToNetWt = (this.emptyToZero(form.METAL_GrossWeightTo) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(form.METAL_ToIronWt)));
              let txtMToPureWt = (this.emptyToZero(txtMToNetWt) * form.PURITY);
              let txtBalGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(txtMScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
              let txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
              let txtBalPureWt = (this.emptyToZero(txtBalNetWt) * form.PURITY);
              this.setFormDecimal('METAL_ScrapGrWt', txtMScrapGrWt, 'METAL')
              this.setFormDecimal('METAL_ToIronScrapWt', txtToIronScrapWt, 'METAL')
              this.setFormDecimal('METAL_ToNetWt', txtMToNetWt, 'METAL')
              this.setFormDecimal('METAL_ToPureWt', txtMToPureWt, 'METAL')
              this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'METAL')
              this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'METAL')
              this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'METAL')
              this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'METAL')
              this.Split_Loss_Metal();
              this.processTransferdetailsForm.controls.METAL_ScrapGrWt.disable()
            }
            else {
              this.processTransferdetailsForm.controls.METAL_ScrapGrWt.enable()
            }
          } else {
            this.METAL_ScrapStockCodeoverlay.showOverlayPanel(event)
            this.processTransferdetailsForm.controls.METAL_ScrapStockCode.setValue('')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG1531')
        })
      this.subscriptions.push(Sub)

    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: METAL TAB TO PCS CHANGE VALIDATION */
  MToPCS_Validating() {
    let form = this.processTransferdetailsForm.value;
    let metalScrapTotal = this.emptyToZero(form.METAL_ToPCS) + this.emptyToZero(form.METAL_ScrapPCS)
    if (metalScrapTotal > this.emptyToZero(form.METAL_FromPCS)) {
      this.setFormNullToString('METAL_ToPCS', this.FORM_VALIDATER.METAL_ToPCS)
      this.commonService.toastErrorByMsgId("MSG7863");
      return;
    }
    this.setFormNullToString('METAL_ToPCS', form.METAL_FromPCS)
    let txtBalPCS = this.commonService.balancePcsCalculate(form.METAL_FromPCS, form.METAL_ToPCS, form.METAL_ScrapPCS);
    this.setFormNullToString('METAL_BalPCS', txtBalPCS)
  }
  /**USE: METAL TAB SCRAP PCS CHANGE VALIDATION */
  MScrapPCS_Validating() {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(form.METAL_ToPCS) > this.emptyToZero(form.METAL_ScrapPCS)) {
        let txtMToPCS = (this.emptyToZero(form.METAL_FromPCS) - this.emptyToZero(form.METAL_ScrapPCS));
        this.setFormNullToString('METAL_ToPCS', txtMToPCS)
      }

      if ((this.emptyToZero(form.METAL_ToPCS) + this.emptyToZero(form.METAL_ScrapPCS)) > this.emptyToZero(form.METAL_FromPCS)) {
        form.METAL_ScrapPCS = this.FORM_VALIDATER.METAL_ScrapPCS
        this.setFormNullToString('METAL_ScrapPCS', this.FORM_VALIDATER.METAL_ScrapPCS)
        this.commonService.toastErrorByMsgId("MSG7863");
        return;
      }
      this.setFormNullToString('METAL_ScrapPCS', form.METAL_ScrapPCS)
      let txtBalPCS = this.commonService.balancePcsCalculate(form.METAL_FromPCS, form.METAL_ToPCS, form.METAL_ScrapPCS);
      this.setFormNullToString('METAL_BalPCS', txtBalPCS)
    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
    }
  }
  /**USE: METAL TAB TO GROSS WT CHANGE VALIDATION */
  MToGrossWt_Validating() {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_GrossWeightTo) == this.emptyToZero(form.METAL_GrossWeightTo)) {
        return
      }
      if ((this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)) > this.emptyToZero(form.METAL_GrossWeightFrom)) {
        if (!form.blnAllowGain) {
          this.setFormDecimal('METAL_GrossWeightTo', this.FORM_VALIDATER.METAL_GrossWeightTo, 'METAL')
          this.commonService.toastErrorByMsgId("MSG1910");
          return;
        }
        this.commonService.toastErrorByMsgId("MSG3787");
        this.setFormDecimal('METAL_GrossWeightTo', this.FORM_VALIDATER.METAL_GrossWeightTo, 'METAL')
        //TODO
        // if (MessageBox.Show(objCommonFunctions.GetMessage("MSG3787") + " " + objCommonFunctions.GetMessage("MSG3658"), objCommonFunctions.GetMessage("MSG2100"), MessageBoxButtons.YesNo, MessageBoxIcon.Question, MessageBoxDefaultButton.Button2) == DialogResult.No) {
        //   txtMToGrossWt.Text = txtMToGrossWt.Tag.ToString();
        //   return;
        // }
      }
      let txtToIronWt = ((this.emptyToZero(form.METAL_FromIronWeight)) / (this.emptyToZero(form.METAL_FromIronWeight) + this.emptyToZero(form.METAL_FromNetWeight)) * ((this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_LossBooked)) - this.emptyToZero(form.METAL_TO_STONE_WT)));
      let txtBalGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
      let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(txtToIronWt) + this.emptyToZero(form.METAL_ToIronScrapWt)));
      let txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(form.METAL_BalIronWt)));
      let txtBalPureWt = ((this.emptyToZero(txtBalNetWt) * form.PURITY));
      this.setFormDecimal('METAL_ToIronWt', txtToIronWt, 'METAL')
      this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'METAL')
      this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'METAL')
      this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'METAL')
      this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'METAL')
      this.FORM_VALIDATER.METAL_GrossWeightTo = form.METAL_GrossWeightTo
      this.CalculateNetAndPureWt()
      this.CalculateMetalBalance()
      this.Split_Loss_Metal()
    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: scrap gross wt change event */
  txtMScrapGrWt_Validating(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ScrapGrWt) == this.emptyToZero(form.METAL_ScrapGrWt)) {
        return
      }
      let txtMToGrossWt = 0
      if ((this.emptyToZero(form.METAL_GrossWeightTo)) > (this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked))) {
        txtMToGrossWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
        this.setFormDecimal('METAL_GrossWeightTo', txtMToGrossWt, 'METAL')
      }
      let strTot = (this.emptyToZero(txtMToGrossWt) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked));

      if (this.emptyToZero(strTot) > this.emptyToZero(form.METAL_GrossWeightFrom)) {
        this.setFormDecimal('METAL_ScrapGrWt', this.FORM_VALIDATER.METAL_ScrapGrWt, 'METAL')
        this.commonService.toastErrorByMsgId("MSG1910")
        return;
      }
      form = this.processTransferdetailsForm.value;

      let txtToIronScrapWt = ((this.emptyToZero(form.METAL_FromIronWeight)) / (this.emptyToZero(form.METAL_FromIronWeight) + this.emptyToZero(form.METAL_FromNetWeight)) * (this.emptyToZero(form.METAL_ScrapGrWt) - this.emptyToZero(form.METAL_ScrapStoneWt)));
      let txtToIronWt = ((this.emptyToZero(form.METAL_FromIronWeight)) / (this.emptyToZero(form.METAL_FromIronWeight) + this.emptyToZero(form.METAL_FromNetWeight)) * ((this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_LossBooked)) - this.emptyToZero(form.METAL_TO_STONE_WT)));

      let txtBalGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(txtMToGrossWt) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
      let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(txtToIronWt) + this.emptyToZero(txtToIronScrapWt)));
      let txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
      let txtBalPureWt = ((this.emptyToZero(txtBalNetWt) * this.emptyToZero(form.PURITY)));
      this.FORM_VALIDATER.METAL_ScrapGrWt = form.METAL_ScrapGrWt
      this.CalculateNetAndPureWt();
      this.CalculateMetalBalance();
      this.Split_Loss_Metal();
    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: To stone wt change event calculations */
  MToStoneWt_Validating(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_TO_STONE_WT) == this.emptyToZero(form.METAL_TO_STONE_WT)) {
        return;
      }

      if (this.emptyToZero(form.METAL_TO_STONE_WT) > this.emptyToZero(form.METAL_FRM_STONE_WT)) {
        this.setFormDecimal('METAL_TO_STONE_WT', this.FORM_VALIDATER.METAL_TO_STONE_WT, 'STONE')
        this.commonService.toastErrorByMsgId("MSG7855")
        return;
      }
      let txtMToGrossWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked) + (this.emptyToZero(form.METAL_FRM_STONE_WT) - this.emptyToZero(form.METAL_TO_STONE_WT))));
      this.setFormDecimal('METAL_GrossWeightTo', txtMToGrossWt, 'STONE')
      this.FORM_VALIDATER.METAL_TO_STONE_WT = form.METAL_TO_STONE_WT
      this.CalculateNetAndPureWt();
      this.CalculateMetalBalance();
      this.Split_Loss_Metal();
    } catch (err) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: scrap stone wt change event calculations */
  txtMScrapStoneWt_Validating(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ScrapStoneWt) == this.emptyToZero(form.METAL_ScrapStoneWt)) {
        return;
      }

      let txtMToStoneWt = this.emptyToZero(form.METAL_TO_STONE_WT)
      if ((this.emptyToZero(form.METAL_TO_STONE_WT)) > (this.emptyToZero(form.METAL_ScrapStoneWt))) {
        txtMToStoneWt = (this.emptyToZero(form.METAL_FRM_STONE_WT) - (this.emptyToZero(form.METAL_ScrapStoneWt)));
      }

      if ((this.emptyToZero(txtMToStoneWt) + this.emptyToZero(form.METAL_ScrapStoneWt)) > this.emptyToZero(form.METAL_FRM_STONE_WT)) {
        this.setFormDecimal('METAL_ScrapStoneWt', this.FORM_VALIDATER.METAL_ScrapStoneWt, 'STONE')
        this.commonService.toastErrorByMsgId("MSG1910");
        return;
      }
      let txtBalStoneWt = (this.emptyToZero(form.METAL_FRM_STONE_WT) - (this.emptyToZero(txtMToStoneWt) + this.emptyToZero(form.METAL_ScrapStoneWt)));
      this.setFormDecimal('METAL_TO_STONE_WT', txtMToStoneWt, 'STONE')
      this.setFormDecimal('METAL_BalStoneWt', txtBalStoneWt, 'STONE')
      this.FORM_VALIDATER.METAL_ScrapStoneWt = form.METAL_ScrapStoneWt
      this.CalculateNetAndPureWt();
      this.Split_Loss_Metal();
    } catch (Exception) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: To iron wt change event calculations */
  txtToIronWt_Validating(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ToIronWt) == this.emptyToZero(form.METAL_ToIronWt)) {
        return;
      }
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ToIronWt) == this.emptyToZero(form.METAL_ToIronWt) && this.emptyToZero(form.METAL_ToIronWt) != 0) {
        return;
      }

      let txtToIronWt = this.emptyToZero(form.METAL_ToIronWt)
      if ((this.emptyToZero(form.METAL_ToIronWt) + this.emptyToZero(form.METAL_ToIronScrapWt)) > this.emptyToZero(form.METAL_FromIronWeight)) {//Iron weight cannot be greater than
        let msg = this.commonService.getMsgByID("MSG81351") + " " + this.emptyToZero(form.METAL_FromIronWeight)
        this.commonService.toastErrorByMsgId(msg)
        this.setFormDecimal('METAL_ToIronWt', this.FORM_VALIDATER.METAL_ToIronWt, 'STONE')
        return;
      }
      let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - this.emptyToZero(txtToIronWt) - this.emptyToZero(form.METAL_ToIronScrapWt));
      let txtMToNetWt = 0
      let txtMToPureWt = 0
      let txtBalGrWt = 0
      let txtBalNetWt = 0
      let txtBalPureWt = 0
      if (this.blnScrapIronItem == false) {
        txtMToNetWt = (this.emptyToZero(form.GrossWeightTo) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(txtToIronWt)));
        txtMToPureWt = this.commonService.pureWeightCalculate(txtMToNetWt, form.PURITY);

        txtBalGrWt = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.METAL_LossBooked) + this.emptyToZero(form.lossQty)));
        txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
        txtBalPureWt = this.commonService.pureWeightCalculate(txtBalNetWt, form.PURITY);
      }
      else {
        txtMToNetWt = (this.emptyToZero(form.GrossWeightTo) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(txtToIronWt)));
        txtMToPureWt = this.commonService.pureWeightCalculate(txtMToNetWt, form.PURITY);
        txtBalGrWt = (this.emptyToZero(form.GrossWeightFrom) - (this.emptyToZero(form.GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
        txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
        txtBalPureWt = this.commonService.pureWeightCalculate(txtBalNetWt, form.PURITY);
      }
      this.FORM_VALIDATER.METAL_ToIronWt = form.METAL_ToIronWt
      this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'STONE')
      this.setFormDecimal('METAL_ToNetWt', txtMToNetWt, 'STONE')
      this.setFormDecimal('METAL_ToPureWt', txtMToPureWt, 'STONE')
      this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'STONE')
      this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'STONE')
      this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'STONE')
      this.Split_Loss_Metal();
    } catch (err) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: Scrap iron wt change event calculations */
  txtToIronScrapWt_Validating(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ToIronScrapWt) == this.emptyToZero(form.METAL_ToIronScrapWt)) {
        return;
      }
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_ToIronScrapWt) == this.emptyToZero(form.METAL_ToIronScrapWt) && this.emptyToZero(form.METAL_ToIronScrapWt) != 0) {
        return;
      }

      if ((this.emptyToZero(form.METAL_ToIronScrapWt) + this.emptyToZero(form.METAL_ToIronWt)) > this.emptyToZero(form.METAL_FromIronWeight)) {//Iron weight cannot be greater than
        let msg = this.commonService.getMsgByID("MSG81351") + " " + this.emptyToZero(form.METAL_FromIronWeight)
        this.commonService.toastErrorByMsgId(msg)
        this.setFormDecimal('METAL_ToIronScrapWt', this.FORM_VALIDATER.METAL_ToIronScrapWt, 'STONE')
        return;
      }
      let txtMScrapGrWt = form.METAL_ScrapGrWt
      if (this.blnScrapIronItem == true) {
        txtMScrapGrWt = form.METAL_ToIronScrapWt;
      }
      let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - this.emptyToZero(form.METAL_ToIronWt) - this.emptyToZero(form.METAL_ToIronScrapWt));
      let txtMScrapNetWt = (this.emptyToZero(txtMScrapGrWt) - this.emptyToZero(form.METAL_ScrapStoneWt) - this.emptyToZero(form.METAL_ToIronScrapWt));
      let txtMScrapPureWt = ((this.emptyToZero(txtMScrapNetWt) * form.PURITY));
      let txtBalGrWt = 0
      let txtBalNetWt = 0
      let txtBalPureWt = 0
      if (this.blnScrapIronItem == false) {
        txtBalGrWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(txtMScrapGrWt) + this.emptyToZero(form.METAL_LossBooked) + this.emptyToZero(form.METAL_GrossWeightTo)));
        txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
        txtBalPureWt = ((this.emptyToZero(txtBalNetWt) * form.PURITY));
      }
      else {
        txtBalGrWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(txtMScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
        txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
        txtBalPureWt = ((this.emptyToZero(txtBalNetWt) * form.PURITY));
      }
      this.FORM_VALIDATER.METAL_ToIronScrapWt = form.METAL_ToIronScrapWt
      this.setFormDecimal('METAL_ScrapGrWt', txtMScrapGrWt, 'STONE')
      this.setFormDecimal('METAL_ScrapNetWt', txtMScrapNetWt, 'STONE')
      this.setFormDecimal('METAL_ScrapPureWt', txtMScrapPureWt, 'STONE')
      this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'STONE')
      this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'STONE')
      this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'STONE')
      this.Split_Loss_Metal();
    } catch (err) {
      this.commonService.toastInfoByMsgId("MSG2100");
      return;
    }
  }
  /**USE: to calculate all net and pure wt fields */
  private CalculateNetAndPureWt(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      let txtToIronWt = 0
      let txtBalIronWt = 0
      if (this.emptyToZero(form.METAL_FromIronWeight) != 0 && this.emptyToZero(form.METAL_ToIronWt) == 0) {
        txtToIronWt = this.emptyToZero(form.METAL_FromIronWeight) / (this.emptyToZero(form.METAL_FromIronWeight) + this.emptyToZero(form.METAL_FromNetWeight)) * this.emptyToZero(form.METAL_GrossWeightTo);
        txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(form.METAL_ToIronWt) + this.emptyToZero(form.METAL_ToIronScrapWt)));
      }

      let txtMToNetWt = (this.emptyToZero(form.METAL_GrossWeightTo) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(txtToIronWt)));
      let txtMToPureWt = (this.emptyToZero(txtMToNetWt) * this.emptyToZero(form.PURITY));

      let txtMScrapNetWt = (this.emptyToZero(form.METAL_ScrapGrWt) - (this.emptyToZero(form.METAL_ScrapStoneWt) + this.emptyToZero(form.METAL_ToIronScrapWt)));
      let txtMScrapPureWt = (this.emptyToZero(txtMScrapNetWt) * this.emptyToZero(form.PURITY));

      let txtBalNetWt = (this.emptyToZero(form.METAL_FromNetWeight) - (this.emptyToZero(txtMToNetWt) + this.emptyToZero(txtMScrapNetWt) + this.emptyToZero(form.METAL_LossBooked)));
      let txtBalPureWt = (this.emptyToZero(form.METAL_FromPureWt) - (this.emptyToZero(txtMToPureWt) + this.emptyToZero(txtMScrapPureWt) + this.emptyToZero(form.METAL_LossPureWt)));

      let txtLossPureWt = form.METAL_LossPureWt
      if (this.emptyToZero(txtBalNetWt) == 0 && this.commonService.nullToString(txtBalPureWt) == '0.001') {
        if (this.emptyToZero(form.METAL_LossPureWt) != 0) {
          txtLossPureWt = (this.emptyToZero(form.METAL_LossPureWt) + txtBalPureWt);
          txtBalPureWt = (this.emptyToZero(form.METAL_FromPureWt) - (this.emptyToZero(txtMToPureWt) + this.emptyToZero(txtMScrapPureWt) + this.emptyToZero(txtLossPureWt)));

        } else if (this.emptyToZero(txtMScrapPureWt) != 0) {
          txtMScrapPureWt = (this.emptyToZero(txtMScrapPureWt) + this.emptyToZero(txtBalPureWt));
          txtBalPureWt = (this.emptyToZero(form.METAL_FromPureWt) - (this.emptyToZero(txtMToPureWt) + this.emptyToZero(txtMScrapPureWt) + this.emptyToZero(txtLossPureWt)));
        }
      }
      this.setFormDecimal('METAL_ToIronWt', txtToIronWt, 'METAL')
      this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'METAL')
      this.setFormDecimal('METAL_ToNetWt', txtMToNetWt, 'METAL')
      this.setFormDecimal('METAL_ToPureWt', txtMToPureWt, 'METAL')
      this.setFormDecimal('METAL_ScrapNetWt', txtMScrapNetWt, 'METAL')
      this.setFormDecimal('METAL_ScrapPureWt', txtMScrapPureWt, 'METAL')
      this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'METAL')
      this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'METAL')
      this.setFormDecimal('METAL_LossPureWt', txtLossPureWt, 'METAL')
    } catch (err) {
      this.commonService.showSnackBarMsg("MSG2100");
    }
  }

  private CalculateMetalBalance(): void {
    try {
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(form.METAL_GrossWeightFrom) - ((this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt))) < 0) {
        let txtGainGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt)));
        let txtGainPureWt = (this.emptyToZero(form.METAL_FromPureWt) - (this.emptyToZero(form.METAL_ToPureWt) + this.emptyToZero(form.METAL_ScrapPureWt)));
        txtGainGrWt = (this.emptyToZero(txtGainGrWt) * -1);
        txtGainPureWt = (this.emptyToZero(txtGainPureWt) * -1);
        this.setFormDecimal('METAL_GainGrWt', txtGainGrWt, 'METAL')
        this.setFormDecimal('METAL_GainPureWt', txtGainPureWt, 'METAL')
        this.setFormDecimal('METAL_LossBooked', 0, 'METAL')
        this.setFormDecimal('METAL_LossPureWt', 0, 'METAL')
        this.setFormDecimal('METAL_BalPCS', 0, 'METAL')
        this.setFormDecimal('METAL_BalGrWt', 0, 'METAL')
        this.setFormDecimal('METAL_BalStoneWt', 0, 'STONE')
        this.setFormDecimal('METAL_BalNetWt', 0, 'METAL')
        this.setFormDecimal('METAL_BalPureWt', 0, 'METAL')
      } else {
        let txtBalPCS = (this.emptyToZero(form.METAL_FromPCS) - (this.emptyToZero(form.METAL_ToPCS) + this.emptyToZero(form.METAL_ScrapPCS)));
        let txtBalGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_GrossWeightTo) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(form.METAL_LossBooked)));
        let txtBalStoneWt = (this.emptyToZero(form.METAL_FRM_STONE_WT) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(form.txtMScrapStoneWt)));
        let txtBalNetWt = (this.emptyToZero(form.METAL_FromNetWeight) - (this.emptyToZero(form.METAL_ToNetWt) + this.emptyToZero(form.METAL_ScrapNetWt) + this.emptyToZero(form.METAL_LossBooked)));
        // let txtBalPureWt = (this.emptyToZero(form.METAL_FromPureWt) - (this.emptyToZero(form.METAL_ToPureWt) + this.emptyToZero(form.METAL_ScrapPureWt) + this.emptyToZero(form.METAL_LossPureWt)));
        let txtBalPureWt = this.commonService.pureWeightCalculate(txtBalGrWt, form.PURITY)
        let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(form.METAL_ToIronWt) + this.emptyToZero(form.METAL_ToIronScrapWt)));
        this.setFormDecimal('METAL_BalPCS', txtBalPCS, 'METAL')
        this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'METAL')
        this.setFormDecimal('METAL_BalStoneWt', txtBalStoneWt, 'STONE')
        this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'METAL')
        this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'METAL')
        this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'METAL')
        this.setFormDecimal('METAL_GainGrWt', 0, 'METAL')
        this.setFormDecimal('METAL_GainPureWt', 0, 'METAL')
      }
    } catch (err) {
      this.commonService.toastErrorByMsgId("MSG2100");
    }
  }
  txtLossBooked_Validating() {
    try {
      let nMax_Loss, nMin_Loss = 0;
      let form = this.processTransferdetailsForm.value;
      if (this.emptyToZero(this.FORM_VALIDATER.METAL_LossBooked) == this.emptyToZero(form.METAL_LossBooked)) {
        return;
      }

      let txtLossBooked = form.METAL_LossBooked
      if (this.emptyToZero(txtLossBooked) > this.emptyToZero(form.METAL_FromNetWeight)) {
        let msg = this.commonService.getMsgByID("MSG1397") + " " + form.METAL_FromNetWeight;
        this.commonService.toastErrorByMsgId(msg)
        this.setFormDecimal('METAL_LossBooked', this.FORM_VALIDATER.METAL_LossBooked, 'METAL')
        return;
      }

      if (this.emptyToZero(txtLossBooked) > 0) {
        let processData = this.sequenceDetails.filter((item: any) => item.seq_code?.toUpperCase() == form.SEQ_CODE?.toUpperCase() && item.PROCESS_CODE?.toUpperCase() == form.METAL_FRM_PROCESS_CODE?.toUpperCase())
        if (processData?.length > 0) {
          if (this.emptyToZero(processData[0]["MAX_LOSS"]) > 0) {
            nMax_Loss = this.commonService.lossQtyCalculate(form.METAL_FromNetWeight, processData[0]["MAX_LOSS"])
            if (this.emptyToZero(txtLossBooked) > nMax_Loss) {
              this.commonService.getMsgByID("MSG1397") + nMax_Loss;
              this.setFormDecimal('METAL_LossBooked', nMax_Loss, 'METAL')
              return;
            }
          }
          if (this.emptyToZero(processData[0]["MIN_LOSS"]) > 0) {
            nMin_Loss = this.commonService.lossQtyCalculate(form.METAL_FromNetWeight, processData[0]["MIN_LOSS"]);
            if (this.emptyToZero(txtLossBooked) < nMin_Loss) {
              this.commonService.getMsgByID("MSG1397") + nMin_Loss;
              this.setFormDecimal('METAL_LossBooked', nMin_Loss, 'METAL')
              return;
            }
          }
        }
      }
      form = this.processTransferdetailsForm.value;
      let txtMToGrossWt = this.emptyToZero(form.METAL_GrossWeightTo);
      if ((this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(txtLossBooked) + this.emptyToZero(txtMToGrossWt) + this.emptyToZero(form.METAL_ScrapGrWt))) < 0 && this.emptyToZero(txtMToGrossWt) > 0) {
        txtMToGrossWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(txtLossBooked)));
      } else if ((this.emptyToZero(txtLossBooked) + this.emptyToZero(txtMToGrossWt) + this.emptyToZero(form.METAL_ScrapGrWt)) > 0 && this.emptyToZero(txtMToGrossWt) > 0) {
        txtMToGrossWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(txtLossBooked)));
      }
      let txtLossPureWt = ((this.emptyToZero(txtLossBooked) * form.PURITY));
      let txtToIronWt = ((this.emptyToZero(form.METAL_FromIronWeight)) / (this.emptyToZero(form.METAL_FromIronWeight) + this.emptyToZero(form.METAL_FromNetWeight)) * ((this.emptyToZero(txtMToGrossWt) + this.emptyToZero(txtLossBooked)) - this.emptyToZero(form.METAL_TO_STONE_WT)));

      let txtMToNetWt = (this.emptyToZero(txtMToGrossWt) - (this.emptyToZero(form.METAL_TO_STONE_WT) + this.emptyToZero(txtToIronWt)));
      let txtMToPureWt = this.commonService.pureWeightCalculate(txtMToNetWt, form.PURITY);

      let txtMScrapNetWt = (this.emptyToZero(form.METAL_ScrapGrWt) - this.emptyToZero(form.METAL_ScrapStoneWt));
      let txtMScrapPureWt = this.commonService.pureWeightCalculate(txtMScrapNetWt, form.PURITY);

      let txtBalGrWt = (this.emptyToZero(form.METAL_GrossWeightFrom) - (this.emptyToZero(txtMToGrossWt) + this.emptyToZero(form.METAL_ScrapGrWt) + this.emptyToZero(txtLossBooked)));
      let txtBalIronWt = (this.emptyToZero(form.METAL_FromIronWeight) - (this.emptyToZero(txtToIronWt) + this.emptyToZero(form.METAL_ToIronScrapWt)));
      let txtBalNetWt = (this.emptyToZero(txtBalGrWt) - (this.emptyToZero(form.METAL_BalStoneWt) + this.emptyToZero(txtBalIronWt)));
      let txtBalPureWt = this.commonService.pureWeightCalculate(txtBalNetWt, form.PURITY);
      this.setFormDecimal('METAL_LossBooked', txtLossBooked, 'METAL')
      this.setFormDecimal('METAL_GrossWeightTo', txtMToGrossWt, 'METAL')
      this.setFormDecimal('METAL_LossPureWt', txtLossPureWt, 'METAL')
      this.setFormDecimal('METAL_ToIronWt', txtToIronWt, 'METAL')
      this.setFormDecimal('METAL_ToNetWt', txtMToNetWt, 'METAL')
      this.setFormDecimal('METAL_ToPureWt', txtMToPureWt, 'METAL')
      this.setFormDecimal('METAL_ScrapNetWt', txtMScrapNetWt, 'METAL')
      this.setFormDecimal('METAL_ScrapPureWt', txtMScrapPureWt, 'METAL')
      this.setFormDecimal('METAL_BalGrWt', txtBalGrWt, 'METAL')
      this.setFormDecimal('METAL_BalNetWt', txtBalNetWt, 'METAL')
      this.setFormDecimal('METAL_BalPureWt', txtBalPureWt, 'METAL')
      this.setFormDecimal('METAL_BalIronWt', txtBalIronWt, 'METAL')

      this.CalculateNetAndPureWt();
      this.CalculateMetalBalance();
      this.Split_Loss_Metal();
    } catch (Exception) {
      this.commonService.toastErrorByMsgId("MSG2100");
      return;
    }
  }
  emptyToZero(val: any) {
    return this.commonService.emptyToZero(val)
  }
}