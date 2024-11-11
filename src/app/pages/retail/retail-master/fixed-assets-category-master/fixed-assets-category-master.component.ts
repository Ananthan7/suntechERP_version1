import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';


@Component({
  selector: 'app-fixed-assets-category-master',
  templateUrl: './fixed-assets-category-master.component.html',
  styleUrls: ['./fixed-assets-category-master.component.scss']
})
export class FixedAssetsCategoryMasterComponent implements OnInit {
  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  FixedAssetsCategoryMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    Branch:[''],
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
