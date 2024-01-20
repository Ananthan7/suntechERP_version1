import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mould-making',
  templateUrl: './mould-making.component.html',
  styleUrls: ['./mould-making.component.scss']
})
export class MouldMakingComponent implements OnInit {
  
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  columnheads : any[] = ['Stock Code','Description','Psc','Gross Weight','Rate','Amount','Location'];
  branchCode?: String;
  yearMonth?: String;
  allMode: string;
  checkBoxesMode: string;
  selectedIndexes: any = [];
  vocMaxDate = new Date();
  currentDate = new Date();

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


mouldCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Mould Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

stockCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 23,
  SEARCH_FIELD: 'STOCK_CODE',
  SEARCH_HEADING: 'Stock type',
  SEARCH_VALUE: '',
  WHERECONDITION: "STOCK_CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}


 constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private comService: CommonServiceService,
  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  userDataSelected(value: any) {
    console.log(value);
       this.mouldMakingForm.controls.enteredBy.setValue(value.UsersName);
  }

  ProcessCodeSelected(e:any){
    console.log(e);
    this.mouldMakingForm.controls.fromProcess.setValue(e.Process_Code);
    this.mouldMakingForm.controls.toProcess.setValue(e.Process_Code);
  }
  
  WorkerCodeSelected(e:any){
    console.log(e);
    this.mouldMakingForm.controls.fromWorker.setValue(e.WORKER_CODE);
    this.mouldMakingForm.controls.toWorker.setValue(e.WORKER_CODE);
  }

  jobnoCodeSelected(e:any){
    console.log(e);
    this.mouldMakingForm.controls.jobNo.setValue(e.job_number);
  }

  mouldCodeSelected(e:any){
    console.log(e);
    this.mouldMakingForm.controls.mouldType.setValue(e.CODE);
  }

  stockCodeSelected(e:any){
    console.log(e);
    this.mouldMakingForm.controls.stockcode.setValue(e.STOCK_CODE);
  }

  stock_codetemp(data:any,value: any){
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.STOCK_CODE;
  }

  descriptiontemp(data:any,value: any){
    console.log(value);
    console.log(data);
    this.tableData[value.data.SN - 1].stock_code = data.STOCK_CODE;
    this.tableData[value.data.SN - 1].description = data.DESCRIPTION;
  }

  Psctemp(data:any,value: any){
    this.tableData[value.data.SN - 1].Psc = data.target.value;
  }

  gross_weighttemp(data:any,value: any){
    this.tableData[value.data.SN - 1].gross_weight = data.target.value;
  }

  ratetemp(data:any,value: any){
    this.tableData[value.data.SN - 1].rate = data.target.value;
  }

  amounttemp(data:any,value: any){
    this.tableData[value.data.SN - 1].amount = data.target.value;
  }

  locationtemp(data:any,value: any){
    this.tableData[value.data.SN - 1].location = data.target.value;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  
  addTableData(){
    let length = this.tableData.length;
    let sn = length + 1;
    let data =  {
      "SN": sn,
      "stock_code": "",
      "description": "",
      "Psc": "",
      "gross_weight": "",
      "rate": "",
      "amount": "",
      "location": "",
    };
    this.tableData.push(data);
  }

 
  
 onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SN))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
    
  }

  deleteTableData(){
    console.log(this.selectedIndexes);
  
    if (this.selectedIndexes.length > 0) {
      this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }   
  }
  
  mouldMakingForm: FormGroup = this.formBuilder.group({
    uniq : [''],
    uniqNo : [''],
    job : [''],
    vocher :['MLM',[Validators.required]],
    vocherNo:[1],
    vocDate : [new Date()],
    enteredBy : [''],
    fromProcess : ['',[Validators.required]],
    fromWorker : ['',[Validators.required]],
    jobNo : [''],
    mouldNo : ['',[Validators.required]],
    mouldType : ['',[Validators.required]],
    noOfParts : [''],
    narration : [''],
    toProcess : ['',[Validators.required]],
    toWorker : ['',[Validators.required]],
    designCode : ['',[Validators.required]],
    itemCurrency : ['AED'],
    itemCurrencyRate : [1.000000],
    location :[''],

  });
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.mouldMakingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMouldHeaderDJ/InsertJobMouldHeaderDJ'
    let postData = {
     "MID": 0,
     "BRANCH_CODE":  this.branchCode,
     "VOCTYPE":this.mouldMakingForm.value.vocher || "",
      "VOCNO": 0,
      "VOCDATE": this.mouldMakingForm.value.vocDate || "",
      "YEARMONTH": this.yearMonth,
      "JOB_NUMBER": this.mouldMakingForm.value.jobNo || "",
      "JOB_DESCRIPTION": this.mouldMakingForm.value.job || "",
      "DESIGN_CODE": this.mouldMakingForm.value.designCode || "",
      "MOULD_NUMBER": this.mouldMakingForm.value.mouldNo || "",
      "MOULD_LOCATION": this.mouldMakingForm.value.location || "",
      "MOULD_TYPE":this.mouldMakingForm.value.mouldType || "",
      "UNQ_JOB_ID": this.mouldMakingForm.value.uniq,
      "UNQ_DESIGN_ID": this.mouldMakingForm.value.uniqNo,
      "JOB_SO_MID": 0,
      "JOB_SO_NUMBER": 0,
      "PARTYCODE":this.mouldMakingForm.value.noOfParts || "",
      "PARTY_CURRENCY": "",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": this.mouldMakingForm.value.itemCurrency || "",
      "ITEM_CURR_RATE": this.mouldMakingForm.value.itemCurrencyRate || "",
      "VALUE_DATE": "2023-10-19T08:59:58.514Z",
      "SALESPERSON_CODE": this.mouldMakingForm.value.enteredBy,
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": 0,
      "NET_VALUE_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": 0,
      "GROSS_VALUE_CC": 0,
      "REMARKS": this.mouldMakingForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-19T08:59:58.514Z",
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "string",
      "SUPINVDATE": "2023-10-19T08:59:58.514Z",
      "PAYMENTREMARKS": "",
      "HHACCOUNT_HEAD": "",
      "D2DTRANSFER": "",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "PICTURE_NAME": "",
      "FROM_WORKER_CODE":this.mouldMakingForm.value.fromWorker || "",
      "TO_WORKER_CODE": this.mouldMakingForm.value.toWorker || "",
      "FROM_PROCESS_CODE":this.mouldMakingForm.value.fromProcess || "",
      "TO_PROCESS_CODE": this.mouldMakingForm.value.toProcess || "",
      "PARTS": 0,
  "Details": [
    {
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "",
      "PCS": 0,
      "GRWT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "VALUEFC": 0,
      "VALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": 0,
      "NETVALUECC": 0,
      "LOCTYPE_CODE": "",
      "STOCK_DOCDESC": "",
      "DETDIVISION": "",
      "BASE_CONV_RATE": 0,
      "DIVISION_CODE": "",
      "POSTDATE": "",
      "DETLINEREMARKS": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "TOTAL_AMOUNTCC": 0,
      "TOTAL_AMOUNTFC": 0
    }
  ]
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
                this.mouldMakingForm.reset()
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

 
  update(){
    if (this.mouldMakingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobMouldHeaderDJ/UpdateJobMouldHeaderDJ/'+ this.mouldMakingForm.value.branchCode + this.mouldMakingForm.value.voctype + this.mouldMakingForm.value.vocno + this.mouldMakingForm.value.yearMonth
    let postData = {
      "MID": 0,
     "BRANCH_CODE":  this.branchCode,
     "VOCTYPE":this.mouldMakingForm.value.voctype || "",
      "VOCNO": 0,
      "VOCDATE": this.mouldMakingForm.value.vocdate || "",
      "YEARMONTH": this.yearMonth,
      "JOB_NUMBER": this.mouldMakingForm.value.jobno || "",
      "JOB_DESCRIPTION": this.mouldMakingForm.value.job || "",
      "DESIGN_CODE": this.mouldMakingForm.value.designcode || "",
      "MOULD_NUMBER": this.mouldMakingForm.value.mouldno || "",
      "MOULD_LOCATION": this.mouldMakingForm.value.location || "",
      "MOULD_TYPE":this.mouldMakingForm.value.mouldtype || "",
      "UNQ_JOB_ID": "",
      "UNQ_DESIGN_ID": "",
      "JOB_SO_MID": 0,
      "JOB_SO_NUMBER": 0,
      "PARTYCODE":this.mouldMakingForm.value.noofparts || "",
      "PARTY_CURRENCY": "",
      "PARTY_CURR_RATE": 0,
      "ITEM_CURRENCY": this.mouldMakingForm.value.itemcurrency || "",
      "ITEM_CURR_RATE": this.mouldMakingForm.value.itemcurrencyrate || "",
      "VALUE_DATE": "2023-10-19T08:59:58.514Z",
      "SALESPERSON_CODE": "",
      "TOTAL_PCS": 0,
      "TOTAL_GRWT": 0,
      "TOTAL_DISCAMTFC": 0,
      "TOTAL_DISCAMTCC": 0,
      "ITEM_VALUE_FC": 0,
      "ITEM_VALUE_CC": 0,
      "PARTY_VALUE_FC": 0,
      "PARTY_VALUE_CC": 0,
      "NET_VALUE_FC": 0,
      "NET_VALUE_CC": 0,
      "ADDL_VALUE_FC": 0,
      "ADDL_VALUE_CC": 0,
      "GROSS_VALUE_FC": 0,
      "GROSS_VALUE_CC": 0,
      "REMARKS": this.mouldMakingForm.value.narration || "",
      "SYSTEM_DATE": "2023-10-19T08:59:58.514Z",
      "CONSIGNMENTID": 0,
      "ROUND_VALUE_CC": 0,
      "NAVSEQNO": 0,
      "SUPINVNO": "",
      "SUPINVDATE": "2023-10-19T08:59:58.514Z",
      "PAYMENTREMARKS": "",
      "HHACCOUNT_HEAD": "",
      "D2DTRANSFER": "s",
      "BASE_CURRENCY": "",
      "BASE_CURR_RATE": 0,
      "BASE_CONV_RATE": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "PRINT_COUNT": 0,
      "DOC_REF": "",
      "PICTURE_NAME": "",
      "FROM_WORKER_CODE":this.mouldMakingForm.value.fromworker || "",
      "TO_WORKER_CODE": this.mouldMakingForm.value.toworker || "",
      "FROM_PROCESS_CODE":this.mouldMakingForm.value.fromprocess || "",
      "TO_PROCESS_CODE": this.mouldMakingForm.value.toprocess || "",
      "PARTS": 0,
  "Details": [
    {
      "UNIQUEID": 0,
      "SRNO": 0,
      "STOCK_CODE": "",
      "PCS": 0,
      "GRWT": 0,
      "RATEFC": 0,
      "RATECC": 0,
      "VALUEFC": 0,
      "VALUECC": 0,
      "DISCPER": 0,
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "NETVALUEFC": 0,
      "NETVALUECC": 0,
      "LOCTYPE_CODE": "",
      "STOCK_DOCDESC": "",
      "DETDIVISION": "s",
      "BASE_CONV_RATE": 0,
      "DIVISION_CODE": "",
      "POSTDATE": "",
      "DETLINEREMARKS": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "TOTAL_AMOUNTCC": 0,
      "TOTAL_AMOUNTFC": 0
    }
  ]
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
                this.mouldMakingForm.reset()
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
        let API = 'JobMouldHeaderDJ/DeleteJobMouldHeaderDJ/' + this.mouldMakingForm.value.branchCode + this.mouldMakingForm.value.voctype + this.mouldMakingForm.value.vocno + this.mouldMakingForm.value.yearMonth
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
                    this.mouldMakingForm.reset()
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
                    this.mouldMakingForm.reset()
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
