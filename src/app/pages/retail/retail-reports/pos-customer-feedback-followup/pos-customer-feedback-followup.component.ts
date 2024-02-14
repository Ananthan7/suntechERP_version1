import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';

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
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

  formSubmit(){

  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
