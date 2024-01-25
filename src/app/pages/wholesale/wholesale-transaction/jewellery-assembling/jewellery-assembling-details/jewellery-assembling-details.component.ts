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
  
  jewelleryAssemblingDetailsForm: FormGroup = this.formBuilder.group({

    branch:['HO'],
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

  setInitialDatas() {

    this.jewelleryAssemblingDetailsForm.controls.vocDate.setValue(this.commonService.currentDate)

  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}
