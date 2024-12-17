import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MasterSearchModel } from "src/app/shared/data/master-find-model";
import { CommonServiceService } from "src/app/services/common-service.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SuntechAPIService } from "src/app/services/suntech-api.service";
import { DialogboxComponent } from "src/app/shared/common/dialogbox/dialogbox.component";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { MasterSearchComponent } from "src/app/shared/common/master-search/master-search.component";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { ShowTransDetailsComponent } from "./show-trans-details/show-trans-details.component";
import { PrintCustomerLogComponent } from "./print-customer-log/print-customer-log.component";
import { PrintPrivilegeCardComponent } from "./print-privilege-card/print-privilege-card.component";
import { MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: "app-pos-customer-master-main",
  templateUrl: "./pos-customer-master-main.component.html",
  styleUrls: ["./pos-customer-master-main.component.scss"],
})
export class PosCustomerMasterMainComponent implements OnInit {
  @ViewChild("overlayParentPosCode")
  overlayParentPosCode!: MasterSearchComponent;
  @ViewChild("overlayRefBy") overlayRefBy!: MasterSearchComponent;
  @ViewChild("overlayCountry") overlayCountry!: MasterSearchComponent;
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
  @ViewChild("overlayNationality1") overlayNationality1!: MasterSearchComponent;
  @ViewChild("overlayNationality2") overlayNationality2!: MasterSearchComponent;
  @ViewChild("overlayNationality3") overlayNationality3!: MasterSearchComponent;
  @ViewChild("overlayNationality4") overlayNationality4!: MasterSearchComponent;
  @ViewChild("overlayNationality5") overlayNationality5!: MasterSearchComponent;
  @ViewChild("tabGroup") tabGroup!: MatTabGroup;

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  @Input() amlNameValidation?: boolean;
  @Input() vocDetails?: any;
  htmlContentForCustomerLog: string = "";
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
  IDDetailsValidation: boolean = false;
  getCustomerDetailsValidation: boolean = true;
  dialogBox: any;
  dialogBoxResult: any;
  existCustomerCode: any;
  generatedCustomerCode: any;
  flag: any = this.content?.FLAG;
  image: File | null = null;
  editdata: any;
  isCreditLimit: any;
  fetchedPicture: string | null = null;
  contactPreferenceWay: any[] = [];
  knowAboutWay: any[] = [];
  intrestedInWay: any[] = [];

  isFestivalEid: boolean = false;
  isFestivalChristmas: boolean = false;
  isFestivalDiwali: boolean = false;
  isFestivalNationalday: boolean = false;
  isFestivalOnam: boolean = false;
  isFestivalPongal: boolean = false;
  isFestivalNewyear: boolean = false;

  zodiacSignArray: any[] = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ];

  showSearchIcon: boolean = true;
  selectedContactString: any;
  selectedknowAboutString: any;
  selectedIntrestedInString: any;

  isSelfGift: boolean = false;
  showCustDesc: boolean = false;
  isViewState: boolean = false;
  isViewCity: boolean = false;
  nationalCode: any = "";

  amlNameValidationData = false;
  // dummyDate = "1900-01-01T00:00:00";
  // dummyDateArr = [
  //   "1900-01-01T00:00:00",
  //   "1900-01-01T00:00:00Z",
  //   "1754-01-01T00:00:00Z",
  //   "1754-01-01T00:00:00",
  // ];

  typeidCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 29,
    SEARCH_FIELD: "Code",
    SEARCH_HEADING: "Customer ID Type",
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
    SEARCH_HEADING: "Countries",
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
    SEARCH_HEADING: "Parent Code (POS)",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
  };

  refByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Refered By",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true,
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
    LOOKUPID: 27,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "State",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  };

  cityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "City",
    SEARCH_VALUE: "",
    WHERECONDITION: "",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };

  languageCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 45,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Languages",
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
    SEARCH_HEADING: "Favorite Celebration",
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
    SEARCH_HEADING: "Religions",
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
    SEARCH_HEADING: "Customer Status",
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
    SEARCH_HEADING: "Occupation",
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

  imageName: any;
  PrivilegeCardData: any;
  htmlCustomerLog: any;
  loyaltyCode: any;
  isLoyaltyVisible: boolean = false;
  htmlContentForPrivilege: any;
  compAccode: any;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private apiService: SuntechAPIService,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    console.log(this.vocDetails);
    
    this.compAccode = this.comService?.allCompanyParameters?.COMPACCODE;
    this.loyaltyCode = this.comService.allbranchMaster?.LOYALTY_CODE;
    this.getCustomerDetailsValidation =
      this.comService.allbranchMaster?.POSCUSTDETAILSFROMREADER;
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
    this.getDropDownStatus();
    this.loyaltyDetailsVisiblity();
    this.IDDetailsTabEnable();
    this.posCustomerMasterMainForm.controls["createdBranch"].disable();
    this.fetchImage();
  }

  conditionalRequiredValidator(controlNameToValidate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlToValidate = control.root.get(controlNameToValidate);
  
      if (controlToValidate && controlToValidate.value) {
        return Validators.required(control);
      }
  
      return null;
    };
  }

  posCustomerMasterMainForm: FormGroup = this.formBuilder.group({
    code: ["", [Validators.required]],
    parentPosCode: [""],
    refBy: [""],
    prefix: ["", Validators.required],
    name: ["", [Validators.required, Validators.maxLength(40)]],
    firstName: [""],
    middleName: [""],
    lastName: [""],
    creditCardLimitCheck: new FormControl({ value: "", disabled: false }),
    creditCardLimit: [
      { value: "", disabled: true },
      [Validators.maxLength(21), this.conditionalRequiredValidator('creditCardLimitCheck')],
    ],
    gender: ["", [Validators.required]],
    maritalSt: ["", [Validators.required]],
    dob: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    picture: [null],
    weddate: [""],
    country: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLNAMEVALIDATION === true
        ? [Validators.required]
        : [],
    ],
    countryCode: ["", [Validators.required]],
    moblieCountry: ["", [Validators.required]],
    moblieNumber: ["", [Validators.required]],
    moblie1Country: [""],
    moblie1Number: [""],
    emailId: [
      "",
      [
        Validators.maxLength(40),
        // Validators.required,
        Validators.email,
        this.domainValidator,
      ],
    ],
    telRCountry: [""],
    telRNumber: [""],
    tel0Country: [""],
    tel0number: [""],
    faxNo: ["", Validators.maxLength(15)],
    custType: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLNAMEVALIDATION === true
        ? [Validators.required, Validators.maxLength(6)]
        : [Validators.maxLength(6)],
    ],
    custDesc: [""],
    nationality: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "Jawhara" ||
      "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLNAMEVALIDATION === true ||
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    nationalityDesc: [""],
    state: [""],
    stateDesc: [""],
    city: [""],
    cityDesc: [""],
    language: [""],
    favCelebration: [""],
    favCelebrationDesc: [""],
    vat: new FormControl("", [
      Validators.maxLength(15),
      Validators.pattern("^[0-9]*$"),
    ]),
    panNo: [
      "",
      [Validators.required, Validators.maxLength(10), this.panValidator],
    ],
    whatsappCountryCode: [""],
    whatsappNumber: [""],
    spouse: ["", [Validators.maxLength(40)]],
    company: ["", [Validators.maxLength(40)]],
    zodiacSign: ["", [Validators.maxLength(15)]],
    noOfChildren: ["", [Validators.maxLength(5)]],
    religion: [""],
    religionDesc: [""],
    occupation1: [""],
    sourceOfFund: [
      "",
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    category: [""],
    categoryDesc: [""],
    custStatus: [""],
    custStatusDesc: [""],
    income: [""],
    bloodGroup: [""],
    custIdType: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    custID: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers" ||
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    custDate: [
      "",
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    POBox: ["", [Validators.maxLength(6)]],
    addressPersonal: [
      "",
      this.comService.allbranchMaster.AMLDIGICOMPANYNAME === "MeenaJewellers"
        ? [Validators.required]
        : [],
    ],
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
    amltype: new FormControl("Individual"),
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
    occupation: [
      "",
      this.comService.allbranchMaster.AMLTYPE === 2
        ? [Validators.required]
        : [],
    ],
    createdBranch: [""],
    openedOn: [this.currentDate],
    voucher: [""],
    saleDate: [""],
    branchLoc: [""],
    amount: [""],
    totalSale: [""],
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
    prefixAml: [""],

    arabicGender: [""],
    arabicNationality: [""],
    issuanceDate: [""],
    documentNo: [""],
    serialNo: [""],
    atr: [""],
    moiRefIndic: [""],
    moiReference: [""],
    district: [""],
    block: [""],
    street: [""],
    buildingNo: [""],
    unitType: [""],
    unitNo: [""],
    floor: [""],
    bloodType: [""],
    guardianCivilId: [""],
    additionalField1: [""],
    additionalField2: [""],
    appVersion: [""],
    passport: [""],
    connectedReaders: [""],

    eidFest: [""],
    christmasFest: [""],
    diwaliFest: [""],
    nationalDayFest: [""],
    onamFest: [""],
    pongalandsankrantiFest: [""],
    newyearFest: [""],

    johara: [""],
    farah: [""],
    jawaher: [""],

    loyaltyCustomerCheck: [""],
    loyaltyCode: [""],
    openingLoyaltyPoints: [""],
    loyaltyPoints: [""],
  });

  fetchImage() {
    let customerCode = this.generatedCustomerCode
      ? this.generatedCustomerCode
      : this.existCustomerCode;

    let API = `PosCustomerMaster/GetPOSCustImage/${customerCode}`;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status.trim() === "Success") {
          this.fetchedPicture = res.response?.imagepath; // Make sure this is a valid URL
        }
      });
  }

  dobValueSetting(event: any) {
    const selectedDate = event.value;
    this.posCustomerMasterMainForm.controls.dob1.setValue(selectedDate);
  }

  nameChange(event: any) {
    const value = event.target.value.toString().trim();

    // event.target.value = value;
    if (value != "") {
      this.posCustomerMasterMainForm.controls.name1.setValue(value);
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
          this.isSelfGift = true;
          this.posCustomerMasterMainForm.get("gifrPurchased")?.enable();
        } else {
          this.isSelfGift = false;
          this.posCustomerMasterMainForm.controls.gifrPurchased.setValue("");
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

  creditLimitChecker(event: MatCheckboxChange) {
    this.isCreditLimit = event.checked;

    if (this.isCreditLimit === false) {
      this.posCustomerMasterMainForm.controls.creditCardLimit.setValue("");
    }
  }

  initialController(FLAG: any) {
    if (FLAG === "VIEW") {
      this.ViewController();
    }
    if (FLAG === "EDIT") {
      this.editController();
    }

    if (FLAG == "DELETE") {
      this.deleteCustomerMaster();
    }
  }

  setvalues(setData: any) {
    this.posCustomerMasterMainForm.controls.name.setValue(setData.NAME);
    this.posCustomerMasterMainForm.controls.prefix.setValue(
      setData.POSCUSTPREFIX
    );
    this.posCustomerMasterMainForm.controls.parentPosCode.setValue(
      setData.PARENT_CODE
    );
    this.posCustomerMasterMainForm.controls.refBy.setValue(setData.REFERED_BY);
    this.posCustomerMasterMainForm.controls.firstName.setValue(
      setData.FIRSTNAME
    );
    this.posCustomerMasterMainForm.controls.middleName.setValue(
      setData.MIDDLENAME
    );
    this.posCustomerMasterMainForm.controls.lastName.setValue(setData.LASTNAME);

    this.isCreditLimit = setData.CREDIT_LIMIT_STATUS;

    this.posCustomerMasterMainForm.controls.creditCardLimit.setValue(
      this.comService.decimalQuantityFormat(
        this.comService.emptyToZero(setData.CREDIT_LIMIT),
        "AMOUNT"
      )
    );

    this.posCustomerMasterMainForm.controls.company.setValue(setData.COMPANY);
    this.posCustomerMasterMainForm.controls.addressPersonal.setValue(
      setData.ADDRESS
    );
    this.posCustomerMasterMainForm.controls.POBox.setValue(setData.POBOX_NO);
    this.posCustomerMasterMainForm.controls.state.setValue(setData.STATE);
    this.cityCodeData.WHERECONDITION = `TYPES='city master' and COUNTRY_CODE = '${setData.COUNTRY_CODE}' and STATE_CODE = '${setData.STATE}' `;
    this.isViewCity = true;
    this.posCustomerMasterMainForm.controls.city.setValue(setData.CITY);
    this.posCustomerMasterMainForm.controls.countryCode.setValue(
      setData.COUNTRY_CODE
    );
    this.stateCode.WHERECONDITION = `TYPES='state master' and COUNTRY_CODE = '${setData.COUNTRY_CODE}'`;
    this.isViewState = true;
    this.posCustomerMasterMainForm.controls.country.setValue(
      setData.COUNTRY_DESC
    );
    this.posCustomerMasterMainForm.controls.emailId.setValue(setData.EMAIL);
    this.posCustomerMasterMainForm.controls.telRNumber.setValue(setData.TEL1);
    this.posCustomerMasterMainForm.controls.moblieCountry.setValue(
      setData.MOBILECODE1
    );
    this.posCustomerMasterMainForm.controls.moblie1Country.setValue(
      setData.MOBILECODE2
    );
    this.posCustomerMasterMainForm.controls.telRCountry.setValue(
      setData.TEL_R_CODE
    );
    this.posCustomerMasterMainForm.controls.tel0Country.setValue(
      setData.TEL_O_CODE
    );

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
    this.posCustomerMasterMainForm.controls.category.setValue(setData.CATEGORY);
    this.posCustomerMasterMainForm.controls.income.setValue(setData.INCOME);
    this.posCustomerMasterMainForm.controls.custStatus.setValue(
      setData.CUST_STATUS
    );
    this.posCustomerMasterMainForm.controls.custType.setValue(setData.TYPE);
    this.posCustomerMasterMainForm.controls.moblie1Number.setValue(
      setData.MOBILE1
    );
    this.posCustomerMasterMainForm.controls.language.setValue(
      setData.CUST_LANGUAGE
    );
    this.posCustomerMasterMainForm.controls.favCelebration.setValue(
      setData.FAVORITE_CELEB
    );
    this.posCustomerMasterMainForm.controls.vat.setValue(setData.VAT_NUMBER);
    this.posCustomerMasterMainForm.controls.panNo.setValue(setData.PANCARDNO);
    this.posCustomerMasterMainForm.controls.whatsappCountryCode.setValue(
      setData.WUPMOBILECODE
    );
    this.posCustomerMasterMainForm.controls.whatsappNumber.setValue(
      setData.WUPMOBILENO
    );
    this.posCustomerMasterMainForm.controls.zodiacSign.setValue(
      setData.ZODIAC_SIGN
    );

    this.posCustomerMasterMainForm.controls.custDate.setValue(
      setData.POSCUSTIDEXP_DATE
    );

    this.posCustomerMasterMainForm.controls.reasonOfPurchase.setValue(
      setData.REASON_OF_PURCHASE
    );
    this.posCustomerMasterMainForm.controls.gifrPurchased.setValue(
      setData.GIFT_PURCHASED_FOR
    );

    this.posCustomerMasterMainForm.controls.occasionOfPurchase.setValue(
      setData.PURCHASE_OCCASION
    );
    this.posCustomerMasterMainForm.controls.nextVisit.setValue(
      setData.NEXT_VISIT
    );
    this.posCustomerMasterMainForm.controls.ageGroup.setValue(
      setData.AGE_GROUP
    );
    this.posCustomerMasterMainForm.controls.staffCourtesy.setValue(
      setData.STAFF_COURTESY
    );

    this.posCustomerMasterMainForm.controls.productSelection.setValue(
      setData.PRODUCT_SELECTION
    );

    this.posCustomerMasterMainForm.controls.service.setValue(setData.SERVICE);

    this.posCustomerMasterMainForm.controls.makingChanges.setValue(
      setData.MAKING_CHARGES
    );
    this.posCustomerMasterMainForm.controls.brand.setValue(setData.BRAND_NAME);

    this.posCustomerMasterMainForm.controls.buyBackPolicy.setValue(
      setData.BUY_BACK
    );
    this.posCustomerMasterMainForm.controls.loactionandParkingFacility.setValue(
      setData.LOCATION_PARKING
    );
    this.posCustomerMasterMainForm.controls.productKnowledgeOfOurStaff.setValue(
      setData.PRODUCT_KNOWLEDGE
    );
    this.posCustomerMasterMainForm.controls.locationandAmbienceOfShop.setValue(
      setData.PRODUCT_KNOWLEDGE
    );
    this.posCustomerMasterMainForm.controls.varietyAndQualityOfJewellery.setValue(
      setData.VARIETY_QUALITY
    );
    this.posCustomerMasterMainForm.controls.overallExperience.setValue(
      setData.OVERALL_EXP
    );
    this.posCustomerMasterMainForm.controls.showroomAccessibility.setValue(
      setData.SHOWROOMACCESSIBILITY
    );
    this.posCustomerMasterMainForm.controls.productRangeAvailability.setValue(
      setData.PRODUCTRANGEAVAILABILITY
    );
    this.populateKnowAbout(setData.SOURCE);

    this.populateContactPreferences(setData.PREFERENCE_CONTACT);

    this.populateIntrestedIn(setData.INTERESTED_IN);
    this.posCustomerMasterMainForm.controls.unNumber.setValue(
      setData.UN_NUMBER
    );
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

    this.posCustomerMasterMainForm.controls.language.setValue(
      setData.CUST_LANGUAGE
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

    this.posCustomerMasterMainForm.controls.bloodGroup.setValue(
      setData.BLOOD_GROUP
    );
    this.posCustomerMasterMainForm.controls.noOfChildren.setValue(
      setData.NO_OF_CHILDREN
    );

    this.posCustomerMasterMainForm.controls.designation.setValue(
      setData.DESIGNATION
    );

    this.posCustomerMasterMainForm.controls.name1.setValue(setData.NAME_1);
    this.posCustomerMasterMainForm.controls.name2.setValue(setData.NAME_2);
    this.posCustomerMasterMainForm.controls.name3.setValue(setData.NAME_3);
    this.posCustomerMasterMainForm.controls.name4.setValue(setData.NAME_4);
    this.posCustomerMasterMainForm.controls.name5.setValue(setData.NAME_5);
    this.posCustomerMasterMainForm.controls.dob1.setValue(
      setData.DATE_OF_BIRTH
    );
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
    this.posCustomerMasterMainForm.controls.nationalId.setValue(
      setData.NATIONAL_IDENTIFICATION_NO
    );
    this.posCustomerMasterMainForm.controls.sourceOfFund.setValue(
      setData.SOURCEOFWEALTHANDFUND
    );
    this.posCustomerMasterMainForm.controls.lookingFor.setValue(
      setData.LOOKING_FOR
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

  selectCountryCode(event: any, controller: any) {
    this.posCustomerMasterMainForm.controls[controller].setValue(event.value);
  }

  countryList() {
    let API = `CountryMaster/GetCountryMasterHeaderList`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.countryListData = res.response.map((country: any) => country);
    });
  }

  onCountrySelect(iso2Code: string) {
    this.selectedCountryISO2 = iso2Code;

    let API = `CountryMaster/GetStateList/${this.selectedCountryISO2}`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.stateListData = res.response;
    });
  }

  onWeddingIsIt(value: any) {
    if (value === "Married") {
      this.posCustomerMasterMainForm.controls.weddate.enable();
    } else if (value !== "Married") {
      this.posCustomerMasterMainForm.controls.weddate.disable();
    }
  }

  onCitySelect(iso2Code: string) {
    this.selectedstateISO2 = iso2Code;

    let API = `CountryMaster/GetCityList/${this.selectedCountryISO2}/${this.selectedstateISO2}/`;
    this.apiService.getDynamicAPI(API).subscribe((res) => {
      this.cityListData = res.response;
    });
  }

  onCity(value: any) {
    this.posCustomerMasterMainForm.controls.city.setValue(value);
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
    this.nationalCode = e.CODE;
    this.stateCode.WHERECONDITION = `TYPES='state master' and COUNTRY_CODE = '${this.nationalCode}'`;
    this.isViewState = true;
    this.cityCodeData.WHERECONDITION = `types='city master' and country_code='${this.nationalCode}'`;
    this.isViewCity = true;
    this.posCustomerMasterMainForm.controls.countryCode.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.country.setValue(e.DESCRIPTION);
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

    this.posCustomerMasterMainForm.controls.state.setValue("");
    this.posCustomerMasterMainForm.controls.city.setValue("");

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
    if (!this.posCustomerMasterMainForm.controls.country.value) {
      let message = `Please Select the Country First`;
      return this.openDialog("Warning", message, true);
    }

    // MSG2473

    let value = "United Arab Emirates";
    let code = "EID";

    if (
      this.posCustomerMasterMainForm.controls.country.value !== value &&
      e.CODE === code
    ) {
      let message =
        "Please select the UAE. Which ID you selected belongs to this country?";
      return this.openDialog("Warning", message, true);
    }

    this.posCustomerMasterMainForm.controls.custIdType.setValue(e.CODE);

    if (this.posCustomerMasterMainForm.value.custIdType === "PASSPORT") {
      this.posCustomerMasterMainForm.controls.passport1.setValue(
        this.posCustomerMasterMainForm.value.custID
      );
    }
    if (this.posCustomerMasterMainForm.value.custIdType !== "PASSPORT") {
      this.posCustomerMasterMainForm.controls.passport1.setValue("");
    }
  }

  stateSelected(e: any) {
    this.posCustomerMasterMainForm.controls.state.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.stateDesc.setValue(e.DESCRIPTION);
    this.cityCodeData.WHERECONDITION = `TYPES='city master' and COUNTRY_CODE = '${this.nationalCode}' and STATE_CODE = '${e.CODE}' `;
    this.isViewCity = true;
  }

  categorySelected(e: any) {
    this.posCustomerMasterMainForm.controls.category.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.categoryDesc.setValue(
      e.DESCRIPTION
    );
  }

  parentPosSelected(e: any) {
    this.posCustomerMasterMainForm.controls.parentPosCode.setValue(e.CODE);
  }

  refBySelected(e: any) {
    this.posCustomerMasterMainForm.controls.refBy.setValue(e.CODE);
  }

  nationalitySelected(e: any) {
    this.posCustomerMasterMainForm.controls.nationality.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.nationalityDesc.setValue(
      e.DESCRIPTION
    );
    this.posCustomerMasterMainForm.controls.nationalityCode1.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.nationality1.setValue(
      e.DESCRIPTION
    );
  }
  allNationalitySelected(e: any, controlIndex: number) {
    const nationalityCodeControl = `nationalityCode${controlIndex}`;
    const nationalityControl = `nationality${controlIndex}`;

    this.posCustomerMasterMainForm.controls[nationalityCodeControl].setValue(
      e.CODE
    );
    this.posCustomerMasterMainForm.controls[nationalityControl].setValue(
      e.DESCRIPTION
    );
  }

  citySelected(e: any) {
    this.posCustomerMasterMainForm.controls.city.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.cityDesc.setValue(e.DESCRIPTION);
  }

  languageSelected(e: any) {
    this.posCustomerMasterMainForm.controls.language.setValue(e.CODE);
  }

  favCelebrationSelected(e: any) {
    this.posCustomerMasterMainForm.controls.favCelebration.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.favCelebrationDesc.setValue(
      e.DESCRIPTION
    );
  }

  religionSelected(e: any) {
    this.posCustomerMasterMainForm.controls.religion.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.religionDesc.setValue(
      e.DESCRIPTION
    );
  }

  custStatusSelected(e: any) {
    this.posCustomerMasterMainForm.controls.custStatus.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.custStatusDesc.setValue(
      e.DESCRIPTION
    );
  }

  giftPurchasedSelected(e: any) {
    if (this.posCustomerMasterMainForm.controls.reasonOfPurchase.value) {
      this.posCustomerMasterMainForm.controls.gifrPurchased.setValue(e.CODE);
    }
  }

  occasionOfPurchaseSelected(e: any) {
    this.posCustomerMasterMainForm.controls.occasionOfPurchase.setValue(e.CODE);
  }

  ageGroupSelected(e: any) {
    this.posCustomerMasterMainForm.controls.ageGroup.setValue(e.CODE);
  }

  nextVisitSelected(e: any) {
    this.posCustomerMasterMainForm.controls.nextVisit.setValue(e.CODE);
  }

  occupationMasterSelected(e: any) {
    this.posCustomerMasterMainForm.controls.occupation.setValue(e.CODE);
  }

  occupation1MasterSelected(e: any) {
    this.posCustomerMasterMainForm.controls.occupation1.setValue(e.CODE);
  }

  customerTypeSelected(e: any) {
    this.posCustomerMasterMainForm.controls.custType.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.custDesc.setValue(e.DESCRIPTION);
  }

  sourceOfFundMasterSelected(e: any) {
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

  close(data?: any, preventDefault?: any) {
    if (preventDefault === true) {
      this.activeModal.close(data);
    } else {
      Swal.fire({
        title: "Are you sure you want to close this?",
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
    }
  }

  uploadCustomerImage() {
    const formData = new FormData();
    const customerCode = this.existCustomerCode || this.generatedCustomerCode;

    // Append customer code and image to formData
    formData.append("CODE", customerCode);
    formData.append("File", this.image as Blob);

    const API = `PosCustomerMaster/InsertPOSCustAttachments`;

    const sub: Subscription = this.apiService
      .postDynamicAPI(API, formData)
      .subscribe(
        (result) => {},
        (err) => {
          console.error("Image Upload Error:", err);
          // Optionally, add user feedback here
        }
      );

    this.subscriptions.push(sub);
  }

  customerSave() {
    let POSTYPECOMPULSORY =
      this.comService.getCompanyParamValue("POSTYPECOMPULSORY");
    if (
      POSTYPECOMPULSORY === 1 &&
      !this.posCustomerMasterMainForm.controls.custType.value
    ) {
      this.comService.toastErrorByMsgId("MSG1923");
    }

    let POSIDNOCOMPULSORY =
      this.comService.getCompanyParamValue("POSIDNOCOMPULSORY");

    if (
      POSIDNOCOMPULSORY === true &&
      !this.posCustomerMasterMainForm.controls.custIdType.value &&
      !this.posCustomerMasterMainForm.controls.custID.value
    ) {
      this.comService.toastErrorByMsgId("MSG81405 ");
    }

    // if (
    //   this.posCustomerMasterMainForm.value.moblieNumber == "" &&
    //   this.posCustomerMasterMainForm.value.telRNumber == ""
    // ) {
    //   Swal.fire({
    //     title: "Warning",
    //     text: "Atleast One of the Field is Manditory Mobile Number (OR) Telephone Number",
    //     icon: "warning",
    //     confirmButtonColor: "#336699",
    //     confirmButtonText: "Ok",
    //   });
    //   return;
    // }

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

      const invalidRequiredFields = Object.keys(
        this.posCustomerMasterMainForm.controls
      ).filter((controlName) => {
        const control = this.posCustomerMasterMainForm.controls[controlName];
        return control.invalid && control.errors?.["required"];
      });

      invalidRequiredFields.length > 0 &&
        Swal.fire({
          title: "Warning",
          text: "Please fill all the mandatory fields",
          icon: "warning",
          confirmButtonColor: "#336699",
          confirmButtonText: "Ok",
        });

      if (!this.posCustomerMasterMainForm.invalid) {
        const posCustomer = {
          CODE: this.posCustomerMasterMainForm.value.code || "",
          NAME: this.posCustomerMasterMainForm.value.name || "",
          COMPANY: this.posCustomerMasterMainForm.value.company || "",
          ADDRESS: this.posCustomerMasterMainForm.value.addressPersonal || "",
          POBOX_NO: this.posCustomerMasterMainForm.value.POBox || "",
          STATE: this.posCustomerMasterMainForm.value.stateDesc || "",
          CITY: this.posCustomerMasterMainForm.value.cityDesc || "",
          ZIPCODE: "",
          COUNTRY_CODE: this.posCustomerMasterMainForm.value.countryCode || "",
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
          WED_DATE: this.posCustomerMasterMainForm.value.weddate || null,
          SPOUSE_NAME: this.posCustomerMasterMainForm.value.spouse || "",
          REMARKS: this.posCustomerMasterMainForm.value.remarks || "",
          DATE_OF_BIRTH: this.posCustomerMasterMainForm.value.dob || null,
          OPENING_ON: this.posCustomerMasterMainForm.value.openedOn || null,
          GENDER: this.posCustomerMasterMainForm.value.gender || "",
          REGION: "",
          NATIONALITY: this.posCustomerMasterMainForm.value.nationality || "",
          RELIGION: this.posCustomerMasterMainForm.value.religion || "",
          TYPE: this.posCustomerMasterMainForm.value.custType || "",
          CATEGORY: this.posCustomerMasterMainForm.value.category || "",
          INCOME: Number(this.posCustomerMasterMainForm.value.income),
          CUST_STATUS: this.posCustomerMasterMainForm.value.custStatus || "",
          MID: 0,
          PICTURE_NAME: "",
          PICTURE: "",
          SALVOCTYPE_NO: this.posCustomerMasterMainForm.value.voucher || "",
          SALDATE:
            this.posCustomerMasterMainForm.value.saleDate || this.currentDate,
          SALAMOUNT: this.posCustomerMasterMainForm.value.amount || 0,
          SALBRLOC: this.posCustomerMasterMainForm.value.branchLoc || "",
          Branch_Code: this.branchCode,
          TOTALSALES: this.posCustomerMasterMainForm.value.totalSale || 0,
          POSCUSTIDNO:
            this.posCustomerMasterMainForm.value.custID.toString() || "",
          POSSMAN: "",
          POSCUSTPREFIX: this.posCustomerMasterMainForm.value.prefix || "",
          MOBILE1:
            this.posCustomerMasterMainForm.value.moblie1Number.toString() || "",
          CUST_Language: this.posCustomerMasterMainForm.value.language || "",
          CUST_TYPE: "",
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
          SOURCE: this.selectedknowAboutString || "",
          PREFERENCE_CONTACT: this.selectedContactString || "NO",

          MOBILECODE1:
            this.posCustomerMasterMainForm.value.moblieCountry.toString() || "",
          MOBILECODE2:
            this.posCustomerMasterMainForm.value.moblie1Country || "",
          IDCATEGORY: this.posCustomerMasterMainForm.value.custIdType || "",
          ADDRESS_OFFICIAL:
            this.posCustomerMasterMainForm.value.officialAddress || "",
          ADDRESS_DELIVARY:
            this.posCustomerMasterMainForm.value.deliveryAddress || "",
          INTERESTED_IN: this.selectedIntrestedInString || "",
          BLOOD_GROUP: this.posCustomerMasterMainForm.value.bloodGroup || "",
          NO_OF_CHILDREN:
            Number(this.posCustomerMasterMainForm.value.noOfChildren) || 0,
          ZODIAC_SIGN: this.posCustomerMasterMainForm.value.zodiacSign || "",
          DESIGNATION: this.posCustomerMasterMainForm.value.designation || "",
          LEVELFLAG: 0,
          INCOMERANGE: "",
          LAST_UPDATED_DATE: this.currentDate,

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
          UN_NUMBER: this.posCustomerMasterMainForm.value.unNumber || "",
          NAME_1: this.posCustomerMasterMainForm.value.name1 || "",
          NAME_2: this.posCustomerMasterMainForm.value.name2 || "",
          NAME_3: this.posCustomerMasterMainForm.value.name3 || "",
          NAME_4: this.posCustomerMasterMainForm.value.name4 || "",
          NAME_5: this.posCustomerMasterMainForm.value.name5 || "",
          DOB_2: this.posCustomerMasterMainForm.value.dob2 || null,
          DOB_3: this.posCustomerMasterMainForm.value.dob3 || null,
          DOB_4: this.posCustomerMasterMainForm.value.dob4 || null,
          DOB_5: this.posCustomerMasterMainForm.value.dob5 || null,
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
          LISTED_ON_DATE: this.posCustomerMasterMainForm.value.listedOn || null,
          NATIONAL_IDENTIFICATION_NO:
            this.posCustomerMasterMainForm.value.nationalId || "",
          OTHER_INFORMATION: "",
          LINKS: this.posCustomerMasterMainForm.value.link || "",
          FATHERNAME: this.posCustomerMasterMainForm.value.fatherName || "",
          PROMO_NEEDED: "",
          PROMO_HOW_OFTEN: "",
          CHILDNAME1: "",
          CHILDNAME2: "",
          CHILDNAME3: "",
          CHILDNAME4: "",
          CHILDDATEOFBIRTH1: null,
          CHILDDATEOFBIRTH2: null,
          CHILDDATEOFBIRTH3: null,
          CHILDDATEOFBIRTH4: null,
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
          SPOUSE_DATE_OF_BIRTH: null,
          TEL_R_CODE: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.telRCountry
          )}`,
          TEL_O_CODE: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.tel0Country
          )}`,
          GST_NUMBER: `${this.comService.emptyToZero(
            ""
            // this.posCustomerMasterMainForm.value
          )}`,
          VAT_NUMBER: `${this.comService.emptyToZero(
            this.posCustomerMasterMainForm.value.vat
          )}`,
          PARENT_CODE: this.posCustomerMasterMainForm.value.parentPosCode || "",
          REFERED_BY: this.posCustomerMasterMainForm.value.refBy || "",
          CREDIT_LIMIT:
            this.posCustomerMasterMainForm.value.creditCardLimit || 0,
          CREDIT_LIMIT_STATUS: this.isCreditLimit,
          PANCARDNO: this.posCustomerMasterMainForm.value.panNo || "",
          VOCTYPE: this.vocDetails?.VOCTYPE ?? "",
          YEARMONTH: this.vocDetails?.YEARMONTH ?? localStorage.getItem("YEAR"),
          VOCNO: this.vocDetails?.VOCNO ?? 0,
          VOCDATE: this.vocDetails?.VOCDATE || null,

          OT_TRANSFER_TIME: "",
          COUNTRY_DESC: this.posCustomerMasterMainForm.value.country || "",
          STATE_DESC: this.posCustomerMasterMainForm.value.state || "",
          CITY_DESC: this.posCustomerMasterMainForm.value.city || "",
          FAVORITE_CELEB_DESC:
            this.posCustomerMasterMainForm.value.favCelebrationDesc || "",
          RELIGION_DESC:
            this.posCustomerMasterMainForm.value.religionDesc || "",
          CATEGORY_DESC:
            this.posCustomerMasterMainForm.value.categoryDesc || "",
          CUST_STATUS_DESC:
            this.posCustomerMasterMainForm.value.custStatusDesc || "",
          NATIONALITY_DESC:
            this.posCustomerMasterMainForm.value.nationalityDesc || "",
          TYPE_DESC: this.posCustomerMasterMainForm.value.custDesc || "",
          DETAILS_JOHARA: this.posCustomerMasterMainForm.value.johara || "",
          DETAILS_FARAH: this.posCustomerMasterMainForm.value.farah || "",
          DETAILS_JAWAHERALSHARQ:
            this.posCustomerMasterMainForm.value.jawaher || "",
          FESTIVAL_EID: this.isFestivalEid,
          FESTIVAL_CHRISTMAS: this.isFestivalChristmas,
          FESTIVAL_DIWALI: this.isFestivalDiwali,
          FESTIVAL_NATIONALDAY: this.isFestivalNationalday,
          FESTIVAL_ONAM: this.isFestivalOnam,
          FESTIVAL_PONGAL: this.isFestivalPongal,
          FESTIVAL_NEWYEAR: this.isFestivalNewyear,
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
          LOOKING_FOR: this.posCustomerMasterMainForm.value.lookingFor || "",
          POSCUSTIDEXP_DATE:
            this.posCustomerMasterMainForm.value.custDate || null,

          ATTACHMENT_FROM_SCANNER: false,
          GOOD_QUALITY_A_K_A: "",
          LOW_QUALITY_A_K_A: "",
          SOURCEOFWEALTHANDFUND:
            this.posCustomerMasterMainForm.value.sourceOfFund,
          POSKNOWNABOUT: 0,
        };

        if (this.content?.FLAG == "EDIT") {
          let API = `PosCustomerMaster/UpdateCustomerMaster/${posCustomer.CODE}`;
          let sub: Subscription = this.apiService
            .putDynamicAPI(API, posCustomer)
            .subscribe((result) => {
              if (result.status === "Success") {
                Swal.fire({
                  title: "Success",
                  text: "Customer Details Updated successfully!",
                  icon: "success",
                  confirmButtonColor: "#336699",
                  confirmButtonText: "Ok",
                });

                if (this.image) {
                  this.uploadCustomerImage();
                }

                this.close("reloadMainGrid", true);
              } else {
                // Handle cases where the result is not successful or undefined
                Swal.fire({
                  title: "Upload Failed",
                  text: "Customer Details Not Updated Successfully",
                  icon: "error",
                  confirmButtonColor: "#336699",
                  confirmButtonText: "Ok",
                });
              }
            });
        } else {
          let API = "PosCustomerMaster/InsertCustomerMaster";
          let sub: Subscription = this.apiService
            .postDynamicAPI(API, posCustomer)
            .subscribe((result) => {
              if (result.status === "Success") {
                Swal.fire({
                  title: "Success",
                  text: result.message
                    ? result.message
                    : "Customer Details Inserted successfully!",
                  icon: "success",
                  confirmButtonColor: "#336699",
                  confirmButtonText: "Ok",
                });

                if (this.image) {
                  this.uploadCustomerImage();
                }
                this.close("reloadMainGrid", true);
              } else {
                // Handle cases where the result is not successful or undefined
                Swal.fire({
                  title: "Upload Failed",
                  text: "Customer Details Not Inserted Successfully",
                  icon: "error",
                  confirmButtonColor: "#336699",
                  confirmButtonText: "Ok",
                });
              }
            });
        }
      } else {
        this.isCustProcessing = false;

        this.snackBar.open("Please Fill Required Fields", "", {
          duration: 2000,
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

  // dummyDateCheck(date: any) {
  //   if (this.dummyDateArr.includes(date)) return "";
  //   else return date;
  // }

  openTab(event: any, formControlName: string) {
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
      case "country":
        this.overlayCountry.showOverlayPanel(event);
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
      case "sourceOfFund":
        this.overlaySourceOfFund.showOverlayPanel(event);
        break;
      case "nationality1":
        this.overlayNationality1.showOverlayPanel(event);
        break;
      case "nationality2":
        this.overlayNationality2.showOverlayPanel(event);
        break;
      case "nationality3":
        this.overlayNationality3.showOverlayPanel(event);
        break;
      case "nationality4":
        this.overlayNationality4.showOverlayPanel(event);
        break;
      case "nationality5":
        this.overlayNationality5.showOverlayPanel(event);
        break;
      default:
        console.warn(`Unknown form control name: ${formControlName}`);
    }
  }

  printCustomerLog() {
    let payload = {
      SPID: "163",
      parameter: {
        STRBRANCHES: "MCC#",
        STRDATEFROM: "2024-09-01",
        STRDATETO: "2024-10-23",
        USERBRANCH: "MOE",
        USP_ID: "{46DC1FCE-985B-4A39-A0F4-A3218B66FFAD}",
        Logdata: JSON.stringify({
          VOCTYPE: "GEN",
          REFMID: "",
          USERNAME: "ADMIN",
          MODE: "PRINT",
          DATETIME: "2024-10-23T05:22:11.286Z",
          REMARKS: "",
          SYSTEMNAME: "",
          BRANCHCODE: "MOE",
          VOCNO: "",
          VOCDATE: "",
          YEARMONTH: "2024",
        }),
      },
    };

    let API = "ExecueteSPInterface";

    let sub: Subscription = this.apiService
      .postDynamicAPI(API, payload)
      .subscribe(
        (res) => {
          if (res.status && res.status.trim() === "Success") {
            if (
              res.dynamicData &&
              res.dynamicData[0] &&
              res.dynamicData[0][0] &&
              res.dynamicData[0][0].HTMLOUT
            ) {
              this.htmlContentForCustomerLog = res.dynamicData[0][0].HTMLOUT;

              const modalRef: NgbModalRef = this.modalService.open(
                PrintCustomerLogComponent,
                {
                  size: "xl",
                  backdrop: true,
                  keyboard: false,
                  windowClass: "modal-dialog-centered modal-dialog-scrollable",
                }
              );
              modalRef.componentInstance.htmlContentForCustomerLog =
                this.htmlContentForCustomerLog;
              // modalRef.componentInstance.data = this.content;
            } else {
              console.error("HTMLOUT not found in the response");
            }
          } else {
            console.error("API did not return success:", res);
          }
        },
        (error) => {
          console.error("API call failed:", error);
        }
      );
  }

  printPrivilegeCard() {
    let payload = {
      SPID: "162",
      parameter: {
        strCertCode: "BD36798",
      },
    };

    let API = "ExecueteSPInterface";

    let sub: Subscription = this.apiService
      .postDynamicAPI(API, payload)
      .subscribe(
        (res) => {
          if (res.status && res.status.trim() === "Success") {
            if (
              res.dynamicData &&
              res.dynamicData[0] &&
              res.dynamicData[0][0] &&
              res.dynamicData[0][0].HTMLOUT
            ) {
              this.htmlContentForPrivilege = res.dynamicData[0][0].HTMLOUT;

              const modalRef: NgbModalRef = this.modalService.open(
                PrintPrivilegeCardComponent,
                {
                  size: "xl",
                  backdrop: true,
                  keyboard: false,
                  windowClass: "modal-dialog-centered modal-dialog-scrollable",
                }
              );
              modalRef.componentInstance.htmlContentForPrivilege =
                this.htmlContentForPrivilege;
            } else {
              console.error("HTMLOUT not found in the response");
            }
          } else {
            console.error("API did not return success:", res);
          }
        },
        (error) => {
          console.error("API call failed:", error);
        }
      );
  }

  getCustomerDetails(event: any) {
    let API = `PrivilegeCustomerNetSalesSummary/GetCustomerDetails/${true}/${
      this.branchCode
    }/`;
    this.tabGroup.selectedIndex = 8;
    let sub: Subscription = this.apiService
      .getDynamicAPI(API)
      .subscribe((res) => {
        if (res.status.trim() === "Success") {
          let data = res.dynamicData[0][0];

          this.posCustomerMasterMainForm.controls.arabicGender.setValue(
            data.ARABIC_GENDER
          );
          this.posCustomerMasterMainForm.controls.arabicNationality.setValue(
            data.ARABIC_NATIONALITY
          );
          this.posCustomerMasterMainForm.controls.issuanceDate.setValue(
            data.ISSUANCE_DATE
          );

          this.posCustomerMasterMainForm.controls.documentNo.setValue(
            data.DOCUMENT_NO
          );
          this.posCustomerMasterMainForm.controls.serialNo.setValue(
            data.SERIAL_NO
          );

          this.posCustomerMasterMainForm.controls.atr.setValue(data.ATR);
          this.posCustomerMasterMainForm.controls.moiRefIndic.setValue(
            data.MOI_REF_INDIC
          );
          this.posCustomerMasterMainForm.controls.moiReference.setValue(
            data.MOI_REFERENCE
          );
          this.posCustomerMasterMainForm.controls.district.setValue(
            data.DISTRICT
          );
          this.posCustomerMasterMainForm.controls.block.setValue(data.BLOCK);
          this.posCustomerMasterMainForm.controls.street.setValue(data.STREET);
          this.posCustomerMasterMainForm.controls.buildingNo.setValue(
            data.BUILDING_NO
          );
          this.posCustomerMasterMainForm.controls.unitType.setValue(
            data.UNIT_TYPE
          );
          this.posCustomerMasterMainForm.controls.unitNo.setValue(data.UNIT_NO);
          this.posCustomerMasterMainForm.controls.floor.setValue(data.FLOOR);
          this.posCustomerMasterMainForm.controls.bloodType.setValue(
            data.BLOOD_TYPE
          );
          this.posCustomerMasterMainForm.controls.guardianCivilId.setValue(
            data.GUARDIAN_CIVIL_ID
          );
          this.posCustomerMasterMainForm.controls.additionalField1.setValue(
            data.ADDITIONAL_FIELD_1
          );
          this.posCustomerMasterMainForm.controls.additionalField2.setValue(
            data.ADDITIONAL_FIELD_2
          );
          this.posCustomerMasterMainForm.controls.appVersion.setValue(
            data.APP_VERSION
          );
          this.posCustomerMasterMainForm.controls.passport.setValue(
            data.PASSPORT
          );
          this.posCustomerMasterMainForm.controls.connectedReaders.setValue(
            data.CONNECTED_READERS
          );
        }
      });
  }

  preventInvalidInput(event: KeyboardEvent) {
    // Prevent the letter "e", "E", "+", and "-" from being entered
    if (["e", "E", "+", "-"].includes(event.key)) {
      event.preventDefault();
    }
  }

  preventInvalidInputs(event: KeyboardEvent) {
    // Prevent any character that is not a digit
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onInput(event: any, limit: any, controller?: any, checkExistCustomer?: any) {
    const input = event.target as HTMLInputElement;

    setTimeout(() => {
      if (input.value.length > limit) {
        input.value = input.value.slice(0, limit);
        if (controller) {
          this.posCustomerMasterMainForm.controls[controller].setValue(
            input.value
          );
        }
      }
    }, 0);
    // if (input.value.length > limit) {
    //   input.value = input.value.slice(0, limit);
    // }

    if (controller) {
      this.posCustomerMasterMainForm.controls[controller].setValue(input.value);
    }

    if (checkExistCustomer === "YES") {
      if (!this.posCustomerMasterMainForm.controls.country.value) {
        let message = `Please Select the Country First`;
        this.posCustomerMasterMainForm.controls[controller].setValue("");
        return this.openDialog("Warning", message, true);
      }
    }

    if (checkExistCustomer === "YES" && input.value.length > 6) {
      let API = `PosCustomerMaster/GetCustomerMaster/${input.value}`;
      let sub: Subscription = this.apiService
        .getDynamicAPI(API)
        .subscribe((res) => {
          if (res.status.trim() === "Success") {
            if (res.response.MOBILE === input.value) {
              let message = `Customer Already Exist ! `;
              this.posCustomerMasterMainForm.controls[controller].setValue("");
              return this.openDialog("Warning", message, true);
            }
          }
        });
    }
  }

  // onFileSelected(event: any) {
  //   this.image = event.target.files[0];
  //   this.imageName = event.target.files[0].name;

  //   // Create a URL for the selected image and assign it to fetchedPicture
  //   if (this.image) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.fetchedPicture = reader.result as string; // Set image for preview
  //     };
  //     reader.readAsDataURL(this.image);
  //   }
  // }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    // Validate the file type
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (file && !allowedExtensions.exec(file.name)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type!",
        text: "Please upload an image (jpg, jpeg, png, gif).",
      });

      this.imageName = null; // Clear the image name
      this.image = null; // Clear the selected image
      this.fetchedPicture = null; // Clear the fetched image preview
      return; // Exit the function
    }

    this.image = file;
    this.imageName = file.name;

    // Create a URL for the selected image and assign it to fetchedPicture
    if (this.image) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fetchedPicture = reader.result as string; // Set image for preview
      };
      reader.readAsDataURL(this.image);
    }
  }

  getContactPreference(event: MatCheckboxChange, value: string) {
    if (value === "NO") {
      this.check();
      this.contactPreferenceWay = [];
    } else {
    }

    if (event.checked) {
      if (!this.contactPreferenceWay.includes(value)) {
        this.contactPreferenceWay.push(value);
      }
    } else {
      const index = this.contactPreferenceWay.indexOf(value);
      if (index !== -1) {
        this.contactPreferenceWay.splice(index, 1);
      }
    }

    this.contactPreferenceWay.sort((a, b) => a.localeCompare(b));
    this.selectedContactString = this.contactPreferenceWay.join("#");
  }

  populateContactPreferences(selectedContactString: string) {
    const selectedValuesArray = selectedContactString.split("#");

    // Only update the checkboxes, leave other fields untouched
    this.posCustomerMasterMainForm
      .get("sms")
      ?.setValue(selectedValuesArray.includes("SM"));
    this.posCustomerMasterMainForm
      .get("phoneCall")
      ?.setValue(selectedValuesArray.includes("PH"));
    this.posCustomerMasterMainForm
      .get("email")
      ?.setValue(selectedValuesArray.includes("EM"));
    this.posCustomerMasterMainForm
      .get("whatsapp")
      ?.setValue(selectedValuesArray.includes("WH"));
    this.posCustomerMasterMainForm
      .get("notInterested")
      ?.setValue(selectedValuesArray.includes("NO"));
  }

  getKnowAbout(event: MatCheckboxChange, value: string) {
    if (value === "SO") {
      this.toggle(); // Show/hide social media input fields when 'SO' is clicked
    }

    // Add or remove the checkbox values from the array
    if (event.checked) {
      if (!this.knowAboutWay.includes(value)) {
        this.knowAboutWay.push(value);
      }
    } else {
      const index = this.knowAboutWay.indexOf(value);
      if (index !== -1) {
        this.knowAboutWay.splice(index, 1);
      }
    }

    // Sort alphabetically
    this.knowAboutWay.sort();

    // If 'SO' (Social Media) is selected, include social media input values
    let socialMediaPart = "";
    if (this.knowAboutWay.includes("SO")) {
      const socialMediaFields = ["facebook", "twitter", "instagram"];
      const socialMediaValues = socialMediaFields
        .map((field) => this.posCustomerMasterMainForm.controls[field].value)
        .filter((value) => value); // Only add if the user entered a value

      // Join social media values with '-'
      if (socialMediaValues.length > 0) {
        socialMediaPart = "-" + socialMediaValues.join("-");
      }
    }

    // Join knowAboutWay with '#', append the social media part (if any)
    this.selectedknowAboutString =
      this.knowAboutWay.join("#") + socialMediaPart;
  }

  populateKnowAbout(selectedKnowAboutString: string) {
    // Split the string by '#', which separates the checkbox values from the social media part
    const parts = selectedKnowAboutString.split("#");

    // Check if social media part exists (contains a '-'), separate checkbox and social media data
    const checkboxValues = parts.filter((part) => !part.includes("-")); // Checkbox values without '-'
    const socialMediaPart = parts.find((part) => part.includes("-")); // Social media values with '-'

    // Populate checkboxes
    this.posCustomerMasterMainForm
      .get("tv")
      ?.setValue(checkboxValues.includes("TV"));
    this.posCustomerMasterMainForm
      .get("outdoor")
      ?.setValue(checkboxValues.includes("OU"));
    this.posCustomerMasterMainForm
      .get("online")
      ?.setValue(checkboxValues.includes("ON"));
    this.posCustomerMasterMainForm
      .get("socialMedia")
      ?.setValue(checkboxValues.includes("SO"));
    this.posCustomerMasterMainForm
      .get("radio")
      ?.setValue(checkboxValues.includes("RA"));
    this.posCustomerMasterMainForm
      .get("other")
      ?.setValue(checkboxValues.includes("OT"));

    // If social media data exists, split by '-' and populate the respective form controls
    if (socialMediaPart) {
      const socialMediaValues = socialMediaPart.split("-");

      // Populate social media fields (assuming the order: facebook, twitter, instagram)
      this.posCustomerMasterMainForm
        .get("facebook")
        ?.setValue(socialMediaValues[0] || "");
      this.posCustomerMasterMainForm
        .get("twitter")
        ?.setValue(socialMediaValues[1] || "");
      this.posCustomerMasterMainForm
        .get("instagram")
        ?.setValue(socialMediaValues[2] || "");
    } else {
      // If no social media part is found, clear those fields
      this.posCustomerMasterMainForm.get("facebook")?.setValue("");
      this.posCustomerMasterMainForm.get("twitter")?.setValue("");
      this.posCustomerMasterMainForm.get("instagram")?.setValue("");
    }
  }

  getIntrestedIn(event: MatCheckboxChange, value: any) {
    if (event.checked) {
      if (!this.intrestedInWay.includes(value)) {
        this.intrestedInWay.push(value);
      }
    } else {
      const index = this.intrestedInWay.indexOf(value);
      if (index !== -1) {
        this.intrestedInWay.splice(index, 1);
      }
    }

    this.intrestedInWay.sort((a, b) => a.localeCompare(b));
    this.selectedIntrestedInString = this.intrestedInWay.join("#");
  }

  populateIntrestedIn(selectedKnowAboutString: string) {
    const selectedValuesArray = selectedKnowAboutString.split("#");

    // Only update the checkboxes, leave other fields untouched
    this.posCustomerMasterMainForm
      .get("promotionalOffers")
      ?.setValue(selectedValuesArray.includes("PR"));
    this.posCustomerMasterMainForm
      .get("sportsEvents")
      ?.setValue(selectedValuesArray.includes("SP"));
    this.posCustomerMasterMainForm
      .get("charityEvents")
      ?.setValue(selectedValuesArray.includes("CH"));
    this.posCustomerMasterMainForm
      .get("stageShows")
      ?.setValue(selectedValuesArray.includes("ST"));

    this.posCustomerMasterMainForm
      .get("seminars")
      ?.setValue(selectedValuesArray.includes("SE"));

    this.posCustomerMasterMainForm
      .get("personalSkills")
      ?.setValue(selectedValuesArray.includes("PE"));
  }

  afterSave(value: any) {
    if (value) {
      this.posCustomerMasterMainForm.reset();
      this.close("reloadMainGrid", true);
    }
  }

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
      text: "",
      icon: "success",
      confirmButtonColor: "#336699",
      confirmButtonText: "Ok",
    }).then((result: any) => {
      this.afterSave(result.value);
    });
  }

  showErrorDialog(message: string): void {
    Swal.fire({
      title: message,
      text: "",
      icon: "error",
      confirmButtonColor: "#336699",
      confirmButtonText: "Ok",
    }).then((result: any) => {
      this.afterSave(result.value);
    });
  }

  showConfirmationDialog(): Promise<any> {
    return Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete!",
    });
  }

  deleteCustomerMaster() {
    if (this.content && this.content.FLAG == "VIEW") return;
    this.setvalues(this.content);
    this.showConfirmationDialog().then((result) => {
      if (result.isConfirmed) {
        let customerCode = this.generatedCustomerCode
          ? this.generatedCustomerCode
          : this.existCustomerCode;
        let API = `PosCustomerMaster/DeleteCustomerMaster/${customerCode}`;
        let Sub: Subscription = this.apiService.deleteDynamicAPI(API).subscribe(
          (result) => {
            if (result) {
              if (result.status === "Success") {
                this.showSuccessDialog("Deleted Successfully");
              } else {
                this.showErrorDialog(
                  result.message || "Error please try again"
                );
              }
            } else {
              this.comService.toastErrorByMsgId("MSG1880"); // Not Deleted
            }
          },
          (err) => alert(err)
        );
        this.subscriptions.push(Sub);
      } else {
        this.flag = "VIEW";
      }
    });
  }

  switchToIndiCom(event: any) {
    // Example switch statement based on the selected value
    switch (event.value) {
      case "Individual":
        this.posCustomerMasterMainForm.controls["name1"].enable();
        this.posCustomerMasterMainForm.controls["name2"].enable();
        this.posCustomerMasterMainForm.controls["name3"].enable();
        this.posCustomerMasterMainForm.controls["name4"].enable();
        this.posCustomerMasterMainForm.controls["name5"].enable();
        this.posCustomerMasterMainForm.controls["nationality1"].enable();
        this.posCustomerMasterMainForm.controls["nationality2"].enable();
        this.posCustomerMasterMainForm.controls["nationality3"].enable();
        this.posCustomerMasterMainForm.controls["nationality4"].enable();
        this.posCustomerMasterMainForm.controls["nationality5"].enable();
        this.posCustomerMasterMainForm.controls["dob1"].enable();
        this.posCustomerMasterMainForm.controls["dob2"].enable();
        this.posCustomerMasterMainForm.controls["dob3"].enable();
        this.posCustomerMasterMainForm.controls["dob4"].enable();
        this.posCustomerMasterMainForm.controls["dob5"].enable();
        this.posCustomerMasterMainForm.controls["passport1"].enable();
        this.posCustomerMasterMainForm.controls["passport2"].enable();
        this.posCustomerMasterMainForm.controls["passport3"].enable();
        this.posCustomerMasterMainForm.controls["passport4"].enable();
        this.posCustomerMasterMainForm.controls["passport5"].enable();
        this.posCustomerMasterMainForm.controls["nationalityCode1"].enable();
        this.posCustomerMasterMainForm.controls["nationalityCode2"].enable();
        this.posCustomerMasterMainForm.controls["nationalityCode3"].enable();
        this.posCustomerMasterMainForm.controls["nationalityCode4"].enable();
        this.posCustomerMasterMainForm.controls["nationalityCode5"].enable();

        break;
      case "Company":
        this.posCustomerMasterMainForm.controls["name1"].disable();
        this.posCustomerMasterMainForm.controls["name2"].disable();
        this.posCustomerMasterMainForm.controls["name3"].disable();
        this.posCustomerMasterMainForm.controls["name4"].disable();
        this.posCustomerMasterMainForm.controls["name5"].disable();
        this.posCustomerMasterMainForm.controls["nationality1"].disable();
        this.posCustomerMasterMainForm.controls["nationality2"].disable();
        this.posCustomerMasterMainForm.controls["nationality3"].disable();
        this.posCustomerMasterMainForm.controls["nationality4"].disable();
        this.posCustomerMasterMainForm.controls["nationality5"].disable();
        this.posCustomerMasterMainForm.controls["dob1"].disable();
        this.posCustomerMasterMainForm.controls["dob2"].disable();
        this.posCustomerMasterMainForm.controls["dob3"].disable();
        this.posCustomerMasterMainForm.controls["dob4"].disable();
        this.posCustomerMasterMainForm.controls["dob5"].disable();
        this.posCustomerMasterMainForm.controls["passport1"].disable();
        this.posCustomerMasterMainForm.controls["passport2"].disable();
        this.posCustomerMasterMainForm.controls["passport3"].disable();
        this.posCustomerMasterMainForm.controls["passport4"].disable();
        this.posCustomerMasterMainForm.controls["passport5"].disable();
        this.posCustomerMasterMainForm.controls["nationalityCode1"].disable();
        this.posCustomerMasterMainForm.controls["nationalityCode2"].disable();
        this.posCustomerMasterMainForm.controls["nationalityCode3"].disable();
        this.posCustomerMasterMainForm.controls["nationalityCode4"].disable();
        this.posCustomerMasterMainForm.controls["nationalityCode5"].disable();

        break;
      default:
        break;
    }
  }

  setPassport(event: any) {
    if (
      this.posCustomerMasterMainForm.controls["custIdType"].value === "PASSPORT"
    ) {
      this.posCustomerMasterMainForm.controls["passport1"].setValue(
        event.target.value
      );
    }
  }

  openShowTransdetails() {
    const modalRef: NgbModalRef = this.modalService.open(
      ShowTransDetailsComponent,
      {
        size: "xl",
        backdrop: true,
        keyboard: false,
        windowClass: "modal-dialog-centered modal-dialog-scrollable",
      }
    );
    modalRef.componentInstance.customerCode = this.existCustomerCode;
    modalRef.componentInstance.data = this.content;
  }

  IDDetailsTabEnable() {
    if (
      this.comService.allbranchMaster?.POSCUSTDETAILSFROMREADER === true &&
      (this.comService.allbranchMaster?.COUNTRY_CODE === "KWT" ||
        this.comService.allbranchMaster?.COUNTRY_CODE === "KW")
    ) {
      this.IDDetailsValidation = true;
    }
  }

  loyaltyDetailsVisiblity() {
    if (this.loyaltyCode !== "") {
      this.isLoyaltyVisible = true;
    }
  }

  updateLoyaltyPoints() {
    let payload = {
      REFMID: 0,
      BRANCH_CODE: this.branchCode,
      VOCTYPE: this.vocDetails?.VOCTYPE || "",
      VOCNO: this.vocDetails?.VOCNO || "",
      YEARMONTH: this.vocDetails?.YEARMONTH || "",
      LOYALTY_CODE: this.posCustomerMasterMainForm.value.loyaltyCode || "",
      SALE_WT: 0,
      LOYALTY_WT: 0,
      REDEEM_WT: 0,
      CUSTOMER_CODE: this.generatedCustomerCode
        ? this.generatedCustomerCode
        : this.existCustomerCode || "",
      MID: 0,
      REDEEM_MID: 0,
      SALE_AMT: 0,
      LOYALTY_POINTS: Number(
        this.posCustomerMasterMainForm.value.openingLoyaltyPoints
      ),
      REDEEM_POINTS: 0,
      REDEEM_AMT: 0,
      LOYALTY_AMT: 0,
      LTVOCDATE: "2024-10-25T06:58:45.374Z",
      EXPIRE_DATE: "2024-10-25T06:58:45.374Z",
      ALLOCATE_POINTS: 0,
      PENDING_POINTS: 0,
    };

    let API = `LoyaltyTrans/UpdateLoyaltyOpeningPOSCustMaster`;

    let sub: Subscription = this.apiService
      .postDynamicAPI(API, payload)
      .subscribe((res) => {
        if (res.status === "Success") {
          Swal.fire({
            title: "Success",
            text: "Customer Loyalty Points Updated!",
            icon: "success",
            confirmButtonColor: "#336699",
            confirmButtonText: "Ok",
          });
        }
      });
  }

  getFestivalCheck(event: any, controller: any) {
    switch (controller) {
      case "eidFest":
        this.isFestivalEid = event.checked;

        break;
      case "christmasFest":
        this.isFestivalChristmas = event.checked;

        break;
      case "diwaliFest":
        this.isFestivalDiwali = event.checked;

        break;
      case "nationalDayFest":
        this.isFestivalNationalday = event.checked;

        break;
      case "pongalandsankrantiFest":
        this.isFestivalPongal = event.checked;

        break;
      case "newyearFest":
        this.isFestivalNewyear = event.checked;

        break;

      default:
        break;
    }
  }

  // SPvalidateLookupField(
  //   event: any,
  //   LOOKUPDATA: MasterSearchModel,
  //   FORMNAME: string,
  //   isCurrencyField: boolean
  // ) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value;

  //   if (event.target.value === "" || this.flag?.VIEW) {
  //     return;
  //   }

  //   let param = {
  //     PAGENO: LOOKUPDATA.PAGENO,
  //     RECORDS: LOOKUPDATA.RECORDS,
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECONDITION: LOOKUPDATA.WHERECONDITION,
  //     searchField: LOOKUPDATA.SEARCH_FIELD,
  //     searchValue: LOOKUPDATA.SEARCH_VALUE,
  //   };

  //   this.comService.showSnackBarMsg("MSG81447");

  //   let Sub: Subscription = this.apiService
  //     .postDynamicAPI("MasterLookUp", param)
  //     .subscribe(
  //       (result) => {
  //         this.comService.closeSnackBarMsg();
  //         let data = result.dynamicData[0];

  //         if (data && data.length > 0) {
  //           if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE !== "") {
  //             let searchResult = this.comService.searchAllItemsInArray(
  //               data,
  //               LOOKUPDATA.SEARCH_VALUE
  //             );

  //             if (searchResult && searchResult.length > 0) {
  //               let matchedItem = searchResult[0];
  //               this.posCustomerMasterMainForm.controls.parentPosCode.setValue(
  //                 matchedItem.CODE
  //               );
  //             } else {
  //               this.comService.toastErrorByMsgId("No data found");
  //               LOOKUPDATA.SEARCH_VALUE = "";
  //               this.posCustomerMasterMainForm.controls.parentPosCode.setValue(
  //                 ""
  //               );
  //             }
  //           }
  //         } else {
  //           this.comService.toastErrorByMsgId("No data found");
  //           LOOKUPDATA.SEARCH_VALUE = "";
  //           this.posCustomerMasterMainForm.controls.parentPosCode.setValue("");
  //         }
  //       },
  //       (err) => {
  //         this.comService.toastErrorByMsgId("MSG2272");
  //         this.posCustomerMasterMainForm.controls.parentPosCode.setValue("");
  //       }
  //     );

  //   this.subscriptions.push(Sub);
  // }



  SPvalidateLookupField(
    event: any,
    LOOKUPDATA: MasterSearchModel,
    FORMNAME: string,
    isCurrencyField: boolean
  ) {
    const searchValue = event.target.value?.trim();
    
    if (!searchValue || this.flag === 'VIEW') return;
  
    LOOKUPDATA.SEARCH_VALUE = searchValue;
  
    const param = {
      PAGENO: LOOKUPDATA.PAGENO,
      RECORDS: LOOKUPDATA.RECORDS,
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECONDITION: LOOKUPDATA.WHERECONDITION,
      searchField: LOOKUPDATA.SEARCH_FIELD,
      searchValue: LOOKUPDATA.SEARCH_VALUE,
    };
  
    this.comService.showSnackBarMsg("MSG81447");
  
    const sub: Subscription = this.apiService.postDynamicAPI("MasterLookUp", param).subscribe({
      next: (result) => {
        this.comService.closeSnackBarMsg();
        const data = result.dynamicData?.[0];
  
        if (data?.length) {
          if (LOOKUPDATA.FRONTENDFILTER && LOOKUPDATA.SEARCH_VALUE) {
            const searchResult = this.comService.searchAllItemsInArray(
              data,
              LOOKUPDATA.SEARCH_VALUE
            );
  
            if (searchResult?.length) {
              const matchedItem = searchResult[0];
              this.posCustomerMasterMainForm.controls[FORMNAME].setValue(
                matchedItem.CODE
              );
            } else {
              this.comService.toastErrorByMsgId("No data found");
              this.clearLookupData(LOOKUPDATA, FORMNAME);
            }
          }
        } else {
          this.comService.toastErrorByMsgId("No data found");
          this.clearLookupData(LOOKUPDATA, FORMNAME);
        }
      },
      error: () => {
        this.comService.toastErrorByMsgId("MSG2272");
        this.clearLookupData(LOOKUPDATA, FORMNAME);
      }
    });
  
    this.subscriptions.push(sub);
  }
  
  clearLookupData(LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = "";
    this.posCustomerMasterMainForm.controls[FORMNAME].setValue("");
  }
  
}
