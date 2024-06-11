import { Component, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-gold-exchange-details',
  templateUrl: './gold-exchange-details.component.html',
  styleUrls: ['./gold-exchange-details.component.scss']
})
export class GoldExchangeDetailsComponent implements OnInit {
  @Input() content!: any; 
  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  branchCode?: String;
  yearMonth?: String;
  selected = 'gms';

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  outSideGoldCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Outside Gold',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  SupplierData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Supplier",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE = '"+ this.userbranch+"' AND AC_OnHold = 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  locCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: "LOCATION",
    SEARCH_HEADING: "Loc Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "@Strbranch='"+ this.userbranch+"',@strUsercode='"+this.userName+"',@stravoidforsales= 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  goldExchangeDetailsForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockType: [""],
    outsideGold: [false],
    goldType: [""],
    stockCodeDescription: [""],
    supplier: [""],
    locCode: [""],
    fixMetalRate:[''],
    pieces: [""],
    grossWeight: [""],
    stoneWeight: [""],
    purity: [""],
    pureWeight: [""],
    mudWeight: [""],
    netWeight: [""],
    chargableWeight: [""],
    purityDiffer: [""],
    stoneDiffer: [""],
    ozWeight: [""],
    unitCode: [""],
    unitValue: [""],
    unitRate: [""],
    unitAmount: [""],
    stoneRate: [""],
    stoneAmount: [""],
    wastagePercent: [""],
    wastageQuantity: [""],
    wastageAmount: [""],
    bagNo: [""],
    metalRate: [""],
    metalAmount: [""],
    netRate: [""],
    netAmount: [""],
    remarks: [""],
  });

  
  stockCodeSelected(e:any){
    console.log(e);    
    this.goldExchangeDetailsForm.controls.stockCode.setValue(e.DIVISION_CODE);
    this.goldExchangeDetailsForm.controls.stockType.setValue(e.STOCK_CODE);
    this.goldExchangeDetailsForm.controls.stockCodeDescription.setValue(e.DESCRIPTION);
  }

  outSideGoldSelected(e:any){
    console.log(e);
    this.goldExchangeDetailsForm.controls.goldType.setValue(e.CODE);
    
  }

  supplierSelected(e:any){
    console.log(e);
    this.goldExchangeDetailsForm.controls.supplier.setValue(e.ACCODE);

  }

  locCodeSelected(e:any){
    console.log(e);
    this.goldExchangeDetailsForm.controls.locCode.setValue(e);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setFormValues(){
    console.log('this.content', this.content);
    if (!this.content) return
    this.goldExchangeDetailsForm.controls.stockType.setValue(this.content.DIVISION_CODE);
    this.goldExchangeDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.goldExchangeDetailsForm.controls.pieces.setValue(this.content.PCS);
    this.goldExchangeDetailsForm.controls.grossWeight.setValue(this.content.GROSSWT);
    this.goldExchangeDetailsForm.controls.stoneWeight.setValue(this.content.STONEWT);
    this.goldExchangeDetailsForm.controls.netWeight.setValue(this.content.NETWT);
    this.goldExchangeDetailsForm.controls.purity.setValue(this.content.PURITY);
    this.goldExchangeDetailsForm.controls.pureWeight.setValue(this.content.PUREWT);
    this.goldExchangeDetailsForm.controls.chargableWeight.setValue(this.content.CHARGABLEWT);
    this.goldExchangeDetailsForm.controls.unitRate.setValue(this.content.MKGVALUEFC);
    this.goldExchangeDetailsForm.controls.unitAmount.setValue(this.content.MKGVALUECC);
    this.goldExchangeDetailsForm.controls.metalRate.setValue(this.content.METALVALUEFC);
    this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.content.METALVALUECC);
    this.goldExchangeDetailsForm.controls.stoneRate.setValue(this.content.STONEVALUEFC);
    this.goldExchangeDetailsForm.controls.stoneAmount.setValue(this.content.STONEVALUECC);
    this.goldExchangeDetailsForm.controls.netRate.setValue(this.content.NETVALUEFC);
    this.goldExchangeDetailsForm.controls.netAmount.setValue(this.content.NETVALUECC);
    this.goldExchangeDetailsForm.controls.purityDiffer.setValue(this.content.PUDIFF);
    this.goldExchangeDetailsForm.controls.stoneDiffer.setValue(this.content.STONEDIFF);
    this.goldExchangeDetailsForm.controls.locCode.setValue(this.content.LOCTYPE_CODE);
    this.goldExchangeDetailsForm.controls.ozWeight.setValue(this.content.OZWT);
    this.goldExchangeDetailsForm.controls.supplier.setValue(this.content.SUPPLIER);
    this.goldExchangeDetailsForm.controls.stockCodeDescription.setValue(this.content.STOCK_DOCDESC);
    this.goldExchangeDetailsForm.controls.wastagePercent.setValue(this.content.WASTAGEPER);
    this.goldExchangeDetailsForm.controls.wastageQuantity.setValue(this.content.WASTAGEQTY);
    this.goldExchangeDetailsForm.controls.wastageAmount.setValue(this.content.WASTAGEAMOUNTFC);
    this.goldExchangeDetailsForm.controls.goldType.setValue(this.content.OLD_GOLD_TYPE);
    this.goldExchangeDetailsForm.controls.outsideGold.setValue(this.content.OUTSIDEGOLD);
    this.goldExchangeDetailsForm.controls.jawaharaSelect.setValue(this.content.JAWAHARAYN);
    this.goldExchangeDetailsForm.controls.reSaleCycleSelect.setValue(this.content.RESALERECYCLE);
    this.goldExchangeDetailsForm.controls.cashExchangeSelect.setValue(this.content.CASHEXCHANGE); 
    this.goldExchangeDetailsForm.controls.remarks.setValue(this.content.D_REMARKS);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.goldExchangeDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'MetalTransfer/InsertMetalTransfer'
    let postData = {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DIVISION_CODE": this.goldExchangeDetailsForm.value.stockCode ,
          "STOCK_CODE": this.goldExchangeDetailsForm.value.stockType,
          "PCS": this.goldExchangeDetailsForm.value.pieces,
          "GROSSWT": this.goldExchangeDetailsForm.value.grossWeight,
          "STONEWT": this.goldExchangeDetailsForm.value.stoneWeight,
          "NETWT": this.goldExchangeDetailsForm.value.netWeight,
          "PURITY": this.goldExchangeDetailsForm.value.purity,
          "PUREWT": this.goldExchangeDetailsForm.value.pureWeight,
          "CHARGABLEWT": this.goldExchangeDetailsForm.value.chargableWeight,
          "MKG_RATEFC": 0,
          "MKG_RATECC": 0,
          "MKGVALUEFC": this.goldExchangeDetailsForm.value.unitRate,
          "MKGVALUECC": this.goldExchangeDetailsForm.value.unitAmount,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "METAL_RATE_GMSFC": 0,
          "METAL_RATE_GMSCC": 0,
          "METALVALUEFC": this.goldExchangeDetailsForm.value.metalRate,
          "METALVALUECC": this.goldExchangeDetailsForm.value.metalAmount,
          "STONE_RATEFC": 0,
          "STONE_RATECC": 0,
          "STONEVALUEFC": this.goldExchangeDetailsForm.value.stoneRate,
          "STONEVALUECC": this.goldExchangeDetailsForm.value.stoneAmount,
          "NETVALUEFC": this.goldExchangeDetailsForm.value.netRate,
          "NETVALUECC": this.goldExchangeDetailsForm.value.netAmount,
          "PUDIFF": this.goldExchangeDetailsForm.value.purityDiffer,
          "STONEDIFF": this.goldExchangeDetailsForm.value.stoneDiffer,
          "PONO": 0,
          "LOCTYPE_CODE": this.goldExchangeDetailsForm.value.locCode,
          "OZWT": this.goldExchangeDetailsForm.value.ozWeight,
          "SUPPLIER": this.goldExchangeDetailsForm.value.supplier,
          "BATCHSRNO": 0,
          "STOCK_DOCDESC": this.goldExchangeDetailsForm.value.stockCodeDescription,
          "BAGNO": "string",
          "BAGREMARKS": "string",
          "WASTAGEPER": this.goldExchangeDetailsForm.value.wastagePercent,
          "WASTAGEQTY": this.goldExchangeDetailsForm.value.wastageQuantity,
          "WASTAGEAMOUNTFC": this.goldExchangeDetailsForm.value.wastageAmount,
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
          "WASTAGE_PURITY": 0,
          "PUDIFF_AMTLC": 0,
          "PUDIFF_AMTFC": 0,
          "TAX_AMOUNTFC": 0,
          "TAX_AMOUNTCC": 0,
          "TAX_P": 0,
          "LOT_NO": "string",
          "BAR_NO": "string",
          "TICKET_NO": "string",
          "PENALTY": 0,
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
          "UNITWT": 0,
          "CGST_CTRLACCODE": "string",
          "SGST_CTRLACCODE": "string",
          "IGST_CTRLACCODE": "string",
          "HSN_CODE": "string",
          "GST_ROUNDOFFFC": 0,
          "GST_ROUNDOFFCC": 0,
          "ROUNDOFF_ACCODE": "string",
          "OLD_GOLD_TYPE": this.goldExchangeDetailsForm.value.goldType,
          "OUTSIDEGOLD": this.goldExchangeDetailsForm.value.outsideGold,
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
          "DECLARATIONNO": "string",
          "REEXPORTYN": 0,
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
          "PRICE1CODE": "string",
          "PRICE2CODE": "string",
          "PRICE3CODE": "string",
          "PRICE4CODE": "string",
          "PRICE5CODE": "string",
          "PRICE1_VALUECC": 0,
          "PRICE1_VALUEFC": 0,
          "PRICE2_VALUECC": 0,
          "PRICE2_VALUEFC": 0,
          "PRICE3_VALUECC": 0,
          "PRICE3_VALUEFC": 0,
          "PRICE4_VALUECC": 0,
          "PRICE4_VALUEFC": 0,
          "PRICE5_VALUECC": 0,
          "PRICE5_VALUEFC": 0,
          "MKGPREMIUMACCODE": "string",
          "DETLINEREMARKS": "string",
          "MUD_WT": 0,
          "JAWAHARAYN": this.goldExchangeDetailsForm.value.jawaharaSelect,
          "RESALERECYCLE": this.goldExchangeDetailsForm.value.reSaleCycleSelect,
          "CASHEXCHANGE": this.goldExchangeDetailsForm.value.cashExchangeSelect,
          "VATAMOUNTMETALONLYCC": 0,
          "VATAMOUNTMETALONLY": 0,
          "GST_CODE": "string",
          "HALLMARKING": "string",
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
          "STONE1": 0,
          "STONE2": 0,
          "STONE3": 0,
          "STONE4": 0,
          "RATI_PER": 0,
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
          "D_REMARKS": this.goldExchangeDetailsForm.value.remarks,
          "DONE_REEXPORTYN": true,
          "DUSTWT": 0,
          "MDESIGN_CODE": "string",
          "SALES_REF": "string",
          "SAMEBARCODEPURCHASE": 0,
          "SLIVERPURITYPER": 0
        }
        this.close(postData);
      }
      
      update(){

        if (this.goldExchangeDetailsForm.invalid) {
          this.toastr.error('select all required fields')
          return
        }
        const updateApi = 'OldGoldPurchase/UpdateMetalPurchase/'+this.branchCode+'/'+this.content.VOCTYPE+'/'+this.yearMonth
        let postData = {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DIVISION_CODE": this.goldExchangeDetailsForm.value.stockType,
          "STOCK_CODE": this.goldExchangeDetailsForm.value.stockCode,
          "PCS": this.goldExchangeDetailsForm.value.pieces,
          "GROSSWT": this.goldExchangeDetailsForm.value.grossWeight,
          "STONEWT": this.goldExchangeDetailsForm.value.stoneWeight,
          "NETWT": this.goldExchangeDetailsForm.value.netWeight,
          "PURITY": this.goldExchangeDetailsForm.value.purity,
          "PUREWT": this.goldExchangeDetailsForm.value.pureWeight,
          "CHARGABLEWT": this.goldExchangeDetailsForm.value.chargableWeight,
          "MKG_RATEFC": 0,
          "MKG_RATECC": 0,
          "MKGVALUEFC": this.goldExchangeDetailsForm.value.unitRate,
          "MKGVALUECC": this.goldExchangeDetailsForm.value.unitAmount,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "METAL_RATE_GMSFC": 0,
          "METAL_RATE_GMSCC": 0,
          "METALVALUEFC": this.goldExchangeDetailsForm.value.metalRate,
          "METALVALUECC": this.goldExchangeDetailsForm.value.metalAmount,
          "STONE_RATEFC": 0,
          "STONE_RATECC": 0,
          "STONEVALUEFC": this.goldExchangeDetailsForm.value.stoneRate,
          "STONEVALUECC": this.goldExchangeDetailsForm.value.stoneAmount,
          "NETVALUEFC": this.goldExchangeDetailsForm.value.netRate,
          "NETVALUECC": this.goldExchangeDetailsForm.value.netAmount,
          "PUDIFF": this.goldExchangeDetailsForm.value.purityDiffer,
          "STONEDIFF": this.goldExchangeDetailsForm.value.stoneDiffer,
          "PONO": 0,
          "LOCTYPE_CODE": this.goldExchangeDetailsForm.value.locCode,
          "OZWT": this.goldExchangeDetailsForm.value.ozWeight,
          "SUPPLIER": this.goldExchangeDetailsForm.value.supplier,
          "BATCHSRNO": 0,
          "STOCK_DOCDESC": this.goldExchangeDetailsForm.value.stockCodeDescription,
          "BAGNO": "string",
          "BAGREMARKS": "string",
          "WASTAGEPER": this.goldExchangeDetailsForm.value.wastagePercent,
          "WASTAGEQTY": this.goldExchangeDetailsForm.value.wastageQuantity,
          "WASTAGEAMOUNTFC": this.goldExchangeDetailsForm.value.wastageAmount,
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
          "WASTAGE_PURITY": 0,
          "PUDIFF_AMTLC": 0,
          "PUDIFF_AMTFC": 0,
          "TAX_AMOUNTFC": 0,
          "TAX_AMOUNTCC": 0,
          "TAX_P": 0,
          "LOT_NO": "string",
          "BAR_NO": "string",
          "TICKET_NO": "string",
          "PENALTY": 0,
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
          "UNITWT": 0,
          "CGST_CTRLACCODE": "string",
          "SGST_CTRLACCODE": "string",
          "IGST_CTRLACCODE": "string",
          "HSN_CODE": "string",
          "GST_ROUNDOFFFC": 0,
          "GST_ROUNDOFFCC": 0,
          "ROUNDOFF_ACCODE": "string",
          "OLD_GOLD_TYPE": this.goldExchangeDetailsForm.value.goldType,
          "OUTSIDEGOLD": this.goldExchangeDetailsForm.value.outsideGold,
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
          "DECLARATIONNO": "string",
          "REEXPORTYN": 0,
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
          "PRICE1CODE": "string",
          "PRICE2CODE": "string",
          "PRICE3CODE": "string",
          "PRICE4CODE": "string",
          "PRICE5CODE": "string",
          "PRICE1_VALUECC": 0,
          "PRICE1_VALUEFC": 0,
          "PRICE2_VALUECC": 0,
          "PRICE2_VALUEFC": 0,
          "PRICE3_VALUECC": 0,
          "PRICE3_VALUEFC": 0,
          "PRICE4_VALUECC": 0,
          "PRICE4_VALUEFC": 0,
          "PRICE5_VALUECC": 0,
          "PRICE5_VALUEFC": 0,
          "MKGPREMIUMACCODE": "string",
          "DETLINEREMARKS": "string",
          "MUD_WT": 0,
          "JAWAHARAYN": this.goldExchangeDetailsForm.value.jawaharaSelect,
          "RESALERECYCLE": this.goldExchangeDetailsForm.value.reSaleCycleSelect,
          "CASHEXCHANGE": this.goldExchangeDetailsForm.value.cashExchangeSelect,
          "VATAMOUNTMETALONLYCC": 0,
          "VATAMOUNTMETALONLY": 0,
          "GST_CODE": "string",
          "HALLMARKING": "string",
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
          "STONE1": 0,
          "STONE2": 0,
          "STONE3": 0,
          "STONE4": 0,
          "RATI_PER": 0,
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
          "D_REMARKS": this.goldExchangeDetailsForm.value.remarks,
          "DONE_REEXPORTYN": true,
          "DUSTWT": 0,
          "MDESIGN_CODE": "string",
          "SALES_REF": "string",
          "SAMEBARCODEPURCHASE": 0,
          "SLIVERPURITYPER": 0
        }
        this.close(postData);
    }
  }