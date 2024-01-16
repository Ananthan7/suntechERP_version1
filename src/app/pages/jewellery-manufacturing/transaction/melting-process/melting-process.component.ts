import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MeltingProcessDetailsComponent } from './melting-process-details/melting-process-details.component';




@Component({
  selector: 'app-melting-process',
  templateUrl: './melting-process.component.html',
  styleUrls: ['./melting-process.component.scss']
})
export class MeltingProcessComponent implements OnInit {
  @Input() content!: any;
  tableData: any[] = [];
  detailData: any[] = [];
  dataToParent: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  voctype?: String;
  tableRowCount: number = 0;
  vocMaxDate = new Date();
  selectRowIndex:any;
  currentDate = new Date();
  sequenceDetails: any[] = []
  meltingprocessDetailsData: any[] = [];
  private subscriptions: Subscription[] = [];
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];

  columnhead: any[] = ['SRNO', 'Div', 'jobno', 'stockcode', 'stockcodedes', 'process','worker', 'pcs', 'grossweight', 'stoneweight', 'netweight', 'purity', 'pureweight', 'lossweight', 'purediff'];
  // columnhead: any[] = ['Sr #', 'Div', 'Job No', 'Stock Code', 'Stock Desc', 'Process', 'Worker', 'Pcs', 'Gross Wt', 'Stone Wt', 'Net Wt', 'Purity', 'Pure Wt', 'Balance Wt', 'Balance Pure'];
  columnhead1: any[] = ['R to Stock', 'Stock Code', 'Gross Wt', 'Purity', 'Pure Wt', 'Location'];
  columnhead2: any[] = ['R to Scrap', 'Stock Code', 'Gross Wt', 'Purity', 'Pure Wt', 'Location', 'Loss', 'Pure Wt', 'Bal Gross', 'Bal Pure'];
  column: any[] = ['Sr', 'So No', 'Party Code', 'Party Name', 'Job No', 'job Desc', 'Design Code', 'UNQ Design ID', 'Process', 'Worker', ' Req Metal', 'Stone Wt', 'Recd Gross Wt', 'Metal Allocated', 'Allocated Pure Wt', 'Job Pcs'];
  

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
  processCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 20,
    SEARCH_FIELD: 'PROCESS_CODE',
    SEARCH_HEADING: 'Process Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PROCESS_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true, 
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
 



  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.voctype = this.comService.getqueryParamVocType()
    this.yearMonth = this.comService.yearSelected;
    // this.meltingProcessFrom.controls.vocdate.setValue(this.currentDate)
    this.meltingProcessFrom.controls.vocType.setValue(this.comService.getqueryParamVocType())
    console.log(this.meltingProcessFrom.value.vocType, 'this is voctype')
    // this.setAllInitialValues = this.dataToParent;
    this.setAllInitialValues()
   


  }
  
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `JobMeltingProcessDJ/GetJobMeltingProcessDJWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data)
          data.Details.forEach((element:any) => {
            this.tableData.push({
              jobno: element.JOB_NUMBER,
              stockcode: element.STOCK_CODE,
              process: element.PROCESS_CODE,
              worker: element.WORKER_CODE,
              pcs: element.PCS,
              grossweight: element.GROSS_WT,
              purity: element.PURITY,
              pureweight: element.PUREWT,
              SRNO: element.SRNO,
              Rate: element.RATE,
              Amount: element.Amount,
            

            })
          });
          this.meltingProcessFrom.controls.voctype.setValue(data.content.VOCTYPE)
          this.meltingProcessFrom.controls.vocno.setValue(data.VOCNO)
          this.meltingProcessFrom.controls.vocdate.setValue(data.VOCDATE)
          this.meltingProcessFrom.controls.processcode.setValue(data.content.PROCESS_CODE)
          this.meltingProcessFrom.controls.worker.setValue(data.WORKER_CODE)
          this.meltingProcessFrom.controls.workerdes.setValue(data.WORKER_DESC)
          this.meltingProcessFrom.controls.processdes.setValue(data.PROCESS_DESC)
          this.meltingProcessFrom.controls.jobno.setValue(data.JOB_NUMBER)
          this.meltingProcessFrom.controls.jobdes.setValue(data.Details[0].JOB_DESCRIPTION)
          this.meltingProcessFrom.controls.color.setValue(data.COLOR)
          this.meltingProcessFrom.controls.grossweight.setValue(data.Details[0].GROSS_WT)
          this.meltingProcessFrom.controls.pureweight.setValue(data.Details[0].PUREWT)
          this.meltingProcessFrom.controls.pcs.setValue(data.Details[0].PCS)
          this.meltingProcessFrom.controls.stockcode.setValue(data.Details[0].STOCK_CODE)
          this.meltingProcessFrom.controls.purity.setValue(data.Details[0].PURITY)
          this.meltingProcessFrom.controls.SRNO.setValue(data.Details[0].SRNO)
          
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.stockcodeRet.setValue(e.STOCK_CODE);
  }

  stockCodeScpSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.stockCodeScp.setValue(e.DESCRIPTION);
  }

  processCodeScpSelected(e:any){
    console.log(e); 
    this.meltingProcessFrom.controls.process.setValue(e.Process_Code);
    this.meltingProcessFrom.controls.processDesc.setValue(e.Description);
  }



  MeltingCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.meltingType.setValue(e['Melting Type']);
  }


  locationCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.locationRet.setValue(e.LOCATION_CODE);
  }

  locationCodeScpSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.locationScp.setValue(e.DESCRIPTION);
  }

  timeCodeSelected(e: any) {
    console.log(e);
    this.meltingProcessFrom.controls.time.setValue(e.CODE);
  }



  meltingProcessFrom: FormGroup = this.formBuilder.group({
    vocType : ['MLP',[Validators.required]],
    vocNo : ['1',[Validators.required]],
    vocDate : [new Date(),''],
    meltingType : [''],
    process : [''],
    processDesc : [''],
    worker : [''],
    workerDesc : [''],
    color : [''],
    time : [''],
    stoneStockCode : [''],
    stoneStockCodeNo : [''],
    stoneStockCodeDesc : [''],
    stoneStockCodeValue : [''],
    stoneWeight : [''],
    rate : [''],
    stoneAmount : [''],
    stockcodeRet : [''],
    stockCodeScp : [''],
    purityRET : [''],
    purity : [''],
    TotalpureWt : [''],
    RETpureWt : [''],
    TotalgrossWt : [''],
    RETgrossWt : [''],
    locationRet : [''],
    locationScp : [''],
    loss : [''],
    balGross : [''],
    balPure : [''],
  });



  openaddmeltingprocess(data?: any) {
    if (data) {
      data[0] = this.meltingProcessFrom.value;
    } else {
      data = [{ HEADERDETAILS: this.meltingProcessFrom.value }]
    }
    const modalRef: NgbModalRef = this.modalService.open(MeltingProcessDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

    modalRef.result.then((postData) => {
      console.log(postData);
      if (postData) {
        console.log('Data from modal:', postData);
        this.meltingprocessDetailsData.push(postData.POSTDATA[0]);
        console.log(this.meltingprocessDetailsData);
        this.setValuesToHeaderGrid(postData); 

      }
    });

  }
  onRowClickHandler(event: any) {
    
   this.selectRowIndex = (event.dataIndex)
   let selectedData = event.data
   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
   this.openaddmeltingprocess(selectedData)
   console.log(event)

  }
  // onRowDoubleClick(event: any) {
  //   let selectedData = event.data
  //   let detailRow = this.detailData.filter((item: any) => item.ID == selectedData.SRNO)
  //   let allDataSelected = [detailRow[0].DATA]
  //   this.openaddmeltingprocess(allDataSelected)
  //   console.log(event)
  // }
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
    // this.getSequenceDetailData(PROCESS_FORMDETAILS);
    
  }
  resetAllocation(){}
  swapObjects(array1: any, array2: any, index: number) {
    // Check if the index is valid
    if (index >= 0 && index < array1.length) {
      array1[index] = array2[0];
    } else {
      console.error('Invalid index');
    }
  }

  deleteTableData(): void {
    this.tableRowCount = 0;
    console.log(this.selectRowIndex)
   
      this.tableData.splice(this.selectRowIndex ,1)
    
  }
  
 
  formSubmit() {
    console.log("required")
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
  
   

    // if (this.meltingProcessFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
    console.log(this.meltingprocessDetailsData)

      let API = 'JobMeltingProcessDJ/InsertJobMeltingProcessDJ'
      let postData = {
        "MID": 0,
        "BRANCH_CODE": this.comService.nullToString(this.branchCode),
        "VOCTYPE": this.comService.nullToString(this.meltingProcessFrom.value.vocType),
        "VOCNO": 0,
        "VOCDATE": this.comService.formatDateTime(this.currentDate),
        "YEARMONTH": this.yearMonth,
        "NAVSEQNO": 0,
        "WORKER_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].WORKER_CODE),
        "WORKER_DESC": this.comService.nullToString(this.meltingprocessDetailsData[0].WORKER_DESC),
        "SALESPERSON_CODE": "",
        "SALESPERSON_NAME": "",
        "DOCTIME": "2023-10-30T13:03:04.859Z",
        "TOTAL_GROSSWT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].TotalgrossWt),
        "TOTAL_PUREWT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].TotalpureWt),
        "TOTAL_STONEWT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].TOTAL_STONEWT),
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
        "REMARKS": "",
        "AUTOPOSTING": true,
        "POSTDATE": "",
        "BASE_CURRENCY": "",
        "BASE_CURR_RATE": 0,
        "BASE_CONV_RATE": 0,
        "PROCESS_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].process),
        "PROCESS_DESC": this.comService.nullToString(this.meltingprocessDetailsData[0].processDesc),
        "PRINT_COUNT": 0,
        "MELTING_TYPE": this.comService.nullToString(this.meltingprocessDetailsData[0].meltingType),
        "COLOR": this.comService.nullToString(this.meltingprocessDetailsData[0].color),
        "RET_STOCK_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].stockcodeRet),
        "RET_GROSS_WT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].RETgrossWt),
        "RET_PURITY": this.comService.emptyToZero(this.meltingprocessDetailsData[0].purityRET),
        "RET_PURE_WT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].RETpureWt),
        "RET_LOCATION_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].locationRet),
        "SCP_STOCK_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].stockCodeScp),
        "SCP_GROSS_WT": 0,
        "SCP_PURITY": 0,
        "SCP_PURE_WT": 0,
        "SCP_LOCATION_CODE": this.comService.nullToString(this.meltingprocessDetailsData[0].locationScp),
        "LOSS_QTY": this.comService.emptyToZero(this.meltingprocessDetailsData[0].loss),
        "LOSS_PURE_WT": 0,
        "BALANCE_WT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].balGross),
        "BALANCE_PURE_WT": this.comService.emptyToZero(this.meltingprocessDetailsData[0].balPure),
        "PURITY": this.comService.emptyToZero(this.meltingprocessDetailsData[0].purity),
        "PUDIFF": 0,
        "SCP_PUDIFF": 0,
        "SYSTEM_DATE": "2023-10-30T13:03:04.860Z",
        "Details": this.meltingprocessDetailsData
        
      }
    
  

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.meltingProcessFrom.reset()
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
  }

  update() {
    if (this.meltingProcessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondDismantle/UpdateDiamondDismantle' + this.meltingProcessFrom.value.branchCode + this.meltingProcessFrom.value.voctype + this.meltingProcessFrom.value.vocno + this.meltingProcessFrom.value.yearMonth;
    let postData = {


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
  

deleteRecord() {
  if (!this.content.MID) {
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
      let API = 'CostCenterMaster/DeleteCostCenterMaster/' + this.meltingProcessFrom.value.costcode
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
                  this.meltingProcessFrom.reset()
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
                  this.meltingProcessFrom.reset()
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
  

