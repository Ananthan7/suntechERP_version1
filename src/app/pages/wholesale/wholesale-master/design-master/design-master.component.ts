import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-design-master',
  templateUrl: './design-master.component.html',
  styleUrls: ['./design-master.component.scss']
})
export class DesignMasterComponent implements OnInit {

  columnhead:any[] = ['Division','Gross Wt','Karat','Rate Type','Rate','Amount..','Amount','Metal Labour','Rate/Gram','MetalPer','Color'];

  constructor( private activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  formSubmit() {

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
