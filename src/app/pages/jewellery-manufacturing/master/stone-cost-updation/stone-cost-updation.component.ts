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
  selector: 'app-stone-cost-updation',
  templateUrl: './stone-cost-updation.component.html',
  styleUrls: ['./stone-cost-updation.component.scss']
})
export class StoneCostUpdationComponent implements OnInit {

  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Customer', 'So Number', 'Job Number', 'Job Ref#', 'Pcs', 'Weight', 'Rate', 'Amount', 'New Rate LC', 'New Amount LC', 'New Rate FC', 'New Amount FC',];
  divisionMS: any = 'ID';
  selectedOption: string = 'byvalue';
  isChecked: boolean = true;
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  text: string="Deduct";
  selection!: number;
  userName = this.commonService.userName;
  @Input() content!: any;

  private subscriptions: Subscription[] = [];

  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
   this.branchCode = this.commonService.branchCode;
   this.yearMonth = this.commonService.yearSelected;

   this.setvalues()
  }


  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  change(event:any){
    console.log(event);
    this.text = event.target.value;
    if(event.target.checked == true){
      this.text="Add";
     
    }else{
      this.text="Deduct";
    }
  }

  stonecostupdationFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: [ ''],
    vocno: ['', [Validators.required]],
    stockcodediv: [''],
    stockcode: [''],
    stockcodedes: [''],
    itemcurrency: [''],
    itemcurrency_rate: [''],
    basecurrency: [''],
    basecurrency_rate: [''],
    currentrate_FC: [''],
    currentrate_LC: [''],
    newrate_FC: [''],
    newrate_LC: [''],
    shape: [''],
    size: [''],
    sieve: [''],
    color: [''],
    clarity: [''],
    sieve_set: [''],
    remarks: [''],
    valueTarget:[''],
    text:[false],
  });

  setvalues(){
    console.log(this.commonService);
    
    this.stonecostupdationFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    this.stonecostupdationFrom.controls.vocno.setValue(this.commonService.popMetalValueOnNet)
    this.stonecostupdationFrom.controls.vocdate.setValue(this.commonService.currentDate)
    this.stonecostupdationFrom.controls.itemcurrency.setValue(this.commonService.compCurrency)
    this.stonecostupdationFrom.controls.itemcurrency_rate.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.stonecostupdationFrom.controls.basecurrency.setValue(this.commonService.compCurrency)
    this.stonecostupdationFrom.controls.basecurrency_rate.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  
  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "Stock Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  stockcodeSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.stockcodediv.setValue(value.DIVISION_CODE);
    this.stonecostupdationFrom.controls.stockcode.setValue(value.STOCK_CODE);
    this.stonecostupdationFrom.controls.stockcodedes.setValue(value.DESCRIPTION);
  }

  itemcurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: "CURRENCY_CODE",
    SEARCH_HEADING: "Currency Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  itemcurrencySelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.itemcurrency.setValue(value.CURRENCY_CODE);
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 33,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Shape Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  shapeSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.shape.setValue(value.CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Size Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  sizeSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.size.setValue(value.CODE);
  }

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Sieve Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  sieveSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.sieve.setValue(value.CODE);
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Color Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  colorSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.color.setValue(value.CODE);
  }

  clarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 37,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Clarity Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  claritySelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.clarity.setValue(value.CODE);
  }

  sievesetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Sieve Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  sievesetSelected(value: any) {
    console.log(value);
    this.stonecostupdationFrom.controls.sieve_set.setValue(value.CODE);
  }



  formSubmit() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.stonecostupdationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneRecostDJ/InsertJobStoneRecostDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.stonecostupdationFrom.value.voctype,
      "VOCNO": this.stonecostupdationFrom.value.vocno,
      "VOCDATE": this.stonecostupdationFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "DIVCODE": "string",
      "STOCK_CODE": this.stonecostupdationFrom.value.stockcode,
      "RATELC": this.stonecostupdationFrom.value.currentrate_LC,
      "RATEFC": this.stonecostupdationFrom.value.currentrate_FC,
      "NEW_RATELC": this.stonecostupdationFrom.value.newrate_FC,
      "NEW_RATEFC": this.stonecostupdationFrom.value.newrate_FC,
      "SMAN_CODE": "string",
      "REMARKS": this.stonecostupdationFrom.value.remarks,
      "SHAPE": this.stonecostupdationFrom.value.shape,
      "SIZE": this.stonecostupdationFrom.value.size,
      "SIEVE": this.stonecostupdationFrom.value.sieve,
      "COLOR": this.stonecostupdationFrom.value.color,
      "CLARITY": this.stonecostupdationFrom.value.clarity,
      "SIEVE_SET": this.stonecostupdationFrom.value.sieve_set,
      "SYSTEM_DATE": "2024-01-20T08:08:50.955Z",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "CURRENCY_CODE": this.stonecostupdationFrom.value.itemcurrency,
      "CURRENCY_RATE": this.stonecostupdationFrom.value.itemcurrency_rate,
      "BASE_CURRENCY": this.stonecostupdationFrom.value.basecurrency,
      "BASE_CURR_RATE":this.stonecostupdationFrom.value.basecurrency_rate,
      "BASE_CONV_RATE": 0,
      "HTUSERNAME": "string",
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "UNQ_JOB_ID": "string",
          "UNQ_DESIGN_ID": "string",
          "DT_DIVCODE": "string",
          "DT_STOCK_CODE": "string",
          "DT_RATELC": 0,
          "DT_RATEFC": 0,
          "DT_NEW_RATELC": 0,
          "DT_NEW_RATEFC": 0,
          "PCS": 0,
          "GROSS_WT": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "NEW_AMOUNTLC": 0,
          "NEW_AMOUNTFC": 0,
          "TRN_BRANCH_CODE": "string",
          "TRN_VOCTYPE": "str",
          "TRN_VOCNO": 0,
          "TRN_YEARMONTH": "string",
          "REFMID": 0,
          "PROCESS_CODE": "string",
          "WORKER_CODE": "string"
        }
      ]
   };
  
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
                this.stonecostupdationFrom.reset()
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
  }


  update(){
    if (this.stonecostupdationFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobStoneRecostDJ/UpdateJobStoneRecostDJ/'+ this.branchCode + this.stonecostupdationFrom.value.voctype + this.stonecostupdationFrom.value.vocno + this.yearMonth;
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.stonecostupdationFrom.value.voctype,
      "VOCNO": this.stonecostupdationFrom.value.vocno,
      "VOCDATE": this.stonecostupdationFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "DIVCODE": "string",
      "STOCK_CODE": this.stonecostupdationFrom.value.stockcode,
      "RATELC": this.stonecostupdationFrom.value.currentrate_LC,
      "RATEFC": this.stonecostupdationFrom.value.currentrate_FC,
      "NEW_RATELC": this.stonecostupdationFrom.value.newrate_FC,
      "NEW_RATEFC": this.stonecostupdationFrom.value.newrate_FC,
      "SMAN_CODE": "string",
      "REMARKS": this.stonecostupdationFrom.value.remarks,
      "SHAPE": this.stonecostupdationFrom.value.shape,
      "SIZE": this.stonecostupdationFrom.value.size,
      "SIEVE": this.stonecostupdationFrom.value.sieve,
      "COLOR": this.stonecostupdationFrom.value.color,
      "CLARITY": this.stonecostupdationFrom.value.clarity,
      "SIEVE_SET": this.stonecostupdationFrom.value.sieve_set,
      "SYSTEM_DATE": "2024-01-20T08:08:50.955Z",
      "NAVSEQNO": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "string",
      "CURRENCY_CODE": this.stonecostupdationFrom.value.itemcurrency,
      "CURRENCY_RATE": this.stonecostupdationFrom.value.itemcurrency_rate,
      "BASE_CURRENCY": this.stonecostupdationFrom.value.basecurrency,
      "BASE_CURR_RATE":this.stonecostupdationFrom.value.basecurrency_rate,
      "BASE_CONV_RATE": 0,
      "HTUSERNAME": "string",
      "Details": [
        {
          "UNIQUEID": 0,
          "DT_BRANCH_CODE": "string",
          "DT_VOCTYPE": "str",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "string",
          "SRNO": 0,
          "JOB_NUMBER": "string",
          "UNQ_JOB_ID": "string",
          "UNQ_DESIGN_ID": "string",
          "DT_DIVCODE": "string",
          "DT_STOCK_CODE": "string",
          "DT_RATELC": 0,
          "DT_RATEFC": 0,
          "DT_NEW_RATELC": 0,
          "DT_NEW_RATEFC": 0,
          "PCS": 0,
          "GROSS_WT": 0,
          "AMOUNTLC": 0,
          "AMOUNTFC": 0,
          "NEW_AMOUNTLC": 0,
          "NEW_AMOUNTFC": 0,
          "TRN_BRANCH_CODE": "string",
          "TRN_VOCTYPE": "str",
          "TRN_VOCNO": 0,
          "TRN_YEARMONTH": "string",
          "REFMID": 0,
          "PROCESS_CODE": "string",
          "WORKER_CODE": "string"
        }
      ]
   };
  
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
                this.stonecostupdationFrom.reset()
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
        let API = 'JobStoneRecostDJ/DeleteJobStoneRecostDJ/'+ this.branchCode + this.stonecostupdationFrom.value.voctype + this.stonecostupdationFrom.value.vocno + this.yearMonth;
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
                    this.stonecostupdationFrom.reset()
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
                    this.stonecostupdationFrom.reset()
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
