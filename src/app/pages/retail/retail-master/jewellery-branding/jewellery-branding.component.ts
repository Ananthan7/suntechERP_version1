import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-jewellery-branding",
  templateUrl: "./jewellery-branding.component.html",
  styleUrls: ["./jewellery-branding.component.scss"],
})
export class JewelleryBrandingComponent implements OnInit {
  tableData: any;

  columns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Division" },
    { dataField: "REPAIRBAGNO", caption: "Item Code" },
    { dataField: "PARTYNAME", caption: "Description" },
    { dataField: "MOBILE", caption: "Design" },
    { dataField: "DELIVERYDATE", caption: "Category" },
    { dataField: "STATUS", caption: "Sub Category" },
    { dataField: "STATUS", caption: "Type" },
    { dataField: "STATUS", caption: "Brand" },
    { dataField: "STATUS", caption: "Flouresence" },
    { dataField: "STATUS", caption: "Range" },
    { dataField: "STATUS", caption: "Color" },
    { dataField: "STATUS", caption: "Style" },
    { dataField: "STATUS", caption: "Time" },
    { dataField: "STATUS", caption: "Vendor Ref" },
    { dataField: "STATUS", caption: "Vendor" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  jewelleryBrandingMainForm: FormGroup = this.formBuilder.group({});

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
