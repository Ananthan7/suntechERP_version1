import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { log } from "console";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import Swal from "sweetalert2";

@Component({
  selector: "app-email-template",
  templateUrl: "./email-template.component.html",
  styleUrls: ["./email-template.component.scss"],
})
export class EmailTemplateComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("codeField") codeField!: ElementRef;

  private subscriptions: Subscription[] = [];
  private isFocusLooping: boolean = false;
  flag: any;
  code: any;
  dialogBox: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  emailTemplateForm: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    description: ["", [Validators.required]],
    cc: ["", [Validators.required, Validators.email, this.domainValidator]],
    bcc: ["", [Validators.required, Validators.email, this.domainValidator]],
    body: ["", [Validators.required]],
  });

  ngOnInit(): void {
    console.log(this.content);

    this.flag = this.content
      ? this.content.FLAG
      : (this.content = { FLAG: "ADD" }).FLAG;

    this.initialController(this.flag, this.content);
  }

  ngAfterViewInit(): void {
    if (this.flag === "ADD") {
      this.codeField.nativeElement.focus();
    }
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
      FLAG = "VIEW";
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    this.code = DATA.MID;
    this.emailTemplateForm.controls["code"].setValue(DATA.EMTMP_CODE);
    this.emailTemplateForm.controls["description"].setValue(DATA.EMTMP_DESC);
    this.emailTemplateForm.controls["cc"].setValue(DATA.EMTMP_CC);
    this.emailTemplateForm.controls["bcc"].setValue(DATA.EMTMP_BCC);
    this.emailTemplateForm.controls["body"].setValue(DATA.EMTMP_BODY);
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
        const API = `EmailTemplate/DeleteEmailTemplate/${this.code}`;
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

              response.status === "Success" &&
                this.close("reloadMainGrid", true);
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
        this.close("reloadMainGrid", true);
      }
    });
  }

  emailTemplateFormSubmit() {
    Object.keys(this.emailTemplateForm.controls).forEach((controlName) => {
      const control = this.emailTemplateForm.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.emailTemplateForm.controls
    ).some((controlName) => {
      const control = this.emailTemplateForm.controls[controlName];
      return control.hasError("required") && control.touched;
    });

    if (!requiredFieldsInvalid) {
      const postData = {
        MID: 0,
        EMTMP_CODE: this.emailTemplateForm.value.code,
        EMTMP_DESC: this.emailTemplateForm.value.description,
        EMTMP_CC: this.emailTemplateForm.value.cc,
        EMTMP_BCC: this.emailTemplateForm.value.bcc,
        EMTMP_BODY: this.emailTemplateForm.value.body,
      };

      if (this.flag === "EDIT") {
        let API = `EmailTemplate/UpdateEmailTemplate/${this.code}`;
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
        let API = `EmailTemplate/InsertEmailTemplate`;
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

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  domainValidator(control: AbstractControl): ValidationErrors | null {
    const emailValue = control.value;
    if (emailValue && !/^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(emailValue)) {
      return { domainInvalid: true };
    }
    return null;
  }
}
