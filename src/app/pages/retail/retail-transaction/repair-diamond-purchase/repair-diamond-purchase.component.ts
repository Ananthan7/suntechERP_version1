import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { RepairDiamondPurchaseDetailComponent } from './repair-diamond-purchase-detail/repair-diamond-purchase-detail.component';


@Component({
  selector: 'app-repair-diamond-purchase',
  templateUrl: './repair-diamond-purchase.component.html',
  styleUrls: ['./repair-diamond-purchase.component.scss']
})
export class RepairDiamondPurchaseComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['SI.No' , 'GST_Type%' , 'GST_Type', 'Total GST'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  isdisabled:boolean=true;
  private subscriptions: Subscription[] = [];
  table: any;
  status: boolean= true;
  viewMode: boolean = false;
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  formattedTime: any;
  maxTime: any;
  standTime: any;
  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
   
  }

  repairdiapurchaseFrom: FormGroup = this.formBuilder.group({
    voctype:['',[Validators.required]],
    vocDate : [new Date()],
    vocno: [1,[Validators.required]],
    enteredBy : [''],
    process:['',[Validators.required]],
    worker:['',[Validators.required]],
    toworker:[''],
    toprocess:[''],
    waxcode:[''],
    remark:[''],
   });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(RepairDiamondPurchaseDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  adddata() {


   
}



adddatas() {
 
 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}

formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.repairdiapurchaseFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxReturn/InsertJobWaxReturn'
  let postData = {
      "MID": 0,
      "VOCTYPE": this.repairdiapurchaseFrom.value.voctype || "",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.repairdiapurchaseFrom.value.vocno || "",
      "VOCDATE": this.repairdiapurchaseFrom.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-19T05:34:05.288Z",
      "PROCESS_CODE": this.repairdiapurchaseFrom.value.process || "",
      "WORKER_CODE": this.repairdiapurchaseFrom.value.worker || "",
      "SMAN": "",
      "REMARKS": this.repairdiapurchaseFrom.value.remark || "",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "TO_PROCESS_CODE": this.repairdiapurchaseFrom.value.toprocess || "",
      "TO_WORKER_CODE": this.repairdiapurchaseFrom.value.toworker || "",
      "DIVISION_CODE": "",
      "STOCK_CODE": "",
      "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
      "HTUSERNAME": this.repairdiapurchaseFrom.value.enteredBy,
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
              this.repairdiapurchaseFrom.reset()
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
  if (this.repairdiapurchaseFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.repairdiapurchaseFrom.value.branchCode + this.repairdiapurchaseFrom.value.voctype + this.repairdiapurchaseFrom.value.vocno + this.repairdiapurchaseFrom.value.yearMonth
  let postData = {
    "MID": 0,
    "VOCTYPE": this.repairdiapurchaseFrom.value.voctype || "",
    "BRANCH_CODE": this.branchCode,
    "VOCNO": this.repairdiapurchaseFrom.value.vocno || "",
    "VOCDATE": this.repairdiapurchaseFrom.value.vocDate || "",
    "YEARMONTH": this.yearMonth,
    "DOCTIME": "2023-10-19T05:34:05.288Z",
    "PROCESS_CODE": this.repairdiapurchaseFrom.value.process || "",
    "WORKER_CODE": this.repairdiapurchaseFrom.value.worker || "",
    "SMAN": "",
    "REMARKS": this.repairdiapurchaseFrom.value.remark || "",
    "NAVSEQNO": 0,
    "AUTOPOSTING": true,
    "POSTDATE": "",
    "PRINT_COUNT": 0,
    "TO_PROCESS_CODE": this.repairdiapurchaseFrom.value.toprocess || "",
    "TO_WORKER_CODE": this.repairdiapurchaseFrom.value.toworker || "",
    "DIVISION_CODE": "",
    "STOCK_CODE": "",
    "SYSTEM_DATE": "2023-10-19T05:34:05.288Z",
    "HTUSERNAME": this.repairdiapurchaseFrom.value.enteredBy,
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
              this.repairdiapurchaseFrom.reset()
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
      let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.repairdiapurchaseFrom.value.branchCode + this.repairdiapurchaseFrom.value.voctype + this.repairdiapurchaseFrom.value.vocno + this.repairdiapurchaseFrom.value.yearMonth
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
                  this.repairdiapurchaseFrom.reset()
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
                  this.repairdiapurchaseFrom.reset()
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
