import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-auto-additional-amount",
  templateUrl: "./auto-additional-amount.component.html",
  styleUrls: ["./auto-additional-amount.component.scss"],
})
export class AutoAdditionalAmountComponent implements OnInit {
  @Input() content!: any;
  @Input() flag: any;
  private subscriptions: Subscription[] = [];
  tableData: any = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  branchCode = this.commonService.branchCode;
  datas: any;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal
  ) {}
  autoAdditionalFrom: FormGroup = this.formBuilder.group({
    vocType: [""],
    branch: [""],
    code: [""],
    percentage: [""],
  });
  ngOnInit(): void {
    console.log(this.branchCode);
    console.log(this.content.flag);
    if(this.content.flag == "EDIT"){
      this.setData();
    }
  }

  addTableData() {
    const data = {
      BRANCH_CODE: 0,
      VOCTYPE: "",
      ADDL_CODE: "",
      PERCENTAGE: "",
      ADDID: "",
      ACTIVE: true,
    };

    console.log(data);
    this.tableData.push(data);
  }

  removedata() {
    console.log(this.selectedIndexes);

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
          if (this.tableData.length > 0) {
            this.tableData = this.tableData.filter(
              (data: any, index: any) => !this.selectedIndexes.includes(index)
            );
            this.snackBar.open("Data deleted successfully!", "OK", {
              duration: 2000,
            });
            this.tableData.forEach((item: any, i: any) => {
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

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    // console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc: any, value: any, index: any) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        // console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    // console.log(this.selectedIndexes);
  }
  close() {
    this.activeModal.close();
  }

  getVocType(event: any, data: any) {
    console.log(data);
    this.tableData[data.rowIndex].VOCTYPE = event.target.value;
  }

  getcode(event: any, data: any) {
    this.tableData[data.rowIndex].ADDL_CODE = event.target.value;
  }
  getpercentage(event: any, data: any) {
    this.tableData[data.rowIndex].PERCENTAGE = event.target.value;
  }

  setData() {
    let api =
      "AutoAdditionalCharges/GetAutoAdditionalChargesList/" +
      this.content.BRANCH_CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.datas = result.response;
        console.log(this.datas);
        this.tableData = this.datas;
      });
  }
  postData() {
    console.log(this.tableData);

    return this.tableData.map((item: any) => ({
      BRANCH_CODE: this.branchCode,
      VOCTYPE: item.VOCTYPE,
      ADDL_CODE: item.ADDL_CODE,
      PERCENTAGE: this.commonService.emptyToZero(item.PERCENTAGE),
      ADDID: 6,
      ACTIVE: true,
    }));
  }

  formSubmit() {
    let API = `AutoAdditionalCharges/InsertAutoAdditionalCharges/${this.branchCode}`;
    let postData = this.postData();

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
                  this.tableData = [];
                  this.activeModal.close();
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
          "AutoAdditionalCharges/DeleteAutoAdditionalCharges/" +
          this.content.ADDID;
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
                      this.tableData = [];
                      this.close();
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
      } else {
        this.close();
      }
    });
  }
}
