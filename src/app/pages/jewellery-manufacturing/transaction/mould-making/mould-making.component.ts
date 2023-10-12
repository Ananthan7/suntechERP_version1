import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-mould-making',
  templateUrl: './mould-making.component.html',
  styleUrls: ['./mould-making.component.scss']
})
export class MouldMakingComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,   
  ) { }
  close(data?: any) {
    this.activeModal.close(data);
  }
  columnheads : any[] = ['Stock Code','Description','Psc','Gross Weight','Rate','Amount','Location']
  ngOnInit(): void {
  }
  mouldMakingForm: FormGroup = this.formBuilder.group({

  });
  formSubmit() {

  }
}
