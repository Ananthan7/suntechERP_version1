import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-additional-amount',
  templateUrl: './additional-amount.component.html',
  styleUrls: ['./additional-amount.component.scss']
})
export class AdditionalAmountComponent implements OnInit {

  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  costAndPriceTypeMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}
}
