import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pos-purchase-direct',
  templateUrl: './pos-purchase-direct.component.html',
  styleUrls: ['./pos-purchase-direct.component.scss']
})
export class PosPurchaseDirectComponent implements OnInit {

  posPurchaseForm: FormGroup = this.formBuilder.group({

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
