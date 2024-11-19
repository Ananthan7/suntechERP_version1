import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fixing-commodity-master',
  templateUrl: './fixing-commodity-master.component.html',
  styleUrls: ['./fixing-commodity-master.component.scss']
})
export class FixingCommodityMasterComponent implements OnInit {
  @Input() content!: any;
  private subscriptions: Subscription[] = [];
  selectedIndexes: any = [];
  viewMode: boolean = false;
  isDisableSaveBtn: boolean = false;
  currentDate: any = this.commonService.currentDate;
  
  @ViewChild('divisionCodedetailcodeSearch') divisionCodedetailcodeSearch!: MasterSearchComponent;
  @ViewChild('costcentercodeSearch') costcentercodeSearch!: MasterSearchComponent;
  @ViewChild('costcentercodeSearchMC') costcentercodeSearchMC!: MasterSearchComponent;
  @ViewChild('karatDetailSearch') karatDetailSearch!: MasterSearchComponent;
  @ViewChild('categorySearch') categorySearch!: MasterSearchComponent;
  @ViewChild('purchaseRateTypeSearch') purchaseRateTypeSearch!: MasterSearchComponent;
  @ViewChild('salesRateTypeSearch') salesRateTypeSearch!: MasterSearchComponent;
  @ViewChild('makingCurrencyDetailSearch') makingCurrencyDetailSearch!: MasterSearchComponent;



  
  
  
  
  

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {

    if (this.content?.FLAG) {
      console.log(this.content)
      this.setFormValues();
     if (this.content.FLAG == 'VIEW') {
       this.viewMode = true;
     } else if (this.content.FLAG == 'EDIT') {
       this.viewMode = false;
      
     } else if (this.content?.FLAG == 'DELETE') {
       this.viewMode = true;
       this.delete()
     }
   }

  }




  fixingcommodityForm: FormGroup = this.formBuilder.group({
    itemType:[''],
    divisionCode:[''],
    divisionCodedetail:[''],
    itemCode:[''],
    description:[''],
    costcenter:[''],
    costcenterMC:[''],
    qtyRoundOff:[''],
    karat:[''],
    karatDetail:[''],
    category:[''],
    inPieces:[false],
    pcs:[''],
    pcsdrpdwn:[''],
    purchaseRateType:[''],
    purchaseConvFactor:[''],
    purchaseCurrencyExRate:[''],
    purchaseCurrencyExRateDetails:[''],
    salesRateType:[''],
    salesConvFactor:[''],
    salesCurrencyExRate:[''],
    salesCurrencyExRateDetails:[''],
    makingUnit:[''],
    makingCurrency:[''],
    makingCurrencyDetail:[''],
    standardRate:[''],
    margin:[''],
    reorderStockReaches:[''],
    reorderStockReachesDrpdwn:[''],
    reorderRateReaches:[''],
    reorderRateReachesDrpdwn:[''],
    minimumOrderQty:[''],
    minimumOrderQtyDrpdwn:[''],
    maximumOrderQty:[''],
    maximumOrderQtyDrpdwn:[''],
    by:[''],
    on:[''],
    firstTrans:[''],
    lastTrans:[''],
  });



  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e);
    this.fixingcommodityForm.controls.divisionCode.setValue(e.DIVISION_CODE);
    this.fixingcommodityForm.controls.divisionCodedetail.setValue(e.DESCRIPTION)
  }

  costcenterCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: "COST_CODE",
    SEARCH_HEADING: "Cost Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  costcenterSelected(value: any) {
    console.log(value);
    this.fixingcommodityForm.controls.costcenter.setValue(value.COST_CODE);
  }

  costcenterCodeDataMC: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 15,
    SEARCH_FIELD: "COST_CODE",
    SEARCH_HEADING: "Cost Code",
    SEARCH_VALUE: "",
    WHERECONDITION: "COST_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  };
  costcenterSelectedMC(value: any) {
    console.log(value);
    this.fixingcommodityForm.controls.costcenterMC.setValue(value.COST_CODE);
  }

  karatcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT_CODE',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  karatcodeSelected(e: any) {
    this.fixingcommodityForm.controls.karat.setValue(e.KARAT_CODE);
    this.fixingcommodityForm.controls.karatDetail.setValue(e.KARAT_CODE);

  }

  categoryCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  categoryCodeSelected(e: any) {
    this.fixingcommodityForm.controls.category.setValue(e.CODE);

  }

  rateTypecodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 22,
    SEARCH_FIELD: 'RATE_TYPE',
    SEARCH_HEADING: 'Rate Type Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "RATE_TYPE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  rateTypecodeSelected(value: any) {
    console.log(value);
    this.fixingcommodityForm.controls.purchaseRateType.setValue(value.RATE_TYPE);
  }
  salesrateTypecodeSelected(value: any) {
    console.log(value);
    this.fixingcommodityForm.controls.salesRateType.setValue(value.RATE_TYPE);
  }


  currencyMasterData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 8,
    SEARCH_FIELD: 'CURRENCY_CODE',
    SEARCH_HEADING: 'CURRENCY MASTER',
    SEARCH_VALUE: '',
    WHERECONDITION: "CURRENCY_CODE <> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  currencycodeSelected(value: any) {
    console.log(value);
    this.fixingcommodityForm.controls.makingCurrency.setValue(value.CONV_RATE);
    this.fixingcommodityForm.controls.makingCurrencyDetail.setValue(value. CURRENCY_CODE);
  }

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.fixingcommodityForm.controls.on.setValue(new Date(date))
    }
   
  }


 // karatDetail:[''],

 setFormValues() {
 if (!this.content) return;

    this.fixingcommodityForm.controls.itemType.setValue(this.content.ITEMTYPE);
    this.fixingcommodityForm.controls.divisionCode.setValue(this.content.DIVISION_CODE);
    this.fixingcommodityForm.controls.itemCode.setValue(this.content.STOCK_CODE);
    this.fixingcommodityForm.controls.description.setValue(this.content.DESCRIPTION);
    this.fixingcommodityForm.controls.costcenter.setValue(this.content.CC_MAKING);
    this.fixingcommodityForm.controls.costcenterMC.setValue(this.content.CC_METAL);
    this.fixingcommodityForm.controls.karat.setValue(this.content.KARAT_CODE);
    this.fixingcommodityForm.controls.category.setValue(this.content.CATEGORY_CODE);
    this.fixingcommodityForm.controls.inPieces.setValue(this.content.IN_PCS);
    this.fixingcommodityForm.controls.pcs.setValue(this.content.PCS2GMS);
    this.fixingcommodityForm.controls.pcsdrpdwn.setValue(this.content.PCS2GMS_UNIT);
    this.fixingcommodityForm.controls.purchaseRateType.setValue(this.content.PUR_RATE_TYPE);
    this.fixingcommodityForm.controls.purchaseConvFactor.setValue(this.content.PUR_CONV_FACTOR);
    this.fixingcommodityForm.controls.purchaseCurrencyExRate.setValue(this.content.PUR_CURRENCY_CODE);
    this.fixingcommodityForm.controls.purchaseCurrencyExRateDetails.setValue(this.content.PUR_CURRENCY_RATE);
    this.fixingcommodityForm.controls.salesRateType.setValue(this.content.SAL_RATE_TYPE);
    this.fixingcommodityForm.controls.salesConvFactor.setValue(this.content.SAL_CONV_FACTOR);
    this.fixingcommodityForm.controls.salesCurrencyExRate.setValue(this.content.SAL_CURRENCY_CODE);
    this.fixingcommodityForm.controls.salesCurrencyExRateDetails.setValue(this.content.SAL_CURRENCY_RATE);
    this.fixingcommodityForm.controls.reorderStockReaches.setValue(this.content.RO_LEVEL_QTY);
    this.fixingcommodityForm.controls.reorderStockReachesDrpdwn.setValue(this.content.RO_LEVEL_QTY_UNIT);
    this.fixingcommodityForm.controls.reorderRateReaches.setValue(this.content.RO_LEVEL_RATE);
    this.fixingcommodityForm.controls.reorderRateReachesDrpdwn.setValue(this.content.RO_LEVEL_RATE_UNIT);
    this.fixingcommodityForm.controls.minimumOrderQty.setValue(this.content.RO_QTY_MIN);
    this.fixingcommodityForm.controls.minimumOrderQtyDrpdwn.setValue(this.content.RO_QTY_MIN_UNIT);
    this.fixingcommodityForm.controls.maximumOrderQty.setValue(this.content.RO_QTY_MAX);
    this.fixingcommodityForm.controls.maximumOrderQtyDrpdwn.setValue(this.content.RO_QTY_MAX_UNIT);
    this.fixingcommodityForm.controls.on.setValue(this.content.OPENED_ON);
    this.fixingcommodityForm.controls.by.setValue(this.content.OPENED_BY);
    this.fixingcommodityForm.controls.firstTrans.setValue(this.content.FIRST_TRN);
    this.fixingcommodityForm.controls.lastTrans.setValue(this.content.LAST_TRN);
    this.fixingcommodityForm.controls.margin.setValue(this.content.MARGIN_PERCENTAGE);
    this.fixingcommodityForm.controls.qtyRoundOff.setValue(this.content.QTY_ROUNDOFF);
    this.fixingcommodityForm.controls.makingUnit.setValue(this.content.MKG_UNIT);
    this.fixingcommodityForm.controls.makingCurrencyDetail.setValue(this.content.MKG_CURRENCY);
    this.fixingcommodityForm.controls.makingCurrency.setValue(this.content.MKG_CURRENCY_RATE);
    this.fixingcommodityForm.controls.standardRate.setValue(this.content.MKG_STD_RATE);
    }


  setPostData() {
    return {
      "MID": this.content?.MID || 0,
      "ITEMTYPE":  this.commonService.nullToString(this.fixingcommodityForm.value.itemType),
      "DIVISION_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.divisionCode),
      "STOCK_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.itemCode),
      "DESCRIPTION": this.commonService.nullToString(this.fixingcommodityForm.value.description),
      "CC_MAKING": this.commonService.nullToString(this.fixingcommodityForm.value.costcenter),
      "CC_METAL": this.commonService.nullToString(this.fixingcommodityForm.value.costcenterMC),
      "KARAT_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.karat),
      "PURITY": 0,
      "VENDOR_CODE": "string",
      "VENDOR_REF": "string",
      "TYPE_CODE": "string",
      "BRAND_CODE": "string",
      "CATEGORY_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.category),
      "COUNTRY_CODE": "string",
      "SUB_CATEGORY_CODE": "string",
      "IN_PCS":  this.fixingcommodityForm.value.inPieces,
      "PCS2GMS": this.commonService.emptyToZero(this.fixingcommodityForm.value.pcs),
      "PCS2GMS_UNIT":  this.commonService.emptyToZero(this.fixingcommodityForm.value.pcsdrpdwn),
      "STD_PRE_RATE": 0,
      "PRE_UNIT": 0,
      "MIN_PRE_RATE": 0,
      "REMARKS": "string",
      "PUR_RATE_TYPE": this.commonService.nullToString(this.fixingcommodityForm.value.purchaseRateType),
      "PUR_CONV_FACTOR": this.commonService.emptyToZero(this.fixingcommodityForm.value.purchaseConvFactor),
      "PUR_CURRENCY_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.purchaseCurrencyExRate),
      "PUR_CURRENCY_RATE": this.commonService.emptyToZero(this.fixingcommodityForm.value.purchaseCurrencyExRateDetails),
      "SAL_RATE_TYPE": this.commonService.nullToString(this.fixingcommodityForm.value.salesRateType),
      "SAL_CONV_FACTOR": this.commonService.emptyToZero(this.fixingcommodityForm.value.salesConvFactor),
      "SAL_CURRENCY_CODE": this.commonService.nullToString(this.fixingcommodityForm.value.salesCurrencyExRate),
      "SAL_CURRENCY_RATE": this.commonService.nullToString(this.fixingcommodityForm.value.salesCurrencyExRateDetails),
      "RO_LEVEL_QTY": this.commonService.emptyToZero(this.fixingcommodityForm.value.reorderStockReaches),
      "RO_LEVEL_QTY_UNIT": this.commonService.emptyToZero(this.fixingcommodityForm.value.reorderStockReachesDrpdwn),
      "RO_LEVEL_RATE": this.commonService.emptyToZero(this.fixingcommodityForm.value.reorderRateReaches),
      "RO_LEVEL_RATE_UNIT": this.commonService.emptyToZero(this.fixingcommodityForm.value.reorderRateReachesDrpdwn),
      "RO_QTY_MIN":  this.commonService.emptyToZero(this.fixingcommodityForm.value.minimumOrderQty),
      "RO_QTY_MIN_UNIT": this.commonService.emptyToZero(this.fixingcommodityForm.value.minimumOrderQtyDrpdwn),
      "RO_QTY_MAX": this.commonService.emptyToZero(this.fixingcommodityForm.value.maximumOrderQty),
      "RO_QTY_MAX_UNIT": this.commonService.emptyToZero(this.fixingcommodityForm.value.maximumOrderQtyDrpdwn),
      "OPENED_ON":  this.fixingcommodityForm.value.on,
      "OPENED_BY": this.commonService.nullToString(this.fixingcommodityForm.value.by),
      "FIRST_TRN": this.commonService.nullToString(this.fixingcommodityForm.value.firstTrans),
      "LAST_TRN": this.commonService.nullToString(this.fixingcommodityForm.value.lastTrans),
      "RO_PRORITY": true,
      "CURRENCY_CODE": "string",
      "MARGIN_PERCENTAGE": this.commonService.emptyToZero(this.fixingcommodityForm.value.margin),
      "BROKERAGE_PERCENTAGE": 0,
      "QTY_ROUNDOFF": this.commonService.emptyToZero(this.fixingcommodityForm.value.qtyRoundOff),
      "MKG_UNIT": this.commonService.emptyToZero(this.fixingcommodityForm.value.makingUnit),
      "MKG_CURRENCY": this.commonService.nullToString(this.fixingcommodityForm.value.makingCurrencyDetail),
      "MKG_CURRENCY_RATE": this.commonService.emptyToZero(this.fixingcommodityForm.value.makingCurrency),
      "MKG_STD_RATE": this.commonService.emptyToZero(this.fixingcommodityForm.value.standardRate),
    }
  }


  
  formSubmit(){


    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'FixingCommodityMaster/InsertFixingCommodityMaster';
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
        if (result.response) {
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.fixingcommodityForm.reset();
                this.close('reloadMainGrid');
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);
  }

  update(){
    let API = 'FixingCommodityMaster/UpdateFixingCommodityMaster/' + this.content.MID;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.fixingcommodityForm.reset();
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.commonService.toastErrorByMsgId('MSG3577')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }

  delete(){
    

    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'FixingCommodityMaster/DeleteFixingCommodityMaster/' + this.content.MID;
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
                    this.fixingcommodityForm.reset()
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
                    this.fixingcommodityForm.reset()
                    this.close()
                  }
                });
              }
            } else {
              this.commonService.toastErrorByMsgId('MSG1880');// Not Deleted
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }



  close(data?: any){
    this.activeModal.close(data);
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
        this.isDisableSaveBtn = false;
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.fixingcommodityForm.controls[FORMNAME].setValue('')
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
        case 'divisionCodedetail':
          this.divisionCodedetailcodeSearch.showOverlayPanel(event);
          break;
          case 'costcenter':
            this.costcentercodeSearch.showOverlayPanel(event);
            break;
            case 'costcenterMC':
              this.costcentercodeSearchMC.showOverlayPanel(event);
              break;
              case 'karatDetail':
              this.karatDetailSearch.showOverlayPanel(event);
              break;
              case 'category':
                this.categorySearch.showOverlayPanel(event);
                break;
                case 'purchaseRateType':
                  this.purchaseRateTypeSearch.showOverlayPanel(event);
                  break;
                  case 'salesRateType':
                    this.salesRateTypeSearch.showOverlayPanel(event);
                    break;
                    case 'makingCurrencyDetail':
                      this.makingCurrencyDetailSearch.showOverlayPanel(event);
                      break;
        default:
      }
    }
  
  
    openOverlay(FORMNAME: string, event: any) {
      switch (FORMNAME) {
        case 'divisionCodedetail':
          this.divisionCodedetailcodeSearch.showOverlayPanel(event);
          break;
          case 'costcenter':
            this.costcentercodeSearch.showOverlayPanel(event);
            break;
            case 'costcenterMC':
              this.costcentercodeSearchMC.showOverlayPanel(event);
              break;
              case 'karatDetail':
              this.karatDetailSearch.showOverlayPanel(event);
              break;
              case 'category':
                this.categorySearch.showOverlayPanel(event);
                break;
                case 'purchaseRateType':
                  this.purchaseRateTypeSearch.showOverlayPanel(event);
                  break;
                  case 'salesRateType':
                    this.salesRateTypeSearch.showOverlayPanel(event);
                    break;
                    case 'makingCurrencyDetail':
                      this.makingCurrencyDetailSearch.showOverlayPanel(event);
                      break;
        default:
          console.warn(`Unknown FORMNAME: ${FORMNAME}`);
          break;
      }
    }
  

}
