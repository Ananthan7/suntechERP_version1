import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessTransferNewDetailComponent } from './process-transfer-new-detail/process-transfer-new-detail.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-process-transfer-new',
  templateUrl: './process-transfer-new.component.html',
  styleUrls: ['./process-transfer-new.component.scss']
})
export class ProcessTransferNewComponent implements OnInit {
  @ViewChild('overlaysalesman') public overlaysalesman!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  userName = this.commonService.userName;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  branchCode?: String;
  yearMonth?: String;
  tableRowCount: number = 0;
  PTFDetailsToSave: any[] = [];
  viewMode: boolean = false;
  metalGridDataToSave: any[] = [];
  labourChargeDetailsToSave: any[] = [];
  currentDate: any = this.commonService.currentDate;
  sequenceDetails: any[] = []
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  selectRowIndex: any;

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
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**Procces */
  processTransferFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],
    vocno: ['', [Validators.required]],
    salesman: [''],
    SalesmanName: [''],
    currency: [''],
    currencyrate: [''],
    Narration: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService
  ) {
  }


  ngOnInit(): void {
    this.setCompanyCurrency()
    this.setInitialValues() //load all initial values
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.processTransferFrom.controls.vocdate.setValue(this.currentDate)
    this.processTransferFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    //this.commonService.getqueryParamVocType()
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.processTransferFrom.controls.vocdate.setValue(new Date(date))
    }
  }
  openProcessTransferDetails(data?: any) {
    if (data) {
      data[0].HEADERDETAILS = this.processTransferFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.processTransferFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(ProcessTransferNewDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;
    modalRef.result.then((result) => {
      if (result) {
        this.setValuesToHeaderGrid(result) //USE: set Values To Detail table


        // this.setLabourChargeDetails()
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
  }
  /**USE: on clicking row Opens new detail adding screen */
  onRowDblClickHandler(event: any) {
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    let allDataSelected = [detailRow[0].DATA]
    this.openProcessTransferDetails(allDataSelected)
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  setValuesToHeaderGrid(detailDataToParent: any) {
    let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
    if (PROCESS_FORMDETAILS.SRNO) {
      this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
    } else {
      this.tableRowCount += 1
      PROCESS_FORMDETAILS.SRNO = this.tableRowCount
    }

    this.tableData.push(PROCESS_FORMDETAILS)

    if (detailDataToParent) {
      this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
    }
    this.getSequenceDetailData(PROCESS_FORMDETAILS);
    this.setDataFromDetailScreen();
  }
  /*USE: Function to swap object in array1 with object from array2 at the specified index */
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }
  salesmanSelected(event: any) {
    this.processTransferFrom.controls.salesman.setValue(event.SALESPERSON_CODE)
    this.processTransferFrom.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.processTransferFrom.controls.currency.setValue((event.target.value).toUpperCase())
    } else {
      this.processTransferFrom.controls.currency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.processTransferFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.processTransferFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.processTransferFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.processTransferFrom.controls.currency.setValue('')
      this.processTransferFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  removedata() {
    this.tableData.pop();
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  setLabourChargeDetails() {
    let detailScreenData = this.detailData[0].DATA
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS

    this.labourChargeDetailsToSave.push(
      {
        "REFMID": 0,
        "BRANCH_CODE": this.commonService.branchCode,
        "YEARMONTH": this.commonService.yearSelected,
        "VOCTYPE": this.processTransferFrom.value.voctype,
        "VOCNO": 0,
        "SRNO": 0,
        "JOB_NUMBER": this.commonService.nullToString(detailScreenData.jobno),
        "STOCK_CODE": this.commonService.nullToString(detailScreenData.stockCode),
        "UNQ_JOB_ID": this.commonService.nullToString(detailScreenData.subjobno),
        "METALSTONE": this.commonService.nullToString(detailScreenData.METALSTONE),
        "DIVCODE": this.commonService.nullToString(detailScreenData.DIVCODE),
        "PCS": 0,
        "GROSS_WT": 0,
        "LABOUR_CODE": "",
        "LAB_RATE": 0,
        "LAB_ACCODE": "",
        "LAB_AMTFC": 0,
        "UNITCODE": ""
      }
    )
  }
  /**USE: set details from detail screen */
  setDataFromDetailScreen() {
    let detailScreenData = this.detailData[0].DATA
    let PROCESS_FORMDETAILS = detailScreenData.PROCESS_FORMDETAILS

    let METAL_DETAIL_GRID = detailScreenData.METAL_DETAIL_GRID
    let JOB_VALIDATE_DATA = detailScreenData.JOB_VALIDATE_DATA
    console.log(METAL_DETAIL_GRID, 'METAL_DETAIL_GRID');
    let scrapPureWt = this.commonService.emptyToZero(Number(detailScreenData.scrapQuantity) * Number(detailScreenData.SCRAP_PURITY))
    let seqData = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == detailScreenData.processFrom);

    METAL_DETAIL_GRID.forEach((element: any) => {
      this.metalGridDataToSave.push({
        "VOCNO": 0,
        "VOCTYPE": this.processTransferFrom.value.voctype,
        "VOCDATE": this.commonService.formatDateTime(this.processTransferFrom.value.vocdate),
        "JOB_NUMBER": this.commonService.nullToString(PROCESS_FORMDETAILS.jobno),
        "JOB_SO_NUMBER": this.commonService.emptyToZero(PROCESS_FORMDETAILS.JOB_SO_NUMBER),
        "UNQ_JOB_ID": this.commonService.nullToString(PROCESS_FORMDETAILS.subjobno),
        "JOB_DESCRIPTION": this.commonService.nullToString(PROCESS_FORMDETAILS.subJobDescription),
        "BRANCH_CODE": this.commonService.branchCode,
        "DESIGN_CODE": this.commonService.nullToString(PROCESS_FORMDETAILS.DESIGN_CODE),
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
        "PROCESS_CODE": this.commonService.nullToString(PROCESS_FORMDETAILS.processTo),
        "WORKER_CODE": this.commonService.nullToString(PROCESS_FORMDETAILS.workerTo),
        "UNQ_DESIGN_ID": this.commonService.nullToString(PROCESS_FORMDETAILS.UNQ_DESIGN_ID),
        "REFMID": 0,
        "AMOUNTLC": this.commonService.emptyToZero(element.AMOUNTLC),
        "AMOUNTFC": this.commonService.emptyToZero(element.AMOUNTFC),
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "CURRENCY_CODE": this.commonService.nullToString(element.CURRENCY_CODE),
        "CURRENCY_RATE": this.commonService.getCurrRate(element.CURRENCY_CODE),
        "YEARMONTH": this.commonService.yearSelected,
        "LOSS_QTY": this.commonService.emptyToZero(PROCESS_FORMDETAILS.stdLoss),
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
        "MAIN_WORKER": this.commonService.nullToString(PROCESS_FORMDETAILS.workerFrom),
        "FRM_WORKER": this.commonService.nullToString(PROCESS_FORMDETAILS.workerFrom),
        "FRM_PROCESS": this.commonService.nullToString(PROCESS_FORMDETAILS.processFrom),
        "CRACCODE": "",
        "LAB_ACCODE": this.commonService.nullToString(element.lab_accode),
        "LAB_AMTFC": this.commonService.emptyToZero(element.LAB_AMT),
        "TO_PROCESS": this.commonService.nullToString(PROCESS_FORMDETAILS.processTo),
        "TO_WORKER": this.commonService.nullToString(PROCESS_FORMDETAILS.workerTo),
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
        "SCRAP_STOCK_CODE": this.checkScrapStockCode(detailScreenData.stockCode, element.STOCK_CODE, element.METALSTONE),
        "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(detailScreenData.MAIN_STOCK_CODE),
        "SCRAP_PURITY": this.commonService.emptyToZero(detailScreenData.SCRAP_PURITY),
        "SCRAP_WT": this.commonService.emptyToZero(detailScreenData.scrapQuantity),
        "SCRAP_PURE_WT": this.commonService.emptyToZero(scrapPureWt),
        "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(detailScreenData.scrapQuantity) - Number(detailScreenData.PURITY)) * scrapPureWt),
        "SCRAP_ACCODE": seqData.length > 0 ? this.commonService.nullToString(seqData[0].GAIN_AC) : '',
        "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
        "ISSUE_GROSS_WT": this.commonService.emptyToZero(element.GROSS_WT),
        "ISSUE_STONE_WT": this.commonService.emptyToZero(element.STONE_WT),
        "ISSUE_NET_WT": this.commonService.emptyToZero(element.NET_WT),
        "JOB_PCS": 1,
        "DESIGN_TYPE": this.commonService.nullToString(detailScreenData.DESIGN_TYPE),
        "TO_STOCK_CODE": this.commonService.nullToString(detailScreenData.METAL_ToStockCode),
        "FROM_STOCK_CODE": this.commonService.nullToString(detailScreenData.METAL_FromStockCode),
        "FROM_SUB_STOCK_CODE": this.commonService.nullToString(detailScreenData.SUB_STOCK_CODE),
        "LOSS_PURE_WT": this.commonService.emptyToZero(detailScreenData.LOSS_QTY * detailScreenData.PURITY),
        "EXCLUDE_TRANSFER_WT": detailScreenData.EXCLUDE_TRANSFER_WT,
        "IRON_WT": this.commonService.emptyToZero(element.IRON_WT),
        "IRON_SCRAP_WT": this.commonService.emptyToZero(detailScreenData.METAL_ToIronScrapWt),
        "GAIN_WT": this.commonService.emptyToZero(detailScreenData.METAL_GainGrWt),
        "GAIN_PURE_WT": this.commonService.emptyToZero(detailScreenData.METAL_GainPureWt),
        "IS_REJECT": true,
        "REASON": "",
        "REJ_REMARKS": "",
        "ATTACHMENT_FILE": "",
        "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
        "PUREWTTEMP": 0
      })
    });
  }
  checkScrapStockCode(stockCode: any, GridstockCode: any, METALSTONE: any) {
    try {
      if (stockCode == GridstockCode && METALSTONE.toUpperCase() == 'M') return stockCode;
      return ''
    } catch (error) {
      return ''
    }
  }
  /**USE: get SEQUENCE_DETAIL_DJ table data */
  getSequenceDetailData(formData: any) {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${formData.SEQ_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.sequenceDetails = data.sequenceDetails
          this.setHeaderGridDetails();
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
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
  setHeaderGridDetails() {
    let dataFromParent = this.detailData[0].DATA;
    let detailScreenData = dataFromParent.PROCESS_FORMDETAILS;
    let METAL_DETAIL_GRID = dataFromParent.METAL_DETAIL_GRID;
    let LOSS_PURE_QTY = this.calculateLossPureQty(detailScreenData);
    let stoneAmount = this.calculateMetalGridSum(METAL_DETAIL_GRID, 'STONEAMOUNT');
    let metalAmount = this.calculateMetalGridSum(METAL_DETAIL_GRID, 'METALAMOUNT');
    let seqDataFrom = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == detailScreenData.processFrom);
    let seqDataTo = this.sequenceDetails.filter((item: any) => item.PROCESS_CODE == detailScreenData.processTo);
    let scrapPureWt = this.commonService.emptyToZero(Number(detailScreenData.scrapQuantity) * Number(detailScreenData.SCRAP_PURITY))
    let amountFC = this.commonService.FCToCC(this.processTransferFrom.value.currency, stoneAmount)

    console.log(this.commonService.timeToMinutes(detailScreenData.consumed), 'time consumed');

    this.PTFDetailsToSave.push({
      "SRNO": 0,
      "UNIQUEID": 0,
      "VOCNO": 0,
      "VOCDATE": this.commonService.formatDateTime(this.processTransferFrom.value.vocdate),
      "VOCTYPE": this.commonService.nullToString(this.processTransferFrom.value.voctype),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "JOB_NUMBER": this.commonService.nullToString(detailScreenData.jobno),
      "JOB_DATE": this.commonService.nullToString(detailScreenData.JOB_DATE),
      "UNQ_JOB_ID": this.commonService.nullToString(detailScreenData.subjobno),
      "UNQ_DESIGN_ID": this.commonService.nullToString(detailScreenData.UNQ_DESIGN_ID),
      "DESIGN_CODE": this.commonService.nullToString(detailScreenData.DESIGN_CODE),
      "SEQ_CODE": this.commonService.nullToString(detailScreenData.SEQ_CODE),
      "JOB_DESCRIPTION": this.commonService.nullToString(this.processTransferFrom.value.subJobDescription),
      "CURRENCY_CODE": this.commonService.nullToString(this.processTransferFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.processTransferFrom.value.currencyrate),
      "FRM_PROCESS_CODE": this.commonService.nullToString(detailScreenData.processFrom),
      "FRM_PROCESSNAME": this.commonService.nullToString(detailScreenData.PROCESSDESC),
      "FRM_WORKER_CODE": this.commonService.nullToString(detailScreenData.workerFrom),
      "FRM_WORKERNAME": this.commonService.nullToString(detailScreenData.WORKERDESC),
      "FRM_PCS": this.commonService.emptyToZero(detailScreenData.StoneWeighFrom),
      "FRM_STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeighFrom),
      "FRM_STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsFrom),
      "FRM_METAL_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightFrom),
      "FRM_METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsFrom),
      "FRM_PURE_WT": this.commonService.emptyToZero(detailScreenData.PUREWT),
      "FRM_NET_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightFrom),
      "TO_PROCESS_CODE": this.commonService.nullToString(detailScreenData.processTo),
      "TO_PROCESSNAME": this.commonService.nullToString(detailScreenData.processToDescription),
      "TO_WORKER_CODE": this.commonService.nullToString(detailScreenData.workerTo),
      "TO_WORKERNAME": this.commonService.nullToString(detailScreenData.workerToDescription),
      "TO_PCS": this.commonService.emptyToZero(detailScreenData.ToJobPcs),
      "TO_METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsTo),
      "TO_STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeightTo),
      "TO_STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsTo),
      "TO_METAL_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "TO_PURE_WT": this.commonService.emptyToZero(Number(detailScreenData.MetalWeightFrom) * Number(detailScreenData.PURITY)),
      "TO_NET_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "LOSS_QTY": this.commonService.emptyToZero(detailScreenData.stdLoss),
      "LOSS_PURE_QTY": this.commonService.emptyToZero(LOSS_PURE_QTY),
      "STONE_AMOUNTFC": this.commonService.emptyToZero(stoneAmount),
      "STONE_AMOUNTLC": this.commonService.FCToCC(this.processTransferFrom.value.currency, stoneAmount),
      "METAL_AMOUNTFC": this.commonService.emptyToZero(metalAmount),
      "METAL_AMOUNTLC": this.commonService.FCToCC(this.processTransferFrom.value.currency, metalAmount),
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
      "IN_DATE": this.commonService.formatDateTime(this.currentDate),
      "OUT_DATE": this.commonService.formatDateTime(this.currentDate),
      "TIME_TAKEN_HRS": 0,
      "METAL_DIVISION": "",
      "LOCTYPE_CODE": "",
      "PICTURE_PATH": this.commonService.nullToString(detailScreenData.PICTURE_PATH),
      "AMOUNTLC": this.commonService.emptyToZero(stoneAmount),
      "AMOUNTFC": 0,
      "JOB_PCS": 0,
      "STONE_WT": this.commonService.emptyToZero(detailScreenData.StoneWeightTo),
      "STONE_PCS": this.commonService.emptyToZero(detailScreenData.StonePcsTo),
      "METAL_WT": this.commonService.emptyToZero(detailScreenData.MetalWeightTo),
      "METAL_PCS": this.commonService.emptyToZero(detailScreenData.MetalPcsTo),
      "PURE_WT": this.commonService.emptyToZero(Number(detailScreenData.MetalWeightTo) * Number(detailScreenData.PURITY)),
      "GROSS_WT": this.commonService.emptyToZero(detailScreenData.GrossWeightTo),
      "RET_METAL_PCS": 0,
      "RET_STONE_PCS": 0,
      "RET_LOC_MET": "",
      "RET_LOC_STN": "",
      "MAIN_WORKER": this.commonService.nullToString(detailScreenData.workerFrom),
      "MKG_LABACCODE": "",
      "REMARKS": this.commonService.nullToString(detailScreenData.remarks),
      "TREE_NO": this.commonService.nullToString(detailScreenData.treeno),
      "STD_TIME": this.commonService.emptyToZero(detailScreenData.stdtime),
      "WORKER_ACCODE": "",
      "PRODLAB_ACCODE": "",
      "DT_BRANCH_CODE": this.commonService.branchCode,
      "DT_VOCTYPE": this.processTransferFrom.value.voctype,
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.commonService.yearSelected,
      "ISSUE_REF": this.commonService.nullToString(detailScreenData.barCodeNumber),
      "IS_AUTHORISE": false,
      "TIME_CONSUMED": this.commonService.emptyToZero(detailScreenData.consumed),
      "SCRAP_STOCK_CODE": this.commonService.nullToString(detailScreenData.stockCode),
      "SCRAP_SUB_STOCK_CODE": this.commonService.nullToString(detailScreenData.MAIN_STOCK_CODE),
      "SCRAP_PURITY": this.commonService.emptyToZero(detailScreenData.SCRAP_PURITY),
      "SCRAP_WT": this.commonService.emptyToZero(detailScreenData.scrapQuantity),
      "SCRAP_PURE_WT": scrapPureWt,
      "SCRAP_PUDIFF": this.commonService.emptyToZero((Number(detailScreenData.scrapQuantity) - Number(detailScreenData.PURITY)) * scrapPureWt),
      "SCRAP_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "APPROVED_DATE": this.commonService.formatDateTime(this.currentDate),
      "APPROVED_USER": this.commonService.nullToString(detailScreenData.approvedby),
      "SCRAP_PCS": this.commonService.emptyToZero(detailScreenData.METAL_ScrapPCS),
      "SCRAP_STONEWT": this.commonService.emptyToZero(detailScreenData.METAL_ScrapStoneWt),
      "SCRAP_NETWT": this.commonService.emptyToZero(detailScreenData.METAL_ScrapNetWt),
      "FROM_IRONWT": this.commonService.emptyToZero(detailScreenData.METAL_FromIronWeight),
      "FROM_MSTOCKCODE": this.commonService.nullToString(detailScreenData.METAL_FromStockCode),
      "TO_MSTOCKCODE": this.commonService.nullToString(detailScreenData.METAL_ToStockCode),
      "DESIGN_TYPE": this.commonService.nullToString(detailScreenData.DESIGN_TYPE),
      "TO_IRONWT": this.commonService.emptyToZero(detailScreenData.METAL_ToIronWt),
      "FRM_DIAGROSS_WT": this.commonService.emptyToZero(detailScreenData.METAL_GrossWeightFrom),
      "EXCLUDE_TRANSFER_WT": detailScreenData.EXCLUDE_TRANSFER_WT,
      "SCRAP_DIVCODE": this.commonService.nullToString(detailScreenData.DIVCODE),
      "IRON_SCRAP_WT": this.calculateIronScrapWeight(detailScreenData),
      "GAIN_WT": this.commonService.emptyToZero(detailScreenData.METAL_GainGrWt),
      "GAIN_PURE_WT": this.commonService.emptyToZero(detailScreenData.METAL_GainPureWt),
      "GAIN_ACCODE": seqDataFrom.length > 0 ? this.commonService.nullToString(seqDataFrom[0].GAIN_AC) : '',
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
    })
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
  setPostData(form: any) {
    let detailScreenData = this.detailData[0].DATA;
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS;
    return {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(form.value.voctype),
      "BRANCH_CODE": this.commonService.nullToString(this.branchCode),
      "VOCNO": this.commonService.nullToString(form.value.vocno),
      "VOCDATE": this.commonService.nullToString(this.commonService.formatDateTime(form.value.vocdate)),
      "YEARMONTH": this.commonService.nullToString(this.yearMonth),
      "DOCTIME": this.commonService.formatDateTime(this.currentDate),
      "SMAN": this.commonService.nullToString(form.value.salesman),
      "REMARKS": this.commonService.nullToString(form.value.Narration),
      "CURRENCY_CODE": this.commonService.nullToString(form.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.value.currencyrate),
      "NAVSEQNO": this.commonService.yearSelected,
      "LAB_TYPE": this.commonService.emptyToZero(detailScreenData.METALLAB_TYPE),
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_PROCESS_TRN_DETAIL_DJ": this.PTFDetailsToSave, //header grid details
      "JOB_PROCESS_TRN_STNMTL_DJ": this.metalGridDataToSave, //detail screen data
      "JOB_PROCESS_TRN_LABCHRG_DJ": this.labourChargeDetailsToSave // labour charge details
    }
  }
  // submit save click
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatePTF()
      return
    }
    if (this.processTransferFrom.invalid) {
      this.commonService.toastErrorByMsgId('select all required fields')
      return
    }

    let API = 'JobProcessTrnMasterDJ/InsertJobProcessTrnMasterDJ';
    let postData = this.setPostData(this.processTransferFrom.value)
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response && result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  updatePTF() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatePTF()
      return
    }
    if (this.processTransferFrom.invalid) {
      this.commonService.toastErrorByMsgId('select all required fields')
      return
    }

    let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/1/1/1/1';
    let postData = this.setPostData(this.processTransferFrom.value)
    this.commonService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response && result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    this.processTransferFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.processTransferFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.processTransferFrom.controls.vocno.setValue(this.content.VOCNO)
    this.processTransferFrom.controls.salesman.setValue(this.content.SMAN)
    this.processTransferFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.processTransferFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
  }

  deleteTableData(): void {
    if (this.selectRowIndex == undefined || this.selectRowIndex == null) {
      this.commonService.toastErrorByMsgId('Please select row to remove from grid!')
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
        this.tableData = this.tableData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }
  reCalculateSRNO() {
    this.tableData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
    })
  }
  deleteRecord() {
    if (!this.content.VOCNO) {
      this.commonService.showSnackBarMsg('Please select Data to delete')
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
        let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' +
          this.processTransferFrom.value.branchCode + '/' +
          this.processTransferFrom.value.voctype + '/' +
          this.processTransferFrom.value.vocno + '/' +
          this.processTransferFrom.value.yearMonth
        this.commonService.showSnackBarMsg('Loading....')
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            this.commonService.closeSnackBarMsg()
            if (result && result.status == "Success") {
              this.showSuccessDialog('deleted successfully')
            } else {
              this.commonService.showSnackBarMsg('Error Something went wrong')
            }
          }, err => {
            this.commonService.closeSnackBarMsg()
            this.commonService.showSnackBarMsg('Error Something went wrong')
          })
        this.subscriptions.push(Sub)
      }
    });
  }
  showSuccessDialog(message: string) {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.close('reloadMainGrid')
    });
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.processTransferFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'salesman':
        this.overlaysalesman.showOverlayPanel(event);
        break;
      default:

    }
  }


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.processTransferFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''

          if (FORMNAME === 'salesman') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }
}
