import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-gratuity-master",
  templateUrl: "./gratuity-master.component.html",
  styleUrls: ["./gratuity-master.component.scss"],
})
export class GratuityMasterComponent implements OnInit {
  @Input() content!: any;
  selectedTabIndex = 0;
  tableData: any = [];
  flag: any;
  code: any;
  typeList = [{ field: "Yes" }, { field: "No" }];
  private subscriptions: Subscription[] = [];

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

  gratuityMasterForm: FormGroup = this.formBuilder.group({
    type: [""],
    code: [""],
    description: [""],
    branch: [""],
    BranchDes: [""],
    excludeAnnualLeaves: [""],
    debitAc: [""],
    debitAcDesc: [""],
    excludeUnpaidLeaves: [""],
    countryCode: [""],
    countryDesc: [""],
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
    this.flag = this.content?.FLAG;
    this.initialController(this.flag, this.content);
    console.log(this.content);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
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
    this.gratuityMasterForm.controls["code"].setValue(DATA.CODE);
    this.gratuityMasterForm.controls["basedOn"].setValue(DATA.BASED_ON);
    this.gratuityMasterForm.controls["countryCode"].setValue(DATA.COUNTRYCODE);
    this.gratuityMasterForm.controls["debitAc"].setValue(DATA.DEBITACCODE);
    this.gratuityMasterForm.controls["amount"].setValue(
      this.commonService.decimalQuantityFormat(DATA.FIXAMOUNT, "AMOUNT")
    );
    this.gratuityMasterForm.controls["description"].setValue(DATA.DESCRIPTION);
    this.gratuityMasterForm.controls["type"].setValue(DATA.GRATTYPE);
    this.gratuityMasterForm.controls["noOfDaysAndYear"].setValue(DATA.YEARDAYS);
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
      // Handle single controller and field
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
      Details: [
        {
          UNIQUEID: 0,
          CODE: "string",
          YPERIOD: "string",
          NDAYS: 0,
        },
      ],
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
      let API = `PayGratuityMaster/InsertPayGratuityMaster`;
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
}
