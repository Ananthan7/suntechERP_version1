import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { StoneIssueDetailComponent } from './stone-issue-detail/stone-issue-detail.component';

@Component({
  selector: 'app-stone-issue',
  templateUrl: './stone-issue.component.html',
  styleUrls: ['./stone-issue.component.scss']
})
export class StoneIssueComponent implements OnInit {

  currentFilter: any;

  divisionMS: any = 'ID';

  columnhead:any[] = ['SR NO','JOB NO','UNQ JOD ID', 'Design','Stock Code','Description ','Division','Carat','Rate','Amount'];
  @Input() content!: any; 
  tableData: any[] = [];
  stoneIssueData : any[] =[];
  userName = localStorage.getItem('username');
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
 

  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'currency',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }




  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  userDataSelected(value: any) {
    console.log(value);
       this.stoneissueFrom.controls.enteredBy.setValue(value.UsersName);
  }

  CurrencyCodeSelected(e:any){
    console.log(e);
    this.stoneissueFrom.controls.currency.setValue(e.CURRENCY_CODE);
  }

  WorkerCodeSelected(e:any){
    console.log(e);
    this.stoneissueFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  openaddstoneissuedetail() {
    const modalRef: NgbModalRef = this.modalService.open(StoneIssueDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.stoneIssueData.push(postData);
      }
    });

  }


  stoneissueFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
    vocdate:[''],
    enteredBy:[''],
   basecurrency:[''],
   basecurrencyrate:[''],
   currency:[''],
   currencyrate:[''],
   worker:[''],
   workername:[''],
    narration:[''],
  });

removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.stoneissueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = {
  "MID": 0,
  "VOCTYPE": this.stoneissueFrom.value.voctype || "",
  "BRANCH_CODE": this.branchCode,
  "VOCNO": this.stoneissueFrom.value.vocno || "",
  "VOCDATE": this.stoneissueFrom.value.vocdate || "",
  "YEARMONTH": this.yearMonth,
  "DOCTIME": "2023-10-19T06:55:16.030Z",
  "CURRENCY_CODE": this.stoneissueFrom.value.currency || "",
  "CURRENCY_RATE": this.stoneissueFrom.value.currencyrate || "",
  "TOTAL_PCS": 0,
  "TOTAL_GROSS_WT": 0,
  "TOTAL_AMOUNTFC": 0,
  "TOTAL_AMOUNTLC": 0,
  "SMAN": this.stoneissueFrom.value.enteredBy,
  "REMARKS": this.stoneissueFrom.value.narration || "",
  "NAVSEQNO": 0,
  "BASE_CURRENCY": this.stoneissueFrom.value.basecurrency || "",
  "BASE_CURR_RATE": this.stoneissueFrom.value.basecurrencyrate || "",
  "BASE_CONV_RATE": 0,
  "AUTOPOSTING": true,
  "POSTDATE": "",
  "SYSTEM_DATE": "2023-10-19T06:55:16.030Z",
  "PRINT_COUNT": 0,
  "PRINT_COUNT_ACCOPY": 0,
  "PRINT_COUNT_CNTLCOPY": 0,
  "Details": this.stoneIssueData,
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
                this.stoneissueFrom.reset()
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
    
    this.stoneissueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.stoneissueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.stoneissueFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.stoneissueFrom.controls.basecurrency.setValue(this.content.BASE_CURRENCY)
    this.stoneissueFrom.controls.basecurrencyrate.setValue(this.content.BASE_CURR_RATE)
    this.stoneissueFrom.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.stoneissueFrom.controls.currencyrate.setValue(this.content.CURRENCY_RATE)
    this.stoneissueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneissueFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneissueFrom.controls.narration.setValue(this.content.REMARKS)
  }


  update(){
    if (this.stoneissueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/'+ this.stoneissueFrom.value.branchCode + this.stoneissueFrom.value.voctype + this.stoneissueFrom.value.vocno + this.stoneissueFrom.value.yearMonth
    let postData = {
      "MID": 0,
  "VOCTYPE": this.stoneissueFrom.value.voctype || "",
  "BRANCH_CODE": this.branchCode,
  "VOCNO": this.stoneissueFrom.value.vocno || "",
  "VOCDATE": this.stoneissueFrom.value.vocdate || "",
  "YEARMONTH": this.yearMonth,
  "DOCTIME": "2023-10-19T06:55:16.030Z",
  "CURRENCY_CODE": this.stoneissueFrom.value.currency || "",
  "CURRENCY_RATE": this.stoneissueFrom.value.currencyrate || "",
  "TOTAL_PCS": 0,
  "TOTAL_GROSS_WT": 0,
  "TOTAL_AMOUNTFC": 0,
  "TOTAL_AMOUNTLC": 0,
  "SMAN": "string",
  "REMARKS": this.stoneissueFrom.value.narration || "",
  "NAVSEQNO": 0,
  "BASE_CURRENCY": this.stoneissueFrom.value.basecurrency || "",
  "BASE_CURR_RATE": this.stoneissueFrom.value.basecurrencyrate || "",
  "BASE_CONV_RATE": 0,
  "AUTOPOSTING": true,
  "POSTDATE": "string",
  "SYSTEM_DATE": "2023-10-19T06:55:16.030Z",
  "PRINT_COUNT": 0,
  "PRINT_COUNT_ACCOPY": 0,
  "PRINT_COUNT_CNTLCOPY": 0,
  "Details": [
    {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": "str",
      "VOCDATE": "2023-10-19T06:55:16.030Z",
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-19T06:55:16.030Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "BRANCH_CODE": "string",
      "DESIGN_CODE": "string",
      "DIVCODE": "s",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SIEVE": "string",
      "SHAPE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
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
      "PICTURE_NAME": "string",
      "PART_CODE": "string",
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "CONSIGNMENT": 0,
      "SIEVE_SET": "string",
      "SUB_STOCK_CODE": "string",
      "D_REMARKS": "string",
      "SIEVE_DESC": "string",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": "string"
    }
  ] 
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
                this.stoneissueFrom.reset()
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.stoneissueFrom.value.branchCode +  this.stoneissueFrom.value.voctype + this.stoneissueFrom.value.vocno + this.stoneissueFrom.value.yearMonth
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
                    this.stoneissueFrom.reset()
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
                    this.stoneissueFrom.reset()
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
