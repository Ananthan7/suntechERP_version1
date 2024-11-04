import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss']
})
export class EmployeeMasterComponent implements OnInit {
  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  employeeMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    name:[''],
    otherLanguage:[''],
    Branch:[''],
    BranchDes:[''],
    DepartmentDes:[''],
    Department:[''],
    Address:[''],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(data: any){

  }

  DepartmentSelected(data: any){

  }

  addTableData(){

  }

  deleteTableData(){}
}
