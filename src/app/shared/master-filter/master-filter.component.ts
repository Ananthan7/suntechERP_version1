import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LanguageService } from "src/app/core/services/language.service";
import { SignumCRMApiService } from "src/app/services/signum-crmapi.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CommonServiceService } from "src/app/services/common-service.service";
import Swal from 'sweetalert2';
import { EventService } from "src/app/core/services/event.service";

@Component({
  selector: "master-filter",
  templateUrl: "./master-filter.component.html",
  styleUrls: ["./master-filter.component.scss"],
})
export class MasterFilterComponent implements OnInit {
  @Output() resetClick = new EventEmitter();
  @Output() filterClick = new EventEmitter();
  @Output() exportExcel = new EventEmitter();
  @Output() exportPDF = new EventEmitter();
  @Output() sendEmail = new EventEmitter();
  @Output() filterData = new EventEmitter();
  @Output() refreshData = new EventEmitter();
  @Input() viewFilterBtn: boolean = true;
  @Input() viewExportBtn: boolean = true;
  @Input() viewBranch: boolean = true;
  date = new Date();
  currentYear = this.date.getFullYear();
  selectedTabName: string = "All";
  selectedlang: string;
  displaySidebar: boolean = false;
  displayExport: boolean = false;
  isLoading: boolean = false;
  division: any[] = [{ name: "ALL", code: 1 }];
  branchDisplay: any;
  getDate: any = new Date();
  TIME_PERIOD_ACCESS:any = localStorage.getItem('TIME_PERIOD_ACCESS')
  FILTERS_LIST:any = localStorage.getItem('FILTERS')?.split(',') || null
  filterTemplate:any = localStorage.getItem('TEMPLATE_NAME')
  displayYQM: boolean = false;
  //Array and object declarations
  year: any[] = []
  quarter: any[] = [
    { label: "Q1",name: "1" },
    { label: "Q2",name: "2" },
    { label: "Q3",name: "3" },
    { label: "Q4",name: "4" },
  ];
  month: any[] = [
    { name: "January" },
    { name: "February" },
    { name: "March" },
    { name: "April" },
    { name: "May" },
    { name: "June" },
    { name: "July" },
    { name: "August" },
    { name: "September" },
    { name: "October" },
    { name: "November" },
    { name: "December" },
  ];
  FILTER_MODEL:any = {}
  divisionSelected: any;
  divisionList: any[] = [];
  branchList: any[] = [];
  salesmanList: any[] = [];
  festivalList: any[] = [];
  currencyList: any[] = [];
  BrandList: any[] = [];
  collectionList: any[] = [];
  categoryList: any[] = [];
  typeList: any[] = [];
  subCollection: any[] = [];
  designList: any[] = [];
  SettingList: any[] = [];
  StoneTypeLockList: any[] = [];
  ShapeList: any[] = [];
  FluorList: any[] = [];
  model: any = {}
  CPRange: number[] = [0, 100];
  SPRange: number[] = [0, 100];
  /** form validations */
  dataForm = this.fb.group({
    divisionSelect: [null, [Validators.required]],
    branchSelected: [null, [Validators.required]],
    salesmanSelected: [null, [Validators.required]],
    yearSelected: [null, [Validators.required]],
    quarterSelected: [null, [Validators.required]],
    monthSelected: [null, [Validators.required]],
    festivalSelected: [null, [Validators.required]],
    fromDate: [null, [Validators.required]],
    toDate: [null, [Validators.required]],
    Brand: [null, [Validators.required]],
    Collection: [null, [Validators.required]],
    SubCollection: [null, [Validators.required]],
    Category: [null, [Validators.required]],
    Type: [null, [Validators.required]],
    Design: [null, [Validators.required]],
    Carat: [null, [Validators.required]],
    Setting: [null, [Validators.required]],
    StoneTypeLook: [null, [Validators.required]],
    Shape: [null, [Validators.required]],
    Fluor: [null, [Validators.required]],
    SupplierReference: [null, [Validators.required]],
    SupplierCode: [null, [Validators.required]],
    CostPriceRange: [[0, 100], [Validators.required]],
    SellingPriceRange: [null, [Validators.required]],
    Currency: [null, [Validators.required]],
    templateName: [null, [Validators.required]],
    istemplateSaved: [false, [Validators.required]],
  });

  constructor(
    private langService: LanguageService,
    private apiService: SignumCRMApiService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private commonServe: CommonServiceService,
    private eventService: EventService,
  ) {
    this.selectedlang = this.langService.getLanguage();
    this.divisionSelected = this.division[0].code;
    this.model.filters = []
    if (localStorage.getItem('userBranches') == 'Active') {
      this.branchDisplay = this.route.snapshot.paramMap.get('branch')
    } else {
      this.branchDisplay = localStorage.getItem('branch');
    }
    if(this.TIME_PERIOD_ACCESS){
      let yr = this.TIME_PERIOD_ACCESS.split(',')
      yr.forEach((item:any) => {
        this.year.push({ name: item })
      });
    }else{
      this.year = [
        { name: this.currentYear },
        { name: this.currentYear - 1 },
        { name: this.currentYear - 2 },
        { name: this.currentYear - 3 },
        { name: this.currentYear - 4 },
        { name: this.currentYear - 5 },
      ];
    }
    // this.savedTemplateDatas = localStorage.getItem('TEMPLATE_NAME')
    this.getTemplateChange()
  }

  ngOnInit(): void {
    this.selectTab("All");
    this.getFilterListModel()
  }
  ngAfterViewInit() {
    this.applyFilterEvent()
  }
  dateChange(){
    if(this.dataForm.value.fromDate && this.dataForm.value.toDate){
      this.displayYQM = true;
    }
  }
  toDateChange(){
    if(this.dataForm.value.fromDate && this.dataForm.value.toDate){
      this.displayYQM = true;
    }
  }
  getFilterListModel(){
    this.FILTERS_LIST?.forEach((element:any) => {
      this.FILTER_MODEL[element] = element
    });
    
  }
  applyFilterEvent(){
    this.eventService.behaviorSubscribe('ApplyFilter', (ApplyFilter) => {
      if(ApplyFilter == 1){
        this.filterTemplate = localStorage.getItem('TEMPLATE_NAME')
        this.applyFilter()
      }
    })
  }
  /**
   * Selected Template subscription to set filters
   */
  getTemplateChange() {
    this.eventService.behaviorSubscribe('templateChange', (templateChange) => {
      this.filterTemplate = localStorage.getItem('TEMPLATE_NAME')
      if (templateChange["SELECTED_FILTERS"]) {
        this.resetAll()
        this.dataForm.controls['templateName'].setValue(templateChange["TEMPLATE_NAME"])
        this.dataForm.controls['istemplateSaved'].setValue(true)
        let filterArr = templateChange["SELECTED_FILTERS"].split('|')
        if (filterArr) {
          const keyValuePairs: any = {};
          filterArr.forEach((item: any) => {
            const [key, value] = item.split('=');
            keyValuePairs[key] = value;
          });
          this.setTemplateDatas(keyValuePairs)
          this.applyFilter()
        }
      }else{
        this.resetAll()
        if(localStorage.getItem('TEMPLATE_NAME') == 'default'){
          this.applyFilter()
        }
      }
    });
  }
  setTemplateDatas(keyValuePairs: any) {
    if (keyValuePairs.division) {
      this.dataForm.controls['divisionSelect'].setValue(keyValuePairs.division.split(','))
    }
    if (keyValuePairs.branch) {
      this.dataForm.controls['branchSelected'].setValue(keyValuePairs.branch.split(','))
    }
    if (keyValuePairs.year) {
      this.dataForm.controls['yearSelected'].setValue(keyValuePairs.year.split(','))
    }
    if (keyValuePairs.quarter) {
      this.dataForm.controls['quarterSelected'].setValue(keyValuePairs.quarter.split(','))
    }
    if (keyValuePairs.month) {
      this.dataForm.controls['monthSelected'].setValue(keyValuePairs.month.split(','))
    }
    if (keyValuePairs.festival) {
      this.dataForm.controls['festivalSelected'].setValue(keyValuePairs.festival.split(','))
    }
    if (keyValuePairs.fromDate) {
      this.dataForm.controls['fromDate'].setValue(keyValuePairs.fromDate.split(','))
    }
    if (keyValuePairs.toDate) {
      this.dataForm.controls['toDate'].setValue(keyValuePairs.toDate.split(','))
    }
    if (keyValuePairs.Brand) {
      this.dataForm.controls['Brand'].setValue(keyValuePairs.Brand.split(','))
    }
    if (keyValuePairs.Collection) {
      this.dataForm.controls['Collection'].setValue(keyValuePairs.Collection.split(','))
    }
    if (keyValuePairs.SubCollection) {
      this.dataForm.controls['SubCollection'].setValue(keyValuePairs.SubCollection.split(','))
    }
    if (keyValuePairs.salesman) {
      this.dataForm.controls['salesmanSelected'].setValue(keyValuePairs.salesman.split(','))
    }
    if (keyValuePairs.Type) {
      this.dataForm.controls['Type'].setValue(keyValuePairs.Type.split(','))
    }
    if (keyValuePairs.Design) {
      this.dataForm.controls['Design'].setValue(keyValuePairs.Design.split(','))
    }
    if (keyValuePairs.Carat) {
      this.dataForm.controls['Carat'].setValue(keyValuePairs.Carat.split(','))
    }
    if (keyValuePairs.Setting) {
      this.dataForm.controls['Setting'].setValue(keyValuePairs.Setting.split(','))
    }
    if (keyValuePairs.StoneTypeLook) {
      this.dataForm.controls['StoneTypeLook'].setValue(keyValuePairs.StoneTypeLook.split(','))
    }
    if (keyValuePairs.Shape) {
      this.dataForm.controls['Shape'].setValue(keyValuePairs.Shape.split(','))
    }
    if (keyValuePairs.Fluor) {
      this.dataForm.controls['Fluor'].setValue(keyValuePairs.Fluor.split(','))
    }
    if (keyValuePairs.SupplierReference) {
      this.dataForm.controls['SupplierReference'].setValue(keyValuePairs.SupplierReference.split(','))
    }
    if (keyValuePairs.SupplierCode) {
      this.dataForm.controls['SupplierCode'].setValue(keyValuePairs.SupplierCode.split(','))
    }
    if (keyValuePairs.Currency) {
      this.dataForm.controls['Currency'].setValue(keyValuePairs.Currency.split(','))
    }
  }
  /** save Template to DB */
  saveTemplate() {
    this.model.filters = []
    if (this.dataForm.value.divisionSelect) {
      this.model.filters.push('division=' + this.dataForm.value.divisionSelect.toString())
    }
    if (this.dataForm.value.branchSelected) {
      this.model.filters.push('branch=' + this.dataForm.value.branchSelected.toString())
    }
    if (this.dataForm.value.salesmanSelected) {
      this.model.filters.push('salesman=' + this.dataForm.value.salesmanSelected.toString())
    }
    if (this.dataForm.value.yearSelected) {
      this.model.filters.push('year=' + this.dataForm.value.yearSelected.toString())
    }
    if (this.dataForm.value.quarterSelected) {
      this.model.filters.push('quarter=' + this.dataForm.value.quarterSelected.toString())
    }
    if (this.dataForm.value.monthSelected) {
      this.model.filters.push('month=' + this.dataForm.value.monthSelected.toString())
    }
    if (this.dataForm.value.festivalSelected) {
      this.model.filters.push('festival=' + this.dataForm.value.festivalSelected.toString())
    }
    if (this.dataForm.value.fromDate) {
      this.model.filters.push('fromDate=' + this.dataForm.value.fromDate.toString())
    }
    if (this.dataForm.value.toDate) {
      this.model.filters.push('toDate=' + this.dataForm.value.toDate.toString())
    }
    if (this.dataForm.value.Brand) {
      this.model.filters.push('Brand=' + this.dataForm.value.Brand.toString())
    }
    if (this.dataForm.value.Collection) {
      this.model.filters.push('Collection=' + this.dataForm.value.Collection.toString())
    }
    if (this.dataForm.value.SubCollection) {
      this.model.filters.push('SubCollection=' + this.dataForm.value.SubCollection.toString())
    }
    if (this.dataForm.value.Category) {
      this.model.filters.push('salesman=' + this.dataForm.value.Category.toString())
    }
    if (this.dataForm.value.Type) {
      this.model.filters.push('Type=' + this.dataForm.value.Type.toString())
    }
    if (this.dataForm.value.Design) {
      this.model.filters.push('Design=' + this.dataForm.value.Design.toString())
    }
    if (this.dataForm.value.Carat) {
      this.model.filters.push('Carat=' + this.dataForm.value.Carat.toString())
    }
    if (this.dataForm.value.Setting) {
      this.model.filters.push('Setting=' + this.dataForm.value.Setting.toString())
    }
    if (this.dataForm.value.StoneTypeLook) {
      this.model.filters.push('StoneTypeLook=' + this.dataForm.value.StoneTypeLook.toString())
    }
    if (this.dataForm.value.Shape) {
      this.model.filters.push('Shape=' + this.dataForm.value.Shape.toString())
    }
    if (this.dataForm.value.Fluor) {
      this.model.filters.push('Fluor=' + this.dataForm.value.Fluor.toString())
    }
    if (this.dataForm.value.SupplierReference) {
      this.model.filters.push('SupplierReference=' + this.dataForm.value.SupplierReference.toString())
    }
    if (this.dataForm.value.SupplierCode) {
      this.model.filters.push('SupplierCode=' + this.dataForm.value.SupplierCode.toString())
    }
    // if (this.dataForm.value.CostPriceRange.toString() != 0,100) {
    //   this.model.filters.push('CostPriceRange=' +this.dataForm.value.CostPriceRange.toString())
    // }
    // if (this.dataForm.value.SellingPriceRange) {
    //   this.model.filters.push('SellingPriceRange=' +this.dataForm.value.SellingPriceRange.toString())
    // }
    if (this.dataForm.value.Currency) {
      this.model.filters.push('Currency=' + this.dataForm.value.Currency.toString())
    }
    let filterString = this.model.filters.join('|')

    if (!this.dataForm.value.templateName) {
      this.model.TempNameFlag = true
      return
    } else {
      this.model.TempNameFlag = false
    }
    if (this.model.filters.length == 0) {
      this.model.filtersFlag = true
      return
    } else {
      this.model.filtersFlag = false
    }
    let link = 'AdminUserTemplateSaving/insertUserTemplateSaving'
    this.model.Tempdata = {
      "MID": 0,
      "USER_ID": localStorage.getItem('USER_ID') || 0,
      "USER_NAME": localStorage.getItem('username') || '',
      "CREATED_DATETIME": this.commonServe.formatDateTime(this.getDate) || new Date().toISOString,
      "SELECTED_FILTERS": filterString || '',
      "TEMPLATE_NAME": this.dataForm.value.templateName || ''
    }
    this.isLoading = true;
    this.apiService.postDynamicAPI(link, this.model.Tempdata).then((response: any) => {
      this.isLoading = false;
      if (response.status == 'Success') {
        this.dataForm.controls['istemplateSaved'].setValue(true)
        this.model.templateSavedFlag = 1;
      } else {
        this.dataForm.controls['istemplateSaved'].setValue(false)
        this.model.templateSavedFlag = 2;
      }
    })
  }
  
  applyFilter() {
    if(this.model.templateSavedFlag == 1 && this.dataForm.value.templateName){
      localStorage.setItem('TEMPLATE_NAME',this.dataForm.value.templateName)
    }
    this.filterData.emit(this.dataForm.value);
    this.displaySidebar = false;
  }
  removeFilter(item: any, filterName: string) {
    let index
    switch (filterName) {
      case 'divisionSelect':
        index = this.dataForm.value.divisionSelect.indexOf(item);
        this.dataForm.value.divisionSelect.splice(index, 1);
        this.dataForm.controls['divisionSelect'].setValue(this.dataForm.value.divisionSelect);
        break;
      case 'branchSelected':
        index = this.dataForm.value.branchSelected.indexOf(item);
        this.dataForm.value.branchSelected.splice(index, 1);
        this.dataForm.controls['branchSelected'].setValue(this.dataForm.value.branchSelected);
        break;
      case 'branchSelected':
        index = this.dataForm.value.branchSelected.indexOf(item);
        this.dataForm.value.branchSelected.splice(index, 1);
        this.dataForm.controls['branchSelected'].setValue(this.dataForm.value.branchSelected);
        break;
      case 'salesmanSelected':
        index = this.dataForm.value.salesmanSelected.indexOf(item);
        this.dataForm.value.salesmanSelected.splice(index, 1);
        this.dataForm.controls['salesmanSelected'].setValue(this.dataForm.value.salesmanSelected);
        break;
      case 'yearSelected':
        index = this.dataForm.value.yearSelected.indexOf(item);
        this.dataForm.value.yearSelected.splice(index, 1);
        this.dataForm.controls['yearSelected'].setValue(this.dataForm.value.yearSelected);
        break;
      case 'quarterSelected':
        index = this.dataForm.value.quarterSelected.indexOf(item);
        this.dataForm.value.quarterSelected.splice(index, 1);
        this.dataForm.controls['quarterSelected'].setValue(this.dataForm.value.quarterSelected);
        break;
      case 'monthSelected':
        index = this.dataForm.value.monthSelected.indexOf(item);
        this.dataForm.value.monthSelected.splice(index, 1);
        this.dataForm.controls['monthSelected'].setValue(this.dataForm.value.monthSelected);
        break;
      case 'festivalSelected':
        index = this.dataForm.value.festivalSelected.indexOf(item);
        this.dataForm.value.festivalSelected.splice(index, 1);
        this.dataForm.controls['festivalSelected'].setValue(this.dataForm.value.festivalSelected);
        break;
      case 'fromDate':
        this.dataForm.controls['fromDate'].setValue(null);
        break;
      case 'toDate':
        this.dataForm.controls['toDate'].setValue(null);
        break;
      case 'Brand':
        index = this.dataForm.value.Brand.indexOf(item);
        this.dataForm.value.Brand.splice(index, 1);
        this.dataForm.controls['Brand'].setValue(this.dataForm.value.Brand);
        break;
      case 'Collection':
        index = this.dataForm.value.Collection.indexOf(item);
        this.dataForm.value.Collection.splice(index, 1);
        this.dataForm.controls['Collection'].setValue(this.dataForm.value.Collection);
        break;
      case 'SubCollection':
        index = this.dataForm.value.SubCollection.indexOf(item);
        this.dataForm.value.SubCollection.splice(index, 1);
        this.dataForm.controls['SubCollection'].setValue(this.dataForm.value.SubCollection);
        break;
      case 'Category':
        index = this.dataForm.value.Category.indexOf(item);
        this.dataForm.value.Category.splice(index, 1);
        this.dataForm.controls['Category'].setValue(this.dataForm.value.Category);
        break;
      case 'Type':
        index = this.dataForm.value.Type.indexOf(item);
        this.dataForm.value.Type.splice(index, 1);
        this.dataForm.controls['Type'].setValue(this.dataForm.value.Type);
        break;
      case 'Design':
        index = this.dataForm.value.Design.indexOf(item);
        this.dataForm.value.Design.splice(index, 1);
        this.dataForm.controls['Design'].setValue(this.dataForm.value.Design);
        break;
      case 'Carat':
        index = this.dataForm.value.Carat.indexOf(item);
        this.dataForm.value.Carat.splice(index, 1);
        this.dataForm.controls['Carat'].setValue(this.dataForm.value.Carat);
        break;
      case 'Setting':
        index = this.dataForm.value.Setting.indexOf(item);
        this.dataForm.value.Setting.splice(index, 1);
        this.dataForm.controls['Setting'].setValue(this.dataForm.value.Setting);
        break;
      case 'StoneTypeLook':
        index = this.dataForm.value.StoneTypeLook.indexOf(item);
        this.dataForm.value.StoneTypeLook.splice(index, 1);
        this.dataForm.controls['StoneTypeLook'].setValue(this.dataForm.value.StoneTypeLook);
        break;
      case 'Shape':
        index = this.dataForm.value.Shape.indexOf(item);
        this.dataForm.value.Shape.splice(index, 1);
        this.dataForm.controls['Shape'].setValue(this.dataForm.value.Shape);
        break;
      case 'Fluor':
        index = this.dataForm.value.Fluor.indexOf(item);
        this.dataForm.value.Fluor.splice(index, 1);
        this.dataForm.controls['Fluor'].setValue(this.dataForm.value.Fluor);
        break;
      case 'SupplierReference':
        index = this.dataForm.value.SupplierReference.indexOf(item);
        this.dataForm.value.SupplierReference.splice(index, 1);
        this.dataForm.controls['SupplierReference'].setValue(this.dataForm.value.SupplierReference);
        break;
      case 'SupplierCode':
        index = this.dataForm.value.SupplierCode.indexOf(item);
        this.dataForm.value.SupplierCode.splice(index, 1);
        this.dataForm.controls['SupplierCode'].setValue(this.dataForm.value.SupplierCode);
        break;
      case 'Currency':
        index = this.dataForm.value.Currency.indexOf(item);
        this.dataForm.value.Currency.splice(index, 1);
        this.dataForm.controls['Currency'].setValue(this.dataForm.value.Currency);
        break;
      case 'CPRange':
        this.CPRange = [0, 100]
        break;
      case 'SPRange':
        this.SPRange = [0, 100]
        break;
      default:
      // fromDate: [null, [Validators.required]],
      // toDate: [null, [Validators.required]],
      // CostPriceRange: [null, [Validators.required]],
      // SellingPriceRange: [null, [Validators.required]],
    }
  }
  selectTab(value: string) {
    this.selectedTabName = value;
  }

  exportEmailClicked() {
    this.sendEmail.emit();
  }
  exportExcelClicked() {
    this.exportExcel.emit();
  }
  exportPDFClicked() {
    this.exportPDF.emit();
  }
  cancel() {
    this.model.templateSavedFlag = null;
    this.displaySidebar = false;
  }
  tempsaveClose() {
    this.model.templateSavedFlag = null;
  }
  resetClicked() {
    this.resetAll()
    this.resetClick.emit();
  }
  refreshClicked() {
    this.refreshData.emit();
  }
  filterClicked() {
    this.displaySidebar = !this.displaySidebar;
    this.filterClick.emit();
    if (this.divisionList.length == 0 || this.salesmanList.length == 0) {
      this.getDivisionList();
      this.getBranchList();
      this.getSalesmanLists();
      this.getFestivallist();
      this.getCurrencyRates();
      this.getcollectionList();
      this.getcategoryList();
      this.gettypeList();
      this.getBrandListApi();
      this.getSubCollectionList();
      this.getFilterDesignList();
      this.getFilterSettingList();
      this.getFilterStoneTypeLockList();
      this.getFilterShapeList();
      this.getFilterFluorList();
    }
  }

  getBranchList() {
    let branch = this.apiService.branchCode
    this.branchList = branch.split(',');
    // this.apiService.getBranchList().then((response: any) => {
    //   if (response.message == "OK") {
    //     this.branchList = response.branches;
    //   } else {
    //     console.log("Server error Branch List  not fetched");
    //   }
    // });
  }
  getDivisionList() {
    this.apiService.getDivisionList().then((response: any) => {
      if (response.message == "OK") {
        this.divisionList = response.division;
      } else {
        console.log("Server error division list not fetched");
      }
    });
  }
  getSalesmanLists() {
    this.apiService.getSalesmanList().then((response: any) => {
      if (response) {
        this.salesmanList = response.salesmen;
      } else {
        console.log("Server error salesman List not fetched");
      }
    });
  }
  getFestivallist() {
    this.apiService.getFestivallist().then((response: any) => {
      if (response.festivals) {
        this.festivalList = [
          ...new Set(response.festivals.map((item: any) => item.DESCRIPTION)),
        ];
      } else {
        console.log("Server error festival List not fetched");
      }
    });
  }
  getCurrencyRates() {
    this.apiService.getCurrencyRates().then((response: any) => {
      if (response) {
        let data = response.rates;
        if (data) {
          data.forEach((element: any) => {
            element.CURRENCY_DESCRIPTION = `${element.CURRENCY_DESCRIPTION}, ${element.CURRENCY_CODE}`;
          });
          this.currencyList = data;
        }
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }

  getBrandListApi() {
    let data = {
      TYPES: "BRAND MASTER",
    };
    this.apiService.getGeneralMasterSettings(data).then((response: any) => {
      if (response) {
        this.BrandList = response.generalMaster;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getcollectionList() {
    let data = {
      TYPES: "SUB CATEGORY MASTER",
    };
    this.apiService.getGeneralMasterSettings(data).then((response: any) => {
      if (response) {
        this.collectionList = response.generalMaster;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getcategoryList() {
    let data = {
      TYPES: "CATEGORY MASTER",
    };
    this.apiService.getGeneralMasterSettings(data).then((response: any) => {
      if (response) {
        this.categoryList = response.generalMaster;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  gettypeList() {
    let data = {
      TYPES: "TYPE MASTER",
    };
    this.apiService.getGeneralMasterSettings(data).then((response: any) => {
      if (response) {
        this.typeList = response.generalMaster;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getSubCollectionList() {
    this.apiService.getSubCollectionList().then((res: any) => {
      if (res) {
        this.subCollection = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getFilterDesignList() {
    this.apiService.getFilterDesignList().then((res: any) => {
      if (res) {
        this.designList = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getFilterSettingList() {
    this.apiService.getFilterSettingList().then((res: any) => {
      if (res) {
        //SETTING
        this.SettingList = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getFilterStoneTypeLockList() {
    this.apiService.getFilterStoneTypeLockList().then((res: any) => {
      if (res) {
        //STONETYPE_LOCK
        this.StoneTypeLockList = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getFilterShapeList() {
    this.apiService.getFilterShapeList().then((res: any) => {
      if (res) {
        //SHAPE
        this.ShapeList = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }
  getFilterFluorList() {
    this.apiService.getFilterFluorList().then((res: any) => {
      if (res) {
        this.FluorList = res.response;
      } else {
        console.log("Server error currency List not fetched");
      }
    });
  }

  resetAll() {
    this.dataForm.controls['templateName'].setValue(null)
    this.dataForm.controls['istemplateSaved'].setValue(false)
    this.dataForm.controls['divisionSelect'].setValue(null);
    this.dataForm.controls['branchSelected'].setValue(null);
    this.dataForm.controls['salesmanSelected'].setValue(null);
    this.dataForm.controls['yearSelected'].setValue(null);
    this.dataForm.controls['quarterSelected'].setValue(null);
    this.dataForm.controls['monthSelected'].setValue(null);
    this.dataForm.controls['festivalSelected'].setValue(null);
    this.dataForm.controls['fromDate'].setValue(null);
    this.dataForm.controls['toDate'].setValue(null);
    this.dataForm.controls['Brand'].setValue(null);
    this.dataForm.controls['Collection'].setValue(null);
    this.dataForm.controls['SubCollection'].setValue(null);
    this.dataForm.controls['Category'].setValue(null);
    this.dataForm.controls['Type'].setValue(null);
    this.dataForm.controls['Design'].setValue(null);
    this.dataForm.controls['Carat'].setValue(null);
    this.dataForm.controls['Setting'].setValue(null);
    this.dataForm.controls['StoneTypeLook'].setValue(null);
    this.dataForm.controls['Shape'].setValue(null);
    this.dataForm.controls['Fluor'].setValue(null);
    this.dataForm.controls['SupplierReference'].setValue(null);
    this.dataForm.controls['SupplierCode'].setValue(null);
    this.dataForm.controls['CostPriceRange'].setValue(null);
    this.dataForm.controls['SellingPriceRange'].setValue(null);
    this.dataForm.controls['Currency'].setValue(null);
    this.model.templateSavedFlag = null
  }
}
