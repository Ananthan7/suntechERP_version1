import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-additional-amount",
  templateUrl: "./additional-amount.component.html",
  styleUrls: ["./additional-amount.component.scss"],
})
export class AdditionalAmountComponent implements OnInit {
  @ViewChild("overlayDesignCode")
  private subscriptions: Subscription[] = [];
  @(Input()!) content: any;
  overlayDesignCode!: MasterSearchComponent;
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  typeList: any;
  @ViewChild("typeCode") typeCode!: MasterSearchComponent;
  @ViewChild("debitCode") debitCode!: MasterSearchComponent;
  @ViewChild("creditCode") creditCode!: MasterSearchComponent;
  designCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Type Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='ADDLTYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  debitcode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Debit Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "AC_OnHold = 0 and ACCOUNT_MODE in('G','L')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  creditcode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "",
    SEARCH_HEADING: "Credit Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "AC_OnHold = 0 and ACCOUNT_MODE in('G','L'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  calculatedValue: any;
  transcationValue: any;
  creditValue: any;
  debitValue: any;
  categoryValue: any;
  narrationValue: any;
  selectedIndex: any;
  calculatedType: any;
  trasnCode: any;
  CategoryCode: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService
  ) {}

  costAndPriceTypeMainForm: FormGroup = this.formBuilder.group({
    mid: [""],
    code: [""],
    description: [""],
    type_code: [""],
    calculated_type: [""],
    calculated_code: [""],
    include_for_tax: [""],
    add_category: [""],
    include_in_sales_analysis: [""],
    transaction_type: [""],
    transaction_code: [""],
    debit_code: [""],
    debit_type: [""],
    credit_code: [""],
    credit_type: [""],
    narration: [""],
    vat_type: [""],
    system_date: [""],
    stone_metal: [""],
    percentage: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    if (this.content?.FLAG) {
      this.setValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMaster();
      }
    }

    this.calculatedValue = this.commonService
      .getComboFilterByID("Addnl Wgtd Average")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );

    console.log(this.calculatedValue);

    this.transcationValue = this.commonService
      .getComboFilterByID("Addnl Trans Type")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.transcationValue);

    this.creditValue = this.commonService
      .getComboFilterByID("Addnl Credit Debit")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.creditValue);

    this.debitValue = this.commonService
      .getComboFilterByID("Addnl Credit Debit")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.debitValue);

    this.categoryValue = this.commonService
      .getComboFilterByID("Addnl Category")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.categoryValue);

    this.narrationValue = this.commonService
      .getComboFilterByID("Addnl Narration")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.narrationValue);
  }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return;
    }
    if (this.content && this.content.FLAG == "VIEW") {
      this.activeModal.close(data);
      return;
    }
    Swal.fire({
      title: "Do you want to exit?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    });
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

  lookupCodeSelected(e: any, fieldName: any) {
    this.costAndPriceTypeMainForm.controls.debit_code.setValue(e.ACCODE);
  }
  typeCodeSelected(e: any, fieldName: any) {
    this.costAndPriceTypeMainForm.controls.type_code.setValue(e.CODE);
  }
  creditCodeSelected(e: any, fieldName: any) {
    this.costAndPriceTypeMainForm.controls.credit_code.setValue(e.ACCODE);
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

    // if (!searchValue || this.flag == "VIEW") return;

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

    const sub: Subscription = this.dataService
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
                console.log(FORMNAMES);
                console.log(matchedItem);

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    console.log(field);

                    this.costAndPriceTypeMainForm.controls[formName].setValue(
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
      this.costAndPriceTypeMainForm.controls[formName].setValue("");
    });
  }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    LOOKUPDATA: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if (event.key == "Tab") {
      console.log("Tab");
      console.log(controllers);
      console.log(event);

      this.lookupKeyPress(event, controllers[0]);
    }
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == "Tab" && event.target.value == "") {
      this.showOverleyPanel(event, form);
    }
    if (event.key === "Enter") {
      if (event.target.value == "") this.showOverleyPanel(event, form);
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "type_code":
        this.typeCode.showOverlayPanel(event);
        break;
      case "debit_code":
        this.debitCode.showOverlayPanel(event);
        break;
      case "credit_code":
        this.creditCode.showOverlayPanel(event);
        break;
      default:
    }
  }
  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.costAndPriceTypeMainForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }

  convertToISO(time: string): string {
    // Ensure 'time' is a valid string and has the correct format
    if (typeof time !== "string" || !time.includes(":")) {
      console.error("Invalid time format:", time);
      return ""; // Or return a default ISO string or some safe fallback value
    }

    const currentDate = new Date();
    const [hours, minutes] = time.split(":"); // Now safe to split

    const newDate = new Date(currentDate.toISOString()); // Start with the current date
    newDate.setHours(parseInt(hours));
    newDate.setMinutes(parseInt(minutes));
    newDate.setSeconds(0); // Set seconds to 0
    newDate.setMilliseconds(0); // Set milliseconds to 0

    return newDate.toISOString(); // Converts to ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
  }
  onNarrationChange(event: any) {
    const selectedValue = event.value;
    this.selectedIndex = this.narrationValue.findIndex(
      (item: any) => item.ENGLISH === selectedValue
    );

    console.log("Selected Value:", selectedValue);
    console.log("Selected Index:", this.selectedIndex);
  }

  onTypeCode(e: any) {
    console.log(e);

    const selectedValue = e.value;
    this.calculatedType = this.calculatedValue.findIndex(
      (item: any) => item.ENGLISH === selectedValue
    );

    console.log("Selected Value:", selectedValue);
    console.log("Selected Index:", this.calculatedType);
  }

  onTransCode(e: any) {
    console.log(e);

    const selectedValue = e.value;
    this.trasnCode = this.calculatedValue.findIndex(
      (item: any) => item.ENGLISH === selectedValue
    );

    console.log("Selected Value:", selectedValue);
    console.log("Selected Index:", this.trasnCode);
  }

  onCategoryCode(e: any) {
    console.log(e);

    const selectedValue = e.value;
    this.CategoryCode = this.categoryValue.findIndex(
      (item: any) => item.ENGLISH === selectedValue
    );

    console.log("Selected Value:", selectedValue);
    console.log("Selected Index:", this.CategoryCode);
  }
  // check(e:any){
  //   console.log(e);

  // }

  setValues() {
    console.log(this.content);

    console.log(this.content.DEBIT_TYPE);
    let data1 = this.content.DEBIT_TYPE;
    console.log(data1);

    
    this.debitValue = data1;
    this.costAndPriceTypeMainForm.controls["code"].setValue(
      this.content.ADDL_CODE
    );
    this.costAndPriceTypeMainForm.controls["description"].setValue(
      this.content.DESCRIPTION
    );
    this.costAndPriceTypeMainForm.controls["type_code"].setValue(
      this.content.ADDLTYPE_CODE
    );
    this.costAndPriceTypeMainForm.controls["calculated_type"].setValue(
      this.content.AVG_ON.toString()
    );
    this.costAndPriceTypeMainForm.controls["narration"].setValue(
      this.content.NARRATION.toString()
    );
    this.costAndPriceTypeMainForm.controls["add_category"].setValue(
      this.content.ADDL_CATEGORY.toString()
    );
    this.costAndPriceTypeMainForm.controls["transaction_type"].setValue(
      this.content.TRANS_TYPE.toString()
    );
    this.costAndPriceTypeMainForm.controls["debit_type"].setValue(data1);
    this.costAndPriceTypeMainForm.controls["debit_code"].setValue(
      this.content.DEBIT_CODE
    );
    this.costAndPriceTypeMainForm.controls["credit_type"].setValue(
      this.content.CREDIT_TYPE
    );
    this.costAndPriceTypeMainForm.controls["credit_code"].setValue(
      this.content.CREDIT_CODE
    );
    this.costAndPriceTypeMainForm.controls[
      "include_in_sales_analysis"
    ].setValue(this.content.INCLUDE_COSTING);

    this.costAndPriceTypeMainForm.controls["include_for_tax"].setValue(
      this.content.INC_DEFAULT_TAX
    );
  }

  setPostData() {
    let form = this.costAndPriceTypeMainForm.value;
    console.log(form.include_for_tax);
    console.log(form.include_in_sales_analysis);

    let postData = {
      ADDL_CODE: this.commonService.nullToString(form.code.toUpperCase()),
      DESCRIPTION: this.commonService.nullToString(
        form.description.toUpperCase()
      ),
      ADDLTYPE_CODE: this.commonService.nullToString(
        form.type_code.toUpperCase()
      ),
      AVG_ON: this.commonService.emptyToZero(form.calculated_type),
      TRANS_TYPE: this.commonService.emptyToZero(form.transaction_type),
      PLUS_MINUS: "s",
      DEBIT_TYPE: this.commonService.nullToString(
        form.debit_type
      ),
      DEBIT_CODE: this.commonService.nullToString(
        form.debit_code.toUpperCase()
      ),
      CREDIT_TYPE: this.commonService.nullToString(
        form.credit_type
      ),
      CREDIT_CODE: this.commonService.nullToString(
        form.credit_code.toUpperCase()
      ),
      NARRATION: this.commonService.emptyToZero(form.narration),
      INCLUDE_COSTING: form.include_in_sales_analysis == true ? 0 : 1,
      MID: this.commonService.emptyToZero(form.mid),
      SYSTEM_DATE: new Date(),
      STONEMETAL: this.commonService.emptyToZero(form.stone_metal),
      PERCENTAGE: this.commonService.emptyToZero(form.percentage),
      INC_DEFAULT_TAX: form.include_for_tax == 'y'? true:false,
      ADDL_CATEGORY: this.commonService.emptyToZero(form.add_category),
    };

    return postData;
  }

  formSave() {
    if (this.content?.FLAG == "VIEW") return;
    if (this.content?.FLAG == "EDIT") {
      this.updateMaster();
      return;
    }
    let API = "AddlAmountMaster/InsertAddlAmountMaster";
    let postData = this.setPostData();

    this.commonService.showSnackBarMsg("MSG81447");
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          console.log("result", result);
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: "Saved Successfully",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.costAndPriceTypeMainForm.reset();
                  // this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG3577");
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG3577");
        }
      );
    this.subscriptions.push(Sub);
  }

  updateMaster() {
    let API =
      "AddlAmountMaster/UpdateAddlAmountMaster/" + this.content?.ADDL_CODE;
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .putDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.costAndPriceTypeMainForm.reset();
                  // this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG3577");
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG3577");
        }
      );
    this.subscriptions.push(Sub);
  }

  deleteMaster() {
    // if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.ADDL_CODE) {
      Swal.fire({
        title: "",
        text: "Please Select data to delete!",
        icon: "error",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      }).then((result: any) => {
        if (result.value) {
        }
      });
      return;
    }
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
        let API =
          "AddlAmountMaster/DeleteAddlAmountMaster/" + this.content?.ADDL_CODE;
        let Sub: Subscription = this.dataService
          .deleteDynamicAPI(API)
          .subscribe(
            (result) => {
              if (result) {
                if (result.status == "Success") {
                  Swal.fire({
                    title: result.message || "Success",
                    text: "",
                    icon: "success",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.costAndPriceTypeMainForm.reset();
                      // this.tableData = []
                      this.close("reloadMainGrid");
                    }
                  });
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.costAndPriceTypeMainForm.reset();
                      // this.tableData = []
                      this.close();
                    }
                  });
                }
              } else {
                this.commonService.toastErrorByMsgId("MSG1880"); // Not Deleted
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }

  matBoxCheck(event: MatCheckboxChange, controller: any) {
    console.log(event.checked);
  }
}
