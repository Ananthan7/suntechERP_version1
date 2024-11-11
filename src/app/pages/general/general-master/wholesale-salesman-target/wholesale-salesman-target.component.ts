import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { WholesaleSalesmanTargetDetailsComponent } from './wholesale-salesman-target-details/wholesale-salesman-target-details.component';

@Component({
  selector: 'app-wholesale-salesman-target',
  templateUrl: './wholesale-salesman-target.component.html',
  styleUrls: ['./wholesale-salesman-target.component.scss']
})
export class WholesaleSalesmanTargetComponent implements OnInit {

  maindetails :any =[];
  viewMode:boolean = false;
  modalReference!: NgbModalRef;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  wholesalesmanform: FormGroup = this.formBuilder.group({
    salesman: [""],
    fin_year: [""],
    datefrom: [""],
    code: [""],
    dateto: [""],
   
  });

  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.wholesalesmanform.controls.sieveset.setValue(e.sieveset);

  }

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){

  }

  
  addTableData(){
    this.modalReference = this.modalService.open(WholesaleSalesmanTargetDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });
  }

  deleteTableData(){
    
  }

}
