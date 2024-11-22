import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';



@Component({
  selector: 'app-customer-price-master',
  templateUrl: './customer-price-master.component.html',
  styleUrls: ['./customer-price-master.component.scss']
})
export class CustomerPriceMasterComponent implements OnInit {
  @ViewChild('overlaycodeSearch') overlaycodeSearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;

  viewMode: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  checkBoxesMode: string;
  divisionMS: any = 'ID';
  columnheader: any[] = ['PRICE_CODE', 'SIEVE', 'SIEVE_TO', 'SIEVE_SET', 'SHAPE', 'COLOR',
    'CLARITY', 'SIZE_FROM', 'SIZE_TO', , 'WEIGHT_FROM', 'WEIGHT_TO', 'CARAT_WT',
    'CURRANCY', 'ISSUE_RATE', 'SELLING_RATE', 'SELLING_PER'];

  columnheader1: any[] = [{ title: 'LABOUR_CODE', field: 'CODE' },
  { title: 'DIVISION_CODE', field: 'DIVISION_CODE' },
  { title: 'SHAPE', field: 'SHAPE' },
  { title: 'DIVISION', field: 'DIVISION' },
  { title: 'METHOD', field: 'METHOD' },
  { title: 'UNITCODE', field: 'UNITCODE' },
  { title: 'CARATWT_FROM', field: 'CARATWT_FROM' },
  { title: 'CARATWT_TO', field: 'CARATWT_TO' },
  { title: 'CURRENCY_CODE', field: 'CURRENCYCODE' },
  { title: 'CRACCODE', field: 'CRACCODE' },
  { title: 'COST_RATE', field: 'COST_RATE' },
  { title: 'SELLING_RATE', field: 'SELLING_RATE' },
  ];
  columnheader2: any[] = ['DESIGN_CODE', 'LABOUR_CODE', 'LABTYPE', 'METHOD', 'DIVISION', 'CURRENCY_CODE', 'UNITCODE', 'COST_RATE', 'SELLING_PER', 'CRACCODE', 'DIVISION_CODE', 'SELLING_RATE', 'CUSTOMER_CODE', 'REFMID', 'DT_VALID_FROM'];
  subscriptions: any = [];
  @Input() content!: any;
  tableData: any[] = [];
  tableDatalabour: any[] = [];
  tableDatastone: any[] = [];
  designChanges: any[] = [];
  currentDate: any = this.commonService.currentDate;
  value: any;
  rateInput: any;
  text = "Deduct";
  myNumber: any;
  allMode: string;
  selectedKeys: any[] = [];
  dele: boolean = false;
  isDisableSaveBtn: boolean = false;

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "account_mode in ('B','R','P')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerpricemasterForm: FormGroup = this.formBuilder.group({
    customercode: ['', [Validators.required]],
    desc: [''],
    pricecode: ['', [Validators.required]],
    labourtype: [''],
    addonrate: [''],
    margin: [''],
    markup: [''],
    metal_loss: [''],
    date: [new Date(), ''],
    text: [''],
    changePrice: [''],
    CURRENCY_CODE: [''],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    MAIN_VOCTYPE: [''],
    CURRENCY_RATE: [0],
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.dele = true;
    this.renderer.selectRootElement('#customercode')?.focus();
    this.setInitialValues()
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true
        this.editMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editableMode = true;
        this.editMode = true;
        this.dele = false;
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
    this.stonepricing();
    this.labourcharge();
    this.designcharge();
    //  this.getStonePriceData()
    //  this.getLabourChargeMasterList()
  }

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  setInitialValues() {
    this.customerpricemasterForm.controls.date.setValue(this.commonService.currentDate)
    this.customerpricemasterForm.controls.MAIN_VOCTYPE.setValue(this.commonService.getqueryParamMainVocType())
    this.customerpricemasterForm.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    this.customerpricemasterForm.controls.YEARMONTH.setValue(this.commonService.yearSelected)
    this.setCompanyCurrency()
  }
  setCompanyCurrency() {
    this.customerpricemasterForm.controls.CURRENCY_CODE.setValue(this.commonService.compCurrency)
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.commonService.compCurrency);
    this.customerpricemasterForm.controls.CURRENCY_RATE.setValue(
      this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
    );
  }
  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  stonepricing() {

    //this.customerpricemasterForm.controls.priceScheme.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "097",
      "parameter": {
        "strCode": this.customerpricemasterForm.value.customercode,
        "strType": 'STON',
        "strVocDate ": this.customerpricemasterForm.value.date,
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.tableDatastone = result.dynamicData[0] || []
          if (this.tableDatastone?.length > 0) {
            // this.fillPriceSchemeDetails()
          } else {
            this.commonService.toastErrorByMsgId('MSG2267')//Grid fields not found
          }

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')// Server Error
      })
    this.subscriptions.push(Sub)
  }


  labourcharge() {
    //this.customerpricemasterForm.controls.priceScheme.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "097",
      "parameter": {
        "strCode": this.customerpricemasterForm.value.customercode,
        "strType": 'LABO',
        "strVocDate ": this.customerpricemasterForm.value.date,
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {

          this.tableDatalabour = result.dynamicData[0] || []
          if (this.tableDatalabour?.length > 0) {
            console.log(result.dynamicData[0]);
            // this.fillPriceSchemeDetails()
          } else {
            this.commonService.toastErrorByMsgId('MSG2267')//Grid fields not found
          }

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')// Server Error
      })
    this.subscriptions.push(Sub)
  }

  designcharge() {

    //this.customerpricemasterForm.controls.priceScheme.setValue(e.PRICE_CODE)
    let postData = {
      "SPID": "097",
      "parameter": {
        "strCode": this.customerpricemasterForm.value.customercode,
        "strType": 'DESN',
        "strVocDate ": this.customerpricemasterForm.value.date,
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          this.designChanges = result.dynamicData[0] || []
          if (this.designChanges?.length > 0) {
            // this.fillPriceSchemeDetails()
          } else {
            this.commonService.toastErrorByMsgId('MSG2267')//Grid fields not found
          }

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')// Server Error
      })
    this.subscriptions.push(Sub)
  }


  getLabourChargeMasterList() {
    // this.commonService.toastSuccessByMsgId('MSG81447');
    let API1 = 'LabourChargeMasterDj/GetLabourChargeMasterList'
    let Sub1: Subscription = this.dataService.getDynamicAPI(API1)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response;
          data.forEach((item: any, i: any) => {
            item.SELECT1 = false
            item.SRNO = i + 1;
          });
          this.tableDatalabour = data
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
  }

  getStonePriceData() {
    this.commonService.toastSuccessByMsgId('MSG81447');
    let API = 'StonePriceMasterDJ/GetStonePriceMasterList'
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response;
          data.forEach((item: any, i: any) => {
            item.SELECT1 = false
            item.SRNO = i + 1;
            item.SELLING_PER = item.SELLING_PER + "%";
          });
          this.tableDatastone = data;

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })

  }


  selectRow(rowKey: any) {
    if (!this.selectedKeys.includes(rowKey)) {
      this.selectedKeys.push(rowKey); // Add the row key to the selected keys array
    }
  }
  
  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
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

  //   onInput(event: Event): void {
  //     const inputValue = (event.target as HTMLInputElement).value;

  //     // Remove any non-digit characters except for the first decimal point
  //     const sanitizedValue = inputValue.replace(/[^0-9.]/g, '');

  //     // Extract the integer part and the decimal part
  //     const parts = sanitizedValue.split('.');
  //     let integerPart = parts[0];
  //     const decimalPart = parts[1] || '';

  //     // Take only the first 3 characters for the integer part
  //     integerPart = integerPart.slice(0, 3);

  //     // Combine integer part and decimal part
  //     let limitedValue = integerPart;
  //     if (decimalPart.length > 0) {
  //         limitedValue += '.' + decimalPart.slice(0, 3 - integerPart.length);
  //     }

  //     // Update the input value
  //     (event.target as HTMLInputElement).value = limitedValue;
  // }

  labourTypeList = [
    // {
    //   name: 'MAKING',
    //   value: 'MAKING'
    // },
    {
      name: 'SETTING',
      value: 'SETTING'
    },
    {
      name: 'POLISH',
      value: 'POLISH'
    },
    {
      name: 'FINISHING',
      value: 'FINISHING'
    },
    {
      name: 'CASTING',
      value: 'CASTING'
    },
    {
      name: 'GENERAL',
      value: 'GENERAL'
    },
    {
      name: 'RHODIUM',
      value: 'RHOODIUM'
    },
    // {
    //   name: 'STAMPING',
    //   value: 'STAMPING'
    // },
    // {
    //   name: 'WASTAGE',
    //   value: 'WASTAGE'
    // },
  ];

  formatNumber(): void {
    let numericValue = parseFloat(this.myNumber.replace(/,/g, '.'));

    // Check if the parsed numeric value is not NaN
    if (!isNaN(numericValue)) {
      // Format the numeric value with commas as thousands separators
      let formattedValue = numericValue.toLocaleString();
      this.myNumber = formattedValue;
    } else {
      // If the parsed value is NaN, set the input value to an empty string
      this.myNumber = '';
    }
  }

  change(event: any) {
    console.log(event);
    this.text = event.target.checked ? "Add" : "Deduct";
  }


  customerCodeScpSelected(e: any) {
    console.log(e);
    this.customerpricemasterForm.controls.customercode.setValue(e.ACCODE);
    this.customerpricemasterForm.controls.desc.setValue(e.ACCOUNT_HEAD);
  }

  setFormValues() {
    if (!this.content) return
    this.customerpricemasterForm.controls.customercode.setValue(this.content.CUSTOMER_CODE)
    this.customerpricemasterForm.controls.desc.setValue(this.content.DESCRIPTION)
    this.customerpricemasterForm.controls.metal_loss.setValue(this.content.GOLD_LOSS_PER)
    this.customerpricemasterForm.controls.pricecode.setValue(this.content.PRICECODE)
    this.customerpricemasterForm.controls.margin.setValue(this.content.MARGIN_PER)
    this.customerpricemasterForm.controls.labourtype.setValue(this.content.LAB_TYPE)
    this.customerpricemasterForm.controls.markup.setValue(this.content.MARKUP_PER)
    this.customerpricemasterForm.controls.text.setValue(this.content.CUSTOMER_NAME)
    this.customerpricemasterForm.controls.date.setValue(this.content.VALID_FROM)
    this.customerpricemasterForm.controls.addonrate.setValue(this.content.ADD_ON_RATE)
    this.customerpricemasterForm.controls.CURRENCY_CODE.setValue(this.content.CURRENCY_CODE)
    this.customerpricemasterForm.controls.MAIN_VOCTYPE.setValue(this.content.MAIN_VOCTYPE)
    this.customerpricemasterForm.controls.CURRENCY_RATE.setValue(
      this.commonService.decimalQuantityFormat(this.content.CURRENCY_RATE, 'RATE')
    );
  }
  /**use: checkbox change */
  changedCheckbox(event: any) {
    this.tableData[event.data.SRNO - 1].SELECT1 = !event.data.SELECT1;
  }
  setCustomerPriceDetails() {
    console.log(this.tableDatastone, 'tableDatastone')


    let selectedPriceDetailData = this.tableDatastone.filter((item: any) => item.SELECT1 == true)
    console.log(selectedPriceDetailData, 'selectedPriceDetailData')
    let data: any[] = []
    selectedPriceDetailData.forEach(element => {
      data.push({
        "REFMID": element.MID,
        "CUSTOMER_CODE": "",
        "PRICE_CODE": "",
        "DESCRIPTION": "",
        "SHAPE": "",
        "COLOR": "",
        "CLARITY": "",
        "SIZE_FROM": "",
        "SIZE_TO": "",
        "CURRENCYCODE": "",
        "ISSUE_RATE": 0,
        "SELLING_RATE": 0,
        "UPDATE_ON": "2023-11-28T05:47:14.178Z",
        "CARAT_WT": 0,
        "SIEVE": "",
        "SELLING_PER": 0,
        "UNITCODE": "",
        "LABTYPE": "",
        "METHOD": "",
        "DIVISION": "",
        "CRACCODE": "",
        "COST_RATE": 0,
        "CARATWT_FROM": 0,
        "CARATWT_TO": 0,
        "ACCESSORIES": 0,
        "PRICE_TYPE": 0,
        "SIEVE_SET": "",
        "WEIGHT_FROM": 0,
        "WEIGHT_TO": 0,
        "SIEVE_TO": "",
        "CUSTOMER_NAME": "",
        "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
        "PRICECODE": "",
        "SRNO": 0
      })
    });
    return data
  }
  setPostData(form: any) {
    return {
      "MID": 0,
      "CUSTOMER_CODE": form.customercode,
      "DESCRIPTION": form.customercode + " " + form.pricecode,
      "GOLD_LOSS_PER": this.commonService.emptyToZero(form.metal_loss),
      "UPDATE_ON": this.commonService.formatDateTime(this.currentDate),
      "PRICECODE": form.pricecode,
      "MARGIN_PER": this.commonService.emptyToZero(form.margin),
      "LAB_TYPE": this.commonService.nullToString(form.labourtype),
      "MARKUP_PER": this.commonService.emptyToZero(form.markup),
      "CUSTOMER_NAME": form.desc,
      "PRINT_COUNT": 0,
      "VALID_FROM": form.date,
      "ADD_ON_RATE": this.commonService.emptyToZero(form.addonrate),
      "CURRENCY_CODE": this.commonService.nullToString(form.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(form.CURRENCY_RATE),
      "MAIN_VOCTYPE": this.commonService.nullToString(form.MAIN_VOCTYPE),
      "CUSTOMER_PRICE_DET": this.setCustomerPriceDetails(),
      "CUSTOMER_LABCHRG_DET": [
        {
          "REFMID": 0,
          "CUSTOMER_CODE": "",
          "LABOUR_CODE": "",
          "LABTYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "CURRENCYCODE": "",
          "UNITCODE": "",
          "COST_RATE": 0,
          "SELLING_RATE": 0,
          "LAST_UPDATE": "2023-11-28T05:47:14.178Z",
          "CRACCODE": "",
          "ACCESSORIES": 0,
          "DIVISION_CODE": "",
          "SELLING_PER": 0,
          "CARATWT_FROM": 0,
          "CARATWT_TO": 0,
          "SIEVE": "",
          "DT_VALID_FROM": "2023-11-28T05:47:14.178Z",
          "PRICECODE": "",
          "SRNO": 0,
          "PROCESS_TYPE": ""
        }
      ],
      "CUSTOMER_PRICE_ACCOUNT_DET": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "PRICECODE": "",
          "ACCODE": "",
          "ACCOUNT_HEAD": "",
          "CALC_ON_GROSS": true
        }
      ]
    }
  }



  submitValidations(form: any) {
    if (this.commonService.nullToString(form.customercode) == '' ) {
      this.commonService.toastErrorByMsgId('MSG7822')//"customercode cannot be empty" MSG7822 
      return true
    }
    else if (this.commonService.nullToString(form.pricecode) == '') {
      this.commonService.toastErrorByMsgId('MSG1660') //"pricecode cannot be empty"
      console.log( this.commonService.toastErrorByMsgId); 
      return true
    }

    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    if (this.submitValidations(this.customerpricemasterForm.value)) return;

    let API = 'CustomerPriceMaster/InsertCustomerPriceMaster'
    let postData = this.setPostData(this.customerpricemasterForm.value)
    console.log(postData, 'postDatapostData');


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
          this.toastr.error('MSG2272')//Error occured, please try again
        }
      }, err => alert(err))
    // this.subscriptions.push(Sub)
  }

  update() {

    if (this.submitValidations(this.customerpricemasterForm.value)) return;

    let API = 'CustomerPriceMaster/UpdateCustomerPriceMaster/' + this.content.PRICECODE
    let postData = this.setPostData(this.customerpricemasterForm.value)

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
          this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'CustomerPriceMaster/DeleteCustomerPriceMaster/' + this.content.PRICECODE
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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }


  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    const inputValue = event.target.value.toUpperCase();
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.customerpricemasterForm.controls[FORMNAME].setValue('')
          this.customerpricemasterForm.controls.desc.setValue('');
          this.renderer.selectRootElement(FORMNAME).focus();
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   const inputValue = event.target.value.toUpperCase();
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.commonService.showSnackBarMsg('MSG81447');
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       this.commonService.closeSnackBarMsg()
  //       this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.customerpricemasterForm.controls[FORMNAME].setValue('')
  //         this.customerpricemasterForm.controls.desc.setValue('');
  //         // this.jobCardFrom.controls.designtype.setValue('');
  //         this.renderer.selectRootElement(FORMNAME).focus();
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }



  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'customercode') {
  //     this.overlaycodeSearch.showOverlayPanel(event)
  //   }
  // }
  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'customercode':
        this.overlaycodeSearch.showOverlayPanel(event);
        break;
      default:
    }
  }


}
