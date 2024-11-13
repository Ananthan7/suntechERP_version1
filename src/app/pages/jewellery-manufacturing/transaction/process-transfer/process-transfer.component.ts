import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessTransferDetailsComponent } from './process-transfer-details/process-transfer-details.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AuditTrailComponent } from 'src/app/shared/common/audit-trail/audit-trail.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-process-transfer',
  templateUrl: './process-transfer.component.html',
  styleUrls: ['./process-transfer.component.scss']
})
export class ProcessTransferComponent implements OnInit {
  @ViewChild('salesmanOverlay') salesmanOverlay!: MasterSearchComponent;
  @ViewChild('OverlayCurrencyRate') OverlayCurrencyRate!: MasterSearchComponent;
  @ViewChild(AuditTrailComponent) auditTrailComponent?: AuditTrailComponent;

  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  userName = this.commonService.userName;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  tableRowCount: number = 0;
  JOB_PROCESS_TRN_DETAIL_DJ: any[] = [];
  JOB_PROCESS_TRN_COMP_DJ: any[] = [];
  JOB_PROCESS_TRN_LABCHRG_DJ: any[] = [];
  currentDate: any = this.commonService.currentDate;
  sequenceDetails: any[] = []
  private subscriptions: Subscription[] = [];
  modalReference!: NgbModalRef;
  gridAmountDecimalFormat: any;
  isloading: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  isSaved: boolean = false;
  isViewPost: boolean = false;

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
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
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
  /**Procces */
  processTransferFrom: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    VOCDATE: ['', [Validators.required]],
    VOCNO: [''],
    PREV_VOCNO: [''],
    MAIN_VOCTYPE: [''],
    MID: [0],
    salesman: [''],
    SalesmanName: [''],
    CURRENCY_CODE: [''],
    CURRENCY_RATE: [''],
    Narration: [''],
    BRANCH_CODE: [''],
    YEARMONTH: [''],
    FLAG: [''],
    SRNO: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
  }

  ngOnInit(): void {
    //flag setting
    if (this.content?.FLAG) {
      this.isSaved = true;
      this.editMode = false;
      this.viewMode = true;
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.checkMaxVocNumber()
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'DELETE') {
        this.checkMaxVocNumber()
      }
      this.processTransferFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setInitialValues()
    } else {
      this.generateVocNo()
      this.setFormValues()
      this.setCompanyCurrency()
    }
    this.gridSettings()
  }
  ngAfterViewInit() {
  }
  gridSettings() {
    this.gridAmountDecimalFormat = {
      type: 'fixedPoint',
      precision: this.commonService.allbranchMaster?.BAMTDECIMALS,
      currency: this.commonService.compCurrency
    };
  }
  /**USE: get InitialLoadData */
  setInitialValues() {
    if (!this.content?.MID) return
    this.processTransferFrom.controls.MID.setValue(this.content?.MID)
    this.commonService.showSnackBarMsg('MSG81447')
    let API = `JobProcessTrnMasterDJ/GetJobProcessTrnMasterDJDetailList/${this.content?.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.JOB_PROCESS_TRN_DETAIL_DJ = data.JOB_PROCESS_TRN_DETAIL_DJ || []
          this.JOB_PROCESS_TRN_COMP_DJ = data.JOB_PROCESS_TRN_COMP_DJ || []
          this.JOB_PROCESS_TRN_DETAIL_DJ.forEach((item: any, index: number) => {
            item.LOSS_QTY = this.commonService.decimalQuantityFormat(item.LOSS_QTY, 'METAL')
            item.VOCDATE = this.commonService.nullToString(item.VOCDATE.slice(0, 10))
            item.JOB_DATE = this.commonService.nullToString(item.JOB_DATE.slice(0, 10))
            item.APPROVED_DATE = this.commonService.nullToString(item.APPROVED_DATE.slice(0, 10))
            item.IN_DATE = this.commonService.nullToString(item.IN_DATE.slice(0, 10))
            item.OUT_DATE = this.commonService.nullToString(item.OUT_DATE.slice(0, 10))
            this.detailData.push({
              SRNO: item.SRNO,
              FLAG: this.commonService.nullToString(this.content.FLAG),
              JOB_PROCESS_TRN_DETAIL_DJ: item,
              // JOB_PROCESS_TRN_LABCHRG_DJ: data.JOB_PROCESS_TRN_LABCHRG_DJ?.filter((val: any) => item.UNIQUEID == val.REFMID),
              JOB_PROCESS_TRN_COMP_DJ: this.JOB_PROCESS_TRN_COMP_DJ?.filter((val: any) => item.JOB_NUMBER == val.JOB_NUMBER),
            })
          })
          this.tableData = this.JOB_PROCESS_TRN_DETAIL_DJ
          this.processTransferFrom.controls.BRANCH_CODE.setValue(data.BRANCH_CODE)
          this.processTransferFrom.controls.YEARMONTH.setValue(data.YEARMONTH)
          this.processTransferFrom.controls.VOCNO.setValue(data.VOCNO)
          this.processTransferFrom.controls.PREV_VOCNO.setValue(data.VOCNO)
          this.processTransferFrom.controls.VOCDATE.setValue(data.VOCDATE)
          this.processTransferFrom.controls.VOCTYPE.setValue(data.VOCTYPE)
          this.processTransferFrom.controls.MID.setValue(data.MID)
          this.processTransferFrom.controls.CURRENCY_CODE.setValue(data.CURRENCY_CODE)
          this.processTransferFrom.controls.CURRENCY_RATE.setValue(
            this.commonService.decimalQuantityFormat(data.CURRENCY_RATE, 'RATE')
          )
          this.processTransferFrom.controls.salesman.setValue(data.SMAN)
          this.processTransferFrom.controls.Narration.setValue(data.REMARKS)
          if(this.content?.FLAG == 'VIEW' && this.commonService.nullToString(data.POSTDATE) != '') this.isViewPost = true;
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  setFormValues() {
    this.processTransferFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.processTransferFrom.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.processTransferFrom.controls.VOCDATE.setValue(this.currentDate)
    this.processTransferFrom.controls.VOCTYPE.setValue(
      this.commonService.getqueryParamVocType()
    )
    this.processTransferFrom.controls.MAIN_VOCTYPE.setValue(
      this.commonService.getqueryParamMainVocType()
    )
    this.setVocTypeMaster()
  }
  checkMaxVocNumber(clickFlag?: number) {
    let postData = {
      "SPID": "137",
      "parameter": {
        'BranchCode': this.commonService.branchCode || '',
        'YearMonth': this.commonService.nullToString(this.content?.YEARMONTH) || '',
        'VocNo': this.commonService.nullToString(this.content?.VOCNO) || '',
        'VocType': this.commonService.nullToString(this.content?.VOCTYPE) || '',
        'JobNo': '',
        // 'JobNo': this.tableData.length>0 ? this.commonService.nullToString(this.tableData[0].JOB_NUMBER) : '',
        'VocDate': this.commonService.formatYYMMDD(this.content?.VOCDATE) || '',
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data && data[0].RESULT == 1) {
            this.editMode = true;
            this.viewMode = false;
            if (this.content.FLAG == 'DELETE' || clickFlag == 1) {
              this.viewMode = true;
              this.deleteClicked()
            }
          }
          if (data[0].MESSAGE && data[0].MESSAGE != '') {
            this.commonService.toastErrorByMsgId(data[0].MESSAGE)
          }
        }
      })
    this.subscriptions.push(Sub)
  }
  LOCKVOUCHERNO: boolean = true;
  minDate: any;
  maxDate: any;
  setVocTypeMaster() {
    this.LOCKVOUCHERNO = this.commonService.getVoctypeMasterLockVoucher()
    this.minDate = this.commonService.getVoctypeMasteMinDate();
    this.maxDate = this.commonService.getVoctypeMasterMaxDate();
  }

  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.commonService.getqueryParamVocType()}/${this.commonService.branchCode}/${this.commonService.yearSelected}/${this.commonService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.processTransferFrom.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }
  showOverleyPanel(event: any, formControlName: string) {
    if (event.target.value != '') return
    switch (formControlName) {
      case 'salesman':
        this.salesmanOverlay.showOverlayPanel(event);
        break;
      case 'CURRENCY_RATE':
        this.OverlayCurrencyRate.showOverlayPanel(event);
        break;
      default:
    }
  }

  lookupKeyPress(event: any, form?: any) {
    console.log(event);

    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.processTransferFrom.controls.VOCDATE.setValue(new Date(date))
    }
  }
  /**USE: on clicking row Opens new detail adding screen */
  selectRowIndex: any;
  onRowClickHandler(event: any) {
    this.selectRowIndex = event.data.SRNO
    console.log(this.selectRowIndex);
  }
  onRowDblClickHandler(event: any) {
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.SRNO == selectedData.SRNO)
    console.log(this.detailData, 'detailRow');
    console.log(detailRow, 'detailRow');

    this.openProcessTransferDetails(detailRow)
  }
  //use open modal of detail screen
  dataToDetailScreen: any;
  @ViewChild('processTransferDetailScreen') public ProcessTransferDetailScreen!: NgbModal;
  openProcessTransferDetails(dataToChild?: any) {
    if (dataToChild) {
      this.processTransferFrom.controls.FLAG.setValue(this.content.FLAG || 'EDIT')
      this.processTransferFrom.controls.SRNO.setValue(dataToChild.SRNO)
      dataToChild[0].HEADERDETAILS = this.processTransferFrom.value;
    } else {
      this.processTransferFrom.controls.FLAG.setValue('ADD')
      this.processTransferFrom.controls.SRNO.setValue(0)
      dataToChild = [{ HEADERDETAILS: this.processTransferFrom.value }]
    }
    console.log(dataToChild, 'data to child');

    this.dataToDetailScreen = dataToChild
    this.modalReference = this.modalService.open(this.ProcessTransferDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }
  addItemWithCheck(existingArray: any, newItem: any) {
    let duplicate = false;
    if (newItem.DESIGN_TYPE == 'METAL') {
      duplicate = existingArray.find((item: any) => item.JOB_NUMBER === newItem.JOB_NUMBER
        && item.FRM_WORKER_CODE === newItem.FRM_WORKER_CODE
        && item.FRM_PROCESS_CODE === newItem.FRM_PROCESS_CODE);
    } else {
      duplicate = existingArray.find((item: any) => item.JOB_NUMBER === newItem.JOB_NUMBER);
    }
    if (duplicate) {
      this.commonService.toastErrorByMsgId('MSG2052')
      return true
    }
    return false;
  }
  //use: to set the data from child component to post data
  setValuesToHeaderGrid(DATA: any) {
    let detailDataToParent = DATA.PROCESS_FORMDETAILS
    if (detailDataToParent.SRNO != 0) {
      this.tableData[detailDataToParent.SRNO - 1] = DATA.JOB_PROCESS_TRN_DETAIL_DJ
      this.detailData[detailDataToParent.SRNO - 1] = { SRNO: detailDataToParent.SRNO, ...DATA }
    } else {
      if (this.addItemWithCheck(this.tableData, detailDataToParent)) return;
      DATA.PROCESS_FORMDETAILS.SRNO = this.tableData.length + 1
      DATA.JOB_PROCESS_TRN_DETAIL_DJ.SRNO = this.tableData.length + 1
      // DATA.JOB_PROCESS_TRN_LABCHRG_DJ.SRNO = this.tableData.length + 1
      this.detailData.push({ SRNO: this.tableData.length + 1, ...DATA })
      this.tableData.push(DATA.JOB_PROCESS_TRN_DETAIL_DJ);
    }

    this.editFinalArray(DATA)
    if (detailDataToParent.FLAG == 'SAVE') this.closeDetailScreen();
    if (detailDataToParent.FLAG == 'CONTINUE') {
      this.commonService.showSnackBarMsg('Details added grid successfully')
    };
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.showSnackBarMsg('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.processTransferFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'salesman' || FORMNAME === 'CURRENCY_RATE') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
        this.showOverleyPanel(event, FORMNAME);
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  closeOverlayPanel(FORMNAME: any) {
    if (FORMNAME === 'salesman') {
      this.salesmanOverlay.closeOverlayPanel()
      return
    }
    if (FORMNAME === 'CURRENCY_RATE') {
      this.OverlayCurrencyRate.closeOverlayPanel()
      return
    }
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.commonService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.commonService.getqueryParamMainVocType()}/${this.processTransferFrom.value.VOCNO}`
    API += `/${this.commonService.branchCode}/${this.commonService.getqueryParamVocType()}`
    API += `/${this.commonService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.commonService.toastErrorByMsgId('MSG2007')
          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  editFinalArray(DATA: any) {
    // this.tableData.forEach((item: any) =>{

    // })
    this.JOB_PROCESS_TRN_DETAIL_DJ = this.detailData.map((item: any) => item.JOB_PROCESS_TRN_DETAIL_DJ)
    this.JOB_PROCESS_TRN_COMP_DJ = this.detailData.map((item: any) => item.JOB_PROCESS_TRN_COMP_DJ).flat()
    // this.JOB_PROCESS_TRN_LABCHRG_DJ = this.detailData.map((item: any) => item.JOB_PROCESS_TRN_LABCHRG_DJ)
    console.log(this.JOB_PROCESS_TRN_DETAIL_DJ, 'Detail');
    console.log(this.JOB_PROCESS_TRN_COMP_DJ, 'Stone metal');
  }

  closeDetailScreen() {
    this.modalReference.close()
  }

  salesmanSelected(event: any) {
    this.processTransferFrom.controls.salesman.setValue(event.SALESPERSON_CODE)
    this.processTransferFrom.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.processTransferFrom.controls.CURRENCY_CODE.setValue((event.target.value).toUpperCase())
    } else {
      this.processTransferFrom.controls.CURRENCY_CODE.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCurrencyCode()
    this.processTransferFrom.controls.CURRENCY_CODE.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    let CURRENCY_RATE: any = this.commonService.getCurrencyRate(this.processTransferFrom.value.CURRENCY_CODE);
    if (CURRENCY_RATE.length > 0) {
      this.processTransferFrom.controls.CURRENCY_RATE.setValue(CURRENCY_RATE);
    } else {
      this.processTransferFrom.controls.CURRENCY_CODE.setValue('')
      this.processTransferFrom.controls.CURRENCY_RATE.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  checkScrapStockCode(stockCode: any, GridstockCode: any, METALSTONE: any) {
    try {
      if (stockCode == GridstockCode && METALSTONE.toUpperCase() == 'M') return stockCode;
      return ''
    } catch (error) {
      return ''
    }
  }

  submitValidations(form: any) {
    // if (this.commonService.nullToString(form.VOCNO) == 0) {
    //   this.commonService.toastErrorByMsgId('MSG1940')
    //   return true;
    // }
    if (this.commonService.nullToString(form.VOCTYPE) == '') {
      this.commonService.toastErrorByMsgId('MSG1942')
      return true;
    }
    if (this.commonService.emptyToZero(form.CURRENCY_RATE) == 0) {
      this.commonService.toastErrorByMsgId('MSG1178')
      return true;
    }
    if (this.tableData?.length <= 0) {
      this.commonService.toastErrorByMsgId('MSG1200')
      return true;
    }
    if (this.processTransferFrom.invalid) {
      this.commonService.toastErrorByMsgId('Select all requried feilds')
      return true;
    }
    return false;
  }

  // submit save click
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updatePTF()
      return
    }
    if (this.submitValidations(this.processTransferFrom.value)) return;

    let API = 'JobProcessTrnMasterDJ/InsertJobProcessTrnMasterDJ';
    let postData = this.setPostData(this.processTransferFrom.value)
    this.commonService.showSnackBarMsg('MSG81447');
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        this.isSaved = true;
        this.commonService.closeSnackBarMsg()
        if (result.response && result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
          let res = result.response
          this.processTransferFrom.controls.VOCNO.setValue(res.VOCNO)
          this.viewMode = true;
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  // update API call
  updatePTF() {
    if (this.submitValidations(this.processTransferFrom.value)) return;

    let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/' +
      this.processTransferFrom.value.BRANCH_CODE + '/' +
      this.processTransferFrom.value.VOCTYPE + '/' +
      this.processTransferFrom.value.VOCNO + '/' +
      this.processTransferFrom.value.YEARMONTH
    let postData = this.setPostData(this.processTransferFrom.value)
    this.commonService.showSnackBarMsg('MSG81447');
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isSaved = true;
        this.isloading = false;
        this.commonService.closeSnackBarMsg()
        if (result.response && result.status == "Success") {
          this.showSuccessDialog(this.commonService.getMsgByID('MSG2443') || 'Success');
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  removeKeyValue(array: any[], key: string) {
    array.forEach(item => {
      delete item[key];
    });
  }

  // use to set payload data
  setPostData(form: any) {
    let detailScreenData = this.detailData[0]
    detailScreenData = detailScreenData.PROCESS_FORMDETAILS;
    let postdata = {
      "MID": this.commonService.emptyToZero(form.MID),
      "VOCTYPE": this.commonService.nullToString(form.VOCTYPE?.toUpperCase()),
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "VOCNO": this.commonService.nullToString(form.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(form.VOCDATE),
      "YEARMONTH": this.commonService.nullToString(form.YEARMONTH),
      "DOCTIME": this.commonService.formatDateTime(this.currentDate),
      "SMAN": this.commonService.nullToString(form.salesman),
      "REMARKS": this.commonService.nullToString(form.Narration),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "NAVSEQNO": this.commonService.yearSelected,
      "LAB_TYPE": 0,
      "AUTOPOSTING": false,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_PROCESS_TRN_DETAIL_DJ": this.JOB_PROCESS_TRN_DETAIL_DJ || [], //header grid details
      "JOB_PROCESS_TRN_COMP_DJ": this.JOB_PROCESS_TRN_COMP_DJ || [], //detail screen data
      "JOB_PROCESS_TRN_LABCHRG_DJ": [] //no need of saving now labour charge details
    }
    return postdata
  }

  deleteTableData(): void {
    if (this.selectRowIndex == undefined || this.selectRowIndex == null) {
      this.commonService.toastErrorByMsgId('MSG1458') //No record is selected.
      return
    }
    this.showConfirmationDialog("You won't be able to revert this!").then((result) => {
      if (result.isConfirmed) {
        this.tableData = this.tableData.filter((item: any) => item.SRNO != this.selectRowIndex)
        this.detailData = this.detailData.filter((item: any) => item.SRNO != this.selectRowIndex)
        this.reCalculateSRNO()
      }
    }
    )
  }

  reCalculateSRNO() {
    this.tableData.forEach((item, index) => item.SRNO = index + 1)
    this.detailData.forEach((item: any, index: any) => item.SRNO = index + 1)
  }

  deleteClicked() {
    if (!this.content.VOCTYPE) {
      this.commonService.showSnackBarMsg('MSG1632')
      return
    }
    this.showConfirmationDialog("You won't be able to revert this!").then((result) => {
      if (result.isConfirmed) {
        let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' +
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
  showConfirmationDialog(message: string): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: message,
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
  //USE: account posting click fn 
  AccountPosting() {
    if (!this.content) return
    let form = this.processTransferFrom.value;
    let params = {
      BRANCH_CODE: this.commonService.nullToString(form.BRANCH_CODE),
      VOCTYPE: this.commonService.nullToString(form.VOCTYPE),
      VOCNO: this.commonService.emptyToZero(form.VOCNO),
      YEARMONTH: this.commonService.nullToString(form.YEARMONTH),
      MID: this.commonService.nullToString(this.content?.MID),
      ACCUPDATEYN: 'Y',
      USERNAME: this.commonService.userName,
      MAINVOCTYPE: this.commonService.getqueryParamMainVocType(),
      HEADER_TABLE: this.commonService.getqueryParamTable(),
    }

    let API = `AccountPosting/${params.BRANCH_CODE}/${params.VOCTYPE}/${params.VOCNO}/${params.YEARMONTH}/${params.MID}/${params.ACCUPDATEYN}/${params.USERNAME}/${params.MAINVOCTYPE}/${params.HEADER_TABLE}/${this.content === 'EDIT' ? 'E' : 'A'}/${environment.app_version}/${'N'}`;

    // let API = 'AccountPosting' + '/' + form.BRANCH_CODE + '/' + form.VOCTYPE + '/' + form.VOCNO + '/' +
    //   form.YEARMONTH + '/' + this.commonService.nullToString(this.content?.MID) + '/' +
    //   'Y' + '/' + this.commonService.userName + '/' + this.commonService.getqueryParamMainVocType() +
    //   '/' + this.commonService.getqueryParamTable() + '/' +'E'+ '/'+ environment.app_version+ '/'+'post'
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.isViewPost = true;
          this.commonService.toastSuccessByText(result.message)
        } else {
          this.commonService.toastErrorByMsgId(result.message)
        }
      },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG81451")
        }
      );
    this.subscriptions.push(Sub);
  }
  auditTrailClick() {
    let params = {
      BRANCH_CODE: this.processTransferFrom.value.BRANCH_CODE,
      VOCTYPE: this.processTransferFrom.value.VOCTYPE,
      VOCNO: this.processTransferFrom.value.VOCNO,
      MID: this.processTransferFrom.value.MID,
      YEARMONTH: this.processTransferFrom.value.YEARMONTH,
    }
    this.auditTrailComponent?.showDialog(params)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
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
}
