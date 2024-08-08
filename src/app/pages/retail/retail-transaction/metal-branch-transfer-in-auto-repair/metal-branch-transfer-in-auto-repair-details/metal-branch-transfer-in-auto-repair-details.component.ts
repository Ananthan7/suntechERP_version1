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
  selector: 'app-metal-branch-transfer-in-auto-repair-details',
  templateUrl: './metal-branch-transfer-in-auto-repair-details.component.html',
  styleUrls: ['./metal-branch-transfer-in-auto-repair-details.component.scss']
})
export class MetalBranchTransferInAutoRepairDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];
  tableDatas: any[] = [];
  firstTableWidth: any;
  secondTableWidth: any;
  columnheadItemDetails: any[] = ['Sr.No', 'Div', 'Description', 'Remarks', 'Pcs', 'Gr.Wt', 'Repair Type', 'Type'];
  columnheadItemDetails1: any[] = ['Comp Code', 'Description', 'Pcs', 'Size Set', 'Size Code', 'Type', 'Category', 'Shape', 'Height', 'Width', 'Length', 'Radius', 'Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2: any[] = ['SI.No', 'Tax%', 'Tax Amount'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled: boolean = true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean = true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  formattedTime: any;
  maxTime: any;
  standTime: any;
  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {

  }


  StockcodeData: MasterSearchModel = {
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
  StockcodeSelected(value: any) {
    console.log(value);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.Stockcode.setValue(value.STOCK_CODE);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.StockcodeDes.setValue(value.DESCRIPTION);
  }
  TobranchToCodeSelected(value: any) {
    console.log(value);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.to_stock_code.setValue(value.STOCK_CODE);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.to_stock_codeDesc.setValue(value.DESCRIPTION);
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  partycodeselecteddata(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.partyCode.setValue(e.ACCODE);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.partyName.setValue(e.ACCOUNT_HEAD);

  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    LOAD_ONCLICK: true,
    ORDER_TYPE: 0,
    WHERECONDITION: "@Strbranch='" + this.userbranch + "',@strUsercode= '" + this.userName + "',@stravoidforsales= 0",
    SEARCH_FIELD: "Location",
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationToCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairDetailForm.controls.locationfrom.setValue(e.Location);
  }

  diamondBranchTransferinAutoRepairDetailForm: FormGroup = this.formBuilder.group({
    Stockcode: [''],
    StockcodeDes: [''],
    to_stock_code: [''],
    to_stock_codeDesc: [''],
    bar_no: [''],
    ticket_no: [''],
    lot_no: [''],
    bar_code_pcs: [''],
    partyCode: [''],
    partyName: [''],
    locationfrom: [''],
    repair_item: [''],
    bag_no: [''],
    gst_code: [''],
    pcs: [''],
    unit_weight: [''],
    gross_weight: [''],
    stone_weight: [''],
    purity: [''],
    pure_weight: [''],
    pure_weight_2: [''],
    net_weight: [''],
    Chargable_weight: [''],
    kundan_pcs_1: [''],
    kundan_pcs_2: [''],
    carat: [''],
    making_charges_qty: [''],
    making_charges_rate: [''],
    making_charges_amt: [''],
    metal_value: [''],
    metal_value_unit: [''],
    metal_value_qty: [''],
    metal_value_rate: [''],
    metal_value_amt: [''],
    stone_value_qty: [''],
    stone_value_rate: [''],
    stone_value_amt: [''],
    wastage_per_1: [''],
    wastage_per_2: [''],
    wastage_amt: [''],
    stamp_charges_rate: [''],
    stamp_charges_amt: [''],
    kundan_value_unit: [''],
    kundan_value_qty_fc: [''],
    kundan_value_qty_cc: [''],
    kundan_value_amt: [''],
    total_value: [''],
    total_tax_rate: [''],
    total_tax_amt: [''],
    net_value: [''],
    purity_diff: [''],
    stone_diff: [''],
    total_amount: [''],
    cgst_per: [''],
    cgst_fc: [''],
    sgst_per: [''],
    sgst_fc: [''],
    igst_per: [''],
    igst_fc: [''],
    round: [''],
    total_fc: [''],
    total_cc: [''],
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  adddata() {

  }


  adddatas() {

  }

  removedata() {
    this.tableData.pop();
  }

  removedatas() {
    this.tableDatas.pop();
  }



  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }
    if (this.diamondBranchTransferinAutoRepairDetailForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    // let API = 'MetalBarcodeTransferAuto/InsertMetalBarcodeTransferAuto'

    let details = {

      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": "s",
      "STOCK_ACTION": "s",
      "STOCK_CODE": this.diamondBranchTransferinAutoRepairDetailForm.value.Stockcode,
      "SUPPLIER": this.diamondBranchTransferinAutoRepairDetailForm.value.partyCode,
      "PCS": this.diamondBranchTransferinAutoRepairDetailForm.value.pcs,
      "GROSSWT": this.diamondBranchTransferinAutoRepairDetailForm.value.gross_weight,
      "STONEWT": this.diamondBranchTransferinAutoRepairDetailForm.value.stone_weight,
      "NETWT": this.diamondBranchTransferinAutoRepairDetailForm.value.net_weight,
      "PURITY": this.diamondBranchTransferinAutoRepairDetailForm.value.purity,
      "PUREWT": this.diamondBranchTransferinAutoRepairDetailForm.value.pure_weight,
      "CHARGABLEWT": this.diamondBranchTransferinAutoRepairDetailForm.value.Chargable_weight,
      "OZWT": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "RATE_TYPE": "",
      "METAL_RATE": this.diamondBranchTransferinAutoRepairDetailForm.value.metal_value,
      "METAL_RATE_GMSFC": this.diamondBranchTransferinAutoRepairDetailForm.value.metal_value_unit,
      "METAL_RATE_GMSCC": this.diamondBranchTransferinAutoRepairDetailForm.value.metal_value_qty,
      "METALVALUEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.metal_value_rate,
      "METALVALUECC": this.diamondBranchTransferinAutoRepairDetailForm.value.metal_value_amt,
      "STONE_RATEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.stone_value_rate,
      "STONE_RATECC": 0,
      "STONEVALUEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.stone_value_amt,
      "STONEVALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.net_value,
      "NETVALUECC": 0,
      "PUDIFF": this.diamondBranchTransferinAutoRepairDetailForm.value.purity_diff,
      "STONEDIFF": this.diamondBranchTransferinAutoRepairDetailForm.value.stone_diff,
      "FROM_LOC": "",
      "TO_LOC": "",
      "STOCK_DOCDESC": this.diamondBranchTransferinAutoRepairDetailForm.value.StockcodeDes,//"string",
      "BAGNO": this.diamondBranchTransferinAutoRepairDetailForm.value.bag_no,
      "BRTSFMKGAC": "",
      "BRTSFMTLAC": "",
      "PHYSICALSTOCKAC": "",
      "PUDIFFAC": "",
      "PURCHASEAC": "",
      "PRETURNAC": "",
      "STDIFFAC": "",
      "STONEVALAC": "",
      "ADJUSTMENTAC": "",
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
      "MTL_SIZE": "",
      "MTL_COLOR": "",
      "MTL_DESIGN": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "SUPPLIERDESC": this.diamondBranchTransferinAutoRepairDetailForm.value.partyName,
      "IMPYEARMONTH": "",
      "IMPVOCTYPE": "",
      "IMPVOCNO": 0,
      "IMPBATCHNO": 0,
      "IMPMID": 0,
      "BASE_CONV_RATE": 0,
      "LOT_NO": this.diamondBranchTransferinAutoRepairDetailForm.value.lot_no,
      "BAR_NO": this.diamondBranchTransferinAutoRepairDetailForm.value.bar_no,//"string",
      "TICKET_NO": this.diamondBranchTransferinAutoRepairDetailForm.value.ticket_no,//"string",
      "TAX_AMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.total_tax_amt,
      "TAX_AMOUNTCC": 0,
      "TAX_P": this.diamondBranchTransferinAutoRepairDetailForm.value.total_tax_rate,
      "UNITWT": this.diamondBranchTransferinAutoRepairDetailForm.value.unit_weight,
      "TOTAL_AMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.total_amount,
      "TOTAL_AMOUNTCC": 0,
      "CGST_PER": this.diamondBranchTransferinAutoRepairDetailForm.value.cgst_per,
      "CGST_AMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.cgst_fc,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.diamondBranchTransferinAutoRepairDetailForm.value.sgst_per,
      "SGST_AMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.sgst_fc,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.diamondBranchTransferinAutoRepairDetailForm.value.igst_per,
      "IGST_AMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.igst_fc,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "",
      "SGST_ACCODE": "",
      "IGST_ACCODE": "",
      "TO_STOCK_CODE": this.diamondBranchTransferinAutoRepairDetailForm.value.to_stock_code,
      "TO_STOCK_CODE_DESC": this.diamondBranchTransferinAutoRepairDetailForm.value.to_stock_codeDesc,
      "HSN_CODE": "",
      "GST_CODE": this.diamondBranchTransferinAutoRepairDetailForm.value.gst_code,
      "WASTAGEPER": this.diamondBranchTransferinAutoRepairDetailForm.value.wastage_per_1,
      "WASTAGEQTY": this.diamondBranchTransferinAutoRepairDetailForm.value.wastage_per_2,
      "WASTAGEAMOUNTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.wastage_amt,
      "WASTAGEAMOUNTCC": 0,
      "WASTAGE_PURITY": 0,
      "GST_ROUNDOFFFC": this.diamondBranchTransferinAutoRepairDetailForm.value.round,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "",
      "KUNDAN_PCS": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_pcs_1,
      "KUNDAN_CARAT": this.diamondBranchTransferinAutoRepairDetailForm.value.carat,
      "KUNDAN_WEIGHT": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_pcs_2,
      "KUNDANVALUEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_value_unit,
      "KUNDANVALUECC": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_value_qty_fc,
      "KUNDAN_UNIT": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_value_qty_cc,
      "KUNDAN_RATEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.kundan_value_amt,
      "KUNDAN_RATECC": 0,
      "BATCHSRNO": 0,
      "BARCODEDPCS": this.diamondBranchTransferinAutoRepairDetailForm.value.bar_code_pcs,
      "BARCODEDQTY": 0,
      "BAGREMARKS": "",
      "REPAIRITEM": this.diamondBranchTransferinAutoRepairDetailForm.value.repair_item,
      "STAMPCHARGE": true,
      "STAMPCHARGE_RATEFC": this.diamondBranchTransferinAutoRepairDetailForm.value.stamp_charges_rate,
      "STAMPCHARGE_RATECC": 0,
      "STAMPCHARGE_AMTFC": this.diamondBranchTransferinAutoRepairDetailForm.value.stamp_charges_amt,
      "STAMPCHARGE_AMTCC": 0,
      "SORDER_REF": "",
      "SORDER_MID": 0,
      "ORDER_STATUS": true

    }
    console.log(details);
    this.close(details);
  }

  updateMeltingType() {

  }
  /**USE: delete Melting Type From Row */
  deleteMeltingType() {

  }



  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData() {


  }

}
