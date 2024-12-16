import { Component, ElementRef, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stone-pricing-master',
  templateUrl: './stone-pricing-master.component.html',
  styleUrls: ['./stone-pricing-master.component.scss']
})
export class StonePricingMasterComponent implements OnInit {
  @ViewChild('overlaysievesetSearch') overlaysievesetSearch!: MasterSearchComponent;
  @ViewChild('overlayshapeSearch') overlayshapeSearch!: MasterSearchComponent;
  @ViewChild('overlaysievefromSearch') overlaysievefromSearch!: MasterSearchComponent;
  @ViewChild('overlaysievetoSearch') overlaysievetoSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlayclaritySearch') overlayclaritySearch!: MasterSearchComponent;
  @ViewChild('overlaysizefromSearch') overlaysizefromSearch!: MasterSearchComponent;
  @ViewChild('overlaysizetoSearch') overlaysizetoSearch!: MasterSearchComponent;
  @ViewChild('overlaycurrencySearch') overlaycurrencySearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;



  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  tableData: any[] = [];
  isReadOnly: any
  viewMode: boolean = false;
  viewModeAll: boolean = false;
  viewDisable: boolean = false;
  editPrice: boolean = false;
  myNumber: any;
  branchCode?: String;
  salesRate: any;
  salesRatePercentage: any;
  deal: any;
  displayDeal: string = '';
  userbranch = localStorage.getItem('userbranch');
  sieveSet: any;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  isCurrencySelected: boolean = false;
  currencyDt: any;
  FORM_VALIDATER: any
  viewselling: boolean = false;
  viewsellingrate: boolean = false;
  codeEnable: boolean = false;

  @ViewChild('codeInput')
  codeInput!: ElementRef;

  ngAfterViewInit(): void {
    this.codeInput.nativeElement.focus();
  }


  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  shapeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  clarityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Clarity',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CLARITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieve_setData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 86,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE SET MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sievefromData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 38,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve From',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sievetoData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 38,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve To',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES ='SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizefromData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size From',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sizetoData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size To',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  sieveData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 38,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'sieve',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR SET'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  currencyData: MasterSearchModel = {

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

  stonePrizeMasterForm: FormGroup = this.formBuilder.group({
    price_code: ['', [Validators.required]],
    sieve_set: [''],
    shape: ['', [Validators.required]],
    sieve_form: [''],
    sieve_to: [''],
    color: [''],
    clarity: [''],
    sieve_from: [''],
    currency: ['', [Validators.required]],
    carat_wt: [0, [Validators.required, this.notZeroValidator()]],
    sieve_from_desc: [''],
    sieve_to_desc: [''],
    wt_from: [0, [Validators.required, this.notZeroValidator()]],
    wt_to: [0, [Validators.required, this.notZeroValidator()]],
    size_to: [''],
    size_from: [''],
    issue_rate: [0, [Validators.required, this.notZeroValidator()]],
    selling: [0],
    selling_rate: [0],
    sieve_desc: [0],
  });


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.branchCode = this.commonService.branchCode;
    // this.currencyDt = this.commonService.compCurrency;
  }

  ngOnInit(): void {
    this.setCompanyCurrency();
    this.setInitialValues();
    this.codeEnable = true;
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW') {
        this.viewFormValues();
        this.editPrice = true;
        this.viewModeAll = true;
        this.viewDisable = true;
        this.viewMode = true;
      }
      else if (this.content.FLAG == 'EDIT') {
        this.editPrice = true;
        this.editMode = true;
        this.codeEnable = false;

        this.setFormValues();
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteStonepriceMaster()
      }
    }
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

  checkCode(): boolean {
    if (this.stonePrizeMasterForm.value.price_code == '') {
      this.commonService.toastErrorByMsgId('MSG1124')// Please Enter the Code
      this.codeEnable = true;
      return true
    }
    return false
  }

  notZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isInvalid = control.value === 0 || control.value === '0' || control.value === '0.00' || control.value === '0.000';
      return isInvalid ? { 'notZero': { value: control.value } } : null;
    };
  }

  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.compCurrency;
    this.stonePrizeMasterForm.controls.currency.setValue(CURRENCY_CODE);
  }

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  // onweighttto(event: any) {
  //   if (this.stonePrizeMasterForm.value.wt_from > this.stonePrizeMasterForm.value.wt_to) {
  //     Swal.fire({
  //       title: event.message || 'Weight From should be lesser than Weight To',
  //       text: '',
  //       icon: 'error',
  //       confirmButtonColor: '#336699',
  //       confirmButtonText: 'Ok'
  //     })
  //   }
  // }

  onweightto(event: any, data: string) {
    // Retrieve the values of Wt From and Wt To from the form
    const wtf: number = parseFloat(this.stonePrizeMasterForm.value.wt_from);
    const wtt: number = parseFloat(this.stonePrizeMasterForm.value.wt_to);

    // Check if the data parameter is not 'wtfrom'
    if (data == 'wt_to') {
      // Check if Wt From is greater than Wt To
      if (wtf > wtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });

        // Clear the value of Wt To input field
        this.stonePrizeMasterForm.controls.wt_to.setValue('');
      }
    }
  }

  onSievetto(event: any, data: string) {
    // Retrieve the values of Wt From and Wt To from the form
    const wtf: number = parseFloat(this.stonePrizeMasterForm.value.sieve_from_desc);
    const wtt: number = parseFloat(this.stonePrizeMasterForm.value.sieve_to_desc);

    // Check if the data parameter is not 'wtfrom'
    if (data == 'sieve_to_desc') {
      // Check if Wt From is greater than Wt To
      if (wtf > wtt) {
        // Display an error message
        Swal.fire({
          title: event.message || 'Weight From should be lesser than Weight To',
          text: '',
          icon: 'error',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        });

        // Clear the value of Wt To input field
        this.stonePrizeMasterForm.controls.sieve_to_desc.setValue('');
      }
    }
  }

  // onSievetto(event: any) {
  //   if (this.stonePrizeMasterForm.value.sieve_from_desc > this.stonePrizeMasterForm.value.sieve_to_desc) {
  //     Swal.fire({
  //       title: event.message || ' Sieve To Should be greater than the Sieve From',
  //       text: '',
  //       icon: 'error',
  //       confirmButtonColor: '#336699',
  //       confirmButtonText: 'Ok'
  //     })
  //   }
  // }


  setFormValues() {
    if (!this.content) return
    this.stonePrizeMasterForm.controls.price_code.setValue(this.content.CODE)
    this.stonePrizeMasterForm.controls.sieve_set.setValue(this.content.SIEVE_SET)
    this.stonePrizeMasterForm.controls.shape.setValue(this.content.SHAPE)
    this.stonePrizeMasterForm.controls.sieve_form.setValue(this.content.SIEVE)
    this.stonePrizeMasterForm.controls.sieve_to.setValue(this.content.SIEVE_TO)
    this.stonePrizeMasterForm.controls.color.setValue(this.content.COLOR)
    this.stonePrizeMasterForm.controls.clarity.setValue(this.content.CLARITY)
    this.stonePrizeMasterForm.controls.size_from.setValue(this.content.SIZE_FROM)
    this.stonePrizeMasterForm.controls.size_to.setValue(this.content.SIZE_TO)
    this.stonePrizeMasterForm.controls.currency.setValue(this.content.CURRENCYCODE)
    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.CARAT_WT)
    this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(this.content.SIEVEFROM_DESC)
    this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(this.content.SIEVETO_DESC)
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.WEIGHT_FROM)
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.WEIGHT_TO)
    // this.stonePrizeMasterForm.controls.issue_rate.setValue(this.content.ISSUE_RATE)
    this.stonePrizeMasterForm.controls.selling.setValue(this.content.SELLING_PER)
    //this.stonePrizeMasterForm.controls.selling_rate.setValue(this.content.SELLING_RATE)


    // this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.CARAT_WT)
    //  this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.WEIGHT_FROM)
    // this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.WEIGHT_TO)

    this.stonePrizeMasterForm.controls.wt_to.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.WEIGHT_TO));

    this.stonePrizeMasterForm.controls.wt_from.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.WEIGHT_FROM));

    this.stonePrizeMasterForm.controls.carat_wt.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARAT_WT));


    this.stonePrizeMasterForm.controls.issue_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.ISSUE_RATE));

    this.stonePrizeMasterForm.controls.selling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.SELLING_RATE));
  }

  private setInitialValues() {

    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
    this.stonePrizeMasterForm.controls.issue_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'));
    this.stonePrizeMasterForm.controls.selling.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.stonePrizeMasterForm.controls.selling_rate.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'));

  }


  viewFormValues() {
    if (!this.content) return
    this.stonePrizeMasterForm.controls.price_code.setValue(this.content.CODE)
    this.stonePrizeMasterForm.controls.sieve_set.setValue(this.content.SIEVE_SET)
    this.stonePrizeMasterForm.controls.shape.setValue(this.content.SHAPE)
    this.stonePrizeMasterForm.controls.sieve_form.setValue(this.content.SIEVE)
    this.stonePrizeMasterForm.controls.sieve_to.setValue(this.content.SIEVE_TO)
    this.stonePrizeMasterForm.controls.color.setValue(this.content.COLOR)
    this.stonePrizeMasterForm.controls.clarity.setValue(this.content.CLARITY)
    this.stonePrizeMasterForm.controls.size_from.setValue(this.content.SIZE_FROM)
    this.stonePrizeMasterForm.controls.size_to.setValue(this.content.SIZE_TO)
    this.stonePrizeMasterForm.controls.currency.setValue(this.content.CURRENCYCODE)
    this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.CARAT_WT)
    this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(this.content.SIEVEFROM_DESC)
    this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(this.content.SIEVETO_DESC)
    this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.WEIGHT_FROM)
    this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.WEIGHT_TO)
    // this.stonePrizeMasterForm.controls.issue_rate.setValue(this.content.ISSUE_RATE)
    this.stonePrizeMasterForm.controls.selling.setValue(this.content.SELLING_PER)
    //this.stonePrizeMasterForm.controls.selling_rate.setValue(this.content.SELLING_RATE)


    // this.stonePrizeMasterForm.controls.carat_wt.setValue(this.content.CARAT_WT)
    //  this.stonePrizeMasterForm.controls.wt_from.setValue(this.content.WEIGHT_FROM)
    // this.stonePrizeMasterForm.controls.wt_to.setValue(this.content.WEIGHT_TO)



    this.stonePrizeMasterForm.controls.wt_to.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.WEIGHT_TO));

    this.stonePrizeMasterForm.controls.wt_from.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.WEIGHT_FROM));

    this.stonePrizeMasterForm.controls.carat_wt.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.CARAT_WT));


    this.stonePrizeMasterForm.controls.issue_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.ISSUE_RATE));

    this.stonePrizeMasterForm.controls.selling_rate.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BMQTYDECIMALS,
        this.content.SELLING_RATE));


  }

  salesChange(data: any) {
    console.log(data);

    if (data == 'selling') {
      this.viewsellingrate = true;
      this.viewselling = false;
      this.stonePrizeMasterForm.controls.selling_rate.setValue('');
    } else if (data == 'selling_rate') {
      this.viewselling = true;
      this.viewsellingrate = false;
      this.stonePrizeMasterForm.controls.selling.setValue('');
    } else {
      this.viewselling = false;
      this.viewsellingrate = false;
    }

  }
  salesChange1(data: any) {
    console.log(data);

    if (data == 'selling_rate') {
      this.viewselling = true;
      this.viewsellingrate = false;
      this.stonePrizeMasterForm.controls.selling.setValue('');
    } else if (data == 'selling') {
      this.viewsellingrate = true;
      this.viewselling = false;
      this.stonePrizeMasterForm.controls.selling_rate.setValue('');
    } else {
      this.viewsellingrate = false;
      this.viewselling = false;
    }

  }



  keyupvalue(e: any) {
    console.log(e);
    this.displayDeal = e.replace(/\D/g, "").replace(/\B(?=(\d{12})+(?!\d))/g, ",");
  }

  setPostData() {
    let form = this.stonePrizeMasterForm.value;
    return {
      "MID": this.content?.MID || 0,
      "SRNO": 0,
      "CODE": this.commonService.nullToString(form.price_code.toUpperCase()) || "",
      "DESCRIPTION": this.commonService.nullToString(form.price_code.toUpperCase() + form.shape.toUpperCase() + form.color.toUpperCase()),
      // "DESCRIPTION": this.stonePrizeMasterForm.value.price_code.toUpperCase() + " " + this.stonePrizeMasterForm.value.shape.toUpperCase() + this.stonePrizeMasterForm.value.color.toUpperCase(),
      "SHAPE": this.commonService.nullToString(form.shape) || "",
      "COLOR": this.commonService.nullToString(form.color) || "",
      "CLARITY": this.commonService.nullToString(form.clarity) || "",
      "SIZE_FROM": this.commonService.nullToString(form.size_from) || "",
      "SIZE_TO": this.commonService.nullToString(form.size_to) || "",
      "CURRENCYCODE": this.commonService.nullToString(form.currency) || "",
      "ISSUE_RATE": this.commonService.emptyToZero(form.issue_rate) || 0,
      "SELLING_RATE": this.commonService.emptyToZero(form.selling_rate) || 0,
      "LAST_ISSUE_RATE": 0,
      "LAST_SELLING_RATE": 0,
      "SELLING_PER": this.commonService.emptyToZero(form.selling) || 0,
      "CARAT_WT": this.commonService.emptyToZero(form.carat_wt) || 0,
      "SIEVE": this.commonService.nullToString(form.sieve_form) || "",
      "SIEVE_SET": this.commonService.nullToString(form.sieve_set) || "",
      "WEIGHT_FROM": this.commonService.emptyToZero(form.wt_from) || 0,
      "WEIGHT_TO": this.commonService.emptyToZero(form.wt_to) || 0,
      "SIEVE_TO": this.commonService.nullToString(form.sieve_to) || "",
      "SIEVEFROM_DESC": this.commonService.nullToString(form.sieve_from_desc),
      "SIEVETO_DESC": this.commonService.nullToString(form.sieve_to_desc) || "",
      "LAST_UPDATE": new Date().toISOString()
    }
  }



  submitValidation(form: any) {

    if (this.commonService.nullToString(form.price_code) == '') {
      this.commonService.toastErrorByMsgId('MSG1660') //"price_code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.shape) == '') {
      this.commonService.toastErrorByMsgId('MSG1796')//"shape cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1172')//"currency cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.carat_wt) == '') {
      this.commonService.toastErrorByMsgId('MSG1095')//"carat_wt cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.wt_from) == '') {
      this.commonService.toastErrorByMsgId('MSG3565')//"wt_from cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.wt_to) == '') {
      this.commonService.toastErrorByMsgId('MSG3565')//"wt_to cannot be empty"
      return true
    } else if (this.commonService.nullToString(form.issue_rate) == '') {
      this.commonService.toastErrorByMsgId('MSG1723')//"issue_rate cannot be empty"
      return true
    }



    if (this.stonePrizeMasterForm.value.selling === '' && this.stonePrizeMasterForm.value.selling_rate === '') {
      this.commonService.toastErrorByMsgId('MSG7728');//Enter values either Selling % or Selling Rate
      return;
    }

    if (this.stonePrizeMasterForm.value.sieve_form > this.stonePrizeMasterForm.value.sieve_to) {
      this.commonService.toastErrorByMsgId('MSG81518');// Sieve From Should not be Greater than Sieve To
      return;
    }

    if (this.stonePrizeMasterForm.value.wtFrom > this.stonePrizeMasterForm.value.wtTo) {
      this.commonService.toastErrorByMsgId('MSG7884')// Weight From should be lesser than Weight To
      return true
    }


    return false;
  }

  checkCondition(value: string, msgId: string): boolean {
    if (value === '0.000' || value === '0.00' || value === '0.0' || value === '0' || /^0{2,}\.00$/.test(value)) {
      this.commonService.toastErrorByMsgId(msgId);
      return true;
    }
    return false;
  }

  formSubmit() {

    if (this.content && this.content.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidation(this.stonePrizeMasterForm.value)) return;
    if (this.checkCondition(this.stonePrizeMasterForm.value.carat_wt, 'MSG1095')) return;
    if (this.checkCondition(this.stonePrizeMasterForm.value.wt_from, 'MSG3565')) return;
    if (this.checkCondition(this.stonePrizeMasterForm.value.wt_to, 'MSG3565')) return;
    if (this.checkCondition(this.stonePrizeMasterForm.value.issue_rate, 'MSG1723')) return;
 



    console.log(this.stonePrizeMasterForm.value.selling);
    console.log(this.stonePrizeMasterForm.value.selling_rate);


    if (this.stonePrizeMasterForm.value.selling === '0' || this.stonePrizeMasterForm.value.selling_rate === '0') {
      this.commonService.toastErrorByMsgId('MSG7728'); // Enter values either Selling % or Selling Rate
      console.log("From second Func");
      return;
    }


    console.log(typeof (this.stonePrizeMasterForm.value.selling));
    console.log(typeof (this.stonePrizeMasterForm.value.selling_rate));


    if (
      (this.stonePrizeMasterForm.value.selling === '0.00' || this.stonePrizeMasterForm.value.selling_rate === '0.00')
    ) {
      this.commonService.toastErrorByMsgId('MSG7728'); // Enter values either Selling % or Selling Rate
      console.log("From first Func");
      return;
    }





    let API = 'StonePriceMasterDJ/InsertStonePriceMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {

        if (result && result.status == "Success") {
          Swal.fire({
            title: this.commonService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.stonePrizeMasterForm.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }
  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }


    let priceCode = event.target.value;

    if (priceCode === '') return;
    if (this.editMode || this.viewMode) return;
    //let API = 'StonePriceMasterDJ/GetSeivesetLookupDatafill/'+this.userbranch+'?SieveSet='+this.stonePrizeMasterForm.value.sieve_set ;
    let API = 'StonePriceMasterDJ/GetStonePriceMasterDJWithCode/' + this.userbranch + '?CODE=' + event.target.value;
    let sub: Subscription = this.dataService.getDynamicAPICustom(API).subscribe(
      (result) => {
        if (result.status == 'Success') {
          this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
          // Reset the form control value
          this.stonePrizeMasterForm.controls.price_code.setValue('');
        } else {
          this.codeEnable = false;
        }

      },
      (err) => {
        console.error('Error checking code:', err);
        this.stonePrizeMasterForm.controls.price_code.setValue('');
      }
    );

    this.subscriptions.push(sub);
  }
  update() {

    if (this.submitValidation(this.stonePrizeMasterForm.value)) return;

    let API = 'StonePriceMasterDJ/UpdateStonePriceMaster/' + this.stonePrizeMasterForm.value.price_code

    let postData = this.setPostData()



    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: this.commonService.getMsgByID('MSG3641') || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.stonePrizeMasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

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

  /**USE: delete worker master from row */
  deleteStonepriceMaster() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.CODE) {
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
        let API = 'StonePriceMasterDJ/DeleteStonePriceMaster/' + this.content.CODE
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
                    this.stonePrizeMasterForm.reset()
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
                    this.stonePrizeMasterForm.reset()
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

  // deleteStonepriceMaster() {
  //   if (this.content && this.content.FLAG == 'VIEW') return;

  //   if (!this.stonePrizeMasterForm.value.price_code) {
  //     this.commonService.toastErrorByMsgId('MSG2347'); // 'Please Select data to delete!' message
  //     return;
  //   }

  //   this.showConfirmationDialog().then((result) => {
  //     if (result.isConfirmed) {
  //       let API = 'StonePriceMasterDJ/DeleteStonePriceMaster/' + this.stonePrizeMasterForm.value.price_code;
  //       let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
  //         .subscribe((result) => {
  //           if (result) {
  //             if (result.status == "Success") {
  //               this.showSuccessDialog(this.stonePrizeMasterForm.value.price_code + ' Deleted successfully');
  //               this.stonePrizeMasterForm.reset();
  //               this.tableData = [];
  //               this.close('reloadMainGrid');
  //             } else {
  //               this.commonService.toastErrorByMsgId('MSG2272'); // 'Error please try again' message
  //             }
  //           } else {
  //             this.commonService.toastErrorByMsgId('MSG1880'); // 'Not Deleted' message
  //           }
  //         }, err => {
  //           this.commonService.toastErrorByMsgId('MSG1531'); // Handle error
  //         });
  //       this.subscriptions.push(Sub);
  //     }
  //   });
  // }

  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      this.afterSave(result.value)
    });
  }

  afterSave(value: any) {
    if (value) {
      this.stonePrizeMasterForm.reset()
      this.tableData = []
      this.close('reloadMainGrid')
    }
  }

  priceCodeSelected(data: any) {
    // console.log(data);
    this.stonePrizeMasterForm.controls.price_code.setValue(data.CODE)
  }


  // sieve_setDataSelected(data: any) {
  //   console.log(data);

  //   this.stonePrizeMasterForm.controls.sieve_set.setValue(data.CODE);

  //   //StonePriceMasterDJ/GetSeivesetLookupDatafill/DMCC?SieveSet=%2B14
  //   // Construct the API URL with the selected sieve_set value
  //  // let API = 'StonePriceMasterDJ/GetSeivesetLookupDatafill/' + this.userbranch + '?SieveSet=' + this.stonePrizeMasterForm.value.sieve_set;
  //   let API = 'StonePriceMasterDJ/GetSeivesetLookupDatafill?SieveSet=' + this.stonePrizeMasterForm.value.sieve_set+'&DBBranch=DMCC';


  //   let Sub: Subscription = this.dataService.getDynamicAPICustom(API).subscribe((result) => {
  //     if (result.response) {
  //       console.log(result.response);
  //       // Assign values to variables
  //       // let sieve_form, sieve_to;

  //       const responseData = result.response[0];
  //       const finalsieve_form = this.commonService.dataSplitPop(responseData.SIEVE);
  //       const finalsieve_to = this.commonService.dataSplitPop(responseData.SIEVE_TO);

  //       this.stonePrizeMasterForm.controls.shape.setValue(responseData.SHAPE);
  //       this.stonePrizeMasterForm.controls.size_from.setValue(responseData.SIZE_FROM);
  //       this.stonePrizeMasterForm.controls.size_to.setValue(responseData.SIZE_TO);
  //       this.stonePrizeMasterForm.controls.sieve_form.setValue(finalsieve_form);
  //       this.stonePrizeMasterForm.controls.sieve_to.setValue(finalsieve_to);
  //       // this.stonePrizeMasterForm.controls.sieve_form.setValue(responseData.SIEVE);
  //       // this.stonePrizeMasterForm.controls.sieve_to.setValue(responseData.SIEVE_TO);
  //       this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(responseData.SIEVEFROM_DESC);
  //       this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(responseData.SIEVETO_DESC);
  //     }
  //   });

  //   this.subscriptions.push(Sub);
  // }
  setFormNullToString(formControlName: string, value: any) {
    this.stonePrizeMasterForm.controls[formControlName].setValue(
      this.commonService.nullToString(value)
    )
    // this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }

  sieve_setDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.sieve_set.setValue(data.CODE);

    let postData = {
      "SPID": "109",
      "parameter": {
        SIEVE_SET: this.stonePrizeMasterForm.value.sieve_set
      }
    };

    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        if (result.status == "Success") {
          const responseData = result.dynamicData[0][0];
          console.log(responseData);

          // const finalsieve_form = this.commonService.dataSplitPop(responseData.SIEVE);
          // const finalsieve_to = this.commonService.dataSplitPop(responseData.SIEVE_TO);

          this.stonePrizeMasterForm.controls.shape.setValue(responseData.SHAPE);
          this.stonePrizeMasterForm.controls.size_from.setValue(responseData.SIZE_FROM);
          this.stonePrizeMasterForm.controls.size_to.setValue(responseData.SIZE_TO);
          this.stonePrizeMasterForm.controls.sieve_form.setValue(responseData.SIEVE);
          this.stonePrizeMasterForm.controls.sieve_to.setValue(responseData.SIEVE_TO);
          this.setFormNullToString('sieve_from_desc', responseData.SIEVEFROM_DESC);
          this.setFormNullToString('sieve_to_desc', responseData.SIEVETO_DESC);

          // console.log('Form controls:', this.stonePrizeMasterForm.controls);

          // if (this.stonePrizeMasterForm.get('sieve_from_desc')) {
          //   this.setFormNullToString('sieve_from_desc', responseData.SIEVEFROM_DESC);
          // } else {
          //   console.error('Form control sieve_from_desc does not exist.');
          // }

          // if (this.stonePrizeMasterForm.get('sieve_to_desc')) {
          //   this.setFormNullToString('sieve_to_desc', responseData.SIEVETO_DESC);
          // } else {
          //   console.error('Form control sieve_to_desc does not exist.');
          // }

        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451');
      });

    this.subscriptions.push(Sub);
  }


  shapeDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.shape.setValue(data.CODE)
  }

  sievefromDataSelected(data: any) {
    if (this.checkCode()) return
    console.log(data);
    // const finalsieve_form = this.commonService.dataSplitPop(data.CODE);

    this.stonePrizeMasterForm.controls.sieve_form.setValue(data.CODE);
    this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(data.DESCRIPTION);
  }
  sievetoDataSelected(data: any) {
    if (this.checkCode()) return
    console.log(data);
    // const finalsieve_to = this.commonService.dataSplitPop(data.CODE);

    this.stonePrizeMasterForm.controls.sieve_to.setValue(data.CODE);
    this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(data.DESCRIPTION)


  }


  colorDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.color.setValue(data.CODE)
  }
  clarityDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.clarity.setValue(data.CODE)
  }
  sizefromDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.size_from.setValue(data.CODE)
  }
  sizetoDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.size_to.setValue(data.CODE)
  }
  currencyDataSelected(data: any) {
    if (this.checkCode()) return
    this.stonePrizeMasterForm.controls.currency.setValue(data.CURRENCY_CODE)
  }


  onInputChange(event: any, controlName: string, maxLength: number) {
    const inputValue = event.target.value;

    if (inputValue.length > maxLength) {
      this.stonePrizeMasterForm.get(controlName)!.setValue(inputValue.slice(0, maxLength));
    }
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    const inputValue = event.target.value.toUpperCase();
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
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        console.log(data);
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.stonePrizeMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }

        // if (FORMNAME === 'sieve_set') {
        //   this.sieve_setDataSelected(data[0]); // Assuming the first data element is used
        // } else {
        //   // Handle other form names
        //   const matchedItem = data.find((item: any) => item.SIEVE_SET === inputValue);
        //   if (matchedItem) {
        //     this.stonePrizeMasterForm.controls[FORMNAME].setValue(matchedItem.SIEVE_SET);
        //     // Set additional form fields if needed
        //     this.stonePrizeMasterForm.controls.shape.setValue(matchedItem.SHAPE);
        //     this.stonePrizeMasterForm.controls.size_from.setValue(matchedItem.SIZE_FROM);
        //     this.stonePrizeMasterForm.controls.size_to.setValue(matchedItem.SIZE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_form.setValue(matchedItem.SIEVE);
        //     this.stonePrizeMasterForm.controls.sieve_to.setValue(matchedItem.SIEVE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(matchedItem.SIEVEFROM_DESC);
        //     this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(matchedItem.SIEVETO_DESC);
        //   } else {
        //     this.handleLookupError(FORMNAME, LOOKUPDATA);
        //   }
        // }



        // const matchedItem2 = data.find((item: any) => item.SIEVE_SET === inputValue);
        // if (matchedItem2) {
        //   this.stonePrizeMasterForm.controls[FORMNAME].setValue(matchedItem2.SIEVE_SET);
        //   if (FORMNAME === 'sieve_set') {
        //     this.stonePrizeMasterForm.controls.shape.setValue(matchedItem2.SHAPE);
        //     this.stonePrizeMasterForm.controls.size_from.setValue(matchedItem2.SIZE_FROM);
        //     this.stonePrizeMasterForm.controls.size_to.setValue(matchedItem2.SIZE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_form.setValue(matchedItem2.SIEVE);
        //     this.stonePrizeMasterForm.controls.sieve_to.setValue(matchedItem2.SIEVE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(matchedItem2.SIEVEFROM_DESC);
        //     this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(matchedItem2.SIEVETO_DESC);
        //   }
        // } else {
        //   this.handleLookupError(FORMNAME, LOOKUPDATA);
        // }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  validateLookupFieldSieveSet(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    const inputValue = event.target.value.toUpperCase();
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
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        console.log(data);
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.stonePrizeMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }

        if (FORMNAME === 'sieve_set') {
          this.sieve_setDataSelected(data[0]); // Assuming the first data element is used
        } else {
          // Handle other form names
          const matchedItem = data.find((item: any) => item.SIEVE_SET === inputValue);
          if (matchedItem) {
            this.stonePrizeMasterForm.controls[FORMNAME].setValue(matchedItem.SIEVE_SET);
            // Set additional form fields if needed
            this.stonePrizeMasterForm.controls.shape.setValue(matchedItem.SHAPE);
            this.stonePrizeMasterForm.controls.size_from.setValue(matchedItem.SIZE_FROM);
            this.stonePrizeMasterForm.controls.size_to.setValue(matchedItem.SIZE_TO);
            this.stonePrizeMasterForm.controls.sieve_form.setValue(matchedItem.SIEVE);
            this.stonePrizeMasterForm.controls.sieve_to.setValue(matchedItem.SIEVE_TO);
            this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(matchedItem.SIEVEFROM_DESC);
            this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(matchedItem.SIEVETO_DESC);
          } else {
            this.handleLookupError(FORMNAME, LOOKUPDATA);
          }
        }



        // const matchedItem2 = data.find((item: any) => item.SIEVE_SET === inputValue);
        // if (matchedItem2) {
        //   this.stonePrizeMasterForm.controls[FORMNAME].setValue(matchedItem2.SIEVE_SET);
        //   if (FORMNAME === 'sieve_set') {
        //     this.stonePrizeMasterForm.controls.shape.setValue(matchedItem2.SHAPE);
        //     this.stonePrizeMasterForm.controls.size_from.setValue(matchedItem2.SIZE_FROM);
        //     this.stonePrizeMasterForm.controls.size_to.setValue(matchedItem2.SIZE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_form.setValue(matchedItem2.SIEVE);
        //     this.stonePrizeMasterForm.controls.sieve_to.setValue(matchedItem2.SIEVE_TO);
        //     this.stonePrizeMasterForm.controls.sieve_from_desc.setValue(matchedItem2.SIEVEFROM_DESC);
        //     this.stonePrizeMasterForm.controls.sieve_to_desc.setValue(matchedItem2.SIEVETO_DESC);
        //   }
        // } else {
        //   this.handleLookupError(FORMNAME, LOOKUPDATA);
        // }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  handleLookupError(FORMNAME: string, LOOKUPDATA: MasterSearchModel) {
    this.commonService.toastErrorByMsgId('MSG1531');
    this.stonePrizeMasterForm.controls[FORMNAME].setValue('');
    LOOKUPDATA.SEARCH_VALUE = '';
    if (FORMNAME === 'sieve_set') {
      this.stonePrizeMasterForm.controls.sieve_set.setValue('');
    }
  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param =  {
  //       LOOKUPID: this.commonService.nullToString(LOOKUPDATA.LOOKUPID),
  //       WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.commonService.showSnackBarMsg('MSG81447');
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
  //   let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
  //     .subscribe((result) => {
  //       this.commonService.closeSnackBarMsg()
  //       this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.stonePrizeMasterForm.controls[FORMNAME].setValue('')
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

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'sieve_set':
        this.overlaysievesetSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.overlayshapeSearch.showOverlayPanel(event);
        break;
      case 'sieve_form':
        this.overlaysievefromSearch.showOverlayPanel(event);
        break;
      case 'sieve_to':
        this.overlaysievetoSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'clarity':
        this.overlayclaritySearch.showOverlayPanel(event);
        break;
      case 'size_from':
        this.overlaysizefromSearch.showOverlayPanel(event);
        break;
      case 'size_to':
        this.overlaysizetoSearch.showOverlayPanel(event);
        break;
      case 'currency':
        this.overlaycurrencySearch.showOverlayPanel(event);
        break;
      default:
    }
  }


  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'sieve_set') {
  //     this.overlaysizesetSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'shape') {
  //     this.overlayshapeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sieve_form') {
  //     this.overlaysievefromSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sieve_to') {
  //     this.overlaysievetoSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sieve_to') {
  //     this.overlaysievetoSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'color') {
  //     this.overlaycolorSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'clarity') {
  //     this.overlayclaritySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size_from') {
  //     this.overlaysizefromSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size_to') {
  //     this.overlaysizetoSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'currency') {
  //     this.overlaycurrencySearch.showOverlayPanel(event)
  //   }
  // }

}


