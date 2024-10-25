import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-print-customer-log',
  templateUrl: './print-customer-log.component.html',
  styleUrls: ['./print-customer-log.component.scss']
})
export class PrintCustomerLogComponent implements OnInit {

  @Input() htmlContentForCustomerLog!: any

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    console.log(this.htmlContentForCustomerLog);
    
  }

  close() {
    this.activeModal.close();
  }

}
