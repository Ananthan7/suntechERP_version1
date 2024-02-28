import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PointOfSalesOrderDetailsComponent } from './point-of-sales-order-details/point-of-sales-order-details.component';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { PosSalesPaymentComponent } from './pos-sales-payment/pos-sales-payment.component';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
@Component({
  selector: 'app-point-of-sales-order',
  templateUrl: './point-of-sales-order.component.html',
  styleUrls: ['./point-of-sales-order.component.scss']
})
export class PointOfSalesOrderComponent implements OnInit {
  [x: string]: any;

  @ViewChild('sales_payment_modal') public sales_payment_modal!: NgbModal;

  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead:any[] = ['Karat','Rate','Purchase Rate'];
  columnheadSoldItems:any[] = ['Mode','Currency','Amount','DTYEARMONTH','IGST ACCODE','IGST PER','IGST AMOUNTFC','IGST AMOUNTCC','HSN CODE','GST CODE','TOTAMTWITHOUTVATFC','TOTAMTWITHOUTVATLC'];
  columnheadDetails:any[] = ['Sr','Stock Code','Division','Description','Quantity','Rate','Amount','Disc Amount','Net Amount','Total AmountCC','MKGVALUECC'];
  divisionMS: any = 'ID';
  columnheadItems:any[] = ['Item Code','Item Description','Pcs','Weight','Making Amount','Metal Amount','Disc Amount','Net Amount'];
  columnheadsItems:any[]=['Item Code','Item Description','Pcs','Weight','PURITY','PUREWT','MKG_RATEFC','Making Amount','Metal Amount','Stone Amount','WASTAGEPER','WASTAGEQTY','Net Amount','DIVISION CODE','STONEWT','NETWT','CHARGABLEWT','OZWT','METAL RATE GMSFC','STONE RATEFC','PUDIFF','STONEDIFF','STOCK','WASTAGEAMOUNTFC','LOCTYPE CODE','SUPPLIER','SRNO','VOCTYPE','VOCNUMBER'];
  SalesManData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "salesperson_code",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "SalesMan",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACTIVE = 1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  CurrencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: "currency_code",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  CreditData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 214,
    SEARCH_FIELD: "credit_code",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Credit A/C",
    SEARCH_VALUE: "",
    WHERECONDITION: "MODE=3",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  CustomerData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "code",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  StateData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: "state filed",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "State",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  CityData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    // LOOKUPID: 14,
    // SEARCH_FIELD: "PREFIX_CODE",
    SEARCH_HEADING: "City",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

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

  salesMancodeSelected(e:any){
   
    this.posofSalesOrderForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
  }
  currencycodeSelected(e:any){
 
    this.posofSalesOrderForm.controls.currency.setValue(e.CURRENCY_CODE);
    this.posofSalesOrderForm.controls.currencyCode.setValue(e.DESCRIPTION);
  }

  creditcodeSelected(e:any){
  
    this.posofSalesOrderForm.controls.creditAc.setValue(e.CURRENCY_CODE);
  
  }
  
  customercodeSelected(e:any){

    this.posofSalesOrderForm.controls.customerCode.setValue(e.CODE);
  
  }
    
  statecodeSelected(e:any){
   
    this.posofSalesOrderForm.controls.state.setValue(e.STATE_DESCRIPTION);
  
  }

  citycodeSelected(e:any){

    this.posofSalesOrderForm.controls.city.setValue(e.DESCRIPTION);
  
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
