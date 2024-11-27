import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
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
  @ViewChild("overlayYearCode")overlayYearCode!: MasterSearchComponent;
  tableData: any = [];
  tableData1:any=[];
  selectedIndexes:any=[]
  codeData: MasterSearchModel = {
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
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  private subscriptions: Subscription[] = [];
  currentDate = new Date();
  divisionCode:any;
  SetRefMasterForm: FormGroup = this.formBuilder.group({
    division:[''],
    set_ref_code:[''],
    code:[''],
    decription:[''],
    year:[''],
    year_type:[''],
    voc_no:['']
  });
  data: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit(): void {
    if (this.content?.FLAG) {
      // this.setFormValues();
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
        // this.deleteRecord();
      }
    }

    this.divisionCode = this.commonService
    .getComboFilterByID("Days of Week")
    .filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );
    console.log(this.divisionCode);
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
    
    let api =
      "SetRefMaster/GetSetRefDetailWithCode/" + this.content.CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
        this.tableData = this.data.Details;
        // console.log(details);

        // details.forEach((detail: any) => {
        //   console.log("Detail:", detail);
        // });
      });
    console.log(this.content);

    this.SetRefMasterForm.controls.code.setValue(this.content.CODE);
    this.SetRefMasterForm.controls.description.setValue(
      this.content.DESCRIPTION
    );
    this.SetRefMasterForm.controls.division.setValue(this.content.DIVISIONMS);
    this.SetRefMasterForm.controls.set_ref_code.setValue(this.content.SET_REF_CODE);
  }
  
  setPostData() {
    let form = this.SetRefMasterForm.value;
  
    let detailsArray = [...this.tableData, ...this.tableData1].map((item, index) => {
      return {
        REFMID: 0,
        CODE: "", 
        SRNO: index + 1, 
        STOCKCODE: this.commonService.nullToString(item.STOCKCODE || ""),
        SUBSTOCKCODE: "", 
        STOCKDESC: this.commonService.nullToString(item.STOCKDESC || ""),
        GRIDREF: "", 
      };
    });
  
    return {
      MID: 0,
      CODE: this.commonService.nullToString(form.code),
      DESCRIPTION: this.commonService.nullToString(form.description),
      DIVISIONMS: this.commonService.nullToString(form.division),
      SET_REF_CODE: this.commonService.nullToString(form.set_ref_code),
      SYSTEMDATE: new Date(),
      USERID: "string",
      SYSTEMID: "string", 
      SOLD: true,
      BROKEN: true, 
      BROKEN_DATE: new Date(),
      BROKEN_USER: "string", 
      SET_PICTURE_NAME: "string", 
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
    if (!this.content.CODE ) {
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
        let API = "SetRefMaster/DeleteSetRefMaster/" + this.content.CODE ;
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
                } else {
                  Swal.fire({
                    title: result.message || "Error please try again",
                    text: "",
                    icon: "error",
                    confirmButtonColor: "#336699",
                    confirmButtonText: "Ok",
                  }).then((result: any) => {
                    if (result.value) {
                      this.SetRefMasterForm.reset();
                      this.tableData = [];
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
  CodeDataSelected(e: any) {
    this.SetRefMasterForm.controls['code'].setValue(e.CODE)
  }
  YearTypeDataSelected(e: any) {
    this.SetRefMasterForm.controls['year_type'].setValue(e.CODE)
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

      default:
    }
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    // console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc:any, value:any, index:any) => {
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
    let len = this.tableData.length;
    const data = {
      REFMID: 0,
      SRNO: len + 1,
      STOCKCODE: "",
      STOCKDESC: "",
    };

    console.log(data);
    this.tableData.push(data);
    this.tableData1.push({ ...data });
  }

  removedata() {
    console.log(this.selectedIndexes);

    if (this.selectedIndexes.length > 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!'
      }).then((result) => {
        if (result.isConfirmed) {
          // Simulate deletion without using an actual API call
          if (this.tableData.length > 0) {
            this.tableData = this.tableData.filter((data:any, index:any) => !this.selectedIndexes.includes(index));
            this.snackBar.open('Data deleted successfully!', 'OK', { duration: 2000 });
            this.tableData.forEach((item: any, i: any) => {
              item.SRNO = i + 1;
            });

          } else {
            this.snackBar.open('No data to delete!', 'OK', { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 });
    }
  }
}
