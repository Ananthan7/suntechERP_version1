import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AddNewdetailComponent } from '../diamond-salesorder/add-newdetail/add-newdetail.component';
import { AddNewdiamondquotationComponent } from './add-newdiamondquotation/add-newdiamondquotation.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-diamond-quotation',
  templateUrl: './diamond-quotation.component.html',
  styleUrls: ['./diamond-quotation.component.scss']
})
export class DiamondQuotationComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  currentFilter: any;
  divisionMS: string = 'ID';
  detailData: any[] = [];
  tableDataHead: any[] = [];
  tableData: any[] = []
  checked = false;
  check = false;
  indeterminate = false;
  currentDate = new Date()
  private subscriptions: Subscription[] = [];
  tableItems: any = []
  totalDetailNo: number = 0;

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
  /**USE: main form party details */
  PartyDetailsOrderForm: FormGroup = this.formBuilder.group({
    voucherType: ['', [Validators.required]],
    voucherNo: [''],
    voucherDESC: [''],
    voucherDate: ['', [Validators.required]],
    orderType: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],
    SalesmanCode: ['', [Validators.required]],
    FixedMetal: [false,],
    rateType: ['', [Validators.required]],
    wholeSaleRate: ['', [Validators.required]],
    partyCurrencyType: ['', [Validators.required]],
    partyCurrencyRate: ['', [Validators.required]],
    ItemCurrency: ['', [Validators.required]],
    ItemCurrencyRate: ['', [Validators.required]],
    BillToAccountHead: [''],
    BillToAddress: [''],
    DeliveryOnDate: [''],
    Proposal: [''],
    BussinessType: [''],
    Language: [''],
    ReferredBy: [''],
    NotesTerms: [''],
    PaymentTerms: [''],
    ShipTo: [''],
    ShipToDesc: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.PartyDetailsOrderForm.controls.voucherDate.setValue(this.currentDate)
    this.PartyDetailsOrderForm.controls.DeliveryOnDate.setValue(this.currentDate)
    this.PartyDetailsOrderForm.controls.voucherType.setValue(this.commonService.getqueryParamVocType())
    this.getRateType()
  }
  getRateType() {
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.DIVISION_CODE == 'G' && item.DEFAULT_RTYPE == 1)

    if (data[0].WHOLESALE_RATE)
      this.PartyDetailsOrderForm.controls.wholeSaleRate.setValue(data[0].WHOLESALE_RATE)
    if (data[0].RATE_TYPE)
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
  selectionChangedHandler(event: any) {
    let selectedData = event.selectedRowsData

    let detailRow = this.detailData.filter((item: any) => item.ID == selectedData[0].SRNO)

    let allDataSelected = [detailRow[0].DATA]
    this.addNewDetail(allDataSelected)
  }
  addNewDetail(data?: any) {
    if(data){
      data[0].headerDetails = this.PartyDetailsOrderForm.value;
    }else{
      data = [{headerDetails: this.PartyDetailsOrderForm.value}]
    }

    if(this.PartyDetailsOrderForm.value.PartyCode == ''){
      this.toastr.error('PartyCode not found', '', {
        timeOut: 3000,
      })
      return
    }
    const modalRef: NgbModalRef = this.modalService.open(AddNewdetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.content = data;

    modalRef.result.then((result) => {
      if (result) {
        this.setValuesToHeaderGrid(result) //USE: set Values To Detail table
      }
    }, (reason) => {
      // Handle modal dismissal (if needed)
    });
    // modalRef.componentInstance.content = data;
  }
  private setValuesToHeaderGrid(result: any):void {
    console.log(result, 'summaryData');
    this.totalDetailNo += 1
    //summary details
    let summaryData: any[] = result[0].summaryDetail

    summaryData.forEach((item: any, index: any) => {
      if (item.CATEGORY_CODE == '') {
        return
      }
      item.SRNO = this.totalDetailNo
      this.tableData.push(item)
    })
    this.tableDataHead = Object.keys(this.tableData[0]);
    
    if (result.length > 0) {
      result.forEach((item: any, index: any) => {
        this.detailData.push({
          ID: this.totalDetailNo,
          DATA: item
        })
      })
    }
  }
  /**USE:  final save API call*/
  formSubmit():void {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.selectProcess()
      // this.updateWorkerMaster()
      return
    }
    
    let detailsToSave:any[] = []
    console.log(this.detailData,'this.detailData');
    
    
    let detailArrayValues = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "EXP_PROD_START_DATE": "2023-09-14T14:56:43.961Z",
      "DELIVERY_DATE": "2023-09-14T14:56:43.961Z",
      "PARTYCODE": "",
      "DESIGN_CODE": "",
      "KARAT": "",
      "METAL_COLOR": "",
      "PCS": 0,
      "METAL_WT": 0,
      "STONE_WT": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "VALUEFC": 0,
      "VALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": 0,
      "NETVALUECC": 0,
      "LOCTYPE_CODE": "",
      "JOBCARD_REF": "",
      "JOBCARD_DATE": "2023-09-14T14:56:43.961Z",
      "JOBCARD_STATUS": "",
      "SEQ_CODE": "",
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "ACT_TIME": 0,
      "DESCRIPTION": "",
      "UNQ_DESIGN_ID": "",
      "FINISHED_PCS": 0,
      "PENDING_PCS": 0,
      "STOCK_CODE": "",
      "SUPPLIER": "",
      "PODPROCREF": "",
      "REMARKS": "",
      "DSURFACEPROPERTY": "",
      "DREFERENCE": "",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "CHARGE1FC": 0,
      "CHARGE1LC": 0,
      "CHARGE2FC": 0,
      "CHARGE2LC": 0,
      "CHARGE3FC": 0,
      "CHARGE3LC": 0,
      "CHARGE4FC": 0,
      "CHARGE4LC": 0,
      "CHARGE5FC": 0,
      "CHARGE5LC": 0,
      "SONO": 0,
      "QUOT": 0,
      "SUFFIX": "",
      "D_REMARKS": "",
      "ENGRAVE_TEXT": "",
      "ENGRAVE_FONT": "",
      "DUTY_AMT": 0,
      "LOAD_PER": 0,
      "MARGIN_PER": 0,
      "DUTY_PER": 0,
      "PICTURE_NAME": "",
      "DSO_PICTURE_NAME": "",
      "DSO_STOCK_CODE": "",
      "SOBALANCE_PCS": 0,
      "SORDER_CLOSE": 0,
      "SOREF": "",
      "SO_STATUS": 0,
      "MARKUP_PER": 0,
      "MARKUP_AMTFC": 0,
      "MARKUP_AMTLC": 0,
      "MARGIN_AMTFC": 0,
      "MARGIN_AMTLC": 0,
      "GOLD_LOSS_PER": 0,
      "GOLD_LOSS_AMTFC": 0,
      "GOLD_LOSS_AMTLC": 0,
      "COSTFC": 0,
      "DT_VOCDATE": "2023-09-14T14:56:43.961Z",
      "KARIGAR_CODE": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "TOTAL_LABOUR": 0,
      "CATEGORY_CODE": "",
      "COUNTRY_CODE": "",
      "CUT_CODE": "",
      "FINISH_CODE": "",
      "DYE_CODE": "",
      "TYPE_CODE": "",
      "BRAND_CODE": "",
      "RHODIUM_COLOR": "",
      "SIZE": "",
      "LENGTH": "",
      "SCREW_FIELD": "",
      "ORDER_TYPE": "",
      "SUBCATEGORY_CODE": "",
      "DSN_STOCK_CODE": "",
      "JOBNO": "",
      "ENAMEL_COLOR": "",
      "PROD_VARIANCE": 0,
      "SERVICE_ACCCODE": "",
      "DIVISION_CODE": "s",
      "JOB_STATUS": "",
      "APPR_REFF": "",
      "MAIN_REFF": "",
      "SALESPERSON_CODE": "",
      "METAL_SALES_REF": "",
      "DELIVERY_TYPE": "",
      "DELIVERY_DAYS": 0,
      "GOLD_LOSS_WT": 0,
      "PURITY": 0
    }

    detailsToSave.push(detailArrayValues)

    
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.commonService.branchCode || "",
      "VOCTYPE": this.PartyDetailsOrderForm.value.voucherType || "",
      "VOCNO": this.PartyDetailsOrderForm.value.voucherNo || 0,
      "VOCDATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.voucherDate) || "",
      "EXP_PROD_START_DATE": "2023-09-14T14:56:43.961Z",
      "DELIVERY_DATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.DeliveryOnDate) || "",
      "YEARMONTH": this.commonService.yearSelected || "",
      "PARTYCODE": this.PartyDetailsOrderForm.value.PartyCode || "",
      "PARTY_CURRENCY": this.PartyDetailsOrderForm.value.partyCurrencyType || "",
      "PARTY_CURR_RATE":  this.PartyDetailsOrderForm.value.partyCurrencyRate || 0,
      "ITEM_CURRENCY":  this.PartyDetailsOrderForm.value.ItemCurrency || "",
      "ITEM_CURR_RATE":  this.PartyDetailsOrderForm.value.ItemCurrencyRate || 0,
      "VALUE_DATE": this.commonService.formatDateTime(this.PartyDetailsOrderForm.value.DeliveryOnDate) || "",
      "SALESPERSON_CODE": this.PartyDetailsOrderForm.value.SalesmanCode || "",
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "METAL_GRAM_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNT_FC": 0,
      "TOTAL_AMOUNT_LC": 0,
      "MARGIN_PER": 0,
      "REMARKS": "",
      "SYSTEM_DATE": "2023-09-14T14:56:43.961Z",
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SO_STATUS": true,
      "TOTAL_AMOUNT_PRTY": 0,
      "FIX_UNFIX": true,
      "LINKID": "",
      "OUSTATUSNEW": 0,
      "CR_DAYS": 0,
      "PARTY_ADDRESS": "",
      "SALESPERSON_NAME": "",
      "MARKUP_PER": 0,
      "GOLD_LOSS_PER": 0,
      "PRINT_COUNT": 0,
      "ORDER_TYPE": "",
      "SALESORDER_REF": "",
      "JOB_STATUS": "",
      "APPR_REFF": "",
      "MAIN_REFF": "",
      "PARTY_NAME": "",
      "SUBLEDGER_CODE": "",
      "USERDEF1": "",
      "USERDEF2": "",
      "USERDEF3": "",
      "USERDEF4": "",
      "DELIVERYADDRESS": "",
      "TERMSANDCONDITIONS": "",
      "PAYMENTTERMS": "",
      "DETAILBRANCHCODE": "strin",
      "AMCSTARTDATE": "2023-09-14T14:56:43.961Z",
      "SALESINVPENAMOUNTCC": 0,
      "PROSP_ORIGIN": "",
      "CANCEL_SALES_ORDER": true,
      "DELIVERY_TYPE": "",
      "DELIVERY_DAYS": 0,
      "MKG_GROSS": true,
      "ORDER_STATUS": "",
      "HTUSERNAME": "",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "AUTOPOSTING": true,
      "details": detailsToSave
    }

    // if (this.PartyDetailsOrderForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    let API = 'WebEnquiry/DiamondSalesOrder'
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
                this.PartyDetailsOrderForm.reset()
                this.tableData = []
                this.close()
              }
            });
          }else {
            this.commonService.toastErrorByMsgId('MSG3577')
          }
        
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }


  deleteClicked(): void {
    this.tableData = []
  }
  importClicked(): void {

  }
  //party Code Change
  partyCodeChange(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    let postData = {
      "SPID": "001",
      "parameter": {
        "ACCODE": event.target.value || "",
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.status == "Success") { //
          let data = result.dynamicData[0]
          if (data && data[0].CURRENCY_CODE) {

            this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(data[0].CURRENCY_CODE)
            this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(data[0].CURRENCY_CODE)
            this.PartyDetailsOrderForm.controls.BillToAccountHead.setValue(data[0].ACCOUNT_HEAD)
            this.PartyDetailsOrderForm.controls.BillToAddress.setValue(data[0].ADDRESS)

            // let currencyArr = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE = data[0].CURRENCY_CODE)
            let currencyRate = this.commonService.getCurrRate(data[0].CURRENCY_CODE)
            currencyRate = this.commonService.transformDecimalVB(this.commonService.amtDecimals,currencyRate)
            this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(currencyRate)
            this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(currencyRate)
          }
        } else {
          this.toastr.error('PartyCode not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
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
  }
  rateTypeSelected(event: any) {
    this.PartyDetailsOrderForm.controls.rateType.setValue(event.RATE_TYPE)
    this.PartyDetailsOrderForm.controls.rateTypeDESC.setValue(event.DESCRIPTION)
  }
  itemCurrencySelected(event: any) {
    this.PartyDetailsOrderForm.controls.ItemCurrency.setValue(event.CURRENCY_CODE)
    this.PartyDetailsOrderForm.controls.ItemCurrencyRate.setValue(event.CONV_RATE)
  }
  partyCurrencySelected(event: any) {
    this.PartyDetailsOrderForm.controls.partyCurrencyType.setValue(event.CURRENCY_CODE)
    this.PartyDetailsOrderForm.controls.partyCurrencyRate.setValue(event.CONV_RATE)
  }
  SalesmanChange(event: any) {
    this.SalesmanData.SEARCH_VALUE = event.target.value
  }

  close() {
    this.activeModal.close();
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

}
