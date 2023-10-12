import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-melting-issue-details',
  templateUrl: './melting-issue-details.component.html',
  styleUrls: ['./melting-issue-details.component.scss']
})
export class MeltingIssueDetailsComponent implements OnInit {

  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
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

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'jobno',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.jobno.setValue(e.PREFIX_CODE);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'time',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.time.setValue(e.CODE);
  }


  constructor(    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

    
  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingIssuedetailsFrom: FormGroup = this.formBuilder.group({
    jobno:[''],
    jobdes:[''],
    jobpurity:[''],
    process:[''],
    processdes:[''],
    worker:[''],
    workerdes:[''],
    treeno:[''],
    stockcode:[''],
    stockdes:[''],
    tostock:[''],
    mainstock:[''],
    grossweight:[''],
    purity:[''],
    lossweight:[''],
    diffgrwt:[''],
    waxweight:[''],
    stoneweight:[''],
    remarks:[''],
    lotno:[''],
    tgold:[''],
    silver:[''],
    ticketno:[''],
    barno:[''],
    location:[''],
    pcs:[''],
    netweight:[''],
    pureweight:[''],
    topurity:['']
  });


  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.meltingIssuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2023-10-12T06:10:04.367Z",
      "YEARMONTH": "string",
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssuedetailsFrom.value.worker || "",
      "WORKER_DESC": this.meltingIssuedetailsFrom.value.workerdes || "",
      "SALESPERSON_CODE": "string",
      "SALESPERSON_NAME": "string",
      "DOCTIME": "2023-10-12T06:10:04.367Z",
      "TOTAL_GROSSWT": 0,
      "TOTAL_PUREWT": 0,
      "TOTAL_STONEWT": 0,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssuedetailsFrom.value.jobno || "",
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingIssuedetailsFrom.value.process || "",
      "PROCESS_DESC": this.meltingIssuedetailsFrom.value.processdes || "",
      "PRINT_COUNT": 0,
      "MELTING_TYPE": "string",
      "COLOR": "string",
      "RET_STOCK_CODE": "string",
      "RET_GROSS_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_LOCATION_CODE": "string",
      "SCP_STOCK_CODE": "string",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "string",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
      "SYSTEM_DATE": "2023-10-12T06:10:04.367Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-10-12T06:10:04.367Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingIssuedetailsFrom.value.jobno || "",
      "JOB_DESCRIPTION": this.meltingIssuedetailsFrom.value.jobdes || "",
      "STOCK_CODE": this.meltingIssuedetailsFrom.value.stockcode || "",
      "STOCK_DESCRIPTION": this.meltingIssuedetailsFrom.value.stockdes || "",
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": 0,
      "GROSS_WT":this.meltingIssuedetailsFrom.value.grossweight || "",
      "STONE_WT":this.meltingIssuedetailsFrom.value.stoneweight || "",
      "PURITY": this.meltingIssuedetailsFrom.value.purity || "",
      "PUREWT": this.meltingIssuedetailsFrom.value.pureweight || "",
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT":this.meltingIssuedetailsFrom.value.netweight || "",
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingIssuedetailsFrom.value.waxweight || "",
      "TREE_NO": this.meltingIssuedetailsFrom.value.treeno || "",
      "WIP_ACCODE": "string",
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "LOCTYPE_CODE": this.meltingIssuedetailsFrom.value.location || "",
      "TOSTOCKCODE": this.meltingIssuedetailsFrom.value.tostock || "",
      "LOSSWT":this.meltingIssuedetailsFrom.value.lossweight || "",
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingIssuedetailsFrom.value.lotno || "",
      "BAR_NO": this.meltingIssuedetailsFrom.value.barno || "",
      "TICKET_NO": this.meltingIssuedetailsFrom.value.ticketno || "",
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": this.meltingIssuedetailsFrom.value.topurity || "",
      "PUR_PER": 0,
      "ISALLOY": "s",
      "UNQ_JOB_ID": "string",
      "SUB_STOCK_CODE": "string",
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
                this.meltingIssuedetailsFrom.reset()
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
    this.meltingIssuedetailsFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssuedetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.meltingIssuedetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssuedetailsFrom.controls.workerdes.setValue(this.content.WORKER_DESC)
    this.meltingIssuedetailsFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssuedetailsFrom.controls.stockcode.setValue(this.content.STOCK_CODE)
    this.meltingIssuedetailsFrom.controls.stockdes.setValue(this.content.STOCK_DESCRIPTION)
    this.meltingIssuedetailsFrom.controls.grossweight.setValue(this.content.GROSS_WT)
    this.meltingIssuedetailsFrom.controls.stoneweight.setValue(this.content.STONE_WT)
    this.meltingIssuedetailsFrom.controls.purity.setValue(this.content.PURITY)
    this.meltingIssuedetailsFrom.controls.pureweight.setValue(this.content.PUREWT)
    this.meltingIssuedetailsFrom.controls.netweight.setValue(this.content.NET_WT)
    this.meltingIssuedetailsFrom.controls.waxweight.setValue(this.content.WAX_WT)
    this.meltingIssuedetailsFrom.controls.treeno.setValue(this.content.TREE_NO)
    this.meltingIssuedetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.meltingIssuedetailsFrom.controls.tostock.setValue(this.content.TOSTOCKCODE)
    this.meltingIssuedetailsFrom.controls.lossweight.setValue(this.content.LOSSWT)
    this.meltingIssuedetailsFrom.controls.lotno.setValue(this.content.LOT_NO)
    this.meltingIssuedetailsFrom.controls.barno.setValue(this.content.BAR_NO)
    this.meltingIssuedetailsFrom.controls.ticketno.setValue(this.content.TICKET_NO)
    this.meltingIssuedetailsFrom.controls.topurity.setValue(this.content.TOPURITY)
    this.meltingIssuedetailsFrom.controls.remark.setValue(this.content.REMARKS)
  }


  update(){
    if (this.meltingIssuedetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/'+ this.meltingIssuedetailsFrom.value.voctype + this.meltingIssuedetailsFrom.value.vocno + this.meltingIssuedetailsFrom.value.vocdate
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2023-10-12T06:10:04.367Z",
      "YEARMONTH": "string",
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssuedetailsFrom.value.worker || "",
      "WORKER_DESC": this.meltingIssuedetailsFrom.value.workerdes || "",
      "SALESPERSON_CODE": "string",
      "SALESPERSON_NAME": "string",
      "DOCTIME": "2023-10-12T06:10:04.367Z",
      "TOTAL_GROSSWT": 0,
      "TOTAL_PUREWT": 0,
      "TOTAL_STONEWT": 0,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssuedetailsFrom.value.jobno || "",
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingIssuedetailsFrom.value.process || "",
      "PROCESS_DESC": this.meltingIssuedetailsFrom.value.processdes || "",
      "PRINT_COUNT": 0,
      "MELTING_TYPE": "string",
      "COLOR": "string",
      "RET_STOCK_CODE": "string",
      "RET_GROSS_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_LOCATION_CODE": "string",
      "SCP_STOCK_CODE": "string",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "string",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
      "SYSTEM_DATE": "2023-10-12T06:10:04.367Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-10-12T06:10:04.367Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingIssuedetailsFrom.value.jobno || "",
      "JOB_DESCRIPTION": this.meltingIssuedetailsFrom.value.jobdes || "",
      "STOCK_CODE": this.meltingIssuedetailsFrom.value.stockcode || "",
      "STOCK_DESCRIPTION": this.meltingIssuedetailsFrom.value.stockdes || "",
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": 0,
      "GROSS_WT":this.meltingIssuedetailsFrom.value.grossweight || "",
      "STONE_WT":this.meltingIssuedetailsFrom.value.stoneweight || "",
      "PURITY": this.meltingIssuedetailsFrom.value.purity || "",
      "PUREWT": this.meltingIssuedetailsFrom.value.pureweight || "",
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT":this.meltingIssuedetailsFrom.value.netweight || "",
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingIssuedetailsFrom.value.waxweight || "",
      "TREE_NO": this.meltingIssuedetailsFrom.value.treeno || "",
      "WIP_ACCODE": "string",
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "LOCTYPE_CODE": this.meltingIssuedetailsFrom.value.location || "",
      "TOSTOCKCODE": this.meltingIssuedetailsFrom.value.tostock || "",
      "LOSSWT":this.meltingIssuedetailsFrom.value.lossweight || "",
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingIssuedetailsFrom.value.lotno || "",
      "BAR_NO": this.meltingIssuedetailsFrom.value.barno || "",
      "TICKET_NO": this.meltingIssuedetailsFrom.value.ticketno || "",
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": this.meltingIssuedetailsFrom.value.topurity || "",
      "PUR_PER": 0,
      "ISALLOY": "s",
      "UNQ_JOB_ID": "string",
      "SUB_STOCK_CODE": "string",
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
                this.meltingIssuedetailsFrom.reset()
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
        let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' + this.meltingIssuedetailsFrom.value.voctype + this.meltingIssuedetailsFrom.value.vocno + this.meltingIssuedetailsFrom.value.vocdate
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
                    this.meltingIssuedetailsFrom.reset()
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
                    this.meltingIssuedetailsFrom.reset()
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
