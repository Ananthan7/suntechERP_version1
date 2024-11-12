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
  codeEnable: boolean = true;
  round: boolean = true;

  priceListMasterForm: FormGroup = this.formBuilder.group({
    priceCode: ['', [Validators.required]],
    description: ['', [Validators.required]],
    priceMethod: [0, [Validators.required]],
    priceSign: [''],
    priceValue: ['', [Validators.required]],
    finalPriceSign: [''],
    finalPriceValue: [''],
    addlValueSign: [''],
    addlValue: [''],
    priceRoundoff: [false],
    dontCalculate: [false],
    roundoff_digit: [''],
  });
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
    this.renderer.selectRootElement('#priceCode')?.focus();

    this.round = true;
    this.initializeForm();
    console.log(this.content, 'this.content');

    if (this.content?.FLAG) {
      this.setFormValues()
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.editMode = true

      } else if (this.content.FLAG == 'EDIT') {
        this.editMode = true;
        this.codeEnable = false;
        // this.priceListMasterForm.controls.priceSign.disable();
        // this.priceListMasterForm.controls.finalPriceSign.disable();
        // this.priceListMasterForm.controls.finalPriceValue.disable();
        // this.priceListMasterForm.controls.addlValueSign.disable();
        // this.priceListMasterForm.controls.addlValue.disable();
        this.roundoffDis()
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteRecord()
      }
    } else {
      this.priceListMasterForm.controls.priceSign.setValue('+');
      this.priceListMasterForm.controls.finalPriceSign.setValue('*');
      this.priceListMasterForm.controls.addlValueSign.setValue('*');
    }
  }

  setFormValues() {
    if (!this.content) return
    this.onPriceTypeChangeOnSetValues(this.content.PRICE_METHOD);
    console.log("passed");
    
    this.priceListMasterForm.controls.priceCode.setValue(this.content.PRICE_CODE.toUpperCase());
    this.priceListMasterForm.controls.description.setValue(this.content.DESCRIPTION.toUpperCase());
    
    this.priceListMasterForm.controls.priceMethod.setValue(this.content.PRICE_METHOD);
    this.priceListMasterForm.controls.priceSign.setValue(this.content.PRICE_SIGN);
    this.priceListMasterForm.controls.priceSign.setValue(this.content.PRICE_SIGN);
    this.priceListMasterForm.controls.finalPriceSign.setValue(this.content.FINALPRICE_SIGN);
    this.priceListMasterForm.controls.addlValueSign.setValue(this.content.ADDLVALUE_SIGN);
    this.priceListMasterForm.controls.roundoff_digit.setValue(this.content.ROUNDOFF_DIGIT);
    this.priceListMasterForm.controls.dontCalculate.setValue(this.viewchangeYorN(this.content.DONTCALCULATE));
    this.priceListMasterForm.controls.priceRoundoff.setValue(this.viewchangeYorN(this.content.PRICE_ROUDOFF));

    this.priceListMasterForm.controls.priceValue.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.PRICE_VALUE));


    this.priceListMasterForm.controls.finalPriceValue.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.FINALPRICE_VALUE));

    this.priceListMasterForm.controls.addlValue.setValue(
      this.commonService.transformDecimalVB(
        this.commonService.allbranchMaster?.BAMTDECIMALS,
        this.content.ADDLVALUE));
  }

  // private setInitialValues() {
  //   console.log(this.commonService.amtFormat)
  //   this.priceListMasterForm.controls.finalPriceValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
  //   this.priceListMasterForm.controls.addlValue.setValue(this.commonService.decimalQuantityFormat(0, 'AMOUNT'))

  // }

  viewchangeYorN(e: any) {
    console.log(e);

    if (e == 'Y') {
      return true;
    } else {
      return false;
    }
  }


  formSubmit() {
    console.log(this.priceListMasterForm.value.priceMethod);
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return;
    }

    // if (this.priceListMasterForm.value.description) {
    //   this.toastr.error('Description Cannot be empty');
    // }
    // else {


    if (!this.validateForm()) return;

    let API = 'PriceMaster/InsertPriceMaster';
    let postData = this.createPostData();

    // this.dataService.postDynamicAPI(API, postData)
    //   .subscribe(
    //     result => this.handleApiResponse(result),
    //     err => alert(err)
    //   );
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result: any) => {
        console.log('Server Response:', result);
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result?.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.priceListMasterForm.reset()
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



  update() {
    if (!this.validateForm()) return;

    let API = `PriceMaster/UpdatePriceMaster/${this.priceListMasterForm.value.priceCode}`;
    let postData = this.createPostData();

    // this.dataService.putDynamicAPI(API, postData)
      // .subscribe(
      //   result => this.handleApiResponse(result),
      //   err => alert(err)
      // );
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
                this.priceListMasterForm.reset()
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
  deleteCheckingPricList() {
    if (!this.content.MID) {
      this.showInitialDeleteConfirmation();
      return;
    }
    let priceCondition = `PRICE1='${this.content.PRICE_CODE}' OR PRICE2='${this.content.PRICE_CODE}'`
    priceCondition += `OR PRICE3='${this.content.PRICE_CODE}' OR PRICE4='${this.content.PRICE_CODE}'`
    priceCondition += `OR PRICE5='${this.content.PRICE_CODE}'`
    let param = {
      LOOKUPID: 177,
      WHERECOND: priceCondition || ''
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/`
    let Sub: Subscription = this.dataService.postDynamicAPI(API,param)
      .subscribe((result) => {
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data && data.length == 0) {
          this.deleteRecord()
        } else {
          this.commonService.toastErrorByMsgId('Price already in use')
        }
      }, err => {
        this.commonService.toastErrorByMsgId('network issue found')
      })
    this.subscriptions.push(Sub)
  }

  deleteRecord() {
    try {
      this.confirmDeletion().then((result) => {
        if (result.isConfirmed) {
          let API = 'PriceMaster/DeletePriceMaster/' + this.priceListMasterForm.value.priceCode;
          let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
            .subscribe((result) => {
              if (result) {
                if (result.status == "Success") {
                  this.showSuccessDialog(this.content?.PRICE_CODE + ' Deleted successfully');
                } else {
                  this.commonService.toastErrorByMsgId('MSG2272');
                }
              } else {
                this.commonService.toastErrorByMsgId('MSG1880');
              }
            }, err => {
              this.commonService.toastErrorByMsgId('MSG1531')
            });
          this.subscriptions.push(Sub);
        }


        // if (result.isConfirmed) {
        //   let API = 'PriceMaster/DeletePriceMaster/' + this.priceListMasterForm.value.priceCode;
        //   this.handleDeletion(API);
        // }
      });
    } catch (error) {
      this.commonService.toastInfoByMsgId('Error occured! pls try again');;
    }
  }

  private initializeForm() {
    this.priceListMasterForm.controls.finalPriceValue.setValue(
      this.commonService.decimalQuantityFormat(1, 'AMOUNT'
      ))
    this.priceListMasterForm.controls.addlValue.setValue(
      this.commonService.decimalQuantityFormat(1, 'AMOUNT')
    )
    this.priceListMasterForm.controls.priceValue.setValue(
      this.commonService.decimalQuantityFormat(0, 'AMOUNT'))
    this.priceListMasterForm.controls.roundoff_digit.setValue(0)
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
            this.priceListMasterForm.controls.priceCode.setValue(data.PRICE_CODE.toUpperCase())
            this.priceListMasterForm.controls.description.setValue(data.DESCRIPTION.toUpperCase())
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
    let form = this.priceListMasterForm.value
    console.log(form, 'form');

    let priceFormula = ''
    if (form.priceMethod == 0) {
      priceFormula = `(((STOCK_LCCOST${form.addlValueSign}${form.addlValue})${form.priceSign}${form.priceValue})${form.finalPriceSign}${form.finalPriceValue})`
      console.log(priceFormula);
      
    } else if (form.priceMethod == 1) {
      priceFormula = form.priceValue
    }
    return {
      "PRICE_CODE": form.priceCode.toUpperCase(),
      "DESCRIPTION": form.description.toUpperCase(),
      "PRICE_METHOD": form.priceMethod,
      "PRICE_SIGN": form.priceMethod == 1 ? '0' : form.priceSign,
      "PRICE_VALUE": this.commonService.emptyToZero(form.priceValue),
      "MID": this.content ? this.content.MID : 0,
      "SYSTEM_DATE": this.commonService.formatDateTime(this.currentDate),
      "DONTCALCULATE": form.dontCalculate,
      "FINALPRICE_SIGN": form.finalPriceSign || '*',
      "FINALPRICE_VALUE": this.commonService.emptyToZero(form.finalPriceValue) || 1,
      "ADDLVALUE": this.commonService.emptyToZero(form.addlValue) || 1,
      "ADDLVALUE_SIGN": form.addlValueSign || '*',
      "PRICE_ROUDOFF": form.priceRoundoff,
      "ROUNDOFF_DIGIT": this.commonService.emptyToZero(form.roundoff_digit),
      "PRICE_FORMULA": this.commonService.nullToString(priceFormula),
    };
  }
  validateForm() {
    const pricecodeControl = this.priceListMasterForm.controls.priceCode;
    const descriptionControl = this.priceListMasterForm.controls.description;
    const pricetypeControl = this.priceListMasterForm.controls.priceMethod;
    const priceValueControl = this.priceListMasterForm.controls.priceValue;
  
    if (pricecodeControl.invalid || descriptionControl.invalid || pricetypeControl.invalid || priceValueControl.invalid) {
      this.toastr.error('Select all required fields');
      return false;
    }
    
    return true;
  }
  

  showSuccessDialog(message: string): void {
    Swal.fire({
      title: message,
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
    this.commonService.toastInfoByMsgId('MSG81447');
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
      title: this.content.PRICE_CODE + this.commonService.toastErrorByMsgId('MSG81450'),//' Deleted Successfully'
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



  onPriceTypeChangeOnSetValues(value?: any) {
    try {

      const selectedPriceType = this.priceTypeList.find(pt => pt.value === value);
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
        this.priceListMasterForm.controls.priceSign.setValue('+');
        this.priceListMasterForm.controls.finalPriceSign.setValue('*');
        this.priceListMasterForm.controls.addlValueSign.setValue('*');
        // this.isDisabled = false;
      }
    }
    catch (error) {
      console.error('Error in input change:', error);
    }
  }

  onPriceTypeChange(value?: any) {
    try {
      const selectedValue = this.priceListMasterForm.controls.priceMethod.value;
      if (selectedValue === 1) { // Assuming 1 corresponds to 'Fixed'
        // Reset the values for the specified form controls

        // this.priceListMasterForm.controls.finalPriceValue.setValue(null);
        // this.priceListMasterForm.controls.addlValue.setValue(null);
        // this.priceListMasterForm.controls.priceValue.setValue(null);
      }

      const selectedPriceType = this.priceTypeList.find(pt => pt.value === this.priceListMasterForm.value.priceMethod || value);
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
        this.priceListMasterForm.controls.priceSign.setValue('+');
        this.priceListMasterForm.controls.finalPriceSign.setValue('*');
        this.priceListMasterForm.controls.addlValueSign.setValue('*');
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
  checkCodeExists(event: any) {
    // Exit the function if in edit mode or view mode
    if ((this.content && (this.content.FLAG === 'EDIT' || this.content.FLAG === 'VIEW')) || this.viewMode) {
      return;
    }

    // Exit the function if the input is empty
    if (event.target.value === '') {
      return;
    }

    const API = 'PriceMaster/CheckIfPriceCodeExists/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.checkifExists) {
          Swal.fire({
            title: '',
            text: result.message || 'Price code already exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value only if not in view mode
            if (!this.viewMode) {
              this.priceListMasterForm.controls.priceCode.setValue('');
              this.codeEnabled();
            }
          });
        }
      }, err => {
        if (!this.viewMode) {
          this.priceListMasterForm.reset();
        }
      });

    this.subscriptions.push(sub);
  }


  codeEnabled() {
    if (this.priceListMasterForm.value.priceCode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }

  roundoffDis() {

    if (this.priceListMasterForm.value.priceRoundoff != true) {
      this.round = true;
      this.priceListMasterForm.controls.roundoff_digit.setValue('');
    }
    else {
      this.round = false;
    }
  }

  getMaxValueLength(): number {
    const selectedOperator = this.priceListMasterForm.get('priceSign')?.value;
    const requiresMaxLength3 = ['+%', '/%'].includes(selectedOperator);
    return requiresMaxLength3 ? 3 : 5;
  }

}


