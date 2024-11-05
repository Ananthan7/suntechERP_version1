import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-design-transaction',
  templateUrl: './design-transaction.component.html',
  styleUrls: ['./design-transaction.component.scss']
})
export class DesignTransactionComponent implements OnInit {
  @Input() content!: any; 

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



  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

}
