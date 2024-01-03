import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import themes from 'devextreme/ui/themes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-component-size-set',
  templateUrl: './component-size-set.component.html',
  styleUrls: ['./component-size-set.component.scss']
})
export class ComponentSizeSetComponent implements OnInit {

  columnheader:any[] = ['SN','Code','Description'];
  allMode: string;
  checkBoxesMode: string;

subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  selectedIndexes: any = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private snackBar: MatSnackBar,
    private commonService: CommonServiceService,
  ) { 
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
  }

  codetemp(data:any,value: any){
    console.log(data);
    this.tableData[value.data.SN - 1].Code = data.target.value;
  }

  descriptiontemp(data:any,value: any){
    this.tableData[value.data.SN - 1].DESCRIPTION = data.target.value;
  }
 
  ngOnInit(): void {
    console.log(this.content);
    if(this.content){
      this.setFormValues()
    }
  }

  setFormValues() {
    if(!this.content) return
    this.componentsizesetmasterForm.controls.code.setValue(this.content.COMPSET_CODE)
    this.componentsizesetmasterForm.controls.description.setValue(this.content.DESCRIPTION)


    this.dataService.getDynamicAPI('ComponentSizeSetMaster/GetComponentSizeSetMasterDetail/'+this.content.COMPSET_CODE).subscribe((data) => {
      if (data.status == 'Success') {

        this.tableData = data.response.approvalDetails;
       

      }
    });
   
  }

  componentsizesetmasterForm: FormGroup = this.formBuilder.group({
    code:['',[Validators.required]],
    description  : ['',[Validators.required]],
  
   });
   addTableData(){
    let length = this.tableData.length;
    let sn = length + 1;
    let data =  {
      "SN": sn,
      "Code": "",
      "DESCRIPTION": "",
    };
    this.tableData.push(data);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  onSelectionChanged(event: any) {
    const values = event.selectedRowKeys;
    console.log(values);
    let indexes: Number[] = [];
    this.tableData.reduce((acc, value, index) => {
      if (values.includes(parseFloat(value.SN))) {
        acc.push(index);
      }
      return acc;
    }, indexes);
    this.selectedIndexes = indexes;
    console.log(this.selectedIndexes);
    
  }

  deleteTableData(){
    console.log(this.selectedIndexes);
  
    if (this.selectedIndexes.length > 0) {
      this.tableData = this.tableData.filter((data, index) => !this.selectedIndexes.includes(index));
    } else {
      this.snackBar.open('Please select record', 'OK', { duration: 2000 }); // need proper err msg.
    }   
  }
  
  formSubmit(){

    if(this.content && this.content.FLAG == 'EDIT'){
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
      "COMPSET_CODE":  this.componentsizesetmasterForm.value.code || "",
      "DESCRIPTION":  this.componentsizesetmasterForm.value.description || "",
      "approvalDetails": this.tableData,
      "detail": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "COMPSIZE_CODE": "string",
          "COMPONENT_DESCRIPTION": "string",
          "COMPSET_CODE": "string"
        }
      ]
    }
    
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
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
  update(){
    if (this.componentsizesetmasterForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'ComponentSizeSetMaster/UpdateComponentSizeSetMaster/'+this.content.COMPSET_CODE
    let postData = 
    {
      "MID": 0,
      "COMPSET_CODE": "string",
      "DESCRIPTION": "string",
      "detail": [
        {
          "UNIQUEID": 0,
          "SRNO": 0,
          "COMPSIZE_CODE": "string",
          "COMPONENT_DESCRIPTION": "string",
          "COMPSET_CODE": "string"
        }
      ]
    }
    
  
    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if(result.status == "Success"){
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

}
