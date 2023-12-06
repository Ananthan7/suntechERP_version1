import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-pos-sales-order-cancellation',
  templateUrl: './pos-sales-order-cancellation.component.html',
  styleUrls: ['./pos-sales-order-cancellation.component.scss']
})
export class PosSalesOrderCancellationComponent implements OnInit {

  vocMaxDate = new Date();
  currentDate = new Date();
  orderMaxDate = new Date();


  
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

   customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'POS Customer Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  orderCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 60,
    SEARCH_FIELD: 'OrderCancellation',
    SEARCH_HEADING: '',
    SEARCH_VALUE: '',
    WHERECONDITION: "OrderCancellation<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  orderCancelCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: '',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  posSalesOrderCancellationForm: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo:[''],
    vocDate: [''],
    enteredBy:[''],
    customer: [''],
    order:[''],
    orderDate: [''],
    orderAmount:[''],
    advReceived: [''],
    ac:[''],
    acCode: [''],
    currency:[''],
    currencyRate: [''],
    orderAge:[''],
    noItem: [''],
    cheqNo:[''],
    cheqDate: [''],
    cheqBank:[''],
    depBank: [''],
    cancellationCharge:[''],
    refundAmount: [''],
    orderCancel:[''],
    modeOfRefundSelect:['']

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }


  enteredBySelected(e: any) {
    console.log(e);
    this.posSalesOrderCancellationForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
    this.posSalesOrderCancellationForm.controls.enteredBy.setValue(e.DESCRIPTION);
  }

  customerCodeSelected(e: any) {
    console.log(e);
    this.posSalesOrderCancellationForm.controls.customer.setValue(e.NAME); 
    
  }

  orderCodeSelected(e: any) {
    console.log(e);
    // this.posSalesOrderCancellationForm.controls.customer.setValue(e.NAME); 
    
  }

  orderCancelSelected(e: any) {
    console.log(e);
    // this.posSalesOrderCancellationForm.controls.customer.setValue(e.NAME); 
    
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
