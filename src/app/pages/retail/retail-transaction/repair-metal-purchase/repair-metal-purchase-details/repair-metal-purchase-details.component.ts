import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';


@Component({
  selector: 'app-repair-metal-purchase-details',
  templateUrl: './repair-metal-purchase-details.component.html',
  styleUrls: ['./repair-metal-purchase-details.component.scss']
})
export class RepairMetalPurchaseDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = []; 
  branchCode?: String;
  yearMonth?: String; 
  private subscriptions: Subscription[] = [];
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['SI.No' , 'GST_Type%' , 'GST_Type', 'Total GST'];

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
  }


  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchasedetailsForm.controls.Stockdiv.setValue(e.DIVISION_CODE);
    this.repairmetalpurchasedetailsForm.controls.stockcode.setValue(e.STOCK_CODE);
    this.repairmetalpurchasedetailsForm.controls.stockdes.setValue(e.DESCRIPTION );
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
  locationCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchasedetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

 

  repairmetalpurchasedetailsForm: FormGroup = this.formBuilder.group({
    Stockdiv: [''],
    stockcode: [''],
    stockdes: [''],
    description : [''],
    hallmarking : [''],
    penalty : [''],
    location: [''],
    metal_rate: [''],
    transaction_attribute: [''],
    pieces : [''],
    unit_weight: [''],
    gross_weight: [''],
    stone_weight: [''],
    purity: [''],
    pure_weight: [''],
    net_weight: [''],
    chargable_weight: [''],
    Pcs: [''],
    Cts: [''],
    GMS: [''],
    purity_difference: [''],
    stone_difference: [''],
    lot_no: [''],
    unit: [''],
    making_rate_fc: [''],
    making_rate_cc: [''],
    making_amount: [''],
    metal_rate_1: [''],
    metal_amount: [''],
    stone_rate: [''],
    stone_amount: [''],
    rate_type: [''],
    kundan_rate: [''],
    total_amount: [''],
    bar_no: [''],
    total_amount_2: [''],
    repair_item: [''],
    price_1: [''],
    price_1_fc: [''],
    price_1_cc: [''],
    price_2: [''],
    price_2_fc: [''],
    price_2_cc: [''],
    Wastage_per: [''],
    Wastage_qua: [''],
    Wastage_amo: [''],
    Wastage_pur: [''],
    declaration_no: [''],
    Re_Export_YN: [''],
    amount_1: [''],
    rate_1: [''],
    ticket_no: [''],
    CGST : [''],
    CGST_fc : [''],
    CGST_cc : [''],
    SGST : [''],
    SGST_fc : [''],
    SGST_cc : [''],
    IGST : [''],
    IGST_fc : [''],
    IGST_cc : [''],
    round : [''],
    total : [''],
    
  });
  
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 
 
 

  adddata() {
   
}


adddatas() {
 
}

removedata(){

}

removedatas(){
 
}

formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.repairmetalpurchasedetailsForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'MetalPurchase/InsertMetalPurchase'
  let postData = {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": this.repairmetalpurchasedetailsForm.value.Stockdiv,
        "STOCK_CODE": this.repairmetalpurchasedetailsForm.value.stockcode,
        "PCS": this.repairmetalpurchasedetailsForm.value.Pcs,
        "GROSSWT": this.repairmetalpurchasedetailsForm.value.gross_weight,
        "STONEWT":this.repairmetalpurchasedetailsForm.value.stone_weight,
        "NETWT": this.repairmetalpurchasedetailsForm.value.net_weight,
        "PURITY": this.repairmetalpurchasedetailsForm.value.purity,
        "PUREWT": this.repairmetalpurchasedetailsForm.value.pure_weight,
        "CHARGABLEWT": this.repairmetalpurchasedetailsForm.value.chargable_weight,
        "MKG_RATEFC": this.repairmetalpurchasedetailsForm.value.making_rate_fc,
        "MKG_RATECC": this.repairmetalpurchasedetailsForm.value.making_rate_cc,
        "MKGVALUEFC": this.repairmetalpurchasedetailsForm.value.making_amount,
        "MKGVALUECC": 0,
        "RATE_TYPE": this.repairmetalpurchasedetailsForm.value.rate_type,
        "METAL_RATE": this.repairmetalpurchasedetailsForm.value.metal_rate,
        "METAL_RATE_GMSFC": this.repairmetalpurchasedetailsForm.value.metal_rate_1,
        "METAL_RATE_GMSCC": 0,
        "METALVALUEFC": this.repairmetalpurchasedetailsForm.value.metal_amount,
        "METALVALUECC": 0,
        "STONE_RATEFC": this.repairmetalpurchasedetailsForm.value.stone_rate,
        "STONE_RATECC": 0,
        "STONEVALUEFC": this.repairmetalpurchasedetailsForm.value.stone_amount,
        "STONEVALUECC": 0,
        "NETVALUEFC": 0,
        "NETVALUECC": 0,
        "PUDIFF": this.repairmetalpurchasedetailsForm.value.purity_difference,
        "STONEDIFF": this.repairmetalpurchasedetailsForm.value.stone_difference,
        "PONO": 0,
        "LOCTYPE_CODE": this.repairmetalpurchasedetailsForm.value.location,
        "OZWT": 0,
        "SUPPLIER": "string",
        "BATCHSRNO": 0,
        "STOCK_DOCDESC": this.repairmetalpurchasedetailsForm.value.stockdes,
        "BAGNO": "string",
        "BAGREMARKS": "string",
        "WASTAGEPER": this.repairmetalpurchasedetailsForm.value.Wastage_per,
        "WASTAGEQTY":this.repairmetalpurchasedetailsForm.value.Wastage_qua,
        "WASTAGEAMOUNTFC": this.repairmetalpurchasedetailsForm.value.Wastage_amo,
        "WASTAGEAMOUNTCC": 0,
        "MKGMTLNETRATE": 0,
        "MCLENGTH": 0,
        "MCUNIT": 0,
        "SORDER_REF": "string",
        "BARCODEDQTY": 0,
        "RUBY_WT": 0,
        "RUBY_RATE": 0,
        "RUBY_AMOUNTFC": 0,
        "RUBY_AMOUNTCC": 0,
        "EMERALD_WT": 0,
        "EMERALD_RATE": 0,
        "EMERALD_AMOUNTFC": 0,
        "EMERALD_AMOUNTCC": 0,
        "SAPPHIRE_WT": 0,
        "SAPPHIRE_RATE": 0,
        "SAPPHIRE_AMOUNTFC": 0,
        "SAPPHIRE_AMOUNTCC": 0,
        "ZIRCON_WT": 0,
        "ZIRCON_RATE": 0,
        "ZIRCON_AMOUNTFC": 0,
        "ZIRCON_AMOUNTCC": 0,
        "COLOR_STONE_WT": 0,
        "COLOR_STONE_RATE": 0,
        "COLOR_STONE_AMOUNTFC": 0,
        "COLOR_STONE_AMOUNTCC": 0,
        "DISCOUNTWT": 0,
        "DISCOUNTPUWT": 0,
        "REPITEMCODE": "string",
        "MTL_SIZE": "string",
        "MTL_COLOR": "string",
        "MTL_DESIGN": "string",
        "BARCODE": "string",
        "ORDER_STATUS": true,
        "PORDER_REF": "string",
        "BARCODEDPCS": 0,
        "SUPPLIERDISC": "string",
        "DT_BRANCH_CODE": "string",
        "DT_VOCNO": 0,
        "DT_VOCTYPE": "str",
        "DT_YEARMONTH": "string",
        "BASE_CONV_RATE": 0,
        "WASTAGE_PURITY": this.repairmetalpurchasedetailsForm.value.Wastage_pur,
        "PUDIFF_AMTLC": 0,
        "PUDIFF_AMTFC": 0,
        "TAX_AMOUNTFC": 0,
        "TAX_AMOUNTCC": 0,
        "TAX_P": 0,
        "LOT_NO": this.repairmetalpurchasedetailsForm.value.lot_no,
        "BAR_NO": this.repairmetalpurchasedetailsForm.value.bar_no,
        "TICKET_NO": this.repairmetalpurchasedetailsForm.value.ticket_no,
        "PENALTY": this.repairmetalpurchasedetailsForm.value.penalty,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTCC": 0,
        "CGST_PER": 0,
        "CGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.CGST_fc,
        "CGST_AMOUNTCC": this.repairmetalpurchasedetailsForm.value.CGST_cc,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.SGST_fc,
        "SGST_AMOUNTCC": this.repairmetalpurchasedetailsForm.value.SGST_cc,
        "IGST_PER": 0,
        "IGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.IGST_fc,
        "IGST_AMOUNTCC":this.repairmetalpurchasedetailsForm.value.IGST_cc,
        "CGST_ACCODE": this.repairmetalpurchasedetailsForm.value.CGST,
        "SGST_ACCODE": this.repairmetalpurchasedetailsForm.value.SGST,
        "IGST_ACCODE": this.repairmetalpurchasedetailsForm.value.IGST,
        "UNITWT": 0,
        "CGST_CTRLACCODE": "string",
        "SGST_CTRLACCODE": "string",
        "IGST_CTRLACCODE": "string",
        "HSN_CODE": "string",
        "GST_ROUNDOFFFC": 0,
        "GST_ROUNDOFFCC": 0,
        "ROUNDOFF_ACCODE": "string",
        "OLD_GOLD_TYPE": "string",
        "OUTSIDEGOLD": true,
        "KUNDAN_PCS": 0,
        "KUNDAN_CARAT": 0,
        "KUNDAN_RATEFC": 0,
        "KUNDAN_RATECC": 0,
        "KUNDAN_WEIGHT": 0,
        "KUNDANVALUEFC": 0,
        "KUNDANVALUECC": 0,
        "KUNDAN_UNIT": 0,
        "PREMIUM_CURRENCY": "string",
        "PREMIUM_CURR_RATE": 0,
        "PREMIUM_RATE_TYPE": "string",
        "PREMIUM_METAL_RATEFC": 0,
        "PREMIUM_METAL_RATECC": 0,
        "PREMIUM_TOTALAMOUNTCC": 0,
        "PREMIUM_TOTALAMOUNTFC": 0,
        "TDS_CODE": "string",
        "TDS_PER": 0,
        "TDS_TOTALFC": 0,
        "TDS_TOTALCC": 0,
        "DECLARATIONNO": this.repairmetalpurchasedetailsForm.value.declaration_no,
        "REEXPORTYN": this.repairmetalpurchasedetailsForm.value.Re_Export_YN,
        "SILVER_PURITY": 0,
        "SILVER_PUREWT": 0,
        "SILVER_RATE_TYPE": "string",
        "SILVER_RATE": 0,
        "SILVER_RATEFC": 0,
        "SILVER_RATECC": 0,
        "SILVER_VALUEFC": 0,
        "SILVER_VALUECC": 0,
        "OZGOLD_PUREWT": 0,
        "OZSILVER_PUREWT": 0,
        "CONV_FACTOR_OZ": 0,
        "PUR_REF": "string",
        "BATCHID": 0,
        "STAMPCHARGE_RATEFC": 0,
        "STAMPCHARGE_RATECC": 0,
        "STAMPCHARGE_AMTFC": 0,
        "STAMPCHARGE_AMTCC": 0,
        "STAMPCHARGE": true,
        "ACTUALGROSSWT": 0,
        "ACTUALPURITY": 0,
        "MELTINGLOSS": 0,
        "DRAFTIMPORTFLG": true,
        "FIXMID": 0,
        "FIXVOCTYPE": "str",
        "FIXVOCNO": 0,
        "FIXBRANCH": "string",
        "FIXYEARMONTH": "string",
        "FIXSRNO": 0,
        "FIX_STOCKCODE": "string",
        "IMPORT_REF": "string",
        "OT_TRANSFER_TIME": "string",
        "PRICE1CODE": this.repairmetalpurchasedetailsForm.value.price_1,
        "PRICE2CODE": this.repairmetalpurchasedetailsForm.value.price_2,
        "PRICE3CODE": "string",
        "PRICE4CODE": "string",
        "PRICE5CODE": "string",
        "PRICE1_VALUECC": this.repairmetalpurchasedetailsForm.value.price_1_cc,
        "PRICE1_VALUEFC": this.repairmetalpurchasedetailsForm.value.price_1_fc,
        "PRICE2_VALUECC": this.repairmetalpurchasedetailsForm.value.price_2_cc,
        "PRICE2_VALUEFC": this.repairmetalpurchasedetailsForm.value.price_2_fc,
        "PRICE3_VALUECC": 0,
        "PRICE3_VALUEFC": 0,
        "PRICE4_VALUECC": 0,
        "PRICE4_VALUEFC": 0,
        "PRICE5_VALUECC": 0,
        "PRICE5_VALUEFC": 0,
        "MKGPREMIUMACCODE": "string",
        "DETLINEREMARKS": "string",
        "MUD_WT": 0,
        "JAWAHARAYN": 0,
        "RESALERECYCLE": 0,
        "CASHEXCHANGE": 0,
        "VATAMOUNTMETALONLYCC": 0,
        "VATAMOUNTMETALONLY": 0,
        "GST_CODE": "string",
        "HALLMARKING": this.repairmetalpurchasedetailsForm.value.hallmarking,
        "DISCAMTFC": 0,
        "DISCAMTCC": 0,
        "DISCPER": 0,
        "MARGIN_PER": 0,
        "MARGIN_AMTFC": 0,
        "MARGIN_AMTCC": 0,
        "Picture_Path": "string",
        "ORIGINAL_COUNTRY": "string",
        "DET_KPNO": "string",
        "SERVICE_ACCODE": "string",
        "taxcode": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "SHAPE": "string",
        "SIEVE": "string",
        "KPNUMBER": "string",
        "PURITYMAIN": 0,
        "C1_CATEGORY": "string",
        "C2_CATEGORY": "string",
        "C3_CATEGORY": "string",
        "C4_CATEGORY": "string",
        "C5_CATEGORY": "string",
        "C6_CATEGORY": "string",
        "NEWUNIQUEID": 0,
        "VATCODE": "string",
        "HSNCODE": "string",
        "VAT_PER": 0,
        "VAT_AMOUNTCC": 0,
        "VAT_AMOUNTFC": 0,
        "TOTALAMOUNTWITHVATCC": 0,
        "TOTALAMOUNTWITHVATFC": 0,
        "DETAILPCS": 0,
        "D_REMARKS": "string",
        "DONE_REEXPORTYN": true,
        "DUSTWT": 0,
        "MDESIGN_CODE": "string",
        "SALES_REF": "string",
        "SAMEBARCODEPURCHASE": 0,
        "SLIVERPURITYPER": 0,
        "TRANSACTIONATTRIBUTE": "string"
      }
      this.close(postData);
   
}




update(){
  if (this.repairmetalpurchasedetailsForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'Repair/UpdateRepair/'+ this.branchCode + this.repairmetalpurchasedetailsForm.value.voctype + this.repairmetalpurchasedetailsForm.value.vocno + this.yearMonth
  let postData = {
    "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": this.repairmetalpurchasedetailsForm.value.Stockdiv,
        "STOCK_CODE": this.repairmetalpurchasedetailsForm.value.stockcode,
        "PCS": this.repairmetalpurchasedetailsForm.value.Pcs,
        "GROSSWT": this.repairmetalpurchasedetailsForm.value.gross_weight,
        "STONEWT":this.repairmetalpurchasedetailsForm.value.stone_weight,
        "NETWT": this.repairmetalpurchasedetailsForm.value.net_weight,
        "PURITY": this.repairmetalpurchasedetailsForm.value.purity,
        "PUREWT": this.repairmetalpurchasedetailsForm.value.pure_weight,
        "CHARGABLEWT": this.repairmetalpurchasedetailsForm.value.chargable_weight,
        "MKG_RATEFC": this.repairmetalpurchasedetailsForm.value.making_rate_fc,
        "MKG_RATECC": this.repairmetalpurchasedetailsForm.value.making_rate_cc,
        "MKGVALUEFC": this.repairmetalpurchasedetailsForm.value.making_amount,
        "MKGVALUECC": 0,
        "RATE_TYPE": this.repairmetalpurchasedetailsForm.value.rate_type,
        "METAL_RATE": this.repairmetalpurchasedetailsForm.value.metal_rate,
        "METAL_RATE_GMSFC": this.repairmetalpurchasedetailsForm.value.metal_rate_1,
        "METAL_RATE_GMSCC": 0,
        "METALVALUEFC": this.repairmetalpurchasedetailsForm.value.metal_amount,
        "METALVALUECC": 0,
        "STONE_RATEFC": this.repairmetalpurchasedetailsForm.value.stone_rate,
        "STONE_RATECC": 0,
        "STONEVALUEFC": this.repairmetalpurchasedetailsForm.value.stone_amount,
        "STONEVALUECC": 0,
        "NETVALUEFC": 0,
        "NETVALUECC": 0,
        "PUDIFF": this.repairmetalpurchasedetailsForm.value.purity_difference,
        "STONEDIFF": this.repairmetalpurchasedetailsForm.value.stone_difference,
        "PONO": 0,
        "LOCTYPE_CODE": this.repairmetalpurchasedetailsForm.value.location,
        "OZWT": 0,
        "SUPPLIER": "string",
        "BATCHSRNO": 0,
        "STOCK_DOCDESC": this.repairmetalpurchasedetailsForm.value.stockdes,
        "BAGNO": "string",
        "BAGREMARKS": "string",
        "WASTAGEPER": this.repairmetalpurchasedetailsForm.value.Wastage_per,
        "WASTAGEQTY":this.repairmetalpurchasedetailsForm.value.Wastage_qua,
        "WASTAGEAMOUNTFC": this.repairmetalpurchasedetailsForm.value.Wastage_amo,
        "WASTAGEAMOUNTCC": 0,
        "MKGMTLNETRATE": 0,
        "MCLENGTH": 0,
        "MCUNIT": 0,
        "SORDER_REF": "string",
        "BARCODEDQTY": 0,
        "RUBY_WT": 0,
        "RUBY_RATE": 0,
        "RUBY_AMOUNTFC": 0,
        "RUBY_AMOUNTCC": 0,
        "EMERALD_WT": 0,
        "EMERALD_RATE": 0,
        "EMERALD_AMOUNTFC": 0,
        "EMERALD_AMOUNTCC": 0,
        "SAPPHIRE_WT": 0,
        "SAPPHIRE_RATE": 0,
        "SAPPHIRE_AMOUNTFC": 0,
        "SAPPHIRE_AMOUNTCC": 0,
        "ZIRCON_WT": 0,
        "ZIRCON_RATE": 0,
        "ZIRCON_AMOUNTFC": 0,
        "ZIRCON_AMOUNTCC": 0,
        "COLOR_STONE_WT": 0,
        "COLOR_STONE_RATE": 0,
        "COLOR_STONE_AMOUNTFC": 0,
        "COLOR_STONE_AMOUNTCC": 0,
        "DISCOUNTWT": 0,
        "DISCOUNTPUWT": 0,
        "REPITEMCODE": "string",
        "MTL_SIZE": "string",
        "MTL_COLOR": "string",
        "MTL_DESIGN": "string",
        "BARCODE": "string",
        "ORDER_STATUS": true,
        "PORDER_REF": "string",
        "BARCODEDPCS": 0,
        "SUPPLIERDISC": "string",
        "DT_BRANCH_CODE": "string",
        "DT_VOCNO": 0,
        "DT_VOCTYPE": "str",
        "DT_YEARMONTH": "string",
        "BASE_CONV_RATE": 0,
        "WASTAGE_PURITY": this.repairmetalpurchasedetailsForm.value.Wastage_pur,
        "PUDIFF_AMTLC": 0,
        "PUDIFF_AMTFC": 0,
        "TAX_AMOUNTFC": 0,
        "TAX_AMOUNTCC": 0,
        "TAX_P": 0,
        "LOT_NO": this.repairmetalpurchasedetailsForm.value.lot_no,
        "BAR_NO": this.repairmetalpurchasedetailsForm.value.bar_no,
        "TICKET_NO": this.repairmetalpurchasedetailsForm.value.ticket_no,
        "PENALTY": this.repairmetalpurchasedetailsForm.value.penalty,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTCC": 0,
        "CGST_PER": 0,
        "CGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.CGST_fc,
        "CGST_AMOUNTCC": this.repairmetalpurchasedetailsForm.value.CGST_cc,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.SGST_fc,
        "SGST_AMOUNTCC": this.repairmetalpurchasedetailsForm.value.SGST_cc,
        "IGST_PER": 0,
        "IGST_AMOUNTFC": this.repairmetalpurchasedetailsForm.value.IGST_fc,
        "IGST_AMOUNTCC":this.repairmetalpurchasedetailsForm.value.IGST_cc,
        "CGST_ACCODE": this.repairmetalpurchasedetailsForm.value.CGST,
        "SGST_ACCODE": this.repairmetalpurchasedetailsForm.value.SGST,
        "IGST_ACCODE": this.repairmetalpurchasedetailsForm.value.IGST,
        "UNITWT": 0,
        "CGST_CTRLACCODE": "string",
        "SGST_CTRLACCODE": "string",
        "IGST_CTRLACCODE": "string",
        "HSN_CODE": "string",
        "GST_ROUNDOFFFC": 0,
        "GST_ROUNDOFFCC": 0,
        "ROUNDOFF_ACCODE": "string",
        "OLD_GOLD_TYPE": "string",
        "OUTSIDEGOLD": true,
        "KUNDAN_PCS": 0,
        "KUNDAN_CARAT": 0,
        "KUNDAN_RATEFC": 0,
        "KUNDAN_RATECC": 0,
        "KUNDAN_WEIGHT": 0,
        "KUNDANVALUEFC": 0,
        "KUNDANVALUECC": 0,
        "KUNDAN_UNIT": 0,
        "PREMIUM_CURRENCY": "string",
        "PREMIUM_CURR_RATE": 0,
        "PREMIUM_RATE_TYPE": "string",
        "PREMIUM_METAL_RATEFC": 0,
        "PREMIUM_METAL_RATECC": 0,
        "PREMIUM_TOTALAMOUNTCC": 0,
        "PREMIUM_TOTALAMOUNTFC": 0,
        "TDS_CODE": "string",
        "TDS_PER": 0,
        "TDS_TOTALFC": 0,
        "TDS_TOTALCC": 0,
        "DECLARATIONNO": this.repairmetalpurchasedetailsForm.value.declaration_no,
        "REEXPORTYN": this.repairmetalpurchasedetailsForm.value.Re_Export_YN,
        "SILVER_PURITY": 0,
        "SILVER_PUREWT": 0,
        "SILVER_RATE_TYPE": "string",
        "SILVER_RATE": 0,
        "SILVER_RATEFC": 0,
        "SILVER_RATECC": 0,
        "SILVER_VALUEFC": 0,
        "SILVER_VALUECC": 0,
        "OZGOLD_PUREWT": 0,
        "OZSILVER_PUREWT": 0,
        "CONV_FACTOR_OZ": 0,
        "PUR_REF": "string",
        "BATCHID": 0,
        "STAMPCHARGE_RATEFC": 0,
        "STAMPCHARGE_RATECC": 0,
        "STAMPCHARGE_AMTFC": 0,
        "STAMPCHARGE_AMTCC": 0,
        "STAMPCHARGE": true,
        "ACTUALGROSSWT": 0,
        "ACTUALPURITY": 0,
        "MELTINGLOSS": 0,
        "DRAFTIMPORTFLG": true,
        "FIXMID": 0,
        "FIXVOCTYPE": "str",
        "FIXVOCNO": 0,
        "FIXBRANCH": "string",
        "FIXYEARMONTH": "string",
        "FIXSRNO": 0,
        "FIX_STOCKCODE": "string",
        "IMPORT_REF": "string",
        "OT_TRANSFER_TIME": "string",
        "PRICE1CODE": this.repairmetalpurchasedetailsForm.value.price_1,
        "PRICE2CODE": this.repairmetalpurchasedetailsForm.value.price_2,
        "PRICE3CODE": "string",
        "PRICE4CODE": "string",
        "PRICE5CODE": "string",
        "PRICE1_VALUECC": this.repairmetalpurchasedetailsForm.value.price_1_cc,
        "PRICE1_VALUEFC": this.repairmetalpurchasedetailsForm.value.price_1_fc,
        "PRICE2_VALUECC": this.repairmetalpurchasedetailsForm.value.price_2_cc,
        "PRICE2_VALUEFC": this.repairmetalpurchasedetailsForm.value.price_2_fc,
        "PRICE3_VALUECC": 0,
        "PRICE3_VALUEFC": 0,
        "PRICE4_VALUECC": 0,
        "PRICE4_VALUEFC": 0,
        "PRICE5_VALUECC": 0,
        "PRICE5_VALUEFC": 0,
        "MKGPREMIUMACCODE": "string",
        "DETLINEREMARKS": "string",
        "MUD_WT": 0,
        "JAWAHARAYN": 0,
        "RESALERECYCLE": 0,
        "CASHEXCHANGE": 0,
        "VATAMOUNTMETALONLYCC": 0,
        "VATAMOUNTMETALONLY": 0,
        "GST_CODE": "string",
        "HALLMARKING": this.repairmetalpurchasedetailsForm.value.hallmarking,
        "DISCAMTFC": 0,
        "DISCAMTCC": 0,
        "DISCPER": 0,
        "MARGIN_PER": 0,
        "MARGIN_AMTFC": 0,
        "MARGIN_AMTCC": 0,
        "Picture_Path": "string",
        "ORIGINAL_COUNTRY": "string",
        "DET_KPNO": "string",
        "SERVICE_ACCODE": "string",
        "taxcode": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "SHAPE": "string",
        "SIEVE": "string",
        "KPNUMBER": "string",
        "PURITYMAIN": 0,
        "C1_CATEGORY": "string",
        "C2_CATEGORY": "string",
        "C3_CATEGORY": "string",
        "C4_CATEGORY": "string",
        "C5_CATEGORY": "string",
        "C6_CATEGORY": "string",
        "NEWUNIQUEID": 0,
        "VATCODE": "string",
        "HSNCODE": "string",
        "VAT_PER": 0,
        "VAT_AMOUNTCC": 0,
        "VAT_AMOUNTFC": 0,
        "TOTALAMOUNTWITHVATCC": 0,
        "TOTALAMOUNTWITHVATFC": 0,
        "DETAILPCS": 0,
        "D_REMARKS": "string",
        "DONE_REEXPORTYN": true,
        "DUSTWT": 0,
        "MDESIGN_CODE": "string",
        "SALES_REF": "string",
        "SAMEBARCODEPURCHASE": 0,
        "SLIVERPURITYPER": 0,
        "TRANSACTIONATTRIBUTE": "string"
}

  let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if(result.status == "Success"){
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.repairmetalpurchasedetailsForm.reset()
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

deleteRecord() {
  if (!this.content.VOCTYPE) {
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
      let API = 'Repair/DeleteRepair/' + this.branchCode + this.repairmetalpurchasedetailsForm.value.voctype + this.repairmetalpurchasedetailsForm.value.vocno + this.yearMonth
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
                  this.repairmetalpurchasedetailsForm.reset()
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
                  this.repairmetalpurchasedetailsForm.reset()
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

ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}
}
