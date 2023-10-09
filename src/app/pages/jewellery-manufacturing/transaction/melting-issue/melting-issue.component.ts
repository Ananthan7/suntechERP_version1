import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MeltingIssueDetailsComponent } from './melting-issue-details/melting-issue-details.component';

@Component({
  selector: 'app-melting-issue',
  templateUrl: './melting-issue.component.html',
  styleUrls: ['./melting-issue.component.scss']
})
export class MeltingIssueComponent implements OnInit {

  constructor(    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,) { }

    
  columnhead:any[] = ['Sr','Div','Job No','Stock Code','Main Stock','Process','Worker','Pcs','Gross Wt','Purity','Purity Wt']
  columnheader : any[] = ['S','SO No','Party Code','Party Name','Job Number','Job Description','Design Code','UNQ Design ID','Process','Worker','Metal Required','Metal Allocation','Allocated Purity','Job Pcs']
  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  openaddMeltingIssueDetails() {
    const modalRef: NgbModalRef = this.modalService.open(MeltingIssueDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  meltingIssueFrom: FormGroup = this.formBuilder.group({

  });

  formSubmit(){

  }
}
