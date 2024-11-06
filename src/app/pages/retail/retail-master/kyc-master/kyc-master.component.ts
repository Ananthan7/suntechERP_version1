import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kyc-master',
  templateUrl: './kyc-master.component.html',
  styleUrls: ['./kyc-master.component.scss']
})
export class KycMasterComponent implements OnInit {

  maindetails:any=[];
  viewMode:boolean = false;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  kycform: FormGroup = this.formBuilder.group({
    mid: [""],
    kyccode: [""],
    kyccodedesc: [""],
    transactionlimit: [""],
   
  });

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){

  }

  addTableData(){
    if(this.kycform.controls.kyccode.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    }else if(this.kycform.controls.kyccodedesc.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Description Cannot be Empty',
      });
    }

  }

  deleteTableData(){
    if (this.maindetails.length > 0) {
      this.maindetails.pop(); 
    }
  }

}
