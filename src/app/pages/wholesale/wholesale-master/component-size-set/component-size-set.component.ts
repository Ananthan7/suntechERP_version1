import { ChangeDetectorRef, Component, Input, OnInit, Renderer2 } from '@angular/core';
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

@Component({
  selector: 'app-component-size-set',
  templateUrl: './component-size-set.component.html',
  styleUrls: ['./component-size-set.component.scss']
})
export class ComponentSizeSetComponent implements OnInit {

  columnheader: any[] = ['SN', 'Code', 'Description'];
  allMode: string;
  checkBoxesMode: string;
  viewMode: boolean = false;
  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  tableData: any[] = [];
  selectedIndexes: any = [];
  indexes: any[] = [];
  componentSizeType: any[] = [];
  componentSizeDesc: any[] = [];
  selectedOption: any;
  editableMode: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
  ) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  // codetemp(data: any, value: any) {
  //   console.log(data);
  //   this.tableData[value.data.SRNO - 1].COMPSIZE_CODE =  data.data.value;
  // }

  // descriptiontemp(data: any, value: any) {
  //   this.tableData[value.data.SRNO - 1].COMPONENT_DESCRIPTION = data.data.value;
  // }

  ngOnInit(): void {
   
    console.log(this.content);
    if (this.content) {
      this.setFormValues()

    }
    this.getComponentSizeTypeOptions();

    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      this.setFormValues();
      // this.processMasterForm();
    } else if (this.content.FLAG == 'EDIT') {
      this.setFormValues();
      this.editableMode = true;
      this.getComponentSizeTypeOptions();
    }
  }

  getComponentSizeTypeOptions() {

    const API = 'ComponentSizeMaster/GetComponentSizeMasterList';
    const Sub: Subscription = this.dataService.getDynamicAPI(API).subscribe((result) => {
      if (result.response) {
        this.componentSizeType = result.response;
        //  this.componentSizeDesc = result.response.DESCRIPTIONW;

        this.componentSizeType.sort((a, b) => a.COMPSIZE_CODE - b.COMPSIZE_CODE);
        //  this.componentSizeDesc.sort((a, b) => a.DESCRIPTION - b.COMPSIZE_CODE);

        console.log(this.componentSizeType); // Log here to check the data

        this.setFormValues();
      }
    });
    this.subscriptions.push(Sub);
  }



  setFormValues() {

    if (!this.content) return
    this.componentsizesetmasterForm.controls.code.setValue(this.content.COMPSET_CODE);
    this.componentsizesetmasterForm.controls.description.setValue(this.content.DESCRIPTION);

    this.dataService.getDynamicAPI('ComponentSizeSetMaster/GetComponentSizeSetMasterDetail/' + this.content.COMPSET_CODE)
      .subscribe((data) => {
        if (data.status == 'Success') {

          this.tableData = data.response.detail;
          console.log(data.response.detail);
          this.selectedOptions = this.tableData.map(item => this.componentSizeType.find(option => option.COMPSIZE_CODE === item.COMPSIZE_CODE) || null);
   
        }
      });
  }

  // setFormValues() {
  //   if (!this.content) return;

  //   this.componentsizesetmasterForm.controls.code.setValue(this.content.COMPSET_CODE);
  //   this.componentsizesetmasterForm.controls.description.setValue(this.content.DESCRIPTION);

  //   this.dataService.getDynamicAPI('ComponentSizeSetMaster/GetComponentSizeSetMasterDetail/' + this.content.COMPSET_CODE)
  //     .subscribe((data) => {
  //       if (data.status === 'Success') {
  //         this.tableData = data.response.detail;
  //         console.log(data.response.detail);
          
  //         // Initialize selectedOptions based on the fetched data
  //         this.selectedOptions = this.tableData.map(item => ({
  //           SRNO: item.SRNO,
  //           COMPSIZE_CODE: item.COMPSIZE_CODE,
  //           DESCRIPTION: item.COMPONENT_DESCRIPTION
  //         }));
  //       }
  //     });
  // }



  componentsizesetmasterForm: FormGroup = this.formBuilder.group({
    code: ['', [Validators.required]],
    description: ['', [Validators.required]],

  });


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
      "COMPSET_CODE": this.componentsizesetmasterForm.value.code
    };

    this.tableData.push(data);

    this.selectedOptions.push(null);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log("Selected row keys:", values);
    console.log("Table data:", this.tableData);

    this.selectedIndexes = values;
    console.log("Selected indexes:", this.selectedIndexes);

    // this.tableData.forEach((item: any, i: any) => {
    //   item.SRNO = i + 1;
    // });

  }



  // deleteTableData() {

  //   if (this.selectedIndexes != undefined) {
  //     // Display confirmation dialog before deleting
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // Proceed with deletion if user confirms
  //         this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));

  //         // console.log(this.selectedIndexes);
  //         this.tableData.forEach((element:any, index:number) =>{

  //           if(element.SRNO == this.selectedIndexes[0]){

  //             this.tableData.splice(index,1)

  //           }

  //         })
  //         //this.tableData = this.tableData;
  //         this.resetSrNumber()
  //       }

  //     });

  //   } else {
  //     // Display error message if no record is selected
  //     this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
  //   }

  //   // for (let i = 0; i < this.tableData.length; i++) {


  //   //   for (let j = 0; j < this.selectedIndexes.length; j++) {

  //   //     if (this.tableData[i].SRNO == this.selectedIndexes[j]) {

  //   //       this.tableData.splice(i, 1);
  //   //     }
  //   //   }
  //   // }
  // }


  // deleteTableData() {
  //   if (this.selectedIndexes !== undefined && this.selectedIndexes.length > 0) {
  //     // Display confirmation dialog before deleting
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete!'
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         // Proceed with deletion if user confirms
  //         this.selectedIndexes.sort((a:any, b:any) => b - a); // Sort indexes in descending order to prevent issues with splice
  //         for (const index of this.selectedIndexes) {
  //           this.tableData.splice(index, 1); // Remove the item at the specified index
  //         }
  //         this.resetSrNumber();
  //       }
  //     });
  //   } else {
  //     // Display error message if no record is selected
  //     this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
  //   }
  // }


  // resetSrNumber() {
  //   this.tableData.forEach((data, index) => {
  //     data.SRNO = index + 1
  //   });

  // }

  deleteTableData() {
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
          // Create a copy of the indexes to avoid issues if selectedIndexes changes during the loop
          const indexesToDelete = [...this.selectedIndexes].sort((a: number, b: number) => b - a);
          for (const index of indexesToDelete) {
            this.tableData.splice(index, 1); // Remove the item at the specified index
          }
          // Reset selectedIndexes after deletion
          this.selectedIndexes = [];
          // Update serial numbers
          this.resetSrNumber();
        }
      });
    } else {
      // Display error message if no record is selected
      this.snackBar.open('Please select a record', 'OK', { duration: 2000 });
    }
  }

  resetSrNumber() {
    this.tableData.forEach((data, index) => {
      data.SRNO = index + 1; // Update SRNO to be 1-based index
    });
    // Refresh the data source binding to reflect the changes in the UI
    this.tableData = [...this.tableData];
  }



  formSubmit() {
    console.log(this.componentSizeType);
    console.log(this.content);
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.componentsizesetmasterForm.invalid) {
      this.toastr.error('select all required fields')
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
      "MID": 0,
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
  selectedOptions: any[] = Array(this.tableData.length).fill(null);

  onCodeSelect(event: MatSelectChange, data: any) {
    console.log(data);

    let index = data.data.SRNO - 1;
    const selectedCode = event.value.COMPSIZE_CODE;
    // Find the corresponding description for the selected code
    const selectedDescription = this.componentSizeType.find(option => option.COMPSIZE_CODE === selectedCode)?.DESCRIPTION;

    // this.selectedOptions[data.data.SRNO] = event.value;
    // Update the description in the grid data
    // data.data.COMPONENT_DESCRIPTION = selectedDescription;
    // data.data.COMPSIZE_CODE = selectedCode;

    let lastIndex = this.tableData.length - 1

    this.tableData[index].COMPONENT_DESCRIPTION = selectedDescription;
    this.tableData[index].COMPSIZE_CODE = selectedCode;


  }

  isOptionSelected(SRNO: number, option: any): boolean {
    // Check if the option is already selected for another row
    return Object.values(this.selectedOptions).some((value: any) => value && value.COMPSIZE_CODE === option.COMPSIZE_CODE && value.SRNO !== SRNO);
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
            text:'Code Already Exists!',
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

 
  
}
