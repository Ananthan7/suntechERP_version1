import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
  userName = localStorage.getItem('username');

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
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: ['', [Validators.required]],
    processCodeDesc: [''],
    workerCode: ['', [Validators.required]],
    workerCodeDesc: [''],
    designCode: [''],
    partcode: [''],
    makingRateFc: [''],
    makingRateLc: [''],
    makingAmountLC: [''],
    makingAmountFC: [''],
    treeNumber: [''], // no
    location: ['', [Validators.required]],
    stockCode: ['', [Validators.required]],
    stockCodeDesc: [''],
    pcs: [''],
    purity: [''],
    grossWeight: [''],
    netWeight: [''],
    stoneWeight: [''],
    pureWeight: [''],
    remarks: [''],
    metalGramRateFc: [''],
    metalGramRateLc: [''],
    metalAmountFc: [''],
    metalAmountLc: [''],
    totalRateFc: [''],
    purityDiff: [''],
    totalRateLc: [''],
    jobPcs: [''],
    jobPcsDate: [''],
    vocType: [''],
    FLAG: [null]
  });
  data: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    this.setFormValues()
    if (this.content) {
      this.metalReturnDetailsForm.controls.FLAG.setValue(this.content[0].FLAG)
    }
    console.log(this.content.FLAG, 'viewMode is true');
    if (this.content[0].FLAG == 'VIEW') {
      this.viewMode = true;

    }
  }


  WorkerCodeSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(e.DESCRIPTION);
  }
  locationCodeSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }
  jobnoCodeSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalReturnDetailsForm.controls.jobDes.setValue(e.job_description);
    this.metalReturnDetailsForm.controls.subJobNo.setValue(e.job_number);
    this.metalReturnDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  ProcessCodeSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.processCode.setValue(e.Process_Code);
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(e.Description);
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(e.DESCRIPTION);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  setFormValues() {
    if (!this.content) return
    if (this.content[0]?.HEADERDETAILS) {
      let data = this.content[0]?.HEADERDETAILS
      this.metalReturnDetailsForm.controls.vocType.setValue(data.vocType)
      console.log(this.content, 'headerdetaails');
    }
    console.log(this.content, 'ppppp');


    this.metalReturnDetailsForm.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.metalReturnDetailsForm.controls.jobDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalReturnDetailsForm.controls.subJobNo.setValue(this.content.JOB_SO_NUMBER)
    this.metalReturnDetailsForm.controls.subJobNoDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalReturnDetailsForm.controls.processCode.setValue(this.content.PROCESS_CODE)
    this.metalReturnDetailsForm.controls.processCodeDesc.setValue(this.content.PROCESS_NAME)
    this.metalReturnDetailsForm.controls.workerCode.setValue(this.content.WORKER_CODE)
    this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(this.content.WORKER_NAME)
    this.metalReturnDetailsForm.controls.designCode.setValue(this.content.DESIGN_CODE)
    this.metalReturnDetailsForm.controls.stoneWeight.setValue(this.content.STONE_WT)
    this.metalReturnDetailsForm.controls.pureWeight.setValue(this.content.PURE_WT)
    this.metalReturnDetailsForm.controls.pcs.setValue(this.content.PCS)
    this.metalReturnDetailsForm.controls.purity.setValue(this.content.PURITY)
    this.metalReturnDetailsForm.controls.grossWeight.setValue(this.content.GROSS_WT)
    this.metalReturnDetailsForm.controls.netWeight.setValue(this.content.NET_WT)
    this.metalReturnDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(this.content.STOCK_DESCRIPTION)
    this.metalReturnDetailsForm.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.metalReturnDetailsForm.controls.partcode.setValue(this.content.PART_CODE)

  };

  continue() { }


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
    let postData = {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": this.metalReturnDetailsForm.value.vocType,
      "VOCDATE": "2023-10-06T09:31:04.626Z",
      "JOB_NUMBER": this.metalReturnDetailsForm.value.jobNumber,
      "JOB_DATE": "2024-03-05T12:13:39.290Z",
      "JOB_SO_NUMBER": this.comService.emptyToZero(this.metalReturnDetailsForm.value.subJobNo),
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
      "METAL_GRM_RATEFC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.metalGramRateFc),
      "METAL_GRM_RATELC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.metalGramRateLc),
      "METAL_AMOUNTFC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.metalAmountFc),
      "METAL_AMOUNTLC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.metalAmountLc),
      "MAKING_RATEFC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.makingRateFc),
      "MAKING_RATELC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.makingRateLc),
      "MAKING_AMOUNTFC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.makingAmountFC),
      "MAKING_AMOUNTLC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.makingAmountFC),
      "TOTAL_RATEFC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.totalRateFc),
      "TOTAL_RATELC": this.comService.emptyToZero(this.metalReturnDetailsForm.value.totalRateLc),
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
      "PART_CODE": "",
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "DMR",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "PUDIFF": 0,
      "JOB_PURITY": 0
    }
    this.close(postData);
  }

  updateMeltingType() {

    let postData =
    {
      "SRNO": 0,
      "VOCNO": 0,
      "VOCTYPE": this.metalReturnDetailsForm.value.vocType,
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
      "PART_CODE": "",
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": this.metalReturnDetailsForm.value.vocType,
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "PUDIFF": this.metalReturnDetailsForm.value.purityDiff,
      "JOB_PURITY": 0
    }

    this.close({ postData });
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

  jobNumberSelected(e: any) {
    console.log(e);
    this.metalReturnDetailsForm.controls.jobNumber.setValue(e.PREFIX_CODE);

  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.metalReturnDetailsForm.value.subJobNo,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        console.log(postData, 'uuu')
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.metalReturnDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalReturnDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.metalReturnDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.metalReturnDetailsForm.controls.stockCodeDesc.setValue(data[0].STOCK_DESCRIPTION)
          this.metalReturnDetailsForm.controls.pureWeight.setValue(data[0].PUREWT)
          this.metalReturnDetailsForm.controls.pcs.setValue(data[0].PCS)
          this.metalReturnDetailsForm.controls.workerCodeDesc.setValue(data[0].WORKERDESC)
          this.metalReturnDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalReturnDetailsForm.controls.grossWeight.setValue(data[0].METAL)
          this.metalReturnDetailsForm.controls.purity.setValue(data[0].PURITY)
          this.metalReturnDetailsForm.controls.netWeight.setValue(data[0].NETWT)
          this.metalReturnDetailsForm.controls.stoneWeight.setValue(data[0].STONE)
          this.metalReturnDetailsForm.controls.location.setValue(data[0].LOCTYPE_CODE)
          this.metalReturnDetailsForm.controls.designCode.setValue(data[0].DESIGN_CODE)



        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strJobNumber': this.comService.nullToString(event.target.value),
        'strCurrenctUser': this.comService.nullToString(this.userName)
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            console.log(data, 'pppp')
            this.jobNumberDetailData = data
            this.metalReturnDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalReturnDetailsForm.controls.subJobNoDes.setValue(data[0].JOB_DESCRIPTION)


            this.subJobNumberValidate()
          } else {
            this.comService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.comService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.comService.closeSnackBarMsg()
        this.comService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

}
