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
  selector: 'app-repair-details',
  templateUrl: './repair-details.component.html',
  styleUrls: ['./repair-details.component.scss']
})
export class RepairDetailsComponent implements OnInit {

  @Input() content!: any; 
  tableData: any[] = [];
  userName = localStorage.getItem('username');
  branchCode?: String;
  yearMonth?: String;
  vocMaxDate = new Date();
  currentDate = new Date();
  companyName = this.comService.allbranchMaster['BRANCH_NAME'];
  private subscriptions: Subscription[] = [];
 
  columnheadItemDetails:any[] = ['Sr.No','Div','Description','Remarks','Pcs','Gr.Wt','Repair Type','Type'];
  columnheadItemDetails1:any[] = ['Comp Code','Description','Pcs','Size Set','Size Code','Type','Category','Shape','Height','Width','Length','Radius','Remarks'];
  
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

  repairjewelleryreceiptdetailsFrom: FormGroup = this.formBuilder.group({
    Description :[''],
    Pcs  : [''],
    type_of: [''],
    delivery_date  : [''],
    gross_Wt :[''],
    type_of_item :[''],
    total_amount  :[''],
    status :[''],
    status_des :[''],
    material :[''],
    Est_repair_charge :[''],
    own_stock :[''],
    repair_bags :[''],
    stone_type  :[''],
    no_of :[''],
    Cut :[''],
    Approx :[''],
    remark:[''],
    Description1:[''],
    text:[''],
   });


   DescCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 10,
    SEARCH_FIELD: 'DESCRIPTION',
    SEARCH_HEADING: 'User Name ',
    SEARCH_VALUE: '',
    WHERECONDITION: "DESCRIPTION<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  DescCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.Description.setValue(e.CODE);
    this.repairjewelleryreceiptdetailsFrom.controls.Description1.setValue(e.DESCRIPTION);
  }


  typeOfCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'type of',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeOfCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.type_of.setValue(e.CODE);
  }


  typeOfItemCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 62,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: "type of item",
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  typeOfItemCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.type_of_item.setValue(e.CODE);
  }

  statusCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 48,
    SEARCH_FIELD: 'STATE_CODE',
    SEARCH_HEADING: 'Status ',
    SEARCH_VALUE: '',
    WHERECONDITION: "STATE_CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  statusCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.status.setValue(e.STATE_CODE);
    this.repairjewelleryreceiptdetailsFrom.controls.status_des.setValue(e.STATE_DESCRIPTION);
  }

  materialCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'User Name ',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  materialCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.material.setValue(e.CODE);
  }

  EstRepairChargeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 7,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Est Repair Charge CodeData',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  EstRepairChargeCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.Est_repair_charge.setValue(e.CODE);
  }

  stoneTypeCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Stone Type',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  stoneTypeCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.stone_type.setValue(e.CODE);
  }

  CutCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Cut',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  CutCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.Cut.setValue(e.CODE);
  }

  ApproxCodeData: MasterSearchModel = {
    PAGENO: 1,
    RECORDS: 10,
    LOOKUPID: 3,
    SEARCH_FIELD: 'CODE',
    SEARCH_HEADING: 'Approx',
    SEARCH_VALUE: '',
    WHERECONDITION: "CODE<> ''",
    VIEW_INPUT: true,
    VIEW_TABLE: true,
  }
  ApproxCodeSelected(e: any) {
    console.log(e);
    this.repairjewelleryreceiptdetailsFrom.controls.Approx.setValue(e.CODE);
  }


  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }


  adddata() {

   
}

adddatas() {
 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableData.pop();
}


formSubmit(){

  if(this.content && this.content.FLAG == 'EDIT'){
    this.update()
    return
  }
  if (this.repairjewelleryreceiptdetailsFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'Repair/InsertRepair'
  let postData = {
        "UNIQUEID": 0,
        "SRNO": 0,
        "DIVISION_CODE": "3",
        "STOCK_CODE": "",
        "ITEM_DESCRIPTION": this.repairjewelleryreceiptdetailsFrom.value.Description,
        "ITEM_NARRATION": "",
        "PCS": this.repairjewelleryreceiptdetailsFrom.value.Pcs,
        "GROSSWT": this.repairjewelleryreceiptdetailsFrom.value.gross_Wt,
        "AMOUNT": this.repairjewelleryreceiptdetailsFrom.value.total_amount,
        "REPAIR_TYPE": this.repairjewelleryreceiptdetailsFrom.value.type_of,
        "REPAIR_ITEMTYPE": "",
        "ITEM_STATUSTYPE": this.repairjewelleryreceiptdetailsFrom.value.type_of_item,
        "ITEM_PICTUREPATH": "",
        "DELIVERY_DATE": this.repairjewelleryreceiptdetailsFrom.value.delivery_date,
        "STATUS": this.repairjewelleryreceiptdetailsFrom.value.status,
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
        "MATERIAL_TYPE": this.repairjewelleryreceiptdetailsFrom.value.material,
        "STONE_TYPE": this.repairjewelleryreceiptdetailsFrom.value.stone_type,
        "NO_OF_STONES": this.repairjewelleryreceiptdetailsFrom.value.no_of,
        "CUT": this.repairjewelleryreceiptdetailsFrom.value.Cut,
        "APPROX_SIZE": this.repairjewelleryreceiptdetailsFrom.value.Approx,
        "OWN_STOCK": this.repairjewelleryreceiptdetailsFrom.value.own_stock,
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
        "DT_REMARKS": this.repairjewelleryreceiptdetailsFrom.value.remark,
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
              this.repairjewelleryreceiptdetailsFrom.reset()
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
  if (this.repairjewelleryreceiptdetailsFrom.invalid) {
    this.toastr.error('select all required fields')
    return
  }

  let API = 'JobWaxReturn/UpdateJobWaxReturn/'+ this.branchCode + this.repairjewelleryreceiptdetailsFrom.value.voctype + this.repairjewelleryreceiptdetailsFrom.value.vocno + this.yearMonth
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
              this.repairjewelleryreceiptdetailsFrom.reset()
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
      let API = 'JobWaxReturn/DeleteJobWaxReturn/' + this.branchCode + this.repairjewelleryreceiptdetailsFrom.value.voctype + this.repairjewelleryreceiptdetailsFrom.value.vocno + this.yearMonth
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
                  this.repairjewelleryreceiptdetailsFrom.reset()
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
                  this.repairjewelleryreceiptdetailsFrom.reset()
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
