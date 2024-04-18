import { Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { AddPosComponent } from "../../retail-transaction/add-pos/add-pos.component";

@Component({
  selector: "app-receipt-detail",
  templateUrl: "./receipt-detail.component.html",
  styleUrls: ["./receipt-detail.component.scss"],
})
export class ReceiptDetailComponent implements OnInit {
  selectedTabIndex = 0;
  @Input() modal!: NgbModalRef;
  @Output() newReceiptItem = new EventEmitter<any>();
  @Input() cashreceiptForm: any;
  @Input() advanceReceiptForm: any;
  @Input() creditCardReceiptForm: any;
  @Input() customerReceiptForm: any;
  @Input() giftReceiptForm: any;
  @Input() othersReceiptForm: any;
  @Input() vocDataForm: any;

  @Input() model: any;
  @Input() dataModel: any;
  @Input() receiptModesList: any;
  @Input() balanceAmount: any;
  @Input() order_items_total_net_amount: any;
  @Input() zeroAmtVal: any;
  @Input() viewOnly: any;
  @Input() receiptModeOptions_Cash : any;
  @Input() receiptModeOptions_CC : any;
  @Input() isInvalidRecNo : any;
  @Input() advanceReceiptDetails : any;
  @Input() receiptModeAdvanceOthers : any;
  @Input() filteredAdvanceBranchOptions : any;
  @Input() filteredadvanceYear: any;
  @Input() receiptModeOptionsOthers: any;
  @Input() receiptModeGiftOptions: any;
  @Input() dataForm : any;
  @Input() isInvalidGIftVocNo : any;
  @Input() customAcCodeListOptions : any;
  @Input() receiptDetailView : any;
  @Input() invReturnSalesTotalNetTotal : any;
  @Input() modalReference: any;
  @Input() receiptDetailsList: any;
  @Input() receiptEditId: any;
  @Input() retailSalesMID: any;
  @Input() order_total_exchange: any;
  @Input() vocType: any;
  @Input() retailSaleDataVocNo: any;
  @Input() strBranchcode: any;
  
  constructor(
    private suntechApi: SuntechAPIService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private comFunc: CommonServiceService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}
  /** TODO receipt amount fc form set value with output */
  changeReceiptAmtFC(event: any, formName: keyof ReceiptDetailComponent, fieldName?: any) {
    const value = event.target.value;
    const upValue = this.comFunc.transformDecimalVB(
      this.comFunc.allbranchMaster?.BAMTDECIMALS, value);

    event.target.value = upValue;
    this[formName].controls[fieldName].setValue(
      upValue
    );
  }
  @ViewChild(AddPosComponent) addPosComponent!: AddPosComponent;

  validateReceipt() {

    if (this.comFunc.emptyToZero(this.invReturnSalesTotalNetTotal) != 0 || this.comFunc.emptyToZero(this.order_total_exchange)) {

      this.addPosComponent.removeReceiptFormValidation();
    } else {
      this.addPosComponent.addReceiptFormValidation();
    }

    if (this.selectedTabIndex == 0) {
      return this.cashreceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 1) {
      return this.creditCardReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 2) {
      return this.advanceReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 3) {
      return this.othersReceiptForm.invalid;
    }
    else if (this.selectedTabIndex == 4) {
      return this.giftReceiptForm.invalid;
    } else {
      return this.customerReceiptForm.invalid;
    }
  }
  saveReceipt(type?: any) {
    this.newReceiptItem.emit(type)
  }
  changeBranch(e: any) {
    console.log(this.dataForm.value.branch);
    let selectedBranch = this.dataForm.value.branch;
    if (selectedBranch != '') {
    }
  }
  changeGiftVocNo(event: any) {
    const value = event.target.value;
    const vocType = this.giftReceiptForm.value.paymentsCreditGIftVoc;
    if (value != '') {
      this.snackBar.open('Loading...');
      let API = `ValidateGiftVocNo/ValidateGiftVocNo/${value}/${vocType}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'].toString().trim() == 'Success') {
            this.isInvalidGIftVocNo = false;
            const result = res.response;

            this.giftReceiptForm.controls.giftAmtFC.setValue(
              this.comFunc.transformDecimalVB(
                this.comFunc.allbranchMaster?.BAMTDECIMALS, this.comFunc.emptyToZero(res.VoucherAmountFc).toString()));

            this.giftReceiptForm.controls.giftBranch.setValue(result.BRANCH_CODE);

          } else {
            this.isInvalidGIftVocNo = true;
            this.giftReceiptForm.controls.giftAmtFC.setValue(
              this.zeroAmtVal);


            this.snackBar.open(res.message, 'OK', {
              duration: 2000
            });
            // this.snackBar.open('Invalid Receipt No.', 'OK', {
            //   duration: 2000
            // });
          }
        });
    } else {
      this.advanceReceiptForm.controls.advanceAmount.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptDetails = {};
    }

  }

  /** USE ? */
  changeAdvanceVocNo(event: any) {
    // const value = event.target.value;
    const value = this.advanceReceiptForm.value.advanceRecNo;
    if (value != '') {
      this.snackBar.open('Loading...');
      let API = `AdvanceReceipt/GetAdvanceReceipt/${this.advanceReceiptForm.value.advanceBranch}/PCR/${this.advanceReceiptForm.value.advanceYear}/${this.advanceReceiptForm.value.advanceRecNo}/${this.advanceReceiptForm.value.advanceCustCode}`
      this.suntechApi.getDynamicAPI(API)
        .subscribe((res) => {
          this.snackBar.dismiss();
          if (res['status'] == 'Success') {
            this.isInvalidRecNo = false;

            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.comFunc.emptyToZero(res['response']['BALANCE_FC']).toString());
            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.comFunc.emptyToZero(res['response']['GST_TOTALFC']).toString());
            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.comFunc.emptyToZero(res['response']['GST_TOTALCC']).toString());
            this.advanceReceiptDetails = res['response'];
          } else {
            this.isInvalidRecNo = true;
            this.advanceReceiptForm.controls.advanceAmount.setValue(
              this.zeroAmtVal);
            this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
              this.zeroAmtVal);
            this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
              this.zeroAmtVal);
            this.advanceReceiptDetails = {};

            this.snackBar.open('Invalid Receipt No.', 'OK', {
              duration: 2000
            });
          }
        });
    } else {
      this.advanceReceiptForm.controls.advanceAmount.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
        this.zeroAmtVal);
      this.advanceReceiptDetails = {};
    }

  }
  changeCustAcCode(value: any) {
    console.log('val ', value);
  }
  /** USE ? */
  setTabByIndex(index: any, data?: any) {
    this.selectedTabIndex = index;

    if (this.receiptModesList?.BTN_CASH == true && this.selectedTabIndex == 0) {
      if (data != null && data != undefined && data != undefined) {
        this.cashreceiptForm.controls.paymentsCash.setValue(
          data["RECEIPT_MODE"].toString()
        );
        this.cashreceiptForm.controls.cashAmtFC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"]).toString()
          )
        );
        this.cashreceiptForm.controls.cashAmtLC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_CC"]).toString()
          )
        );
      } else {
        if (this.balanceAmount != null) {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
        } else {
          this.cashreceiptForm.controls.cashAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
          this.cashreceiptForm.controls.cashAmtLC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
        }
      }

      this.renderer.selectRootElement("#cashAmtFC").focus();
    }
    if (
      this.receiptModesList?.["BTN_CREDITCARD"] == true &&
      this.selectedTabIndex == 1
    ) {
      if (data != null && data != undefined) {
        this.creditCardReceiptForm.controls.paymentsCreditCard.setValue(
          data["RECEIPT_MODE"].toString()
        );
        this.creditCardReceiptForm.controls.cardCCNo.setValue(
          data["CARD_NO"].toString()
        );
        this.creditCardReceiptForm.controls.cardAmtFC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"]).toString()
          )
        );
      } else {
        if (this.balanceAmount != null) {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
        } else {
          this.creditCardReceiptForm.controls.cardAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
        }
      }
      this.renderer.selectRootElement("#cardCCNo").focus();
    }
    if (
      this.receiptModesList?.["BTN_ADVANCE"] == true &&
      this.selectedTabIndex == 2
    ) {
      if (data != null && data != undefined) {
        this.advanceReceiptForm.controls.paymentsAdvance.setValue(
          data["RECEIPT_MODE"].toString()
        );
        this.advanceReceiptForm.controls.advanceYear.setValue(
          this.comFunc.emptyToZero(data["FYEARCODE"].toString())
        );
        this.advanceReceiptForm.controls.advanceBranch.setValue(
          data["REC_BRANCHCODE"].toString()
        );

        this.advanceReceiptForm.controls.advanceRecNo.setValue(
          this.comFunc.emptyToZero(data["ARECVOCNO"].toString())
        );

        this.advanceReceiptForm.controls.advanceAmount.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"].toString())
          )
        );

        this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
          data["IGST_AMOUNTFC"]
        );
        this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
          data["IGST_AMOUNTCC"]
        );
      } else {
        this.advanceReceiptForm.controls.advanceVatAmountFC.setValue(
          this.zeroAmtVal
        );
        this.advanceReceiptForm.controls.advanceVatAmountLC.setValue(
          this.zeroAmtVal
        );
      }

      this.renderer.selectRootElement("#advanceRecNo").focus();
    }
    if (
      this.receiptModesList?.["BTN_OTHERS"] == true &&
      this.selectedTabIndex == 3
    ) {
      if (data != null && data != undefined) {
        this.othersReceiptForm.controls.paymentsOthers.setValue(
          data["RECEIPT_MODE"].toString()
        );
        this.othersReceiptForm.controls.othersAmtFC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"]).toString()
          )
        );
      } else {
        if (this.balanceAmount != null) {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
        } else {
          this.othersReceiptForm.controls.othersAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
        }
      }
    }

    if (
      this.receiptModesList?.["BTN_GIFT"] == true &&
      this.selectedTabIndex == 4
    ) {
      if (data != null && data != undefined) {
        this.giftReceiptForm.controls.paymentsCreditGIftVoc.setValue(
          this.comFunc.emptyToZero(data?.RECEIPT_MODE).toString()
        );

        this.advanceReceiptForm.controls.giftBranch.setValue(
          data["REC_BRANCHCODE"].toString()
        );

        this.advanceReceiptForm.controls.advanceRecNo.setValue(
          this.comFunc.emptyToZero(data["ARECVOCNO"].toString())
        );

        this.giftReceiptForm.controls.giftAmtFC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"]).toString()
          )
        );
      }
    }
    if (
      this.receiptModesList?.["BTN_CUSTOMER"] == true &&
      this.selectedTabIndex == 5
    ) {
      if (data != null && data != undefined) {
        this.customerReceiptForm.controls.customAcCodeList.setValue(
          data["RECEIPT_MODE"].toString()
        );
        this.customerReceiptForm.controls.customerAmtFC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_FC"]).toString()
          )
        );
        this.customerReceiptForm.controls.customerAmtLC.setValue(
          this.comFunc.transformDecimalVB(
            this.comFunc.allbranchMaster?.BAMTDECIMALS,
            this.comFunc.emptyToZero(data["AMOUNT_CC"]).toString()
          )
        );
      } else {
        if (this.balanceAmount != null) {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc.emptyToZero(this.balanceAmount).toString()
            )
          );
        } else {
          this.customerReceiptForm.controls.customerAmtFC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
          this.customerReceiptForm.controls.customerAmtLC.setValue(
            this.comFunc.transformDecimalVB(
              this.comFunc.allbranchMaster?.BAMTDECIMALS,
              this.comFunc
                .emptyToZero(this.order_items_total_net_amount)
                .toString()
            )
          );
        }
      }
    }
  }
}
