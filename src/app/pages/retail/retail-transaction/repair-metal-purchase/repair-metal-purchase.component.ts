import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import { RepairMetalPurchaseDetailsComponent } from './repair-metal-purchase-details/repair-metal-purchase-details.component';




@Component({
  selector: 'app-repair-metal-purchase',
  templateUrl: './repair-metal-purchase.component.html',
  styleUrls: ['./repair-metal-purchase.component.scss']
})
export class RepairMetalPurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  selectedTabIndexLineItem=0;
  currentDate = new Date();
  tableData: any[] = []; 
  viewMode: boolean = false; 
  columnheadItemDetails:any[] = ['Sr#','Stock Code','Description','Pcs','Purity','Gross Wt','Stone Wt','Net Wt','Pure Wt','Making Value','Metal Value','Net Value'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    
  
  }

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Party Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partyCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.partyCode.setValue(e['ACCOUNT HEAD']);
  }

  partycurCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Party Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Currency<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  partycurCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.partycur.setValue(e['Currency']);
  }

  subledgerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 180,
    SEARCH_FIELD: 'SUBLEDGER_CODE',
    SEARCH_HEADING: 'Sub Ledger Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SUBLEDGER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  subledgerCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.partycur.setValue(e.SUBLEDGER_CODE);
  }

  allocatefixingCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 57,
    SEARCH_FIELD: 'SalesFixingVoucher',
    SEARCH_HEADING: 'Allocate Fixing Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SalesFixingVoucher<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  allocatefixingCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.allocate_fixing.setValue(e['SalesFixingVoucher']);
  }

  nameCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Name Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  nameCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.name.setValue(e.SALESPERSON_CODE);
    this.repairmetalpurchaseForm.controls.namedes.setValue(e.	DESCRIPTION);
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
    this.repairmetalpurchaseForm.controls.country_origin.setValue(e.CODE);
    this.repairmetalpurchaseForm.controls.country_origin_des.setValue(e.DESCRIPTION);

  }

  stateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'State Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stateCodeSelected(e: any) {
    console.log(e);
    this.repairmetalpurchaseForm.controls.state_code.setValue(e.STATE_CODE);

  }



  repairmetalpurchaseForm: FormGroup = this.formBuilder.group({
    partyCode: [''],
    partycur: [''],
    sub_ledger:[''],
    name:[''],
    namedes:[''],
    allocate_fixing:[''],
    country_origin :[''],
    country_origin_des :[''],
    state_code :[''],
  });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  adddata() {

    const modalRef: NgbModalRef = this.modalService.open(RepairMetalPurchaseDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

   
   
}

formSubmit(){

}

adddatas() {
  
 
}

removedata(){
  
}

removedatas(){
  }

}
