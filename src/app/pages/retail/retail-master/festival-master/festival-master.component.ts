import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-festival-master',
  templateUrl: './festival-master.component.html',
  styleUrls: ['./festival-master.component.scss']
})


export class FestivalMasterComponent implements OnInit {

  maindetails:any;
  viewMode:boolean = false;


  festivalmaster: FormGroup = this.formBuilder.group({
    mid: [""],
    code: [""],
    description: [""],
   
  });
  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,


  ) { }

  

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

}
