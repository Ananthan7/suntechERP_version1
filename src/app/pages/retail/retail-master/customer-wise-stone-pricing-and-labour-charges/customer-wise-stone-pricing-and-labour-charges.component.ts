import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry } from 'rxjs/operators';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-customer-wise-stone-pricing-and-labour-charges',
  templateUrl: './customer-wise-stone-pricing-and-labour-charges.component.html',
  styleUrls: ['./customer-wise-stone-pricing-and-labour-charges.component.scss']
})
export class CustomerWiseStonePricingAndLabourChargesComponent implements OnInit {
  vocMaxDate = new Date();
  stonePricingDetails: any=[];
  labourPricingDetails: any=[];
  accountDetails: any =[];
  tableData: any[] = [];
  tableData2: any[] = [];
  tableData3: any[] = [];
  viewMode: boolean = false;
  editMode: boolean = false;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  currentDate: any = this.commonService.currentDate;
  @ViewChild('currencyDetailcodeSearch') currencyDetailcodeSearch!: MasterSearchComponent;
  @ViewChild("codeField") codeField!: ElementRef;


  stonePricingHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "BRANCH_CODE", caption: "Division" },
    { field: "VOCTYPE", caption: "Type" },
    { field: "DIVISION", caption: "Category" },
    { field: "QTY", caption: "Sub Category" },
    { field: "amount", caption: "Brand" },
    { field: "PROFIT", caption: "Stone Type" },
    { field: "PROFIT", caption: "Shape" },
    { field: "PROFIT", caption: "Sieve Set" },
    { field: "PROFIT", caption: "Sieve From" },
    { field: "PROFIT", caption: "Sieve To" },
    { field: "PROFIT", caption: "Color" },
    { field: "PROFIT", caption: "Clarity" },

 
  ];

  labourPricingHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "BRANCH_CODE", caption: "Division" },
    { field: "PARTYCODE", caption: "Labour Type" },
    { field: "BRANCH_CODE", caption: "Unit" },
    { field: "VOCTYPE", caption: "Method" },
    { field: "DIVISION", caption: "Type" },
    { field: "QTY", caption: "Category" },
    { field: "amount", caption: "Brand" },
    { field: "PROFIT", caption: "Sub Category" },
    { field: "PROFIT", caption: "Shape" },
    { field: "PROFIT", caption: "Size From" },
    { field: "PROFIT", caption: "Size To" },
    { field: "PROFIT", caption: "Sieve" },
    { field: "PROFIT", caption: "Ct Wt From" },
 
  ];

  accountDetailsHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr No" },
    { field: "PARTYCODE", caption: "AC CODE" },
    { field: "BRANCH_CODE", caption: "Account Name" },
    { field: "VOCTYPE", caption: "Calc On" },
 
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }
  

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();

    if (this.content?.FLAG) {
      console.log(this.content)
      this.setFormValues();
     if (this.content.FLAG == 'VIEW') {
       this.viewMode = true;
     } else if (this.content.FLAG == 'EDIT') {
       this.viewMode = false;
       this.editMode = true;
     } else if (this.content?.FLAG == 'DELETE') {
       this.viewMode = true;
       this.deleteRecord()
     }
   }
  }

  ngAfterViewInit(): void {
    if (this.content?.FLAG == "ADD") {
      console.log(this.content?.FLAG)
      this.codeField.nativeElement.focus();
}
}


  customerWiseStonePriceForm: FormGroup = this.formBuilder.group({

    pricecode: [""],
    currency: [""],
    currencyDetail: [""],
    validFrom: [""],
    applyinPOS: [""],
  })

  formatDate(event: any) {
    const inputValue = event.target.value;
    let date = new Date(inputValue)
    let yr = date.getFullYear()
    let dt = date.getDate()
    let dy = date.getMonth()
    if (yr.toString().length > 4) {
      let date = `${dt}/${dy}/` + yr.toString().slice(0, 4);
      this.customerWiseStonePriceForm.controls.validFrom.setValue(new Date(date))
    }
    
  }



  curencyCodeData: MasterSearchModel = {
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

  curencyCodeSelected(e: any) {
    this.customerWiseStonePriceForm.controls.currency.setValue(e. CURRENCY_CODE);
    this.customerWiseStonePriceForm.controls.currencyDetail.setValue(e.CONV_RATE);
   

  }

  close(data?: any) {
    if (data){
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW'){
      this.activeModal.close(data);
      return
    }
    Swal.fire({
      title: 'Do you want to exit?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close(data);
      }
    }
    )
  }
 

  setFormValues() {
    if (!this.content) return
  
    this.customerWiseStonePriceForm.controls.pricecode.setValue(this.content.PRICECODE)
    this.customerWiseStonePriceForm.controls.currency.setValue(this.content.CURRENCY_CODE)
    this.customerWiseStonePriceForm.controls.currencyDetail.setValue(this.content.CURRENCY_RATE)
  //  this.customerWiseStonePriceForm.controls.applyinPOS.setValue(this.content.PRINT_COUNT)
    this.customerWiseStonePriceForm.controls.applyinPOS.setValue(
      this.content.PRINT_COUNT === 1 ? true : false
    );


    this.dataService.getDynamicAPI('CustomerPriceMaster/GetCustomerPriceMasterWithPriceCode/' + this.content.PRICECODE)
      .subscribe((data) => {
        if (data.status == 'Success') {

          this.customerWiseStonePriceForm.controls.validFrom.setValue(data.response.VALID_FROM)
          this.tableData = data.response.CUSTOMER_PRICE_DET;
          this.tableData2 = data.response.CUSTOMER_LABCHRG_DET;
          this.tableData3 = data.response.CUSTOMER_PRICE_ACCOUNT_DET;
        }
      });
  }


  
  setPostData(){
    return {
      "MID": 0,
      "CUSTOMER_CODE":  this.commonService.nullToString(this.customerWiseStonePriceForm.value.pricecode),
      "DESCRIPTION": "string",
      "GOLD_LOSS_PER": 0,
      "UPDATE_ON": "2024-11-27T11:06:03.169Z",
      "PRICECODE": this.commonService.nullToString(this.customerWiseStonePriceForm.value.pricecode),
      "MARGIN_PER": 0,
      "LAB_TYPE": "string",
      "MARKUP_PER": 0,
      "CUSTOMER_NAME": "string",
      "PRINT_COUNT": this.customerWiseStonePriceForm.value.applyinPOS ? 1 : 0,
      "VALID_FROM": this.customerWiseStonePriceForm.value.validFrom,
      "ADD_ON_RATE": 0,
      "CURRENCY_CODE":  this.commonService.nullToString(this.customerWiseStonePriceForm.value.currency),
      "CURRENCY_RATE": this.commonService.emptyToZero(this.customerWiseStonePriceForm.value.currencyDetail),
      "MAIN_VOCTYPE": "string",
      "CUSTOMER_PRICE_DET": this.tableData,
      "CUSTOMER_LABCHRG_DET": this.tableData2,
      "CUSTOMER_PRICE_ACCOUNT_DET":  this.tableData3,
    }
  }



  formSubmit(){

    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }

    let API = 'CustomerPriceMaster/InsertCustomerPriceMaster';
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData).subscribe(
      (result) => {
        console.log('result', result)
          if (result.status == 'Success') {
            Swal.fire({
              title: 'Saved Successfully',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok',
            }).then((result: any) => {
              if (result.value) {
                this.customerWiseStonePriceForm.reset();
                this.close('reloadMainGrid');
              }
            });
          }
       
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub);


  }

  update(){

    let API = 'CustomerPriceMaster/UpdateCustStoneLabourMaster/' + this.content.PRICECODE;
    let postData = this.setPostData()

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {

          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.customerWiseStonePriceForm.reset();
                this.close('reloadMainGrid')
              }
            });
          }
        
      }, err => {
        this.commonService.toastErrorByMsgId('MSG3577')
      })
    this.subscriptions.push(Sub)
  }


  deleteRecord() {

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
        let API = 'CustomerPriceMaster/DeleteCustStoneLabourMaster/' + this.content.PRICECODE ;
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
                    this.customerWiseStonePriceForm.reset()
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
                    this.customerWiseStonePriceForm.reset()
                    this.close()
                  }
                });
              }
            } else {
              this.close('reloadMainGrid')
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
      else
      {
        this.close('reloadMainGrid')
      }
    });
  }



  dobValueSetting(event: any) {
  }

  openstonedetails() {

    let length = this.tableData.length;
    let srno = length + 1;
    let data =   {
      "REFMID": 0,
      "CUSTOMER_CODE": "",
      "PRICE_CODE": "",
      "DESCRIPTION": "",
      "SHAPE": "",
      "COLOR": "",
      "CLARITY": "",
      "SIZE_FROM": "",
      "SIZE_TO": "",
      "CURRENCYCODE": "",
      "ISSUE_RATE": 0,
      "SELLING_RATE": 0,
      "UPDATE_ON": "2024-11-18T11:35:18.367Z",
      "CARAT_WT": 0,
      "SIEVE": "",
      "SELLING_PER": 0,
      "UNITCODE": "",
      "LABTYPE": "",
      "METHOD": "",
      "DIVISION": "",
      "CRACCODE": "",
      "COST_RATE": 0,
      "CARATWT_FROM": 0,
      "CARATWT_TO": 0,
      "ACCESSORIES": 0,
      "PRICE_TYPE": 0,
      "SIEVE_SET": "",
      "WEIGHT_FROM": 0,
      "WEIGHT_TO": 0,
      "SIEVE_TO": "",
      "CUSTOMER_NAME": "",
      "DT_VALID_FROM": "2024-11-18T11:35:18.367Z",
      "PRICECODE": "",
      "SRNO": srno
    }
    this.tableData.push(data);
    console.log(this.tableData);
  }

  divisiontemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].DIVISION = data.target.value;
  }

  typetemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].LABTYPE = data.target.value;
  }
  
  categorytemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].CUSTOMER_CODE = data.target.value;
  }
    
  subCategorytemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].PRICE_CODE = data.target.value;
  }
      
  brandtemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].DESCRIPTION = data.target.value;
  }
      
  stoneTypetemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].CURRENCYCODE = data.target.value;
  }
      
  shapeTypetemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].SHAPE = data.target.value;
  }

  sieveSettemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].SIEVE_SET = data.target.value;
  }


  sieveFromtemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].SIEVE = data.target.value;
  }

  sieveTotemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].SIEVE_TO = data.target.value;
  }


  colortemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].COLOR = data.target.value;
  }

  claritytemp(data:any,value: any){
    this.tableData[value.data.SRNO - 1].CLARITY = data.target.value;
  }


  
  openlabetails() {

    let length = this.tableData2.length;
    let srno = length + 1;
    let data =   {
    "REFMID": 0,
    "CUSTOMER_CODE": "",
    "LABOUR_CODE": "",
    "LABTYPE": "",
    "METHOD": "",
    "DIVISION": "",
    "SHAPE": "",
    "SIZE_FROM": "",
    "SIZE_TO": "",
    "CURRENCYCODE": "",
    "UNITCODE": "",
    "COST_RATE": 0,
    "SELLING_RATE": 0,
    "LAST_UPDATE": "2024-11-18T11:35:18.367Z",
    "CRACCODE": "",
    "ACCESSORIES": 0,
    "DIVISION_CODE": "",
    "SELLING_PER": 0,
    "CARATWT_FROM": 0,
    "CARATWT_TO": 0,
    "SIEVE": "",
    "DT_VALID_FROM": "2024-11-18T11:35:18.367Z",
    "PRICECODE": "",
    "SRNO": srno,
    "PROCESS_TYPE": ""
  }
  this.tableData2.push(data);
    console.log(this.tableData2);
  }

  
  divisionLabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].DIVISION = data.target.value;
  }

  labtypetemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].LABTYPE = data.target.value;
  }

  unittemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].UNITCODE = data.target.value;
  }

  methodtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].METHOD = data.target.value;
  }

  
  typelabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].PROCESS_TYPE = data.target.value;
  }
   
  categorylabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].CUSTOMER_CODE = data.target.value;
  }

   
  subCategorylabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].LABOUR_CODE = data.target.value;
  }
     
  shapelabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].SHAPE = data.target.value;
  }
     
  sieveFromLabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].SIZE_FROM = data.target.value;
  }
  sieveToLabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].SIZE_TO = data.target.value;
  }

  sieveSetLabtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].SIEVE = data.target.value;
  }

 ctfromtemp(data:any,value: any){
    this.tableData2[value.data.SRNO - 1].CARATWT_FROM = data.target.value;
  }

  openAccountdetails(){
    let length = this.tableData3.length;
    let srno = length + 1;
    let data =   {
      "UNIQUEID": 0,
      "SRNO":srno,
      "PRICECODE": "",
      "ACCODE": "",
      "ACCOUNT_HEAD": "",
      "CALC_ON_GROSS": false
    }
  this.tableData3.push(data);
    console.log(this.tableData3);
  }

  ACCODEtemp(data:any,value: any){
    this.tableData3[value.data.SRNO - 1].ACCODE = data.target.value;
  }

  AccountNametemp(data:any,value: any){
    this.tableData3[value.data.SRNO - 1].ACCOUNT_HEAD = data.target.value;
  }

  // CalcOntemp(data:any,value: any){
  //   console.log(data.target.value)
  //   // console.log(typeof(data.target.value))

  //   // if(data.target.value === 'on'){
  //   //   value = true;
  //   // }
  //   // else
  //   // {
  //   //   value = false;
  //   // }
  //   this.tableData3[value.data.SRNO - 1].CALC_ON_GROSS = data.target.value;
  // }

  CalcOntemp(event: any, value: any): void {
    // Convert the checkbox value to a boolean
    const isChecked = event.target.checked;
  
    console.log(isChecked); // Logs true or false
  
    // Update the corresponding value in tableData3
    this.tableData3[value.data.SRNO - 1].CALC_ON_GROSS = isChecked;
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
          this.customerWiseStonePriceForm.controls[FORMNAME].setValue('')
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
        case 'currencyDetail':
          this.currencyDetailcodeSearch.showOverlayPanel(event);
          break;
        default:
      }
    }
  
  
    openOverlay(FORMNAME: string, event: any) {
      switch (FORMNAME) {
        case 'currencyDetail':
          this.currencyDetailcodeSearch.showOverlayPanel(event);
          break;
        default:
          console.warn(`Unknown FORMNAME: ${FORMNAME}`);
          break;
      }
    }
  

  removeItemDetails() {}

  cancelStone(){}
  submitStone(){}
}
