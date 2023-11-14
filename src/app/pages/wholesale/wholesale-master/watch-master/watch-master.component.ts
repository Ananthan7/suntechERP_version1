import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-watch-master',
  templateUrl: './watch-master.component.html',
  styleUrls: ['./watch-master.component.scss']
})
export class WatchMasterComponent implements OnInit {
  columnhead:any[] = ['Division','Karat','Gross Wt','Rate Type','Metal Rate','',''];
  columnheader:any[] = ['Div','Shape','Color','Size','PCs','Carat']
  divisionMS: any = 'ID';

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
