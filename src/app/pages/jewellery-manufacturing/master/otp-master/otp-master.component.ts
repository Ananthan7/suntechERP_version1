import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { MasterSearchComponent } from 'src/app/shared/common/master-search/master-search.component';

@Component({
  selector: 'app-otp-master',
  templateUrl: './otp-master.component.html',
  styleUrls: ['./otp-master.component.scss']
})
export class OtpMasterComponent implements OnInit {
  @ViewChild('overlaybranchSearch') overlaybranchSearch!: MasterSearchComponent;

  

  columnheader:any[] = ['S.No','Level','User', 'Mobile Number','Mobile Number','Email'];

  subscriptions: any;
  @Input() content!: any; 
  tableData: any[] = [];

  constructor( 
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    ) { }
 
  ngOnInit(): void {
  }
  otpForm: FormGroup = this.formBuilder.group({
  
    branch:['',[Validators.required]],
    branchdesc:['', [Validators.required]],

  })
  branchCodeData:MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 5,
    SEARCH_FIELD: 'BRANCH_CODE',
    SEARCH_HEADING: 'Branch Data',
    SEARCH_VALUE: '',
    WHERECONDITION: "BRANCH_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  branchSelected(e:any){
    console.log(e); 
    this.otpForm.controls.branch.setValue(e.BRANCH_CODE);
    this.otpForm.controls.branchdesc.setValue(e.BRANCH_NAME);
  }

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
  formSubmit(){
    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.otpForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'OTPMaster/InsertOTPMaster'
    let postData = {
      "BRANCH_CODE":this.otpForm.value.branch || "",
      "BRANCH_DESCRIPTION": this.otpForm.value.branchdesc || "",
      "OTP_LEVEL": "string",
      "LEVEL_USER": "string",
      "LEVEL_MOBILE1": "string",
      "LEVEL_MOBILE2": "string",
      "LEVEL_EMAIL": "string",
      "SYSTEM_DATE": "2023-11-27T09:50:31.796Z",
      "MID": 0
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
                this.otpForm.reset()
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
    if (this.otpForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'OTPMaster/UpdateOTPMaster/'+this.content.MID
    let postData = 
    {
      "BRANCH_CODE": "string",
      "BRANCH_DESCRIPTION": "string",
      "OTP_LEVEL": "string",
      "LEVEL_USER": "string",
      "LEVEL_MOBILE1": "string",
      "LEVEL_MOBILE2": "string",
      "LEVEL_EMAIL": "string",
      "SYSTEM_DATE": "2023-11-27T09:54:58.976Z",
      "MID": 0
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
                this.otpForm.reset()
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
    if (this.content && this.content.FLAG == 'VIEW') return
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
        let API = 'OTPMaster/DeleteOTPMaster/' + this.content.MID
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
                    this.otpForm.reset()
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
                    this.otpForm.reset()
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

  // lookupKeyPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //   }
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

  branchValidate(event: any) {
    
    if (event.target.value == '') {
      this.showOverleyPanel(event, 'branch')
      return
    }
  }
  showOverleyPanel(event: any, formControlName: string) {

    if (formControlName == 'branch') {
      this.overlaybranchSearch.showOverlayPanel(event)
    }
  }
}
