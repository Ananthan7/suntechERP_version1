import { Component, ComponentFactory, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-repair-details",
  templateUrl: "./repair-details.component.html",
  styleUrls: ["./repair-details.component.scss"],
})
export class RepairDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input() receiptData!: any;
  @Input() queryParams!: any;
  viewOnly: boolean = false;
  stoneCheck: any = false;
  tableData: any[] = [];
  userName = localStorage.getItem("username");
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster["BRANCH_NAME"];
  private subscriptions: Subscription[] = [];

  columnheadItemDetails: any[] = [
    "Sr.No",
    "Div",
    "Description",
    "Remarks",
    "Pcs",
    "Gr.Wt",
    "Repair Type",
    "Type",
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {
    this.getQueryParams(this.queryParams);
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

    if (this.receiptData && Object.keys(this.receiptData).length > 0)
      this.setReceiptData();
  }

  getQueryParams(params?: any) {
    console.log(params);
    this.viewOnly = params.isViewOnly;
  }

  repairjewelleryreceiptdetailsFrom: FormGroup = this.formBuilder.group({
    descriptionCode: [""],
    Pcs: [""],
    type_of: [""],
    delivery_date: [""],
    gross_Wt: [""],
    type_of_item: [""],
    total_amount: [""],
    status: [""],
    material: [""],
    Est_repair_charge: [""],
    own_stock: [""],
    repair_bags: [""],
    stone_type: [""],
    no_of: [""],
    Cut: [""],
    Approx: [""],
    remark: [""],
    description: [""],
    text: [""],
    withStone: [false],
    checked: [false],
    damaged: [false],
  });

  DescCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: "DESCRIPTION",
    SEARCH_HEADING: "User Name ",
    SEARCH_VALUE: "",
    WHERECONDITION: "DESCRIPTION<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  DescCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.descriptionCode.setValue(
      e.CODE
    );
    this.repairjewelleryreceiptdetailsFrom.controls.description.setValue(
      e.DESCRIPTION
    );
  }

  typeOfCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "type of",
    SEARCH_VALUE: "",
    WHERECONDITION: "Types = 'REPAIR TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  typeOfCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.type_of.setValue(e.CODE);
  }

  typeOfItemCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "type of item",
    SEARCH_VALUE: "",
    WHERECONDITION: "Types = 'TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  typeOfItemCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.type_of_item.setValue(
      e.DESCRIPTION
    );
  }

  statusCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "",
    SEARCH_VALUE: "",
    WHERECONDITION: "Types = 'REPAIR ITEM STATUS MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  statusCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls["status"].setValue(
      e.DESCRIPTION
    );
  }

  materialCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "User Name ",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  materialCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.material.setValue(
      e.DESCRIPTION
    );
  }

  EstRepairChargeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Est Repair Charge CodeData",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  EstRepairChargeCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.Est_repair_charge.setValue(
      e.CODE
    );
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Stone Type",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockCodeSelected(value: any) {
    console.log(value);
    this.repairjewelleryreceiptdetailsFrom.controls.own_stock.setValue(value.STOCK_CODE);
  }

  stoneTypeCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.stone_type.setValue(e.CODE);
  }

  CutCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Cut",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  CutCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.Cut.setValue(e.CODE);
  }

  ApproxCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Approx",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  ApproxCodeSelected(e: any) {
    this.repairjewelleryreceiptdetailsFrom.controls.Approx.setValue(e.CODE);
  }

  close(data?: any) {
    if (
      this.receiptData != null &&
      this.receiptData != undefined &&
      data != null
    ) {
      data!.isUpdate = true;
    }
    this.activeModal.close(data);
  }

  withStoneCheck(e: any) {
    this.stoneCheck = e.checked;
  }

  setReceiptData() {
    if (
      this.receiptData != null &&
      this.receiptData != undefined &&
      Object.keys(this.receiptData).length > 0
    ) {
      console.log(this.queryParams.isViewOnly);

      console.log(this.receiptData);

      this.repairjewelleryreceiptdetailsFrom.controls[
        "descriptionCode"
      ].setValue(this.receiptData.ITEM_DESCRIPTION);

      this.repairjewelleryreceiptdetailsFrom.controls["description"].setValue(
        this.receiptData.ITEM_NARRATION
      );

      this.repairjewelleryreceiptdetailsFrom.controls["Pcs"].setValue(
        this.receiptData.PCS
      );

      this.repairjewelleryreceiptdetailsFrom.controls["type_of"].setValue(
        this.receiptData.REPAIR_TYPE
      );

      this.repairjewelleryreceiptdetailsFrom.controls["delivery_date"].setValue(
        this.receiptData.DELIVERY_DATE
      );
      this.repairjewelleryreceiptdetailsFrom.controls["gross_Wt"].setValue(
        this.comService.decimalQuantityFormat(this.receiptData.GROSSWT, "THREE")
      );

      this.repairjewelleryreceiptdetailsFrom.controls["type_of_item"].setValue(
        this.receiptData.REPAIR_ITEMTYPE
      );

      this.repairjewelleryreceiptdetailsFrom.controls["total_amount"].setValue(
        this.comService.decimalQuantityFormat(this.receiptData.AMOUNT, "THREE")
      );

      this.repairjewelleryreceiptdetailsFrom.controls["status"].setValue(
        this.receiptData.ITEM_STATUSTYPE
      );

      this.repairjewelleryreceiptdetailsFrom.controls["material"].setValue(
        this.receiptData.MATERIAL_TYPE
      );

      this.repairjewelleryreceiptdetailsFrom.controls[
        "Est_repair_charge"
      ].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.EST_REPAIR_CHARGES),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["own_stock"].setValue(
        this.receiptData.OWN_STOCK
      );

      this.repairjewelleryreceiptdetailsFrom.controls["checked"].setValue(
        this.receiptData.CHECKED !== 0
      );

      this.repairjewelleryreceiptdetailsFrom.controls["damaged"].setValue(
        this.receiptData.DAMAGED !== 0
      );
      this.repairjewelleryreceiptdetailsFrom.controls["repair_bags"].setValue(
        this.receiptData.REPAIRBAGNO
      );
      this.repairjewelleryreceiptdetailsFrom.controls["remark"].setValue(
        this.receiptData.DT_REMARKS
      );
      this.repairjewelleryreceiptdetailsFrom.controls["withStone"].setValue(
        this.receiptData.WITHSTONE !== 0
      );
      this.stoneCheck = this.receiptData.WITHSTONE !== 0;
      this.repairjewelleryreceiptdetailsFrom.controls["stone_type"].setValue(
        this.receiptData.STONE_TYPE
      );
      this.repairjewelleryreceiptdetailsFrom.controls["no_of"].setValue(
        this.receiptData.NO_OF_STONES
      );
      this.repairjewelleryreceiptdetailsFrom.controls["Cut"].setValue(
        this.receiptData.CUT
      );
      this.repairjewelleryreceiptdetailsFrom.controls["Approx"].setValue(
        this.receiptData.APPROX_SIZE
      );
    }
  }

  formSubmit() {
    if (this.repairjewelleryreceiptdetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "Repair/InsertRepair";
    let postData = {
      UNIQUEID: 0,
      SRNO: this.receiptData?.SRNO || 0,
      DIVISION_CODE: "3",
      STOCK_CODE: "",
      ITEM_DESCRIPTION:
        this.repairjewelleryreceiptdetailsFrom.value.descriptionCode,
      ITEM_NARRATION: this.repairjewelleryreceiptdetailsFrom.value.description,
      PCS: this.repairjewelleryreceiptdetailsFrom.value.Pcs,
      REPAIR_TYPE: this.repairjewelleryreceiptdetailsFrom.value.type_of,
      GROSSWT: this.comService.decimalQuantityFormat(
        this.repairjewelleryreceiptdetailsFrom.value.gross_Wt,
        "RATE"
      ),
      ITEM_STATUSTYPE: this.repairjewelleryreceiptdetailsFrom.value.status,
      DELIVERY_DATE: this.repairjewelleryreceiptdetailsFrom.value.delivery_date,
      AMOUNT: this.repairjewelleryreceiptdetailsFrom.value.total_amount,
      STATUS: 0,
      REPAIR_ITEMTYPE:
        this.repairjewelleryreceiptdetailsFrom.value.type_of_item,
      ITEM_PICTUREPATH: "",
      TRANSFERID: 0,
      TRANSFERCID: 0,
      RECEIVEID: 0,
      DELIVERID: 0,
      NEWWEIGHT: 0,
      REPAIRAMOUNT: 0,
      OTHERAMOUNT: 0,
      GOLDWGT: 0,
      GOLDAMOUNT: 0,
      DIAMONDWGT: 0,
      DIAMONDAMOUNT: 0,
      LABOURCHARGE: 0,
      METALCODE: "",
      REPAIRBAGNO: this.repairjewelleryreceiptdetailsFrom.value.repair_bags,
      MATERIAL_TYPE: this.repairjewelleryreceiptdetailsFrom.value.material,
      STONE_TYPE: this.repairjewelleryreceiptdetailsFrom.value.stone_type,
      NO_OF_STONES: this.repairjewelleryreceiptdetailsFrom.value.no_of,
      CUT: this.repairjewelleryreceiptdetailsFrom.value.Cut,
      APPROX_SIZE: this.repairjewelleryreceiptdetailsFrom.value.Approx,
      OWN_STOCK: this.repairjewelleryreceiptdetailsFrom.value.own_stock,
      CHECKED:
        this.repairjewelleryreceiptdetailsFrom.value.checked === true ? 1 : 0,
      DAMAGED:
        this.repairjewelleryreceiptdetailsFrom.value.damaged === true ? 1 : 0,
      RECEIPT: 0,
      WITHSTONE: this.stoneCheck === true ? 1 : 0,
      AUTHORIZE: true,
      AUTHORIZEDDATE: new Date().toISOString(),
      TRANSFERFLAG: true,
      REPAIRRETURNID: 0,
      DT_WSID: 0,
      DT_VOCDATE: new Date().toISOString(),
      DT_STATUS: 0,
      DT_SALESPERSON_CODE: "",
      DT_POSCUSTCODE: "",
      DT_PARTYNAME: "",
      DT_MOBILE: "",
      FROM_BRANCH: "",
      DT_DELIVERY_DATE: new Date().toISOString(),
      DELIVERED_DATE: new Date().toISOString(),
      DT_TRANSFERID: 0,
      DT_VOCTYPE: "",
      DT_VOCNO: 0,
      DT_BRANCH_CODE: "",
      DT_YEARMONTH: 0,
      CURRENT_BRANCH: "",
      DT_TEL1: "",
      DT_NATIONALITY: "",
      DT_TYPE: "",
      DT_EMAIL: "",
      DT_REMARKS: this.repairjewelleryreceiptdetailsFrom.value.remark,
      DT_DELIVERYDATE: new Date().toISOString(),
      DT_TOTAL_PCS: 0,
      DT_TOTAL_GRWT: 0,
      DT_NAVSEQNO: 0,
      DT_POBOX: "",
      DT_POSCUSTPREFIX: "",
      DT_MOBILECODE: "",
      DT_STATE: "",
      DT_RELIGION: "",
      DT_CITY: "",
      DT_TEL2: "",
      DT_SYSTEM_DATE: new Date().toISOString(),
      DT_SALESREFERENCE: "",
      DT_AUTHORISE: 0,
      DT_AUTHORISE_BRANCH: "",
      EST_REPAIR_CHARGES:
        this.repairjewelleryreceiptdetailsFrom.value.Est_repair_charge,
      AUTH_INBRANCH_DATE: new Date().toISOString(),
      AUTH_INHO_DATE: new Date().toISOString(),
      AUTH_INBRANCH_REMARKS: "",
      AUTH_INBRANCH_USER: "",
      AUTH_INHO_REMARKS: "",
      AUTH_INHO_USER: "",
      BRTRANSFERID: 0,
      JOBCARD_FLAG: 0,
      DIRECT_DELIVERY: 0,
    };

    this.close(postData);

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
                  this.repairjewelleryreceiptdetailsFrom.reset();
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
          "JobWaxReturn/DeleteJobWaxReturn/" +
          this.branchCode +
          this.repairjewelleryreceiptdetailsFrom.value.voctype +
          this.repairjewelleryreceiptdetailsFrom.value.vocno +
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
                      this.repairjewelleryreceiptdetailsFrom.reset();
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
                      this.repairjewelleryreceiptdetailsFrom.reset();
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
      this.subscriptions.forEach((subscription) => subscription.unsubscribe());
      this.subscriptions = [];
    }
  }
}
