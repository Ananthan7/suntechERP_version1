import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-cost-centre-metal-details',
  templateUrl: './cost-centre-metal-details.component.html',
  styleUrls: ['./cost-centre-metal-details.component.scss']
})
export class CostCentreMetalDetailsComponent implements OnInit {
  divisionMS: any = 'ID';
  @Input() content!: any; 
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  branchCode?: String;
  userbranch = localStorage.getItem('userbranch');

  constructor(
    private activeModal: NgbActiveModal,
    private modalService : NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  continue(){}

  costcenterdiamonddetailsForm: FormGroup = this.formBuilder.group({
    branch:[''],
    purchase:[''],
    purchaseReturn:[''],
    importPurchase:[''],
    importPurchaseReturn:[''],
    repairPurchase:[''],
    repairPurchaseReturn:[''],
    Wholesales:[''],
    wholesalesReturn:[''],
    exportSales:[''],
    exportSalesReturn:[''],
    repairSale:[''],
    retailSales:[''],
    retailSalesReturn:[''],
    exhibitionSales:[''],
    exhibitionSalesReturn:[''],
    repairSalesReturn:[''],
    ownStockOpening:[''],
    ownStock:[''],
    physicalStock:[''],
    ownStockClosing:[''],
    stkRevalue:[''],
    branchTransferIn:[''],
    branchTransferOUT:[''],
    manufacture:[''],
    dismatling:[''],
    adjustments:[''],
    refiningCharges:[''],
    metalDiscount:[''],
    SOHManufacturing:[''],
    dismantlingLoss:[''],
    diapurchaseAccountUnFix:[''],
    diaSaleAccountUnFix:[''],
    wastage:[''],
    repairUnfixPurchase:[''],
    refineCharges:[''],
    unFixPurCtrlAc:[''],
    unFixSupCtrlAc:[''],
    unFixSalCtrlAc:[''],
    unFixCustCtrlAc:[''],
    purchaseAc:[''],
    reciptAc:[''],
    salesAc:[''],
    paymentAc:[''],
  })

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  purchaseCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'ACCODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE = '"+ this.userbranch+"' AND  AC_OnHold = 0 and ACCOUNT_MODE in('G','L')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  branchCodeSelected(data: any) {
    console.log(data); 
    this.costcenterdiamonddetailsForm.controls.branch.setValue(data.BRANCH_CODE)
  }

  purchaseCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.purchase.setValue(e.ACCODE);    
  }

  purchaseReturnCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.purchaseReturn.setValue(e.ACCODE);
  }

  purchaseImportCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.importPurchase.setValue(e.ACCODE);
  }

  importPurchaseReturnCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.importPurchaseReturn.setValue(e.ACCODE);
  }
  
  repairPurchaseCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.repairPurchase.setValue(e.ACCODE);
  }

  repairPurchaseReturnCodeSelected(e:any){
    console.log(e); 
    this.costcenterdiamonddetailsForm.controls.repairPurchaseReturn.setValue(e.ACCODE);
  }

  wholesalesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.Wholesales.setValue(e.ACCODE);
  }

  wholesalesReturnCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.wholesalesReturn.setValue(e.ACCODE);
  }

  exportSalesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.exportSales.setValue(e.ACCODE);
  }

  exportSalesReturnCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.exportSalesReturn.setValue(e.ACCODE);
  }

  repairSaleCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.repairSale.setValue(e.ACCODE);
  }

  retailSalesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.retailSales.setValue(e.ACCODE);
  }

  retailSalesReturnCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.retailSalesReturn.setValue(e.ACCODE);

  }

  exhibitionSalesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.exhibitionSales.setValue(e.ACCODE);

  }

  exhibitionSalesReturnCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.exhibitionSalesReturn.setValue(e.ACCODE);
  }
  
  repairSalesReturnCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.repairSalesReturn.setValue(e.ACCODE);
  }

  ownStockOpeningCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.ownStockOpening.setValue(e.ACCODE);
  }

  ownStockCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.ownStock.setValue(e.ACCODE);
  }

  physicalStockCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.physicalStock.setValue(e.ACCODE);
  }

  ownStockClosingCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.ownStockClosing.setValue(e.ACCODE);
  }
  
  stkRevalueCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.stkRevalue.setValue(e.ACCODE);
  }

  branchTransferInCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.branchTransferIn.setValue(e.ACCODE);
  }

  branchTransferOUTCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.branchTransferOUT.setValue(e.ACCODE);
  }

  manufactureCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.manufacture.setValue(e.ACCODE);
  }

  dismatlingCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.dismatling.setValue(e.ACCODE);
  }

  adjustmentsCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.adjustments.setValue(e.ACCODE);
  }

  refiningChargesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.refiningCharges.setValue(e.ACCODE);
  }

  metalDiscountCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.metalDiscount.setValue(e.ACCODE);
  }

  SOHManufacturingCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.SOHManufacturing.setValue(e.ACCODE);
  }

  dismantlingLossCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.dismantlingLoss.setValue(e.ACCODE);
  }

  diapurchaseAccountUnFixCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.diapurchaseAccountUnFix.setValue(e.ACCODE);
  }

  diaSaleAccountUnFixCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.diaSaleAccountUnFix.setValue(e.ACCODE);
  }

  wastageCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.wastage.setValue(e.ACCODE);
  }

  repairUnfixPurchaseCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.repairUnfixPurchase.setValue(e.ACCODE);
  }

  refineChargesCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.refineCharges.setValue(e.ACCODE);
  }

  unFixPurCtrlAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.unFixPurCtrlAc.setValue(e.ACCODE);
  }

  unFixSupCtrlAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.unFixSupCtrlAc.setValue(e.ACCODE);
  }

  unFixSalCtrlAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.unFixSalCtrlAc.setValue(e.ACCODE);
  }

  unFixCustCtrlAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.unFixCustCtrlAc.setValue(e.ACCODE);
  }

  purchaseAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.purchaseAc.setValue(e.ACCODE);
  }

  reciptAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.reciptAc.setValue(e.ACCODE);
  }

  salesAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.salesAc.setValue(e.ACCODE);
  }

  paymentAcCodeSelected(e:any){
    console.log(e);
    this.costcenterdiamonddetailsForm.controls.paymentAc.setValue(e.ACCODE);
  }


  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.costcenterdiamonddetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CostCenterMaster/InsertCostCenterMaster'
    let postData = {
      "UNIQUE_ID": 0,
      "COST_CODE": "string",
      "TYPE": "string",
      "BRANCH_CODE": this.costcenterdiamonddetailsForm.value.branch || "",
      "ADJUSTMENT": "string",
      "SALES": this.costcenterdiamonddetailsForm.value.sales || "",
      "SALESRETURN": this.costcenterdiamonddetailsForm.value.salesreturn || "",
      "PURCHASE": this.costcenterdiamonddetailsForm.value.purchase || "",
      "PURCHASERETURN": this.costcenterdiamonddetailsForm.value.purchasereturn || "",
      "STONEVALUE": "string",
      "STONEDIFF": this.costcenterdiamonddetailsForm.value.stonediff || "",
      "PURITYDIFF": "string",
      "BRANCHTRANSFERIN": "string",
      "BRANCHTRANSFEROUT": "string",
      "MANUFACTURING": this.costcenterdiamonddetailsForm.value.manufacture || "",
      "OPENINGBALANCE": "string",
      "CLOSINGSTOCK": "string",
      "PHYSICALSTOCK": "string",
      "OPENINGOWNSTOCK": this.costcenterdiamonddetailsForm.value.opening || "",
      "CLOSINGOWNSTOCK": this.costcenterdiamonddetailsForm.value.closingstock || "",
      "OWNSTOCK": this.costcenterdiamonddetailsForm.value.ownstock || "",
      "OPENINGSTONE": "string",
      "POSSALES": "string",
      "POSSRETURN": "string",
      "EXBSALES": "string",
      "EXBSRETURN": "string",
      "EXPSALES": "string",
      "EXPSRETURN": "string",
      "SOH_GOLD_DMFG": this.costcenterdiamonddetailsForm.value.SOHmetalmanufacturing || "",
      "WASTAGE": this.costcenterdiamonddetailsForm.value.wastage || "",
      "IMPPURCHASE": "string",
      "IMPPURCHASERETURN": "string",
      "OTHERSALES": "string",
      "OTHERSRETURN": "string",
      "REFINING_CHARGEAC": "string",
      "DISCOUNTMETAL": "string",
      "STONEVALUESALES": "string",
      "SCP_ACCODE": "string",
      "SCPSR_ACCODE": "string",
      "SCS_ACCODE": "string",
      "SCSSR_ACCODE": "string",
      "STA_ACCODE": "string",
      "STASR_ACCODE": "string",
      "PTA_ACCODE": "string",
      "PTAPR_ACCODE": "string",
      "ICT_ACCODE": "string",
      "ICTRT_ACCODE": "string",
      "PTHP_ACCODE": "string",
      "PTHPR_ACCODE": "string",
      "PTHS_ACCODE": "string",
      "PTHSR_ACCODE": "string",
      "PTDP_ACCODE": "string",
      "PTDPR_ACCODE": "string",
      "PTDS_ACCODE": "string",
      "PTDSR_ACCODE": "string",
      "PTREP_ACCODE": "string",
      "PTREPR_ACCODE": "string",
      "PTRES_ACCODE": "string",
      "PTRESR_ACCODE": "string",
      "COSTADJUSTMENT": this.costcenterdiamonddetailsForm.value.costadjustment || "",
      "DISMANTLINGLOSS": this.costcenterdiamonddetailsForm.value.dismantlingloss || "",
      "DISMANTLING_ACCODE":this.costcenterdiamonddetailsForm.value.dismantling || "",
      "STOCK_REVALUATION": "string",
      "LOTMIX_ACCODE": this.costcenterdiamonddetailsForm.value.lotmixaccount || "",
      "SRNO": 0,
      "DIAPUR_UNFIX": "string",
      "DIASAL_UNFIX": "string",
      "PURCHASE_GST": "string",
      "SALES_GST": "string",
      "BRANCH_TRANSFER_GST": "string",
      "DIAPUR_UNFIX_WASTAGE": "string",
      "DIASAL_UNFIX_WASTAGE": "string",
      "DIAPUR_FIXED_GOLD": "string",
      "DIASAL_FIXED_GOLD": "string",
      "UNFIXPURCHASE": "string",
      "UNFIXSALES": "string",
      "UNFIXSUPPLIERCTRLAC": "string",
      "UNFIXCUSTOMERCTRLAC": "string",
      "REPAIRPURCHASE": this.costcenterdiamonddetailsForm.value.repairunfixpurchase || "",
      "REPPURCHASERETURN": "string",
      "REPAIRSALESRETURN": "string",
      "REPAIRSALES": "string",
      "REPUNFIXPURCHASE": "string",
      "KUNDANVALUESALES": "string",
      "KUNDANVALUEPURCHASE": "string",
      "PREMIUM_CHARGES": "string",
      "DIAPUR_UNFIX_VALUE": "string",
      "DIASAL_UNFIX_VALUE": "string",
      "OPENING_GOLD_DIAJEW": "string",
      "REFINE_CHARGES": "string",
      "WASTAGEONSALES": "string",
      "CERT_CHARGES": this.costcenterdiamonddetailsForm.value.certificationcharges || "",
      "PLATE_CHARGES": this.costcenterdiamonddetailsForm.value.platecharges || "",
      "STAMPCHARGE_PURCHASEAC": "string",
      "STAMPCHARGE_SALESAC": "string",
      "KUNDANVALUEOPENING": "string",
      "DIAPUR_UNFIX_LOOSE": "string",
      "DIAPUR_UNFIX_COLOR": "string",
      "DIAPUR_UNFIX_PEARL": "string",
      "DIAPUR_UNFIX_LABOUR": "string",
      "DIASAL_UNFIX_LOOSE": "string",
      "DIASAL_UNFIX_COLOR": "string",
      "DIASAL_UNFIX_PEARL": "string",
      "DIASAL_UNFIX_LABOUR": "string",
      "CUSTOM_ACCODE": this.costcenterdiamonddetailsForm.value.customaccount || "",
      "BRIN_UNFIX_GOLD": "string",
      "BROUT_UNFIX_GOLD": "string",
      "BRIN_FIX_GOLD": "string",
      "BROUT_FIX_GOLD": "string",
      "BRIN_LOOSE_STONE": "string",
      "BROUT_LOOSE_STONE": "string",
      "BRIN_COLOR_STONE": "string",
      "BROUT_COLOR_STONE": "string",
      "BRIN_PEARL_STONE": "string",
      "BROUT_PEARL_STONE": "string",
      "BRIN_WASTAGE": "string",
      "BROUT_WASTAGE": "string",
      "BRIN_LABOUR": "string",
      "BROUT_LABOUR": "string",
      "DIAIMPORTPUR_UNFIX": "string",
      "DIAIMPORTPUR_FIXED_GOLD": "string",
      "DIAIMPORTPUR_UNFIX_LOOSE": "string",
      "DIAIMPORTPUR_UNFIX_COLOR": "string",
      "DIAIMPORTPUR_UNFIX_PEARL": "string",
      "DIAIMPORTPUR_UNFIX_LABOUR": "string",
      "DIAIMPORTPUR_UNFIX_WASTAGE": "string",
      "DIAREPAIRPUR_UNFIX": "string",
      "DIAREPAIRPUR_FIXED_GOLD": "string",
      "DIAREPAIRPUR_UNFIX_LOOSE": "string",
      "DIAREPAIRPUR_UNFIX_COLOR": "string",
      "DIAREPAIRPUR_UNFIX_PEARL": "string",
      "DIAREPAIRPUR_UNFIX_LABOUR": "string",
      "DIAREPAIRPUR_UNFIX_WASTAGE": "string",
      "DIARETAILSAL_UNFIX": "string",
      "DIARETAILSAL_FIXED_GOLD": "string",
      "DIARETAILSAL_UNFIX_LOOSE": "string",
      "DIARETAILSAL_UNFIX_COLOR": "string",
      "DIARETAILSAL_UNFIX_PEARL": "string",
      "DIARETAILSAL_UNFIX_LABOUR": "string",
      "DIARETAILSAL_UNFIX_WASTAGE": "string",
      "DIAEXPORTSAL_UNFIX": "string",
      "DIAEXPORTSAL_FIXED_GOLD": "string",
      "DIAEXPORTSAL_UNFIX_LOOSE": "string",
      "DIAEXPORTSAL_UNFIX_COLOR": "string",
      "DIAEXPORTSAL_UNFIX_PEARL": "string",
      "DIAEXPORTSAL_UNFIX_LABOUR": "string",
      "DIAEXPORTSAL_UNFIX_WASTAGE": "string",
      "DIAREPAIRSAL_UNFIX": "string",
      "DIAREPAIRSAL_FIXED_GOLD": "string",
      "DIAREPAIRSAL_UNFIX_LOOSE": "string",
      "DIAREPAIRSAL_UNFIX_COLOR": "string",
      "DIAREPAIRSAL_UNFIX_PEARL": "string",
      "DIAREPAIRSAL_UNFIX_LABOUR": "string",
      "DIAREPAIRSAL_UNFIX_WASTAGE": "string",
      "DIAEXHIBITIONSAL_UNFIX": "string",
      "DIAEXHIBITIONSAL_FIXED_GOLD": "string",
      "DIAEXHIBITIONSAL_UNFIX_LOOSE": "string",
      "DIAEXHIBITIONSAL_UNFIX_COLOR": "string",
      "DIAEXHIBITIONSAL_UNFIX_PEARL": "string",
      "DIAEXHIBITIONSAL_UNFIX_LABOUR": "string",
      "DIAEXHIBITIONSAL_UNFIX_WASTAGE": "string",
      "DIAOTHERSAL_UNFIX": "string",
      "DIAOTHERSAL_FIXED_GOLD": "string",
      "DIAOTHERSAL_UNFIX_LOOSE": "string",
      "DIAOTHERSAL_UNFIX_COLOR": "string",
      "DIAOTHERSAL_UNFIX_PEARL": "string",
      "DIAOTHERSAL_UNFIX_LABOUR": "string",
      "DIAOTHERSAL_UNFIX_WASTAGE": "string",
      "RHODIUMCHGAC": "string",
      "DIA_ALTER_AC": "string",
      "SETTINGCHGAC": "string",
      "POLISHINGCHGAC": "string",
      "LABOURCHGAC": "string",
      "MISCCHGAC": "string",
      "PLATCHGAC": "string",
      "CERTCHGAC": "string"
  }
  
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                this.costcenterdiamonddetailsForm.reset()
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
  
  update(){
    if (this.costcenterdiamonddetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CostCenterMaster/UpdateCostCenterMaster/'+ this.costcenterdiamonddetailsForm.value.costcode + this.costcenterdiamonddetailsForm.value.type
    let postData = {
      "UNIQUE_ID": 0,
      "COST_CODE": "string",
      "TYPE": "string",
      "BRANCH_CODE": this.costcenterdiamonddetailsForm.value.branch || "",
      "ADJUSTMENT": "string",
      "SALES": this.costcenterdiamonddetailsForm.value.sales || "",
      "SALESRETURN": this.costcenterdiamonddetailsForm.value.salesreturn || "",
      "PURCHASE": this.costcenterdiamonddetailsForm.value.purchase || "",
      "PURCHASERETURN": this.costcenterdiamonddetailsForm.value.purchasereturn || "",
      "STONEVALUE": "string",
      "STONEDIFF": this.costcenterdiamonddetailsForm.value.stonediff || "",
      "PURITYDIFF": "string",
      "BRANCHTRANSFERIN": "string",
      "BRANCHTRANSFEROUT": "string",
      "MANUFACTURING": this.costcenterdiamonddetailsForm.value.manufacture || "",
      "OPENINGBALANCE": "string",
      "CLOSINGSTOCK": "string",
      "PHYSICALSTOCK": "string",
      "OPENINGOWNSTOCK": this.costcenterdiamonddetailsForm.value.opening || "",
      "CLOSINGOWNSTOCK": this.costcenterdiamonddetailsForm.value.closingstock || "",
      "OWNSTOCK": this.costcenterdiamonddetailsForm.value.ownstock || "",
      "OPENINGSTONE": "string",
      "POSSALES": "string",
      "POSSRETURN": "string",
      "EXBSALES": "string",
      "EXBSRETURN": "string",
      "EXPSALES": "string",
      "EXPSRETURN": "string",
      "SOH_GOLD_DMFG": this.costcenterdiamonddetailsForm.value.SOHmetalmanufacturing || "",
      "WASTAGE": this.costcenterdiamonddetailsForm.value.wastage || "",
      "IMPPURCHASE": "string",
      "IMPPURCHASERETURN": "string",
      "OTHERSALES": "string",
      "OTHERSRETURN": "string",
      "REFINING_CHARGEAC": "string",
      "DISCOUNTMETAL": "string",
      "STONEVALUESALES": "string",
      "SCP_ACCODE": "string",
      "SCPSR_ACCODE": "string",
      "SCS_ACCODE": "string",
      "SCSSR_ACCODE": "string",
      "STA_ACCODE": "string",
      "STASR_ACCODE": "string",
      "PTA_ACCODE": "string",
      "PTAPR_ACCODE": "string",
      "ICT_ACCODE": "string",
      "ICTRT_ACCODE": "string",
      "PTHP_ACCODE": "string",
      "PTHPR_ACCODE": "string",
      "PTHS_ACCODE": "string",
      "PTHSR_ACCODE": "string",
      "PTDP_ACCODE": "string",
      "PTDPR_ACCODE": "string",
      "PTDS_ACCODE": "string",
      "PTDSR_ACCODE": "string",
      "PTREP_ACCODE": "string",
      "PTREPR_ACCODE": "string",
      "PTRES_ACCODE": "string",
      "PTRESR_ACCODE": "string",
      "COSTADJUSTMENT": this.costcenterdiamonddetailsForm.value.costadjustment || "",
      "DISMANTLINGLOSS": this.costcenterdiamonddetailsForm.value.dismantlingloss || "",
      "DISMANTLING_ACCODE":this.costcenterdiamonddetailsForm.value.dismantling || "",
      "STOCK_REVALUATION": "string",
      "LOTMIX_ACCODE": this.costcenterdiamonddetailsForm.value.lotmixaccount || "",
      "SRNO": 0,
      "DIAPUR_UNFIX": "string",
      "DIASAL_UNFIX": "string",
      "PURCHASE_GST": "string",
      "SALES_GST": "string",
      "BRANCH_TRANSFER_GST": "string",
      "DIAPUR_UNFIX_WASTAGE": "string",
      "DIASAL_UNFIX_WASTAGE": "string",
      "DIAPUR_FIXED_GOLD": "string",
      "DIASAL_FIXED_GOLD": "string",
      "UNFIXPURCHASE": "string",
      "UNFIXSALES": "string",
      "UNFIXSUPPLIERCTRLAC": "string",
      "UNFIXCUSTOMERCTRLAC": "string",
      "REPAIRPURCHASE": this.costcenterdiamonddetailsForm.value.repairunfixpurchase || "",
      "REPPURCHASERETURN": "string",
      "REPAIRSALESRETURN": "string",
      "REPAIRSALES": "string",
      "REPUNFIXPURCHASE": "string",
      "KUNDANVALUESALES": "string",
      "KUNDANVALUEPURCHASE": "string",
      "PREMIUM_CHARGES": "string",
      "DIAPUR_UNFIX_VALUE": "string",
      "DIASAL_UNFIX_VALUE": "string",
      "OPENING_GOLD_DIAJEW": "string",
      "REFINE_CHARGES": "string",
      "WASTAGEONSALES": "string",
      "CERT_CHARGES": this.costcenterdiamonddetailsForm.value.certificationcharges || "",
      "PLATE_CHARGES": this.costcenterdiamonddetailsForm.value.platecharges || "",
      "STAMPCHARGE_PURCHASEAC": "string",
      "STAMPCHARGE_SALESAC": "string",
      "KUNDANVALUEOPENING": "string",
      "DIAPUR_UNFIX_LOOSE": "string",
      "DIAPUR_UNFIX_COLOR": "string",
      "DIAPUR_UNFIX_PEARL": "string",
      "DIAPUR_UNFIX_LABOUR": "string",
      "DIASAL_UNFIX_LOOSE": "string",
      "DIASAL_UNFIX_COLOR": "string",
      "DIASAL_UNFIX_PEARL": "string",
      "DIASAL_UNFIX_LABOUR": "string",
      "CUSTOM_ACCODE": this.costcenterdiamonddetailsForm.value.customaccount || "",
      "BRIN_UNFIX_GOLD": "string",
      "BROUT_UNFIX_GOLD": "string",
      "BRIN_FIX_GOLD": "string",
      "BROUT_FIX_GOLD": "string",
      "BRIN_LOOSE_STONE": "string",
      "BROUT_LOOSE_STONE": "string",
      "BRIN_COLOR_STONE": "string",
      "BROUT_COLOR_STONE": "string",
      "BRIN_PEARL_STONE": "string",
      "BROUT_PEARL_STONE": "string",
      "BRIN_WASTAGE": "string",
      "BROUT_WASTAGE": "string",
      "BRIN_LABOUR": "string",
      "BROUT_LABOUR": "string",
      "DIAIMPORTPUR_UNFIX": "string",
      "DIAIMPORTPUR_FIXED_GOLD": "string",
      "DIAIMPORTPUR_UNFIX_LOOSE": "string",
      "DIAIMPORTPUR_UNFIX_COLOR": "string",
      "DIAIMPORTPUR_UNFIX_PEARL": "string",
      "DIAIMPORTPUR_UNFIX_LABOUR": "string",
      "DIAIMPORTPUR_UNFIX_WASTAGE": "string",
      "DIAREPAIRPUR_UNFIX": "string",
      "DIAREPAIRPUR_FIXED_GOLD": "string",
      "DIAREPAIRPUR_UNFIX_LOOSE": "string",
      "DIAREPAIRPUR_UNFIX_COLOR": "string",
      "DIAREPAIRPUR_UNFIX_PEARL": "string",
      "DIAREPAIRPUR_UNFIX_LABOUR": "string",
      "DIAREPAIRPUR_UNFIX_WASTAGE": "string",
      "DIARETAILSAL_UNFIX": "string",
      "DIARETAILSAL_FIXED_GOLD": "string",
      "DIARETAILSAL_UNFIX_LOOSE": "string",
      "DIARETAILSAL_UNFIX_COLOR": "string",
      "DIARETAILSAL_UNFIX_PEARL": "string",
      "DIARETAILSAL_UNFIX_LABOUR": "string",
      "DIARETAILSAL_UNFIX_WASTAGE": "string",
      "DIAEXPORTSAL_UNFIX": "string",
      "DIAEXPORTSAL_FIXED_GOLD": "string",
      "DIAEXPORTSAL_UNFIX_LOOSE": "string",
      "DIAEXPORTSAL_UNFIX_COLOR": "string",
      "DIAEXPORTSAL_UNFIX_PEARL": "string",
      "DIAEXPORTSAL_UNFIX_LABOUR": "string",
      "DIAEXPORTSAL_UNFIX_WASTAGE": "string",
      "DIAREPAIRSAL_UNFIX": "string",
      "DIAREPAIRSAL_FIXED_GOLD": "string",
      "DIAREPAIRSAL_UNFIX_LOOSE": "string",
      "DIAREPAIRSAL_UNFIX_COLOR": "string",
      "DIAREPAIRSAL_UNFIX_PEARL": "string",
      "DIAREPAIRSAL_UNFIX_LABOUR": "string",
      "DIAREPAIRSAL_UNFIX_WASTAGE": "string",
      "DIAEXHIBITIONSAL_UNFIX": "string",
      "DIAEXHIBITIONSAL_FIXED_GOLD": "string",
      "DIAEXHIBITIONSAL_UNFIX_LOOSE": "string",
      "DIAEXHIBITIONSAL_UNFIX_COLOR": "string",
      "DIAEXHIBITIONSAL_UNFIX_PEARL": "string",
      "DIAEXHIBITIONSAL_UNFIX_LABOUR": "string",
      "DIAEXHIBITIONSAL_UNFIX_WASTAGE": "string",
      "DIAOTHERSAL_UNFIX": "string",
      "DIAOTHERSAL_FIXED_GOLD": "string",
      "DIAOTHERSAL_UNFIX_LOOSE": "string",
      "DIAOTHERSAL_UNFIX_COLOR": "string",
      "DIAOTHERSAL_UNFIX_PEARL": "string",
      "DIAOTHERSAL_UNFIX_LABOUR": "string",
      "DIAOTHERSAL_UNFIX_WASTAGE": "string",
      "RHODIUMCHGAC": "string",
      "DIA_ALTER_AC": "string",
      "SETTINGCHGAC": "string",
      "POLISHINGCHGAC": "string",
      "LABOURCHGAC": "string",
      "MISCCHGAC": "string",
      "PLATCHGAC": "string",
      "CERTCHGAC": "string"
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
                this.costcenterdiamonddetailsForm.reset()
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
    if (!this.content.MID) {
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
        let API = 'CostCenterMaster/DeleteCostCenterMaster/' + this.costcenterdiamonddetailsForm.value.costcode
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
                    this.costcenterdiamonddetailsForm.reset()
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
                    this.costcenterdiamonddetailsForm.reset()
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
