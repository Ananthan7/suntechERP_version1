import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { YearlyBudgetPlannerDetailsComponent } from './yearly-budget-planner-details/yearly-budget-planner-details.component';


@Component({
  selector: 'app-yearly-budget-planner',
  templateUrl: './yearly-budget-planner.component.html',
  styleUrls: ['./yearly-budget-planner.component.scss']
})
export class YearlyBudgetPlannerComponent implements OnInit {
  modalReference!: NgbModalRef;


  BranchData: MasterSearchModel = {};
  maindetails: any = [];
  viewMode:boolean = false;



  constructor(
    private activeModal:NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,


  ) { }

  yearlybudgetform: FormGroup = this.formBuilder.group({
    branchcode:[''],
    date_from:[''],
    finyear:[''],
    dateto:[''],
    narration:[''],
    datefrom:[''],
    description:[''],
    increase:[''],
  })

  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSubmit(){
    
  }
  addTableData(){
    if(this.yearlybudgetform.controls.branchcode.value == ""){
      Swal.fire({
        title: 'Error',
        text: 'Code Cannot be Empty',
      });
    }else{
     
        this.modalReference = this.modalService.open(YearlyBudgetPlannerDetailsComponent, {
          size: 'xl',
          backdrop: true,//'static'
          keyboard: false,
          windowClass: 'modal-full-width',
      });
      
    }

  }

  deleteTableData(){
    if (this.maindetails.length > 0) {
      this.maindetails.pop(); 
    }
  }

  BranchDataSelected(e:any){

  }

}
