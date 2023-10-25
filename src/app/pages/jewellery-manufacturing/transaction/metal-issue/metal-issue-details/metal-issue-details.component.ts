import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue-details',
  templateUrl: './metal-issue-details.component.html',
  styleUrls: ['./metal-issue-details.component.scss']
})
export class MetalIssueDetailsComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  columnhead: any[] = ['Div', 'Stock Code', 'Karat', 'Color', 'Req.Pcs', 'Req.Wt ', 'Issued Pcs', 'Issued Wt', 'Bal.pcs', 'Bal.Wt'];
  vocMaxDate = new Date();
  currentDate = new Date();
  
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
    this.metalIssueDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
    if (this.content) {
      this.setFormValues()
    }
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  metalIssueDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber: [''],
    jobDate: [''],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: [''],
    processCodeDesc: [''],
    workerCode: [''],
    workerCodeDes: [''],
    pictureName: [''],
    designCode: [''],
    partCode: [''],
    unqDesignId: [''],
    uniqueId:[''],
    treeNumber: [''],
    jobPurity: [''],
    stockCode: [''],
    stockCodeDes: [''],
    pcs: [''],
    purity: [''],
    grossWeight: [''],
    netWeight: [''],
    stoneWeight: [''],
    pureWeight: [''],
    toStockCode: [''],
    toStockCodeDes: [''],
    Comments: [''],
    location: [''],
    totalAmountFc: [''],
    subStockCode: [''],
    totalAmountLc: [''],
    purityDiff: [''],
    amountFc: [''],
    jobPcs: [''],
    amountLc: [''],
    materMetal:[false]
  });

  

  setFormValues() {
    if (!this.content) return
    console.log(this.content);
  };

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.updateMeltingType()
      return
    }

    if (this.metalIssueDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'JobMetalIssueMasterDJ/InsertJobMetalIssueMasterDJ'
    let postData =
        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2023-10-04T06:58:11.997Z",
          "JOB_NUMBER": this.metalIssueDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalIssueDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalIssueDetailsForm.value.subJobNo,
          "JOB_DESCRIPTION": this.metalIssueDetailsForm.value.subJobNoDes,
          "DESIGN_CODE": this.metalIssueDetailsForm.value.designCode,
          "STOCK_CODE": this.metalIssueDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalIssueDetailsForm.value.stockCodeDes,
          "SUB_STOCK_CODE": this.metalIssueDetailsForm.value.subStockCode,
          "UNQ_JOB_ID": "string",
          "BRANCH_CODE": "string",
          "DIVCODE": "s",
          "KARAT_CODE": "stri",
          "MID": 0,
          "JOB_PCS": this.metalIssueDetailsForm.value.jobPcs,
          "PCS": this.metalIssueDetailsForm.value.pcs,
          "GROSS_WT": this.metalIssueDetailsForm.value.grossWeight,
          "PURITY": this.metalIssueDetailsForm.value.purity,
          "PURE_WT": this.metalIssueDetailsForm.value.netWeight,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": 0,
          "METAL_GRM_RATELC": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTLC": 0,
          "MAKING_RATEFC": 0,
          "MAKING_RATELC": 0,
          "MAKING_AMOUNTFC": 0,
          "MAKING_AMOUNTLC": 0,
          "TOTAL_RATEFC": 0,
          "TOTAL_RATELC": 0,
          "TOTAL_AMOUNTFC":  this.metalIssueDetailsForm.value.totalAmountFc,
          "TOTAL_AMOUNTLC":  this.metalIssueDetailsForm.value.totalAmountLc,
          "PROCESS_CODE": this.metalIssueDetailsForm.value.processCode,
          "PROCESS_NAME": this.metalIssueDetailsForm.value.processCodeDesc,
          "WORKER_CODE": this.metalIssueDetailsForm.value.workerCode,
          "WORKER_NAME": this.metalIssueDetailsForm.value.workerCodeDes,
          "UNQ_DESIGN_ID": this.metalIssueDetailsForm.value.unqDesignId,
          "WIP_ACCODE": "string",
          "UNIQUEID": this.metalIssueDetailsForm.value.uniqueId,
          "LOCTYPE_CODE": this.metalIssueDetailsForm.value.location.toString(),
          "AMOUNTFC":this.metalIssueDetailsForm.value.amountFc,
          "AMOUNTLC": this.metalIssueDetailsForm.value.amountLc,
          "PICTURE_NAME": this.metalIssueDetailsForm.value.pictureName,
          "PART_CODE": "string",
          "MASTER_METAL": this.metalIssueDetailsForm.value.materMetal,
          "STONE_WT": this.metalIssueDetailsForm.value.stoneWeight,
          "NET_WT": this.metalIssueDetailsForm.value.stoneWeight,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "TO_STOCK_CODE": this.metalIssueDetailsForm.value.toStockCode,
          "TO_STOCK_DESCRIPTION":  this.metalIssueDetailsForm.value.toStockCodeDes,
          "PUDIFF": this.metalIssueDetailsForm.value.purityDiff,
          "JOB_PURITY":  this.metalIssueDetailsForm.value.jobPurity,
          "EXCLUDE_TRANSFER_WT": true
        }
    this.close(postData);
  }

  updateMeltingType() {
    let API = 'JobMetalIssueMasterDJ/UpdateJobMetalIssueMasterDJ/'+ this.metalIssueDetailsForm.value.brnachCode + this.metalIssueDetailsForm.value.voctype + this.metalIssueDetailsForm.value.vocNo + this.metalIssueDetailsForm.value.yearMoth ;
    let postData =
    {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": 0,
      "VOCDATE": "2023-10-04T06:58:11.997Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-04T06:58:11.997Z",
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
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "SYSTEM_DATE": "2023-10-04T06:58:11.997Z",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "SRNO": 0,
          "VOCNO": 0,
          "VOCTYPE": "str",
          "VOCDATE": "2023-10-04T06:58:11.997Z",
          "JOB_NUMBER": this.metalIssueDetailsForm.value.jobNumber,
          "JOB_DATE": this.metalIssueDetailsForm.value.jobDate,
          "JOB_SO_NUMBER": this.metalIssueDetailsForm.value.subJobNo,
          "JOB_DESCRIPTION": this.metalIssueDetailsForm.value.subJobNoDes,
          "DESIGN_CODE": this.metalIssueDetailsForm.value.designCode,
          "STOCK_CODE": this.metalIssueDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalIssueDetailsForm.value.stockCodeDes,
          "SUB_STOCK_CODE": this.metalIssueDetailsForm.value.subStockCode,
          "UNQ_JOB_ID": "string",
          "BRANCH_CODE": "string",
          "DIVCODE": "s",
          "KARAT_CODE": "stri",
          "MID": 0,
          "JOB_PCS": this.metalIssueDetailsForm.value.jobPcs,
          "PCS": this.metalIssueDetailsForm.value.pcs,
          "GROSS_WT": this.metalIssueDetailsForm.value.grossWeight,
          "PURITY": this.metalIssueDetailsForm.value.purity,
          "PURE_WT": this.metalIssueDetailsForm.value.netWeight,
          "RATE_TYPE": "string",
          "METAL_RATE": 0,
          "CURRENCY_CODE": "stri",
          "CURRENCY_RATE": 0,
          "METAL_GRM_RATEFC": 0,
          "METAL_GRM_RATELC": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTLC": 0,
          "MAKING_RATEFC": 0,
          "MAKING_RATELC": 0,
          "MAKING_AMOUNTFC": 0,
          "MAKING_AMOUNTLC": 0,
          "TOTAL_RATEFC": 0,
          "TOTAL_RATELC": 0,
          "TOTAL_AMOUNTFC":  this.metalIssueDetailsForm.value.totalAmountFc,
          "TOTAL_AMOUNTLC":  this.metalIssueDetailsForm.value.totalAmountLc,
          "PROCESS_CODE": this.metalIssueDetailsForm.value.processCode,
          "PROCESS_NAME": this.metalIssueDetailsForm.value.processCodeDesc,
          "WORKER_CODE": this.metalIssueDetailsForm.value.workerCode,
          "WORKER_NAME": this.metalIssueDetailsForm.value.workerCodeDes,
          "UNQ_DESIGN_ID": this.metalIssueDetailsForm.value.unqDesignId,
          "WIP_ACCODE": "string",
          "UNIQUEID": this.metalIssueDetailsForm.value.uniqueId,
          "LOCTYPE_CODE": this.metalIssueDetailsForm.value.location.toString(),
          "AMOUNTFC":this.metalIssueDetailsForm.value.amountFc,
          "AMOUNTLC": this.metalIssueDetailsForm.value.amountLc,
          "PICTURE_NAME": this.metalIssueDetailsForm.value.pictureName,
          "PART_CODE": "string",
          "MASTER_METAL": this.metalIssueDetailsForm.value.materMetal,
          "STONE_WT": this.metalIssueDetailsForm.value.stoneWeight,
          "NET_WT": this.metalIssueDetailsForm.value.stoneWeight,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "TO_STOCK_CODE": this.metalIssueDetailsForm.value.toStockCode,
          "TO_STOCK_DESCRIPTION":  this.metalIssueDetailsForm.value.toStockCodeDes,
          "PUDIFF": this.metalIssueDetailsForm.value.purityDiff,
          "JOB_PURITY":  this.metalIssueDetailsForm.value.jobPurity,
          "EXCLUDE_TRANSFER_WT": true
        }
      ]
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
        let API = 'JobMetalIssueMasterDJ/DeleteJobMetalIssueMasterDJ/' + this.metalIssueDetailsForm.value.brnachCode + this.metalIssueDetailsForm.value.voctype + this.metalIssueDetailsForm.value.vocNo + this.metalIssueDetailsForm.value.yearMoth;
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
                    this.metalIssueDetailsForm.reset()
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
                    this.metalIssueDetailsForm.reset()
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

 


}




