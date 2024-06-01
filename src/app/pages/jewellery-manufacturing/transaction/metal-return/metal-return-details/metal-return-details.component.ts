import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-return-details',
  templateUrl: './metal-return-details.component.html',
  styleUrls: ['./metal-return-details.component.scss']
})
export class MetalReturnDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  currentFilter: any;
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
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
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
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
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
  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 201,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

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
    DIVCODE: [''],
    METAL_STONE: [''],
    UNQ_JOB_ID: [''],
    FLAG: [null]
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    if (this.content) {
      this.metalReturnDetailsForm.controls.FLAG.setValue(this.content.FLAG)
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      }
    }
    this.setInitialValue()
    this.setLookup201WhereCondition()
  }

  setInitialValue() {
    console.log(this.content, 'content');
    if (!this.content) return;
    this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;
    this.metalReturnDetailsForm.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.metalReturnDetailsForm.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.metalReturnDetailsForm.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.vocDate)
    this.metalReturnDetailsForm.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
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
    this.metalReturnDetailsForm.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.metalReturnDetailsForm.controls.PART_CODE.setValue(this.content.PART_CODE)
    this.metalReturnDetailsForm.controls.KARAT_CODE.setValue(this.content.KARAT_CODE)
    this.metalReturnDetailsForm.controls.DIVCODE.setValue(this.content.DIVCODE)

    this.setValueWithDecimal('PURE_WT', this.content.PURE_WT, 'THREE')
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
  setLookup201WhereCondition() {
    let form = this.metalReturnDetailsForm.value
    let where = `@strBranch_Code='${form.BRANCH_CODE}',`
    where += `@strJob_Number='${form.jobNumber}',@strUnq_Job_Id='${form.subJobNo}',`
    where += `@strMetalStone='${form.METAL_STONE}',@strProcess_Code='${form.processCode}',`
    where += `@strWorker_Code='${form.workerCode}',@strStock_Code='${form.stockCode}',@strUserName='${this.comService.userName}'`
    this.stockCodeData.WHERECONDITION = where
    this.ProcessCodeData.WHERECONDITION = where
    this.WorkerCodeData.WHERECONDITION = where
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
  private calculateNetWt(): boolean {
    let form = this.metalReturnDetailsForm.value
    let GROSS_WT = this.comService.emptyToZero(form.GROSS_WT)
    let STONE_WT = this.comService.emptyToZero(form.STONE_WT)
    if (STONE_WT > GROSS_WT) {
      this.comService.toastErrorByMsgId('Stone weight cannot be greater than gross weight')
      return true
    }
    this.setValueWithDecimal('NET_WT', GROSS_WT - STONE_WT, 'THREE')
    return false;
  }
  WorkerCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(e.DESCRIPTION);
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
    this.metalReturnDetailsForm.controls.processCode.setValue(e.Process_Code);
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(e.Description);
    this.setLookup201WhereCondition()
  }

  stockCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(e.DESCRIPTION);
    this.setLookup201WhereCondition()
  }
  ReturnTostockCodeSelected(e: any) {
    this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(e.DESCRIPTION);
    this.setLookup201WhereCondition()
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.closeDetail.emit()
    // this.activeModal.close(data);
  }

  resetStockDetails() {
    this.metalReturnDetailsForm.controls.stockCode.setValue('')
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue('')
    this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue('')
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
    let currRate = this.comService.getCurrecnyRate(this.comService.compCurrency)
    return {
      "SRNO": this.comService.emptyToZero(this.content.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.subJobNo),
      "UNQ_JOB_ID": this.comService.nullToString(form.subJobNo),
      "JOB_DESCRIPTION": form.subJobNoDes,
      "BRANCH_CODE": this.comService.nullToString(form.BRANCH_CODE),
      "DESIGN_CODE": form.designCode,
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDesc),
      "SUB_STOCK_CODE": "0",
      "KARAT_CODE": this.comService.nullToString(form.KARAT_CODE),
      "PCS": form.pcs,
      "GROSS_WT": form.GROSS_WT,
      "PURITY": form.PURITY,
      "PURE_WT": form.PURE_WT,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
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
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.location),
      "RETURN_STOCK": "",
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

  submitValidations() {
    let form = this.metalReturnDetailsForm.value
    if (form.jobNumber == '') {
      this.toastr.error('Job Number required')
      return
    }
    return false;
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    if (this.submitValidations()) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData()
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
    if (flag == 'CONTINUE') {
      this.resetStockDetails()
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
              this.toastr.error('Not deleted')
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
    SEARCH_HEADING: 'Location',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.PREFIX_CODE);

  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.metalReturnDetailsForm.value.subJobNo,
        'strBranchCode': this.comService.nullToString(this.comService.branchCode),
        'strCurrenctUser': this.comService.nullToString(this.comService.userName),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.subJoBDetailData = data
          this.metalReturnDetailsForm.controls.subJobNoDes.setValue(data[0].DESCRIPTION)
          this.metalReturnDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalReturnDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.metalReturnDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(data[0].STOCK_DESCRIPTION)
          this.metalReturnDetailsForm.controls.ReturnToStockCode.setValue(data[0].STOCK_CODE)
          this.metalReturnDetailsForm.controls.ReturnToStockCodeDesc.setValue(data[0].STOCK_DESCRIPTION)
          this.metalReturnDetailsForm.controls.pcs.setValue(data[0].PCS)
          this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(data[0].WORKERDESC)
          this.metalReturnDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalReturnDetailsForm.controls.location.setValue(data[0].LOCTYPE_CODE)
          this.metalReturnDetailsForm.controls.designCode.setValue(data[0].DESIGN_CODE)
          this.metalReturnDetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.metalReturnDetailsForm.controls.JOB_PCS.setValue(data[0].PCS1)
          this.metalReturnDetailsForm.controls.METAL_STONE.setValue(data[0].METAL_STONE)

          this.setValueWithDecimal('PURE_WT', data[0].PURE_WT, 'THREE')
          this.setValueWithDecimal('GROSS_WT', data[0].METAL, 'METAL')
          this.setValueWithDecimal('PURITY', data[0].PURITY, 'PURITY')
          this.setValueWithDecimal('KARAT', data[0].KARAT, 'THREE')
          this.setValueWithDecimal('STONE_WT', data[0].STONE, 'STONE')
          this.setValueWithDecimal('NET_WT', data[0].METAL - data[0].STONE, 'THREE')
          this.setLookup201WhereCondition()
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    // let postData = {
    //   "SPID": "064",
    //   "parameter": {
    //     'BRANCHCODE': this.comService.nullToString(this.branchCode),
    //     'JOBNO': this.comService.nullToString(event.target.value),
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
            this.metalReturnDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalReturnDetailsForm.controls.PART_CODE.setValue(data[0].PART_CODE)
            this.metalReturnDetailsForm.controls.KARAT_CODE.setValue(data[0].KARAT_CODE)
            this.setLookup201WhereCondition()
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
 
  stockCodeValidate(event: any) {
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
        strVocDate: this.comService.formatDDMMYY(this.comService.currentDate)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data) {
            console.log(data, 'data');

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

}
