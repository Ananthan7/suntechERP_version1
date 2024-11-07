import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reorder-level-setup',
  templateUrl: './reorder-level-setup.component.html',
  styleUrls: ['./reorder-level-setup.component.scss']
})
export class ReorderLevelSetupComponent implements OnInit {

  tableData:any;

  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr" },
    { field: "BRANCH_CODE", caption: "Recorder Group" },
    { field: "VOCTYPE", caption: "Recorder Group" },
    { field: "DIVISION", caption: "Recorder Group" },
    { field: "QTY", caption: "Weight" },
    { field: "amount", caption: "Pcs" },
    { field: "PROFIT", caption: "Amount" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  reorderLevelSetupMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

}
