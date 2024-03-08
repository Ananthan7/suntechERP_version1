import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonServiceService } from 'src/app/services/common-service.service';
import { SuntechAPIService } from 'src/app/services/suntech-api.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-transfer-repair-out',
  templateUrl: './branch-transfer-repair-out.component.html',
  styleUrls: ['./branch-transfer-repair-out.component.scss']
})


export class BranchTransferRepairOutComponent implements OnInit {

  @Input() content!: any; 

  branchCode?: String;
  yearMonth?: String;

  private subscriptions: Subscription[] = [];

  

  currentDate = new Date();
  tableData: any[] = [];
  strBranchcode:any= '';
  // columnhead:any[] = [
  //   { title: 'Karat', field: 'KARAT_CODE' },
  //   { title: 'Sale Rate', field: 'KARAT_RATE' },
  //   { title: 'Purchase Rate', field: 'POPKARAT_RATE' }];

  columnhead:any[] = ['Rep Voc No','Stock Code','Bag No','Customer Name','Mobile','Deliver Date','Status'];
  columnheadDetails:any[] = ['Div','Stock Code','Description','Bag No','Remarks','Pcs','Rep type','Delivery']
  




  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private dataService: SuntechAPIService,
    private toastr: ToastrService,
    private commonService: CommonServiceService,
    private comService: CommonServiceService,
  ) { }
  repairtransferform: FormGroup = this.formBuilder.group({
    voctype: [''],
    vocNo: [''],
    vocdate: [''],
    salesman: [''],
    branchcode: [''],
    partycode: [''],
    partyname: [''],
    costcode: [''],
    lossaccount: [''],
    enteredby: [''],
    itemcurrency: [''],
    itemcurrencycc: [''],
    narration: [''],
    yearmonth: [''],
  });
  ngOnInit(): void {
   
  }

 

  close(data?: any) {
    //TODO reset forms and data before closing
    this.activeModal.close(data);
  }



  
  formSubmit() {
    if (this.content && this.content.FLAG == 'EDIT') {
      this.updaterepairtransfer()
      return
    }
    if (this.repairtransferform.invalid) {
      this.toastr.error('select all required fields')
      return
    }
    let API = 'RepairTransfer/InsertRepairTransfer'
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2024-03-07T12:58:54.746Z",
      "YEARMONTH": "string",
      "SALESPERSON_CODE": "string",
      "BRANCHTO": "string",
      "REMARKS": "string",
      "SYSTEM_DATE": "2024-03-07T12:58:54.746Z",
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
      "SUPINVDATE": "2024-03-07T12:58:54.746Z",
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
          if (result.status.trim() == "Success") {
            Swal.fire({
              title: result.message || 'Success',
              text: '',
              icon: 'success',
              confirmButtonColor: '#336699',
              confirmButtonText: 'Ok'
            }).then((result: any) => {
              if (result.value) {
                this.repairtransferform.reset()
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


  updaterepairtransfer() {
    if (this.repairtransferform.invalid) {
      this.toastr.error('select all required fields')
      return
    }
  
    let API ='RepairTransfer/UpdateRepairTransfer'+this.content.BRANCH_CODE+this.content.VOCTYPE+this.content.VOCNO+this.content.YEARMONTH
    let postData = {
      "MID": 0,
      "BRANCH_CODE": "string",
      "VOCTYPE": "str",
      "VOCNO": 0,
      "VOCDATE": "2024-03-07T13:09:28.415Z",
      "YEARMONTH": "string",
      "SALESPERSON_CODE": "string",
      "BRANCHTO": "string",
      "REMARKS": "string",
      "SYSTEM_DATE": "2024-03-07T13:09:28.415Z",
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
      "SUPINVDATE": "2024-03-07T13:09:28.415Z",
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
                this.repairtransferform.reset()
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

  deleterepairtransfer() {
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
        let API ='/RepairTransfer/DeleteRepairTransfer/'+this.repairtransferform.value.branchcode + this.repairtransferform.value.voctype + this.repairtransferform.value.vocno + this.repairtransferform.value.yearmonth
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
                    this.repairtransferform.reset()
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
                    this.repairtransferform.reset()
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

