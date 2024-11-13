import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { ProductionEntryDetailsComponent } from '../production-entry-details/production-entry-details.component';

@Component({
  selector: 'app-production-stock-detail',
  templateUrl: './production-stock-detail.component.html',
  styleUrls: ['./production-stock-detail.component.scss']
})
export class ProductionStockDetailComponent implements OnInit {
  @Output() saveDetail = new EventEmitter<any>();
  @Output() closeDetail = new EventEmitter<any>();
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  Data: any[] = [];
  divisionMS: any = 'ID';
  subJobNumber: any;
  columnheads: any[] = ["S.no", "Stock Code", "Design", "Cost", "Karat", "Gross Wt", "M.Pcs", "St.Wt", "St.value", "Labour", "Wastage", "Total Cost"];
  columnhead: any[] = ["Div", "Pcs", "Gross Wt"];
  labourColumnhead: any[] = ["Code", "Div", "Pcs", "Qty", "Rate", "Amount", "Wastage %", "Wastage Qty", "Wastage Amt", "Lab A/C", "Unit", "Lab Type"];
  componentsColumnhead: any[] = ["Sr.No", "Div", "Stock Code", "Color", "Clarity", "Shape", "Size", "Sieve", "Pcs", "Gross Wt", "Stone", "Net Wt", "Rate", "Amount", "%", "Qty", "Amt", "s.Rate", "S.Value"];

  componentDataList: any[] = [];
  STRNMTLdataSetToSave: any[] = [];
  componentGroupedList: any[] = [];
  stockCodeDataList: any[] = [];
  STOCK_FORM_DETAILS: any[] = [];
  DETAILSCREEN_DATA: any;
  currentDate: any = new Date();
  HEADERDETAILS: any;
  viewMode: boolean = false;
  editMode: boolean = false;
  FORM_VALIDATER: any;
  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  settingChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Setting A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  polishChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Polish A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  rhodiumChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Rhodium A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  labourChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Labour A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  miscChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Misc A/C Search',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  productionStockFrom: FormGroup = this.formBuilder.group({
    FLAG: [''],
    stockCode: [''],
    TAGLINES: [''],
    grossWt: [''],
    SETTING_CHRG: [''],
    SETTING_ACCODE: [''],
    POLISH_CHRG: [''],
    POLISH_ACCODE: [''],
    RHODIUM_CHRG: [''],
    RHODIUM_ACCODE: [''],
    LABOUR_CHRG: [''],
    LABOUR_ACCODE: [''],
    MISC_CHRG: [''],
    MISC_ACCODE: [''],
    metalValue: [''],
    stockValue: [''],
    totalLabour: [''],
    wastage: [''],
    wastageNo: [''],
    totalCoast: [''],
    price1per: [''],
    price1fc: [''],
    price1no: [''],
    price2per: [''],
    price2fc: [''],
    price2no: [''],
    price3per: [''],
    price3fc: [''],
    price3no: [''],
    price4per: [''],
    price4fc: [''],
    price4no: [''],
    price5per: [''],
    price5fc: [''],
    price5no: [''],
  });
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.FORM_VALIDATER = this.productionStockFrom.value
  }
  ngAfterViewInit() {
    this.setInitialValues()
  }
  setInitialValues() {
    if (!this.content) return
    let JOB_PRODUCTION_SUB_DJ: any;
    let PRODUCTION_FORMDETAILS: any;
    if (this.content[0]?.FLAG) {
      this.setFlagMode(this.content[0]?.FLAG)
      this.productionStockFrom.controls.FLAG.setValue(this.content[0]?.FLAG)
      JOB_PRODUCTION_SUB_DJ = this.content[0]?.JOB_PRODUCTION_SUB_DJ
    } else {// condition to load without saving
      JOB_PRODUCTION_SUB_DJ = this.content[0]?.JOB_PRODUCTION_SUB_DJ
      this.DETAILSCREEN_DATA = this.content[0]?.DETAILSCREEN_DATA
      this.HEADERDETAILS = this.content[0]?.HEADERDETAILS
    }
    if (!this.DETAILSCREEN_DATA) return;
    this.subJobNumber = this.DETAILSCREEN_DATA.UNQ_JOB_ID
    this.setStockCodeGrid()
    this.getComponentDetails()
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
  setChargeAccode(param: string) {
    return this.commonService.getCompanyParamValue(param) || ''
  }
  weightPcsCalculate(weight: any, pcs: any) {
    let wt = this.emptyToZero(weight) > 0 ? this.emptyToZero(weight) / pcs : 0
    return this.commonService.setCommaSerperatedNumber(wt, 'METAL')
  }
  setStockCodeGrid() {
    let nTotPcs = this.emptyToZero(this.DETAILSCREEN_DATA.JOB_PCS)
    for (let i = 0; i < nTotPcs; i++) {
      this.stockCodeDataList.push({
        SRNO: i + 1,
        STOCK_CODE: `${this.DETAILSCREEN_DATA.PREFIX}${this.emptyToZero(this.DETAILSCREEN_DATA.PREFIX_LASTNO) + i}`,
        DESIGN_CODE: this.DETAILSCREEN_DATA.DESIGN_CODE,
        COST_CODE: this.DETAILSCREEN_DATA.COST_CODE,
        KARAT_CODE: this.DETAILSCREEN_DATA.KARAT_CODE,
        GROSS_WT: this.weightPcsCalculate(this.DETAILSCREEN_DATA.GROSS_WT, nTotPcs),
        METAL_PCS: 1,
        METAL_WT: this.weightPcsCalculate(this.DETAILSCREEN_DATA.METAL_WT, nTotPcs),
        STONE_PCS: this.weightPcsCalculate(this.DETAILSCREEN_DATA.STONE_PCS, nTotPcs),
        STONE_WT: this.weightPcsCalculate(this.DETAILSCREEN_DATA.STONE_WT, nTotPcs),
        JOB_NUMBER: this.DETAILSCREEN_DATA.JOB_NUMBER,
        UNQ_JOB_ID: this.DETAILSCREEN_DATA.UNQ_JOB_ID,
        DIVCODE: this.DETAILSCREEN_DATA.DIVCODE,
        PURE_WT: this.DETAILSCREEN_DATA.PURE_WT,
        PURITY: this.DETAILSCREEN_DATA.PURITY,
      })
    }
    this.stockCodeDataList.forEach((item: any, index: number) => item.SRNO = index + 1)
    this.productionStockFrom.controls.stockCode.setValue(`${this.DETAILSCREEN_DATA.PREFIX}${this.DETAILSCREEN_DATA.PREFIX_LASTNO}`)
    this.productionStockFrom.controls.SETTING_ACCODE.setValue(this.setChargeAccode('SETTINGCHGAC'))
    this.productionStockFrom.controls.POLISH_ACCODE.setValue(this.setChargeAccode('POLISHINGCHGAC'))
    this.productionStockFrom.controls.RHODIUM_ACCODE.setValue(this.setChargeAccode('RODIUMCHGAC'))
    this.productionStockFrom.controls.LABOUR_ACCODE.setValue(this.setChargeAccode('LABOURCHGAC'))
    this.productionStockFrom.controls.MISC_ACCODE.setValue(this.setChargeAccode('MISCCHGAC'))
  }
  getComponentDetails() {
    let postData = {
      "SPID": "045",
      "parameter": {
        'strUnq_Job_Id': this.commonService.nullToString(this.DETAILSCREEN_DATA.UNQ_JOB_ID),
        'strProcess_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.PROCESS_CODE),
        'strWorker_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.WORKER_CODE),
        'strBranch_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.BRANCH_CODE),
        'strVocdate': this.commonService.formatDate(this.DETAILSCREEN_DATA.VOCDATE),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          this.componentDataList = result.dynamicData[0]
          let metalValue: number = 0
          let stoneValue: number = 0
          let wastage: number = 0
          let toatalLabour: number = 0
          let labourCharge: number = 0
          let settingCharge: number = 0
          this.componentDataList.forEach((item: any, index: number) => {
            item.SRNO = index + 1
            labourCharge += item.LAB_RATE
            toatalLabour += item.LAB_RATE
            if (item.METALSTONE = 'M') {
              metalValue += item.GROSS_WT
            } else {
              stoneValue += item.GROSS_WT
              settingCharge += item.LAB_RATE
            }
            item.GROSS_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
            item.STONE_WT = this.commonService.setCommaSerperatedNumber(item.STONE_WT, 'STONE')
            item.NET_WT = this.commonService.setCommaSerperatedNumber(item.NET_WT, 'METAL')
            item.AMOUNTFC = this.commonService.setCommaSerperatedNumber(item.AMOUNTFC, 'AMOUNT')
            item.LAB_AMTFC = this.commonService.setCommaSerperatedNumber(item.LAB_AMTFC, 'AMOUNT')
            item.PUREWT = this.commonService.setCommaSerperatedNumber(item.PUREWT, 'METAL')
            item.LAB_RATE = this.commonService.setCommaSerperatedNumber(item.LAB_RATE, 'RATE')
            item.PURITY = this.commonService.setCommaSerperatedNumber(item.PURITY, 'PURITY')
          })
          this.groupComponentDetails()// grouping data
          this.tagLineCreation() // tagline creation
          this.setFormDecimal('metalValue', metalValue, 'AMOUNT')
          this.setFormDecimal('stockValue', stoneValue, 'AMOUNT')
          this.setFormDecimal('toatalLabour', toatalLabour, 'AMOUNT')
          this.setFormDecimal('SETTING_CHRG', settingCharge, 'AMOUNT')
          this.setFormDecimal('LABOUR_CHRG', labourCharge, 'AMOUNT')
          this.setFormDecimal('POLISH_CHRG', 0, 'AMOUNT')
          this.setFormDecimal('RHODIUM_CHRG', 0, 'AMOUNT')
          this.setFormDecimal('MISC_CHRG', 0, 'AMOUNT')
          this.setFormDecimal('price1fc', 0, 'AMOUNT')
          this.setFormDecimal('price2fc', 0, 'AMOUNT')
          this.setFormDecimal('price3fc', 0, 'AMOUNT')
          this.setFormDecimal('price4fc', 0, 'AMOUNT')
          this.setFormDecimal('price5fc', 0, 'AMOUNT')
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  tagLineCreation() {
    let postData = {
      "SPID": "168",
      "parameter": {
        'strMasterSales': 'M',
        'strBranchCode': this.commonService.branchCode,
        'strUnq_Job_Id': this.commonService.nullToString(this.DETAILSCREEN_DATA.UNQ_JOB_ID),
        'strProcess_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.PROCESS_CODE),
        'strWorker_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.WORKER_CODE),
        'strVocdate': this.commonService.formatDate(this.DETAILSCREEN_DATA.VOCDATE),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        debugger
        if (result.status == "Success" && result.dynamicData[0]) {
          this.createTagLine(result.dynamicData[0])
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }
  createTagLine(result: any) {
    if (result.length > 0 && this.componentDataList.length > 0) {
      let tagtext = ''
      this.componentDataList.forEach((item: any, index: number) => {
        result.forEach((res: any) => {
          debugger
          if(res.FEILDNAME == 'KARAT'){
            tagtext += item.KARAT_CODE
          }else{
            tagtext = item[res.FEILDNAME] + item[res.SEPARATION]
          }
        });
      })
      this.setFormNullToString('TAGLINES', tagtext)
    }
  }
  generateTaglineBrilliant() {
    let postData = {
      "SPID": "116",
      "parameter": {
        'strUnq_Job_Id': this.commonService.nullToString(this.DETAILSCREEN_DATA.UNQ_JOB_ID),
        'strProcess_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.PROCESS_CODE),
        'strWorker_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.WORKER_CODE),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          let strBrilliantTagLines: string = ''
          let dblMetal: number = 0
          let metalColor: string = ''
          this.componentDataList.forEach((item: any, index: number) => {
            item.SRNO = index + 1
            if (item.METALSTONE = 'M') {
              dblMetal += this.commonService.decimalQuantityFormat(item.GROSS_WT, 'METAL')
              metalColor = this.commonService.nullToString(this.DETAILSCREEN_DATA.METAL_COLOR)
              strBrilliantTagLines = this.DETAILSCREEN_DATA.KARAT_CODE + "K" + metalColor + "-" + dblMetal + " GMS";
            }
          })
          // stone detail 
          if (result.status == "Success" && result.dynamicData[1]) {
            let stonedata: any[] = result.dynamicData[1] || []
            let size = ''
            stonedata.forEach((item: any, index: number) => {
              strBrilliantTagLines += item.SHAPE.toString()
              size = item.SIZE.toString();
            })
            if (size != '') strBrilliantTagLines += "SIZE " + size
          }
          this.setFormNullToString('TAGLINES', strBrilliantTagLines)
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)

  }

  groupComponentDetails() {
    let result: any[] = []
    this.componentDataList.reduce((res: any, value: any) => {
      if (!res[value.DIVCODE]) {
        res[value.DIVCODE] = {
          DIVCODE: value.DIVCODE,
          PCS: 0,
          GROSS_WT: 0,
          AMOUNT_FC: 0,
        };
        result.push(res[value.DIVCODE])
      }
      res[value.DIVCODE].PCS += Number(value.PCS);
      res[value.DIVCODE].GROSS_WT += Number(value.NET_WT);
      res[value.DIVCODE].AMOUNT_FC += Number(value.AMOUNTFC);
      return res;
    }, {});
    result.forEach((item: any) => {
      item.GROSS_WT = this.commonService.setCommaSerperatedNumber(item.GROSS_WT, 'METAL')
      item.AMOUNT_FC = this.commonService.setCommaSerperatedNumber(item.AMOUNT_FC, 'AMOUNT')
    })
    this.componentGroupedList = result
  }
  emptyToZero(value: any) {
    return this.commonService.emptyToZero(value)
  }
  priceOneCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');//duplicate entries found
      return;
    }
    this.productionStockFrom.controls.price1per.setValue(e.PRICE_CODE);
  }

  pricetwoCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionStockFrom.controls.price2per.setValue(e.PRICE_CODE);
  }

  pricethreeCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionStockFrom.controls.price3per.setValue(e.PRICE_CODE);
  }

  pricefourCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionStockFrom.controls.price4per.setValue(e.PRICE_CODE);
  }

  pricefiveCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionStockFrom.controls.price5per.setValue(e.PRICE_CODE);
  }

  private isSamepriceCodeSelected(PRICE_CODE: any): boolean {
    return (
      this.productionStockFrom.value.price1per === PRICE_CODE ||
      this.productionStockFrom.value.price2per === PRICE_CODE ||
      this.productionStockFrom.value.price3per === PRICE_CODE ||
      this.productionStockFrom.value.price4per === PRICE_CODE ||
      this.productionStockFrom.value.price5per === PRICE_CODE
    );
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    // this.activeModal.close(data);
    this.closeDetail.emit()
  }
  formDetailCount: number = 0;
  formSubmit() {
    this.setSTRNMTLdataSet(); //TODO

    this.formDetailCount += 1
    this.STOCK_FORM_DETAILS.push({
      "UNIQUEID": 0,
      "SRNO": this.commonService.emptyToZero(this.formDetailCount),
      "DT_VOCNO": 0,
      "DT_VOCTYPE": this.commonService.nullToString(this.HEADERDETAILS.voctype),
      "DT_VOCDATE": this.commonService.formatDateTime(this.HEADERDETAILS.vocDate),
      "DT_BRANCH_CODE": this.commonService.nullToString(this.commonService.branchCode),
      "DT_NAVSEQNO": "",
      "DT_YEARMONTH": this.commonService.nullToString(this.commonService.yearSelected),
      "JOB_NUMBER": this.commonService.nullToString(this.DETAILSCREEN_DATA.jobno),
      "JOB_DATE": this.commonService.formatDateTime(this.currentDate),
      "JOB_SO_NUMBER": this.commonService.emptyToZero(this.DETAILSCREEN_DATA.JOB_SO_NUMBER),
      "UNQ_JOB_ID": this.commonService.emptyToZero(this.DETAILSCREEN_DATA.subjobno),
      "JOB_DESCRIPTION": this.commonService.emptyToZero(this.DETAILSCREEN_DATA.design),
      "UNQ_DESIGN_ID": this.commonService.emptyToZero(this.DETAILSCREEN_DATA.DESIGN_CODE),
      "DESIGN_CODE": this.commonService.emptyToZero(this.DETAILSCREEN_DATA.DESIGN_CODE),
      "PART_CODE": "",
      "DIVCODE": "",
      "PREFIX": "",
      "STOCK_CODE": this.productionStockFrom.value.stockCode,
      "STOCK_DESCRIPTION": "",
      "SET_REF": "",
      "KARAT_CODE": "",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.commonService.emptyToZero(this.productionStockFrom.value.grossWt),
      "METAL_PCS": 0,
      "METAL_WT": 0,
      "STONE_PCS": 0,
      "STONE_WT": 0,
      "LOSS_WT": 0,
      "NET_WT": 0,
      "PURITY": 0,
      "PURE_WT": 0,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "CURRENCY_CODE": "",
      "CURRENCY_RATE": 0,
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
      "PROCESS_CODE": "",
      "PROCESS_NAME": "",
      "WORKER_CODE": "",
      "WORKER_NAME": "",
      "IN_DATE": "2023-10-17T12:41:20.126Z",
      "OUT_DATE": "2023-10-17T12:41:20.126Z",
      "TIME_TAKEN_HRS": 0,
      "COST_CODE": "",
      "WIP_ACCODE": "",
      "STK_ACCODE": "",
      "SOH_ACCODE": "",
      "PROD_PROC": "",
      "METAL_DIVISION": this.commonService.nullToString(this.productionStockFrom.value.metalValue),
      "PRICE1PER": this.commonService.emptyToZero(this.productionStockFrom.value.price1per),
      "PRICE2PER": this.commonService.emptyToZero(this.productionStockFrom.value.price2per),
      "PRICE3PER": this.commonService.emptyToZero(this.productionStockFrom.value.price3per),
      "PRICE4PER": this.commonService.emptyToZero(this.productionStockFrom.value.price4per),
      "PRICE5PER": this.commonService.emptyToZero(this.productionStockFrom.value.price5per),
      "LOCTYPE_CODE": "",
      "WASTAGE_WT": this.commonService.emptyToZero(this.productionStockFrom.value.wastage),
      "WASTAGE_AMTFC": 0,
      "WASTAGE_AMTLC": 0,
      "PICTURE_NAME": "",
      "SELLINGRATE": 0,
      "LAB_ACCODE": "",
      "CUSTOMER_CODE": "",
      "OUTSIDEJOB": true,
      "METAL_LABAMTFC": 0,
      "METAL_LABAMTLC": 0,
      "METAL_LABACCODE": "",
      "SUPPLIER_REF": this.commonService.nullToString(this.productionStockFrom.value.totalLabour),
      "TAGLINES": this.commonService.nullToString(this.productionStockFrom.value.TAGLINES),
      "SETTING_CHRG": this.commonService.emptyToZero(this.productionStockFrom.value.SETTING_CHRG),
      "POLISH_CHRG": this.commonService.emptyToZero(this.productionStockFrom.value.POLISH_CHRG),
      "RHODIUM_CHRG": this.commonService.emptyToZero(this.productionStockFrom.value.RHODIUM_CHRG),
      "LABOUR_CHRG": this.commonService.emptyToZero(this.productionStockFrom.value.LABOUR_CHRG),
      "MISC_CHRG": this.commonService.emptyToZero(this.productionStockFrom.value.MISC_CHRG),
      "SETTING_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.SETTING_ACCODE),
      "POLISH_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.POLISH_ACCODE),
      "RHODIUM_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.RHODIUM_ACCODE),
      "LABOUR_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.LABOUR_ACCODE),
      "MISC_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.MISC_ACCODE),
      "WAST_ACCODE": this.commonService.nullToString(this.productionStockFrom.value.wastage),
      "REPAIRJOB": 0,
      "PRICE1FC": this.commonService.emptyToZero(this.productionStockFrom.value.price1fc),
      "PRICE2FC": this.commonService.emptyToZero(this.productionStockFrom.value.price2fc),
      "PRICE3FC": this.commonService.emptyToZero(this.productionStockFrom.value.price3fc),
      "PRICE4FC": this.commonService.emptyToZero(this.productionStockFrom.value.price4fc),
      "PRICE5FC": this.commonService.emptyToZero(this.productionStockFrom.value.price5fc),
      "BASE_CONV_RATE": 0,
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
      "DESIGN_TYPE": "",
      "BASE_CURR_RATE": 0,
      "STOCK_PUREWT": 0
    })
    let stockDetailToSave: any = {}
    //STOCK_FORM_DETAILS is only saving to API
    stockDetailToSave.STOCK_FORM_DETAILS = this.STOCK_FORM_DETAILS;
    stockDetailToSave.STOCK_COMPONENT_GRID = this.STRNMTLdataSetToSave;

    this.saveDetail.emit(stockDetailToSave);
  }

  /**STRNMTL data set to save */
  setSTRNMTLdataSet() {
    this.componentDataList.forEach((item: any) => {
      this.STRNMTLdataSetToSave.push({
        "VOCNO": this.commonService.emptyToZero(this.HEADERDETAILS.VOCNO),
        "VOCTYPE": this.commonService.nullToString(this.HEADERDETAILS.VOCTYPE),
        "VOCDATE": this.commonService.formatDateTime(this.HEADERDETAILS.VOCDATE),
        "JOB_NUMBER": "",
        "JOB_SO_NUMBER": 0,
        "UNQ_JOB_ID": "",
        "JOB_DESCRIPTION": "",
        "BRANCH_CODE": "",
        "DESIGN_CODE": "",
        "METALSTONE": "",
        "DIVCODE": "",
        "STOCK_CODE": "",
        "STOCK_DESCRIPTION": "",
        "COLOR": "",
        "CLARITY": "",
        "SHAPE": "",
        "SIZE": "",
        "PCS": 0,
        "GROSS_WT": 0,
        "RATELC": 0,
        "RATEFC": 0,
        "AMOUNT": 0,
        "PROCESS_CODE": "",
        "WORKER_CODE": "",
        "UNQ_DESIGN_ID": "",
        "REFMID": 0,
        "AMOUNTLC": 0,
        "AMOUNTFC": 0,
        "WASTAGE_QTY": 0,
        "WASTAGE_PER": 0,
        "WASTAGE_AMTFC": 0,
        "WASTAGE_AMTLC": 0,
        "CURRENCY_CODE": "",
        "CURRENCY_RATE": 0,
        "YEARMONTH": "",
        "LOSS_QTY": 0,
        "LABOUR_CODE": "",
        "LAB_RATE": 0,
        "LAB_AMTLC": 0,
        "LAB_AMTFC": 0,
        "LAB_ACCODE": "",
        "SELLINGRATE": 0,
        "SELLINGVALUE": 0,
        "CUSTOMER_CODE": "",
        "PUREWT": 0,
        "PURITY": 0,
        "SQLID": "",
        "SIEVE": "",
        "SRNO": 0,
        "MAIN_STOCK_CODE": "",
        "STONE_WT": 0,
        "NET_WT": 0,
        "CONSIGNMENT": 0,
        "LOCTYPE_CODE": "",
        "HANDLING_CHARGEFC": 0,
        "HANDLING_CHARGELC": 0,
        "HANDLING_RATEFC": 0,
        "HANDLING_RATELC": 0,
        "PRICECODE": "",
        "SUB_STOCK_CODE": "",
        "SIEVE_SET": "",
        "KARAT_CODE": "",
        "PROCESS_TYPE": "",
        "SOH_ACCODE": "",
        "STK_ACCODE": "",
        "OTHER_ATTR": "",
        "PUREWTTEMP": 0
      })
    })
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
          this.productionStockFrom.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

      })
    this.subscriptions.push(Sub)
  }
  settingChrgSelected(e: any) {
    this.productionStockFrom.controls.SETTING_ACCODE.setValue(e.ACCODE);
  }
  polishChrgSelected(e: any) {
    this.productionStockFrom.controls.POLISH_ACCODE.setValue(e.ACCODE);
  }
  rhodiumChrgSelected(e: any) {
    this.productionStockFrom.controls.RHODIUM_ACCODE.setValue(e.ACCODE);
  }
  labourChrgSelected(e: any) {
    this.productionStockFrom.controls.LABOUR_ACCODE.setValue(e.ACCODE);
  }
  miscChrgSelected(e: any) {
    this.productionStockFrom.controls.MISC_ACCODE.setValue(e.ACCODE);
  }

  onDragStarted() {
    this.close()
  }
  setFormNullToString(formControlName: string, value: any) {
    this.productionStockFrom.controls[formControlName]?.setValue(
      this.commonService.nullToString(value)
    )
    this.FORM_VALIDATER[formControlName] = this.commonService.nullToString(value)
  }
  setFormDecimal(formControlName: string, value: any, Decimal: string) {
    let result = Decimal ? this.commonService.setCommaSerperatedNumber(value, Decimal) : value
    this.productionStockFrom.controls[formControlName]?.setValue(result)
    this.FORM_VALIDATER[formControlName] = result
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
