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
  userName = this.commonService.userName;
  companyName = this.commonService.allbranchMaster['BRANCH_NAME']
  branchCode?: String;
  yearMonth?: String;

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
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**Procces */
  processTransferFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: ['', [Validators.required]],
    vocno: [''],
    salesman: [''],
    SalesmanName: [''],
    currency: [''],
    currencyrate: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {

  }


  ngOnInit(): void {
    this.setInitialValues() //load all initial values
  }
  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.processTransferFrom.controls.vocdate.setValue(this.commonService.currentDate)
    this.processTransferFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.processTransferFrom.controls.vocdate.setValue(new Date(date))
    }
  }
  openaddprocesstransfer() {
    const modalRef: NgbModalRef = this.modalService.open(ProcessTransferDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
  SalesmanSelected(event: any) {
    this.processTransferFrom.controls.salesman.setValue(event.SALESPERSON_CODE)
    this.processTransferFrom.controls.SalesmanName.setValue(event.DESCRIPTION)
  }

  deleteTableData() {

  }


  removedata() {
    this.tableData.pop();
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
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
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-21T07:24:35.989Z",
      "SMAN": this.processTransferFrom.value.salesman || "",
      "REMARKS": "",
      "CURRENCY_CODE": this.processTransferFrom.value.currency || "",
      "CURRENCY_RATE": this.processTransferFrom.value.currencyrate || "",
      "NAVSEQNO": 0,
      "LAB_TYPE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
      "JOB_PROCESS_TRN_DETAIL_DJ": [
        {
          "SRNO": 0,
          "UNIQUEID": 0,
          "VOCNO": 0,
          "VOCDATE": "2023-10-21T07:24:35.989Z",
          "VOCTYPE": "",
          "BRANCH_CODE": "",
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-21T07:24:35.989Z",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "DESIGN_CODE": "",
          "SEQ_CODE": "",
          "JOB_DESCRIPTION": "",
          "CURRENCY_CODE": "",
          "CURRENCY_RATE": 0,
          "FRM_PROCESS_CODE": "",
          "FRM_PROCESSNAME": "",
          "FRM_WORKER_CODE": "",
          "FRM_WORKERNAME": "",
          "FRM_PCS": 0,
          "FRM_STONE_WT": 0,
          "FRM_STONE_PCS": 0,
          "FRM_METAL_WT": 0,
          "FRM_METAL_PCS": 0,
          "FRM_PURE_WT": 0,
          "FRM_NET_WT": 0,
          "TO_PROCESS_CODE": "",
          "TO_PROCESSNAME": "",
          "TO_WORKER_CODE": "",
          "TO_WORKERNAME": "",
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
          "LAB_CODE": "",
          "LAB_UNIT": "",
          "LAB_RATEFC": 0,
          "LAB_RATELC": 0,
          "LAB_ACCODE": "",
          "LOSS_ACCODE": "",
          "FRM_WIP_ACCODE": "",
          "TO_WIP_ACCODE": "",
          "RET_METAL_DIVCODE": "",
          "RET_METAL_STOCK_CODE": "",
          "RET_STONE_DIVCODE": "",
          "RET_STONE_STOCK_CODE": "",
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
          "IN_DATE": "2023-10-21T07:24:35.989Z",
          "OUT_DATE": "2023-10-21T07:24:35.989Z",
          "TIME_TAKEN_HRS": 0,
          "METAL_DIVISION": "",
          "LOCTYPE_CODE": "",
          "PICTURE_PATH": "",
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
          "RET_LOC_MET": "",
          "RET_LOC_STN": "",
          "MAIN_WORKER": "",
          "MKG_LABACCODE": "",
          "REMARKS": "",
          "TREE_NO": "",
          "STD_TIME": 0,
          "WORKER_ACCODE": "",
          "PRODLAB_ACCODE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "ISSUE_REF": "",
          "IS_AUTHORISE": true,
          "TIME_CONSUMED": 0,
          "SCRAP_STOCK_CODE": "",
          "SCRAP_SUB_STOCK_CODE": "",
          "SCRAP_PURITY": 0,
          "SCRAP_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_PUDIFF": 0,
          "SCRAP_ACCODE": "",
          "APPROVED_DATE": "2023-10-21T07:24:35.989Z",
          "APPROVED_USER": "",
          "SCRAP_PCS": 0,
          "SCRAP_STONEWT": 0,
          "SCRAP_NETWT": 0,
          "FROM_IRONWT": 0,
          "FROM_MSTOCKCODE": "",
          "TO_MSTOCKCODE": "",
          "DESIGN_TYPE": "",
          "TO_IRONWT": 0,
          "FRM_DIAGROSS_WT": 0,
          "EXCLUDE_TRANSFER_WT": true,
          "SCRAP_DIVCODE": "",
          "IRON_SCRAP_WT": 0,
          "GAIN_WT": 0,
          "GAIN_PURE_WT": 0,
          "GAIN_ACCODE": "",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": "",
          "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
        }
      ],
      "JOB_PROCESS_TRN_STNMTL_DJ": [
        {
          "VOCNO": 0,
          "VOCTYPE": "",
          "VOCDATE": "2023-10-21T07:24:35.989Z",
          "JOB_NUMBER": "",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "",
          "JOB_DESCRIPTION": "",
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "STOCK_CODE": "",
          "STOCK_DESCRIPTION": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "SIZE": "",
          "PCS": 0,
          "GROSS_WT": 0,
          "STONE_WT": 0,
          "NET_WT": 0,
          "RATE": 0,
          "AMOUNT": 0,
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "UNQ_DESIGN_ID": "",
          "REFMID": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "WASTAGE_QTY": 0,
          "WASTAGE_PER": 0,
          "WASTAGE_AMT": 0,
          "CURRENCY_CODE": "",
          "CURRENCY_RATE": 0,
          "YEARMONTH": "",
          "LOSS_QTY": 0,
          "LABOUR_CODE": "",
          "LAB_RATE": 0,
          "LAB_AMT": 0,
          "BRKSTN_STOCK_CODE": "",
          "BRKSTN_DIVISION_CODE": "",
          "BRKSTN_WEIGHT": 0,
          "BRKSTN_RATEFC": 0,
          "BRKSTN_RATELC": 0,
          "BRKSTN_AMTFC": 0,
          "BRKSTN_AMTLC": 0,
          "MAIN_WORKER": "",
          "FRM_WORKER": "",
          "FRM_PROCESS": "",
          "CRACCODE": "",
          "LAB_ACCODE": "",
          "LAB_AMTFC": 0,
          "TO_PROCESS": "",
          "TO_WORKER": "",
          "LAB_RATEFC": 0,
          "RATEFC": 0,
          "PRINTED": true,
          "PUREWT": 0,
          "PURITY": 0,
          "SQLID": "",
          "ISBROCKEN": 0,
          "TREE_NO": "",
          "SETTED": true,
          "SETTED_PCS": 0,
          "SIEVE": "string",
          "FULL_RECOVERY": 0,
          "RECOVERY_DATE": "2023-10-21T07:24:35.989Z",
          "RECOV_LOSS": 0,
          "RECOV_LOSS_PURE": 0,
          "BROKENSTONE_PCS": 0,
          "BROKENSTONE_WT": 0,
          "ISMISSING": 0,
          "PROCESS_TYPE": "",
          "IS_AUTHORISE": true,
          "SUB_STOCK_CODE": "",
          "KARAT_CODE": "",
          "SIEVE_SET": "",
          "SCRAP_STOCK_CODE": "",
          "SCRAP_SUB_STOCK_CODE": "",
          "SCRAP_PURITY": 0,
          "SCRAP_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_PUDIFF": 0,
          "SCRAP_ACCODE": "",
          "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
          "ISSUE_GROSS_WT": 0,
          "ISSUE_STONE_WT": 0,
          "ISSUE_NET_WT": 0,
          "JOB_PCS": 0,
          "DESIGN_TYPE": "",
          "TO_STOCK_CODE": "",
          "FROM_STOCK_CODE": "",
          "FROM_SUB_STOCK_CODE": "",
          "LOSS_PURE_WT": 0,
          "EXCLUDE_TRANSFER_WT": true,
          "IRON_WT": 0,
          "IRON_SCRAP_WT": 0,
          "GAIN_WT": 0,
          "GAIN_PURE_WT": 0,
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": "",
          "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
          "PUREWTTEMP": 0
        }
      ],
      "JOB_PROCESS_TRN_LABCHRG_DJ": [
        {
          "REFMID": 0,
          "BRANCH_CODE": "",
          "YEARMONTH": "",
          "VOCTYPE": "",
          "VOCNO": 0,
          "SRNO": 0,
          "JOB_NUMBER": "",
          "STOCK_CODE": "",
          "UNQ_JOB_ID": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "PCS": 0,
          "GROSS_WT": 0,
          "LABOUR_CODE": "",
          "LAB_RATE": 0,
          "LAB_ACCODE": "",
          "LAB_AMTFC": 0,
          "UNITCODE": ""
        }
      ]
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
    if (!this.content) return
    console.log(this.content);
    this.processTransferFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.processTransferFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.processTransferFrom.controls.vocno.setValue(this.content.VOCNO)
    this.processTransferFrom.controls.salesman.setValue(this.content.SMAN)
    this.processTransferFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.processTransferFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
  }


  update() {
    if (this.processTransferFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobProcessTrnMasterDJ/UpdateJobProcessTrnMasterDJ/' + this.processTransferFrom.value.branchCode + this.processTransferFrom.value.voctype + this.processTransferFrom.value.vocno + this.processTransferFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": this.processTransferFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.processTransferFrom.value.vocno || "",
      "VOCDATE": this.processTransferFrom.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-21T07:24:35.989Z",
      "SMAN": this.processTransferFrom.value.salesman || "",
      "REMARKS": "",
      "CURRENCY_CODE": this.processTransferFrom.value.currency || "",
      "CURRENCY_RATE": this.processTransferFrom.value.currencyrate || "",
      "NAVSEQNO": 0,
      "LAB_TYPE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
      "JOB_PROCESS_TRN_DETAIL_DJ": [
        {
          "SRNO": 0,
          "UNIQUEID": 0,
          "VOCNO": 0,
          "VOCDATE": "2023-10-21T07:24:35.989Z",
          "VOCTYPE": "",
          "BRANCH_CODE": "",
          "JOB_NUMBER": "",
          "JOB_DATE": "2023-10-21T07:24:35.989Z",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "DESIGN_CODE": "",
          "SEQ_CODE": "",
          "JOB_DESCRIPTION": "",
          "CURRENCY_CODE": "",
          "CURRENCY_RATE": 0,
          "FRM_PROCESS_CODE": "",
          "FRM_PROCESSNAME": "",
          "FRM_WORKER_CODE": "",
          "FRM_WORKERNAME": "",
          "FRM_PCS": 0,
          "FRM_STONE_WT": 0,
          "FRM_STONE_PCS": 0,
          "FRM_METAL_WT": 0,
          "FRM_METAL_PCS": 0,
          "FRM_PURE_WT": 0,
          "FRM_NET_WT": 0,
          "TO_PROCESS_CODE": "",
          "TO_PROCESSNAME": "",
          "TO_WORKER_CODE": "",
          "TO_WORKERNAME": "",
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
          "LAB_CODE": "",
          "LAB_UNIT": "",
          "LAB_RATEFC": 0,
          "LAB_RATELC": 0,
          "LAB_ACCODE": "",
          "LOSS_ACCODE": "",
          "FRM_WIP_ACCODE": "",
          "TO_WIP_ACCODE": "",
          "RET_METAL_DIVCODE": "",
          "RET_METAL_STOCK_CODE": "",
          "RET_STONE_DIVCODE": "",
          "RET_STONE_STOCK_CODE": "",
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
          "IN_DATE": "2023-10-21T07:24:35.989Z",
          "OUT_DATE": "2023-10-21T07:24:35.989Z",
          "TIME_TAKEN_HRS": 0,
          "METAL_DIVISION": "",
          "LOCTYPE_CODE": "",
          "PICTURE_PATH": "",
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
          "RET_LOC_MET": "",
          "RET_LOC_STN": "",
          "MAIN_WORKER": "",
          "MKG_LABACCODE": "",
          "REMARKS": "",
          "TREE_NO": "",
          "STD_TIME": 0,
          "WORKER_ACCODE": "",
          "PRODLAB_ACCODE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "ISSUE_REF": "",
          "IS_AUTHORISE": true,
          "TIME_CONSUMED": 0,
          "SCRAP_STOCK_CODE": "",
          "SCRAP_SUB_STOCK_CODE": "",
          "SCRAP_PURITY": 0,
          "SCRAP_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_PUDIFF": 0,
          "SCRAP_ACCODE": "",
          "APPROVED_DATE": "2023-10-21T07:24:35.989Z",
          "APPROVED_USER": "",
          "SCRAP_PCS": 0,
          "SCRAP_STONEWT": 0,
          "SCRAP_NETWT": 0,
          "FROM_IRONWT": 0,
          "FROM_MSTOCKCODE": "",
          "TO_MSTOCKCODE": "",
          "DESIGN_TYPE": "",
          "TO_IRONWT": 0,
          "FRM_DIAGROSS_WT": 0,
          "EXCLUDE_TRANSFER_WT": true,
          "SCRAP_DIVCODE": "",
          "IRON_SCRAP_WT": 0,
          "GAIN_WT": 0,
          "GAIN_PURE_WT": 0,
          "GAIN_ACCODE": "",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": "",
          "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z"
        }
      ],
      "JOB_PROCESS_TRN_STNMTL_DJ": [
        {
          "VOCNO": 0,
          "VOCTYPE": "",
          "VOCDATE": "2023-10-21T07:24:35.989Z",
          "JOB_NUMBER": "",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "",
          "JOB_DESCRIPTION": "",
          "BRANCH_CODE": "",
          "DESIGN_CODE": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "STOCK_CODE": "",
          "STOCK_DESCRIPTION": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "SIZE": "",
          "PCS": 0,
          "GROSS_WT": 0,
          "STONE_WT": 0,
          "NET_WT": 0,
          "RATE": 0,
          "AMOUNT": 0,
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "UNQ_DESIGN_ID": "",
          "REFMID": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "WASTAGE_QTY": 0,
          "WASTAGE_PER": 0,
          "WASTAGE_AMT": 0,
          "CURRENCY_CODE": "",
          "CURRENCY_RATE": 0,
          "YEARMONTH": "",
          "LOSS_QTY": 0,
          "LABOUR_CODE": "",
          "LAB_RATE": 0,
          "LAB_AMT": 0,
          "BRKSTN_STOCK_CODE": "",
          "BRKSTN_DIVISION_CODE": "",
          "BRKSTN_WEIGHT": 0,
          "BRKSTN_RATEFC": 0,
          "BRKSTN_RATELC": 0,
          "BRKSTN_AMTFC": 0,
          "BRKSTN_AMTLC": 0,
          "MAIN_WORKER": "",
          "FRM_WORKER": "",
          "FRM_PROCESS": "",
          "CRACCODE": "",
          "LAB_ACCODE": "",
          "LAB_AMTFC": 0,
          "TO_PROCESS": "",
          "TO_WORKER": "",
          "LAB_RATEFC": 0,
          "RATEFC": 0,
          "PRINTED": true,
          "PUREWT": 0,
          "PURITY": 0,
          "SQLID": "",
          "ISBROCKEN": 0,
          "TREE_NO": "",
          "SETTED": true,
          "SETTED_PCS": 0,
          "SIEVE": "string",
          "FULL_RECOVERY": 0,
          "RECOVERY_DATE": "2023-10-21T07:24:35.989Z",
          "RECOV_LOSS": 0,
          "RECOV_LOSS_PURE": 0,
          "BROKENSTONE_PCS": 0,
          "BROKENSTONE_WT": 0,
          "ISMISSING": 0,
          "PROCESS_TYPE": "",
          "IS_AUTHORISE": true,
          "SUB_STOCK_CODE": "",
          "KARAT_CODE": "",
          "SIEVE_SET": "",
          "SCRAP_STOCK_CODE": "",
          "SCRAP_SUB_STOCK_CODE": "",
          "SCRAP_PURITY": 0,
          "SCRAP_WT": 0,
          "SCRAP_PURE_WT": 0,
          "SCRAP_PUDIFF": 0,
          "SCRAP_ACCODE": "",
          "SYSTEM_DATE": "2023-10-21T07:24:35.989Z",
          "ISSUE_GROSS_WT": 0,
          "ISSUE_STONE_WT": 0,
          "ISSUE_NET_WT": 0,
          "JOB_PCS": 0,
          "DESIGN_TYPE": "",
          "TO_STOCK_CODE": "",
          "FROM_STOCK_CODE": "",
          "FROM_SUB_STOCK_CODE": "",
          "LOSS_PURE_WT": 0,
          "EXCLUDE_TRANSFER_WT": true,
          "IRON_WT": 0,
          "IRON_SCRAP_WT": 0,
          "GAIN_WT": 0,
          "GAIN_PURE_WT": 0,
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": "",
          "AUTHORIZE_TIME": "2023-10-21T07:24:35.989Z",
          "PUREWTTEMP": 0
        }
      ],
      "JOB_PROCESS_TRN_LABCHRG_DJ": [
        {
          "REFMID": 0,
          "BRANCH_CODE": "",
          "YEARMONTH": "",
          "VOCTYPE": "",
          "VOCNO": 0,
          "SRNO": 0,
          "JOB_NUMBER": "",
          "STOCK_CODE": "",
          "UNQ_JOB_ID": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "PCS": 0,
          "GROSS_WT": 0,
          "LABOUR_CODE": "",
          "LAB_RATE": 0,
          "LAB_ACCODE": "",
          "LAB_AMTFC": 0,
          "UNITCODE": ""
        }
      ]
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
      this.commonService.showSnackBarMsg('Please select Data to delete')
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
        let API = 'JobProcessTrnMasterDJ/DeleteJobProcessTrnMasterDJ/' +
          this.processTransferFrom.value.branchCode + '/' +
          this.processTransferFrom.value.voctype + '/' +
          this.processTransferFrom.value.vocno + '/' +
          this.processTransferFrom.value.yearMonth
        this.commonService.showSnackBarMsg('Loading....')
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            this.commonService.closeSnackBarMsg()
            if (result && result.status == "Success") {
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
              this.commonService.showSnackBarMsg('Error Something went wrong')
            }
          }, err => {
            this.commonService.closeSnackBarMsg()
            this.commonService.showSnackBarMsg('Error Something went wrong')
          })
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
}
