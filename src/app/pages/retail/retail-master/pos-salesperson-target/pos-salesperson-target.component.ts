import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-pos-salesperson-target',
  templateUrl: './pos-salesperson-target.component.html',
  styleUrls: ['./pos-salesperson-target.component.scss']
})
export class PosSalespersonTargetComponent implements OnInit {
  BranchData: MasterSearchModel = {};
  maindetails:any=[];
  maindetails2:any=[];

  salespersontargetform: FormGroup = this.formBuilder.group({
    code:[''],
    finyear:[''],
    datefrom:[''],
    dateto:[''],
    salesman:[''],
    diamond_division:[''],
    metal_division:[''],
    diamondjewellery:[''],
    goldmakingcharge:[''],
    goldquantity:[''],
    dia_division:[''],
    metal_divisions_:[''],
  })

  finyearcodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 103,
    SEARCH_FIELD: '',
    SEARCH_HEADING: 'FIN YEAR',
    SEARCH_VALUE: '',
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  selectedfinyear(e: any) {
    console.log(e);
    this.salespersontargetform.controls.finyear.setValue(e.FYEARCODE);
  }



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

  BranchDataSelected(e:any){

  }

  onSelectionChanged(){

  }
  

}
