import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-return-details',
  templateUrl: './metal-return-details.component.html',
  styleUrls: ['./metal-return-details.component.scss']
})
export class MetalReturnDetailsComponent implements OnInit {

  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  currentFilter: any;
  divisionMS: any = 'ID';
  tableData: any[] = [];
  columnhead: any[] = [''];

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
    this.metalReturnDetailsForm.controls.processCode.setValue(e.Process_Code);
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
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.job_number);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }

  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }                 

  metalReturnDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber : [''],
    jobDate : [''],
    subJobNo : [''],
    subJobNoDes : [''],
    processCode : [''],
    processCodeDesc : [''],
    workerCode : [''],
    workerCodeDesc : [''],
    designCode : [''],
    part_code : [''],
    makingRateFc : [''],
    makingRateLc : [''],
    makingAmountLC : [''],
    makingAmountFC : [''],
    treeNumber : [''], // no
    location : [''],
    stockCode : [''],
    stockCodeDesc : [''],
    pcs : [''],
    purity : [''],
    grossWeight : [''],
    netWeight : [''],
    stoneWeight : [''],
    pureWeight : [''],
    remarks : [''],
    metalGramRateFc : [''],
    metalGramRateLc : [''],
    metalAmountFc : [''],
    metalAmountLc : [''],
    totalRateFc : [''],
    purityDiff : [''],
    totalRateLc : [''],
    jobPcs: [''],
    jobPcsDate: [''],

  });
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.metalReturnDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ/'
    let postData ={
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-06T09:31:04.626Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-06T09:31:04.626Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
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
      "REMARKS": this.metalReturnDetailsForm.value.remarks,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-06T09:31:04.626Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2023-10-06T09:31:04.626Z",
          "JOB_NUMBER": this.metalReturnDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalReturnDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalReturnDetailsForm.value.subJobNo,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": this.metalReturnDetailsForm.value.subJobNoDes,
          "BRANCH_CODE": "string",
          "DESIGN_CODE": this.metalReturnDetailsForm.value.designCode,
          "DIVCODE": "s",
          "STOCK_CODE": this.metalReturnDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalReturnDetailsForm.value.stockCodeDesc,
          "SUB_STOCK_CODE": "string",
          "KARAT_CODE": "stri",
          "PCS": this.metalReturnDetailsForm.value.pcs,
          "GROSS_WT": this.metalReturnDetailsForm.value.grossWeight,
          "PURITY": this.metalReturnDetailsForm.value.purity,
          "PURE_WT": this.metalReturnDetailsForm.value.pureWeight,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": this.metalReturnDetailsForm.value.metalGramRateFc,
          "METAL_GRM_RATELC": this.metalReturnDetailsForm.value.metalGramRateLc,
          "METAL_AMOUNTFC": this.metalReturnDetailsForm.value.metalAmountFc,
          "METAL_AMOUNTLC": this.metalReturnDetailsForm.value.metalAmountLc,
          "MAKING_RATEFC": this.metalReturnDetailsForm.value.makingRateFc,
          "MAKING_RATELC": this.metalReturnDetailsForm.value.makingRateLc,
          "MAKING_AMOUNTFC": this.metalReturnDetailsForm.value.makingAmountFC,
          "MAKING_AMOUNTLC": this.metalReturnDetailsForm.value.makingAmountFC,
          "TOTAL_RATEFC": this.metalReturnDetailsForm.value.totalRateFc,
          "TOTAL_RATELC": this.metalReturnDetailsForm.value.totalRateLc,
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTLC": 0,
          "PROCESS_CODE": this.metalReturnDetailsForm.value.processCode,
          "PROCESS_NAME": this.metalReturnDetailsForm.value.processCodeDesc,
          "WORKER_CODE": this.metalReturnDetailsForm.value.workerCode,
          "WORKER_NAME": this.metalReturnDetailsForm.value.workerCodeDesc,
          "UNQ_DESIGN_ID": "string",
          "WIP_ACCODE": "string",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": this.metalReturnDetailsForm.value.location,
          "RETURN_STOCK": "string",
          "SUB_RETURN_STOCK": "string",
          "STONE_WT": this.metalReturnDetailsForm.value.stoneWeight,
          "NET_WT": this.metalReturnDetailsForm.value.netWeight,
          "PART_CODE": this.metalReturnDetailsForm.value.part_code,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "PUDIFF": this.metalReturnDetailsForm.value.purityDiff,
          "JOB_PURITY": 0
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
                this.metalReturnDetailsForm.reset()
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
    let API = 'JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/'+ this.metalReturnDetailsForm.value.brnachCode + this.metalReturnDetailsForm.value.voctype + this.metalReturnDetailsForm.value.vocNo + this.metalReturnDetailsForm.value.yearMoth ;
    let postData ={
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-06T09:31:04.626Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-06T09:31:04.626Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
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
      "REMARKS": this.metalReturnDetailsForm.value.remarks,
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-06T09:31:04.626Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2023-10-06T09:31:04.626Z",
          "JOB_NUMBER": this.metalReturnDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalReturnDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalReturnDetailsForm.value.subJobNo,
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": this.metalReturnDetailsForm.value.subJobNoDes,
          "BRANCH_CODE": "string",
          "DESIGN_CODE": this.metalReturnDetailsForm.value.designCode,
          "DIVCODE": "s",
          "STOCK_CODE": this.metalReturnDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalReturnDetailsForm.value.stockCodeDesc,
          "SUB_STOCK_CODE": "string",
          "KARAT_CODE": "stri",
          "PCS": this.metalReturnDetailsForm.value.pcs,
          "GROSS_WT": this.metalReturnDetailsForm.value.grossWeight,
          "PURITY": this.metalReturnDetailsForm.value.purity,
          "PURE_WT": this.metalReturnDetailsForm.value.pureWeight,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": this.metalReturnDetailsForm.value.metalGramRateFc,
          "METAL_GRM_RATELC": this.metalReturnDetailsForm.value.metalGramRateLc,
          "METAL_AMOUNTFC": this.metalReturnDetailsForm.value.metalAmountFc,
          "METAL_AMOUNTLC": this.metalReturnDetailsForm.value.metalAmountLc,
          "MAKING_RATEFC": this.metalReturnDetailsForm.value.makingRateFc,
          "MAKING_RATELC": this.metalReturnDetailsForm.value.makingRateLc,
          "MAKING_AMOUNTFC": this.metalReturnDetailsForm.value.makingAmountFC,
          "MAKING_AMOUNTLC": this.metalReturnDetailsForm.value.makingAmountFC,
          "TOTAL_RATEFC": this.metalReturnDetailsForm.value.totalRateFc,
          "TOTAL_RATELC": this.metalReturnDetailsForm.value.totalRateLc,
          "TOTAL_AMOUNTFC": 0,
          "TOTAL_AMOUNTLC": 0,
          "PROCESS_CODE": this.metalReturnDetailsForm.value.processCode,
          "PROCESS_NAME": this.metalReturnDetailsForm.value.processCodeDesc,
          "WORKER_CODE": this.metalReturnDetailsForm.value.workerCode,
          "WORKER_NAME": this.metalReturnDetailsForm.value.workerCodeDesc,
          "UNQ_DESIGN_ID": "string",
          "WIP_ACCODE": "string",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": this.metalReturnDetailsForm.value.location,
          "RETURN_STOCK": "string",
          "SUB_RETURN_STOCK": "string",
          "STONE_WT": this.metalReturnDetailsForm.value.stoneWeight,
          "NET_WT": this.metalReturnDetailsForm.value.netWeight,
          "PART_CODE": this.metalReturnDetailsForm.value.part_code,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "PUDIFF": this.metalReturnDetailsForm.value.purityDiff,
          "JOB_PURITY": 0
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
                  this.metalReturnDetailsForm.reset()
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
        let API = 'JobMetalReturnMasterDJ/DeleteJobMetalReturnMasterDJ/' + this.metalReturnDetailsForm.value.brnachCode + this.metalReturnDetailsForm.value.voctype + this.metalReturnDetailsForm.value.vocNo + this.metalReturnDetailsForm.value.yearMoth;
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
                    this.metalReturnDetailsForm.reset()
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
                    this.metalReturnDetailsForm.reset()
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
  

  jobNumberData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Location',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  jobNumberSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.PREFIX_CODE);
  }

 
}
