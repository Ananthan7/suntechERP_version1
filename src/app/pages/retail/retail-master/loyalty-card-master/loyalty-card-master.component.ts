import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loyalty-card-master',
  templateUrl: './loyalty-card-master.component.html',
  styleUrls: ['./loyalty-card-master.component.scss']
})
export class LoyaltyCardMasterComponent implements OnInit {
  maindetails:any=[];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  loyaltycardform: FormGroup = this.formBuilder.group({
    code:[''],
    codedesc:[''],
    pointsfrom:[''],
    pointsto:[''],
    metaldiscount:[''],
    diamonddiscount:[''],
    pointexpdays:[''],
    sendmessage:[''],
    sendemail:[''],
    pointmulfact:[''],
  })

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }

  BranchDataSelected(e:any){

  }

}
