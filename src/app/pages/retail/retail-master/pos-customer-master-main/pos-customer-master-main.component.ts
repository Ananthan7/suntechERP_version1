import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pos-customer-master-main',
  templateUrl: './pos-customer-master-main.component.html',
  styleUrls: ['./pos-customer-master-main.component.scss']
})
export class PosCustomerMasterMainComponent implements OnInit {
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
  customerDetails: any = {}

  // Dialog box
  dialogBox: any;
  dialogBoxResult: any;

  amlNameValidationData = false;
  dummyDate = '1900-01-01T00:00:00';
  dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];


  countryCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 26,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Country Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  parentPosCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Parent Pos Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  refByCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Ref By Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  nationalityCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Nationality Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  stateCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'STATE CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  cityCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 28,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'City CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  languageCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Language CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  favCelebrationCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Fav Celebration CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  religionCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Religion CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  custStatusCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Religion CODE',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }


  categoryCode: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Category',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }

  posCustomerMasterMainForm: FormGroup = this.formBuilder.group({
    code: [''],
    parentPosCode: [''],
    refBy: [''],
    name: [''],
    nameDesc: [''],
    creditCardLimitCheck: [false],
    creditCardLimit: [''],
    gender: [''],
    maritalSt: [''],
    dob: [''],
    weddate: [''],
    country: [''],
    countryCode: [''],
    moblieCountry: [''],
    moblieNumber: [''],
    moblie1Country: [''],
    moblie1Number: [''],
    emailId: [''],
    telRCountry: [''],
    telRNumber: [''],
    tel0Country: [''],
    tel0number: [''],
    faxNo: [''],
    custType: [''],
    nationality: [''],
    state: [''],
    city: [''],
    language: [''],
    favCelebration: [''],
    vat: [''],
    panNo: [''],
    whatsappCountryCode: [''],
    whatsappNumber: [''],
    spouse: [''],
    company: [''],
    zodiacSign: [''],
    noOfChildren: [''],
    religion: [''],
    category: [''],
    custStatus: [''],
    income: [''],
    bloodGroup: [''],
    custIdType: [''],
    custID: [''],
    custDate: [''],
    POBox: [''],
    address: [''],
    officialAddress: [''],
    deliveryAddress: [''],
    remarks: [''],
    sms: [false],
    phoneCall: [false],
    email: [false],
    whatsapp: [false],
    notInterested: [false],
    tv: [false],
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
    productSelection: [''],
    service: [''],
    makingChanges: [''],
    brand: [''],
    buyBackPolicy: [''],
    loactionandParkingFacility: [''],
    staffCourtesy: [''],
    productKnowledgeOfOurStaff: [''],
    locationandAmbienceOfShop: [''],
    varietyAndQualityOfJewellery: [''],
    overallExperience: [''],
    showroomAccessibility: [''],
    productRangeAvailability: [''],
    reasonOfPurchase: [''],
    gifrPurchased: [''],
    occasionOfPurchase: [''],
    ageGroup: [''],
    lookingFor: [''],
    nextVisit: [''],
    occupation: [''],
    createdBranch: [''],
    openedOn: [''],
    voucher: [''],
    date: [''],
    branchLoc: [''],
    amount: [''],
    totalSale: [''],
    fcn_cust_detail_gender: [''],

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private apiService: SuntechAPIService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.posCustomerMasterMainForm.controls['createdBranch'].disable();
    this.getDropDownStatus();
  }

  countrySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.country.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.countryCode.setValue(e.DESCRIPTION);
    this.posCustomerMasterMainForm.controls.moblieCountry.setValue(e.MobileCountryCode);
    this.posCustomerMasterMainForm.controls.moblie1Country.setValue(e.MobileCountryCode);
    this.posCustomerMasterMainForm.controls.telRCountry.setValue(e.MobileCountryCode);
    this.posCustomerMasterMainForm.controls.tel0Country.setValue(e.MobileCountryCode);
  }

  stateSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.state.setValue(e.STATE_CODE);
  }

  categorySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.category.setValue(e.CODE);
  }

  parentPosSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.parentPosCode.setValue(e.CODE);
  }

  refBySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.refBy.setValue(e.CODE);
  }

  nationalitySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.nationality.setValue(e.CODE);
  }

  citySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.city.setValue(e.CODE);
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
    this.posCustomerMasterMainForm.controls.religion.setValue(e.CODE);
  }

  custStatusSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.custStatus.setValue(e.CODE);
  }

  getDropDownStatus() {
    this.maritalStatusList = this.comService.getComboFilterByID('Marital Status');
    this.genderList = this.comService.getComboFilterByID('gender');
    this.nameList = this.comService.getComboFilterByID('POS Customer Prefix');
    this.bloodGroupList = this.comService.getComboFilterByID('Blood Group');
    this.opinionList = this.comService.getComboFilterByID('Customer Opinion');
    this.ratingList = this.comService.getComboFilterByID('Customer Rating');





  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }




  customerSave() {
    if (!this.isCustProcessing || this.isCustProcessing) {
      this.isCustProcessing = true;


      this.customerDetails.MOBILE =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_phone;
      this.customerDetails.EMAIL =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_email;
      this.customerDetails.ADDRESS =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_address;
      this.customerDetails.COUNTRY_CODE =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_country;
      this.customerDetails.CITY =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_city;
      this.customerDetails.STATE =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_state;
      this.customerDetails.NATIONAL_IDENTIFICATION_NO =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_idcard;


      this.customerDetails.NAME =
        this.posCustomerMasterMainForm.value.fcn_customer_detail_name;

      this.customerDetails.FIRSTNAME =
        this.posCustomerMasterMainForm.value.fcn_customer_detail_fname;
      this.customerDetails.MIDDLENAME =
        this.posCustomerMasterMainForm.value.fcn_customer_detail_mname;
      this.customerDetails.LASTNAME =
        this.posCustomerMasterMainForm.value.fcn_customer_detail_lname;
      this.customerDetails.MOBILE =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_phone;

      this.customerDetails.IDCATEGORY =
        // this.customerDetails.CUST_TYPE =
        this.posCustomerMasterMainForm.value.fcn_cust_detail_idType;


      // this.modalService.
      // if (this.amlNameValidation) {

      // trigger form errors
      Object.values(this.posCustomerMasterMainForm.controls).forEach(control => {
        control.markAsTouched();
      });

      if (!this.posCustomerMasterMainForm.invalid) {

        const posCustomer = {
          CODE: this.posCustomerMasterMainForm.value.code || '',
          NAME: this.posCustomerMasterMainForm.value.nameDesc || '',
          COMPANY: this.posCustomerMasterMainForm.value.company || '',
          ADDRESS: this.posCustomerMasterMainForm.value.address || '',
          POBOX_NO: this.posCustomerMasterMainForm.value.POBox || '',
          STATE: this.posCustomerMasterMainForm.value.state || '',
          CITY: this.posCustomerMasterMainForm.value.city || '',
          ZIPCODE: '',
          COUNTRY_CODE: this.posCustomerMasterMainForm.value.country || '',
          EMAIL: this.posCustomerMasterMainForm.value.email || '',
          TEL1: this.posCustomerMasterMainForm.value.telRNumber || '',
          TEL2: this.posCustomerMasterMainForm.value.tel0number || '',
          MOBILE: `${this.posCustomerMasterMainForm.value.moblieNumber}` || '',
          FAX: this.posCustomerMasterMainForm.value.faxNo || '',
          MARITAL_ST: this.posCustomerMasterMainForm.value.maritalSt || 'Unknown',
          WED_DATE: this.posCustomerMasterMainForm.value.weddate || this.dummyDate,
          SPOUSE_NAME: this.posCustomerMasterMainForm.value.spouse || '',
          REMARKS: this.posCustomerMasterMainForm.value.remarks || '',
          DATE_OF_BIRTH: this.posCustomerMasterMainForm.value.dob || this.dummyDate,
          OPENING_ON: this.posCustomerMasterMainForm.value.openedOn ?? "1900-01-01T00:00:00",
          GENDER: this.posCustomerMasterMainForm.value.gender || '',
          REGION: '',
          NATIONALITY: this.posCustomerMasterMainForm.value.nationality || '',
          RELIGION: this.posCustomerMasterMainForm.value.religion || '',
          TYPE: '',
          CATEGORY: this.posCustomerMasterMainForm.value.category || '',
          INCOME: 0,
          CUST_STATUS: this.posCustomerMasterMainForm.value.custStatus || '',
          MID: 0,
          PICTURE_NAME: '',
          PICTURE: '',
          SALVOCTYPE_NO: this.posCustomerMasterMainForm.value.voucher || '',
          SALDATE: this.posCustomerMasterMainForm.value.date || this.dummyDate,
          SALAMOUNT: this.posCustomerMasterMainForm.value.amount || 0,
          SALBRLOC: this.posCustomerMasterMainForm.value.branchLoc || '',
          Branch_Code: '',
          TOTALSALES: this.posCustomerMasterMainForm.value.totalSale || 0,
          POSCUSTIDNO: this.posCustomerMasterMainForm.value.custID || '',
          POSSMAN: '',
          POSCustPrefix: '0',
          MOBILE1: this.posCustomerMasterMainForm.value.moblie1Number || '',
          CUST_Language: this.posCustomerMasterMainForm.value.language || '',
          CUST_TYPE: this.posCustomerMasterMainForm.value.custType || '',
          FAVORITE_CELEB: this.posCustomerMasterMainForm.value.favCelebration || '',
          STAFF_COURTESY: this.posCustomerMasterMainForm.value.staffCourtesy || '',
          PRODUCT_KNOWLEDGE: this.posCustomerMasterMainForm.value.productKnowledgeOfOurStaff || ' ',
          LOCATION_AMBIENCE: this.posCustomerMasterMainForm.value.locationandAmbienceOfShop || '',
          VARIETY_QUALITY: this.posCustomerMasterMainForm.value.varietyAndQualityOfJewellery || '',
          OVERALL_EXP: this.posCustomerMasterMainForm.value.overallExperience || '',
          PRODUCT_SELECTION: this.posCustomerMasterMainForm.value.productSelection || '',
          SERVICE: this.posCustomerMasterMainForm.value.service || '',
          MAKING_CHARGES: this.posCustomerMasterMainForm.value.makingChanges || '',
          BRAND_NAME: this.posCustomerMasterMainForm.value.brand || '',
          BUY_BACK: this.posCustomerMasterMainForm.value.buyBackPolicy || '',
          LOCATION_PARKING: this.posCustomerMasterMainForm.value.loactionandParkingFacility || '',
          SOURCE: '',
          PREFERENCE_CONTACT: '',
          MOBILECODE1: this.posCustomerMasterMainForm.value.moblieCountry.toString() || '',
          MOBILECODE2: this.posCustomerMasterMainForm.value.moblie1Country || '',
          IDCATEGORY: '',
          ADDRESS_OFFICIAL: this.posCustomerMasterMainForm.value.officialAddress || '',
          ADDRESS_DELIVARY: this.posCustomerMasterMainForm.value.deliveryAddress || '',
          INTERESTED_IN: '',
          BLOOD_GROUP: this.posCustomerMasterMainForm.value.bloodGroup || '',
          NO_OF_CHILDREN: Number(this.posCustomerMasterMainForm.value.noOfChildren) || 0,
          ZODIAC_SIGN: this.posCustomerMasterMainForm.value.zodiacSign || '',
          DESIGNATION: '',
          LEVELFLAG: 0,
          INCOMERANGE: '',
          LAST_UPDATED_DATE: "1900-01-01T00:00:00",

          TAXOFFICENO: '',
          SALESMANNAME: '',
          DEFAULT_DISDIAMONDPERCENT: 0,
          DEFAULT_DISMETALPERCENT: 0,
          LOYALTYALLOW: false,
          LOYALTYALLOWEMAIL: false,
          LOYALTYALLOWSMS: false,
          SENDPROMOTIONALEMAIL: false,
          LOYALTY_CODE: '',
          PREFERRED_COLOR: '',
          PREFERRED_ITEM: '',
          WRIST_SIZE: '',
          FINGER_SIZE: '',
          LOYALTY_POINT: 0,
          FIRSTNAME: this.posCustomerMasterMainForm.value.fcn_customer_detail_fname || '',
          MIDDLENAME: this.posCustomerMasterMainForm.value.fcn_customer_detail_mname || '',
          LASTNAME: this.posCustomerMasterMainForm.value.fcn_customer_detail_lname || '',
          POSKnownAbout: 0,
          CIVILID_IMGPATH: '',
          SUGGESTION: '',
          AMLNAMEVALIDATION: false,
          AML_TYPE: false,
          UN_NUMBER: '',
          NAME_1: '',
          NAME_2: '',
          NAME_3: '',
          NAME_4: '',
          NAME_5: '',
          DOB_2: "1900-01-01T00:00:00",
          DOB_3: "1900-01-01T00:00:00",
          DOB_4: "1900-01-01T00:00:00",
          DOB_5: "1900-01-01T00:00:00",
          GOOD_QUALITY: '',
          LOW_QUALITY: '',
          A_K_A: '',
          F_K_A: '',
          NATIONALITY_2: '',
          NATIONALITY_3: '',
          NATIONALITY_4: '',
          NATIONALITY_5: '',
          PASSPORT_NO_1: '',
          PASSPORT_NO_2: '',
          PASSPORT_NO_3: '',
          PASSPORT_NO_4: '',
          PASSPORT_NO_5: '',
          LISTED_ON_DATE: "1900-01-01T00:00:00",
          NATIONAL_IDENTIFICATION_NO: this.posCustomerMasterMainForm.value.fcn_cust_detail_idcard || '',
          OTHER_INFORMATION: '',
          LINKS: '',
          FATHERNAME: '',
          PROMO_NEEDED: '',
          PROMO_HOW_OFTEN: '',
          CHILDNAME1: '',
          CHILDNAME2: '',
          CHILDNAME3: '',
          CHILDNAME4: '',
          CHILDDATEOFBIRTH1: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH2: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH3: "1900-01-01T00:00:00",
          CHILDDATEOFBIRTH4: "1900-01-01T00:00:00",
          OTHERNAMES: '',
          AUTOCREATEMST: false,
          WUPMOBILECODE: this.posCustomerMasterMainForm.value.whatsappCountryCode,
          WUPMOBILENO: this.posCustomerMasterMainForm.value.whatsappNumber,
          OCCUPATION: '',
          ShowRoomAccessibility: '',
          ProductRangeAvailability: '',
          DIGISCREENED: false,
          BR_CODE: '',
          SPOUSE_DATE_OF_BIRTH: "1900-01-01T00:00:00",
          TEL_R_CODE: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.telRCountry)}`,
          TEL_O_CODE: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.tel0Country)}`,
          GST_NUMBER: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.fcn_cust_detail_city)}`,
          VAT_NUMBER: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.vat)}`,
          PARENT_CODE: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.parentPosCode)}`,
          REFERED_BY: `${this.comService.emptyToZero(this.posCustomerMasterMainForm.value.refBy)}`,
          CREDIT_LIMIT: this.posCustomerMasterMainForm.value.creditCardLimit || 0,
          CREDIT_LIMIT_STATUS: false,
          PANCARDNO: this.posCustomerMasterMainForm.value.panNo || '111111' || '',
          VOCTYPE: this.vocDetails?.VOCTYPE ?? '',
          YEARMONTH: this.vocDetails?.YEARMONTH ?? localStorage.getItem('YEAR'),
          VOCNO: this.vocDetails?.VOCNO ?? 0,
          VOCDATE: this.vocDetails?.VOCDATE ?? "1900-01-01T00:00:00",

          'OT_TRANSFER_TIME': '',
          'COUNTRY_DESC': this.posCustomerMasterMainForm.value.countryCode || '',
          'STATE_DESC': '',
          'CITY_DESC': '',
          'FAVORITE_CELEB_DESC': '',
          'RELIGION_DESC': '',
          'CATEGORY_DESC': '',
          'CUST_STATUS_DESC': '',
          'NATIONALITY_DESC': '',
          'TYPE_DESC': '',
          'DETAILS_JOHARA': '',
          'DETAILS_FARAH': '',
          'DETAILS_JAWAHERALSHARQ': '',
          'FESTIVAL_EID': false,
          'FESTIVAL_CHRISTMAS': false,
          'FESTIVAL_DIWALI': false,
          'FESTIVAL_NATIONALDAY': false,
          'FESTIVAL_ONAM': false,
          'FESTIVAL_PONGAL': false,
          'FESTIVAL_NEWYEAR': false,
          'REASON_OF_PURCHASE': '',
          'AGE_GROUP': '',
          'GIFT_PURCHASED_FOR': '',
          'PURCHASE_OCCASION': '',
          'NEXT_VISIT': '',
          'SHOWROOMACCESSIBILITY': this.posCustomerMasterMainForm.value.showroomAccessibility || '',
          'PRODUCTRANGEAVAILABILITY': this.posCustomerMasterMainForm.value.productRangeAvailability || '',
          'LOOKING_FOR': '',
          'POSCUSTIDEXP_DATE': this.posCustomerMasterMainForm.value.custDate ? this.posCustomerMasterMainForm.value.custDate : "1900-01-01T00:00:00",

          'ATTACHMENT_FROM_SCANNER': false,
          'GOOD_QUALITY_A_K_A': '',
          'LOW_QUALITY_A_K_A': '',
          'POSKNOWNABOUT': 0
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
        if (
          this.content?.FLAG == 'EDIT'
        ) {
          apiCtrl = `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`;
          custResponse = this.apiService.putDynamicAPI(apiCtrl, posCustomer)
        } else {
          apiCtrl = 'PosCustomerMaster/InsertCustomerMaster';
          custResponse = this.apiService.postDynamicAPI(apiCtrl, posCustomer)
        }


        custResponse.subscribe(async (data) => {

          this.isCustProcessing = false;

          if (data.status == 'Success') {
            this.customerDetails = await data.response;


            this.posCustomerMasterMainForm.controls['fcn_cust_detail_phone'].setValue(
              this.customerDetails.MOBILE
            );
            this.posCustomerMasterMainForm.controls['fcn_cust_detail_email'].setValue(
              this.customerDetails.EMAIL
            );
            this.posCustomerMasterMainForm.controls[
              'fcn_cust_detail_address'
            ].setValue(this.customerDetails.ADDRESS);
            this.posCustomerMasterMainForm.controls[
              'fcn_cust_detail_country'
            ].setValue(this.customerDetails.COUNTRY_CODE);
            this.posCustomerMasterMainForm.controls['fcn_cust_detail_city'].setValue(
              this.customerDetails.CITY
            );
            this.posCustomerMasterMainForm.controls['fcn_cust_detail_idcard'].setValue(
              this.customerDetails.NATIONAL_IDENTIFICATION_NO
            );
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
            this.snackBar.open('Customer details saved successfully', '', {
              duration: 1000 // time in milliseconds
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
                  this.comService.allbranchMaster.AMLDIGICOMPANYNAME || ' '
                ),
                AMLDIGIUSERNAME: encodeURIComponent(
                  this.comService.allbranchMaster.AMLDIGIUSERNAME || ' '
                ),
                AMLDIGIPASSWORD: encodeURIComponent(
                  this.comService.allbranchMaster.AMLDIGIPASSWORD || ' '
                ),
                CODE: encodeURIComponent(this.customerDetails.CODE || ' '),
                FIRSTNAME:
                  ''
                // encodeURIComponent(this.customerDetails.FIRSTNAME)
                // || '%27%27'
                ,
                MIDDLENAME: ''
                // encodeURIComponent(this.customerDetails.MIDDLENAME)
                // || '%27%27'
                ,
                LASTNAME:
                  encodeURIComponent(
                    this.customerDetails.NAME //
                    // this.customerDetails.LASTNAME || ''
                  )
                  || ''
                ,
                NATIONALITY:
                  encodeURIComponent(this.customerDetails.NATIONALITY),
                // ||                '%27%27',
                // NATIONALITY:  encodeURIComponent(this.customerDetails.NATIONALITY || ' '),
                DATE_OF_BIRTH:
                  // this.comService.nullOrEmpty(

                  encodeURIComponent(
                    this.comService.convertDateToMDY(
                      this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
                    )
                  )
                ,
                // CUST_Type: this.comService.nullOrEmpty(
                //   encodeURIComponent(this.customerDetails.CUST_TYPE),
                //   '%27%27'),
                CUST_Type: encodeURIComponent('I'),

                // CUST_Type: encodeURIComponent(
                //   this.customerDetails.CUST_Type || ' '
                // ),
                AMLUSERID:
                  encodeURIComponent(this.comService.allbranchMaster.AMLUSERID)
                ,
                AMLDIGITHRESHOLD:
                  encodeURIComponent(
                    this.comService.allbranchMaster.AMLDIGITHRESHOLD
                  ) || '%27%27',
                DIGIIPPATH:
                  encodeURIComponent(this.comService.allbranchMaster.DIGIIPPATH) ||
                  '%27%27',
                Gender:
                  encodeURIComponent(this.customerDetails?.GENDER) ||
                  '%27%27',
                CustomerIdType:
                  encodeURIComponent(this.customerDetails?.IDCATEGORY) ||
                  '%27%27',
                CustomerIdNumber:
                  encodeURIComponent(this.customerDetails?.NATIONAL_IDENTIFICATION_NO) ||
                  '%27%27',
              };
              this.snackBar.open('Loading...');

              // companyname=${data.AMLDIGICOMPANYNAME}&username=${data.AMLDIGIUSERNAME}&Password=${data.AMLDIGIPASSWORD}&CustomerId=${data.CODE}&FirstName=${data.FIRSTNAME}&MiddleName=${data.MIDDLENAME}&LastName=${data.LASTNAME}&MatchCategory=&CustomerIdNumber=${data.CustomerIdNumber}&Nationality=${data.NATIONALITY}&DOB=${data.DATE_OF_BIRTH}&CustomerType=${data.CUST_Type}&UserId=${data.AMLUSERID}&Threshold=${data.AMLDIGITHRESHOLD}&CompName=${data.AMLDIGICOMPANYNAME}&GeneratePayload=1&IPPath=${data.DIGIIPPATH}&Gender=${data.Gender}&CustomerIdType=${data.CustomerIdType}

              const queryParams = {
                companyname: payload.AMLDIGICOMPANYNAME,
                username: payload.AMLDIGIUSERNAME,
                Password: payload.AMLDIGIPASSWORD,
                CustomerId: payload.CODE,
                FirstName: payload.FIRSTNAME,
                MiddleName: payload.MIDDLENAME,
                LastName: payload.LASTNAME,
                MatchCategory: '',
                CustomerIdNumber: payload.CustomerIdNumber,
                Nationality: payload.NATIONALITY,
                DOB: payload.DATE_OF_BIRTH,
                CustomerType: payload.CUST_Type,
                UserId: payload.AMLUSERID,
                Threshold: payload.AMLDIGITHRESHOLD,
                CompName: payload.AMLDIGICOMPANYNAME,
                GeneratePayload: '1',
                IPPath: payload.DIGIIPPATH,
                Gender: payload.Gender,
                CustomerIdType: payload.CustomerIdType
              };
              if (this.amlNameValidation) {

                this.apiService.getDynamicAPIwithParams('AMLValidation', queryParams).subscribe(async (data) => {
                  this.isCustProcessing = false;

                  this.snackBar.open('Loading...');

                  this.apiService
                    .putDynamicAPI(
                      `PosCustomerMaster/UpdateDigiScreened/code=${this.customerDetails.CODE}/DigiScreened=true`,
                      ''
                    )
                    .subscribe((resp) => {
                      this.snackBar.dismiss();
                      if (resp.status == "Success") {
                        // this.customerDetails = resp.response;
                        this.customerDetails.DIGISCREENED = resp.response != null ? resp.response?.DIGISCREENED : true;
                      } else {
                        this.snackBar.open('Digiscreen Failed');
                      }

                      console.log('====================================');
                      console.log('resp', resp);
                      console.log('====================================');
                    });

                  if (data.response.isMatched != null) {
                    this.snackBar.dismiss();

                    if (data.response.isMatched.toUpperCase() == 'YES') {
                      // if (data.response == 'yes') {
                      this.openDialog('Warning', 'We cannot proceed', true);
                      this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                          // this.modalReference.close();
                          // this.closeModal();
                        }
                      });
                      // need to use put api
                      this.amlNameValidationData = true;

                      this.apiService
                        .putDynamicAPI(
                          `PosCustomerMaster/updateCustomerAmlNameValidation/code=${this.customerDetails.CODE}/AmlNameValidation=true`,
                          ''
                        )
                        // .updateAMLNameValidation(this.customerDetails.CODE, true)
                        .subscribe((resp) => {
                          // this.customerDetails = resp.response;
                          this.customerDetails.AMLNAMEVALIDATION =
                            resp.response != null ? resp.response?.AMLNAMEVALIDATION : true;

                          console.log('====================================');
                          console.log('resp', resp);
                          console.log('====================================');
                        });
                      // }
                    } else {

                      this.openDialog('Success', JSON.stringify(data.response), true);
                      this.dialogBox.afterClosed().subscribe((data: any) => {
                        if (data == 'OK') {
                          // this.modalReference.close();
                          // this.closeModal();
                        }
                      });
                      //proceed
                      this.amlNameValidationData = false;
                    }
                  } else {
                    this.openDialog('Warning', JSON.stringify(data.response), true);
                    this.dialogBox.afterClosed().subscribe((data: any) => {
                      if (data == 'OK') {
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
            this.snackBar.open(data.message, '', {
              duration: 2000 // time in milliseconds
            });
            // this.modalReference.close();
             this.closeModal();
          }
        });
        // this.closeModal();

      } else {
        this.isCustProcessing = false;

        this.snackBar.open('Please Fill Required Fields', '', {
          duration: 2000 // time in milliseconds
        });
      }
    }
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }


  closeModal() {
    this.customerDetails;
    const returnData = {
      customerDetails: this.customerDetails,
    }
    this.activeModal.close(returnData);
  }

  dummyDateCheck(date: any) {
    if (this.dummyDateArr.includes(date))
      return '';
    else
      return date;
  }

}
