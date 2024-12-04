import { Component, Input, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-melting-issue-details',
  templateUrl: './melting-issue-details.component.html',
  styleUrls: ['./melting-issue-details.component.scss']
})
export class MeltingIssueDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @ViewChild('overlayworkercode') overlayworkercode!: MasterSearchComponent;
  @ViewChild('overlayjobNoSearch') overlayjobNoSearch!: MasterSearchComponent;
  @ViewChild('overlayprocess') overlayprocess!: MasterSearchComponent;
  @ViewChild('overlaystockcodeSearch') overlaystockcodeSearch!: MasterSearchComponent;
  @ViewChild('overlaylocationSearch') overlaylocationSearch!: MasterSearchComponent;
  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  metalDetailData: any[] = [];
  yearMonth?: String;
  jobNumberDetailData: any[] = [];
  currentDate = new Date();
  userName = localStorage.getItem('username');
  viewMode: boolean = false;
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;
  isViewStock: boolean = false;
  isDisableSaveBtn: boolean = false;
  tableDatastocklist = [];
  isSearchEnabled: boolean = false;
  disableSearch: boolean = true;

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: `JOB_CLOSED_ON is null and  Branch_code = '${this.comService.branchCode}'`,
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

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 51,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  setLookup201WhereCondition() {
    let form = this.meltingIssuedetailsFrom.value
    console.log(form, 'form')
    let where = `Branch_Code='${form.BRANCH_CODE}',`
    where += `JobNo='${form.jobno}',`
    where += `MetalStone='${form.METAL_STONE}',Process_Code='${form.process}',`
    where += `Worker_Code='${form.worker}',Stock_Code='${form.stockcode}',LocCode='${form.location}'`
    this.stockCodeData.WHERECONDITION = where
    this.ProcessCodeData.WHERECONDITION = where
    this.WorkerCodeData.WHERECONDITION = where
  }

  StockCodeSelected(e: any) {
    console.log(e);
    this.meltingIssuedetailsFrom.controls.stockcode.setValue(e.STOCK_CODE);
    this.meltingIssuedetailsFrom.controls.tostock.setValue(e.DESCRIPTION);
    this.meltingIssuedetailsFrom.controls.stockdes.setValue(e.DESCRIPTION);
    this.meltingIssuedetailsFrom.controls.mainstock.setValue(e.STOCK_CODE);
    this.stockCodeValidate(event)

  }

  WorkerCodeSelected(e: any) {
    console.log(e);
    this.meltingIssuedetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssuedetailsFrom.controls.workerdes.setValue(e.DESCRIPTION);
  }

  ProcessCodeSelected(e: any) {
    console.log(e);
    this.meltingIssuedetailsFrom.controls.process.setValue(e.Process_Code);
    this.meltingIssuedetailsFrom.controls.processdes.setValue(e.Description);
    //
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.meltingIssuedetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  jobnoCodeSelected(e: any) {
    console.log(e);
    this.meltingIssuedetailsFrom.controls.jobno.setValue(e.job_number);
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(e.job_description)
    this.jobNumberValidate({ target: { value: e.job_number } })
  }

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    console.log(this.content)
    if (this.content && this.content.FLAG) {
      this.setInitialValue()
      this.meltingIssuedetailsFrom.controls.FLAG.setValue(this.content.FLAG)
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;

      }
    }
    this.dataTochild()
    // this.setLookup201WhereCondition()
  }
  setViewMode(viewOnly: boolean) {
    this.viewMode = viewOnly;
    this.editMode = !viewOnly; // If viewMode is true, editMode is false
    this.disableSearch = this.viewMode; // Disable search if viewMode is active
  }

  dataTochild(dataToChild?: any) {
    console.log(this.content.HEADERDETAILS, 'pick')
    this.meltingIssuedetailsFrom.controls.voctype.setValue(this.content.voctype || this.content.HEADERDETAILS.voctype)
    this.meltingIssuedetailsFrom.controls.jobno.setValue(this.content.jobno || this.content.HEADERDETAILS.jobno);
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(this.content.jobdes || this.content.HEADERDETAILS.jobdes);
    this.meltingIssuedetailsFrom.controls.jobpurity.setValue(this.content.jobpurity || this.content.HEADERDETAILS.jobpurity);
    this.meltingIssuedetailsFrom.controls.process.setValue(this.content.process || this.content.HEADERDETAILS.processcode);
    this.meltingIssuedetailsFrom.controls.processdes.setValue(this.content.processdes || this.content.HEADERDETAILS.processdes);
    this.meltingIssuedetailsFrom.controls.worker.setValue(this.content.worker || this.content.HEADERDETAILS.worker);
    this.meltingIssuedetailsFrom.controls.workerdes.setValue(this.content.workerdes || this.content.HEADERDETAILS.workerdes);
    this.meltingIssuedetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.meltingIssuedetailsFrom.controls.subjobno.setValue(this.content.subjobno || this.content.HEADERDETAILS.subjobno)
    // this.meltingIssuedetailsFrom.controls.jobdes.setValue(this.content.jobdes || this.content.HEADERDETAILS.subJobDescription);
    // this.meltingIssuedetailsFrom.controls.jobdes.setValue(this.content.jobdes || this.content.HEADERDETAILS.subJobDescription);  

  }
  setInitialValue() {
    console.log(this.content, 'content');
    if (!this.content) return;
    // this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;

    // this.meltingIssuedetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    // this.meltingIssuedetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    // this.meltingIssuedetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)

    this.meltingIssuedetailsFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssuedetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.meltingIssuedetailsFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssuedetailsFrom.controls.diffgrwt.setValue(this.content.diffgrwt)
    this.meltingIssuedetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssuedetailsFrom.controls.workerdes.setValue(this.content.WORKER_CODE)
    this.meltingIssuedetailsFrom.controls.treeno.setValue(this.content.TREE_NO)
    this.meltingIssuedetailsFrom.controls.waxweight.setValue(this.content.WAX_WT)
    this.meltingIssuedetailsFrom.controls.pcs.setValue(this.content.PCS)
    this.meltingIssuedetailsFrom.controls.location.setValue(this.content.LOCATION_CODE)
    this.meltingIssuedetailsFrom.controls.stockcode.setValue(this.content.STOCK_CODE)
    this.meltingIssuedetailsFrom.controls.stockdes.setValue(this.content.STOCK_DESCRIPTION)
    this.meltingIssuedetailsFrom.controls.tostock.setValue(this.content.TOSTOCKCODE)
    this.meltingIssuedetailsFrom.controls.mainstock.setValue(this.content.MAIN_STOCK_CODE)
    this.meltingIssuedetailsFrom.controls.stoneweight.setValue(this.content.STONE)
    this.meltingIssuedetailsFrom.controls.netweight.setValue(this.content.NET_WT)
    this.meltingIssuedetailsFrom.controls.grossweight.setValue(this.content.GROSS_WT)
    this.meltingIssuedetailsFrom.controls.topurity.setValue(this.content.TOPURITY)
    this.meltingIssuedetailsFrom.controls.pureweight.setValue(this.content.PUREWT)
    this.meltingIssuedetailsFrom.controls.purity.setValue(this.content.PURITY)
    this.meltingIssuedetailsFrom.controls.remarks.setValue(this.content.REMARKS)
    this.meltingIssuedetailsFrom.controls.waxweight.setValue(this.content.WAX_WEIGHT)
    this.meltingIssuedetailsFrom.controls.topurity.setValue(this.content.PURE_WT)
    this.meltingIssuedetailsFrom.controls.lossweight.setValue(this.content.LOSSWT)
    this.meltingIssuedetailsFrom.controls.subjobno.setValue(this.content.subjobno)

    this.setValueWithDecimal('topurity', this.content.PURE_WT, 'THREE')
    this.setValueWithDecimal('grossweight', this.content.GROSS_WT, 'METAL')
    this.setValueWithDecimal('pureweight', this.content.PUREWT, 'METAL')
    this.setValueWithDecimal('purity', this.content.PURITY, 'METAL')
    this.setValueWithDecimal('netweight', this.content.NET_WT, 'METAL')
    this.setValueWithDecimal('waxweight', this.content.WAX_WT, 'THREE')
    this.setValueWithDecimal('stoneweight', this.content.STONE_WT, 'STONE')
    this.setValueWithDecimal('diffgrwt', this.content.JOB_PURITY, 'PURITY')


  };
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.meltingIssuedetailsFrom.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
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


  meltingIssuedetailsFrom: FormGroup = this.formBuilder.group({
    jobno: [''],
    subjobno: [''],
    voctype: [''],
    subJobDescription: [''],
    jobdes: [''],
    jobpurity: [''],
    process: ['', [Validators.required]],
    processdes: ['', [Validators.required]],
    worker: ['', [Validators.required]],
    workerdes: ['', [Validators.required]],
    treeno: [''],
    stockcode: [''],
    stockdes: [''],
    tostock: [''],
    mainstock: [''],
    grossweight: ['', [Validators.required]],
    purity: ['', [Validators.required]],
    lossweight: ['', [Validators.required]],
    diffgrwt: [''],
    waxweight: ['', [Validators.required]],
    stoneweight: [''],
    remarks: [''],
    lotno: ['', [Validators.required]],
    tgold: [''],
    silver: [''],
    ticketno: ['', [Validators.required]],
    barno: ['', [Validators.required]],
    location: ['000GEN'],
    pcs: [''],
    netweight: [''],
    pureweight: ['', [Validators.required]],
    topurity: ['100.00', [Validators.required]],
    FLAG: [null],
    VOCTYPE: [''],
    METAL_STONE: [''],
    UNQ_JOB_ID: [''],
    BRANCH_CODE: [''],
    DivCode: ['']
  });
  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobno) == '') {
      this.comService.toastErrorByMsgId('MSG1358')//Job number is required
      return true
    }
    if (this.comService.nullToString(form.worker) == '') {
      this.comService.toastErrorByMsgId('MSG1951')//Worker code is required
      return true
    }
    if (this.comService.nullToString(form.process) == '') {
      this.comService.toastErrorByMsgId('MSG1680')//Process code is required
      return true
    }
    return false
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    if (this.submitValidations(this.meltingIssuedetailsFrom.value)) return;
    let dataToparent = {
      FLAG: flag,
      POSTDATA: this.setPostData()
    }
    // this.close(postData);
    this.saveDetail.emit(dataToparent);
    if (flag == 'CONTINUE') {
      // this.resetStockDetails()
    }
  }
  setPostData() {
    let form = this.meltingIssuedetailsFrom.value
    let currRate = this.comService.getCurrencyRate(this.comService.compCurrency)
    return {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": this.comService.nullToString(form.voctype),
      "DT_VOCNO": 0,
      "DT_VOCDATE": this.comService.formatDateTime(this.currentDate),
      "DT_YEARMONTH": this.comService.yearSelected,
      "JOB_NUMBER": this.meltingIssuedetailsFrom.value.jobno,
      "JOB_DESCRIPTION": this.meltingIssuedetailsFrom.value.jobdes,
      "PROCESS_CODE": this.meltingIssuedetailsFrom.value.process,
      "PROCESS_DESC": this.meltingIssuedetailsFrom.value.processdes,
      "WORKER_CODE": this.meltingIssuedetailsFrom.value.worker,
      "WORKER_DESC": this.meltingIssuedetailsFrom.value.workerdes,
      "STOCK_CODE": this.meltingIssuedetailsFrom.value.stockcode,
      "STOCK_DESCRIPTION": this.meltingIssuedetailsFrom.value.stockdes,
      "DIVCODE": "S",
      "KARAT_CODE": "",
      "PCS": this.meltingIssuedetailsFrom.value.pcs,
      "GROSS_WT": this.meltingIssuedetailsFrom.value.grossweight,
      "STONE_WT": this.comService.emptyToZero(this.meltingIssuedetailsFrom.value.stoneweight),
      "PURITY": this.meltingIssuedetailsFrom.value.purity,
      "PUREWT": this.meltingIssuedetailsFrom.value.pureweight,
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT": this.meltingIssuedetailsFrom.value.netweight,//add emptytozero for all number fields
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingIssuedetailsFrom.value.waxweight,
      "TREE_NO": this.comService.nullToString(this.meltingIssuedetailsFrom.value.treeno),
      "WIP_ACCODE": "",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "",
      "REMARKS": this.comService.nullToString(this.meltingIssuedetailsFrom.value.remarks),
      "LOCTYPE_CODE": this.comService.nullToString(this.meltingIssuedetailsFrom.value.location),
      "TOSTOCKCODE": this.comService.nullToString(this.meltingIssuedetailsFrom.value.tostock),
      "LOSSWT": this.comService.emptyToZero(this.meltingIssuedetailsFrom.value.lossweight),
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingIssuedetailsFrom.value.lotno,
      "BAR_NO": this.meltingIssuedetailsFrom.value.barno,
      "TICKET_NO": this.meltingIssuedetailsFrom.value.ticketno,
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": this.comService.nullToString(this.meltingIssuedetailsFrom.value.topurity),
      "PUR_PER": 0,
      "MELTING_TYPE": "",
      "ISALLOY": "s",
      "UNQ_JOB_ID": "",
      "SUB_STOCK_CODE": "",
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": ""
    }
  }
  emptyToZero(value: any) {
    //common function for all number checking
    return this.comService.emptyToZero(value)
  }
  //functions for weight calculations starts //continue..
  grossWeightChange() {
    //dont make functions complicated write with same name in input
    //use only simple methods
    // use same names for same feilds
    let form = this.meltingIssuedetailsFrom.value;
    let netweight = this.comService.netWeightCalculate(form.grossweight, form.stoneweight)
    this.setValueWithDecimal('netweight', netweight, 'METAL')
    let pureweight = this.comService.pureWeightCalculate(netweight, form.purity)
    this.setValueWithDecimal('pureweight', pureweight, 'METAL')

  }
  stoneWeightChange() {
    //dont make functions complicated write with same name in input
    //use only simple methods
    // use same names for same feilds
    let form = this.meltingIssuedetailsFrom.value;
    let netweight = this.comService.netWeightCalculate(form.grossweight, form.stoneweight)
    this.setValueWithDecimal('netweight', netweight, 'METAL')
    let pureweight = this.comService.pureWeightCalculate(netweight, form.purity)
    this.setValueWithDecimal('pureweight', pureweight, 'METAL')

  }
  netWeightChange() {
    //dont make functions complicated write with same name in input
    //use only simple methods
    // use same names for same feilds
    let form = this.meltingIssuedetailsFrom.value;
    let netweight = this.comService.netWeightCalculate(form.grossweight, form.stoneweight)
    this.setValueWithDecimal('netweight', netweight, 'METAL')
    let pureweight = this.comService.pureWeightCalculate(netweight, form.purity)
    this.setValueWithDecimal('pureweight', pureweight, 'METAL')

  }

  pureWeightChange() {
    //dont make functions complicated write with same name in input
    //use only simple methods
    // use same names for same feilds
    let form = this.meltingIssuedetailsFrom.value;
    let purity = this.comService.pureWeightCalculate(form.netweight, form.purity)
    this.setValueWithDecimal('purity', purity, 'PURITY')
    let topurity = this.comService.pureWeightCalculate(purity, form.pureweight)
    this.setValueWithDecimal('topurity', topurity, 'METAL')

  }

  // deleteRecord() {
  //   if (!this.content.WORKER_CODE) {
  //     Swal.fire({
  //       title: '',
  //       text: 'Please Select data to delete!',
  //       icon: 'error',
  //       confirmButtonColor: '#336699',
  //       confirmButtonText: 'Ok'
  //     }).then((result: any) => {
  //       if (result.value) {
  //       }
  //     });
  //     return
  //   }
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' + this.meltingIssuedetailsFrom.value.voctype + this.meltingIssuedetailsFrom.value.vocno + this.meltingIssuedetailsFrom.value.vocdate
  //       let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
  //         .subscribe((result) => {
  //           if (result) {
  //             if (result.status == "Success") {
  //               Swal.fire({
  //                 title: result.message || 'Success',
  //                 text: '',
  //                 icon: 'success',
  //                 confirmButtonColor: '#336699',
  //                 confirmButtonText: 'Ok'
  //               }).then((result: any) => {
  //                 if (result.value) {
  //                   this.meltingIssuedetailsFrom.reset()
  //                   this.tableData = []
  //                   this.close('reloadMainGrid')
  //                 }
  //               });
  //             } else {
  //               Swal.fire({
  //                 title: result.message || 'Error please try again',
  //                 text: '',
  //                 icon: 'error',
  //                 confirmButtonColor: '#336699',
  //                 confirmButtonText: 'Ok'
  //               }).then((result: any) => {
  //                 if (result.value) {
  //                   this.meltingIssuedetailsFrom.reset()
  //                   this.tableData = []
  //                   this.close()
  //                 }
  //               });
  //             }
  //           } else {
  //             this.toastr.error('Not deleted')
  //           }
  //         }, err => alert(err))
  //       this.subscriptions.push(Sub)
  //     }
  //   });
  // }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.meltingIssuedetailsFrom.value[formControlName] != '') return;
    switch (formControlName) {
      case 'jobno':
        this.overlayjobNoSearch.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayprocess.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkercode.showOverlayPanel(event);
        break;
      case 'location':
        this.overlaylocationSearch.showOverlayPanel(event);
        break;
      case 'stockcode':
        this.overlaystockcodeSearch.showOverlayPanel(event);
        break;
      default:
    }
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
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
          this.meltingIssuedetailsFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'process' || FORMNAME === 'worker' || FORMNAME === 'location') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  stockCodeValidate(event: any) {
    if (this.viewMode) return;
    if (event && event.target.value == '') {
      this.showOverleyPanel(event, 'stockcode');
      return
    };
    this.setLookup201WhereCondition()
    let postData = {
      "SPID": "112",
      "parameter": {
        Process_Code: this.meltingIssuedetailsFrom.value.process,
        JobNo: this.meltingIssuedetailsFrom.value.jobno,
        Branch_Code: this.comService.nullToString(this.branchCode),
        Worker_Code: this.meltingIssuedetailsFrom.value.worker,
        Stock_Code: this.meltingIssuedetailsFrom.value.stockcode,
        LocCode: this.meltingIssuedetailsFrom.value.location,
      }
    };

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        if (result.status === "Success" && result.dynamicData) {
          const stockDetails = result.dynamicData[2][0];
          if (stockDetails.length === 0) {
            this.overlaystockcodeSearch.closeOverlayPanel();
            this.meltingIssuedetailsFrom.controls.stockcode.setValue('');  
            this.comService.toastErrorByMsgId('MSG1531');  
            this.showOverleyPanel(event, 'stockcode');

          } else {
            let data = stockDetails;
            this.meltingIssuedetailsFrom.controls.stockdes.setValue(data.DESCRIPTION);
            this.meltingIssuedetailsFrom.controls.mainstock.setValue(data.MAIN_STOCK_CODE.toUpperCase());
            this.meltingIssuedetailsFrom.controls.purity.setValue(data.PURITY);
          }

        } else {
          this.overlaystockcodeSearch.closeOverlayPanel();
          this.comService.toastErrorByMsgId('MSG1747');  
          this.meltingIssuedetailsFrom.controls.stockCode.setValue('');  
        }
      }, err => {
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531'); 
        this.meltingIssuedetailsFrom.controls.stockCode.setValue(''); 
        this.showOverleyPanel(event, 'stockCode'); 
      });

    this.subscriptions.push(Sub);
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.meltingIssuedetailsFrom.value.subjobno,
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
          console.log(data[0], 'datapassing')
          this.meltingIssuedetailsFrom.controls.jobdes.setValue(data[0].DESCRIPTION)
          this.meltingIssuedetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.meltingIssuedetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.meltingIssuedetailsFrom.controls.stockcode.setValue(data[0].STOCK_CODE)
          this.meltingIssuedetailsFrom.controls.pureweight.setValue(data[0].PUREWT)
          this.meltingIssuedetailsFrom.controls.pcs.setValue(data[0].PCS)
          this.meltingIssuedetailsFrom.controls.workerdes.setValue(data[0].WORKERDESC)
          this.meltingIssuedetailsFrom.controls.processdes.setValue(data[0].PROCESSDESC)
          this.meltingIssuedetailsFrom.controls.grossweight.setValue(data[0].NETWT)
          this.meltingIssuedetailsFrom.controls.purity.setValue(data[0].PURITY)
          this.meltingIssuedetailsFrom.controls.waxweight.setValue(data[0].WAX_WEIGHT)
          this.meltingIssuedetailsFrom.controls.stockdes.setValue(data[0].DIVCODE)
          this.meltingIssuedetailsFrom.controls.tostock.setValue(data[0].STOCK_DESCRIPTION)
          this.meltingIssuedetailsFrom.controls.topurity.setValue(data[0].PURE_WT)
          this.meltingIssuedetailsFrom.controls.netweight.setValue(data[0].NETWT)
          this.meltingIssuedetailsFrom.controls.stoneweight.setValue(data[0].STONE)
          this.meltingIssuedetailsFrom.controls.mainstock.setValue(data[0].MAIN_STOCK_CODE)
          this.meltingIssuedetailsFrom.controls.METAL_STONE.setValue(data[0].METAL_STONE)
          this.setValueWithDecimal('topurity', data[0].PURE_WT, 'THREE') // this is mistake
          this.setValueWithDecimal('grossweight', data[0].METAL, 'METAL')
          this.setValueWithDecimal('purity', data[0].PURITY, 'PURITY')
          this.setValueWithDecimal('waxweight', data[0].KARAT, 'THREE')
          this.setValueWithDecimal('StoneWeight', data[0].STONE, 'STONE')
          this.setValueWithDecimal('netweight', data[0].METAL - data[0].STONE, 'THREE')
          this.setLookup201WhereCondition()
          // this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(
          //   this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))

          // this.meltingIssuedetailsFrom.controls.StoneWeight.setValue(data[0].STONE)

          // this.meltingIssuedetailsFrom.controls.PURITY.setValue(data[0].PURITY)
          // this.meltingIssuedetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          // this.meltingIssuedetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // // this.stockCodeScrapValidate()
          // this.meltingIssuedetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.meltingIssuedetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          // this.meltingIssuedetailsFrom.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.meltingIssuedetailsFrom.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.fillStoneDetails()
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
            this.meltingIssuedetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.meltingIssuedetailsFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)
            this.subJobNumberValidate()
            this.setLookup201WhereCondition()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.meltingIssuedetailsFrom.controls.jobno.setValue('')
            this.showOverleyPanel(event, 'jobno')
            return
          }
        } else {
          this.overlayjobNoSearch.closeOverlayPanel()
          this.meltingIssuedetailsFrom.controls.jobno.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  stockClicked() {
    this.isViewStock = true;
  }

  closeStockPopup() {
    this.isViewStock = false;
  }

}

