import { Component, Input, OnInit } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { ToastrService } from "ngx-toastr";
import * as _moment from 'moment';
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
@Component({
  selector: 'app-gold-exchange-details',
  templateUrl: './gold-exchange-details.component.html',
  styleUrls: ['./gold-exchange-details.component.scss']
})
export class GoldExchangeDetailsComponent implements OnInit {
  @Input() content!: any;
  @Input() exchangeDetails!: any;
  @Input() queryParams!: any;
  @Input() partyCurrencyParam!: any;
  karatDetails: any[] = [];
  zeroMQtyVal: any;
  userName = localStorage.getItem('username');
  userbranch = localStorage.getItem('userbranch');
  branchCode?: String;
  yearMonth?: String;
  selected = 'gms';
  partyCurrency="";
  viewOnly: boolean = false;
  standardPurity: any;
  standardPureWeight: any;
  minPurity = 0;
  maxPurity = 0;
  currentPurity = "";
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE ='G' AND STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  outSideGoldCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 30,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Outside Gold',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  SupplierData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "Supplier",
    SEARCH_VALUE: "",
    WHERECONDITION: "BRANCH_CODE = '" + this.userbranch + "' AND AC_OnHold = 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  locCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 155,
    SEARCH_FIELD: "LOCATION",
    SEARCH_HEADING: "Loc Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "@Strbranch='" + this.userbranch + "',@strUsercode='" + this.userName + "',@stravoidforsales= 0",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };


  goldExchangeDetailsForm: FormGroup = this.formBuilder.group({
    stockCode: [""],
    stockType: [""],
    outsideGold: [false],
    goldType: [""],
    stockCodeDescription: [""],
    supplier: [""],
    locCode: [""],
    fixMetalRate: [''],
    pieces: [""],
    grossWeight: [""],
    stoneWeight: [""],
    purity: [""],
    pureWeight: [""],
    mudWeight: [""],
    netWeight: [""],
    chargableWeight: [""],
    purityDiffer: [""],
    stoneDiffer: [""],
    ozWeight: [""],
    unitCode: ["gms"],
    unitValue: [""],
    unitRate: [""],
    unitAmount: [""],
    stoneRate: [""],
    stoneAmount: [""],
    wastagePercent: [""],
    wastageQuantity: [""],
    wastageAmount: [""],
    bagNo: [""],
    metalRate: [""],
    metalAmount: [""],
    netRate: [""],
    netAmount: [""],
    remarks: [""],
  });
  dialogBox: any;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private comService: CommonServiceService,
    private suntechApi: SuntechAPIService,
    public dialog: MatDialog,
  ) {

    this.zeroMQtyVal = this.comService.transformDecimalVB(
      this.comService.allbranchMaster?.BMQTYDECIMALS,
      0
    );
  }

  ngOnInit(): void {
    this.partyCurrency=this.partyCurrencyParam.partyCurrency;
    this.getQueryParams(this.queryParams);
    this.getKaratDetails();



    if (this.exchangeDetails && Object.keys(this.exchangeDetails).length > 0)

      this.setExchangeDetails();

  }

  stockCodeSelected(e: any) {
    console.log(e);
    this.goldExchangeDetailsForm.controls.stockCode.setValue(e.DIVISION_CODE);
    this.goldExchangeDetailsForm.controls.stockType.setValue(e.STOCK_CODE);
    this.goldExchangeDetailsForm.controls.stockCodeDescription.setValue(e.DESCRIPTION);

    this.getExchangeStockCodes(e.STOCK_CODE);
  }

  getExchangeStockCodes(stockCode: string) {

    let param = {
      BRANCH_CODE: this.comService.branchCode,
      STOCK_CODE: stockCode,

    }

    // let API = `RetailsalesExchangeLookup?BRANCH_CODE=${this.comService.branchCode}&STOCK_CODE=${stockCode}`

    // this.suntechApi
    //   .getDynamicAPIwithParamsBranch(API)
    let sub: Subscription = this.suntechApi.getDynamicAPIwithParamsBranch('RetailsalesExchangeLookup',param)
      .subscribe((resp) => {

        let _data = resp.response[0];

        this.standardPurity = _data.PURITY;
        this.minPurity = _data.PURITY_FROM;
        this.maxPurity = _data.PURITY_TO;

        const metalRate = this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.findKaratRate(_data.KARAT_CODE)), 'RATE');

          this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency,
            this.comService.emptyToZero(metalRate),), 'RATE'
          ));


        // this.goldExchangeDetailsForm.controls.metalRate.setValue(metalRate);

        localStorage.setItem('defaultMetalRate', metalRate);

        this.goldExchangeDetailsForm.controls.purity.setValue(this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(_data.PURITY), 'RATE'));





      });
  }

  updateStoneDiffrence() {
    const stoneDiffrence = ((this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight) -
      (this.comService.emptyToZero(this.goldExchangeDetailsForm.value.stoneWeight))
      -
      this.comService.emptyToZero(this.goldExchangeDetailsForm.value.chargableWeight)
    )) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.purity)


    this.goldExchangeDetailsForm.controls.stoneDiffer.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
      stoneDiffrence), 'METAL'),);


  }


  changeStandardPurity(event: any) {

    // const currentPurity=this.goldExchangeDetailsForm.value.purity;
    if (this.comService.emptyToZero(event.target.value) > this.comService.emptyToZero(this.maxPurity)) {



      const baseMessage = "Mud Wt should not be greater than Gross Wt";
      this.openDialog(
        'Warning',
        `${baseMessage}`,
        true
      );

      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.goldExchangeDetailsForm.controls.purity.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            this.standardPurity), 'PURITY'),);

          this.goldExchangeDetailsForm.controls.pureWeight.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            this.standardPureWeight), 'METAL'),);
          this.updateStonePurityDiffrences();

        }

      });
    }
    else if (this.comService.emptyToZero(event.target.value) < this.comService.emptyToZero(this.minPurity)) {

      const baseMessage = "Mud Wt should not be greater than Gross Wt";
      this.openDialog(
        'Warning',
        `${baseMessage}`,
        true
      );

      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.goldExchangeDetailsForm.controls.purity.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            this.standardPurity), 'PURITY'),);

          this.goldExchangeDetailsForm.controls.pureWeight.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            this.standardPureWeight), 'METAL'),);
          this.updateStonePurityDiffrences();
        }

      });
    }

    else {
      this.goldExchangeDetailsForm.controls.pureWeight.setValue(
        this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.goldExchangeDetailsForm.value.purity * this.goldExchangeDetailsForm.value.grossWeight), 'METAL'));

      this.updateStonePurityDiffrences();

    }


  }

  updateStonePurityDiffrences() {

    const changedPurity = this.comService.emptyToZero(this.standardPureWeight) - this.comService.emptyToZero(this.goldExchangeDetailsForm.value.pureWeight);
    this.goldExchangeDetailsForm.controls.purityDiffer.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
      changedPurity), 'METAL'));

    this.updateStoneDiffrence();

    // console.log(changedPurity)





  }

  changeStoneweight(event: any) {
    console.log(event.target.value);

    this.updateStoneDiffrence();
  }

  changeGrossweight(event: any) {
    console.log(event.target.value);

    const metalRate = this.goldExchangeDetailsForm.value.metalRate;
    const grossWt = this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(event.target.value), 'METAL')
    const pureWt = this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(this.goldExchangeDetailsForm.value.purity * event.target.value), 'METAL');
    const mudWeight = this.goldExchangeDetailsForm.value.mudWeight;

    if (mudWeight > grossWt) {
      

      this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
        this.zeroMQtyVal), 'AMOUNT'));

    }
    const ozWeight = this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(pureWt || 0) /
      31.1035, 'AMOUNT'
    )

    const metalAmount = this.comService.decimalQuantityFormat(
      this.comService.emptyToZero((grossWt - this.comService.emptyToZero(this.goldExchangeDetailsForm.value.mudWeight)) * metalRate), 'AMOUNT')





    this.goldExchangeDetailsForm.controls.chargableWeight.setValue(grossWt);

    this.goldExchangeDetailsForm.controls.netWeight.setValue(grossWt);

    this.goldExchangeDetailsForm.controls.pureWeight.setValue(pureWt);

    this.standardPureWeight = pureWt;

    this.goldExchangeDetailsForm.controls.ozWeight.setValue(this.comService.decimalQuantityFormat(
      this.comService.emptyToZero(
        ozWeight), 'AMOUNT'));

        this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.CCToFC(this.partyCurrency, metalAmount));


    // this.goldExchangeDetailsForm.controls.metalAmount.setValue(
    //   metalAmount);

    this.updateNetTotal();
    this.updateStoneDiffrence();

  }

  changeMakingRate(event: any) {
    console.log(event.target.value);


    this.goldExchangeDetailsForm.controls.unitAmount.setValue(this.comService.emptyToZero(
      event.target.value * this.goldExchangeDetailsForm.value.grossWeight));
    this.updateNetTotal();
  }

  changeMakingAmount(event: any) {
    console.log(event.target.value);

    this.goldExchangeDetailsForm.controls.unitRate.setValue(this.comService.emptyToZero(
      event.target.value / this.goldExchangeDetailsForm.value.grossWeight));
    this.updateNetTotal();
  }

  changeStoneRate(event: any) {
    console.log(event.target.value);


    this.goldExchangeDetailsForm.controls.stoneAmount.setValue(this.comService.emptyToZero(
      event.target.value * this.goldExchangeDetailsForm.value.grossWeight));
    this.updateNetTotal();
  }

  changeStoneAmount(event: any) {
    console.log(event.target.value);

    this.goldExchangeDetailsForm.controls.stoneRate.setValue(this.comService.emptyToZero(
      event.target.value / this.goldExchangeDetailsForm.value.grossWeight));
    this.updateNetTotal();
  }

  changeMetalRate(event: any) {
    console.log(event.target.value);
    this.checkMetalRateLimit(event.target.value, 'RATE', event.target.value);

    // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.emptyToZero(
    //   event.target.value * this.goldExchangeDetailsForm.value.grossWeight));

    this.updateNetTotal();
  }

  changeMetalAmount(event: any) {
    console.log(event.target.value);
    this.checkMetalRateLimit(event.target.value, 'AMOUNT', event.target.value);



    this.updateNetTotal();
  }


  changeMudWeight(event: any) {
    console.log(event.target.value);
    if (this.comService.emptyToZero(event.target.value) > this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight)) {

      const baseMessage = "Mud Wt should not be greater than Gross Wt";
      this.openDialog(
        'Warning',
        `${baseMessage}`,
        true
      );

      this.dialogBox.afterClosed().subscribe((data: any) => {
        if (data == 'OK') {
          this.goldExchangeDetailsForm.controls.mudWeight.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            this.zeroMQtyVal), 'AMOUNT'),);

            this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalRate)), 'AMOUNT'));


          // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalRate), 'AMOUNT'));
          this.updateNetTotal();
        }

      });

    }
    else {
      const grosWtWithoutMud = this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight) - this.comService.emptyToZero(this.goldExchangeDetailsForm.value.mudWeight);
     
      this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(grosWtWithoutMud) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalRate)), 'AMOUNT'));

     
      // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(grosWtWithoutMud) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalRate), 'AMOUNT'));

      this.updateNetTotal();
    }




    this.updateNetTotal();
  }

  updateNetTotal() {
    const netTotalAmount = this.comService.emptyToZero(this.goldExchangeDetailsForm.value.unitAmount) + this.comService.emptyToZero(this.goldExchangeDetailsForm.value.stoneAmount) +
      this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalAmount);

      this.goldExchangeDetailsForm.controls.netAmount.setValue(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(
        netTotalAmount)));
      
    // this.goldExchangeDetailsForm.controls.netAmount.setValue(this.comService.emptyToZero(
    //   netTotalAmount));
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(
      DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  checkMetalRateLimit(event: any, object: string, metalRate: any) {
    const defaultMetalRate = localStorage.getItem('defaultMetalRate') || 0;

    if (object == "RATE") {
      if (this.comService.emptyToZero(event) > this.comService.emptyToZero(defaultMetalRate)) {

        const baseMessage = this.comService.getMsgByID('MSG2203');
        this.openDialog(
          'Warning',
          `${baseMessage}: ${defaultMetalRate}`,
          true
        );

        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {
            this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency,
              this.comService.emptyToZero(defaultMetalRate)), 'RATE'));
            
            // this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            //   defaultMetalRate), 'RATE'),);

            this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(
              defaultMetalRate) * this.comService.emptyToZero(
              this.goldExchangeDetailsForm.value.grossWeight)), 'AMOUNT'));
            

            // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
            //   defaultMetalRate) * this.comService.emptyToZero(
            //     this.goldExchangeDetailsForm.value.grossWeight), 'AMOUNT'),);
          }

        });



      }
      else {
        this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(
          metalRate * this.goldExchangeDetailsForm.value.grossWeight)));
        

        // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.emptyToZero(
        //   metalRate * this.goldExchangeDetailsForm.value.grossWeight));
      }

    }

    else if (object == 'AMOUNT') {
      const metalRate = this.comService.emptyToZero(event) /
        this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight)

      if (this.comService.emptyToZero(metalRate) > this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalRate)) {

        const baseMessage = this.comService.getMsgByID('MSG2203');
        this.openDialog(
          'Warning',
          `${baseMessage}: ${this.comService.emptyToZero(
            this.goldExchangeDetailsForm.value.metalRate * this.goldExchangeDetailsForm.value.grossWeight)}`,
          true
        );

        this.dialogBox.afterClosed().subscribe((data: any) => {
          if (data == 'OK') {

            this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.CCToFC(this.partyCurrency, this.comService.emptyToZero(
              this.goldExchangeDetailsForm.value.metalRate) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight)));
            

            // this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.emptyToZero(
            //   this.goldExchangeDetailsForm.value.metalRate) * this.comService.emptyToZero(this.goldExchangeDetailsForm.value.grossWeight));
          }

        });




      }
      else {
        this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.CCToFC(this.partyCurrency,
          this.comService.emptyToZero(this.goldExchangeDetailsForm.value.metalAmount / this.goldExchangeDetailsForm.value.grossWeight)), 'RATE'));

          
        // this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(this.comService.emptyToZero(
        //   this.goldExchangeDetailsForm.value.metalAmount / this.goldExchangeDetailsForm.value.grossWeight), 'RATE'));
      }
    }


  }

  getKaratDetails() {
    this.suntechApi.getDynamicAPIBranch('BranchKaratRate/' + this.comService.branchCode).subscribe((result) => {
      if (result.response) {

        this.karatDetails = result.response;
        const defaultMetalRate = this.comService.decimalQuantityFormat(
          this.comService.emptyToZero(this.findKaratRate('24')), 'RATE');

          this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.CCToFC(this.partyCurrency, defaultMetalRate));


        // this.goldExchangeDetailsForm.controls.metalRate.setValue(defaultMetalRate);
        console.log(this.karatDetails);
      }
    });
  }

  findKaratRate(karatCode: string): number | undefined {
    const karatDetail = this.karatDetails.find(detail => detail.KARAT_CODE === karatCode);
    return karatDetail ? karatDetail.KARAT_RATE : undefined;
  }

  outSideGoldSelected(e: any) {
    console.log(e);
    this.goldExchangeDetailsForm.controls.goldType.setValue(e.CODE);

  }

  supplierSelected(e: any) {
    console.log(e);
    this.goldExchangeDetailsForm.controls.supplier.setValue(e.ACCODE);

  }

  locCodeSelected(e: any) {
    console.log(e);
    this.goldExchangeDetailsForm.controls.locCode.setValue(e.Location);
  }

  getQueryParams(gstDetails?: any) {

    this.viewOnly = gstDetails?.isViewOnly ?? false;

  }

  setExchangeDetails() {

    if (this.exchangeDetails != null && this.exchangeDetails != undefined && Object.keys(this.exchangeDetails).length > 0) {


      this.goldExchangeDetailsForm.controls.stockCode.setValue(this.exchangeDetails.DIVISION_CODE);
      this.goldExchangeDetailsForm.controls.stockType.setValue(this.exchangeDetails.STOCK_CODE);
      this.goldExchangeDetailsForm.controls.fixMetalRate.setValue(this.exchangeDetails.CURRENCY_CODE);
      this.goldExchangeDetailsForm.controls.goldType.setValue(this.exchangeDetails.OLD_GOLD_TYPE);
      this.goldExchangeDetailsForm.controls.stockCodeDescription.setValue(this.exchangeDetails.STOCK_DOCDESC);
      this.goldExchangeDetailsForm.controls.locCode.setValue(this.exchangeDetails.LOCTYPE_CODE);

      this.goldExchangeDetailsForm.controls.pieces.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.PCS), 'METAL'));
      this.goldExchangeDetailsForm.controls.grossWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.GROSSWT), 'METAL'));
      this.goldExchangeDetailsForm.controls.stoneWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.STONEWT), 'METAL'));
      this.goldExchangeDetailsForm.controls.purity.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.PURITY), 'PURITY'));
      this.goldExchangeDetailsForm.controls.pureWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.PUREWT), 'METAL'));

      this.goldExchangeDetailsForm.controls.mudWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.MUD_WT), 'METAL'));
      this.goldExchangeDetailsForm.controls.netWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.NETWT), 'METAL'));
      this.goldExchangeDetailsForm.controls.chargableWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.CHARGABLEWT), 'METAL'));
      this.goldExchangeDetailsForm.controls.purityDiffer.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.PUDIFF), 'METAL'));
      this.goldExchangeDetailsForm.controls.stoneDiffer.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.STONEDIFF), 'METAL'));
      this.goldExchangeDetailsForm.controls.ozWeight.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.OZWT), 'AMOUNT'));


      this.goldExchangeDetailsForm.controls.unitValue.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.MKG_RATEFC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.unitRate.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.MKGVALUEFC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.unitAmount.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.MKGVALUECC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.stoneRate.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.STONEVALUEFC), 'AMOUNT'));

      this.goldExchangeDetailsForm.controls.stoneAmount.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.STONEVALUECC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.wastagePercent.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.WASTAGEPER), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.wastageQuantity.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.WASTAGEQTY), 'METAL'));
      this.goldExchangeDetailsForm.controls.wastageAmount.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.WASTAGEAMOUNTFC), 'AMOUNT'));

      this.goldExchangeDetailsForm.controls.metalRate.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.METALVALUEFC), 'RATE'));
      this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.METALVALUECC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.netRate.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.NETVALUEFC), 'AMOUNT'));
      this.goldExchangeDetailsForm.controls.netAmount.setValue(this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(this.exchangeDetails.NETVALUECC), 'AMOUNT'));

      this.goldExchangeDetailsForm.controls.remarks.setValue(this.exchangeDetails.D_REMARKS);
      this.goldExchangeDetailsForm.controls.bagNo.setValue(this.exchangeDetails.BAGNO);


      // if (this.exchangeDetails.CARD_EXPIRY) {
      //   let date=this.setDateFormFields(this.exchangeDetails.CARD_EXPIRY, 'MM/DD/YYYY h:mm:ss A', 'MM/YYYY')
      //   this.goldExchangeDetailsForm.controls.creditCardDate.setValue(date)
      // }

      // if (this.exchangeDetails.INVOICE_DATE) {

      //   let date = this.setDateFormFields(this.exchangeDetails.INVOICE_DATE, 'DD/MM/YYYY h:mm:ss A', 'DD/MM/YYYY');

      //   this.goldExchangeDetailsForm.controls.invoiceDate.setValue(date)
      // }

      // if (this.exchangeDetails.INVOICE_DATE) {
      //   let date = this.setDateFormFields(this.exchangeDetails.CHEQUE_DATE, 'DD/MM/YYYY h:mm:ss A', 'DD/MM/YYYY');

      //   this.goldExchangeDetailsForm.controls.chequeDate.setValue(date)
      // }
    }


  }

  setDateFormFields(dateString: string, inputFormat: string, outputFormat: string) {
    let date = _moment(dateString, inputFormat);
    let formattedDate = date.format(outputFormat);
    let finalDate = _moment(formattedDate, outputFormat);
    return finalDate;
  }


  setFormValues() {
    console.log('this.content', this.content);
    if (!this.content) return
    this.goldExchangeDetailsForm.controls.stockType.setValue(this.content.DIVISION_CODE);
    this.goldExchangeDetailsForm.controls.stockCode.setValue(this.content.STOCK_CODE);
    this.goldExchangeDetailsForm.controls.pieces.setValue(this.content.PCS);
    this.goldExchangeDetailsForm.controls.grossWeight.setValue(this.content.GROSSWT);
    this.goldExchangeDetailsForm.controls.stoneWeight.setValue(this.content.STONEWT);
    this.goldExchangeDetailsForm.controls.netWeight.setValue(this.content.NETWT);
    this.goldExchangeDetailsForm.controls.purity.setValue(this.content.PURITY);
    this.goldExchangeDetailsForm.controls.pureWeight.setValue(this.content.PUREWT);
    this.goldExchangeDetailsForm.controls.chargableWeight.setValue(this.content.CHARGABLEWT);
    this.goldExchangeDetailsForm.controls.unitRate.setValue(this.content.MKGVALUEFC);
    this.goldExchangeDetailsForm.controls.unitAmount.setValue(this.content.MKGVALUECC);
    this.goldExchangeDetailsForm.controls.metalRate.setValue(this.content.METALVALUEFC);
    this.goldExchangeDetailsForm.controls.metalAmount.setValue(this.content.METALVALUECC);
    this.goldExchangeDetailsForm.controls.stoneRate.setValue(this.content.STONEVALUEFC);
    this.goldExchangeDetailsForm.controls.stoneAmount.setValue(this.content.STONEVALUECC);
    this.goldExchangeDetailsForm.controls.netRate.setValue(this.content.NETVALUEFC);
    this.goldExchangeDetailsForm.controls.netAmount.setValue(this.content.NETVALUECC);
    this.goldExchangeDetailsForm.controls.purityDiffer.setValue(this.content.PUDIFF);
    this.goldExchangeDetailsForm.controls.stoneDiffer.setValue(this.content.STONEDIFF);
    this.goldExchangeDetailsForm.controls.locCode.setValue(this.content.LOCTYPE_CODE);
    this.goldExchangeDetailsForm.controls.ozWeight.setValue(this.content.OZWT);
    this.goldExchangeDetailsForm.controls.supplier.setValue(this.content.SUPPLIER);
    this.goldExchangeDetailsForm.controls.stockCodeDescription.setValue(this.content.STOCK_DOCDESC);
    this.goldExchangeDetailsForm.controls.wastagePercent.setValue(this.content.WASTAGEPER);
    this.goldExchangeDetailsForm.controls.wastageQuantity.setValue(this.content.WASTAGEQTY);
    this.goldExchangeDetailsForm.controls.wastageAmount.setValue(this.content.WASTAGEAMOUNTFC);
    this.goldExchangeDetailsForm.controls.goldType.setValue(this.content.OLD_GOLD_TYPE);
    this.goldExchangeDetailsForm.controls.outsideGold.setValue(this.content.OUTSIDEGOLD);
    this.goldExchangeDetailsForm.controls.jawaharaSelect.setValue(this.content.JAWAHARAYN);
    this.goldExchangeDetailsForm.controls.reSaleCycleSelect.setValue(this.content.RESALERECYCLE);
    this.goldExchangeDetailsForm.controls.cashExchangeSelect.setValue(this.content.CASHEXCHANGE);
    this.goldExchangeDetailsForm.controls.remarks.setValue(this.content.D_REMARKS);
  }

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      // this.update()
      return
    }
    if (this.goldExchangeDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'MetalTransfer/InsertMetalTransfer'
    let postData = {
      "UNIQUEID": 0,
      "SRNO": this.exchangeDetails?.SRNO || 0,
      "DIVISION_CODE": this.goldExchangeDetailsForm.value.stockCode,
      "STOCK_CODE": this.goldExchangeDetailsForm.value.stockType,
      "PCS": this.goldExchangeDetailsForm.value.pieces,
      "GROSSWT": this.goldExchangeDetailsForm.value.grossWeight,
      "STONEWT": this.goldExchangeDetailsForm.value.stoneWeight,
      "NETWT": this.goldExchangeDetailsForm.value.netWeight,
      "PURITY": this.goldExchangeDetailsForm.value.purity,
      "PUREWT": this.goldExchangeDetailsForm.value.pureWeight,
      "CHARGABLEWT": this.goldExchangeDetailsForm.value.chargableWeight,
      "MKG_RATEFC": this.goldExchangeDetailsForm.value.unitValue,
      "MKG_RATECC": 0,
      "MKGVALUEFC": this.goldExchangeDetailsForm.value.unitRate,
      "MKGVALUECC": this.goldExchangeDetailsForm.value.unitAmount,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "METALVALUEFC": this.goldExchangeDetailsForm.value.metalRate,
      "METALVALUECC": this.goldExchangeDetailsForm.value.metalAmount,
      "STONE_RATEFC": 0,
      "STONE_RATECC": 0,
      "STONEVALUEFC": this.goldExchangeDetailsForm.value.stoneRate,
      "STONEVALUECC": this.goldExchangeDetailsForm.value.stoneAmount,
      "NETVALUEFC": this.goldExchangeDetailsForm.value.netRate,
      "NETVALUECC": this.goldExchangeDetailsForm.value.netAmount,
      "PUDIFF": this.goldExchangeDetailsForm.value.purityDiffer,
      "STONEDIFF": this.goldExchangeDetailsForm.value.stoneDiffer,
      "PONO": 0,
      "LOCTYPE_CODE": this.goldExchangeDetailsForm.value.locCode,
      "OZWT": this.goldExchangeDetailsForm.value.ozWeight,
      "SUPPLIER": this.goldExchangeDetailsForm.value.supplier,
      "BATCHSRNO": 0,
      "STOCK_DOCDESC": this.goldExchangeDetailsForm.value.stockCodeDescription,
      "BAGNO": this.goldExchangeDetailsForm.value.bagNo,
      "BAGREMARKS": "",
      "WASTAGEPER": this.goldExchangeDetailsForm.value.wastagePercent,
      "WASTAGEQTY": this.goldExchangeDetailsForm.value.wastageQuantity,
      "WASTAGEAMOUNTFC": this.goldExchangeDetailsForm.value.wastageAmount,
      "WASTAGEAMOUNTCC": 0,
      "MKGMTLNETRATE": 0,
      "MCLENGTH": 0,
      "MCUNIT": 0,
      "SORDER_REF": "",
      "BARCODEDQTY": 0,
      "RUBY_WT": 0,
      "RUBY_RATE": 0,
      "RUBY_AMOUNTFC": 0,
      "RUBY_AMOUNTCC": 0,
      "EMERALD_WT": 0,
      "EMERALD_RATE": 0,
      "EMERALD_AMOUNTFC": 0,
      "EMERALD_AMOUNTCC": 0,
      "SAPPHIRE_WT": 0,
      "SAPPHIRE_RATE": 0,
      "SAPPHIRE_AMOUNTFC": 0,
      "SAPPHIRE_AMOUNTCC": 0,
      "ZIRCON_WT": 0,
      "ZIRCON_RATE": 0,
      "ZIRCON_AMOUNTFC": 0,
      "ZIRCON_AMOUNTCC": 0,
      "COLOR_STONE_WT": 0,
      "COLOR_STONE_RATE": 0,
      "COLOR_STONE_AMOUNTFC": 0,
      "COLOR_STONE_AMOUNTCC": 0,
      "DISCOUNTWT": 0,
      "DISCOUNTPUWT": 0,
      "REPITEMCODE": "",
      "MTL_SIZE": "",
      "MTL_COLOR": "",
      "MTL_DESIGN": "",
      "BARCODE": "",
      "ORDER_STATUS": true,
      "PORDER_REF": "",
      "BARCODEDPCS": 0,
      "SUPPLIERDISC": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "",
      "DT_YEARMONTH": "",
      "BASE_CONV_RATE": 0,
      "WASTAGE_PURITY": 0,
      "PUDIFF_AMTLC": 0,
      "PUDIFF_AMTFC": 0,
      "TAX_AMOUNTFC": 0,
      "TAX_AMOUNTCC": 0,
      "TAX_P": 0,
      "LOT_NO": "",
      "BAR_NO": "",
      "TICKET_NO": "",
      "PENALTY": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTCC": 0,
      "CGST_PER": 0,
      "CGST_AMOUNTFC": 0,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": 0,
      "SGST_AMOUNTFC": 0,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": 0,
      "IGST_AMOUNTFC": 0,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "",
      "SGST_ACCODE": "",
      "IGST_ACCODE": "",
      "UNITWT": 0,
      "CGST_CTRLACCODE": "",
      "SGST_CTRLACCODE": "",
      "IGST_CTRLACCODE": "",
      "HSN_CODE": "",
      "GST_ROUNDOFFFC": 0,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "",
      "OLD_GOLD_TYPE": this.goldExchangeDetailsForm.value.goldType,
      "OUTSIDEGOLD": this.goldExchangeDetailsForm.value.outsideGold,
      "KUNDAN_PCS": 0,
      "KUNDAN_CARAT": 0,
      "KUNDAN_RATEFC": 0,
      "KUNDAN_RATECC": 0,
      "KUNDAN_WEIGHT": 0,
      "KUNDANVALUEFC": 0,
      "KUNDANVALUECC": 0,
      "KUNDAN_UNIT": 0,
      "PREMIUM_CURRENCY": "",
      "PREMIUM_CURR_RATE": 0,
      "PREMIUM_RATE_TYPE": "",
      "PREMIUM_METAL_RATEFC": 0,
      "PREMIUM_METAL_RATECC": 0,
      "PREMIUM_TOTALAMOUNTCC": 0,
      "PREMIUM_TOTALAMOUNTFC": 0,
      "TDS_CODE": "",
      "TDS_PER": 0,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "DECLARATIONNO": "",
      "REEXPORTYN": 0,
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "SILVER_RATE_TYPE": "",
      "SILVER_RATE": 0,
      "SILVER_RATEFC": 0,
      "SILVER_RATECC": 0,
      "SILVER_VALUEFC": 0,
      "SILVER_VALUECC": 0,
      "OZGOLD_PUREWT": 0,
      "OZSILVER_PUREWT": 0,
      "CONV_FACTOR_OZ": 0,
      "PUR_REF": "",
      "BATCHID": 0,
      "STAMPCHARGE_RATEFC": 0,
      "STAMPCHARGE_RATECC": 0,
      "STAMPCHARGE_AMTFC": 0,
      "STAMPCHARGE_AMTCC": 0,
      "STAMPCHARGE": true,
      "ACTUALGROSSWT": 0,
      "ACTUALPURITY": 0,
      "MELTINGLOSS": 0,
      "DRAFTIMPORTFLG": true,
      "FIXMID": 0,
      "FIXVOCTYPE": "",
      "FIXVOCNO": 0,
      "FIXBRANCH": "",
      "FIXYEARMONTH": "",
      "FIXSRNO": 0,
      "FIX_STOCKCODE": "",
      "IMPORT_REF": "",
      "OT_TRANSFER_TIME": "",
      "PRICE1CODE": "",
      "PRICE2CODE": "",
      "PRICE3CODE": "",
      "PRICE4CODE": "",
      "PRICE5CODE": "",
      "PRICE1_VALUECC": 0,
      "PRICE1_VALUEFC": 0,
      "PRICE2_VALUECC": 0,
      "PRICE2_VALUEFC": 0,
      "PRICE3_VALUECC": 0,
      "PRICE3_VALUEFC": 0,
      "PRICE4_VALUECC": 0,
      "PRICE4_VALUEFC": 0,
      "PRICE5_VALUECC": 0,
      "PRICE5_VALUEFC": 0,
      "MKGPREMIUMACCODE": "",
      "DETLINEREMARKS": "",
      "MUD_WT": this.goldExchangeDetailsForm.value.mudWeight,
      "JAWAHARAYN": this.goldExchangeDetailsForm.value.jawaharaSelect,
      "RESALERECYCLE": this.goldExchangeDetailsForm.value.reSaleCycleSelect,
      "CASHEXCHANGE": this.goldExchangeDetailsForm.value.cashExchangeSelect,
      "VATAMOUNTMETALONLYCC": 0,
      "VATAMOUNTMETALONLY": 0,
      "GST_CODE": "",
      "HALLMARKING": "",
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "DISCPER": 0,
      "MARGIN_PER": 0,
      "MARGIN_AMTFC": 0,
      "MARGIN_AMTCC": 0,
      "Picture_Path": "",
      "ORIGINAL_COUNTRY": "",
      "DET_KPNO": "",
      "SERVICE_ACCODE": "",
      "taxcode": "",
      "COLOR": "",
      "CLARITY": "",
      "SIZE": "",
      "SHAPE": "",
      "SIEVE": "",
      "KPNUMBER": "",
      "PURITYMAIN": 0,
      "STONE1": 0,
      "STONE2": 0,
      "STONE3": 0,
      "STONE4": 0,
      "RATI_PER": 0,
      "C1_CATEGORY": "",
      "C2_CATEGORY": "",
      "C3_CATEGORY": "",
      "C4_CATEGORY": "",
      "C5_CATEGORY": "",
      "C6_CATEGORY": "",
      "NEWUNIQUEID": 0,
      "VATCODE": "",
      "HSNCODE": "",
      "VAT_PER": 0,
      "VAT_AMOUNTCC": 0,
      "VAT_AMOUNTFC": 0,
      "TOTALAMOUNTWITHVATCC": 0,
      "TOTALAMOUNTWITHVATFC": 0,
      "DETAILPCS": 0,
      "D_REMARKS": this.goldExchangeDetailsForm.value.remarks,
      "DONE_REEXPORTYN": true,
      "DUSTWT": 0,
      "MDESIGN_CODE": "",
      "SALES_REF": "",
      "SAMEBARCODEPURCHASE": 0,
      "SLIVERPURITYPER": 0
    }
    this.close(postData);
  }

  update() {

    if (this.goldExchangeDetailsForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    const updateApi = 'OldGoldPurchase/UpdateMetalPurchase/' + this.branchCode + '/' + this.content.VOCTYPE + '/' + this.yearMonth
    let postData = {
      "UNIQUEID": 0,
      "SRNO": 0,
      "DIVISION_CODE": this.goldExchangeDetailsForm.value.stockType,
      "STOCK_CODE": this.goldExchangeDetailsForm.value.stockCode,
      "PCS": this.goldExchangeDetailsForm.value.pieces,
      "GROSSWT": this.goldExchangeDetailsForm.value.grossWeight,
      "STONEWT": this.goldExchangeDetailsForm.value.stoneWeight,
      "NETWT": this.goldExchangeDetailsForm.value.netWeight,
      "PURITY": this.goldExchangeDetailsForm.value.purity,
      "PUREWT": this.goldExchangeDetailsForm.value.pureWeight,
      "CHARGABLEWT": this.goldExchangeDetailsForm.value.chargableWeight,
      "MKG_RATEFC": this.goldExchangeDetailsForm.value.unitValue,
      "MKG_RATECC": 0,
      "MKGVALUEFC": this.goldExchangeDetailsForm.value.unitRate,
      "MKGVALUECC": this.goldExchangeDetailsForm.value.unitAmount,
      "RATE_TYPE": "",
      "METAL_RATE": 0,
      "METAL_RATE_GMSFC": 0,
      "METAL_RATE_GMSCC": 0,
      "METALVALUEFC": this.goldExchangeDetailsForm.value.metalRate,
      "METALVALUECC": this.goldExchangeDetailsForm.value.metalAmount,
      "STONE_RATEFC": 0,
      "STONE_RATECC": 0,
      "STONEVALUEFC": this.goldExchangeDetailsForm.value.stoneRate,
      "STONEVALUECC": this.goldExchangeDetailsForm.value.stoneAmount,
      "NETVALUEFC": this.goldExchangeDetailsForm.value.netRate,
      "NETVALUECC": this.goldExchangeDetailsForm.value.netAmount,
      "PUDIFF": this.goldExchangeDetailsForm.value.purityDiffer,
      "STONEDIFF": this.goldExchangeDetailsForm.value.stoneDiffer,
      "PONO": 0,
      "LOCTYPE_CODE": this.goldExchangeDetailsForm.value.locCode,
      "OZWT": this.goldExchangeDetailsForm.value.ozWeight,
      "SUPPLIER": this.goldExchangeDetailsForm.value.supplier,
      "BATCHSRNO": 0,
      "STOCK_DOCDESC": this.goldExchangeDetailsForm.value.stockCodeDescription,
      "BAGNO": "",
      "BAGREMARKS": "",
      "WASTAGEPER": this.goldExchangeDetailsForm.value.wastagePercent,
      "WASTAGEQTY": this.goldExchangeDetailsForm.value.wastageQuantity,
      "WASTAGEAMOUNTFC": this.goldExchangeDetailsForm.value.wastageAmount,
      "WASTAGEAMOUNTCC": 0,
      "MKGMTLNETRATE": 0,
      "MCLENGTH": 0,
      "MCUNIT": 0,
      "SORDER_REF": "",
      "BARCODEDQTY": 0,
      "RUBY_WT": 0,
      "RUBY_RATE": 0,
      "RUBY_AMOUNTFC": 0,
      "RUBY_AMOUNTCC": 0,
      "EMERALD_WT": 0,
      "EMERALD_RATE": 0,
      "EMERALD_AMOUNTFC": 0,
      "EMERALD_AMOUNTCC": 0,
      "SAPPHIRE_WT": 0,
      "SAPPHIRE_RATE": 0,
      "SAPPHIRE_AMOUNTFC": 0,
      "SAPPHIRE_AMOUNTCC": 0,
      "ZIRCON_WT": 0,
      "ZIRCON_RATE": 0,
      "ZIRCON_AMOUNTFC": 0,
      "ZIRCON_AMOUNTCC": 0,
      "COLOR_STONE_WT": 0,
      "COLOR_STONE_RATE": 0,
      "COLOR_STONE_AMOUNTFC": 0,
      "COLOR_STONE_AMOUNTCC": 0,
      "DISCOUNTWT": 0,
      "DISCOUNTPUWT": 0,
      "REPITEMCODE": "",
      "MTL_SIZE": "",
      "MTL_COLOR": "",
      "MTL_DESIGN": "",
      "BARCODE": "",
      "ORDER_STATUS": true,
      "PORDER_REF": "",
      "BARCODEDPCS": 0,
      "SUPPLIERDISC": "",
      "DT_BRANCH_CODE": "",
      "DT_VOCNO": 0,
      "DT_VOCTYPE": "",
      "DT_YEARMONTH": "",
      "BASE_CONV_RATE": 0,
      "WASTAGE_PURITY": 0,
      "PUDIFF_AMTLC": 0,
      "PUDIFF_AMTFC": 0,
      "TAX_AMOUNTFC": 0,
      "TAX_AMOUNTCC": 0,
      "TAX_P": 0,
      "LOT_NO": "",
      "BAR_NO": "",
      "TICKET_NO": "",
      "PENALTY": 0,
      "TOTAL_AMOUNTFC": 0,
      "TOTAL_AMOUNTCC": 0,
      "CGST_PER": 0,
      "CGST_AMOUNTFC": 0,
      "CGST_AMOUNTCC": 0,
      "SGST_PER": 0,
      "SGST_AMOUNTFC": 0,
      "SGST_AMOUNTCC": 0,
      "IGST_PER": 0,
      "IGST_AMOUNTFC": 0,
      "IGST_AMOUNTCC": 0,
      "CGST_ACCODE": "",
      "SGST_ACCODE": "",
      "IGST_ACCODE": "",
      "UNITWT": 0,
      "CGST_CTRLACCODE": "",
      "SGST_CTRLACCODE": "",
      "IGST_CTRLACCODE": "",
      "HSN_CODE": "",
      "GST_ROUNDOFFFC": 0,
      "GST_ROUNDOFFCC": 0,
      "ROUNDOFF_ACCODE": "",
      "OLD_GOLD_TYPE": this.goldExchangeDetailsForm.value.goldType,
      "OUTSIDEGOLD": this.goldExchangeDetailsForm.value.outsideGold,
      "KUNDAN_PCS": 0,
      "KUNDAN_CARAT": 0,
      "KUNDAN_RATEFC": 0,
      "KUNDAN_RATECC": 0,
      "KUNDAN_WEIGHT": 0,
      "KUNDANVALUEFC": 0,
      "KUNDANVALUECC": 0,
      "KUNDAN_UNIT": 0,
      "PREMIUM_CURRENCY": "",
      "PREMIUM_CURR_RATE": 0,
      "PREMIUM_RATE_TYPE": "",
      "PREMIUM_METAL_RATEFC": 0,
      "PREMIUM_METAL_RATECC": 0,
      "PREMIUM_TOTALAMOUNTCC": 0,
      "PREMIUM_TOTALAMOUNTFC": 0,
      "TDS_CODE": "",
      "TDS_PER": 0,
      "TDS_TOTALFC": 0,
      "TDS_TOTALCC": 0,
      "DECLARATIONNO": "",
      "REEXPORTYN": 0,
      "SILVER_PURITY": 0,
      "SILVER_PUREWT": 0,
      "SILVER_RATE_TYPE": "",
      "SILVER_RATE": 0,
      "SILVER_RATEFC": 0,
      "SILVER_RATECC": 0,
      "SILVER_VALUEFC": 0,
      "SILVER_VALUECC": 0,
      "OZGOLD_PUREWT": 0,
      "OZSILVER_PUREWT": 0,
      "CONV_FACTOR_OZ": 0,
      "PUR_REF": "",
      "BATCHID": 0,
      "STAMPCHARGE_RATEFC": 0,
      "STAMPCHARGE_RATECC": 0,
      "STAMPCHARGE_AMTFC": 0,
      "STAMPCHARGE_AMTCC": 0,
      "STAMPCHARGE": true,
      "ACTUALGROSSWT": 0,
      "ACTUALPURITY": 0,
      "MELTINGLOSS": 0,
      "DRAFTIMPORTFLG": true,
      "FIXMID": 0,
      "FIXVOCTYPE": "",
      "FIXVOCNO": 0,
      "FIXBRANCH": "",
      "FIXYEARMONTH": "",
      "FIXSRNO": 0,
      "FIX_STOCKCODE": "",
      "IMPORT_REF": "",
      "OT_TRANSFER_TIME": "",
      "PRICE1CODE": "",
      "PRICE2CODE": "",
      "PRICE3CODE": "",
      "PRICE4CODE": "",
      "PRICE5CODE": "",
      "PRICE1_VALUECC": 0,
      "PRICE1_VALUEFC": 0,
      "PRICE2_VALUECC": 0,
      "PRICE2_VALUEFC": 0,
      "PRICE3_VALUECC": 0,
      "PRICE3_VALUEFC": 0,
      "PRICE4_VALUECC": 0,
      "PRICE4_VALUEFC": 0,
      "PRICE5_VALUECC": 0,
      "PRICE5_VALUEFC": 0,
      "MKGPREMIUMACCODE": "",
      "DETLINEREMARKS": "",
      "MUD_WT": 0,
      "JAWAHARAYN": this.goldExchangeDetailsForm.value.jawaharaSelect,
      "RESALERECYCLE": this.goldExchangeDetailsForm.value.reSaleCycleSelect,
      "CASHEXCHANGE": this.goldExchangeDetailsForm.value.cashExchangeSelect,
      "VATAMOUNTMETALONLYCC": 0,
      "VATAMOUNTMETALONLY": 0,
      "GST_CODE": "",
      "HALLMARKING": "",
      "DISCAMTFC": 0,
      "DISCAMTCC": 0,
      "DISCPER": 0,
      "MARGIN_PER": 0,
      "MARGIN_AMTFC": 0,
      "MARGIN_AMTCC": 0,
      "Picture_Path": "",
      "ORIGINAL_COUNTRY": "",
      "DET_KPNO": "",
      "SERVICE_ACCODE": "",
      "taxcode": "",
      "COLOR": "",
      "CLARITY": "",
      "SIZE": "",
      "SHAPE": "",
      "SIEVE": "",
      "KPNUMBER": "",
      "PURITYMAIN": 0,
      "STONE1": 0,
      "STONE2": 0,
      "STONE3": 0,
      "STONE4": 0,
      "RATI_PER": 0,
      "C1_CATEGORY": "",
      "C2_CATEGORY": "",
      "C3_CATEGORY": "",
      "C4_CATEGORY": "",
      "C5_CATEGORY": "",
      "C6_CATEGORY": "",
      "NEWUNIQUEID": 0,
      "VATCODE": "",
      "HSNCODE": "",
      "VAT_PER": 0,
      "VAT_AMOUNTCC": 0,
      "VAT_AMOUNTFC": 0,
      "TOTALAMOUNTWITHVATCC": 0,
      "TOTALAMOUNTWITHVATFC": 0,
      "DETAILPCS": 0,
      "D_REMARKS": this.goldExchangeDetailsForm.value.remarks,
      "DONE_REEXPORTYN": true,
      "DUSTWT": 0,
      "MDESIGN_CODE": "",
      "SALES_REF": "",
      "SAMEBARCODEPURCHASE": 0,
      "SLIVERPURITYPER": 0
    }
    this.close(postData);
  }

  close(data?: any) {

    if (this.exchangeDetails != null && this.exchangeDetails != undefined && data != null) {
      data!.isUpdate = true;
    }

    this.activeModal.close(data);
  }

}