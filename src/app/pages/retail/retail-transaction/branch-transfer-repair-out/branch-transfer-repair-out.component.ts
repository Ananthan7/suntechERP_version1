import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-transfer-repair-out',
  templateUrl: './branch-transfer-repair-out.component.html',
  styleUrls: ['./branch-transfer-repair-out.component.scss']
})


export class BranchTransferRepairOutComponent implements OnInit {

  @Input() content!: any; 

  branchCode?: String;
  yearMonth?: String;

  private subscriptions: Subscription[] = [];

  

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode:any= '';
  // columnhead:any[] = [
  //   { title: 'Karat', field: 'KARAT_CODE' },
  //   { title: 'Sale Rate', field: 'KARAT_RATE' },
  //   { title: 'Purchase Rate', field: 'POPKARAT_RATE' }];

  columnhead:any[] = ['Rep Voc No','Stock Code','Bag No','Customer Name','Mobile','Deliver Date','Status'];
  columnheadDetails:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep type','Delivery']
  




  constructor(
    private activeModal: NgbActiveModal,
   
  ) {
   
   }

  ngOnInit(): void {
   
  }

 

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  
  formSubmit(){

    
  }


  update(){

   

  }


  

}

