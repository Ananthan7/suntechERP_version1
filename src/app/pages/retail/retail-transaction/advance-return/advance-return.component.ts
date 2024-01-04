import { Component, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { PcrSelectionComponent } from "./pcr-selection/pcr-selection.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";

@Component({
  selector: "app-advance-return",
  templateUrl: "./advance-return.component.html",
  styleUrls: ["./advance-return.component.scss"],
})
export class AdvanceReturnComponent implements OnInit {
  @Input() content!: any;
  
  vocMaxDate = new Date();
  currentDate = new Date();
  columnhead: any[] = [
    "SRNO",
    "Branch",
    "ACCODE",
    "Type",
    "Cheque No",
    "Cheque Date",
    "Bank",
    "Currency",
    "Amount FC",
    "Amount LC",
    "Balance",
    "VAT %",
    "VAT Amount",
    "Total Amount",
    "COMM_TAX AMOUNT CC",
    "COMM_TAX PER",
    "COMM_AMOUNT CC",
    "COMM_PER  ",
  ];
  pcrSelectionData: any[] = [];

  enteredByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: "SALESPERSON_CODE",
    SEARCH_HEADING: "",
    SEARCH_VALUE: "",
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  partyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 6,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Party Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  partyCurrencyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: "Currency",
    SEARCH_HEADING: "Party Currency",
    SEARCH_VALUE: "",
    WHERECONDITION: "Currency <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "POS Customer Master",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  advanceReturnForm: FormGroup = this.formBuilder.group({
    vocType: [""],
    vocNo: [""],
    vocDate: [""],
    partyCode: [""],
    partyCurrency: [""],
    partyCurrencyRate: [""],
    enteredBy: [""],
    enteredByCode: [""],
    partyRefNo: [""],
    date: [""],
    baseCurrency: [""],
    baseCurrencyRate: [""],
    customerCode: [""],
    customerName: [""],
    advanceFromCustomers: [""],
    partyAddress: [""],
    partyAmount: [""],
    partyAmountRate: [""],
    narration: [""],
    total: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService
  ) {}

  ngOnInit(): void {

    
  }

  openaddposdetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      PcrSelectionComponent,
      {
        size: "lg",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );

    modalRef.result.then((postData) => {
      if (postData) {
        console.log("Data from modal:", postData);
        this.pcrSelectionData.push(postData);

        this.pcrSelectionData.forEach((data, index) => (data.SRNO = index + 1));
      }
    });
  }

  enteredBySelected(e: any) {
    console.log(e);
    this.advanceReturnForm.controls.enteredBy.setValue(e.SALESPERSON_CODE);
    this.advanceReturnForm.controls.enteredByCode.setValue(e.DESCRIPTION);
  }

  partyCodeSelected(e: any) {
    console.log(e);
    this.advanceReturnForm.controls.partyCode.setValue(e.ACCODE);
  }

  partyCurrencyCodeSelected(e: any) {
    // console.log(e);
  }

  customerCodeSelected(e: any) {
    console.log(e);

    this.advanceReturnForm.controls.customerCode.setValue(e.CODE);
    this.advanceReturnForm.controls.customerName.setValue(e.NAME);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
