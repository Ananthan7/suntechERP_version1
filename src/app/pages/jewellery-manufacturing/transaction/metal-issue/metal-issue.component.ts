import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MetalIssueDetailsComponent } from './metal-issue-details/metal-issue-details.component';

@Component({
  selector: 'app-metal-issue',
  templateUrl: './metal-issue.component.html',
  styleUrls: ['./metal-issue.component.scss']
})
export class MetalIssueComponent implements OnInit {

  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [''];
  metalIssueDetailsData : any[] = [];
  @Input() content!: any; 
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();

  private subscriptions: Subscription[] = [];
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

  openaddmetalissue() {
    const modalRef: NgbModalRef = this.modalService.open(MetalIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.metalIssueDetailsData.push(postData);
      }
    });

  }

  deleteTableData(){
   
  }

  metalIssueForm: FormGroup = this.formBuilder.group({
    voctype: ['DMI',''],
    time: [new Date().getHours() + ':' + new Date().getMinutes()+ ':' +new Date().getSeconds(),''],
    vocdate: [new Date(),''],
    enteredBy: [''],
    vocno: ['1',''],
    worker: [''],
    workerDes: [''],
    remarks: [''],   
  });

  removedata(){
    this.tableData.pop();
  }
    formSubmit(){
  
      if(this.content && this.content.FLAG == 'EDIT'){
        this.update()
        return
      }
      if (this.metalIssueForm.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobMetalIssueMasterDJ/InsertJobMetalIssueMasterDJ'
      let postData = {
        "MID": 0,
  "VOCTYPE": this.metalIssueForm.value.voctype || "",
  "BRANCH_CODE": this.branchCode,
  "VOCNO": this.metalIssueForm.value.vocno || "",
  "VOCDATE": this.metalIssueForm.value.vocdate || "",
  "YEARMONTH": this.yearMonth,
  "DOCTIME": this.metalIssueForm.value.time || "",
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
  "SMAN": "string",
  "REMARKS": this.metalIssueForm.value.remarks || "",
  "NAVSEQNO": 0,
  "FIX_UNFIX": true,
  "AUTOPOSTING": true,
  "POSTDATE": "",
  "SYSTEM_DATE": "2023-10-20T11:14:53.662Z",
  "PRINT_COUNT": 0,
  "PRINT_COUNT_ACCOPY": 0,
  "PRINT_COUNT_CNTLCOPY": 0,
  "Details": this.metalIssueDetailsData
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
                  this.metalIssueForm.reset()
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
      
      this.metalIssueForm.controls.voctype.setValue(this.content.VOCTYPE)
      this.metalIssueForm.controls.vocno.setValue(this.content.VOCNO)
      this.metalIssueForm.controls.vocdate.setValue(this.content.VOCDATE)
      this.metalIssueForm.controls.time.setValue(this.content.DOCTIME)
      this.metalIssueForm.controls.remarks.setValue(this.content.REMARKS)
    }
  
  
    update(){
      if (this.metalIssueForm.invalid) {
        this.toastr.error('select all required fields')
        return
      }
    
      let API = 'JobMetalIssueMasterDJ/UpdateJobMetalIssueMasterDJ/'+ this.metalIssueForm.value.branchCode + this.metalIssueForm.value.voctype + this.metalIssueForm.value.vocno + this.metalIssueForm.value.yearMonth
      let postData = {
        "MID": 0,
        "VOCTYPE": this.metalIssueForm.value.voctype || "",
        "BRANCH_CODE": this.branchCode,
        "VOCNO": this.metalIssueForm.value.vocno || "",
        "VOCDATE": this.metalIssueForm.value.vocdate || "",
        "YEARMONTH": this.yearMonth,
        "DOCTIME": this.metalIssueForm.value.time || "",
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
        "SMAN": "",
        "REMARKS": this.metalIssueForm.value.remarks || "",
        "NAVSEQNO": 0,
        "FIX_UNFIX": true,
        "AUTOPOSTING": true,
        "POSTDATE": "",
        "SYSTEM_DATE": "2023-10-20T11:14:53.662Z",
        "PRINT_COUNT": 0,
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "Details":this.metalIssueDetailsData
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
                  this.metalIssueForm.reset()
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
          let API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' + this.metalIssueForm.value.branchCode +  this.metalIssueForm.value.voctype + this.metalIssueForm.value.vocno + this.metalIssueForm.value.yearMonth
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
                      this.metalIssueForm.reset()
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
                      this.metalIssueForm.reset()
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
