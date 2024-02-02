import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PosPurchaseDirectDetailComponent } from './pos-purchase-direct-detail/pos-purchase-direct-detail.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { PosCustomerMasterComponent } from '../common/pos-customer-master/pos-customer-master.component';
import { PosCustomerMasterMainComponent } from '../../retail-master/pos-customer-master-main/pos-customer-master-main.component';


@Component({
  selector: 'app-pos-purchase-direct',
  templateUrl: './pos-purchase-direct.component.html',
  styleUrls: ['./pos-purchase-direct.component.scss']
})
export class PosPurchaseDirectComponent implements OnInit {

  currentDate = new Date();
  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  columnheadDetails:any[] = ['Stock Code','Pcs','Gr.Wt','Purity','Pure Wt','Mkg.RATE','Mkg.Amount','Metal Amt','St.Amt','Wastage','Total','']
  
  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Party Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "Currency <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  
  posPurchaseForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocTypeNo:[1],
    vocDate:[new Date()],
    partyCode:[''],
    partyCurrCode:[''],
    partyCurrCodeDesc:[''],
    customer:[''],
    moblie:[''],
    itemCurr:[''],
    itemCurrCode:[''],
    creditDaysCode:[''],
    creditDays:[new Date()],
    salesMan:[''],
    supInvNo:[''],
    date:[new Date()],
    custName:[''],
    email:[''],
    custId:[''],
    narration:[''],
    partyCurrency:[''],
    partyCurrencyCode:[''],
    amount:[''],
    amountDes:[''],
    rndOfAmt:[''],
    rndOfAmtDes:[''],
    rndNetAmt:[''],
    rndNetAmtDes:[''],
    otherAmt:[''],
    otherAmtDes:[''],
    grossAmt:[''],
    grossAmtDes:[''],
  });



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.posPurchaseForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
    this.posPurchaseForm.controls.partyCurrCode.setValue(this.comService.compCurrency);
    this.posPurchaseForm.controls.partyCurrCodeDesc.setValue(this.comService.getCurrRate(this.comService.compCurrency));
    this.posPurchaseForm.controls.itemCurr.setValue(this.comService.compCurrency);
    this.posPurchaseForm.controls.itemCurrCode.setValue(this.comService.getCurrRate(this.comService.compCurrency));
  }

  partyCodeSelected(e:any){
    console.log(e);
    this.posPurchaseForm.controls.partyCode.setValue(e.ACCODE);
  }

  partyCurrencyCodeSelected(e:any){
    console.log(e);
  }

  customerCodeSelected(e:any){
    console.log(e);
    this.posPurchaseForm.controls.customer.setValue(e.CODE);
    this.posPurchaseForm.controls.custId.setValue(e.CODE);
    this.posPurchaseForm.controls.custName.setValue(e.NAME);
    this.posPurchaseForm.controls.email.setValue(e.EMAIL);
    this.posPurchaseForm.controls.moblie.setValue(e.MOBILE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddposdirectdetail() {
    const modalRef: NgbModalRef = this.modalService.open(PosPurchaseDirectDetailComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openaddCustomerMaster() {
    const modalRef: NgbModalRef = this.modalService.open(PosCustomerMasterMainComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

}
