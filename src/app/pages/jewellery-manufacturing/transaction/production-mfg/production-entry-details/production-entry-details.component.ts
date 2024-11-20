import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import { NgbActiveModal, NgbModal, NgbModalRef, } from "@ng-bootstrap/ng-bootstrap";
import { ProductionStockDetailComponent } from "../production-stock-detail/production-stock-detail.component";
import { SavedataModel } from "../savedata-model";
import Swal from "sweetalert2";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";

@Component({
  selector: "app-production-entry-details",
  templateUrl: "./production-entry-details.component.html",
  styleUrls: ["./production-entry-details.component.scss"],
})
export class ProductionEntryDetailsComponent implements OnInit {
  @ViewChild('jobnoCodeOverlay') jobnoCodeOverlay!: MasterSearchComponent;
  @ViewChild('customerCodeOverlay') customerCodeOverlay!: MasterSearchComponent;
  @ViewChild('designCodeOverlay') designCodeOverlay!: MasterSearchComponent;
  @ViewChild('locationCodeOverlay') locationCodeOverlay!: MasterSearchComponent;
  @ViewChild('loctypeCodeOverlay') loctypeCodeOverlay!: MasterSearchComponent;
  @ViewChild('price1CodeOverlay') price1CodeOverlay!: MasterSearchComponent;
  @ViewChild('prefixCodeOverlay') prefixCodeOverlay!: MasterSearchComponent;
  @ViewChild('price2CodeOverlay') price2CodeOverlay!: MasterSearchComponent;
  @ViewChild('price3CodeOverlay') price3CodeOverlay!: MasterSearchComponent;
  @ViewChild('price4CodeOverlay') price4CodeOverlay!: MasterSearchComponent;
  @ViewChild('price5CodeOverlay') price5CodeOverlay!: MasterSearchComponent;
  @ViewChild('costCodeOverlay') costCodeOverlay!: MasterSearchComponent;
  @ViewChild('priceSchemeOverlay') priceSchemeOverlay!: MasterSearchComponent;
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  divisionMS: any = "ID";
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
  modalStock!: NgbModalRef;
  modalReference!: NgbModalRef;
  FORM_VALIDATER: any;
  columnheadTop: any[] = [""];
  columnheadBottom: any[] = [""];
  tableData: any[] = [];
  imagepath: any[] = []
  JOB_PRODUCTION_SUB_DJ: any[] = []
  JOB_PRODUCTION_STNMTL_DJ: any[] = []
  metalDetailData: any[] = []
  pendingProcess: any[] = []
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
    SEARCH_HEADING: 'Job search',
    SEARCH_VALUE: '',
    WHERECONDITION: `JOB_CLOSED_ON is null and  Branch_code = '${this.commonService.branchCode}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
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
    SRNO: [0],
    FLAG: [''],
    BRANCH_CODE: [''],
    JOB_NUMBER: ['', Validators.required],
    JOB_DESCRIPTION: [''],
    JOB_DATE: [''],
    UNQ_JOB_ID: [''],
    SUB_JOB_DESCRIPTION: [''],
    CUSTOMER_CODE: [''],
    CUSTOMER_DESC: [''],
    METALLAB_TYPE: [''],
    PROCESS_CODE: [''],
    PROCESS_NAME: [''],
    WORKER_CODE: [''],
    WORKER_NAME: [''],
    PART_NAME: [''],
    PART_CODE: [''],
    DESIGN_CODE: [''],
    DESIGN_TYPE: [''],
    DESIGN_DESCRIPTION: [''],
    TOTAL_PCS: [''],
    JOB_PCS: [''],
    LOCTYPE_CODE: [''],
    UNQ_DESIGN_ID: [''],
    LOSS_WT: [''],
    GROSS_WT: [''],
    STONE_PCS: [''],
    timetaken: [''],
    METAL_WT: [''],
    STONE_WT: [''],
    price1: [''],
    PREFIX: [''],
    PREFIX_LASTNO: [''],
    PREFIXNO: [''],
    OTHER_STONE: [''],
    price2: [''],
    COST_CODE: [''],
    SETREF: [''],
    price3: [''],
    KARAT_CODE: [''],
    price4: [''],
    START_DATE: [''],
    END_DATE: [''],
    endDate: [''],
    price5: [''],
    remarks: [''],
    prodpcs: [''],
    PENDING_PCS: [''],
    LOSS_PER: [''],
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
    PURITY_DIFF: [''],
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
    Job_Purity: [''],
    SUPPLIER_REF: [''],
    VOCDATE: [''],
    METALSTONE: [''],
    DIVCODE: [''],
    STOCK_CODE: [''],
    STOCK_DESCRIPTION: [''],
    JOB_SO_NUMBER: [''],
    pricescheme: [''],
    WASTAGE_WT: [''],
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private renderer: Renderer2,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.setHeaderDetails()
    this.setInitialValues()
  }
  setHeaderDetails() {
    this.branchCode = this.commonService.branchCode;
    this.HEADERDETAILS = this.content[0].HEADERDETAILS
    this.productiondetailsFrom.controls.VOCDATE.setValue(this.HEADERDETAILS.VOCDATE)
    this.productiondetailsFrom.controls.BRANCH_CODE.setValue(this.commonService.branchCode)
    let branchParam = this.commonService.allbranchMaster
    this.productiondetailsFrom.controls.LOCTYPE_CODE.setValue(branchParam.DMFGMLOC)
    this.FORM_VALIDATER = this.productiondetailsFrom.value
  }
  setInitialValues() {
    if (!this.content) return
    let parentDetail: any;
    let PRODUCTION_FORMDETAILS: any;
    if (this.content[0]?.FLAG) {
      this.setFlagMode(this.content[0]?.FLAG)
      this.productiondetailsFrom.controls.FLAG.setValue(this.content[0]?.FLAG)
      parentDetail = this.content[0]?.JOB_PRODUCTION_DETAIL_DJ
    } else {// condition to load without saving
      parentDetail = this.content[0]?.JOB_PRODUCTION_DETAIL_DJ
      if (!parentDetail || parentDetail.JOB_NUMBER == '') {
        this.renderer.selectRootElement('#jobNoSearch')?.focus();
      }
      PRODUCTION_FORMDETAILS = this.content[0]?.PRODUCTION_FORMDETAILS
    }
    if (!parentDetail) return;
    this.productiondetailsFrom.controls.SRNO.setValue(this.content[0]?.SRNO)
    this.designType = this.commonService.nullToString(parentDetail.DESIGN_TYPE?.toUpperCase())
    this.setFormNullToString('DESIGN_TYPE', parentDetail.DESIGN_TYPE?.toUpperCase())
    this.setFormNullToString('JOB_NUMBER', parentDetail.JOB_NUMBER)
    this.setFormNullToString('JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.setFormNullToString('UNQ_JOB_ID', parentDetail.UNQ_JOB_ID)
    this.setFormNullToString('SUB_JOB_DESCRIPTION', parentDetail.JOB_DESCRIPTION)
    this.setFormNullToString('SEQ_CODE', parentDetail.SEQ_CODE)
    this.setFormNullToString('remarks', parentDetail.remarks)
    this.setFormNullToString('DIVCODE', parentDetail.DIVCODE)
    this.setFormNullToString('METALSTONE', parentDetail.METALSTONE)
    this.setFormNullToString('PRODLAB_ACCODE', parentDetail.PRODLAB_ACCODE)
    this.setFormNullToString('SCRAP_DIVCODE', parentDetail.SCRAP_DIVCODE)
    this.setFormNullToString('DESIGN_CODE', parentDetail.DESIGN_CODE)
    this.setFormNullToString('TREE_NO', parentDetail.TREE_NO)
    this.setFormNullToString('JOB_SO_NUMBER', parentDetail.JOB_SO_NUMBER)
    this.setFormNullToString('JOB_DATE', parentDetail.JOB_DATE)
    this.setFormNullToString('JOB_PCS', parentDetail.JOB_PCS)
    this.setFormNullToString('CUSTOMER_CODE', parentDetail.CUSTOMER_CODE)
    this.setFormNullToString('PREFIX', parentDetail.PREFIX)
    this.setFormNullToString('SUPPLIER_REF', parentDetail.SUPPLIER_REF)
    this.setFormNullToString('COST_CODE', parentDetail.COST_CODE)
    this.setFormNullToString('UNQ_DESIGN_ID', parentDetail.UNQ_DESIGN_ID)
    this.setFormNullToString('JOB_SO_NUMBER', parentDetail.JOB_SO_NUMBER)
    this.setFormNullToString('STOCK_CODE', parentDetail.STOCK_CODE)
    this.setFormNullToString('DIVCODE', parentDetail.DIVCODE)
    this.setFormNullToString('METALSTONE', parentDetail.METALSTONE)
    this.setFormNullToString('PURE_WT', parentDetail.PURE_WT)
    this.setFormNullToString('KARAT_CODE', parentDetail.KARAT_CODE)
    this.setFormNullToString('TOTAL_PCS', parentDetail.PCS)
    this.setFormNullToString('WORKER_CODE', parentDetail.WORKER_CODE)
    this.setFormNullToString('WORKER_NAME', parentDetail.WORKER_NAME)
    this.setFormNullToString('PROCESS_CODE', parentDetail.PROCESS_CODE)
    this.setFormNullToString('PROCESS_NAME', parentDetail.PROCESS_NAME)
    this.setFormDecimal('METAL_WT', parentDetail.METAL_WT, 'METAL')
    this.setFormDecimal('STONE_WT', parentDetail.STONE_WT, 'STONE')
    this.setFormDecimal('GROSS_WT', parentDetail.GROSS_WT, 'METAL')
    this.setFormDecimal('PUREWT', parentDetail.PUREWT, 'METAL')
    this.setFormDecimal('PURITY', parentDetail.PURITY, 'PURITY')
    this.setFormDecimal('Job_Purity', parentDetail.PURITY, 'PURITY')
    if (PRODUCTION_FORMDETAILS) {
      this.setFormNullToString('DESIGN_DESCRIPTION', PRODUCTION_FORMDETAILS.DESIGN_DESCRIPTION)
      this.setFormNullToString('CUSTOMER_DESC', PRODUCTION_FORMDETAILS.CUSTOMER_DESC)
      this.setFormNullToString('METALLAB_TYPE', PRODUCTION_FORMDETAILS.METALLAB_TYPE)
      this.setFormNullToString('METAL_STOCK_CODE', PRODUCTION_FORMDETAILS.METAL_STOCK_CODE)
      this.setFormNullToString('PREFIXNO', PRODUCTION_FORMDETAILS.PREFIXNO)
      this.setFormNullToString('PART_CODE', PRODUCTION_FORMDETAILS.PART_CODE)
      this.setFormNullToString('PART_NAME', PRODUCTION_FORMDETAILS.PART_NAME)
      this.setFormNullToString('PREFIX_LASTNO', PRODUCTION_FORMDETAILS.PREFIX_LASTNO)
    }

    if (this.designType == 'METAL') {
      // this.onLoadMetalDetail(parentDetail)
    } else {

    }
    this.FORM_VALIDATER = this.productiondetailsFrom.value
  }
  setFlagMode(FLAG: any) {
    switch (FLAG) {
      case 'VIEW':
        this.viewMode = true;
        break;
      case 'EDIT':
        this.editMode = true;
        break;
      default:
        this.viewMode = false;
        this.editMode = false;
        break;
    }
  }
  getDesignimagecode() {
    let API = `Image/${this.productiondetailsFrom.value.JOB_NUMBER}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          this.imagepath = data.map((item: any) => item.imagepath)
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  customerCodeScpSelected(e: any) {
    this.productiondetailsFrom.controls.CUSTOMER_CODE.setValue(e.ACCODE);
    this.productiondetailsFrom.controls.CUSTOMER_DESC.setValue(e.ACCOUNT_HEAD);
  }
  karatCodeSelected(e: any) {
    this.productiondetailsFrom.controls.KARAT_CODE.setValue(e.KARAT_CODE);
  }
  costCodeSelected(e: any) {
    this.productiondetailsFrom.controls.COST_CODE.setValue(e.COST_CODE);
  }
  prefixCodeSelected(e: any) {
    this.productiondetailsFrom.controls.PREFIX.setValue(e.PREFIX_CODE);
    this.prefixCodeValidate()
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
  validatePurity() {
    let form = this.productiondetailsFrom.value
    if (this.emptyToZero(form.PURITY) <= 0) {
      this.commonService.toastErrorByMsgId("MSG1703");//"purity cannot be zero/negative"
      this.setFormDecimal('PURITY', this.FORM_VALIDATER.PURITY, 'PURITY')
      return
    }
    else if (this.emptyToZero(form.PURITY) >= 1.01) {
      this.commonService.toastErrorByMsgId("MSG1701");//"Purity cannot be Morethan 1.01000"
      this.setFormDecimal('PURITY', this.FORM_VALIDATER.PURITY, 'PURITY')
      return
    }
    let dblTmpNetWt = 0;

    dblTmpNetWt = this.emptyToZero(form.METAL_WT);
    let actualPureWt = this.commonService.pureWeightCalculate(dblTmpNetWt,this.emptyToZero(form.Job_Purity));
    let newPureWt = this.commonService.pureWeightCalculate(dblTmpNetWt,this.emptyToZero(form.PURITY))
    
    actualPureWt = this.commonService.decimalQuantityFormat(actualPureWt, 'METAL');
    newPureWt = this.commonService.decimalQuantityFormat(newPureWt, 'METAL');
    this.setValueWithDecimal('PURE_WT',newPureWt, 'METAL')
    let txtDPurityDiff = this.commonService.purityDiffCalculate(actualPureWt,newPureWt);
    this.setValueWithDecimal('PURITY_DIFF',txtDPurityDiff, 'METAL')
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
  prefixCodeValidate() {
    let API = 'PrefixMaster/GetPrefixMasterDetail/' + this.productiondetailsFrom.value.PREFIX
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.response) {
          let data = result.response;
          this.productiondetailsFrom.controls.PREFIX_LASTNO.setValue(data.LAST_NO)
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
          if (data[0] && this.commonService.nullToString(data[0].UNQ_JOB_ID) != '') {
            this.setFormNullToString('JOB_NUMBER', data[0].JOB_NUMBER)
            this.setFormNullToString('UNQ_JOB_ID', data[0].UNQ_JOB_ID)
            this.setFormNullToString('JOB_DESCRIPTION', data[0].JOB_DESCRIPTION)
            this.setFormNullToString('SUB_JOB_DESCRIPTION', data[0].DESCRIPTION)
            this.setFormNullToString('JOB_DATE', data[0].JOB_DATE)
            this.setFormNullToString('JOB_PCS', data[0].JOB_PCS_TOTAL)
            this.setFormNullToString('DESIGN_CODE', data[0].DESIGN_CODE)
            this.setFormNullToString('DESIGN_DESCRIPTION', data[0].DESCRIPTION)
            this.setFormNullToString('CUSTOMER_CODE', data[0].CUSTOMER_CODE)
            this.setFormNullToString('CUSTOMER_DESC', data[0].ACCOUNT_HEAD)
            this.setFormNullToString('SEQ_CODE', data[0].SEQ_CODE)
            this.setFormNullToString('METALLAB_TYPE', data[0].METALLAB_TYPE)
            this.setFormNullToString('DESIGN_TYPE', data[0].DESIGN_TYPE?.toUpperCase())
            this.setFormNullToString('METAL_STOCK_CODE', data[0].METAL_STOCK_CODE)
            this.setFormNullToString('SUPPLIER_REF', data[0].DESIGN_CODE + "-" + data[0].METAL_COLOR)
            this.setFormNullToString('PREFIX', data[0].PREFIX)
            this.setFormNullToString('PREFIX_LASTNO', data[0].LAST_NO)
            this.setFormNullToString('PREFIXNO', data[0].PREFIX_NUMBER)
            this.setFormNullToString('COST_CODE', data[0].COST_CODE)
            this.setFormNullToString('PART_CODE', data[0].DESIGN_CODE)
            this.setFormNullToString('PART_NAME', data[0].DESCRIPTION)
            this.designType = this.commonService.nullToString(data[0].DESIGN_TYPE?.toUpperCase());
            this.subJobNumberValidate()
            this.getDesignimagecode()
          } else {
            this.setFormNullToString('JOB_NUMBER', '')
            this.commonService.toastErrorByMsgId('MSG1871')
            this.jobnoCodeOverlay.showOverlayPanel(event)
            return
          }
        } else {
          this.jobnoCodeOverlay.showOverlayPanel(event)
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
    // let postData = {
    //   "SPID": "117",
    //   "parameter": {
    //     'Job_Number': this.productiondetailsFrom.value.JOB_NUMBER,
    //     'DesignType': this.commonService.nullToString(this.designType),
    //     'BranchCode': this.commonService.nullToString(this.branchCode)
    //   }
    // }
    let postData = {
      "SPID": "040",
      "parameter": {
        'strUNQ_JOB_ID': this.productiondetailsFrom.value.UNQ_JOB_ID,
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
          // let result3 = result.dynamicData[2]
          // this.setVendorRef(result) //supplier ref 

          this.setFormNullToString('PROCESS_CODE', data[0].PROCESS)
          this.setFormNullToString('PROCESS_NAME', data[0].PROCESSDESC)
          this.setFormNullToString('WORKER_CODE', data[0].WORKER)
          this.setFormNullToString('WORKER_NAME', data[0].WORKERDESC)
          this.setFormNullToString('UNQ_DESIGN_ID', data[0].UNQ_DESIGN_ID)
          this.setFormNullToString('JOB_SO_NUMBER', data[0].JOB_SO_NUMBER)
          this.setFormNullToString('STOCK_CODE', data[0].STOCK_CODE)
          this.setFormNullToString('DIVCODE', data[0].DIVCODE)
          this.setFormNullToString('METALSTONE', data[0].METALSTONE)
          this.setFormNullToString('PURE_WT', data[0].PURE_WT)
          this.setFormNullToString('KARAT_CODE', data[0].KARAT)
          this.setFormNullToString('TOTAL_PCS', data[0].PCS)
          this.setFormDecimal('STONE_WT', data[0].STONE, 'STONE')
          this.setFormDecimal('GROSS_WT', data[0].METAL, 'METAL')
          this.setFormDecimal('PUREWT', data[0].PUREWT, 'METAL')
          this.setFormDecimal('PURITY', data[0].PURITY, 'PURITY')
          this.setFormDecimal('Job_Purity', data[0].PURITY, 'PURITY')
          this.setFormDecimal('STONE_PCS', 0, '')
          this.setFormDecimal('OTHER_STONE', 0, 'STONE')
          this.setFormDecimal('PURITY_DIFF', 0, 'METAL')

          if (data.length > 0) {
            let metalWt = 0
            data.forEach((element: any) => {
              metalWt += element.METAL
            });
            this.setFormDecimal('METAL_WT', metalWt, 'METAL')
          }
          this.FORM_VALIDATER = this.productiondetailsFrom.value
          if (data[0].PROCESS?.toUpperCase() != 'FINAL') this.pendingProcessValidate()
          // this.fillStoneDetails()
        } else {
          // this.commonService.toastErrorByMsgId('MSG1747');
          this.showConfirmationDialog(this.commonService.getMsgByID('MSG1456'))
        }
        this.setPendingPcs(result)
      }, err => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
      })
    this.subscriptions.push(Sub)
  }
  setPendingPcs(result: any) {
    if (result.dynamicData && result.dynamicData[1].length > 0) {
      let PCSdata = result.dynamicData[1] || []
      let TxtPendingPcs = 0
      if (this.emptyToZero(PCSdata.PENDING_PCS) > 0) {
        TxtPendingPcs = this.emptyToZero(this.productiondetailsFrom.value.TOTAL_PCS) - this.emptyToZero(PCSdata.PENDING_PCS);
      } else {
        TxtPendingPcs = this.emptyToZero(this.productiondetailsFrom.value.TOTAL_PCS);
      }
      this.setFormDecimal('PENDING_PCS', TxtPendingPcs, '')
    }
  }
  /**USE: subjobnumber validate API call*/
  pendingProcessValidate(event?: any) {
    let postData = {
      "SPID": "111",
      "parameter": {
        'SubJobNo': this.commonService.nullToString(this.productiondetailsFrom.value.UNQ_JOB_ID),
        'UNQ_DESIGN_ID': this.commonService.nullToString(this.productiondetailsFrom.value.UNQ_DESIGN_ID),
        'BRANCHCODE': this.commonService.nullToString(this.branchCode),
        'VOCDATE': this.commonService.nullToString(this.productiondetailsFrom.value.VOCDATE),
        'JobNo': this.commonService.nullToString(this.productiondetailsFrom.value.JOB_NUMBER),
        'Designtype': this.commonService.nullToString(this.designType),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')//loading msg
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.dynamicData && result.dynamicData[0].length > 0) {
          let data = result.dynamicData[0] || []
          let processMsg = "";
          this.pendingProcess = [];
          for (let i = 0; i < data.length; i++) {
            processMsg += data[i]["PCS"] + " PCS , " + data[i]["GRWT"] + " Weight in ";
            processMsg += data[i]["WORKER_CODE"] + " Worker  On " + data[i]["PROCESS_CODE"] + " Process ";
            this.pendingProcess.push({ PROCESS: processMsg })
            processMsg = ""
          }
          this.openPendingProcessModal()
        } else {
          // this.commonService.toastErrorByMsgId('MSG1456');
          this.showConfirmationDialog(this.commonService.getMsgByID('MSG1456'))
        }
      }, err => {
        this.commonService.closeSnackBarMsg();
        this.commonService.toastErrorByMsgId('MSG1531');
      })
    this.subscriptions.push(Sub)
  }
  setVendorRef(result: any) {
    if (result.dynamicData && result.dynamicData[1].length > 0) {
      let dtSubCategory: any[] = result.dynamicData[1] || []
      if (dtSubCategory?.length > 0) {
        let strSupplierRef = this.productiondetailsFrom.value.SUPPLIER_REF
        for (let i = 0; i < dtSubCategory.length; i++) {
          strSupplierRef = strSupplierRef + dtSubCategory[i]["SUBCATEGORY_CODE"];
        }
        if (strSupplierRef.toString().trim().length > 50) {
          strSupplierRef = strSupplierRef.toString().trim().substring(0, 50);
        }
        this.productiondetailsFrom.controls.SUPPLIER_REF.setValue(strSupplierRef)
      }
    }
  }
  /**USE: fillStoneDetails grid data */
  private fillStoneDetails(): void {
    let form = this.productiondetailsFrom.value
    let postData = {
      "SPID": "042",
      "parameter": {
        strJobNumber: this.commonService.nullToString(form.JOB_NUMBER),
        strUnq_Job_Id: this.commonService.nullToString(form.UNQ_JOB_ID),
        strProcess_Code: this.commonService.nullToString(form.PROCESS_CODE),
        strWorker_Code: this.commonService.nullToString(form.WORKER_CODE),
        strBranch_Code: this.commonService.nullToString(this.branchCode)
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
          if (data) {
            this.metalDetailData = data

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
  @ViewChild('pendingProcessModal') public pendingProcessModal!: NgbModal;
  openPendingProcessModal() {
    this.modalReference = this.modalService.open(this.pendingProcessModal, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
    });
  }
  showConfirmationDialog(msg: string): Promise<any> {
    return Swal.fire({
      title: '',
      text: msg,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Ok'
    });
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }

  dataToDetailScreen: any;
  @ViewChild('productionStockDetailScreen') public ProductionStockDetailScreen!: NgbModal;
  opennewdetails() {
    this.content[0].FLAG = this.productiondetailsFrom.value.FLAG;
    this.content[0].DETAILSCREEN_DATA = this.productiondetailsFrom.value;
    this.content[0].HEADERDETAILS = this.content[0].HEADERDETAILS;
    this.dataToDetailScreen = this.content
    this.modalStock = this.modalService.open(this.ProductionStockDetailScreen, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  //use: to set the data from child component to post data
  setValuesToHeaderGrid(DATA: any) {
    this.JOB_PRODUCTION_SUB_DJ = DATA.STOCK_FORM_DETAILS || []
    this.JOB_PRODUCTION_STNMTL_DJ = DATA.STOCK_COMPONENT_GRID || []
    this.closeDetailScreen();
    // if (detailDataToParent.FLAG == 'CONTINUE') {
    //   this.commonService.showSnackBarMsg('Details added grid successfully')
    // };
  }
  jobnoCodeSelected(e: any) {
    this.productiondetailsFrom.controls.JOB_NUMBER.setValue(e.job_number);
    this.productiondetailsFrom.controls.JOB_DESCRIPTION.setValue(e.job_description);
    this.jobNumberValidate({ target: { value: e.job_number } })
  }

  locationCodeSelected(e: any) {
    this.productiondetailsFrom.controls.LOCTYPE_CODE.setValue(e.LOCATION_CODE);
  }
  formatDate(event?: any) {
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
  submitValidate(form: any) {
    try {
      if (this.commonService.nullToString(form.JOB_NUMBER) == '') {
        this.commonService.toastErrorByMsgId("MSG1358");//"Job Number cannot be empty",
        return true;
      }
      if (this.commonService.nullToString(form.UNQ_JOB_ID) == '') {
        this.commonService.toastErrorByMsgId("MSG1358");// "Job Number cannot be empty"
        return true;
      }
      if (this.commonService.nullToString(form.PROCESS_CODE) == '') {
        this.commonService.toastErrorByMsgId("MSG1680");//"Process Code cannot be empty"
        return true;
      }
      if (this.commonService.nullToString(form.WORKER_CODE) == '') {
        this.commonService.toastErrorByMsgId("MSG1951");//"Worker Code cannot be empty"
        return true;
      }
      if (this.designType != "METAL") {
        if (this.emptyToZero(form.JOB_PCS) <= 0) {
          this.commonService.toastErrorByMsgId("MSG1556");//"Pcs Cannot be -ve"
          return true;
        }

        if (this.commonService.nullToString(form.LOCTYPE_CODE) == '' && this.commonService.getBranchParamValue("DMFGSLOC")?.toString() != '') {
          this.commonService.toastErrorByMsgId("MSG1381");//Location Cannot be empty
          return true;
        }
        // if (dtProdDetail.Rows.Count <= 0) {
        //   this.commonService.toastErrorByMsgId("MSG1816");//Stock Code Cannot be Empty for diamond stock
        //   return true;
        // }

        // if (dtProdStnmtl.Rows.Count <= 0) {
        //   this.commonService.toastErrorByMsgId("MSG1199");//Detail Entry Cannot be empty for components 
        //   btnStock.Focus();
        //   return true;
        // }
        if (this.commonService.nullToString(form.PREFIX) == '') {
          this.commonService.toastErrorByMsgId("MSG1657");
          return true;
        }
      } else {
        if (this.commonService.nullToString(form.LOCTYPE_CODE) == '') {
          this.commonService.toastErrorByMsgId("MSG1381");//Location Cannot be empty
          return true;
        }
      }
      return false
    } catch (err) {
      return true
    }
  }
  formSubmit(flag: any) {
    if (this.submitValidate(this.productiondetailsFrom.value)) return;
    this.productiondetailsFrom.controls.FLAG.setValue(flag)

    let detailDataToParent: any = {
      PRODUCTION_FORMDETAILS: this.productiondetailsFrom.value,
      JOB_PRODUCTION_SUB_DJ: this.JOB_PRODUCTION_SUB_DJ,
      JOB_PRODUCTION_DETAIL_DJ: this.set_JOB_PRODUCTION_DETAIL_DJ(),
      JOB_PRODUCTION_STNMTL_DJ: this.JOB_PRODUCTION_STNMTL_DJ,
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
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, formControlName: string) {
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
          this.productiondetailsFrom.controls[formControlName].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.showOverleyPanel(event, formControlName);
          return
        }
        if (formControlName == 'PREFIX') this.prefixCodeValidate()
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }
  setFormNullToString(formControlName: string, value: any) {
    this.productiondetailsFrom.controls[formControlName]?.setValue(
      this.commonService.nullToString(value)
    )
    this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }
  setFormDecimal(formControlName: string, value: any, Decimal: string) {
    let result = Decimal ? this.commonService.setCommaSerperatedNumber(value, Decimal) : value
    this.productiondetailsFrom.controls[formControlName]?.setValue(result)
    this.FORM_VALIDATER[formControlName] = result
  }

  set_JOB_PRODUCTION_DETAIL_DJ() {
    let form = this.productiondetailsFrom.value;
    let parentForm = this.content[0].HEADERDETAILS
    return {
      "UNIQUEID": 0,
      "SRNO": this.emptyToZero(form.SRNO),
      "VOCNO": this.emptyToZero(parentForm?.VOCNO),
      "VOCTYPE": this.commonService.nullToString(parentForm?.VOCTYPE),
      "VOCDATE": this.commonService.formatDateTime(parentForm?.VOCDATE),
      "BRANCH_CODE": this.commonService.nullToString(form.BRANCH_CODE),
      "JOB_NUMBER": this.commonService.nullToString(form.JOB_NUMBER),
      "JOB_DATE": this.commonService.formatDateTime(form.JOB_DATE),
      "JOB_SO_NUMBER": this.commonService.emptyToZero(form.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.commonService.nullToString(form.UNQ_JOB_ID),
      "JOB_DESCRIPTION": this.commonService.nullToString(form.JOB_DESCRIPTION),
      "UNQ_DESIGN_ID": this.commonService.nullToString(form.UNQ_DESIGN_ID),
      "DESIGN_CODE": this.commonService.nullToString(form.DESIGN_CODE),
      "DIVCODE": this.commonService.nullToString(form.DIVCODE),
      "PREFIX": this.commonService.nullToString(form.PREFIX),
      "STOCK_CODE": this.commonService.nullToString(form.STOCK_CODE),
      "STOCK_DESCRIPTION": this.commonService.nullToString(form.STOCK_DESCRIPTION),
      "SET_REF": this.commonService.nullToString(form.SET_REF),
      "KARAT_CODE": this.commonService.nullToString(form.KARAT_CODE),
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": this.commonService.emptyToZero(form.JOB_PCS),
      "GROSS_WT": this.commonService.emptyToZero(form.GROSS_WT),
      "METAL_PCS": 0,
      "METAL_WT": this.commonService.emptyToZero(form.METAL_WT),
      "STONE_PCS": this.commonService.emptyToZero(form.STONE_PCS),
      "STONE_WT": this.commonService.emptyToZero(form.STONE_WT),
      "LOSS_WT": this.commonService.emptyToZero(form.LOSS_WT),
      "NET_WT": this.commonService.emptyToZero(form.GROSS_WT),
      "PURITY": this.commonService.emptyToZero(form.PURITY),
      "PURE_WT": this.commonService.emptyToZero(form.PURE_WT),
      "RATE_TYPE": this.commonService.nullToString(parentForm.METAL_RATE_TYPE),
      "METAL_RATE": this.commonService.emptyToZero(parentForm.METAL_RATE),
      "CURRENCY_CODE": this.commonService.nullToString(parentForm.CURRENCY_CODE),
      "CURRENCY_RATE": this.commonService.emptyToZero(parentForm.CURRENCY_RATE),
      "METAL_GRM_RATEFC": 0,
      "METAL_GRM_RATELC": 0,
      "METAL_AMOUNTFC": 0,
      "METAL_AMOUNTLC": 0,
      "MAKING_RATEFC": 0,
      "MAKING_RATELC": 0,
      "MAKING_AMOUNTFC": 0,
      "MAKING_AMOUNTLC": 0,
      "STONE_RATEFC": 0,
      "STONE_RATELC": 0,
      "STONE_AMOUNTFC": 0,
      "STONE_AMOUNTLC": 0,
      "LAB_AMOUNTFC": 0,
      "LAB_AMOUNTLC": 0,
      "RATEFC": 0,
      "RATELC": 0,
      "AMOUNTFC": 0,
      "AMOUNTLC": 0,
      "PROCESS_CODE": this.commonService.nullToString(form.PROCESS_CODE),
      "PROCESS_NAME": this.commonService.nullToString(form.PROCESS_NAME),
      "WORKER_CODE": this.commonService.nullToString(form.WORKER_CODE),
      "WORKER_NAME": this.commonService.nullToString(form.WORKER_NAME),
      "IN_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "OUT_DATE": this.commonService.formatDateTime(this.commonService.currentDate),
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": this.commonService.nullToString(form.COST_CODE),
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": "",
      "METAL_DIVISION": "",
      "PRICE1PER": this.commonService.nullToString(form.price1per),
      "PRICE2PER": this.commonService.nullToString(form.price2per),
      "PRICE3PER": this.commonService.nullToString(form.price3per),
      "PRICE4PER": this.commonService.nullToString(form.price4per),
      "PRICE5PER": this.commonService.nullToString(form.price5per),
      "LOCTYPE_CODE": this.commonService.nullToString(form.LOCTYPE_CODE),
      "WASTAGE_WT": this.emptyToZero(form.WASTAGE_WT),
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "CUSTOMER_CODE": this.commonService.nullToString(form.CUSTOMER_CODE),
      "OUTSIDEJOB": true,
      "LAB_ACCODE": "",
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": this.commonService.nullToString(form.SUPPLIER_REF),
      "TAGLINES": "",
      "SETTING_CHRG": this.emptyToZero(form.settingChrg),
      "POLISH_CHRG": this.emptyToZero(form.polishChrg),
      "RHODIUM_CHRG": this.emptyToZero(form.rhodiumChrg),
      "LABOUR_CHRG": this.emptyToZero(form.labourChrg),
      "MISC_CHRG": this.emptyToZero(form.miscChrg),
      "SETTING_ACCODE": this.commonService.nullToString(form.settingChrgDesc),
      "POLISH_ACCODE": this.commonService.nullToString(form.polishChrgDesc),
      "RHODIUM_ACCODE": this.commonService.nullToString(form.rhodiumChrgDesc),
      "LABOUR_ACCODE": this.commonService.nullToString(form.labourChrgDesc),
      "MISC_ACCODE": this.commonService.nullToString(form.miscChrgDesc),
      "WAST_ACCODE": this.commonService.nullToString(form.wastage),
      "REPAIRJOB": 0,
      "PRICE1FC": this.emptyToZero(form.price1fc),
      "PRICE2FC": this.emptyToZero(form.price2fc),
      "PRICE3FC": this.emptyToZero(form.price3fc),
      "PRICE4FC": this.emptyToZero(form.price4fc),
      "PRICE5FC": this.emptyToZero(form.price5fc),
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "YEARMONTH": "",
      "BASE_CONV_RATE": 0,
      "OTH_STONE_WT": 0,
      "OTH_STONE_AMT": 0,
      "HANDLING_ACCODE": "",
      "FROM_STOCK_CODE": "",
      "TO_STOCK_CODE": "",
      "JOB_PURITY": 0,
      "LOSS_PUREWT": 0,
      "PUDIFF": 0,
      "STONEDIFF": 0,
      "CHARGABLEWT": 0,
      "BARNO": "",
      "LOTNUMBER": "",
      "TICKETNO": "",
      "PROD_PER": 0,
      "PURITY_PER": 0,
      "DESIGN_TYPE": this.commonService.nullToString(form.DESIGN_TYPE),
      "D_REMARKS": "",
      "BARCODEDQTY": 0,
      "BARCODEDPCS": 0,
      "STOCK_PUREWT": 0
    }
  }
  set_JOB_PRODUCTION_STNMTL_DJ() {
    return []
  }
  /**Labour charge detail data to save */
  set_JOB_PRODUCTION_LABCHRG_DJ() {
    return {
      "REFMID": 0,
      "BRANCH_CODE": "",
      "YEARMONTH": "",
      "VOCTYPE": "",
      "VOCNO": 0,
      "SRNO": 0,
      "JOB_NUMBER": "",
      "STOCK_CODE": "",
      "UNQ_JOB_ID": "",
      "METALSTONE": "",
      "DIVCODE": "",
      "PCS": 0,
      "GROSS_WT": 0,
      "LABOUR_CODE": "",
      "LAB_RATE": 0,
      "LAB_ACCODE": "",
      "LAB_AMTFC": 0,
      "UNITCODE": "",
      "DIVISION": "",
      "WASTAGE_PER": 0,
      "WASTAGE_QTY": 0,
      "WASTAGE_AMT": 0,
      "WASTAGE_RATE": 0,
      "KARAT_CODE": ""
    }
  }
  set_JOB_PRODUCTION_METALRATE_DJ() {
    return {
      "REFMID": 0,
      "SRNO": 0,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "DT_BRANCH_CODE": "",
      "DT_VOCTYPE": "",
      "DT_VOCNO": 0,
      "DT_YEARMONTH": "",
      "DIVISION_CODE": "",
      "SYSTEM_DATE": "2023-10-17T12:41:20.127Z",
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
      "CONV_FACTOR": 0
    }
  }
  txtLossQty_Validating() {
    this.calcualteLossPercentage()
  }
  calcualteLossPercentage() {
    let form = this.productiondetailsFrom.value;
    if (this.emptyToZero(form.LOSS_WT) > 0) {
      let txtLossPer = this.commonService.lossPercentageCalculate(form.LOSS_WT, form.METAL_WT);
      this.setFormDecimal('LOSS_PER', txtLossPer, 'AMOUNT')
    }
  }
  txtMetal_Wt_Validating() {
    this.calcualteLossPercentage()
  }
  emptyToZero(value: any) {
    return this.commonService.emptyToZero(value)
  }
  closeDetailScreen() {
    this.modalStock.close()
  }
  setValueWithDecimal(formControlName: string, value: any, Decimal: string) {
    this.productiondetailsFrom.controls[formControlName].setValue(
      this.commonService.setCommaSerperatedNumber(value, Decimal)
    )
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
    if (event.target.value != '') return
    switch (formControlName) {
      case 'JOB_NUMBER':
        this.jobnoCodeOverlay.showOverlayPanel(event);
        break;
      case 'CUSTOMER_CODE':
        this.customerCodeOverlay.showOverlayPanel(event);
        break;
      case 'DESIGN_CODE':
        this.designCodeOverlay.showOverlayPanel(event);
        break;
      case 'location':
        this.locationCodeOverlay.showOverlayPanel(event);
        break;
      case 'LOCTYPE_CODE':
        this.loctypeCodeOverlay.showOverlayPanel(event);
        break;
      case 'price1':
        this.price1CodeOverlay.showOverlayPanel(event);
        break;
      case 'PREFIX':
        this.prefixCodeOverlay.showOverlayPanel(event);
        break;
      case 'price2':
        this.price2CodeOverlay.showOverlayPanel(event);
        break;
      case 'price3':
        this.price3CodeOverlay.showOverlayPanel(event);
        break;
      case 'price4':
        this.price4CodeOverlay.showOverlayPanel(event);
        break;
      case 'price5':
        this.price5CodeOverlay.showOverlayPanel(event);
        break;
      case 'COST_CODE':
        this.costCodeOverlay.showOverlayPanel(event);
        break;
      // case 'CUSTOMER_CODE':
      //   this.priceSchemeOverlay.showOverlayPanel(event);
      //   break;
      default:
    }
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
