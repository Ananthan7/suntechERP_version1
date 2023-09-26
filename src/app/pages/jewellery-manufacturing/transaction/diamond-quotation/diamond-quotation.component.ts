import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { AddNewdetailComponent } from '../diamond-salesorder/add-newdetail/add-newdetail.component';
import { AddNewdiamondquotationComponent } from './add-newdiamondquotation/add-newdiamondquotation.component';


@Component({
  selector: 'app-diamond-quotation',
  templateUrl: './diamond-quotation.component.html',
  styleUrls: ['./diamond-quotation.component.scss']
})
export class DiamondQuotationComponent implements OnInit {

  @Input() content!: any; //use: To get clicked row details from master grid
  currentFilter: any;

  diamondQuotTableHeaders: any[] = ['SRNO', 'DESIGN CODE', 'STOCK_CODE', 'KARAT', 'METAL_COLOR', 'PCS', 'GROSS_WT', 'METAL_WT', 'STONE_WT', 'RATEFC', 'VALUEFC', 'NETVALUEFC', 'CHARGE1FC', 'CHARGE1LC'];
  private subscriptions: Subscription[] = [];

  OrderTypeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Order Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES='ORDERTYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  PartyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCurrencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Salesman',
    SEARCH_VALUE: '',
    WHERECONDITION: "Currency <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  diamondSalesOrderForm: FormGroup = this.formBuilder.group({
    VoucherType: ['', [Validators.required]],
    VoucherDESC: ['', [Validators.required]],
    VoucherDate: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],
    Salesman: ['', [Validators.required]],
    SelectAll: [false,],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
  ) { }

  ngOnInit(): void {
  }

  addNewDetail() {
    const modalRef: NgbModalRef = this.modalService.open(AddNewdiamondquotationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }


  deleteClicked() {

  }
  OrderTypeSelected(event: any) {
    console.log(event);

  }
  OrderTypeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  PartyCodeSelected(event: any) {
    console.log(event);

  }
  PartyCodeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  SalesmanSelected(event: any) {
    console.log(event);

  }
  SalesmanChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  close() {
    this.activeModal.close();
  }


}
