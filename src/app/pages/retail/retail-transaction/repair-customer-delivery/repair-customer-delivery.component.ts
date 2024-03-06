import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';
import { Code } from 'angular-feather/icons';
import { AlloyAllocationComponent } from 'src/app/pages/jewellery-manufacturing/transaction/cad-processing/alloy-allocation/alloy-allocation.component';

@Component({
  selector: 'app-repair-customer-delivery',
  templateUrl: './repair-customer-delivery.component.html',
  styleUrls: ['./repair-customer-delivery.component.scss']
})
export class RepairCustomerDeliveryComponent implements OnInit {
  @Input() content!: any;
  selectedIndex!: number | null;
  tableData: any[] = [];  
  firstTableWidth : any;
  secondTableWidth : any;
  columnheadItemDetails:any[] = ['Srno','Division','Stone Type','Stock Code','Karat','Color','Shape','Sieve','Size','Pcs','Wt/Ct','Setting Type','Pointer Wt','Remarks'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  divisionMS: any = 'ID';
  columnheadItemDetails2:any[] = ['Repair Narration']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  selectedTabIndex = 0;


  salesManCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 19,
    SEARCH_FIELD: 'WORKER_CODE',
    SEARCH_HEADING: 'Worker Code ',
    SEARCH_VALUE: '',
    WHERECONDITION: "WORKER_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

  customerCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 2,
    SEARCH_FIELD: "CODE",
    SEARCH_HEADING: "Customer",
    SEARCH_VALUE: "",
    WHERECONDITION: "CODE <>''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }

 

  // setAllInitialValues: any;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }




  repairCustomerDeliveryForm: FormGroup = this.formBuilder.group({
    voctype: [,''],
    vocNo: [1],
    vocDate: [new Date()],
    salesMan: [''],
    customer: [''],
    customerDesc: [''],
    tel: [''],
    mobile: [''],
    nationality: [''],
    type:[''],
    remarks:[''],
    currency:[''],
    currencyDesc:[''],
    email:[''],
    address:[''],
    check1:[''],
    check2:[''],
    vocType:[''],
    repairAmt:[''],
    subTotal:[''],
    roundOffAmount:[''],
    netTotal:[''],
  });

  ngOnInit(): void {      
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.repairCustomerDeliveryForm.controls.voctype.setValue(this.comService.getqueryParamVocType());
  }
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  salesManSelected(e:any){
    console.log(e);

  }

  customerSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.customer.setValue(e.CODE);
    this.repairCustomerDeliveryForm.controls.customerDesc.setValue(e.NAME);
    this.repairCustomerDeliveryForm.controls.email.setValue(e.EMAIL);
    this.repairCustomerDeliveryForm.controls.tel.setValue(e.TEL1);
    this.repairCustomerDeliveryForm.controls.mobile.setValue(e.MOBILE);
  }


  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateMeltingType()
      return
    }

    if (this.repairCustomerDeliveryForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'RepairDelivery/InsertRepairDelivery'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
      "VOCNO": this.repairCustomerDeliveryForm.value.vocNo,
      "VOCDATE": this.repairCustomerDeliveryForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": "string",
      "CUSCODE": "string",
      "REMARKS": "string",
      "SYSTEM_DATE": "2024-03-05T11:16:28.124Z",
      "NAVSEQNO": 0,
      "POSMID": 0,
      "POSVOCNO": 0,
      "POSVOCTYPE": "str",
      "POSAMOUNT": 0,
      "SUBTOTAL": 0,
      "DISCOUNT": 0,
      "NETTOTAL": 0,
      "CHECKED": 0,
      "DAMAGED": 0,
      "RECEIPT": 0,
      "PARTYNAME": "string",
      "TEL1": "string",
      "MOBILE": "string",
      "NATIONALITY": "string",
      "EMAIL": "string",
      "TYPE": "string",
      "ADDRESS": "string",
      "POBOX": "string",
      "SALESREFERENCE": "string",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "CUSTMOBILE": "string"
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
                this.repairCustomerDeliveryForm.reset()
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

  updateMeltingType() {
    console.log(this.branchCode,'working')
    let API = `JobCadProcessDJ/UpdateJobCadProcessDJ/${this.branchCode}/${this.repairCustomerDeliveryForm.value.voctype}/${this.repairCustomerDeliveryForm.value.vocNo}/${this.comService.yearSelected}` ;
      let postData ={}    
      
  
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
                  this.repairCustomerDeliveryForm.reset()
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
      /**USE: delete Melting Type From Row */
      
  deleteMeltingType() {
    if (!this.content.WORKER_CODE) {
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
        let API = '/JobCadProcessDJ/DeleteJobCadProcessDJ/' + this.repairCustomerDeliveryForm.value.brnachCode + this.repairCustomerDeliveryForm.value.voctype + this.repairCustomerDeliveryForm.value.vocNo + this.repairCustomerDeliveryForm.value.yearMoth;
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
                    this.repairCustomerDeliveryForm.reset()
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
                    this.repairCustomerDeliveryForm.reset()
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
