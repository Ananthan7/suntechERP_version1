import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loyalty-program-settings-master',
  templateUrl: './loyalty-program-settings-master.component.html',
  styleUrls: ['./loyalty-program-settings-master.component.scss']
})
export class LoyaltyProgramSettingsMasterComponent implements OnInit {

  BranchData:any =[];
  maindetails:any =[];
  viewMode:boolean = false;
  modalReference!: NgbModalRef;


  loyaltysettingform: FormGroup = this.formBuilder.group({
    code:[''],
    codedesc:[''],
    division:[''],
    divisions:[''],
    group1:[''],
    group1search:[''],
    group2:[''],
    group2search:[''],
    group3:[''],
    group3search:[''],
    standardamt1:[''],
    standardamt2:[''],
    standardamt3:[''],
    standardamt4:[''],
    redeem:[''],
    no_redeem_points:[''],
    calculate_points:[''],
    reference1:[''],
    subreference:[''],
  })


  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,

  ) { }


  ngOnInit(): void {
  }

  formSubmit(){

  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  BranchDataSelected(data:any){

  }

  clear(element:any){
    this.loyaltysettingform.controls[element].reset();
    }

    addTableData(){
  //     this.modalReference = this.modalService.open(WholesaleSalesmanTargetDetailsComponent, {
  //       size: 'xl',
  //       backdrop: true,//'static'
  //       keyboard: false,
  //       windowClass: 'modal-full-width',
  //  });
    }

    deleteTableData(){
    
    }



}
