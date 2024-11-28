import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-stone-details',
  templateUrl: './stone-details.component.html',
  styleUrls: ['./stone-details.component.scss']
})
export class StoneDetailsComponent implements OnInit {
  subscriptions: any;
  @Input() content!: any;
  @Input() tablecount :any;
  tableData: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;

  @ViewChild('StockcodeDescodeSearch') StockcodeDescodeSearch!: MasterSearchComponent;
  @ViewChild('ShapecodecodeSearch') ShapecodecodeSearch!: MasterSearchComponent;
  @ViewChild('sieveSetcodeSearch') sieveSetcodeSearch!: MasterSearchComponent;
  @ViewChild('sievecodeSearch') sievecodeSearch!: MasterSearchComponent;
  @ViewChild('priceCodeSearch') priceCodeSearch!: MasterSearchComponent;
  @ViewChild('stoneTypeCodeSearch') stoneTypeCodeSearch!: MasterSearchComponent;
  @ViewChild('stockRefCodeSearch') stockRefCodeSearch!: MasterSearchComponent;
  @ViewChild('ColorCodeSearch') ColorCodeSearch!: MasterSearchComponent;
  @ViewChild('ClarityCodeSearch') ClarityCodeSearch!: MasterSearchComponent;
  @ViewChild('SizeCodeSearch') SizeCodeSearch!: MasterSearchComponent;
  @ViewChild('labourCodeSearch') labourCodeSearch!: MasterSearchComponent;


  
  
  
  
  

  
  
  
  

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    console.log(this.tableData)
  }

  enterStoneDetailsForm: FormGroup = this.formBuilder.group({
    Stockcode: [''],
    StockcodeDes: [''],
    sieveSet: [''],
    sieve: [''],
    Shapecode: [''],
    priceCode: [''],
    stoneTypeCode: [''],
    ColorCode: [''],
    ClarityCode: [''],
    SizeCode: [''],
    labourCode: [''],
    stockRefCode: [''],
    karat:[''],
    karatRate:[''],
    labourRate:[''],
    labourAmt:[''],
    currency:[''],
    currencyRate:[''],
    amountLC:[''],
    amountFC:[''],
    percentage:[''],
    sellingPriceLC:[''],
    sellingPriceFC:[''],
    certRef:[''],
    pieces:[''],
  });


  StockcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "STOCK_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  StockcodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.Stockcode.setValue(value.STOCK_CODE);
    this.enterStoneDetailsForm.controls.StockcodeDes.setValue(value.DESCRIPTION);
  }

  ShapecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Shape',
    SEARCH_VALUE: '',
    WHERECONDITION: "types='SHAPE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ShapecodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.Shapecode.setValue(value.CODE);
  }

  sieveSetcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Set Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sieveSetcodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.sieveSet.setValue(value.CODE);
  }

  sievecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Sieve Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIEVE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  sievecodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.sieve.setValue(value.CODE);
  }

  priceCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 82,
    SEARCH_FIELD: 'PRICE_CODE',
    SEARCH_HEADING: 'Price Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "PRICE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  priceCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.priceCode.setValue(value.PRICE_CODE);
  }

  // stoneTypeCodeData: MasterSearchModel = {
  //   PAGENO: 1,
  //   RECORDS: 10,
  //   LOOKUPID: 23,
  //   SEARCH_FIELD: 'CODE',
  //   SEARCH_HEADING: 'Stone Type Code',
  //   SEARCH_VALUE: '',
  //   WHERECONDITION: "CODE<> ''",
  //   VIEW_INPUT: true,
  //   VIEW_TABLE: true,
  // }
  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "types = 'STONE TYPE MASTER' ORDER BY CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  stoneTypeCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.stoneTypeCode.setValue(value.CODE);
  }

  stockRefCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'StockRef Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stockRefCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.stockRefCode.setValue(value.CODE);
  }

  ColorCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color Code',
    SEARCH_VALUE: '',
    WHERECONDITION:  "TYPES = 'color master'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ColorCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.ColorCode.setValue(value.CODE);
  }

  ClarityCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 37,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Clarity Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ClarityCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.ClarityCode.setValue(value.CODE);
  }

  SizeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Size Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'SIZE MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  SizeCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.SizeCode.setValue(value.CODE);
  }

  labourCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 99,
    SEARCH_FIELD: 'Code',
    SEARCH_HEADING: 'labour Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "Code<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  labourCodeSelected(value: any) {
    console.log(value);
    this.enterStoneDetailsForm.controls.labourCode.setValue(value.Code);
  }

  close(data?: any) {
    //TODO reset forms and data before
    console.log(data);
    
    this.activeModal.close(data);
  }



  formSubmit(){
    this.tablecount += 1;
 
    const postData = {
      UNIQUEID: 0,
          SRNO: this.tablecount,
          METALSTONE: "",
          DIVCODE: "",
          KARAT:   this.commonService.nullToString(this.enterStoneDetailsForm.value.karat),
          CARAT:   this.commonService.emptyToZero(this.enterStoneDetailsForm.value.karatRate),
          GROSS_WT: 0,
          PCS: this.commonService.emptyToZero(this.enterStoneDetailsForm.value.pieces),
          RATE_TYPE: this.commonService.nullToString(this.enterStoneDetailsForm.value.currencyRate),
          CURRENCY_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.currency),
          RATE: 0,
          AMOUNTFC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.amountFC),
          AMOUNTLC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.amountLC),
          MAKINGRATE: 0,
          MAKINGAMOUNT: 0,
          COLOR:  this.commonService.nullToString(this.enterStoneDetailsForm.value.ColorCode),
          CLARITY:  this.commonService.nullToString(this.enterStoneDetailsForm.value.ClarityCode),
          SIEVE: this.commonService.nullToString(this.enterStoneDetailsForm.value.sieve),
          SHAPE: this.commonService.nullToString(this.enterStoneDetailsForm.value.Shapecode),
          TMPDETSTOCK_CODE: "",
          DSIZE:  this.commonService.nullToString(this.enterStoneDetailsForm.value.SizeCode),
          LABCHGCODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.labourAmt),
          PRICECODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.priceCode),
          DESIGN_CODE: "",
          DETLINEREMARKS: "",
          MFTSTOCK_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.Stockcode),
          STOCK_CODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.StockcodeDes),
          METALRATE: 0,
          LABOURCODE: this.commonService.nullToString(this.enterStoneDetailsForm.value.labourCode),
          STONE_TYPE:  this.commonService.nullToString(this.enterStoneDetailsForm.value.stoneTypeCode),
          STONE_WT: 0,
          NET_WT: 0,
          LOT_REFERENCE: "",
          INCLUDEMETALVALUE: true,
          FINALVALUE: 0,
          PERCENTAGE: this.commonService.emptyToZero(this.enterStoneDetailsForm.value.percentage),
          HANDLING_CHARGEFC: 0,
          HANDLING_CHARGELC: 0,
          PROCESS_TYPE: "",
          SELLING_RATE:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.sellingPriceLC),
          LAB_RATE:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.labourRate),
          LAB_AMTFC:  this.commonService.emptyToZero(this.enterStoneDetailsForm.value.sellingPriceFC),
          LAB_AMTLC: 0,
          SIEVE_SET:  this.commonService.nullToString(this.enterStoneDetailsForm.value.sieveSet),
          PURITY: 0,
          PUREWT: 0,
          RRR_STOCK_REF: this.commonService.nullToString(this.enterStoneDetailsForm.value.stockRefCode),
          FINALVALUELC: 0,
          LABCHGCODE1: "",
          LABCHGCODE2: "",
          LABRATE1: 0,
          LABRATE2: 0,
          CERT_REF: this.commonService.nullToString(this.enterStoneDetailsForm.value.certRef),
          FROMEXISTINGSTOCK: 0,
          INSERTEDSTOCKCODE: "",
          INSERTEDSTOCKCOST: 0,
          POLISHED: "",
          RAPPRICE: 0,
          PIQUE: "",
          GRAINING: "",
          FLUORESCENCE: "",
          WEIGHT: 0,
    }

    this.close(postData);

  }

  
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {

        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.enterStoneDetailsForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = ''
          this.openOverlay(FORMNAME, event);
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
  }


  lookupKeyPress(event: any, form?: any) {
    if (event.key == 'Tab' && event.target.value == '') {
      this.showOverleyPanel(event, form)
    }
    if (event.key === 'Enter') {
      if (event.target.value == '') this.showOverleyPanel(event, form)
      event.preventDefault();
    }
  }


  showOverleyPanel(event: any, formControlName: string) {
    switch (formControlName) {
      case 'StockcodeDes':
        this.StockcodeDescodeSearch.showOverlayPanel(event);
        break;
        case 'Shapecode':
          this.ShapecodecodeSearch.showOverlayPanel(event);
          break;
          case 'sieveSet':
            this.sieveSetcodeSearch.showOverlayPanel(event);
            break;
            case 'sieve':
              this.sievecodeSearch.showOverlayPanel(event);
              break;
              case 'priceCode':
                this.priceCodeSearch.showOverlayPanel(event);
                break;
                case 'stoneTypeCode':
                  this.stoneTypeCodeSearch.showOverlayPanel(event);
                  break;
                  case 'stockRefCode':
                    this.stockRefCodeSearch.showOverlayPanel(event);
                    break;
                    case 'ColorCode':
                      this.ColorCodeSearch.showOverlayPanel(event);
                      break;
                      case 'ClarityCode':
                        this.ClarityCodeSearch.showOverlayPanel(event);
                        break;
                        case 'SizeCode':
                          this.SizeCodeSearch.showOverlayPanel(event);
                          break;
                          case 'labourCode':
                            this.labourCodeSearch.showOverlayPanel(event);
                            break;
                
                          
      default:
    }
  }


  openOverlay(FORMNAME: string, event: any) {
    switch (FORMNAME) {
      case 'StockcodeDes':
        this.StockcodeDescodeSearch.showOverlayPanel(event);
        break;
        case 'Shapecode':
          this.ShapecodecodeSearch.showOverlayPanel(event);
          break;
          case 'sieveSet':
            this.sieveSetcodeSearch.showOverlayPanel(event);
            break;
            case 'sieve':
              this.sievecodeSearch.showOverlayPanel(event);
              break;
              case 'priceCode':
                this.priceCodeSearch.showOverlayPanel(event);
                break;
                case 'stoneTypeCode':
                  this.stoneTypeCodeSearch.showOverlayPanel(event);
                  break;
                  case 'stockRefCode':
                    this.stockRefCodeSearch.showOverlayPanel(event);
                    break;
                    case 'stockRefCode':
                      this.stockRefCodeSearch.showOverlayPanel(event);
                      break;
                      case 'ColorCode':
                        this.ColorCodeSearch.showOverlayPanel(event);
                        break;
                        case 'ClarityCode':
                          this.ClarityCodeSearch.showOverlayPanel(event);
                          break;
                          case 'SizeCode':
                            this.SizeCodeSearch.showOverlayPanel(event);
                            break;
                            case 'labourCode':
                              this.labourCodeSearch.showOverlayPanel(event);
                              break;
                  
                          
              

      default:
        console.warn(`Unknown FORMNAME: ${FORMNAME}`);
        break;
    }
  }

}
