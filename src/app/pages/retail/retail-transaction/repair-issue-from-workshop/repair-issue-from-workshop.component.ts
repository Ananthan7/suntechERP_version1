import { Component, ComponentFactory, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { MasterSearchModel } from 'src/app/shared/data/master-find-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-repair-issue-from-workshop',
  templateUrl: './repair-issue-from-workshop.component.html',
  styleUrls: ['./repair-issue-from-workshop.component.scss']
})
export class RepairIssueFromWorkshopComponent implements OnInit {
  @Input() content!: any;
  @Input()
  tableData: any[] = [];  
  tableDatas: any[] = [];  
  columnheadItemDetails:any[] = ['Rep Voc No.','Stock Code','Bag No','Customer Name','Mobile','Delivery Date','Status'];
  columnheadItemDetails1:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery'];
  columnheadItemDetails2:any[] = ['Receive from Workshop Remarks']
  branchCode?: String;
  yearMonth?: String;
  currentDate = new FormControl(new Date());
  private subscriptions: Subscription[] = [];
  viewMode: boolean = false;
  selectedTabIndex = 0;

  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {
    // this.setvaluesdata()
    // if (this.content) {
    //   // this.setFormValues()  
    //   this.setAllInitialValues()
    //   if (this.content.FLAG == 'VIEW') {
    //     this.viewMode = true;
    //   }
    // }
    
    // this.branchCode = this.comService.branchCode;
    // this.yearMonth = this.comService.yearSelected;
    // if (this.content) {
    //   this.setFormValues()
    // }
    // this.repairReceiveForm.controls.deliveryOnDate = new FormControl({value: '', disabled: this.isdisabled})
  
  }

  // private handleResize(): void {
  //   // Access screen size here using window.innerWidth and window.innerHeight
  //   const screenWidth = window.innerWidth;
  //   const screenHeight = window.innerHeight;
  //   if (screenWidth > 1200) {
  //     this.firstTableWidth = 800
  //     this.secondTableWidth = 450
  //   } else if (screenWidth >= 768 && screenWidth < 1200) {
  //     this.firstTableWidth = 700
  //     this.secondTableWidth = 350
  //   }
  // }


  repairReceiveForm: FormGroup = this.formBuilder.group({
    voctype: [,''],
    vocNo: [''],
    vocDate: [''],
    salesMan: [''],
    partyCode: [''],
    partyDesc: [''],
    branchcurr: [''],
    branchcurrcode: [''],
    partyName: [''],
    supplierInvNo:[''],
    Date:[''],
    customerCode:[''],
    customerCodeDesc: [''],
   
  });

 
  

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updateRepairReceive()
      return
    }

    if (this.repairReceiveForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }

    let API = '/RepairTransfer/InsertRepairTransfer'
    let postData ={
      
        "MID": 0,
        "BRANCH_CODE": "string",
        "VOCTYPE": "str",
        "VOCNO": 0,
        "VOCDATE": "2024-03-07T11:34:37.684Z",
        "YEARMONTH": "string",
        "SALESPERSON_CODE": "string",
        "BRANCHTO": "string",
        "REMARKS": "string",
        "SYSTEM_DATE": "2024-03-07T11:34:37.684Z",
        "NAVSEQNO": 0,
        "STATUS": "string",
        "METALVOCNO": 0,
        "METALWEIGHT": 0,
        "METALAMOUNT": 0,
        "METALMID": 0,
        "METALVOCTYPE": "str",
        "METALCODE": "string",
        "DIAMONDCODE": "string",
        "DIAMONDVOCNO": 0,
        "DIAMONDVOCTYPE": "str",
        "DIAMONDMID": 0,
        "DIAMONDWGT": 0,
        "DIAMONDAMOUNT": 0,
        "SUPINVDATE": "2024-03-07T11:34:37.685Z",
        "SUPINVNO": "string",
        "TRANSFERBRANCH": "string",
        "AUTOPOSTING": true,
        "BRANCHTONAME": "string",
        "ISMETALDIAMOND": "string",
        "HASJOBDONE": "string",
        "PRINT_COUNT": 0,
        "POSCUSTCODE": "string",
        "POSCUSTNAME": "string",
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "HTUSERNAME": "string",
        "JOBDONE": 0,
        "METALANDDIAMOND": 0
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
                this.repairReceiveForm.reset()
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

  updateRepairReceive() {
    console.log(this.branchCode,'working')
    let API = 'RepairTransfer/UpdateRepairTransfer'+this.content.BRANCH_CODE+this.content.VOCTYPE+this.content.VOCNO+this.content.YEARMONTH ;
      let postData ={
        "MID": 0,
        "BRANCH_CODE": "string",
        "VOCTYPE": "str",
        "VOCNO": 0,
        "VOCDATE": "2024-03-07T11:39:51.822Z",
        "YEARMONTH": "string",
        "SALESPERSON_CODE": "string",
        "BRANCHTO": "string",
        "REMARKS": "string",
        "SYSTEM_DATE": "2024-03-07T11:39:51.822Z",
        "NAVSEQNO": 0,
        "STATUS": "string",
        "METALVOCNO": 0,
        "METALWEIGHT": 0,
        "METALAMOUNT": 0,
        "METALMID": 0,
        "METALVOCTYPE": "str",
        "METALCODE": "string",
        "DIAMONDCODE": "string",
        "DIAMONDVOCNO": 0,
        "DIAMONDVOCTYPE": "str",
        "DIAMONDMID": 0,
        "DIAMONDWGT": 0,
        "DIAMONDAMOUNT": 0,
        "SUPINVDATE": "2024-03-07T11:39:51.822Z",
        "SUPINVNO": "string",
        "TRANSFERBRANCH": "string",
        "AUTOPOSTING": true,
        "BRANCHTONAME": "string",
        "ISMETALDIAMOND": "string",
        "HASJOBDONE": "string",
        "PRINT_COUNT": 0,
        "POSCUSTCODE": "string",
        "POSCUSTNAME": "string",
        "PRINT_COUNT_ACCOPY": 0,
        "PRINT_COUNT_CNTLCOPY": 0,
        "HTUSERNAME": "string",
        "JOBDONE": 0,
        "METALANDDIAMOND": 0
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
                  this.repairReceiveForm.reset()
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
  deleteRepairReceive() {
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
        let API = '/RepairTransfer/DeleteRepairTransfer/' + this.repairReceiveForm.value.branchCode + this.repairReceiveForm.value.voctype + this.repairReceiveForm.value.vocNo + this.repairReceiveForm.value.yearMonth;
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
                    this.repairReceiveForm.reset()
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
                    this.repairReceiveForm.reset()
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
 




////////////////////////////////////////////////////////////////////////////////////////////////////
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

  salesManSelected(e:any){
    console.log(e);
    this.repairReceiveForm.controls.worker.setValue(e.WORKER_CODE);
  }

  customerCodeData: MasterSearchModel = {
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

  customerSelected(e:any){
    console.log(e);
    this.repairReceiveForm.controls.worker.setValue(e.WORKER_CODE);
  }

  deleteTableData(){
 
    
  }

}
