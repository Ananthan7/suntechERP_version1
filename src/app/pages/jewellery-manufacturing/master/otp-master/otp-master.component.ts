import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";

@Component({
  selector: "app-otp-master",
  templateUrl: "./otp-master.component.html",
  styleUrls: ["./otp-master.component.scss"],
})
export class OtpMasterComponent implements OnInit {
  @ViewChild("overlaybranchSearch") overlaybranchSearch!: MasterSearchComponent;
  @Input() content!: any;

  selectedTabIndex = 0;
  tableData: any = [];
  editMode: boolean = false;
  codeEnable: boolean = false;
  private subscriptions: Subscription[] = [];
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  currentDate = new Date();
  columnheader: any[] = [
    "S.No",
    "Level",
    "User",
    "Mobile Number",
    "Mobile Number",
    "Email",
  ];
  countryCode: any;
  data: any[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.countryCode = this.commonService.allbranchMaster.COUNTRY_CODE;
    console.log(this.countryCode);
    this.getData();
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteRecord();
      }
    }
  }
  otpForm: FormGroup = this.formBuilder.group({
    branch: ["", [Validators.required]],
    branchdesc: ["", [Validators.required]],
  });
  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: "BRANCH_CODE",
    SEARCH_HEADING: "Branch Data",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  branchSelected(e: any) {
    console.log(e);
    this.otpForm.controls.branch.setValue(e.BRANCH_CODE);
    this.otpForm.controls.branchdesc.setValue(e.BRANCH_NAME);
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  getData() {
    const api = "OTPMaster/GetOtpMasterGrid/" + this.countryCode;
    console.log(api);

    this.dataService.getDynamicAPI(api).subscribe((result: any) => {
      const flatData: any[] = [];

      if (Array.isArray(result.dynamicData)) {
        result.dynamicData.forEach((subArray: any[]) => {
          if (Array.isArray(subArray)) {
            subArray.forEach((item: any) => {
              flatData.push(item);
            });
          }
        });
      }

      this.data = flatData;
      console.log(this.data);
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
    if (formControlName == "branch") {
      this.overlaybranchSearch.showOverlayPanel(event);
    }
  }

  openOverlay(formControlName: string, event: any) {
    if (formControlName == "branch") {
      this.overlaybranchSearch.showOverlayPanel(event);
    }
  }

  validateLookupField(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAME: string
  ) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;
    if (
      event.target.value == "" ||
      this.viewMode == true ||
      this.editMode == true
    )
      return;
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${
        LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ""
      }`,
    };
    this.commonService.toastInfoByMsgId("MSG81447");
    let API = "UspCommonInputFieldSearch/GetCommonInputFieldSearch";
    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, param)
      .subscribe(
        (result) => {
          let data = this.commonService.arrayEmptyObjectToString(
            result.dynamicData[0]
          );
          if (data.length == 0) {
            this.commonService.toastErrorByMsgId("MSG1531");
            this.otpForm.controls[FORMNAME].setValue("");
            // this.renderer.selectRootElement(FORMNAME).focus();
            LOOKUPDATA.SEARCH_VALUE = "";
            this.openOverlay(FORMNAME, event);
            return;
          }
        },
        (err) => {
          this.commonService.toastErrorByMsgId("MSG2272"); //Error occured, please try again
        }
      );
    this.subscriptions.push(Sub);
  }

  setFormValues() {
    this.otpForm.controls.branch.setValue(this.content.BRANCH_CODE);
    this.otpForm.controls.branchdesc.setValue(this.content.BRANCH_DESCRIPTION);
  }

  submitValidation(form: any) {
    if (this.commonService.nullToString(form.branch) == "") {
      this.commonService.toastErrorByMsgId("MSG1076"); //"branch cannot be empty"
      return true;
    } else if (this.commonService.nullToString(form.branchdesc) == "") {
      this.commonService.toastErrorByMsgId("MSG1194"); //"branchdesc cannot be empty"
      return true;
    }
    return false;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    if (this.submitValidation(this.otpForm.value)) return;

    let API = "OTPMaster/InsertOTPMaster";
    console.log(this.data);
  
    const postData = this.data.map((item: any) => ({
      BRANCH_CODE: this.otpForm.value.branch || "",
      BRANCH_DESCRIPTION: this.otpForm.value.branchdesc || "",
      OTP_LEVEL: item.OTP_LEVEL || "string",
      LEVEL_USER: item.LEVEL_USER || "string",
      LEVEL_MOBILE1: item.LEVEL_MOBILE1 || "string",
      LEVEL_MOBILE2: item.LEVEL_MOBILE2 || "string",
      LEVEL_EMAIL: item.LEVEL_EMAIL || "string",
      SYSTEM_DATE: new Date().toISOString(), 
      MID: 0,
    }));

    console.log(postData);
    
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
                  this.otpForm.reset();
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
    if (this.submitValidation(this.otpForm.value)) return;

    let API = "OTPMaster/UpdateOTPMaster/" + this.content.MID;
    let postData = {
      BRANCH_CODE: "string",
      BRANCH_DESCRIPTION: "string",
      OTP_LEVEL: "string",
      LEVEL_USER: "string",
      LEVEL_MOBILE1: "string",
      LEVEL_MOBILE2: "string",
      LEVEL_EMAIL: "string",
      SYSTEM_DATE: "2023-11-27T09:54:58.976Z",
      MID: 0,
    };

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
                  this.otpForm.reset();
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
        let API = "OTPMaster/DeleteOTPMaster/" + this.content.MID;
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
                      this.otpForm.reset();
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
                      this.otpForm.reset();
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

  getRowData(e:any){
    console.log(e);
    const selectedRows = e.selectedRowsData; 
    console.log('Selected Rows:', selectedRows);
    this.data = selectedRows;
  }
  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
  // }
}
