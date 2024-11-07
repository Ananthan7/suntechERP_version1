import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-gst-master',
  templateUrl: './gst-master.component.html',
  styleUrls: ['./gst-master.component.scss']
})
export class GstMasterComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;


  
  expenseHsnOrSacAllocationData:any;
  stateWiseGstDetailsData:any
  dateWiseGstDetailsData:any

  expenseHsnOrSacAllocationColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr" },
    { field: "BRANCH_CODE", caption: "Exp. A/c" },
    { field: "VOCTYPE", caption: "Exp. A/c Desc" },
    { field: "DIVISION", caption: "HSN Code" },
    { field: "QTY", caption: "HSN Desc" },
    { field: "amount", caption: "Tax Reg" },
    { field: "PROFIT", caption: "Rev. Un" },
    { field: "PROFIT", caption: "I/p Cre" },
  ];


  stateWiseGstDetailsColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "State Code" },
    { field: "BRANCH_CODE", caption: "Description" },
    { field: "VOCTYPE", caption: "CGST%" },
    { field: "DIVISION", caption: "SGST%" },
    { field: "QTY", caption: "IGST%" },
  ];


  dateWiseGstDetailsColumnHeadings: any[] = [
    { field: "PARTYCODE", caption: "S. No" },
    { field: "BRANCH_CODE", caption: "GST Code" },
    { field: "VOCTYPE", caption: "Date" },
    { field: "DIVISION", caption: "GST%" },
    { field: "QTY", caption: "YearMonth" },
  ];



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  gstMasterMainForm: FormGroup = this.formBuilder.group({});


  ngOnInit(): void {
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  openDetails() {}
  removeData() {}

}
