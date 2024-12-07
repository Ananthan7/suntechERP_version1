import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";
import { CommonServiceService } from "src/app/services/common-service.service";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { formatDate } from '@angular/common';

@Component({
  selector: "app-customer-price-setting",
  templateUrl: "./customer-price-setting.component.html",
  styleUrls: ["./customer-price-setting.component.scss"],
})
export class CustomerPriceSettingComponent implements OnInit {
  @ViewChild("overlayDivisioncode") overlayDivisioncode!: MasterSearchComponent;
  @ViewChild("overlayCurrencyCode") overlayCurrencyCode!: MasterSearchComponent;
  @ViewChild("overlayEnteredByCode") overlayEnteredByCode!: MasterSearchComponent;
  divisionMS: any = "ID";
  columnheader: any[] = [
    "SRNO",
    "GROUP1",
    "GROUP2",
    "GROUP3",
    "GROUP4",
    "GROUP5",
    "GROUP6",
    "STD_MKG_RATE",
    "MKG_RATE_MIN",
    "MKG_RATE_MAX",
    "VARIANCE",
    "WASTAGE_PER",
    "MIN_WASTAGE_QTY",
    "MARKUP_PER",
    "STAMP_CHARGE",
    "APPLY_ON_WEIGHT",
  ];
  columnheaderweightRange: any[] = [
    "SrNo",
    "Division",
    "Apply on Unit",
    "From Weight",
    "To Weight",
    "Making Rate",
  ];
  columnheaderTransaction: any[] = [
    "SrNo",
    "Karat",
    "Std Purity",
    "Sales Purity",
    "Purchase Purity",
  ];

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  postDataDetails: any[] = [];
  currentDate = new FormControl(new Date());
  selectedIndexes: any = [];
  isdisabled: boolean = false;
  checkboxvalue: boolean = true;
  disableDesignCode: boolean = true;
  public isChecked = true;
  userbranch = localStorage.getItem("userbranch");
  disableSelect = false;
  disableStockCode = true;
  codeEnable: boolean = true;
  enableUpdate: boolean = true;
  approveDisable: boolean = true;
  selectedValue: string = "None";
  selectedValue1: string = "None";
  selectedValue2: string = "None";
  selectedValue3: string = "None";
  selectedValue4: string = "None";
  selectedValue5: string = "None";
  tableDataGroupDetails: any[] = [];
  designCodeEnable: boolean = true;
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  deleteMode: boolean = false;
  groups = [
    { type: "None", value: "None" },
    { type: "Category", value: "Category" },
    { type: "Sub Category", value: "Sub Category" },
    { type: "Brand Code", value: "Brand Code" },
    { type: "Type", value: "Type" },
    // { type: 'Collection', value: 'Collection' },
    // { type: 'Sub-Collection', value: 'Sub-Collection' },
    // { type: 'Stone Type/Look', value: 'Stone Type/Look' },
    // { type: 'Setting', value: 'Setting' },
    // { type: 'Shape', value: 'Shape' },
    // { type: 'Inc Cat', value: 'Inc Cat' },
    // { type: 'Order Ref', value: 'Order Ref' }
  ];
  customerpricesettingForm: FormGroup = this.formBuilder.group({
    pricecode: ["", [Validators.required]],
    date: [new Date(), ""],
    description: [""],
    division: ["", [Validators.required]],
    currency: ["", [Validators.required]],
    approvedby: [""],
    enteredby: ["", [Validators.required]],
    stockCode: [false],
    designCode: [false],
    group1: ["None", [Validators.required]],
    group2: ["None"],
    group3: ["None"],
    group4: ["None"],
    group5: ["None"],
    group6: ["None"],
  });
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private suntechApi: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService
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
        this.enableUpdate = false;
        this.approveDisable = false;
      } else if (this.content?.FLAG == "DELETE") {
        this.viewMode = true;
        this.deleteMode = true;
        this.deleteRecord();
      }
    }
    // if (this.content?.FLAG) {
    //   this.setFormValues();
    //   // this.getGroupDetails();
    //   if (this.content.FLAG == "VIEW") {
    //   } else if (this.content.FLAG == "EDIT") {
    //     this.codeEnable = false;

    //     this.enableUpdate = false;
    //     this.approveDisable = false;
    //     this.setFormValues();
    //     // this.getGroupDetails();
    //   }
    // }
  }

  parseDate(dateString: string): string | null {
    if (!dateString) return null;

    // Assuming the input date format is `dd-MM-yyyy`
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts.map((part) => parseInt(part, 10));
      return formatDate(new Date(year, month - 1, day), "yyyy-MM-dd", "en-US");
    }
    return null;
  }

  setFormValues() {
    console.log(this.content);
    if (!this.content) return;
    const startFromDate = this.parseDate(this.content.CREATED_DATE);
    this.customerpricesettingForm.controls.pricecode.setValue(
      this.content.PRICE_CODE
    );
    this.customerpricesettingForm.controls.date.setValue(
      startFromDate
    );
    this.customerpricesettingForm.controls.description.setValue(
      this.content.DESCRIPTION
    );
    this.customerpricesettingForm.controls.division.setValue(
      this.content.DIVISION
    );
    this.customerpricesettingForm.controls.currency.setValue(
      this.content.CURRENCY_CODE
    );
    this.customerpricesettingForm.controls.approvedby.setValue(
      this.content.APPROVED_BY
    );
    this.customerpricesettingForm.controls.enteredby.setValue(
      this.content.ENTERED_BY
    );
    this.customerpricesettingForm.controls.stockCode.setValue(
      this.content.IS_STOCK_CODE == "Y"?true:false
    );
    this.customerpricesettingForm.controls.designCode.setValue(
      this.content.IS_DESIGN_CODE == "Y"? true:false
    );
    this.customerpricesettingForm.controls.group1.setValue(this.content.GROUP1);
    this.customerpricesettingForm.controls.group2.setValue(this.content.GROUP2);
    this.customerpricesettingForm.controls.group3.setValue(this.content.GROUP3);
    this.customerpricesettingForm.controls.group4.setValue(this.content.GROUP4);
    this.customerpricesettingForm.controls.group5.setValue(this.content.GROUP5);
    this.customerpricesettingForm.controls.group6.setValue(this.content.GROUP6);
  }
  selectStock() {
    this.checkboxvalue = !this.checkboxvalue;
    this.designCodeEnable = !this.designCodeEnable;
  }
  onStockCodeChange(event: any): void {
    const isChecked = event.checked;
    this.disableDesignCode = !isChecked;

    if (isChecked) {
      this.customerpricesettingForm.controls.designCode.enable();
    } else {
      this.customerpricesettingForm.controls.designCode.disable();
    }
  }

  checkPriceCode(): boolean {
    if (this.customerpricesettingForm.value.pricecode == "") {
      this.commonService.toastErrorByMsgId("please enter pricecode");
      return true;
    }
    return false;
  }



  codeEnabled() {
    if (this.customerpricesettingForm.value.pricecode == "") {
      this.codeEnable = true;
    } else {
      this.codeEnable = false;
    }
  }

  isCheckboxChecked(): boolean {
    // Check if any row's checkbox is checked in the first grid
    return this.tableDataGroupDetails.some((row) => row.APPLY_ON_WEIGHT);
  }
  toggleStockCode(event: any): void {
    const isChecked = event.checked;
    if (isChecked) {
      this.customerpricesettingForm.get("stockCode")?.enable();
      this.disableStockCode = false;
    } else {
      this.customerpricesettingForm.get("stockCode")?.disable();
      this.disableStockCode = true;
    }
  }

  compCodetemp(data: any, value: any) {
    this.tableDataGroupDetails[value.data.SRNO - 1].CompCode =
      data.target.value;
  }

  SRCH_VALUEtemp(data: any, value: any) {
    this.tableData[value.data.SR_NO - 1].mkgCode = data.target.value;
  }

  user: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "User",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };
  userDataSelected(value: any) {
    console.log(value);
    if (this.checkPriceCode()) return;
    this.customerpricesettingForm.controls.enteredby.setValue(value.UsersName);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: "DIVISION_CODE",
    SEARCH_HEADING: "Division Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "DIVISION in ('M')",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  divisionCodeSelected(e: any) {
    console.log(e);
    if (this.checkPriceCode()) return;
    this.customerpricesettingForm.controls.division.setValue(e.DIVISION_CODE);
  }

  currencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 176,
    SEARCH_FIELD: "CURRENCY_CODE",
    SEARCH_HEADING: "Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "CMBRANCH_CODE = '" + this.userbranch + "'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };
  currencyCodeSelected(e: any) {
    console.log(e);
    this.customerpricesettingForm.controls.currency.setValue(e.CURRENCY_CODE);
  }

  approvedbyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: "UsersName",
    SEARCH_HEADING: "Approved By",
    SEARCH_VALUE: "",
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  ApprovedbyCodeSelected(e: any) {
    console.log(e);
    if (this.checkPriceCode()) return;
    this.customerpricesettingForm.controls.approvedby.setValue(e.UsersName);
  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }

  designCodeChange() {
    this.getGroupDetails();
  }

  viewchangeYorN(e: any) {
    console.log(e);

    if (e == true) {
      return "Y";
    } else if (e == "") {
      return "N";
    } else if (e == "None") {
      return "";
    } else {
      return "N";
    }
  }

  replaceNoneWithEmpty(value: string): string {
    return value === "None" ? " " : value;
  }

  getGroupDetails() {
    let API = "UspGetPricingDetails";
    let postDataDetails = {
      DivisionCode: this.customerpricesettingForm.value.division,
      StockCodeCheck: this.viewchangeYorN(
        this.customerpricesettingForm.value.stockCode
      ),
      DesignCodeCheck: this.viewchangeYorN(
        this.customerpricesettingForm.value.designCode
      ),
      FilterGroup1: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group1
      ),
      FilterGroup2: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group2
      ),
      FilterGroup3: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group3
      ),
      FilterGroup4: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group4
      ),
      FilterGroup5: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group5
      ),
      FilterGroup6: this.replaceNoneWithEmpty(
        this.customerpricesettingForm.value.group6
      ),
      // "FilterValue1": "",
      // "FilterValue2": "",
      // "FilterValue3": "",
      // "FilterValue4": "",
      // "FilterValue5": "",
      // "FilterValue6": ""
    };
    let Sub: Subscription = this.suntechApi
      .postDynamicAPI(API, postDataDetails)
      .subscribe(
        (result) => {
          if (result.status == "Success") {
            this.tableDataGroupDetails = result.dynamicData[0];

            console.log(this.tableDataGroupDetails);
          } else {
            this.commonService.toastErrorByMsgId("MSG1531");
          }
        },
        (err) => alert(err)
      );
    this.subscriptions.push(Sub);
  }

  formSubmit() {
    if (this.customerpricesettingForm.value.enteredby == "") {
      this.toastr.error("Entered By Cannot be empty ");
    }

    if (this.content && this.content.FLAG == "EDIT") {
      this.update();
      return;
    }
    if (this.customerpricesettingForm.invalid) {
      this.toastr.error("select all required fields");
      return;
    }
    let form = this.customerpricesettingForm.value;
    let API = "CustomerVendorPriceSettmtl/InsertCustomerVendorPrice";
    let postData = {
      MID: 0,
      PRICE_CODE: this.customerpricesettingForm.value.pricecode || "",
      DESCRIPTION: this.customerpricesettingForm.value.description || "",
      DIVISION: this.customerpricesettingForm.value.division,
      CREATED_DATE: this.customerpricesettingForm.value.date || "",
      ENTERED_BY: this.customerpricesettingForm.value.enteredby || "",
      IS_STOCK_CODE: this.customerpricesettingForm.value.stockCode,
      APPROVED_BY: this.customerpricesettingForm.value.approvedby || "",
      GROUP1: this.customerpricesettingForm.value.group1 || "",
      GROUP2: this.customerpricesettingForm.value.group2 || "",
      GROUP3: this.customerpricesettingForm.value.group3 || "",
      IS_ACTIVE: true,
      BRANCH_CODE: this.commonService.branchCode,
      GROUP4: this.customerpricesettingForm.value.group4 || "",
      GROUP5: this.customerpricesettingForm.value.group5 || "",
      GROUP6: this.customerpricesettingForm.value.group6 || "",
      CURRENCY_CODE: this.customerpricesettingForm.value.currency || "",
      CURRENCY_RATE: 0,
      IS_DESIGN_CODE: this.customerpricesettingForm.value.designCode,
      customerVendorPriceSettmtlDetail: [
        {
          SRNO: 0,
          UNIQUE_ID: 0,
          PRICE_CODE: this.customerpricesettingForm.value.pricecode || "",
          DESCRIPTION: this.customerpricesettingForm.value.description || "",
          DIVISION_CODE: this.customerpricesettingForm.value.division,
          SEARCH_CRITERIA: "",
          SEARCH_VALUE: "",
          GROUP1: this.customerpricesettingForm.value.group1 || "",
          GROUP2: this.customerpricesettingForm.value.group2 || "",
          GROUP3: this.customerpricesettingForm.value.group3 || "",
          UNITCODE: "",
          STD_MKG_RATE: 0,
          MKG_RATE_MIN: 0,
          MKG_RATE_MAX: 0,
          VARIANCE: 0,
          WASTAGE_PER: 0,
          MIN_WASTAGE_QTY: 0,
          MARKUP_PER: 0,
          APPLY_ON_WEIGHT: true,
          IS_STOCK_CODE: true,
          BRANCH_CODE: "",
          GROUP4: this.customerpricesettingForm.value.group4 || "",
          GROUP5: this.customerpricesettingForm.value.group5 || "",
          GROUP6: this.customerpricesettingForm.value.group6 || "",
          STAMP_CHARGE: 0,
          RATI_PER: 0,
        },
      ],
      customerVendorPricePurityDet: [
        {
          SR_NO: 0,
          UNIQUEID: 0,
          UNIQUE_ITEM_ID: 0,
          PRICE_CODE: "",
          KARAT_CODE: "",
          STD_PURITY: 0,
          SALE_PURITY: 0,
          PURC_PURITY: 0,
        },
      ],
      customerVendorPriceWtrangeDet: [
        {
          SR_NO: 0,
          UNIQUEID: 0,
          UNIQUE_ITEM_ID: 0,
          PRICE_CODE: "",
          DIVISION_CODE: "",
          WT_RANGE_FROM: 0,
          WT_RANGE_TO: 0,
          STD_MKGRATE: 0,
          SRCH_CRITERIA: "",
          SRCH_VALUE: "",
          UNIT_CODE: "",
        },
      ],
    };

    let Sub: Subscription = this.suntechApi
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
                  this.customerpricesettingForm.reset();
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
    // if (this.customerpricesettingForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API =
      "CustomerVendorPriceSettmtl/UpdateCustomerVendorPrice/" +
      this.content.PRICE_CODE;
    let postData = {
      MID: 0,
      PRICE_CODE: this.customerpricesettingForm.value.pricecode || "",
      DESCRIPTION: this.customerpricesettingForm.value.description || "",
      DIVISION: this.customerpricesettingForm.value.division,
      CREATED_DATE: this.customerpricesettingForm.value.date || "",
      ENTERED_BY: this.customerpricesettingForm.value.enteredby || "",
      IS_STOCK_CODE: this.customerpricesettingForm.value.stockCode,
      APPROVED_BY: this.customerpricesettingForm.value.approvedby || "",
      GROUP1: this.customerpricesettingForm.value.group1 || "",
      GROUP2: this.customerpricesettingForm.value.group2 || "",
      GROUP3: this.customerpricesettingForm.value.group3 || "",
      IS_ACTIVE: true,
      BRANCH_CODE: this.commonService.branchCode,
      GROUP4: this.customerpricesettingForm.value.group4 || "",
      GROUP5: this.customerpricesettingForm.value.group5 || "",
      GROUP6: this.customerpricesettingForm.value.group6 || "",
      CURRENCY_CODE: this.customerpricesettingForm.value.currency || "",
      CURRENCY_RATE: 0,
      IS_DESIGN_CODE: this.customerpricesettingForm.value.designCode,
      customerVendorPriceSettmtlDetail: [
        {
          SRNO: 0,
          UNIQUE_ID: 0,
          PRICE_CODE: this.customerpricesettingForm.value.pricecode || "",
          DESCRIPTION: this.customerpricesettingForm.value.description || "",
          DIVISION_CODE: this.customerpricesettingForm.value.division,
          SEARCH_CRITERIA: "",
          SEARCH_VALUE: "",
          GROUP1: this.customerpricesettingForm.value.group1 || "",
          GROUP2: this.customerpricesettingForm.value.group2 || "",
          GROUP3: this.customerpricesettingForm.value.group3 || "",
          UNITCODE: "",
          STD_MKG_RATE: 0,
          MKG_RATE_MIN: 0,
          MKG_RATE_MAX: 0,
          VARIANCE: 0,
          WASTAGE_PER: 0,
          MIN_WASTAGE_QTY: 0,
          MARKUP_PER: 0,
          APPLY_ON_WEIGHT: true,
          IS_STOCK_CODE: true,
          BRANCH_CODE: "",
          GROUP4: this.customerpricesettingForm.value.group4 || "",
          GROUP5: this.customerpricesettingForm.value.group5 || "",
          GROUP6: this.customerpricesettingForm.value.group6 || "",
          STAMP_CHARGE: 0,
          RATI_PER: 0,
        },
      ],
      customerVendorPricePurityDet: [
        {
          SR_NO: 0,
          UNIQUEID: 0,
          UNIQUE_ITEM_ID: 0,
          PRICE_CODE: "",
          KARAT_CODE: "",
          STD_PURITY: 0,
          SALE_PURITY: 0,
          PURC_PURITY: 0,
        },
      ],
      customerVendorPriceWtrangeDet: [
        {
          SR_NO: 0,
          UNIQUEID: 0,
          UNIQUE_ITEM_ID: 0,
          PRICE_CODE: "",
          DIVISION_CODE: "",
          WT_RANGE_FROM: 0,
          WT_RANGE_TO: 0,
          STD_MKGRATE: 0,
          SRCH_CRITERIA: "",
          SRCH_VALUE: "",
          UNIT_CODE: "",
        },
      ],
    };
    let Sub: Subscription = this.suntechApi
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
                  this.customerpricesettingForm.reset();
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
          "CustomerVendorPriceSettmtl/DeleteCustomerVendorPrice/" +
          this.content.PRICE_CODE;
        let Sub: Subscription = this.suntechApi.deleteDynamicAPI(API).subscribe(
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
                    this.customerpricesettingForm.reset();
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
                    this.customerpricesettingForm.reset();
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

  // onSelectionChange(selectedValue: any, groupName: string) {
  //   const formValue = this.customerpricesettingForm.value;

  //   for (let groupKey in formValue) {
  //     if (groupKey !== groupName && formValue[groupKey] === selectedValue) {

  //       if (selectedValue !== null) {
  //         this.toastr.error('The same value cannot be repeated in different groups.');

  //         this.customerpricesettingForm.get(groupName)?.setValue(null);
  //         return;
  //       }
  //     }
  //   }
  // }

  onSelectionChange(selectedValue: any, groupName: string) {
    const formValue = this.customerpricesettingForm.value;

    for (let groupKey in formValue) {
      if (
        groupKey !== groupName &&
        formValue[groupKey] === selectedValue &&
        selectedValue !== "None"
      ) {
        // Check if the value is repeated in a different group and is not 'None'
        this.toastr.error(
          "The same value cannot be repeated in different groups."
        );
        this.customerpricesettingForm.get(groupName)?.setValue(null);
        return;
      }
    }
  }

  addweightdata() {
    let srno = length + 1;
    let data = {
      SR_NO: srno,
      UNIQUEID: 0,
      UNIQUE_ITEM_ID: 0,
      PRICE_CODE: "",
      DIVISION_CODE: "G",
      WT_RANGE_FROM: 0,
      WT_RANGE_TO: 0,
      STD_MKGRATE: 0,
      SRCH_CRITERIA: "",
      SRCH_VALUE: "",
      UNIT_CODE: "",
    };

    this.tableData.push(data);

    this.tableData.forEach((item, i) => {
      item.SR_NO = i + 1;
      item.isDisabled = true;
    });
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }

  removeweightdata() {
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
              (data, index) => !this.selectedIndexes.includes(index)
            );
            this.snackBar.open("Data deleted successfully!", "OK", {
              duration: 2000,
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


  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    // if (!searchValue || this.flag == "VIEW") return;

    LOOKUPDATA.SEARCH_VALUE = searchValue;

    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };

    this.commonService.showSnackBarMsg("MSG81447");

    const sub: Subscription = this.suntechApi
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];
                console.log(FORMNAMES);
                console.log(matchedItem);

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    console.log(field);

                    this.customerpricesettingForm.controls[formName].setValue(
                      matchedItem[field]
                    );
                  } else {
                    console.error(
                      `Property ${field} not found in matched item.`
                    );
                    this.commonService.toastErrorByMsgId("No data found");
                    this.clearLookupData(LOOKUPDATA, FORMNAMES);
                  }
                });
              } else {
                this.commonService.toastErrorByMsgId("No data found");
                this.clearLookupData(LOOKUPDATA, FORMNAMES);
              }
            }
          } else {
            this.commonService.toastErrorByMsgId("No data found");
            this.clearLookupData(LOOKUPDATA, FORMNAMES);
          }
        },
        error: () => {
          this.commonService.toastErrorByMsgId("MSG2272");
          this.clearLookupData(LOOKUPDATA, FORMNAMES);
        },
      });

    this.subscriptions.push(sub);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.customerpricesettingForm.controls[formName].setValue("");
    });
  }

  onchangeCheckBoxNum(e: any) {
    // console.log(e);

    if (e == true) {
      return 1;
    } else {
      return 0;
    }
  }

  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    LOOKUPDATA: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if (event.key == "Tab") {
      console.log("Tab");
      console.log(controllers);
      console.log(event);

      this.lookupKeyPress(event, controllers[0]);
    }
  }

  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.customerpricesettingForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }
  lookupKeyPress(event: any, form?: any) {
    if (event.key == "Tab" && event.target.value == "") {
      this.showOverleyPanel(event, form);
    }
    if (event.key === "Enter") {
      if (event.target.value == "") this.showOverleyPanel(event, form);
      event.preventDefault();
    }
  }

  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "division":
        this.overlayDivisioncode.showOverlayPanel(event);
        break;
      case "currency":
        this.overlayCurrencyCode.showOverlayPanel(event);
        break;
      case "enteredby":
        this.overlayEnteredByCode.showOverlayPanel(event);
        break;;
      default:
    }
  }

}
