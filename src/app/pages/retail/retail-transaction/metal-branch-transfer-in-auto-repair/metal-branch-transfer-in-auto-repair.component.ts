import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import { MetalBranchTransferInAutoRepairDetailsComponent } from './metal-branch-transfer-in-auto-repair-details/metal-branch-transfer-in-auto-repair-details.component';


@Component({
  selector: 'app-metal-branch-transfer-in-auto-repair',
  templateUrl: './metal-branch-transfer-in-auto-repair.component.html',
  styleUrls: ['./metal-branch-transfer-in-auto-repair.component.scss']
})
export class MetalBranchTransferInAutoRepairComponent implements OnInit {
  @Input() content!: any;
  @Input()
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  // currentDate = new FormControl(new Date());
  currentDate = new Date();
  viewMode: boolean = false;
  selectedTabIndex = 0;
  selectedTabIndex1 = 1;
  private subscriptions: Subscription[] = [];
  postdata :any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.metalBranchTransferinAutoRepairForm.controls.voctype.setValue(this.comService.getqueryParamVocType());
    this.metalBranchTransferinAutoRepairForm.controls.voctype.setValue(this.comService.getqueryParamVocType())

    this.generateVocNo();

  
  }
  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.branchCode
      }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.metalBranchTransferinAutoRepairForm.controls.vocNo.setValue(res.newvocno);
          this.metalBranchTransferinAutoRepairForm.controls.voc_NO.setValue(res.newvocno);

        }
      });
  }


  metalBranchTransferinAutoRepairForm: FormGroup = this.formBuilder.group({

    voctype:[''],
    vocNo:[''],
    Voc_date:[new Date()],
    enteredBy:[''],
    itemCurrency:[''],
    itemCurrencyDesc:[''],
    branchCurrency:[''],
    branchCurrencyDesc:[''],
    transferStatus:[''],
    metalRate:[''],
    metalRateDesc:[''],
    branchTo:[''],
    branchToDesc:[''],
    locationTo:[''],
    returnlocationTo:[''],
    shipTo:[''],
    shipToDesc:[''],
    deliveryDate:[''],
    creditDays:[''],
    vocDates:[''],
    reference:[''],
    scrapTransfer:[''],
    vehicle:[''],
    lrno:[''],
    docReference:[''],
    stateCode:[''],
    taxCode:[''],
    type:[''],
    voc_NO:[''],
    voc_NODesc:[''],
    batchSINo:[''],
    batchSINoDes:[''],
    batchSINoDetail:[''],
    document:[''],
    documentDetail:[''],
    mbcVocNo:[''],
    PurityDiff:[''],
    StoneDiff:[''],
    stoneDiffDetail:[''],
    totalAmount:[''],
    otherAmount:[''],
    tcsAmount:[''],
    totalGST:[''],
    roundTo:[''],
    netAmount:[''],
    netAmountLC:[''],
    Driver:[''],
    DriverDesc:[''],
    credit_days_LC:[new Date()]

  });

  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User Name ',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesManCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.enteredBy.setValue(e.UsersName);
  }
  

  branchToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchToCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.branchTo.setValue(e.BRANCH_CODE);
    this.metalBranchTransferinAutoRepairForm.controls.branchToDesc.setValue(e.BRANCH_NAME);

  }

  locationToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'location To',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationToCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.locationTo.setValue(e.Location);
  }

  returnlocationToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'location To',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  returnlocationToCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.returnlocationTo.setValue(e.Location);
  }
  
  shipToCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Ship To',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shipToCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.shipTo.setValue(e.CODE);
    this.metalBranchTransferinAutoRepairForm.controls.shipToDesc.setValue(e.DESCRIPTION);

  }

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'STATE CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stateCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.stateCode.setValue(e.STATE_CODE);
  }

  scrapTransferCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'LOCATION CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  scrapTransferCodeSelected(e: any) {
    console.log(e);
    this.metalBranchTransferinAutoRepairForm.controls.scrapTransfer.setValue(e.LOCATION_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    console.log(data);
    this.activeModal.close(data);
  }


  adddata() {
    const modalRef: NgbModalRef = this.modalService.open(MetalBranchTransferInAutoRepairDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      if (postData) {
        this.postdata = postData;
        console.log("Data from modal:", postData);
      }
    });
}

removedata(){
  this.tableData.pop();
}

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.metalBranchTransferinAutoRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'MetalBarcodeTransferAuto/InsertMetalBarcodeTransferAuto'

    let postData =  {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.metalBranchTransferinAutoRepairForm.value.voctype,
      "VOCNO": this.metalBranchTransferinAutoRepairForm.value.vocNo,
      "VOCDATE":  this.metalBranchTransferinAutoRepairForm.value.Voc_date,//"2024-03-08T11:16:45.948Z",
      "VALUE_DATE": "2024-03-08T11:16:45.948Z",
      "YEARMONTH": "string",
      "TRANSFERSTATUS": this.metalBranchTransferinAutoRepairForm.value.transferStatus,
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.metalBranchTransferinAutoRepairForm.value.locationTo,
      "REMARKS": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": this.metalBranchTransferinAutoRepairForm.value.PurityDiff,
      "TOTAL_STONEDIFF": this.metalBranchTransferinAutoRepairForm.value.StoneDiff,
      "SYSTEM_DATE": new Date(),//new DOMException(),//"2024-03-08T11:16:45.948Z",
      "ITEM_CURRENCY": this.metalBranchTransferinAutoRepairForm.value.itemCurrencyDesc,
      "ITEM_CURR_RATE": this.metalBranchTransferinAutoRepairForm.value.itemCurrency,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE":  this.metalBranchTransferinAutoRepairForm.value.voc_NODesc,
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": this.metalBranchTransferinAutoRepairForm.value.metal_rate,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": "string",
      "INVREFNO": "string",
      "OUTSTATUS": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": this.metalBranchTransferinAutoRepairForm.value.deliveryDate,//"2024-03-08T11:16:45.948Z",
      "PHYSTKTRANSTO_BR": "string",
      "OUSTATUSNEW": 0,
      "TRANS_VOCNO": this.metalBranchTransferinAutoRepairForm.value.mbcVocNo,//0,
      "REF_DATE": this.metalBranchTransferinAutoRepairForm.value.credit_days_LC,//"2024-03-08T11:16:45.948Z",
      "CR_DAYS": this.metalBranchTransferinAutoRepairForm.value.creditDays,
      "REFNO": this.metalBranchTransferinAutoRepairForm.value.reference,
      "TO_BRANCH_NAME": this.metalBranchTransferinAutoRepairForm.value.branchToDesc,
      "BRANCH_NAME": this.metalBranchTransferinAutoRepairForm.value.branchTo,
      "TOTAL_NETWT": 0,
      "FROM_LOC": "string",
      "CMBYEAR": "string",
      "SALESRETURNTRANSFER": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF":  this.metalBranchTransferinAutoRepairForm.value.docReference,
      "TOTAL_AMT_FC": this.metalBranchTransferinAutoRepairForm.value.totalAmount,
      "TOTAL_AMT_CC": 0,
      "ADDL_VALUE_FC": this.metalBranchTransferinAutoRepairForm.value.otherAmount,
      "ADDL_VALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE":   this.metalBranchTransferinAutoRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": this.metalBranchTransferinAutoRepairForm.value.type,
      "GST_TOTALFC": this.metalBranchTransferinAutoRepairForm.value.totalGST,
      "GST_TOTALCC": 0,
      "INCLUSIVE": 0,
      "TOTAL_WASTQTY": 0,
      "SHIPCODE":  this.metalBranchTransferinAutoRepairForm.value.shipTo,
      "SHIPDESC": this.metalBranchTransferinAutoRepairForm.value.shipToDesc,
      "ROUND_VALUE_CC": this.metalBranchTransferinAutoRepairForm.value.roundTo,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO":  this.metalBranchTransferinAutoRepairForm.value.vehicle,
      "LR_NO": this.metalBranchTransferinAutoRepairForm.value.lrno,
      "TEST_BRANCH_CODE": this.branchCode,//"string",
      "TEST_VOCTYPE": this.metalBranchTransferinAutoRepairForm.value.voc_NODesc,//"str",
      "TEST_VOCNO": this.metalBranchTransferinAutoRepairForm.value.voc_NO,//0,
      "TEST_YEARMONTH": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT":  this.metalBranchTransferinAutoRepairForm.value.tcsAmount,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "TOTSTAMP_AMTFC": 0,
      "TOTSTAMP_AMTCC": 0,
      "TOTSTAMP_PARTYAMTFC": 0,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "PARTY_STATE_CODE": "st",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "st",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "st",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "s",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-03-08T11:16:45.948Z",
      "VEHICLE_TYPE": "s",
      "DISPATCH_CITY": "string",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "s",
      "AIR_BILL_NO": "string",
      "GENSEQNO": 0,
      "Details": [
        this.postdata
        // {
        //   "UNIQUEID": 0,
        //   "SRNO": 0,
        //   "DIVISION_CODE": "s",
        //   "STOCK_ACTION": "s",
        //   "STOCK_CODE": "string",
        //   "SUPPLIER": "string",
        //   "PCS": 0,
        //   "GROSSWT": 0,
        //   "STONEWT": 0,
        //   "NETWT": 0,
        //   "PURITY": 0,
        //   "PUREWT": 0,
        //   "CHARGABLEWT": 0,
        //   "OZWT": 0,
        //   "MKG_RATEFC": 0,
        //   "MKG_RATECC": 0,
        //   "MKGVALUEFC": 0,
        //   "MKGVALUECC": 0,
        //   "RATE_TYPE": "string",
        //   "METAL_RATE": 0,
        //   "METAL_RATE_GMSFC": 0,
        //   "METAL_RATE_GMSCC": 0,
        //   "METALVALUEFC": 0,
        //   "METALVALUECC": 0,
        //   "STONE_RATEFC": 0,
        //   "STONE_RATECC": 0,
        //   "STONEVALUEFC": 0,
        //   "STONEVALUECC": 0,
        //   "DISCPER": 0,
        //   "DISCAMTFC": 0,
        //   "DISCAMTCC": 0,
        //   "NETVALUEFC": 0,
        //   "NETVALUECC": 0,
        //   "PUDIFF": 0,
        //   "STONEDIFF": 0,
        //   "FROM_LOC": "string",
        //   "TO_LOC": "string",
        //   "STOCK_DOCDESC": "string",
        //   "BAGNO": "string",
        //   "BRTSFMKGAC": "string",
        //   "BRTSFMTLAC": "string",
        //   "PHYSICALSTOCKAC": "string",
        //   "PUDIFFAC": "string",
        //   "PURCHASEAC": "string",
        //   "PRETURNAC": "string",
        //   "STDIFFAC": "string",
        //   "STONEVALAC": "string",
        //   "ADJUSTMENTAC": "string",
        //   "RUBY_WT": 0,
        //   "RUBY_AMOUNTFC": 0,
        //   "RUBY_AMOUNTCC": 0,
        //   "EMERALD_WT": 0,
        //   "EMERALD_AMOUNTFC": 0,
        //   "EMERALD_AMOUNTCC": 0,
        //   "SAPPHIRE_WT": 0,
        //   "SAPPHIRE_AMOUNTFC": 0,
        //   "SAPPHIRE_AMOUNTCC": 0,
        //   "ZIRCON_WT": 0,
        //   "ZIRCON_AMOUNTFC": 0,
        //   "ZIRCON_AMOUNTCC": 0,
        //   "COLOR_STONE_WT": 0,
        //   "COLOR_STONE_AMOUNTFC": 0,
        //   "COLOR_STONE_AMOUNTCC": 0,
        //   "RUBY_RATE": 0,
        //   "EMERALD_RATE": 0,
        //   "SAPPHIRE_RATE": 0,
        //   "ZIRCON_RATE": 0,
        //   "COLOR_STONE_RATE": 0,
        //   "MTL_SIZE": "string",
        //   "MTL_COLOR": "string",
        //   "MTL_DESIGN": "string",
        //   "DT_BRANCH_CODE": "string",
        //   "DT_VOCTYPE": "str",
        //   "DT_VOCNO": 0,
        //   "DT_YEARMONTH": "string",
        //   "SUPPLIERDESC": "string",
        //   "IMPYEARMONTH": "string",
        //   "IMPVOCTYPE": "str",
        //   "IMPVOCNO": 0,
        //   "IMPBATCHNO": 0,
        //   "IMPMID": 0,
        //   "BASE_CONV_RATE": 0,
        //   "LOT_NO": "string",
        //   "BAR_NO": "string",
        //   "TICKET_NO": "string",
        //   "TAX_AMOUNTFC": 0,
        //   "TAX_AMOUNTCC": 0,
        //   "TAX_P": 0,
        //   "UNITWT": 0,
        //   "TOTAL_AMOUNTFC": 0,
        //   "TOTAL_AMOUNTCC": 0,
        //   "CGST_PER": 0,
        //   "CGST_AMOUNTFC": 0,
        //   "CGST_AMOUNTCC": 0,
        //   "SGST_PER": 0,
        //   "SGST_AMOUNTFC": 0,
        //   "SGST_AMOUNTCC": 0,
        //   "IGST_PER": 0,
        //   "IGST_AMOUNTFC": 0,
        //   "IGST_AMOUNTCC": 0,
        //   "CGST_ACCODE": "string",
        //   "SGST_ACCODE": "string",
        //   "IGST_ACCODE": "string",
        //   "TO_STOCK_CODE": "string",
        //   "TO_STOCK_CODE_DESC": "string",
        //   "HSN_CODE": "string",
        //   "GST_CODE": "string",
        //   "WASTAGEPER": 0,
        //   "WASTAGEQTY": 0,
        //   "WASTAGEAMOUNTFC": 0,
        //   "WASTAGEAMOUNTCC": 0,
        //   "WASTAGE_PURITY": 0,
        //   "GST_ROUNDOFFFC": 0,
        //   "GST_ROUNDOFFCC": 0,
        //   "ROUNDOFF_ACCODE": "string",
        //   "KUNDAN_PCS": 0,
        //   "KUNDAN_CARAT": 0,
        //   "KUNDAN_WEIGHT": 0,
        //   "KUNDANVALUEFC": 0,
        //   "KUNDANVALUECC": 0,
        //   "KUNDAN_UNIT": 0,
        //   "KUNDAN_RATEFC": 0,
        //   "KUNDAN_RATECC": 0,
        //   "BATCHSRNO": 0,
        //   "BARCODEDPCS": 0,
        //   "BARCODEDQTY": 0,
        //   "BAGREMARKS": "string",
        //   "REPAIRITEM": "string",
        //   "STAMPCHARGE": true,
        //   "STAMPCHARGE_RATEFC": 0,
        //   "STAMPCHARGE_RATECC": 0,
        //   "STAMPCHARGE_AMTFC": 0,
        //   "STAMPCHARGE_AMTCC": 0,
        //   "SORDER_REF": "string",
        //   "SORDER_MID": 0,
        //   "ORDER_STATUS": true
        // }
      ]
    }
    console.log(postData);
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if (result.status == "Success") {
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.close('reloadMainGrid')
            }
          });
          this.metalBranchTransferinAutoRepairForm.reset()
          this.tableData = []
        }
      } else {
        this.toastr.error('Not saved')
      }
    }, err => alert(err))
  this.subscriptions.push(Sub)
  }

  update() {
    let API =  'MetalBarcodeTransferAuto/UpdateMetalBarcodeTransferAuto/'+ this.content.BRANCH_CODE +  this.content.VOCTYPE + this.content.VOCNO +  this.content.YEARMONTH
    let postData  =  {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.metalBranchTransferinAutoRepairForm.value.voctype,
      "VOCNO": this.metalBranchTransferinAutoRepairForm.value.vocNo,
      "VOCDATE": "2024-03-08T11:16:45.948Z",
      "VALUE_DATE": "2024-03-08T11:16:45.948Z",
      "YEARMONTH": "string",
      "TRANSFERSTATUS": this.metalBranchTransferinAutoRepairForm.value.transferStatus,
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.metalBranchTransferinAutoRepairForm.value.locationTo,
      "REMARKS": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": new Date(),//"2024-03-08T11:16:45.948Z",
      "ITEM_CURRENCY": this.metalBranchTransferinAutoRepairForm.value.itemCurrency,
      "ITEM_CURR_RATE": this.metalBranchTransferinAutoRepairForm.value.itemCurrencyDesc,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE":  this.metalBranchTransferinAutoRepairForm.value.voc_NO,
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": this.metalBranchTransferinAutoRepairForm.value.metal_rate,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": "string",
      "INVREFNO": "string",
      "OUTSTATUS": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": "2024-03-08T11:16:45.948Z",
      "PHYSTKTRANSTO_BR": "string",
      "OUSTATUSNEW": 0,
      "TRANS_VOCNO": 0,
      "REF_DATE": "2024-03-08T11:16:45.948Z",
      "CR_DAYS": 0,
      "REFNO": this.metalBranchTransferinAutoRepairForm.value.reference,
      "TO_BRANCH_NAME": this.metalBranchTransferinAutoRepairForm.value.branchTo,
      "BRANCH_NAME": this.metalBranchTransferinAutoRepairForm.value.branchToDesc,
      "TOTAL_NETWT": 0,
      "FROM_LOC": "string",
      "CMBYEAR": "string",
      "SALESRETURNTRANSFER": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": this.metalBranchTransferinAutoRepairForm.value.branchCurrency,
      "BASE_CURR_RATE": this.metalBranchTransferinAutoRepairForm.value.branchCurrencyDesc,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "DOC_REF":  this.metalBranchTransferinAutoRepairForm.value.docReference,
      "TOTAL_AMT_FC": 0,
      "TOTAL_AMT_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE":   this.metalBranchTransferinAutoRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "INCLUSIVE": 0,
      "TOTAL_WASTQTY": 0,
      "SHIPCODE":  this.metalBranchTransferinAutoRepairForm.value.shipTo,
      "SHIPDESC": this.metalBranchTransferinAutoRepairForm.value.shipToDesc,
      "ROUND_VALUE_CC": 0,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO":  this.metalBranchTransferinAutoRepairForm.value.vehicle,
      "LR_NO": this.metalBranchTransferinAutoRepairForm.value.lrno,
      "TEST_BRANCH_CODE": "string",
      "TEST_VOCTYPE": "str",
      "TEST_VOCNO": 0,
      "TEST_YEARMONTH": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "TOTSTAMP_AMTFC": 0,
      "TOTSTAMP_AMTCC": 0,
      "TOTSTAMP_PARTYAMTFC": 0,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "PARTY_STATE_CODE": "st",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "st",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "st",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "s",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-03-08T11:16:45.948Z",
      "VEHICLE_TYPE": "s",
      "DISPATCH_CITY": "string",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "s",
      "AIR_BILL_NO": "string",
      "GENSEQNO": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DIVISION_CODE": "s",
          "STOCK_ACTION": "s",
          "STOCK_CODE": "string",
          "SUPPLIER": "string",
          "PCS": 0,
          "GROSSWT": 0,
          "STONEWT": 0,
          "NETWT": 0,
          "PURITY": 0,
          "PUREWT": 0,
          "CHARGABLEWT": 0,
          "OZWT": 0,
          "MKG_RATEFC": 0,
          "MKG_RATECC": 0,
          "MKGVALUEFC": 0,
          "MKGVALUECC": 0,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "METAL_RATE_GMSFC": 0,
          "METAL_RATE_GMSCC": 0,
          "METALVALUEFC": 0,
          "METALVALUECC": 0,
          "STONE_RATEFC": 0,
          "STONE_RATECC": 0,
          "STONEVALUEFC": 0,
          "STONEVALUECC": 0,
          "DISCPER": 0,
          "DISCAMTFC": 0,
          "DISCAMTCC": 0,
          "NETVALUEFC": 0,
          "NETVALUECC": 0,
          "PUDIFF": 0,
          "STONEDIFF": 0,
          "FROM_LOC": "string",
          "TO_LOC": "string",
          "STOCK_DOCDESC": "string",
          "BAGNO": "string",
          "BRTSFMKGAC": "string",
          "BRTSFMTLAC": "string",
          "PHYSICALSTOCKAC": "string",
          "PUDIFFAC": "string",
          "PURCHASEAC": "string",
          "PRETURNAC": "string",
          "STDIFFAC": "string",
          "STONEVALAC": "string",
          "ADJUSTMENTAC": "string",
          "RUBY_WT": 0,
          "RUBY_AMOUNTFC": 0,
          "RUBY_AMOUNTCC": 0,
          "EMERALD_WT": 0,
          "EMERALD_AMOUNTFC": 0,
          "EMERALD_AMOUNTCC": 0,
          "SAPPHIRE_WT": 0,
          "SAPPHIRE_AMOUNTFC": 0,
          "SAPPHIRE_AMOUNTCC": 0,
          "ZIRCON_WT": 0,
          "ZIRCON_AMOUNTFC": 0,
          "ZIRCON_AMOUNTCC": 0,
          "COLOR_STONE_WT": 0,
          "COLOR_STONE_AMOUNTFC": 0,
          "COLOR_STONE_AMOUNTCC": 0,
          "RUBY_RATE": 0,
          "EMERALD_RATE": 0,
          "SAPPHIRE_RATE": 0,
          "ZIRCON_RATE": 0,
          "COLOR_STONE_RATE": 0,
          "MTL_SIZE": "string",
          "MTL_COLOR": "string",
          "MTL_DESIGN": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SUPPLIERDESC": "string",
          "IMPYEARMONTH": "string",
          "IMPVOCTYPE": "str",
          "IMPVOCNO": 0,
          "IMPBATCHNO": 0,
          "IMPMID": 0,
          "BASE_CONV_RATE": 0,
          "LOT_NO": "string",
          "BAR_NO": "string",
          "TICKET_NO": "string",
          "TAX_AMOUNTFC": 0,
          "TAX_AMOUNTCC": 0,
          "TAX_P": 0,
          "UNITWT": 0,
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTCC": 0,
          "CGST_PER": 0,
          "CGST_AMOUNTFC": 0,
          "CGST_AMOUNTCC": 0,
          "SGST_PER": 0,
          "SGST_AMOUNTFC": 0,
          "SGST_AMOUNTCC": 0,
          "IGST_PER": 0,
          "IGST_AMOUNTFC": 0,
          "IGST_AMOUNTCC": 0,
          "CGST_ACCODE": "string",
          "SGST_ACCODE": "string",
          "IGST_ACCODE": "string",
          "TO_STOCK_CODE": "string",
          "TO_STOCK_CODE_DESC": "string",
          "HSN_CODE": "string",
          "GST_CODE": "string",
          "WASTAGEPER": 0,
          "WASTAGEQTY": 0,
          "WASTAGEAMOUNTFC": 0,
          "WASTAGEAMOUNTCC": 0,
          "WASTAGE_PURITY": 0,
          "GST_ROUNDOFFFC": 0,
          "GST_ROUNDOFFCC": 0,
          "ROUNDOFF_ACCODE": "string",
          "KUNDAN_PCS": 0,
          "KUNDAN_CARAT": 0,
          "KUNDAN_WEIGHT": 0,
          "KUNDANVALUEFC": 0,
          "KUNDANVALUECC": 0,
          "KUNDAN_UNIT": 0,
          "KUNDAN_RATEFC": 0,
          "KUNDAN_RATECC": 0,
          "BATCHSRNO": 0,
          "BARCODEDPCS": 0,
          "BARCODEDQTY": 0,
          "BAGREMARKS": "string",
          "REPAIRITEM": "string",
          "STAMPCHARGE": true,
          "STAMPCHARGE_RATEFC": 0,
          "STAMPCHARGE_RATECC": 0,
          "STAMPCHARGE_AMTFC": 0,
          "STAMPCHARGE_AMTCC": 0,
          "SORDER_REF": "string",
          "SORDER_MID": 0,
          "ORDER_STATUS": true
        }
      ]
    }
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.metalBranchTransferinAutoRepairForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
 

  deleteTableData(){
    if (!this.content.branchCode) {
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
        let API = 'MetalBarcodeTransferAuto/DeleteMetalBarcodeTransferAuto/'+ this.content.BRANCH_CODE +  this.content.VOCTYPE + this.content.VOCNO +  this.content.YEARMONTH
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
                    this.metalBranchTransferinAutoRepairForm.reset()
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
                    this.metalBranchTransferinAutoRepairForm.reset()
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

  credit_Date2(event: any) {
    const credit_days = +event.target.value;
    console.log("days"+credit_days);
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + credit_days);

    this.metalBranchTransferinAutoRepairForm.patchValue({
      credit_days_LC: newDate,
    });
  }


}
