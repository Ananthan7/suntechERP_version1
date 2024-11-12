import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-box-master",
  templateUrl: "./box-master.component.html",
  styleUrls: ["./box-master.component.scss"],
})
export class BoxMasterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild("overlayStockCode")
  overlayStockCode!: MasterSearchComponent;

  @ViewChild("overlaylocationCode")
  overlaylocationCode!: MasterSearchComponent;
  private subscriptions: Subscription[] = [];
  itemDetailsData: any = [];

  flag: any;
  boxNumber: any;

  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Box No" },
    { field: "BRANCH_CODE", caption: "Form Serial No" },
    { field: "VOCTYPE", caption: "Pcs" },
    { field: "DIVISION", caption: "Sub Pcs" },
    { field: "QTY", caption: "To Serial No" },
    { field: "amount", caption: "Stock Code" },
    { field: "PROFIT", caption: "Location" },
  ];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.flag = this.content!.FLAG;
    this.initialController(this.flag, this.content);
  }

  boxMasterMainForm: FormGroup = this.formBuilder.group({
    boxno: [""],
    formserialno: [""],
    pcs: [""],
    subpcs: [""],
    toserialno: [""],
    location: [""],
    stockcode: [""],
    stockcodedesc: [""],
  });

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: "STOCK_CODE",
    SEARCH_HEADING: "Stock Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  locationCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 11,
    SEARCH_FIELD: "LOCATION_CODE",
    SEARCH_HEADING: "location Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "LOCATION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

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
    this.boxNumber = DATA.BOX_NO;
    this.boxMasterMainForm.controls["boxno"].setValue(DATA.BOX_NO);
    this.boxMasterMainForm.controls["formserialno"].setValue(
      DATA.FROM_SERIALNO
    );
    this.boxMasterMainForm.controls["pcs"].setValue(DATA.PCS);
    this.boxMasterMainForm.controls["subpcs"].setValue(DATA.SUB_PCS);
    this.boxMasterMainForm.controls["toserialno"].setValue(DATA.TO_SERIALNO);
    this.boxMasterMainForm.controls["location"].setValue(DATA.LOCTYPE_CODE);
    this.boxMasterMainForm.controls["stockcode"].setValue(DATA.STOCK_CODE);
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
        const API = `BoxMaster/DeleteBoxMaster/${this.boxNumber}`;
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

  boxMasterMainFormSubmit() {
    const postData = {
      MID: 0,
      BOX_NO: this.boxMasterMainForm.value.boxno,
      FROM_SERIALNO: this.boxMasterMainForm.value.formserialno,
      PCS: this.boxMasterMainForm.value.pcs,
      TO_SERIALNO: this.boxMasterMainForm.value.toserialno,
      STOCK_CODE: this.boxMasterMainForm.value.stockcode,
      PURCHASE_BRANCH: "",
      PURCHASE_VOCTYPE: "",
      PURCHASE_VOCNO: 0,
      PURCHASE_VOCDATE: new Date(),
      PURCHASE_PARTYCODE: "string",
      LOCTYPE_CODE: this.boxMasterMainForm.value.location,
      SUB_PCS: this.boxMasterMainForm.value.subpcs,
      USERID: "",
      SYSTEM_DATE: new Date(),
    };

    if (this.flag === "EDIT") {
      let API = `BoxMaster/UpdateBoxMaster/${this.boxNumber}`;
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
      let API = `BoxMaster/InsertBoxMaster`;
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

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.boxMasterMainForm.controls[ctrl].setValue(value);
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
        this.boxMasterMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "stockcode":
        this.overlayStockCode.showOverlayPanel(event);
        break;
      case "location":
        this.overlaylocationCode.showOverlayPanel(event);
        break;

      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }
}
