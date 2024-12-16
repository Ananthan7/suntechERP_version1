import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-diamond-prefix-master',
  templateUrl: './diamond-prefix-master.component.html',
  styleUrls: ['./diamond-prefix-master.component.scss']
})
export class DiamondPrefixMasterComponent implements OnInit {
  divisionMS: any = 'ID';
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  editableMode: boolean = false;
  viewMode: boolean = false;
  userbranch = localStorage.getItem('userbranch');
  editMode: boolean = false;
  codeEnable: boolean = false;




  @ViewChild('currencycodeSearch') currencycodeSearch!: MasterSearchComponent;
  @ViewChild('costcodeSearch') costcodeSearch!: MasterSearchComponent;
  @ViewChild('brandcodeSearch') brandcodeSearch!: MasterSearchComponent;
  @ViewChild('CategorycodeSearch') CategorycodeSearch!: MasterSearchComponent;
  @ViewChild('TypecodeSearch') TypecodeSearch!: MasterSearchComponent;
  @ViewChild('subCategorycodeSearch') subCategorycodeSearch!: MasterSearchComponent;
  @ViewChild('CountrycodeSearch') CountrycodeSearch!: MasterSearchComponent;
  @ViewChild('branchcodeSearch') branchcodeSearch!: MasterSearchComponent;








  @ViewChild('collectioncodeSearch') collectioncodeSearch!: MasterSearchComponent;
  @ViewChild('sub_collectioncodeSearch') sub_collectioncodeSearch!: MasterSearchComponent;
  @ViewChild('stone_typecodeSearch') stone_typecodeSearch!: MasterSearchComponent;
  @ViewChild('settingcodeSearch') settingcodeSearch!: MasterSearchComponent;
  @ViewChild('shapecodeSearch') shapecodeSearch!: MasterSearchComponent;
  @ViewChild('inc_catcodeSearch') inc_catcodeSearch!: MasterSearchComponent;
  @ViewChild('order_refcodeSearch') order_refcodeSearch!: MasterSearchComponent;
  lastValidValue!: string;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }


  ngOnInit(): void {
    // this.setCompanyCurrency()

    this.setFormValues()
    this.codeEnable = true;

    // this.setCompanyCurrency()
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true

    } else if (this.content.FLAG == 'EDIT') {
      this.editableMode = true;
      this.editMode = true
      this.codeEnable = false;

    }
    else if (this.content.FLAG == 'DELETE') {
      this.viewMode = true;
      this.deleteMetalPrefix()
    }
  }

  diamondprefixForm: FormGroup = this.formBuilder.group({
    prefixcode: ['', [Validators.required]],
    prefixcodedes: [''],
    currencyRate: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    lastno: ['000000', ''],
    costcode: ['', [Validators.required]],
    brand: [''],
    branch: [''],
    Category: [''],
    subCategory: [''],
    Country: [''],
    Type: [''],
    suffixcode: [''],
    hsn: [''],
    jobcardprefix: false,
    setrefprefix: false,
    Componentprefix: false,
    refinervprefix: false,
    designprefix: false,
    collection: [""],
    sub_collection: [""],
    stone_type: [""],
    setting: [""],
    shape: [""],
    inc_cat: [""],
    order_ref: [""],
    currencydes: [''],
    boilProcessPrefix: false,
  })

  setFormValues() {
    console.log(this.content);
    if (!this.content) return
    this.diamondprefixForm.controls.prefixcode.setValue(this.content.PREFIX_CODE)
    this.diamondprefixForm.controls.prefixcodedes.setValue(this.content.DESCRIPTION)
    this.diamondprefixForm.controls.lastno.setValue(this.content.LAST_NO)
    this.diamondprefixForm.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.diamondprefixForm.controls.currencyRate.setValue(this.commonService.transformDecimalVB(
      this.commonService.allCompanyParameters?.MRATEDECIMALS, this.content.CONV_RATE))
    this.diamondprefixForm.controls.refinervprefix.setValue(this.viewchangeYorN(this.content.REFINE_PREFIX))
    this.diamondprefixForm.controls.setrefprefix.setValue(this.viewchangeYorN(this.content.SETREF_PREFIX))
    this.diamondprefixForm.controls.jobcardprefix.setValue(this.viewchangeYorN(this.content.JOB_PREFIX))
    this.diamondprefixForm.controls.designprefix.setValue(this.viewchangeYorN(this.content.DESIGN_PREFIX))
    this.diamondprefixForm.controls.Componentprefix.setValue(this.viewchangeYorN(this.content.COMP_PREFIX))
    this.diamondprefixForm.controls.branch.setValue(this.content.BRANCH_CODE)
    this.diamondprefixForm.controls.suffixcode.setValue(this.content.SUFFIX_CODE)
    this.diamondprefixForm.controls.Country.setValue(this.content.COUNTRY_CODE)
    this.diamondprefixForm.controls.subCategory.setValue(this.content.SUBCATEGORY_CODE)
    this.diamondprefixForm.controls.Type.setValue(this.content.TYPE_CODE)
    this.diamondprefixForm.controls.Category.setValue(this.content.CATEGORY_CODE)
    this.diamondprefixForm.controls.brand.setValue(this.content.BRAND_CODE)
    this.diamondprefixForm.controls.costcode.setValue(this.content.COST_CODE)
    this.diamondprefixForm.controls.hsn.setValue(this.content.HSN_CODE)
    this.diamondprefixForm.controls.boilProcessPrefix.setValue(this.viewchangeYorN(this.content.BOIL_PREFIX))
    this.diamondprefixForm.controls.collection.setValue(this.content.UDF1)
    this.diamondprefixForm.controls.sub_collection.setValue(this.content.UDF2)
    this.diamondprefixForm.controls.stone_type.setValue(this.content.UDF3)
    this.diamondprefixForm.controls.setting.setValue(this.content.UDF4)
    this.diamondprefixForm.controls.shape.setValue(this.content.UDF5)
    this.diamondprefixForm.controls.inc_cat.setValue(this.content.UDF6)
    this.diamondprefixForm.controls.order_ref.setValue(this.content.UDF7)
  }
  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.diamondprefixForm.controls.currency.setValue(CURRENCY_CODE);
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == CURRENCY_CODE);
    this.diamondprefixForm.controls.currencyRate.setValue(
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.branch.setValue(e.BRANCH_CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.hsn.setValue(e.CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.currency.setValue(e.CURRENCY_CODE);
    this.diamondprefixForm.controls.currencyRate.setValue(e.CONV_RATE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.costcode.setValue(e.COST_CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.Category.setValue(e.CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.subCategory.setValue(e.CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.Type.setValue(e.CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.brand.setValue(e.CODE);
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
    if (this.checkCode()) return

    this.diamondprefixForm.controls.Country.setValue(e.CODE);
  }


  itemcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Prefix code",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  itemcodeSelected(value: any) {
    console.log(value);
    if (this.checkCode()) return

    this.diamondprefixForm.controls.itemcode.setValue(value.PREFIX_CODE);
    this.diamondprefixForm.controls.itemcodedetail.setValue(value.DESCRIPTION)
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'STONE TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  stoneTypeCodeSelected(value: any) {
    console.log(value);
    if (this.checkCode()) return

    this.diamondprefixForm.controls.stone_type.setValue(value.CODE);
  }

  settingTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Setting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SETTING TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    //LOAD_ONCLICK:true,
  }
  settingTypeCodeSelected(e: any) {
    console.log(e);
    if (this.checkCode()) return

    this.diamondprefixForm.controls.setting.setValue(e.CODE);
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "types='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeSelected(e: any) {
    console.log(e);
    if (this.checkCode()) return

    this.diamondprefixForm.controls.setting.setValue(e.CODE);
  }


  toggleViewMode(): void {
    this.viewMode = !this.viewMode;
    if (this.viewMode) {
      this.diamondprefixForm.controls.jobcardprefix.disable();
    } else {
      this.diamondprefixForm.controls.jobcardprefix.enable();
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
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  checkCode(): boolean {
    if (this.diamondprefixForm.value.prefixcode == '') {
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
      return true
    }
    return false
  }

  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }
    // console.log('this w');

    const API = 'PrefixMaster/CheckIfPrefixCodePresent/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: 'Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.diamondprefixForm.controls.prefixcode.setValue('');
            this.renderer.selectRootElement('#code').focus();

          });
          this.commonService.toastErrorByMsgId('MSG1121')//Code Already Exists
        } else {
          this.codeEnable = false;
        }
      }, err => {
        this.diamondprefixForm.reset();

      });

    this.subscriptions.push(sub);

  }

  codeEnabledMetal() {
    if (this.diamondprefixForm.value.prefixcode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }


  setPostData() {
    return {
      "PREFIX_CODE": this.commonService.nullToString(this.diamondprefixForm.value.prefixcode?.toUpperCase()),
      "DESCRIPTION": this.commonService.nullToString(this.diamondprefixForm.value.prefixcodedes?.toUpperCase()),
      "LAST_NO": this.commonService.nullToString(this.diamondprefixForm.value.lastno),
      "CURRENCY_CODE": this.commonService.nullToString(this.diamondprefixForm.value.currency),
      "CONV_RATE": this.commonService.emptyToZero(this.diamondprefixForm.value.currencyRate),
      "COST_CODE": this.commonService.nullToString(this.diamondprefixForm.value.costcode),
      "CATEGORY_CODE": this.commonService.nullToString(this.diamondprefixForm.value.Category),
      "SUBCATEGORY_CODE": this.commonService.nullToString(this.diamondprefixForm.value.subCategory),
      "BRAND_CODE": this.commonService.nullToString(this.diamondprefixForm.value.brand),
      "TYPE_CODE": this.commonService.nullToString(this.diamondprefixForm.value.Type),
      "COUNTRY_CODE": this.commonService.nullToString(this.diamondprefixForm.value.Country),
      "MID": this.content?.MID || 0,
      "DIVISION": "S",
      "SYSTEM_DATE": "2023-11-28T08:50:38.675Z",
      "PM_BRANCHCODE": "",
      "JOB_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.jobcardprefix),
      "SETREF_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.setrefprefix),
      "BRANCH_CODE": this.commonService.nullToString(this.diamondprefixForm.value.branch),
      "BOIL_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.boilProcessPrefix),
      "SCHEME_PREFIX": true,
      "UDF1": this.commonService.nullToString(this.diamondprefixForm.value.collection),
      "UDF2": this.commonService.nullToString(this.diamondprefixForm.value.sub_collection),
      "UDF3": this.commonService.nullToString(this.diamondprefixForm.value.stone_type),
      "UDF4": this.commonService.nullToString(this.diamondprefixForm.value.setting),
      "UDF5": this.commonService.nullToString(this.diamondprefixForm.value.shape),
      "UDF6": this.commonService.nullToString(this.diamondprefixForm.value.inc_cat),
      "UDF7": this.commonService.nullToString(this.diamondprefixForm.value.order_ref),
      "UDF8": "",
      "UDF9": "",
      "UDF10": "",
      "UDF11": "",
      "UDF12": "",
      "UDF13": "",
      "UDF14": "",
      "UDF15": "",
      "TAG_WT": 0,
      "COMP_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.Componentprefix),
      "DESIGN_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.designprefix),
      "REFINE_PREFIX": this.onchangeCheckBox(this.diamondprefixForm.value.refinervprefix),
      "SUBLEDGER_PREFIX": true,
      "SUFFIX_CODE": this.commonService.nullToString(this.diamondprefixForm.value.suffixcode),
      "HSN_CODE": this.commonService.nullToString(this.diamondprefixForm.value.hsn),
    }
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.diamondprefixForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

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
                this.diamondprefixForm.reset()
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
    if (this.diamondprefixForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'PrefixMaster/UpdatePrefixMaster/' + this.diamondprefixForm.value.prefixcode
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
                this.diamondprefixForm.reset()
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
        let API = 'PrefixMaster/DeletePrefixMaster/' + this.diamondprefixForm.value.prefixcode
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
                    this.diamondprefixForm.reset()
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
                    this.diamondprefixForm.reset()
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


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {

        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.diamondprefixForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
  }


  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }


  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {


      case 'currency':
        this.currencycodeSearch.showOverlayPanel(event);
        break;
      case 'costcode':
        this.costcodeSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.brandcodeSearch.showOverlayPanel(event);
        break;
      case 'Category':
        this.CategorycodeSearch.showOverlayPanel(event);
        break;
      case 'Type':
        this.TypecodeSearch.showOverlayPanel(event);
        break;
      case 'subCategory':
        this.subCategorycodeSearch.showOverlayPanel(event);
        break;
      case 'Country':
        this.CountrycodeSearch.showOverlayPanel(event);
        break;
      case 'branch':
        this.branchcodeSearch.showOverlayPanel(event);
        break;

      case 'collection':
        this.collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'sub_collection':
        this.sub_collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'stone_type':
        this.stone_typecodeSearch.showOverlayPanel(event);
        break;
      case 'setting':
        this.settingcodeSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.shapecodeSearch.showOverlayPanel(event);
        break;
      case 'inc_catc':
        this.inc_catcodeSearch.showOverlayPanel(event);
        break;
        break;
      case 'order_ref':
        this.order_refcodeSearch.showOverlayPanel(event);
        break;


      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {

      case 'currency':
        this.currencycodeSearch.showOverlayPanel(event);
        break;
      case 'costcode':
        this.costcodeSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.brandcodeSearch.showOverlayPanel(event);
        break;
      case 'Category':
        this.CategorycodeSearch.showOverlayPanel(event);
        break;
      case 'Type':
        this.TypecodeSearch.showOverlayPanel(event);
        break;
      case 'subCategory':
        this.subCategorycodeSearch.showOverlayPanel(event);
        break;
      case 'Country':
        this.CountrycodeSearch.showOverlayPanel(event);
        break;
      case 'branch':
        this.branchcodeSearch.showOverlayPanel(event);
        break;


      case 'collection':
        this.collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'sub_collection':
        this.sub_collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'stone_type':
        this.stone_typecodeSearch.showOverlayPanel(event);
        break;
      case 'setting':
        this.settingcodeSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.shapecodeSearch.showOverlayPanel(event);
        break;
      case 'inc_catc':
        this.inc_catcodeSearch.showOverlayPanel(event);
        break;
      case 'order_ref':
        this.order_refcodeSearch.showOverlayPanel(event);
        break;


      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

  allowNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
}




}

