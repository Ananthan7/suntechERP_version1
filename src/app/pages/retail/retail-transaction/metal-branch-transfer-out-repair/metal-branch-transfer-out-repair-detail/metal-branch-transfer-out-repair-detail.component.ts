import { Component, ComponentFactory, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";
import { Code } from "angular-feather/icons";
import { AlloyAllocationComponent } from "src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component";

@Component({
  selector: "app-metal-branch-transfer-out-repair-detail",
  templateUrl: "./metal-branch-transfer-out-repair-detail.component.html",
  styleUrls: ["./metal-branch-transfer-out-repair-detail.component.scss"],
})
export class MetalBranchTransferOutRepairDetailComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = []; 
  columnheadItemDetails2: any[] = ["SI.No", "Tax%", "Tax Amount"];
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  metalBranchTransferOutRepairDetailsForm: FormGroup = this.formBuilder.group({
    stockCode:[''],
    stockCodeDes:[''],
    toStockCode:[''],
    toStockCodeDesc:[''],
    barno:[''],
    ticketNo:[''],
    lotNo:[''],
    barNo:[''],
    supplier:[''],
    supplierDesc:[''],
    LoactionFrom:[''],
    repairItem:[''],
    bagNo:[''],
    gstCode:[''],
    pieces:[''],
    unitWeight:[''],
    grossWeight:[''],
    stoneWeight:[''],
    purity:[''],
    pureWeight:[''],
    pureWeightCode:[''],
    netWeight:[''],
    chargableWeight:[''],
    kundanWt:[''],
    kundantPcs:[''],
    carat:[''],
    makingChargesQuantity:[''],
    makingChargesRate:[''],
    makingChargesAmount:[''],
    metalValueValues:[''],
    metalValueUnit:[''],
    metalValueQuantity:[''],
    metalValueRate:[''],
    metalValueAmount:[''],
    stoneValueQuantity:[''],
    stoneValueRate:[''],
    stoneValueAmount:[''],
    wastageQuantityone:[''],
    wastageQuantity:[''],
    wasteageAmount:[''],
    stampCharges:[true],
    stampChargesRate:[''],
    stampChargesAmount:[''],
    kundanValueunit:[''],
    kundanValueQuantityone:[''],
    kundanValueQuantity:[''],
    kundanValueAmount:[''],
    totalValue:[''],
    totalTaxRate:[''],
    totalTaxAmount:[''],
    netValue:[''],
    purityDiff:[''],
    stoneDiff:[''],
    totalAmount:[''],
    cgst:[''],
    cgstAmt:[''],
    sgst:[''],
    sgstAmount:[''],
    igst:[''],
    igstAmt:[''],
    round:[''],
    total:[''],
    totalRate:[''],
  });

  ngOnInit(): void {}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setFormValues() {
    console.log('this.content', this.content);
    if (!this.content) return
    this.metalBranchTransferOutRepairDetailsForm.controls.stockCodeDes.setValue(this.content.STOCK_ACTION);
    this.metalBranchTransferOutRepairDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.metalBranchTransferOutRepairDetailsForm.controls.pieces.setValue(this.content.PCS);
    this.metalBranchTransferOutRepairDetailsForm.controls.grossWeight.setValue(this.content.GROSSWT);
    this.metalBranchTransferOutRepairDetailsForm.controls.stoneWeight.setValue(this.content.STONEWT);
    this.metalBranchTransferOutRepairDetailsForm.controls.netWeight.setValue(this.content.NETWT);
    this.metalBranchTransferOutRepairDetailsForm.controls.purity.setValue(this.content.PURITY);
    this.metalBranchTransferOutRepairDetailsForm.controls.pureWeight.setValue(this.content.PUREWT);
    this.metalBranchTransferOutRepairDetailsForm.controls.chargableWeight.setValue(this.content.CHARGABLEWT);
    this.metalBranchTransferOutRepairDetailsForm.controls.metalValueUnit.setValue(this.content.METAL_RATE_GMSFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.metalValueQuantity.setValue(this.content.METAL_RATE_GMSCC);
    this.metalBranchTransferOutRepairDetailsForm.controls.metalValueRate.setValue(this.content.METALVALUEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.metalValueAmount.setValue(this.content.METALVALUECC);
    this.metalBranchTransferOutRepairDetailsForm.controls.stoneValueAmount.setValue(this.content.STONE_RATEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.stoneValueRate.setValue(this.content.STONE_RATECC);
    this.metalBranchTransferOutRepairDetailsForm.controls.stoneValueQuantity.setValue(this.content.STONEVALUEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.netValue.setValue(this.content.NETVALUEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.purityDiff.setValue(this.content.PUDIFF);
    this.metalBranchTransferOutRepairDetailsForm.controls.stoneDiff.setValue(this.content.STONEDIFF);
    this.metalBranchTransferOutRepairDetailsForm.controls.totalAmount.setValue(this.content.TOTAL_AMT);
    this.metalBranchTransferOutRepairDetailsForm.controls.totalTaxRate.setValue(this.content.TAX_AMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.totalTaxAmount.setValue(this.content.TAX_AMOUNTCC);
    this.metalBranchTransferOutRepairDetailsForm.controls.totalValue.setValue(this.content.TAX_P);
    this.metalBranchTransferOutRepairDetailsForm.controls.total.setValue(this.content.TOTAL_AMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.totalRate.setValue(this.content.TOTAL_AMOUNTCC);
    this.metalBranchTransferOutRepairDetailsForm.controls.cgst.setValue(this.content.CGST_PER);
    this.metalBranchTransferOutRepairDetailsForm.controls.cgstAmt.setValue(this.content.CGST_AMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.sgst.setValue(this.content.SGST_PER);
    this.metalBranchTransferOutRepairDetailsForm.controls.sgstAmount.setValue(this.content.SGST_AMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.igst.setValue(this.content.IGST_PER);
    this.metalBranchTransferOutRepairDetailsForm.controls.igstAmt.setValue(this.content.IGST_AMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.toStockCode.setValue(this.content.TO_STOCK_CODE);
    this.metalBranchTransferOutRepairDetailsForm.controls.toStockCodeDesc.setValue(this.content.TO_STOCK_CODE_DESC);
    this.metalBranchTransferOutRepairDetailsForm.controls.wastageQuantity.setValue(this.content.WASTAGEPER);
    this.metalBranchTransferOutRepairDetailsForm.controls.wastageQuantityone.setValue(this.content.WASTAGEQTY);
    this.metalBranchTransferOutRepairDetailsForm.controls.wasteageAmount.setValue(this.content.WASTAGEAMOUNTFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.round.setValue(this.content.GST_ROUNDOFFFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundantPcs.setValue(this.content.KUNDAN_PCS);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundanValueQuantityone.setValue(this.content.KUNDANVALUEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundanWt.setValue(this.content.KUNDAN_WEIGHT);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundanValueQuantity.setValue(this.content.KUNDANVALUECC);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundanValueunit.setValue(this.content.KUNDAN_UNIT);
    this.metalBranchTransferOutRepairDetailsForm.controls.kundanValueAmount.setValue(this.content.KUNDAN_RATEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.carat.setValue(this.content.KARAT_CODE);
    this.metalBranchTransferOutRepairDetailsForm.controls.stampCharges.setValue(this.content.STAMPCHARGE);
    this.metalBranchTransferOutRepairDetailsForm.controls.stampChargesRate.setValue(this.content.STAMPCHARGE_RATEFC);
    this.metalBranchTransferOutRepairDetailsForm.controls.stampChargesAmount.setValue(this.content.STAMPCHARGE_AMTFC);
  }

 

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.metalBranchTransferOutRepairDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'RepairDelivery/InsertRepairDelivery'
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": "s",
      "STOCK_ACTION": this.metalBranchTransferOutRepairDetailsForm.value.stockCodeDes,
      "STOCK_CODE": this.metalBranchTransferOutRepairDetailsForm.value.stockCode,
      "SUPPLIER": "string",
      "PCS": this.metalBranchTransferOutRepairDetailsForm.value.pieces,
      "GROSSWT": this.metalBranchTransferOutRepairDetailsForm.value.grossWeight,
      "STONEWT": this.metalBranchTransferOutRepairDetailsForm.value.stoneWeight,
      "NETWT": this.metalBranchTransferOutRepairDetailsForm.value.netWeight,
      "PURITY": this.metalBranchTransferOutRepairDetailsForm.value.purity,
      "PUREWT": this.metalBranchTransferOutRepairDetailsForm.value.pureWeight,
      "CHARGABLEWT": this.metalBranchTransferOutRepairDetailsForm.value.chargableWeight,
      "OZWT": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "RATE_TYPE": "string",
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueUnit,
      "METAL_RATE_GMSCC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueQuantity,
      "METALVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueRate,
      "METALVALUECC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueAmount,
      "STONE_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueAmount,
      "STONE_RATECC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueRate,
      "STONEVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueQuantity,
      "STONEVALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.netValue,
      "NETVALUECC": 0,
      "PUDIFF": this.metalBranchTransferOutRepairDetailsForm.value.purityDiff,
      "STONEDIFF": this.metalBranchTransferOutRepairDetailsForm.value.stoneDiff,
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
      "TOTAL_AMT": this.metalBranchTransferOutRepairDetailsForm.value.totalAmount,
      "SUPPLIERDESC": "string",
      "BASE_CONV_RATE": 0,
      "WORKERCODEDESC": "string",
      "LOT_NO": "string",
      "BAR_NO": "string",
      "TICKET_NO": "string",
      "TAX_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.totalTaxRate,
      "TAX_AMOUNTCC": this.metalBranchTransferOutRepairDetailsForm.value.totalTaxAmount,
      "TAX_P": this.metalBranchTransferOutRepairDetailsForm.value.totalValue,
      "UNITWT": 0,
      "TOTAL_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.total,
      "TOTAL_AMOUNTCC": this.metalBranchTransferOutRepairDetailsForm.value.totalRate,
      "CGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.cgst,
      "CGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.cgstAmt,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.sgst,
      "SGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.sgstAmount,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.igst,
      "IGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.igstAmt,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "string",
      "SGST_ACCODE": "string",
      "IGST_ACCODE": "string",
      "TO_STOCK_CODE": this.metalBranchTransferOutRepairDetailsForm.value.toStockCode,
      "TO_STOCK_CODE_DESC": this.metalBranchTransferOutRepairDetailsForm.value.toStockCodeDesc,
      "HSN_CODE": "string",
      "GST_CODE": "string",
      "WASTAGEPER": this.metalBranchTransferOutRepairDetailsForm.value.wastageQuantity,
      "WASTAGEQTY": this.metalBranchTransferOutRepairDetailsForm.value.wastageQuantityone,
      "WASTAGEAMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.wasteageAmount,
      "WASTAGEAMOUNTCC": 0,
      "WASTAGE_PURITY": 0,
      "GST_ROUNDOFFFC": this.metalBranchTransferOutRepairDetailsForm.value.round,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "string",
      "KUNDAN_PCS": this.metalBranchTransferOutRepairDetailsForm.value.kundantPcs,
      "KUNDAN_CARAT": 0,
      "KUNDAN_WEIGHT": this.metalBranchTransferOutRepairDetailsForm.value.kundanWt,
      "KUNDANVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueQuantityone,
      "KUNDANVALUECC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueQuantity,
      "KUNDAN_UNIT": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueunit,
      "KUNDAN_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueAmount,
      "KUNDAN_RATECC": 0,
      "KARAT_CODE": this.metalBranchTransferOutRepairDetailsForm.value.carat,
      "BAGREMARKS": "string",
      "REPAIRITEM": "string",
      "STAMPCHARGE": this.metalBranchTransferOutRepairDetailsForm.value.stampCharges,
      "STAMPCHARGE_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.stampChargesRate,
      "STAMPCHARGE_RATECC": 0,
      "STAMPCHARGE_AMTFC": this.metalBranchTransferOutRepairDetailsForm.value.stampChargesAmount,
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
    this.close(postData);
  }

  update() {
    console.log(this.branchCode,'working')
    let API = `RepairDelivery/UpdateRepairDelivery/${this.branchCode}/${this.metalBranchTransferOutRepairDetailsForm.value.voctype}/${this.metalBranchTransferOutRepairDetailsForm.value.vocNo}/${this.comService.yearSelected}` ;
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": "s",
      "STOCK_ACTION": this.metalBranchTransferOutRepairDetailsForm.value.stockCodeDes,
      "STOCK_CODE": this.metalBranchTransferOutRepairDetailsForm.value.stockCode,
      "SUPPLIER": "string",
      "PCS": this.metalBranchTransferOutRepairDetailsForm.value.pieces,
      "GROSSWT": this.metalBranchTransferOutRepairDetailsForm.value.grossWeight,
      "STONEWT": this.metalBranchTransferOutRepairDetailsForm.value.stoneWeight,
      "NETWT": this.metalBranchTransferOutRepairDetailsForm.value.netWeight,
      "PURITY": this.metalBranchTransferOutRepairDetailsForm.value.purity,
      "PUREWT": this.metalBranchTransferOutRepairDetailsForm.value.pureWeight,
      "CHARGABLEWT": this.metalBranchTransferOutRepairDetailsForm.value.chargableWeight,
      "OZWT": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "RATE_TYPE": "string",
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueUnit,
      "METAL_RATE_GMSCC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueQuantity,
      "METALVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueRate,
      "METALVALUECC": this.metalBranchTransferOutRepairDetailsForm.value.metalValueAmount,
      "STONE_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueAmount,
      "STONE_RATECC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueRate,
      "STONEVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.stoneValueQuantity,
      "STONEVALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.netValue,
      "NETVALUECC": 0,
      "PUDIFF": this.metalBranchTransferOutRepairDetailsForm.value.purityDiff,
      "STONEDIFF": this.metalBranchTransferOutRepairDetailsForm.value.stoneDiff,
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
      "TOTAL_AMT": this.metalBranchTransferOutRepairDetailsForm.value.totalAmount,
      "SUPPLIERDESC": "string",
      "BASE_CONV_RATE": 0,
      "WORKERCODEDESC": "string",
      "LOT_NO": "string",
      "BAR_NO": "string",
      "TICKET_NO": "string",
      "TAX_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.totalTaxRate,
      "TAX_AMOUNTCC": this.metalBranchTransferOutRepairDetailsForm.value.totalTaxAmount,
      "TAX_P": this.metalBranchTransferOutRepairDetailsForm.value.totalValue,
      "UNITWT": 0,
      "TOTAL_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.total,
      "TOTAL_AMOUNTCC": this.metalBranchTransferOutRepairDetailsForm.value.totalRate,
      "CGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.cgst,
      "CGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.cgstAmt,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.sgst,
      "SGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.sgstAmount,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.metalBranchTransferOutRepairDetailsForm.value.igst,
      "IGST_AMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.igstAmt,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "string",
      "SGST_ACCODE": "string",
      "IGST_ACCODE": "string",
      "TO_STOCK_CODE": this.metalBranchTransferOutRepairDetailsForm.value.toStockCode,
      "TO_STOCK_CODE_DESC": this.metalBranchTransferOutRepairDetailsForm.value.toStockCodeDesc,
      "HSN_CODE": "string",
      "GST_CODE": "string",
      "WASTAGEPER": this.metalBranchTransferOutRepairDetailsForm.value.wastageQuantity,
      "WASTAGEQTY": this.metalBranchTransferOutRepairDetailsForm.value.wastageQuantityone,
      "WASTAGEAMOUNTFC": this.metalBranchTransferOutRepairDetailsForm.value.wasteageAmount,
      "WASTAGEAMOUNTCC": 0,
      "WASTAGE_PURITY": 0,
      "GST_ROUNDOFFFC": this.metalBranchTransferOutRepairDetailsForm.value.round,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "string",
      "KUNDAN_PCS": this.metalBranchTransferOutRepairDetailsForm.value.kundantPcs,
      "KUNDAN_CARAT": 0,
      "KUNDAN_WEIGHT": this.metalBranchTransferOutRepairDetailsForm.value.kundanWt,
      "KUNDANVALUEFC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueQuantityone,
      "KUNDANVALUECC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueQuantity,
      "KUNDAN_UNIT": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueunit,
      "KUNDAN_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.kundanValueAmount,
      "KUNDAN_RATECC": 0,
      "KARAT_CODE": this.metalBranchTransferOutRepairDetailsForm.value.carat,
      "BAGREMARKS": "string",
      "REPAIRITEM": "string",
      "STAMPCHARGE": this.metalBranchTransferOutRepairDetailsForm.value.stampCharges,
      "STAMPCHARGE_RATEFC": this.metalBranchTransferOutRepairDetailsForm.value.stampChargesRate,
      "STAMPCHARGE_RATECC": 0,
      "STAMPCHARGE_AMTFC": this.metalBranchTransferOutRepairDetailsForm.value.stampChargesAmount,
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
                  this.metalBranchTransferOutRepairDetailsForm.reset()
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
      /**USE: delete Melting Type From Row */
      
  deleteMetalBranchTransferOutRepairDetails() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.BRANCH_CODE&&!this.content.VOCTYPE&&!this.content.VOCNO&&!this.content.YEARMONTH) {

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
        let API = 'RepairDelivery/DeleteRepairDelivery/' + this.metalBranchTransferOutRepairDetailsForm.value.brnachCode + this.metalBranchTransferOutRepairDetailsForm.value.voctype + this.metalBranchTransferOutRepairDetailsForm.value.vocNo + this.metalBranchTransferOutRepairDetailsForm.value.yearMoth;
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
                    this.metalBranchTransferOutRepairDetailsForm.reset()
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
                    this.metalBranchTransferOutRepairDetailsForm.reset()
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
}
