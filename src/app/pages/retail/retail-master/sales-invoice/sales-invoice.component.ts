import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-sales-invoice",
  templateUrl: "./sales-invoice.component.html",
  styleUrls: ["./sales-invoice.component.scss"],
})
export class SalesInvoiceComponent implements OnInit {
  currentDate: any;
  salesManSelectionData: any;
  branchSelectionData: any;
  groupDetailsData: any;

  groupDetailsColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Discount Group 1" },
    { dataField: "STOCK_CODE", caption: "Discount Group 2" },
    { dataField: "STOCK_CODE", caption: "Discount %" },
  ];

  branchSelectionColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Description" },
  ];

  salesManSelectionColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Group" },
    { dataField: "STOCK_CODE", caption: "Sales Man" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  SalesInvoiceMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}
  onSelectionChanged(data: any) {
    console.log(data);
  }

  openRepairdetails() {}

  removedata() {}
}
