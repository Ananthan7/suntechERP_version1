import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PosPurchaseDirectDetailComponent } from './pos-purchase-direct-detail/pos-purchase-direct-detail.component';

@Component({
  selector: 'app-pos-purchase-direct',
  templateUrl: './pos-purchase-direct.component.html',
  styleUrls: ['./pos-purchase-direct.component.scss']
})
export class PosPurchaseDirectComponent implements OnInit {

  currentDate = new Date();
  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  columnheadDetails:any[] = ['Stock Code','Pcs','Gr.Wt','Purity','Pure Wt','Mkg.RATE','Mkg.Amount','Metal Amt','St.Amt','Wastage','Wastage','Total','']
  posPurchaseForm: FormGroup = this.formBuilder.group({
    vocType:[''],
    vocTypeNo:[''],
    vocDate:[''],
    partyCode:[''],
    partyCurrCode:[''],
    partyCurrCodeDesc:[''],
    customer:[''],
    moblie:[''],
    itemCurr:[''],
    itemCurrCode:[''],
    creditDaysCode:[''],
    creditDays:[''],
    salesMan:[''],
    supInvNo:[''],
    date:[''],
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

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
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

}
