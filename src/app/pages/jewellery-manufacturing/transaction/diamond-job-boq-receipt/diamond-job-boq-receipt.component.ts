import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-diamond-job-boq-receipt',
  templateUrl: './diamond-job-boq-receipt.component.html',
  styleUrls: ['./diamond-job-boq-receipt.component.scss']
})
export class DiamondJobBoqReceiptComponent implements OnInit {
  @Input() content!: any;
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  tableData: any[] = [];
  viewMode:boolean = false;
  private subscriptions: Subscription[] = [];

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  columnhead:any[] = ['SI.No','Design ID','Job Id','Order No','Pcs'];
  columnheadSummary:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','So No','Job ID','unq Job Id','St.Wt','Net Wt','RateFc','RateLC','AmountFC','AmountLC','MetalStone','Purity','Pure.Wt','Broken Stone','Broken Stone','Broken Stock'];
  columnheadSummaryLabour:any[] = ['SI.No','Job ID','Process','Worker','Lab']
  columnheadJobDetails:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','Broken Stone','Broken Stone','Broken Stock']
  columnheadSummaryLabourCharges:any[] = ['Select','SINo','Labour Code','Lab Accode','Division','Unit','Gross Wt','Pcs','Rate','Amount','GST Code','CGST %','CGST Amt','SGST %','SGST Amt','Total %','Total GST','Amount','Currency ']

 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  diamondJobBoqReceipt: FormGroup = this.formBuilder.group({
    vocDate:[new Date(),''],
    voctype:['JBR'],
    vocno:[1],
    enteredBy:[''],
    time:[''],
    karigger:[''],
    kariggerDesc:[''],
    currency:[''],
    currencyDesc:[''],
    baseCurrency:[''],
    baseCurrencyDesc:[''],
    grossWt:[''],
    jobNumber:[''],
    designId:[''],
    process:[''],
    worker:[''],
    labourchrg:[''],
    labourAC:[''],
    wastageWt:[''],
  });

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    //console.log(this.content);
    if (this.content.FLAG == 'VIEW') {
      this.viewFormValues();
    }else if (this.content.FLAG == 'EDIT'){
      this.setFormValues();
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  currencyDataSelected(value: any) {
    console.log(value);
       this.diamondJobBoqReceipt.controls.currency.setValue(value.CURRENCY_CODE);
       this.diamondJobBoqReceipt.controls.currencyDesc.setValue(value.CONV_RATE);
       this.diamondJobBoqReceipt.controls.baseCurrency.setValue(value.CURRENCY_CODE);
       this.diamondJobBoqReceipt.controls.baseCurrencyDesc.setValue(value.CONV_RATE);
  }

  enteredByDataSelected(value: any) {
    console.log(value);
       this.diamondJobBoqReceipt.controls.enteredBy.setValue(value.UsersName);
    
  }
 

  setFormValues() {
    if (!this.content) return
    this.diamondJobBoqReceipt.controls.voctype.setValue(this.content.VOCTYPE)
    this.diamondJobBoqReceipt.controls.vocno.setValue(this.content.VOCNO)
    this.diamondJobBoqReceipt.controls.vocDate.setValue(this.content.VOCDATE)
    this.diamondJobBoqReceipt.controls.enteredBy.setValue(this.content.SMAN)
    this.diamondJobBoqReceipt.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.diamondJobBoqReceipt.controls.currencyDesc.setValue(this.content.CURRENCY_RATE)
    this.diamondJobBoqReceipt.controls.baseCurrency.setValue(this.content.BASE_CURRENCY)
    this.diamondJobBoqReceipt.controls.baseCurrencyDesc.setValue(this.content.BASE_CURR_RATE)
  }

  viewFormValues(){
    this.viewMode = true;
    if (!this.content) return
    this.diamondJobBoqReceipt.controls.voctype.setValue(this.content.VOCTYPE)
    this.diamondJobBoqReceipt.controls.vocno.setValue(this.content.VOCNO)
    this.diamondJobBoqReceipt.controls.vocDate.setValue(this.content.VOCDATE)
    this.diamondJobBoqReceipt.controls.enteredBy.setValue(this.content.SMAN)
    this.diamondJobBoqReceipt.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.diamondJobBoqReceipt.controls.currencyDesc.setValue(this.content.CURRENCY_RATE)
    this.diamondJobBoqReceipt.controls.baseCurrency.setValue(this.content.BASE_CURRENCY)
    this.diamondJobBoqReceipt.controls.baseCurrencyDesc.setValue(this.content.BASE_CURR_RATE)
  }

  formSubmit(){
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.diamondJobBoqReceipt.invalid) {
      this.toastr.error('select all required fields')
      return
    } 

    let API = 'JobBoqReceiptMasterDJ/InsertJobBoqReceiptMaster'
    let postData = {
  "MID": 0,
  "VOCTYPE": this.diamondJobBoqReceipt.value.voctype || "",
  "BRANCH_CODE": this.branchCode,
  "VOCNO": 0,
  "YEARMONTH":  "",
  "VOCDATE": this.diamondJobBoqReceipt.value.vocDate|| "",
  "DOCTIME": "2024-01-17T10:20:08.860Z",
  "SMAN": this.diamondJobBoqReceipt.value.enteredBy|| "",
  "REMARKS": "",
  "NAVSEQNO": 0,
  "ACCODE": "",
  "CURRENCY_CODE": this.diamondJobBoqReceipt.value.currency|| "",
  "CURRENCY_RATE":this.diamondJobBoqReceipt.value.currencyDesc|| "",
  "BASE_CURRENCY": this.diamondJobBoqReceipt.value.baseCurrency|| "",
  "BASE_CURR_RATE": this.diamondJobBoqReceipt.value.baseCurrencyDesc|| "",
  "BASE_CONV_RATE": 0,
  "AUTOPOSTING": true,
  "POSTDATE": "",
  "CONS_VOCTYPE": "",
  "CONS_VOCNO": 0,
  "JPR_VOCTYPE": "",
  "JPR_VOCNO": 0,
  "MREC_VOCTYPE": "",
  "MREC_VOCNO": 0,
  "PRINT_COUNT": 0,
  "INCLUSIVE": 0,
  "GST_STATE_CODE": "",
  "GST_NUMBER": "",
  "GST_TYPE": "",
  "GST_TOTALFC": 0,
  "GST_TOTALCC": 0,
  "GST_GROUP": "",
  "SYSTEM_DATE": "2024-01-17T09:35:25.215Z",
  "HTUSERNAME": "",
  "JOB_BOQRECEIPT_JOBDETAIL_DJ": [
    {
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "SLNO": 0,
      "JOB_NUMBER": "",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "",
      "DESIGN_CODE": "",
      "UNQ_DESIGN_ID": "",
      "ACCODE": "",
      "PCS": 0,
      "PROCESS_CODE": "",
      "WORKER_CODE": "",
      "LAB_ACCODE": "",
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "WIP_ACCODE": "",
      "WASTAGE_WT": 0,
      "WASTAGE_PER": 0,
      "GROSS_WT": 0
    }
  ],
  "JOB_BOQRECEIPT_STNMTL_DJ": [
    {
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "SRNO": 0,
      "COMPSLNO": 0,
      "JOB_NUMBER": "",
      "UNQ_JOB_ID": "",
      "UNQ_DESIGN_ID": "",
      "METALSTONE": "",
      "DIVCODE": "",
      "STOCK_CODE": "",
      "COLOR": "",
      "CLARITY": "",
      "SHAPE": "",
      "SIZE": "",
      "SIEVE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "RATELC": 0,
      "RATEFC": 0,
      "AMOUNTLC": 0,
      "AMOUNTFC": 0,
      "LOCTYPE_CODE": "",
      "DESIGN_CODE": "",
      "STONE_WT": 0,
      "NET_WT": 0,
      "KARAT_CODE": "",
      "PURITY": 0,
      "PURE_WT": 0,
      "JOB_SO_NUMBER": 0,
      "SUB_STOCK_CODE": "",
      "BROKENSTONE_PCS": 0,
      "BROKENSTONE_WT": 0,
      "BRK_STOCKCODE": ""
    }
  ],
  "JOB_BOQRECIEPT_LABOUR": [
    {
      "SRNO": 0,
      "CODE": "",
      "LAB_ACCODE": "",
      "DIVISION_CODE": "",
      "UNITCODE": "",
      "GROSSWT": 0,
      "PCS": 0,
      "RATE": 0,
      "AMOUNT": 0,
      "GST_CODE": "",
      "CGST_PER": 0,
      "CGST_AMT": 0,
      "SGST_PER": 0,
      "SGST_AMT": 0,
      "IGST_PER": 0,
      "IGST_AMT": 0,
      "TOTAL_PER": 0,
      "TOTAL_GST": 0,
      "TOTAL_AMT": 0,
      "HSN_CODE": "",
      "BRANCH_CODE": "",
      "VOCTYPE": "",
      "VOCNO": 0,
      "YEARMONTH": "",
      "CURRENCYCODE": "",
      "CGST_ACCODE": "",
      "SGST_ACCODE": "",
      "IGST_ACCODE": "",
      "CGST_CTL_ACCODE": "",
      "SGST_CTL_ACCODE": "",
      "IGST_CTL_ACCODE": "",
      "JOB_NUMBER": "",
      "UNQ_JOB_ID": "",
      "STOCK_CODE": ""
    }
  ]

    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondJobBoqReceipt.reset()
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
    if (this.diamondJobBoqReceipt.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobBoqReceiptMasterDJ/UpdateJobBoqReceiptMaster/' + this.branchCode +'/'+ this.diamondJobBoqReceipt.value.voctype +'/'+ this.diamondJobBoqReceipt.value.vocno +'/'+ this.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": this.diamondJobBoqReceipt.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO":  0,
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.diamondJobBoqReceipt.value.vocDate|| "",
      "DOCTIME": "2024-01-17T10:20:08.860Z",
      "SMAN": this.diamondJobBoqReceipt.value.enteredBy|| "",
      "REMARKS": "",
      "NAVSEQNO": 0,
      "ACCODE": "",
      "CURRENCY_CODE": this.diamondJobBoqReceipt.value.currency|| "",
      "CURRENCY_RATE":this.diamondJobBoqReceipt.value.currencyDesc|| "",
      "BASE_CURRENCY": this.diamondJobBoqReceipt.value.baseCurrency|| "",
      "BASE_CURR_RATE": this.diamondJobBoqReceipt.value.baseCurrencyDesc|| "",
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "CONS_VOCTYPE": "",
      "CONS_VOCNO": 0,
      "JPR_VOCTYPE": "",
      "JPR_VOCNO": 0,
      "MREC_VOCTYPE": "",
      "MREC_VOCNO": 0,
      "PRINT_COUNT": 0,
      "INCLUSIVE": 0,
      "GST_STATE_CODE": "",
      "GST_NUMBER": "",
      "GST_TYPE": "",
      "GST_TOTALFC": 0,
      "GST_TOTALCC": 0,
      "GST_GROUP": "",
      "SYSTEM_DATE": "2024-01-17T09:35:25.215Z",
      "HTUSERNAME": "",
      "JOB_BOQRECEIPT_JOBDETAIL_DJ": [
        {
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "SLNO": 0,
          "JOB_NUMBER": "",
          "JOB_SO_NUMBER": 0,
          "UNQ_JOB_ID": "",
          "DESIGN_CODE": "",
          "UNQ_DESIGN_ID": "",
          "ACCODE": "",
          "PCS": 0,
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "LAB_ACCODE": "",
          "LAB_AMOUNTFC": 0,
          "LAB_AMOUNTLC": 0,
          "WIP_ACCODE": "",
          "WASTAGE_WT": 0,
          "WASTAGE_PER": 0,
          "GROSS_WT": 0
        }
      ],
      "JOB_BOQRECEIPT_STNMTL_DJ": [
        {
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "SRNO": 0,
          "COMPSLNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "UNQ_DESIGN_ID": "",
          "METALSTONE": "",
          "DIVCODE": "",
          "STOCK_CODE": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "SIZE": "",
          "SIEVE": "",
          "PCS": 0,
          "GROSS_WT": 0,
          "RATELC": 0,
          "RATEFC": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "LOCTYPE_CODE": "",
          "DESIGN_CODE": "",
          "STONE_WT": 0,
          "NET_WT": 0,
          "KARAT_CODE": "",
          "PURITY": 0,
          "PURE_WT": 0,
          "JOB_SO_NUMBER": 0,
          "SUB_STOCK_CODE": "",
          "BROKENSTONE_PCS": 0,
          "BROKENSTONE_WT": 0,
          "BRK_STOCKCODE": ""
        }
      ],
      "JOB_BOQRECIEPT_LABOUR": [
        {
          "SRNO": 0,
          "CODE": "",
          "LAB_ACCODE": "",
          "DIVISION_CODE": "",
          "UNITCODE": "",
          "GROSSWT": 0,
          "PCS": 0,
          "RATE": 0,
          "AMOUNT": 0,
          "GST_CODE": "",
          "CGST_PER": 0,
          "CGST_AMT": 0,
          "SGST_PER": 0,
          "SGST_AMT": 0,
          "IGST_PER": 0,
          "IGST_AMT": 0,
          "TOTAL_PER": 0,
          "TOTAL_GST": 0,
          "TOTAL_AMT": 0,
          "HSN_CODE": "",
          "BRANCH_CODE": "",
          "VOCTYPE": "",
          "VOCNO": 0,
          "YEARMONTH": "",
          "CURRENCYCODE": "",
          "CGST_ACCODE": "",
          "SGST_ACCODE": "",
          "IGST_ACCODE": "",
          "CGST_CTL_ACCODE": "",
          "SGST_CTL_ACCODE": "",
          "IGST_CTL_ACCODE": "",
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "STOCK_CODE": ""
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
                this.diamondJobBoqReceipt.reset()
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
    if (!this.content.MID) {
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
        let API = 'JobBoqReceiptMasterDJ/DeleteJobBoqReceiptMaster/' + this.branchCode + this.diamondJobBoqReceipt.value.voctype + this.diamondJobBoqReceipt.value.vocno + this.yearMonth
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
                    this.diamondJobBoqReceipt.reset()
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
                    this.diamondJobBoqReceipt.reset()
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
