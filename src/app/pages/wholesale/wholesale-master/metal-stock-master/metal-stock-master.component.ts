import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-metal-stock-master',
  templateUrl: './metal-stock-master.component.html',
  styleUrls: ['./metal-stock-master.component.scss']
})
export class MetalStockMasterComponent implements OnInit {


  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
