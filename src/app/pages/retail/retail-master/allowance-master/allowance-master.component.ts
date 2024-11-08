import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-allowance-master',
  templateUrl: './allowance-master.component.html',
  styleUrls: ['./allowance-master.component.scss']
})
export class AllowanceMasterComponent implements OnInit {

  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  employeeMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
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

  formSubmit(){
    
  }

  BranchDataSelected(e:any){

  }
}
