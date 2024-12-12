import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTabGroup } from "@angular/material/tabs";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-overtime-master",
  templateUrl: "./overtime-master.component.html",
  styleUrls: ["./overtime-master.component.scss"],
})
export class OvertimeMasterComponent implements OnInit {
  @ViewChild("codeField") codeField!: ElementRef;
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
  @ViewChild("overlayCode")
  overlayCode!: MasterSearchComponent;
  @ViewChild("overlayDesc")
  overlayDescription!: MasterSearchComponent;
  @ViewChild("overlayGlCode")
  overlayGlCode!: MasterSearchComponent;
  @ViewChild("overlayGlDesc")
  overlayGlDesc!: MasterSearchComponent;

  @ViewChild("tabGroup") tabGroup!: MatTabGroup;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;

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

  flag: any;
  basedOnDropdown!: any[];
  calculateByDropdown!: any[];
  code: any;
  countryCode: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  overTimeMainForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    glCode: [""],
    glDesc: [""],
    calculateBy: [""],
    perHour: [""],
    basedOn: [""],
    holidayOverTime: [""],
    calculateArrear: [""],
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

  ngOnInit(): void {
    this.getDropDowns();
    this.countryCode = this.commonService.allbranchMaster.COUNTRY_CODE;
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;
    this.initialController(this.flag, this.content);
    this.setFlag(this.flag, this.content);
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
    }
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }
    if (FLAG === "DELETE") {
      FLAG = "VIEW";
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    console.log(DATA);

    this.code = DATA.CODE;
    this.overTimeMainForm.controls["code"].setValue(DATA.CODE);
    this.overTimeMainForm.controls["description"].setValue(DATA.DESCRIPTION);
    this.overTimeMainForm.controls["glCode"].setValue(DATA.ACCODE);
    this.overTimeMainForm.controls["glDesc"].setValue(DATA.ACCODE);
    this.overTimeMainForm.controls["perHour"].setValue(
      this.commonService.decimalQuantityFormat(
        this.commonService.emptyToZero(DATA.VALUE),
        "AMOUNT"
      )
    );
    this.overTimeMainForm.controls["basedOn"].setValue(
      DATA.BASED_ON.toString()
    );
    this.overTimeMainForm.controls["calculateBy"].setValue(
      DATA.PER_FIXED.toString()
    );
    this.overTimeMainForm.controls["holidayOverTime"].setValue(
      DATA.HOLIDAYOT === 0
    );
    this.overTimeMainForm.controls["calculateArrear"].setValue(
      DATA.CALCULATE_ARREAR === 0
    );

    this.overTimeMainForm.controls["userDefined1"].setValue(DATA.UDF1);
    this.overTimeMainForm.controls["userDefined2"].setValue(DATA.UDF2);
    this.overTimeMainForm.controls["userDefined3"].setValue(DATA.UDF3);
    this.overTimeMainForm.controls["userDefined4"].setValue(DATA.UDF4);
    this.overTimeMainForm.controls["userDefined5"].setValue(DATA.UDF5);
    this.overTimeMainForm.controls["userDefined6"].setValue(DATA.UDF6);
    this.overTimeMainForm.controls["userDefined7"].setValue(DATA.UDF7);
    this.overTimeMainForm.controls["userDefined8"].setValue(DATA.UDF8);
    this.overTimeMainForm.controls["userDefined9"].setValue(DATA.UDF9);
    this.overTimeMainForm.controls["userDefined10"].setValue(DATA.UDF10);
    this.overTimeMainForm.controls["userDefined11"].setValue(DATA.UDF11);
    this.overTimeMainForm.controls["userDefined12"].setValue(DATA.UDF12);
    this.overTimeMainForm.controls["userDefined13"].setValue(DATA.UDF13);
    this.overTimeMainForm.controls["userDefined14"].setValue(DATA.UDF14);
    this.overTimeMainForm.controls["userDefined15"].setValue(DATA.UDF15);
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
        const API = `PayOvertimeMaster/DeletePayOvertimeMaster/${this.code}`;
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

  getDropDowns() {
    this.basedOnDropdown = this.getUniqueValues(
      this.commonService.getComboFilterByID("OVERTIME BASED ON"),
      "ENGLISH"
    );
    console.log(this.basedOnDropdown);

    this.calculateByDropdown = this.getUniqueValues(
      this.commonService.getComboFilterByID("OVERTIME CALCULATION BY"),
      "ENGLISH"
    );

    console.log(this.calculateByDropdown);
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
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

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    lookupFields?: string[]
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
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    this.overTimeMainForm.controls[formName].setValue(
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

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.overTimeMainForm.controls[formName].setValue("");
    });
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.overTimeMainForm.controls[ctrl].setValue(value);
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
        this.overTimeMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  openTab(
    event: KeyboardEvent,
    formControlName: string,
    LookupData?: MasterSearchModel
  ) {
    if (LookupData) {
      this.onKeyDown(event, ["glCode", "glDesc"], LookupData);
    }
    const control = this.overTimeMainForm.get(formControlName);
    if (
      (event.key === "Tab" || event.key === "Enter") &&
      control?.value === "" &&
      control?.valid
    ) {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "code":
        this.overlayCode.showOverlayPanel(event);
        break;

      case "description":
        this.overlayDescription.showOverlayPanel(event);
        break;

      case "glCode":
        this.overlayGlCode.showOverlayPanel(event);
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
      const control = this.overTimeMainForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(codeData, controllers);
  }

  overTimeMainFormSubmit() {
    Object.keys(this.overTimeMainForm.controls).forEach((controlName) => {
      const control = this.overTimeMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.overTimeMainForm.controls
    ).some((controlName) => {
      const control = this.overTimeMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MID: 0,
        CODE: this.overTimeMainForm.value.code,
        DESCRIPTION: this.overTimeMainForm.value.description,
        ACCODE: this.overTimeMainForm.value.glCode,
        VALUE: Number(this.overTimeMainForm.value.perHour),
        PER_FIXED: Number(this.overTimeMainForm.value.calculateBy),
        BASED_ON: Number(this.overTimeMainForm.value.basedOn),
        COUNTRYCODE: this.countryCode,
        UDF1: this.overTimeMainForm.value.userDefined1,
        UDF2: this.overTimeMainForm.value.userDefined2,
        UDF3: this.overTimeMainForm.value.userDefined3,
        UDF4: this.overTimeMainForm.value.userDefined4,
        UDF5: this.overTimeMainForm.value.userDefined5,
        UDF6: this.overTimeMainForm.value.userDefined6,
        UDF7: this.overTimeMainForm.value.userDefined7,
        UDF8: this.overTimeMainForm.value.userDefined8,
        UDF9: this.overTimeMainForm.value.userDefined9,
        UDF10: this.overTimeMainForm.value.userDefined10,
        UDF11: this.overTimeMainForm.value.userDefined11,
        UDF12: this.overTimeMainForm.value.userDefined12,
        UDF13: this.overTimeMainForm.value.userDefined13,
        UDF14: this.overTimeMainForm.value.userDefined14,
        UDF15: this.overTimeMainForm.value.userDefined15,
        HOLIDAYOT: this.overTimeMainForm.value.holidayOverTime === true ? 1 : 0,
        CALCULATE_ARREAR:
          this.overTimeMainForm.value.calculateArrear === true ? 1 : 0,
      };

      if (this.flag === "EDIT") {
        let API = `PayOvertimeMaster/UpdatePayOvertimeMaster/${this.code}`;
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
        let API = `PayOvertimeMaster/InsertPayOvertimeMaster`;
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

  setFlag(currentFlag: string, DATA: any): void {
    this.flag = currentFlag;

    switch (this.flag) {
      case "VIEW":
        this.overTimeMainForm.controls["holidayOverTime"].disable();
        this.overTimeMainForm.controls["calculateArrear"].disable();
        this.overTimeMainForm.controls["basedOn"].disable();
        this.overTimeMainForm.controls["calculateBy"].disable();
        break;

      default:
        break;
    }
  }
}
