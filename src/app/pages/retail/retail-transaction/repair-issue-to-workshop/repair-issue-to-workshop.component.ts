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
  selector: 'app-repair-issue-to-workshop',
  templateUrl: './repair-issue-to-workshop.component.html',
  styleUrls: ['./repair-issue-to-workshop.component.scss']
})
export class RepairIssueToWorkshopComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  

  columnheadItemDetails:any[] = ['Rep Voc No.','Stock Code','Bag No','Customer Name','Mobile','Delivery Date','Status'];
  columnheadItemDetails1:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery'];
  columnheadItemDetails2:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery'];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {}
   

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

 
 

  adddata() {
  
   
}



adddatas() {
 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
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
