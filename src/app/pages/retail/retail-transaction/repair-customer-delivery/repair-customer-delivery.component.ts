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
  fieldValue: number =0;
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
    LOOKUPID: 1,
    SEARCH_FIELD: 'SALESPERSON_CODE',
    SEARCH_HEADING: 'SALES MAN ',
    SEARCH_VALUE: '',
    WHERECONDITION: "SALESPERSON_CODE<> ''",
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
    posVocType:[''],
    repairAmt:[''],
    subTotal:[''],
    roundOffAmount:[''],
    netTotal:[''],
    CheckTheDiamondProduct:[false],
    RepairRecieptRecieved:[false],
  });

  ngOnInit(): void {      
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
    this.repairCustomerDeliveryForm.controls.voctype.setValue(this.comService.getqueryParamVocType());
    this.repairCustomerDeliveryForm.controls.currency.setValue(this.comService.compCurrency);
    this.repairCustomerDeliveryForm.controls.currencyDesc.setValue(this.comService.getCurrRate(this.comService.compCurrency));
    console.log(this.content);
    if (this.content.FLAG == 'VIEW') {
      this.viewMode = true;
      console.log("1");
      console.log(this.viewMode);
      this.setFormValues();
    } else if (this.content.FLAG == 'EDIT') {
      this.viewMode = false;
      console.log("2");
      console.log(this.viewMode);
      this.setFormValues();
    }

    // if (this.content?.MID != null){
    //   this.setFormValues();
    //   this.viewMode = false;
    // }
  
  }

  roundoff(value: number): void {
    // console.log('Rounded value:', Math.round(value));
    this.repairCustomerDeliveryForm.controls.netTotal.setValue(Math.round(value));
  }
  
  // setFormValues() {
  //   console.log('this.content', this.content);
  //   const dateParts =this.content.VOCDATE.split('T')[0].split('-').join('/');
  //   const formatteddate = new Date(dateParts);
  //   console.log(dateParts);
  //   if (!this.content) return
  //   this.repairCustomerDeliveryForm.controls.voctype.setValue(this.content.VOCTYPE);
  //   this.repairCustomerDeliveryForm.controls.vocNo.setValue(this.content.VOCNO);
  //   this.repairCustomerDeliveryForm.controls['vocDate'].setValue(this.content.VOCDATE);
  //   this.repairCustomerDeliveryForm.controls.salesMan.setValue(this.content.SALESPERSON_CODE);
  //   this.repairCustomerDeliveryForm.controls.customer.setValue(this.content.CUSCODE);
  //   this.repairCustomerDeliveryForm.controls.remarks.setValue(this.content.REMARKS);
  //   this.repairCustomerDeliveryForm.controls.posVocType.setValue(this.content.POSVOCTYPE);
  //   this.repairCustomerDeliveryForm.controls.repairAmt.setValue(this.content.POSAMOUNT);
  //   this.repairCustomerDeliveryForm.controls.subTotal.setValue(this.content.SUBTOTAL);
  //   this.repairCustomerDeliveryForm.controls.netTotal.setValue(this.content.NETTOTAL);
  //   this.repairCustomerDeliveryForm.controls.customerDesc.setValue(this.content.PARTYNAME);
  //   this.repairCustomerDeliveryForm.controls.tel.setValue(this.content.TEL1);
  //   this.repairCustomerDeliveryForm.controls.mobile.setValue(this.content.MOBILE);
  //   this.repairCustomerDeliveryForm.controls.nationality.setValue(this.content.NATIONALITY);
  //   this.repairCustomerDeliveryForm.controls.email.setValue(this.content.EMAIL);
  //   this.repairCustomerDeliveryForm.controls.type.setValue(this.content.TYPE);
  //   this.repairCustomerDeliveryForm.controls.address.setValue(this.content.ADDRESS);
  // }

  setFormValues() {
    console.log('this.content', this.content);

    if (!this.content) return;

    // Split the date string and create a Date object
    const dateParts = this.content.VOCDATE.split('-'); // Split by '-'
    const formattedDate = new Date(
        parseInt(dateParts[2]), // Year
        parseInt(dateParts[1]) - 1, // Month (zero-indexed)
        parseInt(dateParts[0]) // Day
    );
    console.log(formattedDate);
    
    // Format the date for display in the input field (optional)
    const formattedDateString = formattedDate.toLocaleDateString('en-GB'); // Example: "16/07/2024"

    // Set form values
    this.repairCustomerDeliveryForm.controls.voctype.setValue(this.content.VOCTYPE);
    this.repairCustomerDeliveryForm.controls.vocNo.setValue(this.content.VOCNO);
    this.repairCustomerDeliveryForm.controls['vocDate'].setValue(formattedDate); // Set the Date object
    this.repairCustomerDeliveryForm.controls.salesMan.setValue(this.content.SALESPERSON_CODE);
    this.repairCustomerDeliveryForm.controls.customer.setValue(this.content.CUSCODE);
    this.repairCustomerDeliveryForm.controls.remarks.setValue(this.content.REMARKS);
    this.repairCustomerDeliveryForm.controls.posVocType.setValue(this.content.POSVOCTYPE);
    this.repairCustomerDeliveryForm.controls.repairAmt.setValue(this.content.POSAMOUNT);
    this.repairCustomerDeliveryForm.controls.subTotal.setValue(this.content.SUBTOTAL);
    this.repairCustomerDeliveryForm.controls.netTotal.setValue(this.content.NETTOTAL);
    this.repairCustomerDeliveryForm.controls.customerDesc.setValue(this.content.PARTYNAME);
    this.repairCustomerDeliveryForm.controls.tel.setValue(this.content.TEL1);
    this.repairCustomerDeliveryForm.controls.mobile.setValue(this.content.MOBILE);
    this.repairCustomerDeliveryForm.controls.nationality.setValue(this.content.NATIONALITY);
    this.repairCustomerDeliveryForm.controls.email.setValue(this.content.EMAIL);
    this.repairCustomerDeliveryForm.controls.type.setValue(this.content.TYPE);
    this.repairCustomerDeliveryForm.controls.address.setValue(this.content.ADDRESS);
}

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  salesManSelected(e:any){
    console.log(e);
    this.repairCustomerDeliveryForm.controls.salesMan.setValue(e.SALESPERSON_CODE);
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
      this.updateRepairCustomerDelivery()
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
      "SALESPERSON_CODE": this.repairCustomerDeliveryForm.value.salesMan,
      "CUSCODE": this.repairCustomerDeliveryForm.value.customer,
      "REMARKS": this.repairCustomerDeliveryForm.value.remarks,
      "SYSTEM_DATE": new Date(),
      "NAVSEQNO": 0,
      "POSMID": 0,
      "POSVOCNO": 0,
      "POSVOCTYPE": this.repairCustomerDeliveryForm.value.posVocType,
      "POSAMOUNT": this.repairCustomerDeliveryForm.value.repairAmt,
      "SUBTOTAL": this.repairCustomerDeliveryForm.value.subTotal,
      "DISCOUNT": 0,
      "NETTOTAL": this.repairCustomerDeliveryForm.value.netTotal,
      "CHECKED": 0,
      "DAMAGED": 0,
      "RECEIPT": 0,
      "PARTYNAME": this.repairCustomerDeliveryForm.value.customerDesc,
      "TEL1": this.repairCustomerDeliveryForm.value.tel.toString(),
      "MOBILE": this.repairCustomerDeliveryForm.value.mobile,
      "NATIONALITY": this.repairCustomerDeliveryForm.value.nationality,
      "EMAIL": this.repairCustomerDeliveryForm.value.email,
      "TYPE": this.repairCustomerDeliveryForm.value.type,
      "ADDRESS": this.repairCustomerDeliveryForm.value.address,
      "POBOX": "",
      "SALESREFERENCE": "",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "",
      "CUSTMOBILE": ""
    }
    console.log(postData.TEL1);
    let Sub: Subscription = this.dataService.postDynamicAPI(API, postData)
      .subscribe((result) => {
        if (result.response) {
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.close('reloadMainGrid')
              }
            });
            this.repairCustomerDeliveryForm.reset()
            this.tableData = []
          }
        } else {
          this.toastr.error('Not saved')
        }
      }, err => alert(err))
    this.subscriptions.push(Sub)
  }

  updateRepairCustomerDelivery() {
    console.log(this.branchCode,'working')
    let API = `RepairDelivery/UpdateRepairDelivery/${this.branchCode}/${this.repairCustomerDeliveryForm.value.voctype}/${this.repairCustomerDeliveryForm.value.vocNo}/${this.comService.yearSelected}` ;
    let postData ={
      "MID": 0,
      "BRANCH_CODE": this.branchCode,
      "VOCTYPE": this.repairCustomerDeliveryForm.value.voctype,
      "VOCNO": this.repairCustomerDeliveryForm.value.vocNo,
      "VOCDATE": this.repairCustomerDeliveryForm.value.vocDate,
      "YEARMONTH": this.yearMonth,
      "SALESPERSON_CODE": this.repairCustomerDeliveryForm.value.salesMan,
      "CUSCODE": this.repairCustomerDeliveryForm.value.customer,
      "REMARKS": this.repairCustomerDeliveryForm.value.remarks,
      "SYSTEM_DATE": "2024-03-05T11:16:28.124Z",
      "NAVSEQNO": 0,
      "POSMID": 0,
      "POSVOCNO": 0,
      "POSVOCTYPE": this.repairCustomerDeliveryForm.value.posVocType,
      "POSAMOUNT": this.repairCustomerDeliveryForm.value.repairAmt,
      "SUBTOTAL": this.repairCustomerDeliveryForm.value.subTotal,
      "DISCOUNT": 0,
      "NETTOTAL": this.repairCustomerDeliveryForm.value.netTotal,
      "CHECKED": 0,
      "DAMAGED": 0,
      "RECEIPT": 0,
      "PARTYNAME": this.repairCustomerDeliveryForm.value.customerDesc,
      "TEL1": this.repairCustomerDeliveryForm.value.tel,
      "MOBILE": this.repairCustomerDeliveryForm.value.mobile,
      "NATIONALITY": this.repairCustomerDeliveryForm.value.nationality,
      "EMAIL": this.repairCustomerDeliveryForm.value.email,
      "TYPE": this.repairCustomerDeliveryForm.value.type,
      "ADDRESS": this.repairCustomerDeliveryForm.value.address,
      "POBOX": "string",
      "SALESREFERENCE": "string",
      "PRINT_COUNT": 0,
      "PRINT_COUNT_ACCOPY": 0,
      "PRINT_COUNT_CNTLCOPY": 0,
      "HTUSERNAME": "string",
      "CUSTMOBILE": "string"
      }    
      
  
      let Sub: Subscription = this.dataService.putDynamicAPI(API, postData)
        .subscribe((result) => {
          if (result.response) {
            if (result.status.trim() == "Success") {
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
      
  deleteRepairCustomerDelivery() {
    if (this.content && this.content.FLAG == 'VIEW') return
    if (!this.content.BRANCH_CODE&&!this.content.VOCTYPE&&!this.content.VOCNO&&!this.content.YEARMONTH) {

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
        let API = 'RepairDelivery/DeleteRepairDelivery/' +  this.branchCode+"/" + this.repairCustomerDeliveryForm.value.voctype+"/"  + this.repairCustomerDeliveryForm.value.vocNo+"/"  + this.yearMonth;
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
