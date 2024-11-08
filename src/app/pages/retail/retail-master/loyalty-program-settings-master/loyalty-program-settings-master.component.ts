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
