import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-sales-dia-details-i-gst',
  templateUrl: './pos-sales-dia-details-i-gst.component.html',
  styleUrls: ['./pos-sales-dia-details-i-gst.component.scss']
})
export class PosSalesDiaDetailsIGSTComponent implements OnInit {

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

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(e: any) {
    console.log(e);
    this.PossalesdiadetailsgstForm.controls.Stockdiv.setValue(e.DIVISION_CODE);
    this.PossalesdiadetailsgstForm.controls.stockcode.setValue(e.STOCK_CODE);
    this.PossalesdiadetailsgstForm.controls.stockdes.setValue(e.DESCRIPTION );
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Location Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e: any) {
    console.log(e);
    this.PossalesdiadetailsgstForm.controls.location.setValue(e.LOCATION_CODE);
  }

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesCodeSelected(e: any) {
    console.log(e);
    this.PossalesdiadetailsgstForm.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  countryCodeSelected(e: any) {
    console.log(e);
    this.PossalesdiadetailsgstForm.controls.country.setValue(e.DESCRIPTION);
  }

  PossalesdiadetailsgstForm: FormGroup = this.formBuilder.group({
    Stockdiv: [''],
    stockcode: [''],
    stockdes: [''],
    location: [''],
    design: [''],
    color: [''],
    size: [''],
    country: [''],
    salesman: [''],
   
  });


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }
}
