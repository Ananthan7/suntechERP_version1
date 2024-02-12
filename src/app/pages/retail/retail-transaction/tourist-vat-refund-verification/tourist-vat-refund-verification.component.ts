import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-tourist-vat-refund-verification',
  templateUrl: './tourist-vat-refund-verification.component.html',
  styleUrls: ['./tourist-vat-refund-verification.component.scss']
})
export class TouristVatRefundVerificationComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['Sr.No','VOCDATE',' TRS No',' VOC TYPE','VOC NO','Sales Amt','Planet Amt','VAT Amt','Planet Vat Amt'];


  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: '',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> '",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }


  touristVatRefundVerificationForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocTypeNo:[1],
    vocDate: [''],
    partyCode:[''],
    partycodeName:[''],
    partyCurrency: [''],
    partyCurrencyRate: [''],
    enteredBy:[''],
    enteredByCode: [''],
    fromDate:[''],
    toDate: [''],
    partyAddress: [''],
    narration:[''],
    totalSale: [''],
    totalVat:[''],    
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.touristVatRefundVerificationForm.controls.vocDate.setValue(this.currentDate);
    this.touristVatRefundVerificationForm.controls.fromDate.setValue(this.currentDate);
    this.touristVatRefundVerificationForm.controls.toDate.setValue(this.currentDate);
    this.touristVatRefundVerificationForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }

  enteredBySelected(e: any) {
    console.log(e);
    this.touristVatRefundVerificationForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
    this.touristVatRefundVerificationForm.controls.enteredByCode.setValue(e.DESCRIPTION);
    
  }

  partyCodeSelected(e: any) {
    console.log(e);
    this.touristVatRefundVerificationForm.controls.partyCode.setValue(e.ACCODE);
    this.touristVatRefundVerificationForm.controls.partycodeName.setValue(e.ACCOUNT_MODE);
  }

  partyCurrencyCodeSelected(e: any) {
    console.log(e);
    
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
