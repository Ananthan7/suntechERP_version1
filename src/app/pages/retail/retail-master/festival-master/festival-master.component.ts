import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-festival-master',
  templateUrl: './festival-master.component.html',
  styleUrls: ['./festival-master.component.scss']
})


export class FestivalMasterComponent implements OnInit {

  maindetails:any=[];
  viewMode:boolean = false;
  currentYear: number = new Date().getFullYear();
  minYear: Date = new Date(this.currentYear - 100, 0, 1);
  maxYear: Date = new Date(this.currentYear + 10, 11, 31);


  festivalmasterform: FormGroup = this.formBuilder.group({
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
    if(this.festivalmasterform.controls.code.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    }else if(this.festivalmasterform.controls.description.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Description Cannot be Empty',
      });
    } else {
      const newRow = {
        SRNO: this.maindetails.length + 1,  
        YEAR: "",  
        FROM_DATE: "",  
        TO_DATE: "",  
        TARGET: "", 
      };
      console.log(newRow);
      
      this.maindetails.push(newRow);
      this.festivalmasterform.reset(); 
    }

  }

  deleteTableData(){
    if (this.maindetails.length > 0) {
      this.maindetails.pop(); 
    }
  }

  checkadd(){
    
  }

  onDateChanged(event: any, cellData: any) {
    console.log('New date selected:', event.value);
    cellData.setValue(event.value);
  }

}
