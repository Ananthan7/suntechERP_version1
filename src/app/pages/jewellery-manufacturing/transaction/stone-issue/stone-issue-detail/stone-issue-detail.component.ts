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
  selector: 'app-stone-issue-detail',
  templateUrl: './stone-issue-detail.component.html',
  styleUrls: ['./stone-issue-detail.component.scss']
})
export class StoneIssueDetailComponent implements OnInit {
  @Input() content!: any;
  columnhead1: any[] = ['Div', 'Stock Code','Shape', 'Color', 'Clarity', 'Size', 'Sieve Set', 'Pcs'];
  serialNo : any;
  subJobNo: any;
  tableData: any[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  private subscriptions: Subscription[] = [];
  jobNumberDetailData: any[] = [];
  viewMode: boolean = false;
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
    WHERECONDITION: "job_number<> ''",
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

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 41,
    SEARCH_FIELD: 'Stock_Code',
    SEARCH_HEADING: 'Stock Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "Stock_Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneIssueDetailsFrom: FormGroup = this.formBuilder.group({
    jobNumber: ['', [Validators.required]],
    jobDes: [''],
    subjobnumber: ['', [Validators.required]],
    subjobDes: [''],
    designcode: [''],
    partcode: [''],
    salesorderno: [0],
    process: ['', [Validators.required]],
    processname: [''],
    worker: ['', [Validators.required]],
    workername: [''],
    DIVCODE: ['', [Validators.required]],
    stockCode: [''],
    stockDes: [''],
    batchid: [''],
    location: ['', [Validators.required]],
    pieces: [],
    shape: [''],
    clarity: [''],
    carat: ['', [Validators.required]],
    size: [],
    sieveset: [''],
    unitrate: [],
    sieve: [''],
    sieveDesc: [''],
    amount: [],
    color: [''],
    stockbal: [],
    pointerwt: [],
    otheratt: [],
    remarks: [''],
    consignment:[false],
    FLAG: [null]
  });


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
    // this.srNo= srNo;
    console.log(this.content);
    if (this.content) {
      this.stoneIssueDetailsFrom.controls.FLAG.setValue(this.content.HEADERDETAILS.FLAG)
      if (this.content.HEADERDETAILS.FLAG == 'VIEW') {
        this.viewMode = true;
      }
      this.setFormValues() 
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

  locationCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  jobNumberCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(e.job_number);
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(e.job_description);
    this.subJobNo=`${e.job_number}/${this.serialNo}`;
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.subJobNo);
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
    // this.stoneIssueDetailsFrom.controls.designcode.setValue(e.job_number);
    // this.stoneIssueDetailsFrom.controls.partcode.setValue(e.job_description);
  }

  processCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.process.setValue(e.Process_Code);
    this.stoneIssueDetailsFrom.controls.processname.setValue(e.Description);
  }

  workerCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.stoneIssueDetailsFrom.controls.workername.setValue(e.DESCRIPTION);
  }
  
  stockCodeSelected(e: any) {
    console.log(e);
    this.stoneIssueDetailsFrom.controls.stock.setValue(e.Item);
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(e.STOCK_CODE);
    this.stoneIssueDetailsFrom.controls.stockDes.setValue(e.STOCK_DESCRIPTION);
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


  jobchange(){  
    this.formSubmit();
  }

  continueClick(){
    this.formSubmit();
    this.stoneIssueDetailsFrom.controls.stock.setValue('')
    this.stoneIssueDetailsFrom.controls.stockDes.setValue('')
    this.stoneIssueDetailsFrom.controls.sieve.setValue('')
    this.stoneIssueDetailsFrom.controls.shape.setValue('')
    this.stoneIssueDetailsFrom.controls.color.setValue('')
    this.stoneIssueDetailsFrom.controls.clarity.setValue('')
    this.stoneIssueDetailsFrom.controls.size.setValue('')
    this.stoneIssueDetailsFrom.controls.pieces.setValue('')
    this.stoneIssueDetailsFrom.controls.process.setValue('')
    this.stoneIssueDetailsFrom.controls.processname.setValue('')
    this.stoneIssueDetailsFrom.controls.worker.setValue('')
    this.stoneIssueDetailsFrom.controls.workername.setValue('')
    this.stoneIssueDetailsFrom.controls.location.setValue('')
    this.stoneIssueDetailsFrom.controls.consignment.setValue('')
    this.stoneIssueDetailsFrom.controls.sieveset.setValue('')
    this.stoneIssueDetailsFrom.controls.remarks.setValue('')
    this.stoneIssueDetailsFrom.controls.sieveset.setValue('')
    this.stoneIssueDetailsFrom.controls.otheratt.setValue('')
    this.stoneIssueDetailsFrom.controls.unitrate.setValue('')
    this.stoneIssueDetailsFrom.controls.amount.setValue('')
    this.stoneIssueDetailsFrom.controls.stockCode.setValue('')
    this.stoneIssueDetailsFrom.controls.carat.setValue('')
    this.stoneIssueDetailsFrom.controls.batchid.setValue('')
  }

  onchangeCheckBox(e: any){
    if(e == true){    
    return 1;
    }else{ 
    return 0;
    }     
  }


  removedata() {
    this.tableData.pop();
  }

  formSubmit() {
    if (this.stoneIssueDetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let form = this.stoneIssueDetailsFrom.value
    let postData = {
      "SRNO": this.comService.emptyToZero(this.content?.SRNO),
      "VOCNO": this.comService.emptyToZero(form.VOCNO),
      "VOCTYPE": this.comService.nullToString(form.VOCTYPE),
      "VOCDATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_NUMBER": this.comService.nullToString(form.jobNumber),
      "JOB_DATE": this.comService.formatDateTime(new Date(form.VOCDATE)),
      "JOB_SO_NUMBER": this.comService.emptyToZero(form.subjobnumber),
      "UNQ_JOB_ID": "",
      "JOB_DESCRIPTION": form.jobDes,
      "BRANCH_CODE": this.branchCode,
      "DESIGN_CODE": form.designcode,
      "DIVCODE": "",
      "STOCK_CODE": form.stock,
      "STOCK_DESCRIPTION": form.stockDes ,
      "SIEVE": form.sieve,
      "SHAPE": form.shape,
      "COLOR": form.color,
      "CLARITY": form.clarity,
      "SIZE": this.comService.nullToString(form.size),
      "JOB_PCS": 0,
      "PCS": this.comService.emptyToZero(form.pieces),
      "GROSS_WT": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": this.comService.emptyToZero(form.unitrate),
      "AMOUNTLC": this.comService.emptyToZero(form.amount),
      "PROCESS_CODE": form.process,
      "PROCESS_NAME": form.processname,
      "WORKER_CODE": form.worker,
      "WORKER_NAME": form.workername,
      "UNQ_DESIGN_ID": "",
      "WIP_ACCODE": "",
      "UNIQUEID": 0,
      "LOCTYPE_CODE": form.location,
      "PICTURE_NAME": "",
      "PART_CODE": form.partcode,
      "REPAIRJOB": 0,
      "BASE_CONV_RATE": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "STI",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": this.yearMonth,
      "CONSIGNMENT": this.onchangeCheckBox(form.consignment),
      "SIEVE_SET": "string",
      "SUB_STOCK_CODE": "0",
      "D_REMARKS": "string",
      "SIEVE_DESC": form.sieveset,
      "EXCLUDE_TRANSFER_WT": true,
      "OTHER_ATTR": "string",
    }
    this.closed(postData);
  }

  setFormValues() {
    console.log(this.content);
    if (!this.content.JOB_NUMBER) return
    this.stoneIssueDetailsFrom.controls.jobNumber.setValue(this.content.JOB_NUMBER)
    this.stoneIssueDetailsFrom.controls.jobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(this.content.JOB_SO_NUMBER)
    this.stoneIssueDetailsFrom.controls.subjobDes.setValue(this.content.JOB_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.designcode.setValue(this.content.DESIGN_CODE)
    this.stoneIssueDetailsFrom.controls.stockDes.setValue(this.content.STOCK_DESCRIPTION)
    this.stoneIssueDetailsFrom.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.stoneIssueDetailsFrom.controls.sieve.setValue(this.content.SIEVE)
    this.stoneIssueDetailsFrom.controls.shape.setValue(this.content.SHAPE)
    this.stoneIssueDetailsFrom.controls.color.setValue(this.content.COLOR)
    this.stoneIssueDetailsFrom.controls.clarity.setValue(this.content.CLARITY)
    this.stoneIssueDetailsFrom.controls.size.setValue(this.content.SIZE)
    this.stoneIssueDetailsFrom.controls.pieces.setValue(this.content.PCS)
    this.stoneIssueDetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.stoneIssueDetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.stoneIssueDetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.stoneIssueDetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.stoneIssueDetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.stoneIssueDetailsFrom.controls.sieveset.setValue(this.content.SIEVE_SET)
    this.stoneIssueDetailsFrom.controls.remarks.setValue(this.content.D_REMARKS)
    this.stoneIssueDetailsFrom.controls.amount.setValue(this.content.AMOUNTLC)
    this.stoneIssueDetailsFrom.controls.carat.setValue(this.content.Carat)
    this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(this.content.DIVCODE)
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.stoneIssueDetailsFrom.value.subjobnumber,
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
          this.stoneIssueDetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.stoneIssueDetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.stoneIssueDetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.stoneIssueDetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.stoneIssueDetailsFrom.controls.stock.setValue(data[0].ITEM)
          this.stoneIssueDetailsFrom.controls.stockDes.setValue(data[0].STOCK_DESCRIPTION)
          this.stoneIssueDetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
          this.stoneIssueDetailsFrom.controls.designcode.setValue(data[0].DESIGN_CODE)
          this.stoneIssueDetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          // this.stoneIssueDetailsFrom.controls.location.setValue(data[0].LOCTYPE_CODE)
          // this.stoneIssueDetailsFrom.controls.pieces.setValue(data[0].pieces)
          // this.stoneIssueDetailsFrom.controls.size.setValue(data[0].SIZE)
          // this.stoneIssueDetailsFrom.controls.sieve.setValue(data[0].SIEVE)
          // this.stoneIssueDetailsFrom.controls.carat.setValue(data[0].KARAT_CODE)
          // this.stoneIssueDetailsFrom.controls.sieveDesc.setValue(data[0].COLOR)
          // this.stoneIssueDetailsFrom.controls.pieces.setValue(data[0].unitrate)
          // this.stoneIssueDetailsFrom.controls.shape.setValue(data[0].SHAPE)
          // this.stoneIssueDetailsFrom.controls.stockbal.setValue(data[0].SIEVE_SET)
         
  
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
            this.stoneIssueDetailsFrom.controls.subjobnumber.setValue(data[0].UNQ_JOB_ID)
            this.stoneIssueDetailsFrom.controls.subjobDes.setValue(data[0].JOB_DESCRIPTION)
  
  
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
