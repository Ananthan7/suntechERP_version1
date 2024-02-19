import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

interface dataToSave {
  BOMDETAILS:any[]
  SUMMARYDETAILS:any[]
  PART_DETAILS:any[]
  COMPONENT_DETAILS:any[]
}
@Component({
  selector: 'app-add-newdetail',
  templateUrl: './add-newdetail.component.html',
  styleUrls: ['./add-newdetail.component.scss']
})
export class AddNewdetailComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid
  diamondSalesDetailForm!: FormGroup;
  favoriteSeason: string = ''
  seasons: string[] = ['Metal', 'Stones'];
  season2: string[] = ['Metal', 'Stones', 'Total'];
  currentFilter: any;
  divisionMS: string = 'ID';
  codeSearchFlag: string = 'design';
  currentDate = new Date()
  firstTableWidth: any;
  secondTableWidth: any;
  headerDetails: any;
  summaryDetailData:any;
  intLabType: number = this.commonService.getCompanyParamValue('DIALABOURCHARGETYPE')

  isViewComponentsTab: boolean = false;
  isViewBOMTab: boolean = true;
  isViewSummaryTab: boolean = true;
  isViewDesignTab: boolean = false;

  viewFlag: any = {
    ItemRateFC: true,
    AmountValueFC: true
  };

  BOMDetailsArray: any[] = [];
  BOMDetailsDataToGroup: any[] = [];
  groupedBOMDetails: any[] = [];
  groupedBOMDetailsHead: any[] = [];
  gridComponents: any[] = [];
  gridComponentsHead: any[] = [];
  gridParts: any[] = [];
  gridPartsHead: any[] = [];
  BOMDetailsArrayHead: any[] = ['DIVCODE', 'STONE_TYPE', 'COMP_CODE',
    'KARAT_CODE', 'PCS', 'GROSS_WT', 'RATELC', 'AMOUNTFC', 'SHAPE', 'SIEVE',
    'LABRATEFC', 'WASTAGE_PER', 'WASTAGE_WT', 'WASTAGE_AMTFC', 'LABAMOUNTFC',
    'SIEVE_DESC', 'SIEVE', 'SIZE_FORM', 'COLOR', 'CLARITY', 'STOCK_CODE', 'PROCESS_TYPE',
    'PROD_VARIANCE', 'PURITY']

  columnheaders: any[] = ['Code', 'Div', 'Pcs', 'Qty', 'Rate', 'Amount', 'Wst %', 'Wst Amt', 'Lab Type'];
  columnheadmain: any[] = ['Stock Code', 'Stone Size', 'Stone Pcs', 'Stone Weight'];
  private subscriptions: Subscription[] = [];
  /**USE: generalMaster Code lookup model*/
  generalMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'GENERAL MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  /**USE: stockCode  lookup model*/
  stockCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 4,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'STOCK CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  /**USE: stockCode  lookup model*/
  partColorCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 74,
    SEARCH_FIELD: 'ATTR_CODE',
    SEARCH_HEADING: 'Size Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  /**USE: stockCode  lookup model*/
  componetCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 16,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  /**USE: Design Code lookup model*/
  DesignCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: color Code lookup model*/
  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'General Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES= 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: karat Code lookup model*/
  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: Size Code lookup model*/
  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 74,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  /**USE: Design Code lookup model*/
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 110,
    SEARCH_FIELD: 'stock_code',
    SEARCH_HEADING: 'Metal Stock Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
 
  
  /**USE:  first sub form group for summary details tab*/
  summaryDetailForm: FormGroup = this.formBuilder.group({
    CATEGORY_CODE: [''],
    SUBCATEGORY_CODE: [''],
    COLOR: [''],
    KARAT_CODE: [''],
    PURITY: [''],
    SUPPLIER_CODE: [''],
    SEQ_CODE: [''],
    BRAND_CODE: [''],
    TYPE_CODE: [''],
    SIZE: [''],
    SURFACEPROPERTY: [''],
    WIDTH: [''],
    LENGTH: [''],
    REFERENCE: [''],
    THICKNESS: [''],
    ENGRAVING_TEXT: [''],
    ENGRAVING_FONT: [''],
    SCREW_FIELD: [''],
    SETTING: [''],
    POLISHING: [''],
    RHODIUM: [''],
    LABOUR: [''],
    Misc: [''],
    Total_Labour: [''],
    Wastage: [''],
    WastagePercentage: [''],
    Markup: [''],
    MarkupPercentage: [''],
    Duty: [''],
    DutyPercentage: [''],
    Margin: [''],
    MarginPercentage: [''],
    Loading: [''],
    LoadingPercentage: [''],
    Discount: [''],
    DiscountPercentage: [''],
    StampDetails: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    /**USE: details main form group*/
  this.diamondSalesDetailForm = this.formBuilder.group({
    designCode: ['',[Validators.required]],
    designDescription: ['',[Validators.required]],
    divisionCode: [''],
    StockCode: ['',[Validators.required]],
    StockCodeDesc: ['',[Validators.required]],
    DeliveryType: [''],
    DeliveryType2: [''],
    ProductionDate: [this.currentDate],
    DeliveryOnDate: [this.currentDate],
    Remarks: [''],
    StockBOM: [false],
    PCS: [''],
    METAL_WT: [''],
    RATEFC: [''],
    STONE_WT: [''],
    AMOUNT: [''],
    GROSS_WT: [''],
    STOCK_CODE: [''],
    designCodeSelect: [''],
  })

    this.setInitialValues()
    this.handleResize()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Call a method to handle the resize event
    this.handleResize();
  }

  private handleResize(): void {
    // Access screen size here using window.innerWidth and window.innerHeight
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    if (screenWidth > 1200) {
      this.firstTableWidth = 800
      this.secondTableWidth = 450
    } else if (screenWidth >= 768 && screenWidth < 1200) {
      this.firstTableWidth = 700
      this.secondTableWidth = 350
    }
  }

  /**USE: to edit detail if already added */
  setInitialValues(): void {
    console.log(this.content,'DATA COMMING TO DETAIL');
    
    if (this.content && this.content[0].HEADERDETAILS) {
      this.headerDetails = this.content[0].HEADERDETAILS
    }

    if (this.content && this.content[0].BOMDETAILS) {
      this.BOMDetailsArray = this.content[0].BOMDETAILS
      // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0])
      this.groupBomDetailsData()
    }
    if (this.content && this.content[0].SUMMARYDETAILS) {
      let summaryDetail = this.content[0].SUMMARYDETAILS
      //details first section
      this.diamondSalesDetailForm.controls.designCode.setValue(summaryDetail[0].designCode)
      this.diamondSalesDetailForm.controls.designDescription.setValue(summaryDetail[0].designDescription)
      this.diamondSalesDetailForm.controls.AMOUNT.setValue(summaryDetail[0].AMOUNT)
      this.diamondSalesDetailForm.controls.RATEFC.setValue(summaryDetail[0].RATEFC)
      this.diamondSalesDetailForm.controls.METAL_WT.setValue(summaryDetail[0].METAL_WT)
      this.diamondSalesDetailForm.controls.GROSS_WT.setValue(summaryDetail[0].GROSS_WT)
      this.diamondSalesDetailForm.controls.STONE_WT.setValue(summaryDetail[0].STONE_WT)
      this.diamondSalesDetailForm.controls.PCS.setValue(summaryDetail[0].PCS)
      //summary details
      this.summaryDetailForm.controls.KARAT_CODE.setValue(summaryDetail[0].KARAT_CODE)
      this.summaryDetailForm.controls.TYPE_CODE.setValue(summaryDetail[0].TYPE_CODE)
      this.summaryDetailForm.controls.BRAND_CODE.setValue(summaryDetail[0].BRAND_CODE)
      this.summaryDetailForm.controls.PURITY.setValue(summaryDetail[0].PURITY)
      this.summaryDetailForm.controls.SUPPLIER_CODE.setValue(summaryDetail[0].SUPPLIER_CODE)
      this.summaryDetailForm.controls.CATEGORY_CODE.setValue(summaryDetail[0].CATEGORY_CODE)
      this.summaryDetailForm.controls.SEQ_CODE.setValue(summaryDetail[0].SEQ_CODE)
      this.summaryDetailForm.controls.SUBCATEGORY_CODE.setValue(summaryDetail[0].SUBCATEGORY_CODE)
      this.summaryDetailForm.controls.SIZE.setValue(summaryDetail[0].SIZE)
      this.summaryDetailForm.controls.StampDetails.setValue(summaryDetail[0].StampDetails)
      this.summaryDetailForm.controls.WIDTH.setValue(summaryDetail[0].WIDTH)
      this.summaryDetailForm.controls.REFERENCE.setValue(summaryDetail[0].REFERENCE)
      this.summaryDetailForm.controls.THICKNESS.setValue(summaryDetail[0].THICKNESS)
      this.summaryDetailForm.controls.SCREW_FIELD.setValue(summaryDetail[0].SCREW_FIELD)
      this.summaryDetailForm.controls.POLISHING.setValue(summaryDetail[0].POLISHING)
      this.summaryDetailForm.controls.RHODIUM.setValue(summaryDetail[0].RHODIUM)
      this.summaryDetailForm.controls.LABOUR.setValue(summaryDetail[0].LABOUR)
      this.summaryDetailForm.controls.Misc.setValue(summaryDetail[0].Misc)
      this.summaryDetailForm.controls.Total_Labour.setValue(summaryDetail[0].Total_Labour)
    
    }
  }
  
 
  radioButtonChanged() {
    this.codeSearchFlag = this.diamondSalesDetailForm.value.designCodeSelect
  }
  customizeComma(data: any) {
    if (!Number(data.value)) return data.value
    return Number(data.value).toLocaleString('en-US', { style: 'decimal' })
  }
  customizeText(data: any) {
    let num = Number(data.value).toFixed(2)
    return num
  }
  //**USE: Format decimals in BOM details grid change*/
  formatBOMDetailGrid(data?: any): void {
    this.groupBomDetailsData()
    this.BOMDetailsArray.forEach((item: any) => {
      if (item.METALSTONE == 'M') {
        item.GROSS_WT = this.commonService.decimalQuantityFormat(item.GROSS_WT, 'METAL')
        
      } else if ((item.METALSTONE == 'S')) {
        item.GROSS_WT = this.commonService.decimalQuantityFormat(item.GROSS_WT, 'STONE')
      }
      if(item.DIVCODE == 'G'){
        this.diamondSalesDetailForm.controls.METAL_WT.setValue(item.GROSS_WT)
      }
      item.RATEFC = this.commonService.decimalQuantityFormat(item.RATEFC, 'AMOUNT')
      item.LABRATEFC = this.commonService.decimalQuantityFormat(item.LABRATEFC, 'AMOUNT')
      item.PURITY = this.commonService.decimalQuantityFormat(item.PURITY, 'PURITY')
      item.WASTAGE_PER = this.commonService.decimalQuantityFormat(item.WASTAGE_PER, 'AMOUNT')
      console.log(item.WASTAGE_PER,'item.WASTAGE_PER');
      
      item.WASTAGE_AMTFC = this.commonService.decimalQuantityFormat(item.WASTAGE_AMTFC, 'METAL')
      item.WASTAGE_WT = this.commonService.decimalQuantityFormat(item.WASTAGE_WT, 'METAL')
      item.LABAMOUNTFC = this.commonService.decimalQuantityFormat(item.LABAMOUNTFC, 'AMOUNT')
    })
  }
  // search data change in BOM details grid starts==========
  colorCodeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].COLOR = event.CODE;
  }
  processTypeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].PROCESS_TYPE = event.CODE;
  }
  stoneTypeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].STONE_TYPE = event.CODE;
  }
  claritySelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].CLARITY = event.CODE;
  }
  shapeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].SHAPE = event.CODE;
  }
  stockCodeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].STOCK_CODE = event.Stock_Code;
  }
  onHoverColorCode({ data }: any) {
    this.generalMaster.WHERECONDITION = `TYPES = 'COLOR MASTER' AND DIV_${data.DIVCODE}=1`
  }
  onHoverstoneType({ data }: any) {
    this.generalMaster.WHERECONDITION = `TYPES = 'STONE TYPE MASTER' AND DIV_${data.DIVCODE}=1`
  }
  onHoverClarity({ data }: any) {
    this.generalMaster.WHERECONDITION = `TYPES = 'CLARITY MASTER' AND  DIV_${data.DIVCODE}=1`
  }
  onHoverShape({ data }: any) {
    this.generalMaster.WHERECONDITION = `TYPES = 'SHAPE MASTER' AND  DIV_${data.DIVCODE}=1`
  }
  onHoverProcessType({ data }: any) {
    this.generalMaster.WHERECONDITION = `TYPES = 'SETTING TYPE MASTER'`
  }
  onHoverStockCode({ data }: any) {
    if (data.METALSTONE == 'S') {
      this.stockCode.LOOKUPID = 4
      this.stockCode.WHERECONDITION = `ITEM = '${data.DIVCODE}'`
    } else {
      this.stockCode.LOOKUPID = 23
      this.stockCode.WHERECONDITION = `DIVISION_CODE = '${data.DIVCODE}' AND KARAT_CODE = '${data.KARAT_CODE}'`
    }
  }


  // search data change in BOM details grid ends===
  // search for Part Details Grid STARTS ======
  partColorCodeSelected(event: any, value: any) {
    this.gridParts[value.data.SLNO - 1].PART_COLOR = event.ATTR_CODE;
  }
  onHoverPartColorCode({ data }: any) {
    this.partColorCode.LOOKUPID = 74
    this.partColorCode.WHERECONDITION = `DESIGN_CODE = '${data.COMP_CODE}' AND ATTR_TYPE='COLOR'`
  }
  // Part Details Grid ENDS
  // COMPONENT Details Grid STARTS
  componentCodeSelected(event: any, value: any) {
    this.gridParts[value.data.SLNO - 1].PART_COLOR = event.ATTR_CODE;
  }
  onHoverCompCode({ data }: any) {
    this.componetCode.LOOKUPID = 16
    this.componetCode.WHERECONDITION = `Design_Type = 'COMP'`
  }
  // COMPONENT Details Grid ENDS

  /**USE: group BOM Details Data */
  groupBomDetailsData() {
    let result: any[] = []
    this.BOMDetailsArray.reduce((res: any, value: any) => {
      if (!res[value.DIVCODE]) {
        res[value.DIVCODE] = {
          DIVCODE: value.DIVCODE,
          PCS: 0,
          WEIGHT: 0,
          WEIGHT_GMS: 0,
          AMOUNT_FC: 0,
          LABAMOUNTFC: 0,
          WASTAGE_AMTFC: 0
        };
        result.push(res[value.DIVCODE])
      }
      res[value.DIVCODE].PCS += Number(value.PCS);
      res[value.DIVCODE].WEIGHT += Number(value.GROSS_WT);
      res[value.DIVCODE].WEIGHT_GMS += Number(value.GROSS_WT);
      res[value.DIVCODE].LABAMOUNTFC += Number(value.LABAMOUNTFC);
      res[value.DIVCODE].WASTAGE_AMTFC += Number(value.WASTAGE_AMTFC);

      if (res[value.DIVCODE].DIVCODE == 'G') {
        if (!this.headerDetails.FixedMetal) {
          res[value.DIVCODE].AMOUNT_FC = 0.00;
        } else {
          res[value.DIVCODE].AMOUNT_FC += value.AMOUNTFC;
        }
      } else {
        res[value.DIVCODE].AMOUNT_FC += value.AMOUNTFC;
      }
      return res;
    }, {});

    this.groupedBOMDetails = result
    this.groupedBOMDetailsHead = Object.keys(this.groupedBOMDetails[0]);
    this.customizeGroupedGrid() //add decimal db
  }
  /**customize Grouped Grid data fo BOM details*/
  customizeGroupedGrid() {
    this.groupedBOMDetails.forEach((item: any) => {
      item.WEIGHT = this.commonService.decimalQuantityFormat(item.WEIGHT, 'METAL')

      if (item.DIVCODE == 'G') {
        item.WEIGHT_GMS = this.commonService.decimalQuantityFormat(item.WEIGHT_GMS, 'METAL')
        if (!this.headerDetails.FixedMetal) {
          item.AMOUNTFC = '0.00'
        }
      } else {
        item.WEIGHT_GMS = this.commonService.decimalQuantityFormat(item.WEIGHT_GMS / 5, 'METAL')
      }
      item.AMOUNT_FC = this.commonService.decimalQuantityFormat(item.AMOUNT_FC, 'METAL')
      item.LABAMOUNTFC = this.commonService.decimalQuantityFormat(item.LABAMOUNTFC, 'AMOUNT')
      item.WASTAGE_AMTFC = this.commonService.decimalQuantityFormat(item.WASTAGE_AMTFC, 'AMOUNT')
    })
  }

  /**USE: stock code division change to assign data to the lookup */
  changeDivision(event: any): void {
    if (event.target.value == '') return;
    event.target.value = event.target.value.toUpperCase()
    if (this.commonService.divisionMasterList.length == 0) {
      this.commonService.toastErrorByMsgId('MSG1531');
      return
    }
    let divisionArr = this.commonService.divisionMasterList?.filter((item: any) => item.DIVISION_CODE == event.target.value)
    if (divisionArr.length == 0) {
      this.commonService.toastErrorByMsgId('MSG1531');// MSG NOT FOUND
      return
    }
    if (event.target.value == 'X') {
      this.stockCodeData.LOOKUPID = 110
      this.stockCodeData.WHERECONDITION = ''
    } else if (divisionArr[0].DIVISION == 'M') {
      this.stockCodeData.LOOKUPID = 23
      this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${event.target.value}' AND SUBCODE = 0`
    } else {
      this.stockCodeData.LOOKUPID = 4
      this.stockCodeData.WHERECONDITION = `ITEM = '${event.target.value}'`
    }
  }
  /**USE: design Code Selection */
  mainStockCodeSelected(data: any): void {
    if (data) {
      console.log(data,'data');
      
      if (data.DESCRIPTION) {
        this.diamondSalesDetailForm.controls.StockCodeDesc.setValue(data.DESCRIPTION)
      }
      if (data.Stock_Description) {
        this.diamondSalesDetailForm.controls.StockCodeDesc.setValue(data.Stock_Description)
      }
      if (data.STOCK_CODE) {
        this.diamondSalesDetailForm.controls.StockCode.setValue(data.STOCK_CODE)
        this.designCodeValidate({ target: { value: data.STOCK_CODE } }, 'STOCK')
      }
      if (data.Stock_Code) {
        console.log(data.Stock_Code,'data.StockCode');
        
        this.diamondSalesDetailForm.controls.StockCode.setValue(data.Stock_Code)
        this.designCodeValidate({ target: { value: data.Stock_Code } }, 'STOCK')
      }
      
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  /**USE: design Code Selection */
  designCodeSelected(data: any): void {
    if (data.DESIGN_CODE) {
      this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
      this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
      this.designCodeValidate({ target: { value: data.DESIGN_CODE } }, 'DESIGN')
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  /**USE: color Code Selection */
  metalColorCodeSelected(data: any): void {
    if (data.CODE) {
      this.summaryDetailForm.controls.COLOR.setValue(data.CODE)
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  /**USE: color Code Selection */
  karatCodeSelected(data: any): void {
    if (data['Karat Code']) {
      this.summaryDetailForm.controls.KARAT_CODE.setValue(data['Karat Code'])
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  /**USE: color Code Selection */
  sizeCodeSelected(data: any): void {
    if (data.ATTR_CODE) {
      this.summaryDetailForm.controls.SIZE.setValue(data.ATTR_CODE)
    } else {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  
  /**use: validate design code change to fetch data with design code */
  designCodeValidate(event: any, flag?: string): void {
    // 'GetDesignStnmtlDetailNet'
    if (event.target.value == '') return
    this.reset() //reset all data
    //this.snackBar.open('Loading...')
    
    let postData = {
      "SPID": "003",
      "parameter": {
        "FLAG": 'VIEW',
        "DESIGNCODE": event.target.value || '',
        "STRDESIGN_STOCK": flag == 'STOCK' ? 'Y' : 'N',
        "METAL_COLOR": '',
        "MRG_PERC": '',
        "ACCODE": this.headerDetails.PartyCode || ''
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.dynamicData || result.status == 'Success') {
          let data: any = []
          // 1st result set Summary details data
          if (result.dynamicData[0] && result.dynamicData[0].length > 0) {
            this.isViewSummaryTab = true;
            data = result.dynamicData[0]
            data = this.commonService.arrayEmptyObjectToString(data)
            this.summaryDetailData = data[0]
          } else {
            this.commonService.toastErrorByMsgId('MSG1531');
          }
          // 2nd and 3rd result Parts / Components details data
          if ((result.dynamicData[1]?.length > 0) ||
            (result.dynamicData[2]?.length > 0)) {
            this.isViewComponentsTab = true;
            this.gridComponents = result.dynamicData[1]
            this.gridParts = result.dynamicData[2]
          } else {
            this.isViewComponentsTab = false;
          }
          //4th result is BOM Details data
          if (result.dynamicData[3] && result.dynamicData[3].length > 0) {
            this.isViewBOMTab = true;
            this.BOMDetailsArray = result.dynamicData[3]
            this.BOMDetailsDataToGroup = result.dynamicData[3]
            this.groupBomDetailsData()
            this.formatBOMDetailGrid()
          } else {
            this.isViewBOMTab = false;
          }
          // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0]);

          this.diamondSalesDetailForm.controls.PCS.setValue(1)

          this.diamondSalesDetailForm.controls.designCode.setValue(this.summaryDetailData.DESIGN_CODE)
          this.diamondSalesDetailForm.controls.designDescription.setValue(this.summaryDetailData.DESIGN_DESCRIPTION)

          this.diamondSalesDetailForm.controls.RATEFC.setValue(this.summaryDetailData.RATE)
          this.diamondSalesDetailForm.controls.METAL_WT.setValue(this.summaryDetailData.METALWT)
          this.diamondSalesDetailForm.controls.STOCK_CODE.setValue(this.summaryDetailData.STOCK_CODE)
          this.diamondSalesDetailForm.controls.Remarks.setValue(this.summaryDetailData.KARAT_CODE + ':' + this.summaryDetailData.COLOR + ':' + this.summaryDetailData.DESIGN_DESCRIPTION)

          this.summaryDetailForm.controls.CATEGORY_CODE.setValue(this.summaryDetailData.CATEGORY_CODE)
          this.summaryDetailForm.controls.SUBCATEGORY_CODE.setValue(this.summaryDetailData.SUBCATEGORY_CODE)
          this.summaryDetailForm.controls.COLOR.setValue(this.summaryDetailData.COLOR)
          this.summaryDetailForm.controls.KARAT_CODE.setValue(this.summaryDetailData.KARAT_CODE)
          this.summaryDetailForm.controls.PURITY.setValue(this.commonService.decimalQuantityFormat(this.summaryDetailData.PURITY, 'PURITY'))
          this.summaryDetailForm.controls.SUPPLIER_CODE.setValue(this.summaryDetailData.SUPPLIER_CODE)
          this.summaryDetailForm.controls.SEQ_CODE.setValue(this.summaryDetailData.SEQ_CODE)
          this.summaryDetailForm.controls.BRAND_CODE.setValue(this.summaryDetailData.BRAND_CODE)
          this.summaryDetailForm.controls.TYPE_CODE.setValue(this.summaryDetailData.TYPE_CODE)
          this.summaryDetailForm.controls.SIZE.setValue(this.summaryDetailData.SIZE)
          this.summaryDetailForm.controls.SURFACEPROPERTY.setValue(this.summaryDetailData.SURFACEPROPERTY)
          this.summaryDetailForm.controls.WIDTH.setValue(this.summaryDetailData.WIDTH)
          this.summaryDetailForm.controls.THICKNESS.setValue(this.summaryDetailData.THICKNESS)
          this.summaryDetailForm.controls.ENGRAVING_TEXT.setValue(this.summaryDetailData.ENGRAVING_TEXT)
          this.summaryDetailForm.controls.ENGRAVING_FONT.setValue(this.summaryDetailData.ENGRAVING_FONT)

          this.calculateTotal()
        } else {
          this.commonService.toastErrorByMsgId('MSG1531');
        }
      }, err => {
        this.snackBar.dismiss()
        this.commonService.toastErrorByMsgId('MSG1531');
      })
    this.subscriptions.push(Sub)
  }

  //**USE: calculate total on value change */
  calculateTotal(event?: any) {
    // if(event.target.value == '') return;
    let dblStone_Wt: any = 0; let dblMetal_Wt: number = 0;
    let dblAmount: number = 0; let dblTotLabour: number = 0; let dblTotRate: number = 0;
    let dblDisc_Amt: number = 0; let dblDuty_Amt: number = 0;
    let dblLoad_Amt: number = 0; let dblMargin_Amt: number = 0;
    let dblDia_Amt: number = 0; let dblGold_Loss_Amt: number = 0;
    let dblMarkup_Amt: number = 0; let dblMetal_Amt: number = 0;
    let dblLab_amount: number = 0; let dblSetting_Amount: number = 0;
    let dblSetting: number = 0; let dblPolish: number = 0;
    let dblRhodium: number = 0; let dblLabour: number = 0;
    let dblMisc: number = 0; let dblWastageAmt: number = 0;

    this.BOMDetailsArray.forEach((item: any, index: number) => {
      if (item.METALSTONE == "M") { //GOLD calculation
        if (!this.headerDetails.FixedMetal) {
          item.AMOUNTFC = this.commonService.decimalQuantityFormat(0.00, 'AMOUNT')
          item.RATEFC = this.commonService.decimalQuantityFormat(0.00, 'AMOUNT')
        }
        dblMetal_Wt += this.commonService.emptyToZero(item.GROSS_WT);
        dblLab_amount += this.commonService.emptyToZero(item.LABAMOUNTFC);
        dblMetal_Amt += this.commonService.emptyToZero(item.AMOUNTFC);
        dblWastageAmt += this.commonService.emptyToZero(item.WASTAGE_AMTFC);
        // Calc_Metal_Value(i);
        // if (this.intLabType != 4) {
        //   this.calculateMetalLabour(index);
        // }
      } else { //stone calculation
        dblSetting_Amount += this.commonService.emptyToZero(item.LABAMOUNTFC);
        if (item.METALSTONE == "Z") {
          dblStone_Wt += this.commonService.emptyToZero(this.commonService.emptyToZero(item.GROSS_WT)) * 5;
        } else {
          dblStone_Wt += this.commonService.emptyToZero(this.commonService.emptyToZero(item.GROSS_WT));
        }
        if (item.METALSTONE == "L") {
          dblDia_Amt += this.commonService.emptyToZero(item.AMOUNTFC);
        }
      }
      dblAmount += this.commonService.emptyToZero(item.AMOUNTFC);
    })

    let TotMetal_Wt: any = dblMetal_Wt * this.diamondSalesDetailForm.value.PCS;
    let TotStone_Wt: any = (dblStone_Wt * this.diamondSalesDetailForm.value.PCS);
    let TotGross_Wt: any = (dblMetal_Wt + (dblStone_Wt / 5)) * this.diamondSalesDetailForm.value.PCS;

    TotMetal_Wt = this.commonService.emptyToZero (TotMetal_Wt)
    TotStone_Wt = this.commonService.emptyToZero(TotStone_Wt)
    TotGross_Wt = this.commonService.emptyToZero(TotGross_Wt)
    console.log(TotGross_Wt);
    
    this.summaryDetailData.TotMetal_Wt = TotMetal_Wt
    this.summaryDetailData.TotStone_Wt = TotStone_Wt

    let txtCharge4FC: number = dblLab_amount;
    let txtCharge1FC: number = dblSetting_Amount;

    let txtCharge2FC: number = 0;//todo
    let txtCharge3FC: number = 0;//todo
    let txtCharge5FC: number = 0;//todo

    this.diamondSalesDetailForm.controls.GROSS_WT.setValue(this.commonService.decimalQuantityFormat(TotGross_Wt, 'METAL'));
    this.diamondSalesDetailForm.controls.METAL_WT.setValue(this.commonService.decimalQuantityFormat(TotMetal_Wt, 'METAL'));
    this.diamondSalesDetailForm.controls.STONE_WT.setValue(this.commonService.decimalQuantityFormat(TotStone_Wt, 'STONE'));
    this.summaryDetailForm.controls.SETTING.setValue(this.commonService.emptyToZero(txtCharge1FC));
    this.summaryDetailForm.controls.LABOUR.setValue(this.commonService.emptyToZero(txtCharge4FC));

    // labourchargetype checking
    if (this.intLabType == 4) {
      //TODO labour details grid calculation
    } else {
      if (this.intLabType == 2) {
        //  dblTotLabour = this.commonService.emptyToZero(txtTotalLabour);
      } else {
        dblTotLabour = txtCharge1FC + txtCharge3FC + txtCharge4FC + txtCharge5FC;

        if (dblTotLabour) this.summaryDetailForm.controls.Total_Labour.setValue(dblTotLabour)
      }
    }
    // if (this.content.FixedMetal && this.content.FixedMetal == true) dblAmount -= dblMetal_Amt;
    dblTotRate = this.commonService.decimalQuantityFormat(dblAmount + dblTotLabour, 'AMOUNT');
    this.diamondSalesDetailForm.controls.RATEFC.setValue(this.customizeComma({ value: dblTotRate }))
    this.summaryDetailData.dblTotRate = dblTotRate
    
    let sumAMOUNT = this.commonService.commaSeperation(this.diamondSalesDetailForm.value.PCS * dblTotRate)
    console.log(sumAMOUNT);
    
    this.diamondSalesDetailForm.controls.AMOUNT.setValue(sumAMOUNT)
    
    // price factors calculation
    console.log(this.summaryDetailForm.value.MarkupPercentage);
    
    if (this.commonService.emptyToZero(this.summaryDetailForm.value.MarkupPercentage)  > 0) {
      dblMarkup_Amt = (dblDia_Amt * this.summaryDetailForm.value.MarkupPercentage) / 100;
      dblTotRate += dblMarkup_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.WastagePercentage) > 0 && dblWastageAmt == 0) {
      dblGold_Loss_Amt = (dblMetal_Amt * this.summaryDetailForm.value.WastagePercentage) / 100;
      dblTotRate += dblGold_Loss_Amt;
    } else {
      dblGold_Loss_Amt = dblWastageAmt;
      dblTotRate += dblGold_Loss_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.DutyPercentage > 0)) {
      dblDuty_Amt = (dblTotRate * this.summaryDetailForm.value.DutyPercentage) / 100;
      dblTotRate += dblDuty_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.MarginPercentage > 0)) {
      dblMargin_Amt = (dblTotRate * this.summaryDetailForm.value.MarginPercentage) / 100;
      dblTotRate += dblMargin_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.LoadingPercentage > 0)) {
      dblLoad_Amt = (dblTotRate * this.summaryDetailForm.value.LoadingPercentage) / 100;
      dblTotRate += dblLoad_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.LoadingPercentage > 0)) {
      dblDisc_Amt = (dblTotRate * this.summaryDetailForm.value.LoadingPercentage) / 100;
      dblTotRate -= dblDisc_Amt;
    }
    console.log(dblDuty_Amt,'dblDuty_Amt');
    
    // txtMarkup_Amt = dblMarkup_Amt.ToString();
    // this.diamondSalesDetailForm.controls.Markup.setValue(this.commonService.emptyToZero(dblMarkup_Amt))
    // txtGold_loss_Amt = dblGold_Loss_Amt.ToString();
    // txtDuty_Amt = dblDuty_Amt.ToString();
    // txtMargin_Amt = dblMargin_Amt.ToString();
    // txtLoad_Amt = dblLoad_Amt.ToString();
    // txtDISCAMTFC = dblDisc_Amt.ToString();

    // this.diamondSalesDetailForm.controls.Margin.setValue(this.commonService.emptyToZero(dblDuty_Amt))
    let txtItemRateFC = dblTotRate;

    this.diamondSalesDetailForm.controls.RATEFC.setValue(txtItemRateFC)
    let txtValueFC = this.commonService.decimalQuantityFormat((this.diamondSalesDetailForm.value.PCS * dblTotRate), 'AMOUNT');
    this.diamondSalesDetailForm.controls.AMOUNT.setValue(txtValueFC)

    if (dblTotRate > 0) {
      this.viewFlag.ItemRateFC = false;
      this.viewFlag.AmountValueFC = false;
    }
  }
  calculateMetalLabour(index: number) {
    let metalItemData = this.BOMDetailsArray.filter((item: any) => item.METALSTONE == 'M')

    this.snackBar.open('Loading...')
    let postData = {
      "SPID": "021",
      "parameter": {
        "Design_Code": this.commonService.nullToString(this.diamondSalesDetailForm.value.designCode),
        "strPartyCode": this.headerDetails.PartyCode || '',
        "strCurr_Code": this.commonService.nullToString(this.headerDetails.partyCurrencyType),
        "dblCurr_Rate": this.commonService.nullToString(this.headerDetails.partyCurrencyRate),
        "dblPcs": this.commonService.emptyToZero(metalItemData[0].PCS.toString()),
        "dblGross_Wt": this.commonService.emptyToZero(metalItemData[0].GROSS_WT.toString()),
        "strPriceCode": '',
        "strLabCode": this.commonService.nullToString(metalItemData[0].LABCHGCODE.toString()),
        "strDivision": this.commonService.nullToString(metalItemData[0].DIVCODE),
        "strColorSet": 'N',
        "strSHAPE": this.commonService.nullToString(metalItemData[0].SHAPE),
        "strSieve": this.commonService.nullToString(metalItemData[0].SIEVE),
        "strSieve_Set": this.commonService.nullToString(metalItemData[0].SIEVE_SET),
        "strColor": this.commonService.nullToString(metalItemData[0].COLOR),
        "strClarity": this.commonService.nullToString(metalItemData[0].CLARITY),
        "strSize_From": this.commonService.nullToString(metalItemData[0].SIZE_FROM),
        "strSize_To": this.commonService.nullToString(metalItemData[0].SIZE_TO),
        "strVocDate": '',
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result: any) => {
        this.snackBar.dismiss()
        if (result.dynamicData || result.status == 'Success') {
          let data = result.dynamicData[0]

          const rateArr = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == data[0].LCURR_CODE);

          this.summaryDetailForm.controls.LABOUR.setValue(this.commonService.FCToCC(data[0].LCURR_CODE, data[0].LABOUR))
          let rate = 25.70
          this.BOMDetailsArray.forEach((item: any) => {
            if (item.METALSTONE == 'M') {
              item.LABRATEFC = rate
            }
          })
        }
      })
  }
  
  /**USE: final form save  */
  formSubmit() {
    let item: dataToSave = {
      BOMDETAILS: [],
      SUMMARYDETAILS: [],
      PART_DETAILS: [],
      COMPONENT_DETAILS: []
    }
    if (this.BOMDetailsArray.length > 0) {
      item.BOMDETAILS = this.BOMDetailsArray
    }
    if (this.summaryDetailForm.value || this.diamondSalesDetailForm.value) {
      item.SUMMARYDETAILS = [{ ...this.diamondSalesDetailForm.value, ...this.summaryDetailForm.value }]
    }
    if(this.gridParts.length>0){
      item.PART_DETAILS = this.gridParts
    }
    console.log(this.gridComponents,'this.gridComponents');
    
    if(this.gridComponents.length>0){
      item.COMPONENT_DETAILS = this.gridComponents
    }
    this.close([item])//USE: passing Detail data to header screen on close
  }
  /**USE: reset All data with this function to reuse as needed */
  reset() {
    this.BOMDetailsArray = []
  }

  /**USE: close activeModal */
  close(data?: any) {
    this.activeModal.close(data);
  }
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
}
