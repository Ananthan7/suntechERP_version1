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
  columnhead: any[] = ['Div', 'Stock Code', 'Karat', 'Color', 'Req.Pcs', 'Req.Wt ', 'Issued Pcs', 'Issued Wt', 'Bal.pcs', 'Bal.Wt'];
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

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    if (this.content) {
      console.log(this.content,'lool')
      this.setFormValues()
    }
    //console.log(this.data);
    // if (this.data) {
    //   this.jobcontinue()
    // }
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
    } 
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
  locationCodeSelected(e:any){
    console.log(e);
    this.metalIssueDetailsForm.controls.location.setValue(e.LOCATION_CODE);
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
  jobNumberCodeSelected(e:any){
    console.log(e);
    this.metalIssueDetailsForm.controls.jobNumber.setValue(e.job_number);
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(e.job_description);
    this.metalIssueDetailsForm.controls.subJobNo.setValue(e.job_number);
    this.metalIssueDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
    
  }

  // subJobNoCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 46,
  //   SEARCH_FIELD: 'job_number',
  //   SEARCH_HEADING: 'Job Search',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "job_number<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
  // subJobNoCodeSelected(e:any){
  //   console.log(e);
  //   this.metalIssueDetailsForm.controls.subJobNo.setValue(e.job_number);
  //   this.metalIssueDetailsForm.controls.subJobNoDes.setValue(e.job_description);
    
  // }

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
  processCodeSelected(e:any){
    console.log(e);
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
  workerCodeSelected(e:any){
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
  stockCodeSelected(e:any){
    console.log(e); 
    this.metalIssueDetailsForm.controls.stockCode.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(e.DESCRIPTION);
    this.metalIssueDetailsForm.controls.subStockCode.setValue(e.DIVISION_CODE);
     this.metalIssueDetailsForm.controls.pcs.setValue(e.PCS);
    this.metalIssueDetailsForm.controls.toStockCode.setValue(e.DIVISION_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes.setValue(e.STOCK_CODE);
    this.metalIssueDetailsForm.controls.toStockCodeDes_1.setValue(e.DESCRIPTION);
    
  }

  
  jobchange(){
    this.formSubmit()
  }

  jobcontinue(data?: any){
    this.formSubmit()
   } 
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  closed(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen=true;

  }


  onFileChangedimage(event:any) {
    this.imageurl = event.target.files[0]
    console.log(this.imageurl)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result; 
      };
    }
  }
  onFileChanged(event:any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result; 
      };
    }
  }


  metalIssueDetailsForm: FormGroup = this.formBuilder.group({
    jobNumber:  ['',[Validators.required]],
    jobNumDes:  ['',[Validators.required]],
    subJobNo: [''],
    subJobNoDes: [''],
    processCode:  ['',[Validators.required]],
    processCodeDesc:  ['',[Validators.required]],
    workerCode:  ['',[Validators.required]],
    workerCodeDes:  ['',[Validators.required]],
    pictureName: [''],
    designCode: [''],
    partCode: [''],
    unqDesignId: [''],
    uniqueId:[''],
    treeNumber: [''],
    jobPurity: [''],
    stockCode: ['',[Validators.required]],
    stockCodeDes: ['',[Validators.required]],
    pcs: [''],
    purity: [''],
    grossWeight: [''],
    netWeight: [''],
    stoneWeight: [''],
    pureWeight: [''],
    toStockCode: [''],
    toStockCodeDes: [''],
    toStockCodeDes_1: [''],
    Comments: [''],
    location: ['',[Validators.required]],
    totalAmountFc: [''],
    subStockCode: [''],
    totalAmountLc: [''],
    purityDiff: [''],
    amountFc: [''],
    jobPcs: ['1'],
    amountLc: [''],
    masterMetal:[false]
  });

  

  setFormValues() {
    if (!this.content) return
    console.log(this.content,'ppppp');
    this.metalIssueDetailsForm.controls.jobNumber.setValue(this.content[0].JOB_NUMBER)
    this.metalIssueDetailsForm.controls.jobNumDes.setValue(this.content[0].job_description)
    this.metalIssueDetailsForm.controls.grossWeight.setValue(this.content[0].GROSS_WT)
    this.metalIssueDetailsForm.controls.processCode.setValue(this.content[0].PROCESS_CODE)
    this.metalIssueDetailsForm.controls.processCodeDesc.setValue(this.content[0].PROCESS_NAME)
    this.metalIssueDetailsForm.controls.workerCode.setValue(this.content[0].WORKER_CODE)
    this.metalIssueDetailsForm.controls.workerCodeDes.setValue(this.content[0].WORKER_NAME)
    this.metalIssueDetailsForm.controls.designCode.setValue(this.content[0].DIVCODE)
    this.metalIssueDetailsForm.controls.stoneWeight.setValue(this.content[0].STONE_WT)
    this.metalIssueDetailsForm.controls.pureWeight.setValue(this.content[0].PURE_WT)
    this.metalIssueDetailsForm.controls.pcs.setValue(this.content[0].PCS)
    this.metalIssueDetailsForm.controls.purity.setValue(this.content[0].PURITY)
    this.metalIssueDetailsForm.controls.subJobNo.setValue(this.content[0].JOB_SO_NUMBER)
    this.metalIssueDetailsForm.controls.subJobNoDes.setValue(this.content[0].JOB_DESCRIPTION)
    this.metalIssueDetailsForm.controls.netWeight.setValue(this.content[0].NET_WT)
    this.metalIssueDetailsForm.controls.stockCode.setValue(this.content[0].STOCK_CODE)
    this.metalIssueDetailsForm.controls.stockCodeDes.setValue(this.content[0].STOCK_DESCRIPTION)
  };

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT' && this.data) {
       this.updateMeltingType()
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
          "VOCTYPE": "MIS",
          "VOCDATE": "2023-11-18T10:54:29.344Z",
          "JOB_NUMBER": this.metalIssueDetailsForm.value.jobNumber,
          "JOB_DATE": "2023-11-18T10:54:29.344Z",
          "JOB_SO_NUMBER": this.comService.emptyToZero(this.metalIssueDetailsForm.value.subJobNo),
          "UNQ_JOB_ID": "string",
          "JOB_DESCRIPTION": this.metalIssueDetailsForm.value.subJobNoDes,
          "BRANCH_CODE": "dm3",
          "DESIGN_CODE": this.metalIssueDetailsForm.value.designCode,
          "DIVCODE": "s",
          "STOCK_CODE": this.metalIssueDetailsForm.value.stockCode,
          "STOCK_DESCRIPTION": this.metalIssueDetailsForm.value.stockCodeDes,
          "SUB_STOCK_CODE": this.metalIssueDetailsForm.value.subStockCode,
          "KARAT_CODE": "stri",
          "JOB_PCS": this.metalIssueDetailsForm.value.jobPcs,
          "PCS": this.metalIssueDetailsForm.value.pcs,
          "GROSS_WT": this.metalIssueDetailsForm.value.grossWeight,
          "PURITY": this.metalIssueDetailsForm.value.purity,
          "PURE_WT": this.metalIssueDetailsForm.value.pureWeight,
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
          "TOTAL_AMOUNTFC":  this.comService.emptyToZero(this.metalIssueDetailsForm.value.totalAmountFc),
          "TOTAL_AMOUNTLC":   this.comService.emptyToZero(this.metalIssueDetailsForm.value.totalAmountLc),
          "PROCESS_CODE": this.metalIssueDetailsForm.value.processCode,
          "PROCESS_NAME": this.metalIssueDetailsForm.value.processCodeDesc,
          "WORKER_CODE": this.metalIssueDetailsForm.value.workerCode,
          "WORKER_NAME": this.metalIssueDetailsForm.value.workerCodeDes,
          "UNQ_DESIGN_ID": this.metalIssueDetailsForm.value.unqDesignId,
          "WIP_ACCODE": "string",
          "UNIQUEID": this.comService.emptyToZero(this.metalIssueDetailsForm.value.uniqueId),
          "LOCTYPE_CODE": this.metalIssueDetailsForm.value.location,
          "AMOUNTFC":this.comService.emptyToZero(this.metalIssueDetailsForm.value.amountFc),
          "AMOUNTLC": this.comService.emptyToZero(this.metalIssueDetailsForm.value.amountLc),
          "PICTURE_NAME": this.metalIssueDetailsForm.value.pictureName,
          "PART_CODE": this.metalIssueDetailsForm.value.partCode,
          "MASTER_METAL": this.metalIssueDetailsForm.value.masterMetal,
          "STONE_WT": this.comService.emptyToZero(this.metalIssueDetailsForm.value.stoneWeight),
          "NET_WT": this.metalIssueDetailsForm.value.netWeight,
          "DT_BRANCH_CODE": this.branchCode,
          "DT_VOCTYPE": "MIS",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "TO_STOCK_CODE": "string",
          "TO_STOCK_DESCRIPTION":  this.comService.nullToString(this.metalIssueDetailsForm.value.toStockCodeDes),
          "PUDIFF": this.comService.emptyToZero(this.metalIssueDetailsForm.value.purityDiff),
          "JOB_PURITY":  this.comService.emptyToZero(this.metalIssueDetailsForm.value.jobPurity),
          "EXCLUDE_TRANSFER_WT": true
        }
          this.closed(postData);  
          
  }


  updateMeltingType() {
   
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
          "JOB_DATE": "2023-11-18T10:54:29.344Z",
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
        console.log(postData,'uuu')
        this.comService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]
          this.metalIssueDetailsForm.controls.processCode.setValue(data[0].PROCESS)
          this.metalIssueDetailsForm.controls.workerCode.setValue(data[0].WORKER)
          this.metalIssueDetailsForm.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.metalIssueDetailsForm.controls.stockCodeDes.setValue(data[0].STOCK_DESCRIPTION)
          this.metalIssueDetailsForm.controls.pureWeight.setValue(data[0].PUREWT)
          this.metalIssueDetailsForm.controls.pcs.setValue(data[0].PCS)
          this.metalIssueDetailsForm.controls.workerCodeDes.setValue(data[0].WORKERDESC)
          this.metalIssueDetailsForm.controls.processCodeDesc.setValue(data[0].PROCESSDESC)
          this.metalIssueDetailsForm.controls.grossWeight.setValue(data[0].NETWT)
          this.metalIssueDetailsForm.controls.purity.setValue(data[0].PURITY)
          this.metalIssueDetailsForm.controls.netWeight.setValue(data[0].NETWT)
          this.metalIssueDetailsForm.controls.karat.setValue(data[0].KARAT)
          this.metalIssueDetailsForm.controls.stoneWeight.setValue(data[0].STONE)
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






