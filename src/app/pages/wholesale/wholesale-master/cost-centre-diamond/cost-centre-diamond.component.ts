import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CostCentreDiamondDetailsComponent } from './cost-centre-diamond-details/cost-centre-diamond-details.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cost-centre-diamond',
  templateUrl: './cost-centre-diamond.component.html',
  styleUrls: ['./cost-centre-diamond.component.scss']
})
export class CostCentreDiamondComponent implements OnInit {

  @Input() content!: any;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];

  columnhead:any[] = ['Division','Description'];
  columnheader:any[] = ['UNIQUE_ID','COST_CODE' ,'TYPE','BRANCH_CODE','ADJUSTMENT','SALES','SALESRETURN','PURCHASE','PURCHASERETURN','STONEVALUE','STONEDIFF','PURITYDIFF','BRANCHTRANSFERIN','BRANCHTRANSFERINOUT','MANUFACTURING','OPENINGBALANCE','CLOSINGSTOCK','PHYSICALSTOCK','OPENINGOWNSTOCK','CLOSINGOWNSTOCK','OWNSTOCK','OPENINGSTOCK','POSSALES','POSSRETURN','EXBSALES','EXBSRETURN','EXPSALES','EXPSRETURN','SOH_GOLD_DMFG','WASTAGE','IMPPURCHASE','IMPPURCHASERETURN','OTHERSALES','OTHERSRETURN','REFINING_CHARGEAC','DISCOUNTMETAL','STONEVALUESALES','SCP_ACCODE','SCPSR_ACCODE','SCS_ACCODE','SCSSR_ACCODE','STA_ACCODE','STASR_ACCODE','PTA_ACCODE','PTAPR_ACCODE','ICT_ACCODE','ICTRT_ACCODE','COSTADJUSTMENT','DISMANTLINGLOSS','DISMANTLING_ACCODE','PTHP_ACCODE','PTHPR_ACCODE','PTHS_ACCODE','PTHSR_ACCODE','PTDP_ACCODE','PTDPR_ACCODE','PTDS_ACCODE','PTDSR_ACCODE','PTREP_ACCODE','PTREPR_ACCODE','PTRES_ACCODE','PTRESR_ACCODE','STOCK_REVALUATION','LOTMIX_ACCODE','SRNO','CVAT_ACCODE','CVAT_PER','PREMIUM_CHARGES','DIAPUR_UNFIX','PURCHASE_GST','SALES_GST','BRANCH_TRANSFER_GST','DIAPUR_FIXED_GOLD','DIASAL_FIXED_GOLD','DIAPUR_UNFIX_WASTAGE','DIASAL_UNFIX_WASTAGE','UNFIXPURCHASE','UNFIXSALES','UNFIXSUPPLIERCTRLAC','UNFIXCUSTOMERCTRLAC','REPAIRPURCHASE','REPAIRPURCHASERETURN','REPAIRSALESRETURN','REPAIRSALES','REPUNFIXPURCHASE','KUNDANVALUESALES','KUNDANVALUEPURCHASE','DIAPUR_UNFIX_VALUE','DIASAL_UNFIX_VALUE','OPENING_GOLD_DIAJEW','REFINE_CHARGES','WASTAGEONSALES','CERT_CHARGES','PLATE_CHARGES','STAMPCHARGE_PURCHASEAC','STAMPCHARGE_SALESAC','DIAPUR_UNFIX_LOOSE','DIAPUR_UNFIX_COLOR','DIAREPAIRSAL_UNFIX_LABOUR','DIAREPAIRSAL_UNFIX_WASTAGE','DIAEXHIBITIONSAL_UNFIX','DIAEXHIBITIONSAL_FIXED_GOLD','DIAEXHIBITIONSAL_UNFIX_LOOSE','DIAEXHIBITIONSAL_UNFIX_COLOR','DIAREPAIRSAL_UNFIX_LABOUR','DIAREPAIRSAL_UNFIX_WASTAGE','DIAEXHIBITIONSAL_UNFIX','DIAEXHIBITIONSAL_FIXED_GOLD','DIAEXHIBITIONSAL_UNFIX_PEARL','DIAEXHIBITIONSAL_UNFIX_LABOUR','DIAEXHIBITIONSAL_UNFIX_WASTAGE','DIAOTHERSAL_UNFIX_LABOUR','DIAOTHERSAL_UNFIX_WASTAGE','DIA_ALTER_AC','SETTINGCHGAC','POLISHINGCHGAC','RHODIUM_UNFIX_LABOUR','HEDGESALESFIXING','HEDGEPURCHASEFIXING','HEDGEMETALPAYMENT','HEDGEMETALRECEIPT'];
  columnheaderConsignment:any[]=['Branch','Opening' ,'Purchase','Purchase','Sales (W)','Sales Return','Sales (Return)','Sales Return','Branch','Branch']
  divisionMS: any = 'ID';

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  
  costcenterdiamondForm: FormGroup = this.formBuilder.group({
    costcode: [''],
    description: [''],
    purchase: [''],
    sales: [''],
    branchtransfer: [''],

  })

  purchaseCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Purchase',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Sales',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  branchtransferCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 49,
    SEARCH_FIELD: 'GST_CODE',
    SEARCH_HEADING: 'Branch Transfer',
    SEARCH_VALUE: '',
    WHERECONDITION: "GST_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  purchaseCodeSelected(e: any) {
    console.log(e);
    this.costcenterdiamondForm.controls.purchase.setValue(e.GST_CODE);
  }

  salesCodeSelected(e: any) {
    console.log(e);
    this.costcenterdiamondForm.controls.sales.setValue(e.GST_CODE);
  }

  branchtransferDataSelected(data: any) {
    this.costcenterdiamondForm.controls.branchtransfer.setValue(data.GST_CODE)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  openCostCentreDiamond() {
    const modalRef: NgbModalRef = this.modalService.open(CostCentreDiamondDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }


  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.costcenterdiamondForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'CostCenterMaster/InsertCostCenterMaster'
    let postData = {
      "MID": 0,
      "TYPE": "string",
      "COST_CODE": this.costcenterdiamondForm.value.costcode || "",
      "COST_DESCRIPTION": this.costcenterdiamondForm.value.description || "",
      "SYSTEM_DATE": "2023-11-29T09:39:30.367Z",
      "PURCHASE_GST": this.costcenterdiamondForm.value.purchase || "",
      "SALES_GST": this.costcenterdiamondForm.value.sales || "",
      "BRANCH_TRANSFER_GST": this.costcenterdiamondForm.value.branchtransfer || "",
      "DIVISION_CODE": "string",
      "costCenterDetail": [
        {
          "UNIQUE_ID": 0,
          "COST_CODE": this.costcenterdiamondForm.value.costcode || "",
          "TYPE": "string",
          "BRANCH_CODE": "string",
          "ADJUSTMENT": "string",
          "SALES": "string",
          "SALESRETURN": "string",
          "PURCHASE": "string",
          "PURCHASERETURN": "string",
          "STONEVALUE": "string",
          "STONEDIFF": "string",
          "PURITYDIFF": "string",
          "BRANCHTRANSFERIN": "string",
          "BRANCHTRANSFEROUT": "string",
          "MANUFACTURING": "string",
          "OPENINGBALANCE": "string",
          "CLOSINGSTOCK": "string",
          "PHYSICALSTOCK": "string",
          "OPENINGOWNSTOCK": "string",
          "CLOSINGOWNSTOCK": "string",
          "OWNSTOCK": "string",
          "OPENINGSTONE": "string",
          "POSSALES": "string",
          "POSSRETURN": "string",
          "EXBSALES": "string",
          "EXBSRETURN": "string",
          "EXPSALES": "string",
          "EXPSRETURN": "string",
          "SOH_GOLD_DMFG": "string",
          "WASTAGE": "string",
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
          "COSTADJUSTMENT": "string",
          "DISMANTLINGLOSS": "string",
          "DISMANTLING_ACCODE": "string",
          "STOCK_REVALUATION": "string",
          "LOTMIX_ACCODE": "string",
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
          "REPAIRPURCHASE": "string",
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
          "CERT_CHARGES": "string",
          "PLATE_CHARGES": "string",
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
          "CUSTOM_ACCODE": "string",
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
      ]
    }

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
                this.costcenterdiamondForm.reset()
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

  update() {
    if (this.costcenterdiamondForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'CostCenterMaster/UpdateCostCenterMaster/' + this.costcenterdiamondForm.value.costcode + this.costcenterdiamondForm.value.type
    let postData = {
      "MID": 0,
      "TYPE": "string",
      "COST_CODE": this.costcenterdiamondForm.value.costcode || "",
      "COST_DESCRIPTION": this.costcenterdiamondForm.value.description || "",
      "SYSTEM_DATE": "2023-11-29T09:39:30.367Z",
      "PURCHASE_GST": this.costcenterdiamondForm.value.purchase || "",
      "SALES_GST": this.costcenterdiamondForm.value.sales || "",
      "BRANCH_TRANSFER_GST": this.costcenterdiamondForm.value.branchtransfer || "",
      "DIVISION_CODE": "string",
      "costCenterDetail": [
        {
          "UNIQUE_ID": 0,
          "COST_CODE": "string",
          "TYPE": "string",
          "BRANCH_CODE": "string",
          "ADJUSTMENT": "string",
          "SALES": "string",
          "SALESRETURN": "string",
          "PURCHASE": "string",
          "PURCHASERETURN": "string",
          "STONEVALUE": "string",
          "STONEDIFF": "string",
          "PURITYDIFF": "string",
          "BRANCHTRANSFERIN": "string",
          "BRANCHTRANSFEROUT": "string",
          "MANUFACTURING": "string",
          "OPENINGBALANCE": "string",
          "CLOSINGSTOCK": "string",
          "PHYSICALSTOCK": "string",
          "OPENINGOWNSTOCK": "string",
          "CLOSINGOWNSTOCK": "string",
          "OWNSTOCK": "string",
          "OPENINGSTONE": "string",
          "POSSALES": "string",
          "POSSRETURN": "string",
          "EXBSALES": "string",
          "EXBSRETURN": "string",
          "EXPSALES": "string",
          "EXPSRETURN": "string",
          "SOH_GOLD_DMFG": "string",
          "WASTAGE": "string",
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
          "COSTADJUSTMENT": "string",
          "DISMANTLINGLOSS": "string",
          "DISMANTLING_ACCODE": "string",
          "STOCK_REVALUATION": "string",
          "LOTMIX_ACCODE": "string",
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
          "REPAIRPURCHASE": "string",
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
          "CERT_CHARGES": "string",
          "PLATE_CHARGES": "string",
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
          "CUSTOM_ACCODE": "string",
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
                this.costcenterdiamondForm.reset()
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
        let API = 'CostCenterMaster/DeleteCostCenterMaster/' + this.costcenterdiamondForm.value.costcode
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
                    this.costcenterdiamondForm.reset()
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
                    this.costcenterdiamondForm.reset()
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
