import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-repair-purchase-details',
  templateUrl: './repair-purchase-details.component.html',
  styleUrls: ['./repair-purchase-details.component.scss']
})
export class RepairPurchaseDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = []; 
  branchCode?: String;
  yearMonth?: String; 
  private subscriptions: Subscription[] = [];
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['SI.No' , 'GST_Type%' , 'GST_Type', 'Total GST'];

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
    this.repairpurchasedetailsForm.controls.Stockdiv.setValue(e.DIVISION_CODE);
    this.repairpurchasedetailsForm.controls.stockcode.setValue(e.STOCK_CODE);
    this.repairpurchasedetailsForm.controls.stockdes.setValue(e.DESCRIPTION );
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
    this.repairpurchasedetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

 

  repairpurchasedetailsForm: FormGroup = this.formBuilder.group({
    Stockdiv: [''],
    stockcode: [''],
    stockdes: [''],
    description : [''],
    hallmarking : [''],
    penalty : [''],
    location: [''],
    metal_rate: [''],
    transaction_attribute: [''],
    pieces : [''],
    unit_weight: [''],
    gross_weight: [''],
    stone_weight: [''],
    purity: [''],
    pure_weight: [''],
    net_weight: [''],
    chargable_weight: [''],
    Pcs: [''],
    Cts: [''],
    GMS: [''],
    purity_difference: [''],
    stone_difference: [''],
    lot_no: [''],
    unit: [''],
    making_rate_fc: [''],
    making_rate_cc: [''],
    making_amount: [''],
    metal_rate_1: [''],
    metal_amount: [''],
    stone_rate: [''],
    stone_amount: [''],
    rate_type: [''],
    kundan_rate: [''],
    total_amount: [''],
    bar_no: [''],
    total_amount_2: [''],
    repair_item: [''],
    price_1: [''],
    price_1_fc: [''],
    price_1_cc: [''],
    price_2: [''],
    price_2_fc: [''],
    price_2_cc: [''],
    Wastage_per: [''],
    Wastage_qua: [''],
    Wastage_amo: [''],
    Wastage_pur: [''],
    declaration_no: [''],
    Re_Export_YN: [''],
    amount_1: [''],
    rate_1: [''],
    ticket_no: [''],
    CGST : [''],
    CGST_fc : [''],
    CGST_cc : [''],
    SGST : [''],
    SGST_fc : [''],
    SGST_cc : [''],
    IGST : [''],
    IGST_fc : [''],
    IGST_cc : [''],
    round : [''],
    total : [''],
    
  });
  
  
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 
 
 

  adddata() {
   
}


adddatas() {
 
}

removedata(){

}

removedatas(){
 
}

formSubmit(){

}




update(){

}

deleteRecord() {

}

ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}
}
