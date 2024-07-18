import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  /**USE: Design Code lookup model*/
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 110,
    SEARCH_FIELD: 'stock_code',
    SEARCH_HEADING: 'Metal Stock Master',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  constructor(
    private activeModal: NgbActiveModal,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }
  /**USE: design Code Selection */
  mainStockCodeSelected(data: any): void {
  }
  formSubmit() {
  }
    /**USE: stock code division change to assign data to the lookup */
    changeDivision(event: any): void {
      if (event.target.value == '') return;
      event.target.value = event.target.value.toUpperCase()
      if (this.commonService.divisionMasterList.length == 0) {
        this.commonService.toastErrorByMsgId('MSG1531');
        return
      }
      let divisionArr = this.commonService.divisionMasterList?.filter((item: any) => item.DIVISION_CODE == event.target.value)
      if (divisionArr.length == 0) {
        this.commonService.toastErrorByMsgId('MSG1531');// MSG NOT FOUND
        return
      }
      if (event.target.value == 'X') {
        this.stockCodeData.LOOKUPID = 110
        this.stockCodeData.WHERECONDITION = ''
      } else if (divisionArr[0].DIVISION == 'M') {
        this.stockCodeData.LOOKUPID = 23
        this.stockCodeData.WHERECONDITION = `DIVISION_CODE = '${event.target.value}' AND SUBCODE = 0`
      } else {
        this.stockCodeData.LOOKUPID = 4
        this.stockCodeData.WHERECONDITION = `ITEM = '${event.target.value}'`
      }
    }
  /**USE: close activeModal */
  close(data?: any) {
    this.activeModal.close(data);
  }
  lookupKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
