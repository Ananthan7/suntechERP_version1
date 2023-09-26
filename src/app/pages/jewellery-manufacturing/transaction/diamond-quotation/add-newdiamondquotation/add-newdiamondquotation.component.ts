import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-add-newdiamondquotation',
  templateUrl: './add-newdiamondquotation.component.html',
  styleUrls: ['./add-newdiamondquotation.component.scss']
})
export class AddNewdiamondquotationComponent implements OnInit {

  divisionMS: any = 'ID';

  bomDetailsColumnheads:any[] =  ['Div','Stone T','Comp C','Karat','PCS','Amount','Shape','Sieve','Lab.Rate','Wast','wast','wast','Lab.Amount','Sieve Desc','Size','Color'];
  summaryTabColumnheaders:any[] = ['Code','Div','Pcs','Qty','Rate','Amount', 'Wst %','Wst Qty','Wst Amt','Lab Type'];
 
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
