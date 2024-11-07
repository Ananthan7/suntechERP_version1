import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-vat-master",
  templateUrl: "./vat-master.component.html",
  styleUrls: ["./vat-master.component.scss"],
})
export class VatMasterComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;

  expenseHsnOrSacAllocationData: any;
  costCenterAccountData: any;
  accountDateWiseGstDetailsData: any;

  expenseHsnOrSacAllocationColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr. No" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. UnReg" },
    { field: "PROFIT", caption: "I/p Credit" },
  ];

  costCenterAccountColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr. No" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. UnReg" },
    { field: "PROFIT", caption: "I/p Credit" },
  ];

  accountDateWiseGstDetailsColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "S. No" },
    { field: "BRANCH_CODE", caption: "GST Code" },
    { field: "VOCTYPE", caption: "Date" },
    { field: "DIVISION", caption: "GST%" },
    { field: "QTY", caption: "YearMonth" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  gstMasterMainForm: FormGroup = this.formBuilder.group({});

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  openDetails() {}
  removeData() {}
}
