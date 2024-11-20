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

@Component({
  selector: "app-jewellery-master",
  templateUrl: "./jewellery-master.component.html",
  styleUrls: ["./jewellery-master.component.scss"],
})
export class JewelleryMasterComponent implements OnInit {
  @ViewChild('tab3Checkbox') tab3Checkbox!: MatCheckbox;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  selectedTabIndex: number = 0; 

  onCheckboxChange(tabIndex: number) {
    if (tabIndex === 2 && this.tab3Checkbox.checked) {
      this.selectedTabIndex = tabIndex;
    }else{
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
    "Div",
    "Stock Code",
    "Shape",
    "Color",
    "Clarity",
    "Sieve",
    "Size",
    "Pcs",
    "Carat",
    "Currency",
    "Pc Code",
    "Lab Rate",
    "Lab Amt",
    "LbCode",
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
  subscriptions: any;
  @Input() content!: any;
  tableData: any[] = [];
  checkBoxesMode: string;
  allMode: string;

  itemcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Item Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  EnterMetalDetailsComponentData: any;
  StoneDetailsComponentData: any;

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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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

  ngOnInit(): void {}
  jewellerymasterForm: FormGroup = this.formBuilder.group({
    itemcode: ["",[Validators.required]],
    itemcodedetail: [""],
    vatOnMargin: [""],
    design: [""],
    excludeTax: [""],
    modelcode: [""],
    onHold: [""],
    description: [""],
    otherdesc: [""],
    costcenterMetal: [""],
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
    printscheme: [""],
    printscheme2: [""],
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
    marketcost: [""],
    POScus: [""],
    certdate: [new Date(),""],
    certificateno: [""],
    componentSummary: [""],
    certificateby: [""],
    componentdetails: [""],
    noofcert: [""],
    stdPurity: [""],
    costdiff: [""],
    tagDetails: [""],
    createby: [""],
    lasteditby: [""],
    fristtransaction: [""],
    salesman: [""],
    createon: [""],
    lastediton: [new Date(),""],
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
  });
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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
    const modalRef: NgbModalRef = this.modalService.open(
      StoneDetailsComponent,
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
        this.StoneDetailsComponentData.push(postData);
      }
    });
  }

  deleteTableDataStoneDetails() {
    this.tableData.pop();
  }


  setPostData(){
    return {
      ITEM: this.commonService.nullToString(this.jewellerymasterForm.value.itemcode),
      STOCK_CODE: "md3",
      STOCK_DESCRIPTION: this.commonService.nullToString(this.jewellerymasterForm.value.description),
      CURRENCY_CODE: "stri",
      CC_RATE: 0,
      COST_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.costcenterMetal),
      TYPE_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.type),
      CATEGORY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.category),
      SUBCATEGORY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.subcategory),
      BRAND_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.brand),
      COUNTRY_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.country),
      SUPPLIER_CODE: "",
      SUPPLIER_REF: "",
      DESIGN_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.design),
      SET_REF: this.commonService.nullToString(this.jewellerymasterForm.value.setref),
      PICTURE_NAME: "",
      PICTURE_NAME1: "",
      STOCK_FCCOST: 0,
      STOCK_LCCOST: 0,
      PRICE1PER:  this.commonService.nullToString(this.jewellerymasterForm.value.price1),
      PRICE2PER:  this.commonService.nullToString(this.jewellerymasterForm.value.price2),
      PRICE3PER:  this.commonService.nullToString(this.jewellerymasterForm.value.price3),
      PRICE4PER:  this.commonService.nullToString(this.jewellerymasterForm.value.price4),
      PRICE5PER:  this.commonService.nullToString(this.jewellerymasterForm.value.price5),
      PRICE1FC:  this.commonService.nullToString(this.jewellerymasterForm.value.price1FC),
      PRICE1LC:  this.commonService.nullToString(this.jewellerymasterForm.value.price1LC),
      PRICE2FC:  this.commonService.nullToString(this.jewellerymasterForm.value.price2FC),
      PRICE2LC:  this.commonService.nullToString(this.jewellerymasterForm.value.price2LC),
      PRICE3FC:  this.commonService.nullToString(this.jewellerymasterForm.value.price3FC),
      PRICE3LC:  this.commonService.nullToString(this.jewellerymasterForm.value.price3LC),
      PRICE4FC:  this.commonService.nullToString(this.jewellerymasterForm.value.price4FC),
      PRICE4LC:  this.commonService.nullToString(this.jewellerymasterForm.value.price4LC),
      PRICE5FC:  this.commonService.nullToString(this.jewellerymasterForm.value.price5FC),
      PRICE5LC:  this.commonService.nullToString(this.jewellerymasterForm.value.price5LC),
      CHARGE1FC: 0,
      CHARGE1LC: 0,
      CHARGE2FC: 0,
      CHARGE2LC: 0,
      CHARGE3FC: 0,
      CHARGE3LC: 0,
      CHARGE4FC: 0,
      CHARGE4LC: 0,
      CHARGE5FC: 0,
      CHARGE5LC: 0,
      SHORT_ID: "",
      COLOR: this.commonService.nullToString(this.jewellerymasterForm.value.color),
      CLARITY: this.commonService.nullToString(this.jewellerymasterForm.value.clarity),
      SIZE: this.commonService.nullToString(this.jewellerymasterForm.value.size ),
      SIEVE: "",
      SHAPE: "",
      GRADE: "",
      FLUOR: this.commonService.nullToString(this.jewellerymasterForm.value.fluorescence),
      FINISH: "",
      CERT_BY: this.commonService.nullToString(this.jewellerymasterForm.value.certificateby),
      CERT_NO: "",
      CERT_DATE: this.jewellerymasterForm.value.certdate,
      GRIDLE: "",
      CULET: "",
      TWIDTH: 0,
      CRHEIGHT: 0,
      PAVDEPTH: 0,
      OVERALL:  "",
      MEASURE: "",
      CERT_PICTURE_NAME: "",
      TAG_LINES: "",
      COMMENTS: "",
      WATCH_TYPE: 0,
      PEARL_TYPE: 0,
      STRAP_TYPE: "",
      STRAP_COLOR: "",
      GW: 0,
      MODEL_NO:  "",
      MODEL_YEAR: 0,
      OPENED_ON: "2023-11-27T07:30:26.960Z",
      OPENED_BY: "",
      FIRST_TRN:  this.commonService.nullToString(this.jewellerymasterForm.value.fristtransaction),
      LAST_TRN:  this.commonService.nullToString(this.jewellerymasterForm.value.lasttransaction),
      MID: 0,
      PRINTED: true,
      PURVOCTYPE_NO: "",
      PURPARTY: "",
      PURDATE: "2023-11-27T07:30:26.960Z",
      PURAMOUNT: 0,
      PURBRLOC: "",
      SALVOCTYPE_NO: "",
      SALPARTY:  this.commonService.nullToString(this.jewellerymasterForm.value.salesman),
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
      PCS_PERUNIT: this.commonService.nullToString(this.jewellerymasterForm.value.PCSunit),
      TAG_LINESWOENTER: "",
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
      UDF1: this.jewellerymasterForm.value.userdefined_1 || "",
      UDF2: this.jewellerymasterForm.value.userdefined_2 || "",
      UDF3: this.jewellerymasterForm.value.userdefined_3 || "",
      UDF4: this.jewellerymasterForm.value.userdefined_4 || "",
      UDF5: this.jewellerymasterForm.value.userdefined_5 || "",
      UDF6: this.jewellerymasterForm.value.userdefined_6 || "",
      UDF7: this.jewellerymasterForm.value.userdefined_7 || "",
      UDF8: this.jewellerymasterForm.value.userdefined_8 || "",
      UDF9: this.jewellerymasterForm.value.userdefined_9 || "",
      UDF10: this.jewellerymasterForm.value.userdefined_10 || "",
      UDF11: this.jewellerymasterForm.value.userdefined_11 || "",
      UDF12: this.jewellerymasterForm.value.userdefined_12 || "",
      UDF13: this.jewellerymasterForm.value.userdefined_13 || "",
      UDF14: this.jewellerymasterForm.value.userdefined_14 || "",
      UDF15: this.jewellerymasterForm.value.userdefined_15 || "",
      PROMOTIONALITEM: true,
      EXCLUDEGSTVAT: this.jewellerymasterForm.value.vatOnMargin,
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
      DIA_PCS:  this.commonService.nullToString(this.jewellerymasterForm.value.diamondsPcs),
      DIA_CARAT:  this.commonService.nullToString(this.jewellerymasterForm.value.diamondsCarat),
      DIA_VALUEFC:  this.commonService.nullToString(this.jewellerymasterForm.value.diamondsFC),
      DIA_VALUECC:  this.commonService.nullToString(this.jewellerymasterForm.value.diamondsLC ),
      COLOR_PCS: this.commonService.nullToString(this.jewellerymasterForm.value.colorstonePcs ),
      COLOR_CARAT: this.commonService.nullToString(this.jewellerymasterForm.value.colorstoneCarat),
      COLOR_VALUEFC: this.commonService.nullToString(this.jewellerymasterForm.value.colorstoneFC),
      COLOR_VALUECC: this.commonService.nullToString(this.jewellerymasterForm.value.colorstoneLC),
      PEARL_PCS: this.commonService.nullToString(this.jewellerymasterForm.value.pearlsPcs),
      PEARL_CARAT: this.commonService.nullToString(this.jewellerymasterForm.value.pearlsCarat),
      PEARL_VALUEFC: this.commonService.nullToString(this.jewellerymasterForm.value.pearlsFC),
      PEARL_VALUECC: this.commonService.nullToString(this.jewellerymasterForm.value.pearlsLC),
      OTSTONES_PCS: this.commonService.nullToString(this.jewellerymasterForm.value.otstonesPcs),
      OTSTONES_CARAT: this.commonService.nullToString(this.jewellerymasterForm.value.otstonesCarat),
      OTSTONES_VALUEFC: this.commonService.nullToString(this.jewellerymasterForm.value.otstonesFC),
      OTSTONES_VALUECC: this.commonService.nullToString(this.jewellerymasterForm.value.otstonesLC),
      METAL_GROSSWT: this.commonService.nullToString(this.jewellerymasterForm.value.metalGrams),
      METAL_VALUEFC: this.commonService.nullToString(this.jewellerymasterForm.value.metalFC),
      METAL_VALUECC: this.commonService.nullToString(this.jewellerymasterForm.value.metalLC),
      TOTPCS: this.commonService.nullToString(this.jewellerymasterForm.value.totalPcs),
      TOTCARAT: this.commonService.nullToString(this.jewellerymasterForm.value.totalCarat),
      TOTGMS: this.commonService.nullToString(this.jewellerymasterForm.value.totalGrams),
      TOTVFC: this.commonService.nullToString(this.jewellerymasterForm.value.totalFC),
      TOTVLC: this.commonService.nullToString(this.jewellerymasterForm.value.totalLC),
      TOTALFC: 0,
      TOTALCC: 0,
      LAST_EDT_BY: this.commonService.nullToString(this.jewellerymasterForm.value.lasteditby),
      LAST_EDT_ON: this.jewellerymasterForm.value.lastediton,
      UNITCODE: "",
      UNITWT: 0,
      CHKUNIT: true,
      CHKCOMPONENTSUMMARY: "",
      CHKCOMPONENTDETAIL: "",
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
      ITEM_ONHOLD: this.jewellerymasterForm.value.onHold,
      POS_CUST_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.POScus),
      CONSIGNMENT: true,
      POSGROSSWT: this.commonService.nullToString(this.jewellerymasterForm.value.grossWt),
      HANDLING_CHARGEFC: 0,
      HANDLING_CHARGELC: 0,
      ORG_COSTFC: 0,
      ORG_COSTLC: 0,
      VATONMARGIN: true,
      SALESPERSON_CODE: "",
      ORDSALESPERSON_CODE: "",
      BATCH_STOCK: true,
      BATCH_PREFIX: "",
      SIEVE_SET: "",
      MODEL_CODE: this.commonService.nullToString(this.jewellerymasterForm.value.modelcode),
      NOOF_PLAT:  this.commonService.nullToString(this.jewellerymasterForm.value.noofplat),
      PLAT_CHARGESFC: 0,
      PLAT_CHARGESLC: 0,
      CERT_CHARGESLC: 0,
      CERT_CHARGESFC: 0,
      UNFIX_DIAMOND_ITEM: true,
      ALLOW_WITHOUT_RATE: true,
      RRR_STOCK_REF: "",
      MARKETCOSTFC: this.commonService.nullToString(this.jewellerymasterForm.value.marketcost),
      MARKETCOSTLC: 0,
      RRR_PRICE_UPDATED: true,
      RRR_PRICE_UPDDATE: "2023-11-27T07:30:26.960Z",
      SALESCODE: 0,
      RRR_PUR_CARAT: 0,
      RRR_PUR_PERCENT: 0,
      RRR_SAL_PERCENT: 0,
      RRR_OTHER_PERCENT: 0,
      SET_PICTURE_NAME: "",
      PACKET_ITEM: true,
      PACKET_WT: 0,
      SALES_TAGLINES: "",
      ALLOW_ZEROPCS: true,
      NOOF_CERT: this.commonService.nullToString(this.jewellerymasterForm.value.noofcert ),
      ADDITIONAL_RATEFC: 0,
      ADDITIONAL_RATELC: 0,
      WBOXWOUTBOX: 0,
      ALLOW_NEGATIVE: true,
      EXCLUDE_TRANSFER_WT: this.jewellerymasterForm.value.excludeTax,
      WT_VAR_PER: 0,
      HALLMARKING: "",
      WOO_CATEGORY_ID: 0,
      DESIGN_DESC: "",
      COST_CENTER_DESC: "",
      SUPPLIER_DESC: "",
      ORDSALESPERSON_DESC: "",
      COUNTRY_DESC: "",
      TYPE_DESC:  "",
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
      UDF1_DESC: "",
      UDF2_DESC: "",
      UDF3_DESC: "",
      UDF4_DESC: "",
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
      METALKARAT:this.commonService.nullToString(this.jewellerymasterForm.value.karat),
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
      diamondStockDetails: [
        {
          UNIQUEID: 0,
          SRNO: 0,
          METALSTONE: "",
          DIVCODE: "",
          KARAT: "",
          CARAT: 0,
          GROSS_WT: 0,
          PCS: 0,
          RATE_TYPE: "",
          CURRENCY_CODE: "",
          RATE: 0,
          AMOUNTFC: 0,
          AMOUNTLC: 0,
          MAKINGRATE: 0,
          MAKINGAMOUNT: 0,
          COLOR: "",
          CLARITY: "",
          SIEVE: "",
          SHAPE: "",
          TMPDETSTOCK_CODE: "",
          DSIZE: "",
          LABCHGCODE: "",
          PRICECODE: "",
          DESIGN_CODE: "",
          DETLINEREMARKS: "",
          MFTSTOCK_CODE: "",
          STOCK_CODE: "",
          METALRATE: 0,
          LABOURCODE: "",
          STONE_TYPE: "",
          STONE_WT: 0,
          NET_WT: 0,
          LOT_REFERENCE: "",
          INCLUDEMETALVALUE: true,
          FINALVALUE: 0,
          PERCENTAGE: 0,
          HANDLING_CHARGEFC: 0,
          HANDLING_CHARGELC: 0,
          PROCESS_TYPE: "",
          SELLING_RATE: 0,
          LAB_RATE: 0,
          LAB_AMTFC: 0,
          LAB_AMTLC: 0,
          SIEVE_SET: "",
          PURITY: 0,
          PUREWT: 0,
          RRR_STOCK_REF: "",
          FINALVALUELC: 0,
          LABCHGCODE1: "",
          LABCHGCODE2: "",
          LABRATE1: 0,
          LABRATE2: 0,
          CERT_REF: "",
          FROMEXISTINGSTOCK: 0,
          INSERTEDSTOCKCODE: "",
          INSERTEDSTOCKCOST: 0,
          POLISHED: "",
          RAPPRICE: 0,
          PIQUE: "",
          GRAINING: "",
          FLUORESCENCE: "",
          WEIGHT: 0,
        },
      ],
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
          if (result.response) {
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
          } else {
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
          if (result.response) {
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
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }
  deleteRecord() {
    if (!this.content.MID) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
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
          "DiamondStockMaster/DeleteDiamondStockMaster/" +
          this.content.STOCK_CODE;
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
}
