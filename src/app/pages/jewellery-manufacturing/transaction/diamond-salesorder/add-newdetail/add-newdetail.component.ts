import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-add-newdetail',
  templateUrl: './add-newdetail.component.html',
  styleUrls: ['./add-newdetail.component.scss']
})
export class AddNewdetailComponent implements OnInit {
  @Input() content!: any; //use: To get clicked row details from master grid

  favoriteSeason: string = ''
  seasons: string[] = ['Metal', 'Stones'];
  season2: string[] = ['Metal', 'Stones', 'Total'];
  currentFilter: any;
  divisionMS: string = 'ID';
  codeSearchFlag: string = 'ALL';
  currentDate = new Date()
  firstTableWidth: any;
  secondTableWidth: any;
  headerDetails: any;
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
  /**USE: color Code lookup model*/
  colorCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE <> ''",
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
  /**USE: details main form group*/
  diamondSalesDetailForm: FormGroup = this.formBuilder.group({
    designCode: ['', [Validators.required]],
    designDescription: [''],
    StockCode: [''],
    StockCodeDesc: [''],
    DeliveryType: ['', [Validators.required]],
    DeliveryType2: ['', [Validators.required]],
    ProductionDate: [this.currentDate, [Validators.required]],
    DeliveryOnDate: [this.currentDate, [Validators.required]],
    Remarks: [''],
    StockBOM: [false, [Validators.required]],
    PCS: ['', [Validators.required]],
    METAL_WT: ['', [Validators.required]],
    RATEFC: ['', [Validators.required]],
    STONE_WT: ['', [Validators.required]],
    AMOUNT: ['', [Validators.required]],
    GROSS_WT: ['', [Validators.required]],
    STOCK_CODE: ['', [Validators.required]],
  })
  /**USE:  first sub form group for summary details tab*/
  summaryDetailForm: FormGroup = this.formBuilder.group({
    CATEGORY_CODE: ['', [Validators.required]],
    SUBCATEGORY_CODE: ['', [Validators.required]],
    COLOR: ['', [Validators.required]],
    KARAT_CODE: ['', [Validators.required]],
    PURITY: ['', [Validators.required]],
    SUPPLIER_CODE: ['', [Validators.required]],
    SEQ_CODE: ['', [Validators.required]],
    BRAND_CODE: ['', [Validators.required]],
    TYPE_CODE: ['', [Validators.required]],
    SIZE: ['', [Validators.required]],
    SURFACEPROPERTY: ['', [Validators.required]],
    WIDTH: ['', [Validators.required]],
    THICKNESS: ['', [Validators.required]],
    ENGRAVING_TEXT: ['', [Validators.required]],
    ENGRAVING_FONT: ['', [Validators.required]],
    SCREW_FIELD: ['', [Validators.required]],
    SETTING: ['', [Validators.required]],
    POLISHING: ['', [Validators.required]],
    RHODIUM: ['', [Validators.required]],
    LABOUR: ['', [Validators.required]],
    Misc: ['', [Validators.required]],
    Total_Labour: ['', [Validators.required]],
    Wastage: ['', [Validators.required]],
    WastagePercentage: ['', [Validators.required]],
    MarkupPercentage: ['', [Validators.required]],
    DutyPercentage: ['', [Validators.required]],
    MarginPercentage: ['', [Validators.required]],
    LoadingPercentage: ['', [Validators.required]],
    DiscountPercentage: ['', [Validators.required]],
    StampDetails: [''],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.setInitialValues()
    this.handleResize()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Call a method to handle the resize event
    this.handleResize();
  }

  private handleResize():void {
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
  /**USE: first setup if already added */
  setInitialValues():void {
    if (this.content[0] && this.content[0].headerDetails) {
      this.headerDetails = this.content[0].headerDetails

    }

    if (this.content[0] && this.content[0].BOMDetails) {
      this.BOMDetailsArray = this.content[0].BOMDetails
      // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0])
      this.groupBomDetailsData()
    }
  }
  customizeComma(data:any){
    if(!Number(data.value)) return data.value
    return Number(data.value).toLocaleString('en-US', { style: 'decimal' })
  }
  customizeText(data:any){
    let num = Number(data.value).toFixed(2)
    return num
  }
  //**USE: Format decimals in BOM details grid change*/
  formatBOMDetailGrid(data?: any): void{
    this.groupBomDetailsData()
    this.BOMDetailsArray.forEach((item:any)=>{
      if(item.METALSTONE == 'M'){
        item.GROSS_WT = this.commonService.decimalQuantityFormat(item.GROSS_WT,'METAL')
      }else if((item.METALSTONE == 'S')){
        item.GROSS_WT = this.commonService.decimalQuantityFormat(item.GROSS_WT,'STONE')
      }
      item.RATEFC = this.commonService.decimalQuantityFormat(item.RATEFC,'AMOUNT')
      item.LABRATEFC = this.commonService.decimalQuantityFormat(item.LABRATEFC,'AMOUNT')
      item.PURITY = this.commonService.decimalQuantityFormat(item.PURITY,'PURITY')
    })
  }
  /**USE: Allow Row Edit */
  isAllowRowEdit(data: any): boolean {
    if (data == 'PCS' || data == 'GROSS_WT' || data == 'LABRATELC'
    ) {
      return true
    } else {
      return false
    }
  }
  /**USE: Allow Row Edit */
  addAlignment(data: any): string {
    if (data == 'DIVCODE' || data == 'STONE_TYPE' || data == 'COMP_CODE'
      || data == 'KARAT_CODE' || data == 'SHAPE' || data == 'STOCK_CODE') {
      return 'center'
    } else {
      return 'right'
    }
  }
  /**USE: color code Select data */
  colorcodeSelect(data: any): string {
    if (data == 'COLOR') {
      return 'colorcode'
    } else {
      return ''
    }
  }
  userDataSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].COLOR = event.CODE;
  }
  processTypeSelected(event: any, value: any) {
    this.BOMDetailsArray[value.data.SRNO - 1].PROCESS_TYPE = event.PROCESS_TYPE;
  }
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
      res[value.DIVCODE].PCS += value.PCS;
      res[value.DIVCODE].WEIGHT += value.GROSS_WT;
      res[value.DIVCODE].WEIGHT_GMS += value.GROSS_WT;
      res[value.DIVCODE].AMOUNT_FC += value.AMOUNTFC;
      res[value.DIVCODE].LABAMOUNTFC += value.LABAMOUNTFC;
      res[value.DIVCODE].WASTAGE_AMTFC += value.WASTAGE_AMTFC;
      return res;
    }, {});
    
    this.groupedBOMDetails = result
    this.groupedBOMDetailsHead = Object.keys(this.groupedBOMDetails[0]);
    this.customizeGroupedGrid() //add decimal db
  }
  /**customize Grouped Grid data fo BOM details*/
  customizeGroupedGrid(){
    this.groupedBOMDetails.forEach((item:any)=>{
      item.WEIGHT = this.commonService.decimalQuantityFormat(item.WEIGHT,'METAL')
      item.WEIGHT_GMS = this.commonService.decimalQuantityFormat(item.WEIGHT_GMS,'METAL')
      item.AMOUNT_FC = this.commonService.decimalQuantityFormat(item.AMOUNT_FC,'METAL')
      item.LABAMOUNTFC = this.commonService.decimalQuantityFormat(item.LABAMOUNTFC,'AMOUNT')
      item.WASTAGE_AMTFC = this.commonService.decimalQuantityFormat(item.WASTAGE_AMTFC,'AMOUNT')
    })
  }
  /**USE: design Code Selection */
  designCodeSelected(data: any):void {
    if (data.DESIGN_CODE) {
      this.codeSearchFlag = 'DESIGN'
      this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
      this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
      this.designCodeValidate({ target: { value: data.DESIGN_CODE } })
    } else {
      this.toastr.error('Design Code not found', '', {
        timeOut: 3000,
      })
    }
  }
  /**use: design code change fn to fetch data with design code */
  designCodeValidate(event: any):void {
    // 'GetDesignStnmtlDetailNet'
    if (event.target.value == '') return
    this.reset() //reset all data
    this.snackBar.open('Loading...')
    let postData = {
      "SPID": "003",
      "parameter": {
        "FLAG": 'VIEW',
        "DESIGNCODE": event.target.value || '', //TODO 'HM14437' 
        "METAL_COLOR": '',
        "MRG_PERC": '',
        "ACCODE": this.headerDetails.PartyCode || ''
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.dynamicData || result.status == 'Success') {
          let data: any;
          //Summary details data
          if (result.dynamicData[0].length > 0) {
            this.isViewSummaryTab = true;
            data = result.dynamicData[0]
            data = this.commonService.arrayEmptyObjectToString(data)
            data = data[0]
          } else {
            this.toastr.error('Summary details not found', '', {
              timeOut: 3000,
            })
          }
          // Parts / Components details data
          if (result.dynamicData[1].length > 0) {
            this.isViewComponentsTab = true;
            this.gridComponents = result.dynamicData[1]
            this.gridComponentsHead = Object.keys(this.gridComponents[0]);
          } else {
            this.isViewComponentsTab = false;
          }
          if (result.dynamicData[2].length > 0) {
            this.isViewComponentsTab = true;
            this.gridParts = result.dynamicData[2]
            this.gridParts = Object.keys(this.gridParts[0]);
          } else {
            this.isViewComponentsTab = false;
          }
          //BOM Details data
          if (result.dynamicData[3].length > 0) {
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

          this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
          this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)

          this.diamondSalesDetailForm.controls.RATEFC.setValue(data.RATE)
          this.diamondSalesDetailForm.controls.METAL_WT.setValue(data.METALWT)
          this.diamondSalesDetailForm.controls.STOCK_CODE.setValue(data.STOCK_CODE)

          this.summaryDetailForm.controls.CATEGORY_CODE.setValue(data.CATEGORY_CODE)
          this.summaryDetailForm.controls.SUBCATEGORY_CODE.setValue(data.SUBCATEGORY_CODE)
          this.summaryDetailForm.controls.COLOR.setValue(data.COLOR)
          this.summaryDetailForm.controls.KARAT_CODE.setValue(data.KARAT_CODE)
          this.summaryDetailForm.controls.PURITY.setValue(this.commonService.decimalQuantityFormat(data.PURITY,'PURITY'))
          this.summaryDetailForm.controls.SUPPLIER_CODE.setValue(data.SUPPLIER_CODE)
          this.summaryDetailForm.controls.SEQ_CODE.setValue(data.SEQ_CODE)
          this.summaryDetailForm.controls.BRAND_CODE.setValue(data.BRAND_CODE)
          this.summaryDetailForm.controls.TYPE_CODE.setValue(data.TYPE_CODE)
          this.summaryDetailForm.controls.SIZE.setValue(data.SIZE)
          this.summaryDetailForm.controls.SURFACEPROPERTY.setValue(data.SURFACEPROPERTY)
          this.summaryDetailForm.controls.WIDTH.setValue(data.WIDTH)
          this.summaryDetailForm.controls.THICKNESS.setValue(data.THICKNESS)
          this.summaryDetailForm.controls.ENGRAVING_TEXT.setValue(data.ENGRAVING_TEXT)
          this.summaryDetailForm.controls.ENGRAVING_FONT.setValue(data.ENGRAVING_FONT)

          this.calculateTotal({})
        } else {
          this.toastr.error('Design Code not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
  }

  //**USE: calculate total on value change */
  calculateTotal(event: any) {
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
      console.log(item,'item');
      
      if (item.METALSTONE == "M") {
        if (!this.headerDetails.FixedMetal) {
          item.AMOUNTFC = this.commonService.decimalQuantityFormat(0.00, 'AMOUNT')
          item.WASTAGE_AMTFC = this.commonService.decimalQuantityFormat(0.00, 'AMOUNT')
        }
        dblMetal_Wt += this.commonService.emptyToZero(item.GROSS_WT);
        dblLab_amount += this.commonService.emptyToZero(item.LABAMOUNTFC);
        dblMetal_Amt += this.commonService.emptyToZero(item.AMOUNTFC);
        dblWastageAmt += this.commonService.emptyToZero(item.WASTAGE_AMTFC);

        // Calc_Metal_Value(i);
        if (this.intLabType != 4) {
          this.calculateMetalLabour(index);
        }
      } else {
        if (item.METALSTONE == "Z") {
          dblStone_Wt += this.commonService.emptyToZero(this.commonService.emptyToZero(item.GROSS_WT)) * 5;
        } else {
          dblStone_Wt += this.commonService.emptyToZero(this.commonService.emptyToZero(item.GROSS_WT));
        }
        dblSetting_Amount += this.commonService.emptyToZero(item.LABAMOUNTFC);
        if (item.METALSTONE == "L") {
          dblDia_Amt += this.commonService.emptyToZero(item.AMOUNTFC);
        }
      }
      dblAmount += this.commonService.emptyToZero(item.AMOUNTFC);
    })

    let TotMetal_Wt: any = dblMetal_Wt * this.diamondSalesDetailForm.value.PCS;
    let TotStone_Wt: any = (dblStone_Wt * this.diamondSalesDetailForm.value.PCS);
    let TotGross_Wt: any = (dblMetal_Wt + (dblStone_Wt / 5)) * this.diamondSalesDetailForm.value.PCS;

    TotMetal_Wt = this.commonService.decimalQuantityFormat(TotMetal_Wt, 'METAL')
    TotStone_Wt = this.commonService.decimalQuantityFormat(TotStone_Wt, 'STONE')
    TotGross_Wt = this.commonService.decimalQuantityFormat(TotGross_Wt, 'METAL')

    let txtCharge4FC: number = dblLab_amount;
    let txtCharge1FC: number = dblSetting_Amount;
    this.diamondSalesDetailForm.controls.SETTING.setValue(txtCharge1FC)
    //todo
    let txtCharge2FC: number = 0;
    let txtCharge3FC: number = 0;
    let txtCharge5FC: number = 0;

    if (TotGross_Wt) this.diamondSalesDetailForm.controls.GROSS_WT.setValue(TotGross_Wt);
    if (TotMetal_Wt) this.diamondSalesDetailForm.controls.METAL_WT.setValue(TotMetal_Wt);
    if (TotStone_Wt) this.diamondSalesDetailForm.controls.STONE_WT.setValue(TotStone_Wt);

    // labourchargetype checking
    if (this.intLabType == 4) {
      //TODO labour details grid calculation
    } else {
      if (this.intLabType == 2) {
        //  dblTotLabour = this.commonService.emptyToZero(txtTotalLabour);
      } else {
        dblTotLabour = txtCharge1FC + txtCharge4FC;
        dblTotLabour += txtCharge3FC + txtCharge4FC + txtCharge5FC;
        this.summaryDetailForm.controls.Total_Labour.setValue(dblTotLabour)
      }
    }
    // if (this.content.FixedMetal && this.content.FixedMetal == true) dblAmount -= dblMetal_Amt;
    dblTotRate = this.commonService.decimalQuantityFormat(dblAmount + dblTotLabour, 'AMOUNT');
    this.diamondSalesDetailForm.controls.RATEFC.setValue(this.customizeComma({value: dblTotRate}))
    let sumAMOUNT = this.customizeComma({value: this.diamondSalesDetailForm.value.PCS * dblTotRate})
    this.diamondSalesDetailForm.controls.AMOUNT.setValue(sumAMOUNT)
    //rate x weight = amount
    if (this.commonService.emptyToZero(this.summaryDetailForm.value.MarkupPercentage > 0)) {
      dblMarkup_Amt = (dblDia_Amt * this.summaryDetailForm.value.MarkupPercentage) / 100;
      dblTotRate += dblMarkup_Amt;
    }

    if (this.commonService.emptyToZero(this.summaryDetailForm.value.WastagePercentage) > 0 && dblWastageAmt == 0) {
      dblGold_Loss_Amt = (dblMetal_Amt * this.summaryDetailForm.value.WastagePercentage) / 100;
      dblTotRate += dblGold_Loss_Amt;
    }
    // else {
    //   dblGold_Loss_Amt = dblWastageAmt;
    //   dblTotRate += dblGold_Loss_Amt;
    // }

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

    // txtMarkup_Amt = dblMarkup_Amt.ToString();
    // txtGold_loss_Amt = dblGold_Loss_Amt.ToString();
    // txtDuty_Amt = dblDuty_Amt.ToString();
    // txtMargin_Amt = dblMargin_Amt.ToString();
    // txtLoad_Amt = dblLoad_Amt.ToString();
    // txtDISCAMTFC = dblDisc_Amt.ToString();
    let txtItemRateFC = dblTotRate;

    this.diamondSalesDetailForm.controls.RATEFC.setValue(txtItemRateFC)
    let txtValueFC = (this.diamondSalesDetailForm.value.PCS * dblTotRate);
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
        "Design_Code": this.diamondSalesDetailForm.value.designCode || '',
        "strPartyCode": this.headerDetails.PartyCode || '',
        "strCurr_Code": this.headerDetails.partyCurrencyType || '',
        "dblCurr_Rate":  this.headerDetails.partyCurrencyRate || '',
        "dblPcs":  metalItemData[0].PCS.toString() || 0,
        "dblGross_Wt": metalItemData[0].GROSS_WT.toString() || 0,
        "strPriceCode": '',
        "strLabCode": metalItemData[0].LABCHGCODE.toString() || '',
        "strDivision": metalItemData[0].DIVCODE || '',
        "strColorSet": 'N',
        "strSHAPE": metalItemData[0].SHAPE || '',
        "strSieve": metalItemData[0].SIEVE || '',
        "strSieve_Set": metalItemData[0].SIEVE_SET || '',
        "strColor": metalItemData[0].COLOR || '',
        "strClarity": metalItemData[0].CLARITY || '',
        "strSize_From": metalItemData[0].SIZE_FROM || '',
        "strSize_To": metalItemData[0].SIZE_TO || '',
        "strVocDate": '',
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
    .subscribe((result:any) => {
      this.snackBar.dismiss()
      if (result.dynamicData || result.status == 'Success') {
        let data = result.dynamicData[0]

        const rateArr = this.commonService.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == data[0].LCURR_CODE);
        
        this.summaryDetailForm.controls.LABOUR.setValue(this.commonService.FCToCC(data[0].LCURR_CODE,data[0].LABOUR)) 
        let rate = 25.70
        this.BOMDetailsArray.forEach((item:any)=>{
          if(item.METALSTONE == 'M'){
            item.LABRATEFC = rate
          }
        })
      }
    })
  }
  calculateRateAmount(event: any) {
    this.diamondSalesDetailForm.controls.AMOUNT.setValue(
      this.diamondSalesDetailForm.value.RATEFC * event.target.value
    )
  }
  /**USE: final form save */
  formSubmit() {
    let item: any = {}
    if (this.BOMDetailsArray.length > 0) {
      item.BOMDetails = this.BOMDetailsArray
    }
    if (this.summaryDetailForm.value || this.diamondSalesDetailForm.value) {
      item.summaryDetail = [{ ...this.diamondSalesDetailForm.value, ...this.summaryDetailForm.value }]
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
