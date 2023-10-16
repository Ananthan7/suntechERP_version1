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
  selector: 'app-mould-making',
  templateUrl: './mould-making.component.html',
  styleUrls: ['./mould-making.component.scss']
})
export class MouldMakingComponent implements OnInit {
  
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  columnheads : any[] = ['Stock Code','Description','Psc','Gross Weight','Rate','Amount','Location'];
  branchCode?: String;

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
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  mouldMakingForm: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocdate:[''],
    enteredby:[''],
    fromprocess:[''],
    fromworker:[''],
    jobno:[''],
    mouldno:[''],
    mouldtype:[''],
    noofparts:[''],
    narration:[''],
    uniq:[''],
    job:[''],
    toprocess:[''],
    toworker:[''],
    designcode:[''],
    itemcurrency:[''],
    itemcurrencyrate:[''],
    location:[''],
  });
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.mouldMakingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMouldHeaderDJ/InsertJobMouldHeaderDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE":  this.branchCode,
      "VOCTYPE":this.mouldMakingForm.value.voctype || "",
      "VOCNO": 0,
      "VOCDATE": this.mouldMakingForm.value.vocdate || "",
      "YEARMONTH": "string",
      "JOB_NUMBER": this.mouldMakingForm.value.jobno || "",
      "JOB_DESCRIPTION": this.mouldMakingForm.value.job || "",
      "DESIGN_CODE": this.mouldMakingForm.value.designcode || "",
      "MOULD_NUMBER": this.mouldMakingForm.value.mouldno || "",
      "MOULD_LOCATION": "string",
      "MOULD_TYPE":this.mouldMakingForm.value.mouldtype || "",
      "UNQ_JOB_ID": "string",
      "UNQ_DESIGN_ID": "string",
      "JOB_SO_MID": 0,
      "JOB_SO_NUMBER": 0,
      "PARTYCODE":this.mouldMakingForm.value.noofparts || "",
      "PARTY_CURRENCY": "stri",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": this.mouldMakingForm.value.itemcurrency || "",
      "ITEM_CURR_RATE": this.mouldMakingForm.value.itemcurrencyrate || "",
      "VALUE_DATE": "2023-10-16T10:38:33.131Z",
      "SALESPERSON_CODE": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": 0,
      "NET_VALUE_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": 0,
      "GROSS_VALUE_CC": 0,
      "REMARKS": this.mouldMakingForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-16T10:38:33.131Z",
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": "2023-10-16T10:38:33.131Z",
      "PAYMENTREMARKS": "string",
      "HHACCOUNT_HEAD": "string",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "DOC_REF": "string",
      "PICTURE_NAME": "string",
      "FROM_WORKER_CODE":this.mouldMakingForm.value.fromworker || "",
      "TO_WORKER_CODE": this.mouldMakingForm.value.toworker || "",
      "FROM_PROCESS_CODE":this.mouldMakingForm.value.fromprocess || "",
      "TO_PROCESS_CODE": this.mouldMakingForm.value.toprocess || "",
      "PARTS": 0,
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "string",
      "PCS": 0,
      "GRWT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "VALUEFC": 0,
      "VALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": 0,
      "NETVALUECC": 0,
      "LOCTYPE_CODE": this.mouldMakingForm.value.location || "",
      "STOCK_DOCDESC": "string",
      "DETDIVISION": "s",
      "DIVISION_CODE": "s",
      "DETLINEREMARKS": "string",
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "TOTAL_AMOUNTCC": 0,
      "TOTAL_AMOUNTFC": 0,
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
                this.mouldMakingForm.reset()
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
    
    this.mouldMakingForm.controls.voctype.setValue(this.content.VOCTYPE)
    this.mouldMakingForm.controls.vocdate.setValue(this.content.VOCDATE)
    this.mouldMakingForm.controls.fromprocess.setValue(this.content.FROM_PROCESS_CODE)
    this.mouldMakingForm.controls.fromworker.setValue(this.content.FROM_WORKER_CODE)
    this.mouldMakingForm.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.mouldMakingForm.controls.mouldno.setValue(this.content.MOULD_NUMBER)
    this.mouldMakingForm.controls.mouldtype.setValue(this.content.MOULD_TYPE)
    this.mouldMakingForm.controls.noofparts.setValue(this.content.PARTYCODE)
    this.mouldMakingForm.controls.narration.setValue(this.content.REMARKS)
    this.mouldMakingForm.controls.job.setValue(this.content.JOB_DESCRIPTION)
    this.mouldMakingForm.controls.toprocess.setValue(this.content.TO_PROCESS_CODE)
    this.mouldMakingForm.controls.toworker.setValue(this.content.TO_WORKER_CODE)
    this.mouldMakingForm.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.mouldMakingForm.controls.itemcurrency.setValue(this.content.ITEM_CURRENCY)
    this.mouldMakingForm.controls.itemcurrencyrate.setValue(this.content.ITEM_CURR_RATE)
    this.mouldMakingForm.controls.location.setValue(this.content.LOCTYPE_CODE)
  }


  update(){
    if (this.mouldMakingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMouldHeaderDJ/UpdateJobMouldHeaderDJ/'+ this.mouldMakingForm.value.branchCode + this.mouldMakingForm.value.voctype + this.mouldMakingForm.value.vocno + this.mouldMakingForm.value.vocdate
    let postData = {
      "MID": 0,
      "BRANCH_CODE":  this.branchCode,
      "VOCTYPE":this.mouldMakingForm.value.voctype || "",
      "VOCNO": 0,
      "VOCDATE": this.mouldMakingForm.value.vocdate || "",
      "YEARMONTH": "string",
      "JOB_NUMBER": this.mouldMakingForm.value.jobno || "",
      "JOB_DESCRIPTION": this.mouldMakingForm.value.job || "",
      "DESIGN_CODE": this.mouldMakingForm.value.designcode || "",
      "MOULD_NUMBER": this.mouldMakingForm.value.mouldno || "",
      "MOULD_LOCATION": "string",
      "MOULD_TYPE":this.mouldMakingForm.value.mouldtype || "",
      "UNQ_JOB_ID": "string",
      "UNQ_DESIGN_ID": "string",
      "JOB_SO_MID": 0,
      "JOB_SO_NUMBER": 0,
      "PARTYCODE":this.mouldMakingForm.value.noofparts || "",
      "PARTY_CURRENCY": "stri",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": this.mouldMakingForm.value.itemcurrency || "",
      "ITEM_CURR_RATE": this.mouldMakingForm.value.itemcurrencyrate || "",
      "VALUE_DATE": "2023-10-16T10:38:33.131Z",
      "SALESPERSON_CODE": "string",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": 0,
      "NET_VALUE_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": 0,
      "GROSS_VALUE_CC": 0,
      "REMARKS": this.mouldMakingForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-16T10:38:33.131Z",
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": "2023-10-16T10:38:33.131Z",
      "PAYMENTREMARKS": "string",
      "HHACCOUNT_HEAD": "string",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "PRINT_COUNT": 0,
      "DOC_REF": "string",
      "PICTURE_NAME": "string",
      "FROM_WORKER_CODE":this.mouldMakingForm.value.fromworker || "",
      "TO_WORKER_CODE": this.mouldMakingForm.value.toworker || "",
      "FROM_PROCESS_CODE":this.mouldMakingForm.value.fromprocess || "",
      "TO_PROCESS_CODE": this.mouldMakingForm.value.toprocess || "",
      "PARTS": 0,
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "string",
      "PCS": 0,
      "GRWT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "VALUEFC": 0,
      "VALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": 0,
      "NETVALUECC": 0,
      "LOCTYPE_CODE": this.mouldMakingForm.value.location || "",
      "STOCK_DOCDESC": "string",
      "DETDIVISION": "s",
      "DIVISION_CODE": "s",
      "DETLINEREMARKS": "string",
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "str",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "TOTAL_AMOUNTCC": 0,
      "TOTAL_AMOUNTFC": 0, 
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
                this.mouldMakingForm.reset()
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
        let API = 'JobMouldHeaderDJ/DeleteJobMouldHeaderDJ/' + this.mouldMakingForm.value.branchCode + this.mouldMakingForm.value.voctype + this.mouldMakingForm.value.vocno + this.mouldMakingForm.value.vocdate
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
                    this.mouldMakingForm.reset()
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
                    this.mouldMakingForm.reset()
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
