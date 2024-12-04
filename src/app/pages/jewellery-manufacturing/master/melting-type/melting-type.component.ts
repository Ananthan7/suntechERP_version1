import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import { AttachmentUploadComponent } from 'src/app/shared/common/attachment-upload/attachment-upload.component';




@Component({
  selector: 'app-melting-type',
  templateUrl: './melting-type.component.html',
  styleUrls: ['./melting-type.component.scss']
})
export class MeltingTypeComponent implements OnInit {
  @ViewChild('overlaycolorSearch') overlaycolorSearch!: MasterSearchComponent;
  @ViewChild('overlaykaratSearch') overlaykaratSearch!: MasterSearchComponent;
  @ViewChild('overlaystockCodeSearch') overlaystockCodeSearch!: MasterSearchComponent;
  @ViewChild(AttachmentUploadComponent) attachmentUploadComponent?: AttachmentUploadComponent;



  @Input() content!: any;

  tableData: any[] = [];
  userName = localStorage.getItem('username');
  private subscriptions: Subscription[] = [];
  metal: any;
  description: any;
  code: any;
  alloy: any;
  slNo = 0;
  selectedIndexes: any = [];
  viewMode: boolean = false;
  viewModeField: boolean = true;
  SearchDisable: boolean = false;
  editCode: boolean = false;
  allStockCodes: any;
  filteredStockCodes: any[] | undefined;
  codeEnable: boolean = true;
  rowData: any;
  editMode: boolean = false;
  karatval: any;
  purityval: any;
  isDisableSaveBtn: boolean = false;
  columnheads: any[] = ['Sr', 'Division', 'Default Alloy', 'Description', 'Alloy %'];

  colorData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 35,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Color',
    SEARCH_VALUE: '',
    WHERECONDITION: "TYPES = 'COLOR MASTER'",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true
  }
  karatcodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 17,
    SEARCH_FIELD: 'KARAT',
    SEARCH_HEADING: 'Karat Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "KARAT_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  defaultAlloy: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 41,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Default Alloy Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "item = 'y' ",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  stockCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 23,
    SEARCH_FIELD: 'STOCK_CODE',
    SEARCH_HEADING: 'Stock Code',
    SEARCH_VALUE: '',
    WHERECONDITION: 'SUBCODE = 0',
    VIEW_INPUT: true,
    VIEW_TABLE: true,
    LOAD_ONCLICK: true,
  }
  meltingTypeForm: FormGroup = this.formBuilder.group({
    mid: [],
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    metal: [''],
    color: ['', [Validators.required]],
    karat: [''],
    purity: [''],
    alloy: [''],
    stockCode: [''],

  });
  @ViewChild('codeInput')
  codeInput!: ElementRef;

  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    // console.log(this.content.KARAT_CODE);

    this.viewModeField = true;
    if (this.content?.FLAG) {
      this.setFormValues();
      if (this.content.FLAG == 'VIEW') {
        this.viewMode = true;
        this.editCode = true;
      } else if (this.content.FLAG == 'EDIT') {
        this.editCode = true;
        this.viewMode = false;
        this.codeEnable = false;
        this.editMode = true;
        this.karatCodeEmty();
        this.stockCodeData.WHERECONDITION = `KARAT_CODE ='${this.content.KARAT_CODE}' AND PURITY = '${this.content.PURITY}' AND SUBCODE = 0`;
      } else if (this.content?.FLAG == 'DELETE') {
        this.viewMode = true;
        this.deleteMeltingType()
      }
    }
  }
  ngAfterViewInit(): void {
    this.codeInput.nativeElement.focus();
  }
  onSelectionChanged(event: any) {
    const values: number[] = event.selectedRowKeys;
    const indexes: number[] = [];

    values.forEach((selectedValue: number) => {
      const index = this.tableData.findIndex(item => parseFloat(item.SRNO) === selectedValue);

      // Check if the value is not already in the selectedIndexes array
      if (index !== -1 && !this.selectedIndexes.includes(index)) {
        indexes.push(index);
      }
    });

    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
  }
  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }
    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }

    const API = 'MeltingType/GetMeltingTypeList/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.status == 'Success') {
          this.commonService.toastErrorByMsgId('MSG1121')//code already exsist
          // Clear the input value
          this.meltingTypeForm.controls.code.setValue('');
          this.codeEnabled()
        }
      }, err => {
        this.meltingTypeForm.reset();
      });

    this.subscriptions.push(sub);
  }

  inputValidate(event: any) {
    if (event.target.value != '') {
      this.isDisableSaveBtn = true;
    } else {
      this.isDisableSaveBtn = false;
    }
  }

  Attachedfile: any[] = [];
  savedAttachments: any[] = [];

  attachmentClicked() {
    this.attachmentUploadComponent?.showDialog()
  }

  uploadSubmited(file: any) {

    this.Attachedfile = file
    console.log(this.Attachedfile);

  }

  /**use: validate all lookups to check data exists in db */
  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true || this.editMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
  //   }
  //   this.commonService.toastInfoByMsgId('MSG81447');
  //   let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch'
  //   let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
  //     .subscribe((result) => {
  //       this.isDisableSaveBtn = false;
  //       let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
  //       if (data.length == 0) {
  //         this.commonService.toastErrorByMsgId('MSG1531')
  //         this.meltingTypeForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }

  //     }, err => {
  //       this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
  //     })
  //   this.subscriptions.push(Sub)
  // }

  // validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
  //   LOOKUPDATA.SEARCH_VALUE = event.target.value
  //   if (event.target.value == '' || this.viewMode == true) return
  //   let param = {
  //     LOOKUPID: LOOKUPDATA.LOOKUPID,
  //     WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
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
  //         this.meltingTypeForm.controls[FORMNAME].setValue('')
  //         LOOKUPDATA.SEARCH_VALUE = ''
  //         return
  //       }
  //     }, err => {
  //       this.commonService.toastErrorByMsgId('network issue found')
  //     })
  //   this.subscriptions.push(Sub)
  // }
  handleLookupError(FORMNAME: string, LOOKUPDATA: MasterSearchModel) {
    this.commonService.toastErrorByMsgId('MSG1531');
    this.meltingTypeForm.controls[FORMNAME].setValue('');
    LOOKUPDATA.SEARCH_VALUE = '';
    if (FORMNAME === 'karat') {
      this.meltingTypeForm.controls.purity.setValue('');
      this.meltingTypeForm.controls.alloy.setValue('');
      this.meltingTypeForm.controls.metal.setValue('');
    }
  }

  /**use: validate all lookups to check data exists in db */
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value;

    if (event.target.value === '' || this.viewMode === true || this.editMode === true) {
      return;
    }

    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    };

    this.commonService.toastInfoByMsgId('MSG81447');

    let API = 'UspCommonInputFieldSearch/GetCommonInputFieldSearch';
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param).subscribe((result) => {
      this.isDisableSaveBtn = false;
      let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0]);

      if (data.length === 0) {
        this.handleLookupError(FORMNAME, LOOKUPDATA); // Call handleLookupError if no data is found
        return;
      }

      const matchedItem = data.find((item: any) => item.KARAT_CODE.toUpperCase() === event.target.value.toUpperCase());

      if (matchedItem) {
        // Set the form control value with the matched item code
        this.meltingTypeForm.controls[FORMNAME].setValue(matchedItem.KARAT_CODE);

        // Call the karatcodeSelected function with the matched item
        this.karatcodeSelected(matchedItem);
      } else {
        // If no match found, reset the form control and SEARCH_VALUE
        this.handleLookupError(FORMNAME, LOOKUPDATA); // Call handleLookupError if no match is found
      }

    }, err => {
      this.commonService.toastErrorByMsgId('MSG2272');
    });

    this.subscriptions.push(Sub);
  }

  codeEnabled() {
    if (this.meltingTypeForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  addTableData() {
    const formValue = this.meltingTypeForm.value;

    if (!formValue.code) {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return;
    }

    if (!formValue.description) {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return;
    }
    if (!formValue.color) {
      this.commonService.toastErrorByMsgId('MSG1125')//"color cannot be empty"
      return;
    }
    let length = this.tableData.length;
    this.slNo = length + 1;
    let data = {
      "UNIQUEID": 0,
      "SRNO": this.slNo,
      "MELTYPE_CODE": "Y",
      "MELTYPE_DESCRIPTION": this.commonService.nullToString(this.meltingTypeForm.value.description),
      "KARAT_CODE": this.meltingTypeForm.value.karat,
      "PURITY": this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity),
      "DIVISION_CODE": 'Y',
      "DEF_ALLOY_STOCK": "",
      "DEF_ALLOY_DESCRIPTION": "",
      "ALLOY_PER": this.commonService.decimalQuantityFormat(0, 'AMOUNT'),
    };
    this.tableData.push(data);
  }
  /**use: validations for saving details
   * returns: true or false
   */
  submitValidations(): boolean {
    if (this.content?.FLAG == 'VIEW') return true;
    if (this.content?.FLAG == 'EDIT') {
      this.updateMeltingType();
      return true;
    }
    let form = this.meltingTypeForm.value
    // if (this.commonService.nullToString(form.code) == '') {
    //   this.toastr.error('Code is required');
    //   return true;
    // }
    // if (this.commonService.nullToString(form.description) == '') {
    //   this.toastr.error('description is required');
    //   return true;
    // }
    // if (this.commonService.nullToString(form.color) == '') {
    //   this.toastr.error('color is required');
    //   return true;
    // }


    return false;
  }
  setPostData(form: any) {
    return {
      "MID": this.content?.MID || 0,
      "MELTYPE_CODE": this.commonService.nullToString(form.code?.toUpperCase()),
      "MELTYPE_DESCRIPTION": this.commonService.nullToString(form.description?.toUpperCase()),
      "KARAT_CODE": this.commonService.nullToString(form.karat),
      "PURITY": this.commonService.transformDecimalVB(6, form.purity),
      "METAL_PER": this.commonService.emptyToZero(form.metal),
      "ALLOY_PER": this.commonService.emptyToZero(form.alloy),
      "CREATED_BY": this.commonService.nullToString(this.userName),
      "COLOR": this.commonService.nullToString(form.color?.toUpperCase()),
      "STOCK_CODE": this.commonService.nullToString(form.stockCode),
      "MELTING_TYPE_DETAIL": this.tableData,
    }
  }

  submitValidation(form: any) {
    if (this.commonService.nullToString(form.code) == '') {
      this.commonService.toastErrorByMsgId('MSG1124') //"Code cannot be empty"
      return true
    }

    else if (this.commonService.nullToString(form.description) == '') {
      this.commonService.toastErrorByMsgId('MSG1193')//"description cannot be empty"
      return true
    }
    else if (this.commonService.nullToString(form.color) == '') {
      this.commonService.toastErrorByMsgId('MSG1125')//"color cannot be empty"
      return true
    }

    if (this.tableData.length == 0) {
      this.commonService.toastErrorByMsgId('MSG1453') //details not added
      // this.toastr.error('details not added');
      return true;
    }

    const totalAlloyPer = this.tableData
      .map((item) => parseFloat(item.ALLOY_PER) || 0)
      .reduce((acc, val) => acc + val, 0);

    if (totalAlloyPer !== 100 && totalAlloyPer > 100) {
      this.commonService.toastErrorByMsgId('MSG7954')
      return true
    } else if ((totalAlloyPer !== 100 && totalAlloyPer < 100)) {
      this.commonService.toastErrorByMsgId('MSG7954')
      return true
    }

    // Check if any Default Alloy is empty
    const defaultAlloyEmpty = this.tableData.some(item => !item.DEF_ALLOY_STOCK);
    const defaultAlloyPer = this.tableData.some(item => item.ALLOY_PER == 0);

    if (defaultAlloyPer) {
      this.commonService.toastErrorByMsgId('MSG7954')
      // this.toastr.error("Alloy %  cannot be Zero's ");
      return true;
    }
    if (defaultAlloyEmpty) {
      this.commonService.toastErrorByMsgId('MSG1817')
      // this.toastr.error('Default Alloy cannot be empty');
      return true;
    }

    if (totalAlloyPer < 100) {
      console.log('This Working If Condition');
      this.commonService.toastErrorByMsgId('MSG7954')
      return true
    }
    return false;
  }

  formSubmit() {
    if (this.submitValidations()) return;
    if (this.submitValidation(this.meltingTypeForm.value)) return;


    let API = 'MeltingType/InsertMeltingType';
    let postData = this.setPostData(this.meltingTypeForm.value)

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
                this.meltingTypeForm.reset();
                this.tableData = [];
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


  getRowDataForColumn(arg0: string) {
    throw new Error('Method not implemented.');
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    // Trim the input to 3 letters
    const limitedValue = inputValue.slice(0, 3);

    // Update the input value
    (event.target as HTMLInputElement).value = limitedValue;
  }

  // close(data?: any) {
  //   //TODO reset forms and data before closing
  //   this.activeModal.close(data);
  // }

  close(data?: any) {
    if (data) {
      this.viewMode = true;
      this.activeModal.close(data);
      return
    }
    if (this.content && this.content.FLAG == 'VIEW') {
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

  resetAllocation() { }

  colorDataSelected(data: any) {
    this.meltingTypeForm.controls.color.setValue(data.CODE)
  }

  karatcodeSelected(e: any) {
    console.log(e);
    this.meltingTypeForm.controls.karat.setValue(e.KARAT_CODE);
    this.meltingTypeForm.controls.purity.setValue(e.STD_PURITY);

    console.log(this.meltingTypeForm.value.karat);
    console.log(this.meltingTypeForm.value.purity);

    // Calculate Metal and Alloy percentages
    const purity = e.STD_PURITY;
    const metalPercentage = (purity * 100).toFixed(4);
    const alloyPercentage = (100 - parseFloat(metalPercentage)).toFixed(4);

    // Set the calculated values in the form controls
    this.meltingTypeForm.controls.metal.setValue(this.commonService.decimalQuantityFormat(metalPercentage, 'AMOUNT'));
    this.meltingTypeForm.controls.alloy.setValue(this.commonService.decimalQuantityFormat(alloyPercentage, 'AMOUNT'));
    this.meltingTypeForm.controls.stockCode.setValue('');
    this.stockCodeData.WHERECONDITION = `KARAT_CODE ='${this.meltingTypeForm.value.karat}' AND PURITY = '${this.meltingTypeForm.value.purity}' AND SUBCODE = 0`;
    this.karatCodeEmty()
  }

  StockCodeSelected(e: any) {
    console.log(e);
    this.meltingTypeForm.controls.stockCode.setValue(e.STOCK_CODE);
  }

  karatCodeEmty() {
    if (this.meltingTypeForm.value.karat == '') {
      this.meltingTypeForm.controls.purity.setValue('');
      this.meltingTypeForm.controls.metal.setValue('');
      this.meltingTypeForm.controls.alloy.setValue('');
    }
  }

  setFormValues() {
    if (!this.content) return
    let API = 'MeltingType/GetMeltingTypeWithMID/' + this.content.MID;

    let Sub: Subscription = this.dataService.getDynamicAPI(API)
      .subscribe((result: any) => {
        let data = result.response;
        if (!data) {
          this.commonService.toastErrorByMsgId('MSG2272')//Error occured, please try again
          return
        }
        this.meltingTypeForm.controls.mid.setValue(data.MID);
        this.meltingTypeForm.controls.code.setValue(data.MELTYPE_CODE?.toUpperCase());
        this.meltingTypeForm.controls.description.setValue(data.MELTYPE_DESCRIPTION?.toUpperCase());
        this.meltingTypeForm.controls.karat.setValue(data.KARAT_CODE);
        this.meltingTypeForm.controls.purity.setValue(data.PURITY);
        this.meltingTypeForm.controls.metal.setValue(this.commonService.decimalQuantityFormat(data.METAL_PER, 'AMOUNT'));
        this.meltingTypeForm.controls.alloy.setValue(this.commonService.decimalQuantityFormat(data.ALLOY_PER, 'AMOUNT'));
        this.meltingTypeForm.controls.color.setValue(data.COLOR?.toUpperCase());
        this.meltingTypeForm.controls.stockCode.setValue(data.STOCK_CODE);
        this.tableData = data.MELTING_TYPE_DETAIL;
        this.formatGridData()
      })
    this.subscriptions.push(Sub)
  }
  formatGridData() {
    this.tableData.forEach((item: any) => {
      item.ALLOY_PER = this.commonService.decimalQuantityFormat(item.ALLOY_PER, 'AMOUNT')
    })
  }

  updateMeltingType() {
    // if (this.submitValidations()) return;
    if (this.submitValidation(this.meltingTypeForm.value)) return;

    let API = 'MeltingType/UpdateMeltingType/' + this.meltingTypeForm.value.code;
    let postData = this.setPostData(this.meltingTypeForm.value)

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
                this.meltingTypeForm.reset();
                this.tableData = [];
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

  /**USE: delete Melting Type From Row */
  deleteMeltingType() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content?.MELTYPE_CODE) {
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
        let API = 'MeltingType/DeleteMeltingType/' + this.content?.MELTYPE_CODE;
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
                    this.meltingTypeForm.reset()
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
                    this.meltingTypeForm.reset()
                    this.tableData = []
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

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
      this.subscriptions = []; // Clear the array
    }
  }

  deleteTableData() {
    console.log(this.commonService.transformDecimalVB(6, this.meltingTypeForm.value.purity));
    console.log(this.selectedIndexes);

    if (this.selectedIndexes.length > 0) {
      // Display confirmation dialog before deleting
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
          // Proceed with deletion if user confirms
          this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
          this.resetSrNumber()
        }

      });

    } else {
      // Display error message if no record is selected
      this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
    }
  }

  resetSrNumber() {
    this.tableData.forEach((data, index) => {
      data.SRNO = index + 1
    });
  }



  defaultAlloySelected(data: any, value: any) {
    let stockData = [];
    stockData = this.tableData.filter((item: any) => item.DEF_ALLOY_STOCK == data.STOCK_CODE)
    if (stockData.length > 0) {
      this.commonService.toastErrorByMsgId('MSG1121')
    }
    else {
      console.log(value);
      console.log(data);
      this.tableData[value.data.SRNO - 1].DEF_ALLOY_STOCK = data.STOCK_CODE;
      this.tableData[value.data.SRNO - 1].DEF_ALLOY_DESCRIPTION = data.STOCK_DESCRIPTION;
    }
  }


  alloyPer(event: any, value: any) {
    const enteredValue = parseFloat(event.target.value); // Parse the input as a number
    const formattedValue = this.commonService.decimalQuantityFormat(enteredValue, 'AMOUNT'); // Format the value
    this.tableData[value.data.SRNO - 1].ALLOY_PER = formattedValue;

    // Validate: Show an error if the value is 100 or more
    if (formattedValue >= 101) {
      this.commonService.toastErrorByMsgId('Only Enter Values Less Than 100%');
    }
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
      case 'color':
        this.overlaycolorSearch.showOverlayPanel(event);
        break;
      case 'karat':
        this.overlaykaratSearch.showOverlayPanel(event);
        break;
      case 'stockCode':
        this.overlaystockCodeSearch.showOverlayPanel(event);
        break;
      default:
    }
  }

}
