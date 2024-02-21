import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-branch-transfer-repair-rtn',
  templateUrl: './branch-transfer-repair-rtn.component.html',
  styleUrls: ['./branch-transfer-repair-rtn.component.scss']
})
export class BranchTransferRepairRtnComponent implements OnInit {



  constructor( private activeModal: NgbActiveModal,) { }

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
