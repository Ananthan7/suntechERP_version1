import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

interface ItemDetailsRow {
  [key: string]: string;
}

@Component({
  selector: "app-cost-and-price-types",
  templateUrl: "./cost-and-price-types.component.html",
  styleUrls: ["./cost-and-price-types.component.scss"],
})
export class CostAndPriceTypesComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  @ViewChild("overlayDesignCode")
  overlayDesignCode!: MasterSearchComponent;
  @ViewChild("overlayDivision") overlayDivision!: MasterSearchComponent;

  flag: any;
  code: any;
  selectedRow: any = null;
  itemDetailsData: ItemDetailsRow[] = [];
  typeList: any;
  dialogBox: any;

  partyDropdown: any[] = [
    { FIELD: "Supplier", VALUE: 0 },
    { FIELD: "Customer", VALUE: 1 },
  ];

  stdMaxAndMinPriceDropdown: any[] = [
    { FIELD: "Price 1", VALUE: "Price 1" },
    { FIELD: "Price 2", VALUE: "Price 2" },
    { FIELD: "Price 3", VALUE: "Price 3" },
    { FIELD: "Price 4", VALUE: "Price 4" },
    { FIELD: "Price 5", VALUE: "Price 5" },
  ];

  detailsGridColumnHeadings: any[] = [
    { FIELD: "STOCK_CODE", CAPTION: "STOCK CODE" },
    { FIELD: "STOCK_DESCRIPTION", CAPTION: "STOCK DESCRIPTION" },
    { FIELD: "UNIT_CODE", CAPTION: "UNIT CODE" },
    { FIELD: "COST", CAPTION: "COST" },
    { FIELD: "STD_VARIANCE", CAPTION: "STD VARIANCE" },
    { FIELD: "PURITY", CAPTION: "PURITY" },
    { FIELD: "WASTAGE", CAPTION: "WASTAGE" },
    { FIELD: "CURRENCY", CAPTION: "CURRENCY" },
    { FIELD: "CSTD_PRICE", CAPTION: "CSTD PRICE" },
    { FIELD: "CMIN_PRICE", CAPTION: "CMIN PRICE" },
    { FIELD: "CMAX_PRICE", CAPTION: "CMAX PRICE" },
  ];
  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: "DIVISION_CODE",
    SEARCH_HEADING: "Division",
    SEARCH_VALUE: "",
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  applyPriceValue: boolean = true;
  forceMaking!: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  costAndPriceTypeMainForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    party: [""],
    division: [""],
    applyPriceValue: [""],
    forceMaking: [""],
    standardPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    minimumPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    maximumPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    standardVariance: [""],
    defaultWastage: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
    this.setFlag(this.flag, this.content);
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    this.code = DATA.CODE;
    this.costAndPriceTypeMainForm.controls["code"].setValue(DATA.CODE);
    this.costAndPriceTypeMainForm.controls["description"].setValue(
      DATA.DESCRIPTION
    );
    this.costAndPriceTypeMainForm.controls["party"].setValue(DATA.PARTY);
    this.costAndPriceTypeMainForm.controls["division"].setValue(
      DATA.DIVISION_CODE
    );

    this.costAndPriceTypeMainForm.controls["defaultWastage"].setValue(
      DATA.DEFAULT_WASTAGE
    );
    this.costAndPriceTypeMainForm.controls["standardVariance"].setValue(
      DATA.STD_VARIANCE
    );
    this.costAndPriceTypeMainForm.controls["applyPriceValue"].setValue(
      DATA.ISPRICECODE
    );
    this.costAndPriceTypeMainForm.controls["forceMaking"].setValue(
      DATA.FORCEMAKINGCHGONNET
    );
    this.costAndPriceTypeMainForm.controls["standardPrice"].setValue(
      DATA.STD_PRICE
    );
    this.costAndPriceTypeMainForm.controls["minimumPrice"].setValue(
      DATA.MIN_PRICE
    );
    this.costAndPriceTypeMainForm.controls["maximumPrice"].setValue(
      DATA.MAX_PRICE
    );
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  DeleteController(DATA?: any) {
    this.ViewController(DATA);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        const API = `CostPriceTypeMetal/DeleteCostPriceTypePriceMetal/${this.code}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? response.message
                      ? response.message
                      : "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid")
                : console.log("Delete Error");
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        this.flag = "VIEW";
      }
    });
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  costAndPriceTypeMainFormSubmit() {
    let postData = {
      MID: 0,
      CODE: this.costAndPriceTypeMainForm.value.code,
      DESCRIPTION: this.costAndPriceTypeMainForm.value.description,
      PARTY: this.costAndPriceTypeMainForm.value.party,
      DEFAULT_WASTAGE: this.costAndPriceTypeMainForm.value.defaultWastage,
      DIVISION_CODE: this.costAndPriceTypeMainForm.value.division,
      STD_PRICE: this.costAndPriceTypeMainForm.value.standardPrice,
      MIN_PRICE: this.costAndPriceTypeMainForm.value.minimumPrice,
      MAX_PRICE: this.costAndPriceTypeMainForm.value.maximumPrice,
      STD_VARIANCE: this.costAndPriceTypeMainForm.value.standardVariance,
      ISPRICECODE: this.applyPriceValue,
      LASTUPDATED: new Date(),
      FORCEMAKINGCHGONNET: this.forceMaking,
      costpricetypeMetalDetail: this.itemDetailsData,

      // [
      //   {
      //     REFMID: 0,
      //     CODE: "string",
      //     PARTY: 0,
      //     DIVISION_CODE: "s",
      //     STOCK_CODE: "string",
      //     UNIT_CODE: "string",
      //     COST: 0,
      //     PURITY: 0,
      //     WASTAGE: 0,
      //     CURRENCY: "stri",
      //     STD_PRICE: "string",
      //     MIN_PRICE: "string",
      //     MAX_PRICE: "string",
      //     STD_VARIANCE: 0,
      //     REMARK: "string",
      //     STOCK_DESCRIPTION: "string",
      //     DT_BRANCH_CODE: "string",
      //     DT_VOCTYPE: "str",
      //     DT_VOCNO: 0,
      //     DT_YEARMONTH: "string",
      //   },
      // ]
    };

    if (this.flag === "EDIT") {
      let API = `CostPriceTypeMetal/UpdateCostPriceTypePriceMetal/${this.code}`;
      let sub: Subscription = this.apiService
        .putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Updated successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            // Handle cases where the result is not successful or undefined
            Swal.fire({
              title: "Failed",
              text: result.message ? result.message : "Failed!",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      let API = `CostPriceTypeMetal/InsertCostPriceTypePriceMetal`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Inserted successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid");
          } else {
            Swal.fire({
              title: "Failed",
              text: "Not Inserted Successfully",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    }
  }

  openItemDetailsRow() {
    const newRow: ItemDetailsRow = {};
    this.detailsGridColumnHeadings.forEach((col) => {
      newRow[col.FIELD] = "";
    });
    this.itemDetailsData = [...this.itemDetailsData, newRow];
  }

  onCellValueChanged(event: any) {
    console.log("Cell Value Changed:", event);
    console.log("Updated Data:", this.itemDetailsData);
  }

  updateCellData(cellData: any, field: string, event: any) {
    console.log("Updating Field:", field, "Value:", event.target.value);
    cellData.data[field] = event.target.value;
    this.itemDetailsData = [...this.itemDetailsData];
    console.log("Updated Data:", this.itemDetailsData);
  }

  onRowSelectionChanged(event: any) {
    this.selectedRow = event.selectedRowsData[0];
  }

  removeItemDetailsRow() {
    if (this.selectedRow) {
      this.itemDetailsData = this.itemDetailsData.filter(
        (row) => row !== this.selectedRow
      );
      this.selectedRow = null;
    } else {
      let message = `Row not Selected !`;
      return this.openDialog("Warning", message, true);
    }
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "division":
        this.overlayDivision.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields: string[] = [],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    if (!searchValue || this.flag === "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };

    const handleNoDataFound = () => {
      this.commonService.toastErrorByMsgId("No data found");
      this.clearLookupData(LOOKUPDATA, FORMNAMES);
    };

    this.commonService.showSnackBarMsg("MSG81447");

    const sub: Subscription = this.apiService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();

          const data = result.dynamicData?.[0];
          console.log("API Response Data:", data);

          if (data?.length) {
            const exactMatch = data.find(
              (item: any) => item.DIVISION_CODE === LOOKUPDATA.SEARCH_VALUE
            );

            if (exactMatch) {
              FORMNAMES.forEach((formName, index) => {
                const field = lookupFields[index];
                if (field && field in exactMatch) {
                  this.costAndPriceTypeMainForm.controls[formName].setValue(
                    exactMatch[field]
                  );
                } else {
                  console.error(`Property ${field} not found in matched item.`);
                  handleNoDataFound();
                }
              });

              return exactMatch;
            } else {
              handleNoDataFound();
            }
          } else {
            handleNoDataFound();
          }
        },
        error: (err: any) => {
          console.error("API Error:", err);
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.costAndPriceTypeMainForm.controls[formName].setValue("");
    });
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.costAndPriceTypeMainForm.controls[ctrl].setValue(value);
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
      const value = e[modelfield];
      if (value !== undefined) {
        this.costAndPriceTypeMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  preventInvalidInput(event: KeyboardEvent) {
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  }

  setFlag(currentFlag: string, DATA: any): void {
    this.flag = currentFlag;

    switch (this.flag) {
      case "ADD":
        this.costAndPriceTypeMainForm.controls["applyPriceValue"].setValue(
          true
        );
        this.applyPriceValueMethod(true);
        break;

      case "VIEW":
        this.costAndPriceTypeMainForm.controls["applyPriceValue"].disable();
        this.costAndPriceTypeMainForm.controls["forceMaking"].disable();
        this.costAndPriceTypeMainForm.controls["party"].disable();
        this.applyPriceValueMethod(DATA.ISPRICECODE);
        break;

      default:
        break;
    }
  }

  applyPriceValueMethod(event: MatCheckboxChange | boolean) {
    this.applyPriceValue = typeof event === "boolean" ? event : event.checked;

    const action = this.applyPriceValue ? "disable" : "enable";

    ["standardPrice", "minimumPrice", "maximumPrice"].forEach((controlName) => {
      this.costAndPriceTypeMainForm.controls[controlName][action]();
    });

    if (this.applyPriceValue) {
      this.detailsGridColumnHeadings = [
        ...this.detailsGridColumnHeadings,
        { FIELD: "STD_PRICE", CAPTION: "STD PRICE" },
        { FIELD: "MIN_PRICE", CAPTION: "MIN PRICE" },
        { FIELD: "MAX_PRICE", CAPTION: "MAX PRICE" },
      ];
    } else {
      this.detailsGridColumnHeadings = this.detailsGridColumnHeadings.filter(
        (heading) =>
          !["MAX_PRICE", "MIN_PRICE", "STD_PRICE"].includes(heading.FIELD)
      );
    }
  }

  matBoxChecker(event: MatCheckboxChange, controller: any) {
    switch (controller) {
      case "applyPriceValue":
        this.applyPriceValueMethod(event);
        break;

      case "forceMaking":
        this.forceMaking = event.checked;
        break;
      default:
        break;
    }
  }
}
