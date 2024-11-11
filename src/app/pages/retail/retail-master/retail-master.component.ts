import { Component, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Observable, Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterGridComponent } from "src/app/shared/common/master-grid/master-grid.component";
import { PosCustomerMasterMainComponent } from "./pos-customer-master-main/pos-customer-master-main.component";
import { SchemeMasterComponent } from "./scheme-master/scheme-master.component";
import { PosWalkinCustomerComponent } from "./pos-walkin-customer/pos-walkin-customer.component";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { ChartConfiguration, ChartData, ChartType } from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { Colors } from "src/app/layouts/themes/_themeCode";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { FestivalMasterComponent } from "./festival-master/festival-master.component";
import { StoneWeightMasterComponent } from "./stone-weight-master/stone-weight-master.component";



import { PosBranchTargetComponent } from "./pos-branch-target/pos-branch-target.component";
import { BuyBackPolicyComponent } from "./buy-back-policy/buy-back-policy.component";
import { ReversePriceRatioComponent } from "./reverse-price-ratio/reverse-price-ratio.component";
import { AllowanceMasterComponent } from "./allowance-master/allowance-master.component";
import { DeductionMasterComponent } from "./deduction-master/deduction-master.component";
import { WholesaleSalesmanTargetComponent } from "../../general/general-master/wholesale-salesman-target/wholesale-salesman-target.component";
import { FixingCommodityMasterComponent } from "./fixing-commodity-master/fixing-commodity-master.component";
import { JewelleryBrandingComponent } from "./jewellery-branding/jewellery-branding.component";
import { CertificateMasterComponent } from "./certificate-master/certificate-master.component";
import { ZirconMasterComponent } from "./zircon-master/zircon-master.component";
import { ManufacturedItemsComponent } from "./manufactured-items/manufactured-items.component";
import { SubLedgerMasterComponent } from "./sub-ledger-master/sub-ledger-master.component";
import { DepartmentMasterComponent } from "./department-master/department-master.component";
import { LoanSalaryAdvanceMasterComponent } from "./loan-salary-advance-master/loan-salary-advance-master.component";
import { YearlyBudgetPlannerComponent } from "./yearly-budget-planner/yearly-budget-planner.component";
import { TdsMasterComponent } from "./tds-master/tds-master.component";
import { SubledgerPrefixMasterComponent } from "./subledger-prefix-master/subledger-prefix-master.component";
import { KycMasterComponent } from "./kyc-master/kyc-master.component";
import { CurrencyComponent } from "./currency/currency.component";
import { BoxMasterComponent } from "./box-master/box-master.component";
import { CostAndPriceTypesComponent } from "./cost-and-price-types/cost-and-price-types.component";
import { PriceListMasterComponent } from "./price-list-master/price-list-master.component";
import { AdditionalAmountComponent } from "./additional-amount/additional-amount.component";
import { CustomerWiseStonePricingAndLabourChargesComponent } from "./customer-wise-stone-pricing-and-labour-charges/customer-wise-stone-pricing-and-labour-charges.component";
import { ReceiptModesComponent } from "./receipt-modes/receipt-modes.component";
import { DesignMasterComponent } from "./design-master/design-master.component";
import { JewelleryMasterComponent } from "./jewellery-master/jewellery-master.component";
import { SetRefMasterComponent } from "./set-ref-master/set-ref-master.component";
import { ModelMasterComponent } from "./model-master/model-master.component";
import { RefiningChargePostingComponent } from "./refining-charge-posting/refining-charge-posting.component";
import { PosSalespersonTargetComponent } from "./pos-salesperson-target/pos-salesperson-target.component";
import { LoyaltyCardMasterComponent } from "./loyalty-card-master/loyalty-card-master.component";
import { LoyaltyProgramSettingsMasterComponent } from "./loyalty-program-settings-master/loyalty-program-settings-master.component";
import { GeneralDocumentMasterComponent } from "./general-document-master/general-document-master.component";
import { GstMasterComponent } from "./gst-master/gst-master.component";
import { VatMasterComponent } from "./vat-master/vat-master.component";
import { ReorderLevelSetupComponent } from "./reorder-level-setup/reorder-level-setup.component";
import { SalesPersonMasterComponent } from "./sales-person-master/sales-person-master.component";
import { GiftVoucherMasterComponent } from "./gift-voucher-master/gift-voucher-master.component";
import { ServiceMasterComponent } from "./service-master/service-master.component";
import { SetRefMasterRealComponent } from "./set-ref-master-real/set-ref-master-real.component";
import { SupplierQuotaAllocationComponent } from "./supplier-quota-allocation/supplier-quota-allocation.component";
import { SalesCommissionSetupComponent } from "./sales-commission-setup/sales-commission-setup.component";
import { TransactionReferenceMasterComponent } from "./transaction-reference-master/transaction-reference-master.component";
import { SequanceMasterComponent } from "./sequance-master/sequance-master.component";
import { WpsAgentMasterComponent } from "./wps-agent-master/wps-agent-master.component";
import { GratuityMasterComponent } from "./gratuity-master/gratuity-master.component";
import { LeaveSalaryMasterComponent } from "./leave-salary-master/leave-salary-master.component";
import { AirTicketMasterComponent } from "./air-ticket-master/air-ticket-master.component";
import { JobCardComponent } from "./job-card/job-card.component";
import { OvertimeMasterComponent } from "./overtime-master/overtime-master.component";
import { HolidayMasterComponent } from "./holiday-master/holiday-master.component";
import { SalesInvoiceComponent } from "./sales-invoice/sales-invoice.component";
import { ClientAuthorizationComponent } from "./client-authorization/client-authorization.component";
import { MobileAppSettingComponent } from "./mobile-app-setting/mobile-app-setting.component";
import { MobileAppUserComponent } from "./mobile-app-user/mobile-app-user.component";
import { FixedAssetsCategoryMasterComponent } from "./fixed-assets-category-master/fixed-assets-category-master.component";
import { DocumentPrintSetupComponent } from "./document-print-setup/document-print-setup.component";
import { EmailTemplateComponent } from "./email-template/email-template.component";
@Component({
  selector: "app-retail-master",
  templateUrl: "./retail-master.component.html",
  styleUrls: ["./retail-master.component.scss"],
})
export class RetailMasterComponent implements OnInit {
  @ViewChild(MasterGridComponent) masterGridComponent?: MasterGridComponent;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  @ViewChild("userAuthModal")
  public userAuthModal!: NgbModal;
  modalReferenceUserAuth!: NgbModalRef;

  authForm: FormGroup = this.formBuilder.group({
    // username: [localStorage.getItem('username'), Validators.required],
    password: ["", Validators.required],
    // reason: ['', Validators.required],
    reason: [
      "",
      [
        Validators.required,
        this.autoCompleteValidator(() => this.reasonMaster, "CODE"),
      ],
    ],
    description: ["", Validators.required],
  });

  //variables
  reasonMaster: any = [];
  reasonMasterOptions!: Observable<any[]>;
  public colors = Colors;
  menuTitle: string = "";
  apiCtrl: any;
  orderedItems: any[] = [];
  orderedItemsHead: any[] = [];
  tableName: any;
  PERMISSIONS: any;
  componentName: any;
  private componentDbList: any = {};
  componentSelected: any;
  isCustomerDashboard: boolean = false;
  posPlanetIssuing: boolean = false;

  constructor(
    private CommonService: CommonServiceService,
    private dataService: SuntechAPIService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
    private formBuilder: FormBuilder // private ChangeDetector: ChangeDetectorRef, //to detect changes in dom
  ) {
    this.getMasterGridData();
    this.menuTitle = this.CommonService.getModuleName();
    this.componentName = this.CommonService.getFormComponentName();
  }

  ngOnInit(): void {
    this.posPlanetIssuing = this.CommonService.allbranchMaster.POSPLANETISSUING;

    if (
      localStorage.getItem("AddNewFlag") &&
      localStorage.getItem("AddNewFlag") == "1"
    ) {
      this.openModalView("Sale");
      localStorage.removeItem("AddNewFlag");
    }
    this.setBarChartOptions();
    this.getReasonMasters();
  }

  /**USE: to get table data from API */
  getMasterGridData(data?: any) {
    if (data) {
      this.menuTitle = data.MENU_CAPTION_ENG;
      this.PERMISSIONS = data.PERMISSION;
    } else {
      this.menuTitle = this.CommonService.getModuleName();
      this.setDashboardLayout(this.menuTitle);
    }
    this.masterGridComponent?.getMasterGridData(data);
  }

  viewRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = "VIEW";
    this.openModalView(str);
  }
  async editRowDetails(e: any) {
    let str = e.row.data;
    str.FLAG = "EDIT";

    console.log("====================================");
    console.log(this.posPlanetIssuing, str.PLANETRESPONEFLG, str.TRAYN);
    console.log("====================================");
    if (
      this.posPlanetIssuing &&
      str.PLANETRESPONEFLG == "Y" &&
      str.TRAYN == "Y"
    ) {
      let posPlanetFile: any = await this.createPlanetPOSFindFile(str);
      console.log(posPlanetFile);

      if (posPlanetFile.value) {
      } else {
        this.snackBar.open(posPlanetFile.data.message, "OK");
        return;
      }
    }

    let isAuth = await this.openAuthModal();
    if (isAuth) this.openModalView(str);
    else this.snackBar.open("Authentication Failed", "OK");
  }
  async deleteBtnClicked(e: any) {
    console.log(e);
    let str = e.row.data;
    str.FLAG = "DELETE";

    let isAuth = await this.openAuthModal();
    if (isAuth) this.openModalView(str);
    else this.snackBar.open("Authentication Failed", "OK");
    // this.authCheckerComponent?.openAuthModal();
  }
  //  open Jobcard in modal
  openModalView(data?: any) {
    if (data && data == "Sale") {
      this.menuTitle = data;
    }
    let contents: any;
    this.componentDbList = {
      PosCustomerMaster: PosCustomerMasterMainComponent,
      SchemeMasterComponent: SchemeMasterComponent,
      PosWalkinCustomerComponent: PosWalkinCustomerComponent,
      BuyBackPolicyComponent:BuyBackPolicyComponent,
      PosBranchTargetComponent:PosBranchTargetComponent,
      StoneWeightMasterComponent : StoneWeightMasterComponent,
      FestivalMasterComponent : FestivalMasterComponent,
      ReversePriceRatioComponent:ReversePriceRatioComponent,
      AllowanceMasterComponent:AllowanceMasterComponent,
      DeductionMasterComponent : DeductionMasterComponent,
      WholesaleSalesmanTargetComponent:WholesaleSalesmanTargetComponent,
      FixingCommodityMasterComponent:FixingCommodityMasterComponent,
      JewelleryBrandingComponent: JewelleryBrandingComponent,
      CertificateMasterComponent: CertificateMasterComponent,
      ZirconMasterComponent: ZirconMasterComponent,
      ManufacturedItemsComponent:ManufacturedItemsComponent,
      SubLedgerMasterComponent: SubLedgerMasterComponent,
      DepartmentMasterComponent: DepartmentMasterComponent, 
      LoanSalaryAdvanceMasterComponent: LoanSalaryAdvanceMasterComponent,
      YearlyBudgetPlannerComponent: YearlyBudgetPlannerComponent,
      TdsMasterComponent: TdsMasterComponent,
      SubledgerPrefixMasterComponent: SubledgerPrefixMasterComponent,
      KycMasterComponent: KycMasterComponent,
      CurrencyComponent: CurrencyComponent,
      BoxMasterComponent: BoxMasterComponent,
      CostAndPriceTypesComponent: CostAndPriceTypesComponent,
      PricelistMasterComponent: PriceListMasterComponent,
      AdditionalAmountComponent: AdditionalAmountComponent,
      CustomerWiseStonePricingAndLabourChargesComponent: CustomerWiseStonePricingAndLabourChargesComponent,
      ReceiptModesComponent: ReceiptModesComponent,
      DesignMasterComponent: DesignMasterComponent,
      JewelleryMasterComponent: JewelleryMasterComponent,
      SetRefMasterComponent: SetRefMasterComponent,
      ModelMasterComponent: ModelMasterComponent,
      RefiningChargePostingComponent: RefiningChargePostingComponent,
      PosSalespersonTargetComponent: PosSalespersonTargetComponent,
      LoyaltyCardMasterComponent: LoyaltyCardMasterComponent,
      LoyaltyProgramSettingsMasterComponent: LoyaltyProgramSettingsMasterComponent,
      GeneralDocumentMasterComponent: GeneralDocumentMasterComponent,
      GstMasterComponent: GstMasterComponent,
      VatMasterComponent: VatMasterComponent,
      ReorderLevelSetupComponent: ReorderLevelSetupComponent, 
      SalesPersonMasterComponent: SalesPersonMasterComponent,
      GiftVoucherMasterComponent: GiftVoucherMasterComponent,
      ServiceMasterComponent: ServiceMasterComponent,
      SetRefMasterRealComponent: SetRefMasterRealComponent,
      SupplierQuotaAllocationComponent: SupplierQuotaAllocationComponent,
      SalesCommissionSetupComponent: SalesCommissionSetupComponent,
      TransactionReferenceMasterComponent: TransactionReferenceMasterComponent,
      SequanceMasterComponent: SequanceMasterComponent,
      WpsAgentMasterComponent: WpsAgentMasterComponent,
      GratuityMasterComponent: GratuityMasterComponent,
      LeaveSalaryMasterComponent: LeaveSalaryMasterComponent,
      AirTicketMasterComponent: AirTicketMasterComponent,
      JobCardComponent: JobCardComponent,
      OvertimeMasterComponent: OvertimeMasterComponent,
      HolidayMasterComponent: HolidayMasterComponent,
      SalesInvoiceComponent: SalesInvoiceComponent,
      ClientAuthorizationComponent: ClientAuthorizationComponent,
      MobileAppSettingComponent:MobileAppSettingComponent,
      MobileAppUserComponent:MobileAppUserComponent,
      FixedAssetsCategoryMasterComponent: FixedAssetsCategoryMasterComponent,
      DocumentPrintSetupComponent:DocumentPrintSetupComponent,
      EmailTemplateComponent:EmailTemplateComponent,
      // Add components and update in operationals > menu updation grid form component name
    };
    this.componentName = this.CommonService.getFormComponentName();
    if (this.componentDbList[this.componentName]) {
      this.componentSelected = this.componentDbList[this.componentName];
    } else {
      this.CommonService.showSnackBarMsg("Module Not Created");
    }

    const modalRef: NgbModalRef = this.modalService.open(
      this.componentSelected,
      {
        size: "xl",
        backdrop: "static",
        keyboard: false,
        windowClass: "modal-full-width",
      }
    );
    modalRef.result.then(
      (result) => {
        if (result === "reloadMainGrid") {
          this.getMasterGridData({
            HEADER_TABLE: this.CommonService.getqueryParamTable(),
          });
        } else if (result == "OpenModal") {
          this.openModalView();
        }
      },
      (reason) => {
        if (reason === 'reloadMainGrid') {
          this.getMasterGridData({ HEADER_TABLE: this.CommonService.getqueryParamTable() })
        } else if (reason == 'OpenModal') {
          this.openModalView()
        }
        // Handle modal dismissal (if needed)
      }
    );
    modalRef.componentInstance.content = data;
  }

  setChartConfig() {
    const articleSold: any = localStorage.getItem("soldItemDetails");
    const collectionbyRevenue: any = localStorage.getItem("collectionWiseData");
    const outofStock: any = localStorage.getItem("outofStock");
    const divisionWiseData: any = localStorage.getItem("divisionWiseData");
    const salebyCity: any = localStorage.getItem("salesbyCity");
    const customerCount: any = localStorage.getItem("customerCountChart");
    const averageTransaction: any = localStorage.getItem("avgTransaction");
    this.articleSoldDetails = JSON.parse(articleSold);
    this.salesbyDivisionDetails = JSON.parse(divisionWiseData);
    this.avgTransacUnitsData = JSON.parse(averageTransaction);
    this.outofStockDetails = JSON.parse(outofStock);
    this.monthlyCustomerDetails = JSON.parse(customerCount);
    this.salesbyCityDetails = JSON.parse(salebyCity);
    this.collectionByRevenue = JSON.parse(collectionbyRevenue);
  }

  setDashboardLayout(screen: any) {
    localStorage.removeItem("screen");

    if (screen == "Customer Master") {
      this.isCustomerDashboard = true;
      localStorage.setItem("screen", screen);
      this.setChartConfig();
    } else this.isCustomerDashboard = false;
  }

  public collectionByRevenue: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Revenue",
        backgroundColor: "#336699",
      },
    ],
    labels: [],
  };

  public articleSoldDetails: ChartConfiguration["data"] = {
    datasets: [
      {
        data: [],
        label: "Sold Items",
        backgroundColor: "#336699",
      },
    ],
    labels: [],
  };

  public chartPlugins = [DataLabelsPlugin];

  public doughnutChartType: ChartType = "doughnut";
  public lineChartType: ChartType = "line";
  public salesbyDivisionDetails: ChartConfiguration["data"] = {
    datasets: [],
    labels: [],
  };

  public avgTransacUnitsData: ChartConfiguration["data"] = {
    datasets: [],
    labels: [],
  };
  public salesbyCityDetails: ChartData<"doughnut"> = {
    labels: [],
    datasets: [{ data: [] }],
  };
  public outofStockDetails: ChartConfiguration["data"] = {
    datasets: [],
    labels: [],
  };
  public monthlyCustomerDetails: ChartConfiguration["data"] = {
    datasets: [],
    labels: [],
  };

  public filledLineChartOptions: ChartConfiguration["options"];
  public barchartOptions: ChartConfiguration["options"];
  public transactionUnitLineOptions: ChartConfiguration["options"];
  public doughnutChartOptions: ChartConfiguration["options"];
  public commonBarchartOptions: ChartConfiguration["options"];
  public monthlyCustomerOptions: ChartConfiguration["options"];

  public ChartType: ChartType = "bar";
  public barChartType: ChartType = "bar";

  setBarChartOptions() {
    let layoutDataSet = this.getLayoutDataSet("light");

    this.transactionUnitLineOptions = this.createChartOptions(layoutDataSet, {
      curvedLine: true,
    });

    this.filledLineChartOptions = this.createChartOptions(layoutDataSet, {
      curvedLine: true, // Curved lines for filled chart
      fill: true,
      // backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Area fill color with transparency
      // borderColor: 'rgba(255, 99, 132, 1)'         // Line color
    });
    this.barchartOptions = this.createChartOptions(layoutDataSet, {
      curvedLine: false,
      hideXAxisGrid: true,
      lineWidth: 0.3,
    });

    this.doughnutChartOptions = this.createDoughnutChartOptions(layoutDataSet);

    this.monthlyCustomerOptions = this.createChartOptions(layoutDataSet);

    this.commonBarchartOptions = this.createProductChartOptions(layoutDataSet);
  }

  private getLayoutDataSet(theme: "light" | "dark") {
    if (theme === "dark") {
      return {
        gridLineColor: "white",
        LabelColor: "white",
        LegendColor: "white",
      };
    } else {
      return { gridLineColor: "grey", LabelColor: "grey", LegendColor: "grey" };
    }
  }

  private createChartOptions(
    layoutDataSet: any,
    options: any = {}
  ): ChartConfiguration["options"] {
    return {
      responsive: true,
      scales: {
        y: {
          display: true,
          grid: {
            display: true,
            color: layoutDataSet.gridLineColor,
            lineWidth: options.lineWidth || 1,
          },
          ticks: {
            color: layoutDataSet.LabelColor,
            callback: (value: any) => this.formatTickValue(value),
          },
        },
        x: {
          grid: {
            display: !options.hideXAxisGrid,
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          },
        },
      },
      elements: {
        line: {
          tension: options.curvedLine ? 0.5 : 0,
          fill: options.fill || false,
          backgroundColor: options.backgroundColor || undefined,
          borderColor: options.borderColor || undefined,
        },
        point: {
          radius: 4,
        },
      },
      plugins: {
        legend: {
          display: true,
          align: "center",
          position: "bottom",
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 8,
            font: {
              size: 12,
            },
            padding: 5,
          },
        },
        datalabels: {
          color: layoutDataSet.LabelColor,
          anchor: "end",
          align: "end",
          font: {
            size: 10,
          },
          padding: 5,
          formatter: (value: any) => this.formatTickValue(value),
        },
      },
    };
  }

  private createDoughnutChartOptions(
    layoutDataSet: any
  ): ChartConfiguration["options"] {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: layoutDataSet.LabelColor,
            padding: 5,
          },
        },
      },
    };
  }

  private createProductChartOptions(
    layoutDataSet: any
  ): ChartConfiguration["options"] {
    return {
      responsive: true,
      indexAxis: "y",
      scales: {
        y: {
          grid: {
            display: true,
          },
          ticks: {
            color: layoutDataSet.LabelColor,
          },
        },
        x: {
          display: true,
          grid: {
            display: true,
            color: layoutDataSet.gridLineColor,
            lineWidth: 0.3,
          },
          ticks: {
            color: layoutDataSet.LabelColor,
            callback: (value: any) => this.formatTickValue(value),
          },
        },
      },
      elements: {
        point: {
          radius: 2,
        },
      },
      plugins: {
        legend: {
          display: true,
          align: "center",
          position: "bottom",
          labels: {
            color: layoutDataSet.LegendColor,
            boxWidth: 7,
            font: {
              size: 12,
            },
            padding: 5,
          },
        },
        datalabels: {
          display: true,
          color: "black",
          anchor: "end",
          align: "center",
          font: {
            size: 10,
          },
          padding: 5,
          formatter: (value: any) => this.formatTickValue(value),
        },
      },
    };
  }

  private formatTickValue(value: any) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2).replace(/\.0$/, "") + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2).replace(/\.0$/, "") + "K";
    } else if (value < 1 && value > -1) {
      return value.toFixed(4);
    }
    return value;
  }

  openAuthModal() {
    return new Promise((resolve) => {
      this.modalReferenceUserAuth = this.modalService.open(this.userAuthModal, {
        size: "lg",
        backdrop: true,
        keyboard: true,
        // windowClass: "modal-full-width",
      });

      // if (this.modalService.hasOpenModals()) {
      //     this.getReasonMasters();
      // }

      this.modalReferenceUserAuth.result.then(
        (result) => {
          if (result) {
            console.log("Result :", result);
            resolve(true);
          } else {
            resolve(false);
          }
        },
        (reason) => {
          console.log(`Dismissed ${reason}`);
          resolve(false);
        }
      );
    });
  }

  autoCompleteValidator(optionsProvider: any, field: any = null) {
    return (control: AbstractControl) => {
      const options = optionsProvider();
      const inputValue = control.value;
      if (!options || !Array.isArray(options)) {
        return null;
      }
      if (field == null) {
        if (
          control.value &&
          options.length > 0 &&
          !options.includes(control.value)
        ) {
          return { notInOptions: true };
        }
      } else {
        if (
          inputValue &&
          options.length > 0 &&
          !options.some((option) => option[field] === inputValue)
        ) {
          return { notInOptions: true };
        }
      }
      return null;
    };
  }

  private _filterMasters(
    arrName: any,
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || "").toLowerCase();
    return arrName.filter(
      (option: any) =>
        option[optVal1].toLowerCase().includes(filterValue) ||
        option[optVal2].toLowerCase().includes(filterValue)
    );
  }

  getReasonMasters() {
    let API = `GeneralMaster/GetGeneralMasterList/reason%20master`;
    this.dataService.getDynamicAPI(API).subscribe((data) => {
      if (data.status == "Success") {
        this.reasonMaster = data.response;
        this.reasonMasterOptions =
          this.authForm.controls.reason.valueChanges.pipe(
            startWith(""),
            map((value) =>
              this._filterMasters(
                this.reasonMaster,
                value,
                "CODE",
                "DESCRIPTION"
              )
            )
          );
        console.log(this.reasonMasterOptions);
      } else {
        this.reasonMaster = [];
      }
    });
  }

  checkPlanetTag(data: any): Promise<any> {
    const API = `POSPlanetFile/CheckPlanetTag/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.YEARMONTH}/${data.VOCNO}`;

    return new Promise((resolve) => {
      this.dataService.getDynamicAPI(API).subscribe((res: any) => {
        if (res.status === "Success") {
          if (res.planetResponseData.StatusCode === 6) {
            resolve({ value: true, data: res });
          } else {
            resolve({ value: false, data: res });
          }
        } else {
          resolve({ value: false, data: res });
        }
      });
    });
  }

  createPlanetPOSFindFile(data: any) {
    return new Promise((resolve) => {
      this.snackBar.open("loading...");
      const API = `POSPlanetFile/CreatePlanetPOSFindFile/${data.BRANCH_CODE}/${data.VOCTYPE}/${data.YEARMONTH}/${data.VOCNO}`;
      this.dataService.postDynamicAPI(API, {}).subscribe((res: any) => {
        if (res.status == "Success") {
          // const isPlanetTagValid = await this.checkPlanetTag(data);
          this.checkPlanetTag(data).then((isPlanetTagRes) => {
            this.snackBar.dismiss();

            resolve(isPlanetTagRes);
          });
        } else {
          resolve({ value: false, data: res });
        }
      });
    });
  }

  changeReason(e: any) {
    console.log(e);
    const res = this.reasonMaster.filter((data: any) => data.CODE == e.value);
    let description = res.length > 0 ? res[0]["DESCRIPTION"] : "";
    this.authForm.controls.description.setValue(description);
  }

  submitAuth() {
    if (!this.authForm.invalid) {
      let API = "ValidatePassword/ValidateEditDelete";
      const postData = {
        // "Username": this.authForm.value.username,
        Username: localStorage.getItem("username") || "",
        Password: this.authForm.value.password,
      };
      let sub: Subscription = this.dataService
        .postDynamicAPICustom(API, postData)
        .subscribe((resp: any) => {
          if (resp.status == "Success") {
            this.CommonService.EditDetail.REASON = this.authForm.value.reason;
            this.CommonService.EditDetail.DESCRIPTION =
              this.authForm.value.description;
            this.CommonService.EditDetail.PASSWORD =
              this.authForm.value.password;
            this.modalReferenceUserAuth.close(true);
            this.authForm.reset();
            // this.authForm.controls.password.setValue(null);
            // this.authForm.controls.reason.setValue('');
            // this.authForm.controls.description.setValue('');
          } else {
            this.snackBar.open(resp.message, "OK", { duration: 2000 });
          }
        });
    } else {
      this.snackBar.open("Please fill all fields", "OK", { duration: 1000 });
    }
  }
}
