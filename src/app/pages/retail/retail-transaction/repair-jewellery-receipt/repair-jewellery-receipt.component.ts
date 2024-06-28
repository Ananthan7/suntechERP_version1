import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';
import { RepairDetailsComponent } from './repair-details/repair-details.component';


@Component({
  selector: 'app-repair-jewellery-receipt',
  templateUrl: './repair-jewellery-receipt.component.html',
  styleUrls: ['./repair-jewellery-receipt.component.scss']
})
export class RepairJewelleryReceiptComponent implements OnInit {
  
  columnheadItemDetails:any[] = ['SRNO','DIVISION_CODE','ITEM_DESCRIPTION','DT_REMARKS','PCS','GROSSWT','REPAIR_TYPE','ITEM_STATUSTYPE'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['Repair Narration']
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  yearMonth?: any = localStorage.getItem('YEAR') || '';
  branchCode?: any = localStorage.getItem('userbranch');
  vocMaxDate = new Date();
  currentDate = new Date();
  repairDetailsData: any[] = [];
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  private subscriptions: Subscription[] = [];
  isCurrencyUpdate: boolean = false;
  viewOnly: boolean = false;
  editOnly: boolean = false;
  selectedIndexes: any = [];
  editAndViewData: any;

  hideCurrecnySearch: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {    

    if (this.content?.MID != null)
      this.getArgsData();
    else {
      this.generateVocNo();
    }
    this.snackBar.open('Loading...');
    this.repairjewelleryreceiptFrom.controls.voctype.setValue(this.comService.getqueryParamVocType())
    this.repairjewelleryreceiptFrom.controls.vocDate.setValue(this.currentDate)
    
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;

  }

  generateVocNo() {

    let params = {
      vocType: this.comService.getqueryParamVocType(),
      branchCode : this.branchCode,
      yearMonth : this.yearMonth,
      vocDate: this.convertDateToYMD(this.currentDate),
      blnTransferDummyDatabase:false


    }

    let sub: Subscription = this.dataService.getDynamicAPIwithParams('GenerateNewVoucherNumber/GenerateNewVocNum',params)
    .subscribe((res) => {
      if (res.status == "Success") {
          this.repairjewelleryreceiptFrom.controls.vocno.setValue(res.newvocno);
        }
      });
  }

  convertDateToYMD(str: any) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join('-');
  }

  CurrencySelected(e: any) {
    this.resetVatFields();
    this.repairjewelleryreceiptFrom.controls.currency.setValue(e.Currency)

    this.repairjewelleryreceiptFrom.controls.currency_rate.setValue(this.comService.decimalQuantityFormat(e['Conv Rate'], 'RATE'));

  }

  resetVatFields() {
    this.repairjewelleryreceiptFrom.controls.currency.setValue('');
    this.repairjewelleryreceiptFrom.controls.currency_rate.setValue('');
  }

  repairjewelleryreceiptFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocno: [''],
    vocDate : [''],
    salesman  : [''],
    customer :[''],
    customerDesc: [''],
    mobile :[''],
    tel  :[''],
    nationality :[''],
    type  :[''],
    remark:[''],
    currency :[''],
    currency_rate :[''],
    email :[''],
    address  :[''],
    repair_narration :[''],
    customer_delivery_date :[''],
   });

   salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman type',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesManCodeSelected(e: any) {
    this.repairjewelleryreceiptFrom.controls.salesman.setValue(e.SALESPERSON_CODE);
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  customerCodeSelected(e: any) {
    this.repairjewelleryreceiptFrom.controls.customer.setValue(e.CODE);
    this.repairjewelleryreceiptFrom.controls.customerDesc.setValue(e.NAME);
    this.repairjewelleryreceiptFrom.controls.email.setValue(e.EMAIL);
    this.repairjewelleryreceiptFrom.controls.tel.setValue(e.TEL1);
    this.repairjewelleryreceiptFrom.controls.mobile.setValue(e.MOBILE);
  }

  currencyData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 9,
    SEARCH_FIELD: 'Currency',
    SEARCH_HEADING: 'Currency Code',
    SEARCH_VALUE: '',
    WHERECONDITION: `@strBranch='${this.comService.branchCode}',@strPartyCode=''`,
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
    FRONTENDFILTER: true

  }

  
  getArgsData() {
    console.log('this.content', this.content);
    if (this.content.FLAG == 'VIEW')
      this.viewOnly = true;
    if (this.content.FLAG == "EDIT") {
      this.editOnly = true
    }

    const params = {
      BRANCH_CODE :this.branchCode,
      VOCTYPE : this.comService.getqueryParamVocType(),
      YEARMONTH : this.yearMonth
    }


    let Sub: Subscription = this.dataService.getDynamicAPIwithParams(`Repair/GetRepairHeaderList`,params)
      .subscribe((result) => {
        this.snackBar.dismiss();
        console.log('====================================');
        console.log(result.response);
        console.log('====================================');
      const filteredData = result.response.filter((item: any) => item.MID === this.content.MID);
      console.log(filteredData);
      

      })


      // Log the filtered data

    // Repair/GetRepairHeaderList/MOE/REP/2024/MOE
  //   {
  //     "MID": 7,
  //     "BRANCH_CODE": "MOE",
  //     "VOCTYPE": "REP",
  //     "VOCNO": 1,
  //     "VOCDATE": "24-06-2024",
  //     "YEARMONTH": "2024",
  //     "SALESPERSON_CODE": "string",
  //     "POSCUSTCODE": "string",
  //     "PARTYNAME": "string",
  //     "TEL1": "string",
  //     "TEL2": "string",
  //     "MOBILE": "string",
  //     "POBOX": "string",
  //     "NATIONALITY": "string",
  //     "EMAIL": "ABC@GMAIL.COM",
  //     "TYPE": "string",
  //     "REMARKS": "TEST ENTRY FOR REPAIR API",
  //     "TOTAL_PCS": 2,
  //     "TOTAL_GRWT": 0,
  //     "SYSTEM_DATE": "24-06-2024",
  //     "NAVSEQNO": 2024000001,
  //     "DELIVERYDATE": "24-06-2024",
  //     "SALESREFERENCE": "string",
  //     "STATUS": 0,
  //     "TRANSFERID": 0,
  //     "AUTHORISE": 0,
  //     "AUTHORISE_BRANCH": "string",
  //     "WSID": 0,
  //     "MOBILECODE": "971",
  //     "POSCUSTPREFIX": "string",
  //     "STATE": "string",
  //     "RELIGION": "string",
  //     "CITY": "string",
  //     "ADDRESS": "string",
  //     "TRANSFERFLAG": "Y",
  //     "BASE_CURRENCY": "AED",
  //     "BASE_CURR_RATE": 0,
  //     "ISAUTHORIZED": "Y",
  //     "AUTHORIZEDDATE": "24-06-2024",
  //     "AUTOPOSTING": "Y",
  //     "PRINT_COUNT": 0,
  //     "TOT_EST_REPAIR_CHARGES": 0,
  //     "PRINT_COUNT_ACCOPY": 0,
  //     "PRINT_COUNT_CNTLCOPY": 0,
  //     "HTUSERNAME": "string",
  //     "COUNT": "2",
  //     "FLAG": "VIEW"
  // }

  this.repairjewelleryreceiptFrom.controls['voctype'].setValue(this.content.VOCTYPE)
  this.repairjewelleryreceiptFrom.controls['vocno'].setValue(this.content.VOCNO)
  this.repairjewelleryreceiptFrom.controls['vocDate'].setValue(this.content.VOCDATE)
  this.repairjewelleryreceiptFrom.controls['salesman'].setValue(this.content.SALESPERSON_CODE)
  this.repairjewelleryreceiptFrom.controls['customer'].setValue(this.content.POSCUSTCODE)
  this.repairjewelleryreceiptFrom.controls['customerDesc'].setValue(this.content.PARTYNAME)

  this.repairjewelleryreceiptFrom.controls['mobile'].setValue(this.content.MOBILE)
  this.repairjewelleryreceiptFrom.controls['tel'].setValue(this.content.TEL1)
  this.repairjewelleryreceiptFrom.controls['nationality'].setValue(this.content.NATIONALITY)
  this.repairjewelleryreceiptFrom.controls['type'].setValue(this.content.TYPE)
  this.repairjewelleryreceiptFrom.controls['currency'].setValue(this.content.BASE_CURRENCY)
  this.repairjewelleryreceiptFrom.controls['currency_rate'].setValue(this.content.BASE_CURR_RATE)
  this.repairjewelleryreceiptFrom.controls['email'].setValue(this.content.EMAIL)
  this.repairjewelleryreceiptFrom.controls['address'].setValue(this.content.ADDRESS)
  // this.repairjewelleryreceiptFrom.controls['repair_narration'].setValue(this.content.EMAIL)
  this.repairjewelleryreceiptFrom.controls['customer_delivery_date'].setValue(this.content.DELIVERYDATE``)









    this.repairjewelleryreceiptFrom.controls['remark'].setValue(this.content.REMARKS)


      // if (result.status == "Success") {
        //   const data = result.response;

        //   this.posCurrencyDetailsData = data.currencyReceiptDetails;
        //   console.log('this.posCurrencyDetailsData', this.posCurrencyDetailsData);


        //   this.posCurrencyDetailsData.forEach(item => {
        //     item.NET_TOTAL = (parseFloat(item.AMOUNTCC) + parseFloat(item.IGST_AMOUNTCC)).toFixed(2);
        //     item.CURRENCY_RATE = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.CURRENCY_RATE), 'RATE');
        //     item.AMOUNTFC = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.AMOUNTFC), 'AMOUNT');
        //     item.IGST_AMOUNTCC = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.IGST_AMOUNTCC), 'AMOUNT');
        //   });


        //   this.updateFormValuesAndSRNO();

        //   // set form values
        //   this.posCurrencyReceiptForm.controls.vocType.setValue(data.VOCTYPE);
        //   this.posCurrencyReceiptForm.controls.vocNo.setValue(data.VOCNO);
        //   this.posCurrencyReceiptForm.controls.vocDate.setValue(data.VOCDATE);
        //   this.posCurrencyReceiptForm.controls.partyCode.setValue(data.PARTYCODE);
        //   this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(data.HHACCOUNT_HEAD);
        //   this.posCurrencyReceiptForm.controls.partyCurrency.setValue(data.PARTY_CURRENCY);
        //   this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(data.PARTY_CURR_RATE);

        //   this.posCurrencyReceiptForm.controls.enteredby.setValue(data.SALESPERSON_CODE);
        //   this.posCurrencyReceiptForm.controls.enteredbyuser.setValue(data.SALESPERSON_NAME);
        //   this.posCurrencyReceiptForm.controls.dueDaysdesc.setValue(data.DUEDAYS);

        //   this.posCurrencyReceiptForm.controls.customerCode.setValue(data.POSCUSTOMERCODE);
        //   this.posCurrencyReceiptForm.controls.customerName.setValue(data.CUSTOMER_NAME);
        //   this.posCurrencyReceiptForm.controls.mobile.setValue(data.CUSTOMER_MOBILE);
        //   this.posCurrencyReceiptForm.controls.email.setValue(data.CUSTOMER_EMAIL);
        //   this.customerData = {
        //     "MOBILE": data.CUSTOMER_MOBILE,
        //     "CODE": data.POSCUSTOMERCODE,
        //   }

        //   this.posCurrencyReceiptForm.controls.partyAddress.setValue(data.PARTY_ADDRESS);

        //   this.posCurrencyReceiptForm.controls.partyCurr.setValue(data.PARTY_CURRENCY);


        //   this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(this.comService.decimalQuantityFormat(
        //     this.comService.emptyToZero(data.TOTAL_AMOUNTFC),
        //     'AMOUNT'
        //   ));

        // }

    // const params = {
    //   BRANCH_CODE :this.branchCode,
    //   VOCTYPE : this.comService.getqueryParamVocType(),
    //   YEARMONTH : this.yearMonth
    // }

    // this.snackBar.open('Loading...');
    // let Sub: Subscription = this.dataService.getDynamicAPIwithParams(`Repair/GetRepairDetailList/`,params)
    //   .subscribe((result) => {
    //     this.snackBar.dismiss();
    //     console.log('====================================');
    //     console.log(result);
    //     console.log('====================================');
        // if (result.status == "Success") {
        //   const data = result.response;

        //   this.posCurrencyDetailsData = data.currencyReceiptDetails;
        //   console.log('this.posCurrencyDetailsData', this.posCurrencyDetailsData);


        //   this.posCurrencyDetailsData.forEach(item => {
        //     item.NET_TOTAL = (parseFloat(item.AMOUNTCC) + parseFloat(item.IGST_AMOUNTCC)).toFixed(2);
        //     item.CURRENCY_RATE = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.CURRENCY_RATE), 'RATE');
        //     item.AMOUNTFC = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.AMOUNTFC), 'AMOUNT');
        //     item.IGST_AMOUNTCC = this.comService.decimalQuantityFormat(this.comService.emptyToZero(item.IGST_AMOUNTCC), 'AMOUNT');
        //   });


        //   this.updateFormValuesAndSRNO();

        //   // set form values
        //   this.posCurrencyReceiptForm.controls.vocType.setValue(data.VOCTYPE);
        //   this.posCurrencyReceiptForm.controls.vocNo.setValue(data.VOCNO);
        //   this.posCurrencyReceiptForm.controls.vocDate.setValue(data.VOCDATE);
        //   this.posCurrencyReceiptForm.controls.partyCode.setValue(data.PARTYCODE);
        //   this.posCurrencyReceiptForm.controls.partyCodeDesc.setValue(data.HHACCOUNT_HEAD);
        //   this.posCurrencyReceiptForm.controls.partyCurrency.setValue(data.PARTY_CURRENCY);
        //   this.posCurrencyReceiptForm.controls.partyCurrencyRate.setValue(data.PARTY_CURR_RATE);

        //   this.posCurrencyReceiptForm.controls.enteredby.setValue(data.SALESPERSON_CODE);
        //   this.posCurrencyReceiptForm.controls.enteredbyuser.setValue(data.SALESPERSON_NAME);
        //   this.posCurrencyReceiptForm.controls.dueDaysdesc.setValue(data.DUEDAYS);

        //   this.posCurrencyReceiptForm.controls.customerCode.setValue(data.POSCUSTOMERCODE);
        //   this.posCurrencyReceiptForm.controls.customerName.setValue(data.CUSTOMER_NAME);
        //   this.posCurrencyReceiptForm.controls.mobile.setValue(data.CUSTOMER_MOBILE);
        //   this.posCurrencyReceiptForm.controls.email.setValue(data.CUSTOMER_EMAIL);
        //   this.customerData = {
        //     "MOBILE": data.CUSTOMER_MOBILE,
        //     "CODE": data.POSCUSTOMERCODE,
        //   }

        //   this.posCurrencyReceiptForm.controls.partyAddress.setValue(data.PARTY_ADDRESS);

        //   this.posCurrencyReceiptForm.controls.partyCurr.setValue(data.PARTY_CURRENCY);


        //   this.posCurrencyReceiptForm.controls.partyAmountFC.setValue(this.comService.decimalQuantityFormat(
        //     this.comService.emptyToZero(data.TOTAL_AMOUNTFC),
        //     'AMOUNT'
        //   ));

        // }
      // });
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  

  adddata() {

    
   
}



adddatas() {
  
 
}

removedata(){
  
}

removedatas(){
  
}

validateForm() {
  if (this.repairjewelleryreceiptFrom.invalid) {
    this.toastr.error('Select all required fields');
    return false;
  }

  // if (this.isCustomerRequired && !this.repairjewelleryreceiptFrom.controls.customerCode.value) {
  //   this.toastr.error('Please fill customer details');
  //   return false;
  // }

  return true;
}





formSubmit(){
  console.log(this.content);
  

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (!this.validateForm()) {
    return;
  }

  let API = 'Repair/InsertRepair'
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "VOCTYPE": this.repairjewelleryreceiptFrom.value.voctype,
    "VOCNO": this.repairjewelleryreceiptFrom.value.vocno,
    "VOCDATE": this.repairjewelleryreceiptFrom.value.vocDate,
    "YEARMONTH": this.yearMonth,
    "SALESPERSON_CODE": this.repairjewelleryreceiptFrom.value.salesman,
    "POSCUSTCODE": this.repairjewelleryreceiptFrom.value.customer,
    "PARTYNAME": "",
    "TEL1": this.repairjewelleryreceiptFrom.value.tel,
    "TEL2": "",
    "MOBILE": this.repairjewelleryreceiptFrom.value.mobile,
    "POBOX": "",
    "NATIONALITY": this.repairjewelleryreceiptFrom.value.nationality,
    "EMAIL": this.repairjewelleryreceiptFrom.value.email,
    "TYPE": this.repairjewelleryreceiptFrom.value.type,
    "REMARKS": this.repairjewelleryreceiptFrom.value.remark,
    "TOTAL_PCS": 0,
    "TOTAL_GRWT": 0,
    "SYSTEM_DATE": "",
    "NAVSEQNO": 0,
    "DELIVERYDATE": this.repairjewelleryreceiptFrom.value.customer_delivery_date,
    "SALESREFERENCE": "",
    "STATUS": 0,
    "TRANSFERID": 0,
    "ADDRESS": this.repairjewelleryreceiptFrom.value.address,
    "TRANSFERFLAG": true,
    "BASE_CURRENCY": this.repairjewelleryreceiptFrom.value.currency,
    "BASE_CURR_RATE": this.repairjewelleryreceiptFrom.value.currency_rate,
    "ISAUTHORIZED": true,
    "AUTHORIZEDDATE": "",
    "AUTOPOSTING": true,
    "PRINT_COUNT": 0,
    "TOT_EST_REPAIR_CHARGES": 0,
    "PRINT_COUNT_ACCOPY": 0,
    "PRINT_COUNT_CNTLCOPY": 0,
    "HTUSERNAME": "",
    "AUTHORISE_BRANCH": "",
    "CITY": "",
    "MOBILECODE": "",
    "RELIGION": "",
    "STATE": "",
    "POSCUSTPREFIX": "",
    "AUTHORISE": 0,
    "WSID": 0,
    "Details": this.repairDetailsData,
    // "Details": [
    //   {
    //     "UNIQUEID": 0,
    //     "SRNO": 0,
    //     "DIVISION_CODE": "3",
    //     "STOCK_CODE": "",
    //     "ITEM_DESCRIPTION": "",
    //     "ITEM_NARRATION": "",
    //     "PCS": 0,
    //     "GROSSWT": 0,
    //     "AMOUNT": 0,
    //     "REPAIR_TYPE": "",
    //     "REPAIR_ITEMTYPE": "",
    //     "ITEM_STATUSTYPE": "",
    //     "ITEM_PICTUREPATH": "",
    //     "DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
    //     "STATUS": 0,
    //     "TRANSFERID": 0,
    //     "TRANSFERCID": 0,
    //     "RECEIVEID": 0,
    //     "DELIVERID": 0,
    //     "NEWWEIGHT": 0,
    //     "REPAIRAMOUNT": 0,
    //     "OTHERAMOUNT": 0,
    //     "GOLDWGT": 0,
    //     "GOLDAMOUNT": 0,
    //     "DIAMONDWGT": 0,
    //     "DIAMONDAMOUNT": 0,
    //     "LABOURCHARGE": 0,
    //     "METALCODE": "",
    //     "REPAIRBAGNO": "",
    //     "MATERIAL_TYPE": "",
    //     "STONE_TYPE": "",
    //     "NO_OF_STONES": 0,
    //     "CUT": "string",
    //     "APPROX_SIZE": "",
    //     "OWN_STOCK": "",
    //     "CHECKED": 0,
    //     "DAMAGED": 0,
    //     "RECEIPT": 0,
    //     "WITHSTONE": 0,
    //     "AUTHORIZE": true,
    //     "AUTHORIZEDDATE": "2024-03-13T06:56:20.277Z",
    //     "TRANSFERFLAG": true,
    //     "REPAIRRETURNID": 0,
    //     "DT_WSID": 0,
    //     "DT_VOCDATE": "2024-03-13T06:56:20.277Z",
    //     "DT_STATUS": 0,
    //     "DT_SALESPERSON_CODE": "",
    //     "DT_POSCUSTCODE": "",
    //     "DT_PARTYNAME": "",
    //     "DT_MOBILE": "",
    //     "FROM_BRANCH": "",
    //     "DT_DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
    //     "DELIVERED_DATE": "2024-03-13T06:56:20.277Z",
    //     "DT_TRANSFERID": 0,
    //     "DT_VOCTYPE": "",
    //     "DT_VOCNO": 0,
    //     "DT_BRANCH_CODE": "",
    //     "DT_YEARMONTH": 0,
    //     "CURRENT_BRANCH": "",
    //     "DT_TEL1": "",
    //     "DT_NATIONALITY": "",
    //     "DT_TYPE": "",
    //     "DT_EMAIL": "",
    //     "DT_REMARKS": "",
    //     "DT_DELIVERYDATE": "2024-03-13T06:56:20.277Z",
    //     "DT_TOTAL_PCS": 0,
    //     "DT_TOTAL_GRWT": 0,
    //     "DT_NAVSEQNO": 0,
    //     "DT_POBOX": "",
    //     "DT_POSCUSTPREFIX": "",
    //     "DT_MOBILECODE": "",
    //     "DT_STATE": "",
    //     "DT_RELIGION": "",
    //     "DT_CITY": "",
    //     "DT_TEL2": "",
    //     "DT_SYSTEM_DATE": "2024-03-13T06:56:20.277Z",
    //     "DT_SALESREFERENCE": "",
    //     "DT_AUTHORISE": 0,
    //     "DT_AUTHORISE_BRANCH": "",
    //     "EST_REPAIR_CHARGES": 0,
    //     "AUTH_INBRANCH_DATE": "2024-03-13T06:56:20.277Z",
    //     "AUTH_INHO_DATE": "2024-03-13T06:56:20.277Z",
    //     "AUTH_INBRANCH_REMARKS": "",
    //     "AUTH_INBRANCH_USER": "",
    //     "AUTH_INHO_REMARKS": "",
    //     "AUTH_INHO_USER": "",
    //     "BRTRANSFERID": 0,
    //     "JOBCARD_FLAG": 0,
    //     "DIRECT_DELIVERY": 0
    //   }
    // ] 
  }

  console.log(this.repairDetailsData);
  
  let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if(result.status == "Success"){
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.repairjewelleryreceiptFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      } else {
        this.toastr.error('Not saved')
      }
    }, err => alert(err))
  this.subscriptions.push(Sub)
}




update(){
  if (this.repairjewelleryreceiptFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'Repair/UpdateRepair/'+ this.branchCode + this.repairjewelleryreceiptFrom.value.voctype + this.repairjewelleryreceiptFrom.value.vocno + this.yearMonth
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "VOCTYPE": this.repairjewelleryreceiptFrom.value.voctype,
    "VOCNO": this.repairjewelleryreceiptFrom.value.vocno,
    "VOCDATE": this.repairjewelleryreceiptFrom.value.vocDate,
    "YEARMONTH": this.yearMonth,
    "SALESPERSON_CODE": this.repairjewelleryreceiptFrom.value.salesman,
    "POSCUSTCODE": this.repairjewelleryreceiptFrom.value.customer,
    "PARTYNAME": "",
    "TEL1": this.repairjewelleryreceiptFrom.value.tel,
    "TEL2": "",
    "MOBILE": this.repairjewelleryreceiptFrom.value.mobile,
    "POBOX": "",
    "NATIONALITY": this.repairjewelleryreceiptFrom.value.nationality,
    "EMAIL": this.repairjewelleryreceiptFrom.value.email,
    "TYPE": this.repairjewelleryreceiptFrom.value.type,
    "REMARKS": this.repairjewelleryreceiptFrom.value.remark,
    "TOTAL_PCS": 0,
    "TOTAL_GRWT": 0,
    "SYSTEM_DATE": "2024-03-13T06:56:20.277Z",
    "NAVSEQNO": 0,
    "DELIVERYDATE": this.repairjewelleryreceiptFrom.value.customer_delivery_date,
    "SALESREFERENCE": "",
    "STATUS": 0,
    "TRANSFERID": 0,
    "ADDRESS": this.repairjewelleryreceiptFrom.value.address,
    "TRANSFERFLAG": true,
    "BASE_CURRENCY": this.repairjewelleryreceiptFrom.value.currency,
    "BASE_CURR_RATE": this.repairjewelleryreceiptFrom.value.currency_rate,
    "ISAUTHORIZED": true,
    "AUTHORIZEDDATE": "2024-03-13T06:56:20.277Z",
    "AUTOPOSTING": true,
    "PRINT_COUNT": 0,
    "TOT_EST_REPAIR_CHARGES": 0,
    "PRINT_COUNT_ACCOPY": 0,
    "PRINT_COUNT_CNTLCOPY": 0,
    "HTUSERNAME": "",
    "AUTHORISE_BRANCH": "",
    "CITY": "",
    "MOBILECODE": "",
    "RELIGION": "",
    "STATE": "",
    "POSCUSTPREFIX": "",
    "AUTHORISE": 0,
    "WSID": 0,
    "Details": this.repairDetailsData 
    
    // [
    //   {
    //     "UNIQUEID": 0,
    //     "SRNO": 0,
    //     "DIVISION_CODE": "3",
    //     "STOCK_CODE": "",
    //     "ITEM_DESCRIPTION": "",
    //     "ITEM_NARRATION": "",
    //     "PCS": 0,
    //     "GROSSWT": 0,
    //     "AMOUNT": 0,
    //     "REPAIR_TYPE": "",
    //     "REPAIR_ITEMTYPE": "",
    //     "ITEM_STATUSTYPE": "",
    //     "ITEM_PICTUREPATH": "",
    //     "DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
    //     "STATUS": 0,
    //     "TRANSFERID": 0,
    //     "TRANSFERCID": 0,
    //     "RECEIVEID": 0,
    //     "DELIVERID": 0,
    //     "NEWWEIGHT": 0,
    //     "REPAIRAMOUNT": 0,
    //     "OTHERAMOUNT": 0,
    //     "GOLDWGT": 0,
    //     "GOLDAMOUNT": 0,
    //     "DIAMONDWGT": 0,
    //     "DIAMONDAMOUNT": 0,
    //     "LABOURCHARGE": 0,
    //     "METALCODE": "",
    //     "REPAIRBAGNO": "",
    //     "MATERIAL_TYPE": "",
    //     "STONE_TYPE": "",
    //     "NO_OF_STONES": 0,
    //     "CUT": "string",
    //     "APPROX_SIZE": "",
    //     "OWN_STOCK": "",
    //     "CHECKED": 0,
    //     "DAMAGED": 0,
    //     "RECEIPT": 0,
    //     "WITHSTONE": 0,
    //     "AUTHORIZE": true,
    //     "AUTHORIZEDDATE": "2024-03-13T06:56:20.277Z",
    //     "TRANSFERFLAG": true,
    //     "REPAIRRETURNID": 0,
    //     "DT_WSID": 0,
    //     "DT_VOCDATE": "2024-03-13T06:56:20.277Z",
    //     "DT_STATUS": 0,
    //     "DT_SALESPERSON_CODE": "",
    //     "DT_POSCUSTCODE": "",
    //     "DT_PARTYNAME": "",
    //     "DT_MOBILE": "",
    //     "FROM_BRANCH": "",
    //     "DT_DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
    //     "DELIVERED_DATE": "2024-03-13T06:56:20.277Z",
    //     "DT_TRANSFERID": 0,
    //     "DT_VOCTYPE": "",
    //     "DT_VOCNO": 0,
    //     "DT_BRANCH_CODE": "",
    //     "DT_YEARMONTH": 0,
    //     "CURRENT_BRANCH": "",
    //     "DT_TEL1": "",
    //     "DT_NATIONALITY": "",
    //     "DT_TYPE": "",
    //     "DT_EMAIL": "",
    //     "DT_REMARKS": "",
    //     "DT_DELIVERYDATE": "2024-03-13T06:56:20.277Z",
    //     "DT_TOTAL_PCS": 0,
    //     "DT_TOTAL_GRWT": 0,
    //     "DT_NAVSEQNO": 0,
    //     "DT_POBOX": "",
    //     "DT_POSCUSTPREFIX": "",
    //     "DT_MOBILECODE": "",
    //     "DT_STATE": "",
    //     "DT_RELIGION": "",
    //     "DT_CITY": "",
    //     "DT_TEL2": "",
    //     "DT_SYSTEM_DATE": "2024-03-13T06:56:20.277Z",
    //     "DT_SALESREFERENCE": "",
    //     "DT_AUTHORISE": 0,
    //     "DT_AUTHORISE_BRANCH": "",
    //     "EST_REPAIR_CHARGES": 0,
    //     "AUTH_INBRANCH_DATE": "2024-03-13T06:56:20.277Z",
    //     "AUTH_INHO_DATE": "2024-03-13T06:56:20.277Z",
    //     "AUTH_INBRANCH_REMARKS": "",
    //     "AUTH_INBRANCH_USER": "",
    //     "AUTH_INHO_REMARKS": "",
    //     "AUTH_INHO_USER": "",
    //     "BRTRANSFERID": 0,
    //     "JOBCARD_FLAG": 0,
    //     "DIRECT_DELIVERY": 0
    //   }
    // ] 
}

  let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
    .subscribe((result) => {
      if (result.response) {
        if(result.status == "Success"){
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.repairjewelleryreceiptFrom.reset()
              this.tableData = []
              this.close('reloadMainGrid')
            }
          });
        }
      } else {
        this.toastr.error('Not saved')
      }
    }, err => alert(err))
  this.subscriptions.push(Sub)
}

deleteRecord() {
  if (!this.content.VOCTYPE) {
    Swal.fire({
      title: '',
      text: 'Please Select data to delete!',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      if (result.value) {
      }
    });
    return
  }
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete!'
  }).then((result) => {
    if (result.isConfirmed) {
      let API = 'Repair/DeleteRepair/' + this.branchCode + this.repairjewelleryreceiptFrom.value.voctype + this.repairjewelleryreceiptFrom.value.vocno + this.yearMonth
      let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
        .subscribe((result) => {
          if (result) {
            if (result.status == "Success") {
              Swal.fire({
                title: result.message || 'Success',
                text: '',
                icon: 'success',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.repairjewelleryreceiptFrom.reset()
                  this.tableData = []
                  this.close('reloadMainGrid')
                }
              });
            } else {
              Swal.fire({
                title: result.message || 'Error please try again',
                text: '',
                icon: 'error',
                confirmButtonColor: '#336699',
                confirmButtonText: 'Ok'
              }).then((result: any) => {
                if (result.value) {
                  this.repairjewelleryreceiptFrom.reset()
                  this.tableData = []
                  this.close()
                }
              });
            }
          } else {
            this.toastr.error('Not deleted')
          }
        }, err => alert(err))
      this.subscriptions.push(Sub)
    }
  });
}

ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}
onRowDoubleClicked(e: any) {
  e.cancel = true;
  this.openRepairdetails(e.data);
}

openRepairdetails(data: any = null) {
  const modalRef: NgbModalRef = this.modalService.open(RepairDetailsComponent, {
    size: 'xl',
    backdrop: true,
    keyboard: false,
    windowClass: 'modal-full-width',
  });
  modalRef.componentInstance.receiptData = { ...data };


  modalRef.result.then((postData) => {
    if (postData) {
      console.log('Data from modal:', postData);
      this.handlePostData(postData);
    }
  });
}

handlePostData(postData: any) {
  const preItemIndex = this.repairDetailsData.findIndex((data: any) =>
    data.SRNO.toString() == postData.SRNO.toString()
  );
  postData.NET_TOTAL = (parseFloat(postData.AMOUNTFC) + parseFloat(postData.IGST_AMOUNTFC)).toFixed(2);

  if (postData?.isUpdate && preItemIndex !== -1) {
    this.repairDetailsData[preItemIndex] = postData;
  } else {
    this.repairDetailsData.push(postData);
  }

  console.log('Updated repairDetailsData', this.repairDetailsData);
  this.updateFormValuesAndSRNO()
}

updateFormValuesAndSRNO() {
  let sumCGST_AMOUNTCC = 0;
  let sumAMOUNTCC = 0;

  this.repairDetailsData.forEach((data, index) => {
    data.SRNO = index + 1;
    sumCGST_AMOUNTCC += parseFloat(data.IGST_AMOUNTCC);
    sumAMOUNTCC += parseFloat(data.TOTAL_AMOUNTCC);
  });

  let totalSum = sumCGST_AMOUNTCC + sumAMOUNTCC;
}

removeLineItemsGrid(e: any) {
  console.log(e.data)
  const values: any = []
  values.push(e.data.SRNO);
  let indexes: Number[] = [];
  this.repairDetailsData.reduce((acc, value, index) => {
    if (values.includes(parseFloat(value.SRNO))) {
      acc.push(index);
    }
    return acc;
  }, indexes);
  this.selectedIndexes = indexes;
  this.updateFormValuesAndSRNO();

}

onSelectionChanged(event: any) {
  const values = event.selectedRowKeys;
  let indexes: Number[] = [];
  this.repairDetailsData.reduce((acc, value, index) => {
    if (values.includes(parseFloat(value.SRNO))) {
      acc.push(index);
    }
    return acc;
  }, indexes);
  this.selectedIndexes = indexes;
}

}
