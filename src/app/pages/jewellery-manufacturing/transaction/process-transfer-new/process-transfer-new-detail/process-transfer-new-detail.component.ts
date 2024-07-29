import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
@Component({
  selector: 'app-process-transfer-new-detail',
  templateUrl: './process-transfer-new-detail.component.html',
  styleUrls: ['./process-transfer-new-detail.component.scss']
})
export class ProcessTransferNewDetailComponent implements OnInit {
  @ViewChild('overlayjobno') public overlayjobno!: MasterSearchComponent;
  @ViewChild('overlayprocessFrom') public overlayprocessFrom!: MasterSearchComponent;
  @ViewChild('overlayprocessTo') public overlayprocessTo!: MasterSearchComponent;
  @ViewChild('overlayworkerFrom') public overlayworkerFrom!: MasterSearchComponent;
  @ViewChild('overlayworkerTo') public overlayworkerTo!: MasterSearchComponent;
  @ViewChild('overlayMETAL_processFrom') public overlayMETAL_processFrom!: MasterSearchComponent;
  @ViewChild('overlayMETAL_processTo') public overlayMETAL_processTo!: MasterSearchComponent;
  @ViewChild('overlayMETAL_workerFrom') public overlayMETAL_workerFrom!: MasterSearchComponent;
  @ViewChild('overlayMETAL_workerTo') public overlayMETAL_workerTo!: MasterSearchComponent;
  minEndDate: string = '';
  @Input() content!: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  metalDetailData: any[] = [];
  jobNumberDetailData: any[] = [];
  ProcessTypeList: any[] = [{ type: 'GEN' }];
  userName = this.comService.userName;
  branchCode: String = this.comService.branchCode;
  yearMonth: String = this.comService.yearSelected;
  MetalorProcessFlag: string = 'Process';
  viewMode: boolean = false;
  designType: string = 'DIAMOND';
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
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
    //DIAMOND DETAIL STARTS
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
    MAIN_STOCK_CODE: [''],
    SCRAP_PURITY: [''],
    DESIGN_TYPE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    //METAL DETAILS STARTS
    METAL_quantity: [''],
    METAL_processFrom: [''],
    METAL_processTo: [''],
    METAL_processToDescription: [''],
    METAL_workerFrom: [''],
    METAL_workerTo: [''],
    METAL_workerToDescription: [''],
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
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) {
    // this.processTransferdetailsForm = this.formBuilder.group({
    //   startdate: ['', Validators.required],
    //   enddate: ['', Validators.required]
    // }, { validators: this.dateValidator });

  }

  // dateValidator(formGroup: FormGroup) {
  //   const startdate = formGroup.get('startdate').value;
  //   const enddate = formGroup.get('enddate').value;

  //   if (startdate && enddate && startdate > enddate) {
  //     return { dateError: true };
  //   }

  //   return null;
  // }

  // updateMinDate() {
  //   const startDateControl = this.processTransferdetailsForm.get('startdate');
  //   const endDateControl = this.processTransferdetailsForm.get('enddate');

  //   if (startDateControl.value) {
  //     endDateControl.setValidators([Validators.required]);
  //     endDateControl.updateValueAndValidity();
  //     endDateControl.setValidators([Validators.required, this.dateValidator.bind(this.processTransferdetailsForm)]);
  //     endDateControl.updateValueAndValidity();

  //     const startDate = new Date(startDateControl.value);
  //     this.processTransferdetailsForm.get('endDate').setValidators([Validators.required, Validators.min(startDate)]);
  //     this.processTransferdetailsForm.get('endDate').updateValueAndValidity();
  //   } else {
  //     endDateControl.clearValidators();
  //     endDateControl.updateValueAndValidity();
  //   }
  // }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setAllInitialValues() //set all values from parent to child
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
    this.processTransferdetailsForm.controls.enddate.setValue(dataFromParent.enddate)
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
    this.showOverleyPanel(event, 'jobno')
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
            if (data[0].DESIGN_TYPE != '' && (data[0].DESIGN_TYPE).toUpperCase() == 'METAL') this.designType = 'METAL';

            this.processTransferdetailsForm.controls.DESIGN_TYPE.setValue(this.designType)
            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.processTransferdetailsForm.controls.jobno.setValue('')
            this.showOverleyPanel(event, 'jobno')
            return
          }
        } else {
          this.overlayjobno.closeOverlayPanel()
          this.processTransferdetailsForm.controls.jobno.setValue('')
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
          this.stockCodeScrapValidate()
          this.processTransferdetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.processTransferdetailsForm.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.processTransferdetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          this.processTransferdetailsForm.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          this.processTransferdetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
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
  /**USE: Process Master Validate */
  processMasterValidate(event: any, flag: string): void {
    this.showOverleyPanel(event, 'processTo')
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
          this.overlayprocessTo.showOverlayPanel(event)
          this.showOverleyPanel(event, 'processTo')
          this.processTransferdetailsForm.controls.processTo.setValue('')
          this.comService.toastErrorByMsgId('MSG1531')
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

  metalprocessCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_processFrom.setValue(event.Process_Code)
  }
  metalprocessCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_processTo.setValue(event.Process_Code)
    this.processTransferdetailsForm.controls.METAL_processToDescription.setValue(event.Description)

  }

  workerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.workerFrom.setValue(event.WORKER_CODE)
  }
  workerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.workerTo.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.workerToDescription.setValue(event.DESCRIPTION)
  }

  metalworkerCodeFromSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_workerFrom.setValue(event.WORKER_CODE)
  }

  metalworkerCodeToSelected(event: any) {
    this.processTransferdetailsForm.controls.METAL_workerTo.setValue(event.WORKER_CODE)
    this.processTransferdetailsForm.controls.METAL_workerToDescription.setValue(event.DESCRIPTION)
  }

  jobNumberSelected(event: any) {
    this.processTransferdetailsForm.controls.jobno.setValue(event.job_number)
    this.processTransferdetailsForm.controls.jobdes.setValue(event.job_description)
    this.jobNumberValidate({ target: { value: event.job_number } })
  }
  removedata() {
    this.tableData.pop();
  }
  /**USE: SUBMIT detail */
  formSubmit() {
    let detailDataToParent: any = {
      PROCESS_FORMDETAILS: [],
      METAL_DETAIL_GRID: [],
      JOB_VALIDATE_DATA: []
    }
    this.calculateGain()

    detailDataToParent.PROCESS_FORMDETAILS = this.processTransferdetailsForm.value;
    detailDataToParent.METAL_DETAIL_GRID = this.metalDetailData; //grid data
    detailDataToParent.JOB_VALIDATE_DATA = this.jobNumberDetailData;
    this.close(detailDataToParent)//USE: passing Detail data to header screen on close
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
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.processTransferdetailsForm.value[formControlName] != '') return;

    switch (formControlName) {
      case 'METAL_workerTo':
        this.overlayMETAL_workerTo.showOverlayPanel(event);
        break;
      case 'METAL_workerFrom':
        this.overlayMETAL_workerFrom.showOverlayPanel(event);
        break;
      case 'METAL_processTo':
        this.overlayMETAL_processTo.showOverlayPanel(event);
        break;
      case 'METAL_processFrom':
        this.overlayMETAL_processFrom.showOverlayPanel(event);
        break;
      case 'workerTo':
        this.overlayworkerTo.showOverlayPanel(event);
        break;
      case 'workerFrom':
        this.overlayworkerFrom.showOverlayPanel(event);
        break;
      case 'processTo':
        this.overlayprocessTo.showOverlayPanel(event);
        break;
      case 'processFrom':
        this.overlayprocessFrom.showOverlayPanel(event);
        break;
      case 'jobno':
        this.overlayjobno.showOverlayPanel(event);
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
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.processTransferdetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''

          if (FORMNAME === 'METAL_workerTo' || FORMNAME === 'METAL_workerFrom' || FORMNAME === 'METAL_processTo' || FORMNAME === 'METAL_processFrom' || FORMNAME === 'workerTo' || FORMNAME === 'processTo' || FORMNAME === 'processFrom' || FORMNAME === 'jobno') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
