import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-melting-process-details',
  templateUrl: './melting-process-details.component.html',
  styleUrls: ['./melting-process-details.component.scss']
})
export class MeltingProcessDetailsComponent implements OnInit {

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


  meltingprocessForm: FormGroup = this.formBuilder.group({

  });

  formSubmit(){

  }
}
