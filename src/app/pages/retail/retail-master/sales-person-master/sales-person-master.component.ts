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
  selector: 'app-sales-person-master',
  templateUrl: './sales-person-master.component.html',
  styleUrls: ['./sales-person-master.component.scss']
})
export class SalesPersonMasterComponent implements OnInit {
  divisionMS: any = 'ID';
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  editableMode: boolean = false;
  viewMode: boolean = false;
  userbranch = localStorage.getItem('userbranch');
  editMode:boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

 
  ngOnInit(): void {
    // this.setCompanyCurrency()
    this.setFormValues()
    // this.setCompanyCurrency()
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true
  
    } else if (this.content.FLAG == 'EDIT') {
      this.editableMode = true;
      this.editMode = true
    }
    else if (this.content.FLAG == 'DELETE') {
      this.viewMode = true;
      this.deleteMetalPrefix()
    }
  }
  
  salesPersonForm: FormGroup = this.formBuilder.group({
    code: [''],
    prefixcodedes: ['',[Validators.required]],
    currencyRate: ['',[Validators.required]],
    currency: [''],
    lastno: ['000000', ''],
    costcode: ['',[Validators.required]],
    brand: [''],
    branch: [''],
    Category:[''],
    subCategory:[''],
    Country:[''],
    Type:[''],
    suffixcode: [''],
    hsn: [''],
    jobcardprefix:false,
    setrefprefix: false,
    Componentprefix: false,
    refinervprefix: false,
    designprefix: false,
    userdefined_1: [''],
    userdefined_2: [''],
    userdefined_3: [''],
    userdefined_4: [''],
    userdefined_5: [''],
    userdefined_6: [''],
    userdefined_7: [''],
    userdefined_8: [''],
    userdefined_9: [''],
    userdefined_10: [''],
    userdefined_11: [''],
    userdefined_12: [''],
    userdefined_13: [''],
    userdefined_14: [''],
    userdefined_15: [''],
    currencydes:[''],
    boilProcessPrefix: false,
  })

  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.salesPersonForm.controls.prefixcode.setValue(this.content.PREFIX_CODE)
    this.salesPersonForm.controls.prefixcodedes.setValue(this.content.DESCRIPTION)
    this.salesPersonForm.controls.lastno.setValue(this.content.LAST_NO)
    this.salesPersonForm.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.salesPersonForm.controls.currencyRate.setValue(this.content.CONV_RATE)
    this.salesPersonForm.controls.refinervprefix.setValue(this.viewchangeYorN(this.content.REFINE_PREFIX))
    this.salesPersonForm.controls.setrefprefix.setValue(this.viewchangeYorN(this.content.SETREF_PREFIX))
    this.salesPersonForm.controls.jobcardprefix.setValue(this.viewchangeYorN(this.content.JOB_PREFIX))
    this.salesPersonForm.controls.designprefix.setValue(this.viewchangeYorN(this.content.DESIGN_PREFIX))
    this.salesPersonForm.controls.Componentprefix.setValue(this.viewchangeYorN(this.content.COMP_PREFIX))
    this.salesPersonForm.controls.branch.setValue(this.content.BRANCH_CODE)
    //this.salesPersonForm.controls.suffixcode.setValue(this.content.SCHEME_PREFIX)
    this.salesPersonForm.controls.Country.setValue(this.content.COUNTRY_CODE)
    this.salesPersonForm.controls.subCategory.setValue(this.content.SUBCATEGORY_CODE)
    this.salesPersonForm.controls.Type.setValue(this.content.TYPE_CODE)
    this.salesPersonForm.controls.Category.setValue(this.content.CATEGORY_CODE)
    this.salesPersonForm.controls.brand.setValue(this.content.BRAND_CODE)
    this.salesPersonForm.controls.costcode.setValue(this.content.COUNTRY_CODE)
    this.salesPersonForm.controls.hsn.setValue(this.content.HSN_CODE)
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.salesPersonForm.controls.currency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
    this.salesPersonForm.controls.currencyRate.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
  }

  BranchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.branch.setValue(e.BRANCH_CODE);
  }

  HSNCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'HSN',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  HSNCenterSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.hsn.setValue(e.CODE);
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
    this.salesPersonForm.controls.currency.setValue(e.CURRENCY_CODE);
    this.salesPersonForm.controls.currencyRate.setValue(e.CONV_RATE);
  }
  costCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost type',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCodeSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.costcode.setValue(e.COST_CODE);
  }
  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  categoryCodeSelected(e: any) {
    this.salesPersonForm.controls.Category.setValue(e.CODE);
  }
  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 31,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  subcategoryCodeSelected(e: any) {
    this.salesPersonForm.controls.subCategory.setValue(e.CODE);
  }
  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  typeCodeSelected(e: any) {
    this.salesPersonForm.controls.Type.setValue(e.CODE);
  }
  BrandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER' AND DIV_Y=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  brandCodeSelected(e: any) {
    this.salesPersonForm.controls.brand.setValue(e.CODE);
  }
  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e: any) {
    console.log(e);
    this.salesPersonForm.controls.Country.setValue(e.CODE);
  }
  toggleViewMode(): void {
    this.viewMode = !this.viewMode;
    if (this.viewMode) {
      this.salesPersonForm.controls.jobcardprefix.disable();
    } else {
      this.salesPersonForm.controls.jobcardprefix.enable();
    }
  }
  viewchangeYorN(e: any) {
    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }
  onchangeCheckBox(e: any) {
    if (e == true) {
      return true;
    } else {
      return false;
    }
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  setPostData(){
    return{
    "PREFIX_CODE": this.salesPersonForm.value.prefixcode?.toUpperCase(),
    "DESCRIPTION": this.salesPersonForm.value.prefixcodedes?.toUpperCase(),
    "LAST_NO": this.commonService.nullToString(this.salesPersonForm.value.lastno),
    "CURRENCY_CODE": this.commonService.nullToString(this.salesPersonForm.value.currency),
    "CONV_RATE": this.commonService.emptyToZero(this.salesPersonForm.value.currencyRate),
    "COST_CODE": this.commonService.nullToString(this.salesPersonForm.value.costcode),
    "CATEGORY_CODE":this.commonService.nullToString(this.salesPersonForm.value.Category),
    "SUBCATEGORY_CODE":this.commonService.nullToString(this.salesPersonForm.value.subCategory),
    "BRAND_CODE":this.commonService.nullToString(this.salesPersonForm.value.brand),
    "TYPE_CODE": this.commonService.nullToString(this.salesPersonForm.value.Type),
    "COUNTRY_CODE":this.commonService.nullToString(this.salesPersonForm.value.Country),
    "MID":this.content?.MID || 0,
    "DIVISION": "S",
    "SYSTEM_DATE": "2023-11-28T08:50:38.675Z",
    "PM_BRANCHCODE": "",
    "JOB_PREFIX": this.onchangeCheckBox(this.salesPersonForm.value.jobcardprefix),
    "SETREF_PREFIX": this.onchangeCheckBox(this.salesPersonForm.value.setrefprefix),
    "BRANCH_CODE": this.commonService.branchCode,
    "BOIL_PREFIX": true,
    "SCHEME_PREFIX": true,
    "UDF1": this.salesPersonForm.value.userdefined_1 || "",
    "UDF2": this.salesPersonForm.value.userdefined_2 || "",
    "UDF3": this.salesPersonForm.value.userdefined_3 || "",
    "UDF4": this.salesPersonForm.value.userdefined_4 || "",
    "UDF5": this.salesPersonForm.value.userdefined_5 || "",
    "UDF6": this.salesPersonForm.value.userdefined_6 || "",
    "UDF7": this.salesPersonForm.value.userdefined_7 || "",
    "UDF8": this.salesPersonForm.value.userdefined_8 || "",
    "UDF9": this.salesPersonForm.value.userdefined_9 || "",
    "UDF10": this.salesPersonForm.value.userdefined_10 || "",
    "UDF11": this.salesPersonForm.value.userdefined_11 || "",
    "UDF12": this.salesPersonForm.value.userdefined_12 || "",
    "UDF13": this.salesPersonForm.value.userdefined_13 || "",
    "UDF14": this.salesPersonForm.value.userdefined_14 || "",
    "UDF15": this.salesPersonForm.value.userdefined_15 || "",
    "TAG_WT": 0,
    "COMP_PREFIX": this.onchangeCheckBox(this.salesPersonForm.value.Componentprefix),
    "DESIGN_PREFIX": this.onchangeCheckBox(this.salesPersonForm.value.designprefix),
    "REFINE_PREFIX": this.onchangeCheckBox(this.salesPersonForm.value.refinervprefix),
    "SUBLEDGER_PREFIX": true,
    "SUFFIX_CODE": this.salesPersonForm.value.suffixcode || "",
    "HSN_CODE": this.salesPersonForm.value.hsn || "",
  }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.salesPersonForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'PrefixMaster/InsertPrefixMaster'
    let postData = this.setPostData()

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
                this.salesPersonForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.showErrorDialog('Code Already Exists')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
 
  update() {
    if (this.salesPersonForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.salesPersonForm.value.prefixcode
    let postData = this.setPostData()
  
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
                this.salesPersonForm.reset()
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
  deleteMetalPrefix() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'PrefixMaster/DeletePrefixMaster/' + this.salesPersonForm.value.prefixcode
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
                    this.salesPersonForm.reset()
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
                    this.salesPersonForm.reset()
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
  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      // this.afterSave(result.value)
    });
  }

}

