import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling-details/jewellery-assembling-details.component';


@Component({
  selector: 'app-jewellery-assembling',
  templateUrl: './jewellery-assembling.component.html',
  styleUrls: ['./jewellery-assembling.component.scss']
})
export class JewelleryAssemblingComponent implements OnInit {

  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead: any[] = ['MID','BRANCH_CODE','VOCTYPE','VOCNO','YEARMONTH','ITEM','STOCK_CODE','STOCK_DESCRIPTION','CURRENCY_CODE','CC_RATE','COST_CODE','TYPE_CODE','CATEGORY_CODE','SUBCATEGORY_CODE','BRAND_CODE','COUNTRY_CODE','DESIGN_CODE','SET_REF','PICTURE_NAME','STOCK_FCCOST','STOCK_LCCOST','PRICE1PER','PRICE2PER','PRICE3PER','PRICE4PER','PRICE5PER','PRICE1FC','PRICE2FC','PRICE3FC','PRICE4FC','PRICE1LC','PRICE2LC','PRICE3LC','PRICE4LC','PRICE5FC','PRICE5LC','CHARGE1FC','CHARGE1LC','CHARGE2FC','CHARGE2LC','CHARGE3FC','CHARGE3LC','CHARG4FC','CHARGE4LC','CHARGE5FC','CHARGE5LC','CHARGE1ACCODE','CHARGE2ACCODE','CHARGE3ACCODE','CHARGE4ACCODE','CHARGE5ACCODE','TAG_LINES',,'OPENED_ON','OPENED_BY','PCS','COLOR','NAVSEQNO','MARGINACCODE','MARGINPER','MARGINMTFC','MARGINMTCC','STARTDATE','FINISHDATE','GOLDSMITH','STONESETTER','HLOC_CODE','REMARKS','SUPPLIER_REF','MWATCH_SERIALNO','STRAP_TYPE','STRAP_COLOR',
                        'MODEL_NO','MODEL_YEAR','MODEL_NAME','DIAL_COLOR','BAZEL','METERIAL','STATUS','WEIGHT','STONE_TYPE','SIZE','REFNO','DIAL_SHAPE','SR_NO','MGRADE','MSHAPE','CERT_BY','CERT_NO','CERT_DATE','FLOOR','CLARITY','D2DTRANACTIONS','MANUFCUSTOMERSKU','LABOUR1','LABOUR2','LABOUR3','LABOUR4','LABOUR5','REFMID','SRNO','VENDOR_REF','GOLDMITHNAME','STONESETTERNAME','MARGINACCODEDISC','TOTAL_METAL_QTY','TOTAL_STONE_QTY','TOTAL_METAL_FC','TOTAL_STONE_FC','TOTAL_OTHER_FC','TOTAL_METAL_LC','TOTAL_STONE_LC','TOTAL_OTHER_LC','TOTAL_CHARGE_FC','TOTAL_CHARGE_LC','COSTFC','COSTLC','AUTOPOSTING','POSTDATE','BASE_CURRENCY','BASE_CURR_RATE','BASE_CONV_RATE','SUPPLIER_CODE','SYSTEM_DATE','PRINT_COUNT','STYLE','TIME_CODE','RANGE_CODE','DT_BRANCH_CODE','DT_VOCTYPE','DT_VOCTYPE','DT_YEARMONTH','SALESPERSON_CODE','POSGROSSWT','PERFIX_CODE','PURITY','METALGROSSWT','DIAPCS','DIACARAT','STONEPCS','STONECARAT','METAL_WT',
                        'FINEGOLD','MASTERFINEGOLD','DIAMOND_RATEFC','DIAMOND_RATELC','DIAMOND_VALUEFC','DIAMOND_VALUELC','COLORSTONE_RATEFC','COLORSTONE_RATELC','COLORSTONE_VALUEFC','COLORSTONE_VALUELC','LABOUR_CHARGEFC','LABOUR_CHARGELC','HMCHARGEFC','HMCHARGELC','CERTCHARGEFC','CERTCHARGELC','WASTAGE','WASTAGEPER','WASTAGEAMOUNTFC','WASTAGEAMOUNTLC','PEARL_PCS','PEARL_AMTFC','PEARL_AMTLC','METALRATELC','METALRATEFC','METALAMOUNTLC','METALAMOUNRFC','PERAL_RATEFC','PERAL_RATELC','FIXED','UDF1','UDF2','UDF3','UDF4','UDF5','UDF6','UDF7','UDF8','UDF9','UDF10','UDF11','UDF12','UDF13','UDF14','UDF15','PRINT_COUNT_ACCOPY','PRINT_COUNT_CNTLCOPY','HTUSERNAME','CHARGE6ACCODE','CHARGE7ACCODE','CHARGE7ACCODE','CHARGE8ACCODE','CHARGE9ACCODE','CHARGE10ACCODE','CHARGE6FC','CHARGE6LC','CHARGE6FC','CHARGE6LC','CHARGE7FC','CHARGE7LC','CHARGE8FC','CHARGE8LC','CHARGE9FC','CHARGE9LC','CHARGE10FC','CHARGE10LC','PLAT_ACCODE','CERT_ACCODE']

 columnheader: any[] = ['UNIQUEID','SRNO','METALSTONE','STOCK_CODE','DIVECODE','KARAT','CARAT','GROSS_WT','PCS','RATE_TYPE','CURRENCY_CODE','MTST_RATE','MT_GMS_RATE','MAKING_RATE','AMOUNTFC','AMOUNTLC','SUPPLIER','STOCK_DOCDESC','HAMOUNTFC','DLOC_CODE','DNARRATION','MAIN_STOCK_CODE','SLNO','LABACCODE','LABCODE','LABAMOUNTFC','LABAMOUNTCC','LABRATEFC','LABRATECC','LABUNIT','LABDIVISION','DT_BRANCH_CODE','DT_VOCTYPE','DT_VOCNO','DT_YEARMONTH','PURITY','RATECURR','CURRRATE','PRICE1','CONVRATE','BASE_CONV_RATE','ISSUE_NO','ISSUE_MID','MAKING_AMTFC','MAKING_AMTLC','DESIGN_CODE','PURE_WT','STONE_TYPE','SHAPE','COLOR','CLARITY','SIEVE',,'DSIZE','SIEVE_SET','SIZE_CODE','METALGROSSWT','DIAPCS','DIACARAT','STONEPCS','STONECARAT','METAL_WT','MASTERFINEGOLD','DIAMOND_RATEFC','DIAMOND_RATELC','DIAMOND_VALUEFC','DIAMOND_VALUELC','COLORSTONE_RATEFC','COLORSTONE_RATELC','COLORSTONE_VALUEFC','COLORSTONE_VALUELC','LABOUR_CHARGEFC',
                        'LABOUR_CHARGELC','HMCHARGEFC','HMCHARGELC','CERTCHARGEFC','CERTCHARGELC','WASTAGE','WASTAGEPER','WASTAGEAMOUNTFC','WASTAGEAMOUNTLC','PEARL_PCS','PEARL_WT','PEARL_RATEFC','PEARL_RATELC','PEARL_AMOUNTFC','PEARL_AMOUNTLC','METALRATEFC','METALRATELC','METALAMOUNTFC','METALAMOUNTLC','FIXED'];

  jewelleryAssemblingForm: FormGroup = this.formBuilder.group({

    branch:[''],
    vocType:['UFM'],
    vocNo:['1'],
    vocDate:[''],
    unFixMetal:[false],
    partyCode:[''],
    rateCode:[''],
    rateDescription:[''],
    itemCurrencyCode:[''],
    itemCurrencyDesc:[''],
    enteredBy:[''],
    enteredByDesc:[''],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }
  setInitialDatas() {

    this.jewelleryAssemblingForm.controls.vocDate.setValue(this.comService.currentDate)

  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'PARTYCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PARTYCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  partyCodeSelected(e:any){
    this.jewelleryAssemblingForm.controls.partyCode.setValue(e.PARTYCODE);
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Entry Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredBySelected(e:any){
    this.jewelleryAssemblingForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
  }


  openJewelleryAssembilingDetails(){
    const modalRef: NgbModalRef = this.modalService.open(JewelleryAssemblingDetailsComponent,{
      size: "xl",
      backdrop: true, //'static'
      keyboard: false,
      windowClass: "modal-full-width",
    });
  
  }

  deleteTableData(){}

  formSubmit(){

  }



}
