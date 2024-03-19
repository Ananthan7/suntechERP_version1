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
