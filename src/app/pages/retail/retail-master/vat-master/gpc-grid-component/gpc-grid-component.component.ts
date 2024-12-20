import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DxDataGridComponent } from "devextreme-angular";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";

@Component({
  selector: "app-gpc-grid-component",
  templateUrl: "./gpc-grid-component.component.html",
  styleUrls: ["./gpc-grid-component.component.scss"],
})
export class GpcGridComponentComponent implements OnInit {
  @Input() searchValue!: any;
  @ViewChild("gridContainer", { static: false })
  gridContainer!: DxDataGridComponent;
  GPCData: any[] = [];
  selectedRow: any = [];
  branchCode: any = this.commonService.branchCode;

  GPCColumnHeadings: any[] = [
    { field: "SRNO", caption: "SRNo" },
    { field: "COST_CODE", caption: "COST CODE" },
    { field: "GPC_ACCODE", caption: "GPC ACCODE" },
    { field: "Account_Head", caption: "ACCOUNT HEAD" },
    { field: "TAX_REG", caption: "TAX REG" },
  ];
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

  searchForm: FormGroup = this.formBuilder.group({
    searchValue: [""],
  });

  ngOnInit(): void {
    this.getGpcData().subscribe({
      next: () => {
        console.log(this.searchValue);
        this.searchForm.controls["searchValue"].setValue(this.searchValue);
        this.getSerachedData(this.searchValue);
      },
      error: (err) => {
        console.error("Error in ngOnInit:", err);
      },
    });
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  dismissModal(reason?: any) {
    this.activeModal.dismiss(reason); // Rejects the modal with the given reason
  }

  // getGpcData(): Observable<any> {
  //   let API = `VatMaster/GetFillGPCAccounts`;
  //   let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
  //     (result) => {
  //       if (result.status.trim() === "Success") {
  //         this.GPCData = result.dynamicData[0];

  //         console.log(this.GPCData);
  //       }
  //     },
  //     (err) => {
  //       console.error("Error fetching data:", err);
  //       this.commonService.toastErrorByMsgId("MSG1531");
  //     }
  //   );
  // }

  getGpcData(): Observable<any> {
    console.log("called");

    const API = `VatMaster/GetFillGPCAccounts`;
    return this.apiService.getDynamicAPI(API).pipe(
      tap((result) => {
        if (result.status.trim() === "Success") {
          this.GPCData = result.dynamicData[0];
          console.log("In");

          console.log(this.GPCData);
        } else {
          console.warn("Failed to fetch GPC Data.");
        }
      }),
      catchError((err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
        return throwError(() => err);
      })
    );
  }

  getSelectedData() {
    if (!this.selectedRow.length) {
      console.log("Please select a row before proceeding.");
      let message = "Please Select Any GPC Accode";
      this.openDialog("Warning", message, true);
      return;
    }
    console.log(this.selectedRow);
    this.close(this.selectedRow);
  }

  removeSelectedData() {
    this.selectedRow = [];

    if (this.gridContainer) {
      this.gridContainer.instance.clearSelection();
    }
  }
  onSelect(event: any) {
    this.selectedRow = event.selectedRowKeys;

    console.log("Selected Row Indexes:", this.selectedRow);
  }

  getSerachedData(event: any): void {
    // Determine the search value
    const SEARCHVALUE =
      typeof event === "string" ? event.trim() : event?.target?.value.trim();

    // API endpoint
    const API = `VatMaster/GetFillGPCAccounts/${this.branchCode}`;

    // If search value is empty, fetch full data
    if (!SEARCHVALUE) {
      console.log("called");
      this.getGpcData().subscribe({
        next: (result) => {
          console.log("Full data fetched successfully:", result);
        },
        error: (err) => {
          console.error("Error while fetching full data:", err);
        },
      });
      return;
    }

    // Ensure data exists before filtering
    if (this.GPCData && this.GPCData.length > 0) {
      this.GPCData = this.GPCData.filter((item: any) =>
        item.GPC_ACCODE.toLowerCase().startsWith(SEARCHVALUE.toLowerCase())
      );

      if (this.GPCData.length > 0) {
        console.log("Matching records:", this.GPCData);
      } else {
        this.searchForm.controls["searchValue"].setValue("");
        let message = "No matching records found.";
        this.openDialog("Warning", message, true);
        this.getGpcData().subscribe({
          next: (result) => {
            console.log("Full data fetched successfully:", result);
          },
          error: (err) => {
            console.error("Error while fetching full data:", err);
          },
        });

        console.log("No matching records found.");
      }
    } else {
      console.warn("GPCData is empty. Consider fetching the data first.");
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }
}
