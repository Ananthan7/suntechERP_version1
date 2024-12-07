import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StoneReturnDetailsComponent } from './stone-return-details/stone-return-details.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-stone-return',
  templateUrl: './stone-return.component.html',
  styleUrls: ['./stone-return.component.scss']
})
export class StoneReturnComponent implements OnInit {
  @ViewChild('stoneReturnDetailScreen') public stoneReturnDetailComponent!: NgbModal;
  @ViewChild('overlayenterdBySearch') overlayenterdBySearch!: MasterSearchComponent;
  @ViewChild('overlayBaseCurrencyCode') overlayBaseCurrencyCode!: MasterSearchComponent;
  @ViewChild('overlayCurrencyCode') overlayCurrencyCode!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  columnhead: any[] = [
    { title: 'SRNO', field: 'SRNO', format: '', alignment: 'center' },
    { title: 'VOCNO', field: 'VOCNO', format: '', alignment: 'left' },
    { title: 'VOCTYPE', field: 'VOCTYPE', format: '', alignment: 'left' },
    { title: 'VOCDATE', field: 'VOCDATE', format: 'dd/MM/yyyy',dataType: 'date', alignment: 'left' },
    { title: 'JOB NUMBER', field: 'JOB_NUMBER', format: '', alignment: 'left' },
    { title: 'JOB DATE', field: 'JOB_DATE', format: 'dd/MM/yyyy', dataType: 'date',alignment: 'left' },
    { title: 'JOB SO', field: 'JOB_SO_NUMBER', format: '', alignment: 'right' },
    { title: 'JOB DESCRIPTION', field: 'JOB_DESCRIPTION', format: '', alignment: 'left' },
    { title: 'PCS', field: 'PCS', format: '', alignment: 'right' },
    { title: 'UNQ JOB ID', field: 'UNQ_JOB_ID', format: '', alignment: 'left' },
    { title: 'BRANCH', field: 'BRANCH_CODE', format: '', alignment: 'left' },
    { title: 'DESIGN CODE', field: 'DESIGN_CODE', format: '', alignment: 'left' },
    { title: 'DIV CODE', field: 'DIVCODE', format: '', alignment: 'left' },
    { title: 'STOCK CODE', field: 'STOCK_CODE', format: '', alignment: 'left' },
    { title: 'STOCK DESCRIPTION', field: 'STOCK_DESCRIPTION', format: '', alignment: 'left' },
    { title: 'SIEVE', field: 'SIEVE', format: '', alignment: 'left' },
    { title: 'SIEVE SET', field: 'SIEVE_SET', format: '', alignment: 'left' },
    { title: 'SHAPE', field: 'SHAPE', format: '', alignment: 'left' },
    { title: 'COLOR', field: 'COLOR', format: '', alignment: 'left' },
    { title: 'CLARITY', field: 'CLARITY', format: '', alignment: 'left' },
    { title: 'SIZE', field: 'SIZE', format: '', alignment: 'left' },
    { title: 'GROSS WT', field: 'GROSS_WT', format: '', alignment: 'right' },
    { title: 'CURRENY CODE', field: 'CURRENY_CODE', format: '', alignment: 'left' },
    { title: 'CURRENY RATE', field: 'CURRENY_RATE', format: '', alignment: 'left' },
    { title: 'RATEFC', field: 'RATEFC', format: '', alignment: 'right' },
    { title: 'RATELC', field: 'RATELC', format: '', alignment: 'right' },
    { title: 'AMOUNTFC', field: 'AMOUNTFC', format: '', alignment: 'right' },
    { title: 'AMOUNTLC', field: 'AMOUNTLC', format: '', alignment: 'right' },
    { title: 'PROCESS CODE', field: 'PROCESS_CODE', format: '', alignment: 'left' },
    { title: 'PROCESS NAME', field: 'PROCESS_NAME', format: '', alignment: 'left' },
    { title: 'WORKER CODE', field: 'WORKER_CODE', format: '', alignment: 'left' },
    { title: 'WORKER NAME', field: 'WORKER_NAME', format: '', alignment: 'left' },
    { title: 'WIP ACCOUNT', field: 'WIP_ACCOUNT', format: '', alignment: 'left' },
    { title: 'LOCTYPE CODE', field: 'LOCTYPE_CODE', format: '', alignment: 'left' },
    { title: 'STOCK CODE BRK', field: 'STOCK_CODE_BRK', format: '', alignment: 'left' },
    { title: 'WASTAGE QTY', field: 'WASTAGE_QTY', format: '', alignment: 'right' },
    { title: 'WASTAGE AMT', field: 'WASTAGE_AMT', format: '', alignment: 'right' },
    { title: 'WASTAGE TOTAL', field: 'WASTAGE_TOTAL', format: '', alignment: 'right' },
    { title: 'NAVSEQNO', field: 'NAVSEQNO', format: '', alignment: 'left' },
    { title: 'YEARMONTH', field: 'YEARMONTH', format: '', alignment: 'left' },
    { title: 'DOCTIME', field: 'DOCTIME', format: '', alignment: 'left' },
    { title: 'SMAN', field: 'SMAN', format: '', alignment: 'left' },
    { title: 'REMARK', field: 'REMARK', format: '', alignment: 'left' },
    { title: 'TOTAL GROSS WT', field: 'TOTAL_GROSS_WT', format: '', alignment: 'right' },
    { title: 'UNQ DESIGN ID', field: 'UNQ_DESIGN_ID', format: '', alignment: 'left' },
    { title: 'UNIQUEID', field: 'UNIQUEID', format: '', alignment: 'left' },
    { title: 'TOTAL AMOUNT FC', field: 'TOTAL_AMOUNT_FC', format: '', alignment: 'right' },
    { title: 'TOTAL AMOUNT LC', field: 'TOTAL_AMOUNT_LC', format: '', alignment: 'right' },
    { title: 'ISBROCKEN', field: 'ISBROCKEN', format: '', alignment: 'right' },
    { title: 'BASE CONV RATE', field: 'BASE_CONV_RATE', format: '', alignment: 'left' },
    { title: 'DT BRANCH CODE', field: 'DT_BRANCH_CODE', format: '', alignment: 'left' },
    { title: 'DT VOCTYPE', field: 'DT_VOCTYPE', format: '', alignment: 'left' },
    { title: 'DT VOCNO', field: 'DT_VOCNO', format: '', alignment: 'right' },
    { title: 'DT YEARMONTH', field: 'DT_YEARMONTH,', format: '', alignment: 'left' },
    { title: 'RET TO DESC', field: 'RET_TO_DESC', format: '', alignment: 'left' },
    { title: 'RET TO', field: 'RET_TO', format: '', alignment: 'left' },
    { title: 'WASTAGE PER', field: 'WASTAGE_PER', format: '', alignment: 'right' },
    { title: 'TOTAL PCS', field: 'TOTAL_PCS', format: '', alignment: 'right' },
    { title: 'LABOUR CODE', field: 'LABOUR_CODE', format: '', alignment: 'left' },
    { title: 'LAB ACCODE', field: 'LAB_ACCODE', format: '', alignment: 'left' },
    { title: 'LAB RATEFC', field: 'LAB_RATEFC', format: '', alignment: 'right' },
    { title: 'LAB RATELC', field: 'LAB_RATELC', format: '', alignment: 'right' },
    { title: 'LAB AMOUNTFC', field: 'LAB_AMOUNTFC', format: '', alignment: 'right' },
    { title: 'LAB AMOUNTLC', field: 'LAB_AMOUNTLC', format: '', alignment: 'right' },
    { title: 'LAB UNIT', field: 'LAB_UNIT', format: '', alignment: 'left' },
    { title: 'ISMISSING', field: 'ISMISSING', format: '', alignment: 'right' },
    { title: 'VAR PER', field: 'VAR_PER', format: '', alignment: 'left' },
    { title: 'ORG LAB RATE', field: 'ORG_LAB_RATE', format: '', alignment: 'right' },
    { title: 'ORG LAB AMT', field: 'ORG_LAB_AMT', format: '', alignment: 'right' },
    { title: 'SUB STOCK CODE', field: 'SUB_STOCK_CODE', format: '', alignment: 'left' },

  ];
  @Input() content!: any;
  tableData: any[] = [];
  stoneReturnData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  tableRowCount: number = 0;
  detailData: any[] = [];
  selectRowIndex: any;
  selectedKey: number[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  isloading: boolean = false;
  isSaved: boolean = false;
  isDisableSaveBtn: boolean = false;
  editMode: boolean = false;
  dataToDetailScreen: any;
  modalReference!: NgbModalRef;
  viewMode1: boolean = true;

  private subscriptions: Subscription[] = [];
  userData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  baseCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'BaseCurrency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stonereturnFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: [''],
    VOCNO: [''],
    VOCDATE: [''],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    basecurrency: [''],
    basecurrencyrate: [''],
    currency: ['', [Validators.required]],
    currencyrate: ['', [Validators.required]],
    worker: [''],
    workername: [''],
    remark: [''],
    enterdBy: [''],
    enteredByName: [''],
    process: [''],
    jobDesc: [''],
    FLAG: [null],
    MAIN_VOCTYPE: ['']
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.userName = this.commonService.userName;

    if (this.content?.FLAG) {
      this.setAllInitialValues()
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
         this.isSaved = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.editMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'DELETE') {
        this.deleteClicked()
      }
      if (this.content?.FLAG) {
        this.stonereturnFrom.controls.FLAG.setValue(this.content.FLAG)
      }
    } else {
      this.generateVocNo()
      this.setFormValues()
      this.setvoucherTypeMaster()
    }
  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  setFormValues() {
    if (this.content?.FLAG) return
    this.stonereturnFrom.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.stonereturnFrom.controls.VOCDATE.setValue(this.commonService.currentDate)
    this.stonereturnFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.stonereturnFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.stonereturnFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()

    this.setCompanyCurrency()
    this.basesetCompanyCurrency()
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.stonereturnFrom.value
    const vocTypeMaster = this.commonService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.stonereturnFrom.value.VOCNO}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.stonereturnFrom.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }

  setAllInitialValues() {
    if (!this.content?.MID) return
    let API = `JobStoneReturnMasterDJ/GetJobStoneReturnMasterDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.detailData = data.Details
          console.log(this.detailData, 'data')
          if (this.detailData.length > 0) {
            this.detailData.forEach((element: any) => {
              element.FLAG = this.content ? this.content.FLAG : null
              this.stoneReturnData.push({
                SRNO: element.SRNO,
                VOCNO: element.VOCNO,
                VOCTYPE: element.VOCTYPE,
                VOCDATE: this.commonService.formatDDMMYY(element.VOCDATE),
                JOB_NUMBER: element.JOB_NUMBER,
                JOB_DATE: this.commonService.formatDDMMYY(element.JOB_DATE),
                JOB_SO_NUMBER: element.JOB_SO_NUMBER,
                JOB_DESCRIPTION: element.JOB_DESCRIPTION,
                UNQ_JOB_ID: element.UNQ_JOB_ID,
                BRANCH_CODE: element.BRANCH_CODE,
                DESIGN_CODE: element.DESIGN_CODE,
                DIVCODE: element.DIVCODE,
                STOCK_CODE: element.STOCK_CODE,
                STOCK_DESCRIPTION: element.STOCK_DESCRIPTION,
                SIEVE: element.SIEVE,
                SIEVE_SET: element.SIEVE_SET,
                SHAPE: element.SHAPE,
                COLOR: element.COLOR,
                CLARITY: element.CLARITY,
                SIZE: element.SIZE,
                CURRENY_CODE: element.CURRENY_CODE,
                CURRENY_RATE: element.CURRENY_RATE,
                RATEFC: element.RATEFC,
                RATELC: element.RATELC,
                AMOUNTFC: element.AMOUNTFC,
                AMOUNTLC: element.AMOUNTLC,
                PROCESS_CODE: element.PROCESS_CODE,
                PROCESS_NAME: element.PROCESS_NAME,
                WORKER_CODE: element.WORKER_CODE,
                WORKER_NAME: element.WORKER_NAME,
                WIP_ACCOUNT: element.WIP_ACCOUNT,
                LOCTYPE_CODE: element.LOCTYPE_CODE,
                STOCK_CODE_BRK: element.STOCK_CODE_BRK,
                WASTAGE_QTY: element.WASTAGE_QTY,
                WASTAGE_AMT: element.WASTAGE_AMT,
                WASTAGE_TOTAL: element.WASTAGE_TOTAL,
                NAVSEQNO: element.NAVSEQNO,
                YEARMONTH: element.YEARMONTH,
                DOCTIME: element.DOCTIME,
                SMAN: element.SMAN,
                REMARK: element.REMARK,
                TOTAL_GROSS_WT: element.TOTAL_GROSS_WT,
                TOTAL_AMOUNT_FC: element.TOTAL_AMOUNT_FC,
                TOTAL_AMOUNT_LC: element.TOTAL_AMOUNT_LC,
                ISBROCKEN: element.ISBROCKEN,
                BASE_CONV_RATE: element.BASE_CONV_RATE,
                DT_BRANCH_CODE: element.DT_BRANCH_CODE,
                DT_VOCTYPE: element.DT_VOCTYPE,
                DT_VOCNO: element.DT_VOCNO,
                DT_YEARMONTH: element.DT_YEARMONTH,
                RET_TO_DESC: element.RET_TO_DESC,
                RET_TO: element.RET_TO,
                ISMISSING: element.ISMISSING,
                SUB_STOCK_CODE: element.SUB_STOCK_CODE,


              })
            });
          } else {
            this.commonService.toastErrorByMsgId('MSG1200')//	Detail record not found
          }
          this.stonereturnFrom.controls.basecurrency.setValue(data.BASE_CURRENCY)
          this.stonereturnFrom.controls.basecurrencyrate.setValue(this.commonService.decimalQuantityFormat(data.BASE_CURR_RATE,'RATE'))
          this.stonereturnFrom.controls.currency.setValue(data.CURRENCY_CODE)
          this.stonereturnFrom.controls.currencyrate.setValue(this.commonService.decimalQuantityFormat(data.CURRENCY_RATE,'RATE'))
          this.stonereturnFrom.controls.worker.setValue(data.WORKER)
          this.stonereturnFrom.controls.workername.setValue(data.WORKER_NAME)
          this.stonereturnFrom.controls.enterdBy.setValue(data.HTUSERNAME)
          this.stonereturnFrom.controls.enteredByName.setValue(data.REMARKS)
          this.stonereturnFrom.controls.enteredByName.setValue(data.REMARKS)

          this.stonereturnFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.stonereturnFrom.controls.VOCNO.setValue(data.VOCNO)
          this.stonereturnFrom.controls.VOCDATE.setValue(data.VOCDATE)
          this.stonereturnFrom.controls.remark.setValue(data.REMARKS)
          this.stonereturnFrom.controls.enterdBy.setValue(data.SMAN)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  close(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW'){
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
  userDataSelected(value: any) {
    console.log(value);
    this.stonereturnFrom.controls.enterdBy.setValue(value.SALESPERSON_CODE);
  }
  WorkerCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  currencyCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.currency.setValue(e.CURRENCY_CODE);
    this.stonereturnFrom.controls.currencyrate.setValue(e.CONV_RATE);
  }

  baseCurrencyCodeSelected(e: any) {
    console.log(e);
    this.stonereturnFrom.controls.basecurrency.setValue(e.CURRENCY_CODE);
    this.stonereturnFrom.controls.basecurrencyrate.setValue(e.CONV_RATE);
  }

  openStoneReturnDetails(data?: any) {
    if (data) {
      data.HEADERDETAILS = this.stonereturnFrom.value;
    } else {
      data = { HEADERDETAILS: this.stonereturnFrom.value }
    }
    this.dataToDetailScreen = data;
    this.modalReference = this.modalService.open(this.stoneReturnDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  onRowClickHandler(event: any) {
    this.selectRowIndex = (event.dataIndex)
    let selectedData = event.data
    this.openStoneReturnDetails(selectedData)
  }

  setValuesToHeaderGrid(DATA: any) {
    console.log(DATA, 'detailDataToParent');
    let detailDataToParent = DATA.POSTDATA
    if (detailDataToParent.SRNO != 0) {
      this.stoneReturnData[detailDataToParent.SRNO - 1] = detailDataToParent
    } else {
      detailDataToParent.SRNO = this.stoneReturnData.length + 1
      this.stoneReturnData.push(detailDataToParent);
      // this.recalculateSRNO()
    }
    if (DATA.FLAG == 'SAVE') this.closeDetailScreen();
    if (DATA.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('MSG81512')
    };
  }
  closeDetailScreen() {
    this.modalReference.close()
  }
  deleteTableData(): void {
    console.log(this.selectedKey, 'data')
    this.selectedKey.forEach((element: any) => {
      this.stoneReturnData.splice(element.SRNO - 1, 1)
    })
  }
  onSelectionChanged(event: any) {
    this.selectedKey = event.selectedRowKeys;
    console.log(this.selectedKey, 'srno')
    let indexes: Number[] = [];
    this.stoneReturnData.reduce((acc, value, index) => {
      if (this.selectedKey.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }

  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonereturnFrom.controls.currency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonereturnFrom.controls.currency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonereturnFrom.controls.currency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonereturnFrom.value.currency);
    if (CURRENCY_RATE.length > 0) {
      this.stonereturnFrom.controls.currencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonereturnFrom.controls.currency.setValue('')
      this.stonereturnFrom.controls.currencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  /**USE: to set currency on selected change*/
  basecurrencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonereturnFrom.controls.basecurrency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonereturnFrom.controls.basecurrency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  basesetCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonereturnFrom.controls.basecurrency.setValue(CURRENCY_CODE);
    this.basesetCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  basesetCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonereturnFrom.value.basecurrency);
    if (CURRENCY_RATE.length > 0) {
      this.stonereturnFrom.controls.basecurrencyrate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonereturnFrom.controls.basecurrency.setValue('')
      this.stonereturnFrom.controls.basecurrencyrate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }


  removedata() {
    this.tableData.pop();
  }
  setPostData(form: any) {
    return {
      "MID": this.content?.MID || 0,
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.commonService.emptyToZero(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(new Date(form.VOCDATE)),
      "YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "DOCTIME": "",
      "CURRENCY_CODE": this.commonService.nullToString(form.currency),
      "CURRENCY_RATE": this.commonService.nullToString(form.currencyrate),
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": this.commonService.nullToString(form.enterdBy),
      "REMARKS": this.commonService.nullToString(form.remark),
      "NAVSEQNO": 0,
      "BASE_CURRENCY": this.commonService.nullToString(form.basecurrency),
      "BASE_CURR_RATE": this.commonService.emptyToZero(form.basecurrencyrate),
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": this.commonService.formatDateTime(this.currentDate),
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": this.commonService.userName,
      "Details": this.stoneReturnData,
    }
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1173')// currency code CANNOT BE EMPTY
      return true
    }
    if (this.stoneReturnData.length <= 0) {
      this.commonService.toastErrorByMsgId('MSG1262'); // Minimum one row should be entered in grid
      return true;
    }
    return false;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.stonereturnFrom.value)) return;
    // if (this.stonereturnFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = this.setPostData(this.stonereturnFrom.value);

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.stonereturnFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }



  update() {
    // if (this.stonereturnFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    if (this.submitValidations(this.stonereturnFrom.value)) return;
    let FG = this.stonereturnFrom.value
    let API = `JobStoneReturnMasterDJ/UpdateJobStoneReturnMasterDJ/${FG.BRANCH_CODE}/${FG.VOCTYPE}/${FG.VOCNO}/${FG.YEARMONTH}`
    let postData = this.setPostData(this.stonereturnFrom.value)

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result && result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.stonereturnFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  // deleteTableData(): void {
  //   if (this.selectRowIndex == undefined || this.selectRowIndex == null) {
  //     this.commonService.toastErrorByMsgId('MSG1458') //No record is selected.
  //     return
  //   }
  //   this.showConfirmationDialog().then((result) => {
  //     if (result.isConfirmed) {
  //       this.tableData = this.tableData.filter((item: any) => item.SRNO != this.selectRowIndex)
  //       this.detailData = this.detailData.filter((item: any) => item.SRNO != this.selectRowIndex)
  //       this.reCalculateSRNO()
  //     }
  //   }
  //   )
  // }
  reCalculateSRNO() {
    this.tableData.forEach((item, index) => item.SRNO = index + 1)
    this.detailData.forEach((item: any, index: any) => item.SRNO = index + 1)
  }

  deleteClicked() {
    if (!this.content.VOCTYPE) {
      this.commonService.showSnackBarMsg('MSG1632')
      return
    }
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let API = 'JobStoneReturnMasterDJ/DeleteJobStoneReturnMasterDJ/' +
          this.content?.BRANCH_CODE + '/' +
          this.content?.VOCTYPE + '/' +
          this.content?.VOCNO + '/' +
          this.content?.YEARMONTH
        this.commonService.showSnackBarMsg('MSG81447')
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            this.commonService.closeSnackBarMsg()
            if (result && result.status == "Success") {
              this.showSuccessDialog(this.commonService.getMsgByID('MSG81450'))
            } else {
              this.commonService.showSnackBarMsg('MSG1531')
            }
          }, err => {
            this.commonService.closeSnackBarMsg()
            this.commonService.showSnackBarMsg('MSG1531')
          })
        this.subscriptions.push(Sub)
      }
    });
  }
  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
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
  showOverleyPanel(event: any, formControlName: string) {
    if (event.target.value != '') return
    switch (formControlName) {
      case 'enterdBy':
        this.overlayenterdBySearch.showOverlayPanel(event);
        break;
      case 'basecurrency':
        this.overlayBaseCurrencyCode.showOverlayPanel(event);
        break;
      case 'currency':
        this.overlayCurrencyCode.showOverlayPanel(event);
        break;
      default:

    }
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
          this.stonereturnFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'enterdBy' || FORMNAME === 'basecurrency' || FORMNAME === "currency") {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
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

