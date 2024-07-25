import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pos-walkin-customer',
  templateUrl: './pos-walkin-customer.component.html',
  styleUrls: ['./pos-walkin-customer.component.scss']
})
export class PosWalkinCustomerComponent implements OnInit {
  
  branchCode?: String;
  yearMonth?: String;
  @Input() content!: any;
  tableData: any[] = [];
  private subscriptions: Subscription[] = [];
  isReadOnly:boolean=true;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.commonService.allbranchMaster['BRANCH_NAME'];
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
  ) { }

  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  salesCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'Salesman Code',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  salesCodeSelected(e: any) {
    console.log(e);
    this.poswalkincustomersForm.controls.salesman_code.setValue(e.SALESPERSON_CODE);
    this.poswalkincustomersForm.controls.salesman.setValue(e.	DESCRIPTION);
  }



  poswalkincustomersForm: FormGroup = this.formBuilder.group({
    voctype: [''],
    vocno: [''],
    vocdate: [''],
    nationality_code: [''],
    nationality: [''],
    mobile_code: [''],
    mobile: [''],
    name: [''],
    email: [''],
    salesman_code: [''],
    salesman: [''],
    feedback: [''],
    description: [''],
    customer_address: [''],
    remarks: [''],
    suggestions: ['']
  });

  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.update()
      return
    }
    if (this.poswalkincustomersForm.invalid) {
      this.toastr.error('select all required fields')//CHINNU - NO MESSAGE ID ,  DO WE HAVE ONE, ELSE ATLEAST KEEP CAMEL CASING
      return
    }
    let API = 'POSWalkinCustomers/InsertPOSWalkinCustomers'
    let postData = {
      "NAME": "",
      "ADDRESS": "",
      "SUGGESTIONS": "",
      "VOCTYPE": "",
      "VOCNO": "",
      "REMARKS": "",
      "MOBILENUMBER": "",
      "SALESMAN": "",
      "EMAILID": "",
      "BRANCH_CODE": "",
      "MID": 0,
      "VOCDATE": "2024-03-05T10:36:36.592Z",
      "FEEDBACK": "",
      "MOBILECODE": 0,
      "YEARMONTH": "",
      "NAVSEQNO": 0,
      "NATIONALITY_CODE": "",
      "SALES_ACHIEVED": 0
      
    }

    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',//CHINNU - WHY HEX CODE IS HARDCODED HERE, ALSO THIS CODE WE ARE NOT USING NOW
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.poswalkincustomersForm.reset()
                this.tableData = []
                this.close('reloadMainGrid')
              }
            });
          }
        } else {
          this.toastr.error('Not saved')//CHINNU - CAMEL CASING
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  update() {
    if (this.poswalkincustomersForm.invalid) {
      this.toastr.error('select all required fields')//CHINNU - CAMEL CASING
      return
    }
    
    let API = `POSWalkinCustomers/UpdatePOSWalkinCustomers/${this.branchCode}/${this.poswalkincustomersForm.value.voctype}/${this.poswalkincustomersForm.value.vocno}/${this.comService.yearSelected}`
    let postData = {
      "NAME": "",
  "ADDRESS": "",
  "SUGGESTIONS": "",
  "VOCTYPE": "",
  "VOCNO": "",
  "REMARKS": "",
  "MOBILENUMBER": "",
  "SALESMAN": "",
  "EMAILID": "",
  "BRANCH_CODE": "",
  "MID": 0,
  "VOCDATE": "2024-03-05T10:50:45.297Z",//CHINNU - HARDCODING? CHECK BELOW FIELDS ALSO
  "FEEDBACK": "",
  "MOBILECODE": 0,
  "YEARMONTH": "",
  "NAVSEQNO": 0,
  "NATIONALITY_CODE": "",
  "SALES_ACHIEVED": 0
      
    }

    let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',//CHINNU - CHECK HEX CODE
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.poswalkincustomersForm.reset()
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
        text: 'Please Select data to delete!',//CHINNU - CAMEL CASING
        icon: 'error',
        confirmButtonColor: '#336699',//CHINNU - CHECK HEX CODE
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
        let API = `POSWalkinCustomers/DeletePOSWalkinCustomers/${this.branchCode}/${this.poswalkincustomersForm.value.voctype}/${this.comService.yearSelected}/${this.poswalkincustomersForm.value.vocno}`
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
                    this.poswalkincustomersForm.reset()
                    this.tableData = []
                    this.close('reloadMainGrid')
                  }
                });
              } else {
                Swal.fire({
                  title: result.message || 'Error please try again',//CHINNU - NO MSG ID?
                  text: '',
                  icon: 'error',
                  confirmButtonColor: '#336699',
                  confirmButtonText: 'Ok'
                }).then((result: any) => {
                  if (result.value) {
                    this.poswalkincustomersForm.reset()
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

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }
}
