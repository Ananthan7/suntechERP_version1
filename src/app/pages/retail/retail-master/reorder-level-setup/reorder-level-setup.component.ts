import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-reorder-level-setup',
  templateUrl: './reorder-level-setup.component.html',
  styleUrls: ['./reorder-level-setup.component.scss']
})
export class ReorderLevelSetupComponent implements OnInit {
  vocMaxDate = new Date();
  currentDate = new Date();
  private subscriptions: Subscription[] = [];

  @Input() content!: any;
  tableData: any[] = [];
  viewMode: boolean = false;
  editMode:boolean = false;
  groupOptions: any[] = [];

  columnHeadings: any[] = [
    { field: "PARTYCODE", caption: "Sr" },
    { field: "BRANCH_CODE", caption: "Recorder Group" },
    { field: "VOCTYPE", caption: "Recorder Group" },
    { field: "DIVISION", caption: "Recorder Group" },
    { field: "QTY", caption: "Weight" },
    { field: "amount", caption: "Pcs" },
    { field: "PROFIT", caption: "Amount" },
  ];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  reorderLevelSetupMainForm: FormGroup = this.formBuilder.group({

   code:[''],
   Metalsoption:[''],
   group1:[''],
   group2:[''],
   group3:[''],


  });


  ngOnInit(): void {
    this.getGroup();

    if (this.content?.FLAG) {
      this.setFormValues();
      console.log(this.content)
      //this.setFormValues();
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
    console.log(this.content);
    if (!this.content) return
    this.reorderLevelSetupMainForm.controls.code.setValue(this.content.REORDER_CODE)
    this.reorderLevelSetupMainForm.controls.Metalsoption.setValue(this.content.METAL_DIAMOND == 'Y' ? 'metal' : 'diamond')
    this.reorderLevelSetupMainForm.controls.group1.setValue(this.content.GROUP1_TYPE)
    this.reorderLevelSetupMainForm.controls.group2.setValue(this.content.GROUP2_TYPE)
    this.reorderLevelSetupMainForm.controls.group3.setValue(this.content.GROUP3_TYPE)
  }

  setPostData(){
    return {
      "REORDER_CODE": this.reorderLevelSetupMainForm.value.code.toUpperCase(),
      "REORDER_DESCRIPTION": "string",
      "METAL_DIAMOND": this.reorderLevelSetupMainForm.value.Metalsoption == 'metal' ? true : false,
      "GROUP1_TYPE": this.reorderLevelSetupMainForm.value.group1,
      "GROUP2_TYPE": this.reorderLevelSetupMainForm.value.group2,
      "GROUP3_TYPE": this.reorderLevelSetupMainForm.value.group3,
      "SYSTEM_DATE": "2024-12-02T09:58:42.903Z",
      "MID": 0,
      "Details": [
        {
          "REORDER_CODE": "string",
          "BRANCH_CODE": "string",
          "SRNO": 0,
          "REORDER_GROUP1": "string",
          "REORDER_GROUP2": "string",
          "REORDER_GROUP3": "string",
          "REORDER_AMOUNT": 0,
          "REORDER_WEIGHT": 0,
          "REORDER_PCS": 0,
          "UNIQUEID": 0
        }
      ]
    }
  }



  formSubmit(){
    
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    // if (this.diamondprefixForm.invalid) {
    //   this.toastr.error('select all required fields')
    //   return
    // }

    let API = 'ReorderMaster/InsertReorderMaster'
    let postData = this.setPostData();
    console.log(postData);
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
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
                this.reorderLevelSetupMainForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update(){
    if (this.reorderLevelSetupMainForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'ReorderMaster/UpdateReorderMaster/' + this.content.REORDER_CODE;
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
                this.reorderLevelSetupMainForm.reset()
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
        let API = 'ReorderMaster/DeleteReorderMaster/' + this.content.REORDER_CODE;
        let Sub: Subscription = this.dataService.deleteDynamicAPI(API)
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
                  this.reorderLevelSetupMainForm.reset()
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
                  this.reorderLevelSetupMainForm.reset()
                  this.tableData = []
                  this.close()
                }
              });
            }
          }, err => alert(err))
        this.subscriptions.push(Sub)
      }
    });
  }

  // onGroupChange() {
  //   const group1Value = this.reorderLevelSetupMainForm.get('group1')?.value;
  //   const group2Value = this.reorderLevelSetupMainForm.get('group2')?.value;
  //   const group3Value = this.reorderLevelSetupMainForm.get('group3')?.value;

  //   if (group1Value && group2Value && group1Value === group2Value) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Selection',
  //       text: 'Filter Already Exsist.',
  //     }).then(() => {
  //       this.reorderLevelSetupMainForm.get('group2')?.reset();
  //     });
      
  //     return;
  //   }

  //   if (group1Value && group3Value && group1Value === group3Value) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Selection',
  //       text: 'Filter Already Exsist.',
  //     }).then(() => {
  //       this.reorderLevelSetupMainForm.get('group3')?.reset();
  //     });
  //     return;
  //   }

  //   if (group2Value && group3Value && group2Value === group3Value) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Selection',
  //       text: 'Filter Already Exsist.',
  //     }).then(() => {
  //       this.reorderLevelSetupMainForm.get('group3')?.reset();
  //     });
  //     return;
  //   }
  // }

  onGroupChange() {
    const group1Value = this.reorderLevelSetupMainForm.get('group1')?.value;
    const group2Value = this.reorderLevelSetupMainForm.get('group2')?.value;
    const group3Value = this.reorderLevelSetupMainForm.get('group3')?.value;
  
    const isNone = (value: any) => value === 'None';
  
    if (
      group1Value &&
      group2Value &&
      group1Value === group2Value &&
      !isNone(group1Value)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Selection',
        text: 'Filter Already Exists.',
      }).then(() => {
        this.reorderLevelSetupMainForm.get('group2')?.reset();
      });
      return;
    }
  
    if (
      group1Value &&
      group3Value &&
      group1Value === group3Value &&
      !isNone(group1Value)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Selection',
        text: 'Filter Already Exists.',
      }).then(() => {
        this.reorderLevelSetupMainForm.get('group3')?.reset();
      });
      return;
    }
  
    if (
      group2Value &&
      group3Value &&
      group2Value === group3Value &&
      !isNone(group2Value)
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Selection',
        text: 'Filter Already Exists.',
      }).then(() => {
        this.reorderLevelSetupMainForm.get('group3')?.reset();
      });
      return;
    }
  }
  

  getGroup() {
    this.dataService.getDynamicAPI('WhlSmanTargetHeader/GetInventoryCombofilters/')
      .subscribe((data) => {
        if (data.status === 'Success' && data.dynamicData.length > 0) {
          this.groupOptions = data.dynamicData[0].map((item: any) => item.DispName);
        }
      });
  }
  

}
