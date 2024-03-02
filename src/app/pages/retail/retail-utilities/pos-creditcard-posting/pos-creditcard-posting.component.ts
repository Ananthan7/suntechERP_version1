import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pos-creditcard-posting',
  templateUrl: './pos-creditcard-posting.component.html',
  styleUrls: ['./pos-creditcard-posting.component.scss']
})
export class PosCreditcardPostingComponent implements OnInit {
 
  viewMode: boolean = false;
  tableData: any[] = [];
  branchList: any[] = []

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }
  ngOnInit(): void {
   
      this.viewMode = true;
    }
  
  

  creditCardPostingFrom: FormGroup = this.formBuilder.group({
    branch: [''],
    From: [''],
    To: [''],
    orderedBy: [''],
    trans:[''],
    FilterBy:[''],
    vocdate:[''],
    all:[''],
    bank:[''],
  });

  dateChange(event: any, flag?: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue);
    let yr = date.getFullYear();
    let dt = date.getDate();
    let dy = date.getMonth();
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.creditCardPostingFrom.controls.VocDate.setValue(new Date(date));
    }
  }




  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}

