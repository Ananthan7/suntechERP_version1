import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-customer-feedback-followup',
  templateUrl: './pos-customer-feedback-followup.component.html',
  styleUrls: ['./pos-customer-feedback-followup.component.scss']
})
export class PosCustomerFeedbackFollowupComponent implements OnInit {
  divisionMS: any;

  actioncolumnhead:any[] = ['Completion Date','Call','Sms','Email','visit','Assign To','Assign By','Remarks'];

  complaintcolumnhead:any[]=['Complaint Desc','Ref No','Category','Staff Courtesy','Product Knowledge','Shop Location','Quality','Experience','Sales Person','Comments'];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  CodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: 'PREFIX_CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PREFIX_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  CodeCodeSelected(e: any) {
    console.log(e);
    this.poscustomerfeedbackfollowForm.controls.Code.setValue(e.PREFIX_CODE);
  }

  salesmanCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesmanCodeSelected(e: any) {
    console.log(e);
    this.poscustomerfeedbackfollowForm.controls.Salesman.setValue(e.SALESPERSON_CODE);
  }

  poscustomerfeedbackfollowForm: FormGroup = this.formBuilder.group({
    Code : [''],
    Salesman: [''],
   
  });


  formSubmit(){

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
