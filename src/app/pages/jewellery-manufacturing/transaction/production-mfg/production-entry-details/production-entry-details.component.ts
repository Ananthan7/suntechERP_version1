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
  selector: 'app-production-entry-details',
  templateUrl: './production-entry-details.component.html',
  styleUrls: ['./production-entry-details.component.scss']
})
export class ProductionEntryDetailsComponent implements OnInit {
  divisionMS: any = 'ID';
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



  waxprocessFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
   process:[''],
   worker:[''],
   toworker:[''],
   toprocess:[''],
   waxcode:[''],
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
    this.waxprocessFrom.controls.currency.setValue(e.CURRENCY_CODE);
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
    this.waxprocessFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-07T08:43:49.448Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-07T08:43:49.448Z",
      "PROCESS_CODE": "string",
      "WORKER_CODE": "string",
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": "string",
      "TO_WORKER_CODE": "string",
      "DIVISION_CODE": "s",
      "STOCK_CODE": "string",
      "SYSTEM_DATE": "2023-10-07T08:43:49.448Z",
      "HTUSERNAME": "string",
      "UNIQUEID": 0,
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
      "RETURN_PCS": 0,
      "ISSUE_VOCTYPE": "str",
      "ISSUE_BRANCH_CODE": "string",
      "ISSUE_VOCNO": 0,
      "ISSUE_YEARMONTH": "string",
      "IS_AUTHORISE": true,
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0,
      "WAX_WT": 0,
      "JOB_PCS": 0,
      "AUTHORIZE_TIME": "2023-10-07T08:43:49.448Z",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
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
  
    let API = 'JobWaxReturn/InsertJobWaxReturn'
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype || "",
      "BRANCH_CODE": "string",
      "VOCNO":  this.waxprocessFrom.value.vocno || "",
      "VOCDATE":  this.waxprocessFrom.value.worker || "",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-07T08:43:49.448Z",
      "PROCESS_CODE":  this.waxprocessFrom.value.process || "",
      "WORKER_CODE":  this.waxprocessFrom.value.worker || "",
      "SMAN": "string",
      "REMARKS": this.waxprocessFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
      "TO_WORKER_CODE":  this.waxprocessFrom.value.toworker || "",
      "DIVISION_CODE": "s",
      "STOCK_CODE": "string",
      "SYSTEM_DATE": "2023-10-07T08:43:49.448Z",
      "HTUSERNAME": "string",
      "UNIQUEID": 0,
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
      "RETURN_PCS": 0,
      "ISSUE_VOCTYPE": "str",
      "ISSUE_BRANCH_CODE": "string",
      "ISSUE_VOCNO": 0,
      "ISSUE_YEARMONTH": "string",
      "IS_AUTHORISE": true,
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0,
      "WAX_WT":  this.waxprocessFrom.value.waxcode || "",
      "JOB_PCS": 0,
      "AUTHORIZE_TIME": "2023-10-07T08:43:49.448Z",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
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

  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.waxprocessFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.waxprocessFrom.controls.vocno.setValue(this.content.VOCNO)
    this.waxprocessFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.waxprocessFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.waxprocessFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.waxprocessFrom.controls.toworker.setValue(this.content.TO_WORKER_CODE)
    this.waxprocessFrom.controls.toprocess.setValue(this.content.TO_PROCESS_CODE)
    this.waxprocessFrom.controls.waxcode.setValue(this.content.WAX_WT)
    this.waxprocessFrom.controls.remark.setValue(this.content.REMARKS)

    

  }


  update(){
    if (this.waxprocessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.vocdate
    let postData = {
      "MID": 0,
      "VOCTYPE": this.waxprocessFrom.value.voctype || "",
      "BRANCH_CODE": "string",
      "VOCNO":  this.waxprocessFrom.value.vocno || "",
      "VOCDATE":  this.waxprocessFrom.value.worker || "",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-07T08:43:49.448Z",
      "PROCESS_CODE":  this.waxprocessFrom.value.process || "",
      "WORKER_CODE":  this.waxprocessFrom.value.worker || "",
      "SMAN": "string",
      "REMARKS": this.waxprocessFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.waxprocessFrom.value.toprocess || "",
      "TO_WORKER_CODE":  this.waxprocessFrom.value.toworker || "",
      "DIVISION_CODE": "s",
      "STOCK_CODE": "string",
      "SYSTEM_DATE": "2023-10-07T08:43:49.448Z",
      "HTUSERNAME": "string",
      "UNIQUEID": 0,
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
      "RETURN_PCS": 0,
      "ISSUE_VOCTYPE": "str",
      "ISSUE_BRANCH_CODE": "string",
      "ISSUE_VOCNO": 0,
      "ISSUE_YEARMONTH": "string",
      "IS_AUTHORISE": true,
      "GROSS_WT": 0,
      "METAL_WT": 0,
      "STONE_WT": 0,
      "WAX_WT":  this.waxprocessFrom.value.waxcode || "",
      "JOB_PCS": 0,
      "AUTHORIZE_TIME": "2023-10-07T08:43:49.448Z",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
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
        let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.waxprocessFrom.value.voctype + this.waxprocessFrom.value.vocno + this.waxprocessFrom.value.vocdate
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
