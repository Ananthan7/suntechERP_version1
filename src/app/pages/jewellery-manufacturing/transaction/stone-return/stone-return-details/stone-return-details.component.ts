import { Component, EventEmitter, Input, OnInit, Output, ViewChild,ElementRef } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { log } from 'console';
@Component({
  selector: 'app-stone-return-details',
  templateUrl: './stone-return-details.component.html',
  styleUrls: ['./stone-return-details.component.scss']
})
export class StoneReturnDetailsComponent implements OnInit {
  @ViewChild('overlayjobNumberSearch') overlayjobNumberSearch!: MasterSearchComponent;
  @ViewChild('overlaysubjobnoSearch') overlaysubjobnoSearch!: MasterSearchComponent;
  @ViewChild('overlaydesigncodeSearch') overlaydesigncodeSearch!: MasterSearchComponent;
  @ViewChild('overlayprocessSearch') overlayprocessSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlaywstockCodeSearch') overlaywstockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaylocationSearch') overlaylocationSearch!: MasterSearchComponent;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  jobDate = new Date();
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  imagepath: any[] = []
  isDisableSaveBtn: boolean = false;
  selectedOption: string | null = null;
  editMode: boolean = false;
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
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
  JobNoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  // subJobNoCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 258,
  //   SEARCH_FIELD: 'UNQ_JOB_ID',
  //   SEARCH_HEADING: 'Sub Job Search',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: `BRANCH_CODE='${this.comService.branchCode}' AND ISNULL(PROD_REF,0)=0`,
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
  subJobNoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 275,
    SEARCH_FIELD: 'UNQ_JOB_ID',
    SEARCH_HEADING: 'Sub Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: ` ISNULL(PROD_REF,0)=0 and Branch_code = '${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  setSubJobCondition() {
    let form = this.stonereturndetailsFrom.value;
    this.subJobNoCodeData.WHERECONDITION = `isnull(WAX_STATUS,'') <> 'I' and Branch_code = '${this.comService.branchCode}'`
    this.subJobNoCodeData.WHERECONDITION += `and job_number='${this.comService.nullToString(form.jobNumber)}'`
  }
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 255,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strProcessCode='',@strSubJobNumber='',@strCurrentUser='${this.comService.userName}',@strBranchCode='${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 256,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strWorkerCode='',@strProcessCode='',@strSubJobNumber='',@strCurrentUser='${this.comService.userName}',@strBranchCode='${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 257,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strProcessCode='',@strWorkerCode='',@strSubJobNumber='',@strBranchCode='${this.comService.branchCode}',@strStockCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stonereturndetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDesc: ['', [Validators.required]],
    subjobno: [''],
    subjobDesc: [''],
    designcode: [''],
    salesorderno: [''],
    process: ['', [Validators.required]],
    processname: [''],
    worker: ['', [Validators.required]],
    workername: [''],
    stockCode: [''],
    stockCodeDes: [''],
    batchid: [''],
    broken: [''],
    brokenDescription: [''],
    location: [''],
    pieces: [''],
    size: [''],
    sieve: [''],
    carat: [''],
    color: [''],
    clarity: [''],
    unitrate: [''],
    shape: [''],
    sieveset: [''],
    amount: [''],
    pointerwt: [''],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    DIVCODE: [''],
    SMAN: [''],
    JOB_DATE: [''],
    PICTURE_PATH: [''],
    FLAG: [null]
  });
  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setOnLoadDetails()
    if (this.content) {
      this.stonereturndetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      if (this.content.HEADERDETAILS.FLAG == 'VIEW') {
        this.viewMode = true;
      }
      this.setFormValues()
    }
  }
  @ViewChild('jobNumberInput') jobNumberInput!: ElementRef;

  ngAfterViewInit() {
    if (!this.viewMode) {
      this.jobNumberInput.nativeElement.focus();
    }
  }

  setFormValues() {
    console.log(this.content, 'formfunction')
    if (!this.content) return
    this.stonereturndetailsFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.stonereturndetailsFrom.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.stonereturndetailsFrom.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.VOCDATE)
    this.stonereturndetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.stonereturndetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.stonereturndetailsFrom.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE || this.content.HEADERDETAILS.currency)
    this.stonereturndetailsFrom.controls.CURRENCY_RATE.setValue(this.content.CURRENCY_RATE || this.content.HEADERDETAILS.currencyrate)
    this.stonereturndetailsFrom.controls.SMAN.setValue(this.content.SMAN || this.content.HEADERDETAILS.enterdBy)

    this.stonereturndetailsFrom.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.stonereturndetailsFrom.controls.jobDesc.setValue(this.content.JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.subjobno.setValue(this.content.UNQ_JOB_ID)
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(this.content.JOB_DESCRIPTION)
    this.stonereturndetailsFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    // this.stonereturndetailsFrom.controls.salesorderno.setValue(this.content.PROCESS_NAME)
    this.stonereturndetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stonereturndetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stonereturndetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stonereturndetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stonereturndetailsFrom.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.stonereturndetailsFrom.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.stonereturndetailsFrom.controls.sieveset.setValue(this.content.SIEVE_SET)
    this.stonereturndetailsFrom.controls.broken.setValue(this.content.STOCK_CODE)
    this.stonereturndetailsFrom.controls.brokenDescription.setValue(this.content.STOCK_DESCRIPTION)
    this.stonereturndetailsFrom.controls.pieces.setValue(this.content.PCS)
    this.stonereturndetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stonereturndetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stonereturndetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stonereturndetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stonereturndetailsFrom.controls.unitrate.setValue(this.content.RATEFC)
    this.stonereturndetailsFrom.controls.amount.setValue(this.content.AMOUNTFC)
    this.stonereturndetailsFrom.controls.pointerwt.setValue(this.content.GROSS_WT)

  };

  JobNumberSelected(e: any) {
    this.stonereturndetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stonereturndetailsFrom.controls.jobDesc.setValue(e.job_description);
    this.subJobNoCodeData.WHERECONDITION += `AND JOB_NUMBER = '${e.job_number} AND ISNULL(PROD_REF,0)=0'`
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  subJobNoCodeSelected(e: any) {
    this.stonereturndetailsFrom.controls.subjobno.setValue(e.UNQ_JOB_ID);
    this.stonereturndetailsFrom.controls.subjobDesc.setValue(e.DESCRIPTION);
    this.subJobNoCodeData.WHERECONDITION += `AND UNQ_JOB_ID = '${e.UNQ_JOB_ID}'`
    this.setProcessCodeWhereCondition()
    this.setWorkerCodeWhereCondition()
    this.setStockCodeWhereCondition()

  }
  processCodeSelected(e: any) {
    this.stonereturndetailsFrom.controls.process.setValue(e.PROCESS_CODE);
    this.stonereturndetailsFrom.controls.processname.setValue(e.DESCRIPTION);
    this.setProcessCodeWhereCondition()
    this.setStockCodeWhereCondition()
    this.setWorkerCodeWhereCondition()
  }

  workerCodeSelected(e: any) {
    this.stonereturndetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stonereturndetailsFrom.controls.workername.setValue(e.DESCRIPTION);
    this.setProcessCodeWhereCondition()
    this.setStockCodeWhereCondition()
  }
  setOnLoadDetails() {
    let branchParam = this.comService.allbranchMaster;
    // Set LOCTYPE_CODE only if it's not already set
    if (!this.stonereturndetailsFrom.controls.location.value) {
      this.stonereturndetailsFrom.controls.location.setValue(branchParam.DMFGMLOC);
    }
  }
  stockCodeSelected(e: any) {
    console.log(e,'eee')
    this.stonereturndetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stonereturndetailsFrom.controls.stockCodeDes.setValue(e.Discription);
    this.stonereturndetailsFrom.controls.DIVCODE.setValue(e.DivCode);

    this.stonereturndetailsFrom.controls.pieces.setValue(e.Pcs)
    this.stonereturndetailsFrom.controls.size.setValue(e.Size)
    this.stonereturndetailsFrom.controls.sieve.setValue(e.sieve)
    this.stonereturndetailsFrom.controls.sieveset.setValue(e.sieve_set)
    this.stonereturndetailsFrom.controls.color.setValue(e.color)
    this.stonereturndetailsFrom.controls.unitrate.setValue(
      this.comService.emptyToZero(e.rate).toFixed(2)
    )
    this.stonereturndetailsFrom.controls.shape.setValue(e.shape)
    this.stonereturndetailsFrom.controls.amount.setValue(e.AmountFC)
    // this.stonereturndetailsFrom.controls.pointerwt.setValue(e.Weight)
    this.stonereturndetailsFrom.controls.batchid.setValue(e.STOCK_CODE);
    this.stonereturndetailsFrom.controls.broken.setValue(e.STOCK_CODE)
    this.stonereturndetailsFrom.controls.brokenDescription.setValue(e.Discription)
    this.stonereturndetailsFrom.controls.carat.setValue(e.Weight)
    this.setValueWithDecimal('unitrate', 0, 'AMOUNT')
    this.setValueWithDecimal('amount', 0, 'AMOUNT')
    this.setValueWithDecimal('pointerwt', 0, 'FOUR')
    this.setStockCodeWhereCondition()
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.stonereturndetailsFrom.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  setProcessCodeWhereCondition() {
    this.processCodeData. WHERECONDITION = `@strProcessCode='${this.stonereturndetailsFrom.value.process}',`
    this.processCodeData.WHERECONDITION += `@strSubJobNumber='${this.stonereturndetailsFrom.value.subjobno}',`
    this.processCodeData.WHERECONDITION += `@strCurrentUser='${this.comService.userName}',`
    this.processCodeData.WHERECONDITION += `@strBranchCode='${this.comService.branchCode}'`
      // this.processCodeData.WHERECONDITION = WHERECONDITION
  }
  setWorkerCodeWhereCondition() {
    let WHERECONDITION = `@strWorkerCode='${this.stonereturndetailsFrom.value.worker}',`
    WHERECONDITION += `@strProcessCode='${this.stonereturndetailsFrom.value.process}',`
    WHERECONDITION += `@strSubJobNumber='${this.stonereturndetailsFrom.value.subjobno}',`
    WHERECONDITION += `@strCurrentUser='${this.comService.userName}',`
    WHERECONDITION += `@strBranchCode='${this.comService.branchCode}'`
    this.workerCodeData.WHERECONDITION = WHERECONDITION
  }
  setStockCodeWhereCondition() {
    let form = this.stonereturndetailsFrom.value;
    this.stockCodeData.WHERECONDITION = `@strProcessCode='${this.comService.nullToString(form.process)}',`
    this.stockCodeData.WHERECONDITION += `@strWorkerCode='${this.comService.nullToString(form.worker)}',`
    this.stockCodeData.WHERECONDITION += `@strSubJobNumber='${this.comService.nullToString(form.subjobno)}',`
    this.stockCodeData.WHERECONDITION += `@strBranchCode='${this.comService.branchCode}',`
    this.stockCodeData.WHERECONDITION += `@strStockCode='${this.comService.nullToString(form.stockCode)}'`
    // this.stockCodeData.WHERECONDITION = WHERECONDITION
  }
  locationCodeSelected(e: any) {
    console.log(e);
    this.stonereturndetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  setPostData(form: any) {
    return {
      "SRNO": this.comService.emptyToZero(this.content?.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDate(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDate(new Date(form.JOB_DATE)),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.comService.nullToString(form.jobNumber),
      "JOB_DESCRIPTION": form.jobDesc,
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": this.comService.nullToString(form.designcode),
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SIEVE": this.comService.nullToString(form.sieve),
      "SHAPE": this.comService.nullToString(form.shape),
      "COLOR": this.comService.nullToString(form.color),
      "CLARITY": this.comService.nullToString(form.clarity),
      "SIZE": this.comService.nullToString(form.size),
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": this.comService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.comService.emptyToZero(form.CURRENCY_RATE),
      "RATEFC":this.comService.nullToString(form.unitrate),
      "RATELC":this.comService.nullToString(form.unitrate),
      "AMOUNTFC":this.comService.nullToString(form.amount),
      "AMOUNTLC":this.comService.nullToString(form.amount),
      "PROCESS_CODE": this.comService.nullToString(form.process),
      "PROCESS_NAME": this.comService.nullToString(form.processname),
      "WORKER_CODE": this.comService.nullToString(form.worker),
      "WORKER_NAME": this.comService.nullToString(form.workername),
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.location),
      "STOCK_CODE_BRK": "",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "NAVSEQNO": 0,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "",
      "SMAN": this.comService.nullToString(form.SMAN),
      "REMARKS": "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "ISBROCKEN": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.comService.nullToString(form.YEARMONTH),
      "RET_TO_DESC": "",
      "PICTURE_NAME": this.comService.nullToString(form.PICTURE_PATH),
      "RET_TO": "",
      "ISMISSING": 0,
      "SIEVE_SET": this.comService.nullToString(form.sieveset),
      "SUB_STOCK_CODE": ""
    }
  }
  getImageData() {
    let API = `Image/${this.stonereturndetailsFrom.value.jobNumber}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.imagepath = data.map((item: any) => item.imagepath)
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  selectOption(option: string): void {
    if (this.selectedOption === option) {
      // If the user selects the already selected option, unselect it.
      this.selectedOption = null;
    } else {
      // Otherwise, select the new option.
      this.selectedOption = option;
    }
  }

  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.comService.toastErrorByMsgId('MSG1358')//Job Number code required
      return true
    }
    if (this.comService.nullToString(form.process) == '') {
      this.comService.toastErrorByMsgId('MSG1680')//process code required
      return true
    }
    if (this.comService.nullToString(form.worker) == '') {
      this.comService.toastErrorByMsgId('MSG1951')//worker code required
      return true
    }
    return false
  }
  formSubmit(flag: any) {
    if (this.submitValidations(this.stonereturndetailsFrom.value)) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData(this.stonereturndetailsFrom.value)
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
  }
  changeJobClicked() {
    this.formSubmit('CONTINUE')
    this.stonereturndetailsFrom.reset()
  }
  resetStockDetails() {
    this.stonereturndetailsFrom.controls.stockCode.setValue('')
    this.stonereturndetailsFrom.controls.stockCodeDes.setValue('')
    // this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('')
    // this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    // this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    // this.setValueWithDecimal('PURITY', 0, 'PURITY')
    // this.setValueWithDecimal('NET_WT', 0, 'THREE')
    // this.setValueWithDecimal('KARAT', 0, 'THREE')
    // this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  subJobNumberValidate(event?: any) {
    if (event?.target.value == '' || this.viewMode) return;
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.stonereturndetailsFrom.value.subjobno,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser':  this.comService.nullToString(this.userName)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data,'data')
          this.stonereturndetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.stonereturndetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.stonereturndetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.stonereturndetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          // this.stonereturndetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.stonereturndetailsFrom.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          // this.stonereturndetailsFrom.controls.designcode.setValue(data.DESIGN_CODE)
          // this.stonereturndetailsFrom.controls.location.setValue(data[0].LOCTYPE_CODE)
          this.stonereturndetailsFrom.controls.PICTURE_PATH.setValue(data.PICTURE_PATH)

          this.setProcessCodeWhereCondition()
          this.setWorkerCodeWhereCondition()
          this.setStockCodeWhereCondition()
          this.getImageData()
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  showConfirmationDialog(message: string): Promise<any> {
    return Swal.fire({
      title: 'Confirmation',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, continue',
      cancelButtonText: 'No, cancel'
    });
  }
  jobNumberValidate(event: any) {
    this.showOverleyPanel(event, 'jobNumber')
    if (event.target.value == '') return

    this.subJobNoCodeData.WHERECONDITION = `
    Job_Number = '${this.stonereturndetailsFrom.controls.jobNumber.value}'
    and Branch_code = '${this.comService.branchCode}'
    AND isnull(WAX_STATUS, '') <> 'I'
  `;
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strJobNumber': this.comService.nullToString(event.target.value),
        'strCurrenctUser': this.comService.nullToString(this.comService.userName)
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
            console.log(data,'data')
            this.stonereturndetailsFrom.controls.jobDesc.setValue(data[0].DESCRIPTION)
            this.stonereturndetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.stonereturndetailsFrom.controls.subjobDesc.setValue(data[0].JOB_DESCRIPTION)
            this.stonereturndetailsFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
            this.stonereturndetailsFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            if (!data[0]?.METAL_STOCK_CODE) { 
              this.showConfirmationDialog("No process in API for the provided job number."); 
              return;
            }
            this.setSubJobCondition()
            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.stonereturndetailsFrom.controls.jobNumber.setValue('')
            this.showOverleyPanel(event, 'jobNumber')

          }
        } else {
          this.overlayjobNumberSearch.closeOverlayPanel()
          this.stonereturndetailsFrom.controls.jobNumber.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        } return
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  WorkerCodeValidate(event?: any) {
    this.showOverleyPanel(event, 'worker')// this
    let form = this.stonereturndetailsFrom.value;
    let postData = {
      "SPID": "103",
      "parameter": {
        strBranch_Code: this.comService.nullToString(form.BRANCH_CODE),
        strJob_Number: this.comService.nullToString(form.jobNumber),
        strUnq_Job_Id: this.comService.nullToString(form.subjobno),
        strMetalStone: this.comService.nullToString(form.METAL_STONE),
        strProcess_Code: this.comService.nullToString(form.process),
        strWorker_Code: this.comService.nullToString(form.worker),
        strStock_Code: this.comService.nullToString(form.stockCode),
        strUserName: '',
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {

        } else {
          this.overlayworkerSearch.showOverlayPanel(event)
          // this.comService.toastErrorByMsgId('MSG1747')
          this.stonereturndetailsFrom.controls.worker.setValue('')
          this.showOverleyPanel(event, 'worker')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  processCodeValidate(event?: any) {
    this.showOverleyPanel(event, 'process')// this
    let form = this.stonereturndetailsFrom.value;
    let postData = {
      "SPID": "103",
      "parameter": {
        strBranch_Code: this.comService.nullToString(form.BRANCH_CODE),
        strJob_Number: this.comService.nullToString(form.jobNumber),
        strUnq_Job_Id: this.comService.nullToString(form.UNQ_JOB_ID),
        strMetalStone: '',
        strProcess_Code: this.comService.nullToString(form.process),
        strWorker_Code: this.comService.nullToString(form.worker),
        strStock_Code: this.comService.nullToString(form.stockCode),
        strUserName: '',
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {

        } else {
          this.overlayprocessSearch.showOverlayPanel(event)

          this.stonereturndetailsFrom.controls.process.setValue('')
          // this.showOverleyPanel(event, 'process')
          // this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  showOverleyPanel(event: any, formControlName: string) {
    let value = this.stonereturndetailsFrom.value[formControlName]
    if (this.comService.nullToString(value) != '') return;

    switch (formControlName) {
      case 'jobNumber':
        this.overlayjobNumberSearch.showOverlayPanel(event);
        break;
      case 'subjobno':
        this.overlaysubjobnoSearch.showOverlayPanel(event);
        break;
      case 'designcode':
        this.overlaydesigncodeSearch.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayprocessSearch.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkerSearch.showOverlayPanel(event);
        break;
        case 'location':
        this.overlaylocationSearch.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaywstockCodeSearch.showOverlayPanel(event);
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
          this.stonereturndetailsFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = '';
          if (FORMNAME === 'subjobno'|| FORMNAME === 'location' ) {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  stockCodeValidate(event: any) {
    this.showOverleyPanel(event, 'stockCode')
    if (event.target.value == '') return
    let postData = {
      "SPID": "046",
      "parameter": {
        strStockCode: event.target.value,
        strBranchCode: this.comService.nullToString(this.branchCode),
        strVocType: this.content.HEADERDETAILS.VOCTYPE,
        strUserName: this.comService.nullToString(this.userName),
        strLocation: '',
        strPartyCode: '',
        strVocDate: this.comService.formatDateTime(this.comService.currentDate)
    }
};

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
        .subscribe((result) => {
            this.comService.closeSnackBarMsg();
            if (result.status === "Success" && result.dynamicData[0]) {
                let data = result.dynamicData[0];
                if (data) {
                    console.log(data, 'data');
                    if (data[0].VALID_STOCK) {
                        // Handle the valid stock case
                        // You can set other form values or perform other actions here if needed
                        this.overlaywstockCodeSearch.closeOverlayPanel();
                    } else {
                        this.comService.toastErrorByMsgId('MSG1531');
                        this.stonereturndetailsFrom.controls.stockCode.setValue('');
                        this.showOverleyPanel(event, 'stockCode');
                    }
                } else {
                    this.comService.toastErrorByMsgId('MSG1531');
                    this.stonereturndetailsFrom.controls.stockCode.setValue('');
                    this.showOverleyPanel(event, 'stockCode');
                }
            } else {
                this.comService.toastErrorByMsgId('MSG1747');
                this.stonereturndetailsFrom.controls.stockCode.setValue('');
                this.overlaywstockCodeSearch.closeOverlayPanel();
            }
        }, err => {
            this.comService.closeSnackBarMsg();
            this.comService.toastErrorByMsgId('MSG1531');
            this.stonereturndetailsFrom.controls.stockCode.setValue('');
            this.showOverleyPanel(event, 'stockCode');
        });

    this.subscriptions.push(Sub);
}
calculateCarat(event: any) {
  const pieces = event.target.value || 0;
  const pointerwt = this.stonereturndetailsFrom.get('pointerwt')?.value || 0;
  // Calculate both carat values
  const carat1 = pieces * pointerwt;
  const carat2 = pointerwt * pieces;

  // Log the results (they will be the same)
  console.log('Carat1 (pieces * pointerwt):', carat1);
  console.log('Carat2 (pointerwt * pieces):', carat2);

  // Set the calculated carat value to the form control
  this.stonereturndetailsFrom.get('carat')?.setValue(carat1.toFixed(3));
}
calculateAmount(event: any) {
  const carat = parseFloat(this.stonereturndetailsFrom.get('carat')?.value) || 0;
  console.log(carat)
  const unitrate = parseFloat(this.stonereturndetailsFrom.get('unitrate')?.value) || 0;
  console.log(unitrate)
  
  const amount = carat * unitrate;
  console.log(amount)
  this.stonereturndetailsFrom.get('amount')?.setValue(amount.toFixed(2));
}
}
