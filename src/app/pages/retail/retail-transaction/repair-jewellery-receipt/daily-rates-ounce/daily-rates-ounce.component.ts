import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CommonServiceService } from "src/app/services/common-service.service";

@Component({
  selector: "app-daily-rates-ounce",
  templateUrl: "./daily-rates-ounce.component.html",
  styleUrls: ["./daily-rates-ounce.component.scss"],
})
export class DailyRatesOunceComponent implements OnInit {
  columnhead: any[] = [
    "System Rate Criteria",
    "Internal Rate",
    "G and JG Margin",
    "Total",
    "Board Price",
  ];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {}

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: "DIVISION_CODE",
    SEARCH_HEADING: "Division",
    SEARCH_VALUE: "",
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  divisionCodeSelected(e: any) {
    console.log(e);
    this.rateOunceForm.controls.division.setValue(e.DIVISION_CODE);
  }

  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Currency Code",
    SEARCH_VALUE: "",
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  CurrencySelected(e: any) {
    console.log(e);
    
    this.rateOunceForm.controls.currency.setValue(e.Currency);

    this.rateOunceForm.controls.currencyRate.setValue(
      this.comService.decimalQuantityFormat(e["Conv Rate"], "RATE")
    );
  }

  rateOunceForm: FormGroup = this.formBuilder.group({
    date: [""],
    division: [""],
    rateType: [""],
    currency: [""],
    currencyRate: [""],
    ounceRate: [""],
    gramRate: [""],
  });

  dataSource: any[] = [
    { SystemRateCriteria: "Wholesale 22Kt" },
    { SystemRateCriteria: "Gold Purchase 24Kt" },
    { SystemRateCriteria: "Gold Purchase 22Kt" },
    { SystemRateCriteria: "24Kt" },
    { SystemRateCriteria: "22Kt" },
    { SystemRateCriteria: "22(-)Kt" },
    { SystemRateCriteria: "21Kt" },
    { SystemRateCriteria: "20Kt" },
    { SystemRateCriteria: "18(-)Kt" },
    { SystemRateCriteria: "18Kt" },
  ];
  close(data?: any) {
    this.activeModal.close(data);
  }
}
