import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-holiday-master",
  templateUrl: "./holiday-master.component.html",
  styleUrls: ["./holiday-master.component.scss"],
})
export class HolidayMasterComponent implements OnInit {
  tableData: any;
  currentDate = new Date();

  columns = [
    { dataField: "VOCNO", caption: "Sr No " },
    { dataField: "STOCK_CODE", caption: "Country Code" },
    { dataField: "REPAIRBAGNO", caption: "Date" },
    { dataField: "PARTYNAME", caption: "Remarks" },
    { dataField: "PARTYNAME", caption: "Remove" },
  ];

  fields = Array.from({ length: 15 }, (_, index) => ({
    label: `User defined ${index + 1}`,
    formControlName: `userDefined${index + 1}`,
  }));

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  holidaymasterMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}
  onSelectionChanged(data: any) {
    console.log(data);
  }
}
