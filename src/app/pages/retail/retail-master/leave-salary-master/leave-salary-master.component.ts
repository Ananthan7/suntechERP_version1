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
  selector: "app-leave-salary-master",
  templateUrl: "./leave-salary-master.component.html",
  styleUrls: ["./leave-salary-master.component.scss"],
})
export class LeaveSalaryMasterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("overlayDebit") overlayDebit!: MasterSearchComponent;
  @ViewChild("userDefined1") userDefined1!: MasterSearchComponent;
  @ViewChild("userDefined2") userDefined2!: MasterSearchComponent;
  @ViewChild("userDefined3") userDefined3!: MasterSearchComponent;
  @ViewChild("userDefined4") userDefined4!: MasterSearchComponent;
  @ViewChild("userDefined5") userDefined5!: MasterSearchComponent;
  @ViewChild("userDefined6") userDefined6!: MasterSearchComponent;
  @ViewChild("userDefined7") userDefined7!: MasterSearchComponent;
  @ViewChild("userDefined8") userDefined8!: MasterSearchComponent;
  @ViewChild("userDefined9") userDefined9!: MasterSearchComponent;
  @ViewChild("userDefined10") userDefined10!: MasterSearchComponent;
  @ViewChild("userDefined11") userDefined11!: MasterSearchComponent;
  @ViewChild("userDefined12") userDefined12!: MasterSearchComponent;
  @ViewChild("userDefined13") userDefined13!: MasterSearchComponent;
  @ViewChild("userDefined14") userDefined14!: MasterSearchComponent;
  @ViewChild("userDefined15") userDefined15!: MasterSearchComponent;
  debitCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Debit Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  UserDefinedData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 130,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field1'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined2Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 131,
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

  UserDefined3Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 132,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field3'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined4Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 133,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field4'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined5Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 134,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field5'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined6Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 135,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field6'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined7Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 136,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field7'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined8Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 137,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field8'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined9Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 138,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field9'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined10Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 139,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field10'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined11Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 140,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field11'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined12Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 141,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field12'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined13Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 142,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field13'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined14Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 143,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field14'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  UserDefined15Data: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 144,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Defined",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'HRM UDF Field15'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  selectedTabIndex = 0;
  tableData: any = [];
  BranchData: MasterSearchModel = {};
  DepartmentData: MasterSearchModel = {};
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  deleteMode: boolean = false;
  private subscriptions: Subscription[] = [];

  LeaveSalaryMasterForm: FormGroup = this.formBuilder.group({
    code: [""],
    description: [""],
    debit: [""],
    basedOn: [0],
    noOfYr: [""],
    noOfTime: [""],
    amount: [""],
    in: [""],
    excludeAnnualLeave: [false],
    excludeHalfPaidLeave: [false],
    excludeHalfUnPaidLeave: [false],
    excludeUnPaidLeave: [false],
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
  data: any;
  basedOne: any;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log(this.content);
    
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
        this.deleteMode = true;
        this.deleteRecord();
      }
    }

    this.basedOne = this.commonService
    .getComboFilterByID("OVERTIME BASED ON")
    .filter(
      (value: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );
    console.log(this.basedOne);
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

    let api = "PayLvSalaryMaster/GetPayLvSalaryMasterDetailWithCode/" + this.content.CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
      
      });

    this.LeaveSalaryMasterForm.controls.code.setValue(
      this.content.CODE
    );
    this.LeaveSalaryMasterForm.controls.description.setValue(
      this.content.DESCRIPTION
    );
    this.LeaveSalaryMasterForm.controls.debit.setValue(
      this.content.DEBITACCODE
    );
    this.LeaveSalaryMasterForm.controls.basedOn.setValue(
      this.content.BASED_ON
    );
    this.LeaveSalaryMasterForm.controls.amount.setValue(
      this.content.FIXAMOUNT
    );
    this.LeaveSalaryMasterForm.controls.noOfTime.setValue(
      this.content.MONTH_INTERVEL
    );
    this.LeaveSalaryMasterForm.controls.in.setValue(
      this.content.NO_OF_MONTHS
    );
    this.LeaveSalaryMasterForm.controls.noOfYr.setValue(
      this.content.YEARDAYS
    );
    this.LeaveSalaryMasterForm.controls.excludeAnnualLeave.setValue(
      this.content?.DED_ANNUALLEAVE
    );
    console.log(this.content?.DED_ANNUALLEAVE);
    
    this.LeaveSalaryMasterForm.controls.excludeHalfPaidLeave.setValue(
      this.content?.DED_PAIDLEAVE
    );
    this.LeaveSalaryMasterForm.controls.excludeUnPaidLeave.setValue(
      this.content?.DED_UPAIDLEAVE 
    );
    this.LeaveSalaryMasterForm.controls.excludeHalfUnPaidLeave.setValue(
      this.content?.DED_HPAIDLEAVE
    );
    this.LeaveSalaryMasterForm.controls.userDefined1.setValue(
      this.data?.UDF1
    );
    this.LeaveSalaryMasterForm.controls.userDefined2.setValue(
      this.content?.UDF2
    );
    this.LeaveSalaryMasterForm.controls.userDefined3.setValue(
      this.data?.UDF3
    );
    this.LeaveSalaryMasterForm.controls.userDefined4.setValue(
      this.data?.UDF4
    );
    this.LeaveSalaryMasterForm.controls.userDefined5.setValue(
      this.data?.UDF5
    );
    this.LeaveSalaryMasterForm.controls.userDefined6.setValue(
      this.data?.UDF6
    );
    this.LeaveSalaryMasterForm.controls.userDefined7.setValue(
      this.data?.UDF7
    );
    this.LeaveSalaryMasterForm.controls.userDefined8.setValue(
      this.data?.UDF8
    );
    this.LeaveSalaryMasterForm.controls.userDefined9.setValue(
      this.data?.UDF9
    );
    this.LeaveSalaryMasterForm.controls.userDefined10.setValue(
      this.data?.UDF10
    );
    this.LeaveSalaryMasterForm.controls.userDefined11.setValue(
      this.data?.UDF11
    );
    this.LeaveSalaryMasterForm.controls.userDefined12.setValue(
      this.data?.UDF12
    );
    this.LeaveSalaryMasterForm.controls.userDefined13.setValue(
      this.data?.UDF13
    );
    this.LeaveSalaryMasterForm.controls.userDefined14.setValue(
      this.data?.UDF14
    );
    this.LeaveSalaryMasterForm.controls.userDefined15.setValue(
      this.data?.UDF15
    );
  }
  setPostData() {
    let form = this.LeaveSalaryMasterForm.value;
    let postData = {
      MID: this.commonService.emptyToZero(this.content?.MID),
      CODE: this.commonService.nullToString(form.code.toUpperCase()),
      DESCRIPTION: this.commonService.nullToString(
        form.description.toUpperCase()
      ),
      DEBITACCODE: this.commonService.nullToString(form.debit.toUpperCase()),
      BASED_ON: this.commonService.emptyToZero(form.basedOn),
      YEARDAYS: this.commonService.emptyToZero(form.noOfYr),
      FIXAMOUNT: this.commonService.emptyToZero(form.amount),
      MONTH_INTERVEL: this.commonService.emptyToZero(form.noOfTime),
      NO_OF_MONTHS: this.commonService.emptyToZero(form.in),
      DED_ANNUALLEAVE: this.commonService.emptyToZero(form.excludeAnnualLeave == true? 1:0),
      DED_PAIDLEAVE: this.commonService.emptyToZero(form.excludeHalfPaidLeave == true? 1:0),
      DED_UPAIDLEAVE: this.commonService.emptyToZero(form.excludeUnPaidLeave == true? 1:0),
      DED_HPAIDLEAVE: this.commonService.emptyToZero(
        form.excludeHalfUnPaidLeave == true? 1:0
      ),
      COUNTRYCODE:"string",
      UDF1: this.commonService.nullToString(form.userDefined1),
      UDF2: this.commonService.nullToString(form.userDefined2),
      UDF3: this.commonService.nullToString(form.userDefined3),
      UDF4: this.commonService.nullToString(form.userDefined4),
      UDF5: this.commonService.nullToString(form.userDefined5),
      UDF6: this.commonService.nullToString(form.userDefined6),
      UDF7: this.commonService.nullToString(form.userDefined7),
      UDF8: this.commonService.nullToString(form.userDefined8),
      UDF9: this.commonService.nullToString(form.userDefined9),
      UDF10: this.commonService.nullToString(form.userDefined10),
      UDF11: this.commonService.nullToString(form.userDefined11),
      UDF12: this.commonService.nullToString(form.userDefined12),
      UDF13: this.commonService.nullToString(form.userDefined13),
      UDF14: this.commonService.nullToString(form.userDefined14),
      UDF15: this.commonService.nullToString(form.userDefined15),
    };
    console.log(form.excludeHalfPaidLeave);
    
    return postData;
  }

  formSubmit() {
    if (this.content?.FLAG == "VIEW") return;
    if (this.content?.FLAG == "EDIT") {
      this.updateMaster();
      return;
    }
    let API = "PayLvSalaryMaster/InsertPayLVSalaryMaster";
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
                  this.LeaveSalaryMasterForm.reset();
                  this.tableData = [];
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
      "PayLvSalaryMaster/UpdatePayLVSalaryMaster/" +
      this.LeaveSalaryMasterForm.value.code;
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
                  this.LeaveSalaryMasterForm.reset();
                  this.tableData = [];
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
  deleteRecord() {
    // if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.CODE) {
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
          "PayLvSalaryMaster/DeletePayLVSalaryMaster/" + this.content?.CODE;
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
                      this.LeaveSalaryMasterForm.reset();
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
                      this.LeaveSalaryMasterForm.reset();
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
  BranchDataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.debit.setValue(e.CODE);
  }

  UserDefined1DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined1.setValue(e.CODE);
  }
  UserDefined2DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined2.setValue(e.CODE);
  }
  UserDefined3DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined3.setValue(e.CODE);
  }
  UserDefined4DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined4.setValue(e.CODE);
  }
  UserDefined5DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined5.setValue(e.CODE);
  }
  UserDefined6DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined6.setValue(e.CODE);
  }
  UserDefined7DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined7.setValue(e.CODE);
  }
  UserDefined8DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined8.setValue(e.CODE);
  }
  UserDefined9DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined9.setValue(e.CODE);
  }
  UserDefined10DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined10.setValue(e.CODE);
  }
  UserDefined11DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined11.setValue(e.CODE);
  }
  UserDefined12DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined12.setValue(e.CODE);
  }
  UserDefined13DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined13.setValue(e.CODE);
  }
  UserDefined14DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined14.setValue(e.CODE);
  }
  UserDefined15DataSelected(e: any) {
    console.log(e);
    this.LeaveSalaryMasterForm.controls.userDefined15.setValue(e.CODE);
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

                    this.LeaveSalaryMasterForm.controls[formName].setValue(
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
      this.LeaveSalaryMasterForm.controls[formName].setValue("");
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
      const control = this.LeaveSalaryMasterForm.controls[controllerName];
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
      case "debit":
        this.overlayDebit.showOverlayPanel(event);
        break;
      case "userDefined1":
        this.userDefined1.showOverlayPanel(event);
        break;
      case "userDefined2":
        this.userDefined2.showOverlayPanel(event);
        break;
      case "userDefined3":
        this.userDefined3.showOverlayPanel(event);
        break;
      case "userDefined4":
        this.userDefined4.showOverlayPanel(event);
        break;
      case "userDefined5":
        this.userDefined5.showOverlayPanel(event);
        break;
      case "userDefined6":
        this.userDefined6.showOverlayPanel(event);
        break;
      case "userDefined7":
        this.userDefined7.showOverlayPanel(event);
        break;
      case "userDefined8":
        this.userDefined8.showOverlayPanel(event);
        break;
      case "userDefined9":
        this.userDefined9.showOverlayPanel(event);
        break;
      case "userDefined10":
        this.userDefined10.showOverlayPanel(event);
        break;
      case "userDefined11":
        this.userDefined11.showOverlayPanel(event);
        break;
      case "userDefined12":
        this.userDefined12.showOverlayPanel(event);
        break;
      case "userDefined13":
        this.userDefined13.showOverlayPanel(event);
        break;
      case "userDefined14":
        this.userDefined14.showOverlayPanel(event);
        break;
      case "userDefined15":
        this.userDefined15.showOverlayPanel(event);
        break;
      default:
    }
  }
}
