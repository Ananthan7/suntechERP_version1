import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cost-centre-diamond-details',
  templateUrl: './cost-centre-diamond-details.component.html',
  styleUrls: ['./cost-centre-diamond-details.component.scss']
})
export class CostCentreDiamondDetailsComponent implements OnInit {

  divisionMS: any = 'ID';
 
  constructor( private activeModal: NgbActiveModal,    
    private modalService: NgbModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
