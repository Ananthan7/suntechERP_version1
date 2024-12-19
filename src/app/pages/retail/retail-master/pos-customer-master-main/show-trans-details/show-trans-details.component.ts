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
  @Input() data!: string;

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
    { field: "Loyalty Points", caption: "Loyalty Points" },
    { field: "Redeem", caption: "Redeem Points" },
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
    this.valuesBindingOnForm(this.data);
    this.getPOSCustomerWiseInvoiceDetails();
    this.getPOSCustomerWiseInvoiceVoucherDetails();
    this.getPOSCustomerWiseAdvanceSummary();
    this.getPOSCustomerWiseLoyaltyDetails();
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

  valuesBindingOnForm(data: any) {
    console.log('call frm Report', data)
    
    this.showTarnsDetailsForm.controls["customerCode"].setValue(data.CODE);
    this.showTarnsDetailsForm.controls["customer"].setValue(data.NAME);
    this.showTarnsDetailsForm.controls["mobile"].setValue(data.MOBILE);
    this.showTarnsDetailsForm.controls["teleRes"].setValue(data.TEL1);
    this.showTarnsDetailsForm.controls["teleOff"].setValue(data.TEL2);
    this.showTarnsDetailsForm.controls["faxNo"].setValue(data.FAX);
    this.showTarnsDetailsForm.controls["emailId"].setValue(data.EMAIL);
    this.showTarnsDetailsForm.controls["poBox"].setValue(data.POBOX_NO);
    this.showTarnsDetailsForm.controls["city"].setValue(data.CITY);
    this.showTarnsDetailsForm.controls["countryCode"].setValue(
      data.COUNTRY_CODE
    );
    this.showTarnsDetailsForm.controls["country"].setValue(data.COUNTRY_DESC);
  }

  close() {
    this.activeModal.close();
  }
}
