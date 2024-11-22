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
  selector: 'app-jewellery-dismantling',
  templateUrl: './jewellery-dismantling.component.html',
  styleUrls: ['./jewellery-dismantling.component.scss']
})
export class JewelleryDismantlingComponent implements OnInit {

  @ViewChild('overlayuserName') overlayuserName!: MasterSearchComponent;
  @ViewChild('overlayItemCurrencDesc') overlayItemCurrencDesc!: MasterSearchComponent;
  @ViewChild('overlayMetalRateType') overlayMetalRateType!: MasterSearchComponent;
  @ViewChild('overlayStock') overlayStock!: MasterSearchComponent;
  @ViewChild('overlaylocation') overlaylocation!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;


  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

 
  

  divisionMS: any = 'ID';
  columnheads: any[] = ['SrNo', 'Stock Code', 'Description', 'Pcs', 'Metal/Value', 'Lab Amount', 'Total Amount', 'Loss', 'MFGRE', 'MFGDATE', ' Settings', 'Remarks', 'Locations'];
  columnhead: any[] = ['Col ID', 'Division', 'Cols', 'ColR', 'ColKt', 'Fes', 'Weight', 'Rate', 'Amount', 'Pcs', 'RecWeight', 'RecAmount', 'Re...', '...']
  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  viewMode: boolean = false;
  isSaved: boolean = false;
  isloading: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;

  private subscriptions: Subscription[] = [];
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

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'RATE TYPE MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  StockcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  StockcodeSelected(value: any) {
    console.log(value);
    this.jewellerydismantlingFrom.controls.stock.setValue(value.STOCK_CODE);
    this.jewellerydismantlingFrom.controls.description.setValue(value.DESCRIPTION);
  }
  rateTypeSelected(event: any) {
    this.jewellerydismantlingFrom.controls.metalrate.setValue(event.RATE_TYPE)
    let data = this.commonService.RateTypeMasterData.filter((item: any) => item.RATE_TYPE == event.RATE_TYPE)

    data.forEach((element: any) => {
      if (element.RATE_TYPE == event.RATE_TYPE) {
        let WHOLESALE_RATE = this.commonService.decimalQuantityFormat(data[0].WHOLESALE_RATE, 'RATE')
        this.jewellerydismantlingFrom.controls.metalratetype.setValue(WHOLESALE_RATE)
      }
    });
  }

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
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.jewellerydismantlingFrom.controls.voctype.setValue(this.commonService.getqueryParamVocType())
    // this.setCompanyCurrency()
    if (this.content && this.content.FLAG == 'EDIT') {
      this.setvalues()
      this.setAllInitialValues()
    }
    if (this.content && this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.isSaved = true;
      this.setvalues()
      this.setAllInitialValues()
    }
  }

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {
    this.Attachedfile = file
    console.log(this.Attachedfile);    
  }

  userDataSelected(value: any) {
    console.log(value);
    this.jewellerydismantlingFrom.controls.enteredby.setValue(value.UsersName);
  }

  locationCodeSelected(e: any) {
    console.log(e);
    this.jewellerydismantlingFrom.controls.location.setValue(e.LOCATION_CODE);
  }

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
  currencyCodeSelected(e: any) {
    console.log(e);
    this.jewellerydismantlingFrom.controls.itemcurrency.setValue(e.CURRENCY_CODE);
    this.jewellerydismantlingFrom.controls.itemcurrencDesc.setValue(e.CONV_RATE);
  }
  setCompanyCurrency() {
    let CURRENCY_CODE = this.comService.getCompanyParamValue('COMPANYCURRENCY')
    this.jewellerydismantlingFrom.controls.itemcurrency.setValue(CURRENCY_CODE);
    this.setCurrencyRate()
  }
  /**USE: to set currency from branch currency master */
  setCurrencyRate() {
    const CURRENCY_RATE: any[] = this.comService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == this.jewellerydismantlingFrom.value.itemcurrency);
    if (CURRENCY_RATE.length > 0) {
      this.jewellerydismantlingFrom.controls.itemcurrencDesc.setValue(
        this.comService.decimalQuantityFormat(CURRENCY_RATE[0].CONV_RATE, 'RATE')
      );
    } else {
      this.jewellerydismantlingFrom.controls.itemcurrency.setValue('')
      this.jewellerydismantlingFrom.controls.itemcurrencDesc.setValue('')
      this.comService.toastErrorByMsgId('MSG1531')
    }
  }

  addTableData() {

  }

  deleteTableData() {

  }

  addTableDatas() {

  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    if (this.jewellerydismantlingFrom.value[formControlName] != '') return;

    switch (formControlName) {
      case 'enteredby':
        this.overlayuserName.showOverlayPanel(event);
        break;
      case 'itemcurrencDesc':
        this.overlayItemCurrencDesc.showOverlayPanel(event);
        break;
      case 'metalratetype':
        this.overlayMetalRateType.showOverlayPanel(event);
        break;
      case 'stock':
        this.overlayStock.showOverlayPanel(event);
        break;
        case 'location':
        this.overlaylocation.showOverlayPanel(event);
        break;
      default:
    }
  }


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
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
          this.jewellerydismantlingFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'enteredby' || FORMNAME === 'itemcurrencDesc' || FORMNAME === "metalratetype" || FORMNAME === "stock" || FORMNAME === "location") {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  jewellerydismantlingFrom: FormGroup = this.formBuilder.group({
    voctype: ['', [Validators.required]],
    vocno: [''],
    vocdate: [, [Validators.required]],
    enteredby: [''],
    lossaccount: [''],
    itemcurrency: [''],
    itemcurrencDesc: [''],
    metalrate: [''],
    metalratetype: [''],
    base: [''],
    baseDesc: [''],
    narration: [''],
    stock: [''],
    description: [''],
    pcs: [''],
    totalValue: [''],
    mfgDate: [''],
    lossAccount: [''],
    mfgfurRef: [''],
    location: [''],
    setting: [''],
    labourCharge: [''],
    polishing: [''],
    miscCode: [''],
    labTotal: [''],
    MID: [0],
  });

  setvalues() {
    console.log(this.comService);
    this.jewellerydismantlingFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.jewellerydismantlingFrom.controls.vocdate.setValue(this.comService.currentDate)
  }

  setAllInitialValues() {
    if (!this.content) return
    let API = `DiamondDismantle/GetDiamondDismantleWithMID/${this.content.MID}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data, 'data')
          this.jewellerydismantlingFrom.controls.MID.setValue(data.MID)
          this.jewellerydismantlingFrom.controls.voctype.setValue(data.VOCTYPE)
          this.jewellerydismantlingFrom.controls.vocno.setValue(data.VOCNO)
          this.jewellerydismantlingFrom.controls.vocdate.setValue(data.VOCDATE)
          this.jewellerydismantlingFrom.controls.enteredby.setValue(data.HTUSERNAME)
          this.jewellerydismantlingFrom.controls.lossaccount.setValue(data.LOSS_ACCODE)
          this.jewellerydismantlingFrom.controls.itemcurrency.setValue(data.CC_RATE)
          this.jewellerydismantlingFrom.controls.itemcurrencDesc.setValue(data.CURRENCY_CODE)
          // this.jewellerydismantlingFrom.controls.color.setValue(data.COLOR)

          // this.meltingISsueDetailsData = data.Details
          // this.reCalculateSRNO() //set to main grid
          // this.meltingISsueDetailsData.forEach((element: any) => {
          //   this.tableData.push({
          //     jobno: element.JOB_NUMBER,
          //     jobNumDes: element.JOB_DESCRIPTION,
          //     processCode: element.PROCESS_CODE,
          //     processCodeDesc: element.PROCESS_NAME,
          //     workerCode: element.WORKER_CODE,
          //     workerCodeDes: element.WORKER_NAME,
          //     pcs: element.PCS,
          //     purity: element.PURITY,
          //     grossWeight: element.GROSS_WT,
          //     netWeight: element.NET_WT,
          //   })
          // });
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  setPostData() {
    let form = this.jewellerydismantlingFrom.value
    console.log(form, 'form');
    return {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.jewellerydismantlingFrom.value.voctype,
      "VOCNO": this.comService.emptyToZero(this.jewellerydismantlingFrom.value.VOCNO),
      "VOCDATE": this.jewellerydismantlingFrom.value.vocdate,
      "YEARMONTH": this.yearMonth,
      "SMAN": "",
      "LOSS_ACCODE": this.jewellerydismantlingFrom.value.lossaccount,
      "CURRENCY_CODE": this.comService.nullToString(this.jewellerydismantlingFrom.value.itemcurrency),
      "CC_RATE": this.comService.emptyToZero(this.jewellerydismantlingFrom.value.CC_RATE),
      "MET_RATE_TYPE": this.comService.nullToString(this.jewellerydismantlingFrom.value.MET_RATE_TYPE),
      "METAL_RATE": this.commonService.emptyToZero(this.jewellerydismantlingFrom.value.METAL_RATE),
      "NAVSEQNO": 0,
      "TOTALPCS": this.commonService.emptyToZero(this.jewellerydismantlingFrom.value.pcs),
      "TOTMETALAMOUNTFC": 0,
      "TOTMETALAMOUNTCC": 0,
      "TOTSTONEAMOUNTFC": 0,
      "TOTSTONEAMOUNTCC": 0,
      "TOTLABOURAMOUNTFC": 0,
      "TOTLABOURAMOUNTCC": 0,
      "TOTLOSSAMOUNTFC": 0,
      "TOTLOSSAMOUNTCC": 0,
      "TOTAMOUNTFC": 0,
      "TOTAMOUNTCC": 0,
      "HREMARKS": this.jewellerydismantlingFrom.value.narration || "",
      "GENSEQNO": 0,
      "PRINT_COUNT": 0,
      "AUTOPOSTING": true,
      "POSTDATE": "",
      "HTUSERNAME": this.jewellerydismantlingFrom.value.enteredby,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "Details": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "DESCRIPTION": "",
          "PCS": 0,
          "METAL_AMOUNTFC": 0,
          "METAL_AMOUNTCC": 0,
          "STONE_AMOUNTFC": 0,
          "STONE_AMOUNTCC": 0,
          "LABOR_AMOUNTFC": 0,
          "LABOR_AMOUNTCC": 0,
          "LOSS_AMOUNTFC": 0,
          "LOSS_AMOUNTCC": 0,
          "SETTINGCHARGEFC": 0,
          "SETTINGCHARGECC": 0,
          "POLISHCHARGEFC": 0,
          "POLISHCHARGECC": 0,
          "RHODIUMCHARGEFC": 0,
          "RHODIUMCHARGECC": 0,
          "LABOURCHARGEFC": 0,
          "LABOURCHARGECC": 0,
          "MISCLCHARGEFC": 0,
          "MISCLCHARGECC": 0,
          "TOTALAMOUNTFC": 0,
          "TOTALAMOUNTCC": 0,
          "MFGVOC_REF": "",
          "MFGVOC_DATE": "2023-10-19T09:20:05.269Z",
          "LOSS_ACCODE": "",
          "COST_CODE": "",
          "DIFF_TOTAL": 0,
          "RCVD_TOTAL": 0,
          "DIFF_WGT": 0,
          "DREMARKS": "",
          "DLOCTYPE_CODE": "",
          "DT_BRANCH_CODE": "",
          "DT_VOCTYPE": "",
          "DT_VOCNO": 0,
          "DT_YEARMONTH": "",
          "STKLOCTYPE_CODE": ""
        }
      ]
    }
  }

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.voctype) == '') {
      this.commonService.toastErrorByMsgId('MSG1939')// voctype  CANNOT BE EMPTY
      return true
    }
    else if (this.commonService.nullToString(form.vocdate) == '') {
      this.commonService.toastErrorByMsgId('MSG1331')//"vocdate cannot be empty"
      return true
    }

    return false;
  }


  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.submitValidations(this.jewellerydismantlingFrom.value)) return;
    // if (this.jewellerydismantlingFrom.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'DiamondDismantle/InsertDiamondDismantle'
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status.trim() == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.jewellerydismantlingFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
        console.log(err);
      })
    this.subscriptions.push(Sub)
  }


  update() {
    let form = this.jewellerydismantlingFrom.value
    let API = `DiamondDismantle/UpdateDiamondDismantle/${form.branchCode}/${form.voctype}/${form.vocno}/${form.yearMonth}`
    let postData = this.setPostData()
    this.isloading = true;
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        this.isloading = false;
        if (result && result.status == "Success") {
          this.isSaved = true;
          Swal.fire({
            title: this.comService.getMsgByID('MSG2443') || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.jewellerydismantlingFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
        else {
          this.comService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.isloading = false;
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
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
        let form = this.jewellerydismantlingFrom.value
        let API = 'DiamondDismantle/DeleteDiamondDismantle/' +
          this.content.BRANCH_CODE + '/' + this.content.VOCTYPE + '/' +
          this.content.VOCNO + '/' + this.content.YEARMONTH
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
                    this.jewellerydismantlingFrom.reset()
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
                    this.jewellerydismantlingFrom.reset()
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
