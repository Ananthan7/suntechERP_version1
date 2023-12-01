import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {
  @Input() content!: any; 
  favoriteSeason: string = "";


  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];

  currentFilter: any; 
  divisionMS: any = 'ID';

  columnhead:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader:any[] = ['Mould Number','Parts','Type', 'Location','Voucher Date','Voucher No'];
  columnheader1:any[] = ['Srno','Division','Stone Type', 'Stock Code','Karat','Shape','Color','Ext.Color','Clarity','Ext.Clarity','Sieve Std.','Description','Sieve From'];
  columnheader2:any[] = ['Comp.Code','Srno','Division','Stone Type', 'Stock Code','Karat','Int.Color','Ext.Color','Shape','Int.Clarity','Ext.Clarity'];
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
  columnhead1:any[] = ['Srno','Comp.Code','Description','Pcs', 'Size Set Code','Size Code','Type','Category','Shape','Height','Width','Length','Radious'];
  columnhead2:any[] = ['DESIGN_C','PART_CODE','PART_DESCRIPTION','METAL_WT', 'LS_PCS','LS_WT','CS_PCS','CS_WT','PL_PCS','PL_WT','OTH_PCS','OTH_WT','TOTAL_PCS'];

  seasons: string[] = ['Customer Exclusive', 'Keep on Hold', 'Add Steel'];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  ngOnInit(): void {
  }
  
  designmasterForm: FormGroup = this.formBuilder.group({
    mid:[],
    code: [''],
    designdesc: [''],
    costcenter: [''],
    category: [''],
    subcategory: [''],
    type: [''],
    brand: [''],
    style: [''],
    range: [''],
    description: [''],
    metal: [''],
    color: [''],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],
    stockCodeDes : [''],
    divCode : [''],
    country : [''],
    size : [''],
    sizeset : [''],
    sieve : [''],
    currency:[''],
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
  });

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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
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
    WHERECONDITION: "CODE<> ''",
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
    LOOKUPID: 36,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizesetCodeSelected(e:any){
    console.log(e);
    this.designmasterForm.controls.sizeset.setValue(e.CODE);
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
      "CURRENCY_CODE": "string",
      "CC_RATE": 0,
      "COST_CODE": "string",
      "TYPE_CODE": this.designmasterForm.value.type|| "",
      "CATEGORY_CODE": this.designmasterForm.value.category|| "",
      "SUBCATEGORY_CODE": this.designmasterForm.value.subcategory || "",
      "BRAND_CODE":  this.designmasterForm.value.brand || "",
      "COUNTRY_CODE":  this.designmasterForm.value.country || "",
      "SUPPLIER_CODE": "string",
      "SUPPLIER_REF": "string",
      "SET_REF":this.designmasterForm.value.setref || "",
      "PICTURE_NAME": "string",
      //"PICTURE_NAME1": "string",
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
      "SHORT_ID": "string",
      "COLOR":  this.designmasterForm.value.color || "",
      "CLARITY":  this.designmasterForm.value.clarity || "",
      "SIZE":  this.designmasterForm.value.size || "",
      "SIEVE":  this.designmasterForm.value.sieve || "",
      "SHAPE":  this.designmasterForm.value.shape || "",
      "GRADE": "string",
      "FLUOR": "string",
      "FINISH": "string",
      "CERT_BY": "string",
      "CERT_NO": "string",
      "CERT_DATE": "2023-11-27T06:54:03.761Z",
      "GRIDLE": "string",
      "CULET": "string",
      "TWIDTH": 0,
      "CRHEIGHT": 0,
      "PAVDEPTH": 0,
      "OVERALL": "string",
      "MEASURE": "string",
      "CERT_PICTURE_NAME": "string",
      "TAG_LINES": "string",
      "COMMENTS": "string",
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "string",
      "STRAP_COLOR": "string",
      "GW": 0,
      "MODEL_NO": "string",
      "MODEL_YEAR": 0,
      "OPENED_ON": "2023-11-27T06:54:03.761Z",
      "OPENED_BY": "string",
      "FIRST_TRN": "string",
      "LAST_TRN": "string",
      "MID": 0,
      "PRINTED": true,
      "PURVOCTYPE_NO": "string",
      "PURPARTY": "string",
      "PURDATE": "2023-11-27T06:54:03.761Z",
      "PURAMOUNT": 0,
      "PURBRLOC": "string",
      "SALVOCTYPE_NO": "string",
      "SALPARTY": "string",
      "SALDATE": "2023-11-27T06:54:03.761Z",
      "SALAMOUNT": 0,
      "SALBRLOC": "string",
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
      "MANF_BR_VOCTYPE_NO": "string",
      "WATCH_REFNO": "string",
      "WATCH_MODELNAME": "string",
      "WATCH_MODELNO": "string",
      "WATCH_MATERIAL": "string",
      "WATCH_DIALCOLOR": "string",
      "WATCH_BAZEL": "string",
      "WATCH_MOVEMENT": "string",
      "WATCH_STATUS": "string",
      "ITEM_IMAGE": "string",
      "DESIGN_HOLD": true,
      "DESIGN_EXCLUSSIVE": true,
      "JEWELLERY_SIZE": 0,
      "SIZE_UNIT": "string",
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "2023-11-27T06:54:03.761Z",
      "LAST_PROD_REF": "string",
      "LAST_CUST_ID": "string",
      "LAST_STOCK_ID": "string",
      "PENDING_JOB_PCS": 0,
      "PENDING_JOBS": 0,
      "LAST_COST": 0,
      "SEQ_CODE": "string",
      "SEQ_DESCRIPTION": "string",
      "EDITED_ON": "2023-11-27T06:54:03.761Z",
      "EDITED_BY": "string",
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
      "MODEL_MAKER": "string",
      "SKETCH_NAME": "string",
      "PROD_INSTRUCTION": "string",
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "string",
      "TAG_LINESWOENTER": "string",
      "PICTURE_NAME_THUMBNAIL": "string",
      "KARAT_CODE": "string",
      "PARTS": 0,
      "JOB_PREFIX": "string",
      "SETREF_PREFIX": "string",
      "DSURFACEPROPERTY": "string",
      "DREFERENCE": "string",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "METAL_WT":this.designmasterForm.value.metalwt || "",
      "CAD_DESIGNER": "string",
      "DESIGNER": "string",
      "INSTRUCTOR": "string",
      "FINAL_APPROVAL": "string",
      "TIME_CODE": "string",
      "RANGE_CODE": "string",
      "COMMENTS_CODE": "string",
      "STYLE": "string",
      "CHKCOMPONENTSUMMARY": "string",
      "CHKCOMPONENTDETAIL": "string",
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
      "LAST_EDT_BY": "string",
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
      "ENGRAVING_TEXT": "string",
      "ENGRAVING_FONT": "string",
      "STYLEMASTER": "string",
      "PARENT_DSNG_CODE": "string",
      "FAULT_DETAILS": "string",
      "DESIGN_TYPE": "string",
      "JEWELLERY_UNIT": "string",
      "UDF1": "string",
      "UDF2": "string",
      "UDF3": "string",
      "UDF4": "string",
      "UDF5": "string",
      "UDF6": "string",
      "UDF7": "string",
      "UDF8": "string",
      "UDF9": "string",
      "UDF10": "string",
      "UDF11": "string",
      "UDF12": "string",
      "UDF13": "string",
      "UDF14": "string",
      "UDF15": "string",
      "CUSTOMERSKU": "string",
      "FINALAPPROVALDATE": "2023-11-27T06:54:03.761Z",
      "PRINT_COUNT": 0,
      "EXPIRY_DATE": "2023-11-27T06:54:03.761Z",
      "PROCESS_TYPE": "string",
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
      "CC_MAKING": "string",
      "STONE_INCLUDED": true,
      "CAD_REQUIRED": true,
      "HEIGHT": "string",
      "RADIUS": "string",
      "LENGTH": "string",
      "COMPSIZE_CODE": "string",
      "COMPSET_CODE": "string",
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": true,
      "MKGCALC_GROSSWT": true,
      "PURITY": 0,
      "DESIGN_DESC": "string",
      "COST_CENTER_DESC": "string",
      "karat_Desc": "string",
      "SUPPLIER_DESC": "string",
      "CATEGORY_DESC": "string",
      "SUBCATEGORY_DESC": "string",
      "TYPE_DESC": "string",
      "BRAND_DESC": "string",
      "STYLE_DESC": "string",
      "RANGE_DESC": "string",
      "COUNTRY_DESC": "string",
      "UDF1_DESC": "string",
      "UDF2_DESC": "string",
      "UDF3_DESC": "string",
      "UDF4_DESC": "string",
      "UDF5_DESC": "string",
      "UDF6_DESC": "string",
      "UDF7_DESC": "string",
      "UDF8_DESC": "string",
      "UDF9_DESC": "string",
      "UDF10_DESC": "string",
      "UDF11_DESC": "string",
      "UDF12_DESC": "string",
      "UDF13_DESC": "string",
      "UDF14_DESC": "string",
      "UDF15_DESC": "string",
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
          "METALSTONE": "string",
          "DIVCODE": "string",
          "KARAT_CODE": "string",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "string",
          "CURRENCY_CODE": "string",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "STOCK_CODE": "string",
          "DESIGN_CODE": "string",
          "KARAT": "string",
          "PRICEID": "string",
          "SIZE_FROM":"string" ,
          "SIZE_TO": "string",
          "RATEFC": 0,
          "PART_CODE": "string",
          "DSIZE": "string",
          "LABCHGCODE": "string",
          "PRICECODE": "string",
          "DMMETALPERCENTAGE": 0,
          "DLABCHGCODE": "string",
          "DPRICECODE": "string",
          "METALPER": 0,
          "METALRATE": 0,
          "CURR_RATE": 0,
          "LABOURCODE": "string",
          "DETLINEREMARKS": "string",
          "PROCESS_TYPE": "string",
          "SIEVE_SET": "string",
          "STONE_TYPE": "string",
          "EXT_COLOR": "string",
          "EXT_CLARITY": "string",
          "D_REMARKS": "string",
          "POINTER_WT": 0,
          "SIEVE_FROM": "string",
          "SIEVE_TO": "string",
          "PURITY": 0,
          "OTHER_ATTR": "string"
        }
      ],
      "DESIGN_SEQUENCE_DETAILS_DJ": [
        {
          "DESIGN_CODE": "string",
          "SEQ_CODE": "string",
          "SEQ_NO": 0,
          "PROCESS_CODE": "string",
          "PROCESS_TYPE": "string",
          "CURRENCY_CODE": "string",
          "UNIT_RATE": 0,
          "UNIT": "string",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "string",
          "WIP_ACCODE": "string",
          "POINTS": 0,
          "DESCRIPTION": "string",
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ],
      "DESIGN_PARTS": [
        {
          "DESIGN_CODE": "string",
          "PART_CODE": "string",
          "PART_DESCRIPTION": "string",
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
          "PICTURE_NAME": "string",
          "PART_COLOR": "string"
        }
      ],
      "DESIGN_ATTRIBUTES": [
        {
          "DESIGN_CODE": "string",
          "ATTR_TYPE": "string",
          "ATTR_CODE": "string",
          "ATTR_DESCRIPTION": "string",
          "WEIGHT": 0,
          "PCS": 0,
          "ST_PCS": 0,
          "ST_WEIGHT": 0,
          "DEFAULT_CODE": true
        }
      ],
      "Picture_Attachment": [
        {
          "CODE": "string",
          "PICTURE_NAME": "string",
          "DEFAULTPICTURE": true,
          "TYPE": "string",
          "PICTURE_TYPE": "string",
          "PICTURE_PATHOLD": "string"
        }
      ],
      "METAL_STOCK_MASTER_VENDOR": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "string",
          "ACCODE": "string",
          "DEL_DAYS": 0,
          "CREDIT_DAYS": 0,
          "PAYMENT_MODE": "string",
          "VENDOR_DESIGN": "string",
          "DESCRIPTION": "string"
        }
      ],
      "DESIGN_LABOUR_SUMMARY": [
        {
          "DESIGN_CODE": "string",
          "CODE": "string",
          "DESCRIPTION": "string",
          "COST": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "SLNO": 0,
          "TYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "SHAPE": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "UNIT": "string",
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
  
    let API = 'DesignMaster/UpdateDesignMaster/'+this.content.DESIGN_CODE
    let postData = 
    {
      "DESIGN_CODE": "string",
      "DESIGN_DESCRIPTION": "string",
      "CURRENCY_CODE": "string",
      "CC_RATE": 0,
      "COST_CODE": "string",
      "TYPE_CODE": "string",
      "CATEGORY_CODE": "string",
      "SUBCATEGORY_CODE": "string",
      "BRAND_CODE": "string",
      "COUNTRY_CODE": "string",
      "SUPPLIER_CODE": "string",
      "SUPPLIER_REF": "string",
      "SET_REF": "string",
      "PICTURE_NAME": "string",
      //"PICTURE_NAME1": "string",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "string",
      "PRICE2PER": "string",
      "PRICE3PER": "string",
      "PRICE4PER": "string",
      "PRICE5PER": "string",
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
      "SHORT_ID": "string",
      "COLOR": "string",
      "CLARITY": "string",
      "SIZE": "string",
      "SIEVE": "string",
      "SHAPE": "string",
      "GRADE": "string",
      "FLUOR": "string",
      "FINISH": "string",
      "CERT_BY": "string",
      "CERT_NO": "string",
      "CERT_DATE": "2023-11-27T06:56:54.294Z",
      "GRIDLE": "string",
      "CULET": "string",
      "TWIDTH": 0,
      "CRHEIGHT": 0,
      "PAVDEPTH": 0,
      "OVERALL": "string",
      "MEASURE": "string",
      "CERT_PICTURE_NAME": "string",
      "TAG_LINES": "string",
      "COMMENTS": "string",
      "WATCH_TYPE": 0,
      "PEARL_TYPE": 0,
      "STRAP_TYPE": "string",
      "STRAP_COLOR": "string",
      "GW": 0,
      "MODEL_NO": "string",
      "MODEL_YEAR": 0,
      "OPENED_ON": "2023-11-27T06:56:54.294Z",
      "OPENED_BY": "string",
      "FIRST_TRN": "string",
      "LAST_TRN": "string",
      "MID": 0,
      "PRINTED": true,
      "PURVOCTYPE_NO": "string",
      "PURPARTY": "string",
      "PURDATE": "2023-11-27T06:56:54.294Z",
      "PURAMOUNT": 0,
      "PURBRLOC": "string",
      "SALVOCTYPE_NO": "string",
      "SALPARTY": "string",
      "SALDATE": "2023-11-27T06:56:54.294Z",
      "SALAMOUNT": 0,
      "SALBRLOC": "string",
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
      "MANF_BR_VOCTYPE_NO": "string",
      "WATCH_REFNO": "string",
      "WATCH_MODELNAME": "string",
      "WATCH_MODELNO": "string",
      "WATCH_MATERIAL": "string",
      "WATCH_DIALCOLOR": "string",
      "WATCH_BAZEL": "string",
      "WATCH_MOVEMENT": "string",
      "WATCH_STATUS": "string",
      "ITEM_IMAGE": "string",
      "DESIGN_HOLD": true,
      "DESIGN_EXCLUSSIVE": true,
      "JEWELLERY_SIZE": 0,
      "SIZE_UNIT": "string",
      "METAL_MAX_WT": 0,
      "METAL_MIN_WT": 0,
      "STONE_MAX_CT": 0,
      "STONE_MIN_CT": 0,
      "STONE_TOLARANCE": 0,
      "TOTAL_PROD_PCS": 0,
      "LAST_PROD_ON": "2023-11-27T06:56:54.294Z",
      "LAST_PROD_REF": "string",
      "LAST_CUST_ID": "string",
      "LAST_STOCK_ID": "string",
      "PENDING_JOB_PCS": 0,
      "PENDING_JOBS": 0,
      "LAST_COST": 0,
      "SEQ_CODE": "string",
      "SEQ_DESCRIPTION": "string",
      "EDITED_ON": "2023-11-27T06:56:54.294Z",
      "EDITED_BY": "string",
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
      "MODEL_MAKER": "string",
      "SKETCH_NAME": "string",
      "PROD_INSTRUCTION": "string",
      "LABOUR_FCCOST": 0,
      "MATERIAL_FCCOST": 0,
      "GROSS_WT": 0,
      "STONE_WT": 0,
      "GENDER": "string",
      "TAG_LINESWOENTER": "string",
      "PICTURE_NAME_THUMBNAIL": "string",
      "KARAT_CODE": "string",
      "PARTS": 0,
      "JOB_PREFIX": "string",
      "SETREF_PREFIX": "string",
      "DSURFACEPROPERTY": "string",
      "DREFERENCE": "string",
      "DWIDTH": 0,
      "DTHICKNESS": 0,
      "METAL_WT": 0,
      "CAD_DESIGNER": "string",
      "DESIGNER": "string",
      "INSTRUCTOR": "string",
      "FINAL_APPROVAL": "string",
      "TIME_CODE": "string",
      "RANGE_CODE": "string",
      "COMMENTS_CODE": "string",
      "STYLE": "string",
      "CHKCOMPONENTSUMMARY": "string",
      "CHKCOMPONENTDETAIL": "string",
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
      "LAST_EDT_BY": "string",
      "LAST_EDT_ON": "2023-11-27T06:56:54.294Z",
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
      "PAIR_REF": "string",
      "SURFACEPROPERTY": "string",
      "WIDTH": 0,
      "THICKNESS": 0,
      "ENGRAVING_TEXT": "string",
      "ENGRAVING_FONT": "string",
      "STYLEMASTER": "string",
      "PARENT_DSNG_CODE": "string",
      "FAULT_DETAILS": "string",
      "DESIGN_TYPE": "string",
      "JEWELLERY_UNIT": "string",
      "UDF1": "string",
      "UDF2": "string",
      "UDF3": "string",
      "UDF4": "string",
      "UDF5": "string",
      "UDF6": "string",
      "UDF7": "string",
      "UDF8": "string",
      "UDF9": "string",
      "UDF10": "string",
      "UDF11": "string",
      "UDF12": "string",
      "UDF13": "string",
      "UDF14": "string",
      "UDF15": "string",
      "CUSTOMERSKU": "string",
      "FINALAPPROVALDATE": "2023-11-27T06:56:54.294Z",
      "PRINT_COUNT": 0,
      "EXPIRY_DATE": "2023-11-27T06:56:54.294Z",
      "PROCESS_TYPE": "string",
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
      "CC_MAKING": "string",
      "STONE_INCLUDED": true,
      "CAD_REQUIRED": true,
      "HEIGHT": "string",
      "RADIUS": "string",
      "LENGTH": "string",
      "COMPSIZE_CODE": "string",
      "COMPSET_CODE": "string",
      "PROD_VARIANCE": 0,
      "METALCALC_GROSSWT": true,
      "MKGCALC_GROSSWT": true,
      "PURITY": 0,
      "DESIGN_DESC": "string",
      "COST_CENTER_DESC": "string",
      "karat_Desc": "string",
      "SUPPLIER_DESC": "string",
      "CATEGORY_DESC": "string",
      "SUBCATEGORY_DESC": "string",
      "TYPE_DESC": "string",
      "BRAND_DESC": "string",
      "STYLE_DESC": "string",
      "RANGE_DESC": "string",
      "COUNTRY_DESC": "string",
      "UDF1_DESC": "string",
      "UDF2_DESC": "string",
      "UDF3_DESC": "string",
      "UDF4_DESC": "string",
      "UDF5_DESC": "string",
      "UDF6_DESC": "string",
      "UDF7_DESC": "string",
      "UDF8_DESC": "string",
      "UDF9_DESC": "string",
      "UDF10_DESC": "string",
      "UDF11_DESC": "string",
      "UDF12_DESC": "string",
      "UDF13_DESC": "string",
      "UDF14_DESC": "string",
      "UDF15_DESC": "string",
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
          "METALSTONE": "string",
          "DIVCODE": "string",
          "KARAT_CODE": "string",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "string",
          "CURRENCY_CODE": "string",
          "RATE": 0,
          "AMOUNTFC": 0,
          "AMOUNTLC": 0,
          "MAKINGRATE": 0,
          "MAKINGAMOUNT": 0,
          "SIEVE": "string",
          "COLOR": "string",
          "CLARITY": "string",
          "SHAPE": "string",
          "STOCK_CODE": "string",
          "DESIGN_CODE": "string",
          "KARAT": "string",
          "PRICEID": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "RATEFC": 0,
          "PART_CODE": "string",
          "DSIZE": "string",
          "LABCHGCODE": "string",
          "PRICECODE": "string",
          "DMMETALPERCENTAGE": 0,
          "DLABCHGCODE": "string",
          "DPRICECODE": "string",
          "METALPER": 0,
          "METALRATE": 0,
          "CURR_RATE": 0,
          "LABOURCODE": "string",
          "DETLINEREMARKS": "string",
          "PROCESS_TYPE": "string",
          "SIEVE_SET": "string",
          "STONE_TYPE": "string",
          "EXT_COLOR": "string",
          "EXT_CLARITY": "string",
          "D_REMARKS": "string",
          "POINTER_WT": 0,
          "SIEVE_FROM": "string",
          "SIEVE_TO": "string",
          "PURITY": 0,
          "OTHER_ATTR": "string"
        }
      ],
      "DESIGN_SEQUENCE_DETAILS_DJ": [
        {
          "DESIGN_CODE": "string",
          "SEQ_CODE": "string",
          "SEQ_NO": 0,
          "PROCESS_CODE": "string",
          "PROCESS_TYPE": "string",
          "CURRENCY_CODE": "string",
          "UNIT_RATE": 0,
          "UNIT": "string",
          "NO_OF_UNITS": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "STD_LOSS": 0,
          "MIN_LOSS": 0,
          "MAX_LOSS": 0,
          "LOSS_ACCODE": "string",
          "WIP_ACCODE": "string",
          "POINTS": 0,
          "DESCRIPTION": "string",
          "TIMEON_PROCESS": true,
          "LABCHRG_PERHOUR": 0
        }
      ],
      "DESIGN_PARTS": [
        {
          "DESIGN_CODE": "string",
          "PART_CODE": "string",
          "PART_DESCRIPTION": "string",
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
          "PICTURE_NAME": "string",
          "PART_COLOR": "string"
        }
      ],
      "DESIGN_ATTRIBUTES": [
        {
          "DESIGN_CODE": "string",
          "ATTR_TYPE": "string",
          "ATTR_CODE": "string",
          "ATTR_DESCRIPTION": "string",
          "WEIGHT": 0,
          "PCS": 0,
          "ST_PCS": 0,
          "ST_WEIGHT": 0,
          "DEFAULT_CODE": true
        }
      ],
      "Picture_Attachment": [
        {
          "CODE": "string",
          "PICTURE_NAME": "string",
          "DEFAULTPICTURE": true,
          "TYPE": "string",
          "PICTURE_TYPE": "string",
          "PICTURE_PATHOLD": "string"
        }
      ],
      "METAL_STOCK_MASTER_VENDOR": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "STOCK_CODE": "string",
          "ACCODE": "string",
          "DEL_DAYS": 0,
          "CREDIT_DAYS": 0,
          "PAYMENT_MODE": "string",
          "VENDOR_DESIGN": "string",
          "DESCRIPTION": "string"
        }
      ],
      "DESIGN_LABOUR_SUMMARY": [
        {
          "DESIGN_CODE": "string",
          "CODE": "string",
          "DESCRIPTION": "string",
          "COST": 0,
          "STD_TIME": 0,
          "MAX_TIME": 0,
          "SLNO": 0,
          "TYPE": "string",
          "METHOD": "string",
          "DIVISION": "string",
          "SHAPE": "string",
          "SIZE_FROM": "string",
          "SIZE_TO": "string",
          "UNIT": "string",
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
  deleteRecord() {
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
