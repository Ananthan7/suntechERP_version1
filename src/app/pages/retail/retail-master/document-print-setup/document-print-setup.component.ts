import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
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
  codeEnable: boolean = true;
  deleteMode: boolean = false;
  data: any;
  dialogBox: any;
  branchDivisionControlsTooltip: any;
  formattedBranchDivisionData: any;
  fetchedBranchDataParam: any = [];
  fetchedBranchData: any[] = [];
  dateToPass: { fromDate: string; toDate: string } = {
    fromDate: "",
    toDate: "",
  };
  image: any;
  image1: any;
  image2: any;
  image3: any;

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
    picture_name: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content?.FLAG == "VIEW") {
        this.isDisabled = true;
        this.viewMode = true;
        // Set values for the form controls
        this.DocumentPrintSetupForm.controls["show_only_logo"].setValue(
          this.data.SHOW_ONLY_LOGO
        );
        this.DocumentPrintSetupForm.controls["logo_position"].setValue(
          this.content.LOGO_POSITION
        );
        this.DocumentPrintSetupForm.controls["show_as_header"].setValue(
          this.data.SHOW_AS_HEADER
        );
        this.DocumentPrintSetupForm.controls["header_english"].setValue(
          this.data.SHOW_ENGLISH_HEADER
        );
        this.DocumentPrintSetupForm.controls["header_arabic"].setValue(
          this.data.SHOW_ARABIC_HEADER
        );
        this.DocumentPrintSetupForm.controls["show_combined_header"].setValue(
          this.data.COMBINED_HEADER
        );
        this.DocumentPrintSetupForm.controls["show_combined_headerA5"].setValue(
          this.data.COMBINED_HEADERA5
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
        this.DocumentPrintSetupForm.controls[
          "combined_header_a5images"
        ].setValue(this.content.COMBINED_HEADER_IMAGEA5);
        this.DocumentPrintSetupForm.controls["show_only_logo"].disable();
        this.DocumentPrintSetupForm.controls["logo_position"].disable();
        this.DocumentPrintSetupForm.controls["show_as_header"].disable();
        this.DocumentPrintSetupForm.controls["header_english"].disable();
        this.DocumentPrintSetupForm.controls["header_arabic"].disable();
        this.DocumentPrintSetupForm.controls["show_combined_header"].disable();
        this.DocumentPrintSetupForm.controls[
          "show_combined_headerA5"
        ].disable();
        this.DocumentPrintSetupForm.controls["english_header_images"].disable();
        this.DocumentPrintSetupForm.controls["other_header_images"].disable();
        this.DocumentPrintSetupForm.controls[
          "combined_header_images"
        ].disable();
        this.DocumentPrintSetupForm.controls[
          "combined_header_a5images"
        ].disable();
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

        this.DocumentPrintSetupForm.controls["code"].setValue(
          this.content.CODE
        );
        this.DocumentPrintSetupForm.controls["description"].setValue(
          this.content.DESCRIPTION
        );
        this.DocumentPrintSetupForm.controls["show_only_logo"].setValue(
          this.data.SHOW_ONLY_LOGO
        );
        this.DocumentPrintSetupForm.controls["logo_position"].setValue(
          this.content.LOGO_POSITION
        );
        this.DocumentPrintSetupForm.controls["show_as_header"].setValue(
          this.data.SHOW_AS_HEADER
        );
        this.DocumentPrintSetupForm.controls["header_english"].setValue(
          this.data.SHOW_ENGLISH_HEADER
        );
        this.DocumentPrintSetupForm.controls["header_arabic"].setValue(
          this.data.SHOW_ARABIC_HEADER
        );
        this.DocumentPrintSetupForm.controls["show_combined_header"].setValue(
          this.data.COMBINED_HEADER
        );
        this.DocumentPrintSetupForm.controls["show_combined_headerA5"].setValue(
          this.data.COMBINED_HEADERA5
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
        this.DocumentPrintSetupForm.controls[
          "combined_header_a5images"
        ].setValue(this.content.COMBINED_HEADER_IMAGEA5);
      });
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
      "Branchwise_Document_Print_Setting/UpdateBranchwise_Document_Print_Setting/" +
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
          "Branchwise_Document_Print_Setting/Delete_Branchwise_Document_Print_Setting/" +
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

  checkvalue(e: any) {
    console.log(e);
    let str = e.checked;

    if (str == true) {
      // this.DocumentPrintSetupForm.controls["logo_position"].disable();
      this.DocumentPrintSetupForm.controls["show_as_header"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].disable();
    } else {
      this.DocumentPrintSetupForm.controls["logo_position"].setValue(null);
      this.DocumentPrintSetupForm.controls["show_as_header"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].enable();
    }
  }

  checkHeader(e: any) {
    let str = e.checked;
    if (str == true) {
      // this.DocumentPrintSetupForm.controls["logo_position"].disable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].disable();
    } else {
      // this.DocumentPrintSetupForm.controls["logo_position"].enable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].enable();
    }
  }

  checkHeaderA4(e: any) {
    let str = e.checked;
    if (str == true) {
      this.DocumentPrintSetupForm.controls["logo_position"].disable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].disable();
      this.DocumentPrintSetupForm.controls["show_as_header"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].disable();
      this.DocumentPrintSetupForm.controls["header_english"].disable();
      this.DocumentPrintSetupForm.controls["header_arabic"].disable();
    } else {
      this.DocumentPrintSetupForm.controls["logo_position"].enable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].enable();
      this.DocumentPrintSetupForm.controls["show_as_header"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_headerA5"].enable();
      this.DocumentPrintSetupForm.controls["header_english"].enable();
      this.DocumentPrintSetupForm.controls["header_arabic"].enable();
    }
  }

  checkHeaderA5(e: any) {
    let str = e.checked;
    if (str == true) {
      this.DocumentPrintSetupForm.controls["logo_position"].disable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].disable();
      this.DocumentPrintSetupForm.controls["show_as_header"].disable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].disable();
      this.DocumentPrintSetupForm.controls["logo_position"].disable();
      this.DocumentPrintSetupForm.controls["header_english"].disable();
      this.DocumentPrintSetupForm.controls["header_arabic"].disable();
    } else {
      this.DocumentPrintSetupForm.controls["logo_position"].enable();
      this.DocumentPrintSetupForm.controls["show_only_logo"].enable();
      this.DocumentPrintSetupForm.controls["show_as_header"].enable();
      this.DocumentPrintSetupForm.controls["show_combined_header"].enable();
      this.DocumentPrintSetupForm.controls["logo_position"].enable();
      this.DocumentPrintSetupForm.controls["header_english"].enable();
      this.DocumentPrintSetupForm.controls["header_arabic"].enable();
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });

    this.dialogBox.afterClosed().subscribe((result: any) => {
      if (result === "OK") {
        return "OK";
      } else {
        return null;
      }
    });
  }

  codeEnabled() {
    console.log(this.DocumentPrintSetupForm.value.code);

    if (this.DocumentPrintSetupForm.value.code == "") {
      this.codeEnable = true;
      this.commonService.toastErrorByMsgId("MSG1124"); // Please Enter the Code
    } else {
      this.codeEnable = false;
    }
  }

  selectedData(data: any) {
    console.log(data);
    // let content= ``, content2 =``,  content3 =``, content4 =``
    let content = `Current Selected Branches:  \n`;
    let content2 = `Current Selected Divisions:  \n`;
    let content3 = `Current Selected Area:  \n`;
    let content4 = `Current Selected B category:  \n`;
    let branchDivisionData = "";
    if (data.BranchData) {
      // content = `Current Selected Branches:  \n`
      data.BranchData.forEach((Bdata: any) => {
        branchDivisionData += Bdata.BRANCH_CODE + "#";
        content += Bdata.BRANCH_CODE ? `${Bdata.BRANCH_CODE}, ` : "";
      });
    }

    if (data.DivisionData) {
      // content2 = `Current Selected Divisions:  \n`
      data.DivisionData.forEach((Ddata: any) => {
        branchDivisionData += Ddata.DIVISION_CODE + "#";
        content2 += Ddata.DIVISION_CODE ? `${Ddata.DIVISION_CODE}, ` : "";
      });
    }

    if (data.AreaData) {
      // content3 = `Current Selected Area:  \n`
      data.AreaData.forEach((Adata: any) => {
        branchDivisionData += Adata.AREA_CODE + "#";
        content3 += Adata.AREA_CODE ? `${Adata.AREA_CODE}, ` : "";
      });
    }

    if (data.BusinessCategData) {
      // content4 = `Current Selected B category:  \n`
      data.BusinessCategData.forEach((BCdata: any) => {
        branchDivisionData += BCdata.CATEGORY_CODE + "#";
        content4 += BCdata.CATEGORY_CODE ? `${BCdata.CATEGORY_CODE}, ` : "";
      });
    }

    content = content.replace(/, $/, "");
    content2 = content2.replace(/, $/, "");
    content3 = content3.replace(/, $/, "");
    content4 = content4.replace(/, $/, "");
    this.branchDivisionControlsTooltip =
      content + "\n" + content2 + "\n" + content3 + "\n" + content4;

    this.formattedBranchDivisionData = branchDivisionData;
    this.DocumentPrintSetupForm.controls.branches.setValue(
      this.formattedBranchDivisionData
    );
  }

  // onFileChanged(event: any) {
  //   console.log(event.target.files);

  //   this.image = event.target.files[0].name;
  //   console.log(this.image);
  //   let reader = new FileReader();
  //   if (event.target.files && event.target.files.length > 0) {
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.image = reader.result;
  //     };
  //   }
  // }

  onFileChanged(event: any) {
    console.log(event.target.files);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image = reader.result;
        console.log("Base64 Image:", this.image);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  }

  onFileChangedArabicandEnglish(event: any) {
    console.log(event.target.files);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image1 = reader.result;
        console.log("Base64 Image:", this.image1);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  }

  onFileChangedA4(event: any) {
    console.log(event.target.files);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image2 = reader.result;
        console.log("Base64 Image:", this.image2);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  }

  onFileChangedA5(event: any) {
    console.log(event.target.files);

    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.image3 = reader.result;
        console.log("Base64 Image:", this.image3);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  }
  prefillScreenValues() {
    if (Object.keys(this.content).length > 0) {
      //  this.templateNameHasValue = !!(this.content?.TEMPLATE_NAME);
    } else {
      const userBranch = localStorage.getItem("userbranch");
      const formattedUserBranch = userBranch ? `${userBranch}#` : null;
      this.DocumentPrintSetupForm.controls.branches.setValue(
        formattedUserBranch
      );
      this.fetchedBranchDataParam = formattedUserBranch;
      this.fetchedBranchData = this.fetchedBranchDataParam?.split("#");

      this.dateToPass = {
        fromDate: this.datePipe.transform(new Date(), "yyyy-MM-dd")!,
        toDate: this.datePipe.transform(new Date(), "yyyy-MM-dd")!,
      };
    }
  }

  
}





