import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue-details',
  templateUrl: './metal-issue-details.component.html',
  styleUrls: ['./metal-issue-details.component.scss']
})
export class MetalIssueDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() content!: any;
  @Input() isViewChangeJob: boolean = true;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  columnhead: any[] = ['DIVCODE', 'STOCK_CODE', 'KARAT', 'COLOR', 'Req.Pcs', 'Req.Wt ', 'Issued Pcs', 'Issued Wt', 'Bal.pcs', 'Bal.Wt'];
  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  yearMonth?: String;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  jobNumberDetailData: any[] = [];
  userName = localStorage.getItem('username');
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  isViewContinue!: boolean;
  viewMode: boolean = false;
  masterMetalChecked: boolean = false;
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
  jobNumberCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 253,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strType='true',@strWorker='',@strCurrentUser='${this.comService.userName}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 254,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@strProcess='',@blnActive=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 51,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION='G' AND SUBCODE=0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  metalIssueDetailsForm: FormGroup = this.formBuilder.group({
    VOCNO: [''],
    VOCDATE: [''],
    VOCTYPE: [''],
    BRANCH_CODE: [''],
    EXCLUDE_TRANSFER_WT: [false],
    JOB_DATE: [''],
    jobNumber: ['', [Validators.required]],
    jobNumDes: ['', [Validators.required]],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: ['', [Validators.required]],
    processCodeDesc: ['', [Validators.required]],
    workerCode: ['', [Validators.required]],
    workerCodeDes: ['', [Validators.required]],
    pictureName: [''],
    DESIGN_CODE: [''],
    PART_CODE: [''],
    UNQ_DESIGN_ID: [''],
    uniqueId: [''],
    treeNumber: [''],
    jobPurity: [''],
    stockCode: ['', [Validators.required]],
    stockCodeDes: ['', [Validators.required]],
    pcs: [''],
    PURITY: [''],
    GROSS_WT: [''],
    NET_WT: [''],
    STONE_WT: [''],
    PURE_WT: [''],
    toStockCode: [''],
    toStockCodeDes: [''],
    toDIVCODE: [''],
    Comments: [''],
    location: [''],
    totalAmountFc: [''],
    DIVCODE: [''],
    KARAT_CODE: [''],
    KARAT: [''],
    subStockCode: [''],
    totalAmountLc: [''],
    purityDiff: [''],
    amountFc: [''],
    JOB_PCS: [''],
    amountLc: [''],
    masterMetal: [false],
    FLAG: [null]
  });
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.setNewFormValue()
    if (this.content && this.content.FLAG) {
      this.setInitialValues()
      this.metalIssueDetailsForm.controls.FLAG.setValue(this.content.FLAG)
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.masterMetalChecked = true;
      }
    }
  }
  setNewFormValue(){
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
  }
  setInitialValues() {
    if (!this.content) return;
    this.metalIssueDetailsForm.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.metalIssueDetailsForm.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.metalIssueDetailsForm.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.vocdate)
    this.metalIssueDetailsForm.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
 
    this.metalIssueDetailsForm.controls.JOB_DATE.setValue(this.content.JOB_DATE)
    this.metalIssueDetailsForm.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.processCode.setValue(this.content.PROCESS_CODE)
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(this.content.PROCESS_NAME)
    this.metalIssueDetailsForm.controls.workerCode.setValue(this.content.WORKER_CODE)
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(this.content.WORKER_NAME)
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.metalIssueDetailsForm.controls.pcs.setValue(this.content.PCS)
    this.metalIssueDetailsForm.controls.subJobNo.setValue(this.content.JOB_SO_NUMBER)
    this.metalIssueDetailsForm.controls.subJobNoDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.metalIssueDetailsForm.controls.toStockCode.setValue(this.content.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(this.content.STOCK_DESCRIPTION);
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue(this.content.DIVCODE);
    this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(this.content.KARAT_CODE)
    this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
    this.metalIssueDetailsForm.controls.location.setValue(this.content.LOCATION_CODE);
    this.metalIssueDetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(this.content.EXCLUDE_TRANSFER_WT);
    this.metalIssueDetailsForm.controls.JOB_PCS.setValue(this.content.JOB_PCS);
    this.setValueWithDecimal('PURE_WT', this.content.PURE_WT, 'THREE')
    this.setValueWithDecimal('GROSS_WT', this.content.GROSS_WT, 'METAL')
    this.setValueWithDecimal('PURITY', this.content.PURITY, 'PURITY')
    this.setValueWithDecimal('NET_WT', this.content.NET_WT, 'THREE')
    this.setValueWithDecimal('KARAT', this.content.KARAT, 'THREE')
    this.setValueWithDecimal('STONE_WT', this.content.STONE_WT, 'STONE')
    this.setValueWithDecimal('jobPurity', this.content.JOB_PURITY, 'PURITY')

    this.tableData = [{
      DIVCODE: this.content.DIVCODE,
      STOCK_CODE: this.content.STOCK_CODE,
      METAL: this.content.GROSS_WT,
      STONE: this.content.STONE_WT,
    }]
  };
  locationCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(e.job_description);
    // this.metalIssueDetailsForm.controls.subJobNo.setValue(e.job_number);
    // this.metalIssueDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  stockCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(e.DIVISION_CODE);
    this.metalIssueDetailsForm.controls.pcs.setValue(e.PCS);
    this.metalIssueDetailsForm.controls.toStockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue(e.DIVISION_CODE);
    this.stockCodeValidate({target: {value: e.STOCK_CODE}})
  }


  processCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.processCode.setValue(e.Process_Code);
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(e.Description);
    this.workerCodeData.WHERECONDITION = `@strProcess='${e.Process_Code}',@blnActive='true'`
  }



  workerCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(e.WORKER_CODE);
    this.processCodeData.WHERECONDITION = `@strType='true',@strWorker='${e.WORKER_CODE}',@strCurrentUser='${this.comService.userName}'`
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }

  closed(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen = true;

  }


  onFileChangedimage(event: any) {
    this.imageurl = event.target.files[0]
    console.log(this.imageurl)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result;
      };
    }
  }
  onFileChanged(event: any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result;
      };
    }
  }
  changeJobClicked(){
    this.formSubmit('CONTINUE')
    this.metalIssueDetailsForm.reset()
  }
  resetStockDetails() { 
    this.metalIssueDetailsForm.controls.stockCode.setValue('')
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue('')
    this.metalIssueDetailsForm.controls.toStockCode.setValue('')
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue('')
    this.metalIssueDetailsForm.controls.DIVCODE.setValue('')
    this.metalIssueDetailsForm.controls.toDIVCODE.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }
  setPostData(){
    let form = this.metalIssueDetailsForm.value
    let currRate = this.comService.getCurrecnyRate(this.comService.compCurrency)

    return {
      "SRNO": this.comService.emptyToZero(this.content.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.nullToString(form.JOB_DATE),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.jobNumber),
      "UNQ_JOB_ID": this.comService.nullToString(form.subJobNo),
      "JOB_DESCRIPTION": this.comService.nullToString(form.jobNumDes),
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": this.comService.nullToString(form.DESIGN_CODE),
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SUB_STOCK_CODE": this.comService.nullToString(form.stockCode),
      "KARAT_CODE": this.comService.nullToString(form.KARAT_CODE),
      "JOB_PCS": form.JOB_PCS,
      "PCS": form.pcs,
      "GROSS_WT": form.GROSS_WT,
      "PURITY": form.PURITY,
      "PURE_WT": this.comService.emptyToZero(form.PURE_WT),
      "RATE_TYPE": '',
      "METAL_RATE": 0,
      "CURRENCY_CODE": this.comService.compCurrency,
      "CURRENCY_RATE": this.comService.emptyToZero(currRate),
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "TOTAL_RATEFC": 0,
      "TOTAL_RATELC": 0,
      "TOTAL_AMOUNTFC": this.comService.emptyToZero(form.totalAmountFc),
      "TOTAL_AMOUNTLC": this.comService.emptyToZero(form.totalAmountLc),
      "PROCESS_CODE": this.comService.nullToString(form.processCode),
      "PROCESS_NAME": this.comService.nullToString(form.processCodeDesc),
      "WORKER_CODE": this.comService.nullToString(form.workerCode),
      "WORKER_NAME": this.comService.nullToString(form.workerCodeDes),
      "UNQ_DESIGN_ID": this.comService.nullToString(form.UNQ_DESIGN_ID),
      "WIP_ACCODE": "",
      "UNIQUEID": this.comService.emptyToZero(form.uniqueId),
      "LOCTYPE_CODE": this.comService.nullToString(form.location),
      "AMOUNTFC": this.comService.emptyToZero(form.amountFc),
      "AMOUNTLC": this.comService.emptyToZero(form.amountLc),
      "PICTURE_NAME": this.comService.nullToString(form.pictureName),
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "MASTER_METAL": false || form.masterMetal,
      "STONE_WT": this.comService.emptyToZero(form.STONE_WT),
      "NET_WT": this.comService.emptyToZero(form.NET_WT),
      "DT_BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.comService.yearSelected,
      "TO_STOCK_CODE": this.comService.nullToString(form.toStockCode),
      "TO_STOCK_DESCRIPTION": this.comService.nullToString(form.toStockCodeDes),
      "PUDIFF": this.comService.emptyToZero(form.purityDiff),
      "JOB_PURITY": this.comService.emptyToZero(form.jobPurity),
      "EXCLUDE_TRANSFER_WT": form.EXCLUDE_TRANSFER_WT,
      "TO_DIVCODE": this.comService.nullToString(form.DIVCODE),
      "TO_PURITY": this.comService.nullToString(form.PURITY)
    }
  }
  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.comService.toastErrorByMsgId('Job number is required')
      return true
    }
    if (this.comService.nullToString(form.workerCode) == '') {
      this.comService.toastErrorByMsgId('Worker code is required')
      return true
    }
    if (this.comService.nullToString(form.processCode) == '') {
      this.comService.toastErrorByMsgId('Process code is required')
      return true
    }
    if (this.comService.nullToString(form.stockCode) == '') {
      this.comService.toastErrorByMsgId('Stock code is required')
      return true
    }
    if (this.comService.emptyToZero(form.GROSS_WT) == 0) {
      this.comService.toastErrorByMsgId('Gross weight is required')
      return true
    }
    return false
  }
  /**use: to save data to grid*/
  formSubmit(flag:any) {
    if (this.submitValidations(this.metalIssueDetailsForm.value)) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData()
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
    if (flag == 'CONTINUE'){
      this.resetStockDetails()
    }
  }
  masterMetalChange(event: any){
    console.log(event);
    console.log(event.target.checked);
    this.masterMetalChecked = event.target.checked
    
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.metalIssueDetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  stoneValidate(){
    if(this.calculateNetWt()){
      this.setValueWithDecimal('GROSS_WT',this.tableData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT',this.tableData[0].STONE, 'STONE')
    }
  }
  grossValidate(){
    if(this.calculateNetWt()){
      this.setValueWithDecimal('GROSS_WT',this.tableData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT',this.tableData[0].STONE, 'STONE')
    }
  }
  /**use: for stone wt and gross wt calculation */
  private calculateNetWt(): boolean{
    let form = this.metalIssueDetailsForm.value
    let GROSS_WT = this.comService.emptyToZero(form.GROSS_WT)
    let STONE_WT = this.comService.emptyToZero(form.STONE_WT)
    if(STONE_WT>GROSS_WT){
      this.comService.toastErrorByMsgId('Stone weight cannot be greater than gross weight')
      return true
    }
    this.setValueWithDecimal('NET_WT', GROSS_WT - STONE_WT, 'THREE')
    return false;
  }
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    // let postData = {
    //   "SPID": "028",
    //   "parameter": {
    //     'strBranchCode': this.comService.nullToString(this.branchCode),
    //     'strJobNumber': this.comService.nullToString(event.target.value),
    //     'strCurrenctUser': this.comService.nullToString(this.userName)
    //   }
    // }
    let postData = {
      "SPID": "064",
      "parameter": {
        'BRANCHCODE': this.comService.nullToString(this.branchCode),
        'JOBNO': this.comService.nullToString(event.target.value),
        'STRSHOWPROCESS': ''
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
            this.metalIssueDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalIssueDetailsForm.controls.jobNumDes.setValue(data[0].JOB_DESCRIPTION)
            this.subJobNumberValidate()
            this.metalIssueDetailsForm.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.metalIssueDetailsForm.controls.PART_CODE.setValue(data[0].PART_CODE)
            this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(data[0].KARAT_CODE)
            if(data[0].KARAT_CODE != ''){
            this.stockCodeData.WHERECONDITION = this.stockCodeData.WHERECONDITION+`AND KARAT_CODE='${data[0].KARAT_CODE}'` 
            }
            this.setValueWithDecimal('jobPurity',data[0].JOB_PURITY, 'PURITY')
          } else {
            this.metalIssueDetailsForm.controls.jobNumber.setValue('')
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
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.metalIssueDetailsForm.value.subJobNo,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': this.comService.nullToString(this.comService.userName),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.metalIssueDetailsForm.controls.subJobNoDes.setValue(data[0].DESCRIPTION)
          this.metalIssueDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalIssueDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.metalIssueDetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.metalIssueDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.metalIssueDetailsForm.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          this.metalIssueDetailsForm.controls.toStockCode.setValue(data[0].STOCK_CODE);
          this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(data[0].STOCK_DESCRIPTION);
          this.metalIssueDetailsForm.controls.toDIVCODE.setValue(data[0].DIVCODE);
          this.metalIssueDetailsForm.controls.masterMetal.setValue(false);
          this.comService.formControlSetReadOnly('toDIVCODE',true)
          this.comService.formControlSetReadOnly('toStockCode',true)
          this.comService.formControlSetReadOnly('toStockCodeDes',true)
          this.metalIssueDetailsForm.controls.workerCodeDes.setValue(data[0].WORKERDESC)
          this.metalIssueDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
          this.metalIssueDetailsForm.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          this.metalIssueDetailsForm.controls.JOB_PCS.setValue(data[0].PCS1)
          this.metalIssueDetailsForm.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)

          this.metalIssueDetailsForm.controls.pcs.setValue(data[0].PCS)
          this.setValueWithDecimal('PURE_WT', data[0].PURE_WT.toFixed(3), 'THREE')
          this.setValueWithDecimal('GROSS_WT', data[0].METAL, 'METAL')
          this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
          this.setValueWithDecimal('KARAT', data[0].KARAT, 'THREE')
          this.setValueWithDecimal('STONE_WT', data[0].STONE, 'STONE')
          this.setValueWithDecimal('NET_WT', data[0].METAL - data[0].STONE, 'THREE')
          let purityFlag = this.comService.getCompanyParamValue('ALLOWPURITYCHANGEINMETALISSUE')
          if(!purityFlag){
            this.stockCodeData.WHERECONDITION = this.stockCodeData.WHERECONDITION+`AND PURITY='${data[0].PURITY}'` 
          }
          this.FillMtlRequiredDetail()
          this.setStockCodeCondition()
          // this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(
          //   this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          // // this.stockCodeScrapValidate()
          this.metalIssueDetailsForm.controls.location.setValue(
            this.comService.allbranchMaster.DMFGMLOC
          )
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
        } else {
          this.metalIssueDetailsForm.controls.subJobNo.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setStockCodeCondition() {
    let form = this.metalIssueDetailsForm.value
    let val = `@strBranch_Code='${form.BRANCH_CODE}',`
    val += `@strJob_Number='${form.jobNumber}',@strUnq_Job_Id='${form.subJobNo}',`
    val += `@strMetalStone='',@strProcess_Code='',`
    val += `@strWorker_Code='',@strStock_Code='',@strUserName='${this.comService.userName}'`
    this.stockCodeData.WHERECONDITION = val
  }
  stockCodeValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "046",
      "parameter": {
        strStockCode:  event.target.value,                                                  
        strBranchCode:  this.comService.nullToString(this.branchCode),                                      
        strVocType:  this.content.HEADERDETAILS.VOCTYPE,                                                  
        strUserName:  this.comService.nullToString(this.userName),                                         
        strLocation:  '',                                                
        strPartyCode:   '',                                                  
        strVocDate:   this.comService.formatDateTime(this.comService.currentDate)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data) {
           console.log(data,'data');
            
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
  FillMtlRequiredDetail(){
    let postData = {
      "SPID": "056",
      "parameter": {
        'strjob_Number': this.metalIssueDetailsForm.value.jobNumber,
        'strUnq_Job_Id': this.metalIssueDetailsForm.value.subJobNo,
        'strBranch_Code': this.comService.nullToString(this.branchCode),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          this.tableData = result.dynamicData[0]
        }
      }
    )
    this.subscriptions.push(Sub)
  }


}






