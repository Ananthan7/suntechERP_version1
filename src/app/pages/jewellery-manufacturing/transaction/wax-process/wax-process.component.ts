import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './wax-process.component.html',
  styleUrls: ['./wax-process.component.scss']
})
export class WaxProcessComponent implements OnInit {

  columnhead:any[] = ['SRNO','Job Number','Design', 'Party','S.O','SO.Date ','Del.Date','Gross.Wt','Metal Wt','Stone.Wt','Ord.Pcs','Issue Pcs'];
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any; 
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  vocMaxDate = new Date();
  currentDate = new Date();
  
  userName = localStorage.getItem('username');
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



 ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
  }



  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocdate:[''],
    vocno:[''],
    processcode:[''],
    workercode:[''],
    enteredBy : [''],
    remarks:[''],
  });

  userDataSelected(value: any) {
    console.log(value);
       this.waxprocessFrom.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.processcode.setValue(e.Process_Code);

  }

  
  WorkerCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.workercode.setValue(e.WORKER_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){ 
  
  }
  
  deleteTableData(){
   
  }

formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.waxprocessFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxIssue/InsertJobWaxIssue'
  let postData = {
  "MID": 0,
  "VOCTYPE": this.waxprocessFrom.value.voctype,
  "BRANCH_CODE": this.branchCode,
  "VOCNO": this.waxprocessFrom.value.vocno,
  "VOCDATE": this.waxprocessFrom.value.vocdate,
  "YEARMONTH": this.yearMonth,
  "DOCTIME": "2023-10-20T10:24:24.037Z",
  "PROCESS_CODE": this.waxprocessFrom.value.processcode,
  "WORKER_CODE": this.waxprocessFrom.value.workercode,
  "TOTAL_PCS": 0,
  "TOTAL_GROSS_WT": 0,
  "TOTAL_STONE_WT": 0,
  "SMAN": this.waxprocessFrom.value.enteredBy,
  "REMARKS": this.waxprocessFrom.value.remarks,
  "NAVSEQNO": 0,
  "AUTOPOSTING": true,
  "POSTDATE": "",
  "PRINT_COUNT": 0,
  "SYSTEM_DATE": "2023-10-20T10:24:24.037Z",
  "Details": [
    {
      "UNIQUEID": 0,
      "DT_VOCTYPE": "str",
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "SRNO": 0,
      "JOB_NUMBER": "str",
      "UNQ_JOB_ID": "",
      "PROCESS_CODE": "",
      "WORKER_CODE": "",
      "DESIGN_CODE": "",
      "PARTYCODE": "",
      "ISSUE_PCS": 0,
      "TOTAL_PCS": 0,
      "UNQ_DESIGN_ID": "",
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0
    }
  ]
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
              this.waxprocessFrom.reset()
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

update(){
  if (this.waxprocessFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'ApprovalMaster/UpdateApprovalMaster/'+this.content.APPR_CODE
  let postData = {
    "APPR_CODE": this.waxprocessFrom.value.code || "",
    "APPR_DESCRIPTION": this.waxprocessFrom.value.description || "",
    "MID": this.content.MID,
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
              this.waxprocessFrom.reset()
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
      let API = 'ApprovalMaster/DeleteApprovalMaster/' + this.content.APPR_CODE
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
                  this.waxprocessFrom.reset()
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
                  this.waxprocessFrom.reset()
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
