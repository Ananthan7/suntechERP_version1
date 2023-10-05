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
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {

  columnhead1:any[] = ['Div','Stock Code','Shape','Color','Clarity','Size','Sieve Set','Pcs'];

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

  openaddstoneissuedetail() {
    const modalRef: NgbModalRef = this.modalService.open(StoneIssueDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }


  stoneissueFrom: FormGroup = this.formBuilder.group({
    jobnumber:[''],
    subjobnumber:[''],
   designcode:[''],
   partcode:[''],
   salesorderno:[''],
   process:[''],
    worker:[''],
    stock:[''],
    batchid:[''],
    location:[''],
    pieces:[''],
    shape:[''],
    clarity:[''],
    karat:[''],
    size:[''],
    sieveset:[''],
    unitrate:[''],
    sieve:[''],
    amount:[''],
    color:[''],
    stockbal:[''],
    pointerwt:[''],
    otheratt:[''],
    remarks:[''],
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
    this.stoneissueFrom.controls.currency.setValue(e.CURRENCY_CODE);
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
    this.stoneissueFrom.controls.worker.setValue(e.WORKER_CODE);
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-05T09:33:19.685Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-05T09:33:19.685Z",
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
      "SYSTEM_DATE": "2023-10-05T09:33:19.686Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SRNO": 0,
        "JOB_NUMBER": "string",
        "JOB_DATE": "2023-10-05T11:17:33.295Z",
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
        "JOB_PCS": 0,
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
        "PICTURE_NAME": "string",
        "PART_CODE": "string",
        "REPAIRJOB": 0,
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
    if (this.stoneissueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/InsertJobStoneIssueMasterDJ'
    let postData = {
      "MID": 0,
      "VOCTYPE": "string",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "string",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-05T09:33:19.685Z",
      "CURRENCY_CODE": "string",
      "CURRENCY_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "BASE_CURRENCY":  "string",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-05T09:33:19.686Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SRNO": 0,
      "JOB_NUMBER": this.stoneissueFrom.value.jobnumber || "",
      "JOB_DATE": "2023-10-05T09:33:19.686Z",
      "JOB_SO_NUMBER": this.stoneissueFrom.value.subjobnumber || "",
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "DESIGN_CODE": this.stoneissueFrom.value.designcode || "",
      "DIVCODE": "s",
      "STOCK_CODE": this.stoneissueFrom.value.stock || "",
      "STOCK_DESCRIPTION": "string",
      "SIEVE": this.stoneissueFrom.value.sieve || "",
      "SHAPE":this.stoneissueFrom.value.shape || "",
      "COLOR":this.stoneissueFrom.value.color || "",
      "CLARITY": this.stoneissueFrom.value.clarity || "",
      "SIZE": this.stoneissueFrom.value.size || "",
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE":this.stoneissueFrom.value.process || "",
      "PROCESS_NAME": "string",
      "WORKER_CODE": this.stoneissueFrom.value.worker || "",
      "WORKER_NAME": "string",
      "UNQ_DESIGN_ID": "string",
      "WIP_ACCODE": "string",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": "string",
      "PICTURE_NAME": "string",
      "PART_CODE":this.stoneissueFrom.value.partcode || "",
      "REPAIRJOB": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "CONSIGNMENT": 0,
      "SIEVE_SET": this.stoneissueFrom.value.partcode || "",
      "SUB_STOCK_CODE": "string",
      "D_REMARKS": "string",
      "SIEVE_DESC": "string",
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": this.stoneissueFrom.value.otheratt || "",
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
    
    this.stoneissueFrom.controls.code.setValue(this.content.VOCTYPE)
    this.stoneissueFrom.controls.description.setValue(this.content.VOCDATE)
    this.stoneissueFrom.controls.description.setValue(this.content.BASE_CURRENCY)
    this.stoneissueFrom.controls.description.setValue(this.content.CURRENCY_CODE)
    this.stoneissueFrom.controls.description.setValue(this.content.WORKER_CODE)
    this.stoneissueFrom.controls.description.setValue(this.content.REMARKS)

    

  }


  update(){
    if (this.stoneissueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneIssueMasterDJ/UpdateJobStoneIssueMasterDJ/'+ this.stoneissueFrom.value.voctype + this.stoneissueFrom.value.vocdate
    let postData = {
      "MID": 0,
      "VOCTYPE": this.stoneissueFrom.value.voctype || "",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": this.stoneissueFrom.value.vocdate || "",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-05T09:33:19.685Z",
      "CURRENCY_CODE": this.stoneissueFrom.value.currency || "",
      "CURRENCY_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "SMAN": "string",
      "REMARKS": this.stoneissueFrom.value.narration || "",
      "NAVSEQNO": 0,
      "BASE_CURRENCY": this.stoneissueFrom.value.basecurrency || "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-05T09:33:19.686Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SRNO": 0,
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-05T09:33:19.686Z",
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
      "JOB_PCS": 0,
      "PCS": 0,
      "GROSS_WT": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "string",
      "PROCESS_NAME": "string",
      "WORKER_CODE": this.stoneissueFrom.value.worker || "",
      "WORKER_NAME": "string",
      "UNQ_DESIGN_ID": "string",
      "WIP_ACCODE": "string",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": "string",
      "PICTURE_NAME": "string",
      "PART_CODE": "string",
      "REPAIRJOB": 0,
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
      "OTHER_ATTR": "string",
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
        let API = 'JobStoneIssueMasterDJ/DeleteJobStoneIssueMasterDJ/' + this.stoneissueFrom.value.voctype + this.stoneissueFrom.value.vocdate
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
