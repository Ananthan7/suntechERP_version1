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
import { RepairDetailsComponent } from './repair-details/repair-details.component';


@Component({
  selector: 'app-repair-jewellery-receipt',
  templateUrl: './repair-jewellery-receipt.component.html',
  styleUrls: ['./repair-jewellery-receipt.component.scss']
})
export class RepairJewelleryReceiptComponent implements OnInit {
  
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  columnheadItemDetails2:any[] = ['Repair Narration']
  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  private subscriptions: Subscription[] = [];

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    this.branchCode = this.comService.branchCode;
    this.yearMonth = this.comService.yearSelected;
  }

  openrepairdetails() {
    const modalRef: NgbModalRef = this.modalService.open(RepairDetailsComponent, {
      size: 'xl',
      backdrop: true,//'static'
      keyboard: false,
      windowClass: 'modal-full-width',
    });

  }

  repairjewelleryreceiptFrom: FormGroup = this.formBuilder.group({
    voctype:[''],
    vocDate : [''],
    vocno: [''],
    salesman  : [''],
    customer :[''],
    mobile :[''],
    tel  :[''],
    nationality :[''],
    type  :[''],
    currency :[''],
    currency_rate :[''],
    email :[''],
    address  :[''],
    repair_narration :[''],
    customer_delivery_date :[''],
    remark:[''],
   });

  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  

  adddata() {

    
   
}



adddatas() {
  
 
}

removedata(){
  
}

removedatas(){
  
}





formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.repairjewelleryreceiptFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'Repair/InsertRepair'
  let postData = {
    "MID": 0,
    "BRANCH_CODE": this.branchCode,
    "VOCTYPE": this.repairjewelleryreceiptFrom.value.voctype,
    "VOCNO": this.repairjewelleryreceiptFrom.value.vocno,
    "VOCDATE": this.repairjewelleryreceiptFrom.value.vocDate,
    "YEARMONTH": this.yearMonth,
    "SALESPERSON_CODE": this.repairjewelleryreceiptFrom.value.salesman,
    "POSCUSTCODE": this.repairjewelleryreceiptFrom.value.customer,
    "PARTYNAME": "",
    "TEL1": this.repairjewelleryreceiptFrom.value.tel,
    "TEL2": "",
    "MOBILE": this.repairjewelleryreceiptFrom.value.mobile,
    "POBOX": "",
    "NATIONALITY": this.repairjewelleryreceiptFrom.value.nationality,
    "EMAIL": this.repairjewelleryreceiptFrom.value.email,
    "TYPE": this.repairjewelleryreceiptFrom.value.type,
    "REMARKS": this.repairjewelleryreceiptFrom.value.remark,
    "TOTAL_PCS": 0,
    "TOTAL_GRWT": 0,
    "SYSTEM_DATE": "2024-03-13T06:56:20.277Z",
    "NAVSEQNO": 0,
    "DELIVERYDATE": this.repairjewelleryreceiptFrom.value.customer_delivery_date,
    "SALESREFERENCE": "",
    "STATUS": 0,
    "TRANSFERID": 0,
    "ADDRESS": this.repairjewelleryreceiptFrom.value.address,
    "TRANSFERFLAG": true,
    "BASE_CURRENCY": this.repairjewelleryreceiptFrom.value.currency,
    "BASE_CURR_RATE": this.repairjewelleryreceiptFrom.value.currency_rate,
    "ISAUTHORIZED": true,
    "AUTHORIZEDDATE": "2024-03-13T06:56:20.277Z",
    "AUTOPOSTING": true,
    "PRINT_COUNT": 0,
    "TOT_EST_REPAIR_CHARGES": 0,
    "PRINT_COUNT_ACCOPY": 0,
    "PRINT_COUNT_CNTLCOPY": 0,
    "HTUSERNAME": "",
    "AUTHORISE_BRANCH": "",
    "CITY": "",
    "MOBILECODE": "",
    "RELIGION": "",
    "STATE": "",
    "POSCUSTPREFIX": "",
    "AUTHORISE": 0,
    "WSID": 0,
    "Details": [
      {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": "mb3",
        "STOCK_CODE": "",
        "ITEM_DESCRIPTION": "",
        "ITEM_NARRATION": "",
        "PCS": 0,
        "GROSSWT": 0,
        "AMOUNT": 0,
        "REPAIR_TYPE": "",
        "REPAIR_ITEMTYPE": "",
        "ITEM_STATUSTYPE": "",
        "ITEM_PICTUREPATH": "",
        "DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
        "STATUS": 0,
        "TRANSFERID": 0,
        "TRANSFERCID": 0,
        "RECEIVEID": 0,
        "DELIVERID": 0,
        "NEWWEIGHT": 0,
        "REPAIRAMOUNT": 0,
        "OTHERAMOUNT": 0,
        "GOLDWGT": 0,
        "GOLDAMOUNT": 0,
        "DIAMONDWGT": 0,
        "DIAMONDAMOUNT": 0,
        "LABOURCHARGE": 0,
        "METALCODE": "",
        "REPAIRBAGNO": "",
        "MATERIAL_TYPE": "",
        "STONE_TYPE": "",
        "NO_OF_STONES": 0,
        "CUT": "string",
        "APPROX_SIZE": "",
        "OWN_STOCK": "",
        "CHECKED": 0,
        "DAMAGED": 0,
        "RECEIPT": 0,
        "WITHSTONE": 0,
        "AUTHORIZE": true,
        "AUTHORIZEDDATE": "2024-03-13T06:56:20.277Z",
        "TRANSFERFLAG": true,
        "REPAIRRETURNID": 0,
        "DT_WSID": 0,
        "DT_VOCDATE": "2024-03-13T06:56:20.277Z",
        "DT_STATUS": 0,
        "DT_SALESPERSON_CODE": "",
        "DT_POSCUSTCODE": "",
        "DT_PARTYNAME": "",
        "DT_MOBILE": "",
        "FROM_BRANCH": "",
        "DT_DELIVERY_DATE": "2024-03-13T06:56:20.277Z",
        "DELIVERED_DATE": "2024-03-13T06:56:20.277Z",
        "DT_TRANSFERID": 0,
        "DT_VOCTYPE": "",
        "DT_VOCNO": 0,
        "DT_BRANCH_CODE": "",
        "DT_YEARMONTH": 0,
        "CURRENT_BRANCH": "",
        "DT_TEL1": "",
        "DT_NATIONALITY": "",
        "DT_TYPE": "",
        "DT_EMAIL": "",
        "DT_REMARKS": "",
        "DT_DELIVERYDATE": "2024-03-13T06:56:20.277Z",
        "DT_TOTAL_PCS": 0,
        "DT_TOTAL_GRWT": 0,
        "DT_NAVSEQNO": 0,
        "DT_POBOX": "",
        "DT_POSCUSTPREFIX": "",
        "DT_MOBILECODE": "",
        "DT_STATE": "",
        "DT_RELIGION": "",
        "DT_CITY": "",
        "DT_TEL2": "",
        "DT_SYSTEM_DATE": "2024-03-13T06:56:20.277Z",
        "DT_SALESREFERENCE": "",
        "DT_AUTHORISE": 0,
        "DT_AUTHORISE_BRANCH": "",
        "EST_REPAIR_CHARGES": 0,
        "AUTH_INBRANCH_DATE": "2024-03-13T06:56:20.277Z",
        "AUTH_INHO_DATE": "2024-03-13T06:56:20.277Z",
        "AUTH_INBRANCH_REMARKS": "",
        "AUTH_INBRANCH_USER": "",
        "AUTH_INHO_REMARKS": "",
        "AUTH_INHO_USER": "",
        "BRTRANSFERID": 0,
        "JOBCARD_FLAG": 0,
        "DIRECT_DELIVERY": 0
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
              this.repairjewelleryreceiptFrom.reset()
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
  if (this.repairjewelleryreceiptFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.repairjewelleryreceiptFrom.value.branchCode + this.repairjewelleryreceiptFrom.value.voctype + this.repairjewelleryreceiptFrom.value.vocno + this.repairjewelleryreceiptFrom.value.yearMonth
  let postData = {
   
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
              this.repairjewelleryreceiptFrom.reset()
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
  if (!this.content.VOCTYPE) {
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
      let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.repairjewelleryreceiptFrom.value.branchCode + this.repairjewelleryreceiptFrom.value.voctype + this.repairjewelleryreceiptFrom.value.vocno + this.repairjewelleryreceiptFrom.value.yearMonth
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
                  this.repairjewelleryreceiptFrom.reset()
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
                  this.repairjewelleryreceiptFrom.reset()
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

ngOnDestroy() {
  if (this.subscriptions.length > 0) {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());// unsubscribe all subscription
    this.subscriptions = []; // Clear the array
  }
}

}
