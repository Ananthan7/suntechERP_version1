import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PosReturnSalesDiaDetailsIGSTComponent } from './pos-return-sales-dia-details-i-gst/pos-return-sales-dia-details-i-gst.component';
import { PosReturnSalesDiaDetailsIGSTIndComponent } from './pos-return-sales-dia-details-i-gst-ind/pos-return-sales-dia-details-i-gst-ind.component';
import { PosReturnSalesDiaUnfixDetailsGSTComponent } from './pos-return-sales-dia-unfix-details-gst/pos-return-sales-dia-unfix-details-gst.component';


@Component({
  selector: 'app-pos-return',
  templateUrl: './pos-return.component.html',
  styleUrls: ['./pos-return.component.scss']
})
export class PosReturnComponent implements OnInit {

  @Input() content!: any;
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  branchCode?: String;
  yearMonth?: String;
  currentDate = new Date();
  tableData: any[] = [];
  viewMode:boolean = false;
  private subscriptions: Subscription[] = [];
  urls: string | ArrayBuffer | null | undefined;
  url: any;


  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  enteredByCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Users',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  columnhead:any[] = ['Karat','Sale Rate','Purchase Rate'];
  columnheadSummary:any[] = ['Division','Code','Description','Pcs','Gross Weight','Mkg Rate','Making Value','Metal Value','Net Value','Discount Value'];
  columnheadSummaryLabour:any[] = ['Mode','Curr','Amt FC','Amt LC']
  columnheadJobDetails:any[] = ['SI.No','Job No','Design ID','Div','Stock Id','Pcs','Gross.Wt','Color','Clarity','Shape','size','Slieve','Karat','Broken Stone','Broken Stock']
  columnheadSummaryLabourCharges:any[] = ['Select','SINo','Labour Code','Lab Accode','Division','Unit','Gross Wt','Pcs','Rate','GST Code','CGST %','CGST Amt','SGST %','SGST Amt','Total %','Total GST','Amount','Currency ']

 

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openposreturndiadetail() {
    const modalRef: NgbModalRef = this.modalService.open(PosReturnSalesDiaDetailsIGSTComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openposretuensalesdiadetailind() {
    const modalRef: NgbModalRef = this.modalService.open(PosReturnSalesDiaDetailsIGSTIndComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  openposreturnsalesdiaunfixdetailgst() {
    const modalRef: NgbModalRef = this.modalService.open(PosReturnSalesDiaUnfixDetailsGSTComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  formSubmit(){
    
  }

}
