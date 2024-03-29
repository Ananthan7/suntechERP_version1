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
import { RepairPurchaseDetailsComponent } from './repair-purchase-details/repair-purchase-details.component';



@Component({
  selector: 'app-repair-purchase',
  templateUrl: './repair-purchase.component.html',
  styleUrls: ['./repair-purchase.component.scss']
})
export class RepairPurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  selectedTabIndexLineItem=0;
  currentDate = new Date();
  tableData: any[] = []; 
  viewMode: boolean = false;
  @Input() content!: any; 
  branchCode?: String;
  yearMonth?: String; 
  repairmetalpurchasedetail : any[] = [];
  private subscriptions: Subscription[] = [];
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
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
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
    this.repairpurchaseForm.controls.partyCode.setValue(e['ACCOUNT HEAD']);
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
    this.repairpurchaseForm.controls.partycur.setValue(e['Currency']);
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
    this.repairpurchaseForm.controls.sub_ledger.setValue(e.SUBLEDGER_CODE);
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
    this.repairpurchaseForm.controls.allocate_fixing.setValue(e['SalesFixingVoucher']);
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
    this.repairpurchaseForm.controls.name.setValue(e.SALESPERSON_CODE);
    this.repairpurchaseForm.controls.namedes.setValue(e.	DESCRIPTION);
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
    this.repairpurchaseForm.controls.country_origin.setValue(e.CODE);
    this.repairpurchaseForm.controls.country_origin_des.setValue(e.DESCRIPTION);

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
    this.repairpurchaseForm.controls.state_code.setValue(e.STATE_CODE);

  }



  repairpurchaseForm: FormGroup = this.formBuilder.group({
    voc_type: [''],
    voc_no: [''],
    Voc_date: [''],
    partyCode: [''],
    partycur: [''],
    partycurrate: [''],
    sub_ledger:[''],
    metal_rate:[''],
    credit_days_LC:[''],
    credit_date_LC:[''],
    credit_days_Mtl:[''],
    credit_date_Mtl:[''],
    dis:[''],
    name:[''],
    namedes:[''],
    Address:[''],
    allocate_fixing:[''],
    fixed_pure:[''],
    vat_mode :[''],
    declaration_no :[''],
    declaration_date :[''],
    remarks :[''],
    country_origin :[''],
    country_origin_des :[''],
    packet_no :[''],
    expiry_date :[''],
    no :[''],
    state_code :[''],
    hedging_bal :[''],
    trans_type :[''],
    document :[''],
    DRG_VOC_NO :[''],
    Customer :[''],
    Navigation  :[''],
    stamp_Amt_FC :[''],
    stamp_party_Amt :[''],
    stamp_Amt_CC :[''],
    input_VAT :[''],
    rcm_VAT:[''],
    net_amount_fc :[''],
    net_amount_cc :[''],
    total_tax_fc :[''],
    total_tax_cc :[''],
    round_Off_with :[''],
    round_to :[''],
    other_amount_tax :[''],
    other_amount :[''],
    party_round_Off :[''],
    party_amount_FC :[''],
    party_amount_LC :[''],
    total_TDS :[''],
    total_TCS :[''],
    gross_total_fc :[''],
    gross_total_cc :[''],
  });



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  adddata(data?: any) {
    console.log(data,'data to child')
    const modalRef: NgbModalRef = this.modalService.open(RepairPurchaseDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
    console.log(data, 'data')
    modalRef.componentInstance.content = data
    modalRef.result.then((postData) => {
      if (postData) {
        console.log('Data from child:', postData);
        this.repairmetalpurchasedetail.push(postData);
      }
    });

   
   
}

formSubmit(){

}




update(){

}

deleteRecord() {}


ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}

}
