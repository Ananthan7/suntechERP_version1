import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-jewellerypurchase',
  templateUrl: './jewellerypurchase.component.html',
  styleUrls: ['./jewellerypurchase.component.scss']
})
export class JewellerypurchaseComponent implements OnInit {

  selectedTabIndex = 0;
  tableData:any = [];
  BranchData: MasterSearchModel = {}
  DepartmentData: MasterSearchModel = {}

  JewellerypurchaseMasterForm: FormGroup = this.formBuilder.group({
    code:[''],
    Branch:[''],
    address:[''],
    CountryCode:[''],
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

  addTableData(){}

  deleteTableData(){}
}
