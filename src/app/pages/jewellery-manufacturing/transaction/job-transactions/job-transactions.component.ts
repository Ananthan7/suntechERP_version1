/*
MODULE : JEWELLERY MANUFACTURING
MENU_SCREEN_NAME : <ADD MENU NAME>
DEVELOPER : ANANTHA
*/

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-job-transactions',
  templateUrl: './job-transactions.component.html',
  styleUrls: ['./job-transactions.component.scss']
})

export class JobTransactionsComponent implements OnInit {
  @Input() content!: any;

  tableData: any[] = [];
  columnheadItemDetails: any[] = ['JoBNo', 'VocType', 'VocNo', 'Process Code', 'Worker Code', 'GrossWt', 'LossWt', 'PureWt', 'VocDate'];
  divisionMS: any = 'ID';
  jobtransactionFrom: FormGroup = this.formBuilder.group({
    vocType: ['', [Validators.required]],
    vocNum: ['', [Validators.required]],
    sLoctype: ['', [Validators.required]],
    mLoctype: ['', [Validators.required]],
  });
  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW') {
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  formSubmit() {

  }
}


