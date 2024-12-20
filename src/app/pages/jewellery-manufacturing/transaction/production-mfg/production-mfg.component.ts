import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ProductionEntryDetailsComponent } from "./production-entry-details/production-entry-details.component";
import { SavedataModel } from "./savedata-model";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { AttachmentUploadComponent } from "src/app/shared/common/attachment-upload/attachment-upload.component";

@Component({
  selector: "app-production-mfg",
  templateUrl: "./production-mfg.component.html",
  styleUrls: ["./production-mfg.component.scss"],
})
export class ProductionMfgComponent implements OnInit {
  @ViewChild('overlayuserName') overlayuserName!: MasterSearchComponent;
  @ViewChild('OverlayCurrencyRate') OverlayCurrencyRate!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

 
  columnheads: any[] = [
    "JOB_NUMBER", "UNQ_JOB_ID", "DESIGN_CODE",
    "DIVCODE", 'PREFIX', 'STOCK_CODE', 'STOCK_DESCRIPTION', 'SET_REF',
    'KARAT_CODE', 'JOB_PCS', 'GROSS_WT', 'METAL_PCS', 'METAL_WT', 'STONE_PCS',
    'STONE_WT', 'LOSS_WT', 'NET_WT', 'PURITY', 'PURE_WT', 'RATE_TYPE', 'METAL_RATE',
    'CURRENCY_CODE', 'CURRENCY_RATE', 'METAL_GRAM_RATEFC', 'METAL_AMOUNTFC',
    'METAL_AMOUNTLC', 'MAKING_RATEFC', 'MAKING_RATELC', 'MAKING_AMOUNTFC',
    'MAKING_AMOUNTLC', 'STONE_RATEFC', 'STONE_RATELC', 'STONE_AMOUNTFC', 'STONE_AMOUNTLC',
    'LAB_AMOUNTFC', 'LAB_AMOUNTLC', 'RATEFC',
    'RATELC', 'AMOUNTFC', 'AMOUNTLC', 'PROCESS_CODE',
    'PROCESS_NAME', 'WORKER_CODE', 'WORKER_NAME', 'IN_DATE', 'OUT_DATE', 'TIME_TAKEN_HRS', 'COST_CODE',
    'WIP_ACCODE', 'STK_ACCODE', 'SOH_ACCODE', 'PROD_PROC', 'METAL_DIVISION', 'PRICE1PER',
    'PRICE2PER', 'PRICE3PER', 'PRICE4PER', 'PRICE5PER', 'LOCTYPE_CODE', 'WASTAGE_WT', 'WASTAGE_AMTFC',
    'WASTAGE_AMTLC', 'PICTURE_NAME', 'SELLINGRATE', 'LAB_ACCODE', 'CUSTOMER_CODE', 'OUTSIDEJOB',
    'METAL_LABAMTFC', 'METAL_LABAMTLC', 'METAL_LABACCODE', 'SUPPLIER_REF', 'TAGLINES', 'SETTING_CHRG',
    'POLISH_CHRG', 'RHODIUM_CHRG', 'LABOUR_CHRG', 'MISC_CHRG', 'SETTING_ACCODE', 'POLISH_ACCODE',
    'RHODIUM_ACCODE', 'LABOUR_ACCODE', 'MISC_ACCODE', 'WAST_ACCODE', 'REPAIRJOB', 'PRICE1FC',
    'PRICE2FC', 'PRICE3FC', 'PRICE4FC', 'PRICE5FC', 'BASE_CONV_RATE', 'DT_BRANCH_CODE', 'DT_VOCTYPE',
    'DT_VOCNO', 'DT_YEARMONTH', 'YEARMONTH', 'OTH_STONE_WT', 'OTH_STONE_AMT', 'HANDLING_ACCODE',
    'FROM_STOCK_CODE', 'TO_STOCK_CODE', 'JOB_PURITY', 'LOSS_PUREWT', 'PUDIFF', 'STONEDIFF', 'CHARGABLEWT',
    'BARNO', 'LOTNUMBER', 'TICKETNO', 'PROD_PER', 'DESIGN_TYPE', 'D_REMARKS',
    'BARCODEDQTY', 'BARCODEDPCS', 'LASTNO'
  ];
  @Input() content!: any;
  JOB_PRODUCTION_DETAIL_DJ: any[] = [];
  JOB_PRODUCTION_SUB_DJ: any[] = [];
  JOB_PRODUCTION_STNMTL_DJ: any[] = [];
  JOB_PRODUCTION_LABCHRG_DJ: any[] = [];
  JOB_PRODUCTION_METALRATE_DJ: any[] = [];
  formDetailCount: number = 0;
  viewMode: boolean = false;
  userName = this.commonService.userName;
  branchCode: string = '';
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName: string = this.commonService.allbranchMaster['BRANCH_NAME'] || ''
  private subscriptions: Subscription[] = [];
  editMode: boolean = false;
  isloading: boolean = false;
  modalReference!: NgbModalRef;

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'RATE TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
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
  };
  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  // main form
  productionFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: ["", [Validators.required]],
    VOCDATE: ["", [Validators.required]],
    VOCNO: [0],
    MID: [0],
    BRANCH_CODE: [""],
    YEARMONTH: [""],
    FLAG: [""],
    SRNO: [''],
    SMAN: [""],
    CURRENCY_CODE: ["", [Validators.required]],
    CURRENCY_RATE: ["", [Validators.required]],
    BASE_CURRENCY: [""],
    BASE_CURRENCY_RATE: [""],
    baseConvRate: [""],
    TIME: [""],
    METAL_RATE: [""],
    METAL_RATE_TYPE: [""],
    REMARKS: [""],
    STONE_INCLUDE: [false],
    UnfixTransaction: [false],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        // this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.editMode = true;
        // this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteClicked()
      }
      this.productionFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setInitialValues()
    } else {
      this.generateVocNo()
      this.setLoadValues()
      this.setCompanyCurrency()
      this.getRateType()
    }
  }
  setLoadValues() {
    this.productionFrom.controls.VOCDATE.setValue(this.commonService.currentDate)
    this.productionFrom.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.productionFrom.controls.TIME.setValue(this.commonService.getTime())
    this.productionFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.productionFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.branchCode = this.commonService.branchCode
  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  // use: set saved values from production get API
  setInitialValues() {
    if (!this.content?.MID) return
    this.commonService.showSnackBarMsg('MSG81447')
    let API = `JobProductionMaster/GetJobProductionMasterWithMID/${this.content?.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.JOB_PRODUCTION_DETAIL_DJ = data.JOB_PRODUCTION_DETAIL_DJ || []
          this.JOB_PRODUCTION_DETAIL_DJ.forEach((item: any, index: number) => {
            this.detailData.push({
              SRNO: item.SRNO,
              FLAG: this.commonService.nullToString(this.content.FLAG),
              JOB_PRODUCTION_DETAIL_DJ: item,
              JOB_PRODUCTION_STNMTL_DJ: data.JOB_PRODUCTION_STNMTL_DJ?.filter((val: any) => item.JOB_NUMBER == val.JOB_NUMBER),
              JOB_PRODUCTION_SUB_DJ: data.JOB_PRODUCTION_SUB_DJ?.filter((val: any) => item.JOB_NUMBER == val.JOB_NUMBER),
              JOB_PRODUCTION_LABCHRG_DJ: data.JOB_PRODUCTION_LABCHRG_DJ?.filter((val: any) => item.JOB_NUMBER == val.JOB_NUMBER),
              JOB_PRODUCTION_METALRATE_DJ: data.JOB_PRODUCTION_METALRATE_DJ?.filter((val: any) => item.UNIQUEID == val.REFMID),
            })
            item.LOSS_QTY = this.commonService.decimalQuantityFormat(item.LOSS_QTY, 'METAL')
          })
          this.productionFrom.controls.BRANCH_CODE.setValue(data.BRANCH_CODE)
          this.productionFrom.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.productionFrom.controls.VOCNO.setValue(data.VOCNO)
          this.productionFrom.controls.VOCDATE.setValue(data.VOCDATE)
          this.productionFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.productionFrom.controls.MID.setValue(data.MID)
          this.productionFrom.controls.METAL_RATE_TYPE.setValue(data.METAL_RATE_TYPE)
          this.productionFrom.controls.METAL_RATE.setValue(
            this.commonService.decimalQuantityFormat(data.METAL_RATE, 'RATE')
          )
          this.productionFrom.controls.CURRENCY_CODE.setValue(data.CURRENCY_CODE)
          this.productionFrom.controls.CURRENCY_RATE.setValue(
            this.commonService.decimalQuantityFormat(data.CURRENCY_RATE, 'RATE')
          )
          this.productionFrom.controls.SMAN.setValue(data.SMAN)
          this.productionFrom.controls.REMARKS.setValue(data.REMARKS)
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  userDataSelected(value: any) {
    this.productionFrom.controls.SMAN.setValue(value.UsersName);
  }
  branchSelected(e: any) {
    this.productionFrom.controls.BRANCH_CODE.setValue(e.BRANCH_CODE);
  }
  baseCurrencyCodeSelected(e: any) {
    this.productionFrom.controls.BASE_CURRENCY.setValue(e.CURRENCY_CODE);
    this.productionFrom.controls.BASE_CURRENCY_RATE.setValue(e.CONV_RATE);
  }
  /**USE: get rate type on load */
  getRateType() {
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.DIVISION_CODE == 'G' && item.DEFAULT_RTYPE == 1)

    if (data[0].WHOLESALE_RATE) {
      let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
      this.productionFrom.controls.METAL_RATE.setValue(WHOLESALE_RATE)
    }
    this.productionFrom.controls.METAL_RATE_TYPE.setValue(data[0].RATE_TYPE)
  }
  /**USE: Rate type selection */
  rateTypeSelected(event: any) {
    this.productionFrom.controls.METAL_RATE_TYPE.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.productionFrom.controls.METAL_RATE.setValue(WHOLESALE_RATE)
      }
    });
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.productionFrom.controls.CURRENCY_CODE.setValue((event.target.value).toUpperCase())
    } else {
      this.productionFrom.controls.CURRENCY_CODE.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  setFormNullToString(formControlName: string, value: any) {
    this.productionFrom.controls[formControlName].setValue(
      this.commonService.nullToString(value)
    )
    // this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }
  setFormDecimal(formControlName: string, value: any, Decimal: string) {
    let val = this.commonService.setCommaSerperatedNumber(value, Decimal)
    this.productionFrom.controls[formControlName].setValue(val)
    // this.FORM_VALIDATER[formControlName] = val
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.productionFrom.controls.CURRENCY_CODE.setValue(CURRENCY_CODE);
    this.productionFrom.controls.BASE_CURRENCY.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY_CODE);
    this.setFormDecimal('BASE_CURRENCY_RATE', CURRENCY_RATE[0].CONV_RATE, 'RATE')
    this.setCurrencyRate()
  }

  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY_CODE);
    if (CURRENCY_RATE.length > 0) {
      this.setFormDecimal('CURRENCY_RATE', CURRENCY_RATE[0].CONV_RATE, 'RATE')
    } else {
      this.productionFrom.controls.CURRENCY_CODE.setValue('')
      this.productionFrom.controls.CURRENCY_RATE.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  BaseCurrencyRateVisibility(txtPCurr: any, txtPCurrRate: any) {
    let ConvRateArr: any = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.productionFrom.value.CURRENCY_CODE && item.CMBRANCH_CODE == this.productionFrom.value.BRANCH_CODE)
    let baseConvRate = 1 / ConvRateArr[0].CONV_RATE
    this.productionFrom.controls.baseConvRate.setValue(baseConvRate)
  }
  selectRowIndex: any;
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
  }
  onRowDblClickHandler(event: any) {
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.SRNO == selectedData.SRNO)
    this.openProductionEntryDetails(detailRow)
  }
  //use open modal of detail screen
  dataToDetailScreen: any;
  @ViewChild('productionDetailScreen') public ProductionDetailScreen!: NgbModal;
  openProductionEntryDetails(dataToChild?: any) {
    if (dataToChild) {
      this.productionFrom.controls.FLAG.setValue(this.content.FLAG || 'EDIT')
      this.productionFrom.controls.SRNO.setValue(dataToChild.SRNO)
      dataToChild[0].HEADERDETAILS = this.productionFrom.value;
    } else {
      this.productionFrom.controls.FLAG.setValue('ADD')
      this.productionFrom.controls.SRNO.setValue(0)
      dataToChild = [{ HEADERDETAILS: this.productionFrom.value }]
    }
    console.log(dataToChild, 'data to child');
    this.dataToDetailScreen = dataToChild
    this.modalReference = this.modalService.open(this.ProductionDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  detailData: any[] = []
  //use: to set the data from child component to post data
  setValuesToHeaderGrid(DATA: any) {
    let detailDataToParent = DATA.PRODUCTION_FORMDETAILS
    if (detailDataToParent.SRNO != 0) {
      this.JOB_PRODUCTION_DETAIL_DJ[detailDataToParent.SRNO - 1] = DATA.JOB_PRODUCTION_DETAIL_DJ
      this.detailData[detailDataToParent.SRNO - 1] = { SRNO: detailDataToParent.SRNO, ...DATA }
    } else {
      // if (this.addItemWithCheck(this.JOB_PRODUCTION_DETAIL_DJ, detailDataToParent)) return;
      DATA.PRODUCTION_FORMDETAILS.SRNO = this.JOB_PRODUCTION_DETAIL_DJ.length + 1
      DATA.JOB_PRODUCTION_DETAIL_DJ.SRNO = this.JOB_PRODUCTION_DETAIL_DJ.length + 1
      this.detailData.push({ SRNO: this.JOB_PRODUCTION_DETAIL_DJ.length + 1, ...DATA })
      this.JOB_PRODUCTION_DETAIL_DJ.push(DATA.JOB_PRODUCTION_DETAIL_DJ);
    }
    // this.editFinalArray(DATA)
    if (detailDataToParent.FLAG == 'SAVE') this.closeDetailScreen();
    if (detailDataToParent.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('Details added grid successfully')
    };
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.productionFrom.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }
  submitValidations(form: any) {
    if (this.commonService.nullToString(form.VOCTYPE) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// VOCTYPE code CANNOT BE EMPTY
      return true
    }
    if (!this.commonService.formatDDMMYY(form.VOCDATE)) {
      this.commonService.toastErrorByMsgId('MSG1331')// VOCDATE code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.emptyToZero(form.VOCNO) == 0) {
      this.commonService.toastErrorByMsgId('MSG3661')// VOCNO code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.CURRENCY_CODE) == '') {
      this.commonService.toastErrorByMsgId('MSG1172')// currency code CANNOT BE EMPTY
      return true
    }
    if (this.commonService.nullToString(form.CURRENCY_RATE) == '') {
      this.commonService.toastErrorByMsgId('MSG1178')// CURRENCY_RATE code CANNOT BE EMPTY
      return true
    }
    if (this.JOB_PRODUCTION_DETAIL_DJ.length == 0) {
      this.commonService.toastErrorByMsgId('MSG1039')// no line items
      return true
    }
    return false;
  }

  setPostData() {
    let form = this.productionFrom.value
    return {
      "MID": 0,
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE),
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.commonService.nullToString(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
      "YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "DOCTIME": this.commonService.formatDateTime(this.currentDate),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "METAL_RATE_TYPE": this.commonService.nullToString(form.METAL_RATE_TYPE),
      "METAL_RATE": this.commonService.emptyToZero(form.METAL_RATE),
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": this.commonService.nullToString(form.SMAN),
      "REMARKS": this.commonService.nullToString(form.REMARKS),
      "NAVSEQNO": this.commonService.emptyToZero(form.YEARMONTH),
      "FIX_UNFIX": form.UnfixTransaction,
      "STONE_INCLUDE": form.STONE_INCLUDE,
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "BASE_CURRENCY": this.commonService.nullToString(form.BASE_CURRENCY),
      "BASE_CURR_RATE": this.commonService.emptyToZero(form.BASE_CURRENCY_RATE),
      "BASE_CONV_RATE": this.commonService.emptyToZero(form.baseConvRate),
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_PRODUCTION_SUB_DJ": this.JOB_PRODUCTION_SUB_DJ,
      "JOB_PRODUCTION_DETAIL_DJ": this.JOB_PRODUCTION_DETAIL_DJ,
      "JOB_PRODUCTION_STNMTL_DJ": this.JOB_PRODUCTION_STNMTL_DJ, //component grid from stockscreen
      "JOB_PRODUCTION_LABCHRG_DJ": this.JOB_PRODUCTION_LABCHRG_DJ,
      "JOB_PRODUCTION_METALRATE_DJ": this.JOB_PRODUCTION_METALRATE_DJ
    }
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.submitValidations(this.productionFrom.value)) return;

    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService
      .postDynamicAPI("JobProductionMaster/InsertJobProductionMaster", postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success')
          this.viewMode = true
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      },
        (err) => {
          this.isloading = false;
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      );
    this.subscriptions.push(Sub);
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
  update() {
    if (this.submitValidations(this.productionFrom.value)) return;
    let API = "JobProductionMaster/UpdateJobProductionMaster/" + this.productionFrom.value.BRANCH_CODE + this.productionFrom.value.VOCTYPE + this.productionFrom.value.VOCNO + this.productionFrom.value.vocdate;
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          this.isloading = false;
          if (result && result.status == "Success") {
            this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success')
            this.viewMode = true
          } else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId('MSG3577')
          this.isloading = false;
        }
      );
    this.subscriptions.push(Sub);
  }

  deleteClicked() {
    if (!this.content.VOCNO) {
      this.commonService.toastErrorByMsgId('MSG1531')
      return;
    }
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let form = this.productionFrom.value;
        let API = "JobProductionMaster/DeleteJobProductionMaster/" + this.content?.BRANCH_CODE + '/'
          + this.content?.VOCTYPE + '/' + this.content?.VOCNO + '/' + this.content?.YEARMONTH;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  this.showSuccessDialog(this.commonService.getMsgByID('MSG81450'))
                } else {
                  this.commonService.toastErrorByMsgId('MSG1531')
                }
              } else {
                this.commonService.toastErrorByMsgId('MSG1531')
              }
            },
            (err) => {
              this.commonService.toastErrorByMsgId('MSG1531')
            }
          );
        this.subscriptions.push(Sub);
      }
    })

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


  showOverleyPanel(event: any, formControlName: string) {
    if (this.productionFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'SMAN':
        this.overlayuserName.showOverlayPanel(event);
        break;
      case 'CURRENCY_RATE':
        this.OverlayCurrencyRate.showOverlayPanel(event);
        break;
      default:
    }
  }

  /**use: validate all lookups to check data exists in db */
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
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.productionFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'METAL_RATE') {
            this.productionFrom.controls['METAL_RATE_TYPE'].setValue('')
          }
          if (FORMNAME === 'SMAN'|| FORMNAME === 'CURRENCY_RATE') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
        if (FORMNAME === 'METAL_RATE'){
          this.setMetalRate(data)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  setMetalRate(data:any) {
    this.setFormDecimal('METAL_RATE',data[0].WHOLESALE_RATE,'RATE')
  }


  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
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
  closeDetailScreen() {
    this.modalReference.close()
  }
  deleteTableData(): void {
    if (this.selectRowIndex == undefined || this.selectRowIndex == null) {
      this.commonService.toastErrorByMsgId('MSG1458') //No record is selected.
      return
    }
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        this.JOB_PRODUCTION_DETAIL_DJ = this.JOB_PRODUCTION_DETAIL_DJ.filter((item: any) => item.SRNO != this.selectRowIndex)
        this.detailData = this.detailData.filter((item: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }
  reCalculateSRNO() {
    this.JOB_PRODUCTION_DETAIL_DJ.forEach((item, index) => item.SRNO = index + 1)
    this.detailData.forEach((item: any, index: any) => item.SRNO = index + 1)
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
