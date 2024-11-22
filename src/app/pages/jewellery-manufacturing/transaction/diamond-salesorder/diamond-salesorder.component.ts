import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AddNewdetailComponent } from './add-newdetail/add-newdetail.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
@Component({
  selector: 'app-diamond-salesorder',
  templateUrl: './diamond-salesorder.component.html',
  styleUrls: ['./diamond-salesorder.component.scss']
})
export class DiamondSalesorderComponent implements OnInit {
  @ViewChild('overlayorderType') overlayorderType!: MasterSearchComponent;
  @ViewChild('overlayPartyCode') overlayPartyCode!: MasterSearchComponent;
  @ViewChild('overlaySalesmanCode') overlaySalesmanCode!: MasterSearchComponent;
  @ViewChild('overlaywholeSaleRate') overlaywholeSaleRate!: MasterSearchComponent;
  @ViewChild('overlayDeliveryTypeDesc') overlayDeliveryTypeDesc!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  @Input() content!: any; //use: To get clicked row details from master grid
  private subscriptions: Subscription[] = [];

  detailData: any[] = [];
  tableData: any[] = [];
  grossChecked: boolean = false;
  NetWtChecked: boolean = true;
  currentDate = this.commonService.currentDate;
  tableItems: any[] = [];
  totalDetailNo: number = 0;

  headerDetailGridToSave: any[] = [];
  bomDetailGridToSave: any[] = [];
  labourDetailsListToSave: any[] = []
  postDataToSave: any[] = [];
  componentPartDetailsToSave: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;


  Narration: string = '';
  labourDetailGrid: any[] = [];
  divisionDetailGrid: any[] = [];
  headerLaboursListToSave: any[] = [];
  headerDivisionListToSave: any[] = [];

  OrderTypeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Order Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='ORDERTYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  PartyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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
  partyCurrencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: false,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  /**USE: Design Code lookup model*/
  deliveryTypeMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'General Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'DELIVERY TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: main form party details */
  PartyDetailsOrderForm: FormGroup = this.formBuilder.group({
    VOCTYPE: ['', [Validators.required]],
    VOCNO: [''],
    VOCDATE: ['', [Validators.required]],
    FLAG: [''],
    orderType: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],
    SalesmanCode: ['', [Validators.required]],
    SalesmanName: [''],
    FixedMetal: [false,],
    rateType: ['', [Validators.required]],
    wholeSaleRate: ['', [Validators.required]],
    METAL_GRAM_RATE: [''],
    partyCurrencyType: ['', [Validators.required]],
    partyCurrencyRate: ['', [Validators.required]],
    ItemCurrency: ['', [Validators.required]],
    ItemCurrencyRate: ['', [Validators.required]],
    BillToAccountHead: [''],
    BillToAddress: [''],
    DeliveryType: [''],
    DeliveryTypeDesc: [''],
    DeliveryOnDateType: [''],
    DeliveryOnDate: [''],
    Proposal: [''],
    BussinessType: [''],
    Language: [''],
    ReferredBy: [''],
    NotesTerms: [''],
    PaymentTerms: [''],
    ShipTo: [''],
    ShipToDesc: [''],
    SUBLEDGER_CODE: [''],
    PROSP_ORIGIN: [''],
    AMCPercentage: [''],
    AMCSTARTDATE: [''],
    summaryBtn: [false],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) {
  }

  ngOnInit(): void {
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.editMode = true;
        this.LOCKVOUCHERNO = true;
      }
      if (this.content.FLAG == 'DELETE') {
        this.deleteClicked()
      }
      this.PartyDetailsOrderForm.controls.FLAG.setValue(this.content.FLAG)
      this.setInitialValues()
    } else {
      this.setNewFormValues()
      this.getLabourChargeGridDetails()
    }
  }

    Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);
    
  }

  setNewFormValues(){
    this.generateVocNo()
    this.getRateType()
    this.setVocTypeMaster()
    this.PartyDetailsOrderForm.controls.VOCDATE.setValue(this.currentDate)
    this.PartyDetailsOrderForm.controls.DeliveryOnDate.setValue(this.currentDate)
    this.PartyDetailsOrderForm.controls.VOCTYPE.setValue(this.commonService.getqueryParamVocType())
    this.PartyDetailsOrderForm.controls.AMCSTARTDATE.setValue(this.currentDate)
  }
  setInitialValues(){

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
          this.PartyDetailsOrderForm.controls.VOCNO.setValue(resp.newvocno);
        }
      });
  }
  /**USE: to get metal gram rate from db */
  getMetalGramRate() {
    let postData = {
      "SPID": "039",
      "parameter": {
        'dblOutputMetalRateCC': '0',
        'dblOutputMetalRatePG': '0',
        'strBranchCode': this.commonService.branchCode,
        'strRateType': this.PartyDetailsOrderForm.value.rateType,
        'dblMetalRate': this.commonService.nullToString(this.PartyDetailsOrderForm.value.wholeSaleRate),
        'strPartycurrencyCode': this.PartyDetailsOrderForm.value.partyCurrencyType,
        'dblPartycurrencyRate': this.commonService.nullToString(this.PartyDetailsOrderForm.value.partyCurrencyRate),
        'strItemcurrencyCode': this.PartyDetailsOrderForm.value.ItemCurrency,
        'dblItemcurrencyRate': this.commonService.nullToString(this.PartyDetailsOrderForm.value.partyCurrencyRate),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
          this.PartyDetailsOrderForm.controls.METAL_GRAM_RATE.setValue(data[0].METAL_RATE_PERGM)
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    // this.subscriptions.push(Sub)
  }
  //party Code Change
  getLabourChargeGridDetails() {
    let postData = {
      "SPID": "022",
      "parameter": {
        "strMainVocType": this.PartyDetailsOrderForm.value.VOCTYPE || "",
        "intMid": "",
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          this.labourDetailGrid = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
          this.divisionDetailGrid = this.commonService.arrayEmptyObjectToString(result.dynamicData[1])
          this.resetGridSRNO()
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  getRateType() {
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.DIVISION_CODE == 'G' && item.DEFAULT_RTYPE == 1)
    if (data[0].WHOLESALE_RATE) {
      let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
      this.PartyDetailsOrderForm.controls.wholeSaleRate.setValue(WHOLESALE_RATE)
    }
    this.PartyDetailsOrderForm.controls.rateType.setValue(data[0].RATE_TYPE)
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.PartyDetailsOrderForm.controls.VoucherDate.setValue(new Date(date))
    }
  }
  /**USE: on clicking row Opens new detail adding screen */
  onRowClickHandler(event: any) {
    let selectedData = event.data
    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
    let allDataSelected = [detailRow[0].DATA]
    this.addNewDetail(allDataSelected)
  }
  /**USE: Opens new detail adding screen 
   * input: data contains {headerDetails,DATA}
  */
  addNewDetail(data?: any) {
    if (data) {
      data[0].HEADERDETAILS = this.PartyDetailsOrderForm.value;
    } else {
      data = [{ HEADERDETAILS: this.PartyDetailsOrderForm.value }]
    }
    console.log(data, 'data passing to detail screen');

    // if (this.HeaderValidate() == false){
    //   return  //TODO
    // }
    if (this.PartyDetailsOrderForm.value.PartyCode == '') {
      this.commonService.toastErrorByMsgId('MSG1549');
      return
    }
    if (this.commonService.getCompanyParamValue('COMPACCODE') == 'SUNTECH') {
      this.openDetailForm(CompanyDetailComponent, data)
    } else {
      this.openDetailForm(AddNewdetailComponent, data)
    }
  }

  // use: save value setting section
  private setValuesToHeaderGrid(result: any): void {
    console.log(result, 'DATA COMMING TO HEADER');
    this.totalDetailNo += 1

    let summaryData: any[] = result[0].SUMMARYDETAILS; //summary details

    summaryData.forEach((item: any, index: any) => {
      // if (item.CATEGORY_CODE == '') {
      //   return
      // }
      item.SRNO = this.totalDetailNo
      this.tableData.push(item)
    })
    console.log(this.tableData);

    if (result.length > 0) {
      result.forEach((item: any, index: any) => {
        this.detailData.push({
          ID: this.totalDetailNo,
          DATA: item
        })
      })

      //set datas for saving to arrays
      this.setHeaderGridData()
      this.setBOMGridData()
      this.setCompartmentPartDetails()
      this.setLabourTypeDetails()
      this.setPostDataToSave()
      // this.setLabourTypeDetails()
    }
  }
  resetGridSRNO(){
    this.divisionDetailGrid.forEach((item:any,index: number)=>{
      item.IS_SELECTED = false
      item.SELECTALL = false
      item.SRNO = index+1
    })
    this.labourDetailGrid.forEach((item:any,index: number)=>{
      item.IS_SELECTED = false
      item.SELECTALL = false
      item.SRNO = index+1
    })
  }
  selectAllboxDivision(event:any){
    this.divisionDetailGrid.forEach((item:any)=>{
      item.SELECTALL = !item.SELECTALL
      item.IS_SELECTED = item.SELECTALL
    })
  }
  selectAllboxLabour(event:any){
    console.log(this.labourDetailGrid);
    this.labourDetailGrid.forEach((item:any)=>{
      item.SELECTALL = !item.SELECTALL
      item.IS_SELECTED = item.SELECTALL
    })
    console.log(this.labourDetailGrid);
  }
  /* USE: division grid selection from header to save*/
  selectDivisionGridData(event: any) {
    const data = event.selectedRowKeys;
    // this.divisionDetailGrid[event.data.SRNO - 1].IS_SELECTED = !event.data.IS_SELECTED;
    let division = {
      "UNIQUEID": 0,
      "BRANCH_CODE": this.commonService.nullToString(this.commonService.branchCode),
      "VOCTYPE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.VOCTYPE),
      "VOCNO": 0,
      "YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "SRNO": this.commonService.emptyToZero(data.Id),
      "DIVISION_CODE": this.commonService.nullToString(data.DIVISION_CODE),
      "DESCRIPTION": this.commonService.nullToString(data.DESCRIPTION)
    }
    if (event.currentTarget.checked) {
      this.headerDivisionListToSave.push(division)
    } else {
      if (this.headerDivisionListToSave.length > 0) {
        this.headerDivisionListToSave = this.headerDivisionListToSave.filter((item: any) => item.SRNO != data.SRNO)
      }
    }
  }
  /* USE: Labour grid selection from header to save*/
  selectLabourGridData(event: any) {
    const data = event.selectedRowKeys;
    // this.labourDetailGrid[event.data.SRNO - 1].IS_SELECTED = !event.data.IS_SELECTED;
    let headerDetails = {
      "UNIQUEID": 0,
      "BRANCH_CODE": this.commonService.nullToString(this.commonService.branchCode),
      "VOCTYPE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.VOCTYPE),
      "VOCNO": 0,
      "YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "SRNO": this.commonService.nullToString(data.Id),
      "LABOUR_CODE": this.commonService.nullToString(data.LABOUR_CODE),
      "METALSTONE": this.commonService.nullToString(data.METALSTONE),
      "DIVCODE": this.commonService.nullToString(data.DIVCODE),
      "DIVISION": this.commonService.nullToString(data.DIVISION),
      "KARAT_CODE": this.commonService.nullToString(data.KARAT_CODE),
      "UNITCODE": this.commonService.nullToString(data.UNITCODE),
      "WASTAGE_PER": this.commonService.emptyToZero(data.WASTAGE_PER),
      "SELLING_PER": this.commonService.emptyToZero(data.SELLING_PER),
      "SELLING_RATE": this.commonService.emptyToZero(data.SELLING_RATE),
      "CURRENCYCODE": this.commonService.nullToString(data.CURRENCYCODE),
      "CARATWT_FROM": this.commonService.emptyToZero(data.CARATWT_FROM),
      "CARATWT_TO": this.commonService.emptyToZero(data.CARATWT_TO),
      "TYPE_CODE": this.commonService.nullToString(data.TYPE_CODE),
      "CATEGORY_CODE": this.commonService.nullToString(data.CATEGORY_CODE),
      "LAB_ACCODE": this.commonService.nullToString(data.LAB_ACCODE),
      "SHAPE": this.commonService.nullToString(data.SHAPE)
    }
    if (event.currentTarget.checked) {
      this.headerLaboursListToSave.push(headerDetails)
    } else {
      if (this.headerLaboursListToSave.length > 0) {
        this.headerLaboursListToSave = this.headerLaboursListToSave.filter((item: any) => item.SRNO != data.SRNO)
      }
    }
  }
  private setCompartmentPartDetails() {
    let componentData = this.detailData[0].DATA['COMPONENT_DETAILS']
    let partsData = this.detailData[0].DATA['PART_DETAILS']
    let summary = this.detailData[0].DATA['SUMMARYDETAILS']

    componentData.forEach((item: any) => {
      this.componentPartDetailsToSave.push({
        "UNIQUEID": 0,
        "DT_BRANCH_CODE": this.commonService.branchCode,
        "DT_VOCTYPE": this.commonService.getqueryParamVocType,
        "DT_VOCNO": 0,
        "DT_YEARMONTH": this.commonService.yearSelected,
        "SRNO": 0,
        "SLNO": this.commonService.emptyToZero(item.SLNO),
        "DESIGN_CODE": this.commonService.nullToString(summary[0].designCode),
        "COMP_TYPE": this.commonService.nullToString(item.COMP_TYPE),
        "COMP_CODE": this.commonService.nullToString(item.COMP_CODE),
        "COMP_DESCRIPTION": this.commonService.nullToString(item.COMP_DESCRIPTION),
        "COMP_SHAPE": this.commonService.nullToString(item.COMP_SHAPE),
        "TYPE_CODE": this.commonService.nullToString(item.TYPE_CODE),
        "CATEGORY_CODE": this.commonService.nullToString(item.CATEGORY_CODE),
        "COMPSIZE_CODE": this.commonService.nullToString(item.COMPSIZE_CODE),
        "COMPSET_CODE": this.commonService.nullToString(item.COMPSET_CODE),
        "REMARKS": this.commonService.nullToString(item.TYPE_CODE),
        "PCS": this.commonService.emptyToZero(item.PCS),
        "PART_COLOR": this.commonService.nullToString(partsData[0].PART_COLOR)
      })
    })
  }
  /**USE: set Labour Type Details comming from detail screen for saving */
  private setLabourTypeDetails() {
    let summary = this.detailData[0]?.DATA['SUMMARYDETAILS']
    let labourDetails = this.detailData[0]?.DATA['LABOURDETAILS']
    if (!labourDetails) return
    labourDetails.forEach((item: any) => {
      this.labourDetailsListToSave.push({
        "UNIQUEID": 0,
        "BRANCH_CODE": this.commonService.branchCode,
        "DESIGN_CODE": this.commonService.nullToString(summary[0].designCode),
        "CODE": this.commonService.nullToString(item.CODE),
        "DESCRIPTION": this.commonService.nullToString(item.DESCRIPTION),
        "COST": this.commonService.emptyToZero(item.COST),
        "STD_TIME": this.commonService.emptyToZero(item.STD_TIME),
        "MAX_TIME": this.commonService.emptyToZero(item.MAX_TIME),
        "UNQ_DESIGN_ID": this.commonService.nullToString(item.UNQ_DESIGN_ID),
        "LOCTYPE_CODE": this.commonService.nullToString(item.LOCTYPE_CODE),
        "VOCTYPE": this.commonService.getqueryParamVocType(),
        "VOCNO": this.commonService.emptyToZero(item.VOCNO),
        "YEARMONTH": this.commonService.yearSelected,
        "SRNO": this.commonService.emptyToZero(item.SRNO),
        "STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "METALSTONE": this.commonService.nullToString(item.METALSTONE),
        "DIVCODE": this.commonService.nullToString(item.DIVCODE),
        "PCS": this.commonService.emptyToZero(item.PCS),
        "GROSS_WT": this.commonService.emptyToZero(item.GROSS_WT),
        "LABOUR_CODE": "",
        "LAB_RATE": this.commonService.emptyToZero(item.LAB_RATE),
        "LAB_ACCODE": "",
        "LAB_AMTFC": 0,
        "UNITCODE": "",
        "LABTYPE": this.commonService.nullToString(item.LABTYPE),
        "CURRENCYCODE": "",
        "SLNO": 0,
        "DIVISION": "",
        "WASTAGE_PER": this.commonService.emptyToZero(item.WASTAGE_PER),
        "WASTAGE_QTY": 0,
        "WASTAGE_AMT": this.commonService.emptyToZero(item.WASTAGE_AMT),
        "WASTAGE_RATE": 0,
        "KARAT_CODE": ""
      })
    });

  }
  //**USE: push data from BOM grid in details to bomDetailGridToSave array */
  private setBOMGridData() {
    let bomData = this.detailData[0]?.DATA['BOMDETAILS']
    let summary = this.detailData[0]?.DATA['SUMMARYDETAILS']
    if (!bomData) return

    bomData.forEach((item: any) => {
      this.bomDetailGridToSave.push({
        "UNIQUEID": 0,
        "SRNO": this.commonService.emptyToZero(item.SRNO),
        "BRANCH_CODE": this.commonService.branchCode,
        "DESIGN_CODE": this.commonService.nullToString(summary[0].designCode),
        "METALSTONE": this.commonService.nullToString(item.METALSTONE),
        "DIVCODE": this.commonService.nullToString(item.DIVCODE),
        "PRICEID": this.commonService.nullToString(item.PRICEID),
        "KARAT_CODE": this.commonService.nullToString(item.KARAT_CODE),
        "CARAT": this.commonService.emptyToZero(item.GROSS_WT),
        "GROSS_WT": this.commonService.emptyToZero(item.GROSS_WT),
        "PCS": this.commonService.emptyToZero(item.PCS),
        "RATE_TYPE": this.commonService.nullToString(item.RATE_TYPE),
        "CURRENCY_CODE": this.commonService.nullToString(summary[0].CURRENCY_CODE),
        "AMOUNTFC": this.commonService.emptyToZero(item.AMOUNTFC),
        "AMOUNTLC": this.commonService.emptyToZero(item.AMOUNTLC),
        "MAKINGRATE": this.commonService.emptyToZero(item.MAKINGRATE) || 0,
        "MAKINGAMOUNT": this.commonService.emptyToZero(item.MAKINGAMOUNT) || 0,
        "SIEVE": this.commonService.nullToString(item.SIEVE),
        "COLOR": this.commonService.nullToString(item.COLOR),
        "CLARITY": this.commonService.nullToString(item.CLARITY),
        "SHAPE": this.commonService.nullToString(item.SHAPE),
        "SIZE_FROM": this.commonService.nullToString(item.SIZE_FROM),
        "SIZE_TO": this.commonService.nullToString(item.SIZE_TO),
        "UNQ_DESIGN_ID": "",
        "ISSUE_COST": 0,
        "LOCTYPE_CODE": this.commonService.nullToString(item.METALSTONE),
        "RATELC": this.commonService.emptyToZero(item.RATELC),
        "RATEFC": this.commonService.emptyToZero(item.RATEFC),
        "LINKID": this.commonService.nullToString(item.METALSTONE),
        "LABCHGCODE": this.commonService.nullToString(item.METALSTONE),
        "LABRATEFC": this.commonService.emptyToZero(item.LABRATEFC),
        "LABRATELC": this.commonService.emptyToZero(item.LABRATELC),
        "LABAMOUNTFC": this.commonService.emptyToZero(item.LABAMOUNTFC),
        "LABAMOUNTLC": this.commonService.emptyToZero(item.LABAMOUNTLC),
        "METALPERCENTAGE": this.commonService.emptyToZero(item.METALPERCENTAGE),
        "CURRENCY_RATE": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.ItemCurrencyRate),
        "STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "VOCTYPE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.VOCTYPE),
        "VOCNO": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.VOCNO),
        "YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
        "COMPSLNO": 0,
        "TREE_BRANCH_CODE": "",
        "TREE_VOCTYPE": "",
        "TREE_VOCNO": 0,
        "TREE_YEARMONTH": "",
        "PROCESS_TYPE": this.commonService.nullToString(item.PROCESS_TYPE),
        "SIEVE_SET": this.commonService.nullToString(item.SIEVE_SET),
        "DSN_STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "PROD_VARIANCE": this.commonService.emptyToZero(item.PROD_VARIANCE),
        "COMP_CODE": this.commonService.nullToString(item.COMP_CODE),
        "DEL_DATE": "2023-10-26T09:05:45.384Z",
        "WASTAGE_PER": this.commonService.emptyToZero(item.WASTAGE_PER),
        "WASTAGE_WT": this.commonService.emptyToZero(item.WASTAGE_WT),
        "WASTAGE_AMTFC": this.commonService.emptyToZero(item.WASTAGE_AMTFC),
        "WASTAGE_AMTLC": this.commonService.emptyToZero(item.WASTAGE_AMTLC),
        "STONE_TYPE": this.commonService.nullToString(item.STONE_TYPE),
        "PURITY": this.commonService.emptyToZero(item.PURITY),
      })
    })
  }
  /**USE:set Details data from header grid to headerDetailGridToSave array */
  private setHeaderGridData() {
    let summaryData = this.detailData[0].DATA['SUMMARYDETAILS']

    let detailArrayValues = {}
    let UNQ_DESIGN_ID = ''
    let COSTFC = 0
    summaryData.forEach((item: any) => {
      //UNQ_DESIGN_ID
      if (item.designCode != "") {
        UNQ_DESIGN_ID = (this.commonService.branchCode +
          this.PartyDetailsOrderForm.value.VOCTYPE + "-"
          + this.PartyDetailsOrderForm.value.VOCNO + "-" +
          this.commonService.nullToString(item.designCode) + "-" +
          this.commonService.nullToString(item.SRNO) + "-" + this.commonService.yearSelected);
      } else {
        UNQ_DESIGN_ID = (this.commonService.branchCode + this.PartyDetailsOrderForm.value.VOCTYPE + "-" +
          this.PartyDetailsOrderForm.value.VOCNO + "-" + this.commonService.nullToString(item.STOCK_CODE) + "-" +
          this.commonService.nullToString(item.SRNO) + "-" + this.commonService.yearSelected);
      }
      if (item.CURRENCY_CODE == this.PartyDetailsOrderForm.value.ItemCurrency) {
        COSTFC = item.STOCK_FCCOST
      } else {
        COSTFC = Number(item.STOCK_LCCOST)
        // COSTFC = this.commonService.CCToFC((Number(this.PartyDetailsOrderForm.value.ItemCurrencyRate)), Number(item.STOCK_LCCOST))
      }
      detailArrayValues = {
        "UNIQUEID": 0,
        "SRNO": this.commonService.emptyToZero(Number(item.SRNO)),
        "EXP_PROD_START_DATE": item.ProductionDate.toISOString(),
        "DELIVERY_DATE": item.DeliveryOnDate.toISOString(),
        "PARTYCODE": this.PartyDetailsOrderForm.value.PartyCode,
        "DESIGN_CODE": this.commonService.nullToString(item.designCode),
        "KARAT": this.commonService.nullToString(item.KARAT_CODE),
        "METAL_COLOR": this.commonService.nullToString(item.COLOR),
        "PCS": this.commonService.emptyToZero(Number(item.PCS)),
        "METAL_WT": this.commonService.emptyToZero(Number(item.METAL_WT)),
        "STONE_WT": this.commonService.emptyToZero(Number(item.STONE_WT)),
        "GROSS_WT": this.commonService.emptyToZero(Number(item.GROSS_WT)),
        "RATEFC": this.commonService.emptyToZero(Number(item.RATEFC)),
        "RATECC": this.commonService.FCToCC(this.commonService.compCurrency, Number(item.RATEFC)),
        "VALUEFC": this.commonService.emptyToZero(Number(item.AMOUNT)),
        "VALUECC": this.commonService.FCToCC(this.commonService.compCurrency, Number(item.AMOUNT)),
        "DISCPER": this.commonService.emptyToZero(Number(item.LoadingPercentage)),
        "DISCAMTFC": this.commonService.emptyToZero(Number(item.Loading)),
        "DISCAMTCC": this.commonService.FCToCC(this.commonService.compCurrency, this.commonService.emptyToZero(Number(item.Loading))),
        "NETVALUEFC": this.commonService.emptyToZero(Number(item.AMOUNT)),
        "NETVALUECC": this.commonService.FCToCC(this.commonService.compCurrency, item.AMOUNT),
        "LOCTYPE_CODE": "",
        "JOBCARD_REF": "",
        "JOBCARD_DATE": this.commonService.formatDateTime(this.currentDate),
        "JOBCARD_STATUS": "",
        "SEQ_CODE": this.commonService.emptyToZero(Number(item.SEQ_CODE)) || "",
        "STD_TIME": 0,
        "MAX_TIME": 0,
        "ACT_TIME": 0,
        "DESCRIPTION": this.commonService.nullToString(item.designDescription),
        "UNQ_DESIGN_ID": this.commonService.nullToString(UNQ_DESIGN_ID),
        "FINISHED_PCS": 0,
        "PENDING_PCS": this.commonService.nullToString(item.PCS),
        "STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "SUPPLIER": this.commonService.nullToString(item.SUPPLIER_CODE),
        "PODPROCREF": "",
        "REMARKS": this.commonService.nullToString(item.Remarks),
        "DSURFACEPROPERTY": this.commonService.nullToString(item.SURFACEPROPERTY),
        "DREFERENCE": this.commonService.nullToString(item.REFERENCE),
        "DWIDTH": this.commonService.emptyToZero(item.WIDTH),
        "DTHICKNESS": this.commonService.emptyToZero(item.THICKNESS),
        "CHARGE1FC": this.commonService.emptyToZero(item.SETTING),
        "CHARGE1LC": this.commonService.FCToCC(this.commonService.compCurrency, item.SETTING),
        "CHARGE2FC": this.commonService.emptyToZero(item.POLISHING),
        "CHARGE2LC": this.commonService.FCToCC(this.commonService.compCurrency, item.POLISHING),
        "CHARGE3FC": this.commonService.emptyToZero(item.RHODIUM),
        "CHARGE3LC": this.commonService.FCToCC(this.commonService.compCurrency, item.RHODIUM),
        "CHARGE4FC": this.commonService.emptyToZero(item.LABOUR),
        "CHARGE4LC": this.commonService.FCToCC(this.commonService.compCurrency, item.LABOUR),
        "CHARGE5FC": this.commonService.emptyToZero(item.Misc),
        "CHARGE5LC": this.commonService.FCToCC(this.commonService.compCurrency, item.Misc),
        "SONO": 0,
        "QUOT": 0,
        "SUFFIX": "",
        "D_REMARKS": this.commonService.nullToString(summaryData[0].Remarks),
        "ENGRAVE_TEXT": this.commonService.nullToString(item.ENGRAVING_TEXT),
        "ENGRAVE_FONT": this.commonService.nullToString(item.ENGRAVE_FONT),
        "DUTY_AMT": this.commonService.emptyToZero(item.Duty),
        "LOAD_PER": this.commonService.emptyToZero(item.LoadingPercentage),
        "MARGIN_PER": this.commonService.emptyToZero(item.MarginPercentage),
        "DUTY_PER": this.commonService.emptyToZero(item.DutyPercentage),
        "PICTURE_NAME": this.commonService.nullToString(item.PICTURE_NAME),
        "DSO_PICTURE_NAME": this.commonService.nullToString(item.PICTURE_NAME),
        "DSO_STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "SOBALANCE_PCS": 0,
        "SORDER_CLOSE": 0,
        "SOREF": "",
        "SO_STATUS": 0,
        "MARKUP_PER": this.commonService.emptyToZero(item.MarkupPercentage),
        "MARKUP_AMTFC": this.commonService.emptyToZero(item.Markup),
        "MARKUP_AMTLC": this.commonService.FCToCC(this.commonService.compCurrency, item.Markup),
        "MARGIN_AMTFC": this.commonService.emptyToZero(item.Margin),
        "MARGIN_AMTLC": this.commonService.FCToCC(this.commonService.compCurrency, item.Margin),
        "GOLD_LOSS_PER": this.commonService.emptyToZero(item.WastagePercentage),
        "GOLD_LOSS_AMTFC": this.commonService.emptyToZero(item.Wastage),
        "GOLD_LOSS_AMTLC": this.commonService.FCToCC(this.commonService.compCurrency, item.Wastage),
        "COSTFC": this.commonService.emptyToZero(COSTFC) || 0,
        "DT_VOCDATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.VOCDATE),
        "KARIGAR_CODE": "",
        "DT_BRANCH_CODE": this.commonService.branchCode,
        "DT_VOCTYPE": this.PartyDetailsOrderForm.value.VOCTYPE,
        "DT_VOCNO": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.VOCNO),
        "DT_YEARMONTH": this.commonService.yearSelected,
        "TOTAL_LABOUR": this.commonService.emptyToZero(item.Total_Labour),
        "CATEGORY_CODE": this.commonService.nullToString(item.CATEGORY_CODE),
        "COUNTRY_CODE": this.commonService.nullToString(item.COUNTRY_CODE),
        "CUT_CODE": "",
        "FINISH_CODE": "",
        "DYE_CODE": "",
        "TYPE_CODE": this.commonService.nullToString(item.TYPE_CODE),
        "BRAND_CODE": this.commonService.nullToString(item.BRAND_CODE),
        "RHODIUM_COLOR": "",
        "SIZE": this.commonService.nullToString(item.SIZE),
        "LENGTH": this.commonService.nullToString(item.LENGTH),
        "SCREW_FIELD": this.commonService.nullToString(item.SCREW_FIELD),
        "ORDER_TYPE": this.PartyDetailsOrderForm.value.orderType.toString(),
        "SUBCATEGORY_CODE": this.commonService.nullToString(item.SUBCATEGORY_CODE),
        "DSN_STOCK_CODE": this.commonService.nullToString(item.STOCK_CODE),
        "JOBNO": "",
        "ENAMEL_COLOR": "",
        "PROD_VARIANCE": 0,
        "SERVICE_ACCCODE": this.commonService.nullToString(item.SERVICE_ACCCODE),
        "DIVISION_CODE": this.commonService.nullToString(item.DIVCODE),
        "JOB_STATUS": "",
        "APPR_REFF": "",
        "MAIN_REFF": "",
        "SALESPERSON_CODE": this.PartyDetailsOrderForm.value.SalesmanCode,
        "METAL_SALES_REF": "",
        "DELIVERY_TYPE": this.commonService.nullToString(item.DeliveryType),
        "DELIVERY_DAYS": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.DeliveryOnDateType),
        "GOLD_LOSS_WT": 0,
        "PURITY": this.commonService.nullToString(item.PURITY)
      }
      this.headerDetailGridToSave.push(detailArrayValues)
    });
  }
  private setPostDataToSave(): void {
    let summaryData = this.detailData[0].DATA['SUMMARYDETAILS']
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.commonService.branchCode || '',
      "VOCTYPE": this.PartyDetailsOrderForm.value.VOCTYPE,
      "VOCNO": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.VOCNO),
      "VOCDATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.VOCDATE).toString(),
      "EXP_PROD_START_DATE": this.commonService.formatDateTime(this.currentDate) || "2023-09-14T14:56:43.961Z",
      "DELIVERY_DATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.DeliveryOnDate).toString(),
      "YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "PARTYCODE": this.PartyDetailsOrderForm.value.PartyCode.toString(),
      "PARTY_CURRENCY": this.PartyDetailsOrderForm.value.partyCurrencyType.toString(),
      "PARTY_CURR_RATE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.partyCurrencyRate),
      "ITEM_CURRENCY": this.PartyDetailsOrderForm.value.ItemCurrency.toString(),
      "ITEM_CURR_RATE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.ItemCurrencyRate),
      "VALUE_DATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.VOCDATE).toString(),
      "SALESPERSON_CODE": this.PartyDetailsOrderForm.value.SalesmanCode.toString(),
      "METAL_RATE_TYPE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.rateType),
      "METAL_RATE": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.wholeSaleRate),
      "METAL_GRAM_RATE": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.METAL_GRAM_RATE),
      "TOTAL_PCS": this.commonService.emptyToZero(summaryData[0].PCS),
      "TOTAL_METAL_WT": this.commonService.emptyToZero(summaryData[0].METAL_WT),
      "TOTAL_STONE_WT": this.commonService.emptyToZero(summaryData[0].STONE_WT),
      "TOTAL_GROSS_WT": this.commonService.emptyToZero(summaryData[0].GROSS_WT),
      "TOTAL_AMOUNT_FC": this.commonService.emptyToZero(summaryData[0].AMOUNT_FC),
      "TOTAL_AMOUNT_LC": this.commonService.emptyToZero(summaryData[0].AMOUNT_LC),
      "MARGIN_PER": this.commonService.emptyToZero(summaryData[0].MarginPercentage),
      "REMARKS": this.commonService.nullToString(summaryData[0].Remarks),
      "SYSTEM_DATE": this.currentDate.toISOString() || "2023-10-26T09:05:45.384Z",
      "ROUND_VALUE_CC": this.commonService.emptyToZero(summaryData[0].AMOUNT).toFixed(),
      "NAVSEQNO": 0,
      "SO_STATUS": false,
      "TOTAL_AMOUNT_PRTY": 0,
      "FIX_UNFIX": this.PartyDetailsOrderForm.value.FixedMetal,
      "LINKID": "",
      "OUSTATUS": true,
      "OUSTATUSNEW": 1,
      "ORDER_STATUS": "",
      "MARKUP_PER": this.commonService.emptyToZero(summaryData[0].MarkupPercentage),
      "GOLD_LOSS_PER": this.commonService.emptyToZero(summaryData[0].WastagePercentage),
      "CR_DAYS": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.DeliveryOnDateType),
      "PARTY_ADDRESS": this.PartyDetailsOrderForm.value.BillToAddress,
      "SALESPERSON_NAME": this.PartyDetailsOrderForm.value.SalesmanName,
      "PRINT_COUNT": 0,
      "SALESORDER_REF": "",
      "ORDER_TYPE": this.commonService.nullToString(this.PartyDetailsOrderForm.value.orderType),
      "JOB_STATUS": "",
      "APPR_REFF": "",
      "MAIN_REFF": "",
      "PARTY_NAME": this.PartyDetailsOrderForm.value.BillToAccountHead,
      "SUBLEDGER_CODE": this.PartyDetailsOrderForm.value.SUBLEDGER_CODE,
      "USERDEF1": this.PartyDetailsOrderForm.value.Proposal,
      "USERDEF2": this.PartyDetailsOrderForm.value.BussinessType,
      "USERDEF3": this.PartyDetailsOrderForm.value.Language,
      "USERDEF4": this.PartyDetailsOrderForm.value.ReferredBy,
      "DELIVERYADDRESS": "",
      "TERMSANDCONDITIONS": this.PartyDetailsOrderForm.value.NotesTerms,
      "PAYMENTTERMS": this.PartyDetailsOrderForm.value.PaymentTerms,
      "DETAILBRANCHCODE": this.commonService.branchCode,
      "AMCSTARTDATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.AMCSTARTDATE),
      "SALESINVPENAMOUNTCC": 0,
      "PROSP_ORIGIN": this.PartyDetailsOrderForm.value.PROSP_ORIGIN,
      "CANCEL_SALES_ORDER": false,
      "DELIVERY_TYPE": this.PartyDetailsOrderForm.value.DeliveryType,
      "DELIVERY_DAYS": this.commonService.emptyToZero(this.PartyDetailsOrderForm.value.DeliveryOnDateType),
      "MKG_GROSS": false,
      "HTUSERNAME": this.commonService.nullToString(this.commonService.userName),
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "AutoPosting": false,
      "Details": this.headerDetailGridToSave, //main header grid data
      "stnmtlDetail": this.bomDetailGridToSave, // bom details
      "HeaderLabours": this.headerLaboursListToSave, //header labour
      "LabourDetails": this.labourDetailsListToSave, // Labour Details
      "HeaderDivisons": this.headerDivisionListToSave, // Header Divisons
      "CompartDet": this.componentPartDetailsToSave // components and Parts Details To Save 
    }
    this.postDataToSave.push(postData)
  }


  submitValidations(form: any) {
    if (this.commonService.nullToString(form.VOCTYPE) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// VOCTYPE  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.orderType) == '') {
      this.commonService.toastErrorByMsgId('MSG81501')//"orderType cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.PartyCode) == '') {
      this.commonService.toastErrorByMsgId('MSG1549')//"PartyCode cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.SalesmanCode) == '') {
      this.commonService.toastErrorByMsgId('MSG2320')//"SalesmanCode cannot be empty"
      return true
    }
    // else if (this.commonService.nullToString(form.wholeSaleRate) == '') {
    //   this.commonService.toastErrorByMsgId('')//"wholeSaleRate cannot be empty"
    //   return true
    // }
    else if (this.commonService.nullToString(form.partyCurrencyType) == '') {
      this.commonService.toastErrorByMsgId('MSG1550')//"partyCurrencyType cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.partyCurrencyRate) == '') {
      this.commonService.toastErrorByMsgId('MSG1550')//"partyCurrencyRate cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.ItemCurrency) == '') {
      this.commonService.toastErrorByMsgId('MSG1352')//"ItemCurrency cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.ItemCurrencyRate) == '') {
      this.commonService.toastErrorByMsgId('MSG1352')//"ItemCurrencyRate cannot be empty"
      return true
    }
    return false;
  }


  /**USE:  final save API call*/
  formSubmit(): void {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.selectProcess()
      // this.updateWorkerMaster()
      return
    }
    if (this.submitValidations(this.PartyDetailsOrderForm.value)) return;

    let summaryData: any
    if (this.detailData[0] && this.detailData[0].DATA['SUMMARYDETAILS']) {
      summaryData = this.detailData[0].DATA['SUMMARYDETAILS']
    } else {
      this.commonService.toastErrorByMsgId('MSG1041')
      return
    }
    if (this.PartyDetailsOrderForm.invalid) {
      this.commonService.toastErrorByMsgId('MSG1531')
      return
    }
    this.commonService.showSnackBarMsg('Loading....')
    console.log(this.postDataToSave, 'this.postDataToSave');

    let API = 'DaimondSalesOrder/InsertDaimondSalesOrder'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, this.postDataToSave[0])
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result && result.status.toUpperCase().trim() == ("SUCCESS" || "OK")) {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            this.close('reloadMainGrid');
          });
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


  deleteClicked(): void {
    this.totalDetailNo = 0;
    this.tableData = [];
  }
  importClicked(): void {

  }
  //partyCode validate
  partyCodeChange(event: any) {
    if (event.target.value == '') return
    if (!this.commonService.validateNotEmpty(this.commonService.branchCode, 'MSG1531')) return;

    let postData = {
      "SPID": "001",
      "parameter": {
        "ACCODE": event.target.value || "",
        "BRANCH_CODE": this.commonService.branchCode
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success") {
          let data = result.dynamicData[0]

          if (data.length > 1) {
            this.partyCurrencyData.WHERECONDITION = this.commonService.branchCode + ',' + event.target.value
          } else {
            this.partyCurrencyData.WHERECONDITION = ''
          }
          let defaultCurrencyArr = data.filter((item: any) => item.DEFAULT_CURRENCY === 1)


          if (defaultCurrencyArr && defaultCurrencyArr[0].CURRENCY_CODE) {

            this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(defaultCurrencyArr[0].CURRENCY_CODE)
            this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(defaultCurrencyArr[0].CURRENCY_CODE)
            this.PartyDetailsOrderForm.controls.BillToAccountHead.setValue(defaultCurrencyArr[0].ACCOUNT_HEAD)
            this.PartyDetailsOrderForm.controls.BillToAddress.setValue(defaultCurrencyArr[0].ADDRESS)

            let currencyRate = this.commonService.getCurrRate(defaultCurrencyArr[0].CURRENCY_CODE)
            currencyRate = this.commonService.decimalQuantityFormat(currencyRate, 'RATE')

            this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(currencyRate)
            this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(currencyRate)

            this.getMetalGramRate() //to get metal gram rate fom db
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
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
  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }
  //data settings
  OrderTypeSelected(event: any) {
    this.PartyDetailsOrderForm.controls.orderType.setValue(event.CODE)
  }
  OrderTypeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  PartyCodeSelected(event: any) {
    this.PartyDetailsOrderForm.controls.PartyCode.setValue(event.ACCODE)
    this.partyCodeChange({ target: { value: event.ACCODE } })
  }
  PartyCodeChange(event: any) {
    this.PartyCodeData.SEARCH_VALUE = event.target.value
  }
  SalesmanSelected(event: any) {
    this.PartyDetailsOrderForm.controls.SalesmanCode.setValue(event.SALESPERSON_CODE)
    this.PartyDetailsOrderForm.controls.SalesmanName.setValue(event.DESCRIPTION)
  }
  rateTypeSelected(event: any) {
    this.PartyDetailsOrderForm.controls.rateType.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.PartyDetailsOrderForm.controls.wholeSaleRate.setValue(WHOLESALE_RATE)
      }
    });
  }

  partyCurrencyChange(event: any) {
    this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(
      this.commonService.decimalQuantityFormat(event.target.value, 'RATE')
    )
  }
  dateDifference(event: any) {
    console.log(event.value);

  }
  deliveryTypeSelected(event: any) {
    this.PartyDetailsOrderForm.controls.DeliveryType.setValue(event.CODE)
    this.PartyDetailsOrderForm.controls.DeliveryTypeDesc.setValue(event.DESCRIPTION)
  }
  itemCurrencySelected(event: any) {
    let currencyRate = this.commonService.decimalQuantityFormat(event.CONV_RATE, 'RATE')

    this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(event.CURRENCY_CODE)
    this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(currencyRate)
  }
  partyCurrencySelected(event: any) {
    if (event.CURRENCY_CODE) {
      this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(event.CURRENCY_CODE)
      this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(event.CONV_RATE)
    }
    if (event.Currency) {
      this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(event.Currency)
      this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(
        this.commonService.decimalQuantityFormat(event['Conv Rate'], 'RATE')
      )
    }
  }
  SalesmanChange(event: any) {
    this.SalesmanData.SEARCH_VALUE = event.target.value
  }

  private HeaderValidate(): boolean {
    const formValue = this.PartyDetailsOrderForm.value;
    if (!this.commonService.validateNotEmpty(formValue.VOCTYPE, 'MSG1942')) return false;
    if (!this.commonService.validateNotEmpty(formValue.partyCurrencyRate, 'MSG1552')) return false;
    if (!this.commonService.validateNotEmpty(formValue.ItemCurrencyRate, 'MSG1353')) return false;
    if (!this.commonService.validateNotEmpty(formValue.ItemCurrency, 'MSG1352')) return false;
    if (!this.commonService.validateNotEmpty(formValue.partyCurrencyRate, 'MSG1550')) return false;
    if (!this.commonService.validateNotEmpty(formValue.SalesmanCode, 'MSG1767')) return false;
    if (!this.commonService.validateNotEmpty(formValue.orderType, 'MSG1550')) return false;

    // Additional conditions can be added here
    return true;
  }

  // private validateNotEmpty(value: string, errorMessageId: string): boolean {
  //   if (!value || value == '') {
  //     this.commonService.toastErrorByMsgId(errorMessageId);
  //     return false;
  //   }
  //   return true;
  // }

  addDays() {
    const daysToAdd = parseInt(this.PartyDetailsOrderForm.value.DeliveryOnDateType);
    const currentDate = this.commonService.currentDate;

    if (!isNaN(daysToAdd)) {
      const futureDate = new Date(currentDate);
      futureDate.setDate(currentDate.getDate() + daysToAdd);

      const dateInput = this.PartyDetailsOrderForm.value.DeliveryOnDateType

      let dates = this.formatDateF(futureDate);
      this.PartyDetailsOrderForm.controls.DeliveryOnDate.setValue(dates)
    }
  }

  formatDateF(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  openDetailForm(component: any, dataToComponent: any) {
    const modalRef: NgbModalRef = this.modalService.open(component, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = dataToComponent;

    modalRef.result.then((result) => {
      if (result) {
        this.setValuesToHeaderGrid(result) //USE: set Values To Detail table
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
  }


  showOverleyPanel(event: any, formControlName: string) {
    if (this.PartyDetailsOrderForm.value[formControlName] != '') return;

    switch (formControlName) {
      case 'orderType':
        this.overlayorderType.showOverlayPanel(event);
        break;
      case 'PartyCode':
        this.overlayPartyCode.showOverlayPanel(event);
        break;
      case 'SalesmanCode':
        this.overlaySalesmanCode.showOverlayPanel(event);
        break;
      case 'wholeSaleRate':
        this.overlaywholeSaleRate.showOverlayPanel(event);
        break;
      case 'DeliveryTypeDesc':
        this.overlayDeliveryTypeDesc.showOverlayPanel(event);
        break;
      default:
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
          this.PartyDetailsOrderForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'orderType' || FORMNAME === 'PartyCode' || FORMNAME === 'SalesmanCode' || FORMNAME === 'wholeSaleRate' || FORMNAME === 'DeliveryTypeDesc') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
  
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
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
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
