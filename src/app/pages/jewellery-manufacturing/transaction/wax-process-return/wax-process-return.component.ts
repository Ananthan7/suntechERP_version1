import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wax-process-return',
  templateUrl: './wax-process-return.component.html',
  styleUrls: ['./wax-process-return.component.scss']
})
export class WaxProcessReturnComponent implements OnInit {
  currentFilter: any;


  columnhead:any[] = ['Sr No','Job No','Design','Party','S.O','S.O.Date', 'Del.Date','Gross Weight','Metal Weight','Stone Weight','Wax Weight','Issue Pcs','Return Pcs','Karat'];
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  
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

 

  WaxCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID:  3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Wax Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocDate : [''],
    vocno:[''],
    enteredBy : [''],
    process:[''],
    worker:[''],
    toworker:[''],
    toprocess:[''],
    waxcode:[''],
    remark:[''],
   });


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

  userDataSelected(value: any) {
    console.log(value);
       this.waxprocessFrom.controls.enteredBy.setValue(value.UsersName);
  }

  WorkerCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.worker.setValue(e.WORKER_CODE);
    this.waxprocessFrom.controls.toworker.setValue(e.WORKER_CODE);
  }

  WaxCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.waxcode.setValue(e.CODE);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.process.setValue(e.Process_Code);
    this.waxprocessFrom.controls.toprocess.setValue(e.Process_Code);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

    removedata(){
      this.tableData.pop();
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
  
    let API = 'JobWaxReturn/InsertJobWaxReturn'
    let postData = {
        "MID": 0,
        "VOCTYPE": this.waxprocessFrom.value.voctype || "",
        "BRANCH_CODE": this.branchCode,
        "VOCNO": this.waxprocessFrom.value.vocno || "",
        "VOCDATE": this.waxprocessFrom.value.vocDate || "",
        "YEARMONTH": this.yearMonth,
        "DOCTIME": "2023-10-19T05:34:05.288Z",
        "PROCESS_CODE": this.waxprocessFrom.value.process || "",
        "WORKER_CODE": this.waxprocessFrom.value.worker || "",
        "SMAN": "",
        "REMARKS": this.waxprocessFrom.value.remark || "",
        "NAVSEQNO": 0,
        "AUTOPOSTING": true,
        "POSTDATE": "",
        "PRINT_COUNT": 0,
        "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
        "TO_WORKER_CODE": this.waxprocessFrom.value.toworker || "",
        "DIVISION_CODE": "",
        "STOCK_CODE": "",
        "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
        "HTUSERNAME": this.waxprocessFrom.value.enteredBy,
        "Details": [
          {
            "UNIQUEID": 0,
            "DT_VOCTYPE": "JWA",
            "DT_BRANCH_CODE": this.branchCode,
            "DT_VOCNO": 10,
            "DT_YEARMONTH": this.yearMonth,
            "SRNO": 0,
            "JOB_NUMBER": "12",
            "UNQ_JOB_ID": "",
            "PROCESS_CODE": "",
            "WORKER_CODE": "",
            "DESIGN_CODE": "",
            "PARTYCODE": "",
            "ISSUE_PCS": 0,
            "RETURN_PCS": 0,
            "ISSUE_VOCTYPE": "",
            "ISSUE_BRANCH_CODE": "",
            "ISSUE_VOCNO": 0,
            "ISSUE_YEARMONTH": "",
            "TO_PROCESS_CODE": "",
            "TO_WORKER_CODE": "",
            "IS_AUTHORISE": true,
            "GROSS_WT": 0,
            "METAL_WT": 0,
            "STONE_WT": 0,
            "WAX_WT": 0,
            "JOB_PCS": 0,
            "AUTHORIZE_TIME": "2023-10-19T05:34:05.288Z",
            "IS_REJECT": true,
            "REASON": "",
            "REJ_REMARKS": "",
            "ATTACHMENT_FILE": ""
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
  
    let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.waxprocessFrom.value.branchCode + this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.waxprocessFrom.value.vocno || "",
      "VOCDATE": this.waxprocessFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-19T05:34:05.288Z",
      "PROCESS_CODE": this.waxprocessFrom.value.process || "",
      "WORKER_CODE": this.waxprocessFrom.value.worker || "",
      "SMAN": "",
      "REMARKS": this.waxprocessFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
      "TO_WORKER_CODE": this.waxprocessFrom.value.toworker || "",
      "DIVISION_CODE": "",
      "STOCK_CODE": "",
      "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
      "HTUSERNAME": this.waxprocessFrom.value.enteredBy,
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_VOCTYPE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "SRNO": 0,
          "JOB_NUMBER": "",
          "UNQ_JOB_ID": "",
          "PROCESS_CODE": "",
          "WORKER_CODE": "",
          "DESIGN_CODE": "",
          "PARTYCODE": "",
          "ISSUE_PCS": 0,
          "RETURN_PCS": 0,
          "ISSUE_VOCTYPE": "",
          "ISSUE_BRANCH_CODE": "",
          "ISSUE_VOCNO": 0,
          "ISSUE_YEARMONTH": "",
          "TO_PROCESS_CODE": "",
          "TO_WORKER_CODE": "",
          "IS_AUTHORISE": true,
          "GROSS_WT": 0,
          "METAL_WT": 0,
          "STONE_WT": 0,
          "WAX_WT": 0,
          "JOB_PCS": 0,
          "AUTHORIZE_TIME": "2023-10-19T05:34:05.288Z",
          "IS_REJECT": true,
          "REASON": "",
          "REJ_REMARKS": "",
          "ATTACHMENT_FILE": ""
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
        let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.waxprocessFrom.value.branchCode + this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.yearMonth
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
