import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-stone-weight-master',
  templateUrl: './stone-weight-master.component.html',
  styleUrls: ['./stone-weight-master.component.scss']
})
export class StoneWeightMasterComponent implements OnInit {

  data:any;
  viewMode:boolean = false;
  


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
    this.stoneweightmaster.controls.sieveset.setValue(e.sieveset);

  }


  
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,


  ) { }

  stoneweightmaster: FormGroup = this.formBuilder.group({
    mid: [""],
    sieveset: [""],
    division: [""],
    sievefrom: [""],
    sievefromdesc: [""],
    sizefrom: [""],
    pcs: [""],
    pointerwt: [""],
    shape: [""],
    sieveto: [""],
    sievetodesc: [""],
    sizeto: [""],
    variance1: [""],
    variance2: [""],
   
  });

  ngOnInit(): void {
  }

  formSubmit(){

  }


  close(data?: any) {
    this.activeModal.close(data);
  }

  deleteTableData(){

  }

  addTableData(){

  }
}
