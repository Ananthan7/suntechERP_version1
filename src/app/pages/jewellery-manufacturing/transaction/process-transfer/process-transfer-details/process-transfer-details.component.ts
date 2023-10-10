import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-process-transfer-details',
  templateUrl: './process-transfer-details.component.html',
  styleUrls: ['./process-transfer-details.component.scss']
})
export class ProcessTransferDetailsComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
  ) { }
  divisionMS: any = 'ID';
 
  columnheader : any[] = ['Div','Stock Code','Color','Clarity','Size','Shape','Pcs','Setted','Weight','Loss','Gain Wt','Type','Rate ','Amount']
  ngOnInit(): void {
  }
  close(data?: any) {
    this.activeModal.close(data);
  }
  processTransferForm: FormGroup = this.formBuilder.group({

  });
  formSubmit() {

  }
}
