import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';
@Component({
  selector: 'app-diamond-job-boq-issue',
  templateUrl: './diamond-job-boq-issue.component.html',
  styleUrls: ['./diamond-job-boq-issue.component.scss']
})
export class DiamondJobBoqIssueComponent implements OnInit {

  divisionMS: any = 'ID';
  orders: any = [];
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  currentFilter: any;
  tableData: any[] = ['Sr No','Job Ref','So.No','Design','PCS','Select'];
  columnhead : any[] = ['Sr No','Div','Location','StockId','Shape','Color',' Clarity','Sieve','Pcs','Ct.Wt','Rate','Amount'];
  columnheader : any[] = ['Job number','Job Id','Design Code','Div','StockId','Shape','Color','Clarity','Size','Sieve','Pcs','Weight','Rate','Amount','Location'];
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate: any = this.commonService.currentDate;
  userName = this.commonService.userName;

  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

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

  // ProcessCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 20,
  //   SEARCH_FIELD: 'process_code',
  //   SEARCH_HEADING: 'Process Code',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "PROCESS_CODE<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
 
  // WorkerCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 19,
  //   SEARCH_FIELD: 'WORKER_CODE',
  //   SEARCH_HEADING: 'Worker Code',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "WORKER_CODE<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
 

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  diamondJobBoqIssue: FormGroup = this.formBuilder.group({

    vocType: ['',[Validators.required]],
    vocNo : ['',[Validators.required]],
    vocDate : [''],
    // vocTime : [new Date().toTimeString().slice(0, 5),[Validators.required]],
    enteredBy : [''],
    kariggerType: [''],
    kariggerNo: [''],
    currencyType: [''],
    currencyNo: [''],
    baseCurrencyType: [''],
    baseCurrencyNo: [''],
    metalRateType: [''],
    metalRateNo: [''],
    location : ['',[Validators.required]],
    remarks : [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,

  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.setInitialValues()
    this.setvalues()
  }

  setvalues(){
    this.diamondJobBoqIssue.controls.vocType.setValue('JBI')
    this.diamondJobBoqIssue.controls.vocNo.setValue('1')
    
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
    // this.companyName = this.commonService.companyName;
    this.yearMonth = this.commonService.yearSelected;
    this.diamondJobBoqIssue.controls.vocDate.setValue(this.currentDate)
    this.diamondJobBoqIssue.controls.vocType.setValue('JBI')
    //this.commonService.getqueryParamVocType()
  }
  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.diamondJobBoqIssue.controls.vocdate.setValue(new Date(date))
    }
  }
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  userDataSelected(value: any) {
    console.log(value);
       this.diamondJobBoqIssue.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.diamondJobBoqIssue.controls.process.setValue(e.Process_Code);
  }
  
  WorkerCodeSelected(e:any){
    console.log(e);
    this.diamondJobBoqIssue.controls.worker.setValue(e.WORKER_CODE);
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.diamondJobBoqIssue.controls.location.setValue(e.LOCATION_CODE);
  }

  openaddmetalreturn() {
    const modalRef: NgbModalRef = this.modalService.open( {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.columnhead.push(postData);
      }
    });

  }

  deleteTableData(){
   
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.diamondJobBoqIssue.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ'
    let postData ={
      "MID": 0,
      "VOCTYPE": this.diamondJobBoqIssue.value.vocType,
      "BRANCH_CODE": this.branchCode,
      "VOCNO": this.diamondJobBoqIssue.value.vocNo,
      "VOCDATE": this.diamondJobBoqIssue.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "DOCTIME": "2023-10-06T11:27:36.260Z",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "",
      "METAL_RATE": 0,
      "TOTAL_AMOUNTFC_METAL": 0,
      "TOTAL_AMOUNTLC_METAL": 0,
      "TOTAL_AMOUNTFC_MAKING": 0,
      "TOTAL_AMOUNTLC_MAKING": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_PURE_WT": 0,
      "SMAN": this.diamondJobBoqIssue.value.enteredBy,
      "REMARKS": this.diamondJobBoqIssue.value.remarks,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "SYSTEM_DATE": "2023-10-06T11:27:36.260Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": this.columnhead,
    }
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.diamondJobBoqIssue.reset()
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

  updateMeltingType() {
    let API = 'JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/'+ this.diamondJobBoqIssue.value.brnachCode + this.diamondJobBoqIssue.value.voctype + this.diamondJobBoqIssue.value.vocNo + this.diamondJobBoqIssue.value.yearMoth ;
      let postData ={}
  
      let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.diamondJobBoqIssue.reset()
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
      /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.WORKER_CODE) {
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' + this.diamondJobBoqIssue.value.brnachCode + this.diamondJobBoqIssue.value.voctype + this.diamondJobBoqIssue.value.vocNo + this.diamondJobBoqIssue.value.yearMoth;
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
                    this.diamondJobBoqIssue.reset()
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
                    this.diamondJobBoqIssue.reset()
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
  
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processSelected(e:any){
    console.log(e);
    this.diamondJobBoqIssue.controls.process.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE ',
    SEARCH_HEADING: 'WORKER CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workerSelected(e:any){
    console.log(e);
    this.diamondJobBoqIssue.controls.worker.setValue(e.WORKER_CODE);
  }


}
