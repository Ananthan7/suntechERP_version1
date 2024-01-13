import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

@Component({
  selector: 'app-stone-cost-updation',
  templateUrl: './stone-cost-updation.component.html',
  styleUrls: ['./stone-cost-updation.component.scss']
})
export class StoneCostUpdationComponent implements OnInit {

  tableData: any[] = [];
  columnhead: any[] = ['Sr No', 'Customer', 'So Number', 'Job Number', 'Job Ref#', 'Pcs', 'Weight', 'Rate', 'Amount', 'New Rate LC', 'New Amount LC', 'New Rate FC', 'New Amount FC',];
  divisionMS: any = 'ID';

  branchCode?: String;
  userName = this.commonService.userName;

  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];

  constructor(private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }


  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;
  }

  setInitialValues() {
    this.branchCode = this.commonService.branchCode;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  jobCloseingFrom: FormGroup = this.formBuilder.group({


    vocType: ['', [Validators.required]],
    vocNum: ['', [Validators.required]],
    sLoctype: ['', [Validators.required]],
    mLoctype: ['', [Validators.required]],
  });

  formSubmit() {

  }
}
