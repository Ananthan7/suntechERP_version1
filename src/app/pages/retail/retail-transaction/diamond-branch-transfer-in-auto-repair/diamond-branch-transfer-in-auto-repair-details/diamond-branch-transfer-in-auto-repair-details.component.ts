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

  diamondBranchTransferInAutoRepairDetails: FormGroup = this.formBuilder.group(
    {}
  );

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
      "STOCK_DOCDESC": "string",
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
  
    let API = 'MetalTransfer/UpdateMetalTransfer/'+ this.diamondBranchTransferInAutoRepairDetails.value.branchCode + this.diamondBranchTransferInAutoRepairDetails.value.voctype + this.diamondBranchTransferInAutoRepairDetails.value.vocno + this.diamondBranchTransferInAutoRepairDetails.value.yearMonth
    let postData = {
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
        let API = 'MetalTransfer/DeleteMetalTransfer/' + this.diamondBranchTransferInAutoRepairDetails.value.branchCode + this.diamondBranchTransferInAutoRepairDetails.value.voctype + this.diamondBranchTransferInAutoRepairDetails.value.vocno + this.diamondBranchTransferInAutoRepairDetails.value.yearMonth
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

