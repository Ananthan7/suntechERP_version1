import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-jewellery-master',
  templateUrl: './jewellery-master.component.html',
  styleUrls: ['./jewellery-master.component.scss']
})
export class JewelleryMasterComponent implements OnInit {

  divisionMS: any = 'ID';
  columnhead:any[] = ['Division','Gross Wt','Karat','Rate Type','Rate','Amount..','Amount','Metal Labour','Rate/Gram','MetalPer','Color'];
  columnheader:any[] = ['Div', 'Stock Code', 'Shape','Color','Clarity','Sieve','Size','Pcs','Carat','Currency','Pc Code','Lab Rate','Lab Amt','LbCode'];
  columnheaders:any[] = ['Sr','Description','FC','LC'];
  columnheaderPartDetails:any[] = ['Sr#','Div','Part Code','Design Code','Pcs','Gross Wt','Rate','Amount']


  constructor( private activeModal: NgbActiveModal,) { }
 
  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
