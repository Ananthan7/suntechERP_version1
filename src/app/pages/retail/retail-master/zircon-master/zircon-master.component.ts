import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-zircon-master",
  templateUrl: "./zircon-master.component.html",
  styleUrls: ["./zircon-master.component.scss"],
})
export class ZirconMasterComponent implements OnInit {
  @ViewChild("overlayCostCenter") overlayCostCenter!: MasterSearchComponent;
  @ViewChild("overlayCategory") overlayCategory!: MasterSearchComponent;
  @ViewChild("overlayShape") overlayShape!: MasterSearchComponent;
  @ViewChild("overlayColor") overlayColor!: MasterSearchComponent;
  @ViewChild("overlayVendor") overlayVendor!: MasterSearchComponent;
  @ViewChild("overlayBrand") overlayBrand!: MasterSearchComponent;
  @ViewChild("overlaySubCategory") overlaySubCategory!: MasterSearchComponent;
  @ViewChild("overlaySize") overlaySize!: MasterSearchComponent;
  @ViewChild("overlayType") overlayType!: MasterSearchComponent;
  @ViewChild("overlaySieveSet") overlaySieveSet!: MasterSearchComponent;
  @ViewChild("overlaySieve") overlaySieve!: MasterSearchComponent;

  @ViewChild("overlayPriceOneCode") overlayPriceOneCode!: MasterSearchComponent;
  @ViewChild("overlayPriceTwoCode") overlayPriceTwoCode!: MasterSearchComponent;
  @ViewChild("overlayPriceThreeCode")
  overlayPriceThreeCode!: MasterSearchComponent;
  @ViewChild("overlayPriceFourCode")
  overlayPriceFourCode!: MasterSearchComponent;
  @ViewChild("overlayPriceFiveCode")
  overlayPriceFiveCode!: MasterSearchComponent;

  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  flag: any;
  currentDate: Date = new Date();
  code: any;
  allowZeroPcs: any;
  excludeFromTransferWt: any;
  imageName: any;
  image: File | null = null;
  fetchedPicture: string | null = null;
  branchCode: any;

  costCenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: "COST_CODE",
    SEARCH_HEADING: "COST CENTER CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPE='PRECIOUS STONES' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: "PRICE_CODE",
    SEARCH_HEADING: "PRICE CODE ",
    SEARCH_VALUE: "",
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "CATEGORY CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='CATEGORY MASTER' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  vendorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: "ACCODE",
    SEARCH_HEADING: "VENDOR CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  vendorRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "VENDOR REF",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  shapeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "SHAPE CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='SHAPE MASTER' AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  colorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "COLOR CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='COLOR MASTER AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  subCategoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 31,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "SUB-CATEGORY CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='SUB CATEGORY MASTER' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  brandCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "BRAND CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='BRAND MASTER' AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  sizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "SIZE CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='SIZE MASTER' AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "TYPE CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='TYPE MASTER' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  sieveSetCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "SIEVE SET CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='SIEVE SET MASTER' AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  sieveCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "SIEVE CODE",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='SIEVE MASTER' AND DIV_Z=1",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    public dialog: MatDialog,
    private commonService: CommonServiceService
  ) {}

  zirconMasterMainForm: FormGroup = this.formBuilder.group({
    code: [""],
    costCenter: [""],
    category: [""],
    shape: [""],
    color: [""],
    vendor: [""],
    vendorRef: [""],
    createdOn: [this.currentDate],
    createdBy: [""],
    description: [""],
    brand: [""],
    subCategory: [""],
    size: [""],
    type: [""],
    sieveSet: [""],
    sieve: [""],
    firstTrans: [""],
    lastTrans: [""],
    currencyCode: [""],
    currencyRate: [""],
    weightAvgCostCode: [""],
    weightAvgCostDesc: [""],
    picture: [""],
    allowZeroPcs: [""],
    excludeFromTransferWt: [""],
    priceOneCode: [""],
    priceTwoCode: [""],
    priceThreeCode: [""],
    priceFourCode: [""],
    priceFiveCode: [""],
    priceOnePercent: [""],
    priceTwoPercent: [""],
    priceThreePercent: [""],
    priceFourPercent: [""],
    priceFivePercent: [""],
    priceOneFc: [""],
    priceTwoFc: [""],
    priceThreeFc: [""],
    priceFourFc: [""],
    priceFiveFc: [""],
    priceOneLc: [""],
    priceTwoLc: [""],
    priceThreeLc: [""],
    priceFourLc: [""],
    priceFiveLc: [""],
  });

  ngOnInit(): void {
    this.branchCode = this.commonService.branchCode;

    this.content
      ? (this.flag = this.content!.FLAG)
      : console.log("No Content, Due to you are in ADD");

    this.initialController(this.flag, this.content);
    this.setFlag(this.flag);
  }

  initialController(FLAG: any, DATA: any) {
    if (FLAG === "VIEW") {
      this.ViewController(DATA);
    }
    if (FLAG === "EDIT") {
      this.editController(DATA);
    }

    if (FLAG === "DELETE") {
      this.DeleteController(DATA);
    }
  }

  ViewController(DATA: any) {
    this.code = DATA.STOCK_CODE;
    this.zirconMasterMainForm.controls["code"].setValue(DATA.STOCK_CODE);
    this.zirconMasterMainForm.controls["description"].setValue(
      DATA.STOCK_DESCRIPTION
    );
    this.zirconMasterMainForm.controls["category"].setValue(DATA.CATEGORY_CODE);
    this.zirconMasterMainForm.controls["subCategory"].setValue(
      DATA.SUBCATEGORY_CODE
    );
    this.zirconMasterMainForm.controls["shape"].setValue(DATA.SHAPE);
    this.zirconMasterMainForm.controls["color"].setValue(DATA.COLOR);
    this.zirconMasterMainForm.controls["brand"].setValue(DATA.BRAND_CODE);
    this.zirconMasterMainForm.controls["size"].setValue(DATA.SIZE);
    this.zirconMasterMainForm.controls["type"].setValue(DATA.TYPE_CODE);
    this.zirconMasterMainForm.controls["subCategory"].setValue(
      DATA.SUBCATEGORY_CODE
    );
    this.zirconMasterMainForm.controls["sieve"].setValue(DATA.SIEVE);
    this.zirconMasterMainForm.controls["sieveSet"].setValue(DATA.SIEVE_SET);
    this.zirconMasterMainForm.controls["firstTrans"].setValue(DATA.FIRST_TRN);
    this.zirconMasterMainForm.controls["lastTrans"].setValue(DATA.LAST_TRN);
    this.zirconMasterMainForm.controls["excludeFromTransferWt"].setValue(
      DATA.EXCLUDE_TRANSFER_WT
    );
    this.zirconMasterMainForm.controls["excludeFromTransferWt"].setValue(
      DATA.EXCLUDE_TRANSFER_WT
    );
    this.zirconMasterMainForm.controls["allowZeroPcs"].setValue(
      DATA.ALLOW_ZEROPCS
    );
    this.zirconMasterMainForm.controls["currencyCode"].setValue(
      DATA.CURRENCY_CODE
    );
    this.zirconMasterMainForm.controls["currencyCode"].setValue(
      DATA.CURRENCY_CODE
    );
    this.zirconMasterMainForm.controls["priceOnePercent"].setValue(
      DATA.PRICE1PER
    );
    this.zirconMasterMainForm.controls["priceTwoPercent"].setValue(
      DATA.PRICE2PER
    );
    this.zirconMasterMainForm.controls["priceThreePercent"].setValue(
      DATA.PRICE3PER
    );
    this.zirconMasterMainForm.controls["priceFourPercent"].setValue(
      DATA.PRICE4PER
    );
    this.zirconMasterMainForm.controls["priceFivePercent"].setValue(
      DATA.PRICE5PER
    );

    this.zirconMasterMainForm.controls["priceOneLc"].setValue(DATA.PRICE1LC);
    this.zirconMasterMainForm.controls["priceTwoLc"].setValue(DATA.PRICE2LC);
    this.zirconMasterMainForm.controls["priceThreeLc"].setValue(DATA.PRICE3LC);
    this.zirconMasterMainForm.controls["priceFourLc"].setValue(DATA.PRICE4LC);
    this.zirconMasterMainForm.controls["priceFiveLc"].setValue(DATA.PRICE5LC);
    this.zirconMasterMainForm.controls["priceOneFc"].setValue(DATA.PRICE1FC);
    this.zirconMasterMainForm.controls["priceTwoFc"].setValue(DATA.PRICE2FC);
    this.zirconMasterMainForm.controls["priceThreeFc"].setValue(DATA.PRICE3FC);
    this.zirconMasterMainForm.controls["priceFourFc"].setValue(DATA.PRICE4FC);
    this.zirconMasterMainForm.controls["priceFiveFc"].setValue(DATA.PRICE5FC);
  }

  editController(DATA: any) {
    this.ViewController(DATA);
  }

  DeleteController(DATA?: any) {
    this.ViewController(DATA);

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
        const API = `DiamondStockMaster/DeleteDiamondStockMaster/${this.code}`;
        const Sub: Subscription = this.apiService
          .deleteDynamicAPI(API)
          .subscribe({
            next: (response) => {
              Swal.fire({
                title:
                  response.status === "Success"
                    ? response.message
                      ? response.message
                      : "Deleted Successfully"
                    : "Not Deleted",
                icon: response.status === "Success" ? "success" : "error",
                confirmButtonColor: "#336699",
                confirmButtonText: "Ok",
              });

              response.status === "Success"
                ? this.close("reloadMainGrid", true)
                : console.log("Delete Error");
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: "Failed to delete the item.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
              console.error(err);
            },
          });
        this.subscriptions.push(Sub);
      } else {
        this.flag = "VIEW";
      }
    });
  }

  close(data?: any, calling?: boolean) {
    if (this.flag !== "VIEW" && !calling) {
      Swal.fire({
        title: "Are you sure you want to close this ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Close!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.activeModal.close(data);
        }
      });
    } else {
      this.activeModal.close(data);
    }
  }

  openTab(event: any, formControlName: string) {
    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "costCenter":
        this.overlayCostCenter.showOverlayPanel(event);
        break;
      case "category":
        this.overlayCategory.showOverlayPanel(event);
        break;

      case "shape":
        this.overlayShape.showOverlayPanel(event);
        break;
      case "color":
        this.overlayColor.showOverlayPanel(event);
        break;
      case "vendor":
        this.overlayVendor.showOverlayPanel(event);
        break;
      case "brand":
        this.overlayBrand.showOverlayPanel(event);
        break;
      case "subCategory":
        this.overlaySubCategory.showOverlayPanel(event);
        break;
      case "size":
        this.overlaySize.showOverlayPanel(event);
        break;

      case "type":
        this.overlayType.showOverlayPanel(event);
        break;

      case "sieveSet":
        this.overlaySieveSet.showOverlayPanel(event);
        break;

      case "sieve":
        this.overlaySieve.showOverlayPanel(event);
        break;

      case "priceOneCode":
        this.overlayPriceOneCode.showOverlayPanel(event);
        break;

      case "priceTwoCode":
        this.overlayPriceTwoCode.showOverlayPanel(event);
        break;
      case "priceThreeCode":
        this.overlayPriceThreeCode.showOverlayPanel(event);
        break;
      case "priceFourCode":
        this.overlayPriceFourCode.showOverlayPanel(event);
        break;
      case "priceFiveCode":
        this.overlayPriceFiveCode.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  lookupSelect(e: any, controller?: any, modelfield?: any) {
    console.log(e);
    if (Array.isArray(controller) && Array.isArray(modelfield)) {
      // Handle multiple controllers and fields
      if (controller.length === modelfield.length) {
        controller.forEach((ctrl, index) => {
          const field = modelfield[index];
          const value = e[field];
          if (value !== undefined) {
            this.zirconMasterMainForm.controls[ctrl].setValue(value);
          } else {
            console.warn(`Model field '${field}' not found in event object.`);
          }
        });
      } else {
        console.warn(
          "Controller and modelfield arrays must be of equal length."
        );
      }
    } else if (controller && modelfield) {
      // Handle single controller and field
      const value = e[modelfield];
      if (value !== undefined) {
        this.zirconMasterMainForm.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
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

    if (!searchValue || this.flag == "VIEW") return;

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

    const sub: Subscription = this.apiService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Filtered Search Result:", searchResult);

              if (FROMCODE === true) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) =>
                      item.MobileCountryCode !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              } else if (FROMCODE === false) {
                searchResult = [
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION === LOOKUPDATA.SEARCH_VALUE
                  ),
                  ...searchResult.filter(
                    (item: any) => item.DESCRIPTION !== LOOKUPDATA.SEARCH_VALUE
                  ),
                ];
              }

              if (searchResult?.length) {
                const matchedItem = searchResult[0];

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    this.zirconMasterMainForm.controls[formName].setValue(
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
      this.zirconMasterMainForm.controls[formName].setValue("");
    });
  }

  zirconMasterMainFormSubmit() {
    let postData = {
      ITEM: "s",
      STOCK_CODE: this.zirconMasterMainForm.value.code,
      STOCK_DESCRIPTION: this.zirconMasterMainForm.value.description,
      CURRENCY_CODE: this.zirconMasterMainForm.value.currencyCode,
      CC_RATE: this.zirconMasterMainForm.value.currencyRate,
      COST_CODE: "string",
      TYPE_CODE: this.zirconMasterMainForm.value.type,
      CATEGORY_CODE: this.zirconMasterMainForm.value.category,
      SUBCATEGORY_CODE: this.zirconMasterMainForm.value.subCategory,
      BRAND_CODE: this.zirconMasterMainForm.value.brand,
      COUNTRY_CODE: this.zirconMasterMainForm.value.brand,
      SUPPLIER_CODE: this.zirconMasterMainForm.value.vendor,
      SUPPLIER_REF: this.zirconMasterMainForm.value.vendorRef,
      DESIGN_CODE: "string",
      SET_REF: "string",
      PICTURE_NAME: this.zirconMasterMainForm.value.picture,
      PICTURE_NAME1: "string",
      STOCK_FCCOST: this.zirconMasterMainForm.value.weightAvgCostCode,
      STOCK_LCCOST: this.zirconMasterMainForm.value.weightAvgCostDesc,
      PRICE1PER: this.zirconMasterMainForm.value.priceOnePercent,
      PRICE2PER: this.zirconMasterMainForm.value.priceTwoPercent,
      PRICE3PER: this.zirconMasterMainForm.value.priceThreePercent,
      PRICE4PER: this.zirconMasterMainForm.value.priceFourPercent,
      PRICE5PER: this.zirconMasterMainForm.value.priceFivePercent,
      PRICE1FC: this.zirconMasterMainForm.value.priceOneFc,
      PRICE1LC: this.zirconMasterMainForm.value.priceOneLc,
      PRICE2FC: this.zirconMasterMainForm.value.priceTwoFc,
      PRICE2LC: this.zirconMasterMainForm.value.priceTwoLc,
      PRICE3FC: this.zirconMasterMainForm.value.priceThreeFc,
      PRICE3LC: this.zirconMasterMainForm.value.priceThreeLc,
      PRICE4FC: this.zirconMasterMainForm.value.priceFourFc,
      PRICE4LC: this.zirconMasterMainForm.value.priceFourLc,
      PRICE5FC: this.zirconMasterMainForm.value.priceFiveFc,
      PRICE5LC: this.zirconMasterMainForm.value.priceFiveLc,
      CHARGE1FC: 0,
      CHARGE1LC: 0,
      CHARGE2FC: 0,
      CHARGE2LC: 0,
      CHARGE3FC: 0,
      CHARGE3LC: 0,
      CHARGE4FC: 0,
      CHARGE4LC: 0,
      CHARGE5FC: 0,
      CHARGE5LC: 0,
      SHORT_ID: "str",
      COLOR: this.zirconMasterMainForm.value.color,
      CLARITY: "string",
      SIZE: this.zirconMasterMainForm.value.size,
      SIEVE: this.zirconMasterMainForm.value.sieve,
      SHAPE: this.zirconMasterMainForm.value.shape,
      GRADE: "string",
      FLUOR: "string",
      FINISH: "string",
      CERT_BY: "string",
      CERT_NO: "string",
      CERT_DATE: "string",
      GRIDLE: "string",
      CULET: "string",
      TWIDTH: 0,
      CRHEIGHT: 0,
      PAVDEPTH: 0,
      OVERALL: "string",
      MEASURE: "string",
      CERT_PICTURE_NAME: "string",
      TAG_LINES: "string",
      COMMENTS: "string",
      WATCH_TYPE: 0,
      PEARL_TYPE: 0,
      STRAP_TYPE: "string",
      STRAP_COLOR: "string",
      GW: 0,
      MODEL_NO: "string",
      MODEL_YEAR: 0,
      OPENED_ON: this.zirconMasterMainForm.value.createdOn,
      OPENED_BY: this.zirconMasterMainForm.value.createdBy,
      FIRST_TRN: this.zirconMasterMainForm.value.firstTrans,
      LAST_TRN: this.zirconMasterMainForm.value.lastTrans,
      MID: 0,
      PRINTED: true,
      PURVOCTYPE_NO: "string",
      PURPARTY: "string",
      PURDATE: "string",
      PURAMOUNT: 0,
      PURBRLOC: "string",
      SALVOCTYPE_NO: "string",
      SALPARTY: "string",
      SALDATE: "string",
      SALAMOUNT: 0,
      SALBRLOC: "string",
      METAL_TOTALGROSSWT: 0,
      METAL_TOTALAMOUNT: 0,
      METAL_TOTALMAKING: 0,
      LOOSE_TOTALWT: 0,
      LOOSE_TOTALAMOUNT: 0,
      COLOR_TOTALWT: 0,
      COLOR_TOTALAMOUNT: 0,
      PEARL_TOTALWT: 0,
      PEARL_TOTALAMOUNT: 0,
      MANF_MID: 0,
      MANF_BR_VOCTYPE_NO: "string",
      WATCH_REFNO: "string",
      WATCH_MODELNAME: "string",
      WATCH_MODELNO: "string",
      WATCH_MATERIAL: "string",
      WATCH_DIALCOLOR: "string",
      WATCH_BAZEL: "string",
      WATCH_MOVEMENT: "string",
      WATCH_STATUS: "string",
      WATCH_WEIGHT: "string",
      UNIT: "strin",
      PCS_PERUNIT: 0,
      TAG_LINESWOENTER: "string",
      PICTURE_NAME_THUMBNAIL: "string",
      GOLDSMITH: "string",
      STONESETTER: "string",
      STD_LCCOST: 0,
      TAG1: "string",
      TAG2: "string",
      TAG3: "string",
      TAG4: "string",
      TAG5: "string",
      WEIGHT_PER_PCS: 0,
      DETAILDESCRIPTION: "string",
      PROD_CUSTOMER_CODE: "string",
      TDWT: 0,
      RD: 0,
      TB: 0,
      PR: 0,
      MQ: 0,
      SO: 0,
      OT: 0,
      RUBY: 0,
      EMERALD: 0,
      SAPHIRE: 0,
      WATCH_SERIALNO: "string",
      CERT_PRINTED: true,
      NOQTYCHANGE: true,
      STYLE: "string",
      CUSTOMERSKU: "string",
      INITIAL_BRPURVOCTYPE_NO: "string",
      STOCK_DESCRIPTION_OTHERS: "string",
      TIME_CODE: "string",
      RANGE_CODE: "string",
      COMMENTS_CODE: "string",
      NOTES: "string",
      ASK: "string",
      SELL: "string",
      CUT: "string",
      POLISH: "string",
      SYMMETRY: "string",
      UDF1: "string",
      UDF2: "string",
      UDF3: "string",
      UDF4: "string",
      UDF5: "string",
      UDF6: "string",
      UDF7: "string",
      UDF8: "string",
      UDF9: "string",
      UDF10: "string",
      UDF11: "string",
      UDF12: "string",
      UDF13: "string",
      UDF14: "string",
      UDF15: "string",
      PROMOTIONALITEM: true,
      EXCLUDEGSTVAT: true,
      RRR_CARAT: 0,
      RRR_PERCENT: 0,
      NACRE: "string",
      SURFACE: "string",
      MATCHING: "string",
      TREATMENT: "string",
      CUTSTYLE_CROWN: "string",
      CUTSTYLE_PAVILION: "string",
      TRANSPARENCY: "string",
      CONCLUSION: "string",
      SPECIES: "string",
      VARIETY: "string",
      CERTIFICATETYPE: "string",
      SOURCETYPE: "string",
      CHARACTERISTIC: "string",
      TONE_SATURATION: "string",
      SHAPEAPPAREL: "string",
      DIA_PCS: 0,
      DIA_CARAT: 0,
      DIA_VALUEFC: 0,
      DIA_VALUECC: 0,
      COLOR_PCS: 0,
      COLOR_CARAT: 0,
      COLOR_VALUEFC: 0,
      COLOR_VALUECC: 0,
      PEARL_PCS: 0,
      PEARL_CARAT: 0,
      PEARL_VALUEFC: 0,
      PEARL_VALUECC: 0,
      OTSTONES_PCS: 0,
      OTSTONES_CARAT: 0,
      OTSTONES_VALUEFC: 0,
      OTSTONES_VALUECC: 0,
      METAL_GROSSWT: 0,
      METAL_VALUEFC: 0,
      METAL_VALUECC: 0,
      TOTPCS: 0,
      TOTCARAT: 0,
      TOTGMS: 0,
      TOTVFC: 0,
      TOTVLC: 0,
      TOTALFC: 0,
      TOTALCC: 0,
      LAST_EDT_BY: "string",
      LAST_EDT_ON: "string",
      UNITCODE: "string",
      UNITWT: 0,
      CHKUNIT: true,
      CHKCOMPONENTSUMMARY: "string",
      CHKCOMPONENTDETAIL: "string",
      CMBNATURE: "string",
      CMBTYPE: "string",
      RFID_TAG: "string",
      SKUDESCRIPTION: "string",
      ON_OFF: true,
      NOTFORSALES: 0,
      TRANSFERED_WEB: true,
      CALCULATE_COSTING: true,
      QUALITY_CODE: "string",
      PARENTSTOCK_CODE: "string",
      PARTNER_CODE: "string",
      KPNUMBER: "string",
      HSN_CODE: "string",
      ITEM_ONHOLD: true,
      POS_CUST_CODE: "string",
      CONSIGNMENT: true,
      POSGROSSWT: 0,
      HANDLING_CHARGEFC: 0,
      HANDLING_CHARGELC: 0,
      ORG_COSTFC: 0,
      ORG_COSTLC: 0,
      VATONMARGIN: true,
      SALESPERSON_CODE: "string",
      ORDSALESPERSON_CODE: "string",
      BATCH_STOCK: true,
      BATCH_PREFIX: "string",
      SIEVE_SET: this.zirconMasterMainForm.value.sieveSet,
      MODEL_CODE: "string",
      NOOF_PLAT: 0,
      PLAT_CHARGESFC: 0,
      PLAT_CHARGESLC: 0,
      CERT_CHARGESLC: 0,
      CERT_CHARGESFC: 0,
      UNFIX_DIAMOND_ITEM: true,
      ALLOW_WITHOUT_RATE: true,
      RRR_STOCK_REF: "string",
      MARKETCOSTFC: 0,
      MARKETCOSTLC: 0,
      RRR_PRICE_UPDATED: true,
      RRR_PRICE_UPDDATE: new Date(),
      SALESCODE: 0,
      RRR_PUR_CARAT: 0,
      RRR_PUR_PERCENT: 0,
      RRR_SAL_PERCENT: 0,
      RRR_OTHER_PERCENT: 0,
      SET_PICTURE_NAME: "string",
      PACKET_ITEM: true,
      PACKET_WT: 0,
      SALES_TAGLINES: "string",
      ALLOW_ZEROPCS: this.allowZeroPcs,
      NOOF_CERT: 0,
      ADDITIONAL_RATEFC: 0,
      ADDITIONAL_RATELC: 0,
      WBOXWOUTBOX: 0,
      ALLOW_NEGATIVE: true,
      EXCLUDE_TRANSFER_WT: this.excludeFromTransferWt,
      WT_VAR_PER: 0,
      HALLMARKING: "string",
      WOO_CATEGORY_ID: 0,
      DESIGN_DESC: "string",
      COST_CENTER_DESC: this.zirconMasterMainForm.value.costCenter,
      SUPPLIER_DESC: "string",
      ORDSALESPERSON_DESC: "string",
      COUNTRY_DESC: "string",
      TYPE_DESC: "string",
      CATEGORY_DESC: "string",
      SUBCATEGORY_DESC: "string",
      BRAND_DESC: "string",
      COLOR_DESC: "string",
      FLUORESCENCE_DESC: "string",
      CLARITY_DESC: "string",
      RANGE_DESC: "string",
      STYLE_DESC: "string",
      HSN_DESC: "string",
      TIME_DESC: "string",
      SIZE_DESC: "string",
      SIEVE_SET_DESC: "string",
      SIEVE_DESC: "string",
      SHAPE_DESC: "string",
      FINISH_DESC: "string",
      GRADE_DESC: "string",
      CUT_DESC: "string",
      POLISH_DESC: "string",
      SYMMETRY_DESC: "string",
      UNITCODE_DESC: "string",
      CERT_BY_DESC: "string",
      STRAP_TYPE_DESC: "string",
      WATCH_MATERIAL_DESC: "string",
      STRAP_COLOR_DESC: "string",
      WATCH_DIALCOLOR_DESC: "string",
      WATCH_BAZEL_DESC: "string",
      WATCH_MOVEMENT_DESC: "string",
      UDF1_DESC: "string",
      UDF2_DESC: "string",
      UDF3_DESC: "string",
      UDF4_DESC: "string",
      UDF5_DESC: "string",
      UDF6_DESC: "string",
      UDF7_DESC: "string",
      UDF8_DESC: "string",
      UDF9_DESC: "string",
      UDF10_DESC: "string",
      UDF11_DESC: "string",
      UDF12_DESC: "string",
      UDF13_DESC: "string",
      UDF14_DESC: "string",
      UDF15_DESC: "string",
      INITIAL_PURVOCTYPE_NO: "string",
      YIELD: 0,
      MINE_REF: "string",
      MAIN_STOCK_CODE: "string",
      METALKARAT: "string",
      UNQ_DESIGN_ID: "string",
      CHARGE6FC: 0,
      CHARGE6LC: 0,
      CHARGE7FC: 0,
      CHARGE7LC: 0,
      CHARGE8FC: 0,
      CHARGE8LC: 0,
      CHARGE9FC: 0,
      CHARGE9LC: 0,
      CHARGE10FC: 0,
      CHARGE10LC: 0,
      MANUFACTURE_ITEM: true,
      diamondStockDetails: [
        {
          UNIQUEID: 0,
          SRNO: 0,
          METALSTONE: "s",
          DIVCODE: "s",
          KARAT: "stri",
          CARAT: 0,
          GROSS_WT: 0,
          PCS: 0,
          RATE_TYPE: "string",
          CURRENCY_CODE: "stri",
          RATE: 0,
          AMOUNTFC: 0,
          AMOUNTLC: 0,
          MAKINGRATE: 0,
          MAKINGAMOUNT: 0,
          COLOR: "string",
          CLARITY: "string",
          SIEVE: "string",
          SHAPE: "string",
          TMPDETSTOCK_CODE: "string",
          DSIZE: "string",
          LABCHGCODE: "string",
          PRICECODE: "string",
          DESIGN_CODE: "string",
          DETLINEREMARKS: "string",
          MFTSTOCK_CODE: "string",
          STOCK_CODE: "string",
          METALRATE: 0,
          LABOURCODE: "string",
          STONE_TYPE: "string",
          STONE_WT: 0,
          NET_WT: 0,
          LOT_REFERENCE: "string",
          INCLUDEMETALVALUE: true,
          FINALVALUE: 0,
          PERCENTAGE: 0,
          HANDLING_CHARGEFC: 0,
          HANDLING_CHARGELC: 0,
          PROCESS_TYPE: "string",
          SELLING_RATE: 0,
          LAB_RATE: 0,
          LAB_AMTFC: 0,
          LAB_AMTLC: 0,
          SIEVE_SET: "string",
          PURITY: 0,
          PUREWT: 0,
          RRR_STOCK_REF: "string",
          FINALVALUELC: 0,
          LABCHGCODE1: "string",
          LABCHGCODE2: "string",
          LABRATE1: 0,
          LABRATE2: 0,
          CERT_REF: "string",
          FROMEXISTINGSTOCK: 0,
          INSERTEDSTOCKCODE: "string",
          INSERTEDSTOCKCOST: 0,
          POLISHED: "string",
          RAPPRICE: 0,
          PIQUE: "string",
          GRAINING: "string",
          FLUORESCENCE: "string",
          WEIGHT: 0,
        },
      ],
    };

    if (this.flag === "EDIT") {
      let API = `DiamondStockMaster/UpdateDiamondStockMaster/${this.code}`;
      let sub: Subscription = this.apiService
        .putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Updated successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid", true);
          } else {
            // Handle cases where the result is not successful or undefined
            Swal.fire({
              title: "Failed",
              text: result.message ? result.message : "Failed!",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      let API = `/DiamondStockMaster/InsertDiamondStockMaster`;
      let sub: Subscription = this.apiService
        .postDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.status.trim() === "Success") {
            Swal.fire({
              title: "Success",
              text: result.message ? result.message : "Inserted successfully!",
              icon: "success",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });

            this.close("reloadMainGrid", true);
          } else {
            Swal.fire({
              title: "Failed",
              text: "Not Inserted Successfully",
              icon: "error",
              confirmButtonColor: "#336699",
              confirmButtonText: "Ok",
            });
          }
        });
    }
  }

  matBoxChecker(event: MatCheckboxChange, controller: any) {
    switch (controller) {
      case "allowZeroPcs":
        this.allowZeroPcs = event.checked;
        break;

      case "excludeFromTransferWt":
        this.excludeFromTransferWt = event.checked;
        break;
      default:
        break;
    }
  }

  handleFileSelection(event: any, fileInput: HTMLInputElement) {
    this.onFileSelected(event);
    fileInput.value = "";
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (file && !allowedExtensions.exec(file.name)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type!",
        text: "Please upload an image (jpg, jpeg, png, gif).",
      });

      this.imageName = null;
      this.image = null;
      this.fetchedPicture = null;
      return;
    }

    this.image = file;
    this.imageName = file.name;

    if (this.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fetchedPicture = reader.result as string;
      };
      reader.onerror = (err) => {
        console.error("Error loading image:", err);
      };
      reader.readAsDataURL(this.image);
    }
  }

  setFlag(currentFlag: string): void {
    this.flag = currentFlag;
    if (this.flag === "VIEW") {
      this.zirconMasterMainForm.controls["picture"].disable();
      this.zirconMasterMainForm.controls["allowZeroPcs"].disable();
      this.zirconMasterMainForm.controls["excludeFromTransferWt"].disable();
    } else {
      this.zirconMasterMainForm.controls["picture"].enable();
      this.zirconMasterMainForm.controls["allowZeroPcs"].enable();
      this.zirconMasterMainForm.controls["excludeFromTransferWt"].enable();
    }
  }

  diamondPriceCalculation() {
    let payload = {
      strBranchCode: this.branchCode,
      strPriceCode: this.zirconMasterMainForm.value.priceOneCode,
      dblCostValueFC: this.zirconMasterMainForm.value.weightAvgCostCode,
      strCurrCode: this.zirconMasterMainForm.value.currencyCode,
      dblConv_Rate: this.zirconMasterMainForm.value.currencyRate,
    };
    let API = `UspDiamondPriceCalculation/GetUspDiamondPriceCalculation`;
    let sub: Subscription = this.apiService
      .postDynamicAPI(API, payload)
      .subscribe(
        (result) => {
          if (result.status.trim() === "Success" && result.response) {
            console.log(result);

            // this.itemDetailsData = result.response.map(
            //   (item: any, index: number) => {
            //     return { ...item, SELECT1: false, SRNO: index + 1 };
            //   }
            // );
          } else {
            this.commonService.toastErrorByMsgId("MSG1531");
          }
        },
        (err) => {
          console.error("Error fetching data:", err);
          this.commonService.toastErrorByMsgId("MSG1531");
        }
      );
  }
}
