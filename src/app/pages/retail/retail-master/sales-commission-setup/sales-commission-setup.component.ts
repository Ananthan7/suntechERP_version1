import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sales-commission-setup',
  templateUrl: './sales-commission-setup.component.html',
  styleUrls: ['./sales-commission-setup.component.scss']
})
export class SalesCommissionSetupComponent implements OnInit {
  maindetails2:any =[];
  viewMode:boolean = false;


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  salescommissionform: FormGroup = this.formBuilder.group({
    code:[''],
    start_date:[''],
    end_date:[''],
    group:[''],
    metal_commission:[''],
    diamond_commission:[''],
    dia_division:[''],
    metal_divisions_:[''],
  })


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }

  addTableData(){

  }

  deleteTableData(){

  }

  onSelectionChanged(event:any){

  }

}
