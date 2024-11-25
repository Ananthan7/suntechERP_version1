import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-receipt-modes",
  templateUrl: "./receipt-modes.component.html",
  styleUrls: ["./receipt-modes.component.scss"],
})
export class ReceiptModesComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];

  flag: any;
  code: any;
  RcmCreditCard!: boolean;
  excludeTax!: boolean;
  LoyaltyItem!: boolean;
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {}

  receiptModesMainForm: FormGroup = this.formBuilder.group({
    mode: [""],
    code: [""],
    desc: [""],
    accode: [""],
    commision: [""],
    currencyCode: [""],
    commisionAccount: [""],
    bank: [""],
    maxCommAcc: [""],
    branches: [""],
    inputVat: [""],
    outputVat: [""],
    vat: [""],
    rcmInput: [""],
    rcmOutputVat: [""],
    loyalty: [""],
    rcmCredit: [""],
    excludeTax: [""],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "ADD") {
    }
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
    this.code = DATA.CREDIT_CODE;
    this.receiptModesMainForm.controls["mode"].setValue(DATA.MODE);
    this.receiptModesMainForm.controls["code"].setValue(DATA.CREDIT_CODE);
    this.receiptModesMainForm.controls["desc"].setValue(DATA.DESCRIPTION);
    this.receiptModesMainForm.controls["accode"].setValue(DATA.ACCODE);
    this.receiptModesMainForm.controls["commision"].setValue(DATA.COMMISION);
    this.receiptModesMainForm.controls["currencyCode"].setValue(
      DATA.CURRENCY_CODE
    );
    this.receiptModesMainForm.controls["commisionAccount"].setValue(
      DATA.COMMISION_CODE
    );
    this.receiptModesMainForm.controls["bank"].setValue(DATA.BANK);
    this.receiptModesMainForm.controls["maxCommAcc"].setValue(DATA.MAXCOMMAMT);
    this.receiptModesMainForm.controls["branches"].setValue(DATA.CC_BRANCHCODE);
    this.receiptModesMainForm.controls["loyalty"].setValue(DATA.LOYALTYITEM);
    this.receiptModesMainForm.controls["rcmCredit"].setValue(
      DATA.RCMCREDITCARD
    );
    this.receiptModesMainForm.controls["excludeTax"].setValue(
      DATA.EXCLUDETAX === 1 ? true : false
    );
    this.receiptModesMainForm.controls["rcmInput"].setValue(
      DATA.RCMVATINPUTACCODE
    );
    this.receiptModesMainForm.controls["rcmOutputVat"].setValue(
      DATA.RCMVATOUTPUTACCODE
    );
    this.receiptModesMainForm.controls["inputVat"].setValue(
      DATA.VATACCODEINPUT
    );
    this.receiptModesMainForm.controls["outputVat"].setValue(DATA.VATACCODE);
    this.receiptModesMainForm.controls["vat"].setValue(DATA.VATPER);
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
        const API = `CreditCardMaster/${this.code}`;
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

  receiptModesMainFormSubmit() {
    Object.keys(this.receiptModesMainForm.controls).forEach((controlName) => {
      const control = this.receiptModesMainForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.receiptModesMainForm.controls
    ).some((controlName) => {
      const control = this.receiptModesMainForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MODE: this.receiptModesMainForm.value.mode,
        CREDIT_CODE: this.receiptModesMainForm.value.code,
        DESCRIPTION: this.receiptModesMainForm.value.desc,
        ACCODE: this.receiptModesMainForm.value.accode,
        ACCOUNT_HEAD: "",
        BANK: this.receiptModesMainForm.value.bank,
        CURRENCY_CODE: this.receiptModesMainForm.value.currencyCode,
        COMMISION: this.receiptModesMainForm.value.commision,
        COMMISION_CODE: this.receiptModesMainForm.value.commisionAccount,
        MID: 0,
        SYSTEM_DATE: new Date(),
        POSFILTER: 0,
        CC_BRANCHCODE: this.receiptModesMainForm.value.branches,
        VATACCODE: "string",
        VATCOMMISION: 0,
        LOYALTYITEM: this.LoyaltyItem,
        MAXCOMMAMT: this.receiptModesMainForm.value.maxCommAcc,
        EXCLUDETAX: this.excludeTax === true ? 1 : 0,
        VATACCODEINPUT: this.receiptModesMainForm.value.inputVat,
        VATPER: this.receiptModesMainForm.value.vat,
        RCMCREDITCARD: this.RcmCreditCard,
        RCMVATINPUTACCODE: this.receiptModesMainForm.value.rcmInput,
        RCMVATOUTPUTACCODE: this.receiptModesMainForm.value.rcmOutputVat,
      };

      if (this.flag === "EDIT") {
        let API = `CreditCardMaster/${this.code}`;
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
        let API = `CreditCardMaster`;
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

  preventInvalidInput(event: KeyboardEvent) {
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  }

  matBoxChecker(event: MatCheckboxChange, controller: string) {
    let checked = event.checked;

    switch (controller) {
      case "loyalty":
        this.LoyaltyItem = checked;
        break;
      case "rcmCredit":
        this.RcmCreditCard = checked;
        break;
      case "excludeTax":
        this.excludeTax = checked;
        break;

      default:
        break;
    }
  }
}
