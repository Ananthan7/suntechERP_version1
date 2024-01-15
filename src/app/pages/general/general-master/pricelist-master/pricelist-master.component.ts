import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pricelist-master',
  templateUrl: './pricelist-master.component.html',
  styleUrls: ['./pricelist-master.component.scss']
})
export class PricelistMasterComponent implements OnInit {
  priceListMasterForm!: FormGroup;
  @Input() content!: any;
  subscriptions: any;
  tableData: any[] = [];
  currentDate: any = new Date();
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
  };
  operatorsList = [
    { operation: '+', value: '+' },
    { operation: '-', value: '-' },
    { operation: '*', value: '*' },
    { operation: '/', value: '/' }
  ];
  allOperatorList = [
    { operator: '+', value: '+' },
    { operator: '-', value: '-' },
    { operator: '*', value: '*' },
    { operator: '/', value: '/' },
    { operator: '+%', value: '+%' },
    { operator: '/%', value: '/%' }
  ];
  priceTypeList = [
    { type: 'Cost', value: 0 },
    { type: 'Fixed', value: 1 },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  private initializeForm() {
    try {
      this.priceListMasterForm = this.formBuilder.group({
        priceCode: [''],
        description: [''],
        priceMethod: [''],
        priceSign: [''],
        priceValue: [''],
        finalPriceSign: [''],
        finalPriceValue: [''],
        addlValueSign: [''],
        addlValue: [''],
        priceRoundoff: [false],
        dontCalculate: [false],
        roundoff_digit: [''],
      });
    } catch (error) {
      console.error('Error in initializeForm:', error);
    }
  }
  onInputChange(event: any) {
    const inputValue = event.target.value;
    const maxLength = 6; 
    const roundoffLen=3

    if (inputValue.length > maxLength) {
      // this.priceListMasterForm.get('priceValue')!.setValue(inputValue.slice(0, maxLength));
      // this.priceListMasterForm.get('finalPriceValue')!.setValue(inputValue.slice(0, maxLength));
      // this.priceListMasterForm.get('roundoff_digit')!.setValue(inputValue.slice(0, roundoffLen)); 
      // this.priceListMasterForm.get('priceCode')!.setValue(inputValue.slice(0, roundoffLen));
      // this.priceListMasterForm.get('addlValue')!.setValue(inputValue.slice(0, roundoffLen));
    }
  }
  priceCodeSelected(value: any) {
    try {
      console.log(value);
      this.priceListMasterForm.controls.priceCode.setValue(value.PRICE_CODE);
    } catch (error) {
      console.error('Error in priceCodeSelected:', error);
    }
  }

  priceOneCodeSelected(e: any) {
    try {
      console.log(e);
      this.priceListMasterForm.controls.priceCode.setValue(e.PRICE_CODE);
    } catch (error) {
      console.error('Error in priceOneCodeSelected:', error);
    }
  }

  close(data?: any) {
    try {
      // TODO: reset forms and data before closing
      this.activeModal.close(data);
    } catch (error) {
      console.error('Error in close:', error);
    }
  }

  formSubmit() {
    console.log(this.priceListMasterForm.value.priceMethod)
    try {
      if (this.content && this.content.FLAG == 'EDIT') {
        this.update();
        return;
      }
      if (this.priceListMasterForm.invalid) {
        this.toastr.error('Select all required fields');
        return;
      }

      let API = 'PriceMaster/InsertPriceMaster'
      let postData = {
        "PRICE_CODE": this.priceListMasterForm.value.priceCode,
        "DESCRIPTION": this.priceListMasterForm.value.description,
        "PRICE_METHOD": this.priceListMasterForm.value.priceMethod,
        "PRICE_SIGN":this.priceListMasterForm.value.priceMethod==1?'0':this.priceListMasterForm.value.priceSign,
        "PRICE_VALUE": this.priceListMasterForm.value.priceValue,
        "MID": 0,
        "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
        "DONTCALCULATE": this.priceListMasterForm.value.dontCalculate,
        "FINALPRICE_SIGN": this.priceListMasterForm.value.finalPriceSign,
        "FINALPRICE_VALUE": this.priceListMasterForm.value.finalPriceValue,
        "ADDLVALUE": this.priceListMasterForm.value.addlValue,
        "ADDLVALUE_SIGN": this.priceListMasterForm.value.addlValueSign,
        "PRICE_ROUDOFF": this.priceListMasterForm.value.priceRoundoff, 
        "ROUNDOFF_DIGIT": this.priceListMasterForm.value.roundoff_digit,
      }

      let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                  this.priceListMasterForm.reset();
                  this.tableData = [];
                  this.close('reloadMainGrid');
                }
              });
            }
          } else {
            this.toastr.error('Not saved');
          }
        }, err => alert(err))
      this.subscriptions.push(Sub);
    } catch (error) {
      console.error('Error in formSubmit:', error);
    }
  }

  update() {
    try {
      
    } catch (error) {
      console.error('Error in update:', error);
    }
  }

  deleteRecord() {
    try {
     
    } catch (error) {
      console.error('Error in deleteRecord:', error);
    }
  }
}
