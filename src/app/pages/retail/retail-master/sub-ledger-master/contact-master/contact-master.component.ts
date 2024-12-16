import { Code } from "angular-feather/icons";
import { Component, EventEmitter, Input, OnInit,Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from "rxjs";
import { CommonServiceService } from "src/app/services/common-service.service";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import Swal from "sweetalert2";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-contact-master',
  templateUrl: './contact-master.component.html',
  styleUrls: ['./contact-master.component.scss']
})
export class ContactMasterComponent implements OnInit {
  @Input() content!: any;
  @Output() saveDetail = new EventEmitter<any>();
  isloading: boolean = false;
  viewMode: boolean = false;
  isDisabled: boolean = false;
  editableMode: boolean = false;
  editMode: boolean = false;
  codeEnable: boolean = false;

  AccountCodeData: MasterSearchModel = {
  }

  SubLedgerCodeData:MasterSearchModel ={}

  CountryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };
  ReligionCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Religions",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='RELIGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  FavoriteFestivalCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Favorite Celebration",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='FAVORITE CELEBRATION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  CategoryCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Category",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='CUSTOMER CATEGORY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  CustStatusCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer Status",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='CUSTOMER STATUS MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  NaionalityCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Nationality Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='NATIONALITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  StateCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 27,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "State Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='state master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  CityCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "City Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  LanguageCodeData:MasterSearchModel ={
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Language",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='LANGUAGE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  }

  @ViewChild("overlayCountrySearch")overlayCountrySearch!: MasterSearchComponent;
  @ViewChild("overlayStateSearch") overlayStateSearch!: MasterSearchComponent;
  @ViewChild("overlayCitySearch") overlayCitySearch!: MasterSearchComponent;
  @ViewChild("overlayNationalitySearch")overlayNationalitySearch!: MasterSearchComponent;
  @ViewChild("overlayLanguageSearch") overlayLanguageSearch!: MasterSearchComponent;
  @ViewChild("overlayFestivalSearch") overlayFestivalSearch!: MasterSearchComponent;
  @ViewChild("overlayReligionSearch")overlayReligionSearch!: MasterSearchComponent;
  @ViewChild("overlayCategorySearch") overlayCategorySearch!: MasterSearchComponent;
  @ViewChild("overlayStatusSearch") overlayStatusSearch!: MasterSearchComponent;
  @ViewChild("overlayAccodeSearch") overlayAccodeSearch!: MasterSearchComponent;
  @ViewChild("overlaySubCodeSearch") overlaySubCodeSearch!: MasterSearchComponent;

  contactMasterForm: FormGroup = this.formBuilder.group({
    AccountCode:[''],
    AccountCodeDes:[''],
    SubLedgerCode:[''],
    SubLedgerCodeDes:[''],
    Name:[''],
    Company:[''],
    Designation:[''],
    Gender:[''],
    Email:[''],
    MaritalSt:[''],
    Country:[''],
    CountryDes:[''],
    Religion:[''],
    MoblieCode:[''],
    Moblie:[''],
    Category:[''],
    Moblie1Code:[''],
    Moblie1:[''],
    CustStatus:[''],
    telRCode:[''],
    telR:[''],
    income:[''],
    telOCode:[''],
    telO:[''],
    bloodGroup:[''],
    faxNo:[''],
    custId:[''],
    Naionality:[''],
    custType:[''],
    State:[''],
    poBox:[''],
    City:[''],
    SpouseName:[''],
    Language:[''],
    remarks:[''],
    FavoriteFestival:[''],
    SpouseMoblie:[''],
    SpouseEmailID:[''],
    Peraddress:[''],
    Offiaddress:[''],
    Deladdress:[''],

  })
  bloodGroupList:any=[];
  maritalStatusList:any=[];
  genderList:any=[];
  private subscriptions:Subscription[]=[];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.bloodGroupList = this.getUniqueValues(
      this.commonService.getComboFilterByID("Blood Group"),
      "ENGLISH"
    );
    this.maritalStatusList = this.getUniqueValues(
      this.commonService.getComboFilterByID("Marital Status"),
      "ENGLISH"
    );
    this.genderList = this.getUniqueValues(
      this.commonService.getComboFilterByID("gender"),
      "ENGLISH"
    );
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  AccountDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['AccountCode'].setValue(e.ACCODE);
    this.contactMasterForm.controls['AccountCodeDes'].setValue(e.DESCRIPTION);
  }

  SubLedgerDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['SubLedgerCode'].setValue(e.ACCODE);
    this.contactMasterForm.controls['SubLedgerCodeDes'].setValue(e.DESCRIPTION);
  }

  CountryDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['Country'].setValue(e.CODE);
    this.contactMasterForm.controls['CountryDes'].setValue(e.DESCRIPTION);
  }

  ReligionDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['Religion'].setValue(e.CODE);
  }

  CategoryDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['Category'].setValue(e.CODE);
  }

  CustStatusDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['CustStatus'].setValue(e.CODE);
  }

  NaionalityDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['Naionality'].setValue(e.CODE);
  }

  StateDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['State'].setValue(e.CODE);
  }

  CityDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['City'].setValue(e.CODE);
  }

  LanguageDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['Language'].setValue(e.CODE);
  }

  FavoriteFestivalDataSelected(e:any){
    console.log(e);
    this.contactMasterForm.controls['FavoriteFestival'].setValue(e.CODE);
  }

  setPostData(){
    let form = this.contactMasterForm.value;
    return{
      INCOME: this.commonService.emptyToZero(form.Income),
      REFMID: 0,
      ACCODE: this.commonService.nullToString(form.AccountCode)||"Str",
      CUSTOMER_NAME: this.commonService.nullToString(form.Name),
      DESIGNATION:this.commonService.nullToString(form.Designation),
      MOBILE: this.commonService.nullToString(form.Moblie),
      EMAIL: this.commonService.nullToString(form.Email),
      DEFAULT_CONTACT: true,
      ACMID: 0,
      ACC_DESCRIPTION: this.commonService.nullToString(form.AccountCodeDes),
      SL_CODE: this.commonService.nullToString(form.SubLedgerCode)|| "Str",
      DESCRIPTION: this.commonService.nullToString(form.SubLedgerCodeDes),
      COMPANY:  this.commonService.nullToString(form.Company),
      ADDRESS:  this.commonService.nullToString(form.Peraddress),
      POBOX_NO:  this.commonService.nullToString(form.poBox),
      STATE:  this.commonService.nullToString(form.State),
      CITY:  this.commonService.nullToString(form.City),
      ZIPCODE:  "",
      COUNTRY_CODE:  this.commonService.nullToString(form.Country),
      TEL1:  this.commonService.nullToString(form.telO),
      TEL2:  this.commonService.nullToString(form.telR),
      FAX:  this.commonService.nullToString(form.faxNo),
      MARITAL_ST:  this.commonService.nullToString(form.MaritalSt),
      SPOUSE_NAME:  this.commonService.nullToString(form.SpouseName),
      SPOUSE_NO:  this.commonService.nullToString(form.SpouseMoblie),
      SPOUSE_EMAIL:  this.commonService.nullToString(form.SpouseEmailID),
      REMARKS:  this.commonService.nullToString(form.remarks),
      DATE_OF_BIRTH: "2024-12-11T05:04:14.279Z",
      OPENING_ON: "2024-12-11T05:04:14.279Z",
      GENDER: this.commonService.nullToString(form.Gender),
      REGION: "",
      NATIONALITY: this.commonService.nullToString(form.Naionality),
      POSCUSTIDNO: this.commonService.nullToString(form.custId),
      RELIGION: this.commonService.nullToString(form.Religion),
      TYPE: "",
      CATEGORY: this.commonService.nullToString(form.Category),
      CUST_STATUS:this.commonService.nullToString(form.CustStatus),
      BRANCH_CODE: "",
      MOBILE1: this.commonService.nullToString(form.Moblie1),
      CUST_LANGUAGE: this.commonService.nullToString(form.Language),
      CUST_TYPE: this.commonService.nullToString(form.custType),
      FAVORITE_CELEB: this.commonService.nullToString(form.FavoriteFestival),
      MOBILECODE1: this.commonService.nullToString(form.Moblie1Code),
      MOBILECODE2: this.commonService.nullToString(form.MoblieCode),
      IDCATEGORY: "",
      ADDRESS_OFFICIAL: this.commonService.nullToString(form.Offiaddress),
      ADDRESS_DELIVARY: this.commonService.nullToString(form.Deladdress),
      BLOOD_GROUP: this.commonService.nullToString(form.bloodGroup),
      NO_OF_CHILDREN: 0,
      ZODIAC_SIGN: "",
      OCCUPATION: "",
      TEL_R_CODE: this.commonService.nullToString(form.telRCode)||"Str",
      TEL_O_CODE:  this.commonService.nullToString(form.telOCode)||"Str",
      SO_ALERT: true,
      PO_ALERT: true,
    };
  }

  formSubmit(flag: any) {
    
    this.close(this.setPostData());
    // let dataToparent = {
    //   FLAG: flag,
    //   POSTDATA: this.setPostData()

    // }
    // this.saveDetail.emit(dataToparent);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
    data.reopen = true;
  }

  deleteRecord(){}

  SPvalidateLookupFieldModified(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAMES: string[],
    isCurrencyField: boolean,
    lookupFields?: string[],
    FROMCODE?: boolean
  ) {
    const searchValue = event.target.value?.trim();

    // if (!searchValue || this.flag == "VIEW") return;

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

    const sub: Subscription = this.dataService
      .postDynamicAPI("MasterLookUp", param)
      .subscribe({
        next: (result: any) => {
          this.commonService.closeSnackBarMsg();
          const data = result.dynamicData?.[0];

          console.log("API Response Data:", data);

          if (data?.length) {
            console.log("In");

            if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
              let searchResult = this.commonService.searchAllItemsInArray(
                data,
                LOOKUPDATA.SEARCH_VALUE
              );

              console.log("Up");

              console.log("Filtered Search Result:", searchResult);

              if (searchResult?.length) {
                const matchedItem = searchResult[0];
                console.log(FORMNAMES);
                console.log(matchedItem);

                FORMNAMES.forEach((formName, index) => {
                  const field = lookupFields?.[index];
                  if (field && field in matchedItem) {
                    console.log(field);

                    this.contactMasterForm.controls[formName].setValue(
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

  clearRelevantFields(controllers: string[], LOOKUPDATA: MasterSearchModel) {
    controllers.forEach((controllerName) => {
      const control = this.contactMasterForm.controls[controllerName];
      if (control) {
        control.setValue("");
      } else {
        console.warn(`Control ${controllerName} not found in the form.`);
      }
    });

    this.clearLookupData(LOOKUPDATA, controllers);
  }

  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAMES: string[]) {
    LOOKUPDATA.SEARCH_VALUE = "";
    FORMNAMES.forEach((formName) => {
      this.contactMasterForm.controls[formName].setValue("");
    });
  }

  lookupKeyPress(event: any, form?: any) {
    if (event.key == "Tab" && event.target.value == "") {
      this.showOverleyPanel(event, form);
    }
    if (event.key === "Enter") {
      if (event.target.value == "") this.showOverleyPanel(event, form);
      event.preventDefault();
    }
  }
  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "CountryDes":
        this.overlayCountrySearch.showOverlayPanel(event);
        break;
      case "State":
        this.overlayStateSearch.showOverlayPanel(event);
        break;
      case "City":
        this.overlayCitySearch.showOverlayPanel(event);
        break;
        case "Naionality":
        this.overlayNationalitySearch.showOverlayPanel(event);
        break;
      case "Language":
        this.overlayLanguageSearch.showOverlayPanel(event);
        break;
      case "FavoriteFestival":
        this.overlayFestivalSearch.showOverlayPanel(event);
        break;
        case "Religion":
        this.overlayReligionSearch.showOverlayPanel(event);
        break;
      case "Category":
        this.overlayCategorySearch.showOverlayPanel(event);
        break;
      case "CustStatus":
        this.overlayStatusSearch.showOverlayPanel(event);
        break;
        case "AccountCode":
          this.overlayAccodeSearch.showOverlayPanel(event);
          break;
        case "SubLedgerCode":
          this.overlaySubCodeSearch.showOverlayPanel(event);
          break;

      default:
    }
  }
  onKeyDown(
    event: KeyboardEvent,
    controllers: string[],
    LOOKUPDATA: MasterSearchModel
  ) {
    const inputElement = event.target as HTMLInputElement;

    if (event.key === "Backspace" || event.key === "Delete") {
      console.log("DELETE");
      setTimeout(() => {
        if (inputElement.value.trim() === "") {
          this.clearRelevantFields(controllers, LOOKUPDATA);
        }
      }, 0);
    } else if (event.key == "Tab") {
      console.log("Tab");
      console.log(controllers);
      console.log(event);

      this.lookupKeyPress(event, controllers[0]);
    }
  }

}
