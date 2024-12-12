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

  CountryCodeData:MasterSearchModel ={}

  ReligionCodeData:MasterSearchModel ={}

  FavoriteFestivalCodeData:MasterSearchModel ={}

  CategoryCodeData:MasterSearchModel ={}

  CustStatusCodeData:MasterSearchModel ={}

  NaionalityCodeData:MasterSearchModel ={}

  StateCodeData:MasterSearchModel ={}

  CityCodeData:MasterSearchModel ={}

  LanguageCodeData:MasterSearchModel ={}

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

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  AccountDataSelected(e:any){
    console.log(e);
  }

  SubLedgerDataSelected(e:any){
    console.log(e);
  }

  CountryDataSelected(e:any){
    console.log(e);
  }

  ReligionDataSelected(e:any){
    console.log(e);
  }

  CategoryDataSelected(e:any){
    console.log(e);
  }

  CustStatusDataSelected(e:any){
    console.log(e);
  }

  NaionalityDataSelected(e:any){
    console.log(e);
  }

  StateDataSelected(e:any){
    console.log(e);
  }

  CityDataSelected(e:any){
    console.log(e);
  }

  LanguageDataSelected(e:any){
    console.log(e);
  }

  FavoriteFestivalDataSelected(e:any){
    console.log(e);
  }

  setPostData(){
    let form = this.contactMasterForm.value;
    return{
      INCOME: this.commonService.emptyToZero(form.Income),
      REFMID: 0,
      ACCODE: this.commonService.nullToString(form.AccountCode),
      CUSTOMER_NAME: this.commonService.nullToString(form.Name),
      DESIGNATION:this.commonService.nullToString(form.Designation),
      MOBILE: this.commonService.nullToString(form.Moblie),
      EMAIL: this.commonService.nullToString(form.Email),
      DEFAULT_CONTACT: true,
      ACMID: 0,
      ACC_DESCRIPTION: this.commonService.nullToString(form.AccountCodeDes),
      SL_CODE: this.commonService.nullToString(form.SubLedgerCode),
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
      TEL_R_CODE: this.commonService.nullToString(form.telRCode),
      TEL_O_CODE:  this.commonService.nullToString(form.telOCode),
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
}
