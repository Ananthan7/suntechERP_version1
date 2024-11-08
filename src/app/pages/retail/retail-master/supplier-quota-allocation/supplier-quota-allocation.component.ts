import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-supplier-quota-allocation',
  templateUrl: './supplier-quota-allocation.component.html',
  styleUrls: ['./supplier-quota-allocation.component.scss']
})
export class SupplierQuotaAllocationComponent implements OnInit {

  BranchData:any=[];
  maindetails:any=[];

  constructor(  
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,) { }


  supplierquotaform: FormGroup = this.formBuilder.group({
    partycode:[''],
    metal_division:[''],
    periodType:[''],
    fin_year:[''],
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
