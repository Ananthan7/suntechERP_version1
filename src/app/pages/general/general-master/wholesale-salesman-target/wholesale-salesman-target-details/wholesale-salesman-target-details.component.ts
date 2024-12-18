import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selectedDivision: string = 'd';
  private subscriptions: Subscription[] = [];
  sel_data:any;
  @Input () parent_code :any;
  @Input () grid_length :any;
  @Input () fyear_code :any;
  @Input () flag :any;
  @Input () salesperson_code :any;
  @Input () data :any;
  code_value:boolean = true;
  maindetails_dt :any[]=[];
  



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
    detail_target_code: ["",[Validators.required]],
    description: ["",[Validators.required]],
    division: [""],
    target_on: ["",[Validators.required]],
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
    target_amount: ["",[Validators.required]],

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

  inventorycodedata: MasterSearchModel =  {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 111,
    ORDER_TYPE: 0,
    SEARCH_HEADING: "Inventory",
    WHERECONDITION: " @strSelectedField='Category'",
    SEARCH_FIELD: "", 
    SEARCH_VALUE: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true
  };
  selectedinventory(e: any, field: string) {
    console.log(e);
    this.wholesaledetailsform.controls[field].setValue(e.Code);
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

  filrec(){
    console.log(this.sel_data);
   if(this.sel_data != '' || this.sel_data != null || this.sel_data != undefined){
      return 'S';
   }else{
      return 'M';
   }
  }

  logSelectedValue() {
    this.sel_data = this.wholesaledetailsform.controls.division.value;
    console.log('Selected Division:', this.sel_data);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    // WHERECONDITION: `DIVISION = '${this.filrec()}'`, 
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }
  divisionCodeSelected(e: any) {
    console.log(e);
    this.wholesaledetailsform.controls.divisions.setValue(e.DIVISION_CODE);
  }

  change_divisions_value(){
    let div = this.wholesaledetailsform.controls.division.value;
    console.log(div)
    if(div == 'd'){
      //diamond
      this.divisionCodeData.WHERECONDITION = "WHERE DIVISION  ='S'" ;
    }else{
      //metal
      this.divisionCodeData.WHERECONDITION = "WHERE DIVISION  ='M'" ;
    }
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
    this.grid_length++;
    this.parent_code = this.parent_code+"-" + this.grid_length;
    this.wholesaledetailsform.controls.detail_target_code.setValue(this.parent_code);
    this.wholesaledetailsform.controls.description.setValue(this.parent_code);
    // this.selectedDivision = 'd';
    if(this.flag == undefined){
      this.wholesaledetailsform.controls.division.setValue('d')
    }

    if (this.data != undefined) {
      this.wholesaledetailsform.controls.detail_target_code.setValue(this.data.TARGET_CODE);
      this.wholesaledetailsform.controls.customer.setValue(this.data.CUSTOMER);
      this.wholesaledetailsform.controls.division.setValue(this.data.DIA_OR_MTL);
      this.wholesaledetailsform.controls.divisions.setValue(this.data.DIVISIONS);
      this.wholesaledetailsform.controls.type1.setValue(this.data.INVFILT1_VALUES);
      this.wholesaledetailsform.controls.type2.setValue(this.data.INVFILT2_VALUES);
      this.wholesaledetailsform.controls.type3.setValue(this.data.INVFILT3_VALUES);
      this.wholesaledetailsform.controls.detail_target_code1.setValue(this.data.INVFILT1_FIELD);
      this.wholesaledetailsform.controls.detail_target_code2.setValue(this.data.INVFILT2_FIELD);
      this.wholesaledetailsform.controls.detail_target_code3.setValue(this.data.INVFILT3_FIELD);
      this.wholesaledetailsform.controls.target_on.setValue(this.data.TARGET_ON);
      this.wholesaledetailsform.controls.target_amount.setValue(this.data.TARGET);
      this.wholesaledetailsform.controls.country.setValue(this.data.COUNTRY);
      this.wholesaledetailsform.controls.area.setValue(this.data.AREA);
      this.wholesaledetailsform.controls.target_selection.setValue(this.data.NARRATION);
      this.wholesaledetailsform.controls.description.setValue(this.data.TARGET_DESC);
    }

    this.wholesaledetailsform.get('division')?.valueChanges.subscribe(() => {
      this.change_divisions_value();
    });
  }

  

  formSubmit() {

    Object.keys(this.wholesaledetailsform.controls).forEach((controlName) => {
      const control = this.wholesaledetailsform.controls[controlName];
      if (control.validator && control.validator({} as AbstractControl)) {
        control.markAsTouched();
      }
    });

    const requiredFieldsInvalid = Object.keys(
      this.wholesaledetailsform.controls
    ).some((controlName) => {
      const control = this.wholesaledetailsform.controls[controlName];
      return control.hasError("required") && control.touched;
  });

    console.log(this.wholesaledetailsform.controls.division.value);
     if(!requiredFieldsInvalid){
      const postData = {
        "SLNO": 0,
        "TARGET_CODE": this.wholesaledetailsform.controls.detail_target_code.value,
        "SALESPERSON_CODE": this.salesperson_code,
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
        "FYEARCODE": this.fyear_code,
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


  setmonth(){
    let amount = this.wholesaledetailsform.controls.target_amount.value;
    let ind_value = amount/12;

    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    let data = months.map((month, index) => ({
      "SLNO": index+1,
      "MONTH": month,
      "TARGET_AMOUNT": ind_value,
    }));

    console.log(data);
    this.maindetails_dt.push( ...data);

  }

  settotalamount(data: any, event: any){
    const updatedSRNO = data.data.SLNO - 1; 
    const budgetedAmt = parseFloat(event.target.value);
    this.maindetails_dt[updatedSRNO].TARGET_AMOUNT = this.commonService.decimalQuantityFormat(event.target.value,'AMOUNT');
    let total = 0;
    this.maindetails_dt.forEach((e:any) => {
      total += parseFloat(e.TARGET_AMOUNT);
    });
    this.wholesaledetailsform.controls.target_amount.setValue(total);
  }

  changedetails($event:any){
    console.log($event);
  }

}
