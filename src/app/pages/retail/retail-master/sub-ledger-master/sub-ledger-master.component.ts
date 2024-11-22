import { Code } from 'angular-feather/icons';
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: "app-sub-ledger-master",
  templateUrl: "./sub-ledger-master.component.html",
  styleUrls: ["./sub-ledger-master.component.scss"],
})
export class SubLedgerMasterComponent implements OnInit {
  @Input() content!: any;
  
  @ViewChild('overlayCountrySearch') overlayCountrySearch!: MasterSearchComponent;
  @ViewChild('overlayStateSearch') overlayStateSearch!: MasterSearchComponent; //
  @ViewChild('overlayCitySearch') overlayCitySearch!: MasterSearchComponent;
  selectedTabIndex = 0;
  tableData: any = [];
  ContacttableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  private subscriptions: Subscription[] = [];
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  data: any;
  selectedIndexes: any = [];
  selectedContactndexes: any = [];


  CityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "City Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  PRCountryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  PRStateCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "State Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='state master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  SubLedgerMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    country: [""],
    state: [""],
    city: [""],
    address: [""],
    created_by: [""],
    active: [""],
    allocated_account: [""],
    name: [""],
    designation: [""],
    email: [""],
    mobile: [""],
    sl_accode: [""],
    // subLedgerDetail: this.formBuilder.group({
    refMid: [""],
    sNo: [""],
    // code: [""],
    // sl_accode: [""],
    sl_accode_des: [""],
    // }),
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.addContactTableData();
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteRecord();
      }
    }
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  BranchDataSelected(e: any) {}
  StateCodeDataSelected(e: any) {
    console.log(e);
    this.SubLedgerMasterForm.controls.state.setValue(e.CODE);
  }
  CityCodeDataSelected(e: any) {
    console.log(e);
    this.SubLedgerMasterForm.controls.city.setValue(e.CODE);
  }
  CountryCodeDataSelected(e: any) {
    console.log(e);
    this.SubLedgerMasterForm.controls.country.setValue(e.CODE);
  }

  addTableData() {
    console.log(this.SubLedgerMasterForm.controls.sl_accode.value);
    let sl_accode = this.SubLedgerMasterForm.controls.sl_accode.value;
    let sl_accode_des = this.SubLedgerMasterForm.controls.sl_accode_des.value;
    let len = this.tableData.length;
    const data = {
      REFMID: 0,
      SRNO: len + 1,
      SL_CODE: this.SubLedgerMasterForm.value.Code,
      SL_ACCODE: "",
      SL_ACCODE_DESC: "",
    };

    console.log(data);
    this.tableData.push(data);
  }

  getAccode(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.tableData[value.data.SRNO - 1].SL_ACCODE = data.target.value;
    // this.tableData.SL_ACCODE = data.target.value;
  }


  getAccodeDec(data: any, value: any) {
    // this.tableData.SL_ACCODE_DESC = data.target.value;
    this.tableData[value.data.SRNO - 1].SL_ACCODE_DESC = data.target.value;

  }
  getEmail(data: any, value: any) {
    this.ContacttableData.EMAIL = data.target.value;
  }
  getMobile(data: any, value: any) {
    this.ContacttableData.MOBILE_NO = data.target.value;
  }
  addContactTableData() {
    const data = {
      name: this.SubLedgerMasterForm.value.name,
      designation: this.SubLedgerMasterForm.value.designation,
      MOBILE_NO: this.SubLedgerMasterForm.value.mobile.toString(),
      EMAIL: this.SubLedgerMasterForm.value.email,
    };
    console.log(data);

    this.ContacttableData.push(data);
    console.log(this.ContacttableData);
    
  }

  setFormValues() {
    if (!this.content) return;
    console.log(this.content);
    
    let api =
      "SubLedgerMaster/GetSubLedgerHeaderAndDetails/" + this.content.SL_CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
        this.tableData = this.data.subLedgerDetail;
        // console.log(details);

        // details.forEach((detail: any) => {
        //   console.log("Detail:", detail);
        // });
      });
    console.log(this.content);

    this.SubLedgerMasterForm.controls.code.setValue(this.content.SL_CODE);
    this.SubLedgerMasterForm.controls.description.setValue(
      this.content.DESCRIPTION
    );
    this.SubLedgerMasterForm.controls.mobile.setValue(this.content.MOBILE_NO);
    this.SubLedgerMasterForm.controls.email.setValue(this.content.EMAIL);
    this.SubLedgerMasterForm.controls.address.setValue(this.content.ADDRESS);
    this.SubLedgerMasterForm.controls.active.setValue(this.content.ACTIVE);
    this.SubLedgerMasterForm.controls.allocated_account.setValue(
      this.content.ALLOCATED_ACCOUNT
    );
    this.SubLedgerMasterForm.controls.created_by.setValue(
      this.content.CREATED_BY
    );
    this.SubLedgerMasterForm.controls.country.setValue(this.content.COUNTRY);
    this.SubLedgerMasterForm.controls.state.setValue(this.content.STATE);
    this.SubLedgerMasterForm.controls.city.setValue(this.content.CITY);
    // this.SubLedgerMasterForm.controls.mobile.setValue(this.content.MOBILE_NO);
    // this.SubLedgerMasterForm.controls.email.setValue(this.content.EMAIL);
  }

  setPostData() {
    let form = this.SubLedgerMasterForm.value;
    let contactRow = this.ContacttableData;
    console.log(contactRow);
    console.log(this.tableData);
    return {
      SL_CODE: this.commonService.nullToString(form.code),
      DESCRIPTION: this.commonService.nullToString(form.description),
      // MOBILE_NO: this.SubLedgerMasterForm.value.mobile || "",
      MOBILE_NO: contactRow.MOBILE_NO || this.content.MOBILE_NO,
      TELEPHONE_NO: "",
      // EMAIL: this.SubLedgerMasterForm.value.email || "",
      EMAIL: contactRow.EMAIL || this.content.EMAIL,
      ADDRESS: this.commonService.nullToString(form.address),
      ACTIVE: form.active ? true : false,
      ALLOCATED_ACCOUNT: this.commonService.nullToString(
        form.allocated_account
      ),
      ACTYPE: "",
      SIGN_IMAGE_PATH: "",
      CREATED_BY: this.commonService.nullToString(form.created_by),
      CREATED_DATE: new Date().toISOString(),
      COUNTRY: this.commonService.nullToString(form.country),
      STATE: this.commonService.nullToString(form.state),
      CITY: this.commonService.nullToString(form.city),
      MID: 0,
      ACC_MODE: "s",
      subLedgerDetail: this.tableData,
    };
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    console.log(this.tableData);
    console.log(this.ContacttableData);

    let API = "SubLedgerMaster/InsertSubLedger";
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
                  this.SubLedgerMasterForm.reset();
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
    let API = "SubLedgerMaster/UpdateSubLedger/" + this.content.SL_CODE;
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
                  this.SubLedgerMasterForm.reset();
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
    if (!this.content.MID) {
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
        let API = "SubLedgerMaster/DeleteSubLedger/" + this.content.SL_CODE;
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
                      this.SubLedgerMasterForm.reset();
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
                      this.SubLedgerMasterForm.reset();
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

  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'country':
        this.overlayCountrySearch.showOverlayPanel(event);
        break;
      case 'state':
        this.overlayStateSearch.showOverlayPanel(event);
        break;
      case 'city':
        this.overlayCitySearch.showOverlayPanel(event);
        break;

      default:
    }
  }
  onKeyDown(event: KeyboardEvent, controllers: string[], LOOKUPDATA:MasterSearchModel) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if(event.key == "Tab"){
      console.log("Tab");
      console.log(controllers);
      console.log(event);
      
      this.lookupKeyPress(event,controllers[0])

    }
  }

  clearRelevantFields(controllers: string[], LOOKUPDATA:MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.SubLedgerMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.SubLedgerMasterForm.controls[formName].setValue("");
    });
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
                    
                    this.SubLedgerMasterForm.controls[formName].setValue(
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

  onContactSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    // console.log(values);
    let indexes: Number[] = [];
    this.ContacttableData.reduce((acc:any, value:any, index:any) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        // console.log(acc);

      }
      return acc;
    }, indexes);
    this.selectedContactndexes = indexes;
    // console.log(this.selectedIndexes);
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

  removeContactdata() {
    console.log(this.selectedContactndexes);

    if (this.selectedContactndexes.length > 0) {
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
          if (this.ContacttableData.length > 0) {
            this.ContacttableData = this.ContacttableData.filter((data:any, index:any) => !this.selectedContactndexes.includes(index));
            this.snackBar.open('Data deleted successfully!', 'OK', { duration: 2000 });
            this.ContacttableData.forEach((item: any, i: any) => {
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
