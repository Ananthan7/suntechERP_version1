import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { MatSnackBar } from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import { RepairDetailsComponent } from "./repair-details/repair-details.component";
import { DailyRatesOunceComponent } from "./daily-rates-ounce/daily-rates-ounce.component";

@Component({
  selector: "app-repair-jewellery-receipt",
  templateUrl: "./repair-jewellery-receipt.component.html",
  styleUrls: ["./repair-jewellery-receipt.component.scss"],
})
export class RepairJewelleryReceiptComponent implements OnInit {
  columnheadItemDetails: any[] = [
    "SRNO",
    "DIVISION_CODE",
    "ITEM_DESCRIPTION",
    "DT_REMARKS",
    "PCS",
    "GROSSWT",
    "REPAIR_TYPE",
    "ITEM_STATUSTYPE",
  ];

  @Input() content!: any;
  tableData: any[] = [];
  userName = localStorage.getItem("username");
  yearMonth?: any = localStorage.getItem("YEAR") || "";
  branchCode?: any = localStorage.getItem("userbranch");
  vocMaxDate = new Date();
  currentDate = new Date();
  repairDetailsData: any[] = [];
  companyName = this.comService.allbranchMaster["BRANCH_NAME"];
  private subscriptions: Subscription[] = [];
  isCurrencyUpdate: boolean = false;
  viewOnly: boolean = false;
  editOnly: boolean = false;
  selectedIndexes: any = [];
  editAndViewData: any;
  filteredData: any;
  hideCurrecnySearch: boolean = false;
  voucherNo: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    if (this.content?.MID != null) this.getArgsData();
    else this.generateVocNo();

    this.repairjewelleryreceiptFrom.controls.vocType.setValue(
      this.comService.getqueryParamVocType()
    );
    this.repairjewelleryreceiptFrom.controls.vocDate.setValue(this.currentDate);

    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  generateVocNo() {
    let API = `GenerateNewVoucherNumber/GenerateNewVocNum/${this.comService.getqueryParamVocType()}/${
      this.branchCode
    }/${this.yearMonth}/${this.convertDateToYMD(this.currentDate)}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          this.repairjewelleryreceiptFrom.controls.vocno.setValue(res.newvocno);
        }
      });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  CurrencySelected(e: any) {
    this.resetVatFields();
    this.repairjewelleryreceiptFrom.controls.currency.setValue(e.Currency);

    this.repairjewelleryreceiptFrom.controls.currency_rate.setValue(
      this.comService.decimalQuantityFormat(e["Conv Rate"], "RATE")
    );
  }

  resetVatFields() {
    this.repairjewelleryreceiptFrom.controls.currency.setValue("");
    this.repairjewelleryreceiptFrom.controls.currency_rate.setValue("");
  }

  repairjewelleryreceiptFrom: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocno: [""],
    vocDate: [""],
    salesman: [""],
    customer: [""],
    customerDesc: [""],
    mobile: [""],
    tel: [""],
    nationality: [""],
    type: [""],
    remark: [""],
    currency: [""],
    currency_rate: [""],
    email: [""],
    address: [""],
    repair_narration: [""],
    customer_delivery_date: [null],
    repairAmt: [""],
  });

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
    this.repairjewelleryreceiptFrom.controls.salesman.setValue(
      e.SALESPERSON_CODE
    );
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  customerCodeSelected(e: any) {
    this.repairjewelleryreceiptFrom.controls.customer.setValue(e.CODE);
    this.repairjewelleryreceiptFrom.controls.customerDesc.setValue(e.NAME);
    this.repairjewelleryreceiptFrom.controls.email.setValue(e.EMAIL);
    this.repairjewelleryreceiptFrom.controls.tel.setValue(e.TEL1);
    this.repairjewelleryreceiptFrom.controls.mobile.setValue(e.MOBILE);
  }

  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Currency Code",
    SEARCH_VALUE: "",
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  getArgsData() {
    console.log("this.content", this.content);
    if (this.content.FLAG == "VIEW") this.viewOnly = true;
    if (this.content.FLAG == "EDIT") {
      this.editOnly = true;
    }

    let headerSub: Subscription = this.dataService
      .getDynamicAPI(
        `Repair/GetRepairHeaderList/${
          this.branchCode
        }/${this.comService.getqueryParamVocType()}/${this.yearMonth}`
      )
      .subscribe((result) => {
        this.snackBar.dismiss();

        this.filteredData = result.response.filter(
          (item: any) => item.MID === this.content.MID
        );

        console.log(this.filteredData);
        this.voucherNo = this.filteredData[0].VOCNO;

        this.repairjewelleryreceiptFrom.controls["vocType"].setValue(
          this.filteredData[0].VOCTYPE
        );
        this.repairjewelleryreceiptFrom.controls["vocno"].setValue(
          this.filteredData[0].VOCNO
        );
        this.repairjewelleryreceiptFrom.controls["vocDate"].setValue(
          this.filteredData[0].VOCDATE
        );
        this.repairjewelleryreceiptFrom.controls["salesman"].setValue(
          this.filteredData[0].SALESPERSON_CODE
        );
        this.repairjewelleryreceiptFrom.controls["customer"].setValue(
          this.filteredData[0].POSCUSTCODE
        );
        this.repairjewelleryreceiptFrom.controls["customerDesc"].setValue(
          this.filteredData[0].PARTYNAME
        );

        this.repairjewelleryreceiptFrom.controls["mobile"].setValue(
          this.filteredData[0].MOBILE
        );
        this.repairjewelleryreceiptFrom.controls["tel"].setValue(
          this.filteredData[0].TEL1
        );
        this.repairjewelleryreceiptFrom.controls["nationality"].setValue(
          this.filteredData[0].NATIONALITY
        );
        this.repairjewelleryreceiptFrom.controls["type"].setValue(
          this.filteredData[0].TYPE
        );
        this.repairjewelleryreceiptFrom.controls["currency"].setValue(
          this.filteredData[0].BASE_CURRENCY
        );
        this.repairjewelleryreceiptFrom.controls["currency_rate"].setValue(
          this.filteredData[0].BASE_CURR_RATE
        );
        this.repairjewelleryreceiptFrom.controls["email"].setValue(
          this.filteredData[0].EMAIL
        );
        this.repairjewelleryreceiptFrom.controls["address"].setValue(
          this.filteredData[0].ADDRESS
        );
        this.repairjewelleryreceiptFrom.controls["repair_narration"].setValue(
          this.filteredData[0].SALESREFERENCE
        );
        this.repairjewelleryreceiptFrom.controls[
          "customer_delivery_date"
        ].setValue(this.filteredData[0].DELIVERYDATE);

        // this.repairjewelleryreceiptFrom.controls[
        //   "customer_delivery_date"
        // ].disable();

        this.repairjewelleryreceiptFrom.controls["remark"].setValue(
          this.filteredData[0].REMARKS
        );
        let API = `Repair/GetRepairDetailList/${
          this.branchCode
        }/${this.comService.getqueryParamVocType()}/${this.voucherNo}/${
          this.yearMonth
        }`;

        let detailSub: Subscription = this.dataService
          .getDynamicAPI(API)
          .subscribe((result) => {
            this.snackBar.dismiss();

            this.repairDetailsData = result.response.Details;
            this.repairjewelleryreceiptFrom.controls["repairAmt"].setValue(
              this.repairDetailsData[0].AMOUNT
            );
          });
      });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  removedata() {}

  validateForm() {
    if (this.repairjewelleryreceiptFrom.invalid) {
      this.toastr.error("Select all required fields");
      return false;
    }
    return true;
  }

  formSubmit() {
    console.log(this.content);

    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (!this.validateForm()) {
      return;
    }

    let API = "Repair/InsertRepair";
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.repairjewelleryreceiptFrom.value.vocType,
      VOCNO: this.repairjewelleryreceiptFrom.value.vocno,
      VOCDATE: this.repairjewelleryreceiptFrom.value.vocDate,
      YEARMONTH: this.yearMonth,
      SALESPERSON_CODE: this.repairjewelleryreceiptFrom.value.salesman,
      POSCUSTCODE: this.repairjewelleryreceiptFrom.value.customer,
      PARTYNAME: "",
      TEL1: this.repairjewelleryreceiptFrom.value.tel,
      TEL2: "",
      MOBILE: this.repairjewelleryreceiptFrom.value.mobile,
      POBOX: "",
      NATIONALITY: this.repairjewelleryreceiptFrom.value.nationality,
      EMAIL: this.repairjewelleryreceiptFrom.value.email,
      TYPE: this.repairjewelleryreceiptFrom.value.type,
      REMARKS: this.repairjewelleryreceiptFrom.value.remark,
      TOTAL_PCS: 0,
      TOTAL_GRWT: 0,
      SYSTEM_DATE: new Date().toISOString(),
      NAVSEQNO: 0,
      DELIVERYDATE:
        this.repairjewelleryreceiptFrom.value.customer_delivery_date._d.toISOString(),
      SALESREFERENCE: this.repairjewelleryreceiptFrom.value.repair_narration,
      STATUS: 0,
      TRANSFERID: 0,
      ADDRESS: this.repairjewelleryreceiptFrom.value.address,
      TRANSFERFLAG: true,
      BASE_CURRENCY: this.repairjewelleryreceiptFrom.value.currency,
      BASE_CURR_RATE: this.repairjewelleryreceiptFrom.value.currency_rate,
      ISAUTHORIZED: true,
      AUTHORIZEDDATE: new Date().toISOString(),
      AUTOPOSTING: true,
      PRINT_COUNT: 0,
      TOT_EST_REPAIR_CHARGES: 0,
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      HTUSERNAME: "",
      AUTHORISE_BRANCH: "",
      CITY: "",
      MOBILECODE: "",
      RELIGION: "",
      STATE: "",
      POSCUSTPREFIX: "",
      AUTHORISE: 0,
      WSID: 0,
      Details: this.repairDetailsData,
    };

    console.log(this.repairDetailsData);

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
                  this.repairjewelleryreceiptFrom.reset();
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

  update() {
    if (this.repairjewelleryreceiptFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = `Repair/UpdateRepair/${this.branchCode}/${this.repairjewelleryreceiptFrom.value.vocType}/${this.repairjewelleryreceiptFrom.value.vocno}/${this.yearMonth}`;
    let postData = {
      MID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.repairjewelleryreceiptFrom.value.vocType,
      VOCNO: this.repairjewelleryreceiptFrom.value.vocno,
      VOCDATE: this.repairjewelleryreceiptFrom.value.vocDate,
      YEARMONTH: this.yearMonth,
      SALESPERSON_CODE: this.repairjewelleryreceiptFrom.value.salesman,
      POSCUSTCODE: this.repairjewelleryreceiptFrom.value.customer,
      PARTYNAME: "",
      TEL1: this.repairjewelleryreceiptFrom.value.tel,
      TEL2: "",
      MOBILE: this.repairjewelleryreceiptFrom.value.mobile,
      POBOX: "",
      NATIONALITY: this.repairjewelleryreceiptFrom.value.nationality,
      EMAIL: this.repairjewelleryreceiptFrom.value.email,
      TYPE: this.repairjewelleryreceiptFrom.value.type,
      REMARKS: this.repairjewelleryreceiptFrom.value.remark,
      TOTAL_PCS: 0,
      TOTAL_GRWT: 0,
      SYSTEM_DATE: new Date().toISOString(),
      NAVSEQNO: 0,
      DELIVERYDATE:
        this.repairjewelleryreceiptFrom.value.customer_delivery_date,
      SALESREFERENCE: this.repairjewelleryreceiptFrom.value.repair_narration,
      STATUS: 0,
      TRANSFERID: 0,
      ADDRESS: this.repairjewelleryreceiptFrom.value.address,
      TRANSFERFLAG: true,
      BASE_CURRENCY: this.repairjewelleryreceiptFrom.value.currency,
      BASE_CURR_RATE: this.repairjewelleryreceiptFrom.value.currency_rate,
      ISAUTHORIZED: true,
      AUTHORIZEDDATE: new Date().toISOString(),
      AUTOPOSTING: true,
      PRINT_COUNT: 0,
      TOT_EST_REPAIR_CHARGES: 0,
      PRINT_COUNT_ACCOPY: 0,
      PRINT_COUNT_CNTLCOPY: 0,
      HTUSERNAME: "",
      AUTHORISE_BRANCH: "",
      CITY: "",
      MOBILECODE: "",
      RELIGION: "",
      STATE: "",
      POSCUSTPREFIX: "",
      AUTHORISE: 0,
      WSID: 0,
      Details: this.repairDetailsData,
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
                  this.repairjewelleryreceiptFrom.reset();
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

  deleteRecord() {
    if (!this.content.VOCTYPE) {
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
          "Repair/DeleteRepair/" +
          this.branchCode +
          this.repairjewelleryreceiptFrom.value.vocType +
          this.repairjewelleryreceiptFrom.value.vocno +
          this.yearMonth;
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
                      this.repairjewelleryreceiptFrom.reset();
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
                      this.repairjewelleryreceiptFrom.reset();
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subscription) => subscription.unsubscribe()); // unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }
  onRowDoubleClicked(e: any) {    
    e.cancel = true;
    this.openRepairdetails(e.data);
  }

  open(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(
      DailyRatesOunceComponent,
      {
        size: "xl",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.componentInstance.receiptData = { ...data };
    modalRef.componentInstance.queryParams = { isViewOnly: this.viewOnly };

    modalRef.result.then((postData) => {
      if (postData) {
        console.log("Data from modal:", postData);
        this.handlePostData(postData);
      }
    });
  }

  openRepairdetails(data: any = null) {
    const modalRef: NgbModalRef = this.modalService.open(
      RepairDetailsComponent,
      {
        size: "xl",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.componentInstance.receiptData = { ...data };
    modalRef.componentInstance.queryParams = { isViewOnly: this.viewOnly };

    modalRef.result.then((postData) => {
      if (postData) {
        console.log("Data from modal:", postData);
        this.handlePostData(postData);
      }
    });
  }

  handlePostData(postData: any) {
    const preItemIndex = this.repairDetailsData.findIndex(
      (data: any) => data.SRNO.toString() == postData.SRNO.toString()
    );

    if (postData?.isUpdate && preItemIndex !== -1) {
      this.repairDetailsData[preItemIndex] = postData;
    } else {
      this.repairDetailsData.push(postData);
    }

    console.log("Updated repairDetailsData", this.repairDetailsData);
    this.updateFormValuesAndSRNO();
  }

  updateFormValuesAndSRNO() {
    this.repairDetailsData.forEach((data, index) => {
      data.SRNO = index + 1;
    });
  }

  removeLineItemsGrid(e: any) {
    console.log(e.data);
    const values: any = [];
    values.push(e.data.SRNO);
    let indexes: Number[] = [];
    this.repairDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    this.updateFormValuesAndSRNO();
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;

    console.log(values);
    let indexes: Number[] = [];
    this.repairDetailsData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
  }
}
