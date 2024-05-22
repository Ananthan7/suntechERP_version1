import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-component-master',
  templateUrl: './component-master.component.html',
  styleUrls: ['./component-master.component.scss']
})
export class ComponentMasterComponent implements OnInit {

  @Input() content!: any;
  tableData: any[] = [];
  selectedIndexes: any = [];
  columnhead: any[] = ['Srno', 'Div.', 'Stock Code', 'Karat', 'Stock Type', 'Pcs', 'Wt/Ct', 'Color', 'Clarity', 'Shape', 'Sieve Std.', 'Description', 'Size', 'Process Type', 'Remarks', 'Pointer Wt', 'Ext.Clarity', 'Sieve From', 'Description', 'Sieve To', 'Description']
  columnhead2: any[] = ['',]
  selectedTabIndex = 0;
  urls: string | ArrayBuffer | null | undefined;
  url: any;
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  codeEnable: boolean = true;
  viewMode: boolean = false;
  editMode: boolean = false;
  editableMode: boolean = false;
  viewDisable: boolean = false;

  images: any[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {

   // this.images = ['assets/images/transparentImg.png'];

    if (this.content.FLAG == 'VIEW') {

      this.setFormValues();
      this.viewMode = true;
      this.viewDisable = true;
    } else (this.content.FLAG == 'EDIT')
    {
   
      this.setFormValues();
      this.editableMode = true;
      this.editMode = true;
      
    }

    let CURRENCY_CODE = this.commonService.getCompanyParamValue('COMPANYCURRENCY')
    this.componentmasterForm.controls.currencyCode.setValue(CURRENCY_CODE);
    let currrate = this.commonService.getCurrRate(CURRENCY_CODE)
    this.componentmasterForm.controls.currencyRate.setValue(currrate);
    
  }

 


  divisionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "division='M'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(value: any, data: any, controlName: string) {
    console.log('Data ', data);
    console.log('values ', value);

    this.tableData[data.data.SRNO - 1].DIVCODE = value.DIVISION_CODE;

    this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${value.DIVISION_CODE}' and SUBCODE = '0'`;

  }


  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Type',
    SEARCH_VALUE: '',
     //WHERECONDITION: `DIVISION_CODE = '${this.componentmasterForm.value.metalDivision}' and SUBCODE = '0'`,
    // WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  stockCodeDataSelected(value: any, data: any, controlName: string) {
    console.log(data);
    console.log(value);

    this.tableData[data.data.SRNO - 1].STOCK_CODE = value.STOCK_CODE;
  //  this.stockCodeData.WHERECONDITION = `DIVCODE = '${this.componentmasterForm.value.metalDivision}' and SUBCODE = '0'`;
  }






  private subscriptions: Subscription[] = [];

  componentmasterForm: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    codedes: ["", [Validators.required]],
    sizeSet: [""],
    size: [""],
    type: [""],
    category: [""],
    shape: [""],
    settingType: [""],
    remarks: [""],
    height: [""],
    length: [""],
    width: [""],
    radius: [""],
    processSeq: [""],
    costCenter: [""],
    currencyCode: [""],
    currencyRate: [""],
   
  });

  codeEnabled() {
    if (this.componentmasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }

  checkCode(): boolean {
    if (this.componentmasterForm.value.code == '') {
      this.commonService.toastErrorByMsgId('please enter code')
      return true
    }
    return false
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category type',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.category.setValue(e.CODE);
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
  karatCodeSelected(value: any, data: any, controlName: string){
    if (this.checkCode()) return
    this.tableData[data.data.SRNO - 1].CARAT = value.KARAT_CODE;
    //this.componentmasterForm.controls.karat.setValue(e.KARAT_CODE);
  }

  codeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Prefix master',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE = '1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  
  codeCodeSelected(e: any) {
    console.log(e);
    const prefixCode = e.PREFIX_CODE.toUpperCase();
    const des = e.DESCRIPTION.toUpperCase();
    this.componentmasterForm.controls.code.setValue(prefixCode);
    this.componentmasterForm.controls.codedes.setValue(des);
  }

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SETTING TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e: any) {
    if (this.checkCode()) return
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
  sizeSetCodeSelected(e: any) {
    if (this.checkCode()) return
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
    WHERECONDITION: "COMPSIZE_CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  sizeCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);

    const apiDescription = e.DESCRIPTION;

    // Split the DESCRIPTION string into an array using the ',' delimiter
    const descriptionArray = apiDescription.split(',');


    // Assign values to variables
    let height, width, length, radius;


    height = descriptionArray[0];
    width = descriptionArray[2];
    length = descriptionArray[1];
    radius = descriptionArray[3];


    console.log("Height:", height);
    console.log("Width:", width);
    console.log("Length:", length);
    console.log("Radius:", radius);



    const finalHeight = this.commonService.dataSplitPop(height);
    const finalWidth = this.commonService.dataSplitPop(width);
    const finalLength = this.commonService.dataSplitPop(length);
    const finalRadius = this.commonService.dataSplitPop(radius);


    this.componentmasterForm.controls.size.setValue(e.COMPSIZE_CODE);
    this.componentmasterForm.controls.height.setValue(finalHeight);
    this.componentmasterForm.controls.length.setValue(finalWidth);
    this.componentmasterForm.controls.width.setValue(finalLength);
    this.componentmasterForm.controls.radius.setValue(finalRadius);
  }

  // dataSplitPop(data:any){

  //   const result = data.split('');
  //   result.shift();
  //   result.pop();

  //   let heightValue = result.join("");
  //   console.log(heightValue);
  //   return heightValue;

  // }

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: " TYPES='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  shapeCodeSelected(e: any) {
    if (this.checkCode()) return
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
    WHERECONDITION: "TYPES = 'SETTING MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  settingTypeCodeSelected(e: any) {
    if (this.checkCode()) return
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
  processSeqCodeSelected(e: any) {
    if (this.checkCode()) return
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
    WHERECONDITION: "TYPE = 'PRECIOUS STONES'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  costCenterCodeSelected(e: any) {
    if (this.checkCode()) return
    console.log(e);
    this.componentmasterForm.controls.costCenter.setValue(e.COST_CODE);
  }



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 

  addTableData() {
    let length = this.tableData.length;

    let srno = length + 1;
    let data = {
      "SRNO": srno,
      "DIVCODE": "",
      "STOCK_CODE": "",
      "CARAT": "",
      "STOCK_FCCOST": "",
      "PCS": "",
      "GROSS_WT": "",
      "COLOR": "",
      "CLARITY": "",
      "SHAPE": "",
      "SIEVE": "",
      "DESCRIPTION": "",
      "DSIZE": "",
      "PROCESS_TYPE": "",
      "D_REMARKS": "",
      "POINTER_WT": "",
      "EXT_Color": "",
      "EXT_CLARITY": "",
      "SIEVE_FROM": "",
      "SIEVE_TO": "",
    
    };
    this.tableData.push(data);
    this.tableData.filter((data, i) => data.SRNO = i + 1)
  }

  onSelectionChanged(event: any) {
    const values: number[] = event.selectedRowKeys;
    const indexes: number[] = [];

    values.forEach((selectedValue: number) => {
      const index = this.tableData.findIndex(item => parseFloat(item.SRNO) === selectedValue);

      // Check if the value is not already in the selectedIndexes array
      if (index !== -1 && !this.selectedIndexes.includes(index)) {
        indexes.push(index);
      }
    });

    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }


//   deleteTableData() {
//     console.log(this.selectedIndexes);
//     if (this.selectedIndexes.length > 0) {
//         this.selectedIndexes.sort((a:number, b:number) => b - a);

//         this.selectedIndexes.forEach((indexToRemove:number) => {
//             this.tableData.splice(indexToRemove, 2);
//         });
//         this.selectedIndexes = [];
//     } else {
//         this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
//     }
// }

deleteTableData() {
  console.log('Selected indexes:', this.selectedIndexes);
  if (this.selectedIndexes.length > 0) {
      this.selectedIndexes.sort((a: number, b: number) => b - a);

      console.log('Before deletion - tableData:', this.tableData);

      this.selectedIndexes.forEach((indexToRemove: number) => {
          console.log('Deleting index:', indexToRemove);
          this.tableData.splice(indexToRemove,2);
      });

      console.log('After deletion - tableData:', this.tableData);

      this.selectedIndexes = [];
  } else {
      this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
  }
}



setFormValues() {
  if (!this.content) return

  this.componentmasterForm.controls.code.setValue(this.content.DESIGN_CODE)
  this.componentmasterForm.controls.codedes.setValue(this.content.DESIGN_DESCRIPTION)
  this.componentmasterForm.controls.sizeSet.setValue(this.content.SIZE_FROM)
  this.componentmasterForm.controls.size.setValue(this.content.SIZE)
 // this.componentmasterForm.controls.sieve_to.setValue(this.content.SIEVE)
  this.componentmasterForm.controls.type.setValue(this.content.TYPE_CODE)
  this.componentmasterForm.controls.category.setValue(this.content.CATEGORY_CODE)
  this.componentmasterForm.controls.shape.setValue(this.content.SHAPE)
  this.componentmasterForm.controls.settingType.setValue(this.content.SET_REF)
  this.componentmasterForm.controls.remarks.setValue(this.content.D_REMARKS)
  this.componentmasterForm.controls.height.setValue(this.content.HEIGHT)
  this.componentmasterForm.controls.length.setValue(this.content.LENGTH)
  this.componentmasterForm.controls.width.setValue(this.content.WIDTH)
  this.componentmasterForm.controls.radius.setValue(this.content.RADIUS)
  this.componentmasterForm.controls.processSeq.setValue(this.content.SEQ_CODE)
  this.componentmasterForm.controls.costCenter.setValue(this.content.COST_CODE)
  this.componentmasterForm.controls.currencyCode.setValue(this.content.CURRENCY_CODE)
  this.componentmasterForm.controls.currencyRate.setValue(this.content.CC_RATE)

}

  setPostData() {

    let postData = {
      "DESIGN_CODE": this.componentmasterForm.value.code || "",
      "DESIGN_DESCRIPTION": this.componentmasterForm.value.codedes || "",
      "CURRENCY_CODE": "AED",
      "CC_RATE": this.commonService.emptyToZero(this.componentmasterForm.value.currencyRate),
      "COST_CODE": this.componentmasterForm.value.costCenter || "",
      "TYPE_CODE": this.componentmasterForm.value.type,
      "CATEGORY_CODE": this.componentmasterForm.value.category || "",
      "SUBCATEGORY_CODE": "",
      "BRAND_CODE": "",
      "COUNTRY_CODE": "",
      "SUPPLIER_CODE": "",
      "SUPPLIER_REF": "",
      "SET_REF": this.componentmasterForm.value.settingType,
      "PICTURE_NAME": "",
      "PICTURE_NAME1": "",
      "STOCK_FCCOST": 0,
      "STOCK_LCCOST": 0,
      "PRICE1PER": "",
      "PRICE2PER": "",
      "PRICE3PER": "",
      "PRICE4PER": "",
      "PRICE5PER": "",
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
      "COLOR": "",
      "CLARITY": "",
      "SIZE": this.componentmasterForm.value.size ,
      "SIEVE": "",
      "SHAPE": this.componentmasterForm.value.shape ,
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
      "ITEM_IMAGE": '',
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
      "SEQ_CODE": this.componentmasterForm.value.processSeq,
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
      "METAL_WT": 0,
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
      "PAIR_REF": "",
      "SURFACEPROPERTY": "",
      "WIDTH": this.componentmasterForm.value.width,
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
      "HEIGHT": this.componentmasterForm.value.height,
      "RADIUS": this.componentmasterForm.value.radius,
      "LENGTH": this.componentmasterForm.value.length,
      "COMPSIZE_CODE": this.componentmasterForm.value.size,
      "COMPSET_CODE": this.componentmasterForm.value.sizeSet,
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
      "REQ_METAL_TYPE": false,
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
          "METALSTONE": "5",
          "DIVCODE": "c",
          "KARAT_CODE": "",
          "CARAT": 0,
          "GROSS_WT": 0,
          "PCS": 0,
          "RATE_TYPE": "",
          "CURRENCY_CODE": "AED",
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
          "SIZE_FROM":  this.componentmasterForm.value.sizeSet,
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
          "D_REMARKS":  this.componentmasterForm.value.remarks,
          "POINTER_WT": 0,
          "SIEVE_FROM": "",
          "SIEVE_TO":"" ,
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
    return postData
  }
  formSubmit() {

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.componentmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'DesignMaster/InsertDesignMaster'
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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

  update() {
    if (this.componentmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'DesignMaster/UpdateDesignMaster/' + this.content.DESIGN_CODE
    let postData = this.setPostData()


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

  validateLookupField(event: any,LOOKUPDATA: MasterSearchModel,FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
    }
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(API,param)
      .subscribe((result) => {
        
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if(data.length==0){
          this.commonService.toastErrorByMsgId('MSG1531')
          this.componentmasterForm.controls[FORMNAME].setValue('')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }  


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

  stockType(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].STOCK_FCCOST = data.target.value;
  }
  pcstemp(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].PCS = data.target.value;
  }
  wtCtt(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].GROSS_WT = data.target.value;
  }
  color(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].COLOR = data.target.value;
  }
  clarity(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].CLARITY = data.target.value;
  }
  shape(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SHAPE = data.target.value;
  }
  sieve(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE = data.target.value;
  }
  description(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].DESCRIPTION = data.target.value;
  }
  size(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].DSIZE = data.target.value;
  }
  processType(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].PROCESS_TYPE = data.target.value;
  }
  remark(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].D_REMARKS = data.target.value;
  }
  pointerWt(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].POINTER_WT = data.target.value;
  }
  extClarity(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].EXT.CLARITY = data.target.value;
  }
  sieveFrom(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE_FROM = data.target.value;
  }
  sieveTo(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].SIEVE_TO = data.target.value;
  }
  extColor(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].EXT_Color = data.target.value;
  }


}
