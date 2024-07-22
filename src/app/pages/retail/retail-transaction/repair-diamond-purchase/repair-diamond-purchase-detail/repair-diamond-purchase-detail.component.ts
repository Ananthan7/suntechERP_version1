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
  selector: 'app-repair-diamond-purchase-detail',
  templateUrl: './repair-diamond-purchase-detail.component.html',
  styleUrls: ['./repair-diamond-purchase-detail.component.scss']
})
export class RepairDiamondPurchaseDetailComponent implements OnInit {
  @Input() content!: any;
  @Input() purchaseData!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  private subscriptions: Subscription[] = [];
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['SI.No' , 'GST_Type%' , 'GST_Type', 'Total GST'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e: any) {
    console.log(e);
    this.repairdiapurchasedetailsForm.controls.Stockdiv.setValue(e.DIVISION_CODE);
    this.repairdiapurchasedetailsForm.controls.stockcode.setValue(e.STOCK_CODE);
    this.repairdiapurchasedetailsForm.controls.stockdes.setValue(e.DESCRIPTION );
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
    this.repairdiapurchasedetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

 

  repairdiapurchasedetailsForm: FormGroup = this.formBuilder.group({
    Stockdiv: [''],
    stockcode: [''],
    stockdes: [''],
    location: [''],
    description : [''],
    hallmarking : [''],
    penalty : [''],
    metal_rate: [''],
    transaction_attribute: [''],
    Pieces : [''],
    unit_weight: [''],
    gross_weight: [''],
    stone_weight: [''],
    Purity: [''],
    pure_weight: [''],
    net_weight: [''],
    chargable_weight: [''],
    unit : [''],
    rate_1 : [''],
    amount_1 : [''],
    mrate_2: [''],
    mamount_2: [''],
    srate_3 : [''],
    samount_3 : [''],
    Pcs : [''],
    Cts : [''],
    GMS : [''],
    purity_difference: [''],
    stone_difference: [''],
    Lot_No: [''],
    rate_type : [''],
    rate_4 : [''],
    total_amount: [''],
    bar_no: [''],
    ticket_no: [''],
    declaration_no: [''],
    Re_Export_YN: [''],
    amount_4 : [''],
    rate_5 : [''],
    total_amount_2: [''],
    repair_item: [''],
    price_1 : [''],
    price_1fc : [''],
    price_1lc : [''],
    price_2 : [''],
    price_2fc : [''],
    price_2lc : [''],
    CGST : [''],
    CGST_fc : [''],
    CGST_cc : [''],
    SGST : [''],
    SGST_fc : [''],
    SGST_cc : [''],
    IGST : [''],
    IGST_fc : [''],
    IGST_cc : [''],
    round : [''],
    total : [''], 
    remarks : [''],
  });

  
  close(data?: any) {
    //TODO reset forms and data before closing
    if (this.purchaseData != null && this.purchaseData != undefined && data != null) {
      data!.isUpdate = true;
    }
    this.activeModal.close(data); 
   }
    

 
  adddata() {

   
}

adddatas() {

 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}



 
formSubmit() {

  if (this.content && this.content.FLAG == 'EDIT') {
    return
  }
  if (this.repairdiapurchasedetailsForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  // let API = 'DiamondPurchase/InsertDiamondPurchase'
  let postData = {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": this.repairdiapurchasedetailsForm.value.Stockdiv,
        "STOCK_CODE": this.repairdiapurchasedetailsForm.value.stockcode,
        "PCS": this.repairdiapurchasedetailsForm.value.Pcs,
        "GRWT": this.repairdiapurchasedetailsForm.value.gross_weight,
        "RATEFC": 0,
        "RATECC": 0,
        "VALUEFC": 0,
        "VALUECC": 0,
        "DISCPER": 0,
        "DISCAMTFC": 0,
        "DISCAMTCC": 0,
        "NETVALUEFC": 0,
        "NETVALUECC": 0,
        "LOCTYPE_CODE": this.repairdiapurchasedetailsForm.value.location,
        "SUPPLIER": "string",
        "STOCK_DOCDESC": this.repairdiapurchasedetailsForm.value.stockdes,
        "DETLINEREMARKS": "string",
        "ORDER_REF": "string",
        "REPITEMCODE": "string",
        "DCONSALLOCATIONREF": "string",
        "DCONSMKGCOST": 0,
        "DCONSLANDEDCOST": 0,
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "str",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "LOCTYPE_CODE_DESCRIPTION": "string",
        "PICTURE_PATH": "string",
        "BASE_CONV_RATE": 0,
        "AVG_WEIGHT": 0,
        "KPNUMBER": "string",
        "PARTNER_CODE": "string",
        "QUALITY_CODE": "string",
        "QUALITY_PREFIX": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SIZE": "string",
        "SHAPE": "string",
        "SIEVE": "string",
        "COST_CODE": "string",
        "PRICE1PER": this.repairdiapurchasedetailsForm.value.price_1,
        "PRICE2PER": this.repairdiapurchasedetailsForm.value.price_2,
        "PRICE3PER": "string",
        "PRICE4PER": "string",
        "PRICE5PER": "string",
        "PRICE1FC": this.repairdiapurchasedetailsForm.value.price_1fc,
        "PRICE1LC": this.repairdiapurchasedetailsForm.value.price_1lc,
        "PRICE2FC": this.repairdiapurchasedetailsForm.value.price_2fc,
        "PRICE2LC": this.repairdiapurchasedetailsForm.value.price_2lc,
        "PRICE3FC": "string",
        "PRICE3LC": "string",
        "PRICE4FC": "string",
        "PRICE4LC": "string",
        "PRICE5FC": "string",
        "PRICE5LC": "string",
        "PURITY": this.repairdiapurchasedetailsForm.value.Purity,
        "METALGROSSWT": 0,
        "DIAPCS": 0,
        "DIACARAT": 0,
        "STONEPCS": 0,
        "STONECARAT": 0,
        "NETAMOUNT": this.repairdiapurchasedetailsForm.value.net_weight,
        "WASTAGE": 0,
        "FINEGOLD": 0,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTCC": 0,
        "CGST_PER": 0,
        "CGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.CGST_fc,
        "CGST_AMOUNTCC":this.repairdiapurchasedetailsForm.value.CGST_cc,
        "SGST_PER": 0,
        "SGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.SGST_fc,
        "SGST_AMOUNTCC": this.repairdiapurchasedetailsForm.value.SGST_cc,
        "IGST_PER": 0,
        "IGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.IGST_fc,
        "IGST_AMOUNTCC":this.repairdiapurchasedetailsForm.value.IGST_cc,
        "CGST_ACCODE": this.repairdiapurchasedetailsForm.value.CGST,
        "SGST_ACCODE":this.repairdiapurchasedetailsForm.value.SGST,
        "IGST_ACCODE": this.repairdiapurchasedetailsForm.value.IGST,
        "MARGIN_PER": 0,
        "MARGIN_AMTFC": 0,
        "DT_STOCKCODE": "string",
        "DIARATE": 0,
        "DIAAMOUNT": 0,
        "CUST_STOCKCODE": "string",
        "CUST_PCS": 0,
        "CUST_CARAT": 0,
        "METALNETWT": 0,
        "WASTAGEAMOUNT": 0,
        "METALAMOUNT": this.repairdiapurchasedetailsForm.value.mamount_2,
        "WASTAGEAMOUNTLC": 0,
        "METALAMOUNTLC": 0,
        "CGST_CTRACCODE": "string",
        "SGST_CTRACCODE": "string",
        "IGST_CTRACCODE": "string",
        "HSN_CODE": "string",
        "TAXCODE": "string",
        "SERVICE_ACCODE": "string",
        "GST_CODE": "string",
        "MASTERFINEGOLD": 0,
        "METAL_WT": 0,
        "DECLARATIONNO": "string",
        "ORIGINAL_COUNTRY": "string",
        "DET_KPNO": "string",
        "REEXPORTYN": 0,
        "BATCHID": 0,
        "STONEAMOUNT": this.repairdiapurchasedetailsForm.value.samount_3,
        "STONEAMOUNTCC": 0,
        "MARGIN_AMTCC": 0,
        "TDS_CODE": "string",
        "TDS_PER": 0,
        "TDS_TOTALFC": 0,
        "TDS_TOTALCC": 0,
        "STONE_RATE": this.repairdiapurchasedetailsForm.value.srate_3,
        "PEARL_PCS": 0,
        "PEARL_WT": 0,
        "PEARL_RATE": 0,
        "PEARL_AMTCC": 0,
        "PEARL_AMTFC": 0,
        "LABOUR_AMOUNTFC": 0,
        "LABOUR_AMOUNTCC": 0,
        "DIAAMOUNTCC": 0,
        "CUSTOM_AMTFC": 0,
        "CUSTOM_AMTCC": 0,
        "UNQ_DESIGN_ID": "string",
        "TRANSFER_PCS": 0,
        "TRANSFER_QTY": 0,
        "DLABUNIT": 0,
        "DLABRATEFC": 0,
        "DLABRATECC": 0,
        "HALLMARKING": this.repairdiapurchasedetailsForm.value.hallmarking,
        "AMOUNTWITHOUTMAKING": 0,
        "AMOUNTWITHOUTMAKINGCC": 0,
        "MAKINGVATAMOUNT": 0,
        "MAKINGVATAMOUNTCC": 0,
        "ORDER_STATUS": 0
      }
    

  // let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
  //   .subscribe((result) => {
  //     if (result.response) {
  //       if (result.status == "Success") {
  //         Swal.fire({
  //           title: result.message || 'Success',
  //           text: '',
  //           icon: 'success',
  //           confirmButtonColor: '#336699',
  //           confirmButtonText: 'Ok'
  //         }).then((result: any) => {
  //           if (result.value) {
  //             this.repairdiapurchasedetailsForm.reset()
  //             this.tableData = []
              this.close(postData)
  //           }
  //         });
  //       }
  //     } else {
  //       this.toastr.error('Not saved')
  //     }
  //   }, err => alert(err))
  // this.subscriptions.push(Sub)

}

updateMeltingType() {
  if (this.repairdiapurchasedetailsForm.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = `DiamondPurchase/UpdateDiamondPurchase/${this.branchCode}/${this.repairdiapurchasedetailsForm.value.voc_type}/${this.repairdiapurchasedetailsForm.value.voc_no}/${this.yearMonth}`
  let postData = {
    "UNIQUEID": 0,
    "SRNO": 0,
    "DIVISION_CODE": this.repairdiapurchasedetailsForm.value.Stockdiv,
    "STOCK_CODE": this.repairdiapurchasedetailsForm.value.stockcode,
    "PCS": this.repairdiapurchasedetailsForm.value.Pcs,
    "GRWT": this.repairdiapurchasedetailsForm.value.gross_weight,
    "RATEFC": 0,
    "RATECC": 0,
    "VALUEFC": 0,
    "VALUECC": 0,
    "DISCPER": 0,
    "DISCAMTFC": 0,
    "DISCAMTCC": 0,
    "NETVALUEFC": 0,
    "NETVALUECC": 0,
    "LOCTYPE_CODE": this.repairdiapurchasedetailsForm.value.location,
    "SUPPLIER": "string",
    "STOCK_DOCDESC": this.repairdiapurchasedetailsForm.value.stockdes,
    "DETLINEREMARKS": "string",
    "ORDER_REF": "string",
    "REPITEMCODE": "string",
    "DCONSALLOCATIONREF": "string",
    "DCONSMKGCOST": 0,
    "DCONSLANDEDCOST": 0,
    "DT_BRANCH_CODE": "string",
    "DT_VOCTYPE": "str",
    "DT_VOCNO": 0,
    "DT_YEARMONTH": "string",
    "LOCTYPE_CODE_DESCRIPTION": "string",
    "PICTURE_PATH": "string",
    "BASE_CONV_RATE": 0,
    "AVG_WEIGHT": 0,
    "KPNUMBER": "string",
    "PARTNER_CODE": "string",
    "QUALITY_CODE": "string",
    "QUALITY_PREFIX": "string",
    "COLOR": "string",
    "CLARITY": "string",
    "SIZE": "string",
    "SHAPE": "string",
    "SIEVE": "string",
    "COST_CODE": "string",
    "PRICE1PER": this.repairdiapurchasedetailsForm.value.price_1,
    "PRICE2PER": this.repairdiapurchasedetailsForm.value.price_2,
    "PRICE3PER": "string",
    "PRICE4PER": "string",
    "PRICE5PER": "string",
    "PRICE1FC": this.repairdiapurchasedetailsForm.value.price_1fc,
    "PRICE1LC": this.repairdiapurchasedetailsForm.value.price_1lc,
    "PRICE2FC": this.repairdiapurchasedetailsForm.value.price_2fc,
    "PRICE2LC": this.repairdiapurchasedetailsForm.value.price_2lc,
    "PRICE3FC": "string",
    "PRICE3LC": "string",
    "PRICE4FC": "string",
    "PRICE4LC": "string",
    "PRICE5FC": "string",
    "PRICE5LC": "string",
    "PURITY": this.repairdiapurchasedetailsForm.value.Purity,
    "METALGROSSWT": 0,
    "DIAPCS": 0,
    "DIACARAT": 0,
    "STONEPCS": 0,
    "STONECARAT": 0,
    "NETAMOUNT": this.repairdiapurchasedetailsForm.value.net_weight,
    "WASTAGE": 0,
    "FINEGOLD": 0,
    "TOTAL_AMOUNTFC": 0,
    "TOTAL_AMOUNTCC": 0,
    "CGST_PER": 0,
    "CGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.CGST_fc,
    "CGST_AMOUNTCC":this.repairdiapurchasedetailsForm.value.CGST_cc,
    "SGST_PER": 0,
    "SGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.SGST_fc,
    "SGST_AMOUNTCC": this.repairdiapurchasedetailsForm.value.SGST_cc,
    "IGST_PER": 0,
    "IGST_AMOUNTFC": this.repairdiapurchasedetailsForm.value.IGST_fc,
    "IGST_AMOUNTCC":this.repairdiapurchasedetailsForm.value.IGST_cc,
    "CGST_ACCODE": this.repairdiapurchasedetailsForm.value.CGST,
    "SGST_ACCODE":this.repairdiapurchasedetailsForm.value.SGST,
    "IGST_ACCODE": this.repairdiapurchasedetailsForm.value.IGST,
    "MARGIN_PER": 0,
    "MARGIN_AMTFC": 0,
    "DT_STOCKCODE": "string",
    "DIARATE": 0,
    "DIAAMOUNT": 0,
    "CUST_STOCKCODE": "string",
    "CUST_PCS": 0,
    "CUST_CARAT": 0,
    "METALNETWT": 0,
    "WASTAGEAMOUNT": 0,
    "METALAMOUNT": this.repairdiapurchasedetailsForm.value.mamount_2,
    "WASTAGEAMOUNTLC": 0,
    "METALAMOUNTLC": 0,
    "CGST_CTRACCODE": "string",
    "SGST_CTRACCODE": "string",
    "IGST_CTRACCODE": "string",
    "HSN_CODE": "string",
    "TAXCODE": "string",
    "SERVICE_ACCODE": "string",
    "GST_CODE": "string",
    "MASTERFINEGOLD": 0,
    "METAL_WT": 0,
    "DECLARATIONNO": "string",
    "ORIGINAL_COUNTRY": "string",
    "DET_KPNO": "string",
    "REEXPORTYN": 0,
    "BATCHID": 0,
    "STONEAMOUNT": this.repairdiapurchasedetailsForm.value.samount_3,
    "STONEAMOUNTCC": 0,
    "MARGIN_AMTCC": 0,
    "TDS_CODE": "string",
    "TDS_PER": 0,
    "TDS_TOTALFC": 0,
    "TDS_TOTALCC": 0,
    "STONE_RATE": this.repairdiapurchasedetailsForm.value.srate_3,
    "PEARL_PCS": 0,
    "PEARL_WT": 0,
    "PEARL_RATE": 0,
    "PEARL_AMTCC": 0,
    "PEARL_AMTFC": 0,
    "LABOUR_AMOUNTFC": 0,
    "LABOUR_AMOUNTCC": 0,
    "DIAAMOUNTCC": 0,
    "CUSTOM_AMTFC": 0,
    "CUSTOM_AMTCC": 0,
    "UNQ_DESIGN_ID": "string",
    "TRANSFER_PCS": 0,
    "TRANSFER_QTY": 0,
    "DLABUNIT": 0,
    "DLABRATEFC": 0,
    "DLABRATECC": 0,
    "HALLMARKING": this.repairdiapurchasedetailsForm.value.hallmarking,
    "AMOUNTWITHOUTMAKING": 0,
    "AMOUNTWITHOUTMAKINGCC": 0,
    "MAKINGVATAMOUNT": 0,
    "MAKINGVATAMOUNTCC": 0,
    "ORDER_STATUS": 0
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
              this.repairdiapurchasedetailsForm.reset()
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
      let API = 'DiamondPurchase/DeleteDiamondPurchase/' + this.branchCode + this.repairdiapurchasedetailsForm.value.voc_type + this.repairdiapurchasedetailsForm.value.voc_no + this.yearMonth
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
                  this.repairdiapurchasedetailsForm.reset()
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
                  this.repairdiapurchasedetailsForm.reset()
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
