import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PointOfSalesOrderDetailsComponent } from './point-of-sales-order-details/point-of-sales-order-details.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { PosSalesPaymentComponent } from './pos-sales-payment/pos-sales-payment.component';
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
  columnheadSoldItems:any[] = ['Mode','Currency','Currency','Amount','DTYEARMONTH','IGST ACCODE','IGST PER','IGST AMOUNTFC','IGST AMOUNTCC','HSN CODE','GST CODE','TOTAMTWITHOUTVATFC','TOTAMTWITHOUTVATLC'];
  columnheadDetails:any[] = ['Sr','Stock Code','Division','Description','Quantity','Rate','Amount','Disc Amount','Net Amount','Total AmountCC','MKGVALUECC'];
  divisionMS: any = 'ID';
  columnheadItems:any[] = ['Item Code','Item Description','Pcs','Weight','Making Amount','Metal Amount','Disc Amount','Net Amount'];
  columnheadsItems:any[]=['Item Code','Item Description','Pcs','Weight','PURITY','PUREWT','MKG_RATEFC','Making Amount','Metal Amount','Stone Amount','WASTAGEPER','WASTAGEQTY','Net Amount','DIVISION CODE','STONEWT','NETWT','CHARGABLEWT','OZWT','METAL RATE GMSFC','STONE RATEFC','PUDIFF','STONEDIFF','STOCK','WASTAGEAMOUNTFC','LOCTYPE CODE','SUPPLIER','SRNO','VOCTYPE','VOCNUMBER'];

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
    s_total:['0'],
    Qty_total:['0.000'],
    amt_total:['0.00'],
    disc_total:['0.00'],
    net_total:['0.00'],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.posofSalesOrderForm.controls.vocType.setValue(this.comService.getqueryParamVocType());
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  continueClick(){}

  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(PointOfSalesOrderDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  @ViewChild('mymodal') public mymodal!: NgbModal;

  open(modalname?: any) {
      
      const modalRef: NgbModalRef = this.modalService.open(PosSalesPaymentComponent, {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        windowClass: 'modal-full-width'
      });
  
      modalRef.result.then((result) => {
       
      }, (reason) => {
       
      });
    }
}
