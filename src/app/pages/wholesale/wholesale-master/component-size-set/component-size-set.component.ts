import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-component-size-set',
  templateUrl: './component-size-set.component.html',
  styleUrls: ['./component-size-set.component.scss']
})
export class ComponentSizeSetComponent implements OnInit {
  @ViewChild('overlaycomponentSizecode') overlaycomponentSizecode!: MasterSearchComponent;

  columnheader: any[] = ['SN', 'Code', 'Description'];
  allMode: string;
  checkBoxesMode: string;
  viewMode: boolean = false;
  codeEnable: boolean = true;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  selectedIndexes: any = [];
  indexes: any[] = [];
  componentSizeType: any[] = [];
  componentSizeDesc: any[] = [];
  selectedOption: any;
  updatedTableData: any;
  editableMode: boolean = false;
  codeSearchText: string = '';
  filteredComponentSizeType: any[] = [];

  componentSizeMaster: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 89,
    SEARCH_FIELD: 'COMPSIZE_CODE',
    SEARCH_HEADING: 'Component size code',
    SEARCH_VALUE: '',
    WHERECONDITION: "COMPSIZE_CODE <> '' ORDER BY COMPSIZE_CODE",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  componentsizesetmasterForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],
    COMPSIZE_CODE: [''],
  });
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private renderer: Renderer2,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  ngOnInit(): void {
    this.getComponentSizeTypeOptions();
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
    } else if (this.content.FLAG == 'EDIT') {
      this.setFormValues();
      this.editableMode = true;
      this.codeEnable = false;
    }else if (this.content.FLAG == 'DELETE') {
      this.viewMode = true;
      this.deleteRecord()
    }
  }

  codeEnabled() {
    if (this.componentsizesetmasterForm.value.code == '') {
      this.codeEnable = true;
    }
    else {
      this.codeEnable = false;
    }
  }

  getComponentSizeTypeOptions() {
    const API = 'ComponentSizeMaster/GetComponentSizeMasterList';
    const Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.componentSizeType = result.response;
        // Sort by COMPSIZE_CODE
        this.componentSizeType.sort((a, b) => a.COMPSIZE_CODE - b.COMPSIZE_CODE);
        // Initialize filtered list to show all options initially
        this.filteredComponentSizeType = this.componentSizeType;
      }
    });
    this.subscriptions.push(Sub);
  }

  onCodeSelect(event: MatSelectChange, data: any) {
    const index = data.data.SRNO - 1;
    const selectedCode = event.value.COMPSIZE_CODE;
    const selectedDescription = this.componentSizeType.find(option => option.COMPSIZE_CODE === selectedCode)?.DESCRIPTION;

    this.tableData[index].COMPONENT_DESCRIPTION = selectedDescription;
    this.tableData[index].COMPSIZE_CODE = selectedCode;
  }

  descriptionData(data: any, value: any) {
    this.tableData[value.data.SRNO - 1].COMPONENT_DESCRIPTION = data.target.value;
  }

  setFormValues() {
    if (!this.content) return
    this.componentsizesetmasterForm.controls.code.setValue(this.content.COMPSET_CODE);
    this.componentsizesetmasterForm.controls.description.setValue(this.content.DESCRIPTION);
    this.dataService.getDynamicAPI('ComponentSizeSetMaster/GetComponentSizeSetMasterDetail/' + this.content.COMPSET_CODE)
      .subscribe((data) => {
        if (data.status == 'Success') {
          this.tableData = data.response.detail;
          // this.selectedOptions = this.tableData.map(item => this.componentSizeType.find(option => option.COMPSIZE_CODE === item.COMPSIZE_CODE) || null);
        }
      });
  }
  getSelectedCompSize(): string {
    return this.componentsizesetmasterForm.value.COMPSIZE_CODE;
  }


  addTableData() {

    let length = this.tableData.length;
    let sn = length + 1;
    let data = {
      "UNIQUEID": 0,
      "SRNO": sn,
      "COMPSIZE_CODE": "",
      "COMPONENT_DESCRIPTION": "",
      "COMPSET_CODE": ""
    };

    this.tableData.push(data);

    // this.selectedOptions.push(null);
  }



  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  onSelectionChanged(event: any) {
    // const values = event.selectedRowKeys;
    // console.log("Selected row keys:", values);
    // console.log("Table data:", this.tableData);

    // this.selectedIndexes = values;
    // console.log("Selected indexes:", this.selectedIndexes-1);
    // this.selectedIndexes-=1;
    // console.log(this.selectedIndexes);


    // // this.tableData.forEach((item: any, i: any) => {
    // //   item.SRNO = i + 1;
    // // });

    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SRNO))) {
        acc.push(index);
        console.log(acc);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);

  }

  deleteTableData() {
    console.log("After Selecting " + this.selectedIndexes);

    if (this.selectedIndexes !== undefined && this.selectedIndexes.length > 0) {
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
          if (this.tableData.length > 0) {
            // Log the selected indexes before filtering
            console.log('Selected indexes to delete:', this.selectedIndexes);

            if (this.selectedIndexes && this.selectedIndexes.length > 0) {
              console.log('Before deletion, tableData length:', this.tableData.length);

              // Filter out items whose index is included in the selectedIndexes
              this.tableData = this.tableData.filter((data, index) => {
                const shouldDelete = !this.selectedIndexes.includes(index);
                console.log(`Index ${index} - Should Delete: ${!shouldDelete}`);
                return shouldDelete;
              });

              console.log('After deletion, tableData length:', this.tableData.length);
              console.log('Table data:', this.tableData);

              // Remove corresponding entries from selectedOptions
              this.selectedOptions = this.selectedOptions.filter((_, index) => !this.selectedIndexes.includes(index));

              // Reset selectedIndexes after deletion
              this.selectedIndexes = [];
              console.log('Selected indexes after reset:', this.selectedIndexes);

              // Show success message after deletion
              this.snackBar.open('Data deleted successfully!', 'OK', { duration: 2000 });

              // Update serial numbers after deletion
              this.tableData.forEach((item: any, i: number) => {
                item.SRNO = i + 1; // Reset serial numbers starting from 1
              });

            } else {
              console.warn('No indexes selected for deletion.');
            }
          } else {
            this.snackBar.open('No data to delete!', 'OK', { duration: 2000 });
          }
        }
      });
    } else {
      this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
    }
  }


  selectedOptions: any[] = Array(this.tableData.length).fill(null);



  isOptionSelected(SRNO: number, option: any): boolean {
    // Check if the option is already selected for another row
    return Object.values(this.selectedOptions).some((value: any) => value && value.COMPSIZE_CODE === option.COMPSIZE_CODE && value.SRNO !== SRNO);
  }



  formSubmit() {
    console.log(this.componentSizeType);
    console.log(this.content);

    // If the form is in edit mode, handle the update
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update();
      return;
    }

    // Check if the form is valid
    if (this.componentsizesetmasterForm.invalid) {
      this.toastr.error('Select all required fields');
      return;
    }

    // Check if the tableData is empty
    if (this.tableData.length == 0) {
      this.commonService.toastErrorByMsgId('MSG1453');  // 'Details not added' error
      return;
    }

    let data: any = false;
    this.tableData.forEach((result: any) => {

      if (result.COMPONENT_DESCRIPTION == '' && result.COMPSIZE_CODE == '') {
        data = true
        this.toastr.error('Grid Values Cannot be Empty');
      }

    })

    if (data == true) {
      return
    }

    let API = 'ComponentSizeSetMaster/InsertComponentSizeSetMaster'
    let postData = {
      "MID": 0,
      "COMPSET_CODE": this.componentsizesetmasterForm.value.code.toUpperCase() || "",
      "DESCRIPTION": this.componentsizesetmasterForm.value.description.toUpperCase() || "",
      "detail": this.tableData,
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
                this.componentsizesetmasterForm.reset()
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


  update() {
    if (this.componentsizesetmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ComponentSizeSetMaster/UpdateComponentSizeSetMaster/' + this.content.COMPSET_CODE
    let postData = {
      "MID": this.content?.MID || 0,
      "COMPSET_CODE": this.componentsizesetmasterForm.value.code || "",
      "DESCRIPTION": this.componentsizesetmasterForm.value.description || "",
      "detail": this.tableData
    }


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
                this.componentsizesetmasterForm.reset()
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
    if (!this.content.MID) {
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
        let API = 'ComponentSizeSetMaster/DeleteComponentSizeSetMaster/' + this.content.COMPSET_CODE
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
                    this.componentsizesetmasterForm.reset()
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
                    this.componentsizesetmasterForm.reset()
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


  checkCodeExists(event: any) {
    if (this.content && this.content.FLAG == 'EDIT') {
      return; // Exit the function if in edit mode
    }

    if (event.target.value === '' || this.viewMode) {
      return; // Exit the function if the input is empty or in view mode
    }

    const API = 'ComponentSizeSetMaster/GetComponentSizeSetMasterDetail/' + event.target.value;
    const sub = this.dataService.getDynamicAPI(API)
      .subscribe((result) => {
        if (result.status == 'Success') {
          Swal.fire({
            title: '',
            text: 'Code Already Exists!',
            icon: 'warning',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then(() => {
            // Clear the input value
            this.componentsizesetmasterForm.controls.code.setValue('');

            setTimeout(() => {
              this.renderer.selectRootElement('#code').focus();
            }, 500);

          });
        }
      }, err => {
        this.componentsizesetmasterForm.reset();
      });

    this.subscriptions.push(sub);
  }
  compSizeCodeSelected(data:any,object:any){
    this.tableData[object.data.SRNO - 1].COMPSIZE_CODE = data.COMPSIZE_CODE;
    this.tableData[object.data.SRNO - 1].COMPONENT_DESCRIPTION = data.DESCRIPTION;
    this.componentsizesetmasterForm.controls.COMPSIZE_CODE.setValue(data.COMPSIZE_CODE)
  }
 
  validateLookupField(event: any, LOOKUPDATA: MasterSearchModel, FORMNAME: string,griddata:any) {
    LOOKUPDATA.SEARCH_VALUE = event.target.value
    if (event.target.value == '' || this.viewMode == true) return
    let param = {
      LOOKUPID: LOOKUPDATA.LOOKUPID,
      WHERECOND: `${LOOKUPDATA.SEARCH_FIELD}='${event.target.value}' ${LOOKUPDATA.WHERECONDITION ? `AND ${LOOKUPDATA.WHERECONDITION}` : ''}`
    }
    this.commonService.toastInfoByMsgId('MSG81447');
    let API = `UspCommonInputFieldSearch/GetCommonInputFieldSearch`
    let Sub: Subscription = this.dataService.postDynamicAPI(API, param)
      .subscribe((result) => {
        let data = this.commonService.arrayEmptyObjectToString(result.dynamicData[0])
        if (data.length == 0) {
          this.commonService.toastErrorByMsgId('MSG1531')
          this.componentsizesetmasterForm.controls[FORMNAME].setValue('')
          if(FORMNAME == 'COMPSIZE_CODE'){
            this.tableData[griddata.data.SRNO - 1].COMPSIZE_CODE = '';
            this.tableData[griddata.data.SRNO - 1].COMPONENT_DESCRIPTION = '';
          }
          LOOKUPDATA.SEARCH_VALUE = ''
          return
        }
        if(FORMNAME == 'COMPSIZE_CODE'){
          this.tableData[griddata.data.SRNO - 1].COMPSIZE_CODE = data[0].COMPSIZE_CODE;
          this.tableData[griddata.data.SRNO - 1].COMPONENT_DESCRIPTION = data[0].DESCRIPTION;
        }
      }, err => {
        this.commonService.toastErrorByMsgId('MSG2272')
      })
    this.subscriptions.push(Sub)
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
      case 'COMPSIZE_CODE':
        this.overlaycomponentSizecode.showOverlayPanel(event)
        break;
        default:
        break
    }
  }
}
