import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

export interface TableElement {
  description: string;
  fc: number;
  lc: number;
}

@Component({
  selector: "app-manufactured-items",
  templateUrl: "./manufactured-items.component.html",
  styleUrls: ["./manufactured-items.component.scss"],
})
export class ManufacturedItemsComponent implements OnInit {
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;
  @ViewChild("overlayDesignCode")
  overlayDesignCode!: MasterSearchComponent;

  metalDetailsData: any;
  stoneDetailsData: any;
  componentAndLaburChargeSummaryData: any;
  partyDetailsData: any;

  displayedColumns: string[] = ["srNo", "description", "fc", "lc"];
  dataSource: TableElement[] = [
    { description: "Settings", fc: 0.0, lc: 0.0 },
    { description: "Polishing", fc: 0.0, lc: 0.0 },
    { description: "Rhodium", fc: 0.0, lc: 0.0 },
  ];

  fields = Array.from({ length: 15 }, (_, index) => ({
    label: `User defined ${index + 1}`,
    formControlName: `userDefined${index + 1}`,
  }));

  typeList: any[] = [{ field: "New" }, { field: "Used" }];

  metalDetailsHeadings: any[] = [
    { field: "BRANCH_CODE", caption: "Div" },
    { field: "VOCTYPE", caption: "Karat" },
    { field: "VOCNO", caption: "Stock Code" },
    { field: "VOCDATE", caption: "Gross wt." },
    { field: "QTY", caption: "Purity" },
    { field: "amount", caption: "Pure wt." },
    { field: "PROFIT", caption: "Rate Type" },
    { field: "PROFIT", caption: "Metal Rate" },
    { field: "PROFIT", caption: "Rate/Gms" },
    { field: "PROFIT", caption: "Amount" },
    { field: "PROFIT", caption: "Lab Rate" },
    { field: "PROFIT", caption: "Lab Amount" },
    { field: "PROFIT", caption: "Markup%" },
    { field: "PROFIT", caption: "Sale Value" },
  ];

  stoneDetailsHeadings: any[] = [
    { field: "BRANCH_CODE", caption: "Div" },
    { field: "VOCTYPE", caption: "Stock Code" },
    { field: "VOCNO", caption: "Shape" },
    { field: "VOCDATE", caption: "Color" },
    { field: "TOTAL_AMOUNTFC", caption: "Clarity" },
    { field: "BALANCE_FC", caption: "Sieve" },
    { field: "BALANCE_FC", caption: "Size" },
    { field: "BALANCE_FC", caption: "Pcs" },
    { field: "BALANCE_FC", caption: "Carat" },
    { field: "BALANCE_FC", caption: "Currency" },
    { field: "BALANCE_FC", caption: "Pc Code" },
    { field: "BALANCE_FC", caption: "Lab Rate" },
    { field: "BALANCE_FC", caption: "Lab Amount" },
    { field: "BALANCE_FC", caption: "LbCode" },
  ];

  partyDetailsHeading: any[] = [
    { field: "BRANCH_CODE", caption: "Sr#" },
    { field: "VOCTYPE", caption: "Div" },
    { field: "VOCNO", caption: "Party Code" },
    { field: "VOCDATE", caption: "Design Code" },
    { field: "TOTAL_AMOUNTFC", caption: "Pcs" },
    { field: "Loyalty Points", caption: "Gross Wt." },
    { field: "Redeem", caption: "Rate" },
    { field: "Redeem", caption: "Amount" },
  ];

  loyaltyTransDetailsHeading: any[] = [
    { field: "BRANCH_CODE", caption: "Branch Code" },
    { field: "VOCTYPE", caption: "Voucher Type" },
    { field: "VOCNO", caption: "Voc No" },
    { field: "VOCDATE", caption: "Voc Date" },
    { field: "TOTAL_AMOUNTFC", caption: "Sales Amount" },
    { field: "Loyalty Points", caption: "Loyalty Points" },
    { field: "Redeem", caption: "Redeem Points" },
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

  manufacturedItemMainForm: FormGroup = this.formBuilder.group({});



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}

  close(data?: any) {
    this.activeModal.close(data);
  }

  formSave() {}

  deleteMaster() {}

  getTotalFC(): number {
    return this.dataSource.reduce((acc, element) => acc + element.fc, 0);
  }

  getTotalLC(): number {
    return this.dataSource.reduce((acc, element) => acc + element.lc, 0);
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
    this.manufacturedItemMainForm.controls.design.setValue(e.CODE);
  }
}
