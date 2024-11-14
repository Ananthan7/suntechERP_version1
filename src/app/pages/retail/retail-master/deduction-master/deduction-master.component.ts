import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

@Component({
  selector: "app-deduction-master",
  templateUrl: "./deduction-master.component.html",
  styleUrls: ["./deduction-master.component.scss"],
})
export class DeductionMasterComponent implements OnInit {
  @Input() content!: any;

  private subscriptions: Subscription[] = [];

  flag: any;
  selectedTabIndex = 0;
  tableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  calculationBasis = [{ field: "Yes" }, { field: "No" }];
  avoidFraction!: any;
  considerForLeaveSalary!: boolean;


  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  userDefinedData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  deductionMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    considerForLeaveSalary: [""],
    countryCode: [""],
    countryDesc: [""],
    glCode: [""],
    glCodeDesc: [""],
    method: [""],
    value: [""],
    avoidFraction: [""],
    reportHeadingCode: [""],
    reportHeadingDesc: [""],
    calculationBasis: [""],
    userDefined1: [""],
    userDefined2: [""],
    userDefined3: [""],
    userDefined4: [""],
    userDefined5: [""],
    userDefined6: [""],
    userDefined7: [""],
    userDefined8: [""],
    userDefined9: [""],
    userDefined10: [""],
    userDefined11: [""],
    userDefined12: [""],
    userDefined13: [""],
    userDefined14: [""],
    userDefined15: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.flag = this.content!.FLAG;
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  BranchDataSelected(e: any) {}

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.deductionMasterForm.controls[ctrl].setValue(value);
          } else {
            console.warn(`Model field '${field}' not found in event object.`);
          }
        });
      } else {
        console.warn(
          "Controller and modelfield arrays must be of equal length."
        );
      }
    } else if (controller && modelfield) {
      // Handle single controller and field
      const value = e[modelfield];
      if (value !== undefined) {
        this.deductionMasterForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  boxChecker(event: MatCheckboxChange, controller: any) {
    switch (controller) {
      case "avoidFraction":
        this.avoidFraction = event.checked;
        break;

      case "considerForLeaveSalary":
        this.considerForLeaveSalary = event.checked;
        break;

      default:
        break;
    }
  }
}
