import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { NgbActiveModal, NgbModal, NgbModalRef, } from "@ng-bootstrap/ng-bootstrap";
import { ProductionStockDetailComponent } from "../production-stock-detail/production-stock-detail.component";
import { SavedataModel } from "../savedata-model";

@Component({
  selector: "app-production-entry-details",
  templateUrl: "./production-entry-details.component.html",
  styleUrls: ["./production-entry-details.component.scss"],
})
export class ProductionEntryDetailsComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  divisionMS: any = "ID";
  columnheadTop: any[] = [""];
  columnheadBottom: any[] = [""];
  tableData: any[] = [];
  viewMode: boolean = false;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  HEADERDETAILS: any;
  editMode: boolean = false;
  designType: string = 'DIAMOND';
  userName = this.commonService.userName;
  branchCode?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  StockDetailData: SavedataModel = {
    DETAIL_FORM_DATA: {},
    DETAIL_METAL_DATA: [],
    STOCK_FORM_DETAILS: [],
    STOCKCODE_MAIN_GRID: [],
    STOCK_COMPONENT_GRID: [],
    STOCK_GROUPED_GRID: [],
  }
  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Job Number',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 81,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
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
  };
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
  };
  prefixCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price1CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price2CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price3CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price4CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  price5CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  priceSchemeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 177,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Scheme',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: "DESIGN_CODE",
    SEARCH_HEADING: "Design Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "DESIGN_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  productiondetailsFrom: FormGroup = this.formBuilder.group({
    VOCNO: [0],
    FLAG: [''],
    jobno: [''],
    jobnoDesc: [''],
    JOB_DATE: [''],
    subjobno: [''],
    subjobnoDesc: [''],
    customer: [''],
    customerDesc: [''],
    process: [''],
    processname: [''],
    worker: [''],
    workername: [''],
    partsName: [''],
    PART_CODE: [''],
    DESIGN_CODE: [''],
    DESIGN_DESCRIPTION: [''],
    totalpcs: [''],
    JOB_PCS: [''],
    location: [''],
    LOSS_WT: [''],
    GROSS_WT: [''],
    grossWt: [''],
    STONE_PCS: [''],
    timetaken: [''],
    METAL_WT: [''],
    STONE_WT: [''],
    price1: [''],
    PREFIX: [''],
    PREFIXNO: [''],
    otherstone: [''],
    price2: [''],
    costcode: [''],
    SETREF: [''],
    price3: [''],
    KARAT: [''],
    venderref: [''],
    price4: [''],
    START_DATE: [''],
    END_DATE: [''],
    endDate: [''],
    price5: [''],
    remarks: [''],
    prodpcs: [''],
    pndpcs: [''],
    lossone: [''],
    fromStockCode: [''],
    fromStockCodeDesc: [''],
    toStockCode: [''],
    toStockCodeDesc: [''],
    metalpcs: [''],
    stoneWt: [''],
    PURITY: [''],
    netWt: [''],
    chargableWt: [''],
    purityPer: [''],
    PUREWT: [''],
    purityDiff: [''],
    stoneDiff: [''],
    loss: [''],
    mkgRate: [''],
    lotNo: [''],
    balwt: [''],
    mkgValue: [''],
    barNo: [''],
    ticketNo: [''],
    prod: [''],
    balPcs: [''],
    jobPurity: [''],
    PURE_WT: [''],
    PurityDiff: [''],
    Job_Purity: [''],
    VenderRef: [''],
    VOCDATE: [''],
    METALSTONE: [''],
    DIVCODE: [''],
    STOCK_CODE: [''],
    STOCK_DESCRIPTION: [''],
    JOB_SO_NUMBER: [''],
    pricescheme: [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.setInitialLoadValue()
  }

  getDesignimagecode() {
    let API = 'ImageforJobCad/' + this.productiondetailsFrom.value.PART_CODE;
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {

        this.urls = result.response[0].imagepath;
        console.log(this.urls)
      }, err => {
        this.commonService.toastErrorByMsgId('MSG81451')//Server Error
      })
    this.subscriptions.push(Sub)
  }

  setInitialLoadValue() {
    this.branchCode = this.commonService.branchCode;
    this.HEADERDETAILS = this.content[0].HEADERDETAILS
    this.productiondetailsFrom.controls.VOCDATE.setValue(this.HEADERDETAILS.vocDate)
  }
  customerCodeScpSelected(e: any) {
    this.productiondetailsFrom.controls.customer.setValue(e.ACCODE);
    this.productiondetailsFrom.controls.customerDesc.setValue(e.ACCOUNT_HEAD);
  }
  karatCodeSelected(e: any) {
    this.productiondetailsFrom.controls.KARAT.setValue(e.KARAT_CODE);
  }
  costCodeSelected(e: any) {
    this.productiondetailsFrom.controls.costcode.setValue(e.COST_CODE);
  }
  prefixCodeSelected(e: any) {
    this.productiondetailsFrom.controls.PREFIX.setValue(e.PREFIX_CODE);
  }
  price1CodeSelected(e: any) {
    this.productiondetailsFrom.controls.price1.setValue(e.PRICE_CODE);
  }

  price2CodeSelected(e: any) {
    this.productiondetailsFrom.controls.price2.setValue(e.PRICE_CODE);
  }

  price3CodeSelected(e: any) {
    this.productiondetailsFrom.controls.price3.setValue(e.PRICE_CODE);
  }

  price4CodeSelected(e: any) {
    this.productiondetailsFrom.controls.price4.setValue(e.PRICE_CODE);
  }

  price5CodeSelected(e: any) {
    this.productiondetailsFrom.controls.price5.setValue(e.PRICE_CODE);
  }

  designSelected(value: any) {
    this.productiondetailsFrom.controls.DESIGN_CODE.setValue(value.DESIGN_CODE);
    this.productiondetailsFrom.controls.DESIGN_DESCRIPTION.setValue(value.DESIGN_DESCRIPTION);
  }
  priceSchemeValidate(e: any) {
    this.productiondetailsFrom.controls.pricescheme.setValue(e.PRICE_CODE)
    let API = 'PriceSchemeMaster/GetPriceSchemeMasterList/' + this.productiondetailsFrom.value.pricescheme
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          let data = result.response;
          this.productiondetailsFrom.controls.price1.setValue(data.PRICE1)
          this.productiondetailsFrom.controls.price2.setValue(data.PRICE2)
          this.productiondetailsFrom.controls.price3.setValue(data.PRICE3)
          this.productiondetailsFrom.controls.price4.setValue(data.PRICE4)
          this.productiondetailsFrom.controls.price5.setValue(data.PRICE5)
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

  /**USE: jobnumber validate API call */
  jobNumberValidate(event: any) {
    if (event.target.value == '') return
    let postData = {
      "SPID": "028",
      "parameter": {
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strJobNumber': this.commonService.nullToString(event.target.value),
        'strCurrenctUser': this.commonService.nullToString(this.userName)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = result.dynamicData[0]
          if (data[0] && data[0].UNQ_JOB_ID != '') {
            this.productiondetailsFrom.controls.subjobno.setValue(data[0].UNQ_JOB_ID)
            this.productiondetailsFrom.controls.subjobnoDesc.setValue(data[0].JOB_DESCRIPTION)
            this.productiondetailsFrom.controls.JOB_DATE.setValue(data[0].JOB_DATE)
            this.productiondetailsFrom.controls.DESIGN_CODE.setValue(data[0].DESIGN_CODE)
            this.productiondetailsFrom.controls.DESIGN_DESCRIPTION.setValue(data[0].DESCRIPTION)
            this.productiondetailsFrom.controls.JOB_PCS.setValue(data[0].JOB_PCS_TOTAL)
            this.productiondetailsFrom.controls.customer.setValue(data[0].CUSTOMER_CODE)
            this.productiondetailsFrom.controls.PREFIX.setValue(data[0].PREFIX)
            this.productiondetailsFrom.controls.PREFIXNO.setValue(data[0].PREFIX_NUMBER)
            this.productiondetailsFrom.controls.costcode.setValue(data[0].COST_CODE)
            this.productiondetailsFrom.controls.PART_CODE.setValue(data[0].DESIGN_CODE)
            this.productiondetailsFrom.controls.partsName.setValue(data[0].DESCRIPTION)
            // this.productiondetailsFrom.controls.SEQ_CODE.setValue(data[0].SEQ_CODE)
            // this.productiondetailsFrom.controls.METALLAB_TYPE.setValue(data[0].METALLAB_TYPE)
            this.subJobNumberValidate()
            this.getDesignimagecode()
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
            return
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  /**USE: subjobnumber validate API call*/
  subJobNumberValidate(event?: any) {
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.productiondetailsFrom.value.subjobno,
        'strBranchCode': this.commonService.nullToString(this.branchCode),
        'strCurrenctUser': ''
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')//loading msg
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0]

          this.productiondetailsFrom.controls.process.setValue(data[0].PROCESS)
          this.productiondetailsFrom.controls.processname.setValue(data[0].PROCESSDESC)
          this.productiondetailsFrom.controls.worker.setValue(data[0].WORKER)
          this.productiondetailsFrom.controls.workername.setValue(data[0].WORKERDESC)
          this.productiondetailsFrom.controls.METAL_WT.setValue(
            this.commonService.decimalQuantityFormat(data[0].METAL, 'METAL'))
          this.productiondetailsFrom.controls.STONE_WT.setValue(
            this.commonService.decimalQuantityFormat(data[0].STONE, 'STONE'))
          this.productiondetailsFrom.controls.GROSS_WT.setValue(
            this.commonService.decimalQuantityFormat(Number(data[0].NETWT), 'METAL'))
          this.productiondetailsFrom.controls.PUREWT.setValue(data[0].PUREWT)
          this.productiondetailsFrom.controls.PURITY.setValue(
            this.commonService.decimalQuantityFormat(data[0].PURITY, 'PURITY'))
          this.productiondetailsFrom.controls.Job_Purity.setValue(
            this.commonService.decimalQuantityFormat(data[0].PURITY, 'PURITY'))
          this.productiondetailsFrom.controls.JOB_SO_NUMBER.setValue(data[0].JOB_SO_NUMBER)
          this.productiondetailsFrom.controls.STOCK_CODE.setValue(data[0].STOCK_CODE)
          this.productiondetailsFrom.controls.DIVCODE.setValue(data[0].DIVCODE)
          this.productiondetailsFrom.controls.METALSTONE.setValue(data[0].METALSTONE)
          this.productiondetailsFrom.controls.PURE_WT.setValue(data[0].PURE_WT)
          this.productiondetailsFrom.controls.KARAT.setValue(data[0].KARAT)
          this.productiondetailsFrom.controls.totalpcs.setValue(data[0].PCS)
        } else {
          this.commonService.toastErrorByMsgId('MSG1747');
        }
      }, err => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
      })
    this.subscriptions.push(Sub)
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }

  opennewdetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      ProductionStockDetailComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    this.content[0].DETAILSCREEN_DATA = this.productiondetailsFrom.value
    modalRef.componentInstance.content = this.content;

    modalRef.result.then((dataFromStockScreen) => {
      if (dataFromStockScreen) {
        console.log(dataFromStockScreen, 'data comming from stock detail screen');

        this.StockDetailData.STOCK_FORM_DETAILS = dataFromStockScreen.STOCK_FORM_DETAILS;
        this.StockDetailData.STOCK_COMPONENT_GRID = dataFromStockScreen.STOCK_COMPONENT_GRID;
      }
    });
  }

  jobnoCodeSelected(e: any) {
    this.productiondetailsFrom.controls.jobno.setValue(e.job_number);
    this.productiondetailsFrom.controls.jobnoDesc.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }


  locationCodeSelected(e: any) {
    this.productiondetailsFrom.controls.location.setValue(e.LOCATION_CODE);
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.productiondetailsFrom.controls.START_DATE.setValue(new Date(date));
      this.productiondetailsFrom.controls.END_DATE.setValue(new Date(date));
    }
  }
  set_JOB_PRODUCTION_SUB_DJ(){}
  set_JOB_PRODUCTION_DETAIL_DJ(){}
  set_JOB_PRODUCTION_STNMTL_DJ(){}
  set_JOB_PRODUCTION_LABCHRG_DJ(){}
  set_JOB_PRODUCTION_METALRATE_DJ(){}

  formSubmit(flag: any) {
    // if (this.designType == 'METAL') {
    //   if (this.submitValidateMetal(this.productiondetailsFrom.value)) return;
    // } else {
    //   if (this.submitValidations(this.productiondetailsFrom.value)) return;
    // }
    this.productiondetailsFrom.controls.FLAG.setValue(flag)

    let detailDataToParent: any = {
      PRODUCTION_FORMDETAILS: this.productiondetailsFrom.value,
      TRN_STNMTL_GRID: this.tableData,
      JOB_PRODUCTION_SUB_DJ: this.set_JOB_PRODUCTION_SUB_DJ(),
      JOB_PRODUCTION_DETAIL_DJ: this.set_JOB_PRODUCTION_DETAIL_DJ(),
      JOB_PRODUCTION_STNMTL_DJ: this.set_JOB_PRODUCTION_STNMTL_DJ(),
      JOB_PRODUCTION_LABCHRG_DJ: this.set_JOB_PRODUCTION_LABCHRG_DJ(),
      JOB_PRODUCTION_METALRATE_DJ: this.set_JOB_PRODUCTION_METALRATE_DJ(),
    }
    console.log(detailDataToParent, 'detailDataToParent');
    this.saveDetail.emit(detailDataToParent);
    if (flag == 'CONTINUE') {
      this.resetPTFDetails()
    }
  }
  resetPTFDetails() {
    this.productiondetailsFrom.reset()
    this.tableData = []
  }
  /**use: validate all lookups to check data exists in db */
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
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.productiondetailsFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
