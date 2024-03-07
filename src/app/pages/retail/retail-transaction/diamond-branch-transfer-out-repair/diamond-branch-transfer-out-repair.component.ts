import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DiamonBranchTransferOutDetailsComponent } from './diamon-branch-transfer-out-details/diamon-branch-transfer-out-details.component';

@Component({
  selector: 'app-diamond-branch-transfer-out-repair',
  templateUrl: './diamond-branch-transfer-out-repair.component.html',
  styleUrls: ['./diamond-branch-transfer-out-repair.component.scss']
})
export class DiamondBranchTransferOutRepairComponent implements OnInit {
  divisionMS: any = 'ID';
  columnheads:any[] = ['Div','St.Code','Description', 'Pcs','Gross Wt','Rate','Net AmountCC','Net AmountFC','Tot.FC','CGST'];
  columnhead :any[] = ['Col ID','Division','Cols','ColR','ColKt','Fes','Weight','Rate','Amount','Pcs','RecWeight','RecAmount','Re...','...']
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
  ) { }


  ngOnInit(): void {
  }


  diamondbranchtransoutfrom: FormGroup = this.formBuilder.group({
    voctype:['',[Validators.required]],
    vocno:['0',[Validators.required]],
    vocDate:[],
    branchto:[''],
    branchfrom:[''],
    enteredby:[''],
    itemcurrency:[''],
    itemcurrencyrate:[''],
    deliverydate:['',],
    status :[''],
    creditdays:[''],
    branchcurrency:[''],
    branchcurrencyno:[''],
    locationfrom:[''],
    locationto:[''],
    narration:[''],
    stockcode:[''],
    refno:[''],
    DPUvocno:[''],
    TCSamount:[''],
    TCSamountCC:[''],
    GSTtotal:[''],
    GSTtotalCC:[''],
    TotalPCS :[''],
    TotalSTW :[''],
    TotalPUW :[''],
    TotalOZW :[''],
    Othamount:[''],
    grosstotal:[''],
    driver:[''],
  });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  
  opendiabranchtrancoutdetails() {
    const modalRef: NgbModalRef = this.modalService.open(DiamonBranchTransferOutDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }


  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.diamondbranchtransoutfrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalTransfer/InsertMetalTransfer'
    let postData = {
      "MID": 0,
  "BRANCH_CODE": "string",
  "VOCTYPE": this.diamondbranchtransoutfrom.value.voctype,
  "VOCNO": this.diamondbranchtransoutfrom.value.vocno,
  "VOCDATE": this.diamondbranchtransoutfrom.value.vocDate,
  "VALUE_DATE": "2024-03-07T06:37:37.713Z",
  "YEARMONTH": "string",
  "TRANSFERSTATUS": "s",
  "FROM_BR": this.diamondbranchtransoutfrom.value.branchfrom,
  "TO_BR": this.diamondbranchtransoutfrom.value.branchto,
  "TO_LOC":this.diamondbranchtransoutfrom.value.locationto,
  "REMARKS": this.diamondbranchtransoutfrom.value.narration,
  "TOTAL_PCS":this.diamondbranchtransoutfrom.value.TotalPCS,
  "TOTAL_GRWT":0,
  "TOTAL_STWT": this.diamondbranchtransoutfrom.value.TotalSTW,
  "TOTAL_PUWT":this.diamondbranchtransoutfrom.value.TotalPUW,
  "TOTAL_OZWT": 0,
  "TOTAL_STONEVALUE_FC": 0,
  "TOTAL_STONEVALUE_CC": 0,
  "TOTAL_MKGVALUE_FC": 0,
  "TOTAL_MKGVALUE_CC": 0,
  "TOTAL_PUDIFF": 0,
  "TOTAL_STONEDIFF": 0,
  "SYSTEM_DATE": "2024-03-07T06:37:37.713Z",
  "ITEM_CURRENCY": this.diamondbranchtransoutfrom.value.itemcurrency,
  "ITEM_CURR_RATE": this.diamondbranchtransoutfrom.value.itemcurrencyrate,
  "TRANSREF": "string",
  "TRANSMID": 0,
  "TRANSVOCTYPE": "str",
  "NAVSEQNO": 0,
  "RATE_TYPE": "string",
  "FIXED": 0,
  "METAL_RATE": 0,
  "SCRAPTRANSFER": true,
  "SALESPERSON_CODE": "string",
  "INVREFNO": "string",
  "OUSTATUSNEW": 0,
  "DELIVEREDDATE": this.diamondbranchtransoutfrom.value.deliverydate,
  "PHYSTKTRANSTO_BR": "string",
  "TOTAL_NETWT": 0,
  "BRANCH_NAME": "string",
  "TO_BRANCH_NAME": "string",
  "TRANS_VOCNO": 0,
  "REF_DATE": "2024-03-07T06:37:37.713Z",
  "CR_DAYS": this.diamondbranchtransoutfrom.value.creditdays,
  "REFNO": this.diamondbranchtransoutfrom.value.refno,
  "FROM_LOC": this.diamondbranchtransoutfrom.value.locationfrom,
  "SALESRETURNTRANSFER": true,
  "CMBYEAR": "string",
  "TOTAL_CHGWT": 0,
  "AUTOPOSTING": true,
  "DIVISION_CODE": "s",
  "POSTDATE": "string",
  "D2DTRANSFER": "s",
  "BASE_CURRENCY": this.diamondbranchtransoutfrom.value.branchcurrency,
  "BASE_CURR_RATE": this.diamondbranchtransoutfrom.value.branchcurrencyno,
  "BASE_CONV_RATE": 0,
  "ADDL_VALUE_FC": 0,
  "ADDL_VALUE_CC": 0,
  "GROSS_VALUE_FC": 0,
  "GROSS_VALUE_CC": 0,
  "BALGRW": 0,
  "TOTALGRWTIN": 0,
  "TOTALGRWTOUT": 0,
  "TOTALPCSOUT": 0,
  "TOTALPCSIN": 0,
  "TOTALAMTFCOUT": 0,
  "TOTALAMTLCIN": 0,
  "PRINT_COUNT": 0,
  "DOC_REF": "string",
  "GST_REGISTERED": true,
  "GST_STATE_CODE": "st",
  "GST_NUMBER": "string",
  "GST_TYPE": "stri",
  "GST_TOTALFC": this.diamondbranchtransoutfrom.value.GSTtotal,
  "GST_TOTALCC": this.diamondbranchtransoutfrom.value.GSTtotalCC,
  "INCLUSIVE": true,
  "ROUND_VALUE_CC": 0,
  "TCS_ACCODE": "string",
  "TCS_AMOUNT":this.diamondbranchtransoutfrom.value.TCSamount,
  "TCS_AMOUNTCC": this.diamondbranchtransoutfrom.value.TCSamountCC,
  "AUTOENTRYPOS": true,
  "TCS_APPLICABLE": true,
  "HTUSERNAME": "string",
  "PRINT_COUNT_ACCOPY": 0,
  "PRINT_COUNT_CNTLCOPY": 0,
  "DRIVER_CODE": this.diamondbranchtransoutfrom.value.driver,
  "TRANSIT_SEALNO": "string",
  "metalTransferDetails": [
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
  ]
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
                this.diamondbranchtransoutfrom.reset()
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

  setFormValues() {
    if(!this.content) return
    console.log(this.content);    
    this.diamondbranchtransoutfrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.diamondbranchtransoutfrom.controls.vocno.setValue(this.content.VOCNO)
    this.diamondbranchtransoutfrom.controls.vocDate.setValue(this.content.VOCDATE)
    this.diamondbranchtransoutfrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.diamondbranchtransoutfrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    this.diamondbranchtransoutfrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.diamondbranchtransoutfrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.diamondbranchtransoutfrom.controls.narration.setValue(this.content.REMARKS)
  }


  update(){
    if (this.diamondbranchtransoutfrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/'+ this.diamondbranchtransoutfrom.value.branchCode + this.diamondbranchtransoutfrom.value.voctype + this.diamondbranchtransoutfrom.value.vocno + this.diamondbranchtransoutfrom.value.yearMonth
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
                this.diamondbranchtransoutfrom.reset()
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.diamondbranchtransoutfrom.value.branchCode +  this.diamondbranchtransoutfrom.value.voctype + this.diamondbranchtransoutfrom.value.vocno + this.diamondbranchtransoutfrom.value.yearMonth
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
                    this.diamondbranchtransoutfrom.reset()
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
                    this.diamondbranchtransoutfrom.reset()
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
