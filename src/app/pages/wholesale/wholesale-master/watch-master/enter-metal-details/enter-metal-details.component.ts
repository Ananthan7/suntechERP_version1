import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-enter-metal-details',
  templateUrl: './enter-metal-details.component.html',
  styleUrls: ['./enter-metal-details.component.scss']
})
export class EnterMetalDetailsComponent implements OnInit {
  divisionMS: any = 'ID';
  myForm!: FormGroup ;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      amountLC: [{ value: '', disabled: true }, Validators.required], // Set disabled to true
      amountFC: ['']
    });


this.myForm.get('amountFC')?.valueChanges.subscribe(value => {
  // Update amountFC whenever amountLC changes
  this.myForm.get('amountLC')?.setValue(value);
});
}


  enterMetalDetailsForm: FormGroup = this.formBuilder.group({
    division :[''],
    karat : [''],
    rateType: [''],
    rate: [''],
    amountLC: [''],
    amountFC: [''],
  })

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e);
    this.enterMetalDetailsForm.controls.division.setValue(e.DIVISION_CODE);
  }

  karatCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatCodeSelected(e:any){
    console.log(e);
    this.enterMetalDetailsForm.controls.karat.setValue(e.KARAT_CODE);
  }

  rateTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'Rate Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypeCodeSelected(e:any){
    console.log(e);
    this.enterMetalDetailsForm.controls.rateType.setValue(e.RATE_TYPE);
  }


  formSubmit() {

  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  continue(){
    
  }
}
