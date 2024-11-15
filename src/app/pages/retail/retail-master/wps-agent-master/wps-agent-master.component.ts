import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-wps-agent-master",
  templateUrl: "./wps-agent-master.component.html",
  styleUrls: ["./wps-agent-master.component.scss"],
})
export class WpsAgentMasterComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  flag: any;
  code: any;
  selectedTabIndex = 0;
  tableData: any = [];
  dialogBox: any;

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

  WPSAgentMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    countryCode: [""],
    countryDesc: [""],
    bankCode: [""],
    bankDesc: [""],
    bankName: [""],
    bankBranch: [""],
    accountNo: [""],
    preferedCompnyBankCode: [""],
    preferedCompnyBankDesc: [""],
    swiftCode: [""],
    sortCode: [""],
    routingCode: [""],
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
    this.content
      ? (this.flag = this.content!.FLAG)
      : console.log("No Content, Due to you are in ADD");

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
    this.code = DATA.CODE;
    this.WPSAgentMasterForm.controls["code"].setValue(DATA.CODE);
    this.WPSAgentMasterForm.controls["description"].setValue(DATA.DESCRIPTION);
    this.WPSAgentMasterForm.controls["bankName"].setValue(DATA.BANKNAME);

    this.WPSAgentMasterForm.controls["bankBranch"].setValue(DATA.BANKBRANCH);
    this.WPSAgentMasterForm.controls["accountNo"].setValue(DATA.BANK_ACCNO);
    this.WPSAgentMasterForm.controls["bankCode"].setValue(DATA.BANK_CODE);
    this.WPSAgentMasterForm.controls["countryCode"].setValue(
      DATA.WPSMSTCOUNTRYCODE
    );
    this.WPSAgentMasterForm.controls["preferedCompnyBankCode"].setValue(
      DATA.WPS_COMPANYBANK_CODE
    );
    this.WPSAgentMasterForm.controls["swiftCode"].setValue(DATA.WPS_SWIFT_CODE);

    this.WPSAgentMasterForm.controls["sortCode"].setValue(DATA.WPS_SORT_CODE);

    this.WPSAgentMasterForm.controls["routingCode"].setValue(
      DATA.WPS_ROUTING_CODE
    );
    this.WPSAgentMasterForm.controls["userDefined1"].setValue(DATA.UDF1);
    this.WPSAgentMasterForm.controls["userDefined2"].setValue(DATA.UDF2);
    this.WPSAgentMasterForm.controls["userDefined3"].setValue(DATA.UDF3);
    this.WPSAgentMasterForm.controls["userDefined4"].setValue(DATA.UDF4);
    this.WPSAgentMasterForm.controls["userDefined5"].setValue(DATA.UDF5);
    this.WPSAgentMasterForm.controls["userDefined6"].setValue(DATA.UDF6);
    this.WPSAgentMasterForm.controls["userDefined7"].setValue(DATA.UDF7);
    this.WPSAgentMasterForm.controls["userDefined8"].setValue(DATA.UDF8);
    this.WPSAgentMasterForm.controls["userDefined9"].setValue(DATA.UDF9);
    this.WPSAgentMasterForm.controls["userDefined10"].setValue(DATA.UDF10);
    this.WPSAgentMasterForm.controls["userDefined11"].setValue(DATA.UDF11);
    this.WPSAgentMasterForm.controls["userDefined12"].setValue(DATA.UDF12);
    this.WPSAgentMasterForm.controls["userDefined13"].setValue(DATA.UDF13);
    this.WPSAgentMasterForm.controls["userDefined14"].setValue(DATA.UDF14);
    this.WPSAgentMasterForm.controls["userDefined15"].setValue(DATA.UDF15);
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
        const API = `WPSAgentMaster/DeleteWPSAgentMaster/${this.code}`;
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
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.WPSAgentMasterForm.controls[ctrl].setValue(value);
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
        this.WPSAgentMasterForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  WPSAgentMasterFormSubmit() {
    let postData = {
      MID: 0,
      CODE: this.WPSAgentMasterForm.value.code || "",
      DESCRIPTION: this.WPSAgentMasterForm.value.description || "",
      BANKNAME: this.WPSAgentMasterForm.value.bankName || "",
      BANKBRANCH: this.WPSAgentMasterForm.value.bankBranch || "",
      BANK_ACCNO: this.WPSAgentMasterForm.value.accountNo || "",
      BANK_CODE: this.WPSAgentMasterForm.value.bankCode || "",
      WPSMSTCOUNTRYCODE: this.WPSAgentMasterForm.value.countryCode || "",
      WPS_COMPANYBANK_CODE:
        this.WPSAgentMasterForm.value.preferedCompnyBankCode || "",
      WPS_SWIFT_CODE: this.WPSAgentMasterForm.value.swiftCode || "",
      WPS_SORT_CODE: this.WPSAgentMasterForm.value.sortCode || "",
      WPS_ROUTING_CODE: this.WPSAgentMasterForm.value.routingCode || "",
      UDF1: this.WPSAgentMasterForm.value.userDefined1 || "",
      UDF2: this.WPSAgentMasterForm.value.userDefined2 || "",
      UDF3: this.WPSAgentMasterForm.value.userDefined3 || "",
      UDF4: this.WPSAgentMasterForm.value.userDefined4 || "",
      UDF5: this.WPSAgentMasterForm.value.userDefined5 || "",
      UDF6: this.WPSAgentMasterForm.value.userDefined6 || "",
      UDF7: this.WPSAgentMasterForm.value.userDefined7 || "",
      UDF8: this.WPSAgentMasterForm.value.userDefined8 || "",
      UDF9: this.WPSAgentMasterForm.value.userDefined9 || "",
      UDF10: this.WPSAgentMasterForm.value.userDefined10 || "",
      UDF11: this.WPSAgentMasterForm.value.userDefined11 || "",
      UDF12: this.WPSAgentMasterForm.value.userDefined12 || "",
      UDF13: this.WPSAgentMasterForm.value.userDefined13 || "",
      UDF14: this.WPSAgentMasterForm.value.userDefined14 || "",
      UDF15: this.WPSAgentMasterForm.value.userDefined15 || "",
    };

    if (this.flag === "EDIT") {
      let API = `WPSAgentMaster/UpdateWPSAgentMaster/${this.code}`;
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
      let API = `WPSAgentMaster/InsertWPSAgentMaster`;
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
                    this.WPSAgentMasterForm.controls[formName].setValue(
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
      this.WPSAgentMasterForm.controls[formName].setValue("");
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
      let API = `WPSAgentMaster/CheckIfWPSAgentCodePresent/${input}`;
      let sub: Subscription = this.apiService
        .getDynamicAPI(API)
        .subscribe((res) => {
          if (res.checkifExists === true) {
            let message = `Code Already Exist ! `;
            this.WPSAgentMasterForm.controls[controller].setValue("");
            return this.openDialog("Warning", message, true);
          }
        });
    }
  }
}
