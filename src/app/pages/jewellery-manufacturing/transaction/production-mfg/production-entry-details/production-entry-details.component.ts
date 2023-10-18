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
  selector: 'app-production-entry-details',
  templateUrl: './production-entry-details.component.html',
  styleUrls: ['./production-entry-details.component.scss']
})
export class ProductionEntryDetailsComponent implements OnInit {
  divisionMS: any = 'ID';
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;

  private subscriptions: Subscription[] = [];
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

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
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
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  jobnoCodeSelected(e:any){
    console.log(e);
    this.productiondetailsFrom.controls.jobno.setValue(e.PREFIX_CODE);
    // this.productiondetailsFrom.controls.subjobnoDesc.setValue(e.DESCRIPTION);
  }

  locationCodeSelected(e:any){
    console.log(e);
    this.productiondetailsFrom.controls.location.setValue(e.COUNT);
  }

  productiondetailsFrom: FormGroup = this.formBuilder.group({
    jobno:[''],
    jobdate:[''],
    subjobno:[''],
    subjobnoDesc : [''],
    customer:[''],
   process:[''],
   processname:[''],
   worker:[''],
   workername:[''],
   parts:[''],
   design:[''],
   waxcode:[''],
   noofpcs:[''],
   location:[''],
   grosswt:[''],
   stonepcs:[''],
   metalwt:[''],
   stonewt:[''],
   prefix:[''],
   otherstone:[''],
   costcode:[''],
   setref:[''],
   karat:[''],
   startdate:[''],
   enddate:[''],
   totalpcs:[''],
   lossqty:[''],
   timetaken:[''],
   price1:[''],
   price2:[''],
   price3:[''],
   price4:[''],
   price5:[''],
   prodpcs:[''],
   pndpcs:[''],
   loss:[''],
   venderref:[''],
   remarks:[''],
  });

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.productiondetailsFrom.controls.startdate.setValue(new Date(date))
    }
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": "string",
      "VOCNO": "string",
      "VOCDATE": "2023-10-13T06:02:53.879Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-13T06:02:53.879Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "TOTAL_PCS": 0,
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": "string",
      "REMARKS": "string",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "STONE_INCLUDE": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-13T06:02:53.879Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "string",
      "DT_VOCDATE": "2023-10-13T06:02:53.879Z",
      "DT_BRANCH_CODE": "string",
      "DT_NAVSEQNO": "string",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": "string",
      "JOB_DATE": "2023-10-13T06:02:53.879Z",
      "JOB_SO_NUMBER": 0,
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "UNQ_DESIGN_ID": "string",
      "DESIGN_CODE": "string",
      "PART_CODE": "string",
      "DIVCODE": "string",
      "PREFIX": "string",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SET_REF": "string",
      "KARAT_CODE": "string",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": 0,
      "METAL_PCS": 0,
      "METAL_WT": 0,
      "STONE_PCS": 0,
      "STONE_WT": 0,
      "LOSS_WT": 0,
      "NET_WT": 0,
      "PURITY": 0,
      "PURE_WT": 0,
      "RATE_TYPE": "string",
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": "string",
      "PROCESS_NAME": "string",
      "WORKER_CODE": "string",
      "WORKER_NAME": "string",
      "IN_DATE": "2023-10-13T06:02:53.879Z",
      "OUT_DATE": "2023-10-13T06:02:53.879Z",
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": "string",
      "WIP_ACCODE": "string",
      "STK_ACCODE": "string",
      "SOH_ACCODE": "string",
      "PROD_PROC": "string",
      "METAL_DIVISION": "string",
      "PRICE1PER": "string",
      "PRICE2PER": "string",
      "PRICE3PER": "string",
      "PRICE4PER": "string",
      "PRICE5PER": "string",
      "LOCTYPE_CODE": "string",
      "WASTAGE_WT": 0,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "string",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "string",
      "CUSTOMER_CODE": "string",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "string",
      "SUPPLIER_REF": "string",
      "TAGLINES": "string",
      "SETTING_CHRG": 0,
      "POLISH_CHRG": 0,
      "RHODIUM_CHRG": 0,
      "LABOUR_CHRG": 0,
      "MISC_CHRG": 0,
      "SETTING_ACCODE": "string",
      "POLISH_ACCODE": "string",
      "RHODIUM_ACCODE": "string",
      "LABOUR_ACCODE": "string",
      "MISC_ACCODE": "string",
      "WAST_ACCODE": "string",
      "REPAIRJOB": 0,
      "PRICE1FC": 0,
      "PRICE2FC": 0,
      "PRICE3FC": 0,
      "PRICE4FC": 0,
      "PRICE5FC": 0,
      "FROM_STOCK_CODE": "string",
      "TO_STOCK_CODE": "string",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "string",
      "LOTNUMBER": "string",
      "TICKETNO": "string",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "string",
      "OTH_STONE_WT": 0,
      "OTH_STONE_AMT": 0,
      "HANDLING_ACCODE": "string",
      "D_REMARKS": "string",
      "BARCODEDQTY": 0,
      "BARCODEDPCS": 0,
      "METALSTONE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SHAPE": "string",
      "SIZE": "string",
      "PCS": 0,
      "AMOUNT": 0,
      "REFMID": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "LOSS_QTY": 0,
      "LABOUR_CODE": "string",
      "LAB_RATE": 0,
      "LAB_AMTLC": 0,
      "LAB_AMTFC": 0,
      "SELLINGVALUE": 0,
      "PUREWT": 0,
      "SQLID": "string",
      "SIEVE": "string",
      "MAIN_STOCK_CODE": "string",     
      "CONSIGNMENT": 0,     
      "HANDLING_CHARGEFC": 0,
      "HANDLING_CHARGELC": 0,
      "HANDLING_RATEFC": 0,
      "HANDLING_RATELC": 0,
      "PRICECODE": "string",
      "SUB_STOCK_CODE": "string",
      "SIEVE_SET": "string",     
      "PROCESS_TYPE": "string",      
      "OTHER_ATTR": "string",
      "PUREWTTEMP": 0,    
      "UNITCODE": "string",
      "DIVISION": "string",    
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,   
      "DIVISION_CODE": "string",    
      "CONV_FACTOR": 0,
    };
    this.tableData.push(data);
}
removedata(){
  this.tableData.pop();
}
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.productiondetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobProductionMaster/InsertJobProductionMaster'
    let postData = {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": "string",
      "VOCDATE": "2023-10-13T06:02:53.879Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-13T06:02:53.879Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "TOTAL_PCS": this.productiondetailsFrom.value.totalpcs || "",
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": "string",
      "REMARKS": this.productiondetailsFrom.value.remarks || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "STONE_INCLUDE": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-13T06:02:53.879Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "string",
      "DT_VOCDATE": "2023-10-13T06:02:53.879Z",
      "DT_BRANCH_CODE": "string",
      "DT_NAVSEQNO": "string",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.productiondetailsFrom.value.jobno || "",
      "JOB_DATE": this.productiondetailsFrom.value.jobdate || "",
      "JOB_SO_NUMBER":this.productiondetailsFrom.value.currency || "",
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "UNQ_DESIGN_ID": "string",
      "DESIGN_CODE": this.productiondetailsFrom.value.design || "",
      "PART_CODE": this.productiondetailsFrom.value.parts || "",
      "DIVCODE": "string",
      "PREFIX": this.productiondetailsFrom.value.prefix || "",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SET_REF": this.productiondetailsFrom.value.setref || "",
      "KARAT_CODE": this.productiondetailsFrom.value.karat || "",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.productiondetailsFrom.value.grosswt || "",
      "METAL_PCS": 0,
      "METAL_WT":this.productiondetailsFrom.value.metalwt || "",
      "STONE_PCS":this.productiondetailsFrom.value.stonepcs || "",
      "STONE_WT": this.productiondetailsFrom.value.stonewt || "",
      "LOSS_WT": 0,
      "NET_WT": 0,
      "PURITY": 0,
      "PURE_WT": 0,
      "RATE_TYPE": "string",
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.productiondetailsFrom.value.process || "",
      "PROCESS_NAME":this.productiondetailsFrom.value.processname || "",
      "WORKER_CODE": this.productiondetailsFrom.value.worker || "",
      "WORKER_NAME": this.productiondetailsFrom.value.workername || "",
      "IN_DATE": this.productiondetailsFrom.value.startdate || "",
      "OUT_DATE": this.productiondetailsFrom.value.enddate || "",
      "TIME_TAKEN_HRS": this.productiondetailsFrom.value.timetaken || "",
      "COST_CODE": "string",
      "WIP_ACCODE": "string",
      "STK_ACCODE": "string",
      "SOH_ACCODE": "string",
      "PROD_PROC": "string",
      "METAL_DIVISION": "string",
      "PRICE1PER": this.productiondetailsFrom.value.price1 || "",
      "PRICE2PER": this.productiondetailsFrom.value.price2 || "",
      "PRICE3PER": this.productiondetailsFrom.value.price3 || "",
      "PRICE4PER":this.productiondetailsFrom.value.price4 || "",
      "PRICE5PER": this.productiondetailsFrom.value.price5 || "",
      "LOCTYPE_CODE": this.productiondetailsFrom.value.location || "",
      "WASTAGE_WT": 0,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "string",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "string",
      "CUSTOMER_CODE": "string",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "string",
      "SUPPLIER_REF": "string",
      "TAGLINES": "string",
      "SETTING_CHRG": 0,
      "POLISH_CHRG": 0,
      "RHODIUM_CHRG": 0,
      "LABOUR_CHRG": 0,
      "MISC_CHRG": 0,
      "SETTING_ACCODE": "string",
      "POLISH_ACCODE": "string",
      "RHODIUM_ACCODE": "string",
      "LABOUR_ACCODE": "string",
      "MISC_ACCODE": "string",
      "WAST_ACCODE": "string",
      "REPAIRJOB": 0,
      "PRICE1FC": 0,
      "PRICE2FC": 0,
      "PRICE3FC": 0,
      "PRICE4FC": 0,
      "PRICE5FC": 0,
      "FROM_STOCK_CODE": "string",
      "TO_STOCK_CODE": "string",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "string",
      "LOTNUMBER": "string",
      "TICKETNO": "string",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "string",
      "OTH_STONE_WT": this.productiondetailsFrom.value.otherstone || "",
      "OTH_STONE_AMT": 0,
      "HANDLING_ACCODE": "string",
      "D_REMARKS": "string",
      "BARCODEDQTY": 0,
      "BARCODEDPCS": 0,
      "METALSTONE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SHAPE": "string",
      "SIZE": "string",
      "PCS": 0,
      "AMOUNT": 0,
      "REFMID": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "LOSS_QTY": this.productiondetailsFrom.value.lossqty || "",
      "LABOUR_CODE": "string",
      "LAB_RATE": 0,
      "LAB_AMTLC": 0,
      "LAB_AMTFC": 0,
      "SELLINGVALUE": 0,
      "PUREWT": 0,
      "SQLID": "string",
      "SIEVE": "string",
      "MAIN_STOCK_CODE": "string",     
      "CONSIGNMENT": 0,     
      "HANDLING_CHARGEFC": 0,
      "HANDLING_CHARGELC": 0,
      "HANDLING_RATEFC": 0,
      "HANDLING_RATELC": 0,
      "PRICECODE": "string",
      "SUB_STOCK_CODE": "string",
      "SIEVE_SET": "string",     
      "PROCESS_TYPE": "string",      
      "OTHER_ATTR": "string",
      "PUREWTTEMP": 0,    
      "UNITCODE": "string",
      "DIVISION": "string",    
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,   
      "DIVISION_CODE": "string",    
      "CONV_FACTOR": 0,
      "approvalDetails": this.tableData,  
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
                this.productiondetailsFrom.reset()
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
    
    this.productiondetailsFrom.controls.jobno.setValue(this.content.JOB_NUMBER)
    this.productiondetailsFrom.controls.jobdate.setValue(this.content.JOB_DATE)
    this.productiondetailsFrom.controls.subjobno.setValue(this.content.JOB_SO_NUMBER)
    this.productiondetailsFrom.controls.design.setValue(this.content.DESIGN_CODE)
    this.productiondetailsFrom.controls.prefix.setValue(this.content.PREFIX)
    this.productiondetailsFrom.controls.setref.setValue(this.content.SET_REF)
    this.productiondetailsFrom.controls.karat.setValue(this.content.KARAT_CODE)
    this.productiondetailsFrom.controls.grosswt.setValue(this.content.GROSS_WT)
    this.productiondetailsFrom.controls.metalwt.setValue(this.content.METAL_WT)
    this.productiondetailsFrom.controls.stonepcs.setValue(this.content.STONE_PCS)
    this.productiondetailsFrom.controls.stonewt.setValue(this.content.STONE_WT)
    this.productiondetailsFrom.controls.process.setValue(this.content.PROCESS_CODE)
    this.productiondetailsFrom.controls.processname.setValue(this.content.PROCESS_NAME)
    this.productiondetailsFrom.controls.worker.setValue(this.content.WORKER_CODE)
    this.productiondetailsFrom.controls.workername.setValue(this.content.WORKER_NAME)
    this.productiondetailsFrom.controls.startdate.setValue(this.content.IN_DATE)
    this.productiondetailsFrom.controls.enddate.setValue(this.content.OUT_DATE)
    this.productiondetailsFrom.controls.timetaken.setValue(this.content.TIME_TAKEN_HRS)
    this.productiondetailsFrom.controls.price1.setValue(this.content.PRICE1PER)
    this.productiondetailsFrom.controls.price2.setValue(this.content.PRICE2PER)
    this.productiondetailsFrom.controls.price3.setValue(this.content.PRICE3PER)
    this.productiondetailsFrom.controls.price4.setValue(this.content.PRICE4PER)
    this.productiondetailsFrom.controls.price5.setValue(this.content.PRICE5PER)
    this.productiondetailsFrom.controls.location.setValue(this.content.LOCTYPE_CODE)
    this.productiondetailsFrom.controls.otherstone.setValue(this.content.OTH_STONE_WT)
    this.productiondetailsFrom.controls.lossqty.setValue(this.content.LOSS_QTY)
    this.productiondetailsFrom.controls.remarks.setValue(this.content.REMARKS)

  }


  update(){
    if (this.productiondetailsFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobProductionMaster/UpdateJobProductionMaster/'+ this.productiondetailsFrom.value.branchCode  + this.productiondetailsFrom.value.voctype + this.productiondetailsFrom.value.vocno + this.productiondetailsFrom.value.vocdate
    let postData = {
      "MID": 0,
      "VOCTYPE": "str",
      "BRANCH_CODE": this.branchCode,
      "VOCNO": "string",
      "VOCDATE": "2023-10-13T06:02:53.879Z",
      "YEARMONTH": "string",
      "DOCTIME": "2023-10-13T06:02:53.879Z",
      "CURRENCY_CODE": "stri",
      "CURRENCY_RATE": 0,
      "METAL_RATE_TYPE": "string",
      "METAL_RATE": 0,
      "TOTAL_PCS": this.productiondetailsFrom.value.totalpcs || "",
      "TOTAL_GROSS_WT": 0,
      "TOTAL_METAL_PCS": 0,
      "TOTAL_METAL_WT": 0,
      "TOTAL_METAL_AMTFC": 0,
      "TOTAL_METAL_AMTLC": 0,
      "TOTAL_STONE_PCS": 0,
      "TOTAL_STONE_WT": 0,
      "TOTAL_STONE_AMTFC": 0,
      "TOTAL_STONE_AMTLC": 0,
      "TOTAL_NET_WT": 0,
      "TOTAL_LOSS_WT": 0,
      "TOTAL_LABOUR_AMTFC": 0,
      "TOTAL_LABOUR_AMTLC": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTLC": 0,
      "TOTAL_WASTAGE_AMTLC": 0,
      "TOTAL_WASTAGE_AMTFC": 0,
      "SMAN": "string",
      "REMARKS": this.productiondetailsFrom.value.remarks || "",
      "NAVSEQNO": 0,
      "FIX_UNFIX": true,
      "STONE_INCLUDE": true,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "BASE_CURRENCY": "stri",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "PRINT_COUNT": 0,
      "INTER_BRANCH": "string",
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "SYSTEM_DATE": "2023-10-13T06:02:53.879Z",
      "UNIQUEID": 0,
      "SRNO": 0,
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "string",
      "DT_VOCDATE": "2023-10-13T06:02:53.879Z",
      "DT_BRANCH_CODE": "string",
      "DT_NAVSEQNO": "string",
      "DT_YEARMONTH": "string",
      "JOB_NUMBER": this.productiondetailsFrom.value.jobno || "",
      "JOB_DATE": this.productiondetailsFrom.value.jobdate || "",
      "JOB_SO_NUMBER":this.productiondetailsFrom.value.subjobno || "",
      "UNQ_JOB_ID": "string",
      "JOB_DESCRIPTION": "string",
      "UNQ_DESIGN_ID": "string",
      "DESIGN_CODE": this.productiondetailsFrom.value.design || "",
      "PART_CODE": this.productiondetailsFrom.value.parts || "",
      "DIVCODE": "string",
      "PREFIX": this.productiondetailsFrom.value.prefix || "",
      "STOCK_CODE": "string",
      "STOCK_DESCRIPTION": "string",
      "SET_REF": this.productiondetailsFrom.value.setref || "",
      "KARAT_CODE": this.productiondetailsFrom.value.karat || "",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.productiondetailsFrom.value.grosswt || "",
      "METAL_PCS": 0,
      "METAL_WT":this.productiondetailsFrom.value.metalwt || "",
      "STONE_PCS":this.productiondetailsFrom.value.stonepcs || "",
      "STONE_WT": this.productiondetailsFrom.value.stonewt || "",
      "LOSS_WT": 0,
      "NET_WT": 0,
      "PURITY": 0,
      "PURE_WT": 0,
      "RATE_TYPE": "string",
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.productiondetailsFrom.value.process || "",
      "PROCESS_NAME":this.productiondetailsFrom.value.processname || "",
      "WORKER_CODE": this.productiondetailsFrom.value.worker || "",
      "WORKER_NAME": this.productiondetailsFrom.value.workername || "",
      "IN_DATE": this.productiondetailsFrom.value.startdate || "",
      "OUT_DATE": this.productiondetailsFrom.value.enddate || "",
      "TIME_TAKEN_HRS": this.productiondetailsFrom.value.timetaken || "",
      "COST_CODE": "string",
      "WIP_ACCODE": "string",
      "STK_ACCODE": "string",
      "SOH_ACCODE": "string",
      "PROD_PROC": "string",
      "METAL_DIVISION": "string",
      "PRICE1PER": this.productiondetailsFrom.value.price1 || "",
      "PRICE2PER": this.productiondetailsFrom.value.price2 || "",
      "PRICE3PER": this.productiondetailsFrom.value.price3 || "",
      "PRICE4PER":this.productiondetailsFrom.value.price4 || "",
      "PRICE5PER": this.productiondetailsFrom.value.price5 || "",
      "LOCTYPE_CODE": this.productiondetailsFrom.value.location || "",
      "WASTAGE_WT": 0,
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "string",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "string",
      "CUSTOMER_CODE": "string",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "string",
      "SUPPLIER_REF": "string",
      "TAGLINES": "string",
      "SETTING_CHRG": 0,
      "POLISH_CHRG": 0,
      "RHODIUM_CHRG": 0,
      "LABOUR_CHRG": 0,
      "MISC_CHRG": 0,
      "SETTING_ACCODE": "string",
      "POLISH_ACCODE": "string",
      "RHODIUM_ACCODE": "string",
      "LABOUR_ACCODE": "string",
      "MISC_ACCODE": "string",
      "WAST_ACCODE": "string",
      "REPAIRJOB": 0,
      "PRICE1FC": 0,
      "PRICE2FC": 0,
      "PRICE3FC": 0,
      "PRICE4FC": 0,
      "PRICE5FC": 0,
      "FROM_STOCK_CODE": "string",
      "TO_STOCK_CODE": "string",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "string",
      "LOTNUMBER": "string",
      "TICKETNO": "string",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": "string",
      "OTH_STONE_WT": this.productiondetailsFrom.value.otherstone || "",
      "OTH_STONE_AMT": 0,
      "HANDLING_ACCODE": "string",
      "D_REMARKS": "string",
      "BARCODEDQTY": 0,
      "BARCODEDPCS": 0,
      "METALSTONE": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SHAPE": "string",
      "SIZE": "string",
      "PCS": 0,
      "AMOUNT": 0,
      "REFMID": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_PER": 0,
      "LOSS_QTY": this.productiondetailsFrom.value.lossqty || "",
      "LABOUR_CODE": "string",
      "LAB_RATE": 0,
      "LAB_AMTLC": 0,
      "LAB_AMTFC": 0,
      "SELLINGVALUE": 0,
      "PUREWT": 0,
      "SQLID": "string",
      "SIEVE": "string",
      "MAIN_STOCK_CODE": "string",     
      "CONSIGNMENT": 0,     
      "HANDLING_CHARGEFC": 0,
      "HANDLING_CHARGELC": 0,
      "HANDLING_RATEFC": 0,
      "HANDLING_RATELC": 0,
      "PRICECODE": "string",
      "SUB_STOCK_CODE": "string",
      "SIEVE_SET": "string",     
      "PROCESS_TYPE": "string",      
      "OTHER_ATTR": "string",
      "PUREWTTEMP": 0,    
      "UNITCODE": "string",
      "DIVISION": "string",    
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,   
      "DIVISION_CODE": "string",    
      "CONV_FACTOR": 0,
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
                this.productiondetailsFrom.reset()
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
        let API = 'JobProductionMaster/DeleteJobProductionMaster/' + this.productiondetailsFrom.value.branchCode + this.productiondetailsFrom.value.voctype + this.productiondetailsFrom.value.vocno + this.productiondetailsFrom.value.vocdate
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
                    this.productiondetailsFrom.reset()
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
                    this.productiondetailsFrom.reset()
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

}
