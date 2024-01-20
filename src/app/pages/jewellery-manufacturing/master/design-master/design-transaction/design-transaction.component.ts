import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-design-transaction',
  templateUrl: './design-transaction.component.html',
  styleUrls: ['./design-transaction.component.scss']
})
export class DesignTransactionComponent implements OnInit {

  columnhead:any[]=['SRNO','Stock code','Producation','Prod Date','Job No','Job Date','Customer','S O Ref','Pcs','Value']
  designTransactionForm: FormGroup = this.formBuilder.group({
    numberOfRecordsToDisplay:[''],
    fristTranctionProductionOn:[''],
    fristTranctionProductionNo:[''],
    fristTranctionCustomer:[''],
    fristTranctionCost:[''],
    fristTranctionStockId:[''],
    lastTranctionProductionOn:[''],
    lastTranctionProductionNo:[''],
    lastTranctionCustomer:[''],
    lastTranctionCost:[''],
    lastTranctionStockId:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
