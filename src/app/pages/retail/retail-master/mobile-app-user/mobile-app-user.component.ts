import { Component, Input, OnInit } from '@angular/core';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mobile-app-user',
  templateUrl: './mobile-app-user.component.html',
  styleUrls: ['./mobile-app-user.component.scss']
})
export class MobileAppUserComponent implements OnInit {
  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];
  
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }
 
  ngOnInit(): void {
  }

  mobileAppUserForm: FormGroup = this.formBuilder.group({
   code:['']

  })

  typeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeCodeSelected(e:any){
    console.log(e);
    this.mobileAppUserForm.controls.type.setValue(e.CODE);
  }

  divisionCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 18,
    SEARCH_FIELD: 'DIVISION_CODE',
    SEARCH_HEADING: 'Division',
    SEARCH_VALUE: '',
    WHERECONDITION: "DIVISION_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  divisionCodeSelected(e:any){
    console.log(e);
    this.mobileAppUserForm.controls.division.setValue(e.DIVISION_CODE);
    this.mobileAppUserForm.controls.divisionDesc.setValue(e.DESCRIPTION)
  }

  branchCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 13,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchCodeSelected(e:any){
    console.log(e);
    this.mobileAppUserForm.controls.branch.setValue(e.BRANCH_CODE);
  }

  PLACCodeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'ACCODE',
    SEARCH_HEADING: 'P/L Ac Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "ACCODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  
  PLACCodeCodeSelected(e:any){
    console.log(e);
    this.mobileAppUserForm.controls.PLACCode1.setValue(e.ACCODE);
    this.mobileAppUserForm.controls.PLACCode2.setValue(e.ACCODE);
    this.mobileAppUserForm.controls.PLACCode3.setValue(e.ACCODE);
    this.mobileAppUserForm.controls.PLACCode4.setValue(e.ACCODE);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.mobileAppUserForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'LocationMaster/InsertLocationMaster'
    let postData = {
      "MID": 0,
      "LOCATION_CODE": this.mobileAppUserForm.value.locationcode || "",
      "DESCRIPTION": this.mobileAppUserForm.value.codedesc || "",
      "DIVISION_CODE": this.mobileAppUserForm.value.division || "",
      "LOCTYPE_CODE": this.mobileAppUserForm.value.type || "",
      "PIECES": 0,
      "ALWAYS_FULL": true,
      "SYSTEM_DATE": "2023-11-27T07:10:12.051Z",
      "INTRANSIT_LOC": true,
      "AVOIDFORSALES": true,
      "PROFIT1_PER": 0,
      "PROFIT2_PER": 0,
      "PROFIT3_PER": 0,
      "PROFIT_ACCODE1": this.mobileAppUserForm.value.PLACCode1 || "",
      "PROFIT_ACCODE2": this.mobileAppUserForm.value.PLACCode2 || "",
      "PROFIT_ACCODE3": this.mobileAppUserForm.value.PLACCode3 || "",
      "PROFIT_CREDITACCODE":this.mobileAppUserForm.value.PLACCode4 || "",
      "LOC_BRANCHCODE": this.mobileAppUserForm.value.branch || "",
      "BOXDETAIL_VALUE": true,
      "MAIN_LOC": true
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
                this.mobileAppUserForm.reset()
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
    if (this.mobileAppUserForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'LocationMaster/UpdateLocationMaster/'+this.content.LOCATION_CODE
    let postData = 
    {
      "MID": 0,
      "LOCATION_CODE": this.mobileAppUserForm.value.code || "",
      "DESCRIPTION": this.mobileAppUserForm.value.codedesc || "",
      "DIVISION_CODE": this.mobileAppUserForm.value.division || "",
      "LOCTYPE_CODE": this.mobileAppUserForm.value.type || "",
      "PIECES": 0,
      "ALWAYS_FULL": true,
      "SYSTEM_DATE": "2023-11-27T07:10:12.051Z",
      "INTRANSIT_LOC": true,
      "AVOIDFORSALES": true,
      "PROFIT1_PER": 0,
      "PROFIT2_PER": 0,
      "PROFIT3_PER": 0,
      "PROFIT_ACCODE1": this.mobileAppUserForm.value.PLACCode1 || "",
      "PROFIT_ACCODE2": this.mobileAppUserForm.value.PLACCode2 || "",
      "PROFIT_ACCODE3": this.mobileAppUserForm.value.PLACCode3 || "",
      "PROFIT_CREDITACCODE":this.mobileAppUserForm.value.PLACCode4 || "",
      "LOC_BRANCHCODE": this.mobileAppUserForm.value.branch || "",
      "BOXDETAIL_VALUE": true,
      "MAIN_LOC": true
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
                this.mobileAppUserForm.reset()
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
        let API = 'LocationMaster/DeleteLocationMaster/' + this.content.LOCATION_CODE
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
                    this.mobileAppUserForm.reset()
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
                    this.mobileAppUserForm.reset()
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
