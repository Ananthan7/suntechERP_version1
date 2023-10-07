import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StoneReturnDetailsComponent } from './stone-return-details/stone-return-details.component';

@Component({
  selector: 'app-stone-return',
  templateUrl: './stone-return.component.html',
  styleUrls: ['./stone-return.component.scss']
})
export class StoneReturnComponent implements OnInit {
  

  columnhead:any[] = ['Sl No','VOCNO','VOCTYPE','VOCDATE','JOB_NO','JOB_DATE','JOB_SO','UNQ_JOB','JOB_DE','BRANCH' ];
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
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddstonereturndetails() {
    const modalRef: NgbModalRef = this.modalService.open(StoneReturnDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }


  stonereturnFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
    vocdate:[''],
   basecurrency:[''],
   basecurrencyrate:[''],
   currency:[''],
   currencyrate:[''],
   worker:[''],
   workername:[''],
    remark:[''],
  });



 CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'currency',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  CurrencyCodeSelected(e:any){
    console.log(e);
    this.stonereturnFrom.controls.currency.setValue(e.CURRENCY_CODE);
  }



  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  WorkerCodeSelected(e:any){
    console.log(e);
    this.stonereturnFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-06T10:14:55.770Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-06T10:14:55.770Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-06T10:14:55.770Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "SRNO": 0,
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-06T10:14:55.770Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "DESIGN_CODE": "string",
      "DIVCODE": "s",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SIEVE": "string",
      "SHAPE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "PCS": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "string",
      "PROCESS_NAME": "string",
      "WORKER_CODE": "string",
      "WORKER_NAME": "string",
      "UNQ_DESIGN_ID": "string",
      "WIP_ACCODE": "string",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": "string",
      "STOCK_CODE_BRK": "string",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "ISBROCKEN": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "RET_TO_DESC": "string",
      "PICTURE_NAME": "string",
      "RET_TO": "string",
      "ISMISSING": 0,
      "SIEVE_SET": "string",
      "SUB_STOCK_CODE": "string",
    };
    this.tableData.push(data);
}
removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.stonereturnFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneReturnMasterDJ/InsertJobStoneReturnMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.stonereturnFrom.value.voctype || "",
      "BRANCH_CODE": "string",
      "VOCNO": this.stonereturnFrom.value.vocno || "",
      "VOCDATE": this.stonereturnFrom.value.vocdate || "",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-06T10:14:55.770Z",
      "CURRENCY_CODE": this.stonereturnFrom.value.currency || "",
      "CURRENCY_RATE": this.stonereturnFrom.value.currencyrate || "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": "string",
      "REMARKS": this.stonereturnFrom.value.remark || "",
      "NAVSEQNO": 0,
      "BASE_CURRENCY": this.stonereturnFrom.value.basecurrency || "",
      "BASE_CURR_RATE": this.stonereturnFrom.value.basecurrencyrate || "",
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-06T10:14:55.770Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "SRNO": 0,
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-06T10:14:55.770Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "DESIGN_CODE": "string",
      "DIVCODE": "s",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SIEVE": "string",
      "SHAPE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "PCS": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "string",
      "PROCESS_NAME": "string",
      "WORKER_CODE": this.stonereturnFrom.value.worker || "",
      "WORKER_NAME": this.stonereturnFrom.value.workername || "",
      "UNQ_DESIGN_ID": "string",
      "WIP_ACCODE": "string",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": "string",
      "STOCK_CODE_BRK": "string",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "ISBROCKEN": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "RET_TO_DESC": "string",
      "PICTURE_NAME": "string",
      "RET_TO": "string",
      "ISMISSING": 0,
      "SIEVE_SET": "string",
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
                this.stonereturnFrom.reset()
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
    
    this.stonereturnFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.stonereturnFrom.controls.vocno.setValue(this.content.VOCNO)
    this.stonereturnFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.stonereturnFrom.controls.basecurrency.setValue(this.content.BASE_CURRENCY)
    this.stonereturnFrom.controls.basecurrencyrate.setValue(this.content.BASE_CURR_RATE)
    this.stonereturnFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.stonereturnFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    this.stonereturnFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stonereturnFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stonereturnFrom.controls.remark.setValue(this.content.REMARKS)

    

  }


  update(){
    if (this.stonereturnFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneReturnMasterDJ/UpdateJobStoneReturnMasterDJ/'+ this.stonereturnFrom.value.voctype + this.stonereturnFrom.value.vocno + this.stonereturnFrom.value.vocdate
    let postData = {
      "MID": 0,
      "VOCTYPE": this.stonereturnFrom.value.voctype || "",
      "BRANCH_CODE": "string",
      "VOCNO": this.stonereturnFrom.value.vocno || "",
      "VOCDATE": this.stonereturnFrom.value.vocdate || "",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-06T10:14:55.770Z",
      "CURRENCY_CODE": this.stonereturnFrom.value.currency || "",
      "CURRENCY_RATE": this.stonereturnFrom.value.currencyrate || "",
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": "string",
      "REMARKS": this.stonereturnFrom.value.remark || "",
      "NAVSEQNO": 0,
      "BASE_CURRENCY": this.stonereturnFrom.value.basecurrency || "",
      "BASE_CURR_RATE": this.stonereturnFrom.value.basecurrencyrate || "",
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-06T10:14:55.770Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "SRNO": 0,
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-06T10:14:55.770Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "DESIGN_CODE": "string",
      "DIVCODE": "s",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SIEVE": "string",
      "SHAPE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "PCS": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "string",
      "PROCESS_NAME": "string",
      "WORKER_CODE": this.stonereturnFrom.value.worker || "",
      "WORKER_NAME": this.stonereturnFrom.value.workername || "",
      "UNQ_DESIGN_ID": "string",
      "WIP_ACCODE": "string",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": "string",
      "STOCK_CODE_BRK": "string",
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "WASTAGE_AMT": 0,
      "ISBROCKEN": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "RET_TO_DESC": "string",
      "PICTURE_NAME": "string",
      "RET_TO": "string",
      "ISMISSING": 0,
      "SIEVE_SET": "string",
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
                this.stonereturnFrom.reset()
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
        let API = 'JobStoneReturnMasterDJ/DeleteJobStoneReturnMasterDJ/' + this.stonereturnFrom.value.voctype + this.stonereturnFrom.value.vocno + this.stonereturnFrom.value.vocdate
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
                    this.stonereturnFrom.reset()
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
                    this.stonereturnFrom.reset()
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
