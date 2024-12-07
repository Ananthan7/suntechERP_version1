import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DxDataGridComponent } from "devextreme-angular";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";

@Component({
  selector: "app-gpc-grid-component",
  templateUrl: "./gpc-grid-component.component.html",
  styleUrls: ["./gpc-grid-component.component.scss"],
})
export class GpcGridComponentComponent implements OnInit {
  @ViewChild('gridContainer', { static: false }) gridContainer!: DxDataGridComponent;
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

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.getGpcData();
  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  getGpcData() {
    let API = `VatMaster/GetFillGPCAccounts`;
    let sub: Subscription = this.apiService.getDynamicAPI(API).subscribe(
      (result) => {
        if (result.status.trim() === "Success") {
          this.GPCData = result.dynamicData[0];

          console.log(this.GPCData);
        }
      },
      (err) => {
        console.error("Error fetching data:", err);
        this.commonService.toastErrorByMsgId("MSG1531");
      }
    );
  }

  getSelectedData() {
    if (!this.selectedRow.length) {
      console.log("Please select a row before proceeding.");
      return;
    }
    console.log(this.selectedRow);
    this.close(this.selectedRow)
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

  getSerachedData(event: any) {
    let SEARCHVALUE = event.target.value.trim();
    let PARAMS = { strAcCode: SEARCHVALUE };
    let API = `VatMaster/GetFillGPCAccounts/${this.branchCode}`;

    if (!SEARCHVALUE) {
      return this.getGpcData();
    }

    // let sub: Subscription = this.apiService
    //   .getDynamicAPIwithParamsCustom(API, PARAMS)
    //   .subscribe(
    //     (result) => {
    //       if (result.status.trim() === "Success") {
    this.GPCData = this.GPCData.filter((item: any) =>
      item.GPC_ACCODE.toLowerCase().startsWith(SEARCHVALUE.toLowerCase())
    );

    if (this.GPCData.length > 0) {
      console.log("Matching records:", this.GPCData);
    } else {
      console.log("No matching records found.");
    }
  }
  // },
  // (err) => {
  //   console.error("Error fetching data:", err);
  //   this.commonService.toastErrorByMsgId("MSG1531");
  // }
  // );
  // }
}
