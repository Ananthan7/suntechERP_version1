import { Code } from 'angular-feather/icons';
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-sub-ledger-master",
  templateUrl: "./sub-ledger-master.component.html",
  styleUrls: ["./sub-ledger-master.component.scss"],
})
export class SubLedgerMasterComponent implements OnInit {
  @Input() content!: any;
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
    private commonService: CommonServiceService
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
      mobile: this.SubLedgerMasterForm.value.mobile.toString(),
      email: this.SubLedgerMasterForm.value.email,
    };
    console.log(data);

    this.ContacttableData.push(data);
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
    this.SubLedgerMasterForm.controls.mobile.setValue(this.content.MOBILE_NO);
    this.SubLedgerMasterForm.controls.email.setValue(this.content.EMAIL);
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
      MOBILE_NO: contactRow.MOBILE_NO || "",
      TELEPHONE_NO: "",
      // EMAIL: this.SubLedgerMasterForm.value.email || "",
      EMAIL: contactRow.EMAIL || "",
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
}
