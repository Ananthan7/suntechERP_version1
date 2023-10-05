import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    console.log(this.content);
    if(this.content){
      this.setFormValues()
    }
  }

  setFormValues() {
    if(!this.content) return

    this.waxprocessFrom.controls.code.setValue(this.content.VOCTYPE)
    this.waxprocessFrom.controls.description.setValue(this.content.VOCNO)
    this.waxprocessFrom.controls.description.setValue(this.content.PROCESS_CODE)
    this.waxprocessFrom.controls.description.setValue(this.content.WORKER_CODE)
    this.waxprocessFrom.controls.description.setValue(this.content.userName)
    this.waxprocessFrom.controls.description.setValue(this.content.REMARKS)
   

    this.dataService.getDynamicAPI('ApprovalMaster/GetApprovalMasterDetail/'+this.content.APPR_CODE).subscribe((data) => {
      if (data.status == 'Success') {
        this.tableData = data.response.approvalDetails;
      }
    });   
  }

  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocdate:[''],
    vocno:[''],
   processcode:[''],
    workercode:[''],
    remarks:[''],
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.processcode.setValue(e.Process_Code);

  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  WorkerCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.workercode.setValue(e.WORKER_CODE);

  }

  EnteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  EnteredCodeSelected(e:any){
    console.log(e);
    this.waxprocessFrom.controls.color.setValue(e.WORKER_CODE);

  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "UNIQUEID": 0,
      "DT_VOCTYPE": "str",
      "DT_BRANCH_CODE": "string",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "SRNO": srno,
      "JOB_NUMBER": "string",
      "UNQ_JOB_ID": "string",
      "PROCESS_CODE": "string",
      "WORKER_CODE": "string",
      "DESIGN_CODE": "string",
      "PARTYCODE": "string",
      "ISSUE_PCS": 0,
      "TOTAL_PCS": 0,
      "UNQ_DESIGN_ID": "string",
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0
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
  if (this.waxprocessFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxIssue/InsertJobWaxIssue'
  let postData = {
    "VOCTYPE": this.waxprocessFrom.value.voctype || "",
    "VOCNO": this.waxprocessFrom.value.vocno || "",
    "PROCESS_CODE": this.waxprocessFrom.value.processcode || "",
    "WORKER_CODE": this.waxprocessFrom.value.workercode || "",
    "REMARKS": this.waxprocessFrom.value.remarks || "",
    "UNIQUEID": 0,
    "VOCDATE": this.waxprocessFrom.value.vocdate || "",
    "DT_VOCTYPE": "str",
    "DT_BRANCH_CODE": "string",
    "DT_VOCNO": 0,
    "DT_YEARMONTH": "string",
    "SRNO": 0,
    "JOB_NUMBER": "string",
    "UNQ_JOB_ID": "string",
    "DESIGN_CODE": "string",
    "PARTYCODE": "string",
    "ISSUE_PCS": 0,
    "TOTAL_PCS": 0,
    "UNQ_DESIGN_ID": "string",
    "GROSS_WT": 0,
    "METAL_WT": 0,
    "STONE_WT": 0,
    "MID": 0,
    "BRANCH_CODE": "string",
    "YEARMONTH": "string",
    "DOCTIME": "2023-10-04T10:39:08.652Z",
    "TOTAL_GROSS_WT": 0,
    "TOTAL_STONE_WT": 0,
    "SMAN": "string",
    "NAVSEQNO": 0,
    "AUTOPOSTING": true,
    "POSTDATE": "string",
    "PRINT_COUNT": 0,
    "SYSTEM_DATE": "2023-10-04T10:39:08.652Z",
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
