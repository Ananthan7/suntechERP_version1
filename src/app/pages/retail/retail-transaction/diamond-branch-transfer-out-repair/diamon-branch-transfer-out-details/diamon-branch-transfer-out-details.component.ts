import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-diamon-branch-transfer-out-details',
  templateUrl: './diamon-branch-transfer-out-details.component.html',
  styleUrls: ['./diamon-branch-transfer-out-details.component.scss']
})
export class DiamonBranchTransferOutDetailsComponent implements OnInit {

  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService, 
  ) {}

  ngOnInit(): void {

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
    this.diamondbranchtransoutdetailForm.controls.location.setValue(e.LOCATION_CODE);
  }

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
  stockCodeSelected(e: any) {
    console.log(e);
    this.diamondbranchtransoutdetailForm.controls.stockaction.setValue(e.DIVISION_CODE);
    this.diamondbranchtransoutdetailForm.controls.stock.setValue(e.STOCK_CODE);
    this.diamondbranchtransoutdetailForm.controls.stockdes.setValue(e.DESCRIPTION);
  }


  
  diamondbranchtransoutdetailForm: FormGroup = this.formBuilder.group({
    stockaction : [""],
    stock : [""],
    stockdes : [""],
    location : [""],
    repair_item: [""],
    pieces : [""],
    gross_weight: [""],
    percentage : [""],
    amount : [""],
    rate : [""],
    total : [""],
    CGST : [""],
    CGST_per : [""],
    SGST : [""],
    SGST_per : [""],
    IGST : [""],
    IGST_per : [""],
    round : [""],
    HSNcode: [""],
    GSTcode: [""],
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.diamondbranchtransoutdetailForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'MetalTransfer/InsertMetalTransfer'
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": "s",
      "STOCK_ACTION": this.diamondbranchtransoutdetailForm.value.stockaction,
      "STOCK_CODE": this.diamondbranchtransoutdetailForm.value.stock,
      "SUPPLIER": "string",
      "PCS": 0,
      "GROSSWT": this.diamondbranchtransoutdetailForm.value.gross_weight,
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
      "FROM_LOC": this.diamondbranchtransoutdetailForm.value.location,
      "TO_LOC": "string",
      "BATCHSRNO": 0,
      "STOCK_DOCDESC": this.diamondbranchtransoutdetailForm.value.stockdes,
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
      "POSSALESVALUE": 0,
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
      "CRDAYS": "2024-03-07T06:37:37.713Z",
      "TOTAL_AMT": this.diamondbranchtransoutdetailForm.value.total,
      "SUPPLIERDESC": "string",
      "BASE_CONV_RATE": 0,
      "PCODE": "string",
      "DIFAMTCC": 0,
      "DIFAMTFC": 0,
      "SUPPLIER_REF": "string",
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTCC": 0,
      "CGST_PER": this.diamondbranchtransoutdetailForm.value.CGST_per,
      "CGST_AMOUNTFC": this.diamondbranchtransoutdetailForm.value.CGST,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": this.diamondbranchtransoutdetailForm.value.SGST_per,
      "SGST_AMOUNTFC": this.diamondbranchtransoutdetailForm.value.SGST,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": this.diamondbranchtransoutdetailForm.value.IGST_per,
      "IGST_AMOUNTFC": this.diamondbranchtransoutdetailForm.value.IGST,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "string",
      "SGST_ACCODE": "string",
      "IGST_ACCODE": "string",
      "GST_ROUNDOFFFC": 0,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "string",
      "HSN_CODE": this.diamondbranchtransoutdetailForm.value.HSNcode,
      "GST_CODE": this.diamondbranchtransoutdetailForm.value.GSTcode,
      "REPAIRITEM": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "SHAPE": "string",
      "SIEVE": "string",
      "KPNUMBER": "string",
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
      "PEARL_AMTLC": 0,
      "KARAT_CODE": "stri"
    }
  
    this.close(postData);
  }

  update(){
    if (this.diamondbranchtransoutdetailForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalTransfer/UpdateMetalTransfer/'+ this.diamondbranchtransoutdetailForm.value.branchCode + this.diamondbranchtransoutdetailForm.value.voctype + this.diamondbranchtransoutdetailForm.value.vocno + this.diamondbranchtransoutdetailForm.value.yearMonth
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
          "POSSALESVALUE": 0,
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
          "CRDAYS": "2024-03-07T06:37:37.713Z",
          "TOTAL_AMT": 0,
          "SUPPLIERDESC": "string",
          "BASE_CONV_RATE": 0,
          "PCODE": "string",
          "DIFAMTCC": 0,
          "DIFAMTFC": 0,
          "SUPPLIER_REF": "string",
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
          "GST_ROUNDOFFFC": 0,
          "GST_ROUNDOFFCC": 0,
          "ROUNDOFF_ACCODE": "string",
          "HSN_CODE": "string",
          "GST_CODE": "string",
          "REPAIRITEM": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SIZE": "string",
          "SHAPE": "string",
          "SIEVE": "string",
          "KPNUMBER": "string",
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
          "PEARL_AMTLC": 0,
          "KARAT_CODE": "stri"
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
                this.diamondbranchtransoutdetailForm.reset()
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
        let API = 'MetalTransfer/DeleteMetalTransfer/' + this.diamondbranchtransoutdetailForm.value.branchCode + this.diamondbranchtransoutdetailForm.value.voctype + this.diamondbranchtransoutdetailForm.value.vocno + this.diamondbranchtransoutdetailForm.value.yearMonth
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
                    this.diamondbranchtransoutdetailForm.reset()
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
                    this.diamondbranchtransoutdetailForm.reset()
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
