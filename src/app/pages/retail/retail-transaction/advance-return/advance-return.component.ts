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
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-advance-return",
  templateUrl: "./advance-return.component.html",
  styleUrls: ["./advance-return.component.scss"],
})
export class AdvanceReturnComponent implements OnInit {
  @Input() content!: any;
  branchCode?: String;
  
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
    vocNo: [1],
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

  private subscriptions: Subscription[] = [];

  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,

  ) {}

  ngOnInit(): void {

    this.branchCode = this.comService.branchCode;
    this.advanceReturnForm.controls.vocType.setValue(this.comService.getqueryParamVocType())
    this.advanceReturnForm.controls.baseCurrency.setValue(this.comService.compCurrency);
    this.advanceReturnForm.controls.baseCurrencyRate.setValue(this.comService.getCurrRate(this.comService.compCurrency));
    
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
    this.partyCodeChange({ target: { value: e.ACCODE } })
  }

  partyCodeChange(event: any) {
    if (event.target.value == '') return
    this.snackBar.open('Loading...')
    // this.PartyCodeData.SEARCH_VALUE = event.target.value
    let postData = {
      "SPID": "001",
      "parameter": {
        "ACCODE": event.target.value || "",
        "BRANCH_CODE": this.branchCode
      }
    }
    let Sub: Subscription = this.dataService.postDynamicAPI('ExecueteSPInterface', postData)
      .subscribe((result) => {
        this.snackBar.dismiss()
        if (result.status == "Success") { //
          if (result.dynamicData.length > 0) {

            let data = result.dynamicData[0]
            console.log('data', data);

            if (data && data[0].CURRENCY_CODE) {
              this.advanceReturnForm.controls.partyCurrency.setValue(data[0].CURRENCY_CODE)
              this.advanceReturnForm.controls.partyCurrencyRate.setValue(data[0].CONV_RATE)
              // this.advanceReturnForm.controls.baseCurrency.setValue(data[0].CURRENCY_CODE)
              // this.advanceReturnForm.controls.baseCurrencyRate.setValue(data[0].CONV_RATE)
           }
          }

        } else {
          this.toastr.error('PartyCode not found', result.Message ? result.Message : '', {
            timeOut: 3000,
          })
        }
      }, err => {
        this.snackBar.dismiss()
        this.toastr.error('Server Error', '', {
          timeOut: 3000,
        })
      })
    this.subscriptions.push(Sub)
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
