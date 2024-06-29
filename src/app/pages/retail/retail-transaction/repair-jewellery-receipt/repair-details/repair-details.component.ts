import { Component, ComponentFactory, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";
import { Code } from "angular-feather/icons";
import { AlloyAllocationComponent } from "src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component";
import { IndexedDbService } from "src/app/services/indexed-db.service";

@Component({
  selector: "app-repair-details",
  templateUrl: "./repair-details.component.html",
  styleUrls: ["./repair-details.component.scss"],
})
export class RepairDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input() receiptData!: any;
  stoneCheck: boolean = false;
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
  columnheadItemDetails1: any[] = [
    "Comp Code",
    "Description",
    "Pcs",
    "Size Set",
    "Size Code",
    "Type",
    "Category",
    "Shape",
    "Height",
    "Width",
    "Length",
    "Radius",
    "Remarks",
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService // private indexedDb: IndexedDbService,
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

    console.log(this.content);
    

    if (this.receiptData && Object.keys(this.receiptData).length > 0)
      this.setReceiptData();
    else this.getAccountHead();
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
    status_des: [""],
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
    stoneCheck: [false],
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
    console.log(e);
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
    console.log(e);
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
    console.log(e);
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
    console.log(e);

    this.repairjewelleryreceiptdetailsFrom.controls["status"].setValue(e.CODE);
    this.repairjewelleryreceiptdetailsFrom.controls["status_des"].setValue(
      e.DESCRIPTION
    );

    console.log(
      this.repairjewelleryreceiptdetailsFrom.controls["status"].value
    );
    console.log(
      this.repairjewelleryreceiptdetailsFrom.controls["status_des"].value
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
    console.log(e);
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
    console.log(e);
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
  stoneTypeCodeSelected(e: any) {
    console.log(e);
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
    console.log(e);
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
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.Approx.setValue(e.CODE);
  }

  close(data?: any) {
    console.log(data);

    //TODO reset forms and data before closing
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

  getAccountHead(e?: any) {
    console.log(e);
  }

  setReceiptData() {
    if (
      this.receiptData != null &&
      this.receiptData != undefined &&
      Object.keys(this.receiptData).length > 0
    ) {
      this.repairjewelleryreceiptdetailsFrom.controls[
        "descriptionCode"
      ].setValue(this.receiptData.ITEM_DESCRIPTION);

      // this.repairjewelleryreceiptdetailsFrom.controls["description"].setValue(
      //   this.receiptData.ITEM_DESCRIPTION
      // );

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
        this.comService.decimalQuantityFormat(
          this.receiptData.GROSSWT,
          "THREE"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["type_of_item"].setValue(
        this.receiptData.ITEM_STATUSTYPE
      );

      this.repairjewelleryreceiptdetailsFrom.controls["total_amount"].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.AMOUNT),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["status"].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["status_des"].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTFC),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["material"].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.TOTAL_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls[
        "Est_repair_charge"
      ].setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.receiptData.IGST_AMOUNTCC),
          "AMOUNT"
        )
      );

      this.repairjewelleryreceiptdetailsFrom.controls["own_stock"].setValue(
        this.receiptData.REMARKS
      );
      this.repairjewelleryreceiptdetailsFrom.controls[
        "accept_checkbox"
      ].setValue(this.receiptData.MODEDESC);
      this.repairjewelleryreceiptdetailsFrom.controls[
        "changes_checkbox"
      ].setValue(this.receiptData.CARD_NO);
      this.repairjewelleryreceiptdetailsFrom.controls["repair_bags"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["remark"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["stoneCheck"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["stone_type"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["no_of"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["Cut"].setValue(
        this.receiptData.CARD_HOLDER
      );
      this.repairjewelleryreceiptdetailsFrom.controls["Approx"].setValue(
        this.receiptData.CARD_HOLDER
      );
    }

    // receiptData
  }

  adddata() {}

  adddatas() {}

  removedata() {
    this.tableData.pop();
  }

  removedatas() {
    this.tableData.pop();
  }

  formSubmit() {
    console.log(this.content);

    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.repairjewelleryreceiptdetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API = "Repair/InsertRepair";
    let postData = {
      UNIQUEID: 0,
      SRNO: 0,
      DIVISION_CODE: "3",
      STOCK_CODE: "",
      ITEM_DESCRIPTION:
        this.repairjewelleryreceiptdetailsFrom.value.descriptionCode,
      ITEM_NARRATION: "",
      PCS: this.repairjewelleryreceiptdetailsFrom.value.Pcs,
      REPAIR_TYPE: this.repairjewelleryreceiptdetailsFrom.value.type_of,
      GROSSWT: this.comService.decimalQuantityFormat(
        this.repairjewelleryreceiptdetailsFrom.value.gross_Wt,
        "RATE"
      ),
      ITEM_STATUSTYPE:
        this.repairjewelleryreceiptdetailsFrom.value.type_of_item,
      DELIVERY_DATE: this.repairjewelleryreceiptdetailsFrom.value.delivery_date,
      AMOUNT: this.repairjewelleryreceiptdetailsFrom.value.total_amount,
      STATUS: this.repairjewelleryreceiptdetailsFrom.value.status,
      REPAIR_ITEMTYPE: "",
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
      CHECKED: 0,
      DAMAGED: 0,
      RECEIPT: 0,
      WITHSTONE: this.repairjewelleryreceiptdetailsFrom.value.stoneCheck,
      AUTHORIZE: true,
      AUTHORIZEDDATE: "",
      TRANSFERFLAG: true,
      REPAIRRETURNID: 0,
      DT_WSID: 0,
      DT_VOCDATE: "",
      DT_STATUS: 0,
      DT_SALESPERSON_CODE: "",
      DT_POSCUSTCODE: "",
      DT_PARTYNAME: "",
      DT_MOBILE: "",
      FROM_BRANCH: "",
      DT_DELIVERY_DATE: "",
      DELIVERED_DATE: "",
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
      DT_DELIVERYDATE: "",
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
      DT_SYSTEM_DATE: "",
      DT_SALESREFERENCE: "",
      DT_AUTHORISE: 0,
      DT_AUTHORISE_BRANCH: "",
      EST_REPAIR_CHARGES:
        this.repairjewelleryreceiptdetailsFrom.value.Est_repair_charge,
      AUTH_INBRANCH_DATE: "",
      AUTH_INHO_DATE: "",
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

  update() {
    if (this.repairjewelleryreceiptdetailsFrom.invalid) {
      this.toastr.error("select all required fields");
      return;
    }

    let API =
      "JobWaxReturn/UpdateJobWaxReturn/" +
      this.branchCode +
      this.repairjewelleryreceiptdetailsFrom.value.voctype +
      this.repairjewelleryreceiptdetailsFrom.value.vocno +
      this.yearMonth;
    let postData = {};

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
