import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
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
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'process_code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
 

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
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

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  metalReturnDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber : [''],
    jobDes : [''],
    subJobNo : [''],
    subJobNoDes : [''],
    processCode : [''],
    processCodeDesc : [''],
    workerCode : [''],
    workerCodeDesc : [''],
    designCode : [''],
    partcode : [''],
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

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
  }

  
  WorkerCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(e.DESCRIPTION);
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalReturnDetailsForm.controls.jobDes.setValue(e.job_description);
    this.metalReturnDetailsForm.controls.subJobNo.setValue(e.job_number);
    this.metalReturnDetailsForm.controls.subJobNoDes.setValue(e.job_description);
  }
  ProcessCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.processCode.setValue(e.Process_Code);
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(e.Description);
  }

  stockCodeSelected(e:any){
    console.log(e);
    this.metalReturnDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(e.DESCRIPTION);
  }
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }   
  
  continue(){}


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.metalReturnDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalReturnMasterDJ/InsertJobMetalReturnMasterDJ'
    let postData =        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "MIS",
          "VOCDATE": "2023-10-06T09:31:04.626Z",
          "JOB_NUMBER": this.metalReturnDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalReturnDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalReturnDetailsForm.value.subJobNo,
          "UNQ_JOB_ID": "",
          "JOB_DESCRIPTION": this.metalReturnDetailsForm.value.subJobNoDes,
          "BRANCH_CODE": this.branchCode,
          "DESIGN_CODE": this.metalReturnDetailsForm.value.designCode,
          "DIVCODE": "s",
          "STOCK_CODE": this.metalReturnDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalReturnDetailsForm.value.stockCodeDesc,
          "SUB_STOCK_CODE": "0",
          "KARAT_CODE": "",
          "PCS": this.metalReturnDetailsForm.value.pcs,
          "GROSS_WT": this.metalReturnDetailsForm.value.grossWeight,
          "PURITY": this.metalReturnDetailsForm.value.purity,
          "PURE_WT": this.metalReturnDetailsForm.value.pureWeight,
          "RATE_TYPE": "",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "",
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
          "UNQ_DESIGN_ID": "",
          "WIP_ACCODE": "",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": this.metalReturnDetailsForm.value.location,
          "RETURN_STOCK": "",
          "SUB_RETURN_STOCK": "",
          "STONE_WT": this.metalReturnDetailsForm.value.stoneWeight,
          "NET_WT": this.metalReturnDetailsForm.value.netWeight,
          "PART_CODE": this.metalReturnDetailsForm.value.partcode,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCTYPE": "JWA",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "PUDIFF": this.metalReturnDetailsForm.value.purityDiff,
          "JOB_PURITY": 0
    }
    this.close(postData);
  }

  updateMeltingType() {
    let API = 'JobMetalReturnMasterDJ/UpdateJobMetalReturnMasterDJ/'+ this.metalReturnDetailsForm.value.brnachCode + this.metalReturnDetailsForm.value.voctype + this.metalReturnDetailsForm.value.vocNo + this.metalReturnDetailsForm.value.yearMoth ;
    let postData =        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2023-10-06T09:31:04.626Z",
          "JOB_NUMBER": this.metalReturnDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalReturnDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalReturnDetailsForm.value.subJobNo,
          "UNQ_JOB_ID": "",
          "JOB_DESCRIPTION": this.metalReturnDetailsForm.value.subJobNoDes,
          "BRANCH_CODE": "",
          "DESIGN_CODE": this.metalReturnDetailsForm.value.designCode,
          "DIVCODE": "s",
          "STOCK_CODE": this.metalReturnDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalReturnDetailsForm.value.stockCodeDesc,
          "SUB_STOCK_CODE": "",
          "KARAT_CODE": "",
          "PCS": this.metalReturnDetailsForm.value.pcs,
          "GROSS_WT": this.metalReturnDetailsForm.value.grossWeight,
          "PURITY": this.metalReturnDetailsForm.value.purity,
          "PURE_WT": this.metalReturnDetailsForm.value.pureWeight,
          "RATE_TYPE": "",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "",
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
          "UNQ_DESIGN_ID": "",
          "WIP_ACCODE": "",
          "UNIQUEID": 0,
          "LOCTYPE_CODE": this.metalReturnDetailsForm.value.location,
          "RETURN_STOCK": "",
          "SUB_RETURN_STOCK": "",
          "STONE_WT": this.metalReturnDetailsForm.value.stoneWeight,
          "NET_WT": this.metalReturnDetailsForm.value.netWeight,
          "PART_CODE": this.metalReturnDetailsForm.value.part_code,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": this.yearMonth,
          "PUDIFF": this.metalReturnDetailsForm.value.purityDiff,
          "JOB_PURITY": 0
        }
  
        this.close({postData});
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
