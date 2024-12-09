import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-set-ref-master",
  templateUrl: "./set-ref-master.component.html",
  styleUrls: ["./set-ref-master.component.scss"],
})
export class SetRefMasterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("overlaycode") overlaycode!: MasterSearchComponent;
  @ViewChild("overlayYearCode") overlayYearCode!: MasterSearchComponent;
  @ViewChild("overlaySetRefCode") overlaySetRefCode!: MasterSearchComponent;
  @ViewChild("overlayTableSearchCode")
  overlayTableSearchCode!: MasterSearchComponent;
  hideFields: boolean = false;
  tableData: any = [];
  tableData1: any = [];
  selectedIndexes: any = [];
  divisionCOde: string = "";
  dialogBox: any;
  setRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 14,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Set Ref Code",
    SEARCH_VALUE: "",
    // WHERECONDITION: `SETREF_PREFIX=1 and DIVISION='${this.divisionCOde}'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  codeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 14,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Set Ref Master ",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='SET REFERENCE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  yearTypeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  gridDataSearch: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 4,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Data",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  private subscriptions: Subscription[] = [];
  currentDate = new Date();
  divisionCode: any;
  SetRefMasterForm: FormGroup = this.formBuilder.group({
    division: [""],
    set_ref_code: [""],
    code: [""],
    decription: [""],
    year: [""],
    year_type: [""],
    voc_no: [""],
    table_search: [""],
  });
  data: any;
  yearData: any;
  dataGrid: any = [];
  selectedData: any = [];
  deleteMode: boolean = false;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.content);

    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.addTableData();
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.addTableData();
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMode = false;
        this.deleteRecord();
      }
    }

    this.divisionCode = this.commonService
      .getComboFilterByID("Division")
      .filter(
        (value: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
      );
    console.log(this.divisionCode);

    let api = "TDSMaster/GetFinancialYearDropdown";
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.yearData = result.dynamicData[0];
        console.log(this.yearData);
      });
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

  setFormValues() {
    if (!this.content) return;
    console.log(this.content);

    let api = "SetRefMaster/GetSetRefDetailWithCode/" + this.content.CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
        this.tableData = this.data.Details;
        console.log(this.tableData);

        // console.log(details);

        // details.forEach((detail: any) => {
        //   console.log("Detail:", detail);
        // });
      });
    console.log(this.content);

    this.divisionCOde = this.content.DIVISIONMS;
    this.hideFields = this.divisionCOde === "M";
    this.SetRefMasterForm.controls.code.setValue(this.content.DESCCODE);
    this.SetRefMasterForm.controls.decription.setValue(
      this.content.DESCRIPTION
    );
    this.SetRefMasterForm.controls.division.setValue(
      this.content.DIVISIONMS === "M" ? "Metal" : "Diamond"
    );
    this.SetRefMasterForm.controls.set_ref_code.setValue(this.content.CODE);
  }

  setPostData() {
    let form = this.SetRefMasterForm.value;

    let detailsArray = [...this.tableData, ...this.tableData1].map(
      (item, index) => {
        return {
          REFMID: 0,
          CODE: "",
          SRNO: index + 1,
          STOCKCODE: this.commonService.nullToString(item.STOCKCODE || ""),
          SUBSTOCKCODE: "",
          STOCKDESC: this.commonService.nullToString(item.STOCKDESC || ""),
          GRIDREF: "",
        };
      }
    );

    return {
      MID: 0,
      DESCCODE: this.commonService.nullToString(form.code),
      DESCRIPTION: this.commonService.nullToString(form.decription),
      DIVISIONMS: this.commonService.nullToString(this.divisionCOde),
      CODE: this.commonService.nullToString(form.set_ref_code),
      SYSTEMDATE: new Date(),
      USERID: "string",
      SYSTEMID: "string",
      SOLD: true,
      BROKEN: true,
      BROKEN_DATE: new Date(),
      BROKEN_USER: "string",
      SET_PICTURE_NAME: "string",
      SET_REF_CODE: "string",
      Details: detailsArray,
    };
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    console.log(this.tableData);

    let API = "SetRefMaster/InsertSetRefMaster";
    let postData = this.setPostData();

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
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
                  this.SetRefMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  update() {
    let API = "SetRefMaster/UpdateSetRefMaster/" + this.content.CODE;
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
                  this.SetRefMasterForm.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleteRecord() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (!this.content.CODE) {
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
        let API = "SetRefMaster/DeleteSetRefMaster/" + this.content.CODE;
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
                      this.SetRefMasterForm.reset();
                      this.tableData = [];
                      this.close("reloadMainGrid");
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
      else {
        this.close("reloadMainGrid");
      }
    });
  }
  CodeDataSelected(e: any) {
    this.SetRefMasterForm.controls["set_ref_code"].setValue(e.PREFIX_CODE);
  }
  YearTypeDataSelected(e: any) {
    this.SetRefMasterForm.controls["year_type"].setValue(e.CODE);
  }
  TableDataSelected(e: any) {
    console.log(e);
    
    this.SetRefMasterForm.controls["table_search"].setValue(e.Stock_Code);

    this.selectedData = {
      REFMID: 0,
      SRNO: this.tableData.length + 1,
      STOCKCODE: e.Stock_Code,
      STOCKDESC: e.Stock_Description,
    };
    // this.dataGrid.push( this.selectedData);
  }
  CodeSecSelected(e: any) {
    this.SetRefMasterForm.controls["code"].setValue(e.CODE);
    this.SetRefMasterForm.controls["decription"].setValue(e.DESCRIPTION);
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  changedCheckbox(data: any) {
    console.log("Moving row:", data.data);
    this.dataGrid = {
      REFMID: 0,
      SRNO: data.data.SRNO,
      STOCKCODE: data.data.STOCKCODE,
      STOCKDESC: data.data.STOCKDESC,
    };
    this.tableData1.push(this.dataGrid);
    console.log(this.tableData1);

    this.tableData = this.tableData.filter(
      (row: any) => row.SRNO !== data.data.SRNO
    );
  }

  // changedCheckbox1(data: any) {
  //   console.log("Moving row:", data.data);
  //   this.dataGrid = {
  //     REFMID: 0,
  //     SRNO: data.data.SRNO,
  //     STOCKCODE: data.data.STOCKCODE,
  //     STOCKDESC: data.data.STOCKDESC,
  //   };
  //   this.tableData.push(this.dataGrid);
  //   console.log(this.tableData);

  //   this.tableData1 = this.tableData1.filter(
  //     (row: any) => row.SRNO !== data.data.SRNO
  //   );
  // }

  changedCheckbox1(data: any) {
    if (!data || !data.data) {
      console.error("Invalid data provided:", data);
      return;
    }

    console.log("Moving row:", data.data);

    const newData = {
      REFMID: 0,
      SRNO: data.data.SRNO,
      STOCKCODE: data.data.STOCKCODE,
      STOCKDESC: data.data.STOCKDESC,
    };

    if (!this.tableData.some((row: any) => row.SRNO === newData.SRNO)) {
      this.tableData.push(newData);
      console.log("Updated tableData:", this.tableData);
    } else {
      console.log("Duplicate entry detected, not adding:", newData);
    }
    this.tableData1 = this.tableData1.filter(
      (row: any) => row.SRNO !== data.data.SRNO
    );
    console.log("Updated tableData1:", this.tableData1);
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

                    this.SetRefMasterForm.controls[formName].setValue(
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
      this.SetRefMasterForm.controls[formName].setValue("");
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

  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.SetRefMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
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
      case "code":
        this.overlaycode.showOverlayPanel(event);
        break;
      case "year_type":
        this.overlayYearCode.showOverlayPanel(event);
        break;
      case "set_ref_code":
        this.overlaySetRefCode.showOverlayPanel(event);
        break;
      case "table_search":
        this.overlayTableSearchCode.showOverlayPanel(event);
        break;
      default:
    }
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    // console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc: any, value: any, index: any) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        // console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    // console.log(this.selectedIndexes);
  }

  getAccode(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.tableData[value.data.SRNO - 1].STOCKDESC = data.target.value;
    // this.tableData.SL_ACCODE = data.target.value;
  }

  getStockCode(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.tableData[value.data.SRNO - 1].STOCKCODE = data.target.value;
    // this.tableData.SL_ACCODE = data.target.value;
  }

  getAccode1(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.tableData1[value.data.SRNO - 1].STOCKDESC = data.target.value;
    // this.tableData.SL_ACCODE = data.target.value;
  }

  getStockCode1(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.tableData1[value.data.SRNO - 1].STOCKCODE = data.target.value;
    // this.tableData.SL_ACCODE = data.target.value;
  }

  addTableData() {
    console.log(this.tableData);
    console.log(this.selectedData);
    if (
      this.tableData.some(
        (element: any) => element.STOCKCODE === this.selectedData.STOCKCODE
      )
    ) {
      let message = `STOCKCODE is already added!`;
      return this.openDialog("Warning", message, true);
    } else {
      this.tableData.push(this.selectedData);
      this.selectedData = null;
      this.SetRefMasterForm.controls["table_search"].setValue("");
    }

    // this.tableData = this.dataGrid;
    // let len = this.tableData.length;
    // const data = {
    //   REFMID: 0,
    //   SRNO: len + 1,
    //   STOCKCODE: "",
    //   STOCKDESC: "",
    // };

    // console.log(data);
    // this.tableData.push(data);
    // this.tableData1.push({ ...data });
  }

  removedata() {
    console.log(this.selectedIndexes);

    if (this.selectedIndexes.length > 0) {
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
          // Simulate deletion without using an actual API call
          if (this.tableData.length > 0) {
            this.tableData = this.tableData.filter(
              (data: any, index: any) => !this.selectedIndexes.includes(index)
            );
            this.snackBar.open("Data deleted successfully!", "OK", {
              duration: 2000,
            });
            this.tableData.forEach((item: any, i: any) => {
              item.SRNO = i + 1;
            });
          } else {
            this.snackBar.open("No data to delete!", "OK", { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open("Please select record", "OK", { duration: 2000 });
    }
  }

  getDivsionValue(e: any) {
    console.log(e);
    if (e.value == "Metal") {
      this.hideFields = true;
      this.divisionCOde = "M";
    } else {
      this.divisionCOde = "S";
      this.hideFields = false;
    }
    this.setRefCodeData.WHERECONDITION = `SETREF_PREFIX=1 and DIVISION='${this.divisionCOde}'`;

    let api = "SetRefMaster/GenerateSetRefCode/MOE/" + this.divisionCOde;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPICustom(api)
      .subscribe((result: any) => {
        console.log(result);
        let data = result.setrefcode;
        console.log(data);
        this.SetRefMasterForm.controls["set_ref_code"].setValue(data);
      });
  }
}
