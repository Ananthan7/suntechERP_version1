import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-subledger-prefix-master',
  templateUrl: './subledger-prefix-master.component.html',
  styleUrls: ['./subledger-prefix-master.component.scss']
})
export class SubledgerPrefixMasterComponent implements OnInit {

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,

    

  ) { }

  festivalmasterform: FormGroup = this.formBuilder.group({
    prefixcode: [""],
    prefixcodedesc: [""],
    last_no: [""],
   
  });
  

  ngOnInit(): void {
  }

  formSubmit(){
    
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

}
