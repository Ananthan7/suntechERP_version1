import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alloy-allocation',
  templateUrl: './alloy-allocation.component.html',
  styleUrls: ['./alloy-allocation.component.scss']
})
export class AlloyAllocationComponent implements OnInit {
 
  columnhead:any[] = ['Sr # ','Division' ,'Stock Code','Description','Alloy %','Alloy Qty'];

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
