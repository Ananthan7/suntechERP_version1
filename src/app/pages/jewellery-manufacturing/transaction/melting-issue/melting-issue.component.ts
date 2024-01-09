import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MeltingIssueDetailsComponent } from './melting-issue-details/melting-issue-details.component';

@Component({
  selector: 'app-melting-issue',
  templateUrl: './melting-issue.component.html',
  styleUrls: ['./melting-issue.component.scss']
})
export class MeltingIssueComponent implements OnInit {
 
  columnhead:any[] = ['SRNO','DIV','jobno','stockcode','Main Stock','process','worker','pcs','grossweight','purity','pureweight','Rate','Amount']
  columnheader : any[] = ['Sr#','SO No','Party Code','Party Name','Job Number','Job Description','Design Code','UNQ Design ID','Process','Worker','Metal Required','Metal Allocated','Allocated Pure','Job Pcs']
  columnhead1 : any[] = ['Sr#','Ingredients','Qty']
  @Input() content!: any;
  tableData: any[] = [];
  sequenceDetails: any[] = []
  voctype?: String;
  selectRowIndex:any;
  currentDate = new Date();
  tableRowCount: number = 0;
  detailData: any[] = [];
  jobNumberDetailData: any[] = [];
  meltingISsueDetailsData : any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  branchCode?: String;
  yearMonth?: String;

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
  }

  WorkerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'worker',
    SEARCH_HEADING: 'Worker Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  WorkerCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssueFrom.controls.workerdes.setValue(e.DESCRIPTION);
    
  }

  ProcessCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'Process_Code',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ProcessCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.processcode.setValue(e.Process_Code);
    this.meltingIssueFrom.controls.processdes.setValue(e.Description);
   

  }

 
  MeltingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 94,
    SEARCH_FIELD: 'Melting Type',
    SEARCH_HEADING: 'Melting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "Melting Type<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  MeltingCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.meltingtype.setValue(e['Melting Type']);
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
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.jobno.setValue(e.job_number);
    this.meltingIssueFrom.controls.jobdes.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Time',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  timeCodeSelected(e:any){
    console.log(e);
    this.meltingIssueFrom.controls.time.setValue(e.CODE);
  }

  constructor(    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    // this.voctype = this.comService.getqueryParamMainVocType()
    this.meltingIssueFrom.controls.vocdate.setValue(this.currentDate)
    this.meltingIssueFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    
    
  }
  setAllInitialValues() {
    let dataFromParent = this.content[0].PROCESS_FORMDETAILS
    if (!dataFromParent) return
    this.meltingIssueFrom.controls.jobno.setValue(dataFromParent.jobno)
    this.meltingIssueFrom.controls.jobdes.setValue(dataFromParent.jobdes)
    this.meltingIssueFrom.controls.subjobno.setValue(dataFromParent.subjobno)
    this.meltingIssueFrom.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.meltingIssueFrom.controls.workerFrom.setValue(dataFromParent.workerFrom)
    this.meltingIssueFrom.controls.workerTo.setValue(dataFromParent.workerTo)
    this.meltingIssueFrom.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.meltingIssueFrom.controls.processFrom.setValue(dataFromParent.processFrom)
    this.meltingIssueFrom.controls.processTo.setValue(dataFromParent.processTo)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
    deleteTableData(): void {
      this.tableRowCount = 0;
      console.log(this.selectRowIndex)
      this.tableData.splice(this.selectRowIndex ,1)
    }

  

  meltingIssueFrom: FormGroup = this.formBuilder.group({
    voctype:['',[Validators.required]],
    vocno:['',[Validators.required]],
    vocdate:[''],
    voctime:[''],
    meltingtype:[''],
    jobno:[''],
    jobdes:[''],
    processcode:[''],
    processdes:[''],
    worker:[''],
    workerdes:[''],
    subjobno:[''], // Not in table
    color:[''],
    time:[''],  // Not in table
    remarks:[''],
    issued:[''],
    required:[''],
    allocated:[''],
    balance:[''],
    TotalgrossWt: [''],
    TotalpureWt: [''],
    subJobDescription:[''],
    process:[''],
    

  });
  openaddMeltingIssueDetails(data?: any) {
    if (data) {
      data[0].HEADERDETAILS = this.meltingIssueFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.meltingIssueFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(MeltingIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      console.log(postData);      
      if (postData) {
        console.log('Data from modal:', postData);       
        this.meltingISsueDetailsData.push(postData.POSTDATA[0]);
        console.log(this.meltingISsueDetailsData);
        this.setValuesToHeaderGrid(postData); 
        
      }
    });
  }
  onRowClickHandler(event: any) {
    
    this.selectRowIndex = (event.dataIndex)
    console.log(this.selectRowIndex, event);
 
   }
   onRowDoubleClick(event: any) {
     let selectedData = event.data
     let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
     let allDataSelected = [detailRow[0].DATA]
     this.openaddMeltingIssueDetails(allDataSelected)
     console.log(event)
  
    }
    setValuesToHeaderGrid(detailDataToParent: any) {
      let PROCESS_FORMDETAILS = detailDataToParent.PROCESS_FORMDETAILS
      if (PROCESS_FORMDETAILS.SRNO) {
        this.swapObjects(this.tableData, [PROCESS_FORMDETAILS], (PROCESS_FORMDETAILS.SRNO - 1))
      } else {
        this.tableRowCount += 1
        PROCESS_FORMDETAILS.SRNO = this.tableRowCount
      }
  
      this.tableData.push(PROCESS_FORMDETAILS)
  
      if (detailDataToParent) {
        this.detailData.push({ ID: this.tableRowCount, DATA: detailDataToParent })
      }
      //  this.getSequenceDetailData(PROCESS_FORMDETAILS);
      
    }
    swapObjects(array1: any, array2: any, index: number) {
      // Check if the index is valid
      if (index >= 0 && index < array1.length) {
        array1[index] = array2[0];
      } else {
        console.error('Invalid index');
      }
    }
    

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    // if (this.meltingIssueFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // } 
    
    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.comService.nullToString(this.branchCode),
      "VOCTYPE": this.comService.nullToString(this.meltingIssueFrom.value.voctype),
      "VOCNO": this.comService.emptyToZero(this.meltingISsueDetailsData[0].vocno),
      "VOCDATE": this.comService.formatDateTime(this.currentDate),
      "YEARMONTH": this.yearMonth,
      "NAVSEQNO": 0,
      "WORKER_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].WORKER_CODE),
      "WORKER_DESC": this.comService.nullToString(this.meltingISsueDetailsData[0].WORKER_DESC),
      "SALESPERSON_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].SALESPERSON_CODE),
      "SALESPERSON_NAME": this.comService.nullToString(this.meltingISsueDetailsData[0].SALESPERSON_NAME),
      "DOCTIME": "2023-10-21T10:15:43.789Z",
      "TOTAL_GROSSWT": this.comService.emptyToZero(this.meltingISsueDetailsData[0].TotalgrossWt),
      "TOTAL_PUREWT": this.comService.emptyToZero(this.meltingISsueDetailsData[0].TotalpureWt),
      "TOTAL_STONEWT": this.comService.emptyToZero(this.meltingISsueDetailsData[0].STONE_WT),
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssueFrom.value.remarks,
      "AUTOPOSTING": true,
      "POSTDATE": this.comService.nullToString(this.meltingISsueDetailsData[0].POSTDATE),
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].process),
      "PROCESS_DESC": this.comService.nullToString(this.meltingISsueDetailsData[0].processDesc),
      "PRINT_COUNT": 0,
      "MELTING_TYPE": "",
      "COLOR": this.comService.nullToString(this.meltingISsueDetailsData[0].color),
      "RET_STOCK_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].RET_STOCK_CODE),
      "RET_GROSS_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_LOCATION_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].RET_LOCATION_CODE),
      "SCP_STOCK_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].SCP_STOCK_CODE),
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": this.comService.nullToString(this.meltingISsueDetailsData[0].SCP_STOCK_CODE),
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": this.comService.nullToString(this.meltingISsueDetailsData[0].REASON),
      "REJ_REMARKS": this.comService.nullToString(this.meltingISsueDetailsData[0].REJ_REMARKS),
      "ATTACHMENT_FILE": this.comService.nullToString(this.meltingISsueDetailsData[0].ATTACHMENT_FILE),
      "SYSTEM_DATE": "2023-10-21T10:15:43.790Z",
      "Details": this.meltingISsueDetailsData
    
    }

    
  
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status.trim() == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.meltingIssueFrom.reset()
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
    
    this.meltingIssueFrom.controls.voctype.setValue(this.content.VOCTYPE)
    this.meltingIssueFrom.controls.vocno.setValue(this.content.VOCNO)
    this.meltingIssueFrom.controls.vocdate.setValue(this.content.VOCDATE)
    this.meltingIssueFrom.controls.processcode.setValue(this.content.PROCESS_CODE)
    this.meltingIssueFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.meltingIssueFrom.controls.workerdes.setValue(this.content.WORKER_DESC)
    this.meltingIssueFrom.controls.processdes.setValue(this.content.PROCESS_DESC)
    this.meltingIssueFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.meltingIssueFrom.controls.jobdes.setValue(this.content.JOB_DESCRIPTION)
    this.meltingIssueFrom.controls.color.setValue(this.content.COLOR)
    this.meltingIssueFrom.controls.remark.setValue(this.content.REMARKS)
  }


  update(){
    if (this.meltingIssueFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/'+ this.meltingIssueFrom.value.voctype + this.meltingIssueFrom.value.vocno + this.meltingIssueFrom.value.vocdate
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": this.meltingIssueFrom.value.voctype || "",
      "VOCNO": this.meltingIssueFrom.value.vocno || "",
      "VOCDATE": this.meltingIssueFrom.value. vocdate || "",
      "YEARMONTH": "string",
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingIssueFrom.value.worker || "",
      "WORKER_DESC": this.meltingIssueFrom.value.workerdes || "",
      "SALESPERSON_CODE": "string",
      "SALESPERSON_NAME": "string",
      "DOCTIME": "2023-10-12T05:57:39.110Z",
      "TOTAL_GROSSWT": 0,
      "TOTAL_PUREWT": 0,
      "TOTAL_STONEWT": 0,
      "TOTAL_NETWT": 0,
      "TOTAL_WAXWT": 0,
      "TOTAL_IRONWT": 0,
      "TOTAL_MKGVALUEFC": 0,
      "TOTAL_MKGVALUECC": 0,
      "TOTAL_PCS": 0,
      "TOTAL_ISSUED_QTY": 0,
      "TOTAL_REQUIRED_QTY": 0,
      "TOTAL_ALLOCATED_QTY": 0,
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "TRAY_WEIGHT": 0,
      "REMARKS": this.meltingIssueFrom.value.remarks || "",
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PROCESS_CODE": this.meltingIssueFrom.value.processcode || "",
      "PROCESS_DESC": this.meltingIssueFrom.value.processdes || "",
      "PRINT_COUNT": 0,
      "MELTING_TYPE": this.meltingIssueFrom.value.meltingtype || "",
      "COLOR":this.meltingIssueFrom.value.color || "",
      "RET_STOCK_CODE": "string",
      "RET_GROSS_WT": 0,
      "RET_PURITY": 0,
      "RET_PURE_WT": 0,
      "RET_LOCATION_CODE": "string",
      "SCP_STOCK_CODE": "string",
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": "string",
      "LOSS_QTY": 0,
      "LOSS_PURE_WT": 0,
      "IS_AUTHORISE": true,
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string",
      "SYSTEM_DATE": "2023-10-12T05:57:39.110Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": "string",
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-10-12T05:57:39.110Z",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.meltingIssueFrom.value.jobno || "",
      "JOB_DESCRIPTION":this.meltingIssueFrom.value.jobdes || "",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": "",
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "PURITY": 0,
      "PUREWT": 0,
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT": 0,
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": 0,
      "TREE_NO": "string",
      "WIP_ACCODE": "string",
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "LOCTYPE_CODE": "string",
      "TOSTOCKCODE": "string",
      "LOSSWT": 0,
      "TODIVISION_CODE": "s",
      "LOT_NO": "string",
      "BAR_NO": "string",
      "TICKET_NO": "string",
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": 0,
      "PUR_PER": 0,
      "ISALLOY": "s",
      "UNQ_JOB_ID": "string",
      "SUB_STOCK_CODE": "string",
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
                this.meltingIssueFrom.reset()
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
        let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' + this.meltingIssueFrom.value.voctype + this.meltingIssueFrom.value.vocno + this.meltingIssueFrom.value.vocdate
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
                    this.meltingIssueFrom.reset()
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
                    this.meltingIssueFrom.reset()
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
  getSequenceDetailData(formData: any) {
    let API = `SequenceMasterDJ/GetSequenceMasterDJDetail/${formData.SEQ_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.sequenceDetails = data.sequenceDetails
          
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  

subJobNumberValidate(event?: any) {
  let postData = {
    "SPID": "040",
    "parameter": {
      'strUNQ_JOB_ID': this.meltingIssueFrom.value.subjobno,
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
        this.meltingIssueFrom.controls.processcode.setValue(data[0].PROCESS)
        this.meltingIssueFrom.controls.worker.setValue(data[0].WORKER)
        // this.meltingIssueFrom.controls.stockcode.setValue(data[0].STOCK_CODE)
        // this.meltingIssueFrom.controls.pureweight.setValue(data[0].PUREWT)
        // this.meltingIssueFrom.controls.pcs.setValue(data[0].PCS)
        this.meltingIssueFrom.controls.workerdes.setValue(data[0].WORKERDESC)
        this.meltingIssueFrom.controls.processdes.setValue(data[0].PROCESSDESC)
        // this.meltingIssueFrom.controls.grossweight.setValue(data[0].NETWT)
        // this.meltingIssueFrom.controls.purity.setValue(data[0].PURITY)
        // this.meltingIssueFrom.controls.netweight.setValue(data[0].NETWT)
        // this.meltingIssueFrom.controls.MetalWeightFrom.setValue(
        //   this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))

        // this.meltingIssueFrom.controls.StoneWeight.setValue(data[0].STONE)

        // this.meltingIssueFrom.controls.PURITY.setValue(data[0].PURITY)
        // this.meltingIssueFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
        // this.meltingIssueFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
        // this.stockCodeScrapValidate()
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
          this.meltingIssueFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
          this.meltingIssueFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)

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
  function deleteRecord() {
    throw new Error('Function not implemented.');
  }

