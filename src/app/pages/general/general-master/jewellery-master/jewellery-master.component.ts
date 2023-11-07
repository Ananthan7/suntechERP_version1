import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jewellery-master',
  templateUrl: './jewellery-master.component.html',
  styleUrls: ['./jewellery-master.component.scss']
})
export class JewelleryMasterComponent implements OnInit {

  columnhead:any[] = ['Division','Gross Wt','Karat','Rate Type','Rate','Amount..','Amount','Metal Labour','Rate/Gram','MetalPer','Color'];

  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
