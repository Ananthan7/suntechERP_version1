import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';


@Component({
  selector: 'app-wholesale-salesman-target-details',
  templateUrl: './wholesale-salesman-target-details.component.html',
  styleUrls: ['./wholesale-salesman-target-details.component.scss']
})
export class WholesaleSalesmanTargetDetailsComponent implements OnInit {
  selectedDivision: string = "";
  flag: any;
  private subscriptions: Subscription[] = [];




  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private commonService: CommonServiceService,
    private apiService: SuntechAPIService,




  ) { }

  typeList: any[] = [{ field: "None" }, { field: "Category" }, { field: "Sub Category" },
  { field: "Brand Code" }, { field: "Karat" }, { field: "Type" }, { field: "Country" }, { field: "Cost Code" }];

  divisionlist: any[] = [
    { field: 'Diamond', value: 'd' },
    { field: 'Metal', value: 'm' }
  ];
  targetonlist: any[] = [{ field: "Sales Amount" }, { field: "Quantity" },{ field: "Gp" }];

  wholesaledetailsform: FormGroup = this.formBuilder.group({
    detail_target_code: [""],
    description: [""],
    division: [""],
    target_on: [""],
    customer: [""],
    country: [""],
    area: [""],
    divisions: [""],
    type1: [""],
    detail_target_code1: [""],
    type2: [""],
    detail_target_code2: [""],
    type3: [""],
    detail_target_code3: [""],
    target_selection: [""],
    target_amount: [""],

  });

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 95,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'Customer Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCOUNT_MODE  = 'R'  AND ACCODE  != ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  selectedcustomercode(e: any) {
    console.log(e);
    this.wholesaledetailsform.controls.customer.setValue(e.ACCODE);
  }

  CountryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  countrySelected(value: any) {
    console.log(value);
    this.wholesaledetailsform.controls.country.setValue(value.CODE);
  }

  areacodedata: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Area Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'STATE MASTER' AND COUNTRY_CODE = ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  areaSelected(value: any) {
    console.log(value);
    this.wholesaledetailsform.controls.country.setValue(value.CODE);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: `DIVISION  = 'M'`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.wholesaledetailsform.controls.divisions.setValue(e.DIVISION_CODE);
  }


  enteredCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Sieve Set',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  enteredCodeSelected(e: any) {
    console.log(e);
    this.wholesaledetailsform.controls.sieveset.setValue(e.sieveset);

  }

  ngOnInit(): void {
  }

  formSubmit() {

    console.log(this.wholesaledetailsform.controls.division.value);


    const postData = {
      "SLNO": 0,
      "TARGET_CODE": this.wholesaledetailsform.controls.detail_target_code.value,
      "SALESPERSON_CODE": "string",
      "CUSTOMER": this.wholesaledetailsform.controls.customer.value,
      "DIA_OR_MTL": this.wholesaledetailsform.controls.division.value,
      "DIVISIONS": this.wholesaledetailsform.controls.divisions.value,
      "INVFILT1_VALUES": this.wholesaledetailsform.controls.type1.value,
      "INVFILT2_VALUES": this.wholesaledetailsform.controls.type2.value,
      "INVFILT3_VALUES": this.wholesaledetailsform.controls.type3.value,
      "INVFILT1_FIELD": this.wholesaledetailsform.controls.detail_target_code1.value,
      "INVFILT2_FIELD": this.wholesaledetailsform.controls.detail_target_code2.value,
      "INVFILT3_FIELD": this.wholesaledetailsform.controls.detail_target_code3.value,
      "DT_TARGETCODE": this.wholesaledetailsform.controls.detail_target_code.value,
      "FYEARCODE": "stri",
      "SERVICE_FILTER": "string",
      "TARGET_ON": this.wholesaledetailsform.controls.target_on.value,
      "TARGET": this.wholesaledetailsform.controls.target_amount.value,
      "COUNTRY": this.wholesaledetailsform.controls.country.value,
      "AREA": this.wholesaledetailsform.controls.area.value,
      "NARRATION": this.wholesaledetailsform.controls.target_selection.value,
      "TARGET_DESC": this.wholesaledetailsform.controls.description.value
    }
    console.log(postData);
    this.close(postData);

  }

  close(data?: any) {
    this.activeModal.close(data);
  }

  clear(element: any) {
    this.wholesaledetailsform.controls[element].reset();
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

                    this.wholesaledetailsform.controls[formName].setValue(
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
      this.wholesaledetailsform.controls[formName].setValue("");
    });
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
            this.wholesaledetailsform.controls[ctrl].setValue(value);
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
        this.wholesaledetailsform.controls[controller].setValue(value);
      } else {
        console.warn(`Model field '${modelfield}' not found in event object.`);
      }
    } else {
      console.warn("Controller or modelfield is missing.");
    }
  }


}
