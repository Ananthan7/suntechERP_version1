import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MatRadioChange } from '@angular/material/radio';


@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {
    @ViewChild("codeField") codeField!: ElementRef;
  
  @ViewChild('overlaycodeSearch') overlaycodeSearch!: MasterSearchComponent;
  @ViewChild('overlayprefixSearch') overlayprefixSearch!: MasterSearchComponent;
  @ViewChild('overlayparentDesignSearch') overlayparentDesignSearch!: MasterSearchComponent;
  @ViewChild('overlaycostcenterSearch') overlaycostcenterSearch!: MasterSearchComponent;
  @ViewChild('overlaykaratSearch') overlaykaratSearch!: MasterSearchComponent;
  @ViewChild('overlaycategorySearch') overlaycategorySearch!: MasterSearchComponent;
  @ViewChild('overlaysubcategorySearch') overlaysubcategorySearch!: MasterSearchComponent;
  @ViewChild('overlaytypeSearch') overlaytypeSearch!: MasterSearchComponent;
  @ViewChild('overlaybrandSearch') overlaybrandSearch!: MasterSearchComponent;
  @ViewChild('overlaycountrySearch') overlaycountrySearch!: MasterSearchComponent;
  @ViewChild('overlaystyleSearch') overlaystyleSearch!: MasterSearchComponent;
  @ViewChild('overlayvendCustSearch') overlayvendCustSearch!: MasterSearchComponent;
  @ViewChild('overlayrangeSearch') overlayrangeSearch!: MasterSearchComponent;
  @ViewChild('overlaycurrencySearch') overlaycurrencySearch!: MasterSearchComponent;
  @ViewChild('overlayprice1Search') overlayprice1Search!: MasterSearchComponent;
  @ViewChild('overlayprice2Search') overlayprice2Search!: MasterSearchComponent;
  @ViewChild('overlayprice3Search') overlayprice3Search!: MasterSearchComponent;
  @ViewChild('overlayprice4Search') overlayprice4Search!: MasterSearchComponent;
  @ViewChild('overlayprice5Search') overlayprice5Search!: MasterSearchComponent;
  @ViewChild('overlaysizesetSearch') overlaysizesetSearch!: MasterSearchComponent;
  @ViewChild('overlaysizeSearch') overlaysizeSearch!: MasterSearchComponent;
  @ViewChild('overlaycollectionSearch') overlaycollectionSearch!: MasterSearchComponent;
  @ViewChild('overlaysubCollectionSearch') overlaysubCollectionSearch!: MasterSearchComponent;
  @ViewChild('overlaystoneTypeSearch') overlaystoneTypeSearch!: MasterSearchComponent;
  @ViewChild('overlaysettingSearch') overlaysettingSearch!: MasterSearchComponent;
  @ViewChild('overlayshapeSearch') overlayshapeSearch!: MasterSearchComponent;
  @ViewChild('overlayincCatSearch') overlayincCatSearch!: MasterSearchComponent;
  @ViewChild('overlayorderRefSearch') overlayorderRefSearch!: MasterSearchComponent;
  
  
  
  
  
  
  
  @Input() content!: any; 
  favoriteSeason: string = "";
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  strPrefix: string = "";
  images: string[] = [];
  tableData: any[] = [];
  tableDatas: any[] = [];
  tableDataCutRange: any[] = [];
  tableDataCountryRange: any[] = [];
  tableDataDyeCodeRange: any[] = [];
  tableDataWeightRange: any[] = [];
  tableDataWaxModels: any[] = [];
  tableDataApprovedVendors: any[] = [];
  tableDataEnamelColor: any[] = [];
  tableDataComponents: any[] = [];
  tableDataSizeRange: any[] = [];
  tableDataWidthRange: any[] = [];
  tableDataLength: any[] = [];
  tableDataHeight: any[] = [];
  tableDataKaratRange: any[] = [];
  tableDataColorRange: any[] = [];
  tableDataStockCode: any[] = [];
  tableDataFinishingRange: any[] = [];
  Disable: boolean = false;
  editMode: boolean = false;
  viewMode: boolean = false;
  fieldDisable : boolean = false;
  FieldEnable : boolean = false;
  editableMode: boolean = false;

  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  currentFilter: any; 
  prefixselected:any;
  branchCode?: String;
  selectedTabIndex = 0;
  selectedTabIndex1 = 1;

  columnhead:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  // columnheader1:any[] = ['SRNO','Division','Stone Type', 'Stock Code','Karat','Shape','Color','Ext.Color','Clarity','Ext.Clarity','Sieve Std.','Description','Sieve From'];
  columnheader2:any[] = ['Comp. Code','Sr no','Division','Stone Type', 'Stock Code','Karat','Int. Color','Ext. Color','Shape','Int. Clarity','Ext. Clarity'];
  columnheader3:any[] = ['',];
  columnheader4:any[] = ['SINO','Size Code','Description','Default'];
  column1:any[] = ['SINO','Model No','Description'];
  column2:any[] = ['SINO','Country Code','Description'];
  column3:any[] = ['SINO','Dye Code','Description'];
  column4:any[] = ['SINO','Wax Model Code','Description'];
  column5:any[] = ['SINO','Accode','Description','Vend Design','Del.Days','Credit Days','Mode Of Payment'];
  column6:any[] = ['SINO','Color Code','Description'];
  column7:any[] = ['SINO','Comp Code','Description'];
  column8:any[] = ['SINO','Width Code','Description'];
  column9:any[] = ['SINO','Length Code','Description','Default'];
  column10:any[] = ['SINO','Height Code','Description'];
  column11:any[] = ['SINO','Karat Code','Description','Default'];
  column12:any[] = ['SINO','Color Range','Description','Default'];
  column13:any[] = ['SINO','Billing Code','Description'];
  column14:any[] = ['SINO','Finishing Code','Description','Default'];
  column15:any[] = ['SINO','Size','Pcs'];
  columnhead1:any[] = ['SRNO','Comp.Code','Description','Pcs', 'Size Set Code','Size Code','Type','Category','Shape','Height','Width','Length','Radius'];
  columnhead2:any[] = ['DESIGN_C','PART_CODE','PART_DESCRIPTION','METAL_WT', 'LS_PCS','LS_WT','CS_PCS','CS_WT','PL_PCS','PL_WT','OTH_PCS','OTH_WT','TOTAL_PCS'];
 
  seasons: string[] = ['Customer Exclusive', 'Keep on Hold', 'Add Steel'];
  designPartDetails: any[] = [];
  selectedIndexes: any = [];
  userbranch = localStorage.getItem('userbranch');
 
  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  flag: any;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
    private renderer: Renderer2,
  ) { }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  
  ngOnInit(): void {

    this.flag = this.content
    ? this.content.FLAG
    : (this.content = { FLAG: "ADD" }).FLAG;

    if (this.content?.FLAG) {
      console.log(this.content)
     
     // this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.setAllInitialValues()
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.editableMode = true;
        this.setAllInitialValues()

      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    }
  }

    ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
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



  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        console.log(acc);

      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
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
    vendCust  : [''],
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
    prefixSelect : ['S'],
    noOfSubItems: ['1'],
    division: [''],
    stock_Code: [''],
    attribute: [''],
    vendorref: [''],
    finishtype: [''],
    makinggrosswt: [''],
    metalgrosswt: [''],
    cadDesigner: [''],
    designer: [''],
    metal_wt: [''],
    model: [''],
    instructor: [''],
    jewellerySize: [''],
    unit: [''],
    weightPerc: [''],
    cm: [''],
    reqmetal: [''],
    customerexclusive: [''],
    keeponhold: [''],
    addsteel: [''],
    engravingtext: [''],
    comments: [''],
    faultdetails: [''],
    thickness: [''],
    grade: [''],
    textbox1: [''],
    widthCad: [''],

  });
  
  //number validation
  isNumeric(event: any) {
    return this.commonService.isNumeric(event);
  }
  onInputChange(event: any, controlName: string, maxLength: number) {
    const inputValue = event.target.value;

    if (inputValue.length > maxLength) {
      this.designmasterForm.get(controlName)!.setValue(inputValue.slice(0, maxLength));
    }
  }

  openaddDesignSequence() {
    const modalRef: NgbModalRef = this.modalService.open(DesignSequenceComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.viewMode = this.viewMode;
  }

  openaddLabourChargesDetails() {
    const modalRef: NgbModalRef = this.modalService.open(LabourChargesDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.viewMode = this.viewMode;
  }

  openaddDesignTransaction() {
    const modalRef: NgbModalRef = this.modalService.open(DesignTransactionComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    modalRef.componentInstance.editMode = this.editMode;
    modalRef.componentInstance.viewMode = this.viewMode;
  }
  // validateLookupField(event: any,LOOKUPDATA: MasterSearchModel,FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
  //   }
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if(data.length==0){
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.designmasterForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }

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
          this.designmasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          if (FORMNAME === 'collection' || FORMNAME === 'subCollection' || FORMNAME === "stoneType" || FORMNAME === 'setting' || FORMNAME === 'shape' || FORMNAME === 'incCat' || FORMNAME === 'orderRef') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

  adddata() {
  
    let length = this.tableData.length;
    let srno = length + 1;
    let data =  {
      "SRNO": srno,
      "Division": "",
      "Stone_Type": "",
      "Stock_Code": "",
      "Karat": "",
      "Shape": "",
      "Color": "",
      "Ext_Color": "",
      "Clarity": 0,
      "Ext_Clarity": 0,
      "Sieve_Std": 0,
      "Description": "",
      "Sieve_From": 0,
      "Sieve_To": 0,
      "Description_detail": "",
      "Description_detail2": "",
      "Size":"",
      "Pcs":"",
      "WtCt":"",
      "ProcessType":"",
      "PointerWt":"",
      "Remark":"",
      "currency":"",
      "Design_currency":"",
      "Purity":"",
    };
  
    this.tableData.push(data);
    console.log(this.tableData);
   
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

SieveTotemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Sieve_To = data.target.value;
}
Description_detailtemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Description_detail = data.target.value;
}
Description_detail2temp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Description_detail2 = data.target.value;
}
Sizetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Size = data.target.value;
}
Pcstempp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Pcs = data.target.value;
}
WtCttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].WtCt = data.target.value;
}
ProcessTypetemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].ProcessType = data.target.value;
}
PointerWttemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].PointerWt = data.target.value;
}
Remarktemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Remark = data.target.value;
}
currencytemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].currency = data.target.value;
}
Design_currencytemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Design_currency = data.target.value;
}
Puritytemp(data:any,value: any){
  this.tableData[value.data.SRNO - 1].Purity = data.target.value;
}



adddatas(){
  let length = this.tableDatas.length;
  let srno = length + 1;
  let datas =  {
    "SRNO": srno,
    "Division": "",
    "StoneType": "",
    "StockCode": "",
    "Karat": "",
    "Shape": "",
    "Color": "",
    "ExtColor": "",
    "Clarity": 0,
    "ExtClarity": 0,
    "SieveStd": 0,
    "Description": '',
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
    SEARCH_HEADING: 'Size Code',
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
    SEARCH_HEADING: 'collection Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  collectionCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.collection.setValue(e.CODE);
  }

  subCollectionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sub Collection Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subCollectionCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.subCollection.setValue(e.CODE);
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stoneTypeCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.stoneType.setValue(e.CODE);
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

  
  vendCustCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Vend/Cust Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  vendCustCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.vendCust.setValue(e.ACCODE);
  }


  incCatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Inc Cat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  incCatCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.incCat.setValue(e.CODE);
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
    this.designmasterForm.controls.orderRef.setValue(e.CODE);
  }

  currencyCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.currency.setValue(e.CURRENCY_CODE);
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

  designCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
   // WHERECONDITION: "DIVISION='" + this.designmasterForm.value.prefixSelect + "' AND DESIGN_PREFIX =1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  designCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.code.setValue(e.PREFIX_CODE);
    this.designmasterForm.controls.designdesc.setValue(e.DESCRIPTION);
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

  divisionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  
  divisionCodeSelected(value:any,data:any, controlName: string){
    this.tableData[data.data.SRNO - 1].Division = ('');
    console.log('Data ',data);
    console.log('values ',value);
 
    this.tableData[data.data.SRNO - 1].Division = value.DIVISION_CODE;
    console.log(data.data.SRNO);

    if(value.DIVISION == 'M'){
      this.Disable = true;
      this.fieldDisable = true;
      this.FieldEnable = false;
    }
    else if(value.DIVISION == 'S'){
      this.Disable = false;
      this.FieldEnable = true;
      this.fieldDisable = false;

    }


}
  // divisionCodeSelected(value: any, data: any , controlName: string) {
  //   try {
  //     console.log('Received value:', value);
  //     console.log('Received data:', data);
  
  //     // Ensure that value.data is defined and has SRNO property
  //     if (value.data && value.data.SRNO !== undefined && value.data.SRNO !== null) {
  //       const srnoIndex = value.data.SRNO - 1;
  
  //       // Ensure that the index is within the bounds of this.tableData
  //       if (srnoIndex >= 0 && srnoIndex < this.tableData.length) {
  //         this.tableData[srnoIndex].Division = data.DIVISION_CODE;
  //         console.log('Table data after update:', this.tableData);
  //       } else {
  //         console.error('Invalid SRNO index:', srnoIndex);
  //       }
  //     } else {
  //       console.error('SRNO is undefined or null in value.data:', value.data);
  //     }
  //   } catch (error) {
  //     console.error('Error in divisionCodeSelected:', error);
  //   }
  // }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'STOCK Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockCodeDataSelected(value:any,data:any, controlName: string){
    console.log(data);
    console.log(value);

    this.tableData[data.data.SRNO - 1].Stock_Code = value.STOCK_CODE;
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

  karatCodeSelected1(value:any,data:any, controlName: string){
    console.log('Data ',data);
    console.log('values ',value);

    this.tableData[data.data.SRNO - 1].Karat = value.KARAT_CODE;
  }
  
  
  // onFileChangedimage(event:any) {
  //   this.imageurl = event.target.files[0]
  //   console.log(this.imageurl)
  //   let reader = new FileReader();
  //   if(event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.image = reader.result; 
  //     };
  //   }
  // }

  // onFileChanged(event:any) {
  //   this.url = event.target.files[0].name
  //   console.log(this.url)
  //   let reader = new FileReader();
  //   if(event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.urls = reader.result; 
  //     };
  //   }
  // }



onFileChangedimage(event: any) {

  this.images = [];

  if (event.target.files && event.target.files.length > 0) {

    for (let i = 0; i < event.target.files.length; i++) {
  let reader = new FileReader();

      let file = event.target.files[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.images.push(reader.result as string);
      };
    }
  }

}
  // setFormValues() {
  //   if(!this.content) return
  //   console.log(this.content);
    
  //   this.designmasterForm.controls.mid.setValue(this.content.MID);
  //   this.designmasterForm.controls.code.setValue(this.content.MELTYPE_CODE);
  //   this.designmasterForm.controls.description.setValue(this.content.MELTYPE_DESCRIPTION);
  //   this.designmasterForm.controls.karat.setValue(this.content.KARAT_CODE);
  //   this.designmasterForm.controls.purity.setValue(this.content.PURITY);
  //   this.designmasterForm.controls.metal.setValue(this.content.METAL_PER);
  //   this.designmasterForm.controls.alloy.setValue(this.content.ALLOY_PER);
  //   this.designmasterForm.controls.color.setValue(this.content.COLOR);
  //   this.designmasterForm.controls.stockCode.setValue(this.content.STOCK_CODE);
  //   this.tableData = this.content.MELTING_TYPE_DETAIL;
    
  // }

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
        }else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
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

  submitValidations(form: any) {
    if (this.commonService.nullToString(form.code) == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.designdesc) == '') {
      this.commonService.toastErrorByMsgId('MSG3569')//"designdesc cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.prefix) == '') {
      this.commonService.toastErrorByMsgId('MSG1657')//"prefix cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.costcenter) == '') {
      this.commonService.toastErrorByMsgId('MSG1150')//"costCenter cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.karat) == '') {
      this.commonService.toastErrorByMsgId('MSG1602')//"karat cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.currency) == '') {
      this.commonService.toastErrorByMsgId('MSG1173')//"currency cannot be empty"
      return true
    }
    return false;
  }

    
  setAllInitialValues() {
    console.log(this.content)
    if (!this.content) return
    let API = `DesignMaster/GetDesignMasterDetails/${this.content.DESIGN_CODE}`
    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.response) {
          let data = result.response
          console.log(data)


          this.designmasterForm.controls.code.setValue(data.DESIGN_CODE)
          this.designmasterForm.controls.designdesc.setValue(data.DESIGN_DESCRIPTION)
          this.designmasterForm.controls.currency.setValue(data.CURRENCY_CODE)
          this.designmasterForm.controls.type.setValue(data.TYPE_CODE)
          this.designmasterForm.controls.category.setValue(data.CATEGORY_CODE)
          this.designmasterForm.controls.subcategory.setValue(data.SUBCATEGORY_CODE)
          this.designmasterForm.controls.brand.setValue(data.BRAND_CODE)
          this.designmasterForm.controls.country.setValue(data.COUNTRY_CODE)
          this.designmasterForm.controls.setref.setValue(data.SET_REF)
          this.designmasterForm.controls.price1.setValue(data.PRICE1PER)
          this.designmasterForm.controls.price2.setValue(data.PRICE2PER)
          this.designmasterForm.controls.price3.setValue(data.PRICE3PER)
          this.designmasterForm.controls.price4.setValue(data.PRICE4PER)
          this.designmasterForm.controls.price5.setValue(data.PRICE5PER)
          this.designmasterForm.controls.color.setValue(data.COLOR)
          this.designmasterForm.controls.clarity.setValue(data.CLARITY)
          this.designmasterForm.controls.size.setValue(data.SIZE)
          // this.designmasterForm.controls.siev.setValue(data.SIEVE)
          this.designmasterForm.controls.shape.setValue(data.SHAPE)
          this.designmasterForm.controls.pairref.setValue(data.PAIR_REF)
          this.designmasterForm.controls.surface.setValue(data.SURFACEPROPERTY)
          this.designmasterForm.controls.prefix.setValue(data.JOB_PREFIX)
          this.designmasterForm.controls.parentDesign.setValue(data.PARENT_DSNG_CODE)
          this.designmasterForm.controls.attribute.setValue(data.FLUOR)
          this.designmasterForm.controls.costcenter.setValue(data.COST_CODE)
          this.designmasterForm.controls.karat.setValue(data.KARAT_CODE)
          this.designmasterForm.controls.vendorref.setValue(data.LAST_PROD_REF)
          this.designmasterForm.controls.style.setValue(data.STYLE)
          this.designmasterForm.controls.vendCust.setValue(data.LAST_CUST_ID)
          this.designmasterForm.controls.range.setValue(data.RANGE_CODE)
          this.designmasterForm.controls.metalgrosswt.setValue(data.METALCALC_GROSSWT)
          this.designmasterForm.controls.makinggrosswt.setValue(data.MKGCALC_GROSSWT)
          this.designmasterForm.controls.purity.setValue(data.PURITY)
          this.designmasterForm.controls.width.setValue(data.WIDTH)
          this.designmasterForm.controls.designer.setValue(data.DESIGNER)
          this.designmasterForm.controls.thickness.setValue(data.THICKNESS)
          this.designmasterForm.controls.grade.setValue(data.GRADE)
          this.designmasterForm.controls.metal_wt.setValue(this.commonService.transformDecimalVB(
            this.commonService.allbranchMaster?.BMQTYDECIMALS,data.METAL_WT))
          this.designmasterForm.controls.model.setValue(data.MODEL_NO)
          this.designmasterForm.controls.instructor.setValue(data.INSTRUCTOR)
          this.designmasterForm.controls.jewellerySize.setValue(data.JEWELLERY_SIZE)
          // this.designmasterForm.controls.weightPerc.setValue(data.WAX_WEIGHT)
          // this.designmasterForm.controls.cm.setValue(data.CAST_PCS_WEIGHT)
          this.designmasterForm.controls.weightPerc.setValue(data.WAX_WEIGHT === 1.000 ? "1" : "2");
          this.designmasterForm.controls.cm.setValue(data.CAST_PCS_WEIGHT === 1.000 ? "1" : "2");
          this.designmasterForm.controls.reqmetal.setValue(this.commonService.transformDecimalVB(
            this.commonService.allbranchMaster?.BMQTYDECIMALS,data.REQ_METAL_WT))
          this.designmasterForm.controls.keeponhold.setValue(data.DESIGN_HOLD)
          this.designmasterForm.controls.customerexclusive.setValue(data.DESIGN_EXCLUSSIVE)
          this.designmasterForm.controls.addsteel.setValue(data.ADD_STEEL)
          this.designmasterForm.controls.comments.setValue(data.COMMENTS)
          this.designmasterForm.controls.engravingtext.setValue(data.ENGRAVING_TEXT)
          this.designmasterForm.controls.faultdetails.setValue(data.FAULT_DETAILS)
          this.designmasterForm.controls.price1.setValue(data.PRICE1PER)
          this.designmasterForm.controls.price2.setValue(data.PRICE2PER)
          this.designmasterForm.controls.price3.setValue(data.PRICE3PER)
          this.designmasterForm.controls.price4.setValue(data.PRICE4PER)
          this.designmasterForm.controls.price5.setValue(data.PRICE5PER)
          this.designmasterForm.controls.textbox1.setValue(data.PROD_INSTRUCTION)
          this.designmasterForm.controls.sizeset.setValue(data.SIZE_UNIT)
          this.designmasterForm.controls.height.setValue(data.HEIGHT)
          this.designmasterForm.controls.length.setValue(data.RADIUS)
          this.designmasterForm.controls.radius.setValue(data.LENGTH)
          this.designmasterForm.controls.widthCad.setValue(data.DWIDTH)
          this.designmasterForm.controls.collection.setValue(data.UDF1)
          this.designmasterForm.controls.subCollection.setValue(data.UDF2)
          this.designmasterForm.controls.stoneType.setValue(data.UDF3)
          this.designmasterForm.controls.setting.setValue(data.UDF4)
          this.designmasterForm.controls.shape.setValue(data.UDF5)
          this.designmasterForm.controls.incCat.setValue(data.UDF6)
          this.designmasterForm.controls.orderRef.setValue(data.UDF7)
        } else {
          this.commonService.toastErrorByMsgId('MSG1531')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG1531')
      })
    this.subscriptions.push(Sub)
  }


  setPostData() {
    return {
      "DESIGN_CODE":  this.commonService.nullToString(this.designmasterForm.value.code),
      "DESIGN_DESCRIPTION":   this.commonService.nullToString(this.designmasterForm.value.designdesc),
      "CURRENCY_CODE":  this.commonService.nullToString(this.designmasterForm.value.currency),
      "CC_RATE": 0,
      "COST_CODE": this.commonService.nullToString(this.designmasterForm.value.costcenter),
      "TYPE_CODE":  this.commonService.nullToString(this.designmasterForm.value.type),
      "CATEGORY_CODE":  this.commonService.nullToString(this.designmasterForm.value.category),
      "SUBCATEGORY_CODE":  this.commonService.nullToString(this.designmasterForm.value.subcategory),
      "BRAND_CODE":   this.commonService.nullToString(this.designmasterForm.value.brand),
      "COUNTRY_CODE":   this.commonService.nullToString(this.designmasterForm.value.country),
      "SUPPLIER_CODE": "",
      "SUPPLIER_REF": "",
      "SET_REF":  this.commonService.nullToString(this.designmasterForm.value.setref),
      "PICTURE_NAME": "",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER":  this.commonService.nullToString(this.designmasterForm.value.price1),
      "PRICE2PER":  this.commonService.nullToString(this.designmasterForm.value.price2),
      "PRICE3PER":  this.commonService.nullToString(this.designmasterForm.value.price3),
      "PRICE4PER":  this.commonService.nullToString(this.designmasterForm.value.price4),
      "PRICE5PER":  this.commonService.nullToString(this.designmasterForm.value.price5),
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
      "COLOR":   this.commonService.nullToString(this.designmasterForm.value.color),
      "CLARITY":   this.commonService.nullToString(this.designmasterForm.value.clarity),
      "SIZE":   this.commonService.nullToString(this.designmasterForm.value.size),
      "SIEVE":   this.commonService.nullToString(this.designmasterForm.value.siev),
      "SHAPE":   this.commonService.nullToString(this.designmasterForm.value.shape),
      "GRADE": this.commonService.nullToString(this.designmasterForm.value.grade),
      "FLUOR":  this.commonService.nullToString(this.designmasterForm.value.attribute),
      "FINISH": this.commonService.nullToString(this.designmasterForm.value.finishtype),
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
      "COMMENTS":this.commonService.nullToString(this.designmasterForm.value.comments) ,
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "",
      "STRAP_COLOR": "",
      "GW": 0,
      "MODEL_NO": this.commonService.nullToString(this.designmasterForm.value.model),
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
      "DESIGN_HOLD": this.designmasterForm.value.keeponhold,
      "DESIGN_EXCLUSSIVE": this.designmasterForm.value.customerexclusive,
      "JEWELLERY_SIZE": this.commonService.emptyToZero(this.designmasterForm.value.jewellerySize),
      "SIZE_UNIT": this.commonService.nullToString(this.designmasterForm.value.sizeset),
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "2023-11-27T06:54:03.761Z",
      "LAST_PROD_REF": this.commonService.nullToString(this.designmasterForm.value.vendorref),
      "LAST_CUST_ID": this.commonService.nullToString(this.designmasterForm.value.vendCust),
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
      "WAX_WEIGHT": this.commonService.emptyToZero(this.designmasterForm.value.weightPerc),
      "CAST_PCS_WEIGHT": this.commonService.emptyToZero(this.designmasterForm.value.cm),
      "SLV_MODEL_WEIGHT": 0,
      "STD_TIME": 0,
      "MAX_TIME": 0,
      "MODEL_MAKER": "",
      "SKETCH_NAME": "",
      "PROD_INSTRUCTION": this.commonService.nullToString(this.designmasterForm.value.textbox1),
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "",
      "TAG_LINESWOENTER": "",
      "PICTURE_NAME_THUMBNAIL": "",
      "KARAT_CODE": this.commonService.nullToString(this.designmasterForm.value.karat),
      "PARTS": 0,
      "JOB_PREFIX": this.commonService.nullToString(this.designmasterForm.value.prefix),
      "SETREF_PREFIX": "",
      "DSURFACEPROPERTY": "",
      "DREFERENCE": "",
      "DWIDTH": this.commonService.emptyToZero(this.designmasterForm.value.widthCad),
      "DTHICKNESS": 0,
      "METAL_WT":this.commonService.emptyToZero(this.designmasterForm.value.metal_wt),
      "CAD_DESIGNER": this.commonService.nullToString(this.designmasterForm.value.cadDesigner) ,
      "DESIGNER": this.commonService.nullToString(this.designmasterForm.value.designer),
      "INSTRUCTOR": this.commonService.nullToString(this.designmasterForm.value.instructor),
      "FINAL_APPROVAL": "",
      "TIME_CODE": "",
      "RANGE_CODE":  this.commonService.nullToString(this.designmasterForm.value.range),
      "COMMENTS_CODE": "",
      "STYLE": this.commonService.nullToString(this.designmasterForm.value.style),
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
      "PAIR_REF":  this.commonService.nullToString(this.designmasterForm.value.pairref),
      "SURFACEPROPERTY":  this.commonService.nullToString(this.designmasterForm.value.surface),
      "WIDTH": this.commonService.emptyToZero(this.designmasterForm.value.width),
      "THICKNESS": this.commonService.emptyToZero(this.designmasterForm.value.thickness),
      "ENGRAVING_TEXT":  this.commonService.nullToString(this.designmasterForm.value.engravingtext),
      "ENGRAVING_FONT": "",
      "STYLEMASTER": "",
      "PARENT_DSNG_CODE": this.commonService.nullToString(this.designmasterForm.value.parentDesign),
      "FAULT_DETAILS": this.commonService.nullToString(this.designmasterForm.value.faultdetails) ,
      "DESIGN_TYPE": "",
      "JEWELLERY_UNIT": "",
      "UDF1": this.commonService.nullToString(this.designmasterForm.value.collection),
      "UDF2": this.commonService.nullToString(this.designmasterForm.value.subCollection),
      "UDF3": this.commonService.nullToString(this.designmasterForm.value.stoneType),
      "UDF4": this.commonService.nullToString(this.designmasterForm.value.setting),
      "UDF5": this.commonService.nullToString(this.designmasterForm.value.shape),
      "UDF6": this.commonService.nullToString(this.designmasterForm.value.incCat),
      "UDF7": this.commonService.nullToString(this.designmasterForm.value.orderRef),
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
      "HEIGHT":  this.commonService.nullToString(this.designmasterForm.value.height),
      "RADIUS":  this.commonService.nullToString(this.designmasterForm.value.length),
      "LENGTH":  this.commonService.nullToString(this.designmasterForm.value.radius),
      "COMPSIZE_CODE": "",
      "COMPSET_CODE": "",
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": this.designmasterForm.value.metalgrosswt,
      "MKGCALC_GROSSWT": this.designmasterForm.value.makinggrosswt,
      "PURITY": this.commonService.emptyToZero( this.designmasterForm.value.purity),
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
      "REQ_METAL_WT": this.commonService.emptyToZero( this.designmasterForm.value.reqmetal),
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
      "ADD_STEEL": this.designmasterForm.value.addsteel,
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
  }

  formSubmit(){
    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }

    if (this.submitValidations(this.designmasterForm.value)) return;
    // if (this.designmasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }
  
    let API = 'DesignMaster/InsertDesignMaster'
    let postData = this.setPostData()
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: this.commonService.getMsgByID('MSG3641') || 'Success',
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }


  update(){

    // if (this.designmasterForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    if (this.submitValidations(this.designmasterForm.value)) return;

  console.log(this.designmasterForm,'working');
  
    let API = 'DesignMaster/UpdateDesignMaster/'+ this.designmasterForm.value.code

    let postData = this.setPostData()
    
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
            Swal.fire({
              title: this.commonService.getMsgByID('MSG3641') || 'Success',
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
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }
  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }
    // console.log('this w');
    
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
    // if (!this.content.MID) {
    //   Swal.fire({
    //     title: '',
    //     text: 'Please Select data to delete!',
    //     icon: 'error',
    //     confirmButtonColor: '#336699',
    //     confirmButtonText: 'Ok'
    //   }).then((result: any) => {
    //     if (result.value) {
    //     }
    //   });
    //   return
    // }
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
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else
      {
        this.close('reloadMainGrid')

      }
    });
  }


  
  noOfSubItems(){

    let count = this.designmasterForm.value.noOfSubItems;
    console.log(count);
    for(let i = 0 ; i< count ; i++){
      let obj4 = {};

      this.designPartDetails.push(obj4);
    }
    console.log(this.designPartDetails);
   

  }

  adddataAttributes(){
    let length = this.tableDataCutRange.length;
    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Width Code": "",
      "Description": "",
  }
  this.tableDataCutRange.push(datas);
  }

  removedataAttributes(){

  }

  adddataAttributesCountry(){
    let length = this.tableDataCountryRange.length;
    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Country Code": "",
      "Description": "",
  }
  this.tableDataCountryRange.push(datas);
  }

  removedataAttributesCountry(){

  }

  adddataAttributesDyeCodeRange(){
    let length = this.tableDataDyeCodeRange.length;
    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Dye Code": "",
      "Description": "",
  }
  this.tableDataDyeCodeRange.push(datas);
  }

  removedataAttributesDyeCodeRange(){

  }


  adddataAttributesWeightRange(){
    let length = this.tableDataWeightRange.length;
    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Size": "",
      "Pcs": "",
  }
  this.tableDataWeightRange.push(datas);

    
  }

  removedataAttributesWeightRange(){

  }

  adddataAttributesWaxModels(){
    let length = this.tableDataWaxModels.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Wax Model Code": "",
      "Description": "",
  }
  this.tableDataWaxModels.push(datas);

  }

  removedataAttributesWaxModels(){

  }


  adddataAttributeApprovedVendors(){
    let length = this.tableDataApprovedVendors.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Accode": "",
      "Description": "",
      "Vend Design": "",
      "Del.Days": "",
      "Credit Days": "",
      "Mode Of Payment": "",
  }
  this.tableDataApprovedVendors.push(datas);
  
  }

  removedataAttributesApprovedVendors(){

  }

  adddataAttributeEnamelColor(){
    let length = this.tableDataEnamelColor.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Color Code": "",
      "Description": "",
     
  }
  this.tableDataEnamelColor.push(datas);
  
  }

  removedataAttributesEnamelColor(){

  }

  
  adddataAttributeComponents(){
    let length = this.tableDataComponents.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Comp Code": "",
      "Description": "",
      
     
  }
  this.tableDataComponents.push(datas);
  
  }

  removedataAttributesComponents(){

  }


  
  
  adddataAttributeSizeRange(){
    let length = this.tableDataSizeRange.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Size Code": "",
      "Description": "",
      "Default":"",
      
     
  }
  this.tableDataSizeRange.push(datas);
 
  }

  removedataAttributesSizeRange(){

  }

  
  adddataAttributeWidthRange(){
    let length = this.tableDataWidthRange.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Width Code": "",
      "Description": "",
     
  }
  this.tableDataWidthRange.push(datas);
  }

  
  removedataAttributesWidthRange(){

  }

  

  adddataAttributeLength(){
    let length = this.tableDataLength.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Length Code": "",
      "Description": "",
     
  }
  this.tableDataLength.push(datas);
  }

  
  removedataAttributesLength(){

  }

  adddataAttributeHeight(){
    let length = this.tableDataHeight.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Height Code": "",
      "Description": "",
     
  }
  this.tableDataHeight.push(datas);
  }

  
  removedataAttributesHeight(){

  }

  adddataAttributeKaratRange(){
    let length = this.tableDataKaratRange.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Karat Code": "",
      "Description": "",
      "Default" : "",
     
  }
  this.tableDataKaratRange.push(datas);
  }

  
  removedataAttributesKaratRange(){

  }



  adddataAttributeColorRange(){
    let length = this.tableDataColorRange.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Color Code": "",
      "Description": "",
      "Default" : "",
     
  }
  this.tableDataColorRange.push(datas);
  }

  
  removedataAttributesColorRange(){

  }

  adddataAttributeStockCode(){
    let length = this.tableDataStockCode.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Billing Code": "",
      "Description": "",
  }
  this.tableDataStockCode.push(datas);
  }

  
  removedataAttributesStockCode(){

  }
  removedataAttributesFinishingRange(){

  }
 
  adddataAttributeFinishingRange(){
    let length = this.tableDataFinishingRange.length;

    let srno = length + 1;
    let datas =  {
      "SINO": srno,
      "Finishing Code": "",
      "Description": "",
      "Default" : "",
  }
  this.tableDataFinishingRange.push(datas);
  }

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }

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
      case 'code':
        this.overlaycodeSearch.showOverlayPanel(event);
        break;
      case 'prefix':
        this.overlayprefixSearch.showOverlayPanel(event);
        break;
      case 'parentDesign':
        this.overlayparentDesignSearch.showOverlayPanel(event);
        break;
      case 'costcenter':
        this.overlaycostcenterSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'category':
        this.overlaycategorySearch.showOverlayPanel(event);
        break;
      case 'subcategory':
        this.overlaysubcategorySearch.showOverlayPanel(event);
        break;
      case 'type':
        this.overlaytypeSearch.showOverlayPanel(event);
        break;
      case 'country':
        this.overlaycountrySearch.showOverlayPanel(event);
        break;
      case 'style':
        this.overlaystyleSearch.showOverlayPanel(event);
        break;
      case 'brand':
        this.overlaybrandSearch.showOverlayPanel(event);
        break;
      case 'vendCust':
        this.overlayvendCustSearch.showOverlayPanel(event);
        break;
      case 'range':
        this.overlayrangeSearch.showOverlayPanel(event);
        break;
      case 'currency':
        this.overlaycurrencySearch.showOverlayPanel(event);
        break;
      case 'price1':
        this.overlayprice1Search.showOverlayPanel(event);
        break;
      case 'price2':
        this.overlayprice2Search.showOverlayPanel(event);
        break;
      case 'price3':
        this.overlayprice3Search.showOverlayPanel(event);
        break;
      case 'price4':
        this.overlayprice4Search.showOverlayPanel(event);
        break;
      case 'price5':
        this.overlayprice5Search.showOverlayPanel(event);
        break;
      case 'sizeset':
        this.overlaysizesetSearch.showOverlayPanel(event);
        break;
      case 'size':
        this.overlaysizeSearch.showOverlayPanel(event);
        break;
      case 'collection':
        this.overlaycollectionSearch.showOverlayPanel(event);
        break;
      case 'subCollection':
        this.overlaysubCollectionSearch.showOverlayPanel(event);
        break;
      case 'stoneType':
        this.overlaystoneTypeSearch.showOverlayPanel(event);
        break;
      case 'setting':
        this.overlaysettingSearch.showOverlayPanel(event);
        break;
      case 'shape':
        this.overlayshapeSearch.showOverlayPanel(event);
        break;
      case 'incCat':
        this.overlayincCatSearch.showOverlayPanel(event);
        break;
      case 'orderRef':
        this.overlayorderRefSearch.showOverlayPanel(event);
        break;
      default:
    }
  }
  

  // showOverleyPanel(event: any, formControlName: string) {

  //   if (formControlName == 'code') {
  //     this.overlaycodeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'prefix') {
  //     this.overlayprefixSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'parentDesign') {
  //     this.overlayparentDesignSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'costcenter') {
  //     this.overlaycostcenterSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'karat') {
  //     this.overlaykaratSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'category') {
  //     this.overlaycategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'subcategory') {
  //     this.overlaysubcategorySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'type') {
  //     this.overlaytypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'country') {
  //     this.overlaycountrySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'style') {
  //     this.overlaystyleSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'brand') {
  //     this.overlaybrandSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'vendCust') {
  //     this.overlayvendCustSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'range') {
  //     this.overlayrangeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'currency') {
  //     this.overlaycurrencySearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price1') {
  //     this.overlayprice1Search.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price2') {
  //     this.overlayprice2Search.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price3') {
  //     this.overlayprice3Search.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price4') {
  //     this.overlayprice4Search.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'price5') {
  //     this.overlayprice5Search.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'sizeset') {
  //     this.overlaysizesetSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'size') {
  //     this.overlaysizeSearch.showOverlayPanel(event)
  //   }

  //   if (formControlName == 'collection') {
  //     this.overlaycollectionSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'subCollection') {
  //     this.overlaysubCollectionSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'stoneType') {
  //     this.overlaystoneTypeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'setting') {
  //     this.overlaysettingSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'shape') {
  //     this.overlayshapeSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'incCat') {
  //     this.overlayincCatSearch.showOverlayPanel(event)
  //   }
  //   if (formControlName == 'orderRef') {
  //     this.overlayorderRefSearch.showOverlayPanel(event)
  //   }
  // }

  onRadioChange(event: MatRadioChange): void {
    console.log('Selected value:', event.value);
    
    this.prefixselected = event.value;

    this.designCodeData.WHERECONDITION = `DIVISION='${this.prefixselected}' AND DESIGN_PREFIX=1`;
  
    
  }

  allowNumbersOnly(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
}

  
}



 