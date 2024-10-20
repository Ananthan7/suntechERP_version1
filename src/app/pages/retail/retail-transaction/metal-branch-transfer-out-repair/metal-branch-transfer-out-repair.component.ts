import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { MetalBranchTransferOutRepairDetailComponent } from './metal-branch-transfer-out-repair-detail/metal-branch-transfer-out-repair-detail.component';



@Component({
  selector: 'app-metal-branch-transfer-out-repair',
  templateUrl: './metal-branch-transfer-out-repair.component.html',
  styleUrls: ['./metal-branch-transfer-out-repair.component.scss']
})
export class MetalBranchTransferOutRepairComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];  
  metalBranchTransferOutRepairDetailsData: any[]  =[];
  columnheadItemDetails:any[] = ['Sr.Code','Stock Desc','Pcs','GrWt','St.Wt','Kun.Wt','Net.Wt','Purity','Pure Wt','Mkq.Rate','Tax%'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  selectedTabIndex = 0;
  selectedTabIndexLineItem=0;
  // setAllInitialValues: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }




  metalBranchTransferOutRepairForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocNo:[''],
    vocDate:[''],
    enteredBy:[''],
    itemCurrency:[''],
    itemCurrencyAmt:[''],
    BaseCurrency:[''],
    BaseCurrencyAmt:[''],
    transferStatus:[''],
    metalRate:[''],
    metalRateAmt:[''],
    branchToCode:[''],
    branchtoDesc:[''],
    locationTo:[''],
    returnLocation:[''],
    deliveryOn:[''],
    creditDate:[''],
    reference:[''],
    posVocNo:[''],
    posVocType:[''],
    batchSino:[''],
    batchSICode:[''],
    batchSiDes:[''],
    salesReturn:[''],
    salesTransfer:[''],
    inclusiveTax:[''],
    applyTcs:[''],
    transport:[''],
    lrNo:[''],
    vehicle:[''],
    DocReference:[''],
    stateCode:[''],
    stateDesc:[''],
    taxCode:[''],
    type:[''],
    importMBCYear:[''],
    mbcVocNo:[''],
    purityDiff:[''],
    stoneDiff:[''],
    stoneDiffNum:[''],
    narration:[''],
    totalAmount:[''],
    otherAmount:[''],
    tcsAmount:[''],
    totalGst:[''],
    roundTo:[''],
    netAmount:[''],
    netAmountLc:[''],
    driveCode:[''],
    driveCodeDes:[''],
    fixed:[''],
    creditDays:[''],
    Document:[''],
  }); 
  
  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.metalBranchTransferOutRepairForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 



  openAddDetail() {
    const modalRef: NgbModalRef = this.modalService.open(MetalBranchTransferOutRepairDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      // console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);    
        if (postData.reopen= true) {
          this.openAddDetail();
        }   
        this.metalBranchTransferOutRepairDetailsData.push(postData);

      }
    });
  }

  removedata(){

  }

  setFormValues() {
    console.log('this.content', this.content);
    if (!this.content) return
    this.metalBranchTransferOutRepairForm.controls.vocType.setValue(this.content.VOCTYPE);
    this.metalBranchTransferOutRepairForm.controls.branchCode.setValue(this.content.BRANCH_CODE);
    this.metalBranchTransferOutRepairForm.controls.vocNo.setValue(this.content.VOCNO);
    this.metalBranchTransferOutRepairForm.controls.vocDate.setValue(this.content.VOCDATE);
    this.metalBranchTransferOutRepairForm.controls.yearMonth.setValue(this.content.YEARMONTH);
    this.metalBranchTransferOutRepairForm.controls.transferStatus.setValue(this.content.TRANSFERSTATUS);
    this.metalBranchTransferOutRepairForm.controls.locationTo.setValue(this.content.TO_LOC);
    this.metalBranchTransferOutRepairForm.controls.itemCurrency.setValue(this.content.ITEM_CURRENCY);
    this.metalBranchTransferOutRepairForm.controls.itemCurrencyAmt.setValue(this.content.ITEM_CURR_RATE);
    this.metalBranchTransferOutRepairForm.controls.posVocType.setValue(this.content.TRANSVOCTYPE);
    this.metalBranchTransferOutRepairForm.controls.enteredBy.setValue(this.content.SALESPERSON_CODE);
    this.metalBranchTransferOutRepairForm.controls.deliveryOn.setValue(this.content.DELIVEREDDATE);
    this.metalBranchTransferOutRepairForm.controls.branchToCode.setValue(this.content.BRANCH_NAME);
    this.metalBranchTransferOutRepairForm.controls.branchtoDesc.setValue(this.content.TO_BRANCH_NAME);
    this.metalBranchTransferOutRepairForm.controls.posVocNo.setValue(this.content.TRANS_VOCNO);
    this.metalBranchTransferOutRepairForm.controls.creditDays.setValue(this.content.CR_DAYS);
    this.metalBranchTransferOutRepairForm.controls.reference.setValue(this.content.REFNO);
    this.metalBranchTransferOutRepairForm.controls.BaseCurrency.setValue(this.content.BASE_CURRENCY);
    this.metalBranchTransferOutRepairForm.controls.BaseCurrencyAmt.setValue(this.content.BASE_CONV_RATE);
    this.metalBranchTransferOutRepairForm.controls.stateCode.setValue(this.content.GST_STATE_CODE);
    this.metalBranchTransferOutRepairForm.controls.metalRate.setValue(this.content.METAL_TYPE);
    this.metalBranchTransferOutRepairForm.controls.metalRateAmt.setValue(this.content.METAL_TYPERATE);     
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.metalBranchTransferOutRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'RepairDelivery/InsertRepairDelivery'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.metalBranchTransferOutRepairForm.value.vocType,
      "VOCNO": this.metalBranchTransferOutRepairForm.value.vocNo,
      "VOCDATE":this.metalBranchTransferOutRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-08T09:59:42.749Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": this.metalBranchTransferOutRepairForm.value.transferStatus,
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.metalBranchTransferOutRepairForm.value.locationTo,
      "REMARKS": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-08T09:59:42.749Z",
      "ITEM_CURRENCY": this.metalBranchTransferOutRepairForm.value.itemCurrency,
      "ITEM_CURR_RATE": this.metalBranchTransferOutRepairForm.value.itemCurrencyAmt,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": this.metalBranchTransferOutRepairForm.value.posVocType,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.metalBranchTransferOutRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "DELIVEREDDATE": this.metalBranchTransferOutRepairForm.value.deliveryOn, 
      "PHYSTKTRANSTO_BR": "string",
      "OUSTATUSNEW": 0,
      "TOTAL_NETWT": 0,
      "BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchToCode,
      "TO_BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchtoDesc,
      "TRANS_VOCNO": this.metalBranchTransferOutRepairForm.value.posVocNo,
      "REF_DATE": "2024-03-08T09:59:42.749Z",
      "CR_DAYS": this.metalBranchTransferOutRepairForm.value.creditDays,
      "REFNO": this.metalBranchTransferOutRepairForm.value.reference,
      "FROM_LOC": "string",
      "SALESRETURNTRANSFER": true,
      "CMBYEAR": "string",
      "TOTAL_CHGWT": 0,
      "AUTOPOSTING": true,
      "DIVISION_CODE": "s",
      "POSTDATE": "string",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": this.metalBranchTransferOutRepairForm.value.BaseCurrency,
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": this.metalBranchTransferOutRepairForm.value.BaseCurrencyAmt,
      "HLOCTYPE_CODE": "string",
      "HLOCTYPE_TOCODE": "string",
      "DOC_REF": "string",
      "PRINT_COUNT": 0,
      "TOTAL_AMT_FC": 0,
      "TOTAL_AMT_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.metalBranchTransferOutRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "INCLUSIVE": 0,
      "TOTAL_WASTQTY": 0,
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "ROUND_VALUE_CC": 0,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO": "string",
      "LR_NO": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "TOTSTAMP_AMTFC": 0,
      "TOTSTAMP_AMTCC": 0,
      "TOTSTAMP_PARTYAMTFC": 0,
      "METAL_TYPE": this.metalBranchTransferOutRepairForm.value.metalRate,
      "METAL_TYPERATE": this.metalBranchTransferOutRepairForm.value.metalRateAmt,
      "PARTY_CODE": "string",
      "FREIGHT_RATE": 0,
      "E_INVOICE_CANCEL": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "TRANSIT_SEALNO": "string",
      "PARTY_STATE_CODE": "st",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "st",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "st",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "s",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-03-08T09:59:42.749Z",
      "VEHICLE_TYPE": "s",
      "DISPATCH_CITY": "string",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "s",
      "AIR_BILL_NO": "string",
      "GENSEQNO": 0,
      "Details": this.metalBranchTransferOutRepairDetailsData,
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == " Success ") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.close('reloadMainGrid')
              }
            });
            this.metalBranchTransferOutRepairForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    console.log(this.branchCode,'working')
    let API = `RepairDelivery/UpdateRepairDelivery/${this.branchCode}/${this.metalBranchTransferOutRepairForm.value.voctype}/${this.metalBranchTransferOutRepairForm.value.vocNo}/${this.comService.yearSelected}` ;
    let postData ={
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.metalBranchTransferOutRepairForm.value.vocType,
      "VOCNO": this.metalBranchTransferOutRepairForm.value.vocNo,
      "VOCDATE":this.metalBranchTransferOutRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-08T09:59:42.749Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": this.metalBranchTransferOutRepairForm.value.transferStatus,
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.metalBranchTransferOutRepairForm.value.locationTo,
      "REMARKS": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-08T09:59:42.749Z",
      "ITEM_CURRENCY": this.metalBranchTransferOutRepairForm.value.itemCurrency,
      "ITEM_CURR_RATE": this.metalBranchTransferOutRepairForm.value.itemCurrencyAmt,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": this.metalBranchTransferOutRepairForm.value.posVocType,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.metalBranchTransferOutRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "DELIVEREDDATE": this.metalBranchTransferOutRepairForm.value.deliveryOn, 
      "PHYSTKTRANSTO_BR": "string",
      "OUSTATUSNEW": 0,
      "TOTAL_NETWT": 0,
      "BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchToCode,
      "TO_BRANCH_NAME": this.metalBranchTransferOutRepairForm.value.branchtoDesc,
      "TRANS_VOCNO": this.metalBranchTransferOutRepairForm.value.posVocNo,
      "REF_DATE": "2024-03-08T09:59:42.749Z",
      "CR_DAYS": this.metalBranchTransferOutRepairForm.value.creditDays,
      "REFNO": this.metalBranchTransferOutRepairForm.value.reference,
      "FROM_LOC": "string",
      "SALESRETURNTRANSFER": true,
      "CMBYEAR": "string",
      "TOTAL_CHGWT": 0,
      "AUTOPOSTING": true,
      "DIVISION_CODE": "s",
      "POSTDATE": "string",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": this.metalBranchTransferOutRepairForm.value.BaseCurrency,
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": this.metalBranchTransferOutRepairForm.value.BaseCurrencyAmt,
      "HLOCTYPE_CODE": "string",
      "HLOCTYPE_TOCODE": "string",
      "DOC_REF": "string",
      "PRINT_COUNT": 0,
      "TOTAL_AMT_FC": 0,
      "TOTAL_AMT_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "TOTAL_METALVALUE_FC": 0,
      "TOTAL_METALVALUE_CC": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.metalBranchTransferOutRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": "stri",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "INCLUSIVE": 0,
      "TOTAL_WASTQTY": 0,
      "SHIPCODE": "string",
      "SHIPDESC": "string",
      "ROUND_VALUE_CC": 0,
      "TRANSPORTER_CODE": "string",
      "VEHICLE_NO": "string",
      "LR_NO": "string",
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "TCS_APPLICABLE": true,
      "TOTSTAMP_AMTFC": 0,
      "TOTSTAMP_AMTCC": 0,
      "TOTSTAMP_PARTYAMTFC": 0,
      "METAL_TYPE": this.metalBranchTransferOutRepairForm.value.metalRate,
      "METAL_TYPERATE": this.metalBranchTransferOutRepairForm.value.metalRateAmt,
      "PARTY_CODE": "string",
      "FREIGHT_RATE": 0,
      "E_INVOICE_CANCEL": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "TRANSIT_SEALNO": "string",
      "PARTY_STATE_CODE": "st",
      "SHIP_ACCODE": "string",
      "SHIP_STATE_CODE": "st",
      "DISPATCH_NAME": "string",
      "DISPATCH_ADDRESS": "string",
      "DISPATCH_STATE_CODE": "st",
      "TRANSPORTER_ID": "string",
      "TRANSPORTER_MODE": "s",
      "TRANSPORT_DISTANCE": 0,
      "TRANSPORT_DATE": "2024-03-08T09:59:42.749Z",
      "VEHICLE_TYPE": "s",
      "DISPATCH_CITY": "string",
      "DISPATCH_ZIPCODE": 0,
      "EWAY_TRANS_TYPE": "s",
      "AIR_BILL_NO": "string",
      "GENSEQNO": 0,
      "Details": this.metalBranchTransferOutRepairDetailsData,
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
                  this.metalBranchTransferOutRepairForm.reset()
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
      
  deleteMetalBranchTransferOutRepair() {
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
        let API = 'RepairDelivery/DeleteRepairDelivery/' + this.metalBranchTransferOutRepairForm.value.brnachCode + this.metalBranchTransferOutRepairForm.value.voctype + this.metalBranchTransferOutRepairForm.value.vocNo + this.metalBranchTransferOutRepairForm.value.yearMoth;
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
                    this.metalBranchTransferOutRepairForm.reset()
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
                    this.metalBranchTransferOutRepairForm.reset()
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
