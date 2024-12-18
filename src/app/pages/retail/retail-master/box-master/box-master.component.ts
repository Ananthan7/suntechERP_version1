import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-box-master",
  templateUrl: "./box-master.component.html",
  styleUrls: ["./box-master.component.scss"],
})
export class BoxMasterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("overlayStockCode")
  overlayStockCode!: MasterSearchComponent;

  @ViewChild("overlaylocationCode")
  overlaylocationCode!: MasterSearchComponent;
  @ViewChild("codeField") codeField!: ElementRef;
  private subscriptions: Subscription[] = [];
  itemDetailsData: any = [];

  flag: any;
  boxNumber: any;

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "Stock Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: "LOCATION_CODE",
    SEARCH_HEADING: "location Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  columnHeadings: any[] = [
    { field: "BOX_NO", caption: "Box No" },
    { field: "FROM_SERIALNO", caption: "Form Serial No" },
    { field: "PCS", caption: "Pcs" },
    { field: "SUB_PCS", caption: "Sub Pcs" },
    { field: "TO_SERIALNO", caption: "To Serial No" },
    { field: "STOCK_CODE", caption: "Stock Code" },
    { field: "LOCTYPE_CODE", caption: "Location" },
  ];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
  }

  boxMasterMainForm: FormGroup = this.formBuilder.group({
    boxno: ["", [Validators.required]],
    fromserialno: ["", [Validators.required]],
    pcs: ["", [Validators.required]],
    subpcs: [""],
    toserialno: [""],
    location: ["", [Validators.required]],
    stockcode: [""],
    stockcodedesc: [""],
  });

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

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
      this.boxMasterGridData();
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
    this.boxNumber = DATA.BOX_NO;
    this.boxMasterMainForm.controls["boxno"].setValue(DATA.BOX_NO);
    this.boxMasterMainForm.controls["fromserialno"].setValue(
      DATA.FROM_SERIALNO
    );
    this.boxMasterMainForm.controls["pcs"].setValue(DATA.PCS);
    this.boxMasterMainForm.controls["subpcs"].setValue(DATA.SUB_PCS);
    this.boxMasterMainForm.controls["toserialno"].setValue(DATA.TO_SERIALNO);
    this.boxMasterMainForm.controls["location"].setValue(DATA.LOCTYPE_CODE);
    this.boxMasterMainForm.controls["stockcode"].setValue(DATA.STOCK_CODE);

    this.boxMasterGridData();

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
        const API = `BoxMaster/DeleteBoxMaster/${this.boxNumber}`;
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

  boxMasterMainFormSubmit() {
    Object.keys(this.boxMasterMainForm.controls).forEach((controlName) => {
      const control = this.boxMasterMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.boxMasterMainForm.controls
    ).some((controlName) => {
      const control = this.boxMasterMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MID: 0,
        BOX_NO: this.boxMasterMainForm.value.boxno,
        FROM_SERIALNO: this.boxMasterMainForm.value.fromserialno,
        PCS: this.boxMasterMainForm.value.pcs,
        TO_SERIALNO: this.boxMasterMainForm.value.toserialno,
        STOCK_CODE: this.boxMasterMainForm.value.stockcode,
        PURCHASE_BRANCH: "",
        PURCHASE_VOCTYPE: "",
        PURCHASE_VOCNO: 0,
        PURCHASE_VOCDATE: new Date(),
        PURCHASE_PARTYCODE: "string",
        LOCTYPE_CODE: this.boxMasterMainForm.value.location,
        SUB_PCS: this.boxMasterMainForm.value.subpcs,
        USERID: "",
        SYSTEM_DATE: new Date(),
      };

      if (this.flag === "EDIT") {
        let API = `BoxMaster/UpdateBoxMaster/${this.boxNumber}`;
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
        let API = `BoxMaster/InsertBoxMaster`;
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

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.boxMasterMainForm.controls[ctrl].setValue(value);
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
        this.boxMasterMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "stockcode":
        this.overlayStockCode.showOverlayPanel(event);
        break;
      case "location":
        this.overlaylocationCode.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  boxMasterGridData() {
    let API = `BoxMaster/GetBoxMasterList`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success" && result.response) {
          this.itemDetailsData = result.response.map(
            (item: any, index: number) => {
              return { ...item, SELECT1: false, SRNO: index + 1 };
            }
          );
        } else {
          this.commonService.toastErrorByMsgId("MSG1531");
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
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
                    this.boxMasterMainForm.controls[formName].setValue(
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
      this.boxMasterMainForm.controls[formName].setValue("");
    });
  }

  onKeyDown(event: KeyboardEvent, controllers: string[]) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers);
        }
      }, 0);
    }
  }

  clearRelevantFields(controllers: string[]) {
    controllers.forEach((controllerName) => {
      const control = this.boxMasterMainForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(this.stockCodeData, controllers);
  }
}
