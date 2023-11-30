import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MeltingIssueDetailsComponent } from './melting-issue-details/melting-issue-details.component';

@Component({
  selector: 'app-melting-issue',
  templateUrl: './melting-issue.component.html',
  styleUrls: ['./melting-issue.component.scss']
})
export class MeltingIssueComponent implements OnInit {
 
  columnhead:any[] = ['Sr','Div','Job No','Stock Code','Main Stock','Process','Worker','Pcs','Gross Wt','Purity','Purity Wt','Rate','Amount']
  columnheader : any[] = ['Sr#','SO No','Party Code','Party Name','Job Number','Job Description','Design Code','UNQ Design ID','Process','Worker','Metal Required','Metal Allocated','Allocated Pure','Job Pcs']
  columnhead1 : any[] = ['Sr#','Ingredients','Qty']
  @Input() content!: any;
  tableData: any[] = [];
  meltingISsueDetailsData : any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  branchCode?: String;
  yearMonth?: String;

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
  WorkerCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssueFrom.controls.workerdes.setValue(e.DESCRIPTION);
    
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ProcessCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.processcode.setValue(e.Process_Code);
    this.meltingIssueFrom.controls.processdes.setValue(e.Description);

  }

 
  MeltingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 94,
    SEARCH_FIELD: 'Melting Type',
    SEARCH_HEADING: 'Melting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "Melting Type<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  MeltingCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.meltingtype.setValue(e['Melting Type']);
  }

 jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.jobno.setValue(e.job_number);
    this.meltingIssueFrom.controls.jobdes.setValue(e.job_description);
  }

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  timeCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.time.setValue(e.CODE);
  }

  constructor(    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddMeltingIssueDetails() {
    const modalRef: NgbModalRef = this.modalService.open(MeltingIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.meltingISsueDetailsData.push(postData);
        console.log(this.meltingISsueDetailsData);
        
      }
    });

  }

  deleteTableData(){
   
  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno:[''],
    vocdate:[''],
    voctime:[''],
    meltingtype:[''],
    jobno:[''],
    jobdes:[''],
    processcode:[''],
    processdes:[''],
    worker:[''],
    workerdes:[''],
    subjobno:[''], // Not in table
    color:[''],
    time:[''],  // Not in table
    remarks:[''],
    issued:[''],
    required:[''],
    allocated:[''],
    balance:['']

  });

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.meltingIssueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.meltingIssueFrom.value.voctype,
      "VOCNO": this.meltingIssueFrom.value.vocno,
      "VOCDATE": this.meltingIssueFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssueFrom.value.worker,
      "WORKER_DESC": this.meltingIssueFrom.value.workerdes,
      "SALESPERSON_CODE": "",
      "SALESPERSON_NAME": "",
      "DOCTIME": "2023-10-21T10:15:43.789Z",
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
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssueFrom.value.remarks,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingIssueFrom.value.processcode,
      "PROCESS_DESC": this.meltingIssueFrom.value.processdes,
      "PRINT_COUNT": 0,
      "MELTING_TYPE": "",
      "COLOR": this.meltingIssueFrom.value.color,
      "RET_STOCK_CODE": "",
      "RET_GROSS_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_LOCATION_CODE": "",
      "SCP_STOCK_CODE": "",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "",
      "REJ_REMARKS": "",
      "ATTACHMENT_FILE": "",
      "SYSTEM_DATE": "2023-10-21T10:15:43.790Z",
      "Details": this.meltingISsueDetailsData
      // [
      //   {
      //     "UNIQUEID": 0,
      //     "SRNO": 0,
      //     "DT_BRANCH_CODE": "string",
      //     "DT_VOCTYPE": "stri",
      //     "DT_VOCNO": 0,
      //     "DT_VOCDATE": "2023-10-21T10:15:43.790Z",
      //     "DT_YEARMONTH": "string",
      //     "JOB_NUMBER": "string",
      //     "JOB_DESCRIPTION": "string",
      //     "PROCESS_CODE": "string",
      //     "PROCESS_DESC": "string",
      //     "WORKER_CODE": "string",
      //     "WORKER_DESC": "string",
      //     "STOCK_CODE": "string",
      //     "STOCK_DESCRIPTION": "string",
      //     "DIVCODE": "s",
      //     "KARAT_CODE": "stri",
      //     "PCS": 0,
      //     "GROSS_WT": 0,
      //     "STONE_WT": 0,
      //     "PURITY": 0,
      //     "PUREWT": 0,
      //     "PUDIFF": 0,
      //     "IRON_WT": 0,
      //     "NET_WT": 0,
      //     "TOTAL_WEIGHT": 0,
      //     "IRON_PER": 0,
      //     "STONEDIFF": 0,
      //     "WAX_WT": 0,
      //     "TREE_NO": "string",
      //     "WIP_ACCODE": "string",
      //     "CURRENCY_CODE": "stri",
      //     "CURRENCY_RATE": 0,
      //     "MKG_RATEFC": 0,
      //     "MKG_RATECC": 0,
      //     "MKGVALUEFC": 0,
      //     "MKGVALUECC": 0,
      //     "DLOC_CODE": "string",
      //     "REMARKS": "string",
      //     "LOCTYPE_CODE": "string",
      //     "TOSTOCKCODE": "string",
      //     "LOSSWT": 0,
      //     "TODIVISION_CODE": "s",
      //     "LOT_NO": "string",
      //     "BAR_NO": "string",
      //     "TICKET_NO": "string",
      //     "SILVER_PURITY": 0,
      //     "SILVER_PUREWT": 0,
      //     "TOPURITY": 0,
      //     "PUR_PER": 0,
      //     "MELTING_TYPE": "string",
      //     "ISALLOY": "s",
      //     "UNQ_JOB_ID": "string",
      //     "SUB_STOCK_CODE": "string",
      //     "IS_REJECT": true,
      //     "REASON": "string",
      //     "REJ_REMARKS": "string",
      //     "ATTACHMENT_FILE": "string"
      //   }
      // ]
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
                this.meltingIssueFrom.reset()
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
    
    this.meltingIssueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.meltingIssueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.meltingIssueFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.meltingIssueFrom.controls.processcode.setValue(this.content.PROCESS_CODE)
    this.meltingIssueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssueFrom.controls.workerdes.setValue(this.content.WORKER_DESC)
    this.meltingIssueFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssueFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssueFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssueFrom.controls.color.setValue(this.content.COLOR)
    this.meltingIssueFrom.controls.remark.setValue(this.content.REMARKS)
  }


  update(){
    if (this.meltingIssueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/'+ this.meltingIssueFrom.value.voctype + this.meltingIssueFrom.value.vocno + this.meltingIssueFrom.value.vocdate
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.meltingIssueFrom.value.voctype || "",
      "VOCNO": this.meltingIssueFrom.value.vocno || "",
      "VOCDATE": this.meltingIssueFrom.value. vocdate || "",
      "YEARMONTH": "string",
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssueFrom.value.worker || "",
      "WORKER_DESC": this.meltingIssueFrom.value.workerdes || "",
      "SALESPERSON_CODE": "string",
      "SALESPERSON_NAME": "string",
      "DOCTIME": "2023-10-12T05:57:39.110Z",
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
      "REMARKS": this.meltingIssueFrom.value.remarks || "",
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingIssueFrom.value.processcode || "",
      "PROCESS_DESC": this.meltingIssueFrom.value.processdes || "",
      "PRINT_COUNT": 0,
      "MELTING_TYPE": this.meltingIssueFrom.value.meltingtype || "",
      "COLOR":this.meltingIssueFrom.value.color || "",
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
      "SYSTEM_DATE": "2023-10-12T05:57:39.110Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-10-12T05:57:39.110Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingIssueFrom.value.jobno || "",
      "JOB_DESCRIPTION":this.meltingIssueFrom.value.jobdes || "",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "PURITY": 0,
      "PUREWT": 0,
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT": 0,
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": 0,
      "TREE_NO": "string",
      "WIP_ACCODE": "string",
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "LOCTYPE_CODE": "string",
      "TOSTOCKCODE": "string",
      "LOSSWT": 0,
      "TODIVISION_CODE": "s",
      "LOT_NO": "string",
      "BAR_NO": "string",
      "TICKET_NO": "string",
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": 0,
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
                this.meltingIssueFrom.reset()
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
        let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' + this.meltingIssueFrom.value.voctype + this.meltingIssueFrom.value.vocno + this.meltingIssueFrom.value.vocdate
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
                    this.meltingIssueFrom.reset()
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
                    this.meltingIssueFrom.reset()
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
