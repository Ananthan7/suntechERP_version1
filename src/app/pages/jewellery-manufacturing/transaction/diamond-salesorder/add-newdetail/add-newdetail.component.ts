import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

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
  DesignCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 56,
    SEARCH_FIELD: 'DESIGN_CODE',
    SEARCH_HEADING: 'Design Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  close() {
    this.activeModal.close();
  }
  
}
