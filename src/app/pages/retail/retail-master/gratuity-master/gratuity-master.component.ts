import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-gratuity-master',
  templateUrl: './gratuity-master.component.html',
  styleUrls: ['./gratuity-master.component.scss']
})
export class GratuityMasterComponent implements OnInit {

  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  WPSAgentMasterForm: FormGroup = this.formBuilder.group({
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

  BranchDataSelected(e:any){

  }
}
