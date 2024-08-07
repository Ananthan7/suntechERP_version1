import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-production-stock-detail',
  templateUrl: './production-stock-detail.component.html',
  styleUrls: ['./production-stock-detail.component.scss']
})
export class ProductionStockDetailComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  Data: any[] = [];
  divisionMS: any = 'ID';
  subJobNumber: string = ''
  columnheads : any[] = ["S.no","Stock Code","Design","Cost","Karat","Gross Wt","M.Pcs","St.Wt","St.value","Labour","Wastage","Total Cost"];
  columnhead: any[] = ["Div","Pcs","Gross Wt"];
  labourColumnhead: any[] = ["Code","Div","Pcs","Qty","Rate","Amount","Wastage %","Wastage Qty","Wastage Amt","Lab A/C","Unit","Lab Type"];
  componentsColumnhead: any[] = ["Sr.No","Div","Stock Code","Color","Clarity","Shape","Size","Sieve","Pcs","Gross Wt","Stone","Net Wt","Rate","Amount","%","Qty","Amt","s.Rate","S.Value"];

  componentDataList:any[] = [];
  STRNMTLdataSetToSave:any[] = [];
  componentGroupedList:any[] = [];
  stockCodeDataList:any[] = [];
  STOCK_FORM_DETAILS:any[] = [];
  DETAILSCREEN_DATA:any;
  currentDate: any = new Date();
  HEADERDETAILS:any;
  viewMode: boolean = false;
  editMode: boolean = false;
  productionItemsDetailsFrom: FormGroup = this.formBuilder.group({
    stockCode  : [''],
    tagLines : [''],
    grossWt : [''],
    settingChrg : [''],
    settingChrgDesc : [''],
    polishChrg  :[''],
    polishChrgDesc  :[''],
    rhodiumChrg : [''],
    rhodiumChrgDesc : [''],
    labourChrg : [''],
    labourChrgDesc : [''],
    miscChrg : [''],
    miscChrgDesc : [''],
    metalValue : [''],
    stockValue : [''],
    totalLabour : [''],
    wastage : [''],
    wastageNo : [''],
    totalCoast : [''],
    price1per : [''],
    price1fc : [''],
    price1no : [''],
    price2per : [''],
    price2fc : [''],
    price2no : [''],
    price3per : [''],
    price3fc : [''],
    price3no : [''],
    price4per : [''],
    price4fc : [''],
    price4no : [''],
    price5per : [''],
    price5fc : [''],
    price5no : [''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.setInitialValues()
  }
  setInitialValues(){
    console.log(this.content,'this.content');
    this.DETAILSCREEN_DATA = this.content[0].DETAILSCREEN_DATA
    this.HEADERDETAILS = this.content[0].HEADERDETAILS
    this.setStockCodeGrid()
    this.getComponentDetails()
  }
  setStockCodeGrid(){
    this.stockCodeDataList.push({
      STOCK_CODE:`${this.DETAILSCREEN_DATA.PREFIX}${this.DETAILSCREEN_DATA.PREFIXNO}`,
      DESIGN: this.DETAILSCREEN_DATA.design,
      KARAT: this.DETAILSCREEN_DATA.KARAT,
      grossWt: this.DETAILSCREEN_DATA.grossWt,
      MetalPCS: 1,
      metalwt: this.DETAILSCREEN_DATA.metalwt,
      // MetalValue: this.DETAILSCREEN_DATA.metalwt,
      StonePcs: this.DETAILSCREEN_DATA.stonepcs,
      stonewt: this.DETAILSCREEN_DATA.stonewt,
      jobno: this.DETAILSCREEN_DATA.jobno,
      subjobno: this.DETAILSCREEN_DATA.subjobno,
      DIVCODE: this.DETAILSCREEN_DATA.DIVCODE,
      PURE_WT: this.DETAILSCREEN_DATA.PURE_WT,
      jobPurity: this.DETAILSCREEN_DATA.jobPurity,
    })
    this.stockCodeDataList.forEach((item:any,index:number)=> item.SRNO = index+1)
    console.log(this.stockCodeDataList,'this.stockCodeDataList');
  }
  groupBomDetailsData() {
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
    result.forEach((item:any)=>{
      item.GROSS_WT = this.commonService.decimalQuantityFormat(item.GROSS_WT,'METAL')
      item.AMOUNT_FC = this.commonService.decimalQuantityFormat(item.AMOUNT_FC,'AMOUNT')
    })
    this.componentGroupedList = result
  }
  getComponentDetails(){
    let postData = {
      "SPID": "045",
      "parameter": {
        'strUnq_Job_Id': this.commonService.nullToString(this.DETAILSCREEN_DATA.subjobno),
        'strProcess_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.process),
        'strWorker_Code': this.commonService.nullToString(this.DETAILSCREEN_DATA.worker),
        'strBranch_Code': this.commonService.nullToString(this.commonService.branchCode),
        'strVocdate': this.commonService.formatDate(this.DETAILSCREEN_DATA.VOCDATE),
      }
    }
    this.commonService.showSnackBarMsg('MSG81447')
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.commonService.closeSnackBarMsg()
        if (result.status == "Success" && result.dynamicData[0]) {
          this.componentDataList = result.dynamicData[0]
          this.componentDataList.forEach((item:any,index:number)=>{
            item.SRNO = index+1
          })
          this.groupBomDetailsData()
        } else {
          this.commonService.toastErrorByMsgId('MSG1747')
        }
      }, err => {
        this.commonService.closeSnackBarMsg()
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }

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
  priceOneCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');//duplicate entries found
      return;
    }
    this.productionItemsDetailsFrom.controls.price1per.setValue(e.PRICE_CODE);
  }

  pricetwoCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionItemsDetailsFrom.controls.price2per.setValue(e.PRICE_CODE);
  }

  pricethreeCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionItemsDetailsFrom.controls.price3per.setValue(e.PRICE_CODE);
  }

  pricefourCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionItemsDetailsFrom.controls.price4per.setValue(e.PRICE_CODE);
  }

  pricefiveCodeSelected(e: any) {
    if (this.isSamepriceCodeSelected(e.PRICE_CODE)) {
      this.commonService.toastErrorByMsgId('MSG2052');
      return;
    }
    this.productionItemsDetailsFrom.controls.price5per.setValue(e.PRICE_CODE);
  }

  private isSamepriceCodeSelected(PRICE_CODE: any): boolean {
    return (
      this.productionItemsDetailsFrom.value.price1per === PRICE_CODE ||
      this.productionItemsDetailsFrom.value.price2per === PRICE_CODE ||
      this.productionItemsDetailsFrom.value.price3per === PRICE_CODE ||
      this.productionItemsDetailsFrom.value.price4per === PRICE_CODE ||
      this.productionItemsDetailsFrom.value.price5per === PRICE_CODE
    );
  }

  settingChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  settingChrgSelected(e: any) {
    this.productionItemsDetailsFrom.controls.settingChrg.setValue(e.PRICE_CODE);
    this.productionItemsDetailsFrom.controls.settingChrgDesc.setValue(e.PRICE_CODE);
  }

  polishChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  polishChrgSelected(e: any) {
    this.productionItemsDetailsFrom.controls.polishChrg.setValue(e.PRICE_CODE);
    this.productionItemsDetailsFrom.controls.polishChrgDesc.setValue(e.PRICE_CODE);
  }

  rhodiumChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  rhodiumChrgSelected(e: any) {
    this.productionItemsDetailsFrom.controls.rhodiumChrg.setValue(e.PRICE_CODE);
    this.productionItemsDetailsFrom.controls.rhodiumChrgDesc.setValue(e.PRICE_CODE);
  }

  labourChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  labourChrgSelected(e: any) {
    this.productionItemsDetailsFrom.controls.labourChrg.setValue(e.PRICE_CODE);
    this.productionItemsDetailsFrom.controls.labourChrgDesc.setValue(e.PRICE_CODE);
  }

  miscChrgData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  miscChrgSelected(e: any) {
    this.productionItemsDetailsFrom.controls.miscChrg.setValue(e.PRICE_CODE);
    this.productionItemsDetailsFrom.controls.miscChrgDesc.setValue(e.PRICE_CODE);
  }



  close(data?: any) {
    this.activeModal.close(data);
  }
  formDetailCount: number = 0;
  formSubmit(){
    // this.setSTRNMTLdataSet(); //TODO
    console.log(this.DETAILSCREEN_DATA);
    
    this.formDetailCount+=1
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
      "STOCK_CODE": this.productionItemsDetailsFrom.value.stockCode,
      "STOCK_DESCRIPTION": "",
      "SET_REF": "",
      "KARAT_CODE": "",
      "MULTI_STOCK_CODE": true,
      "JOB_PCS": 0,
      "GROSS_WT": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.grossWt),
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
      "METAL_DIVISION": this.commonService.nullToString(this.productionItemsDetailsFrom.value.metalValue),
      "PRICE1PER": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price1per),
      "PRICE2PER": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price2per),
      "PRICE3PER": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price3per),
      "PRICE4PER": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price4per),
      "PRICE5PER": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price5per),
      "LOCTYPE_CODE": "",
      "WASTAGE_WT": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.wastage),
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
      "SUPPLIER_REF": this.commonService.nullToString(this.productionItemsDetailsFrom.value.totalLabour),
      "TAGLINES": "",
      "SETTING_CHRG": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.settingChrg),
      "POLISH_CHRG": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.polishChrg),
      "RHODIUM_CHRG": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.rhodiumChrg),
      "LABOUR_CHRG": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.labourChrg),
      "MISC_CHRG": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.miscChrg),
      "SETTING_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.settingChrgDesc),
      "POLISH_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.polishChrgDesc),
      "RHODIUM_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.rhodiumChrgDesc),
      "LABOUR_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.labourChrgDesc),
      "MISC_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.miscChrgDesc),
      "WAST_ACCODE": this.commonService.nullToString(this.productionItemsDetailsFrom.value.wastage),
      "REPAIRJOB": 0,
      "PRICE1FC": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price1fc),
      "PRICE2FC": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price2fc),
      "PRICE3FC": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price3fc),
      "PRICE4FC": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price4fc),
      "PRICE5FC": this.commonService.emptyToZero(this.productionItemsDetailsFrom.value.price5fc),
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
      "BASE_CURR_RATE": 0
    })
    let stockDetailToSave:any = {}
    //STOCK_FORM_DETAILS is only saving to API
    stockDetailToSave.STOCK_FORM_DETAILS = this.STOCK_FORM_DETAILS;
    stockDetailToSave.STOCK_COMPONENT_GRID = this.STRNMTLdataSetToSave;
    console.log(this.STOCK_FORM_DETAILS,'this.STOCK_FORM_DETAILS');
    
    this.close(stockDetailToSave);
  }

   /**STRNMTL data set to save */
  setSTRNMTLdataSet() {
    this.componentDataList.forEach((item:any)=>{
      this.STRNMTLdataSetToSave.push({
        "VOCNO": 0,
        "VOCTYPE": this.commonService.nullToString(this.HEADERDETAILS.voctype),
        "VOCDATE": this.commonService.formatDateTime(this.HEADERDETAILS.vocDate),
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
        let Sub: Subscription = this.dataService.postDynamicAPI(API,param)
          .subscribe((result) => {
            let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
            if (data.length == 0) {
              this.commonService.toastErrorByMsgId('MSG1531')
              this.productionItemsDetailsFrom.controls[FORMNAME].setValue('')
              LOOKUPDATA.SEARCH_VALUE = ''
              return
            }
           
          }, err => {
            this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again

          })
        this.subscriptions.push(Sub)
      }

  continue(){

  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
