import { Component, Input, OnInit } from '@angular/core';
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
  divisionMS: any = 'ID';
  isViewComponentsTab: boolean = false;
  isViewBOMTab: boolean = true;
  isViewSummaryTab: boolean = true;
  isViewDesignTab: boolean = false;

  BOMDetailsArray: any[] = [];
  groupedBOMDetails: any[] = [];
  groupedBOMDetailsHead: any[] = [];
  gridComponents: any[] = [];
  gridComponentsHead: any[] = [];
  gridParts: any[] = [];
  gridPartsHead: any[] = [];

  BOMDetailsArrayHead: any[] = ['DIVCODE', 'STONE_TYPE', 'COMP_CODE',
    'KARAT_CODE', 'PCS', 'GROSS_WT', 'RATELC', 'AMOUNTFC', 'SHAPE', 'SIEVE',
    'LABRATEFC', 'WASTAGE_PER', 'WASTAGE_WT', 'WASTAGE_AMTFC', 'LABAMOUNTFC',
    'SIEVE_DESC', 'SIZE_FORM', 'COLOR', 'CLARITY', 'STOCK_CODE', 'PROCESS_TYPE',
    'PROD_VARIANCE', 'PURITY']
  columnhead: any[] = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
  columnheader: any[] = ['', '', '', '', '', '', '', '', '', '', '', '', ''];
  columnheaders: any[] = ['Code', 'Div', 'Pcs', 'Qty', 'Rate', 'Amount', 'Wst %', 'Wst Amt', 'Lab Type'];
  columnheadmain: any[] = ['Stock Code', 'Stone Size', 'Stone Pcs', 'Stone Weight'];
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

  private subscriptions: Subscription[] = [];
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

  diamondSalesDetailForm: FormGroup = this.formBuilder.group({
    designCode: ['', [Validators.required]],
    designDescription: ['', [Validators.required]],
    StockCode: [''],
    StockCodeDesc: ['', [Validators.required]],
    DeliveryType: ['', [Validators.required]],
    DeliveryType2: ['', [Validators.required]],
    ProductionDate: ['', [Validators.required]],
    DeliveryOnDate: ['', [Validators.required]],
    Remarks: [''],
    StockBOM: [false, [Validators.required]],
    Pcs: ['', [Validators.required]],
    MetalWeight: ['', [Validators.required]],
    Rate: ['', [Validators.required]],
    StoneWeight: ['', [Validators.required]],
    Amount: ['', [Validators.required]],
    GrossWeight: ['', [Validators.required]],
    STOCK_CODE: ['', [Validators.required]],
  })
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
    // this.resizeGrid()
  }
  
  setInitialValues() {
    if (this.content && this.content.length > 0) {
      this.BOMDetailsArray = this.content[0].BOMDetails
      // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0])
      this.groupBomDetailsData({})
    }
  }
  isAllowRowEdit(data:any): boolean{
    if(data == 'PCS' || data == 'GROSS_WT' || data == 'LABRATELC'
    ){
      return true
    }else {
      return false
    }
  }
  colorcodeSelect(data:any): string{
    if(data == 'COLOR'){
      return 'colorcode'
    }else {
      return ''
    }
  }
  userDataSelected(event:any,value:any){
    this.BOMDetailsArray[value.data.SRNO - 1].COLOR = event.CODE;
  }
  groupBomDetailsData(event:any){
    // let data = event.data
    let result: any[] = []
    this.BOMDetailsArray.reduce(function (res: any, value: any) {
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
  }
  designCodeSelected(data: any) {
    this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
    this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
    this.designCodeValidate({ target: { value: data.DESIGN_CODE } })
  }
  /**use: design code change fn to fetch data with design code */
  designCodeValidate(event: any) {
    // 'GetDesignStnmtlDetailNet'
    if (event.target.value == '') return
    this.reset() //reset all data
    this.snackBar.open('Loading...')
    let API = 'ExecueteSPInterface'
    let postData = {
      "SPID": "003",
      "parameter": {
        "FLAG": 'VIEW',
        "DESIGNCODE": event.target.value || '', //TODO 'HM14437' 
        "METAL_COLOR": '',
        "MRG_PERC": '',
        "ACCODE": ''
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.dynamicData || result.status == 'Success') {
          let data: any;
          //Summary details data
          if(result.dynamicData[0].length>0){
            this.isViewSummaryTab = true;
            data = result.dynamicData[0]
            data = this.commonService.arrayEmptyObjectToString(data)
            data = data[0]
          } else {
            this.toastr.error('Summary details not found','', {
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
            this.groupBomDetailsData({})
          } else {
            this.isViewBOMTab = false;
          }
          // this.BOMDetailsArrayHead = Object.keys(this.BOMDetailsArray[0]);

          // this.column1 = Object.keys(this.BOMDetailsArray);
          this.diamondSalesDetailForm.controls.designCode.setValue(data.DESIGN_CODE)
          this.diamondSalesDetailForm.controls.designDescription.setValue(data.DESIGN_DESCRIPTION)
          if (data.PCS == 0) {
            this.diamondSalesDetailForm.controls.Pcs.setValue(1)
          }
          this.diamondSalesDetailForm.controls.Rate.setValue(data.RATE)
          this.diamondSalesDetailForm.controls.Rate.setValue(data.METALWT)
          this.diamondSalesDetailForm.controls.StockCode.setValue(data.STOCK_CODE)

          this.summaryDetailForm.controls.CATEGORY_CODE.setValue(data.CATEGORY_CODE)
          this.summaryDetailForm.controls.SUBCATEGORY_CODE.setValue(data.SUBCATEGORY_CODE)
          this.summaryDetailForm.controls.COLOR.setValue(data.COLOR)
          this.summaryDetailForm.controls.KARAT_CODE.setValue(data.KARAT_CODE)
          this.summaryDetailForm.controls.PURITY.setValue(data.PURITY)
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
  formSubmit() {
    let item: any = {}
    if (this.BOMDetailsArray.length > 0) {
      item.BOMDetails = this.BOMDetailsArray
    }
    if (this.summaryDetailForm.value) {
      item.summaryDetail = [{...this.diamondSalesDetailForm.value,...this.summaryDetailForm.value}]
    }
    this.close([item])
  }
  reset() {
    this.BOMDetailsArray = []
  }
  selectionChanged(data: any) {
    console.log(data, 'fireddddd');
  }

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
