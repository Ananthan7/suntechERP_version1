import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AlloyAllocationComponent } from './alloy-allocation/alloy-allocation.component';

@Component({
  selector: 'app-cad-processing',
  templateUrl: './cad-processing.component.html',
  styleUrls: ['./cad-processing.component.scss']
})
export class CADProcessingComponent implements OnInit {
  @Input() content!: any;

  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['  ',];
  divisionMS: any = 'ID';
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    if (this.content) {
      // this.setFormValues()
    }
  }

  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  cadProcessingForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: [''],
    vocDate: [''],
    process: [''],
    worker: [''],
    narration: [''],
    soNumber: [''],    //no
    design:[''],
    completed:[''], //no
    toWorker:[''],
    toProcess:[''],
    job:[''],
    subJobId:[''],
    timeTaken:[''],
    userId:[''], // No
    date:[''],
    copy:[''], // no
    type:[''],
    reason:[''], //no
    remarks:[''],
    attachments:[''], //no
    deliveryOn:[''],
    deliveryOnDays:[''],
    deliveryOnDate:[''],
  });

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.cadProcessingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobCadProcessDJ/InsertJobCadProcessDJ'
    let postData ={
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.cadProcessingForm.value.voctype,
      "vocNo": this.cadProcessingForm.value.vocNo,
      "YEARMONTH": "stri",
      "SALESPERSON_CODE": "string",
      "SYSTEM_DATE": this.cadProcessingForm.value.date,
      "MACHINEID": "string",
      "DOC_REF": "string",
      "REMARKS": this.cadProcessingForm.value.remarks,
      "VOCDATE": this.cadProcessingForm.value.VocDate,
      "NAVSEQNO": 0,
      "PROCESS_CODE": this.cadProcessingForm.value.process,
      "WORKER_CODE": this.cadProcessingForm.value.worker,
      "JOB_NUMBER": this.cadProcessingForm.value.job,
      "UNQ_JOB_ID": "string",
      "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
      "DESIGN_CODE": this.cadProcessingForm.value.design,
      "UNQ_DESIGN_ID": "string",
      "PART_CODE": "string",
      "PCS": 0,
      "TIME_TAKEN": this.cadProcessingForm.value.timeTaken,
      "JOB_SO_MID": 0,
      "CAD_STATUS": "string",
      "APPR_CODE": "string",
      "APPR_TYPE": this.cadProcessingForm.value.type,
      "TRANS_REF": "string",
      "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
      "TO_PROCESS_CODE": this.cadProcessingForm.value.toProcess,
      "TO_WORKER_CODE": this.cadProcessingForm.value.toWorker,
      "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
      "SO_DELIVERY_DAYS": this.cadProcessingForm.value.deliveryOnDays,
      "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
      "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
      "SO_CR_DAYS": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_vocNo": 0,
          "DT_YEARMONTH": "stri",
          "SRNO": 0,
          "METALSTONE": "s",
          "DIVCODE": "s",
          "STONE_TYPE": "string",
          "KARAT_CODE": "stri",
          "SIEVE_SET": "string",
          "SIEVE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "SIZE": "string",
          "PCS": 0,
          "GROSS_WT": 0,
          "D_REMARKS": "string",
          "PROCESS_TYPE": "string",
          "POINTER_WT": 0,
          "STOCK_CODE": "string",
          "COMP_CODE": "string"
        }
      ]
     
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
                this.cadProcessingForm.reset()
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
    let API = '/JobCadProcessDJ/UpdateJobCadProcessDJ'+ this.cadProcessingForm.value.brnachCode + this.cadProcessingForm.value.voctype + this.cadProcessingForm.value.vocNo + this.cadProcessingForm.value.yearMoth ;
      let postData ={
        "MID": 0,
        "BRANCH_CODE": "string",
        "VOCTYPE": this.cadProcessingForm.value.voctype,
        "vocNo": this.cadProcessingForm.value.vocNo,
        "YEARMONTH": "stri",
        "SALESPERSON_CODE": "string",
        "SYSTEM_DATE": this.cadProcessingForm.value.date,
        "MACHINEID": "string",
        "DOC_REF": "string",
        "REMARKS": this.cadProcessingForm.value.remarks,
        "VOCDATE": this.cadProcessingForm.value.VocDate,
        "NAVSEQNO": 0,
        "PROCESS_CODE": this.cadProcessingForm.value.process,
        "WORKER_CODE": this.cadProcessingForm.value.worker,
        "JOB_NUMBER": this.cadProcessingForm.value.job,
        "UNQ_JOB_ID": "string",
        "JOB_SO_NUMBER": this.cadProcessingForm.value.subJobId,
        "DESIGN_CODE": this.cadProcessingForm.value.design,
        "UNQ_DESIGN_ID": "string",
        "PART_CODE": "string",
        "PCS": 0,
        "TIME_TAKEN": this.cadProcessingForm.value.timeTaken,
        "JOB_SO_MID": 0,
        "CAD_STATUS": "string",
        "APPR_CODE": "string",
        "APPR_TYPE": this.cadProcessingForm.value.type,
        "TRANS_REF": "string",
        "FINISHED_DATE": "2023-10-05T07:59:51.905Z",
        "TO_PROCESS_CODE": this.cadProcessingForm.value.toProcess,
        "TO_WORKER_CODE": this.cadProcessingForm.value.toWorker,
        "SO_DELIVERY_TYPE": this.cadProcessingForm.value.deliveryOn,
        "SO_DELIVERY_DAYS": this.cadProcessingForm.value.deliveryOnDays,
        "SO_DELIVERY_DATE": this.cadProcessingForm.value.deliveryOnDate,
        "SO_VOCDATE": "2023-10-05T07:59:51.905Z",
        "SO_CR_DAYS": 0,
        "Details": [
          {
            "UNIQUEID": 0,
            "DT_BRANCH_CODE": "string",
            "DT_VOCTYPE": "str",
            "DT_vocNo": 0,
            "DT_YEARMONTH": "stri",
            "SRNO": 0,
            "METALSTONE": "s",
            "DIVCODE": "s",
            "STONE_TYPE": "string",
            "KARAT_CODE": "stri",
            "SIEVE_SET": "string",
            "SIEVE": "string",
            "COLOR": "string",
            "CLARITY": "string",
            "SHAPE": "string",
            "SIZE": "string",
            "PCS": 0,
            "GROSS_WT": 0,
            "D_REMARKS": "string",
            "PROCESS_TYPE": "string",
            "POINTER_WT": 0,
            "STOCK_CODE": "string",
            "COMP_CODE": "string"
          }
        ]
       
      }
  
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
                  this.cadProcessingForm.reset()
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
        let API = '/JobCadProcessDJ/DeleteJobCadProcessDJ/' + this.cadProcessingForm.value.brnachCode + this.cadProcessingForm.value.voctype + this.cadProcessingForm.value.vocNo + this.cadProcessingForm.value.yearMoth;
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
                    this.cadProcessingForm.reset()
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
                    this.cadProcessingForm.reset()
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
    SEARCH_HEADING: 'process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "process_code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  processSelected(e:any){
    console.log(e);
    this.cadProcessingForm.controls.process.setValue(e.Process_Code);
  }

  toProcessSelected(e:any){
    this.cadProcessingForm.controls.toProcess.setValue(e.Process_Code);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  workedSelected(e:any){
    console.log(e);
    this.cadProcessingForm.controls.worker.setValue(e.WORKER_CODE);
  }
  
  toWorkedSelected(e:any){
  console.log(e);
  this.cadProcessingForm.controls.toWorker.setValue(e.WORKER_CODE);
  }

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
