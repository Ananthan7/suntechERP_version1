import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diamond-salesorder',
  templateUrl: './diamond-salesorder.component.html',
  styleUrls: ['./diamond-salesorder.component.scss']
})
export class DiamondSalesorderComponent implements OnInit {
  currentFilter: any;
  divisionMS: any = 'ID';

  columnhead:any[] = ['Code','Div','Qty', 'Rate','Wts %','Lab type','Lab A/C','Unit','Shape','Karat'];
  column1:any[] = ['SRNO','DESIGN CODE', 'KARAT','METAL_COLOR','PCS','METAL_WT','GROSS_WT','RATEFC','RATECC'];
  checked = false;
  check = false;
  indeterminate = false;

  OrderTypeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Worker A/c Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  PartyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Worker A/c Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SalesmanData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 152,
    SEARCH_FIELD: 'ACCOUNT_HEAD',
    SEARCH_HEADING: 'Worker A/c Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  diamondSalesOrderForm: FormGroup = this.formBuilder.group({
    VoucherType: ['', [Validators.required]],
    VoucherDESC: ['', [Validators.required]],
    VoucherDate: ['', [Validators.required]],
    PartyCode: ['', [Validators.required]],
    Salesman: ['', [Validators.required]],
    SelectAll: [false, ],
  })
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }
  formSubmit(){
    
  }
  deleteWorkerMaster(){

  }
  OrderTypeSelected(event:any){
    console.log(event);
    
  }
  OrderTypeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  PartyCodeSelected(event:any){
    console.log(event);
    
  }
  PartyCodeChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  SalesmanSelected(event:any){
    console.log(event);
    
  }
  SalesmanChange(event: any) {
    this.OrderTypeData.SEARCH_VALUE = event.target.value
  }
  close() {
    this.activeModal.close();
  }

}
