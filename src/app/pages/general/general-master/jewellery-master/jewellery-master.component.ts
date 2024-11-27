import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTabGroup } from '@angular/material/tabs';
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import themes from "devextreme/ui/themes";
import { EnterMetalDetailsComponent } from "./enter-metal-details/enter-metal-details.component";
import { StoneDetailsComponent } from "./stone-details/stone-details.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";

@Component({
  selector: "app-jewellery-master",
  templateUrl: "./jewellery-master.component.html",
  styleUrls: ["./jewellery-master.component.scss"],
})
export class JewelleryMasterComponent implements OnInit {
  @ViewChild('tab3Checkbox') tab3Checkbox!: MatCheckbox;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  @ViewChild('itemcodedetailcodeSearch') itemcodedetailcodeSearch!: MasterSearchComponent;
  @ViewChild('designcodeSearch') designcodeSearch!: MasterSearchComponent;
  @ViewChild('modelcodeSearch') modelcodeSearch!: MasterSearchComponent;
  @ViewChild('costcenterMetalcodeSearch') costcenterMetalcodeSearch!: MasterSearchComponent;
  @ViewChild('costcenterMakingcodeSearch') costcenterMakingcodeSearch!: MasterSearchComponent;
  @ViewChild('vendorcodeSearch') vendorcodeSearch!: MasterSearchComponent;
  @ViewChild('typecodeSearch') typecodeSearch!: MasterSearchComponent;
  @ViewChild('countrycodeSearch') countrycodeSearch!: MasterSearchComponent;
  @ViewChild('categorycodeSearch') categorycodeSearch!: MasterSearchComponent;
  @ViewChild('subcategorycodeSearch') subcategorycodeSearch!: MasterSearchComponent;
  @ViewChild('brandcodeSearch') brandcodeSearch!: MasterSearchComponent;
  @ViewChild('colorcodeSearch') colorcodeSearch!: MasterSearchComponent;
  @ViewChild('fluorescencecodeSearch') fluorescencecodeSearch!: MasterSearchComponent;
  @ViewChild('claritycodeSearch') claritycodeSearch!: MasterSearchComponent;
  @ViewChild('rangecodeSearch') rangecodeSearch!: MasterSearchComponent;
  @ViewChild('stylecodeSearch') stylecodeSearch!: MasterSearchComponent;
  @ViewChild('HSNcodecodeSearch') HSNcodecodeSearch!: MasterSearchComponent;
  @ViewChild('timecodeSearch') timecodeSearch!: MasterSearchComponent;
  @ViewChild('karatcodeSearch') karatcodeSearch!: MasterSearchComponent;
  @ViewChild('price1codeSearch') price1codeSearch!: MasterSearchComponent;
  @ViewChild('price2codeSearch') price2codeSearch!: MasterSearchComponent;
  @ViewChild('price3codeSearch') price3codeSearch!: MasterSearchComponent;
  @ViewChild('price4codeSearch') price4codeSearch!: MasterSearchComponent;
  @ViewChild('price5codeSearch') price5codeSearch!: MasterSearchComponent;
  @ViewChild('collectioncodeSearch') collectioncodeSearch!: MasterSearchComponent;
  @ViewChild('sub_collectioncodeSearch') sub_collectioncodeSearch!: MasterSearchComponent;
  @ViewChild('stone_typecodeSearch') stone_typecodeSearch!: MasterSearchComponent;
  @ViewChild('settingcodeSearch') settingcodeSearch!: MasterSearchComponent;
  @ViewChild('shapecodeSearch') shapecodeSearch!: MasterSearchComponent;
  @ViewChild('inc_catcodeSearch') inc_catcodeSearch!: MasterSearchComponent;
  @ViewChild('order_refcodeSearch') order_refcodeSearch!: MasterSearchComponent;


  














  selectedTabIndex: number = 0;
  viewMode: boolean = false;
  editMode: boolean = false;
  EnterMetalDetailsComponentData: any[] = [];
  StoneDetailsComponentData: any[] = [];

  onCheckboxChange(tabIndex: number) {
    if (tabIndex === 2 && this.tab3Checkbox.checked) {
      this.selectedTabIndex = tabIndex;
    } else {
      this.selectedTabIndex = 0;
    }
  }
  currentDate = new Date();
  divisionMS: any = "ID";

  columnheaderMetailDetails: any[] = [
    "Div",
    "Karat",
    "Stock Code",
    "Gross Wt",
    "Purity",
    "Pure Wt",
    "Rate Type",
    "Metal Rate",
    "Rate Gms",
    "Amount",
    "Lab Rate",
    "Lab Amount",
    "Markup%",
    "Sale Value",
  ];
  columnhead: any[] = [
    "Division",
    "Gross Wt",
    "Karat",
    "Rate Type",
    "Rate",
    "Amount..",
    "Amount",
    "Metal Labour",
    "Rate/Gram",
    "MetalPer",
    "Color",
  ];
  columnheader: any[] = [
    
    "DIVCODE",
    "STOCK_CODE",
    "SHAPE",
    "COLOR",
    "CLARITY",
    "SIEVE",
    "DSIZE",
    "PCS",
    "KARAT",
    "CURRENCY_CODE",
    "PRICECODE",
    "LAB_RATE",
    "LABCHGCODE",
    "LABOURCODE",
  ];
  columnheaders: any[] = ["Sr", "Description", "FC", "LC"];
  columnheaderPartDetails: any[] = [
    "Sr#",
    "Div",
    "Part Code",
    "Design Code",
    "Pcs",
    "Gross Wt",
    "Rate",
    "Amount",
  ];
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  checkBoxesMode: string;
  allMode: string;


  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {
    this.allMode = "allPages";
    this.checkBoxesMode = themes.current().startsWith("material")
      ? "always"
      : "onClick";
  }

  ngOnInit(): void {

    if (this.content?.FLAG) {
      console.log(this.content)
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }

  }



  jewellerymasterForm: FormGroup = this.formBuilder.group({
    itemcode: ["", [Validators.required]],
    itemcodedetail: ["", [Validators.required]],
    vatOnMargin: ["", [Validators.required]],
    design: [""],
    excludeTax: ["", [Validators.required]],
    modelcode: [""],
    onHold: ["", [Validators.required]],
    description: [""],
    otherdesc: [""],
    costcenterMetal: ["", [Validators.required]],
    costcenterMaking: [""],
    vendorRef: [""],
    vendor: [""],
    vendorname: [""],
    type: [""],
    country: [""],
    category: [""],
    subcategory: [""],
    brand: [""],
    color: [""],
    fluorescence: [""],
    clarity: [""],
    range: [""],
    style: [""],
    HSNcode: [""],
    time: [""],
    PCSunit: [""],
    size: [""],
    setref: [""],
    karat: [""],
    printscheme: ["AED"],
    printscheme2: ["1.000000"],
    printscheme3: [""],
    printscheme4: [""],
    price1: [""],
    price2: [""],
    price3: [""],
    price4: [""],
    price5: [""],
    price1per: [""],
    price2per: [""],
    price3per: [""],
    price4per: [""],
    price5per: [""],
    price1FC: [""],
    price1LC: [""],
    price2FC: [""],
    price2LC: [""],
    price3FC: [""],
    price3LC: [""],
    price4FC: [""],
    price4LC: [""],
    price5FC: [""],
    price5LC: [""],
    landercost: [""],
    foreigncost: [""],
    marketcost: ["", [Validators.required]],
    POScus: [""],
    certdate: [""],
    certificateno: [""],
    componentSummary: [""],
    certificateby: [""],
    componentdetails: [""],
    noofcert: ["", [Validators.required]],
    stdPurity: [""],
    costdiff: [""],
    tagDetails: [""],
    createby: [""],
    lasteditby: [""],
    fristtransaction: [""],
    salesman: [""],
    createon: ["", [Validators.required]],
    lastediton: ["", [Validators.required]],
    lasttransaction: [""],
    collection: [""],
    sub_collection: [""],
    stone_type: [""],
    setting: [""],
    shape: [""],
    inc_cat: [""],
    order_ref: [""],
    tagetxtDetails: [""],
    salestagDetails: [""],
    diamondsPcs: [""],
    diamondsCarat: [""],
    diamondsGrams: [""],
    diamondsFC: [""],
    diamondsLC: [""],
    colorstonePcs: [""],
    colorstoneCarat: [""],
    colorstoneGrams: [""],
    colorstoneFC: [""],
    colorstoneLC: [""],
    pearlsPcs: [""],
    pearlsCarat: [""],
    pearlsGrams: [""],
    pearlsFC: [""],
    pearlsLC: [""],
    otstonesPcs: [""],
    otstonesCarat: [""],
    otstonesGrams: [""],
    otstonesFC: [""],
    otstonesLC: [""],
    metalPcs: [""],
    metalCarat: [""],
    metalGrams: [""],
    metalFC: [""],
    metalLC: [""],
    totalPcs: [""],
    totalCarat: [""],
    totalGrams: [""],
    totalFC: [""],
    totalLC: [""],
    settingFC: [""],
    settingLC: [""],
    polishingFC: [""],
    polishingLC: [""],
    rhodiumFC: [""],
    rhodiumLC: [""],
    makingFC: [""],
    makingLC: [""],
    platChargesFC: [""],
    platChargesLC: [""],
    certChargesFC: [""],
    certChargesLC: [""],
    othersFC: [""],
    othersLC: [""],
    totalLBFC: [""],
    totalLBLC: [""],
    noofplat: [""],
    grossWt: [""],
  });
  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  itemcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Item Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  itemcodeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.itemcode.setValue(value.PREFIX_CODE);
    this.jewellerymasterForm.controls.itemcodedetail.setValue(value.DESCRIPTION)
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  stoneTypeCodeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.stone_type.setValue(value.CODE);
  }

  settingTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Setting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SETTING TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    //LOAD_ONCLICK:true,
  }
  settingTypeCodeSelected(e: any) {

    console.log(e);
    this.jewellerymasterForm.controls.setting.setValue(e.CODE);
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "types='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeSelected(e: any) {

    console.log(e);
    this.jewellerymasterForm.controls.setting.setValue(e.CODE);
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
  designSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.design.setValue(value.DESIGN_CODE);
  }

  karatcodeData: MasterSearchModel = {
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
  karatcodeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.karat.setValue(value.KARAT_CODE);
  }

  costcenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: "COST_CODE",
    SEARCH_HEADING: "Cost Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  costcenterSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.costcenterMetal.setValue(value.COST_CODE);
  }

  costcenterSelectedMaking(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.costcenterMaking.setValue(value.COST_CODE);
  }

  modelcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 157,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Model Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  modelcodeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.modelcode.setValue(value.MODEL_CODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES ='country MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  countrySelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.country.setValue(value.DESCRIPTION);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Type Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  typeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.type.setValue(value.CODE);
  }

  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Vendor Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  vendorSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.vendor.setValue(value.ACCODE);
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Category Code",
    SEARCH_VALUE: "",
    WHERECONDITION:"TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  categorySelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.category.setValue(value.CODE);
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Subcategory Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  subcategorySelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.subcategory.setValue(value.CODE);
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Brand Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'BRAND MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  brandSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.brand.setValue(value.CODE);
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Design Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'color master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  colorSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.color.setValue(value.CODE);
  }

  fluorescenceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "fluorescence Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'FLUORESCENCE MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  fluorescenceSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.fluorescence.setValue(value.CODE);
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
    this.jewellerymasterForm.controls.clarity.setValue(value.CODE);
  }

  rangeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Range Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'RANGE MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  rangeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.range.setValue(value.CODE);
  }

  styleCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Style Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'STYLE MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  styleSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.style.setValue(value.CODE);
  }

  HSNcodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "HSN Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HSN MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  HSNcodeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.HSNcode.setValue(value.CODE);
  }

  timeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Time Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'TIME MASTER' AND DIV_D=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  timeSelected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.time.setValue(value.CODE);
  }

  price1CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "Price Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price1Selected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.price1.setValue(value.PRICE_CODE);
  }

  price2CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "Price Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price2Selected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.price2.setValue(value.PRICE_CODE);
  }

  price3CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "Price Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price3Selected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.price3.setValue(value.PRICE_CODE);
  }

  price4CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "Price Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price4Selected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.price4.setValue(value.PRICE_CODE);
  }

  price5CodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "Price Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  price5Selected(value: any) {
    console.log(value);
    this.jewellerymasterForm.controls.price5.setValue(value.PRICE_CODE);
  }


  addTableData() {
    const modalRef: NgbModalRef = this.modalService.open(
      EnterMetalDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.result.then((postData) => {
      console.log(postData);
      if (postData) {
        console.log("Data from modal:", postData);
        this.EnterMetalDetailsComponentData.push(postData);
      }
    });
  }

  deleteTableData() {
    this.tableData.pop();
  }

  addTableDataStoneDetails() {
    let tablecount = this.StoneDetailsComponentData.length;
    const modalRef: NgbModalRef = this.modalService.open(
      StoneDetailsComponent,
      {
        size: "xl",
        backdrop: true, //'static'
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.componentInstance.tablecount = tablecount;
    modalRef.result.then((postData) => {
      console.log(postData);
      if (postData) {
        console.log("Data from modal:", postData);
        this.StoneDetailsComponentData.push(postData);
      }
    });
  }

  deleteTableDataStoneDetails() {
    this.tableData.pop();
  }


  setFormValues() {
    if (!this.content) return

    this.dataService.getDynamicAPI('DiamondStockMaster/GetDiamondStockMasterHeaderAndDetail/' + this.content.STOCK_CODE)
    .subscribe((data) => {
      if (data.status == 'Success') {
        // console.log(data.response.CERT_DATE.split(' ')[0])
        // this.jewellerymasterForm.controls.certdate.setValue(data.response.CERT_DATE.split(' ')[0])
        // this.jewellerymasterForm.controls.createon.setValue(data.response.OPENED_ON)
        // this.jewellerymasterForm.controls.lastediton.setValue(data.response.LAST_EDT_ON)
 // Extract and format CERT_DATE
 //const certDate = data.response.CERT_DATE ? data.response.CERT_DATE.split(' ')[0] : null;



 let cert_date = data.response.CERT_DATE;
 let formattedDate: any;
 if (cert_date) {
     let [day, month, yearTime] = cert_date.split('/'); 
     let [year] = yearTime.split(' '); 
     formattedDate = `${year}-${month}-${day}`; 
 }
 

 let lastEditOn = data.response.LAST_EDT_ON;
 let formattedDatelastEditOn: any;
 if (lastEditOn) {
     let [day, month, yearTime] = lastEditOn.split('/'); 
     let [year] = yearTime.split(' '); 
     formattedDatelastEditOn = `${year}-${month}-${day}`; 
 }

 const openedOn = data.response.OPENED_ON && !isNaN(Date.parse(data.response.OPENED_ON))
 ? new Date(data.response.OPENED_ON).toISOString().split('T')[0]
 : null;


 this.jewellerymasterForm.controls.certdate.setValue(formattedDate);
 this.jewellerymasterForm.controls.createon.setValue(openedOn);
 this.jewellerymasterForm.controls.lastediton.setValue(formattedDatelastEditOn);


        // this.StoneDetailsComponentData.push(data.response.diamondStockDetails)
        this.StoneDetailsComponentData = [
          ...this.StoneDetailsComponentData, 
          ...(data.response.diamondStockDetails || [])
        ];



        this.jewellerymasterForm.controls.itemcode.setValue(this.content.ITEM)
        this.jewellerymasterForm.controls.itemcodedetail.setValue(this.content.SUPPLIER_CODE)
        this.jewellerymasterForm.controls.itemcode.setValue(this.content.STOCK_CODE)
        this.jewellerymasterForm.controls.description.setValue(this.content.STOCK_DESCRIPTION)
        this.jewellerymasterForm.controls.costcenterMetal.setValue(this.content.COST_CODE)
        this.jewellerymasterForm.controls.type.setValue(this.content.TYPE_CODE)
        this.jewellerymasterForm.controls.category.setValue(this.content.CATEGORY_CODE)
        this.jewellerymasterForm.controls.subcategory.setValue(this.content.SUBCATEGORY_CODE)
        this.jewellerymasterForm.controls.brand.setValue(this.content.BRAND_CODE)
        this.jewellerymasterForm.controls.country.setValue(this.content.COUNTRY_CODE)
        this.jewellerymasterForm.controls.design.setValue(this.content.DESIGN_CODE)
        this.jewellerymasterForm.controls.setref.setValue(this.content.SET_REF)
        this.jewellerymasterForm.controls.price1.setValue(this.content.PRICE1PER)
        this.jewellerymasterForm.controls.price2.setValue(this.content.PRICE2PER)
        this.jewellerymasterForm.controls.price3.setValue(this.content.PRICE3PER)
        this.jewellerymasterForm.controls.price4.setValue(this.content.PRICE4PER)
        this.jewellerymasterForm.controls.price5.setValue(this.content.PRICE5PER)
        this.jewellerymasterForm.controls.price1FC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE1FC))
        this.jewellerymasterForm.controls.price1LC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE1LC))
        this.jewellerymasterForm.controls.price2FC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE2FC))
        this.jewellerymasterForm.controls.price2LC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE2LC))
        this.jewellerymasterForm.controls.price3FC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE3FC))
        this.jewellerymasterForm.controls.price3LC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE3LC))
        this.jewellerymasterForm.controls.price4FC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE4FC))
        this.jewellerymasterForm.controls.price4LC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE4LC))
        this.jewellerymasterForm.controls.price5FC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE5FC))
        this.jewellerymasterForm.controls.price5LC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PRICE5LC))
        this.jewellerymasterForm.controls.price1per.setValue(this.content.CHARGE1FC)
        this.jewellerymasterForm.controls.price2per.setValue(this.content.CHARGE2FC)
        this.jewellerymasterForm.controls.price3per.setValue(this.content.CHARGE3FC)
        this.jewellerymasterForm.controls.price4per.setValue(this.content.CHARGE4FC)
        this.jewellerymasterForm.controls.price5per.setValue(this.content.CHARGE5FC)
        this.jewellerymasterForm.controls.color.setValue(this.content.COLOR)
        this.jewellerymasterForm.controls.clarity.setValue(this.content.CLARITY)
        this.jewellerymasterForm.controls.size.setValue(this.content.SIZE)
        this.jewellerymasterForm.controls.fluorescence.setValue(this.content.FLUOR)
        this.jewellerymasterForm.controls.certificateby.setValue(this.content.CERT_BY)
        //this.jewellerymasterForm.controls.certdate.setValue(this.content.CERT_DATE)
        this.jewellerymasterForm.controls.fristtransaction.setValue(this.content.FIRST_TRN)
        this.jewellerymasterForm.controls.lasttransaction.setValue(this.content.LAST_TRN)
        this.jewellerymasterForm.controls.salesman.setValue(this.content.SALPARTY)
        this.jewellerymasterForm.controls.PCSunit.setValue(this.content.PCS_PERUNIT)
        this.jewellerymasterForm.controls.style.setValue(this.content.STYLE)
        this.jewellerymasterForm.controls.otherdesc.setValue(this.content.STOCK_DESCRIPTION_OTHERS)
        this.jewellerymasterForm.controls.time.setValue(this.content.TIME_CODE)
        this.jewellerymasterForm.controls.range.setValue(this.content.RANGE_CODE)
        this.jewellerymasterForm.controls.diamondsPcs.setValue(this.content.DIA_PCS)
        this.jewellerymasterForm.controls.diamondsCarat.setValue(this.content.DIA_CARAT)
        this.jewellerymasterForm.controls.diamondsFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.DIA_VALUEFC))
        this.jewellerymasterForm.controls.diamondsLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.DIA_VALUECC))
        this.jewellerymasterForm.controls.colorstonePcs.setValue(this.content.COLOR_PCS)
        this.jewellerymasterForm.controls.colorstoneCarat.setValue(this.content.COLOR_CARAT)
        this.jewellerymasterForm.controls.colorstoneFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.COLOR_VALUEFC))
        this.jewellerymasterForm.controls.colorstoneLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.COLOR_VALUECC))
        this.jewellerymasterForm.controls.pearlsPcs.setValue(this.content.PEARL_PCS)
        this.jewellerymasterForm.controls.pearlsCarat.setValue(this.content.PEARL_CARAT)
        this.jewellerymasterForm.controls.pearlsFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PEARL_VALUEFC))
        this.jewellerymasterForm.controls.pearlsLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PEARL_VALUECC))
        this.jewellerymasterForm.controls.otstonesPcs.setValue(this.content.OTSTONES_PCS)
        this.jewellerymasterForm.controls.otstonesCarat.setValue(this.content.OTSTONES_CARAT)
        this.jewellerymasterForm.controls.otstonesFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.OTSTONES_VALUEFC))
        this.jewellerymasterForm.controls.otstonesLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.OTSTONES_VALUECC))
        this.jewellerymasterForm.controls.metalGrams.setValue(this.content.METAL_GROSSWT)
        this.jewellerymasterForm.controls.metalFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.METAL_VALUEFC))
        this.jewellerymasterForm.controls.lasttransaction.setValue(this.content.METAL_VALUECC)
        this.jewellerymasterForm.controls.metalLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.METAL_VALUECC))
        this.jewellerymasterForm.controls.totalPcs.setValue(this.content.TOTPCS)
        this.jewellerymasterForm.controls.totalCarat.setValue(this.content.TOTCARAT)
        this.jewellerymasterForm.controls.totalGrams.setValue(this.content.TOTGMS)
        this.jewellerymasterForm.controls.totalFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.TOTVFC))
        this.jewellerymasterForm.controls.totalLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.TOTVLC))
        this.jewellerymasterForm.controls.lasteditby.setValue(this.content.LAST_EDT_BY)
       // this.jewellerymasterForm.controls.lastediton.setValue(this.content.LAST_EDT_ON)
        this.jewellerymasterForm.controls.HSNcode.setValue(this.content.HSN_CODE)
        this.jewellerymasterForm.controls.onHold.setValue(this.content.ITEM_ONHOLD)
        this.jewellerymasterForm.controls.POScus.setValue(this.content.POS_CUST_CODE)
        this.jewellerymasterForm.controls.grossWt.setValue(this.content.POSGROSSWT)
        this.jewellerymasterForm.controls.modelcode.setValue(this.content.MODEL_CODE)
        this.jewellerymasterForm.controls.noofplat.setValue(this.content.NOOF_PLAT)
        this.jewellerymasterForm.controls.marketcost.setValue(this.content.MARKETCOSTFC)
        this.jewellerymasterForm.controls.noofcert.setValue(this.content.NOOF_CERT)
        this.jewellerymasterForm.controls.excludeTax.setValue(this.content.EXCLUDE_TRANSFER_WT)
        this.jewellerymasterForm.controls.karat.setValue(this.content.METALKARAT)
        this.jewellerymasterForm.controls.vatOnMargin.setValue(this.content.EXCLUDEGSTVAT)
        this.jewellerymasterForm.controls.costcenterMaking.setValue(this.content.SUPPLIER_REF)
        this.jewellerymasterForm.controls.vendorRef.setValue(this.content.SIEVE)
        this.jewellerymasterForm.controls.vendor.setValue(this.content.SHAPE)
        this.jewellerymasterForm.controls.vendorname.setValue(this.content.GRADE)
        this.jewellerymasterForm.controls.landercost.setValue(this.content.FINISH)
        this.jewellerymasterForm.controls.certificateno.setValue(this.content.CERT_NO)
        this.jewellerymasterForm.controls.foreigncost.setValue(this.content.GRIDLE)
        this.jewellerymasterForm.controls.stdPurity.setValue(this.content.CULET)
        this.jewellerymasterForm.controls.printscheme.setValue(this.content.UDF1_DESC)
        this.jewellerymasterForm.controls.printscheme2.setValue(this.content.UDF2_DESC)
        this.jewellerymasterForm.controls.printscheme3.setValue(this.content.UDF3_DESC)
        this.jewellerymasterForm.controls.printscheme4.setValue(this.content.UDF4_DESC)
        this.jewellerymasterForm.controls.costdiff.setValue(this.content.COST_CENTER_DESC)
        this.jewellerymasterForm.controls.tagDetails.setValue(this.content.TAG_LINESWOENTER)
        this.jewellerymasterForm.controls.componentSummary.setValue(this.content.CHKCOMPONENTSUMMARY)
        this.jewellerymasterForm.controls.componentdetails.setValue(this.content.CHKCOMPONENTDETAIL)
       // this.jewellerymasterForm.controls.createon.setValue(this.content.OPENED_ON)
        this.jewellerymasterForm.controls.createby.setValue(this.content.OPENED_BY)
        this.jewellerymasterForm.controls.salestagDetails.setValue(this.content.TAG_LINES)
        this.jewellerymasterForm.controls.tagetxtDetails.setValue(this.content.COMMENTS)
        this.jewellerymasterForm.controls.collection.setValue(this.content.UDF1)
        this.jewellerymasterForm.controls.sub_collection.setValue(this.content.UDF2)
        this.jewellerymasterForm.controls.stone_type.setValue(this.content.UDF3)
        this.jewellerymasterForm.controls.setting.setValue(this.content.UDF4)
        this.jewellerymasterForm.controls.shape.setValue(this.content.UDF5)
        this.jewellerymasterForm.controls.inc_cat.setValue(this.content.UDF6)
        this.jewellerymasterForm.controls.order_ref.setValue(this.content.UDF7)
        this.jewellerymasterForm.controls.metalPcs.setValue(this.content.UDF8)
        this.jewellerymasterForm.controls.metalCarat.setValue(this.content.UDF9)
        this.jewellerymasterForm.controls.diamondsGrams.setValue(this.content.UDF10)
        this.jewellerymasterForm.controls.colorstoneGrams.setValue(this.content.UDF11)
        this.jewellerymasterForm.controls.pearlsGrams.setValue(this.content.UDF12)
        this.jewellerymasterForm.controls.otstonesGrams.setValue(this.content.UDF13)
        this.jewellerymasterForm.controls.platChargesFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PLAT_CHARGESFC))
        this.jewellerymasterForm.controls.platChargesLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.PLAT_CHARGESLC))
        this.jewellerymasterForm.controls.certChargesLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.CERT_CHARGESLC))
        this.jewellerymasterForm.controls.certChargesFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.CERT_CHARGESFC))
        this.jewellerymasterForm.controls.polishingFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.HANDLING_CHARGEFC))
        this.jewellerymasterForm.controls.polishingLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.HANDLING_CHARGELC))
        this.jewellerymasterForm.controls.othersFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.ORG_COSTFC))
        this.jewellerymasterForm.controls.othersLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.ORG_COSTLC))
        this.jewellerymasterForm.controls.totalLBFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.TOTALFC))
        this.jewellerymasterForm.controls.totalLBLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.TOTALCC))
        this.jewellerymasterForm.controls.settingFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.ADDITIONAL_RATEFC))
        this.jewellerymasterForm.controls.settingLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.ADDITIONAL_RATELC))
        this.jewellerymasterForm.controls.rhodiumFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.RRR_PUR_CARAT))
        this.jewellerymasterForm.controls.rhodiumLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.RRR_PUR_PERCENT))
        this.jewellerymasterForm.controls.makingFC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.RRR_SAL_PERCENT))
        this.jewellerymasterForm.controls.makingLC.setValue( this.commonService.transformDecimalVB(
          this.commonService.allbranchMaster?.BAMTDECIMALS,this.content.RRR_OTHER_PERCENT))
    
      }
    });


   
    // //  this.customerWiseStonePriceForm.controls.applyinPOS.setValue(this.content.PRINT_COUNT)
    //   this.customerWiseStonePriceForm.controls.applyinPOS.setValue(
    //     this.content.PRINT_COUNT === 1 ? true : false
    //   );
  }

  setPostData() {
    return {
      ITEM: this.commonService.nullToString(this.jewellerymasterForm.value.itemcode),
      STOCK_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.itemcode),
      STOCK_DESCRIPTION: this.commonService.nullToString(this.jewellerymasterForm.value.description),
      CURRENCY_CODE: "stri",
      CC_RATE: 0,
      COST_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.costcenterMetal),
      TYPE_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.type),
      CATEGORY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.category),
      SUBCATEGORY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.subcategory),
      BRAND_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.brand),
      COUNTRY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.country),
      SUPPLIER_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.itemcodedetail),
      SUPPLIER_REF: this.commonService.nullToString(this.jewellerymasterForm.value.costcenterMaking),
      DESIGN_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.design),
      SET_REF: this.commonService.nullToString(this.jewellerymasterForm.value.setref),
      PICTURE_NAME: "",
      PICTURE_NAME1: "",
      STOCK_FCCOST: 0,
      STOCK_LCCOST: 0,
      PRICE1PER: this.commonService.nullToString(this.jewellerymasterForm.value.price1),
      PRICE2PER: this.commonService.nullToString(this.jewellerymasterForm.value.price2),
      PRICE3PER: this.commonService.nullToString(this.jewellerymasterForm.value.price3),
      PRICE4PER: this.commonService.nullToString(this.jewellerymasterForm.value.price4),
      PRICE5PER: this.commonService.nullToString(this.jewellerymasterForm.value.price5),
      PRICE1FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price1FC),
      PRICE1LC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price1LC),
      PRICE2FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price2FC),
      PRICE2LC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price2LC),
      PRICE3FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price3FC),
      PRICE3LC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price3LC),
      PRICE4FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price4FC),
      PRICE4LC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price4LC),
      PRICE5FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price5FC),
      PRICE5LC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price5LC),
      CHARGE1FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price1per),
      CHARGE1LC: 0,
      CHARGE2FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price2per),
      CHARGE2LC: 0,
      CHARGE3FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price3per),
      CHARGE3LC: 0,
      CHARGE4FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price4per),
      CHARGE4LC: 0,
      CHARGE5FC: this.commonService.emptyToZero(this.jewellerymasterForm.value.price5per),
      CHARGE5LC: 0,
      SHORT_ID: "",
      COLOR: this.commonService.nullToString(this.jewellerymasterForm.value.color),
      CLARITY: this.commonService.nullToString(this.jewellerymasterForm.value.clarity),
      SIZE: this.commonService.nullToString(this.jewellerymasterForm.value.size),
      SIEVE: this.commonService.nullToString(this.jewellerymasterForm.value.vendorRef),
      SHAPE: this.commonService.nullToString(this.jewellerymasterForm.value.vendor),
      GRADE: this.commonService.nullToString(this.jewellerymasterForm.value.vendorname),
      FLUOR: this.commonService.nullToString(this.jewellerymasterForm.value.fluorescence),
      FINISH: this.commonService.nullToString(this.jewellerymasterForm.value.landercost),
      CERT_BY: this.commonService.nullToString(this.jewellerymasterForm.value.certificateby),
      CERT_NO: this.commonService.nullToString(this.jewellerymasterForm.value.certificateno),
      CERT_DATE: this.jewellerymasterForm.value.certdate,
      GRIDLE: this.commonService.nullToString(this.jewellerymasterForm.value.foreigncost),
      CULET: this.commonService.nullToString(this.jewellerymasterForm.value.stdPurity),
      TWIDTH: 0,
      CRHEIGHT: 0,
      PAVDEPTH: 0,
      OVERALL: "",
      MEASURE: "",
      CERT_PICTURE_NAME: "",
      TAG_LINES: this.commonService.nullToString(this.jewellerymasterForm.value.salestagDetails),
      COMMENTS: this.commonService.nullToString(this.jewellerymasterForm.value.tagetxtDetails),
      WATCH_TYPE: 0,
      PEARL_TYPE: 0,
      STRAP_TYPE: "",
      STRAP_COLOR: "",
      GW: 0,
      MODEL_NO: "",
      MODEL_YEAR: 0,
      OPENED_ON: this.jewellerymasterForm.value.createon,
      OPENED_BY: this.commonService.nullToString(this.jewellerymasterForm.value.createby),
      FIRST_TRN: this.commonService.nullToString(this.jewellerymasterForm.value.fristtransaction),
      LAST_TRN: this.commonService.nullToString(this.jewellerymasterForm.value.lasttransaction),
      MID: 0,
      PRINTED: true,
      PURVOCTYPE_NO: "",
      PURPARTY: "",
      PURDATE: "2023-11-27T07:30:26.960Z",
      PURAMOUNT: 0,
      PURBRLOC: "",
      SALVOCTYPE_NO: "",
      SALPARTY: this.commonService.nullToString(this.jewellerymasterForm.value.salesman),
      SALDATE: "2023-11-27T07:30:26.960Z",
      SALAMOUNT: 0,
      SALBRLOC: "",
      METAL_TOTALGROSSWT: 0,
      METAL_TOTALAMOUNT: 0,
      METAL_TOTALMAKING: 0,
      LOOSE_TOTALWT: 0,
      LOOSE_TOTALAMOUNT: 0,
      COLOR_TOTALWT: 0,
      COLOR_TOTALAMOUNT: 0,
      PEARL_TOTALWT: 0,
      PEARL_TOTALAMOUNT: 0,
      MANF_MID: 0,
      MANF_BR_VOCTYPE_NO: "",
      WATCH_REFNO: "",
      WATCH_MODELNAME: "",
      WATCH_MODELNO: "",
      WATCH_MATERIAL: "",
      WATCH_DIALCOLOR: "",
      WATCH_BAZEL: "",
      WATCH_MOVEMENT: "",
      WATCH_STATUS: "",
      WATCH_WEIGHT: "",
      UNIT: "",
      PCS_PERUNIT: this.commonService.emptyToZero(this.jewellerymasterForm.value.PCSunit),
      TAG_LINESWOENTER: this.commonService.nullToString(this.jewellerymasterForm.value.tagDetails),
      PICTURE_NAME_THUMBNAIL: "",
      GOLDSMITH: "",
      STONESETTER: "",
      STD_LCCOST: 0,
      TAG1: "",
      TAG2: "",
      TAG3: "",
      TAG4: "",
      TAG5: "",
      WEIGHT_PER_PCS: 0,
      DETAILDESCRIPTION: "",
      PROD_CUSTOMER_CODE: "",
      TDWT: 0,
      RD: 0,
      TB: 0,
      PR: 0,
      MQ: 0,
      SO: 0,
      OT: 0,
      RUBY: 0,
      EMERALD: 0,
      SAPHIRE: 0,
      WATCH_SERIALNO: "",
      CERT_PRINTED: true,
      NOQTYCHANGE: true,
      STYLE: this.commonService.nullToString(this.jewellerymasterForm.value.style),
      CUSTOMERSKU: "",
      INITIAL_BRPURVOCTYPE_NO: "string",
      STOCK_DESCRIPTION_OTHERS: this.commonService.nullToString(this.jewellerymasterForm.value.otherdesc),
      TIME_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.time),
      RANGE_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.range),
      COMMENTS_CODE: "",
      NOTES: "",
      ASK: "",
      SELL: "",
      CUT: "",
      POLISH: "",
      SYMMETRY: "",
      UDF1: this.commonService.nullToString(this.jewellerymasterForm.value.collection),
      UDF2: this.commonService.nullToString(this.jewellerymasterForm.value.sub_collection),
      UDF3: this.commonService.nullToString(this.jewellerymasterForm.value.stone_type),
      UDF4: this.commonService.nullToString(this.jewellerymasterForm.value.setting),
      UDF5: this.commonService.nullToString(this.jewellerymasterForm.value.shape),
      UDF6: this.commonService.nullToString(this.jewellerymasterForm.value.inc_cat),
      UDF7: this.commonService.nullToString(this.jewellerymasterForm.value.order_ref),
      UDF8: this.commonService.nullToString(this.jewellerymasterForm.value.metalPcs),
      UDF9: this.commonService.nullToString(this.jewellerymasterForm.value.metalCarat),
      UDF10: this.commonService.nullToString(this.jewellerymasterForm.value.diamondsGrams),
      UDF11: this.commonService.nullToString(this.jewellerymasterForm.value.colorstoneGrams),
      UDF12: this.commonService.nullToString(this.jewellerymasterForm.value.pearlsGrams),
      UDF13: this.commonService.nullToString(this.jewellerymasterForm.value.otstonesGrams),
      UDF14: this.jewellerymasterForm.value.userdefined_14 || "",
      UDF15: this.jewellerymasterForm.value.userdefined_15 || "",
      PROMOTIONALITEM: true,
      EXCLUDEGSTVAT: this.jewellerymasterForm.value.vatOnMargin === 'Y'? true: false,
      RRR_CARAT: 0,
      RRR_PERCENT: 0,
      NACRE: "",
      SURFACE: "",
      MATCHING: "",
      TREATMENT: "",
      CUTSTYLE_CROWN: "",
      CUTSTYLE_PAVILION: "",
      TRANSPARENCY: "",
      CONCLUSION: "",
      SPECIES: "",
      VARIETY: "",
      CERTIFICATETYPE: "",
      SOURCETYPE: "",
      CHARACTERISTIC: "",
      TONE_SATURATION: "",
      SHAPEAPPAREL: "",
      DIA_PCS: this.commonService.emptyToZero(this.jewellerymasterForm.value.diamondsPcs),
      DIA_CARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.diamondsCarat),
      DIA_VALUEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.diamondsFC),
      DIA_VALUECC: this.commonService.emptyToZero(this.jewellerymasterForm.value.diamondsLC),
      COLOR_PCS: this.commonService.emptyToZero(this.jewellerymasterForm.value.colorstonePcs),
      COLOR_CARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.colorstoneCarat),
      COLOR_VALUEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.colorstoneFC),
      COLOR_VALUECC: this.commonService.emptyToZero(this.jewellerymasterForm.value.colorstoneLC),
      PEARL_PCS: this.commonService.emptyToZero(this.jewellerymasterForm.value.pearlsPcs),
      PEARL_CARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.pearlsCarat),
      PEARL_VALUEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.pearlsFC),
      PEARL_VALUECC: this.commonService.emptyToZero(this.jewellerymasterForm.value.pearlsLC),
      OTSTONES_PCS: this.commonService.emptyToZero(this.jewellerymasterForm.value.otstonesPcs),
      OTSTONES_CARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.otstonesCarat),
      OTSTONES_VALUEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.otstonesFC),
      OTSTONES_VALUECC: this.commonService.emptyToZero(this.jewellerymasterForm.value.otstonesLC),
      METAL_GROSSWT: this.commonService.emptyToZero(this.jewellerymasterForm.value.metalGrams),
      METAL_VALUEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.metalFC),
      METAL_VALUECC: this.commonService.emptyToZero(this.jewellerymasterForm.value.metalLC),
      TOTPCS: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalPcs),
      TOTCARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalCarat),
      TOTGMS: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalGrams),
      TOTVFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalFC),
      TOTVLC: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalLC),
      TOTALFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalLBFC),
      TOTALCC: this.commonService.emptyToZero(this.jewellerymasterForm.value.totalLBLC),
      LAST_EDT_BY: this.commonService.nullToString(this.jewellerymasterForm.value.lasteditby),
      LAST_EDT_ON: this.jewellerymasterForm.value.lastediton,
      UNITCODE: "",
      UNITWT: 0,
      CHKUNIT: true,
      CHKCOMPONENTSUMMARY: this.commonService.nullToString(this.jewellerymasterForm.value.componentSummary),
      CHKCOMPONENTDETAIL: this.commonService.nullToString(this.jewellerymasterForm.value.componentdetails),
      CMBNATURE: "",
      CMBTYPE: "",
      RFID_TAG: "",
      SKUDESCRIPTION: "",
      ON_OFF: true,
      NOTFORSALES: 0,
      TRANSFERED_WEB: true,
      CALCULATE_COSTING: true,
      QUALITY_CODE: "",
      PARENTSTOCK_CODE: "",
      PARTNER_CODE: "",
      KPNUMBER: "",
      HSN_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.HSNcode),
      ITEM_ONHOLD: this.jewellerymasterForm.value.onHold === 'Y'? true: false,
      POS_CUST_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.POScus),
      CONSIGNMENT: true,
      POSGROSSWT: this.commonService.emptyToZero(this.jewellerymasterForm.value.grossWt),
      HANDLING_CHARGEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.polishingFC),
      HANDLING_CHARGELC: this.commonService.emptyToZero(this.jewellerymasterForm.value.polishingLC),
      ORG_COSTFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.othersFC),
      ORG_COSTLC: this.commonService.emptyToZero(this.jewellerymasterForm.value.othersLC),
      VATONMARGIN: true,
      SALESPERSON_CODE: "",
      ORDSALESPERSON_CODE: "",
      BATCH_STOCK: true,
      BATCH_PREFIX: "",
      SIEVE_SET: "",
      MODEL_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.modelcode),
      NOOF_PLAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.noofplat),
      PLAT_CHARGESFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.platChargesFC),
      PLAT_CHARGESLC: this.commonService.emptyToZero(this.jewellerymasterForm.value.platChargesLC),
      CERT_CHARGESLC: this.commonService.emptyToZero(this.jewellerymasterForm.value.certChargesLC),
      CERT_CHARGESFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.certChargesFC),
      UNFIX_DIAMOND_ITEM: true,
      ALLOW_WITHOUT_RATE: true,
      RRR_STOCK_REF: "",
      MARKETCOSTFC: this.commonService.nullToString(this.jewellerymasterForm.value.marketcost),
      MARKETCOSTLC: 0,
      RRR_PRICE_UPDATED: true,
      RRR_PRICE_UPDDATE: "2023-11-27T07:30:26.960Z",
      SALESCODE: 0,
      RRR_PUR_CARAT: this.commonService.emptyToZero(this.jewellerymasterForm.value.rhodiumFC),
      RRR_PUR_PERCENT: this.commonService.emptyToZero(this.jewellerymasterForm.value.rhodiumLC),
      RRR_SAL_PERCENT: this.commonService.emptyToZero(this.jewellerymasterForm.value.makingFC),
      RRR_OTHER_PERCENT: this.commonService.emptyToZero(this.jewellerymasterForm.value.makingLC),
      SET_PICTURE_NAME: "",
      PACKET_ITEM: true,
      PACKET_WT: 0,
      SALES_TAGLINES: "",
      ALLOW_ZEROPCS: true,
      NOOF_CERT: this.commonService.emptyToZero(this.jewellerymasterForm.value.noofcert),
      ADDITIONAL_RATEFC: this.commonService.emptyToZero(this.jewellerymasterForm.value.settingFC),
      ADDITIONAL_RATELC: this.commonService.emptyToZero(this.jewellerymasterForm.value.settingLC),
      WBOXWOUTBOX: 0,
      ALLOW_NEGATIVE: true,
      EXCLUDE_TRANSFER_WT: this.jewellerymasterForm.value.excludeTax === 'Y'? true: false,
      WT_VAR_PER: 0,
      HALLMARKING: "",
      WOO_CATEGORY_ID: 0,
      DESIGN_DESC: "",
      COST_CENTER_DESC: this.commonService.nullToString(this.jewellerymasterForm.value.costdiff),
      SUPPLIER_DESC: "",
      ORDSALESPERSON_DESC: "",
      COUNTRY_DESC: "",
      TYPE_DESC: "",
      CATEGORY_DESC: "",
      SUBCATEGORY_DESC: "",
      BRAND_DESC: "",
      COLOR_DESC: "",
      FLUORESCENCE_DESC: "",
      CLARITY_DESC: "",
      RANGE_DESC: "",
      STYLE_DESC: "",
      HSN_DESC: "",
      TIME_DESC: "",
      SIZE_DESC: "",
      SIEVE_SET_DESC: "",
      SIEVE_DESC: "",
      SHAPE_DESC: "",
      FINISH_DESC: "",
      GRADE_DESC: "",
      CUT_DESC: "",
      POLISH_DESC: "",
      SYMMETRY_DESC: "",
      UNITCODE_DESC: "",
      CERT_BY_DESC: "",
      STRAP_TYPE_DESC: "",
      WATCH_MATERIAL_DESC: "",
      STRAP_COLOR_DESC: "",
      WATCH_DIALCOLOR_DESC: "",
      WATCH_BAZEL_DESC: "",
      WATCH_MOVEMENT_DESC: "",
      UDF1_DESC: this.commonService.nullToString(this.jewellerymasterForm.value.printscheme),
      UDF2_DESC: this.commonService.nullToString(this.jewellerymasterForm.value.printscheme2),
      UDF3_DESC: this.commonService.nullToString(this.jewellerymasterForm.value.printscheme3),
      UDF4_DESC: this.commonService.nullToString(this.jewellerymasterForm.value.printscheme4),
      UDF5_DESC: "",
      UDF6_DESC: "",
      UDF7_DESC: "",
      UDF8_DESC: "",
      UDF9_DESC: "",
      UDF10_DESC: "",
      UDF11_DESC: "",
      UDF12_DESC: "",
      UDF13_DESC: "",
      UDF14_DESC: "",
      UDF15_DESC: "",
      INITIAL_PURVOCTYPE_NO: "",
      YIELD: 0,
      MINE_REF: "",
      MAIN_STOCK_CODE: "",
      METALKARAT: this.commonService.nullToString(this.jewellerymasterForm.value.karat),
      UNQ_DESIGN_ID: "",
      CHARGE6FC: 0,
      CHARGE6LC: 0,
      CHARGE7FC: 0,
      CHARGE7LC: 0,
      CHARGE8FC: 0,
      CHARGE8LC: 0,
      CHARGE9FC: 0,
      CHARGE9LC: 0,
      CHARGE10FC: 0,
      CHARGE10LC: 0,
      MANUFACTURE_ITEM: true,
      diamondStockDetails: this.StoneDetailsComponentData
    };
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.jewellerymasterForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "DiamondStockMaster/InsertDiamondStockMaster";
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {

          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || "Success",
              text: "",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            }).then((result: any) => {
              if (result.value) {
                this.jewellerymasterForm.reset();
                this.tableData = [];
                this.close("reloadMainGrid");
              }
            });
          }
          else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  update() {
    if (this.jewellerymasterForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "DiamondStockMaster/UpdateDiamondStockMaster/" + this.content.STOCK_CODE;
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
       
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.jewellerymasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
         
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  deleteRecord() {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        let API =
          "DiamondStockMaster/DeleteDiamondStockMaster/" + this.content.STOCK_CODE;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.jewellerymasterForm.reset();
                      this.tableData = [];
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.jewellerymasterForm.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }


  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
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
          this.jewellerymasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
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
    switch (formControlName) {
      case 'itemcodedetail':
        this.itemcodedetailcodeSearch.showOverlayPanel(event);
        break;
      case 'design':
        this.designcodeSearch.showOverlayPanel(event);
        break;
      case 'modelcode':
        this.modelcodeSearch.showOverlayPanel(event);
        break;
      case 'costcenterMetal':
        this.costcenterMetalcodeSearch.showOverlayPanel(event);
        break;
      case 'costcenterMaking':
        this.costcenterMakingcodeSearch.showOverlayPanel(event);
        break;
      case 'vendor':
        this.vendorcodeSearch.showOverlayPanel(event);
        break;
      case 'type':
        this.typecodeSearch.showOverlayPanel(event);
        break;
      case 'country':
        this.countrycodeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.categorycodeSearch.showOverlayPanel(event);
        break;
      case 'subcategory':
        this.subcategorycodeSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.brandcodeSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.colorcodeSearch.showOverlayPanel(event);
        break;
      case 'fluorescence':
        this.fluorescencecodeSearch.showOverlayPanel(event);
        break;
      case 'clarity':
        this.claritycodeSearch.showOverlayPanel(event);
        break;
      case 'range':
        this.rangecodeSearch.showOverlayPanel(event);
        break;
      case 'style':
        this.stylecodeSearch.showOverlayPanel(event);
        break;
      case 'HSNcode':
        this.HSNcodecodeSearch.showOverlayPanel(event);
        break;
      case 'time':
        this.timecodeSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.karatcodeSearch.showOverlayPanel(event);
        break;
      case 'price1':
        this.price1codeSearch.showOverlayPanel(event);
        break;
      case 'price2':
        this.price2codeSearch.showOverlayPanel(event);
        break;
      case 'price3':
        this.price3codeSearch.showOverlayPanel(event);
        break;
      case 'price4':
        this.price4codeSearch.showOverlayPanel(event);
        break;
      case 'price5':
        this.price5codeSearch.showOverlayPanel(event);
        break;
      case 'collection':
        this.collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'sub_collection':
        this.sub_collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'stone_type':
        this.stone_typecodeSearch.showOverlayPanel(event);
        break;
      case 'setting':
        this.settingcodeSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.shapecodeSearch.showOverlayPanel(event);
        break;
      case 'inc_catc':
        this.inc_catcodeSearch.showOverlayPanel(event);
        break;
        break;
        case 'order_ref':
          this.order_refcodeSearch.showOverlayPanel(event);
          break;


      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'itemcodedetail':
        this.itemcodedetailcodeSearch.showOverlayPanel(event);
        break;
      case 'design':
        this.designcodeSearch.showOverlayPanel(event);
        break;
      case 'modelcode':
        this.modelcodeSearch.showOverlayPanel(event);
        break;
      case 'costcenterMetal':
        this.costcenterMetalcodeSearch.showOverlayPanel(event);
        break;
      case 'costcenterMaking':
        this.costcenterMakingcodeSearch.showOverlayPanel(event);
        break;
      case 'vendor':
        this.vendorcodeSearch.showOverlayPanel(event);
        break;
      case 'type':
        this.typecodeSearch.showOverlayPanel(event);
        break;
      case 'country':
        this.countrycodeSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.categorycodeSearch.showOverlayPanel(event);
        break;
      case 'subcategory':
        this.subcategorycodeSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.brandcodeSearch.showOverlayPanel(event);
        break;
      case 'color':
        this.colorcodeSearch.showOverlayPanel(event);
        break;
      case 'fluorescence':
        this.fluorescencecodeSearch.showOverlayPanel(event);
        break;
      case 'clarity':
        this.claritycodeSearch.showOverlayPanel(event);
        break;
      case 'range':
        this.rangecodeSearch.showOverlayPanel(event);
        break;
      case 'style':
        this.stylecodeSearch.showOverlayPanel(event);
        break;
      case 'HSNcode':
        this.HSNcodecodeSearch.showOverlayPanel(event);
        break;
      case 'time':
        this.timecodeSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.karatcodeSearch.showOverlayPanel(event);
        break;
      case 'price1':
        this.price1codeSearch.showOverlayPanel(event);
        break;
      case 'price2':
        this.price2codeSearch.showOverlayPanel(event);
        break;
      case 'price3':
        this.price3codeSearch.showOverlayPanel(event);
        break;
      case 'price4':
        this.price4codeSearch.showOverlayPanel(event);
        break;
      case 'price5':
        this.price5codeSearch.showOverlayPanel(event);
        break;
      case 'collection':
        this.collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'sub_collection':
        this.sub_collectioncodeSearch.showOverlayPanel(event);
        break;
      case 'stone_type':
        this.stone_typecodeSearch.showOverlayPanel(event);
        break;
      case 'setting':
        this.settingcodeSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.shapecodeSearch.showOverlayPanel(event);
        break;
      case 'inc_catc':
        this.inc_catcodeSearch.showOverlayPanel(event);
        break;
        case 'order_ref':
          this.order_refcodeSearch.showOverlayPanel(event);
          break;
        

      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

}
