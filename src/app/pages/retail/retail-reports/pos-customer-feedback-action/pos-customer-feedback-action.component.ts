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
  selector: 'app-pos-customer-feedback-action',
  templateUrl: './pos-customer-feedback-action.component.html',
  styleUrls: ['./pos-customer-feedback-action.component.scss']
})
export class PosCustomerFeedbackActionComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() content!: any;
  currentDate = new Date();
  viewMode: boolean = false;
  editMode:boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
  ) { }

  ngOnInit(): void {
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

  posActionForm: FormGroup = this.formBuilder.group({
    
    completion_date: [''],
    assigned_to: [''],
    assigned_by: [''],
    phone_call: [''],
    mobile: [''],
    sms: [''],
    sms_mobile: [''],
    email: [''],
    email_id: [''],
    visit: [''],
    completed_by: [''],
    completed_date: [''],
    completed_details: [''],
    complaint_details: [''],
    remarks: [''],
    details:['']
    
  });

  assignedtoCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Assigned To Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  assignedtoCodeSelected(e: any) {
    console.log(e);
    this.posActionForm.controls.assigned_to.setValue(e.UsersName);
  }

  assignedbyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Assigned By Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  assignedbyCodeSelected(e: any) {
    console.log(e);
    this.posActionForm.controls.assigned_by.setValue(e.UsersName);
  }

  completedbyCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 73,
    SEARCH_FIELD: 'UsersName',
    SEARCH_HEADING: 'Assigned By Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "UsersName<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  completedbyCodeSelected(e: any) {
    console.log(e);
    this.posActionForm.controls.completed_by.setValue(e.UsersName);
  }

  setFormValues(){
    this.posActionForm.controls.phone_call.setValue(this.content.PHONECALL)
    this.posActionForm.controls.sms.setValue(this.content.SMS)
    this.posActionForm.controls.email.setValue(this.content.EMAIL)
    this.posActionForm.controls.visit.setValue(this.content.VISIT)
    this.posActionForm.controls.remarks.setValue(this.content.REMARKS)
    this.posActionForm.controls.completion_date.setValue(this.content.COMPLETIONDATE)
    this.posActionForm.controls.completed_by.setValue(this.content.COMPLETEDBY)
    this.posActionForm.controls.completed_details.setValue(this.content.COMPLETEDREMARKS)
    this.posActionForm.controls.completed_date.setValue(this.content.COMPLETEDDATE)
    this.posActionForm.controls.assigned_by.setValue(this.content.ASSIGN_BY)
    this.posActionForm.controls.mobile.setValue(this.content.MOBILE)
    this.posActionForm.controls.sms_mobile.setValue(this.content.SMS_MOBILE)
    this.posActionForm.controls.email_id.setValue(this.content.EMAIL_ID)

  }

  setPostData(){
    return {
      "MID": 0,
      "CODE": "Mb3",
      "FEEDBACKMID": 0,
      "PHONECALL":  this.commonService.nullToString(this.posActionForm.value.phone_call),
      "SMS":  this.commonService.nullToString(this.posActionForm.value.sms),
      "EMAIL":  this.commonService.nullToString(this.posActionForm.value.email),
      "VISIT":  this.commonService.nullToString(this.posActionForm.value.visit),
      "REMARKS":  this.commonService.nullToString(this.posActionForm.value.remarks),
      "COMPLETIONDATE":  this.posActionForm.value.completion_date,
      "SALESPERSONCODE": "",
      "COMPLAINMID": "",
      "COMPLETEDBY":  this.commonService.nullToString(this.posActionForm.value.completed_by),
      "COMPLETEDREMARKS":  this.commonService.nullToString(this.posActionForm.value.completed_details),
      "COMPLETEDDATE":  this.posActionForm.value.completed_date,
      "ASSIGN_BY":  this.commonService.nullToString(this.posActionForm.value.assigned_by),
      "REFNO": "",
      "MOBILE":  this.commonService.nullToString(this.posActionForm.value.mobile),
      "SMS_MOBILE":  this.commonService.nullToString(this.posActionForm.value.sms_mobile),
      "VISIT_ADDRESS": "",
      "COMMENTS": "",
      "COMPLAINT_STATUS": "",
      "EMAIL_ID":  this.commonService.nullToString(this.posActionForm.value.email_id)
    }
    
  }

  formSubmit() {
  

    if (this.posActionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'POSAction/InsertPOSAction'
    let postData = this.setPostData();
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
                this.posActionForm.reset()
                this.close('reloadMainGrid')
              }
            });
          }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.posActionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    
    let API = `POSAction/UpdatePOSAction/${this.content.CODE}`
    let postData = this.setPostData();
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
                this.posActionForm.reset()
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
        let API = `POSAction/DeletePOSAction/${this.content.CODE}`
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
                    this.posActionForm.reset()
                    
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
                    this.posActionForm.reset()
                  
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

}
