import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pos-creditcard-posting',
  templateUrl: './pos-creditcard-posting.component.html',
  styleUrls: ['./pos-creditcard-posting.component.scss']
})
export class PosCreditcardPostingComponent implements OnInit {


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {
   
  }

  creditCardPostingFrom: FormGroup = this.formBuilder.group({
    vocType: [''],
    vocNo: ['1', []],
    vocDate: [''],
    processCode: [''],
  });




  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}

