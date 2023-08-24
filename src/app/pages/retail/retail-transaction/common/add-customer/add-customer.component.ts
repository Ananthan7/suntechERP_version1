import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  @Output() closebtnClick = new EventEmitter();

  //variables
  viewOnly: boolean = false;
  isCustProcessing: boolean = false;
  genderList: any = [];
  maritalStatusList: any = [];
  vocMaxDate = new Date();
  currentDate = new Date(new Date());
  fcn_returns_voc_type_val:any;

  nationalityMaster: any = [];
  countryMaster: any = [];
  stateMaster: any = [];
  cityMaster: any = [];
  idTypeOptions: any[] = [];

  customerDetails:any = {}
  dummyDate = '1900-01-01T00:00:00';
  //formgroups
  customerDetailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private commonService: CommonServiceService,
    private snackBar: MatSnackBar,
    private acRoute: ActivatedRoute,
  ) {
    this.customerDetailForm = this.formBuilder.group({
      fcn_customer_detail_name: ['', Validators.required],
      fcn_customer_detail_fname: ['', Validators.required],
      fcn_customer_detail_mname: [''],
      fcn_customer_detail_lname: [''],
      fcn_cust_detail_gender: ['', Validators.required],
      fcn_cust_detail_marital_status: [''],
      fcn_cust_detail_dob: [''],
      fcn_cust_detail_idType: [''],
      fcn_cust_detail_phone: ['', Validators.required],
      fcn_cust_detail_phone2: [''],
      fcn_cust_detail_email: ['', [Validators.email]],
      // fcn_cust_detail_address: ['', Validators.required],
      fcn_cust_detail_address: [''],
      fcn_cust_detail_country: [''],
      fcn_cust_detail_city: [''],
      fcn_cust_detail_nationality: ['', Validators.required],
      fcn_cust_detail_idcard: [''],
      fcn_cust_detail_occupation: [''],
      fcn_cust_detail_company: [''],
      fcn_cust_detail_state: [''],
    });

    this.getRetailSalesMaster()
  }

  ngOnInit(): void {
  }

  onCustomerNameFocus(event: any) {

  }
  nameChange(event: any) {

  }
  changeCountry(data:any){

  }
  changeIdtype(data:any){

  }
  getRetailSalesMaster() {
    let queryParams:any
    this.acRoute.queryParams.subscribe((params) => {
      if (params.vocNo) {
        console.log(params,'params.............................');
        queryParams = params;
      }
    });
    // let API = `RetailSalesDataInDotnet/GetRetailSalesData/BranchCode=${queryParams.branchCode}/VocType=${queryParams.vocType}/YearMonth=${queryParams.yearMonth}/VocNo=${queryParams.vocNo}`
    // this.dataService.getDynamicAPI(API).subscribe((result:any) => {

    // })
  }
  //use: save customer
  customerSave() {
    debugger
    if (!this.isCustProcessing) {
      this.isCustProcessing = true;

      this.customerDetails.MOBILE =
        this.customerDetailForm.value.fcn_cust_detail_phone;
      this.customerDetails.EMAIL =
        this.customerDetailForm.value.fcn_cust_detail_email;
      this.customerDetails.ADDRESS =
        this.customerDetailForm.value.fcn_cust_detail_address;
      this.customerDetails.COUNTRY_CODE =
        this.customerDetailForm.value.fcn_cust_detail_country;
      this.customerDetails.CITY =
        this.customerDetailForm.value.fcn_cust_detail_city;
      this.customerDetails.STATE =
        this.customerDetailForm.value.fcn_cust_detail_state;
      this.customerDetails.NATIONAL_IDENTIFICATION_NO =
        this.customerDetailForm.value.fcn_cust_detail_idcard;

      // this.customerDataForm.controls.fcn_customer_id_number.setValue(
      //   this.customerDetailForm.value.fcn_cust_detail_idcard
      // );
      this.customerDetails.NAME =
        this.customerDetailForm.value.fcn_customer_detail_name;
      // this.customerDataForm.controls.fcn_customer_name.setValue(
      //   this.customerDetailForm.value.fcn_customer_detail_name
      // );
      this.customerDetails.FIRSTNAME =
        this.customerDetailForm.value.fcn_customer_detail_fname;
      this.customerDetails.MIDDLENAME =
        this.customerDetailForm.value.fcn_customer_detail_mname;
      this.customerDetails.LASTNAME =
        this.customerDetailForm.value.fcn_customer_detail_lname;
      this.customerDetails.MOBILE =
        this.customerDetailForm.value.fcn_cust_detail_phone;
      // this.customerDataForm.controls.fcn_customer_mobile.setValue(
      //   this.customerDetailForm.value.fcn_cust_detail_phone
      // );

      this.customerDetails.IDCATEGORY =
        // this.customerDetails.CUST_TYPE =
        this.customerDetailForm.value.fcn_cust_detail_idType;
      // this.customerDataForm.controls.fcn_customer_id_type.setValue(
      //   this.customerDetailForm.value.fcn_cust_detail_idType
      // );

      // trigger form errors
      Object.values(this.customerDetailForm.controls).forEach(control => {
        control.markAsTouched();
      });

      if (!this.customerDetailForm.invalid) {

        const posCustomer = {
          CODE: this.customerDetails?.CODE || '0',
          NAME: this.customerDetailForm.value.fcn_customer_name || '',
          COMPANY: this.customerDetailForm.value.COMPANY || this.customerDetails?.COMPANY || '',
          ADDRESS:
            this.customerDetailForm.value.fcn_cust_detail_address ||
            // this.customerDetails?.ADDRESS ||
            '',
          POBOX_NO: this.customerDetails?.POBOX_NO || '',
          STATE: this.customerDetailForm.value.fcn_cust_detail_state
            // || this.customerDetails?.STATE
            || '',
          CITY:
            this.customerDetailForm.value.fcn_cust_detail_city ||
            // this.customerDetails?.CITY ||
            '',
          ZIPCODE: this.customerDetails?.ZIPCODE || '',
          COUNTRY_CODE:
            this.customerDetailForm.value.fcn_cust_detail_country ||
            // this.customerDetails?.COUNTRY_CODE ||
            '',
          EMAIL: this.customerDetailForm.value.fcn_cust_detail_email || '',
          TEL1: this.customerDetails?.TEL1 || '',
          TEL2:
            // this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            this.customerDetails?.TEL2 ||
            '',
          MOBILE: `${this.customerDetailForm.value.fcn_customer_mobile}` || '',
          FAX: this.customerDetails?.FAX || '',
          MARITAL_ST:
            this.customerDetailForm.value.fcn_cust_detail_marital_status ||
            // this.customerDetails?.MARITAL_ST ||
            'Unknown',
          WED_DATE: this.customerDetails?.WED_DATE || '',
          SPOUSE_NAME: this.customerDetails?.SPOUSE_NAME || '',
          REMARKS: this.customerDetails?.REMARKS || '',
          DATE_OF_BIRTH:
            this.customerDetailForm.value.fcn_cust_detail_dob ||
            // this.customerDetails?.DATE_OF_BIRTH ||
            this.dummyDate,

          OPENING_ON: this.customerDetails?.OPENING_ON || new Date(),
          GENDER:
            this.customerDetailForm.value.fcn_cust_detail_gender ||
            // this.customerDetails?.GENDER ||
            '',
          REGION: this.customerDetails?.REGION || '',
          NATIONALITY: this.customerDetailForm.value.fcn_cust_detail_nationality
            //  || this.customerDetails?.NATIONALITY
            || '',
          RELIGION: this.customerDetails?.RELIGION || '',
          TYPE: this.customerDetails?.TYPE || '',
          CATEGORY: this.customerDetails?.CATEGORY || '',
          INCOME: this.customerDetails?.INCOME || 0,
          CUST_STATUS: this.customerDetails?.CUST_STATUS || '',
          MID: this.customerDetails?.MID || 0,
          PICTURE_NAME: this.customerDetails?.PICTURE_NAME || '',
          PICTURE: this.customerDetails?.PICTURE || '',
          SALVOCTYPE_NO: this.customerDetails?.SALVOCTYPE_NO || '',
          SALDATE: this.customerDetails?.SALDATE || this.dummyDate,
          SALAMOUNT: this.customerDetails?.SALAMOUNT || 0,
          SALBRLOC: this.customerDetails?.SALBRLOC || '',
          Branch_Code: this.customerDetails?.Branch_Code || '',
          TOTALSALES: this.customerDetails?.TOTALSALES || 0,
          POSCUSTIDNO:
            this.customerDetailForm.value.fcn_customer_id_number ||
            // this.customerDetails?.POSCUSTIDNO ||
            '',
          POSSMAN: this.customerDetails?.POSSMAN || '',
          POSCustPrefix: this.customerDetails?.POSCustPrefix || '0',
          MOBILE1: this.customerDetailForm.value.fcn_cust_detail_phone2 ||
            //  this.customerDetails?.MOBILE1 ||
            '',
          CUST_Language: this.customerDetails?.CUST_Language || '',
          CUST_TYPE:
            // this.customerDataForm.value.fcn_customer_id_type ||
            // this.customerDetails?.CUST_TYPE ||
            '',
          //  ( this.customerDetails?.CUST_Type == ''
          //     ? this.customerDataForm.value.fcn_customer_id_type
          //     : this.customerDetails?.CUST_Type || ''),
          FAVORITE_CELEB: this.customerDetails?.FAVORITE_CELEB || '',
          STAFF_COURTESY: this.customerDetails?.STAFF_COURTESY || '',
          PRODUCT_KNOWLEDGE: this.customerDetails?.PRODUCT_KNOWLEDGE || ' ',
          LOCATION_AMBIENCE: this.customerDetails?.LOCATION_AMBIENCE || '',
          VARIETY_QUALITY: this.customerDetails?.VARIETY_QUALITY || '',
          OVERALL_EXP: this.customerDetails?.OVERALL_EXP || '',
          PRODUCT_SELECTION: this.customerDetails?.PRODUCT_SELECTION || '',
          SERVICE: this.customerDetails?.SERVICE || '',
          MAKING_CHARGES: this.customerDetails?.MAKING_CHARGES || '',
          BRAND_NAME: this.customerDetails?.BRAND_NAME || '',
          BUY_BACK: this.customerDetails?.BUY_BACK || '',
          LOCATION_PARKING: this.customerDetails?.LOCATION_PARKING || '',
          SOURCE: this.customerDetails?.SOURCE || '',
          PREFERENCE_CONTACT: this.customerDetails?.PREFERENCE_CONTACT || '',
          MOBILECODE1: this.customerDetails?.MOBILECODE1 || '',
          MOBILECODE2: this.customerDetails?.MOBILECODE2 || '',
          IDCATEGORY:
            this.customerDetailForm.value.fcn_customer_id_type
            // || this.customerDetails?.IDCATEGORY
            || '',
          ADDRESS_OFFICIAL: this.customerDetails?.ADDRESS_OFFICIAL || '',
          ADDRESS_DELIVARY: this.customerDetails?.ADDRESS_DELIVARY || '',
          INTERESTED_IN: this.customerDetails?.INTERESTED_IN || '',
          BLOOD_GROUP: this.customerDetails?.BLOOD_GROUP || '',
          NO_OF_CHILDREN: this.customerDetails?.NO_OF_CHILDREN || 0,
          ZODIAC_SIGN: this.customerDetails?.ZODIAC_SIGN || '',
          DESIGNATION: this.customerDetails?.DESIGNATION || '',
          LEVELFLAG: this.customerDetails?.LEVELFLAG || 0,
          INCOMERANGE: this.customerDetails?.INCOMERANGE || '',
          LAST_UPDATED_DATE:
            this.customerDetails?.LAST_UPDATED_DATE || this.dummyDate,
          TAXOFFICENO: this.customerDetails?.TAXOFFICENO || '',
          SALESMANNAME: this.customerDetails?.SALESMANNAME || '',
          DEFAULT_DISDIAMONDPERCENT:
            this.customerDetails?.DEFAULT_DISDIAMONDPERCENT,
          DEFAULT_DISMETALPERCENT:
            this.customerDetails?.DEFAULT_DISMETALPERCENT,
          LOYALTYALLOW: this.customerDetails?.LOYALTYALLOW || false,
          LOYALTYALLOWEMAIL: this.customerDetails?.LOYALTYALLOWEMAIL || false,
          LOYALTYALLOWSMS: this.customerDetails?.LOYALTYALLOWSMS || false,
          SENDPROMOTIONALEMAIL:
            this.customerDetails?.SENDPROMOTIONALEMAIL || false,
          LOYALTY_CODE: this.customerDetails?.LOYALTY_CODE || '',
          PREFERRED_COLOR: this.customerDetails?.PREFERRED_COLOR || '',
          PREFERRED_ITEM: this.customerDetails?.PREFERRED_ITEM || '',
          WRIST_SIZE: this.customerDetails?.WRIST_SIZE || '',
          FINGER_SIZE: this.customerDetails?.FINGER_SIZE || '',
          LOYALTY_POINT: this.customerDetails?.LOYALTY_POINT || 0,
          FIRSTNAME:
            this.customerDetailForm.value.fcn_customer_detail_fname ||
            // this.customerDetails?.FIRSTNAME ||
            '',
          MIDDLENAME:
            this.customerDetailForm.value.fcn_customer_detail_mname ||
            // this.customerDetails?.MIDDLENAME ||
            '',
          LASTNAME:
            this.customerDetailForm.value.fcn_customer_detail_lname ||
            // this.customerDetails?.LASTNAME ||
            '',
          POSKnownAbout: this.customerDetails?.POSKnownAbout || 0,
          CIVILID_IMGPATH: this.customerDetails?.CIVILID_IMGPATH || '',
          SUGGESTION: this.customerDetails?.SUGGESTION || '',
          AMLNAMEVALIDATION: this.customerDetails?.AMLNAMEVALIDATION || false,
          AML_TYPE: this.customerDetails?.AML_TYPE || false,
          UN_NUMBER: this.customerDetails?.UN_NUMBER || '',
          NAME_1: this.customerDetails?.NAME_1 || '',
          NAME_2: this.customerDetails?.NAME_2 || '',
          NAME_3: this.customerDetails?.NAME_3 || '',
          NAME_4: this.customerDetails?.NAME_4 || '',
          NAME_5: this.customerDetails?.NAME_5 || '',
          DOB_2: this.customerDetails?.DOB_2 || this.dummyDate,
          DOB_3: this.customerDetails?.DOB_3 || this.dummyDate,
          DOB_4: this.customerDetails?.DOB_4 || this.dummyDate,
          DOB_5: this.customerDetails?.DOB_5 || this.dummyDate,
          GOOD_QUALITY: this.customerDetails?.GOOD_QUALITY || '',
          LOW_QUALITY: this.customerDetails?.LOW_QUALITY || '',
          A_K_A: this.customerDetails?.A_K_A || '',
          F_K_A: this.customerDetails?.F_K_A || '',
          NATIONALITY_2: this.customerDetails?.NATIONALITY_2 || '',
          NATIONALITY_3: this.customerDetails?.NATIONALITY_3 || '',
          NATIONALITY_4: this.customerDetails?.NATIONALITY_4 || '',
          NATIONALITY_5: this.customerDetails?.NATIONALITY_5 || '',
          PASSPORT_NO_1: this.customerDetails?.PASSPORT_NO_1 || '',
          PASSPORT_NO_2: this.customerDetails?.PASSPORT_NO_2 || '',
          PASSPORT_NO_3: this.customerDetails?.PASSPORT_NO_3 || '',
          PASSPORT_NO_4: this.customerDetails?.PASSPORT_NO_4 || '',
          PASSPORT_NO_5: this.customerDetails?.PASSPORT_NO_5 || '',
          LISTED_ON_DATE:
            this.customerDetails?.LISTED_ON_DATE || this.dummyDate,
          NATIONAL_IDENTIFICATION_NO:
            this.customerDetailForm.value.fcn_cust_detail_idcard ||
            // this.customerDetails?.NATIONAL_IDENTIFICATION_NO ||
            '',
          OTHER_INFORMATION: this.customerDetails?.OTHER_INFORMATION || '',
          LINKS: this.customerDetails?.LINKS || '',
          FATHERNAME: this.customerDetails?.FATHERNAME || '',
          PROMO_NEEDED: this.customerDetails?.PROMO_NEEDED || '',
          PROMO_HOW_OFTEN: this.customerDetails?.PROMO_HOW_OFTEN || '',
          CHILDNAME1: this.customerDetails?.CHILDNAME1 || '',
          CHILDNAME2: this.customerDetails?.CHILDNAME2 || '',
          CHILDNAME3: this.customerDetails?.CHILDNAME3 || '',
          CHILDNAME4: this.customerDetails?.CHILDNAME4 || '',
          CHILDDATEOFBIRTH1:
            this.customerDetails?.CHILDDATEOFBIRTH1 || this.dummyDate,
          CHILDDATEOFBIRTH2:
            this.customerDetails?.CHILDDATEOFBIRTH2 || this.dummyDate,
          CHILDDATEOFBIRTH3:
            this.customerDetails?.CHILDDATEOFBIRTH3 || this.dummyDate,
          CHILDDATEOFBIRTH4:
            this.customerDetails?.CHILDDATEOFBIRTH4 || this.dummyDate,
          OTHERNAMES: this.customerDetails?.OTHERNAMES || '',
          AUTOCREATEMST: this.customerDetails?.AUTOCREATEMST || false,
          WUPMOBILECODE: this.customerDetails?.WUPMOBILECODE || '',
          WUPMOBILENO: this.customerDetails?.WUPMOBILENO || '',
          OCCUPATION: this.customerDetailForm.value.fcn_cust_detail_occupation
            //  || this.customerDetails?.OCCUPATION
            || '',
          ShowRoomAccessibility:
            this.customerDetails?.ShowRoomAccessibility || '',
          ProductRangeAvailability:
            this.customerDetails?.ProductRangeAvailability || '',
          DIGISCREENED: this.customerDetails?.DIGISCREENED || false,
          BR_CODE: this.customerDetails?.BR_CODE || '',
          SPOUSE_DATE_OF_BIRTH:
            this.customerDetails?.SPOUSE_DATE_OF_BIRTH || this.dummyDate,
          TEL_R_CODE: `${this.commonService.emptyToZero(
            this.customerDetails?.TEL_R_CODE
          )}`,
          TEL_O_CODE: `${this.commonService.emptyToZero(
            this.customerDetails?.TEL_O_CODE
          )}`,
          GST_NUMBER: `${this.commonService.emptyToZero(
            this.customerDetails?.GST_NUMBER
          )}`,
          VAT_NUMBER: `${this.commonService.emptyToZero(
            this.customerDetails?.VAT_NUMBER
          )}`,
          PARENT_CODE: `${this.commonService.emptyToZero(
            this.customerDetails?.PARENT_CODE
          )}`,
          REFERED_BY: `${this.commonService.emptyToZero(
            this.customerDetails?.REFERED_BY
          )}`,
          CREDIT_LIMIT: this.customerDetails?.CREDIT_LIMIT || 0,
          CREDIT_LIMIT_STATUS:
            this.customerDetails?.CREDIT_LIMIT_STATUS || false,
          PANCARDNO: this.customerDetails?.PANCARDNO || '111111' || '',
          VOCTYPE:  '', //todo
          YEARMONTH:  '',//todo
          VOCNO:  '',//todo
          VOCDATE: '',//todo
          // new values - poscustomer
          'OT_TRANSFER_TIME': this.customerDetails?.OT_TRANSFER_TIME || '',
          'COUNTRY_DESC': this.customerDetails?.COUNTRY_DESC || '',
          'STATE_DESC': this.customerDetails?.STATE_DESC || '',
          'CITY_DESC': this.customerDetails?.CITY_DESC || '',
          'FAVORITE_CELEB_DESC': this.customerDetails?.FAVORITE_CELEB_DESC || '',
          'RELIGION_DESC': this.customerDetails?.RELIGION_DESC || '',
          'CATEGORY_DESC': this.customerDetails?.CATEGORY_DESC || '',
          'CUST_STATUS_DESC': this.customerDetails?.CUST_STATUS_DESC || '',
          'NATIONALITY_DESC': this.customerDetails?.NATIONALITY_DESC || '',
          'TYPE_DESC': this.customerDetails?.TYPE_DESC || '',


          "BRANCH_CODE": this.commonService.branchCode || '',
          "DETAILS_JOHARA": this.customerDetails?.DETAILS_JOHARA || '',
          "DETAILS_FARAH": this.customerDetails?.DETAILS_FARAH || '',
          "DETAILS_JAWAHERALSHARQ": this.customerDetails?.DETAILS_JAWAHERALSHARQ || '',
          "FESTIVAL_EID": this.customerDetails?.FESTIVAL_EID || false,
          "FESTIVAL_CHRISTMAS": this.customerDetails?.FESTIVAL_CHRISTMAS || false,
          "FESTIVAL_DIWALI": this.customerDetails?.FESTIVAL_DIWALI || false,
          "FESTIVAL_NATIONALDAY": this.customerDetails?.FESTIVAL_NATIONALDAY || false,
          "FESTIVAL_ONAM": this.customerDetails?.FESTIVAL_ONAM || false,
          "FESTIVAL_PONGAL": this.customerDetails?.FESTIVAL_PONGAL || false,
          "FESTIVAL_NEWYEAR": this.customerDetails?.FESTIVAL_NEWYEAR || false,
          "REASON_OF_PURCHASE": this.customerDetails?.REASON_OF_PURCHASE || '',
          "AGE_GROUP": this.customerDetails?.AGE_GROUP || '',
          "GIFT_PURCHASED_FOR": this.customerDetails?.GIFT_PURCHASED_FOR || '',
          "PURCHASE_OCCASION": this.customerDetails?.PURCHASE_OCCASION || '',
          "NEXT_VISIT": this.customerDetails?.NEXT_VISIT || '',
          "SHOWROOMACCESSIBILITY": this.customerDetails?.SHOWROOMACCESSIBILITY || '',
          "PRODUCTRANGEAVAILABILITY": this.customerDetails?.PRODUCTRANGEAVAILABILITY || '',

          "LOOKING_FOR": this.customerDetails?.LOOKING_FOR || '',

        };

        const apiCtrl =
          posCustomer.CODE &&
            posCustomer.CODE != '' &&
            posCustomer.CODE.toString() != '0'
            ? 'updatePosCustomer'
            : 'insertPosCustomer';

        this.dataService.postDynamicAPI(apiCtrl,posCustomer).subscribe((data:any) => {
          this.isCustProcessing = false;

          if (data.status == 'Success') {
            this.customerDetails =  data.response;
            // this.customerDataForm.controls['fcn_customer_name'].setValue(
            //   this.customerDetails.NAME
            // );
            // this.customerDataForm.controls['fcn_customer_id_type'].setValue(
            //   this.customerDetails.IDCATEGORY
            //   // this.customerDetails.CUST_TYPE
            // );
            // this.customerDataForm.controls['fcn_customer_id_number'].setValue(
            //   this.customerDetails.POSCUSTIDNO
            // );
            // this.inv_customer_name = this.customerDetails.NAME;
            // this.inv_cust_mobile_no = this.customerDetails.MOBILE;
            this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
              this.customerDetails.MOBILE
            );
            this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
              this.customerDetails.EMAIL
            );
            this.customerDetailForm.controls[
              'fcn_cust_detail_address'
            ].setValue(this.customerDetails.ADDRESS);
            this.customerDetailForm.controls[
              'fcn_cust_detail_country'
            ].setValue(this.customerDetails.COUNTRY_CODE);
            this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
              this.customerDetails.CITY
            );
            this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
              this.customerDetails.NATIONAL_IDENTIFICATION_NO
            );
            // Customer data
            this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
              this.customerDetails.NAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
              this.customerDetails.FIRSTNAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
              this.customerDetails.MIDDLENAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
              this.customerDetails.LASTNAME
            );
            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              this.customerDetails.TEL2
            );
            this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
              this.customerDetails.GENDER
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              this.customerDetails.MARITAL_ST
            );
            // this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
            //   this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
            // );
            
            this.snackBar.open('Customer details saved successfully', '', {
              duration: 1000 // time in milliseconds
            });

          } else {
            // this.modalReference.close();
            // this.customerDetails = {};
            // this.snackBar.open(data.message, '', {
            //   duration: 2000 // time in milliseconds
            // });
            // this.modalReference.close();
          }
        });


      } else {
        this.isCustProcessing = false;

        this.snackBar.open('Please Fill Required Fields', '', {
          duration: 2000 // time in milliseconds
        });
      }
    }
  }
  
  /**USE: close modal window */
  close() {
    this.closebtnClick.emit()
  }
}
