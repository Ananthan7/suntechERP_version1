import { Component, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
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
  
  @Input() cashreceiptForm: any;
  @Input() advanceReceiptForm: any;
  @Input() creditCardReceiptForm: any;
  @Input() customerReceiptForm: any;
  @Input() giftReceiptForm: any;
  @Input() othersReceiptForm: any;
  @Input() vocDataForm: any;

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
    const res = this.validateReceipt();

    this.addPosComponent.addReceiptFormValidation();

    if (this.selectedTabIndex == 2 && this.isInvalidRecNo) {
      this.snackBar.open('Invalid Receipt No.', 'OK', {
        duration: 2000
      });
    } else if (this.selectedTabIndex == 4 && this.isInvalidGIftVocNo) {
      this.snackBar.open('Invalid Gift Voc No.', 'OK', {
        duration: 2000
      });
    } else {
      this.isInvalidRecNo = false;
    }

    if (!res) {
      // if (parseFloat(this.cashreceiptForm.value.receiptAmtFC) > 0) {

      var RECEIPT_MODE,
        ARECVOCNO,
        AMOUNT_FC,
        AMOUNT_CC,
        ARECMID,
        CARD_NO,
        IGST_PER,
        HSN_CODE,
        GST_CODE,
        IGST_ACCODE,
        IGST_AMOUNTFC,
        IGST_AMOUNTCC,
        REC_BRANCHCODE = '',
        FYEARCODE = '';

      if (this.selectedTabIndex == 0) {
        RECEIPT_MODE = this.cashreceiptForm.value.paymentsCash.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.cashreceiptForm.value.cashAmtLC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      } else if (this.selectedTabIndex == 1) {
        RECEIPT_MODE = this.creditCardReceiptForm.value.paymentsCreditCard.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.creditCardReceiptForm.value.cardAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = (this.creditCardReceiptForm.value.cardCCNo).toString();

        ARECMID = -1;
      } else if (this.selectedTabIndex == 2) {
        RECEIPT_MODE = this.advanceReceiptForm.value.paymentsAdvance.toString();
        ARECVOCNO = this.advanceReceiptForm.value.advanceRecNo;
        AMOUNT_FC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceAmount), this.vocDataForm.value.txtCurRate);
        IGST_PER = this.advanceReceiptDetails['IGST_PER'];
        HSN_CODE = this.advanceReceiptDetails['HSN_CODE'];
        GST_CODE = this.advanceReceiptDetails['DT_GST_CODE'];
        IGST_ACCODE = this.advanceReceiptDetails['IGST_ACCODE'];
        IGST_AMOUNTFC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountFC);
        IGST_AMOUNTCC = this.comFunc.emptyToZero(this.advanceReceiptForm.value.advanceVatAmountLC);
        // IGST_AMOUNTCC = baseCtrl.FCToCC(
        //     baseCtrl.compCurrency, this.comFunc.emptyToZero(receiptAmtLC.text));
        CARD_NO = '0';
        REC_BRANCHCODE = this.advanceReceiptForm.value.advanceBranch;
        FYEARCODE = this.advanceReceiptForm.value.advanceYear;
        ARECMID = this.advanceReceiptDetails['MID'];
      } else if (this.selectedTabIndex == 3) {
        RECEIPT_MODE = this.othersReceiptForm.value.paymentsOthers.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.othersReceiptForm.value.othersAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      } else if (this.selectedTabIndex == 4) {
        RECEIPT_MODE = this.giftReceiptForm.value.paymentsCreditGIftVoc.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.giftReceiptForm.value.giftAmtFC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';
        ARECMID = -1;

      } else if (this.selectedTabIndex == 5) {
        RECEIPT_MODE = this.customerReceiptForm.value.customAcCodeList.toString();
        ARECVOCNO = '';
        AMOUNT_FC = this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtFC);
        AMOUNT_CC = this.comFunc.FCToCC(
          this.vocDataForm.value.txtCurrency,
          this.comFunc.emptyToZero(this.customerReceiptForm.value.customerAmtLC), this.vocDataForm.value.txtCurRate);
        IGST_PER = 0;
        HSN_CODE = '0';
        GST_CODE = '0';
        IGST_ACCODE = "0";
        IGST_AMOUNTFC = 0;
        IGST_AMOUNTCC = 0;
        CARD_NO = '0';

        ARECMID = -1;
      }

      this.receiptDetailsList?.forEach((e: any, i: any) => {
        e.SRNO = i + 1;
      });
      let itemsLengths: any = this.receiptDetailsList[this.receiptDetailsList.length - 1];
      let receiptSrNO;

      if (
        this.receiptEditId == '' ||
        this.receiptEditId == undefined ||
        this.receiptEditId == null
      ) {
        if (itemsLengths == undefined) itemsLengths = 1;
        else {
          itemsLengths = parseInt(itemsLengths.SRNO) + 1;
        }
        receiptSrNO = itemsLengths;
      } else {
        itemsLengths = this.receiptEditId;
        receiptSrNO = itemsLengths;
      }

      AMOUNT_FC = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        AMOUNT_FC
      )
      AMOUNT_CC = this.comFunc.transformDecimalVB(
        this.comFunc.allbranchMaster?.BAMTDECIMALS,
        AMOUNT_CC
      )
      var receiptDetails = {
        "SRNO": receiptSrNO,
        "REFMID": this.retailSalesMID || receiptSrNO,
        "VOCTYPE": this.vocType,
        "VOCNO": this.retailSaleDataVocNo ?? receiptSrNO,
        "VOCDATE": new Date().toISOString(),
        "BRANCH_CODE": this.strBranchcode,
        "REC_BRANCHCODE": REC_BRANCHCODE,
        "YEARMONTH": this.comFunc.yearSelected,
        "RECEIPT_MODE": RECEIPT_MODE,
        "CURRENCY_CODE": this.comFunc.compCurrency,
        // "CURRENCY_RATE": this.comFunc.currencyRate ?? '1',
        "CURRENCY_RATE": '1',
        "AMOUNT_FC": AMOUNT_FC,
        "AMOUNT_CC": AMOUNT_CC,
        "DESCRIPTION": "",
        "FYEARCODE": this.comFunc.yearSelected,
        // "FYEARCODE": "2023",

        "ARECVOCNO": ARECVOCNO,
        // "ARECVOCNO": advanceRecNo.text,
        "ARECVOCTYPE": "pcr", //doubt
        "ARECMID": ARECMID,
        "LOCKED": false,
        "RDMLOYALTY": "0",
        "VATCODE": "",
        "VATPER": "0.00",
        "VATAMTLC": "0.000",
        "VATAMTFC": "0.000",
        "TOTAMTWITHOUTVATLC": AMOUNT_CC,
        "TOTAMTWITHOUTVATFC": AMOUNT_FC,
        "CCAPPROVALCODE": "",
        "GIFT_CARDNO": "",
        "OT_TRANSFER_TIME": "",
        "CARD_NO": CARD_NO,
        "CARD_HOLDER": "0",
        "CARD_VALID": "0",
        "CREDITDAYS": "0",
        "VALUE_DATE": new Date().toISOString(),
        "SGST_ACCODE": "0",
        "IGST_ACCODE": IGST_ACCODE ?? "0",
        "CGST_CTRLACCODE": "0",
        "SGST_CTRLACCODE": "0",
        "IGST_CTRLACCODE": "0",
        "CGST_PER": "0.00",
        "CGST_AMOUNTFC": "0.000",
        "CGST_AMOUNTCC": "0.000",
        "SGST_PER": "0.00",
        "SGST_AMOUNTFC": "0.000",
        "SGST_AMOUNTCC": "0.000",
        "IGST_PER": IGST_PER ?? "0.00",
        "IGST_AMOUNTFC": IGST_AMOUNTFC ?? "0.000",
        "IGST_AMOUNTCC": IGST_AMOUNTCC ?? "0.000",
        "HSN_CODE": HSN_CODE ?? "0",
        "GST_CODE": GST_CODE ?? "0",
        "CGST_ACCODE": "0",
        "REC_COMM_AMOUNTFC": "0",
        "REC_COMM_AMOUNTCC": "0",
        "POS_CREDIT_ACCODE": "0",
        "POS_CREDIT_ACNAME": "0",
        "DT_YEARMONTH": this.comFunc.yearSelected,
        // "DT_YEARMONTH": "2022",
        "RECEIPT_TYPE": "0",
        "GIFT_CARD_BRANCH": "0",
        "WOOCOMCARDID": "0",

        // new fields added 27-12-2023
        "NEWUNIQUEID": 0,

      };


      if (
        this.receiptEditId == '' ||
        this.receiptEditId == undefined ||
        this.receiptEditId == null
      ) {
        this.receiptDetailsList.push(receiptDetails);
      } else {
        const preitemIndex = this.receiptDetailsList.findIndex((data: any) => {
          console.table(data.SRNO == this.receiptEditId);
          return data.SRNO.toString() == this.receiptEditId.toString();
        });
        if (preitemIndex != -1) {
          receiptDetails.SRNO = this.receiptEditId;
          this.receiptDetailsList[preitemIndex] = receiptDetails;
        }
        this.receiptDetailsList[this.receiptEditId - 1] = receiptDetails;
        this.receiptEditId = '';
      }


      // this.sumReceiptItem();
      this.addPosComponent.sumTotalValues();

      if (type == 'Continue') {
        this.setTabByIndex(this.selectedTabIndex, null);
        // recpCtrl.receiptItems = receiptDetails;
        // recpCtrl.receiptItemsChanged.value = !recpCtrl.receiptItemsChanged.value;

        // //  recpCtrl.receiptTotalNetAmt;
        // // recpCtrl.balanceAmount;
        // if (recpCtrl.balanceAmount == null) {
        //   netTotalAmount = recpCtrl.receiptTotalNetAmt.toString();
        //   receiptAmtFC.text = recpCtrl.receiptTotalNetAmt.toString();
        //   receiptAmtLC.text = recpCtrl.receiptTotalNetAmt.toString();
        // } else {
        //   netTotalAmount = recpCtrl.balanceAmount.toString();
        //   receiptAmtFC.text = recpCtrl.balanceAmount.toString();
        //   receiptAmtLC.text = recpCtrl.balanceAmount.toString();
        // }
      } else {
        this.modalReference.close();
      }
      this.selectedTabIndex = 0;
      // } else {
      //   this.snackBar.open('Please Fill Valid Amount');
      // }
      console.log('receipt detail', this.receiptDetailsList);
    } else {
      this.snackBar.open('Please Fill All Fields', 'OK');
    }

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
