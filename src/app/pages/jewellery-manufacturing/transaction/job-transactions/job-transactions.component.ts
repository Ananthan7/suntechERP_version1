/*
MODULE : JEWELLERY MANUFACTURING
MENU_SCREEN_NAME : <ADD MENU NAME>
DEVELOPER : ANANTHA
*/

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-job-transactions',
  templateUrl: './job-transactions.component.html',
  styleUrls: ['./job-transactions.component.scss']
})

export class JobTransactionsComponent implements OnInit {
  
  tableData: any[] = [];  
  columnheadItemDetails:any[] = ['JoBNo','VocType','VocNo','Process Code','Worker Code','GrossWt','LossWt','PureWt','VocDate'];
  divisionMS: any = 'ID';

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

    
   

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  jobtransactionFrom: FormGroup = this.formBuilder.group({


      vocType: ['', [Validators.required]],
      vocNum: ['', [Validators.required]],
      sLoctype: ['', [Validators.required]],
      mLoctype: ['', [Validators.required]], 
  });

  formSubmit(){

  }
}


