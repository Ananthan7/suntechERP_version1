import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-newdetail',
  templateUrl: './add-newdetail.component.html',
  styleUrls: ['./add-newdetail.component.scss']
})
export class AddNewdetailComponent implements OnInit {

  favoriteSeason: string = ''
  seasons: string[] = ['Metal', 'Stones'];
  season2: string[] = ['Metal', 'Stones','Total'];
  currentFilter: any;
  divisionMS: any = 'ID';

  columnheads:any[] =  ['Div','Stone T','Comp C','Karat','PCS','Amount','Shape','Sieve','Lab.Rate','Wast','wast','wast','Lab.Amount','Sieve Desc','Size','Color'];
  columnhead:any[] =  ['','','','','','','','','','','','',''];
  columnheader:any[] = ['','','','','','','','','','','','',''];
  columnheaders:any[] = ['Code','Div','Pcs','Qty','Rate','Amount', 'Wst %','Wst Amt','Lab Type'];
  columnheadmain:any[] = ['Stock Code','Stone Size','Stone Pcs','Stone Weight'];
  // public font: Font = new Font({
  //   family: 'Roboto',
  //   size: '14px',
  //   style: 'regular',
  //   styles: ['regular']
  // });

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }
  
}
