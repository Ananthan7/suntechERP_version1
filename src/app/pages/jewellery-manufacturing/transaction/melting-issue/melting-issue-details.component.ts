import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-melting-issue-details',
  templateUrl: './melting-issue-details.component.html',
  styleUrls: ['./melting-issue-details.component.scss']
})
export class MeltingIssueDetailsComponent implements OnInit {

  @Input() content!: any;
  tableData: any[] = [];
  branchCode?: String;
  metalDetailData: any[] = [];
  yearMonth?: String;
  jobNumberDetailData: any[] = [];
  userName = localStorage.getItem('username');

  private subscriptions: Subscription[] = [];

 

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

  StockCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.stockcode.setValue(e.STOCK_CODE);
    this.meltingIssuedetailsFrom.controls.stockdes.setValue(e.DESCRIPTION);
    this.meltingIssuedetailsFrom.controls.tostock.setValue(e.DIVISION_CODE);
    
  }

  WorkerCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.worker.setValue(e.WORKER_CODE);
    this.meltingIssuedetailsFrom.controls.workerdes.setValue(e.DESCRIPTION);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.process.setValue(e.Process_Code);
    this.meltingIssuedetailsFrom.controls.processdes.setValue(e.Description);
    //
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingIssuedetailsFrom.controls.jobno.setValue(e.job_number);
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(e.job_description)
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
  }
  setAllInitialValues() {

    let dataFromParent = this.content[0].PROCESS_FORMDETAILS
    if (!dataFromParent) return
    this.meltingIssuedetailsFrom.controls.jobno.setValue(dataFromParent.jobno)
    this.meltingIssuedetailsFrom.controls.jobdes.setValue(dataFromParent.jobdes)
    this.meltingIssuedetailsFrom.controls.subjobno.setValue(dataFromParent.subjobno)
    this.meltingIssuedetailsFrom.controls.subJobDescription.setValue(dataFromParent.subJobDescription)
    this.meltingIssuedetailsFrom.controls.workerFrom.setValue(dataFromParent.workerFrom)
    this.meltingIssuedetailsFrom.controls.workerTo.setValue(dataFromParent.workerTo)
    this.meltingIssuedetailsFrom.controls.toggleSwitchtIssue.setValue(dataFromParent.toggleSwitchtIssue)
    this.meltingIssuedetailsFrom.controls.processFrom.setValue(dataFromParent.processFrom)
    this.meltingIssuedetailsFrom.controls.processTo.setValue(dataFromParent.processTo)
    this.meltingIssuedetailsFrom.controls.MetalPcsFrom.setValue(dataFromParent.MetalPcsFrom)
    this.meltingIssuedetailsFrom.controls.MetalPcsTo.setValue(dataFromParent.MetalPcsTo)
    this.meltingIssuedetailsFrom.controls.GrossWeightTo.setValue(dataFromParent.GrossWeightTo)
    this.meltingIssuedetailsFrom.controls.approvedby.setValue(dataFromParent.approvedby)
    this.meltingIssuedetailsFrom.controls.startdate.setValue(dataFromParent.startdate)
    this.meltingIssuedetailsFrom.controls.enddate.setValue(dataFromParent.enddate)
    this.meltingIssuedetailsFrom.controls.JOB_DATE.setValue(dataFromParent.JOB_DATE)
    this.meltingIssuedetailsFrom.controls.DESIGN_CODE.setValue(dataFromParent.DESIGN_CODE)
    this.meltingIssuedetailsFrom.controls.SEQ_CODE.setValue(dataFromParent.SEQ_CODE)
    this.meltingIssuedetailsFrom.controls.PROCESSDESC.setValue(dataFromParent.PROCESSDESC)
    this.meltingIssuedetailsFrom.controls.WORKERDESC.setValue(dataFromParent.WORKERDESC)
    this.meltingIssuedetailsFrom.controls.PUREWT.setValue(dataFromParent.PUREWT)
    this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(dataFromParent.MetalWeightFrom)
    this.meltingIssuedetailsFrom.controls.processToDescription.setValue(dataFromParent.processToDescription)
    this.meltingIssuedetailsFrom.controls.workerToDescription.setValue(dataFromParent.workerToDescription)
    this.meltingIssuedetailsFrom.controls.PURITY.setValue(dataFromParent.PURITY)
    this.meltingIssuedetailsFrom.controls.METALLAB_TYPE.setValue(dataFromParent.METALLAB_TYPE)
    this.meltingIssuedetailsFrom.controls.remarks.setValue(dataFromParent.remarks)
    this.meltingIssuedetailsFrom.controls.treeno.setValue(dataFromParent.treeno)
    this.meltingIssuedetailsFrom.controls.JOB_SO_NUMBER.setValue(dataFromParent.JOB_SO_NUMBER)
    this.meltingIssuedetailsFrom.controls.stockCode.setValue(dataFromParent.stockCode)
    this.meltingIssuedetailsFrom.controls.DIVCODE.setValue(dataFromParent.DIVCODE)
    this.meltingIssuedetailsFrom.controls.METALSTONE.setValue(dataFromParent.METALSTONE)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingIssuedetailsFrom: FormGroup = this.formBuilder.group({
    jobno:[''],
    jobdes:[''],
    jobpurity:[''],
    process:[''],
    processdes:[''],
    worker:[''],
    workerdes:[''],
    treeno:[''],
    stockcode:[''],
    stockdes:[''],
    tostock:[''],
    mainstock:[''],
    grossweight:[''],
    purity:[''],
    lossweight:[''],
    diffgrwt:[''],
    waxweight:[''],
    stoneweight:[''],
    remarks:[''],
    lotno:[''],
    tgold:[''],
    silver:[''],
    ticketno:[''],
    barno:[''],
    location:[''],
    pcs:[''],
    netweight:[''],
    pureweight:[''],
    topurity:['']
  });



  formSubmit() {
    let dataTOparent: any = {

      METAL_DETAIL_GRID: [],
      PROCESS_FORMDETAILS: [],
}
dataTOparent.PROCESS_FORMDETAILS = this.meltingIssuedetailsFrom.value;
dataTOparent.METAL_DETAIL_GRID = this.metalDetailData; //grid data
dataTOparent.POSTDATA = []

  
    let API = 'JobMeltingIssueDJ/InsertJobMeltingIssueDJ'
    let postData =  {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_BRANCH_CODE": this.branchCode,
      "DT_VOCTYPE": "stri",
      "DT_VOCNO": 0,
      "DT_VOCDATE": "2023-11-18T08:55:48.593Z",
      "DT_YEARMONTH": this.yearMonth,
      "JOB_NUMBER": this.meltingIssuedetailsFrom.value.jobno,
      "JOB_DESCRIPTION": this.meltingIssuedetailsFrom.value.jobdes,
      "PROCESS_CODE": this.meltingIssuedetailsFrom.value.process,
      "PROCESS_DESC": this.meltingIssuedetailsFrom.value.processdes,
      "WORKER_CODE": this.meltingIssuedetailsFrom.value.worker,
      "WORKER_DESC": this.meltingIssuedetailsFrom.value.workerdes,
      "STOCK_CODE": this.meltingIssuedetailsFrom.value.stockcode,
      "STOCK_DESCRIPTION": this.meltingIssuedetailsFrom.value.stockdes,
      "DIVCODE": "s",
      "KARAT_CODE": "stri",
      "PCS": this.meltingIssuedetailsFrom.value.pcs,
      "GROSS_WT": this.meltingIssuedetailsFrom.value.grossweight,
      "STONE_WT": this.meltingIssuedetailsFrom.value.STONE_WT,
      "PURITY": this.meltingIssuedetailsFrom.value.purity,
      "PUREWT": this.meltingIssuedetailsFrom.value.pureweight,
      "PUDIFF": 0,
      "IRON_WT": 0,
      "NET_WT": this.meltingIssuedetailsFrom.value.netweight,
      "TOTAL_WEIGHT": 0,
      "IRON_PER": 0,
      "STONEDIFF": 0,
      "WAX_WT": this.meltingIssuedetailsFrom.value.WAX_WT,
      "TREE_NO": this.meltingIssuedetailsFrom.value.treeno,
      "WIP_ACCODE": "string",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "MKG_RATEFC": 0,
      "MKG_RATECC": 0,
      "MKGVALUEFC": 0,
      "MKGVALUECC": 0,
      "DLOC_CODE": "string",
      "REMARKS": this.meltingIssuedetailsFrom.value.remarks,
      "LOCTYPE_CODE": this.meltingIssuedetailsFrom.value.location,
      "TOSTOCKCODE": this.meltingIssuedetailsFrom.value.tostock,
      "LOSSWT": this.meltingIssuedetailsFrom.value.LOSSWT,
      "TODIVISION_CODE": "s",
      "LOT_NO": this.meltingIssuedetailsFrom.value.lotno,
      "BAR_NO": this.meltingIssuedetailsFrom.value.barno,
      "TICKET_NO": this.meltingIssuedetailsFrom.value.ticketno,
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "TOPURITY": this.meltingIssuedetailsFrom.value.topurity,
      "PUR_PER": 0,
      "MELTING_TYPE": "string",
      "ISALLOY": "s",
      "UNQ_JOB_ID": "string",
      "SUB_STOCK_CODE": "string",
      "IS_REJECT": true,
      "REASON": "string",
      "REJ_REMARKS": "string",
      "ATTACHMENT_FILE": "string"
    }
    this.close(postData);
  }
  
  


setFormValues() {
}

update() {
  if (this.meltingIssuedetailsFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }
 
  
    let API = 'JobMeltingIssueDJ/UpdateJobMeltingIssueDJ/'+ this.meltingIssuedetailsFrom.value.voctype + this.meltingIssuedetailsFrom.value.vocno + this.meltingIssuedetailsFrom.value.vocdate
    let postData =  {
    //   "UNIQUEID": 0,
    //   "SRNO": 0,
    //   "DT_BRANCH_CODE": this.branchCode,
    //   "DT_VOCTYPE": "stri",
    //   "DT_VOCNO": 0,
    //   "DT_VOCDATE": "2023-10-21T10:15:43.790Z",
    //   "DT_YEARMONTH": this.yearMonth,
    //   "JOB_NUMBER": this.meltingIssuedetailsFrom.value.jobno,
    //   "JOB_DESCRIPTION": this.meltingIssuedetailsFrom.value.jobdes,
    //   "PROCESS_CODE": this.meltingIssuedetailsFrom.value.process,
    //   "PROCESS_DESC": this.meltingIssuedetailsFrom.value.processdes,
    //   "WORKER_CODE": this.meltingIssuedetailsFrom.value.worker,
    //   "WORKER_DESC": this.meltingIssuedetailsFrom.value.workerdes,
    //   "STOCK_CODE": this.meltingIssuedetailsFrom.value.stockcode,
    //   "STOCK_DESCRIPTION": this.meltingIssuedetailsFrom.value.stockdes,
    //   "DIVCODE": "s",
    //   "KARAT_CODE": "0",
    //   "PCS": this.meltingIssuedetailsFrom.value.pcs,
    //   "GROSS_WT": this.meltingIssuedetailsFrom.value.grossweight,
    //   "STONE_WT": this.meltingIssuedetailsFrom.value.stoneweight,
    //   "PURITY": this.meltingIssuedetailsFrom.value.purity,
    //   "PUREWT": this.meltingIssuedetailsFrom.value.pureweight,
    //   "PUDIFF": 0,
    //   "IRON_WT": 0,
    //   "NET_WT": this.meltingIssuedetailsFrom.value.netweight,
    //   "TOTAL_WEIGHT": 0,
    //   "IRON_PER": 0,
    //   "STONEDIFF": 0,
    //   "WAX_WT": this.meltingIssuedetailsFrom.value.waxweight,
    //   "TREE_NO": this.meltingIssuedetailsFrom.value.treeno,
    //   "WIP_ACCODE": "",
    //   "CURRENCY_CODE": "",
    //   "CURRENCY_RATE": 0,
    //   "MKG_RATEFC": 0,
    //   "MKG_RATECC": 0,
    //   "MKGVALUEFC": 0,
    //   "MKGVALUECC": 0,
    //   "DLOC_CODE": "",
    //   "REMARKS": this.meltingIssuedetailsFrom.value.remarks,
    //   "LOCTYPE_CODE": this.meltingIssuedetailsFrom.value.location,
    //   "TOSTOCKCODE": this.meltingIssuedetailsFrom.value.tostock,
    //   "LOSSWT": this.meltingIssuedetailsFrom.value.lossweight,
    //   "TODIVISION_CODE": "s",
    //   "LOT_NO": this.meltingIssuedetailsFrom.value.lotno,
    //   "BAR_NO": this.meltingIssuedetailsFrom.value.barno,
    //   "TICKET_NO": this.meltingIssuedetailsFrom.value.ticketno,
    //   "SILVER_PURITY": 0,
    //   "SILVER_PUREWT": 0,
    //   "TOPURITY": this.meltingIssuedetailsFrom.value.topurity,
    //   "PUR_PER": 0,
    //   "MELTING_TYPE": "0",
    //   "ISALLOY": "s",
    //   "UNQ_JOB_ID": "",
    //   "SUB_STOCK_CODE": "",
    //   "IS_REJECT": true,
    //   "REASON": "",
    //   "REJ_REMARKS": "",
    //   "ATTACHMENT_FILE": ""
    // }
  
    // this.close({postData});
    }
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
        let API = 'JobMeltingIssueDJ/DeleteJobMeltingIssueDJ/' + this.meltingIssuedetailsFrom.value.voctype + this.meltingIssuedetailsFrom.value.vocno + this.meltingIssuedetailsFrom.value.vocdate
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
                    this.meltingIssuedetailsFrom.reset()
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
                    this.meltingIssuedetailsFrom.reset()
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
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.meltingIssuedetailsFrom.value.subjobno,
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
          this.meltingIssuedetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.meltingIssuedetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.meltingIssuedetailsFrom.controls.stockcode.setValue(data[0].STOCK_CODE)
          this.meltingIssuedetailsFrom.controls.pureweight.setValue(data[0].PUREWT)
          this.meltingIssuedetailsFrom.controls.pcs.setValue(data[0].PCS)
          this.meltingIssuedetailsFrom.controls.workerdes.setValue(data[0].WORKERDESC)
          this.meltingIssuedetailsFrom.controls.processdes.setValue(data[0].PROCESSDESC)
          this.meltingIssuedetailsFrom.controls.grossweight.setValue(data[0].NETWT)
          this.meltingIssuedetailsFrom.controls.purity.setValue(data[0].PURITY)
          this.meltingIssuedetailsFrom.controls.netweight.setValue(data[0].NETWT)
          this.meltingIssuedetailsFrom.controls.MetalWeightFrom.setValue(
            this.comService.decimalQuantityFormat(data[0].METAL, 'METAL'))

          this.meltingIssuedetailsFrom.controls.StoneWeight.setValue(data[0].STONE)

          this.meltingIssuedetailsFrom.controls.PURITY.setValue(data[0].PURITY)
          this.meltingIssuedetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.meltingIssuedetailsFrom.controls.stockCode.setValue(data[0].STOCK_CODE)
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
            this.meltingIssuedetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.meltingIssuedetailsFrom.controls.subJobDescription.setValue(data[0].JOB_DESCRIPTION)

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

