import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-return-details',
  templateUrl: './metal-return-details.component.html',
  styleUrls: ['./metal-return-details.component.scss']
})
export class MetalReturnDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @ViewChild('overlayjobNumberSearch') overlayjobNumberSearch!: MasterSearchComponent;
  @ViewChild('overlayprocessCodeSearch') overlayprocessCodeSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerCodeSearch') overlayworkerCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaylocationSearch') overlaylocationSearch!: MasterSearchComponent;
  @ViewChild('overlaystockCodeSearch') overlaystockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlayReturnToStockCodeSearch') overlayReturnToStockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaysubjobnoSearch') public overlaysubjobnoSearch!: MasterSearchComponent;
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  currentFilter: any;
  editMode: boolean = false;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [''];
  branchCode?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  userName = localStorage.getItem('username');
  data: any;
  subJoBDetailData: any[] = [];

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 201,
    SEARCH_FIELD: 'PROCESS_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 201,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'WORKER CODE',
    WHERECONDITION: "WORKER_CODE<>''",
    SEARCH_VALUE: '',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
  jobnoCodeData: MasterSearchModel = {
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
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 257,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true

  }
  returnToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  // stockCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 257,
  //   SEARCH_FIELD: 'STOCK_CODE',
  //   SEARCH_HEADING: 'Stock Search',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: `@strUserName='',@strJob_Number='',@strUnq_Job_Id='',@strMetalStone='',@strStock_Code='',@strBranch_Code='${this.comService.branchCode}'`,
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  //   LOAD_ONCLICK: true,
  //   FRONTENDFILTER: true
  // }

  subJobNoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 275,
    SEARCH_FIELD: 'UNQ_JOB_ID',
    SEARCH_HEADING: 'Sub Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `isnull(WAX_STATUS,'') <> 'I' AND  UNQ_JOB_ID <> '' and Branch_code = '${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  setSubJobCondition() {
    let form = this.metalReturnDetailsForm.value;
    this.subJobNoCodeData.WHERECONDITION = `isnull(WAX_STATUS,'') <> 'I'  AND  UNQ_JOB_ID <> '' and Branch_code = '${this.comService.branchCode}'`
    this.subJobNoCodeData.WHERECONDITION += `and job_number='${this.comService.nullToString(form.jobNumber)}'`
  }
  // stockCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 51,
  //   SEARCH_FIELD: 'STOCK_CODE',
  //   SEARCH_HEADING: 'Stock Search',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "DIVISION='G' AND SUBCODE=0 ",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  //   LOAD_ONCLICK: true
  // }

  metalReturnDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: ['', [Validators.required]],
    processCodeDesc: [''],
    workerCode: ['', [Validators.required]],
    workerCodeDesc: [''],
    designCode: [''],
    PART_CODE: [''],
    makingRateFc: [''],
    makingRateLc: [''],
    makingAmountLC: [''],
    makingAmountFC: [''],
    treeNumber: [''], // no
    location: ['', [Validators.required]],
    stockCode: ['', [Validators.required]],
    stockCodeDesc: [''],
    ReturnToStockCode: [''],
    ReturnToStockCodeDesc: [''],
    pcs: [''],
    PURITY: [''],
    GROSS_WT: [''],
    NET_WT: [''],
    STONE_WT: [''],
    PURE_WT: [''],
    KARAT: [''],
    remarks: [''],
    metalGramRateFc: [''],
    metalGramRateLc: [''],
    metalAmountFc: [''],
    metalAmountLc: [''],
    totalRateFc: [''],
    purityDiff: [''],
    totalRateLc: [''],
    JOB_PCS: [''],
    jobPcsDate: [''],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    KARAT_CODE: [''],
    DIVISION_CODE: [''],
    DIVCODE: [''],
    METAL_STONE: [''],
    UNQ_JOB_ID: [''],
    JOB_SO_NUMBER: [''],
    FLAG: [null]
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
    private renderer: Renderer2,

  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#jobNumberCode')?.focus();
    if (this.content) {
      this.setInitialValue()

      this.metalReturnDetailsForm.controls.FLAG.setValue(this.content.FLAG)
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      }
    }
    // this.setLookup201WhereCondition();
    // this.setLookupStockCodeWhereCondition();
    this.setOnLoadDetails()
  }

  setInitialValue() {
    console.log(this.content, 'content');
    if (!this.content) return;
    let branchParam = this.comService.allbranchMaster
    // this.metalReturnDetailsForm.controls.location.setValue(branchParam.DMFGMLOC)
    this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;
    this.metalReturnDetailsForm.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.metalReturnDetailsForm.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.metalReturnDetailsForm.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.vocDate)
    this.metalReturnDetailsForm.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.metalReturnDetailsForm.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.metalReturnDetailsForm.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.metalReturnDetailsForm.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.metalReturnDetailsForm.controls.jobDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalReturnDetailsForm.controls.subJobNo.setValue(this.content.UNQ_JOB_ID)
    this.metalReturnDetailsForm.controls.subJobNoDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalReturnDetailsForm.controls.processCode.setValue(this.content.PROCESS_CODE)
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(this.content.PROCESS_NAME)
    this.metalReturnDetailsForm.controls.workerCode.setValue(this.content.WORKER_CODE)
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(this.content.WORKER_NAME)
    this.metalReturnDetailsForm.controls.designCode.setValue(this.content.DESIGN_CODE)
    this.metalReturnDetailsForm.controls.pcs.setValue(this.content.PCS)
    this.metalReturnDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(this.content.STOCK_DESCRIPTION)
    this.metalReturnDetailsForm.controls.PART_CODE.setValue(this.content.PART_CODE)
    this.metalReturnDetailsForm.controls.KARAT_CODE.setValue(this.content.KARAT_CODE)
    this.metalReturnDetailsForm.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.metalReturnDetailsForm.controls.remarks.setValue(this.content.WIP_ACCODE)
    this.metalReturnDetailsForm.controls.JOB_PCS.setValue(this.content.CURRENCY_RATE)
    this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(this.content.RETURN_STOCK)
    this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(this.content.UNQ_DESIGN_ID)


    this.setValueWithDecimal('PURE_WT', this.content.PUREWT, 'THREE')
    this.setValueWithDecimal('GROSS_WT', this.content.GROSS_WT, 'METAL')
    this.setValueWithDecimal('PURITY', this.content.PURITY, 'PURITY')
    this.setValueWithDecimal('NET_WT', this.content.NET_WT, 'THREE')
    this.setValueWithDecimal('KARAT', this.content.KARAT, 'THREE')
    this.setValueWithDecimal('STONE_WT', this.content.STONE_WT, 'STONE')
  };
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.metalReturnDetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  // setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
  //   if (isNaN(value) || value === null || value === undefined) {
  //     console.error(`Invalid value for ${formControlName}:`, value);
  //     value = 0; // Or handle appropriately, e.g., `return;` if you don't want to set a default
  //   }

  //   this.metalReturnDetailsForm.controls[formControlName].setValue(
  //     this.comService.setCommaSerperatedNumber(value, Decimal)
  //   );
  // }
  setOnLoadDetails() {
    let branchParam = this.comService.allbranchMaster;
    // Set LOCTYPE_CODE only if it's not already set
    if (!this.metalReturnDetailsForm.controls.location.value) {
      this.metalReturnDetailsForm.controls.location.setValue(branchParam.DMFGMLOC);
    }
  }
  // setLookup201WhereCondition() {
  //   let form = this.metalReturnDetailsForm.value
  //   let where = `@strBranch_Code='${form.BRANCH_CODE}',`
  //   where += `@strJob_Number='${form.jobNumber}',@strUnq_Job_Id='${form.subJobNo}'`
  //   where += `@strMetalStone='${form.METAL_STONE}',@strStock_Code='${form.stockCode}',@strUserName='${this.comService.userName}'`
  //   this.stockCodeData.WHERECONDITION = where
  //   this.ProcessCodeData.WHERECONDITION = where
  //   this.WorkerCodeData.WHERECONDITION = where
  // }

  setLookup201WhereCondition() {
    let form = this.metalReturnDetailsForm.value;

    // Construct the WHERE condition without '@' symbols
    let where = `@strBranch_Code='${form.BRANCH_CODE}', `;
    where += `@strJob_Number='${form.jobNumber}',`;
    where += `@strUnq_Job_Id='${form.subJobNo}',`;
    where += `@strMetalStone='${form.METAL_STONE}', `;
    where += `@strStock_Code='${form.stockCode}', `;
    where += `@strUserName='${this.comService.userName}'`;

    // Assign to the stock code data
    this.ProcessCodeData.WHERECONDITION = where;
    this.WorkerCodeData.WHERECONDITION = where;
    this.stockCodeData.WHERECONDITION = where;

  }

  // setLookupStockCodeWhereCondition() {
  //   let form = this.metalReturnDetailsForm.value;

  //   // Construct the WHERE condition without '@' symbols
  //   let where = `@strBranch_Code='${form.BRANCH_CODE}', `;
  //   where += `@strJob_Number='${form.jobNumber}',`;
  //   where += `@strUnq_Job_Id='${form.subJobNo}',`;
  //   where += `@strMetalStone='${form.METAL_STONE}', `;
  //   where += `@strStock_Code='${form.stockCode}', `;
  //   where += `@strUserName='${this.comService.userName}'`;

  //   // Assign to the stock code data
  //   this.stockCodeData.WHERECONDITION = where;
  // }
  setLookupStockCodeWhereCondition() {
    let form = this.metalReturnDetailsForm.value;
    this.stockCodeData.WHERECONDITION = `@strBranchCode='${this.comService.nullToString(form.BRANCH_CODE)}',`
    this.stockCodeData.WHERECONDITION += `@strSubJobNumber='${this.comService.nullToString(form.subJobNo)}',`
    this.stockCodeData.WHERECONDITION += `@strWorkerCode='${this.comService.nullToString(form.workerCode)}',`
    this.stockCodeData.WHERECONDITION += `@strStockCode='${this.comService.nullToString(form.stockCode)}'`
  }

  stoneValidate() {
    if (this.calculateNetWt()) {
      this.setValueWithDecimal('GROSS_WT', this.subJoBDetailData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT', this.subJoBDetailData[0].STONE, 'STONE')
    }
  }
  grossValidate() {
    if (this.calculateNetWt()) {
      this.setValueWithDecimal('GROSS_WT', this.subJoBDetailData[0].METAL, 'METAL')
      this.setValueWithDecimal('STONE_WT', this.subJoBDetailData[0].STONE, 'STONE')
    }
  }
  /**use: for stone wt and gross wt calculation */
  // private calculateNetWt(): boolean {
  //   let form = this.metalReturnDetailsForm.value
  //   let GROSS_WT = this.comService.emptyToZero(form.GROSS_WT)
  //   let STONE_WT = this.comService.emptyToZero(form.STONE_WT)
  //   if (STONE_WT > GROSS_WT) {
  //     this.comService.toastErrorByMsgId('MSG1844')//Stone weight cannot be greater than gross weight
  //     return true
  //   }
  //   this.setValueWithDecimal('NET_WT', GROSS_WT - STONE_WT, 'THREE')
  //   return false;
  // }

  /**use: for stone wt, gross wt, and pure wt calculation */
  private calculateNetWt(): boolean {
    let form = this.metalReturnDetailsForm.value;
    let GROSS_WT = this.comService.emptyToZero(form.GROSS_WT);
    let STONE_WT = this.comService.emptyToZero(form.STONE_WT);
    let PURITY = this.comService.emptyToZero(form.PURITY);

    if (STONE_WT > GROSS_WT) {
      this.comService.toastErrorByMsgId('MSG1844'); // Stone weight cannot be greater than gross weight
      return true;
    }

    // Calculate NET_WT
    let NET_WT = GROSS_WT - STONE_WT;
    this.setValueWithDecimal('NET_WT', NET_WT, 'THREE');

    // Calculate PURE_WT as NET_WT * PURITY
    let PURE_WT = NET_WT * PURITY;
    this.setValueWithDecimal('PURE_WT', PURE_WT, 'THREE');

    return false;
  }

  WorkerCodeSelected(e: any) {
    console.log("sdgf")
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER);
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(e.WORKERDESC);
    this.setLookup201WhereCondition()
  }
  locationCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.location.setValue(e.LOCATION_CODE);
    this.setLookup201WhereCondition()
  }
  jobnoCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalReturnDetailsForm.controls.jobDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  ProcessCodeSelected(e: any) {
    console.log(e, 'process')
    this.metalReturnDetailsForm.controls.processCode.setValue(e.PROCESS);
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(e.PROCESSDESC);
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER);
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(e.WORKERDESC);
    this.processCodeValidate()
    // this.setLookup201WhereCondition()
    // this.setLookupStockCodeWhereCondition()
    // this.ProcessCodeData.WHERECONDITION = `@strBranch_Code='${this.comService.userName}'',@strJob_Number='${this.jobNumberData}'`
  }

  stockCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(e.STOCKDESC);
    // this.setLookup201WhereCondition()
    this.setLookupStockCodeWhereCondition();
    this.stockCodeValidate()
  }
  ReturnTostockCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(e.DESCRIPTION.toUpperCase());
    this.setLookup201WhereCondition()
    // this.setLookupStockCodeWhereCondition();
  }

  subJobNoCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.subJobNo.setValue(e.UNQ_JOB_ID);
    this.metalReturnDetailsForm.controls.subJobNoDes.setValue(e.PART_CODE);
    this.subJobNumberValidate()
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.closeDetail.emit()
    // this.activeModal.close(data);
  }


  isStockCodeDuplicate(stockCode: string): boolean {
    // Get the current list of stock codes from the form array
    const stockCodes = this.metalReturnDetailsForm.get('details')?.value.map((item: any) => item.stockCode) || [];

    // Check if the provided stockCode already exists in the array
    return stockCodes.includes(stockCode);
  }


  performReset() {
    const currentStockCode = this.metalReturnDetailsForm.value.stockCode;

    if (this.isStockCodeDuplicate(currentStockCode)) {
      Swal.fire({
        title: 'Duplicate Stock Code',
        text: 'This Stock Code entry is already available in detail. Do you wish to continue?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, continue',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.resetStockDetails(); // Proceed with clearing the stock details
        }
      });
    } else {
      this.resetStockDetails(); // Proceed if no duplicate
    }
  }


  resetStockDetails() {
    this.metalReturnDetailsForm.controls.stockCode.setValue('')
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue('')
    this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue('')
    this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue('')
    this.metalReturnDetailsForm.controls.pcs.setValue('')
    this.metalReturnDetailsForm.controls.JOB_PCS.setValue('')
    this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
  }
  setPostData() {
    let form = this.metalReturnDetailsForm.value
    return {
      "SRNO": this.comService.emptyToZero(this.content.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.comService.nullToString(form.subJobNo),
      "JOB_DESCRIPTION": form.subJobNoDes,
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": form.designCode,
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDesc),
      "SUB_STOCK_CODE": "0",
      "KARAT_CODE": this.comService.nullToString(form.KARAT_CODE),
      "PCS": this.comService.nullToString(form.pcs),
      "GROSS_WT": this.comService.nullToString(form.GROSS_WT),
      "PURITY": this.comService.nullToString(form.PURITY),
      "PURE_WT": this.comService.nullToString(form.PURE_WT),
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": this.comService.emptyToZero(form.JOB_PCS),
      "METAL_GRM_RATEFC": this.comService.emptyToZero(form.metalGramRateFc),
      "METAL_GRM_RATELC": this.comService.emptyToZero(form.metalGramRateLc),
      "METAL_AMOUNTFC": this.comService.emptyToZero(form.metalAmountFc),
      "METAL_AMOUNTLC": this.comService.emptyToZero(form.metalAmountLc),
      "MAKING_RATEFC": this.comService.emptyToZero(form.makingRateFc),
      "MAKING_RATELC": this.comService.emptyToZero(form.makingRateLc),
      "MAKING_AMOUNTFC": this.comService.emptyToZero(form.makingAmountFC),
      "MAKING_AMOUNTLC": this.comService.emptyToZero(form.makingAmountFC),
      "TOTAL_RATEFC": this.comService.emptyToZero(form.totalRateFc),
      "TOTAL_RATELC": this.comService.emptyToZero(form.totalRateLc),
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "PROCESS_CODE": this.comService.nullToString(form.processCode),
      "PROCESS_NAME": this.comService.nullToString(form.processCodeDesc),
      "WORKER_CODE": this.comService.nullToString(form.workerCode),
      "WORKER_NAME": this.comService.nullToString(form.workerCodeDesc),
      "UNQ_DESIGN_ID": this.comService.nullToString(form.ReturnToStockCodeDesc),
      "WIP_ACCODE": this.comService.nullToString(form.remarks),
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.location),
      "RETURN_STOCK": this.comService.nullToString(form.ReturnToStockCode),
      "SUB_RETURN_STOCK": "",
      "STONE_WT": this.comService.emptyToZero(form.STONE_WT),
      "NET_WT": this.comService.emptyToZero(form.NET_WT),
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "DT_BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": form.YEARMONTH,
      "PUDIFF": 0,
      "JOB_PURITY": 0
    }
  }

  // jobNumber: ['', [Validators.required]],
  // processCode: ['', [Validators.required]],
  // workerCode: ['', [Validators.required]],
  // location: ['', [Validators.required]],
  // stockCode: ['', [Validators.required]],

  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
      this.comService.toastErrorByMsgId('MSG1358') //"jobNumber cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.processCode) == '') {
      this.comService.toastErrorByMsgId('MSG1680')//"processCode cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.workerCode) == '') {
      this.comService.toastErrorByMsgId('MSG1951')//"workerCode cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.location) == '') {
      this.comService.toastErrorByMsgId('MSG1381')//"location cannot be empty"
      return true
    }
    else if (this.comService.nullToString(form.stockCode) == '') {
      this.comService.toastErrorByMsgId('MSG1817')//"stockCode cannot be empty"
      return true
    }
    return false;
  }
  /**use: to save data to grid*/
  // formSubmit(flag: any) {
  //   if (this.submitValidations(this.metalReturnDetailsForm.value)) return;
  //   //if (this.submitValidations()) return;
  //   let dataToparent = {
  //     FLAG: flag,
  //     POSTDATA: this.setPostData()
  //   }
  //   // this.close(postData);
  //   this.saveDetail.emit(dataToparent);
  //   if (flag == 'CONTINUE') {
  //     this.resetStockDetails()
  //   }
  // }
  @Input() metalReturnDetailsData: any[] = [];

  formSubmit(flag: any) {
    const formData = this.metalReturnDetailsForm.value;

    // Check if stock code already exists in the grid
    // const stockCodeExists = this.metalReturnDetailsData.some(item => item.JOB_NUMBER === formData.jobNumber);

    // if (stockCodeExists) {
    //   // Show confirmation message if stock code already exists
    //   const userConfirmed = confirm("This stock code entry is already available in detail. Do you wish to continue?");

    //   if (!userConfirmed) {
    //     return; // Stop further execution if user doesn't confirm
    //   }
    // }

    if (this.submitValidations(formData)) return;

    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData()
    };

    this.saveDetail.emit(dataToparent);

    if (flag == 'CONTINUE') {
      this.resetStockDetails();
    }
  }


  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.WORKER_CODE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' + this.metalReturnDetailsForm.value.BRANCH_CODE + this.metalReturnDetailsForm.value.VOCTYPE + this.metalReturnDetailsForm.value.VOCNO + this.metalReturnDetailsForm.value.yearMoth;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.metalReturnDetailsForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.metalReturnDetailsForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.comService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }


  jobNumberData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.PREFIX_CODE);
  }
  WorkerCodeValidate(event?: any) {
    this.showOverleyPanel(event, 'workerCode'); // Show overlay panel initially
    const form = this.metalReturnDetailsForm.value;

    // Set up any necessary conditions
    this.setLookup201WhereCondition();

    const postData = {
      SPID: "103",
      parameter: {
        strBranch_Code: this.comService.nullToString(form.BRANCH_CODE),
        strJob_Number: this.comService.nullToString(form.jobNumber),
        strUnq_Job_Id: this.comService.nullToString(form.subJobNo),
        strMetalStone: 'M',
        strProcess_Code: this.comService.nullToString(form.processCode),
        strWorker_Code: this.comService.nullToString(form.workerCode),
        strStock_Code: this.comService.nullToString(form.stockCode),
        strUserName: this.comService.nullToString(form.userName),
      }
    };

    this.comService.showSnackBarMsg('MSG81447');

    const Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();

        if (result.dynamicData && result.dynamicData[0].length > 0) {
          // Set the worker description based on valid data
          const validData = result.dynamicData[0][0]; // Assuming the first item contains the relevant data
          this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(validData.WORKERDESC.toUpperCase());

        } else {
          this.overlayworkerCodeSearch.closeOverlayPanel();
          this.metalReturnDetailsForm.controls.workerCode.setValue('');
          this.comService.toastErrorByMsgId('MSG1531');
          this.showOverleyPanel(event, 'workerCode');
        }
      }, err => {
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531');
      });

    this.subscriptions.push(Sub);
  }

  processCodeValidate(event?: any) {
    this.showOverleyPanel(event, 'processCode');
    const form = this.metalReturnDetailsForm.value;

    // Check if the `processCode` field is empty
    if (!form.processCode || form.processCode.trim() === '') {
      this.metalReturnDetailsForm.controls.processCodeDesc.setValue('');
      this.metalReturnDetailsForm.controls.stockCode.setValue('');
      this.metalReturnDetailsForm.controls.stockCodeDesc.setValue('');
      this.metalReturnDetailsForm.controls.workerCode.setValue('');
      this.metalReturnDetailsForm.controls.workerCodeDesc.setValue('');
      this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue('');
      this.metalReturnDetailsForm.controls.PURE_WT.setValue('');
      this.metalReturnDetailsForm.controls.PURITY.setValue('');
      this.metalReturnDetailsForm.controls.GROSS_WT.setValue('');
      this.metalReturnDetailsForm.controls.NET_WT.setValue('');
      this.metalReturnDetailsForm.controls.pcs.setValue('');
      return;
    }

    // Show overlay panel
    this.showOverleyPanel(event, 'processCode');

    // Set up any necessary conditions
    this.setLookup201WhereCondition();

    const postData = {
      SPID: "103",
      parameter: {
        'strBranch_Code': this.comService.nullToString(form.BRANCH_CODE),
        'strJob_Number': this.comService.nullToString(form.jobNumber),
        'strUnq_Job_Id': this.comService.nullToString(form.subJobNo),
        'strMetalStone': 'M',
        'strProcess_Code': this.comService.nullToString(form.processCode),
        'strWorker_Code': this.comService.nullToString(form.workerCode),
        'strStock_Code': this.comService.nullToString(form.stockCode),
        'strUserName': this.comService.nullToString(form.userName),
      }
    };

    this.comService.showSnackBarMsg('MSG81447');

    const Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();

        if (result.status === "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0];
          console.log(data);
          if (data && result.dynamicData[0][0]) {
            // Set values based on valid data
            const data = result.dynamicData[0][0];
            console.log(data, 'data');
            this.metalReturnDetailsForm.controls.processCodeDesc.setValue(data.PROCESSDESC.toUpperCase());
            this.metalReturnDetailsForm.controls.stockCode.setValue(data.STOCK_CODE);
            this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(data.STOCKDESC.toUpperCase());
            this.metalReturnDetailsForm.controls.workerCode.setValue(data.WORKER.toUpperCase());
            this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(data.WORKERDESC.toUpperCase());
            this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(data.SUB_STOCK_CODE);
            this.metalReturnDetailsForm.controls.PURE_WT.setValue(data.PUREWT);
            this.metalReturnDetailsForm.controls.PURITY.setValue(data.PURITY);
            this.metalReturnDetailsForm.controls.GROSS_WT.setValue(data.METAL);
            this.metalReturnDetailsForm.controls.DIVISION_CODE.setValue(data.DIVCODE);
            this.metalReturnDetailsForm.controls.NET_WT.setValue(data.NETWT);
            this.metalReturnDetailsForm.controls.pcs.setValue(data.PCS);
            this.setValueWithDecimal('PURE_WT', data.PUREWT, 'THREE')
            this.setValueWithDecimal('PURITY', data.PURITY, 'PURITY')
            this.setValueWithDecimal('GROSS_WT', data.METAL, 'METAL')
            this.setValueWithDecimal('NET_WT', data.NETWT, 'THREE')
          }
          else {
            this.overlayprocessCodeSearch.closeOverlayPanel();
            this.metalReturnDetailsForm.controls.processCode.setValue('');
            this.metalReturnDetailsForm.controls.processCodeDesc.setValue('');
            this.comService.toastErrorByMsgId('MSG1531'); // Show error message
            this.showOverleyPanel(event, 'processCode'); // Show overlay for correction
          }
        }
      }, err => {
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531'); // Show error if request fails
      });

    this.subscriptions.push(Sub);
  }

  toreturnstockcodevalidate(event?: any) {
    this.showOverleyPanel(event, 'ReturnToStockCode'); // Show the lookup panel initially
  
    const postData = {
      SPID: "180",
      parameter: {
        StockCode: this.metalReturnDetailsForm.value.stockCode,
        KaratCode: this.metalReturnDetailsForm.value.KARAT_CODE,
        Division: this.metalReturnDetailsForm.value.DIVISION_CODE,
      }
    };
  
    const Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe(
        (result) => {
          this.comService.closeSnackBarMsg();
  
          if (result.dynamicData && result.dynamicData[0].length > 0) {
            let data = result.dynamicData[0];
            console.log(data, 'data');
  
            if (data && data[0]) {
              this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(data[0].STOCK_CODE);
              this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(data[0].DESCRIPTION.toUpperCase());
            }
          } else {
            // Invalid data handling
            this.overlayReturnToStockCodeSearch.closeOverlayPanel(); // Ensure it's closed first
            this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue('');
            this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue('');
            this.comService.toastErrorByMsgId('Invalid Stock Code');
            
          }
        },
        (err) => {
          this.comService.closeSnackBarMsg();
          this.comService.toastErrorByMsgId('Error validating Stock Code'); // Error toast
        }
      );
  
    this.subscriptions.push(Sub);
  }
  

  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "169",
      "parameter": {
        'unq_job_id': this.metalReturnDetailsForm.value.subJobNo,
        'strBranch': this.comService.nullToString(this.comService.branchCode),
        'JobNumber': this.metalReturnDetailsForm.value.jobNumber,
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data, 'data')
          this.subJoBDetailData = data
          // this.metalReturnDetailsForm.controls.subJobNo.setValue(data[0].unq_job_id)
          // this.metalReturnDetailsForm.controls.subJobNoDes.setValue(data[0].part_code)
          // this.metalReturnDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          // this.metalReturnDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          // this.metalReturnDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(data[0].STOCK_DESCRIPTION)
          // this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(data[0].STOCK_CODE)
          // this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(data[0].STOCK_DESCRIPTION)
          // this.metalReturnDetailsForm.controls.pcs.setValue(data[0].PCS)
          // // this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(data[0].WORKERDESC)
          // // this.metalReturnDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          // // this.metalReturnDetailsForm.controls.location.setValue(data[0].LOCTYPE_CODE)
          // this.metalReturnDetailsForm.controls.designCode.setValue(data[0].DESIGN_CODE)
          // this.metalReturnDetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.metalReturnDetailsForm.controls.JOB_PCS.setValue(data[0].PCS1)
          // this.metalReturnDetailsForm.controls.METAL_STONE.setValue(data[0].METAL_STONE)
          // this.metalReturnDetailsForm.controls.PURITY.setValue(data[0].PURITY)

          this.setValueWithDecimal('PURE_WT', data[0].PUREWT, 'THREE')
          this.setValueWithDecimal('GROSS_WT', data[0].METAL, 'METAL')
          this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
          this.setValueWithDecimal('KARAT', data[0].KARAT, 'THREE')
          this.setValueWithDecimal('STONE_WT', data[0].STONE, 'STONE')
          this.setValueWithDecimal('NET_WT', data[0].METAL - data[0].STONE, 'THREE')
          this.setLookup201WhereCondition()
          // this.setLookupStockCodeWhereCondition();
          // this.processCodeValidate()

        } else {
          // Handle case where no data is found
          this.comService.toastErrorByMsgId('MSG1531');
          this.metalReturnDetailsForm.controls.subJobNo.setValue('');
          this.metalReturnDetailsForm.controls.subJobNoDes.setValue('');
          // this.showOverleyPanel(event, 'subjobnumber');
        }
      },
        (err) => {
          // Error handling
          this.comService.closeSnackBarMsg();
          this.comService.toastErrorByMsgId('MSG1531');
        }
      );
    this.subscriptions.push(Sub);
  }
  jobNumberValidate(event: any) {
    this.showOverleyPanel(event, 'jobNumber')
    if (this.viewMode) return;
    if (event.target.value == '') return
    // let postData = {
    //   "SPID": "064",
    //   "parameter": {
    //     'BRANCHCODE': this.comService.nullToString(this.branchCode),
    //     'JOBNO': this.comService.nullToString(event.target.value),
    //   }
    // }
    this.subJobNoCodeData.WHERECONDITION = `
    Job_Number = '${this.metalReturnDetailsForm.controls.subJobNo.value}'
    and Branch_code = '${this.comService.branchCode}'
    AND isnull(WAX_STATUS, '') <> 'I' AND  UNQ_JOB_ID <> ''
  `;
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
            // this.overlayjobNumberSearch.closeOverlayPanel()
            this.jobNumberDetailData = data
            this.metalReturnDetailsForm.controls.jobDes.setValue(data[0].DESCRIPTION.toUpperCase())
            this.metalReturnDetailsForm.controls.subJobNoDes.setValue(data[0].DESCRIPTION?.toUpperCase())
            this.metalReturnDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalReturnDetailsForm.controls.PART_CODE.setValue(data[0].PART_CODE)
            this.metalReturnDetailsForm.controls.KARAT_CODE.setValue(data[0].KARAT_CODE)
            this.metalReturnDetailsForm.controls.designCode.setValue(data[0].DESIGN_CODE)
            this.metalReturnDetailsForm.controls.JOB_PCS.setValue(data[0].JOB_PCS_TOTAL)
            this.setSubJobCondition()
            this.setLookup201WhereCondition()
            this.subJobNumberValidate()

          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.metalReturnDetailsForm.controls.jobNumber.setValue('')
            this.showOverleyPanel(event, 'jobNumber')

          }
        } else {
          this.overlayjobNumberSearch.closeOverlayPanel()
          this.metalReturnDetailsForm.controls.jobNumber.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        } return
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  stockCodeValidate(event?: any) {
    if (this.viewMode) return;
    if (event && event.target.value == '') {
      this.showOverleyPanel(event, 'stockCode');
      return
    };
    this.setLookupStockCodeWhereCondition()
    let postData = {
      "SPID": "046",
      "parameter": {
        strStockCode: this.comService.nullToString(this.metalReturnDetailsForm.value.stockCode),
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
              // this.overlaystockCodeSearch.closeOverlayPanel();
              // this.toreturnstockcodevalidate()
            } else {
              this.comService.toastErrorByMsgId('MSG1531');
              this.metalReturnDetailsForm.controls.stockCode.setValue('');
              this.showOverleyPanel(event, 'stockCode');
            }
          } else {
            this.comService.toastErrorByMsgId('MSG1531');
            this.metalReturnDetailsForm.controls.stockCode.setValue('');
            this.showOverleyPanel(event, 'stockCode');
          }
        } else {
          this.comService.toastErrorByMsgId('MSG1747');
          this.metalReturnDetailsForm.controls.stockCode.setValue('');
          this.overlaystockCodeSearch.closeOverlayPanel();
        }
      }, err => {
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531');
        this.metalReturnDetailsForm.controls.stockCode.setValue('');
        this.showOverleyPanel(event, 'stockCode');
      });

    this.subscriptions.push(Sub);
  }

  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    const inputValue = event.target.value.toUpperCase();
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        // this.isDisableSaveBtn = false;
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.metalReturnDetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'location') {
            this.showOverleyPanel(event, FORMNAME);
          }
          if (FORMNAME === 'ReturnToStockCode') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }


        // const matchedItem = data.find((item: any) => item.CODE.toUpperCase() === inputValue);
        // if (matchedItem) {
        //   this.diamondlabourMasterForm.controls[FORMNAME].setValue(matchedItem.CODE);
        // if (FORMNAME === 'process') {
        //   this.processWorkerValidate()
        // }
        // } else {
        //   this.handleLookupError(FORMNAME, LOOKUPDATA);
        // }

      }, err => {


        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  showOverleyPanel(event: any, formControlName: string) {
    let value = this.metalReturnDetailsForm.value[formControlName]
    if (this.comService.nullToString(value) != '') return;

    switch (formControlName) {
      case 'jobNumber':
        this.overlayjobNumberSearch.showOverlayPanel(event);
        break;
      case 'processCode':
        this.overlayprocessCodeSearch.showOverlayPanel(event);
        break;
      case 'workerCode':
        this.overlayworkerCodeSearch.showOverlayPanel(event);
        break;
      case 'location':
        this.overlaylocationSearch.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaystockCodeSearch.showOverlayPanel(event);
        break;
      case 'ReturnToStockCode':
        this.overlayReturnToStockCodeSearch.showOverlayPanel(event);
        break;
      case 'subjobnumber':
        this.overlaysubjobnoSearch.showOverlayPanel(event);
        break;
      default:

    }
  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {

  //   LOOKUPDATA.SEARCH_VALUE = event.target.value

  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.comService.toastInfoByMsgId('MSG81447');
  //   let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
  //   let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
  //     .subscribe((result) => {
  //       //this.isDisableSaveBtn = false;
  //       let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.comService.toastErrorByMsgId('MSG1531')
  //         this.metalReturnDetailsForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         if (FORMNAME === 'location' || FORMNAME === 'ReturnToStockCode') {
  //           this.showOverleyPanel(event, FORMNAME);
  //         }
  //         return
  //       }
  //       //this.alloyMasterFormChecks(FORMNAME)// for validations
  //     }, err => {
  //       this.comService.toastErrorByMsgId('MSG1531')
  //     })
  //   this.subscriptions.push(Sub)

  //   // LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   // if (event.target.value == '' || this.viewMode == true) return
  //   // let param = {
  //   //   LOOKUPID: LOOKUPDATA.LOOKUPID,
  //   //   WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   // }
  //   // this.comService.showSnackBarMsg('MSG81447');
  //   // let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   // let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //   //   .subscribe((result) => {
  //   //     this.comService.closeSnackBarMsg()
  //   //     let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
  //   //     if (data.length == 0) {
  //   //       this.comService.toastErrorByMsgId('MSG1531')
  //   //       this.metalReturnDetailsForm.controls[FORMNAME].setValue('')
  //   //       LOOKUPDATA.SEARCH_VALUE = ''
  //   //       if ( FORMNAME === 'location' || FORMNAME === 'ReturnToStockCode') {
  //   //         this.showOverleyPanel(event, FORMNAME);
  //   //       }
  //   //       return
  //   //     }
  //   //   }, err => {
  //   //     this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
  //   //   })
  //   // this.subscriptions.push(Sub)
  // }
}
