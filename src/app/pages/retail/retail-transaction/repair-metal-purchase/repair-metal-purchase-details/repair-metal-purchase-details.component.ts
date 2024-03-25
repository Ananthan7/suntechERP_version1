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


@Component({
  selector: 'app-repair-metal-purchase-details',
  templateUrl: './repair-metal-purchase-details.component.html',
  styleUrls: ['./repair-metal-purchase-details.component.scss']
})
export class RepairMetalPurchaseDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
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
    this.repairmetalpurchasedetailsForm.controls.Stockdiv.setValue(e.DIVISION_CODE);
    this.repairmetalpurchasedetailsForm.controls.stockcode.setValue(e.STOCK_CODE);
    this.repairmetalpurchasedetailsForm.controls.stockdes.setValue(e.DESCRIPTION );
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
    this.repairmetalpurchasedetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

 

  repairmetalpurchasedetailsForm: FormGroup = this.formBuilder.group({
    Stockdiv: [''],
    stockcode: [''],
    stockdes: [''],
    location: [''],
    
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

  formSubmit() {
   
  }

  updateMeltingType() {
   
    }
      /**USE: delete Melting Type From Row */
  deleteMeltingType() {
   
  }
 


  openaddalloyallocation() {
    const modalRef: NgbModalRef = this.modalService.open(AlloyAllocationComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  deleteTableData(){
 
    
  }

}
