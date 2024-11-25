import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelectChange } from "@angular/material/select";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-gratuity-master",
  templateUrl: "./gratuity-master.component.html",
  styleUrls: ["./gratuity-master.component.scss"],
})
export class GratuityMasterComponent implements OnInit {
  @ViewChild("overlayDebitAc") overlayDebitAc!: MasterSearchComponent;
  @ViewChild("overlayCountryCode") overlayCountryCode!: MasterSearchComponent;
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

  @Input() content!: any;
  selectedTabIndex = 0;
  tableData: any = [];
  flag: any;
  code: any;
  gridData: any;
  typeData: any;
  typeAsParams: any;
  postDataDetails: any = [];
  optionalData: any;
  basedOnDropdown: any;
  private subscriptions: Subscription[] = [];

  columnHeadings: any[] = [
    { FIELD: "SRNO", CAPTION: "SRNO" },
    { FIELD: "GRATTYPE", CAPTION: "TYPE" },
    { FIELD: "YPERIOD", CAPTION: "YEAR PERIOD" },
    { FIELD: "NDAYS", CAPTION: "NO OF DAYS" },
  ];

  debitAccCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    ORDER_TYPE: 0,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Debit A/C Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "COUNTRY CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
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

  gratuityMasterForm: FormGroup = this.formBuilder.group({
    type: [""],
    code: ["", [Validators.required]],
    description: ["", [Validators.required]],
    branch: [""],
    BranchDes: [""],
    excludeAnnualLeaves: [""],
    debitAc: ["", [Validators.required]],
    debitAcDesc: ["", [Validators.required]],
    excludeUnpaidLeaves: [""],
    countryCode: ["", [Validators.required]],
    countryDesc: ["", [Validators.required]],
    excludePaidLeaves: [""],
    basedOn: [""],
    amount: [""],
    excludeHalfPaidLeaves: [""],
    noOfDaysAndYear: [""],
    noOfDaysAndMonth: [""],
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
  excludeAnnualLeaves!: boolean;
  excludeUnpaidLeaves!: boolean;
  excludePaidLeaves!: boolean;
  excludeHalfPaidLeaves!: boolean;

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
    this.setFlag(this.flag, this.content);
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

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
      this.gratuityTypeData();
      this.basedOnDropdown = this.getUniqueValues(
        this.commonService.getComboFilterByID("GRATUITY BASED ON"),
        "ENGLISH"
      );
    }
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.gratuityTypeData();
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  async ViewController(DATA: any) {
    this.code = DATA.CODE;

    try {
      const ALTERDATA = await this.optionalViewData(DATA.CODE);

      const ALTERDATADETAILS = ALTERDATA.Details.map(
        (item: any, index: number) => {
          return {
            ...item,
            SRNO: index + 1,
          };
        }
      );

      console.log(ALTERDATADETAILS);

      this.gratuityMasterForm.controls["code"].setValue(DATA.CODE);
      this.gratuityMasterForm.controls["basedOn"].setValue(DATA.BASED_ON);
      this.gratuityMasterForm.controls["countryCode"].setValue(
        DATA.COUNTRYCODE
      );

      this.gratuityMasterForm.controls["countryDesc"].setValue(
        ALTERDATA.COUNTRYCODE_DESCRIPTION
      );
      this.gratuityMasterForm.controls["debitAc"].setValue(DATA.DEBITACCODE);
      this.gratuityMasterForm.controls["debitAcDesc"].setValue(
        ALTERDATA.DEBITACCODE_DESCRIPTION
      );
      this.gratuityMasterForm.controls["amount"].setValue(
        this.commonService.decimalQuantityFormat(DATA.FIXAMOUNT, "AMOUNT")
      );
      this.gratuityMasterForm.controls["description"].setValue(
        DATA.DESCRIPTION
      );
      console.log(DATA.GRATTYPE);

      this.gratuityMasterForm.controls["type"].setValue(DATA.GRATTYPE);
      this.gratuityMasterForm.controls["noOfDaysAndYear"].setValue(
        DATA.YEARDAYS
      );
      this.gratuityMasterForm.controls["noOfDaysAndMonth"].setValue(30);
      this.gratuityMasterForm.controls["excludeAnnualLeaves"].setValue(
        DATA.DED_ANNUALLEAVE === 1
      );
      this.gratuityMasterForm.controls["excludePaidLeaves"].setValue(
        DATA.DED_PAIDLEAVE === 1
      );
      this.gratuityMasterForm.controls["excludeUnpaidLeaves"].setValue(
        DATA.DED_UPAIDLEAVE === 1
      );
      this.gratuityMasterForm.controls["excludeHalfPaidLeaves"].setValue(
        DATA.DED_HPAIDLEAVE === 1
      );

      this.gratuityMasterForm.controls["userDefined1"].setValue(DATA.UDF1);
      this.gratuityMasterForm.controls["userDefined2"].setValue(DATA.UDF2);
      this.gratuityMasterForm.controls["userDefined3"].setValue(DATA.UDF3);
      this.gratuityMasterForm.controls["userDefined4"].setValue(DATA.UDF4);
      this.gratuityMasterForm.controls["userDefined5"].setValue(DATA.UDF5);
      this.gratuityMasterForm.controls["userDefined6"].setValue(DATA.UDF6);
      this.gratuityMasterForm.controls["userDefined7"].setValue(DATA.UDF7);
      this.gratuityMasterForm.controls["userDefined8"].setValue(DATA.UDF8);
      this.gratuityMasterForm.controls["userDefined9"].setValue(DATA.UDF9);
      this.gratuityMasterForm.controls["userDefined10"].setValue(DATA.UDF10);
      this.gratuityMasterForm.controls["userDefined11"].setValue(DATA.UDF11);
      this.gratuityMasterForm.controls["userDefined12"].setValue(DATA.UDF12);
      this.gratuityMasterForm.controls["userDefined13"].setValue(DATA.UDF13);
      this.gratuityMasterForm.controls["userDefined14"].setValue(DATA.UDF14);
      this.gratuityMasterForm.controls["userDefined15"].setValue(DATA.UDF15);

      this.gridData = ALTERDATADETAILS;
    } catch (error) {
      console.error("Error in ViewController:", error);
      this.commonService.showSnackBarMsg("Content only loaded");
    }
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
        const API = `PayGratuityMaster/DeletePayGratuityMaster/${this.code}`;
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

              response.status === "Success"
                ? this.close("reloadMainGrid", true)
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

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.gratuityMasterForm.controls[ctrl].setValue(value);
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
        this.gratuityMasterForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  gratuityMasterFormSubmit() {
    Object.keys(this.gratuityMasterForm.controls).forEach((controlName) => {
      const control = this.gratuityMasterForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.gratuityMasterForm.controls
    ).some((controlName) => {
      const control = this.gratuityMasterForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {

      this.postDataDetails = this.gridData
        ? this.gridData.map((item: any, index: number) => {
            return {
              UNIQUEID: 0,
              CODE: this.code,
              YPERIOD: item.YPERIOD,
              NDAYS: item.NDAYS,
            };
          })
        : [];

      let postData = {
        MID: 0,
        CODE: this.gratuityMasterForm.value.code,
        DESCRIPTION: this.gratuityMasterForm.value.description,
        DEBITACCODE: this.gratuityMasterForm.value.debitAc,
        BASED_ON: this.gratuityMasterForm.value.basedOn,
        FIXAMOUNT: this.gratuityMasterForm.value.amount,
        DED_ANNUALLEAVE: this.excludeAnnualLeaves == true ? 1 : 0,
        DED_PAIDLEAVE: this.excludePaidLeaves == true ? 1 : 0,
        DED_UPAIDLEAVE: this.excludeUnpaidLeaves == true ? 1 : 0,
        DED_HPAIDLEAVE: this.excludeHalfPaidLeaves == true ? 1 : 0,
        YEARDAYS: this.gratuityMasterForm.value.noOfDaysAndYear,
        GRATTYPE: this.gratuityMasterForm.value.type,
        COUNTRYCODE: this.gratuityMasterForm.value.countryCode,
        UDF1: this.gratuityMasterForm.value.userDefined1,
        UDF2: this.gratuityMasterForm.value.userDefined2,
        UDF3: this.gratuityMasterForm.value.userDefined3,
        UDF4: this.gratuityMasterForm.value.userDefined4,
        UDF5: this.gratuityMasterForm.value.userDefined5,
        UDF6: this.gratuityMasterForm.value.userDefined6,
        UDF7: this.gratuityMasterForm.value.userDefined7,
        UDF8: this.gratuityMasterForm.value.userDefined8,
        UDF9: this.gratuityMasterForm.value.userDefined9,
        UDF10: this.gratuityMasterForm.value.userDefined10,
        UDF11: this.gratuityMasterForm.value.userDefined11,
        UDF12: this.gratuityMasterForm.value.userDefined12,
        UDF13: this.gratuityMasterForm.value.userDefined13,
        UDF14: this.gratuityMasterForm.value.userDefined14,
        UDF15: this.gratuityMasterForm.value.userDefined15,
        Details: this.postDataDetails,
      };

      if (this.flag === "EDIT") {
        let API = `PayGratuityMaster/UpdatePayGratuityMaster/${this.code}`;
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
        let API = `PayGratuityMaster/InsertPayGratuityMaster`;
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

  boxChecker(event: MatCheckboxChange, controller: any) {
    switch (controller) {
      case "excludeAnnualLeaves":
        this.excludeAnnualLeaves = event.checked;
        break;

      case "excludeUnpaidLeaves":
        this.excludeUnpaidLeaves = event.checked;
        break;

      case "excludePaidLeaves":
        this.excludePaidLeaves = event.checked;
        break;
      case "excludeHalfPaidLeaves":
        this.excludeHalfPaidLeaves = event.checked;
        break;

      default:
        break;
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
                    this.gratuityMasterForm.controls[formName].setValue(
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
      this.gratuityMasterForm.controls[formName].setValue("");
    });
  }
  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "debitAc":
        this.overlayDebitAc.showOverlayPanel(event);
        break;
      case "countryCode":
        this.overlayCountryCode.showOverlayPanel(event);
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
      const control = this.gratuityMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(codeData, controllers);
  }

  gratuityTypeData() {
    let API = `PayGratuityMaster/GratuityMasterTypeDropdown`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.typeData = result.dynamicData[0] || [];
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.showSnackBarMsg("Type Field is not binding...!");
      }
    );
  }

  setFlag(currentFlag: string, DATA: any): void {
    this.flag = currentFlag;

    switch (this.flag) {
      case "VIEW":
        this.gratuityMasterForm.controls["excludeAnnualLeaves"].disable();
        // this.gratuityMasterForm.controls["type"].disable();
        this.gratuityMasterForm.controls["excludeUnpaidLeaves"].disable();
        this.gratuityMasterForm.controls["excludePaidLeaves"].disable();
        this.gratuityMasterForm.controls["excludeHalfPaidLeaves"].disable();

        break;

      default:
        break;
    }
  }

  GetGridThroughType(event: MatSelectChange) {
    this.typeAsParams = event.value;
    this.GratuityGridData(this.typeAsParams);
  }

  GratuityGridData(type: any) {
    let API = `PayGratuityMaster/GratuityMasterGridData/${type}`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.gridData = result.dynamicData[0].map(
            (item: any, index: number) => {
              return { ...item, SRNO: index + 1 };
            }
          );
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  optionalViewData(CODE: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let API = `PayGratuityMaster/GetPayGratuityMasterDetail/${CODE}`;
      this.apiService.getDynamicAPI(API).subscribe(
        (result) => {
          if (result.status.trim() === "Success") {
            console.log(result.response);
            this.optionalData = result.response;
            resolve(this.optionalData);
          } else {
            reject(new Error("Failed to fetch data"));
          }
        },
        (err) => {
          console.error("Error fetching data:", err);
          this.commonService.toastErrorByMsgId("MSG1531");
          reject(err);
        }
      );
    });
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }
}
