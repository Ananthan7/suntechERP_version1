import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";

@Component({
  selector: "app-show-trans-details",
  templateUrl: "./show-trans-details.component.html",
  styleUrls: ["./show-trans-details.component.scss"],
})
export class ShowTransDetailsComponent implements OnInit {
  @Input() customerCode!: string;
  fetchedPicture: any;
  tableData: any = [];
  POSCustomerWiseInvoiceDetails: any = [];
  POSCustomerWiseInvoiceVoucherDetails: any = [];
  POSCustomerWiseAdvanceSummary: any = [];
  POSCustomerWiseLoyaltyDetails: any = [];

  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Customer" },
    { field: "BRANCH_CODE", caption: "Branch" },
    { field: "VOCTYPE", caption: "Voucher" },
    { field: "DIVISION", caption: "Division" },
    { field: "QTY", caption: "Quantity" },
    { field: "amount", caption: "Amount" },
    { field: "PROFIT", caption: "Profit" },
  ];

  invoiceDetailsHeadings: any[] = [
    { field: "BRANCH_CODE", caption: "Branch" },
    { field: "VOCTYPE", caption: "Voucher" },
    { field: "VOCNO", caption: "Vocno" },
    { field: "VOCDATE", caption: "Voc Date" },
    { field: "QTY", caption: "Quantity" },
    { field: "amount", caption: "Amount" },
    { field: "PROFIT", caption: "Profit" },
  ];

  advanceDetailsHeadings: any[] = [
    { field: "BRANCH_CODE", caption: "Branch Code" },
    { field: "VOCTYPE", caption: "Voucher Type" },
    { field: "VOCNO", caption: "Voc No" },
    { field: "VOCDATE", caption: "Voc Date" },
    { field: "TOTAL_AMOUNTFC", caption: "Amount FC" },
    { field: "BALANCE_FC", caption: "Balance FC" },
  ];

  loyaltyTransDetailsHeading: any[] = [
    { field: "BRANCH_CODE", caption: "Branch Code" },
    { field: "VOCTYPE", caption: "Voucher Type" },
    { field: "VOCNO", caption: "Voc No" },
    { field: "VOCDATE", caption: "Voc Date" },
    { field: "TOTAL_AMOUNTFC", caption: "Sales Amount" },
    { field: "BALANCE_FC", caption: "Loyalty Points" },
    { field: "BALANCE_FC", caption: "Redeem Points" },
  ];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService
  ) {}

  showTarnsDetailsForm: FormGroup = this.formBuilder.group({
    customer: [""],
    customerCode: [""],
    mobile: [""],
    teleRes: [""],
    teleOff: [""],
    faxNo: [""],
    emailId: [""],
    poBox: [""],
    city: [""],
    countryCode: [""],
    country: [""],
  });

  ngOnInit(): void {
    this.getPOSCustomerWiseInvoiceDetails();
    this.getPOSCustomerWiseInvoiceVoucherDetails();
    this.getPOSCustomerWiseAdvanceSummary();
    this.getPOSCustomerWiseLoyaltyDetails()
  }

  getPOSCustomerWiseInvoiceDetails() {
    let API = `PrivilegeCustomerNetSalesSummary/GetUspPOSCustomerWiseInvoiceDetails/${this.customerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.dynamicData);
          this.POSCustomerWiseInvoiceDetails = res.dynamicData[0];
        }
      });
  }

  getPOSCustomerWiseInvoiceVoucherDetails() {
    let API = `PrivilegeCustomerNetSalesSummary/GetUspPOSCustomerWiseInvoiceVocDetail/${this.customerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.dynamicData);
          this.POSCustomerWiseInvoiceVoucherDetails = res.dynamicData[0];
        }
      });
  }

  getPOSCustomerWiseAdvanceSummary() {
    let API = `PrivilegeCustomerNetSalesSummary/GetShowAdvanceSummaryGrid/${this.customerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.dynamicData);
          this.POSCustomerWiseAdvanceSummary = res.dynamicData[0];
        }
      });
  }

  getPOSCustomerWiseLoyaltyDetails() {
    let API = `PrivilegeCustomerNetSalesSummary/GetShowLoayltydetailsGrid/${this.customerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.dynamicData);
          this.POSCustomerWiseLoyaltyDetails = res.dynamicData[0];
        }
      });
  }

  close() {
    this.activeModal.close();
  }
}
