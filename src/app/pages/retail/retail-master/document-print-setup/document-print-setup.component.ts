import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-document-print-setup",
  templateUrl: "./document-print-setup.component.html",
  styleUrls: ["./document-print-setup.component.scss"],
})
export class DocumentPrintSetupComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
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
  data: any;
  DocumentPrintSetupForm: FormGroup = this.formBuilder.group({
    code: [""],
    branches: [""],
    description: [""],
    show_only_logo: [""],
    show_as_header: [""],
    logo_position: [""],
    header_english: [""],
    header_arabic: [""],
    show_combined_header: [""],
    show_combined_headerA5: [""],
    footer_settings: [""],
    english_header_images: [""],
    other_header_images: [""],
    combined_header_images: [""],
    combined_header_a5images: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
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
    console.log(this.content);

    let api =
      "Branchwise_Document_Print_Setting/GetBranchwiseDocumentPrintSettingWithCode/" +
      this.content.CODE;
    console.log(api);
    let Sub: Subscription = this.dataService
      .getDynamicAPI(api)
      .subscribe((result: any) => {
        this.data = result.response;
        console.log(this.data);
      });
    this.DocumentPrintSetupForm.controls["code"].setValue(this.content.CODE);
    this.DocumentPrintSetupForm.controls["description"].setValue(
      this.content.DESCRIPTION
    );
    this.DocumentPrintSetupForm.controls["show_only_logo"].setValue(
      this.content.SHOW_ONLY_LOGO
    );
    this.DocumentPrintSetupForm.controls["logo_position"].setValue(
      this.content.LOGO_POSITION
    );
    this.DocumentPrintSetupForm.controls["show_as_header"].setValue(
      this.content.SHOW_AS_HEADER
    );
    this.DocumentPrintSetupForm.controls["header_english"].setValue(
      this.content.SHOW_ENGLISH_HEADER
    );
    this.DocumentPrintSetupForm.controls["header_arabic"].setValue(
      this.content.SHOW_ARABIC_HEADER
    );
    this.DocumentPrintSetupForm.controls["show_combined_header"].setValue(
      this.content.COMBINED_HEADER
    );
    this.DocumentPrintSetupForm.controls["show_combined_headerA5"].setValue(
      this.content.COMBINED_HEADERA5
    );
    this.DocumentPrintSetupForm.controls["english_header_images"].setValue(
      this.content.ENGLISH_HEADER_IMAGE
    );
    this.DocumentPrintSetupForm.controls["other_header_images"].setValue(
      this.content.OTHER_HEADER_IMAGE
    );
    this.DocumentPrintSetupForm.controls["combined_header_images"].setValue(
      this.content.COMBINED_HEADER_IMAGE
    );
    this.DocumentPrintSetupForm.controls["combined_header_a5images"].setValue(
      this.content.COMBINED_HEADER_IMAGEA5
    );
  }
  setPostData() {
    let form = this.DocumentPrintSetupForm.value;
    console.log(form.logo_position);

    let postData = {
      MID: 0,
      CODE: form.code,
      DESCRIPTION: form.description,
      BRANCHES: form.branches || "",
      SHOW_ONLY_LOGO: form.show_only_logo || false,
      LOGO_POSITION: form.logo_position || "",
      SHOW_AS_HEADER: form.show_as_header || false,
      SHOW_ENGLISH_HEADER: form.header_english || false,
      SHOW_ARABIC_HEADER: form.header_arabic || false,
      COMBINED_HEADER: form.show_combined_header || false,
      COMBINED_HEADERA5: form.show_combined_headerA5 || false,
      ENGLISH_HEADER_IMAGE: form.english_header_images || "",
      OTHER_HEADER_IMAGE: form.other_header_images || "",
      COMBINED_HEADER_IMAGE: form.combined_header_images || "",
      COMBINED_HEADER_IMAGEA5: form.combined_header_a5images || "",
      ENGLISH_HEADER_IMAGE_PATH: "",
      OTHER_HEADER_IMAGE_PATH: "",
      COMBINED_HEADER_IMAGE_PATH: "",
      COMBINED_HEADER_IMAGE_PATHA5: "",
    };

    return postData;
  }

  formSubmit() {
    if (this.content?.FLAG == "VIEW") return;
    if (this.content?.FLAG == "EDIT") {
      this.updateMaster();
      return;
    }
    let API =
      "Branchwise_Document_Print_Setting/InsertBranchwise_Document_Print_Setting";
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
                  this.DocumentPrintSetupForm.reset();
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
      "PayTicketSchemeMaster/UpdatePayTicketSchemeMaster/" +
      this.DocumentPrintSetupForm.value.code;
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
                  this.DocumentPrintSetupForm.reset();
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
          "PayTicketSchemeMaster/DeletePayTicketSchemeMaster/" +
          this.content?.CODE;
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
                      this.DocumentPrintSetupForm.reset();
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
                      this.DocumentPrintSetupForm.reset();
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

  BranchDataSelected(e: any) {}
}
