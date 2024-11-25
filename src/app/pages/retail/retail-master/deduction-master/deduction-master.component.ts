import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-deduction-master",
  templateUrl: "./deduction-master.component.html",
  styleUrls: ["./deduction-master.component.scss"],
})
export class DeductionMasterComponent implements OnInit {
  @ViewChild("overlayGlCode") overlayGlCode!: MasterSearchComponent;
  @ViewChild("overlayCountryCode") overlayCountryCode!: MasterSearchComponent;
  @ViewChild("overlayUserDefined1") overlayUserDefined1!: MasterSearchComponent;
  @ViewChild("overlayUserDefined2") overlayUserDefined2!: MasterSearchComponent;
  @ViewChild("overlayUserDefined3") overlayUserDefined3!: MasterSearchComponent;
  @ViewChild("overlayUserDefined4") overlayUserDefined4!: MasterSearchComponent;
  @ViewChild("overlayUserDefined5") overlayUserDefined5!: MasterSearchComponent;
  @ViewChild("overlayUserDefined6") overlayUserDefined6!: MasterSearchComponent;
  @ViewChild("overlayUserDefined7") overlayUserDefined7!: MasterSearchComponent;
  @ViewChild("overlayUserDefined8") overlayUserDefined8!: MasterSearchComponent;
  @ViewChild("overlayUserDefined9") overlayUserDefined9!: MasterSearchComponent;
  @ViewChild("overlayUserDefined10")
  overlayUserDefined10!: MasterSearchComponent;
  @ViewChild("overlayUserDefined11")
  overlayUserDefined11!: MasterSearchComponent;
  @ViewChild("overlayUserDefined12")
  overlayUserDefined12!: MasterSearchComponent;
  @ViewChild("overlayUserDefined13")
  overlayUserDefined13!: MasterSearchComponent;
  @ViewChild("overlayUserDefined14")
  overlayUserDefined14!: MasterSearchComponent;
  @ViewChild("overlayUserDefined15")
  overlayUserDefined15!: MasterSearchComponent;

  @Input() content!: any;

  private subscriptions: Subscription[] = [];

  flag: any;
  code: any;
  dialogBox: any;
  selectedTabIndex = 0;
  tableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  calculationBasis = [
    { field: "Yes", value: 1 },
    { field: "No", value: 0 },
  ];
  avoidFraction!: any;
  considerForLeaveSalary!: any;
  isViewReport: boolean = false;

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

  glCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "GL Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  userDefinedData1: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 01",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  userDefinedData2: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 131,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 02",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field2'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData3: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 132,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 03",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData4: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 133,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 04",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData5: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 134,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 05",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData6: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 135,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 06",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData7: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 136,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 07",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData8: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 137,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 08",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData9: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 138,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 09",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData10: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 139,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 10",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData11: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 140,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 11",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData12: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 141,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 12",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData13: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 142,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 13",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData14: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 143,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 14",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  userDefinedData15: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 144,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "USER DEFINED 15",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES= 'HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  deductionMasterForm: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    description: ["", [Validators.required]],
    considerForLeaveSalary: [""],
    countryCode: ["", [Validators.required]],
    countryDesc: ["", [Validators.required]],
    glCode: ["", [Validators.required]],
    glCodeDesc: ["", [Validators.required]],
    method: ["", [Validators.required]],
    value: ["", [Validators.required]],
    period: [""],
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
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;
    this.initialController(this.flag, this.content);
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
    this.code = DATA.DEDMST_CODE;
    this.deductionMasterForm.controls["code"].setValue(DATA.DEDMST_CODE);
    this.deductionMasterForm.controls["period"].setValue(
      DATA.DEDMST_YEARMONTHLY
    );
    this.deductionMasterForm.controls["calculationBasis"].setValue(
      DATA.DEDMST_BASIS
    );

    this.deductionMasterForm.controls["method"].setValue(
      DATA.DEDMST_PERCENFIXED == true ? "F" : "P"
    );
    this.deductionMasterForm.controls["glCode"].setValue(DATA.DEDMST_ACCODE);
    this.deductionMasterForm.controls["description"].setValue(DATA.DEDMST_DESC);
    this.deductionMasterForm.controls["considerForLeaveSalary"].setValue(
      DATA.DEDMST_LS
    );
    this.deductionMasterForm.controls["countryCode"].setValue(
      DATA.DEDMSTCOUNTRYCODE
    );
    this.deductionMasterForm.controls["avoidFraction"].setValue(
      DATA.DEDMST_AVOIDFRACTION
    );
    this.deductionMasterForm.controls["value"].setValue(
      this.commonService.decimalQuantityFormat(DATA.DEDMST_AMOUNT, "AMOUNT")
    );

    this.deductionMasterForm.controls["userDefined1"].setValue(DATA.UDF1);
    this.deductionMasterForm.controls["userDefined2"].setValue(DATA.UDF2);
    this.deductionMasterForm.controls["userDefined3"].setValue(DATA.UDF3);
    this.deductionMasterForm.controls["userDefined4"].setValue(DATA.UDF4);
    this.deductionMasterForm.controls["userDefined5"].setValue(DATA.UDF5);
    this.deductionMasterForm.controls["userDefined6"].setValue(DATA.UDF6);
    this.deductionMasterForm.controls["userDefined7"].setValue(DATA.UDF7);
    this.deductionMasterForm.controls["userDefined8"].setValue(DATA.UDF8);
    this.deductionMasterForm.controls["userDefined9"].setValue(DATA.UDF9);
    this.deductionMasterForm.controls["userDefined10"].setValue(DATA.UDF10);
    this.deductionMasterForm.controls["userDefined11"].setValue(DATA.UDF11);
    this.deductionMasterForm.controls["userDefined12"].setValue(DATA.UDF12);
    this.deductionMasterForm.controls["userDefined13"].setValue(DATA.UDF13);
    this.deductionMasterForm.controls["userDefined14"].setValue(DATA.UDF14);
    this.deductionMasterForm.controls["userDefined15"].setValue(DATA.UDF15);
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
        const API = `DeductionMaster/DeleteDeductionMaster/${this.code}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid", true)
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

  periodController(event: any) {
    const selectedPeriod = event.value;
    if (
      this.deductionMasterForm &&
      this.deductionMasterForm.controls["period"]
    ) {
      this.deductionMasterForm.controls["period"].setValue(selectedPeriod);
    } else {
      console.error("Form or period control not initialized");
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

  deductionMasterFormSubmit() {
    Object.keys(this.deductionMasterForm.controls).forEach((controlName) => {
      const control = this.deductionMasterForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.deductionMasterForm.controls
    ).some((controlName) => {
      const control = this.deductionMasterForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      let postData = {
        MID: 0,
        DEDMST_CODE: this.deductionMasterForm.value.code,
        DEDMST_DESC: this.deductionMasterForm.value.description,
        DEDMST_ACCODE: this.deductionMasterForm.value.glCode,
        DEDMST_AMOUNT: Number(this.deductionMasterForm.value.value),
        DEDMST_PERCENFIXED:
          this.deductionMasterForm.value.method == "F" ? true : false,
        DEDMST_AVOIDFRACTION: this.avoidFraction == true ? 1 : 0,
        DEDMST_BASIS: this.deductionMasterForm.value.calculationBasis,
        DEDMST_REPORTHEADINGTO: 0,
        DEDMST_YEARMONTHLY: this.deductionMasterForm.value.period,
        DEDMSTCOUNTRYCODE: this.deductionMasterForm.value.countryCode,
        UDF1: this.deductionMasterForm.value.userDefined1 || "kjfbjkhbfj",
        UDF2: this.deductionMasterForm.value.userDefined2 || "kjfbjkhbfj",
        UDF3: this.deductionMasterForm.value.userDefined3 || "kjfbjkhbfj",
        UDF4: this.deductionMasterForm.value.userDefined4 || "kjfbjkhbfj",
        UDF5: this.deductionMasterForm.value.userDefined5 || "kjfbjkhbfj",
        UDF6: this.deductionMasterForm.value.userDefined6 || "kjfbjkhbfj",
        UDF7: this.deductionMasterForm.value.userDefined7 || "kjfbjkhbfj",
        UDF8: this.deductionMasterForm.value.userDefined8 || "kjfbjkhbfj",
        UDF9: this.deductionMasterForm.value.userDefined9 || "kjfbjkhbfj",
        UDF10: this.deductionMasterForm.value.userDefined10 || "kjfbjkhbfj",
        UDF11: this.deductionMasterForm.value.userDefined11 || "kjfbjkhbfj",
        UDF12: this.deductionMasterForm.value.userDefined12 || "kjfbjkhbfj",
        UDF13: this.deductionMasterForm.value.userDefined13 || "kjfbjkhbfj",
        UDF14: this.deductionMasterForm.value.userDefined14 || "kjfbjkhbfj",
        UDF15: this.deductionMasterForm.value.userDefined15 || "kjfbjkhbfj",
        DEDMST_LS: this.considerForLeaveSalary,
      };

      if (this.flag === "EDIT") {
        let API = `DeductionMaster/UpdateDeductionMaster/${this.code}`;
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
        let API = `DeductionMaster/InsertDeductionMaster`;
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

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    if (!searchValue || this.flag == "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
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
            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Filtered Search Result:", searchResult);

              if (FROMCODE === true) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              } else if (FROMCODE === false) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              }

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    this.deductionMasterForm.controls[formName].setValue(
                      matchedItem[field]
                    );
                  } else {
                    console.error(
                      `Property ${field} not found in matched item.`
                    );
                    this.commonService.toastErrorByMsgId("No data found");
                    this.clearLookupData(LOOKUPDATA, FORMNAMES);
                  }
                });
              } else {
                this.commonService.toastErrorByMsgId("No data found");
                this.clearLookupData(LOOKUPDATA, FORMNAMES);
              }
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  // Clear multiple form controls
  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.deductionMasterForm.controls[formName].setValue("");
    });
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  onInput(event: any, controller?: any, checkExistCode?: any) {
    const input = event.target.value;

    if (checkExistCode === true) {
      let API = `DeductionMaster/CheckIfDeductionCodePresent/${input}`;
      let sub: Subscription = this.apiService
        .getDynamicAPI(API)
        .subscribe((res) => {
          if (res.checkifExists === true) {
            let message = `Code Already Exist ! `;
            this.deductionMasterForm.controls[controller].setValue("");
            return this.openDialog("Warning", message, true);
          }
        });
    }
  }

  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    codeData: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, codeData);
        }
      }, 0);
    }
  }

  clearRelevantFields(controllers: string[], codeData: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.deductionMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(codeData, controllers);
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "glCode":
        this.overlayGlCode.showOverlayPanel(event);
        break;
      case "countryCode":
        this.overlayCountryCode.showOverlayPanel(event);
        break;

      case "userDefined1":
        this.overlayUserDefined1.showOverlayPanel(event);
        break;

      case "userDefined2":
        this.overlayUserDefined2.showOverlayPanel(event);
        break;

      case "userDefined3":
        this.overlayUserDefined3.showOverlayPanel(event);
        break;

      case "userDefined4":
        this.overlayUserDefined4.showOverlayPanel(event);
        break;

      case "userDefined5":
        this.overlayUserDefined5.showOverlayPanel(event);
        break;

      case "userDefined6":
        this.overlayUserDefined6.showOverlayPanel(event);
        break;

      case "userDefined7":
        this.overlayUserDefined7.showOverlayPanel(event);
        break;

      case "userDefined8":
        this.overlayUserDefined8.showOverlayPanel(event);
        break;

      case "userDefined9":
        this.overlayUserDefined9.showOverlayPanel(event);
        break;

      case "userDefined10":
        this.overlayUserDefined10.showOverlayPanel(event);
        break;

      case "userDefined11":
        this.overlayUserDefined11.showOverlayPanel(event);
        break;

      case "userDefined12":
        this.overlayUserDefined12.showOverlayPanel(event);
        break;

      case "userDefined13":
        this.overlayUserDefined13.showOverlayPanel(event);
        break;

      case "userDefined14":
        this.overlayUserDefined14.showOverlayPanel(event);
        break;

      case "userDefined15":
        this.overlayUserDefined15.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }
}
