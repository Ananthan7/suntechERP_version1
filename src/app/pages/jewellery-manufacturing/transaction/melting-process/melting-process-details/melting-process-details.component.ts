import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-melting-process-details',
  templateUrl: './melting-process-details.component.html',
  styleUrls: ['./melting-process-details.component.scss']
})
export class MeltingProcessDetailsComponent implements OnInit {

  jobnoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 46,
    SEARCH_FIELD: 'job_number',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "job_number<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  jobnoCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.jobno.setValue(e.job_number);
  }

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: 'LOCATION_CODE',
    SEARCH_HEADING: 'Button Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  locationCodeSelected(e:any){
    console.log(e);
    this.meltingprocessdetailsForm.controls.location.setValue(e.LOCATION_CODE);
  }

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
  ) { }


  ngOnInit(): void {
  }
  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  meltingprocessdetailsForm: FormGroup = this.formBuilder.group({

  });

  formSubmit(){

  }
}
