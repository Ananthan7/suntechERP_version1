import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})
export class ComponentMasterComponent implements OnInit {

  @Input() content!: any; 
  tableData: any[] = [];

  columnhead: any[] = ['Srno','Div.','Stock Code','Karat','Stock Type','Pcs','Wt/Ct','Color','Clarity','Shape','Sieve Std.','Description','Size','Process Transaction','Remarks',]
  columnhead2: any[] = ['',]
  selectedTabIndex = 0;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
   
  }

  private subscriptions: Subscription[] = [];

  componentmasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    codedes: [""],
    sizeSet : [""],
    size: [""],
    type : [""],
    category: [""],
    shape: [""],
    settingType: [""],
    remarks : [""],
    height : [""],
    length  : [""],
    width  : [""],
    radious  : [""],
    processSeq : [""],
    costCenter  : [""],
  });
  
  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.category.setValue(e.CODE);
  }

  codeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix master',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,    
    LOAD_ONCLICK: true,
  }
  codeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.code.setValue(e.PREFIX_CODE);
    this.componentmasterForm.controls.codedes.setValue(e.DESCRIPTION); 
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.type.setValue(e.CODE);
  }

  sizeSetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 90,
    SEARCH_FIELD: 'COMPSET_CODE',
    SEARCH_HEADING: 'Size set',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSET_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeSetCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.sizeSet.setValue(e.COMPSET_CODE);
  }

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 89,
    SEARCH_FIELD: 'COMPSIZE_CODE',
    SEARCH_HEADING: 'Size',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSIZE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sizeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.size.setValue(e.COMPSIZE_CODE);
  }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.shape.setValue(e.CODE);
  }

  settingTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Setting Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  settingTypeCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.settingType.setValue(e.CODE);
  }

  processSeqCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 93,
    SEARCH_FIELD: 'SEQ_CODE',
    SEARCH_HEADING: 'Sequence ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SEQ_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  processSeqCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.processSeq.setValue(e.SEQ_CODE);
  }

  costCenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: 'COST_CODE',
    SEARCH_HEADING: 'Cost Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterCodeSelected(e:any){
    console.log(e);
    this.componentmasterForm.controls.costCenter.setValue(e.COST_CODE);
  }
  


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  addTableData(){

  }

  deleteTableData(){


  }


  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.componentmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'DesignMaster/InsertDesignMaster'
    let postData = {
      "DESIGN_CODE": this.componentmasterForm.value.code || "",
      "DESIGN_DESCRIPTION":  this.componentmasterForm.value.codedes || "",
      "CURRENCY_CODE": "string",
      "CC_RATE": 0,
      "COST_CODE": this.componentmasterForm.value.costCenter|| "",
      "TYPE_CODE": this.componentmasterForm.value.type|| "",
      "CATEGORY_CODE": this.componentmasterForm.value.category|| "",
      "SUBCATEGORY_CODE": "string",
      "BRAND_CODE":  "string",
      "COUNTRY_CODE":  "string",
      "SUPPLIER_CODE": "string",
      "SUPPLIER_REF": "string",
      "SET_REF":"string",
      "PICTURE_NAME": "string",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "",
      "PRICE2PER":"string",
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
      "COLOR":  "string",
      "CLARITY": "string",
      "SIZE":  this.componentmasterForm.value.size || "",
      "SIEVE":  "string",
      "SHAPE":  this.componentmasterForm.value.shape || "",
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
                this.componentmasterForm.reset()
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
    if (this.componentmasterForm.invalid) {
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
      "PICTURE_NAME1": "string",
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
                this.componentmasterForm.reset()
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
                    this.componentmasterForm.reset()
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
                    this.componentmasterForm.reset()
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
