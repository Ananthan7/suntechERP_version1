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
  columnheader: any[] = ['SRNO', 'GROUP1', 'GROUP2', 'GROUP3', 'GROUP4', 'GROUP5', 'GROUP6', 'APPLY_ON_WEIGHT', 'MKG_ON_PER', 'STD_MKG_RATE', 'MKG_RATE_MIN', 'MKG_RATE_MAX', 'VARIANCE', 'WASTAGE_PER', 'MIN_WASTAGE_QTY', 'MARKUP_PER', 'STAMP_CHARGE', 'APPLY_ON_WEIGHT'];
  columnheaderweightRange: any[] = ['SrNo', 'Division', 'Apply on Unit', 'From Weight', 'To Weight', 'Making Rate'];
  columnheaderTransaction: any[] = ['SrNo', 'Karat', 'Std Purity', 'Sales Purity', 'Purchase Purity'];

  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  postDataDetails: any[] = [];
  currentDate = new FormControl(new Date());

  isdisabled: boolean = false;
  checkboxvalue: boolean = true
  public isChecked = true;
  userbranch = localStorage.getItem('userbranch');
  disableSelect = false;
  codeEnable: boolean = true;
  enableUpdate: boolean = true;
  approveDisable: boolean = true;
  selectedValue: string = 'None';
  selectedValue1: string = 'None';
  selectedValue2: string = 'None';
  selectedValue3: string = 'None';
  selectedValue4: string = 'None';
  selectedValue5: string = 'None';
  tableDataGroupDetails: any[] = [];

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
    private suntechApi: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {

    this.setFormValues();
    // this.getGroupDetails();
    if (this.content.FLAG == 'VIEW') {

    } else if (this.content.FLAG == 'EDIT') {
      this.codeEnable = false;
      this.enableUpdate = false;
      this.approveDisable = false;
      this.setFormValues()
    }


  }
  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.customerpricesettingForm.controls.pricecode.setValue(this.content.PRICE_CODE)
    this.customerpricesettingForm.controls.date.setValue(this.content.DEL_DATE)
    this.customerpricesettingForm.controls.description.setValue(this.content.DESCRIPTION)
    this.customerpricesettingForm.controls.division.setValue(this.content.DIVISION_CODE)
    this.customerpricesettingForm.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.customerpricesettingForm.controls.approvedby.setValue(this.content.APPROVED_BY)
    this.customerpricesettingForm.controls.enteredBy.setValue(this.content.ENTERED_BY)
    this.customerpricesettingForm.controls.stockCode.setValue(this.content.STOCK_CODE)
    this.customerpricesettingForm.controls.designCode.setValue(this.content.DESIGN_CODE)
    this.customerpricesettingForm.controls.group1.setValue(this.content.GROUP1)
    this.customerpricesettingForm.controls.group2.setValue(this.content.GROUP2)
    this.customerpricesettingForm.controls.group3.setValue(this.content.GROUP3)
    this.customerpricesettingForm.controls.group4.setValue(this.content.GROUP4)
    this.customerpricesettingForm.controls.group5.setValue(this.content.GROUP5)
    this.customerpricesettingForm.controls.group6.setValue(this.content.GROUP6)
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
    pricecode: ['', [Validators.required]],
    date: [new Date(), ''],
    description: [''],
    division: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    approvedby: [''],
    enteredBy: ['', [Validators.required]],
    stockCode: [false],
    designCode: [false],
    group1: ['', [Validators.required]],
    group2: [''],
    group3: [''],
    group4: [''],
    group5: [''],
    group6: [''],
  })

  codeEnabled() {
    if (this.customerpricesettingForm.value.pricecode == '') {
      this.codeEnable = true;
    }
    else {
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
    WHERECONDITION: "DIVISION in ('M')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    if (this.checkPriceCode()) return
    this.customerpricesettingForm.controls.division.setValue(e.DIVISION_CODE);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency',
    SEARCH_VALUE: '',
    WHERECONDITION: "CMBRANCH_CODE = '" + this.userbranch + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  currencyCodeSelected(e: any) {
    console.log(e);
    this.customerpricesettingForm.controls.currency.setValue(e.CURRENCY_CODE);
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

  designCodeChange() {


    this.getGroupDetails();

  }

  viewchangeYorN(e: any) {
    console.log(e);

    if (e == true) {
      return 'Y';
    }
    else if (e == '') {
      return 'N'
    }
    else {
      return 'N';
    }


  }

  getGroupDetails() {
    let API = 'UspGetPricingDetails'
    let postDataDetails = {
      "DivisionCode": this.customerpricesettingForm.value.division,
      "StockCodeCheck": this.viewchangeYorN(this.customerpricesettingForm.value.stockCode),
      "DesignCodeCheck": this.viewchangeYorN(this.customerpricesettingForm.value.designCode),
      "FilterGroup1": this.customerpricesettingForm.value.group1,
      "FilterGroup2": this.customerpricesettingForm.value.group2,
      "FilterGroup3": this.customerpricesettingForm.value.group3,
      "FilterGroup4": this.customerpricesettingForm.value.group4,
      "FilterGroup5": this.customerpricesettingForm.value.group5,
      "FilterGroup6": this.customerpricesettingForm.value.group6,
      // "FilterValue1": "",
      // "FilterValue2": "",
      // "FilterValue3": "",
      // "FilterValue4": "",
      // "FilterValue5": "",
      // "FilterValue6": ""
    }
    let Sub: Subscription = this.suntechApi.postDynamicAPI(API, postDataDetails)
      .subscribe((result) => {

        if (result.status == "Success") {

          this.tableDataGroupDetails = result.dynamicData[0];

          console.log(this.tableDataGroupDetails);
        } else {
          this.commonService.toastErrorByMsgId('MSG1531');
        }

      }, err => alert(err))
    this.subscriptions.push(Sub)
  }



  formSubmit() {

    if (this.customerpricesettingForm.value.enteredBy == '') {
      this.toastr.error('Entered By Cannot be empty ')
    }

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.customerpricesettingForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let form = this.customerpricesettingForm.value
    let API = 'CustomerVendorPriceSettmtl/InsertCustomerVendorPrice'
    let postData = {
      "MID": 0,
      "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
      "DESCRIPTION": this.customerpricesettingForm.value.description || "",
      "DIVISION": this.customerpricesettingForm.value.division,
      "CREATED_DATE": this.customerpricesettingForm.value.date || "",
      "ENTERED_BY": this.customerpricesettingForm.value.enteredby || "",
      "IS_STOCK_CODE": this.customerpricesettingForm.value.stockCode,
      "APPROVED_BY": this.customerpricesettingForm.value.approvedby || "",
      "GROUP1": this.customerpricesettingForm.value.group1 || "",
      "GROUP2": this.customerpricesettingForm.value.group2 || "",
      "GROUP3": this.customerpricesettingForm.value.group3 || "",
      "IS_ACTIVE": true,
      "BRANCH_CODE": this.commonService.branchCode,
      "GROUP4": this.customerpricesettingForm.value.group4 || "",
      "GROUP5": this.customerpricesettingForm.value.group5 || "",
      "GROUP6": this.customerpricesettingForm.value.group6 || "",
      "CURRENCY_CODE": this.customerpricesettingForm.value.currency || "",
      "CURRENCY_RATE": 0,
      "IS_DESIGN_CODE": this.customerpricesettingForm.value.designCode,
      "customerVendorPriceSettmtlDetail": [
        {
          "SRNO": 0,
          "UNIQUE_ID": 0,
          "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
          "DESCRIPTION": this.customerpricesettingForm.value.description || "",
          "DIVISION_CODE": this.customerpricesettingForm.value.division,
          "SEARCH_CRITERIA": "",
          "SEARCH_VALUE": "",
          "GROUP1": this.customerpricesettingForm.value.group1 || "",
          "GROUP2": this.customerpricesettingForm.value.group2 || "",
          "GROUP3": this.customerpricesettingForm.value.group3 || "",
          "UNITCODE": "",
          "STD_MKG_RATE": 0,
          "MKG_RATE_MIN": 0,
          "MKG_RATE_MAX": 0,
          "VARIANCE": 0,
          "WASTAGE_PER": 0,
          "MIN_WASTAGE_QTY": 0,
          "MARKUP_PER": 0,
          "APPLY_ON_WEIGHT": true,
          "IS_STOCK_CODE": true,
          "BRANCH_CODE": "",
          "GROUP4": this.customerpricesettingForm.value.group4 || "",
          "GROUP5": this.customerpricesettingForm.value.group5 || "",
          "GROUP6": this.customerpricesettingForm.value.group6 || "",
          "STAMP_CHARGE": 0,
          "RATI_PER": 0
        }
      ],
      "customerVendorPricePurityDet": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "",
          "KARAT_CODE": "",
          "STD_PURITY": 0,
          "SALE_PURITY": 0,
          "PURC_PURITY": 0
        }
      ],
      "customerVendorPriceWtrangeDet": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "",
          "DIVISION_CODE": "",
          "WT_RANGE_FROM": 0,
          "WT_RANGE_TO": 0,
          "STD_MKGRATE": 0,
          "SRCH_CRITERIA": "",
          "SRCH_VALUE": "",
          "UNIT_CODE": ""
        }
      ]
    }

    let Sub: Subscription = this.suntechApi.postDynamicAPI(API, postData)
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
  update() {
    // if (this.customerpricesettingForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'CustomerVendorPriceSettmtl/UpdateCustomerVendorPrice/' + this.content.PRICE_CODE
    let postData =
    {
      "MID": 0,
      "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
      "DESCRIPTION": this.customerpricesettingForm.value.description || "",
      "DIVISION": this.customerpricesettingForm.value.division,
      "CREATED_DATE": this.customerpricesettingForm.value.date || "",
      "ENTERED_BY": this.customerpricesettingForm.value.enteredby || "",
      "IS_STOCK_CODE": this.customerpricesettingForm.value.stockCode,
      "APPROVED_BY": this.customerpricesettingForm.value.approvedby || "",
      "GROUP1": this.customerpricesettingForm.value.group1 || "",
      "GROUP2": this.customerpricesettingForm.value.group2 || "",
      "GROUP3": this.customerpricesettingForm.value.group3 || "",
      "IS_ACTIVE": true,
      "BRANCH_CODE": this.commonService.branchCode,
      "GROUP4": this.customerpricesettingForm.value.group4 || "",
      "GROUP5": this.customerpricesettingForm.value.group5 || "",
      "GROUP6": this.customerpricesettingForm.value.group6 || "",
      "CURRENCY_CODE": this.customerpricesettingForm.value.currency || "",
      "CURRENCY_RATE": 0,
      "IS_DESIGN_CODE": this.customerpricesettingForm.value.designCode,
      "customerVendorPriceSettmtlDetail": [
        {
          "SRNO": 0,
          "UNIQUE_ID": 0,
          "PRICE_CODE": this.customerpricesettingForm.value.pricecode || "",
          "DESCRIPTION": this.customerpricesettingForm.value.description || "",
          "DIVISION_CODE": this.customerpricesettingForm.value.division,
          "SEARCH_CRITERIA": "",
          "SEARCH_VALUE": "",
          "GROUP1": this.customerpricesettingForm.value.group1 || "",
          "GROUP2": this.customerpricesettingForm.value.group2 || "",
          "GROUP3": this.customerpricesettingForm.value.group3 || "",
          "UNITCODE": "",
          "STD_MKG_RATE": 0,
          "MKG_RATE_MIN": 0,
          "MKG_RATE_MAX": 0,
          "VARIANCE": 0,
          "WASTAGE_PER": 0,
          "MIN_WASTAGE_QTY": 0,
          "MARKUP_PER": 0,
          "APPLY_ON_WEIGHT": true,
          "IS_STOCK_CODE": true,
          "BRANCH_CODE": "",
          "GROUP4": this.customerpricesettingForm.value.group4 || "",
          "GROUP5": this.customerpricesettingForm.value.group5 || "",
          "GROUP6": this.customerpricesettingForm.value.group6 || "",
          "STAMP_CHARGE": 0,
          "RATI_PER": 0
        }
      ],
      "customerVendorPricePurityDet": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "",
          "KARAT_CODE": "",
          "STD_PURITY": 0,
          "SALE_PURITY": 0,
          "PURC_PURITY": 0
        }
      ],
      "customerVendorPriceWtrangeDet": [
        {
          "SR_NO": 0,
          "UNIQUEID": 0,
          "UNIQUE_ITEM_ID": 0,
          "PRICE_CODE": "",
          "DIVISION_CODE": "",
          "WT_RANGE_FROM": 0,
          "WT_RANGE_TO": 0,
          "STD_MKGRATE": 0,
          "SRCH_CRITERIA": "",
          "SRCH_VALUE": "",
          "UNIT_CODE": ""
        }
      ]
    }
    let Sub: Subscription = this.suntechApi.putDynamicAPI(API, postData)
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
        let API = 'CustomerVendorPriceSettmtl/DeleteCustomerVendorPrice/' + this.content.PRICE_CODE
        let Sub: Subscription = this.suntechApi.deleteDynamicAPI(API)
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


  // onSelectionChange(selectedValue: any, groupName: string) {
  //   const formValue = this.customerpricesettingForm.value;


  //   for (let groupKey in formValue) {
  //     if (groupKey !== groupName && formValue[groupKey] === selectedValue) {

  //       if (selectedValue !== null) {
  //         this.toastr.error('The same value cannot be repeated in different groups.');

  //         this.customerpricesettingForm.get(groupName)?.setValue(null);
  //         return; 
  //       }
  //     }
  //   }
  // }

  onSelectionChange(selectedValue: any, groupName: string) {
    const formValue = this.customerpricesettingForm.value;

    for (let groupKey in formValue) {
      if (groupKey !== groupName && formValue[groupKey] === selectedValue && selectedValue !== 'None') {
        // Check if the value is repeated in a different group and is not 'None'
        this.toastr.error('The same value cannot be repeated in different groups.');
        this.customerpricesettingForm.get(groupName)?.setValue(null);
        return;
      }
    }
  }


}
