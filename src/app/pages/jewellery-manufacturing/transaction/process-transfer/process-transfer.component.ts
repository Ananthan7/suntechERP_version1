import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProcessTransferDetailsComponent } from './process-transfer-details/process-transfer-details.component';

@Component({
  selector: 'app-process-transfer',
  templateUrl: './process-transfer.component.html',
  styleUrls: ['./process-transfer.component.scss']
})
export class ProcessTransferComponent implements OnInit {

  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;

 private subscriptions: Subscription[] = [];
    user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
  }

  openaddprocesstransfer() {
    const modalRef: NgbModalRef = this.modalService.open(ProcessTransferDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  } 

  processTransferFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocdate:[''],
    vocno:[''],
    salesman:[''],
    currency:[''],
    currencyrate:[''],
  });
 
    formSubmit(){
  
      if(this.content && this.content.FLAG == 'EDIT'){
        this.update()
        return
      }
      if (this.processTransferFrom.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobProcessTrnMasterDJ/InsertJobProcessTrnMasterDJ'
      let postData = {
        "MID": 0,
        "VOCTYPE": this.processTransferFrom.value.voctype || "",
        "BRANCH_CODE": this.branchCode,
        "VOCNO": this.processTransferFrom.value.vocno || "",
        "VOCDATE": this.processTransferFrom.value.vocdate || "",
        "YEARMONTH": "string",
        "DOCTIME": "2023-10-17T05:43:21.906Z",
        "SMAN": this.processTransferFrom.value.salesman || "",
        "REMARKS": "string",
        "CURRENCY_CODE": this.processTransferFrom.value.currency || "",
        "CURRENCY_RATE": this.processTransferFrom.value.currencyrate || "",
        "NAVSEQNO": 0,
        "LAB_TYPE": 0,
        "AUTOPOSTING": true,
        "POSTDATE": "string",
        "PRINT_COUNT": 0,
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "SYSTEM_DATE": "2023-10-17T05:43:21.906Z",
        "SRNO": 0,
        "UNIQUEID": 0,
        "JOB_NUMBER": "string",
        "JOB_DATE": "2023-10-17T05:43:21.906Z",
        "UNQ_JOB_ID": "string",
        "UNQ_DESIGN_ID": "string",
        "DESIGN_CODE": "string",
        "SEQ_CODE": "string",
        "JOB_DESCRIPTION": "string",
        "FRM_PROCESS_CODE": "string",
        "FRM_PROCESSNAME": "string",
        "FRM_WORKER_CODE": "string",
        "FRM_WORKERNAME": "string",
        "FRM_PCS": 0,
        "FRM_STONE_WT": 0,
        "FRM_STONE_PCS": 0,
        "FRM_METAL_WT": 0,
        "FRM_METAL_PCS": 0,
        "FRM_PURE_WT": 0,
        "FRM_NET_WT": 0,
        "TO_PROCESS_CODE": "string",
        "TO_PROCESSNAME": "string",
        "TO_WORKER_CODE": "string",
        "TO_WORKERNAME": "string",
        "TO_PCS": 0,
        "TO_METAL_PCS": 0,
        "TO_STONE_WT": 0,
        "TO_STONE_PCS": 0,
        "TO_METAL_WT": 0,
        "TO_PURE_WT": 0,
        "TO_NET_WT": 0,
        "LOSS_QTY": 0,
        "LOSS_PURE_QTY": 0,
        "STONE_AMOUNTFC": 0,
        "STONE_AMOUNTLC": 0,
        "METAL_AMOUNTFC": 0,
        "METAL_AMOUNTLC": 0,
        "MAKING_RATEFC": 0,
        "MAKING_RATELC": 0,
        "MAKING_AMOUNTFC": 0,
        "MAKING_AMOUNTLC": 0,
        "LAB_AMOUNTFC": 0,
        "LAB_AMOUNTLC": 0,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTLC": 0,
        "COSTFC_PER_PCS": 0,
        "COSTLC_PER_PCS": 0,
        "LAB_CODE": "string",
        "LAB_UNIT": "string",
        "LAB_RATEFC": 0,
        "LAB_RATELC": 0,
        "LAB_ACCODE": "string",
        "LOSS_ACCODE": "string",
        "FRM_WIP_ACCODE": "string",
        "TO_WIP_ACCODE": "string",
        "RET_METAL_DIVCODE": "string",
        "RET_METAL_STOCK_CODE": "string",
        "RET_STONE_DIVCODE": "string",
        "RET_STONE_STOCK_CODE": "string",
        "RET_METAL_WT": 0,
        "RET_PURITY": 0,
        "RET_PURE_WT": 0,
        "RET_STONE_WT": 0,
        "RET_METAL_RATEFC": 0,
        "RET_METAL_RATELC": 0,
        "RET_METAL_AMOUNTFC": 0,
        "RET_METAL_AMOUNTLC": 0,
        "RET_STONE_RATEFC": 0,
        "RET_STONE_RATELC": 0,
        "RET_STONE_AMOUNTFC": 0,
        "RET_STONE_AMOUNTLC": 0,
        "IN_DATE": "2023-10-17T05:43:21.906Z",
        "OUT_DATE": "2023-10-17T05:43:21.906Z",
        "TIME_TAKEN_HRS": 0,
        "METAL_DIVISION": "string",
        "LOCTYPE_CODE": "string",
        "PICTURE_PATH": "string",
        "AMOUNTLC": 0,
        "AMOUNTFC": 0,
        "JOB_PCS": 0,
        "STONE_WT": 0,
        "STONE_PCS": 0,
        "METAL_WT": 0,
        "METAL_PCS": 0,
        "PURE_WT": 0,
        "GROSS_WT": 0,
        "RET_METAL_PCS": 0,
        "RET_STONE_PCS": 0,
        "RET_LOC_MET": "string",
        "RET_LOC_STN": "string",
        "MAIN_WORKER": "string",
        "MKG_LABACCODE": "string",
        "TREE_NO": "string",
        "STD_TIME": 0,
        "WORKER_ACCODE": "string",
        "PRODLAB_ACCODE": "string",
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "string",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "ISSUE_REF": "string",
        "IS_AUTHORISE": true,
        "TIME_CONSUMED": 0,
        "SCRAP_STOCK_CODE": "string",
        "SCRAP_SUB_STOCK_CODE": "string",
        "SCRAP_PURITY": 0,
        "SCRAP_WT": 0,
        "SCRAP_PURE_WT": 0,
        "SCRAP_PUDIFF": 0,
        "SCRAP_ACCODE": "string",
        "APPROVED_DATE": "2023-10-17T05:43:21.906Z",
        "APPROVED_USER": "string",
        "SCRAP_PCS": 0,
        "SCRAP_STONEWT": 0,
        "SCRAP_NETWT": 0,
        "FROM_IRONWT": 0,
        "FROM_MSTOCKCODE": "string",
        "TO_MSTOCKCODE": "string",
        "DESIGN_TYPE": "string",
        "TO_IRONWT": 0,
        "FRM_DIAGROSS_WT": 0,
        "EXCLUDE_TRANSFER_WT": true,
        "SCRAP_DIVCODE": "string",
        "IRON_SCRAP_WT": 0,
        "GAIN_WT": 0,
        "GAIN_PURE_WT": 0,
        "GAIN_ACCODE": "string",
        "IS_REJECT": true,
        "REASON": "string",
        "REJ_REMARKS": "string",
        "ATTACHMENT_FILE": "string",
        "AUTHORIZE_TIME": "2023-10-17T05:43:21.906Z",
        "JOB_SO_NUMBER": 0,
        "METALSTONE": "string",
        "DIVCODE": "string",
        "STOCK_CODE": "string",
        "STOCK_DESCRIPTION": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SHAPE": "string",
        "SIZE": "string",
        "PCS": 0,
        "NET_WT": 0,
        "RATE": 0,
        "AMOUNT": 0,
        "PROCESS_CODE": "string",
        "WORKER_CODE": "string",
        "REFMID": 0,
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "LABOUR_CODE": "string",
        "LAB_RATE": 0,
        "LAB_AMT": 0,
        "BRKSTN_STOCK_CODE": "string",
        "BRKSTN_DIVISION_CODE": "string",
        "BRKSTN_WEIGHT": 0,
        "BRKSTN_RATEFC": 0,
        "BRKSTN_RATELC": 0,
        "BRKSTN_AMTFC": 0,
        "BRKSTN_AMTLC": 0,
        "FRM_WORKER": "string",
        "FRM_PROCESS": "string",
        "CRACCODE": "string",
        "LAB_AMTFC": 0,
        "TO_PROCESS": "string",
        "TO_WORKER": "string",
        "RATEFC": 0,
        "PRINTED": true,
        "PUREWT": 0,
        "PURITY": 0,
        "SQLID": "string",
        "ISBROCKEN": 0, 
        "SETTED": true,
        "SETTED_PCS": 0,
        "SIEVE": "string",
        "FULL_RECOVERY": 0,
        "RECOVERY_DATE": "2023-10-17T05:43:21.906Z",
        "RECOV_LOSS": 0,
        "RECOV_LOSS_PURE": 0,
        "BROKENSTONE_PCS": 0,
        "BROKENSTONE_WT": 0,
        "ISMISSING": 0,
        "PROCESS_TYPE": "string",  
        "SUB_STOCK_CODE": "string",
        "KARAT_CODE": "string",
        "SIEVE_SET": "string", 
        "ISSUE_GROSS_WT": 0,
        "ISSUE_STONE_WT": 0,
        "ISSUE_NET_WT": 0, 
        "TO_STOCK_CODE": "string",
        "FROM_STOCK_CODE": "string",
        "FROM_SUB_STOCK_CODE": "string",
        "LOSS_PURE_WT": 0,      
        "IRON_WT": 0,       
        "PUREWTTEMP": 0,
        "UNITCODE": "string",
        "approvalDetails": this.tableData,  
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
                  this.processTransferFrom.reset()
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
      this.processTransferFrom.controls.voctype.setValue(this.content.VOCTYPE)
      this.processTransferFrom.controls.vocdate.setValue(this.content.VOCDATE)
      this.processTransferFrom.controls.vocno.setValue(this.content.VOCNO)
      this.processTransferFrom.controls.salesman.setValue(this.content.SMAN)
      this.processTransferFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
      this.processTransferFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    }  
  
    update(){
      if (this.processTransferFrom.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/'+ this.processTransferFrom.value.branchCode  + this.processTransferFrom.value.voctype + this.processTransferFrom.value.vocno + this.processTransferFrom.value.vocdate
      let postData = {
        "MID": 0,
        "VOCTYPE": this.processTransferFrom.value.voctype || "",
        "BRANCH_CODE": this.branchCode,
        "VOCNO": this.processTransferFrom.value.vocno || "",
        "VOCDATE": this.processTransferFrom.value.vocdate || "",
        "YEARMONTH": "string",
        "DOCTIME": "2023-10-17T05:43:21.906Z",
        "SMAN": this.processTransferFrom.value.salesman || "",
        "REMARKS": "string",
        "CURRENCY_CODE": this.processTransferFrom.value.currency || "",
        "CURRENCY_RATE": this.processTransferFrom.value.currencyrate || "",
        "NAVSEQNO": 0,
        "LAB_TYPE": 0,
        "AUTOPOSTING": true,
        "POSTDATE": "string",
        "PRINT_COUNT": 0,
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "SYSTEM_DATE": "2023-10-17T05:43:21.906Z",
        "SRNO": 0,
        "UNIQUEID": 0,
        "JOB_NUMBER": "string",
        "JOB_DATE": "2023-10-17T05:43:21.906Z",
        "UNQ_JOB_ID": "string",
        "UNQ_DESIGN_ID": "string",
        "DESIGN_CODE": "string",
        "SEQ_CODE": "string",
        "JOB_DESCRIPTION": "string",
        "FRM_PROCESS_CODE": "string",
        "FRM_PROCESSNAME": "string",
        "FRM_WORKER_CODE": "string",
        "FRM_WORKERNAME": "string",
        "FRM_PCS": 0,
        "FRM_STONE_WT": 0,
        "FRM_STONE_PCS": 0,
        "FRM_METAL_WT": 0,
        "FRM_METAL_PCS": 0,
        "FRM_PURE_WT": 0,
        "FRM_NET_WT": 0,
        "TO_PROCESS_CODE": "string",
        "TO_PROCESSNAME": "string",
        "TO_WORKER_CODE": "string",
        "TO_WORKERNAME": "string",
        "TO_PCS": 0,
        "TO_METAL_PCS": 0,
        "TO_STONE_WT": 0,
        "TO_STONE_PCS": 0,
        "TO_METAL_WT": 0,
        "TO_PURE_WT": 0,
        "TO_NET_WT": 0,
        "LOSS_QTY": 0,
        "LOSS_PURE_QTY": 0,
        "STONE_AMOUNTFC": 0,
        "STONE_AMOUNTLC": 0,
        "METAL_AMOUNTFC": 0,
        "METAL_AMOUNTLC": 0,
        "MAKING_RATEFC": 0,
        "MAKING_RATELC": 0,
        "MAKING_AMOUNTFC": 0,
        "MAKING_AMOUNTLC": 0,
        "LAB_AMOUNTFC": 0,
        "LAB_AMOUNTLC": 0,
        "TOTAL_AMOUNTFC": 0,
        "TOTAL_AMOUNTLC": 0,
        "COSTFC_PER_PCS": 0,
        "COSTLC_PER_PCS": 0,
        "LAB_CODE": "string",
        "LAB_UNIT": "string",
        "LAB_RATEFC": 0,
        "LAB_RATELC": 0,
        "LAB_ACCODE": "string",
        "LOSS_ACCODE": "string",
        "FRM_WIP_ACCODE": "string",
        "TO_WIP_ACCODE": "string",
        "RET_METAL_DIVCODE": "string",
        "RET_METAL_STOCK_CODE": "string",
        "RET_STONE_DIVCODE": "string",
        "RET_STONE_STOCK_CODE": "string",
        "RET_METAL_WT": 0,
        "RET_PURITY": 0,
        "RET_PURE_WT": 0,
        "RET_STONE_WT": 0,
        "RET_METAL_RATEFC": 0,
        "RET_METAL_RATELC": 0,
        "RET_METAL_AMOUNTFC": 0,
        "RET_METAL_AMOUNTLC": 0,
        "RET_STONE_RATEFC": 0,
        "RET_STONE_RATELC": 0,
        "RET_STONE_AMOUNTFC": 0,
        "RET_STONE_AMOUNTLC": 0,
        "IN_DATE": "2023-10-17T05:43:21.906Z",
        "OUT_DATE": "2023-10-17T05:43:21.906Z",
        "TIME_TAKEN_HRS": 0,
        "METAL_DIVISION": "string",
        "LOCTYPE_CODE": "string",
        "PICTURE_PATH": "string",
        "AMOUNTLC": 0,
        "AMOUNTFC": 0,
        "JOB_PCS": 0,
        "STONE_WT": 0,
        "STONE_PCS": 0,
        "METAL_WT": 0,
        "METAL_PCS": 0,
        "PURE_WT": 0,
        "GROSS_WT": 0,
        "RET_METAL_PCS": 0,
        "RET_STONE_PCS": 0,
        "RET_LOC_MET": "string",
        "RET_LOC_STN": "string",
        "MAIN_WORKER": "string",
        "MKG_LABACCODE": "string",
        "TREE_NO": "string",
        "STD_TIME": 0,
        "WORKER_ACCODE": "string",
        "PRODLAB_ACCODE": "string",
        "DT_BRANCH_CODE": "string",
        "DT_VOCTYPE": "string",
        "DT_VOCNO": 0,
        "DT_YEARMONTH": "string",
        "ISSUE_REF": "string",
        "IS_AUTHORISE": true,
        "TIME_CONSUMED": 0,
        "SCRAP_STOCK_CODE": "string",
        "SCRAP_SUB_STOCK_CODE": "string",
        "SCRAP_PURITY": 0,
        "SCRAP_WT": 0,
        "SCRAP_PURE_WT": 0,
        "SCRAP_PUDIFF": 0,
        "SCRAP_ACCODE": "string",
        "APPROVED_DATE": "2023-10-17T05:43:21.906Z",
        "APPROVED_USER": "string",
        "SCRAP_PCS": 0,
        "SCRAP_STONEWT": 0,
        "SCRAP_NETWT": 0,
        "FROM_IRONWT": 0,
        "FROM_MSTOCKCODE": "string",
        "TO_MSTOCKCODE": "string",
        "DESIGN_TYPE": "string",
        "TO_IRONWT": 0,
        "FRM_DIAGROSS_WT": 0,
        "EXCLUDE_TRANSFER_WT": true,
        "SCRAP_DIVCODE": "string",
        "IRON_SCRAP_WT": 0,
        "GAIN_WT": 0,
        "GAIN_PURE_WT": 0,
        "GAIN_ACCODE": "string",
        "IS_REJECT": true,
        "REASON": "string",
        "REJ_REMARKS": "string",
        "ATTACHMENT_FILE": "string",
        "AUTHORIZE_TIME": "2023-10-17T05:43:21.906Z",
        "JOB_SO_NUMBER": 0,
        "METALSTONE": "string",
        "DIVCODE": "string",
        "STOCK_CODE": "string",
        "STOCK_DESCRIPTION": "string",
        "COLOR": "string",
        "CLARITY": "string",
        "SHAPE": "string",
        "SIZE": "string",
        "PCS": 0,
        "NET_WT": 0,
        "RATE": 0,
        "AMOUNT": 0,
        "PROCESS_CODE": "string",
        "WORKER_CODE": "string",
        "REFMID": 0,
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMT": 0,
        "LABOUR_CODE": "string",
        "LAB_RATE": 0,
        "LAB_AMT": 0,
        "BRKSTN_STOCK_CODE": "string",
        "BRKSTN_DIVISION_CODE": "string",
        "BRKSTN_WEIGHT": 0,
        "BRKSTN_RATEFC": 0,
        "BRKSTN_RATELC": 0,
        "BRKSTN_AMTFC": 0,
        "BRKSTN_AMTLC": 0,
        "FRM_WORKER": "string",
        "FRM_PROCESS": "string",
        "CRACCODE": "string",
        "LAB_AMTFC": 0,
        "TO_PROCESS": "string",
        "TO_WORKER": "string",
        "RATEFC": 0,
        "PRINTED": true,
        "PUREWT": 0,
        "PURITY": 0,
        "SQLID": "string",
        "ISBROCKEN": 0, 
        "SETTED": true,
        "SETTED_PCS": 0,
        "SIEVE": "string",
        "FULL_RECOVERY": 0,
        "RECOVERY_DATE": "2023-10-17T05:43:21.906Z",
        "RECOV_LOSS": 0,
        "RECOV_LOSS_PURE": 0,
        "BROKENSTONE_PCS": 0,
        "BROKENSTONE_WT": 0,
        "ISMISSING": 0,
        "PROCESS_TYPE": "string",  
        "SUB_STOCK_CODE": "string",
        "KARAT_CODE": "string",
        "SIEVE_SET": "string", 
        "ISSUE_GROSS_WT": 0,
        "ISSUE_STONE_WT": 0,
        "ISSUE_NET_WT": 0, 
        "TO_STOCK_CODE": "string",
        "FROM_STOCK_CODE": "string",
        "FROM_SUB_STOCK_CODE": "string",
        "LOSS_PURE_WT": 0,      
        "IRON_WT": 0,       
        "PUREWTTEMP": 0,
        "UNITCODE": "string",
        "approvalDetails": this.tableData,  
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
                  this.processTransferFrom.reset()
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
          let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' + this.processTransferFrom.value.branchCode + this.processTransferFrom.value.voctype + this.processTransferFrom.value.vocno + this.processTransferFrom.value.vocdate
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
                      this.processTransferFrom.reset()
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
                      this.processTransferFrom.reset()
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

    close(data?: any) {
      //TODO reset forms and data before closing
      this.activeModal.close(data);
    }

    removedata(){
      this.tableData.pop();
    }

}
