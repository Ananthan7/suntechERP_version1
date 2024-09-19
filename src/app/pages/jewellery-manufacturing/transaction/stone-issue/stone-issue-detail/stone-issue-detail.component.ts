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
@Component({
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() isViewChangeJob: boolean = true;
  @Input() content!: any;
  @ViewChild('overlayjobNumberSearch') public overlayjobNumberSearch!: MasterSearchComponent;
  @ViewChild('overlayprocessSearch') public overlayprocessSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') public overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlaystockCodeSearch') public overlaystockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaylocationSearch') public overlaylocationSearch!: MasterSearchComponent;
  columnhead1: any[] = [];
  serialNo: any;
  subJobNo: any;
  tableData: any[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
  jobNumberDetailData: any[] = [];
  imagepath: any[] = []
  viewMode: boolean = false;
  editMode: boolean = false;
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
    WHERECONDITION: "job_number<> ''",
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
    WHERECONDITION: `@strWorker='',@strCurrentUser='${this.comService.userName}'`,
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

  stoneIssueDetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subjobnumber: ['', [Validators.required]],
    subjobDes: [''],
    DESIGN_CODE: [''],
    PART_CODE: [''],
    salesorderno: [''],
    process: ['', [Validators.required]],
    processname: [''],
    worker: ['', [Validators.required]],
    workername: [''],
    stockCode: [''],
    stockCodeDes: [''],
    batchid: [''],
    LOCTYPE_CODE: [''],
    pieces: [],
    shape: [''],
    clarity: [''],
    carat: ['', [Validators.required]],
    size: [],
    SIEVE_SET: [''],
    unitrate: [],
    sieve: [''],
    SIEVE_DESC: [''],
    amount: [],
    PICTURE_PATH: [''],
    color: [''],
    stockbal: [],
    pointerwt: [],
    otheratt: [],
    remarks: [''],
    consignment: [false],
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    KARAT_CODE: [''],
    DIVCODE: [''],
    METAL_STONE: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    FLAG: [null]
  });


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.checkContent()
  }
  checkContent() {
    if (this.content) {
      this.stoneIssueDetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      switch (this.content?.FLAG) {
        case 'VIEW':
          this.viewMode = true;
          break;
        case 'EDIT':
          this.editMode = true;
          break;
        // Add other cases if needed
        default:
          // Handle unexpected FLAG values if necessary
          break;
      }
      if (this.content?.HEADERDETAILS?.FLAG == 'VIEW') {
        this.viewMode = true;
      }
      this.setFormValues()
    }
  }
  setFormValues() {
    if (!this.content) return
    this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;
    this.stoneIssueDetailsFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.stoneIssueDetailsFrom.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.stoneIssueDetailsFrom.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.VOCDATE)
    this.stoneIssueDetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.stoneIssueDetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.stoneIssueDetailsFrom.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE || this.content.HEADERDETAILS.currency)
    this.stoneIssueDetailsFrom.controls.CURRENCY_RATE.setValue(this.content.CURRENCY_RATE || this.content.HEADERDETAILS.currencyrate)

    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.stoneIssueDetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneIssueDetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneIssueDetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneIssueDetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneIssueDetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneIssueDetailsFrom.controls.pieces.setValue(this.content.PCS)
    this.stoneIssueDetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneIssueDetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneIssueDetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneIssueDetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneIssueDetailsFrom.controls.LOCTYPE_CODE.setValue(this.content.LOCTYPE_CODE)
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(this.content.SIEVE_SET)
    this.stoneIssueDetailsFrom.controls.remarks.setValue(this.content.D_REMARKS)
    this.stoneIssueDetailsFrom.controls.amount.setValue(this.content.AMOUNTLC)
    this.stoneIssueDetailsFrom.controls.carat.setValue(this.content.Carat)
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.stoneIssueDetailsFrom.controls.pointerwt.setValue(this.content.WEIGHT)
    this.stoneIssueDetailsFrom.controls.unitrate.setValue(this.content.AMOUNTFC)
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.stoneIssueDetailsFrom.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
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

  locationCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.LOCTYPE_CODE.setValue(e.LOCATION_CODE);
  }

  @ViewChild('jobNumberInput') jobNumberInput!: ElementRef;

  ngAfterViewInit() {
    if (!this.viewMode) {
      this.jobNumberInput.nativeElement.focus();
    }
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(e.job_description);
    // this.subJobNo = `${e.job_number}/${this.serialNo}`;
    // this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.subJobNo);
    // this.stoneIssueDetailsFrom.controls.subjobDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
    // this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(e.job_number);
    // this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(e.job_description);
  }

  processCodeSelected(e: any) {
    this.stoneIssueDetailsFrom.controls.process.setValue(e.PROCESS_CODE);
    this.stoneIssueDetailsFrom.controls.processname.setValue(e.DESCRIPTION);
    this.workerCodeData.WHERECONDITION = `@strProcess='${e.PROCESS_CODE}',@blnActive=1`
  }

  workerCodeSelected(e: any) {
    this.stoneIssueDetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneIssueDetailsFrom.controls.workername.setValue(e.DESCRIPTION);
    this.processCodeData.WHERECONDITION = `@strWorker='${e.WORKER_CODE}',@strCurrentUser='${this.comService.userName}'`
  }

  stockCodeSelected(e: any) {
    console.log(e,'eee')
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(e.STOCK_DESCRIPTION);
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(e.Item);
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(e.Discription);
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(e.DivCode);

    this.stoneIssueDetailsFrom.controls.pieces.setValue(e.Pcs)
    this.stoneIssueDetailsFrom.controls.size.setValue(e.Size)
    this.stoneIssueDetailsFrom.controls.sieve.setValue(e.sieve)
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(e.sieve_set)
    this.stoneIssueDetailsFrom.controls.color.setValue(e.color)
    this.stoneIssueDetailsFrom.controls.unitrate.setValue(
      this.comService.emptyToZero(e.rate)
    )
    this.stoneIssueDetailsFrom.controls.shape.setValue(e.shape)
    this.stoneIssueDetailsFrom.controls.amount.setValue(e.AmountLC)
    this.stoneIssueDetailsFrom.controls.pointerwt.setValue(e.Weight)
    this.stoneIssueDetailsFrom.controls.batchid.setValue(e.STOCK_CODE);
    
    this.setStockCodeWhereCondition()
  }
  setStockCodeWhereCondition() {
    let form = this.stoneIssueDetailsFrom.value;
    let WHERECONDITION = `@strProcessCode='${this.comService.nullToString(form.process)}',`
    WHERECONDITION += `@strWorkerCode='${this.comService.nullToString(form.worker)}',`
    WHERECONDITION += `@strSubJobNumber='${this.comService.nullToString(form.subjobnumber)}',`
    WHERECONDITION += `@strBranchCode='${this.comService.branchCode}',`
    WHERECONDITION += `@strStockCode='${this.comService.nullToString(form.stockCode)}'`
    this.stockCodeData.WHERECONDITION = WHERECONDITION
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
  onchangeCheckBox(e: any) {
    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }
  SPvalidateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;
    if (event.target.value == '' || this.viewMode == true) return;

    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": LOOKUPDATA.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        let data = result.dynamicData[0];
        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE != '') {
            let searchResult = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);
            console.log(searchResult, 'result');
            if (searchResult && searchResult.length == 0) {
              this.comService.toastErrorByMsgId('No data found');
              this.stoneIssueDetailsFrom.controls[FORMNAME].setValue('');
              LOOKUPDATA.SEARCH_VALUE = '';
              switch (FORMNAME) {
                case 'worker':
                  this.showOverleyPanel(event, 'worker');
                  break;
                case 'process':
                  this.showOverleyPanel(event, 'process');
                  break;
                default:

              }
              return;
            }
          }
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      });
    this.subscriptions.push(Sub);
  }

  showOverleyPanel(event: any, formControlName: string) {
    let value = this.stoneIssueDetailsFrom.value[formControlName]
    if (this.comService.nullToString(value) != '') return;

    switch (formControlName) {
      case 'jobNumber':
        this.overlayjobNumberSearch.showOverlayPanel(event);
        break;
      case 'process':
        this.overlayprocessSearch.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkerSearch.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaystockCodeSearch.showOverlayPanel(event);
        break;
      case 'LOCTYPE_CODE':
        this.overlaylocationSearch.showOverlayPanel(event);
        break;
      default:

    }
  }

  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value

    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.comService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.comService.toastErrorByMsgId('MSG1531')
          this.stoneIssueDetailsFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'LOCTYPE_CODE') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
      }, err => {
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  submitValidations(form: any) {
    if (this.comService.nullToString(form.jobNumber) == '') {
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
    if (this.comService.nullToString(form.stockCode) == '') {
      this.comService.toastErrorByMsgId('MSG1816')//Stock code is required
      return true
    }
    return false
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  setPostData() {
    let form: any = this.stoneIssueDetailsFrom.value;
    return {
      "SRNO": this.comService.emptyToZero(this.content?.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.subjobnumber),
      "UNQ_JOB_ID": this.comService.nullToString(form.subjobnumber),
      "JOB_DESCRIPTION": this.comService.nullToString(form.jobDes),
      "BRANCH_CODE": this.comService.nullToString(this.comService.branchCode),
      "DESIGN_CODE": this.comService.nullToString(form.DESIGN_CODE),
      "DIVCODE": this.comService.nullToString(form.DIVCODE),
      "STOCK_CODE": this.comService.nullToString(form.stockCode),
      "STOCK_DESCRIPTION": this.comService.nullToString(form.stockCodeDes),
      "SIEVE": this.comService.nullToString(form.sieve),
      "SHAPE": this.comService.nullToString(form.shape),
      "COLOR": this.comService.nullToString(form.color),
      "CLARITY": this.comService.nullToString(form.clarity),
      "SIZE": this.comService.nullToString(form.size),
      "JOB_PCS": 0,
      "PCS": this.comService.emptyToZero(form.pieces),
      "GROSS_WT": 0,
      "CURRENCY_CODE": this.comService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.comService.emptyToZero(form.CURRENCY_RATE),
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": this.comService.emptyToZero(form.unitrate),
      "AMOUNTLC": this.comService.emptyToZero(form.amount),
      "PROCESS_CODE": this.comService.nullToString(form.process),
      "PROCESS_NAME": this.comService.nullToString(form.processname),
      "WORKER_CODE": this.comService.nullToString(form.worker),
      "WORKER_NAME": this.comService.nullToString(form.workername),
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.LOCTYPE_CODE),
      "PICTURE_NAME": "",
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.comService.nullToString(this.comService.branchCode),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.comService.nullToString(this.yearMonth),
      "CONSIGNMENT": this.onchangeCheckBox(form.consignment),
      "SIEVE_SET": this.comService.nullToString(form.SIEVE_SET),
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": '' || this.comService.nullToString(form.remarks),
      "SIEVE_DESC": this.comService.nullToString(form.SIEVE_DESC),
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": "",
    }
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    if (this.submitValidations(this.stoneIssueDetailsFrom.value)) return;
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
  changeJobClicked() {
    this.formSubmit('CONTINUE')
    this.stoneIssueDetailsFrom.reset()
  }
  resetStockDetails() {
    this.stoneIssueDetailsFrom.controls.stockCode.setValue('')
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue('')
    // this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }

 stockCodeValidate(event: any) {
    if (event.target.value === '') return;

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
                let stockDetails = result.dynamicData[1];

                if (data.RESULT_TYPE === "Failed") {
                    this.comService.toastErrorByMsgId("MSG1464");
                    return;
                }

                if (data[0].VALID_STOCK) {
                    // Handle the valid stock case
                    if (stockDetails) {
                        console.log(stockDetails, 'data');
                        this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(stockDetails[0].DIVCODE);
                        this.stoneIssueDetailsFrom.controls.carat.setValue(stockDetails[0].KARAT);
                        this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(stockDetails[0].SIEVE_SET);
                        this.stoneIssueDetailsFrom.controls.size.setValue(stockDetails[0].SIZE);
                        this.stoneIssueDetailsFrom.controls.sieve.setValue(stockDetails[0].SIEVE);
                        this.stoneIssueDetailsFrom.controls.SIEVE_DESC.setValue(stockDetails[0].SIEVE_DESC);
                        this.stoneIssueDetailsFrom.controls.pieces.setValue(stockDetails[0].PCS);
                        this.stoneIssueDetailsFrom.controls.shape.setValue(stockDetails[0].SHAPE);
                    }
                    this.overlaystockCodeSearch.closeOverlayPanel(); // Close the overlay only if the stock is valid
                } else {
                    this.comService.toastErrorByMsgId('MSG1531');
                    this.stoneIssueDetailsFrom.controls.stockCode.setValue('');
                    // Do not close the overlay, keep it open
                    this.showOverleyPanel(event, 'stockCode');
                }
            } else {
                this.comService.toastErrorByMsgId('MSG1531');
                this.stoneIssueDetailsFrom.controls.stockCode.setValue('');
                this.showOverleyPanel(event, 'stockCode'); // Ensure the overlay remains open in case of errors
            }
        }, err => {
            this.comService.closeSnackBarMsg();
            this.comService.toastErrorByMsgId('MSG1531');
            this.stoneIssueDetailsFrom.controls.stockCode.setValue('');
            this.showOverleyPanel(event, 'stockCode'); // Ensure the overlay remains open in case of errors
        });

    this.subscriptions.push(Sub);
}

getImageData() {
  let API = `Image/${this.stoneIssueDetailsFrom.value.jobNumber}`
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
  

  subJobNumberValidate(event?: any) {
    // let postData = {
    //   "SPID": "071",
    //   "parameter": {
    //     'STRJOB_NUMBER': this.comService.nullToString(this.stoneIssueDetailsFrom.value.jobNumber),
    //     'STRUNQ_JOB_ID': this.comService.nullToString(this.stoneIssueDetailsFrom.value.subjobnumber),
    //     'STRBRANCH_CODE': this.comService.nullToString(this.comService.branchCode),
    //   }
    // }
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.stoneIssueDetailsFrom.value.subjobnumber,
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
          console.log(data, 'data')
          this.stoneIssueDetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.stoneIssueDetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.stoneIssueDetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.stoneIssueDetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.stoneIssueDetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.tableData = result.dynamicData[1] || []
          // this.columnhead1 = Object.keys(this.tableData[0])
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

  jobNumberValidate(event: any) {
    this.showOverleyPanel(event, 'jobNumber')
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.comService.branchCode),
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
          if (data && data[0]?.UNQ_JOB_ID != '') {
            console.log(data[0],'pick')
            this.jobNumberDetailData = data
            this.stoneIssueDetailsFrom.controls.jobDes.setValue(data.JOB_DESCRIPTION)
            this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(data.UNQ_JOB_ID)
            this.stoneIssueDetailsFrom.controls.subjobDes.setValue(data.DESCRIPTION)
            this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(data.DESIGN_CODE)
            this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(data.PART_CODE)
            this.stoneIssueDetailsFrom.controls.salesorderno.setValue(data.CUSTOMER_CODE)
            // if (data[0].DESIGN_TYPE && data[0].DESIGN_TYPE == "DIAMOND") {
            //   this.stoneIssueDetailsFrom.controls.DIVCODE.setValue("L");
            // } else {
            //   this.stoneIssueDetailsFrom.controls.DIVCODE.setValue("Z");
            // }
            this.overlayjobNumberSearch.closeOverlayPanel()
            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            this.stoneIssueDetailsFrom.controls.jobNumber.setValue('')
            this.showOverleyPanel(event, 'jobNumber')

          }
        } else {
          this.overlayjobNumberSearch.closeOverlayPanel()
          this.stoneIssueDetailsFrom.controls.jobNumber.setValue('')
          this.comService.toastErrorByMsgId('MSG1747')
        } return
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
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
