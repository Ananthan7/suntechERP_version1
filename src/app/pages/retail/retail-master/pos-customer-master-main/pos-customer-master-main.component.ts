import { Component, Input, OnInit, Renderer2, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";

@Component({
  selector: "app-pos-customer-master-main",
  templateUrl: "./pos-customer-master-main.component.html",
  styleUrls: ["./pos-customer-master-main.component.scss"],
})
export class PosCustomerMasterMainComponent implements OnInit {
  @ViewChild("overlayParentPosCode")
  overlayParentPosCode!: MasterSearchComponent;
  @ViewChild("overlayRefBy") overlayRefBy!: MasterSearchComponent;
  @ViewChild("overlayCountryCode") overlayCountryCode!: MasterSearchComponent;
  @ViewChild("overlayNationality") overlayNationality!: MasterSearchComponent;
  @ViewChild("overlayState") overlayState!: MasterSearchComponent;
  @ViewChild("overlayCity") overlayCity!: MasterSearchComponent;
  @ViewChild("overlayLanguage") overlayLanguage!: MasterSearchComponent;
  @ViewChild("overlayFavCelebration")
  overlayFavCelebration!: MasterSearchComponent;
  @ViewChild("overlayReligion") overlayReligion!: MasterSearchComponent;
  @ViewChild("overlayCategory") overlayCategory!: MasterSearchComponent;
  @ViewChild("overlayCustStatus") overlayCustStatus!: MasterSearchComponent;
  @ViewChild("overlayCustIdType") overlayCustIdType!: MasterSearchComponent;
  @ViewChild("overlayGifrPurchased")
  overlayGifrPurchased!: MasterSearchComponent;
  @ViewChild("overlayOccasionOfPurchase")
  overlayOccasionOfPurchase!: MasterSearchComponent;
  @ViewChild("overlayAgeGroup") overlayAgeGroup!: MasterSearchComponent;
  @ViewChild("overlayNextVisit") overlayNextVisit!: MasterSearchComponent;
  @ViewChild("overlayOccupation") overlayOccupation!: MasterSearchComponent;

  @ViewChild("overlayOccupation1") overlayOccupation1!: MasterSearchComponent;
  @ViewChild("overlaySourceOfFund")
  overlaySourceOfFund!: MasterSearchComponent;

  @ViewChild("overlayCustomerType") overlayCustomerType!: MasterSearchComponent;

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  @Input() amlNameValidation?: boolean;
  @Input() vocDetails?: any;
  genderList: any = [];
  maritalStatusList: any = [];
  nameList: any = [];
  bloodGroupList: any = [];
  opinionList: any = [];
  ratingList: any = [];
  branchCode?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  isCustProcessing: boolean = false;
  customerDetails: any = {};
  ishidden = true;
  selectedCountryISO2: any;
  countryListData: any;
  stateListData: any;
  selectedstateISO2: any;
  cityListData: any;
  amlValidation: any;
  // Dialog box
  dialogBox: any;
  dialogBoxResult: any;
  existCustomerCode: any;
  generatedCustomerCode: any;
  flag: any;
  image: File | null = null;
  editdata: any;

  amlNameValidationData = false;
  dummyDate = "1900-01-01T00:00:00";
  dummyDateArr = [
    "1900-01-01T00:00:00",
    "1900-01-01T00:00:00Z",
    "1754-01-01T00:00:00Z",
    "1754-01-01T00:00:00",
  ];
  typeidCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 29,
    SEARCH_FIELD: "Code",
    SEARCH_HEADING: "Type Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'ID MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  countryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Country Type",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='COUNTRY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  parentPosCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Parent Pos Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  refByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Ref By Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  nationalityCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Nationality",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='NATIONALITY MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  stateCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: "STATE_CODE",
    SEARCH_HEADING: "State Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  cityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "City Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='REGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  languageCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 45,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Language Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES = 'LANGUAGE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  favCelebrationCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Fav Celebration Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='FAVORITE CELEBRATION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  religionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Religion Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='RELIGION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  custStatusCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer Status Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='CUSTOMER STATUS MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  categoryCode: MasterSearchModel = {
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
  };

  giftPurchasedCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Gift Purchased For",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='GIFT PURCHASE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  occasionOfPurchaseCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Occasion Of Purchase",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='PURCHASE OCCASION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  ageGroupCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Age Group",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='AGEGROUP MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  nextVisitCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Next Visit",
    SEARCH_VALUE: "",
    WHERECONDITION: " TYPES='NEXT VISIT MASTER'  ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  occupationMasterCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Occupation ",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='OCCUPATION MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  customerTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer Type",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='CUSTOMER TYPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  sourceOfFundMasterCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Source of Fund and Wealth",
    SEARCH_VALUE: "",
    WHERECONDITION: "TYPES='SOURCE OF WEALTH AND FUNDS MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  posCustomerMasterMainForm: FormGroup = this.formBuilder.group({
    code: [""],
    parentPosCode: [""],
    refBy: [""],
    name: [""],
    nameDesc: ["", [Validators.maxLength(40)]],
    firstName: [""],
    middleName: [""],
    lastName: [""],
    creditCardLimitCheck: new FormControl({ value: "", disabled: false }),
    creditCardLimit: [
      { value: "", disabled: true },
      [Validators.maxLength(21)],
    ],
    gender: [""],
    maritalSt: [""],
    dob: [""],
    picture: [null],
    weddate: [""],
    country: [""],
    countryCode: [""],
    moblieCountry: [""],
    moblieNumber: [""],
    moblie1Country: [""],
    moblie1Number: [""],
    emailId: [
      "",
      [
        Validators.maxLength(40),
        Validators.required,
        Validators.email,
        this.domainValidator,
      ],
    ],
    telRCountry: [""],
    telRNumber: [""],
    tel0Country: [""],
    tel0number: [""],
    faxNo: ["", Validators.maxLength(15)],
    custType: ["", [Validators.required, Validators.maxLength(6)]],
    nationality: [""],
    state: [""],
    city: [""],
    language: [""],
    favCelebration: [""],
    vat: new FormControl("", [
      Validators.maxLength(15),
      Validators.pattern("^[0-9]*$"),
    ]),
    panNo: ["", [Validators.maxLength(10), this.panValidator]],
    whatsappCountryCode: [""],
    whatsappNumber: [""],
    spouse: ["", [Validators.maxLength(40)]],
    company: ["", [Validators.maxLength(40)]],
    zodiacSign: ["", [Validators.maxLength(15)]],
    noOfChildren: ["", [Validators.maxLength(5)]],
    religion: [""],
    occupation1: [""],
    sourceOfFund: [""],
    category: [""],
    custStatus: [""],
    income: [""],
    bloodGroup: [""],
    custIdType: [""],
    custID: [""],
    custDate: [""],
    POBox: ["", [Validators.maxLength(6)]],
    addressPersonal: [""],
    officialAddress: [""],
    deliveryAddress: [""],
    remarks: [""],
    sms: [false],
    phoneCall: [false],
    email: [false],
    whatsapp: [false],
    notInterested: [false],
    tv: [false],
    facebook: [""],
    amltype: [""],
    outdoor: [false],
    online: [false],
    socialMedia: [false],
    newspaper: [false],
    radio: [false],
    other: [false],
    promotionalOffers: [false],
    sportsEvents: [false],
    charityEvents: [false],
    stageShows: [false],
    seminars: [false],
    personalSkills: [false],
    productSelection: [""],
    service: [""],
    makingChanges: [""],
    brand: [""],
    buyBackPolicy: [""],
    loactionandParkingFacility: [""],
    staffCourtesy: [""],
    productKnowledgeOfOurStaff: [""],
    locationandAmbienceOfShop: [""],
    varietyAndQualityOfJewellery: [""],
    overallExperience: [""],
    showroomAccessibility: [""],
    productRangeAvailability: [""],
    reasonOfPurchase: [""],
    gifrPurchased: [{ value: "", disabled: true }],
    occasionOfPurchase: [""],
    ageGroup: [""],
    lookingFor: [""],
    nextVisit: [""],
    occupation: [""],
    createdBranch: [""],
    openedOn: [""],
    voucher: [""],
    saleDate: [""],
    branchLoc: [""],
    amount: [""],
    totalSale: [""],
    fcn_cust_detail_gender: [""],
    name1: [""],
    name2: [""],
    name3: [""],
    name4: [""],
    name5: [""],
    dob1: [""],
    dob2: [""],
    dob3: [""],
    dob4: [""],
    dob5: [""],
    spouseName: [""],
    fatherName: [""],
    aka: [""],
    fka: [""],
    unNumber: [""],
    designation: [""],
    goodQualityaka: [""],
    lowQualityaka: [""],
    nationalityCode1: [""],
    nationality1: [""],
    nationalityCode2: [""],
    nationality2: [""],
    nationalityCode3: [""],
    nationality3: [""],
    nationalityCode4: [""],
    nationality4: [""],
    nationalityCode5: [""],
    nationality5: [""],
    passport1: [""],
    passport2: [""],
    passport3: [""],
    passport4: [""],
    passport5: [""],
    listedOn: [""],
    nationalId: [""],
    addressFromAml: [""],
    otherInfo: [""],
    link: [""],
    twitter: [""],
    instagram: [""],
  });

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private apiService: SuntechAPIService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.existCustomerCode = this.content?.CODE;
    this.flag = this.content?.FLAG;
    this.generateCutomerCode();
    this.initialController(this.flag);
    this.creditLimitCheck();
    this.reasonOfPurchase();
    this.amlValidation = this.comService.allbranchMaster.AMLNAMEVALIDATION;
    this.posCustomerMasterMainForm.controls.weddate.disable();
    this.countryList();
    console.log(this.generatedCustomerCode);

    this.getDropDownStatus();

    this.posCustomerMasterMainForm.controls["createdBranch"].disable();
  }

  nameChange(event: any) {
    const value = event.target.value.toString().trim();
    console.log(value);

    // event.target.value = value;
    if (value != "") {
      const res = value.split(/\s+/);
      event.target.value = res.join(" ");

      this.posCustomerMasterMainForm.controls.firstName.setValue(res[0]);
      if (res.length == 1) {
        this.posCustomerMasterMainForm.controls.middleName.setValue("");
        this.posCustomerMasterMainForm.controls.lastName.setValue("");
      }
      if (res.length == 2) {
        this.posCustomerMasterMainForm.controls.middleName.setValue("");
        this.posCustomerMasterMainForm.controls.lastName.setValue(res[1]);
      }
      if (res.length > 2) {
        this.posCustomerMasterMainForm.controls.middleName.setValue(res[1]);
        res.splice(0, 2);
        this.posCustomerMasterMainForm.controls.lastName.setValue(
          res.join(" ")
        );
      }
      // if (source != "byAPI")
      //   this.renderer.selectRootElement("#fcn_cust_detail_phone")?.focus();
    } else {
      this.posCustomerMasterMainForm.controls.firstName.setValue("");
      this.posCustomerMasterMainForm.controls.middleName.setValue("");
      this.posCustomerMasterMainForm.controls.lastName.setValue("");
      this.amlNameValidationData = true;
    }
  }

  reasonOfPurchase() {
    this.posCustomerMasterMainForm
      .get("reasonOfPurchase")
      ?.valueChanges.subscribe((value) => {
        if (value === "Gift") {
          this.posCustomerMasterMainForm.get("gifrPurchased")?.enable();
        } else {
          this.posCustomerMasterMainForm.get("gifrPurchased")?.disable();
        }
      });
  }

  creditLimitCheck() {
    this.posCustomerMasterMainForm
      .get("creditCardLimitCheck")
      ?.valueChanges.subscribe((isChecked) => {
        if (isChecked) {
          this.posCustomerMasterMainForm.get("creditCardLimit")?.enable();
        } else {
          this.posCustomerMasterMainForm.get("creditCardLimit")?.disable();
        }
      });
  }

  initialController(FLAG: any) {
    if (FLAG === "VIEW") {
      this.ViewController();
    }
    if (FLAG === "EDIT") {
      this.editController();
    }
  }

  setvalues(setData: any) {
    this.posCustomerMasterMainForm.controls.nameDesc.setValue(setData.NAME);
    this.posCustomerMasterMainForm.controls.name.setValue(
      setData.POSCUSTPREFIX
    );

    this.posCustomerMasterMainForm.controls.company.setValue(setData.COMPANY);
    this.posCustomerMasterMainForm.controls.addressPersonal.setValue(
      setData.ADDRESS
    );
    this.posCustomerMasterMainForm.controls.POBox.setValue(setData.POBOX_NO);
    this.posCustomerMasterMainForm.controls.state.setValue(setData.STATE);
    this.posCustomerMasterMainForm.controls.city.setValue(setData.CITY);
    this.posCustomerMasterMainForm.controls.countryCode.setValue(
      setData.COUNTRY_CODE
    );
    this.posCustomerMasterMainForm.controls.emailId.setValue(setData.EMAIL);
    this.posCustomerMasterMainForm.controls.telRNumber.setValue(setData.TEL1);
    this.posCustomerMasterMainForm.controls.tel0number.setValue(setData.TEL2);
    this.posCustomerMasterMainForm.controls.moblieNumber.setValue(
      setData.MOBILE
    );
    this.posCustomerMasterMainForm.controls.faxNo.setValue(setData.FAX);
    this.posCustomerMasterMainForm.controls.maritalSt.setValue(
      setData.MARITAL_ST
    );
    this.posCustomerMasterMainForm.controls.weddate.setValue(setData.WED_DATE);
    this.posCustomerMasterMainForm.controls.spouse.setValue(
      setData.SPOUSE_NAME
    );
    this.posCustomerMasterMainForm.controls.remarks.setValue(setData.REMARKS);
    this.posCustomerMasterMainForm.controls.dob.setValue(setData.DATE_OF_BIRTH);
    this.posCustomerMasterMainForm.controls.openedOn.setValue(
      setData.OPENING_ON
    );
    this.posCustomerMasterMainForm.controls.gender.setValue(setData.GENDER);
    this.posCustomerMasterMainForm.controls.religion.setValue(setData.RELIGION);
    this.posCustomerMasterMainForm.controls.nationality.setValue(
      setData.NATIONALITY
    );
    this.posCustomerMasterMainForm.controls.custType.setValue(setData.TYPE);
    this.posCustomerMasterMainForm.controls.category.setValue(setData.CATEGORY);
    this.posCustomerMasterMainForm.controls.income.setValue(setData.INCOME);
    this.posCustomerMasterMainForm.controls.custStatus.setValue(
      setData.CUST_STATUS
    );
    this.posCustomerMasterMainForm.controls.picture.setValue(setData.PICTURE);
    this.posCustomerMasterMainForm.controls.voucher.setValue(
      setData.SALVOCTYPE_NO
    );
    this.posCustomerMasterMainForm.controls.saleDate.setValue(setData.SALDATE);
    this.posCustomerMasterMainForm.controls.amount.setValue(setData.SALAMOUNT);
    this.posCustomerMasterMainForm.controls.branchLoc.setValue(
      setData.SALBRLOC
    );
    this.posCustomerMasterMainForm.controls.createdBranch.setValue(
      setData.BRANCH_CODE
    );
    this.posCustomerMasterMainForm.controls.totalSale.setValue(
      setData.TOTALSALES
    );
    this.posCustomerMasterMainForm.controls.custID.setValue(
      setData.POSCUSTIDNO
    );
    this.posCustomerMasterMainForm.controls.custID.setValue(
      setData.POSCUSTIDNO
    );
    this.posCustomerMasterMainForm.controls.moblie1Number.setValue(
      setData.MOBILE1
    );
    this.posCustomerMasterMainForm.controls.language.setValue(
      setData.CUST_LANGUAGE
    );
    this.posCustomerMasterMainForm.controls.custType.setValue(
      setData.CUST_TYPE
    );
    this.posCustomerMasterMainForm.controls.moblieCountry.setValue(
      setData.MOBILECODE1
    );
    this.posCustomerMasterMainForm.controls.moblie1Country.setValue(
      setData.MOBILECODE2
    );
    this.posCustomerMasterMainForm.controls.custIdType.setValue(
      setData.IDCATEGORY
    );
    this.posCustomerMasterMainForm.controls.officialAddress.setValue(
      setData.ADDRESS_OFFICIAL
    );
    this.posCustomerMasterMainForm.controls.deliveryAddress.setValue(
      setData.ADDRESS_DELIVARY
    );
    // this.posCustomerMasterMainForm.controls.deliveryAddress.setValue(
    //   setData.INTERESTED_IN
    // );
    this.posCustomerMasterMainForm.controls.bloodGroup.setValue(
      setData.BLOOD_GROUP
    );
    this.posCustomerMasterMainForm.controls.noOfChildren.setValue(
      setData.NO_OF_CHILDREN
    );
    this.posCustomerMasterMainForm.controls.zodiacSign.setValue(
      setData.ZODIAC_SIGN
    );
    this.posCustomerMasterMainForm.controls.designation.setValue(
      setData.DESIGNATION
    );
    this.posCustomerMasterMainForm.controls.amltype.setValue(setData.AML_TYPE);
    this.posCustomerMasterMainForm.controls.unNumber.setValue(
      setData.UN_NUMBER
    );
    this.posCustomerMasterMainForm.controls.name1.setValue(setData.NAME_1);
    this.posCustomerMasterMainForm.controls.name2.setValue(setData.NAME_2);
    this.posCustomerMasterMainForm.controls.name3.setValue(setData.NAME_3);
    this.posCustomerMasterMainForm.controls.name4.setValue(setData.NAME_4);
    this.posCustomerMasterMainForm.controls.name5.setValue(setData.NAME_5);
    this.posCustomerMasterMainForm.controls.dob2.setValue(setData.DOB_2);
    this.posCustomerMasterMainForm.controls.dob3.setValue(setData.DOB_3);
    this.posCustomerMasterMainForm.controls.dob4.setValue(setData.DOB_4);
    this.posCustomerMasterMainForm.controls.dob5.setValue(setData.DOB_5);
    this.posCustomerMasterMainForm.controls.goodQualityaka.setValue(
      setData.GOOD_QUALITY
    );

    this.posCustomerMasterMainForm.controls.lowQualityaka.setValue(
      setData.LOW_QUALITY
    );

    this.posCustomerMasterMainForm.controls.aka.setValue(setData.A_K_A);

    this.posCustomerMasterMainForm.controls.fka.setValue(setData.F_K_A);

    this.posCustomerMasterMainForm.controls.nationality2.setValue(
      setData.NATIONALITY_2
    );
    this.posCustomerMasterMainForm.controls.nationality3.setValue(
      setData.NATIONALITY_3
    );
    this.posCustomerMasterMainForm.controls.nationality4.setValue(
      setData.NATIONALITY_4
    );
    this.posCustomerMasterMainForm.controls.nationality5.setValue(
      setData.NATIONALITY_5
    );
    this.posCustomerMasterMainForm.controls.passport1.setValue(
      setData.PASSPORT_NO_1
    );
    this.posCustomerMasterMainForm.controls.passport2.setValue(
      setData.PASSPORT_NO_2
    );
    this.posCustomerMasterMainForm.controls.passport3.setValue(
      setData.PASSPORT_NO_3
    );
    this.posCustomerMasterMainForm.controls.passport4.setValue(
      setData.PASSPORT_NO_4
    );
    this.posCustomerMasterMainForm.controls.passport5.setValue(
      setData.PASSPORT_NO_5
    );
    this.posCustomerMasterMainForm.controls.listedOn.setValue(
      setData.LISTED_ON_DATE
    );
    this.posCustomerMasterMainForm.controls.link.setValue(setData.LINKS);
    this.posCustomerMasterMainForm.controls.fatherName.setValue(
      setData.FATHERNAME
    );
    this.posCustomerMasterMainForm.controls.fatherName.setValue(
      setData.FATHERNAME
    );
  }

  editController() {
    this.ViewController();
  }

  ViewController() {
    let API = `PosCustomerMaster/GetCustomerByCode/${this.existCustomerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status == "Success") {
          console.log(res.response);
          this.editdata = res.response;

          this.setvalues(this.editdata);
        }
      });
  }

  genderChanger(event: any) {
    const selectedName = event;

    // Map name to gender
    switch (selectedName) {
      case "Mr.":
        this.posCustomerMasterMainForm.controls.gender.setValue("Male");
        break;
      case "Ms.":
      case "Mrs.":
        this.posCustomerMasterMainForm.controls.gender.setValue("Female");
        break;
      default:
        this.posCustomerMasterMainForm.controls.gender.reset();
    }
  }

  countryList() {
    let API = `CountryMaster/GetCountryMasterHeaderList`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.countryListData = res.response.map((country: any) => country);
    });
  }

  onCountrySelect(iso2Code: string) {
    this.selectedCountryISO2 = iso2Code;
    console.log("Selected Country ISO2: ", this.selectedCountryISO2);

    let API = `CountryMaster/GetStateList/${this.selectedCountryISO2}`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.stateListData = res.response;
      console.log(this.stateListData);
    });
  }

  onWeddingIsIt(value: any) {
    console.log(value);
    if (value === "Married") {
      this.posCustomerMasterMainForm.controls.weddate.enable();
    } else if (value !== "Married") {
      this.posCustomerMasterMainForm.controls.weddate.disable();
    }
  }

  onCitySelect(iso2Code: string) {
    this.selectedstateISO2 = iso2Code;
    console.log("Selected Country ISO2: ", this.selectedstateISO2);

    let API = `CountryMaster/GetCityList/${this.selectedCountryISO2}/${this.selectedstateISO2}/`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.cityListData = res.response;
      console.log(this.cityListData);
    });
  }

  onPanNoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.posCustomerMasterMainForm.get("panNo")?.setValue(input.value);
  }

  panValidator(control: AbstractControl): ValidationErrors | null {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (control.value && !panPattern.test(control.value)) {
      return { invalidPan: true };
    }
    return null;
  }

  domainValidator(control: AbstractControl): ValidationErrors | null {
    const emailValue = control.value;
    if (emailValue && !/^[\w-\.]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(emailValue)) {
      return { domainInvalid: true };
    }
    return null;
  }

  getUniqueValues(List: any[], field: string) {
    return List.filter(
      (item, index, self) =>
        index ===
        self.findIndex((t) => t[field] === item[field] && t[field] !== "")
    );
  }

  generateCutomerCode() {
    if (this.existCustomerCode) {
      this.posCustomerMasterMainForm.controls.code.setValue(
        this.existCustomerCode
      );
    } else {
      let API = `PosCustomerCodeAutoGenerate`;
      let sub: Subscription = this.apiService
        .getDynamicAPIWithoutBranch(API)
        .subscribe((res) => {
          if (res.status == "Success") {
            this.generatedCustomerCode = res.PosCustomerCode;
            this.posCustomerMasterMainForm.controls.code.setValue(
              this.generatedCustomerCode
            );
          }
        });
    }
  }

  countrySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.country.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.countryCode.setValue(e.DESCRIPTION);
    this.posCustomerMasterMainForm.controls.moblieCountry.setValue(
      e.MobileCountryCode
    );
    this.posCustomerMasterMainForm.controls.moblie1Country.setValue(
      e.MobileCountryCode
    );
    this.posCustomerMasterMainForm.controls.telRCountry.setValue(
      e.MobileCountryCode
    );
    this.posCustomerMasterMainForm.controls.tel0Country.setValue(
      e.MobileCountryCode
    );
    this.posCustomerMasterMainForm.controls.whatsappCountryCode.setValue(
      e.MobileCountryCode
    );
  }

  check() {
    const isNotInterestedChecked =
      this.posCustomerMasterMainForm.controls.notInterested.value;

    if (isNotInterestedChecked) {
      this.posCustomerMasterMainForm.controls.whatsapp.setValue(false);
      this.posCustomerMasterMainForm.controls.email.setValue(false);
      this.posCustomerMasterMainForm.controls.phoneCall.setValue(false);
      this.posCustomerMasterMainForm.controls.sms.setValue(false);

      this.posCustomerMasterMainForm.controls.whatsapp.disable();
      this.posCustomerMasterMainForm.controls.email.disable();
      this.posCustomerMasterMainForm.controls.phoneCall.disable();
      this.posCustomerMasterMainForm.controls.sms.disable();
    } else {
      this.posCustomerMasterMainForm.controls.whatsapp.enable();
      this.posCustomerMasterMainForm.controls.email.enable();
      this.posCustomerMasterMainForm.controls.phoneCall.enable();
      this.posCustomerMasterMainForm.controls.sms.enable();

      this.posCustomerMasterMainForm.controls.whatsapp.reset();
      this.posCustomerMasterMainForm.controls.email.reset();
      this.posCustomerMasterMainForm.controls.phoneCall.reset();
      this.posCustomerMasterMainForm.controls.sms.reset();
    }
  }
  // social_media(){
  //   const isChecked = this.posCustomerMasterMainForm.controls.socialMedia.value;
  //   if(isChecked){
  //       var field = document.getElementById('social_fields');
  //       field?.style.display = show
  //       }else{

  //   }
  // }

  toggle() {
    this.ishidden = !this.ishidden;
  }

  typeidCodeSelected(e: any) {
    console.log(e);

    if (!this.posCustomerMasterMainForm.controls.countryCode.value) {
      return alert("please Select the Country Fisrt ");
    }

    let value = "United Arab Emirates";
    let code = "EID";

    if (
      this.posCustomerMasterMainForm.controls.countryCode.value !== value &&
      e.CODE === code
    ) {
      return alert(
        "Please select the UAE. Which ID you selected belongs to this country?"
      );
    }

    this.posCustomerMasterMainForm.controls.custIdType.setValue(e.CODE);
  }

  stateSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.state.setValue(e.STATE_DESCRIPTION);
  }

  categorySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.category.setValue(e.DESCRIPTION);
  }

  parentPosSelected(e: any) {
    console.log(e.CODE.tostring());
    this.posCustomerMasterMainForm.controls.parentPosCode.setValue(e.CODE);
    console.log(
      this.posCustomerMasterMainForm.controls.parentPosCode.value.toString()
    );
  }

  refBySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.refBy.setValue(e.CODE);
  }

  nationalitySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.nationality.setValue(e.DESCRIPTION);
  }

  citySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.city.setValue(e.DESCRIPTION);
  }

  languageSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.language.setValue(e.CODE);
  }

  favCelebrationSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.favCelebration.setValue(e.CODE);
  }

  religionSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.religion.setValue(e.DESCRIPTION);
  }

  custStatusSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.custStatus.setValue(e.DESCRIPTION);
  }

  giftPurchasedSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.gifrPurchased.setValue(e.CODE);
  }

  occasionOfPurchaseSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.occasionOfPurchase.setValue(e.CODE);
  }

  ageGroupSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.ageGroup.setValue(e.CODE);
  }

  nextVisitSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.nextVisit.setValue(e.CODE);
  }

  occupationMasterSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.occupation.setValue(e.CODE);
  }

  occupation1MasterSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.occupation1.setValue(e.CODE);
  }

  customerTypeSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.custType.setValue(e.CODE);
  }

  sourceOfFundMasterSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.sourceOfFund.setValue(e.CODE);
  }

  getDropDownStatus() {
    this.maritalStatusList = this.getUniqueValues(
      this.comService.getComboFilterByID("Marital Status"),
      "ENGLISH"
    );
    this.genderList = this.getUniqueValues(
      this.comService.getComboFilterByID("gender"),
      "ENGLISH"
    );
    this.nameList = this.getUniqueValues(
      this.comService.getComboFilterByID("POS Customer Prefix"),
      "ENGLISH"
    );
    this.bloodGroupList = this.getUniqueValues(
      this.comService.getComboFilterByID("Blood Group"),
      "ENGLISH"
    );
    this.opinionList = this.getUniqueValues(
      this.comService.getComboFilterByID("Customer Opinion"),
      "ENGLISH"
    );
    this.ratingList = this.getUniqueValues(
      this.comService.getComboFilterByID("Customer Rating"),
      "ENGLISH"
    );
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  customerSave() {
    if (
      this.posCustomerMasterMainForm.value.moblieNumber == "" &&
      this.posCustomerMasterMainForm.value.telRNumber == ""
    ) {
      Swal.fire({
        title: "Warning",
        text: "Atleast One of the Field is Manditory Mobile Number (OR) Telephone Number",
        icon: "warning",
        confirmButtonColor: "#336699",
        confirmButtonText: "Ok",
      });
      return;
    }

    if (!this.isCustProcessing || this.isCustProcessing) {
      this.isCustProcessing = true;
      // this.modalService.
      // if (this.amlNameValidation) {

      // trigger form errors
      Object.values(this.posCustomerMasterMainForm.controls).forEach(
        (control) => {
          control.markAsTouched();
        }
      );

      if (!this.posCustomerMasterMainForm.invalid) {
        const posCustomer = {
          CODE: this.posCustomerMasterMainForm.value.code || "",
          NAME: this.posCustomerMasterMainForm.value.nameDesc || "",
          COMPANY: this.posCustomerMasterMainForm.value.company || "",
          ADDRESS: this.posCustomerMasterMainForm.value.addressPersonal || "",
          POBOX_NO: this.posCustomerMasterMainForm.value.POBox || "",
          STATE: this.posCustomerMasterMainForm.value.state || "",
          CITY: this.posCustomerMasterMainForm.value.city || "",
          ZIPCODE: "",
          COUNTRY_CODE: this.posCustomerMasterMainForm.value.country || "",
          EMAIL: this.posCustomerMasterMainForm.value.emailId || "",
          TEL1:
            this.posCustomerMasterMainForm.value.telRNumber.toString() || "",
          TEL2:
            this.posCustomerMasterMainForm.value.tel0number.toString() || "",
          MOBILE:
            this.posCustomerMasterMainForm.value.moblieNumber.toString() || "",
          FAX: this.posCustomerMasterMainForm.value.faxNo.toString() || "",
          MARITAL_ST:
            this.posCustomerMasterMainForm.value.maritalSt || "Unknown",
          WED_DATE:
            this.posCustomerMasterMainForm.value.weddate || this.dummyDate,
          SPOUSE_NAME: this.posCustomerMasterMainForm.value.spouse || "",
          REMARKS: this.posCustomerMasterMainForm.value.remarks || "",
          DATE_OF_BIRTH:
            this.posCustomerMasterMainForm.value.dob || this.dummyDate,
          OPENING_ON:
            this.posCustomerMasterMainForm.value.openedOn ??
            "1900-01-01T00:00:00",
          GENDER: this.posCustomerMasterMainForm.value.gender || "",
          REGION: "",
          NATIONALITY: this.posCustomerMasterMainForm.value.nationality || "",
          RELIGION: this.posCustomerMasterMainForm.value.religion || "",
          TYPE: "",
          CATEGORY: this.posCustomerMasterMainForm.value.category || "",
          INCOME: this.posCustomerMasterMainForm.value.income,
          CUST_STATUS: this.posCustomerMasterMainForm.value.custStatus || "",
          MID: 0,
          PICTURE_NAME: "",
          PICTURE: "",
          SALVOCTYPE_NO: this.posCustomerMasterMainForm.value.voucher || "",
          SALDATE: this.posCustomerMasterMainForm.value.date || this.dummyDate,
          SALAMOUNT: this.posCustomerMasterMainForm.value.amount || 0,
          SALBRLOC: this.posCustomerMasterMainForm.value.branchLoc || "",
          Branch_Code: this.branchCode,
          TOTALSALES: this.posCustomerMasterMainForm.value.totalSale || 0,
          POSCUSTIDNO: this.posCustomerMasterMainForm.value.custID || "",
          POSSMAN: "",
          POSCUSTPREFIX: this.posCustomerMasterMainForm.value.name || "",
          MOBILE1:
            this.posCustomerMasterMainForm.value.moblie1Number.toString() || "",
          CUST_Language: this.posCustomerMasterMainForm.value.language || "",
          CUST_TYPE: this.posCustomerMasterMainForm.value.custType || "",
          FAVORITE_CELEB:
            this.posCustomerMasterMainForm.value.favCelebration || "",
          STAFF_COURTESY:
            this.posCustomerMasterMainForm.value.staffCourtesy || "",
          PRODUCT_KNOWLEDGE:
            this.posCustomerMasterMainForm.value.productKnowledgeOfOurStaff ||
            " ",
          LOCATION_AMBIENCE:
            this.posCustomerMasterMainForm.value.locationandAmbienceOfShop ||
            "",
          VARIETY_QUALITY:
            this.posCustomerMasterMainForm.value.varietyAndQualityOfJewellery ||
            "",
          OVERALL_EXP:
            this.posCustomerMasterMainForm.value.overallExperience || "",
          PRODUCT_SELECTION:
            this.posCustomerMasterMainForm.value.productSelection || "",
          SERVICE: this.posCustomerMasterMainForm.value.service || "",
          MAKING_CHARGES:
            this.posCustomerMasterMainForm.value.makingChanges || "",
          BRAND_NAME: this.posCustomerMasterMainForm.value.brand || "",
          BUY_BACK: this.posCustomerMasterMainForm.value.buyBackPolicy || "",
          LOCATION_PARKING:
            this.posCustomerMasterMainForm.value.loactionandParkingFacility ||
            "",
          SOURCE: "",
          PREFERENCE_CONTACT: "",
          MOBILECODE1:
            this.posCustomerMasterMainForm.value.moblieCountry.toString() || "",
          MOBILECODE2:
            this.posCustomerMasterMainForm.value.moblie1Country || "",
          IDCATEGORY: this.posCustomerMasterMainForm.value.custIdType || "",
          ADDRESS_OFFICIAL:
            this.posCustomerMasterMainForm.value.officialAddress || "",
          ADDRESS_DELIVARY:
            this.posCustomerMasterMainForm.value.deliveryAddress || "",
          INTERESTED_IN: "",
          BLOOD_GROUP: this.posCustomerMasterMainForm.value.bloodGroup || "",
          NO_OF_CHILDREN:
            Number(this.posCustomerMasterMainForm.value.noOfChildren) || 0,
          ZODIAC_SIGN: this.posCustomerMasterMainForm.value.zodiacSign || "",
          DESIGNATION: this.posCustomerMasterMainForm.value.designation || "",
          LEVELFLAG: 0,
          INCOMERANGE: "",
          LAST_UPDATED_DATE: "1900-01-01T00:00:00",

          TAXOFFICENO: "",
          SALESMANNAME: "",
          DEFAULT_DISDIAMONDPERCENT: 0,
          DEFAULT_DISMETALPERCENT: 0,
          LOYALTYALLOW: false,
          LOYALTYALLOWEMAIL: false,
          LOYALTYALLOWSMS: false,
          SENDPROMOTIONALEMAIL: false,
          LOYALTY_CODE: "",
          PREFERRED_COLOR: "",
          PREFERRED_ITEM: "",
          WRIST_SIZE: "",
          FINGER_SIZE: "",
          LOYALTY_POINT: 0,
          FIRSTNAME: this.posCustomerMasterMainForm.value.firstName || "",
          MIDDLENAME: this.posCustomerMasterMainForm.value.middleName || "",
          LASTNAME: this.posCustomerMasterMainForm.value.lastName || "",
          POSKnownAbout: 0,
          CIVILID_IMGPATH: "",
          SUGGESTION: "",
          AMLNAMEVALIDATION: false,
          AML_TYPE: false,
          UN_NUMBER: "",
          NAME_1: this.posCustomerMasterMainForm.value.name1 || "",
          NAME_2: this.posCustomerMasterMainForm.value.name2 || "",
          NAME_3: this.posCustomerMasterMainForm.value.name3 || "",
          NAME_4: this.posCustomerMasterMainForm.value.name4 || "",
          NAME_5: this.posCustomerMasterMainForm.value.name5 || "",
          DOB_2: this.posCustomerMasterMainForm.value.dob2 || "",
          DOB_3: this.posCustomerMasterMainForm.value.dob3 || "",
          DOB_4: this.posCustomerMasterMainForm.value.dob4 || "",
          DOB_5: this.posCustomerMasterMainForm.value.dob5 || "",
          GOOD_QUALITY:
            this.posCustomerMasterMainForm.value.goodQualityaka || "",
          LOW_QUALITY: this.posCustomerMasterMainForm.value.lowQualityaka || "",
          A_K_A: this.posCustomerMasterMainForm.value.aka || "",
          F_K_A: this.posCustomerMasterMainForm.value.fka || "",
          NATIONALITY_2:
            this.posCustomerMasterMainForm.value.nationality2 || "",
          NATIONALITY_3:
            this.posCustomerMasterMainForm.value.nationality3 || "",
          NATIONALITY_4:
            this.posCustomerMasterMainForm.value.nationality4 || "",
          NATIONALITY_5:
            this.posCustomerMasterMainForm.value.nationality5 || "",
          PASSPORT_NO_1: this.posCustomerMasterMainForm.value.passport1 || "",
          PASSPORT_NO_2: this.posCustomerMasterMainForm.value.passport2 || "",
          PASSPORT_NO_3: this.posCustomerMasterMainForm.value.passport3 || "",
          PASSPORT_NO_4: this.posCustomerMasterMainForm.value.passport4 || "",
          PASSPORT_NO_5: this.posCustomerMasterMainForm.value.passport5 || "",
          LISTED_ON_DATE: this.posCustomerMasterMainForm.value.listedOn,
          NATIONAL_IDENTIFICATION_NO:
            this.posCustomerMasterMainForm.value.fcn_cust_detail_idcard || "",
          OTHER_INFORMATION: "",
          LINKS: this.posCustomerMasterMainForm.value.link || "",
          FATHERNAME: this.posCustomerMasterMainForm.value.fatherName || "",
          PROMO_NEEDED: "",
          PROMO_HOW_OFTEN: "",
          CHILDNAME1: "",
          CHILDNAME2: "",
          CHILDNAME3: "",
          CHILDNAME4: "",
          CHILDDATEOFBIRTH1: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH2: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH3: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH4: "1900-01-01T00:00:00",
          OTHERNAMES: "",
          AUTOCREATEMST: false,
          WUPMOBILECODE:
            this.posCustomerMasterMainForm.value.whatsappCountryCode,
          WUPMOBILENO:
            this.posCustomerMasterMainForm.value.whatsappNumber.toString(),
          OCCUPATION: "",
          ShowRoomAccessibility: "",
          ProductRangeAvailability: "",
          DIGISCREENED: false,
          BR_CODE: "",
          SPOUSE_DATE_OF_BIRTH: "1900-01-01T00:00:00",
          TEL_R_CODE: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.telRCountry
          )}`,
          TEL_O_CODE: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.tel0Country
          )}`,
          GST_NUMBER: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.fcn_cust_detail_city
          )}`,
          VAT_NUMBER: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.vat
          )}`,
          PARENT_CODE:
            this.posCustomerMasterMainForm.value.parentPosCode.toString(),
          REFERED_BY: this.posCustomerMasterMainForm.value.refBy.toString(),
          CREDIT_LIMIT:
            this.posCustomerMasterMainForm.value.creditCardLimit || 0,
          CREDIT_LIMIT_STATUS: false,
          PANCARDNO:
            this.posCustomerMasterMainForm.value.panNo || "111111" || "",
          VOCTYPE: this.vocDetails?.VOCTYPE ?? "",
          YEARMONTH: this.vocDetails?.YEARMONTH ?? localStorage.getItem("YEAR"),
          VOCNO: this.vocDetails?.VOCNO ?? 0,
          VOCDATE: this.vocDetails?.VOCDATE ?? "1900-01-01T00:00:00",

          OT_TRANSFER_TIME: "",
          COUNTRY_DESC: this.posCustomerMasterMainForm.value.countryCode || "",
          STATE_DESC: "",
          CITY_DESC: "",
          FAVORITE_CELEB_DESC: "",
          RELIGION_DESC: "",
          CATEGORY_DESC: "",
          CUST_STATUS_DESC: "",
          NATIONALITY_DESC: "",
          TYPE_DESC: "",
          DETAILS_JOHARA: "",
          DETAILS_FARAH: "",
          DETAILS_JAWAHERALSHARQ: "",
          FESTIVAL_EID: false,
          FESTIVAL_CHRISTMAS: false,
          FESTIVAL_DIWALI: false,
          FESTIVAL_NATIONALDAY: false,
          FESTIVAL_ONAM: false,
          FESTIVAL_PONGAL: false,
          FESTIVAL_NEWYEAR: false,
          REASON_OF_PURCHASE:
            this.posCustomerMasterMainForm.value.reasonOfPurchase || "",
          AGE_GROUP: this.posCustomerMasterMainForm.value.ageGroup || "",
          GIFT_PURCHASED_FOR:
            this.posCustomerMasterMainForm.value.gifrPurchased || "",
          PURCHASE_OCCASION:
            this.posCustomerMasterMainForm.value.occasionOfPurchase || "",
          NEXT_VISIT: this.posCustomerMasterMainForm.value.nextVisit,
          SHOWROOMACCESSIBILITY:
            this.posCustomerMasterMainForm.value.showroomAccessibility || "",
          PRODUCTRANGEAVAILABILITY:
            this.posCustomerMasterMainForm.value.productRangeAvailability || "",
          LOOKING_FOR: "",
          POSCUSTIDEXP_DATE: this.posCustomerMasterMainForm.value.custDate
            ? this.posCustomerMasterMainForm.value.custDate
            : "1900-01-01T00:00:00",

          ATTACHMENT_FROM_SCANNER: false,
          GOOD_QUALITY_A_K_A: "",
          LOW_QUALITY_A_K_A: "",
          POSKNOWNABOUT: 0,
        };

        // const apiCtrl =
        //   posCustomer.CODE &&
        //     posCustomer.CODE != '' &&
        //     posCustomer.CODE.toString() != '0'
        //     ? `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`
        //     : 'PosCustomerMaster/InsertCustomerMaster';

        let apiCtrl;
        let method;
        let custResponse;
        if (this.content?.FLAG == "EDIT") {
          apiCtrl = `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`;
          custResponse = this.apiService.putDynamicAPI(apiCtrl, posCustomer);
        } else {
          apiCtrl = "PosCustomerMaster/InsertCustomerMaster";
          custResponse = this.apiService.postDynamicAPI(apiCtrl, posCustomer);
        }

        custResponse.subscribe(async (data) => {
          this.isCustProcessing = false;

          if (data.status == "Success") {
            this.customerDetails = await data.response;

            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_phone"
            ].setValue(this.customerDetails.MOBILE);
            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_email"
            ].setValue(this.customerDetails.EMAIL);
            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_address"
            ].setValue(this.customerDetails.ADDRESS);
            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_country"
            ].setValue(this.customerDetails.COUNTRY_CODE);
            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_city"
            ].setValue(this.customerDetails.CITY);
            this.posCustomerMasterMainForm.controls[
              "fcn_cust_detail_idcard"
            ].setValue(this.customerDetails.NATIONAL_IDENTIFICATION_NO);
            // Customer data
            this.posCustomerMasterMainForm.controls.fcn_customer_detail_name.setValue(
              this.customerDetails.NAME
            );
            this.posCustomerMasterMainForm.controls.fcn_customer_detail_fname.setValue(
              this.customerDetails.FIRSTNAME
            );
            this.posCustomerMasterMainForm.controls.fcn_customer_detail_mname.setValue(
              this.customerDetails.MIDDLENAME
            );
            this.posCustomerMasterMainForm.controls.fcn_customer_detail_lname.setValue(
              this.customerDetails.LASTNAME
            );
            this.posCustomerMasterMainForm.controls.fcn_cust_detail_phone2.setValue(
              this.customerDetails.TEL2
            );
            this.posCustomerMasterMainForm.controls.fcn_cust_detail_gender.setValue(
              this.customerDetails.GENDER
            );
            this.posCustomerMasterMainForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            this.posCustomerMasterMainForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            this.posCustomerMasterMainForm.controls.fcn_cust_detail_dob.setValue(
              this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
            );
            // this.snackBar.open('Customer details saved successfully');
            // this.snackBar.dismiss();
            this.snackBar.open("Customer details saved successfully", "", {
              duration: 1000, // time in milliseconds
            });

            // ${data.AMLDIGICOMPANYNAME}/${data.AMLDIGIUSERNAME}/${data.AMLDIGIPASSWORD}/${data.CODE}/${data.FIRSTNAME}/${data.MIDDLENAME}/${data.LASTNAME}/%27%27/${data.POSCustIDNo}/${data.NATIONALITY}/${data.DATE_OF_BIRTH}/${data.CUST_Type}/${data.AMLUSERID}/${data.AMLDIGITHRESHOLD}/${data.AMLDIGICOMPANYNAME}/1/${data.DIGIIPPATH}`);
            if (this.amlNameValidation && !this.customerDetails.DIGISCREENED) {
              this.isCustProcessing = true;

              // const custCodeWithAcCode =
              //   this.comService.allbranchMaster?.DIGICOMPACCODE &&
              //     this.comService.allbranchMaster?.DIGICOMPACCODE != ''
              //     ? `${this.comService.allbranchMaster?.DIGICOMPACCODE}/${this.customerDetails.CODE}`
              //     : this.customerDetails.CODE;

              const payload = {
                AMLDIGICOMPANYNAME: encodeURIComponent(
                  this.comService.allbranchMaster.AMLDIGICOMPANYNAME || " "
                ),
                AMLDIGIUSERNAME: encodeURIComponent(
                  this.comService.allbranchMaster.AMLDIGIUSERNAME || " "
                ),
                AMLDIGIPASSWORD: encodeURIComponent(
                  this.comService.allbranchMaster.AMLDIGIPASSWORD || " "
                ),
                CODE: encodeURIComponent(this.customerDetails.CODE || " "),
                FIRSTNAME: "",
                // encodeURIComponent(this.customerDetails.FIRSTNAME)
                // || '%27%27'
                MIDDLENAME: "",
                // encodeURIComponent(this.customerDetails.MIDDLENAME)
                // || '%27%27'
                LASTNAME:
                  encodeURIComponent(
                    this.customerDetails.NAME //
                    // this.customerDetails.LASTNAME || ''
                  ) || "",
                NATIONALITY: encodeURIComponent(
                  this.customerDetails.NATIONALITY
                ),
                // ||                '%27%27',
                // NATIONALITY:  encodeURIComponent(this.customerDetails.NATIONALITY || ' '),
                DATE_OF_BIRTH:
                  // this.comService.nullOrEmpty(

                  encodeURIComponent(
                    this.comService.convertDateToMDY(
                      this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
                    )
                  ),
                // CUST_Type: this.comService.nullOrEmpty(
                //   encodeURIComponent(this.customerDetails.CUST_TYPE),
                //   '%27%27'),
                CUST_Type: encodeURIComponent("I"),

                // CUST_Type: encodeURIComponent(
                //   this.customerDetails.CUST_Type || ' '
                // ),
                AMLUSERID: encodeURIComponent(
                  this.comService.allbranchMaster.AMLUSERID
                ),
                AMLDIGITHRESHOLD:
                  encodeURIComponent(
                    this.comService.allbranchMaster.AMLDIGITHRESHOLD
                  ) || "%27%27",
                DIGIIPPATH:
                  encodeURIComponent(
                    this.comService.allbranchMaster.DIGIIPPATH
                  ) || "%27%27",
                Gender:
                  encodeURIComponent(this.customerDetails?.GENDER) || "%27%27",
                CustomerIdType:
                  encodeURIComponent(this.customerDetails?.IDCATEGORY) ||
                  "%27%27",
                CustomerIdNumber:
                  encodeURIComponent(
                    this.customerDetails?.NATIONAL_IDENTIFICATION_NO
                  ) || "%27%27",
              };
              this.snackBar.open("Loading...");

              // companyname=${data.AMLDIGICOMPANYNAME}&username=${data.AMLDIGIUSERNAME}&Password=${data.AMLDIGIPASSWORD}&CustomerId=${data.CODE}&FirstName=${data.FIRSTNAME}&MiddleName=${data.MIDDLENAME}&LastName=${data.LASTNAME}&MatchCategory=&CustomerIdNumber=${data.CustomerIdNumber}&Nationality=${data.NATIONALITY}&DOB=${data.DATE_OF_BIRTH}&CustomerType=${data.CUST_Type}&UserId=${data.AMLUSERID}&Threshold=${data.AMLDIGITHRESHOLD}&CompName=${data.AMLDIGICOMPANYNAME}&GeneratePayload=1&IPPath=${data.DIGIIPPATH}&Gender=${data.Gender}&CustomerIdType=${data.CustomerIdType}

              const queryParams = {
                companyname: payload.AMLDIGICOMPANYNAME,
                username: payload.AMLDIGIUSERNAME,
                Password: payload.AMLDIGIPASSWORD,
                CustomerId: payload.CODE,
                FirstName: payload.FIRSTNAME,
                MiddleName: payload.MIDDLENAME,
                LastName: payload.LASTNAME,
                MatchCategory: "",
                CustomerIdNumber: payload.CustomerIdNumber,
                Nationality: payload.NATIONALITY,
                DOB: payload.DATE_OF_BIRTH,
                CustomerType: payload.CUST_Type,
                UserId: payload.AMLUSERID,
                Threshold: payload.AMLDIGITHRESHOLD,
                CompName: payload.AMLDIGICOMPANYNAME,
                GeneratePayload: "1",
                IPPath: payload.DIGIIPPATH,
                Gender: payload.Gender,
                CustomerIdType: payload.CustomerIdType,
              };
              if (this.amlNameValidation) {
                this.apiService
                  .getDynamicAPIwithParams("AMLValidation", queryParams)
                  .subscribe(async (data) => {
                    this.isCustProcessing = false;

                    this.snackBar.open("Loading...");

                    this.apiService
                      .putDynamicAPI(
                        `PosCustomerMaster/UpdateDigiScreened/code=${this.customerDetails.CODE}/DigiScreened=true`,
                        ""
                      )
                      .subscribe((resp) => {
                        this.snackBar.dismiss();
                        if (resp.status == "Success") {
                          // this.customerDetails = resp.response;
                          this.customerDetails.DIGISCREENED =
                            resp.response != null
                              ? resp.response?.DIGISCREENED
                              : true;
                        } else {
                          this.snackBar.open("Digiscreen Failed");
                        }

                        console.log("====================================");
                        console.log("resp", resp);
                        console.log("====================================");
                      });

                    if (data.response.isMatched != null) {
                      this.snackBar.dismiss();

                      if (data.response.isMatched.toUpperCase() == "YES") {
                        // if (data.response == 'yes') {
                        this.openDialog("Warning", "We cannot proceed", true);
                        this.dialogBox.afterClosed().subscribe((data: any) => {
                          if (data == "OK") {
                            // this.modalReference.close();
                            // this.closeModal();
                          }
                        });
                        // need to use put api
                        this.amlNameValidationData = true;

                        this.apiService
                          .putDynamicAPI(
                            `PosCustomerMaster/updateCustomerAmlNameValidation/code=${this.customerDetails.CODE}/AmlNameValidation=true`,
                            ""
                          )
                          // .updateAMLNameValidation(this.customerDetails.CODE, true)
                          .subscribe((resp) => {
                            // this.customerDetails = resp.response;
                            this.customerDetails.AMLNAMEVALIDATION =
                              resp.response != null
                                ? resp.response?.AMLNAMEVALIDATION
                                : true;

                            console.log("====================================");
                            console.log("resp", resp);
                            console.log("====================================");
                          });
                        // }
                      } else {
                        this.openDialog(
                          "Success",
                          JSON.stringify(data.response),
                          true
                        );
                        this.dialogBox.afterClosed().subscribe((data: any) => {
                          if (data == "OK") {
                            // this.modalReference.close();
                            // this.closeModal();
                          }
                        });
                        //proceed
                        this.amlNameValidationData = false;
                      }
                    } else {
                      this.openDialog(
                        "Warning",
                        JSON.stringify(data.response),
                        true
                      );
                      this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == "OK") {
                          // this.modalReference.close();
                          // this.closeModal();
                        }
                      });
                      this.amlNameValidationData = true;
                    }
                  });
              } else {
                this.isCustProcessing = false;
                // this.closeModal();
              }
            } else {
              this.isCustProcessing = false;

              // this.modalReference.close();
              // this.closeModal();
            }
          } else {
            // this.modalReference.close();
            this.customerDetails = {};
            this.snackBar.open(data.message, "", {
              duration: 2000, // time in milliseconds
            });
            // this.modalReference.close();
            this.closeModal();
          }
        });
        // this.closeModal();
      } else {
        this.isCustProcessing = false;

        this.snackBar.open("Please Fill Required Fields", "", {
          duration: 2000, // time in milliseconds
        });
      }
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: "40%",
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  closeModal() {
    this.customerDetails;
    const returnData = {
      customerDetails: this.customerDetails,
    };
    this.activeModal.close(returnData);
  }

  dummyDateCheck(date: any) {
    if (this.dummyDateArr.includes(date)) return "";
    else return date;
  }

  openTab(event: any, formControlName: string) {
    console.log(event);

    if (event.target.value === "") {
      this.openPanel(event, formControlName);
    }
  }

  openPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case "parentPosCode":
        this.overlayParentPosCode.showOverlayPanel(event);
        break;
      case "refBy":
        this.overlayRefBy.showOverlayPanel(event);
        break;
      case "countryCode":
        this.overlayCountryCode.showOverlayPanel(event);
        break;
      case "nationality":
        this.overlayNationality.showOverlayPanel(event);
        break;
      case "state":
        this.overlayState.showOverlayPanel(event);
        break;
      case "city":
        this.overlayCity.showOverlayPanel(event);
        break;

      case "language":
        this.overlayLanguage.showOverlayPanel(event);
        break;

      case "favCelebration":
        this.overlayFavCelebration.showOverlayPanel(event);
        break;
      case "religion":
        this.overlayReligion.showOverlayPanel(event);
        break;

      case "category":
        this.overlayCategory.showOverlayPanel(event);
        break;

      case "custStatus":
        this.overlayCustStatus.showOverlayPanel(event);
        break;

      case "custIdType":
        this.overlayCustIdType.showOverlayPanel(event);
        break;
      case "gifrPurchased":
        this.overlayGifrPurchased.showOverlayPanel(event);
        break;
      case "occasionOfPurchase":
        this.overlayOccasionOfPurchase.showOverlayPanel(event);
        break;

      case "ageGroup":
        this.overlayAgeGroup.showOverlayPanel(event);
        break;
      case "nextVisit":
        this.overlayNextVisit.showOverlayPanel(event);
        break;

      case "occupation":
        this.overlayOccupation.showOverlayPanel(event);
        break;
      case "custType":
        this.overlayCustomerType.showOverlayPanel(event);
        break;
      case "occupation1":
        this.overlayOccupation1.showOverlayPanel(event);
        break;
      case "sourceOfFound":
        this.overlaySourceOfFund.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  transactionDetails(event: any) {
    console.log(event);
    console.log("Got Clicked");
  }

  printPrivilegeCard(event: any) {
    console.log(event);
    console.log("Got Clicked");
  }

  printCustomerLog(event: any) {
    console.log(event);
    console.log("Got Clicked");
  }

  getCustomerDetails(event: any) {
    console.log(event);
    console.log("Got Clicked");
  }

  preventInvalidInput(event: KeyboardEvent) {
    // Prevent the letter "e", "E", "+", and "-" from being entered
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  }

  onInput(event: any, limit: any) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > limit) {
      input.value = input.value.slice(0, limit);
    }
  }

  onFileSelected(event: any) {
    console.log("Clicked");

    const file: File = event.target.files[0];

    if (file) {
      this.image = file; // Store the selected image in the `buddy` variable
      console.log("Image stored in buddy:", this.image);
    } else {
      console.error("No file selected");
    }
  }
}
