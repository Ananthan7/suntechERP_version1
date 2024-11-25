// import { DecimalPipe } from '@angular/common';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import * as FileSaver from "file-saver";
import { ToastrService } from 'ngx-toastr';
import * as XLSX from "xlsx";
import { EditReasonModel } from '../shared/data/edit-reason';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  // private chartDataSource = new BehaviorSubject<any>(null);

  // chartData$ = this.chartDataSource.asObservable();
  /** common variables and functions used in all components */
  private nextElSource = new Subject<any>();
  nextEl$ = this.nextElSource.asObservable();
  currentDate = new Date()
  branchCode: any = localStorage.getItem('userbranch') || '';
  userName: any = localStorage.getItem('username') || '';
  yearSelected: any = localStorage.getItem('YEAR') || '';
  menuTitle: any;
  menuName: any;
  componentName: any;
  queryParamAPI: any;
  //POS datas
  //service for ADD POS starts
  amtDecimals: any
  amtFormat: any
  mQtyFormat: any
  mQtyDecimals: any
  basePartyCode: any
  compCurrency: any
  popMetalValueOnNet: any
  FormatCount: any;
  enableJawahara: boolean = false;
  posIdNoCompulsory: boolean = false;
  compAcCode: any;
  EditDetail: EditReasonModel = {
    USERNAME: localStorage.getItem('username') || '',
    PASSWORD: '',
    REASON: '',
    DESCRIPTION: ''
  }
  public allMessageBoxData: any;
  public allCompanyParams: any;
  public allCompanyParameters: any;
  public baseUsername: any;
  public baseUserbranch: any;
  public baseYear: any;
  public allbranchMaster: any = localStorage.getItem('BRANCH_PARAMETER');
  public allBranchCurrency: any;
  public currencyRate: any;
  public divisionMasterList: any;
  public mastersList: any = [];
  public comboFilter: any = [];
  public countryMaster: any = [];
  public cityMaster: any = [];
  public nationalityMaster: any = [];
  public idMaster: any = [];
  public customerTypeMaster: any = [];
  public RateTypeMasterData: any = [];
  public LocationMasterData: any = [];
  public karatMasterData: any = [];
  public creditCardMasterData: any = [];
  public SalespersonMasterData: any = [];
  public VocTypeMasterData: any = [];
  private DECIMAL_CONSTANTS_FLAG: any = {};
  public reasonMasterList: any = [];
  screenSpecificPermissions: any;

  constructor(
    private route: ActivatedRoute,
    private _decimalPipe: DecimalPipe,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
  ) {
  }
  // FORM FEILD CALCULATIONS STARTS
  purityDiffCalculate(actualPureWt: any, newPureWt: any) {
    return (this.emptyToZero(actualPureWt) - (this.emptyToZero(newPureWt)))
  }
  pureWeightCalculate(netWeight: any, purity: any) {
    return (this.emptyToZero(netWeight) * (this.emptyToZero(purity)))
  }
  netWeightCalculate(grossWeight: any, stoneWeight: any) {
    return (this.emptyToZero(grossWeight) - (this.emptyToZero(stoneWeight)))
  }
  grossWtCalculate(MetalWeight: any, stoneWeight: any) {
    return (this.emptyToZero(MetalWeight) + (this.emptyToZero(stoneWeight) / 5))
  }
  balancePcsCalculate(METAL_FromPCS: any, METAL_ToPCS: any, METAL_ScrapPCS: any) {
    return (this.emptyToZero(METAL_FromPCS) - (this.emptyToZero(METAL_ToPCS) + this.emptyToZero(METAL_ScrapPCS)));
  }
  lossQtyCalculate(GROSS_WT: any, STD_LOSS: any) {
    let txtLossQty = ((this.emptyToZero(GROSS_WT) * this.emptyToZero(STD_LOSS)) / 100);
    txtLossQty = this.decimalQuantityFormat(txtLossQty, 'METAL')
    return this.emptyToZero(txtLossQty)
  }
  lossPercentageCalculate(LOSS_QTY: any, METAL_WT: any) {
    let LossPer = ((this.emptyToZero(LOSS_QTY) / this.emptyToZero(METAL_WT)) * 100);
    return this.emptyToZero(LossPer)
  }
  lossPureWtCalculate(lossQty: any, jobPurity: any) {
    let lossPureWt = (this.emptyToZero(lossQty) * this.emptyToZero(jobPurity));
    lossPureWt = this.decimalQuantityFormat(lossPureWt, 'METAL')
    return this.emptyToZero(lossPureWt)
  }
  // FORM FEILD CALCULATIONS ENDS

  getCurrencyRate(currencyCode: string) {
    let currdata = this.allBranchCurrency.filter((item: any) => item.CURRENCY_CODE == currencyCode)
    return this.setCommaSerperatedNumber(currdata[0].CONV_RATE, 'RATE')
  }
  getCurrencyCode() {
    let CURRENCY_CODE = this.getCompanyParamValue('COMPANYCURRENCY')
    return this.nullToString(CURRENCY_CODE)
  }
  searchStartsWithItemsInArray(array: any, searchValue: any) {
    // Convert the search value to lowercase for a case-insensitive search
    const lowerSearchValue = this.nullToString(searchValue).toLowerCase();

    return array.filter((item: any) => {
      // Iterate over all the keys of the object
      for (const key in item) {
        // Check if the property value startsWith the search value
        if (item[key].toString().toLowerCase().startsWith(lowerSearchValue)) {
          return true; // If found, return true
        }
      }
      return false; // If not found, return false
    });
  }
  searchAllItemsInArray(array: any, searchValue: any) {
    // Convert the search value to lowercase for a case-insensitive search
    const lowerSearchValue = this.nullToString(searchValue).toLowerCase();

    return array.filter((item: any) => {
      // Iterate over all the keys of the object
      for (const key in item) {
        // Check if the property value includes the search value
        if (item[key].toString().toLowerCase().includes(lowerSearchValue)) {
          return true; // If found, return true
        }
      }
      return false; // If not found, return false
    });
  }
  priceToTextWithCurrency(price: any, currency: any) {
    const parts = price.toFixed(2).split('.');
    const integerPart = Number(parts[0]);

    const decimalPart = parts[1] ? Number(parts[1]) : 0;
    const integerText = this.numberToWords(integerPart);
    const decimalText = decimalPart > 0 ? 'AND ' + this.numberToWords(decimalPart) : 'AND ZERO';
    return `${currency} ${integerText} ${decimalText} FILS ONLY`;
  }
  numberToWords(number: any) {
    //Validates the number input and makes it a string
    if (!number && number == 0) {
      return 'zero'
    }
    if (typeof number === 'string') {
      number = parseInt(number, 10);
    }
    if (typeof number === 'number' && !isNaN(number)) {
      number = number.toString(10);
    }

    //Creates an array with the number's digits and
    //adds the necessary amount of 0 to make it fully
    //divisible by 3
    var digits = number.split('');
    var digitsNeeded = 3 - (digits.length % 3);
    if (digitsNeeded !== 3) {
      //prevents this : (123) ---> (000123)
      while (digitsNeeded > 0) {
        digits.unshift('0');
        digitsNeeded--;
      }
    }

    //Groups the digits in groups of three
    var digitsGroup = [];
    var numberOfGroups = digits.length / 3;
    for (var i = 0; i < numberOfGroups; i++) {
      digitsGroup[i] = digits.splice(0, 3);
    }
    console.log(digitsGroup); //debug

    //Change the group's numerical values to text
    var digitsGroupLen = digitsGroup.length;
    var numTxt = [
      [
        null,
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
      ], //hundreds
      [
        null,
        'ten',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
      ], //tens
      [
        null,
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
      ], //ones
    ];
    var tenthsDifferent = [
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];

    // j maps the groups in the digitsGroup
    // k maps the element's position in the group to the numTxt equivalent
    // k values: 0 = hundreds, 1 = tens, 2 = ones
    for (var j = 0; j < digitsGroupLen; j++) {
      for (var k = 0; k < 3; k++) {
        var currentValue = digitsGroup[j][k];
        digitsGroup[j][k] = numTxt[k][currentValue];
        if (k === 0 && currentValue !== '0') {
          // !==0 avoids creating a string "null hundred"
          digitsGroup[j][k] += ' hundred ';
        } else if (k === 1 && currentValue === '1') {
          //Changes the value in the tens place and erases the value in the ones place
          digitsGroup[j][k] = tenthsDifferent[digitsGroup[j][2]];
          digitsGroup[j][2] = 0; //Sets to null. Because it sets the next k to be evaluated, setting this to null doesn't work.
        }
      }
    }

    //Adds '-' for grammar, cleans all null values, joins the group's elements into a string
    for (var l = 0; l < digitsGroupLen; l++) {
      if (digitsGroup[l][1] && digitsGroup[l][2]) {
        digitsGroup[l][1] += '-';
      }
      digitsGroup[l].filter(function (e: any) {
        return e !== null;
      });
      digitsGroup[l] = digitsGroup[l].join('');
    }

    //Adds thousand, millions, billion and etc to the respective string.
    var posfix = [
      null,
      'thousand',
      'million',
      'billion',
      'trillion',
      'quadrillion',
      'quintillion',
      'sextillion',
    ];
    if (digitsGroupLen > 1) {
      var posfixRange = posfix.splice(0, digitsGroupLen).reverse();
      for (var m = 0; m < digitsGroupLen - 1; m++) {
        //'-1' prevents adding a null posfix to the last group
        if (digitsGroup[m]) {
          // avoids 10000000 being read (one billion million)
          digitsGroup[m] += ' ' + posfixRange[m];
        }
      }
    }

    //Joins all the string into one and returns it
    return digitsGroup.join(' ');
  }

  getMenuList() {
    let item: any = localStorage.getItem('MENU_LIST')
    return JSON.parse(item)
  }
  showSnackBarMsg(MessageOrID: string) {
    let Msg = this.getMsgByID(MessageOrID)
    this.snackBar.open(Msg || MessageOrID, 'Close', {
      duration: 5000, // Duration in milliseconds (e.g., 3000 for 3 seconds)
      panelClass: ['custom-snackbar'],
    });
  }
  closeSnackBarMsg() {
    this.snackBar.dismiss()
  }
  //**USE: common fuction to show toaster By MsgId */
  toastErrorByMsgId(MsgOrId: string, Description?: string) {
    let msg = this.getMsgByID(MsgOrId)
    this.toastr.error(msg || MsgOrId, Description ? Description : '', {
      timeOut: 3000,
    })
  }
  toastSuccessByMsgId(MsgId: string, Description?: string) {
    this.toastr.success(this.getMsgByID(MsgId), Description ? Description : '', {
      timeOut: 3000,
    })
  }
  toastSuccessByText(Msg: string, Description?: string) {
    this.toastr.success(Msg, Description ? Description : '', {
      timeOut: 3000,
    })
  }
  toastInfoByMsgId(MsgId: string, Description?: string) {
    this.toastr.info(this.getMsgByID(MsgId) || MsgId, Description ? Description : '', {
      timeOut: 3000,
    })
  }
  validateNotEmpty(value: string, errorMessageId: string): boolean {
    if (!value || value == '') {
      this.toastErrorByMsgId(errorMessageId);
      return false;
    }
    return true;
  }
  //**USE: common fuction to get all company parameter values */
  getCompanyParamValue(parameter: string) {
    let value = this.allCompanyParameters ? this.allCompanyParameters[parameter] : ''
    if (value.toString().toUpperCase() == 'TRUE') value = true;
    if (value.toString().toUpperCase() == 'FALSE') value = false;
    if (value.toString() == '0') value = false;
    return value
  }
  getBranchParamValue(parameter: string) {
    let value = this.allbranchMaster ? this.allbranchMaster[parameter] : ''
    if (value.toString().toUpperCase() == 'TRUE') value = true;
    if (value.toString().toUpperCase() == 'FALSE') value = false;
    if (value.toString() == '0') value = false;
    return value
  }
  setCommaSerperatedNumber(value: any, decimal: any) {
    return this.commaSeperation(
      this.decimalQuantityFormat(
        this.emptyToZero(value), decimal)
    )
  }
  private initializeDecimalConstantsFlag() {
    // object contains flag for each decimal requirements any number missing add to this object
    this.DECIMAL_CONSTANTS_FLAG = {
      'AMOUNT': Number(this.allbranchMaster.BAMTDECIMALS),
      'METAL': Number(this.allbranchMaster.BMQTYDECIMALS),
      'STONE': Number(this.allbranchMaster.BSQTYDECIMALS),
      'PURITY': 6,
      'RATE': 6,
      'THREE': 3,
      'FOUR': 4,
      'METAL_RATE': Number(this.allCompanyParameters?.MRATEDECIMALS) || 0
    };
  }
  /**USE: common fuction to format the Number to limit decimal places from branch master */
  decimalQuantityFormat(value: any, flag: string) {
    this.initializeDecimalConstantsFlag();
    this.FormatCount = this.DECIMAL_CONSTANTS_FLAG[flag] ? this.DECIMAL_CONSTANTS_FLAG[flag] : 'METAL'

    value = Number(value).toFixed(this.FormatCount)

    let str = ''
    let x = 1
    while (x <= this.FormatCount) {
      str += '0'
      x++;
    }

    if (value == '' || value == 0) {
      value = `${0}.${str}`;
    }

    // Split the value into integer and fractional parts
    const parts = value.toString().split('.');
    let integerPart = parts[0];
    let fractionalPart = parts[1];


    if (!fractionalPart) {
      fractionalPart = ''
      fractionalPart += str;
    }
    // Limit the fractional part to 3 decimal places
    if (fractionalPart.length > this.FormatCount) {
      fractionalPart = fractionalPart.slice(0, this.FormatCount);
    }
    let strzero = ''
    let count = 1
    let addedzero = (this.FormatCount) - (fractionalPart.length)
    while (count <= addedzero) {
      strzero += '0'
      count++;
    }
    if (fractionalPart && this.FormatCount > fractionalPart.length) {
      fractionalPart += strzero;
    }
    // Reconstruct the value and set it back to the input field
    value = `${integerPart}.${fractionalPart}`;
    // this.el.nativeElement.value = value;
    return value
  }
  convertTimeMinutesToDHM(param: any) {
    let time = this.emptyToZero(param)
    const daysTime = Math.floor(time / 24 / 60);
    const hoursTime = Math.floor(time / 60 % 24);
    const minutesTime = Math.floor(time % 60);
    return daysTime.toString().padStart(2, '0') + ":" + hoursTime.toString().padStart(2, '0') + ':' + minutesTime.toString().padStart(2, '0');
  }
  getTime() {
    // Get the current time components
    let hours = this.currentDate.getHours();
    let minutes = this.currentDate.getMinutes();
    let seconds = this.currentDate.getSeconds();
    // Determine if it's AM or PM
    let amPm = hours >= 12 ? 'PM' : 'AM';
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;
    // Format the time components as a string
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} ${amPm}`;
    // return `${hours}:${minutes}:${seconds}`;
  }
  //common Number validation
  isNumeric(event: any) {
    var keyCode = event.which ? event.which : event.keyCode;
    var isValid = (keyCode >= 48 && keyCode <= 57) || keyCode === 8 || keyCode === 46;
    return isValid;
  }
  //service for ADD POS starts
  stringToBoolean = (input: string | boolean) => {
    if (typeof input === 'boolean') {
      return input;
    }
    return input !== undefined && input !== null
      ? input.toString().toLowerCase() === 'false' ? false : true
      : false;
  };

  numberToBoolean = (num: number) => num != undefined && num != null ? num === 0 ? false : true : false;

  formControlSetReadOnly(id: any, isReadonly: boolean) {
    const ele: any = document.getElementById(id);
    if (ele != null && ele != undefined)
      ele.readOnly = isReadonly;
    // (<any>formControl).nativeElement.readonly = isReadonly;
  }
  formControlSetReadOnlyByClass(className: any, isReadonly: boolean) {
    const ele: any = document.getElementsByClassName(className);
    if (ele != null && ele != undefined)
      for (let i = 0; i < ele.length; i++) {
        ele[i].readOnly = isReadonly;
      }
  }
  // convert date to mm-dd-yyy format
  convertDateToMDY(data: any) {
    if (data != '' && data != null) {
      const date = new Date(data);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
      return formattedDate;
    } else {
      return '';
    }

  }
  getCurrRate(currency: any) {
    const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE == currency);
    return result.length > 0 ? result[0]?.CONV_RATE : 0;
  }
  // CCToFC(currency: any, amount: any, rate: any = null) {
  //   console.log(this.allBranchCurrency);
  //   rate = rate || this.getCurrRate(currency);
  //   currency = currency;
  //   rate = typeof (rate) == 'number' ? this.emptyToZero(rate) : this.emptyToZero(rate);
  //   amount = typeof (amount) == 'number' ? this.emptyToZero(amount) : this.emptyToZero(amount);
  //   let convertedAmount = 0;
  //   const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE == currency);
  //   console.log('=====cctofc===============================');
  //   console.log(result);
  //   console.log('====================================');
  //   if (result[0].MUL_DIV == 'M') {
  //     convertedAmount = amount / rate;
  //     return convertedAmount;
  //   } else {
  //     convertedAmount = amount * rate;
  //     return convertedAmount;
  //   }
  // }
  CCToFC(currency: any, amount: any, rate: any = null) {
    console.log(this.allBranchCurrency);

    // Ensure rate is set, either from the argument or by fetching it
    rate = rate !== null ? rate : this.getCurrRate(currency);

    // Ensure amount and rate are numbers and convert empty values to zero
    // rate = this.emptyToZero(rate);
    // amount = this.emptyToZero(amount);

    let convertedAmount = 0;

    // Filter the currency data for the given currency code
    const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE === currency);
    console.log('=====cctofc===============================');
    console.log(result);
    console.log('====================================');

    // Check if the currency data was found and perform the conversion
    if (result.length > 0) {
      if (result[0].MUL_DIV === 'M') {
        convertedAmount = this.emptyToZero(amount) / this.emptyToZero(rate);
      } else {
        convertedAmount = this.emptyToZero(amount) * this.emptyToZero(rate);
      }
    } else {
      console.error('Currency not found');
    }

    return convertedAmount;
  }

  // CCToFC(currency: any, amount: any) {

  //   let rate = this.getCurrRate(currency);
  //   currency = currency;
  //   rate = typeof (rate) == 'number' ? this.emptyToZero(rate) : this.emptyToZero(rate);
  //   amount = typeof (amount) == 'number' ? this.emptyToZero(amount) : this.emptyToZero(amount);
  //   let convertedAmount = 0;
  //   const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE == currency);
  //  console.log('=========cctofc result===========================');
  //  console.log(result, rate);
  //  console.log('====================================');
  //   if (result[0].MUL_DIV == 'M') {
  //     convertedAmount = amount / rate;
  //     return convertedAmount;
  //   } else {
  //     convertedAmount = amount * rate;
  //     return convertedAmount;
  //   }
  // }
  // Transform number to decimal

  transformDecimalVB(format: any, num: any) {
    // alert((42385.6075).toFixed(1))
    // alert(`${num} - ${parseFloat(num).toFixed(format)}`);

    const formatVal = `1.${format}-${format}`;
    // console.log('formatVal',formatVal, 'num',num);
    var val: any = this._decimalPipe.transform(this.emptyToZero(num) || 0, formatVal);
    // console.log(val);
    val = val.includes(',') ? val.replaceAll(',', '') : val;
    // console.log(val);

    // alert(this._decimalPipe.transform(num, formatVal));
    return parseFloat(val).toFixed(format);
    // return parseFloat(num).toFixed(format);
    // return parseFloat( parseFloat(num).toFixed(format));
  }

  addCommaSepration(data: any) {
    if (data === null || data === undefined) {
      data = 0;
    }

    let number = '';
    data = data.toString().replace(/,/g, '');

    if (data.includes('.')) {
      let parts = data.split('.');
      data = parts[0];
      number = Number(data).toLocaleString('en-US', { style: 'decimal' });
      number = number + '.' + parts[1];
    } else {
      number = Number(data).toLocaleString('en-US', { style: 'decimal' });
    }

    return number;
  }



  FCToCC(currency: any, amount: any, rate: any = null) {
    rate = rate || this.getCurrRate(currency);
    currency = currency;
    rate = typeof (rate) == 'number' ? rate : rate;
    amount = typeof (amount) == 'number' ? amount : this.emptyToZero(amount);

    let convertedAmount = 0;

    const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE == currency);
    console.log('=====fctocc result===============================');
    console.log(result, rate);
    console.log('====================================');
    if (result[0].MUL_DIV == 'M') {
      convertedAmount = amount * rate;
      // console.log("This Multiple Amount : " +convertedAmount);
      return this.transformDecimalVB(this.amtDecimals, convertedAmount);
    } else {
      convertedAmount = amount / rate;
      // console.log("This Division Amount : " + convertedAmount);
      return this.transformDecimalVB(this.amtDecimals, convertedAmount);
    }
    // if (result[0].MUL_DIV == 'M') {
    //   convertedAmount = amount / rate;
    //   return this.transformDecimalVB(this.amtDecimals, convertedAmount);
    // } else {
    //   convertedAmount = amount * rate;
    //   return this.transformDecimalVB(this.amtDecimals, convertedAmount);
    // }
  }
  // FCToCC(currency: any, amount: any) {
  //   let rate = this.getCurrRate(currency);
  //   currency = currency;
  //   rate = typeof (rate) == 'number' ? rate : rate;
  //   amount = typeof (amount) == 'number' ? amount : this.emptyToZero(amount);

  //   let convertedAmount = 0;

  //   const result = this.allBranchCurrency.filter((data: any) => data.CURRENCY_CODE == currency);
  //   console.log('=====fctocc result===============================');
  //   console.log(result, rate);
  //   console.log('====================================');
  //   if (result[0].MUL_DIV == 'M') {
  //     convertedAmount = amount / rate;

  //     return this.transformDecimalVB(this.amtDecimals, convertedAmount);
  //   } else {
  //     convertedAmount = amount * rate;
  //     return this.transformDecimalVB(this.amtDecimals, convertedAmount);
  //   }
  // }

  setCompParaValues() {
    this.allCompanyParams.map((data: any) => {
      if (data.PARAMETER == 'AMTFORMAT')
        this.amtFormat = data.PARAM_VALUE;
      if (data.PARAMETER == 'MQTYFORMAT')
        this.mQtyFormat = data.PARAM_VALUE;
      if (data.PARAMETER == 'AMTDECIMALS') {
        this.amtDecimals = data.PARAM_VALUE;
      }
      if (data.PARAMETER == 'MQTYDECIMALS')
        this.mQtyDecimals = data.PARAM_VALUE;
      if (data.PARAMETER == 'POSSHOPCTRLAC')
        this.basePartyCode = data.PARAM_VALUE;

      if (data.PARAMETER == 'COMPANYCURRENCY') {
        this.compCurrency = data.PARAM_VALUE;
      }
      // for jawahara
      if (data.PARAMETER == 'SCRAPMGMTMODULE') {
        this.enableJawahara = data.PARAM_VALUE.toString() == '1' ? true : false;
      }
      if (data.PARAMETER == 'POSIDNOCOMPULSORY') {
        this.posIdNoCompulsory = data.PARAM_VALUE.toString() == '1' ? true : false;
      }
      if (data.PARAMETER == 'COMPACCODE') {
        this.compAcCode = data.PARAM_VALUE.toString();
      }
      if (data.Parameter == 'POSKARATRATECHANGE') {
        this.posKARATRATECHANGE = data.Param_Value;
        if (this.posKARATRATECHANGE.toString() == '0') {
          this.formControlSetReadOnlyByClass('karat_code', true);
        }
      }

      if (data.PARAMETER == 'POPMETALVALUEONNET') {
        this.popMetalValueOnNet = data.PARAM_VALUE;
      }
    });
  }

  // Get Combo filter(selectbox) data by id
  getComboFilterByID(type: any) {
    type = type.trim();
    const res = this.comboFilter.filter((data: any) => data.COMBO_TYPE.toString().toLowerCase() == type.toString().toLowerCase())
    return res;
  }
  posKARATRATECHANGE: any = '';

  getDivisionMS(division: any) {
    return this.divisionMasterList.filter((data: any) => data.DIVISION_CODE == division)[0].DIVISION;
  }
  Null2BitValue(value: any): boolean {
    value = value.toString().trim();
    // if (value == null || value.toString() == '' || value.toString().toUpperCase().trim() == "FALSE" || value.toString() == "0") {
    if (value.toString() == '') {
      return false;
    } else if (value.toString().toUpperCase().trim() == "FALSE" || value.toString() == "0") {
      return false;
    } else {
      return true;
    }
  }

  emptyToZero(value: any) {
    // Check if value is an object
    if (typeof value === 'object' && !Array.isArray(value)) {
      return 0; // Return 0 if value is an object
    }
    // Check if value is an array
    if (Array.isArray(value)) {
      return 0; // Return 0 if value is an array
    }
    if (value) {
      value = value.toString().replace(/,/g, '');
    }
    value = typeof (value) == 'number' || !value ? value : value.toString().trim();
    // if (value == null || value.toString() == '' || value == undefined || value == 'NaN') {
    if (value == '' || !value) {
      return 0;
    } else {
      return parseFloat(value);
    }
  }

  nullToString(value: any) {
    value = !value || typeof value == 'object' ? '' : value.toString();
    return value
  }

  timeToMinutes(timeString: string, days?: any) {
    if (this.nullToString(timeString) == '') return ''
    // Split the time string into hours and minutes
    let timeComponents = timeString.split(':');

    // Parse hours and minutes from the split components
    let hours = parseInt(timeComponents[0], 10);
    let minutes = parseInt(timeComponents[1], 10);

    // Convert hours and minutes to total minutes
    let totalMinutes = hours * 60 + minutes;

    if (Number(days)) {
      let totalDaysToMinutes = Number(days) * 24
      totalDaysToMinutes = totalDaysToMinutes * 60

      totalMinutes = totalMinutes + totalDaysToMinutes
    }
    return totalMinutes;
  }
  MinutesToHours(minutes: number) {
    // Get the input element value
    var minutes = Number(minutes);

    // Calculate hours, minutes, and seconds
    var hours = Math.floor(minutes / 60);
    var remainingMinutes = minutes % 60;
    var seconds = 0; // Assuming seconds are always zero for simplicity

    // Format hours, minutes, and seconds
    var formattedTime = (hours < 10 ? '0' : '') + hours + ':' +
      (remainingMinutes < 10 ? '0' : '') + remainingMinutes + ':' +
      (seconds < 10 ? '0' : '') + seconds;

    // Display the result in the time input
    return formattedTime;
  }
  timeToHHMMSS(timeString: string): string {
    if (this.nullToString(timeString) === '') {
      return '';
    }

    // Split the time string into hours and minutes
    const timeComponents = timeString.split(':');

    // Parse hours, minutes, and seconds from the split components
    const hours = parseInt(timeComponents[0], 10);
    const minutes = parseInt(timeComponents[1], 10);
    const seconds = parseInt(timeComponents[2], 10) || 0; // Assume 0 seconds if not provided

    // Format hours, minutes, and seconds into "hh:mm:ss"
    const formattedTime = `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
    return formattedTime;
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }




  // Get Messages by id
  getMsgByID(id: any) {
    id = id.trim();
    const res = this.allMessageBoxData?.filter((data: any) => data.MSG_ID == id)
    if (res != null && res[0])
      return res[0].MSG_ENGLISH;
    else
      return '';
  }
  enforceMinMax(el: any) {
    if (el.value != '') {

      if (parseFloat(el.value) < parseFloat(el.min) && el.min != '') {
        el.value = el.min;
      }
      if (
        parseFloat(el.value) >
        parseFloat(el.max) && el.max != ''
      ) {
        el.value = el.max;
      }
      if (el.value.length > el.maxLength && el.maxLength != -1) {
        el.value = el.value.slice(0, el.maxLength);
      }
    } else {
      // el.value = el.value.slice(el.val.toString().length, 1);
    }
    return true;
  }
  //service for ADD POS ends

  //use: to get menu ModuleName from queryParams
  getModuleName() {
    this.route.queryParams.subscribe((data: any) => {
      this.menuName = data.subMenuName;
    });
    return this.menuName
  }
  //use: to get menu ModuleName from queryParams
  getFormComponentName() {
    this.route.queryParams.subscribe((data: any) => {
      this.componentName = data.component;
    });
    return this.componentName
  }
  //use: to get menu title from queryParams
  getTitleName() {
    this.route.queryParams.subscribe((data: any) => {
      this.menuTitle = data.modulename;
    });
    return this.menuTitle
  }
  getqueryParamAPI() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.ctrl;
    });
    return queryParamAPI
  }
  getqueryParamTable() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.tableName;
    });
    return queryParamAPI
  }
  getSubmoduleType() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.menuSubModule;
    });
    return queryParamAPI
  }
  getqueryParamVocType() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.VocType;
    });
    return queryParamAPI
  }
  getqueryParamMainVocType() {
    let queryParamAPI
    this.route.queryParams.subscribe((data: any) => {
      queryParamAPI = data.mainVocType;
    });
    return queryParamAPI
  }

  getAutopostingFlag() {
    let autoPostingFlag
    this.route.queryParams.subscribe((data: any) => {
      autoPostingFlag = data.autoPosting;
    });
    // return false; // hardcoded for discussion on 07-05-2024
    return this.Null2BitValue(autoPostingFlag)
  }
  generateNumber() {
    return Math.floor(1000 + Math.random() * 9000)
  }
  /**USE: to get create dynamic colors */
  dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
  };

  /**Apex chart chart settings */
  myChart(ctx: any, arg1: string, labels: string[], cfg: { type: string; data: { datasets: { data: { Sales: number; Taarget: number; PreviousYear: number; }; }[]; }; }, colors: string[], arg5: string): any {
    throw new Error('Method not implemented.');
  }
  /**Apex chart chart settings */
  // drawChart(divClass: any, graphType: any, labels: any, values: any, colors: any, labelTips: any) {
  //   let options = { indexAxis: 'y', responsive: true, legend: {}, scales: {}, plugins: {} };
  //   options.legend = {
  //     align: "start",
  //     position: "bottom",
  //   }
  //   if (graphType == 'pie') {
  //     labelTips = '';
  //   } else {
  //     options.plugins = {
  //       legend: {
  //         display: true,
  //         position: 'bottom',
  //       }
  //     }
  //     options.scales = {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }

  //     // colors = colors[0]
  //   }

  //   const myChart = new Chart(divClass, {
  //     type: graphType,
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         label: labelTips,
  //         data: values,
  //         backgroundColor: colors,
  //         borderColor: colors,
  //         borderWidth: 1
  //       }]
  //     },
  //     options: options
  //   });

  //   return myChart;
  // }
  /**Apex chart settings to create chart */
  // createChart(divClass: any, graphType: any, labels: any, values: any, colors: any, labelTips: any) {
  //   let options = { indexAxis: 'y', responsive: true, legend: {}, scales: {}, plugins: {} };
  //   options.legend = {
  //     align: "start",
  //     position: "bottom",
  //   }
  //   if (graphType == 'pie') {
  //     labelTips = '';
  //   } else {
  //     options.plugins = {
  //       legend: {
  //         display: true,
  //         position: 'bottom',
  //       }
  //     }
  //     options.scales = {
  //       y: {
  //         beginAtZero: true
  //       }
  //     }

  //     // colors = colors[0]
  //   }

  //   const myChart = new Chart(divClass, {
  //     type: graphType,
  //     data: {
  //       labels: labels,
  //       datasets: [{
  //         label: labelTips,
  //         data: values,
  //         backgroundColor: colors,
  //         borderColor: colors,
  //         borderWidth: 1
  //       }]
  //     },
  //     options: options
  //   });

  //   return myChart;
  // }

  padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }
  isValidDDMMYYYY(input: any) {
    // Regex to match DD-MM-YYYY format
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

    return regex.test(input);
  }
  isValidDDMMYYYY2(input: any) {
    // Regex to match DD/MM/YYYY format
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    return regex.test(input);
  }
  convertToDate(dateStr: any) {
    let date: any
    let flg = this.isValidDDMMYYYY2(dateStr)
    if (this.isValidDDMMYYYY(dateStr)) {
      // Split the input date string (DD-MM-YYYY) into day, month, and year
      const [day, month, year] = dateStr.split('-').map(Number);
      date = new Date(year, month - 1, day);
      return date;
    } else if (this.isValidDDMMYYYY2(dateStr)) {
      // Split the input date string (DD-MM-YYYY) into day, month, and year
      const [day, month, year] = dateStr.split('/').map(Number);
      date = new Date(year, month - 1, day);
      return date;
    } else {
      return date = new Date(dateStr)
    }
  }
  /**purpose: format date */
  formatDate(date: any) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }
  /**purpose: date in order format dd-mm-yy */
  formatDDMMYY(date: any) {
    date = this.convertToDate(date)
    let day = date.getDate()
    let month = (date.getMonth() > 9 ? date.getMonth() : date.getMonth()) + 1;
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  /**purpose: date in order format yyyy-mm-dd */
  formatYYMMDD(date: any) {
    date = this.convertToDate(date)
    let day = date.getDate()
    let month = (date.getMonth() > 9 ? date.getMonth() : date.getMonth()) + 1;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  /**purpose: date in order format dd-mm-yy */
  formatMMDDYY(date: any) {
    date = this.convertToDate(date)
    let day = date.getDate()
    let month = (date.getMonth() > 9 ? date.getMonth() : date.getMonth()) + 1;
    let year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }
  /**purpose: Get a date time as a string, using the ISO standard*/
  formatDateTime(date: any) {
    if (!date) return '';
    date = this.convertToDate(date)
    if (this.isDate(date)) {
      return date.toISOString()
    }
    return new Date(date).toISOString()
  }
  isDate(value: any): boolean {
    return value instanceof Date;
  }
  parseDateString(dateStr: string): Date {
    // Split the date and time parts
    const [datePart, timePart] = dateStr.split(' ');

    // Split the date into DD/MM/YYYY
    const [day, month, year] = datePart.split('/').map(Number);

    // Combine the parts and create a new Date object
    return new Date(year, month - 1, day, ...this.timePartTo24Hour(timePart));
  }

  // Helper function to convert time from 12-hour to 24-hour format
  timePartTo24Hour(timeStr: string): [number, number, number] {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes, seconds] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return [hours, minutes, seconds];
  }
  /**purpose: to format number with M,K values(eg: 1k,2M) */
  numberFormatter(value: any) {
    if (value >= 1000000) {
      // Convert to millions
      const millions = value / 1000000;
      const decimalPlaces = 2
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(millions * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "M";
    } else if (value >= 1000) {
      // Convert to thousands
      const thousands = value / 1000;
      const decimalPlaces = 1
      const multiplier = Math.pow(10, decimalPlaces);
      const roundedValue = Math.floor(thousands * multiplier) / multiplier;
      return roundedValue.toFixed(decimalPlaces) + "K";
    }
    return value.toString();
  }

  /**purpose: to find average of array */
  avgOfArray(arr: any) {
    const average = arr.reduce((a: number, b: number) => a + b, 0) / arr.length;
    return average
  }

  /**purpose: to find sum of array */
  sumArray(array: any) {
    let sum = 0;
    array.forEach((item: any) => {
      sum += item;
    });
    return Math.trunc(sum);
  }
  arrayEmptyObjectToString(dataArray: any) {
    dataArray.forEach((obj: any, i: any) => {
      // obj.Id = i + 1;
      for (const prop in obj) {
        if (typeof obj[prop] === 'object' && Object.keys(obj[prop]).length === 0) {
          // Replace empty object with an empty string
          obj[prop] = '';
        }
        if (typeof obj[prop] === 'boolean') {
          obj[prop] = obj[prop] ? 'Y' : 'N';
        }
      }
    });
    return dataArray
  }
  addDaysToDate(startDate: any, daysToAdd: any) {
    const currentDate = new Date(startDate); // Create a Date object from the given date
    const futureDate = new Date(currentDate.getTime() + Number(daysToAdd) * 24 * 60 * 60 * 1000); // Add days in milliseconds
    return futureDate;
  }
  addMonthsToDate(startDate: any, numberOfMonths: number) {
    const endDate = new Date(startDate);
    const newMonth = startDate.getMonth() + numberOfMonths;

    // Adjust for cases where adding/subtracting months might affect the year
    endDate.setMonth(newMonth);
    // If the new month is greater than 11 (December), we need to adjust the year
    if (newMonth > 11) {
      const yearDiff = Math.floor(newMonth / 12);
      endDate.setFullYear(startDate.getFullYear() + yearDiff);
      endDate.setMonth(newMonth % 12); // Set the month back to 0-based index
    }

    return endDate;
  }
  addWeeksToDate(startDate: Date, numberOfWeeks: number) {
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + numberOfWeeks * 7);
    return endDate;
  }

  commaSeperation(data: any) {
    // Guard clause to return early for invalid data
    if (data === null || data === undefined || data === '') {
      return '0'; // Return '0' or handle null/undefined as per your needs
    }

    let number = '';

    // Remove commas and ensure the data is a valid number
    data = data.toString().replace(/,/g, '');

    try {
      if (!isNaN(data)) {  // Check if data is a valid number
        if (data.includes('.')) {
          let parts = data.split('.');
          data = parts[0];

          number = Number(data).toLocaleString('en-US', { style: 'decimal' });
          number = number + '.' + parts[1];
        } else {
          number = Number(data).toLocaleString('en-US', { style: 'decimal' });
        }
      } else {
        console.error('Invalid number format:', data); // Log invalid data once
      }
    } catch (error) {
      console.error('Error occurred with value:', data, error); // Log error
      throw error;  // Optionally re-throw the error if necessary
    }

    return number;
  }



  calculateDateDifference(userDateValue: any) {
    const userDate: any = new Date(userDateValue);
    const currentDate: any = new Date();
    const differenceInMilliseconds = userDate - currentDate;

    if (differenceInMilliseconds < 0) {
      return 'Invalid Date';
    } else {
      const daysDifference = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      return daysDifference;
    }
  }
  /**purpose: to find grossmargin percentage
   * in: GM and Revenue arrays
   * out: gm % value
   */
  getGMPercentage(grossMarginArray: any, revArray: any) {
    let data: any = this.sumArray(grossMarginArray) / this.sumArray(revArray) * 100
    data = Math.trunc(data)
    return data
  }
  /**purpose: calculation of COGS */
  getCOGSvalue(grossMarginArray: any, revArray: any) {
    let data: any = this.sumArray(revArray) - this.sumArray(grossMarginArray)
    data = Math.trunc(data)
    return data
  }
  /**purpose: calculation of COGS */
  getAvgSellPrice(revArray: any, QtySoldArray: any) {
    let data: any = this.sumArray(revArray) / this.sumArray(QtySoldArray)
    data = Math.trunc(data)
    return data
  }
  /** 
   * purpose: export array of data to excelsheet 
   * in: data=[{key:value}]
   * out: excelsheet
  */
  exportExcel(data: any, excelName: string) {
    const EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
      Sheets: {
        testingSheet: ws,
      },
      SheetNames: ["testingSheet"],
    };
    const excelbuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blobData = new Blob([excelbuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(blobData, excelName);
  }

  convertDateWithTimeZero(date: any) {
    return date.split('T')[0] + 'T00:00:00.000Z';
  }

  cDateFormat(value: any) {
    if (typeof value === 'string' && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
      const [day, month, year] = value.split('-').map(Number);
      value = new Date(year, month - 1, day);
    }
    return this.datePipe.transform(value, 'yyyy-MM-ddTHH:mm:ss');
  }

  // cDateFormat(value: any) {
  //   return this.datePipe.transform(value, 'yyyy-MM-ddTHH:mm:ss');
  // }

  validateEmail(email: any) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }
  getVoctypeMasterByVocTypeMain(branch: string, voctype: string, mainVocType: string) {
    const res = this.VocTypeMasterData.filter((data: any) =>
      data.BRANCH_CODE == branch && data.VOCTYPE == voctype && data.MAIN_VOCTYPE == mainVocType
    );
    if (res.length > 0) {
      return res[0];
    }
    return null;
  }
  getVoctypeMasteMinDate() {
    const res = this.VocTypeMasterData.filter((data: any) =>
      data.BRANCH_CODE == this.branchCode && data.VOCTYPE == this.getqueryParamVocType()
      && data.MAIN_VOCTYPE == this.getqueryParamMainVocType()
    );
    if (res.length > 0) {
      return res[0].BLOCKBACKDATEDENTRIES ? new Date() : null;
    }
    return null;
  }
  getVoctypeMasterMaxDate() {
    const res = this.VocTypeMasterData.filter((data: any) =>
      data.BRANCH_CODE == this.branchCode && data.VOCTYPE == this.getqueryParamVocType()
      && data.MAIN_VOCTYPE == this.getqueryParamMainVocType()
    );
    if (res.length > 0) {
      return res[0].BLOCKFUTUREDATE ? new Date() : null;
    }
    return null;
  }
  getVoctypeMasterLockVoucher(): boolean {
    const res = this.VocTypeMasterData.filter((data: any) =>
      data.BRANCH_CODE == this.branchCode && data.VOCTYPE == this.getqueryParamVocType()
      && data.MAIN_VOCTYPE == this.getqueryParamMainVocType()
    );
    if (res.length > 0) {
      return this.Null2BitValue(res[0].LOCKVOUCHERNO);
    }
    return true;
  }
  dataSplitPop(data: any) {
    // const result = data.split('');
    // result.shift();
    // result.pop();

    // let heightValue = result.join("");
    // return heightValue;
    const cleanedData = data.replace(/[^0-9.-]+/g, '');
    return cleanedData;
  }



  catchSubscribeHeaderMenu(nextEl: any) {
    this.nextElSource.next(nextEl);
  }

  // setChartData(data: any) {
  //   this.chartDataSource.next(data);
  // }

  // getChartData() {
  //   return this.chartDataSource.value;
  // }

  // decimalPoints(data: any, decimalPoints: any){
  //   return Number(data.value).toFixed(decimalPoints);
  // }
}
