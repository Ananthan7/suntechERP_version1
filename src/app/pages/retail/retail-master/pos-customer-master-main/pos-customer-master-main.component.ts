import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { CommonServiceService } from 'src/app/services/common-service.service';

@Component({
  selector: 'app-pos-customer-master-main',
  templateUrl: './pos-customer-master-main.component.html',
  styleUrls: ['./pos-customer-master-main.component.scss']
})
export class PosCustomerMasterMainComponent implements OnInit {

  genderList: any = [];
  maritalStatusList: any = [];
  nameList: any = [];
  bloodGroupList: any = [];
  opinionList: any = [];
  ratingList: any = [];
  branchCode?: String;
  vocMaxDate = new Date();
  currentDate = new Date();



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
    code : [''],
    parentPosCode : [''],
    refBy : [''],
    name : [''],
    nameDesc : [''],
    creditCardLimitCheck : [false],
    creditCardLimit : [''],
    gender : [''],
    maritalSt : [''],
    dob : [''],
    weddate : [''],
    country : [''],
    countryCode : [''],
    moblieCountry : [''],
    moblieNumber : [''],
    moblie1Country : [''],
    moblie1Number : [''],
    emailId : [''],
    telRCountry : [''],
    telRNumber : [''],
    tel0Country : [''],
    tel0number : [''],
    faxNo : [''],
    custType : [''],
    nationality : [''],
    state : [''],
    city : [''],
    language : [''],
    favCelebration : [''],
    vat : [''],
    panNo : [''],
    whatsappCountryCode : [''],
    whatsappNumber : [''],
    spouse : [''],
    company : [''],
    zodiacSign :[''],
    noOfChildren : [''],
    religion : [''],
    category : [''],
    custStatus : [''],
    income : [''],
    bloodGroup : [''],
    custIdType : [''],
    custID : [''],
    custDate : [''],
    POBox : [''],
    address :[''],
    officialAddress : [''],
    deliveryAddress : [''],
    remarks : [''],
    sms : [false],
    phoneCall : [false],
    email : [false],
    whatsapp : [false],
    notInterested : [false],
    tv : [false],
    outdoor : [false],
    online : [false],
    socialMedia : [false],
    newspaper : [false],
    radio : [false],
    other : [false],
    promotionalOffers : [false],
    sportsEvents : [false],
    charityEvents : [false],
    stageShows : [false],
    seminars : [false],
    personalSkills : [false],
    productSelection : [''],
    service : [''],
    makingChanges : [''],
    brand : [''],
    buyBackPolicy : [''],
    loactionandParkingFacility : [''],
    staffCourtesy : [''],
    productKnowledgeOfOurStaff : [''],
    locationandAmbienceOfShop : [''],
    varietyAndQualityOfJewellery : [''],
    overallExperience : [''],
    showroomAccessibility : [''],
    productRangeAvailability : [''],
    reasonOfPurchase : [''],
    gifrPurchased : [''],
    occasionOfPurchase : [''],
    ageGroup : [''],
    lookingFor : [''],
    nextVisit : [''],
    occupation : [''],
    createdBranch : [''],
    openedOn : [''],
    voucher : [''],
    date : [''],
    branchLoc : [''],
    amount : [''],
    totalSale : [''],
    fcn_cust_detail_gender: ['', Validators.required],

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private comService: CommonServiceService,
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
    this.posCustomerMasterMainForm.controls.stateCode.setValue(e.STATE_CODE);
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
    this.posCustomerMasterMainForm.controls.refByCode.setValue(e.CODE);
  }

  nationalitySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.nationalityCode.setValue(e.CODE);
  }

  citySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.cityCode.setValue(e.CODE);
  }

  languageSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.languageCode.setValue(e.CODE);
  }

  favCelebrationSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.favCelebrationCode.setValue(e.CODE);
  }

  religionSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.religionCode.setValue(e.CODE);
  }

  custStatusSelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.custStatusCode.setValue(e.CODE);
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


}
