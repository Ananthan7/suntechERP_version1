import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MeltingIssueDetailsComponent } from './melting-issue-details/melting-issue-details.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';



@Component({
  selector: 'app-melting-issue',
  templateUrl: './melting-issue.component.html',
  styleUrls: ['./melting-issue.component.scss']
})
export class MeltingIssueComponent implements OnInit {
  @ViewChild('meltingissueDetailScreen') public meltingissueDetailScreen!: NgbModal;
  @ViewChild('overlayMeltingType') overlayMeltingType!: MasterSearchComponent;
  @ViewChild('overlayjobNoSearch') overlayjobNoSearch!: MasterSearchComponent;
  @ViewChild('overlayprocesscode') overlayprocesscode!: MasterSearchComponent;
  @ViewChild('overlayworkercode') overlayworkercode!: MasterSearchComponent;
  @ViewChild('codeInput1') codeInput1!: ElementRef;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];
  router: any;
  onClose: any;
  modalRef: NgbModalRef | null = null
  dataToDetailScreen: any;
  modalReference!: NgbModalRef;
  columnhead: any[] = ['SRNO', 'DIV', 'Job No', 'Stock Code', 'Stock Description', 'Main Stock', 'Process', 'Worker', 'Pcs', 'Gross Weight', 'Purity', 'Pure Weight', 'Rate', 'Amount']
  columnheader: any[] = ['Sr#', 'SO No', 'Party Code', 'Party Name', 'Job Number', 'Job Description', 'Design Code', 'UNQ Design ID', 'Process', 'Worker', 'Metal Required', 'Metal Allocated', 'Allocated Pure Wt', 'Job Pcs']
  columnhead1: any[] = [{ title: 'SRNO', field: 'SRNO', format: '', alignment: 'left' },
  { title: 'Ingredients', field: 'Ingredients', format: '', alignment: 'left' },
  { title: 'QTY', field: 'STOCKCODE', format: '', alignment: 'left' },]
  db1: any[] = [
    { title: 'SRNO', field: 'SRNO', format: '', alignment: 'left' },
    { title: 'DIVISION', field: 'DIVISION', format: '', alignment: 'left' },
    { title: 'Stock Code', field: 'STOCKCODE', format: '', alignment: 'left' },
    { title: 'Description', field: 'DESCRIPTION', format: '', alignment: 'left' },
    { title: 'Alloy %', field: 'ALLOY', format: '', alignment: 'right' },
    { title: 'Alloy Qty', field: 'ALLOYQTY', format: '', alignment: 'right' },
    { title: 'Rate', field: 'RATE', format: '', alignment: 'right' },
    { title: 'Amount', field: 'AMOUNT', format: '', alignment: 'right' },
  ]
  @Input() content!: any;
  tableData: any[] = [];
  sequenceDetails: any[] = []
  voctype?: String;
  selectRowIndex: any;
  currentDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  jobNumberDetailData: any[] = [];
  meltingISsueDetailsData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  isSaved: boolean = false;
  editMode: boolean = false;
  isloading: boolean = false;
  codeEnable: boolean = true;
  isFieldsReadonly = false
  gridAmountDecimalFormat: any;
  isJobNumberSearchVisible: boolean = false;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  gridMetalDecimalFormat: any;
  detailsAdded: boolean = false;

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
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ISNULL(PROCESS_TYPE, '') = '3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,

  }

  MeltingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 94,
    SEARCH_FIELD: 'MELTYPE_CODE',
    SEARCH_HEADING: 'Melting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,

  }


  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 268,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: `@StrJob_Number='',@StrMeltingTypeKarat='',@StrColor ='',@StrBranch=${this.commonService.branchCode}`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  }

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({
    vocno: [''],
    meltingtype: [''],
    jobno: [''],
    jobdes: [''],
    processcode: [''],
    processdes: [''],
    worker: [''],
    workerdes: [''],
    subjobno: ['', [Validators.required]],
    subjobnodes: [''],
    color: [''],
    time: [''],  // Not in table
    remarks: [''],
    issued: [''],
    required: [''],
    allocated: [''],
    balance: [''],
    TotalgrossWt: [''],
    TotalpureWt: [''],
    subJobDescription: ['', [Validators.required]],
    process: [''],
    currency: [''],
    currencyrate: [''],
    jobpurity: [''],
    stockcode: [''],
    FLAG: [null],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    VOCNO: [''],
    MID: [0],
    Karat: [''],
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],
    MAIN_VOCTYPE: [''],
    UNQ_JOB_ID: [''],
  });


  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,) { }

  ngOnInit(): void {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.comService.allbranchMaster?.BAMTDECIMALS,
      currency: this.comService.compCurrency
    };
    // this.setNewFormValues()
    // this.voctype = this.commonService.getqueryParamMainVocType();
    this.meltingIssueFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType());
    this.setAllInitialValues()
    //this.content provide the data and flag from main grid to the form
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
        this.isFieldsReadonly = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.editMode = true;
        this.LOCKVOUCHERNO = true;
        this.isFieldsReadonly = true;
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.meltingIssueFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.generateVocNo()
      this.setNewFormValues()
      this.setvoucherTypeMaster()
      this.setCompanyCurrency()
    }

  }
  ngAfterViewInit() {
    // Focus on the first input
    if (this.codeInput1) {
      setTimeout(() => {
        this.codeInput1.nativeElement.focus();
      }, 2000); // Adjust the delay as needed
    }
  }
  setNewFormValues() {
    this.branchCode = this.commonService.branchCode;
    this.meltingIssueFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.meltingIssueFrom.controls.vocdate.setValue(this.currentDate)
    this.meltingIssueFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.meltingIssueFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.meltingIssueFrom.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()

  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.meltingIssueFrom.controls.vocdate.setValue(new Date(date))
    }
  }
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.meltingIssueFrom.controls.currency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
    this.meltingIssueFrom.controls.currencyrate.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value

    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.meltingIssueFrom.controls[FORMNAME].setValue('')

          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'processcode') {
            this.showOverleyPanel(event, 'processcode');
          } else if (FORMNAME === 'worker') {
            this.showOverleyPanel(event, 'worker');
          }
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);
  }

  setAllInitialValues() {
    if (!this.content?.FLAG) return
    let API = `JobMeltingIssueDJ/GetJobMeltingIssueDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.meltingISsueDetailsData = data.Details
          console.log(data, 'data')
          this.meltingIssueFrom.controls.MID.setValue(data.MID)
          this.meltingIssueFrom.controls.voctype.setValue(data.VOCTYPE)
          this.meltingIssueFrom.controls.vocno.setValue(data.VOCNO)
          this.meltingIssueFrom.controls.vocdate.setValue(new Date(data.VOCDATE))
          this.meltingIssueFrom.controls.processcode.setValue(data.PROCESS_CODE)
          this.meltingIssueFrom.controls.worker.setValue(data.WORKER_CODE)
          this.meltingIssueFrom.controls.workerdes.setValue(data.WORKER_DESC)
          this.meltingIssueFrom.controls.jobno.setValue(data.Details[0].JOB_NUMBER)
          this.meltingIssueFrom.controls.jobdes.setValue(data.Details[0].JOB_DESCRIPTION)
          this.meltingIssueFrom.controls.processdes.setValue(data.PROCESS_DESC)
          this.meltingIssueFrom.controls.color.setValue(data.COLOR)
          this.meltingIssueFrom.controls.meltingtype.setValue(data.MELTING_TYPE)
          this.meltingIssueFrom.controls.jobpurity.setValue(data.PURITY)
          // this.meltingIssueFrom.controls.StockDescription.setValue(data.STOCK_DESCRIPTION)

          this.meltingISsueDetailsData = data.Details
          console.log(this.meltingISsueDetailsData, 'data')
          this.formatMainGrid() //set to main grid
          this.meltingISsueDetailsData.forEach((element: any) => {
            this.tableData.push({
              jobno: element.JOB_NUMBER,
              jobNumDes: element.JOB_DESCRIPTION,
              processCode: element.PROCESS_CODE,
              processCodeDesc: element.PROCESS_NAME,
              workerCode: element.WORKER_CODE,
              workerCodeDes: element.WORKER_NAME,
              pcs: element.PCS,
              purity: element.PURITY,
              grossWeight: element.GROSS_WT,
              netWeight: element.NET_WT,
            })
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }
  toWorkercodeValidate(event: any) {
    if (event.target.value == '') {
      this.overlayMeltingType.showOverlayPanel(event)
      return
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (this.meltingIssueFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'meltingtype':
        this.overlayMeltingType.showOverlayPanel(event);
        break;
      case 'jobno':
        this.overlayjobNoSearch.showOverlayPanel(event);
        break;
      case 'processcode':
        this.overlayprocesscode.showOverlayPanel(event);
        break;
      case 'worker':
        this.overlayworkercode.showOverlayPanel(event);
        break;
      default:
    }
  }

  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.meltingIssueFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.meltingIssueFrom.value.vocno}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2007')
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.meltingIssueFrom.controls.vocno.setValue(resp.newvocno);
        }
      });
  }
 
  /**USE: to set currency from company parameter */
  // setCompanyCurrency() {
  //   let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
  //   this.meltingIssueFrom.controls.currency.setValue(CURRENCY_CODE);
  //   this.setCurrencyRate()
  // }
  // /**USE: to set currency from branch currency master */
  // setCurrencyRate() {
  //   const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.meltingIssueFrom.value.currency);
  //   if (CURRENCY_RATE.length > 0) {
  //     this.meltingIssueFrom.controls.currencyrate.setValue(
  //       this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
  //     );
  //   } else {
  //     this.meltingIssueFrom.controls.currency.setValue('')
  //     this.meltingIssueFrom.controls.currencyrate.setValue('')
  //     this.commonService.toastErrorByMsgId('MSG1531')
  //   }
  // }
  nullToStringSetValue(formControlName: string, value: any) {
    this.meltingIssueFrom.controls[formControlName].setValue(
      this.commonService.nullToString(value)
    )
    this.meltingIssueFrom.controls[formControlName] = this.commonService.nullToString(value)
  }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  jobnoCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.jobno.setValue(e.JOB_NUMBER);
    this.meltingIssueFrom.controls.jobdes.setValue(e.JOB_DESCRIPTION);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  timeCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.time.setValue(e.CODE);
  }
  MeltingCodeSelected(e: any) {
    console.log(e);

    // this.meltingIssueFrom.controls.meltingtype.setValue(e['Melting Type']);
    this.meltingIssueFrom.controls.meltingtype.setValue(e.MELTYPE_CODE);
    this.meltingIssueFrom.controls.Karat.setValue(e.KARAT_CODE)
    this.meltingTypeValidate()
  }
  ProcessCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.processcode.setValue(e.Process_Code);
    this.meltingIssueFrom.controls.processdes.setValue(e.Description);
  }
  WorkerCodeSelected(e: any) {
    console.log(e);
    this.meltingIssueFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssueFrom.controls.workerdes.setValue(e.DESCRIPTION);
    this.WorkerCodeValidate()
  }
  workerWhereCondtion() {
    let form = this.meltingIssueFrom.value
    this.workerCodeData.WHERECONDITION = `@strProcess='${form.processcode}'`
  }


  WorkerCodeValidate(event?: any) {
    if (event && event.target.value == '') {
      return
    }
    this.workerWhereCondtion()
    let form = this.meltingIssueFrom.value;
    let postData = {
      "SPID": "103",
      "parameter": {
        strBranch_Code: this.comService.nullToString(form.BRANCH_CODE),
        strJob_Number: this.commonService.nullToString(form.jobno),
        strUnq_Job_Id: this.commonService.nullToString(form.subjobno),
        strMetalStone: '',
        strProcess_Code: this.comService.nullToString(form.processcode),
        strWorker_Code: this.comService.nullToString(form.worker),
        strStock_Code: '',
        strUserName: '',
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {

        } else {
          this.overlayworkercode.showOverlayPanel(event)
          this.meltingIssueFrom.controls.worker.setValue('')
          this.comService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1747')
      })
    this.subscriptions.push(Sub)
  }


  ProcesscodeValidate(event: any) {
    if (event.target.value == '') {
      return
    }
    let form = this.meltingIssueFrom.value
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
            this.nullToStringSetValue('FRM_PROCESS_CODE', '')
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

  @ViewChild('mymodal') public mymodal!: NgbModal;

  open(modalname?: any) {

    const modalRef: NgbModalRef = this.modalService.open(modalname, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-full-width'
    });

    modalRef.result.then((result) => {

    }, (reason) => {

    });
  }
  openModal(item: any) {
    // Open the modal and store the reference
    this.modalRef = this.modalService.open('mymodal', { size: 'sm' });
    // Pass item data to the modal if needed
    // this.modalRef.componentInstance.itemData = item;
  }

  closeModal(modal: any) {
    modal.dismiss('cancel');
  }

  close1(data: any = null) {
    this.modalService.dismissAll(data);
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

  openaddMeltingIssueDetails(dataToChild?: any) {
    console.log(this.openaddMeltingIssueDetails)
    // Check if meltingtype is empty
    if (!this.meltingIssueFrom.get('meltingtype')?.value) {
      // Show error toast or message
      this.commonService.toastErrorByMsgId('MSG1431'); // Custom message ID for melting type empty error
      return; // Stop further execution
    }

    // Check if jobno is empty
    if (!this.meltingIssueFrom.get('jobno')?.value) {
      // Show error toast or message
      this.commonService.toastErrorByMsgId('MSG1358'); // Custom message ID for job number empty error
      return; // Stop further execution
    }
    this.formatMainGrid()
    if (dataToChild) {
      dataToChild.FLAG = this.content?.FLAG || 'EDIT'
      dataToChild.HEADERDETAILS = this.meltingIssueFrom.value;
    } else {
      dataToChild = { HEADERDETAILS: this.meltingIssueFrom.value }
    }
    console.log(dataToChild, 'dataToChild to parent');
    this.dataToDetailScreen = dataToChild //input variable to pass data to child
    this.modalReference = this.modalService.open(this.meltingissueDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  customizeText(data: any) {
    if (data.value > 0 && data.value <= 100) {
      return Math.trunc(data.value) + '%'
    }
    return Math.trunc(data.value).toLocaleString('en-US', { style: 'decimal' })
  }

  // onRowClickHandler(event: any) {

  //   this.selectRowIndex = (event.dataIndex)
  //   let selectedData = event.data
  //   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
  //   this.openaddMeltingIssueDetails(selectedData)
  //   console.log(selectedData)
  //   console.log("fired.")
  //   console.log(this.selectRowIndex, event);

  // }



  // setValuesToHeaderGrid(detailDataToParent: any) {
  //   let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
  //   if (PROCESS_FORMDETAILS.SRNO) {
  //     this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
  //   } else {
  //     this.tableRowCount += 1
  //     PROCESS_FORMDETAILS.SRNO = this.tableRowCount
  //   }

  //   this.tableData.push(PROCESS_FORMDETAILS)

  //   if (detailDataToParent) {
  //     this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
  //   }
  //   //  this.getSequenceDetailData(PROCESS_FORMDETAILS);

  // }
  // swapObjects(array1: any, array2: any, index: number) {
  //   // Check if the index is valid
  //   if (index >= 0 && index < array1.length) {
  //     array1[index] = array2[0];
  //   } else {
  //     console.error('Invalid index');
  //   }
  // }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.voctype) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')
      return true;
    }
    if (this.commonService.nullToString(form.jobno) == '') {
      this.commonService.toastErrorByMsgId("MSG3783")
      return true;
    }
    if (this.commonService.nullToString(form.processcode) == '') {
      this.commonService.toastErrorByMsgId('MSG1680')
      return true;
    }
    if (this.commonService.nullToString(form.worker) == '') {
      this.commonService.toastErrorByMsgId('MSG1951')
      return true;
    }
    return false
  }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.meltingISsueDetailsData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      this.meltingISsueDetailsData.push(detailDataToParent);
      this.formatMainGrid()
    }
    if (this.meltingISsueDetailsData.length > 0) {
      this.isFieldsReadonly = true; // Use this flag in the template
    }

    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('MSG81512')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDoubleClickHandler(event: any) {
    console.log(this.selectRowIndex, 'passing')
    this.selectRowIndex = event.data.SRNO
    let selectedData = event.data
    this.openaddMeltingIssueDetails(selectedData)
  }

  deleteTableData(): void {
    if (!this.selectRowIndex) {
      Swal.fire({
        title: '',
        text: 'Please select row to remove from grid!',
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
        this.meltingISsueDetailsData = this.meltingISsueDetailsData.filter((item: any, index: any) => item.SRNO != this.selectRowIndex)
        this.formatMainGrid()
      }
    }
    )
  }
  recalculateSRNO(): void {
    this.meltingISsueDetailsData.forEach((element: any, index: any) => {
      element.SRNO = index + 1
      element.GROSS_WT = this.commonService.decimalQuantityFormat(element.GROSS_WT, 'METAL')
    })
  }
  formatMainGrid() {
    this.meltingISsueDetailsData.forEach((item: any, index: any) => {
      item.SRNO = index + 1
      item.GROSS_WT = this.comService.decimalQuantityFormat(item.GROSS_WT, 'METAL')
      item.NET_WT = this.comService.setCommaSerperatedNumber(item.NET_WT, 'METAL')
      item.PURITY = this.comService.setCommaSerperatedNumber(item.PURITY, 'PURITY')
      item.PUREWT = this.comService.setCommaSerperatedNumber(item.PUREWT, 'METAL')
   
    })
  }

  setPostData() {
    let form = this.meltingIssueFrom.value
    console.log(form, 'form');
    return {
      "MID": this.commonService.emptyToZero(this.content?.MID),
      "BRANCH_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.BRANCH_CODE),
      "VOCTYPE": this.commonService.nullToString(this.meltingIssueFrom.value.voctype),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCDATE": this.comService.formatDateTime(form.vocdate),
      "YEARMONTH": this.commonService.nullToString(this.meltingIssueFrom.value.YEARMONTH),
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssueFrom.value.worker,
      "WORKER_DESC": this.meltingIssueFrom.value.workerdes,
      "JOB_CODE": this.meltingIssueFrom.value.jobno,
      "JOB_DESC": this.meltingIssueFrom.value.jobdes,
      "SALESPERSON_CODE": "",
      "SALESPERSON_NAME": "",
      "DOCTIME": "2023-10-21T10:15:43.789Z",
      "TOTAL_GROSSWT": 0,
      "MELTING_TYPE": this.meltingIssueFrom.value.meltingtype,
      "COLOR": "",
      "RET_STOCK_CODE": "",
      "RET_LOCATION_CODE": "",
      "TOTAL_PUREWT": 0,
      "TOTAL_STONEWT": 0,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.meltingIssueFrom.value.currencyrate),
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssueFrom.value.remarks,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.commonService.nullToString(this.meltingIssueFrom.value.processcode),
      "PROCESS_DESC": this.commonService.nullToString(this.meltingIssueFrom.value.processdes),
      "PRINT_COUNT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "SCP_STOCK_CODE": "",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
      "SYSTEM_DATE": "2023-10-21T10:15:43.790Z",
      "Details": this.meltingISsueDetailsData
    }
  }
  formSubmit() {
    if (this.submitValidations(this.meltingIssueFrom.value)) {
      return
    }

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.meltingIssueFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // } 


    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.meltingIssueFrom.reset()
              this.isSaved = true;
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.toastr.error('Not saved')
      })
    this.subscriptions.push(Sub)
  }

  setFormValues() {
    if (!this.content) return
    console.log(this.content);

    this.meltingIssueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.meltingIssueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.meltingIssueFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.meltingIssueFrom.controls.processcode.setValue(this.content.PROCESS_CODE)
    this.meltingIssueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssueFrom.controls.workerdes.setValue(this.content.WORKER_DESC)
    this.meltingIssueFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssueFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssueFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssueFrom.controls.color.setValue(this.content.COLOR)
    this.meltingIssueFrom.controls.remark.setValue(this.content.REMARKS)
  }

  update() {
    let form = this.meltingIssueFrom.value
    let API = `JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/${form.BRANCH_CODE}/${form.voctype}/${form.vocno}/${form.YEARMONTH}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.meltingIssueFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.comService.toastErrorByMsgId('MSG1984')
      })
    this.subscriptions.push(Sub)
  }
  deleteRecord() {
    if (!this.content.VOCNO) {
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
        let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH;
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
                    this.meltingIssueFrom.reset()
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
                    this.meltingIssueFrom.reset()
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }



  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  getSequenceDetailData(formData: any) {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${formData.SEQ_CODE}`
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
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.meltingIssueFrom.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
  }
  updateJobNumberLookupFilter(karatCode: string) {
    // Update the WHERECONDITION for job number lookup filter based on KaratCode
    this.jobnoCodeData.WHERECONDITION = `@StrJob_Number='',@StrMeltingTypeKarat='${karatCode}',@StrBranchCode=${this.commonService.branchCode},@StrColor ='',@LookupFlag = '1'`;

  }

  setJobNumberWhereCondition() {
    let form = this.meltingIssueFrom.value;
    console.log(form.Karat, 'jobnumber')
    this.jobnoCodeData.WHERECONDITION = `@StrJob_Number='${this.commonService.nullToString(form.jobno)}',`
    this.jobnoCodeData.WHERECONDITION += `@StrMeltingTypeKarat='${this.commonService.nullToString(form.Karat)}',`
    this.jobnoCodeData.WHERECONDITION += `@StrBranch='${this.commonService.nullToString(this.comService.branchCode)}',`
    this.jobnoCodeData.WHERECONDITION += `@StrColor='${this.commonService.nullToString(form.color)}'`
  }

  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.meltingIssueFrom.value.subjobno,
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }

    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          console.log(data)
          this.meltingIssueFrom.controls.processcode.setValue(data[0].PROCESS)
          this.meltingIssueFrom.controls.worker.setValue(data[0].WORKER)
          this.meltingIssueFrom.controls.jobdes.setValue(data[0].DESCRIPTION)
          this.meltingIssueFrom.controls.subjobnodes.setValue(data[0].DESCRIPTION)
          // this.meltingIssueFrom.controls.pcs.setValue(data[0].PCS)
          this.meltingIssueFrom.controls.workerdes.setValue(data[0].WORKERDESC)
          this.meltingIssueFrom.controls.processdes.setValue(data[0].PROCESSDESC)
          // this.meltingIssueFrom.controls.grossweight.setValue(data[0].NETWT)
          // this.meltingIssueFrom.controls.purity.setValue(data[0].PURITY)
          // this.meltingIssueFrom.controls.netweight.setValue(data[0].NETWT)
          // this.meltingIssueFrom.controls.MetalWeightFrom.setValue(
          //   this.commonService.decimalQuantityFormat(data[0].METAL, 'METAL'))

          // this.meltingIssueFrom.controls.StoneWeight.setValue(data[0].STONE)

          // this.meltingIssueFrom.controls.PURITY.setValue(data[0].PURITY)
          // this.meltingIssueFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          // this.meltingIssueFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // this.stockCodeScrapValidate()
          // this.meltingIssuedetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.meltingIssuedetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          // this.meltingIssuedetailsFrom.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.meltingIssuedetailsFrom.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.fillStoneDetails()
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }



  jobNumberValidate(event: any) {
    if (event.target.value == '') return;
    let form = this.meltingIssueFrom.value;
    let postData = {
      "SPID": "108",
      "parameter": {
        'StrJob_Number': this.commonService.nullToString(form.jobno),
        'StrMeltingTypeKarat': this.commonService.nullToString(form.Karat),
        'StrBranch': this.comService.branchCode,
        'StrColor': this.commonService.nullToString(form.color),

      }
    };

    this.commonService.showSnackBarMsg('Validating Job Number...');
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg();
        if (result.status === "Success" && result.dynamicData && result.dynamicData[0] && result.dynamicData[0][0]) {
          let data = result.dynamicData[0][0];
          console.log(data, 'data')
          // Check if the unique job ID is valid
          if (data.UNQ_JOB_ID && data.UNQ_JOB_ID !== '') {
            // Set valid job details in the form controls
            this.jobNumberDetailData = data;
            console.log(data, 'data')
            this.meltingIssueFrom.controls.subjobno.setValue(data.UNQ_JOB_ID);
            this.meltingIssueFrom.controls.subJobDescription.setValue(data.JOB_DESCRIPTION);
            this.overlayjobNoSearch.closeOverlayPanel();
            this.subJobNumberValidate(); // Trigger sub-job number validation
          } else {
            // If job number is not valid, show 'Not Found' message and clear job number field
            this.handleInvalidJobNumber(event, 'MSG1531');
          }
        } else {
          // Show error if the API status is not success or if no data is returned
          this.handleInvalidJobNumber(event, 'MSG2039');
        }
      }, err => {
        // Handle error from the API
        this.commonService.closeSnackBarMsg();
        this.handleInvalidJobNumber(event, 'MSG2039');
      });

    // Add the subscription to track and clean up later
    this.subscriptions.push(Sub);
  }

  // Method to handle invalid job number cases
  handleInvalidJobNumber(event: any, message: string) {
    // Show an error message using a toast or snackbar
    this.comService.toastErrorByMsgId(message);

    // Clear the job number control and open the overlay for re-entry
    this.meltingIssueFrom.controls.jobno.setValue('');
    this.showOverleyPanel(event, 'jobno');
  }


  meltingTypeValidate(event?: any) {
    const meltingTypeValue = this.meltingIssueFrom.value.meltingtype;
    console.log('Melting Type:', meltingTypeValue);

    if (!meltingTypeValue) {
      // this.commonService.toastErrorByMsgId('MSG1531');
      return;
    }

    const API = `MeltingType/GetMeltingTypeList/${meltingTypeValue}`;

    const sub: Subscription = this.dataService.getDynamicAPI(API).subscribe(
      (result: any) => {
        this.commonService.closeSnackBarMsg();
        if (result.response) {
          const data = result.response;
          console.log(data, 'data')
          this.meltingIssueFrom.controls.color.setValue(data.COLOR);
          this.meltingIssueFrom.controls.jobpurity.setValue(data.PURITY);
          this.meltingIssueFrom.controls.Karat.setValue(data.KARAT_CODE)//KARAT_CODE
          this.setValueWithDecimal('jobpurity', data.PURITY, 'PURITY')
          this.setJobNumberWhereCondition()
          this.isJobNumberSearchVisible = true;
        } else {
          this.isJobNumberSearchVisible = false;
          this.commonService.toastErrorByMsgId('MSG1531');
          this.meltingIssueFrom.controls.meltingtype.setValue('')
          this.showOverleyPanel(event, 'meltingtype')

        }
      },
      (err: any) => {
        console.error('API Call Error:', err);
        this.isJobNumberSearchVisible = false;
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
      }
    );

    this.subscriptions.push(sub);
  }
}