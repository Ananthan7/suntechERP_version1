import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
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
  @ViewChild("codeField") codeField!: ElementRef;
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
  branchCode: any;
  preFilledStandardVariance: string = "0";
  preFilledWastage: string = "0";

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
    { FIELD: "STOCK_CODE", CAPTION: "CODE" },
    { FIELD: "DESCRIPTION", CAPTION: "DESCRIPTION" },
    { FIELD: "UNIT_CODE", CAPTION: "UNIT CODE" },
    { FIELD: "STD_COST", CAPTION: "COST" },
    { FIELD: "STD_VARIANCE", CAPTION: "STD VARIANCE" },
    { FIELD: "PURITY", CAPTION: "PURITY" },
    { FIELD: "WASTAGE", CAPTION: "WASTAGE" },
    { FIELD: "CURRENCY", CAPTION: "CURRENCY" },
    // { FIELD: "CSTD_PRICE", CAPTION: "CSTD PRICE" },
    // { FIELD: "CMIN_PRICE", CAPTION: "CMIN PRICE" },
    // { FIELD: "CMAX_PRICE", CAPTION: "CMAX PRICE" },
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
    code: ["", [Validators.required]],
    description: ["", [Validators.required]],
    party: ["", [Validators.required]],
    division: ["", [Validators.required]],
    applyPriceValue: [""],
    forceMaking: [""],
    standardPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    minimumPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    maximumPrice: [this.stdMaxAndMinPriceDropdown[0].VALUE],
    standardVariance: ["", [Validators.required]],
    defaultWastage: ["", [Validators.required]],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.branchCode = this.commonService.branchCode;
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    console.log(this.flag);

    this.initialController(this.flag, this.content);
    this.setFlag(this.flag, this.content);
  }
  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
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
      this.getItemDetailsData()
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
      this.commonService.decimalQuantityFormat(DATA.DEFAULT_WASTAGE, "AMOUNT")
    );
    this.costAndPriceTypeMainForm.controls["standardVariance"].setValue(
      this.commonService.decimalQuantityFormat(DATA.STD_VARIANCE, "AMOUNT")
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

              response.status === "Success" &&
                this.close("reloadMainGrid", true);
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
        this.close("reloadMainGrid", true);
      }
    });
  }

  close(data?: any, calling?: boolean) {
    if (this.flag !== "VIEW" && !calling) {
      Swal.fire({
        title: "Are you sure you want to close this ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Close!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close(data);
        }
      });
    } else {
      this.activeModal.close(data);
    }
  }

  costAndPriceTypeMainFormSubmit() {
    Object.keys(this.costAndPriceTypeMainForm.controls).forEach(
      (controlName) => {
        const control = this.costAndPriceTypeMainForm.controls[controlName];
        if (control.validator && control.validator({} as AbstractControl)) {
          control.markAsTouched();
        }
      }
    );

    const requiredFieldsInvalid = Object.keys(
      this.costAndPriceTypeMainForm.controls
    ).some((controlName) => {
      const control = this.costAndPriceTypeMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      let postData = {
        MID: 0,
        CODE: this.costAndPriceTypeMainForm.value.code,
        DESCRIPTION: this.costAndPriceTypeMainForm.value.description,
        PARTY: this.costAndPriceTypeMainForm.value.party,
        DEFAULT_WASTAGE: this.costAndPriceTypeMainForm.value.defaultWastage,
        DIVISION_CODE: this.costAndPriceTypeMainForm.value.division,
        STD_PRICE:
          this.costAndPriceTypeMainForm.value.standardPrice ||
          this.stdMaxAndMinPriceDropdown[0].VALUE,
        MIN_PRICE:
          this.costAndPriceTypeMainForm.value.minimumPrice ||
          this.stdMaxAndMinPriceDropdown[0].VALUE,
        MAX_PRICE:
          this.costAndPriceTypeMainForm.value.maximumPrice ||
          this.stdMaxAndMinPriceDropdown[0].VALUE,
        STD_VARIANCE: this.costAndPriceTypeMainForm.value.standardVariance || 0,
        ISPRICECODE: this.applyPriceValue,
        LASTUPDATED: new Date(),
        FORCEMAKINGCHGONNET: this.forceMaking,
        costpricetypeMetalDetail: this.itemDetailsData.map((item) => ({
          REFMID: 0,
          CODE: this.costAndPriceTypeMainForm.value.code,
          PARTY: this.costAndPriceTypeMainForm.value.party,
          DIVISION_CODE: this.costAndPriceTypeMainForm.value.division,
          STOCK_CODE: item.STOCK_CODE || "",
          STOCK_DESCRIPTION: item.STOCK_DESCRIPTION || "",
          UNIT_CODE: item.UNIT_CODE || "",
          COST: Number(item.COST) || 0,
          PURITY: Number(item.PURITY) || 0,
          WASTAGE: Number(item.WASTAGE) || 0,
          CURRENCY: item.CURRENCY || "",
          STD_PRICE: item.STD_PRICE || "",
          MIN_PRICE: item.MIN_PRICE || "",
          MAX_PRICE: item.MAX_PRICE || "",
          STD_VARIANCE: Number(item.STD_VARIANCE) || 0,
          REMARK: "",
          DT_BRANCH_CODE: this.branchCode,
          DT_VOCTYPE: this.branchCode,
          DT_VOCNO: 0,
          DT_YEARMONTH: this.branchCode,
        })),
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

              this.close("reloadMainGrid", true);
            } else {
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
                text: result.message
                  ? result.message
                  : "Inserted successfully!",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              this.close("reloadMainGrid", true);
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
    } else {
      this.commonService.showSnackBarMsg("Please fill mandatory fields.");
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
        this.costAndPriceTypeMainForm.controls["standardPrice"].disable();
        this.costAndPriceTypeMainForm.controls["minimumPrice"].disable();
        this.costAndPriceTypeMainForm.controls["maximumPrice"].disable();

        this.applyPriceValueMethod(DATA.ISPRICECODE == "Y");
        break;

      default:
        break;
    }
  }

  applyPriceValueMethod(event: MatCheckboxChange | boolean) {
    this.applyPriceValue = typeof event === "boolean" ? event : event.checked;
    console.log(this.applyPriceValue);

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

  stockMastersData() {
    let PARAMS = { MODE: this.flag };
    let API = `CostPriceTypeMetal/GetSelectStockMasters/${this.branchCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPIwithParamsCustom(API, PARAMS)
      .subscribe(
        (result) => {
          if (result.status.trim() === "Success") {
            this.itemDetailsData = result.dynamicData[0].map((item: any) => ({
              ...item,
              // PURITY: this.commonService.transformDecimalVB(6, item.value),
              CURRENCY: "AED",
              WASTAGE: this.preFilledWastage,
              STD_VARIANCE: this.preFilledStandardVariance,
              STD_PRICE: this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(0),
                "AMOUNT"
              ),
              MIN_PRICE: this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(0),
                "AMOUNT"
              ),
              MAX_PRICE: this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(0),
                "AMOUNT"
              ),
            }));

            console.log(this.itemDetailsData);
          }
        },
        (err) => {
          console.error("Error fetching data:", err);
          this.commonService.toastErrorByMsgId("MSG1531");
        }
      );
  }

  addToGrid(event: any, controller?: any) {
    let value = event.target.value;
    console.log("Event value:", value);

    switch (controller) {
      case "standardVariance":
        !this.itemDetailsData.length
          ? (this.preFilledStandardVariance =
              this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(value),
                "AMOUNT"
              ))
          : (this.itemDetailsData = this.itemDetailsData.map((item: any) => ({
              ...item,
              STD_VARIANCE: this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(value),
                "AMOUNT"
              ),
            })));

        console.log(this.preFilledStandardVariance);

        break;

      case "defaultWastage":
        !this.itemDetailsData.length
          ? (this.preFilledWastage = this.commonService.decimalQuantityFormat(
              this.commonService.emptyToZero(value),
              "AMOUNT"
            ))
          : (this.itemDetailsData = this.itemDetailsData.map((item: any) => ({
              ...item,
              WASTAGE: this.commonService.decimalQuantityFormat(
                this.commonService.emptyToZero(value),
                "AMOUNT"
              ),
            })));

        console.log(this.preFilledWastage);

        break;

      default:
        console.log("No matching case found for controller:", controller);
        break;
    }
  }

  getItemDetailsData() {
    let API = `CostPriceTypeMetal/GetCostPriceTypeMetalDetail/${this.code}`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          console.log(result.response);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }
}
