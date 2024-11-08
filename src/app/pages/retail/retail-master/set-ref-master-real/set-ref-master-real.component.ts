import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-set-ref-master-real",
  templateUrl: "./set-ref-master-real.component.html",
  styleUrls: ["./set-ref-master-real.component.scss"],
})
export class SetRefMasterRealComponent implements OnInit {
  tableData: any;

  columns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Stock Code" },
    { dataField: "REPAIRBAGNO", caption: "Description" },
    { dataField: "PARTYNAME", caption: "Select" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  setRefMasterMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  onSelectionChanged(data: any) {}

  openRepairdetails() {}
  removedata() {}
}
