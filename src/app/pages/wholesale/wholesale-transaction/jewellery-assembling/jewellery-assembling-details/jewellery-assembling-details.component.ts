import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { JewelleryAssemblingMetalDetailsComponent } from '../jewellery-assembling-metal-details/jewellery-assembling-metal-details.component';
import { JewelleryAssemblingStonesDetailsComponent } from '../jewellery-assembling-stones-details/jewellery-assembling-stones-details.component';

@Component({
  selector: 'app-jewellery-assembling-details',
  templateUrl: './jewellery-assembling-details.component.html',
  styleUrls: ['./jewellery-assembling-details.component.scss']
})
export class JewelleryAssemblingDetailsComponent implements OnInit  {
  divisionMS: any = 'ID';
  currentDate = new Date();
  currentDate1 = new Date();
  currentDate2 = new Date()

  urls: string | ArrayBuffer | null | undefined;
  url: any;
  imageurl: any;
  image: string | ArrayBuffer | null | undefined;
  
  
  column1:any[] = ['Stock Code','Purity','PCS','Gross WT','Rate Type','Metal Type','Making Rate','Amount-FC','Amount-LC','MAKING_AMTFC','MAKING_AMTLC'];
  columnheader: any[] = ['UNIQUEID','SRNO','METALSTONE','STOCK_CODE','DIVECODE','KARAT','CARAT','GROSS_WT','PCS','RATE_TYPE','CURRENCY_CODE','MTST_RATE','MT_GMS_RATE','MAKING_RATE','AMOUNTFC','AMOUNTLC','SUPPLIER','STOCK_DOCDESC','HAMOUNTFC','DLOC_CODE','DNARRATION','MAIN_STOCK_CODE','SLNO','LABACCODE','LABCODE','LABAMOUNTFC','LABAMOUNTCC','LABRATEFC','LABRATECC','LABUNIT','LABDIVISION','DT_BRANCH_CODE','DT_VOCTYPE','DT_VOCNO','DT_YEARMONTH','PURITY','RATECURR','CURRRATE','PRICE1','CONVRATE','BASE_CONV_RATE','ISSUE_NO','ISSUE_MID','MAKING_AMTFC','MAKING_AMTLC','DESIGN_CODE','PURE_WT','STONE_TYPE','SHAPE','COLOR','CLARITY','SIEVE',,'DSIZE','SIEVE_SET','SIZE_CODE','METALGROSSWT','DIAPCS','DIACARAT','STONEPCS','STONECARAT','METAL_WT','MASTERFINEGOLD','DIAMOND_RATEFC','DIAMOND_RATELC','DIAMOND_VALUEFC','DIAMOND_VALUELC','COLORSTONE_RATEFC','COLORSTONE_RATELC','COLORSTONE_VALUEFC','COLORSTONE_VALUELC','LABOUR_CHARGEFC',
                        'LABOUR_CHARGELC','HMCHARGEFC','HMCHARGELC','CERTCHARGEFC','CERTCHARGELC','WASTAGE','WASTAGEPER','WASTAGEAMOUNTFC','WASTAGEAMOUNTLC','PEARL_PCS','PEARL_WT','PEARL_RATEFC','PEARL_RATELC','PEARL_AMOUNTFC','PEARL_AMOUNTLC','METALRATEFC','METALRATELC','METALAMOUNTFC','METALAMOUNTLC','FIXED'];

                     
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private datePipe: DatePipe
  ) { 
    // this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
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

  jewelleryAssemblingDetailsForm: FormGroup = this.formBuilder.group({
    rateType:[''],
    rateTypeDesc:[''],
    unFixMetal:[''],
    stock:[''],
    location:[''],
    type:[''],
    CC:[''],
    design:[''],
    brand:[''],
    setRef:[''],
    category:[''],
    country:[''],
    subCategory:[''],
    color:[''],
    pieces:[''],
    clarity:[''],
    vender:[''],
    grade:[''],
    venderRef:[''],
    shape:[''],
    size:[''],
    range:[''],
    style:[''],
    time:[''],
    grossWt:[''],
    fluoresce:[''],
    priceSheme:[''],
    priceShemeDesc:[''],
    price1:[''],
    price1Desc:[''],
    price1Detail:[''],
    price2:[''],
    price2Desc:[''],
    price2Detail:[''],
    price3:[''],
    price3Desc:[''],
    price3Detail:[''],
    price4:[''],
    price4Desc:[''],
    price4Detail:[''],
    price5:[''],
    price5Desc:[''],
    price5Detail:[''],
    metalTotal:[''],
    metalTotalDesc:[''],
    metalTotalDetail:[''],
    stoneTotal:[''],
    stoneTotalDesc:[''],
    stoneTotalDetail:[''],
    otherTotal:[''],
    otherTotalDesc:[''],
    remarks:[''],
    tagdetails:[''],
    settingOfCharges1:[''],
    settingOfCharges2:[''],
    settingOfCharges3:[''],
    polishingCharges1:[''],
    polishingCharges2:[''],
    polishingCharges3:[''],
    rhodiumCharges1:[''],
    rhodiumCharges2:[''],
    rhodiumCharges3:[''],
    labourCharges1:[''],
    labourCharges2:[''],
    labourCharges3:[''],
    MISCCharges1:[''],
    MISCCharges2:[''],
    MISCCharges3:[''],
    total:[''],
    total1:[''],
    total2:[''],
    startDate:[''],
    finishDate:[''],
    goldSmith:[''],
    goldSmith1:[''],
    goldSmith2:[''],
    stoneSetter:[''],
    stoneSetter1:[''],
    stoneSetter2:[''],
    createdBy:[''],
    On:[''],
    cost1:[''],
    cost2:[''],
    marginac:[''],
    marginac1:[''],
    margin1:[''],
    margin2:[''],
    margin3:[''],
    description:[''],
  });

  
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  stockSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.stock.setValue(e.STOCK_CODE);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: 'Location',
    SEARCH_HEADING: 'location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Location<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  locationSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.location.setValue(e.Location);
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

  typeSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.type.setValue(e.CODE);
  }

  CCCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'CC Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  CCSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.CC.setValue(e.CODE);
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

  designSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.design.setValue(e.DESIGN_CODE);
  }

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 32,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  brandSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.brand.setValue(e.CODE);
  }

  setRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  setRefSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.setRef.setValue(e.CODE);
  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  categorySelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.category.setValue(e.CODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  countrySelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.country.setValue(e.CODE);
  }

  subCategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sub Category Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  subCategorySelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.subCategory.setValue(e.CODE);
  }

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  colorSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.color.setValue(e.CODE);
  }

  piecesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Pieces Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  piecesSelected(e:any){
    this.jewelleryAssemblingDetailsForm.controls.pieces.setValue(e.CODE);
  }

clarityCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 37,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Clarity Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

claritySelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.clarity.setValue(e.CODE);
}

venderCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 81,
  SEARCH_FIELD: 'ACCODE',
  SEARCH_HEADING: 'Vender Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "ACCODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

venderSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.vendor.setValue(e.ACCODE);
}

gradeCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Grade Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

gradeSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.grade.setValue(e.CODE);
}

venderRefCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'CC Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

venderRefSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.venderRef.setValue(e.CODE);
}

shapeCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 33,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'CC Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

shapeSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.shape.setValue(e.CODE);
}

sizeCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 36,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Stock Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

sizeSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.size.setValue(e.CODE);
}

rangeCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Stock Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

rangeSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.range.setValue(e.CODE);
}

styleCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Stock Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

styleSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.style.setValue(e.Code);
}

timeCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Stock Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

timeSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.time.setValue(e.CODE);
}

fluoresceCodeData: MasterSearchModel = {
  PAGENO: 1,
  RECORDS: 10,
  LOOKUPID: 3,
  SEARCH_FIELD: 'CODE',
  SEARCH_HEADING: 'Stock Code',
  SEARCH_VALUE: '',
  WHERECONDITION: "CODE<> ''",
  VIEW_INPUT: true,
  VIEW_TABLE: true,
}

fluoresceSelected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.fluoresce.setValue(e.CODE);
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

price1Selected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.price1.setValue(e.PRICE_CODE);
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

price2Selected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.price2.setValue(e.PRICE_CODE);
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

price3Selected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.price3.setValue(e.PRICE_CODE);
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

price4Selected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.price4.setValue(e.PRICE_CODE);
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

price5Selected(e:any){
  this.jewelleryAssemblingDetailsForm.controls.price5.setValue(e.PRICE_CODE);
}

  setInitialDatas() {

    this.jewelleryAssemblingDetailsForm.controls.vocDate.setValue(this.commonService.currentDate)

  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openJewelleryAssembilingMetalDetails(){
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAssemblingMetalDetailsComponent,{
      size: "xl",
      backdrop: true, //'static'
      keyboard: false,
      windowClass: "modal-full-width",
    });
  }

  openJewelleryAssembilingStoneDetails(){
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAssemblingStonesDetailsComponent,{
      size: "xl",
      backdrop: true, //'static'
      keyboard: false,
      windowClass: "modal-full-width",
    });
  }

  deleteTableData(){

  }

}
