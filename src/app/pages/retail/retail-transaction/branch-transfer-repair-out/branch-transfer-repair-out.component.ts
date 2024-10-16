import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";

@Component({
  selector: "app-branch-transfer-repair-out",
  templateUrl: "./branch-transfer-repair-out.component.html",
  styleUrls: ["./branch-transfer-repair-out.component.scss"],
})
export class BranchTransferRepairOutComponent implements OnInit {
  @Input() content!: any;

  branchCode?: any = localStorage.getItem("userbranch");
  yearMonth?: any = localStorage.getItem("YEAR") || "";
  PendingRepairJobsData: any;

  private subscriptions: Subscription[] = [];

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode: any = "";
  columnhead: any[] = [
    "Rep Voc No",
    "Stock Code",
    "Bag No",
    "Customer Name",
    "Mobile",
    "Deliver Date",
    "Status",
  ];
  columnheadDetails: any[] = [
    "Div",
    "Stock Code",
    "Description",
    "Bag No",
    "Remarks",
    "Pcs",
    "Rep type",
    "Delivery",
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService
  ) {}
  repairtransferform: FormGroup = this.formBuilder.group({
    voctype: [""],
    vocNo: [""],
    vocdate: [new Date()],
    salesman: [""],
    branchcode: [""],
    branchname: [""],
    remarks: [""],
  });

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

    this.repairtransferform.controls.voctype.setValue(
      this.comService.getqueryParamVocType()
    );

    this.generateVocNo();
    this.getPendingRepairJobs();
  }

  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman type",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  salesManCodeSelected(e: any) {
    this.repairtransferform.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "Salesman type",
    SEARCH_VALUE: "",
    WHERECONDITION: "Branch_Code<>'" + this.branchCode + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  branchCodeSelected(e: any) {
    console.log(e);
    this.repairtransferform.controls.branchcode.setValue(e.BRANCH_CODE);
    this.repairtransferform.controls.branchname.setValue(e.BRANCH_NAME);
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${
      this.branchCode
    }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.repairtransferform.controls.vocNo.setValue(res.newvocno);
        }
      });
  }

  getPendingRepairJobs() {
    let API = `ExecueteSPInterface`;
    let bodyData = {
      SPID: "095",
      parameter: {
        STRMAINVOCTYPE: this.comService.getqueryParamVocType(),
        STRBRANCHCODE: this.branchCode,
        STRJOBSTATUS: "0",
      },
    };

    let sub: Subscription = this.dataService
      .postDynamicAPI(API, bodyData)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.PendingRepairJobsData = res.dynamicData[0].map((item: any) => ({
            ...item,
            DELIVERYDATE: new Date(item.DELIVERYDATE).toLocaleDateString(),
          }));
          console.log(this.PendingRepairJobsData.DELIVERYDATE);
        }
      });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  validateForm() {
    if (this.repairtransferform.invalid) {
      this.toastr.error("Select all required fields");
      return false;
    }
    return true;
  }

  formSubmit() {
    if (this.content && this.content.FLAG == "EDIT") {
      this.updaterepairtransfer();
      return;
    }
    if (!this.validateForm()) {
      return;
    }

    let API = "RepairTransfer/InsertRepairTransfer";
    let postData = {
      MID: 0,
      BRANCH_CODE: this.repairtransferform.value.branchcode,
      VOCTYPE: this.repairtransferform.value.voctype,
      VOCNO: this.repairtransferform.value.vocNo,
      VOCDATE: this.repairtransferform.value.vocdate,
      YEARMONTH: this.yearMonth,
      SALESPERSON_CODE: this.repairtransferform.value.salesman,
      BRANCHTO: "",
      REMARKS: this.repairtransferform.value.remarks,
      SYSTEM_DATE: new Date().toISOString(),
      NAVSEQNO: 0,
      STATUS: "",
      METALVOCNO: 0,
      METALWEIGHT: 0,
      METALAMOUNT: 0,
      METALMID: 0,
      METALVOCTYPE: "",
      METALCODE: "",
      DIAMONDCODE: "",
      DIAMONDVOCNO: 0,
      DIAMONDVOCTYPE: "",
      DIAMONDMID: 0,
      DIAMONDWGT: 0,
      DIAMONDAMOUNT: 0,
      SUPINVDATE: new Date().toISOString(),
      SUPINVNO: "",
      TRANSFERBRANCH: "",
      AUTOPOSTING: true,
      BRANCHTONAME: this.repairtransferform.value.branchname,
      ISMETALDIAMOND: "",
      HASJOBDONE: "",
      PRINT_COUNT: 0,
      POSCUSTCODE: "",
      POSCUSTNAME: "",
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      HTUSERNAME: "",
      JOBDONE: 0,
      METALANDDIAMOND: 0,
    };

    console.log(postData);

    let Sub: Subscription = this.dataService
      .postDynamicAPI(API, postData)
      .subscribe(
        (result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
              Swal.fire({
                title: result.message || "Success",
                text: "",
                icon: "success",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              }).then((result: any) => {
                if (result.value) {
                  this.repairtransferform.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  updaterepairtransfer() {
    if (this.repairtransferform.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      "RepairTransfer/UpdateRepairTransfer" +
      this.content.BRANCH_CODE +
      this.content.VOCTYPE +
      this.content.VOCNO +
      this.content.YEARMONTH;
    let postData = {
      MID: 0,
      BRANCH_CODE: "string",
      VOCTYPE: "str",
      VOCNO: 0,
      VOCDATE: "2024-03-07T13:09:28.415Z",
      YEARMONTH: "string",
      SALESPERSON_CODE: "string",
      BRANCHTO: "string",
      REMARKS: "string",
      SYSTEM_DATE: "2024-03-07T13:09:28.415Z",
      NAVSEQNO: 0,
      STATUS: "string",
      METALVOCNO: 0,
      METALWEIGHT: 0,
      METALAMOUNT: 0,
      METALMID: 0,
      METALVOCTYPE: "str",
      METALCODE: "string",
      DIAMONDCODE: "string",
      DIAMONDVOCNO: 0,
      DIAMONDVOCTYPE: "str",
      DIAMONDMID: 0,
      DIAMONDWGT: 0,
      DIAMONDAMOUNT: 0,
      SUPINVDATE: "2024-03-07T13:09:28.415Z",
      SUPINVNO: "string",
      TRANSFERBRANCH: "string",
      AUTOPOSTING: true,
      BRANCHTONAME: "string",
      ISMETALDIAMOND: "string",
      HASJOBDONE: "string",
      PRINT_COUNT: 0,
      POSCUSTCODE: "string",
      POSCUSTNAME: "string",
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      HTUSERNAME: "string",
      JOBDONE: 0,
      METALANDDIAMOND: 0,
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
                  this.repairtransferform.reset();
                  this.tableData = [];
                  this.close("reloadMainGrid");
                }
              });
            }
          } else {
            this.toastr.error("Not saved");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  deleterepairtransfer() {
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
        let API =
          "/RepairTransfer/DeleteRepairTransfer/" +
          this.repairtransferform.value.branchcode +
          this.repairtransferform.value.voctype +
          this.repairtransferform.value.vocno +
          this.repairtransferform.value.yearmonth;
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
                      this.repairtransferform.reset();
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
                      this.repairtransferform.reset();
                      this.tableData = [];
                      this.close();
                    }
                  });
                }
              } else {
                this.toastr.error("Not deleted");
              }
            },
            (err) => alert(err)
          );
        this.subscriptions.push(Sub);
      }
    });
  }
}
