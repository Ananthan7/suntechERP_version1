import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

  @Input() content!: any;
  subscriptions: any;
  currentDate: any = new Date();
  viewMode: boolean = false;
  editMode: boolean = false;
  required: boolean = false;

  priceListMasterForm!: FormGroup;
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
  isDisabled = false;



  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {

    this.priceListMasterForm = this.formBuilder.group({
      priceCode: ['', [Validators.required]],
      description: ['', [Validators.required]],
      priceMethod: [0, [Validators.required]],
      priceSign: ['+'],
      priceValue: ['', [Validators.required]],
      finalPriceSign: ['+'],
      finalPriceValue: [''],
      addlValueSign: ['+'],
      addlValue: [''],
      priceRoundoff: [false],
      dontCalculate: [false],
      roundoff_digit: [''],
    });

    this.initializeForm();
   
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setAllInitialValues();
      this.setFormValues()
    }
    if (this.content.FLAG == 'EDIT') {
      this.editMode = true;
      this.setFormValues()
      this.setAllInitialValues();
      this.setInitialValues();
    }

  }

  setFormValues() {
    if (!this.content) return

    this.priceListMasterForm.controls.finalPriceValue.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.FINALPRICE_VALUE));

    this.priceListMasterForm.controls.addlValue.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.ADDLVALUE));
  }

  private setInitialValues() {
    console.log(this.commonService.amtFormat)
    this.priceListMasterForm.controls.finalPriceValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.priceListMasterForm.controls.addlValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

  }

  formSubmit() {
    console.log(this.priceListMasterForm.value.priceMethod);
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return;
    }
    if (!this.validateForm()) return;

    let API = 'PriceMaster/InsertPriceMaster';
    let postData = this.createPostData();

    this.dataService.postDynamicAPI(API, postData)
      .subscribe(
        result => this.handleApiResponse(result),
        err => alert(err)
      );
  }



  update() {
    if (!this.validateForm()) return;

    let API = `PriceMaster/UpdatePriceMaster/${this.priceListMasterForm.value.priceCode}`;
    let postData = this.createPostData();

    this.dataService.putDynamicAPI(API, postData)
      .subscribe(
        result => this.handleApiResponse(result),
        err => alert(err)
      );
  }

  deleteRecord() {
    try {
      if (!this.content.MID) {
        this.showInitialDeleteConfirmation();
        return;
      }

      this.confirmDeletion().then((result) => {
        if (result.isConfirmed) {
          let API = 'PriceMaster/DeletePriceMaster/' + this.priceListMasterForm.value.priceCode;
          this.handleDeletion(API);
        }
      });
    } catch (error) {
      console.error('Error in deleteRecord:', error);
    }
  }

  private initializeForm() {
    try {
      // this.priceListMasterForm.controls.finalPriceValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
      // this.priceListMasterForm.controls.addlValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
      // this.priceListMasterForm.controls.priceValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
      //  this.priceListMasterForm.controls.roundoff_digit.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    } catch (error) {
      console.error('Error in initializeForm:', error);
    }
  }
  setAllInitialValues() {
    if (!this.content) return
    try {
      let API = `PriceMaster/GetPriceMasterDetails/${this.content.PRICE_CODE}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          if (result.response) {
            let data = result.response
            console.log(data)
            if (data.PRICE_METHOD == 1) {
              this.priceListMasterForm.controls.priceSign.disable();
              this.priceListMasterForm.controls.priceSign.setValue('');
              this.isDisabled = true;
            }
            this.priceListMasterForm.controls.priceCode.setValue(data.PRICE_CODE)
            this.priceListMasterForm.controls.description.setValue(data.DESCRIPTION)
            this.priceListMasterForm.controls.priceMethod.setValue(data.PRICE_METHOD)
            this.priceListMasterForm.controls.priceSign.setValue(data.PRICE_SIGN)
            this.priceListMasterForm.controls.priceValue.setValue(data.PRICE_VALUE)
            this.priceListMasterForm.controls.finalPriceSign.setValue(data.FINALPRICE_SIGN)
            this.priceListMasterForm.controls.finalPriceValue.setValue(data.FINALPRICE_VALUE)
            this.priceListMasterForm.controls.addlValueSign.setValue(data.ADDLVALUE_SIGN)
            this.priceListMasterForm.controls.addlValue.setValue(data.ADDLVALUE)
            this.priceListMasterForm.controls.priceRoundoff.setValue(data.PRICE_ROUDOFF)
            this.priceListMasterForm.controls.dontCalculate.setValue(data.DONTCALCULATE)
            this.priceListMasterForm.controls.roundoff_digit.setValue(data.ROUNDOFF_DIGIT)
          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG1531')
        })
    }
    catch (error) {
      this.commonService.toastErrorByMsgId('MSG1531');
      console.error(error);
    }
  }
  createPostData() {
    return {
      "PRICE_CODE": this.priceListMasterForm.value.priceCode.toUpperCase(),
      "DESCRIPTION": this.priceListMasterForm.value.description.toUpperCase(),
      "PRICE_METHOD": this.priceListMasterForm.value.priceMethod,
      "PRICE_SIGN": this.priceListMasterForm.value.priceMethod == 1 ? '0' : this.priceListMasterForm.value.priceSign,
      "PRICE_VALUE": this.priceListMasterForm.value.priceValue,
      "MID": this.content ? this.content.MID : 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "DONTCALCULATE": this.priceListMasterForm.value.dontCalculate,
      "FINALPRICE_SIGN": this.priceListMasterForm.value.finalPriceSign || '',
      "FINALPRICE_VALUE": this.priceListMasterForm.value.finalPriceValue || 0,
      "ADDLVALUE": this.priceListMasterForm.value.addlValue || 0,
      "ADDLVALUE_SIGN": this.priceListMasterForm.value.addlValueSign || '',
      "PRICE_ROUDOFF": this.priceListMasterForm.value.priceRoundoff,
      "ROUNDOFF_DIGIT": this.priceListMasterForm.value.roundoff_digit || 0,
      "PRICE_FORMULA": "",
    };
  }
  validateForm() {
    if (this.priceListMasterForm.invalid) {
      this.toastr.error('Select all required fields');
      return false;
    }
    return true;
  }

  handleApiResponse(result: any) {
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
            this.close('reloadMainGrid');
          }
        });
      }
    } else {
      this.toastr.error('Not saved');
    }
  }
  showInitialDeleteConfirmation() {
    return Swal.fire({
      title: '',
      text: 'Please Select data to delete!',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    });
  }

  confirmDeletion() {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    });
  }

  handleDeletion(API: any) {
    this.dataService.deleteDynamicAPI(API).subscribe((result) => {
      if (result && result.status == "Success") {
        this.handleSuccessResponse(result);
      } else {
        this.handleErrorResponse(result);
      }
    }, err => alert(err));
  }

  handleSuccessResponse(result: any) {
    Swal.fire({
      title: result.message || 'Success',
      text: '',
      icon: 'success',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      if (result.value) {
        this.priceListMasterForm.reset();
        this.close('reloadMainGrid');
      }
    });
  }

  handleErrorResponse(result: any) {
    Swal.fire({
      title: result?.message || 'Error please try again',
      text: '',
      icon: 'error',
      confirmButtonColor: '#336699',
      confirmButtonText: 'Ok'
    }).then((result: any) => {
      if (result.value) {
        this.priceListMasterForm.reset();
        this.close();
      }
    });
  }
  priceCodeSelected(value: any) {
    try {
      console.log(value);
      this.priceListMasterForm.controls.priceCode.setValue(value.PRICE_CODE);
    } catch (error) {
      console.error('Error in priceCodeSelected:', error);
    }
  }

  close(data?: any) {
    try {
      this.activeModal.close(data);
    } catch (error) {
      console.error('Error in close:', error);
    }
  }
  onPriceTypeChange() {
    try {
      const selectedValue = this.priceListMasterForm.controls.priceMethod.value;
      if (selectedValue === 1) { // Assuming 1 corresponds to 'Fixed'
        // Reset the values for the specified form controls

        // this.priceListMasterForm.controls.finalPriceValue.setValue(null);
        // this.priceListMasterForm.controls.addlValue.setValue(null);
        // this.priceListMasterForm.controls.priceValue.setValue(null);
      }

      const selectedPriceType = this.priceTypeList.find(pt => pt.value === this.priceListMasterForm.value.priceMethod);
      if (selectedPriceType && selectedPriceType.type === 'Fixed') {
        this.required = false;
        this.viewMode = false;

        this.priceListMasterForm.controls.priceSign.disable();
        //  this.priceListMasterForm.controls.priceValue.disable();
        this.priceListMasterForm.controls.finalPriceSign.disable();
        this.priceListMasterForm.controls.finalPriceValue.disable();
        this.priceListMasterForm.controls.addlValueSign.disable();
        this.priceListMasterForm.controls.addlValue.disable();

        this.priceListMasterForm.controls.priceSign.setValue('');
        this.priceListMasterForm.controls.finalPriceSign.setValue('');
        this.priceListMasterForm.controls.finalPriceValue.setValue('');
        this.priceListMasterForm.controls.addlValueSign.setValue('');
        this.priceListMasterForm.controls.addlValue.setValue('');
        this.priceListMasterForm.controls.priceValue.setValue('');

        // this.isDisabled = true;
      } else {
        this.required = true;
        this.priceListMasterForm.controls.priceSign.enable();
        this.priceListMasterForm.controls.priceValue.enable();
        this.priceListMasterForm.controls.finalPriceSign.enable();
        this.priceListMasterForm.controls.finalPriceValue.enable();
        this.priceListMasterForm.controls.addlValueSign.enable();
        this.priceListMasterForm.controls.addlValue.enable();
        // this.isDisabled = false;
      }
    }
    catch (error) {
      console.error('Error in input change:', error);
    }
  }
  onInputChange(event: any, controlName: string, maxLength: number) {
    const inputValue = event.target.value;

    if (inputValue.length > maxLength) {
      this.priceListMasterForm.get(controlName)!.setValue(inputValue.slice(0, maxLength));
    }
  }

  checkWorkerExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }

    const API = 'PriceMaster/CheckIfPriceCodeExists/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Worker Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.priceListMasterForm.controls.priceCode.setValue('');

            //this.codeEnable = true;
            setTimeout(() => {
              this.renderer.selectRootElement('#priceCode').focus();
            }, 500);

          });
        }
      }, err => {
        this.priceListMasterForm.reset();
      });

    this.subscriptions.push(sub);
  }

}
