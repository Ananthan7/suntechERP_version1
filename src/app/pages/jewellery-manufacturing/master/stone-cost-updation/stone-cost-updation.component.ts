import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';

@Component({
  selector: 'app-stone-cost-updation',
  templateUrl: './stone-cost-updation.component.html',
  styleUrls: ['./stone-cost-updation.component.scss']
})
export class StoneCostUpdationComponent implements OnInit {
  @ViewChild('overlaystockcodedivSearch') overlaystockcodedivSearch!: MasterSearchComponent;
  @ViewChild('overlayitemcurrencySearch') overlayitemcurrencySearch!: MasterSearchComponent;
  @ViewChild('overlaybasecurrencySearch') overlaybasecurrencySearch!: MasterSearchComponent;
  @ViewChild('overlayshapeSearch') overlayshapeSearch!: MasterSearchComponent;
  @ViewChild('overlaysizeSearch') overlaysizeSearch!: MasterSearchComponent;
  @ViewChild('overlaysieveSearch') overlaysieveSearch!: MasterSearchComponent;
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaysievesetSearch') overlaysievesetSearch!: MasterSearchComponent;
  @ViewChild('overlayclaritySearch') overlayclaritySearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;



  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Customer', 'So Number', 'Job Number', 'Job Ref#', 'Pcs', 'Weight', 'Rate', 'Amount', 'New Rate LC', 'New Amount LC', 'New Rate FC', 'New Amount FC',];
  divisionMS: any = 'ID';
  selectedOption: string = 'byvalue';
  isChecked: boolean = true;
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  text: string = "Deduct";
  selection!: number;
  userName = this.commonService.userName;
  @Input() content!: any;
  isSaved: boolean = false;
  isloading: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;

  private subscriptions: Subscription[] = [];

  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
    this.yearMonth = this.commonService.yearSelected;
    // this.stonecostupdationFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
     this.setCompanyCurrency()
      this.basesetCompanyCurrency()
    if (this.content?.FLAG) {
      if (this.content.FLAG == 'VIEW' || this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.LOCKVOUCHERNO = true;
        this.isSaved = true;
      }
      if (this.content.FLAG == 'EDIT') {
        this.LOCKVOUCHERNO = true;
        this.editMode = true
      }
      this.isSaved = true;
      if (this.content.FLAG == 'DELETE') {
        this.deleteRecord()
      }
      this.stonecostupdationFrom.controls.FLAG.setValue(this.content.FLAG)
      this.setAllInitialValues()
    } else {
      this.generateVocNo()
      this.setNewFormValues()
      this.setvoucherTypeMaster()
    }
  }
  minDate: any;
  maxDate: any;
  LOCKVOUCHERNO: boolean = true;
  setvoucherTypeMaster() {
    let frm = this.stonecostupdationFrom.value
    const vocTypeMaster = this.comService.getVoctypeMasterByVocTypeMain(frm.BRANCH_CODE, frm.VOCTYPE, frm.MAIN_VOCTYPE)
    this.LOCKVOUCHERNO = vocTypeMaster.LOCKVOUCHERNO
    this.minDate = vocTypeMaster.BLOCKBACKDATEDENTRIES ? new Date() : null;
    this.maxDate = vocTypeMaster.BLOCKFUTUREDATE ? new Date() : null;
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
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

  change(event: any) {
    console.log(event);
    this.text = event.target.value;
    if (event.target.checked == true) {
      this.text = "Add";

    } else {
      this.text = "Deduct";
    }
  }

  stonecostupdationFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocdate: [''],
    vocno: ['', [Validators.required]],
    stockcodediv: [''],
    stockcode: [''],
    stockcodedes: ['', [Validators.required]],
    itemcurrency: ['', [Validators.required]],
    itemcurrency_rate: ['', [Validators.required]],
    basecurrency: ['', [Validators.required]],
    basecurrency_rate: ['', [Validators.required]],
    currentrate_FC: [''],
    currentrate_LC: [''],
    newrate_FC: [''],
    newrate_LC: [''],
    shape: ['', [Validators.required]],
    size: [''],
    sieve: ['', [Validators.required]],
    color: [''],
    clarity: [''],
    sieve_set: ['', [Validators.required]],
    remarks: [''],
    valueTarget: [''],
    text: [false],
    YEARMONTH: [''],
    BRANCH_CODE: [''],
    MAIN_VOCTYPE: [''],
    FLAG:['']

  });

  // setvalues() {
  //   this.stonecostupdationFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
  //   this.stonecostupdationFrom.controls.vocno.setValue(this.commonService.popMetalValueOnNet)
  //   this.stonecostupdationFrom.controls.vocdate.setValue(this.commonService.currentDate)
  //   this.stonecostupdationFrom.controls.itemcurrency.setValue(this.commonService.compCurrency)
  //   // this.stonecostupdationFrom.controls.itemcurrency_rate.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))
  //   this.stonecostupdationFrom.controls.basecurrency.setValue(this.commonService.compCurrency)
  //   // this.stonecostupdationFrom.controls.basecurrency_rate.setValue(this.commonService.decimalQuantityFormat(0, 'METAL'))

  // }


  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  setNewFormValues() {
    this.stonecostupdationFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.stonecostupdationFrom.controls.vocdate.setValue(this.comService.currentDate)
    this.stonecostupdationFrom.controls.YEARMONTH.setValue(this.comService.yearSelected)
    this.stonecostupdationFrom.controls.BRANCH_CODE.setValue(this.comService.branchCode)
    this.stonecostupdationFrom.controls.MAIN_VOCTYPE.setValue(
      this.comService.getqueryParamMainVocType()
    )
    this.setvoucherTypeMaster()
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
    this.stonecostupdationFrom.controls.itemcurrency_rate.setValue(value.CONV_RATE);
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
  baseCurrencyCodeSelected(e: any) {
    console.log(e);
    this.stonecostupdationFrom.controls.basecurrency.setValue(e.CURRENCY_CODE);
    this.stonecostupdationFrom.controls.basecurrency_rate.setValue(e.CONV_RATE);
  }
  CurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: to set currency on selected change*/
  currencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonecostupdationFrom.controls.itemcurrency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonecostupdationFrom.controls.itemcurrency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }

  /**USE: to set currency from company parameter */
  setCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonecostupdationFrom.controls.itemcurrency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonecostupdationFrom.value.itemcurrency);
    if (CURRENCY_RATE.length > 0) {
      this.stonecostupdationFrom.controls.itemcurrency_rate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonecostupdationFrom.controls.itemcurrency.setValue('')
      this.stonecostupdationFrom.controls.itemcurrency_rate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }

  /**USE: to set basecurrency on selected change*/
  basecurrencyDataSelected(event: any) {
    if (event.target?.value) {
      this.stonecostupdationFrom.controls.basecurrency.setValue((event.target.value).toUpperCase())
    } else {
      this.stonecostupdationFrom.controls.basecurrency.setValue(event.CURRENCY_CODE)
    }
    this.setCurrencyRate()
  }
  /**USE: to set currency from company parameter */
  basesetCompanyCurrency() {
    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.stonecostupdationFrom.controls.basecurrency.setValue(CURRENCY_CODE);
    this.basesetCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  basesetCurrencyRate() {
    const CURRENCY_RATE: any[] = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.stonecostupdationFrom.value.basecurrency);
    if (CURRENCY_RATE.length > 0) {
      this.stonecostupdationFrom.controls.basecurrency_rate.setValue(
        this.commonService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.stonecostupdationFrom.controls.basecurrency.setValue('')
      this.stonecostupdationFrom.controls.basecurrency_rate.setValue('')
      this.commonService.toastErrorByMsgId('MSG1531')
    }
  }
  setPostData() {
    return {
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
      "BASE_CURR_RATE": this.stonecostupdationFrom.value.basecurrency_rate,
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
  }

  submitValidation(form: any) {

    if (this.commonService.nullToString(form.voctype) == '') {
      this.commonService.toastErrorByMsgId('MSG1939') //"voctype cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.vocno) == '') {
      this.commonService.toastErrorByMsgId('MSG1937')//"vocno cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.shape) == '') {
      this.commonService.toastErrorByMsgId('MSG1796')//"vocno cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.clarity) == '') {
      this.commonService.toastErrorByMsgId('MSG1118')//"vocno cannot be empty"
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

    if (this.submitValidation(this.stonecostupdationFrom.value)) return;

    let API = 'JobStoneRecostDJ/InsertJobStoneRecostDJ'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status.trim() == "Success") {
            this.isSaved = true;
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  // setFormValues() {
  //   if(!this.content) return
  //   console.log(this.content);
  // }


  update() {
    if (this.submitValidation(this.stonecostupdationFrom.value)) return;

    let API = 'JobStoneRecostDJ/UpdateJobStoneRecostDJ/' + this.branchCode + this.stonecostupdationFrom.value.voctype + this.stonecostupdationFrom.value.vocno + this.yearMonth;
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result.response) {
          if (result.status == "Success") {
            this.isSaved = true;
            Swal.fire({
              title: this.comService.getMsgByID('MSG2443') || 'Success',
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
          this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (!this.content.VOCNO) {
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
        let API = 'JobStoneRecostDJ/DeleteJobStoneRecostDJ/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH;
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
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let form = this.stonecostupdationFrom
    let API = 'JobStoneRecostDJ/GetJobStoneRecostDJDetailList/' + this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
      this.content.VOCNO + '/' + this.content.YEARMONTH;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          // this.metalReturnDetailsData = data.Details
          // data.Details.forEach((element: any) => {
          //   this.tableData.push({
          //     SRNO: element.SRNO,
          //     Job_id: element.JOB_NUMBER,
          //     Unq_job_id: element.UNQ_JOB_ID,
          //     Process: element.PROCESS_CODE,
          //     Design: element.DESIGN_CODE,
          //     Stock_Code: element.STOCK_CODE,
          //     Worker: element.WORKER_CODE,
          //     Description: element.JOB_DESCRIPTION,
          //     Carat: element.KARAT_CODE,
          //     Rate: element.RATE_TYPE,
          //     Division: element.DIVCODE,
          //     Amount: element.NET_WT,
          //   })
          // });
          this.stonecostupdationFrom.controls.voctype.setValue(data.VOCTYPE)
          this.stonecostupdationFrom.controls.vocno.setValue(data.VOCNO)
          this.stonecostupdationFrom.controls.vocdate.setValue(data.VOCDATE)
          this.stonecostupdationFrom.controls.stockcodediv.setValue(data.REMARKS)
          this.stonecostupdationFrom.controls.stockcode.setValue(data.STOCK_CODE)
          this.stonecostupdationFrom.controls.stockcodedes.setValue(data.STOCK_CODE)
          this.stonecostupdationFrom.controls.itemcurrency.setValue(data.CURRENCY_CODE)
          this.stonecostupdationFrom.controls.itemcurrency_rate.setValue(data.CURRENCY_RATE)
          this.stonecostupdationFrom.controls.basecurrency.setValue(data.BASE_CURRENCY)
          this.stonecostupdationFrom.controls.basecurrency_rate.setValue(data.BASE_CURR_RATE)
          this.stonecostupdationFrom.controls.currentrate_FC.setValue(data.RATEFC)
          this.stonecostupdationFrom.controls.currentrate_LC.setValue(data.RATELC)
          this.stonecostupdationFrom.controls.newrate_FC.setValue(data.NEW_RATEFC)
          this.stonecostupdationFrom.controls.newrate_LC.setValue(data.NEW_RATELC)
          this.stonecostupdationFrom.controls.shape.setValue(data.SHAPE)
          this.stonecostupdationFrom.controls.size.setValue(data.SIZE)
          this.stonecostupdationFrom.controls.sieve.setValue(data.SIEVE)
          this.stonecostupdationFrom.controls.color.setValue(data.COLOR)
          this.stonecostupdationFrom.controls.clarity.setValue(data.CLARITY)
          this.stonecostupdationFrom.controls.sieve_set.setValue(data.SIEVE_SET)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }
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
      case 'stockcodediv':
        this.overlaystockcodedivSearch.showOverlayPanel(event);
        break;
      case 'itemcurrency':
        this.overlayitemcurrencySearch.showOverlayPanel(event);
        break;
      case 'basecurrency':
        this.overlaybasecurrencySearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.overlayshapeSearch.showOverlayPanel(event);
        break;
      case 'size':
        this.overlaysizeSearch.showOverlayPanel(event);
        break;
      case 'sieve':
        this.overlaysieveSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'sieve_set':
        this.overlaysievesetSearch.showOverlayPanel(event);
        break;
      case 'clarity':
        this.overlayclaritySearch.showOverlayPanel(event);
        break;
      default:
        // Optional: handle the case where formControlName does not match any case
        console.warn(`No overlay found for form control: ${formControlName}`);
    }
  }


  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'stockcodediv') {
  //     this.overlaystockcodedivSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'itemcurrency') {
  //     this.overlayitemcurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'basecurrency') {
  //     this.overlaybasecurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'shape') {
  //     this.overlayshapeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size') {
  //     this.overlaysizeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sieve') {
  //     this.overlaysieveSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'color') {
  //     this.overlaycolorSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sieve_set') {
  //     this.overlaysievesetSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'clarity') {
  //     this.overlayclaritySearch.showOverlayPanel(event)
  //   }
  // }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  ValidatingVocNo() {
    if (this.content?.FLAG == 'VIEW') return
    this.comService.showSnackBarMsg('MSG81447');
    let API = `ValidatingVocNo/${this.comService.getqueryParamMainVocType()}/${this.stonecostupdationFrom.value.vocno}`
    API += `/${this.comService.branchCode}/${this.comService.getqueryParamVocType()}`
    API += `/${this.comService.yearSelected}`
    this.isloading = true;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.isloading = false;
        this.comService.closeSnackBarMsg()
        let data = this.comService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data[0]?.RESULT == 0) {
          this.comService.toastErrorByMsgId('MSG2284')//Voucher Number Already Exists

          this.generateVocNo()
          return
        }
      }, err => {
        this.isloading = false;
        this.generateVocNo()
        this.comService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  generateVocNo() {
    const API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${this.comService.branchCode}/${this.comService.yearSelected}/${this.comService.formatYYMMDD(this.currentDate)}`;
    this.dataService.getDynamicAPI(API)
      .subscribe((resp) => {
        if (resp.status == "Success") {
          this.stonecostupdationFrom.controls.vocno.setValue(resp.newvocno);
        }
      });
  }

}
