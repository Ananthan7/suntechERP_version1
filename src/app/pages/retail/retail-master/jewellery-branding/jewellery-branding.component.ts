import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

@Component({
  selector: "app-jewellery-branding",
  templateUrl: "./jewellery-branding.component.html",
  styleUrls: ["./jewellery-branding.component.scss"],
})
export class JewelleryBrandingComponent implements OnInit {

  @ViewChild("overlayDesignCode")
  overlayDesignCode!: MasterSearchComponent;
  tableData: any;
  typeList:any

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

  designCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 16,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "DESIGN",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

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

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "design":
        this.overlayDesignCode.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupCodeSelected(e: any, fieldName:any) {
    this.jewelleryBrandingMainForm.controls.design.setValue(e.CODE);
  }
}
