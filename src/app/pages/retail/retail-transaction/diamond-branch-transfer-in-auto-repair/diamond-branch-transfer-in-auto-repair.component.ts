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
import { RepairDetailsComponent } from "../repair-jewellery-receipt/repair-details/repair-details.component";
import { DiamondBranchTransferInAutoRepairDetailsComponent } from "./diamond-branch-transfer-in-auto-repair-details/diamond-branch-transfer-in-auto-repair-details.component";

@Component({
  selector: "app-diamond-branch-transfer-in-auto-repair",
  templateUrl: "./diamond-branch-transfer-in-auto-repair.component.html",
  styleUrls: ["./diamond-branch-transfer-in-auto-repair.component.scss"],
})
export class DiamondBranchTransferInAutoRepairComponent implements OnInit {
  @Input() content!: any;
  selectedIndex!: number | null;
  tableData: any[] = [];
  columnheadItemDetails: any[] = [
    "Sr.No",
    "Div",
    "Description",
    "Remarks",
    "Pcs",
    "Gr.Wt",
    "Repair Type",
    "Type",
  ];
  columnheadItemDetails1: any[] = [
    "Comp Code",
    "Description",
    "Pcs",
    "Size Set",
    "Size Code",
    "Type",
    "Category",
    "Shape",
    "Height",
    "Width",
    "Length",
    "Radius",
    "Remarks",
  ];
  columnheadItemDetails2: any[] = ["Repair Narration"];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  diamondBranchTransferInAutoRepairDetailsData:any[] = [];
  private subscriptions: Subscription[] = [];

  viewMode: boolean = false;
  selectedTabIndex = 0;
  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SALES MAN ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

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

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'State Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
 

  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  diamondBranchTransferInAutoRepairForm: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocNo:[1],
    vocDate:[new Date()],
    branch:[''],
    enteredBy:[''],
    currency:[''],
    currencyAmt:[''],
    status:[''],
    creditDays:[''],
    creditDate:[''],
    location:[''],
    narration:[''],
    stateCode:[''],
    taxCode:[''],
    type:[''],
    refno:[''],
    fullChecked:[''],
    fullCheck:[''],
    dpuVocNo:[''],
    toal:[''],
    subTotal:[''],
    totalFc: [''],
    totalCss:[''],
    totalGst:[''],
    thAmtFc:[''],
    gross:[''],
    gorssTotal:[''],
  });

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.diamondBranchTransferInAutoRepairForm.controls.voctype.setValue(this.comService.getqueryParamVocType());    
    this.diamondBranchTransferInAutoRepairForm.controls.currency.setValue(this.comService.compCurrency);
    this.diamondBranchTransferInAutoRepairForm.controls.currencyAmt.setValue(this.comService.getCurrRate(this.comService.compCurrency));
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  salesManSelected(e:any){
    console.log(e);
    this.diamondBranchTransferInAutoRepairForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
  }
  
  branchCodeSelected(data: any) {
    console.log(data); 
    this.diamondBranchTransferInAutoRepairForm.controls.branch.setValue(data.BRANCH_CODE);    
  }

  stateCodeSelected(e:any){
    console.log(e);
    this.diamondBranchTransferInAutoRepairForm.controls.stateCode.setValue(e.CODE);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.diamondBranchTransferInAutoRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'MetalTransferAuto/InsertMetalTransferAuto'
    let postData = 
    {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.diamondBranchTransferInAutoRepairForm.value.voctype,
      "VOCNO": this.diamondBranchTransferInAutoRepairForm.value.vocNo,
      "VOCDATE": this.diamondBranchTransferInAutoRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-19T11:47:21.277Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": "s",
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.diamondBranchTransferInAutoRepairForm.value.location,
      "REMARKS": this.diamondBranchTransferInAutoRepairForm.value.narration,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": this.diamondBranchTransferInAutoRepairForm.value.gross,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-19T11:47:21.277Z",
      "ITEM_CURRENCY": this.diamondBranchTransferInAutoRepairForm.value.currency,
      "ITEM_CURR_RATE": this.diamondBranchTransferInAutoRepairForm.value.currencyAmt,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": "str",
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE":"str",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.diamondBranchTransferInAutoRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "OUSTATUSNEW": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": "2024-03-19T11:47:21.278Z",
      "PHYSTKTRANSTO_BR": "string",
      "TRANS_VOCNO": 0,
      "REF_DATE": this.diamondBranchTransferInAutoRepairForm.value.creditDate,
      "CR_DAYS": this.diamondBranchTransferInAutoRepairForm.value.creditDays,
      "REFNO": this.diamondBranchTransferInAutoRepairForm.value.refno,
      "TO_BRANCH_NAME": "string",
      "BRANCH_NAME": this.diamondBranchTransferInAutoRepairForm.value.branch,
      "TOTAL_NETWT": 0,
      "FROM_LOC": "string",
      "CMBYEAR": "string",
      "SALESRETURNTRANSFER": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.diamondBranchTransferInAutoRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": this.diamondBranchTransferInAutoRepairForm.value.type,
      "GST_TOTALFC": this.diamondBranchTransferInAutoRepairForm.value.totalGst,
      "GST_TOTALCC": this.diamondBranchTransferInAutoRepairForm.value.totalCss,
      "DOC_REF": "string",
      "INCLUSIVE": true,
      "ROUND_VALUE_CC": 0,
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": this.diamondBranchTransferInAutoRepairForm.value.toal,
      "TCS_AMOUNTCC": this.diamondBranchTransferInAutoRepairForm.value.subTotal,
      "AUTOENTRYPOS": true,
      "TCS_APPLICABLE": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "GENSEQNO": 0,
      "OUSTATUS": true,
      "Details":this.diamondBranchTransferInAutoRepairDetailsData
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
            this.close('reloadMainGrid')
          }
        });
        this.diamondBranchTransferInAutoRepairForm.reset()
        this.tableData = []
      }
    } else {
      this.toastr.error('Not saved')
    }
  }, err => alert(err))
this.subscriptions.push(Sub)
}

  openadddetails() {
    const modalRef: NgbModalRef = this.modalService.open( DiamondBranchTransferInAutoRepairDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.result.then((postData) => {
      // console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);    
        
        this.diamondBranchTransferInAutoRepairDetailsData.push(postData);

      }
    });
  }
  update(){
    if (this.diamondBranchTransferInAutoRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'MetalTransferAuto/UpdateMetalTransferAuto/'+ this.diamondBranchTransferInAutoRepairForm.value.branchCode + this.diamondBranchTransferInAutoRepairForm.value.voctype + this.diamondBranchTransferInAutoRepairForm.value.vocno + this.diamondBranchTransferInAutoRepairForm.value.yearMonth
    let postData = 
    {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.diamondBranchTransferInAutoRepairForm.value.voctype,
      "VOCNO": this.diamondBranchTransferInAutoRepairForm.value.vocNo,
      "VOCDATE": this.diamondBranchTransferInAutoRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-19T11:47:21.277Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": "s",
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.diamondBranchTransferInAutoRepairForm.value.location,
      "REMARKS": this.diamondBranchTransferInAutoRepairForm.value.narration,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": this.diamondBranchTransferInAutoRepairForm.value.gross,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": 0,
      "TOTAL_MKGVALUE_CC": 0,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-19T11:47:21.277Z",
      "ITEM_CURRENCY": this.diamondBranchTransferInAutoRepairForm.value.currency,
      "ITEM_CURR_RATE": this.diamondBranchTransferInAutoRepairForm.value.currencyAmt,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": "str",
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE":"str",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.diamondBranchTransferInAutoRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "OUSTATUSNEW": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": "2024-03-19T11:47:21.278Z",
      "PHYSTKTRANSTO_BR": "string",
      "TRANS_VOCNO": 0,
      "REF_DATE": this.diamondBranchTransferInAutoRepairForm.value.creditDate,
      "CR_DAYS": this.diamondBranchTransferInAutoRepairForm.value.creditDays,
      "REFNO": this.diamondBranchTransferInAutoRepairForm.value.refno,
      "TO_BRANCH_NAME": "string",
      "BRANCH_NAME": this.diamondBranchTransferInAutoRepairForm.value.branch,
      "TOTAL_NETWT": 0,
      "FROM_LOC": "string",
      "CMBYEAR": "string",
      "SALESRETURNTRANSFER": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "GST_REGISTERED": true,
      "GST_STATE_CODE": this.diamondBranchTransferInAutoRepairForm.value.stateCode,
      "GST_NUMBER": "string",
      "GST_TYPE": this.diamondBranchTransferInAutoRepairForm.value.type,
      "GST_TOTALFC": this.diamondBranchTransferInAutoRepairForm.value.totalGst,
      "GST_TOTALCC": this.diamondBranchTransferInAutoRepairForm.value.totalCss,
      "DOC_REF": "string",
      "INCLUSIVE": true,
      "ROUND_VALUE_CC": 0,
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": this.diamondBranchTransferInAutoRepairForm.value.toal,
      "TCS_AMOUNTCC": this.diamondBranchTransferInAutoRepairForm.value.subTotal,
      "AUTOENTRYPOS": true,
      "TCS_APPLICABLE": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "GENSEQNO": 0,
      "OUSTATUS": true,
      "Details":this.diamondBranchTransferInAutoRepairDetailsData
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
                this.diamondBranchTransferInAutoRepairForm.reset()
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
        let API = 'MetalTransferAuto/DeleteMetalTransferAuto/' + this.diamondBranchTransferInAutoRepairForm.value.branchCode + this.diamondBranchTransferInAutoRepairForm.value.voctype + this.diamondBranchTransferInAutoRepairForm.value.vocno + this.diamondBranchTransferInAutoRepairForm.value.yearMonth
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
                    this.diamondBranchTransferInAutoRepairForm.reset()
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
                    this.diamondBranchTransferInAutoRepairForm.reset()
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
