import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import Swal from 'sweetalert2';
import { DiamondBranchTransferInAutoRepairDetailsComponent } from './diamond-branch-transfer-in-auto-repair-details/diamond-branch-transfer-in-auto-repair-details.component';

@Component({
  selector: 'app-diamond-branch-transfer-in-auto-repair',
  templateUrl: './diamond-branch-transfer-in-auto-repair.component.html',
  styleUrls: ['./diamond-branch-transfer-in-auto-repair.component.scss']
})
export class DiamondBranchTransferInAutoRepairComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];
  diamondBranchTransferinAutoRepairDetails: any[] = [];
  // columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];

  columnheadItemDetails: any[] = [
    { title: 'Sr.No', field: 'SRNO' },
    { title: 'Div', field: 'DIVISION_CODE' },
    { title: 'Description', field: 'STOCK_DOCDESC' },
    { title: 'Remarks', field: 'SUPPLIERDESC' },
    { title: 'Pcs', field: 'PCS' },
    { title: 'Gr.Wt', field: 'GROSSWT' },
    { title: 'Repair Type', field: 'REPAIRITEM' },
    { title: 'Type', field: 'RATE_TYPE' },
  ];

  columnheadItemDetails1: any[] = ['Comp Code', 'Description', 'Pcs', 'Size Set', 'Size Code', 'Type', 'Category', 'Shape', 'Height', 'Width', 'Length', 'Radius', 'Remarks'];
  columnheadItemDetails2: any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  selectedTabIndex = 0;
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'BRANCH CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User Name ',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'STATE CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }



  diamondBranchTransferinAutoRepairForm: FormGroup = this.formBuilder.group({
    voctype: [''],
    vocNo: [''],
    branch: [''],
    enteredBy: [''],
    Currency: [''],
    CurrencyDesc: [''],
    vocDate: [''],
    status: [''],
    CreditDays: [''],
    creditDate: [''],
    location: [''],
    narration: [''],
    stateCode: [''],
    taxCode: [''],
    type: [''],
    RefNo: [''],
    FullChecked: [''],
    FullChecked1: [''],
    Total: [''],
    Total1: [''],
    TotalFC: [''],
    TotalCC: [''],
    TotalGST: [''],
    zerothAmtFC: [''],
    Gross: [''],
    Gross1: [''],

  });

  ngOnInit(): void {

    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.diamondBranchTransferinAutoRepairForm.controls.voctype.setValue(this.comService.getqueryParamVocType());
    this.diamondBranchTransferinAutoRepairForm.controls.currency.setValue(this.comService.compCurrency);
    this.diamondBranchTransferinAutoRepairForm.controls.currencyAmt.setValue(this.comService.getCurrRate(this.comService.compCurrency));
  }


  branchCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.branch.setValue(e.BRANCH_CODE);
  }


  enteredByCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.enteredBy.setValue(e.UsersName);
  }



  stateCodeSelected(e: any) {
    console.log(e);
    this.diamondBranchTransferinAutoRepairForm.controls.stateCode.setValue(e.STATE_CODE);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }





  openaddDetails() {
    const modalRef: NgbModalRef = this.modalService.open(DiamondBranchTransferInAutoRepairDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      // console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);

        this.diamondBranchTransferinAutoRepairDetails.push(postData);

        this.diamondBranchTransferinAutoRepairDetails.forEach((item, i) => {
          item.SRNO = i + 1;
        });

      }
    });

  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.diamondBranchTransferinAutoRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'MetalTransferAuto/InsertMetalTransferAuto'
    let postData =
    {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.diamondBranchTransferinAutoRepairForm.value.voctype,
      "VOCNO": this.diamondBranchTransferinAutoRepairForm.value.vocNo,
      "VOCDATE": this.diamondBranchTransferinAutoRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-20T11:35:33.684Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": "s",
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.diamondBranchTransferinAutoRepairForm.value.location,
      "REMARKS": this.diamondBranchTransferinAutoRepairForm.value.narration,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": this.diamondBranchTransferinAutoRepairForm.value.TotalFC,
      "TOTAL_MKGVALUE_CC": this.diamondBranchTransferinAutoRepairForm.value.TotalCC,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-20T11:35:33.684Z",
      "ITEM_CURRENCY": this.diamondBranchTransferinAutoRepairForm.value.Currency,
      "ITEM_CURR_RATE": this.diamondBranchTransferinAutoRepairForm.value.CurrencyDesc,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": "str",
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.diamondBranchTransferinAutoRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "OUSTATUSNEW": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": this.diamondBranchTransferinAutoRepairForm.value.creditDate,
      "PHYSTKTRANSTO_BR": "string",
      "TRANS_VOCNO": 0,
      "REF_DATE": "2024-03-20T11:35:33.684Z",
      "CR_DAYS": this.diamondBranchTransferinAutoRepairForm.value.CreditDays,
      "REFNO": "string",
      "TO_BRANCH_NAME": "string",
      "BRANCH_NAME": this.diamondBranchTransferinAutoRepairForm.value.Branch,
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
      "GST_STATE_CODE": this.diamondBranchTransferinAutoRepairForm.value.stateCode,
      "GST_NUMBER": this.diamondBranchTransferinAutoRepairForm.value.taxCode,
      "GST_TYPE": this.diamondBranchTransferinAutoRepairForm.value.type,
      "GST_TOTALFC": this.diamondBranchTransferinAutoRepairForm.value.TotalGST,
      "GST_TOTALCC": 0,
      "DOC_REF": this.diamondBranchTransferinAutoRepairForm.value.RefNo,
      "INCLUSIVE": true,
      "ROUND_VALUE_CC": 0,
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "AUTOENTRYPOS": true,
      "TCS_APPLICABLE": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "GENSEQNO": 0,
      "OUSTATUS": true,
      "Details": this.diamondBranchTransferinAutoRepairDetails
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
                this.diamondBranchTransferinAutoRepairForm.reset()
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
    if (this.diamondBranchTransferinAutoRepairForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'MetalTransferAuto/UpdateMetalTransferAuto/' + this.diamondBranchTransferinAutoRepairForm.value.branchCode + this.diamondBranchTransferinAutoRepairForm.value.voctype + this.diamondBranchTransferinAutoRepairForm.value.vocno + this.diamondBranchTransferinAutoRepairForm.value.yearMonth
    let postData =
    {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.diamondBranchTransferinAutoRepairForm.value.voctype,
      "VOCNO": this.diamondBranchTransferinAutoRepairForm.value.vocNo,
      "VOCDATE": this.diamondBranchTransferinAutoRepairForm.value.vocDate,
      "VALUE_DATE": "2024-03-20T11:35:33.684Z",
      "YEARMONTH": this.yearMonth,
      "TRANSFERSTATUS": "s",
      "FROM_BR": "string",
      "TO_BR": "string",
      "TO_LOC": this.diamondBranchTransferinAutoRepairForm.value.location,
      "REMARKS": this.diamondBranchTransferinAutoRepairForm.value.narration,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_STWT": 0,
      "TOTAL_PUWT": 0,
      "TOTAL_OZWT": 0,
      "TOTAL_STONEVALUE_FC": 0,
      "TOTAL_STONEVALUE_CC": 0,
      "TOTAL_MKGVALUE_FC": this.diamondBranchTransferinAutoRepairForm.value.TotalFC,
      "TOTAL_MKGVALUE_CC": this.diamondBranchTransferinAutoRepairForm.value.TotalCC,
      "TOTAL_PUDIFF": 0,
      "TOTAL_STONEDIFF": 0,
      "SYSTEM_DATE": "2024-03-20T11:35:33.684Z",
      "ITEM_CURRENCY": this.diamondBranchTransferinAutoRepairForm.value.Currency,
      "ITEM_CURR_RATE": this.diamondBranchTransferinAutoRepairForm.value.CurrencyDesc,
      "TRANSREF": "string",
      "TRANSMID": 0,
      "TRANSVOCTYPE": "str",
      "AUTHORIZE": true,
      "NAVSEQNO": 0,
      "RATE_TYPE": "string",
      "FIXED": 0,
      "METAL_RATE": 0,
      "SCRAPTRANSFER": true,
      "SALESPERSON_CODE": this.diamondBranchTransferinAutoRepairForm.value.enteredBy,
      "INVREFNO": "string",
      "OUSTATUSNEW": 0,
      "PAYMENTDONE": true,
      "DELIVEREDDATE": this.diamondBranchTransferinAutoRepairForm.value.creditDate,
      "PHYSTKTRANSTO_BR": "string",
      "TRANS_VOCNO": 0,
      "REF_DATE": "2024-03-20T11:35:33.684Z",
      "CR_DAYS": this.diamondBranchTransferinAutoRepairForm.value.CreditDays,
      "REFNO": "string",
      "TO_BRANCH_NAME": "string",
      "BRANCH_NAME": this.diamondBranchTransferinAutoRepairForm.value.Branch,
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
      "GST_STATE_CODE": this.diamondBranchTransferinAutoRepairForm.value.stateCode,
      "GST_NUMBER": this.diamondBranchTransferinAutoRepairForm.value.taxCode,
      "GST_TYPE": this.diamondBranchTransferinAutoRepairForm.value.type,
      "GST_TOTALFC": this.diamondBranchTransferinAutoRepairForm.value.TotalGST,
      "GST_TOTALCC": 0,
      "DOC_REF": this.diamondBranchTransferinAutoRepairForm.value.RefNo,
      "INCLUSIVE": true,
      "ROUND_VALUE_CC": 0,
      "TCS_ACCODE": "string",
      "TCS_AMOUNT": 0,
      "TCS_AMOUNTCC": 0,
      "AUTOENTRYPOS": true,
      "TCS_APPLICABLE": true,
      "HTUSERNAME": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "DRIVER_CODE": "string",
      "GENSEQNO": 0,
      "OUSTATUS": true,
      "Details": this.diamondBranchTransferinAutoRepairDetails
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
                this.diamondBranchTransferinAutoRepairForm.reset()
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
        let API = 'MetalTransferAuto/DeleteMetalTransferAuto/' + this.diamondBranchTransferinAutoRepairForm.value.branchCode + this.diamondBranchTransferinAutoRepairForm.value.voctype + this.diamondBranchTransferinAutoRepairForm.value.vocno + this.diamondBranchTransferinAutoRepairForm.value.yearMonth
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
                    this.diamondBranchTransferinAutoRepairForm.reset()
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
                    this.diamondBranchTransferinAutoRepairForm.reset()
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
