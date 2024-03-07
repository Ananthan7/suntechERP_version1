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
  selector: 'app-repair-issue-to-workshop',
  templateUrl: './repair-issue-to-workshop.component.html',
  styleUrls: ['./repair-issue-to-workshop.component.scss']
})
export class RepairIssueToWorkshopComponent implements OnInit {
  @Input() content!: any;
  @Input()
  selectedIndex!: number | null;
  tableData: any[] = [];  
  tableDatas: any[] = [];  

  columnheadItemDetails:any[] = ['Rep Voc No.','Stock Code','Bag No','Customer Name','Mobile','Delivery Date','Status'];
  columnheadItemDetails1:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery'];
  columnheadItemDetails2:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep Type','Delivery'];
  private subscriptions: Subscription[] = [];
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dataService: SuntechAPIService,
    private comService: CommonServiceService,
  ) { }


  ngOnInit(): void {}
   

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }

  repairTransferForm: FormGroup = this.formBuilder.group({

    voctype: [''],
    vocNo: [''],
    vocDate: [''],
    salesMan: [''],
    branch: [''],
    branchName: [''],
    partyCode: [''],
    partyName: [''],

  });

 

  adddata() {
  
   
}



adddatas() {
 
}

removedata(){
  this.tableData.pop();
}

removedatas(){
  this.tableDatas.pop();
}


  formSubmit() {

    if (this.content && this.content.FLAG == 'VIEW') return
    if(this.content && this.content.FLAG == 'EDIT'){
      this.update()
      return
    }
    if (this.repairTransferForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'RepairTransfer/InsertRepairTransfer'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.repairTransferForm.value.branch,
      "VOCTYPE":  this.repairTransferForm.value.voctype,
      "VOCNO":  this.repairTransferForm.value.vocNo,
      "VOCDATE": "2024-03-07T10:58:49.153Z",
      "YEARMONTH": "string",
      "SALESPERSON_CODE": this.repairTransferForm.value.salesMan,
      "BRANCHTO": "string",
      "REMARKS": "string",
      "SYSTEM_DATE": "2024-03-07T10:58:49.153Z",
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
      "SUPINVDATE": "2024-03-07T10:58:49.153Z",
      "SUPINVNO": "string",
      "TRANSFERBRANCH": "string",
      "AUTOPOSTING": true,
      "BRANCHTONAME": this.repairTransferForm.value.branchName,
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
          if(result.status == "Success"){
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.repairTransferForm.reset()
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

  update() {

    if (this.repairTransferForm.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API = 'RepairTransfer/UpdateRepairTransfer/'+  this.content.BRANCH_CODE + this.content.VOCTYPE + this.content.VOCNO + this.content.YEARMONTH

    let postData = {
      "MID": 0,
      "BRANCH_CODE": this.repairTransferForm.value.branch,
      "VOCTYPE":  this.repairTransferForm.value.voctype,
      "VOCNO":  this.repairTransferForm.value.vocNo,
      "VOCDATE": "2024-03-07T10:58:49.153Z",
      "YEARMONTH": "string",
      "SALESPERSON_CODE": this.repairTransferForm.value.salesMan,
      "BRANCHTO": "string",
      "REMARKS": "string",
      "SYSTEM_DATE": "2024-03-07T10:58:49.153Z",
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
      "SUPINVDATE": "2024-03-07T10:58:49.153Z",
      "SUPINVNO": "string",
      "TRANSFERBRANCH": "string",
      "AUTOPOSTING": true,
      "BRANCHTONAME": this.repairTransferForm.value.branchName,
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
        if(result.status == "Success"){
          Swal.fire({
            title: result.message || 'Success',
            text: '',
            icon: 'success',
            confirmButtonColor: '#336699',
            confirmButtonText: 'Ok'
          }).then((result: any) => {
            if (result.value) {
              this.repairTransferForm.reset()
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
     

  deleteMeltingType() {
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
        let API = 'RepairTransfer/DeleteRepairTransfe/' + this.content.BRANCH_CODE + this.content.VOCTYPE + this.content.VOCNO + this.content.YEARMONTH
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
                    this.repairTransferForm.reset()
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
                    this.repairTransferForm.reset()
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
