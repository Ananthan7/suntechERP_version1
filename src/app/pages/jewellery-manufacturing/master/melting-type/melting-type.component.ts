import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';


@Component({
  selector: 'app-melting-type',
  templateUrl: './melting-type.component.html',
  styleUrls: ['./melting-type.component.scss']
})
export class MeltingTypeComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }
  formSubmit(){
  }
  close() {
    //TODO reset forms and data before closing
    this.activeModal.close();
  }

  columnheads:any[] = ['Sr','Division','Default Alloy','Description','Alloy %'];

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  ColorCodeSelected(e:any){

  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 84,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  KaratCodeSelected(e:any){

  }

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  StockCodeSelected(e:any){

  }

}
