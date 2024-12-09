import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import Swal from "sweetalert2";
import { formatDate } from '@angular/common';
@Component({
  selector: "app-sales-invoice",
  templateUrl: "./sales-invoice.component.html",
  styleUrls: ["./sales-invoice.component.scss"],
})
export class SalesInvoiceComponent implements OnInit {
  @Input() content!: any;
  currentDate: any;
  salesManSelectionData: any;
  branchSelectionData: any;
  groupDetailsData: any[] = [];
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;
  deleteMode: boolean = false;
  selectedIndexes: any = [];
  dialogBox: any;

  private subscriptions: Subscription[] = [];
  groupDetailsColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Discount Group 1" },
    { dataField: "STOCK_CODE", caption: "Discount Group 2" },
    { dataField: "STOCK_CODE", caption: "Discount %" },
  ];

  branchSelectionColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Description" },
  ];

  salesManSelectionColumns = [
    { dataField: "VOCNO", caption: "Sr No" },
    { dataField: "STOCK_CODE", caption: "Group" },
    { dataField: "STOCK_CODE", caption: "Sales Man" },
  ];
  data: any;
  attrGroup:any;
  compGroup: any;
  baseGroup: any;
  divisionCode:any;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    public dialog: MatDialog
  ) {}

  SalesInvoiceMainForm: FormGroup = this.formBuilder.group({
    desc_code: [""],
    start_from: [""],
    division: [""],
    retail_wholesale: [""],
    metal_diamond: [""],
    component: [""],
    attr_grp: [""],
    comp_grp: [""],
    base_price: [""],
    discount_grp1: [""],
    discount_grp2: [""],
    discount_amount: [""],
  });

  ngOnInit(): void {
    if (this.content?.FLAG) {
      this.setFromvalues();
      if (this.content?.FLAG == "VIEW") {
        this.openRepairdetails();
        this.SalesInvoiceMainForm.controls["retail_wholesale"].setValue(
          this.data?.RETAIL_WHOLESALE.toString()
        );
        this.SalesInvoiceMainForm.controls["metal_diamond"].setValue(
          this.data?.METAL_DIAMOND.toString()
        );

        this.SalesInvoiceMainForm.controls["component"].setValue(
          this.data?.COMPONENT
        );
        this.SalesInvoiceMainForm.controls["division"].setValue(
          this.content.DIVCODE
        );

        this.SalesInvoiceMainForm.controls["attr_grp"].setValue(
          this.content.POS_DISC_GROUP1.toString()
        );
        this.SalesInvoiceMainForm.controls["comp_grp"].setValue(
          this.content.COMPONENT_GROUP.toString()
        );
        this.SalesInvoiceMainForm.controls["base_price"].setValue(
          this.content.BASE_PRICECODE.toString()
        );
        this.SalesInvoiceMainForm.controls["division"].disable();

        this.SalesInvoiceMainForm.controls["attr_grp"].disable();
        this.SalesInvoiceMainForm.controls["comp_grp"].disable();
        this.SalesInvoiceMainForm.controls["base_price"].disable();
        this.SalesInvoiceMainForm.controls["retail_wholesale"].disable();
        this.SalesInvoiceMainForm.controls["metal_diamond"].disable();
        this.SalesInvoiceMainForm.controls["component"].disable();
        this.isDisabled = true;
        this.viewMode = true;
      } else if (this.content?.FLAG == "EDIT") {
        this.openRepairdetails();
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMode = true;
        this.deleteMaster();
      }
    }
    this.attrGroup = this.getUniqueValues(
      this.commonService.getComboFilterByID("POSDISCOUNTSETTGROUP"),
      "ENGLISH"
    );
    this.compGroup = this.getUniqueValues(
      this.commonService.getComboFilterByID("POSDISCOUNTSETTCOMP"),
      "ENGLISH"
    );
    this.baseGroup = this.getUniqueValues(
      this.commonService.getComboFilterByID("DIAMOND PRICE CODE"),
      "ENGLISH"
    );
    let API = `RetailDiscountSetting/RetailDiscountSettingDivisonDropdown/`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        console.log(res);
        this.divisionCode =  res.dynamicData[0];
      });
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  descCodeCheck(e: any) {
    console.log(e.target.value);
    let input = e.target.value;
    let API = `RetailDiscountSetting/CheckIfDiscCodePresent/${input}`;
    let sub: Subscription = this.dataService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.checkifExists === true) {
          let message = `Code Already Exist ! `;
          this.SalesInvoiceMainForm.controls["desc_code"].setValue("");
          return this.openDialog("Warning", message, true);
        }
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
  parseDate(dateString: string): string | null {
    if (!dateString) return null;

    // Assuming the input date format is `dd-MM-yyyy`
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts.map((part) => parseInt(part, 10));
      return formatDate(new Date(year, month - 1, day), "yyyy-MM-dd", "en-US");
    }
    return null;
  }
  setFromvalues() {
    if (!this.content) return;
    console.log(this.content);
    let api =
      "RetailDiscountSetting/GetRetailDiscountSettingDetailWithDiscCode/" +
      this.content.DISC_CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
        this.groupDetailsData = this.data.Details;
        console.log(this.groupDetailsData);
        this.SalesInvoiceMainForm.controls["retail_wholesale"].setValue(
          this.data?.RETAIL_WHOLESALE.toString()
        );
        this.SalesInvoiceMainForm.controls["metal_diamond"].setValue(
          this.data?.METAL_DIAMOND.toString()
        );

        this.SalesInvoiceMainForm.controls["component"].setValue(
          this.data?.COMPONENT
        );
      });
    const startFromDate = this.parseDate(this.content.START_FROM);
    this.SalesInvoiceMainForm.controls["desc_code"].setValue(
      this.content.DISC_CODE
    );
    this.SalesInvoiceMainForm.controls["start_from"].setValue(
      startFromDate
    );
    this.SalesInvoiceMainForm.controls["division"].setValue(
      this.content.DIVCODE
    );

    this.SalesInvoiceMainForm.controls["attr_grp"].setValue(
      this.content.POS_DISC_GROUP1.toString()
    );
    this.SalesInvoiceMainForm.controls["comp_grp"].setValue(
      this.content.COMPONENT_GROUP.toString()
    );
    this.SalesInvoiceMainForm.controls["base_price"].setValue(
      this.content.BASE_PRICECODE.toString()
    );
    this.SalesInvoiceMainForm.controls["discount_grp1"].setValue(
      this.content.POS_DISC_GROUP1
    );
    this.SalesInvoiceMainForm.controls["discount_grp2"].setValue(
      this.content.POS_DISC_GROUP2
    );
  }
  setPostData() {
    let form = this.SalesInvoiceMainForm.value;
    console.log(form.retail_wholesale);

    return {
      MID: 0,
      DISC_CODE: form.desc_code,
      POS_DISC_GROUP1: form.attr_grp,
      POS_DISC_GROUP2: form.discount_grp2,
      RETAIL_WHOLESALE: form.retail_wholesale == "true" ? true : false,
      METAL_DIAMOND: form.metal_diamond == "true" ? true : false,
      COMPONENT: form.component,
      COMPONENT_GROUP: form.comp_grp,
      DIVCODE: form.division,
      BASE_PRICECODE: form.base_price,
      START_FROM: form.start_from,
      SYSTEM_DATE: new Date().toISOString(),
      Details: this.groupDetailsData,
    };
  }
  formSave() {
    if (this.content && this.content.FLAG == "VIEW") return;
    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }

    let API = "RetailDiscountSetting/InsertRetailDiscountSetting";
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
                  this.SalesInvoiceMainForm.reset();
                  this.groupDetailsData = [];
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
    let API =
      "RetailDiscountSetting/UpdateRetailDiscountSetting/" +
      this.content.DISC_CODE;
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
                  this.SalesInvoiceMainForm.reset();
                  this.groupDetailsData = [];
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

  deleteMaster() {
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
        let API =
          "RetailDiscountSetting/DeleteRetailDiscountSetting/" +
          this.content.DISC_CODE;
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
                      this.SalesInvoiceMainForm.reset();
                      this.groupDetailsData = [];
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
                      this.SalesInvoiceMainForm.reset();
                      this.groupDetailsData = [];
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
      } else {
        this.close("reloadMainGrid");
      }
    });
  }

  openRepairdetails() {
    let len = this.groupDetailsData.length;
    const data = {
      DISC_CODE: this.SalesInvoiceMainForm.controls["desc_code"].value,
      SRNO: len + 1,
      DISC_GROUP1: "",
      DISC_GROUP2: "",
      DISC_PERC: 0,
      DIV_CODE: "1",
      BRANCH_CODE: "string",
      BASE_PRICECODE: "string",
      WEIGHT_FROM: 0,
      WEIGHT_TO: 0,
    };

    console.log(data);
    this.groupDetailsData.push(data);
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    // console.log(values);
    let indexes: Number[] = [];
    this.groupDetailsData.reduce((acc: any, value: any, index: any) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        // console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    // console.log(this.selectedIndexes);
  }

  removedata() {
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
          if (this.groupDetailsData.length > 0) {
            this.groupDetailsData = this.groupDetailsData.filter(
              (data: any, index: any) => !this.selectedIndexes.includes(index)
            );
            this.snackBar.open("Data deleted successfully!", "OK", {
              duration: 2000,
            });
            this.groupDetailsData.forEach((item: any, i: any) => {
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

  getDisc1(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.groupDetailsData[value.data.SRNO - 1].DISC_GROUP1 = data.target.value;
  }

  getDisc2(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.groupDetailsData[value.data.SRNO - 1].DISC_GROUP2 = data.target.value;
  }

  getDiscPer(data: any, value: any) {
    console.log(data);
    console.log(data.target.value);
    this.groupDetailsData[value.data.SRNO - 1].DISC_PERC = data.target.value;
  }
}
