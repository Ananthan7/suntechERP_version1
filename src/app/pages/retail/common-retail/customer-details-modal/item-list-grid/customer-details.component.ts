import { MatSnackBar } from '@angular/material/snack-bar';
import {
    Component,
    OnInit,
    Renderer2,
    Input,
    EventEmitter,
    Output,
    HostListener,
} from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';



import * as _moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { DatePipe } from '@angular/common';
import { DialogboxComponent } from 'src/app/shared/common/dialogbox/dialogbox.component';
import { ItemDetailService } from 'src/app/services/modal-service.service';




@Component({
    selector: 'app-customer-details',
    templateUrl: './customer-details.component.html',
    styleUrls: ['./customer-details.component.scss']
})
export class customerDetailsModal implements OnInit {
    @Input() modalTitle: string = 'Default Title';

    @Input() customerDataForm!: FormGroup;
    @Input() vocDataForm!: FormGroup;
    @Input() customerDetails: any = {};

    @Input() modal!: NgbModalRef;
    @Output() newItemEvent = new EventEmitter<any>();
   

    salesReturnsItems_forVoc: any = [];
    exchange_items: any[] = [];
    sales_returns_items: any = [];
    customerDetailForm!: FormGroup;
    branch_tax_percentage: any;
    baseYear: any = '';
    li_stone_wt_val: any;
    li_net_wt_val: any;
    li_making_rate_val: any;
    li_making_amount_val: any;
    li_stone_rate_val: any;
    li_stone_amount_val: any;
    li_metal_rate_val: any;
    li_metal_amount_val: any;
    li_rate_val: any;
    updateBtn!: boolean;
    ordered_items: any[] = [];
    @Input() orderedItems!: any[];

    amlNameValidation: any;
    strBranchcode: any = '';
    strUser: any = '';
    
    inv_bill_date: any;
    inv_number: any;
    inv_cust_id_no: any;
    vocType = 'EST';
    invMetalPurchaseTotalPcs: any;
    invMetalPurchaseTotalNettWeight: any;
    invMetalPurchaseTotalGrossWeight: any;
    invMetalPurchaseTotalPureWeight: any;
    invMetalPurchaseTotalPurityDiff: any;
    invMetalPurchaseTotalMakingAmt: any;
    invMetalPurchaseTotalNetAmt: any;
    invMetalPurchaseTotalMetalAmt: any;
    invMetalPurchaseTotalStoneAmt: any;
    invMetalPurchaseTotalOzWt: any;



    inv_customer_name: any;
    inv_cust_mobile_no: any;
    inv_sales_man: any;


    prnt_inv_total_items: any;
    prnt_inv_total_pcs: any;
    prnt_inv_total_weight: any;
    prnt_inv_total_pure_weight: any;
    prnt_inv_total_making_amt: any;
    prnt_inv_total_metal_amt: any;
    prnt_inv_total_stone_amt: any;
    prnt_inv_total_dis_amt: any;
    prnt_inv_total_gross_amt: any;
    prnt_inv_net_total_without_tax: any;
    prnt_inv_total_tax_amount: any;
    prnt_inv_net_total_with_tax: any;

    public pos_main_data: any = {};

    public retailsReturnMain: any = {};

    public metalPurchaseMain: any = {};


    all_branch: any;
    orderedItemEditId: any;


    currentLineItems: any = [];
    salesReturnEditId: any;
    salesReturnEditCode: any = '';
    salesReturnEditAmt: any = '';
    exchangeItemEditId: any;
    retailSaleDataVocNo: any = '0';
    retailSReturnVocNo: any = '0';
    metalPurchaseDataVocNo: any = '0';
    receiptEditId: any;

    retailSalesMID: any = '0';
    retailSReturnDataMID: any = '0';
    metalPurchaseDataMID: any = '0';
    standardPurity: any = 0;
    maritalStatusList: any = [];
    genderList: any = [];
    currentDate = new Date(new Date());
    nationalityMaster: any = [];
    nationalityMasterOptions!: Observable<any[]>;
    lineItemModalForSalesReturn: boolean = false;
    viewOnly: boolean = false;
    zeroAmtVal!: any;
    zeroMQtyVal!: any;
    blockNegativeStock: any;
    blockNegativeStockValue: any;
    blockMinimumPrice: any;
    blockMinimumPriceValue: any;


    invReturnSalesTotalPcs: any = 0;
    invReturnSalesTotalWeight: any = 0;
    invReturnSalesTotalPureWeight: any = 0;
    invReturnSalesTotalMakingAmt: any = 0;
    invReturnSalesTotalMetalAmt: any = 0;
    invReturnSalesTotalStoneAmt: any = 0;
    invReturnSalesTotalNetAmt: any = 0;
    invReturnSalesTotalDisAmt: any = 0;
    invReturnSalesTotalPurityDiff: any = 0;
    invReturnSalesTotalStoneDiff: any = 0;
    invReturnSalesTotalDisPer: any = 0;
    invReturnSalesTotalTaxAmt: any = 0;
    invReturnSalesTotalNetTotal: any = 0;

    defaultGrossTotal: any;
    dialogBox: any;
    karatRateDetails: any = [];
    dialogBoxResult: any;
    defaultTaxTotal: any;
    defaultNetTotal: any;
    defaultMakingCharge: any;
    validatePCS: any;
    lineItemPcs: any;
    makingRate: any;
    totalGrossAmount: any;
    totalTaxAmount: any;
    totalMakingAmount: any;
    totalNetAmount: any;
    lineItemGrossWt: any;
    public newDictionary: any;
    public taxType = 1;

    mobileCountryMasterOptions!: Observable<any[]>;



    order_total_exchange: any;



    estMode: string = 'ADD';

    // baseImgUrl = baseImgUrl;
    maskVocDate: any = new Date();
    amlNameValidationData = false;

    value: any;
    // barcode: string;
    isSaved: boolean = false;

    selectedTabIndex = 0;


    editOnly: boolean = false;
    public isCustProcessing = false;

    salesReturnRowData: any;
    salesReturnRowDataSRNO: any;

    queryParams: any;

    public mask = {
        guide: true,
        showMask: true,
        // keepCharPositions : true,
        mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    };
    noWhiteSpacePattern = /^\S*$/;
    dateValue: any;

    ozWeight: any = 0;

    vocMaxDate = new Date();

    dummyDate = '1900-01-01T00:00:00';
    dummyDateArr = ['1900-01-01T00:00:00', '1900-01-01T00:00:00Z', '1754-01-01T00:00:00Z', '1754-01-01T00:00:00'];




    salespersonName: string = '';
    branchOptions: string[] = [''];


    receiptModesTypes: any;
    receiptModesList: any;
    metalPurchaseDataPost: any = null;
    retailSalesDataPost: any = null;
    retailSReturnDataPost: any = null;



    // public noImage = environment._noImage;
    selectedOption = '3';
    title = 'appBootstrap';


    rs_WithReturnExchangeReceipt = {
        _retailSales: {},
        _retailReceipt: [],
        _retailsReturn: {},
        _metalPurchase: {},
    };

    vocTypesinExchange: any[] = [
        // { value: 'POS', viewValue: 'POS' },
        { value: 'POS', viewValue: 'POS' },
        { value: 'PS1', viewValue: 'PS1' },
    ];

    custDesignation: any = [
        { value: '1', label: 'Mr' },
        { value: '2', label: 'Mrs' },
        { value: '3', label: 'Ms' },
    ];

    mobileCountryMaster: any = [];

    countryMaster: any = [];
    countryMasterOptions!: Observable<any[]>;
    stateMaster: any = [];
    stateMasterOptions!: Observable<any[]>;
    idTypeOptions: string[] = [''];

    idTypeFilteredOptions!: Observable<string[]>;
    cityMaster: any = [];
    cityMasterOptions!: Observable<any[]>;
    custTypeMaster: any = [];
    custTypeMasterOptions!: Observable<any[]>;
    sourceOfFundList: any[] = [];
    sourceOfFundListOptions!: Observable<any[]>;

    modalReference: any;
    modalReferenceSalesReturn: any;
    closeResult!: string;
    orders: any[] = [];
    receiptDetailsList: any = [];

    receiptTotalNetAmt: any;



    constructor(private formBuilder: FormBuilder, private snackBar: MatSnackBar, public comFunc: CommonServiceService,public lineItemService: ItemDetailService,
        private suntechApi: SuntechAPIService, public dialog: MatDialog, private renderer: Renderer2, private datePipe: DatePipe
    ) {
        this.strBranchcode = localStorage.getItem('userbranch');
        this.strUser = localStorage.getItem('username');
        this.baseYear = localStorage.getItem('year');
        this.amlNameValidation = this.comFunc.allbranchMaster.AMLNAMEVALIDATION;

        this.customerDetailForm = this.formBuilder.group({
            fcn_customer_detail_name: ['', Validators.required],
            fcn_customer_detail_fname: ['', Validators.required],
            fcn_customer_detail_mname: [''],
            fcn_customer_detail_lname: [''],
            fcn_cust_detail_gender: ['', Validators.required],
            fcn_cust_detail_marital_status: [''],
            fcn_cust_detail_dob: [''],
            fcn_cust_detail_idType: ['', Validators.required],
            fcn_cust_detail_phone: ['', Validators.required],
            fcn_cust_detail_phone2: [''],
            fcn_cust_detail_email: ['', [Validators.email]],
            // fcn_cust_detail_address: ['', Validators.required],
            fcn_cust_detail_address: [''],
            fcn_cust_detail_country: ['', Validators.required],
            fcn_cust_detail_city: [''],
            fcn_cust_detail_nationality: ['', Validators.required],
            fcn_cust_detail_idcard: ['', Validators.required],
            fcn_cust_detail_occupation: [''],
            fcn_cust_detail_company: [''],
            fcn_cust_detail_state: [''],
            fcn_cust_type: [''],
            fcn_cust_desg: ['', Validators.required],
            fcn_mob_code: ['', Validators.required],

            fcn_source_of_fund: [''],

        });


    }

   

    ngOnInit(): void {
        this.mobileCountryMasterOptions =
            this.customerDetailForm.controls.fcn_mob_code.valueChanges.pipe(
                startWith(''),
                map((value) =>
                    this._filterMasters(this.mobileCountryMaster, value, 'MOBILECOUNTRYCODE', 'DESCRIPTION')
                )
            );
        // CHANGE BY ANANTHA 21-04-2024 starts
        // this.customerDataForm.valueChanges.subscribe(values => {
        //     // Do something with the new form values
        // });
        if(this.customerDetails){
            console.log(this.customerDetails,'this.customerDetails');
            this.onCustomerNameFocus(this.customerDetails.MOBILE)
        }
        // CHANGE BY ANANTHA 21-04-2024 ends
        this.getMasters();
        this.getIdMaster();
        this.getMaritalStatus();
    }

    private _filterMasters(
        arrName: any,
        value: string,
        optVal1: any,
        optVal2: any = null
    ): any[] {
        const filterValue = (value || '').toLowerCase();
        return arrName.filter(
            (option: any) =>
                option[optVal1].toLowerCase().includes(filterValue) ||
                option[optVal2].toLowerCase().includes(filterValue)
        );
    }



    onCustomerNameFocus(value: any = null) {
        console.log(value);
        let _cust_mobile_no = value == null ? this.customerDataForm.value.fcn_customer_mobile : value;
        if (value != null) {
            this.customerDataForm.controls['fcn_customer_mobile'].setValue(
                value
            );
        }

        console.log('_cust_mobile_no ', _cust_mobile_no);
        if (_cust_mobile_no != '' && _cust_mobile_no != null) {

            let custMobile = `${this.customerDataForm.value.fcn_customer_mobile}`;
            let mobCode = this.customerDetailForm.value.fcn_mob_code;

            // if (value == null) {
            this.customerDetails = {};
            this.customerDetailForm.reset();
            this.customerDataForm.reset({
                fcn_customer_mobile: custMobile,
            });
            this.customerDetailForm.reset({
                fcn_cust_detail_phone: custMobile,
                fcn_mob_code: mobCode,
            });
            // }
            this.suntechApi.getDynamicAPI('PosCustomerMaster/GetCustomerMaster/Mobile=' + _cust_mobile_no)
                .subscribe((resp) => {
                    console.log(resp);
                    // console.log(resp.Message);
                    this.amlNameValidationData = false;

                    if (resp.status == 'Success') {
                        // const result = resp[0];
                        const result = resp.response;
                        this.customerDataForm.controls['fcn_customer_name'].setValue(
                            result.NAME
                        );
                        this.customerDataForm.controls['fcn_customer_id_type'].setValue(
                            result.IDCATEGORY
                            // result.CUST_TYPE
                        );
                        this.customerDataForm.controls['fcn_customer_id_number'].setValue(
                            result.POSCUSTIDNO
                        );
                        this.inv_customer_name = result.NAME;
                        this.inv_cust_mobile_no = _cust_mobile_no;

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
                            result.MOBILE1
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
                        this.customerDetailForm.controls.fcn_cust_detail_state.setValue(
                            result.STATE
                        );

                      
                        this.customerDetailForm.controls.fcn_cust_detail_occupation.setValue(
                            result.OCCUPATION
                        );
                        this.customerDetailForm.controls.fcn_cust_detail_company.setValue(
                            result.COMPANY
                        );
                        this.customerDetailForm.controls.fcn_cust_detail_nationality.setValue(
                            result.NATIONALITY
                        );

                        this.customerDetailForm.controls.fcn_cust_type.setValue(
                            result.CUST_TYPE
                        );
                        this.customerDetailForm.controls.fcn_cust_desg.setValue(
                            result.POSCUSTPREFIX
                        );
                        this.customerDetailForm.controls.fcn_mob_code.setValue(
                            result.MOBILECODE1
                        );
                        this.customerDataForm.controls.fcn_customer_code.setValue(
                            result.CODE
                        );

                        this.customerDetailForm.controls.fcn_source_of_fund.setValue(
                            result.SOURCE
                        );
                        this.customerDetailForm.controls.fcn_cust_detail_dob.setValue(
                            this.dummyDateCheck(result.DATE_OF_BIRTH)
                        );
                        this.customerDetails = result;

                        if (this.amlNameValidation){
                            if (!result.AMLNAMEVALIDATION && result.DIGISCREENED) {
                                this.amlNameValidationData = false;
                            } else {
                                this.amlNameValidationData = false; //for testing
                                // this.amlNameValidationData = true;
                                // this.openDialog('Warning', 'Pending for approval', true);
                            }
                        }
                    } else {
                        if (value == null) {
                            this.openDialog('Warning', 'Need To Create Customer', true);
                            this.dialogBox.afterClosed().subscribe((data: any) => {
                                if (data == 'OK') {
                                    //this.open(this.more_customer_detail_modal, false, null, true);
                                }
                            });
                        } else {
                            this.renderer.selectRootElement('#fcn_customer_detail_name')?.focus();
                        }

                        this.amlNameValidationData = true;


                    }
                });
        } else {
            this.amlNameValidationData = true;
            this.customerDetailForm.reset();
            this.customerDataForm.reset();
            this.customerDetails = {};
            this.inv_customer_name = '';
            this.customerDataForm.controls['fcn_customer_name'].setValue('');
            //alert('Enter valid mobile number');
        }

        this.inv_customer_name = this.customerDataForm.value.fcn_customer_name;
        this.inv_cust_mobile_no = this.customerDataForm.value.fcn_customer_mobile;
        this.inv_sales_man = this.vocDataForm.value.sales_person;
        this.inv_bill_date = this.convertDate(this.vocDataForm.value.vocdate);
        this.inv_number = this.vocDataForm.value.fcn_voc_no;
    }

    dummyDateCheck(date: any) {
        if (this.dummyDateArr.includes(date))
            return '';
        else
            return date;
    }

    convertDate(str: any) {
        var date = new Date(str),
            mnth = ('0' + (date.getMonth() + 1)).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return [day, mnth, date.getFullYear()].join('-');
    }

    openDialog(title: any, msg: any, okBtn: any, swapColor = false) {
        this.dialogBox = this.dialog.open(DialogboxComponent, {
            width: '40%',
            disableClose: true,
            data: { title, msg, okBtn, swapColor },
        });
    }


    getMaritalStatus() {
        console.log('================getComboFilterByID====================');
        console.log(this.comFunc.getComboFilterByID('Marital Status'));
        console.log('====================================');
        this.maritalStatusList = this.comFunc.getComboFilterByID('Marital Status');
        this.genderList = this.comFunc.getComboFilterByID('gender')
        this.genderList.forEach((data: any) => data.ENGLISH = data.ENGLISH.toUpperCase())
        console.log('genderList', this.genderList);

    }

    async getMasters() {

        this.countryMaster = this.comFunc.countryMaster;
        this.countryMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_country.valueChanges.pipe(
                startWith(''),
                map((value) =>
                    this._filterMasters(this.countryMaster, value, 'CODE', 'DESCRIPTION')
                )
            );
        this.mobileCountryMaster = this.comFunc.countryMaster.filter((data: any) => data.MOBILECOUNTRYCODE != '');
        this.mobileCountryMasterOptions =
            this.customerDetailForm.controls.fcn_mob_code.valueChanges.pipe(
                startWith(''),
                map((value) =>
                    this._filterMasters(this.mobileCountryMaster, value, 'MOBILECOUNTRYCODE', 'DESCRIPTION')
                )
            );

        this.nationalityMaster = this.comFunc.nationalityMaster;
        this.nationalityMasterOptions =
            this.customerDetailForm.controls.fcn_cust_detail_nationality.valueChanges.pipe(
                startWith(''),
                map((value) =>
                    this._filterMasters(this.nationalityMaster, value, 'CODE', 'DESCRIPTION')
                )
            );


        const sourceOfWealth = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('SOURCE OF WEALTH AND FUNDS MASTER')}`;
        this.suntechApi.getDynamicAPI(sourceOfWealth).subscribe((resp) => {
            if (resp.status == 'Success') {
                this.sourceOfFundList = resp.response;
                console.log('====================sourceOfFundList================');
                console.log(this.sourceOfFundList);
                console.log('====================================');
                this.sourceOfFundListOptions =
                    this.customerDetailForm.controls.fcn_source_of_fund.valueChanges.pipe(
                        startWith(''),
                        map((value) =>
                            this._filterMasters(this.sourceOfFundList, value, 'CODE', 'DESCRIPTION')
                        )
                    );
            }
            else {

            }
        });

    }

    changeCountry(value: any) {
        this.getStateMasterByID(value);
    }

    @HostListener('document:keydown.escape', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
      this.lineItemService.openWarningModal(() => this.modal.dismiss('Cross click'));
      if (this.lineItemService.isWarningModalOpen) {
        event.preventDefault();
        event.stopPropagation(); 
      } else {
        
      }
    }


    getStateMasterByID(countryCode: any) {
        let API = `GeneralMaster/GetGeneralMasterList/${encodeURIComponent('STATE MASTER')}/${encodeURIComponent(countryCode)}`
        this.suntechApi.getDynamicAPI(API).
            subscribe(async data => {
                if (data.status == "Success") {
                    this.stateMaster = data.response;
                    this.stateMasterOptions =
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
        // const resp = this.comFunc.getMasterByID('ID MASTER');
        const resp = await this.comFunc.idMaster;

        console.log('==============this.comFunc.idMaster======================');
        console.log(this.comFunc.idMaster);
        console.log('====================================');
        // console.table(resp);
        // this.all_sales_person = resp;
        var data = resp.map((t: any) => t.CODE);
        this.idTypeOptions = data;
        this.idTypeFilteredOptions =
            this.customerDataForm.controls.fcn_customer_id_type.valueChanges.pipe(
                startWith(''),
                map((value) => this._filterIdType(value))
            );

    }

    private _filterIdType(value: string): string[] {
        value = value != null ? value.toString().toLowerCase() : '';
        const filterValue = value;
        // const filterValue = value.toString().toLowerCase() || '';

        return this.idTypeOptions.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }


    customerSave() {

        console.log('============this.customerDetailForm.value.fcn_cust_detail_dob========================');
        console.log(this.customerDetailForm.value.fcn_cust_detail_dob);
        // console.log(this.customerDetailForm.value.fcn_cust_detail_dob.toISOString());
        console.log(this.datePipe.transform(this.dummyDateCheck(this.customerDetailForm.value.fcn_cust_detail_dob), 'dd/M/yyyy'));
        console.log(this.datePipe.transform(this.dummyDateCheck(this.customerDetailForm.value.fcn_cust_detail_dob), 'yyyy-MM-ddTHH:mm:ss'));
        // console.log(this.customerDetailForm.value.fcn_cust_detail_dob.toUTCString());
        // const formattedDate = `${this.customerDetailForm.value.fcn_cust_detail_dob.getFullYear()}-${this.customerDetailForm.value.fcn_cust_detail_dob.getMonth() + 1}-${this.customerDetailForm.value.fcn_cust_detail_dob.getDate()}`;
        // console.log(formattedDate);
        // console.log(this.datePipe.transform(formattedDate, 'dd/M/yyyy'))

        console.log('====================================');
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

            this.customerDataForm.controls.fcn_customer_id_number.setValue(
                this.customerDetailForm.value.fcn_cust_detail_idcard
            );
            this.customerDetails.NAME =
                this.customerDetailForm.value.fcn_customer_detail_name;
            this.customerDataForm.controls.fcn_customer_name.setValue(
                this.customerDetailForm.value.fcn_customer_detail_name
            );
            this.customerDetails.FIRSTNAME =
                this.customerDetailForm.value.fcn_customer_detail_fname;
            this.customerDetails.MIDDLENAME =
                this.customerDetailForm.value.fcn_customer_detail_mname;
            this.customerDetails.LASTNAME =
                this.customerDetailForm.value.fcn_customer_detail_lname;
            this.customerDetails.MOBILE =
                this.customerDetailForm.value.fcn_cust_detail_phone;
            this.customerDataForm.controls.fcn_customer_mobile.setValue(
                this.customerDetailForm.value.fcn_cust_detail_phone
            );

            this.customerDetails.IDCATEGORY =
                // this.customerDetails.CUST_TYPE =
                this.customerDetailForm.value.fcn_cust_detail_idType;
            this.customerDataForm.controls.fcn_customer_id_type.setValue(
                this.customerDetailForm.value.fcn_cust_detail_idType
            );

            this.customerDetails.CUST_TYPE =
                this.customerDetailForm.value.fcn_cust_type;
            this.customerDetails.POSCUSTPREFIX =
                this.customerDetailForm.value.fcn_cust_desg;
            this.customerDetails.MOBILECODE1 =
                this.customerDetailForm.value.fcn_mob_code;
            this.customerDetails.CODE =
                this.customerDataForm.value.fcn_customer_code;
            this.customerDetails.SOURCE =
                this.customerDataForm.value.fcn_source_of_fund;
            this.customerDetails.COMPANY =
                this.customerDetailForm.value.fcn_cust_detail_company;


            // this.modalService.
            // if (this.amlNameValidation) {

            // trigger form errors
            Object.values(this.customerDetailForm.controls).forEach(control => {
                control.markAsTouched();
            });

            console.log(this.customerDetailForm.errors);

            if (!this.customerDetailForm.invalid) {

                const posCustomer = {
                    CODE: this.customerDataForm.value.fcn_customer_code || '0',
                    // CODE: this.customerDetails?.CODE || '0',
                    NAME: this.customerDataForm.value.fcn_customer_name || '',
                    COMPANY: this.customerDetails?.COMPANY || '',
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
                    MOBILE: `${this.customerDataForm.value.fcn_customer_mobile}` || '',
                    FAX: this.customerDetails?.FAX || '',
                    MARITAL_ST:
                        this.customerDetailForm.value.fcn_cust_detail_marital_status ||
                        // this.customerDetails?.MARITAL_ST ||
                        'Unknown',
                    WED_DATE: this.customerDetails?.WED_DATE || this.dummyDate,
                    SPOUSE_NAME: this.customerDetails?.SPOUSE_NAME || '',
                    REMARKS: this.customerDetails?.REMARKS || '',
                    DATE_OF_BIRTH:
                        // this.datePipe.transform(formattedDate, 'dd/M/yyyy') ||
                        //  formatDate(formattedDate, 'dd/MM/yyyy', 'en-US') ||

                        this.comFunc.cDateFormat(this.customerDetailForm.value.fcn_cust_detail_dob) ||
                        // this.customerDetailForm.value.fcn_cust_detail_dob ||
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
                        this.customerDataForm.value.fcn_customer_id_number ||
                        // this.customerDetails?.POSCUSTIDNO ||
                        '',
                    POSSMAN: this.customerDetails?.POSSMAN || '',
                    POSCUSTPREFIX: this.customerDetailForm.value.fcn_cust_desg || '0',
                    // POSCustPrefix: this.customerDetails?.POSCustPrefix || '0',
                    MOBILE1: this.customerDetailForm.value.fcn_cust_detail_phone2 ||
                        //  this.customerDetails?.MOBILE1 ||
                        '',
                    CUST_LANGUAGE: this.customerDetails?.CUST_LANGUAGE || '',
                    CUST_TYPE:
                        this.customerDetailForm.value.fcn_cust_type ||
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
                    SOURCE: this.customerDetailForm.value.fcn_source_of_fund || '',
                    // SOURCE: this.customerDetails?.SOURCE || '',
                    PREFERENCE_CONTACT: this.customerDetails?.PREFERENCE_CONTACT || '',
                    MOBILECODE1: this.customerDetailForm.value.fcn_mob_code || '',
                    // MOBILECODE1: this.customerDetails?.MOBILECODE1 || '',
                    MOBILECODE2: this.customerDetails?.MOBILECODE2 || '',
                    IDCATEGORY:
                        this.customerDataForm.value.fcn_customer_id_type
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
                    TEL_R_CODE: `${this.comFunc.emptyToZero(
                        this.customerDetails?.TEL_R_CODE
                    )}`,
                    TEL_O_CODE: `${this.comFunc.emptyToZero(
                        this.customerDetails?.TEL_O_CODE
                    )}`,
                    GST_NUMBER: `${this.comFunc.emptyToZero(
                        this.customerDetails?.GST_NUMBER
                    )}`,
                    VAT_NUMBER: `${this.comFunc.emptyToZero(
                        this.customerDetails?.VAT_NUMBER
                    )}`,
                    PARENT_CODE: `${this.comFunc.emptyToZero(
                        this.customerDetails?.PARENT_CODE
                    )}`,
                    REFERED_BY: `${this.comFunc.emptyToZero(
                        this.customerDetails?.REFERED_BY
                    )}`,
                    CREDIT_LIMIT: this.customerDetails?.CREDIT_LIMIT || 0,
                    CREDIT_LIMIT_STATUS:
                        this.customerDetails?.CREDIT_LIMIT_STATUS || false,
                    PANCARDNO: this.customerDetails?.PANCARDNO || '111111' || '',
                    VOCTYPE: this.vocType || '',
                    YEARMONTH: this.baseYear || '',
                    VOCNO: this.vocDataForm.value.fcn_voc_no || '',
                    VOCDATE: this.convertDateWithTimeZero(
                        new Date(this.vocDataForm.value.vocdate).toISOString()
                    ),

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


                    "BRANCH_CODE": this.strBranchcode || '',
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

                    "POSCUSTIDEXP_DATE": this.customerDetailForm.value.fcn_customer_exp_date || this.dummyDate,

                    // new fields added 27-12-2023
                    "ATTACHMENT_FROM_SCANNER": true, // need to discuss
                    "GOOD_QUALITY_A_K_A": "",
                    "LOW_QUALITY_A_K_A": "",
                    "POSKNOWNABOUT": 0

                };

                // const apiCtrl =
                //     posCustomer.CODE &&
                //         posCustomer.CODE != '' &&
                //         posCustomer.CODE.toString() != '0'
                //         ? 'updatePosCustomer'
                //         : 'insertPosCustomer';

                // this.suntechApi[apiCtrl](posCustomer).subscribe(async (data: any) => {

                let apiCtrl;
                let method;
                let custResponse;
                if (
                    posCustomer.CODE &&
                    posCustomer.CODE !== '' &&
                    posCustomer.CODE.toString() !== '0'
                ) {
                    apiCtrl = `PosCustomerMaster/UpdateCustomerMaster/Code=${posCustomer.CODE}`;
                    custResponse = this.suntechApi.putDynamicAPI(apiCtrl, posCustomer)
                } else {
                    apiCtrl = 'PosCustomerMaster/InsertCustomerMaster';
                    custResponse = this.suntechApi.postDynamicAPI(apiCtrl, posCustomer)
                }


                custResponse.subscribe(async (data) => {

                    // this.isCustProcessing = false;

                    if (data.status == 'Success') {
                        this.customerDetails = await data.response;
                        this.customerDataForm.controls['fcn_customer_name'].setValue(
                            this.customerDetails.NAME
                        );
                        this.customerDataForm.controls['fcn_customer_id_type'].setValue(
                            this.customerDetails.IDCATEGORY
                            // this.customerDetails.CUST_TYPE
                        );
                        this.customerDataForm.controls['fcn_customer_id_number'].setValue(
                            this.customerDetails.POSCUSTIDNO
                        );
                        this.inv_customer_name = this.customerDetails.NAME;
                        this.inv_cust_mobile_no = this.customerDetails.MOBILE;
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
                            this.customerDetails.MOBILE1
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
                            // this.datePipe.transform(this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH), 'dd/M/yyyy')
                        );

                        this.customerDetailForm.controls.fcn_cust_type.setValue(
                            this.customerDetails.CUST_TYPE
                        );
                        this.customerDetailForm.controls.fcn_mob_code.setValue(
                            this.customerDetails.MOBILECODE1
                        );
                        this.customerDetailForm.controls.fcn_cust_desg.setValue(
                            this.customerDetails.POSCUSTPREFIX
                        );



                        // this.customerDetailForm.controls.fcn_cust_type.setValue(
                        //   this.customerDetails.CUST_TYPE
                        // );
                        // this.customerDetailForm.controls.fcn_cust_desg.setValue(
                        //   this.customerDetails.POSCUSTPREFIX
                        // );
                        // this.customerDetailForm.controls.fcn_mob_code.setValue(
                        //   this.customerDetails.MOBILECODE1
                        // );
                        this.customerDataForm.controls.fcn_customer_code.setValue(
                            this.customerDetails.CODE
                        );

                        this.customerDetailForm.controls.fcn_source_of_fund.setValue(
                            this.customerDetails.SOURCE
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
                            //   this.comFunc.allbranchMaster?.DIGICOMPACCODE &&
                            //     this.comFunc.allbranchMaster?.DIGICOMPACCODE != ''
                            //     ? `${this.comFunc.allbranchMaster?.DIGICOMPACCODE}/${this.customerDetails.CODE}`
                            //     : this.customerDetails.CODE;


                            const payload = {
                                AMLDIGICOMPANYNAME: encodeURIComponent(
                                    this.comFunc.allbranchMaster.AMLDIGICOMPANYNAME || ' '
                                ),
                                AMLDIGIUSERNAME: encodeURIComponent(
                                    this.comFunc.allbranchMaster.AMLDIGIUSERNAME || ' '
                                ),
                                AMLDIGIPASSWORD: encodeURIComponent(
                                    this.comFunc.allbranchMaster.AMLDIGIPASSWORD || ' '
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
                                    // this.comFunc.nullOrEmpty(

                                    encodeURIComponent(
                                        this.comFunc.convertDateToMDY(
                                            this.dummyDateCheck(this.customerDetails.DATE_OF_BIRTH)
                                        )
                                    )
                                ,
                                // CUST_Type: this.comFunc.nullOrEmpty(
                                //   encodeURIComponent(this.customerDetails.CUST_TYPE),
                                //   '%27%27'),
                                CUST_Type: encodeURIComponent('I'),

                                // CUST_Type: encodeURIComponent(
                                //   this.customerDetails.CUST_Type || ' '
                                // ),
                                AMLUSERID:
                                    encodeURIComponent(this.comFunc.allbranchMaster.AMLUSERID)
                                ,
                                AMLDIGITHRESHOLD:
                                    encodeURIComponent(
                                        this.comFunc.allbranchMaster.AMLDIGITHRESHOLD
                                    ) || '%27%27',
                                DIGIIPPATH:
                                    encodeURIComponent(this.comFunc.allbranchMaster.DIGIIPPATH) ||
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

                            setTimeout(() => {
                                this.snackBar.open('Loading...');
                            }, 1000);

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

                            this.suntechApi.getDynamicAPIwithParams('AMLValidation', queryParams).subscribe(async (data) => {
                                this.isCustProcessing = false;

                                this.snackBar.open('Loading...');

                                this.suntechApi
                                    .putDynamicAPI(
                                        `PosCustomerMaster/UpdateDigiScreened/code=${this.customerDetails.CODE}/DigiScreened=true`,
                                        ''
                                    )
                                    .subscribe((resp) => {
                                        this.snackBar.dismiss();
                                        if (resp.status == "Success") {
                                            // this.customerDetails = resp.response;
                                            this.customerDetails.DIGISCREENED = resp.response != null ? resp.response?.DIGISCREENED : true;
                                            this.openDialog('Success', 'Customer added', true);
                                            this.dialogBox.afterClosed().subscribe((data: any) => {
                                                if (data == 'OK') {
                                                    this.modal.dismiss('Cross click');
                                                }
                                            });
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
                                                this.modal.dismiss('Cross click');
                                            }
                                        });
                                        // need to use put api
                                        this.amlNameValidationData = true;

                                        this.suntechApi
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
                                            this.modal.dismiss('Cross click');
                                        });
                                        //proceed
                                        this.amlNameValidationData = false;
                                    }
                                } else {
                                    this.openDialog('Warning', JSON.stringify(data.response), true);
                                    this.dialogBox.afterClosed().subscribe((data: any) => {
                                        if (data == 'OK') {
                                            this.modal.dismiss('Cross click');
                                        }
                                    });
                                    this.amlNameValidationData = true;

                                }
                            });

                        } else {
                            this.isCustProcessing = false;
                            this.modal.dismiss('Cross click');
                        }
                    } else {
                        this.customerDetails = {};
                        this.snackBar.open(data.message, '', {
                            duration: 2000 // time in milliseconds
                        });
                        this.modal.dismiss('Cross click');
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

    convertDateWithTimeZero(date: any) {
        return date.split('T')[0] + 'T00:00:00.000Z';
    }

    changeIdtype(val: any) {
        //this.customerDataForm.controls.id_number.setValue(val);
        //this.customerDataForm.controls['fcn_customer_id_number'].setValue(val);
    }

    /** start customer detail form */
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

}