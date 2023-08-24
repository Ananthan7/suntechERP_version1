import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Font } from 'ngx-font-picker';
@Component({
  selector: 'app-jobcard',
  templateUrl: './jobcard.component.html',
  styleUrls: ['./jobcard.component.scss']
})
export class JobcardComponent implements OnInit {
  //variables
  modalReference:any;
  closeResult:any;
  pageTitle: any;
  currentFilter: any;
  showFilterRow: boolean = false;
  showHeaderFilter: boolean = false;
  divisionMS: any = 'ID';
  itemList: any[] = []

  columnhead:any[] = ['Sl No','Job Reference','Part Code','Description','Pcs','Metal Color','Metal Wt','Stone Wt','Gross Wt' ];
  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
  }
  /**USE: close modal window */
  close() {
    this.activeModal.close();
  }

}