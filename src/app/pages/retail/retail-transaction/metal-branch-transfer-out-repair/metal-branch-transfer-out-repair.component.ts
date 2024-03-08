import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { MetalBranchTransferOutRepairDetailComponent } from './metal-branch-transfer-out-repair-detail/metal-branch-transfer-out-repair-detail.component';



@Component({
  selector: 'app-metal-branch-transfer-out-repair',
  templateUrl: './metal-branch-transfer-out-repair.component.html',
  styleUrls: ['./metal-branch-transfer-out-repair.component.scss']
})
export class MetalBranchTransferOutRepairComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];   
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Sr.Code','Stock Desc','Pcs','GrWt','St.Wt','Kun.Wt','Net.Wt','Purity','Pure Wt','Mkq.Rate','Tax%'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  selectedTabIndexLineItem=0;
  // setAllInitialValues: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }




  metalBranchTransferOutRepairForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocNo:[''],
    vocDate:[''],
    enteredBy:[''],
    itemCurrency:[''],
    itemCurrencyAmt:[''],
    BaseCurrency:[''],
    BaseCurrencyAmt:[''],
    transferStatus:[''],
    metalRate:[''],
    metalRateAmt:[''],
    branchToCode:[''],
    branchtoDesc:[''],
    locationTo:[''],
    returnLocation:[''],
    deliveryOn:[''],
    creditDate:[''],
    reference:[''],
    posVocNo:[''],
    posVocType:[''],
    batchSino:[''],
    batchSICode:[''],
    batchSiDes:[''],
    salesReturn:[''],
    salesTransfer:[''],
    inclusiveTax:[''],
    applyTcs:[''],
    transport:[''],
    lrNo:[''],
    vehicle:[''],
    DocReference:[''],
    stateCode:[''],
    stateDesc:[''],
    taxCode:[''],
    type:[''],
    importMBCYear:[''],
    mbcVocNo:[''],
    purityDiff:[''],
    stoneDiff:[''],
    stoneDiffNum:[''],
    narration:[''],
    totalAmount:[''],
    otherAmount:[''],
    tcsAmount:[''],
    totalGst:[''],
    roundTo:[''],
    netAmount:[''],
    netAmountLc:[''],
    driveCode:[''],
    driveCodeDes:[''],
    fixed:[''],
    creditDays:[''],
    Document:[''],
  }); 
  
  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.metalBranchTransferOutRepairForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 



  openAddDetail() {
    const modalRef: NgbModalRef = this.modalService.open(MetalBranchTransferOutRepairDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  removedata(){

  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.metalBranchTransferOutRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'RepairDelivery/InsertRepairDelivery'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.metalBranchTransferOutRepairForm.value.vocType,
      "VOCNO": this.metalBranchTransferOutRepairForm.value.vocNo,
      "VOCDATE":this.metalBranchTransferOutRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-08T09:59:42.749Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": this.metalBranchTransferOutRepairForm.value.transferStatus,
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.metalBranchTransferOutRepairForm.value.locationTo,
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
      "SYSTEM_DATE": "2024-03-08T09:59:42.749Z",
      "ITEM_CURRENCY": this.metalBranchTransferOutRepairForm.value.itemCurrency,
      "ITEM_CURR_RATE": this.metalBranchTransferOutRepairForm.value.itemCurrencyAmt,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": this.metalBranchTransferOutRepairForm.value.posVocType,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.metalBranchTransferOutRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "DELIVEREDDATE": this.metalBranchTransferOutRepairForm.value.deliveryOn, 
      "PHYSTKTRANSTO_BR": "string",
      "OUSTATUSNEW": 0,
      "TOTAL_NETWT": 0,
      "BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchToCode,
      "TO_BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchtoDesc,
      "TRANS_VOCNO": this.metalBranchTransferOutRepairForm.value.posVocNo,
      "REF_DATE": "2024-03-08T09:59:42.749Z",
      "CR_DAYS": this.metalBranchTransferOutRepairForm.value.creditDays,
      "REFNO": this.metalBranchTransferOutRepairForm.value.reference,
      "FROM_LOC": "string",
      "SALESRETURNTRANSFER": true,
      "CMBYEAR": "string",
      "TOTAL_CHGWT": 0,
      "AUTOPOSTING": true,
      "DIVISION_CODE": "s",
      "POSTDATE": "string",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": this.metalBranchTransferOutRepairForm.value.BaseCurrency,
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": this.metalBranchTransferOutRepairForm.value.BaseCurrencyAmt,
      "HLOCTYPE_CODE": "string",
      "HLOCTYPE_TOCODE": "string",
      "DOC_REF": "string",
      "PRINT_COUNT": 0,
      "TOTAL_AMT_FC": 0,
      "TOTAL_AMT_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.metalBranchTransferOutRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "INCLUSIVE": 0,
      "TOTAL_WASTQTY": 0,
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "ROUND_VALUE_CC": 0,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO": "string",
      "LR_NO": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "TOTSTAMP_AMTFC": 0,
      "TOTSTAMP_AMTCC": 0,
      "TOTSTAMP_PARTYAMTFC": 0,
      "METAL_TYPE": this.metalBranchTransferOutRepairForm.value.metalRate,
      "METAL_TYPERATE": this.metalBranchTransferOutRepairForm.value.metalRateAmt,
      "PARTY_CODE": "string",
      "FREIGHT_RATE": 0,
      "E_INVOICE_CANCEL": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "TRANSIT_SEALNO": "string",
      "PARTY_STATE_CODE": "st",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "st",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "st",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "s",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-03-08T09:59:42.749Z",
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
          "BATCHSRNO": 0,
          "STOCK_DOCDESC": "string",
          "BAGNO": "string",
          "WORKER_CODE": "string",
          "PHYSICALSTOCKAC": "string",
          "PUDIFFAC": "string",
          "PURCHASEAC": "string",
          "PRETURNAC": "string",
          "STDIFFAC": "string",
          "STONEVALAC": "string",
          "ADJUSTMENTAC": "string",
          "BRTSFMKGAC": "string",
          "BRTSFMTLAC": "string",
          "ITEM_CURRENCY_D": "stri",
          "ITEM_CURR_RATE_D": 0,
          "D_REMARKS": "string",
          "IMPYEARMONTH": "string",
          "IMPVOCTYPE": "str",
          "IMPVOCNO": 0,
          "IMPBATCHNO": 0,
          "IMPMID": 0,
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
          "STONEVALACSALES": "string",
          "MTL_SIZE": "string",
          "MTL_COLOR": "string",
          "MTL_DESIGN": "string",
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "ISTOCK_CODE": "string",
          "ISTOCK_DOCDESC": "string",
          "TO_BR": "string",
          "BRANCH_NAME": "string",
          "TO_BRANCH_NAME": "string",
          "REFNO": "string",
          "CR_DAYS": 0,
          "CRDAYS": "2024-03-08T09:59:42.749Z",
          "TOTAL_AMT": 0,
          "SUPPLIERDESC": "string",
          "BASE_CONV_RATE": 0,
          "WORKERCODEDESC": "string",
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
          "KARAT_CODE": "string",
          "BAGREMARKS": "string",
          "REPAIRITEM": "string",
          "STAMPCHARGE": true,
          "STAMPCHARGE_RATEFC": 0,
          "STAMPCHARGE_RATECC": 0,
          "STAMPCHARGE_AMTFC": 0,
          "STAMPCHARGE_AMTCC": 0,
          "BOXNO": "string",
          "IS_AUTHORISE": true,
          "IS_REJECT": true,
          "REASON": "string",
          "REJ_REMARKS": "string",
          "ATTACHMENT_FILE": "string",
          "AUTHORIZE_TIME": "2024-03-08T09:59:42.749Z",
          "BARCODE": "string",
          "SORDER_REF": "string",
          "SORDER_MID": 0,
          "ORDER_STATUS": true
        }
      ]
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == " Success ") {
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
            this.metalBranchTransferOutRepairForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
  
  }
 




}
