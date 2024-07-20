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
  selector: 'app-quotation-process',
  templateUrl: './quotation-process.component.html',
  styleUrls: ['./quotation-process.component.scss']
})
export class QuotationProcessComponent implements OnInit {

  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['  ',];
  divisionMS: any = 'ID';
  @Input() content!: any; 
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SalesPerson Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
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
  lookupKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }


  salesCodeSelected(e:any){
    console.log(e);
    this.quotationProcessFrom.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  quotationProcessFrom: FormGroup = this.formBuilder.group({
    voctype:['OOT',[Validators.required]],
    vocdate : [''],
    vocno:['',[Validators.required]],
    documentype:[''],
    salesman:['',[Validators.required]],
    ason:[''],
    docref :[''],
    narration :[''],
  });

  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.quotationProcessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobQuotProcessMasterDJ/InsertJobQuotProcessMasterDJ'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.quotationProcessFrom.value.voctype || "",
      "VOCNO": this.quotationProcessFrom.value.vocno || "",
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.quotationProcessFrom.value.vocdate  || "",
      "SALESPERSON_CODE": this.quotationProcessFrom.value.salesman || "",
      "SYSTEM_DATE": "2023-10-21T09:34:29.847Z",
      "MACHINEID": "",
      "DOC_REF": this.quotationProcessFrom.value.docref || "",
      "REMARKS": this.quotationProcessFrom.value.narration || "",
      "NAVSEQNO": 0,
      "APPR_CODE": "",
      "APPR_TYPE": 0,
      "TRANS_REF": "",
      "USER_ID": "",
      "QUOT_TYPE": "",
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "dm3",
          "DT_VOCTYPE": "MIS",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "stri",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": "",
          "DQT_PARTYCODE": "",
          "DQT_BRANCH_CODE": "",
          "DQT_VOCTYPE": "",
          "DQT_VOCNO": 0,
          "DQT_YEARMONTH": "",
          "DQT_VOCDATE": "2023-10-21T09:34:29.848Z",
          "DQT_REFMID": 0,
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "DSO_BRANCH_CODE": "",
          "DSO_VOCTYPE": "",
          "DSO_VOCNO": 0,
          "DSO_YEARMONTH": "",
          "DSO_REFMID": 0,
          "DQT_PARTYNAME": "",
          "DQT_SUBLEDGER_CODE": ""
        }
      ],
      "Designs": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DESIGN_CODE": "",
          "UNQ_DESIGN_ID": "",
          "DELIVERY_DATE": "2023-10-21T09:34:29.848Z",
          "KARAT_CODE": "",
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "PICTURE_PATH": "",
          "DQT_REFMID": 0,
          "DSO_REFMID": 0,
          "STOCK_CODE": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": ""
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
                this.quotationProcessFrom.reset()
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
    if (this.quotationProcessFrom.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'JobQuotProcessMasterDJ/UpdateJobQuotProcessMasterDJ/'+ this.quotationProcessFrom.value.branchCode + this.quotationProcessFrom.value.voctype + this.quotationProcessFrom.value.vocno + this.quotationProcessFrom.value.yearMonth
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.quotationProcessFrom.value.voctype || "",
      "VOCNO": this.quotationProcessFrom.value.vocno || "",
      "YEARMONTH": this.yearMonth,
      "VOCDATE": this.quotationProcessFrom.value.vocdate  || "",
      "SALESPERSON_CODE": this.quotationProcessFrom.value.salesman || "",
      "SYSTEM_DATE": "2023-10-21T09:34:29.847Z",
      "MACHINEID": "",
      "DOC_REF": this.quotationProcessFrom.value.docref || "",
      "REMARKS": this.quotationProcessFrom.value.narration || "",
      "NAVSEQNO": 0,
      "APPR_CODE": "",
      "APPR_TYPE": 0,
      "TRANS_REF": "",
      "USER_ID": "",
      "QUOT_TYPE": "",
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": "",
          "DQT_PARTYCODE": "",
          "DQT_BRANCH_CODE": "",
          "DQT_VOCTYPE": "",
          "DQT_VOCNO": 0,
          "DQT_YEARMONTH": "",
          "DQT_VOCDATE": "2023-10-21T09:34:29.848Z",
          "DQT_REFMID": 0,
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "DSO_BRANCH_CODE": "",
          "DSO_VOCTYPE": "",
          "DSO_VOCNO": 0,
          "DSO_YEARMONTH": "",
          "DSO_REFMID": 0,
          "DQT_PARTYNAME": "",
          "DQT_SUBLEDGER_CODE": ""
        }
      ],
      "Designs": [
        {
          "REFMID": 0,
          "SRNO": 0,
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "DESIGN_CODE": "",
          "UNQ_DESIGN_ID": "",
          "DELIVERY_DATE": "2023-10-21T09:34:29.848Z",
          "KARAT_CODE": "",
          "DQT_PCS": 0,
          "SO_PCS": 0,
          "PICTURE_PATH": "",
          "DQT_REFMID": 0,
          "DSO_REFMID": 0,
          "STOCK_CODE": "",
          "TRANS_TYPE": "",
          "DT_RESON_TYPE": "",
          "DT_REMARKS": ""
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
                this.quotationProcessFrom.reset()
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
        let API = 'JobQuotProcessMasterDJ/DeleteJobQuotProcessMasterDJ/' + this.quotationProcessFrom.value.branchCode + this.quotationProcessFrom.value.voctype + this.quotationProcessFrom.value.vocno + this.quotationProcessFrom.value.yearMonth
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
                    this.quotationProcessFrom.reset()
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
                    this.quotationProcessFrom.reset()
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
