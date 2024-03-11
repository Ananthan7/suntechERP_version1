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

 

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.metalBranchTransferOutRepairDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = {
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
    this.close(postData);
  }

  update() {}

  deleteMeltingType() {}

}
