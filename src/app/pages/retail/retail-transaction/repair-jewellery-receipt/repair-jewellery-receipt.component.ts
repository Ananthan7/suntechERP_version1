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
import { RepairDetailsComponent } from './repair-details/repair-details.component';


@Component({
  selector: 'app-repair-jewellery-receipt',
  templateUrl: './repair-jewellery-receipt.component.html',
  styleUrls: ['./repair-jewellery-receipt.component.scss']
})
export class RepairJewelleryReceiptComponent implements OnInit {
  
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['Repair Narration']
 
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
