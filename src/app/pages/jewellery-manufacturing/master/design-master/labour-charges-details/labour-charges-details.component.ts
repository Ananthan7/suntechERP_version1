import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-labour-charges-details',
  templateUrl: './labour-charges-details.component.html',
  styleUrls: ['./labour-charges-details.component.scss']
})
export class LabourChargesDetailsComponent implements OnInit {
  @Input() content!: any; 
  columnhead:any[]=['SRNO','Code','Type','Method','Division','Shape','SizeFrom','SizeTo','Unit','SellingRate','']
  labourChargesDetailsForm: FormGroup = this.formBuilder.group({
    processCode:[''],
    processDesc:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }



  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  formSubmit(){

  }

  deleteRecord(){

  }
}
