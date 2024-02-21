import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DesignSequenceComponent } from './design-sequence/design-sequence.component';
import { LabourChargesDetailsComponent } from './labour-charges-details/labour-charges-details.component';
import { DesignTransactionComponent } from './design-transaction/design-transaction.component';


@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {
  @Input() content!: any; 
  favoriteSeason: string = "";
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;

  tableData: any[] = [];
  tableDatas: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  currentFilter: any; 

  selectedTabIndex = 0;

  columnhead:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader1:any[] = ['Srno','Division','Stone Type', 'Stock Code','Karat','Shape','Color','Ext.Color','Clarity','Ext.Clarity','Sieve Std.','Description','Sieve From'];
  columnheader2:any[] = ['Comp. Code','Sr no','Division','Stone Type', 'Stock Code','Karat','Int. Color','Ext. Color','Shape','Int. Clarity','Ext. Clarity'];
  columnheader3:any[] = ['',];
  columnheader4:any[] = ['SINO','Size Code','Description','Default'];
  column1:any[] = ['SINO','Model No','Description'];
  column2:any[] = ['SINO','Country Code','Description'];
  column3:any[] = ['SINO','Dye Code','Description'];
  column4:any[] = ['SINO','Wax Model Code','Description'];
  column5:any[] = ['Sr.No','Accode','Description','Vend Design','Del.Days','Credit Days','Mode Of Payment'];
  column6:any[] = ['SINO','Color Code','Description'];
  column7:any[] = ['SINO','Comp Code','Description'];
  column8:any[] = ['SINO','Width Code','Description'];
  column9:any[] = ['SINO','Length Code','Description','Default'];
  column10:any[] = ['SINO','Height Code','Description'];
  column11:any[] = ['SINO','Karat Code','Description','Default'];
  column12:any[] = ['SINO','Color Range','Description','Default'];
  column13:any[] = ['SINO','Billing Code','Description'];
  column14:any[] = ['SINO','Finishing Code','Description','Default'];
  column15:any[] = ['Size','Pcs'];
  columnhead1:any[] = ['Srno','Comp.Code','Description','Pcs', 'Size Set Code','Size Code','Type','Category','Shape','Height','Width','Length','Radius'];
  columnhead2:any[] = ['DESIGN_C','PART_CODE','PART_DESCRIPTION','METAL_WT', 'LS_PCS','LS_WT','CS_PCS','CS_WT','PL_PCS','PL_WT','OTH_PCS','OTH_WT','TOTAL_PCS'];

  seasons: string[] = ['Customer Exclusive', 'Keep on Hold', 'Add Steel'];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
  ) { }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ngOnInit(): void {
    this.setAllInitialValues()
  }
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `DesignMaster/InsertDesignMaster/${this.content.DESIGN_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data)
          this.designmasterForm.controls.code.setValue(this.content.DESIGN_CODE)
          this.designmasterForm.controls.designdesc.setValue(this.content.DESIGN_DESCRIPTION)
          this.designmasterForm.controls.costcenter.setValue(this.content.COST_CODE)
          this.designmasterForm.controls.subcategory.setValue(this.content.SUBCATEGORY_CODE)
          this.designmasterForm.controls.brand.setValue(this.content.BRAND_CODE)
          this.designmasterForm.controls.style.setValue(this.content.STYLE)
          this.designmasterForm.controls.range.setValue(this.content.RANGE_CODE)
          this.designmasterForm.controls.description.setValue(this.content.DESCRIPTION)
          this.designmasterForm.controls.metal.setValue(this.content.JOB_DESCRIPTION)
          this.designmasterForm.controls.color.setValue(this.content.COLOR)
          this.designmasterForm.controls.karat.setValue(this.content.Details.GROSS_WT)
          this.designmasterForm.controls.purity.setValue(this.content.detail.PUREWT)
          this.designmasterForm.controls.alloy.setValue(this.content.detail.PCS)
          this.designmasterForm.controls.stockCode.setValue(this.content.detail.STOCK_CODE)
          this.designmasterForm.controls.stockCodeDes.setValue(this.content.detail.PURITY)

        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }
  designmasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: ['',[Validators.required]],
    designdesc: ['',[Validators.required]],
    costcenter: ['',[Validators.required]],
    category: [''],
    subcategory: [''],
    type: [''],
    brand: [''],
    style: [''],
    range: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: ['',[Validators.required]],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
    country : [''],
    size : [''],
    sizeset : [''],
    sieve : [''],
    currency:['',[Validators.required]],
    clarity:[''],
    vendor  : [''],
    metalcolor  : [''],
    pairref  : [''],
    setref : [''],
    surface : [''],
    sizefrom : [''],
    sizeto : [''],
    price1 : [''],
    price2 : [''],
    price3 : [''],
    price4 : [''],
    price5 : [''],
    metalwt: [''],
    prefix: ['',[Validators.required]],
    height : [''],
    length : [''],
    width : [''],
    radius : [''],
    orderRef : [''],
    incCat : [''],
    shape : [''],
    setting : [''],
    stoneType : [''],
    subCollection : [''],
    collection : [''],
    parentDesign : [''],
  });

  openaddDesignSequence() {
    const modalRef: NgbModalRef = this.modalService.open(DesignSequenceComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openaddLabourChargesDetails() {
    const modalRef: NgbModalRef = this.modalService.open(LabourChargesDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openaddDesignTransaction() {
    const modalRef: NgbModalRef = this.modalService.open(DesignTransactionComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  adddata() {
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "Srno": srno,
      "Division": "string",
      "StoneType": "string",
      "StockCode": "string",
      "Karat": "string",
      "Shape": "string",
      "Color": "string",
      "ExtColor": "string",
      "Clarity": 0,
      "ExtClarity": 0,
      "SieveStd": 0,
      "Description": 'string',
      "SieveFrom": 0,

    };
  
    this.tableData.push(data);
   
}

divisiontemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Division = data.target.value;
}

stoneTypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StoneType = data.target.value;
}

stockCodetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].StockCode = data.target.value;
}

karattemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Karat = data.target.value;
}

shapetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Shape = data.target.value;
}

colortemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Color = data.target.value;
}

extColortemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].ExtColor = data.target.value;
}

claritytemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Clarity = data.target.value;
}

extClaritytemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].ExtClarity = data.target.value;
}

sieveStdtemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].SieveStd = data.target.value;
}

descriptiontemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Description = data.target.value;
}

sieveFromtemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].SieveFrom = data.target.value;
}

adddatas(){
  let length = this.tableDatas.length;
  let srno = length + 1;
  let datas =  {
    "Srno": srno,
    "Division": "string",
    "StoneType": "string",
    "StockCode": "string",
    "Karat": "string",
    "Shape": "string",
    "Color": "string",
    "ExtColor": "string",
    "Clarity": 0,
    "ExtClarity": 0,
    "SieveStd": 0,
    "Description": 'string',
    "SieveFrom": 0,
}
this.tableDatas.push(datas);
}

compCodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].CompCode = data.target.value;
}

Descriptiontemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Description = data.target.value;
}

Pcstemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Pcs = data.target.value;
}

sizeSetCodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeSetCode = data.target.value;
}

sizeCodetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].SizeCode = data.target.value;
}

typetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Type = data.target.value;
}

categorytemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Category = data.target.value;
}

Shapetemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Shape = data.target.value;
}

heighttemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Height = data.target.value;
}

widthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Width = data.target.value;
}

lengthtemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Length = data.target.value;
}

radiustemp(data:any,value: any){
  this.tableDatas[value.data.SRNO - 1].Radius = data.target.value;
}


removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}

  costCenterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Center',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.costcenter.setValue(e.COST_CODE);
  }

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
  karatCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.karat.setValue(e.KARAT_CODE);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.type.setValue(e.CODE);
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.category.setValue(e.CODE);
  }

  subcategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Subcategory Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SUB CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subcategoryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.subcategory.setValue(e.CODE);
  }

  BrandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Brand Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'BRAND MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  brandCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.brand.setValue(e.CODE);
  }

  StyleCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Style Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  StyleCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.style.setValue(e.CODE);
  }

  RangeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  RangeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'size Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.size.setValue(e.CODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.country.setValue(e.CODE);
  }

  sizesetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 90,
    SEARCH_FIELD: 'COMPSET_CODE',
    SEARCH_HEADING: 'Size set code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSET_CODE<>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizesetCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.sizeset.setValue(e.COMPSET_CODE);
  }

  collectionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  collectionCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  subCollectionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subCollectionCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stoneTypeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  settingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Setting Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SETTING TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  settingCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.setting.setValue(e.CODE);
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.shape.setValue(e.CODE);
  }

  incCatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Range Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  incCatCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  orderRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'orderRef Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  orderRefCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.range.setValue(e.CODE);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  currencyCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.currency.setValue(e.CURRENCY_CODE);
  }

  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESIGN_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  designCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.code.setValue(e.DESIGN_CODE);
    this.designmasterForm.controls.designdesc.setValue(e.DESIGN_DESCRIPTION);
  }

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
  }
  prefixCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.prefix.setValue(e.PREFIX_CODE);
  }
  
  parentDesignCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Parent Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESIGN_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  parentDesignCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.parentDesign.setValue(e.DESIGN_CODE);
  }

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
  price1CodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.price1.setValue(e.PRICE_CODE);
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
  price2CodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.price2.setValue(e.PRICE_CODE);
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
  price3CodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.price3.setValue(e.PRICE_CODE);
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
  price4CodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.price4.setValue(e.PRICE_CODE);
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
  price5CodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.price5.setValue(e.PRICE_CODE);
  }


  onFileChangedimage(event:any) {
    this.imageurl = event.target.files[0]
    console.log(this.imageurl)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result; 
      };
    }
  }

  onFileChanged(event:any) {
    this.url = event.target.files[0].name
    console.log(this.url)
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.urls = reader.result; 
      };
    }
  }


  setFormValues() {
    if(!this.content) return
    console.log(this.content);
    
    this.designmasterForm.controls.mid.setValue(this.content.MID);
    this.designmasterForm.controls.code.setValue(this.content.MELTYPE_CODE);
    this.designmasterForm.controls.description.setValue(this.content.MELTYPE_DESCRIPTION);
    this.designmasterForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.designmasterForm.controls.purity.setValue(this.content.PURITY);
    this.designmasterForm.controls.metal.setValue(this.content.METAL_PER);
    this.designmasterForm.controls.alloy.setValue(this.content.ALLOY_PER);
    this.designmasterForm.controls.color.setValue(this.content.COLOR);
    this.designmasterForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.tableData = this.content.MELTING_TYPE_DETAIL;

  }

 updateMeltingType() {

  let API = 'MeltingType/UpdateMeltingType/'+ this.designmasterForm.value.mid;
    let postData=
      {
        "MID": this.designmasterForm.value.mid,
        "MELTYPE_CODE":  this.designmasterForm.value.code,
        "MELTYPE_DESCRIPTION": this.designmasterForm.value.description,
        "KARAT_CODE": this.designmasterForm.value.karat,
        "PURITY": this.commonService.transformDecimalVB(6,this.designmasterForm.value.purity),
        "METAL_PER": this.designmasterForm.value.metal,
        "ALLOY_PER": parseFloat(this.designmasterForm.value.alloy),
        "CREATED_BY": this.userName,
        "COLOR": this.designmasterForm.value.color,
        "STOCK_CODE": this.designmasterForm.value.stockCode,
        "MELTING_TYPE_DETAIL": this.tableData || []
      
    }

    let myData = {}

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.designmasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (!this.content.WORKER_CODE) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'MeltingType/DeleteMeltingType/' + this.content.MID;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.designmasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.designmasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  formSubmit(){
    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.designmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DesignMaster/InsertDesignMaster'
    let postData = {
      "DESIGN_CODE": this.designmasterForm.value.code || "",
      "DESIGN_DESCRIPTION":  this.designmasterForm.value.designdesc || "",
      "CURRENCY_CODE": "",
      "CC_RATE": 0,
      "COST_CODE": "",
      "TYPE_CODE": this.designmasterForm.value.type|| "",
      "CATEGORY_CODE": this.designmasterForm.value.category|| "",
      "SUBCATEGORY_CODE": this.designmasterForm.value.subcategory || "",
      "BRAND_CODE":  this.designmasterForm.value.brand || "",
      "COUNTRY_CODE":  this.designmasterForm.value.country || "",
      "SUPPLIER_CODE": "",
      "SUPPLIER_REF": "",
      "SET_REF":this.designmasterForm.value.setref || "",
      "PICTURE_NAME": "",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": this.designmasterForm.value.price1 || "",
      "PRICE2PER": this.designmasterForm.value.price2 || "",
      "PRICE3PER": this.designmasterForm.value.price3 || "",
      "PRICE4PER": this.designmasterForm.value.price4 || "",
      "PRICE5PER":this.designmasterForm.value.price5 || "",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "CHARGE1FC": 0,
      "CHARGE1LC": 0,
      "CHARGE2FC": 0,
      "CHARGE2LC": 0,
      "CHARGE3FC": 0,
      "CHARGE3LC": 0,
      "CHARGE4FC": 0,
      "CHARGE4LC": 0,
      "CHARGE5FC": 0,
      "CHARGE5LC": 0,
      "SHORT_ID": "",
      "COLOR":  this.designmasterForm.value.color || "",
      "CLARITY":  this.designmasterForm.value.clarity || "",
      "SIZE":  this.designmasterForm.value.size || "",
      "SIEVE":  this.designmasterForm.value.sieve || "",
      "SHAPE":  this.designmasterForm.value.shape || "",
      "GRADE": "",
      "FLUOR": "",
      "FINISH": "",
      "CERT_BY": "",
      "CERT_NO": "",
      "CERT_DATE": "2023-11-27T06:54:03.761Z",
      "GRIDLE": "",
      "CULET": "",
      "TWIDTH": 0,
      "CRHEIGHT": 0,
      "PAVDEPTH": 0,
      "OVERALL": "",
      "MEASURE": "",
      "CERT_PICTURE_NAME": "",
      "TAG_LINES": "",
      "COMMENTS": "",
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "",
      "STRAP_COLOR": "",
      "GW": 0,
      "MODEL_NO": "",
      "MODEL_YEAR": 0,
      "OPENED_ON": "2023-11-27T06:54:03.761Z",
      "OPENED_BY": "",
      "FIRST_TRN": "",
      "LAST_TRN": "",
      "MID": 0,
      "PRINTED": true,
      "PURVOCTYPE_NO": "",
      "PURPARTY": "",
      "PURDATE": "2023-11-27T06:54:03.761Z",
      "PURAMOUNT": 0,
      "PURBRLOC": "",
      "SALVOCTYPE_NO": "",
      "SALPARTY": "",
      "SALDATE": "2023-11-27T06:54:03.761Z",
      "SALAMOUNT": 0,
      "SALBRLOC": "",
      "METAL_TOTALGROSSWT": 0,
      "METAL_TOTALAMOUNT": 0,
      "METAL_TOTALMAKING": 0,
      "LOOSE_TOTALWT": 0,
      "LOOSE_TOTALAMOUNT": 0,
      "COLOR_TOTALWT": 0,
      "COLOR_TOTALAMOUNT": 0,
      "PEARL_TOTALWT": 0,
      "PEARL_TOTALAMOUNT": 0,
      "MANF_MID": 0,
      "MANF_BR_VOCTYPE_NO": "",
      "WATCH_REFNO": "",
      "WATCH_MODELNAME": "",
      "WATCH_MODELNO": "",
      "WATCH_MATERIAL": "",
      "WATCH_DIALCOLOR": "",
      "WATCH_BAZEL": "",
      "WATCH_MOVEMENT": "",
      "WATCH_STATUS": "",
      "ITEM_IMAGE": "",
      "DESIGN_HOLD": true,
      "DESIGN_EXCLUSSIVE": true,
      "JEWELLERY_SIZE": 0,
      "SIZE_UNIT": "",
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "2023-11-27T06:54:03.761Z",
      "LAST_PROD_REF": "",
      "LAST_CUST_ID": "",
      "LAST_STOCK_ID": "",
      "PENDING_JOB_PCS": 0,
      "PENDING_JOBS": 0,
      "LAST_COST": 0,
      "SEQ_CODE": "",
      "SEQ_DESCRIPTION": "",
      "EDITED_ON": "2023-11-27T06:54:03.761Z",
      "EDITED_BY": "",
      "MTL_STD_WT": 0,
      "MTL_TOLERANCE": 0,
      "LST_STD_WT": 0,
      "LST_TOLERANCE": 0,
      "CST_STD_WT": 0,
      "CST_TOLERANCE": 0,
      "ZIR_STD_WT": 0,
      "ZIR_TOLERANCE": 0,
      "PRL_STD_WT": 0,
      "PRL_TOLERANCE": 0,
      "OTH_STD_WT": 0,
      "OTH_TOLERANCE": 0,
      "WAX_WEIGHT": 0,
      "CAST_PCS_WEIGHT": 0,
      "SLV_MODEL_WEIGHT": 0,
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "MODEL_MAKER": "",
      "SKETCH_NAME": "",
      "PROD_INSTRUCTION": "",
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "",
      "TAG_LINESWOENTER": "",
      "PICTURE_NAME_THUMBNAIL": "",
      "KARAT_CODE": "",
      "PARTS": 0,
      "JOB_PREFIX": "",
      "SETREF_PREFIX": "",
      "DSURFACEPROPERTY": "",
      "DREFERENCE": "",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "METAL_WT":0,
      "CAD_DESIGNER": "",
      "DESIGNER": "",
      "INSTRUCTOR": "",
      "FINAL_APPROVAL": "",
      "TIME_CODE": "",
      "RANGE_CODE": "",
      "COMMENTS_CODE": "",
      "STYLE": "",
      "CHKCOMPONENTSUMMARY": "",
      "CHKCOMPONENTDETAIL": "",
      "METALWT": 0,
      "TOTAL_OTHER_FC": 0,
      "TOTAL_OTHER_LC": 0,
      "TOTAL_STONE_LC": 0,
      "TOTAL_STONE_FC": 0,
      "TOTAL_METAL_LC": 0,
      "TOTAL_METAL_FC": 0,
      "TOTAL_METAL_QTY": 0,
      "TOTAL_STONE_QTY": 0,
      "TOTVFC": 0,
      "TOTVLC": 0,
      "TOTALFC": 0,
      "TOTALCC": 0,
      "TOTPCS": 0,
      "TOTCARAT": 0,
      "TOTGMS": 0,
      "LAST_EDT_BY": "",
      "LAST_EDT_ON": "2023-11-27T06:54:03.761Z",
      "DIA_PCS": 0,
      "DIA_CARAT": 0,
      "DIA_VALUEFC": 0,
      "DIA_VALUECC": 0,
      "COLOR_PCS": 0,
      "COLOR_CARAT": 0,
      "COLOR_VALUEFC": 0,
      "COLOR_VALUECC": 0,
      "PEARL_PCS": 0,
      "PEARL_CARAT": 0,
      "PEARL_VALUEFC": 0,
      "PEARL_VALUECC": 0,
      "OTSTONES_PCS": 0,
      "OTSTONES_CARAT": 0,
      "OTSTONES_VALUEFC": 0,
      "OTSTONES_VALUECC": 0,
      "METAL_GROSSWT": 0,
      "METAL_VALUEFC": 0,
      "METAL_VALUECC": 0,
      "PAIR_REF": this.designmasterForm.value.pairref || "",
      "SURFACEPROPERTY": this.designmasterForm.value.surface || "",
      "WIDTH": 0,
      "THICKNESS": 0,
      "ENGRAVING_TEXT": "",
      "ENGRAVING_FONT": "",
      "STYLEMASTER": "",
      "PARENT_DSNG_CODE": "",
      "FAULT_DETAILS": "",
      "DESIGN_TYPE": "",
      "JEWELLERY_UNIT": "",
      "UDF1": "",
      "UDF2": "",
      "UDF3": "",
      "UDF4": "",
      "UDF5": "",
      "UDF6": "",
      "UDF7": "",
      "UDF8": "",
      "UDF9": "",
      "UDF10": "",
      "UDF11": "",
      "UDF12": "",
      "UDF13": "",
      "UDF14": "",
      "UDF15": "",
      "CUSTOMERSKU": "",
      "FINALAPPROVALDATE": "2023-11-27T06:54:03.761Z",
      "PRINT_COUNT": 0,
      "EXPIRY_DATE": "2023-11-27T06:54:03.761Z",
      "PROCESS_TYPE": "",
      "DYE_STRIP": true,
      "CASTING_REQ": 0,
      "WAXING_REQ": 0,
      "PCS": 0,
      "ISSUEDWT": 0,
      "READYWT": 0,
      "FITTINGWT": 0,
      "CUTTINGWT": 0,
      "INNERWT": 0,
      "NON_CASTING": 0,
      "CC_MAKING": "",
      "STONE_INCLUDED": true,
      "CAD_REQUIRED": true,
      "HEIGHT": "",
      "RADIUS": "",
      "LENGTH": "",
      "COMPSIZE_CODE": "",
      "COMPSET_CODE": "",
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": true,
      "MKGCALC_GROSSWT": true,
      "PURITY": 0,
      "DESIGN_DESC": "",
      "COST_CENTER_DESC": "",
      "karat_Desc": "",
      "SUPPLIER_DESC": "",
      "CATEGORY_DESC": "",
      "SUBCATEGORY_DESC": "",
      "TYPE_DESC": "",
      "BRAND_DESC": "",
      "STYLE_DESC": "",
      "RANGE_DESC": "",
      "COUNTRY_DESC": "",
      "UDF1_DESC": "",
      "UDF2_DESC": "",
      "UDF3_DESC": "",
      "UDF4_DESC": "",
      "UDF5_DESC": "",
      "UDF6_DESC": "",
      "UDF7_DESC": "",
      "UDF8_DESC": "",
      "UDF9_DESC": "",
      "UDF10_DESC": "",
      "UDF11_DESC": "",
      "UDF12_DESC": "",
      "UDF13_DESC": "",
      "UDF14_DESC": "",
      "UDF15_DESC": "",
      "REQ_METAL_WT": 0,
      "REQ_METAL_TYPE": true,
      "CHARGE6FC": 0,
      "CHARGE6LC": 0,
      "CHARGE7FC": 0,
      "CHARGE7LC": 0,
      "CHARGE8FC": 0,
      "CHARGE8LC": 0,
      "CHARGE9FC": 0,
      "CHARGE9LC": 0,
      "CHARGE10FC": 0,
      "CHARGE10LC": 0,
      "ADD_STEEL": true,
      "DESIGN_STNMTL_DETAIL": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "METALSTONE": "",
          "DIVCODE": "",
          "KARAT_CODE": "",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "",
          "CURRENCY_CODE": "",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "STOCK_CODE": "",
          "DESIGN_CODE": "",
          "KARAT": "",
          "PRICEID": "",
          "SIZE_FROM":"" ,
          "SIZE_TO": "",
          "RATEFC": 0,
          "PART_CODE": "",
          "DSIZE": "",
          "LABCHGCODE": "",
          "PRICECODE": "",
          "DMMETALPERCENTAGE": 0,
          "DLABCHGCODE": "",
          "DPRICECODE": "",
          "METALPER": 0,
          "METALRATE": 0,
          "CURR_RATE": 0,
          "LABOURCODE": "",
          "DETLINEREMARKS": "",
          "PROCESS_TYPE": "",
          "SIEVE_SET": "",
          "STONE_TYPE": "",
          "EXT_COLOR": "",
          "EXT_CLARITY": "",
          "D_REMARKS": "",
          "POINTER_WT": 0,
          "SIEVE_FROM": "",
          "SIEVE_TO": "",
          "PURITY": 0,
          "OTHER_ATTR": ""
        }
      ],
      "DESIGN_SEQUENCE_DETAILS_DJ": [
        {
          "DESIGN_CODE": "",
          "SEQ_CODE": "",
          "SEQ_NO": 0,
          "PROCESS_CODE": "",
          "PROCESS_TYPE": "",
          "CURRENCY_CODE": "",
          "UNIT_RATE": 0,
          "UNIT": "",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "",
          "WIP_ACCODE": "",
          "POINTS": 0,
          "DESCRIPTION": "",
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ],
      "DESIGN_PARTS": [
        {
          "DESIGN_CODE": "",
          "PART_CODE": "",
          "PART_DESCRIPTION": "",
          "METAL_WT": 0,
          "LS_PCS": 0,
          "LS_WT": 0,
          "CS_PCS": 0,
          "CS_WT": 0,
          "PL_PCS": 0,
          "PL_WT": 0,
          "OTH_PCS": 0,
          "OTH_WT": 0,
          "TOTAL_PCS": 0,
          "GROSS_WT": 0,
          "PICTURE_NAME": "",
          "PART_COLOR": ""
        }
      ],
      "DESIGN_ATTRIBUTES": [
        {
          "DESIGN_CODE": "",
          "ATTR_TYPE": "",
          "ATTR_CODE": "",
          "ATTR_DESCRIPTION": "",
          "WEIGHT": 0,
          "PCS": 0,
          "ST_PCS": 0,
          "ST_WEIGHT": 0,
          "DEFAULT_CODE": true
        }
      ],
      "Picture_Attachment": [
        {
          "CODE": "",
          "PICTURE_NAME": "",
          "DEFAULTPICTURE": true,
          "TYPE": "",
          "PICTURE_TYPE": "",
          "PICTURE_PATHOLD": ""
        }
      ],
      "METAL_STOCK_MASTER_VENDOR": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "ACCODE": "",
          "DEL_DAYS": 0,
          "CREDIT_DAYS": 0,
          "PAYMENT_MODE": "",
          "VENDOR_DESIGN": "",
          "DESCRIPTION": ""
        }
      ],
      "DESIGN_LABOUR_SUMMARY": [
        {
          "DESIGN_CODE": "",
          "CODE": "",
          "DESCRIPTION": "",
          "COST": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "SLNO": 0,
          "TYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "UNIT": "",
          "SELLING_RATE": 0
        }
      ]
    }
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.designmasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }


  update(){

    if (this.designmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

  console.log(this.designmasterForm,'working');
  
    let API = 'DesignMaster/UpdateDesignMaster/'+ this.designmasterForm.value.code

    let postData = {

      "DESIGN_CODE": this.designmasterForm.value.code || "",
      "DESIGN_DESCRIPTION":  this.designmasterForm.value.designdesc || "",
      "CURRENCY_CODE": "",
      "CC_RATE": 0,
      "COST_CODE": "",
      "TYPE_CODE": this.designmasterForm.value.type|| "",
      "CATEGORY_CODE": this.designmasterForm.value.category|| "",
      "SUBCATEGORY_CODE": this.designmasterForm.value.subcategory || "",
      "BRAND_CODE":  this.designmasterForm.value.brand || "",
      "COUNTRY_CODE":  this.designmasterForm.value.country || "",
      "SUPPLIER_CODE": "",
      "SUPPLIER_REF": "",
      "SET_REF":this.designmasterForm.value.setref || "",
      "PICTURE_NAME": "",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": this.designmasterForm.value.price1 || "",
      "PRICE2PER": this.designmasterForm.value.price2 || "",
      "PRICE3PER": this.designmasterForm.value.price3 || "",
      "PRICE4PER": this.designmasterForm.value.price4 || "",
      "PRICE5PER":this.designmasterForm.value.price5 || "",
      "PRICE1FC": 0,
      "PRICE1LC": 0,
      "PRICE2FC": 0,
      "PRICE2LC": 0,
      "PRICE3FC": 0,
      "PRICE3LC": 0,
      "PRICE4FC": 0,
      "PRICE4LC": 0,
      "PRICE5FC": 0,
      "PRICE5LC": 0,
      "CHARGE1FC": 0,
      "CHARGE1LC": 0,
      "CHARGE2FC": 0,
      "CHARGE2LC": 0,
      "CHARGE3FC": 0,
      "CHARGE3LC": 0,
      "CHARGE4FC": 0,
      "CHARGE4LC": 0,
      "CHARGE5FC": 0,
      "CHARGE5LC": 0,
      "SHORT_ID": "",
      "COLOR":  this.designmasterForm.value.color || "",
      "CLARITY":  this.designmasterForm.value.clarity || "",
      "SIZE":  this.designmasterForm.value.size || "",
      "SIEVE":  this.designmasterForm.value.sieve || "",
      "SHAPE":  this.designmasterForm.value.shape || "",
      "GRADE": "",
      "FLUOR": "",
      "FINISH": "",
      "CERT_BY": "",
      "CERT_NO": "",
      "CERT_DATE": "2023-11-27T06:54:03.761Z",
      "GRIDLE": "",
      "CULET": "",
      "TWIDTH": 0,
      "CRHEIGHT": 0,
      "PAVDEPTH": 0,
      "OVERALL": "",
      "MEASURE": "",
      "CERT_PICTURE_NAME": "",
      "TAG_LINES": "",
      "COMMENTS": "",
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "",
      "STRAP_COLOR": "",
      "GW": 0,
      "MODEL_NO": "",
      "MODEL_YEAR": 0,
      "OPENED_ON": "2023-11-27T06:54:03.761Z",
      "OPENED_BY": "",
      "FIRST_TRN": "",
      "LAST_TRN": "",
      "MID": 0,
      "PRINTED": true,
      "PURVOCTYPE_NO": "",
      "PURPARTY": "",
      "PURDATE": "2023-11-27T06:54:03.761Z",
      "PURAMOUNT": 0,
      "PURBRLOC": "",
      "SALVOCTYPE_NO": "",
      "SALPARTY": "",
      "SALDATE": "2023-11-27T06:54:03.761Z",
      "SALAMOUNT": 0,
      "SALBRLOC": "",
      "METAL_TOTALGROSSWT": 0,
      "METAL_TOTALAMOUNT": 0,
      "METAL_TOTALMAKING": 0,
      "LOOSE_TOTALWT": 0,
      "LOOSE_TOTALAMOUNT": 0,
      "COLOR_TOTALWT": 0,
      "COLOR_TOTALAMOUNT": 0,
      "PEARL_TOTALWT": 0,
      "PEARL_TOTALAMOUNT": 0,
      "MANF_MID": 0,
      "MANF_BR_VOCTYPE_NO": "",
      "WATCH_REFNO": "",
      "WATCH_MODELNAME": "",
      "WATCH_MODELNO": "",
      "WATCH_MATERIAL": "",
      "WATCH_DIALCOLOR": "",
      "WATCH_BAZEL": "",
      "WATCH_MOVEMENT": "",
      "WATCH_STATUS": "",
      "ITEM_IMAGE": "",
      "DESIGN_HOLD": true,
      "DESIGN_EXCLUSSIVE": true,
      "JEWELLERY_SIZE": 0,
      "SIZE_UNIT": "",
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "2023-11-27T06:54:03.761Z",
      "LAST_PROD_REF": "",
      "LAST_CUST_ID": "",
      "LAST_STOCK_ID": "",
      "PENDING_JOB_PCS": 0,
      "PENDING_JOBS": 0,
      "LAST_COST": 0,
      "SEQ_CODE": "",
      "SEQ_DESCRIPTION": "",
      "EDITED_ON": "2023-11-27T06:54:03.761Z",
      "EDITED_BY": "",
      "MTL_STD_WT": 0,
      "MTL_TOLERANCE": 0,
      "LST_STD_WT": 0,
      "LST_TOLERANCE": 0,
      "CST_STD_WT": 0,
      "CST_TOLERANCE": 0,
      "ZIR_STD_WT": 0,
      "ZIR_TOLERANCE": 0,
      "PRL_STD_WT": 0,
      "PRL_TOLERANCE": 0,
      "OTH_STD_WT": 0,
      "OTH_TOLERANCE": 0,
      "WAX_WEIGHT": 0,
      "CAST_PCS_WEIGHT": 0,
      "SLV_MODEL_WEIGHT": 0,
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "MODEL_MAKER": "",
      "SKETCH_NAME": "",
      "PROD_INSTRUCTION": "",
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "",
      "TAG_LINESWOENTER": "",
      "PICTURE_NAME_THUMBNAIL": "",
      "KARAT_CODE": "",
      "PARTS": 0,
      "JOB_PREFIX": "",
      "SETREF_PREFIX": "",
      "DSURFACEPROPERTY": "",
      "DREFERENCE": "",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "METAL_WT":0,
      "CAD_DESIGNER": "",
      "DESIGNER": "",
      "INSTRUCTOR": "",
      "FINAL_APPROVAL": "",
      "TIME_CODE": "",
      "RANGE_CODE": "",
      "COMMENTS_CODE": "",
      "STYLE": "",
      "CHKCOMPONENTSUMMARY": "",
      "CHKCOMPONENTDETAIL": "",
      "METALWT": 0,
      "TOTAL_OTHER_FC": 0,
      "TOTAL_OTHER_LC": 0,
      "TOTAL_STONE_LC": 0,
      "TOTAL_STONE_FC": 0,
      "TOTAL_METAL_LC": 0,
      "TOTAL_METAL_FC": 0,
      "TOTAL_METAL_QTY": 0,
      "TOTAL_STONE_QTY": 0,
      "TOTVFC": 0,
      "TOTVLC": 0,
      "TOTALFC": 0,
      "TOTALCC": 0,
      "TOTPCS": 0,
      "TOTCARAT": 0,
      "TOTGMS": 0,
      "LAST_EDT_BY": "",
      "LAST_EDT_ON": "2023-11-27T06:54:03.761Z",
      "DIA_PCS": 0,
      "DIA_CARAT": 0,
      "DIA_VALUEFC": 0,
      "DIA_VALUECC": 0,
      "COLOR_PCS": 0,
      "COLOR_CARAT": 0,
      "COLOR_VALUEFC": 0,
      "COLOR_VALUECC": 0,
      "PEARL_PCS": 0,
      "PEARL_CARAT": 0,
      "PEARL_VALUEFC": 0,
      "PEARL_VALUECC": 0,
      "OTSTONES_PCS": 0,
      "OTSTONES_CARAT": 0,
      "OTSTONES_VALUEFC": 0,
      "OTSTONES_VALUECC": 0,
      "METAL_GROSSWT": 0,
      "METAL_VALUEFC": 0,
      "METAL_VALUECC": 0,
      "PAIR_REF": this.designmasterForm.value.pairref || "",
      "SURFACEPROPERTY": this.designmasterForm.value.surface || "",
      "WIDTH": 0,
      "THICKNESS": 0,
      "ENGRAVING_TEXT": "",
      "ENGRAVING_FONT": "",
      "STYLEMASTER": "",
      "PARENT_DSNG_CODE": "",
      "FAULT_DETAILS": "",
      "DESIGN_TYPE": "",
      "JEWELLERY_UNIT": "",
      "UDF1": "",
      "UDF2": "",
      "UDF3": "",
      "UDF4": "",
      "UDF5": "",
      "UDF6": "",
      "UDF7": "",
      "UDF8": "",
      "UDF9": "",
      "UDF10": "",
      "UDF11": "",
      "UDF12": "",
      "UDF13": "",
      "UDF14": "",
      "UDF15": "",
      "CUSTOMERSKU": "",
      "FINALAPPROVALDATE": "2023-11-27T06:54:03.761Z",
      "PRINT_COUNT": 0,
      "EXPIRY_DATE": "2023-11-27T06:54:03.761Z",
      "PROCESS_TYPE": "",
      "DYE_STRIP": true,
      "CASTING_REQ": 0,
      "WAXING_REQ": 0,
      "PCS": 0,
      "ISSUEDWT": 0,
      "READYWT": 0,
      "FITTINGWT": 0,
      "CUTTINGWT": 0,
      "INNERWT": 0,
      "NON_CASTING": 0,
      "CC_MAKING": "",
      "STONE_INCLUDED": true,
      "CAD_REQUIRED": true,
      "HEIGHT": "",
      "RADIUS": "",
      "LENGTH": "",
      "COMPSIZE_CODE": "",
      "COMPSET_CODE": "",
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": true,
      "MKGCALC_GROSSWT": true,
      "PURITY": 0,
      "DESIGN_DESC": "",
      "COST_CENTER_DESC": "",
      "karat_Desc": "",
      "SUPPLIER_DESC": "",
      "CATEGORY_DESC": "",
      "SUBCATEGORY_DESC": "",
      "TYPE_DESC": "",
      "BRAND_DESC": "",
      "STYLE_DESC": "",
      "RANGE_DESC": "",
      "COUNTRY_DESC": "",
      "UDF1_DESC": "",
      "UDF2_DESC": "",
      "UDF3_DESC": "",
      "UDF4_DESC": "",
      "UDF5_DESC": "",
      "UDF6_DESC": "",
      "UDF7_DESC": "",
      "UDF8_DESC": "",
      "UDF9_DESC": "",
      "UDF10_DESC": "",
      "UDF11_DESC": "",
      "UDF12_DESC": "",
      "UDF13_DESC": "",
      "UDF14_DESC": "",
      "UDF15_DESC": "",
      "REQ_METAL_WT": 0,
      "REQ_METAL_TYPE": true,
      "CHARGE6FC": 0,
      "CHARGE6LC": 0,
      "CHARGE7FC": 0,
      "CHARGE7LC": 0,
      "CHARGE8FC": 0,
      "CHARGE8LC": 0,
      "CHARGE9FC": 0,
      "CHARGE9LC": 0,
      "CHARGE10FC": 0,
      "CHARGE10LC": 0,
      "ADD_STEEL": true,
      "DESIGN_STNMTL_DETAIL": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "METALSTONE": "",
          "DIVCODE": "",
          "KARAT_CODE": "",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "",
          "CURRENCY_CODE": "",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "",
          "COLOR": "",
          "CLARITY": "",
          "SHAPE": "",
          "STOCK_CODE": "",
          "DESIGN_CODE": "",
          "KARAT": "",
          "PRICEID": "",
          "SIZE_FROM":"" ,
          "SIZE_TO": "",
          "RATEFC": 0,
          "PART_CODE": "",
          "DSIZE": "",
          "LABCHGCODE": "",
          "PRICECODE": "",
          "DMMETALPERCENTAGE": 0,
          "DLABCHGCODE": "",
          "DPRICECODE": "",
          "METALPER": 0,
          "METALRATE": 0,
          "CURR_RATE": 0,
          "LABOURCODE": "",
          "DETLINEREMARKS": "",
          "PROCESS_TYPE": "",
          "SIEVE_SET": "",
          "STONE_TYPE": "",
          "EXT_COLOR": "",
          "EXT_CLARITY": "",
          "D_REMARKS": "",
          "POINTER_WT": 0,
          "SIEVE_FROM": "",
          "SIEVE_TO": "",
          "PURITY": 0,
          "OTHER_ATTR": ""
        }
      ],
      "DESIGN_SEQUENCE_DETAILS_DJ": [
        {
          "DESIGN_CODE": "",
          "SEQ_CODE": "",
          "SEQ_NO": 0,
          "PROCESS_CODE": "",
          "PROCESS_TYPE": "",
          "CURRENCY_CODE": "",
          "UNIT_RATE": 0,
          "UNIT": "",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "",
          "WIP_ACCODE": "",
          "POINTS": 0,
          "DESCRIPTION": "",
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ],
      "DESIGN_PARTS": [
        {
          "DESIGN_CODE": "",
          "PART_CODE": "",
          "PART_DESCRIPTION": "",
          "METAL_WT": 0,
          "LS_PCS": 0,
          "LS_WT": 0,
          "CS_PCS": 0,
          "CS_WT": 0,
          "PL_PCS": 0,
          "PL_WT": 0,
          "OTH_PCS": 0,
          "OTH_WT": 0,
          "TOTAL_PCS": 0,
          "GROSS_WT": 0,
          "PICTURE_NAME": "",
          "PART_COLOR": ""
        }
      ],
      "DESIGN_ATTRIBUTES": [
        {
          "DESIGN_CODE": "",
          "ATTR_TYPE": "",
          "ATTR_CODE": "",
          "ATTR_DESCRIPTION": "",
          "WEIGHT": 0,
          "PCS": 0,
          "ST_PCS": 0,
          "ST_WEIGHT": 0,
          "DEFAULT_CODE": true
        }
      ],
      "Picture_Attachment": [
        {
          "CODE": "",
          "PICTURE_NAME": "",
          "DEFAULTPICTURE": true,
          "TYPE": "",
          "PICTURE_TYPE": "",
          "PICTURE_PATHOLD": ""
        }
      ],
      "METAL_STOCK_MASTER_VENDOR": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "",
          "ACCODE": "",
          "DEL_DAYS": 0,
          "CREDIT_DAYS": 0,
          "PAYMENT_MODE": "",
          "VENDOR_DESIGN": "",
          "DESCRIPTION": ""
        }
      ],
      "DESIGN_LABOUR_SUMMARY": [
        {
          "DESIGN_CODE": "",
          "CODE": "",
          "DESCRIPTION": "",
          "COST": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "SLNO": 0,
          "TYPE": "",
          "METHOD": "",
          "DIVISION": "",
          "SHAPE": "",
          "SIZE_FROM": "",
          "SIZE_TO": "",
          "UNIT": "",
          "SELLING_RATE": 0
        }
      ]
    }
    
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.designmasterForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  checkCodeExists(event: any) {
    if (event.target.value == '') return
    let API = 'DesignMaster/CheckIfDesignCodePresent/' + event.target.value
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Design Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
            }
          });
          this.designmasterForm.controls.code.setValue('')
        }
      }, err => {
        this.designmasterForm.controls.code.setValue('')
      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.MID) {
      Swal.fire({
        title: '',
        text: 'Please Select data to delete!',
        icon: 'error',
        confirmButtonColor: '#336699',
        confirmButtonText: 'Ok'
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        let API = 'DesignMaster/DeleteDesignMaster/' + this.content.DESIGN_CODE
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
          .subscribe((result) => {
            if (result) {
              if (result.status == "Success") {
                Swal.fire({
                  title: result.message || 'Success',
                  text: '',
                  icon: 'success',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.designmasterForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.designmasterForm.reset()
                    this.tableData = []
                    this.close()
                  }
                });
              }
            } else {
              this.toastr.error('Not deleted')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }
}
