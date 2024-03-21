import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-price-setting',
  templateUrl: './customer-price-setting.component.html',
  styleUrls: ['./customer-price-setting.component.scss']
})
export class CustomerPriceSettingComponent implements OnInit {

  divisionMS: any = 'ID';
  columnheader:any[] = ['SrNo','Group 1','Group 2', 'Group 3','Group 4','Group 5','Group 6','Apply On Unit','Mkg On %','Std Mkg Rate','Mkg Rate Min','Mkg Rate Max','Variance (+/-)','Wastage %','Min Wastage Qty','Markup %','Stamp Charge','Apply on Weight'];
  columnheaderweightRange:any[] = ['SrNo','Division','Apply on Unit', 'From Weight','To Weight','Making Rate'];
  columnheaderTransaction : any[] = ['SrNo','Karat','Std Purity','Sales Purity','Purchase Purity'];

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  currentDate = new FormControl(new Date());

  isdisabled:boolean = false;
  checkboxvalue:boolean = true
  public isChecked = true;
  userbranch = localStorage.getItem('userbranch');
  disableSelect = false;
  codeEnable :  boolean = true;

  groups = [
    { type: 'None', value: 'None' },
    { type: 'Category', value: 'Category' },
    { type: 'Sub Category', value: 'Sub Category' },
    { type: 'Brand Code', value: 'Brand Code' },
    { type: 'Type', value: 'Type' },
    { type: 'Collection', value: 'Collection' },
    { type: 'Sub-Collection', value: 'Sub-Collection' },
    { type: 'Stone Type/Look', value: 'Stone Type/Look' },
    { type: 'Setting', value: 'Setting' },
    { type: 'Shape', value: 'Shape' },
    { type: 'Inc Cat', value: 'Inc Cat' },
    { type: 'Order Ref', value: 'Order Ref' }
  ];
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
    if (this.content.FLAG == 'VIEW') {
    
    } else if (this.content.FLAG == 'EDIT') {
      this.codeEnable = false;
    }
  }

  selectStock() {
    this.checkboxvalue = !this.checkboxvalue;
  }
  
  checkPriceCode(): boolean {

    if (this.customerpricesettingForm.value.pricecode == '') {
      this.commonService.toastErrorByMsgId('please enter pricecode')
      return true
    }
    return false
}
  
  customerpricesettingForm: FormGroup = this.formBuilder.group({
    pricecode:['',[Validators.required]],
    date:[new Date(),''],
    description:[''],
    division:['',[Validators.required]],
    currency:['',[Validators.required]],
    approvedby:[''],
    enteredBy:['',[Validators.required]],
    stockCode:[''],
    designCode:[''],
    group1:['',[Validators.required]],
    group2:['',[Validators.required]],
    group3:['',[Validators.required]],
    group4:['',[Validators.required]],
    group5:['',[Validators.required]],
    group6:['',[Validators.required]],
  })

  codeEnabled(){
    if (this.customerpricesettingForm.value.pricecode == '') {
    this.codeEnable = true;
    }
    else{
      this.codeEnable = false;
    }
   
  }

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
  userDataSelected(value: any) {
    console.log(value);
    if (this.checkPriceCode()) return
       this.customerpricesettingForm.controls.enteredBy.setValue(value.UsersName);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e); 
    if (this.checkPriceCode()) return
    this.customerpricesettingForm.controls.division.setValue(e.DIVISION_CODE);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCYCODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CMBRANCH_CODE = '" + this.commonService.branchCode + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  currencyCodeSelected(e:any){
    console.log(e); 
    this.customerpricesettingForm.controls.currency.setValue(e.CURRENCYCODE);
  }

  approvedbyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Approved By',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ApprovedbyCodeSelected(e: any) {
    console.log(e);
    if (this.checkPriceCode()) return
    this.customerpricesettingForm.controls.approvedby.setValue(e.UsersName);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){

    if(this.customerpricesettingForm.value.enteredBy == ''){
      this.toastr.error('Entered By Cannot be empty ')
    }

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.customerpricesettingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CustomerVendorPricingMaster/InsertCustomerVendorPricingMaster'
    let postData = {
      "MID": 0,
      "CUSTOMER_CODE":"",
      "CUSTOMER_NAME": "",
      "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
      "PRICE_DESCRIPTION": this.customerpricesettingForm.value.description || "",
      "LABOUR_TYPE": "",
      "DIVISION": this.customerpricesettingForm.value.division || "",
      "CREATED_DATE": this.customerpricesettingForm.value.date || "",
      "ENTERED_BY":this.customerpricesettingForm.value.enteredby || "",
      "IS_STOCK_CODE": this.customerpricesettingForm.value.stockCode,
      "APPROVED_BY": this.customerpricesettingForm.value.approvedby || "",
      "GROUP1": this.customerpricesettingForm.value.group1 || "",
      "GROUP2": this.customerpricesettingForm.value.group2 || "",
      "GROUP3": this.customerpricesettingForm.value.group3 || "",
      "IS_ACTIVE": true,
      "BRANCH_CODE": "",
      "DEFAULT_CUST": true,
      "DEFAULT_SUPP": true,
      "GROUP4": this.customerpricesettingForm.value.group4 || "",
      "GROUP5": this.customerpricesettingForm.value.group5 || "",
      "GROUP6": this.customerpricesettingForm.value.group6 || "",
      "MIN_MKGAMT": 0,
      "IS_PLATE_CHARGE": true,
      "PLATE_CHARGES": 0,
      "CURRENCY_CODE": this.customerpricesettingForm.value.currency || "",
      "CURRENCY_RATE": 0,
      "IS_DESIGN_CODE": this.customerpricesettingForm.value.designCode,
      "customer_vendor_pricing_detail": [
        {
          "SRNO": 0,
          "UNIQUE_ID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DESCRIPTION": "string",
          "DIVISION_CODE": "string",
          "SEARCH_CRITERIA": "string",
          "SEARCH_VALUE": "string",
          "GROUP1": "string",
          "GROUP2": "string",
          "GROUP3": "string",
          "UNITCODE": "string",
          "STD_MKG_RATE": 0,
          "MKG_RATE_MIN": 0,
          "MKG_RATE_MAX": 0,
          "VARIANCE": 0,
          "WASTAGE_PER": 0,
          "MIN_WASTAGE_QTY": 0,
          "MARKUP_PER": 0,
          "APPLY_ON_WEIGHT": true,
          "IS_STOCK_CODE": true,
          "BRANCH_CODE": "string",
          "GROUP4": "string",
          "GROUP5": "string",
          "GROUP6": "string",
          "STAMP_CHARGE": 0,
          "RATI_PER": 0
        }
      ],
      "customer_vendor_pricing_wtrange_det": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DIVISION_CODE": "string",
          "WT_RANGE_FROM": 0,
          "WT_RANGE_TO": 0,
          "STD_MKGRATE": 0,
          "SRCH_CRITERIA": "string",
          "SRCH_VALUE": "string",
          "UNIT_CODE": "string"
        }
      ],
      "customer_vendor_pricing_purity_det": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "string",
          "CUSTOMER_CODE": "string",
          "KARAT_CODE": "string",
          "STD_PURITY": 0,
          "SALE_PURITY": 0,
          "PURC_PURITY": 0
        }
      ],
      "branchwise_customer_vendor_price": [
        {
          "HEAD_BRANCH_CODE": "string",
          "BRANCH_CODE": "string",
          "CUSTOMER_CODE": "string",
          "CUSTOMER_NAME": "string",
          "PRICE_CODE": "string",
          "PRICE_DESCRIPTION": "string",
          "ENTERED_BY": "string",
          "APPROVED_BY": "string",
          "APPLIED_BY_PER": true,
          "MAKING_VALUE": 0,
          "WASTAGE_VALUE": 0
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
                this.customerpricesettingForm.reset()
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
    if (this.customerpricesettingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'CustomerVendorPricingMaster/UpdateCustomerVendorPricingMaster/'+this.content.CUSTOMER_CODE
    let postData = 
    {
      "MID": 0,
      "CUSTOMER_CODE":"string",
      "CUSTOMER_NAME": "string",
      "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
      "PRICE_DESCRIPTION": this.customerpricesettingForm.value.description || "",
      "LABOUR_TYPE": "string",
      "DIVISION": this.customerpricesettingForm.value.division || "",
      "CREATED_DATE": "2023-11-27T09:14:42.615Z",
      "ENTERED_BY":this.customerpricesettingForm.value.enteredby || "",
      "IS_STOCK_CODE": true,
      "APPROVED_BY": this.customerpricesettingForm.value.approvedby || "",
      "GROUP1": this.customerpricesettingForm.value.group1 || "",
      "GROUP2": this.customerpricesettingForm.value.group2 || "",
      "GROUP3": this.customerpricesettingForm.value.group3 || "",
      "IS_ACTIVE": this.customerpricesettingForm.value.stockCode,
      "BRANCH_CODE": "string",
      "DEFAULT_CUST": true,
      "DEFAULT_SUPP": true,
      "GROUP4": this.customerpricesettingForm.value.group4 || "",
      "GROUP5": this.customerpricesettingForm.value.group5 || "",
      "GROUP6": this.customerpricesettingForm.value.group6 || "",
      "MIN_MKGAMT": 0,
      "IS_PLATE_CHARGE": true,
      "PLATE_CHARGES": 0,
      "CURRENCY_CODE": this.customerpricesettingForm.value.currency || "",
      "CURRENCY_RATE": 0,
      "IS_DESIGN_CODE": this.customerpricesettingForm.value.designCode,
      "customer_vendor_pricing_detail": [
        {
          "SRNO": 0,
          "UNIQUE_ID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DESCRIPTION": "string",
          "DIVISION_CODE": "string",
          "SEARCH_CRITERIA": "string",
          "SEARCH_VALUE": "string",
          "GROUP1": "string",
          "GROUP2": "string",
          "GROUP3": "string",
          "UNITCODE": "string",
          "STD_MKG_RATE": 0,
          "MKG_RATE_MIN": 0,
          "MKG_RATE_MAX": 0,
          "VARIANCE": 0,
          "WASTAGE_PER": 0,
          "MIN_WASTAGE_QTY": 0,
          "MARKUP_PER": 0,
          "APPLY_ON_WEIGHT": true,
          "IS_STOCK_CODE": true,
          "BRANCH_CODE": "string",
          "GROUP4": "string",
          "GROUP5": "string",
          "GROUP6": "string",
          "STAMP_CHARGE": 0,
          "RATI_PER": 0
        }
      ],
      "customer_vendor_pricing_wtrange_det": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "CUSTOMER_CODE": "string",
          "PRICE_CODE": "string",
          "DIVISION_CODE": "string",
          "WT_RANGE_FROM": 0,
          "WT_RANGE_TO": 0,
          "STD_MKGRATE": 0,
          "SRCH_CRITERIA": "string",
          "SRCH_VALUE": "string",
          "UNIT_CODE": "string"
        }
      ],
      "customer_vendor_pricing_purity_det": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "string",
          "CUSTOMER_CODE": "string",
          "KARAT_CODE": "string",
          "STD_PURITY": 0,
          "SALE_PURITY": 0,
          "PURC_PURITY": 0
        }
      ],
      "branchwise_customer_vendor_price": [
        {
          "HEAD_BRANCH_CODE": "string",
          "BRANCH_CODE": "string",
          "CUSTOMER_CODE": "string",
          "CUSTOMER_NAME": "string",
          "PRICE_CODE": "string",
          "PRICE_DESCRIPTION": "string",
          "ENTERED_BY": "string",
          "APPROVED_BY": "string",
          "APPLIED_BY_PER": true,
          "MAKING_VALUE": 0,
          "WASTAGE_VALUE": 0
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
                this.customerpricesettingForm.reset()
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
        let API = 'CustomerVendorPricingMaster/DeleteCustomerVendorPricingMaster/' + this.content.CUSTOMER_CODE
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
                    this.customerpricesettingForm.reset()
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
                    this.customerpricesettingForm.reset()
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


  onSelectionChange(selectedValue: any, groupName: string) {
    const formValue = this.customerpricesettingForm.value;
  
    
    for (let groupKey in formValue) {
      if (groupKey !== groupName && formValue[groupKey] === selectedValue) {
       
        if (selectedValue !== null) {
          this.toastr.error('The same value cannot be repeated in different groups.');
     
          this.customerpricesettingForm.get(groupName)?.setValue(null);
          return; 
        }
      }
    }
  }
  
  
  
}
