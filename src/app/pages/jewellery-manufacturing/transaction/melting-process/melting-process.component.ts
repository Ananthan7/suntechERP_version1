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
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  meltingprocessDetailsData : any[] = [];
  private subscriptions: Subscription[] = [];


  columnhead:any[] = ['Sr #', 'Div','Job No','Stock Code','Stock Desc','Process','Worker','Pcs','Gross Wt','Stone Wt','Net Wt','Purity','Pure Wt','Balance Wt','Balance Pure'];
  columnhead1:any[] = ['R to Stock','Stock Code','Gross Wt','Purity', 'Pure Wt','Location'];
  columnhead2:any[] = ['R to Scrap','Stock Code','Gross Wt','Purity', 'Pure Wt','Location','Loss','Pure Wt','Bal Gross','Bal Pure'];
  column:any[] = ['Sr','So No','Party Code', 'Party Name','Job No','job Desc','Design Code','UNQ Design ID','Process','Worker',' Req Metal','Stone Wt','Recd Gross Wt','Metal Allocated','Allocated Pure Wt','Job Pcs'];

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
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  stockCodeSelected(e:any){
    console.log(e); 
    this.meltingProcessFrom.controls.stockcodeRet.setValue(e.STOCK_CODE);
  }

  stockCodeScpSelected(e:any){
    console.log(e); 
    this.meltingProcessFrom.controls.stockCodeScp.setValue(e.DESCRIPTION);
  }
  

  MeltingCodeSelected(e:any){
    console.log(e);
    this.meltingProcessFrom.controls.meltingType.setValue(e['Melting Type']);
  }

  
  locationCodeSelected(e:any){
    console.log(e);
    this.meltingProcessFrom.controls.locationRet.setValue(e.LOCATION_CODE);
  }

  locationCodeScpSelected(e:any){
    console.log(e);
    this.meltingProcessFrom.controls.locationScp.setValue(e.DESCRIPTION);
  }

  timeCodeSelected(e:any){
    console.log(e);
    this.meltingProcessFrom.controls.time.setValue(e.CODE);
  }

  meltingProcessFrom: FormGroup = this.formBuilder.group({
    vocType : [''],
    vocNo : [''],
    vocDate : [''],
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

  openaddmeltingprocess() {
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
        this.meltingprocessDetailsData.push(postData);
        console.log(this.meltingprocessDetailsData);
        
      }
    });

  }

  deleteTableData(){
   
  }
  resetAllocation(){}

  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.meltingProcessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMeltingProcessDJ/InsertJobMeltingProcessDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.meltingProcessFrom.value.vocType,
      "VOCNO": this.meltingProcessFrom.value.vocNo,
      "VOCDATE": this.meltingProcessFrom.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "NAVSEQNO": 0,
      "WORKER_CODE": this.meltingProcessFrom.value.worker,
      "WORKER_DESC": this.meltingProcessFrom.value.workerDesc,
      "SALESPERSON_CODE": "",
      "SALESPERSON_NAME": "",
      "DOCTIME": "2023-10-30T13:03:04.859Z",
      "TOTAL_GROSSWT": this.meltingProcessFrom.value.TotalgrossWt,
      "TOTAL_PUREWT": this.meltingProcessFrom.value.TotalpureWt,
      "TOTAL_STONEWT": this.meltingProcessFrom.value.stoneWeight,
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
      "PROCESS_CODE": this.meltingProcessFrom.value.process,
      "PROCESS_DESC": this.meltingProcessFrom.value.processDesc,
      "PRINT_COUNT": 0,
      "MELTING_TYPE":this.meltingProcessFrom.value.meltingType,
      "COLOR": this.meltingProcessFrom.value.color,
      "RET_STOCK_CODE": this.meltingProcessFrom.value.stockcodeRet,
      "RET_GROSS_WT": this.meltingProcessFrom.value.RETgrossWt,
      "RET_PURITY": this.meltingProcessFrom.value.purityRET,
      "RET_PURE_WT": this.meltingProcessFrom.value.RETpureWt,
      "RET_LOCATION_CODE": this.meltingProcessFrom.value.locationRet,
      "SCP_STOCK_CODE": this.meltingProcessFrom.value.stockCodeScp,
      "SCP_GROSS_WT": 0,
      "SCP_PURITY": 0,
      "SCP_PURE_WT": 0,
      "SCP_LOCATION_CODE": this.meltingProcessFrom.value.locationScp,
      "LOSS_QTY": this.meltingProcessFrom.value.loss,
      "LOSS_PURE_WT": 0,
      "BALANCE_WT": this.meltingProcessFrom.value.balGross,
      "BALANCE_PURE_WT": this.meltingProcessFrom.value.balPure,
      "PURITY": this.meltingProcessFrom.value.purity,
      "PUDIFF": 0,
      "SCP_PUDIFF": 0,
      "SYSTEM_DATE": "2023-10-30T13:03:04.860Z",
      "Details":this.meltingprocessDetailsData
    }
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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

  update(){
    if (this.meltingProcessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'DiamondDismantle/UpdateDiamondDismantle'+ this.meltingProcessFrom.value.branchCode + this.meltingProcessFrom.value.voctype + this.meltingProcessFrom.value.vocno + this.meltingProcessFrom.value.yearMonth;
    let postData = {

        
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
        let API = 'DiamondDismantle/DeleteDiamondDismantle/'+ this.meltingProcessFrom.value.branchCode + this.meltingProcessFrom.value.voctype + this.meltingProcessFrom.value.vocno + this.meltingProcessFrom.value.yearMonth
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

