import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IndexedDbService } from 'src/app/services/indexed-db.service';
import { map, startWith } from 'rxjs/operators';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-pos-customer-master',
  templateUrl: './pos-customer-master.component.html',
  styleUrls: ['./pos-customer-master.component.scss']
})
export class PosCustomerMasterComponent implements OnInit {

  @Output() closebtnClick = new EventEmitter();
  @Input() public customerData: any;
  @Input() amlNameValidation?: boolean;
  @Input() vocDetails?: any;
  @Input() public queryParams: any;


  //variables
  viewOnly: boolean = false;
  isCustProcessing: boolean = false;
  vocMaxDate = new Date();
  currentDate = new Date(new Date());
  fcn_returns_voc_type_val: any;

  idTypeFilteredOptions!: Observable<any[]>;
  idTypeOptions: any[] = [''];
  idTypeOptionList: any;

  maritalStatusList: any = [];
  countryMaster: any = [];
  countryMasterOptions!: Observable<any[]>;
  stateMaster: any = [];
  stateMasterOptions!: Observable<any[]>;

  mobileCountryMaster: any = [];
  mobileCountryMasterOptions!: Observable<any[]>;

  cityMaster: any = [];
  cityMasterOptions!: Observable<any[]>;
  nationalityMaster: any = [];
  nationalityMasterOptions!: Observable<any[]>;
  genderList: any = [];

  customerDetails: any = {}

  dummyDate = '1900-01-01T00:00:00';
  dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];

  amlNameValidationData = false;


  // Dialog box
  dialogBox: any;
  dialogBoxResult: any;

  //formgroups
  customerDetailForm: FormGroup = this.formBuilder.group({
    fcn_customer_detail_name: ['', Validators.required],
    fcn_customer_detail_fname: ['', Validators.required],
    fcn_customer_detail_mname: [''],
    fcn_customer_detail_lname: ['', Validators.required],
    fcn_cust_detail_gender: ['', Validators.required],
    fcn_cust_detail_marital_status: [''],
    fcn_cust_detail_dob: ['', [Validators.required]],
    fcn_cust_detail_idType: ['', [Validators.required, this.autoCompleteValidator(() => this.idTypeOptions)]],
    fcn_cust_detail_phone: ['', Validators.required],
    fcn_cust_detail_phone2: [''],
    fcn_cust_detail_email: ['', [Validators.email]],
    fcn_cust_detail_address: ['', Validators.required],
    fcn_cust_detail_country: ['', [Validators.required, this.autoCompleteValidator(() => this.countryMaster, 'CODE')]],
    fcn_cust_detail_city: ['', [this.autoCompleteValidator(() => this.cityMaster, 'CODE')]],
    fcn_cust_detail_nationality: ['', [Validators.required, this.autoCompleteValidator(() => this.nationalityMaster, 'CODE')]],
    fcn_cust_detail_idcard: ['', Validators.required],
    fcn_cust_detail_designation: ['', Validators.required],
    fcn_cust_detail_company: [''],
    fcn_cust_detail_state: ['', [this.autoCompleteValidator(() => this.stateMaster, 'CODE')]],

    fcn_mob_code: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: SuntechAPIService,
    private comService: CommonServiceService,
    private snackBar: MatSnackBar,
    private acRoute: ActivatedRoute,
    private indexedDb: IndexedDbService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private activeModal: NgbActiveModal,


  ) {


    this.indexedDb.getAllData('messageBox').subscribe((data) => {

      if (data.length > 0) {
        this.comService.allMessageBoxData = data;
      }
    });
    this.indexedDb.getAllData('comboFilter').subscribe((data) => {
      if (data.length > 0) {
        this.comService.comboFilter = data;
      }
    });

    this.indexedDb.getAllData('countryMaster').subscribe((data) => {
      if (data.length > 0) {
        this.comService.countryMaster = data;
      }
    });
    this.indexedDb.getAllData('nationalityMaster').subscribe((data) => {
      if (data.length > 0) {
        this.comService.nationalityMaster = data;
      }
    });
    this.indexedDb.getAllData('idMaster').subscribe((data) => {
      if (data.length > 0) {
        this.comService.idMaster = data;
      }
    });
    // this.getReceiptModes();

    this.customerDetailForm.get('fcn_cust_detail_idType')?.valueChanges.subscribe((val) => {
      const res = this.idTypeOptionList.find((data: any) => data.CODE === val);
      const validations = [Validators.required];
      if (res) {
        if (res?.MINDIGITS != 0)
          validations.push(Validators.minLength(res.MINDIGITS));
        if (res?.MAXDIGITS != 0)
          validations.push(Validators.maxLength(res.MAXDIGITS));
      }
      this.addValidationsForForms(this.customerDetailForm, 'fcn_cust_detail_idcard', validations);
    });



  }

  ngOnInit(): void {
    this.getDropDownData();
    this.getMasters();
    this.getIdMaster();
    if (this.customerData != null && this.customerData.MOBILE != '')
      this.changeMobileNumber(this.customerData.MOBILE)

    if (this.queryParams != null && this.queryParams.isViewOnly != '')
      this.viewOnly = this.queryParams.isViewOnly;
  }



  changeMobileNumber(value: any = null) {
    this.snackBar.open('Loading...');
    console.log(value);
    let _cust_mobile_no = value == null ? this.customerDetailForm.value.fcn_cust_detail_phone : value;
    // if (value != null) {
    //   this.customerDataForm.controls['fcn_customer_mobile'].setValue(
    //     value
    //   );
    // }


    if (_cust_mobile_no != '' && _cust_mobile_no != null) {

      let custMobile = `${this.customerDetailForm.value.fcn_cust_detail_phone}`;

      // if (value == null) {
      this.customerDetails = {};
      this.customerDetailForm.reset();

      this.customerDetailForm.reset({
        fcn_cust_detail_phone: custMobile,
      });
      // }
      this.apiService.getDynamicAPI(`PosCustomerMaster/GetCustomerMaster/${_cust_mobile_no}`)
        .subscribe((resp) => {
          this.snackBar.dismiss();
          if (resp.status == 'Success') {
            // const result = resp[0];
            const result = resp.response;


            this.customerDetailForm.controls.fcn_mob_code.setValue(
              result.MOBILECODE1
            );
            this.customerDetailForm.controls['fcn_cust_detail_phone'].setValue(
              result.MOBILE
            );
            this.customerDetailForm.controls['fcn_cust_detail_idType'].setValue(
              result.IDCATEGORY
              // result.CUST_TYPE
            );
            this.customerDetailForm.controls['fcn_cust_detail_email'].setValue(
              result.EMAIL
            );
            this.customerDetailForm.controls['fcn_cust_detail_address'].setValue(
              result.ADDRESS
            );
            this.customerDetailForm.controls['fcn_cust_detail_country'].setValue(
              result.COUNTRY_CODE
            );
            this.customerDetailForm.controls['fcn_cust_detail_state'].setValue(
              result.STATE
            );
            this.customerDetailForm.controls['fcn_cust_detail_city'].setValue(
              result.CITY
            );
            this.customerDetailForm.controls['fcn_cust_detail_idcard'].setValue(
              result.NATIONAL_IDENTIFICATION_NO
            );
            this.customerDetailForm.controls.fcn_customer_detail_name.setValue(
              result.NAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
              result.FIRSTNAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
              result.MIDDLENAME
            );
            this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
              result.LASTNAME
            );
            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              result.TEL2
            );
            this.customerDetailForm.controls.fcn_cust_detail_gender.setValue(
              result.GENDER
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              result.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_marital_status.setValue(
              result.MARITAL_ST
            );
            this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
              this.dummyDateCheck(result.DATE_OF_BIRTH)
            );
            this.customerDetailForm.controls.fcn_cust_detail_designation.setValue(
              result.DESIGNATION
            );
            this.customerDetailForm.controls.fcn_cust_detail_company.setValue(
              result.COMPANY
            );
            this.customerDetailForm.controls.fcn_cust_detail_nationality.setValue(
              result.NATIONALITY
            );

            this.customerDetailForm.controls.fcn_cust_detail_phone2.setValue(
              result.MOBILE1
            );

            this.customerDetails = result;

            if (this.amlNameValidation)
              if (!result.AMLNAMEVALIDATION && result.DIGISCREENED) {
                this.amlNameValidationData = false;
              } else {
                this.amlNameValidationData = true;
                // this.openDialog('Warning', 'Pending for approval', true);
              }
          } else {
            if (value == null) {
              // this.openDialog('Warning', 'Need To Create Customer', true);
              // this.dialogBox.afterClosed().subscribe((data: any) => {
              //   if (data == 'OK') {
              //     this.open(this.more_customer_detail_modal, false, null, true);
              //   }
              // });
            } else {
              // this.renderer.selectRootElement('#fcn_customer_detail_name')?.focus();
            }

            this.amlNameValidationData = true;

          }
        });
    } else {
      this.amlNameValidationData = true;
      this.customerDetailForm.reset();
      this.customerDetails = {};
    }

  }


  nameChange(event: any) {
    const value = event.target.value.toString().trim();
    // event.target.value = value;
    if (value != '') {
      this.amlNameValidationData = false;

      const res = value.split(/\s+/);
      event.target.value = res.join(' ');

      this.customerDetailForm.controls.fcn_customer_detail_fname.setValue(
        res[0]
      );
      if (res.length == 1) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          ''
        );
      }
      if (res.length == 2) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          res[1]
        );
      }
      if (res.length > 2) {
        this.customerDetailForm.controls.fcn_customer_detail_mname.setValue(
          res[1]
        );
        res.splice(0, 2);
        this.customerDetailForm.controls.fcn_customer_detail_lname.setValue(
          res.join(' ')
        );
      }

      this.renderer.selectRootElement('#fcn_cust_detail_phone').focus();
    } else {
      this.customerDetailForm.controls.fcn_customer_detail_fname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_mname.setValue('');
      this.customerDetailForm.controls.fcn_customer_detail_lname.setValue('');
      this.amlNameValidationData = true;
    }
  }
  changeCountry(value: any) {
    this.getStateMasterByID(value);
  }
  changeState(value: any) {
    this.getCityMasterByID(this.customerDetailForm.value.fcn_cust_detail_country, value);
  }

  getDropDownData() {

    this.maritalStatusList = this.comService.getComboFilterByID('Marital Status').filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );
    this.genderList = this.comService.getComboFilterByID('gender').filter((value: any, index: any, self: any) =>
      index === self.findIndex((t: any) => t.ENGLISH === value.ENGLISH)
    );

    // this.maritalStatusList = this.comService.getComboFilterByID('Marital Status');
    // this.genderList = this.comService.getComboFilterByID('gender');
    // console.log(this.genderList);

  }


  async getMasters() {

    const country = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('COUNTRY MASTER')}`;

    this.countryMaster = this.comService.countryMaster;
    this.countryMasterOptions =
      this.customerDetailForm.controls.fcn_cust_detail_country.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.countryMaster, value, 'CODE', 'DESCRIPTION')
        )
      );

    this.mobileCountryMaster = this.countryMaster.filter((data: any) => data.MOBILECOUNTRYCODE != '');
    this.mobileCountryMasterOptions =
      this.customerDetailForm.controls.fcn_mob_code.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.mobileCountryMaster, value, 'MOBILECOUNTRYCODE', 'DESCRIPTION')
        )
      );

    const city = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CITY MASTER')}`;

    const nationality = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('NATIONALITY MASTER')}`;
    this.nationalityMaster = this.comService.nationalityMaster;
    this.nationalityMasterOptions =
      this.customerDetailForm.controls.fcn_cust_detail_nationality.valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterMasters(this.nationalityMaster, value, 'CODE', 'DESCRIPTION')
        )
      );
  }



  // getRetailSalesMaster() {
  //   let queryParams: any
  //   this.acRoute.queryParams.subscribe((params) => {
  //     if (params.vocNo) {
  //       console.log(params, 'params.............................');
  //       queryParams = params;
  //     }
  //   });
  //   // let API = `RetailSalesDataInDotnet/GetRetailSalesData/BranchCode=${queryParams.branchCode}/VocType=${queryParams.vocType}/YearMonth=${queryParams.yearMonth}/VocNo=${queryParams.vocNo}`
  //   // this.dataService.getDynamicAPI(API).subscribe((result:any) => {

  //   // })
  // }
  //use: save customer
  customerSave() {
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


      this.customerDetails.NAME =
        this.customerDetailForm.value.fcn_customer_detail_name;

      this.customerDetails.FIRSTNAME =
        this.customerDetailForm.value.fcn_customer_detail_fname;
      this.customerDetails.MIDDLENAME =
        this.customerDetailForm.value.fcn_customer_detail_mname;
      this.customerDetails.LASTNAME =
        this.customerDetailForm.value.fcn_customer_detail_lname;
      this.customerDetails.MOBILE =
        this.customerDetailForm.value.fcn_cust_detail_phone;

      this.customerDetails.IDCATEGORY =
        // this.customerDetails.CUST_TYPE =
        this.customerDetailForm.value.fcn_cust_detail_idType;


      // this.modalService.
      // if (this.amlNameValidation) {

      // trigger form errors
      Object.values(this.customerDetailForm.controls).forEach(control => {
        control.markAsTouched();
      });

      if (!this.customerDetailForm.invalid) {

        const posCustomer = {
          CODE: this.customerDetails?.CODE || '0',
          NAME: this.customerDetailForm.value.fcn_customer_detail_name || '',
          COMPANY: this.customerDetailForm.value.fcn_cust_detail_company
            // || this.customerDetails?.COMPANY
            || '',
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
          MOBILE: `${this.customerDetailForm.value.fcn_cust_detail_phone}` || '',
          FAX: this.customerDetails?.FAX || '',
          MARITAL_ST:
            this.customerDetailForm.value.fcn_cust_detail_marital_status ||
            // this.customerDetails?.MARITAL_ST ||
            '',
          WED_DATE: this.customerDetails?.WED_DATE || this.dummyDate,
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
            this.customerDetailForm.value.fcn_cust_detail_idcard ||
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
          // MOBILECODE1: this.customerDetails?.MOBILECODE1 || '',
          MOBILECODE1: this.customerDetailForm.value.fcn_mob_code.toString() || '',

          MOBILECODE2: this.customerDetails?.MOBILECODE2 || '',
          IDCATEGORY:
            this.customerDetailForm.value.fcn_cust_detail_idType
            // || this.customerDetails?.IDCATEGORY
            || '',
          ADDRESS_OFFICIAL: this.customerDetails?.ADDRESS_OFFICIAL || '',
          ADDRESS_DELIVARY: this.customerDetails?.ADDRESS_DELIVARY || '',
          INTERESTED_IN: this.customerDetails?.INTERESTED_IN || '',
          BLOOD_GROUP: this.customerDetails?.BLOOD_GROUP || '',
          NO_OF_CHILDREN: this.customerDetails?.NO_OF_CHILDREN || 0,
          ZODIAC_SIGN: this.customerDetails?.ZODIAC_SIGN || '',
          DESIGNATION:
            this.customerDetailForm.value.fcn_cust_detail_designation
            // this.customerDetails?.DESIGNATION
            || '',
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
          OCCUPATION:
            this.customerDetails?.OCCUPATION
            || '',
          ShowRoomAccessibility:
            this.customerDetails?.ShowRoomAccessibility || '',
          ProductRangeAvailability:
            this.customerDetails?.ProductRangeAvailability || '',
          DIGISCREENED: this.customerDetails?.DIGISCREENED || false,
          BR_CODE: this.customerDetails?.BR_CODE || '',
          SPOUSE_DATE_OF_BIRTH:
            this.customerDetails?.SPOUSE_DATE_OF_BIRTH || this.dummyDate,
          TEL_R_CODE: `${this.comService.emptyToZero(
            this.customerDetails?.TEL_R_CODE
          )}`,
          TEL_O_CODE: `${this.comService.emptyToZero(
            this.customerDetails?.TEL_O_CODE
          )}`,
          GST_NUMBER: `${this.comService.emptyToZero(
            this.customerDetails?.GST_NUMBER
          )}`,
          VAT_NUMBER: `${this.comService.emptyToZero(
            this.customerDetails?.VAT_NUMBER
          )}`,
          PARENT_CODE: `${this.comService.emptyToZero(
            this.customerDetails?.PARENT_CODE
          )}`,
          REFERED_BY: `${this.comService.emptyToZero(
            this.customerDetails?.REFERED_BY
          )}`,
          CREDIT_LIMIT: this.customerDetails?.CREDIT_LIMIT || 0,
          CREDIT_LIMIT_STATUS:
            this.customerDetails?.CREDIT_LIMIT_STATUS || false,
          PANCARDNO: this.customerDetails?.PANCARDNO || '111111' || '',
          VOCTYPE: this.vocDetails.VOCTYPE || '',
          YEARMONTH: this.vocDetails.YEARMONTH || localStorage.getItem('YEAR'),
          VOCNO: this.vocDetails.VOCNO || '',
          VOCDATE: this.vocDetails.VOCDATE,
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


          // "BRANCH_CODE": this.strBranchcode || '',
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

          "POSCUSTIDEXP_DATE": this.customerDetails?.POSCUSTIDEXP_DATE || this.dummyDate,

          // new fields added 12-02-2024
          "ATTACHMENT_FROM_SCANNER": this.customerDetails?.ATTACHMENT_FROM_SCANNER || false,
          "GOOD_QUALITY_A_K_A": "",
          "LOW_QUALITY_A_K_A": "",
          "POSKNOWNABOUT": 0

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
          posCustomer.CODE &&
          posCustomer.CODE !== '' &&
          posCustomer.CODE.toString() !== '0'
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
            this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
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
                          this.closeModal();
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
                          this.closeModal();
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
                        this.closeModal();
                      }
                    });
                    this.amlNameValidationData = true;

                  }
                });
              } else {
                this.isCustProcessing = false;
                this.closeModal();

              }
            } else {
              this.isCustProcessing = false;

              // this.modalReference.close();
              this.closeModal();
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
        this.closeModal();

      } else {
        this.isCustProcessing = false;

        this.snackBar.open('Please Fill Required Fields', '', {
          duration: 2000 // time in milliseconds
        });
      }
    }
  }


  getStateMasterByID(countryCode: any) {
    let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('STATE MASTER')}/${encodeURIComponent(countryCode)}`

    this.apiService.getDynamicAPI(API).
      subscribe(async data => {
        if (data.status == "Success") {
          this.stateMaster = data.response;
          this.stateMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_state.valueChanges.pipe(
              startWith(''),
              map((value) =>
                this._filterMasters(this.stateMaster, value, 'CODE', 'DESCRIPTION')
              )
            );
        } else {
          this.stateMaster = [];
        }
      });
  }

  getCityMasterByID(countryCode: any, stateCode: any) {
    let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('CITY MASTER')}/${encodeURIComponent(countryCode)}/${encodeURIComponent(stateCode)}`
    this.apiService.getDynamicAPI(API).
      subscribe(async data => {
        if (data.status == "Success") {
          this.cityMaster = data.response;
          this.cityMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_city.valueChanges.pipe(
              startWith(''),
              map((value) =>
                this._filterMasters(this.cityMaster, value, 'CODE', 'DESCRIPTION')
              )
            );
        } else {
          this.cityMaster = [];
        }
      });

  }


  async getIdMaster() {
    const resp = await this.comService.idMaster;
    console.log(this.comService.idMaster);
    var data = resp.map((t: any) => t.CODE);
    this.idTypeOptions = data;
    this.idTypeOptionList = resp;

    this.idTypeFilteredOptions =
      this.customerDetailForm.controls.fcn_cust_detail_idType.valueChanges.pipe(
        startWith(''),
        map((value) => this._filterIdType(value))
      );

  }
  private _filterIdType(value: string): string[] {
    value = value != null ? value.toString().toLowerCase() : '';
    const filterValue = value;
    return this.idTypeOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  autoCompleteValidator(optionsProvider: any, field: any = null) {
    return (control: AbstractControl) => {
      const options = optionsProvider();
      const inputValue = control.value;
      if (!options || !Array.isArray(options)) {
        return null;
      }
      if (field == null) {
        if (control.value && options.length > 0 && !options.includes(control.value)) {
          return { notInOptions: true };
        }
      } else {
        if (inputValue && options.length > 0 && !options.some(option => option[field] === inputValue)) {
          return { notInOptions: true };
        }
      }
      return null;
    };
  }

  private _filterMasters(
    arrName: any[],
    value: string,
    optVal1: any,
    optVal2: any = null
  ): any[] {
    const filterValue = (value || '').toLowerCase();
    const uniqueCodes = new Set(); 
  
    return arrName.filter((option: any) => {
      const matches =
        option[optVal1].toLowerCase().includes(filterValue) ||
        (optVal2 && option[optVal2].toLowerCase().includes(filterValue));
  
      if (matches && !uniqueCodes.has(option[optVal1])) {
        uniqueCodes.add(option[optVal1]); 
        return true; 
      }
      return false;
    });
  }

  // private _filterMasters(
  //   arrName: any,
  //   value: string,
  //   optVal1: any,
  //   optVal2: any = null
  // ): any[] {
  //   const filterValue = (value || '').toLowerCase();
  //   return arrName.filter(
  //     (option: any) =>
  //       option[optVal1].toLowerCase().includes(filterValue) ||
  //       option[optVal2].toLowerCase().includes(filterValue)
  //   );
  // }


  addValidationsForForms(form: FormGroup, ctrlName: any, validations: any) {
    const control = form.get(ctrlName);
    if (control) {
      control.setValidators(validations);
      control.updateValueAndValidity();
    }
  }

  dummyDateCheck(date: any) {
    if (this.dummyDateArr.includes(date))
      return '';
    else
      return date;
  }

  openDialog(title: any, msg: any, okBtn: any, swapColor: any = false) {
    this.dialogBox = this.dialog.open(DialogboxComponent, {
      width: '40%',
      disableClose: true,
      data: { title, msg, okBtn, swapColor },
    });
  }

  /**USE: close modal window */
  close() {
    this.closebtnClick.emit()
  }
  closeModal() {
    this.customerDetails;
    const returnData = {
      customerDetails: this.customerDetails,
    }
    this.activeModal.close(returnData);
  }

}
