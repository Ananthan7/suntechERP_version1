import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, NgModel, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-customer-pricing-master',
  templateUrl: './customer-pricing-master.component.html',
  styleUrls: ['./customer-pricing-master.component.scss']
})
export class CustomerPricingMasterComponent implements OnInit {

  @ViewChild('select')
  select!: MatSelect;
  divisionMS: any = 'ID';
  columnheader: any[] = ['SrNo', 'Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5', 'Group 6', 'Apply On U', 'Mkg On %', 'Std Mkg', 'Mkg Rate', 'Variance'];
  columnheader1: any[] = ['Branch', 'Making', 'Wastage', 'Apply',];
  columnheaderweightRange: any[] = ['SrNo', 'Division', 'Apply on Unit', 'From Weight', 'To Weight', 'Making Rate'];
  columnheaderTransaction: any[] = ['SrNo', 'Karat', 'Std Purity', 'Sales Purity', 'Purchase Purity'];
  subscriptions: any;
  @Input() content!: any;
  Add: boolean = true;
  Deduct: boolean = true;
  tableData: any[] = [];
  currentDate = new FormControl(new Date());
  flexSwitchCheckChecked: boolean = true;
  text = "Deduct";
  approveDisable: boolean = true;
  codeEnable: boolean = true;
  enableUpdate: boolean = true;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    console.log(this.content);
    this.setCompanyCurrency();
    if (this.content.FLAG == 'VIEW') {
      this.setFormValues();
    }
    else (this.content.FLAG == 'EDIT')
    {
      this.setFormValues();
      this.approveDisable = false;
      this.codeEnable = false;
      this.enableUpdate = false;
    }

  }

  allSelected = false;
  apply: any[] = [
    { value: 'Std Making Rate', viewValue: 'Std Making Rate' },
    { value: 'Min Rate', viewValue: 'Min Rate' },
    { value: 'Max Rate', viewValue: 'Max Rate' },
    { value: 'Wastage %', viewValue: 'Wastage %' }
  ];

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  change(event: any) {
    console.log(event);
    this.text = event.target.value;
    if (event.target.checked == true) {
      this.text = "Add";
    } else {
      this.text = "Deduct";
    }
  }


  customerpricemasterForm: FormGroup = this.formBuilder.group({
    division: ['', [Validators.required]],
    date: [new Date(), ''],
    approvalby: [''],
    enteredBy: ['', [Validators.required]],
    price: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    customercode: ['', [Validators.required]],
    labourtype: ['None', [Validators.required]],
    pricedesc: ['', [Validators.required]],
    defaultCustomer: [''],
    defaultVendor: [''],
    customercodeDesc: [''],
    byValue: ['1'],
    bypercentage: [''],

  })

  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.customerpricemasterForm.controls.currency.setValue(CURRENCY_CODE);
  }


  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'User',
    SEARCH_VALUE: '',
    WHERECONDITION: "USERSNAME <> 'SUNTECH'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  userDataSelected(value: any) {
    console.log(value);
    this.customerpricemasterForm.controls.enteredBy.setValue(value.UsersName);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION in ('M')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.division.setValue(e.DIVISION_CODE);
  }

  custsuppCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Cust/Supp Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCOUNT_MODE IN ('P','R') and AC_OnHold = 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  custsuppCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.customercode.setValue(e.ACCODE);
    this.customerpricemasterForm.controls.customercodeDesc.setValue(e.ACCOUNT_HEAD);
  }

  approvalCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Approval Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "USERSNAME <> 'SUNTECH'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ApprovalCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.approvalby.setValue(e.UsersName);
  }

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 87,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "APPROVED_BY <> '' AND DIVISION = '" + this.customerpricemasterForm.value.division + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  priceCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.price.setValue(e.PRICE_CODE);
    this.customerpricemasterForm.controls.pricedesc.setValue(e.DESCRIPTION);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  currencyCodeSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.currency.setValue(e.CURRENCY_CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  setFormValues() {
    console.log(this.content, 'content');
    this.customerpricemasterForm.controls.division.setValue(this.content.DIVISION);
    this.customerpricemasterForm.controls.customercode.setValue(this.content.CUSTOMER_CODE);
    this.customerpricemasterForm.controls.customercodeDesc.setValue(this.content.CUSTOMER_NAME);
    this.customerpricemasterForm.controls.price.setValue(this.content.PRICE_CODE);
    this.customerpricemasterForm.controls.pricedesc.setValue(this.content.PRICE_DESCRIPTION);
    this.customerpricemasterForm.controls.labourtype.setValue(this.content.LABOUR_TYPE);
    this.customerpricemasterForm.controls.division.setValue(this.content.DIVISION);
    this.customerpricemasterForm.controls.date.setValue(this.content.CREATED_DATE);
    this.customerpricemasterForm.controls.enteredBy.setValue(this.content.ENTERED_BY);
    this.customerpricemasterForm.controls.approvalby.setValue(this.content.APPROVED_BY);
    this.customerpricemasterForm.controls.defaultCustomer.setValue(this.content.DEFAULT_CUST);
    this.customerpricemasterForm.controls.defaultVendor.setValue(this.content.DEFAULT_SUPP);
    this.customerpricemasterForm.controls.currency.setValue(this.content.CURRENCY_CODE);
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.customerpricemasterForm.value.labourtype == 'None') {
      this.toastr.error('Labour type cannot be none')
    }
    else {
      if (this.customerpricemasterForm.invalid) {
        this.toastr.error('select all required fields')
        return
      }

      let API = 'CustomerVendorPricingMaster/InsertCustomerVendorPricingMaster'
      let postData = {
        "MID": 0,
        "CUSTOMER_CODE": this.customerpricemasterForm.value.customercode || "",
        "CUSTOMER_NAME": this.customerpricemasterForm.value.customercodeDesc,
        "PRICE_CODE": this.customerpricemasterForm.value.price || "",
        "PRICE_DESCRIPTION": this.customerpricemasterForm.value.pricedesc || "",
        "LABOUR_TYPE": this.customerpricemasterForm.value.labourtype || "",
        "DIVISION": this.customerpricemasterForm.value.division || "",
        "CREATED_DATE": this.customerpricemasterForm.value.date || "",
        "ENTERED_BY": this.customerpricemasterForm.value.enteredBy || "",
        "IS_STOCK_CODE": true,
        "APPROVED_BY": this.customerpricemasterForm.value.approvalby || "",
        "GROUP1": "string",
        "GROUP2": "string",
        "GROUP3": "string",
        "IS_ACTIVE": true,
        "BRANCH_CODE": "string",
        "DEFAULT_CUST": this.customerpricemasterForm.value.defaultCustomer || false,
        "DEFAULT_SUPP": this.customerpricemasterForm.value.defaultVendor || false,
        "GROUP4": "string",
        "GROUP5": "string",
        "GROUP6": "string",
        "MIN_MKGAMT": 0,
        "IS_PLATE_CHARGE": true,
        "PLATE_CHARGES": 0,
        "CURRENCY_CODE": this.customerpricemasterForm.value.currency || "",
        "CURRENCY_RATE": 0,
        "IS_DESIGN_CODE": true,
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
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.customerpricemasterForm.reset()
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
  }





  update() {
    if (this.customerpricemasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'CustomerVendorPricingMaster/UpdateCustomerVendorPricingMaster/' + this.content.CUSTOMER_CODE
    let postData =
    {
      "MID": 0,
      "CUSTOMER_CODE": this.customerpricemasterForm.value.customercode || "",
      "CUSTOMER_NAME": this.customerpricemasterForm.value.customercodeDesc,
      "PRICE_CODE": this.customerpricemasterForm.value.price || "",
      "PRICE_DESCRIPTION": this.customerpricemasterForm.value.pricedesc || "",
      "LABOUR_TYPE": this.customerpricemasterForm.value.labourtype || "",
      "DIVISION": this.customerpricemasterForm.value.division || "",
      "CREATED_DATE": "2023-11-27T09:27:28.005Z",
      "ENTERED_BY": this.customerpricemasterForm.value.enteredBy || "",
      "IS_STOCK_CODE": true,
      "APPROVED_BY": this.customerpricemasterForm.value.approvalby || "",
      "GROUP1": "string",
      "GROUP2": "string",
      "GROUP3": "string",
      "IS_ACTIVE": true,
      "BRANCH_CODE": "string",
      "DEFAULT_CUST": true,
      "DEFAULT_SUPP": true,
      "GROUP4": "string",
      "GROUP5": "string",
      "GROUP6": "string",
      "MIN_MKGAMT": 0,
      "IS_PLATE_CHARGE": true,
      "PLATE_CHARGES": 0,
      "CURRENCY_CODE": this.customerpricemasterForm.value.currency || "",
      "CURRENCY_RATE": 0,
      "IS_DESIGN_CODE": true,
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
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.customerpricemasterForm.reset()
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
        let API = 'ComponentSizeSetMaster/DeleteComponentSizeSetMaster/' + this.content.CUSTOMER_CODE
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
                    this.customerpricemasterForm.reset()
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
                    this.customerpricemasterForm.reset()
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
