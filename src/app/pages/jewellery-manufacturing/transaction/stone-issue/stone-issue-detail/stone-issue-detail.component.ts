import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
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
  [x: string]: any;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Output() gridDetail = new EventEmitter<any>();
  @Input() data!: any;
  @Input() isViewChangeJob: boolean = true;
  @Input() content!: any;
  @ViewChild('overlayjobNumberSearch') public overlayjobNumberSearch!: MasterSearchComponent;
  @ViewChild('overlayprocessSearch') public overlayprocessSearch!: MasterSearchComponent;
  @ViewChild('overlayworkerSearch') public overlayworkerSearch!: MasterSearchComponent;
  @ViewChild('overlayDivCodeSearch') public overlayDivCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaystockCodeSearch') public overlaystockCodeSearch!: MasterSearchComponent;
  @ViewChild('overlaylocationSearch') public overlaylocationSearch!: MasterSearchComponent;
  @ViewChild('overlaysubjobnoSearch') public overlaysubjobnoSearch!: MasterSearchComponent;
  columnhead1: any[] = [];
  stoneIssueGridData: any[] = [];
  serialNo: any;
  subJobNo: any;
  tableData: any[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  codeEnable: boolean = true;
  private subscriptions: Subscription[] = [];
  jobNumberDetailData: any[] = [];
  imagepath: any[] = [];
  viewMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  designType: string = 'DIAMOND';
  validLetters: string[] = ['C', 'D', 'L', 'M', 'P', 'W', 'Y'];
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
    WHERECONDITION: `JOB_CLOSED_ON is null and  Branch_code = '${this.comService.branchCode}'`,
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
    LOOKUPID: 271,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "@DIVISION='',@JOBNO='',@SUBJOBNO='',@STOCKCODE='',@LOOKUPFLAG=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  divCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 273,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `@SubJobNumber='',  @DivisionCode='L', @DesignType='DIAMOND'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subJobNoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 275,
    SEARCH_FIELD: 'UNQ_JOB_ID',
    SEARCH_HEADING: 'Sub Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: `isnull(WAX_STATUS,'') <> 'I' and Branch_code = '${this.comService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }
  setSubJobCondition() {
    let form = this.stoneIssueDetailsFrom.value;
    this.subJobNoCodeData.WHERECONDITION = `isnull(WAX_STATUS,'') <> 'I' and Branch_code = '${this.comService.branchCode}'`
    this.subJobNoCodeData.WHERECONDITION += `and job_number='${this.comService.nullToString(form.jobNumber)}'`
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
    size: [''],
    SIEVE_SET: [''],
    unitrate: [''],
    sieve: [''],
    SIEVE_DESC: [''],
    amount: [''],
    PICTURE_PATH: [''],
    color: [''],
    stockbal: [''],
    pointerwt: [''],
    otheratt: [''],
    remarks: [''],
    consignment: [false],
    VOCTYPE: [''],
    GROSS_WT: [''],
    RATEFC: [''],
    VOCNO: [''],
    VOCDATE: [''],
    JOB_DATE: [''],
    SUB_STOCK_CODE: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    KARAT_CODE: [''],
    DIVCODE: [''],
    DESIGN_TYPE: [''],
    JOB_SO_NUMBER: [''],
    Location: [''],
    METAL_STONE: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    FLAG: [null]
  });
  userId: any;


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
    this.dataTochild()
    this.setOnLoadDetails()
  }
  checkContent() {
    if (this.content && this.content.FLAG) {
      this.stoneIssueDetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      switch (this.content?.FLAG) {
        case 'VIEW':
          this.viewMode = true;
          break;
        case 'EDIT':
          this.editMode = true;
          this.viewMode = true;
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
    if (!this.content.FLAG) return
    this.branchCode = this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE;
    this.stoneIssueDetailsFrom.controls.VOCTYPE.setValue(this.content.VOCTYPE || this.content.HEADERDETAILS.VOCTYPE)
    this.stoneIssueDetailsFrom.controls.VOCNO.setValue(this.content.VOCNO || this.content.HEADERDETAILS.VOCNO)
    this.stoneIssueDetailsFrom.controls.VOCDATE.setValue(this.content.VOCDATE || this.content.HEADERDETAILS.VOCDATE)
    this.stoneIssueDetailsFrom.controls.BRANCH_CODE.setValue(this.content.BRANCH_CODE || this.content.HEADERDETAILS.BRANCH_CODE)
    this.stoneIssueDetailsFrom.controls.YEARMONTH.setValue(this.content.YEARMONTH || this.content.HEADERDETAILS.YEARMONTH)
    this.stoneIssueDetailsFrom.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE || this.content.HEADERDETAILS.currency)
    this.stoneIssueDetailsFrom.controls.CURRENCY_RATE.setValue(this.content.CURRENCY_RATE || this.content.HEADERDETAILS.currencyrate)
    this.stoneIssueDetailsFrom.controls.worker.setValue(this.content.worker || this.content.HEADERDETAILS.worker)
    this.stoneIssueDetailsFrom.controls.workername.setValue(this.content.workername || this.content.HEADERDETAILS.workername)


    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(this.content.JOB_DESCRIPTION?.toUpperCase())
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.content.UNQ_JOB_ID)
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(this.content.JOB_DESCRIPTION?.toUpperCase())
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
    this.stoneIssueDetailsFrom.controls.Location.setValue(this.content.LOCTYPE_CODE)
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(this.content.SIEVE_SET)
    this.stoneIssueDetailsFrom.controls.remarks.setValue(this.content.D_REMARKS)
    this.stoneIssueDetailsFrom.controls.amount.setValue(this.content.AMOUNTLC)
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.stoneIssueDetailsFrom.controls.carat.setValue(this.content.GROSS_WT)
    this.stoneIssueDetailsFrom.controls.otheratt.setValue(this.content.OTHER_ATTR)
    this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(this.content.PART_CODE)
    this.stoneIssueDetailsFrom.controls.batchid.setValue(this.content.SUB_STOCK_CODE)
    this.stoneIssueDetailsFrom.controls.consignment.setValue(this.content.CONSIGNMENT)
    this.setValueWithDecimal('unitrate', 0, 'AMOUNT')
    this.setValueWithDecimal('amount', 0, 'AMOUNT')
    this.setValueWithDecimal('pointerwt', 0, 'FOUR')
    this.setValueWithDecimal('stockbal', 0, 'THREE')
    this.setValueWithDecimal('carat', 0, 'METAL')
    this.getImageData()
    this.CollectPointerWtValidation()
    this.CollectRate()
  }

  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.stoneIssueDetailsFrom.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value, Decimal)
    )
  }

  setOnLoadDetails() {
    let data = this.content.HEADERDETAILS
    this.stoneIssueDetailsFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
    this.stoneIssueDetailsFrom.controls.VOCNO.setValue(data.VOCNO)
    this.stoneIssueDetailsFrom.controls.VOCDATE.setValue(data.VOCDATE)
    let branchParam = this.comService.allbranchMaster;
    // Set LOCTYPE_CODE only if it's not already set
    if (!this.stoneIssueDetailsFrom.controls.Location.value) {
      this.stoneIssueDetailsFrom.controls.Location.setValue(branchParam.DMFGMLOC);
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

  locationCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.stoneIssueDetailsFrom.controls.Location.setValue(e.LOCATION_CODE);
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
    if (this.checkCode()) return
    this.stoneIssueDetailsFrom.controls.process.setValue(e.PROCESS_CODE);
    this.stoneIssueDetailsFrom.controls.processname.setValue(e.DESCRIPTION);
    this.workerCodeData.WHERECONDITION = `@strProcess='${e.PROCESS_CODE}',@blnActive=1`
  }

  workerCodeSelected(e: any) {
    if (this.checkCode()) return
    this.stoneIssueDetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneIssueDetailsFrom.controls.workername.setValue(e.DESCRIPTION);
    this.processCodeData.WHERECONDITION = `@strWorker='${e.WORKER_CODE}',@strCurrentUser='${this.comService.userName}'`
  }
  divCodeSelected(e: any) {
    if (this.checkCode()) return
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(e.Division_Code);
    this.divisionCodeValidate(event)

  }
  subJobNoCodeSelected(e: any) {
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(e.UNQ_JOB_ID);
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(e.PART_CODE);
    this.subJobNumberValidate()
  }

  stockCodeSelected(e: any) {
    if (this.checkCode()) return
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(e.STOCK_DESCRIPTION);
    // this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(e.DivCode);

    this.stoneIssueDetailsFrom.controls.pieces.setValue(e.Pcs)
    this.stoneIssueDetailsFrom.controls.size.setValue(e.SIZE)
    this.stoneIssueDetailsFrom.controls.sieve.setValue(e.SIEVE)
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(e.SIEVE_SET)
    this.stoneIssueDetailsFrom.controls.color.setValue(e.COLOR)
    this.stoneIssueDetailsFrom.controls.unitrate.setValue(
      this.comService.emptyToZero(e.rate)
    )
    this.stoneIssueDetailsFrom.controls.shape.setValue(e.SHAPE)
    this.stoneIssueDetailsFrom.controls.amount.setValue(e.AmountLC)
    this.stoneIssueDetailsFrom.controls.pointerwt.setValue(e.Weight)
    this.stoneIssueDetailsFrom.controls.batchid.setValue(e.STOCK_CODE);

    this.stockCodeValidate(event)
  }
  setStockCodeWhereCondition() {
    let form = this.stoneIssueDetailsFrom.value;
    this.stockCodeData.WHERECONDITION = `@DIVISION='${this.comService.nullToString(form.DIVCODE)}',`
    this.stockCodeData.WHERECONDITION += `@JOBNO='${this.comService.nullToString(form.jobNumber)}',`
    this.stockCodeData.WHERECONDITION += `@SUBJOBNO='${this.comService.nullToString(form.subjobnumber)}',`
    this.stockCodeData.WHERECONDITION += `@STOCKCODE='${this.comService.nullToString(form.stockCode)}',@LOOKUPFLAG=1`
    // this.stockCodeData.WHERECONDITION += `@BRANCHCODE='${this.comService.nullToString(this.comService.branchCode)}'`
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

    // If the field is empty or view mode is active, return early
    if (event.target.value === '' || this.viewMode === true) return;

    let param = {
      "PAGENO": LOOKUPDATA.PAGENO,
      "RECORDS": LOOKUPDATA.RECORDS,
      "LOOKUPID": LOOKUPDATA.LOOKUPID,
      "ORDER_TYPE": LOOKUPDATA.SEARCH_VALUE ? 1 : 0,
      "WHERECONDITION": LOOKUPDATA.WHERECONDITION,
      "searchField": LOOKUPDATA.SEARCH_FIELD,
      "searchValue": LOOKUPDATA.SEARCH_VALUE
    };

    // Show a loading message
    this.comService.showSnackBarMsg('MSG81447');

    let Sub: Subscription = this.dataService.postDynamicAPI('MasterLookUp', param)
      .subscribe((result) => {
        // Close the loading message
        this.comService.closeSnackBarMsg();

        let data = result.dynamicData[0];

        if (data && data.length > 0) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE !== '') {
            let searchResult = this.comService.searchAllItemsInArray(data, LOOKUPDATA.SEARCH_VALUE);

            if (searchResult && searchResult.length > 0) {
              let matchedItem = searchResult[0]; // Assuming the first match is correct

              // Set the description based on the form control (worker or process)
              if (FORMNAME === 'worker') {
                this.stoneIssueDetailsFrom.controls.workername.setValue(matchedItem.DESCRIPTION); // Set worker description
              } else if (FORMNAME === 'process') {
                this.stoneIssueDetailsFrom.controls.processname.setValue(matchedItem.DESCRIPTION);// Set process description
                this.processCodeSelected(matchedItem);
              }

            } else {
              // If no matching data is found, clear the input and show an error
              this.comService.toastErrorByMsgId('No data found');
              this.stoneIssueDetailsFrom.controls[FORMNAME].setValue('');
              LOOKUPDATA.SEARCH_VALUE = '';

              // Show the overlay panel for the form (worker or process)
              switch (FORMNAME) {
                case 'worker':
                  this.showOverleyPanel(event, 'worker');
                  break;
                case 'process':
                  this.showOverleyPanel(event, 'process');
                  break;
                default:
              }
            }
          }
        }
      }, err => {
        // If there's an error, show a toast message
        this.comService.toastErrorByMsgId('MSG2272'); // Error occurred, please try again
      });

    // Add the subscription to the subscriptions array
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
      case 'DIVCODE':
        this.overlayDivCodeSearch.showOverlayPanel(event);
        break;
      case 'subjobnumber':
        this.overlaysubjobnoSearch.showOverlayPanel(event);
        break;
      default:

    }
  }
  dataTochild(dataToChild?: any) {
    this.stoneIssueDetailsFrom.controls.worker.setValue(this.content.WORKER_CODE || this.content.HEADERDETAILS.worker)
    this.stoneIssueDetailsFrom.controls.workername.setValue(this.content.WORKER_NAME || this.content.HEADERDETAILS.workername)
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value.toUpperCase()
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
          this.stoneIssueDetailsFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'Location' || FORMNAME === 'subjobnumber') {
            this.showOverleyPanel(event, FORMNAME);
          }
          {
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
      "VOCDATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(form.VOCDATE),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.comService.nullToString(form.subjobnumber),
      "JOB_DESCRIPTION": this.comService.nullToString(form.jobDes?.toUpperCase()),
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
      "GROSS_WT": this.comService.emptyToZero(form.carat),
      "CURRENCY_CODE": this.comService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.comService.emptyToZero(form.CURRENCY_RATE),
      "RATEFC": 0,
      "RATELC": this.comService.emptyToZero(form.RATELC),
      "AMOUNTFC": 0,
      "AMOUNTLC": this.comService.emptyToZero(form.amount),
      "PROCESS_CODE": this.comService.nullToString(form.process),
      "PROCESS_NAME": this.comService.nullToString(form.processname),
      "WORKER_CODE": this.comService.nullToString(form.worker),
      "WORKER_NAME": this.comService.nullToString(form.workername),
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": this.comService.nullToString(form.Location),
      "PICTURE_NAME": "",
      "PART_CODE": this.comService.nullToString(form.PART_CODE),
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.comService.nullToString(this.comService.branchCode),
      "DT_VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "DT_VOCNO": this.comService.emptyToZero(form.VOCNO),
      "DT_YEARMONTH": this.comService.nullToString(this.yearMonth),
      "CONSIGNMENT": this.onchangeCheckBox(form.consignment),
      "SIEVE_SET": this.comService.nullToString(form.SIEVE_SET),
      "SUB_STOCK_CODE": this.comService.nullToString(form.batchid),
      "D_REMARKS": this.comService.nullToString(form.remarks),
      "SIEVE_DESC": this.comService.nullToString(form.SIEVE_DESC),
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.comService.nullToString(form.otheratt),
    }
  }
  /**use: to save data to grid*/
  formSubmit(flag: any) {
    const carat = this.stoneIssueDetailsFrom.controls['carat'].value;
    const pcsValue = this.stoneIssueDetailsFrom.controls['pieces'].value;
    // Check if carat is 0
    if (carat === 0 || carat === '0' || carat == null) {
      this.comService.toastErrorByMsgId('MSG1095');
      return;
    }
    if (pcsValue === 0 || pcsValue === '0' || pcsValue == null) {
      this.comService.toastErrorByMsgId('MSG3665');
      return;
    }
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
    // Check if stock code is filled
    const stockCode = this.stoneIssueDetailsFrom.controls.stockCode.value; // Assuming stockCode is the control name

    if (!stockCode || stockCode.trim() === '') {
      // Show an error alert if stock code is not filled
      Swal.fire({
        title: 'Error',
        text: 'Please fill the Stock Code before changing the Job Number!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'OK'
      });
      return;
    }

    // If stock code is filled, proceed with the form submission
    this.formSubmit('CONTINUE');
    this.stoneIssueDetailsFrom.reset();

    if (this.tableData && this.tableData.length > 0) {
      // Loop through each row in tableData and reset the relevant fields
      this.tableData.forEach((row) => {
        row.STOCK_CODE = '';
        row.DIVCODE = '';
        row.SUB_STOCK_CODE = '';
        row.SUB_STOCK_CODE = '';
        row.PCS = '';
        row.CARATWT_TO = '';
        row.LOCTYPE_CODE = '';
        row.CONSIGNMENT = false;
        row.RATEFC = '';
        row.AMOUNTFC = '';
        row.OTHER_ATTR = '';
        row.SHAPE = '';
        row.COLOR = '';
        row.CLARITY = '';
        row.SIZE = '';
        row.SIEVE_SET = '';
        row.SIEVE_DESC = '';
        row.D_REMARKS = '';
        row.ISS_STN_PCS = '';
        row.ISS_STN_WT = '';
        row.BAL_STN_PCS = '';
        row.BAL_STN_WT = '';
        row.POINTER_WT = '';
        row.PCS_VARIANCE = '';
        row.WEIGHT_VARIANCE = '';
      });
    }
  }

  resetStockDetails() {
    this.stoneIssueDetailsFrom.controls.stockCode.setValue('')
    this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue('')
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('')
    this.stoneIssueDetailsFrom.controls.carat.setValue('')
    this.stoneIssueDetailsFrom.controls.size.setValue('')
    this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue('')
    this.stoneIssueDetailsFrom.controls.sieve.setValue('')
    this.stoneIssueDetailsFrom.controls.unitrate.setValue('')
    this.stoneIssueDetailsFrom.controls.color.setValue('')
    this.stoneIssueDetailsFrom.controls.pointerwt.setValue('')
    this.stoneIssueDetailsFrom.controls.stockbal.setValue('')
    this.stoneIssueDetailsFrom.controls.pieces.setValue('')
    this.setValueWithDecimal('PURE_WT', 0, 'THREE')
    this.setValueWithDecimal('GROSS_WT', 0, 'METAL')
    this.setValueWithDecimal('RATEFC', 0, 'METAL')
    this.setValueWithDecimal('PURITY', 0, 'PURITY')
    this.setValueWithDecimal('NET_WT', 0, 'THREE')
    this.setValueWithDecimal('KARAT', 0, 'THREE')
    this.setValueWithDecimal('STONE_WT', 0, 'STONE')
    this.tableData[0].STOCK_CODE = ''
  }

  CollectRate() {
    let form = this.stoneIssueDetailsFrom.value;
    let postData = {
      "SPID": "140",
      "parameter": {
        SubJobNumber: this.comService.nullToString(form.subjobnumber),
        SubStockCode: this.comService.nullToString(form.batchid),
        StockCode: this.comService.nullToString(form.stockCode),
        BranchCode: this.comService.nullToString(this.branchCode),
        DEFPRICESMANUF: '',
        VocDate: this.comService.nullToString(form.VOCDATE),
        Divcode: this.comService.nullToString(form.DIVCODE)
      }
    };
    this.comService.showSnackBarMsg('MSG81447'); // Loading message
    // API call to execute the stored procedure
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe(
        (result) => {
          this.comService.closeSnackBarMsg();
          if (result.status === "Success" && result.dynamicData && result.dynamicData.length > 0) {
            let data = result.dynamicData[1]
            let RATEFC = data[0].RATEFC;
            this.stoneIssueDetailsFrom.controls.unitrate.setValue(RATEFC)
            this.setValueWithDecimal('unitrate', RATEFC, 'AMOUNT')
          } else {
            this.comService.toastErrorByMsgId('MSG1747'); // "Not Found" error message
          }
        },
        (err) => {
          // Handle errors during the API call
          this.comService.closeSnackBarMsg();
          this.comService.toastErrorByMsgId('MSG1531');
        }
      );
    this.subscriptions.push(Sub);
  }

  CalculatePiecesAndPointerWT() {
    // Get the form values
    const pieces = this.stoneIssueDetailsFrom.controls.pieces.value || 0;
    const pointerwt = this.stoneIssueDetailsFrom.controls.pointerwt.value || 0;
    const calculatedCarat = pieces * pointerwt;
    this.stoneIssueDetailsFrom.controls.carat.setValue(calculatedCarat.toFixed(3));
    this.CollectRate()
    this.checkPcsRequired()
    this.CalculateCaratAndUnitrate()
  }

  CalculateCaratAndUnitrate() {
    // Ensure the values are numbers and handle null or undefined cases
    const carat = parseFloat(this.stoneIssueDetailsFrom.controls.carat.value) || 0;
    const unitrate = parseFloat(this.stoneIssueDetailsFrom.controls.unitrate.value) || 0;
    const calculateamount = carat * unitrate;
    this.stoneIssueDetailsFrom.controls.amount.setValue(calculateamount);
  }

  CollectPointerWtValidation() {
    let postData = {
      "SPID": "139",
      "parameter": {
        DIVCODE: this.stoneIssueDetailsFrom.value.DIVCODE,
        SHAPE: this.stoneIssueDetailsFrom.value.shape,
        SIEVE: this.stoneIssueDetailsFrom.value.sieve,
        SIEVESET: this.stoneIssueDetailsFrom.value.SIEVE_SET,
        SIZE: this.stoneIssueDetailsFrom.value.size
      }
    };
    this.comService.showSnackBarMsg('MSG81447'); // Loading message
    // API call to execute the stored procedure
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe(
        (result) => {
          this.comService.closeSnackBarMsg();
          if (result.status === "Success" && result.dynamicData && result.dynamicData.length > 0) {
            let data = result.dynamicData[0]
            let pointerWeight = data[0].POINTERWEIGHT;
            this.stoneIssueDetailsFrom.controls.pointerwt.setValue(pointerWeight);
            // let pcs = data[0].PCS;
            // this.stoneIssueDetailsFrom.controls.pieces.setValue(pcs)

          } else {
            this.comService.toastErrorByMsgId('MSG1747'); // "Not Found" error message
          }
        },
        (err) => {
          // Handle errors during the API call
          this.comService.closeSnackBarMsg();
          this.comService.toastErrorByMsgId('MSG1531');
        }
      );
    this.subscriptions.push(Sub);
  }

  divisionCodeValidate(event: any) {
    const divisionCode = event.target.value?.trim();
    this.clearStockDetails();
    if (!divisionCode) return;
    const postData = {
      SPID: "135",
      parameter: {
        SubJobNumber: this.stoneIssueDetailsFrom.value.subjobnumber || '',
        DivisionCode: divisionCode,
        DesignType: this.stoneIssueDetailsFrom.value.DESIGN_TYPE || '',
      },
    };
    this.comService.showSnackBarMsg('MSG81447');

    const Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe(
        (result) => {
          this.comService.closeSnackBarMsg();

          if (result.status === "Success" && result.dynamicData && result.dynamicData.length > 0) {
            const data = result.dynamicData[0];
            if (!data || data.length === 0) {
              this.comService.toastErrorByMsgId('MSG1531');
            }
          } else {
            this.comService.toastErrorByMsgId('MSG1531');
          }
        },
        (error) => {
          this.comService.closeSnackBarMsg();
          this.comService.toastErrorByMsgId('MSG1531');
        }
      );

    this.subscriptions.push(Sub);
  }

  clearStockDetails() {
    this.stoneIssueDetailsFrom.patchValue({
      stockCode: '',
      stockCodeDes: '',
    });
  }

  validateManualEntry(event: any) {
    const enteredValue = event.target.value.toUpperCase(); // Convert entered value to uppercase
    const validLetters = this.validLetters; // The array of valid letters

    // Check if the entered value is in the list of valid letters
    if (!validLetters.includes(enteredValue)) {
      // Show an error message if invalid
      this.comService.toastErrorByMsgId('MSG1531'); // Example: "Invalid entry, only certain letters allowed"

      // Clear the field if invalid value
      this.stoneIssueDetailsFrom.controls.DIVCODE.setValue('');
      return;
    }
    console.log('Valid value entered:', enteredValue);

  }

  stockCodeValidate(event: any) {
    if (this.viewMode) return;
    // Check if the input is empty
    if (event && event.target.value === '') {
      return;  // Exit if no input
    }
    this.setStockCodeWhereCondition()
    // Prepare the data for the API call
    let postData = {
      "SPID": "132",
      "parameter": {
        DIVISION: this.stoneIssueDetailsFrom.value.DIVCODE,
        JOBNO: this.stoneIssueDetailsFrom.value.jobNumber,
        SUBJOBNO: this.stoneIssueDetailsFrom.value.subjobnumber,
        STOCKCODE: this.stoneIssueDetailsFrom.value.stockCode,
        BRANCHCODE: this.comService.branchCode,
        SUBSTOCKCODE: this.stoneIssueDetailsFrom.value.stockCode,
        LOCATION: this.stoneIssueDetailsFrom.value.Location

      }
    };
    this.comService.showSnackBarMsg('MSG81447');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg();
        if (result.status === "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0];
          // Check if VALID_STOCK is 0, indicating an invalid stock code
          if (data[0].VALID_STOCK === 0) {
            // Clear the stock code and open the lookup overlay
            this.overlaystockCodeSearch.closeOverlayPanel();
            this.stoneIssueDetailsFrom.controls.stockCode.setValue('');  // Clear stock code
            this.comService.toastErrorByMsgId('MSG1531');  // Show error message
            this.showOverleyPanel(event, 'stockCode');  // Automatically open the lookup overlay
          } else {
            let stockDetails = data[0];
            this.stoneIssueDetailsFrom.controls.stockCodeDes.setValue(stockDetails.STOCK_DESCRIPTION);
            this.stoneIssueDetailsFrom.controls.SIEVE_SET.setValue(stockDetails.SIEVE_SET);
            this.stoneIssueDetailsFrom.controls.size.setValue(stockDetails.SIZE);
            this.stoneIssueDetailsFrom.controls.batchid.setValue(stockDetails.STOCK_CODE);
            this.stoneIssueDetailsFrom.controls.sieve.setValue(stockDetails.SIEVE);
            this.stoneIssueDetailsFrom.controls.SIEVE_DESC.setValue(stockDetails.SIEVE_DESC);
            this.stoneIssueDetailsFrom.controls.pieces.setValue(stockDetails.PCS);
            this.stoneIssueDetailsFrom.controls.shape.setValue(stockDetails.SHAPE);
            this.stoneIssueDetailsFrom.controls.color.setValue(stockDetails.COLOR);
            let DIVCODE = this.comService.nullToString(this.stoneIssueDetailsFrom.value.DIVCODE)
            if (DIVCODE == "D" || DIVCODE == "W" || DIVCODE == "M") {
              this.comService.formControlSetReadOnly('carat', true)
              this.setValueWithDecimal('carat', '1', 'THREE')
              this.stoneIssueDetailsFrom.controls.pieces.setValue('1');
            } else {
              let stock_transaction = result.dynamicData[1] || []
              if (stock_transaction.length > 0) {
                stock_transaction = this.comService.arrayEmptyObjectToString(stock_transaction)
                let lblBalanc = stock_transaction[0]["GROSSWT"] || 0;
                this.comService.formControlSetReadOnly('carat', false)
                this.setValueWithDecimal('stockbal', lblBalanc, 'THREE')
              }
              this.setValueWithDecimal('carat', '0', 'THREE')
            }
            // Additional validation logic
            this.CollectRate()
            if (DIVCODE == "L" || DIVCODE == "C" || DIVCODE == "Z") {
              this.CollectPointerWtValidation();
            }
            let form = this.stoneIssueDetailsFrom.value;
            let SAmount = this.comService.emptyToZero(form.carat) * this.comService.emptyToZero(form.unitrate)
            this.setValueWithDecimal('amount', SAmount, 'AMOUNT')
            this.BoqAlert()
          }

        } else {
          // Handle when no valid stock data is returned
          this.overlaystockCodeSearch.closeOverlayPanel();
          this.comService.toastErrorByMsgId('MSG1747');  // Show "Not Found" error message
          this.stoneIssueDetailsFrom.controls.stockCode.setValue('');  // Clear stock code
        }
      }, err => {
        // Handle error in API call
        this.comService.closeSnackBarMsg();
        this.comService.toastErrorByMsgId('MSG1531');  // Show general error message
        this.stoneIssueDetailsFrom.controls.stockCode.setValue('');  // Clear stock code
        this.showOverleyPanel(event, 'stockCode');  // Automatically open the lookup overlay
      });

    this.subscriptions.push(Sub);
  }

  emptyToZero(val: any) {
    return this.commonService.emptyToZero(val)
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

  FillStnRequiredDetail(event?: any) {
    if (event?.target.value == '' || this.viewMode) return;
    let postData = {
      "SPID": "131",
      "parameter": {
        'strjob_Number': this.stoneIssueDetailsFrom.value.jobNumber,
        'strUnq_Job_Id': this.stoneIssueDetailsFrom.value.subjobnumber,
        'strBranch_Code': this.comService.branchCode,
        'strJObPcsWise': '',
        'strLocTypeCode': ''
      }
    }
    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          this.tableData = result.dynamicData[0]
          console.log(JSON.stringify(this.tableData));
          // this.tableData = result.dynamicData[1] || []
          // this.columnhead1 = Object.keys(this.tableData[0])

          this.tableData.forEach((row) => {
            if (!row.LOCTYPE_CODE || row.LOCTYPE_CODE.trim() === "") {
              row.LOCTYPE_CODE = '000GEN';
            }
          });
          console.log(this.tableData);
        } else {
          // this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  FillUniqueDesignDetails() {
    if (this.viewMode || this.editMode) return;
    let postData = {
      "SPID": "142",
      "parameter": {
        'subJobNum ': this.stoneIssueDetailsFrom.value.subjobnumber,
        'strBranch ': this.comService.nullToString(this.branchCode),
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData.length > 0) {
          let data = result.dynamicData[0]
          console.log(data, 'design')
          this.stoneIssueDetailsFrom.controls.salesorderno.setValue(data[0].job_so_number)
        }
      })
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
          let data = result.dynamicData[0] || []
          this.data = data[0].UNQ_JOB_ID;
          console.log(data[0].UNQ_JOB_ID, 'data')
          this.stoneIssueDetailsFrom.controls.process.setValue(data[0].PROCESS.toUpperCase())
          this.stoneIssueDetailsFrom.controls.processname.setValue(data[0].PROCESSDESC.toUpperCase())
          this.stoneIssueDetailsFrom.controls.worker.setValue(data[0].WORKER.toUpperCase())
          this.stoneIssueDetailsFrom.controls.workername.setValue(data[0].WORKERDESC.toUpperCase())
          this.stoneIssueDetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(data[0].UNQ_JOB_ID)
          // this.tableData = result.dynamicData[1] || []
          // this.columnhead1 = Object.keys(this.tableData[0])
          this.FillStnRequiredDetail()
          this.FillUniqueDesignDetails()
          this.getImageData()

          // this.overlaysubjobnoSearch.closeOverlayPanel();

        } else {
          // Handle case where no data is found
          // this.comService.toastErrorByMsgId('MSG1531');
          // this.stoneIssueDetailsFrom.controls.subjobnumber.setValue('');
          // this.stoneIssueDetailsFrom.controls.subjobDes.setValue('');
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
    if (event.target.value == '' || this.viewMode) return;

    this.subJobNoCodeData.WHERECONDITION = `
    Job_Number = '${this.stoneIssueDetailsFrom.controls.jobNumber.value}'
    and Branch_code = '${this.comService.branchCode}'
    AND isnull(WAX_STATUS, '') <> 'I'
  `;
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.comService.branchCode),
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
          if (data[0] && data[0]?.UNQ_JOB_ID != '') {
            this.jobNumberDetailData = data
            console.log(JSON.stringify(data), 'pick')
            this.stoneIssueDetailsFrom.controls.jobDes.setValue(data[0].JOB_DESCRIPTION?.toUpperCase())
            this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(data[0].UNQ_JOB_ID)
            this.stoneIssueDetailsFrom.controls.subjobDes.setValue(data[0].DESCRIPTION?.toUpperCase())
            this.stoneIssueDetailsFrom.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.stoneIssueDetailsFrom.controls.PART_CODE.setValue(data[0].PART_CODE)
            // this.stoneIssueDetailsFrom.controls.salesorderno.setValue(data[0].CUSTOMER_CODE)
            this.stoneIssueDetailsFrom.controls.DIVCODE.setValue("L");
            this.stoneIssueDetailsFrom.controls.DESIGN_TYPE.setValue(this.designType)
            // if (data[0].DESIGN_TYPE && data[0].DESIGN_TYPE == "DIAMOND") {
            //   this.stoneIssueDetailsFrom.controls.DIVCODE.setValue("L");
            // } else {
            //   this.stoneIssueDetailsFrom.controls.DIVCODE.setValue("Z");
            // }
            // this.overlayjobNumberSearch.closeOverlayPanel()
            this.setSubJobCondition()
            this.subJobNumberValidate()
            this.setStockCodeWhereCondition()
            this.codeEnabled()
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
  codeEnabled() {
    if (this.stoneIssueDetailsFrom.value.jobNumber == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }
  checkCode(): boolean {
    const jobNumberValue = this.stoneIssueDetailsFrom.controls['jobNumber'].value;
    if (!jobNumberValue || jobNumberValue.trim() === '') {
      this.comService.toastErrorByMsgId('MSG3783');
      return true;
    }
    return false;
  }
  // Grid Pcs Max Length  
  pcsEditorOptions = {
    onInput: (e: any) => {
      const maxLength = 10;
      const input = e.event.target;
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength); // Limit the value length
      }
    },
  };
  RemarkEditorOptions = {
    onInput: (e: any) => {
      const maxLength = 40;
      const input = e.event.target;
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength); // Limit the value length
      }
    },
  };
  CaratEditorOptions = {
    onInput: (e: any) => {
      const maxLength = 10;
      const input = e.event.target;
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
        this.formatMainGrid()
      }
    },
  };

  formatMainGrid() {
    this.tableData.forEach((item: any, index: any) => {
      item.CARATWT_TO = this.comService.setCommaSerperatedNumber(item.CARATWT_TO, 'METAL')
    })
  }
  customizeText(data: any) {
    if (data) {
      const decimalPlaces = 3;
      return data.value.toFixed(decimalPlaces)
    }
  }
  SaveGridData() {
    let gridData = this.tableData
    console.log(gridData)
    this.gridDetail.emit(gridData);
  }

  dataGridConfig = {
    columns: [
      {
        dataField: 'DIVCODE',
        caption: 'DIVCODE',
        cellTemplate: 'DivCodetemp',
        validationRules: [{ type: 'required', message: 'User Id is required' }]
      },
      {
        dataField: 'STOCK_CODE',
        caption: 'Stock Code',
        cellTemplate: 'StockCodetemp',
        validationRules: [{ type: 'required', message: 'User Id is required' }]
      },
      {
        dataField: 'LOCTYPE_CODE',
        caption: 'Location',
        cellTemplate: 'locationCodetemp',
        validationRules: [{ type: 'required', message: 'User Id is required' }]
      },
      // Other columns in your DataGrid
    ],
    // Other DataGrid configuration options
  };
  GriddivCodeSelected(data: any, value: any, controlName: string) {
    let userData = [];
    userData = this.tableData.filter((item: any) => item.DIVCODE == data.Division_Code)
    console.log(this.tableData)
    if (userData.length > 0) {
      this.comService.toastErrorByMsgId('MSG1932')
    }
    else {
      console.log(value);
      console.log(this.tableData);
      this.tableData[0].DIVCODE = data.Division_Code;
      this.userId = data.Division_Code;
    }
  }
  GridstockCodeSelected(data: any, value: any, controlName: string) {
    let userData = [];
    userData = this.tableData.filter((item: any) => item.STOCK_CODE == data.STOCK_CODE)
    console.log(this.tableData)
    if (userData.length > 0) {
      this.comService.toastErrorByMsgId('MSG1932')
    }
    else {
      console.log(value);
      console.log(this.tableData);
      this.tableData[0].STOCK_CODE = data.STOCK_CODE;
      this.userId = data.STOCK_CODE;
    }
  }
  GridlocationCodeSelected(data: any, value: any, controlName: string) {
    let userData = [];
    userData = this.tableData.filter((item: any) => item.LOCTYPE_CODE == data.LOCATION_CODE)
    console.log(this.tableData)
    if (userData.length > 0) {
      this.comService.toastErrorByMsgId('MSG1932')
    }
    else {
      console.log(value);
      console.log(this.tableData);
      this.tableData[0].LOCTYPE_CODE = data.LOCATION_CODE;
      this.userId = data.LOCATION_CODE;
    }
  }

  BoqAlert() {
    const tableStockCodes = this.tableData.map((item: any) => item.STOCK_CODE);
    const formStockCode = this.stoneIssueDetailsFrom.value.stockCode;
    const stockExists = tableStockCodes.includes(formStockCode);

    if (!stockExists) {  // Check if stock code does not exist in component details (BOQ)

      // Show the SweetAlert confirmation dialog
      this.showConfirmationDialog("The Stock details not found in the BOQ. Do you want to continue?")
        .then((result) => {
          if (result.isConfirmed) {
            console.log("Continuing with validation...");
          } else {
            console.log("Action cancelled by user.");
            this.stoneIssueDetailsFrom.controls.stockCode.setValue(''); // Clear the stock code field
          }
        });
    }
  }

  // Function to check if grid PCS is greater than form PCS
  checkPcsRequired() {
    const tablePcs = this.tableData.map((item: any) => item.PCS);
    const formPieces = this.stoneIssueDetailsFrom.value.pieces;

    // Check if any grid PCS is greater than form PCS
    const gridHasGreaterPcs = tablePcs.some((gridPcs) => gridPcs > formPieces);

    if (gridHasGreaterPcs) {
      // Show confirmation dialog with the PCS message
      this.showConfirmationDialog("Issued Pcs is greater than the Required Pcs.")
        .then((result) => {
          if (result.isConfirmed) {
          } else {
            this.stoneIssueDetailsFrom.controls.pieces.setValue(''); // Clear the pieces field
          }
        });
    }
  }

  // Function to check if grid CARATWT_TO is greater than form carat
  checkCaratRequired() {
    const tableCarat = this.tableData.map((item: any) => item.CARATWT_TO);
    const formCarat = this.stoneIssueDetailsFrom.value.carat;

    // Check if any grid CARATWT_TO is greater than form carat
    const gridHasGreaterCarat = tableCarat.some((gridCarat) => gridCarat > formCarat);

    if (gridHasGreaterCarat) {
      // Show confirmation dialog with the carat message
      this.showConfirmationDialog("Issued Carat is greater than the Required Carat.")
        .then((result) => {
          if (result.isConfirmed) {
          } else {
            this.stoneIssueDetailsFrom.controls.carat.setValue(''); // Clear the carat field
          }
        });
    }
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
