import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';  
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos-customer-feedback-action',
  templateUrl: './pos-customer-feedback-action.component.html',
  styleUrls: ['./pos-customer-feedback-action.component.scss']
})
export class PosCustomerFeedbackActionComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  @Input() content!: any;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
  }

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
    
  });

  formSubmit() {
  

    if (this.posActionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = 'POSAction/InsertPOSAction'
    let postData ={
      "MID": 0,
      "CODE": " ",
      "FEEDBACKMID": 0,
      "PHONECALL": this.posActionForm.value.phone_call,
      "SMS": this.posActionForm.value.sms,
      "EMAIL": this.posActionForm.value.email,
      "VISIT": this.posActionForm.value.visit,
      "REMARKS": this.posActionForm.value.remarks,
      "COMPLETIONDATE": "2024-03-12T08:31:39.525Z",
      "SALESPERSONCODE": " ",
      "COMPLAINMID": " ",
      "COMPLETEDBY": this.posActionForm.value.completed_by,
      "COMPLETEDREMARKS": this.posActionForm.value.completed_details,
      "COMPLETEDDATE": "2024-03-12T08:31:39.525Z",
      "ASSIGN_BY": this.posActionForm.value.assigned_by,
      "REFNO": " ",
      "MOBILE": this.posActionForm.value.mobile,
      "SMS_MOBILE": this.posActionForm.value.sms_mobile,
      "VISIT_ADDRESS": " ",
      "COMMENTS": " ",
      "COMPLAINT_STATUS": " ",
      "EMAIL_ID": this.posActionForm.value.email_id
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

  update() {
    if (this.posActionForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    
    let API = `POSAction/UpdatePOSAction/${this.content.MID}`
    let postData = {
      "MID": 0,
      "CODE": " ",
      "FEEDBACKMID": 0,
      "PHONECALL": this.posActionForm.value.phone_call,
      "SMS": this.posActionForm.value.sms,
      "EMAIL": this.posActionForm.value.email,
      "VISIT": this.posActionForm.value.visit,
      "REMARKS": this.posActionForm.value.remarks,
      "COMPLETIONDATE": "2024-03-12T09:01:01.008Z",
      "SALESPERSONCODE": " ",
      "COMPLAINMID": " ",
      "COMPLETEDBY":  this.posActionForm.value.completed_by,
      "COMPLETEDREMARKS": this.posActionForm.value.completed_details,
      "COMPLETEDDATE": "2024-03-12T09:01:01.008Z",
      "ASSIGN_BY": this.posActionForm.value.assigned_by,
      "REFNO": " ",
      "MOBILE":  this.posActionForm.value.mobile,
      "SMS_MOBILE": this.posActionForm.value.sms_mobile,
      "VISIT_ADDRESS": " ",
      "COMMENTS": " ",
      "COMPLAINT_STATUS": " ",
      "EMAIL_ID": this.posActionForm.value.email_id
      
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
        let API = `POSAction/DeletePOSAction/{MID}`
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
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

}
