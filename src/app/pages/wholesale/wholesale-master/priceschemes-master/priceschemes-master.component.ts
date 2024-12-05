import { Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-priceschemes-master',
  templateUrl: './priceschemes-master.component.html',
  styleUrls: ['./priceschemes-master.component.scss']
})
export class PriceschemesMasterComponent implements OnInit {
  @Input() content!: any;
  @ViewChild('overlayprice1') overlayprice1!: MasterSearchComponent;
  @ViewChild('overlayprice3') overlayprice3!: MasterSearchComponent;
  @ViewChild('overlayprice5') overlayprice5!: MasterSearchComponent;
  @ViewChild('overlayprice2') overlayprice2!: MasterSearchComponent;
  @ViewChild('overlayprice4') overlayprice4!: MasterSearchComponent;
  price3SearchEnable: boolean = false;
  price2SearchEnable: boolean = false;
  price4SearchEnable: boolean = false;
  price5SearchEnable: boolean = false;
  private subscriptions: Subscription[] = [];
  codeEnable: boolean = true;
  viewMode: boolean = false;
  editMode: boolean = false;
  isDisableSaveBtn: boolean = false;

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
  priceSchemaMasterForm: FormGroup = this.formBuilder.group({
    priceCode: ['', [Validators.required]],
    priceDescription: ['', [Validators.required]],
    price1: ['', [Validators.required]],
    price2: [{ value: '', disabled: true }, Validators.required],
    price3: [{ value: '', disabled: true }],
    price4: [{ value: '', disabled: true }],
    price5: [{ value: '', disabled: true }],
  })

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private renderer: Renderer2,

  ) { }

  ngOnInit(): void {
    this.renderer.selectRootElement('#code')?.focus();

    if (this.content?.FLAG) {
      this.setAllInitialValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.priceSchemaMasterForm.get('price1')?.enable();
        this.priceSchemaMasterForm.get('price2')?.enable();
        this.priceSchemaMasterForm.get('price3')?.enable();
        this.priceSchemaMasterForm.get('price4')?.enable();
        this.priceSchemaMasterForm.get('price5')?.enable();
      } else if (this.content.FLAG == 'EDIT') {
        this.viewMode = false;
        this.editMode = true;
        this.codeEnable = false;
        this.price3SearchEnable = true;
        this.price2SearchEnable = true;
        this.price4SearchEnable = true;
        this.price5SearchEnable = true;

        this.priceSchemaMasterForm.get('price1')?.enable();
        this.priceSchemaMasterForm.get('price2')?.enable();
        this.priceSchemaMasterForm.get('price3')?.enable();
        this.priceSchemaMasterForm.get('price4')?.enable();
        this.priceSchemaMasterForm.get('price5')?.enable();
      } else if (this.content.FLAG == 'DELETE') {
        this.viewMode = true;
        this.codeEnable = false;
        this.priceSchemaMasterForm.get('price1')?.enable();
        this.priceSchemaMasterForm.get('price2')?.enable();
        this.priceSchemaMasterForm.get('price3')?.enable();
        this.priceSchemaMasterForm.get('price4')?.enable();
        this.priceSchemaMasterForm.get('price5')?.enable();
        this.deleteRecord()
      }
    }
  }

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  // enableNextField(currentField: string, nextField: string) {

  //   const currentControl = this.priceSchemaMasterForm.get(currentField);
  //   const nextControl = this.priceSchemaMasterForm.get(nextField);

  //   if (currentControl && nextControl) {

  //     if (currentControl.value && currentControl.value !== nextControl.value) {
  //       nextControl.enable();
  //     } else {
  //       nextControl.disable();
  //       // If the current field is cleared, also clear and disable the next fields
  //       this.priceSchemaMasterForm.get(nextField)?.setValue('');
  //       this.disableNextFields(nextField);

  //     }
  //   }
  // }

  // // Helper method to disable and clear next fields
  // private disableNextFields(currentField: string) {
  //   const nextFields = ['price2', 'price3', 'price4', 'price5'];
  //   const startIndex = nextFields.indexOf(currentField);
  //   for (let i = startIndex + 1; i < nextFields.length; i++) {
  //     const nextField = nextFields[i];
  //     this.priceSchemaMasterForm.get(nextField)?.disable();
  //     this.priceSchemaMasterForm.get(nextField)?.setValue('');
  //   }
  // }

  // Method to handle enabling next field and showing lookup
  enableNextField(currentField: string, nextField: string) {
    const currentControl = this.priceSchemaMasterForm.get(currentField);
    const nextControl = this.priceSchemaMasterForm.get(nextField);

    if (currentControl && nextControl) {
      if (currentControl.value && currentControl.value !== nextControl.value) {
        nextControl.enable();

        // Enable corresponding lookup
        this.setLookupVisibility(nextField, true);
      } else {
        nextControl.disable();
        nextControl.setValue('');
        // Disable corresponding lookup
        this.setLookupVisibility(nextField, false);

        // Clear and disable subsequent fields
        this.disableNextFields(nextField);
      }
    }
  }

  // Method to set lookup visibility
  private setLookupVisibility(field: string, visibility: boolean) {
    switch (field) {
      case 'price2':
        this.price2SearchEnable = visibility;
        break;
      case 'price3':
        this.price3SearchEnable = visibility;
        break;
      case 'price4':
        this.price4SearchEnable = visibility;
        break;
      case 'price5':
        this.price5SearchEnable = visibility;
        break;
    }
  }

  // Method to disable all subsequent fields
  private disableNextFields(currentField: string) {
    const fields = ['price1', 'price2', 'price3', 'price4', 'price5'];
    const currentIndex = fields.indexOf(currentField);

    for (let i = currentIndex + 1; i < fields.length; i++) {
      const control = this.priceSchemaMasterForm.get(fields[i]);
      if (control) {
        control.disable();
        control.setValue('');
        this.setLookupVisibility(fields[i], false);
      }
    }
  }


  /** checking for same account code selection */
  private isSameAccountCodeSelected(accountCode: any, controlName: string): boolean {
    // Get all the price control names
    const priceControls = ['price1', 'price2', 'price3', 'price4', 'price5'];

    // Get the form values
    const formValues = this.priceSchemaMasterForm.value;

    // Convert the accountCode to upper case for case-insensitive comparison
    const upperAccountCode = this.commonService.nullToString(accountCode).toUpperCase();

    // Iterate through the price controls and check for matching account codes
    for (const control of priceControls) {
      if (control !== controlName && this.commonService.nullToString(formValues[control]).toUpperCase() === upperAccountCode) {
        return true;
      }
    }

    return false;
  }

  priceCodeSelected(e: any, controlName: string) {
    if (this.checkCode()) return
    if (controlName == 'price1') {
      this.price2SearchEnable = true;
    }
    if (controlName == 'price2') {
      this.price3SearchEnable = true;
    }
    if (controlName == 'price3') {
      this.price4SearchEnable = true;
    }
    if (controlName == 'price4') {
      this.price5SearchEnable = true;
    }

    if (this.isSameAccountCodeSelected(e.PRICE_CODE, controlName)) {
      this.commonService.toastErrorByMsgId('Cannot select the same Account Code');
      this.priceSchemaMasterForm.controls[controlName].setValue('')
      return;
    }

    try {
      this.priceSchemaMasterForm.controls[controlName].setValue(e.PRICE_CODE);
      const nextFieldName = this.getNextFieldName(controlName);
      if (nextFieldName !== '') {
        this.enableNextField(controlName, nextFieldName);
      }


    } catch (error) {
      console.error('Error in Price Code Selected:', error);
    }
  }

  // Helper method to get the next field name based on the current field
  private getNextFieldName(currentField: string): string {
    const fieldIndex = ['price1', 'price2', 'price3', 'price4', 'price5'].indexOf(currentField);
    return fieldIndex !== -1 && fieldIndex < 4 ? `price${fieldIndex + 2}` : '';
    // switch (currentField) {
    //   case 'price2':
    //     return 'price3';
    //   case 'price3':
    //     return 'price4';
    //   case 'price4':
    //     return 'price5';
    //   // Add more cases as needed for your form structure
    //   default:
    //     return '';
    // }
  }





  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return;
    }
    if (!this.validateForm()) return;

    if (this.priceSchemaMasterForm.value.price1 !== undefined && this.priceSchemaMasterForm.value.price2 == '') {

      this.toastr.error('Price 1 cannot be empty');
      return;
    }

    if (this.priceSchemaMasterForm.value.price2 !== undefined && this.priceSchemaMasterForm.value.price2 == '') {
      this.toastr.error('Price2 cannot be empty');
      return;
    }

    let API = 'PriceSchemeMaster/InsertPriceSchemeMaster';
    let postData = this.createPostData(this.priceSchemaMasterForm.value);

    try {
      this.dataService.postDynamicAPI(API, postData)
        .subscribe(
          result => this.handleApiResponse(result),
          err => {
            console.error('Error in formSubmit:', err);
            this.toastr.error('Error while submitting the form');
          }
        );
    } catch (error) {
      console.error('Error in formSubmit:', error);
      this.toastr.error('Error while submitting the form');
    }
  }

  update() {
    if (!this.validateForm()) return;

    if (this.priceSchemaMasterForm.value.price1 !== '' && this.priceSchemaMasterForm.value.price1 == '') {

      this.toastr.error('Price 1 cannot be empty');
      return;
    }

    if (this.priceSchemaMasterForm.value.price2 !== '' && this.priceSchemaMasterForm.value.price2 == '') {

      this.toastr.error('Price 2 cannot be empty');
      return;
    }

    let API = 'PriceSchemeMaster/UpdatePriceSchemeMaster/' + this.content.MID;
    let postData = this.createPostData(this.priceSchemaMasterForm.value);

    try {
      this.dataService.putDynamicAPI(API, postData)
        .subscribe(
          result => this.handleApiUpdateResponse(result),
          err => {
            console.error('Error in update:', err);
            this.toastr.error('Error while updating the form');
          }
        );
    } catch (error) {
      console.error('Error in update:', error);
      this.toastr.error('Error while Updating the Form');
    }
  }

  deleteRecord() {
    try {
      if (!this.content.MID) {
        this.showInitialDeleteConfirmation();
        return;
      }

      this.confirmDeletion().then((result) => {
        if (result.isConfirmed) {
          let API = 'PriceSchemeMaster/DeletePriceSchemeMaster/' + this.priceSchemaMasterForm.value.priceCode;
          this.handleDeletion(API);
        }
      });
    } catch (error) {
      console.error('Error in deleteRecord:', error);
      this.toastr.error('Error while Deleting the Record');
    }
  }

  setAllInitialValues() {
    if (!this.content) return
    try {
      let API = `PriceSchemeMaster/GetPriceSchemeMasterList/${this.content.PRICE_CODE}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          if (result.response) {
            let data = result.response
            this.priceSchemaMasterForm.controls.priceCode.setValue(data.PRICE_CODE?.toUpperCase())
            this.priceSchemaMasterForm.controls.priceDescription.setValue((data.PRICE_DESCRIPTION).toUpperCase())
            this.priceSchemaMasterForm.controls.price1.setValue(data.PRICE1?.toUpperCase())
            this.priceSchemaMasterForm.controls.price2.setValue(data.PRICE2?.toUpperCase())
            this.priceSchemaMasterForm.controls.price3.setValue(data.PRICE3?.toUpperCase())
            this.priceSchemaMasterForm.controls.price4.setValue(data.PRICE4?.toUpperCase())
            this.priceSchemaMasterForm.controls.price5.setValue(data.PRICE5?.toUpperCase())

          } else {
            this.commonService.toastErrorByMsgId('MSG1531')
          }
        }, err => {
          console.error('Error in setAllInitialValues:', err);
          this.commonService.toastErrorByMsgId('MSG1531')
        })
    }
    catch (error) {
      console.error('Error in setAllInitialValues:', error);
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }
  priceCodeValidate(event: any) {
    // if (this.content?.FLAG == 'EDIT' || this.content?.FLAG == 'VIEW') return
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }
    try {
      let API = `PriceSchemeMaster/GetPriceSchemeMasterList/${event.target.value}`
      let Sub: Subscription = this.dataService.getDynamicAPI(API)
        .subscribe((result) => {
          if (result.status == "Success") {
            this.priceSchemaMasterForm.controls.priceCode.setValue('')
            this.renderer.selectRootElement('#code')?.focus();
            this.commonService.toastErrorByMsgId('Code Already Exsist')
          }
        }, err => {
          this.commonService.toastErrorByMsgId('MSG1531')
        })
    }
    catch (error) {
      this.commonService.toastErrorByMsgId('MSG1531');
    }
  }

  createPostData(form: any) {
    return {
      "PRICE_CODE": this.commonService.nullToString(form.priceCode?.toUpperCase()),
      "PRICE_DESCRIPTION": this.commonService.nullToString(form.priceDescription?.toUpperCase()),
      "PRICE1": this.commonService.nullToString(form.price1?.toUpperCase()),
      "PRICE2": this.commonService.nullToString(form.price2?.toUpperCase()),
      "PRICE3": this.commonService.nullToString(form.price3?.toUpperCase()),
      "PRICE4": this.commonService.nullToString(form.price4?.toUpperCase()),
      "PRICE5": this.commonService.nullToString(form.price5?.toUpperCase()),
      "MID": this.content ? this.content?.MID : 0,
    };
  }

  handleApiResponse(result: any) {
    if (result.response) {
      if (result.status == "Success") {
        Swal.fire({
          title: this.commonService.getMsgByID('MSG2443') || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        }).then((result: any) => {
          if (result.value) {
            this.priceSchemaMasterForm.reset();
            this.close('reloadMainGrid');
          }
        });
      }
    } else {
      this.toastr.error('Not saved');
    }
  }

  handleApiUpdateResponse(result: any) {
    if (result.response) {
      if (result.status == "Success") {
        Swal.fire({
          title: this.commonService.getMsgByID('MSG3641') || 'Success',
          text: '',
          icon: 'success',
          confirmButtonColor: '#336699',
          confirmButtonText: 'Ok'
        }).then((result: any) => {
          if (result.value) {
            this.priceSchemaMasterForm.reset();
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
    }, err => {
      console.error('Error in handleDeletion:', err);
      this.toastr.error('Error while deleting the record');
    });
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
        this.priceSchemaMasterForm.reset();
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
        this.priceSchemaMasterForm.reset();
        this.close();
      }
    });
  }

  validateForm() {
    if (this.priceSchemaMasterForm.invalid) {
      this.toastr.error('Select all Required Fields');
      return false;
    }
    return true;
  }

  close(data?: any) {
    try {
      this.activeModal.close(data);
    } catch (error) {
      console.error('Error in close:', error);
    }
  }

  checkCode(): boolean {
    if (this.priceSchemaMasterForm.value.priceCode == '') {
      this.commonService.toastErrorByMsgId('Please enter the Price Code')
      return true
    }
    return false
  }

  codeEnabled() {
    if (this.priceSchemaMasterForm.value.priceCode == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }

  }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   console.log(this.priceSchemaMasterForm.value);

  //   if (this.isSameAccountCodeSelected(event.target.value,FORMNAME)) {
  //     this.commonService.toastErrorByMsgId('MSG3657');
  //     this.priceSchemaMasterForm.controls[FORMNAME].setValue('')
  //     return;
  //   }
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION?`AND ${LOOKUPDATA.WHERECONDITION}`:''}`
  //   }
  //   this.commonService.showSnackBarMsg('MSG81447');
  //   let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch/${param.LOOKUPID}/${param.WHERECOND}`
  //   let Sub: Subscription = this.dataService.getDynamicAPI(API)
  //     .subscribe((result) => {
  //       this.commonService.closeSnackBarMsg()
  //       this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])

  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.priceSchemaMasterForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }

  //     }, err => {
  //       this.commonService.toastErrorByMsgId('MSG1531')
  //     })
  //   this.subscriptions.push(Sub)
  // }
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
    let value = this.priceSchemaMasterForm.value[formControlName]
    if (this.commonService.nullToString(value) != '') return;

    switch (formControlName) {
      case 'price1':
        this.overlayprice1.showOverlayPanel(event);
        break;
      case 'price3':
        this.overlayprice3.showOverlayPanel(event);
        break;
      case 'price5':
        this.overlayprice5.showOverlayPanel(event);
        break;
      case 'price2':
        this.overlayprice2.showOverlayPanel(event);
        break;;
      case 'price4':
        this.overlayprice4.showOverlayPanel(event);
        break;;
      default:
    }
  }
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
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
          this.priceSchemaMasterForm.controls[FORMNAME].setValue('')
          LOOKUPDATA.SEARCH_VALUE = '';
          if (FORMNAME === 'price1' || FORMNAME === 'price3' || FORMNAME === 'price5' || FORMNAME === 'price4' || FORMNAME === 'price2') {
            this.showOverleyPanel(event, FORMNAME);
          }
          return
        }

      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
      })
    this.subscriptions.push(Sub)
  }

}
