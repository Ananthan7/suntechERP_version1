import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PointOfSalesOrderDetailsComponent } from './point-of-sales-order-details/point-of-sales-order-details.component';

@Component({
  selector: 'app-point-of-sales-order',
  templateUrl: './point-of-sales-order.component.html',
  styleUrls: ['./point-of-sales-order.component.scss']
})
export class PointOfSalesOrderComponent implements OnInit {
  [x: string]: any;


  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['Karat','Rate','Purchase Rate'];
  columnheadSoldItems:any[] = ['Mode','Currency','Currency','Amount'];
  columnheadDetails:any[] = ['Sr','Stock Code','Division','Description','Quantity','Rate','Amount','Disc Amount','Net Amount'];
  divisionMS: any = 'ID';


  posofSalesOrderForm: FormGroup = this.formBuilder.group({
    vocType :[''],
    vocTypeDescription: ['1'],
    vocDate:[new Date()],
    salesMan:[''],
    currency:[''],
    currencyCode:[''],
    creditAc:[''],
    moblieCountryCode:[''],
    moblieNo:[''],
    landline:[''],
    customerCode:[''],
    customerSelect:[''],
    custDesc:[''],
    email:[''],
    poBox:[''],
    idProof:[''],
    type:[''],
    nationality:[''],
    city:[''],
    state:[''],
    remarks:[''],
    deliveryDate:[new Date()],
    holdforSalesTill:[false],
    fixMetalRate:[false],
    normalDate:[new Date()],
    invoiceTotal:[''],
    returns:[''],
    exchanges:[''],
    advanceReceived:[''],
    roundOffAmount:[''],
    netTotal:[''],
    receiptTotal:[''],
    refundDue:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.posofSalesOrderForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(PointOfSalesOrderDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }
}
