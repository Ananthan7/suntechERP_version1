import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';

@Component({
  selector: 'app-pos-customer-master-main',
  templateUrl: './pos-customer-master-main.component.html',
  styleUrls: ['./pos-customer-master-main.component.scss']
})
export class PosCustomerMasterMainComponent implements OnInit {

  
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
    aboutsms : [false],
    aboutphoneCall : [false],
    aboutemail : [false],
    aboutwhatsapp : [false],
    aboutnotInterested : [false],
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

  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  countrySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.country.setValue(e.CODE);
    this.posCustomerMasterMainForm.controls.countryCode.setValue(e.DESCRIPTION);
  }

  stateSelected(e: any) {
    console.log(e);
  }

  categorySelected(e: any) {
    console.log(e);
    this.posCustomerMasterMainForm.controls.category.setValue(e.CODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


}
