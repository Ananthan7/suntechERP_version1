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
  selector: "app-diamond-branch-transfer-in-auto-repair-details",
  templateUrl: "./diamond-branch-transfer-in-auto-repair-details.component.html",
  styleUrls: [ "./diamond-branch-transfer-in-auto-repair-details.component.scss",],
})
export class DiamondBranchTransferInAutoRepairDetailsComponent  implements OnInit {
  @Input() content!: any;
  tableData:any[]=[];
  private subscriptions: Subscription[] = [];
  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');

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

  locationCodeData: MasterSearchModel = {
    // "strBranch": "DIAMFG",
    // "strUserCode": "ADMIN",
    // "strAvoidFORSALES": "0",
    // "strFrom": "TO"

      PAGENO: 1,
      RECORDS: 10,
      LOOKUPID: 155,
      LOAD_ONCLICK: true,
      ORDER_TYPE: 0,
      WHERECONDITION: "@Strbranch='"+ this.userbranch+"',@strUsercode= '"+this.userName+"',@stravoidforsales= 0",
      SEARCH_FIELD: "Location",
      SEARCH_VALUE: "",
      VIEW_INPUT: true,
      VIEW_TABLE: true,

      // PAGENO: 1,
        // RECORDS: 10,
        // LOOKUPID: 155,
        // ORDER_TYPE: 0,
        // SEARCH_FIELD: "LOCATION",
        // SEARCH_HEADING: "Loc Code",
        // SEARCH_VALUE: "",
        // WHERECONDITION: "@Strbranch='"+ this.userbranch+"',@strUsercode='"+this.userName+"',@stravoidforsales= 0",
        // VIEW_INPUT: true,
        // VIEW_TABLE: true,

    // PAGENO: 1,
    // RECORDS: 10,
    // LOOKUPID: 155,
    // SEARCH_FIELD: 'Location',
    // SEARCH_HEADING: 'location Code',
    // SEARCH_VALUE: '',
    // WHERECONDITION: "Location<> ''",
    // VIEW_INPUT: true,
    // VIEW_TABLE: true,
  }

  

 

  diamondBranchTransferInAutoRepairDetails: FormGroup = this.formBuilder.group({
      stock:[''],
      stockCode:[''],
      stockDesc:[''],
      location:[''],
      pcs:[''],
      grossWt:[''],
      rate:[''],
      amount:[''],
      percentage:[''],
      disAmount:[''],
      netAmount:[''],
      toalAmount:[''],
      gstTotalAmount:[''],
      cgstper:[''],
      cgstAmt:[''],
      sgstPer:[''],
      sgstAmt:[''],
      igstPer:[''],
      igstAmt:[''],
      roundAmount:[''],
      totalPer:[''],
      toalAmt:[''],
      hsnCode:[''],
      gstCode:[''],

    });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  stockCodeSelected(e:any){
    console.log(e);
    this.diamondBranchTransferInAutoRepairDetails.controls.stockCode.setValue(e.STOCK_CODE)
    this.diamondBranchTransferInAutoRepairDetails.controls.stock.setValue(e.DIVISION_CODE)
    this.diamondBranchTransferInAutoRepairDetails.controls.stockDesc.setValue(e.DESCRIPTION)
  }

  locationSelected(e:any){
    this.diamondBranchTransferInAutoRepairDetails.controls.location.setValue(e.Location);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.diamondBranchTransferInAutoRepairDetails.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'MetalTransferAuto/InsertMetalTransferAuto'
    let postData = 
    {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": this.diamondBranchTransferInAutoRepairDetails.value.stock,
      "STOCK_ACTION": '',
      "STOCK_CODE": this.diamondBranchTransferInAutoRepairDetails.value.stockCode,
      "SUPPLIER": "string",
      "PCS": this.diamondBranchTransferInAutoRepairDetails.value.pcs,
      "GROSSWT": this.diamondBranchTransferInAutoRepairDetails.value.grossWt,
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
      "RATE_TYPE": this.diamondBranchTransferInAutoRepairDetails.value.rate,
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "METALVALUEFC": 0,
      "METALVALUECC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATECC": 0,
      "STONEVALUEFC": 0,
      "STONEVALUECC": 0,
      "DISCPER": this.diamondBranchTransferInAutoRepairDetails.value.percentage,
      "DISCAMTFC": this.diamondBranchTransferInAutoRepairDetails.value.disAmount,
      "DISCAMTCC": 0,
      "NETVALUEFC": this.diamondBranchTransferInAutoRepairDetails.value.netAmount,
      "NETVALUECC": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "FROM_LOC": "string",
      "TO_LOC": "string",
      "STOCK_DOCDESC": this.diamondBranchTransferInAutoRepairDetails.value.stockCode,
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
      "POSSALESVALUE": 0,
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
      "TOTAL_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.totalPer,
      "TOTAL_AMOUNTCC": this.diamondBranchTransferInAutoRepairDetails.value.toalAmt,
      "CGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.cgstper,
      "CGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.cgstAmt,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.sgstPer,
      "SGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.sgstAmt,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.igstPer,
      "IGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.igstAmt,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "string",
      "SGST_ACCODE": "string",
      "IGST_ACCODE": "string",
      "GST_ROUNDOFFFC": this.diamondBranchTransferInAutoRepairDetails.value.roundAmount,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "string",
      "HSN_CODE": this.diamondBranchTransferInAutoRepairDetails.value.hsnCode,
      "GST_CODE": this.diamondBranchTransferInAutoRepairDetails.value.gstCode,
      "REPAIRITEM": "string",
      "METALGROSSWT": 0,
      "DIAPCS": 0,
      "DIACARAT": 0,
      "MASTERDIACARAT": 0,
      "STONEPCS": 0,
      "STONECARAT": 0,
      "MASTERSTONECARAT": 0,
      "METAL_WT": 0,
      "FINEGOLD": 0,
      "MASTERFINEGOLD": 0,
      "DIAMOND_RATEFC": 0,
      "DIAMOND_RATELC": 0,
      "DIAMOND_VALUEFC": 0,
      "DIAMOND_VALUELC": 0,
      "COLORSTONE_RATEFC": 0,
      "COLORSTONE_RATELC": 0,
      "COLORSTONE_VALUEFC": 0,
      "COLORSTONE_VALUELC": 0,
      "LABOUR_CHARGEFC": 0,
      "LABOUR_CHARGELC": 0,
      "HMCHARGEFC": 0,
      "HMCHARGELC": 0,
      "CERTCHARGEFC": 0,
      "CERTCHARGELC": 0,
      "WASTAGE": 0,
      "WASTAGEPER": 0,
      "WASTAGEAMOUNTFC": 0,
      "WASTAGEAMOUNTLC": 0,
      "PEARL_PCS": 0,
      "PEARL_WT": 0,
      "PEARL_AMTFC": 0,
      "PEARL_AMTLC": 0
    }
    this.close(postData);
  }

  update(){
    if (this.diamondBranchTransferInAutoRepairDetails.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalTransferAuto/UpdateMetalTransferAuto/'+ this.diamondBranchTransferInAutoRepairDetails.value.branchCode + this.diamondBranchTransferInAutoRepairDetails.value.voctype + this.diamondBranchTransferInAutoRepairDetails.value.vocno + this.diamondBranchTransferInAutoRepairDetails.value.yearMonth
     let postData =  {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": this.diamondBranchTransferInAutoRepairDetails.value.stock,
      "STOCK_ACTION": '',
      "STOCK_CODE": this.diamondBranchTransferInAutoRepairDetails.value.stockCode,
      "SUPPLIER": "string",
      "PCS": this.diamondBranchTransferInAutoRepairDetails.value.pcs,
      "GROSSWT": this.diamondBranchTransferInAutoRepairDetails.value.grossWt,
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
      "RATE_TYPE": this.diamondBranchTransferInAutoRepairDetails.value.rate,
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "METALVALUEFC": 0,
      "METALVALUECC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATECC": 0,
      "STONEVALUEFC": 0,
      "STONEVALUECC": 0,
      "DISCPER": this.diamondBranchTransferInAutoRepairDetails.value.percentage,
      "DISCAMTFC": this.diamondBranchTransferInAutoRepairDetails.value.disAmount,
      "DISCAMTCC": 0,
      "NETVALUEFC": this.diamondBranchTransferInAutoRepairDetails.value.netAmount,
      "NETVALUECC": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "FROM_LOC": "string",
      "TO_LOC": "string",
      "STOCK_DOCDESC": this.diamondBranchTransferInAutoRepairDetails.value.stockCode,
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
      "POSSALESVALUE": 0,
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
      "TOTAL_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.totalPer,
      "TOTAL_AMOUNTCC": this.diamondBranchTransferInAutoRepairDetails.value.toalAmt,
      "CGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.cgstper,
      "CGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.cgstAmt,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.sgstPer,
      "SGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.sgstAmt,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.diamondBranchTransferInAutoRepairDetails.value.igstPer,
      "IGST_AMOUNTFC": this.diamondBranchTransferInAutoRepairDetails.value.igstAmt,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "string",
      "SGST_ACCODE": "string",
      "IGST_ACCODE": "string",
      "GST_ROUNDOFFFC": this.diamondBranchTransferInAutoRepairDetails.value.roundAmount,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "string",
      "HSN_CODE": this.diamondBranchTransferInAutoRepairDetails.value.hsnCode,
      "GST_CODE": this.diamondBranchTransferInAutoRepairDetails.value.gstCode,
      "REPAIRITEM": "string",
      "METALGROSSWT": 0,
      "DIAPCS": 0,
      "DIACARAT": 0,
      "MASTERDIACARAT": 0,
      "STONEPCS": 0,
      "STONECARAT": 0,
      "MASTERSTONECARAT": 0,
      "METAL_WT": 0,
      "FINEGOLD": 0,
      "MASTERFINEGOLD": 0,
      "DIAMOND_RATEFC": 0,
      "DIAMOND_RATELC": 0,
      "DIAMOND_VALUEFC": 0,
      "DIAMOND_VALUELC": 0,
      "COLORSTONE_RATEFC": 0,
      "COLORSTONE_RATELC": 0,
      "COLORSTONE_VALUEFC": 0,
      "COLORSTONE_VALUELC": 0,
      "LABOUR_CHARGEFC": 0,
      "LABOUR_CHARGELC": 0,
      "HMCHARGEFC": 0,
      "HMCHARGELC": 0,
      "CERTCHARGEFC": 0,
      "CERTCHARGELC": 0,
      "WASTAGE": 0,
      "WASTAGEPER": 0,
      "WASTAGEAMOUNTFC": 0,
      "WASTAGEAMOUNTLC": 0,
      "PEARL_PCS": 0,
      "PEARL_WT": 0,
      "PEARL_AMTFC": 0,
      "PEARL_AMTLC": 0
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
                this.diamondBranchTransferInAutoRepairDetails.reset()
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
        let API = 'MetalTransferAuto/DeleteMetalTransferAuto/' + this.diamondBranchTransferInAutoRepairDetails.value.branchCode + this.diamondBranchTransferInAutoRepairDetails.value.voctype + this.diamondBranchTransferInAutoRepairDetails.value.vocno + this.diamondBranchTransferInAutoRepairDetails.value.yearMonth
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
                    this.diamondBranchTransferInAutoRepairDetails.reset()
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
                    this.diamondBranchTransferInAutoRepairDetails.reset()
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

