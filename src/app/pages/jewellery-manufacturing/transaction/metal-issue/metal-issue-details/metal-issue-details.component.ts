import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-metal-issue-details',
  templateUrl: './metal-issue-details.component.html',
  styleUrls: ['./metal-issue-details.component.scss']
})
export class MetalIssueDetailsComponent implements OnInit {
  @Input() data!: any;
  @Input() content!: any;
  @Input() isViewChangeJob: boolean = true;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  columnhead: any[] = ['DIVCODE', 'STOCK_CODE', 'KARAT', 'COLOR', 'Req.Pcs', 'Req.Wt ', 'Issued Pcs', 'Issued Wt', 'Bal.pcs', 'Bal.Wt'];
  vocMaxDate = new Date();
  currentDate = new Date();
  branchCode?: String;
  yearMonth?: String;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  jobNumberDetailData: any[] = [];
  userName = localStorage.getItem('username');
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  isViewContinue!: boolean;
  viewMode: boolean = false;
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
  jobNumberCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "Process_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  metalIssueDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobNumDes: ['', [Validators.required]],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode: ['', [Validators.required]],
    processCodeDesc: ['', [Validators.required]],
    workerCode: ['', [Validators.required]],
    workerCodeDes: ['', [Validators.required]],
    pictureName: [''],
    DESIGN_CODE: [''],
    partCode: [''],
    unqDesignId: [''],
    uniqueId: [''],
    treeNumber: [''],
    jobPurity: [''],
    stockCode: ['', [Validators.required]],
    stockCodeDes: ['', [Validators.required]],
    pcs: [''],
    PURITY: [''],
    GROSS_WT: [''],
    netWeight: [''],
    STONE_WT: [''],
    PURE_WT: [''],
    toStockCode: [''],
    toStockCodeDes: [''],
    toStockCodeDes_1: [''],
    Comments: [''],
    location: [''],
    totalAmountFc: [''],
    DIVCODE: [''],
    KARAT_CODE: [''],
    KARAT: [''],
    subStockCode: [''],
    totalAmountLc: [''],
    purityDiff: [''],
    amountFc: [''],
    jobPcs: ['1'],
    amountLc: [''],
    masterMetal: [false],
    FLAG: [null]
  });
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.setFormValues()
    if (this.content) {
      this.metalIssueDetailsForm.controls.FLAG.setValue(this.content[0].FLAG)
      console.log(this.content, 'viewMode is true');
      if (this.content[0].FLAG == 'VIEW') {
        this.viewMode = true;
      }
    }

  }

  
  locationCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.metalIssueDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(e.job_description);
    // this.metalIssueDetailsForm.controls.subJobNo.setValue(e.job_number);
    // this.metalIssueDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }
  stockCodeSelected(e: any) {
    console.log(e);
    this.metalIssueDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(e.DIVISION_CODE);
    this.metalIssueDetailsForm.controls.pcs.setValue(e.PCS);
    this.metalIssueDetailsForm.controls.toStockCode.setValue(e.DIVISION_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes_1.setValue(e.DESCRIPTION);
    this.jobNumberValidate({ target: { value: e.STOCK_CODE } })
  }


  processCodeSelected(e: any) {
    this.metalIssueDetailsForm.controls.processCode.setValue(e.Process_Code);
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(e.Description);
  }

  workerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  workerCodeSelected(e: any) {
    console.log(e);
    this.metalIssueDetailsForm.controls.workerCode.setValue(e.WORKER_CODE);
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(e.WORKER_CODE);

  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  jobchange() {
    this.formSubmit()
  }

  jobcontinue(data?: any) {
    this.formSubmit()
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  closed(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen = true;

  }


  onFileChangedimage(event: any) {
    this.imageurl = event.target.files[0]
    console.log(this.imageurl)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result;
      };
    }
  }
  onFileChanged(event: any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result;
      };
    }
  }

  setFormValues() {
    if (!this.content) return
    this.metalIssueDetailsForm.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.GROSS_WT.setValue(this.content.GROSS_WT)
    this.metalIssueDetailsForm.controls.processCode.setValue(this.content.PROCESS_CODE)
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(this.content.PROCESS_NAME)
    this.metalIssueDetailsForm.controls.workerCode.setValue(this.content.WORKER_CODE)
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(this.content.WORKER_NAME)
    this.metalIssueDetailsForm.controls.DIVCODE.setValue(this.content.DIVCODE)
    this.metalIssueDetailsForm.controls.STONE_WT.setValue(this.content.STONE_WT)
    this.metalIssueDetailsForm.controls.PURE_WT.setValue(this.content.PURE_WT)
    this.metalIssueDetailsForm.controls.pcs.setValue(this.content.PCS)
    this.metalIssueDetailsForm.controls.PURITY.setValue(this.content.PURITY)
    this.metalIssueDetailsForm.controls.subJobNo.setValue(this.content.JOB_SO_NUMBER)
    this.metalIssueDetailsForm.controls.subJobNoDes.setValue(this.content.JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.netWeight.setValue(this.content.NET_WT)
    this.metalIssueDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(this.content.STOCK_DESCRIPTION)
    this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(this.content.KARAT_CODE)
    this.metalIssueDetailsForm.controls.KARAT.setValue(this.content.KARAT)
    this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
    this.metalIssueDetailsForm.controls.location.setValue(this.content.LOCATION_CODE);
    this.tableData = [{
      DIVCODE: this.content.DIVCODE,
      STOCK_CODE: this.content.STOCK_CODE,
    }]
  };

  submitValidations(form: any) {
    if (form.jobNumber == '') {
      this.comService.toastErrorByMsgId('Job number is required')
      return true
    }
    if (form.workerCode == '') {
      this.comService.toastErrorByMsgId('Worker code is required')
      return true
    }
    if (form.processCode == '') {
      this.comService.toastErrorByMsgId('Process code is required')
      return true
    }
    if (form.stockCode == '') {
      this.comService.toastErrorByMsgId('Stock code is required')
      return true
    }
    if (form.GROSS_WT == '') {
      this.comService.toastErrorByMsgId('Stock code is required')
      return true
    }
    return false
  }
  formSubmit() {
    if (this.submitValidations(this.metalIssueDetailsForm.value)) return;

    let postData = {
      "SRNO": this.comService.emptyToZero(this.content.SRNO),
      "VOCNO": this.comService.emptyToZero(this.content.VOCNO),
      "VOCTYPE": this.comService.emptyToZero(this.content.VOCTYPE),
      "VOCDATE": this.comService.nullToString(this.content.VOCDATE),
      "JOB_NUMBER": this.metalIssueDetailsForm.value.jobNumber,
      "JOB_DATE": "2023-11-18T10:54:29.344Z",
      "JOB_SO_NUMBER": this.comService.emptyToZero(this.metalIssueDetailsForm.value.subJobNo),
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": this.metalIssueDetailsForm.value.subJobNoDes,
      "BRANCH_CODE": "dm3",
      "DESIGN_CODE": this.metalIssueDetailsForm.value.DESIGN_CODE,
      "DIVCODE": this.metalIssueDetailsForm.value.DIVCODE,
      "STOCK_CODE": this.metalIssueDetailsForm.value.stockCode,
      "STOCK_DESCRIPTION": this.metalIssueDetailsForm.value.stockCodeDes,
      "SUB_STOCK_CODE": this.metalIssueDetailsForm.value.subStockCode,
      "KARAT_CODE": this.metalIssueDetailsForm.value.KARAT_CODE,
      "JOB_PCS": this.metalIssueDetailsForm.value.jobPcs,
      "PCS": this.metalIssueDetailsForm.value.pcs,
      "GROSS_WT": this.metalIssueDetailsForm.value.GROSS_WT,
      "PURITY": this.metalIssueDetailsForm.value.PURITY,
      "PURE_WT": this.metalIssueDetailsForm.value.PURE_WT,
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
      "TOTAL_AMOUNTFC": this.comService.emptyToZero(this.metalIssueDetailsForm.value.totalAmountFc),
      "TOTAL_AMOUNTLC": this.comService.emptyToZero(this.metalIssueDetailsForm.value.totalAmountLc),
      "PROCESS_CODE": this.metalIssueDetailsForm.value.processCode,
      "PROCESS_NAME": this.metalIssueDetailsForm.value.processCodeDesc,
      "WORKER_CODE": this.metalIssueDetailsForm.value.workerCode,
      "WORKER_NAME": this.metalIssueDetailsForm.value.workerCodeDes,
      "UNQ_DESIGN_ID": this.metalIssueDetailsForm.value.unqDesignId,
      "WIP_ACCODE": "string",
      "UNIQUEID": this.comService.emptyToZero(this.metalIssueDetailsForm.value.uniqueId),
      "LOCTYPE_CODE": this.metalIssueDetailsForm.value.location,
      "AMOUNTFC": this.comService.emptyToZero(this.metalIssueDetailsForm.value.amountFc),
      "AMOUNTLC": this.comService.emptyToZero(this.metalIssueDetailsForm.value.amountLc),
      "PICTURE_NAME": this.metalIssueDetailsForm.value.pictureName,
      "PART_CODE": this.metalIssueDetailsForm.value.partCode,
      "MASTER_METAL": this.metalIssueDetailsForm.value.masterMetal,
      "STONE_WT": this.comService.emptyToZero(this.metalIssueDetailsForm.value.STONE_WT),
      "NET_WT": this.metalIssueDetailsForm.value.netWeight,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "MIS",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "string",
      "TO_STOCK_CODE": "string",
      "TO_STOCK_DESCRIPTION": this.comService.nullToString(this.metalIssueDetailsForm.value.toStockCodeDes),
      "PUDIFF": this.comService.emptyToZero(this.metalIssueDetailsForm.value.purityDiff),
      "JOB_PURITY": this.comService.emptyToZero(this.metalIssueDetailsForm.value.jobPurity),
      "EXCLUDE_TRANSFER_WT": true
    }
    this.closed(postData);
  }
  setValueWithDecimal(formControlName:string,value:any,Decimal:string){
    this.metalIssueDetailsForm.controls[formControlName].setValue(
      this.comService.setCommaSerperatedNumber(value,Decimal)
    )
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.metalIssueDetailsForm.value.subJobNo,
        'strBranchCode': this.comService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }

    this.comService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.tableData = data
          console.log(data,'sub data');
          
          this.metalIssueDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalIssueDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.metalIssueDetailsForm.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.metalIssueDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.metalIssueDetailsForm.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          this.metalIssueDetailsForm.controls.workerCodeDes.setValue(data[0].WORKERDESC)
          this.metalIssueDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalIssueDetailsForm.controls.DESIGN_CODE.setValue(this.content.DESIGN_CODE)
         
          this.metalIssueDetailsForm.controls.pcs.setValue(data[0].PCS)
          this.setValueWithDecimal('PURE_WT',data[0].PUREWT,'THREE')
          this.setValueWithDecimal('GROSS_WT',data[0].METAL,'METAL')
          this.setValueWithDecimal('PURITY',data[0].PURITY,'PURITY')
          this.setValueWithDecimal('netWeight',data[0].NETWT,'THREE')
          this.setValueWithDecimal('KARAT',data[0].KARAT,'THREE')
          this.setValueWithDecimal('STONE_WT',data[0].STONE,'STONE')

          // this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(
          //   this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))



          // this.meltingIssuedetailsFrom.controls.PURITY.setValue(data[0].PURITY)
          // this.meltingIssuedetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          // this.meltingIssuedetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          // // this.stockCodeScrapValidate()
          // this.meltingIssuedetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.meltingIssuedetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          // this.meltingIssuedetailsFrom.controls.UNQ_DESIGN_ID.setValue(data[0].UNQ_DESIGN_ID)
          // this.meltingIssuedetailsFrom.controls.PICTURE_PATH.setValue(data[0].PICTURE_PATH)
          // this.meltingIssuedetailsFrom.controls.EXCLUDE_TRANSFER_WT.setValue(data[0].EXCLUDE_TRANSFER_WT)
          // this.fillStoneDetails()
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
            this.jobNumberDetailData = data
            this.metalIssueDetailsForm.controls.subJobNo.setValue(data[0].UNQ_JOB_ID)
            this.metalIssueDetailsForm.controls.subJobNoDes.setValue(data[0].JOB_DESCRIPTION)
            this.metalIssueDetailsForm.controls.KARAT_CODE.setValue(data[0].KARAT_CODE)
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






